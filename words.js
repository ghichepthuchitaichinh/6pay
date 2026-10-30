/* 6PAY - Game học từ vựng tiếng Anh. File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
})();
(function () {
  if (window.SixDayGame) return;

  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var TF = '-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  var GAME_SECONDS = 120, REWARD = 10000, PENALTY = 5000;
  var DAY_SEC_PER_WORD = 5.6;   // Một ngày của bé: thời gian mỗi từ (giây). Muốn gấp hơn thì giảm số này, muốn thoải mái hơn thì tăng.
  var SPEED = 0.7;              // tốc độ rơi (chế độ theo chủ đề)
  try { var _sp = parseFloat(localStorage.getItem('wg_speed')); if (_sp >= 0.3 && _sp <= 1.5) SPEED = _sp; } catch (e) {}

  /* ================= HÌNH MINH HOẠ TỰ VẼ (SVG) ================= */
  var SV = {
    pillow: '<rect x="6" y="16" width="52" height="32" rx="12" fill="#cfe3ff" stroke="#6b8fd6" stroke-width="3"/><path d="M14 26q18 8 36 0" fill="none" stroke="#6b8fd6" stroke-width="2"/>',
    blanket: '<rect x="6" y="14" width="52" height="36" rx="6" fill="#ffb4c8" stroke="#d6577f" stroke-width="3"/><path d="M6 26h52M6 38h52" stroke="#d6577f" stroke-width="2"/>',
    toothpaste: '<rect x="8" y="24" width="36" height="16" rx="4" fill="#4aa8ff" stroke="#1f6fc2" stroke-width="3"/><rect x="44" y="28" width="10" height="8" fill="#fff" stroke="#1f6fc2" stroke-width="3"/><path d="M14 32h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    towel: '<rect x="14" y="8" width="36" height="48" rx="4" fill="#7fe0c8" stroke="#2a9d8f" stroke-width="3"/><path d="M14 44h36M14 50h36" stroke="#2a9d8f" stroke-width="2"/>',
    comb: '<rect x="6" y="14" width="52" height="12" rx="4" fill="#ffd54a" stroke="#c99a00" stroke-width="3"/><path d="M12 26v20M20 26v20M28 26v20M36 26v20M44 26v20M52 26v20" stroke="#c99a00" stroke-width="3" stroke-linecap="round"/>',
    eraser: '<rect x="8" y="22" width="48" height="22" rx="4" fill="#ff9aa8" stroke="#d6577f" stroke-width="3"/><rect x="8" y="22" width="18" height="22" rx="4" fill="#6aa7ff" stroke="#1f6fc2" stroke-width="3"/>',
    glue: '<rect x="20" y="22" width="24" height="34" rx="5" fill="#fff" stroke="#555" stroke-width="3"/><path d="M26 22l3-12h6l3 12" fill="#ff8a3d" stroke="#555" stroke-width="3"/><rect x="23" y="32" width="18" height="12" fill="#ffd54a"/>',
    pajamas: '<path d="M20 8l-14 12 8 8 6-4v32h28V24l6 4 8-8-14-12q-6 6-12 0z" fill="#b39dff" stroke="#6a4fd6" stroke-width="3"/><path d="M20 36h24M20 46h24" stroke="#fff" stroke-width="3"/>',
    tissue: '<rect x="8" y="30" width="48" height="26" rx="4" fill="#9fe0ff" stroke="#2a8fc2" stroke-width="3"/><path d="M24 30c0-14 8-20 8-20s8 6 8 20" fill="#fff" stroke="#999" stroke-width="2"/>',
    blackboard: '<rect x="4" y="10" width="56" height="38" rx="3" fill="#1f6f4a" stroke="#8b5a2b" stroke-width="4"/><path d="M12 22h26M12 32h18" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="38" y="50" width="16" height="5" fill="#fff" stroke="#999"/>',
    /* hình khối */
    sh_circle: '<circle cx="32" cy="32" r="24" fill="#3b82f6"/>',
    sh_square: '<rect x="10" y="10" width="44" height="44" fill="#ef4444"/>',
    sh_rectangle: '<rect x="4" y="16" width="56" height="32" fill="#22c55e"/>',
    sh_triangle: '<polygon points="32,8 58,54 6,54" fill="#f59e0b"/>',
    sh_oval: '<ellipse cx="32" cy="32" rx="27" ry="16" fill="#a855f7"/>',
    sh_diamond: '<polygon points="32,5 59,32 32,59 5,32" fill="#06b6d4"/>',
    sh_pentagon: '<polygon points="32,6 58,25 48,56 16,56 6,25" fill="#ec4899"/>',
    sh_hexagon: '<polygon points="18,8 46,8 60,32 46,56 18,56 4,32" fill="#14b8a6"/>',
    sh_octagon: '<polygon points="20,6 44,6 58,20 58,44 44,58 20,58 6,44 6,20" fill="#dc2626"/>',
    sh_cross: '<path d="M24 6h16v18h18v16H40v18H24V40H6V24h18z" fill="#16a34a"/>',
    sh_cube: '<polygon points="32,6 56,18 32,30 8,18" fill="#93c5fd"/><polygon points="8,18 32,30 32,58 8,46" fill="#3b82f6"/><polygon points="56,18 32,30 32,58 56,46" fill="#1d4ed8"/>',
    sh_sphere: '<defs><radialGradient id="g" cx=".35" cy=".35"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#3b82f6"/></radialGradient></defs><circle cx="32" cy="32" r="25" fill="url(#g)"/>',
    sh_cylinder: '<path d="M10 14v34a22 8 0 0 0 44 0V14z" fill="#f59e0b"/><ellipse cx="32" cy="14" rx="22" ry="8" fill="#fcd34d"/>',
    sh_cone: '<polygon points="32,6 56,50 8,50" fill="#fb923c"/><ellipse cx="32" cy="50" rx="24" ry="8" fill="#ea580c"/>',
    sh_pyramid: '<polygon points="32,6 58,52 6,52" fill="#fbbf24"/><polygon points="32,6 58,52 32,52" fill="#d97706"/>',
    wardrobe: '<rect x="10" y="4" width="44" height="54" rx="3" fill="#c98b4f" stroke="#7a4b1f" stroke-width="3"/><path d="M32 4v54" stroke="#7a4b1f" stroke-width="3"/><circle cx="28" cy="30" r="2.5" fill="#fde68a"/><circle cx="36" cy="30" r="2.5" fill="#fde68a"/><path d="M14 58v4M50 58v4" stroke="#7a4b1f" stroke-width="3"/>',
    fan: '<path d="M32 36v18M20 58h24" stroke="#64748b" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="24" r="20" fill="#e0f2fe" stroke="#64748b" stroke-width="3"/><path d="M32 24c-2-10 6-14 9-9s-5 9-9 9zm0 0c9 4 8 13 2 13s-4-9-2-13zm0 0c-8 6-16 1-13-4s11-1 13 4z" fill="#38bdf8"/><circle cx="32" cy="24" r="3" fill="#0369a1"/>',
    aircon: '<rect x="4" y="14" width="56" height="22" rx="6" fill="#fff" stroke="#64748b" stroke-width="3"/><path d="M10 30h44" stroke="#94a3b8" stroke-width="2"/><circle cx="52" cy="21" r="2" fill="#22c55e"/><path d="M18 42q-3 5 0 10M32 42q-3 5 0 10M46 42q-3 5 0 10" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>',
    curtain: '<path d="M4 8h56" stroke="#7a4b1f" stroke-width="4" stroke-linecap="round"/><path d="M8 10h20q-6 20 4 48H8z" fill="#f472b6" stroke="#be185d" stroke-width="2"/><path d="M56 10H36q6 20-4 48h24z" fill="#f472b6" stroke="#be185d" stroke-width="2"/><path d="M14 12v44M50 12v44" stroke="#be185d" stroke-width="1.5" opacity=".6"/>',
    table: '<rect x="4" y="20" width="56" height="8" rx="2" fill="#c98b4f" stroke="#7a4b1f" stroke-width="3"/><path d="M10 28v28M54 28v28" stroke="#7a4b1f" stroke-width="5" stroke-linecap="round"/>',
    desk: '<rect x="4" y="26" width="56" height="7" rx="2" fill="#c98b4f" stroke="#7a4b1f" stroke-width="3"/><rect x="36" y="33" width="20" height="22" fill="#d9a066" stroke="#7a4b1f" stroke-width="3"/><path d="M40 44h12" stroke="#7a4b1f" stroke-width="2"/><path d="M9 33v24" stroke="#7a4b1f" stroke-width="5" stroke-linecap="round"/><path d="M16 26V12l8-4" stroke="#334155" stroke-width="3" fill="none"/><path d="M20 4l10 6-6 6z" fill="#facc15" stroke="#334155" stroke-width="2"/>',
    bookshelf: '<rect x="8" y="4" width="48" height="56" rx="2" fill="#d9a066" stroke="#7a4b1f" stroke-width="3"/><path d="M8 22h48M8 40h48" stroke="#7a4b1f" stroke-width="3"/><rect x="12" y="8" width="6" height="14" fill="#ef4444"/><rect x="19" y="10" width="6" height="12" fill="#3b82f6"/><rect x="26" y="8" width="5" height="14" fill="#22c55e"/><rect x="34" y="26" width="6" height="14" fill="#f59e0b"/><rect x="41" y="28" width="6" height="12" fill="#a855f7"/><rect x="14" y="44" width="7" height="14" fill="#06b6d4"/><rect x="22" y="46" width="6" height="12" fill="#ec4899"/>',
    fridge: '<rect x="14" y="4" width="36" height="56" rx="5" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/><path d="M14 24h36" stroke="#64748b" stroke-width="3"/><path d="M20 12v6M20 30v10" stroke="#475569" stroke-width="3" stroke-linecap="round"/>',
    washer: '<rect x="8" y="6" width="48" height="52" rx="5" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><path d="M8 16h48" stroke="#64748b" stroke-width="2"/><circle cx="16" cy="11" r="2" fill="#22c55e"/><circle cx="24" cy="11" r="2" fill="#f59e0b"/><circle cx="32" cy="37" r="14" fill="#bae6fd" stroke="#64748b" stroke-width="3"/><path d="M22 40q5-6 10 0t10 0" fill="none" stroke="#0284c7" stroke-width="2"/>',
    stove: '<rect x="4" y="30" width="56" height="16" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="3"/><circle cx="18" cy="38" r="4" fill="#475569"/><circle cx="46" cy="38" r="4" fill="#475569"/><path d="M14 28q4-10 4-16q4 6 4 16zM42 28q4-10 4-16q4 6 4 16z" fill="#3b82f6"/><path d="M16 28q2-6 2-9q2 4 2 9zM44 28q2-6 2-9q2 4 2 9z" fill="#93c5fd"/>',
    ricecooker: '<path d="M10 28h44v18a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10z" fill="#fff" stroke="#64748b" stroke-width="3"/><path d="M8 28q24-22 48 0z" fill="#f1f5f9" stroke="#64748b" stroke-width="3"/><rect x="28" y="12" width="8" height="5" rx="2" fill="#64748b"/><rect x="26" y="36" width="12" height="7" rx="2" fill="#ef4444"/>',
    hairdryer: '<path d="M8 14h30a12 12 0 0 1 0 24H8z" fill="#f472b6" stroke="#9d174d" stroke-width="3"/><path d="M28 36l-6 22h10l4-20" fill="#f472b6" stroke="#9d174d" stroke-width="3"/><path d="M50 20h8M50 26h10M50 32h8" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>',
    uniform: '<path d="M20 6l-14 12 7 8 6-4v34h26V22l6 4 7-8-14-12q-6 6-12 0z" fill="#fff" stroke="#334155" stroke-width="3"/><path d="M29 8l3 8 3-8" fill="#ef4444"/><path d="M32 16l-3 14 3 4 3-4z" fill="#ef4444"/><path d="M19 48h26v8H19z" fill="#1e3a8a"/>',
    raincoat: '<path d="M32 4q-14 0-14 16v6L8 56h48L46 26v-6Q46 4 32 4z" fill="#facc15" stroke="#a16207" stroke-width="3"/><path d="M24 20q8 6 16 0" fill="none" stroke="#a16207" stroke-width="2"/><circle cx="32" cy="34" r="2" fill="#a16207"/><circle cx="32" cy="44" r="2" fill="#a16207"/>'
  };
  function badge(t, c) {
    var fs = t.length <= 2 ? 30 : (t.length === 3 ? 22 : 16);
    return '<circle cx="32" cy="32" r="28" fill="' + c + '"/><text x="32" y="' + (32 + fs * 0.35) + '" text-anchor="middle" font-size="' + fs + '" font-weight="800" fill="#fff" font-family="Arial,sans-serif">' + t + '</text>';
  }
  function cal(t) {
    var fs = Math.min(18, Math.floor(46 / (t.length * 0.62)));
    return '<rect x="6" y="8" width="52" height="50" rx="6" fill="#fff" stroke="#555" stroke-width="3"/><rect x="6" y="8" width="52" height="14" rx="6" fill="#ef4444"/><rect x="6" y="16" width="52" height="6" fill="#ef4444"/><circle cx="18" cy="8" r="3" fill="#555"/><circle cx="46" cy="8" r="3" fill="#555"/><text x="32" y="' + (41 + fs * 0.35) + '" text-anchor="middle" font-size="' + fs + '" font-weight="800" fill="#334155" font-family="Arial,sans-serif">' + t + '</text>';
  }
  function dot(c) { return '<circle cx="32" cy="32" r="26" fill="' + c + '" stroke="#94a3b8" stroke-width="2"/>'; }

  function parseW(s) { return s.split(';').map(function (x) { return x.split('|'); }); }

  /* ---- Số đếm ---- */
  var NUMS = [['zero', 'số không', '0'], ['one', 'số một', '1'], ['two', 'số hai', '2'], ['three', 'số ba', '3'], ['four', 'số bốn', '4'], ['five', 'số năm', '5'],
    ['six', 'số sáu', '6'], ['seven', 'số bảy', '7'], ['eight', 'số tám', '8'], ['nine', 'số chín', '9'], ['ten', 'số mười', '10'], ['eleven', 'mười một', '11'],
    ['twelve', 'mười hai', '12'], ['thirteen', 'mười ba', '13'], ['fourteen', 'mười bốn', '14'], ['fifteen', 'mười lăm', '15'], ['sixteen', 'mười sáu', '16'],
    ['seventeen', 'mười bảy', '17'], ['eighteen', 'mười tám', '18'], ['nineteen', 'mười chín', '19'], ['twenty', 'hai mươi', '20'], ['thirty', 'ba mươi', '30'],
    ['forty', 'bốn mươi', '40'], ['fifty', 'năm mươi', '50'], ['one hundred', 'một trăm', '100']];
  var PAL = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];
  var numW = NUMS.map(function (n, i) { SV['n_' + i] = badge(n[2], PAL[i % PAL.length]); return [n[0], n[1], '@n_' + i]; });

  /* ---- Hình khối ---- */
  var SHP = [['circle', 'hình tròn', 'sh_circle'], ['square', 'hình vuông', 'sh_square'], ['rectangle', 'hình chữ nhật', 'sh_rectangle'], ['triangle', 'hình tam giác', 'sh_triangle'],
    ['oval', 'hình bầu dục', 'sh_oval'], ['diamond', 'hình thoi', 'sh_diamond'], ['pentagon', 'hình ngũ giác', 'sh_pentagon'], ['hexagon', 'hình lục giác', 'sh_hexagon'],
    ['octagon', 'hình bát giác', 'sh_octagon'], ['star', 'ngôi sao', '⭐'], ['heart', 'trái tim', '❤️'], ['crescent', 'trăng lưỡi liềm', '🌙'], ['cross', 'dấu cộng', 'sh_cross'],
    ['arrow', 'mũi tên', '➡️'], ['cube', 'khối lập phương', 'sh_cube'], ['sphere', 'hình cầu', 'sh_sphere'], ['cylinder', 'hình trụ', 'sh_cylinder'], ['cone', 'hình nón', 'sh_cone'], ['pyramid', 'hình chóp', 'sh_pyramid']];
  var shapeW = SHP.map(function (s) { return [s[0], s[1], s[2].charAt(0) === 's' && s[2].charAt(1) === 'h' && s[2].charAt(2) === '_' ? '@' + s[2] : s[2]]; });

  /* ---- Màu sắc ---- */
  var COL = [['red', 'màu đỏ', '#ef4444'], ['blue', 'màu xanh dương', '#3b82f6'], ['green', 'màu xanh lá', '#22c55e'], ['yellow', 'màu vàng', '#facc15'], ['orange', 'màu cam', '#f97316'],
    ['purple', 'màu tím', '#a855f7'], ['pink', 'màu hồng', '#f472b6'], ['brown', 'màu nâu', '#92400e'], ['black', 'màu đen', '#111827'], ['white', 'màu trắng', '#ffffff'],
    ['gray', 'màu xám', '#9ca3af'], ['gold', 'màu vàng kim', '#d4a017'], ['silver', 'màu bạc', '#cbd5e1'], ['sky blue', 'xanh da trời', '#7dd3fc'], ['navy', 'xanh navy', '#1e3a8a'],
    ['dark green', 'xanh lá đậm', '#166534'], ['light green', 'xanh lá nhạt', '#86efac'], ['beige', 'màu be', '#f5deb3'], ['maroon', 'màu đỏ đô', '#7f1d1d'], ['turquoise', 'màu ngọc lam', '#14b8a6']];
  var colW = COL.map(function (c, i) { SV['c_' + i] = dot(c[2]); return [c[0], c[1], '@c_' + i]; });

  /* ---- Thứ & tháng ---- */
  var DAYS = [['Monday', 'thứ Hai', 'MON'], ['Tuesday', 'thứ Ba', 'TUE'], ['Wednesday', 'thứ Tư', 'WED'], ['Thursday', 'thứ Năm', 'THU'], ['Friday', 'thứ Sáu', 'FRI'], ['Saturday', 'thứ Bảy', 'SAT'], ['Sunday', 'chủ nhật', 'SUN']];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var dayW = DAYS.map(function (d, i) { SV['d_' + i] = cal(d[2]); return [d[0], d[1], '@d_' + i]; });
  MON.forEach(function (m, i) { SV['m_' + i] = cal(MONS[i]); dayW.push([m, 'tháng ' + (i + 1), '@m_' + i]); });

  /* ---- Thời gian ---- */
  var TIMEC = [['today', 'hôm nay', 'TODAY'], ['tomorrow', 'ngày mai', 'TOMORROW'], ['yesterday', 'hôm qua', 'YESTERDAY'], ['week', 'tuần', 'WEEK'], ['weekend', 'cuối tuần', 'WEEKEND'],
    ['month', 'tháng', 'MONTH'], ['year', 'năm', 'YEAR'], ['hour', 'giờ', 'HOUR'], ['minute', 'phút', 'MIN'], ['second', 'giây', 'SEC']];
  var timeW = parseW('morning|buổi sáng|🌅;noon|buổi trưa|🕛;afternoon|buổi chiều|🌇;evening|buổi tối|🌆;night|ban đêm|🌃;midnight|nửa đêm|🌌;clock|đồng hồ treo tường|🕰️;alarm clock|đồng hồ báo thức|⏰;watch|đồng hồ đeo tay|⌚;stopwatch|đồng hồ bấm giờ|⏱️;hourglass|đồng hồ cát|⏳;timer|đồng hồ hẹn giờ|⏲️;calendar|quyển lịch|📅');
  TIMEC.forEach(function (t, i) { SV['t_' + i] = cal(t[2]); timeW.push([t[0], t[1], '@t_' + i]); });

  /* ---- nạp ảnh SVG ---- */
  var IMGS = {};
  Object.keys(SV).forEach(function (k) {
    var im = new Image();
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' + SV[k] + '</svg>');
    IMGS[k] = im;
  });

  /* ================= DỮ LIỆU CHỦ ĐỀ ================= */
  function T(id, i, n, c, w, g) { return { id: id, i: i, n: n, c: c, g: g || 0, w: typeof w === 'string' ? parseW(w) : w }; }
  /* Chủ đề được xếp theo nhóm: con người → nhà cửa → ăn uống → học tập & vui chơi → động vật → thiên nhiên → nơi chốn → kiến thức cơ bản.
     Thêm chủ đề: thêm 1 dòng T('mã', 'biểu tượng', 'Tên', 'màu', 'từ|nghĩa|hình;...', số nhóm) */
  var GROUPS = ["👪 Con người", "🏠 Nhà cửa & đồ dùng", "🍽️ Ăn uống", "🎒 Học tập & vui chơi", "🐾 Thế giới động vật", "🌿 Thiên nhiên & vũ trụ", "🗺️ Nơi chốn & đi lại", "🔢 Kiến thức cơ bản"];
  var TOPICS = [
    T('family', '👪', 'Gia đình & con người', '#e11d48', 'father|bố|👨;mother|mẹ|👩;grandfather|ông|👴;grandmother|bà|👵;baby|em bé|👶;boy|bé trai|👦;girl|bé gái|👧;child|đứa trẻ|🧒;family|gia đình|👪;friends|bạn bè|👫;couple|cặp đôi|💑;uncle|chú / bác|🧔;aunt|cô / dì|👩‍🦰;bride|cô dâu|👰;groom|chú rể|🤵;wedding|đám cưới|💒;king|nhà vua|🤴;queen|nữ hoàng|👸;love|tình yêu|💕;kiss|nụ hôn|💋;hug|cái ôm|🤗;pregnant woman|bà bầu|🤰;old man|ông già|🧓;twins|cặp song sinh|👯;cousin|anh chị em họ|🧑‍🤝‍🧑;neighbor|hàng xóm|🏘️', 0),
    T('body', '🧍', 'Cơ thể', '#f43f5e', 'eye|con mắt|👁️;ear|cái tai|👂;nose|cái mũi|👃;mouth|cái miệng|👄;hand|bàn tay|✋;foot|bàn chân|🦶;leg|cái chân|🦵;arm|cánh tay|💪;tooth|cái răng|🦷;brain|bộ não|🧠;tongue|cái lưỡi|👅;bone|xương|🦴;heart|trái tim|❤️;hair|mái tóc|💇;nail|móng tay|💅;footprints|dấu chân|👣;finger|ngón tay|☝️;thumb|ngón cái|👍;fist|nắm đấm|✊;clap|vỗ tay|👏;skull|đầu lâu|💀;eyes|đôi mắt|👀;waving hand|vẫy tay|👋;peace sign|chữ V|✌️;ok sign|dấu OK|👌;praying hands|chắp tay|🙏;handshake|bắt tay|🤝;face|khuôn mặt|🙂;muscle|cơ bắp|🦾', 0),
    T('emotions', '😊', 'Cảm xúc', '#eab308', 'happy|vui vẻ|😊;sad|buồn|😢;angry|tức giận|😠;sleepy|buồn ngủ|😴;scared|sợ hãi|😱;surprised|ngạc nhiên|😮;laughing|cười lớn|😂;cool|ngầu|😎;sick|bị ốm|🤒;in love|đang yêu|😍;thinking|đang suy nghĩ|🤔;crying|khóc|😭;embarrassed|xấu hổ|😳;bored|chán|😑;worried|lo lắng|😟;excited|háo hức|🤩;shy|ngại ngùng|🥺;confused|bối rối|😕;relaxed|thư giãn|😌;tired|mệt mỏi|😫;silly|ngớ ngẩn|🤪;nervous|hồi hộp|😬;disgusted|ghê tởm|🤢;winking|nháy mắt|😉;smiling|mỉm cười|🙂;kissing|hôn gió|😘;celebrating|ăn mừng|🥳;dizzy|chóng mặt|😵;relieved|nhẹ nhõm|😅', 0),
    T('clothes', '👕', 'Quần áo', '#0ea5e9', 'shirt|áo sơ mi|👕;pants|quần dài|👖;dress|váy liền|👗;cap|mũ lưỡi trai|🧢;sneakers|giày thể thao|👟;socks|đôi tất|🧦;coat|áo khoác|🧥;scarf|khăn quàng|🧣;gloves|găng tay|🧤;tie|cà vạt|👔;boots|đôi ủng|🥾;bikini|đồ bơi|👙;hat|cái mũ|👒;high heels|giày cao gót|👠;sandals|dép xăng đan|👡;kimono|áo kimono|👘;handbag|túi xách|👜;lab coat|áo blouse|🥼;top hat|mũ chóp cao|🎩;graduation cap|mũ tốt nghiệp|🎓;helmet|mũ bảo hiểm|⛑️;shorts|quần đùi|🩳;pajamas|đồ ngủ|@pajamas;backpack|ba lô|🎒;school uniform|đồng phục|@uniform;raincoat|áo mưa|@raincoat;T-shirt|áo phông|🎽', 0),
    T('personal', '🪥', 'Đồ dùng cá nhân', '#14b8a6', 'toothbrush|bàn chải đánh răng|🪥;toothpaste|kem đánh răng|@toothpaste;comb|cái lược|@comb;towel|khăn tắm|@towel;soap|xà phòng|🧼;shampoo|dầu gội|🧴;tissue|khăn giấy|@tissue;toilet paper|giấy vệ sinh|🧻;razor|dao cạo râu|🪒;sponge|bọt biển|🧽;hair dryer|máy sấy tóc|@hairdryer;wallet|cái ví|👛;umbrella|cái ô / dù|☂️;glasses|kính mắt|👓;sunglasses|kính râm|🕶️;watch|đồng hồ đeo tay|⌚;key|chìa khóa|🔑;phone|điện thoại|📱;backpack|ba lô|🎒;handbag|túi xách|👜;ring|chiếc nhẫn|💍;lipstick|son môi|💄;mirror|cái gương|🪞', 0),
    T('health', '🏥', 'Sức khỏe & bệnh viện', '#dc2626', 'hospital|bệnh viện|🏥;doctor|bác sĩ|👨‍⚕️;nurse|y tá|👩‍⚕️;ambulance|xe cứu thương|🚑;medicine|viên thuốc|💊;syringe|ống tiêm|💉;thermometer|nhiệt kế|🌡️;stethoscope|ống nghe|🩺;bandage|băng dán|🩹;mask|khẩu trang|😷;fever|sốt|🤒;sneeze|hắt hơi|🤧;headache|đau đầu|🤕;vomit|nôn|🤮;toothache|đau răng|🦷;wheelchair|xe lăn|🦽;blood|máu|🩸;germs|vi khuẩn|🦠;healthy|khỏe mạnh|💪;sleep|ngủ|😴;tired|mệt mỏi|😫;dizzy|chóng mặt|😵', 0),
    T('jobs', '👨‍⚕️', 'Nghề nghiệp', '#06b6d4', 'doctor|bác sĩ|👨‍⚕️;teacher|giáo viên|👩‍🏫;farmer|nông dân|👨‍🌾;cook|đầu bếp|👨‍🍳;police officer|cảnh sát|👮;firefighter|lính cứu hỏa|🧑‍🚒;pilot|phi công|🧑‍✈️;artist|họa sĩ|🧑‍🎨;singer|ca sĩ|🧑‍🎤;scientist|nhà khoa học|🧑‍🔬;mechanic|thợ máy|🧑‍🔧;astronaut|phi hành gia|🧑‍🚀;judge|thẩm phán|🧑‍⚖️;office worker|nhân viên văn phòng|🧑‍💼;builder|công nhân xây dựng|👷;guard|lính gác|💂;detective|thám tử|🕵️;programmer|lập trình viên|🧑‍💻;dancer|vũ công|💃;photographer|nhiếp ảnh gia|📸;nurse|y tá|👩‍⚕️;waiter|bồi bàn|🤵;clown|chú hề|🤡;student|học sinh|🧑‍🎓;driver|tài xế|🚖;soldier|bộ đội|🪖;fisherman|ngư dân|🎣;hairdresser|thợ cắt tóc|💇;shop assistant|nhân viên bán hàng|🛍️;writer|nhà văn|✍️', 0),
    T('verbs', '🏃', 'Động từ thường gặp', '#0ea5e9', 'run|chạy|🏃;walk|đi bộ|🚶;sleep|ngủ|😴;eat|ăn|🍽️;drink|uống|🥤;read|đọc|📖;write|viết|✍️;sing|hát|🎤;dance|nhảy múa|💃;swim|bơi|🏊;cry|khóc|😭;laugh|cười|😂;cook|nấu ăn|🍳;wash|rửa|🧼;draw|vẽ|🎨;listen|nghe|🎧;talk|nói chuyện|🗣️;think|suy nghĩ|🤔;look|nhìn|👀;climb|leo|🧗;drive|lái xe|🚗;fly|bay|✈️;ride|đạp xe|🚴;kick|đá bóng|⚽;buy|mua|🛒;give|tặng|🎁;love|yêu|❤️;sit|ngồi|🪑;stand|đứng|🧍;hug|ôm|🤗;kiss|hôn|😘;wait|đợi|⏳;wake up|thức dậy|⏰;open|mở|🚪;call|gọi điện|📞;play|chơi game|🎮;take photo|chụp ảnh|📷;jump|nhảy|🤸;pull|kéo|🪢;throw|ném|🤾;clean|lau dọn|🧹;study|học|📚;help|giúp đỡ|🤝;close|đóng|🔒', 0),
    T('adjectives', '↔️', 'Tính từ thường gặp', '#8b5cf6', 'big|to, lớn|🐘;small|nhỏ, bé|🐜;tall|cao|🦒;fast|nhanh|🚀;slow|chậm|🐢;heavy|nặng|🏋️;light|nhẹ|🪶;strong|khỏe, mạnh|💪;new|mới|✨;old|cũ|🏚️;young|trẻ|👶;hot|nóng|🔥;cold|lạnh|🧊;wet|ướt|💦;dry|khô|🏜️;loud|ồn ào|📢;quiet|yên lặng|🤫;sweet|ngọt|🍬;sour|chua|🍋;spicy|cay|🌶️;salty|mặn|🧂;bitter|đắng|☕;beautiful|đẹp|🌸;dirty|bẩn|🐽;clean|sạch sẽ|🧼;hungry|đói|😋;happy|vui vẻ|😊;sad|buồn|😢', 0),
    T('home', '🏠', 'Trong nhà', '#a16207', 'house|ngôi nhà|🏠;bed|cái giường|🛏️;door|cánh cửa|🚪;chair|cái ghế|🪑;toilet|bồn cầu|🚽;bathtub|bồn tắm|🛁;shower|vòi sen|🚿;window|cửa sổ|🪟;broom|cái chổi|🧹;candle|ngọn nến|🕯️;mirror|cái gương|🪞;sofa|ghế sofa|🛋️;telephone|điện thoại bàn|☎️;mailbox|hòm thư|📫;trash can|thùng rác|🗑️;basket|cái giỏ|🧺;pillow|cái gối|@pillow;blanket|cái chăn|@blanket;garden|khu vườn|🏡;wardrobe|tủ quần áo|@wardrobe;fan|cái quạt|@fan;air conditioner|điều hòa|@aircon;curtain|rèm cửa|@curtain;table|cái bàn|@table;desk|bàn học|@desk;bookshelf|giá sách|@bookshelf;washing machine|máy giặt|@washer;lamp|cái đèn|💡;clock|đồng hồ treo tường|🕰️;picture|bức tranh|🖼️;key|chìa khóa|🔑', 1),
    T('kitchen', '🍴', 'Nhà bếp', '#b45309', 'knife|con dao|🔪;fork|cái nĩa|🍴;spoon|cái thìa|🥄;chopsticks|đôi đũa|🥢;plate|cái đĩa|🍽️;bowl|cái bát|🥣;cup|cái tách|☕;glass|cái ly|🥃;bottle|cái chai|🍾;pot|cái nồi|🍲;frying pan|cái chảo|🍳;salt|muối|🧂;butter|bơ|🧈;sponge|bọt biển|🧽;soap|nước rửa bát|🧼;refrigerator|tủ lạnh|@fridge;stove|bếp ga|@stove;rice cooker|nồi cơm điện|@ricecooker;teapot|ấm trà|🫖;cook|nấu ăn|👩‍🍳;fire|bếp lửa|🔥;trash can|thùng rác|🗑️', 1),
    T('objects', '🎒', 'Đồ vật quanh ta', '#8b5cf6', 'book|quyển sách|📖;phone|điện thoại|📱;key|chìa khóa|🔑;clock|đồng hồ|⏰;umbrella|cái ô / dù|☂️;glasses|kính mắt|👓;bag|cái cặp / ba lô|🎒;computer|máy tính|💻;camera|máy ảnh|📷;lamp|bóng đèn|💡;scissors|cái kéo|✂️;gift|món quà|🎁;television|ti vi|📺;envelope|phong bì|✉️;balloon|bóng bay|🎈;trophy|cúp|🏆;flag|lá cờ|🚩;pen|cây bút|🖊️;map|bản đồ|🗺️;tent|cái lều|⛺;microscope|kính hiển vi|🔬;telescope|kính thiên văn|🔭;hourglass|đồng hồ cát|⏳;flashlight|đèn pin|🔦;lock|ổ khóa|🔒;ring|chiếc nhẫn|💍;crown|vương miện|👑;lipstick|son môi|💄;sunglasses|kính râm|🕶️;package|gói hàng|📦;newspaper|tờ báo|📰;vase|cái bình|🏺;joystick|cần điều khiển|🕹️;pushpin|cái ghim|📌', 1),
    T('tools', '🔨', 'Dụng cụ', '#64748b', 'hammer|cái búa|🔨;saw|cái cưa|🪚;screwdriver|tua vít|🪛;wrench|cờ lê|🔧;axe|cái rìu|🪓;ladder|cái thang|🪜;magnet|nam châm|🧲;pencil|bút chì|✏️;paintbrush|cọ vẽ|🖌️;bucket|cái xô|🪣;battery|pin|🔋;toolbox|hộp đồ nghề|🧰;nut and bolt|ốc vít|🔩;gear|bánh răng|⚙️;chain|sợi xích|⛓️;pickaxe|cái cuốc|⛏️;plug|phích cắm|🔌;fire extinguisher|bình cứu hỏa|🧯;brick|viên gạch|🧱;compass|la bàn|🧭;ruler|thước kẻ|📏;shield|cái khiên|🛡️;magnifying glass|kính lúp|🔍;knife|con dao|🔪;thread|sợi chỉ|🧵;oil barrel|thùng dầu|🛢️', 1),
    T('tech', '💻', 'Công nghệ', '#475569', 'computer|máy tính|💻;desktop|máy tính để bàn|🖥️;keyboard|bàn phím|⌨️;mouse|con chuột máy tính|🖱️;printer|máy in|🖨️;phone|điện thoại|📱;camera|máy ảnh|📷;video camera|máy quay phim|📹;television|ti vi|📺;radio|đài radio|📻;robot|người máy|🤖;satellite|vệ tinh|🛰️;battery|pin|🔋;plug|phích cắm|🔌;light bulb|bóng đèn|💡;floppy disk|đĩa mềm|💾;CD|đĩa CD|💿;joystick|cần điều khiển|🕹️;video game|trò chơi điện tử|🎮;headphones|tai nghe|🎧;microphone|micro|🎤;telephone|điện thoại bàn|☎️;antenna|ăng-ten|📡;speaker|cái loa|🔊;smartwatch|đồng hồ thông minh|⌚;email|thư điện tử|📧;link|đường liên kết|🔗', 1),
    T('fruits', '🍎', 'Trái cây', '#ef4444', 'apple|quả táo|🍎;banana|quả chuối|🍌;orange|quả cam|🍊;grape|quả nho|🍇;watermelon|dưa hấu|🍉;strawberry|dâu tây|🍓;pineapple|quả dứa|🍍;lemon|quả chanh|🍋;peach|quả đào|🍑;cherry|quả anh đào|🍒;mango|quả xoài|🥭;coconut|quả dừa|🥥;pear|quả lê|🍐;kiwi|quả kiwi|🥝;avocado|quả bơ|🥑;melon|dưa lê|🍈;green apple|táo xanh|🍏;blueberries|quả việt quất|🫐', 2),
    T('vegetables', '🥕', 'Rau củ & các loại hạt', '#65a30d', 'carrot|cà rốt|🥕;tomato|cà chua|🍅;corn|bắp ngô|🌽;potato|khoai tây|🥔;onion|củ hành|🧅;garlic|củ tỏi|🧄;broccoli|súp lơ xanh|🥦;cucumber|dưa chuột|🥒;eggplant|cà tím|🍆;mushroom|nấm|🍄;chili|quả ớt|🌶️;lettuce|rau xà lách|🥬;peanut|đậu phộng|🥜;chestnut|hạt dẻ|🌰;sweet potato|khoai lang|🍠;bell pepper|ớt chuông|🫑;olive|quả ô liu|🫒;pumpkin|quả bí ngô|🎃;herb|rau thơm|🌿', 2),
    T('food', '🍕', 'Món ăn', '#f97316', 'bread|bánh mì|🍞;rice|cơm / gạo|🍚;egg|quả trứng|🥚;cheese|phô mai|🧀;pizza|bánh pizza|🍕;noodles|mì / phở|🍜;cake|bánh ngọt|🍰;ice cream|kem|🍦;chicken|thịt gà|🍗;hamburger|bánh hamburger|🍔;sandwich|bánh sandwich|🥪;hot dog|xúc xích kẹp bánh|🌭;french fries|khoai tây chiên|🍟;sushi|sushi|🍣;soup|món súp|🍲;salad|món salad|🥗;cookie|bánh quy|🍪;chocolate|sô cô la|🍫;candy|kẹo|🍬;donut|bánh vòng|🍩;honey|mật ong|🍯;pasta|mì Ý|🍝;curry|cà ri|🍛;dumpling|há cảo|🥟;taco|bánh taco|🌮;burrito|bánh burrito|🌯;popcorn|bắp rang|🍿;pancakes|bánh kếp|🥞;croissant|bánh sừng bò|🥐;pretzel|bánh quy xoắn|🥨;steak|bít tết|🥩;rice ball|cơm nắm|🍙;bento|cơm hộp|🍱;pie|bánh nướng|🥧;cupcake|bánh cupcake|🧁;lollipop|kẹo mút|🍭;fried egg|trứng ốp la|🍳;birthday cake|bánh sinh nhật|🎂;bacon|thịt xông khói|🥓;porridge|cháo|🥣;meat|thịt|🍖', 2),
    T('drinks', '🥤', 'Đồ uống', '#0ea5e9', 'water|nước lọc|💧;milk|sữa|🥛;coffee|cà phê|☕;tea|trà|🍵;juice|nước ép|🧃;soft drink|nước ngọt|🥤;bubble tea|trà sữa|🧋;coconut|nước dừa|🥥;ice|đá viên|🧊;baby bottle|bình sữa|🍼;beer|bia|🍺;wine|rượu vang|🍷;cocktail|cốc tai|🍹;champagne|rượu sâm panh|🍾;sake|rượu sake|🍶', 2),
    T('school', '📚', 'Trường học', '#e11d48', 'school|trường học|🏫;teacher|giáo viên|👩‍🏫;student|học sinh|🧑‍🎓;book|quyển sách|📖;notebook|quyển vở|📓;pencil|bút chì|✏️;pen|bút mực|🖊️;ruler|thước kẻ|📏;scissors|cái kéo|✂️;eraser|cục tẩy|@eraser;glue|hồ dán|@glue;blackboard|bảng đen|@blackboard;backpack|cặp sách|🎒;calculator|máy tính bỏ túi|🧮;map|bản đồ|🗺️;globe|quả địa cầu|🌍;paper clip|kẹp giấy|📎;folder|tập hồ sơ|📁;crayon|bút sáp màu|🖍️;graduation cap|mũ tốt nghiệp|🎓;library|thư viện|🏛️;bell|chuông trường|🔔;clock|đồng hồ|🕗;microscope|kính hiển vi|🔬;palette|bảng màu|🎨;test|bài kiểm tra|💯;letters|chữ cái|🔤;calendar|quyển lịch|📅;lunch box|hộp cơm|🍱;homework|bài tập về nhà|📝;pushpin|cái ghim|📌;magnifying glass|kính lúp|🔍;bookmark|thẻ đánh dấu|🔖;gold medal|huy chương vàng|🥇;trophy|chiếc cúp|🏆;flag|lá cờ|🚩', 3),
    T('toys', '🧸', 'Đồ chơi', '#f472b6', 'teddy bear|gấu bông|🧸;doll|búp bê|🪆;ball|quả bóng|🏐;kite|con diều|🪁;yo-yo|yo-yo|🪀;puzzle|trò xếp hình|🧩;dice|xúc xắc|🎲;balloon|bóng bay|🎈;robot|người máy|🤖;toy car|ô tô đồ chơi|🚗;toy train|tàu hỏa đồ chơi|🚂;blocks|khối xếp hình|🧱;video game|trò chơi điện tử|🎮;chess|cờ vua|♟️;playing cards|bài tây|🃏;skateboard|ván trượt|🛹;magic wand|đũa phép|🪄;rubber duck|vịt cao su|🦆;crayon|bút sáp màu|🖍️;bubbles|bong bóng xà phòng|🫧', 3),
    T('sports', '⚽', 'Thể thao', '#16a34a', 'football|bóng đá|⚽;basketball|bóng rổ|🏀;tennis|quần vợt|🎾;volleyball|bóng chuyền|🏐;baseball|bóng chày|⚾;swimming|bơi lội|🏊;boxing|đấm bốc|🥊;golf|đánh gôn|⛳;skiing|trượt tuyết|⛷️;cycling|đạp xe|🚴;running|chạy bộ|🏃;badminton|cầu lông|🏸;rugby|bóng bầu dục|🏉;table tennis|bóng bàn|🏓;bowling|ném bowling|🎳;hockey|khúc côn cầu|🏒;ice skating|trượt băng|⛸️;surfing|lướt sóng|🏄;rowing|chèo thuyền|🚣;weightlifting|cử tạ|🏋️;yoga|yoga|🧘;gymnastics|thể dục dụng cụ|🤸;fencing|đấu kiếm|🤺;archery|bắn cung|🏹;horse racing|đua ngựa|🏇;darts|phi tiêu|🎯;medal|huy chương|🏅;karate|võ karate|🥋;fishing|câu cá|🎣;climbing|leo núi|🧗;diving|lặn|🤿', 3),
    T('music', '🎸', 'Âm nhạc', '#7c3aed', 'guitar|đàn ghi-ta|🎸;piano|đàn piano|🎹;drum|cái trống|🥁;violin|đàn vi-ô-lông|🎻;trumpet|kèn trumpet|🎺;saxophone|kèn saxophone|🎷;microphone|micro|🎤;headphones|tai nghe|🎧;music note|nốt nhạc|🎵;bell|cái chuông|🔔;radio|đài radio|📻;accordion|đàn accordion|🪗;musical notes|giai điệu|🎶;sheet music|bản nhạc|🎼;CD|đĩa CD|💿;loudspeaker|cái loa|🔊;mute|tắt tiếng|🔇;dancing|nhảy múa|💃;disco|nhảy disco|🕺;studio mic|micro phòng thu|🎙️;megaphone|loa tay|📢', 3),
    T('festivals', '🎄', 'Lễ hội & tiệc tùng', '#be123c', 'Christmas tree|cây thông Noel|🎄;Santa Claus|ông già Noel|🎅;gift|món quà|🎁;fireworks|pháo hoa|🎆;sparkler|pháo bông|🎇;lantern|đèn lồng|🏮;birthday cake|bánh sinh nhật|🎂;balloon|bóng bay|🎈;party popper|pháo giấy|🎉;confetti|giấy rắc hoa|🎊;ghost|con ma|👻;pumpkin|quả bí ngô|🎃;snowman|người tuyết|⛄;mooncake|bánh trung thu|🥮;red envelope|bao lì xì|🧧;carp streamer|cờ cá chép|🎏;bamboo decoration|cành trúc|🎍;bouquet|bó hoa|💐;ribbon|cái nơ|🎀;party|bữa tiệc|🥳;champagne|rượu sâm panh|🍾;bell|cái chuông|🔔;candy|kẹo|🍬;moon viewing|ngắm trăng|🎑', 3),
    T('fantasy', '🐉', 'Thế giới thần tiên', '#9333ea', 'dragon|con rồng|🐉;unicorn|kỳ lân|🦄;fairy|nàng tiên|🧚;wizard|pháp sư|🧙;mermaid|nàng tiên cá|🧜;genie|thần đèn|🧞;vampire|ma cà rồng|🧛;zombie|xác sống|🧟;elf|chú lùn tai nhọn|🧝;angel|thiên thần|👼;ghost|con ma|👻;alien|người ngoài hành tinh|👽;robot|người máy|🤖;castle|lâu đài|🏰;crown|vương miện|👑;crystal ball|quả cầu pha lê|🔮;sword|thanh kiếm|⚔️;shield|cái khiên|🛡️;treasure|kho báu|💎;king|nhà vua|🤴;queen|nữ hoàng|👸;dinosaur|khủng long|🦖;long-necked dinosaur|khủng long cổ dài|🦕;skull|đầu lâu|💀;superhero|siêu anh hùng|🦸;villain|nhân vật phản diện|🦹', 3),
    T('pets', '🐶', 'Vật nuôi & nông trại', '#f59e0b', 'cat|con mèo|🐱;dog|con chó|🐶;rabbit|con thỏ|🐰;mouse|con chuột|🐭;fish|con cá|🐟;horse|con ngựa|🐴;pig|con lợn|🐷;cow|con bò|🐮;sheep|con cừu|🐑;goat|con dê|🐐;buffalo|con trâu|🐃;hen|con gà mái|🐔;duck|con vịt|🦆;hamster|chuột hamster|🐹;rooster|gà trống|🐓;chick|gà con|🐤;turkey|gà tây|🦃;parrot|con vẹt|🦜;puppy|chó con|🐕;goldfish|cá vàng|🐠;tractor|máy kéo|🚜;farmer|nông dân|👨‍🌾', 4),
    T('wild', '🦁', 'Động vật hoang dã', '#ea580c', 'monkey|con khỉ|🐵;elephant|con voi|🐘;lion|sư tử|🦁;tiger|con hổ|🐯;frog|con ếch|🐸;bear|con gấu|🐻;panda|gấu trúc|🐼;snake|con rắn|🐍;giraffe|hươu cao cổ|🦒;zebra|ngựa vằn|🦓;kangaroo|chuột túi|🦘;crocodile|cá sấu|🐊;owl|con cú|🦉;rhinoceros|con tê giác|🦏;hippopotamus|hà mã|🦛;camel|con lạc đà|🐪;deer|con hươu|🦌;fox|con cáo|🦊;wolf|con sói|🐺;squirrel|con sóc|🐿️;hedgehog|con nhím|🦔;bat|con dơi|🦇;koala|gấu koala|🐨;leopard|con báo|🐆;gorilla|khỉ đột|🦍;lizard|thằn lằn|🦎;orangutan|đười ươi|🦧;sloth|con lười|🦥;otter|rái cá|🦦;raccoon|gấu mèo|🦝;skunk|chồn hôi|🦨;llama|lạc đà không bướu|🦙;badger|con lửng|🦡;boar|lợn rừng|🐗', 4),
    T('birds', '🦜', 'Các loài chim', '#0d9488', 'eagle|đại bàng|🦅;parrot|con vẹt|🦜;swan|thiên nga|🦢;flamingo|hồng hạc|🦩;peacock|con công|🦚;turkey|gà tây|🦃;rooster|gà trống|🐓;hen|gà mái|🐔;chick|gà con|🐤;hatching chick|gà con nở|🐣;dove|chim bồ câu|🕊️;duck|con vịt|🦆;owl|con cú|🦉;penguin|chim cánh cụt|🐧;bird|con chim|🐦;egg|quả trứng|🥚', 4),
    T('sea', '🐬', 'Sinh vật biển', '#0284c7', 'whale|cá voi|🐋;dolphin|cá heo|🐬;shark|cá mập|🦈;octopus|bạch tuộc|🐙;crab|con cua|🦀;turtle|con rùa|🐢;shrimp|con tôm|🦐;squid|con mực|🦑;lobster|tôm hùm|🦞;seal|hải cẩu|🦭;penguin|chim cánh cụt|🐧;oyster|con hàu|🦪;tropical fish|cá nhiệt đới|🐠;blowfish|cá nóc|🐡;shell|vỏ sò|🐚', 4),
    T('insects', '🦋', 'Côn trùng', '#65a30d', 'bee|con ong|🐝;butterfly|con bướm|🦋;ant|con kiến|🐜;spider|con nhện|🕷️;ladybug|bọ rùa|🐞;mosquito|con muỗi|🦟;snail|con ốc sên|🐌;worm|con giun|🪱;scorpion|con bọ cạp|🦂;cricket|con dế|🦗;fly|con ruồi|🪰;caterpillar|sâu bướm|🐛;spider web|mạng nhện|🕸️;germ|vi khuẩn|🦠;beetle|bọ cánh cứng|🪲;cockroach|con gián|🪳', 4),
    T('flowers', '🌻', 'Hoa & cây cối', '#ca8a04', 'rose|hoa hồng|🌹;sunflower|hoa hướng dương|🌻;tulip|hoa tulip|🌷;hibiscus|hoa dâm bụt|🌺;daisy|hoa cúc|🌼;cherry blossom|hoa anh đào|🌸;bouquet|bó hoa|💐;lotus|hoa sen|🪷;bamboo|cây tre|🎍;herb|rau thơm|🌿;clover|cỏ ba lá|🍀;palm tree|cây cọ|🌴;seedling|cây non|🌱;maple leaf|lá phong|🍁;fallen leaf|lá rụng|🍂;cactus|xương rồng|🌵;evergreen tree|cây thông|🌲;tree|cái cây|🌳;rice plant|cây lúa|🌾;mushroom|cây nấm|🍄;wilted flower|hoa héo|🥀', 5),
    T('nature', '🌈', 'Thiên nhiên', '#10b981', 'sun|mặt trời|☀️;moon|mặt trăng|🌙;star|ngôi sao|⭐;rain|cơn mưa|🌧️;snow|tuyết|❄️;cloud|đám mây|☁️;rainbow|cầu vồng|🌈;lightning|tia chớp|⚡;tree|cái cây|🌳;flower|bông hoa|🌸;mountain|ngọn núi|⛰️;wave|con sóng|🌊;fire|ngọn lửa|🔥;earth|trái đất|🌍;volcano|núi lửa|🌋;desert|sa mạc|🏜️;island|hòn đảo|🏝️;leaf|chiếc lá|🍃;cactus|xương rồng|🌵;tornado|lốc xoáy|🌪️;fog|sương mù|🌫️;sunrise|bình minh|🌅;sunset|hoàng hôn|🌇;comet|sao chổi|☄️;palm tree|cây cọ|🌴;forest|khu rừng|🌲;water drop|giọt nước|💧;ice|băng đá|🧊;river|dòng sông|🏞️;rock|hòn đá|🪨;wood|khúc gỗ|🪵', 5),
    T('weather', '⛅', 'Thời tiết & mùa', '#0891b2', 'sunny|trời nắng|☀️;cloudy|trời nhiều mây|☁️;rainy|trời mưa|🌧️;snowy|trời tuyết|❄️;stormy|có bão|⛈️;windy|có gió|💨;foggy|có sương mù|🌫️;hot|nóng|🥵;cold|lạnh|🥶;rainbow|cầu vồng|🌈;thunder|sấm chớp|⚡;tornado|lốc xoáy|🌪️;umbrella|cái ô|☂️;snowman|người tuyết|⛄;partly cloudy|có mây rải rác|⛅;thermometer|nhiệt kế|🌡️;spring|mùa xuân|🌱;summer|mùa hè|🏖️;autumn|mùa thu|🍂;winter|mùa đông|☃️;sunrise|bình minh|🌅;sunset|hoàng hôn|🌇;flood|lũ lụt|🌊', 5),
    T('space', '🪐', 'Vũ trụ', '#4f46e5', 'planet|hành tinh|🪐;earth|trái đất|🌍;moon|mặt trăng|🌙;sun|mặt trời|☀️;star|ngôi sao|⭐;comet|sao chổi|☄️;rocket|tên lửa|🚀;astronaut|phi hành gia|🧑‍🚀;UFO|đĩa bay|🛸;alien|người ngoài hành tinh|👽;satellite|vệ tinh|🛰️;telescope|kính thiên văn|🔭;galaxy|dải ngân hà|🌌;shooting star|sao băng|🌠;full moon|trăng tròn|🌕;new moon|trăng non|🌑;half moon|trăng bán nguyệt|🌓;eclipse|nhật thực|🌘;sparkles|lấp lánh|✨;robot|người máy|🤖;satellite dish|chảo vệ tinh|📡', 5),
    T('places', '🏫', 'Địa điểm', '#db2777', 'school|trường học|🏫;hospital|bệnh viện|🏥;hotel|khách sạn|🏨;church|nhà thờ|⛪;factory|nhà máy|🏭;castle|lâu đài|🏰;stadium|sân vận động|🏟️;post office|bưu điện|🏤;shop|cửa hàng|🏪;beach|bãi biển|🏖️;park|công viên|🏞️;bridge|cây cầu|🌉;bank|ngân hàng|🏦;office|tòa nhà văn phòng|🏢;department store|trung tâm mua sắm|🏬;ferris wheel|vòng quay|🎡;fountain|đài phun nước|⛲;city|thành phố|🏙️;night city|thành phố về đêm|🌃;village|ngôi làng|🏘️;roller coaster|tàu lượn|🎢;carousel|đu quay|🎠;circus|rạp xiếc|🎪;cinema|rạp chiếu phim|🎦;library|thư viện|🏛️;airport|sân bay|🛫;railway|đường ray|🛤️;highway|đường cao tốc|🛣️;supermarket|siêu thị|🛒;restaurant|nhà hàng|🍽️;market|chợ|🧺;zoo|sở thú|🦁;museum|bảo tàng|🖼️;police station|đồn cảnh sát|🚓;fire station|trạm cứu hỏa|🚒;temple|ngôi chùa|🛕', 6),
    T('transport', '🚗', 'Phương tiện giao thông', '#3b82f6', 'car|ô tô|🚗;bus|xe buýt|🚌;train|tàu hỏa|🚆;plane|máy bay|✈️;bicycle|xe đạp|🚲;motorbike|xe máy|🏍️;ship|tàu thủy|🚢;helicopter|trực thăng|🚁;taxi|xe taxi|🚕;truck|xe tải|🚚;rocket|tên lửa|🚀;ambulance|xe cứu thương|🚑;scooter|xe tay ga|🛵;tram|xe điện|🚋;subway|tàu điện ngầm|🚇;tractor|máy kéo|🚜;sailboat|thuyền buồm|⛵;race car|xe đua|🏎️;skateboard|ván trượt|🛹;fire truck|xe cứu hỏa|🚒;police car|xe cảnh sát|🚓;canoe|ca nô|🛶;cable car|cáp treo|🚠;speedboat|xuồng máy|🚤;flying saucer|đĩa bay|🛸;fuel pump|trạm xăng|⛽;traffic light|đèn giao thông|🚦;anchor|mỏ neo|⚓;bus stop|trạm xe buýt|🚏;minibus|xe khách nhỏ|🚐', 6),
    T('travel', '🧳', 'Du lịch & kỳ nghỉ', '#0891b2', 'suitcase|va li|🧳;passport|hộ chiếu|🛂;ticket|vé|🎫;map|bản đồ|🗺️;camera|máy ảnh|📷;hotel|khách sạn|🏨;beach|bãi biển|🏖️;island|hòn đảo|🏝️;mountain|ngọn núi|⛰️;tent|cái lều|⛺;camping|cắm trại|🏕️;airport|sân bay|🛫;compass|la bàn|🧭;postcard|bưu thiếp|💌;souvenir|quà lưu niệm|🎁;tour bus|xe du lịch|🚌;cruise ship|du thuyền|🛳️;sightseeing|ngắm cảnh|🏯;swimming pool|bể bơi|🏊;sunscreen|kem chống nắng|🧴', 6),
    T('countries', '🌏', 'Quốc gia', '#16a34a', 'Vietnam|Việt Nam|🇻🇳;China|Trung Quốc|🇨🇳;Japan|Nhật Bản|🇯🇵;Korea|Hàn Quốc|🇰🇷;Thailand|Thái Lan|🇹🇭;Laos|Lào|🇱🇦;Cambodia|Campuchia|🇰🇭;Singapore|Xin-ga-po|🇸🇬;Malaysia|Ma-lai-xi-a|🇲🇾;Indonesia|In-đô-nê-xi-a|🇮🇩;Philippines|Phi-líp-pin|🇵🇭;India|Ấn Độ|🇮🇳;Australia|Ô-xtrây-li-a|🇦🇺;United States|Hoa Kỳ|🇺🇸;Canada|Ca-na-đa|🇨🇦;Brazil|Bra-xin|🇧🇷;United Kingdom|Anh|🇬🇧;France|Pháp|🇫🇷;Germany|Đức|🇩🇪;Italy|I-ta-li-a|🇮🇹;Spain|Tây Ban Nha|🇪🇸;Russia|Nga|🇷🇺;Egypt|Ai Cập|🇪🇬', 6),
    T('money', '💰', 'Tiền bạc & mua sắm', '#15803d', 'money|tiền|💵;coin|đồng xu|🪙;credit card|thẻ tín dụng|💳;wallet|cái ví|👛;bank|ngân hàng|🏦;chart|biểu đồ tăng|📈;diamond|kim cương|💎;receipt|hóa đơn|🧾;calculator|máy tính|🧮;savings|tiền tiết kiệm|💰;shopping cart|xe đẩy hàng|🛒;price tag|nhãn giá|🏷️;dollar|đô la|💲;euro|đồng euro|💶;yen|đồng yên|💴;pound|đồng bảng Anh|💷;spending|tiêu tiền|💸;shopping bags|túi mua sắm|🛍️;ATM|máy ATM|🏧;scale|cái cân|⚖️;falling chart|biểu đồ giảm|📉', 6),
    T('colors', '🎨', 'Màu sắc', '#ea580c', colW, 7),
    T('numbers', '🔢', 'Số đếm', '#2563eb', numW, 7),
    T('shapes', '🔷', 'Hình khối', '#7c3aed', shapeW, 7),
    T('days', '📅', 'Thứ & tháng', '#dc2626', dayW, 7),
    T('time', '⏰', 'Thời gian', '#0f766e', timeW, 7)
  ];
  var ALL = [], _seen = {};
  TOPICS.forEach(function (t) { t.w.forEach(function (w) { var k = w[0].toLowerCase(); if (!_seen[k]) { _seen[k] = 1; ALL.push(w); } }); });
  var MENU = TOPICS.concat([{ id: 'mix', n: 'Tổng hợp tất cả', i: '🎲', c: '#ec4899', w: ALL, g: GROUPS.length }]);

  /* ================= MỘT NGÀY CỦA BÉ: 15 MÀN x 20 TỪ ================= */
  var L = [
    ['🛏️', 'Phòng ngủ', '#6366f1', 'bed|cái giường|🛏️;pillow|cái gối|@pillow;blanket|cái chăn|@blanket;wardrobe|tủ quần áo|@wardrobe;fan|cái quạt|@fan;air conditioner|điều hòa|@aircon;curtain|rèm cửa|@curtain;window|cửa sổ|🪟;door|cửa ra vào|🚪;lamp|cái đèn|💡;alarm clock|đồng hồ báo thức|⏰;teddy bear|gấu bông|🧸;mirror|cái gương|🪞;slippers|đôi dép|🩴;pajamas|đồ ngủ|@pajamas;desk|bàn học|@desk;bookshelf|giá sách|@bookshelf;picture|bức tranh|🖼️;wake up|thức dậy|🌄;yawn|ngáp|🥱;stretch|vươn vai|🙆;morning|buổi sáng|🌅;sun|mặt trời|☀️;sleepy|buồn ngủ|😴'],
    ['🪥', 'Đánh răng rửa mặt', '#0ea5e9', 'toothbrush|bàn chải đánh răng|🪥;toothpaste|kem đánh răng|@toothpaste;tooth|răng|🦷;tongue|cái lưỡi|👅;mouth|cái miệng|👄;face|khuôn mặt|🙂;eyes|đôi mắt|👀;nose|cái mũi|👃;ear|cái tai|👂;water|nước|💧;tap|vòi nước|🚰;cup|cái cốc|🥛;soap|xà phòng|🧼;bubbles|bọt xà phòng|🫧;towel|khăn mặt|@towel;comb|cái lược|@comb;hair|mái tóc|💇;mirror|cái gương|🪞;toilet|bồn cầu|🚽;toilet paper|giấy vệ sinh|🧻;wash hands|rửa tay|👐;smile|nụ cười|😁;clean|sạch sẽ|✨;bathtub|bồn tắm|🛁'],
    ['🥣', 'Ăn sáng', '#f59e0b', 'bread|bánh mì|🍞;egg|quả trứng|🥚;fried egg|trứng ốp la|🍳;milk|sữa|🥛;juice|nước ép|🧃;noodles|mì, phở|🍜;porridge|cháo|🥣;rice|cơm|🍚;sandwich|bánh sandwich|🥪;pancakes|bánh kếp|🥞;honey|mật ong|🍯;butter|bơ|🧈;cheese|phô mai|🧀;banana|quả chuối|🍌;apple|quả táo|🍎;bowl|cái bát|🍲;spoon|cái thìa|🥄;chopsticks|đôi đũa|🥢;plate|cái đĩa|🍽️;table|cái bàn|@table;chair|cái ghế|🪑;eat|ăn|😋;drink|uống|🥤;hungry|đói|🤤'],
    ['👕', 'Mặc quần áo', '#ec4899', 'shirt|áo sơ mi|👕;T-shirt|áo phông|🎽;school uniform|đồng phục|@uniform;pants|quần dài|👖;shorts|quần đùi|🩳;dress|váy|👗;socks|đôi tất|🧦;shoes|đôi giày|👞;sneakers|giày thể thao|👟;sandals|dép xăng đan|👡;boots|đôi ủng|🥾;coat|áo khoác|🧥;raincoat|áo mưa|@raincoat;scarf|khăn quàng|🧣;gloves|găng tay|🧤;hat|cái mũ|👒;cap|mũ lưỡi trai|🧢;helmet|mũ bảo hiểm|⛑️;tie|cà vạt|👔;glasses|kính mắt|👓;watch|đồng hồ đeo tay|⌚;backpack|ba lô|🎒;umbrella|cái ô|☂️;wardrobe|tủ quần áo|@wardrobe'],
    ['🚌', 'Trên đường đi học', '#14b8a6', 'road|con đường|🛣️;traffic light|đèn giao thông|🚦;stop sign|biển dừng|🛑;children crossing|biển trẻ em qua đường|🚸;bicycle|xe đạp|🚲;bus|xe buýt|🚌;bus stop|trạm xe buýt|🚏;car|ô tô|🚗;motorbike|xe máy|🏍️;scooter|xe tay ga|🛵;taxi|xe taxi|🚕;truck|xe tải|🚚;ambulance|xe cứu thương|🚑;police officer|cảnh sát|👮;bridge|cây cầu|🌉;tree|cái cây|🌳;shop|cửa hàng|🏪;fuel pump|cây xăng|⛽;park|công viên|🏞️;walk|đi bộ|🚶;ride|đạp xe|🚴;turn left|rẽ trái|⬅️;turn right|rẽ phải|➡️;go straight|đi thẳng|⬆️'],
    ['🏫', 'Đến trường', '#ef4444', 'school|trường học|🏫;teacher|giáo viên|👩‍🏫;student|học sinh|🧑‍🎓;friends|bạn bè|👫;flag|lá cờ|🚩;bell|cái chuông|🔔;hello|xin chào|👋;line up|xếp hàng|🧍;library|thư viện|🏛️;canteen|căng tin|🍱;clock|đồng hồ|🕗;timetable|thời khóa biểu|📋;notice board|bảng tin|📌;computer room|phòng máy tính|💻;restroom|nhà vệ sinh|🚻;drinking water|nước uống|🚰;football|bóng đá|⚽;basketball|bóng rổ|🏀;building|tòa nhà|🏢;principal|thầy hiệu trưởng|👨‍💼;school bag|cặp sách|🎒;morning|buổi sáng|🌅'],
    ['📖', 'Lớp học', '#8b5cf6', 'book|quyển sách|📖;notebook|quyển vở|📓;pencil|bút chì|✏️;pen|bút mực|🖊️;ruler|thước kẻ|📏;eraser|cục tẩy|@eraser;glue|hồ dán|@glue;scissors|cái kéo|✂️;crayon|bút sáp màu|🖍️;blackboard|bảng đen|@blackboard;desk|bàn học|@desk;chair|cái ghế|🪑;computer|máy tính|💻;map|bản đồ|🗺️;globe|quả địa cầu|🌍;calculator|máy tính bấm|🧮;paper clip|kẹp giấy|📎;folder|tập tài liệu|📁;read|đọc|📖;write|viết|✍️;raise hand|giơ tay|🙋;listen|lắng nghe|👂;test|bài kiểm tra|💯;letters|chữ cái|🔤'],
    ['🪁', 'Giờ ra chơi', '#f97316', 'play|chơi|🤹;ball|quả bóng|🏐;kite|con diều|🪁;yo-yo|yo-yo|🪀;puzzle|trò xếp hình|🧩;dice|xúc xắc|🎲;balloon|bóng bay|🎈;hide and seek|trốn tìm|🙈;run|chạy|🏃;jump|nhảy|🤸;football|bóng đá|⚽;badminton|cầu lông|🏸;table tennis|bóng bàn|🏓;chess|cờ vua|♟️;ice cream|kem|🍦;candy|kẹo|🍬;cookie|bánh quy|🍪;soft drink|nước ngọt|🥤;popcorn|bắp rang|🍿;friends|bạn bè|👫;laugh|cười|😂;happy|vui vẻ|😊;tired|mệt|😫'],
    ['🏠', 'Về nhà', '#16a34a', 'house|ngôi nhà|🏠;key|chìa khóa|🔑;door|cửa ra vào|🚪;family|gia đình|👪;mother|mẹ|👩;father|bố|👨;grandmother|bà|👵;grandfather|ông|👴;baby|em bé|👶;brother|anh/em trai|👦;sister|chị/em gái|👧;uncle|chú / bác|🧔;aunt|cô / dì|👩‍🦰;dog|con chó|🐶;cat|con mèo|🐱;sofa|ghế sofa|🛋️;television|ti vi|📺;telephone|điện thoại bàn|☎️;garden|khu vườn|🏡;flower|bông hoa|🌸;hug|ôm|🤗;rest|nghỉ ngơi|😌'],
    ['🏃', 'Tập thể dục', '#0284c7', 'running|chạy bộ|🏃;swimming|bơi lội|🏊;cycling|đạp xe|🚴;football|bóng đá|⚽;badminton|cầu lông|🏸;volleyball|bóng chuyền|🏐;basketball|bóng rổ|🏀;tennis|quần vợt|🎾;table tennis|bóng bàn|🏓;yoga|yoga|🧘;dance|nhảy múa|💃;gymnastics|thể dục dụng cụ|🤸;weightlifting|cử tạ|🏋️;karate|võ karate|🥋;skateboard|ván trượt|🛹;muscle|cơ bắp|💪;strong|khỏe mạnh|🦾;sweat|mồ hôi|😓;sneakers|giày thể thao|👟;water|nước|💧;medal|huy chương|🏅;trophy|chiếc cúp|🏆;park|công viên|🏞️;stadium|sân vận động|🏟️'],
    ['🚿', 'Tắm giặt', '#06b6d4', 'shower|vòi hoa sen|🚿;bathtub|bồn tắm|🛁;shampoo|dầu gội|🧴;soap|xà phòng|🧼;towel|khăn tắm|@towel;sponge|bọt biển|🧽;bubbles|bọt xà phòng|🫧;rubber duck|vịt cao su|🦆;hot|nóng|🥵;cold|lạnh|🥶;wet|ướt|💦;dry|khô|🌬️;clean|sạch sẽ|✨;dirty|bẩn|🐽;hair|mái tóc|💇;hair dryer|máy sấy tóc|@hairdryer;washing machine|máy giặt|@washer;laundry basket|giỏ đồ giặt|🧺;clothes|quần áo|👚;bucket|cái xô|🪣;germs|vi khuẩn|🦠'],
    ['🍲', 'Ăn tối', '#dc2626', 'rice|cơm|🍚;fish|cá|🐟;chicken|thịt gà|🍗;meat|thịt|🥩;shrimp|con tôm|🦐;soup|món canh|🍲;vegetables|rau|🥬;tomato|cà chua|🍅;carrot|cà rốt|🥕;potato|khoai tây|🥔;corn|bắp ngô|🌽;egg|quả trứng|🥚;plate|cái đĩa|🍽️;bowl|cái bát|🥣;chopsticks|đôi đũa|🥢;spoon|cái thìa|🥄;cook|nấu ăn|👩‍🍳;stove|bếp ga|@stove;rice cooker|nồi cơm điện|@ricecooker;refrigerator|tủ lạnh|@fridge;pot|cái nồi|🫕;frying pan|cái chảo|🍳;salt|muối|🧂;watermelon|dưa hấu|🍉'],
    ['📝', 'Học bài', '#7c3aed', 'homework|bài tập về nhà|📝;study|học bài|📚;think|suy nghĩ|🤔;idea|ý tưởng|💡;brain|bộ não|🧠;question|câu hỏi|❓;answer|câu trả lời|✅;correct|đúng|✔️;wrong|sai|❌;plus|dấu cộng|➕;minus|dấu trừ|➖;number|con số|🔢;math|môn toán|📐;science|khoa học|🔬;history|lịch sử|📜;art|mỹ thuật|🎨;music|âm nhạc|🎵;English|tiếng Anh|🔤;quiet|yên lặng|🤫;desk|bàn học|@desk;star|ngôi sao|⭐;good job|giỏi lắm|👍'],
    ['🌙', 'Chuẩn bị đi ngủ', '#0d9488', 'broom|cái chổi|🧹;trash can|thùng rác|🗑️;wash hands|rửa tay|👐;wash feet|rửa chân|🦶;toothbrush|bàn chải đánh răng|🪥;pajamas|đồ ngủ|@pajamas;school bag|cặp sách|🎒;alarm clock|đồng hồ báo thức|⏰;mosquito|con muỗi|🦟;medicine|thuốc|💊;thermometer|nhiệt kế|🌡️;fever|sốt|🤒;sneeze|hắt hơi|🤧;tissue|khăn giấy|@tissue;bandage|băng dán|🩹;nail|móng tay|💅;night|ban đêm|🌃;nine o\'clock|chín giờ|🕘;lights off|tắt đèn|🔦;fan|cái quạt|@fan;air conditioner|điều hòa|@aircon;curtain|rèm cửa|@curtain'],
    ['😴', 'Đi ngủ', '#4338ca', 'sleep|ngủ|😴;dream|giấc mơ|💭;snore|ngáy|💤;nightmare|ác mộng|😱;good night|chúc ngủ ngon|🌛;storybook|truyện cổ tích|📚;lullaby|bài hát ru|🎶;bedtime|giờ đi ngủ|🛌;kiss|hôn|😘;hug|ôm|🤗;night sky|bầu trời đêm|🌌;moon|mặt trăng|🌙;full moon|trăng tròn|🌕;star|ngôi sao|⭐;shooting star|sao băng|🌠;owl|con cú|🦉;bat|con dơi|🦇;cricket|con dế|🦗;candle|ngọn nến|🕯️;blanket|cái chăn|@blanket;pillow|cái gối|@pillow;teddy bear|gấu bông|🧸;close eyes|nhắm mắt|😌;dark|bóng tối|🌑']
  ].map(function (r) { return { i: r[0], n: r[1], c: r[2], w: parseW(r[3]) }; });
  var CH = [['Buổi sáng ở nhà', 0, 4], ['Đi học', 4, 8], ['Buổi chiều', 8, 11], ['Buổi tối', 11, 15]];
  var DAYWORDS = L.reduce(function (a, l) { return a + l.w.length; }, 0);

  /* ================= NHỮNG CÂU GIAO TIẾP CƠ BẢN =================
     Mỗi câu: [tiếng Anh, nghĩa tiếng Việt, chữ Hán, pinyin]. Thêm câu mới vào đúng nhóm. */
  var LANG = 'en';
  var PHR = [
    { i: '👋', n: 'Chào hỏi', c: '#3b82f6', p: [["Hello!", "Xin chào!", "你好！", "Nǐ hǎo!"], ["Good morning!", "Chào buổi sáng!", "早上好！", "Zǎoshang hǎo!"], ["Good afternoon!", "Chào buổi chiều!", "下午好！", "Xiàwǔ hǎo!"], ["Good evening!", "Chào buổi tối!", "晚上好！", "Wǎnshang hǎo!"], ["Good night!", "Chúc ngủ ngon!", "晚安！", "Wǎn'ān!"], ["Goodbye!", "Tạm biệt!", "再见！", "Zàijiàn!"], ["See you tomorrow!", "Hẹn gặp lại ngày mai!", "明天见！", "Míngtiān jiàn!"], ["How are you?", "Bạn có khỏe không?", "你好吗？", "Nǐ hǎo ma?"], ["I'm fine, thank you.", "Mình khỏe, cảm ơn bạn.", "我很好，谢谢。", "Wǒ hěn hǎo, xièxie."], ["Nice to meet you.", "Rất vui được gặp bạn.", "很高兴认识你。", "Hěn gāoxìng rènshi nǐ."], ["Welcome!", "Chào mừng!", "欢迎！", "Huānyíng!"]] },
    { i: '🙋', n: 'Giới thiệu bản thân', c: '#8b5cf6', p: [["What's your name?", "Bạn tên là gì?", "你叫什么名字？", "Nǐ jiào shénme míngzi?"], ["My name is Nam.", "Mình tên là Nam.", "我叫阿南。", "Wǒ jiào Ā Nán."], ["How old are you?", "Bạn bao nhiêu tuổi?", "你几岁了？", "Nǐ jǐ suì le?"], ["I am eight years old.", "Mình tám tuổi.", "我八岁了。", "Wǒ bā suì le."], ["Where are you from?", "Bạn đến từ đâu?", "你是哪国人？", "Nǐ shì nǎ guó rén?"], ["I'm from Vietnam.", "Mình đến từ Việt Nam.", "我是越南人。", "Wǒ shì Yuènán rén."], ["Where do you live?", "Bạn sống ở đâu?", "你住在哪里？", "Nǐ zhù zài nǎlǐ?"], ["I live in Hanoi.", "Mình sống ở Hà Nội.", "我住在河内。", "Wǒ zhù zài Hénèi."], ["I'm a student.", "Mình là học sinh.", "我是学生。", "Wǒ shì xuésheng."], ["This is my mother.", "Đây là mẹ của mình.", "这是我妈妈。", "Zhè shì wǒ māma."], ["I like reading books.", "Mình thích đọc sách.", "我喜欢看书。", "Wǒ xǐhuan kàn shū."]] },
    { i: '🙏', n: 'Lời cảm ơn & xin lỗi', c: '#14b8a6', p: [["Thank you!", "Cảm ơn bạn!", "谢谢！", "Xièxie!"], ["You're welcome.", "Không có gì.", "不客气。", "Bú kèqi."], ["I'm sorry.", "Mình xin lỗi.", "对不起。", "Duìbuqǐ."], ["That's OK.", "Không sao đâu.", "没关系。", "Méi guānxi."], ["Please.", "Làm ơn.", "请。", "Qǐng."], ["Excuse me.", "Xin lỗi, làm phiền một chút.", "打扰一下。", "Dǎrǎo yíxià."], ["Can you help me?", "Bạn giúp mình được không?", "你能帮我吗？", "Nǐ néng bāng wǒ ma?"], ["Of course!", "Tất nhiên rồi!", "当然！", "Dāngrán!"], ["I don't understand.", "Mình không hiểu.", "我不明白。", "Wǒ bù míngbai."], ["Please say it again.", "Bạn nói lại lần nữa nhé.", "请再说一遍。", "Qǐng zài shuō yí biàn."], ["Please speak slowly.", "Bạn nói chậm một chút nhé.", "请说慢一点。", "Qǐng shuō màn yìdiǎn."]] },
    { i: '🏫', n: 'Ở trường', c: '#ef4444', p: [["Good morning, teacher!", "Chúng em chào cô ạ!", "老师早！", "Lǎoshī zǎo!"], ["May I come in?", "Em vào lớp được không ạ?", "我可以进来吗？", "Wǒ kěyǐ jìnlai ma?"], ["I have a question.", "Em có một câu hỏi.", "我有一个问题。", "Wǒ yǒu yí ge wèntí."], ["What does this mean?", "Cái này nghĩa là gì?", "这是什么意思？", "Zhè shì shénme yìsi?"], ["Open your books.", "Các em mở sách ra.", "请打开书。", "Qǐng dǎkāi shū."], ["Listen carefully.", "Các em chú ý lắng nghe.", "认真听。", "Rènzhēn tīng."], ["Stand up, please.", "Mời các em đứng lên.", "请起立。", "Qǐng qǐlì."], ["Sit down, please.", "Mời các em ngồi xuống.", "请坐。", "Qǐng zuò."], ["Can I borrow your pen?", "Cho mình mượn bút được không?", "我可以借你的笔吗？", "Wǒ kěyǐ jiè nǐ de bǐ ma?"], ["Let's play together!", "Chúng mình cùng chơi nhé!", "我们一起玩吧！", "Wǒmen yìqǐ wán ba!"], ["I forgot my homework.", "Em quên mang bài tập về nhà.", "我忘了带作业。", "Wǒ wàngle dài zuòyè."]] },
    { i: '🏠', n: 'Ở nhà', c: '#16a34a', p: [["I'm home!", "Con về rồi ạ!", "我回来了！", "Wǒ huílai le!"], ["I'm hungry.", "Con đói rồi.", "我饿了。", "Wǒ è le."], ["I'm thirsty.", "Con khát nước.", "我渴了。", "Wǒ kě le."], ["I'm tired.", "Con mệt rồi.", "我累了。", "Wǒ lèi le."], ["Dinner is ready!", "Ăn cơm thôi!", "吃饭了！", "Chī fàn le!"], ["Wash your hands.", "Đi rửa tay đi con.", "去洗手。", "Qù xǐ shǒu."], ["I love you, Mom.", "Con yêu mẹ.", "妈妈，我爱你。", "Māma, wǒ ài nǐ."], ["Can I watch TV?", "Con xem ti vi được không ạ?", "我可以看电视吗？", "Wǒ kěyǐ kàn diànshì ma?"], ["Let me help you.", "Để con giúp ạ.", "我来帮你。", "Wǒ lái bāng nǐ."], ["Where is my bag?", "Cặp của con đâu rồi?", "我的书包在哪儿？", "Wǒ de shūbāo zài nǎr?"], ["It's time for bed.", "Đến giờ đi ngủ rồi.", "该睡觉了。", "Gāi shuìjiào le."]] },
    { i: '🛒', n: 'Mua sắm', c: '#f59e0b', p: [["How much is this?", "Cái này bao nhiêu tiền?", "这个多少钱？", "Zhège duōshao qián?"], ["It's too expensive.", "Đắt quá.", "太贵了。", "Tài guì le."], ["Can you make it cheaper?", "Bớt cho tôi một chút được không?", "可以便宜一点吗？", "Kěyǐ piányi yìdiǎn ma?"], ["I want this one.", "Tôi muốn cái này.", "我要这个。", "Wǒ yào zhège."], ["Do you have a smaller one?", "Có cái nhỏ hơn không?", "有小一点的吗？", "Yǒu xiǎo yìdiǎn de ma?"], ["Can I try it on?", "Tôi mặc thử được không?", "我可以试试吗？", "Wǒ kěyǐ shìshi ma?"], ["I'll take it.", "Tôi lấy cái này.", "我买了。", "Wǒ mǎi le."], ["Can I pay by card?", "Tôi trả bằng thẻ được không?", "可以刷卡吗？", "Kěyǐ shuā kǎ ma?"], ["I'm just looking.", "Tôi chỉ xem thôi.", "我只是看看。", "Wǒ zhǐshì kànkan."], ["Here you are.", "Gửi bạn.", "给你。", "Gěi nǐ."]] },
    { i: '🍜', n: 'Ăn uống', c: '#f97316', p: [["The menu, please.", "Cho tôi xem thực đơn.", "请给我菜单。", "Qǐng gěi wǒ càidān."], ["What do you recommend?", "Bạn gợi ý món gì?", "你推荐什么？", "Nǐ tuījiàn shénme?"], ["A glass of water, please.", "Cho tôi một cốc nước.", "请给我一杯水。", "Qǐng gěi wǒ yì bēi shuǐ."], ["Not spicy, please.", "Đừng cho cay nhé.", "不要辣。", "Bú yào là."], ["It's delicious!", "Ngon quá!", "很好吃！", "Hěn hǎochī!"], ["I'm full.", "Tôi no rồi.", "我吃饱了。", "Wǒ chī bǎo le."], ["One more bowl, please.", "Cho thêm một bát nữa.", "再来一碗。", "Zài lái yì wǎn."], ["Enjoy your meal!", "Chúc ngon miệng!", "请慢用！", "Qǐng màn yòng!"], ["Cheers!", "Cạn ly!", "干杯！", "Gānbēi!"], ["The bill, please.", "Cho tôi thanh toán.", "买单。", "Mǎidān."]] },
    { i: '🧭', n: 'Hỏi đường & đi lại', c: '#0891b2', p: [["Where is the toilet?", "Nhà vệ sinh ở đâu?", "洗手间在哪儿？", "Xǐshǒujiān zài nǎr?"], ["How do I get to the station?", "Đến nhà ga đi thế nào?", "去车站怎么走？", "Qù chēzhàn zěnme zǒu?"], ["Turn left.", "Rẽ trái.", "向左转。", "Xiàng zuǒ zhuǎn."], ["Turn right.", "Rẽ phải.", "向右转。", "Xiàng yòu zhuǎn."], ["Go straight.", "Đi thẳng.", "一直走。", "Yìzhí zǒu."], ["Is it far?", "Có xa không?", "远吗？", "Yuǎn ma?"], ["It's near here.", "Ở ngay gần đây.", "就在附近。", "Jiù zài fùjìn."], ["I'm lost.", "Tôi bị lạc đường.", "我迷路了。", "Wǒ mílù le."], ["Please take me to this address.", "Làm ơn đưa tôi đến địa chỉ này.", "请带我去这个地址。", "Qǐng dài wǒ qù zhège dìzhǐ."], ["Stop here, please.", "Làm ơn dừng ở đây.", "请在这里停车。", "Qǐng zài zhèlǐ tíngchē."]] },
    { i: '⏰', n: 'Thời gian & thời tiết', c: '#0f766e', p: [["What time is it?", "Bây giờ là mấy giờ?", "现在几点？", "Xiànzài jǐ diǎn?"], ["It's seven o'clock.", "Bây giờ là bảy giờ.", "现在七点。", "Xiànzài qī diǎn."], ["What day is it today?", "Hôm nay là thứ mấy?", "今天星期几？", "Jīntiān xīngqī jǐ?"], ["Today is Monday.", "Hôm nay là thứ Hai.", "今天星期一。", "Jīntiān xīngqīyī."], ["It's sunny today.", "Hôm nay trời nắng.", "今天是晴天。", "Jīntiān shì qíngtiān."], ["It's raining.", "Trời đang mưa.", "下雨了。", "Xià yǔ le."], ["It's very hot.", "Trời nóng quá.", "天气很热。", "Tiānqì hěn rè."], ["It's very cold.", "Trời lạnh quá.", "天气很冷。", "Tiānqì hěn lěng."], ["Hurry up!", "Nhanh lên!", "快点！", "Kuài diǎn!"], ["Wait a moment.", "Đợi một chút.", "等一下。", "Děng yíxià."]] },
    { i: '😊', n: 'Cảm xúc & lời chúc', c: '#eab308', p: [["I'm so happy!", "Mình vui quá!", "我很开心！", "Wǒ hěn kāixīn!"], ["Great job!", "Làm tốt lắm!", "做得好！", "Zuò de hǎo!"], ["You're amazing!", "Bạn giỏi quá!", "你真棒！", "Nǐ zhēn bàng!"], ["Don't worry.", "Đừng lo lắng.", "别担心。", "Bié dānxīn."], ["Good luck!", "Chúc may mắn!", "祝你好运！", "Zhù nǐ hǎoyùn!"], ["Happy birthday!", "Chúc mừng sinh nhật!", "生日快乐！", "Shēngrì kuàilè!"], ["Happy New Year!", "Chúc mừng năm mới!", "新年快乐！", "Xīnnián kuàilè!"], ["Congratulations!", "Xin chúc mừng!", "恭喜！", "Gōngxǐ!"], ["I miss you.", "Mình nhớ bạn.", "我想你。", "Wǒ xiǎng nǐ."], ["Be careful!", "Cẩn thận nhé!", "小心！", "Xiǎoxīn!"]] },
    { i: '🆘', n: 'Khi cần giúp đỡ', c: '#dc2626', p: [["Help!", "Cứu với!", "救命！", "Jiùmìng!"], ["Call the police!", "Gọi cảnh sát đi!", "快报警！", "Kuài bàojǐng!"], ["Call an ambulance!", "Gọi xe cấp cứu đi!", "快叫救护车！", "Kuài jiào jiùhùchē!"], ["I need a doctor.", "Tôi cần gặp bác sĩ.", "我需要看医生。", "Wǒ xūyào kàn yīshēng."], ["I don't feel well.", "Tôi thấy không khỏe.", "我不舒服。", "Wǒ bù shūfu."], ["It hurts here.", "Tôi đau ở chỗ này.", "这里疼。", "Zhèlǐ téng."], ["Fire!", "Cháy!", "着火了！", "Zháohuǒ le!"], ["I lost my phone.", "Tôi bị mất điện thoại.", "我的手机丢了。", "Wǒ de shǒujī diū le."], ["Please call my parents.", "Làm ơn gọi cho bố mẹ cháu.", "请给我爸爸妈妈打电话。", "Qǐng gěi wǒ bàba māma dǎ diànhuà."]] }
  ];
  var PHRN = PHR.reduce(function (a, g) { return a + g.p.length; }, 0);
  function phT(p) { return LANG === 'zh' ? p[2] : p[0]; }
  function phPy(p) { return LANG === 'zh' ? p[3] : ''; }
  function phSay(p) { stopSpeak(); speak(LANG === 'zh' ? p[2] : p[0]); }

  /* ================= TIẾN ĐỘ & LƯU TRỮ ================= */
  var P = { s: [], m: 0, lv: 1, mw: {} };
  try { var q = JSON.parse(localStorage.getItem('dg_p')); if (q && q.s) P = q; } catch (e) {}
  while (P.s.length < 15) P.s.push(0);
  if (P.lv !== 2) P.lv = 1;
  if (!P.mw) P.mw = {};
  function save() { try { localStorage.setItem('dg_p', JSON.stringify(P)); } catch (e) {} }
  function best(id) { try { return +localStorage.getItem('wg_best_' + id) || 0; } catch (e) { return 0; } }
  function setBest(id, v) { try { localStorage.setItem('wg_best_' + id, v); } catch (e) {} }
  function plays(id) { try { return +localStorage.getItem('wg_plays_' + id) || 0; } catch (e) { return 0; } }
  function addPlay(id) { try { localStorage.setItem('wg_plays_' + id, plays(id) + 1); } catch (e) {} }

  /* ================= TIỆN ÍCH ================= */
  function money(n, sg) { var s = Math.abs(n).toLocaleString('vi-VN') + 'đ'; return n < 0 ? '−' + s : (sg && n > 0 ? '+' + s : s); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function ic(w, sz) { return w[2].charAt(0) === '@' ? '<img src="' + IMGS[w[2].slice(1)].src + '" style="width:' + sz + 'px;height:' + sz + 'px;vertical-align:middle">' : w[2]; }

  /* Đọc từ: từ sau chỉ được đọc khi từ trước đã đọc xong */
  var pend = 0;
  function speak(w) {
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
      var u = new SpeechSynthesisUtterance(w); u.lang = 'en-US'; u.rate = 0.85;
      var done = false;
      function fin() { if (done) return; done = true; pend = Math.max(0, pend - 1); }
      u.onend = fin; u.onerror = fin;
      setTimeout(fin, 4000); // phòng khi trình duyệt không báo kết thúc
      pend++;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function lkOpen() { return !window.SixLock || window.SixLock.isOpen(); }
  function lkAsk(fn) { if (window.SixLock) window.SixLock.ask(fn); else fn(); }
  function lkFree(n) { return Math.ceil(n / 3); }
  function sfx(k) { try { if (window.sfx) window.sfx(k); } catch (e) {} }
  function stopSpeak() { pend = 0; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }

  /* ================= CSS ================= */
  var st = document.createElement('style');
  st.textContent = '' +
  '.eg-root{position:fixed;left:0;top:0;right:0;bottom:0;height:100vh;height:100dvh;z-index:99999;display:none;flex-direction:column;background:linear-gradient(180deg,#0b1d3a,#1d4e89);color:#fff;font-family:' + TF + ';-webkit-font-smoothing:antialiased;-webkit-user-select:none;user-select:none;overflow:hidden}' +
  '.eg-root.on{display:flex}.eg-root *{box-sizing:border-box}' +
  '.eg-scr{display:none;flex:1;flex-direction:column;min-height:0}.eg-scr.on{display:flex}' +
  '.eg-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(12px,env(safe-area-inset-top)) 16px 10px}' +
  '.eg-title{font-size:20px;font-weight:800;line-height:1.25}.eg-top .eg-title.fl{flex:1;font-size:18px}' +
  '.eg-btn{border:0;border-radius:14px;padding:10px 16px;font-size:16px;font-weight:700;color:#fff;background:rgba(255,255,255,.16);cursor:pointer;font-family:inherit}' +
  '.eg-btn:active{transform:scale(.97)}.eg-btn.main{background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 6px 18px rgba(34,197,94,.35)}.eg-btn.sel{background:#f59e0b}' +
  '.eg-choice{flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:16px 18px max(24px,env(safe-area-inset-bottom));max-width:520px;width:100%;margin:0 auto}' +
  '.eg-big{border:0;border-radius:22px;padding:26px 16px;color:#fff;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 10px 24px rgba(0,0,0,.3)}' +
  '.eg-big:active{transform:scale(.98)}.eg-big .ic{font-size:54px;line-height:1.1;font-family:' + EF + '}.eg-big .nm{font-size:21px;font-weight:800;text-align:center}.eg-big .sub{font-size:13px;opacity:.92;text-align:center;line-height:1.4}' +
  '.eg-grid{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 16px max(20px,env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;align-content:start}' +
  '.eg-tw{display:flex;flex-direction:column;gap:5px;align-items:stretch}' +
  '.eg-gh{grid-column:1/-1;font-size:16px;font-weight:800;color:#fde68a;margin:10px 0 -4px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.18)}' +
  '.eg-pc{min-height:26px;display:flex;align-items:flex-end;justify-content:center}' +
  '.eg-pc span{background:#f59e0b;color:#3b2300;font-size:13px;font-weight:900;border-radius:999px;padding:3px 11px;box-shadow:0 3px 8px rgba(0,0,0,.3)}' +
  '.eg-topic{border:0;border-radius:18px;padding:18px 10px 14px;color:#fff;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 8px 20px rgba(0,0,0,.25);flex:1}' +
  '.eg-topic:active{transform:scale(.97)}.eg-topic .ic{font-size:46px;line-height:1.1;font-family:' + EF + '}.eg-topic .nm{font-size:16px;font-weight:800;text-align:center;line-height:1.25}.eg-topic .sub{font-size:12px;opacity:.92;text-align:center}' +
  '.eg-scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 16px max(20px,env(safe-area-inset-bottom))}' +
  '.eg-info{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;font-size:15px;font-weight:700}' +
  '.eg-scroll h3{font-size:15px;margin:14px 0 8px;color:#bcd3ff}' +
  '.eg-nodes{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}' +
  '.eg-node{border:0;border-radius:16px;padding:12px 8px;color:#fff;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:0 6px 16px rgba(0,0,0,.25)}' +
  '.eg-node .ic{font-size:34px;font-family:' + EF + '}.eg-node .nm{font-size:14px;font-weight:800;text-align:center;line-height:1.25}.eg-node .st{font-size:15px;color:#fde68a;letter-spacing:2px}.eg-node .rv{font-size:11px;color:#fecaca;font-weight:700}' +
  '.eg-node.lock{filter:grayscale(1) brightness(.6);cursor:default}' +
  '.eg-words{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin:10px 0 16px}' +
  '.eg-wd{background:rgba(255,255,255,.12);border-radius:14px;padding:10px 6px;text-align:center;cursor:pointer;font-size:13px}.eg-wd.rv{background:rgba(239,68,68,.28)}' +
  '.eg-wd .e{font-size:34px;line-height:1.2;font-family:' + EF + '}.eg-wd b{display:block;font-size:15px}.eg-wd span{opacity:.85}' +
  '.eg-hud{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:max(10px,env(safe-area-inset-top)) 14px 8px}' +
  '.eg-pill{background:rgba(255,255,255,.16);border-radius:999px;padding:7px 12px;font-size:16px;font-weight:800;white-space:nowrap;font-variant-numeric:tabular-nums}.eg-pill.bad{color:#fecaca}' +
  '.eg-bar{height:6px;margin:0 14px 6px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden}.eg-bar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#22c55e,#facc15,#ef4444);transform-origin:left}' +
  '.eg-spd{display:flex;align-items:center;gap:8px;margin:0 14px 6px;font-size:14px;color:#cfe0ff}.eg-spd input{flex:1;min-width:0;accent-color:#22c55e;height:28px}.eg-spd b{min-width:48px;text-align:right;color:#fff;font-variant-numeric:tabular-nums}' +
  '.eg-stage{position:relative;flex:1;min-height:0;touch-action:none}.eg-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}' +
  '.eg-mean{padding:12px 16px max(16px,env(safe-area-inset-bottom));background:rgba(8,20,45,.78);border-top:2px solid rgba(255,255,255,.25);text-align:center}' +
  '.eg-mean small{display:block;font-size:12px;letter-spacing:1px;color:#9fc0ff;font-weight:700}.eg-mean b{display:block;font-size:30px;line-height:1.2;font-weight:800;margin-top:2px}' +
  '.eg-res{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:max(20px,env(safe-area-inset-top)) 18px max(24px,env(safe-area-inset-bottom));text-align:center}' +
  '.eg-res h2{margin:6px 0 4px;font-size:25px}.eg-stars{font-size:46px;color:#fde68a;letter-spacing:6px}.eg-mny{font-size:40px;font-weight:900;margin:6px 0;font-variant-numeric:tabular-nums}' +
  '.eg-stats{display:flex;justify-content:center;gap:10px;margin:10px 0 14px;flex-wrap:wrap}.eg-stat{background:rgba(255,255,255,.12);border-radius:14px;padding:10px 14px;min-width:92px;font-size:13px}.eg-stat b{display:block;font-size:22px}' +
  '.eg-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0 18px}' +
  '.eg-list{text-align:left;max-width:520px;margin:0 auto}.eg-list h4{font-size:15px;margin:14px 0 6px;color:#bcd3ff}' +
  '.eg-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.09);margin-bottom:6px;font-size:15px}.eg-row.miss{background:rgba(239,68,68,.22)}' +
  '.eg-row .e{font-size:26px;font-family:' + EF + '}.eg-row b{display:block;font-size:16px}.eg-row span span{opacity:.85;font-size:14px}';
  st.textContent += '.eg-ph{background:rgba(255,255,255,.12);border-radius:16px;padding:12px 14px;margin-bottom:10px;cursor:pointer;display:flex;gap:12px;align-items:center}' +
  '.eg-ph:active{transform:scale(.99)}.eg-ph .sp{flex:none;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:20px}' +
  '.eg-ph .tx{flex:1;min-width:0}.eg-ph b{display:block;font-size:19px;line-height:1.35}.eg-ph i{display:block;font-style:normal;color:#fde68a;font-size:14px;margin-top:2px}.eg-ph span.vi{display:block;opacity:.88;font-size:14px;margin-top:3px}' +
  '.eg-pq{max-width:520px;margin:0 auto;text-align:center}.eg-pq .q{background:rgba(255,255,255,.14);border-radius:18px;padding:18px 14px;margin:8px 0 14px}.eg-pq .q b{display:block;font-size:24px;line-height:1.35}.eg-pq .q i{display:block;font-style:normal;color:#fde68a;margin-top:4px}' +
  '.eg-opt{display:block;width:100%;text-align:left;border:0;border-radius:14px;padding:13px 14px;margin-bottom:8px;font-size:16px;font-weight:700;color:#fff;background:rgba(255,255,255,.16);cursor:pointer;font-family:inherit}' +
  '.eg-opt.ok{background:#16a34a}.eg-opt.bad{background:#dc2626}.eg-opt:disabled{cursor:default}';
  document.head.appendChild(st);

  /* ================= DOM ================= */
  var root = document.createElement('div');
  root.className = 'eg-root';
  root.innerHTML = '' +
  '<div class="eg-scr on" id="egMenu"><div class="eg-top"><button class="eg-btn" data-a="close" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">🎮 Hãy chọn hình thức học bạn thích</div><button class="eg-btn" data-a="close">✕ Đóng</button></div>' +
    '<div class="eg-choice">' +
    '<button class="eg-big" data-a="topics" style="background:linear-gradient(145deg,#3b82f6,#1d4ed8)"><span class="ic">📚</span><span class="nm">Từ vựng tiếng Anh theo chủ đề</span><span class="sub">Chọn chủ đề yêu thích và hứng từ trong 2 phút</span></button>' +
    '<button class="eg-big" data-a="day" style="background:linear-gradient(145deg,#f59e0b,#ea580c)"><span class="ic">🌞</span><span class="nm">Một ngày của bé</span><span class="sub">Phá đảo 15 màn từ lúc thức dậy đến khi đi ngủ, hơn ' + DAYWORDS + ' từ vựng</span></button>' +
    '<button class="eg-big" data-a="phr" style="background:linear-gradient(145deg,#14b8a6,#0f766e)"><span class="ic">💬</span><span class="nm">Những câu giao tiếp cơ bản</span><span class="sub">' + PHRN + ' câu thông dụng theo ' + PHR.length + ' tình huống: nghe, đọc theo và luyện tập</span></button>' +
    '</div></div>' +
  '<div class="eg-scr" id="egTopics"><div class="eg-top"><button class="eg-btn" data-a="menu" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">Hãy chọn một chủ đề để bắt đầu chơi</div></div><div class="eg-grid" id="egGrid"></div></div>' +
  '<div class="eg-scr" id="egMap"><div class="eg-top"><button class="eg-btn" data-a="menu" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">🌞 Một ngày của bé</div></div>' +
    '<div class="eg-scroll"><div class="eg-info"><span id="egInfo"></span><span><button class="eg-btn" id="egL1" data-a="lv1" style="padding:6px 12px;font-size:14px">Cấp 1 (có hình)</button> <button class="eg-btn" id="egL2" data-a="lv2" style="padding:6px 12px;font-size:14px">Cấp 2 (chỉ chữ)</button></span></div><div id="egMapList"></div></div></div>' +
  '<div class="eg-scr" id="egIntro"><div class="eg-top"><button class="eg-btn" data-a="introback" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl" id="egIT"></div></div>' +
    '<div class="eg-scroll"><div style="font-size:14px;color:#cfe0ff;line-height:1.5" id="egIntroTxt"></div><div class="eg-words" id="egWords"></div><div style="text-align:center;position:sticky;bottom:0;padding:12px 0 4px;background:linear-gradient(rgba(29,78,137,0),#1d4e89 45%)"><button class="eg-btn main" data-a="go">▶ Bắt đầu</button></div></div></div>' +
  '<div class="eg-scr" id="egPlay"><div class="eg-hud"><button class="eg-btn" data-a="quit" style="padding:8px 12px">←</button><div class="eg-pill" id="egTime">⏱ 2:00</div><div class="eg-pill" id="egOk">✅ 0</div><div class="eg-pill" id="egMoney">💰 0đ</div></div>' +
    '<div class="eg-bar"><i id="egBar"></i></div>' +
    '<div class="eg-spd" id="egSpdRow"><span>🐢</span><input type="range" id="egSpd" min="0.3" max="1.5" step="0.1"><span>🐇</span><b id="egSpdV"></b></div>' +
    '<div class="eg-stage" id="egStage"><canvas id="egCv"></canvas></div>' +
    '<div class="eg-mean"><small>Nghĩa của từ – hứng từ tiếng Anh đúng</small><b id="egMean">…</b></div></div>' +
  '<div class="eg-scr" id="egPhr"><div class="eg-top"><button class="eg-btn" data-a="menu" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">💬 Những câu giao tiếp cơ bản</div></div><div class="eg-grid" id="egPhrGrid"></div></div>' +
  '<div class="eg-scr" id="egPhrL"><div class="eg-top"><button class="eg-btn" data-a="phr" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl" id="egPhrT"></div></div><div class="eg-scroll" id="egPhrList"></div></div>' +
  '<div class="eg-scr" id="egPhrQ"><div class="eg-top"><button class="eg-btn" data-a="phrback" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl" id="egPhrQT"></div></div><div class="eg-scroll"><div class="eg-pq" id="egPhrQB"></div></div></div>' +
  '<div class="eg-scr" id="egEnd"><div class="eg-top"><button class="eg-btn" data-a="endback" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">Kết quả</div></div><div class="eg-res" id="egRes" style="padding-top:4px"></div></div>';
  document.body.appendChild(root);

  var $ = function (id) { return document.getElementById(id); };
  var scr = { menu: $('egMenu'), topics: $('egTopics'), map: $('egMap'), intro: $('egIntro'), play: $('egPlay'), end: $('egEnd'), phr: $('egPhr'), phrl: $('egPhrL'), phrq: $('egPhrQ') };
  function show(k) { for (var n in scr) scr[n].classList.toggle('on', n === k); }
  var cv = $('egCv'), ctx = cv.getContext('2d'), stage = $('egStage');
  var meanEl = $('egMean'), spdEl = $('egSpd'), spdV = $('egSpdV');
  function spdLabel() { spdV.textContent = 'x' + SPEED.toFixed(1).replace('.', ','); }
  spdEl.value = SPEED; spdLabel();
  spdEl.addEventListener('input', function () { SPEED = parseFloat(spdEl.value) || 1; try { localStorage.setItem('wg_speed', SPEED); } catch (e) {} spdLabel(); });

  /* ================= MÀN CHỌN CHỦ ĐỀ ================= */
  function renderTopics() {
    var grid = $('egGrid'); grid.innerHTML = '';
    var lastG = -1;
    MENU.forEach(function (t, ti) {
      var tl = ti >= lkFree(MENU.length) && !lkOpen();
      if (t.g !== lastG) { lastG = t.g; var hh = document.createElement('div'); hh.className = 'eg-gh'; hh.textContent = t.g < GROUPS.length ? GROUPS[t.g] : '🎲 Ôn tập'; grid.appendChild(hh); }
      var w = document.createElement('div'); w.className = 'eg-tw';
      var n = plays(t.id), bs = best(t.id);
      var pc = document.createElement('div'); pc.className = 'eg-pc';
      if (n > 0) pc.innerHTML = '<span>🔁 Đã chơi ' + n + ' lần</span>';
      var b = document.createElement('button'); b.className = 'eg-topic';
      b.style.background = 'linear-gradient(145deg,' + t.c + ',' + t.c + 'bb)';
      b.innerHTML = '<span class="ic">' + (tl ? '🔒' : t.i) + '</span><span class="nm">' + t.n + '</span><span class="sub">' + t.w.length + ' từ' + (bs ? ' · Kỷ lục ' + money(bs) : '') + '</span>';
      b.onclick = function () { if (ti >= lkFree(MENU.length) && !lkOpen()) lkAsk(function () { renderTopics(); openTopicIntro(t); }); else openTopicIntro(t); };
      w.appendChild(pc); w.appendChild(b); grid.appendChild(w);
    });
  }

  /* ================= BẢN ĐỒ "MỘT NGÀY CỦA BÉ" ================= */
  var cur = 0;
  function renderMap() {
    var tot = P.s.reduce(function (a, b) { return a + b; }, 0);
    $('egInfo').textContent = '⭐ ' + tot + '/45 · 💰 ' + money(P.m);
    $('egL1').classList.toggle('sel', P.lv === 1); $('egL2').classList.toggle('sel', P.lv === 2);
    var h = '';
    CH.forEach(function (c) {
      h += '<h3>' + c[0] + '</h3><div class="eg-nodes">';
      for (var i = c[1]; i < c[2]; i++) {
        var lock = i > 0 && !P.s[i - 1], rv = (P.mw[i] || []).length;
        h += '<button class="eg-node' + (lock ? ' lock' : '') + '" ' + (lock ? '' : 'data-a="lvl" data-i="' + i + '"') + ' style="background:linear-gradient(145deg,' + L[i].c + ',' + L[i].c + 'bb)"><span class="ic">' + (lock ? '🔒' : L[i].i) + '</span><span class="nm">' + (i >= lkFree(L.length) && !lkOpen() ? '🔒 ' : '') + (i + 1) + '. ' + L[i].n + '</span><span class="st">' + stars(P.s[i]) + '</span>' + (rv && !lock ? '<span class="rv">📌 ' + rv + ' từ cần ôn</span>' : '') + '</button>';
      }
      h += '</div>';
    });
    $('egMapList').innerHTML = h;
  }
  var introT = null, introW = [];
  function openTopicIntro(t) {
    stopSpeak();
    introT = t; introW = t.w;
    var bs = best(t.id);
    $('egIT').textContent = t.i + ' Chủ đề: ' + t.n;
    $('egIntroTxt').innerHTML = 'Chủ đề này có <b>' + t.w.length + '</b> từ vựng. Chạm vào từng thẻ để nghe phát âm và nhớ nghĩa, rồi bấm Bắt đầu. Trong 2 phút, hãy hứng đúng từ tiếng Anh khớp với nghĩa tiếng Việt ở phía dưới màn hình.' + (bs ? '<br>🏆 Kỷ lục của bạn: <b>' + money(bs) + '</b>' : '');
    $('egWords').innerHTML = t.w.map(function (w, k) { return '<div class="eg-wd" data-a="say" data-i="' + k + '"><div class="e">' + ic(w, 36) + '</div><b>' + w[0] + '</b><span>' + w[1] + '</span></div>'; }).join('');
    $('egIntro').querySelector('.eg-scroll').scrollTop = 0;
    show('intro');
  }
  function openIntro(i) {
    introT = null; introW = L[i].w;
    cur = i; var lv = L[i], N = lv.w.length, mw = P.mw[i] || [];
    $('egIT').textContent = lv.i + ' Màn ' + (i + 1) + ': ' + lv.n;
    var need = Math.ceil(N * 0.6);
    $('egIntroTxt').innerHTML = 'Chạm vào từng thẻ để nghe phát âm, làm quen rồi bấm Bắt đầu. Cần hứng đúng ít nhất <b>' + need + '/' + N + '</b> từ để qua màn.' +
      (mw.length ? '<br>📌 Có <b>' + mw.length + '</b> từ (nền đỏ) bạn chọn sai lần trước – chúng sẽ xuất hiện sớm hơn và nhiều hơn.' : '');
    $('egWords').innerHTML = lv.w.map(function (w, k) { return '<div class="eg-wd' + (mw.indexOf(w[0]) >= 0 ? ' rv' : '') + '" data-a="say" data-i="' + k + '"><div class="e">' + ic(w, 36) + '</div><b>' + w[0] + '</b><span>' + w[1] + '</span></div>'; }).join('');
    show('intro');
  }

  /* ================= ĐỘNG CƠ GAME ================= */
  var G = null, raf = 0, W = 0, H = 0, DPR = 2, keys = {};
  function resize() {
    var r = stage.getBoundingClientRect();
    W = Math.max(200, r.width); H = Math.max(200, r.height);
    DPR = Math.min(4, Math.max(2, window.devicePixelRatio || 1));
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (G) { G.bw = Math.min(130, W * 0.3); G.tx = Math.min(W - G.bw / 2, Math.max(G.bw / 2, G.tx)); }
  }
  function begin() {
    resize(); G.bx = G.tx = W / 2; G.bw = Math.min(130, W * 0.3);
    meanEl.textContent = 'Sẵn sàng…'; hud();
    cancelAnimationFrame(raf); G.last = performance.now(); raf = requestAnimationFrame(loop);
  }
  function startTopic(topic) {
    stopSpeak(); addPlay(topic.id);
    $('egSpdRow').style.display = '';
    show('play');
    G = { mode: 'topic', topic: topic, secs: GAME_SECONDS, left: GAME_SECONDS, money: 0, ok: 0, bad: 0, items: [], floats: [], bag: [],
          got: {}, missed: {}, wait: 0.4, target: null, bx: 0, tx: 0, bw: 120, flash: 0, flashC: '', last: 0, pic: true };
    begin();
  }
  function startDay(li) {
    stopSpeak(); cur = li;
    $('egSpdRow').style.display = 'none';
    show('play');
    var words = L[li].w, mw = P.mw[li] || [];
    var pri = words.filter(function (w) { return mw.indexOf(w[0]) >= 0; });
    var rest = words.filter(function (w) { return mw.indexOf(w[0]) < 0; });
    var q = shuffle(pri.slice()).map(function (w) { return { w: w, rep: false }; })
      .concat(shuffle(rest.slice()).map(function (w) { return { w: w, rep: false }; }))
      .concat(shuffle(pri.slice()).map(function (w) { return { w: w, rep: true }; }));
    var secs = Math.round(q.length * DAY_SEC_PER_WORD + 8);
    G = { mode: 'day', li: li, total: words.length, q: q, qi: 0, secs: secs, left: secs, money: 0, ok: 0, bad: 0, items: [], floats: [], got: {}, missed: {},
          wait: 0.4, target: null, bx: 0, tx: 0, bw: 120, flash: 0, flashC: '', last: 0, pic: P.lv === 1 };
    begin();
  }
  function nextDay() {
    while (G.qi < G.q.length) {
      var e = G.q[G.qi++];
      if (e.rep && G.missed[e.w[0]]) continue;   // từ đã chọn sai trong lượt này thì không hiện lại
      return e.w;
    }
    return null;
  }
  function newRound() {
    var t, pool, n;
    if (G.mode === 'topic') {
      if (!G.bag.length) G.bag = shuffle(G.topic.w.slice());
      t = G.bag.pop(); pool = G.topic.w.slice(); n = W > 560 ? 4 : 3;
    } else {
      t = nextDay(); if (!t) return false;
      pool = L[G.li].w.slice();
      for (var p = 0; p < G.li; p++) pool = pool.concat(shuffle(L[p].w.slice()).slice(0, 2));
      n = (G.li >= 7 || P.lv === 2) ? 4 : 3;
    }
    G.target = t; meanEl.textContent = t[1]; speak(t[0]);
    var seen = {}; seen[t[0]] = 1; seen[t[2]] = 1;
    var opts = shuffle(pool).filter(function (w) { if (seen[w[0]] || seen[w[2]]) return false; seen[w[0]] = 1; seen[w[2]] = 1; return true; }).slice(0, n - 1);
    opts = shuffle([t].concat(opts));
    var lane = W / n, cw = Math.min(92, lane - 16), ch = G.pic ? cw * 1.12 : cw * 0.7;
    var base = H * (0.30 + 0.10 * (1 - G.left / G.secs));
    if (G.mode === 'day') base *= 0.6 + 0.3 * G.li / 14 + (P.lv === 2 ? 0.15 : 0);
    G.items = opts.map(function (o, i) {
      return { w: o, ok: o === t, x: i * lane + (lane - cw) / 2 + rand(-4, 4), y: -ch - rand(0, 40), cw: cw, ch: ch, vy: base * rand(0.92, 1.12) };
    });
  }
  function fl(x, y, text, color) { G.floats.push({ x: x, y: y, t: 0, text: text, color: color }); }
  function hud() {
    var s = Math.max(0, Math.ceil(G.left));
    $('egTime').textContent = '⏱ ' + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    $('egOk').textContent = G.mode === 'day' ? '✅ ' + Object.keys(G.got).length + '/' + G.total : '✅ ' + G.ok;
    var m = $('egMoney'); m.textContent = '💰 ' + money(G.money); m.classList.toggle('bad', G.money < 0);
    $('egBar').style.transform = 'scaleX(' + Math.max(0, G.left / G.secs) + ')';
  }
  function loop(now) {
    if (!G) return;
    var dt = Math.min(0.05, (now - G.last) / 1000); G.last = now;
    G.left -= dt;
    if (G.left <= 0) { G.left = 0; hud(); return finish(); }
    var sp = W * 1.3;
    if (keys.ArrowLeft || keys.a) G.tx -= sp * dt;
    if (keys.ArrowRight || keys.d) G.tx += sp * dt;
    G.tx = Math.min(W - G.bw / 2, Math.max(G.bw / 2, G.tx));
    G.bx += (G.tx - G.bx) * Math.min(1, dt * 20);

    if (!G.items.length) {
      G.wait -= dt;
      if (G.wait <= 0 && pend === 0) {            // chờ đọc xong từ trước mới sang từ mới
        if (newRound() === false) { hud(); return finish(); }
      }
    }
    var sm = G.mode === 'topic' ? SPEED : 1;
    var bh = 60, by = H - bh - 6, top = by + 6;
    for (var i = G.items.length - 1; i >= 0; i--) {
      var it = G.items[i]; it.y += it.vy * sm * dt;
      var ox = it.x + it.cw > G.bx - G.bw / 2 + 8 && it.x < G.bx + G.bw / 2 - 8;
      if (ox && it.y + it.ch >= top && it.y < by + bh) {
        if (it.ok) {
          G.money += REWARD; G.ok++; sfx('ok'); G.got[it.w[0]] = it.w;
          fl(G.bx, by - 10, money(REWARD, 1), '#4ade80');
          G.flash = 0.25; G.flashC = 'rgba(34,197,94,.30)';
          speak(it.w[0]); G.items = []; G.wait = 0.55; break;
        } else {
          G.money -= PENALTY; G.bad++; sfx('bad');
          if (G.mode === 'day') G.missed[G.target[0]] = G.target;
          fl(G.bx, by - 10, '−' + money(PENALTY), '#f87171');
          G.flash = 0.25; G.flashC = 'rgba(239,68,68,.30)';
          speak(it.w[0]); G.items.splice(i, 1);
        }
      } else if (it.y > H + 10) {
        if (it.ok) { G.missed[it.w[0]] = it.w; fl(W / 2, H * 0.5, 'Lỡ: ' + it.w[0], '#fde68a'); }
        G.items.splice(i, 1);
      }
    }
    hud(); draw(by, bh); raf = requestAnimationFrame(loop);
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function drawIcon(e, cx, cy, s) {
    if (e.charAt(0) === '@') {
      var im = IMGS[e.slice(1)];
      if (im && im.complete && im.naturalWidth) ctx.drawImage(im, cx - s / 2, cy - s / 2, s, s);
    } else {
      ctx.font = Math.round(s * 0.88) + 'px ' + EF; ctx.fillStyle = '#000'; ctx.fillText(e, cx, cy);
    }
  }
  function draw(by, bh) {
    ctx.clearRect(0, 0, W, H);
    if (G.flash > 0) { ctx.fillStyle = G.flashC; ctx.fillRect(0, 0, W, H); G.flash -= 0.016; }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (G.mode === 'day') { ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.font = Math.round(Math.min(W, H) * 0.7) + 'px ' + EF; ctx.fillText(L[G.li].i, W / 2, H * 0.45); }
    G.items.forEach(function (it) {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5; ctx.fillStyle = '#fff';
      rr(it.x, it.y, it.cw, it.ch, 16); ctx.fill(); ctx.restore();
      var txtY;
      if (G.pic) { drawIcon(it.w[2], it.x + it.cw / 2, it.y + it.ch * 0.38, it.cw * 0.52); txtY = it.y + it.ch * 0.80; }
      else txtY = it.y + it.ch / 2;
      var fs = Math.round(Math.max(14, it.cw * (G.pic ? 0.16 : 0.2)));
      ctx.font = '800 ' + fs + 'px ' + TF;
      while (ctx.measureText(it.w[0]).width > it.cw - 12 && fs > 9) { fs--; ctx.font = '800 ' + fs + 'px ' + TF; }
      ctx.fillStyle = '#0f2a52'; ctx.fillText(it.w[0], it.x + it.cw / 2, txtY);
    });
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; ctx.fillStyle = 'rgba(255,255,255,.22)';
    rr(G.bx - G.bw / 2, by + 20, G.bw, bh - 22, 14); ctx.fill(); ctx.restore();
    ctx.font = Math.round(Math.min(78, G.bw * 0.68)) + 'px ' + EF; ctx.fillStyle = '#000'; ctx.fillText('🧺', G.bx, by + bh * 0.52);
    for (var i = G.floats.length - 1; i >= 0; i--) {
      var f = G.floats[i]; f.t += 0.016; if (f.t > 1) { G.floats.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - f.t; ctx.font = '900 24px ' + TF; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.55)';
      ctx.strokeText(f.text, f.x, f.y - f.t * 50); ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y - f.t * 50); ctx.globalAlpha = 1;
    }
  }

  /* ================= KẾT THÚC ================= */
  function rows(keysArr, map, cls) {
    return keysArr.map(function (k) { var w = map[k];
      return '<div class="eg-row ' + cls + '"><span class="e">' + ic(w, 28) + '</span><span><b>' + w[0] + '</b><span>' + w[1] + '</span></span></div>'; }).join('');
  }
  function fe(a, ok) { try { if (window.farmEarn) window.farmEarn('en', a, ok); } catch (e) {} }
  function finish() {
    cancelAnimationFrame(raf); stopSpeak();
    var g = G;
    if (g.mode === 'topic') {
      var id = g.topic.id, prev = best(id), isNew = g.money > prev && g.money > 0; sfx(g.money > 0 ? 'win' : 'bad');
      if (isNew) setBest(id, g.money);
      fe(g.money, g.ok);
      var total = g.ok + g.bad, acc = total ? Math.round(g.ok * 100 / total) : 0;
      var h = '<div style="font-size:54px">' + (g.money > 0 ? '🎉' : '⏰') + '</div><h2>Hết giờ! – ' + g.topic.n + '</h2>' +
        '<div class="eg-mny" style="color:' + (g.money >= 0 ? '#4ade80' : '#f87171') + '">' + money(g.money, 1) + '</div>' +
        (isNew ? '<div style="color:#fde68a;font-weight:800">🏆 Kỷ lục mới!</div>' : (prev ? '<div style="opacity:.8">Kỷ lục: ' + money(prev) + '</div>' : '')) +
        '<div class="eg-stats"><div class="eg-stat"><b>' + g.ok + '</b>Hứng đúng</div><div class="eg-stat"><b>' + g.bad + '</b>Hứng sai</div><div class="eg-stat"><b>' + acc + '%</b>Chính xác</div></div>' +
        '<div class="eg-acts"><button class="eg-btn main" data-a="again">▶ Chơi lại</button><button class="eg-btn" data-a="topics">Chọn chủ đề</button></div>';
      var got = Object.keys(g.got), mis = Object.keys(g.missed).filter(function (k) { return !g.got[k]; });
      h += '<div class="eg-list">';
      if (got.length) h += '<h4>✅ Từ bạn đã nhớ (' + got.length + ')</h4>' + rows(got, g.got, '');
      if (mis.length) h += '<h4>📌 Từ cần ôn lại (' + mis.length + ')</h4>' + rows(mis, g.missed, 'miss');
      h += '</div>';
      $('egRes').innerHTML = h;
    } else {
      var N = g.total, n = Object.keys(g.got).length;
      var sr = n >= N - 1 ? 3 : n >= Math.ceil(N * 0.8) ? 2 : n >= Math.ceil(N * 0.6) ? 1 : 0, pass = sr > 0;
      var gain = g.money + (pass ? sr * 20000 : 0);
      var mis2 = Object.keys(g.missed).filter(function (k) { return !g.got[k]; });
      // các từ chưa hứng được (kể cả chưa kịp xuất hiện) cũng cần ôn
      L[g.li].w.forEach(function (w) { if (!g.got[w[0]] && !g.missed[w[0]]) { g.missed[w[0]] = w; mis2.push(w[0]); } });
      fe(gain, n);
      P.m = Math.max(0, P.m + gain); sfx(pass ? 'win' : 'bad'); if (sr > P.s[g.li]) P.s[g.li] = sr;
      if (mis2.length) P.mw[g.li] = mis2; else delete P.mw[g.li];
      save();
      var last = g.li === 14;
      var h2 = '<div style="font-size:54px">' + (pass ? '🎉' : '💪') + '</div><h2>' + (pass ? 'Qua màn ' + (g.li + 1) + '!' : 'Chưa qua màn, cố lên!') + '</h2>' +
        '<div class="eg-stars">' + stars(sr) + '</div><div>Hứng đúng <b>' + n + '/' + N + '</b> từ</div>' +
        '<div class="eg-mny" style="color:' + (gain >= 0 ? '#4ade80' : '#f87171') + '">' + money(gain, 1) + '</div>' +
        (pass ? '<div style="opacity:.85;font-size:14px">đã gồm thưởng ' + money(sr * 20000) + ' cho ' + sr + ' sao</div>' : '<div style="opacity:.85;font-size:14px">Cần hứng đúng ít nhất ' + Math.ceil(N * 0.6) + ' từ để qua màn</div>') +
        '<div class="eg-acts">' + (pass ? '<button class="eg-btn main" data-a="' + (last ? 'win' : 'next') + '">' + (last ? '🏆 Phá đảo!' : '▶ Màn tiếp theo') + '</button>' : '') +
        '<button class="eg-btn" data-a="retry">↻ Chơi lại</button><button class="eg-btn" data-a="map">Bản đồ</button></div>';
      if (mis2.length) h2 += '<div class="eg-list"><h4>📌 Từ cần ôn lại (' + mis2.length + ') – lần chơi lại sẽ xuất hiện nhiều hơn</h4>' + rows(mis2, g.missed, 'miss') + '</div>';
      $('egRes').innerHTML = h2;
    }
    $('egRes').scrollTop = 0; show('end');
  }
  function winScreen() {
    var tot = P.s.reduce(function (a, b) { return a + b; }, 0);
    $('egRes').innerHTML = '<div style="font-size:70px">🏆</div><h2>Phá đảo "Một ngày của bé"!</h2><div class="eg-stars">★</div>' +
      '<div>Bé đã hoàn thành cả 15 màn và học ' + DAYWORDS + ' từ vựng</div><div class="eg-mny" style="color:#fde68a">⭐ ' + tot + '/45</div>' +
      '<div style="font-size:18px;font-weight:800">Tổng tiền thưởng: ' + money(P.m) + '</div>' +
      '<div class="eg-acts"><button class="eg-btn main" data-a="map">Về bản đồ (chơi lại lấy thêm sao)</button></div>';
    show('end');
  }
  function toMap() { cancelAnimationFrame(raf); G = null; stopSpeak(); renderMap(); show('map'); }
  function toTopics() { cancelAnimationFrame(raf); G = null; stopSpeak(); renderTopics(); show('topics'); }


  /* ================= MÀN CÂU GIAO TIẾP ================= */
  var phG = 0, PQ = null;
  function renderPhr() {
    $('egPhrGrid').innerHTML = PHR.map(function (g, k) {
      return '<div class="eg-tw"><div class="eg-pc"></div><button class="eg-topic" data-a="phrcat" data-i="' + k + '" style="background:linear-gradient(145deg,' + g.c + ',' + g.c + 'bb)"><span class="ic">' + (k >= lkFree(PHR.length) && !lkOpen() ? '🔒' : g.i) + '</span><span class="nm">' + g.n + '</span><span class="sub">' + g.p.length + ' câu</span></button></div>';
    }).join('');
    show('phr');
  }
  function renderPhrList(k) {
    phG = k; var g = PHR[k];
    $('egPhrT').textContent = g.i + ' ' + g.n;
    $('egPhrList').innerHTML = '<div style="font-size:14px;color:#cfe0ff;line-height:1.5;margin-bottom:10px">Chạm vào từng câu để nghe phát âm rồi đọc theo. Học xong, bấm Luyện tập để kiểm tra.</div>' +
      g.p.map(function (p, i) { return '<div class="eg-ph" data-a="phsay" data-i="' + i + '"><span class="sp">🔊</span><span class="tx"><b>' + phT(p) + '</b>' + (phPy(p) ? '<i>' + phPy(p) + '</i>' : '') + '<span class="vi">' + p[1] + '</span></span></div>'; }).join('') +
      '<div style="text-align:center;position:sticky;bottom:0;padding:16px 0 6px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.45) 55%)"><button class="eg-btn main" data-a="phquiz">🎯 Luyện tập</button></div>';
    $('egPhrList').scrollTop = 0;
    show('phrl');
  }
  function phQuizStart() {
    var g = PHR[phG];
    PQ = { qs: shuffle(g.p.slice()).slice(0, Math.min(8, g.p.length)), n: 0, ok: 0, pick: -1, opts: [] };
    phQuizDraw();
    show('phrq');
  }
  function phQuizDraw() {
    var g = PHR[phG], B = $('egPhrQB');
    $('egPhrQT').textContent = '🎯 Luyện tập: ' + g.n;
    if (PQ.n >= PQ.qs.length) {
      var all = PQ.ok === PQ.qs.length; if (!PQ.done) { PQ.done = 1; if (PQ.ok * 4 >= PQ.qs.length * 3) sfx('win'); }
      B.innerHTML = '<div style="font-size:54px">' + (all ? '🏆' : (PQ.ok * 2 >= PQ.qs.length ? '🎉' : '💪')) + '</div><h2 style="margin:6px 0">Đúng ' + PQ.ok + '/' + PQ.qs.length + ' câu</h2>' +
        '<div style="opacity:.85">' + (all ? 'Tuyệt vời! Bạn đã nhớ hết các câu.' : 'Hãy nghe lại các câu và luyện tập thêm nhé.') + '</div>' +
        '<div class="eg-acts"><button class="eg-btn main" data-a="phquiz">↻ Luyện lại</button><button class="eg-btn" data-a="phrback">📖 Xem lại các câu</button><button class="eg-btn" data-a="phr">Chọn tình huống khác</button></div>';
      return;
    }
    var p = PQ.qs[PQ.n];
    if (!PQ.opts.length) {
      var others = shuffle(g.p.filter(function (x) { return x !== p; })).slice(0, 3);
      PQ.opts = shuffle([p].concat(others));
      setTimeout(function () { phSay(p); }, 150);
    }
    var done = PQ.pick >= 0;
    B.innerHTML = '<div style="opacity:.85;font-size:14px">Câu ' + (PQ.n + 1) + '/' + PQ.qs.length + ' · Đúng: ' + PQ.ok + '</div>' +
      '<div class="q" data-a="phqsay"><b>' + phT(p) + '</b>' + (phPy(p) ? '<i>' + phPy(p) + '</i>' : '') + '<div style="font-size:13px;opacity:.8;margin-top:6px">🔊 Chạm để nghe lại</div></div>' +
      '<div style="font-size:14px;margin-bottom:8px;color:#cfe0ff">Câu này có nghĩa là gì?</div>' +
      PQ.opts.map(function (o, i) { var c = done ? (o === p ? ' ok' : (i === PQ.pick ? ' bad' : '')) : ''; return '<button class="eg-opt' + c + '" data-a="phans" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + o[1] + '</button>'; }).join('') +
      (done ? '<div class="eg-acts"><button class="eg-btn main" data-a="phnext">' + (PQ.n + 1 < PQ.qs.length ? 'Câu tiếp theo ▶' : 'Xem kết quả ▶') + '</button></div>' : '');
  }

  /* ================= SỰ KIỆN ================= */
  root.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null; if (!el) return;
    var a = el.getAttribute('data-a'), i = parseInt(el.getAttribute('data-i'), 10);
    if (a === 'close') api.close();
    else if (a === 'menu') { stopSpeak(); show('menu'); }
    else if (a === 'topics') toTopics();
    else if (a === 'day') { renderMap(); show('map'); }
    else if (a === 'lv1' || a === 'lv2') { P.lv = a === 'lv1' ? 1 : 2; save(); renderMap(); }
    else if (a === 'lvl') { if (i >= lkFree(L.length) && !lkOpen()) lkAsk(function () { renderMap(); openIntro(i); }); else openIntro(i); }
    else if (a === 'say') { stopSpeak(); speak(introW[i][0]); }
    else if (a === 'go') { if (introT) startTopic(introT); else startDay(cur); }
    else if (a === 'retry') startDay(cur);
    else if (a === 'introback') { stopSpeak(); if (introT) toTopics(); else toMap(); }
    else if (a === 'quit') { if (G && G.mode === 'topic') toTopics(); else toMap(); }
    else if (a === 'map') toMap();
    else if (a === 'again') startTopic(G ? G.topic : TOPICS[0]);
    else if (a === 'next') { if (cur + 1 >= lkFree(L.length) && !lkOpen()) lkAsk(function () { openIntro(cur + 1); }); else openIntro(cur + 1); }
    else if (a === 'win') winScreen();
    else if (a === 'endback') { if (G && G.mode === 'topic') toTopics(); else toMap(); }
    else if (a === 'phr') { stopSpeak(); renderPhr(); }
    else if (a === 'phrcat') { if (i >= lkFree(PHR.length) && !lkOpen()) lkAsk(function () { renderPhr(); renderPhrList(i); }); else renderPhrList(i); }
    else if (a === 'phsay') phSay(PHR[phG].p[i]);
    else if (a === 'phquiz') phQuizStart();
    else if (a === 'phqsay') phSay(PQ.qs[PQ.n]);
    else if (a === 'phans') { if (PQ.pick < 0) { PQ.pick = i; if (PQ.opts[i] === PQ.qs[PQ.n]) { PQ.ok++; sfx('ok'); } else sfx('bad'); phQuizDraw(); } }
    else if (a === 'phnext') { PQ.n++; PQ.pick = -1; PQ.opts = []; phQuizDraw(); }
    else if (a === 'phrback') { stopSpeak(); renderPhrList(phG); }
  });
  function move(e) { if (!G) return; var r = stage.getBoundingClientRect(); G.tx = Math.min(W - G.bw / 2, Math.max(G.bw / 2, e.clientX - r.left)); }
  stage.addEventListener('pointerdown', function (e) { try { stage.setPointerCapture(e.pointerId); } catch (x) {} move(e); });
  stage.addEventListener('pointermove', move);
  window.addEventListener('keydown', function (e) { keys[e.key] = true; if (G && root.classList.contains('on') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) e.preventDefault(); });
  window.addEventListener('keyup', function (e) { keys[e.key] = false; });
  window.addEventListener('resize', function () { if (root.classList.contains('on') && scr.play.classList.contains('on')) resize(); });
  document.addEventListener('visibilitychange', function () { if (G) G.last = performance.now(); });

  /* ================= API CÔNG KHAI ================= */
  var api = {
    open: function () { show('menu'); root.classList.add('on'); document.body.style.overflow = 'hidden'; },
    close: function () { cancelAnimationFrame(raf); stopSpeak(); G = null; root.classList.remove('on'); document.body.style.overflow = ''; }
  };
  window.SixWordGame = api;
  window.SixDayGame = api;
})();
