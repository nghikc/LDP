# Tài liệu kiểm thử — Di dời tài sản (đơn & hàng loạt) (Mã màn: S04)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S04..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 31 | 0 | 0 | 0 | 0 | 31 | 0% | — |

**Phủ theo nguồn (truy vết nhanh):**

| Nguồn | Test case |
|-------|-----------|
| R-S04-01 / UC-S04-01 / US-S04-01 | TC-S04-01, TC-S04-02, TC-S04-03 |
| R-S04-02 / UC-S04-02 / US-S04-02 | TC-S04-04, TC-S04-05, TC-S04-06 |
| R-S04-03 / UC-S04-03 / US-S04-03 | TC-S04-07, TC-S04-08, TC-S04-09 |
| R-S04-04 (đích bắt buộc) | TC-S04-10, TC-S04-11, TC-S04-12 |
| R-S04-05 (lý do ≤500) | TC-S04-13, TC-S04-14, TC-S04-15, TC-S04-16 |
| R-S04-06 (tự ghi người + thời điểm) | TC-S04-17 |
| R-S04-07 (lịch sử + nhật ký) | TC-S04-18 |
| R-S04-08 / UC-S04-05 / US-S04-06 (khóa) | TC-S04-19, TC-S04-20, TC-S04-21, TC-S04-22 |
| R-S04-09 / UC-S04-04 / US-S04-05 (rollback) | TC-S04-23, TC-S04-24, TC-S04-25 |
| R-S04-10 (gỡ pin cũ + pin mới) | TC-S04-26 |
| R-S04-N02 (khóa tự mở 5 phút) | TC-S04-27, TC-S04-28 |
| R-S04-N03 (hiệu năng 500 tài sản) | TC-S04-29 |
| R-S04-N04 (truy vết/kiểm soát truy cập) | TC-S04-30 |
| BRule-S04-07 (đích trùng vị trí hiện tại) | TC-S04-31 |

---

## Chức năng: Di dời tài sản đơn (F12) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-01 | Positive | EP | R-S04-01 / UC-S04-01 (chính) / GWT-1,2 | Cao | Critical | Đăng nhập (Nguyễn B); tài sản A-007 đang ở "Tòa A › Tầng 3 › Phòng 305", không bị khóa | 1. Mở popup pin A-007 trên S01, bấm "Di dời"<br>2. Xác nhận modal mở, A-007 chọn sẵn, ẩn bộ chọn cách lấy nguồn<br>3. Chọn đích "Tòa B › Tầng 1 › Kho B-01"<br>4. Bấm "Di dời (1)" | Tài sản: `A-007 · Máy nén khí`; đích: `Tòa B › Tầng 1 › Kho B-01` | Modal mở đúng 1 tài sản chọn sẵn; pin A-007 chuyển sang Kho B-01; toast "Đã di dời 1 tài sản."; fade về S01 | Auto | Chưa chạy |
| TC-S04-02 | Negative | DT | R-S04-04 / UC-S04-01 (ngoại lệ) / GWT-3 | Cao | High | Như TC-S04-01, modal đã mở với A-007 | 1. KHÔNG chọn đích<br>2. Bấm "Di dời"<br>(nếu nút bật) hoặc kiểm tra trạng thái nút | Đích: (để trống) | Nút "Di dời" tắt khi chưa chọn đích; nếu bị ép submit → chặn lưu, báo "Vui lòng chọn khu vực đích." qua aria-live | Auto | Chưa chạy |
| TC-S04-03 | Positive | ST | R-S04-01 / UC-S04-01 (Hủy) | Trung bình | Medium | Modal mở với A-007, đã chọn đích Kho B-01 | 1. Bấm "Hủy"<br>2. Quan sát S01 | Tài sản: `A-007`; đích đã chọn: `Kho B-01` | Modal đóng (slide-down + fade), KHÔNG thay đổi; A-007 vẫn ở "Phòng 305"; không sinh lịch sử/nhật ký | Manual | Chưa chạy |

