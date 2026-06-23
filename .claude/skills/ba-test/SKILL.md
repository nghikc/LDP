---
name: ba-test
description: Use when cần tài liệu kiểm thử cho một màn hình theo từng chức năng, dựa trên srs và usecase; bước 6 của BA toolkit, sinh test.md trong folder màn hình.
---

# ba-test — Tài liệu kiểm thử 1 màn hình

## Mục tiêu
Cho một màn hình, sinh `docs/<Nhóm>/<Màn>/test.md` — bộ test case theo từng chức năng, **thiết kế có hệ thống** (kỹ thuật chuẩn) và **phân theo rủi ro**.

## Quy trình
1. Đọc `conventions.md` của `ba-toolkit`, cùng `srs.md` và `usecase.md` của màn hình.
2. **Đánh giá Risk Level** từng yêu cầu/chức năng: **Cao** (liên quan tiền/bảo mật/phân quyền/mất dữ liệu) → test sâu, nhiều ca biên & ngoại lệ; **Trung bình** → vừa phải; **Thấp** (hiển thị thuần) → ca cơ bản.
3. **Áp dụng kỹ thuật thiết kế test case** để suy ca có hệ thống (không tuỳ hứng), chọn kỹ thuật theo bản chất input/luật:
   - **Equivalence Partitioning (EP):** chia input thành nhóm tương đương, test 1 đại diện mỗi nhóm.
   - **Boundary Value Analysis (BVA):** test biên — min, min+1, max-1, max (vd max 255 → nhập 255 và 256 ký tự).
   - **Decision Table (DT):** logic nhiều điều kiện → liệt kê tổ hợp điều kiện → kết quả.
   - **State Transition (ST):** workflow/trạng thái → test chuyển hợp lệ + không hợp lệ.
4. Với **mỗi acceptance criterion (GWT), mỗi `R-S..`, mỗi luồng use case** (gồm ngoại lệ) → ≥1 test case theo `template.md`. Mỗi TC ghi: mã `TC-S0x-..`, **Loại** (Positive/Negative/Edge), **Kỹ thuật** (EP/BVA/DT/ST), **Nguồn** (R-S/GWT/UC), **Risk**, **Priority** (Critical/High/Medium/Low), **Test Data cụ thể**, kết quả mong đợi, **Cách chạy** (Manual/Auto), **Trạng thái** (mặc định `Chưa chạy`).
5. Thêm **bảng roll-up** ở đầu file: tổng số TC, đếm theo Pass/Fail/Blocked/Skip/Chưa chạy, % Pass, lần chạy cuối.
6. Cập nhật ô `test` của màn trong `docs/00-tracking.md` = ✅ và cột "Cập nhật cuối".

## Theo dõi thực thi (manual & automation)
- Mỗi TC có **Trạng thái**: `Chưa chạy` / `Pass` / `Fail` / `Blocked` / `Skip` — khi soạn tài liệu để mặc định `Chưa chạy`.
- **Cách chạy**: `Manual` hay `Auto` (gợi ý: ca lặp/ổn định → Auto; ca cần quan sát mắt/khó tự động → Manual).
- Khi **chạy test** (thủ công hoặc automation), cập nhật cột Trạng thái từng TC và bảng roll-up để biết ca nào đã pass/fail — `test.md` đóng vai trò luôn là bảng theo dõi kết quả.
- **Reset khi thay đổi (BẮT BUỘC):** TC bị sửa nội dung (bước/test data/kết quả mong đợi) do change request hoặc cập nhật yêu cầu → đặt lại Trạng thái = `Chưa chạy` (kết quả Pass cũ không còn giá trị); cập nhật lại roll-up.

## Quy tắc Test Data (BẮT BUỘC)
Cấm placeholder chung chung — phải ghi **giá trị cụ thể**:
- ❌ "nhập email sai" → ✅ "nhập `abc@`" (thiếu domain)
- ❌ "vượt giới hạn" → ✅ "nhập 256 ký tự vào Tên (max 255)"
- ❌ "mật khẩu yếu" → ✅ "nhập `12345`"

## Lưu ý
- Phủ đủ Positive · Negative · Edge; **độ sâu theo Risk Level** (rủi ro cao → nhiều ca hơn).
- Mỗi TC truy được về acceptance criterion / yêu cầu nguồn.
- Các bước test ghi rõ thao tác (nhập gì, ở đâu) — không mơ hồ.
- Tiếng Việt. Một màn hình mỗi lần.
- **Văn phong & Thuật ngữ:** thêm footer `## Thuật ngữ` cuối `test.md` (giải nghĩa EP/BVA/DT/ST, Risk, Priority…) + bổ sung thuật ngữ mới vào `docs/00-glossary.md` — xem `conventions.md`.
