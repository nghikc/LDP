# Wireframe — Nhật ký kiểm toán

```
+----------------------------------------------------------------------------------+
| ← Bản đồ tài sản   |   Nhật ký kiểm toán                          [Avatar ▾]      |
+----------------------------------------------------------------------------------+
| BỘ LỌC                                                                            |
| Người thực hiện [ Tất cả ▾ ]   Hành động [ Tất cả ▾ ]                             |
| Từ ngày [ 01/06/2026 ]  Đến ngày [ 22/06/2026 ]   Đối tượng [ 🔍 mã/tên... ]      |
|                                              [ Xóa lọc ]      [ Áp dụng lọc ]     |
+----------------------------------------------------------------------------------+
| Thời điểm ⌄        | Người thực hiện | Hành động | Đối tượng        | Vị trí cũ → mới        |
+-------------------+-----------------+-----------+------------------+------------------------+
| 22/06 14:32:10    | Nguyễn Văn A    | Di dời    | TS A-007 Máy nén | Tầng 3·P305 → Tầng 4·P410|
| 22/06 11:08:55    | Trần Thị B      | Gán       | TS B-021 Máy bơm | (chưa có) → Tầng 1·Kho   |
| 21/06 16:45:02    | Nguyễn Văn A    | Xóa       | Khu vực "P309"   | —                       |
| 21/06 09:12:40    | Trần Thị B      | Di dời    | TS A-014 Tủ điện | Tầng 2·P201 → Tầng 2·P205|
| ...                                                                              |
+-------------------+-----------------+-----------+------------------+------------------------+
| Hiển thị 1–25 / 1.284 bản ghi              [ ‹ Trước ]  Trang 1/52  [ Sau › ]     |
+----------------------------------------------------------------------------------+

[Trạng thái rỗng — khi lọc không có kết quả]
+----------------------------------------------------------------------------------+
|                       (icon tài liệu)                                            |
|                  Không có bản ghi phù hợp                                         |
|        Thử nới rộng khoảng thời gian hoặc bỏ bớt điều kiện lọc.                   |
+----------------------------------------------------------------------------------+

[Trạng thái từ chối — vai trò Giám sát]
+----------------------------------------------------------------------------------+
|                       (icon khóa)                                                |
|         Bạn không có quyền xem nhật ký kiểm toán.                                 |
|         Khu vực này chỉ dành cho vai trò Quản trị.    [ Về Bản đồ tài sản ]       |
+----------------------------------------------------------------------------------+

Chú thích các thành phần:
- Nút quay lại "← Bản đồ tài sản" (góc trái header): đóng panel, slide-right về S01.
- Tiêu đề "Nhật ký kiểm toán": tên màn, chỉ đọc.
- Panel bộ lọc (trên cùng):
  - Người thực hiện: dropdown chọn một người dùng (mặc định "Tất cả").
  - Hành động: dropdown chọn loại — Gán / Di dời / Xóa (mặc định "Tất cả").
  - Từ ngày / Đến ngày: bộ chọn ngày, ràng buộc Từ ≤ Đến.
  - Đối tượng: ô nhập mã/tên tài sản hoặc tên nút khu vực (khớp một phần, ≤ 100 ký tự).
  - [Áp dụng lọc]: nạp lại bảng theo điều kiện; [Xóa lọc]: đưa bộ lọc về mặc định.
- Bảng bản ghi (chỉ đọc, append-only): mỗi dòng là một thao tác gán/di dời/xóa đã xảy ra.
  - Cột Thời điểm: có nút sắp xếp tăng/giảm (mặc định mới nhất trước).
  - Cột Vị trí cũ → mới: chỉ điền với thao tác gán/di dời; thao tác xóa hiển thị "—".
- Thanh phân trang (dưới bảng): tổng số bản ghi, điều hướng trang khi kết quả nhiều.
- Bảng chỉ đọc: không có nút Sửa/Xóa dòng — dữ liệu kiểm toán bất biến.
```