## Chức năng: Di dời hàng loạt — chọn tài sản lẻ (F13) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-04 | Positive | EP | R-S04-02 / UC-S04-02 (chính) / US-S04-02 GWT-1,2 | Cao | Critical | Đăng nhập; tồn tại các tài sản đã có vị trí | 1. Bấm "Di dời hàng loạt" trên S01<br>2. Xác nhận chế độ "Chọn tài sản lẻ"<br>3. Tìm và tick A-007, A-014, A-009<br>4. Chọn đích Kho B-01<br>5. Bấm "Di dời (3)" | Tick 3 tài sản: `A-007, A-014, A-009` (đều ở Phòng 305/306); đích `Tòa B › Tầng 1 › Kho B-01` | Bộ đếm "3 tài sản đã chọn"; cả 3 về đúng Kho B-01; toast "Đã di dời 3 tài sản."; fade về S01 | Auto | Chưa chạy |
| TC-S04-05 | Negative | DT | R-S04-02 / US-S04-02 GWT-3 | Cao | High | Modal mở chế độ "Chọn tài sản lẻ", chưa tick gì | 1. Không tick tài sản nào<br>2. Quan sát nút "Di dời" | Danh sách chọn: (rỗng) | Nút "Di dời" tắt; gợi ý "Chọn ít nhất một tài sản để di dời." | Auto | Chưa chạy |
| TC-S04-06 | Negative | EP | R-S04-02 / BRule-S04-06 | Trung bình | Medium | Tồn tại tài sản A-100 **chưa có vị trí** (chưa gán pin) | 1. Mở chế độ "Chọn tài sản lẻ"<br>2. Tìm "A-100" trong ô tìm | Tìm mã: `A-100` (chưa có vị trí) | A-100 KHÔNG xuất hiện trong danh sách (chỉ liệt kê tài sản đã có vị trí) | Manual | Chưa chạy |

## Chức năng: Di dời hàng loạt — chọn cả vị trí cũ (F13) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-07 | Positive | EP | R-S04-03 / UC-S04-03 (chính) / US-S04-03 GWT-1 | Cao | Critical | Nút nguồn "Phòng 305" chứa đúng 5 tài sản đã có vị trí | 1. Bấm "Di dời hàng loạt"<br>2. Chọn chế độ "Chọn cả vị trí cũ (lấy hết)"<br>3. Chọn nút nguồn "Phòng 305"<br>4. Chọn đích "Phòng 306"<br>5. Bấm "Di dời (5)" | Nguồn: `Tòa A › Tầng 3 › Phòng 305` (5 tài sản); đích: `Tòa A › Tầng 3 › Phòng 306` | Nạp hết 5 tài sản; bộ đếm "5 tài sản đã chọn"; cả 5 chuyển sang Phòng 306; toast "Đã di dời 5 tài sản." | Auto | Chưa chạy |
| TC-S04-08 | Negative | EP | R-S04-03 / UC-S04-03 (ngoại lệ) / US-S04-03 GWT-2 | Cao | High | Nút "Phòng 309" trống (0 tài sản) | 1. Chọn chế độ "Chọn cả vị trí cũ"<br>2. Chọn nút nguồn "Phòng 309" | Nguồn: `Phòng 309` (0 tài sản) | Báo "Vị trí này không có tài sản để di dời."; lô vẫn rỗng; nút Di dời tắt | Auto | Chưa chạy |
| TC-S04-09 | Edge | BVA | R-S04-03 / UC-S04-03 | Trung bình | Medium | Nút "Tủ A1" chứa đúng 1 tài sản (biên dưới ≥1) | 1. Chọn chế độ "Chọn cả vị trí cũ"<br>2. Chọn nút "Tủ A1" | Nguồn: `Tủ A1` (1 tài sản: `A-055`) | Nạp 1 tài sản; bộ đếm "1 tài sản đã chọn"; cho phép sang Bước 2 | Manual | Chưa chạy |

