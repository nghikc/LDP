# Kế hoạch build — Xuất báo cáo / kiểm kê (Mã màn: S08)

**Goal:** Dựng modal cho phép Quản trị và Giám sát chọn phạm vi (toàn bộ / theo khu vực gồm khu con / theo bộ lọc) và cột rồi sinh file Excel `.xlsx` danh sách tài sản kèm vị trí, hiển thị tiến trình cho tập lớn và tải về máy.
**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).
**Thứ tự phụ thuộc:** Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6. Task 2 dùng phạm vi của Task 1; Task 3 (dựng dữ liệu cột) cần phạm vi từ Task 1+2; Task 4 (sinh .xlsx) cần dữ liệu của Task 3; Task 5 (tiến trình/hủy) bọc quanh Task 4; Task 6 (rỗng/lỗi) chốt các nhánh ngoại lệ.

## Task 1: Chọn phạm vi xuất + ước tính số dòng (vertical slice nền tảng)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S08-01, TC-S08-02, TC-S08-03, TC-S08-16, TC-S08-17
**Files:**
- Create: `src/features/export/ScopeSelector` (UI radio phạm vi + breadcrumb + ước tính)
- Create: `src/features/export/scopeEstimate` (đếm tài sản theo phạm vi)
- Test: `src/features/export/__tests__/scopeEstimate.test`

- [ ] Step 1: Viết test thất bại (TC-S08-01, TC-S08-16: render 3 radio, mặc định đúng, ước tính theo phạm vi "Toàn bộ" = đúng số)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu: nhóm radio 3 phạm vi (toan_bo/theo_khu_vuc/theo_bo_loc), mặc định "Theo khu vực đang chọn" nếu S01 có nút, ngược lại "Toàn bộ"; dải ước tính cập nhật khi đổi phạm vi
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test pass · trace đúng TC-S08-01/02/03/16/17 · bắt buộc chọn đúng 1 phạm vi · ước tính cập nhật khi đổi phạm vi (R-S08-01, R-S08-04) · không lỗi lint.

## Task 2: Phạm vi "Theo khu vực" gồm khu con (đệ quy nhánh cây)
**Phụ thuộc:** Task 1
**Trace test:** TC-S08-06, TC-S08-07, TC-S08-09, TC-S08-04
**Files:**
- Create: `src/features/export/resolveAreaScope` (gom tài sản của nút + đệ quy nhánh con mọi cấp)
- Test: `src/features/export/__tests__/resolveAreaScope.test`

- [ ] Step 1: Viết test thất bại (TC-S08-06: `Tòa A` gồm con = 1.248; TC-S08-07: `Tầng 3` tắt khu con = 1; TC-S08-09: tài sản cấp cháu vẫn được tính)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: checkbox "Gồm cả các khu vực con" (mặc định bật); bật → duyệt đệ quy toàn nhánh; tắt → chỉ tài sản đặt trực tiếp tại nút; khóa lựa chọn + báo "Hãy chọn một khu vực trước khi xuất theo khu vực" khi chưa có nút (TC-S08-04)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test pass · trace đúng TC-S08-06/07/09/04 · gồm khu con đệ quy đủ mọi cấp (BRule-S08-02) · chặn khi chưa chọn nút (R-S08-02).

## Task 3: Dựng dữ liệu cột báo cáo (chọn cột + dẫn xuất giá trị)
**Phụ thuộc:** Task 1, Task 2
**Trace test:** TC-S08-10 đến TC-S08-15, TC-S08-25, TC-S08-26, TC-S08-27
**Files:**
- Create: `src/features/export/ColumnSelector` (5 checkbox cột, ≥1)
- Create: `src/features/export/buildRows` (dẫn xuất đường dẫn khu vực, vị trí, lần di dời gần nhất theo cột đã chọn)
- Test: `src/features/export/__tests__/buildRows.test`

