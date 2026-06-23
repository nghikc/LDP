import { describe, it, expect } from "vitest";
import {
  locPinCanDatLai,
  nhanBoDem,
  datLaiToaDo,
  goKhoiDanhSach,
  taoKiemToanDatLai,
  THONG_BAO_NGOAI_VUNG,
  THONG_BAO_KHOA,
  type PinCanDatLai,
} from "./pinCanDatLaiService";
import type { ViTriPin } from "../types";

const pins: ViTriPin[] = [
  { maTaiSan: "A-014", maNut: "phong-305", toaDoX: 105, toaDoY: 40, trangThai: "CanDatLai" },
  { maTaiSan: "A-031", maNut: "phong-306", toaDoX: 110, toaDoY: 20, trangThai: "CanDatLai" },
  { maTaiSan: "B-002", maNut: "kho-b1", toaDoX: -5, toaDoY: 50, trangThai: "CanDatLai" },
  { maTaiSan: "A-007", maNut: "phong-305", toaDoX: 40, toaDoY: 40, trangThai: "DaGanViTri" },
];

describe("pinCanDatLaiService — lọc & bộ đếm (F15)", () => {
  it("chỉ giữ pin trạng thái CanDatLai (3 pin), ẩn A-007 DaGanViTri", () => {
    const ds = locPinCanDatLai(pins).map((p) => p.maTaiSan);
    expect(ds).toEqual(["A-014", "A-031", "B-002"]);
    expect(ds).not.toContain("A-007");
  });

  it("TC-S05-02: bộ đếm khớp số item — Tổng: 3", () => {
    expect(nhanBoDem(locPinCanDatLai(pins).length)).toBe("Tổng: 3");
  });
});

describe("pinCanDatLaiService — đặt lại tọa độ & validation vùng (F15)", () => {
  const pin = { maTaiSan: "A-014", maNut: "phong-305" };

  it("TC-S05-11: tọa độ hợp lệ (40,60) → lưu, chuyển CanDatLai → DaGanViTri", () => {
    const kq = datLaiToaDo(pin, 40, 60);
    expect(kq.ok).toBe(true);
    expect(kq.pin).toMatchObject({ maTaiSan: "A-014", toaDoX: 40, toaDoY: 60, trangThai: "DaGanViTri" });
  });

  it("TC-S05-12: biên dưới (0,0) hợp lệ", () => {
    expect(datLaiToaDo(pin, 0, 0).ok).toBe(true);
  });

  it("TC-S05-13: biên trên (100,100) hợp lệ", () => {
    expect(datLaiToaDo(pin, 100, 100).ok).toBe(true);
  });

  it("TC-S05-14: ngoài vùng (105,40) → chặn, không lưu", () => {
    const kq = datLaiToaDo(pin, 105, 40);
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe(THONG_BAO_NGOAI_VUNG);
    expect(kq.pin).toBeUndefined();
  });

  it("TC-S05-15: tọa độ âm (-3,50) → chặn", () => {
    expect(datLaiToaDo(pin, -3, 50).loi).toBe(THONG_BAO_NGOAI_VUNG);
  });

  it("TC-S05-16: sát ngoài biên (100.5,50) → chặn", () => {
    expect(datLaiToaDo(pin, 100.5, 50).loi).toBe(THONG_BAO_NGOAI_VUNG);
  });

  it("TC-S05-17: sau khi bị chặn, danh sách & bộ đếm giữ nguyên (pin vẫn CanDatLai)", () => {
    const kq = datLaiToaDo(pin, 105, 40);
    const ds = kq.ok ? goKhoiDanhSach(locPinCanDatLai(pins), pin.maTaiSan) : locPinCanDatLai(pins);
    expect(ds).toHaveLength(3);
    expect(nhanBoDem(ds.length)).toBe("Tổng: 3");
  });

  it("TC-S05-08: pin đang khóa → chặn đặt lại + wording", () => {
    const kq = datLaiToaDo(pin, 40, 60, true);
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe(THONG_BAO_KHOA);
  });
});

describe("pinCanDatLaiService — pin rời danh sách & bộ đếm (F15)", () => {
  it("TC-S05-20: đặt lại xong A-014 → rời danh sách, Tổng: 2", () => {
    const ds = goKhoiDanhSach(locPinCanDatLai(pins), "A-014").map((p) => p.maTaiSan);
    expect(ds).toEqual(["A-031", "B-002"]);
    expect(nhanBoDem(ds.length)).toBe("Tổng: 2");
  });

  it("TC-S05-21: gỡ pin cuối → Tổng: 0 (về Empty)", () => {
    const ds = goKhoiDanhSach([{ maTaiSan: "B-002" }], "B-002");
    expect(ds).toHaveLength(0);
    expect(nhanBoDem(ds.length)).toBe("Tổng: 0");
  });
});

describe("pinCanDatLaiService — nhật ký kiểm toán (F15)", () => {
  it("TC-S05-18: ghi đủ trường người/hành động/tài sản/cũ→mới/thời điểm", () => {
    const bg = taoKiemToanDatLai(
      "quanly@ngocdung.net",
      "A-014",
      "2026-06-22T10:00:00",
      { x: 105, y: 40 },
      { x: 40, y: 60 },
    );
    expect(bg).toEqual({
      nguoiThucHien: "quanly@ngocdung.net",
      hanhDong: "dat-lai-vi-tri",
      doiTuong: "A-014",
      thoiDiem: "2026-06-22T10:00:00",
      viTriCu: "(105,40)",
      viTriMoi: "(40,60)",
    });
  });

  it("TC-S05-18: KHÔNG sinh bản ghi lịch sử di chuyển (chỉ trả nhật ký kiểm toán)", () => {
    const bg = taoKiemToanDatLai("quanly@ngocdung.net", "A-014", "2026-06-22T10:00:00", { x: 0, y: 0 }, { x: 1, y: 1 });
    // Không có trường "lyDo"/"viTriMoi dạng đường dẫn" của lịch sử di chuyển; chỉ là audit.
    expect(bg.hanhDong).toBe("dat-lai-vi-tri");
    expect(Object.keys(bg)).not.toContain("lyDo");
  });
});

describe("pinCanDatLaiService — phân quyền (F15)", () => {
  // Type-shape: PinCanDatLai dùng cho cả 2 vai trò; không có cờ quyền cấu trúc.
  const pin: PinCanDatLai = {
    maTaiSan: "B-002",
    tenTaiSan: "Máy bơm",
    duongDanKhuVuc: "Tòa B › Tầng 1 › Kho",
    tenSoDo: "Kho B1",
    maNut: "kho-b1",
  };

  it("TC-S05-22: đặt lại không phụ thuộc vai trò — logic giống nhau cho Quản trị & Giám sát", () => {
    // datLaiToaDo không nhận tham số vai trò ⇒ cả 2 vai trò cùng kết quả.
    const kq = datLaiToaDo(pin, 50, 50);
    expect(kq.ok).toBe(true);
    expect(kq.pin?.trangThai).toBe("DaGanViTri");
  });
});