## Chức năng: Chọn vị trí đích (F12, F13) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-10 | Negative | DT | R-S04-04 / UC-S04-02 (ngoại lệ) | Cao | Critical | Lô có 3 tài sản đã chọn; chưa chọn đích | 1. Không chọn đích<br>2. Cố bấm "Di dời" | Tài sản: `A-007, A-014, A-009`; đích: (trống) | Nút Di dời tắt do thiếu đích; nếu ép → "Vui lòng chọn khu vực đích." | Auto | Chưa chạy |
| TC-S04-11 | Positive | DT | R-S04-04 / BRule-S04-01 | Cao | Critical | Lô 5 tài sản từ nhiều phòng khác nhau | 1. Chọn 1 đích duy nhất "Kho B-01"<br>2. Di dời<br>3. Kiểm tra vị trí từng tài sản | 5 tài sản nguồn khác phòng; đích duy nhất `Kho B-01` | TẤT CẢ 5 tài sản về cùng "Kho B-01" (không tài sản nào lệch đích) | Auto | Chưa chạy |
| TC-S04-12 | Negative | EP | R-S04-04 (đúng 1 nút hợp lệ) | Trung bình | Medium | Modal mở, Bước 2 | 1. Cố chọn 2 nút đích cùng lúc trên cây | Chọn: `Kho B-01` rồi `Kho B-02` | Chỉ giữ đúng 1 nút đích (lựa chọn sau thay lựa chọn trước); không cho chọn nhiều đích | Manual | Chưa chạy |

## Chức năng: Lý do di dời (F12, F13) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-13 | Positive | EP | R-S04-05 / US-S04-04 GWT-1 | Trung bình | Medium | Lô hợp lệ, đã chọn đích | 1. Để TRỐNG lý do<br>2. Bấm "Di dời" | Lý do: (trống) | Vẫn lưu được; lịch sử ghi đúng người + thời điểm; trường lý do trống | Auto | Chưa chạy |
| TC-S04-14 | Edge | BVA | R-S04-05 (max 500) | Trung bình | Medium | Lô hợp lệ, đã chọn đích | 1. Nhập lý do đúng 500 ký tự<br>2. Bấm "Di dời" | Lý do: chuỗi `"Di dời do bảo trì..."` đúng `500` ký tự | Chấp nhận; lưu đủ 500 ký tự; bộ đếm hiện "500/500" | Manual | Chưa chạy |
| TC-S04-15 | Negative | BVA | R-S04-05 / US-S04-04 GWT-2 | Trung bình | High | Lô hợp lệ | 1. Cố nhập 501 ký tự vào ô lý do | Lý do: chuỗi `501` ký tự | Chặn nhập vượt 500 (cắt ở 500); báo "Lý do tối đa 500 ký tự." | Auto | Chưa chạy |
| TC-S04-16 | Edge | BVA | R-S04-05 (biên 499/1) | Thấp | Low | Lô hợp lệ | 1. Nhập 1 ký tự<br>2. Nhập 499 ký tự | Lý do: `"x"` (1 ký tự); rồi `499` ký tự | Cả hai chấp nhận; bộ đếm "1/500" và "499/500" | Manual | Chưa chạy |

## Chức năng: Truy vết tự động — người, thời điểm, lịch sử, nhật ký (F12, F13) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-17 | Positive | EP | R-S04-06 / US-S04-04 GWT-1 | Cao | High | Đăng nhập là "Nguyễn B"; di dời 1 tài sản lúc 14:30 | 1. Di dời A-007 sang Kho B-01<br>2. Mở lịch sử tài sản A-007 | Người đăng nhập: `Nguyễn B`; thời điểm hệ thống: `2026-06-23 14:30` | Bản ghi ghi đúng người `Nguyễn B` + dấu thời gian khi lưu; người dùng KHÔNG nhập tay | Auto | Chưa chạy |
| TC-S04-18 | Positive | EP | R-S04-07 / US-S04-04 GWT-3 | Cao | High | Di dời A-007 từ Phòng 305 → Kho B-01, lý do "Bảo trì" | 1. Di dời thành công<br>2. Xem lịch sử di chuyển A-007<br>3. Xem nhật ký kiểm toán | Vị trí cũ `Phòng 305`; mới `Kho B-01`; lý do `"Bảo trì"` | Lịch sử có: cũ→mới, người, thời điểm, lý do "Bảo trì"; nhật ký kiểm toán có bản ghi tương ứng (người · hành động · đối tượng · thời gian · cũ→mới) | Auto | Chưa chạy |

