# Brainstorm — Di dời tài sản (đơn & hàng loạt)

## Mục đích màn hình
Là **form di dời** (modal trượt lên từ Bản đồ tài sản — S01) để người dùng đổi vị trí của tài sản **đã có vị trí** sang một khu vực/vị trí **đích** mới. Phục vụ cả hai tình huống:
- **Di dời đơn:** đổi vị trí cho **một** tài sản (vào từ popup pin của tài sản đó trên S01).
- **Di dời hàng loạt:** đổi vị trí cho **nhiều** tài sản cùng lúc, tất cả về **cùng một đích** (vào từ nút "Di dời hàng loạt" trên S01). Người dùng chọn nguồn theo một trong hai cách: tick **nhiều tài sản lẻ**, hoặc **chọn cả vị trí cũ** để lấy hết tài sản trong nút đó (vì một vị trí thường chứa nhiều tài sản).

Mỗi lần di dời sinh một bản ghi **lịch sử di chuyển** (vị trí cũ → mới) và một bản ghi **nhật ký kiểm toán**. Cả vai trò **Quản trị** và **Giám sát** đều dùng được.

## Thành phần & hành vi
- **Bước 1 — Chọn tài sản nguồn:**
  - Cách (a) *Chọn tài sản lẻ* → ô tìm mã/tên (chỉ liệt kê tài sản **đã có vị trí**), tick chọn nhiều.
  - Cách (b) *Chọn cả vị trí cũ (lấy hết)* → chọn một nút khu vực nguồn → hệ thống nạp **toàn bộ** tài sản trong nút đó vào lô.
  - Tài sản **đang bị khóa** (người khác đang sửa) hiện icon khóa, không tick được.
  - Khi vào từ popup pin (di dời đơn) → Bước 1 khóa sẵn đúng 1 tài sản, ẩn bộ chọn cách lấy.
- **Bước 2 — Vị trí đích (bắt buộc):** chọn đúng **một** nút khu vực đích trên cây rút gọn / ô tìm. Tất cả tài sản trong lô về cùng đích này (**BRule-07**).
- **Lý do di dời (tùy chọn):** ô nhập văn bản, tối đa 500 ký tự.
- **Người thực hiện + thời điểm:** hệ thống **tự ghi**, người dùng không nhập.
- **Nút Di dời (N):** ghi kèm số tài sản; chỉ bật khi đã chọn ≥1 tài sản hợp lệ **và** đã chọn đích.
- **Khi ghi lô:** hiện thanh tiến trình; xử lý **all-or-nothing** — nếu gián đoạn (mất mạng) thì **rollback toàn bộ lô** (**GĐ-R4**).

## Trạng thái & edge case
- **Loading:** đang nạp danh sách tài sản / đang nạp tài sản của vị trí cũ → skeleton; đang ghi lô → thanh tiến trình "Đang di dời N tài sản...".
- **Rỗng:** vị trí cũ được chọn không có tài sản nào → báo "Vị trí này không có tài sản để di dời".
- **Lỗi validation:** chưa chọn đích → "Vui lòng chọn khu vực đích."; chưa chọn tài sản → nút Di dời tắt; lý do quá 500 ký tự → chặn nhập thêm.
- **Khóa đồng thời (BRule-05 / NFR-05):** khi bắt đầu di dời, hệ thống **khóa** mọi tài sản trong lô (tự mở sau 5 phút không thao tác). Tài sản đã bị người khác khóa → hiện icon khóa, loại khỏi lô; nếu lô có tài sản bị khóa → hỏi "Bỏ qua và tiếp tục với phần còn lại?".
- **Gián đoạn giữa chừng (GĐ-R4):** mất mạng/đóng trình duyệt khi đang ghi lô → **rollback toàn bộ**, không tài sản nào bị đổi vị trí nửa vời; snackbar "Mất kết nối, đã hoàn tác toàn bộ. Vui lòng thử lại."
- **Không có quyền:** không áp dụng — cả Quản trị và Giám sát đều di dời được.

## Câu hỏi mở
- *(Không còn — các điểm mơ hồ đã chốt ở requirements: rollback all-or-nothing GĐ-R4, khóa 5 phút BRule-05/NFR-05, đích bắt buộc + lý do tùy chọn BRule-08, cùng một đích BRule-07.)*