- [ ] Step 1: Viết test thất bại (TC-S08-11: bỏ 2 cột → file 3 cột đúng thứ tự; TC-S08-14: 0 cột chặn xuất; TC-S08-26: lấy bản ghi di chuyển mới nhất; TC-S08-25/27: cột trống cho tài sản chưa di dời / chưa gán vị trí)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: 5 checkbox cột mặc định tick hết, ≥1 cột; giữ thứ tự chuẩn cố định (mã → tên → đường dẫn → vị trí → lần di dời); "lần di dời gần nhất" = `MAX(thoi_diem)` lịch sử, trống nếu chưa di dời; tài sản chưa gán vị trí vẫn liệt kê với ô trống
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test pass · trace đúng TC-S08-10..15/25/26/27 · thứ tự cột cố định (BRule-S08-01) · lần di dời lấy bản ghi mới nhất (BRule-S08-03) · tài sản trống vị trí vẫn xuất (BRule-S08-04).

## Task 4: Sinh file `.xlsx` + tải về (Unicode tiếng Việt)
**Phụ thuộc:** Task 3
**Trace test:** TC-S08-23, TC-S08-24, TC-S08-28, TC-S08-29
**Files:**
- Create: `src/features/export/xlsxWriter` (ghi Office Open XML, UTF-8)
- Create: `src/features/export/downloadFile` (đẩy file tải về)
- Test: `src/features/export/__tests__/xlsxWriter.test`

- [ ] Step 1: Viết test thất bại (TC-S08-23: 1.250 dòng, 5 cột, file `.xlsx` hợp lệ; TC-S08-28: dấu tiếng Việt đúng UTF-8)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: dựng workbook `.xlsx` (mỗi dòng = 1 tài sản, header đúng cột đã chọn), mã hóa UTF-8 giữ dấu tiếng Việt; trigger tải về; toast "Đã xuất {n} tài sản" + tên file; fade modal về S01
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test pass · trace đúng TC-S08-23/24/28/29 · file mở được trên Excel/LibreOffice, dấu tiếng Việt đúng (R-S08-N02) · toast + fade về S01 (R-S08-05, R-S08-08).

## Task 5: Xuất tập lớn — tiến trình theo khối + hủy
**Phụ thuộc:** Task 4
**Trace test:** TC-S08-30, TC-S08-31, TC-S08-32, TC-S08-33
**Files:**
- Create: `src/features/export/ProgressPane` (thanh % + số dòng + nút Hủy)
- Create: `src/features/export/chunkedExport` (xử lý theo khối, không treo UI)
- Test: `src/features/export/__tests__/chunkedExport.test`

- [ ] Step 1: Viết test thất bại (TC-S08-32: > 5.000 dòng bật tiến trình; TC-S08-30: 50.000 dòng không treo; TC-S08-33: Hủy giữa chừng không tải file dở)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: tập > 5.000 dòng → xử lý theo khối + thanh tiến trình "Đang xử lý {x}/{tổng} dòng" + nút Hủy; Hủy dừng và không sinh file dở; ngưỡng ≤ 5.000 hoàn tất nhanh không cần tiến trình
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test pass · trace đúng TC-S08-30/31/32/33 · giao diện không treo tới 50.000 dòng (R-S08-N01, R-S08-N03) · Hủy không để lại file dở (R-S08-06).

## Task 6: Trạng thái rỗng & lỗi (chặn xuất + thử lại)
**Phụ thuộc:** Task 5
**Trace test:** TC-S08-18, TC-S08-19, TC-S08-20, TC-S08-21, TC-S08-22, TC-S08-34, TC-S08-05
**Files:**
- Create: `src/features/export/EmptyState`, `src/features/export/ErrorState`
- Test: `src/features/export/__tests__/exportStates.test`

- [ ] Step 1: Viết test thất bại (TC-S08-18/19: phạm vi 0 → "Không có dữ liệu để xuất" + nút vô hiệu; TC-S08-34: lỗi/rớt mạng → Error + Thử lại; TC-S08-05: thiếu phạm vi → báo lỗi)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: ước tính = 0 → Empty + chặn nút "Xuất Excel"; CTA "Đổi phạm vi" đưa focus về nhóm Phạm vi; lỗi dựng/tải → Error "Không tạo được file báo cáo. Vui lòng thử lại." + nút Thử lại, không tải file dở; thiếu phạm vi → "Vui lòng chọn phạm vi xuất."
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** test pass · trace đúng TC-S08-18..22/34/05 · phạm vi rỗng chặn xuất (R-S08-07) · lỗi có nút Thử lại không để file dở (UC-S08-05 ngoại lệ) · biên 0/1 dòng đúng (R-S08-04).
