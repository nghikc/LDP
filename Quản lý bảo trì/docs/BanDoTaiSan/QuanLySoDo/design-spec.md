# Design Spec — Quản lý ảnh sơ đồ mặt bằng (Mã màn: S03)

## Bản Figma (preview)
- Node: `291:452` · Page: `Genysic — Company Profile 2026` · Section: `QLVT — Quản lý bảo trì (8 màn)` (`291:371`)
- Trạng thái: **Đã dựng** · Ngày: 2026-06-23
- Palette: primary `#0b5cab` · bg `#f4f6f8` · surface `#fff` · border `#cbd3dd` · text `#1b2430` · danger `#b3261e` · warn `#fff4e0` · radius 8
- Ghi chú: figma-mcp-go thao tác trên file Figma đang mở, không trả URL share. Mở Figma → chọn node theo id ở trên để copy link chia sẻ.


## 1. Tổng quan UX
- Mục tiêu UX: thao tác tải/thay/xóa ảnh **nhanh, an toàn, không mơ hồ**. Người dùng luôn biết trước hậu quả lên pin (giữ vị trí khi thay, gỡ vị trí khi xóa). Modal nhẹ, gọn trong một bước, không rời khỏi ngữ cảnh khu vực đang chọn.
- Thiết bị mục tiêu: **Web/Desktop-first** (đồng bộ với workspace S01); modal co giãn vừa màn hẹp.
- User flow tóm tắt: [Bản đồ tài sản — S01] → **[Quản lý ảnh sơ đồ — S03 (modal)]** → [S01] (hoặc → [Pin cần đặt lại — S05] khi thay ảnh khiến pin tràn ngoài).

## 2. Cấu trúc layout (anatomy)
- Header: tiêu đề "Quản lý ảnh sơ đồ" + breadcrumb đường dẫn nút khu vực đang chọn + nút đóng ✕.
- Body (đổi theo trạng thái nút):
  - **Khi chưa có sơ đồ:** vùng kéo-thả lớn ở giữa với biểu tượng tải lên, nút "Chọn ảnh từ máy", dòng hướng dẫn định dạng & giới hạn.
  - **Khi đã có sơ đồ:** khung xem trước ảnh hiện tại (co vừa khung) + metadata (tên file, dung lượng, kích thước) + dòng "N pin đang đặt".
- Footer (thanh hành động): nút "Đóng" (secondary) và — khi đã có sơ đồ — "Thay ảnh" (primary) + "Xóa ảnh" (destructive).
- Lớp nổi: dialog xác nhận Thay ảnh; dialog xác nhận Xóa ảnh; thông báo kết quả thay ảnh (kèm lối sang S05).

## 3. Component & dữ liệu
| Component | Loại | Mô tả / Logic | Ràng buộc (validation) | Trace |
|-----------|------|---------------|------------------------|-------|
| Vùng kéo-thả tải ảnh | Drop zone + file input | Nhận file qua kéo-thả hoặc chọn từ máy; chỉ hiện khi nút chưa có sơ đồ | PNG/JPG · ≤ 10 MB · 1 ảnh/nút | R-S03-01, R-S03-02, R-S03-03 |
| Khung xem trước ảnh | Image preview | Hiện ảnh hiện tại + tên file, dung lượng, kích thước, số pin đang đặt | Chỉ hiện khi nút đã có sơ đồ | R-S03-07 |
| Nút "Thay ảnh" | Primary CTA | Mở bộ chọn file mới; nếu nút còn pin → dialog cảnh báo giữ tọa độ | Disable khi đang tải | R-S03-04 |
| Nút "Xóa ảnh" | Destructive CTA | Gỡ ảnh; nếu nút còn pin → dialog cảnh báo gỡ vị trí | Disable khi đang tải | R-S03-06 |
| Nút "Đóng / ✕" | Secondary CTA | Đóng modal, fade về S01, không lưu dang dở | — | R-S03-08 |
| Dialog xác nhận Thay ảnh | Modal | Nêu "giữ tọa độ tương đối, pin tràn ngoài cần đặt lại" | Hiện khi nút còn pin | R-S03-04, R-S03-05 |
| Dialog xác nhận Xóa ảnh | Modal | Nêu số tài sản bị gỡ vị trí, hồ sơ giữ nguyên | Hiện khi nút còn pin | R-S03-06 |
| Thông báo pin tràn ngoài | Banner/toast | Đếm pin "cần đặt lại" + nút "Đặt lại ngay" → S05 | Ẩn khi không có pin tràn | R-S03-05 |
| Thanh tiến trình tải | Progress | Hiển thị tiến trình khi đang tải ảnh lên | — | R-S03-01 |

