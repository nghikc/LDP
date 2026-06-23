import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Workspace } from "./Workspace";

beforeEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    x: 0, y: 0, left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, toJSON: () => ({}),
  })) as unknown as typeof Element.prototype.getBoundingClientRect;
});

async function moPhong305(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
  await user.click(screen.getByRole("button", { name: "Mở Tầng 3" }));
  await user.click(screen.getByRole("button", { name: "Phòng 305" }));
}

describe("Tích hợp S01 ↔ vệ tinh", () => {
  it("S02: '+ Thêm khu vực' mở form Thêm; lưu → toast", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "+ Thêm khu vực" }));
    expect(screen.getByRole("dialog", { name: "Thêm khu vực" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Tên khu vực *"), "Phòng 999");
    await user.click(screen.getByRole("button", { name: "Lưu" }));
    expect(screen.getByRole("status")).toHaveTextContent("Đã thêm khu vực.");
  });

  it("S02: menu 'Sửa' mở form Sửa nạp dữ liệu nút", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    await user.click(screen.getByRole("button", { name: "Menu Tầng 3" }));
    await user.click(screen.getByRole("menuitem", { name: "Sửa" }));
    expect(screen.getByRole("dialog", { name: "Sửa khu vực" })).toBeInTheDocument();
    expect(screen.getByLabelText("Tên khu vực *")).toHaveValue("Tầng 3");
  });

  it("S03: menu 'Quản lý ảnh sơ đồ' mở modal sơ đồ", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    await user.click(screen.getByRole("button", { name: "Mở Tầng 3" }));
    await user.click(screen.getByRole("button", { name: "Menu Phòng 305" }));
    await user.click(screen.getByRole("menuitem", { name: "Quản lý ảnh sơ đồ" }));
    expect(screen.getByRole("dialog", { name: "Quản lý ảnh sơ đồ mặt bằng" })).toBeInTheDocument();
  });

  it("S04: popup pin → 'Di dời' mở form di dời đơn (1 tài sản)", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moPhong305(user);
    await user.click(screen.getByRole("button", { name: "Tài sản A-007" }));
    await user.click(screen.getByRole("button", { name: "Di dời" }));
    expect(screen.getByRole("dialog", { name: "Di dời tài sản" })).toBeInTheDocument();
    expect(screen.getByText("1 tài sản đã chọn")).toBeInTheDocument();
  });

  it("S04: 'Di dời hàng loạt' từ thanh công cụ mở form", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moPhong305(user);
    await user.click(screen.getByRole("button", { name: "Di dời hàng loạt" }));
    expect(screen.getByRole("dialog", { name: "Di dời tài sản" })).toBeInTheDocument();
  });

  it("S06: popup pin → 'Xem lịch sử' mở panel đúng tài sản", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moPhong305(user);
    await user.click(screen.getByRole("button", { name: "Tài sản A-007" }));
    await user.click(screen.getByRole("button", { name: "Xem lịch sử" }));
    const panel = screen.getByRole("dialog", { name: "Lịch sử di chuyển" });
    expect(panel).toHaveTextContent("A-007 · Máy nén khí");
  });

  it("S07: 'Nhật ký kiểm toán' (Quản trị) mở panel; Giám sát không thấy nút", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Nhật ký kiểm toán" }));
    expect(screen.getByRole("dialog", { name: "Nhật ký kiểm toán" })).toBeInTheDocument();
    unmount();
    render(<Workspace vaiTro="GiamSat" />);
    expect(screen.queryByRole("button", { name: "Nhật ký kiểm toán" })).not.toBeInTheDocument();
  });

  it("S08: 'Xuất báo cáo' mở modal xuất", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moPhong305(user);
    await user.click(screen.getByRole("button", { name: "Xuất báo cáo" }));
    expect(screen.getByRole("dialog", { name: "Xuất báo cáo / kiểm kê" })).toBeInTheDocument();
  });

  it("E2E: di dời A-007 → lịch sử ghi nhận bản ghi mới", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moPhong305(user);
    // di dời A-007 sang Tầng 4
    await user.click(screen.getByRole("button", { name: "Tài sản A-007" }));
    await user.click(screen.getByRole("button", { name: "Di dời" }));
    await user.selectOptions(screen.getByLabelText("Khu vực đích *"), "tang-4");
    await user.click(screen.getByRole("button", { name: "Di dời (1)" }));
    expect(screen.getByRole("status")).toHaveTextContent("Đã di dời 1 tài sản.");
    // A-007 giờ ở Tầng 4 → chọn Tầng 4, mở lịch sử pin → có bản ghi tới Tầng 4
    await user.click(screen.getByRole("button", { name: "Tầng 4" }));
    await user.click(screen.getByRole("button", { name: "Tài sản A-007" }));
    await user.click(screen.getByRole("button", { name: "Xem lịch sử" }));
    expect(screen.getByRole("dialog", { name: "Lịch sử di chuyển" })).toHaveTextContent("Tầng 4");
  });
});
