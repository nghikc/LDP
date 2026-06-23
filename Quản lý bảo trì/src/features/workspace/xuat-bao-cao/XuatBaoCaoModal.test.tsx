import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { XuatBaoCaoModal } from "./XuatBaoCaoModal";
import type { NutKhuVuc, TaiSan, ViTriPin } from "../types";
import type { NguonDuLieu } from "./xuatBaoCaoService";

const nodes: NutKhuVuc[] = [
  { maNut: "A", tenKhuVuc: "Tòa A", nutCha: null },
  { maNut: "T1", tenKhuVuc: "Tầng 1", nutCha: "A" },
  { maNut: "T3", tenKhuVuc: "Tầng 3", nutCha: "A" },
  { maNut: "P305", tenKhuVuc: "Phòng 305", nutCha: "T3" },
  { maNut: "B", tenKhuVuc: "Tòa B", nutCha: null },
];

function taoTaiSan(n: number): TaiSan[] {
  return Array.from({ length: n }, (_, i) => ({
    maTaiSan: `TS-${String(i + 1).padStart(4, "0")}`,
    ten: `Tài sản ${i + 1}`,
    trangThai: "DangSuDung",
  }));
}
const taiSan = taoTaiSan(1250);

function taoPins(): ViTriPin[] {
  const ps: ViTriPin[] = [];
  for (let i = 1; i <= 1248; i++) {
    const ma = `TS-${String(i).padStart(4, "0")}`;
    const maNut = i === 1000 ? "T3" : i % 2 === 0 ? "P305" : "T1";
    ps.push({ maTaiSan: ma, maNut, toaDoX: 5, toaDoY: 5, trangThai: "DaGanViTri" });
  }
  return ps;
}
const nguon: NguonDuLieu = { nodes, taiSan, pins: taoPins() };

describe("XuatBaoCaoModal — S08", () => {
  it("TC-S08-01: hiện 3 radio phạm vi, đúng 1 chọn sẵn", () => {
    render(<XuatBaoCaoModal nguon={nguon} onDong={vi.fn()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios.filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
    expect(screen.getByLabelText(/Toàn bộ tài sản/)).toBeChecked();
  });

  it("TC-S08-02: có nút đang chọn → mặc định 'Theo khu vực', breadcrumb + gồm con bật", () => {
    render(<XuatBaoCaoModal nguon={nguon} maNutDangChon="T3" onDong={vi.fn()} />);
    expect(screen.getByLabelText(/Theo khu vực đang chọn/)).toBeChecked();
    expect(screen.getByText("Tòa A › Tầng 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Gồm cả các khu vực con/)).toBeChecked();
  });

  it("TC-S08-03: không có nút chọn → mặc định 'Toàn bộ', khóa 'Theo khu vực'", () => {
    render(<XuatBaoCaoModal nguon={nguon} maNutDangChon={null} onDong={vi.fn()} />);
    expect(screen.getByLabelText(/Toàn bộ tài sản/)).toBeChecked();
    expect(screen.getByLabelText(/Theo khu vực đang chọn/)).toBeDisabled();
  });

  it("TC-S08-10: 5 cột đều tick sẵn", () => {
    render(<XuatBaoCaoModal nguon={nguon} onDong={vi.fn()} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(5);
    checkboxes.forEach((c) => expect(c).toBeChecked());
  });

  it("TC-S08-16: ước tính Toàn bộ = 1.250", () => {
    render(<XuatBaoCaoModal nguon={nguon} onDong={vi.fn()} />);
    expect(screen.getByText("Ước tính: 1.250 tài sản trong phạm vi đã chọn")).toBeInTheDocument();
  });

  it("TC-S08-17: đổi phạm vi Toàn bộ → Tòa A gồm con cập nhật 1.250 → 1.248", async () => {
    const user = userEvent.setup();
    render(<XuatBaoCaoModal nguon={nguon} maNutDangChon="A" onDong={vi.fn()} />);
    // Bắt đầu ở Toàn bộ vì... maNutDangChon="A" → mặc định theo_khu_vuc; chuyển sang toàn bộ trước.
    await user.click(screen.getByLabelText(/Toàn bộ tài sản/));
    expect(screen.getByText(/1\.250 tài sản/)).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Theo khu vực đang chọn/));
    expect(screen.getByText(/1\.248 tài sản/)).toBeInTheDocument();
  });

  it("TC-S08-14: bỏ tick cả 5 cột → chặn xuất + báo lỗi", async () => {
    const user = userEvent.setup();
    render(<XuatBaoCaoModal nguon={nguon} onDong={vi.fn()} />);
    for (const c of screen.getAllByRole("checkbox")) await user.click(c);
    expect(screen.getByRole("alert")).toHaveTextContent("Chọn ít nhất một cột để xuất.");
    expect(screen.getByRole("button", { name: "Xuất Excel" })).toBeDisabled();
  });

  it("TC-S08-18/19: phạm vi Tòa B rỗng → Empty + nút Xuất Excel vô hiệu", async () => {
    const user = userEvent.setup();
    render(<XuatBaoCaoModal nguon={nguon} maNutDangChon="B" onDong={vi.fn()} />);
    await user.click(screen.getByLabelText(/Theo khu vực đang chọn/));
    expect(screen.getByText("Không có dữ liệu để xuất")).toBeInTheDocument();
    expect(screen.getByText("Phạm vi không có dữ liệu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xuất Excel" })).toBeDisabled();
  });

  it("TC-S08-21: phạm vi 1 tài sản (Tầng 3, tắt khu con) → ước tính 1, cho xuất", async () => {
    const user = userEvent.setup();
    render(<XuatBaoCaoModal nguon={nguon} maNutDangChon="T3" onDong={vi.fn()} />);
    await user.click(screen.getByLabelText(/Gồm cả các khu vực con/)); // tắt
    expect(screen.getByText(/Ước tính: 1 tài sản/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xuất Excel" })).toBeEnabled();
  });

  it("TC-S08-23: xuất toàn bộ → tải file + toast 'Đã xuất 1.250 tài sản'", async () => {
    const user = userEvent.setup();
    const onTaiFile = vi.fn();
    render(<XuatBaoCaoModal nguon={nguon} onTaiFile={onTaiFile} onDong={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Xuất Excel" }));
    expect(onTaiFile).toHaveBeenCalledTimes(1);
    expect(onTaiFile.mock.calls[0][1]).toBe("baocao.xlsx");
    expect(screen.getByText(/Đã xuất 1\.250 tài sản/)).toBeInTheDocument();
  });

  it("TC-S08-24: Tòa A gồm con → toast 'Đã xuất 1.248 tài sản'", async () => {
    const user = userEvent.setup();
    const onTaiFile = vi.fn();
    render(<XuatBaoCaoModal nguon={nguon} maNutDangChon="A" onTaiFile={onTaiFile} onDong={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Xuất Excel" }));
    expect(screen.getByText(/Đã xuất 1\.248 tài sản/)).toBeInTheDocument();
  });
});
