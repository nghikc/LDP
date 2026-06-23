# Design Spec — Bản đồ tài sản (Workspace) (Mã màn: S01)

## Bản Figma (preview)
- Node: `291:372` · Page: `Genysic — Company Profile 2026` · Section: `QLVT — Quản lý bảo trì (8 màn)` (`291:371`)
- Trạng thái: **Đã dựng** · Ngày: 2026-06-23
- Palette: primary `#0b5cab` · bg `#f4f6f8` · surface `#fff` · border `#cbd3dd` · text `#1b2430` · danger `#b3261e` · warn `#fff4e0` · radius 8
- Ghi chú: figma-mcp-go thao tác trên file Figma đang mở, không trả URL share. Mở Figma → chọn node theo id ở trên để copy link chia sẻ.


## 1. Tổng quan UX
- Mục tiêu UX: thao tác nhanh, định vị tức thì; một màn làm trung tâm để vừa duyệt cấu trúc vừa thấy bố trí thực tế. Giảm số bước để "biết tài sản ở đâu" xuống tối thiểu.
- Thiết bị mục tiêu: **Web/Desktop-first** (màn rộng để hiển thị cây + sơ đồ song song); thu gọn cây thành drawer khi màn hẹp.
- User flow tóm tắt: [Đăng nhập] → **[Bản đồ tài sản — Workspace]** → [Form khu vực / Quản lý ảnh sơ đồ / Di dời / Pin cần đặt lại / Lịch sử / Xuất báo cáo]

## 2. Cấu trúc layout (anatomy)
- Header: tiêu đề "Bản đồ tài sản" · **ô tra cứu nhanh** (trung tâm) · avatar/menu tài khoản.
- Body (3 vùng):
  - **Cột trái — Cây khu vực:** nút "+ Thêm khu vực" (chỉ Quản trị), cây mở/đóng nhánh, menu ngữ cảnh mỗi nút, kéo-thả (Quản trị).
  - **Vùng giữa — Khung sơ đồ:** breadcrumb đường dẫn + thanh công cụ (Lọc pin, Di dời hàng loạt, Xuất báo cáo) ở trên; ảnh sơ đồ zoom/pan + pin/cụm; dải cảnh báo "N pin cần đặt lại" ở dưới.
  - **Lớp nổi:** popup chi tiết pin; ô chọn tài sản khi gán; dialog xác nhận xóa.
