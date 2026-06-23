# Tài liệu kiểm thử — Quản lý ảnh sơ đồ mặt bằng (Mã màn: S03)

> Mỗi acceptance criterion (GWT) trong userstory, mỗi yêu cầu `R-S03..`, và mỗi luồng use case (kể cả ngoại lệ) → ≥1 test case.
> Phủ đủ Positive · Negative · Edge; độ sâu theo Risk Level. Suy ca bằng kỹ thuật EP/BVA/DT/ST.
> Test Data ghi **giá trị cụ thể** (cấm placeholder).

Kỹ thuật: EP = Equivalence Partitioning · BVA = Boundary Value Analysis · DT = Decision Table · ST = State Transition.
Risk: Cao / Trung bình / Thấp · Priority: Critical / High / Medium / Low.
**Trạng thái:** Chưa chạy / Pass / Fail / Blocked / Skip (mặc định `Chưa chạy`). **Cách chạy:** Manual / Auto.

## Tổng hợp thực thi (roll-up)
> Cập nhật sau mỗi lần chạy test (manual hoặc automation).

| Tổng TC | Pass | Fail | Blocked | Skip | Chưa chạy | % Pass | Lần chạy cuối |
|---------|------|------|---------|------|-----------|--------|---------------|
| 28 | 0 | 0 | 0 | 0 | 28 | 0% | — |

## Ma trận truy vết nguồn → TC
| Nguồn (R-S03 / GWT / UC) | Test case |
|--------------------------|-----------|
| R-S03-01 (tải lên ảnh) | TC-S03-01, TC-S03-02 |
| R-S03-02 (tối đa 1 sơ đồ/nút) | TC-S03-03 |
| R-S03-03 (validate định dạng & dung lượng) | TC-S03-04, TC-S03-05, TC-S03-06, TC-S03-07, TC-S03-08 |
| R-S03-04 (thay ảnh, giữ tọa độ %) | TC-S03-09, TC-S03-10, TC-S03-11, TC-S03-12 |
| R-S03-05 (pin tràn ngoài → S05) | TC-S03-13, TC-S03-14, TC-S03-15 |
| R-S03-06 (xóa ảnh, gỡ vị trí) | TC-S03-16, TC-S03-17, TC-S03-18 |
| R-S03-07 (xem trước + metadata) | TC-S03-19, TC-S03-20 |
| R-S03-08 (đóng modal không lưu dang dở) | TC-S03-21, TC-S03-22 |
| R-S03-N01 (PNG/JPG ≤ 10 MB) | TC-S03-04..08 |
| R-S03-N02 (giữ tọa độ % khi thay) | TC-S03-11 |
| R-S03-N03 (nhật ký kiểm toán · chỉ Quản trị) | TC-S03-23, TC-S03-24, TC-S03-25 |
| R-S03-N04 (mở & xem trước < 2s) | TC-S03-26 |
| UC ngoại lệ: rớt mạng khi tải/thay/xóa | TC-S03-27 |
| Luồng trạng thái nút (State) | TC-S03-28 |

