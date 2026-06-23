import { describe, it, expect } from "vitest";
import { taiSanChuaCoViTri, trongVung, ganViTri } from "./assign";
import { taiSanMau, viTriPinMau } from "../sampleData";

describe("assign — gán vị trí (F11)", () => {
  it("TC-S01-14/16: chỉ liệt kê tài sản chưa có vị trí (ẩn A-007/A-009 đã có)", () => {
    const ds = taiSanChuaCoViTri(taiSanMau, viTriPinMau).map((t) => t.maTaiSan);
    expect(ds).toEqual(["B-021", "B-045"]);
    expect(ds).not.toContain("A-007");
  });

  it("TC-S01-15: gán B-021 tại (40,55) tạo pin đúng tọa độ", () => {
    const kq = ganViTri("B-021", "phong-305", 40, 55);
    expect(kq.ok).toBe(true);
    expect(kq.pin).toMatchObject({ maTaiSan: "B-021", toaDoX: 40, toaDoY: 55, trangThai: "DaGanViTri" });
  });

  it("TC-S01-17: chưa chọn tài sản → chặn + wording đúng", () => {
    const kq = ganViTri(null, "phong-305", 40, 55);
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Vui lòng chọn một tài sản chưa có vị trí");
  });

  it("TC-S01-21: biên tọa độ — (0,100) hợp lệ, (101,..) ngoài vùng", () => {
    expect(trongVung(0, 100)).toBe(true);
    expect(trongVung(101, 50)).toBe(false);
    expect(ganViTri("B-021", "phong-305", 101, 50).loi).toBe("Vị trí nằm ngoài sơ đồ");
  });

  it("TC-S01-18: tài sản đang bị khóa → chặn gán", () => {
    const kq = ganViTri("B-045", "phong-305", 10, 10, new Set(["B-045"]));
    expect(kq.ok).toBe(false);
    expect(kq.loi).toBe("Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.");
  });
});