## Chức năng: Khóa đồng thời (F13, F22) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-19 | Negative | ST | R-S04-08 / UC-S04-05 (đơn) / US-S04-06 GWT-1 | Cao | Critical | A-021 đang bị người dùng khác khóa (chưa hết 5 phút) | 1. Mở chế độ chọn tài sản lẻ<br>2. Tìm A-021 trong danh sách | Tài sản: `A-021 · Máy bơm` (đang bị khóa) | A-021 hiện icon khóa 🔒 + nhãn "đang được người khác chỉnh sửa"; ô tick bị vô hiệu, không tick được | Auto | Chưa chạy |
| TC-S04-20 | Edge | DT | R-S04-08 / UC-S04-05 (hàng loạt) / US-S04-06 GWT-2 | Cao | Critical | Lô có 2 tài sản hợp lệ (A-007, A-009) + 1 đang khóa (A-021); đã chọn đích | 1. Bấm "Di dời"<br>2. Dialog "tài sản bị khóa" hiện<br>3. Bấm "Tiếp tục" | Lô: `A-007, A-009` (hợp lệ) + `A-021` (khóa); đích `Kho B-01` | Dialog "1 tài sản đang bị khóa. Bỏ qua và tiếp tục với 2 tài sản còn lại?"; chọn Tiếp tục → di dời 2 tài sản hợp lệ; A-021 giữ nguyên | Auto | Chưa chạy |
| TC-S04-21 | Negative | DT | R-S04-08 / UC-S04-05 (từ chối) | Cao | High | Như TC-S04-20, dialog khóa đang hiện | 1. Bấm "Hủy" trong dialog tài sản bị khóa | Lô: 2 hợp lệ + `A-021` khóa | Hủy toàn lô; KHÔNG tài sản nào bị di dời; A-007, A-009, A-021 giữ nguyên vị trí | Auto | Chưa chạy |
| TC-S04-22 | Negative | ST | R-S04-08 / UC-S04-05 (đơn, bấm Di dời) | Cao | Critical | Di dời đơn A-021; A-021 vừa bị người khác khóa sau khi mở modal | 1. Bấm "Di dời (1)" với A-021 | Tài sản: `A-021` (bị khóa giữa chừng) | Chặn; báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."; không di dời | Manual | Chưa chạy |

## Chức năng: Rollback all-or-nothing khi gián đoạn (F13) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-23 | Negative | ST | R-S04-09 / UC-S04-04 / US-S04-05 GWT-1,2 | Cao | Critical | Lô 200 tài sản đang ghi; ngắt mạng khi đã ghi dở ~80 tài sản | 1. Bấm "Di dời (200)"<br>2. Thanh tiến trình chạy<br>3. NGẮT MẠNG ở ~80/200<br>4. Kiểm tra vị trí toàn lô | Lô: `200 tài sản` từ Phòng 305 → Phòng 306; mất mạng tại bản ghi ~80 | Rollback TOÀN BỘ: cả 200 tài sản giữ nguyên vị trí cũ (Phòng 305); không bản ghi lịch sử nửa vời; snackbar "Mất kết nối, đã hoàn tác toàn bộ. Vui lòng thử lại." | Manual | Chưa chạy |
| TC-S04-24 | Negative | ST | R-S04-09 / UC-S04-04 (đóng trình duyệt) | Cao | Critical | Lô 10 tài sản đang ghi (4 cái đã ghi dở) | 1. Bấm "Di dời (10)"<br>2. Đóng/refresh tab khi đang ghi (4/10)<br>3. Đăng nhập lại, kiểm tra | Lô: `10 tài sản`; đóng tab tại 4/10 | Rollback toàn bộ: 10 tài sản giữ nguyên; khóa tự nhả; không dữ liệu nửa vời | Manual | Chưa chạy |
| TC-S04-25 | Positive | ST | R-S04-09 / UC-S04-04 (thử lại) | Trung bình | High | Lô vừa bị rollback (TC-S04-23) | 1. Sau khôi phục mạng, bấm "Di dời" lại từ đầu | Lô: `200 tài sản` (thử lại) | Lô bắt đầu lại sạch; di dời thành công 200 tài sản; không tồn đọng bản ghi nửa vời từ lần trước | Manual | Chưa chạy |

