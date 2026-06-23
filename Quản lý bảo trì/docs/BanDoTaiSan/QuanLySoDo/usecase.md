# Use case — Quản lý ảnh sơ đồ mặt bằng

## UC-S03-01: Tải lên ảnh sơ đồ cho khu vực
- Tác nhân (actor): Quản trị
- Trigger (kích hoạt): Người dùng mở menu một nút khu vực ở S01 và chọn "Quản lý ảnh sơ đồ" cho nút **chưa có sơ đồ**
- Tiền điều kiện: Là vai trò Quản trị; nút khu vực đang chọn chưa gắn ảnh
- Luồng chính (happy path):
  1. Hệ thống mở modal, hiện vùng kéo-thả tải ảnh + hướng dẫn "PNG/JPG ≤ 10 MB".
  2. Người dùng kéo-thả hoặc chọn một file ảnh từ máy.
  3. Hệ thống kiểm tra định dạng (PNG/JPG) và dung lượng (≤ 10 MB).
  4. Hệ thống tải lên, gắn ảnh cho nút, ghi nhật ký kiểm toán, hiện toast "Đã tải lên sơ đồ" và fade về S01.
- Luồng thay thế / ngoại lệ:
  - File không phải PNG/JPG hoặc > 10 MB → báo "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.", không tải lên.
  - Rớt mạng khi tải → báo "Lỗi kết nối, chưa lưu được", giữ nút ở trạng thái chưa có sơ đồ.
  - Người dùng đóng modal → không gắn ảnh.
- Hậu điều kiện (postcondition): Nút khu vực có ảnh sơ đồ; S01 cho phép đặt pin lên sơ đồ.
- Đảm bảo (guarantees): thành công → ảnh lưu + nhật ký; tối thiểu → không gắn ảnh nửa vời nếu thất bại/hủy.
- Trace: R-S03-01, R-S03-03

## UC-S03-02: Thay ảnh sơ đồ và giữ tọa độ pin
- Tác nhân: Quản trị
- Trigger: Người dùng chọn "Thay ảnh" trong modal của nút **đã có sơ đồ**
- Tiền điều kiện: Là vai trò Quản trị; nút đã có ảnh sơ đồ
- Luồng chính:
  1. Người dùng bấm "Thay ảnh" và chọn một file ảnh mới.
  2. Hệ thống kiểm tra định dạng và dung lượng.
  3. Nếu nút **còn pin** → hệ thống hiện dialog: "Hệ thống giữ nguyên vị trí tương đối của pin trên ảnh mới. Pin nằm ngoài vùng ảnh mới sẽ được đánh dấu 'cần đặt lại'." → người dùng xác nhận "Tiếp tục thay".
  4. Hệ thống thay ảnh, **giữ nguyên tọa độ tương đối (%)** của pin, đánh dấu pin tràn ngoài là "cần đặt lại vị trí", ghi nhật ký kiểm toán.
  5. Hệ thống hiện toast "Đã thay ảnh sơ đồ"; nếu có pin tràn ngoài → thông báo "N pin cần đặt lại" kèm nút "Đặt lại ngay" (→ S05).
- Luồng thay thế / ngoại lệ:
  - File sai định dạng/quá lớn → báo "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.", không thay.
  - Nút **không còn pin** → bỏ qua dialog cảnh báo, thay trực tiếp.
  - Người dùng hủy ở dialog → giữ nguyên ảnh cũ.
- Hậu điều kiện: Nút có ảnh mới; pin trong vùng giữ vị trí; pin tràn ngoài chờ đặt lại ở S05.
- Đảm bảo: thành công → ảnh mới + tọa độ pin giữ nguyên + nhật ký; tối thiểu → không đổi nếu hủy/thất bại.
- Trace: R-S03-04, R-S03-05

## UC-S03-03: Xóa ảnh sơ đồ
- Tác nhân: Quản trị
- Trigger: Người dùng chọn "Xóa ảnh" trong modal của nút đã có sơ đồ
- Tiền điều kiện: Là vai trò Quản trị; nút đã có ảnh sơ đồ
- Luồng chính:
  1. Người dùng bấm "Xóa ảnh".
  2. Nếu nút **còn pin** → hệ thống hiện dialog cảnh báo: "Xóa ảnh sẽ gỡ vị trí của N tài sản (về 'chưa có vị trí'). Hồ sơ tài sản được giữ nguyên. Tiếp tục?".
  3. Người dùng xác nhận.
  4. Hệ thống gỡ ảnh khỏi nút, gỡ vị trí N tài sản về "chưa có vị trí" (giữ hồ sơ), ghi nhật ký kiểm toán, hiện toast "Đã xóa sơ đồ" và fade về S01.
- Luồng thay thế / ngoại lệ:
  - Nút **không còn pin** → xóa trực tiếp, không cần dialog.
  - Người dùng hủy → giữ nguyên ảnh và pin.
  - Rớt mạng khi xóa → báo "Lỗi kết nối, chưa lưu được", giữ nguyên hiện trạng.
- Hậu điều kiện: Nút về trạng thái "chưa có sơ đồ"; tài sản bên trong "chưa có vị trí" (nếu trước đó có pin).
- Đảm bảo: thành công → gỡ ảnh + gỡ vị trí + nhật ký; tối thiểu → không xóa nếu hủy/thất bại.
- Trace: R-S03-06

## UC-S03-04: Đóng modal trở về workspace
- Tác nhân: Quản trị
- Trigger: Người dùng bấm ✕ / Đóng / Hủy
- Tiền điều kiện: Modal đang mở
- Luồng chính:
  1. Người dùng bấm đóng.
  2. Hệ thống đóng modal, fade về workspace S01, giữ nguyên hiện trạng ảnh của nút.
- Luồng thay thế / ngoại lệ:
  - Đang có thao tác tải lên dang dở → hủy thao tác, không gắn ảnh.
- Hậu điều kiện: Quay lại S01; không thay đổi ảnh.
- Đảm bảo: thành công → về S01 sạch; tối thiểu → không lưu thao tác dang dở.
- Trace: R-S03-08
