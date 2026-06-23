# User story — Di dời tài sản (đơn & hàng loạt)

## US-S04-01: Di dời tài sản - Di dời một tài sản
Là người quản lý tài sản, tôi muốn di dời một tài sản sang khu vực đích mới qua một form, để vị trí trên hệ thống khớp với thực tế và có truy vết.

- Trace: R-S04-01 / F12
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi mở popup pin của tài sản A-007 và bấm "Di dời", **When** form mở, **Then** A-007 đã được chọn sẵn và bộ chọn cách lấy nguồn bị ẩn.
  - GWT-2: **Given** tôi chọn khu vực đích và bấm "Di dời", **When** lưu thành công, **Then** pin A-007 chuyển sang khu vực đích, toast "Đã di dời 1 tài sản." hiện ra và một bản ghi lịch sử (vị trí cũ→mới, người, thời điểm) được tạo.
  - GWT-3: **Given** tôi chưa chọn đích, **When** tôi bấm "Di dời", **Then** hệ thống báo "Vui lòng chọn khu vực đích." và không lưu.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S04-02: Di dời tài sản - Di dời hàng loạt nhiều tài sản lẻ
Là người quản lý tài sản, tôi muốn chọn nhiều tài sản lẻ và chuyển tất cả về cùng một đích trong một lần, để không phải di dời từng cái một.

- Trace: R-S04-02 / F13
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi bấm "Di dời hàng loạt", **When** form mở ở chế độ "Chọn tài sản lẻ", **Then** ô tìm chỉ liệt kê tài sản đã có vị trí và cho tick nhiều.
  - GWT-2: **Given** tôi tick 3 tài sản và chọn một đích, **When** tôi bấm "Di dời 3", **Then** cả 3 tài sản về đúng đích đã chọn và toast "Đã di dời 3 tài sản." hiện ra.
  - GWT-3: **Given** tôi chưa tick tài sản nào, **When** form đang mở, **Then** nút "Di dời" bị tắt.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S04-03: Di dời tài sản - Lấy hết tài sản theo vị trí cũ
Là người quản lý tài sản, tôi muốn chọn cả một vị trí cũ để lấy hết tài sản trong đó, để di dời nhanh khi cả một phòng/kho được dời sang chỗ mới.

- Trace: R-S04-03 / F13
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi chọn chế độ "Chọn cả vị trí cũ", **When** tôi chọn nút khu vực "Phòng 305" có 8 tài sản, **Then** cả 8 tài sản được nạp vào lô và bộ đếm hiện "8 tài sản đã chọn".
  - GWT-2: **Given** nút khu vực nguồn không có tài sản nào, **When** tôi chọn nó, **Then** hệ thống báo "Vị trí này không có tài sản để di dời.".
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S04-04: Di dời tài sản - Ghi lý do và truy vết tự động
Là giám sát, tôi muốn ghi lý do di dời (tùy chọn) và để hệ thống tự ghi người + thời điểm, để mọi thay đổi vị trí đều truy vết được mà không phải nhập thủ công.

- Trace: R-S04-05, R-S04-06, R-S04-07 / F12, F13
- Story point: 2
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi để trống lý do, **When** tôi di dời, **Then** thao tác vẫn lưu được và bản ghi lịch sử ghi đúng người thực hiện + thời điểm.
  - GWT-2: **Given** tôi nhập lý do dài hơn 500 ký tự, **When** tôi gõ, **Then** hệ thống chặn vượt 500 và báo "Lý do tối đa 500 ký tự.".
  - GWT-3: **Given** một di dời hoàn tất, **When** tôi xem lịch sử tài sản, **Then** bản ghi có vị trí cũ→mới, người, thời điểm và lý do (nếu nhập) cùng một bản ghi nhật ký kiểm toán.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S04-05: Di dời tài sản - Hoàn tác toàn bộ khi gián đoạn
Là người quản lý tài sản, tôi muốn nếu di dời hàng loạt bị mất mạng giữa chừng thì hệ thống hoàn tác toàn bộ lô, để không bao giờ còn dữ liệu vị trí nửa vời.

- Trace: R-S04-09 / F13
- Story point: 5
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tôi đang di dời 10 tài sản và mất mạng sau khi 4 cái đã ghi, **When** giao dịch lô không hoàn tất, **Then** hệ thống rollback toàn bộ: cả 10 tài sản giữ nguyên vị trí cũ.
  - GWT-2: **Given** lô vừa bị rollback, **When** tôi xem lại, **Then** snackbar "Mất kết nối, đã hoàn tác toàn bộ. Vui lòng thử lại." hiện ra và không có bản ghi lịch sử nửa vời nào được tạo.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable

## US-S04-06: Di dời tài sản - Chặn thao tác lên tài sản đang bị khóa
Là người quản lý tài sản, tôi muốn được cảnh báo khi tài sản đang bị người khác chỉnh sửa, để tránh hai người di dời cùng một tài sản dẫn tới xung đột.

- Trace: R-S04-08, R-S04-N02 / F13, F22
- Story point: 3
- Tiêu chí chấp nhận (Given-When-Then):
  - GWT-1: **Given** tài sản A-021 đang bị người khác khóa, **When** tôi mở form di dời, **Then** A-021 hiện icon khóa và không tick chọn được.
  - GWT-2: **Given** lô của tôi có 1 tài sản bị khóa và 2 tài sản hợp lệ, **When** tôi bấm "Di dời", **Then** hệ thống hỏi "Bỏ qua và tiếp tục với phần còn lại?"; đồng ý → di dời 2 tài sản hợp lệ.
  - GWT-3: **Given** một tài sản bị khóa quá 5 phút không thao tác, **When** tôi thử lại, **Then** khóa tự mở và tài sản trở lại di dời được.
- INVEST: [x] Independent [x] Negotiable [x] Valuable [x] Estimable [x] Small [x] Testable
