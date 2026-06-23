> 📦 File này được import từ **BA Toolkit**. Thư mục `example/` KHÔNG được copy — các liên kết `example/docs/...` chỉ có ở repo BA_toolkit gốc.

# BA Toolkit v3.0

Bộ skill cục bộ cho Claude Code, biến **ý tưởng thô → tài liệu BA đầy đủ → kế hoạch build** theo một pipeline chuẩn hóa. Mọi tài liệu sinh ra bằng tiếng Việt, nằm trong `docs/`. Phần dựng code "đứng trên vai" superpowers.

---

## 1. Cài đặt / kích hoạt

Skill nằm trong `.claude/skills/` của chính dự án này → chỉ hiệu lực khi bạn mở Claude Code **trong thư mục `BA_toolkit_v3.0`**.

- Nếu chưa thấy lệnh `/ba-*`, **khởi động lại session** trong thư mục này để Claude Code nạp skill.
- Kiểm tra nhanh: gõ `/ba-toolkit` — nếu hiện, bộ skill đã sẵn sàng.

---

## 2. Bộ skill

| # | Skill | Đầu vào | Đầu ra |
|---|-------|---------|--------|
| — | `ba-toolkit` | — | Index: nhắc pipeline + thứ tự (đọc khi cần định hướng) |
| 0 | `ba-brainstorm` | ý tưởng/tính năng thô | `docs/00-brainstorm.md` (phỏng vấn sâu IT-BA: Structured Interviewing + 5 Whys + complexity triggers) |
| 1 | `ba-requirements` | brainstorm / ý tưởng thô | `docs/01-requirements.md` — phân loại BABOK + MoSCoW + SMART/IEEE 830 + Business Rules catalog |
| 2 | `ba-functions` | `01-requirements.md` | `docs/02-functions.md` — Functional Decomposition + CRUD Analysis + MoSCoW |
| 3 | `ba-screens` | `02-functions.md` | `docs/03-overview.md` (User Journey + CRUD-to-Screen + sơ đồ điều hướng) + khung folder + `docs/00-tracking.md` |
| 4 | `ba-screen-spec` | 1 màn hình | 6 file: `ascii-screen.md`, `brainstorm.md`, `srs.md` (Use case + Flow + Field-level Validation), `usecase.md`, `userstory.md` (GWT + INVEST), `design-spec.md` |
| 5 | `ba-test` | 1 màn hình | `test.md` — test case bằng EP/BVA/DT/ST + Risk + Priority + test data cụ thể + **Trạng thái/Cách chạy + roll-up** theo dõi thực thi |
| 5b | `ba-figma-design` *(tùy chọn)* | 1 màn (`design-spec`) | preview Figma qua MCP `figma-mcp-go` (Atomic component + auto-layout + UI-state variants); lưu link vào `design-spec.md` |
| 6 | `ba-html-design` | 1 màn hình | `html-design.html` — mobile-first responsive + UI-state completeness + WCAG AA + bám design token |
| 7 | `ba-build` | folder màn hình | `plan.md` (Vertical Slice + TDD + Definition of Done + thứ tự phụ thuộc) — dừng ở plan |
| 8 | `dev-run` | màn có plan ✅ | code thật theo plan — TDD + code review + verification (bộ skill `dev-*`); cập nhật `test.md` (Pass/Fail + roll-up) + cột `dev` tracking |
| 9 | `ba-track` | `docs/` | làm mới / đồng bộ `docs/00-tracking.md` |

> Thứ tự test↔html linh hoạt (đều chỉ phụ thuộc `ba-screen-spec`). Figma luôn nằm **sau `design-spec`, trước HTML**; là bước **tùy chọn** — vắng MCP `figma-mcp-go` thì bỏ qua, không chặn pipeline.

### Lệnh điều phối (orchestrator) — 1 trigger chạy cả chuỗi
Mỗi lệnh tự lần lượt gọi các skill nguyên tử ở trên, kèm **gate dò gap** ở mỗi breakpoint. Gate dừng theo **mức ưu tiên** của `ba-review`: còn 🔴 (Chặn) / 🟡 (Quan trọng) → dừng hỏi bạn; chỉ còn 🟢 (Nhỏ) → đi tiếp (ghi nhận xử lý sau). Cuối các orchestrator sửa-đổi-docs có bước *(tùy chọn)* gọi lại `/ba-portal` để cổng đọc không bị cũ. Skill nguyên tử vẫn dùng lẻ được.

