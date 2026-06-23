# Tài liệu kiểm thử — Form khu vực (Tạo/Sửa nút) (Mã màn: S02)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S02..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 34 | 0 | 0 | 0 | 0 | 34 | 0% | — |

## Chức năng: Tạo nút khu vực (F01) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S02-01 | Positive | EP | R-S02-01 / UC-S02-01 (b1) / US-S02-01 GWT-1 | Cao | Critical | Đăng nhập Quản trị, ở S01, có nút "Tòa A › Tầng 3" | 1. Bấm "Thêm con" trên nút "Tầng 3"<br>2. Quan sát form | mở từ "Thêm con" nút "Tầng 3" | Modal mở chế độ Tạo, tiêu đề "Thêm khu vực", Tên/Mã/Loại trống, Nút cha đặt sẵn "Tòa A › Tầng 3" | Auto | Chưa chạy |
| TC-S02-02 | Positive | EP | R-S02-01 / UC-S02-01 (b1) | Cao | High | Đăng nhập Quản trị, ở S01 | 1. Bấm "+ Thêm khu vực" ở gốc<br>2. Quan sát Nút cha | mở từ "+ Thêm khu vực" ở gốc | Tiêu đề "Thêm khu vực"; Nút cha = "(Gốc — không có nút cha)"; các trường trống | Auto | Chưa chạy |
| TC-S02-03 | Positive | EP | R-S02-03 / UC-S02-01 (b2-5) / US-S02-01 GWT-2 | Cao | Critical | Form Tạo mở, Nút cha = "Tầng 3" | 1. Nhập Tên "Phòng 307"<br>2. Bấm Lưu | Tên: `Phòng 307` | Tạo nút thành công; "Phòng 307" hiện dưới "Tầng 3" trong cây; modal đóng (fade); toast "Đã thêm khu vực." | Auto | Chưa chạy |
| TC-S02-04 | Positive | EP | R-S02-03, R-S02-07 / US-S02-01 GWT-3 / BRule-S02-04 | Cao | High | Form Tạo mở | 1. Để trống Nút cha<br>2. Nhập Tên "Kho tổng"<br>3. Bấm Lưu | Tên: `Kho tổng`, Nút cha: (trống) | Nút "Kho tổng" được tạo ở cấp gốc của cây; toast "Đã thêm khu vực." | Auto | Chưa chạy |
| TC-S02-05 | Positive | EP | R-S02-03, R-S02-06 / US-S02-05 GWT-2 | Trung bình | Medium | Form Tạo mở | 1. Nhập Tên "Phòng 401"<br>2. Để trống Mã<br>3. Bấm Lưu | Tên: `Phòng 401`, Mã: (trống) | Cho lưu (Mã không bắt buộc); nút tạo thành công | Auto | Chưa chạy |
| TC-S02-06 | Positive | EP | R-S02-09 / FR-01 | Thấp | Low | Form Tạo mở | 1. Nhập Tên "Tầng 5"<br>2. Chọn Loại "Tầng"<br>3. Bấm Lưu | Tên: `Tầng 5`, Loại: `Tầng` | Lưu thành công với Loại "Tầng" | Auto | Chưa chạy |
| TC-S02-07 | Negative | EP | R-S02-N02 / BRule-S02-05 | Cao | Critical | Đăng nhập vai trò Giám sát | 1. Truy cập trực tiếp đường dẫn mở Form khu vực | vai trò: `Giám sát` | Từ chối truy cập; form không hiển thị; không tạo được nút | Manual | Chưa chạy |
| TC-S02-08 | Edge | EP | R-S02-07 / UC-S02-03 (ngoại lệ cây rỗng) | Thấp | Low | Form Tạo mở, cây chưa có nút nào | 1. Mở dropdown Nút cha | cây: (rỗng) | Dropdown chỉ có "(Gốc — không có nút cha)" | Manual | Chưa chạy |