## 4. Trạng thái giao diện (UI States)
- ⚪ Empty (nút chưa có sơ đồ): vùng kéo-thả nổi bật giữa modal + minh họa tải lên + hướng dẫn "PNG hoặc JPG, tối đa 10 MB, 1 ảnh mỗi khu vực"; ẩn nút Thay/Xóa.
- 🔄 Loading: đang tải ảnh lên → thanh tiến trình/spinner trong vùng kéo-thả; các nút hành động disable; modal không đóng được giữa chừng trừ khi hủy.
- 🔴 Error: file sai định dạng/quá lớn → thông báo lỗi inline ngay dưới vùng kéo-thả, không tải lên; rớt mạng khi tải/thay/xóa → snackbar "Lỗi kết nối, chưa lưu được", giữ hiện trạng.
- 🟢 Success: tải lên → toast "Đã tải lên sơ đồ"; thay ảnh → toast "Đã thay ảnh sơ đồ" (kèm "N pin cần đặt lại" nếu có); xóa ảnh → toast "Đã xóa sơ đồ"; sau đó fade về S01.

## 5. CTA & Copywriting (microcopy)
- CTA Primary: `Thay ảnh` · CTA Destructive: `Xóa ảnh` · CTA Secondary: `Đóng`, `Hủy`, `Chọn ảnh từ máy`
- CTA trong dialog: `Tiếp tục thay`, `Hủy` · `Xóa ảnh`, `Hủy`
- Title: `Quản lý ảnh sơ đồ` · Helper text vùng tải: `Kéo & thả ảnh vào đây, hoặc chọn ảnh từ máy. PNG hoặc JPG, tối đa 10 MB, 1 ảnh mỗi khu vực.`
- Wording lỗi/thành công (chính xác):
  - `Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB.`
  - `Đã tải lên sơ đồ.`
  - `Sơ đồ này đang có {n} pin. Hệ thống giữ nguyên vị trí tương đối của pin trên ảnh mới. Pin nằm ngoài vùng ảnh mới sẽ được đánh dấu "cần đặt lại". Tiếp tục thay?`
  - `Đã thay ảnh sơ đồ.`
  - `{k} pin nằm ngoài vùng ảnh mới được đánh dấu "cần đặt lại vị trí".`
  - `Xóa ảnh sẽ gỡ vị trí của {n} tài sản (về "chưa có vị trí"). Hồ sơ tài sản được giữ nguyên. Tiếp tục?`
  - `Đã xóa sơ đồ.`
  - `Lỗi kết nối, chưa lưu được.`

## 6. Edge case (xử lý UX)
- Tải file sai định dạng (không phải PNG/JPG) hoặc > 10 MB → báo "Chỉ chấp nhận ảnh PNG hoặc JPG, tối đa 10 MB." ngay tại vùng kéo-thả, không tải lên; viền vùng tải chuyển trạng thái lỗi.
- Thay ảnh khiến pin tràn ngoài vùng ảnh mới → giữ tọa độ tương đối, đánh dấu pin "cần đặt lại vị trí", hiện banner "N pin cần đặt lại" + nút "Đặt lại ngay" dẫn sang **S05**.
- Thay/Xóa khi nút **không còn pin** → bỏ qua dialog cảnh báo, thực hiện trực tiếp.
- Rớt mạng khi tải/thay/xóa → giữ hiện trạng ảnh, snackbar "Lỗi kết nối, chưa lưu được"; không để ảnh/pin nửa vời.
- Tên file quá dài → cắt "..." + tooltip khi hover.
- Vai trò Giám sát → không có lối vào màn này (ẩn ở menu nút tại S01), không chỉ disable.
- Đóng modal khi đang tải dang dở → hủy thao tác, giữ nguyên ảnh cũ.

