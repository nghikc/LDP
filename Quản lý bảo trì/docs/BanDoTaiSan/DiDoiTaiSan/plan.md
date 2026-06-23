# Kế hoạch build — Di dời tài sản (đơn & hàng loạt) (Mã màn: S04)

**Goal:** Dựng form modal hai bước cho phép di dời một hoặc nhiều tài sản đã có vị trí về cùng một đích, đảm bảo all-or-nothing khi gián đoạn, khóa chống xung đột đồng thời, và sinh đầy đủ lịch sử di chuyển + nhật ký kiểm toán.

**Tài liệu nguồn:** srs.md, usecase.md, test.md, html-design.html (cùng folder).

**Thứ tự phụ thuộc:** Task 1 → Task 2 → Task 3 (Task 2,3 dùng nền lô của Task 2) → Task 4 → Task 5 → Task 6 → Task 7. Task 1 là vertical slice nền tảng (giao dịch di dời 1 tài sản + lịch sử/nhật ký). Task 2 mở rộng sang lô. Task 3,4,5 là biến thể chọn nguồn / toàn vẹn / đồng thời trên nền lô. Task 6,7 phủ ràng buộc field và phi chức năng.

---

## Task 1: Di dời ĐƠN một tài sản + truy vết (vertical slice nền tảng)
**Phụ thuộc:** không (nền tảng)
**Trace test:** TC-S04-01, TC-S04-02, TC-S04-03, TC-S04-17, TC-S04-18, TC-S04-26
**Files:**
- Create: form modal S04 (mở từ popup pin S01, chọn sẵn 1 tài sản, ẩn bộ chọn nguồn); service di dời đơn (gỡ pin cũ → tạo pin đích trong 1 giao dịch); ghi lịch sử di chuyển + nhật ký kiểm toán; auto-ghi người + thời điểm.
- Test: bộ test di dời đơn (happy path, chặn thiếu đích, hủy, truy vết, cập nhật pin).

- [x] Step 1: Viết test thất bại (lấy từ TC-S04-01 trong test.md)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code tối thiểu cho pass (mở modal đơn → chọn đích → di dời → cập nhật pin + lịch sử + nhật ký)
- [x] Step 4: Bổ sung chặn thiếu đích (TC-S04-02), hủy không đổi (TC-S04-03), tự ghi người/thời điểm (TC-S04-17), lịch sử+nhật ký (TC-S04-18), gỡ pin cũ + tạo pin mới (TC-S04-26)
- [x] Step 5: Chạy test, xác nhận PASS
- [x] Step 6: Commit

**Definition of Done:** TC-S04-01/02/03/17/18/26 pass · pin cũ gỡ + pin mới tại đích, mỗi tài sản 1 vị trí (BRule-01) · lịch sử (cũ→mới, người, thời điểm, lý do) + nhật ký kiểm toán đầy đủ · nút Di dời tắt khi thiếu đích · không lỗi lint.

## Task 2: Di dời HÀNG LOẠT chọn tài sản lẻ về cùng một đích
**Phụ thuộc:** Task 1 (dùng lại service ghi lịch sử/nhật ký, mở rộng sang giao dịch lô)
**Trace test:** TC-S04-04, TC-S04-05, TC-S04-06, TC-S04-10, TC-S04-11, TC-S04-30
**Files:**
- Create: chế độ "Chọn tài sản lẻ" (ô tìm chỉ liệt kê tài sản đã có vị trí — BRule-S04-06); bộ đếm "N đã chọn" đồng bộ nhãn nút; giao dịch lô đưa tất cả về cùng một đích (BRule-S04-01); kiểm soát truy cập 2 vai trò.
- Test: bộ test di dời lô tài sản lẻ.

- [x] Step 1: Viết test thất bại (TC-S04-04)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: tick nhiều tài sản, bộ đếm, giao dịch lô cùng đích
- [x] Step 4: Bổ sung nút tắt khi chưa chọn (TC-S04-05), ẩn tài sản chưa có vị trí (TC-S04-06), chặn thiếu đích cho lô (TC-S04-10), tất cả về cùng đích (TC-S04-11), vai Giám sát + nhật ký (TC-S04-30)
- [x] Step 5: Chạy test, xác nhận PASS
- [x] Step 6: Commit

