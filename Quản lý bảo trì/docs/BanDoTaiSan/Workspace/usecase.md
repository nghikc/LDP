# Use case — Bản đồ tài sản (Workspace)

## UC-S01-01: Tra cứu nhanh vị trí tài sản
- Tác nhân (actor): Quản trị, Giám sát
- Trigger (kích hoạt): Người dùng gõ mã/tên vào ô tra cứu
- Tiền điều kiện: Đã đăng nhập; tài sản tồn tại trong hệ thống
- Luồng chính (happy path):
  1. Người dùng gõ ≥1 ký tự mã/tên tài sản.
  2. Hệ thống trả gợi ý khớp một phần, không phân biệt dấu (< 1s).
  3. Người dùng chọn một tài sản trong gợi ý.
  4. Hệ thống tự chọn nút khu vực chứa tài sản, mở sơ đồ, làm nổi (highlight) pin và hiện breadcrumb đường dẫn.
- Luồng thay thế / ngoại lệ:
  - Không có kết quả → hiện "Không tìm thấy tài sản".
  - Tài sản chưa có vị trí → hiện đường dẫn "Chưa gán vị trí", không mở sơ đồ.
- Hậu điều kiện (postcondition): Sơ đồ mở đúng khu vực, pin được làm nổi.
- Đảm bảo (guarantees): thành công → người dùng thấy vị trí; tối thiểu → luôn có phản hồi (kết quả hoặc thông báo trống).
- Trace: R-S01-03

## UC-S01-02: Gán vị trí cho tài sản
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng click vào điểm trống trên sơ đồ
- Tiền điều kiện: Nút khu vực đang chọn đã có ảnh sơ đồ; tồn tại tài sản chưa có vị trí
- Luồng chính:
  1. Người dùng click điểm trống trên sơ đồ.
  2. Hệ thống tạo pin tạm, mở ô tìm chỉ liệt kê tài sản chưa có vị trí.
  3. Người dùng chọn một tài sản và xác nhận.
  4. Hệ thống tạo pin tại tọa độ click, ghi nhật ký kiểm toán, hiện toast "Đã gán vị trí cho tài sản".
- Luồng thay thế / ngoại lệ:
  - Người dùng hủy → xóa pin tạm.
  - Tài sản vừa bị người khác gán/khóa → báo "Tài sản đang được người khác chỉnh sửa".
  - Nút chưa có sơ đồ → ẩn thao tác gán, gợi ý tải ảnh (→ S03).
- Hậu điều kiện: Tài sản chuyển trạng thái "đã có vị trí", pin hiển thị trên sơ đồ.
- Đảm bảo: thành công → pin lưu + nhật ký; tối thiểu → không tạo pin nếu chưa xác nhận.
- Trace: R-S01-06

## UC-S01-03: Gỡ vị trí tài sản
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng mở popup pin và chọn Gỡ vị trí
- Tiền điều kiện: Tài sản đang có vị trí; không bị người khác khóa
- Luồng chính:
  1. Người dùng click pin → popup chi tiết.
  2. Chọn Gỡ vị trí → dialog xác nhận.
  3. Xác nhận → hệ thống xóa pin, đưa tài sản về "chưa có vị trí", ghi nhật ký kiểm toán.
- Luồng thay thế / ngoại lệ:
  - Tài sản bị khóa → báo "Tài sản đang được người khác chỉnh sửa".
  - Người dùng hủy → giữ nguyên.
- Hậu điều kiện: Pin biến mất; tài sản "chưa có vị trí".
- Đảm bảo: thành công → gỡ + nhật ký; tối thiểu → không đổi nếu chưa xác nhận.
- Trace: R-S01-07

## UC-S01-04: Di chuyển nút khu vực trong cây
- Tác nhân: Quản trị
- Trigger: Người dùng kéo một nút sang nhánh khác
- Tiền điều kiện: Là vai trò Quản trị
- Luồng chính:
  1. Người dùng kéo nút và thả vào một nút cha mới.
  2. Hệ thống kiểm tra hợp lệ và cập nhật quan hệ cha-con.
  3. Cây render lại theo cấu trúc mới.
- Luồng thay thế / ngoại lệ:
  - Thả vào chính nó hoặc nhánh con của nó → chặn, báo "Không thể di chuyển khu vực vào chính nhánh con của nó".
  - Vai trò Giám sát → không có thao tác kéo-thả.
- Hậu điều kiện: Nút thuộc nhánh mới.
- Đảm bảo: thành công → cấu trúc cập nhật; tối thiểu → cây không hỏng khi thao tác bị chặn.
- Trace: R-S01-08

## UC-S01-05: Xóa nút khu vực
- Tác nhân: Quản trị
- Trigger: Người dùng chọn Xóa trên một nút
- Tiền điều kiện: Là vai trò Quản trị
- Luồng chính:
  1. Người dùng chọn Xóa.
  2. Hệ thống đếm số tài sản bên trong + số khu con, hiện dialog cảnh báo.
  3. Người dùng xác nhận.
  4. Hệ thống xóa nhánh, gỡ vị trí tài sản về "chưa có vị trí" (không xóa hồ sơ), ghi nhật ký kiểm toán.
- Luồng thay thế / ngoại lệ:
  - Người dùng hủy → giữ nguyên.
- Hậu điều kiện: Nhánh bị xóa; tài sản bên trong "chưa có vị trí".
- Đảm bảo: thành công → xóa + nhật ký; tối thiểu → không xóa nếu chưa xác nhận.
- Trace: R-S01-09

## UC-S01-06: Duyệt cây & xem sơ đồ mặt bằng
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng click một nút khu vực
- Tiền điều kiện: Đã đăng nhập; có ít nhất một khu vực
- Luồng chính:
  1. Người dùng mở/đóng nhánh và click một nút.
  2. Hệ thống mở sơ đồ của nút + hiển thị pin (gom cụm nếu > 500), hiện breadcrumb.
- Luồng thay thế / ngoại lệ:
  - Nút chưa có ảnh → hiện "Chưa có sơ đồ" + CTA tải ảnh (Quản trị).
  - Cây trống → CTA tạo khu vực đầu tiên.
- Hậu điều kiện: Sơ đồ + pin của nút hiển thị.
- Đảm bảo: thành công → sơ đồ hiển thị < 2s; tối thiểu → trạng thái rỗng/lỗi rõ ràng.
- Trace: R-S01-01, R-S01-02, R-S01-04, R-S01-05
