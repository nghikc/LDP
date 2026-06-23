# Kế hoạch build — Bản đồ tài sản (Workspace) (Mã màn: S01)

**Goal:** Dựng màn hub Workspace cho phép duyệt cây khu vực, mở sơ đồ mặt bằng, gán/gỡ vị trí tài sản bằng pin, tra cứu nhanh, di chuyển và xóa nút — đủ phân quyền và điều hướng tới các màn vệ tinh.
**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).
**Thứ tự phụ thuộc:** Task 1 → Task 2 → (Task 3, Task 4 song song được) → Task 5 → Task 6 → Task 7 → Task 8 → Task 9 → Task 10. Task 8/9/10 chỉ chặn bởi Task 1–2 (khung cây + sơ đồ).

---

## Task 1: Khung workspace + render cây khu vực (F04)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S01-01, TC-S01-02, TC-S01-03, TC-S01-04
**Files:**
- Create: layout 3 vùng (header + tree-col + canvas-col), component Cây khu vực (đệ quy, mở/đóng nhánh)
- Test: test cây render đúng cha-con, toggle nhánh, lồng sâu, trạng thái rỗng

- [ ] Step 1: Viết test thất bại (TC-S01-01/02/03/04)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code tối thiểu: render cây phân cấp, toggle ▾/▸, empty-state CTA "Tạo khu vực đầu tiên"
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** cây hiển thị đúng quan hệ cha-con; toggle mở/đóng hoạt động; lồng được ≥6 cấp không cắt; cây trống hiện CTA; test TC-S01-01..04 pass; không lỗi lint.

## Task 2: Mở sơ đồ mặt bằng + render pin theo tọa độ % (F09)
**Phụ thuộc:** Task 1
**Trace test:** TC-S01-05, TC-S01-06, TC-S01-07, TC-S01-08, TC-S01-09
**Files:**
- Create: khung canvas sơ đồ (ảnh + zoom/pan), render pin theo tọa độ %, breadcrumb, các state Loading/Empty(chưa có sơ đồ)/Error
- Test: render < 2s, empty "Chưa có sơ đồ", lỗi tải + thử lại, 50.000 tài sản, loading skeleton

- [ ] Step 1: Viết test thất bại (TC-S01-05..09)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: click nút → tải ảnh + pin theo %, breadcrumb, skeleton/error/empty
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** click nút render ảnh + pin < 2s (đo được); nút chưa ảnh hiện "Chưa có sơ đồ" + CTA tải; lỗi tải hiện "Không tải được sơ đồ" + Thử lại; chịu 50.000 tài sản không treo; test TC-S01-05..09 pass.

## Task 3: Gom cụm pin > 500 + bộ lọc pin (F10)
**Phụ thuộc:** Task 2
**Trace test:** TC-S01-10, TC-S01-11, TC-S01-12, TC-S01-13
**Files:**
- Create: thuật toán gom cụm khi >500 pin, tách cụm khi click/zoom, bộ lọc pin theo trạng thái
- Test: ngưỡng 500/501, tách cụm, lọc "Cần đặt lại"

- [ ] Step 1: Viết test thất bại (TC-S01-10..13)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: gom cụm (BVA 500), click cụm tách/zoom, filter
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** 500 pin → rời, 501 pin → gom cụm có số đếm; click cụm tách/zoom; bộ lọc thu hẹp đúng pin; test TC-S01-10..13 pass.

## Task 4: Tra cứu nhanh tài sản + làm nổi pin (F16)
**Phụ thuộc:** Task 2
**Trace test:** TC-S01-27, TC-S01-28, TC-S01-29, TC-S01-30, TC-S01-31, TC-S01-32
**Files:**
- Create: ô tra cứu (debounce), gợi ý khớp một phần không dấu < 1s, nhảy tới + highlight pulse + breadcrumb, xử lý chưa có vị trí / không tìm thấy / giới hạn 100 ký tự / tên dài
- Test: khớp không dấu, mở sơ đồ + pulse, "Chưa gán vị trí", "Không tìm thấy", biên 1/100/101 ký tự, tên dài tooltip

- [ ] Step 1: Viết test thất bại (TC-S01-27..32)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: search service không dấu, dropdown, navigate + highlight, validation field tu_khoa_tra_cuu
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** gõ "may nen" → gợi ý "Máy nén khí" < 1s; chọn tài sản có vị trí → mở sơ đồ + pin pulse + breadcrumb; chưa vị trí → "Chưa gán vị trí"; không tồn tại → "Không tìm thấy tài sản."; >100 ký tự bị chặn; test TC-S01-27..32 pass.

## Task 5: Gán vị trí tài sản (F11)
**Phụ thuộc:** Task 2
**Trace test:** TC-S01-14, TC-S01-15, TC-S01-16, TC-S01-17, TC-S01-18, TC-S01-19, TC-S01-20, TC-S01-21, TC-S01-22
**Files:**
- Create: click điểm trống → pin tạm + ô tìm (chỉ tài sản chưa có vị trí), xác nhận → tạo pin + ghi nhật ký kiểm toán + toast; xử lý hủy, khóa đồng thời, biên tọa độ, mất mạng
- Test: liệt kê đúng (BRule-S01-01), gán thành công + toast, ẩn tài sản đã có vị trí, bắt buộc chọn, khóa, hủy, nút chưa sơ đồ, biên tọa độ, rớt mạng

- [ ] Step 1: Viết test thất bại (TC-S01-14..22)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: ô gán, validation tai_san_chon / toa_do_pin_x/y, audit log, toast, edge cases
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** ô gán chỉ liệt kê tài sản chưa có vị trí; gán → pin đúng tọa độ + toast "Đã gán vị trí cho tài sản." + nhật ký kiểm toán; chưa chọn → chặn; tài sản khóa → báo lỗi không tạo pin; hủy xóa pin tạm; tọa độ ngoài 0–100% bị chặn; test TC-S01-14..22 pass.

