# Design Spec — Nhật ký kiểm toán (Mã màn: S07)

## Bản Figma (preview)
- Node: `291:559` · Page: `Genysic — Company Profile 2026` · Section: `QLVT — Quản lý bảo trì (8 màn)` (`291:371`)
- Trạng thái: **Đã dựng** · Ngày: 2026-06-23
- Palette: primary `#0b5cab` · bg `#f4f6f8` · surface `#fff` · border `#cbd3dd` · text `#1b2430` · danger `#b3261e` · warn `#fff4e0` · radius 8
- Ghi chú: figma-mcp-go thao tác trên file Figma đang mở, không trả URL share. Mở Figma → chọn node theo id ở trên để copy link chia sẻ.


## 1. Tổng quan UX
- Mục tiêu UX: tra vết nhanh và đáng tin — Quản trị mở màn, lọc theo điều kiện, đọc được "ai làm gì, khi nào, với đối tượng nào" trong vài thao tác. Cảm giác **chỉ đọc, an toàn, bất biến**: rõ ràng đây là bản ghi không sửa được.
- Thiết bị mục tiêu: **Web/Desktop-first** (bảng nhiều cột, panel lọc rộng); trên màn hẹp, panel lọc xếp dọc và bảng cuộn ngang.
- User flow tóm tắt: [Bản đồ tài sản — S01] → **[Nhật ký kiểm toán — S07]** → [Bản đồ tài sản — S01]

## 2. Cấu trúc layout (anatomy)
- Header: nút quay lại "← Bản đồ tài sản" (trái) · tiêu đề "Nhật ký kiểm toán" · avatar/menu tài khoản.
- Body (2 vùng dọc):
  - **Panel bộ lọc** (trên): hàng điều kiện gồm Người thực hiện, Hành động, Từ ngày, Đến ngày, Đối tượng; bên phải có nút "Xóa lọc" và "Áp dụng lọc".
  - **Bảng bản ghi** (dưới): các cột Thời điểm (sắp xếp được) · Người thực hiện · Hành động · Đối tượng · Vị trí cũ→mới; chế độ chỉ đọc, không có cột thao tác.
