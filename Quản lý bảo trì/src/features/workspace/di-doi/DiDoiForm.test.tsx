import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DiDoiForm } from "./DiDoiForm";
import type { NutKhuVuc, TaiSan, ViTriPin } from "../types";

const nodes: NutKhuVuc[] = [
  { maNut: "phong-305", tenKhuVuc: "Phòng 305", nutCha: null },
  { maNut: "phong-306", tenKhuVuc: "Phòng 306", nutCha: null },
  { maNut: "kho-b01", tenKhuVuc: "Kho B-01", nutCha: null },
  { maNut: "phong-309", tenKhuVuc: "Phòng 309", nutCha: null },
];
const taiSan: TaiSan[] = [
  { maTaiSan: "A-007", ten: "Máy nén khí", trangThai: "x" },
  { maTaiSan: "A-009", ten: "Băng tải", trangThai: "x" },
  { maTaiSan: "A-014", ten: "Quạt", trangThai: "x" },
  { maTaiSan: "A-021", ten: "Máy bơm", trangThai: "x" },
  { maTaiSan: "A-100", ten: "Chưa đặt", trangThai: "x" }, // chưa có pin
];
function pin(m: string, n: string, khoa = false): ViTriPin {
  return { maTaiSan: m, maNut: n, toaDoX: 5, toaDoY: 5, trangThai: khoa ? "DangKhoa" : "DaGanViTri" };
}
const pins: ViTriPin[] = [
  pin("A-007", "phong-305"),
  pin("A-009", "phong-305"),
  pin("A-014", "phong-306"),
  pin("A-021", "phong-305", true),
];

const base = { nodes, taiSan, pins, nguoi: "Nguyễn B" };

