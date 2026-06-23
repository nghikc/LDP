# Tài liệu kiểm thử — Nhật ký kiểm toán (Mã màn: S07)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S07..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 27 | 21 | 0 | 0 | 0 | 6 | 78% | 2026-06-23 |

### Ma trận truy vết (coverage) — nguồn → TC
| Nguồn | TC |
|-------|----|
| R-S07-01 (hiển thị bảng) | TC-S07-01, TC-S07-02, TC-S07-03 |
| R-S07-02 (lọc người) | TC-S07-04 |
| R-S07-03 (lọc hành động) | TC-S07-05 |
| R-S07-04 (lọc thời gian) | TC-S07-06, TC-S07-07, TC-S07-08 |
| R-S07-05 (lọc đối tượng) | TC-S07-09, TC-S07-10, TC-S07-11 |
| R-S07-06 (tổ hợp lọc AND / Xóa lọc) | TC-S07-12, TC-S07-13, TC-S07-14 |
| R-S07-07 (phân trang) | TC-S07-15, TC-S07-16, TC-S07-17 |
| R-S07-08 (sắp xếp) | TC-S07-18, TC-S07-19 |
| R-S07-09 (quay lại S01) | TC-S07-20 |
| R-S07-N01 / BRule-S07-02 (phân quyền) | TC-S07-21, TC-S07-22, TC-S07-23, TC-S07-24 |
| R-S07-N02 (hiệu năng) | TC-S07-25 |
| R-S07-N03 / BRule-S07-01 (bất biến/append-only) | TC-S07-26 |
| R-S07-N04 (truy vết đầy đủ) | TC-S07-02 |
| BRule-S07-04 (vị trí "—" cho Xóa) | TC-S07-03 |
| Kết quả rỗng | TC-S07-11 |
| Loại trừ ngoại lệ tải lỗi (UC-S07-01) | TC-S07-27 |

---

## Chức năng: Hiển thị bảng nhật ký kiểm toán (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-01 | Positive | EP | R-S07-01 / US-S07-01 GWT-1 / UC-S07-01 | Cao | Critical | Đăng nhập vai trò Quản trị; kho có ≥1 bản ghi | 1. Mở màn Nhật ký kiểm toán từ S01<br>2. Chờ tải xong | Tài khoản `admin@ngocdung.net` (Quản trị); kho 1.284 bản ghi | Bảng hiển thị bản ghi sắp xếp mới nhất trước; mỗi dòng đủ: thời điểm, người, hành động, đối tượng, vị trí cũ→mới | Auto | Pass |
| TC-S07-02 | Positive | DT | R-S07-01, R-S07-N04 / US-S07-01 GWT-1 | Cao | High | Như TC-S07-01 | 1. Đọc một dòng "Di dời"<br>2. Kiểm tra đủ 5 trường truy vết | Bản ghi: `22/06 14:32:10 · Nguyễn Văn A · Di dời · TS A-007 Máy nén · Tầng 3·P305 → Tầng 4·P410` | Dòng hiển thị đủ người·hành động·đối tượng·thời gian·vị trí cũ→mới, không thiếu trường | Manual | Chưa chạy |
| TC-S07-03 | Edge | DT | R-S07-01, BRule-S07-04 / US-S07-01 GWT-2 | Trung bình | Medium | Có ≥1 bản ghi hành động "Xóa" | 1. Tìm dòng hành động "Xóa"<br>2. Đọc cột Vị trí cũ→mới | Bản ghi: `21/06 16:45:02 · Nguyễn Văn A · Xóa · Khu vực "P309"` | Cột Vị trí cũ→mới hiển thị "—" (không để trống gây hiểu nhầm thiếu dữ liệu) | Auto | Pass |

## Chức năng: Lọc theo người thực hiện (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-04 | Positive | EP | R-S07-02 / US-S07-02 GWT-1 / UC-S07-02 | Cao | High | Quản trị; có bản ghi của nhiều người | 1. Chọn Người thực hiện = "Nguyễn Văn A"<br>2. Nhấn [Áp dụng lọc] | Người: `Nguyễn Văn A` | Bảng chỉ còn bản ghi do Nguyễn Văn A thực hiện; bản ghi của Trần Thị B không xuất hiện | Auto | Pass |

