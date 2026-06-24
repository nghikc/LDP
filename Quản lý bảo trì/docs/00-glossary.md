# Từ điển thuật ngữ — Quản lý vị trí tài sản cố định

> Nguồn chuẩn giải nghĩa thuật ngữ toàn dự án. Mỗi tài liệu còn có footer "## Thuật ngữ" liệt kê riêng các từ dùng trong nó. Khi gặp thuật ngữ mới, thêm vào đây (một dòng = một thuật ngữ).

## 1. Thuật ngữ phương pháp & mã định danh

| Thuật ngữ | Giải thích |
|-----------|-----------|
| BR (Business Requirement) | Yêu cầu nghiệp vụ — mục tiêu/kết quả ở cấp tổ chức |
| StR (Stakeholder Requirement) | Yêu cầu của một nhóm liên quan, truy vết về BR |
| FR (Functional Requirement) | Yêu cầu chức năng — hệ thống phải làm gì |
| NFR (Non-functional Requirement) | Yêu cầu phi chức năng — ràng buộc chất lượng (hiệu năng, bảo mật…), luôn kèm số đo |
| BRule (Business Rule) | Quy tắc nghiệp vụ, tách riêng khỏi FR vì thay đổi độc lập |
| TR (Transition Requirement) | Yêu cầu chuyển đổi tạm thời (di trú dữ liệu, đào tạo, chạy song song) |
| F (Function) | Mã chức năng (F01…), truy vết về FR/BR |
| S (Screen) | Mã màn hình (S01…) |
| R-S | Yêu cầu cấp màn hình (R-S01-01…), truy vết F/FR |
| UC (Use Case) | Ca sử dụng (UC-S01-01…) |
| US (User Story) | Câu chuyện người dùng (US-S01-01…) |
| TC (Test Case) | Ca kiểm thử (TC-S01-01…) |
| MoSCoW | Cách xếp ưu tiên: Must / Should / Could / Won't |
| SMART | Tiêu chí yêu cầu tốt: cụ thể, đo được, khả thi, liên quan, có mốc thời gian |
| BABOK | Khung kiến thức phân tích nghiệp vụ (Business Analysis Body of Knowledge) |
| IEEE 830 | Chuẩn đặc tả yêu cầu phần mềm |
| CRUD | Bốn thao tác dữ liệu: Create / Read / Update / Delete |
| ERD (Entity-Relationship Diagram) | Sơ đồ thực thể — quan hệ |
| PK / FK | Khoá chính (Primary Key) / Khoá ngoại (Foreign Key) |
| 3NF | Dạng chuẩn thứ ba trong chuẩn hoá cơ sở dữ liệu |
| REST | Kiểu thiết kế API theo tài nguyên qua phương thức HTTP |
| API (Application Programming Interface) | Giao diện lập trình ứng dụng |
| Endpoint | Một đường dẫn API (phương thức + path) |
| GWT (Given-When-Then) | Cú pháp viết tiêu chí chấp nhận: Bối cảnh — Hành động — Kết quả |
| INVEST | Tiêu chí user story tốt: Independent, Negotiable, Valuable, Estimable, Small, Testable |
| EP / BVA / DT / ST | Kỹ thuật thiết kế test: Equivalence Partitioning / Boundary Value Analysis / Decision Table / State Transition |
| RACI | Ma trận trách nhiệm: Responsible / Accountable / Consulted / Informed |
| Onion Diagram | Sơ đồ phân lớp các bên liên quan theo độ gần giải pháp |
| WCAG AA | Mức tuân thủ tiêu chuẩn tiếp cận web (Web Content Accessibility Guidelines) |
| Design token | Biến thiết kế (màu, cỡ chữ, spacing…) đặt tên theo vai trò |
| Breakpoint | Ngưỡng độ rộng màn hình để đổi bố cục responsive |

## 2. Thuật ngữ nghiệp vụ (đặc thù dự án)