- Footer: không có footer cố định (workspace toàn màn).

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Ô tra cứu nhanh | Input + dropdown gợi ý | Gõ → gợi ý khớp một phần, không phân biệt dấu, < 1s; chọn → nhảy tới pin | 1–100 ký tự | R-S01-03 |
| Cây khu vực | Tree | Mở/đóng nhánh, click mở sơ đồ, kéo-thả đổi nhánh | Chặn thả vào nhánh con của chính nó | R-S01-01, R-S01-08 |
| Nút "+ Thêm khu vực" | Secondary CTA | Mở S02 (Form khu vực) | Chỉ hiện với Quản trị | R-S01-10 |
| Menu ngữ cảnh nút | Menu | Thêm con / Sửa (→S02) / Xóa (dialog) / Quản lý ảnh (→S03) | Mục cấu trúc ẩn với Giám sát | R-S01-09, R-S01-10 |
| Khung sơ đồ | Canvas ảnh | Hiển thị ảnh + pin theo tọa độ %; zoom/pan; click trống → gán | Pin trong vùng 0–100% | R-S01-02, R-S01-04 |
| Pin / Cụm pin | Marker | Pin đơn click → popup; cụm (>500) click → tách/zoom | Gom cụm khi > 500 điểm | R-S01-04, R-S01-05 |
| Bộ lọc pin | Filter | Thu hẹp pin hiển thị theo tiêu chí | — | R-S01-05 |
| Ô chọn tài sản (gán) | Search modal | Chỉ liệt kê tài sản chưa có vị trí | Bắt buộc chọn 1 tài sản | R-S01-06 |
| Popup chi tiết pin | Popover | Mã/tên/trạng thái/đường dẫn + [Xem lịch sử]→S06, [Di dời]→S04, [Gỡ vị trí] | Gỡ/Di dời chặn khi bị khóa | R-S01-04, R-S01-07 |
| Dialog xác nhận xóa | Modal | Hiện số tài sản bị gỡ + số khu con bị xóa | Phải xác nhận mới xóa | R-S01-09 |
| Nút Di dời hàng loạt | Secondary CTA | Mở S04 | — | R-S01-10 |
| Nút Xuất báo cáo | Secondary CTA | Mở S08 | — | R-S01-10 |
| Dải "N pin cần đặt lại" | Banner | Đếm pin cần đặt lại → S05 | Ẩn khi N=0 | R-S01-10 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: cây trống → minh họa + CTA "Tạo khu vực đầu tiên" (Quản trị); nút chưa có ảnh → khung giữa "Chưa có sơ đồ" + CTA "Tải ảnh sơ đồ" (Quản trị) / thông báo nhờ Quản trị (Giám sát).
- 🔄 Loading: skeleton cho cây; spinner/placeholder mờ cho khung sơ đồ khi đang tải ảnh + pin.
- 🔴 Error: tải ảnh thất bại → thông báo "Không tải được sơ đồ" + nút "Thử lại"; tra cứu lỗi → "Không tìm thấy tài sản".
- 🟢 Success: gán → toast "Đã gán vị trí cho tài sản"; gỡ → toast "Đã gỡ vị trí"; xóa → toast "Đã xóa khu vực".

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Gán vị trí` · CTA Secondary: `Hủy`, `+ Thêm khu vực`, `Di dời hàng loạt`, `Xuất báo cáo`
- Title: `Bản đồ tài sản` · Helper text ô tra cứu: `Tra cứu mã/tên tài sản...`
- Wording lỗi/thành công (chính xác):
  - `Đã gán vị trí cho tài sản.`
  - `Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.`
  - `Không thể di chuyển khu vực vào chính nhánh con của nó.`
  - `Xóa khu vực này sẽ gỡ vị trí của {n} tài sản và xóa {m} khu vực con. Tiếp tục?`
  - `Không tìm thấy tài sản.`

## 6. Edge case (xử lý UX)
- Rớt mạng khi gán/gỡ/xóa → giữ thao tác đang nhập, snackbar "Lỗi kết nối, chưa lưu được"; không tạo pin nửa vời.
- Tên tài sản/đường dẫn quá dài → cắt "..." + tooltip khi hover.
- Sơ đồ rất nhiều pin (> 500) → gom cụm để tránh rối; bộ lọc giúp thu hẹp.
- Pin tràn ngoài vùng ảnh mới (sau thay ảnh) → đánh dấu + dồn vào dải "N pin cần đặt lại" → S05.
- Giám sát mở menu nút → các mục quản lý cấu trúc bị ẩn, không chỉ disable.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity`. Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [Đăng nhập] | fade-in toàn workspace + cây slide-in nhẹ từ trái | 280ms · ease-out |
| Ra (exit) → modal | → [S02/S03/S04/S08] | nền workspace mờ & lùi scale 0.99, modal trượt lên | 250ms · ease-in |
| Ra (exit) → panel | → [S05/S06/S07] | workspace giữ nguyên, panel slide-in từ phải | 250ms · ease-out |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Popup chi tiết pin | click pin / đóng | fade + scale-up từ pin | fade + scale-down về pin | 180ms · ease-out/in |
| Ô chọn tài sản (gán) | click điểm trống / hủy | fade + slide-up | fade-out | 180ms · ease-out/in |
| Dialog xác nhận xóa | mở / đóng | fade nền + scale-up dialog | fade + scale-down | 200ms · ease-out/in |
| Nhánh cây | mở/đóng nhánh | slide-down + fade các con | slide-up + fade | 160ms · ease-out/in |
| Toast thành công | hiện/ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |
| Pin làm nổi (tra cứu) | sau khi nhảy tới | nhấp nháy/scale pulse 2 nhịp | tắt pulse | 600ms · ease-in-out |
| Cụm pin | tách khi zoom | các pin tỏa ra từ tâm cụm | gộp về tâm | 200ms · ease-out/in |

## 8. Ghi chú cho Designer
- Accessibility: tương phản pin/nền sơ đồ đủ rõ; pin có nhãn text khi focus; thao tác cây dùng được bằng bàn phím (mũi tên mở/đóng, Enter mở sơ đồ); thứ tự focus: ô tra cứu → cây → thanh công cụ → sơ đồ.
- Phân biệt trạng thái pin bằng cả hình dạng/icon, không chỉ màu (đang dùng / đang khóa / cần đặt lại) để hỗ trợ người mù màu.
- Khu vực chạm (touch target) của pin đủ lớn khi dùng trên màn cảm ứng/laptop touchpad.
