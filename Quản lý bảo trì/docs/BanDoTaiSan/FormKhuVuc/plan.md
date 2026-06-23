# Kế hoạch build — Form khu vực (Tạo/Sửa nút) (Mã màn: S02)

**Goal:** Dựng modal nhập liệu dùng chung cho Tạo và Sửa nút khu vực — nhập Tên/Mã/Loại/Nút cha, kiểm tra hợp lệ (Tên bắt buộc, Mã duy nhất, chặn cây lặp), chỉ Quản trị thao tác, lưu xong cập nhật cây S01.
**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).
**Thứ tự phụ thuộc:** Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6. Task 1 là nền (khung form + đóng/mở) chặn tất cả; Task 2 (Tạo) và Task 3 (Sửa) đều cần Task 1; Task 4 (validation Tên/Mã) cần Task 2; Task 5 (chặn cây lặp) cần Task 3; Task 6 (phân quyền) chặn lối vào, nên build sau cùng nhưng độc lập Task 4/5.

## Task 1: Khung form modal + đóng/mở (vertical slice nền tảng)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S02-01, TC-S02-31, TC-S02-32
**Files:**
- Create: `src/features/ban-do-tai-san/form-khu-vuc/FormKhuVuc.{component}`
- Create: `src/features/ban-do-tai-san/form-khu-vuc/useFormKhuVuc.{state}`
- Test: `src/features/ban-do-tai-san/form-khu-vuc/__tests__/form-khung.test.{ext}`

- [ ] Step 1: Viết test thất bại (lấy từ TC-S02-01 mở chế độ Tạo, TC-S02-31 Hủy đóng ngay khi chưa sửa, TC-S02-32 hỏi "Bỏ thay đổi chưa lưu?" khi đã nhập)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu: modal slide-up từ S01, tiêu đề động, 4 trường (Tên/Mã/Loại/Nút cha), nút Hủy/Lưu/×; Nút cha đặt sẵn theo ngữ cảnh mở ("Thêm con" → nút đó; gốc → "(Gốc)"); đóng qua Hủy/×/nền tối, hỏi xác nhận nếu đã sửa dữ liệu
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 3 test pass · modal mở/đóng đúng (chưa sửa → đóng ngay; đã sửa → dialog "Bỏ thay đổi chưa lưu?") · tiêu đề "Thêm khu vực"/"Sửa khu vực" đổi theo chế độ · Nút cha đặt sẵn đúng ngữ cảnh · không lỗi lint.

## Task 2: Tạo nút khu vực (lưu hợp lệ chế độ Tạo)
**Phụ thuộc:** Task 1
**Trace test:** TC-S02-02, TC-S02-03, TC-S02-04, TC-S02-05, TC-S02-06
**Files:**
- Create: `src/features/ban-do-tai-san/form-khu-vuc/taoNutKhuVuc.{service}`
- Test: `src/features/ban-do-tai-san/form-khu-vuc/__tests__/tao-nut.test.{ext}`

- [ ] Step 1: Viết test thất bại (TC-S02-03 tạo "Phòng 307" dưới "Tầng 3"; TC-S02-04 để trống Nút cha → tạo ở gốc; TC-S02-02 Nút cha mặc định "(Gốc)"; TC-S02-05/06 lưu với Mã trống / có Loại)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tạo nút: gọi service tạo dưới đúng Nút cha hoặc gốc, ghi nhật ký kiểm toán, đóng modal (fade), cây S01 cập nhật + bật nhánh chứa nút mới, toast "Đã thêm khu vực."
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 5 test pass · nút mới xuất hiện đúng vị trí trong cây (cha / gốc) · toast "Đã thêm khu vực." hiển thị · có bản ghi nhật ký kiểm toán · không lỗi lint.

## Task 3: Sửa nút khu vực (nạp dữ liệu + lưu cập nhật)
**Phụ thuộc:** Task 1
**Trace test:** TC-S02-09, TC-S02-10, TC-S02-11, TC-S02-12, TC-S02-13
**Files:**
- Create: `src/features/ban-do-tai-san/form-khu-vuc/suaNutKhuVuc.{service}`
- Test: `src/features/ban-do-tai-san/form-khu-vuc/__tests__/sua-nut.test.{ext}`

- [ ] Step 1: Viết test thất bại (TC-S02-09 nạp đúng dữ liệu < 1s; TC-S02-10 đổi Tên cập nhật cây; TC-S02-11 đổi Nút cha chuyển nhánh; TC-S02-12 giữ Mã cũ không coi trùng; TC-S02-13 nút đã bị xóa → "Khu vực không còn tồn tại")
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code chế độ Sửa: nạp Tên/Mã/Loại/Nút cha hiện tại < 1s, lưu cập nhật (đổi cha → chuyển nhánh), ghi nhật ký kiểm toán, toast "Đã cập nhật khu vực."; xử lý nút bị xóa đồng thời
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 5 test pass · form nạp đúng giá trị hiện tại trong < 1s · đổi cha → nút chuyển nhánh đúng · Mã của chính nút không bị coi trùng · thông báo đúng khi nút đã bị xóa · không lỗi lint.