## Chức năng: Tải lên ảnh sơ đồ (F06) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-01 | Positive | EP | R-S03-01 / US-S03-01 GWT-1 | Cao | Critical | Là Quản trị; nút "Tầng 3" chưa có sơ đồ; mở menu nút → "Quản lý ảnh sơ đồ" | 1. Mở modal cho nút chưa có sơ đồ | nút: `Tòa A › Tầng 3` (chưa có ảnh) | Modal hiện vùng kéo-thả + hướng dẫn "Kéo & thả ảnh vào đây... PNG hoặc JPG, tối đa 10 MB, 1 ảnh mỗi khu vực"; ẩn nút Thay/Xóa | Auto | Chưa chạy |
| TC-S03-02 | Positive | EP | R-S03-01 / US-S03-01 GWT-2 | Cao | Critical | Như TC-S03-01 | 1. Kéo-thả file ảnh hợp lệ vào vùng tải<br>2. Chờ tải xong | file: `tang3.png`, 8 MB, PNG, 1920×1080 | Ảnh gắn vào nút; toast "Đã tải lên sơ đồ."; modal fade về S01; mở lại S01 thấy ảnh + cho đặt pin; có bản ghi nhật ký kiểm toán | Auto | Chưa chạy |
| TC-S03-03 | Negative | ST | R-S03-02 / BRule-S03-01 | Cao | High | Là Quản trị; nút "Tầng 3" **đã có** sơ đồ | 1. Mở modal cho nút đã có sơ đồ | nút có ảnh `so-do-tang-3.png` | Ẩn vùng tải mới; chỉ hiện xem trước + nút Thay/Xóa; không thể tạo ảnh thứ hai cho nút | Auto | Chưa chạy |

## Chức năng: Kiểm tra định dạng & dung lượng (F06 / R-S03-03) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-04 | Negative | EP | R-S03-03, R-S03-N01 / US-S03-01 GWT-3 | Cao | Critical | Nút "Tầng 3" chưa có sơ đồ; modal đang mở | 1. Thả file **sai định dạng** vào vùng tải | file: `tang3.gif`, 2 MB, GIF | Báo lỗi inline "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB."; viền vùng tải chuyển trạng thái lỗi; **không** tải lên | Auto | Chưa chạy |
| TC-S03-05 | Negative | EP | R-S03-03, R-S03-N01 / US-S03-01 GWT-3 | Cao | High | Như TC-S03-04 | 1. Thả file **không phải ảnh** | file: `tang3.pdf`, 1 MB, PDF | Báo lỗi "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB."; không tải lên | Auto | Chưa chạy |
| TC-S03-06 | Edge | BVA | R-S03-03, R-S03-N01 | Cao | High | Như TC-S03-04 | 1. Thả file PNG ngay **dưới biên** dung lượng | file: `tang3.png`, 10 MB (10485760 byte) | Hợp lệ → cho phép tải lên, gắn ảnh, toast "Đã tải lên sơ đồ." | Auto | Chưa chạy |
| TC-S03-07 | Edge | BVA | R-S03-03, R-S03-N01 / US-S03-01 GWT-3 | Cao | Critical | Như TC-S03-04 | 1. Thả file PNG **vượt biên** dung lượng | file: `tang3.png`, 11 MB (11534336 byte) | Báo lỗi "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB."; không tải lên | Auto | Chưa chạy |
| TC-S03-08 | Positive | EP | R-S03-03 | Trung bình | Medium | Như TC-S03-04 | 1. Thả file JPG hợp lệ | file: `tang3.jpg`, 3.5 MB, JPG, 1600×900 | Hợp lệ → tải lên thành công, toast "Đã tải lên sơ đồ." | Auto | Chưa chạy |

