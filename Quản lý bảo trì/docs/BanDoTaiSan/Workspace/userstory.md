# User story — Bản đồ tài sản (Workspace)

## US-S01-01: Bản đồ tài sản - Tra cứu nhanh vị trí
Là kỹ thuật viên/giám sát, tôi muốn gõ mã hoặc tên tài sản và được dẫn thẳng tới vị trí của nó trên sơ đồ, để không mất thời gian đi tìm.

- Trace: R-S01-03 / F16
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang ở workspace, **When** tôi gõ "may nen" (không dấu), **Then** hệ thống gợi ý "Máy nén khí" trong < 1 giây.
  - GWT-2: **Given** tôi chọn một tài sản đã có vị trí, **When** kết quả được chọn, **Then** sơ đồ khu vực chứa nó tự mở, pin được làm nổi và breadcrumb hiện đường dẫn đầy đủ.
  - GWT-3: **Given** tài sản chưa có vị trí, **When** tôi chọn nó, **Then** hệ thống hiện "Chưa gán vị trí" thay vì mở sơ đồ.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-02: Bản đồ tài sản - Gán vị trí cho tài sản
Là người quản lý tài sản, tôi muốn click lên sơ đồ rồi chọn tài sản, để đánh dấu chính xác tài sản đang nằm ở đâu.

- Trace: R-S01-06 / F11
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** nút khu vực đã có ảnh sơ đồ, **When** tôi click một điểm trống, **Then** ô tìm mở ra và chỉ liệt kê tài sản chưa có vị trí.
  - GWT-2: **Given** tôi chọn một tài sản và xác nhận, **When** gán thành công, **Then** pin xuất hiện đúng điểm đã click và toast "Đã gán vị trí cho tài sản" hiện ra.
  - GWT-3: **Given** tài sản vừa bị người khác khóa, **When** tôi xác nhận gán, **Then** hệ thống báo "Tài sản đang được người khác chỉnh sửa" và không tạo pin.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-03: Bản đồ tài sản - Gỡ vị trí tài sản
Là người quản lý tài sản, tôi muốn gỡ vị trí một tài sản khỏi sơ đồ, để xử lý tài sản đã rời khu vực mà chưa biết đích đến.

- Trace: R-S01-07 / F14
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi mở popup một pin, **When** tôi chọn Gỡ vị trí và xác nhận, **Then** pin biến mất và tài sản về trạng thái "chưa có vị trí".
  - GWT-2: **Given** thao tác gỡ thành công, **When** hoàn tất, **Then** một bản ghi nhật ký kiểm toán được tạo (ai, khi nào).
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-04: Bản đồ tài sản - Sắp xếp cây khu vực
Là người quản trị, tôi muốn kéo-thả nút khu vực sang nhánh khác, để chỉnh lại cấu trúc cho khớp thực tế.

- Trace: R-S01-08 / F05
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi là Quản trị, **When** tôi kéo một nút vào một nút cha hợp lệ, **Then** quan hệ cha-con cập nhật và cây render lại.
  - GWT-2: **Given** tôi kéo một nút, **When** tôi thả vào chính nó hoặc nhánh con của nó, **Then** hệ thống chặn và báo "Không thể di chuyển khu vực vào chính nhánh con của nó".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-05: Bản đồ tài sản - Xóa khu vực an toàn
Là người quản trị, tôi muốn được cảnh báo số lượng bị ảnh hưởng trước khi xóa một khu vực, để tránh xóa nhầm dữ liệu hàng loạt.

- Trace: R-S01-09 / F03
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chọn Xóa một nút có 12 tài sản và 3 khu con, **When** dialog hiện, **Then** dialog ghi rõ "gỡ vị trí 12 tài sản và xóa 3 khu vực con".
  - GWT-2: **Given** tôi xác nhận xóa, **When** hoàn tất, **Then** nhánh bị xóa, 12 tài sản về "chưa có vị trí" (hồ sơ giữ nguyên) và nhật ký kiểm toán được ghi.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-06: Bản đồ tài sản - Xem sơ đồ với nhiều pin
Là giám sát, tôi muốn xem sơ đồ mặt bằng với pin được gom cụm khi quá đông, để không bị rối khi khu vực có hàng trăm tài sản.

- Trace: R-S01-02, R-S01-04, R-S01-05 / F09, F10
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chọn một nút có ảnh sơ đồ, **When** sơ đồ mở, **Then** ảnh + pin hiển thị trong < 2 giây với breadcrumb đường dẫn.
  - GWT-2: **Given** sơ đồ có hơn 500 pin, **When** hiển thị, **Then** các pin gần nhau gộp thành cụm có số đếm; click cụm sẽ tách/zoom.
  - GWT-3: **Given** nút chưa có ảnh sơ đồ, **When** tôi chọn nút, **Then** khung giữa hiện "Chưa có sơ đồ".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-07: Bản đồ tài sản - Gán nhiều tài sản vào một vị trí
