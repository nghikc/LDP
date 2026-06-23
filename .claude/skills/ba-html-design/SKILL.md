---
name: ba-html-design
description: Use when cần dựng bản thiết kế HTML trực quan cho một màn hình đã có ascii-screen, srs và design-spec; bước 5 của BA toolkit, sinh html-design.html trong folder màn hình.
---

# ba-html-design — Dựng HTML cho 1 màn hình

## Mục tiêu
Cho một màn hình, sinh `docs/<Nhóm>/<Màn>/html-design.html` — bản dựng trực quan tĩnh.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit`, cùng `ascii-screen.md`, `srs.md` và `design-spec.md` của màn hình để lấy bố cục, yêu cầu và UI brief (states/CTA/microcopy). Nếu có `docs/07-design-system.md` → bám token màu/typography/spacing trong đó (đồng bộ với Figma), không tự chế.
2. Khi chạy tương tác: REQUIRED SUB-SKILL: Use frontend-design để dựng giao diện chất lượng cao. Khi chạy batch/tự động (không gọi được frontend-design): tự viết HTML tự chứa trực tiếp, không chờ sub-skill.
3. Viết một file HTML **độc lập, tự chứa** (CSS inline hoặc trong `<style>`, không cần build) phản ánh đúng bố cục ascii và các thành phần trong srs. Dùng dữ liệu mẫu tĩnh. Áp dụng các kỹ thuật bên dưới.
4. Cập nhật ô `html` của màn hình trong `docs/00-tracking.md` = ✅ và cột "Cập nhật cuối".

## Kỹ thuật áp dụng
- **Mobile-first Responsive Grid:** viết style cho mobile trước, mở rộng lên bằng `@media (min-width)`; dùng đúng breakpoint của `07-design-system.md` (hoặc mặc định desktop ≥1200 / tablet ≥768 / mobile <768). Bố cục co giãn (flex/grid), không cố định px cho khung chính.
- **UI-State Completeness:** dựng đủ các trạng thái mà design-spec/srs nêu — *Empty* (chưa có dữ liệu), *Loading*, *Error* (lỗi/validation), *Success/Default*. Tối thiểu màn có dữ liệu phải kèm cách thể hiện trạng thái rỗng & lỗi.
- **WCAG AA:** tương phản text/nền ≥ 4.5:1; input có `<label>`; nút/icon có nhãn truy cập; focus thấy được.
- **Design Token adherence:** lấy màu/typography/spacing từ `07-design-system.md` (nếu có); spacing theo thang 8pt; không tự chế hex/cỡ chữ ngoài hệ token.
- **Animation chuyển cảnh (BẮT BUỘC):** hiện thực mục Animation của design-spec — chuyển section/panel/modal/tab/toast **vào-ra** mượt bằng `transform`/`opacity` (tránh layout-thrash), enter `ease-out` / exit `ease-in`, duration theo Motion token `07-design-system.md` (nếu có). Mô phỏng chuyển màn bằng transition trên container chính. Bọc khối `@media (prefers-reduced-motion: reduce)` để giảm/tắt.

## Tiêu chí chất lượng (BẮT BUỘC)
- **Đủ UI state** mà tài liệu yêu cầu (ít nhất Default + Empty/Error nếu màn có dữ liệu động).
- **Responsive thực sự:** thu hẹp cửa sổ không vỡ bố cục; có ≥1 breakpoint chuyển layout.
- **Tương phản ≥ WCAG AA** và mọi input có label.
- **Có animation in/out** cho các section động + overlay (modal/dropdown/toast) mà design-spec nêu, dùng `transform`/`opacity`; **có khối `prefers-reduced-motion`** giảm/tắt chuyển động.
- Bám token `07-design-system.md` khi có; không hardcode style lệch hệ.

## Lưu ý
- File mở được trực tiếp trên trình duyệt, không phụ thuộc package.
- **Tự chứa (offline):** mọi ảnh nhúng dạng `data:<mime>;base64,...` hoặc inline SVG — không trỏ URL ngoài. Biểu đồ/chart vẽ bằng **inline SVG** (hoặc khối ```mermaid``` nếu xuất qua `ba-portal`, render offline bằng mermaid vendored) — không nhúng thư viện chart qua CDN.
- Nhãn/nội dung tiếng Việt, khớp ascii-screen.
- Một màn hình mỗi lần.