## Chức năng: Thay ảnh sơ đồ (F07) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-09 | Positive | DT | R-S03-04 / US-S03-02 GWT-1 | Cao | Critical | Là Quản trị; nút "Tầng 3" có ảnh `so-do-tang-3.png` và **12 pin** | 1. Bấm "Thay ảnh"<br>2. Chọn ảnh mới hợp lệ | ảnh mới: `tang3-v2.png`, 6 MB, 1920×1080 | Hiện dialog cảnh báo "Sơ đồ này đang có 12 pin. Hệ thống giữ nguyên vị trí tương đối của pin trên ảnh mới. Pin nằm ngoài vùng ảnh mới sẽ được đánh dấu 'cần đặt lại'. Tiếp tục thay?" + nút [Tiếp tục thay] [Hủy] | Auto | Chưa chạy |
| TC-S03-10 | Positive | DT | R-S03-04 / UC-S03-02 luồng thay thế | Trung bình | Medium | Nút "Tầng 3" có ảnh, **0 pin** | 1. Bấm "Thay ảnh"<br>2. Chọn ảnh mới hợp lệ | ảnh mới: `tang3-v2.png`, 6 MB | **Bỏ qua** dialog cảnh báo; thay trực tiếp; toast "Đã thay ảnh sơ đồ." | Auto | Chưa chạy |
| TC-S03-11 | Positive | EP | R-S03-04, R-S03-N02 / US-S03-02 GWT-2 | Cao | Critical | Nút có ảnh + 12 pin; đã bấm Thay + xác nhận | 1. Xác nhận "Tiếp tục thay"<br>2. Kiểm tra tọa độ pin sau khi thay | pin A-001 tại (30%, 40%); ảnh mới cùng tỉ lệ khung 1920×1080 | Ảnh cũ thay bằng ảnh mới; pin trong vùng giữ đúng tọa độ tương đối (A-001 vẫn (30%, 40%)); ghi nhật ký kiểm toán | Auto | Chưa chạy |
| TC-S03-12 | Negative | EP | R-S03-04 / UC-S03-02 ngoại lệ | Cao | High | Nút có ảnh + 12 pin; đã bấm Thay + chọn file | 1. Chọn file **sai định dạng** khi thay | file mới: `tang3.gif`, 2 MB | Báo "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB."; **không** thay; ảnh cũ giữ nguyên | Auto | Chưa chạy |

## Chức năng: Pin tràn ngoài → cần đặt lại (F07 / R-S03-05) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-13 | Edge | BVA | R-S03-05 / US-S03-02 GWT-3 | Cao | Critical | Nút có 12 pin; ảnh mới **nhỏ hơn / tỉ lệ khác** làm pin tràn | 1. Bấm Thay → chọn ảnh nhỏ hơn<br>2. Xác nhận "Tiếp tục thay" | ảnh mới: `tang3-nho.png`, 4 MB, 1280×720; pin A-014 tại (95%, 92%) **tràn ngoài** vùng ảnh mới; 3 pin tràn (A-012, A-013, A-014) | Đánh dấu 3 pin "cần đặt lại vị trí"; banner "3 pin nằm ngoài vùng ảnh mới được đánh dấu 'cần đặt lại vị trí'." + nút "Đặt lại ngay" | Auto | Chưa chạy |
| TC-S03-14 | Positive | ST | R-S03-05 | Cao | High | Như TC-S03-13, banner pin tràn đang hiện | 1. Bấm "Đặt lại ngay" | — | Modal S03 đóng (trượt xuống); điều hướng sang **S05** (Danh sách pin cần đặt lại) | Manual | Chưa chạy |
| TC-S03-15 | Edge | BVA | R-S03-05 | Trung bình | Medium | Nút có 12 pin; ảnh mới cùng/khớp tỉ lệ, **không** pin nào tràn | 1. Bấm Thay → chọn ảnh cùng tỉ lệ<br>2. Xác nhận | ảnh mới: `tang3-v2.png`, 1920×1080; tất cả pin trong vùng | Toast "Đã thay ảnh sơ đồ." **không** kèm banner pin tràn; không pin nào "cần đặt lại" | Auto | Chưa chạy |