Là người quản lý tài sản, tôi muốn chọn nhiều tài sản cùng lúc và gán vào một điểm trên sơ đồ, để đánh dấu cụm thiết bị đặt chung một chỗ mà không phải làm từng cái.

- Trace: R-S01-12, R-S01-14 / F11
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi click một điểm trống, **When** ô gán mở, **Then** tôi thấy ô tìm + danh sách checkbox tài sản chưa có vị trí (tối đa 50 dòng) và dòng đếm "N kết quả · Đã chọn 0".
  - GWT-2: **Given** tôi gõ "may" vào ô tìm, **When** danh sách lọc, **Then** chỉ hiện tài sản khớp (không dấu) và nút "Gán vị trí" disable khi chưa chọn.
  - GWT-3: **Given** tôi tích 3 tài sản và bấm "Gán vị trí (3)", **When** gán thành công, **Then** 3 marker chồng tại điểm đã click hiển thị "3 tài sản" và toast "Đã gán vị trí cho 3 tài sản.".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-08: Bản đồ tài sản - Đặt tên cho vị trí
Là người quản lý tài sản, tôi muốn đặt tên cho một vị trí trên sơ đồ, để gọi nó bằng tên dễ nhớ (vd "Khu máy nén") thay vì nhìn mã tài sản.

- Trace: R-S01-14 / F11
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang gán, **When** tôi nhập "Khu máy nén" vào "Tên vị trí" rồi gán, **Then** marker hiển thị nhãn "Khu máy nén".
  - GWT-2: **Given** một vị trí đã có tài sản, **When** tôi mở popup, sửa tên thành "Khu A1" và bấm "Lưu tên", **Then** nhãn marker đổi sang "Khu A1" và toast "Đã đặt tên vị trí.".
  - GWT-3: **Given** vị trí đang có tên, **When** tôi xóa trống tên và "Lưu tên", **Then** marker về nhãn mặc định ("N tài sản"/mã) và toast "Đã xóa tên vị trí.".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-09: Bản đồ tài sản - Kéo-thả marker chỉnh vị trí
Là người quản lý tài sản, tôi muốn kéo một marker tới đúng điểm trên sơ đồ, để chỉnh vị trí cho khớp thực tế mà không tạo bản ghi di dời thừa.

- Trace: R-S01-15 / F11
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** một marker có 2 tài sản, **When** tôi giữ và kéo nó sang điểm mới (dịch > 0,5%) rồi thả, **Then** cả 2 tài sản nhận tọa độ mới và tên vị trí đi theo.
  - GWT-2: **Given** tôi nhấn marker nhưng gần như không di chuyển (≤ 0,5%), **When** tôi thả, **Then** popup danh sách tài sản mở (xem là click), không dời vị trí.
  - GWT-3: **Given** tôi vừa kéo-thả một marker, **When** kiểm tra lịch sử di chuyển của tài sản, **Then** **không** có bản ghi mới (khác với "Di dời").
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-10: Bản đồ tài sản - Quản lý nhiều tài sản tại một vị trí
Là người quản lý tài sản, tôi muốn xem danh sách mọi tài sản tại một vị trí và thao tác từng cái, để xử lý đúng tài sản khi nhiều thứ nằm chung một chỗ.

- Trace: R-S01-13 / F11, F14
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** một vị trí có 3 tài sản, **When** tôi click marker, **Then** popup liệt kê đủ 3 tài sản, mỗi cái có "Xem lịch sử / Di dời / Gỡ vị trí".
  - GWT-2: **Given** popup đang mở và còn tài sản chưa có vị trí, **When** tôi bấm "+ Gán thêm tài sản vào vị trí này", **Then** ô gán mở tại đúng tọa độ vị trí đó.
  - GWT-3: **Given** tôi gỡ lần lượt cả 3 tài sản, **When** tài sản cuối bị gỡ, **Then** popup tự đóng và marker biến mất.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S01-11: Bản đồ tài sản - Tìm nhánh & dùng trên mobile
Là người dùng, tôi muốn tìm nhanh một khu vực trong cây và thao tác gọn trên điện thoại, để không phải cuộn cây dài hay vật lộn với màn hẹp.

- Trace: R-S01-17, R-S01-18, R-S01-N06 / F04
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** cây mặc định thu gọn, **When** tôi gõ "tang 3" vào ô tìm khu vực, **Then** chỉ nhánh khớp + tổ tiên hiện ra và tự bung.
  - GWT-2: **Given** một nút đã có ảnh sơ đồ, **When** cây hiển thị, **Then** cạnh tên nút có icon "đã có sơ đồ" (tooltip "Đã có sơ đồ mặt bằng").
  - GWT-3: **Given** tôi mở app trên màn ≤768px, **When** tôi bấm hamburger ☰, **Then** drawer cây trượt vào kèm nền tối (scrim); chọn một nút thì drawer tự đóng.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