- Footer trong vùng bảng: thanh phân trang — tổng số bản ghi + điều hướng Trước/Trang/Sau.

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Nút quay lại | Tertiary CTA | Đóng panel, về S01 | Luôn hiển thị | R-S07-09 |
| Bộ lọc Người thực hiện | Dropdown | Chọn một người dùng đã thao tác, mặc định "Tất cả" | Chọn từ danh sách | R-S07-02 |
| Bộ lọc Hành động | Dropdown | Gán / Di dời / Xóa, mặc định "Tất cả" | Chọn từ danh sách | R-S07-03 |
| Từ ngày | Date picker | Mốc đầu khoảng thời gian | ≤ Đến ngày; ≤ hôm nay | R-S07-04 |
| Đến ngày | Date picker | Mốc cuối khoảng thời gian | ≥ Từ ngày; ≤ hôm nay | R-S07-04 |
| Ô đối tượng | Input | Khớp một phần mã/tên tài sản hoặc tên khu vực, không phân biệt dấu | ≤ 100 ký tự | R-S07-05 |
| Nút Áp dụng lọc | Primary CTA | Nạp lại bảng theo điều kiện (AND) | Disable khi khoảng ngày không hợp lệ | R-S07-02..06 |
| Nút Xóa lọc | Secondary CTA | Đưa mọi điều kiện về mặc định, nạp lại bảng | — | R-S07-06 |
| Bảng bản ghi | Table (read-only) | Hiển thị bản ghi; không có thao tác sửa/xóa | Chỉ đọc; xóa-để-trống cột vị trí với hành động Xóa | R-S07-01, R-S07-N03 |
| Tiêu đề cột Thời điểm | Sortable header | Click đảo thứ tự tăng/giảm | Mặc định giảm (mới nhất trước) | R-S07-08 |
| Thanh phân trang | Pagination | Tổng số bản ghi + Trước/Trang/Sau | 25 dòng/trang; ẩn khi 1 trang | R-S07-07 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: lọc không khớp / chưa có bản ghi → minh họa nhẹ + dòng chính **"Không có bản ghi phù hợp"** + gợi ý "Thử nới rộng khoảng thời gian hoặc bỏ bớt điều kiện lọc."
- 🔄 Loading: skeleton các hàng bảng khi đang tải/lọc; panel lọc vẫn thao tác được.
- 🔴 Error: tải nhật ký thất bại → "Không tải được nhật ký" + nút "Thử lại"; vai trò Giám sát → màn từ chối "Bạn không có quyền xem nhật ký kiểm toán" + lối về S01.
- 🟢 Success: áp dụng lọc xong → bảng cập nhật mượt; dòng tóm tắt "Hiển thị 1–25 / {tổng} bản ghi".

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Áp dụng lọc` · CTA Secondary: `Xóa lọc` · CTA Tertiary: `← Bản đồ tài sản`
- Title: `Nhật ký kiểm toán` · Helper text ô đối tượng: `Tìm theo mã/tên tài sản hoặc khu vực...`
- Nhãn cột: `Thời điểm` · `Người thực hiện` · `Hành động` · `Đối tượng` · `Vị trí cũ → mới`
- Wording lỗi/trạng thái (chính xác):
  - `Không có bản ghi phù hợp.`
  - `Từ ngày phải nhỏ hơn hoặc bằng Đến ngày.`
  - `Nhập tối đa 100 ký tự.`
  - `Không tải được nhật ký. Vui lòng thử lại.`
  - `Bạn không có quyền xem nhật ký kiểm toán. Khu vực này chỉ dành cho vai trò Quản trị.`
  - `Hiển thị {từ}–{đến} / {tổng} bản ghi.`

## 6. Edge case (xử lý UX)
- Kết quả rất nhiều (hàng nghìn bản ghi) → **phân trang** 25 dòng/trang, không tải hết một lần; giữ điều kiện lọc khi đổi trang.
- Vai trò Giám sát (không có quyền) → **màn từ chối** thay cho bảng; không render bất kỳ bản ghi nào, chỉ thông báo + lối về S01.
- Từ ngày > Đến ngày → lỗi inline tại trường ngày, nút "Áp dụng lọc" disable.
- Tên đối tượng/đường dẫn vị trí quá dài → cắt "..." + tooltip khi hover.
- Rớt mạng khi áp dụng lọc → giữ điều kiện đã chọn, snackbar "Lỗi kết nối, chưa tải được"; bảng giữ kết quả cũ.
- Thao tác "Xóa" không có vị trí cũ→mới → ô để "—", không để trống gây hiểu nhầm thiếu dữ liệu.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity`. Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [Bản đồ tài sản S01] | panel slide-in từ phải + fade; nền S01 lùi nhẹ scale 0.99 | 250ms · ease-out |
| Ra (exit) | → [Bản đồ tài sản S01] | panel slide-out sang phải + fade-out; nền S01 trở lại scale 1.0 | 200ms · ease-in |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Hàng bảng (kết quả) | tải/lọc xong | stagger fade + slide-up nhẹ từng hàng | fade-out nhanh khi thay tập kết quả | 150ms · ease-out |
| Panel bộ lọc | thu gọn/mở (màn hẹp) | slide-down + fade các trường | slide-up + fade | 180ms · ease-out/in |
| Trạng thái rỗng/lỗi/từ chối | xuất hiện thay bảng | fade + scale-up nhẹ | fade-out | 180ms · ease-out/in |
| Thông báo lỗi inline (ngày/ký tự) | hiện/ẩn | fade + slide-down dưới trường | fade-out | 150ms · ease-out/in |
| Snackbar lỗi kết nối | hiện/ẩn | slide-in + fade từ dưới | fade-out | 150ms · ease-out |
| Chuyển trang (phân trang) | đổi trang | hàng mới fade-in, hàng cũ fade-out (cross-fade) | — | 150ms · ease-out |

## 8. Ghi chú cho Designer
- Accessibility: bảng có tiêu đề cột rõ; cột sắp xếp cho biết hướng (mũi tên) và thao tác được bằng bàn phím (Enter trên header); thứ tự focus: nút quay lại → các trường lọc → Áp dụng lọc → bảng → phân trang.
- Phân biệt loại hành động (Gán/Di dời/Xóa) bằng cả nhãn chữ và biểu tượng/badge, không chỉ bằng màu, để hỗ trợ người mù màu.
- Nhấn mạnh tính **chỉ đọc**: không có nút thao tác trên dòng; trạng thái từ chối với Giám sát phải dứt khoát, không để lộ bất kỳ dữ liệu nào.
- Mật độ bảng vừa phải để đọc nhanh nhiều dòng; tương phản chữ/nền đủ rõ với cả dòng có nội dung dài.
