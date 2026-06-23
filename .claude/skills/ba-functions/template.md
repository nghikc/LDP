# Danh sách chức năng — <Tên App>

> Mỗi chức năng decompose từ Solution Functional Requirement (FR) bằng **Functional Decomposition** và trace ngược về Business Requirement (BR).
> Ưu tiên dùng MoSCoW (Must/Should/Could/Won't). Cột **Kỹ thuật** ghi cách suy ra chức năng (FD / CRUD).

## Module: <Tên module>

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F01 | <tên> | <mô tả ngắn> | FD | FR-01, BR-01 | Must | <stakeholder> | Đề xuất |
| F02 | <tên> | <mô tả ngắn> | CRUD | FR-02 | Should | <stakeholder> | Đề xuất |

## Module: <Tên module khác>

| Mã | Chức năng | Mô tả | Kỹ thuật | Trace FR/BR | Ưu tiên | Nguồn | Trạng thái |
|----|-----------|-------|----------|-------------|---------|-------|-----------|
| F03 | <tên> | <mô tả ngắn> | FD | FR-03, BR-02 | Must | <stakeholder> | Đề xuất |

## Ma trận CRUD (soát độ phủ chức năng)

> Đảm bảo mỗi thực thể nghiệp vụ chính được phủ đủ Create / Read / Update / Delete. Ô trống = lỗ hổng cần giải thích.

| Thực thể \ Thao tác | Create | Read/List | Update | Delete |
|---|---|---|---|---|
| <Thực thể A> | F01 | F04 | F02 | F03 |
| <Thực thể B> | F05 | F06 | — (luật: không cho sửa) | — (luật: không cho xoá) |

## Thuật ngữ
| Thuật ngữ | Giải thích |
|-----------|-----------|
| F (Function) | Mã chức năng (F01…), truy vết về FR/BR |
| FD (Functional Decomposition) | Phân rã chức năng top-down từ yêu cầu lớn xuống chức năng lá |
| CRUD | Bốn thao tác dữ liệu: Create / Read / Update / Delete |
| MoSCoW | Cách xếp ưu tiên: Must / Should / Could / Won't |

> Từ điển đầy đủ toàn dự án: `docs/00-glossary.md`.
