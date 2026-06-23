---
name: ba-design-system
description: Use when cần thiết kế hệ thống design system cho dự án (token màu/typography/spacing/elevation, component, layout pattern, responsive/breakpoint, motion) — sinh docs/07-design-system.md làm nguồn style chuẩn cho ba-figma-design và ba-html-design; tài liệu cấp tổng, tùy chọn.
---

# ba-design-system — Thiết kế design system

## Mục tiêu
Sinh `docs/07-design-system.md` — nguồn **style chuẩn duy nhất** (single source of truth) cho dự án: token, component, layout pattern, responsive. Để `ba-figma-design` và `ba-html-design` bám theo, không mỗi màn tự chế màu/font.

> Tài liệu **cấp tổng**, tùy chọn. Không có dòng riêng trong ma trận tracking per-màn.

## Quy trình (hybrid — tự chọn nguồn theo hiện trạng)
1. Đọc `conventions.md` của `ba-toolkit`. Xác định nguồn:
   - **Đã có màn** (`html-design.html` / `design-spec.md` ở vài folder) → **reverse**: quét chúng, gom màu/typography/spacing/component **lặp lại** thành token nhất quán; đánh dấu chỗ mâu thuẫn (vd 3 sắc xanh khác nhau) và **chuẩn hoá về 1**.
   - **Chưa có màn** → **brief**: hỏi người dùng 3–4 câu (màu thương hiệu/logo, tông cảm xúc, font ưu tiên, sáng/tối) rồi sinh token.
   - REQUIRED SUB-SKILL: Use frontend-design — để token có thẩm mỹ, tránh bảng màu/typography generic.
2. Viết `docs/07-design-system.md` theo `design-system-template.md` (cùng thư mục) — điền **mọi** mục, token đặt tên **ngữ nghĩa** (`primary`/`surface`/`danger`…), kèm hex/giá trị cụ thể.
3. *(Tùy chọn)* đẩy token sang **Figma** qua `figma-mcp-go`: `create_variable_collection` + `create_variable` (màu/spacing), `create_paint_style`, `create_text_style`; ghi tên collection/style vào mục "Figma mapping" của file. → `ba-figma-design` dùng style thật thay vì hardcode hex.
4. Báo người dùng: từ nay `ba-figma-design`/`ba-html-design` bám `07-design-system.md`; nếu sửa token thì sửa ở đây rồi chạy lại 2 skill đó.

## Kỹ thuật áp dụng
- **Atomic Design:** tổ chức theo cấp — *atoms* (token, icon, nút, input) → *molecules* (field có label, search bar) → *organisms* (form, table, nav). Component bậc cao ghép từ bậc thấp, không định nghĩa lại style.
- **Semantic Design Tokens (phân lớp):** tách 2 lớp — *primitive* (giá trị thô: `blue-600 = #2563EB`) và *semantic* (vai trò: `primary = blue-600`, `danger`, `surface`, `text-primary`). Component chỉ tham chiếu token semantic. Đổi theme = đổi ánh xạ, không sửa component.
- **Modular Type Scale + lưới 8pt:** typography theo một thang tỉ lệ nhất quán (vd ratio 1.25); spacing/size là bội số của 4/8px — không dùng số lẻ tuỳ hứng.
- **WCAG AA contrast:** mọi cặp text/nền đạt tỉ lệ tương phản ≥ 4.5:1 (text thường) / 3:1 (text lớn & icon).

## Tiêu chí chất lượng (BẮT BUỘC)
- **Token ngữ nghĩa trước, hex sau:** đặt vai trò rồi gán giá trị; cấm component hardcode hex/px thô.
- **Tương phản ≥ WCAG AA:** ghi rõ tỉ lệ contrast cho cặp màu chính (primary trên nền, text trên surface); cặp không đạt phải chỉnh.
- **Spacing theo thang 8pt:** mọi padding/margin/gap là bội số 4/8; ngoại lệ phải ghi lý do.
- **Reverse nhất quán:** nếu các màn lệch nhau, **chọn 1 chuẩn** và ghi "đã chuẩn hoá từ X biến thể".
- Bám file mẫu đủ mục: token (primitive + semantic), component theo cấp Atomic, icon, layout pattern, **responsive/breakpoint + mobile rules**, motion (**gồm token chuyển màn & section in/out — bắt buộc**), a11y.

## Lưu ý
- Tiếng Việt. Doc cấp tổng — cập nhật khi token đổi, không gắn vào tracking per-màn.
- **Văn phong & Thuật ngữ:** mở rộng từ viết tắt ở lần đầu dùng; thêm footer `## Thuật ngữ` cuối `07-design-system.md` + bổ sung thuật ngữ mới (token, breakpoint, elevation…) vào `docs/00-glossary.md` — xem `conventions.md`.