## Chức năng: Lọc theo loại hành động (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-05 | Positive | EP | R-S07-03 / US-S07-02 GWT-2 / UC-S07-02 | Cao | High | Quản trị; có bản ghi đủ 3 loại | 1. Chọn Hành động = "Di dời"<br>2. Nhấn [Áp dụng lọc] | Hành động: `Di dời` | Bảng chỉ còn bản ghi loại "Di dời"; loại "Gán" và "Xóa" không xuất hiện | Auto | Pass |

## Chức năng: Lọc theo khoảng thời gian (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-06 | Positive | EP | R-S07-04 / US-S07-03 GWT-1 / UC-S07-02 | Cao | High | Quản trị | 1. Nhập Từ ngày `01/06/2026`, Đến ngày `22/06/2026`<br>2. Nhấn [Áp dụng lọc] | Từ: `01/06/2026`, Đến: `22/06/2026` | Bảng chỉ còn bản ghi có thời điểm trong [01/06; 22/06]; không có bản ghi ngày 30/05 hay 25/06 | Auto | Pass |
| TC-S07-07 | Negative | DT | R-S07-04, BRule-S07-05 / US-S07-03 GWT-2 / UC-S07-02 (ngoại lệ) | Cao | High | Quản trị | 1. Nhập Từ ngày `22/06/2026`, Đến ngày `01/06/2026`<br>2. Quan sát nút và thông báo | Từ: `22/06/2026`, Đến: `01/06/2026` (Từ > Đến) | Lỗi inline "Từ ngày phải nhỏ hơn hoặc bằng Đến ngày."; nút [Áp dụng lọc] disable; không nạp lại bảng | Auto | Pass |
| TC-S07-08 | Edge | BVA | R-S07-04, BRule-S07-05 | Trung bình | Medium | Quản trị | 1. Nhập Từ ngày = Đến ngày<br>2. Nhấn [Áp dụng lọc] | Từ: `15/06/2026`, Đến: `15/06/2026` (biên Từ = Đến) | Hợp lệ (Từ ≤ Đến): bảng trả bản ghi trong đúng ngày 15/06/2026 | Auto | Pass |

## Chức năng: Lọc theo từ khóa đối tượng (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-09 | Positive | EP | R-S07-05 / US-S07-04 GWT-1 / UC-S07-02 | Cao | High | Quản trị | 1. Gõ "A-007" vào ô Đối tượng<br>2. Nhấn [Áp dụng lọc] | Từ khóa: `A-007` | Bảng chỉ còn bản ghi có đối tượng khớp một phần "A-007" (vd TS A-007 Máy nén) | Auto | Pass |
| TC-S07-10 | Negative | BVA | R-S07-05 / US-S07-04 GWT-2 | Trung bình | Medium | Quản trị | 1. Nhập 101 ký tự vào ô Đối tượng | Chuỗi 101 ký tự `aaaa…a` (max 100) | Chặn nhập quá / báo "Nhập tối đa 100 ký tự."; không gửi lọc | Auto | Pass |
| TC-S07-11 | Edge | EP | R-S07-05 / US-S07-04 GWT-3 / UC-S07-02 (kết quả rỗng) | Cao | High | Quản trị | 1. Gõ "Z-999-không-tồn-tại"<br>2. Nhấn [Áp dụng lọc] | Từ khóa: `Z-999-không-tồn-tại` | Trạng thái rỗng: "Không có bản ghi phù hợp." + gợi ý nới điều kiện; bảng không có dòng nào | Auto | Pass |

