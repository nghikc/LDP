# Kế hoạch build — Nhật ký kiểm toán (Mã màn: S07)

**Goal:** Dựng màn tra cứu nhật ký kiểm toán chỉ-đọc cho Quản trị — hiển thị bảng bản ghi gán/di dời/xóa, lọc tổ hợp (người/hành động/thời gian/đối tượng), phân trang, và chặn truy cập với vai trò Giám sát.
**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).
**Thứ tự phụ thuộc:** Task 1 → Task 2 → Task 3 → Task 4 → Task 5. Task 1 (nền tảng: API đọc + bảng) chặn mọi task sau. Task 3 (phân quyền) bọc Task 1–2 ở tầng dữ liệu, nên làm sớm sau khi có API đọc; Task 4 (lọc tổ hợp) và Task 5 (phân trang/sắp xếp) dựa trên endpoint của Task 1.

## Task 1: Hiển thị bảng nhật ký (vertical slice nền tảng — API đọc → bảng read-only)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S07-01, TC-S07-02, TC-S07-03
**Files:**
- Create: API endpoint chỉ-đọc `GET /audit-log` (query mặc định: trang 1, 25 dòng, sắp xếp thời điểm giảm dần) + tầng truy vấn append-only (không expose tạo/sửa/xóa)
- Create: component bảng `AuditLogTable` (5 cột: thời điểm · người · hành động · đối tượng · vị trí cũ→mới; badge phân biệt loại; "—" cho hành động Xóa)
- Test: test API trả đủ trường + thứ tự mới nhất trước; test render dòng Xóa hiển thị "—"

- [ ] Step 1: Viết test thất bại (TC-S07-01 hiển thị đủ 5 trường, mới nhất trước; TC-S07-02 đủ trường truy vết; TC-S07-03 cột vị trí = "—" cho Xóa)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu cho pass (endpoint đọc + map dữ liệu + render bảng)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S07-01/02/03 pass · bảng read-only không có nút Sửa/Xóa dòng · BRule-S07-04 (Xóa → "—") đúng · không lỗi lint · sắp xếp mặc định mới nhất trước.

## Task 2: Phân trang & sắp xếp theo Thời điểm
**Phụ thuộc:** Task 1
**Trace test:** TC-S07-15, TC-S07-16, TC-S07-17, TC-S07-18, TC-S07-19
**Files:**
- Modify: endpoint `GET /audit-log` thêm tham số `page`, `pageSize=25`, `sort=thoi_diem:desc|asc`; trả `total`
- Create: component `Pagination` (tổng số bản ghi + Trước/Trang/Sau, ẩn/khóa khi 1 trang) + header cột Thời điểm sortable (đảo aria-sort + mũi tên)
- Test: test phân trang giữ điều kiện lọc khi đổi trang; test ẩn pager khi ≤25; test đảo sắp xếp

- [ ] Step 1: Viết test thất bại (TC-S07-15 "1–25 / 1.284"; TC-S07-16 sang trang giữ lọc; TC-S07-17 ≤25 ẩn pager; TC-S07-18/19 đảo sắp xếp)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu cho pass
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S07-15..19 pass · "Hiển thị {từ}–{đến} / {tổng} bản ghi." đúng · 25 dòng/trang · pager ẩn khi 1 trang · đổi trang không mất bộ lọc · không lỗi lint.

## Task 3: Phân quyền — chỉ Quản trị truy cập, Giám sát bị từ chối
**Phụ thuộc:** Task 1 (cần endpoint đọc để chặn ở cả giao diện lẫn dữ liệu)
**Trace test:** TC-S07-21, TC-S07-22, TC-S07-23, TC-S07-24
**Files:**
- Modify: middleware/guard cho route S07 — chỉ vai trò Quản trị; chặn `GET /audit-log` ở backend trả 403 (không kèm bản ghi) với vai trò Giám sát
- Create: trạng thái "Từ chối truy cập" (thông báo + lối về S01); ẩn lối vào màn khỏi điều hướng của Giám sát ở S01
- Test: test Giám sát → màn từ chối, response không chứa bản ghi nào; test ẩn entry point; test lối quay lại

