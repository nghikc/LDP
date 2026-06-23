# Tài liệu kiểm thử — Danh sách pin cần đặt lại (Mã màn: S05)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S05..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 22 | 0 | 0 | 0 | 0 | 22 | 0% | — |

## Dữ liệu mẫu dùng chung
> Mọi TC dưới đây dùng bộ dữ liệu này (giá trị cụ thể, không placeholder).

**Danh sách 3 pin cần đặt lại (sau khi thay ảnh sơ đồ):**

| Pin | Mã · Tên tài sản | Đường dẫn khu vực | Sơ đồ chứa pin | Trạng thái | Khóa |
|-----|------------------|-------------------|----------------|------------|------|
| Pin 1 | `A-014 · Máy nén khí` | Tòa A › Tầng 3 › Phòng 305 | Phòng 305 | cần đặt lại | Không |
| Pin 2 | `A-031 · Tủ điện` | Tòa A › Tầng 3 › Phòng 306 | Phòng 306 | cần đặt lại | **Đang khóa** (người khác sửa) |
| Pin 3 | `B-002 · Máy bơm` | Tòa B › Tầng 1 › Kho | Kho B1 | cần đặt lại | Không |

**Tọa độ đặt lại dùng để test (đơn vị %):**
- Hợp lệ trong vùng: `(40, 60)`
- Biên dưới hợp lệ: `(0, 0)` · Biên trên hợp lệ: `(100, 100)`
- Ngoài vùng (vượt biên trên): `(105, 40)` — dùng cho pin `A-014 · Máy nén khí`
- Ngoài vùng (âm): `(-3, 50)`
- Sát ngoài biên: `(100.5, 50)`

**Vai trò test:** `Quản trị` (quanly@ngocdung.net), `Giám sát` (giamsat@ngocdung.net).

---

## Chức năng: Liệt kê pin cần đặt lại & bộ đếm (F15) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S05-01 | Positive | EP | R-S05-01 / US-S05-01 GWT-1 / UC-S05-01 | Trung bình | High | Đăng nhập Quản trị; có 3 pin cần đặt lại | 1. Ở S01 bấm dải "3 pin cần đặt lại"<br>2. Quan sát panel mở | Danh sách 3 pin dùng chung | Panel S05 trượt vào từ phải; liệt kê đúng 3 item; mỗi item có mã+tên (`A-014 · Máy nén khí`…), đường dẫn khu vực, tên sơ đồ | Auto | Chưa chạy |
| TC-S05-02 | Positive | EP | R-S05-02 / US-S05-01 GWT-2 / UC-S05-01 | Trung bình | High | Như TC-S05-01, panel đang mở | 1. Nhìn phần đầu panel | 3 pin | Bộ đếm hiển thị `Tổng: 3`, khớp số item | Auto | Chưa chạy |
| TC-S05-03 | Edge | EP | R-S05-07 / US-S05-04 GWT-2 / UC-S05-01 (ngoại lệ Empty) | Trung bình | Medium | Đăng nhập; **0 pin** cần đặt lại | 1. Mở panel S05 | Danh sách rỗng (N = 0) | Panel hiện trạng thái rỗng: "Không có pin nào cần đặt lại vị trí" + dòng phụ "Mọi pin đều nằm đúng trong vùng sơ đồ." + nút [Đóng]; giọng trấn an, không icon cảnh báo đỏ | Auto | Chưa chạy |
| TC-S05-04 | Negative | EP | R-S05-01 / UC-S05-01 (ngoại lệ tải lỗi) | Trung bình | Medium | Mạng/BE trả lỗi khi tải danh sách | 1. Mở panel S05<br>2. Để request lỗi (500) | API trả 500 | Hiện "Không tải được danh sách pin cần đặt lại" + nút "Thử lại"; không hiện danh sách rỗng giả | Manual | Chưa chạy |
| TC-S05-05 | Edge | BVA | R-S05-01 (cắt văn bản dài) | Thấp | Low | Panel mở; 1 pin có tên/đường dẫn rất dài | 1. Quan sát item dài<br>2. Hover | Tên tài sản 80 ký tự; đường dẫn 6 cấp | Văn bản cắt "..." gọn 1 dòng; hover hiện tooltip đầy đủ; không vỡ layout | Manual | Chưa chạy |
| TC-S05-06 | Edge | EP | R-S05-02 / UC-S05-03 (ngoại lệ đồng bộ) | Trung bình | Medium | Panel mở với 3 pin; người khác đặt lại `B-002` | 1. Để pin `B-002` được người khác xử lý | Pin 3 bị xử lý ngoài | Item `B-002` lặng lẽ rời danh sách (fade+collapse), bộ đếm tự về `Tổng: 2`, không hiện lỗi đột ngột | Manual | Chưa chạy |

