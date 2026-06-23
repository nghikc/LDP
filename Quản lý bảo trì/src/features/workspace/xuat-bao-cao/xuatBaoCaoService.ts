// S08 — Xuất báo cáo / kiểm kê: logic thuần (tính phạm vi, dựng dữ liệu cột, sinh nội dung file).
// Trace: plan.md Task 1..6, test.md TC-S08-*.
//
// LƯU Ý KỸ THUẬT (quan trọng): dự án KHÔNG dùng thư viện .xlsx. Để vẫn xuất được file
// "danh sách tài sản" mở được trên Excel/LibreOffice với dấu tiếng Việt đúng, ta sinh nội dung
// dạng bảng phân tách (CSV UTF-8 có BOM). Bản thật cần thư viện Office Open XML (vd `xlsx`/
// `exceljs`) để ghi workbook `.xlsx` nhị phân — phần đó NẰM NGOÀI PHẠM VI. Logic dựng-dữ-liệu
// (phạm vi, cột, giá trị dẫn xuất) ở đây là chuẩn và được kiểm thử đầy đủ.

import type { NutKhuVuc, TaiSan, ViTriPin } from "../types";
import { layMaConChau, chuoiDuongDan } from "../logic/treeModel";
import { dinhDangThoiDiem, type BanGhiLichSu } from "../lich-su/lichSuService";

/** Loại phạm vi xuất (R-S08-01). */
export type LoaiPhamVi = "toan_bo" | "theo_khu_vuc" | "theo_bo_loc";

/** Khóa cột báo cáo — thứ tự khai báo = thứ tự chuẩn cố định (BRule-S08-01). */
export type KhoaCot = "ma" | "ten" | "duong_dan" | "vi_tri" | "lan_di_doi";

/** Lịch sử di chuyển gắn theo tài sản (để dẫn xuất "lần di dời gần nhất"). */
export type LichSuTheoTaiSan = Record<string, BanGhiLichSu[]>;

export const NHAN_CHUA_GAN_VI_TRI = "Chưa gán vị trí";
export const THONG_BAO_RONG = "Không có dữ liệu để xuất";
export const TEN_FILE_MAC_DINH = "baocao.xlsx";

/** Nhãn hiển thị + thứ tự chuẩn của 5 cột (BRule-S08-01). */
export const COT_CHUAN: { khoa: KhoaCot; nhan: string }[] = [
  { khoa: "ma", nhan: "Mã tài sản" },
  { khoa: "ten", nhan: "Tên" },
  { khoa: "duong_dan", nhan: "Đường dẫn khu vực" },
  { khoa: "vi_tri", nhan: "Vị trí" },
  { khoa: "lan_di_doi", nhan: "Lần di dời gần nhất" },
];

/** Mọi khóa cột theo thứ tự chuẩn (mặc định tick hết). */
export const COT_MAC_DINH: KhoaCot[] = COT_CHUAN.map((c) => c.khoa);

/** Dữ liệu xác định phạm vi xuất. */
export interface NguonDuLieu {
  nodes: NutKhuVuc[];
  taiSan: TaiSan[];
  pins: ViTriPin[];
  lichSu?: LichSuTheoTaiSan;
}

/** Cấu hình phạm vi do người dùng chọn. */
export interface CauHinhPhamVi {
  loai: LoaiPhamVi;
  /** Nút khu vực đang chọn (khi loai = "theo_khu_vuc"). */
  maNut?: string | null;
  /** Gồm cả khu vực con (đệ quy) — mặc định bật (BRule-S08-02). */
  gomKhuCon?: boolean;
  /** Mã tài sản khớp bộ lọc S01 hiện tại (khi loai = "theo_bo_loc"). */
  maTaiSanLoc?: string[];
}

/**
 * Tính danh sách tài sản trong phạm vi đã chọn (R-S08-01, R-S08-02, BRule-S08-02).
 * - toan_bo: mọi tài sản.
 * - theo_khu_vuc: tài sản đặt trực tiếp tại nút; nếu gomKhuCon → cộng đệ quy mọi nhánh con.
 *   Chưa chọn nút → rỗng (UI chặn riêng — TC-S08-04).
 * - theo_bo_loc: tài sản khớp maTaiSanLoc.
 */
export function tinhPhamVi(nguon: NguonDuLieu, ch: CauHinhPhamVi): TaiSan[] {
  const { nodes, taiSan, pins } = nguon;
  if (ch.loai === "toan_bo") return [...taiSan];

  if (ch.loai === "theo_bo_loc") {
    const loc = new Set(ch.maTaiSanLoc ?? []);
    return taiSan.filter((t) => loc.has(t.maTaiSan));
  }

  // theo_khu_vuc
  if (!ch.maNut) return [];
  const gom = ch.gomKhuCon ?? true;
  const maNuts = new Set<string>([ch.maNut]);
  if (gom) for (const m of layMaConChau(nodes, ch.maNut)) maNuts.add(m);
  const maTaiSanTrongPhamVi = new Set(
    pins.filter((p) => maNuts.has(p.maNut)).map((p) => p.maTaiSan),
  );
  return taiSan.filter((t) => maTaiSanTrongPhamVi.has(t.maTaiSan));
}

/** Ước tính số dòng = số tài sản trong phạm vi (R-S08-04). */
export function uocTinhSoDong(nguon: NguonDuLieu, ch: CauHinhPhamVi): number {
  return tinhPhamVi(nguon, ch).length;
}

