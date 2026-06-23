# Tài liệu kiểm thử — Xuất báo cáo / kiểm kê (Mã màn: S08)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S08..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 34 | 19 | 0 | 0 | 0 | 15 | 56% | 2026-06-23 |

## Bối cảnh dữ liệu mẫu (dùng chung cho các TC)
> Các giá trị cụ thể tham chiếu trong cột Test Data của các ca dưới đây.

- **Toàn hệ thống:** 1.250 tài sản (mã `TS-0001`…`TS-1250`).
- **Cây khu vực:** `Tòa A` (gồm con `Tầng 1`, `Tầng 2`, `Tầng 3`; `Tầng 3` gồm `Phòng 305`, `Phòng 306`). `Tòa B` (rỗng — chưa gán tài sản nào).
- **Phạm vi "Tòa A" (gồm khu con):** 1.248 tài sản; "Tòa A" gồm trực tiếp 0 tài sản, tài sản nằm ở các tầng/phòng con.
- **Phạm vi "Tầng 3" (chỉ trực tiếp, tắt khu con):** 1 tài sản đặt thẳng tại nút `Tầng 3` (`TS-1000`).
- **Phạm vi "Tòa B":** 0 tài sản → ca rỗng.
- **Bộ lọc S01 hiện tại:** lọc "trạng thái = Cần bảo trì" → khớp 37 tài sản; lọc "trạng thái = Đã thanh lý" → khớp 0 tài sản.
- **Tập rất lớn (giả lập tải):** kịch bản 50.000 dòng (biên trên NFR), 50.001 dòng (vượt biên), 5.000 dòng (biên ngưỡng tiến trình), 5.001 dòng (qua ngưỡng).
- **5 cột chuẩn (đúng thứ tự):** mã tài sản → tên → đường dẫn khu vực → vị trí → lần di dời gần nhất.
- **Tài sản đặc biệt:** `TS-0500` chưa từng di dời (cột "lần di dời gần nhất" trống); `TS-0777` chưa gán vị trí ("vị trí" và "đường dẫn khu vực" trống / "Chưa gán vị trí"); tài sản có dấu tiếng Việt `TS-0042` tên "Máy bơm chữa cháy tầng hầm".

---

## Chức năng: Chọn phạm vi xuất (F20) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S08-01 | Positive | EP | R-S08-01 / US-S08-01 GWT-1 | Cao | Critical | Mở modal Xuất báo cáo từ S01 | 1. Mở modal<br>2. Quan sát nhóm "Phạm vi xuất" | — | Hiện 3 lựa chọn radio: Toàn bộ / Theo khu vực đang chọn / Theo bộ lọc hiện tại; bắt buộc chọn đúng 1, đúng 1 radio được chọn sẵn | Auto | Pass |
| TC-S08-02 | Positive | DT | R-S08-01 / US-S08-01 GWT-2 | Cao | High | Ở S01 đã chọn nút `Tòa A › Tầng 3` | 1. Mở modal<br>2. Chọn "Theo khu vực đang chọn" | nút chọn: `Tòa A › Tầng 3` | Mặc định "Theo khu vực đang chọn" được chọn; hiện breadcrumb `Tòa A › Tầng 3` + checkbox "Gồm cả các khu vực con" bật sẵn | Auto | Pass |
| TC-S08-03 | Positive | DT | R-S08-01 | Trung bình | Medium | Ở S01 KHÔNG có nút nào đang chọn | 1. Mở modal<br>2. Quan sát radio mặc định | không có nút chọn | Mặc định chuyển sang "Toàn bộ tài sản"; lựa chọn "Theo khu vực đang chọn" bị khóa | Auto | Pass |
| TC-S08-04 | Negative | DT | R-S08-01 / US-S08-01 GWT-3 / UC-S08-02 (ngoại lệ) | Cao | High | Ở S01 KHÔNG có nút khu vực nào đang chọn | 1. Mở modal<br>2. Cố chọn "Theo khu vực đang chọn" và định xuất | pham_vi = `theo_khu_vuc`, nut_khu_vuc_chon = (trống) | Lựa chọn bị khóa / chặn xuất; báo "Hãy chọn một khu vực trước khi xuất theo khu vực." | Manual | Chưa chạy |
| TC-S08-05 | Negative | DT | R-S08-01 / pham_vi validation | Cao | High | Modal mở, hệ thống ép bỏ chọn mọi radio (trạng thái không hợp lệ) | 1. Bỏ chọn mọi radio phạm vi<br>2. Bấm "Xuất Excel" | pham_vi = (trống) | Chặn xuất; báo "Vui lòng chọn phạm vi xuất." | Manual | Chưa chạy |
| TC-S08-06 | Positive | EP | R-S08-02 / UC-S08-02 | Cao | High | Đã chọn "Theo khu vực" với nút `Tòa A`; bật "Gồm khu vực con" | 1. Bật checkbox "Gồm cả các khu vực con"<br>2. Xem ước tính | nút `Tòa A`, gom_khu_con = bật | Phạm vi lấy tài sản của `Tòa A` và toàn bộ nhánh con → ước tính **1.248** tài sản | Auto | Pass |
| TC-S08-07 | Edge | BVA | R-S08-02 / BRule-S08-02 | Trung bình | Medium | Đã chọn "Theo khu vực" với nút `Tầng 3` | 1. Tắt checkbox "Gồm cả các khu vực con"<br>2. Xem ước tính | nút `Tầng 3`, gom_khu_con = tắt | Chỉ lấy tài sản đặt trực tiếp tại `Tầng 3` → ước tính **1** tài sản (`TS-1000`); không gồm `Phòng 305/306` | Auto | Pass |
| TC-S08-08 | Positive | EP | R-S08-01 / UC-S08-03 | Trung bình | Medium | Ở S01 đang áp bộ lọc "trạng thái = Cần bảo trì" | 1. Mở modal<br>2. Chọn "Theo bộ lọc hiện tại"<br>3. Xem ước tính | bộ lọc khớp 37 tài sản | Phạm vi = đúng 37 tài sản đang lọc; ước tính hiện **37** | Auto | Pass |
| TC-S08-09 | Edge | DT | R-S08-02 / BRule-S08-02 | Trung bình | Low | "Theo khu vực" với nút `Tòa A` (lồng nhiều cấp) | 1. Bật "Gồm khu vực con"<br>2. Đối chiếu tài sản nhánh sâu | nút `Tòa A`; nhánh sâu `Tòa A › Tầng 3 › Phòng 305` | Tài sản ở `Phòng 305` (cháu, cấp sâu) vẫn nằm trong phạm vi → đếm đủ mọi cấp | Manual | Chưa chạy |

