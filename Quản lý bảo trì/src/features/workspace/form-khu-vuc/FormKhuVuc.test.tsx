import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormKhuVuc } from "./FormKhuVuc";
import { nutKhuVucMau } from "../sampleData";

const nodes = nutKhuVucMau.map((n) => (n.maNut === "phong-305" ? { ...n, maKhuVuc: "P305", loaiKhuVuc: "Phòng" } : n));

describe("FormKhuVuc — Tạo (F01)", () => {
  it("TC-S02-01: mở 'Thêm con' Tầng 3 → tiêu đề Thêm, Nút cha đặt sẵn", () => {
    render(<FormKhuVuc nodes={nodes} nutChaMacDinh="tang-3" onLuu={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Thêm khu vực" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nút cha")).toHaveValue("tang-3");
    expect(screen.getByLabelText("Tên khu vực *")).toHaveValue("");
  });

  it("TC-S02-02: mở ở gốc → Nút cha = (Gốc)", () => {
    render(<FormKhuVuc nodes={nodes} nutChaMacDinh={null} onLuu={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByLabelText("Nút cha")).toHaveValue("");
  });

  it("TC-S02-03: nhập Tên + Lưu → gọi onLuu với dữ liệu", async () => {
    const user = userEvent.setup();
    const onLuu = vi.fn();
    render(<FormKhuVuc nodes={nodes} nutChaMacDinh="tang-3" onLuu={onLuu} onDong={vi.fn()} />);
    await user.type(screen.getByLabelText("Tên khu vực *"), "Phòng 307");
    await user.click(screen.getByRole("button", { name: "Lưu" }));
    expect(onLuu).toHaveBeenCalledWith(expect.objectContaining({ ten: "Phòng 307", nutCha: "tang-3" }));
  });

  it("TC-S02-19: nút Lưu vô hiệu khi Tên trống, bật khi có Tên", async () => {
    const user = userEvent.setup();
    render(<FormKhuVuc nodes={nodes} onLuu={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Lưu" })).toBeDisabled();
    await user.type(screen.getByLabelText("Tên khu vực *"), "Phòng 308");
    expect(screen.getByRole("button", { name: "Lưu" })).toBeEnabled();
  });

  it("TC-S02-14: Lưu khi Tên trống bị ngăn (không gọi onLuu)", async () => {
    const onLuu = vi.fn();
    render(<FormKhuVuc nodes={nodes} onLuu={onLuu} onDong={vi.fn()} />);
    // nút disabled nên onLuu không thể gọi
    expect(screen.getByRole("button", { name: "Lưu" })).toBeDisabled();
    expect(onLuu).not.toHaveBeenCalled();
  });

  it("TC-S02-21: Mã trùng P305 → lỗi inline, không lưu", async () => {
    const user = userEvent.setup();
    const onLuu = vi.fn();
    render(<FormKhuVuc nodes={nodes} onLuu={onLuu} onDong={vi.fn()} />);
    await user.type(screen.getByLabelText("Tên khu vực *"), "Phòng 310");
    await user.type(screen.getByLabelText("Mã khu vực"), "P305");
    await user.click(screen.getByRole("button", { name: "Lưu" }));
    expect(screen.getByText("Mã khu vực đã tồn tại")).toBeInTheDocument();
    expect(onLuu).not.toHaveBeenCalled();
  });
});

describe("FormKhuVuc — Sửa (F02)", () => {
  it("TC-S02-09: nạp đúng dữ liệu hiện tại + tiêu đề Sửa", () => {
    const nut = nodes.find((n) => n.maNut === "phong-305")!;
    render(<FormKhuVuc nodes={nodes} nutSua={nut} onLuu={vi.fn()} onDong={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Sửa khu vực" })).toBeInTheDocument();
    expect(screen.getByLabelText("Tên khu vực *")).toHaveValue("Phòng 305");
    expect(screen.getByLabelText("Mã khu vực")).toHaveValue("P305");
    expect(screen.getByLabelText("Loại khu vực")).toHaveValue("Phòng");
    expect(screen.getByLabelText("Nút cha")).toHaveValue("tang-3");
  });

  it("TC-S02-26: Sửa Tầng 3 → dropdown Nút cha ẩn chính nó + con", () => {
    const nut = nodes.find((n) => n.maNut === "tang-3")!;
    render(<FormKhuVuc nodes={nodes} nutSua={nut} onLuu={vi.fn()} onDong={vi.fn()} />);
    const cha = screen.getByLabelText("Nút cha");
    expect(within(cha).queryByText(/Tầng 3/)).not.toBeInTheDocument();
    expect(within(cha).queryByText(/Phòng 305/)).not.toBeInTheDocument();
    expect(within(cha).getByText("Tòa B")).toBeInTheDocument();
  });

  it("TC-S02-10: đổi Tên + Lưu → onLuu nhận tên mới", async () => {
    const user = userEvent.setup();
    const onLuu = vi.fn();
    const nut = nodes.find((n) => n.maNut === "phong-305")!;
    render(<FormKhuVuc nodes={nodes} nutSua={nut} onLuu={onLuu} onDong={vi.fn()} />);
    const oTen = screen.getByLabelText("Tên khu vực *");
    await user.clear(oTen);
    await user.type(oTen, "Phòng 305A");
    await user.click(screen.getByRole("button", { name: "Lưu" }));
    expect(onLuu).toHaveBeenCalledWith(expect.objectContaining({ ten: "Phòng 305A" }));
  });
});

describe("FormKhuVuc — Hủy/đóng (R-S02-10)", () => {
  it("TC-S02-31: chưa sửa → Hủy đóng ngay", async () => {
    const user = userEvent.setup();
    const onDong = vi.fn();
    render(<FormKhuVuc nodes={nodes} onLuu={vi.fn()} onDong={onDong} />);
    await user.click(screen.getByRole("button", { name: "Hủy" }));
    expect(onDong).toHaveBeenCalled();
  });

  it("TC-S02-32: đã nhập → Hủy hỏi 'Bỏ thay đổi chưa lưu?', ở lại giữ dữ liệu", async () => {
    const user = userEvent.setup();
    const onDong = vi.fn();
    render(<FormKhuVuc nodes={nodes} onLuu={vi.fn()} onDong={onDong} />);
    await user.type(screen.getByLabelText("Tên khu vực *"), "Phòng 312");
    await user.click(screen.getByRole("button", { name: "Hủy" }));
    expect(screen.getByText("Bỏ thay đổi chưa lưu?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ở lại" }));
    expect(onDong).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Tên khu vực *")).toHaveValue("Phòng 312");
  });

  it("TC-S02-33: xác nhận bỏ thay đổi → đóng không lưu", async () => {
    const user = userEvent.setup();
    const onDong = vi.fn();
    render(<FormKhuVuc nodes={nodes} onLuu={vi.fn()} onDong={onDong} />);
    await user.type(screen.getByLabelText("Tên khu vực *"), "Phòng 312");
    await user.click(screen.getByRole("button", { name: "Hủy" }));
    await user.click(screen.getByRole("button", { name: "Bỏ thay đổi" }));
    expect(onDong).toHaveBeenCalled();
  });
});