## Task 6: Gỡ vị trí tài sản (F14)
**Phụ thuộc:** Task 5
**Trace test:** TC-S01-23, TC-S01-24, TC-S01-25, TC-S01-26
**Files:**
- Create: popup pin (Xem lịch sử/Di dời/Gỡ), dialog xác nhận gỡ → xóa pin + về "chưa có vị trí" + nhật ký; chặn khi khóa; hủy
- Test: gỡ thành công, nhật ký kiểm toán, chặn khi khóa, hủy

- [ ] Step 1: Viết test thất bại (TC-S01-23..26)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: popup pin, dialog gỡ, audit log, kiểm tra khóa
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** gỡ + xác nhận → pin biến mất, tài sản "chưa có vị trí", nhật ký ghi ai/khi nào; tài sản khóa → "Tài sản đang được người khác chỉnh sửa..."; hủy giữ nguyên; test TC-S01-23..26 pass.

## Task 7: Di chuyển nút trong cây bằng kéo-thả (F05)
**Phụ thuộc:** Task 1
**Trace test:** TC-S01-33, TC-S01-34, TC-S01-35, TC-S01-36
**Files:**
- Create: kéo-thả nút, cập nhật cha-con, chặn vòng lặp (vào chính nó / nhánh con), ẩn kéo-thả với Giám sát
- Test: kéo hợp lệ, chặn nhánh con, chặn chính nó, Giám sát không kéo

- [ ] Step 1: Viết test thất bại (TC-S01-33..36)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: drag-drop, kiểm tra BRule-S01-02, gate vai trò
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** kéo nút hợp lệ → cập nhật cha + render lại; thả vào chính nó/nhánh con → chặn + "Không thể di chuyển khu vực vào chính nhánh con của nó."; Giám sát không có kéo-thả; test TC-S01-33..36 pass.

## Task 8: Xóa nút khu vực có cảnh báo (F03)
**Phụ thuộc:** Task 1
**Trace test:** TC-S01-37, TC-S01-38, TC-S01-39, TC-S01-40
**Files:**
- Create: dialog xóa đếm tài sản + khu con, xác nhận → xóa nhánh + gỡ vị trí (không xóa hồ sơ) + nhật ký + toast; hủy; nút rỗng
- Test: dialog wording đúng số, xóa + gỡ vị trí + nhật ký, hủy, nút rỗng

- [ ] Step 1: Viết test thất bại (TC-S01-37..40)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: đếm ảnh hưởng, dialog, xóa nhánh + audit (BRule-S01-03)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** dialog ghi đúng "gỡ vị trí của {n} tài sản và xóa {m} khu vực con"; xác nhận → xóa nhánh, tài sản về "chưa có vị trí" giữ hồ sơ, nhật ký kiểm toán, toast "Đã xóa khu vực"; hủy không đổi; test TC-S01-37..40 pass.

## Task 9: Phân quyền vai trò + dải cảnh báo + điều hướng vệ tinh (BRule-S01-04, R-S01-10)
**Phụ thuộc:** Task 1, Task 2
**Trace test:** TC-S01-41, TC-S01-42
**Files:**
- Create: ẩn (không disable) mục cấu trúc với Giám sát; dải "N pin cần đặt lại" (ẩn khi N=0) → S05; lối vào S02/S03/S04/S06/S08
- Test: Giám sát ẩn menu cấu trúc, dải cảnh báo + điều hướng

- [ ] Step 1: Viết test thất bại (TC-S01-41, TC-S01-42)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: role-gate UI, banner pin cần đặt lại, các link điều hướng
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** Giám sát không thấy Thêm/Sửa/Xóa/Quản lý ảnh (ẩn hẳn); dải cảnh báo hiện đúng số, click → S05, ẩn khi N=0; có lối vào S02/S03/S04/S06/S08; test TC-S01-41, TC-S01-42 pass.

## Task 10: Animation + responsive + a11y (xuyên màn)
**Phụ thuộc:** Task 1–9 (lớp hoàn thiện)
**Trace test:** TC-S01-09 (loading), TC-S01-28 (pulse), TC-S01-32 (tooltip tên dài) + kiểm thử thủ công a11y/responsive
**Files:**
- Create: animation in/out (transform/opacity, enter ease-out / exit ease-in) cho popup/ô gán/dialog/nhánh cây/toast/pulse/cụm; khối prefers-reduced-motion; layout responsive (desktop ≥1200 / tablet ≥768 / mobile <768 drawer); WCAG AA (label, focus, tương phản ≥4.5:1, phân biệt pin bằng hình dạng)
- Test: reduced-motion tắt animation; cây thành drawer khi <768; focus thấy được

- [ ] Step 1: Viết test thất bại (animation/responsive/a11y có thể đo)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Code: motion tokens, media queries, ARIA labels, focus-visible
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** mọi overlay/section có in/out mượt bằng transform/opacity; prefers-reduced-motion giảm/tắt; ≥1 breakpoint chuyển layout, cây → drawer khi <768; tương phản ≥4.5:1, input có label, focus thấy được, pin phân biệt bằng hình dạng; các test trace pass.

---

> Bao phủ nhóm chức năng: F04 (Task 1), F09 (Task 2), F10 (Task 3), F16 (Task 4), F11 (Task 5), F14 (Task 6), F05 (Task 7), F03 (Task 8), phân quyền + điều hướng (Task 9), animation/responsive/a11y (Task 10). Không nhóm nào bị bỏ sót.
