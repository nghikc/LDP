# Design Spec — Di dời tài sản (đơn & hàng loạt) (Mã màn: S04)

## 1. Tổng quan UX
- Mục tiêu UX: di dời nhanh, cảm giác an toàn và "đảo ngược được". Form dẫn dắt theo hai bước rõ ràng (chọn tài sản → chọn đích), giảm rủi ro chọn nhầm đích cho cả lô; mọi thao tác lô hoặc thành công trọn vẹn hoặc không đổi gì.
- Thiết bị mục tiêu: **Web/Desktop-first** (đồng bộ với S01); trên màn hẹp modal chiếm gần toàn màn, hai bước xếp dọc.
- User flow tóm tắt: **[Bản đồ tài sản — S01]** → (popup pin → Di dời / nút Di dời hàng loạt) → **[Di dời tài sản — S04]** → [Bản đồ tài sản — S01]

## 2. Cấu trúc layout (anatomy)
- Header: tiêu đề "Di dời tài sản" · nút đóng (✕).
- Body (modal trượt lên, cuộn dọc):
  - **Bước 1 — Tài sản cần di dời:** bộ chọn cách lấy nguồn (Chọn tài sản lẻ / Chọn cả vị trí cũ); ô tìm + danh sách tài sản tick chọn; bộ đếm "N tài sản đã chọn"; khi vào từ popup pin thì bước này khóa sẵn 1 tài sản và ẩn bộ chọn cách lấy.
  - **Bước 2 — Vị trí đích (bắt buộc):** cây khu vực rút gọn / ô tìm để chọn đúng một nút đích.
  - **Lý do di dời (tùy chọn):** ô nhập nhiều dòng kèm bộ đếm ký tự.
  - **Dòng thông tin tự ghi:** người thực hiện + thời điểm (chỉ hiển thị, không nhập).
