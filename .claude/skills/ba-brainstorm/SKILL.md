---
name: ba-brainstorm
description: Use when có ý tưởng hoặc tính năng thô và cần phỏng vấn sâu để làm rõ trước khi viết yêu cầu — elicitation phong cách IT-BA (hỏi nghiệp vụ, không hỏi kỹ thuật); bước trước ba-requirements, sinh docs/00-brainstorm.md.
---

# ba-brainstorm — Phỏng vấn sâu IT-BA

## Mục tiêu
Biến ý tưởng/tính năng thô thành `docs/00-brainstorm.md` rõ ràng, làm đầu vào cho `ba-requirements`. Trọng tâm là **khai thác nghiệp vụ**, không quyết định kỹ thuật.

## Trước khi bắt đầu — đọc 3 rule (cùng thư mục)
- `rules/it-ba-framing.md` — chỉ hỏi nghiệp vụ, cấm hỏi kỹ thuật.
- `rules/complexity-triggers.md` — phát hiện tín hiệu phức tạp → artifact bắt buộc.
- `rules/interview-discipline.md` — hỏi từng câu, no-re-ask, ép giá trị chính xác.

## Quy trình
1. **Phase A — quét & phát hiện trigger:** đọc ý tưởng, đối chiếu `complexity-triggers.md`, ghi nhận các trigger bật.
2. **Phỏng vấn 7 phần TUẦN TỰ**, mỗi phần hỏi **từng câu một**, tuân `interview-discipline.md` và `it-ba-framing.md`:
   - **P1. Tổng quan** — làm gì, giải quyết vấn đề gì, vì sao bây giờ.
   - **P2. Người dùng & quyền** — vai trò nào dùng, điều kiện gating, điểm vào, quy mô dự kiến.
   - **P3. Luồng chính (happy path)** — từng bước: người dùng làm gì → hệ thống làm gì → người dùng thấy gì.
   - **P4. Deep-dive** — **CHỈ KHI có trigger ở Phase A**: sinh artifact bắt buộc tương ứng (ASCII flow / scenario matrix / bảng state / ma trận giao dịch gián đoạn). ASCII, không Mermaid, tối đa 3 vòng review.
   - **P5. Validation & wording** — trường bắt buộc, giới hạn/định mức **chính xác**, wording lỗi/thành công **chính xác**.
   - **P6. Ngữ cảnh hệ thống** — loại thông tin cần lưu, dịch vụ ngoài (tên + mục đích), kênh thông báo, xử lý nền, có cần real-time.
   - **P7. Edge case & rủi ro** — mất mạng, dịch vụ ngoài chết, người dùng đồng thời, rủi ro nghiệp vụ.
3. **Viết** `docs/00-brainstorm.md` theo `template.md`, gồm Open Questions + Giả định (đánh số `GĐ-01`…, mỗi giả định ghi lý do cần + ảnh hưởng nếu sai).
4. **Xác nhận giả định (BẮT BUỘC):** chạy vòng xác nhận theo "Xác nhận giả định" trong `conventions.md` — rà **từng `GĐ-..` một** bằng `AskUserQuestion` (Đồng ý/Sửa/Bỏ) → bảng summary → người dùng đồng ý "đi tiếp" mới bàn giao; cập nhật trạng thái từng dòng trong mục Giả định.
5. **Bàn giao:** báo người dùng brainstorm xong, là đầu vào cho `ba-requirements`.

## Kỹ thuật elicitation áp dụng
- **Structured Interviewing:** phỏng vấn theo bộ câu hỏi tổ chức trước (7 phần tuần tự ở trên), hỏi từng câu một — không tự do ngẫu hứng.
- **5 Whys:** với mỗi mục tiêu/yêu cầu thô, hỏi "vì sao" liên tiếp để đào tới *nhu cầu nghiệp vụ gốc* thay vì dừng ở giải pháp bề mặt.
- **Scenario / Happy-path Walkthrough:** đi qua từng bước luồng chính (người dùng làm gì → hệ thống làm gì → thấy gì) để lộ bước thiếu và ngoại lệ (P3, P4).
- **Assumptions & Constraints Log:** mọi điều chưa xác nhận ghi vào mục Giả định + Open Questions, không coi là sự thật.
- **Complexity Triggers → Artifact:** khi bật trigger (redirect ngoài / async / đa vai trò / state machine / throttle) → sinh artifact bắt buộc tương ứng (xem `rules/complexity-triggers.md`).

## Tiêu chí chất lượng (BẮT BUỘC)
- **Mỗi điều thu được là atomic + kiểm chứng được:** giới hạn/định mức/wording ghi **giá trị chính xác** (ép theo `interview-discipline.md`), không để "khoảng vài...", "đủ nhanh".
- **Không hỏi kỹ thuật** (tuân `it-ba-framing.md`); mọi câu ở tầng nghiệp vụ.
- **Trigger bật → có artifact tương ứng**; điều chưa rõ → vào Open Questions, không bịa.

## Lưu ý
- Một câu hỏi mỗi lần; không gộp.
- Tiếng Việt; wording tự nhiên.
- **Văn phong dễ hiểu:** giải thích ngay mọi thuật ngữ nghiệp vụ đặc thù xuất hiện trong `00-brainstorm.md` (brainstorm chạy trước khi có `00-glossary.md` — các thuật ngữ này sẽ được `ba-requirements` đưa vào từ điển trung tâm). Xem "Văn phong tài liệu" trong `conventions.md`.
- Nếu chạy không tương tác (batch/test): tự giả định hợp lý và ghi rõ vào mục Giả định + Open Questions thay vì chờ trả lời — đánh dấu mỗi dòng **`⚠️ chưa xác nhận`** để vòng tương tác sau / `ba-review` nhắc rà (xem "Xác nhận giả định" trong `conventions.md`).
