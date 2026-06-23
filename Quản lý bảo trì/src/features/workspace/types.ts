// Mô hình miền cho phân hệ Quản lý vị trí tài sản cố định (màn S01 — Workspace).
// Trace: srs.md S01 (ERD: NUT_KHU_VUC, SO_DO_MAT_BANG, VI_TRI_PIN, TAI_SAN, LICH_SU_DI_CHUYEN).

/** Vai trò người dùng — phân quyền theo BRule-S01-04. */
export type VaiTro = "QuanTri" | "GiamSat";

/** Trạng thái một pin trên sơ đồ — trace State diagram trong srs.md. */
export type TrangThaiPin = "DaGanViTri" | "DangKhoa" | "CanDatLai";

/** Nút khu vực — cây phân cấp không giới hạn cấp (FR-01, BRule-S01-02). */
export interface NutKhuVuc {
  maNut: string;
  tenKhuVuc: string;
  loaiKhuVuc?: string;
  maKhuVuc?: string;
  nutCha: string | null; // null = nút gốc
  /** Đường dẫn ảnh sơ đồ mặt bằng gắn với nút (tối đa 1); undefined = chưa có sơ đồ. */
  soDoUrl?: string;
}

/** Tài sản cố định (tham chiếu từ module hồ sơ tài sản). */
export interface TaiSan {
  maTaiSan: string;
  ten: string;
  trangThai: string;
}

/** Vị trí pin của một tài sản trên sơ đồ của một nút khu vực (BRule-S01-01: mỗi tài sản ≤ 1 vị trí). */
export interface ViTriPin {
  maTaiSan: string;
  maNut: string;
  /** Tọa độ tương đối theo phần trăm kích thước ảnh (BRule-S01-05). */
  toaDoX: number; // 0..100
  toaDoY: number; // 0..100
  trangThai: TrangThaiPin;
}
