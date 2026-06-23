import { describe, it, expect } from "vitest";
import { validateTen, validateMa, validateNutCha, validateForm, formHopLe } from "./validateKhuVuc";
import { nutKhuVucMau } from "../sampleData";

// Thêm mã "P305" cho Phòng 305 để test trùng mã.
const nodes = nutKhuVucMau.map((n) =>
  n.maNut === "phong-305" ? { ...n, maKhuVuc: "P305" } : n,
);

describe("validateTen (R-S02-05)", () => {
  it("TC-S02-14: rỗng → lỗi bắt buộc", () => {
    expect(validateTen("")).toBe("Vui lòng nhập tên khu vực");
  });
  it("TC-S02-15/20: chỉ khoảng trắng → rỗng sau trim → lỗi", () => {
    expect(validateTen("     ")).toBe("Vui lòng nhập tên khu vực");
  });
  it("TC-S02-16: 1 ký tự (min) → hợp lệ", () => {
    expect(validateTen("A")).toBeUndefined();
  });
  it("TC-S02-17: 150 ký tự (max) → hợp lệ", () => {
    expect(validateTen("A".repeat(150))).toBeUndefined();
  });
  it("TC-S02-18: 151 ký tự → lỗi quá dài", () => {
    expect(validateTen("A".repeat(151))).toBe("Tên khu vực tối đa 150 ký tự");
  });
});

describe("validateMa (R-S02-06)", () => {
  it("TC-S02-21: Mã trùng 'P305' → lỗi", () => {
    expect(validateMa("P305", nodes)).toBe("Mã khu vực đã tồn tại");
  });
  it("TC-S02-22: Mã trống → hợp lệ (tùy chọn)", () => {
    expect(validateMa("", nodes)).toBeUndefined();
  });
  it("TC-S02-23: Mã duy nhất 'P999' → hợp lệ", () => {
    expect(validateMa("P999", nodes)).toBeUndefined();
  });
  it("TC-S02-12: Mã của chính nút khi Sửa → không coi trùng", () => {
    expect(validateMa("P305", nodes, "phong-305")).toBeUndefined();
  });
  it("TC-S02-24/25: 50 ký tự hợp lệ, 51 ký tự lỗi", () => {
    expect(validateMa("A".repeat(50), nodes)).toBeUndefined();
    expect(validateMa("A".repeat(51), nodes)).toBe("Mã khu vực tối đa 50 ký tự");
  });
});

describe("validateNutCha — chặn cây lặp (R-S02-08)", () => {
  it("TC-S02-27: gán chính nó → lỗi", () => {
    expect(validateNutCha("tang-3", nodes, "tang-3")).toBe(
      "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó",
    );
  });
  it("TC-S02-28: gán nhánh con → lỗi", () => {
    expect(validateNutCha("phong-305", nodes, "tang-3")).toBe(
      "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó",
    );
  });
  it("TC-S02-29: gán nút ngoài nhánh (Tòa B) → hợp lệ", () => {
    expect(validateNutCha("toa-b", nodes, "tang-3")).toBeUndefined();
  });
});

describe("validateForm tổng hợp", () => {
  it("form hợp lệ khi tất cả đạt", () => {
    const loi = validateForm({ ten: "Phòng 307", ma: "", nutCha: "tang-3" }, nodes);
    expect(formHopLe(loi)).toBe(true);
  });
  it("form lỗi gom đúng field", () => {
    const loi = validateForm({ ten: "", ma: "P305", nutCha: null }, nodes);
    expect(loi.ten).toBeDefined();
    expect(loi.ma).toBe("Mã khu vực đã tồn tại");
    expect(formHopLe(loi)).toBe(false);
  });
});
