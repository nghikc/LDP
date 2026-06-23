# Use case — Di dời tài sản (đơn & hàng loạt)

## UC-S04-01: Di dời một tài sản
- Tác nhân (actor): Quản trị, Giám sát
- Trigger (kích hoạt): Người dùng mở popup pin của một tài sản trên S01 và bấm "Di dời"
- Tiền điều kiện: Đã đăng nhập; tài sản đang có vị trí; tài sản không bị người khác khóa
- Luồng chính (happy path):
  1. Hệ thống mở form di dời (modal trượt lên), Bước 1 chọn sẵn đúng tài sản đó, ẩn bộ chọn cách lấy nguồn.
  2. Người dùng chọn khu vực/vị trí đích (bắt buộc).
  3. Người dùng nhập lý do (tùy chọn, ≤ 500 ký tự).
  4. Người dùng bấm "Di dời".
  5. Hệ thống gỡ pin cũ, tạo pin tại đích, tự ghi người thực hiện + thời điểm, sinh bản ghi lịch sử di chuyển và nhật ký kiểm toán.
  6. Hệ thống hiện toast "Đã di dời 1 tài sản." và fade về S01 với pin ở vị trí mới.
- Luồng thay thế / ngoại lệ:
  - Chưa chọn đích → báo "Vui lòng chọn khu vực đích.", không cho lưu.
  - Tài sản vừa bị người khác khóa → báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.", không di dời.
  - Người dùng bấm Hủy → đóng form, không thay đổi.
- Hậu điều kiện (postcondition): Tài sản ở vị trí đích; có bản ghi lịch sử + nhật ký kiểm toán.
- Đảm bảo (guarantees): thành công → vị trí cập nhật + truy vết; tối thiểu → không đổi gì nếu chưa xác nhận hoặc bị khóa.
- Trace: R-S04-01, R-S04-04, R-S04-05, R-S04-06, R-S04-07, R-S04-10

## UC-S04-02: Di dời hàng loạt chọn nhiều tài sản lẻ
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng bấm "Di dời hàng loạt" trên thanh công cụ S01
- Tiền điều kiện: Đã đăng nhập; tồn tại tài sản đã có vị trí
- Luồng chính:
  1. Hệ thống mở form di dời, Bước 1 ở chế độ "Chọn tài sản lẻ".
  2. Người dùng tìm và tick nhiều tài sản đã có vị trí; bộ đếm cập nhật số đã chọn.
  3. Người dùng chọn một khu vực đích (bắt buộc) — mọi tài sản sẽ về cùng đích.
  4. Người dùng nhập lý do (tùy chọn) và bấm "Di dời N".
  5. Hệ thống khóa các tài sản trong lô, ghi giao dịch lô, đưa tất cả về đích, sinh lịch sử + nhật ký kiểm toán cho từng tài sản.
  6. Hệ thống hiện toast "Đã di dời N tài sản." và fade về S01.
- Luồng thay thế / ngoại lệ:
  - Chưa chọn tài sản → nút Di dời tắt.
  - Chưa chọn đích → báo "Vui lòng chọn khu vực đích.".
  - Lô có tài sản đang bị người khác khóa → hỏi "Bỏ qua và tiếp tục với phần còn lại?"; người dùng đồng ý → di dời phần còn lại; từ chối → hủy.
- Hậu điều kiện: Tất cả tài sản trong lô ở cùng đích; mỗi tài sản có bản ghi lịch sử + nhật ký.
- Đảm bảo: thành công → cả lô cập nhật; tối thiểu → không lô nửa vời (xem UC-S04-04).
- Trace: R-S04-02, R-S04-04, R-S04-07, R-S04-08, R-S04-10

