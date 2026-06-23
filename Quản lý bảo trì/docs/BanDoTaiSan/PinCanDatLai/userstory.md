# User story — Danh sách pin cần đặt lại

## US-S05-01: Pin cần đặt lại - Xem danh sách pin cần xử lý
Là người quản lý/giám sát tài sản, tôi muốn xem danh sách các pin bị lệch ra ngoài sơ đồ sau khi thay ảnh, để biết chính xác tài sản nào cần đặt lại vị trí.

- Trace: R-S05-01, R-S05-02 / F15
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** có 3 pin bị đánh dấu "cần đặt lại", **When** tôi bấm dải "3 pin cần đặt lại" ở Workspace, **Then** panel mở và liệt kê đúng 3 item, mỗi item có mã + tên tài sản, đường dẫn khu vực và tên sơ đồ.
  - GWT-2: **Given** panel đang mở, **When** tôi nhìn phần đầu panel, **Then** bộ đếm hiện "Tổng: 3" khớp số item.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S05-02: Pin cần đặt lại - Đặt lại vị trí một pin
Là người quản lý/giám sát tài sản, tôi muốn chọn một pin và đặt lại tọa độ của nó trên sơ đồ, để pin hiển thị đúng chỗ tài sản đang nằm.

- Trace: R-S05-03, R-S05-04 / F15
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang xem danh sách, **When** tôi bấm [Đặt lại vị trí] trên pin A-014, **Then** panel đóng, sơ đồ chứa A-014 mở ở Workspace và pin được làm nổi ở chế độ đặt lại.
  - GWT-2: **Given** tôi đang ở chế độ đặt lại, **When** tôi click một điểm trong vùng ảnh và bấm Lưu, **Then** pin nhận tọa độ tương đối mới (trong 0–100%) và toast "Đã đặt lại vị trí pin" hiện ra.
  - GWT-3: **Given** tôi đặt lại thành công, **When** hoàn tất, **Then** một bản ghi nhật ký kiểm toán được tạo (ai, tài sản, vị trí cũ→mới, khi nào).
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S05-03: Pin cần đặt lại - Chặn đặt ra ngoài vùng sơ đồ
Là người đặt lại vị trí, tôi muốn hệ thống chặn khi tôi đặt pin ra ngoài vùng ảnh, để không tạo ra pin lệch tiếp.

- Trace: R-S05-06 / F15
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang đặt lại một pin, **When** tôi chọn điểm nằm ngoài khung ảnh (x hoặc y ngoài 0–100%), **Then** hệ thống báo "Vị trí nằm ngoài sơ đồ" và không lưu.
  - GWT-2: **Given** tôi vừa bị chặn vì đặt ngoài vùng, **When** tôi xem lại danh sách, **Then** pin vẫn ở trạng thái "cần đặt lại".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S05-04: Pin cần đặt lại - Pin rời danh sách sau khi đặt lại
Là người xử lý pin lệch, tôi muốn pin tự rời khỏi danh sách và bộ đếm giảm khi tôi đặt lại xong, để biết còn bao nhiêu pin cần xử lý.

- Trace: R-S05-05, R-S05-02 / F15
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** danh sách có 3 pin, **When** tôi đặt lại xong 1 pin, **Then** pin đó rời danh sách và bộ đếm hiện "Tổng: 2".
  - GWT-2: **Given** tôi đặt lại pin cuối cùng, **When** bộ đếm về 0, **Then** panel hiện "Không có pin nào cần đặt lại vị trí".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S05-05: Pin cần đặt lại - Cả Quản trị và Giám sát đều đặt lại được
Là giám sát (không có quyền quản cấu trúc), tôi muốn vẫn đặt lại được vị trí pin, để xử lý pin lệch mà không phải chờ Quản trị.

- Trace: R-S05-08 / F15, F09
- Story point: 1
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đăng nhập vai trò Giám sát, **When** có pin cần đặt lại, **Then** tôi mở được panel S05 và bấm [Đặt lại vị trí] được như Quản trị.
  - GWT-2: **Given** tôi đang đặt lại pin, **When** tôi lưu tọa độ hợp lệ, **Then** thao tác thành công mà không yêu cầu quyền quản lý cấu trúc.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
