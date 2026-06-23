import { describe, it, expect } from "vitest";
import type { NutKhuVuc, TaiSan, ViTriPin } from "../types";
import type { BanGhiLichSu } from "../lich-su/lichSuService";
import {
  tinhPhamVi,
  uocTinhSoDong,
  chuoiUocTinh,
  lanDiDoiGanNhat,
  chuanHoaCot,
  dungBangBaoCao,
  sinhNoiDungFile,
  taoBlobBaoCao,
  chuoiThanhCong,
  COT_MAC_DINH,
  NHAN_CHUA_GAN_VI_TRI,
  type NguonDuLieu,
  type KhoaCot,
} from "./xuatBaoCaoService";

// --- Bối cảnh dữ liệu mẫu (test.md) ---
// Cây: Tòa A › (Tầng 1, Tầng 2, Tầng 3 › (Phòng 305, Phòng 306)); Tòa B rỗng.
const nodes: NutKhuVuc[] = [
  { maNut: "A", tenKhuVuc: "Tòa A", nutCha: null },
  { maNut: "T1", tenKhuVuc: "Tầng 1", nutCha: "A" },
  { maNut: "T2", tenKhuVuc: "Tầng 2", nutCha: "A" },
  { maNut: "T3", tenKhuVuc: "Tầng 3", nutCha: "A" },
  { maNut: "P305", tenKhuVuc: "Phòng 305", nutCha: "T3" },
  { maNut: "P306", tenKhuVuc: "Phòng 306", nutCha: "T3" },
  { maNut: "B", tenKhuVuc: "Tòa B", nutCha: null },
];

/** Sinh 1.250 tài sản TS-0001..TS-1250. */
function taoTaiSan(n: number): TaiSan[] {
  return Array.from({ length: n }, (_, i) => ({
    maTaiSan: `TS-${String(i + 1).padStart(4, "0")}`,
    ten: `Tài sản ${i + 1}`,
    trangThai: "DangSuDung",
  }));
}

const taiSan = taoTaiSan(1250);

/**
 * Pins: phân 1.250 tài sản cho các tầng/phòng con của Tòa A để Tòa A (gồm con) = 1.248,
 * Tầng 3 (trực tiếp) = 1 (TS-1000). 2 tài sản còn lại (TS-0001) gán Tầng 1 ... ta bố trí:
 * - TS-1000 đặt trực tiếp tại Tầng 3.
 * - TS-1249, TS-1250 KHÔNG gán pin (để tổng pin = 1.248 trong nhánh Tòa A).
 */
function taoPins(): ViTriPin[] {
  const ps: ViTriPin[] = [];
  // 1248 tài sản đầu vào nhánh Tòa A: TS-1000 đặt trực tiếp Tầng 3, còn lại rải Tầng1/2 + Phòng 305/306.
  for (let i = 1; i <= 1248; i++) {
    const ma = `TS-${String(i).padStart(4, "0")}`;
    let maNut: string;
    if (i === 1000) maNut = "T3"; // trực tiếp tại Tầng 3
    else if (i % 4 === 0) maNut = "P305";
    else if (i % 4 === 1) maNut = "P306";
    else if (i % 4 === 2) maNut = "T1";
    else maNut = "T2";
    ps.push({ maTaiSan: ma, maNut, toaDoX: 10, toaDoY: 20, trangThai: "DaGanViTri" });
  }
  // TS-1249, TS-1250: không gán vị trí.
  return ps;
}

const pins = taoPins();
const nguon: NguonDuLieu = { nodes, taiSan, pins };

