import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Workspace } from "./Workspace";

// jsdom không tính layout → mock rect cho khung sơ đồ để click ra tọa độ % xác định.
beforeEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    x: 0, y: 0, left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, toJSON: () => ({}),
  })) as unknown as typeof Element.prototype.getBoundingClientRect;
});

async function moNhanhToiPhong305(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
  await user.click(screen.getByRole("button", { name: "Mở Tầng 3" }));
  await user.click(screen.getByRole("button", { name: "Phòng 305" }));
}

describe("Workspace S01 — cây khu vực", () => {
  it("TC-S01-01: hiển thị nút gốc, ẩn con tới khi mở", () => {
    render(<Workspace />);
    expect(screen.getByRole("button", { name: "Tòa A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tòa B" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tầng 3" })).not.toBeInTheDocument();
  });

  it("tìm cây: gõ 'Phòng 305' → tự bung tới nhánh khớp, ẩn nhánh khác", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.type(screen.getByLabelText("Tìm khu vực"), "Phòng 305");
    expect(screen.getByRole("button", { name: "Phòng 305" })).toBeInTheDocument(); // match (tự bung)
    expect(screen.getByRole("button", { name: "Tòa A" })).toBeInTheDocument(); // tổ tiên
    expect(screen.queryByRole("button", { name: "Tòa B" })).not.toBeInTheDocument(); // không khớp → ẩn
    expect(screen.queryByRole("button", { name: "Phòng 306" })).not.toBeInTheDocument();
  });

  it("dấu hiệu 'đã có sơ đồ' chỉ hiện ở nút có sơ đồ", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    await user.click(screen.getByRole("button", { name: "Mở Tầng 3" }));
    const hang305 = screen.getByRole("button", { name: "Phòng 305" }).closest(".nut-hang") as HTMLElement;
    const hang306 = screen.getByRole("button", { name: "Phòng 306" }).closest(".nut-hang") as HTMLElement;
    expect(within(hang305).getByTitle("Đã có sơ đồ mặt bằng")).toBeInTheDocument();
    expect(within(hang306).queryByTitle("Đã có sơ đồ mặt bằng")).not.toBeInTheDocument();
  });

  it("TC-S01-02: mở/đóng nhánh hiện/ẩn con", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    expect(screen.getByRole("button", { name: "Tầng 3" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Đóng Tòa A" }));
    expect(screen.queryByRole("button", { name: "Tầng 3" })).not.toBeInTheDocument();
  });
});

describe("Workspace S01 — xem sơ đồ", () => {
  it("TC-S01-05: chọn Phòng 305 → breadcrumb + khung sơ đồ", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    expect(screen.getByText("Tòa A › Tầng 3 › Phòng 305")).toBeInTheDocument();
    expect(screen.getByTestId("khung-so-do")).toBeInTheDocument();
  });

  it("TC-S01-06: chọn Phòng 306 (chưa có sơ đồ) → 'Chưa có sơ đồ'", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    await user.click(screen.getByRole("button", { name: "Mở Tầng 3" }));
    await user.click(screen.getByRole("button", { name: "Phòng 306" }));
    expect(screen.getByTestId("chua-co-so-do")).toHaveTextContent("Chưa có sơ đồ");
  });
});

describe("Workspace S01 — gán vị trí", () => {
  it("TC-S01-14/16: ô gán chỉ liệt kê tài sản chưa có vị trí", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    const ds = screen.getByRole("listbox", { name: "Tài sản chưa có vị trí" });
    expect(within(ds).getByText(/B-021 · Máy bơm/)).toBeInTheDocument();
    expect(within(ds).getByText(/B-045 · Tủ điện/)).toBeInTheDocument();
    expect(within(ds).queryByText(/A-007/)).not.toBeInTheDocument();
  });

  it("TC-S01-17: nút Gán vị trí disabled khi chưa chọn", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    expect(screen.getByRole("button", { name: "Gán vị trí" })).toBeDisabled();
  });

  it("TC-S01-15: gán B-021 → toast 'Đã gán vị trí cho tài sản.'", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    await user.click(screen.getByLabelText(/B-021 · Máy bơm/));
    await user.click(screen.getByRole("button", { name: /^Gán vị trí/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Đã gán vị trí cho tài sản.");
  });

  it("TC-S01-19: Hủy → đóng ô gán, không tạo pin", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    await user.click(screen.getByRole("button", { name: "Hủy" }));
    expect(screen.queryByRole("listbox", { name: "Tài sản chưa có vị trí" })).not.toBeInTheDocument();
  });
});