**Definition of Done:** TC-S04-04/05/06/10/11/30 pass · mọi tài sản trong lô về CÙNG một đích · ô tìm chỉ liệt kê tài sản đã có vị trí · cả Quản trị + Giám sát di dời được, nhật ký đầy đủ · không lỗi lint.

## Task 3: Chọn nguồn theo CẢ VỊ TRÍ CŨ (lấy hết tài sản trong nút)
**Phụ thuộc:** Task 2 (dùng nền giao dịch lô)
**Trace test:** TC-S04-07, TC-S04-08, TC-S04-09, TC-S04-31
**Files:**
- Create: chế độ "Chọn cả vị trí cũ (lấy hết)"; chọn nút khu vực nguồn → nạp toàn bộ tài sản trong nút vào lô; chặn nút rỗng; chặn đích trùng vị trí hiện tại của toàn lô (BRule-S04-07).
- Test: bộ test chọn cả vị trí cũ + đích trùng.

- [x] Step 1: Viết test thất bại (TC-S04-07)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: chọn nút nguồn → nạp hết tài sản, bộ đếm khớp số thực có
- [x] Step 4: Bổ sung nút nguồn rỗng (TC-S04-08), biên 1 tài sản (TC-S04-09), đích trùng toàn lô → không có gì để đổi (TC-S04-31)
- [x] Step 5: Chạy test, xác nhận PASS
- [x] Step 6: Commit

**Definition of Done:** TC-S04-07/08/09/31 pass · số đếm khớp số tài sản thực có trong nút · nút rỗng báo đúng wording · đích trùng toàn bộ → nút Di dời tắt / báo không có thay đổi · không lỗi lint.

## Task 4: ROLLBACK all-or-nothing khi gián đoạn (toàn vẹn giao dịch)
**Phụ thuộc:** Task 2 (giao dịch lô phải tồn tại để bọc transaction)
**Trace test:** TC-S04-23, TC-S04-24, TC-S04-25, TC-S04-29
**Files:**
- Create: bọc ghi lô trong một giao dịch atomic; phát hiện gián đoạn (mất mạng/đóng phiên) → rollback toàn bộ + nhả khóa; snackbar rollback; thanh tiến trình lô; thử lại từ đầu sạch; tối ưu hiệu năng 500 tài sản < 5s.
- Test: bộ test rollback + hiệu năng.

- [x] Step 1: Viết test thất bại (TC-S04-23 — mất mạng giữa lô 200)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: transaction atomic, rollback toàn bộ khi gián đoạn, snackbar
- [x] Step 4: Bổ sung đóng trình duyệt giữa chừng (TC-S04-24), thử lại sạch (TC-S04-25), 500 tài sản < 5s có progress (TC-S04-29)
- [x] Step 5: Chạy test, xác nhận PASS
- [x] Step 6: Commit

**Definition of Done:** TC-S04-23/24/25/29 pass · gián đoạn → KHÔNG tài sản nào đổi vị trí, không bản ghi lịch sử nửa vời, khóa nhả · snackbar đúng wording · lô 500 tài sản < 5s có thanh tiến trình · không lỗi lint.

## Task 5: KHÓA đồng thời — chặn / bỏ qua tài sản bị người khác giữ
**Phụ thuộc:** Task 1 (di dời đơn), Task 2 (lô) — cần cả hai luồng để chặn/bỏ qua
**Trace test:** TC-S04-19, TC-S04-20, TC-S04-21, TC-S04-22, TC-S04-27, TC-S04-28
**Files:**
- Create: hiển thị icon khóa + nhãn cho tài sản đang bị khóa (không tick được); khi bắt đầu di dời → khóa tài sản trong lô; dialog "bỏ qua phần còn lại?"; chặn di dời đơn khi bị khóa; khóa tự mở sau 5 phút.
- Test: bộ test khóa đồng thời.