## Chức năng: Chọn pin & vào chế độ đặt lại (F15) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S05-07 | Positive | EP | R-S05-03 / US-S05-02 GWT-1 / UC-S05-02 | Cao | High | Panel mở; pin `A-014` không bị khóa | 1. Bấm [Đặt lại vị trí] trên item `A-014` | `A-014 · Máy nén khí`, sơ đồ "Phòng 305" | Panel đóng (slide-out phải); S01 mở đúng sơ đồ "Phòng 305"; pin `A-014` được làm nổi (pulse); vào chế độ đặt lại (con trỏ đặt pin) + banner "Đang đặt lại vị trí A-014 — click hoặc kéo pin vào vùng sơ đồ." | Auto | Chưa chạy |
| TC-S05-08 | Negative | DT | R-S05-N04 / UC-S05-02 (ngoại lệ khóa) / BRule-S05 (khóa) | Cao | High | Panel mở; pin `A-031` **đang bị khóa** (người khác sửa) | 1. Quan sát item `A-031`<br>2. Thử bấm [Đặt lại vị trí] | `A-031 · Tủ điện`, khóa = true | Nút [Đặt lại vị trí] của `A-031` **vô hiệu**; hiện gợi ý/thông báo "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."; không vào được chế độ đặt lại | Auto | Chưa chạy |
| TC-S05-09 | Edge | ST | R-S05-N04 / UC-S05-02 (khóa tự mở) | Trung bình | Medium | Pin `A-031` bị khóa, chờ 5 phút | 1. Đợi quá 5 phút<br>2. Quan sát item `A-031` | khóa hết hạn sau 5:00 | Khóa tự mở; nút [Đặt lại vị trí] của `A-031` bật lại; bấm được vào chế độ đặt lại | Manual | Chưa chạy |
| TC-S05-10 | Negative | EP | R-S05-03 / UC-S05-02 (ngoại lệ ảnh bị xóa) / BRule-S05-06 | Trung bình | Medium | Đang ở chế độ đặt lại pin `B-002`; ảnh sơ đồ "Kho B1" bị xóa | 1. Người khác xóa ảnh "Kho B1"<br>2. Quan sát | ảnh sơ đồ bị xóa | Thoát chế độ đặt lại; pin `B-002` về "chưa có vị trí", rời danh sách; thông báo nhẹ cho người dùng | Manual | Chưa chạy |

## Chức năng: Đặt lại tọa độ & validation vùng ảnh (F15) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S05-11 | Positive | EP | R-S05-04 / US-S05-02 GWT-2 / UC-S05-02 | Cao | Critical | Đang ở chế độ đặt lại pin `A-014`, sơ đồ "Phòng 305" | 1. Click điểm trong vùng ảnh<br>2. Bấm Lưu | tọa độ `(40, 60)` | Pin nhận tọa độ tương đối `(40%, 60%)`; lưu thành công; toast "Đã đặt lại vị trí pin." | Auto | Chưa chạy |
| TC-S05-12 | Edge | BVA | R-S05-04 / BRule-S05-02 (biên 0) | Cao | High | Như trên, pin `A-014` | 1. Đặt pin tại góc biên<br>2. Lưu | tọa độ `(0, 0)` (biên dưới hợp lệ) | Chấp nhận; lưu `(0%, 0%)` thành công; toast "Đã đặt lại vị trí pin." | Auto | Chưa chạy |
| TC-S05-13 | Edge | BVA | R-S05-04 / BRule-S05-02 (biên 100) | Cao | High | Như trên, pin `A-014` | 1. Đặt pin tại góc đối<br>2. Lưu | tọa độ `(100, 100)` (biên trên hợp lệ) | Chấp nhận; lưu `(100%, 100%)` thành công; toast "Đã đặt lại vị trí pin." | Auto | Chưa chạy |
| TC-S05-14 | Negative | BVA | R-S05-06 / US-S05-03 GWT-1 / UC-S05-02 (ngoại lệ ngoài vùng) | Cao | Critical | Đang đặt lại pin `A-014`, sơ đồ "Phòng 305" | 1. Click/kéo pin ra ngoài khung ảnh<br>2. Thử Lưu | tọa độ `(105, 40)` ngoài vùng | Chặn Lưu; báo "Vị trí nằm ngoài sơ đồ." gần con trỏ/banner; **không lưu** | Auto | Chưa chạy |
| TC-S05-15 | Negative | BVA | R-S05-06 / BRule-S05-02 (âm) | Cao | High | Như TC-S05-14 | 1. Đặt pin tọa độ âm<br>2. Thử Lưu | tọa độ `(-3, 50)` | Chặn Lưu; báo "Vị trí nằm ngoài sơ đồ."; không lưu | Auto | Chưa chạy |
| TC-S05-16 | Edge | BVA | R-S05-06 / BRule-S05-02 (sát ngoài biên) | Cao | High | Như TC-S05-14 | 1. Đặt pin sát ngoài biên phải<br>2. Thử Lưu | tọa độ `(100.5, 50)` | Chặn Lưu (vượt 100); báo "Vị trí nằm ngoài sơ đồ."; không lưu | Auto | Chưa chạy |
| TC-S05-17 | Negative | EP | R-S05-06 / US-S05-03 GWT-2 / UC-S05-02 | Cao | High | Vừa bị chặn ở TC-S05-14 | 1. Mở lại panel S05<br>2. Kiểm tra `A-014` | `A-014` sau khi bị chặn | Pin `A-014` vẫn ở trạng thái "cần đặt lại", vẫn trong danh sách; bộ đếm vẫn `Tổng: 3` | Auto | Chưa chạy |
| TC-S05-18 | Positive | EP | R-S05-N03 / US-S05-02 GWT-3 / BRule-S05-03 | Cao | High | Đặt lại pin `A-014` thành công (như TC-S05-11) | 1. Lưu tọa độ hợp lệ<br>2. Kiểm tra nhật ký kiểm toán | tọa độ cũ `(105,40)` → mới `(40,60)` | Tạo bản ghi nhật ký kiểm toán: người (quanly@ngocdung.net), hành động đặt lại, tài sản `A-014`, vị trí cũ→mới, thời điểm; **không** tạo bản ghi lịch sử di chuyển | Manual | Chưa chạy |
| TC-S05-19 | Negative | EP | R-S05-04 / Edge rớt mạng khi Lưu | Trung bình | Medium | Đang đặt lại pin `A-014`, tọa độ hợp lệ `(40,60)` | 1. Ngắt mạng<br>2. Bấm Lưu | mất kết nối khi gửi | Snackbar "Lỗi kết nối, chưa lưu được"; giữ vị trí đang đặt; không cập nhật nửa vời (pin vẫn cần đặt lại) | Manual | Chưa chạy |

