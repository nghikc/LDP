// S03 — Kiểm tra định dạng & dung lượng ảnh sơ đồ (R-S03-03, R-S03-N01, BRule-S03-02).

/** 10 MB tính theo byte (biên trên hợp lệ — BVA, TC-S03-06/07). */
export const MAX_KICH_THUOC = 10 * 1024 * 1024; // 10485760 byte

/** Các MIME được chấp nhận: chỉ PNG/JPG (BRule-S03-02). */
export const MIME_HOP_LE = ["image/png", "image/jpeg"] as const;

/** Thông điệp lỗi inline dùng chung cho mọi vi phạm định dạng/dung lượng. */
export const LOI_DINH_DANG = "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.";

/** Mô tả tối thiểu của file cần kiểm (đủ để test thuần, không phụ thuộc DOM File). */
export interface ThongTinFile {
  ten: string;
  loai: string; // MIME type
  kichThuoc: number; // byte
}

/**
 * Kiểm file ảnh: chấp nhận PNG/JPG ≤ 10 MB.
 * Trả undefined nếu hợp lệ, ngược lại trả thông điệp lỗi inline.
 * Biên: đúng 10485760 byte → hợp lệ; 10485761 byte → lỗi.
 */
export function validateImage(file: ThongTinFile): string | undefined {
  const dungDinhDang = (MIME_HOP_LE as readonly string[]).includes(file.loai);
  const dungKichThuoc = file.kichThuoc <= MAX_KICH_THUOC;
  if (!dungDinhDang || !dungKichThuoc) return LOI_DINH_DANG;
  return undefined;
}

/** File DOM → ThongTinFile (dùng ở component). */
export function tuFile(file: File): ThongTinFile {
  return { ten: file.name, loai: file.type, kichThuoc: file.size };
}
