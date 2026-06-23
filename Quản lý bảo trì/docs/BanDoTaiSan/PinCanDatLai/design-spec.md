# Design Spec — Danh sách pin cần đặt lại (Mã màn: S05)

## 1. Tổng quan UX
- Mục tiêu UX: gom mọi pin bị lệch ra ngoài sơ đồ (sau khi thay ảnh) về một chỗ và giúp người dùng xử lý dứt điểm từng pin với ít bước nhất. Tạo cảm giác "kiểm soát được, không pin nào bị bỏ sót". Trạng thái lý tưởng là danh sách rỗng.
- Thiết bị mục tiêu: **Web/Desktop-first** (đi cùng Workspace S01); panel co lại vừa màn hẹp, vẫn trượt từ phải.
- User flow tóm tắt: [Bản đồ tài sản — Workspace S01] → **[Panel Pin cần đặt lại S05]** → [Quay lại S01 ở chế độ đặt lại tọa độ] → [S01 sau khi pin đã đặt lại]

## 2. Cấu trúc layout (anatomy)
- Header panel: tiêu đề "Pin cần đặt lại vị trí" · nút Đóng [✕] ở góc.
- Body panel:
  - **Khối mô tả + bộ đếm:** câu giải thích ngắn (vì sao có pin lệch) + chỉ số "Tổng: N".
  - **Danh sách item dọc:** mỗi thẻ pin gồm mã + tên tài sản (dòng nhấn), đường dẫn khu vực (breadcrumb), tên sơ đồ chứa pin, và nút [Đặt lại vị trí] ở mép phải.