- Footer (thanh hành động dính dưới): nút "Hủy" (secondary) và "Di dời (N)" (primary).
- Lớp nổi nội màn: thanh tiến trình "Đang di dời N tài sản..."; dialog "Một số tài sản bị khóa — bỏ qua phần còn lại?".

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Bộ chọn cách lấy nguồn | Radio | "Chọn tài sản lẻ" / "Chọn cả vị trí cũ"; ẩn khi di dời đơn | Bắt buộc 1 lựa chọn (hàng loạt) | R-S04-02, R-S04-03 |
| Ô tìm + danh sách tài sản | Search + checkbox list | Chỉ liệt kê tài sản **đã có vị trí**; tài sản bị khóa hiện icon khóa, không tick được | Chọn ≥ 1 tài sản | R-S04-02, R-S04-08 |
| Chọn cả vị trí cũ | Tree/Selector | Chọn nút nguồn → nạp hết tài sản trong nút vào lô | Nút phải có ≥ 1 tài sản | R-S04-03 |
| Bộ đếm tài sản đã chọn | Badge | Hiển thị số tài sản trong lô; đồng bộ nhãn nút Di dời | — | R-S04-02 |
| Chọn khu vực đích | Tree/Selector | Chọn đúng 1 nút đích cho cả lô | Bắt buộc; đúng 1 nút hợp lệ | R-S04-04 |
| Lý do di dời | Textarea | Văn bản tự do, có bộ đếm ký tự | ≤ 500 ký tự | R-S04-05 |
| Dòng người thực hiện + thời điểm | Text (read-only) | Hệ thống tự ghi khi lưu | Không nhập | R-S04-06 |
| Nút "Di dời (N)" | Primary CTA | Ghi giao dịch lô, khóa, sinh lịch sử + nhật ký | Tắt khi chưa chọn tài sản hoặc chưa chọn đích | R-S04-01, R-S04-04 |
| Nút "Hủy" | Secondary CTA | Đóng form, không thay đổi | — | R-S04-01 |
| Thanh tiến trình lô | Progress | Hiện khi đang ghi; chặn đóng tới khi xong/rollback | — | R-S04-09, R-S04-N03 |
| Dialog "tài sản bị khóa" | Modal | Liệt kê tài sản bị khóa, hỏi bỏ qua phần còn lại | — | R-S04-08 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty: chọn "cả vị trí cũ" nhưng nút nguồn không có tài sản → "Vị trí này không có tài sản để di dời."; chưa chọn tài sản nào → nút Di dời tắt, gợi ý "Chọn ít nhất một tài sản để di dời.".
- 🔄 Loading: đang nạp danh sách tài sản / nạp tài sản theo vị trí cũ → skeleton danh sách; đang ghi lô → thanh tiến trình "Đang di dời N tài sản..." (modal không đóng được).
- 🔴 Error: chưa chọn đích → "Vui lòng chọn khu vực đích."; tài sản bị khóa → "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."; mất mạng giữa chừng → snackbar rollback.
- 🟢 Success: di dời xong → toast "Đã di dời {n} tài sản." rồi fade về S01 với pin ở vị trí mới.

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Di dời` (nhãn động: `Di dời ({n})`) · CTA Secondary: `Hủy`
- Title: `Di dời tài sản` · Helper text ô tìm: `Tìm mã/tên tài sản đã có vị trí...` · Helper đích: `Chọn khu vực đích...`
- Nhãn bước: `Tài sản cần di dời`, `Vị trí đích (bắt buộc)`, `Lý do di dời (tùy chọn)`
- Wording lỗi/thành công (chính xác):
  - `Đã di dời {n} tài sản.`
  - `Vui lòng chọn khu vực đích.`
  - `Chọn ít nhất một tài sản để di dời.`
  - `Lý do tối đa 500 ký tự.`
  - `Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.`
  - `Vị trí này không có tài sản để di dời.`
  - `Mất kết nối, đã hoàn tác toàn bộ. Vui lòng thử lại.`
  - `{k} tài sản đang bị khóa. Bỏ qua và tiếp tục với {n} tài sản còn lại?`

## 6. Edge case (xử lý UX)
- **Mất mạng giữa chừng** khi ghi lô → hệ thống rollback toàn bộ (all-or-nothing); giữ lựa chọn người dùng đã nhập trong form, snackbar "Mất kết nối, đã hoàn tác toàn bộ. Vui lòng thử lại."; không tạo bản ghi lịch sử nửa vời.
- **Một số tài sản bị khóa** → loại khỏi lô và hiển thị icon khóa; nếu lô có tài sản khóa, dialog hỏi bỏ qua phần còn lại trước khi ghi.
- **Đóng/refresh trình duyệt khi đang ghi lô** → coi như gián đoạn → rollback toàn bộ; khóa tự nhả (hoặc tối đa 5 phút).
- **Lô rất lớn (tới 500 tài sản)** → thanh tiến trình + chặn đóng modal; không khóa giao diện cứng.
- **Tên tài sản/đường dẫn quá dài** → cắt "..." + tooltip khi hover.
- **Đích trùng vị trí hiện tại** của tất cả tài sản → nút Di dời báo không có gì để đổi (hoặc giữ tắt cho phần trùng).

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity`. Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [Bản đồ tài sản — S01] | nền S01 mờ & lùi nhẹ scale 0.99, modal trượt lên (slide-up) + fade-in | 250ms · ease-out |
| Ra (exit) — Hủy/đóng | → [Bản đồ tài sản — S01] | modal trượt xuống (slide-down) + fade-out, nền S01 sáng & về scale 1 | 200ms · ease-in |
| Ra (exit) — thành công | → [Bản đồ tài sản — S01] | toast hiện trước, modal fade-out, sơ đồ S01 nhấn pin mới (scale pulse) | 250ms · ease-in |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Bước 1 → Bước 2 | hoàn tất chọn tài sản | Bước 2 slide-down + fade mở ra dưới Bước 1 | Bước 2 thu lại slide-up + fade khi quay lại | 180ms · ease-out/in |
| Danh sách tài sản | nạp xong / đổi cách chọn nguồn | stagger fade + slide-up từng dòng | fade-out cả danh sách | 150ms · ease-out |
| Mục tài sản được tick | tick / bỏ tick | nền/đánh dấu fade-in, badge đếm tăng nhẹ scale | fade-out | 120ms · ease-out/in |
| Thanh tiến trình lô | bắt đầu ghi / xong | fade + slide-up từ đáy modal | fade-out | 160ms · ease-out/in |
| Dialog "tài sản bị khóa" | mở / đóng | fade nền + scale-up dialog | fade + scale-down | 200ms · ease-out/in |
| Toast "Đã di dời {n}" | hiện / ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |
| Snackbar rollback | hiện / ẩn | slide-in + fade từ dưới | fade-out | 150ms · ease-out |

## 8. Ghi chú cho Designer
- Accessibility: thứ tự focus: bộ chọn cách lấy nguồn → ô tìm/danh sách tài sản → chọn đích → lý do → Hủy → Di dời; thông báo lỗi đọc được bằng trình đọc màn hình (aria-live) khi thiếu đích hoặc gặp khóa.
- Trạng thái khóa phân biệt bằng cả icon + nhãn text, không chỉ màu, hỗ trợ người mù màu.
- Nút "Di dời (N)" giữ rõ trạng thái tắt/bật; khi đang ghi lô đổi sang trạng thái đang xử lý (spinner) và khóa thao tác đóng.
- Bộ đếm tài sản và bộ đếm ký tự lý do cập nhật tức thì, đủ tương phản.
