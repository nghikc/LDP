# Brainstorm — Quản lý vị trí tài sản cố định (Cây khu vực · Sơ đồ mặt bằng · Vị trí tài sản)

> Đầu ra của phỏng vấn IT-BA. Là đầu vào cho `ba-requirements`.
> Thuộc phần mềm **Quản lý bảo trì**. Chức năng này **chỉ lo vị trí + lịch sử di chuyển** của tài sản cố định — không quản lý hồ sơ tài sản hay lịch bảo trì (do module khác lo, chức năng này chỉ tham chiếu tài sản có sẵn).

## 1. Tổng quan
- **Làm gì:** Quản lý nơi đặt các **tài sản cố định** (máy móc, thiết bị) trong một tổ chức, qua 3 trụ cột:
  1. **Cây khu vực** — cấu trúc phân cấp các khu vực (ví dụ: Chi nhánh → Tòa nhà → Tầng → Phòng), lồng **không giới hạn cấp**, làm khung chứa tài sản.
  2. **Sơ đồ mặt bằng** — ảnh/bản vẽ bố trí (floor plan) gắn vào từng nút khu vực; tài sản được đính lên ảnh bằng **pin** (điểm đánh dấu vị trí).
  3. **Vị trí tài sản** — gán, tra cứu, di dời tài sản và lưu **lịch sử di chuyển** (ai chuyển, từ đâu sang đâu, khi nào).
- **Giải quyết vấn đề gì:** Hiện vị trí tài sản ghi rời rạc trên Excel/giấy, dễ **sai lệch thực tế** khi tài sản di dời mà không ai cập nhật; kỹ thuật viên **mất thời gian đi tìm** thiết bị cần bảo trì; **không trực quan, khó bàn giao** cho người mới/nhà thầu; và **khó kiểm kê định kỳ** vì không biết tài sản thực đang ở đâu so với sổ sách.
- **Vì sao bây giờ:** Là nền tảng định vị cho toàn bộ phần mềm quản lý bảo trì — có vị trí chính xác thì các nghiệp vụ bảo trì, kiểm kê, bàn giao mới chạy hiệu quả.

## 2. Người dùng & quyền truy cập
- **Vai trò sử dụng (2 vai trò):**
  - **Quản trị / Quản lý tài sản** — toàn quyền: quản lý cấu trúc (cây khu vực + ảnh sơ đồ), gán/di dời vị trí, tra cứu, xem lịch sử, xuất báo cáo.
  - **Giám sát / Quản lý** — làm được mọi việc **trừ quản lý cấu trúc**: được tra cứu, xem, **gán vị trí**, **di dời** (đơn & hàng loạt), xem lịch sử, xuất báo cáo; **không** tạo/sửa/xóa nút khu vực và **không** tải/thay/xóa ảnh sơ đồ.
- **Điều kiện gating / điểm vào:** Truy cập từ trong phần mềm Quản lý bảo trì sau khi đăng nhập; phân quyền theo 2 vai trò trên. Khác biệt quyền duy nhất giữa 2 vai trò là **quản lý cấu trúc**.
- **Quy mô dự kiến:**
  - Cây khu vực: **không giới hạn số cấp** (người dùng tự lồng sâu).
  - Tài sản cần quản lý vị trí: **5.000 – 50.000** → một sơ đồ có thể chứa hàng trăm điểm, cần lọc/gom điểm khi đông.

## 3. Luồng chính (happy path)

### 3a. Gán vị trí tài sản (click sơ đồ → chọn tài sản)
| Bước | Người dùng làm gì | Hệ thống làm gì | Người dùng thấy gì |
|------|-------------------|-----------------|--------------------|
| 1 | Chọn nút khu vực trên cây | Mở sơ đồ mặt bằng gắn với nút đó | Ảnh sơ đồ + các pin tài sản hiện có |
| 2 | Click vào điểm muốn đặt trên sơ đồ | Tạo pin tạm tại điểm click, mở ô tìm tài sản | Pin tạm + ô tìm tài sản |
| 3 | Gõ mã/tên, chọn tài sản (tài sản chưa có vị trí) | Gán tài sản vào pin tại tọa độ đó; ghi nhật ký kiểm toán | Pin chốt mang nhãn tài sản; thông báo gán thành công |

