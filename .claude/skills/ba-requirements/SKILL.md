---
name: ba-requirements
description: Use when có ý tưởng phần mềm thô và cần biến thành bản yêu cầu có cấu trúc cho một App; bước đầu của BA toolkit, sinh docs/01-requirements.md.
---

# ba-requirements — Ý tưởng thô → Bản yêu cầu

## Mục tiêu
Biến mô tả ý tưởng thô thành `docs/01-requirements.md` có cấu trúc.

## Quy trình
1. Đọc `conventions.md` của skill `ba-toolkit`.
2. Đọc `docs/00-brainstorm.md` nếu có (đầu ra của `ba-brainstorm`) làm input chính; nếu chưa có, đọc ý tưởng người dùng cung cấp.
3. Hỏi đáp **từng câu một** để làm rõ chỗ thiếu: đối tượng người dùng, phạm vi, ràng buộc, tiêu chí thành công. Nếu chưa brainstorm và cần đào sâu, khuyến nghị chạy `ba-brainstorm` trước.
4. Khi đủ thông tin, viết `docs/01-requirements.md` đúng các mục trong `template.md` (cùng thư mục).
5. **Tạo từ điển trung tâm `docs/00-glossary.md`** từ `glossary-seed.md` (cùng thư mục): copy nguyên seed, điền `<Tên App>`, bổ sung thuật ngữ nghiệp vụ đặc thù dự án vào mục 2. Đây là nguồn chuẩn để các skill sau bổ sung thêm.
6. Thêm footer `## Thuật ngữ` vào cuối `01-requirements.md` (xem format trong `conventions.md`).
7. **Xác nhận giả định (BẮT BUỘC):** nếu có giả định ở mục 7 (đánh số `GĐ-..`), chạy vòng xác nhận theo "Xác nhận giả định" trong `conventions.md` — rà **từng giả định một** bằng `AskUserQuestion` → bảng summary → người dùng đồng ý "đi tiếp" mới chốt; cập nhật trạng thái + giá trị chốt vào tài liệu.
8. Trình bày tóm tắt và xác nhận với người dùng trước khi chốt.

## Kỹ thuật áp dụng
- **Requirements Classification (BABOK):** phân tầng Business → Stakeholder → Solution (Functional/Non-functional) → Transition; mỗi yêu cầu có ID/Nguồn/Ưu tiên (MoSCoW)/Trạng thái/Truy vết.
- **SMART / đặc tính yêu cầu tốt (IEEE 830):** mỗi yêu cầu phải *atomic* (1 ý), *unambiguous* (không đa nghĩa), *testable/measurable* (kiểm chứng được), *feasible* (khả thi), *traceable* (trace được). NFR luôn kèm con số đo được (vd "< 2s", "99.9% uptime").
- **Business Rules tách riêng:** quy tắc/ràng buộc nghiệp vụ (vd "đơn > 10 triệu cần duyệt") ghi vào *catalog Business Rules* riêng, không trộn vào FR — vì rule thay đổi độc lập với chức năng.
- **MoSCoW:** ưu tiên Must/Should/Could/Won't.

## Tiêu chí chất lượng (BẮT BUỘC)
- Mỗi yêu cầu đạt **checklist SMART**: cấm câu mơ hồ kiểu "hệ thống phải nhanh/thân thiện/dễ dùng" — phải định lượng hoặc mô tả kiểm chứng được.
- **NFR có số đo:** mọi yêu cầu phi chức năng kèm ngưỡng cụ thể.
- **Truy vết hai chiều:** FR→StR→BR liền mạch; business rule nằm ở catalog riêng, có ID `BRule-..` và trace về BR/FR liên quan.
- Không bịa chức năng — thiếu thì hỏi. Batch/không tương tác: tự giả định hợp lý và **ghi rõ giả định** trong tài liệu, đánh dấu **`⚠️ chưa xác nhận`** (xem "Xác nhận giả định" trong `conventions.md`).
- **Văn phong chuyên nghiệp + Thuật ngữ:** mở rộng từ viết tắt ở lần đầu dùng; tạo `docs/00-glossary.md` + footer `## Thuật ngữ` (xem "Văn phong tài liệu" & "Thuật ngữ" trong `conventions.md`).

## Lưu ý
- Tài liệu bằng tiếng Việt. Là tài liệu cấp tổng đầu tiên, đầu vào cho `ba-functions`.
- `ba-requirements` là skill **khởi tạo** từ điển `docs/00-glossary.md`; các skill sau chỉ bổ sung thuật ngữ mới, không tạo lại.
