import { describe, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuanLySoDoModal } from "./QuanLySoDoModal";
import type { NutKhuVuc, ViTriPin } from "../types";
import type { SoDoMatBang } from "./quanLySoDoService";

const MB = 1024 * 1024;

const nodes: NutKhuVuc[] = [
  { maNut: "toa-a", tenKhuVuc: "Tòa A", nutCha: null },
  { maNut: "tang-3", tenKhuVuc: "Tầng 3", nutCha: "toa-a" },
];

const soDoCu: SoDoMatBang = { tenFile: "so-do-tang-3.png", kichThuocByte: 2.4 * MB, rongPx: 1920, caoPx: 1080 };

function fakeFile(ten: string, loai: string, mb: number): File {
  const f = new File(["x"], ten, { type: loai });
  Object.defineProperty(f, "size", { value: Math.round(mb * MB) });
  return f;
}

function pin(maTaiSan: string, x: number, y: number, maNut = "tang-3"): ViTriPin {
  return { maTaiSan, maNut, toaDoX: x, toaDoY: y, trangThai: "DaGanViTri" };
}

const base = {
  nodes, maNut: "tang-3", nguoi: "Quản trị (giangnb)",
  onTaiLen: vi.fn(), onThay: vi.fn(), onXoa: vi.fn(), onDatLaiNgay: vi.fn(), onDong: vi.fn(),
};

describe("QuanLySoDoModal — trạng thái nút (TC-S03-01/03/19)", () => {
  it("TC-S03-01: nút chưa có sơ đồ → dropzone + hướng dẫn; ẩn Thay/Xóa", () => {
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} />);
    expect(screen.getByText(/PNG hoặc JPG, tối đa 10 MB, 1 ảnh mỗi khu vực/)).toBeInTheDocument();
    expect(screen.getByText("Tòa A › Tầng 3")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Xóa ảnh" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Chọn ảnh mới để thay")).not.toBeInTheDocument();
  });

  it("TC-S03-03: nút đã có sơ đồ → ẩn dropzone, chỉ preview + Thay/Xóa", () => {
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={[pin("A-001", 30, 40)]} />);
    expect(screen.queryByText(/1 ảnh mỗi khu vực/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Chọn ảnh mới để thay")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xóa ảnh" })).toBeInTheDocument();
  });

  it("TC-S03-19: xem trước + metadata tên/dung lượng/kích thước + N pin", () => {
    const pins = Array.from({ length: 12 }, (_, i) => pin(`A-0${i}`, 10, 10));
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={pins} />);
    expect(screen.getByText("so-do-tang-3.png", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/2\.4 MB · 1920×1080/)).toBeInTheDocument();
    expect(screen.getByText("12 pin đang đặt trên sơ đồ này")).toBeInTheDocument();
  });
});

describe("QuanLySoDoModal — tải lên (TC-S03-02/04/06/07/08)", () => {
  function thaFile(file: File) {
    const input = screen.getByLabelText("Chọn ảnh sơ đồ để tải lên");
    fireEvent.change(input, { target: { files: [file] } });
  }

  it("TC-S03-02: tải tang3.png 8 MB hợp lệ → onTaiLen ok", () => {
    const onTaiLen = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} onTaiLen={onTaiLen} />);
    thaFile(fakeFile("tang3.png", "image/png", 8));
    expect(onTaiLen).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    expect(onTaiLen.mock.calls[0][0].soDo.tenFile).toBe("tang3.png");
  });

  it("TC-S03-04: .gif sai định dạng → lỗi inline, không tải lên", () => {
    const onTaiLen = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} onTaiLen={onTaiLen} />);
    thaFile(fakeFile("tang3.gif", "image/gif", 2));
    expect(screen.getByRole("alert")).toHaveTextContent("Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.");
    expect(onTaiLen).not.toHaveBeenCalled();
  });

  it("TC-S03-06: PNG đúng 10 MB → hợp lệ, tải lên", () => {
    const onTaiLen = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} onTaiLen={onTaiLen} />);
    const f = new File(["x"], "tang3.png", { type: "image/png" });
    Object.defineProperty(f, "size", { value: 10485760 });
    thaFile(f);
    expect(onTaiLen).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  it("TC-S03-07: PNG 11 MB → lỗi, không tải lên", () => {
    const onTaiLen = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} onTaiLen={onTaiLen} />);
    const f = new File(["x"], "tang3.png", { type: "image/png" });
    Object.defineProperty(f, "size", { value: 11534336 });
    thaFile(f);
    expect(screen.getByRole("alert")).toHaveTextContent("Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.");
    expect(onTaiLen).not.toHaveBeenCalled();
  });

  it("TC-S03-08: JPG 3.5 MB → tải lên thành công", () => {
    const onTaiLen = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} onTaiLen={onTaiLen} />);
    thaFile(fakeFile("tang3.jpg", "image/jpeg", 3.5));
    expect(onTaiLen).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });
});