## Chức năng: Sửa nút khu vực (F02) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S02-09 | Positive | EP | R-S02-02 / UC-S02-02 (b1) / US-S02-02 GWT-1 | Cao | Critical | Quản trị, nút "Phòng 305" tồn tại (Mã "P305", Loại "Phòng", cha "Tầng 3") | 1. Chọn "Sửa" trên nút "Phòng 305"<br>2. Quan sát form | nút: `Phòng 305` | Modal Sửa mở < 1s; tiêu đề "Sửa khu vực"; Tên="Phòng 305", Mã="P305", Loại="Phòng", Nút cha="Tòa A › Tầng 3" | Auto | Chưa chạy |
| TC-S02-10 | Positive | EP | R-S02-04 / UC-S02-02 (b3-4) / US-S02-02 GWT-2 | Cao | Critical | Form Sửa "Phòng 305" mở | 1. Đổi Tên thành "Phòng 305A"<br>2. Bấm Lưu | Tên mới: `Phòng 305A` | Lưu thành công; tên nút trong cây cập nhật ngay "Phòng 305A"; toast "Đã cập nhật khu vực." | Auto | Chưa chạy |
| TC-S02-11 | Positive | EP | R-S02-04, R-S02-07 / US-S02-02 GWT-3 | Cao | High | Form Sửa "Phòng 305" mở, tồn tại "Tầng 4" | 1. Đổi Nút cha sang "Tầng 4"<br>2. Bấm Lưu | Nút cha mới: `Tòa A › Tầng 4` | Lưu thành công; nút "Phòng 305" chuyển sang nhánh "Tầng 4" trong cây | Auto | Chưa chạy |
| TC-S02-12 | Positive | DT | R-S02-06 / US-S02-05 GWT-3 | Trung bình | Medium | Form Sửa "Phòng 305" (Mã hiện tại "P305") mở | 1. Giữ nguyên Mã "P305"<br>2. Đổi Loại sang "Khu"<br>3. Bấm Lưu | Mã: `P305` (của chính nút), Loại mới: `Khu` | Không coi "P305" là trùng (mã của chính nút); lưu thành công | Auto | Chưa chạy |
| TC-S02-13 | Negative | EP | UC-S02-02 (ngoại lệ đồng thời) | Trung bình | Medium | Form Sửa "Phòng 306" mở, nút vừa bị người khác xóa | 1. Bấm Lưu | nút bị xóa nền | Thông báo "Khu vực không còn tồn tại"; form đóng; không cập nhật | Manual | Chưa chạy |

## Chức năng: Kiểm tra Tên khu vực (R-S02-05) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S02-14 | Negative | EP | R-S02-05 / UC-S02-01 (ngoại lệ Tên rỗng) / US-S02-03 GWT-1 | Cao | Critical | Form Tạo mở, ô Tên trống | 1. Để trống Tên<br>2. Bấm Lưu | Tên: (rỗng) | Chặn lưu; lỗi inline "Vui lòng nhập tên khu vực" dưới ô Tên; không tạo nút | Auto | Chưa chạy |
| TC-S02-15 | Negative | EP | R-S02-05 / US-S02-03 GWT-2 | Cao | High | Form Tạo mở | 1. Nhập chỉ khoảng trắng<br>2. Bấm Lưu | Tên: `␣␣␣␣␣` (5 dấu cách) | Sau trim coi là rỗng; chặn lưu; lỗi "Vui lòng nhập tên khu vực" | Auto | Chưa chạy |
| TC-S02-16 | Edge | BVA | R-S02-05 / Validation ten_khu_vuc (min) | Trung bình | Medium | Form Tạo mở | 1. Nhập Tên 1 ký tự<br>2. Bấm Lưu | Tên: `A` (1 ký tự — biên min hợp lệ) | Hợp lệ; lưu thành công | Auto | Chưa chạy |
| TC-S02-17 | Edge | BVA | R-S02-05 / Validation ten_khu_vuc (max) | Cao | High | Form Tạo mở | 1. Nhập Tên đúng 150 ký tự<br>2. Bấm Lưu | Tên: chuỗi 150 ký tự "A…A" (biên max hợp lệ) | Hợp lệ; lưu thành công | Auto | Chưa chạy |
| TC-S02-18 | Negative | BVA | R-S02-05 / US-S02-03 GWT-3 / UC-S02-01 (ngoại lệ quá dài) | Cao | High | Form Tạo mở | 1. Nhập Tên 151 ký tự<br>2. Bấm Lưu | Tên: chuỗi 151 ký tự (biên max+1) | Chặn lưu; lỗi "Tên khu vực tối đa 150 ký tự"; không tạo nút | Auto | Chưa chạy |
| TC-S02-19 | Negative | ST | R-S02-05 / design-spec mục 3 (Lưu vô hiệu khi Tên trống) | Cao | High | Form Tạo mở, Tên trống | 1. Quan sát nút Lưu khi Tên rỗng<br>2. Nhập Tên "Phòng 308"<br>3. Quan sát nút Lưu | Tên: (rỗng) → `Phòng 308` | Khi Tên rỗng nút Lưu vô hiệu; sau khi nhập Tên hợp lệ nút Lưu kích hoạt | Auto | Chưa chạy |
| TC-S02-20 | Edge | BVA | R-S02-05 / Validation (Tên có khoảng trắng đầu/cuối) | Trung bình | Medium | Form Tạo mở | 1. Nhập "  Phòng 309  "<br>2. Bấm Lưu | Tên: `␣␣Phòng 309␣␣` | Trim trước khi kiểm tra; lưu với Tên "Phòng 309" (không rỗng) | Manual | Chưa chạy |

