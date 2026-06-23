# Tài liệu yêu cầu — Quản lý vị trí tài sản cố định

> Phân loại yêu cầu: Business → Stakeholder → Solution (Functional/Non-functional) → Business Rules → Transition.
> Thuộc tính mỗi yêu cầu: ID · Nguồn · Ưu tiên (MoSCoW) · Trạng thái · Truy vết.
> **Mỗi yêu cầu đạt SMART (IEEE 830):** atomic · unambiguous · testable/measurable · feasible · traceable. NFR luôn kèm số đo.
> Phạm vi: phân hệ thuộc phần mềm **Quản lý bảo trì**, **chỉ quản lý vị trí + lịch sử di chuyển** của tài sản cố định. Hồ sơ tài sản và lịch bảo trì do module khác lo; phân hệ này tham chiếu tài sản có sẵn.
> Nguồn: `docs/00-brainstorm.md` (phỏng vấn IT-BA đã hoàn tất, mọi giả định brainstorm đã xác nhận).

## 1. Business Need
Vị trí tài sản cố định hiện ghi rời rạc trên Excel/giấy, **dễ sai lệch thực tế** khi tài sản di dời mà không ai cập nhật. Hệ quả: kỹ thuật viên **mất thời gian đi tìm** thiết bị cần bảo trì; **không trực quan, khó bàn giao** cho người mới/nhà thầu; **khó kiểm kê định kỳ** vì không biết tài sản thực đang ở đâu so với sổ sách. Doanh nghiệp cần một phân hệ định vị tập trung, trực quan và có truy vết để nền tảng bảo trì vận hành hiệu quả.

## 2. Business Requirements (BR)
Mục tiêu/kết quả ở cấp tổ chức.

| ID | Yêu cầu nghiệp vụ | Lý do (rationale) | Ưu tiên |
|----|-------------------|-------------------|---------|
| BR-01 | Định vị chính xác tài sản cố định để giảm thời gian tìm kiếm phục vụ bảo trì | Kỹ thuật viên đang mất thời gian đi hỏi/tìm thiết bị | Must |
| BR-02 | Trực quan hóa bố trí tài sản trên sơ đồ mặt bằng để dễ bàn giao và kiểm kê | Không có bản đồ bố trí, người mới/nhà thầu khó hình dung; kiểm kê tốn công | Must |
| BR-03 | Giữ dữ liệu vị trí đồng bộ thực tế và truy vết được mọi thay đổi | Vị trí lệch thực tế do không cập nhật khi di dời | Must |
| BR-04 | Tổ chức tài sản theo cấu trúc khu vực phân cấp linh hoạt cho nhiều mô hình cơ sở | Mỗi doanh nghiệp có số cấp khu vực khác nhau | Must |

## 3. Stakeholder Requirements (StR)
Nhu cầu của từng nhóm liên quan, trace về BR.

| ID | Nhóm liên quan | Nhu cầu | Trace BR |
|----|----------------|---------|----------|
| StR-01 | Quản trị / Quản lý tài sản | Xây & duy trì cây khu vực, quản lý ảnh sơ đồ, gán/di dời vị trí, xem lịch sử, xuất báo cáo | BR-01, BR-02, BR-03, BR-04 |
| StR-02 | Giám sát / Quản lý | Tra cứu nhanh vị trí, xem sơ đồ & lịch sử, gán/di dời tài sản, xuất báo cáo (không quản cấu trúc) | BR-01, BR-02, BR-03 |

## 4. Solution Requirements

