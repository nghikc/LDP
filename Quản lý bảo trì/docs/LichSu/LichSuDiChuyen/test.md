# Tài liệu kiểm thử — Lịch sử di chuyển tài sản (Mã màn: S06)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S06..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 24 | 0 | 0 | 0 | 0 | 24 | 0% | — |

## Dữ liệu nền dùng chung (fixtures)
> Các TC dưới đây tham chiếu các tài sản mẫu sau.

- **A-007 · Máy nén khí** — có **3 bản ghi** di chuyển:
  - BG1: `22/06/2026 14:30` · Nguyễn Văn A · `Tòa A › Tầng 3 › Phòng 305` → `Tòa A › Tầng 4 › Phòng 410` · lý do "Chuyển sang dây chuyền mới".
  - BG2: `10/03/2026 09:05` · Trần Thị B · `Tòa A › Tầng 2 › Kho` → `Tòa A › Tầng 3 › Phòng 305` · **không có lý do**.
  - BG3 (đầu đời): `02/01/2026 08:00` · Trần Thị B · `(Chưa có vị trí)` → `Tòa A › Tầng 2 › Kho` · lý do "Gán vị trí lần đầu khi nhập kho".
- **A-045 · Tủ điện** — **0 bản ghi** (chưa từng di chuyển).
- **A-100 · Băng tải dài** — **237 bản ghi** (lịch sử rất dài; kích thước trang = 50).
- **A-200 · Bơm trục** — có lịch sử nhưng **không** bản ghi nào trong khoảng `01/02/2026–28/02/2026`.
- Ngày hệ thống giả lập khi test: `22/06/2026`. Vai trò đăng nhập: `Quản trị` hoặc `Giám sát` (nêu rõ trong từng TC).

## Chức năng: Xem lịch sử di chuyển (F17) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S06-01 | Positive | EP | R-S06-01 / US-S06-01 GWT-1 | Cao | Critical | Đã đăng nhập (Quản trị); đang ở S01 | 1. Click pin A-007 → "Xem lịch sử"<br>2. Quan sát panel | Tài sản `A-007 · Máy nén khí` (3 bản ghi) | Panel slide-in từ phải; liệt kê **3** bản ghi theo thời điểm **giảm dần** (22/06 → 10/03 → 02/01); trang đầu hiển thị < 2 giây | Auto | Chưa chạy |
| TC-S06-02 | Positive | EP | R-S06-02 / US-S06-01 GWT-2 | Cao | Critical | Panel A-007 đang mở | 1. Đọc bản ghi mới nhất (BG1) | BG1: 22/06/2026 14:30 · Nguyễn Văn A | Mục hiện đủ 4 thông tin: thời điểm `22/06/2026 14:30`, người `Nguyễn Văn A`, breadcrumb `Tòa A › Tầng 3 › Phòng 305 → Tòa A › Tầng 4 › Phòng 410`, lý do "Chuyển sang dây chuyền mới" | Auto | Chưa chạy |
| TC-S06-03 | Edge | EP | R-S06-02 / BRule-S06-04 | Trung bình | Medium | Panel A-007 đang mở | 1. Đọc bản ghi BG2 (không có lý do) | BG2: 10/03/2026 09:05, lý do trống | Dòng lý do hiển thị đúng `(Không có lý do)`; bản ghi vẫn hợp lệ, hiện đầy đủ vị trí cũ → mới | Auto | Chưa chạy |
| TC-S06-04 | Edge | EP | R-S06-02 / US-S06-01 GWT-3 / BRule-S06-02 | Trung bình | High | Panel A-007 đang mở | 1. Đọc bản ghi đầu đời (BG3) | BG3: 02/01/2026 08:00, vị trí cũ trống | Vị trí cũ hiển thị đúng `(Chưa có vị trí)`; vị trí mới `Tòa A › Tầng 2 › Kho`; lý do "Gán vị trí lần đầu khi nhập kho" | Auto | Chưa chạy |
| TC-S06-05 | Positive | ST | R-S06-03 / UC-S06-01 b1–b2 | Cao | High | Đã đăng nhập; đang ở S01 | 1. Mở lịch sử A-007 từ **popup pin**<br>2. Quan sát | Lối vào: popup pin S01 | Panel mở slide-left đúng tài sản A-007; header hiện `A-007 · Máy nén khí` (chỉ đọc) | Manual | Chưa chạy |
| TC-S06-06 | Positive | ST | R-S06-03 / UC-S06-01 b1 | Trung bình | Medium | Có kết quả tra cứu A-007 trên S01 | 1. Mở lịch sử A-007 từ **kết quả tra cứu**<br>2. Quan sát | Lối vào: kết quả tra cứu | Panel mở đúng A-007 (lối vào thứ hai hoạt động) | Manual | Chưa chạy |
| TC-S06-07 | Positive | ST | R-S06-03 / UC-S06-01 b4 | Cao | High | Panel A-007 đang mở | 1. Nhấn ← (hoặc ✕)<br>2. Quan sát | — | Panel slide-out sang phải; trả về S01 giữ nguyên ngữ cảnh sơ đồ/pin trước đó; focus trả về pin/kết quả đã mở | Manual | Chưa chạy |
| TC-S06-08 | Positive | ST | R-S06-03 | Trung bình | Medium | Panel A-007 đang mở | 1. Click vùng scrim ngoài panel | — | Panel đóng (slide-out), trở về S01 | Manual | Chưa chạy |
| TC-S06-09 | Negative | ST | UC-S06-01 ngoại lệ / US-S06-02 GWT-2 | Cao | High | Backend trả lỗi khi tải trang đầu | 1. Mở lịch sử A-007 (giả lập lỗi mạng) | Phản hồi tải: HTTP 500 | Panel hiện `Không tải được lịch sử.` + nút `Thử lại`; không hiển thị timeline trống | Auto | Chưa chạy |
| TC-S06-10 | Positive | ST | UC-S06-01 ngoại lệ | Trung bình | Medium | Đang ở trạng thái Error (sau TC-S06-09) | 1. Khôi phục mạng<br>2. Nhấn `Thử lại` | Phản hồi lần 2: 200 OK, 3 bản ghi | Tải lại thành công; hiện 3 bản ghi A-007; thông báo lỗi biến mất | Auto | Chưa chạy |
| TC-S06-11 | Edge | ST | R-S06-N02 / BRule-S06-03 | Trung bình | High | Đăng nhập vai trò **Giám sát** | 1. Mở lịch sử A-007 | Vai trò: Giám sát | Giám sát xem được timeline đầy đủ y hệt Quản trị (cùng dữ liệu, chỉ đọc) | Manual | Chưa chạy |
| TC-S06-12 | Edge | DT | R-S06-08 / US-S06-04 GWT-1 / BRule-S06-01 | Cao | High | Panel A-007 đang mở (cả vai trò Quản trị & Giám sát) | 1. Soát mọi bản ghi tìm nút Sửa/Xóa | A-007, cả 2 vai trò | **Không** có nút Sửa hay Xóa cho bất kỳ bản ghi nào; toàn màn chỉ đọc | Manual | Chưa chạy |
| TC-S06-13 | Edge | ST | US-S06-04 GWT-2 / BRule-S06-01, BRule-S06-02 | Cao | High | A-007 vừa được di dời thêm 1 lần (F12) | 1. Mở lại lịch sử A-007 | Bản ghi mới: 23/06/2026 | Bản ghi mới thêm vào **đầu** chuỗi (4 bản ghi); 3 bản ghi cũ **giữ nguyên** không đổi (append-only) | Manual | Chưa chạy |

