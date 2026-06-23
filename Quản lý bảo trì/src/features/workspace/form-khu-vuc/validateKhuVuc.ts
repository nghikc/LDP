import type { NutKhuVuc } from "../types";
import { layMaConChau } from "../logic/treeModel";

export const MAX_TEN = 150;
export const MAX_MA = 50;

export interface LoiForm {
  ten?: string;
  ma?: string;
  nutCha?: string;
}

/** Kiểm tra Tên: bắt buộc (sau trim), tối đa 150 ký tự (R-S02-05). */
export function validateTen(ten: string): string | undefined {
  const t = ten.trim();
  if (!t) return "Vui lòng nhập tên khu vực";
  if (t.length > MAX_TEN) return "Tên khu vực tối đa 150 ký tự";
  return undefined;
}

/** Kiểm tra Mã: tùy chọn; nếu nhập phải ≤50 ký tự và duy nhất toàn cây (bỏ qua chính nút khi Sửa) (R-S02-06). */
export function validateMa(
  ma: string,
  nodes: NutKhuVuc[],
  maNutHienTai?: string,
): string | undefined {
  const m = ma.trim();
  if (!m) return undefined;
  if (m.length > MAX_MA) return "Mã khu vực tối đa 50 ký tự";
  const trung = nodes.some((n) => n.maKhuVuc === m && n.maNut !== maNutHienTai);
  if (trung) return "Mã khu vực đã tồn tại";
  return undefined;
}

/**
 * Kiểm tra Nút cha không gây cây lặp: không phải chính nút và không phải nhánh con (R-S02-08).
 * Chỉ áp khi Sửa (có maNutHienTai).
 */
export function validateNutCha(
  nutCha: string | null,
  nodes: NutKhuVuc[],
  maNutHienTai?: string,
): string | undefined {
  if (!nutCha || !maNutHienTai) return undefined;
  if (nutCha === maNutHienTai || layMaConChau(nodes, maNutHienTai).includes(nutCha)) {
    return "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó";
  }
  return undefined;
}

export interface DuLieuForm {
  ten: string;
  ma: string;
  loai?: string;
  nutCha: string | null;
}

export function validateForm(
  data: DuLieuForm,
  nodes: NutKhuVuc[],
  maNutHienTai?: string,
): LoiForm {
  const loi: LoiForm = {};
  const eTen = validateTen(data.ten);
  if (eTen) loi.ten = eTen;
  const eMa = validateMa(data.ma, nodes, maNutHienTai);
  if (eMa) loi.ma = eMa;
  const eCha = validateNutCha(data.nutCha, nodes, maNutHienTai);
  if (eCha) loi.nutCha = eCha;
  return loi;
}

export function formHopLe(loi: LoiForm): boolean {
  return !loi.ten && !loi.ma && !loi.nutCha;
}