| Thuật ngữ | Giải thích |
|-----------|-----------|
| Tài sản cố định | Máy móc/thiết bị có giá trị, dùng lâu dài, cần quản lý vị trí và bảo trì |
| Cây khu vực | Cấu trúc phân cấp các khu vực (chi nhánh/tòa/tầng/phòng…), lồng nhiều cấp không giới hạn |
| Nút khu vực | Một phần tử trong cây khu vực (vd một tầng, một phòng) |
| Sơ đồ mặt bằng (floor plan) | Ảnh/bản vẽ bố trí của một khu vực, dùng để đính vị trí tài sản; mỗi nút khu vực có tối đa một sơ đồ |
| Pin | Điểm đánh dấu vị trí của một tài sản trên sơ đồ mặt bằng |
| Tọa độ tương đối | Vị trí pin lưu theo phần trăm (%) kích thước ảnh, để giữ vị trí khi đổi ảnh/đổi kích thước hiển thị |
| Gán vị trí | Thao tác đặt một tài sản chưa có vị trí vào một điểm trên sơ đồ/khu vực |
| Di dời | Thao tác đổi vị trí của tài sản đã có vị trí, sinh bản ghi lịch sử di chuyển |
| Di dời hàng loạt | Di dời nhiều tài sản cùng lúc về cùng một đích |
| Lịch sử di chuyển | Chuỗi bản ghi vị trí cũ → mới của một tài sản (ai, khi nào, lý do) |
| Nhật ký kiểm toán (audit log) | Bản ghi ai – làm gì – khi nào cho mọi thao tác gán/di dời/xóa, phục vụ truy vết |
| Clustering (gom cụm) | Gộp nhiều pin gần nhau thành một cụm khi sơ đồ có quá nhiều điểm |
| Khóa khi đang sửa | Cơ chế tạm khóa một tài sản đang được gán/di dời để chống thao tác đồng thời |
| Quản trị / Quản lý tài sản | Vai trò toàn quyền, gồm quản lý cấu trúc cây + ảnh sơ đồ |
| Giám sát / Quản lý | Vai trò làm mọi việc trừ quản lý cấu trúc (cây + ảnh sơ đồ) |
| Workspace (hub) | Màn trung tâm tích hợp cây khu vực + sơ đồ + pin, làm điểm vào chính của phân hệ |
| Vị trí (gom nhiều tài sản) | Một tọa độ trên sơ đồ mặt bằng có thể chứa nhiều tài sản; mỗi tài sản vẫn chỉ thuộc một vị trí |
| Tên vị trí | Nhãn tùy chọn đặt cho một vị trí, lưu theo (nút khu vực + tọa độ), hiển thị trên marker |
| Marker | Chấm tròn + số tài sản + nhãn thể hiện một vị trí trên sơ đồ; màu theo trạng thái |
| Kéo-thả pin (marker) | Giữ + kéo marker để dời tọa độ mọi tài sản tại vị trí đó trong cùng sơ đồ; không sinh lịch sử |
| Drawer | Ngăn trượt chứa cây khu vực, mở bằng hamburger trên màn hẹp (≤768px), kèm nền tối (scrim) |
| Scrim | Lớp nền tối phủ sau drawer/modal; chạm vào để đóng |
| Pointer Events | Sự kiện con trỏ hợp nhất chuột + cảm ứng, dùng cho thao tác kéo-thả marker |
| Breadcrumb | Dải đường dẫn thể hiện vị trí một nút trong cây khu vực (vd Tòa A › Tầng 3 › Phòng 305) |
| Đường dẫn khu vực | Chuỗi nút khu vực từ gốc tới nút chứa tài sản (vd Tòa A › Tầng 3 › Phòng 305) |
| Nút cha | Nút khu vực đứng trên một cấp, quyết định vị trí của nút trong cây; để trống = nút gốc |
| Nút gốc | Nút khu vực không có nút cha, ở cấp trên cùng của cây khu vực |
| Loại khu vực | Phân loại một nút khu vực theo danh mục (Site/Tòa/Tầng/Phòng/Khu); tùy chọn |
| Mã khu vực | Mã định danh ngắn tùy chọn của một nút khu vực; nếu nhập phải duy nhất toàn cây |
| Cây lặp | Lỗi cấu trúc khi một nút trở thành con của chính nó hoặc nhánh con của nó; bị chặn |
| Pin cần đặt lại vị trí | Pin có tọa độ tương đối nằm ngoài vùng ảnh sơ đồ mới (sau khi thay ảnh), bị đánh dấu chờ đặt lại tọa độ ở màn S05 |
| Vùng kéo-thả (drop zone) | Khu vực giao diện nhận file ảnh bằng kéo-thả hoặc chọn từ máy khi tải/thay ảnh sơ đồ |
| Vị trí đích | Khu vực/vị trí mới mà tài sản được chuyển tới; bắt buộc khi di dời |
| Vị trí cũ (nguồn) | Vị trí hiện tại của tài sản trước khi di dời; chọn "cả vị trí cũ" = lấy hết tài sản trong nút đó |
| Lô di dời (batch) | Tập tài sản được chọn để di dời cùng một lần về cùng một đích |
| All-or-nothing (toàn bộ hoặc không) | Giao dịch lô: hoặc mọi tài sản đổi vị trí thành công, hoặc không tài sản nào (rollback khi gián đoạn) |
| Rollback (hoàn tác) | Khôi phục trạng thái trước giao dịch khi lô di dời bị gián đoạn/mất mạng giữa chừng |
| Append-only (chỉ thêm) | Dữ liệu chỉ được thêm bản ghi mới, không sửa và không xóa; áp cho lịch sử di chuyển và nhật ký kiểm toán |
| Bất biến (immutable) | Bản ghi đã tạo không thay đổi nội dung về sau |
| Audit trail (vết kiểm toán) | Chuỗi bản ghi kiểm toán cho phép lần lại toàn bộ thao tác đã xảy ra |
| Đối tượng (của thao tác) | Thực thể bị tác động trong một thao tác kiểm toán: tài sản hoặc nút khu vực |
| Phạm vi xuất | Tập tài sản đưa vào báo cáo: toàn bộ / theo nút khu vực đang chọn / theo bộ lọc |
| Kiểm kê | Đối chiếu tài sản thực tế với sổ sách định kỳ; báo cáo xuất ra là dữ liệu đầu vào |
| Lần di dời gần nhất | Thời điểm bản ghi lịch sử di chuyển mới nhất của một tài sản; trống nếu chưa từng di dời |
| Excel (.xlsx) | Định dạng bảng tính Office Open XML; định dạng đầu ra chuẩn của báo cáo |
