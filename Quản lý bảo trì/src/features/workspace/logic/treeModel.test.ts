import { describe, it, expect } from "vitest";
import { layNutCon, layMaConChau, laConChau, chuoiDuongDan } from "./treeModel";
import { nutKhuVucMau } from "../sampleData";

describe("treeModel — cây khu vực (TC-S01-01)", () => {
  it("layNutCon trả đúng con trực tiếp, nút gốc khi cha = null", () => {
    expect(layNutCon(nutKhuVucMau, null).map((n) => n.maNut)).toEqual(["toa-a", "toa-b"]);
    expect(layNutCon(nutKhuVucMau, "toa-a").map((n) => n.maNut)).toEqual(["tang-3", "tang-4"]);
    expect(layNutCon(nutKhuVucMau, "tang-3").map((n) => n.maNut)).toEqual(["phong-305", "phong-306"]);
  });

  it("layMaConChau trả mọi con cháu đệ quy", () => {
    expect(layMaConChau(nutKhuVucMau, "toa-a").sort()).toEqual(
      ["tang-3", "tang-4", "phong-305", "phong-306"].sort(),
    );
    expect(layMaConChau(nutKhuVucMau, "phong-305")).toEqual([]);
  });

  it("laConChau xác định quan hệ tổ tiên (phục vụ chặn vòng lặp TC-S01-34)", () => {
    expect(laConChau(nutKhuVucMau, "phong-305", "toa-a")).toBe(true);
    expect(laConChau(nutKhuVucMau, "toa-a", "phong-305")).toBe(false);
  });

  it("chuoiDuongDan dựng breadcrumb đúng (TC-S01-05)", () => {
    expect(chuoiDuongDan(nutKhuVucMau, "phong-305")).toBe("Tòa A › Tầng 3 › Phòng 305");
    expect(chuoiDuongDan(nutKhuVucMau, "toa-a")).toBe("Tòa A");
  });
});