## 7. Animation & chuyển cảnh (BẮT BUỘC)
> Duration/easing mặc định: enter `ease-out`, exit `ease-in`; chuyển màn 250–300ms, section 150–200ms. Hiện thực bằng `transform`/`opacity`. Tôn trọng `prefers-reduced-motion` (giảm còn fade nhẹ hoặc tắt).

**Chuyển màn (page transition) — vào/ra khi điều hướng:**
| Hướng | Màn lân cận | Hiệu ứng | Thời lượng · easing |
|-------|-------------|----------|---------------------|
| Vào (enter) | ← [S01 Bản đồ tài sản] | nền workspace mờ & lùi scale 0.99, modal **trượt lên (slide-up)** từ đáy + fade | 260ms · ease-out |
| Ra (exit) | → [S01 Bản đồ tài sản] | modal trượt xuống + fade-out, nền workspace sáng & về scale 1 (**fade về S01**) | 220ms · ease-in |
| Ra (exit) | → [S05 Pin cần đặt lại] | modal đóng (trượt xuống), panel S05 slide-in từ phải | 250ms · ease-out |

**Chuyển section nội màn (in/out):**
| Thành phần | Sự kiện | Hiệu ứng IN | Hiệu ứng OUT | Thời lượng · easing |
|-----------|---------|-------------|--------------|---------------------|
| Vùng kéo-thả tải ảnh | hiện khi nút chưa có sơ đồ / sau khi xóa ảnh | fade + slide-up nhẹ | fade-out | 180ms · ease-out/in |
| Vùng kéo-thả (kéo file vào) | dragover / dragleave | viền & nền sáng lên (highlight), scale 1.01 | trở lại bình thường | 120ms · ease-out/in |
| Xem trước ảnh | tải/thay xong | fade + scale-up từ 0.98 | fade + scale-down (khi xóa/đổi) | 200ms · ease-out/in |
| Thanh tiến trình tải | bắt đầu/kết thúc tải | fade-in + width chạy | fade-out khi xong | 150ms · ease-out |
| Dialog xác nhận Thay ảnh | mở / đóng | fade nền + scale-up dialog | fade + scale-down | 200ms · ease-out/in |
| Dialog xác nhận Xóa ảnh | mở / đóng | fade nền + scale-up dialog | fade + scale-down | 200ms · ease-out/in |
| Thông báo pin tràn ngoài | hiện sau khi thay / đóng | slide-in + fade từ trên | fade-out | 180ms · ease-out/in |
| Toast thành công | hiện / ẩn | slide-in + fade từ trên | fade-out | 150ms · ease-out |
| Thông báo lỗi inline | xuất hiện / biến mất | fade + slide-down nhẹ | fade-out | 150ms · ease-out/in |

## 8. Ghi chú cho Designer
- Accessibility: vùng kéo-thả thao tác được bằng bàn phím (focus → Enter mở hộp chọn file); thông báo lỗi gắn với vùng tải bằng quan hệ mô tả để trình đọc màn hình đọc được; thứ tự focus: ✕ → vùng tải/xem trước → Thay → Xóa → Đóng.
- Nút "Xóa ảnh" mang tính phá hủy: phân biệt rõ bằng cả nhãn lẫn hình dạng/icon (không chỉ màu) để hỗ trợ người mù màu; luôn qua dialog khi còn pin.
- Vùng kéo-thả cần khu vực chạm (touch target) đủ lớn và phản hồi trạng thái dragover rõ ràng để dùng tốt trên laptop touch.
- Modal khóa tương tác nền (focus trap) khi mở; Esc đóng modal tương đương nút Đóng (hủy thao tác dang dở).
