# Domain Legacy — Landing page

Landing page tĩnh giới thiệu domain lâu năm, có bộ lọc domain theo nhóm và form thu lead gửi về Google Sheet.

🔗 **Live:** https://nghikc.github.io/LDP/

## Cấu trúc

| File | Vai trò |
|------|---------|
| `index.html` | Nội dung & bố cục trang |
| `styles.css` | Toàn bộ giao diện |
| `script.js` | Lọc domain + xử lý form thu lead |
| `google-apps-script.gs` | Backend nhận lead, ghi vào Google Sheet |
| `assets/` | Hình ảnh & favicon |

## Kết nối form với Google Sheet (bắt buộc để nhận lead)

> Trang chạy trên GitHub Pages (không có server), nên form gửi lead qua một
> Google Apps Script Web App miễn phí. Khi `FORM_ENDPOINT` còn trống, form chạy
> ở **chế độ thử nghiệm** (chỉ lưu tạm trong trình duyệt, bạn KHÔNG nhận được lead).

### Các bước

1. **Tạo Google Sheet** mới. Ở dòng 1, nhập đúng các tiêu đề cột:

   ```
   createdAt | name | email | phone | category | message | source
   ```

2. Trong Sheet, mở **Extensions → Apps Script**. Xoá code mẫu, dán toàn bộ
   nội dung file [`google-apps-script.gs`](google-apps-script.gs).
   - Nếu tab Sheet của bạn không tên `Sheet1`, sửa biến `SHEET_NAME` cho khớp.

3. Bấm **Deploy → New deployment**, chọn type **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone

   Bấm **Deploy**, đồng ý cấp quyền, rồi **copy Web app URL**
   (dạng `https://script.google.com/macros/s/XXXX/exec`).

4. Mở `script.js`, dán URL vào dòng đầu:

   ```js
   const FORM_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```

5. Commit & push. Sau ~1 phút GitHub Pages cập nhật, mỗi lead mới sẽ tự
   thêm một dòng vào Google Sheet.

> Mỗi lần sửa code Apps Script, nhớ **Deploy → Manage deployments → Edit →
> Version: New version** để bản mới có hiệu lực (URL giữ nguyên).

## Tuỳ chỉnh nhanh

- **Tên miền rao bán:** sửa ở **2 chỗ** trong `index.html` — thẻ
  `<h1 class="domain-title">` và thuộc tính `data-domain` của thẻ `<form>`
  (giá trị `data-domain` được ghi vào cột `category` của mỗi lead).
- **Nội dung giới thiệu / điểm bán:** sửa `.lead` và danh sách `.points`
  trong `index.html`.
- **Liên hệ trực tiếp (SĐT/Zalo):** sửa khối `contact-direct` và footer
  trong `index.html` (đang để số `0915 002 721`).

## Chạy thử local

Mở thẳng `index.html` bằng trình duyệt, hoặc:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```
