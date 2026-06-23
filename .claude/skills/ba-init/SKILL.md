---
name: ba-init
description: Use when khởi tạo một dự án phần mềm mới từ ý tưởng thô và muốn chạy trọn pipeline BA trong một lệnh — từ yêu cầu, chức năng, màn hình đến đặc tả và kế hoạch build, có gate dò gap ở mỗi breakpoint.
---

# ba-init — Orchestrator khởi tạo dự án

## Mục tiêu
Chạy trọn pipeline BA cho một App mới trong một lần trigger. Đây là skill điều phối: lần lượt invoke các skill con, dừng ở mỗi gate nếu có gap.

## Quy trình
Đọc `conventions.md` của `ba-toolkit`. Thực hiện tuần tự (không dừng giữa chừng trừ khi cần input người dùng hoặc gặp gap):

1. Invoke `ba-brainstorm` → `docs/00-brainstorm.md` (phỏng vấn sâu IT-BA).
2. Invoke `ba-requirements` (đọc `00-brainstorm.md` làm input) → `docs/01-requirements.md`.
3. **Gate:** invoke `ba-review requirements` (xem "Quy ước gate" trong conventions). Còn 🔴/🟡 → báo và dừng để người dùng bổ sung; chỉ 🟢/sạch → tiếp.
4. Invoke `ba-functions` → `docs/02-functions.md`.
5. **Gate:** invoke `ba-review functions`. Còn 🔴/🟡 → dừng; chỉ 🟢/sạch → tiếp.
6. Invoke `ba-screens` → `03-overview.md` + folder + `00-tracking.md`.
7. **Gate:** invoke `ba-review screens`. Còn 🔴/🟡 → dừng; chỉ 🟢/sạch → tiếp.
8. Với **mỗi màn hình** trong overview (nhiều màn → REQUIRED SUB-SKILL: Use dev-dispatching-parallel-agents):
   a. Invoke `ba-screen-spec <màn>`.
   b. Invoke `ba-test <màn>`.
   c. **Gate:** invoke `ba-review <màn>`. Còn 🔴/🟡 → dừng ở màn đó; chỉ 🟢/sạch → tiếp.
   d. *(Tùy chọn)* invoke `ba-figma-design <màn>` → preview Figma trước HTML (bỏ qua nếu `figma-mcp-go` vắng).
   e. Invoke `ba-html-design <màn>`.
9. Invoke `ba-build` → `plan.md` mỗi folder.
10. **Gate cuối:** invoke `ba-review build` rồi `ba-review all`. Báo tổng kết gap (nếu còn).
11. Báo người dùng: pipeline xong, danh sách plan đã sinh, hướng dẫn build từng plan.

## Lưu ý
- Không tự chạy code (`ba-build` chỉ sinh plan).
- Điểm cần input người dùng: hỏi đáp ở `ba-requirements`, và mỗi gate còn gap 🔴/🟡.
- **Checkpoint giả định:** `ba-brainstorm`/`ba-requirements` tự chạy vòng "Xác nhận giả định" (`conventions.md`) — orchestrator **không bỏ qua**; chỉ khi người dùng đồng ý "đi tiếp" mới sang bước kế.
- Skill nguyên tử vẫn dùng được lẻ; orchestrator này chỉ gói trình tự.
