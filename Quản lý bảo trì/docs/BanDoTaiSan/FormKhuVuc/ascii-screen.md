# Wireframe — Form khu vực (Tạo/Sửa nút)

```
            (Nền tối overlay phủ màn Bản đồ tài sản S01)
+----------------------------------------------------------------------+
|                                                                      |
|            +----------------------------------------------+          |
|            | Thêm khu vực                            [ × ] |          |
|            +----------------------------------------------+          |
|            |                                              |          |
|            | Tên khu vực *                                |          |
|            | [ Phòng 305_____________________________ ]    |          |
|            |  ⚠ Vui lòng nhập tên khu vực                 |          |
|            |                                              |          |
|            | Mã khu vực                                   |          |
|            | [ P305__________________________________ ]    |          |
|            |  (tùy chọn — duy nhất nếu nhập)              |          |
|            |                                              |          |
|            | Loại khu vực                                 |          |
|            | [ Phòng                               ▾ ]    |          |
|            |                                              |          |
|            | Nút cha                                      |          |
|            | [ Tòa A › Tầng 3                      ▾ ]    |          |
|            |  (để trống = khu vực gốc)                    |          |
|            |                                              |          |
|            +----------------------------------------------+          |
|            |                       [ Hủy ]   [ Lưu ]      |          |
|            +----------------------------------------------+          |
|                                                                      |
+----------------------------------------------------------------------+

[Dropdown chọn Nút cha — chế độ Sửa nút "Tầng 3"]
+--------------------------------------+
| 🔍 Tìm khu vực...                     |
| (Gốc — không có nút cha)             |
| ▾ Tòa A                              |
|     Tầng 3   ⛔ (chính nó - ẩn/khóa) |
|       Phòng 305  ⛔ (con - ẩn/khóa)  |
|       Phòng 306  ⛔ (con - ẩn/khóa)  |
|   Tầng 4                             |
| ▸ Tòa B                              |
+--------------------------------------+

Chú thích các thành phần:
- Tiêu đề modal: "Thêm khu vực" (chế độ Tạo) / "Sửa khu vực" (chế độ Sửa). [×] đóng modal.
- Tên khu vực *: bắt buộc, 1–150 ký tự; lỗi inline hiện ngay dưới ô khi rỗng/chỉ khoảng trắng.
- Mã khu vực: tùy chọn, ≤ 50 ký tự, duy nhất toàn cây nếu nhập; trùng → lỗi inline.
- Loại khu vực: tùy chọn, chọn từ danh mục (Site/Tòa/Tầng/Phòng/Khu); để trống được.
- Nút cha: tùy chọn, chọn vị trí trong cây; để trống = nút gốc. Chế độ Sửa loại trừ chính nút và nhánh con (chống cây lặp - BRule-06).
- Hủy / × / nhấn nền tối: đóng không lưu (hỏi xác nhận nếu đã sửa dữ liệu).
- Lưu: kiểm tra hợp lệ → tạo/cập nhật nút → đóng modal (fade) → cây S01 cập nhật.
- Modal slide-up từ S01; chỉ vai trò Quản trị mở được màn này.
```
