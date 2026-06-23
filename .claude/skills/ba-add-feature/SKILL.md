---
name: ba-add-feature
description: Use when cần thêm một chức năng mới (có thể trải nhiều màn hình) vào dự án đã có — cập nhật yêu cầu, chức năng, overview rồi đặc tả các màn liên quan trong một lệnh, có gate dò gap.
---

# ba-add-feature — Orchestrator thêm 1 chức năng

## Mục tiêu
Thêm một chức năng mới và lan toả tới các màn hình liên quan (mới hoặc đã có).

## Quy trình
Đọc `conventions.md`. Làm rõ với người dùng: chức năng làm gì, ảnh hưởng màn nào (mới/đã có).

1. Cập nhật `01-requirements.md` (nếu phạm vi mới; quy tắc nghiệp vụ mới → thêm vào catalog `BRule-..`) + thêm `F..` vào `02-functions.md` **và cập nhật ma trận CRUD** (thực thể × chức năng) trong đó.
2. **Gate:** invoke `ba-review functions` (xem "Quy ước gate" trong conventions). Còn 🔴/🟡 → dừng; chỉ 🟢/sạch → tiếp.
3. Cập nhật `03-overview.md`: thêm màn mới và/hoặc gắn `F..` mới vào màn đã có + **cập nhật ma trận CRUD-to-Screen và sơ đồ điều hướng** nếu thêm màn; tạo folder cho màn mới; cập nhật `00-tracking.md` (dòng mới ⬜; màn đã có → thêm mã `F` vào cột "Mã CN", đánh ⚠️ các tài liệu cần cập nhật).
4. **Gate:** invoke `ba-review screens`. Còn 🔴/🟡 → dừng; chỉ 🟢/sạch → tiếp.
5. Với mỗi màn **mới hoặc bị ảnh hưởng** (nhiều màn → REQUIRED SUB-SKILL: Use dev-dispatching-parallel-agents):
   a. Invoke `ba-screen-spec <màn>` (cập nhật srs/usecase/userstory cho chức năng mới).
   b. Invoke `ba-test <màn>`.
   c. **Gate:** invoke `ba-review <màn>`. Còn 🔴/🟡 → dừng ở màn đó; chỉ 🟢/sạch → tiếp.
   d. *(Tùy chọn)* invoke `ba-figma-design <màn>` → preview Figma trước HTML (bỏ qua nếu `figma-mcp-go` vắng).
   e. Invoke `ba-html-design <màn>` nếu giao diện đổi.
6. Invoke `ba-build` cho các màn đó.
7. Invoke `ba-track refresh`.
8. **Gate cuối:** invoke `ba-review all` → bắt gap truy vết xuyên suốt sau khi thêm chức năng.
9. *(Tùy chọn)* nếu dự án có `docs/portal.html`, invoke `ba-portal` để cổng đọc không bị cũ.
10. Báo tổng kết.

## Lưu ý
- Màn đã có bị ảnh hưởng: cập nhật, không tạo trùng.
