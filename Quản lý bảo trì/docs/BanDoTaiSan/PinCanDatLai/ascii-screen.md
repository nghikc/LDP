# Wireframe — Danh sách pin cần đặt lại

```
                                            (Panel trượt vào từ phải, đè lên Workspace S01)
+--------------------------------------------------------------+
| Pin cần đặt lại vị trí                                  [ ✕ ] |
+--------------------------------------------------------------+
| Sau khi thay ảnh sơ đồ, 3 pin nằm ngoài vùng ảnh mới.        |
| Chọn từng pin để đặt lại vị trí trên sơ đồ.        Tổng: 3   |
+--------------------------------------------------------------+
| +----------------------------------------------------------+ |
| | A-014 · Máy nén khí                                      | |
| | Tòa A › Tầng 3 › Phòng 305                               | |
| | Sơ đồ: Phòng 305                       [ Đặt lại vị trí ]| |
| +----------------------------------------------------------+ |
| +----------------------------------------------------------+ |
| | A-031 · Tủ điện                                         | |
| | Tòa A › Tầng 3 › Phòng 306                               | |
| | Sơ đồ: Phòng 306                       [ Đặt lại vị trí ]| |
| +----------------------------------------------------------+ |
| +----------------------------------------------------------+ |
| | B-002 · Máy bơm                                         | |
| | Tòa B › Tầng 1 › Kho                                     | |
| | Sơ đồ: Kho B1                          [ Đặt lại vị trí ]| |
| +----------------------------------------------------------+ |
|                                                              |
+--------------------------------------------------------------+

[Trạng thái rỗng — không còn pin nào]
+--------------------------------------------------------------+
| Pin cần đặt lại vị trí                                  [ ✕ ] |
+--------------------------------------------------------------+
|                      ( minh họa ✓ )                          |
|            Không có pin nào cần đặt lại vị trí.              |
|        Mọi pin đều nằm đúng trong vùng sơ đồ.               |
|                       [ Đóng ]                               |
+--------------------------------------------------------------+

[Khi bấm "Đặt lại vị trí" — panel đóng, quay về S01 ở chế độ đặt lại]
+--------------------------------------------------------------+
| (Workspace S01) Sơ đồ Phòng 305 mở, pin A-014 nhấp nháy ở    |
| mép sơ đồ; con trỏ dạng "đặt pin".                           |
|  Banner: Đang đặt lại vị trí A-014 — click hoặc kéo pin vào  |
|          vùng sơ đồ.                       [ Hủy ] [ Lưu ]    |
+--------------------------------------------------------------+

Chú thích các thành phần:
- Panel "Pin cần đặt lại" (trượt vào từ phải): mở từ dải cảnh báo "N pin cần đặt lại" ở S01.
- Câu mô tả + Bộ đếm "Tổng: N": số pin đang chờ đặt lại; cập nhật ngay khi một pin được đặt lại xong.
- Thẻ pin (item danh sách): mã + tên tài sản, đường dẫn khu vực (breadcrumb), tên sơ đồ chứa pin, nút [Đặt lại vị trí].
- Nút [Đặt lại vị trí]: đóng panel, mở sơ đồ tương ứng ở S01, vào chế độ đặt lại tọa độ (click/kéo pin).
- Nút [✕] / [Đóng]: đóng panel, fade về Workspace S01.
- Trạng thái rỗng: hiển thị khi N = 0 (phổ biến, đáng mong đợi) — "Không có pin nào cần đặt lại vị trí".
- Chế độ đặt lại trên S01: banner hướng dẫn + [Hủy] / [Lưu]; lưu xong pin rời khỏi danh sách, bộ đếm giảm.
```