| Lệnh | Dùng khi | Chuỗi gói bên trong |
|------|----------|---------------------|
| `/ba-init` | Khởi tạo dự án mới | requirements → functions → screens → (mỗi màn) spec/test/html → build, có gate |
| `/dev-run` | Dev các màn từ plan | gate build → scaffold nếu repo trống → (mỗi màn) executing-plans + TDD + review + verification → cập nhật test.md + cột `dev` |
| `/ba-add-screen` | Thêm 1 màn hình | overview/tracking/folder → spec → test → html → build |
| `/ba-add-feature` | Thêm 1 chức năng (nhiều màn) | requirements+functions+overview → lặp đặc tả màn liên quan → build |
| `/ba-change-request` | Áp change request | track sync → cập nhật srs/test/html → build lại |
| `/ba-reverse` | Sinh tài liệu từ code | recon stack → fan-out quét code → tổng hợp docs (data-model/api/màn/chức năng) + requirements suy luận 🔶 → review |
| `/ba-review` | Dò gap / rà soát | kiểm tra độ phủ + truy vết → `docs/00-gaps.md` + ⚠️ vào tracking |
| `/ba-portal` | Xuất cổng tài liệu | gom toàn bộ `docs/` → `docs/portal.html` (offline, sidebar + scrollspy) qua `node build.js` |

### Bộ skill `dev-*` — framework dev tự chứa
10 skill kỷ luật dev/QA (clone từ plugin **superpowers v5.1.0**, nội dung gốc tiếng Anh, tham chiếu đã đổi sang `dev-*`): writing-plans · executing-plans · subagent-driven-development · dispatching-parallel-agents · test-driven-development · systematic-debugging · requesting-code-review · verification-before-completion · finishing-a-development-branch · using-git-worktrees. `ba-export` mang theo cả bộ — dự án đích không cần cài plugin.

### Tài liệu cấp hệ thống (tùy chọn — chạy khi cần)
| Lệnh | Đầu ra | Nội dung |
|------|--------|----------|
| `/ba-stakeholder` | `docs/04-stakeholders.md` | Onion Diagram + ma trận Quyền lực/Quan tâm + Engagement (hiện tại→mong muốn) + RACI (đúng 1 A) |
| `/ba-data-model` | `docs/05-data-model.md` | Thực thể + ERD (Mermaid) + từ điển dữ liệu + quan hệ + Normalization ≥3NF + Ma trận CRUD |
| `/ba-api-spec` | `docs/06-api-spec.md` | Resource-Oriented REST + Ma trận CRUD-to-Endpoint + error envelope chuẩn + status semantics, trace `F..` |
| `/ba-design-system` | `docs/07-design-system.md` | Token màu/typography/spacing/elevation + component + layout + responsive + motion; nguồn style chuẩn cho `ba-figma-design` & `ba-html-design` (hybrid: reverse từ màn đã có / brief nếu chưa) |

---

## 3. Cấu trúc tài liệu sinh ra

```
docs/
├── 00-brainstorm.md      # phỏng vấn sâu IT-BA do /ba-brainstorm sinh (đầu vào cho yêu cầu)
├── 00-tracking.md        # ma trận truy vết (quản lý theo từng chức năng/màn hình)
├── 00-gaps.md            # báo cáo gap do /ba-review sinh (ghi đè mỗi lần chạy)
├── 01-requirements.md    # bản yêu cầu tổng
├── 02-functions.md       # danh sách chức năng theo module
├── 03-overview.md        # tổng quan màn hình + sơ đồ điều hướng + map chức năng↔màn hình
├── 04-stakeholders.md    # (tùy chọn) /ba-stakeholder
├── 05-data-model.md      # (tùy chọn) /ba-data-model
├── 06-api-spec.md        # (tùy chọn) /ba-api-spec
├── 07-design-system.md   # (tùy chọn) /ba-design-system — nguồn style cho figma & html
└── <Nhóm>/<Màn>/         # mỗi màn hình 9 file
    ├── ascii-screen.md   ├── usecase.md     ├── design-spec.md   ├── test.md
    ├── brainstorm.md     ├── userstory.md   ├── html-design.html ├── plan.md
    └── srs.md
```
> `design-spec.md` có thể chứa mục **"Bản Figma (preview)"** (link node Figma) do `ba-figma-design` ghi.

