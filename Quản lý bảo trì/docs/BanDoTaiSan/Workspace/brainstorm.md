# Brainstorm — Bản đồ tài sản (Workspace)

## Mục đích màn hình
Là **màn trung tâm (hub)** của phân hệ Quản lý vị trí tài sản. Người dùng đến đây để: duyệt **cây khu vực**, mở **sơ đồ mặt bằng** của một khu vực, nhìn thấy **pin tài sản** trên sơ đồ, **tra cứu nhanh** một tài sản (nhảy tới + làm nổi pin), **gán vị trí** (click sơ đồ → chọn tài sản), **gỡ vị trí**, **di chuyển nút** trong cây và **xóa nút**. Là điểm xuất phát điều hướng tới các màn vệ tinh (Form khu vực, Quản lý ảnh sơ đồ, Di dời, Pin cần đặt lại, Lịch sử, Nhật ký, Báo cáo).

## Thành phần & hành vi
- **Ô tra cứu nhanh** (trên cùng) → gõ mã/tên (khớp một phần, không phân biệt dấu) → chọn kết quả → tự chọn nút khu vực chứa tài sản, mở sơ đồ, **làm nổi (highlight) pin** + hiện đường dẫn khu vực (breadcrumb).
- **Cây khu vực** (cột trái) → click nút → mở sơ đồ của nút đó ở khung giữa; mở/đóng nhánh; **kéo-thả nút** sang nhánh khác (chặn thả vào chính nhánh con của nó); menu ngữ cảnh: Thêm con / Sửa (→ S02) / Xóa (dialog) / Quản lý ảnh sơ đồ (→ S03).
- **Khung sơ đồ mặt bằng** (giữa) → hiển thị ảnh + pin; zoom/pan; **click điểm trống** → mở ô chọn tài sản để **gán vị trí** (F11); click pin → popup chi tiết (mã, tên, trạng thái, link Lịch sử) + nút Gỡ vị trí / Di dời; **gom cụm pin** khi > 500 điểm.
- **Thanh công cụ sơ đồ** → bộ lọc pin, nút Di dời hàng loạt (→ S04), nút Xuất báo cáo (→ S08), chỉ báo "có N pin cần đặt lại" (→ S05).
- **Breadcrumb đường dẫn khu vực** (trên khung sơ đồ) → thể hiện vị trí nút đang chọn trong cây.

## Trạng thái & edge case
- **Loading:** đang tải cây / đang tải ảnh sơ đồ → skeleton.
- **Rỗng:** chưa có khu vực nào (cây trống) → gợi ý tạo khu vực đầu tiên; nút có nhưng **chưa gắn sơ đồ** → khung giữa hiện trạng thái "Chưa có sơ đồ, tải lên".
- **Lỗi:** tải ảnh thất bại → thông báo + nút thử lại.
- **Không có quyền:** vai trò Giám sát không thấy menu Thêm/Sửa/Xóa nút và không tải/thay/xóa ảnh (vẫn gán/di dời/tra cứu được).
- **Khóa:** tài sản đang bị người khác di dời → pin hiển thị trạng thái khóa, thao tác gán/gỡ/di dời báo "đang được người khác chỉnh sửa".
- **Pin cần đặt lại:** sau khi thay ảnh, pin tràn ngoài vùng → đánh dấu, đếm số lượng, dẫn sang S05.

## Câu hỏi mở
- *(Không còn — các điểm mơ hồ đã chốt ở brainstorm/requirements: clustering > 500, tra cứu không dấu, khóa 5 phút, xóa nút gỡ vị trí.)*
