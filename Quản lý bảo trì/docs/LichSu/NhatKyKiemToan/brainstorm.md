# Brainstorm — Nhật ký kiểm toán

## Mục đích màn hình
Là **màn truy vết (audit trail)** của phân hệ Quản lý vị trí tài sản. Người dùng đến đây để **tra cứu, lọc và đọc** các bản ghi nhật ký kiểm toán — log mọi thao tác **gán / di dời / xóa** đã diễn ra trong hệ thống. Mỗi bản ghi trả lời "ai – làm gì – với đối tượng nào – khi nào – vị trí cũ→mới". Màn phục vụ kiểm soát nội bộ, điều tra sự cố, đối soát khi dữ liệu lệch thực tế.

Việc **ghi** log là tự động ở nền (F18, không có giao diện). Màn này (F19) **chỉ đọc**: không tạo, không sửa, không xóa bản ghi. Đây là dữ liệu **append-only** (chỉ thêm), bất biến.

**Chỉ vai trò Quản trị** truy cập được. Giám sát bị từ chối — vì đây là dữ liệu truy vết/kiểm soát, không phải dữ liệu vận hành thường ngày.

Vào từ **Bản đồ tài sản (S01)** qua điều hướng (panel slide-left). Ra: slide-right về S01.

## Thành phần & hành vi
- **Panel bộ lọc** (trên cùng):
  - **Người thực hiện** → dropdown chọn một người dùng đã từng thao tác (mặc định "Tất cả").
  - **Hành động** → dropdown chọn loại thao tác: Gán / Di dời / Xóa (mặc định "Tất cả").
  - **Khoảng thời gian** → Từ ngày / Đến ngày; ràng buộc **Từ ≤ Đến** (báo lỗi nếu Từ > Đến).
  - **Đối tượng** → ô nhập mã/tên tài sản hoặc tên nút khu vực, khớp một phần, **≤ 100 ký tự**.
  - **[Áp dụng lọc]** → nạp lại bảng theo điều kiện; **[Xóa lọc]** → đưa mọi điều kiện về mặc định.
- **Bảng bản ghi** (chỉ đọc): mỗi dòng = một thao tác. Cột: **Thời điểm · Người thực hiện · Hành động · Đối tượng · Vị trí cũ → mới**.
  - Cột Thời điểm sắp xếp tăng/giảm (mặc định mới nhất trước).
  - Thao tác **gán/di dời** điền vị trí cũ→mới; thao tác **xóa** để "—".
- **Phân trang** → khi kết quả nhiều, chia trang; hiển thị tổng số bản ghi.
- **Nút quay lại** → đóng panel, slide-right về S01.

## Trạng thái & edge case
- **Loading:** đang tải/lọc bản ghi → skeleton hàng bảng.
- **Rỗng:** lọc không khớp bản ghi nào → "Không có bản ghi phù hợp" + gợi ý nới điều kiện.
- **Lỗi:** tải nhật ký thất bại → thông báo "Không tải được nhật ký" + nút thử lại.
- **Không có quyền:** vai trò **Giám sát** mở màn → chặn, hiện "Bạn không có quyền xem nhật ký kiểm toán" + lối về S01 (không hiển thị bất kỳ bản ghi nào).
- **Kết quả rất nhiều:** hàng nghìn bản ghi → phân trang (mặc định 25 dòng/trang), không tải hết một lần.
- **Lọc sai khoảng:** Từ > Đến → báo lỗi inline tại trường ngày, chặn áp dụng.

## Câu hỏi mở
- *(Không còn — phạm vi đã chốt ở requirements: log mọi thao tác gán/di dời/xóa, append-only bất biến, chỉ Quản trị xem, NFR-03 quy định nội dung bản ghi đầy đủ người·hành động·đối tượng·thời gian·vị trí cũ→mới.)*