- Footer panel: không có footer cố định; ở trạng thái rỗng có nút [Đóng] ở giữa.
- **Chế độ đặt lại trên S01 (sau khi chọn pin):** banner hướng dẫn phía trên sơ đồ + cặp nút [Hủy] / [Lưu]; pin mục tiêu được làm nổi.

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Panel Pin cần đặt lại | Side panel | Trượt vào từ phải, đè lên Workspace; mở từ dải "N pin cần đặt lại" ở S01 | Đóng bằng [✕] hoặc click overlay | R-S05-01 |
| Khối mô tả | Text | Giải thích ngắn lý do pin cần đặt lại | — | R-S05-01 |
| Bộ đếm tổng | Badge/Counter | Hiển thị "Tổng: N"; cập nhật ngay khi danh sách đổi | Khớp số item | R-S05-02 |
| Thẻ pin (item) | List item | Mã + tên tài sản, đường dẫn khu vực, tên sơ đồ + nút Đặt lại | — | R-S05-01 |
| Nút Đặt lại vị trí | Primary CTA (trên item) | Đóng panel, mở sơ đồ chứa pin ở S01, vào chế độ đặt lại | Vô hiệu khi pin bị khóa | R-S05-03 |
| Banner đặt lại (trên S01) | Banner + actions | Hướng dẫn "click/kéo pin vào vùng sơ đồ" + nút Hủy/Lưu | Lưu chỉ bật khi tọa độ trong vùng ảnh | R-S05-04, R-S05-06 |
| Pin mục tiêu (trên sơ đồ) | Marker (draggable) | Pin làm nổi, có thể click điểm mới hoặc kéo vào vùng ảnh | Tọa độ x%, y% trong 0–100 & trong khung ảnh | R-S05-04, R-S05-06 |
| Nút Đóng [✕] | Icon button | Đóng panel, về Workspace | — | R-S05-01 |
| Khối trạng thái rỗng | Empty state | Minh họa + "Không có pin nào cần đặt lại vị trí" + nút Đóng | Hiện khi N = 0 | R-S05-07 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty (phổ biến, đáng mong đợi): khi N = 0 → minh họa tích cực + thông báo "Không có pin nào cần đặt lại vị trí" và dòng phụ "Mọi pin đều nằm đúng trong vùng sơ đồ." + nút [Đóng]. Đây là trạng thái mong muốn, không phải lỗi — dùng giọng điệu trấn an, không cảnh báo.
- 🔄 Loading: skeleton vài thẻ item mờ trong khi tải danh sách; bộ đếm hiện placeholder.
- 🔴 Error: tải danh sách thất bại → thông báo "Không tải được danh sách pin cần đặt lại" + nút "Thử lại"; khi đặt lại mà tọa độ ngoài vùng → inline "Vị trí nằm ngoài sơ đồ"; pin bị khóa → "Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau."
- 🟢 Success: đặt lại xong → toast "Đã đặt lại vị trí pin"; pin rời danh sách, bộ đếm giảm; khi pin cuối được xử lý → panel chuyển sang trạng thái rỗng.

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Đặt lại vị trí` · CTA phụ (chế độ đặt lại): `Lưu`, `Hủy` · CTA đóng: `Đóng`
- Title: `Pin cần đặt lại vị trí` · Mô tả: `Sau khi thay ảnh sơ đồ, {n} pin nằm ngoài vùng ảnh mới. Chọn từng pin để đặt lại vị trí trên sơ đồ.`
- Bộ đếm: `Tổng: {n}`
- Banner chế độ đặt lại: `Đang đặt lại vị trí {ma_tai_san} — click hoặc kéo pin vào vùng sơ đồ.`
- Wording lỗi/thành công (chính xác):
  - `Đã đặt lại vị trí pin.`
  - `Vị trí nằm ngoài sơ đồ.`
  - `Tài sản đang được người khác chỉnh sửa. Vui lòng thử lại sau.`
  - `Không có pin nào cần đặt lại vị trí.`
  - `Không tải được danh sách pin cần đặt lại.`

## 6. Edge case (xử lý UX)
- Đặt pin ra ngoài vùng ảnh → chặn Lưu, hiện thông báo gần con trỏ/banner; pin giữ trạng thái cần đặt lại.
- Pin bị người khác khóa khi đang mở danh sách → nút Đặt lại của item đó hiển thị vô hiệu kèm gợi ý lý do.
- Một pin được người khác đặt lại/gỡ trong lúc panel mở → item lặng lẽ rời danh sách, bộ đếm tự giảm; không hiện lỗi đột ngột.
- Ảnh sơ đồ của pin bị xóa giữa chừng → pin về "chưa có vị trí", rời danh sách; nếu người dùng đang ở chế độ đặt lại pin đó → thoát chế độ + thông báo nhẹ.
- Tên tài sản/đường dẫn quá dài → cắt "..." + tooltip khi hover.
- Rớt mạng khi Lưu → giữ vị trí đang đặt, snackbar "Lỗi kết nối, chưa lưu được"; không cập nhật nửa vời.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity`. Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [Workspace S01] | panel **slide-in từ phải** + overlay nền mờ dần; Workspace giữ nguyên phía sau | 250ms · ease-out |
| Ra (exit) → khi đóng panel | → [Workspace S01] | panel **slide-out về phải** + overlay mờ tắt; fade về Workspace | 220ms · ease-in |
| Ra (exit) → khi bấm Đặt lại | → [Workspace S01, chế độ đặt lại] | panel slide-out về phải, đồng thời sơ đồ pin mở & **pin mục tiêu được làm nổi** (pulse) | 250ms · ease-out |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Item danh sách | tải xong | stagger fade + slide-up từng thẻ | — | 150ms · ease-out |
| Item danh sách | sau khi đặt lại xong | — | fade-out + collapse chiều cao, các item dưới trượt lên lấp chỗ | 180ms · ease-in |
| Bộ đếm tổng | số thay đổi | đếm/đổi số kèm scale-pulse nhẹ | — | 150ms · ease-out |
| Pin mục tiêu (trên S01) | khi chọn để đặt lại | nhấp nháy/scale pulse 2 nhịp để định vị | tắt pulse khi vào chế độ kéo | 600ms · ease-in-out |
| Banner chế độ đặt lại | vào/thoát chế độ | slide-down + fade từ trên | slide-up + fade | 180ms · ease-out/in |
| Toast "Đã đặt lại vị trí pin" | hiện/ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |
| Khối trạng thái rỗng | khi N về 0 | fade-in + minh họa scale-up nhẹ | — | 200ms · ease-out |

## 8. Ghi chú cho Designer
- Accessibility: nút [Đặt lại vị trí] và pin mục tiêu có khu vực chạm đủ lớn cho thao tác kéo trên touchpad/cảm ứng; pin làm nổi phân biệt bằng cả hình dạng/viền chứ không chỉ màu.
- Trạng thái rỗng dùng giọng điệu tích cực (đã xử lý xong), tránh icon cảnh báo đỏ.
- Thứ tự focus trong panel: tiêu đề → từng item (nút Đặt lại) → nút Đóng; đóng panel được bằng phím Esc.
- Trong chế độ đặt lại, hỗ trợ đặt tọa độ bằng bàn phím (mũi tên nhích pin) ngoài click/kéo; thông báo "Vị trí nằm ngoài sơ đồ" đọc được bởi trình đọc màn hình.