describe("Workspace S01 — một vị trí nhiều tài sản (change request)", () => {
  it("ô gán có tìm kiếm: gõ 'tủ' chỉ còn B-045 (UX nhiều tài sản)", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    const ds = screen.getByRole("listbox", { name: "Tài sản chưa có vị trí" });
    expect(within(ds).getByText(/B-021 · Máy bơm/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Tìm tài sản chưa có vị trí"), "tu dien");
    expect(within(ds).getByText(/B-045 · Tủ điện/)).toBeInTheDocument();
    expect(within(ds).queryByText(/B-021/)).not.toBeInTheDocument();
  });

  it("đặt tên vị trí khi gán → marker hiển thị tên", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    await user.click(screen.getByLabelText(/B-021 · Máy bơm/));
    await user.type(screen.getByLabelText("Tên vị trí"), "Khu thử");
    await user.click(screen.getByRole("button", { name: /^Gán vị trí/ }));
    expect(screen.getByRole("button", { name: "Vị trí Khu thử" })).toBeInTheDocument();
  });

  it("gán 2 tài sản vào cùng một vị trí → toast số nhiều + marker vị trí", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    await user.click(screen.getByLabelText(/B-021 · Máy bơm/));
    await user.click(screen.getByLabelText(/B-045 · Tủ điện/));
    await user.click(screen.getByRole("button", { name: "Gán vị trí (2)" }));
    expect(screen.getByRole("status")).toHaveTextContent("Đã gán vị trí cho 2 tài sản.");
    expect(screen.getByRole("button", { name: "Vị trí 2 tài sản" })).toBeInTheDocument();
  });

  it("gán thêm tài sản vào một vị trí đã có → vị trí gom 2 tài sản", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    // tạo vị trí với B-021
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    await user.click(screen.getByLabelText(/B-021 · Máy bơm/));
    await user.click(screen.getByRole("button", { name: /^Gán vị trí/ }));
    // mở vị trí → gán thêm B-045
    await user.click(screen.getByRole("button", { name: "Tài sản B-021" }));
    await user.click(screen.getByRole("button", { name: "+ Gán thêm tài sản vào vị trí này" }));
    await user.click(screen.getByLabelText(/B-045 · Tủ điện/));
    await user.click(screen.getByRole("button", { name: /^Gán vị trí/ }));
    expect(screen.getByRole("button", { name: "Vị trí 2 tài sản" })).toBeInTheDocument();
  });

  it("click vị trí nhiều tài sản → popup liệt kê danh sách", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    fireEvent.click(screen.getByTestId("khung-so-do"), { clientX: 40, clientY: 55 });
    await user.click(screen.getByLabelText(/B-021 · Máy bơm/));
    await user.click(screen.getByLabelText(/B-045 · Tủ điện/));
    await user.click(screen.getByRole("button", { name: "Gán vị trí (2)" }));
    await user.click(screen.getByRole("button", { name: "Vị trí 2 tài sản" }));
    const popup = screen.getByRole("dialog", { name: "Tài sản tại vị trí" });
    expect(popup).toHaveTextContent("2 tài sản tại vị trí này");
    expect(within(popup).getByText(/B-021 · Máy bơm/)).toBeInTheDocument();
    expect(within(popup).getByText(/B-045 · Tủ điện/)).toBeInTheDocument();
  });
});

describe("Workspace S01 — mobile drawer", () => {
  it("hamburger mở/đóng drawer cây; chọn nút thì đóng", async () => {
    const user = userEvent.setup();
    const { container } = render(<Workspace />);
    expect(container.querySelector(".ws-cay")!.className).not.toContain("mo");
    await user.click(screen.getByRole("button", { name: "Mở danh sách khu vực" }));
    expect(container.querySelector(".ws-cay")!.className).toContain("mo");
    expect(container.querySelector(".ws-scrim")).toBeInTheDocument();
    await user.click(container.querySelector(".ws-scrim") as HTMLElement);
    expect(container.querySelector(".ws-cay")!.className).not.toContain("mo");
    // mở lại rồi chọn nút → tự đóng
    await user.click(screen.getByRole("button", { name: "Mở danh sách khu vực" }));
    await user.click(screen.getByRole("button", { name: "Tòa A" }));
    expect(container.querySelector(".ws-cay")!.className).not.toContain("mo");
  });
});

describe("Workspace S01 — kéo-thả pin", () => {
  it("kéo pin A-007 sang điểm mới → cập nhật tọa độ, không mở popup", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    const pin = screen.getByRole("button", { name: "Tài sản A-007" });
    fireEvent.pointerDown(pin, { button: 0 });
    // jsdom PointerEvent không mang clientX → dùng MouseEvent type pointermove/up.
    fireEvent(window, new MouseEvent("pointermove", { clientX: 70, clientY: 75, bubbles: true }));
    fireEvent(window, new MouseEvent("pointerup", { bubbles: true }));
    const pinSau = screen.getByRole("button", { name: "Tài sản A-007" });
    expect(pinSau.style.left).toBe("70%");
    expect(pinSau.style.top).toBe("75%");
    expect(screen.queryByRole("dialog", { name: "Tài sản tại vị trí" })).not.toBeInTheDocument();
  });
});

