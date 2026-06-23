import { describe, it, expect } from "vitest";
import {
  sapXepGiamDan, validateKhoang, locTheoKhoang, nhanViTriCu, nhanLyDo, dinhDangThoiDiem,
  type BanGhiLichSu,
} from "./lichSuService";

// A-007: BG1 22/06, BG2 10/03 (không lý do), BG3 02/01 (vị trí cũ trống — gán lần đầu).
const bg: BanGhiLichSu[] = [
  { thoiDiem: "2026-01-02T08:00:00", nguoi: "Nguyễn Văn A", viTriCu: null, viTriMoi: "Tòa A › Tầng 2 › Kho", lyDo: "Gán vị trí lần đầu khi nhập kho" },
  { thoiDiem: "2026-06-22T14:30:00", nguoi: "Nguyễn Văn A", viTriCu: "Tòa A › Tầng 3 › Phòng 305", viTriMoi: "Tòa A › Tầng 4 › Phòng 410", lyDo: "Chuyển sang dây chuyền mới" },
  { thoiDiem: "2026-03-10T09:05:00", nguoi: "Nguyễn Văn A", viTriCu: "Tòa A › Tầng 4", viTriMoi: "Tòa A › Tầng 3 › Phòng 305" },
];

describe("lichSuService — S06", () => {
  it("TC-S06-01: sắp xếp giảm dần (22/06 → 10/03 → 02/01)", () => {
    expect(sapXepGiamDan(bg).map((b) => b.thoiDiem.slice(0, 10))).toEqual([
      "2026-06-22", "2026-03-10", "2026-01-02",
    ]);
  });

  it("TC-S06-02: định dạng thời điểm dd/MM/yyyy HH:mm", () => {
    expect(dinhDangThoiDiem("2026-06-22T14:30:00")).toBe("22/06/2026 14:30");
  });

  it("TC-S06-03: bản ghi không lý do → (Không có lý do)", () => {
    expect(nhanLyDo(bg[2])).toBe("(Không có lý do)");
    expect(nhanLyDo(bg[1])).toBe("Chuyển sang dây chuyền mới");
  });

  it("TC-S06-04: vị trí cũ trống → (Chưa có vị trí)", () => {
    expect(nhanViTriCu(bg[0])).toBe("(Chưa có vị trí)");
  });

  it("TC-S06-14: lọc 01/01–30/06 → cả 3 bản ghi", () => {
    expect(locTheoKhoang(bg, "2026-01-01", "2026-06-30")).toHaveLength(3);
  });

  it("TC-S06-15: khoảng đúng ngày BG2 (bao gồm hai mốc) → 1 bản ghi", () => {
    expect(locTheoKhoang(bg, "2026-03-10", "2026-03-10").map((b) => b.thoiDiem.slice(0, 10))).toEqual(["2026-03-10"]);
  });

  it("TC-S06-16: 11/03–21/06 (loại trừ sát biên) → 0", () => {
    expect(locTheoKhoang(bg, "2026-03-11", "2026-06-21")).toHaveLength(0);
  });

  it("TC-S06-17: chỉ Từ 01/06 → chỉ BG1", () => {
    expect(locTheoKhoang(bg, "2026-06-01", undefined).map((b) => b.thoiDiem.slice(0, 10))).toEqual(["2026-06-22"]);
  });

  it("TC-S06-18: chỉ Đến 28/02 → chỉ BG3", () => {
    expect(locTheoKhoang(bg, undefined, "2026-02-28").map((b) => b.thoiDiem.slice(0, 10))).toEqual(["2026-01-02"]);
  });

  it("TC-S06-20: Từ > Đến → lỗi, không lọc", () => {
    expect(validateKhoang("2026-06-30", "2026-01-01")).toBe("Từ ngày không được sau Đến ngày.");
    expect(validateKhoang("2026-01-01", "2026-06-30")).toBeUndefined();
  });
});
