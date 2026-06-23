import { describe, it, expect } from "vitest";
import {
  duocXemAudit, validateKhoangAudit, validateTuKhoa, locAudit, sapXep, phanTrang, nhanViTri,
  type BanGhiAudit,
} from "./auditService";

const rows: BanGhiAudit[] = [
  { thoiDiem: "2026-06-22T14:32:10", nguoi: "Nguyễn Văn A", hanhDong: "Di dời", doiTuong: "TS A-007 Máy nén", viTriCu: "Tầng 3·P305", viTriMoi: "Tầng 4·P410" },
  { thoiDiem: "2026-06-21T16:45:02", nguoi: "Nguyễn Văn A", hanhDong: "Xóa", doiTuong: 'Khu vực "P309"' },
  { thoiDiem: "2026-05-30T08:00:00", nguoi: "Trần Thị B", hanhDong: "Gán", doiTuong: "TS A-100" },
  { thoiDiem: "2026-06-15T10:00:00", nguoi: "Trần Thị B", hanhDong: "Di dời", doiTuong: "TS A-200" },
];

describe("auditService — phân quyền & hiển thị", () => {
  it("TC-S07-21: chỉ Quản trị được xem", () => {
    expect(duocXemAudit("QuanTri")).toBe(true);
    expect(duocXemAudit("GiamSat")).toBe(false);
  });

  it("TC-S07-01: sắp xếp mới nhất trước (mặc định desc)", () => {
    expect(sapXep(rows).map((r) => r.thoiDiem.slice(0, 10))).toEqual([
      "2026-06-22", "2026-06-21", "2026-06-15", "2026-05-30",
    ]);
  });

  it("TC-S07-18: đảo sang tăng dần", () => {
    expect(sapXep(rows, "asc")[0].thoiDiem.slice(0, 10)).toBe("2026-05-30");
  });

  it("TC-S07-03: hành động Xóa → cột vị trí '—'", () => {
    expect(nhanViTri(rows[1])).toBe("—");
    expect(nhanViTri(rows[0])).toBe("Tầng 3·P305 → Tầng 4·P410");
  });
});

describe("auditService — lọc AND (R-S07-06)", () => {
  it("TC-S07-04: lọc người Nguyễn Văn A", () => {
    expect(locAudit(rows, { nguoi: "Nguyễn Văn A" }).every((r) => r.nguoi === "Nguyễn Văn A")).toBe(true);
    expect(locAudit(rows, { nguoi: "Nguyễn Văn A" })).toHaveLength(2);
  });

  it("TC-S07-05: lọc hành động Di dời", () => {
    expect(locAudit(rows, { hanhDong: "Di dời" })).toHaveLength(2);
  });

  it("TC-S07-06: lọc khoảng 01/06–22/06 (bao gồm hai mốc)", () => {
    const kq = locAudit(rows, { tuNgay: "2026-06-01", denNgay: "2026-06-22" });
    expect(kq.map((r) => r.thoiDiem.slice(0, 10)).sort()).toEqual(["2026-06-15", "2026-06-21", "2026-06-22"]);
  });

  it("TC-S07-08: biên Từ = Đến = 15/06 → bản ghi ngày đó", () => {
    expect(locAudit(rows, { tuNgay: "2026-06-15", denNgay: "2026-06-15" })).toHaveLength(1);
  });

  it("TC-S07-09: lọc đối tượng khớp một phần 'A-007'", () => {
    expect(locAudit(rows, { tuKhoa: "A-007" }).map((r) => r.doiTuong)).toEqual(["TS A-007 Máy nén"]);
  });

  it("TC-S07-11: từ khóa không tồn tại → rỗng", () => {
    expect(locAudit(rows, { tuKhoa: "Z-999-không-tồn-tại" })).toEqual([]);
  });

  it("TC-S07-12: tổ hợp AND — Di dời của Nguyễn Văn A trong 06/2026", () => {
    const kq = locAudit(rows, { nguoi: "Nguyễn Văn A", hanhDong: "Di dời", tuNgay: "2026-06-01", denNgay: "2026-06-30" });
    expect(kq).toHaveLength(1);
    expect(kq[0].doiTuong).toBe("TS A-007 Máy nén");
  });

  it("TC-S07-13: AND giao rỗng — Trần Thị B + Xóa", () => {
    expect(locAudit(rows, { nguoi: "Trần Thị B", hanhDong: "Xóa" })).toEqual([]);
  });

  it("TC-S07-14: không lọc gì → đủ bản ghi", () => {
    expect(locAudit(rows, {})).toHaveLength(4);
  });
});

describe("auditService — validation & phân trang", () => {
  it("TC-S07-07: Từ > Đến → lỗi wording riêng", () => {
    expect(validateKhoangAudit("2026-06-22", "2026-06-01")).toBe("Từ ngày phải nhỏ hơn hoặc bằng Đến ngày.");
  });

  it("TC-S07-10: từ khóa 101 ký tự → lỗi", () => {
    expect(validateTuKhoa("a".repeat(101))).toBe("Nhập tối đa 100 ký tự.");
    expect(validateTuKhoa("a".repeat(100))).toBeUndefined();
  });

  it("TC-S07-15: 1.284 bản ghi → trang 1 = 1–25 / 1284 / 52 trang", () => {
    const many = Array.from({ length: 1284 }, (_, i) => ({ ...rows[0], thoiDiem: `2026-06-22T14:00:${String(i % 60).padStart(2, "0")}` }));
    const tr = phanTrang(many, 1);
    expect(tr).toMatchObject({ total: 1284, tu: 1, den: 25, soTrang: 52 });
  });

  it("TC-S07-16: trang 2 → 26–50", () => {
    const many = Array.from({ length: 1284 }, () => rows[0]);
    expect(phanTrang(many, 2)).toMatchObject({ tu: 26, den: 50 });
  });

  it("TC-S07-17: 8 bản ghi (≤25) → 1 trang, ẩn pager", () => {
    const tam = Array.from({ length: 8 }, () => rows[0]);
    expect(phanTrang(tam, 1)).toMatchObject({ tu: 1, den: 8, soTrang: 1 });
  });
});
