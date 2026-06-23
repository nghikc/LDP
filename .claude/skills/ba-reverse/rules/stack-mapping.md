# Rule: Bản đồ artifact theo stack

Dùng ở bước Recon để tìm đúng nơi chứa từng loại artifact. Phát hiện stack qua file manifest rồi tra bảng.

## Phát hiện stack
- `package.json` → Node/JS (xem dependencies: next, react, express, @nestjs...)
- `requirements.txt` / `pyproject.toml` → Python (django, flask, fastapi)
- `Gemfile` → Ruby on Rails
- `composer.json` → PHP (Laravel)
- `pom.xml` / `build.gradle` → Java (Spring)
- `go.mod` → Go

## Nơi chứa artifact theo framework
| Framework | Màn hình / Routes | Mô hình dữ liệu | API |
|-----------|-------------------|-----------------|-----|
| Next.js | `app/`, `pages/` | `prisma/schema.prisma`, `models/` | `app/api/`, `pages/api/` |
| React (SPA) | `src/pages`, `src/routes`, cấu hình router | gọi qua `src/api` (suy từ backend) | backend riêng |
| Express / Nest | — (thuần API) | `models/`, ORM entities | `routes/`, controllers |
| Django | `urls.py` + templates | `models.py` | `views.py`, DRF serializers |
| Rails | `config/routes.rb` + views | `app/models` | controllers |
| Laravel | `routes/web.php` + Blade | `app/Models`, `database/migrations` | `routes/api.php` |
| Spring | `@Controller` | lớp `@Entity` | `@RestController` |

Không khớp bảng → suy luận từ cấu trúc thư mục + tên file; ghi nhận giả định đã dùng.

## Gợi ý map sang tài liệu
- Mỗi route/page → 1 màn hình (`S..`) trong overview.
- Mỗi ORM model → 1 thực thể trong data-model.
- Mỗi route handler → 1 endpoint trong api-spec.
- Mỗi nhóm route/module → 1 chức năng (`F..`).