## Task 4: Validation Tên & Mã (chặn lưu + lỗi inline)
**Phụ thuộc:** Task 2 (và áp chung cho Task 3)
**Trace test:** TC-S02-14, TC-S02-15, TC-S02-16, TC-S02-17, TC-S02-18, TC-S02-19, TC-S02-20, TC-S02-21, TC-S02-22, TC-S02-23, TC-S02-24, TC-S02-25
**Files:**
- Create: `src/features/ban-do-tai-san/form-khu-vuc/validateKhuVuc.{util}`
- Test: `src/features/ban-do-tai-san/form-khu-vuc/__tests__/validate.test.{ext}`

- [ ] Step 1: Viết test thất bại (Tên: TC-S02-14 rỗng, TC-S02-15 chỉ khoảng trắng, TC-S02-16 biên 1, TC-S02-17 biên 150, TC-S02-18 biên 151, TC-S02-19 nút Lưu vô hiệu khi trống, TC-S02-20 trim; Mã: TC-S02-21 trùng "P305", TC-S02-22 trống cho lưu, TC-S02-23 duy nhất, TC-S02-24 biên 50, TC-S02-25 biên 51)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code validation: trim Tên rồi kiểm tra 1–150 ký tự với wording "Vui lòng nhập tên khu vực." / "Tên khu vực tối đa 150 ký tự."; Mã ≤ 50 + duy nhất toàn cây (bỏ qua chính nút khi Sửa) với "Mã khu vực đã tồn tại." / "Mã khu vực tối đa 50 ký tự."; nút Lưu vô hiệu khi Tên trống; lỗi inline dưới đúng field
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 12 test pass · lỗi inline đúng wording dưới đúng field · biên 150/151 và 50/51 xử lý đúng · nút Lưu vô hiệu khi Tên trống · Mã trống cho lưu, Mã của chính nút không coi trùng · không lỗi lint.

## Task 5: Chặn cây lặp khi chọn Nút cha
**Phụ thuộc:** Task 3
**Trace test:** TC-S02-26, TC-S02-27, TC-S02-28, TC-S02-29, TC-S02-30, TC-S02-08
**Files:**
- Create: `src/features/ban-do-tai-san/form-khu-vuc/locNutChaHopLe.{util}`
- Test: `src/features/ban-do-tai-san/form-khu-vuc/__tests__/cay-lap.test.{ext}`

- [ ] Step 1: Viết test thất bại (TC-S02-26 loại trừ chính nút "Tầng 3" + con "Phòng 305/306" khỏi danh sách; TC-S02-27 gán chính nó → chặn lưu; TC-S02-28 gán nhánh con → chặn lưu; TC-S02-29 chọn "Tòa B" ngoài nhánh → cho lưu; TC-S02-30 lọc tìm kiếm; TC-S02-08 cây rỗng chỉ còn "(Gốc)")
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: xây danh sách Nút cha hợp lệ loại trừ (ẩn hẳn) chính nút và toàn bộ con-cháu; validation server-side khi lưu báo "Không thể đặt khu vực vào chính nó hoặc nhánh con của nó."; ô tìm kiếm lọc theo tên khớp một phần
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 6 test pass · chính nút và nhánh con bị ẩn khỏi dropdown Nút cha · cố gán cây lặp bị chặn với wording đúng · chọn nút ngoài nhánh / để gốc lưu được · lọc tìm kiếm hoạt động · không lỗi lint.

## Task 6: Phân quyền Quản trị (chặn lối vào & lưu)
**Phụ thuộc:** Task 1 (độc lập Task 4/5)
**Trace test:** TC-S02-07, TC-S02-34
**Files:**
- Create: `src/features/ban-do-tai-san/form-khu-vuc/guardQuanTri.{middleware}`
- Test: `src/features/ban-do-tai-san/form-khu-vuc/__tests__/phan-quyen.test.{ext}`

- [ ] Step 1: Viết test thất bại (TC-S02-07 vai trò Giám sát truy cập trực tiếp → từ chối, không hiển thị form; TC-S02-34 rớt mạng khi Lưu → snackbar "Lỗi kết nối, chưa lưu được." giữ dữ liệu)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code: guard chỉ Quản trị mở/lưu form (Giám sát bị từ chối ở cả lối vào và API); xử lý lỗi mạng khi lưu → snackbar, giữ nguyên dữ liệu đã nhập, không tạo/sửa nửa vời
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 2 test pass · vai trò Giám sát không mở/lưu được form (cả UI và API) · rớt mạng → snackbar đúng wording + dữ liệu giữ nguyên · thao tác tạo/sửa được ghi nhật ký kiểm toán · không lỗi lint.
