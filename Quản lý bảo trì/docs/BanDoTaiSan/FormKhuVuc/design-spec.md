# Design Spec — Form khu vực (Tạo/Sửa nút) (Mã màn: S02)

## Bản Figma (preview)
- Node: `291:422` · Page: `Genysic — Company Profile 2026` · Section: `QLVT — Quản lý bảo trì (8 màn)` (`291:371`)
- Trạng thái: **Đã dựng** · Ngày: 2026-06-23
- Palette: primary `#0b5cab` · bg `#f4f6f8` · surface `#fff` · border `#cbd3dd` · text `#1b2430` · danger `#b3261e` · warn `#fff4e0` · radius 8
- Ghi chú: figma-mcp-go thao tác trên file Figma đang mở, không trả URL share. Mở Figma → chọn node theo id ở trên để copy link chia sẻ.


## 1. Tổng quan UX
- Mục tiêu UX: nhập liệu **nhanh, ít trường, ít ma sát**; cảm giác an toàn (không sợ tạo nhầm/mất dữ liệu). Một form duy nhất dùng cho cả Tạo và Sửa để người dùng học một lần dùng mãi.
- Thiết bị mục tiêu: **Web/Desktop-first** (đi cùng workspace S01); modal co giãn tốt, trên màn hẹp chuyển thành tấm trượt full-width.
- User flow tóm tắt: [Bản đồ tài sản — Workspace S01] → **[Form khu vực S02 — modal slide-up]** → [quay lại Workspace S01]

## 2. Cấu trúc layout (anatomy)
- Header (đầu modal): tiêu đề động — "Thêm khu vực" (Tạo) / "Sửa khu vực" (Sửa); nút đóng (×) góc phải.
- Body (thân modal, một cột dọc):
  - Trường **Tên khu vực** (bắt buộc, có dấu *) + vùng lỗi inline.
  - Trường **Mã khu vực** (tùy chọn) + helper "(tùy chọn — duy nhất nếu nhập)".
  - Trường **Loại khu vực** (tùy chọn, dropdown danh mục).
  - Trường **Nút cha** (tùy chọn, dropdown/cây thu gọn) + helper "(để trống = khu vực gốc)".
