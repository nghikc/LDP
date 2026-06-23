# Kế hoạch build — Lịch sử di chuyển tài sản (Mã màn: S06)

**Goal:** Dựng panel chỉ đọc dạng timeline cho phép xem toàn bộ chuỗi di chuyển (vị trí cũ → mới, người, thời điểm, lý do) của một tài sản, có lọc theo khoảng thời gian và tải thêm khi lịch sử dài.
**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).
**Thứ tự phụ thuộc:** Task 1 → Task 2 → Task 3 → Task 4 → Task 5. Task 1 là nền tảng (mở panel + tải + render timeline); Task 2 (trạng thái rỗng/lỗi) và Task 3 (lọc) đều phụ thuộc Task 1; Task 4 (phân trang) phụ thuộc Task 1; Task 5 (read-only/append-only) phụ thuộc Task 1. Task 3 và Task 4 độc lập nhau, có thể làm song song sau Task 1.

## Task 1: Mở panel + tải & hiển thị timeline trang đầu (vertical slice nền tảng)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S06-01 (hiển thị 3 bản ghi giảm dần), TC-S06-02 (đủ 4 thông tin), TC-S06-03 (không có lý do), TC-S06-04 (bản ghi đầu đời), TC-S06-05/06 (lối vào popup pin & tra cứu), TC-S06-07/08 (đóng panel/scrim), TC-S06-N01 (< 2s)
**Files:**
- Create: panel S06 (component slide-in từ phải), API đọc lịch sử di chuyển theo mã tài sản (trang đầu), mapper bản ghi → mục timeline
- Test: test tải + render timeline + thứ tự giảm dần + 2 lối vào từ S01

- [ ] Step 1: Viết test thất bại (TC-S06-01..08 trong test.md)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu: mở panel slide-left từ S01, gọi API trang đầu (≤ 50 bản ghi), render timeline mới-nhất-trên-cùng với 4 trường; xử lý "(Chưa có vị trí)" / "(Không có lý do)"; nút ←/✕/scrim đóng về S01
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S06-01..08 pass · timeline đúng thứ tự thời gian giảm dần · breadcrump vị trí cũ→mới + người + thời điểm (dd/MM/yyyy HH:mm) + lý do đúng · trang đầu hiển thị < 2s (R-S06-N01) · cả 2 lối vào hoạt động · không lỗi lint.

## Task 2: Trạng thái rỗng, rỗng-sau-lọc & lỗi tải
**Phụ thuộc:** Task 1
**Trace test:** TC-S06-23 (rỗng tài sản mới), TC-S06-22 (rỗng-sau-lọc), TC-S06-09 (lỗi tải), TC-S06-10 (Thử lại thành công)
**Files:**
- Create: view Empty / Filtered-empty / Error trong panel; nút "Thử lại"; nút "Xóa lọc" trong filtered-empty
- Test: test 3 trạng thái tách bạch + retry

- [ ] Step 1: Viết test thất bại (TC-S06-09, TC-S06-10, TC-S06-22, TC-S06-23)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: phân biệt rỗng-tài-sản ("Tài sản chưa có lần di chuyển nào.") vs rỗng-sau-lọc ("Không có lần di chuyển nào trong khoảng đã chọn." + Xóa lọc) vs lỗi ("Không tải được lịch sử." + Thử lại)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S06-09, 10, 22, 23 pass · ba trạng thái tách bạch đúng wording (R-S06-06) · Thử lại tải lại được · không lỗi lint.

## Task 3: Lọc theo khoảng thời gian + chặn khoảng không hợp lệ
**Phụ thuộc:** Task 1
**Trace test:** TC-S06-14 (lọc đủ khoảng), TC-S06-15 (biên bao gồm hai mốc), TC-S06-16 (biên loại trừ), TC-S06-17/18 (lọc một phía), TC-S06-19 (Xóa lọc), TC-S06-20 (Từ>Đến chặn), TC-S06-21 (sửa hợp lệ rồi áp dụng)
**Files:**
- Create: thanh bộ lọc Từ ngày/Đến ngày + Áp dụng/Xóa lọc; validation liên trường tu_ngay ≤ den_ngay; lỗi inline; gắn tham số khoảng vào API đọc
- Test: test các biên ngày (BVA), lọc một phía (EP), chặn Từ>Đến (DT)

- [ ] Step 1: Viết test thất bại (TC-S06-14..21)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: Áp dụng → tải bản ghi trong khoảng (bao gồm hai mốc); lọc một phía hợp lệ; Từ>Đến → lỗi inline "Từ ngày không được sau Đến ngày." và **không** gọi tải; Xóa lọc → toàn bộ lịch sử
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S06-14..21 pass · biên bao gồm hai mốc đúng · khoảng không hợp lệ bị chặn không gọi tải (R-S06-05) · Xóa lọc khôi phục đầy đủ (R-S06-04) · không lỗi lint.

## Task 4: Phân trang / tải thêm khi lịch sử dài
**Phụ thuộc:** Task 1
**Trace test:** TC-S06-24 (237 bản ghi, lô 50, nối thêm < 2s, không trùng, kết "— Đã hiển thị hết lịch sử —")
**Files:**
- Create: cuộn vô hạn/"Xem thêm" theo lô; cờ "còn dữ liệu"; spinner cuối danh sách; chỉ báo hết
- Test: test nối lô đúng thứ tự/không trùng + chỉ báo hết + hiệu năng từng lô

- [ ] Step 1: Viết test thất bại (TC-S06-24)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: tải trang đầu 50 mục, cuộn cuối → tải lô tiếp nối vào timeline (không đụng mục cũ); hết dữ liệu → "— Đã hiển thị hết lịch sử —"; mỗi lô < 2s
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S06-24 pass · nối thêm đúng thứ tự, không trùng (R-S06-07) · mỗi lô < 2s kể cả hàng trăm bản ghi (R-S06-N01) · chỉ báo hết đúng wording · không lỗi lint.

## Task 5: Bảo đảm chỉ-đọc & bất biến (append-only)
**Phụ thuộc:** Task 1
**Trace test:** TC-S06-11 (Giám sát xem được), TC-S06-12 (không nút Sửa/Xóa, cả 2 vai trò), TC-S06-13 (di dời mới thêm vào đầu, bản ghi cũ giữ nguyên)
**Files:**
- Create: kiểm soát quyền đọc (Quản trị + Giám sát); đảm bảo panel không render bất kỳ điều khiển sửa/xóa
- Test: test vắng mặt nút sửa/xóa cho cả 2 vai trò + append-only sau di dời

- [ ] Step 1: Viết test thất bại (TC-S06-11, TC-S06-12, TC-S06-13)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: cả 2 vai trò xem cùng giao diện chỉ đọc; không có endpoint/UI sửa-xóa bản ghi; xác nhận bản ghi mới chỉ append vào đầu chuỗi
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S06-11, 12, 13 pass · không có thao tác sửa/xóa cho mọi vai trò (R-S06-08, BRule-S06-01) · append-only được kiểm chứng · không lỗi lint.
