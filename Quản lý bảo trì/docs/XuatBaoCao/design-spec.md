# Design Spec — Xuất báo cáo / kiểm kê (Mã màn: S08)

## Bản Figma (preview)
- Node: `291:603` · Page: `Genysic — Company Profile 2026` · Section: `QLVT — Quản lý bảo trì (8 màn)` (`291:371`)
- Trạng thái: **Đã dựng** · Ngày: 2026-06-23
- Palette: primary `#0b5cab` · bg `#f4f6f8` · surface `#fff` · border `#cbd3dd` · text `#1b2430` · danger `#b3261e` · warn `#fff4e0` · radius 8
- Ghi chú: figma-mcp-go thao tác trên file Figma đang mở, không trả URL share. Mở Figma → chọn node theo id ở trên để copy link chia sẻ.


## 1. Tổng quan UX
- Mục tiêu UX: cho người dùng cấu hình phạm vi và xuất một file Excel kiểm kê **nhanh, ít bước, không sai phạm vi**. Phản hồi rõ ràng về số tài sản sẽ xuất và trạng thái khi xuất tập lớn.
- Thiết bị mục tiêu: **Web/Desktop-first** (đi cùng workspace S01); modal vừa khít, không tràn màn.
- User flow tóm tắt: [Bản đồ tài sản — S01] → **[Xuất báo cáo / kiểm kê — S08 (modal)]** → tải file về → [Bản đồ tài sản — S01]

## 2. Cấu trúc layout (anatomy)
- Header: tiêu đề "Xuất báo cáo / kiểm kê" · nút đóng [✕].
- Body (xếp dọc):
  - **Nhóm Phạm vi xuất:** 3 lựa chọn radio; khi chọn "Theo khu vực đang chọn" hiện breadcrumb nút và checkbox "Gồm cả các khu vực con".
  - **Nhóm Cột xuất:** 5 checkbox cột, mặc định tick hết.
  - **Dải ước tính:** dòng thông tin "Ước tính: {n} tài sản trong phạm vi đã chọn".