describe("tinhPhamVi / uocTinh — S08 phạm vi", () => {
  it("TC-S08-16/23: phạm vi Toàn bộ = 1.250 tài sản", () => {
    const ds = tinhPhamVi(nguon, { loai: "toan_bo" });
    expect(ds).toHaveLength(1250);
    expect(uocTinhSoDong(nguon, { loai: "toan_bo" })).toBe(1250);
    expect(chuoiUocTinh(1250)).toBe("Ước tính: 1.250 tài sản trong phạm vi đã chọn");
  });

  it("TC-S08-06/24: Tòa A gồm khu con = 1.248 (Tòa A trực tiếp 0)", () => {
    expect(uocTinhSoDong(nguon, { loai: "theo_khu_vuc", maNut: "A", gomKhuCon: true })).toBe(1248);
  });

  it("TC-S08-07: Tầng 3 tắt khu con = 1 (TS-1000), không gồm Phòng 305/306", () => {
    const ds = tinhPhamVi(nguon, { loai: "theo_khu_vuc", maNut: "T3", gomKhuCon: false });
    expect(ds).toHaveLength(1);
    expect(ds[0].maTaiSan).toBe("TS-1000");
  });

  it("TC-S08-09: tài sản cấp cháu (Phòng 305) vẫn được tính khi gồm con", () => {
    const ds = tinhPhamVi(nguon, { loai: "theo_khu_vuc", maNut: "A", gomKhuCon: true });
    const coP305 = pins.find((p) => p.maNut === "P305")!.maTaiSan;
    expect(ds.some((t) => t.maTaiSan === coP305)).toBe(true);
  });

  it("TC-S08-18: Tòa B (rỗng) = 0", () => {
    expect(uocTinhSoDong(nguon, { loai: "theo_khu_vuc", maNut: "B", gomKhuCon: true })).toBe(0);
  });

  it("TC-S08-04: theo khu vực nhưng chưa chọn nút → 0 (UI sẽ chặn)", () => {
    expect(uocTinhSoDong(nguon, { loai: "theo_khu_vuc", maNut: null, gomKhuCon: true })).toBe(0);
  });

  it("TC-S08-08: theo bộ lọc khớp 37 tài sản → 37", () => {
    const maLoc = taiSan.slice(0, 37).map((t) => t.maTaiSan);
    expect(uocTinhSoDong(nguon, { loai: "theo_bo_loc", maTaiSanLoc: maLoc })).toBe(37);
  });

  it("TC-S08-20: theo bộ lọc khớp 0 tài sản → 0", () => {
    expect(uocTinhSoDong(nguon, { loai: "theo_bo_loc", maTaiSanLoc: [] })).toBe(0);
  });

  it("TC-S08-21: phạm vi đúng 1 tài sản (biên 0+1)", () => {
    expect(uocTinhSoDong(nguon, { loai: "theo_khu_vuc", maNut: "T3", gomKhuCon: false })).toBe(1);
  });
});

describe("lanDiDoiGanNhat — BRule-S08-03", () => {
  it("TC-S08-26: lấy bản ghi mới nhất 2026-05-20", () => {
    const bg: BanGhiLichSu[] = [
      { thoiDiem: "2026-01-10T08:00:00", nguoi: "A", viTriCu: null, viTriMoi: "X" },
      { thoiDiem: "2026-05-20T09:00:00", nguoi: "A", viTriCu: "X", viTriMoi: "Y" },
      { thoiDiem: "2026-03-05T10:00:00", nguoi: "A", viTriCu: "Y", viTriMoi: "Z" },
    ];
    expect(lanDiDoiGanNhat(bg)).toBe("20/05/2026 09:00");
  });

  it("TC-S08-25: chưa từng di dời → trống", () => {
    expect(lanDiDoiGanNhat([])).toBe("");
    expect(lanDiDoiGanNhat(undefined)).toBe("");
  });
});

