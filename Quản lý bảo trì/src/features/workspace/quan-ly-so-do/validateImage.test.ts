import { describe, it, expect } from "vitest";
import { validateImage, MAX_KICH_THUOC, LOI_DINH_DANG, type ThongTinFile } from "./validateImage";

const MB = 1024 * 1024;
function f(ten: string, loai: string, mb: number): ThongTinFile {
  return { ten, loai, kichThuoc: Math.round(mb * MB) };
}

describe("validateImage — định dạng & dung lượng (R-S03-03, BVA/EP)", () => {
  it("TC-S03-04: .gif sai định dạng → chặn + thông điệp chuẩn", () => {
    expect(validateImage(f("tang3.gif", "image/gif", 2))).toBe(LOI_DINH_DANG);
  });

  it("TC-S03-05: .pdf không phải ảnh → chặn", () => {
    expect(validateImage(f("tang3.pdf", "application/pdf", 1))).toBe(LOI_DINH_DANG);
  });

  it("TC-S03-06: PNG đúng 10 MB (10485760 byte) → hợp lệ (biên dưới)", () => {
    expect(MAX_KICH_THUOC).toBe(10485760);
    expect(validateImage({ ten: "tang3.png", loai: "image/png", kichThuoc: 10485760 })).toBeUndefined();
  });

  it("TC-S03-07: PNG 11 MB (11534336 byte) → chặn (vượt biên)", () => {
    expect(validateImage({ ten: "tang3.png", loai: "image/png", kichThuoc: 11534336 })).toBe(LOI_DINH_DANG);
  });

  it("TC-S03-07b: ngay trên biên 10485761 byte → chặn", () => {
    expect(validateImage({ ten: "tang3.png", loai: "image/png", kichThuoc: 10485761 })).toBe(LOI_DINH_DANG);
  });

  it("TC-S03-08: JPG 3.5 MB hợp lệ → cho phép", () => {
    expect(validateImage(f("tang3.jpg", "image/jpeg", 3.5))).toBeUndefined();
  });

  it("TC-S03-02: PNG 8 MB hợp lệ → cho phép", () => {
    expect(validateImage(f("tang3.png", "image/png", 8))).toBeUndefined();
  });
});
