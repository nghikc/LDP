# Ma trận truy vết tài liệu — Quản lý vị trí tài sản cố định

Trạng thái: ✅ xong · ⬜ chưa làm · ⚠️ cần cập nhật
Một dòng = một màn hình. Màn phục vụ nhiều chức năng → cột "Mã CN" liệt kê nhiều mã (`F04, F05`); nhóm 1 màn → cột "Nhóm" để `—`.
Cột `dev` = trạng thái code của màn (do `dev-run` quản: ⚠️ đang dev, ✅ dev xong); không map ra file tài liệu.

| Mã CN | Chức năng | Nhóm | Màn hình | Folder | ascii | brainstorm | srs | usecase | userstory | design-spec | html | test | plan | dev | Trạng thái | Cập nhật cuối |
|-------|-----------|------|----------|--------|-------|------------|-----|---------|-----------|-------------|------|------|------|-----|-----------|---------------|
| F04, F05, F09, F10, F11, F14, F16, F03 | Bản đồ tài sản (Workspace) | BanDoTaiSan | Workspace | `docs/BanDoTaiSan/Workspace/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Dev xong (24 TC Auto Pass) | 2026-06-23 |
| F01, F02 | Form khu vực (Tạo/Sửa nút) | BanDoTaiSan | FormKhuVuc | `docs/BanDoTaiSan/FormKhuVuc/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Dev xong (26 TC Auto Pass) | 2026-06-23 |
| F06, F07, F08 | Quản lý ảnh sơ đồ mặt bằng | BanDoTaiSan | QuanLySoDo | `docs/BanDoTaiSan/QuanLySoDo/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | Sẵn sàng dev | 2026-06-23 |
| F12, F13 | Di dời tài sản | BanDoTaiSan | DiDoiTaiSan | `docs/BanDoTaiSan/DiDoiTaiSan/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Dev xong (16 TC Auto Pass) | 2026-06-23 |
| F15 | Danh sách pin cần đặt lại | BanDoTaiSan | PinCanDatLai | `docs/BanDoTaiSan/PinCanDatLai/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | Sẵn sàng dev | 2026-06-23 |
| F17 | Lịch sử di chuyển tài sản | LichSu | LichSuDiChuyen | `docs/LichSu/LichSuDiChuyen/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | Sẵn sàng dev | 2026-06-23 |
| F19 | Nhật ký kiểm toán | LichSu | NhatKyKiemToan | `docs/LichSu/NhatKyKiemToan/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | Sẵn sàng dev | 2026-06-23 |
| F20 | Xuất báo cáo / kiểm kê | — | XuatBaoCao | `docs/XuatBaoCao/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | Sẵn sàng dev | 2026-06-23 |

> **Chức năng nền không gắn màn:** F18 (ghi audit tự động), F21 (phân quyền), F22 (khóa khi đang sửa) — thực thi xuyên suốt, không có dòng màn riêng.