/** Câu chữ ước tính cho dải hiển thị (TC-S08-16). */
export function chuoiUocTinh(soDong: number): string {
  return `Ước tính: ${soDong.toLocaleString("vi-VN")} tài sản trong phạm vi đã chọn`;
}

/** Lần di dời gần nhất của một tài sản = MAX(thoiDiem) trong lịch sử; trống nếu chưa di dời (BRule-S08-03). */
export function lanDiDoiGanNhat(banGhi: BanGhiLichSu[] | undefined): string {
  if (!banGhi || banGhi.length === 0) return "";
  const moiNhat = banGhi.reduce((a, b) => (b.thoiDiem > a.thoiDiem ? b : a));
  return dinhDangThoiDiem(moiNhat.thoiDiem);
}

/** Giá trị một ô theo khóa cột cho một tài sản (dẫn xuất đường dẫn / vị trí / lần di dời). */
function giaTriO(
  khoa: KhoaCot,
  t: TaiSan,
  nguon: NguonDuLieu,
  pinTheoTaiSan: Map<string, ViTriPin>,
): string {
  switch (khoa) {
    case "ma":
      return t.maTaiSan;
    case "ten":
      return t.ten;
    case "duong_dan": {
      const pin = pinTheoTaiSan.get(t.maTaiSan);
      // Tài sản chưa gán vị trí vẫn liệt kê, ô trống/"Chưa gán vị trí" (BRule-S08-04).
      return pin ? chuoiDuongDan(nguon.nodes, pin.maNut) : NHAN_CHUA_GAN_VI_TRI;
    }
    case "vi_tri": {
      const pin = pinTheoTaiSan.get(t.maTaiSan);
      return pin ? viTriCuaPin(pin) : NHAN_CHUA_GAN_VI_TRI;
    }
    case "lan_di_doi":
      return lanDiDoiGanNhat(nguon.lichSu?.[t.maTaiSan]);
  }
}

/** Mô tả vị trí pin (tọa độ tương đối trên sơ đồ của nút). */
function viTriCuaPin(pin: ViTriPin): string {
  return `${pin.toaDoX}%, ${pin.toaDoY}%`;
}

/** Bảng báo cáo đã dựng: header + rows, theo các cột đã chọn (giữ thứ tự chuẩn). */
export interface BangBaoCao {
  cot: KhoaCot[];
  header: string[];
  rows: string[][];
}

/** Lọc + sắp các cột đã chọn theo thứ tự chuẩn cố định (BRule-S08-01); ≥1 cột. */
export function chuanHoaCot(cotChon: KhoaCot[]): KhoaCot[] {
  const chon = new Set(cotChon);
  return COT_MAC_DINH.filter((k) => chon.has(k));
}

/**
 * Dựng bảng báo cáo cho danh sách tài sản theo cột đã chọn (R-S08-03/05).
 * - Cột giữ thứ tự chuẩn dù người dùng tick theo thứ tự nào (BRule-S08-01).
 * - Tài sản chưa gán vị trí / chưa di dời vẫn có dòng, ô tương ứng trống/"Chưa gán vị trí".
 */
export function dungBangBaoCao(
  danhSach: TaiSan[],
  cotChon: KhoaCot[],
  nguon: NguonDuLieu,
): BangBaoCao {
  const cot = chuanHoaCot(cotChon);
  const nhanTheoKhoa = new Map(COT_CHUAN.map((c) => [c.khoa, c.nhan]));
  const header = cot.map((k) => nhanTheoKhoa.get(k)!);
  const pinTheoTaiSan = new Map(nguon.pins.map((p) => [p.maTaiSan, p]));
  const rows = danhSach.map((t) => cot.map((k) => giaTriO(k, t, nguon, pinTheoTaiSan)));
  return { cot, header, rows };
}

/** Số tài sản đã xuất từ một bảng (cho toast "Đã xuất {n} tài sản"). */
export function chuoiThanhCong(soTaiSan: number): string {
  return `Đã xuất ${soTaiSan.toLocaleString("vi-VN")} tài sản`;
}

const BOM = "﻿";

/** Bọc một ô CSV (RFC 4180): bao "" nếu chứa dấu phẩy/nháy/xuống dòng. */
function bocO(o: string): string {
  if (/[",\n\r]/.test(o)) return `"${o.replace(/"/g, '""')}"`;
  return o;
}

/**
 * Sinh NỘI DUNG file dạng bảng (CSV UTF-8) từ bảng báo cáo.
 * Thêm BOM để Excel nhận UTF-8 → dấu tiếng Việt hiển thị đúng (TC-S08-28).
 * Bản thật `.xlsx`: thay hàm này bằng writer Office Open XML (ngoài phạm vi).
 */
export function sinhNoiDungFile(bang: BangBaoCao): string {
  const dong = [bang.header, ...bang.rows].map((r) => r.map(bocO).join(","));
  return BOM + dong.join("\r\n");
}

/** Tạo Blob để tải về (kèm tên file gợi ý "baocao.xlsx"). */
export function taoBlobBaoCao(noiDung: string): Blob {
  // Bản thật dùng MIME của .xlsx; ở đây nội dung là CSV UTF-8 (xem ghi chú đầu file).
  return new Blob([noiDung], { type: "text/csv;charset=utf-8;" });
}
