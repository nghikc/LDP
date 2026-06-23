import { describe, it, expect } from "vitest";
import type { ViTriPin } from "../types";
import {
  taiLenSoDo,
  thaySoDo,
  xoaSoDo,
  pinTranNgoai,
  trangThaiSoDo,
  duocQuanLySoDo,
  NHAN_HANH_DONG,
  type SoDoMatBang,
} from "./quanLySoDoService";

const NGUOI = "Quản trị (giangnb)";
const T = "2026-06-22T10:00:00Z";
const MB = 1024 * 1024;
const MA_NUT = "tang-3";

function pin(maTaiSan: string, x: number, y: number, maNut = MA_NUT): ViTriPin {
  return { maTaiSan, maNut, toaDoX: x, toaDoY: y, trangThai: "DaGanViTri" };
}

const soDoCu: SoDoMatBang = { tenFile: "so-do-tang-3.png", kichThuocByte: 2.4 * MB, rongPx: 1920, caoPx: 1080 };

describe("taiLenSoDo — tải lên (R-S03-01, BRule-S03-01)", () => {
  it("TC-S03-02: tải tang3.png 8 MB hợp lệ → gắn ảnh + audit Tải lên sơ đồ", () => {
    const kq = taiLenSoDo({
      soDoHienTai: undefined,
      file: { ten: "tang3.png", loai: "image/png", kichThuoc: 8 * MB },
      rongPx: 1920, caoPx: 1080, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(true);
    expect(kq.soDo?.tenFile).toBe("tang3.png");
    expect(kq.audit).toMatchObject({ nguoiThucHien: NGUOI, hanhDong: "tai-len-so-do", maNut: MA_NUT, thoiDiem: T });
  });

  it("TC-S03-04: file sai định dạng → chặn, không gắn ảnh", () => {
    const kq = taiLenSoDo({
      soDoHienTai: undefined,
      file: { ten: "tang3.gif", loai: "image/gif", kichThuoc: 2 * MB },
      rongPx: 100, caoPx: 100, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.");
    expect(kq.soDo).toBeUndefined();
  });

  it("TC-S03-03: nút đã có sơ đồ → chặn ảnh thứ hai (tối đa 1/nút)", () => {
    const kq = taiLenSoDo({
      soDoHienTai: soDoCu,
      file: { ten: "tang3.png", loai: "image/png", kichThuoc: 8 * MB },
      rongPx: 1920, caoPx: 1080, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(false);
    expect(kq.soDo).toBeUndefined();
  });

  it("TC-S03-23: nhãn hành động tải lên = 'Tải lên sơ đồ'", () => {
    expect(NHAN_HANH_DONG["tai-len-so-do"]).toBe("Tải lên sơ đồ");
  });
});

describe("pinTranNgoai — phát hiện pin ngoài vùng [0,100] (BRule-S03-04)", () => {
  it("trong vùng (95,92) → không tràn", () => {
    expect(pinTranNgoai(pin("A-014", 95, 92))).toBe(false);
  });
  it("ngoài vùng (105,92) → tràn", () => {
    expect(pinTranNgoai(pin("A-014", 105, 92))).toBe(true);
  });
  it("âm (-1,40) → tràn", () => {
    expect(pinTranNgoai(pin("A-001", -1, 40))).toBe(true);
  });
});

describe("thaySoDo — thay ảnh giữ tọa độ % + pin tràn → cần đặt lại (R-S03-04/05)", () => {
  const pins12 = Array.from({ length: 12 }, (_, i) => pin(`A-0${String(i + 1).padStart(2, "0")}`, 10 + i, 20 + i));

  it("TC-S03-11: thay ảnh giữ đúng tọa độ % pin A-001 (30%,40%) + audit Thay ảnh", () => {
    const pins = [pin("A-001", 30, 40), pin("A-002", 50, 50)];
    const kq = thaySoDo({
      soDoHienTai: soDoCu, pins,
      file: { ten: "tang3-v2.png", loai: "image/png", kichThuoc: 6 * MB },
      rongPx: 1920, caoPx: 1080, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(true);
    const a1 = kq.pins!.find((p) => p.maTaiSan === "A-001")!;
    expect([a1.toaDoX, a1.toaDoY]).toEqual([30, 40]);
    expect(a1.trangThai).toBe("DaGanViTri");
    expect(kq.pinCanDatLai).toEqual([]);
    expect(kq.audit).toMatchObject({ hanhDong: "thay-so-do", maNut: MA_NUT });
  });

  it("TC-S03-13: ảnh nhỏ hơn → 3 pin (A-012/013/014) tràn → CanDatLai", () => {
    const pins = [
      pin("A-001", 30, 40),
      pin("A-012", 102, 50),
      pin("A-013", 50, 110),
      pin("A-014", 95, 92), // tràn vì ảnh mới làm tọa độ vượt — mô phỏng bằng tọa độ ngoài
    ];
    // mô phỏng pin A-014 tràn: tọa độ ngoài vùng
    pins[3] = pin("A-014", 101, 92);
    const kq = thaySoDo({
      soDoHienTai: soDoCu, pins,
      file: { ten: "tang3-nho.png", loai: "image/png", kichThuoc: 4 * MB },
      rongPx: 1280, caoPx: 720, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(true);
    expect(kq.pinCanDatLai!.sort()).toEqual(["A-012", "A-013", "A-014"]);
    kq.pinCanDatLai!.forEach((m) => {
      expect(kq.pins!.find((p) => p.maTaiSan === m)!.trangThai).toBe("CanDatLai");
    });
    expect(kq.pins!.find((p) => p.maTaiSan === "A-001")!.trangThai).toBe("DaGanViTri");
  });

  it("TC-S03-15: ảnh cùng tỉ lệ, mọi pin trong vùng → không pin nào cần đặt lại", () => {
    const kq = thaySoDo({
      soDoHienTai: soDoCu, pins: pins12,
      file: { ten: "tang3-v2.png", loai: "image/png", kichThuoc: 6 * MB },
      rongPx: 1920, caoPx: 1080, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(true);
    expect(kq.pinCanDatLai).toEqual([]);
    expect(kq.pins!.every((p) => p.trangThai === "DaGanViTri")).toBe(true);
  });

  it("TC-S03-12: thay bằng file sai định dạng → chặn, ảnh cũ giữ nguyên", () => {
    const pins = [pin("A-001", 30, 40)];
    const kq = thaySoDo({
      soDoHienTai: soDoCu, pins,
      file: { ten: "tang3.gif", loai: "image/gif", kichThuoc: 2 * MB },
      rongPx: 100, caoPx: 100, maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.");
    expect(kq.soDo).toBeUndefined();
    expect(kq.pins).toBeUndefined();
  });

  it("TC-S03-24: nhãn hành động thay = 'Thay ảnh sơ đồ'", () => {
    expect(NHAN_HANH_DONG["thay-so-do"]).toBe("Thay ảnh sơ đồ");
  });
});

describe("xoaSoDo — xóa ảnh + gỡ vị trí giữ hồ sơ (R-S03-06, BRule-S03-05)", () => {
  const pins12 = Array.from({ length: 12 }, (_, i) => pin(`A-1${String(i).padStart(2, "0")}`, 10, 10));
  const pinKhac = pin("Z-001", 10, 10, "tang-4");

  it("TC-S03-17: xóa → gỡ 12 pin của nút, pin nút khác giữ nguyên, audit ghi gỡ vị trí 12 tài sản", () => {
    const kq = xoaSoDo({ pins: [...pins12, pinKhac], maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T });
    expect(kq.ok).toBe(true);
    expect(kq.soDo).toBeUndefined();
    expect(kq.taiSanGoViTri).toHaveLength(12);
    expect(kq.pins.some((p) => p.maNut === MA_NUT)).toBe(false);
    expect(kq.pins.find((p) => p.maTaiSan === "Z-001")).toBeTruthy();
    expect(kq.audit).toMatchObject({ hanhDong: "xoa-so-do", maNut: MA_NUT, ghiChu: "gỡ vị trí 12 tài sản" });
  });

  it("TC-S03-18: nút 0 pin → xóa trực tiếp, không gỡ tài sản nào", () => {
    const kq = xoaSoDo({ pins: [pinKhac], maNut: MA_NUT, nguoi: NGUOI, thoiDiem: T });
    expect(kq.ok).toBe(true);
    expect(kq.taiSanGoViTri).toEqual([]);
  });

  it("TC-S03-25: nhãn hành động xóa = 'Xóa ảnh sơ đồ'", () => {
    expect(NHAN_HANH_DONG["xoa-so-do"]).toBe("Xóa ảnh sơ đồ");
  });
});

describe("trangThaiSoDo — chuỗi trạng thái nút (ST, srs Luồng 4)", () => {
  it("không ảnh → ChuaCoSoDo", () => {
    expect(trangThaiSoDo(undefined, [])).toBe("ChuaCoSoDo");
  });
  it("có ảnh, pin bình thường → DaCoSoDo", () => {
    expect(trangThaiSoDo(soDoCu, [pin("A-001", 30, 40)])).toBe("DaCoSoDo");
  });
  it("có ảnh + pin CanDatLai → CoPinCanDatLai", () => {
    const p: ViTriPin = { ...pin("A-014", 95, 92), trangThai: "CanDatLai" };
    expect(trangThaiSoDo(soDoCu, [p])).toBe("CoPinCanDatLai");
  });
});

describe("duocQuanLySoDo — phân quyền (BRule-S03-06)", () => {
  it("Quản trị được phép", () => {
    expect(duocQuanLySoDo("QuanTri")).toBe(true);
  });
  it("Giám sát không được phép (không lối vào)", () => {
    expect(duocQuanLySoDo("GiamSat")).toBe(false);
  });
});