## Chức năng: Cập nhật vị trí / pin (F12, F13) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-26 | Positive | EP | R-S04-10 / BRule-S04-02 | Trung bình | High | A-007 ở Phòng 305 | 1. Di dời A-007 sang Kho B-01<br>2. Mở sơ đồ Phòng 305 và Kho B-01 trên S01 | Tài sản: `A-007`; cũ `Phòng 305` → mới `Kho B-01` | Pin A-007 biến mất ở Phòng 305, xuất hiện ở Kho B-01; A-007 vẫn chỉ 1 vị trí (BRule-01) | Auto | Chưa chạy |

## Phi chức năng: Khóa tự mở, hiệu năng, truy vết, đích trùng — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S04-27 | Edge | ST | R-S04-N02 / US-S04-06 GWT-3 | Cao | High | A-021 bị khóa lúc 14:00; không thao tác | 1. Chờ tới 14:05 (đúng 5 phút)<br>2. Thử tick A-021 lại | Khóa bắt đầu `14:00`; thử lại lúc `14:05:01` | Khóa tự mở sau 5 phút; A-021 trở lại sẵn sàng, tick chọn và di dời được | Manual | Chưa chạy |
| TC-S04-28 | Edge | BVA | R-S04-N02 (biên 4:59 vs 5:00) | Trung bình | Medium | A-021 bị khóa lúc 14:00 | 1. Thử lại lúc 14:04:59 (chưa đủ 5 phút)<br>2. Thử lại lúc 14:05:01 | Thử tại `14:04:59` rồi `14:05:01` | Tại 4:59 → vẫn khóa, chặn; tại 5:01 → đã mở, cho di dời | Manual | Chưa chạy |
| TC-S04-29 | Edge | BVA | R-S04-N03 (500 tài sản < 5s) | Cao | High | Nút nguồn chứa đúng 500 tài sản (biên trên 1 lô) | 1. Chọn cả vị trí cũ chứa 500 tài sản<br>2. Chọn đích<br>3. Bấm "Di dời (500)"; đo thời gian | Lô: `500 tài sản`; nguồn `Kho lớn` → đích `Kho B-01` | Hoàn tất < 5 giây; thanh tiến trình hiện (vì > 1s); cả 500 về đích; không treo giao diện | Manual | Chưa chạy |
| TC-S04-30 | Positive | DT | R-S04-N04 | Trung bình | High | Đăng nhập vai "Giám sát" | 1. Di dời 1 tài sản với vai Giám sát<br>2. Kiểm tra nhật ký kiểm toán | Vai: `Giám sát`; tài sản `A-014` | Vai Giám sát được phép di dời; nhật ký kiểm toán đầy đủ (người · hành động · đối tượng · thời gian · cũ→mới) | Manual | Chưa chạy |
| TC-S04-31 | Negative | DT | BRule-S04-07 / R-S04-04 | Trung bình | Medium | Lô gồm tài sản đang ở "Kho B-01"; chọn đích cũng "Kho B-01" | 1. Chọn đích = vị trí hiện tại của toàn lô<br>2. Quan sát nút Di dời | Lô: `A-030, A-031` đang ở `Kho B-01`; đích `Kho B-01` | Đích trùng toàn bộ → không có gì để đổi; nút Di dời tắt / báo không có thay đổi | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện → DT; có luồng trạng thái → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi hoặc cột ghi chú nếu thêm).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S04-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: min, min+1, max-1, max |
| DT (Decision Table) | Bảng quyết định — liệt kê tổ hợp điều kiện → kết quả |
| ST (State Transition) | Kiểm thử chuyển trạng thái hợp lệ và không hợp lệ |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| All-or-nothing | Giao dịch lô toàn vẹn: mọi tài sản đổi vị trí hoặc không tài sản nào (rollback khi gián đoạn) |
| Rollback | Khôi phục trạng thái trước giao dịch khi lô bị gián đoạn |
| Khóa khi đang sửa | Tạm khóa tài sản đang di dời chống thao tác đồng thời; tự mở sau 5 phút |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
