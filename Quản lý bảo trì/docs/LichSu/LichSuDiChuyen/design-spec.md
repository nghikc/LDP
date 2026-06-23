# Design Spec — Lịch sử di chuyển tài sản (Mã màn: S06)

## Bản Figma (preview)
- Node: `291:533` · Page: `Genysic — Company Profile 2026` · Section: `QLVT — Quản lý bảo trì (8 màn)` (`291:371`)
- Trạng thái: **Đã dựng** · Ngày: 2026-06-23
- Palette: primary `#0b5cab` · bg `#f4f6f8` · surface `#fff` · border `#cbd3dd` · text `#1b2430` · danger `#b3261e` · warn `#fff4e0` · radius 8
- Ghi chú: figma-mcp-go thao tác trên file Figma đang mở, không trả URL share. Mở Figma → chọn node theo id ở trên để copy link chia sẻ.


## 1. Tổng quan UX
- Mục tiêu UX: đọc-hiểu nhanh hành trình của một tài sản; cảm giác minh bạch, đáng tin (dữ liệu truy vết không thể chỉnh). Trình bày dạng **timeline** để mắt lướt theo dòng thời gian, thấy ngay "đi từ đâu tới đâu".
- Thiết bị mục tiêu: **Web/Desktop-first**, hiển thị như **panel trượt từ phải** chồng lên S01; thu hẹp gọn trên màn hẹp (panel chiếm phần lớn bề ngang).
- User flow tóm tắt: [Bản đồ tài sản — S01: popup pin "Xem lịch sử" / kết quả tra cứu] → **[Lịch sử di chuyển — S06]** → [đóng → trở về S01]

