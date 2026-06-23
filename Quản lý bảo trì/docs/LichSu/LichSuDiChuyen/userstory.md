# User story — Lịch sử di chuyển tài sản

## US-S06-01: Lịch sử di chuyển - Xem chuỗi di chuyển của tài sản
Là giám sát/quản lý tài sản, tôi muốn xem toàn bộ chuỗi di chuyển của một tài sản (từ đâu tới đâu, ai làm, khi nào, vì sao), để truy vết và đối soát vị trí khi bàn giao hay kiểm kê.

- Trace: R-S06-01, R-S06-02 / F17
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi mở popup một pin và chọn "Xem lịch sử", **When** panel mở, **Then** hệ thống hiển thị các bản ghi của tài sản theo thời điểm giảm dần (mới nhất trên cùng) trong < 2 giây.
  - GWT-2: **Given** một bản ghi di chuyển, **When** nó hiển thị, **Then** tôi thấy thời điểm, người thực hiện, đường dẫn khu vực đầy đủ của vị trí cũ → vị trí mới, và lý do nếu có.
  - GWT-3: **Given** đây là lần gán vị trí đầu tiên của tài sản, **When** bản ghi hiển thị, **Then** vị trí cũ hiện "(Chưa có vị trí)".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S06-02: Lịch sử di chuyển - Trạng thái tài sản chưa di chuyển
Là người dùng, tôi muốn nhận thông báo rõ ràng khi tài sản chưa từng di chuyển, để biết đó là tài sản mới chứ không phải lỗi hệ thống.

- Trace: R-S06-06 / F17
- Story point: 1
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** một tài sản chưa có bản ghi di chuyển nào, **When** tôi mở lịch sử, **Then** panel hiện "Tài sản chưa có lần di chuyển nào." thay vì danh sách trống.
  - GWT-2: **Given** việc tải lịch sử thất bại, **When** lỗi xảy ra, **Then** panel hiện "Không tải được lịch sử" kèm nút "Thử lại".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S06-03: Lịch sử di chuyển - Lọc theo khoảng thời gian
Là giám sát, tôi muốn lọc lịch sử theo khoảng ngày, để tập trung vào các lần di chuyển trong một giai đoạn cụ thể (vd kỳ kiểm kê).

- Trace: R-S06-04, R-S06-05 / F17
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tài sản có nhiều bản ghi, **When** tôi nhập Từ ngày và Đến ngày hợp lệ rồi Áp dụng, **Then** timeline chỉ hiện các bản ghi có thời điểm trong khoảng (bao gồm hai mốc).
  - GWT-2: **Given** tôi nhập Từ ngày sau Đến ngày, **When** tôi Áp dụng, **Then** hệ thống báo lỗi "Từ ngày không được sau Đến ngày" và không tải.
  - GWT-3: **Given** khoảng tôi chọn không có bản ghi, **When** áp dụng, **Then** hệ thống hiện "Không có lần di chuyển nào trong khoảng đã chọn." và gợi ý Xóa lọc.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S06-04: Lịch sử di chuyển - Bất biến, chỉ đọc
Là quản trị, tôi muốn lịch sử di chuyển không thể bị sửa hay xóa, để dữ liệu truy vết luôn đáng tin khi đối soát.

- Trace: R-S06-08, R-S06-N02 / F17
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi (Quản trị hoặc Giám sát) đang xem một bản ghi lịch sử, **When** panel hiển thị, **Then** không có nút Sửa hay Xóa cho bất kỳ bản ghi nào.
  - GWT-2: **Given** một thao tác di dời vừa hoàn tất, **When** tôi mở lại lịch sử, **Then** một bản ghi mới được thêm vào đầu chuỗi và các bản ghi cũ giữ nguyên không đổi.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S06-05: Lịch sử di chuyển - Tải thêm khi lịch sử dài
Là giám sát của một tài sản di chuyển nhiều, tôi muốn lịch sử tải theo lô khi cuộn, để panel mở nhanh và không giật dù có hàng trăm bản ghi.

- Trace: R-S06-07, R-S06-N01 / F17
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tài sản có số bản ghi vượt một trang, **When** tôi cuộn tới cuối danh sách, **Then** lô bản ghi tiếp theo được tải và nối thêm trong < 2 giây.
  - GWT-2: **Given** tôi đã cuộn hết, **When** không còn dữ liệu, **Then** panel hiện "— Đã hiển thị hết lịch sử —".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
