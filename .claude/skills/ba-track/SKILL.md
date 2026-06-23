---
name: ba-track
description: Use when cần dựng lại ma trận truy vết docs/00-tracking.md theo hiện trạng file, hoặc khi vừa sửa một chức năng/màn hình và cần rà soát, cập nhật mọi tài liệu liên quan màn đó.
---

# ba-track — Truy vết & đồng bộ tài liệu

## Hai chế độ

### Refresh
Quét `docs/` (các folder màn hình và file của chúng), dựng lại `docs/00-tracking.md` đúng hiện trạng: ô có file = ✅, thiếu = ⬜. Dùng `tracking-template.md` của `ba-screens` làm khuôn.
**Riêng cột `dev`:** không map ra file tài liệu (trạng thái code, do `dev-run` quản) — giữ nguyên giá trị hiện có khi refresh, dòng mới để ⬜.

### Sync-on-change (khi sửa 1 chức năng)
1. Người dùng chỉ định màn hình vừa đổi (vd `Login`).
2. Liệt kê toàn bộ 9 tài liệu của folder màn đó.
3. Rà soát nhất quán giữa các tài liệu: `srs` ↔ `usecase` ↔ `test` ↔ `design-spec` ↔ `html-design` ↔ `plan` (yêu cầu mới/đổi có phản ánh ở use case, test case, UI brief, HTML, plan không); nếu `design-spec` có mục "Bản Figma (preview)" thì kiểm cả Figma có lệch không. Riêng `test.md`: kiểm **bảng roll-up khớp trạng thái từng TC** (đếm Pass/Fail/Blocked/Skip/Chưa chạy đúng), và TC bị sửa nội dung phải có Trạng thái = `Chưa chạy`.
4. Đánh dấu `⚠️` các tài liệu bị lệch trong tracking, rồi cập nhật từng tài liệu cho khớp (gọi lại skill tương ứng nếu cần: ba-screen-spec/ba-figma-design/ba-html-design/ba-test/ba-build).
5. Khi đã đồng bộ, đổi `⚠️` → `✅` và cập nhật cột "Cập nhật cuối".

## Lưu ý
- Đọc `conventions.md` của `ba-toolkit` để biết cấu trúc và cột tracking.
- Tiếng Việt. Báo rõ tài liệu nào đã đổi.
