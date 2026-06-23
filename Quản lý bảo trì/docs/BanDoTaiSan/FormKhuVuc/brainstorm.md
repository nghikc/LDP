# Brainstorm — Form khu vực (Tạo/Sửa nút)

## Mục đích màn hình
Là **modal nhập liệu** để **Quản trị** tạo mới hoặc chỉnh sửa một **nút khu vực** trong cây khu vực. Modal trượt lên (slide-up) từ màn **Bản đồ tài sản (S01 — Workspace)**. Người dùng đến đây để: đặt **Tên khu vực** (bắt buộc), gán **Mã khu vực** và **Loại khu vực** (tùy chọn), và chọn **Nút cha** để quyết định khu vực mới/được sửa nằm ở đâu trong cây (để trống = nút gốc). Đây là điểm vào duy nhất cho hai chức năng F01 (Tạo) và F02 (Sửa) — cả hai **dùng chung một form**, chỉ khác chế độ.

## Thành phần & hành vi
- **Tiêu đề modal** → đổi theo chế độ: "Thêm khu vực" (Tạo) / "Sửa khu vực" (Sửa). Có nút đóng (×).
- **Trường Tên khu vực** (bắt buộc) → nhập chuỗi; rỗng hoặc chỉ khoảng trắng → chặn lưu, báo lỗi inline ngay dưới trường.
- **Trường Mã khu vực** (tùy chọn) → nhập chuỗi định danh ngắn; nếu nhập, phải **duy nhất** trong toàn cây; trùng → báo lỗi.
- **Trường Loại khu vực** (tùy chọn) → chọn từ danh mục (vd Site / Tòa / Tầng / Phòng / Khu); cho phép để trống.
- **Trường Nút cha** (tùy chọn) → chọn một nút trong cây khu vực qua dropdown/cây thu gọn; để trống = tạo nút **gốc**. Khi **Sửa**, danh sách nút cha **loại trừ chính nút đang sửa và toàn bộ nhánh con của nó** (chống tạo cây lặp).
- **Nút Lưu** (CTA chính) → kiểm tra hợp lệ; hợp lệ → tạo/cập nhật nút, đóng modal (fade), cây ở S01 cập nhật và bật nhánh chứa nút vừa lưu.
- **Nút Hủy / × / nhấn nền tối (overlay)** → đóng modal không lưu; nếu đã sửa dữ liệu → hỏi xác nhận bỏ thay đổi.

## Trạng thái & edge case
- **Loading:** chế độ Sửa cần nạp dữ liệu nút hiện có vào form → skeleton/ô mờ ngắn; danh sách Nút cha và Loại khu vực đang tải → placeholder.
- **Rỗng:** chế độ Tạo mở với form trắng; nếu cây chưa có nút nào → trường Nút cha chỉ có lựa chọn "(Gốc — không có nút cha)".
- **Lỗi:** Tên rỗng → "Vui lòng nhập tên khu vực"; Mã trùng → "Mã khu vực đã tồn tại"; chọn nút cha không hợp lệ (chính nó/nhánh con) → "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó"; lưu thất bại do mạng → snackbar giữ dữ liệu đã nhập.
- **Không có quyền:** vai trò **Giám sát** không có lối vào màn này (S01 ẩn nút "+ Thêm khu vực" và menu "Sửa"); nếu cố truy cập trực tiếp → từ chối.
- **Đồng thời:** nút đang Sửa vừa bị người khác xóa → khi lưu báo "Khu vực không còn tồn tại" và đóng form.

## Câu hỏi mở
- *(Không còn — quy tắc đã chốt ở requirements: Tên bắt buộc (BRule-10), chặn cây lặp (BRule-06), chỉ Quản trị quản cấu trúc (BRule-09). Đề xuất ràng buộc cụ thể: Tên 1–150 ký tự, Mã ≤ 50 ký tự & duy nhất, Loại từ danh mục — chờ BA xác nhận.)*