### 3b. Tra cứu nhanh (việc dùng nhiều nhất)
| Bước | Người dùng làm gì | Hệ thống làm gì | Người dùng thấy gì |
|------|-------------------|-----------------|--------------------|
| 1 | Gõ tìm mã/tên tài sản | Khớp tài sản theo mã/tên | Danh sách gợi ý |
| 2 | Chọn tài sản | Hiển thị **đường dẫn khu vực** đầy đủ; tự mở sơ đồ của khu vực đó và **làm nổi (highlight) pin** | Đường dẫn (vd: Tòa A › Tầng 3 › Phòng 305) + sơ đồ với pin nhấp nháy |

### 3c. Di dời tài sản (sinh lịch sử di chuyển)
| Bước | Người dùng làm gì | Hệ thống làm gì | Người dùng thấy gì |
|------|-------------------|-----------------|--------------------|
| 1 | Chọn tài sản cần di dời — **chọn lẻ** nhiều tài sản, hoặc **chọn cả vị trí cũ** để lấy hết tài sản trong đó | Khóa các tài sản được chọn (tránh người khác sửa cùng lúc) | Danh sách tài sản sẽ di dời |
| 2 | Bấm **Di dời**, chọn khu vực/vị trí **đích** (bắt buộc), nhập **lý do** (tùy chọn) | Kiểm tra hợp lệ | Form di dời |
| 3 | Xác nhận | Cập nhật vị trí mới cho từng tài sản; ghi **lịch sử di chuyển** (vị trí cũ → mới, người thực hiện, thời điểm) + nhật ký kiểm toán; mở khóa | Thông báo di dời thành công; pin chuyển sang đích |

### 3d. Quản lý cấu trúc (chỉ Quản trị)
- Tạo/sửa/xóa **nút khu vực**; **tải lên / thay / xóa** ảnh sơ đồ mặt bằng (mỗi nút **1 sơ đồ riêng**).

## 4. Deep-dive — Scenario matrix (vai trò × trường hợp)
*Trigger `has_multi_role` bật. Ký hiệu: ✅ làm được · 👁️ chỉ xem · ❌ không.*

| Trường hợp | Quản trị / QL tài sản | Giám sát / Quản lý |
|---|---|---|
| Xem cây khu vực & sơ đồ mặt bằng | ✅ | 👁️ |
| Tra cứu tài sản (nhảy tới + làm nổi pin) | ✅ | 👁️ |
| Tạo / sửa / xóa nút khu vực | ✅ | ❌ |
| Tải lên / thay / xóa ảnh sơ đồ | ✅ | ❌ |
| Gán vị trí tài sản (đặt pin) | ✅ | ✅ |
| Di dời tài sản (đơn & hàng loạt) | ✅ | ✅ |
| Xem lịch sử di chuyển | ✅ | 👁️ |
| Xuất báo cáo / phục vụ kiểm kê | ✅ | ✅ |

> Tóm tắt: Giám sát/Quản lý ngang Quản trị **trừ quản lý cấu trúc** (cây + ảnh sơ đồ).

## 5. Validation & wording
- **Trường bắt buộc:**
  - Nút khu vực: **Tên khu vực** bắt buộc (mã/loại — xem Open Questions). *(GĐ-01)*
  - Gán vị trí: phải chọn **một tài sản chưa có vị trí**.
  - Form di dời: **đích bắt buộc**, **lý do tùy chọn**.
- **Quy tắc nghiệp vụ:**
  - **Mỗi tài sản chỉ 1 vị trí** tại một thời điểm. Gán vị trí cho tài sản **đã có vị trí** = **di dời** (ghi lịch sử).
  - **Xóa nút khu vực còn tài sản / khu con:** cho xóa, **gỡ vị trí** các tài sản bên trong (về trạng thái "chưa có vị trí"); **không** xóa hồ sơ tài sản. Hiển thị hộp xác nhận có số lượng bị ảnh hưởng trước khi xóa.
  - **Thay ảnh sơ đồ** cho nút đã có pin: **giữ nguyên tọa độ tương đối** của pin trên ảnh mới.
  - **Đồng thời:** **khóa khi đang sửa** — khi một người đang di dời/gán một tài sản, tạm khóa tài sản đó, người khác không sửa cùng lúc.
