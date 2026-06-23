# Tài liệu kiểm thử — Bản đồ tài sản (Workspace) (Mã màn: S01)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S01-..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 42 | 24 | 0 | 0 | 0 | 18 | 57% | 2026-06-23 |

> 24 TC `Auto` đã Pass (Vitest: 46 test / 7 file). 18 TC `Manual` còn `Chưa chạy` → checklist test tay ở báo cáo dev. Một số TC Manual (TC-18 gán khi khóa, TC-21 biên tọa độ, TC-25 gỡ khi khóa, TC-35 kéo nút vào chính nó) đã phủ gián tiếp ở tầng logic.

## Chức năng: Xem/duyệt cây khu vực (F04) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-01 | Positive | EP | R-S01-01 / UC-S01-06 | Cao | Critical | Đã đăng nhập, có cây khu vực | 1. Mở workspace S01<br>2. Quan sát cột trái | Cây: "Tòa A" › "Tầng 3" › "Phòng 305", "Phòng 306"; "Tầng 4"; "Tòa B" | Cây hiển thị đúng quan hệ cha-con, các nhánh đóng mặc định ở cấp ngoài | Auto | Pass |
| TC-S01-02 | Positive | ST | R-S01-01 / UC-S01-06 | Cao | High | Đang ở workspace | 1. Click icon ▸ của "Tòa A"<br>2. Click ▾ của "Tòa A" | Nút "Tòa A" | Lần 1: nhánh mở, hiện "Tầng 3", "Tầng 4"; lần 2: nhánh đóng, ẩn con | Auto | Pass |
| TC-S01-03 | Edge | BVA | R-S01-01 | Trung bình | Medium | Có cây lồng sâu | 1. Mở nhánh tới cấp sâu nhất | Cấu trúc 6 cấp: "Tòa A › Tầng 3 › Phòng 305 › Kệ 01 › Ngăn 02 › Ô A1" | Cây lồng được không giới hạn cấp, hiển thị đúng tất cả cấp, không cắt | Manual | Chưa chạy |
| TC-S01-04 | Edge | EP | R-S01-01 / UC-S01-06 (ngoại lệ) | Trung bình | Medium | Tài khoản chưa có khu vực nào | 1. Mở workspace với cây trống | (không có nút nào) | Hiện trạng thái rỗng + CTA "Tạo khu vực đầu tiên" (vai trò Quản trị) | Manual | Chưa chạy |

## Chức năng: Xem sơ đồ mặt bằng (F09) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-05 | Positive | EP | R-S01-02 / US-S01-06 GWT-1 / UC-S01-06 | Cao | Critical | Nút có ảnh sơ đồ | 1. Click nút "Phòng 305"<br>2. Đo thời gian render | Nút "Phòng 305" có sơ đồ + 5 pin (A-001, A-007, A-009, A-014, cụm 23) | Khung giữa hiển thị ảnh + pin trong < 2 giây, breadcrumb "Tòa A › Tầng 3 › Phòng 305" | Auto | Pass |
| TC-S01-06 | Negative | EP | R-S01-02 / US-S01-06 GWT-3 / UC-S01-06 (ngoại lệ) | Cao | High | Nút chưa gắn ảnh sơ đồ | 1. Click nút "Phòng 306" (chưa có ảnh) | Nút "Phòng 306" không có sơ đồ | Khung giữa hiện "Chưa có sơ đồ" + CTA "Tải ảnh sơ đồ" (Quản trị) | Auto | Pass |
| TC-S01-07 | Negative | EP | R-S01-02 / Design-spec Error | Cao | High | Nút có ảnh nhưng tải lỗi | 1. Click nút có ảnh<br>2. Mô phỏng tải ảnh thất bại (HTTP 500) | Nút "Phòng 305", server trả lỗi tải ảnh | Hiện "Không tải được sơ đồ" + nút "Thử lại" | Manual | Chưa chạy |
| TC-S01-08 | Edge | BVA | R-S01-N01 | Cao | High | Khu vực dữ liệu lớn | 1. Mở sơ đồ khu vực có 50.000 tài sản | Khu vực "Kho trung tâm" với 50.000 tài sản | Hệ thống vẫn render được, không treo; thời gian mở sơ đồ < 2 giây (gom cụm) | Manual | Chưa chạy |
| TC-S01-09 | Edge | ST | R-S01-02 / Design-spec Loading | Trung bình | Medium | Mạng chậm | 1. Click nút khi mạng giả lập chậm | Nút "Phòng 305", độ trễ mạng 1.5s | Hiện skeleton cây + spinner/placeholder mờ khung sơ đồ trong khi tải | Manual | Chưa chạy |