- Footer (cuối modal): nút **Hủy** (phụ) bên trái khoảng trống, nút **Lưu** (chính) bên phải.
- Lớp nền: overlay tối phủ workspace; nhấn overlay = yêu cầu đóng.

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Tiêu đề modal | Text động | "Thêm khu vực" / "Sửa khu vực" theo chế độ | — | R-S02-01, R-S02-02 |
| Ô Tên khu vực | Input | Bắt buộc; trim trước khi kiểm tra | 1–150 ký tự, không rỗng | R-S02-05 |
| Ô Mã khu vực | Input | Tùy chọn; kiểm tra duy nhất khi lưu | ≤ 50 ký tự, duy nhất nếu nhập | R-S02-06 |
| Chọn Loại khu vực | Select | Tùy chọn; danh mục Site/Tòa/Tầng/Phòng/Khu | thuộc danh mục, để trống được | R-S02-09 |
| Chọn Nút cha | Select cây / dropdown tìm kiếm | Chọn vị trí trong cây; để trống = gốc; chế độ Sửa loại trừ nút & nhánh con | không phải chính nó/nhánh con | R-S02-07, R-S02-08 |
| Nút Lưu | Primary CTA | Kiểm tra hợp lệ → tạo/cập nhật → đóng modal | Vô hiệu khi Tên trống | R-S02-03, R-S02-04 |
| Nút Hủy / × / overlay | Secondary | Đóng không lưu; hỏi xác nhận nếu đã sửa | — | R-S02-10 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: chế độ Tạo mở với form trắng; nếu cây chưa có nút → Nút cha chỉ có "(Gốc — không có nút cha)".
- 🔄 Loading: chế độ Sửa nạp dữ liệu nút → các ô hiện skeleton/mờ ngắn; dropdown Nút cha & Loại đang tải → placeholder "Đang tải...".
- 🔴 Error: lỗi inline dưới từng trường (Tên rỗng/quá dài, Mã trùng, Nút cha gây cây lặp); lưu thất bại do mạng → snackbar "Lỗi kết nối, chưa lưu được" và giữ dữ liệu; nút vừa bị xóa → thông báo "Khu vực không còn tồn tại" rồi đóng.
- 🟢 Success: lưu xong → modal đóng (fade) + toast trên workspace "Đã thêm khu vực" / "Đã cập nhật khu vực"; cây bật nhánh chứa nút vừa lưu.

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Lưu` · CTA Secondary: `Hủy`
- Title: `Thêm khu vực` (Tạo) / `Sửa khu vực` (Sửa)
- Helper text: Mã — `(tùy chọn — duy nhất nếu nhập)` · Nút cha — `(để trống = khu vực gốc)`
- Placeholder: Tên — `Nhập tên khu vực` · Nút cha — `(Gốc — không có nút cha)`
- Wording lỗi/thành công (chính xác):
  - `Vui lòng nhập tên khu vực.`
  - `Tên khu vực tối đa 150 ký tự.`
  - `Mã khu vực đã tồn tại.`
  - `Mã khu vực tối đa 50 ký tự.`
  - `Không thể đặt khu vực vào chính nó hoặc nhánh con của nó.`
  - `Bỏ thay đổi chưa lưu?`
  - `Đã thêm khu vực.` / `Đã cập nhật khu vực.`
  - `Lỗi kết nối, chưa lưu được.`

## 6. Edge case (xử lý UX)
- Rớt mạng khi Lưu → giữ toàn bộ dữ liệu đã nhập, snackbar "Lỗi kết nối, chưa lưu được"; không tạo/sửa nửa vời.
- Tên/đường dẫn Nút cha quá dài → cắt "..." + tooltip khi hover; ô Nút cha hiển thị đường dẫn rút gọn (vd "Tòa A › … › Tầng 3").
- Cây rất nhiều nút → dropdown Nút cha có ô tìm kiếm lọc theo tên (khớp một phần).
- Chế độ Sửa: chính nút và nhánh con của nó **bị loại khỏi** danh sách Nút cha (ẩn hẳn, không chỉ disable) để chống cây lặp.
- Người dùng Giám sát không có lối vào màn này; nếu truy cập trực tiếp → từ chối, không hiển thị form.
- Đóng modal khi đã sửa dữ liệu → hỏi xác nhận trước khi bỏ.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity` (không layout-thrash). Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [Bản đồ tài sản S01] | overlay tối fade-in; modal **slide-up** từ đáy + fade vào | 250ms · ease-out |
| Ra (exit) | → [Bản đồ tài sản S01] | modal **slide-down** + fade-out; overlay fade-out; nền workspace trở lại scale 1 | 200ms · ease-in |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Lỗi inline dưới field | hiện/ẩn lỗi | slide-down + fade, ô input rung nhẹ 1 nhịp | fade-out | 160ms · ease-out/in |
| Dropdown Nút cha / Loại | mở / đóng | fade + slide-down từ ô | fade + slide-up | 160ms · ease-out/in |
| Skeleton form (chế độ Sửa) | nạp xong | skeleton fade-out, dữ liệu fade-in | — | 150ms · ease-out |
| Dialog "Bỏ thay đổi chưa lưu?" | mở / đóng | fade nền + scale-up dialog | fade + scale-down | 180ms · ease-out/in |
| Toast thành công (trên S01) | hiện/ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |

## 8. Ghi chú cho Designer
- Accessibility: focus tự đặt vào ô Tên khi modal mở; thứ tự focus Tên → Mã → Loại → Nút cha → Hủy → Lưu; bẫy focus trong modal (Tab không thoát ra nền); Esc = Hủy (qua xác nhận nếu đã sửa).
- Lỗi inline liên kết với ô bằng nhãn để trình đọc màn hình đọc được; trường bắt buộc đánh dấu rõ (dấu * + nhãn "bắt buộc"), không chỉ dựa vào màu.
- Vùng chạm nút Lưu/Hủy đủ lớn cho thao tác cảm ứng/touchpad; trạng thái vô hiệu của Lưu phân biệt được mà vẫn đủ tương phản.
