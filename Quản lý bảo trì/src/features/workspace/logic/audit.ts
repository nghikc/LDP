/** Nhật ký kiểm toán — ghi mọi thao tác gán/di dời/xóa (R-S01-N03, FR-08). */
export type HanhDongKiemToan = "gan-vi-tri" | "go-vi-tri" | "di-doi" | "xoa-khu-vuc";

export interface BanGhiKiemToan {
  nguoiThucHien: string;
  hanhDong: HanhDongKiemToan;
  doiTuong: string; // mã tài sản hoặc mã nút
  thoiDiem: string; // ISO; truyền vào để test xác định
  viTriCu?: string;
  viTriMoi?: string;
}

export function taoBanGhiKiemToan(
  nguoiThucHien: string,
  hanhDong: HanhDongKiemToan,
  doiTuong: string,
  thoiDiem: string,
  extra: Partial<Pick<BanGhiKiemToan, "viTriCu" | "viTriMoi">> = {},
): BanGhiKiemToan {
  return { nguoiThucHien, hanhDong, doiTuong, thoiDiem, ...extra };
}
