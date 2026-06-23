// S06 — Lịch sử di chuyển tài sản (chỉ đọc, append-only).

export interface BanGhiLichSu {
  thoiDiem: string; // ISO, vd "2026-06-22T14:30:00"
  nguoi: string;
  viTriCu: string | null; // null = chưa có vị trí (gán lần đầu)
  viTriMoi: string;
  lyDo?: string;
}

const NHAN_CHUA_CO_VI_TRI = "(Chưa có vị trí)";
const NHAN_KHONG_LY_DO = "(Không có lý do)";

/** Ngày (yyyy-mm-dd) của một bản ghi để so sánh khoảng. */
function ngay(iso: string): string {
  return iso.slice(0, 10);
}

/** Sắp xếp mới-nhất-trên-cùng (thời điểm giảm dần). */
export function sapXepGiamDan(bg: BanGhiLichSu[]): BanGhiLichSu[] {
  return [...bg].sort((a, b) => (a.thoiDiem < b.thoiDiem ? 1 : a.thoiDiem > b.thoiDiem ? -1 : 0));
}

/** Kiểm tra khoảng: Từ > Đến → lỗi (R-S06-05). */
export function validateKhoang(tu?: string, den?: string): string | undefined {
  if (tu && den && tu > den) return "Từ ngày không được sau Đến ngày.";
  return undefined;
}

/** Lọc theo khoảng thời gian — bao gồm cả hai mốc; cho phép lọc một phía (R-S06-05). */
export function locTheoKhoang(bg: BanGhiLichSu[], tu?: string, den?: string): BanGhiLichSu[] {
  return bg.filter((b) => {
    const d = ngay(b.thoiDiem);
    if (tu && d < tu) return false;
    if (den && d > den) return false;
    return true;
  });
}

export function nhanViTriCu(b: BanGhiLichSu): string {
  return b.viTriCu ?? NHAN_CHUA_CO_VI_TRI;
}

export function nhanLyDo(b: BanGhiLichSu): string {
  return b.lyDo && b.lyDo.trim() ? b.lyDo : NHAN_KHONG_LY_DO;
}

/** Định dạng thời điểm dd/MM/yyyy HH:mm cho hiển thị. */
export function dinhDangThoiDiem(iso: string): string {
  const [d, t = "00:00"] = iso.split("T");
  const [yyyy, mm, dd] = d.split("-");
  return `${dd}/${mm}/${yyyy} ${t.slice(0, 5)}`;
}
