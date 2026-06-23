---
name: ba-data-model
description: Use when cần thiết kế mô hình dữ liệu cho hệ thống — sơ đồ thực thể (ERD), từ điển dữ liệu và quan hệ; tài liệu cấp tổng, dựa trên chức năng và yêu cầu màn hình.
---

# ba-data-model — Mô hình dữ liệu hệ thống

## Mục tiêu
Sinh `docs/05-data-model.md`: danh sách thực thể, sơ đồ quan hệ (ERD), từ điển dữ liệu.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit`, `docs/02-functions.md`, và các `srs.md` (mục Yêu cầu dữ liệu) để rút thực thể + thuộc tính.
2. Xác định thực thể, thuộc tính, khoá chính/ngoại, quan hệ (1-1, 1-n, n-n) — áp dụng kỹ thuật bên dưới.
3. **Chuẩn hoá tới 3NF**: tách bảng để loại dữ liệu lặp/phụ thuộc bắc cầu.
4. Vẽ ERD bằng Mermaid `erDiagram`; viết từ điển dữ liệu (mỗi thực thể 1 bảng: thuộc tính, kiểu, ràng buộc, mô tả).
5. Lập **CRUD Matrix** (thực thể × chức năng) để soát thực thể mồ côi / chức năng không có nơi lưu.
6. Viết `docs/05-data-model.md` theo `template.md`.

## Kỹ thuật áp dụng
- **Entity-Relationship Modeling:** xác định thực thể (danh từ nghiệp vụ), thuộc tính, PK/FK, và quan hệ với *cardinality + optionality* (1-1 / 1-n / n-n; bắt buộc/tuỳ chọn). Quan hệ n-n phải tách qua bảng trung gian.
- **Normalization tới 3NF:** 1NF (giá trị nguyên tử, không nhóm lặp) → 2NF (không phụ thuộc một phần khoá tổ hợp) → 3NF (không phụ thuộc bắc cầu). Phi chuẩn hoá có chủ đích phải ghi rõ lý do (vd vì hiệu năng đọc).
- **CRUD Matrix (Entity × Function):** đối chiếu mỗi thực thể với các chức năng `F..` thao tác lên nó để phát hiện thực thể không ai dùng hoặc chức năng thiếu chỗ lưu.

## Tiêu chí chất lượng (BẮT BUỘC)
- **Đạt ≥ 3NF**, hoặc ghi rõ chỗ cố ý phi chuẩn hoá + lý do.
- **Không thực thể mồ côi:** mỗi thực thể trace về ≥1 `F..`; mỗi thực thể có PK; quan hệ ghi đủ cardinality; n-n đã tách bảng nối.
- **Khoá ngoại nhất quán:** mọi FK trỏ tới PK tồn tại; kiểu dữ liệu khớp.
- Mô hình ở mức khái niệm/logic (kiểu tổng quát), không ràng buộc DBMS cụ thể.

## Lưu ý
- Tiếng Việt. Tài liệu cấp tổng, tùy chọn.
- **Văn phong & Thuật ngữ:** mở rộng từ viết tắt ở lần đầu dùng; thêm footer `## Thuật ngữ` cuối `05-data-model.md` + bổ sung thuật ngữ mới vào `docs/00-glossary.md` — xem `conventions.md`.
