---
name: ba-figma-design
description: Use when đã có design-spec.md của một màn và muốn dựng bản thiết kế trực quan lên Figma để xem trước qua MCP figma-mcp-go, trước bước ba-html-design; bước tùy chọn của BA toolkit.
---

# ba-figma-design — Dựng preview Figma cho 1 màn hình

## Mục tiêu
Từ tài liệu thiết kế của một màn, dựng frame trực quan lên Figma (qua `figma-mcp-go`) để xem trước, rồi lưu link vào `design-spec.md`. Bước **tùy chọn**, chạy giữa `ba-screen-spec` và `ba-html-design` — Figma chỉ để xem trước, HTML vẫn dựng từ design-spec như cũ.

## Input (ưu tiên nguồn style)
1. **`docs/07-design-system.md` nếu có** → nguồn CHUẨN cho màu, typography, spacing, component/token. Có file này thì thiết kế phải bám theo nó, không tự chế style khác.
2. `design-spec.md` của màn → UI States/CTA/microcopy/a11y; và style nội tuyến nếu (1) không có.
3. `ascii-screen.md` → khung bố cục. `srs.md` → thành phần/nhãn.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit` + các input trên.
2. **Dò figma-mcp-go sẵn sàng** (vd gọi `get_document`/`get_pages`). Không gọi được → báo "Figma MCP chưa sẵn sàng — bỏ qua bước Figma" và kết thúc êm (không lỗi, không chặn pipeline).
3. Tạo/chọn page theo nhóm màn. Dựng **frame chính `<Màn> (Default)`** bằng `create_frame` + `set_auto_layout` phản ánh bố cục `ascii-screen`; đổ text/CTA/microcopy bằng `create_text` từ design-spec; áp màu/spacing/bo góc/typography (`set_fills`, `set_corner_radius`, `create_text_style`…) lấy từ design system (nếu có) hoặc design-spec.
4. *(Tùy chọn)* thêm frame cho UI State khác (Loading/Empty/Error) nếu design-spec liệt kê.
5. Lấy **link**: `figma-mcp-go` thao tác trên file Figma **đang mở** và KHÔNG trả file key → "link" lưu được là **node id + tên page** (vd `54:2` / Page 1), không phải URL `figma.com/...`. Muốn URL share: người dùng copy link trong Figma.
6. Ghi/cập nhật mục `## Bản Figma (preview)` ở đầu `design-spec.md`: node id · page · ngày · trạng thái (Đã dựng) · palette dùng. Cập nhật cột "Cập nhật cuối" của màn trong `00-tracking.md` (**không thêm cột mới**).
7. *(Tùy chọn)* chụp xác minh — xem "Lưu ý kỹ thuật". Báo người dùng node/preview; gợi ý duyệt xong thì chạy `ba-html-design`.

## Kỹ thuật áp dụng
- **Atomic Component + Auto-layout:** dựng theo cấp — tạo frame cha (organism: card/form/nav) chứa frame con (molecule/atom), bật `set_auto_layout` để con tự xếp; tái dùng cấu trúc thay vì vẽ phẳng từng phần tử rời.
- **UI-State Variants:** ngoài frame `Default`, dựng thêm frame cho mỗi state mà design-spec liệt kê (Loading/Empty/Error/Success) để review đủ trạng thái.
- **Token binding:** áp màu/typography/spacing từ `07-design-system.md` (nếu có) qua `create_paint_style`/`create_text_style`/variable, không hardcode hex rời rạc.
- **Chuyển cảnh (minh hoạ):** Figma tĩnh không chạy animation — ghi chú mục Animation của design-spec (chuyển màn vào/ra + section in/out) thành text note cạnh frame, hoặc dựng cặp frame trước→sau cho section in/out chính. Giữ nhất quán với `07-design-system.md` (token `motion/*`).

## Tiêu chí chất lượng (BẮT BUỘC)
- Frame có **cấu trúc component lồng + auto-layout** (không phải các node tuyệt đối rời rạc).
- Dựng đủ **các UI state chính** mà design-spec nêu (tối thiểu Default; thêm Empty/Error nếu có dữ liệu động).
- **Bám token** design system khi có; nhãn/microcopy khớp `design-spec.md` + `ascii-screen.md`.

## Lưu ý kỹ thuật figma-mcp-go
- **Dựng tuần tự để giữ thứ tự:** tạo node cha trước, lấy id, rồi tạo con; auto-layout xếp con theo thứ tự tạo. `create_frame` không có tham số bo góc/viền → bo góc dùng `set_corner_radius` (gộp nhiều node 1 lần), viền dùng `set_strokes` (từng node).
- **Căn chỉnh con:** frame căn `counterAxisAlignItems: MIN` sẽ căn trái mọi con — muốn 1 phần tử căn giữa (vd link) thì bọc nó trong frame con căn `CENTER`.
- **Chụp preview kén:** `get_screenshot` trả base64 thường **quá lớn để đọc inline**; `save_screenshots` **từ chối path có dấu tiếng Việt** (lỗi chuẩn hoá Unicode). Cách chắc: gọi `get_screenshot` rồi giải mã base64 từ file tool-results bằng python ra PNG ở path ASCII, sau đó đọc ảnh.

## Lưu ý
- MCP tùy chọn: vắng `figma-mcp-go` thì no-op, KHÔNG chặn pipeline.
- Không thêm cột tracking — link chỉ sống trong `design-spec.md`.
- Một màn mỗi lần. Nhãn/nội dung tiếng Việt, khớp `ascii-screen`.
- Có `07-design-system.md` → thiết kế nhất quán với token/style trong đó.
