# Kế hoạch build — Quản lý ảnh sơ đồ mặt bằng (Mã màn: S03)

**Goal:** Dựng modal cho phép Quản trị tải lên, thay (giữ tọa độ pin) và xóa ảnh sơ đồ mặt bằng của một nút khu vực, có validate file và cảnh báo ảnh hưởng lên pin.
**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).
**Thứ tự phụ thuộc:** Task 1 → Task 2 → (Task 3, Task 4, Task 5). Task 1 là nền (khung modal + state nút). Task 2 (validate) chặn Task 3, 4. Task 5 (xóa) chỉ phụ thuộc Task 1. Task 6 (kiểm toán + quyền) cắt ngang, làm sau khi có Task 3–5.

## Task 1: Khung modal S03 + trạng thái nút (vertical slice nền)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S03-01, TC-S03-03, TC-S03-19, TC-S03-21
**Files:**
- Create: `src/features/floorplan/FloorPlanModal.*` (modal mở/đóng, slide-up, fade về S01)
- Create: `src/features/floorplan/floorplanState.*` (chưa-có-sơ-đồ / đã-có-sơ-đồ → render dropzone hoặc preview)
- Test: `tests/floorplan/modal.spec.*`

- [x] Step 1: Viết test thất bại (TC-S03-01 mở nút chưa có ảnh thấy dropzone + ẩn Thay/Xóa; TC-S03-03 nút đã có ảnh chỉ thấy preview + Thay/Xóa)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code tối thiểu: render modal theo state nút, breadcrumb khu vực, preview + metadata (TC-S03-19), đóng modal không lưu dang dở (TC-S03-21)
- [x] Step 4: Chạy test, xác nhận PASS
- [x] Step 5: Commit

**Definition of Done:** TC-S03-01/03/19/21 pass · modal mở/đóng đúng, fade về S01 không lưu dang dở · ẩn/hiện đúng dropzone vs preview theo state · không lỗi lint.

## Task 2: Validate định dạng & dung lượng file
**Phụ thuộc:** Task 1
**Trace test:** TC-S03-04, TC-S03-05, TC-S03-06, TC-S03-07, TC-S03-08
**Files:**
- Create: `src/features/floorplan/validateImage.*` (kiểm MIME PNG/JPG + size ≤ 10 MB)
- Test: `tests/floorplan/validate.spec.*`

- [x] Step 1: Viết test thất bại (TC-S03-04 .gif chặn; TC-S03-05 .pdf chặn; TC-S03-06 PNG 10 MB hợp lệ; TC-S03-07 PNG 11 MB chặn; TC-S03-08 JPG hợp lệ)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: hàm validate trả lỗi inline "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB."; biên đúng tại 10 MB (10485760 byte)
- [x] Step 4: Chạy test, xác nhận PASS
- [x] Step 5: Commit

**Definition of Done:** TC-S03-04..08 pass · biên dung lượng chính xác (10 MB pass, 11 MB fail) · file sai → lỗi inline, không tải lên · không lỗi lint.

## Task 3: Tải lên ảnh cho khu vực chưa có sơ đồ
**Phụ thuộc:** Task 1, Task 2
**Trace test:** TC-S03-02, TC-S03-23
**Files:**
- Create: `src/features/floorplan/uploadImage.*` (kéo-thả/chọn file → upload → gắn ảnh cho nút)
- Test: `tests/floorplan/upload.spec.*`

- [x] Step 1: Viết test thất bại (TC-S03-02 kéo-thả tang3.png 8 MB → gắn ảnh + toast "Đã tải lên sơ đồ." + fade về S01)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: drop zone + file input, gọi validate (Task 2), upload, gắn ảnh, BRule-S03-01 chặn ảnh thứ hai, ghi nhật ký kiểm toán (TC-S03-23)
- [x] Step 4: Chạy test, xác nhận PASS
- [x] Step 5: Commit

**Definition of Done:** TC-S03-02 pass · ảnh hợp lệ gắn được, mở lại S01 thấy ảnh + cho đặt pin · 1 ảnh/nút · có bản ghi audit log · không lỗi lint.

