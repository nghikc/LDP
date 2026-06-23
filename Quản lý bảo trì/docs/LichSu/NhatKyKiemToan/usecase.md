# Use case — Nhật ký kiểm toán

## UC-S07-01: Xem nhật ký kiểm toán
- Tác nhân (actor): Quản trị
- Trigger (kích hoạt): Người dùng mở màn Nhật ký kiểm toán từ Bản đồ tài sản (S01)
- Tiền điều kiện: Đã đăng nhập; **vai trò Quản trị**; đã có ít nhất một bản ghi kiểm toán
- Luồng chính (happy path):
  1. Người dùng mở màn Nhật ký kiểm toán.
  2. Hệ thống kiểm tra vai trò là Quản trị.
  3. Hệ thống tải trang đầu các bản ghi, sắp xếp mới nhất trước (< 2s).
  4. Người dùng đọc bảng: thời điểm, người thực hiện, hành động, đối tượng, vị trí cũ→mới.
- Luồng thay thế / ngoại lệ:
  - Vai trò Giám sát → từ chối truy cập (xem UC-S07-04).
  - Chưa có bản ghi nào / lọc không khớp → hiện "Không có bản ghi phù hợp".
  - Tải nhật ký thất bại → thông báo "Không tải được nhật ký" + nút thử lại.
- Hậu điều kiện (postcondition): Bảng bản ghi hiển thị ở chế độ chỉ đọc; không có thay đổi dữ liệu.
- Đảm bảo (guarantees): thành công → Quản trị thấy danh sách bản ghi; tối thiểu → luôn có phản hồi (kết quả, trạng thái rỗng hoặc lỗi).
- Trace: R-S07-01, R-S07-N02, R-S07-N03

## UC-S07-02: Lọc nhật ký theo điều kiện
- Tác nhân: Quản trị
- Trigger: Người dùng đặt một hoặc nhiều điều kiện trong panel bộ lọc rồi áp dụng
- Tiền điều kiện: Đang ở màn Nhật ký kiểm toán (vai trò Quản trị)
- Luồng chính:
  1. Người dùng chọn người thực hiện và/hoặc loại hành động (Gán/Di dời/Xóa).
  2. Người dùng nhập khoảng thời gian (Từ ngày – Đến ngày) và/hoặc từ khóa đối tượng (≤ 100 ký tự).
  3. Người dùng chọn "Áp dụng lọc".
  4. Hệ thống kiểm tra Từ ≤ Đến, áp các điều kiện (AND) và nạp lại bảng theo kết quả giao nhau.
- Luồng thay thế / ngoại lệ:
  - Từ ngày > Đến ngày → báo lỗi inline "Từ ngày phải nhỏ hơn hoặc bằng Đến ngày", chặn áp dụng.
  - Từ khóa > 100 ký tự → báo "Nhập tối đa 100 ký tự".
  - Không có bản ghi khớp → hiện "Không có bản ghi phù hợp" + gợi ý nới điều kiện.
  - Chọn "Xóa lọc" → mọi điều kiện về mặc định, bảng nạp lại đầy đủ.
- Hậu điều kiện: Bảng hiển thị đúng tập bản ghi khớp điều kiện.
- Đảm bảo: thành công → bảng phản ánh đúng bộ lọc; tối thiểu → không áp dụng khi điều kiện không hợp lệ.
- Trace: R-S07-02, R-S07-03, R-S07-04, R-S07-05, R-S07-06, BRule-S07-05

## UC-S07-03: Phân trang & sắp xếp kết quả
- Tác nhân: Quản trị
- Trigger: Kết quả vượt một trang, hoặc người dùng click tiêu đề cột Thời điểm
- Tiền điều kiện: Đang xem bảng có ≥ 1 bản ghi
- Luồng chính:
  1. Hệ thống hiển thị tổng số bản ghi và chia trang (mặc định 25 dòng/trang).
  2. Người dùng chuyển Trước/Sau hoặc tới một số trang.
  3. Người dùng click tiêu đề cột Thời điểm để đảo thứ tự tăng/giảm.
- Luồng thay thế / ngoại lệ:
  - Chỉ một trang → ẩn/khóa điều hướng phân trang.
- Hậu điều kiện: Bảng hiển thị trang/thứ tự người dùng chọn; điều kiện lọc giữ nguyên.
- Đảm bảo: thành công → đúng trang và thứ tự; tối thiểu → bộ lọc không bị mất khi đổi trang.
- Trace: R-S07-07, R-S07-08

## UC-S07-04: Từ chối truy cập với vai trò Giám sát (ngoại lệ)
- Tác nhân: Giám sát
- Trigger: Người dùng vai trò Giám sát cố mở màn Nhật ký kiểm toán
- Tiền điều kiện: Đã đăng nhập; **vai trò Giám sát**
- Luồng chính:
  1. Giám sát mở (hoặc bị điều hướng tới) màn Nhật ký kiểm toán.
  2. Hệ thống kiểm tra vai trò và xác định không đủ quyền.
  3. Hệ thống **không trả về bất kỳ bản ghi nào**, hiện thông báo từ chối "Bạn không có quyền xem nhật ký kiểm toán".
  4. Người dùng chọn lối về Bản đồ tài sản (S01).
- Luồng thay thế / ngoại lệ:
  - Giám sát không thấy lối vào màn từ S01 (ẩn ngay từ điều hướng) → không tới được bước trên.
- Hậu điều kiện: Không lộ dữ liệu kiểm toán; người dùng quay lại S01.
- Đảm bảo: thành công → chặn hoàn toàn, không rò bản ghi; tối thiểu → luôn có lối quay lại.
- Trace: R-S07-N01, BRule-S07-02

## UC-S07-05: Quay lại Bản đồ tài sản
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng chọn nút quay lại
- Tiền điều kiện: Đang ở màn Nhật ký kiểm toán (hoặc màn từ chối)
- Luồng chính:
  1. Người dùng chọn "← Bản đồ tài sản".
  2. Hệ thống đóng panel và trở về S01 giữ nguyên ngữ cảnh trước đó.
- Luồng thay thế / ngoại lệ: *(không có)*
- Hậu điều kiện: Người dùng ở lại S01.
- Đảm bảo: thành công → về đúng workspace; tối thiểu → không mất ngữ cảnh đang chọn ở S01.
- Trace: R-S07-09
