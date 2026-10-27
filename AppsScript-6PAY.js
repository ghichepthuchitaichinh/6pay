/**
 * 6PAY – Danh sách thành viên trong Google Sheet "6PAY THÀNH VIÊN"
 * Dán TOÀN BỘ đoạn này vào Apps Script (Tiện ích mở rộng → Apps Script), thay hết code cũ.
 * Sau đó: Triển khai → Quản lý bản triển khai → bút chì → Phiên bản: Phiên bản mới → Triển khai.
 *
 * Trang tính "ThanhVien": Thời gian | Mã ID | Tên | Số điện thoại | Đồng ý hiển thị tên
 * - App 6PAY gửi đăng ký (register) và hủy thành viên (delete).
 * - Web 6pay.vn chỉ đọc danh sách (Tên + Mã ID). Số điện thoại không bao giờ được trả ra ngoài.
 */

const SHEET_NAME = 'ThanhVien';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Thời gian', 'Mã ID', 'Tên', 'Số điện thoại', 'Đồng ý hiển thị tên']);
    sh.setFrozenRows(1);
  }
  // Luôn giữ cột Mã ID và Số điện thoại ở dạng văn bản (giữ số 0 ở đầu)
  sh.getRange('B:B').setNumberFormat('@');
  sh.getRange('D:D').setNumberFormat('@');
  return sh;
}

function pad_(n) { return ('000000' + n).slice(-6); }

// Chuẩn hóa số điện thoại để so sánh: 0901234567, 901234567, +84901234567 đều thành 901234567
function phoneKey_(p) {
  let s = String(p || '').replace(/\D/g, '');
  if (s.length === 11 && s.indexOf('84') === 0) s = s.slice(2);
  return s.replace(/^0+/, '');
}

// Chuẩn hóa mã ID: 1, "1", "000001" đều thành "000001"
function idKey_(v) {
  const s = String(v || '').replace(/\D/g, '');
  return s ? pad_(Number(s)) : '';
}

// Mỗi dòng kèm số thứ tự hàng trong Sheet (row) để có thể xóa đúng dòng
function rows_() {
  const sh = getSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const out = [];
  sh.getRange(2, 1, n, 5).getValues().forEach(function (r, i) {
    if (String(r[1]) === '' && String(r[3]) === '') return;
    out.push({ row: i + 2, id: idKey_(r[1]), name: String(r[2]).replace(/^'/, ''), phone: phoneKey_(r[3]) });
  });
  return out;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Chặn công thức độc hại khi mở Sheet (tên bắt đầu bằng = + - @)
function clean_(s) {
  s = String(s || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Web gọi GET để lấy danh sách (chỉ Tên + Mã ID)
function doGet() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('list');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  const list = rows_().map(function (m) { return { name: m.name, id: m.id }; });
  const body = JSON.stringify({ ok: true, members: list });
  cache.put('list', body, 60);
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

// App gọi POST để đăng ký (register) hoặc hủy thành viên (delete)
function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { return out_({ error: 'Dữ liệu không hợp lệ.' }); }
  const phone = String(d.phone || '').replace(/\s/g, '');
  if (!/^0\d{9}$/.test(phone)) return out_({ error: 'Số điện thoại gồm 10 số, bắt đầu bằng 0.' });
  const key = phoneKey_(phone);

  if (d.action === 'login') {
    const id = idKey_(d.id);
    const m = rows_().find(function (x) { return x.phone === key && x.id === id; });
    return m ? out_({ member: { name: m.name, id: m.id } })
             : out_({ error: 'Số điện thoại hoặc mã ID không đúng.' });
  }

  if (d.action === 'register') {
    const name = clean_(d.name);
    if (name.replace(/^'/, '').length < 2) return out_({ error: 'Vui lòng nhập tên của bạn.' });
    if (d.consent !== true) return out_({ error: 'Vui lòng đánh dấu đồng ý để đăng ký.' });
    const lock = LockService.getScriptLock();
    lock.waitLock(10000); // tránh 2 người cùng lúc
    try {
      const list = rows_();
      if (list.some(function (x) { return x.phone === key; })) {
        return out_({ error: 'Số điện thoại này đã được đăng ký.' });
      }
      const maxId = list.reduce(function (mx, x) { return Math.max(mx, Number(x.id) || 0); }, 0);
      const id = pad_(maxId + 1);
      // Dấu ' ở đầu buộc Google Sheet lưu dạng văn bản, giữ nguyên số 0
      getSheet_().appendRow([new Date(), "'" + id, name, "'" + phone, 'Có']);
      SpreadsheetApp.flush();
      CacheService.getScriptCache().remove('list');
      return out_({ member: { name: name.replace(/^'/, ''), id: id } });
    } finally {
      lock.releaseLock();
    }
  }

  // Hủy thành viên: phải khớp CẢ số điện thoại VÀ mã ID mới được xóa
  if (d.action === 'delete') {
    const id = idKey_(d.id);
    if (!id) return out_({ error: 'Vui lòng nhập mã ID thành viên.' });
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const hits = rows_().filter(function (x) { return x.phone === key && x.id === id; });
      if (!hits.length) return out_({ error: 'Số điện thoại hoặc mã ID không đúng.' });
      const sh = getSheet_();
      // Xóa từ dưới lên để số hàng không bị lệch
      hits.sort(function (a, b) { return b.row - a.row; }).forEach(function (x) { sh.deleteRow(x.row); });
      SpreadsheetApp.flush();
      CacheService.getScriptCache().remove('list');
      return out_({ ok: true });
    } finally {
      lock.releaseLock();
    }
  }

  return out_({ error: 'Yêu cầu không hợp lệ.' });
}