## 2. Cấu trúc layout (anatomy)
- Header panel: nút Quay lại (←) / Đóng (✕); tiêu đề "Lịch sử di chuyển"; dòng phụ mã + tên tài sản đang xem.
- Thanh bộ lọc: Từ ngày · Đến ngày (date picker) · nút Áp dụng · nút Xóa lọc; vùng lỗi inline ngay dưới khi khoảng không hợp lệ.
- Body — Timeline (cuộn dọc): mỗi bản ghi là một mốc trên trục thời gian dọc; mới nhất trên cùng. Mỗi mốc: dòng tiêu đề (thời điểm · người thực hiện), dòng vị trí "cũ → mới" (breadcrumb hai đầu), dòng lý do (nếu có). Cuối danh sách: chỉ báo "— Đã hiển thị hết lịch sử —" hoặc vùng "Xem thêm".
- Footer: không có footer cố định; đóng panel bằng ← / ✕ ở header hoặc click ra ngoài vùng panel (scrim).

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Header tài sản | Label | Hiện mã + tên tài sản đang xem (chỉ đọc) | — | R-S06-03 |
| Nút Đóng / Quay lại | Icon button | slide-right đóng panel, trả về S01 | — | R-S06-03 |
| Từ ngày | Date picker | Mốc đầu khoảng lọc | ≤ Đến ngày; ≤ hôm nay | R-S06-04, R-S06-05 |
| Đến ngày | Date picker | Mốc cuối khoảng lọc | ≥ Từ ngày; ≤ hôm nay | R-S06-04, R-S06-05 |
| Nút Áp dụng | Primary CTA | Tải bản ghi trong khoảng | Disable/không tải khi khoảng không hợp lệ | R-S06-04, R-S06-05 |
| Nút Xóa lọc | Secondary CTA | Trở về toàn bộ lịch sử | Ẩn/disable khi chưa lọc | R-S06-04 |
| Mục timeline (bản ghi) | List item (read-only) | Thời điểm · người · vị trí cũ → mới · lý do | Không có thao tác sửa/xóa | R-S06-01, R-S06-02, R-S06-08 |
| Breadcrumb vị trí | Text path | Đường dẫn khu vực đầy đủ hai đầu | Quá dài → cắt "..." + tooltip | R-S06-02 |
| Vùng "Xem thêm" / cuộn | Pagination | Tải lô tiếp khi cuộn cuối | — | R-S06-07 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: tài sản chưa có bản ghi → minh họa nhẹ + dòng "Tài sản chưa có lần di chuyển nào." kèm câu phụ "Mọi thay đổi vị trí sẽ được ghi lại và hiện ở đây." Trường hợp rỗng-sau-lọc → "Không có lần di chuyển nào trong khoảng đã chọn." + nút "Xóa lọc".
- 🔄 Loading: skeleton vài dòng timeline (chấm mốc + 2–3 dòng xám) khi tải trang đầu; khi tải thêm → spinner nhỏ ở cuối danh sách, giữ nguyên phần đã hiển thị.
- 🔴 Error: tải lịch sử thất bại → "Không tải được lịch sử" + nút "Thử lại"; lỗi khi tải thêm → giữ phần đã có, hiện "Thử lại" ở cuối.
- 🟢 Success: timeline hiển thị đầy đủ; khi cuộn hết → "— Đã hiển thị hết lịch sử —" (không dùng toast vì màn chỉ đọc, không có hành động ghi).

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Áp dụng` · CTA Secondary: `Xóa lọc`, `Thử lại`, `Xem thêm`
- Title: `Lịch sử di chuyển` · Helper bộ lọc: `Từ ngày`, `Đến ngày`
- Nhãn trong bản ghi: vị trí cũ rỗng → `(Chưa có vị trí)`; lý do rỗng → `(Không có lý do)`
- Wording trạng thái (chính xác):
  - `Tài sản chưa có lần di chuyển nào.`
  - `Không có lần di chuyển nào trong khoảng đã chọn.`
  - `Từ ngày không được sau Đến ngày.`
  - `Không tải được lịch sử.`
  - `— Đã hiển thị hết lịch sử —`

## 6. Edge case (xử lý UX)
- Lịch sử rất dài (hàng trăm bản ghi) → tải theo lô (cuộn vô hạn/"Xem thêm"), không tải hết một lần; giữ panel mở nhanh và cuộn mượt.
- Đường dẫn khu vực quá dài → cắt "..." + tooltip khi hover; không xuống dòng vỡ layout.
- Lý do dài → cho xuống dòng/giãn dòng, không cắt mất nội dung lý do (lý do là thông tin truy vết quan trọng).
- Khoảng lọc một phía (chỉ Từ ngày hoặc chỉ Đến ngày) → vẫn lọc hợp lệ.
- Đóng panel giữa lúc đang tải → hủy yêu cầu đang chờ, không cập nhật vào panel đã đóng.
- Cả Quản trị và Giám sát thấy giao diện như nhau (chỉ đọc) — không có nút quản trị nào để ẩn/hiện theo vai trò.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn (panel) 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity` (tránh layout-thrash). Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt; tắt stagger và pulse).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [S01 Bản đồ tài sản] | panel slide-in từ phải + scrim nền mờ dần; workspace giữ nguyên phía sau | 280ms · ease-out |
| Ra (exit) | → [S01 Bản đồ tài sản] | panel slide-out sang phải + scrim mờ tan; trả focus về pin/kết quả đã mở | 240ms · ease-in |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Mục timeline | tải xong trang đầu | stagger fade + slide-up từng mốc (trễ nhau ~40ms) | fade-out đồng loạt khi đổi bộ lọc | 180ms · ease-out / ease-in |
| Lô "Xem thêm" | nối thêm cuối danh sách | fade + slide-up các mục mới (không đụng mục cũ) | — | 160ms · ease-out |
| Thanh bộ lọc | mở/đóng (nếu thu gọn) | slide-down + fade | slide-up + fade | 160ms · ease-out / ease-in |
| Lỗi inline bộ lọc | hiện/ẩn khi khoảng sai | fade + slide-down nhẹ | fade-out | 150ms · ease-out / ease-in |
| Skeleton → nội dung | tải xong | crossfade skeleton sang dòng thật | — | 150ms · ease-out |
| Trạng thái rỗng/lỗi | hiện | fade + scale-up nhẹ minh họa | fade-out khi có dữ liệu | 180ms · ease-out / ease-in |

## 8. Ghi chú cho Designer
- Accessibility: timeline đọc được bằng bàn phím (cuộn, Tab qua các mục có thể focus); mốc thời gian và người thực hiện có tương phản đủ; phân biệt "cũ → mới" bằng cả icon mũi tên/nhãn chữ, không chỉ vị trí.
- Thứ tự focus: nút Đóng → Từ ngày → Đến ngày → Áp dụng → Xóa lọc → danh sách timeline → "Xem thêm".
- Mũi tên "→" giữa vị trí cũ và mới cần có nhãn ngữ nghĩa cho trình đọc màn hình (vd "chuyển từ ... đến ...").
- Vì là màn chỉ đọc, tránh mọi yếu tố trông giống nút sửa/xóa để không gây hiểu nhầm có thể chỉnh dữ liệu.
