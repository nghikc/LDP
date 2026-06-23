import type { NutKhuVuc, ViTriPin } from "../types";
import { layMaConChau } from "./treeModel";

export interface KetQuaGo {
  ok: boolean;
  pins?: ViTriPin[];
  loi?: string;
}

/**
 * Gỡ vị trí một tài sản (xóa pin) — tài sản về "chưa có vị trí".
 * Chặn khi pin đang bị khóa (TC-S01-25). Không xóa hồ sơ tài sản.
 */
export function goViTri(pins: ViTriPin[], maTaiSan: string): KetQuaGo {
  const pin = pins.find((p) => p.maTaiSan === maTaiSan);
  if (pin?.trangThai === "DangKhoa") {
    return { ok: false, loi: "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau." };
  }
  return { ok: true, pins: pins.filter((p) => p.maTaiSan !== maTaiSan) };
}

export interface AnhHuongXoa {
  soTaiSan: number;
  soKhuCon: number;
}

/** Đếm số tài sản bị gỡ vị trí + số khu con bị xóa khi xóa một nút (TC-S01-37/40). */
export function demAnhHuongXoa(
  nodes: NutKhuVuc[],
  pins: ViTriPin[],
  maNut: string,
): AnhHuongXoa {
  const conChau = layMaConChau(nodes, maNut);
  const trongPhamVi = new Set([maNut, ...conChau]);
  return {
    soTaiSan: pins.filter((p) => trongPhamVi.has(p.maNut)).length,
    soKhuCon: conChau.length,
  };
}

/** Wording dialog xác nhận xóa (TC-S01-37/40). */
export function wordingXacNhanXoa({ soTaiSan, soKhuCon }: AnhHuongXoa): string {
  return `Xóa khu vực này sẽ gỡ vị trí của ${soTaiSan} tài sản và xóa ${soKhuCon} khu vực con. Tiếp tục?`;
}

export interface KetQuaXoaNut {
  nodes: NutKhuVuc[];
  pins: ViTriPin[];
}

/**
 * Xóa một nút + toàn bộ nhánh con; gỡ vị trí tài sản bên trong (về chưa có vị trí).
 * KHÔNG xóa hồ sơ tài sản (BRule-S01-03).
 */
export function xoaNut(
  nodes: NutKhuVuc[],
  pins: ViTriPin[],
  maNut: string,
): KetQuaXoaNut {
  const conChau = layMaConChau(nodes, maNut);
  const xoa = new Set([maNut, ...conChau]);
  return {
    nodes: nodes.filter((n) => !xoa.has(n.maNut)),
    pins: pins.filter((p) => !xoa.has(p.maNut)),
  };
}
