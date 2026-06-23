import type { NutKhuVuc, TaiSan, ViTriPin } from "./types";
import { SO_DO_MAU } from "./soDoPlaceholder";

// Dữ liệu mẫu khớp Test Data trong test.md S01.
// Cây: Tòa A › (Tầng 3 › Phòng 305, Phòng 306) , Tầng 4 ; Tòa B.

export const nutKhuVucMau: NutKhuVuc[] = [
  { maNut: "toa-a", tenKhuVuc: "Tòa A", nutCha: null },
  { maNut: "tang-3", tenKhuVuc: "Tầng 3", nutCha: "toa-a" },
  { maNut: "phong-305", tenKhuVuc: "Phòng 305", nutCha: "tang-3", soDoUrl: SO_DO_MAU },
  { maNut: "phong-306", tenKhuVuc: "Phòng 306", nutCha: "tang-3" }, // chưa có sơ đồ
  { maNut: "tang-4", tenKhuVuc: "Tầng 4", nutCha: "toa-a", soDoUrl: SO_DO_MAU },
  { maNut: "toa-b", tenKhuVuc: "Tòa B", nutCha: null },
];

export const taiSanMau: TaiSan[] = [
  { maTaiSan: "A-007", ten: "Máy nén khí", trangThai: "Đang dùng" },
  { maTaiSan: "A-009", ten: "Băng tải", trangThai: "Đang dùng" },
  { maTaiSan: "B-021", ten: "Máy bơm", trangThai: "Đang dùng" },
  { maTaiSan: "B-045", ten: "Tủ điện", trangThai: "Đang dùng" },
];

// A-007 đã có vị trí ở Phòng 305; A-009 đã có vị trí (đang khóa); B-021/B-045 chưa có vị trí.
export const viTriPinMau: ViTriPin[] = [
  { maTaiSan: "A-007", maNut: "phong-305", toaDoX: 30, toaDoY: 40, trangThai: "DaGanViTri" },
  { maTaiSan: "A-009", maNut: "phong-305", toaDoX: 55, toaDoY: 60, trangThai: "DangKhoa" },
];
