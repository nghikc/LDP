import { describe, it, expect } from "vitest";
import { locNutChaHopLe, taoNut, suaNut } from "./khuVucService";
import { nutKhuVucMau } from "../sampleData";

describe("locNutChaHopLe (R-S02-08, TC-S02-26)", () => {
  it("khi Sửa 'Tầng 3' → ẩn chính nó + con (Phòng 305/306)", () => {
    const ds = locNutChaHopLe(nutKhuVucMau, "tang-3").map((n) => n.maNut);
    expect(ds).not.toContain("tang-3");
    expect(ds).not.toContain("phong-305");
    expect(ds).not.toContain("phong-306");
    expect(ds).toContain("toa-b"); // ngoài nhánh vẫn còn
  });
  it("khi Tạo (không có nút hiện tại) → trả mọi nút", () => {
    expect(locNutChaHopLe(nutKhuVucMau)).toHaveLength(nutKhuVucMau.length);
  });
});

describe("taoNut (F01)", () => {
  it("TC-S02-03: tạo 'Phòng 307' dưới 'Tầng 3'", () => {
    const nodes = taoNut(nutKhuVucMau, "phong-307", { ten: "Phòng 307", ma: "", nutCha: "tang-3" });
    const moi = nodes.find((n) => n.maNut === "phong-307")!;
    expect(moi).toMatchObject({ tenKhuVuc: "Phòng 307", nutCha: "tang-3" });
    expect(moi.maKhuVuc).toBeUndefined();
  });
  it("TC-S02-04: để trống Nút cha → tạo ở gốc", () => {
    const nodes = taoNut(nutKhuVucMau, "kho-tong", { ten: "Kho tổng", ma: "", nutCha: null });
    expect(nodes.find((n) => n.maNut === "kho-tong")!.nutCha).toBeNull();
  });
  it("TC-S02-06: tạo với Loại", () => {
    const nodes = taoNut(nutKhuVucMau, "tang-5", { ten: "Tầng 5", ma: "", loai: "Tầng", nutCha: "toa-a" });
    expect(nodes.find((n) => n.maNut === "tang-5")!.loaiKhuVuc).toBe("Tầng");
  });
});

describe("suaNut (F02)", () => {
  it("TC-S02-10: đổi Tên Phòng 305 → 305A", () => {
    const nodes = suaNut(nutKhuVucMau, "phong-305", { ten: "Phòng 305A", ma: "P305", nutCha: "tang-3" });
    expect(nodes.find((n) => n.maNut === "phong-305")!.tenKhuVuc).toBe("Phòng 305A");
  });
  it("TC-S02-11: đổi Nút cha Phòng 305 → Tầng 4", () => {
    const nodes = suaNut(nutKhuVucMau, "phong-305", { ten: "Phòng 305", ma: "", nutCha: "tang-4" });
    expect(nodes.find((n) => n.maNut === "phong-305")!.nutCha).toBe("tang-4");
  });
});
