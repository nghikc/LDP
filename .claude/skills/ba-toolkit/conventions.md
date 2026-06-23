# Quy ước chung — BA Toolkit

## Cấu trúc thư mục `docs/`
```
docs/
├── 00-brainstorm.md      # phỏng vấn sâu IT-BA (do ba-brainstorm sinh, đầu vào cho yêu cầu)
├── 00-tracking.md        # ma trận truy vết
├── 00-gaps.md            # báo cáo gap (do ba-review sinh, ghi đè mỗi lần chạy)
├── 00-glossary.md        # từ điển thuật ngữ toàn dự án (ba-requirements seed, các skill bổ sung)
├── 01-requirements.md    # bản yêu cầu tổng
├── 02-functions.md       # danh sách chức năng
├── 03-overview.md        # tổng quan màn hình + điều hướng
├── 04-stakeholders.md    # phân tích bên liên quan (tùy chọn, ba-stakeholder)
├── 05-data-model.md      # mô hình dữ liệu/ERD (tùy chọn, ba-data-model)
├── 06-api-spec.md        # đặc tả API (tùy chọn, ba-api-spec)
├── 07-design-system.md   # design system / token (tùy chọn, ba-design-system) — nguồn style cho ba-figma-design & ba-html-design
├── portal.html           # cổng đọc tài liệu (tùy chọn, ba-portal)
└── <Nhóm>/<MànHình>/     # 9 file mỗi màn hình
    ├── ascii-screen.md
    ├── brainstorm.md
    ├── srs.md
    ├── usecase.md
    ├── userstory.md
    ├── design-spec.md    # UI brief cho Designer (states/CTA/microcopy/a11y); có thể chứa mục "## Bản Figma (preview)" do ba-figma-design ghi
    ├── html-design.html
    ├── test.md
    └── plan.md
```

## Đặt tên & cấu trúc nhóm
- Tên Nhóm/Màn hình: PascalCase không dấu, không khoảng trắng (vd `Authentication/Login`, `UserProfile`, `Organization`).
- Tên hiển thị tiếng Việt (vd "Đăng nhập") để trong nội dung tài liệu, không dùng cho tên folder.
- **Nhóm nhiều màn** → lồng: `docs/<Nhóm>/<Màn>/` (vd `docs/Authentication/Login/`).
- **Nhóm chỉ 1 màn** → bỏ cấp nhóm, dùng thẳng `docs/<Màn>/` (vd `docs/Dashboard/`, `docs/UserProfile/`). Không tạo `docs/Dashboard/Dashboard/`.

## Ngôn ngữ
Toàn bộ nội dung tài liệu bằng tiếng Việt.

## Văn phong tài liệu (BẮT BUỘC)
Tài liệu phục vụ cả stakeholder nghiệp vụ lẫn dev — phải **chuyên nghiệp, dễ hiểu**:
- Viết rõ ràng, mạch lạc; câu ngắn, thể chủ động; tránh lan man, tránh sáo rỗng.
- **Mở rộng từ viết tắt ở lần đầu xuất hiện** trong mỗi tài liệu — vd "API (Application Programming Interface)", "ERD (Entity-Relationship Diagram)"; lần sau dùng dạng ngắn.
- Không giả định người đọc đã quen jargon kỹ thuật/nghiệp vụ — giải thích tại chỗ hoặc dẫn tới mục Thuật ngữ.

## Thuật ngữ (glossary) — mô hình hybrid (BẮT BUỘC)
1. **Từ điển trung tâm `docs/00-glossary.md`** — nguồn chuẩn toàn dự án: mọi từ viết tắt/thuật ngữ phương pháp (BR, StR, FR, NFR, F, S, MoSCoW, SMART, CRUD, ERD, REST, RACI, GWT, INVEST, WCAG…) + thuật ngữ nghiệp vụ đặc thù. **`ba-requirements` tạo (seed)** file này với bộ thuật ngữ phương pháp chuẩn; mỗi skill sinh tài liệu sau đó **bổ sung thuật ngữ mới mình dùng** (idempotent — không thêm dòng đã có). Một dòng = một thuật ngữ.
2. **Footer "## Thuật ngữ" trong mỗi tài liệu** — đặt cuối các doc cấp hệ thống (`01`→`07`) và `srs.md`, `test.md` của mỗi màn: liệt kê **thuật ngữ DÙNG trong chính doc đó** + giải thích ngắn 1 dòng, rồi trỏ về từ điển đầy đủ. Doc đứng riêng (chia sẻ lẻ) vẫn tự hiểu được.

