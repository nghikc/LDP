import { describe, it, expect } from "vitest";
import { goViTri, demAnhHuongXoa, wordingXacNhanXoa, xoaNut } from "./remove";
import { taoBanGhiKiemToan } from "./audit";
import { nutKhuVucMau, viTriPinMau } from "../sampleData";
import type { NutKhuVuc, ViTriPin } from "../types";

describe("remove — gỡ vị trí (F14)", () => {
  it("TC-S01-23: gỡ A-007 → pin biến mất, tài sản về chưa có vị trí", () => {
    const kq = goViTri(viTriPinMau, "A-007");
    expect(kq.ok).toBe(true);
    expect(kq.pins!.some((p) => p.maTaiSan === "A-007")).toBe(false);
  });

  it("TC-S01-25: gỡ pin đang khóa (A-009) → chặn", () => {
    const kq = goViTri(viTriPinMau, "A-009");
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.");
  });

  it("TC-S01-24: gỡ thành công sinh bản ghi kiểm toán đúng trường", () => {
    const bg = taoBanGhiKiemToan("giangnb", "go-vi-tri", "A-007", "2026-06-23T10:00:00Z");
    expect(bg).toMatchObject({ nguoiThucHien: "giangnb", hanhDong: "go-vi-tri", doiTuong: "A-007" });
  });
});

describe("remove — xóa nút khu vực (F03)", () => {
  // Cây test: t3 có 2 khu con (p305, p306) + 12 tài sản (đặt rải trong p305/p306).
  const nodes: NutKhuVuc[] = [
    { maNut: "t3", tenKhuVuc: "Tầng 3", nutCha: "toaA" },
    { maNut: "p305", tenKhuVuc: "Phòng 305", nutCha: "t3" },
    { maNut: "p306", tenKhuVuc: "Phòng 306", nutCha: "t3" },
    { maNut: "kho", tenKhuVuc: "Kho", nutCha: "t3" },
  ];
  const pins: ViTriPin[] = Array.from({ length: 12 }, (_, i) => ({
    maTaiSan: `X-${i}`,
    maNut: i < 6 ? "p305" : "p306",
    toaDoX: i,
    toaDoY: i,
    trangThai: "DaGanViTri" as const,
  }));

  it("TC-S01-37: đếm đúng 12 tài sản + 3 khu con", () => {
    expect(demAnhHuongXoa(nodes, pins, "t3")).toEqual({ soTaiSan: 12, soKhuCon: 3 });
    expect(wordingXacNhanXoa({ soTaiSan: 12, soKhuCon: 3 })).toBe(
      "Xóa khu vực này sẽ gỡ vị trí của 12 tài sản và xóa 3 khu vực con. Tiếp tục?",
    );
  });

  it("TC-S01-40: nút rỗng → 0 tài sản, 0 khu con", () => {
    expect(demAnhHuongXoa(nodes, pins, "kho")).toEqual({ soTaiSan: 0, soKhuCon: 0 });
  });

  it("TC-S01-38: xóa nhánh → gỡ pin bên trong, giữ nút khác", () => {
    const kq = xoaNut(nodes, pins, "t3");
    expect(kq.nodes.map((n) => n.maNut)).toEqual([]); // t3 + p305 + p306 + kho đều bị xóa
    expect(kq.pins).toHaveLength(0); // 12 pin trong p305/p306 bị gỡ
  });

  it("TC-S01-40 (xóa nút rỗng độc lập không ảnh hưởng nút khác)", () => {
    const kq = xoaNut(nodes, pins, "kho");
    expect(kq.nodes.map((n) => n.maNut).sort()).toEqual(["p305", "p306", "t3"].sort());
    expect(kq.pins).toHaveLength(12);
  });

  it("sample data thực: Tầng 3 chứa A-007/A-009 (đặt ở phong-305) → đếm 2 tài sản", () => {
    expect(demAnhHuongXoa(nutKhuVucMau, viTriPinMau, "tang-3")).toEqual({ soTaiSan: 2, soKhuCon: 2 });
  });
});
