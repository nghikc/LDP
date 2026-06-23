---
name: ba-toolkit
description: Use when bắt đầu xây phần mềm mới từ ý tưởng thô, hoặc khi cần biết trình tự các bước phân tích nghiệp vụ (BA) và skill nào chạy tiếp theo trong bộ BA toolkit.
---

# BA Toolkit — Pipeline xây phần mềm

## Tổng quan
Bộ skill biến ý tưởng thô thành phần mềm qua một pipeline phân tích nghiệp vụ. Mỗi bước sinh tài liệu tiếng Việt trong `docs/`. Phần dev dùng bộ skill `dev-*` (clone từ superpowers, tự chứa trong toolkit).

**Trước khi chạy bất kỳ bước nào:** đọc `conventions.md` (cùng thư mục) để nắm cấu trúc thư mục và quy tắc.

## Thứ tự chạy
0. `ba-brainstorm` — phỏng vấn sâu IT-BA từ ý tưởng/tính năng → `docs/00-brainstorm.md` (tùy chọn nhưng khuyến nghị, làm đầu vào cho bước 1)
1. `ba-requirements` — ý tưởng thô / brainstorm → `docs/01-requirements.md`
2. `ba-functions` — `01-requirements.md` → `docs/02-functions.md`
3. `ba-screens` — `02-functions.md` → `docs/03-overview.md` + khung folder màn hình + `docs/00-tracking.md`
4. `ba-screen-spec` — mỗi màn hình → 6 file phân tích (ascii, brainstorm, srs, usecase, userstory, design-spec)
5. `ba-test` — mỗi màn hình → `test.md`
6. `ba-figma-design` — *(tùy chọn)* dựng preview Figma cho màn qua MCP `figma-mcp-go`, sau design-spec và trước HTML; lưu link vào `design-spec.md`
7. `ba-html-design` — mỗi màn hình → `html-design.html`
8. `ba-build` — mỗi folder → `plan.md` (kế hoạch dev, dừng ở đây)
9. `dev-run` — *(người dùng trigger)* dev các màn chỉ định từ `plan.md` bằng bộ skill `dev-*`; cập nhật trạng thái test + cột `dev` trong tracking
10. `ba-track` — refresh ma trận hoặc sync tài liệu khi sửa một chức năng

> Thứ tự test↔html linh hoạt (đều chỉ phụ thuộc screen-spec); orchestrator chạy test → (figma) → html. Figma luôn nằm **sau design-spec, trước html**.

## Lệnh điều phối (orchestrator) — chạy cả chuỗi trong 1 trigger
- `ba-init` — khởi tạo dự án mới: chạy trọn pipeline (bước 1→8) kèm gate dò gap.
- `dev-run` — chạy khâu dev cho các màn đã có plan: TDD + review + verification bằng bộ skill `dev-*`, cập nhật `test.md` (Trạng thái/roll-up) + cột `dev`.
- `ba-add-screen` — thêm 1 màn hình vào dự án đã có.
- `ba-add-feature` — thêm 1 chức năng (có thể trải nhiều màn).
- `ba-change-request` — áp thay đổi cho chức năng/màn đã có, đồng bộ mọi tài liệu.
- `ba-reverse` — chiều ngược: sinh tài liệu BA **từ codebase có sẵn** (data-model/api/màn/chức năng rút từ code; requirements suy luận có đánh dấu 🔶).
- `ba-review` — bộ dò gap (độ phủ + truy vết); được orchestrator gọi ở mỗi breakpoint, hoặc chạy lẻ để rà soát. Sinh `docs/00-gaps.md`.
- `ba-portal` — xuất toàn bộ `docs/` thành cổng HTML đọc được (`docs/portal.html`, offline) để xem/chia sẻ.

## Bộ skill `dev-*` (framework dev — clone từ superpowers, tự chứa)
10 skill kỷ luật dev/QA mà `ba-build`/`dev-run` dùng: `dev-writing-plans`, `dev-executing-plans`, `dev-subagent-driven-development`, `dev-dispatching-parallel-agents`, `dev-test-driven-development`, `dev-systematic-debugging`, `dev-requesting-code-review`, `dev-verification-before-completion`, `dev-finishing-a-development-branch`, `dev-using-git-worktrees`. Nội dung tiếng Anh gốc (superpowers v5.1.0), tham chiếu nội bộ đã đổi sang `dev-*` — export được cùng toolkit, không phụ thuộc plugin.

## Tài liệu cấp hệ thống (tùy chọn — chạy khi cần)
- `ba-stakeholder` — phân tích bên liên quan + Quyền lực/Quan tâm + RACI → `docs/04-stakeholders.md`.
- `ba-data-model` — mô hình dữ liệu + ERD + từ điển dữ liệu → `docs/05-data-model.md`.
- `ba-api-spec` — đặc tả API (endpoint + request/response) → `docs/06-api-spec.md`.
- `ba-design-system` — token màu/typography/spacing + component + layout + responsive → `docs/07-design-system.md`; nguồn style chuẩn cho `ba-figma-design` và `ba-html-design`.

## Quy tắc
- Mỗi bước đọc tài liệu cấp trên làm ngữ cảnh để giữ nhất quán.
- Sau khi tạo/sửa tài liệu một màn hình, cập nhật dòng tương ứng trong `docs/00-tracking.md`.
- Tài liệu luôn viết bằng tiếng Việt.
- Nhiều màn hình: chạy bước 4–6 cho từng màn; cần nhanh thì dùng dev-dispatching-parallel-agents.