Format footer dùng chung:
```
## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| FR (Functional Requirement) | Yêu cầu chức năng — hệ thống phải làm gì |
| MoSCoW | Cách xếp ưu tiên: Must / Should / Could / Won't |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
```

Thiếu footer Thuật ngữ (ở doc bắt buộc) hoặc chưa có `docs/00-glossary.md` → `ba-review` gắn gap **🟢 Nhỏ**.

## Mã định danh (theo phân loại yêu cầu)
Cấp yêu cầu — trong `01-requirements.md`:
- Business Requirement: `BR-01`
- Stakeholder Requirement: `StR-01`
- Solution Requirement — Functional: `FR-01`; Non-functional: `NFR-01`
- Business Rule (quy tắc nghiệp vụ, tách riêng khỏi FR): `BRule-01`; ở cấp màn: `BRule-S<NN>-01`
- Transition Requirement: `TR-01`

Cấp giải pháp:
- Chức năng (`02-functions.md`): `F01` — trace về ≥1 `FR`/`BR`
- Màn hình (`03-overview.md`): `S01`
- Yêu cầu màn (`srs.md`): chức năng `R-S<NN>-01` (trace `F`/`FR`); phi chức năng `R-S<NN>-N01` (trace `NFR`/`BR`)
- Use case: `UC-S<NN>-01`. User story: `US-S<NN>-01`. Test case: `TC-S<NN>-01`.

**Chuỗi truy vết chuẩn:** `BR → StR → FR/NFR → F → S → R-S → UC/US → TC`.