**Quy ước quan trọng** (chi tiết trong `.claude/skills/ba-toolkit/conventions.md`):
- Nhóm nhiều màn → lồng `docs/<Nhóm>/<Màn>/`; nhóm 1 màn → dùng thẳng `docs/<Màn>/`.
- Tên folder PascalCase không dấu (`Authentication/Login`); tên hiển thị tiếng Việt nằm trong nội dung.
- Mã định danh: yêu cầu phân loại `BR`/`StR`/`FR`/`NFR`/`TR` (trong `01-requirements.md`); chức năng `F01`; màn hình `S01`; yêu cầu màn `R-S01-01`; use case `UC-S01-01`; user story `US-S01-01`; test case `TC-S01-01`.
- Chuỗi truy vết chuẩn: `BR → StR → FR/NFR → F → S → R-S → UC/US → TC`.
- `00-tracking.md`: **một dòng = một màn hình**; màn nhiều chức năng → cột "Mã CN" liệt kê nhiều mã.

---

## 4. Workflow áp dụng (từ đầu đến cuối)

### Giai đoạn A — Phân tích cấp tổng (chạy 1 lần)
```
/ba-brainstorm     → phỏng vấn sâu IT-BA → docs/00-brainstorm.md (khuyến nghị)
/ba-requirements   → đọc brainstorm + hỏi đáp → docs/01-requirements.md
/ba-functions      → docs/02-functions.md
/ba-screens        → docs/03-overview.md + khung folder + docs/00-tracking.md
```
👉 Sau bước này: rà soát `03-overview.md` (đủ màn hình chưa?) và `00-tracking.md` (mọi ô đang `⬜`).

### Giai đoạn B — Đặc tả từng màn hình (lặp cho mỗi màn)
Với mỗi màn hình trong overview:
```
/ba-screen-spec <tên màn>   → 6 file phân tích (gồm design-spec)
/ba-test <tên màn>          → test.md
/ba-figma-design <tên màn>  → (tùy chọn) dựng preview Figma từ design-spec qua MCP figma-mcp-go
/ba-html-design <tên màn>   → html-design.html
```
👉 Mỗi skill tự cập nhật ô tương ứng trong `00-tracking.md` thành `✅`.
👉 Có `07-design-system.md` (chạy `/ba-design-system`) thì `ba-figma-design` & `ba-html-design` bám token trong đó — màn nào cũng cùng một bộ màu/typography.
👉 Nhiều màn cần làm nhanh: bảo Claude "dùng dispatching-parallel-agents chạy ba-screen-spec cho các màn X, Y, Z".

### Giai đoạn C — Lập kế hoạch & build
```
/ba-build          → sinh plan.md trong từng folder màn hình (KHÔNG tự chạy code)
```
👉 Duyệt từng `plan.md`, rồi chủ động build từng chức năng:
- "Thực thi `docs/Authentication/Login/plan.md`" → Claude dùng `executing-plans`/`subagent-driven-development` (TDD, lấy test case từ `test.md`).

### Giai đoạn D — Bảo trì khi thay đổi
Khi sửa một chức năng/màn hình:
```
/ba-track sync <tên màn>    → rà soát & cập nhật mọi tài liệu liên quan màn đó (đánh dấu ⚠️ chỗ lệch)
/ba-track refresh           → dựng lại 00-tracking.md theo hiện trạng file
```

---

## 5. Use case rẽ nhánh (tình huống thường gặp)

Không phải lúc nào cũng chạy cả pipeline. Mỗi kịch bản có **lệnh nhanh** (orchestrator, 1 trigger) — bên dưới còn ghi chuỗi skill thủ công nếu bạn muốn chạy từng bước.

### 🆕 A. Khởi tạo dự án mới (init) — `/ba-init`
Một lệnh chạy **toàn bộ** pipeline (giai đoạn A → B → C ở mục 4), có gate dò gap. Thủ công thì:
```
/ba-brainstorm → /ba-requirements → /ba-functions → /ba-screens
   → (mỗi màn) /ba-screen-spec → /ba-html-design → /ba-test
   → /ba-build → build từng plan
```

