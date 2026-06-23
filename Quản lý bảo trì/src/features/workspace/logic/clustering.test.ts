import { describe, it, expect } from "vitest";
import { gomCumPin, gomTheoViTri, locPinTheoTrangThai, NGUONG_GOM_CUM } from "./clustering";
import type { ViTriPin } from "../types";

function taoPins(n: number): ViTriPin[] {
  return Array.from({ length: n }, (_, i) => ({
    maTaiSan: `T-${i}`,
    maNut: "tang-3",
    toaDoX: (i * 7) % 100,
    toaDoY: (i * 13) % 100,
    trangThai: "DaGanViTri" as const,
  }));
}

describe("clustering — gom cụm/lọc pin (F10)", () => {
  it("TC-S01-11: đúng 500 pin → KHÔNG gom (mỗi pin rời)", () => {
    const kq = gomCumPin(taoPins(NGUONG_GOM_CUM));
    expect(kq).toHaveLength(500);
    expect(kq.every((c) => c.soLuong === 1)).toBe(true);
  });

  it("TC-S01-10: 501 pin → có gom cụm (số cụm < số pin, tổng pin giữ nguyên)", () => {
    const kq = gomCumPin(taoPins(501));
    expect(kq.length).toBeLessThan(501);
    expect(kq.reduce((s, c) => s + c.soLuong, 0)).toBe(501);
    expect(kq.some((c) => c.soLuong > 1)).toBe(true);
  });

  it("gomTheoViTri: nhiều tài sản cùng tọa độ → một vị trí", () => {
    const pins: ViTriPin[] = [
      { maTaiSan: "A-007", maNut: "p305", toaDoX: 40, toaDoY: 55, trangThai: "DaGanViTri" },
      { maTaiSan: "B-021", maNut: "p305", toaDoX: 40, toaDoY: 55, trangThai: "DaGanViTri" },
      { maTaiSan: "A-009", maNut: "p305", toaDoX: 10, toaDoY: 20, trangThai: "DaGanViTri" },
    ];
    const vt = gomTheoViTri(pins);
    expect(vt).toHaveLength(2); // 2 vị trí: (40,55) gồm 2 tài sản, (10,20) gồm 1
    const chung = vt.find((v) => v.toaDoX === 40 && v.toaDoY === 55)!;
    expect(chung.pins.map((p) => p.maTaiSan).sort()).toEqual(["A-007", "B-021"]);
  });

  it("TC-S01-13: lọc chỉ pin 'CanDatLai'", () => {
    const pins: ViTriPin[] = [
      { maTaiSan: "A-031", maNut: "t3", toaDoX: 1, toaDoY: 1, trangThai: "CanDatLai" },
      { maTaiSan: "A-007", maNut: "t3", toaDoX: 2, toaDoY: 2, trangThai: "DaGanViTri" },
      { maTaiSan: "A-052", maNut: "t3", toaDoX: 3, toaDoY: 3, trangThai: "CanDatLai" },
    ];
    expect(locPinTheoTrangThai(pins, "CanDatLai").map((p) => p.maTaiSan)).toEqual(["A-031", "A-052"]);
  });
});
