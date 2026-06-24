# Use case — Bản đồ tài sản (Workspace)

## UC-S01-01: Tra cứu nhanh vị trí tài sản
- Tác nhân (actor): Quản trị, Giám sát
- Trigger (kích hoạt): Người dùng gõ mã/tên vào ô tra cứu
- Tiền điều kiện: Đã đăng nhập; tài sản tồn tại trong hệ thống
- Luồng chính (happy path):
  1. Người dùng gõ ≥1 ký tự mã/tên tài sản.
  2. Hệ thống trả gợi ý khớp một phần, không phân biệt dấu (< 1s).
  3. Người dùng chọn một tài sản trong gợi ý.
  4. Hệ thống tự chọn nút khu vực chứa tài sản, mở sơ đồ, làm nổi (highlight) pin và hiện breadcrumb đường dẫn.
- Luồng thay thế / ngoại lệ:
  - Không có kết quả → hiện "Không tìm thấy tài sản".
  - Tài sản chưa có vị trí → hiện đường dẫn "Chưa gán vị trí", không mở sơ đồ.
- Hậu điều kiện (postcondition): Sơ đồ mở đúng khu vực, pin được làm nổi.
- Đảm bảo (guarantees): thành công → người dùng thấy vị trí; tối thiểu → luôn có phản hồi (kết quả hoặc thông báo trống).
- Trace: R-S01-03

## UC-S01-02: Gán vị trí cho tài sản
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng click vào điểm trống trên sơ đồ
- Tiền điều kiện: Nút khu vực đang chọn đã có ảnh sơ đồ; tồn tại tài sản chưa có vị trí
- Luồng chính:
  1. Người dùng click điểm trống trên sơ đồ.
  2. Hệ thống tạo pin tạm, mở ô tìm chỉ liệt kê tài sản chưa có vị trí.
  3. Người dùng chọn một tài sản và xác nhận.
  4. Hệ thống tạo pin tại tọa độ click, ghi nhật ký kiểm toán, hiện toast "Đã gán vị trí cho tài sản".
- Luồng thay thế / ngoại lệ:
  - Người dùng hủy → xóa pin tạm.
  - Tài sản vừa bị người khác gán/khóa → báo "Tài sản đang được người khác chỉnh sửa".
  - Nút chưa có sơ đồ → ẩn thao tác gán, gợi ý tải ảnh (→ S03).
- Hậu điều kiện: Tài sản chuyển trạng thái "đã có vị trí", pin hiển thị trên sơ đồ.
- Đảm bảo: thành công → pin lưu + nhật ký; tối thiểu → không tạo pin nếu chưa xác nhận.
- Trace: R-S01-06

## UC-S01-03: Gỡ vị trí tài sản
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng mở popup pin và chọn Gỡ vị trí
- Tiền điều kiện: Tài sản đang có vị trí; không bị người khác khóa
- Luồng chính:
  1. Người dùng click pin → popup chi tiết.
  2. Chọn Gỡ vị trí → dialog xác nhận.
  3. Xác nhận → hệ thống xóa pin, đưa tài sản về "chưa có vị trí", ghi nhật ký kiểm toán.
- Luồng thay thế / ngoại lệ:
  - Tài sản bị khóa → báo "Tài sản đang được người khác chỉnh sửa".
  - Người dùng hủy → giữ nguyên.
- Hậu điều kiện: Pin biến mất; tài sản "chưa có vị trí".
- Đảm bảo: thành công → gỡ + nhật ký; tối thiểu → không đổi nếu chưa xác nhận.
- Trace: R-S01-07

## UC-S01-04: Di chuyển nút khu vực trong cây
- Tác nhân: Quản trị
- Trigger: Người dùng kéo một nút sang nhánh khác
- Tiền điều kiện: Là vai trò Quản trị
- Luồng chính:
  1. Người dùng kéo nút và thả vào một nút cha mới.
  2. Hệ thống kiểm tra hợp lệ và cập nhật quan hệ cha-con.
  3. Cây render lại theo cấu trúc mới.