## Chức năng: Xóa ảnh sơ đồ (F08) — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-16 | Positive | DT | R-S03-06 / US-S03-03 GWT-1 | Cao | Critical | Là Quản trị; nút có ảnh + **12 pin** | 1. Bấm "Xóa ảnh" | nút "Tầng 3" có 12 pin | Dialog cảnh báo "Xóa ảnh sẽ gỡ vị trí của 12 tài sản (về 'chưa có vị trí'). Hồ sơ tài sản được giữ nguyên. Tiếp tục?" + nút [Xóa ảnh] [Hủy] | Auto | Chưa chạy |
| TC-S03-17 | Positive | DT | R-S03-06 / US-S03-03 GWT-2 | Cao | Critical | Như TC-S03-16; dialog đang hiện | 1. Bấm "Xóa ảnh" trong dialog xác nhận | — | Ảnh bị gỡ khỏi nút; 12 pin biến mất; 12 tài sản về "chưa có vị trí"; hồ sơ tài sản giữ nguyên; ghi nhật ký kiểm toán; toast "Đã xóa sơ đồ." + fade về S01 | Auto | Chưa chạy |
| TC-S03-18 | Positive | DT | R-S03-06 / US-S03-03 GWT-3 | Trung bình | Medium | Nút có ảnh, **0 pin** | 1. Bấm "Xóa ảnh" | nút "Tầng 3" có 0 pin | **Không** hiện dialog; xóa trực tiếp; toast "Đã xóa sơ đồ." | Auto | Chưa chạy |

## Chức năng: Xem trước & metadata (R-S03-07) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-19 | Positive | EP | R-S03-07 | Trung bình | Medium | Nút có ảnh `so-do-tang-3.png`, 2.4 MB, 1920×1080, 12 pin | 1. Mở modal | — | Hiện ảnh xem trước co vừa khung + "so-do-tang-3.png · 2.4 MB · 1920×1080" + "12 pin đang đặt trên sơ đồ này" | Auto | Chưa chạy |
| TC-S03-20 | Edge | BVA | R-S03-07 / design-spec Edge | Thấp | Low | Nút có ảnh tên file rất dài | file: `so-do-mat-bang-toa-nha-A-tang-3-phong-305-ban-cap-nhat-2026.png` | Tên file cắt "..." + tooltip hiện đầy đủ khi hover/focus; metadata vẫn đọc được | Manual | Chưa chạy |

## Chức năng: Đóng modal (R-S03-08) — Risk: Trung bình

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-21 | Positive | ST | R-S03-08 / US-S03-04 GWT-1 | Trung bình | High | Đang chọn ảnh nhưng **chưa tải xong** | 1. Bấm ✕ (hoặc Đóng / Esc) | đang dang dở tải `tang3.png` | Modal fade về S01; thao tác dang dở bị hủy; nút giữ nguyên trạng thái ảnh trước đó (không gắn ảnh nửa vời) | Auto | Chưa chạy |
| TC-S03-22 | Negative | ST | R-S03-N03, BRule-S03-06 / US-S03-04 GWT-2 | Cao | High | Đăng nhập vai trò **Giám sát** | 1. Mở menu một nút khu vực ở S01 | role: `Giám sát` | **Không** thấy lối vào "Quản lý ảnh sơ đồ" (ẩn ở menu, không chỉ disable); không mở được S03 | Manual | Chưa chạy |

## Phi chức năng: Kiểm toán · Quyền · Mạng · Hiệu năng · Trạng thái — Risk: Cao

