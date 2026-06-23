import type { TaiSan, ViTriPin } from "../types";
import { taoBanGhiKiemToan, type BanGhiKiemToan } from "../logic/audit";

export const MAX_LY_DO = 500;

export interface LichSuDiChuyen {
  maTaiSan: string;
  viTriCu: string;
  viTriMoi: string;
  nguoi: string;
  thoiDiem: string;
  lyDo?: string;
}

/** Kiểm tra lý do: tùy chọn, tối đa 500 ký tự (R-S04-05). */
export function validateLyDo(lyDo: string): string | undefined {
  if (lyDo.length > MAX_LY_DO) return "Lý do tối đa 500 ký tự.";
  return undefined;
}

/** Cắt lý do về tối đa 500 ký tự (chặn nhập vượt, TC-S04-15). */
export function catLyDo(lyDo: string): string {
  return lyDo.slice(0, MAX_LY_DO);
}

/** Tài sản ĐÃ có vị trí (chỉ những tài sản này mới di dời được — BRule-S04-06). */
export function taiSanCoViTri(taiSan: TaiSan[], pins: ViTriPin[]): TaiSan[] {
  const coViTri = new Set(pins.map((p) => p.maTaiSan));
  return taiSan.filter((t) => coViTri.has(t.maTaiSan));
}

/** Mã các tài sản đang nằm trong một nút (chọn cả vị trí cũ — R-S04-03). */
export function taiSanTrongNut(pins: ViTriPin[], maNut: string): string[] {
  return pins.filter((p) => p.maNut === maNut).map((p) => p.maTaiSan);
}

export interface YeuCauDiDoi {
  pins: ViTriPin[];
  maTaiSans: string[];
  maNutDich: string | null;
  nguoi: string;
  thoiDiem: string;
  lyDo?: string;
  taiSanDangKhoa?: Set<string>;
  /** true = bỏ qua tài sản bị khóa và tiếp tục với phần còn lại (TC-S04-20). */
  boQuaKhoa?: boolean;
}

export interface KetQuaDiDoi {
  ok: boolean;
  loi?: string;
  /** Có tài sản bị khóa & chưa quyết định bỏ qua → UI hiện dialog. */
  canHoiKhoa?: string[];
  pins?: ViTriPin[];
  lichSu?: LichSuDiChuyen[];
  audit?: BanGhiKiemToan[];
  soLuong?: number;
}

/**
 * Di dời lô tài sản về CÙNG một đích — giao dịch atomic (all-or-nothing ở tầng dữ liệu).
 * Áp: đích bắt buộc (R-S04-04), cùng một đích (BRule-S04-01), khóa (R-S04-08),
 * đích trùng vị trí hiện tại bị loại (BRule-S04-07), gỡ pin cũ + pin mới (R-S04-10/BRule-01),
 * tự ghi người+thời điểm + lịch sử + nhật ký kiểm toán (R-S04-06/07).
 */
export function diDoiLo(yc: YeuCauDiDoi): KetQuaDiDoi {
  const { pins, maTaiSans, maNutDich, nguoi, thoiDiem, lyDo } = yc;
  const khoa = yc.taiSanDangKhoa ?? new Set<string>();

  if (!maNutDich) return { ok: false, loi: "Vui lòng chọn khu vực đích." };
  if (maTaiSans.length === 0) return { ok: false, loi: "Chọn ít nhất một tài sản để di dời." };

  const biKhoa = maTaiSans.filter((m) => khoa.has(m));
  if (biKhoa.length > 0 && !yc.boQuaKhoa) {
    return { ok: false, canHoiKhoa: biKhoa };
  }

  const ungVien = yc.boQuaKhoa ? maTaiSans.filter((m) => !khoa.has(m)) : maTaiSans;
  const pinTheoTaiSan = new Map(pins.map((p) => [p.maTaiSan, p]));

  // Loại tài sản đã ở sẵn đích (đích trùng — BRule-S04-07).
  const canDoi = ungVien.filter((m) => pinTheoTaiSan.get(m)?.maNut !== maNutDich);
  if (canDoi.length === 0) {
    return { ok: false, loi: "Không có tài sản nào để di dời." };
  }

  const doi = new Set(canDoi);
  const lichSu: LichSuDiChuyen[] = [];
  const audit: BanGhiKiemToan[] = [];
  const pinMoi = pins.map((p) => {
    if (!doi.has(p.maTaiSan)) return p;
    lichSu.push({
      maTaiSan: p.maTaiSan,
      viTriCu: p.maNut,
      viTriMoi: maNutDich,
      nguoi,
      thoiDiem,
      lyDo: lyDo || undefined,
    });
    audit.push(
      taoBanGhiKiemToan(nguoi, "di-doi", p.maTaiSan, thoiDiem, { viTriCu: p.maNut, viTriMoi: maNutDich }),
    );
    return { ...p, maNut: maNutDich };
  });

  return { ok: true, pins: pinMoi, lichSu, audit, soLuong: canDoi.length };
}