### 4.1 Functional (FR) — hệ thống phải làm gì
| ID | Yêu cầu chức năng | Trace StR/BR | Ưu tiên |
|----|-------------------|--------------|---------|
| FR-01 | Hệ thống cho phép Quản trị tạo/sửa/xóa nút khu vực và lồng **không giới hạn số cấp** | StR-01, BR-04 | Must |
| FR-02 | Hệ thống cho phép Quản trị tải lên / thay / xóa **một ảnh sơ đồ mặt bằng cho mỗi nút** khu vực (PNG/JPG ≤ 10 MB) | StR-01, BR-02 | Must |
| FR-03 | Hệ thống cho phép gán vị trí tài sản bằng cách **click lên sơ đồ rồi chọn tài sản chưa có vị trí**, tạo pin tại tọa độ đó | StR-01, StR-02, BR-01 | Must |
| FR-04 | Hệ thống cho phép tra cứu tài sản theo mã/tên (**khớp một phần, không phân biệt dấu**), hiển thị **đường dẫn khu vực đầy đủ** và **tự nhảy tới sơ đồ làm nổi (highlight) pin** | StR-01, StR-02, BR-01 | Must |
| FR-05 | Hệ thống cho phép di dời tài sản qua **form** chọn khu vực/vị trí **đích** (bắt buộc) và **lý do** (tùy chọn), sinh bản ghi lịch sử di chuyển | StR-01, StR-02, BR-03 | Must |
| FR-06 | Hệ thống cho phép **di dời hàng loạt**: chọn nhiều tài sản lẻ hoặc **chọn cả vị trí cũ** để lấy hết tài sản trong đó, chuyển về **cùng một đích**; nếu gián đoạn thì **rollback toàn bộ lô** | StR-01, StR-02, BR-03 | Must |
| FR-07 | Hệ thống hiển thị **lịch sử di chuyển** của tài sản (vị trí cũ → mới, người thực hiện, thời điểm, lý do nếu có) | StR-01, StR-02, BR-03 | Must |
| FR-08 | Hệ thống **ghi nhật ký kiểm toán** mọi thao tác gán / di dời / xóa | StR-01, BR-03 | Must |
| FR-09 | Hệ thống **phân quyền theo 2 vai trò**: Quản trị toàn quyền; Giám sát làm mọi việc trừ quản lý cấu trúc (cây + ảnh sơ đồ) | StR-01, StR-02 | Must |
| FR-10 | Hệ thống cho phép **xuất báo cáo / dữ liệu phục vụ kiểm kê** | StR-01, StR-02, BR-02 | Should |
| FR-11 | Hệ thống **khóa tài sản khi đang được gán/di dời** để chống thao tác đồng thời, tự mở khóa sau thời gian quy định | StR-01, BR-03 | Should |
| FR-12 | Hệ thống hiển thị **hộp xác nhận có cảnh báo số lượng bị ảnh hưởng** trước khi xóa nút khu vực | StR-01, BR-04 | Must |
| FR-13 | Hệ thống hiển thị sơ đồ mặt bằng với khả năng **gom cụm/lọc pin** khi một sơ đồ vượt **500 điểm** | StR-01, StR-02, BR-02 | Should |

### 4.2 Non-functional (NFR) — ràng buộc chất lượng (đo được)
| ID | Loại | Yêu cầu | Trace |
|----|------|---------|-------|
| NFR-01 | Hiệu năng | Hệ thống quản lý tới **50.000 tài sản**; mở một sơ đồ mặt bằng và hiển thị pin trong **< 2 giây** | BR-01, BR-02 |
| NFR-02 | Hiệu năng | Tra cứu tài sản trả kết quả trong **< 1 giây** | BR-01 |
| NFR-03 | Bảo mật & truy vết | Mọi thao tác gán/di dời/xóa được ghi nhật ký kiểm toán đầy đủ (người · hành động · đối tượng · thời gian · vị trí cũ→mới); kiểm soát truy cập theo 2 vai trò | BR-03 |
| NFR-04 | Tương thích dữ liệu | Chấp nhận ảnh sơ đồ định dạng **PNG/JPG**, mỗi file **≤ 10 MB** | BR-02 |
| NFR-05 | Toàn vẹn đồng thời | Khóa tài sản khi đang sửa **tự mở sau 5 phút** không thao tác | BR-03 |
| NFR-06 | Khả dụng | Pin lưu **tọa độ tương đối (%)** để giữ vị trí khi đổi ảnh/đổi kích thước hiển thị | BR-02 |

## 5. Business Rules (BRule)
Quy tắc/ràng buộc nghiệp vụ — tách riêng khỏi FR vì thay đổi độc lập.

| ID | Quy tắc nghiệp vụ | Trace BR/FR |
|----|-------------------|-------------|
| BRule-01 | Mỗi tài sản chỉ có **1 vị trí** tại một thời điểm | FR-03, FR-05, BR-01 |
| BRule-02 | Gán vị trí cho tài sản **đã có vị trí** được coi là **di dời** (ghi lịch sử di chuyển) | FR-03, FR-05, BR-03 |
| BRule-03 | Xóa nút khu vực còn tài sản/khu con: **cho xóa**, **gỡ vị trí** tài sản bên trong (về "chưa có vị trí"), **không xóa hồ sơ tài sản** | FR-12, BR-04 |
| BRule-04 | Khi thay ảnh sơ đồ của nút đã có pin: **giữ nguyên tọa độ tương đối** của pin trên ảnh mới | FR-02, NFR-06 |
| BRule-05 | Khi một người đang gán/di dời một tài sản, **khóa tài sản đó**; tự mở sau 5 phút không thao tác | FR-11, NFR-05 |
| BRule-06 | **Chặn di chuyển một nút khu vực vào chính nhánh con** của nó (tránh cây lặp) | FR-01, BR-04 |
| BRule-07 | Một thao tác **di dời hàng loạt** chuyển tất cả tài sản được chọn về **cùng một đích** | FR-06, BR-03 |
| BRule-08 | Form di dời: **đích bắt buộc**, **lý do tùy chọn** | FR-05, BR-03 |
| BRule-09 | **Chỉ Quản trị** được quản lý cấu trúc (tạo/sửa/xóa nút khu vực + tải/thay/xóa ảnh sơ đồ); Giám sát làm các việc còn lại | FR-09 |
| BRule-10 | Nút khu vực bắt buộc có **Tên khu vực**; mã và loại khu vực tùy chọn | FR-01, BR-04 |