## Chức năng: Gom cụm/lọc pin (F10) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-10 | Positive | BVA | R-S01-05 / US-S01-06 GWT-2 | Trung bình | High | Sơ đồ có 501 pin | 1. Mở sơ đồ vượt ngưỡng gom cụm | Sơ đồ "Tầng 3" với 501 pin (501 = 500+1) | Pin gần nhau gộp thành cụm hiển thị số đếm (vd ⨁ 23) | Auto | Pass |
| TC-S01-11 | Negative | BVA | R-S01-05 | Trung bình | Medium | Sơ đồ có đúng 500 pin | 1. Mở sơ đồ ngay ngưỡng | Sơ đồ "Tầng 4" với 500 pin (= max không gom) | Không gom cụm, hiển thị 500 pin rời | Auto | Pass |
| TC-S01-12 | Positive | ST | R-S01-05 / US-S01-06 GWT-2 | Trung bình | Medium | Đang xem cụm pin | 1. Click cụm "⨁ 23"<br>2. Quan sát | Cụm "⨁ 23" tại tọa độ (62%, 48%) | Cụm tách/zoom, các pin tỏa ra từ tâm cụm hiển thị riêng | Manual | Chưa chạy |
| TC-S01-13 | Positive | DT | R-S01-05 | Trung bình | Medium | Sơ đồ nhiều pin trạng thái khác nhau | 1. Mở "Lọc pin"<br>2. Chọn "Cần đặt lại"<br>3. Áp dụng | Lọc theo trạng thái = "Cần đặt lại" (3 pin: A-031, A-052, A-077) | Chỉ hiển thị 3 pin "cần đặt lại", ẩn pin khác | Auto | Pass |