- **Giới hạn/định mức (số chính xác):**
  - Ảnh sơ đồ: định dạng **PNG / JPG**, dung lượng **≤ 10 MB** mỗi file.
  - Cây khu vực: **không giới hạn số cấp**.
  - Quy mô tài sản: **5.000 – 50.000**.
- **Wording (đề xuất — chờ xác nhận ở vòng giả định):**
  - Gán thành công: **"Đã gán vị trí cho tài sản."**
  - Di dời thành công (đơn): **"Đã di dời tài sản."** / hàng loạt: **"Đã di dời {n} tài sản."**
  - Xác nhận xóa nút: **"Xóa khu vực này sẽ gỡ vị trí của {n} tài sản và xóa {m} khu vực con. Tiếp tục?"**
  - File sai định dạng/quá lớn: **"Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB."**
  - Đang bị khóa: **"Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."**

## 6. Ngữ cảnh hệ thống
- **Loại thông tin cần lưu:**
  - Nút khu vực: tên, vị trí trong cây (nút cha), ảnh sơ đồ gắn kèm.
  - Pin/vị trí tài sản: tham chiếu tài sản, nút khu vực, **tọa độ tương đối** trên ảnh sơ đồ.
  - Lịch sử di chuyển: tài sản, vị trí cũ → mới, người thực hiện, thời điểm, lý do (nếu có).
  - **Nhật ký kiểm toán (audit log):** mọi thao tác **gán / di dời / xóa** — ai, làm gì, khi nào.
- **Dịch vụ ngoài:** Không có tích hợp ngoài. Phụ thuộc **nội bộ**: module hồ sơ tài sản (tham chiếu mã/tên/trạng thái tài sản có sẵn).
- **Kênh thông báo:** **Không gửi thông báo chủ động** khi di dời; chỉ ghi lịch sử + nhật ký kiểm toán, ai cần thì tự xem.
- **Xử lý nền / real-time:** Không có nhu cầu real-time hay xử lý nền đặc thù ở phiên bản này.

## 7. Edge case & rủi ro
- **Mất mạng / đóng tab giữa chừng:** Khi đang di dời hàng loạt mà gián đoạn — cần đảm bảo hoặc áp dụng trọn vẹn cho cả lô, hoặc không áp dụng (tránh trạng thái nửa vời). *(chi tiết → Open Questions)*
- **Thay ảnh sơ đồ:** Giữ nguyên tọa độ tương đối; pin có thể lệch nếu bố cục ảnh mới khác — chấp nhận. Trường hợp ảnh mới nhỏ hơn khiến pin nằm ngoài vùng → cần xử lý (OQ-04).
- **Người dùng đồng thời:** **Khóa khi đang sửa** một tài sản. Cần cơ chế **tự mở khóa** nếu người dùng bỏ ngang (OQ-03).
- **Sơ đồ quá nhiều pin:** Với 5.000–50.000 tài sản, một sơ đồ đông pin cần **gom cụm/lọc** để không rối (OQ-05).
- **Vòng lặp cây:** Khi sửa cấu trúc, không cho kéo/đặt một nút vào chính nhánh con của nó (tránh cây lặp vô hạn). *(GĐ giả định chặn — OQ-06)*
- **Rủi ro nghiệp vụ:** Dữ liệu vị trí lệch thực tế nếu người dùng không cập nhật khi di dời thật → giảm thiểu bằng thao tác di dời nhanh (chọn theo vị trí cũ, di dời hàng loạt) và nhật ký kiểm toán để truy vết.

## Open Questions
- [ ] **OQ-01:** Định dạng & nội dung **báo cáo / xuất kiểm kê** (Excel hay PDF? gồm cột nào?).
- [ ] **OQ-02:** Nút khu vực có cần trường **"loại khu vực"** (Site / Tòa / Tầng / Phòng) và **mã khu vực** không, hay chỉ cần tên tự do (vì cây không giới hạn cấp)?
- [x] **OQ-03:** ~~Thời gian **tự mở khóa** khi người dùng bỏ ngang (lock timeout)~~ → **đã chốt 5 phút** (GĐ-08).
- [ ] **OQ-04:** Khi giữ tọa độ tương đối mà pin nằm **ngoài vùng ảnh mới** — có cảnh báo / đánh dấu "cần đặt lại" không?
- [ ] **OQ-05:** Ngưỡng và cơ chế **gom cụm (clustering) / lọc pin** khi một sơ đồ quá nhiều điểm — con số cụ thể.
- [ ] **OQ-06:** Hành vi khi di dời **hàng loạt bị gián đoạn** (mất mạng) — áp dụng trọn lô hay rollback?
- [ ] **OQ-07:** Tiêu chí khớp khi tra cứu (khớp mã + tên, khớp một phần/đầy đủ, có dấu/không dấu).

