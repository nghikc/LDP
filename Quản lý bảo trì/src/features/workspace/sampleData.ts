import type { NutKhuVuc, TaiSan, ViTriPin } from "./types";
import { SO_DO_MAU } from "./soDoPlaceholder";

// Dữ liệu mẫu khớp Test Data trong test.md S01.
// Cây: Tòa A › (Tầng 3 › Phòng 305, Phòng 306) , Tầng 4 ; Tòa B.

// Sinh cây lớn demo: 3 Chi nhánh → Tòa → Tầng → Phòng (~120 nút) để thử tìm/lọc cây.
function sinhCayLon(): NutKhuVuc[] {
  const ds: NutKhuVuc[] = [];
  for (let cn = 1; cn <= 3; cn++) {
    const cnId = `cn-${cn}`;
    ds.push({ maNut: cnId, tenKhuVuc: `Chi nhánh ${cn}`, maKhuVuc: `CN${cn}`, loaiKhuVuc: "Site", nutCha: null });
    const soToa = 2 + (cn % 2); // 2–3 tòa
    for (let t = 1; t <= soToa; t++) {
      const toaId = `${cnId}-toa-${t}`;
      ds.push({ maNut: toaId, tenKhuVuc: `Tòa ${String.fromCharCode(64 + t)}`, loaiKhuVuc: "Tòa", nutCha: cnId });
      for (let tg = 1; tg <= 3; tg++) {
        const tangId = `${toaId}-tang-${tg}`;
        ds.push({ maNut: tangId, tenKhuVuc: `Tầng ${tg}`, loaiKhuVuc: "Tầng", nutCha: toaId });
        const soPhong = 3 + (tg % 2); // 3–4 phòng
        for (let p = 1; p <= soPhong; p++) {
          const coSoDo = (cn + t + tg + p) % 3 === 0; // ~1/3 phòng có sơ đồ
          ds.push({
            maNut: `${tangId}-p-${p}`,
            tenKhuVuc: `Phòng ${tg}0${p}`,
            maKhuVuc: `${cnId.toUpperCase()}-P${tg}0${p}`,
            loaiKhuVuc: "Phòng",
            nutCha: tangId,
            soDoUrl: coSoDo ? SO_DO_MAU : undefined,
          });
        }
      }
    }
  }
  return ds;
}

export const nutKhuVucMau: NutKhuVuc[] = [
  { maNut: "toa-a", tenKhuVuc: "Tòa A", nutCha: null },
  { maNut: "tang-3", tenKhuVuc: "Tầng 3", nutCha: "toa-a" },
  { maNut: "phong-305", tenKhuVuc: "Phòng 305", nutCha: "tang-3", soDoUrl: SO_DO_MAU },
  { maNut: "phong-306", tenKhuVuc: "Phòng 306", nutCha: "tang-3" }, // chưa có sơ đồ
  { maNut: "tang-4", tenKhuVuc: "Tầng 4", nutCha: "toa-a", soDoUrl: SO_DO_MAU },
  { maNut: "toa-b", tenKhuVuc: "Tòa B", nutCha: null },
  // Demo di dời: Tòa B › Tầng 1 có 2 kho, MỖI kho 1 sơ đồ riêng.
  { maNut: "tang-b1", tenKhuVuc: "Tầng 1", nutCha: "toa-b" },
  { maNut: "kho-b01", tenKhuVuc: "Kho B-01", nutCha: "tang-b1", soDoUrl: SO_DO_MAU },
  { maNut: "kho-b02", tenKhuVuc: "Kho B-02", nutCha: "tang-b1", soDoUrl: SO_DO_MAU },
  ...sinhCayLon(),
];

// 50 tài sản demo (TS-001..TS-050) để minh họa di dời.
const LOAI_TS = ["Máy bơm", "Tủ điện", "Máy nén", "Băng tải", "Quạt CN", "Máy hàn", "Máy tiện", "Bồn chứa", "Động cơ", "Máy phát"];
const taiSanDemo: TaiSan[] = Array.from({ length: 50 }, (_, i) => {
  const so = String(i + 1).padStart(3, "0");
  return { maTaiSan: `TS-${so}`, ten: `${LOAI_TS[i % LOAI_TS.length]} ${so}`, trangThai: "Đang dùng" };
});
// Pin demo: 20 ở Kho B-01, 15 ở Kho B-02, 15 chưa gán vị trí (để demo cả gán lẫn di dời).
const pinDemo: ViTriPin[] = [];
taiSanDemo.forEach((t, i) => {
  if (i < 20) {
    pinDemo.push({ maTaiSan: t.maTaiSan, maNut: "kho-b01", toaDoX: 12 + (i % 5) * 18, toaDoY: 16 + Math.floor(i / 5) * 20, trangThai: "DaGanViTri" });
  } else if (i < 35) {
    const j = i - 20;
    pinDemo.push({ maTaiSan: t.maTaiSan, maNut: "kho-b02", toaDoX: 14 + (j % 5) * 17, toaDoY: 18 + Math.floor(j / 5) * 22, trangThai: "DaGanViTri" });
  }
  // i >= 35: chưa gán vị trí
});

export const taiSanMau: TaiSan[] = [
  { maTaiSan: "A-007", ten: "Máy nén khí", trangThai: "Đang dùng" },
  { maTaiSan: "A-009", ten: "Băng tải", trangThai: "Đang dùng" },
  { maTaiSan: "B-021", ten: "Máy bơm", trangThai: "Đang dùng" },
  { maTaiSan: "B-045", ten: "Tủ điện", trangThai: "Đang dùng" },
  ...taiSanDemo,
];

// A-007 đã có vị trí ở Phòng 305; A-009 đã có vị trí (đang khóa); B-021/B-045 chưa có vị trí.
export const viTriPinMau: ViTriPin[] = [
  { maTaiSan: "A-007", maNut: "phong-305", toaDoX: 30, toaDoY: 40, trangThai: "DaGanViTri" },
  { maTaiSan: "A-009", maNut: "phong-305", toaDoX: 55, toaDoY: 60, trangThai: "DangKhoa" },
  ...pinDemo,
];
