import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NhatKyPanel } from "./NhatKyPanel";
import type { BanGhiAudit } from "./auditService";

const rows: BanGhiAudit[] = [
  { thoiDiem: "2026-06-22T14:32:10", nguoi: "Nguyễn Văn A", hanhDong: "Di dời", doiTuong: "TS A-007 Máy nén", viTriCu: "P305", viTriMoi: "P410" },
  { thoiDiem: "2026-06-21T16:45:02", nguoi: "Nguyễn Văn A", hanhDong: "Xóa", doiTuong: 'Khu vực "P309"' },
  { thoiDiem: "2026-05-30T08:00:00", nguoi: "Trần Thị B", hanhDong: "Gán", doiTuong: "TS A-100" },
];

describe("NhatKyPanel — S07", () => {
  it("TC-S07-21: Giám sát → từ chối, không bảng", () => {
    render(<NhatKyPanel vaiTro="GiamSat" banGhi={rows} onDong={vi.fn()} />);
    expect(screen.getByText(/Bạn không có quyền xem nhật ký kiểm toán/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("TC-S07-01: Quản trị → bảng mới nhất trước + 5 cột", () => {
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    const body = screen.getAllByRole("row").slice(1); // bỏ header
    expect(body[0]).toHaveTextContent("22/06/2026 14:32");
    expect(screen.getByText("Hiển thị 1–3 / 3 bản ghi.")).toBeInTheDocument();
  });

  it("TC-S07-03: hành động Xóa → cột vị trí '—'", () => {
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    const rowXoa = screen.getByText('Khu vực "P309"').closest("tr")!;
    expect(within(rowXoa).getByText("—")).toBeInTheDocument();
  });

  it("TC-S07-04: lọc người Nguyễn Văn A", async () => {
    const user = userEvent.setup();
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText("Lọc người"), "Nguyễn Văn A");
    await user.click(screen.getByRole("button", { name: "Áp dụng lọc" }));
    expect(screen.getByText("Hiển thị 1–2 / 2 bản ghi.")).toBeInTheDocument();
  });

  it("TC-S07-13: AND giao rỗng (Trần Thị B + Xóa) → không có bản ghi phù hợp", async () => {
    const user = userEvent.setup();
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText("Lọc người"), "Trần Thị B");
    await user.selectOptions(screen.getByLabelText("Lọc hành động"), "Xóa");
    await user.click(screen.getByRole("button", { name: "Áp dụng lọc" }));
    expect(screen.getByText("Không có bản ghi phù hợp.")).toBeInTheDocument();
  });

  it("TC-S07-07: Từ > Đến → lỗi + nút Áp dụng disable", () => {
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Từ ngày"), { target: { value: "2026-06-22" } });
    fireEvent.change(screen.getByLabelText("Đến ngày"), { target: { value: "2026-06-01" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Từ ngày phải nhỏ hơn hoặc bằng Đến ngày.");
    expect(screen.getByRole("button", { name: "Áp dụng lọc" })).toBeDisabled();
  });

  it("TC-S07-15/17: 60 bản ghi → trang 1 = 1–25 / 60, có pager; ≤25 ẩn pager", () => {
    const many = Array.from({ length: 60 }, (_, i) => ({ ...rows[0], thoiDiem: `2026-06-22T14:00:${String(i % 60).padStart(2, "0")}` }));
    const { rerender } = render(<NhatKyPanel vaiTro="QuanTri" banGhi={many} onDong={vi.fn()} />);
    expect(screen.getByText("Hiển thị 1–25 / 60 bản ghi.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Phân trang" })).toBeInTheDocument();
    rerender(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    expect(screen.queryByRole("navigation", { name: "Phân trang" })).not.toBeInTheDocument();
  });

  it("TC-S07-18: đảo sắp xếp tăng dần", async () => {
    const user = userEvent.setup();
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /Thời điểm/ }));
    const body = screen.getAllByRole("row").slice(1);
    expect(body[0]).toHaveTextContent("30/05/2026");
  });

  it("TC-S07-20/24: nút quay lại gọi onDong", async () => {
    const user = userEvent.setup();
    const onDong = vi.fn();
    render(<NhatKyPanel vaiTro="QuanTri" banGhi={rows} onDong={onDong} />);
    await user.click(screen.getByRole("button", { name: "Quay lại Bản đồ tài sản" }));
    expect(onDong).toHaveBeenCalled();
  });
});