## Chức năng: Gán vị trí tài sản (F11) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-14 | Positive | EP | R-S01-06 / US-S01-02 GWT-1 / UC-S01-02 | Cao | Critical | Nút "Phòng 305" có sơ đồ; tồn tại tài sản chưa có vị trí | 1. Click điểm trống trên sơ đồ tại (40%, 55%) | Tài sản chưa vị trí: "B-021 · Máy bơm", "B-045 · Tủ điện" | Ô tìm mở ra, chỉ liệt kê "B-021 · Máy bơm" và "B-045 · Tủ điện" | Auto | Pass |
| TC-S01-15 | Positive | EP | R-S01-06 / US-S01-02 GWT-2 / UC-S01-02 | Cao | Critical | Ô gán đang mở tại (40%, 55%) | 1. Chọn "B-021 · Máy bơm"<br>2. Nhấn "Gán vị trí" | Tài sản "B-021 · Máy bơm", tọa độ x=40, y=55 | Pin xuất hiện đúng điểm (40%,55%), toast "Đã gán vị trí cho tài sản.", ghi nhật ký kiểm toán | Auto | Pass |
| TC-S01-16 | Negative | DT | R-S01-06 / BRule-S01-01 | Cao | High | Ô gán đang mở | 1. Quan sát danh sách trong ô tìm | Tài sản "A-007 · Máy nén khí" (ĐÃ có vị trí) | "A-007 · Máy nén khí" KHÔNG xuất hiện trong danh sách (chỉ tài sản chưa có vị trí) | Auto | Pass |
| TC-S01-17 | Negative | DT | R-S01-06 / yêu cầu dữ liệu `tai_san_chon` | Cao | High | Ô gán đang mở, chưa chọn tài sản | 1. Nhấn "Gán vị trí" khi chưa chọn | tai_san_chon: (trống) | Chặn gán / nút disable, báo "Vui lòng chọn một tài sản chưa có vị trí" | Auto | Pass |
| TC-S01-18 | Negative | ST | R-S01-06 / US-S01-02 GWT-3 / UC-S01-02 (ngoại lệ) | Cao | High | Tài sản vừa bị người khác khóa | 1. Chọn "B-045 · Tủ điện" (đang bị khóa)<br>2. Nhấn "Gán vị trí" | "B-045 · Tủ điện" đang bị người khác khóa | Báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.", không tạo pin | Manual | Chưa chạy |
| TC-S01-19 | Negative | EP | R-S01-06 / UC-S01-02 (ngoại lệ) | Trung bình | Medium | Ô gán mở với pin tạm | 1. Click điểm trống<br>2. Nhấn "Hủy" | Điểm trống (40%,55%) | Pin tạm bị xóa, ô đóng, không tạo pin | Auto | Pass |
| TC-S01-20 | Negative | EP | R-S01-06 / UC-S01-02 (ngoại lệ) | Trung bình | Medium | Nút chưa có sơ đồ | 1. Mở nút "Phòng 306" (chưa có ảnh)<br>2. Thử click vùng giữa | Nút "Phòng 306" không có ảnh | Thao tác gán bị ẩn, gợi ý tải ảnh (→ S03), không mở ô gán | Manual | Chưa chạy |
| TC-S01-21 | Edge | BVA | R-S01-06 / `toa_do_pin_x`/`toa_do_pin_y` | Trung bình | Medium | Ô gán đang mở | 1. Click sát mép ngoài ảnh tại (0%, 100%) rồi tại (101% giả lập) | toạ độ biên: x=0,y=100 (hợp lệ) và x=101 (ngoài) | x=0,y=100 → gán được; x=101 → báo "Vị trí nằm ngoài sơ đồ" | Manual | Chưa chạy |
| TC-S01-22 | Negative | EP | R-S01-06 / Design-spec Edge (rớt mạng) | Trung bình | Medium | Đang gán, mất kết nối | 1. Chọn "B-021 · Máy bơm"<br>2. Nhấn "Gán vị trí" khi mất mạng | "B-021 · Máy bơm", mạng ngắt giữa chừng | Giữ thao tác đang nhập, snackbar "Lỗi kết nối, chưa lưu được", không tạo pin nửa vời | Manual | Chưa chạy |

## Chức năng: Gỡ vị trí tài sản (F14) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-23 | Positive | ST | R-S01-07 / US-S01-03 GWT-1 / UC-S01-03 | Cao | Critical | Pin "A-007" đang có vị trí | 1. Click pin "A-007"<br>2. Chọn "Gỡ vị trí"<br>3. Xác nhận | Pin "A-007 · Máy nén khí" tại "Tòa A › Tầng 3 › Phòng 305" | Pin biến mất, tài sản A-007 về "chưa có vị trí" | Auto | Pass |
| TC-S01-24 | Positive | EP | R-S01-07 / US-S01-03 GWT-2 / R-S01-N03 | Cao | High | Vừa gỡ A-007 thành công | 1. Mở nhật ký kiểm toán | Tài sản "A-007", người dùng giangnb, thời điểm gỡ | Có bản ghi nhật ký kiểm toán: ai (giangnb), hành động (gỡ vị trí), khi nào | Auto | Pass |
| TC-S01-25 | Negative | DT | R-S01-07 / R-S01-N04 / UC-S01-03 (ngoại lệ) | Cao | High | Pin "A-009" đang bị người khác khóa | 1. Click pin "A-009" (đang khóa)<br>2. Chọn "Gỡ vị trí" | Pin "A-009 · Băng tải" đang khóa | Báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.", không gỡ | Manual | Chưa chạy |
| TC-S01-26 | Negative | EP | R-S01-07 / UC-S01-03 (ngoại lệ) | Trung bình | Medium | Popup pin mở, dialog gỡ hiện | 1. Click pin "A-007"<br>2. Chọn "Gỡ vị trí"<br>3. Nhấn "Hủy" | Pin "A-007 · Máy nén khí" | Dialog đóng, pin giữ nguyên, tài sản vẫn "đã có vị trí" | Auto | Pass |

