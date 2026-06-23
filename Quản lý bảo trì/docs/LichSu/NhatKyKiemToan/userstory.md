# User story — Nhật ký kiểm toán

## US-S07-01: Nhật ký kiểm toán - Xem toàn bộ thao tác
Là người quản trị, tôi muốn xem một bảng liệt kê mọi thao tác gán/di dời/xóa đã diễn ra, để truy vết ai đã làm gì với tài sản và khu vực.

- Trace: R-S07-01 / F19
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi là Quản trị và mở màn Nhật ký kiểm toán, **When** màn tải xong, **Then** bảng hiển thị các bản ghi sắp xếp mới nhất trước, mỗi dòng có thời điểm, người thực hiện, hành động, đối tượng và vị trí cũ→mới.
  - GWT-2: **Given** một bản ghi là thao tác "Xóa" khu vực, **When** tôi đọc dòng đó, **Then** cột Vị trí cũ→mới hiển thị "—".
  - GWT-3: **Given** màn đang hiển thị bảng, **When** tôi tìm nút Sửa/Xóa dòng, **Then** không có nút nào — dữ liệu chỉ đọc.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S07-02: Nhật ký kiểm toán - Lọc theo người và hành động
Là người quản trị, tôi muốn lọc nhật ký theo người thực hiện và loại hành động, để khoanh nhanh các thao tác cần điều tra.

- Trace: R-S07-02, R-S07-03 / F19
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chọn người thực hiện "Nguyễn Văn A", **When** tôi áp dụng lọc, **Then** bảng chỉ còn các bản ghi do Nguyễn Văn A thực hiện.
  - GWT-2: **Given** tôi chọn hành động "Di dời", **When** tôi áp dụng lọc, **Then** bảng chỉ còn các bản ghi loại Di dời.
  - GWT-3: **Given** tôi đặt cả hai điều kiện, **When** áp dụng, **Then** bảng chỉ còn bản ghi thỏa cả hai (giao nhau).
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S07-03: Nhật ký kiểm toán - Lọc theo khoảng thời gian
Là người quản trị, tôi muốn giới hạn nhật ký theo khoảng ngày, để xem các thao tác xảy ra trong một giai đoạn cụ thể.

- Trace: R-S07-04 / F19
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi nhập Từ ngày 01/06 và Đến ngày 22/06, **When** tôi áp dụng lọc, **Then** bảng chỉ còn bản ghi có thời điểm trong khoảng đó.
  - GWT-2: **Given** tôi nhập Từ ngày lớn hơn Đến ngày, **When** tôi áp dụng lọc, **Then** hệ thống báo "Từ ngày phải nhỏ hơn hoặc bằng Đến ngày" và không áp dụng.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S07-04: Nhật ký kiểm toán - Lọc theo đối tượng
Là người quản trị, tôi muốn tìm nhật ký theo mã/tên một tài sản hoặc khu vực, để xem toàn bộ lịch sử thao tác trên đối tượng đó.

- Trace: R-S07-05 / F19
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi gõ "A-007" vào ô đối tượng, **When** tôi áp dụng lọc, **Then** bảng chỉ còn bản ghi có đối tượng khớp một phần với "A-007".
  - GWT-2: **Given** tôi nhập quá 100 ký tự, **When** tôi nhập, **Then** hệ thống báo "Nhập tối đa 100 ký tự".
  - GWT-3: **Given** không có bản ghi khớp, **When** tôi áp dụng lọc, **Then** hệ thống hiện "Không có bản ghi phù hợp".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S07-05: Nhật ký kiểm toán - Phân trang khi nhiều bản ghi
Là người quản trị, tôi muốn duyệt nhật ký theo từng trang, để không bị quá tải khi có hàng nghìn bản ghi.

- Trace: R-S07-07, R-S07-08 / F19
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** kết quả lọc có 1.284 bản ghi, **When** màn hiển thị, **Then** bảng chia trang (25 dòng/trang) và ghi rõ tổng số bản ghi.
  - GWT-2: **Given** tôi đang ở trang 1, **When** tôi chọn "Sau", **Then** bảng nạp trang kế và giữ nguyên điều kiện lọc.
  - GWT-3: **Given** tôi click tiêu đề cột Thời điểm, **When** đảo thứ tự, **Then** bảng sắp xếp theo thời điểm tăng/giảm tương ứng.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S07-06: Nhật ký kiểm toán - Chặn truy cập với Giám sát
Là chủ hệ thống, tôi muốn chỉ vai trò Quản trị xem được nhật ký kiểm toán, để dữ liệu truy vết không bị lộ cho người không có thẩm quyền.

- Trace: R-S07-N01 / F19
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đăng nhập vai trò Giám sát, **When** tôi cố mở màn Nhật ký kiểm toán, **Then** hệ thống từ chối, hiện "Bạn không có quyền xem nhật ký kiểm toán" và không trả về bản ghi nào.
  - GWT-2: **Given** tôi là Giám sát ở Bản đồ tài sản, **When** tôi nhìn điều hướng, **Then** lối vào màn Nhật ký kiểm toán bị ẩn.
  - GWT-3: **Given** tôi ở màn từ chối, **When** tôi chọn lối quay lại, **Then** tôi trở về Bản đồ tài sản.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
