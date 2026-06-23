---
name: ba-reverse
description: Use when đã có codebase và cần sinh tài liệu BA ngược từ code (reverse-engineering) — data model, API, màn hình, chức năng rút từ code; requirements và đặc tả suy luận có đánh dấu cần xác nhận.
---

# ba-reverse — Sinh tài liệu BA từ codebase

## Mục tiêu
Từ một codebase có sẵn, dựng bộ tài liệu trong `docs/` theo `conventions.md`. Phần rút trực tiếp từ code = tin cậy cao; phần ý định nghiệp vụ = suy luận, gắn nhãn cần xác nhận.

## Quy trình
Đọc `conventions.md` của `ba-toolkit`, cùng `rules/stack-mapping.md` và `rules/inference-policy.md` (cùng thư mục).

1. **Recon:** phát hiện stack/framework (đọc package.json/config + cấu trúc thư mục). Xác định nơi chứa routes/pages, models/schema, API handlers, components — theo `stack-mapping.md`.
2. **Fan-out trích xuất (song song):** REQUIRED SUB-SKILL: Use dev-dispatching-parallel-agents — mỗi subagent quét 1 khía cạnh, trả về facts có cấu trúc:
   - Màn hình: routes/pages/views → danh sách màn (path, tên, mục đích).
   - Mô hình dữ liệu: models/migrations/schema → thực thể, thuộc tính, quan hệ.
   - API: route handlers → endpoint (method, path, request/response, status).
   - Chức năng: module/feature → danh sách chức năng.
3. **Tổng hợp thành tài liệu** (dùng template của các skill tương ứng):
   - **Tin cậy cao (không banner):** `05-data-model.md`, `06-api-spec.md`, `03-overview.md` + folder màn + `00-tracking.md`.
   - **Suy luận (gắn banner 🔶 theo `inference-policy.md`):** `02-functions.md` (MEDIUM), `01-requirements.md`, và per màn `srs.md`/`usecase.md`/`userstory.md`/`test.md`; `ascii-screen.md` vẽ từ cấu trúc UI thật.
   - **Bỏ qua** (để ô ⬜ trong tracking): `html-design.html` (code thật là thiết kế — ghi chú trỏ file nguồn), `brainstorm.md`, `design-spec.md`, `plan.md`.
4. **Kiểm tra:** invoke `ba-review all` → liệt kê gap; invoke `ba-track refresh`. Tùy chọn `ba-portal`.
5. **Báo người dùng:** tài liệu nào tin cậy cao, tài liệu nào 🔶 cần xác nhận; gợi ý dùng `ba-change-request` hoặc skill forward để tinh chỉnh.

## Lưu ý
- Mọi tài liệu suy luận PHẢI có banner 🔶 ở đầu (xem `inference-policy.md`).
- **Văn phong & Thuật ngữ:** tài liệu tổng hợp tuân "Văn phong tài liệu" (mở rộng viết tắt ở lần đầu) + thêm footer `## Thuật ngữ`; tạo `docs/00-glossary.md` (seed `ba-requirements/glossary-seed.md`) bổ sung thuật ngữ kỹ thuật/nghiệp vụ rút từ code — xem `conventions.md`.
- **Xác nhận giả định:** các **giả định khi map không chắc** (vd suy business need, đoán mục đích màn) đánh số `GĐ-..` và chạy vòng xác nhận "Xác nhận giả định" (`conventions.md`); batch thì đánh dấu `⚠️ chưa xác nhận`. Khối nội dung suy luận lớn vẫn giữ banner 🔶 + Open Questions như cũ.
- Một subagent một khía cạnh; repo lớn chia nhỏ theo thư mục.
- Tiếng Việt; tên kỹ thuật (entity/endpoint) giữ nguyên từ code.
