# Báo cáo gap độ phủ & truy vết — Quản lý vị trí tài sản cố định

> Ngày chạy: 2026-06-23 · Scope: `all` (cấp tổng + 8 màn S01–S08 đã đặc tả) · Ghi đè mỗi lần chạy.
> Gate QA độ phủ/truy vết tài liệu — không phải phân tích AS-IS/TO-BE.

## Độ phủ

| Nhóm luật | Đạt / Tổng | Ghi chú |
|-----------|-----------|---------|
| requirements | 4 / 5 | Mọi mục có nội dung; BRule tách catalog. 1 NFR thiếu số đo (G01 — đã quyết định bỏ qua). |
| functions | 5 / 5 | Mọi FR→F; mọi F trace FR/BR; không BR mồ côi; có ma trận CRUD; F nguyên tử. |
| screens | 6 / 6 | Mọi F có ≥1 màn; mã F trong overview đều tồn tại; 8 folder + 8 dòng tracking khớp; CRUD-to-Screen đủ; không màn mồ côi. |
| Đặc tả màn (8 màn × srs/usecase/userstory/design-spec) | 8 / 8 | **srs** không rỗng, mọi R-S trace F hợp lệ (F01–F20, không mã lạc); **usecase + userstory + design-spec** đều có mặt; userstory đủ **Given-When-Then**; design-spec đủ **UI States + CTA + mục Animation chuyển cảnh**; mỗi srs có **Mermaid (3–5 luồng) + ERD**; validation field cụ thể; footer Thuật ngữ. |
| Văn phong & Thuật ngữ | 3 / 3 | Có `00-glossary.md` (đã bổ sung 22 thuật ngữ màn); footer `## Thuật ngữ` đủ ở doc tổng + mọi srs màn. |
| Giả định | 1 / 1 | 13/13 giả định đã xác nhận — không còn `⚠️ chưa xác nhận`. |
| **Tổng (artifact đã tới bước)** | **27 / 28** | Chỉ 1 gap 🟢 (G01). |

## Bảng gap

| ID | Mức | Scope | Mô tả | Vị trí | Sửa bằng |
|----|-----|-------|-------|--------|----------|
| G02 | 🟡 Quan trọng | S01–S08 | **Chưa có `test.md`** cho cả 8 màn → mọi R-S/GWT/luồng use case chưa có TC truy vết. Đây là **bước kế tiếp đúng tiến độ** (chưa chạy `ba-test`), không phải lỗi đặc tả. | `docs/**/` (8 màn) | `ba-test` |
| G01 | 🟢 Nhỏ | requirements | NFR-06 ("pin lưu tọa độ tương đối %") gắn nhãn *Khả dụng* nhưng không có số đo — bản chất là ràng buộc thiết kế. Người dùng đã **quyết định bỏ qua**. | `01-requirements.md` §4.2 | `ba-requirements` |

## Cần xác nhận
- *(Không có)* — không còn điểm mơ hồ; mọi giả định đã chốt.

> **Lưu ý phạm vi:** `html-design.html` và `plan.md` của các màn chưa làm — thuộc bước sau (`ba-html-design`, `ba-build`); không tính gap ở breakpoint này (luật `build`/html chỉ áp khi artifact tồn tại hoặc màn đã đủ srs/usecase/test).

## Kết luận gate
- **0 gap 🔴.** Gap 🟡 duy nhất (G02) chính là **bước kế tiếp** người dùng sắp chạy (`ba-test`) — không phải lỗi cản trở.
- Chất lượng đặc tả 8 màn **đồng đều, đạt chuẩn**: trace R-S→F liền mạch, GWT đo được, design-spec đủ Animation chuyển cảnh, validation field cụ thể.
- Đủ điều kiện **ĐI TIẾP** sang `ba-test` → `ba-html-design` → `ba-build`.