- Luồng thay thế / ngoại lệ:
  - Thả vào chính nó hoặc nhánh con của nó → chặn, báo "Không thể di chuyển khu vực vào chính nhánh con của nó".
  - Vai trò Giám sát → không có thao tác kéo-thả.
- Hậu điều kiện: Nút thuộc nhánh mới.
- Đảm bảo: thành công → cấu trúc cập nhật; tối thiểu → cây không hỏng khi thao tác bị chặn.
- Trace: R-S01-08

## UC-S01-05: Xóa nút khu vực
- Tác nhân: Quản trị
- Trigger: Người dùng chọn Xóa trên một nút
- Tiền điều kiện: Là vai trò Quản trị
- Luồng chính:
  1. Người dùng chọn Xóa.
  2. Hệ thống đếm số tài sản bên trong + số khu con, hiện dialog cảnh báo.
  3. Người dùng xác nhận.
  4. Hệ thống xóa nhánh, gỡ vị trí tài sản về "chưa có vị trí" (không xóa hồ sơ), ghi nhật ký kiểm toán.
- Luồng thay thế / ngoại lệ:
  - Người dùng hủy → giữ nguyên.
- Hậu điều kiện: Nhánh bị xóa; tài sản bên trong "chưa có vị trí".
- Đảm bảo: thành công → xóa + nhật ký; tối thiểu → không xóa nếu chưa xác nhận.
- Trace: R-S01-09

## UC-S01-06: Duyệt cây & xem sơ đồ mặt bằng
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng click một nút khu vực
- Tiền điều kiện: Đã đăng nhập; có ít nhất một khu vực
- Luồng chính:
  1. Người dùng mở/đóng nhánh và click một nút.
  2. Hệ thống mở sơ đồ của nút + hiển thị pin (gom cụm nếu > 500), hiện breadcrumb.
- Luồng thay thế / ngoại lệ:
  - Nút chưa có ảnh → hiện "Chưa có sơ đồ" + CTA tải ảnh (Quản trị).
  - Cây trống → CTA tạo khu vực đầu tiên.
- Hậu điều kiện: Sơ đồ + pin của nút hiển thị.
- Đảm bảo: thành công → sơ đồ hiển thị < 2s; tối thiểu → trạng thái rỗng/lỗi rõ ràng.
- Trace: R-S01-01, R-S01-02, R-S01-04, R-S01-05

## UC-S01-07: Gán nhiều tài sản vào một vị trí
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng click một điểm trống trên sơ đồ (hoặc bấm "+ Gán thêm tài sản vào vị trí này" trong popup vị trí)
- Tiền điều kiện: Nút khu vực đang chọn đã có ảnh sơ đồ; tồn tại ≥1 tài sản chưa có vị trí
- Luồng chính:
  1. Người dùng click điểm trống → mở ô gán đa chọn (trường "Tên vị trí (tùy chọn)", ô tìm, danh sách checkbox tài sản chưa có vị trí).
  2. (Tùy chọn) Người dùng gõ ô tìm (mã/tên, không dấu) → danh sách thu hẹp; hiển thị tối đa 50 dòng; dòng đếm "N kết quả · Đã chọn M".
  3. Người dùng tích chọn ≥1 tài sản (M tăng); (tùy chọn) nhập Tên vị trí.
  4. Người dùng bấm "Gán vị trí (M)".
  5. Hệ thống tạo M pin tại cùng tọa độ click, ghi nhật ký kiểm toán mỗi tài sản, lưu tên vị trí (nếu có), hiện toast "Đã gán vị trí cho M tài sản".
- Luồng thay thế / ngoại lệ:
  - Chưa chọn tài sản nào (M=0) → nút "Gán vị trí" disable.
  - Ô tìm không khớp → "Không tìm thấy tài sản phù hợp".
  - Không còn tài sản chưa có vị trí → ô gán hiện "Không còn tài sản chưa có vị trí.".
  - Một số tài sản vừa bị người khác khóa → chỉ gán được phần hợp lệ; nếu không gán được cái nào → báo "Tài sản đang được người khác chỉnh sửa".
  - Người dùng hủy → đóng ô, không tạo pin.