describe("Workspace S01 — gỡ vị trí", () => {
  it("TC-S01-23: gỡ pin A-007 → xác nhận → pin biến mất", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    await user.click(screen.getByRole("button", { name: "Tài sản A-007" }));
    await user.click(screen.getByRole("button", { name: "Gỡ vị trí" }));
    await user.click(screen.getByRole("button", { name: "Xác nhận" }));
    expect(screen.queryByRole("button", { name: "Tài sản A-007" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Đã gỡ vị trí.");
  });

  it("TC-S01-26: gỡ A-007 → Hủy → pin giữ nguyên", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    await user.click(screen.getByRole("button", { name: "Tài sản A-007" }));
    await user.click(screen.getByRole("button", { name: "Gỡ vị trí" }));
    await user.click(screen.getByRole("button", { name: "Hủy" }));
    expect(screen.getByRole("button", { name: "Tài sản A-007" })).toBeInTheDocument();
  });

  it("TC-S01-25: gỡ pin A-009 (đang khóa) → xác nhận → chặn", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    await user.click(screen.getByRole("button", { name: "Tài sản A-009" }));
    await user.click(screen.getByRole("button", { name: "Gỡ vị trí" }));
    await user.click(screen.getByRole("button", { name: "Xác nhận" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Tài sản đang được người khác chỉnh sửa");
  });
});

describe("Workspace S01 — tra cứu", () => {
  it("TC-S01-27/28: gõ 'may nen' → gợi ý A-007; chọn → mở sơ đồ + breadcrumb", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.type(screen.getByLabelText("Tra cứu tài sản"), "may nen");
    const gy = screen.getByRole("listbox", { name: "Kết quả tra cứu" });
    await user.click(within(gy).getByText(/A-007 · Máy nén khí/));
    expect(screen.getByText("Tòa A › Tầng 3 › Phòng 305")).toBeInTheDocument();
  });

  it("TC-S01-29: chọn B-021 (chưa có vị trí) → 'Chưa gán vị trí'", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.type(screen.getByLabelText("Tra cứu tài sản"), "B-021");
    const gy = screen.getByRole("listbox", { name: "Kết quả tra cứu" });
    await user.click(within(gy).getByText(/B-021 · Máy bơm/));
    expect(screen.getByText("Chưa gán vị trí")).toBeInTheDocument();
  });

  it("TC-S01-30: từ khóa không tồn tại → 'Không tìm thấy tài sản.'", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.type(screen.getByLabelText("Tra cứu tài sản"), "ZZZ-999");
    expect(screen.getByText("Không tìm thấy tài sản.")).toBeInTheDocument();
  });
});

describe("Workspace S01 — xóa nút", () => {
  it("TC-S01-37/38/39: dialog xóa Tầng 3 đúng wording; Hủy giữ nguyên; Tiếp tục xóa", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    await user.click(screen.getByRole("button", { name: "Menu Tầng 3" }));
    await user.click(screen.getByRole("menuitem", { name: "Xóa" }));
    const dialog = screen.getByRole("dialog", { name: "Xác nhận xóa khu vực" });
    expect(dialog).toHaveTextContent(
      "Xóa khu vực này sẽ gỡ vị trí của 2 tài sản và xóa 2 khu vực con. Tiếp tục?",
    );
    // Hủy
    await user.click(within(dialog).getByRole("button", { name: "Hủy" }));
    expect(screen.getByRole("button", { name: "Tầng 3" })).toBeInTheDocument();
    // Mở lại + Tiếp tục
    await user.click(screen.getByRole("button", { name: "Menu Tầng 3" }));
    await user.click(screen.getByRole("menuitem", { name: "Xóa" }));
    await user.click(screen.getByRole("button", { name: "Tiếp tục" }));
    expect(screen.queryByRole("button", { name: "Tầng 3" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Đã xóa khu vực");
  });
});

describe("Workspace S01 — lọc pin", () => {
  it("TC-S01-13: lọc 'Đang khóa' → chỉ pin A-009, ẩn A-007", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await moNhanhToiPhong305(user);
    expect(screen.getByRole("button", { name: "Tài sản A-007" })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Lọc pin theo trạng thái"), "DangKhoa");
    expect(screen.queryByRole("button", { name: "Tài sản A-007" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tài sản A-009" })).toBeInTheDocument();
  });
});

describe("Workspace S01 — kéo-thả nút", () => {
  it("TC-S01-34: thả Tòa A vào nhánh con (Tầng 3) → snackbar chặn", async () => {
    const user = userEvent.setup();
    render(<Workspace />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    const hangTang3 = screen.getByRole("button", { name: "Tầng 3" }).closest(".nut-hang")!;
    const dt = { getData: () => "toa-a", setData: () => {}, dropEffect: "", effectAllowed: "" };
    fireEvent.dragOver(hangTang3, { dataTransfer: dt });
    fireEvent.drop(hangTang3, { dataTransfer: dt });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Không thể di chuyển khu vực vào chính nhánh con của nó.",
    );
  });
});

describe("Workspace S01 — phân quyền Giám sát", () => {
  it("TC-S01-41: Giám sát không thấy menu cấu trúc + nút Thêm khu vực", async () => {
    const user = userEvent.setup();
    render(<Workspace vaiTro="GiamSat" />);
    await user.click(screen.getByRole("button", { name: "Mở Tòa A" }));
    expect(screen.queryByRole("button", { name: "Menu Tầng 3" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "+ Thêm khu vực" })).not.toBeInTheDocument();
  });
});
