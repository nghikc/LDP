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
- Header: nút **hamburger ☰** (màn hẹp) · tiêu đề "Bản đồ tài sản" · **ô tra cứu nhanh** (trung tâm) · nút Nhật ký kiểm toán (Quản trị) · avatar/menu tài khoản.
- Body (3 vùng):
  - **Cột trái — Cây khu vực:** nút "+ Thêm khu vực" (chỉ Quản trị); **ô tìm khu vực** (tên/mã, không dấu) + nút **Bung tất cả / Thu gọn**; cây mở/đóng nhánh (mặc định thu gọn), **icon "đã có sơ đồ"** cạnh tên nút, menu ngữ cảnh mỗi nút, kéo-thả đổi nhánh (Quản trị). Trên màn hẹp cột này thành **drawer** mở từ hamburger.
  - **Vùng giữa — Khung sơ đồ:** breadcrumb đường dẫn + thanh công cụ (**+ Gán vị trí**, Lọc pin, Di dời hàng loạt, Xuất báo cáo) ở trên; ảnh sơ đồ zoom/pan + **marker** (chấm tròn + số + nhãn) / cụm; **chú thích màu vị trí** ở góc khung; khi đã có ảnh nhưng chưa có pin → lớp gợi ý đặt tài sản đầu tiên; dải cảnh báo "N pin cần đặt lại" ở dưới.
  - **Lớp nổi:** popup danh sách tài sản tại một vị trí (+ đổi tên + Gán thêm); ô gán đa chọn (tên vị trí + ô tìm); dialog xác nhận gỡ/xóa.