## Chức năng: Mã khu vực duy nhất (R-S02-06) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S02-21 | Negative | DT | R-S02-06 / UC-S02-01 (ngoại lệ Mã trùng) / US-S02-05 GWT-1 / BRule-S02-03 | Cao | High | Form Tạo mở, đã tồn tại nút khác có Mã "P305" | 1. Nhập Tên "Phòng 310"<br>2. Nhập Mã "P305"<br>3. Bấm Lưu | Tên: `Phòng 310`, Mã: `P305` (trùng) | Chặn lưu; lỗi inline "Mã khu vực đã tồn tại"; không tạo nút | Auto | Chưa chạy |
| TC-S02-22 | Positive | DT | R-S02-06 / US-S02-05 GWT-2 | Trung bình | Medium | Form Tạo mở | 1. Nhập Tên "Phòng 311"<br>2. Để trống Mã<br>3. Bấm Lưu | Tên: `Phòng 311`, Mã: (trống) | Cho lưu; nút tạo thành công (Mã không bắt buộc) | Auto | Chưa chạy |
| TC-S02-23 | Positive | EP | R-S02-06 | Trung bình | Medium | Form Tạo mở, không có nút nào Mã "P999" | 1. Nhập Tên "Phòng 999"<br>2. Nhập Mã "P999"<br>3. Bấm Lưu | Tên: `Phòng 999`, Mã: `P999` (duy nhất) | Lưu thành công với Mã "P999" | Auto | Chưa chạy |
| TC-S02-24 | Edge | BVA | R-S02-06 / Validation ma_khu_vuc (max) | Thấp | Low | Form Tạo mở | 1. Nhập Tên "Phòng 50"<br>2. Nhập Mã 50 ký tự<br>3. Bấm Lưu | Mã: chuỗi 50 ký tự (biên max hợp lệ) | Lưu thành công | Manual | Chưa chạy |
| TC-S02-25 | Negative | BVA | R-S02-06 / Validation ma_khu_vuc (max+1) | Thấp | Low | Form Tạo mở | 1. Nhập Tên "Phòng 51"<br>2. Nhập Mã 51 ký tự<br>3. Bấm Lưu | Mã: chuỗi 51 ký tự (biên max+1) | Chặn lưu; lỗi "Mã khu vực tối đa 50 ký tự" | Manual | Chưa chạy |