describe("DiDoiForm — đơn (F12)", () => {
  it("TC-S04-01: đơn chọn sẵn, ẩn bộ chọn nguồn, chọn đích → Di dời (1)", async () => {
    const user = userEvent.setup();
    const onXong = vi.fn();
    render(<DiDoiForm {...base} taiSanDon="A-007" onXong={onXong} onDong={vi.fn()} />);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(screen.getByText("1 tài sản đã chọn")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Khu vực đích *"), "kho-b01");
    await user.click(screen.getByRole("button", { name: "Di dời (1)" }));
    expect(onXong).toHaveBeenCalledWith(expect.objectContaining({ ok: true, soLuong: 1 }));
  });

  it("TC-S04-02: chưa chọn đích → nút Di dời tắt", () => {
    render(<DiDoiForm {...base} taiSanDon="A-007" onXong={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Di dời (1)" })).toBeDisabled();
  });
});

describe("DiDoiForm — hàng loạt chọn lẻ (F13)", () => {
  it("TC-S04-04/11: tick 3 tài sản + đích → Di dời (3), cùng đích", async () => {
    const user = userEvent.setup();
    const onXong = vi.fn();
    render(<DiDoiForm {...base} onXong={onXong} onDong={vi.fn()} />);
    await user.click(screen.getByLabelText(/A-007 · Máy nén khí/));
    await user.click(screen.getByLabelText(/A-009 · Băng tải/));
    await user.click(screen.getByLabelText(/A-014 · Quạt/));
    expect(screen.getByText("3 tài sản đã chọn")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Khu vực đích *"), "kho-b01");
    await user.click(screen.getByRole("button", { name: "Di dời (3)" }));
    const kq = onXong.mock.calls[0][0];
    expect(kq.ok).toBe(true);
    expect(kq.pins.filter((p: ViTriPin) => p.maNut === "kho-b01")).toHaveLength(3);
  });

  it("TC-S04-05: chưa tick → nút tắt + gợi ý", () => {
    render(<DiDoiForm {...base} onXong={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Di dời (0)" })).toBeDisabled();
    expect(screen.getByText("Chọn ít nhất một tài sản để di dời.")).toBeInTheDocument();
  });

  it("TC-S04-06: tài sản chưa có vị trí (A-100) không xuất hiện", () => {
    render(<DiDoiForm {...base} onXong={vi.fn()} onDong={vi.fn()} />);
    const ds = screen.getByRole("listbox", { name: "Tài sản đã có vị trí" });
    expect(within(ds).queryByText(/A-100/)).not.toBeInTheDocument();
  });

  it("TC-S04-19: tài sản bị khóa (A-021) → checkbox vô hiệu + nhãn khóa", () => {
    render(<DiDoiForm {...base} taiSanDangKhoa={new Set(["A-021"])} onXong={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByLabelText(/A-021/)).toBeDisabled();
    expect(screen.getByText(/đang được người khác chỉnh sửa/)).toBeInTheDocument();
  });
});

describe("DiDoiForm — chọn cả vị trí cũ (F13)", () => {
  it("TC-S04-07: chọn nguồn Phòng 305 → lấy hết 2 tài sản", async () => {
    const user = userEvent.setup();
    render(<DiDoiForm {...base} onXong={vi.fn()} onDong={vi.fn()} />);
    await user.click(screen.getByLabelText("Chọn cả vị trí cũ (lấy hết)"));
    await user.selectOptions(screen.getByLabelText("Vị trí nguồn"), "phong-305");
    expect(screen.getByText("3 tài sản đã chọn")).toBeInTheDocument(); // A-007, A-009, A-021 đều ở Phòng 305
  });

  it("TC-S04-08: nguồn rỗng (Phòng 309) → báo không có tài sản", async () => {
    const user = userEvent.setup();
    render(<DiDoiForm {...base} onXong={vi.fn()} onDong={vi.fn()} />);
    await user.click(screen.getByLabelText("Chọn cả vị trí cũ (lấy hết)"));
    await user.selectOptions(screen.getByLabelText("Vị trí nguồn"), "phong-309");
    expect(screen.getByText("Vị trí này không có tài sản để di dời.")).toBeInTheDocument();
  });
});

describe("DiDoiForm — khóa & lý do", () => {
  it("TC-S04-20/21: lô có khóa → dialog bỏ qua; Tiếp tục di dời phần còn lại", async () => {
    const user = userEvent.setup();
    const onXong = vi.fn();
    render(<DiDoiForm {...base} taiSanDangKhoa={new Set(["A-021"])} onXong={onXong} onDong={vi.fn()} />);
    // chọn lẻ A-007, A-009; A-021 khóa không tick được — ép lô qua "cả vị trí cũ" Phòng 305 (gồm A-007/A-009/A-021)
    await user.click(screen.getByLabelText("Chọn cả vị trí cũ (lấy hết)"));
    await user.selectOptions(screen.getByLabelText("Vị trí nguồn"), "phong-305");
    await user.selectOptions(screen.getByLabelText("Khu vực đích *"), "kho-b01");
    await user.click(screen.getByRole("button", { name: /Di dời/ }));
    expect(screen.getByRole("dialog", { name: "Tài sản bị khóa" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Tiếp tục" }));
    expect(onXong).toHaveBeenCalledWith(expect.objectContaining({ ok: true, soLuong: 2 }));
  });

  it("TC-S04-21: dialog khóa → Hủy → hủy toàn lô, không di dời", async () => {
    const user = userEvent.setup();
    const onXong = vi.fn();
    const onDong = vi.fn();
    render(<DiDoiForm {...base} taiSanDangKhoa={new Set(["A-021"])} onXong={onXong} onDong={onDong} />);
    await user.click(screen.getByLabelText("Chọn cả vị trí cũ (lấy hết)"));
    await user.selectOptions(screen.getByLabelText("Vị trí nguồn"), "phong-305");
    await user.selectOptions(screen.getByLabelText("Khu vực đích *"), "kho-b01");
    await user.click(screen.getByRole("button", { name: /Di dời/ }));
    await user.click(within(screen.getByRole("dialog", { name: "Tài sản bị khóa" })).getByRole("button", { name: "Hủy" }));
    expect(onXong).not.toHaveBeenCalled();
    expect(onDong).toHaveBeenCalled();
  });

  it("TC-S04-13: lý do trống vẫn di dời được", async () => {
    const user = userEvent.setup();
    const onXong = vi.fn();
    render(<DiDoiForm {...base} taiSanDon="A-007" onXong={onXong} onDong={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText("Khu vực đích *"), "kho-b01");
    await user.click(screen.getByRole("button", { name: "Di dời (1)" }));
    expect(onXong.mock.calls[0][0].lichSu[0].lyDo).toBeUndefined();
  });

  it("TC-S04-15: ô lý do giới hạn 500 ký tự (maxLength)", () => {
    render(<DiDoiForm {...base} taiSanDon="A-007" onXong={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByLabelText("Lý do di dời")).toHaveAttribute("maxLength", "500");
  });
});