### ➕ B. Thêm 1 màn hình mới (đang phát triển) — `/ba-add-screen`
Không chạy lại từ đầu — chỉ đụng phần liên quan. Thủ công thì:
```
1. (nếu màn mới sinh chức năng mới) cập nhật docs/02-functions.md: thêm F..
2. Bảo Claude: "thêm màn <X> vào 03-overview.md + map chức năng, tạo folder docs/<…>/<X>/, thêm 1 dòng vào 00-tracking.md (mọi ô ⬜)"
3. /ba-screen-spec <X>  →  /ba-html-design <X>  →  /ba-test <X>
4. /ba-build  (chỉ sinh plan.md cho màn chưa có plan)  →  build plan của <X>
5. /ba-track refresh
```

### 🧩 C. Thêm 1 chức năng mới (có thể trải nhiều màn) — `/ba-add-feature`
```
1. Cập nhật docs/01-requirements.md (nếu là phạm vi mới) + docs/02-functions.md: thêm F..
2. Cập nhật docs/03-overview.md: thêm/điều chỉnh màn liên quan + map chức năng↔màn; tạo folder mới
3. Với mỗi màn mới hoặc bị ảnh hưởng → lặp giai đoạn B (screen-spec / html / test)
4. /ba-build cho các màn đó  →  build
5. /ba-track refresh
```

### 🔁 D. Change Request — đổi 1 chức năng đã có — `/ba-change-request`
Đây là lúc `ba-track` + `ba-review` phát huy: lần ra mọi tài liệu cần sửa. Thủ công thì:
```
1. Sửa nguồn: cập nhật yêu cầu trong 01-requirements.md / 02-functions.md (nếu CR đổi phạm vi)
2. /ba-track sync <màn>   → đánh dấu ⚠️ các tài liệu lệch (srs, usecase, test, html, plan)
3. Cập nhật từng tài liệu ⚠️:
   - đổi yêu cầu/nghiệp vụ → chạy lại /ba-screen-spec <màn> (srs/usecase/userstory)
   - đổi ca kiểm thử       → /ba-test <màn>
   - đổi giao diện         → /ba-html-design <màn>
4. /ba-build  → cập nhật plan.md của màn  →  build lại phần thay đổi
5. /ba-track refresh
```

### 🎨 E. Chỉ chỉnh giao diện 1 màn (không đổi nghiệp vụ)
```
/ba-html-design <màn>   (nếu bố cục đổi nhiều, cập nhật ascii-screen trước qua /ba-screen-spec)
→ /ba-track refresh
```

### ✅ F. Chỉ bổ sung / cập nhật kiểm thử
```
/ba-test <màn>  →  /ba-track refresh
```

### 🔍 G. Kiểm tra hiện trạng & dò gap
```
/ba-review          → dò gap độ phủ + truy vết → docs/00-gaps.md + ⚠️ vào tracking
/ba-track refresh   → dựng lại 00-tracking.md, nhìn ô ⬜/⚠️ để biết việc còn lại
```

### 🧬 H. Dự án đã có code (reverse-engineering) — `/ba-reverse`
Dựng tài liệu BA ngược từ codebase có sẵn:
```
/ba-reverse
  → recon stack/framework
  → fan-out subagent quét: routes/màn · models/data-model · API · chức năng
  → tổng hợp: 05-data-model, 06-api-spec, 02-functions, 03-overview + folder màn (tin cậy CAO)
            + 01-requirements & srs/usecase/test per màn (suy luận, gắn 🔶 cần xác nhận)
  → /ba-review all + /ba-track refresh
→ rà soát các tài liệu 🔶, tinh chỉnh qua /ba-change-request hoặc skill forward
```

### 🧠 I. Phỏng vấn sâu một tính năng phức tạp — `/ba-brainstorm`
Khi tính năng có OAuth/thanh toán/async/nhiều vai trò/nhiều trạng thái — cần làm rõ kỹ trước khi viết yêu cầu:
```
/ba-brainstorm
  → phỏng vấn 7 phần (từng câu một, hỏi nghiệp vụ không hỏi kỹ thuật)
  → tự bật Deep-dive (ASCII flow / scenario matrix / bảng state) khi gặp complexity trigger
  → ép giá trị chính xác (số, wording) → docs/00-brainstorm.md
→ /ba-requirements (đọc brainstorm làm input) → tiếp pipeline
```

### 👥 J. Khởi động dự án — nắm bên liên quan trước (kickoff)
Dự án mới, cần map stakeholder + kế hoạch giao tiếp trước khi đào yêu cầu:
```
/ba-stakeholder  → docs/04-stakeholders.md (danh bạ + Quyền lực/Quan tâm + RACI)
/ba-brainstorm   → /ba-requirements → /ba-functions → ... (pipeline thường)
```

