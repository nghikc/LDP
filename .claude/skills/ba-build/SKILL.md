---
name: ba-build
description: Use when tài liệu BA của các màn hình đã đủ và cần lập kế hoạch triển khai code cho từng chức năng; bước 7 của BA toolkit, sinh plan.md trong mỗi folder màn hình rồi bàn giao superpowers.
---

# ba-build — Kế hoạch build theo từng chức năng

## Mục tiêu
Với mỗi folder màn hình đã có tài liệu, sinh `plan.md` (kế hoạch triển khai phạm vi 1 chức năng). Không tự chạy code.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit` và `docs/00-tracking.md` để biết màn hình nào đã đủ tài liệu (srs/usecase/test/html = ✅).
2. Với mỗi màn đủ điều kiện: đọc `srs.md`, `usecase.md`, `test.md`, `html-design.html`, rồi viết `docs/<Nhóm>/<Màn>/plan.md` theo `plan-template.md`. REQUIRED BACKGROUND: nội dung plan tuân theo dev-writing-plans (task bite-sized, TDD, có file path, commit).
3. Cập nhật ô `plan` của màn trong `docs/00-tracking.md` = ✅.
4. **Dừng tại đây.** Báo người dùng danh sách plan đã sinh; họ chủ động chạy khâu dev bằng `dev-run <màn>` (orchestrator dùng dev-executing-plans / dev-subagent-driven-development bên trong).

## Kỹ thuật áp dụng
- **Vertical Slice:** chia task theo *lát cắt dọc chạy được* (đi xuyên từ UI → logic → dữ liệu cho một mẩu chức năng nhỏ), không cắt theo tầng kỹ thuật (tránh "task làm hết UI", "task làm hết API"). Mỗi slice giao được giá trị quan sát được.
- **Test-Driven Development (TDD):** mỗi task viết test thất bại trước (lấy từ `TC-S0x-..` trong `test.md`) → code tối thiểu cho pass → commit.
- **Dependency-ordered Sequencing:** xếp task theo thứ tự phụ thuộc (nền tảng/dữ liệu trước, UI phụ thuộc sau); ghi rõ task nào chặn task nào.
- **Definition of Done (DoD):** mỗi task có tiêu chí hoàn thành đo được (test pass, trace về TC nguồn, không lỗi lint…).

## Tiêu chí chất lượng (BẮT BUỘC)
- Mỗi task là **vertical slice test được độc lập**, có DoD rõ; cấm task mơ hồ không kiểm chứng được.
- Mỗi task **trace về ≥1 test case** trong `test.md`; mọi TC quan trọng đều có task phủ.
- Task xếp **đúng thứ tự phụ thuộc**; nêu rõ ràng buộc trước/sau.

## Lưu ý
- Mỗi plan độc lập, triển khai được riêng để quản lý theo từng chức năng.
- Test case trong `test.md` là nguồn cho bước test của plan (TDD).
