# Wireframe — Lịch sử di chuyển tài sản

```
+----------------------------------------------------------------------+
| ←  Lịch sử di chuyển                                            [✕]   |
|    A-007 · Máy nén khí                                                |
+----------------------------------------------------------------------+
| Từ ngày [ 01/01/2026 ▾ ]   Đến ngày [ 22/06/2026 ▾ ]   [Áp dụng]     |
|                                                          [Xóa lọc]    |
+----------------------------------------------------------------------+
|  ● 22/06/2026 14:30 · Nguyễn Văn A                                   |
|  │   Tòa A › Tầng 3 › Phòng 305  →  Tòa A › Tầng 4 › Phòng 410        |
|  │   Lý do: Chuyển sang dây chuyền mới                                |
|  │                                                                    |
|  ● 10/03/2026 09:05 · Trần Thị B                                     |
|  │   Tòa A › Tầng 2 › Kho        →  Tòa A › Tầng 3 › Phòng 305        |
|  │   (Không có lý do)                                                 |
|  │                                                                    |
|  ● 02/01/2026 08:00 · Trần Thị B                                     |
|  │   (Chưa có vị trí)            →  Tòa A › Tầng 2 › Kho              |
|      Lý do: Gán vị trí lần đầu khi nhập kho                           |
|                                                                       |
|              — Đã hiển thị hết lịch sử —                              |
+----------------------------------------------------------------------+

[Trạng thái rỗng — tài sản chưa từng di chuyển]
+----------------------------------------------------------------------+
| ←  Lịch sử di chuyển · A-045 · Tủ điện                        [✕]    |
+----------------------------------------------------------------------+
|                          (icon)                                      |
|            Tài sản chưa có lần di chuyển nào.                         |
|       Mọi thay đổi vị trí sẽ được ghi lại và hiện ở đây.             |
+----------------------------------------------------------------------+

Chú thích các thành phần:
- Panel slide-left: mở từ S01 (popup pin → "Xem lịch sử") hoặc từ kết quả tra cứu; nút ← / ✕ slide-right đóng panel, trả về S01.
- Header panel: tiêu đề "Lịch sử di chuyển" + mã & tên tài sản đang xem (chỉ đọc, không sửa được trong panel).
- Bộ lọc khoảng thời gian: Từ ngày / Đến ngày (date picker) + [Áp dụng] + [Xóa lọc]; ràng buộc Từ ngày ≤ Đến ngày.
- Timeline (chỉ đọc): mỗi bản ghi = 1 mốc theo thứ tự thời gian giảm dần (mới nhất trên cùng): thời điểm · người thực hiện; dòng đường dẫn "vị trí cũ → vị trí mới" (breadcrumb khu vực đầy đủ); lý do nếu có, ngược lại "(Không có lý do)".
- Bản ghi đầu tiên của tài sản: vị trí cũ hiển thị "(Chưa có vị trí)" (lần gán đầu).
- Chân danh sách: "— Đã hiển thị hết lịch sử —"; nếu lịch sử rất dài → cuộn vô hạn / nút "Xem thêm".
- Trạng thái rỗng: "Tài sản chưa có lần di chuyển nào."
- Không có thao tác sửa/xóa bản ghi — lịch sử bất biến (append-only).
```