- Hậu điều kiện: M tài sản về trạng thái "đã có vị trí" tại cùng một vị trí; marker hiển thị "M tài sản" (hoặc tên vị trí).
- Đảm bảo: thành công → M pin lưu + M bản ghi nhật ký; tối thiểu → không tạo pin nếu chưa xác nhận / không chọn.
- Trace: R-S01-12, R-S01-14, BRule-S01-07

## UC-S01-08: Đặt/đổi tên vị trí
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng nhập "Tên vị trí" trong ô gán, hoặc mở popup vị trí và sửa tên
- Tiền điều kiện: Đang gán vị trí (luồng UC-S01-07) hoặc vị trí đã tồn tại (có ≥1 tài sản)
- Luồng chính:
  1. Người dùng nhập tên vào ô "Tên vị trí" (khi gán) hoặc ô tên trong popup vị trí.
  2. Người dùng xác nhận (gán xong / bấm "Lưu tên").
  3. Hệ thống lưu tên theo cặp (nút + tọa độ); marker hiển thị tên; toast "Đã đặt tên vị trí".
- Luồng thay thế / ngoại lệ:
  - Để trống và "Lưu tên" → xóa tên; marker trở về nhãn mặc định (mã / "N tài sản"); toast "Đã xóa tên vị trí".
- Hậu điều kiện: Tên vị trí được lưu/xóa; nhãn marker cập nhật.
- Đảm bảo: thành công → tên gắn đúng vị trí, không lẫn vị trí khác; tối thiểu → không đổi nếu không lưu.
- Trace: R-S01-14, BRule-S01-09

## UC-S01-09: Kéo-thả marker dời vị trí trong cùng sơ đồ
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng giữ và kéo một marker trên sơ đồ
- Tiền điều kiện: Sơ đồ đang mở; marker tồn tại
- Luồng chính:
  1. Người dùng nhấn giữ trên marker (chuột nút trái hoặc chạm).
  2. Người dùng kéo con trỏ; hệ thống dịch marker theo (dùng Pointer Events).
  3. Người dùng thả; nếu đã dịch > 0,5% → hệ thống cập nhật tọa độ % cho **mọi tài sản tại vị trí đó**; tên vị trí đi theo. Thao tác này **không** sinh lịch sử di chuyển.
- Luồng thay thế / ngoại lệ:
  - Dịch ≤ 0,5% (xem là click) → mở popup danh sách tài sản tại vị trí, không dời.
  - pointercancel (rời vùng/cử chỉ bị hủy) → hủy kéo, giữ tọa độ cũ.
- Hậu điều kiện: Mọi tài sản tại vị trí đó mang tọa độ mới; không có bản ghi lịch sử.
- Đảm bảo: thành công → tọa độ + tên đồng bộ tại vị trí mới; tối thiểu → phân biệt rõ click với kéo, không tạo lịch sử nhầm.
- Trace: R-S01-15, BRule-S01-08, BRule-S01-09

## UC-S01-10: Tìm/lọc cây khu vực theo tên/mã
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng gõ vào ô "Tìm khu vực theo tên/mã..." hoặc bấm "Bung tất cả"/"Thu gọn"
- Tiền điều kiện: Cây khu vực có ≥1 nút
- Luồng chính:
  1. Người dùng gõ từ khóa (tên/mã, không dấu).
  2. Hệ thống chỉ hiển thị nhánh khớp + toàn bộ tổ tiên của chúng, tự bung các nhánh này.
  3. Người dùng chọn một nút trong kết quả → mở sơ đồ.
- Luồng thay thế / ngoại lệ:
  - Không khớp → cây trống nhánh; người dùng bấm "✕ Xóa lọc" để khôi phục.
  - Bấm "Bung tất cả" → mở mọi nhánh; "Thu gọn" → đóng hết (cây mặc định thu gọn).
- Hậu điều kiện: Cây hiển thị đúng nhánh theo bộ lọc / trạng thái bung-thu.
- Đảm bảo: thành công → định vị nhanh nút cần tìm; tối thiểu → luôn khôi phục được cây đầy đủ.
- Trace: R-S01-17, R-S01-18
