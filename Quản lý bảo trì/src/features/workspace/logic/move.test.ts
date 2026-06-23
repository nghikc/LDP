import { describe, it, expect } from "vitest";
import { chuyenNut } from "./move";
import { nutKhuVucMau } from "../sampleData";

describe("move — di chuyển nút (F05)", () => {
  it("TC-S01-33: kéo Phòng 305 vào Tầng 4 → cập nhật cha", () => {
    const kq = chuyenNut(nutKhuVucMau, "phong-305", "tang-4");
    expect(kq.ok).toBe(true);
    expect(kq.nodes!.find((n) => n.maNut === "phong-305")!.nutCha).toBe("tang-4");
  });

  it("TC-S01-34: kéo Tòa A vào Phòng 305 (nhánh con) → chặn", () => {
    const kq = chuyenNut(nutKhuVucMau, "toa-a", "phong-305");
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Không thể di chuyển khu vực vào chính nhánh con của nó.");
  });

  it("TC-S01-35: kéo Tầng 3 vào chính nó → chặn", () => {
    expect(chuyenNut(nutKhuVucMau, "tang-3", "tang-3").ok).toBe(false);
  });
});