## Thuộc tính yêu cầu (áp cho mọi yêu cầu)
Mỗi yêu cầu mang: **ID · Nguồn** (stakeholder/tài liệu) **· Ưu tiên (MoSCoW:** Must/Should/Could/Won't) **· Trạng thái** (Đề xuất/Duyệt/Cài đặt) **· Truy vết** (lên/xuống). Ghi trong cột bảng hoặc chú thích.

## Ma trận tracking (`00-tracking.md`)
Cột: Mã CN | Chức năng | Nhóm | Màn hình | Folder | ascii | brainstorm | srs | usecase | userstory | design-spec | html | test | plan | dev | Trạng thái | Cập nhật cuối.
Trạng thái mỗi tài liệu: `✅` xong / `⬜` chưa / `⚠️` cần cập nhật.
Cột `dev` = trạng thái **code** của màn, do `dev-run` quản (⚠️ đang dev / ✅ dev xong); không map ra file tài liệu — `ba-track refresh` giữ nguyên giá trị, không reset.

**Một dòng = một màn hình** (không phải một chức năng). Màn hình phục vụ nhiều chức năng thì cột "Mã CN" liệt kê tất cả mã, cách nhau dấu phẩy (vd `F04, F05, F06`); cột "Nhóm" để `—` nếu màn không thuộc nhóm lồng.

## Quy tắc cập nhật tracking
Mỗi skill khi tạo/sửa tài liệu của một màn hình phải cập nhật ô tương ứng và cột "Cập nhật cuối" trong `docs/00-tracking.md`.

## Quy ước gate (ba-review)
Gate trong các orchestrator dựa trên mức ưu tiên gap mà `ba-review` gán:
- **Còn gap 🔴 (Chặn) hoặc 🟡 (Quan trọng) → DỪNG**, báo người dùng/sửa rồi chạy lại gate.
- **Chỉ còn gap 🟢 (Nhỏ) hoặc sạch → ĐI TIẾP**, nhưng liệt kê các 🟢 trong báo cáo cuối để xử lý sau.

## Xác nhận giả định (BẮT BUỘC)
Khi một skill phải **tự đưa ra giả định** (do thiếu thông tin) để tạo tài liệu, giả định đó **chưa được coi là chốt** — BA/người dùng phải rà trước khi pipeline đi tiếp. Áp cho **mọi** skill sinh giả định.

**Chế độ tương tác:**
1. **Gom & đánh số** mọi giả định vừa tạo: `GĐ-01`, `GĐ-02`… — mỗi cái ghi *nội dung* + *vì sao cần (chỗ thiếu)* + *ảnh hưởng nếu sai*.
2. **Rà lần lượt** — hỏi **từng giả định một** bằng `AskUserQuestion` (không gộp), mỗi cái cho chọn **Đồng ý / Sửa (nhập giá trị đúng) / Bỏ (không áp dụng)**.
3. **Summary** — rà hết thì trình **bảng tổng hợp**: `GĐ · Nội dung · Quyết định · Giá trị chốt`.
4. **Cổng quyết định** — hỏi người dùng xác nhận tổng thể; **chỉ khi người dùng đồng ý "đi tiếp"** mới chạy bước/skill kế. Còn yêu cầu sửa → cập nhật rồi mới tiếp.
5. **Cập nhật tài liệu** — ghi giá trị đã chốt; giả định bị sửa/bỏ → cập nhật mọi mục liên quan. Mục "Giả định" giữ trạng thái mỗi dòng: `Đề xuất → Đã xác nhận / Đã sửa / Đã bỏ`.

**Chế độ batch/không tương tác** (không hỏi được): giữ fallback — tự giả định hợp lý + ghi rõ — NHƯNG đánh dấu mỗi dòng **`⚠️ chưa xác nhận`**; vòng tương tác sau (hoặc `ba-review`) sẽ nhắc rà.

**Orchestrator:** coi vòng xác nhận này là **checkpoint** — sau skill sinh giả định, chạy nó trước gate/skill kế, không bỏ qua.

**ba-review:** giả định còn `⚠️ chưa xác nhận` → liệt kê ở mục "Cần xác nhận" và gắn gap **🟡 Quan trọng** (gate dừng để người dùng chốt).

## Animation chuyển cảnh (BẮT BUỘC)
Mọi màn hình phải đặc tả **animation in/out mượt** cho hai nhóm chuyển cảnh — không để "nếu có". Nguồn duy nhất cho mọi skill mô tả/thiết kế màn (`ba-screen-spec`, `ba-html-design`, `ba-figma-design`, `ba-screens`):

1. **Chuyển giữa các màn (page transition):** mỗi màn mô tả cách **vào (enter)** khi điều hướng tới và **ra (exit)** khi rời đi với màn lân cận (vd slide-in/out, fade, shared-element).
2. **Chuyển section nội màn (in/out):** mọi panel/modal/tab/accordion/danh sách/toast **xuất hiện hoặc biến mất** phải có animation in **và** out mượt (fade/slide/scale).

Quy tắc chung:
- **Duration/easing lấy từ Motion token** của `docs/07-design-system.md` (nếu có); mặc định: enter `ease-out`, exit `ease-in`, chuyển màn 250–300ms, section 150–200ms.
- Hiện thực bằng `transform`/`opacity` (mượt, tránh layout-thrash); **không** nảy/giật.
- **Tôn trọng `prefers-reduced-motion`:** giảm còn fade nhẹ hoặc tắt khi người dùng bật.

Thiếu mô tả chuyển cảnh trong `design-spec.md` → `ba-review` gắn gap **🟡 Quan trọng** (xem luật scope `<tên màn>`).

## Tài liệu suy luận từ code
Tài liệu do `ba-reverse` sinh bằng suy luận (không từ yêu cầu gốc) mang banner ở đầu file:
> 🔶 **Suy luận từ code — cần người xác nhận.**
