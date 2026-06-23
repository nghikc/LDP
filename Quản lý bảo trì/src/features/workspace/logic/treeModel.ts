import type { NutKhuVuc } from "../types";

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

/** Chuỗi breadcrumb dạng "Tòa A › Tầng 3 › Phòng 305". */
export function chuoiDuongDan(nodes: NutKhuVuc[], maNut: string): string {
  return layDuongDan(nodes, maNut)
    .map((n) => n.tenKhuVuc)
    .join(" › ");
}
