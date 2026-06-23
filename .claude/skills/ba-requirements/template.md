# Tài liệu yêu cầu — <Tên App>

> Phân loại yêu cầu: Business → Stakeholder → Solution (Functional/Non-functional) → Business Rules → Transition.
> Thuộc tính mỗi yêu cầu: ID · Nguồn · Ưu tiên (MoSCoW) · Trạng thái · Truy vết.
> **Mỗi yêu cầu đạt SMART (IEEE 830):** atomic · unambiguous · testable/measurable · feasible · traceable. NFR luôn kèm số đo.

## 1. Business Need
<Vấn đề/cơ hội kinh doanh cần giải quyết; lý do làm dự án.>

## 2. Business Requirements (BR)
Mục tiêu/kết quả ở cấp tổ chức.

| ID | Yêu cầu nghiệp vụ | Lý do (rationale) | Ưu tiên |
|----|-------------------|-------------------|---------|
| BR-01 | <...> | <...> | Must |

## 3. Stakeholder Requirements (StR)
Nhu cầu của từng nhóm liên quan, trace về BR.

| ID | Nhóm liên quan | Nhu cầu | Trace BR |
|----|----------------|---------|----------|
| StR-01 | <vai trò> | <...> | BR-01 |

## 4. Solution Requirements

### 4.1 Functional (FR) — hệ thống phải làm gì
| ID | Yêu cầu chức năng | Trace StR/BR | Ưu tiên |
|----|-------------------|--------------|---------|
| FR-01 | Hệ thống cho phép <...> | StR-01 | Must |

### 4.2 Non-functional (NFR) — ràng buộc chất lượng (đo được)
| ID | Loại | Yêu cầu | Trace |
|----|------|---------|-------|
| NFR-01 | Hiệu năng | <vd: phản hồi < 2s với 1000 người dùng đồng thời> | BR-01 |
| NFR-02 | Bảo mật | <...> | BR-01 |

## 5. Business Rules (BRule)
Quy tắc/ràng buộc nghiệp vụ — tách riêng khỏi FR vì thay đổi độc lập.

| ID | Quy tắc nghiệp vụ | Trace BR/FR |
|----|-------------------|-------------|
| BRule-01 | <vd: đơn hàng > 10 triệu cần quản lý duyệt> | FR-03, BR-01 |

## 6. Transition Requirements (TR)
Yêu cầu tạm thời để chuyển từ hiện trạng sang giải pháp (di trú dữ liệu, đào tạo, chạy song song). Bỏ trống nếu không có.

| ID | Yêu cầu chuyển đổi | Trace |
|----|--------------------|-------|
| TR-01 | <vd: di trú dữ liệu người dùng cũ> | BR-01 |

## 7. Ràng buộc & Giả định
- **Ràng buộc:** <công nghệ, ngân sách, thời gian, pháp lý>
- **Giả định** (rà & xác nhận theo "Xác nhận giả định" trong `conventions.md`; trạng thái: Đề xuất / Đã xác nhận / Đã sửa / Đã bỏ / ⚠️ chưa xác nhận):

| Mã | Giả định | Vì sao cần (chỗ thiếu) | Ảnh hưởng nếu sai | Trạng thái |
|----|----------|------------------------|-------------------|-----------|
| GĐ-01 | <...> | <...> | <...> | Đề xuất |

## 8. Tiêu chí thành công
<Cách đo lường giải pháp đạt Business Need; gắn về BR.>

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| BR (Business Requirement) | Yêu cầu nghiệp vụ — mục tiêu/kết quả ở cấp tổ chức |
| StR (Stakeholder Requirement) | Yêu cầu của một nhóm liên quan, truy vết về BR |
| FR / NFR | Yêu cầu chức năng / phi chức năng (hệ thống làm gì / ràng buộc chất lượng) |
| BRule (Business Rule) | Quy tắc nghiệp vụ, tách riêng khỏi FR |
| MoSCoW | Cách xếp ưu tiên: Must / Should / Could / Won't |
| SMART | Tiêu chí yêu cầu tốt: cụ thể, đo được, khả thi, liên quan, có mốc |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
