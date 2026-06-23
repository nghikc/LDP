# Brainstorm — Quản lý ảnh sơ đồ mặt bằng

## Mục đích màn hình
Là **modal trượt lên (slide-up)** gắn với một **nút khu vực đang chọn** ở Bản đồ tài sản (S01). Người dùng (vai trò **Quản trị**) đến đây để quản lý **một ảnh sơ đồ mặt bằng** của nút đó: **tải lên** ảnh lần đầu (F06), **thay** ảnh hiện có bằng ảnh khác (F07), hoặc **xóa** ảnh khỏi nút (F08). Sơ đồ mặt bằng là nền để đính pin tài sản ở S01; vì vậy mọi thao tác đổi/xóa ảnh đều ảnh hưởng tới các pin đang đặt và phải được cảnh báo rõ.

Nguyên tắc cốt lõi: **mỗi nút khu vực có tối đa 1 sơ đồ**; ảnh chỉ chấp nhận **PNG/JPG ≤ 10 MB**; khi **thay** ảnh thì **giữ nguyên tọa độ tương đối (%)** của pin hiện có, pin tràn ngoài vùng ảnh mới bị đánh dấu **"cần đặt lại vị trí"**.

## Thành phần & hành vi
- **Vùng kéo-thả tải ảnh** (khi nút chưa có sơ đồ) → kéo file ảnh vào hoặc bấm "Chọn ảnh từ máy" → kiểm tra định dạng & dung lượng → tải lên, gắn ảnh cho nút, đóng modal về S01 (F06).
- **Khung xem trước ảnh hiện tại** (khi nút đã có sơ đồ) → hiển thị ảnh, tên file, dung lượng, kích thước và **số pin đang đặt** trên sơ đồ.
- **Nút Thay ảnh** (F07) → chọn ảnh mới; nếu nút **còn pin** → dialog xác nhận nêu rõ "giữ tọa độ tương đối, pin tràn ngoài sẽ cần đặt lại"; sau khi thay, nếu có pin tràn ngoài → thông báo + lối sang S05.
- **Nút Xóa ảnh** (F08) → gỡ ảnh khỏi nút; nếu nút **còn pin** → dialog xác nhận nêu rõ "gỡ vị trí N tài sản về 'chưa có vị trí', giữ hồ sơ tài sản".
- **Nút Đóng / ✕** → fade về workspace S01, không lưu thao tác đang dang dở.

## Trạng thái & edge case
- **Empty (chưa có sơ đồ):** chỉ hiện vùng kéo-thả + hướng dẫn định dạng; ẩn nút Thay/Xóa.
- **Đã có sơ đồ:** hiện xem trước + nút Thay/Xóa; vùng kéo-thả ẩn.
- **Loading:** đang tải ảnh lên → thanh tiến trình/spinner trong vùng kéo-thả; nút thao tác disable.
- **Lỗi định dạng/quá lớn:** file không phải PNG/JPG hoặc > 10 MB → báo lỗi inline ngay tại vùng kéo-thả, **không** tải lên.
- **Lỗi mạng khi tải/thay/xóa:** giữ trạng thái trước thao tác, báo "Lỗi kết nối, chưa lưu được", không để ảnh nửa vời.
- **Thay ảnh khiến pin tràn ngoài:** đếm số pin tràn, đánh dấu "cần đặt lại vị trí", thông báo + dẫn S05.
- **Xóa ảnh còn pin:** cảnh báo gỡ vị trí N tài sản trước khi xóa.
- **Không có quyền:** vai trò Giám sát không có lối vào màn này (ẩn ở menu nút tại S01).

## Câu hỏi mở
- *(Không còn — các điểm mơ hồ đã chốt ở requirements: định dạng PNG/JPG ≤ 10 MB (NFR-04), mỗi nút tối đa 1 sơ đồ (FR-02), giữ tọa độ tương đối khi thay ảnh (BRule-04), pin tràn ngoài → "cần đặt lại" (GĐ-R2), chỉ Quản trị quản lý ảnh (BRule-09).)*
