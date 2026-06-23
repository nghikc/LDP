---
name: ba-change-request
description: Use when có yêu cầu thay đổi (change request) cho một chức năng/màn hình đã có — đồng bộ mọi tài liệu liên quan, cập nhật srs/test/html/plan và build lại phần đổi trong một lệnh, có gate kiểm tra ⚠️ đã sạch.
---

# ba-change-request — Orchestrator xử lý change request

## Mục tiêu
Áp một thay đổi vào chức năng/màn đã có, đảm bảo mọi tài liệu liên quan được đồng bộ và truy vết không gãy.

## Quy trình
Đọc `conventions.md`. Làm rõ với người dùng: đổi cái gì, ở màn/chức năng nào.

1. Sửa nguồn: cập nhật yêu cầu trong `01-requirements.md` / `02-functions.md` nếu CR đổi phạm vi.
   - **Nếu bước này đổi phạm vi yêu cầu/chức năng:** invoke `ba-review functions` → bắt gap truy vết chức năng↔màn trước khi đi tiếp.
2. Invoke `ba-track sync <màn>` → đánh ⚠️ các tài liệu lệch (srs, usecase, test, html, plan).
3. **Gate:** invoke `ba-review <màn>` (xem "Quy ước gate" trong conventions) → liệt kê chính xác gap/lệch theo mức 🔴/🟡/🟢.
4. Cập nhật từng tài liệu ⚠️:
   - đổi nghiệp vụ/yêu cầu → invoke `ba-screen-spec <màn>`.
   - đổi ca kiểm thử → invoke `ba-test <màn>`.
   - đổi giao diện → *(tùy chọn)* invoke `ba-figma-design <màn>` preview Figma, rồi invoke `ba-html-design <màn>`.
5. **Gate:** invoke `ba-review <màn>` lần nữa → còn 🔴/🟡 (gap/lệch) → quay lại bước 4; chỉ 🟢/sạch → tiếp (ghi nhận 🟢 để xử lý sau).
6. Invoke `ba-build` → cập nhật `plan.md` của màn.
7. Invoke `ba-track refresh`.
8. *(Tùy chọn)* nếu dự án có `docs/portal.html`, invoke `ba-portal` để cổng đọc phản ánh thay đổi.
9. Báo người dùng: thay đổi đã đồng bộ + plan để build lại phần đổi.

## Lưu ý
- Trọng tâm là truy vết: sau CR, mọi srs↔usecase↔test↔html↔plan phải khớp.
