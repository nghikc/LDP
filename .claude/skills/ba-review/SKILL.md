---
name: ba-review
description: Use when cần dò lỗ hổng độ phủ và truy vết trong tài liệu BA — yêu cầu chưa map chức năng, chức năng chưa có màn, màn chưa có test, màn đủ tài liệu nhưng thiếu plan; chạy ở mỗi breakpoint của pipeline hoặc khi rà soát tổng.
---

# ba-review — Dò gap độ phủ & truy vết

## Mục tiêu
Kiểm tra tính đầy đủ và nhất quán của tài liệu BA, xuất báo cáo gap ra `docs/00-gaps.md`, đánh `⚠️` vào `docs/00-tracking.md` chỗ thiếu, và báo tóm tắt ra chat.

> Đây là **gate QA độ phủ/truy vết tài liệu** — KHÔNG phải phân tích nghiệp vụ AS-IS/TO-BE. "Gap" ở đây = thiếu artifact hoặc trace gãy, không phải chênh lệch quy trình.

## Phạm vi (tham số tùy chọn)
Gọi `ba-review <scope>` với scope ∈ {`requirements`, `functions`, `screens`, `<tên màn>`, `build`, `all`}. Không có scope → tự nhận diện theo tài liệu đang có và chạy `all`.

## Luật kiểm tra
Đọc `conventions.md` của `ba-toolkit` trước. Chạy đúng các luật ứng với scope:

| Scope | Luật |
|---|---|
| requirements | `01-requirements.md` tồn tại (thiếu → báo ngay); mọi mục có nội dung (không trống/"TBD"); phạm vi & tiêu chí thành công cụ thể. **Chất lượng (🟢):** mỗi `NFR` có **số đo cụ thể** (không "nhanh/thân thiện"); quy tắc nghiệp vụ nằm ở catalog `BRule-..` riêng, không trộn vào `FR`. |
| functions | Mọi `FR` trong `01-requirements.md` map ≥1 `F` trong `02-functions.md`; mọi `F` trace ≥1 `FR`/`BR`; mọi `BR` có ≥1 `StR`/`FR` trace xuống (không `BR` mồ côi). **Chất lượng (🟢):** có **Ma trận CRUD** (thực thể × chức năng); thực thể chính thiếu C/R/U/D phải ghi lý do; `F` không gộp nhiều hành động. |
| screens | Mọi `F` xuất hiện trong map của `03-overview.md` (≥1 màn); mọi màn có ≥1 `F`; **mọi mã `F` nhắc trong overview đều tồn tại trong `02-functions.md`** (kiểm tra hai chiều); mỗi màn trong overview có folder tương ứng VÀ 1 dòng trong `00-tracking.md`; không có folder/dòng thừa. **Chất lượng (🟢):** có **ma trận CRUD-to-Screen**; thực thể quản lý chính đủ bộ List/Detail/Create/Edit (hoặc ghi lý do); không màn mồ côi ngoài sơ đồ điều hướng. |
| `<tên màn>` | Trong folder màn: `srs.md` **không rỗng**; mọi `R-S..` chức năng trích 1 `F` **tồn tại** (R-S phi chức năng `..-N..` trích `NFR`/`BR`); `usecase.md`, `userstory.md` và `design-spec.md` **đều có mặt**, userstory có tiêu chí **Given-When-Then**, design-spec có UI States + CTA **+ mục Animation chuyển cảnh** (chuyển màn vào/ra + ≥1 section in/out) — thiếu mục này = gap **🟡**; mọi `R-S..`, mọi GWT và mọi luồng use case (kể cả ngoại lệ) có ≥1 `TC..` trong `test.md`. **Chất lượng (🟢):** mỗi input field trong srs có **rule validation cụ thể** (kiểu/bắt buộc/định dạng/min-max/thông báo lỗi), không "nhập hợp lệ" mơ hồ; mỗi luồng srs có 1 sơ đồ Mermaid đúng loại; `html-design.html` có đủ UI-state mà design-spec nêu. |
| build | Mọi màn có srs/usecase/test = ✅ trong tracking đều có `plan.md`. **Chất lượng (🟢):** mỗi task trong plan trace ≥1 `TC..` và có Definition of Done. **Sau dev (🟡):** màn `dev = ✅` mà roll-up `test.md` còn Fail hoặc TC `Auto` còn `Chưa chạy` → gap (dev chưa đạt chuẩn `dev-run`). |
| data-model *(nếu có `05-data-model.md`)* | Mọi thực thể trace ≥1 `F` (không mồ côi); mỗi thực thể có PK; quan hệ n-n đã tách bảng nối. **Chất lượng (🟢):** ghi mức chuẩn hoá (≥3NF) hoặc lý do phi chuẩn; có Ma trận CRUD (thực thể × chức năng). |
| api-spec *(nếu có `06-api-spec.md`)* | Mọi endpoint trace ≥1 `F`; mỗi thực thể CRUD trong data-model có endpoint (hoặc ghi lý do). **Chất lượng (🟢):** path theo tài nguyên (không động từ); có Ma trận CRUD-to-Endpoint + error envelope chuẩn. |
| stakeholder *(nếu có `04-stakeholders.md`)* | Mỗi stakeholder trace `StR-..`. **Chất lượng (🟢):** mỗi hàng RACI có **đúng 1 A** và ≥1 R; mỗi stakeholder có ô Power/Interest + mức tham gia (hiện tại/mong muốn). |
| all | Chạy tất cả luật trên cho toàn bộ tài liệu hiện có. |

