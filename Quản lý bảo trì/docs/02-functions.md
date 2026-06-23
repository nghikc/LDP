# Danh sách chức năng — Quản lý vị trí tài sản cố định

> Mỗi chức năng decompose từ Solution Functional Requirement (FR) bằng **Functional Decomposition (FD)** và trace ngược về Business Requirement (BR).
> Ưu tiên dùng MoSCoW (Must/Should/Could/Won't). Cột **Kỹ thuật** ghi cách suy ra chức năng (FD / CRUD).
> Nguồn: `docs/01-requirements.md`.

## Module: Quản lý cây khu vực

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F01 | Tạo nút khu vực | Thêm một khu vực mới vào cây, đặt dưới một nút cha (hoặc gốc); bắt buộc Tên, mã/loại tùy chọn | CRUD-C | FR-01, BR-04 | Must | Quản trị | Đề xuất |
| F02 | Sửa nút khu vực | Cập nhật tên/mã/loại của một nút khu vực | CRUD-U | FR-01, BR-04 | Must | Quản trị | Đề xuất |
| F03 | Xóa nút khu vực | Xóa nút (kèm khu con); gỡ vị trí tài sản bên trong; hộp xác nhận cảnh báo số lượng bị ảnh hưởng | CRUD-D | FR-01, FR-12, BR-04 | Must | Quản trị | Đề xuất |
| F04 | Xem / duyệt cây khu vực | Hiển thị cây phân cấp không giới hạn cấp, mở/đóng nhánh | CRUD-R | FR-01, BR-04 | Must | Quản trị, Giám sát | Đề xuất |
| F05 | Di chuyển nút trong cây | Kéo/đặt một nút sang nhánh khác; chặn đặt nút vào chính nhánh con của nó | FD | FR-01, BR-04 | Should | Quản trị | Đề xuất |

## Module: Quản lý sơ đồ mặt bằng

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F06 | Tải lên ảnh sơ đồ | Gắn một ảnh sơ đồ (PNG/JPG ≤ 10 MB) cho một nút khu vực | CRUD-C | FR-02, BR-02 | Must | Quản trị | Đề xuất |
| F07 | Thay ảnh sơ đồ | Đổi ảnh sơ đồ của nút; giữ nguyên tọa độ tương đối của pin hiện có | CRUD-U | FR-02, BR-02 | Must | Quản trị | Đề xuất |
| F08 | Xóa ảnh sơ đồ | Gỡ ảnh sơ đồ khỏi một nút khu vực | CRUD-D | FR-02, BR-02 | Should | Quản trị | Đề xuất |
| F09 | Xem sơ đồ mặt bằng | Hiển thị ảnh sơ đồ của nút cùng các pin tài sản | CRUD-R | FR-02, BR-02 | Must | Quản trị, Giám sát | Đề xuất |
| F10 | Gom cụm / lọc pin | Gom cụm (clustering) pin khi sơ đồ vượt 500 điểm; lọc pin theo tiêu chí | FD | FR-13, BR-02 | Should | Quản trị, Giám sát | Đề xuất |

## Module: Gán & di dời vị trí tài sản

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F11 | Gán vị trí tài sản | Click lên sơ đồ rồi chọn tài sản chưa có vị trí, tạo pin tại tọa độ đó | CRUD-C | FR-03, BR-01 | Must | Quản trị, Giám sát | Đề xuất |
| F12 | Di dời tài sản (đơn) | Form chọn đích (bắt buộc) + lý do (tùy chọn); cập nhật vị trí, sinh lịch sử di chuyển | CRUD-U | FR-05, BR-03 | Must | Quản trị, Giám sát | Đề xuất |
| F13 | Di dời hàng loạt | Chọn nhiều tài sản lẻ hoặc cả vị trí cũ, chuyển về cùng một đích; rollback toàn bộ nếu gián đoạn | FD | FR-06, BR-03 | Must | Quản trị, Giám sát | Đề xuất |
| F14 | Gỡ vị trí tài sản | Đưa một tài sản về trạng thái "chưa có vị trí" (gỡ pin) | CRUD-D | FR-03, BR-01 | Should | Quản trị, Giám sát | Đề xuất |
| F15 | Đặt lại vị trí pin cần đặt lại | Đặt lại tọa độ cho pin bị đánh dấu "cần đặt lại vị trí" (sau khi thay ảnh, pin tràn ngoài) | FD | FR-02, BR-02 | Could | Quản trị, Giám sát | Đề xuất |

## Module: Tra cứu

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F16 | Tra cứu nhanh tài sản | Tìm theo mã/tên (khớp một phần, không phân biệt dấu); hiển thị đường dẫn khu vực + nhảy tới làm nổi pin | CRUD-R | FR-04, BR-01 | Must | Quản trị, Giám sát | Đề xuất |

## Module: Lịch sử & Nhật ký kiểm toán

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F17 | Xem lịch sử di chuyển | Hiển thị chuỗi vị trí cũ → mới của một tài sản (người thực hiện, thời điểm, lý do) | CRUD-R | FR-07, BR-03 | Must | Quản trị, Giám sát | Đề xuất |
| F18 | Ghi nhật ký kiểm toán | Tự động ghi log mọi thao tác gán/di dời/xóa (người · hành động · đối tượng · thời gian · vị trí cũ→mới) | FD | FR-08, BR-03 | Must | Hệ thống | Đề xuất |
| F19 | Xem nhật ký kiểm toán | Tra & lọc các bản ghi nhật ký kiểm toán phục vụ truy vết | CRUD-R | FR-08, BR-03 | Should | Quản trị | Đề xuất |

## Module: Báo cáo

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F20 | Xuất báo cáo / kiểm kê | Xuất Excel (.xlsx): mã, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất | FD | FR-10, BR-02 | Should | Quản trị, Giám sát | Đề xuất |

## Module: Kiểm soát truy cập & đồng thời

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F21 | Phân quyền theo vai trò | Áp quyền 2 vai trò: Quản trị toàn quyền; Giám sát làm mọi việc trừ quản lý cấu trúc (cây + ảnh sơ đồ) | FD | FR-09 | Must | Hệ thống | Đề xuất |
| F22 | Khóa tài sản khi đang sửa | Tạm khóa tài sản đang gán/di dời chống thao tác đồng thời; tự mở sau 5 phút | FD | FR-11, BR-03 | Should | Hệ thống | Đề xuất |

## Ma trận CRUD (soát độ phủ chức năng)

> Đảm bảo mỗi thực thể nghiệp vụ chính được phủ đủ Create / Read / Update / Delete. Ô trống = lỗ hổng cần giải thích.

| Thực thể \ Thao tác | Create | Read/List | Update | Delete |
|---|---|---|---|---|
| Nút khu vực | F01 | F04 | F02, F05 | F03 |
| Sơ đồ mặt bằng | F06 | F09, F10 | F07 | F08 |
| Vị trí / Pin tài sản | F11 | F16, F09 | F12, F13, F15 | F14 |
| Lịch sử di chuyển | F12, F13 (tự sinh) | F17 | — (luật: bất biến, không sửa) | — (luật: bất biến, không xóa) |
| Nhật ký kiểm toán | F18 (tự ghi) | F19 | — (luật: append-only) | — (luật: append-only) |

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| F (Function) | Mã chức năng (F01…), truy vết về FR/BR |
| FD (Functional Decomposition) | Phân rã chức năng top-down từ yêu cầu lớn xuống chức năng lá |
| CRUD | Bốn thao tác dữ liệu: Create / Read / Update / Delete |
| MoSCoW | Cách xếp ưu tiên: Must / Should / Could / Won't |
| Pin | Điểm đánh dấu vị trí tài sản trên sơ đồ mặt bằng |
| Clustering (gom cụm) | Gộp nhiều pin gần nhau thành một cụm khi sơ đồ quá nhiều điểm |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
