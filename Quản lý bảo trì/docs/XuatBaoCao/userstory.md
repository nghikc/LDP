# User story — Xuất báo cáo / kiểm kê

## US-S08-01: Xuất báo cáo - Chọn phạm vi xuất
Là người quản lý tài sản, tôi muốn chọn phạm vi xuất (toàn bộ / theo khu vực / theo bộ lọc), để báo cáo đúng tập tài sản tôi cần kiểm kê.

- Trace: R-S08-01, R-S08-02 / F20
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi mở modal Xuất báo cáo, **When** modal hiện, **Then** có 3 lựa chọn phạm vi và bắt buộc chọn đúng 1.
  - GWT-2: **Given** tôi chọn "Theo khu vực đang chọn", **When** ở S01 đã chọn một nút, **Then** breadcrumb nút hiện ra và checkbox "Gồm cả các khu vực con" bật mặc định.
  - GWT-3: **Given** tôi chọn "Theo khu vực đang chọn" mà chưa chọn nút nào ở S01, **When** tôi định xuất, **Then** hệ thống báo "Hãy chọn một khu vực trước khi xuất theo khu vực".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S08-02: Xuất báo cáo - Chọn cột xuất
Là người quản lý tài sản, tôi muốn chọn những cột cần có trong file, để báo cáo gọn đúng thông tin phục vụ kiểm kê.

- Trace: R-S08-03 / F20
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** modal đang mở, **When** tôi xem nhóm "Cột xuất", **Then** 5 cột (mã, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất) được tick sẵn.
  - GWT-2: **Given** tôi bỏ tick một vài cột, **When** tôi xuất, **Then** file chỉ chứa các cột còn lại theo đúng thứ tự chuẩn.
  - GWT-3: **Given** tôi bỏ tick hết cột, **When** tôi định xuất, **Then** hệ thống báo "Chọn ít nhất một cột" và chặn nút Xuất.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S08-03: Xuất báo cáo - Xuất file Excel tải về
Là người quản lý tài sản, tôi muốn xuất danh sách tài sản kèm vị trí ra file Excel và tải về, để dùng cho kiểm kê và bàn giao.

- Trace: R-S08-05, R-S08-N02 / F20
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** phạm vi đã chọn có tài sản, **When** tôi bấm "Xuất Excel", **Then** một file `.xlsx` hợp lệ được tạo và tải về máy.
  - GWT-2: **Given** file đã tạo, **When** tôi mở, **Then** mỗi dòng là một tài sản với các cột đã chọn, dấu tiếng Việt hiển thị đúng, "lần di dời gần nhất" lấy bản ghi mới nhất (trống nếu chưa từng di dời).
  - GWT-3: **Given** xuất thành công, **When** hoàn tất, **Then** toast "Đã xuất {n} tài sản" hiện ra và modal fade về S01.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S08-04: Xuất báo cáo - Báo khi không có dữ liệu
Là người quản lý tài sản, tôi muốn được báo rõ khi phạm vi không có tài sản nào, để không tải về một file rỗng vô ích.

- Trace: R-S08-04, R-S08-07 / F20
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chọn một phạm vi không có tài sản nào, **When** hệ thống ước tính, **Then** hiển thị "Không có dữ liệu để xuất".
  - GWT-2: **Given** phạm vi rỗng, **When** tôi xem nút "Xuất Excel", **Then** nút bị vô hiệu cho tới khi tôi đổi phạm vi có dữ liệu.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S08-05: Xuất báo cáo - Xuất tập lớn có tiến trình
Là người quản lý tài sản, tôi muốn thấy tiến trình và có thể hủy khi xuất tập rất lớn, để biết hệ thống đang chạy và không phải chờ vô định.

- Trace: R-S08-06, R-S08-N01, R-S08-N03 / F20
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** phạm vi có hàng chục nghìn tài sản (tới 50.000), **When** tôi bấm "Xuất Excel", **Then** thanh tiến trình + số dòng đã xử lý hiện ra và giao diện vẫn phản hồi.
  - GWT-2: **Given** đang dựng file, **When** tôi bấm Hủy, **Then** quá trình dừng, không tải file dở và tôi quay về màn cấu hình.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S08-06: Xuất báo cáo - Cả hai vai trò đều xuất được
Là giám sát, tôi muốn tự xuất báo cáo kiểm kê mà không cần nhờ quản trị, để chủ động đối chiếu tài sản tại khu vực mình phụ trách.

- Trace: R-S08-08 / F20
- Story point: 1
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đăng nhập với vai trò Giám sát, **When** tôi ở S01, **Then** tôi thấy và bấm được nút "Xuất báo cáo".
  - GWT-2: **Given** tôi xuất xong, **When** hoàn tất hoặc hủy, **Then** modal fade về S01 (workspace).
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
