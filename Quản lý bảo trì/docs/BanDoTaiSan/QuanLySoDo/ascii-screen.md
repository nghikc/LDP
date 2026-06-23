# Wireframe — Quản lý ảnh sơ đồ mặt bằng

```
(Nền: workspace S01 mờ & lùi nhẹ — modal trượt lên từ đáy)

+----------------------------------------------------------------------+
| Quản lý ảnh sơ đồ — Tòa A › Tầng 3 › Phòng 305                  [✕]  |
+----------------------------------------------------------------------+
|                                                                      |
|  [ Trạng thái A — Nút CHƯA có sơ đồ ]                                 |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |                    ⬆  Kéo & thả ảnh vào đây                     |  |
|  |             hoặc  [ Chọn ảnh từ máy ]                           |  |
|  |                                                                |  |
|  |        PNG hoặc JPG · tối đa 10 MB · 1 ảnh mỗi khu vực          |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  [ Trạng thái B — Nút ĐÃ có sơ đồ ]                                   |
|  +----------------------------------------------------------------+  |
|  |  (Xem trước ảnh sơ đồ hiện tại — co vừa khung)                  |  |
|  |       so-do-tang-3.png · 2.4 MB · 1920×1080                     |  |
|  |       12 pin đang đặt trên sơ đồ này                            |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|                              [ Đóng ]  [ Thay ảnh ]  [ Xóa ảnh ]     |
+----------------------------------------------------------------------+

[Dialog xác nhận khi Thay ảnh mà nút còn pin]
+----------------------------------------------------+
| Thay ảnh sơ đồ                                     |
| Sơ đồ này đang có 12 pin. Hệ thống giữ nguyên vị   |
| trí tương đối (%) của pin trên ảnh mới. Pin nằm    |
| ngoài vùng ảnh mới sẽ được đánh dấu "cần đặt lại". |
|                          [ Hủy ]  [ Tiếp tục thay ]|
+----------------------------------------------------+

[Dialog xác nhận khi Xóa ảnh mà nút còn pin]
+----------------------------------------------------+
| Xóa ảnh sơ đồ                                       |
| Sơ đồ này đang có 12 pin. Xóa ảnh sẽ gỡ vị trí của |
| 12 tài sản (về "chưa có vị trí"). Hồ sơ tài sản    |
| được giữ nguyên. Tiếp tục?                          |
|                          [ Hủy ]  [ Xóa ảnh ]      |
+----------------------------------------------------+

[Thông báo sau khi thay ảnh khiến pin tràn ngoài]
+----------------------------------------------------+
| ✓ Đã thay ảnh sơ đồ. 3 pin nằm ngoài vùng ảnh mới  |
|   được đánh dấu "cần đặt lại vị trí".               |
|                          [ Đóng ]  [ Đặt lại ngay ]→ S05
+----------------------------------------------------+

Chú thích các thành phần:
- Tiêu đề modal: "Quản lý ảnh sơ đồ" + breadcrumb đường dẫn nút khu vực đang chọn ở S01.
- Nút [✕] / [Đóng]: đóng modal, fade về workspace S01, không lưu thay đổi đang dang dở.
- Vùng kéo-thả (Trạng thái A — chưa có sơ đồ): kéo file ảnh vào hoặc bấm [Chọn ảnh từ máy]; nhắc rõ định dạng PNG/JPG ≤ 10 MB, mỗi khu vực tối đa 1 sơ đồ.
- Khung xem trước (Trạng thái B — đã có sơ đồ): ảnh hiện tại + tên file, dung lượng, kích thước, số pin đang đặt.
- [Thay ảnh]: chọn ảnh mới thay ảnh cũ; nếu còn pin → dialog cảnh báo giữ tọa độ tương đối.
- [Xóa ảnh]: gỡ ảnh khỏi nút; nếu còn pin → dialog cảnh báo gỡ vị trí tài sản.
- Dialog cảnh báo: chỉ hiện khi nút còn pin; nút không pin thì thay/xóa trực tiếp.
- Thông báo pin tràn ngoài: hiện sau khi thay ảnh, dẫn lối sang S05 (Danh sách pin cần đặt lại).
- Chỉ vai trò Quản trị mở được màn này; Giám sát không thấy lối vào ở S01.
```