## Chức năng: Tổ hợp bộ lọc (AND) & Xóa lọc (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-12 | Positive | DT | R-S07-06 / US-S07-02 GWT-3 / UC-S07-02 | Cao | Critical | Quản trị; có dữ liệu đa dạng | 1. Người = "Nguyễn Văn A"<br>2. Hành động = "Di dời"<br>3. Từ `01/06/2026` Đến `30/06/2026`<br>4. [Áp dụng lọc] | Người: `Nguyễn Văn A`; Hành động: `Di dời`; khoảng: `01/06–30/06/2026` (tổ hợp 4 điều kiện) | Bảng chỉ còn bản ghi "Di dời" của "Nguyễn Văn A" trong 06/2026 (giao nhau AND); không có bản ghi của Trần Thị B hay loại Gán/Xóa | Auto | Pass |
| TC-S07-13 | Edge | DT | R-S07-06 | Trung bình | Medium | Quản trị | 1. Người = "Trần Thị B"<br>2. Hành động = "Xóa"<br>3. [Áp dụng lọc] (giả sử B chưa từng Xóa) | Người: `Trần Thị B`; Hành động: `Xóa` (tổ hợp không có giao) | Trạng thái rỗng "Không có bản ghi phù hợp." dù từng điều kiện riêng đều có dữ liệu (AND giao rỗng) | Auto | Pass |
| TC-S07-14 | Positive | ST | R-S07-06 / UC-S07-02 | Cao | High | Đang có bộ lọc đã áp dụng (từ TC-S07-12) | 1. Nhấn [Xóa lọc] | — (không nhập gì) | Mọi điều kiện về mặc định ("Tất cả"/trống); bảng nạp lại đầy đủ 1.284 bản ghi, sắp xếp mới nhất trước | Auto | Pass |

## Chức năng: Phân trang & sắp xếp (F19) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-15 | Positive | EP | R-S07-07 / US-S07-05 GWT-1 / UC-S07-03 | Trung bình | High | Quản trị; kết quả 1.284 bản ghi | 1. Mở màn, quan sát thanh phân trang | Tổng: `1.284 bản ghi` | "Hiển thị 1–25 / 1.284 bản ghi."; 25 dòng/trang; Trang 1/52 | Auto | Pass |
| TC-S07-16 | Positive | ST | R-S07-07 / US-S07-05 GWT-2 / UC-S07-03 | Trung bình | Medium | Đang ở trang 1 có bộ lọc đã áp dụng | 1. Nhấn [Sau ›] | Bộ lọc Hành động = `Di dời` đang áp | Bảng nạp trang 2; giữ nguyên điều kiện lọc "Di dời"; "Hiển thị 26–50 / …" | Auto | Pass |
| TC-S07-17 | Edge | BVA | R-S07-07 / UC-S07-03 (ngoại lệ 1 trang) | Trung bình | Medium | Kết quả ≤ 25 bản ghi | 1. Lọc trả về 8 bản ghi<br>2. Quan sát phân trang | Lọc đối tượng cho ra `8 bản ghi` (< 25) | Điều hướng phân trang ẩn/khóa (Trước/Sau disable); "Hiển thị 1–8 / 8 bản ghi." | Auto | Pass |
| TC-S07-18 | Positive | ST | R-S07-08 / US-S07-05 GWT-3 / UC-S07-03 | Thấp | Medium | Quản trị; bảng mặc định giảm dần | 1. Click tiêu đề cột "Thời điểm" | — | Đảo sang tăng dần (cũ nhất trước); mũi tên hướng đổi; trạng thái sắp xếp hiển thị rõ | Auto | Pass |
| TC-S07-19 | Positive | ST | R-S07-08 / UC-S07-03 | Thấp | Low | Vừa sắp xếp tăng dần (từ TC-S07-18) | 1. Click lại tiêu đề cột "Thời điểm" | — | Trở lại giảm dần (mới nhất trước); mũi tên đảo lại | Manual | Chưa chạy |

## Chức năng: Quay lại Bản đồ tài sản (F19) — Risk: Thấp

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-20 | Positive | ST | R-S07-09 / UC-S07-05 | Thấp | Medium | Đang ở màn S07 (Quản trị) | 1. Nhấn "← Bản đồ tài sản" | — | Panel slide-out sang phải + fade; trở về S01 giữ nguyên ngữ cảnh trước đó | Auto | Pass |

