// S05 — Danh sách pin cần đặt lại (logic thuần).
// Trace: srs.md S05 — lọc pin "CanDatLai", đặt lại tọa độ tương đối (%) trong vùng ảnh 0..100,
// chuyển trạng thái CanDatLai → DaGanViTri, pin rời danh sách, bộ đếm giảm,
// ghi nhật ký kiểm toán (KHÔNG tạo lịch sử di chuyển), chặn khi pin bị khóa.
import { trongVung } from "../logic/assign";
import type { ViTriPin } from "../types";

/** Một mục pin trong danh sách "cần đặt lại" — gộp thông tin hiển thị (R-S05-01). */
export interface PinCanDatLai {
  maTaiSan: string;
  tenTaiSan: string;
  /** Đường dẫn khu vực, vd "Tòa A › Tầng 3 › Phòng 305". */
  duongDanKhuVuc: string;
  /** Tên sơ đồ chứa pin, vd "Phòng 305". */
  tenSoDo: string;
  maNut: string;
  /** Pin đang bị người khác khóa (đang chỉnh sửa) → chặn đặt lại (R-S05-N04). */
  dangKhoa?: boolean;
}

/** Chỉ giữ pin ở trạng thái "CanDatLai" (BRule-S05-01). */
export function locPinCanDatLai(pins: ViTriPin[]): ViTriPin[] {
  return pins.filter((p) => p.trangThai === "CanDatLai");
}

/** Nhãn bộ đếm "Tổng: N" (R-S05-02). */
export function nhanBoDem(n: number): string {
  return `Tổng: ${n}`;
}

export const THONG_BAO_NGOAI_VUNG = "Vị trí nằm ngoài sơ đồ.";
export const THONG_BAO_KHOA =
  "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.";

export interface KetQuaDatLai {
  ok: boolean;
  /** Pin sau khi đặt lại — trạng thái chuyển sang "DaGanViTri" (BRule-S05-04). */
  pin?: ViTriPin;
  loi?: string;
}

/**
 * Đặt lại tọa độ tương đối (%) cho một pin "cần đặt lại".
 * Chặn khi: tọa độ ngoài vùng ảnh 0..100 (R-S05-06) / pin đang bị khóa (R-S05-N04).
 * Thành công → pin chuyển trạng thái CanDatLai → DaGanViTri (BRule-S05-04).
 */
export function datLaiToaDo(
  pin: Pick<ViTriPin, "maTaiSan" | "maNut">,
  x: number,
  y: number,
  dangKhoa = false,
): KetQuaDatLai {
  if (dangKhoa) {
    return { ok: false, loi: THONG_BAO_KHOA };
  }
  if (!trongVung(x, y)) {
    return { ok: false, loi: THONG_BAO_NGOAI_VUNG };
  }
  return {
    ok: true,
    pin: {
      maTaiSan: pin.maTaiSan,
      maNut: pin.maNut,
      toaDoX: x,
      toaDoY: y,
      trangThai: "DaGanViTri",
    },
  };
}

/** Gỡ pin đã đặt lại khỏi danh sách "cần đặt lại" (R-S05-05, BRule-S05-04). */
export function goKhoiDanhSach<T extends { maTaiSan: string }>(
  ds: T[],
  maTaiSan: string,
): T[] {
  return ds.filter((p) => p.maTaiSan !== maTaiSan);
}

/** Nhật ký kiểm toán cho thao tác đặt lại (R-S05-N03, BRule-S05-03). */
export interface BanGhiKiemToanDatLai {
  nguoiThucHien: string;
  hanhDong: "dat-lai-vi-tri";
  doiTuong: string; // mã tài sản
  thoiDiem: string; // ISO
  viTriCu: string; // "(x,y)"
  viTriMoi: string; // "(x,y)"
}

function nhanToaDo(x: number, y: number): string {
  return `(${x},${y})`;
}

/**
 * Ghi nhật ký kiểm toán khi đặt lại thành công.
 * KHÔNG tạo bản ghi lịch sử di chuyển (BRule-S05-03).
 */
export function taoKiemToanDatLai(
  nguoiThucHien: string,
  maTaiSan: string,
  thoiDiem: string,
  cu: { x: number; y: number },
  moi: { x: number; y: number },
): BanGhiKiemToanDatLai {
  return {
    nguoiThucHien,
    hanhDong: "dat-lai-vi-tri",
    doiTuong: maTaiSan,
    thoiDiem,
    viTriCu: nhanToaDo(cu.x, cu.y),
    viTriMoi: nhanToaDo(moi.x, moi.y),
  };
}