## Chức năng: Lọc theo khoảng thời gian (F17) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S06-14 | Positive | EP | R-S06-04 / US-S06-03 GWT-1 / UC-S06-02 | Trung bình | High | Panel A-007 đang mở (3 bản ghi) | 1. Nhập Từ ngày `01/01/2026`, Đến ngày `30/06/2026`<br>2. Nhấn `Áp dụng` | Từ `01/01/2026` – Đến `30/06/2026` | Hiện đủ **cả 3** bản ghi (đều trong khoảng) | Auto | Chưa chạy |
| TC-S06-15 | Positive | BVA | R-S06-04 / UC-S06-02 b3 | Trung bình | High | Panel A-007 đang mở | 1. Nhập Từ ngày `10/03/2026`, Đến ngày `10/03/2026`<br>2. Áp dụng | Khoảng = đúng ngày BG2 (biên: bao gồm hai mốc) | Hiện **1** bản ghi BG2 (10/03/2026); xác nhận hai mốc đầu/cuối được **bao gồm** | Auto | Chưa chạy |
| TC-S06-16 | Edge | BVA | R-S06-04 | Trung bình | Medium | Panel A-007 đang mở | 1. Nhập Từ ngày `11/03/2026` (mốc +1 ngày sau BG2)<br>2. Đến ngày `21/06/2026` (mốc -1 ngày trước BG1)<br>3. Áp dụng | Khoảng `11/03–21/06` (loại trừ cả BG1 và BG2 sát biên) | Hiện **0** bản ghi của A-007 trong khoảng → "Không có lần di chuyển nào trong khoảng đã chọn." | Auto | Chưa chạy |
| TC-S06-17 | Positive | EP | R-S06-04 (lọc một phía) / SRS quy tắc liên trường | Trung bình | Medium | Panel A-007 đang mở | 1. Chỉ nhập Từ ngày `01/06/2026` (để trống Đến ngày)<br>2. Áp dụng | Chỉ Từ ngày `01/06/2026` | Lọc một phía hợp lệ; hiện chỉ BG1 (22/06/2026 ≥ 01/06) | Auto | Chưa chạy |
| TC-S06-18 | Positive | EP | R-S06-04 (lọc một phía) | Trung bình | Medium | Panel A-007 đang mở | 1. Chỉ nhập Đến ngày `28/02/2026` (để trống Từ ngày)<br>2. Áp dụng | Chỉ Đến ngày `28/02/2026` | Lọc một phía hợp lệ; hiện chỉ BG3 (02/01/2026 ≤ 28/02) | Auto | Chưa chạy |
| TC-S06-19 | Positive | ST | R-S06-04 / UC-S06-02 b4 | Trung bình | Medium | Đang lọc (sau TC-S06-16) | 1. Nhấn `Xóa lọc` | — | Bộ lọc reset; hiện lại **toàn bộ 3** bản ghi A-007 | Auto | Chưa chạy |
| TC-S06-20 | Negative | DT | R-S06-05 / US-S06-03 GWT-2 / UC-S06-02 ngoại lệ | Cao | High | Panel A-007 đang mở | 1. Nhập Từ ngày `30/06/2026`, Đến ngày `01/01/2026` (Từ > Đến)<br>2. Nhấn `Áp dụng` | Từ `30/06/2026` > Đến `01/01/2026` | Hiện lỗi inline `Từ ngày không được sau Đến ngày.`; **không** gọi tải; giữ nguyên giá trị đã nhập | Auto | Chưa chạy |
| TC-S06-21 | Negative | DT | R-S06-05 | Trung bình | Medium | Đang ở trạng thái lỗi (sau TC-S06-20) | 1. Sửa Đến ngày thành `30/06/2026` (Từ=30/06, Đến=30/06)<br>2. Áp dụng | Sửa cho hợp lệ (Từ ≤ Đến) | Lỗi inline biến mất; áp dụng được; hiện bản ghi trong khoảng (BG1 22/06 không nằm trong 30/06 → 0 bản ghi, báo rỗng-sau-lọc) | Auto | Chưa chạy |
| TC-S06-22 | Negative | EP | R-S06-06 / US-S06-03 GWT-3 / UC-S06-02 ngoại lệ | Trung bình | High | Panel A-200 đang mở (có lịch sử) | 1. Nhập Từ `01/02/2026`, Đến `28/02/2026`<br>2. Áp dụng | A-200, khoảng không có bản ghi | Hiện `Không có lần di chuyển nào trong khoảng đã chọn.` + gợi ý/nút `Xóa lọc` (khác với trạng thái rỗng tài sản mới) | Auto | Chưa chạy |

