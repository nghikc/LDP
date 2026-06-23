import type { NutKhuVuc } from "../types";
import { laConChau } from "./treeModel";

export interface KetQuaChuyen {
  ok: boolean;
  nodes?: NutKhuVuc[];
  loi?: string;
}

/**
 * Di chuyển nút `maNut` vào làm con của `maChaMoi`.
 * Chặn khi thả vào CHÍNH NÓ hoặc NHÁNH CON của nó (BRule-S01-02, TC-S01-34/35).
 */
export function chuyenNut(
  nodes: NutKhuVuc[],
  maNut: string,
  maChaMoi: string,
): KetQuaChuyen {
  if (maNut === maChaMoi || laConChau(nodes, maChaMoi, maNut)) {
    return { ok: false, loi: "Không thể di chuyển khu vực vào chính nhánh con của nó." };
  }
  return {
    ok: true,
    nodes: nodes.map((n) => (n.maNut === maNut ? { ...n, nutCha: maChaMoi } : n)),
  };
}