- Footer: không có footer cố định (workspace toàn màn).

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Ô tra cứu nhanh | Input + dropdown gợi ý | Gõ → gợi ý khớp một phần, không phân biệt dấu, < 1s; chọn → nhảy tới pin | 1–100 ký tự | R-S01-03 |
| Cây khu vực | Tree | Mở/đóng nhánh (mặc định thu gọn), click mở sơ đồ, kéo-thả đổi nhánh | Chặn thả vào nhánh con của chính nó | R-S01-01, R-S01-08 |
| Ô tìm khu vực | Input search | Gõ tên/mã (không dấu) → chỉ hiện nhánh khớp + tổ tiên, tự bung; [✕ Xóa lọc] để khôi phục | 0–100 ký tự | R-S01-17 |
| Nút Bung tất cả / Thu gọn | Toggle buttons | Mở/đóng mọi nhánh cây | Ẩn khi đang lọc (thay bằng Xóa lọc) | R-S01-17 |
| Icon "đã có sơ đồ" | Badge/icon | Hiện cạnh tên nút có ảnh sơ đồ; tooltip "Đã có sơ đồ mặt bằng" | Chỉ hiện khi nút có soDoUrl | R-S01-18 |
| Nút "+ Thêm khu vực" | Secondary CTA | Mở S02 (Form khu vực) | Chỉ hiện với Quản trị | R-S01-10 |
| Menu ngữ cảnh nút | Menu | Thêm con / Sửa (→S02) / Xóa (dialog) / Quản lý ảnh (→S03) | Mục cấu trúc ẩn với Giám sát | R-S01-09, R-S01-10 |
| Nút "+ Gán vị trí" | Secondary CTA (toolbar) | **Điểm vào trực quan** để tạo vị trí: bấm → vào *chế độ đặt pin* (con trỏ đổi + dải hướng dẫn "Click lên sơ đồ để đặt tài sản", có nút Thoát) | Hiện cho cả Quản trị & Giám sát | R-S01-06 |
| Khung sơ đồ | Canvas ảnh | Hiển thị ảnh + pin theo tọa độ %; zoom/pan; click trống (hoặc đang ở chế độ đặt pin) → gán | Pin trong vùng 0–100% | R-S01-02, R-S01-04, R-S01-06 |
| Lớp gợi ý đặt pin đầu tiên | Empty overlay | Khi sơ đồ có ảnh nhưng 0 pin → "Chưa có tài sản nào trên sơ đồ — bấm '+ Gán vị trí' rồi click lên sơ đồ"; ẩn khi có ≥1 pin | Chỉ hiện khi N pin = 0 | R-S01-11 |
| Marker vị trí | Marker (chấm tròn + số + nhãn) | 1 và nhiều tài sản đều cùng dạng; nhãn = tên vị trí / mã / "N tài sản"; vòng mờ ngoài; màu theo trạng thái (xanh/xám/vàng). Click → popup vị trí; cụm (>500) click → tách/zoom; **giữ + kéo → dời tọa độ** (Pointer Events) | Gom cụm khi > 500 điểm; kéo dịch >0.5% = kéo, ≤0.5% = click | R-S01-04, R-S01-05, R-S01-16 |
| Bộ lọc pin | Filter | Thu hẹp pin hiển thị theo trạng thái (Đã gán / Đang khóa / Cần đặt lại) | — | R-S01-05 |
| Chú thích màu vị trí | Legend | Góc khung sơ đồ: ●xanh Bình thường · ●xám Đang khóa · ●vàng Cần đặt lại | Không che vùng đặt pin | R-S01-19 |
| Ô gán đa chọn | Search modal + checkbox | Trường "Tên vị trí (tùy chọn)" + ô tìm (mã/tên không dấu) + danh sách checkbox tài sản **chưa có vị trí**, giới hạn 50 dòng; dòng đếm "N kết quả · Đã chọn M"; Gán → tạo M pin cùng tọa độ | Chọn ≥1 tài sản; nút Gán disable khi M=0 | R-S01-06, R-S01-12, R-S01-14 |
| Popup vị trí (danh sách) | Popover/Modal | Tiêu đề = tên vị trí / "N tài sản"; ô [Tên vị trí]+[Lưu tên]; mỗi tài sản: [Xem lịch sử]→S06, [Di dời]→S04, [Gỡ vị trí]; nút [+ Gán thêm tài sản vào vị trí này] | Gỡ/Di dời chặn khi bị khóa; Gán thêm ẩn khi hết tài sản chưa có vị trí; gỡ hết → popup đóng | R-S01-04, R-S01-07, R-S01-13, R-S01-14 |
| Dialog xác nhận xóa | Modal | Hiện số tài sản bị gỡ + số khu con bị xóa | Phải xác nhận mới xóa | R-S01-09 |
| Nút Di dời hàng loạt | Secondary CTA | Mở S04 | — | R-S01-10 |
| Nút Xuất báo cáo | Secondary CTA | Mở S08 | — | R-S01-10 |
| Dải "N pin cần đặt lại" | Banner | Đếm pin cần đặt lại → S05 | Ẩn khi N=0 | R-S01-10 |
| Hamburger ☰ + Drawer cây | Nav toggle + Drawer | Màn hẹp (≤768px): ☰ mở drawer cây khu vực + scrim; chọn nút → đóng | Chỉ hiển thị/áp dụng ở ≤768px | R-S01-N06 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: cây trống → minh họa + CTA "Tạo khu vực đầu tiên" (Quản trị); nút chưa có ảnh → khung giữa "Chưa có sơ đồ" + CTA "Tải ảnh sơ đồ" (Quản trị) / thông báo nhờ Quản trị (Giám sát); **nút đã có ảnh nhưng chưa có pin nào → lớp gợi ý "Chưa có tài sản nào trên sơ đồ — bấm '+ Gán vị trí' rồi click lên sơ đồ để đặt tài sản đầu tiên"**.
- 🔄 Loading: skeleton cho cây; spinner/placeholder mờ cho khung sơ đồ khi đang tải ảnh + pin.
- 🔴 Error: tải ảnh thất bại → thông báo "Không tải được sơ đồ" + nút "Thử lại"; tra cứu lỗi → "Không tìm thấy tài sản".
- 🟢 Success: gán 1 → toast "Đã gán vị trí cho tài sản"; gán nhiều → toast "Đã gán vị trí cho M tài sản"; gỡ → toast "Đã gỡ vị trí"; đặt tên → toast "Đã đặt tên vị trí" (rỗng → "Đã xóa tên vị trí"); xóa → toast "Đã xóa khu vực".
- 🔍 Lọc cây: gõ ô tìm khu vực không khớp → các nhánh không khớp bị ẩn (cây trống nhánh) → gợi ý xóa lọc; ô tìm trong ô gán không khớp → "Không tìm thấy tài sản phù hợp".
- 📱 Mobile (≤768px): cây ẩn trong drawer (mở bằng ☰ + scrim); ô tra cứu full-width; modal/panel chiếm gần full màn.

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Gán vị trí (M)` · CTA Secondary: `+ Gán vị trí`, `+ Gán thêm tài sản vào vị trí này`, `Lưu tên`, `Hủy`, `+ Thêm khu vực`, `Bung tất cả`, `Thu gọn`, `Di dời hàng loạt`, `Xuất báo cáo`
- Microcopy ô gán đa chọn: nhãn `Tên vị trí (tùy chọn)`, placeholder `vd Khu máy nén`; nhãn `Chọn tài sản (chưa có vị trí)`, placeholder ô tìm `Tìm theo mã/tên tài sản...`; dòng đếm `N kết quả · Đã chọn M` (vượt 50 → `... (hiện 50 đầu — gõ để thu hẹp)`); danh sách rỗng `Không tìm thấy tài sản phù hợp.` / `Không còn tài sản chưa có vị trí.`
- Microcopy cây khu vực: placeholder `Tìm khu vực theo tên/mã...`; tooltip icon sơ đồ `Đã có sơ đồ mặt bằng`.
- Microcopy popup vị trí: tiêu đề `N tài sản tại vị trí này` (hoặc tên vị trí); placeholder đổi tên `Đặt tên vị trí (vd Khu máy nén)`.
- Microcopy chế độ đặt pin: dải hướng dẫn `Click lên sơ đồ để đặt tài sản` + nút `Thoát`; empty-state sơ đồ chưa có pin: `Chưa có tài sản nào trên sơ đồ — bấm "+ Gán vị trí" rồi click lên sơ đồ để đặt tài sản đầu tiên.`
- Title: `Bản đồ tài sản` · Helper text ô tra cứu: `Tra cứu mã/tên tài sản...`
- Wording lỗi/thành công (chính xác):
  - `Đã gán vị trí cho tài sản.` / `Đã gán vị trí cho {m} tài sản.`
  - `Đã đặt tên vị trí.` / `Đã xóa tên vị trí.`
  - `Vui lòng chọn ít nhất một tài sản chưa có vị trí.`
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
| Popup vị trí (danh sách) | click marker / đóng | fade + scale-up từ marker | fade + scale-down về marker | 180ms · ease-out/in |
| Ô gán đa chọn | click điểm trống / hủy | fade + slide-up | fade-out | 180ms · ease-out/in |
| Dialog xác nhận gỡ/xóa | mở / đóng | fade nền + scale-up dialog | fade + scale-down | 200ms · ease-out/in |
| Nhánh cây | mở/đóng nhánh | slide-down + fade các con | slide-up + fade | 160ms · ease-out/in |
| Toast thành công | hiện/ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |
| Pin làm nổi (tra cứu) | sau khi nhảy tới | nhấp nháy/scale pulse 2 nhịp | tắt pulse | 600ms · ease-in-out |
| Cụm pin | tách khi zoom | các pin tỏa ra từ tâm cụm | gộp về tâm | 200ms · ease-out/in |
| **Drawer cây (mobile)** | ☰ mở / chọn nút / chạm scrim | drawer trượt vào từ trái + **scrim** fade vào | drawer trượt ra trái + scrim fade ra | 250ms · ease-out/in |
| **Kéo-thả marker** | giữ + kéo / thả | marker bám con trỏ tức thì (transform, không transition khi kéo) + bóng/scale nhẹ báo "đang kéo"; thả → marker settle về tọa độ mới | trở lại trạng thái thường | bám real-time · settle 120ms ease-out |
| **Đổi tên vị trí / nhãn marker** | lưu tên | nhãn marker cross-fade sang tên mới | — | 150ms · ease-out |

## 8. Responsive (≤768px) — BẮT BUỘC
- **Cây khu vực → drawer:** ẩn cột trái, đưa vào drawer mở từ nút **hamburger ☰** ở header; mở kèm **scrim** (nền tối) phủ nội dung; **chọn một nút → drawer tự đóng**; chạm scrim cũng đóng.
- **Ô tra cứu:** chiếm **full-width** dưới header.
- **Modal/panel** (ô gán, popup vị trí, dialog, các màn vệ tinh): chiếm gần **full màn** (tránh popover hẹp khó thao tác bằng ngón tay).
- **Marker & kéo-thả:** touch target đủ lớn; dùng Pointer Events nên kéo-thả chạy được bằng ngón tay; phân biệt chạm (mở popup) với kéo (>0.5%).
- Chặn cuộn ngang (overflow-x hidden) để không lộ "vạch trắng" mép phải.

## 9. Ghi chú cho Designer
- Accessibility: tương phản marker/nền sơ đồ đủ rõ; marker có nhãn text khi focus; thao tác cây dùng được bằng bàn phím (mũi tên mở/đóng, Enter mở sơ đồ); thứ tự focus: ô tra cứu → cây → thanh công cụ → sơ đồ.
- Phân biệt trạng thái vị trí bằng cả số/hình dạng + nhãn, không chỉ màu (bình thường / đang khóa / cần đặt lại) để hỗ trợ người mù màu; kèm chú thích màu ở góc khung.
- **Pin dính đúng điểm khi co giãn:** ảnh + marker trong hộp khớp tỉ lệ ảnh thật (aspect-ratio theo kích thước tự nhiên), tọa độ tương đối % của hộp → không lệch ở mọi kích thước/zoom.
- Khu vực chạm (touch target) của marker đủ lớn khi dùng trên màn cảm ứng/laptop touchpad.