describe("QuanLySoDoModal — thay ảnh (TC-S03-09/10/12/13/15)", () => {
  function chonThay(file: File) {
    fireEvent.change(screen.getByLabelText("Chọn ảnh mới để thay"), { target: { files: [file] } });
  }
  const pins12 = Array.from({ length: 12 }, (_, i) => pin(`A-0${String(i + 1).padStart(2, "0")}`, 10 + i, 20 + i));

  it("TC-S03-09: còn 12 pin → hiện dialog cảnh báo giữ tọa độ", () => {
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={pins12} />);
    chonThay(fakeFile("tang3-v2.png", "image/png", 6));
    const dialog = screen.getByRole("dialog", { name: "Xác nhận thay ảnh" });
    expect(within(dialog).getByText(/Sơ đồ này đang có 12 pin/)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Tiếp tục thay" })).toBeInTheDocument();
  });

  it("TC-S03-10: 0 pin → bỏ qua dialog, thay trực tiếp", () => {
    const onThay = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={[]} onThay={onThay} />);
    chonThay(fakeFile("tang3-v2.png", "image/png", 6));
    expect(screen.queryByRole("dialog", { name: "Xác nhận thay ảnh" })).not.toBeInTheDocument();
    expect(onThay).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  it("TC-S03-12: thay file sai định dạng → lỗi, ảnh cũ giữ nguyên, không gọi onThay", () => {
    const onThay = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={[]} onThay={onThay} />);
    chonThay(fakeFile("tang3.gif", "image/gif", 2));
    expect(screen.getByRole("alert")).toHaveTextContent("Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.");
    expect(onThay).not.toHaveBeenCalled();
  });

  it("TC-S03-13: ảnh nhỏ → 3 pin tràn → banner + nút Đặt lại ngay → onDatLaiNgay", async () => {
    const user = userEvent.setup();
    const onDatLaiNgay = vi.fn();
    const pins = [
      pin("A-001", 30, 40),
      pin("A-012", 102, 50),
      pin("A-013", 50, 110),
      pin("A-014", 101, 92),
    ];
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={pins} onDatLaiNgay={onDatLaiNgay} />);
    fireEvent.change(screen.getByLabelText("Chọn ảnh mới để thay"), {
      target: { files: [fakeFile("tang3-nho.png", "image/png", 4)] },
    });
    await user.click(screen.getByRole("button", { name: "Tiếp tục thay" }));
    expect(screen.getByText(/3 pin nằm ngoài vùng ảnh mới/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Đặt lại ngay" }));
    expect(onDatLaiNgay).toHaveBeenCalled();
  });

  it("TC-S03-15: ảnh cùng tỉ lệ, không pin tràn → thay xong không banner", async () => {
    const user = userEvent.setup();
    const onThay = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={pins12} onThay={onThay} />);
    fireEvent.change(screen.getByLabelText("Chọn ảnh mới để thay"), {
      target: { files: [fakeFile("tang3-v2.png", "image/png", 6)] },
    });
    await user.click(screen.getByRole("button", { name: "Tiếp tục thay" }));
    expect(onThay).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    expect(onThay.mock.calls[0][0].pinCanDatLai).toEqual([]);
    expect(screen.queryByText(/nằm ngoài vùng ảnh mới/)).not.toBeInTheDocument();
  });
});

describe("QuanLySoDoModal — xóa ảnh (TC-S03-16/17/18)", () => {
  const pins12 = Array.from({ length: 12 }, (_, i) => pin(`A-1${String(i).padStart(2, "0")}`, 10, 10));

  it("TC-S03-16: còn 12 pin → dialog ghi gỡ vị trí 12 tài sản", async () => {
    const user = userEvent.setup();
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={pins12} />);
    await user.click(screen.getByRole("button", { name: "Xóa ảnh" }));
    const dialog = screen.getByRole("dialog", { name: "Xác nhận xóa ảnh" });
    expect(within(dialog).getByText(/gỡ vị trí của 12 tài sản/)).toBeInTheDocument();
  });

  it("TC-S03-17: xác nhận xóa → onXoa gỡ 12 pin, giữ hồ sơ", async () => {
    const user = userEvent.setup();
    const onXoa = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={pins12} onXoa={onXoa} />);
    await user.click(screen.getByRole("button", { name: "Xóa ảnh" }));
    await user.click(within(screen.getByRole("dialog", { name: "Xác nhận xóa ảnh" })).getByRole("button", { name: "Xóa ảnh" }));
    expect(onXoa).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    expect(onXoa.mock.calls[0][0].taiSanGoViTri).toHaveLength(12);
  });

  it("TC-S03-18: 0 pin → xóa trực tiếp, không dialog", async () => {
    const user = userEvent.setup();
    const onXoa = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={soDoCu} pins={[]} onXoa={onXoa} />);
    await user.click(screen.getByRole("button", { name: "Xóa ảnh" }));
    expect(screen.queryByRole("dialog", { name: "Xác nhận xóa ảnh" })).not.toBeInTheDocument();
    expect(onXoa).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });
});

describe("QuanLySoDoModal — đóng modal (TC-S03-21)", () => {
  it("TC-S03-21: bấm ✕ → onDong, không gắn ảnh dang dở", async () => {
    const user = userEvent.setup();
    const onDong = vi.fn();
    const onTaiLen = vi.fn();
    render(<QuanLySoDoModal {...base} soDo={undefined} pins={[]} onDong={onDong} onTaiLen={onTaiLen} />);
    await user.click(screen.getByRole("button", { name: "Đóng" }));
    expect(onDong).toHaveBeenCalled();
    expect(onTaiLen).not.toHaveBeenCalled();
  });
});
