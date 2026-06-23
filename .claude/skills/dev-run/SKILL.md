---
name: dev-run
description: Use when tài liệu và plan.md của các màn hình đã đủ (ba-build đã chạy) và cần triển khai code thật cho những màn chỉ định; bước 8 của BA toolkit, sau ba-build.
---

# dev-run — Orchestrator chạy dev từ plan BA

## Mục tiêu
Từ tài liệu + `plan.md` mà pipeline BA đã sinh, dev các màn chỉ định thành code chạy được — kỷ luật dev và QA bằng bộ skill `dev-*` (clone từ framework superpowers, tự chứa trong project). Cập nhật trạng thái test (`test.md`) và tracking (cột `dev`).

## Cách gọi
`dev-run <màn>` · `dev-run <màn1, màn2>` · `dev-run all` (= mọi màn có `plan = ✅` và `dev = ⬜`). Dev **trọn vẹn từng màn một** theo thứ tự chỉ định rồi mới sang màn kế — không dở dang chéo.

## Gate đầu + scaffold
1. Đọc `conventions.md` của `ba-toolkit` + `docs/00-tracking.md`; lọc màn chỉ định có `plan = ✅`. Màn thiếu plan → báo, loại khỏi đợt chạy.
2. **Gate:** invoke `ba-review build`. Còn 🔴/🟡 → dừng, báo người dùng.
3. **Repo chưa có codebase:** đọc mục Ràng buộc trong `docs/01-requirements.md`, hỏi người dùng stack (1 câu, vd Next.js / Express+React / khác), scaffold tối thiểu (test runner + lint chạy được, cấu trúc `src/` khớp file path trong plan), commit scaffold. Ghi stack + lệnh test/lint vào `docs/08-dev-notes.md` — các lần chạy sau đọc file này, **không hỏi lại**.

## Vòng dev mỗi màn
1. Đánh dấu tracking `dev = ⚠️` (đang dev) + cột "Cập nhật cuối".
2. **Thực thi `plan.md`:** REQUIRED SUB-SKILL: Use dev-executing-plans (chạy tương tác, checkpoint theo batch task). Khi plan có nhiều task độc lập và muốn song song trong phiên: Use dev-subagent-driven-development thay thế.
3. **Mỗi task:** REQUIRED BACKGROUND: dev-test-driven-development — viết test thất bại từ `TC-S..` mà task trace → code tối thiểu cho pass → tick checkbox trong `plan.md` → commit theo message plan ghi.
4. **Test fail không rõ nguyên nhân:** REQUIRED SUB-SKILL: Use dev-systematic-debugging — tìm nguyên nhân gốc trước khi sửa; cấm sửa mò.
5. **Xong mọi task của màn:** chạy **toàn bộ** test suite. Cập nhật `test.md` của màn:
   - TC có `Cách chạy = Auto` và test tương ứng pass → `Trạng thái = Pass`; fail → `Fail` (kèm ghi chú lỗi).
   - Cập nhật bảng **roll-up** (đếm + % Pass + "Lần chạy cuối").
   - TC `Manual` giữ `Chưa chạy` → xuất **checklist test tay** cho người dùng ở báo cáo cuối.
6. **QA code:** REQUIRED SUB-SKILL: Use dev-requesting-code-review — review diff của màn đối chiếu `srs.md`/`plan.md`. Finding nghiêm trọng → sửa (lặp lại vòng TDD bước 3) → review lại.
7. **Trước khi chốt:** REQUIRED SUB-SKILL: Use dev-verification-before-completion — phải có bằng chứng (output lệnh test/lint) trước mọi tuyên bố hoàn thành.
8. Tracking `dev = ✅` + "Cập nhật cuối". Báo màn xong, sang màn kế.

## Kỹ thuật áp dụng
- **TDD Red–Green:** mỗi TC trace → test fail trước, code tối thiểu cho pass; cấm viết code trước test (chi tiết: dev-test-driven-development).
- **Vertical Slice theo plan:** đi đúng thứ tự phụ thuộc task trong `plan.md`; không nhảy cóc qua task bị chặn.
- **Systematic Debugging:** fail → đọc lỗi, cô lập, lập giả thuyết, tìm nguyên nhân gốc — không thử-sai ngẫu nhiên.
- **Code Review gate:** mọi màn phải qua dev-requesting-code-review trước khi đánh ✅.
- **Evidence-based completion:** không tuyên bố pass khi chưa có output lệnh thật (dev-verification-before-completion).

## Tiêu chí chất lượng (BẮT BUỘC)
- Task chỉ tick ✅ khi test trace **pass thật** (có output) và **Definition of Done** trong plan thoả.
- Sau dev một màn: không TC `Auto` nào còn `Chưa chạy`; bảng roll-up khớp đếm trạng thái từng TC.
- **Cấm đánh `dev = ✅`** khi: test suite còn đỏ · review còn finding nghiêm trọng chưa xử lý · DoD chưa thoả.
- UI bám `html-design.html` + `docs/07-design-system.md`; logic bám `srs.md`/`BRule-S..`.

## Kết thúc (sau mọi màn chỉ định)
1. Báo bảng tổng kết: mỗi màn × (task xong / TC Pass / TC Fail / TC Manual chờ test tay).
2. Liệt kê checklist TC Manual cần người dùng chạy tay (mã TC + các bước rút gọn).
3. Nếu dev trên nhánh riêng: REQUIRED SUB-SKILL: Use dev-finishing-a-development-branch (chọn merge / PR / giữ nhánh).
4. *(Tùy chọn)* nếu dự án có `docs/portal.html`, invoke `ba-portal` làm mới cổng đọc.

## Lưu ý
- `ba-build` dừng ở plan; `dev-run` là bước kế tiếp do người dùng trigger — không tự chạy sau ba-build.
- Cột `dev` trong tracking do skill này quản; `ba-track refresh` không reset nó (không map ra file tài liệu).
- TC bị sửa nội dung trong lúc dev (phát hiện yêu cầu sai) → dừng, đề xuất `ba-change-request` thay vì tự đổi tài liệu.
- Cần workspace cách ly (nhiều việc song song trong repo) → Use dev-using-git-worktrees.
- Tiếng Việt khi báo cáo; code/comment theo chuẩn dự án.
