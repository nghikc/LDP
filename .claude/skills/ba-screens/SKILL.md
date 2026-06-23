---
name: ba-screens
description: Use when đã có docs/02-functions.md và cần suy ra danh sách màn hình, sơ đồ điều hướng và khung thư mục tài liệu; bước 3 của BA toolkit, sinh docs/03-overview.md và docs/00-tracking.md.
---

# ba-screens — Chức năng → Màn hình + khung tài liệu

## Mục tiêu
Từ `docs/02-functions.md`: liệt kê màn hình, viết `docs/03-overview.md`, tạo khung folder mỗi màn hình, khởi tạo `docs/00-tracking.md`.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit` và `docs/02-functions.md`.
2. **Suy ra màn hình có hệ thống** bằng các kỹ thuật bên dưới; gom theo Nhóm. Gán mã `S01..` và map mỗi màn ↔ các chức năng (`F..`).
3. Viết `docs/03-overview.md` theo `overview-template.md` (bảng màn hình + **ma trận CRUD-to-Screen** + sơ đồ điều hướng + map chức năng↔màn hình).
4. Tạo khung thư mục rỗng: với mỗi màn hình, `mkdir -p docs/<Nhóm>/<MànHình>/` (đặt tên theo `conventions.md`).
5. Khởi tạo `docs/00-tracking.md` theo `tracking-template.md`: mỗi màn hình 1 dòng, mọi cột tài liệu = `⬜`.
6. Xác nhận với người dùng.

## Kỹ thuật áp dụng
- **User Journey Mapping:** đi theo hành trình của từng vai trò người dùng (từ điểm vào → mục tiêu) để phát hiện màn còn thiếu trong luồng, không chỉ liệt kê màn theo chức năng rời.
- **CRUD-to-Screen Coverage:** với mỗi thực thể/đối tượng quản lý chính, soát đủ bộ màn theo thao tác — List (danh sách/tìm kiếm), Detail (xem), Create (thêm), Edit (sửa); xác nhận xoá thường là dialog trong màn List/Detail.
- **Navigation / Sitemap:** vẽ sơ đồ điều hướng (Mermaid) thể hiện mọi đường đi giữa các màn; mỗi màn phải có ≥1 đường vào. **Ghi kèm kiểu chuyển cảnh** trên mỗi cạnh (vd fade/slide/modal) — chi tiết in/out để `ba-screen-spec` đặc tả ở design-spec (xem "Animation chuyển cảnh" trong `conventions.md`).

## Tiêu chí chất lượng (BẮT BUỘC)
- **Phủ chức năng:** mỗi `F..` map về ≥1 màn; không chức năng nào không có nơi thực thi.
- **CRUD đủ bộ màn:** thực thể quản lý chính có đủ List/Detail/Create/Edit (hoặc ghi rõ lý do gộp/bỏ, vd "Create & Edit dùng chung 1 form").
- **Không màn mồ côi:** mọi màn trong danh sách phải xuất hiện trên sơ đồ điều hướng và có đường vào; ngược lại sơ đồ không tham chiếu màn chưa khai báo.

## Lưu ý
- Không tạo nội dung các file trong folder — chỉ tạo khung. Việc đó do `ba-screen-spec`/`ba-html-design`/`ba-test` làm.
- Tiếng Việt. Tên folder PascalCase không dấu.
- **Văn phong & Thuật ngữ:** mở rộng từ viết tắt ở lần đầu dùng; thêm footer `## Thuật ngữ` cuối `03-overview.md` + bổ sung thuật ngữ mới vào `docs/00-glossary.md` — xem `conventions.md`.