## Chức năng: Chặn cây lặp khi chọn Nút cha (R-S02-08) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S02-26 | Negative | EP | R-S02-08 / UC-S02-02 (ngoại lệ cây lặp) / US-S02-04 GWT-1 / BRule-S02-02 | Cao | Critical | Form Sửa "Tầng 3" mở; "Tầng 3" có con "Phòng 305", "Phòng 306" | 1. Mở dropdown Nút cha<br>2. Tìm "Tầng 3", "Phòng 305", "Phòng 306" trong danh sách | nút sửa: `Tầng 3` | Chính "Tầng 3" và mọi con ("Phòng 305", "Phòng 306") không xuất hiện (ẩn hẳn) để chọn | Auto | Chưa chạy |
| TC-S02-27 | Negative | EP | R-S02-08 / US-S02-04 GWT-2 / UC-S02-02 (ngoại lệ) | Cao | Critical | Form Sửa "Tầng 3" mở | 1. Cố gán Nút cha = "Tầng 3" (chính nó qua thao tác khác/API)<br>2. Bấm Lưu | Nút cha: `Tầng 3` (= chính nút đang sửa) | Chặn lưu; lỗi "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó" | Auto | Chưa chạy |
| TC-S02-28 | Negative | EP | R-S02-08 / BRule-S02-02 | Cao | High | Form Sửa "Tầng 3" mở | 1. Cố gán Nút cha = "Phòng 305" (nhánh con)<br>2. Bấm Lưu | Nút cha: `Phòng 305` (con của nút đang sửa) | Chặn lưu; lỗi "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó" | Auto | Chưa chạy |
| TC-S02-29 | Positive | EP | R-S02-08 / UC-S02-03 | Trung bình | Medium | Form Sửa "Tầng 3" mở | 1. Mở dropdown Nút cha<br>2. Chọn "Tòa B" (ngoài nhánh con) | Nút cha: `Tòa B` | Cho chọn "Tòa B"; lưu được (không gây cây lặp) | Auto | Chưa chạy |
| TC-S02-30 | Edge | EP | R-S02-07 / UC-S02-03 (lọc tìm kiếm) | Thấp | Low | Form mở, dropdown Nút cha có ô tìm kiếm | 1. Gõ "Tầng" vào ô tìm | từ khóa: `Tầng` | Lọc hiển thị các nút khớp một phần tên "Tầng" (vd "Tầng 3", "Tầng 4") | Manual | Chưa chạy |

## Chức năng: Hủy / đóng form không lưu (R-S02-10) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S02-31 | Positive | ST | R-S02-10 / UC-S02-04 (b2) / US-S02-06 GWT-1 | Trung bình | Medium | Form Tạo mở, chưa nhập gì | 1. Bấm Hủy (hoặc nhấn nền tối) | chưa sửa dữ liệu | Form đóng ngay (fade về S01); không hỏi xác nhận; không tạo nút | Auto | Chưa chạy |
| TC-S02-32 | Negative | ST | R-S02-10 / UC-S02-04 (b3) / US-S02-06 GWT-2 | Trung bình | High | Form Tạo mở, đã nhập Tên "Phòng 312" | 1. Bấm Hủy<br>2. Quan sát dialog | Tên đã nhập: `Phòng 312` | Hệ thống hỏi "Bỏ thay đổi chưa lưu?"; chọn ở lại → giữ nguyên dữ liệu "Phòng 312" | Auto | Chưa chạy |
| TC-S02-33 | Positive | ST | R-S02-10 / UC-S02-04 (xác nhận bỏ) | Trung bình | Medium | Form Sửa đã đổi Tên, dialog "Bỏ thay đổi chưa lưu?" đang mở | 1. Xác nhận bỏ thay đổi | xác nhận: `Có` | Đóng modal không lưu; nút không bị cập nhật; quay về S01 | Auto | Chưa chạy |
| TC-S02-34 | Negative | EP | UC-S02-01 (ngoại lệ rớt mạng) / design-spec mục 6 | Trung bình | High | Form Tạo mở, Tên "Phòng 313" đã nhập, mạng bị ngắt | 1. Bấm Lưu khi mất kết nối | Tên: `Phòng 313`, mạng: ngắt | Snackbar "Lỗi kết nối, chưa lưu được."; giữ nguyên dữ liệu đã nhập; không tạo nút nửa vời | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện → DT; có luồng trạng thái → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi hoặc cột ghi chú nếu thêm).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S02-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: min, min+1, max-1, max |
| DT (Decision Table) | Bảng quyết định — liệt kê tổ hợp điều kiện → kết quả |
| ST (State Transition) | Kiểm thử chuyển trạng thái hợp lệ và không hợp lệ |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Cây lặp | Lỗi cấu trúc khi một nút thành con của chính nó/nhánh con của nó |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
