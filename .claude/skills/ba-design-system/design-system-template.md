# Template — `docs/07-design-system.md`

> Khuôn cho `ba-design-system`. Điền MỌI mục; giữ token đặt tên ngữ nghĩa + giá trị cụ thể. Xoá phần ví dụ `[...]` khi điền thật.

---

# Design System — [Tên dự án]

> Nguồn style chuẩn cho `ba-figma-design` và `ba-html-design`. Sửa token ở đây, không sửa rải rác từng màn.
> Nguồn lập: [reverse từ N màn đã có | brief từ stakeholder] · ngày [DD/MM/YYYY].

## 1. Nguyên tắc thiết kế
- [3–5 nguyên tắc: vd "rõ ràng hơn hoa mỹ", "nhất quán", "tiếp cận được (WCAG AA)", tông thương hiệu].

## 2. Màu (Color tokens)
Đặt theo **vai trò** (semantic), không theo tên màu thô. Khuyến nghị phân 2 lớp: *primitive* (giá trị thô, vd `indigo-600 = #4F46E5`) → *semantic* (vai trò bên dưới ánh xạ về primitive).
> **Kiểm WCAG AA (BẮT BUỘC):** cặp `text/primary` trên `surface/bg` và `brand/primary` trên nền dùng kèm phải đạt tương phản ≥ 4.5:1 (text thường) / ≥ 3:1 (text lớn & icon). Ghi tỉ lệ thực tế ở mục a11y phía dưới.

| Token | Hex | Dùng cho |
|---|---|---|
| `brand/primary` | `#4F46E5` | CTA chính, link, nhấn mạnh |
| `brand/primary-hover` | `#4338CA` | trạng thái hover của primary |
| `surface/bg` | `#EEF2F7` | nền trang |
| `surface/card` | `#FFFFFF` | nền card/panel |
| `border` | `#D1D5DB` | viền input, đường kẻ |
| `text/primary` | `#111827` | tiêu đề, nội dung chính |
| `text/secondary` | `#6B7280` | phụ, helper |
| `text/placeholder` | `#9CA3AF` | placeholder |
| `state/success` | `#16A34A` | thành công |
| `state/warning` | `#F59E0B` | cảnh báo, độ mạnh "trung bình" |
| `state/danger` | `#DC2626` | lỗi, viền lỗi |
| `state/info` | `#0EA5E9` | thông tin |
- *(Tùy chọn)* **Dark mode**: bảng token tương ứng nếu hỗ trợ.

## 3. Typography
- **Font family:** [vd Inter] (fallback: system-ui, sans-serif).
- **Thang cỡ chữ + weight + line-height:**

| Cấp | Size | Weight | Line-height | Dùng cho |
|---|---|---|---|---|
| `display`/`h1` | 26 | 700 | 1.2 | tiêu đề trang/brand |
| `h2` | 20 | 700 | 1.3 | tiêu đề section/card |
| `body` | 14 | 400 | 1.5 | nội dung |
| `label` | 13 | 500 | 1.4 | nhãn trường |
| `caption` | 12 | 400 | 1.4 | helper, footer |

## 4. Spacing, Radius, Elevation
- **Spacing scale** (gốc 4/8px): `xxs 4 · xs 8 · sm 12 · md 16 · lg 24 · xl 32 · 2xl 48`.
- **Radius:** `xs 4 · sm 8 · md 12 · lg 16 · pill 999`.
- **Elevation / shadow:**

| Token | Giá trị | Dùng cho |
|---|---|---|
| `shadow/sm` | `0 1px 2px rgba(0,0,0,.06)` | input, nút |
| `shadow/md` | `0 4px 12px rgba(0,0,0,.08)` | card |
| `shadow/overlay` | `0 12px 32px rgba(0,0,0,.18)` | modal, dropdown |

## 5. Iconography
- Bộ icon: [vd Lucide], cỡ chuẩn `16 / 20 / 24`, màu kế thừa `currentColor`. Quy tắc dùng: [đi kèm text khi có thể; icon-only phải có `aria-label`].

## 6. Component
Mỗi component: mô tả + **variants** + **states** (default/hover/focus/disabled/error).