## 6. Transition Requirements (TR)
Yêu cầu tạm thời để chuyển từ hiện trạng sang giải pháp.

| ID | Yêu cầu chuyển đổi | Trace |
|----|--------------------|-------|
| TR-01 | Di trú dữ liệu vị trí tài sản từ Excel/giấy hiện hành vào cây khu vực | BR-01, BR-03 |
| TR-02 | Tải lên ảnh sơ đồ mặt bằng ban đầu cho các nút khu vực và đặt pin lần đầu | BR-02 |

## 7. Ràng buộc & Giả định
- **Ràng buộc:**
  - Phân hệ nằm trong phần mềm Quản lý bảo trì hiện có; **tham chiếu** dữ liệu tài sản từ module hồ sơ tài sản (không tự tạo/sửa hồ sơ).
  - Không tích hợp dịch vụ ngoài; không gửi thông báo chủ động khi di dời.
- **Giả định** (rà & xác nhận theo "Xác nhận giả định" trong `conventions.md`):

| Mã | Giả định | Vì sao cần (chỗ thiếu) | Ảnh hưởng nếu sai | Trạng thái |
|----|----------|------------------------|-------------------|-----------|
| GĐ-R1 | Báo cáo/kiểm kê xuất **Excel (.xlsx)** gồm: mã tài sản, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất | OQ-01 brainstorm chưa chốt định dạng & cột báo cáo | Báo cáo sai định dạng/nội dung, không dùng được cho kiểm kê | ✅ Đã xác nhận |
| GĐ-R2 | Khi giữ tọa độ tương đối mà pin **nằm ngoài vùng ảnh mới**, hệ thống **đánh dấu pin "cần đặt lại vị trí"** và liệt kê danh sách chờ | OQ-04 brainstorm chưa chốt cách xử lý pin tràn ngoài ảnh | Pin biến mất/khuất, người dùng không biết để sửa | ✅ Đã xác nhận |
| GĐ-R3 | Sơ đồ **gom cụm (clustering) pin khi vượt 500 điểm** trên một sơ đồ | OQ-05 brainstorm chưa chốt ngưỡng clustering | Sơ đồ rối hoặc gom cụm sai thời điểm | ✅ Đã xác nhận (sửa 200→500) |
| GĐ-R4 | Di dời hàng loạt bị gián đoạn (mất mạng) → **rollback toàn bộ lô** (all-or-nothing) | OQ-06 brainstorm chưa chốt hành vi gián đoạn | Dữ liệu nửa vời, một phần tài sản chuyển một phần không | ✅ Đã xác nhận |
| GĐ-R5 | Tra cứu **không phân biệt dấu** tiếng Việt và khớp một phần (mã + tên) | OQ-07 brainstorm chưa chốt chi tiết tìm kiếm | Tìm kiếm bỏ sót kết quả khi gõ không dấu | ✅ Đã xác nhận |

## 8. Tiêu chí thành công
- Thời gian xác định vị trí một tài sản giảm còn **< 1 phút** (tra cứu mã/tên → đường dẫn + pin), thay cho việc đi hỏi/tìm thủ công (BR-01).
- **100% tài sản** trong phạm vi triển khai được gán vị trí và hiển thị đúng trên sơ đồ mặt bằng (BR-02).
- **Mọi** thao tác gán/di dời/xóa đều có bản ghi truy vết trong nhật ký kiểm toán (BR-03).
- Hệ thống thể hiện được cây khu vực **đa cấp tùy ý** cho ít nhất một cơ sở thực tế của doanh nghiệp (BR-04).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| BR (Business Requirement) | Yêu cầu nghiệp vụ — mục tiêu/kết quả ở cấp tổ chức |
| StR (Stakeholder Requirement) | Yêu cầu của một nhóm liên quan, truy vết về BR |
| FR / NFR | Yêu cầu chức năng / phi chức năng (hệ thống làm gì / ràng buộc chất lượng) |
| BRule (Business Rule) | Quy tắc nghiệp vụ, tách riêng khỏi FR |
| TR (Transition Requirement) | Yêu cầu chuyển đổi tạm thời (di trú dữ liệu, tải dữ liệu ban đầu) |
| MoSCoW | Cách xếp ưu tiên: Must / Should / Could / Won't |
| SMART | Tiêu chí yêu cầu tốt: cụ thể, đo được, khả thi, liên quan, có mốc |
| Pin | Điểm đánh dấu vị trí tài sản trên sơ đồ mặt bằng |
| Clustering (gom cụm) | Gộp nhiều pin gần nhau thành một cụm khi sơ đồ quá nhiều điểm |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
