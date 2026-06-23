import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LichSuPanel } from "./LichSuPanel";
import type { BanGhiLichSu } from "./lichSuService";

const bg: BanGhiLichSu[] = [
  { thoiDiem: "2026-01-02T08:00:00", nguoi: "Nguyễn Văn A", viTriCu: null, viTriMoi: "Tòa A › Tầng 2 › Kho", lyDo: "Gán lần đầu" },
  { thoiDiem: "2026-06-22T14:30:00", nguoi: "Nguyễn Văn A", viTriCu: "Phòng 305", viTriMoi: "Phòng 410", lyDo: "Chuyển dây chuyền" },
  { thoiDiem: "2026-03-10T09:05:00", nguoi: "Nguyễn Văn A", viTriCu: "Tầng 4", viTriMoi: "Phòng 305" },
];

describe("LichSuPanel — S06", () => {
  it("TC-S06-01: timeline 3 mục, mới nhất trên cùng", () => {
    render(<LichSuPanel maTaiSan="A-007" tenTaiSan="Máy nén khí" banGhi={bg} onDong={vi.fn()} />);
    const muc = screen.getAllByRole("listitem");
    expect(muc).toHaveLength(3);
    expect(muc[0]).toHaveTextContent("22/06/2026 14:30");
    expect(muc[2]).toHaveTextContent("02/01/2026 08:00");
  });

  it("TC-S06-03/04: (Không có lý do) + (Chưa có vị trí)", () => {
    render(<LichSuPanel maTaiSan="A-007" tenTaiSan="Máy nén khí" banGhi={bg} onDong={vi.fn()} />);
    expect(screen.getByText(/\(Không có lý do\)/)).toBeInTheDocument();
    expect(screen.getByText(/\(Chưa có vị trí\)/)).toBeInTheDocument();
  });

  it("TC-S06-23: tài sản chưa có lần di chuyển", () => {
    render(<LichSuPanel maTaiSan="A-045" tenTaiSan="Tủ điện" banGhi={[]} onDong={vi.fn()} />);
    expect(screen.getByText("Tài sản chưa có lần di chuyển nào.")).toBeInTheDocument();
  });

  it("TC-S06-09: lỗi tải → Thử lại", async () => {
    const onThuLai = vi.fn();
    const user = userEvent.setup();
    render(<LichSuPanel maTaiSan="A-007" tenTaiSan="Máy nén khí" banGhi={[]} trangThaiTai="loi" onThuLai={onThuLai} onDong={vi.fn()} />);
    expect(screen.getByText("Không tải được lịch sử.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(onThuLai).toHaveBeenCalled();
  });

  it("TC-S06-16/22: lọc khoảng không có bản ghi → rỗng-sau-lọc + Xóa lọc", async () => {
    const user = userEvent.setup();
    render(<LichSuPanel maTaiSan="A-007" tenTaiSan="Máy nén khí" banGhi={bg} onDong={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Từ ngày"), { target: { value: "2026-03-11" } });
    fireEvent.change(screen.getByLabelText("Đến ngày"), { target: { value: "2026-06-21" } });
    await user.click(screen.getByRole("button", { name: "Áp dụng" }));
    expect(screen.getByText("Không có lần di chuyển nào trong khoảng đã chọn.")).toBeInTheDocument();
  });

  it("TC-S06-20: Từ > Đến → lỗi inline, không lọc", async () => {
    const user = userEvent.setup();
    render(<LichSuPanel maTaiSan="A-007" tenTaiSan="Máy nén khí" banGhi={bg} onDong={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Từ ngày"), { target: { value: "2026-06-30" } });
    fireEvent.change(screen.getByLabelText("Đến ngày"), { target: { value: "2026-01-01" } });
    await user.click(screen.getByRole("button", { name: "Áp dụng" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Từ ngày không được sau Đến ngày.");
    expect(screen.getAllByRole("listitem")).toHaveLength(3); // không lọc
  });
});
