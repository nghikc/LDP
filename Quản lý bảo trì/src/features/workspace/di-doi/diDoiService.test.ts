import { describe, it, expect } from "vitest";
import {
  diDoiLo,
  validateLyDo,
  catLyDo,
  taiSanCoViTri,
  taiSanTrongNut,
  MAX_LY_DO,
} from "./diDoiService";
import type { TaiSan, ViTriPin } from "../types";

const NGUOI = "Nguyễn B";
const T = "2026-06-23T14:30:00Z";

function pin(maTaiSan: string, maNut: string, khoa = false): ViTriPin {
  return { maTaiSan, maNut, toaDoX: 10, toaDoY: 10, trangThai: khoa ? "DangKhoa" : "DaGanViTri" };
}

const pinsMau: ViTriPin[] = [
  pin("A-007", "phong-305"),
  pin("A-009", "phong-305"),
  pin("A-014", "phong-306"),
];

describe("diDoiService — di dời đơn (F12)", () => {
  it("TC-S04-01/26: di dời A-007 → Kho B-01, pin chuyển nút", () => {
    const kq = diDoiLo({ pins: pinsMau, maTaiSans: ["A-007"], maNutDich: "kho-b01", nguoi: NGUOI, thoiDiem: T });
    expect(kq.ok).toBe(true);
    expect(kq.soLuong).toBe(1);
    expect(kq.pins!.find((p) => p.maTaiSan === "A-007")!.maNut).toBe("kho-b01");
    // các pin khác giữ nguyên
    expect(kq.pins!.find((p) => p.maTaiSan === "A-009")!.maNut).toBe("phong-305");
  });

  it("TC-S04-02/10: thiếu đích → chặn + wording", () => {
    const kq = diDoiLo({ pins: pinsMau, maTaiSans: ["A-007"], maNutDich: null, nguoi: NGUOI, thoiDiem: T });
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Vui lòng chọn khu vực đích.");
  });

  it("TC-S04-17/18: tự ghi người + thời điểm + lịch sử cũ→mới + lý do + audit", () => {
    const kq = diDoiLo({
      pins: pinsMau, maTaiSans: ["A-007"], maNutDich: "kho-b01",
      nguoi: NGUOI, thoiDiem: T, lyDo: "Bảo trì",
    });
    expect(kq.lichSu).toEqual([
      { maTaiSan: "A-007", viTriCu: "phong-305", viTriMoi: "kho-b01", nguoi: NGUOI, thoiDiem: T, lyDo: "Bảo trì" },
    ]);
    expect(kq.audit![0]).toMatchObject({
      nguoiThucHien: NGUOI, hanhDong: "di-doi", doiTuong: "A-007", viTriCu: "phong-305", viTriMoi: "kho-b01",
    });
  });
});

describe("diDoiService — di dời hàng loạt (F13)", () => {
  it("TC-S04-04/11: lô 3 tài sản khác phòng → tất cả về CÙNG đích", () => {
    const kq = diDoiLo({
      pins: pinsMau, maTaiSans: ["A-007", "A-009", "A-014"], maNutDich: "kho-b01", nguoi: NGUOI, thoiDiem: T,
    });
    expect(kq.ok).toBe(true);
    expect(kq.soLuong).toBe(3);
    expect(kq.pins!.filter((p) => p.maNut === "kho-b01")).toHaveLength(3);
  });

  it("TC-S04-05: lô rỗng → chặn", () => {
    const kq = diDoiLo({ pins: pinsMau, maTaiSans: [], maNutDich: "kho-b01", nguoi: NGUOI, thoiDiem: T });
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Chọn ít nhất một tài sản để di dời.");
  });

  it("TC-S04-07: chọn cả vị trí cũ (Phòng 305) → lấy hết tài sản trong nút", () => {
    const ds = taiSanTrongNut(pinsMau, "phong-305");
    expect(ds.sort()).toEqual(["A-007", "A-009"]);
  });

  it("TC-S04-08: nút nguồn rỗng → không có tài sản", () => {
    expect(taiSanTrongNut(pinsMau, "phong-309")).toEqual([]);
  });

  it("TC-S04-31: đích trùng vị trí hiện tại toàn lô → không có gì để di dời", () => {
    const kq = diDoiLo({ pins: pinsMau, maTaiSans: ["A-007", "A-009"], maNutDich: "phong-305", nguoi: NGUOI, thoiDiem: T });
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Không có tài sản nào để di dời.");
  });
});

describe("diDoiService — khóa đồng thời (R-S04-08)", () => {
  const pinsKhoa = [pin("A-007", "phong-305"), pin("A-009", "phong-305"), pin("A-021", "phong-305", true)];

  it("TC-S04-19/20: lô có tài sản khóa, chưa quyết → trả canHoiKhoa", () => {
    const kq = diDoiLo({
      pins: pinsKhoa, maTaiSans: ["A-007", "A-009", "A-021"], maNutDich: "kho-b01",
      nguoi: NGUOI, thoiDiem: T, taiSanDangKhoa: new Set(["A-021"]),
    });
    expect(kq.ok).toBe(false);
    expect(kq.canHoiKhoa).toEqual(["A-021"]);
  });

  it("TC-S04-20: bỏ qua khóa → di dời 2 tài sản hợp lệ, A-021 giữ nguyên", () => {
    const kq = diDoiLo({
      pins: pinsKhoa, maTaiSans: ["A-007", "A-009", "A-021"], maNutDich: "kho-b01",
      nguoi: NGUOI, thoiDiem: T, taiSanDangKhoa: new Set(["A-021"]), boQuaKhoa: true,
    });
    expect(kq.ok).toBe(true);
    expect(kq.soLuong).toBe(2);
    expect(kq.pins!.find((p) => p.maTaiSan === "A-021")!.maNut).toBe("phong-305");
  });
});

describe("diDoiService — lý do & danh sách (R-S04-05/06)", () => {
  it("TC-S04-13: lý do trống → vẫn lưu, lichSu lyDo undefined", () => {
    const kq = diDoiLo({ pins: pinsMau, maTaiSans: ["A-007"], maNutDich: "kho-b01", nguoi: NGUOI, thoiDiem: T, lyDo: "" });
    expect(kq.ok).toBe(true);
    expect(kq.lichSu![0].lyDo).toBeUndefined();
  });

  it("TC-S04-15: 501 ký tự → lỗi + cắt còn 500", () => {
    const dai = "x".repeat(501);
    expect(validateLyDo(dai)).toBe("Lý do tối đa 500 ký tự.");
    expect(catLyDo(dai)).toHaveLength(MAX_LY_DO);
  });

  it("TC-S04-06: danh sách chỉ tài sản đã có vị trí", () => {
    const taiSan: TaiSan[] = [
      { maTaiSan: "A-007", ten: "Máy nén khí", trangThai: "x" },
      { maTaiSan: "A-100", ten: "Chưa đặt", trangThai: "x" },
    ];
    expect(taiSanCoViTri(taiSan, pinsMau).map((t) => t.maTaiSan)).toEqual(["A-007"]);
  });
});