## Chức năng: Pin rời danh sách & chuyển trạng thái (F15) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S05-20 | Positive | ST | R-S05-05 / US-S05-04 GWT-1 / UC-S05-03 / BRule-S05-04 | Cao | Critical | Danh sách 3 pin; đặt lại xong pin `A-014` (trạng thái CanDatLai → DaGanViTri) | 1. Lưu tọa độ hợp lệ pin `A-014`<br>2. Quan sát danh sách | `A-014` lưu `(40,60)` | Pin `A-014` chuyển "đã có vị trí", rời danh sách (fade+collapse, item dưới trượt lên); bộ đếm về `Tổng: 2`; hiển thị bình thường trên sơ đồ | Auto | Chưa chạy |
| TC-S05-21 | Edge | ST | R-S05-07 / US-S05-04 GWT-2 / UC-S05-03 (về Empty) | Cao | High | Danh sách còn 1 pin cuối `B-002` | 1. Đặt lại xong pin cuối `B-002` | `B-002` lưu `(50,50)` | Bộ đếm về `Tổng: 0`; panel chuyển sang trạng thái rỗng "Không có pin nào cần đặt lại vị trí" (fade-in + minh họa scale-up) | Auto | Chưa chạy |
| TC-S05-22 | Positive | DT | R-S05-08 / US-S05-05 GWT-1, GWT-2 / BRule-S05-05 | Trung bình | Medium | Đăng nhập vai trò **Giám sát**; có pin cần đặt lại | 1. Mở panel S05<br>2. Bấm [Đặt lại vị trí] pin `B-002`<br>3. Lưu tọa độ hợp lệ | Giám sát; `B-002` `(50,50)` | Giám sát mở panel & đặt lại được như Quản trị; lưu thành công không yêu cầu quyền quản lý cấu trúc | Auto | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện (vai trò, khóa) → DT; có luồng trạng thái (cần đặt lại → đã đặt) → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S05-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: 0, 100, sát ngoài biên (tọa độ %) |
| DT (Decision Table) | Bảng quyết định — tổ hợp điều kiện (vai trò, pin khóa) → kết quả |
| ST (State Transition) | Kiểm thử chuyển trạng thái: "cần đặt lại" → "đã đặt"/"đã có vị trí" |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Pin cần đặt lại | Pin có tọa độ nằm ngoài vùng ảnh sơ đồ mới (sau thay ảnh), cần đặt lại tọa độ |
| Tọa độ tương đối (%) | Vị trí pin lưu theo phần trăm kích thước ảnh; biên hợp lệ 0–100 |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
