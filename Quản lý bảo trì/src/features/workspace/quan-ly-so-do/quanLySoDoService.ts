// S03 — Logic thuần quản lý ảnh sơ đồ mặt bằng của một nút khu vực.
// Trace: srs.md S03 (R-S03-01..08, BRule-S03-01..06).
import type { ViTriPin } from "../types";
import { validateImage, type ThongTinFile } from "./validateImage";

/** Hành động kiểm toán riêng cho sơ đồ (R-S03-N03). */
export type HanhDongSoDo = "tai-len-so-do" | "thay-so-do" | "xoa-so-do";

/** Nhãn hiển thị hành động trong nhật ký kiểm toán (TC-S03-23/24/25). */
export const NHAN_HANH_DONG: Record<HanhDongSoDo, string> = {
  "tai-len-so-do": "Tải lên sơ đồ",
  "thay-so-do": "Thay ảnh sơ đồ",
  "xoa-so-do": "Xóa ảnh sơ đồ",
};

/** Bản ghi nhật ký kiểm toán cho thao tác sơ đồ (người · hành động · nút · thời gian). */
export interface BanGhiKiemToanSoDo {
  nguoiThucHien: string;
  hanhDong: HanhDongSoDo;
  maNut: string;
  thoiDiem: string; // ISO
  /** Chi tiết phụ, vd "gỡ vị trí 12 tài sản". */
  ghiChu?: string;
}

function taoAudit(
  nguoiThucHien: string,
  hanhDong: HanhDongSoDo,
  maNut: string,
  thoiDiem: string,
  ghiChu?: string,
): BanGhiKiemToanSoDo {
  return { nguoiThucHien, hanhDong, maNut, thoiDiem, ...(ghiChu ? { ghiChu } : {}) };
}

/** Một ảnh sơ đồ đã gắn vào nút (tối đa 1/nút — BRule-S03-01). */
export interface SoDoMatBang {
  tenFile: string;
  kichThuocByte: number;
  rongPx: number;
  caoPx: number;
}

/** Trạng thái sơ đồ của nút (State — srs Luồng 4). */
export type TrangThaiSoDo = "ChuaCoSoDo" | "DaCoSoDo" | "CoPinCanDatLai";

/** Suy ra trạng thái sơ đồ từ ảnh + pin. */
export function trangThaiSoDo(soDo: SoDoMatBang | undefined, pins: ViTriPin[]): TrangThaiSoDo {
  if (!soDo) return "ChuaCoSoDo";
  if (pins.some((p) => p.trangThai === "CanDatLai")) return "CoPinCanDatLai";
  return "DaCoSoDo";
}

// ───────────────────────── Tải lên (R-S03-01) ─────────────────────────

export interface YeuCauTaiLen {
  soDoHienTai: SoDoMatBang | undefined;
  file: ThongTinFile;
  rongPx: number;
  caoPx: number;
  maNut: string;
  nguoi: string;
  thoiDiem: string;
}

export interface KetQuaTaiLen {
  ok: boolean;
  loi?: string;
  soDo?: SoDoMatBang;
  audit?: BanGhiKiemToanSoDo;
}

/**
 * Tải lên ảnh cho nút CHƯA có sơ đồ. Validate trước; chặn ảnh thứ hai (BRule-S03-01).
 * Ghi nhật ký kiểm toán "tai-len-so-do".
 */
export function taiLenSoDo(yc: YeuCauTaiLen): KetQuaTaiLen {
  if (yc.soDoHienTai) return { ok: false, loi: "Nút đã có sơ đồ; mỗi nút tối đa 1 sơ đồ." };
  const loi = validateImage(yc.file);
  if (loi) return { ok: false, loi };

  const soDo: SoDoMatBang = {
    tenFile: yc.file.ten,
    kichThuocByte: yc.file.kichThuoc,
    rongPx: yc.rongPx,
    caoPx: yc.caoPx,
  };
  const audit = taoAudit(yc.nguoi, "tai-len-so-do", yc.maNut, yc.thoiDiem);
  return { ok: true, soDo, audit };
}

// ───────────────────────── Thay ảnh (R-S03-04/05) ─────────────────────────

