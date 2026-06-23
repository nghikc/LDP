# Wireframe — Xuất báo cáo / kiểm kê

```
                       (Modal slide-up từ S01 — nền workspace mờ phía sau)
+------------------------------------------------------------------+
| Xuất báo cáo / kiểm kê                                      [✕]  |
+------------------------------------------------------------------+
|                                                                  |
|  PHẠM VI XUẤT  (bắt buộc chọn 1)                                  |
|   ( ) Toàn bộ tài sản                                            |
|   (•) Theo khu vực đang chọn  ›  Tòa A › Tầng 3                  |
|         ☑ Gồm cả các khu vực con                                 |
|   ( ) Theo bộ lọc hiện tại trên sơ đồ                            |
|                                                                  |
|  CỘT XUẤT  (chọn ít nhất 1)                                       |
|   ☑ Mã tài sản     ☑ Tên tài sản     ☑ Đường dẫn khu vực         |
|   ☑ Vị trí          ☑ Lần di dời gần nhất                        |
|                                                                  |
|  ----------------------------------------------------------       |
|   ℹ Ước tính: 1.248 tài sản trong phạm vi đã chọn               |
|  ----------------------------------------------------------       |
|                                                                  |
|                                   [ Hủy ]   [ ⬇ Xuất Excel ]     |
+------------------------------------------------------------------+

[Trạng thái đang tạo file]              [Trạng thái phạm vi rỗng]
+--------------------------------+      +--------------------------------+
| ⏳ Đang tạo file...            |      | ⚠ Không có dữ liệu để xuất     |
|  [▓▓▓▓▓▓░░░░] 64%              |      |  Phạm vi đã chọn không có tài  |
|  Đang xử lý 32.000/50.000 dòng |      |  sản nào. Hãy đổi phạm vi.     |
|              [ Hủy ]           |      |          [ Đổi phạm vi ]       |
+--------------------------------+      +--------------------------------+

[Toast thành công]
+------------------------------------------+
| ✓ Đã xuất 1.248 tài sản · baocao.xlsx    |
+------------------------------------------+

Chú thích các thành phần:
- Tiêu đề + [✕]: đóng modal, fade về S01 (workspace).
- Nhóm PHẠM VI XUẤT (radio, bắt buộc 1): "Toàn bộ" / "Theo khu vực đang chọn" / "Theo bộ lọc hiện tại". Khi chọn "Theo khu vực" hiện breadcrumb nút đang chọn + checkbox "Gồm cả các khu vực con".
- Nhóm CỘT XUẤT (checkbox, ≥1): mã tài sản, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất (mặc định tick hết).
- Dải ước tính: đếm số tài sản trong phạm vi đã chọn, cập nhật khi đổi phạm vi.
- [Hủy]: đóng, không xuất. [⬇ Xuất Excel]: tạo file .xlsx và tải về.
- Trạng thái Loading: thanh tiến trình + số dòng đã xử lý (cho tập rất lớn tới 50.000 dòng) + nút Hủy.
- Trạng thái rỗng: phạm vi không có tài sản → "Không có dữ liệu để xuất" + CTA đổi phạm vi.
- Toast: "Đã xuất {n} tài sản" kèm tên file sau khi tải về.
```
