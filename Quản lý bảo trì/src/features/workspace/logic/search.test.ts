import { describe, it, expect } from "vitest";
import { boChuDau, timTaiSan, GIOI_HAN_TU_KHOA } from "./search";
import { taiSanMau } from "../sampleData";

describe("search — tra cứu nhanh (F16)", () => {
  it("boChuDau bỏ dấu + thường hóa", () => {
    expect(boChuDau("Máy Nén Khí")).toBe("may nen khi");
    expect(boChuDau("Tủ điện")).toBe("tu dien");
  });

  it("TC-S01-27: gõ 'may nen' (không dấu) khớp 'Máy nén khí'", () => {
    const kq = timTaiSan(taiSanMau, "may nen");
    expect(kq.map((t) => t.maTaiSan)).toContain("A-007");
  });

  it("TC-S01-29: gõ mã 'B-021' khớp đúng tài sản", () => {
    expect(timTaiSan(taiSanMau, "B-021").map((t) => t.maTaiSan)).toEqual(["B-021"]);
  });

  it("TC-S01-30: từ khóa không tồn tại trả rỗng", () => {
    expect(timTaiSan(taiSanMau, "ZZZ-999")).toEqual([]);
  });

  it("TC-S01-31: cắt từ khóa tối đa 100 ký tự (biên), từ khóa rỗng trả rỗng", () => {
    expect(timTaiSan(taiSanMau, "")).toEqual([]);
    const dai = "A".repeat(101);
    expect(dai.slice(0, GIOI_HAN_TU_KHOA).length).toBe(100);
    // không lỗi khi vượt giới hạn
    expect(() => timTaiSan(taiSanMau, dai)).not.toThrow();
  });
});
