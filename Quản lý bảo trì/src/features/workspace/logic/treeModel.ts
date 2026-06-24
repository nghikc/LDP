import type { NutKhuVuc } from "../types";
import { boChuDau } from "./search";

/** Lấy các nút con trực tiếp của một nút (maCha = null → các nút gốc). */
export function layNutCon(nodes: NutKhuVuc[], maCha: string | null): NutKhuVuc[] {
  return nodes.filter((n) => n.nutCha === maCha);
}

/** Lấy mọi mã nút con cháu (đệ quy) của một nút — không gồm chính nó. */
export function layMaConChau(nodes: NutKhuVuc[], maNut: string): string[] {
  const ketQua: string[] = [];
  const duyet = (cha: string) => {
    for (const con of nodes.filter((n) => n.nutCha === cha)) {
      ketQua.push(con.maNut);
      duyet(con.maNut);
    }
  };
  duyet(maNut);
  return ketQua;
}

/** Kiểm tra `maNut` có phải con cháu của `maToTien` không. */
export function laConChau(nodes: NutKhuVuc[], maNut: string, maToTien: string): boolean {
  return layMaConChau(nodes, maToTien).includes(maNut);
}

/** Đường dẫn breadcrumb từ gốc tới nút (gồm chính nó). */
export function layDuongDan(nodes: NutKhuVuc[], maNut: string): NutKhuVuc[] {
  const map = new Map(nodes.map((n) => [n.maNut, n]));
  const duong: NutKhuVuc[] = [];
  let hienTai = map.get(maNut);
  while (hienTai) {
    duong.unshift(hienTai);
    hienTai = hienTai.nutCha ? map.get(hienTai.nutCha) : undefined;
  }
  return duong;
}

/**
 * Lọc cây theo từ khóa (tên/mã, không dấu): trả tập mã nút HIỂN THỊ =
 * các nút khớp + toàn bộ tổ tiên của chúng. Trả null nếu từ khóa rỗng (hiện tất cả).
 */
export function locCayTheoTen(nodes: NutKhuVuc[], tuKhoa: string): Set<string> | null {
  const q = boChuDau(tuKhoa.trim());
  if (!q) return null;
  const hienThi = new Set<string>();
  for (const n of nodes) {
    const khop = boChuDau(n.tenKhuVuc).includes(q) || (!!n.maKhuVuc && boChuDau(n.maKhuVuc).includes(q));
    if (khop) for (const a of layDuongDan(nodes, n.maNut)) hienThi.add(a.maNut);
  }
  return hienThi;
}

/** Chuỗi breadcrumb dạng "Tòa A › Tầng 3 › Phòng 305". */
export function chuoiDuongDan(nodes: NutKhuVuc[], maNut: string): string {
  return layDuongDan(nodes, maNut)
    .map((n) => n.tenKhuVuc)
    .join(" › ");
}
