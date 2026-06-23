# User story — Form khu vực (Tạo/Sửa nút)

## US-S02-01: Form khu vực - Thêm khu vực mới
Là người quản trị, tôi muốn thêm một khu vực mới vào cây và đặt nó dưới một nút cha, để cấu trúc khu vực khớp với cơ sở thực tế.

- Trace: R-S02-01, R-S02-03 / F01
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi bấm "Thêm con" trên nút "Tầng 3", **When** form mở, **Then** tiêu đề là "Thêm khu vực" và Nút cha được đặt sẵn là "Tòa A › Tầng 3".
  - GWT-2: **Given** tôi nhập Tên "Phòng 307" và bấm Lưu, **When** lưu thành công, **Then** nút "Phòng 307" xuất hiện dưới "Tầng 3" trong cây và modal đóng kèm toast "Đã thêm khu vực".
  - GWT-3: **Given** tôi để trống Nút cha, **When** tôi lưu, **Then** khu vực mới được tạo ở cấp gốc của cây.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S02-02: Form khu vực - Sửa thông tin khu vực
Là người quản trị, tôi muốn sửa tên/mã/loại của một khu vực, để cập nhật khi tổ chức đổi cách đặt tên hoặc phân loại.

- Trace: R-S02-02, R-S02-04 / F02
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chọn "Sửa" trên nút "Phòng 305", **When** form mở, **Then** Tên/Mã/Loại/Nút cha hiển thị đúng giá trị hiện tại trong dưới 1 giây.
  - GWT-2: **Given** tôi đổi Tên thành "Phòng 305A" và bấm Lưu, **When** lưu thành công, **Then** tên nút trong cây cập nhật ngay và toast "Đã cập nhật khu vực" hiện ra.
  - GWT-3: **Given** tôi đổi Nút cha sang "Tầng 4", **When** tôi lưu, **Then** nút chuyển sang nhánh "Tầng 4" trong cây.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S02-03: Form khu vực - Bắt buộc nhập tên
Là người quản trị, tôi muốn được chặn lưu khi bỏ trống tên khu vực, để không tạo ra nút khu vực vô danh khó nhận biết.

- Trace: R-S02-05 / F01, F02
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** ô Tên đang trống, **When** tôi bấm Lưu, **Then** hệ thống hiện lỗi inline "Vui lòng nhập tên khu vực" và không tạo/sửa nút.
  - GWT-2: **Given** tôi chỉ nhập khoảng trắng, **When** tôi bấm Lưu, **Then** hệ thống vẫn coi là rỗng và chặn lưu.
  - GWT-3: **Given** tôi nhập tên dài hơn 150 ký tự, **When** tôi bấm Lưu, **Then** hệ thống báo "Tên khu vực tối đa 150 ký tự" và chặn lưu.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S02-04: Form khu vực - Chặn cây lặp khi đổi nút cha
Là người quản trị, tôi muốn được ngăn đặt một khu vực vào chính nhánh con của nó, để cây khu vực không bị vòng lặp hỏng cấu trúc.

- Trace: R-S02-08 / F02
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang sửa nút "Tầng 3", **When** tôi mở danh sách Nút cha, **Then** chính "Tầng 3" và mọi nút con của nó ("Phòng 305", "Phòng 306") không xuất hiện để chọn.
  - GWT-2: **Given** tôi cố đặt nút cha là một nhánh con của chính nó, **When** hệ thống kiểm tra khi lưu, **Then** hệ thống báo "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó" và chặn lưu.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S02-05: Form khu vực - Mã khu vực duy nhất
Là người quản trị, tôi muốn được cảnh báo khi mã khu vực trùng, để mỗi khu vực có một mã định danh không lẫn nhau.

- Trace: R-S02-06 / F01, F02
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi nhập Mã "P305" đã tồn tại ở nút khác, **When** tôi bấm Lưu, **Then** hệ thống hiện "Mã khu vực đã tồn tại" và không lưu.
  - GWT-2: **Given** tôi để trống Mã, **When** tôi bấm Lưu, **Then** hệ thống cho lưu (mã không bắt buộc).
  - GWT-3: **Given** tôi đang sửa và giữ nguyên mã cũ của chính nút, **When** tôi lưu, **Then** hệ thống không coi đó là trùng.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S02-06: Form khu vực - Hủy không mất dữ liệu nhầm
Là người quản trị, tôi muốn được hỏi xác nhận khi đóng form lúc đã nhập dữ liệu, để không lỡ tay mất phần đã nhập.

- Trace: R-S02-10 / F01, F02
- Story point: 1
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chưa nhập gì, **When** tôi bấm Hủy hoặc nền tối, **Then** form đóng ngay không hỏi.
  - GWT-2: **Given** tôi đã nhập/đổi dữ liệu, **When** tôi bấm Hủy, **Then** hệ thống hỏi "Bỏ thay đổi chưa lưu?"; chọn ở lại → giữ nguyên dữ liệu đang nhập.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
