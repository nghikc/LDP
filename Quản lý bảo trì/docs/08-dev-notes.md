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
| S07 Nhật ký kiểm toán | ✅ dev xong | Đã merge `main` (PR #4); 27 test, 21/21 TC Auto Pass |
| S03 Quản lý ảnh sơ đồ | ✅ dev xong | Nhánh `feature/qlvt-s03-s05-s08`; 44 test, 22/22 TC Auto Pass |
| S05 Pin cần đặt lại | ✅ dev xong | Cùng nhánh; 23 test, 15/15 TC Auto Pass |
| S08 Xuất báo cáo | ✅ dev xong | Cùng nhánh; 33 test, 19/19 TC Auto Pass. **Toàn bộ 8/8 màn dev xong.** |

## Tích hợp S01 ↔ vệ tinh (2026-06-23)
`useWorkspace` là store trung tâm (nodes/pins/auditLog/lichSu + handlers). S01 Workspace mở 7 màn vệ tinh:
- Cây: menu ⋮ (Thêm con/Sửa → **S02**, Quản lý ảnh → **S03**, Xóa); "+ Thêm khu vực" → S02
- Popup pin: "Di dời" → **S04** (đơn), "Xem lịch sử" → **S06**
- Thanh công cụ: "Di dời hàng loạt" → **S04** (lô), "Xuất báo cáo" → **S08**
- Header: "Nhật ký kiểm toán" → **S07** (chỉ Quản trị)
- Dải cảnh báo "N pin cần đặt lại" → **S05**
Di dời sinh lịch sử (hiện ở S06) + nhật ký (hiện ở S07). **257 test xanh** (9 integration test mới).
