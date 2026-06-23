---
name: ba-stakeholder
description: Use when cần lập bản phân tích các bên liên quan của dự án — danh bạ stakeholder, ma trận Quyền lực/Quan tâm và bảng RACI; tài liệu cấp tổng, hỗ trợ lập kế hoạch và giao tiếp.
---

# ba-stakeholder — Phân tích các bên liên quan

## Mục tiêu
Sinh `docs/04-stakeholders.md`: danh bạ stakeholder + ma trận Quyền lực/Quan tâm + bảng RACI + kế hoạch giao tiếp.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit`, `docs/01-requirements.md` (mục Stakeholder Requirements) và `00-brainstorm.md` nếu có.
2. **Nhận diện stakeholder** (kể cả nhóm gián tiếp) — dùng Onion Diagram để không bỏ sót.
3. Xếp vào **ma trận Quyền lực × Quan tâm** (4 ô: Quản lý sát / Giữ hài lòng / Thông tin đầy đủ / Theo dõi).
4. **Đánh giá mức tham gia** (hiện tại vs mong muốn) cho mỗi bên → ra hành động thu hẹp khoảng cách.
5. Lập **RACI** cho các hạng mục/quyết định chính.
6. Viết `docs/04-stakeholders.md` theo `template.md`.

## Kỹ thuật áp dụng
- **Onion Diagram (nhận diện):** phân lớp stakeholder theo độ gần giải pháp — *lõi* (người trực tiếp dùng) → *hệ thống* (vận hành/hỗ trợ) → *tổ chức* (quản lý, tài trợ) → *ngoài* (cơ quan, đối tác, khách hàng cuối). Giúp lộ nhóm gián tiếp dễ quên.
- **Power/Interest Grid:** xếp 2×2 theo quyền lực × quan tâm → chọn chiến lược tương tác cho từng ô.
- **Stakeholder Engagement Assessment:** chấm mức tham gia hiện tại vs mong muốn (Không biết / Phản đối / Trung lập / Ủng hộ / Dẫn dắt) → khoảng cách = việc cần làm.
- **RACI:** mỗi quyết định chính có đúng **một A** (chịu trách nhiệm cuối), kèm R/C/I.

## Tiêu chí chất lượng (BẮT BUỘC)
- **Mỗi stakeholder** có: ô Power/Interest + mức tham gia (hiện tại/mong muốn) + trace `StR-..`.
- **RACI hợp lệ:** mỗi hàng quyết định có **đúng 1 A** (không thiếu, không nhiều A); có ≥1 R.
- **Không bỏ sót nhóm gián tiếp:** Onion Diagram phủ đủ 4 lớp (hoặc ghi rõ lớp nào không có).

## Lưu ý
- Tiếng Việt. Tài liệu cấp tổng (1 file/dự án), tùy chọn.
- **Văn phong & Thuật ngữ:** mở rộng từ viết tắt ở lần đầu dùng; thêm footer `## Thuật ngữ` cuối `04-stakeholders.md` + bổ sung thuật ngữ mới vào `docs/00-glossary.md` — xem `conventions.md`.
