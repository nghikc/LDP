# Kế hoạch build — Danh sách pin cần đặt lại (Mã màn: S05)

**Goal:** Dựng panel S05 liệt kê mọi pin "cần đặt lại vị trí" và cho cả Quản trị lẫn Giám sát đặt lại tọa độ tương đối (%) của từng pin trong vùng ảnh sơ đồ, để pin rời danh sách khi xong và ghi nhật ký kiểm toán.

**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).

**Thứ tự phụ thuộc:** Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6.
- Task 1 (liệt kê + bộ đếm) là nền tảng, mọi task sau phụ thuộc.
- Task 2 (mở chế độ đặt lại) phụ thuộc Task 1.
- Task 3 (lưu tọa độ + validation vùng) phụ thuộc Task 2.
- Task 4 (pin rời danh sách + chuyển trạng thái) phụ thuộc Task 3.
- Task 5 (nhật ký kiểm toán) phụ thuộc Task 3.
- Task 6 (phân quyền 2 vai trò) phụ thuộc Task 2.

## Task 1: Liệt kê pin cần đặt lại + bộ đếm + trạng thái Empty/Loading/Error
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S05-01, TC-S05-02, TC-S05-03 (Empty), TC-S05-04 (Error), TC-S05-06 (đồng bộ)
**Files:**
- Create: `src/features/ban-do-tai-san/pin-can-dat-lai/PinCanDatLaiPanel.tsx`
- Create: `src/features/ban-do-tai-san/pin-can-dat-lai/usePinCanDatLai.ts` (load danh sách pin có cờ `can_dat_lai`)
- Test: `src/features/ban-do-tai-san/pin-can-dat-lai/PinCanDatLaiPanel.test.tsx`

- [ ] Step 1: Viết test thất bại (lấy từ TC-S05-01, TC-S05-02, TC-S05-03 trong test.md)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu: gọi API danh sách pin "cần đặt lại", render mỗi pin một item (mã+tên, đường dẫn khu vực, tên sơ đồ), bộ đếm "Tổng: N", state Empty/Loading/Error
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test TC-S05-01..04, 06 pass · panel render đúng 3 item + "Tổng: 3" · Empty hiện "Không có pin nào cần đặt lại vị trí" khi N=0 (R-S05-07) · Loading skeleton, Error có "Thử lại" · tải < 2s (R-S05-N01) · trace đúng các TC · không lỗi lint.

## Task 2: Chọn pin → mở sơ đồ ở S01 vào chế độ đặt lại (xử lý khóa)
**Phụ thuộc:** Task 1
**Trace test:** TC-S05-07, TC-S05-08 (pin khóa), TC-S05-09 (khóa tự mở), TC-S05-10 (ảnh bị xóa)
**Files:**
- Create: `src/features/ban-do-tai-san/pin-can-dat-lai/useDatLaiMode.ts`
- Modify: `src/features/ban-do-tai-san/workspace/WorkspaceS01.tsx` (nhận lệnh mở sơ đồ + chế độ đặt lại + banner)
- Test: `src/features/ban-do-tai-san/pin-can-dat-lai/useDatLaiMode.test.ts`

- [ ] Step 1: Viết test thất bại (TC-S05-07, TC-S05-08, TC-S05-09, TC-S05-10)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: bấm [Đặt lại vị trí] → đóng panel, mở đúng sơ đồ chứa pin ở S01, làm nổi pin (pulse), banner hướng dẫn; nút vô hiệu khi pin bị khóa kèm thông báo; khóa tự mở sau 5 phút; ảnh sơ đồ bị xóa → thoát chế độ + pin rời danh sách
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test TC-S05-07..10 pass · pin khóa thì nút disable + báo "Tài sản đang được người khác chỉnh sửa…" (R-S05-N04) · vào chế độ đặt lại đúng sơ đồ (R-S05-03) · trace đúng TC · không lỗi lint.

