# Ghi chú dev — Quản lý vị trí tài sản cố định

> Do `dev-run` tạo/cập nhật. Các lần chạy sau đọc file này để biết stack & lệnh, **không hỏi lại**.

## Stack
- **Frontend:** React 18 + Vite 5 + TypeScript 5
- **Test:** Vitest 2 + @testing-library/react (môi trường jsdom)
- **Lint:** ESLint 8 + @typescript-eslint

## Cấu trúc thư mục
```
Quản lý bảo trì/
├── docs/                      # tài liệu BA (không build)
├── index.html
├── package.json · tsconfig.json · vite.config.ts · vitest.setup.ts · .eslintrc.cjs
└── src/
    ├── main.tsx · App.tsx
    └── features/workspace/    # màn S01 — Bản đồ tài sản
        ├── types.ts           # mô hình miền (NutKhuVuc, TaiSan, ViTriPin…)
        ├── Workspace.tsx      # khung màn (dựng dần theo plan)
        └── ...                # component + logic theo plan.md, test colocated *.test.ts(x)
```

## Lệnh
| Việc | Lệnh |
|------|------|
| Chạy test (CI) | `npm test` |
| Test watch | `npm run test:watch` |
| Lint | `npm run lint` |
| Dev server | `npm run dev` |
| Build | `npm run build` |

## Quy ước dev
- TDD Red–Green: mỗi `TC-S..` (Auto) → viết test fail trước → code tối thiểu cho pass.
- UI bám `html-design.html`; logic/nghiệp vụ bám `srs.md` + `BRule-S..`.
- Tài liệu tiếng Việt; tên biến/hàm tiếng Việt không dấu hoặc tiếng Anh nhất quán theo `types.ts`.

## Tiến độ dev theo màn
| Màn | Trạng thái | Ghi chú |
|-----|-----------|---------|
| S01 Workspace | ✅ dev xong | Đã merge `main` (PR #1); 46 test, 24/24 TC Auto Pass |
| S02 Form khu vực | ✅ dev xong | Đã merge `main` (PR #2); 34 test, 26/26 TC Auto Pass |
| S04 Di dời tài sản | ✅ dev xong | Đã merge `main` (PR #3); 25 test, 16/16 TC Auto Pass |
| S06 Lịch sử di chuyển | ✅ dev xong | Nhánh `feature/qlvt-s06-s07-lichsu-audit`; 16 test, 16/16 TC Auto Pass |
| S07 Nhật ký kiểm toán | ✅ dev xong | Cùng nhánh S06; 27 test, 21/21 TC Auto Pass; tổng dự án 148 test xanh |
