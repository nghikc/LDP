# Wireframe — Bản đồ tài sản (Workspace)

```
+----------------------------------------------------------------------------------+
| ☰  Bản đồ tài sản         [ 🔍 Tra cứu mã/tên tài sản... ]    [Nhật ký] [Avatar ▾]|
+------------------+---------------------------------------------------------------+
| CÂY KHU VỰC      | Tòa A › Tầng 3 › Phòng 305  [+ Gán vị trí] [Lọc pin ▾]         |
| [+ Thêm khu vực] |                             [Di dời hàng loạt] [Xuất báo cáo]  |
| [🔍 Tìm khu vực…]| +-----------------------------------------------------------+ |
| [Bung tất cả]    | |                                       Chú thích vị trí:    | |
| [Thu gọn]        | |        (Ảnh sơ đồ mặt bằng — zoom/pan) [●xanh ●xám ●vàng]  | |
| ▾ Tòa A          | |                                                           | |
|   ▾ Tầng 3   ⋮   | |     (①A-001)        (①A-014)                              | |
|     • Phòng 305🗺| |              (①A-007)      (㉓ cụm 23)                     | |
|     • Phòng 306  | |                    (③ Khu máy nén)  ← marker 3 tài sản    | |
|   ▸ Tầng 4       | |                                                           | |
| ▸ Tòa B          | +-----------------------------------------------------------+ |
|                  | ⚠ 3 pin cần đặt lại vị trí  →                                  |
+------------------+---------------------------------------------------------------+
(🗺 = icon "đã có sơ đồ", tooltip "Đã có sơ đồ mặt bằng" · marker = chấm tròn + số + nhãn)

[Popup khi click một VỊ TRÍ]                [Ô gán khi click điểm trống — ĐA CHỌN]
+-----------------------------------+      +-------------------------------------+
| Khu máy nén  (3 tài sản tại đây)  |      | Gán vị trí tại điểm đã chọn         |
| [ Tên vị trí ........] [Lưu tên]  |      | Tên vị trí (tùy chọn)               |
| ─────────────────────────────────|      | [ vd Khu máy nén ................. ]|
| A-007 · Máy nén khí               |      | Chọn tài sản (chưa có vị trí)       |
|   [Xem lịch sử][Di dời][Gỡ vị trí]|      | [ 🔍 Tìm theo mã/tên tài sản... ]   |
| A-031 · Bơm dầu                   |      | 12 kết quả · Đã chọn 2              |
|   [Xem lịch sử][Di dời][Gỡ vị trí]|      | [✓] B-021 · Máy bơm                 |
| A-052 · Quạt hút                  |      | [✓] B-045 · Tủ điện                 |
|   [Xem lịch sử][Di dời][Gỡ vị trí]|      | [ ] B-077 · Máy hàn                 |
| [+ Gán thêm tài sản vào vị trí]   |      |   … (hiện 50 đầu — gõ để thu hẹp)   |
| [Đóng]                            |      |            [Hủy] [Gán vị trí (2)]    |
+-----------------------------------+      +-------------------------------------+
(Kéo marker (giữ + di chuyển >0.5%) → dời tọa độ MỌI tài sản tại vị trí; tên đi theo; KHÔNG ghi lịch sử)

[Chế độ đặt pin — sau khi bấm "+ Gán vị trí"]
+---------------------------------------------------------------+
| 📌 Click lên sơ đồ để đặt tài sản            [ Thoát ]         |
| (con trỏ đổi dạng "đặt pin"; click điểm bất kỳ → ô chọn tài sản)|
+---------------------------------------------------------------+

[Empty-state — sơ đồ ĐÃ có ảnh nhưng CHƯA có pin nào]
+-----------------------------------------------------------+
|                  ( minh họa 📍 )                          |
|        Chưa có tài sản nào trên sơ đồ.                    |
|  Bấm [+ Gán vị trí] rồi click lên sơ đồ để đặt             |
|  tài sản đầu tiên.                                         |
+-----------------------------------------------------------+

Chú thích các thành phần:
- Nút hamburger ☰ (header, chỉ màn hẹp ≤768px): mở **drawer** cây khu vực + nền tối (scrim); chọn một nút → drawer tự đóng.
- Ô tra cứu (header): gõ mã/tên → gợi ý → chọn → nhảy tới sơ đồ + làm nổi pin + breadcrumb; trên mobile chiếm full-width.
- Cây khu vực (trái):
  - **Ô [🔍 Tìm khu vực…]** (không dấu): gõ → chỉ hiện nhánh khớp + tổ tiên, tự bung; [✕ Xóa lọc] để trở lại.
  - **[Bung tất cả] / [Thu gọn]**: mở/đóng mọi nhánh (cây mặc định thu gọn).
  - **Icon 🗺 cạnh tên nút** = "đã có sơ đồ mặt bằng" (tooltip).
  - Click mở sơ đồ; ▾/▸ mở-đóng nhánh; kéo-thả đổi nhánh; nút [+ Thêm khu vực]; icon ⋮ = menu (Thêm con/Sửa/Xóa/Quản lý ảnh sơ đồ).
- Breadcrumb (trên khung): đường dẫn nút đang chọn.
- Thanh công cụ: [+ Gán vị trí] (điểm vào tạo vị trí — bật chế độ đặt pin), [Lọc pin], [Di dời hàng loạt] → S04, [Xuất báo cáo] → S08.
- Khung sơ đồ (giữa): ảnh + **marker** (chấm tròn + số + nhãn) cho cả 1 và nhiều tài sản; cụm ⨁ khi >500 điểm; **chú thích màu vị trí** (●xanh Bình thường / ●xám Đang khóa / ●vàng Cần đặt lại) ở góc khung. Tạo vị trí bằng 2 cách: (a) [+ Gán vị trí] → chế độ đặt pin → click lên sơ đồ; (b) click thẳng điểm trống → **ô gán đa chọn**; click một marker → popup danh sách tài sản tại vị trí đó.
- **Marker**: nhãn = tên vị trí (nếu đặt) / mã tài sản (nếu 1) / "N tài sản" (nếu nhiều); **giữ + kéo** marker dời tọa độ mọi tài sản tại vị trí (Pointer Events: chuột + cảm ứng); dịch >0.5% = kéo, ≤0.5% = click. Kéo-thả **không** ghi lịch sử (khác [Di dời]).
- **Ô gán (đa chọn)**: trường "Tên vị trí (tùy chọn)" ở đầu; ô tìm (mã/tên không dấu) lọc tài sản chưa có vị trí; danh sách **checkbox** giới hạn 50 dòng đầu (gõ để thu hẹp); dòng đếm "N kết quả · Đã chọn M"; nút [Gán vị trí (M)] disable khi M=0.
- **Popup vị trí**: tiêu đề = tên vị trí hoặc "N tài sản tại vị trí này"; ô [Tên vị trí] + [Lưu tên]; mỗi tài sản có [Xem lịch sử]→S06, [Di dời]→S04, [Gỡ vị trí] (xác nhận); nút [+ Gán thêm tài sản vào vị trí này] (ẩn khi hết tài sản chưa có vị trí).
- Chế độ đặt pin: dải hướng dẫn "Click lên sơ đồ để đặt tài sản" + [Thoát]; con trỏ đổi dạng đặt pin.
- Dải cảnh báo "N pin cần đặt lại" → S05.
- Trạng thái rỗng: cây trống → CTA tạo khu vực; nút chưa có sơ đồ → CTA tải ảnh (→ S03); **nút đã có sơ đồ nhưng chưa có pin → lớp gợi ý "Chưa có tài sản nào trên sơ đồ — bấm [+ Gán vị trí]…"**.
- Responsive (≤768px): hamburger ☰ + drawer cây + scrim; ô tra cứu full-width; modal/panel chiếm gần full màn.
```
