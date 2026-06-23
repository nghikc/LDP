# Wireframe — Bản đồ tài sản (Workspace)

```
+----------------------------------------------------------------------------------+
| Bản đồ tài sản            [ 🔍 Tra cứu mã/tên tài sản... ]            [Avatar ▾]  |
+------------------+---------------------------------------------------------------+
| CÂY KHU VỰC      | Tòa A › Tầng 3 › Phòng 305        [Lọc pin ▾] [Di dời hàng loạt]|
| [+ Thêm khu vực] |                                                  [Xuất báo cáo] |
|                  | +-----------------------------------------------------------+ |
| ▾ Tòa A          | |                                                           | |
|   ▾ Tầng 3   ⋮   | |        (Ảnh sơ đồ mặt bằng — zoom/pan)                    | |
|     • Phòng 305  | |                                                           | |
|     • Phòng 306  | |     📍A-001        📍A-014                                 | |
|   ▸ Tầng 4       | |              📍A-007        ⨁(cụm 23)                      | |
| ▸ Tòa B          | |                       📍A-009                              | |
|                  | |                                                           | |
|                  | +-----------------------------------------------------------+ |
|                  | ⚠ 3 pin cần đặt lại vị trí  →                                  |
+------------------+---------------------------------------------------------------+

[Popup khi click pin]                    [Ô chọn tài sản khi click điểm trống]
+-------------------------------+        +-------------------------------------+
| A-007 · Máy nén khí           |        | Gán vị trí tại điểm đã chọn         |
| Trạng thái: Đang dùng         |        | [ 🔍 Tìm tài sản chưa có vị trí... ]|
| Tòa A › Tầng 3 › Phòng 305    |        |  ○ B-021 · Máy bơm                  |
| [Xem lịch sử] [Di dời] [Gỡ]   |        |  ○ B-045 · Tủ điện                  |
+-------------------------------+        |            [Hủy] [Gán vị trí]       |
                                         +-------------------------------------+

Chú thích các thành phần:
- Ô tra cứu (header): gõ mã/tên → gợi ý → chọn → nhảy tới sơ đồ + làm nổi pin + breadcrumb.
- Cây khu vực (trái): click mở sơ đồ; ▾/▸ mở-đóng nhánh; kéo-thả đổi nhánh; nút [+ Thêm khu vực]; icon ⋮ = menu (Thêm con/Sửa/Xóa/Quản lý ảnh sơ đồ).
- Breadcrumb (trên khung): đường dẫn nút đang chọn.
- Thanh công cụ: [Lọc pin], [Di dời hàng loạt] → S04, [Xuất báo cáo] → S08.
- Khung sơ đồ (giữa): ảnh + pin 📍; cụm ⨁ khi >500 điểm; click điểm trống → ô chọn tài sản (gán); click pin → popup chi tiết.
- Popup pin: thông tin tóm tắt + [Xem lịch sử]→S06, [Di dời]→S04, [Gỡ vị trí] (dialog xác nhận).
- Dải cảnh báo "N pin cần đặt lại" → S05.
- Trạng thái rỗng: cây trống → CTA tạo khu vực; nút chưa có sơ đồ → CTA tải ảnh (→ S03).
```
