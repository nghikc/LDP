# Use case — Xuất báo cáo / kiểm kê

## UC-S08-01: Xuất báo cáo toàn bộ tài sản
- Tác nhân (actor): Quản trị, Giám sát
- Trigger (kích hoạt): Người dùng bấm "Xuất báo cáo" ở S01 và chọn phạm vi "Toàn bộ tài sản"
- Tiền điều kiện: Đã đăng nhập; hệ thống có ít nhất một tài sản
- Luồng chính (happy path):
  1. Người dùng mở modal Xuất báo cáo từ workspace (S01).
  2. Người dùng chọn phạm vi "Toàn bộ tài sản".
  3. Hệ thống ước tính và hiển thị số tài sản trong phạm vi.
  4. Người dùng giữ nguyên hoặc điều chỉnh các cột (mặc định tick hết 5 cột), rồi bấm "Xuất Excel".
  5. Hệ thống dựng file .xlsx, tải về máy và hiện toast "Đã xuất {n} tài sản".
- Luồng thay thế / ngoại lệ:
  - Hệ thống không có tài sản nào → hiện "Không có dữ liệu để xuất", chặn nút Xuất.
  - Người dùng bỏ tick hết cột → báo "Chọn ít nhất một cột" và chặn xuất.
  - Tập rất lớn (tới 50.000 dòng) → hiện thanh tiến trình + nút Hủy.
  - Dựng/tải file lỗi → thông báo lỗi + nút Thử lại, không tải file dở.
- Hậu điều kiện (postcondition): File báo cáo .xlsx được tải về máy người dùng.
- Đảm bảo (guarantees): thành công → file đầy đủ tài sản trong phạm vi; tối thiểu → không tạo file dở khi hủy/lỗi.
- Trace: R-S08-01, R-S08-03, R-S08-05

## UC-S08-02: Xuất báo cáo theo khu vực (gồm khu con)
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng chọn phạm vi "Theo khu vực đang chọn"
- Tiền điều kiện: Ở S01 đã chọn một nút khu vực
- Luồng chính:
  1. Người dùng mở modal Xuất báo cáo.
  2. Chọn phạm vi "Theo khu vực đang chọn" → hiện breadcrumb nút đang chọn.
  3. Giữ bật checkbox "Gồm cả các khu vực con" (mặc định) để lấy thêm tài sản ở các khu con.
  4. Hệ thống ước tính số tài sản trong nhánh.
  5. Người dùng bấm "Xuất Excel" → hệ thống xuất file .xlsx của nhánh khu vực.
- Luồng thay thế / ngoại lệ:
  - Chưa chọn nút khu vực ở S01 → lựa chọn bị khóa; báo "Hãy chọn một khu vực trước khi xuất theo khu vực".
  - Tắt "Gồm khu vực con" → chỉ xuất tài sản đặt trực tiếp tại nút.
  - Nhánh không có tài sản → "Không có dữ liệu để xuất".
- Hậu điều kiện: File .xlsx chứa tài sản của nút (và nhánh con nếu bật) được tải về.
- Đảm bảo: thành công → phạm vi đúng nhánh khu vực; tối thiểu → không xuất khi phạm vi rỗng.
- Trace: R-S08-01, R-S08-02, R-S08-05

## UC-S08-03: Xuất báo cáo theo bộ lọc hiện tại
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng chọn phạm vi "Theo bộ lọc hiện tại trên sơ đồ"
- Tiền điều kiện: Ở S01 đang áp một bộ lọc pin
- Luồng chính:
  1. Người dùng mở modal Xuất báo cáo.
  2. Chọn phạm vi "Theo bộ lọc hiện tại" → phạm vi lấy đúng tập tài sản đang được lọc.
  3. Hệ thống ước tính số tài sản khớp bộ lọc.
  4. Người dùng bấm "Xuất Excel" → xuất file .xlsx của tập đã lọc.
- Luồng thay thế / ngoại lệ:
  - Bộ lọc không khớp tài sản nào → "Không có dữ liệu để xuất".
- Hậu điều kiện: File .xlsx chứa tài sản khớp bộ lọc được tải về.
- Đảm bảo: thành công → phạm vi đúng tập đã lọc; tối thiểu → không xuất khi rỗng.
- Trace: R-S08-01, R-S08-05

## UC-S08-04: Chọn cột xuất
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng tick/bỏ tick các cột trong nhóm "Cột xuất"
- Tiền điều kiện: Modal Xuất báo cáo đang mở
- Luồng chính:
  1. Người dùng bỏ tick một số cột không cần (vd bỏ "Lần di dời gần nhất").
  2. Hệ thống giữ thứ tự các cột còn lại theo chuẩn cố định.
  3. Người dùng bấm "Xuất Excel" → file chỉ có các cột đã chọn.
- Luồng thay thế / ngoại lệ:
  - Bỏ tick hết → báo "Chọn ít nhất một cột" và chặn xuất.
- Hậu điều kiện: File .xlsx chỉ chứa các cột người dùng chọn, đúng thứ tự chuẩn.
- Đảm bảo: thành công → cột đúng lựa chọn; tối thiểu → luôn còn ≥ 1 cột.
- Trace: R-S08-03

## UC-S08-05: Xuất tập lớn với tiến trình
- Tác nhân: Quản trị, Giám sát
- Trigger: Người dùng bấm "Xuất Excel" với phạm vi nhiều dòng (tới 50.000)
- Tiền điều kiện: Phạm vi đã chọn có số tài sản lớn
- Luồng chính:
  1. Hệ thống bắt đầu dựng file theo khối, hiện thanh tiến trình + số dòng đã xử lý.
  2. Khi hoàn tất, file .xlsx được tải về + toast "Đã xuất {n} tài sản".
- Luồng thay thế / ngoại lệ:
  - Người dùng bấm Hủy giữa chừng → dừng dựng file, không tải file dở, về màn cấu hình.
  - Mất mạng/lỗi máy chủ → thông báo lỗi + nút Thử lại.
- Hậu điều kiện: File đầy đủ được tải về, hoặc không có file nào nếu hủy/lỗi.
- Đảm bảo: thành công → file đủ tới 50.000 dòng, giao diện không treo; tối thiểu → hủy không để lại file dở.
- Trace: R-S08-06, R-S08-N01, R-S08-N03
