---
name: ba-screen-spec
description: Use when cần đặc tả chi tiết một màn hình cụ thể — sinh wireframe ASCII, brainstorm, SRS, use case, user story và design spec (UI brief) cho màn hình đó; bước 4 của BA toolkit.
---

# ba-screen-spec — Đặc tả 1 màn hình

## Mục tiêu
Cho một màn hình (folder `docs/<Nhóm>/<Màn>/`), sinh 6 file: `ascii-screen.md`, `brainstorm.md`, `srs.md`, `usecase.md`, `userstory.md`, `design-spec.md`.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit`, `docs/01-requirements.md`, `docs/02-functions.md`, `docs/03-overview.md` để lấy ngữ cảnh và chức năng (`F..`) gắn với màn này.
2. Sinh 6 file theo các mục trong `templates.md` (cùng thư mục), theo thứ tự: brainstorm → ascii-screen → srs → usecase → userstory → design-spec (mỗi file dựa trên file trước; design-spec đúc kết thành UI brief cho Designer).
3. Cập nhật `docs/00-tracking.md`: 6 ô ascii/brainstorm/srs/usecase/userstory/design-spec = ✅, cập nhật cột "Cập nhật cuối".
   - Thêm footer `## Thuật ngữ` vào cuối `srs.md` (thuật ngữ dùng trong màn) + bổ sung thuật ngữ nghiệp vụ mới của màn vào `docs/00-glossary.md` — xem "Thuật ngữ" trong `conventions.md`.
4. Chạy **1 màn hình mỗi lần**. Nhiều màn: REQUIRED SUB-SKILL: Use dev-dispatching-parallel-agents.

## Kỹ thuật áp dụng
- **Use Case Narrative + Flow Modeling:** mỗi luồng mô tả đủ Tác nhân/Trigger/Tiền điều kiện/Luồng chính/Luồng thay thế-ngoại lệ/Hậu điều kiện; chọn loại sơ đồ Mermaid theo bản chất (Use case/Activity/Sequence/State) — bảng chọn trong `templates.md`.
- **User Story + Given-When-Then + INVEST:** tiêu chí chấp nhận viết GWT đo được; story đạt checklist INVEST.
- **Field-level Validation Spec:** mỗi input có bảng rule cụ thể (kiểu, bắt buộc, định dạng/regex, min/max, thông báo lỗi) — không để "validate hợp lệ" chung chung.
- **Business Rules tách bảng riêng** (`BRule-S..`), trace về yêu cầu — không trộn vào mô tả chức năng.
- **UI States completeness:** design-spec liệt kê đủ Empty/Loading/Error/Success.
- **Animation chuyển cảnh (BẮT BUỘC):** design-spec đặc tả chuyển màn (vào/ra) + chuyển section nội màn (in/out) mượt theo Motion token — điền mục 7 template, không để "nếu có". Quy ước ở "Animation chuyển cảnh" trong `conventions.md`.

## Tiêu chí chất lượng (BẮT BUỘC)
- **Mọi input field có rule cụ thể** (kiểu/bắt buộc/định dạng/min-max/thông báo lỗi); cấm "nhập hợp lệ" mơ hồ.
- Mỗi yêu cầu `R-S..` có **acceptance criteria đo được**; usecase & userstory **khớp các luồng trong srs**.
- Mỗi luồng trong srs có **1 sơ đồ Mermaid đúng loại**; design-spec đủ 4 UI state **và mục Animation chuyển cảnh** (chuyển màn vào/ra + ≥1 section in/out).

## Lưu ý
- srs: yêu cầu chức năng `R-S..` trace `F`/`FR`; phi chức năng `R-S..-N..` trace `NFR`/`BR`; mỗi yêu cầu có acceptance criteria đo được.
- srs còn 2 mục sơ đồ (Mermaid): **Sơ đồ luồng** — vẽ MỌI luồng của màn, mỗi luồng chọn loại phù hợp (Use case/Activity/Sequence/State); và **ERD** (mục riêng) — thực thể màn đụng tới.
- userstory: heading mỗi story theo format `US-S0x-NN: <Tên màn hình> - <Nội dung title>`; tiêu chí chấp nhận viết **Given-When-Then**, có kiểm INVEST và story point.
- design-spec: UI brief cho Designer — bắt buộc liệt kê UI States (Empty/Loading/Error/Success), CTA (Primary/Secondary), microcopy, edge case UX, **Animation chuyển cảnh** (chuyển màn vào/ra + section in/out); **không** vẽ ASCII, **không** quy định mã màu/font.
- usecase và userstory phải khớp các luồng trong srs.
- design-spec là **đầu vào của `ba-figma-design`** (bước tùy chọn): xong design-spec, có thể invoke `ba-figma-design <màn>` để preview Figma trước khi ra HTML.
- Tiếng Việt.