- **Button:** `primary` (nền brand), `secondary/outline` (viền), `ghost/icon-btn`. Cao 44/40/36; radius `sm`; disabled = nền `brand/primary` mờ.
- **Badge & Chip:** tag, status (success/warning/danger), unread, filter chip (chọn được).
- **Form controls:** input text, select, textarea, switch/checkbox/radio. Cao 44; viền `border`; focus = viền `brand/primary` + ring; error = viền `state/danger` + helper đỏ.
- **Tabs:** tab active (gạch chân/nền), inactive.
- **Navigation:** nav item active/inactive (sidebar/topbar).
- **Data table:** header, row, zebra/hover, cuộn ngang khi hẹp; đi kèm toolbar (search + filter).
- **Overlays:** dropdown/menu, tooltip, toast/snackbar, modal/dialog (kèm `shadow/overlay`, backdrop).

## 7. Composite / domain components (đặc thù dự án)
- [Các block lặp đặc thù — vd: thẻ hội thoại, bong bóng chat in/out, system message, card hồ sơ. Mô tả cấu trúc + token dùng. Bỏ qua nếu không có.]

## 8. Layout pattern / page template
- **Trang form:** header trang → card nội dung → lưới form 2 cột (responsive về 1 cột).
- **Trang danh sách:** toolbar (search/filter/CTA) → bảng dữ liệu → phân trang.
- [Thêm pattern khác nếu dự án có: trang chi tiết, dashboard…]

## 9. Grid & Responsive
- **Breakpoints:** `desktop ≥1200 · laptop ≥992 · tablet ≥768 · mobile <768`.
- **Container/grid:** [max-width, số cột, gutter].
- **Quy tắc mobile:** touch target ≥ 44×44px; input `font-size ≥16px` (tránh iOS auto-zoom); dùng `100dvh` thay `100vh`; ưu tiên `transform` cho animation (mượt); card full-width bỏ bo góc ở màn rất nhỏ.

## 10. Motion / Animation
- **Duration:** micro `100ms` · thường `150–200ms` · overlay `250ms` · chuyển màn `250–300ms`.
- **Easing:** `ease-out` cho xuất hiện (enter), `ease-in` cho biến mất (exit); overlay/chuyển màn `cubic-bezier(0.4,0,0.2,1)`.
- **Token chuyển cảnh (BẮT BUỘC — nguồn cho `ba-screen-spec` & `ba-html-design`):**

| Token | Hiệu ứng | Duration · easing | Dùng cho |
|---|---|---|---|
| `motion/page-enter` | slide-in + fade | 250ms · ease-out | màn xuất hiện khi điều hướng tới |
| `motion/page-exit` | fade + scale 0.98 | 200ms · ease-in | màn rời đi |
| `motion/section-enter` | fade + slide-up 8px | 150ms · ease-out | panel/section/list xuất hiện |
| `motion/section-exit` | fade + slide-down 8px | 150ms · ease-in | panel/section biến mất |
| `motion/overlay` | fade + scale | 250ms · ease-out/in | modal/dropdown/toast |
- Quy tắc: lỗi inline fade-in 150ms; **không** nảy/giật; mọi chuyển màn & section in/out bám token trên; tôn trọng `prefers-reduced-motion` (giảm còn fade hoặc tắt).

## 11. Accessibility
- Tương phản text/nền ≥ **4.5:1** (WCAG AA); focus visible rõ trên mọi element tương tác; mọi input có `<label>`; thông báo lỗi `role="alert"`; thứ tự Tab hợp lý.

## 12. Figma mapping (tùy chọn)
- Collection: [tên] · Paint styles: [danh sách] · Text styles: [danh sách] — do `ba-design-system` tạo qua `figma-mcp-go` để `ba-figma-design` dùng lại.

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| Design token | Biến thiết kế (màu, cỡ chữ, spacing…) đặt tên theo vai trò |
| Primitive / Semantic token | Giá trị thô (vd `blue-600`) / token theo vai trò ánh xạ về primitive (vd `primary`) |
| Breakpoint | Ngưỡng độ rộng màn hình để đổi bố cục responsive |
| Elevation | Độ nổi (bóng đổ) phân lớp giao diện |
| WCAG AA | Mức tuân thủ tiêu chuẩn tiếp cận web (tương phản ≥ 4.5:1) |
| Atomic Design | Tổ chức component theo cấp: atoms → molecules → organisms |
| `prefers-reduced-motion` | Tùy chọn hệ thống yêu cầu giảm chuyển động |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
