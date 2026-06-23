# Brainstorm — Danh sách pin cần đặt lại

## Mục đích màn hình
Là **panel vệ tinh** mở từ Bản đồ tài sản (Workspace, S01). Sau khi Quản trị **thay ảnh sơ đồ** của một khu vực (S03), các pin giữ nguyên **tọa độ tương đối (%)** theo quy tắc BRule-04; nếu ảnh mới có tỷ lệ/bố cục khác, một số pin có thể **nằm ngoài vùng ảnh** và bị hệ thống đánh dấu **"cần đặt lại vị trí"** (giả định GĐ-R2 đã chốt). Màn này **liệt kê toàn bộ pin cần đặt lại** đó và cho người dùng **đặt lại tọa độ** cho từng pin để pin trở về hiển thị đúng trên sơ đồ.

Mục tiêu: không để pin nào "biến mất/khuất" sau khi đổi ảnh; gom mọi pin lỗi vị trí về một chỗ để xử lý dứt điểm. Cả **Quản trị** và **Giám sát** dùng được vì đây là thao tác **gán/đặt vị trí**, không phải quản cấu trúc (cây + ảnh).

## Thành phần & hành vi
- **Bộ đếm tổng "N pin cần đặt lại"** → tổng số pin đang chờ; giảm dần khi từng pin được đặt lại xong.
- **Danh sách pin cần đặt lại** → mỗi item: mã + tên tài sản, **đường dẫn khu vực** (breadcrumb), **tên sơ đồ** chứa pin, nút **[Đặt lại vị trí]**.
- **Nút [Đặt lại vị trí]** trên một item → đóng panel, mở **sơ đồ tương ứng ở S01**, vào **chế độ đặt lại**: click một điểm trong vùng ảnh hoặc **kéo pin** vào vùng ảnh để chọn tọa độ mới (%); xác nhận → lưu.
- **Sau khi đặt lại** → pin **rời khỏi danh sách**, bộ đếm giảm, ghi nhật ký kiểm toán; pin hiển thị bình thường trên sơ đồ.
- **Nút Đóng [✕]** → fade panel, quay về Workspace.

## Trạng thái & edge case
- **Rỗng (phổ biến):** không có pin nào cần đặt lại (N = 0) → thông báo "Không có pin nào cần đặt lại vị trí". Đây là trạng thái **đáng mong đợi**, không phải lỗi.
- **Loading:** đang tải danh sách pin cần đặt lại → skeleton các item.
- **Lỗi:** tải danh sách thất bại → thông báo + nút "Thử lại".
- **Đặt ra ngoài vùng ảnh:** khi đặt lại, nếu điểm chọn vẫn nằm ngoài vùng ảnh (x/y ngoài 0–100% hoặc ngoài khung) → báo "Vị trí nằm ngoài sơ đồ", **không lưu**, pin vẫn ở trạng thái cần đặt lại.
- **Pin bị khóa:** tài sản đang được người khác gán/di dời → nút Đặt lại tạm vô hiệu, báo "Tài sản đang được người khác chỉnh sửa".
- **Pin biến mất khỏi danh sách giữa chừng:** người khác vừa đặt lại/gỡ pin đó → item tự cập nhật rời danh sách, bộ đếm đồng bộ.
- **Sơ đồ của pin bị xóa ảnh:** nếu ảnh sơ đồ bị xóa → pin về "chưa có vị trí", rời khỏi danh sách cần đặt lại.

## Câu hỏi mở
- *(Không còn — GĐ-R2 "đánh dấu pin cần đặt lại + liệt kê danh sách chờ" đã xác nhận ở requirements; BRule-04 giữ tọa độ tương đối khi thay ảnh đã chốt.)*
