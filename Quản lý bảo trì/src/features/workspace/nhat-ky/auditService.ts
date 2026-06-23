// S07 — Nhật ký kiểm toán (chỉ đọc, append-only, chỉ Quản trị).
import { boChuDau } from "../logic/search";
import type { VaiTro } from "../types";

export type LoaiHanhDong = "Gán" | "Di dời" | "Xóa";

export interface BanGhiAudit {
  thoiDiem: string; // ISO
  nguoi: string;
  hanhDong: LoaiHanhDong;
  doiTuong: string;
  viTriCu?: string;
  viTriMoi?: string;
}

export const KICH_THUOC_TRANG = 25;
export const MAX_TU_KHOA = 100;

export interface BoLocAudit {
  nguoi?: string;
  hanhDong?: LoaiHanhDong;
  tuNgay?: string;
  denNgay?: string;
  tuKhoa?: string;
}

/** Chỉ Quản trị được xem nhật ký (R-S07-N01, BRule-S07-02). */
export function duocXemAudit(vaiTro: VaiTro): boolean {
  return vaiTro === "QuanTri";
}

export function validateKhoangAudit(tu?: string, den?: string): string | undefined {
  if (tu && den && tu > den) return "Từ ngày phải nhỏ hơn hoặc bằng Đến ngày.";
  return undefined;
}

export function validateTuKhoa(tk: string): string | undefined {
  if (tk.length > MAX_TU_KHOA) return "Nhập tối đa 100 ký tự.";
  return undefined;
}

/** Lọc tổ hợp AND: người + hành động + khoảng thời gian + đối tượng (khớp một phần, không dấu) (R-S07-06). */
export function locAudit(rows: BanGhiAudit[], f: BoLocAudit): BanGhiAudit[] {
  const tk = f.tuKhoa ? boChuDau(f.tuKhoa.slice(0, MAX_TU_KHOA)) : "";
  return rows.filter((r) => {
    if (f.nguoi && r.nguoi !== f.nguoi) return false;
    if (f.hanhDong && r.hanhDong !== f.hanhDong) return false;
    const d = r.thoiDiem.slice(0, 10);
    if (f.tuNgay && d < f.tuNgay) return false;
    if (f.denNgay && d > f.denNgay) return false;
    if (tk && !boChuDau(r.doiTuong).includes(tk)) return false;
    return true;
  });
}

export function sapXep(rows: BanGhiAudit[], chieu: "desc" | "asc" = "desc"): BanGhiAudit[] {
  const s = [...rows].sort((a, b) => (a.thoiDiem < b.thoiDiem ? -1 : a.thoiDiem > b.thoiDiem ? 1 : 0));
  return chieu === "desc" ? s.reverse() : s;
}

export interface TrangAudit {
  items: BanGhiAudit[];
  total: number;
  tu: number; // chỉ số 1-based đầu trang
  den: number;
  soTrang: number;
}

/** Phân trang 25 dòng/trang; nhãn "Hiển thị {tu}–{den} / {total} bản ghi." (R-S07: TC-15/17). */
export function phanTrang(rows: BanGhiAudit[], trang: number, size = KICH_THUOC_TRANG): TrangAudit {
  const total = rows.length;
  const soTrang = Math.max(1, Math.ceil(total / size));
  const t = Math.min(Math.max(1, trang), soTrang);
  const batDau = (t - 1) * size;
  const items = rows.slice(batDau, batDau + size);
  return {
    items,
    total,
    tu: total === 0 ? 0 : batDau + 1,
    den: batDau + items.length,
    soTrang,
  };
}

/** Hiển thị cột vị trí: "—" cho hành động không có vị trí (vd Xóa) (BRule-S07-04). */
export function nhanViTri(r: BanGhiAudit): string {
  if (r.hanhDong === "Xóa" || (!r.viTriCu && !r.viTriMoi)) return "—";
  return `${r.viTriCu ?? "(chưa có)"} → ${r.viTriMoi ?? "(chưa có)"}`;
}