## Chức năng: Chọn cột xuất (F20) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S08-10 | Positive | EP | R-S08-03 / US-S08-02 GWT-1 / UC-S08-04 | Trung bình | High | Modal mở | 1. Quan sát nhóm "Cột xuất" | — | 5 cột (mã, tên, đường dẫn khu vực, vị trí, lần di dời gần nhất) đều được tick sẵn | Auto | Pass |
| TC-S08-11 | Positive | DT | R-S08-03 / US-S08-02 GWT-2 / BRule-S08-01 | Trung bình | High | Modal mở, phạm vi "Toàn bộ" (1.250 tài sản) | 1. Bỏ tick "Vị trí" và "Lần di dời gần nhất"<br>2. Xuất Excel | cột chọn: mã, tên, đường dẫn khu vực | File chỉ có 3 cột theo thứ tự chuẩn: mã → tên → đường dẫn khu vực; 2 cột bỏ vắng mặt | Auto | Pass |
| TC-S08-12 | Edge | BVA | R-S08-03 / cot_xuat min | Trung bình | Medium | Modal mở | 1. Bỏ tick 4 cột, để lại đúng 1 cột "Mã tài sản"<br>2. Xuất Excel | cot_xuat = 1 cột (`mã tài sản`) | Cho xuất; file chỉ có 1 cột "Mã tài sản" (biên min = 1) | Auto | Pass |
| TC-S08-13 | Edge | BVA | R-S08-03 / cot_xuat max | Thấp | Low | Modal mở | 1. Tick đủ 5 cột<br>2. Xuất Excel | cot_xuat = 5 cột (max) | Cho xuất; file có đủ 5 cột đúng thứ tự chuẩn (biên max = 5) | Auto | Pass |
| TC-S08-14 | Negative | BVA | R-S08-03 / US-S08-02 GWT-3 / UC-S08-04 (ngoại lệ) | Trung bình | High | Modal mở | 1. Bỏ tick cả 5 cột<br>2. Định xuất | cot_xuat = 0 cột (dưới biên min) | Chặn nút "Xuất Excel"; báo "Chọn ít nhất một cột để xuất." | Auto | Pass |
| TC-S08-15 | Edge | DT | R-S08-05 / BRule-S08-01 | Thấp | Low | Phạm vi "Toàn bộ" | 1. Bỏ tick "Tên" (cột giữa)<br>2. Xuất Excel | cột: mã, đường dẫn khu vực, vị trí, lần di dời | File giữ thứ tự chuẩn của các cột còn lại (mã → đường dẫn → vị trí → lần di dời), không xô lệch | Manual | Chưa chạy |

