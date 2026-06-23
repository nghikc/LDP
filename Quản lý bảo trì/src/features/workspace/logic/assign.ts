import type { TaiSan, ViTriPin } from "../types";

/** Tài sản chưa có vị trí = không xuất hiện trong danh sách pin (BRule-S01-01). */
export function taiSanChuaCoViTri(taiSan: TaiSan[], pins: ViTriPin[]): TaiSan[] {
  const daCo = new Set(pins.map((p) => p.maTaiSan));
  return taiSan.filter((t) => !daCo.has(t.maTaiSan));
}

/** Tọa độ hợp lệ khi nằm trong vùng ảnh 0..100% (BRule-S01-05, TC-S01-21). */
export function trongVung(x: number, y: number): boolean {
  return x >= 0 && x <= 100 && y >= 0 && y <= 100;
}

export interface KetQuaGan {
  ok: boolean;
  pin?: ViTriPin;
  loi?: string;
}

/**
 * Gán một tài sản vào tọa độ trên sơ đồ của nút.
 * Chặn khi: chưa chọn tài sản / tọa độ ngoài vùng / tài sản đang bị khóa.
 */
export function ganViTri(
  maTaiSan: string | null,
  maNut: string,
  x: number,
  y: number,
  taiSanDangKhoa: Set<string> = new Set(),
): KetQuaGan {
  if (!maTaiSan) {
    return { ok: false, loi: "Vui lòng chọn một tài sản chưa có vị trí" };
  }
  if (!trongVung(x, y)) {
    return { ok: false, loi: "Vị trí nằm ngoài sơ đồ" };
  }
  if (taiSanDangKhoa.has(maTaiSan)) {
    return { ok: false, loi: "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau." };
  }
  return {
    ok: true,
    pin: { maTaiSan, maNut, toaDoX: x, toaDoY: y, trangThai: "DaGanViTri" },
  };
}
