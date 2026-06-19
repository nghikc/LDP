/**
 * Google Apps Script — nhận lead từ landing page và ghi vào Google Sheet.
 *
 * CÁCH DÙNG (xem README.md để có hình từng bước):
 * 1. Tạo Google Sheet mới, đặt tên cột ở dòng 1:
 *    createdAt | name | email | phone | category | message | source
 * 2. Trong Sheet: Extensions → Apps Script, xoá code mẫu, dán toàn bộ file này.
 * 3. Sửa SHEET_NAME nếu tab của bạn không tên "Trang tính1"/"Sheet1".
 * 4. Deploy → New deployment → type "Web app":
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Bấm Deploy, copy "Web app URL".
 * 5. Dán URL đó vào biến FORM_ENDPOINT ở đầu file script.js.
 */

const SHEET_NAME = "Sheet1"; // đổi nếu tab Sheet của bạn tên khác

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.category || "",
      data.message || "",
      data.source || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