## Task 4: Thay ảnh giữ tọa độ pin + pin tràn ngoài → S05
**Phụ thuộc:** Task 1, Task 2
**Trace test:** TC-S03-09, TC-S03-10, TC-S03-11, TC-S03-12, TC-S03-13, TC-S03-14, TC-S03-15, TC-S03-24
**Files:**
- Create: `src/features/floorplan/replaceImage.*` (thay ảnh, giữ tọa độ % pin, tính pin tràn ngoài)
- Create: `src/features/floorplan/ConfirmReplaceDialog.*`
- Test: `tests/floorplan/replace.spec.*`

- [x] Step 1: Viết test thất bại (TC-S03-09 dialog khi còn pin; TC-S03-10 bỏ dialog khi 0 pin; TC-S03-11 giữ tọa độ % pin A-001 (30%,40%); TC-S03-12 file sai chặn; TC-S03-13 ảnh nhỏ → 3 pin tràn (A-012/013/014) + banner; TC-S03-14 "Đặt lại ngay" → S05; TC-S03-15 cùng tỉ lệ → không pin tràn)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: dialog cảnh báo (chỉ khi còn pin), thay ảnh giữ tọa độ tương đối %, đánh dấu pin ngoài vùng "cần đặt lại", banner + lối sang S05, ghi audit log (TC-S03-24)
- [x] Step 4: Chạy test, xác nhận PASS
- [x] Step 5: Commit

**Definition of Done:** TC-S03-09..15, TC-S03-24 pass · pin trong vùng giữ đúng tọa độ % · pin tràn ngoài đánh dấu "cần đặt lại" + dẫn S05 · dialog chỉ hiện khi còn pin · audit log có · không lỗi lint.

## Task 5: Xóa ảnh + gỡ vị trí tài sản
**Phụ thuộc:** Task 1
**Trace test:** TC-S03-16, TC-S03-17, TC-S03-18, TC-S03-25
**Files:**
- Create: `src/features/floorplan/deleteImage.*` (xóa ảnh, gỡ vị trí pin về "chưa có vị trí", giữ hồ sơ)
- Create: `src/features/floorplan/ConfirmDeleteDialog.*`
- Test: `tests/floorplan/delete.spec.*`

- [x] Step 1: Viết test thất bại (TC-S03-16 dialog "gỡ vị trí 12 tài sản"; TC-S03-17 xác nhận → ảnh gỡ, 12 pin biến mất, tài sản "chưa có vị trí", hồ sơ giữ; TC-S03-18 0 pin → xóa trực tiếp)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: dialog cảnh báo (chỉ khi còn pin), xóa ảnh, gỡ vị trí N tài sản về "chưa có vị trí" giữ hồ sơ, toast "Đã xóa sơ đồ.", ghi audit log (TC-S03-25)
- [x] Step 4: Chạy test, xác nhận PASS
- [x] Step 5: Commit

**Definition of Done:** TC-S03-16/17/18/25 pass · còn pin → dialog ghi đúng số tài sản; xác nhận → gỡ vị trí giữ hồ sơ; 0 pin → xóa trực tiếp · audit log có · không lỗi lint.

## Task 6: Phân quyền · lỗi mạng · hiệu năng (cắt ngang)
**Phụ thuộc:** Task 3, Task 4, Task 5
**Trace test:** TC-S03-22, TC-S03-26, TC-S03-27, TC-S03-28
**Files:**
- Edit: lối vào S03 ở S01 (ẩn với vai trò Giám sát)
- Edit: lớp upload/replace/delete (xử lý rớt mạng giữ hiện trạng)
- Test: `tests/floorplan/guard-network-state.spec.*`

- [x] Step 1: Viết test thất bại (TC-S03-22 Giám sát không thấy lối vào; TC-S03-27 rớt mạng → snackbar "Lỗi kết nối, chưa lưu được." giữ hiện trạng; TC-S03-26 mở + preview < 2s; TC-S03-28 chuỗi chuyển trạng thái nút hợp lệ)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: ẩn lối vào theo vai trò (BRule-S03-06), rollback khi rớt mạng (không để ảnh nửa vời), đảm bảo mở + preview < 2s
- [x] Step 4: Chạy test, xác nhận PASS
- [x] Step 5: Commit

**Definition of Done:** TC-S03-22/26/27/28 pass · Giám sát không vào được S03 · rớt mạng giữ hiện trạng + snackbar đúng · mở < 2s · chuyển trạng thái nút đúng luật · không lỗi lint.
