---
name: ba-portal
description: Use when cần xuất toàn bộ tài liệu trong docs/ thành một cổng HTML đọc được (sidebar điều hướng + mục lục) để xem hoặc chia sẻ stakeholder; sinh docs/portal.html tự chứa, mở offline.
---

# ba-portal — Cổng tài liệu HTML

## Mục tiêu
Gom các `.md` **do BA toolkit sinh** trong `docs/` thành một file `docs/portal.html` **tự chứa** (offline, không phụ thuộc internet hay package): sidebar điều hướng theo cây docs + nội dung render + scrollspy. **Responsive:** trên màn hình nhỏ (≤768px) sidebar tự ẩn thành drawer, có nút hamburger ở header để mở/đóng menu.

> **Chỉ gom tài liệu của toolkit:** mặc định portal chỉ lấy các file `00..08-*.md` ở cấp đầu `docs/` và 9 file chuẩn trong folder mỗi màn (`ascii-screen`, `brainstorm`, `srs`, `usecase`, `userstory`, `design-spec`, `html-design.html`, `test`, `plan`). Folder lạ do skill khác tạo (vd `docs/superpowers/`, `docs/session-notes/`) **bị bỏ qua** — báo số file đã bỏ qua khi chạy. Cần gom hết thì thêm cờ `--all`.

## Cách dùng
Chạy script Node (zero-dependency):
```
node .claude/skills/ba-portal/build.js docs docs/portal.html
```
- Tham số 1: thư mục docs (mặc định `docs`).
- Tham số 2: file output (mặc định `docs/portal.html`).
- Cờ `--all` (tùy chọn): tắt lọc, gom **mọi** `.md`/`.html` kể cả folder lạ.

Mở `docs/portal.html` bằng trình duyệt để đọc.

### Đổi 1 file `.md` → 1 HTML sạch (không khung portal)
```
node .claude/skills/ba-portal/build.js --single <file.md> [out.html]
```
- `--single <file.md>`: render đúng 1 file thành trang HTML độc lập (article căn giữa, **không** sidebar/scrollspy).
- Tham số output (tùy chọn): mặc định cùng tên đổi đuôi `.html` (vd `srs.md` → `srs.html`).
- Vẫn render đầy đủ: bảng, code/ASCII, list, ảnh nhúng base64, Mermaid offline (vendored).

## Khi nào chạy
- Sau khi sinh/cập nhật tài liệu (cuối `ba-init`, hoặc khi cần bản đọc để chia sẻ).
- Chạy lại bất cứ lúc nào để làm mới (ghi đè `portal.html`).

## Lưu ý
- Script render đúng: heading, bảng GFM, code/ASCII (giữ nguyên trong `<pre>`), danh sách & checkbox, link, **ảnh** `![alt](src)`, blockquote.
- **Ảnh nhúng base64:** ảnh local (`<img src>` / `![]()` trỏ file tương đối hoặc tuyệt đối) được đọc và nhúng thành `data:<mime>;base64,...` ngay trong HTML → file **tự chứa**, gửi lẻ vẫn thấy ảnh. Ảnh `http(s)`/`data:` giữ nguyên; ảnh không tìm thấy giữ nguyên `src`.
- **Sơ đồ/chart Mermaid OFFLINE:** khối ```mermaid``` render thành hình bằng thư viện **vendored** `vendor/mermaid.min.js` (inline thẳng vào HTML, **không cần internet**). Chỉ inline khi HTML thực sự có sơ đồ (tránh phình file ~3.3MB). Thiếu file vendor → fallback CDN (cần internet).
- Chỉ cần Node, không cần `npm install`.
- Tự bỏ qua `portal.html` khi quét (không nhúng chính nó).
- Mặc định **chỉ gom tài liệu BA toolkit**, bỏ qua folder lạ (vd `superpowers/`, `session-notes/`); dùng `--all` để gom hết. Báo số file bỏ qua trên console.
- **Mobile:** ≤768px sidebar ẩn thành drawer trượt từ trái; nút hamburger (☰) ở header mở/đóng, chạm nền tối hoặc phím `Esc` để đóng; chọn một mục thì menu tự đóng.