### 🗄️ K. Bổ sung tài liệu kỹ thuật cấp hệ thống — data model & API
Khi cần mô hình dữ liệu & đặc tả API (trước khi build backend, hoặc bàn giao dev):
```
/ba-data-model   → docs/05-data-model.md (ERD Mermaid + từ điển dữ liệu + quan hệ)
/ba-api-spec     → docs/06-api-spec.md (bảng endpoint + request/response + mã trạng thái)
→ /ba-review all  (kiểm tra endpoint/thực thể trace về chức năng F..)
```

### 🎨 M. Design system & preview Figma — `/ba-design-system`, `/ba-figma-design`
Lập nguồn style chuẩn rồi xem trước màn trên Figma trước khi dựng HTML:
```
/ba-design-system   → docs/07-design-system.md
   • reverse: gom token từ html-design/design-spec các màn đã có (chuẩn hoá chỗ lệch)
   • brief:   hỏi vài câu (màu thương hiệu, font, tông) nếu chưa có màn
   • (tùy chọn) đẩy token sang Figma làm variables/styles
/ba-figma-design <màn>  → dựng frame Figma từ design-spec (bám 07-design-system nếu có)
                          → lưu link node vào design-spec.md → duyệt → /ba-html-design
```
> Cần MCP `figma-mcp-go` (file Figma đang mở) cho `ba-figma-design`. Vắng MCP → bỏ qua, không chặn pipeline.

### 📤 L. Xuất cổng tài liệu để xem/chia sẻ — `/ba-portal`
Sau khi tài liệu đủ, gom thành 1 trang đọc được (offline) cho stakeholder:
```
node .claude/skills/ba-portal/build.js docs docs/portal.html
→ mở docs/portal.html trên trình duyệt (sidebar điều hướng + mục lục + scrollspy)
```

**Nguyên tắc chung:** sửa ở đâu thì `ba-track` ở đó. Luôn kết thúc một thay đổi bằng `/ba-track refresh` để ma trận phản ánh đúng hiện trạng, và để cột `⚠️` không còn sót.

---

## 6. Sơ đồ pipeline

```
Ý tưởng thô
   │  /ba-brainstorm
   ▼
00-brainstorm.md
   │  /ba-requirements
   ▼
01-requirements.md ──/ba-functions──► 02-functions.md ──/ba-screens──► 03-overview.md
                                                                          + khung folder
                                                                          + 00-tracking.md
   ┌──────────────────── lặp cho từng màn hình ────────────────────┐
   │ /ba-screen-spec → 6 file → /ba-test → [/ba-figma-design] → /ba-html-design │
   └───────────────────────────────────────────────────────────────┘
   (07-design-system.md tùy chọn → nguồn token cho figma & html)
   │  /ba-build
   ▼
plan.md (mỗi màn) ──► executing-plans / subagent-driven-development ──► CODE
   ▲
   └── /ba-track (sync khi sửa, refresh khi cần rà soát)
```

---

## 7. Truy vết (traceability)

Chuỗi truy vết liền mạch giúp khi sửa 1 chỗ biết phải kiểm tra ở đâu:

```
BR-01 (Business Requirement, 01-requirements)
 └─► StR-01 (Stakeholder Requirement)
      └─► FR-01 / NFR-01 (Solution Requirement)
           └─► F01 (02-functions, trace FR/BR)
                └─► S01/Login (03-overview: map chức năng↔màn)
                     └─► R-S01-01 (srs.md, trace F/FR) + acceptance criteria
                          └─► UC-S01 / US-S01 (GWT + INVEST)
                               └─► TC-S01-01 (test.md: Positive/Negative/Edge)
                                    └─► task trong plan.md (build)
```

Sửa chức năng → mở `00-tracking.md` tìm dòng màn → chạy `/ba-track sync <màn>` để đồng bộ toàn bộ 9 tài liệu.

---

## 8. Tài liệu thiết kế bộ skill

- Spec: `docs/superpowers/specs/2026-06-10-ba-toolkit-skills-design.md`
- Plan triển khai: `docs/superpowers/plans/2026-06-10-ba-toolkit-skills.md`
- Quy ước dùng chung: `.claude/skills/ba-toolkit/conventions.md`
