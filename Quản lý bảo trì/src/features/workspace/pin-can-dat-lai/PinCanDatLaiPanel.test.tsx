import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinCanDatLaiPanel } from "./PinCanDatLaiPanel";
import type { PinCanDatLai } from "./pinCanDatLaiService";

const danhSach: PinCanDatLai[] = [
  {
    maTaiSan: "A-014",
    tenTaiSan: "Máy nén khí",
    duongDanKhuVuc: "Tòa A › Tầng 3 › Phòng 305",
    tenSoDo: "Phòng 305",
    maNut: "phong-305",
  },
  {
    maTaiSan: "A-031",
    tenTaiSan: "Tủ điện",
    duongDanKhuVuc: "Tòa A › Tầng 3 › Phòng 306",
    tenSoDo: "Phòng 306",
    maNut: "phong-306",
    dangKhoa: true,
  },
  {
    maTaiSan: "B-002",
    tenTaiSan: "Máy bơm",
    duongDanKhuVuc: "Tòa B › Tầng 1 › Kho",
    tenSoDo: "Kho B1",
    maNut: "kho-b1",
  },
];

describe("PinCanDatLaiPanel — S05", () => {
  it("TC-S05-01: panel liệt kê đúng 3 item, có mã+tên, đường dẫn, tên sơ đồ", () => {
    render(<PinCanDatLaiPanel danhSach={danhSach} onDatLai={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Danh sách pin cần đặt lại" })).toBeInTheDocument();
    const muc = screen.getAllByRole("listitem");
    expect(muc).toHaveLength(3);
    expect(muc[0]).toHaveTextContent("A-014 · Máy nén khí");
    expect(muc[0]).toHaveTextContent("Tòa A › Tầng 3 › Phòng 305");
    expect(muc[0]).toHaveTextContent("Phòng 305");
  });

  it("TC-S05-02: bộ đếm hiển thị Tổng: 3, khớp số item", () => {
    render(<PinCanDatLaiPanel danhSach={danhSach} onDatLai={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByText("Tổng: 3")).toBeInTheDocument();
  });

  it("TC-S05-03/21: danh sách rỗng → Empty trấn an, không icon cảnh báo đỏ", () => {
    render(<PinCanDatLaiPanel danhSach={[]} onDatLai={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByText("Không có pin nào cần đặt lại vị trí")).toBeInTheDocument();
    expect(screen.getByText("Mọi pin đều nằm đúng trong vùng sơ đồ.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đóng" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("TC-S05-07: bấm [Đặt lại vị trí] A-014 → gọi onDatLai với đúng pin", async () => {
    const onDatLai = vi.fn();
    const user = userEvent.setup();
    render(<PinCanDatLaiPanel danhSach={danhSach} onDatLai={onDatLai} onDong={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Đặt lại vị trí A-014" }));
    expect(onDatLai).toHaveBeenCalledWith(expect.objectContaining({ maTaiSan: "A-014", tenSoDo: "Phòng 305" }));
  });

  it("TC-S05-08: pin A-031 đang khóa → nút vô hiệu + thông báo, không gọi onDatLai", async () => {
    const onDatLai = vi.fn();
    const user = userEvent.setup();
    render(<PinCanDatLaiPanel danhSach={danhSach} onDatLai={onDatLai} onDong={vi.fn()} />);
    const nut = screen.getByRole("button", { name: "Đặt lại vị trí A-031" });
    expect(nut).toBeDisabled();
    expect(
      screen.getByText("Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."),
    ).toBeInTheDocument();
    await user.click(nut);
    expect(onDatLai).not.toHaveBeenCalled();
  });

  it("TC-S05-22: panel không phụ thuộc vai trò — Giám sát cũng bấm đặt lại được", async () => {
    // API panel không nhận vai trò ⇒ cùng hành vi cho Quản trị & Giám sát.
    const onDatLai = vi.fn();
    const user = userEvent.setup();
    render(<PinCanDatLaiPanel danhSach={danhSach} onDatLai={onDatLai} onDong={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Đặt lại vị trí B-002" }));
    expect(onDatLai).toHaveBeenCalledWith(expect.objectContaining({ maTaiSan: "B-002" }));
  });

  it("TC-S05-04: lỗi tải → thông báo + Thử lại", async () => {
    const onThuLai = vi.fn();
    const user = userEvent.setup();
    render(
      <PinCanDatLaiPanel danhSach={[]} trangThaiTai="loi" onThuLai={onThuLai} onDatLai={vi.fn()} onDong={vi.fn()} />,
    );
    expect(screen.getByText("Không tải được danh sách pin cần đặt lại")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(onThuLai).toHaveBeenCalled();
  });

  it("TC-S05-20: item đang rời danh sách có class fade+collapse", () => {
    render(<PinCanDatLaiPanel danhSach={danhSach} dangRoi="A-014" onDatLai={vi.fn()} onDong={vi.fn()} />);
    const muc = screen.getAllByRole("listitem");
    expect(muc[0].className).toContain("dang-roi");
    expect(muc[1].className).not.toContain("dang-roi");
  });
});