- [x] Step 1: Viết test thất bại (TC-S04-19 — tài sản bị khóa không tick được)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: trạng thái khóa, icon + nhãn, vô hiệu ô tick
- [x] Step 4: Bổ sung dialog bỏ qua → tiếp tục (TC-S04-20), từ chối → hủy lô (TC-S04-21), chặn di dời đơn bị khóa (TC-S04-22), tự mở sau 5 phút (TC-S04-27), biên 4:59 vs 5:01 (TC-S04-28)
- [x] Step 5: Chạy test, xác nhận PASS
- [x] Step 6: Commit

**Definition of Done:** TC-S04-19/20/21/22/27/28 pass · tài sản bị khóa phân biệt bằng icon + nhãn (không chỉ màu) · dialog bỏ qua hoạt động đúng cả Tiếp tục/Hủy · di dời đơn bị khóa bị chặn đúng wording · khóa tự mở đúng mốc 5 phút · không lỗi lint.

## Task 6: Ràng buộc field lý do + truy vết tự động
**Phụ thuộc:** Task 1
**Trace test:** TC-S04-12, TC-S04-13, TC-S04-14, TC-S04-15, TC-S04-16
**Files:**
- Create: textarea lý do có bộ đếm ký tự, chặn > 500; cho phép trống; ràng buộc chọn đúng 1 nút đích.
- Test: bộ test field lý do + đích đơn nhất.

- [x] Step 1: Viết test thất bại (TC-S04-15 — chặn 501 ký tự)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Viết code: maxlength 500, bộ đếm, cho phép trống vẫn lưu
- [x] Step 4: Bổ sung lý do trống lưu được (TC-S04-13), biên đúng 500 (TC-S04-14), biên 1/499 (TC-S04-16), chỉ giữ 1 đích (TC-S04-12)
- [x] Step 5: Chạy test, xác nhận PASS
- [x] Step 6: Commit

**Definition of Done:** TC-S04-12/13/14/15/16 pass · lý do tùy chọn, chặn > 500 ký tự đúng wording, bộ đếm cập nhật tức thì · chỉ giữ đúng 1 nút đích · không lỗi lint.

## Task 7: Trạng thái giao diện, animation & accessibility (a11y polish)
**Phụ thuộc:** Task 1–6 (cần UI hoàn chỉnh để áp state/animation)
**Trace test:** TC-S04-05 (empty), TC-S04-08 (empty nguồn), TC-S04-29 (loading/progress) + đối chiếu html-design.html
**Files:**
- Create: UI states Empty/Loading/Error/Success; animation modal in/out, chuyển Bước 1→2, danh sách stagger, toast/snackbar, dialog; @media prefers-reduced-motion; thứ tự focus + aria-live theo design-spec mục 7–8.
- Test: kiểm tra trạng thái rỗng/loading + a11y thủ công đối chiếu html-design.html.

- [x] Step 1: Viết/đối chiếu test trạng thái Empty (TC-S04-05, TC-S04-08)
- [x] Step 2: Chạy test, xác nhận FAIL
- [x] Step 3: Hiện thực 4 UI state + skeleton loading + thanh tiến trình (TC-S04-29)
- [x] Step 4: Bổ sung animation in/out (modal, bước, danh sách, toast, snackbar, dialog) + khối prefers-reduced-motion + thứ tự focus + aria-live cho lỗi/khóa
- [x] Step 5: Chạy test, xác nhận PASS; rà a11y (tương phản WCAG AA, label, focus thấy được)
- [x] Step 6: Commit

**Definition of Done:** Empty/Loading/Error/Success hiển thị đúng · animation in/out mượt bằng transform/opacity, có prefers-reduced-motion · tương phản ≥ WCAG AA, mọi input có label, focus thấy được, lỗi/khóa đọc qua aria-live · khớp html-design.html · không lỗi lint.

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| Vertical slice | Lát cắt chạy được xuyên tầng (UI → service → dữ liệu) cho một luồng |
| DoD (Definition of Done) | Tiêu chí hoàn thành đo được của một task |
| Trace test | TC trong test.md mà task này phải làm pass |
| All-or-nothing / Rollback | Giao dịch lô toàn vẹn; gián đoạn → khôi phục trạng thái trước |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
