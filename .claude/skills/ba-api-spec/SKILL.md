---
name: ba-api-spec
description: Use when cần đặc tả API cho hệ thống — danh sách endpoint, request/response, mã trạng thái; tài liệu cấp tổng, dựa trên chức năng, yêu cầu màn hình và mô hình dữ liệu.
---

# ba-api-spec — Đặc tả API hệ thống

## Mục tiêu
Sinh `docs/06-api-spec.md`: bảng tổng endpoint + chi tiết request/response từng endpoint.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit`, `docs/02-functions.md`, các `srs.md`, và `docs/05-data-model.md` nếu có.
2. **Suy ra endpoint có hệ thống** bằng các kỹ thuật bên dưới (không đặt endpoint tuỳ hứng).
3. Lập **Ma trận CRUD-to-Endpoint** (thực thể × thao tác) để soát độ phủ.
4. Mỗi endpoint ghi: method, path, mô tả, tham số/đường dẫn, request body, response, mã trạng thái, trace `F..`.
5. Định nghĩa **Error/Response envelope chuẩn** dùng chung cho mọi endpoint.
6. Viết `docs/06-api-spec.md` theo `template.md`.

## Kỹ thuật áp dụng
- **Resource-Oriented Design (REST):** mô hình hoá theo *tài nguyên* (danh từ số nhiều, vd `/tasks`, `/tasks/{id}`), thao tác qua HTTP method (GET/POST/PATCH/DELETE) thay vì động từ trong path (tránh `/getTasks`, `/createTask`).
- **CRUD-to-Endpoint Matrix:** mỗi thực thể chính ánh xạ Create→`POST /res`, Read/List→`GET /res` & `GET /res/{id}`, Update→`PATCH/PUT /res/{id}`, Delete→`DELETE /res/{id}`. Hành động ngoài CRUD (vd đăng nhập, duyệt) đặt endpoint riêng theo use case.
- **Status Code Semantics:** dùng đúng ngữ nghĩa — 200/201/204, 400 (sai định dạng), 401 (chưa xác thực), 403 (không quyền), 404, 409 (xung đột), 422 (validation), 429 (throttle), 5xx (lỗi máy chủ).
- **Error Envelope chuẩn:** mọi lỗi trả về cùng một schema (vd `{ "error": { "code", "message", "fields" } }`) để client xử lý nhất quán.

## Tiêu chí chất lượng (BẮT BUỘC)
- **Trace đầy đủ:** mỗi endpoint trace về ≥1 chức năng `F..`; ngược lại mỗi thực thể CRUD trong data model phải có endpoint tương ứng (hoặc ghi rõ lý do không expose).
- **Path theo tài nguyên:** không động từ trong path; không trùng lặp ngữ nghĩa method (vd cấm `POST /tasks/delete`).
- **Nhất quán response/lỗi:** mọi endpoint dùng chung error envelope; mỗi endpoint liệt kê đủ mã trạng thái thành công + lỗi có thể xảy ra.
- Tên trường giữ tiếng Anh; mô tả tiếng Việt. Tài liệu cấp tổng, tùy chọn.

## Lưu ý
- **Văn phong & Thuật ngữ:** mở rộng từ viết tắt ở lần đầu dùng; thêm footer `## Thuật ngữ` cuối `06-api-spec.md` + bổ sung thuật ngữ mới vào `docs/00-glossary.md` — xem `conventions.md`.