- [ ] Step 1: Viết test thất bại (TC-S07-21 màn từ chối + không bản ghi; TC-S07-22 backend chặn payload; TC-S07-23 ẩn lối vào; TC-S07-24 quay lại S01)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu cho pass (guard + state từ chối)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S07-21..24 pass · chặn cả ở giao diện lẫn truy vấn dữ liệu (R-S07-N01, BRule-S07-02) · Giám sát không nhận bất kỳ bản ghi nào · lối vào ẩn khỏi điều hướng · luôn có lối về S01 · không lỗi lint.

## Task 4: Lọc tổ hợp (AND) — người / hành động / thời gian / đối tượng + Xóa lọc
**Phụ thuộc:** Task 1 (bảng), Task 2 (phân trang giữ lọc), Task 3 (guard áp trước khi lọc)
**Trace test:** TC-S07-04, TC-S07-05, TC-S07-06, TC-S07-07, TC-S07-08, TC-S07-09, TC-S07-10, TC-S07-11, TC-S07-12, TC-S07-13, TC-S07-14
**Files:**
- Modify: endpoint `GET /audit-log` nhận tham số `nguoi`, `hanh_dong`, `tu_ngay`, `den_ngay`, `tu_khoa` — áp AND, khớp một phần (đối tượng, không phân biệt dấu), ràng buộc Từ ≤ Đến
- Create: panel bộ lọc (`FilterPanel`) — dropdown người/hành động, date picker, ô đối tượng (≤100 ký tự); nút Áp dụng lọc / Xóa lọc; lỗi inline ngày & ký tự; trạng thái rỗng "Không có bản ghi phù hợp."
- Test: test từng bộ lọc, tổ hợp AND, biên ngày, max ký tự, kết quả rỗng, Xóa lọc về mặc định

- [ ] Step 1: Viết test thất bại (TC-S07-04 lọc người; TC-S07-05 lọc hành động; TC-S07-06/07/08 thời gian + Từ>Đến + biên Từ=Đến; TC-S07-09/10/11 đối tượng + max 100 + rỗng; TC-S07-12 tổ hợp AND "Di dời của Nguyễn Văn A trong 06/2026"; TC-S07-13 AND giao rỗng; TC-S07-14 Xóa lọc)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu cho pass (filter panel + query AND)
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S07-04..14 pass · lọc AND giao nhau đúng (R-S07-06) · Từ>Đến chặn áp dụng + nút disable (BRule-S07-05) · ô đối tượng ≤100 ký tự · kết quả rỗng hiển thị đúng wording · Xóa lọc đưa mọi điều kiện về mặc định và nạp lại đầy đủ · không lỗi lint.

## Task 5: Hoàn thiện — quay lại S01, trạng thái lỗi tải, bất biến append-only, hiệu năng
**Phụ thuộc:** Task 1–4
**Trace test:** TC-S07-20, TC-S07-25, TC-S07-26, TC-S07-27
**Files:**
- Create: nút "← Bản đồ tài sản" (đóng panel slide-out, giữ ngữ cảnh S01); trạng thái lỗi tải "Không tải được nhật ký. Vui lòng thử lại." + nút Thử lại
- Modify: đảm bảo tầng dữ liệu append-only — không expose API tạo/sửa/xóa bản ghi; chỉ mục/truy vấn đạt < 2s ở mức 50.000 tài sản
- Test: test quay lại S01 giữ ngữ cảnh; test bất biến (không có API ghi/sửa/xóa); test lỗi tải hiển thị retry; đo hiệu năng

- [ ] Step 1: Viết test thất bại (TC-S07-20 quay lại S01; TC-S07-25 < 2s; TC-S07-26 không nút/API sửa-xóa; TC-S07-27 lỗi tải + Thử lại)
- [ ] Step 2: Chạy test, xác nhận FAIL
- [ ] Step 3: Viết code tối thiểu cho pass
- [ ] Step 4: Chạy test, xác nhận PASS
- [ ] Step 5: Commit

**Definition of Done:** TC-S07-20/25/26/27 pass · quay lại S01 không mất ngữ cảnh (R-S07-09) · không có thao tác tạo/sửa/xóa bản ghi (R-S07-N03, BRule-S07-01) · trang đầu + lọc < 2s ở 50.000 tài sản (R-S07-N02) · lỗi tải có retry · không lỗi lint.