## UC-S04-03: Di dời hàng loạt chọn cả vị trí cũ (lấy hết tài sản)
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng bấm "Di dời hàng loạt" và chọn chế độ "Chọn cả vị trí cũ"
- Tiền điều kiện: Đã đăng nhập; nút khu vực nguồn chứa ≥ 1 tài sản
- Luồng chính:
  1. Người dùng chọn chế độ "Chọn cả vị trí cũ (lấy hết)".
  2. Người dùng chọn một nút khu vực nguồn.
  3. Hệ thống nạp toàn bộ tài sản trong nút đó vào lô; bộ đếm hiện đúng số lượng.
  4. Người dùng chọn khu vực đích (bắt buộc), nhập lý do (tùy chọn), bấm "Di dời N".
  5. Hệ thống xử lý như UC-S04-02 (khóa, ghi giao dịch lô, lịch sử, nhật ký).
- Luồng thay thế / ngoại lệ:
  - Nút nguồn không có tài sản → báo "Vị trí này không có tài sản để di dời.".
  - Một số tài sản trong nút đang bị khóa → hỏi bỏ qua phần còn lại như UC-S04-02.
- Hậu điều kiện: Toàn bộ tài sản (trừ phần bị khóa nếu bỏ qua) chuyển về đích.
- Đảm bảo: thành công → vị trí cũ trống, đích nhận đủ; tối thiểu → không đổi nếu hủy.
- Trace: R-S04-03, R-S04-04, R-S04-07, R-S04-08

## UC-S04-04: Rollback khi di dời lô bị gián đoạn (ngoại lệ)
- Tác nhân: Quản trị, Giám sát; Hệ thống
- Trigger: Mất mạng / phiên đứt khi hệ thống đang ghi giao dịch lô
- Tiền điều kiện: Một lô di dời đang được xử lý (đã khóa tài sản, đang ghi vị trí mới)
- Luồng chính:
  1. Hệ thống phát hiện giao dịch lô chưa hoàn tất (commit).
  2. Hệ thống rollback toàn bộ lô (all-or-nothing): khôi phục vị trí cũ cho mọi tài sản đã ghi dở.
  3. Hệ thống nhả khóa các tài sản trong lô.
  4. Giao diện hiện snackbar "Mất kết nối, đã hoàn tác toàn bộ. Vui lòng thử lại.".
- Luồng thay thế / ngoại lệ:
  - Người dùng thử lại → bắt đầu lại lô từ đầu (không có dữ liệu nửa vời tồn đọng).
- Hậu điều kiện: Trạng thái như trước khi di dời; không tài sản nào đổi vị trí một phần.
- Đảm bảo: thành công → khôi phục sạch; tối thiểu → không bao giờ để lô một phần.
- Trace: R-S04-09, R-S04-N01

## UC-S04-05: Bị chặn do tài sản đang bị khóa (ngoại lệ)
- Tác nhân: Quản trị, Giám sát; Hệ thống
- Trigger: Người dùng cố di dời tài sản đang bị người khác chỉnh sửa
- Tiền điều kiện: Tài sản (hoặc một phần lô) đang bị người khác khóa (chưa hết 5 phút)
- Luồng chính:
  1. Hệ thống kiểm tra trạng thái khóa khi người dùng bấm Di dời.
  2. Với di dời đơn → báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau." và dừng.
  3. Với di dời hàng loạt → liệt kê tài sản bị khóa, hỏi "Bỏ qua và tiếp tục với phần còn lại?".
- Luồng thay thế / ngoại lệ:
  - Người dùng đồng ý bỏ qua → di dời các tài sản không bị khóa.
  - Người dùng từ chối → hủy lô.
  - Khóa hết hạn 5 phút trong lúc chờ → tài sản trở lại sẵn sàng, có thể thử lại.
- Hậu điều kiện: Chỉ tài sản hợp lệ được di dời; tài sản bị khóa giữ nguyên.
- Đảm bảo: thành công → bỏ qua đúng phần bị khóa; tối thiểu → không di dời tài sản đang bị người khác giữ.
- Trace: R-S04-08, R-S04-N02