## Chức năng: Ước tính số dòng & trạng thái rỗng (F20) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S08-16 | Positive | EP | R-S08-04 / US-S08-01 | Trung bình | High | Modal mở, phạm vi "Toàn bộ" | 1. Chọn "Toàn bộ tài sản"<br>2. Xem dải ước tính | toàn hệ thống 1.250 tài sản | Dải hiện "Ước tính: 1.250 tài sản trong phạm vi đã chọn" | Auto | Pass |
| TC-S08-17 | Positive | ST | R-S08-04 / UC-S08-01 | Trung bình | Medium | Modal mở | 1. Chọn "Toàn bộ" (thấy 1.250)<br>2. Đổi sang "Theo khu vực" nút `Tòa A` (gồm con) | đổi phạm vi giữa chừng | Ước tính cập nhật từ 1.250 → 1.248 khi đổi phạm vi (cross-fade số mới) | Auto | Pass |
| TC-S08-18 | Edge | BVA | R-S08-04 / R-S08-07 | Cao | High | Modal mở | 1. Chọn phạm vi "Theo khu vực" nút `Tòa B` (rỗng)<br>2. Xem ước tính | nút `Tòa B` = 0 tài sản (biên 0) | Ước tính = 0 → kích hoạt trạng thái Empty "Không có dữ liệu để xuất." | Auto | Pass |
| TC-S08-19 | Negative | EP | R-S08-07 / US-S08-04 GWT-2 / UC-S08-01 (ngoại lệ) | Cao | Critical | Phạm vi rỗng (0 tài sản, vd `Tòa B`) | 1. Quan sát nút "Xuất Excel" | phạm vi = 0 tài sản | Nút "Xuất Excel" bị vô hiệu; có nhãn phụ trợ/tooltip "Phạm vi không có dữ liệu" | Auto | Pass |
| TC-S08-20 | Negative | EP | R-S08-07 / UC-S08-03 (ngoại lệ) | Cao | High | Ở S01 áp bộ lọc "trạng thái = Đã thanh lý" (khớp 0) | 1. Mở modal<br>2. Chọn "Theo bộ lọc hiện tại" | bộ lọc khớp 0 tài sản | Ước tính = 0; hiện "Không có dữ liệu để xuất."; chặn xuất | Auto | Pass |
| TC-S08-21 | Edge | BVA | R-S08-04 / R-S08-05 | Trung bình | Medium | Modal mở | 1. Chọn phạm vi có đúng **1** tài sản (`Tầng 3`, tắt khu con) | phạm vi = 1 tài sản (biên 0+1) | Ước tính = 1; cho xuất bình thường; file có đúng 1 dòng dữ liệu | Auto | Pass |
| TC-S08-22 | Positive | ST | R-S08-07 / US-S08-04 / UC-S08-01 (ngoại lệ) | Trung bình | Medium | Đang ở trạng thái Empty (phạm vi rỗng) | 1. Bấm CTA "Đổi phạm vi"<br>2. Chọn lại phạm vi "Toàn bộ" | từ rỗng → có dữ liệu | Focus quay về nhóm "Phạm vi"; chọn phạm vi có dữ liệu → Empty biến mất, nút "Xuất Excel" bật lại | Manual | Chưa chạy |

## Chức năng: Sinh & tải file Excel (F20) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S08-23 | Positive | EP | R-S08-05 / US-S08-03 GWT-1 / UC-S08-01 | Cao | Critical | Phạm vi "Toàn bộ" (1.250), 5 cột tick hết | 1. Bấm "Xuất Excel"<br>2. Chờ tải | xuất toàn bộ 1.250 tài sản, 5 cột | File `.xlsx` hợp lệ tạo & tải về; 1.250 dòng dữ liệu, đủ 5 cột đúng thứ tự; toast "Đã xuất 1.250 tài sản." | Auto | Pass |
| TC-S08-24 | Positive | EP | R-S08-05 / UC-S08-02 | Cao | High | Phạm vi "Tòa A" gồm khu con (1.248) | 1. Bấm "Xuất Excel" | phạm vi `Tòa A` gồm khu con = 1.248 | File `.xlsx` có 1.248 dòng (đúng nhánh khu vực); toast "Đã xuất 1.248 tài sản." | Auto | Pass |
| TC-S08-25 | Positive | DT | R-S08-05 / US-S08-03 GWT-2 / BRule-S08-03 | Cao | High | Phạm vi gồm `TS-0500` (chưa từng di dời) | 1. Xuất Excel<br>2. Mở file, kiểm dòng `TS-0500` | `TS-0500` không có lịch sử di chuyển | Dòng `TS-0500` có cột "lần di dời gần nhất" **để trống**, không báo lỗi | Manual | Chưa chạy |
| TC-S08-26 | Positive | DT | R-S08-05 / BRule-S08-03 | Trung bình | Medium | Phạm vi gồm tài sản đã di dời nhiều lần | 1. Xuất Excel<br>2. Kiểm cột "lần di dời gần nhất" | tài sản `TS-0100` có 3 bản ghi di chuyển: `2026-01-10`, `2026-03-05`, `2026-05-20` | Cột lấy đúng bản ghi **mới nhất** `2026-05-20` | Manual | Chưa chạy |
| TC-S08-27 | Edge | DT | R-S08-05 / BRule-S08-04 | Trung bình | Medium | Phạm vi gồm `TS-0777` (chưa gán vị trí) | 1. Xuất Excel<br>2. Kiểm dòng `TS-0777` | `TS-0777` không có vị trí pin | Tài sản vẫn được liệt kê; cột "vị trí" và "đường dẫn khu vực" để trống / "Chưa gán vị trí" | Manual | Chưa chạy |
| TC-S08-28 | Edge | EP | R-S08-N02 / US-S08-03 GWT-2 | Cao | High | Phạm vi gồm `TS-0042` (tên có dấu tiếng Việt) | 1. Xuất Excel<br>2. Mở file trên Excel & LibreOffice | tên "Máy bơm chữa cháy tầng hầm" | File mở đúng định dạng `.xlsx`; dấu tiếng Việt hiển thị đúng (UTF-8), không lỗi font | Manual | Chưa chạy |
| TC-S08-29 | Positive | ST | R-S08-05 / R-S08-08 / US-S08-03 GWT-3 | Cao | High | Xuất thành công | 1. Hoàn tất xuất | phạm vi 1.250 | Toast "Đã xuất 1.250 tài sản." + tên file hiện ra; modal fade về S01 (workspace) | Manual | Chưa chạy |