- Footer modal: nút "Hủy" (phụ) và "Xuất Excel" (chính), căn phải.
- Lớp nổi: vùng tiến trình thay thế body khi đang dựng file; toast thành công ở góc trên.

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Nhóm Phạm vi xuất | Radio group | 3 lựa chọn: Toàn bộ / Theo khu vực đang chọn / Theo bộ lọc hiện tại | Bắt buộc chọn đúng 1 | R-S08-01 |
| Breadcrumb khu vực | Hiển thị | Đường dẫn nút đang chọn ở S01 (vd Tòa A › Tầng 3) | Chỉ hiện khi chọn "Theo khu vực"; khóa lựa chọn nếu chưa chọn nút | R-S08-01, R-S08-02 |
| Checkbox "Gồm cả khu vực con" | Checkbox | Mở rộng phạm vi sang toàn bộ nhánh con | Mặc định bật; chỉ áp dụng khi "Theo khu vực" | R-S08-02 |
| Nhóm Cột xuất | Checkbox group | 5 cột: mã, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất | Phải còn **≥ 1 cột** | R-S08-03 |
| Dải ước tính số dòng | Hiển thị | Đếm số tài sản trong phạm vi, cập nhật khi đổi phạm vi | Hiện 0 khi rỗng → kích hoạt trạng thái Empty | R-S08-04, R-S08-07 |
| Nút "Xuất Excel" | Primary CTA | Dựng file .xlsx + tải về | Vô hiệu khi phạm vi rỗng hoặc không cột nào được chọn | R-S08-05, R-S08-07 |
| Nút "Hủy" / [✕] | Secondary | Đóng modal, fade về S01 | — | R-S08-08 |
| Vùng tiến trình | Progress | Thanh % + số dòng đã xử lý + nút Hủy khi tập lớn | Hiện khi tập > 5.000 dòng | R-S08-06, R-S08-N01 |
| Toast thành công | Toast | "Đã xuất {n} tài sản" + tên file | Hiện sau khi tải file về | R-S08-05 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: phạm vi đã chọn không có tài sản → thay dải ước tính bằng "Không có dữ liệu để xuất. Phạm vi đã chọn không có tài sản nào, hãy đổi phạm vi"; nút "Xuất Excel" bị vô hiệu; CTA "Đổi phạm vi" đưa focus về nhóm Phạm vi.
- 🔄 Loading: đang dựng file → body chuyển sang vùng tiến trình "Đang tạo file..." + thanh % + "Đang xử lý {x}/{tổng} dòng" + nút Hủy (cho tập lớn tới 50.000 dòng).
- 🔴 Error: dựng/tải file thất bại → thông báo "Không tạo được file báo cáo. Vui lòng thử lại" + nút "Thử lại"; không tải file dở dang.
- 🟢 Success: tải file xong → toast "Đã xuất {n} tài sản" kèm tên file; modal fade về S01.

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Xuất Excel` · CTA Secondary: `Hủy`, `Đổi phạm vi`, `Thử lại`
- Title: `Xuất báo cáo / kiểm kê` · Nhãn nhóm: `Phạm vi xuất`, `Cột xuất`
- Lựa chọn phạm vi: `Toàn bộ tài sản`, `Theo khu vực đang chọn`, `Theo bộ lọc hiện tại`, `Gồm cả các khu vực con`
- Helper ước tính: `Ước tính: {n} tài sản trong phạm vi đã chọn`
- Wording lỗi/thành công (chính xác):
  - `Vui lòng chọn phạm vi xuất.`
  - `Hãy chọn một khu vực trước khi xuất theo khu vực.`
  - `Chọn ít nhất một cột để xuất.`
  - `Không có dữ liệu để xuất.`
  - `Đang xử lý {x}/{tổng} dòng...`
  - `Đã xuất {n} tài sản.`
  - `Không tạo được file báo cáo. Vui lòng thử lại.`

## 6. Edge case (xử lý UX)
- Tập rất lớn (tới 50.000 dòng) → hiện thanh tiến trình + số dòng đã xử lý, cho hủy; xử lý theo khối để modal không treo.
- Phạm vi rỗng → chặn xuất ngay từ dải ước tính, không để người dùng bấm rồi mới biết file trống.
- Chọn "Theo khu vực" mà chưa chọn nút ở S01 → khóa lựa chọn + nhắc chọn khu vực trước.
- "Lần di dời gần nhất" trống (tài sản chưa từng di dời) → ô để trống, không báo lỗi.
- Tên khu vực/đường dẫn quá dài trong breadcrumb → cắt "..." + tooltip khi hover.
- Rớt mạng khi đang xuất → dừng, thông báo lỗi + nút Thử lại; không tải file nửa vời.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity`. Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [S01 Bản đồ tài sản] | nền workspace mờ & lùi scale 0.99, modal **trượt lên (slide-up)** + fade từ dưới | 250ms · ease-out |
| Ra (exit) | → [S01 Bản đồ tài sản] | modal **trượt xuống + fade-out**, nền workspace sáng lại & về scale 1 (fade về S01) | 200ms · ease-in |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Khối breadcrumb + "Gồm khu vực con" | chọn/bỏ "Theo khu vực" | slide-down + fade | slide-up + fade | 160ms · ease-out/in |
| Dải ước tính số dòng | cập nhật số | cross-fade số mới | cross-fade số cũ | 150ms · ease-out |
| Vùng tiến trình xuất | bắt đầu/kết thúc xuất | fade + slide-up thay cho body | fade-out khi xong/hủy | 180ms · ease-out/in |
| Thanh tiến trình (%) | trong khi xuất | chiều rộng tăng mượt theo % | — | liên tục · ease-out |
| Thông báo "Không có dữ liệu" | phạm vi rỗng / có lại dữ liệu | fade + slide-down | fade-out | 150ms · ease-out/in |
| Toast "Đã xuất {n} tài sản" | hiện/ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |

## 8. Ghi chú cho Designer
- Accessibility: nhóm radio và checkbox có nhãn rõ, thao tác được bằng bàn phím (mũi tên chọn radio, Space tick checkbox); thứ tự focus: phạm vi → khu con → cột → ước tính → Hủy → Xuất Excel.
- Trạng thái vô hiệu của nút "Xuất Excel" phân biệt bằng cả độ mờ và nhãn phụ trợ (vd tooltip "Phạm vi không có dữ liệu"), không chỉ bằng màu.
- Thanh tiến trình kèm nhãn text số dòng để người dùng dùng trình đọc màn hình vẫn nắm tiến độ.
- Toast thành công đủ thời gian đọc (không tự tắt quá nhanh) và không che nút tải file của trình duyệt.
