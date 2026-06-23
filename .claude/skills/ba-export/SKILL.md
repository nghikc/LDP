---
name: ba-export
description: Use when cần cài/import bộ BA toolkit (toàn bộ skill ba-* + dev-* + file hướng dẫn) từ repo này sang một dự án khác; chạy script install.js zero-dependency, copy vào .claude/skills của dự án đích.
---

# ba-export — Cài BA toolkit sang dự án khác

## Mục tiêu
Copy **trọn vẹn bộ skill** từ repo toolkit này sang một dự án khác để dùng được cả pipeline BA lẫn khâu dev:
- **`ba-*`** (23 skill) — pipeline phân tích nghiệp vụ, kèm `conventions.md`, `build.js`, templates/rules.
- **`dev-*`** (11 skill) — framework dev/QA (clone superpowers + orchestrator `dev-run`), để dự án đích chạy được khâu code từ `plan.md` mà không cần cài plugin superpowers.
- File hướng dẫn (README, GUIDELINE).

## Cách dùng
Skill này có thể đặt **toàn cục** (`~/.claude/skills/ba-export`) để mọi dự án gọi được.
Khi đó script đọc đường dẫn repo nguồn từ `ba-source.txt` (ghi lúc cài global).
Nếu chạy ngay trong repo toolkit, nó tự định vị nguồn = repo chứa nó.

Đứng trong **dự án đích** và chạy (bản global):
```
node "$HOME/.claude/skills/ba-export/install.js"
```
Hoặc trỏ thẳng tới repo nguồn:
```
node "<đường-dẫn-tuyệt-đối>/BA_toolkit_v3.0/.claude/skills/ba-export/install.js"
```
Tham số tùy chọn:
- `--to <đích>` — thư mục dự án đích (mặc định = thư mục hiện tại).
- `--from <nguồn>` — repo BA toolkit nguồn (mặc định: repo cạnh script → `ba-source.txt`).
- `--dry` — chỉ in danh sách sẽ copy, không ghi gì (xem trước).
- `--prune` — xoá skill `ba-*`/`dev-*` **thừa** ở đích (có ở đích nhưng không còn ở nguồn, vd skill đã đổi tên/gỡ). Mặc định chỉ cảnh báo, không xoá.

> ⚠️ Nếu di chuyển/đổi tên repo BA_toolkit gốc, sửa lại đường dẫn trong
> `~/.claude/skills/ba-export/ba-source.txt` cho khớp.

## Sẽ copy (ghi đè)
- Mọi `.claude/skills/ba-*` **và** `.claude/skills/dev-*` → `<đích>/.claude/skills/` (34 skill: 23 `ba-*` + 11 `dev-*`).
- `README.md` → `<đích>/BA-TOOLKIT-README.md`.
- `example/GUIDELINE.md` → `<đích>/BA-TOOLKIT-GUIDELINE.md`.
- File hướng dẫn được thêm banner đầu file (báo đã import; thư mục `example/` không kèm theo).

## Lưu ý
- **Ghi đè** skill `ba-*`/`dev-*` trùng tên ở đích (luôn cập nhật bản mới nhất).
- Skill thừa ở đích (đổi tên/gỡ ở nguồn) **không tự xoá** — script liệt kê và gợi ý `--prune` để dọn cho sạch.
- Từ chối nếu đích trùng nguồn (không tự cài đè chính mình).
- KHÔNG copy thư mục `example/` → các link `example/...` trong guideline chỉ có ở repo gốc.
- Chỉ cần Node (≥16.7 cho `fs.cpSync`), không cần `npm install`.
- Sau khi chạy: **khởi động lại Claude Code** trong dự án đích để nạp skill.
