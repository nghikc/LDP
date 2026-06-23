# Brainstorm — <Tên ý tưởng / tính năng>

> Đầu ra của phỏng vấn IT-BA. Là đầu vào cho `ba-requirements`.

## 1. Tổng quan
- Làm gì: <...>
- Giải quyết vấn đề gì: <...>
- Vì sao bây giờ: <...>

## 2. Người dùng & quyền truy cập
- Vai trò sử dụng: <...>
- Điều kiện gating / điểm vào: <...>
- Quy mô dự kiến: <...>

## 3. Luồng chính (happy path)
| Bước | Người dùng làm gì | Hệ thống làm gì | Người dùng thấy gì |
|------|-------------------|-----------------|--------------------|
| 1 | <...> | <...> | <...> |

## 4. Deep-dive *(chỉ khi có complexity trigger)*
<ASCII flow diagram / scenario matrix / bảng state transitions / ma trận giao dịch gián đoạn — tuỳ trigger bật.>

## 5. Validation & wording
- Trường bắt buộc: <...>
- Giới hạn/định mức (số chính xác): <vd: 5 lần/phút>
- Wording lỗi/thành công (chính xác): <vd: "Email đã tồn tại">

## 6. Ngữ cảnh hệ thống
- Loại thông tin cần lưu: <email, trạng thái, ngày...>
- Dịch vụ ngoài (tên + mục đích): <Google — đăng nhập; Stripe — thanh toán>
- Kênh thông báo: <email / push / in-app>
- Xử lý nền / real-time: <nhu cầu nghiệp vụ>

## 7. Edge case & rủi ro
- Mất mạng / đóng tab giữa chừng: <...>
- Dịch vụ ngoài chết: <...>
- Người dùng đồng thời: <...>
- Rủi ro nghiệp vụ: <...>

## Open Questions
- [ ] OQ-01: <điều chưa chốt>

## Giả định
> Mỗi giả định phải được rà & xác nhận (xem "Xác nhận giả định" trong `conventions.md`). Trạng thái: Đề xuất / Đã xác nhận / Đã sửa / Đã bỏ / ⚠️ chưa xác nhận (batch).

| Mã | Giả định | Vì sao cần (chỗ thiếu) | Ảnh hưởng nếu sai | Trạng thái |
|----|----------|------------------------|-------------------|-----------|
| GĐ-01 | <giả định đã đưa ra khi thiếu thông tin> | <...> | <...> | Đề xuất |
