# Brainstorm — Lịch sử di chuyển tài sản

## Mục đích màn hình
Là panel **chỉ đọc** cho phép người dùng (Quản trị hoặc Giám sát) xem **toàn bộ chuỗi di chuyển của MỘT tài sản** theo thứ tự thời gian: tài sản đã từng ở đâu, được chuyển tới đâu, ai làm, lúc nào, vì lý do gì. Mục đích là **truy vết & minh bạch** vị trí — phục vụ kiểm kê, bàn giao, đối soát khi vị trí thực tế lệch sổ sách. Panel mở slide-left từ màn Bản đồ tài sản (S01): từ **popup pin → "Xem lịch sử"** hoặc từ **kết quả tra cứu** một tài sản. Đây là điểm "đọc cuối" của một bản ghi lịch sử — không tạo, không sửa, không xóa.

## Thành phần & hành vi
- **Header panel** → hiển thị mã + tên tài sản đang xem; nút ← / ✕ đóng panel (slide-right) về S01, giữ nguyên ngữ cảnh sơ đồ/pin trước đó.
- **Bộ lọc khoảng thời gian** → hai trường Từ ngày / Đến ngày; nhấn [Áp dụng] → lọc các bản ghi có thời điểm nằm trong khoảng; [Xóa lọc] → trở về toàn bộ lịch sử. Ràng buộc: **Từ ngày ≤ Đến ngày**, nếu vi phạm báo lỗi inline, không gọi tải.
- **Timeline (chỉ đọc)** → mỗi bản ghi là một mốc thời gian, sắp xếp **mới nhất trên cùng**: thời điểm · người thực hiện; dòng "vị trí cũ → vị trí mới" thể hiện **đường dẫn khu vực đầy đủ** (breadcrumb) của cả hai đầu; lý do (nếu có), ngược lại "(Không có lý do)".
- **Bản ghi đầu đời** → lần gán vị trí đầu tiên: vị trí cũ là "(Chưa có vị trí)".
- **Chân danh sách / tải thêm** → khi lịch sử rất dài, dùng phân trang / cuộn vô hạn để giữ hiệu năng; báo "— Đã hiển thị hết lịch sử —" khi hết.

## Trạng thái & edge case
- **Loading:** đang tải chuỗi lịch sử → skeleton các dòng timeline.
- **Rỗng:** tài sản chưa từng di chuyển → "Tài sản chưa có lần di chuyển nào."
- **Rỗng sau lọc:** có lịch sử nhưng khoảng thời gian chọn không có bản ghi → "Không có lần di chuyển nào trong khoảng đã chọn." + gợi ý [Xóa lọc].
- **Lỗi:** tải lịch sử thất bại → thông báo "Không tải được lịch sử" + nút "Thử lại".
- **Lý do trống:** bản ghi không có lý do (lý do là tùy chọn khi di dời) → hiển thị "(Không có lý do)".
- **Đường dẫn quá dài:** breadcrumb khu vực dài → cắt "..." + tooltip khi hover.
- **Lịch sử rất dài:** một tài sản di chuyển hàng trăm lần → phân trang/cuộn, không tải hết một lần (giữ hiệu năng).
- **Quyền:** cả Quản trị và Giám sát đều xem được; không vai trò nào sửa/xóa được bản ghi.

## Câu hỏi mở
- *(Không còn — các điểm đã chốt ở requirements: lịch sử bất biến/append-only (BRule-01, BRule-02, ma trận CRUD F17), lý do tùy chọn (BRule-08), cả hai vai trò xem được (FR-07/FR-09). Bộ lọc theo khoảng thời gian là tinh chỉnh UX của riêng màn, không phát sinh giả định nghiệp vụ mới.)*
