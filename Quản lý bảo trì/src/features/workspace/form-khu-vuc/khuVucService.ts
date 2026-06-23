import type { NutKhuVuc } from "../types";
import { layMaConChau } from "../logic/treeModel";
import type { DuLieuForm } from "./validateKhuVuc";

/** Lọc danh sách nút có thể làm Nút cha: khi Sửa, loại bỏ chính nút + nhánh con (R-S02-08, TC-S02-26). */
export function locNutChaHopLe(nodes: NutKhuVuc[], maNutHienTai?: string): NutKhuVuc[] {
  if (!maNutHienTai) return nodes;
  const loaiTru = new Set([maNutHienTai, ...layMaConChau(nodes, maNutHienTai)]);
  return nodes.filter((n) => !loaiTru.has(n.maNut));
}

/** Tạo nút mới dưới Nút cha (hoặc gốc nếu nutCha = null). Trả mảng nodes mới. */
export function taoNut(nodes: NutKhuVuc[], maNut: string, data: DuLieuForm): NutKhuVuc[] {
  const nut: NutKhuVuc = {
    maNut,
    tenKhuVuc: data.ten.trim(),
    maKhuVuc: data.ma.trim() || undefined,
    loaiKhuVuc: data.loai || undefined,
    nutCha: data.nutCha,
  };
  return [...nodes, nut];
}

/** Cập nhật nút đang sửa. */
export function suaNut(nodes: NutKhuVuc[], maNut: string, data: DuLieuForm): NutKhuVuc[] {
  return nodes.map((n) =>
    n.maNut === maNut
      ? {
          ...n,
          tenKhuVuc: data.ten.trim(),
          maKhuVuc: data.ma.trim() || undefined,
          loaiKhuVuc: data.loai || undefined,
          nutCha: data.nutCha,
        }
      : n,
  );
}
