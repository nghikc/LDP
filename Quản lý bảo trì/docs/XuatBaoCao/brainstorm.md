# Brainstorm — Xuất báo cáo / kiểm kê

## Mục đích màn hình
Cho người dùng (Quản trị và Giám sát) **cấu hình phạm vi** rồi **xuất một file Excel (.xlsx)** danh sách tài sản kèm vị trí, phục vụ **kiểm kê định kỳ** và bàn giao. Đây là modal phụ trợ trượt lên từ màn Bản đồ tài sản (S01) khi bấm nút "Xuất báo cáo"; xuất xong tải file về và đóng lại, trả người dùng về workspace.

## Thành phần & hành vi
- **Nhóm phạm vi xuất** (radio, bắt buộc chọn 1):
  - *Toàn bộ tài sản* → lấy mọi tài sản trong hệ thống.
  - *Theo khu vực đang chọn* → lấy tài sản thuộc nút khu vực đang chọn ở S01; kèm checkbox **"Gồm cả các khu vực con"** (mặc định bật) để lấy thêm tài sản ở các khu con; nếu chưa chọn nút nào ở S01 thì lựa chọn này bị khóa cho tới khi có nút.
  - *Theo bộ lọc hiện tại* → lấy đúng tập tài sản đang được bộ lọc pin trên sơ đồ thu hẹp.
- **Nhóm cột xuất** (checkbox, ít nhất 1): mã tài sản, tên tài sản, đường dẫn khu vực, vị trí, lần di dời gần nhất — mặc định tick hết; người dùng có thể bỏ bớt cột nhưng phải còn ≥ 1.
- **Dải ước tính số dòng** → đếm nhanh số tài sản trong phạm vi đã chọn, cập nhật mỗi khi đổi phạm vi; giúp người dùng biết trước tập lớn hay rỗng.
- **Nút Xuất Excel** → hệ thống dựng file .xlsx theo các cột đã chọn, hiển thị tiến trình nếu tập lớn, rồi đẩy file tải về máy; hiện toast "Đã xuất {n} tài sản".
- **Nút Hủy / [✕]** → đóng modal, fade về S01, không xuất.

## Trạng thái & edge case
- **Loading:** đang dựng file (tập rất lớn tới 50.000 dòng) → thanh tiến trình + số dòng đã xử lý + nút Hủy.
- **Rỗng:** phạm vi đã chọn không có tài sản nào → "Không có dữ liệu để xuất", chặn nút Xuất, gợi ý đổi phạm vi.
- **Lỗi:** dựng/tải file thất bại (mất mạng, lỗi máy chủ) → thông báo lỗi + nút Thử lại, không tải file dở dang.
- **Không có quyền:** không áp dụng — cả Quản trị và Giám sát đều xuất được (BRule-S08).
- **"Lần di dời gần nhất" rỗng:** tài sản chưa từng di dời → ô để trống, không báo lỗi.

## Câu hỏi mở
- *(Không còn — định dạng & cột báo cáo đã chốt ở GĐ-R1: Excel .xlsx gồm mã tài sản, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất.)*
