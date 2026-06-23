---
name: ba-add-screen
description: Use when đang phát triển và cần thêm một màn hình mới vào hệ thống đã có tài liệu BA — cập nhật overview/tracking/folder rồi đặc tả, thiết kế và kiểm thử màn đó trong một lệnh, có gate dò gap.
---

# ba-add-screen — Orchestrator thêm 1 màn hình

## Mục tiêu
Thêm một màn hình mới vào dự án đang có, chạy đủ chuỗi cho riêng màn đó (không dựng lại toàn bộ).

## Quy trình
Đọc `conventions.md`. Cần biết: tên màn + nhóm + (các) chức năng `F..` liên quan (hỏi người dùng nếu chưa rõ).

1. Nếu màn sinh chức năng mới chưa có trong `02-functions.md` → thêm `F..` (cập nhật cả `01-requirements.md` nếu là phạm vi mới).
2. Cập nhật `03-overview.md`: thêm dòng màn (mã `S..`) + map `F..`↔màn + **cập nhật ma trận CRUD-to-Screen và sơ đồ điều hướng** (màn mới phải có ≥1 đường vào, không để mồ côi); tạo folder theo conventions (nhóm 1 màn → `docs/<Màn>/`, nhóm nhiều màn → `docs/<Nhóm>/<Màn>/`); thêm 1 dòng vào `00-tracking.md` (mọi ô ⬜).
3. **Gate:** invoke `ba-review screens` (xem "Quy ước gate" trong conventions). Còn 🔴/🟡 → dừng; chỉ 🟢/sạch → tiếp.
4. Invoke `ba-screen-spec <màn>`.
5. Invoke `ba-test <màn>`.
6. **Gate:** invoke `ba-review <màn>`. Còn 🔴/🟡 → dừng; chỉ 🟢/sạch → tiếp.
7. *(Tùy chọn)* invoke `ba-figma-design <màn>` → preview Figma trước HTML (bỏ qua nếu `figma-mcp-go` vắng).
8. Invoke `ba-html-design <màn>`.
9. Invoke `ba-build` (chỉ sinh `plan.md` cho màn chưa có plan).
10. Invoke `ba-track refresh`.
11. **Gate cuối:** invoke `ba-review all` → bắt gap truy vết xuyên suốt sau khi thêm màn.
12. *(Tùy chọn)* nếu dự án có `docs/portal.html`, invoke `ba-portal` để cổng đọc không bị cũ.
13. Báo người dùng: màn đã thêm xong + plan để build.

## Lưu ý
- Chỉ đụng tài liệu liên quan màn mới.
