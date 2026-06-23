# Use case — Form khu vực (Tạo/Sửa nút)

## UC-S02-01: Tạo nút khu vực mới
- Tác nhân (actor): Quản trị
- Trigger (kích hoạt): Người dùng bấm "+ Thêm khu vực" hoặc chọn "Thêm con" trên một nút ở màn Bản đồ tài sản (S01)
- Tiền điều kiện: Đã đăng nhập với vai trò Quản trị
- Luồng chính (happy path):
  1. Hệ thống mở modal Form khu vực ở chế độ Tạo, tiêu đề "Thêm khu vực", các trường trống; nếu mở từ "Thêm con" → Nút cha đặt sẵn là nút đó.
  2. Người dùng nhập Tên khu vực (bắt buộc); tùy chọn nhập Mã, chọn Loại, chọn/đổi Nút cha.
  3. Người dùng bấm Lưu.
  4. Hệ thống kiểm tra Tên hợp lệ, Mã duy nhất (nếu nhập), Nút cha hợp lệ.
  5. Hệ thống tạo nút mới, ghi nhật ký kiểm toán, đóng modal (fade), cây S01 cập nhật và bật nhánh chứa nút mới; hiện toast "Đã thêm khu vực".
- Luồng thay thế / ngoại lệ:
  - Tên rỗng/chỉ khoảng trắng/quá 150 ký tự → lỗi inline, không lưu.
  - Mã trùng với nút khác → "Mã khu vực đã tồn tại", không lưu.
  - Lưu thất bại do mạng → snackbar "Lỗi kết nối, chưa lưu được", giữ nguyên dữ liệu đã nhập.
  - Người dùng bấm Hủy/×/nền tối → đóng modal (hỏi xác nhận nếu đã nhập dữ liệu), không tạo nút.
- Hậu điều kiện (postcondition): Một nút khu vực mới tồn tại dưới đúng Nút cha (hoặc ở gốc); có bản ghi nhật ký kiểm toán.
- Đảm bảo (guarantees): thành công → nút được tạo + ghi log; tối thiểu → không tạo nút nếu chưa lưu hợp lệ.
- Trace: R-S02-01, R-S02-03, R-S02-05, R-S02-06, R-S02-07

## UC-S02-02: Sửa nút khu vực
- Tác nhân: Quản trị
- Trigger: Người dùng chọn "Sửa" trên một nút ở S01
- Tiền điều kiện: Đã đăng nhập với vai trò Quản trị; nút đang tồn tại
- Luồng chính:
  1. Hệ thống mở modal ở chế độ Sửa, tiêu đề "Sửa khu vực", nạp sẵn Tên/Mã/Loại/Nút cha hiện tại (< 1s).
  2. Hệ thống xây danh sách Nút cha hợp lệ, loại trừ chính nút và toàn bộ nhánh con của nó.
  3. Người dùng sửa các trường cần đổi, bấm Lưu.
  4. Hệ thống kiểm tra hợp lệ và cập nhật nút, ghi nhật ký kiểm toán, đóng modal; nếu đổi Nút cha → nút chuyển sang nhánh mới; cây S01 cập nhật; hiện toast "Đã cập nhật khu vực".
- Luồng thay thế / ngoại lệ:
  - Vi phạm cây lặp (chọn nút cha là chính nó/nhánh con) → "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó", không lưu.
  - Tên rỗng/quá dài hoặc Mã trùng → lỗi inline tương ứng, không lưu.
  - Nút vừa bị người khác xóa → "Khu vực không còn tồn tại", đóng form.
  - Người dùng Hủy sau khi đã sửa → hỏi "Bỏ thay đổi chưa lưu?"; xác nhận → đóng không lưu.
- Hậu điều kiện: Nút khu vực được cập nhật; nếu đổi cha thì thuộc nhánh mới; có bản ghi nhật ký kiểm toán.
- Đảm bảo: thành công → cập nhật + log; tối thiểu → không đổi gì nếu chưa lưu hợp lệ.
- Trace: R-S02-02, R-S02-04, R-S02-05, R-S02-06, R-S02-07, R-S02-08

## UC-S02-03: Chọn Nút cha (đặt vị trí trong cây)
- Tác nhân: Quản trị
- Trigger: Người dùng mở dropdown/cây thu gọn ở trường Nút cha
- Tiền điều kiện: Form đang mở (chế độ Tạo hoặc Sửa)
- Luồng chính:
  1. Người dùng mở danh sách Nút cha.
  2. Hệ thống hiển thị "(Gốc — không có nút cha)" + cây các nút; ở chế độ Sửa loại trừ chính nút và nhánh con.
  3. Người dùng chọn một nút (hoặc để trống = gốc).
  4. Trường Nút cha cập nhật đường dẫn đã chọn.
- Luồng thay thế / ngoại lệ:
  - Cây chưa có nút nào → chỉ còn lựa chọn "(Gốc — không có nút cha)".
  - Người dùng gõ tìm trong dropdown → lọc nút theo tên (khớp một phần).
- Hậu điều kiện: Nút cha của form được đặt theo lựa chọn (hoặc để trống = gốc).
- Đảm bảo: thành công → Nút cha hợp lệ được chọn; tối thiểu → không cho chọn nút gây cây lặp.
- Trace: R-S02-07, R-S02-08

## UC-S02-04: Hủy / đóng form không lưu
- Tác nhân: Quản trị
- Trigger: Người dùng bấm Hủy, ×, hoặc nhấn nền tối (overlay)
- Tiền điều kiện: Form đang mở
- Luồng chính:
  1. Người dùng yêu cầu đóng form.
  2. Nếu chưa thay đổi dữ liệu → hệ thống đóng modal ngay (fade về S01).
  3. Nếu đã thay đổi → hệ thống hỏi "Bỏ thay đổi chưa lưu?"; xác nhận → đóng không lưu; hủy → ở lại form.
- Luồng thay thế / ngoại lệ:
  - Người dùng chọn ở lại → giữ nguyên dữ liệu đang nhập.
- Hậu điều kiện: Không có nút nào được tạo/cập nhật; quay về S01.
- Đảm bảo: thành công → đóng sạch không tác dụng phụ; tối thiểu → không mất dữ liệu nếu người dùng chọn ở lại.
- Trace: R-S02-10
