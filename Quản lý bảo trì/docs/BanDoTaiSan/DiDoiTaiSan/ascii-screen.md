# Wireframe — Di dời tài sản (đơn & hàng loạt)

```
Form di dời mở dạng modal trượt lên (slide-up) từ Bản đồ tài sản (S01).

+------------------------------------------------------------------+
| Di dời tài sản                                            [ ✕ ]   |
+------------------------------------------------------------------+
| BƯỚC 1 · Tài sản cần di dời                    (3 tài sản đã chọn)|
| +--------------------------------------------------------------+ |
| | ◉ Chọn tài sản lẻ        ○ Chọn cả vị trí cũ (lấy hết)        | |
| |                                                              | |
| | [ 🔍 Tìm mã/tên tài sản đã có vị trí... ]                     | |
| |  ☑ A-007 · Máy nén khí        Tòa A › Tầng 3 › Phòng 305      | |
| |  ☑ A-014 · Máy hàn            Tòa A › Tầng 3 › Phòng 305      | |
| |  ☑ A-009 · Tủ điện            Tòa A › Tầng 3 › Phòng 306      | |
| |  □ A-021 · Máy bơm  🔒 đang được người khác chỉnh sửa         | |
| +--------------------------------------------------------------+ |
|                                                                  |
| BƯỚC 2 · Vị trí đích (bắt buộc)                                   |
| +--------------------------------------------------------------+ |
| | [ 🔍 Chọn khu vực đích trên cây... ]                          | |
| | ▾ Tòa B                                                      | |
| |   ▾ Tầng 1                                                   | |
| |     ◉ Kho B-01     ← đã chọn: Tòa B › Tầng 1 › Kho B-01       | |
| |     ○ Kho B-02                                               | |
| +--------------------------------------------------------------+ |
|                                                                  |
| Lý do di dời (tùy chọn)                              0/500       |
| [ ............................................................ ] |
|                                                                  |
| Người thực hiện: Nguyễn B (tự ghi) · Thời điểm: tự ghi khi lưu   |
+------------------------------------------------------------------+
|                                       [ Hủy ]   [ Di dời (3) ]    |
+------------------------------------------------------------------+

[Lối vào 1 — Di dời 1 tài sản]        [Lối vào 2 — Di dời hàng loạt]
Popup pin (S01) → nút [Di dời]        Thanh công cụ (S01) → [Di dời hàng loạt]
→ mở modal, Bước 1 đã chọn sẵ          → mở modal, Bước 1 trống, người dùng
   đúng 1 tài sản (ẩn cách chọn).         tự chọn tài sản lẻ hoặc cả vị trí cũ.

[Trạng thái đang xử lý lô]            [Một số tài sản bị khóa]
+-------------------------------+     +-------------------------------------+
| Đang di dời 3 tài sản...      |     | 1 tài sản đang bị khóa, không thể   |
| [▓▓▓▓▓▓░░░░] 2/3              |     | di dời. Bỏ qua và tiếp tục 2 tài    |
| (không đóng cho tới khi xong) |     | sản còn lại?   [Hủy] [Tiếp tục]     |
+-------------------------------+     +-------------------------------------+

Chú thích các thành phần:
- Bước 1 — Chọn tài sản nguồn: hai cách (a) "Chọn tài sản lẻ" → tick nhiều tài sản
  đã có vị trí qua ô tìm; (b) "Chọn cả vị trí cũ (lấy hết)" → chọn một nút khu vực
  nguồn để lấy HẾT tài sản trong đó. Tài sản đang khóa hiện icon 🔒, không tick được.
- Bộ đếm "(N tài sản đã chọn)": cập nhật theo lựa chọn; nút Di dời ghi kèm số (N).
- Bước 2 — Vị trí đích: cây khu vực rút gọn / ô tìm; chọn đúng MỘT nút đích (bắt buộc).
  Mọi tài sản trong lô về CÙNG đích này (BRule-07).
- Lý do di dời: ô nhập tùy chọn, tối đa 500 ký tự, có bộ đếm ký tự.
- Người thực hiện + thời điểm: hệ thống tự ghi, chỉ hiển thị để người dùng biết.
- Nút [Di dời (N)]: chỉ bật khi đã chọn ≥1 tài sản hợp lệ VÀ đã chọn đích.
- Lối vào đơn (từ popup pin): Bước 1 khóa sẵn đúng 1 tài sản, ẩn bộ chọn cách lấy.
- Thanh tiến trình lô: hiện khi đang ghi; nếu gián đoạn/mất mạng → rollback toàn bộ.
- Modal đóng (Hủy / thành công) → fade về S01; sơ đồ cập nhật pin ở vị trí mới.
```