## Chức năng: Xuất tập lớn — tiến trình & hủy (F20) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S08-30 | Edge | BVA | R-S08-06 / R-S08-N01 / UC-S08-05 GWT-1 | Cao | Critical | Phạm vi giả lập **50.000** dòng (biên trên NFR) | 1. Bấm "Xuất Excel"<br>2. Quan sát giao diện | tập 50.000 dòng | Hiện thanh tiến trình + "Đang xử lý {x}/50.000 dòng..."; giao diện không treo; file 50.000 dòng tải về; toast "Đã xuất 50.000 tài sản." | Manual | Chưa chạy |
| TC-S08-31 | Edge | BVA | R-S08-06 | Trung bình | Medium | Phạm vi **5.000** dòng (biên ngưỡng tiến trình) | 1. Xuất Excel | tập 5.000 dòng (biên ≤ 5.000) | Hoàn tất < 5 giây; có thể **không** hiện thanh tiến trình (đúng ngưỡng > 5.000 mới bắt buộc) | Manual | Chưa chạy |
| TC-S08-32 | Edge | BVA | R-S08-06 / R-S08-N03 | Cao | High | Phạm vi **5.001** dòng (qua ngưỡng) | 1. Xuất Excel | tập 5.001 dòng (biên + 1) | Bắt buộc hiện thanh tiến trình + số dòng đã xử lý + nút Hủy | Manual | Chưa chạy |
| TC-S08-33 | Negative | ST | R-S08-06 / UC-S08-05 GWT-2 (ngoại lệ) | Cao | Critical | Đang dựng file tập lớn (đang ở ~64% = 32.000/50.000) | 1. Bấm "Hủy" giữa chừng | hủy ở 32.000/50.000 | Quá trình dừng; **không** tải file dở; quay về màn cấu hình; không có file rác | Manual | Chưa chạy |
| TC-S08-34 | Negative | ST | R-S08-N01 / R-S08-N03 / UC-S08-05 (ngoại lệ) | Trung bình | High | Phạm vi **50.001** dòng (vượt biên NFR) HOẶC rớt mạng khi đang xuất | 1. Bấm Xuất Excel rồi ngắt mạng giữa chừng | tập 50.001 dòng / mất kết nối ở 40% | Hiện trạng thái Error "Không tạo được file báo cáo. Vui lòng thử lại." + nút "Thử lại"; không tải file dở dang | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện → DT; có luồng trạng thái → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi hoặc cột ghi chú nếu thêm).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S08-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: 0/1/5.000/5.001/50.000/50.001 dòng, 1/5 cột |
| DT (Decision Table) | Bảng quyết định — tổ hợp phạm vi/cột/khu con → kết quả file |
| ST (State Transition) | Kiểm thử chuyển trạng thái: cấu hình → tiến trình → xong/hủy/lỗi |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Phạm vi xuất | Tập tài sản đưa vào báo cáo: toàn bộ / theo khu vực đang chọn / theo bộ lọc |
| Lần di dời gần nhất | Thời điểm bản ghi lịch sử di chuyển mới nhất của một tài sản |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
