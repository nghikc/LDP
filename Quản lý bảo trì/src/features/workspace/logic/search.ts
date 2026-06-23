import type { TaiSan } from "../types";

export const GIOI_HAN_TU_KHOA = 100;

/** Bỏ dấu tiếng Việt + đưa về chữ thường để khớp không phân biệt dấu (BRule GĐ-R5). */
export function boChuDau(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/**
 * Tra cứu tài sản theo mã/tên: khớp một phần, không phân biệt dấu.
 * Trả [] nếu từ khóa rỗng. Từ khóa được cắt tối đa GIOI_HAN_TU_KHOA ký tự.
 */
export function timTaiSan(taiSan: TaiSan[], tuKhoa: string): TaiSan[] {
  const tk = boChuDau(tuKhoa.slice(0, GIOI_HAN_TU_KHOA));
  if (!tk) return [];
  return taiSan.filter(
    (t) => boChuDau(t.maTaiSan).includes(tk) || boChuDau(t.ten).includes(tk),
  );
}