## Chức năng: Trạng thái rỗng & Tải thêm khi lịch sử dài (F17) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S06-23 | Negative | EP | R-S06-06 / US-S06-02 GWT-1 | Trung bình | High | Đã đăng nhập; đang ở S01 | 1. Mở lịch sử A-045 (0 bản ghi) | `A-045 · Tủ điện` (0 bản ghi) | Hiện trạng thái rỗng: `Tài sản chưa có lần di chuyển nào.` + câu phụ "Mọi thay đổi vị trí sẽ được ghi lại và hiện ở đây."; **không** hiện danh sách trống/lỗi | Auto | Chưa chạy |
| TC-S06-24 | Edge | BVA | R-S06-07 / R-S06-N01 / US-S06-05 GWT-1, GWT-2 / UC-S06-03 | Cao | High | Panel A-100 đang mở (237 bản ghi, trang=50) | 1. Quan sát trang đầu (50 mục)<br>2. Cuộn tới cuối → tải lô tiếp<br>3. Lặp tới khi hết | A-100, 237 bản ghi: lô 50/50/50/50/37 | Trang đầu hiện 50 mục (< 2s); mỗi lần cuộn nối thêm lô < 2s, đúng thứ tự, không trùng; sau lô cuối (đủ 237) hiện `— Đã hiển thị hết lịch sử —` | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài → BVA; tổ hợp nhiều điều kiện → DT; có luồng trạng thái → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi hoặc cột ghi chú nếu thêm).

## Ma trận phủ (coverage)
| Nguồn | TC phủ |
|-------|--------|
| R-S06-01 | TC-S06-01 |
| R-S06-02 | TC-S06-02, TC-S06-03, TC-S06-04 |
| R-S06-03 | TC-S06-05, TC-S06-06, TC-S06-07, TC-S06-08 |
| R-S06-04 | TC-S06-14..TC-S06-19 |
| R-S06-05 | TC-S06-20, TC-S06-21 |
| R-S06-06 | TC-S06-16, TC-S06-22, TC-S06-23 |
| R-S06-07 | TC-S06-24 |
| R-S06-08 | TC-S06-12, TC-S06-13 |
| R-S06-N01 | TC-S06-01, TC-S06-24 |
| R-S06-N02 | TC-S06-09, TC-S06-11 |
| UC-S06-01 (chính + ngoại lệ) | TC-S06-01..08, TC-S06-09, TC-S06-10, TC-S06-23 |
| UC-S06-02 (chính + ngoại lệ) | TC-S06-14..22 |
| UC-S06-03 (chính + ngoại lệ) | TC-S06-24 |

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S06-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: min, min+1, max-1, max (ở đây: biên ngày của khoảng lọc) |
| DT (Decision Table) | Bảng quyết định — liệt kê tổ hợp điều kiện → kết quả |
| ST (State Transition) | Kiểm thử chuyển trạng thái hợp lệ và không hợp lệ |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Append-only (chỉ thêm) | Dữ liệu chỉ được thêm mới, không sửa/không xóa bản ghi đã có |
| Rỗng-sau-lọc | Tài sản có lịch sử nhưng khoảng lọc không khớp bản ghi nào |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