## Chức năng: Tra cứu nhanh tài sản (F16) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-27 | Positive | EP | R-S01-03 / US-S01-01 GWT-1 / UC-S01-01 / R-S01-N02 | Cao | Critical | Đang ở workspace; tồn tại "Máy nén khí" | 1. Gõ "may nen" vào ô tra cứu<br>2. Đo thời gian | Từ khóa: `may nen` (không dấu) | Gợi ý "A-007 · Máy nén khí" hiện trong < 1 giây (khớp không dấu) | Auto | Pass |
| TC-S01-28 | Positive | ST | R-S01-03 / US-S01-01 GWT-2 / UC-S01-01 | Cao | Critical | Gợi ý đang hiện | 1. Chọn "A-007 · Máy nén khí" (đã có vị trí) | Tài sản "A-007 · Máy nén khí" có vị trí ở "Phòng 305" | Sơ đồ khu vực tự mở, pin A-007 làm nổi (pulse), breadcrumb "Tòa A › Tầng 3 › Phòng 305" | Auto | Pass |
| TC-S01-29 | Negative | EP | R-S01-03 / US-S01-01 GWT-3 / UC-S01-01 (ngoại lệ) | Cao | High | Tồn tại tài sản chưa có vị trí | 1. Gõ "B-021"<br>2. Chọn "B-021 · Máy bơm" (chưa có vị trí) | Tài sản "B-021 · Máy bơm" chưa có vị trí | Hiện đường dẫn "Chưa gán vị trí", KHÔNG mở sơ đồ | Auto | Pass |
| TC-S01-30 | Negative | EP | R-S01-03 / UC-S01-01 (ngoại lệ) / Design-spec Error | Cao | High | Đang ở workspace | 1. Gõ "ZZZ-999" (không tồn tại) | Từ khóa: `ZZZ-999` | Hiện "Không tìm thấy tài sản." | Auto | Pass |
| TC-S01-31 | Edge | BVA | R-S01-03 / `tu_khoa_tra_cuu` | Trung bình | Medium | Đang ở workspace | 1. Gõ 1 ký tự, rồi 100 ký tự, rồi 101 ký tự | Lần lượt: `A` (1 ký tự, min), chuỗi 100 ký tự "A"×100 (max), chuỗi 101 ký tự (vượt) | 1 ký tự → trả gợi ý; 100 ký tự → chấp nhận; 101 ký tự → chặn/cắt, báo "Nhập tối đa 100 ký tự" | Manual | Chưa chạy |
| TC-S01-32 | Edge | EP | R-S01-03 / Design-spec Edge | Thấp | Low | Tài sản tên rất dài | 1. Chọn tài sản tên dài | "A-118 · Máy điều hòa trung tâm khu vực sản xuất tầng hầm B2 phân xưởng phía Đông" | Tên cắt "..." trên breadcrumb + tooltip đầy đủ khi hover | Manual | Chưa chạy |

## Chức năng: Di chuyển nút trong cây (F05) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-33 | Positive | EP | R-S01-08 / US-S01-04 GWT-1 / UC-S01-04 | Trung bình | High | Vai trò Quản trị | 1. Kéo nút "Phòng 305" thả vào "Tầng 4" | Nút "Phòng 305" (đang dưới "Tầng 3") → thả vào "Tầng 4" | Quan hệ cha-con cập nhật ("Phòng 305" thuộc "Tầng 4"), cây render lại | Auto | Pass |
| TC-S01-34 | Negative | ST | R-S01-08 / US-S01-04 GWT-2 / BRule-S01-02 / UC-S01-04 (ngoại lệ) | Trung bình | High | Vai trò Quản trị | 1. Kéo nút "Tòa A" thả vào "Phòng 305" (là con của nó) | Nút "Tòa A" thả vào "Phòng 305" (nhánh con) | Chặn, báo "Không thể di chuyển khu vực vào chính nhánh con của nó.", cây không hỏng | Auto | Pass |
| TC-S01-35 | Edge | EP | R-S01-08 / BRule-S01-02 | Trung bình | Medium | Vai trò Quản trị | 1. Kéo nút "Tầng 3" thả vào chính "Tầng 3" | Nút "Tầng 3" thả vào chính nó | Chặn, báo "Không thể di chuyển khu vực vào chính nhánh con của nó.", giữ nguyên | Manual | Chưa chạy |
| TC-S01-36 | Negative | DT | R-S01-08 / BRule-S01-04 / UC-S01-04 (ngoại lệ) | Trung bình | Medium | Vai trò Giám sát | 1. Đăng nhập vai trò Giám sát<br>2. Thử kéo nút "Phòng 305" | Vai trò = Giám sát | Không có thao tác kéo-thả (bị vô hiệu), cấu trúc không đổi | Manual | Chưa chạy |