## Chức năng: Phân quyền truy cập (F19) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-21 | Negative | ST | R-S07-N01, BRule-S07-02 / US-S07-06 GWT-1 / UC-S07-04 (ngoại lệ) | Cao | Critical | Đăng nhập **vai trò Giám sát** | 1. Cố mở (điều hướng tới) màn Nhật ký kiểm toán | Tài khoản `giamsat@ngocdung.net` (Giám sát) | Màn từ chối: "Bạn không có quyền xem nhật ký kiểm toán. Khu vực này chỉ dành cho vai trò Quản trị."; **không trả về bản ghi nào** | Auto | Pass |
| TC-S07-22 | Negative | ST | R-S07-N01 / UC-S07-04 | Cao | Critical | Giám sát ở màn từ chối (từ TC-S07-21) | 1. Mở DevTools/network, kiểm tra payload trả về | Tài khoản `giamsat@ngocdung.net` | Truy vấn dữ liệu bị chặn ở backend: response không chứa bất kỳ bản ghi kiểm toán nào (chặn cả giao diện lẫn dữ liệu) | Manual | Chưa chạy |
| TC-S07-23 | Negative | DT | R-S07-N01 / US-S07-06 GWT-2 / UC-S07-04 | Cao | High | Giám sát đăng nhập ở S01 | 1. Quan sát điều hướng/menu ở Bản đồ tài sản | Tài khoản `giamsat@ngocdung.net` | Lối vào màn Nhật ký kiểm toán bị ẩn hoàn toàn khỏi điều hướng của Giám sát | Auto | Pass |
| TC-S07-24 | Positive | ST | R-S07-N01 / US-S07-06 GWT-3 / UC-S07-04, UC-S07-05 | Trung bình | Medium | Giám sát ở màn từ chối | 1. Nhấn "← Bản đồ tài sản" trên màn từ chối | Tài khoản `giamsat@ngocdung.net` | Trở về S01; không lộ bất kỳ dữ liệu kiểm toán nào | Auto | Pass |

## Chức năng: Phi chức năng — Hiệu năng / Bất biến / Tải lỗi (F19)

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S07-25 | Edge | BVA | R-S07-N02 | Trung bình | Medium | Kho mức trần 50.000 tài sản | 1. Tải trang đầu (25 bản ghi)<br>2. Áp một bộ lọc, đo thời gian phản hồi | Kho `50.000 tài sản`; lọc Hành động = `Gán` | Trang đầu và kết quả lọc trả về **< 2 giây** | Manual | Chưa chạy |
| TC-S07-26 | Negative | ST | R-S07-N03, BRule-S07-01 / US-S07-01 GWT-3 | Cao | High | Quản trị đang xem bảng | 1. Rà toàn bảng tìm nút Sửa/Xóa dòng<br>2. Thử gọi API ghi/sửa bản ghi (nếu lộ) | Bản ghi `22/06 14:32:10 · Di dời` | Không có nút Sửa/Xóa nào (chỉ đọc); mọi API tạo/sửa/xóa bản ghi bị từ chối (append-only bất biến) | Manual | Chưa chạy |
| TC-S07-27 | Negative | ST | UC-S07-01 (ngoại lệ tải lỗi) / R-S07-N02 | Trung bình | Medium | Quản trị; mô phỏng lỗi tải | 1. Ngắt mạng / mô phỏng 500 khi tải nhật ký<br>2. Quan sát màn | Mô phỏng lỗi server 500 | Trạng thái lỗi: "Không tải được nhật ký. Vui lòng thử lại." + nút [Thử lại] | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện → DT; có luồng trạng thái → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi hoặc cột ghi chú nếu thêm).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S07-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: min, min+1, max-1, max |
| DT (Decision Table) | Bảng quyết định — liệt kê tổ hợp điều kiện → kết quả (dùng cho tổ hợp bộ lọc AND) |
| ST (State Transition) | Kiểm thử chuyển trạng thái hợp lệ và không hợp lệ (dùng cho phân quyền, phân trang, sắp xếp) |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Append-only (chỉ thêm) | Dữ liệu kiểm toán chỉ thêm, không sửa/xóa — bất biến để truy vết |
| Nhật ký kiểm toán (audit log) | Bản ghi ai–làm gì–khi nào cho mọi thao tác gán/di dời/xóa |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
