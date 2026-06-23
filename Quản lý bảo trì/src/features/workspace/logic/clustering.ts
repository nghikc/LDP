import type { ViTriPin } from "../types";

export const NGUONG_GOM_CUM = 500;

export interface CumPin {
  toaDoX: number;
  toaDoY: number;
  soLuong: number;
  pins: ViTriPin[];
}

/**
 * Gom cụm pin khi số pin VƯỢT ngưỡng 500 (>500 → gom; ≤500 → giữ rời).
 * Gom theo lưới ô vuông `kichThuocO`% để gộp pin gần nhau (TC-S01-10/11).
 */
export function gomCumPin(pins: ViTriPin[], kichThuocO = 5): CumPin[] {
  if (pins.length <= NGUONG_GOM_CUM) {
    return pins.map((p) => ({ toaDoX: p.toaDoX, toaDoY: p.toaDoY, soLuong: 1, pins: [p] }));
  }
  const o = new Map<string, ViTriPin[]>();
  for (const p of pins) {
    const key = `${Math.floor(p.toaDoX / kichThuocO)}:${Math.floor(p.toaDoY / kichThuocO)}`;
    (o.get(key) ?? o.set(key, []).get(key)!).push(p);
  }
  return [...o.values()].map((nhom) => ({
    toaDoX: nhom.reduce((s, p) => s + p.toaDoX, 0) / nhom.length,
    toaDoY: nhom.reduce((s, p) => s + p.toaDoY, 0) / nhom.length,
    soLuong: nhom.length,
    pins: nhom,
  }));
}

/** Lọc pin theo trạng thái (TC-S01-13). */
export function locPinTheoTrangThai(
  pins: ViTriPin[],
  trangThai: ViTriPin["trangThai"],
): ViTriPin[] {
  return pins.filter((p) => p.trangThai === trangThai);
}