describe("chuanHoaCot / dungBangBaoCao — S08 cột", () => {
  const ds = taiSan.slice(0, 2); // TS-0001, TS-0002

  it("TC-S08-10/13: mặc định 5 cột đúng thứ tự chuẩn (biên max)", () => {
    const bang = dungBangBaoCao(ds, COT_MAC_DINH, nguon);
    expect(bang.header).toEqual([
      "Mã tài sản", "Tên", "Đường dẫn khu vực", "Vị trí", "Lần di dời gần nhất",
    ]);
    expect(bang.rows[0]).toHaveLength(5);
  });

  it("TC-S08-11: bỏ Vị trí + Lần di dời → đúng 3 cột theo thứ tự", () => {
    const bang = dungBangBaoCao(ds, ["ma", "ten", "duong_dan"], nguon);
    expect(bang.header).toEqual(["Mã tài sản", "Tên", "Đường dẫn khu vực"]);
  });

  it("TC-S08-12: chỉ 1 cột Mã tài sản (biên min = 1)", () => {
    const bang = dungBangBaoCao(ds, ["ma"], nguon);
    expect(bang.header).toEqual(["Mã tài sản"]);
    expect(bang.rows[0]).toEqual(["TS-0001"]);
  });

  it("TC-S08-15: tick lộn xộn vẫn giữ thứ tự chuẩn", () => {
    const cot: KhoaCot[] = ["lan_di_doi", "ma", "vi_tri", "duong_dan"]; // lộn xộn, bỏ "ten"
    const bang = dungBangBaoCao(ds, cot, nguon);
    expect(bang.cot).toEqual(["ma", "duong_dan", "vi_tri", "lan_di_doi"]);
  });

  it("chuanHoaCot loại trùng & giữ thứ tự chuẩn", () => {
    expect(chuanHoaCot(["ten", "ma", "ten"])).toEqual(["ma", "ten"]);
  });

  it("TC-S08-27: tài sản chưa gán vị trí vẫn có dòng, ô vị trí/đường dẫn = 'Chưa gán vị trí'", () => {
    // TS-1249 không có pin trong bộ dữ liệu mẫu (xem taoPins).
    const ts777: TaiSan = { maTaiSan: "TS-1249", ten: "Không pin", trangThai: "x" };
    const bang = dungBangBaoCao([ts777], COT_MAC_DINH, nguon);
    expect(bang.rows).toHaveLength(1);
    expect(bang.rows[0][2]).toBe(NHAN_CHUA_GAN_VI_TRI); // đường dẫn
    expect(bang.rows[0][3]).toBe(NHAN_CHUA_GAN_VI_TRI); // vị trí
  });

  it("dẫn xuất đường dẫn khu vực từ pin (TS-1000 ở Tầng 3)", () => {
    const ts1000 = taiSan.find((t) => t.maTaiSan === "TS-1000")!;
    const bang = dungBangBaoCao([ts1000], ["ma", "duong_dan"], nguon);
    expect(bang.rows[0][1]).toBe("Tòa A › Tầng 3");
  });
});

describe("sinh nội dung file & toast — S08 xuất", () => {
  it("TC-S08-23: 1.250 dòng + header = 1.251 dòng nội dung", () => {
    const ds = tinhPhamVi(nguon, { loai: "toan_bo" });
    const bang = dungBangBaoCao(ds, COT_MAC_DINH, nguon);
    const noiDung = sinhNoiDungFile(bang);
    expect(noiDung.split("\r\n")).toHaveLength(1251);
    expect(chuoiThanhCong(1250)).toBe("Đã xuất 1.250 tài sản");
  });

  it("TC-S08-28: BOM UTF-8 ở đầu + giữ dấu tiếng Việt", () => {
    const ts042: TaiSan = { maTaiSan: "TS-0042", ten: "Máy bơm chữa cháy tầng hầm", trangThai: "x" };
    const bang = dungBangBaoCao([ts042], ["ma", "ten"], nguon);
    const noiDung = sinhNoiDungFile(bang);
    expect(noiDung.charCodeAt(0)).toBe(0xfeff); // BOM
    expect(noiDung).toContain("Máy bơm chữa cháy tầng hầm");
  });

  it("ô chứa dấu phẩy được bọc nháy kép (RFC 4180)", () => {
    const tsPhay: TaiSan = { maTaiSan: "TS-9", ten: "Máy A, loại 2", trangThai: "x" };
    const bang = dungBangBaoCao([tsPhay], ["ma", "ten"], nguon);
    expect(sinhNoiDungFile(bang)).toContain('"Máy A, loại 2"');
  });

  it("taoBlobBaoCao trả về Blob có nội dung", () => {
    const blob = taoBlobBaoCao("a,b");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});
