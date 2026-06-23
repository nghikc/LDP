# Use case — Danh sách pin cần đặt lại

## UC-S05-01: Xem danh sách pin cần đặt lại
- Tác nhân (actor): Quản trị, Giám sát
- Trigger (kích hoạt): Người dùng bấm dải cảnh báo "N pin cần đặt lại" ở Workspace (S01)
- Tiền điều kiện: Đã đăng nhập; có ít nhất một pin bị đánh dấu "cần đặt lại vị trí" (sau khi thay ảnh sơ đồ)
- Luồng chính (happy path):
  1. Người dùng bấm dải "N pin cần đặt lại" ở S01.
  2. Hệ thống mở panel S05 (trượt vào từ phải) và tải danh sách pin cần đặt lại.
  3. Hệ thống hiển thị mỗi pin một item: mã + tên tài sản, đường dẫn khu vực, tên sơ đồ; kèm bộ đếm "Tổng: N".
- Luồng thay thế / ngoại lệ:
  - Không còn pin cần đặt lại (N = 0) → hiện "Không có pin nào cần đặt lại vị trí".
  - Tải danh sách thất bại → hiện thông báo lỗi + nút "Thử lại".
- Hậu điều kiện (postcondition): Danh sách pin cần đặt lại hiển thị đúng cùng bộ đếm tổng.
- Đảm bảo (guarantees): thành công → người dùng thấy mọi pin cần xử lý; tối thiểu → luôn có phản hồi (danh sách, trạng thái rỗng hoặc lỗi).
- Trace: R-S05-01, R-S05-02, R-S05-07

## UC-S05-02: Đặt lại vị trí một pin
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng bấm [Đặt lại vị trí] trên một item trong danh sách
- Tiền điều kiện: Pin đang ở trạng thái "cần đặt lại"; sơ đồ chứa pin còn ảnh; pin không bị người khác khóa
- Luồng chính:
  1. Người dùng bấm [Đặt lại vị trí] trên một item.
  2. Hệ thống đóng panel, mở sơ đồ tương ứng ở S01, làm nổi pin và vào chế độ đặt lại (con trỏ đặt pin).
  3. Người dùng click một điểm trong vùng ảnh hoặc kéo pin vào vùng ảnh.
  4. Hệ thống kiểm tra tọa độ nằm trong 0–100% và trong khung ảnh.
  5. Người dùng bấm Lưu.
  6. Hệ thống lưu tọa độ tương đối mới, bỏ cờ "cần đặt lại", ghi nhật ký kiểm toán, hiện toast "Đã đặt lại vị trí pin".
- Luồng thay thế / ngoại lệ:
  - Tọa độ đặt ra ngoài vùng ảnh → báo "Vị trí nằm ngoài sơ đồ", không lưu, pin giữ trạng thái cần đặt lại.
  - Người dùng bấm Hủy → thoát chế độ đặt lại, pin giữ nguyên trạng thái cần đặt lại.
  - Pin bị người khác khóa → nút Đặt lại vô hiệu, báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."
  - Ảnh sơ đồ bị xóa giữa chừng → pin về "chưa có vị trí", rời danh sách, báo cho người dùng.
- Hậu điều kiện: Pin có tọa độ mới hợp lệ, hiển thị bình thường trên sơ đồ.
- Đảm bảo: thành công → tọa độ mới lưu + nhật ký kiểm toán; tối thiểu → không lưu nếu tọa độ ngoài vùng hoặc chưa xác nhận.
- Trace: R-S05-03, R-S05-04, R-S05-06, R-S05-N03

## UC-S05-03: Pin rời danh sách sau khi đặt lại
- Tác nhân: Hệ thống (kích hoạt bởi hành động đặt lại của người dùng)
- Trigger: Một pin được đặt lại vị trí thành công
- Tiền điều kiện: Pin vừa được lưu tọa độ hợp lệ
- Luồng chính:
  1. Hệ thống bỏ cờ "cần đặt lại" của pin.
  2. Hệ thống gỡ item pin khỏi danh sách S05.
  3. Hệ thống giảm bộ đếm tổng đi 1.
  4. Nếu bộ đếm về 0 → panel chuyển sang trạng thái rỗng "Không có pin nào cần đặt lại vị trí".
- Luồng thay thế / ngoại lệ:
  - Người khác đặt lại/gỡ cùng pin trước → item tự rời danh sách, bộ đếm đồng bộ, không báo lỗi.
- Hậu điều kiện: Danh sách và bộ đếm phản ánh đúng số pin còn cần đặt lại.
- Đảm bảo: thành công → danh sách + bộ đếm đồng bộ; tối thiểu → không hiển thị pin đã xử lý.
- Trace: R-S05-05, R-S05-02

## UC-S05-04: Đóng panel quay về Workspace
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng bấm [✕] / [Đóng]
- Tiền điều kiện: Panel S05 đang mở
- Luồng chính:
  1. Người dùng bấm [✕] (hoặc [Đóng] ở trạng thái rỗng).
  2. Hệ thống đóng panel (fade/slide-out về phải), trả màn về Workspace S01.
- Luồng thay thế / ngoại lệ:
  - Bấm bên ngoài panel (overlay) → đóng panel tương tự.
- Hậu điều kiện: Workspace S01 hiển thị, dải "N pin cần đặt lại" phản ánh số còn lại.
- Đảm bảo: thành công → về S01 mượt; tối thiểu → không mất trạng thái workspace.
- Trace: R-S05-01