**Chất lượng (🟢) — Văn phong & Thuật ngữ, áp mọi scope tài liệu:** dự án có `docs/00-glossary.md`; mỗi doc cấp hệ thống (`01`→`07`) và `srs.md`/`test.md` mỗi màn có footer `## Thuật ngữ`; từ viết tắt được mở rộng ở lần đầu dùng. Thiếu footer hoặc thiếu `00-glossary.md` → gap **🟢 Nhỏ** (sửa bằng skill sinh ra doc đó).

**Giả định chưa xác nhận (🟡) — áp mọi scope:** mọi giả định trong tài liệu (mục Giả định của `00-brainstorm.md`, mục 7 `01-requirements.md`, hoặc giả định map của `ba-reverse`) còn trạng thái **`⚠️ chưa xác nhận`** → gap **🟡 Quan trọng**, liệt kê thêm ở mục "Cần xác nhận"; sửa bằng cách chạy lại vòng "Xác nhận giả định" của skill nguồn (xem `conventions.md`).

## Phân mức & gắn hành động cho mỗi gap
Mỗi gap gán 1 **mức ưu tiên** và **skill sửa** (để báo cáo hành động được, không chỉ liệt kê lỗi):

| Mức | Khi nào | Ví dụ |
|---|---|---|
| 🔴 Chặn | Thiếu artifact bắt buộc / trace gãy khiến bước sau không chạy được | `requirements`/`srs` thiếu hoặc rỗng; `R-S..`/`F` trích mã không tồn tại; thiếu folder hoặc dòng tracking |
| 🟡 Quan trọng | Có khung nhưng hổng độ phủ kiểm thử/truy vết | Thiếu `usecase`/`userstory`/`design-spec`; design-spec thiếu mục **Animation chuyển cảnh** (chuyển màn vào/ra + section in/out); `R-S..`/GWT/luồng ngoại lệ chưa có `TC..`; màn ✅ chưa có `plan.md`; `BR` mồ côi; **giả định còn `⚠️ chưa xác nhận`** |
| 🟢 Nhỏ | Nội dung có nhưng chưa đủ chuẩn kỹ thuật | userstory thiếu Given-When-Then; design-spec thiếu UI States/CTA; thiếu ma trận CRUD; `NFR` không có số đo; field thiếu rule validation; RACI không có đúng 1 A; data-model chưa ghi mức chuẩn hoá; **thiếu footer `## Thuật ngữ` hoặc chưa có `00-glossary.md`** |

| Loại gap | Sửa bằng |
|---|---|
| requirements | `ba-requirements` |
| functions | `ba-functions` |
| screens / overview / tracking | `ba-screens` · `ba-track` |
| srs / usecase / userstory / design-spec | `ba-screen-spec` |
| test | `ba-test` |
| plan | `ba-build` |
| data-model | `ba-data-model` |
| api-spec | `ba-api-spec` |
| stakeholder | `ba-stakeholder` |
| dev (test đỏ / TC Auto chưa chạy) | `dev-run` |

## Đầu ra
1. Ghi `docs/00-gaps.md`: tiêu đề + ngày + **độ phủ** (số mục đạt / tổng kiểm) + bảng gap:

   `| ID | Mức | Scope | Mô tả | Vị trí | Sửa bằng |`

   ID dạng `G01, G02…` (ổn định để tham chiếu giữa các lần chạy). Sắp 🔴 trước. Không gap → ghi "Không phát hiện gap.".
   Cuối file thêm mục **"Cần xác nhận"** cho điểm không kiểm chứng được bằng luật (mơ hồ, thiếu dữ liệu) — tách khỏi gap thật.
2. Đánh `⚠️` vào ô tương ứng trong `00-tracking.md` cho tài liệu có gap.
3. Báo tóm tắt ra chat: độ phủ + tổng gap theo mức + 3–5 gap 🔴/🟡 quan trọng nhất, kèm skill sửa.

## Lưu ý
- Bỏ qua màn chưa bắt đầu (mọi ô ⬜) — không tính là gap.
- Chỉ DÒ và BÁO, **không tự sửa** tài liệu (việc sửa do skill tương ứng / người dùng).
- **Không bịa gap**: mỗi gap phải bắt nguồn từ một luật ở trên. **Mỗi gap 1 dòng riêng**, không gộp nhiều lỗi.
- Là "gate" được các orchestrator gọi ở mỗi breakpoint.
- Tiếng Việt.