| Mã TC | Loại | Kỹ thuật | Nguồn | Risk | Priority | Tiền điều kiện | Các bước | Test Data | Kết quả mong đợi | Cách chạy | Trạng thái |
|-------|------|----------|-------|------|----------|----------------|----------|-----------|------------------|-----------|------------|
| TC-S03-23 | Positive | DT | R-S03-N03 | Cao | High | Là Quản trị; vừa tải lên `tang3.png` (TC-S03-02) | 1. Mở nhật ký kiểm toán | hành động: tải lên | Có bản ghi "người=Quản trị (giangnb), hành động=Tải lên sơ đồ, nút=Tòa A › Tầng 3, thời gian=<timestamp>" | Auto | Chưa chạy |
| TC-S03-24 | Positive | DT | R-S03-N03 | Cao | High | Vừa thay ảnh (TC-S03-11) | 1. Mở nhật ký kiểm toán | hành động: thay ảnh | Có bản ghi "hành động=Thay ảnh sơ đồ, nút=Tòa A › Tầng 3, người, thời gian" | Auto | Chưa chạy |
| TC-S03-25 | Positive | DT | R-S03-N03 | Cao | High | Vừa xóa ảnh (TC-S03-17) | 1. Mở nhật ký kiểm toán | hành động: xóa ảnh | Có bản ghi "hành động=Xóa ảnh sơ đồ + gỡ vị trí 12 tài sản, người, thời gian" | Auto | Chưa chạy |
| TC-S03-26 | Edge | BVA | R-S03-N04 | Trung bình | Medium | Nút có ảnh `so-do-tang-3.png` 2.4 MB | 1. Bấm mở modal; đo thời gian tới khi ảnh xem trước hiển thị | ảnh 2.4 MB | Modal mở và ảnh xem trước hiển thị **< 2 giây** | Manual | Chưa chạy |
| TC-S03-27 | Negative | DT | R-S03-N04 / UC-S03-01,02,03 ngoại lệ | Cao | High | Mô phỏng **rớt mạng** khi đang tải/thay/xóa | 1. Bắt đầu tải `tang3.png` rồi ngắt mạng giữa chừng | file: `tang3.png`, 8 MB; ngắt mạng ở 50% | Snackbar "Lỗi kết nối, chưa lưu được."; giữ nguyên hiện trạng ảnh/pin; không để ảnh nửa vời; nút hành động enable lại | Manual | Chưa chạy |
| TC-S03-28 | Positive | ST | srs Luồng 4 (State) | Cao | High | Là Quản trị | 1. Chưa có sơ đồ → tải lên → Đã có<br>2. Thay ảnh giữ tọa độ → Đã có<br>3. Thay ảnh pin tràn → Có pin cần đặt lại<br>4. Đặt lại ở S05 → Đã có<br>5. Xóa ảnh → Chưa có sơ đồ | chuỗi chuyển trạng thái hợp lệ | Mỗi chuyển trạng thái diễn ra đúng; không cho phép chuyển trái luật (vd tạo sơ đồ thứ hai khi Đã có) | Manual | Chưa chạy |

> Mẹo: mỗi luật/điều kiện trong `srs.md` áp 1 kỹ thuật phù hợp — input rời rạc → EP; có ngưỡng số/độ dài (10 MB) → BVA; tổ hợp nhiều điều kiện (còn pin? / quyền?) → DT; có luồng trạng thái nút → ST.
> Khi chạy test: cập nhật cột **Trạng thái** từng TC + bảng **roll-up** ở đầu file (Fail thì ghi mã lỗi/ghi chú vào cột Kết quả mong đợi hoặc cột ghi chú nếu thêm).

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| TC (Test Case) | Ca kiểm thử (TC-S03-01…) |
| EP (Equivalence Partitioning) | Chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm |
| BVA (Boundary Value Analysis) | Test giá trị biên: dưới biên (10 MB), trên biên (11 MB) |
| DT (Decision Table) | Bảng quyết định — tổ hợp điều kiện (còn pin? / quyền?) → kết quả |
| ST (State Transition) | Kiểm thử chuyển trạng thái nút: chưa có / đã có / có pin cần đặt lại |
| Positive / Negative / Edge | Ca thuận / ca lỗi / ca biên |
| Risk · Priority | Mức rủi ro (Cao/TB/Thấp) · Độ ưu tiên (Critical/High/Medium/Low) |
| Roll-up | Bảng tổng hợp kết quả thực thi (Pass/Fail/…) ở đầu file |
| Pin "cần đặt lại vị trí" | Pin có tọa độ % nằm ngoài vùng ảnh mới sau khi thay ảnh, xử lý ở S05 |
| Tọa độ tương đối (%) | Vị trí pin lưu theo phần trăm kích thước ảnh, giữ khi đổi ảnh |
| Nhật ký kiểm toán (audit log) | Bản ghi ai – làm gì – khi nào cho thao tác tải/thay/xóa ảnh |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