/** Pin có tọa độ % ngoài [0,100] → nằm ngoài vùng ảnh mới (BRule-S03-04). */
export function pinTranNgoai(pin: ViTriPin): boolean {
  return pin.toaDoX < 0 || pin.toaDoX > 100 || pin.toaDoY < 0 || pin.toaDoY > 100;
}

export interface YeuCauThay {
  soDoHienTai: SoDoMatBang;
  pins: ViTriPin[];
  file: ThongTinFile;
  rongPx: number;
  caoPx: number;
  maNut: string;
  nguoi: string;
  thoiDiem: string;
}

export interface KetQuaThay {
  ok: boolean;
  loi?: string;
  soDo?: SoDoMatBang;
  /** Pin sau khi thay — GIỮ tọa độ %, pin tràn → trạng thái "CanDatLai". */
  pins?: ViTriPin[];
  /** Mã tài sản của các pin bị đánh dấu cần đặt lại. */
  pinCanDatLai?: string[];
  audit?: BanGhiKiemToanSoDo;
}

/**
 * Thay ảnh sơ đồ, GIỮ nguyên tọa độ tương đối (%) của pin (BRule-S03-03).
 * Pin có tọa độ ngoài [0,100] (tràn ngoài vùng ảnh mới) → trạng thái "CanDatLai" (BRule-S03-04).
 * File sai định dạng → chặn, ảnh cũ giữ nguyên (TC-S03-12). Ghi audit "thay-so-do".
 */
export function thaySoDo(yc: YeuCauThay): KetQuaThay {
  const loi = validateImage(yc.file);
  if (loi) return { ok: false, loi };

  const pinCanDatLai: string[] = [];
  const pins = yc.pins.map((p) => {
    if (pinTranNgoai(p)) {
      pinCanDatLai.push(p.maTaiSan);
      return { ...p, trangThai: "CanDatLai" as const };
    }
    return p; // trong vùng → giữ nguyên tọa độ % + trạng thái
  });

  const soDo: SoDoMatBang = {
    tenFile: yc.file.ten,
    kichThuocByte: yc.file.kichThuoc,
    rongPx: yc.rongPx,
    caoPx: yc.caoPx,
  };
  const audit = taoAudit(yc.nguoi, "thay-so-do", yc.maNut, yc.thoiDiem);
  return { ok: true, soDo, pins, pinCanDatLai, audit };
}

// ───────────────────────── Xóa ảnh (R-S03-06) ─────────────────────────

export interface YeuCauXoa {
  pins: ViTriPin[];
  maNut: string;
  nguoi: string;
  thoiDiem: string;
}

export interface KetQuaXoa {
  ok: boolean;
  soDo: undefined;
  /** Pin của nút bị gỡ hết (giữ hồ sơ tài sản, chỉ gỡ vị trí). */
  pins: ViTriPin[];
  /** Mã tài sản được gỡ vị trí (về "chưa có vị trí"). */
  taiSanGoViTri: string[];
  audit: BanGhiKiemToanSoDo;
}

/**
 * Xóa ảnh sơ đồ của nút. Gỡ TẤT CẢ pin của nút (về "chưa có vị trí"),
 * giữ hồ sơ tài sản (BRule-S03-05). Ghi audit "xoa-so-do".
 */
export function xoaSoDo(yc: YeuCauXoa): KetQuaXoa {
  const cuaNut = yc.pins.filter((p) => p.maNut === yc.maNut);
  const taiSanGoViTri = cuaNut.map((p) => p.maTaiSan);
  const pinConLai = yc.pins.filter((p) => p.maNut !== yc.maNut);
  const ghiChu = `gỡ vị trí ${taiSanGoViTri.length} tài sản`;
  const audit = taoAudit(yc.nguoi, "xoa-so-do", yc.maNut, yc.thoiDiem, ghiChu);
  return { ok: true, soDo: undefined, pins: pinConLai, taiSanGoViTri, audit };
}

// ───────────────────────── Quyền (R-S03-N03, BRule-S03-06) ─────────────────────────

/** Chỉ Quản trị được tải/thay/xóa ảnh sơ đồ; Giám sát không có lối vào (BRule-S03-06). */
export function duocQuanLySoDo(vaiTro: string): boolean {
  return vaiTro === "QuanTri";
}
