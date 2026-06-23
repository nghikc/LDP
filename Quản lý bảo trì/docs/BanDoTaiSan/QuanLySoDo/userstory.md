# User story — Quản lý ảnh sơ đồ mặt bằng

## US-S03-01: Quản lý ảnh sơ đồ - Tải lên ảnh cho khu vực
Là người quản trị, tôi muốn tải lên ảnh sơ đồ mặt bằng cho một khu vực, để có nền đặt pin định vị tài sản.

- Trace: R-S03-01, R-S03-03 / F06
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi mở "Quản lý ảnh sơ đồ" cho một nút chưa có sơ đồ, **When** modal mở, **Then** tôi thấy vùng kéo-thả kèm hướng dẫn "PNG hoặc JPG, tối đa 10 MB".
  - GWT-2: **Given** tôi kéo-thả một ảnh PNG 2 MB hợp lệ, **When** tải xong, **Then** ảnh được gắn cho nút, toast "Đã tải lên sơ đồ" hiện ra và modal fade về S01 nơi tôi có thể đặt pin.
  - GWT-3: **Given** tôi chọn một file PDF hoặc ảnh 15 MB, **When** tôi thả vào vùng tải, **Then** hệ thống báo "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB." và không tải lên.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S03-02: Quản lý ảnh sơ đồ - Thay ảnh giữ vị trí pin
Là người quản trị, tôi muốn thay ảnh sơ đồ mà vẫn giữ vị trí tương đối của các pin, để cập nhật bản vẽ mới mà không phải đặt lại toàn bộ pin.

- Trace: R-S03-04, R-S03-05 / F07
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** nút có 12 pin và tôi bấm "Thay ảnh", **When** tôi chọn ảnh mới hợp lệ, **Then** hệ thống hiện cảnh báo "giữ nguyên vị trí tương đối của pin, pin nằm ngoài sẽ cần đặt lại" trước khi thay.
  - GWT-2: **Given** tôi xác nhận thay, **When** thay xong, **Then** pin trong vùng ảnh mới giữ đúng tọa độ tương đối (%) như trước.
  - GWT-3: **Given** 3 pin nằm ngoài vùng ảnh mới, **When** thay xong, **Then** hệ thống đánh dấu 3 pin "cần đặt lại vị trí" và hiện thông báo "3 pin cần đặt lại" kèm nút "Đặt lại ngay" dẫn sang S05.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S03-03: Quản lý ảnh sơ đồ - Xóa ảnh an toàn
Là người quản trị, tôi muốn được cảnh báo số tài sản bị ảnh hưởng trước khi xóa ảnh sơ đồ, để không vô tình gỡ vị trí hàng loạt tài sản.

- Trace: R-S03-06 / F08
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** nút có 12 pin và tôi bấm "Xóa ảnh", **When** dialog hiện, **Then** dialog ghi rõ "gỡ vị trí của 12 tài sản (về 'chưa có vị trí'), hồ sơ tài sản được giữ nguyên".
  - GWT-2: **Given** tôi xác nhận xóa, **When** hoàn tất, **Then** ảnh bị gỡ, 12 tài sản về "chưa có vị trí" (hồ sơ giữ nguyên) và một bản ghi nhật ký kiểm toán được tạo.
  - GWT-3: **Given** nút không còn pin nào, **When** tôi bấm "Xóa ảnh", **Then** hệ thống xóa trực tiếp không cần dialog cảnh báo.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S03-04: Quản lý ảnh sơ đồ - Đóng modal không lưu dang dở
Là người quản trị, tôi muốn đóng modal quản lý ảnh và quay lại workspace mà không lưu thao tác dang dở, để thoát an toàn khi đổi ý.

- Trace: R-S03-08 / F06
- Story point: 1
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang chọn ảnh nhưng chưa tải xong, **When** tôi bấm ✕/Đóng, **Then** modal fade về S01 và nút giữ nguyên trạng thái ảnh trước đó.
  - GWT-2: **Given** tôi chỉ là vai trò Giám sát, **When** tôi mở menu nút ở S01, **Then** tôi không thấy lối vào "Quản lý ảnh sơ đồ".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
