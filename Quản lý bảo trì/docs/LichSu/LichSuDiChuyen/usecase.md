# Use case — Lịch sử di chuyển tài sản

## UC-S06-01: Xem lịch sử di chuyển của một tài sản
- Tác nhân (actor): Quản trị, Giám sát
- Trigger (kích hoạt): Người dùng chọn "Xem lịch sử" trong popup pin trên S01, hoặc mở lịch sử từ một kết quả tra cứu
- Tiền điều kiện: Đã đăng nhập; tài sản tồn tại trong hệ thống
- Luồng chính (happy path):
  1. Người dùng kích hoạt "Xem lịch sử" cho một tài sản.
  2. Hệ thống mở panel slide-left và tải trang lịch sử đầu của tài sản (< 2 giây).
  3. Hệ thống hiển thị timeline các bản ghi theo thời điểm giảm dần: thời điểm · người thực hiện · vị trí cũ → vị trí mới (đường dẫn đầy đủ) · lý do (nếu có).
  4. Người dùng đọc xong, đóng panel (← / ✕) để trở về S01.
- Luồng thay thế / ngoại lệ:
  - Tài sản chưa từng di chuyển → hiện "Tài sản chưa có lần di chuyển nào.".
  - Tải lịch sử lỗi → hiện "Không tải được lịch sử" + nút "Thử lại".
  - Bản ghi đầu đời → vị trí cũ hiển thị "(Chưa có vị trí)"; bản ghi không có lý do → "(Không có lý do)".
- Hậu điều kiện (postcondition): Người dùng nắm được toàn bộ chuỗi di chuyển của tài sản; dữ liệu không thay đổi (chỉ đọc).
- Đảm bảo (guarantees): thành công → timeline đầy đủ, đúng thứ tự; tối thiểu → luôn có phản hồi (danh sách, trạng thái rỗng hoặc lỗi).
- Trace: R-S06-01, R-S06-02, R-S06-03, R-S06-06

## UC-S06-02: Lọc lịch sử theo khoảng thời gian
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng nhập Từ ngày / Đến ngày và chọn Áp dụng
- Tiền điều kiện: Panel lịch sử đang mở cho một tài sản có ≥ 1 bản ghi
- Luồng chính:
  1. Người dùng nhập Từ ngày và/hoặc Đến ngày.
  2. Người dùng chọn Áp dụng.
  3. Hệ thống tải và hiển thị các bản ghi có thời điểm nằm trong khoảng (bao gồm hai mốc).
  4. Người dùng chọn Xóa lọc để trở về toàn bộ lịch sử.
- Luồng thay thế / ngoại lệ:
  - Từ ngày > Đến ngày → báo lỗi inline "Từ ngày không được sau Đến ngày"; không tải.
  - Khoảng đã chọn không có bản ghi → "Không có lần di chuyển nào trong khoảng đã chọn." + gợi ý Xóa lọc.
  - Chỉ nhập một phía → lọc một phía hợp lệ.
- Hậu điều kiện: Timeline thu hẹp theo khoảng; bộ lọc có thể gỡ để trở lại đầy đủ.
- Đảm bảo: thành công → chỉ hiện bản ghi đúng khoảng; tối thiểu → không tải khi khoảng không hợp lệ, giữ dữ liệu đã nhập.
- Trace: R-S06-04, R-S06-05, R-S06-06

## UC-S06-03: Tải thêm khi lịch sử dài
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng cuộn tới cuối danh sách hoặc chọn "Xem thêm"
- Tiền điều kiện: Tài sản có số bản ghi vượt một trang
- Luồng chính:
  1. Người dùng cuộn tới cuối / chọn "Xem thêm".
  2. Hệ thống tải lô bản ghi tiếp theo (< 2 giây) và nối vào timeline.
  3. Khi hết dữ liệu, hệ thống hiện "— Đã hiển thị hết lịch sử —".
- Luồng thay thế / ngoại lệ:
  - Lô tải thêm lỗi → giữ phần đã hiển thị + nút "Thử lại" ở cuối.
- Hậu điều kiện: Toàn bộ (hoặc thêm một phần) lịch sử được hiển thị; hiệu năng giữ ổn định.
- Đảm bảo: thành công → nối thêm đúng thứ tự, không trùng; tối thiểu → phần đã tải vẫn còn nguyên khi tải thêm lỗi.
- Trace: R-S06-07, R-S06-N01