## Chức năng: Xóa nút khu vực (F03) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-37 | Positive | EP | R-S01-09 / US-S01-05 GWT-1 / UC-S01-05 | Cao | Critical | Vai trò Quản trị; nút "Tầng 3" có 12 tài sản, 3 khu con | 1. Mở menu ⋮ nút "Tầng 3"<br>2. Chọn "Xóa" | Nút "Tầng 3": 12 tài sản, 3 khu con | Dialog ghi rõ "Xóa khu vực này sẽ gỡ vị trí của 12 tài sản và xóa 3 khu vực con. Tiếp tục?" | Auto | Pass |
| TC-S01-38 | Positive | EP | R-S01-09 / US-S01-05 GWT-2 / BRule-S01-03 / R-S01-N03 / UC-S01-05 | Cao | Critical | Dialog xóa "Tầng 3" đang mở | 1. Nhấn "Tiếp tục" xác nhận | Nút "Tầng 3" (12 tài sản, 3 khu con) | Nhánh xóa, 12 tài sản về "chưa có vị trí" (hồ sơ giữ nguyên), 3 khu con xóa, ghi nhật ký kiểm toán, sơ đồ đóng, toast "Đã xóa khu vực" | Auto | Pass |
| TC-S01-39 | Negative | EP | R-S01-09 / UC-S01-05 (ngoại lệ) | Cao | High | Dialog xóa đang mở | 1. Nhấn "Hủy" | Nút "Tầng 3" | Dialog đóng, không xóa gì, cây giữ nguyên | Auto | Pass |
| TC-S01-40 | Edge | BVA | R-S01-09 / US-S01-05 GWT-1 | Trung bình | Medium | Nút rỗng | 1. Chọn "Xóa" nút "Phòng 306" (0 tài sản, 0 khu con) | Nút "Phòng 306": 0 tài sản, 0 khu con | Dialog ghi "gỡ vị trí 0 tài sản và xóa 0 khu vực con" (hoặc wording rỗng phù hợp), xác nhận → xóa | Manual | Chưa chạy |

## Chức năng: Phân quyền & điều hướng vệ tinh (BRule-S01-04, R-S01-10) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S01-41 | Negative | DT | BRule-S01-04 / R-S01-01 | Trung bình | High | Vai trò Giám sát | 1. Đăng nhập Giám sát<br>2. Mở menu ⋮ một nút | Vai trò = Giám sát | Các mục "Thêm con / Sửa / Xóa / Quản lý ảnh" bị ẩn (không chỉ disable); vẫn gán/gỡ/di dời/tra cứu được | Manual | Chưa chạy |
| TC-S01-42 | Positive | EP | R-S01-10 / Design-spec banner | Trung bình | Medium | Có 3 pin cần đặt lại | 1. Quan sát dải cảnh báo dưới sơ đồ<br>2. Click dải | 3 pin cần đặt lại (A-031, A-052, A-077) | Dải "⚠ 3 pin cần đặt lại vị trí" hiện; click → điều hướng tới S05; ẩn khi N=0; có lối vào S02/S03/S04/S06/S08 | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện → DT; có luồng trạng thái → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S01-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: min, min+1, max-1, max |
| DT (Decision Table) | Bảng quyết định — liệt kê tổ hợp điều kiện → kết quả |
| ST (State Transition) | Kiểm thử chuyển trạng thái hợp lệ và không hợp lệ |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Pin | Điểm đánh dấu vị trí tài sản trên sơ đồ mặt bằng |
| Breadcrumb | Dải đường dẫn thể hiện vị trí nút trong cây khu vực |
| Clustering (gom cụm) | Gộp nhiều pin gần nhau thành một cụm khi vượt 500 điểm |
| Nhật ký kiểm toán (audit log) | Bản ghi ai/làm gì/khi nào cho thao tác gán/gỡ/xóa |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