## Giả định
> Mỗi giả định phải được rà & xác nhận (xem "Xác nhận giả định" trong `conventions.md`). Trạng thái: Đề xuất / Đã xác nhận / Đã sửa / Đã bỏ.

| Mã | Giả định | Vì sao cần (chỗ thiếu) | Ảnh hưởng nếu sai | Trạng thái |
|----|----------|------------------------|-------------------|-----------|
| GĐ-01 | Nút khu vực bắt buộc có **Tên khu vực**; mã và loại khu vực là tùy chọn. | Chưa hỏi trường bắt buộc của nút khu vực. | Form tạo/sửa khu vực thiếu/thừa trường, ảnh hưởng cấu trúc dữ liệu. | ✅ Đã xác nhận |
| GĐ-02 | Vị trí pin lưu bằng **tọa độ tương đối (%)** trên ảnh, để giữ vị trí khi thay ảnh. | Suy ra từ quyết định "giữ nguyên tọa độ" khi thay ảnh. | Pin lệch khi đổi ảnh/đổi kích thước hiển thị. | ✅ Đã xác nhận |
| GĐ-03 | Hộp xác nhận xóa nút hiển thị **số tài sản bị gỡ vị trí và số khu vực con bị xóa** trước khi xóa. | Cần chống xóa nhầm nhánh lớn; chưa chốt wording. | Người dùng xóa nhầm, mất dữ liệu vị trí hàng loạt. | ✅ Đã xác nhận |
| GĐ-04 | Nhật ký kiểm toán lưu tối thiểu: **người thực hiện · hành động · tài sản/nút · thời gian · vị trí cũ→mới**. | Đã chốt "có audit log" nhưng chưa chốt nội dung. | Audit thiếu trường, không truy vết được. | ✅ Đã xác nhận |
| GĐ-05 | Khi di dời **hàng loạt**, tất cả tài sản được chọn chuyển về **cùng một đích**. | Luồng di dời hàng loạt chưa nói đích chung hay riêng. | Hiểu sai luồng, thiết kế form di dời sai. | ✅ Đã xác nhận |
| GĐ-06 | Tra cứu khớp **mã + tên** tài sản, **khớp một phần** (substring). | Chưa chốt tiêu chí tìm kiếm (OQ-07). | Tìm kiếm trả kết quả không như mong đợi. | ✅ Đã xác nhận |
| GĐ-07 | Hệ thống **chặn kéo một nút vào nhánh con của chính nó** (tránh cây lặp). | Cây không giới hạn cấp + cho sửa cấu trúc → rủi ro vòng lặp. | Cây hỏng, lỗi đệ quy khi duyệt. | ✅ Đã xác nhận |
| GĐ-08 | **Khóa khi đang sửa** tự mở sau **5 phút** không thao tác nếu người dùng bỏ ngang. | Đã chốt "khóa khi đang sửa" nhưng chưa có thời gian tự mở (OQ-03). | Tài sản bị khóa kẹt, người khác không thao tác được. | ✅ Đã xác nhận |

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| Tài sản cố định | Máy móc/thiết bị có giá trị, dùng lâu dài, cần quản lý vị trí và bảo trì |
| Cây khu vực | Cấu trúc phân cấp các khu vực (chi nhánh/tòa/tầng/phòng…), lồng nhiều cấp |
| Sơ đồ mặt bằng (floor plan) | Ảnh/bản vẽ bố trí của một khu vực, dùng để đính vị trí tài sản |
| Pin | Điểm đánh dấu vị trí của một tài sản trên sơ đồ mặt bằng |
| Di dời | Thao tác đổi vị trí của tài sản đã có vị trí, sinh lịch sử di chuyển |
| Nhật ký kiểm toán (audit log) | Bản ghi ai – làm gì – khi nào, phục vụ truy vết |

> Từ điển đầy đủ toàn dự án sẽ được `ba-requirements` tạo tại `docs/00-glossary.md`.