## Task 3: Đặt lại tọa độ (click/kéo) + validation trong vùng ảnh, chặn ngoài vùng
**Phụ thuộc:** Task 2
**Trace test:** TC-S05-11 (hợp lệ), TC-S05-12/13 (biên 0/100), TC-S05-14/15/16 (ngoài vùng), TC-S05-17 (giữ trạng thái sau chặn), TC-S05-19 (rớt mạng)
**Files:**
- Create: `src/features/ban-do-tai-san/pin-can-dat-lai/datLaiToaDo.ts` (validate 0–100 & trong khung ảnh, lưu %)
- Modify: `WorkspaceS01.tsx` (xử lý click/kéo pin, nút Hủy/Lưu)
- Test: `src/features/ban-do-tai-san/pin-can-dat-lai/datLaiToaDo.test.ts`

- [ ] Step 1: Viết test thất bại (TC-S05-11..17, 19)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: click/kéo điểm → tọa độ tương đối (x%, y%); validate biên 0–100 + trong khung (BRule-S05-02); ngoài vùng → "Vị trí nằm ngoài sơ đồ", không lưu, pin giữ trạng thái; rớt mạng khi Lưu → snackbar lỗi, không lưu nửa vời
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test TC-S05-11..17, 19 pass · tọa độ hợp lệ `(0,0)`/`(100,100)` lưu được, `(105,40)`/`(-3,50)`/`(100.5,50)` bị chặn (R-S05-04, R-S05-06) · lưu dạng % (R-S05-N02) · sau chặn pin vẫn "cần đặt lại" · trace đúng TC · không lỗi lint.

## Task 4: Pin rời danh sách + bộ đếm giảm + chuyển trạng thái "cần đặt lại" → "đã đặt"
**Phụ thuộc:** Task 3
**Trace test:** TC-S05-20 (rời danh sách, ST), TC-S05-21 (về Empty khi pin cuối)
**Files:**
- Modify: `usePinCanDatLai.ts` (bỏ cờ `can_dat_lai`, gỡ item, đồng bộ bộ đếm)
- Modify: `PinCanDatLaiPanel.tsx` (animation fade+collapse khi item rời; chuyển sang Empty khi N=0)
- Test: `src/features/ban-do-tai-san/pin-can-dat-lai/roiDanhSach.test.ts`

- [ ] Step 1: Viết test thất bại (TC-S05-20, TC-S05-21)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: lưu thành công → bỏ cờ "cần đặt lại", pin về "đã có vị trí", gỡ item (fade+collapse), bộ đếm −1; pin cuối xử lý xong → panel chuyển Empty
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test TC-S05-20, 21 pass · pin đặt lại xong rời danh sách + bộ đếm đồng bộ (R-S05-05, BRule-S05-04) · N về 0 → Empty (R-S05-07) · toast "Đã đặt lại vị trí pin." · trace đúng TC · không lỗi lint.

## Task 5: Ghi nhật ký kiểm toán khi đặt lại (không tạo lịch sử di chuyển)
**Phụ thuộc:** Task 3
**Trace test:** TC-S05-18
**Files:**
- Create: `src/features/ban-do-tai-san/pin-can-dat-lai/auditDatLai.ts`
- Test: `src/features/ban-do-tai-san/pin-can-dat-lai/auditDatLai.test.ts`

- [ ] Step 1: Viết test thất bại (TC-S05-18)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: mỗi lần đặt lại thành công ghi nhật ký kiểm toán (người · hành động · tài sản · vị trí cũ→mới · thời điểm); KHÔNG tạo bản ghi lịch sử di chuyển (BRule-S05-03)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test TC-S05-18 pass · bản ghi nhật ký đầy đủ trường (R-S05-N03) · không sinh lịch sử di chuyển · trace đúng TC · không lỗi lint.

## Task 6: Phân quyền — cả Quản trị và Giám sát đặt lại được
**Phụ thuộc:** Task 2
**Trace test:** TC-S05-22
**Files:**
- Modify: `useDatLaiMode.ts` / guard quyền (cho phép thao tác đặt/gán vị trí với cả 2 vai trò)
- Test: `src/features/ban-do-tai-san/pin-can-dat-lai/phanQuyen.test.ts`

- [ ] Step 1: Viết test thất bại (TC-S05-22)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: Quản trị và Giám sát đều mở panel + đặt lại được; không yêu cầu quyền quản lý cấu trúc (BRule-S05-05)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test TC-S05-22 pass · cả 2 vai trò đặt lại thành công (R-S05-08) · không lộ quyền quản cấu trúc · trace đúng TC · không lỗi lint.
