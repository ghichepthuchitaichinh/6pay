/* 6PAY - Game học từ vựng tiếng Trung (chữ Hán + phiên âm pinyin + nghĩa tiếng Việt). File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
})();
(function () {
  if (window.SixZhGame) return;

  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var TF = '-apple-system,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC","Noto Sans SC","Segoe UI",Roboto,Arial,sans-serif';
  var GAME_SECONDS = 120, REWARD = 10000, PENALTY = 5000;
  var DAY_SEC_PER_WORD = 5.6;   // Một ngày của bé: thời gian mỗi từ (giây). Muốn gấp hơn thì giảm số này, muốn thoải mái hơn thì tăng.
  var SPEED = 0.7;              // tốc độ rơi (chế độ theo chủ đề)
  try { var _sp = parseFloat(localStorage.getItem('zh_wg_speed')); if (_sp >= 0.3 && _sp <= 1.5) SPEED = _sp; } catch (e) {}

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
    var fs = Math.min(18, Math.floor(46 / (t.length * 1.05)));
    return '<rect x="6" y="8" width="52" height="50" rx="6" fill="#fff" stroke="#555" stroke-width="3"/><rect x="6" y="8" width="52" height="14" rx="6" fill="#ef4444"/><rect x="6" y="16" width="52" height="6" fill="#ef4444"/><circle cx="18" cy="8" r="3" fill="#555"/><circle cx="46" cy="8" r="3" fill="#555"/><text x="32" y="' + (41 + fs * 0.35) + '" text-anchor="middle" font-size="' + fs + '" font-weight="800" fill="#334155" font-family="PingFang SC,Microsoft YaHei,Noto Sans CJK SC,Arial,sans-serif">' + t + '</text>';
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
  var DAYS = [['Monday', 'thứ Hai', '周一'], ['Tuesday', 'thứ Ba', '周二'], ['Wednesday', 'thứ Tư', '周三'], ['Thursday', 'thứ Năm', '周四'], ['Friday', 'thứ Sáu', '周五'], ['Saturday', 'thứ Bảy', '周六'], ['Sunday', 'chủ nhật', '周日']];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MONS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  var dayW = DAYS.map(function (d, i) { SV['d_' + i] = cal(d[2]); return [d[0], d[1], '@d_' + i]; });
  MON.forEach(function (m, i) { SV['m_' + i] = cal(MONS[i]); dayW.push([m, 'tháng ' + (i + 1), '@m_' + i]); });

  /* ---- Thời gian ---- */
  var TIMEC = [['today', 'hôm nay', '今天'], ['tomorrow', 'ngày mai', '明天'], ['yesterday', 'hôm qua', '昨天'], ['week', 'tuần', '星期'], ['weekend', 'cuối tuần', '周末'],
    ['month', 'tháng', '月'], ['year', 'năm', '年'], ['hour', 'giờ', '时'], ['minute', 'phút', '分'], ['second', 'giây', '秒']];
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

  /* ================= CHUYỂN SANG TIẾNG TRUNG ================= */
  // Mỗi từ: [chữ Hán, nghĩa tiếng Việt, hình, pinyin]. Từ điển tra theo từ tiếng Anh gốc (hoặc "từ|nghĩa" khi một từ có hai nghĩa).
  var ZH = {"cat": ["猫", "māo"], "dog": ["狗", "gǒu"], "horse": ["马", "mǎ"], "rabbit": ["兔子", "tùzi"], "monkey": ["猴子", "hóuzi"], "elephant": ["大象", "dàxiàng"], "lion": ["狮子", "shīzi"], "tiger": ["老虎", "lǎohǔ"], "bird": ["鸟", "niǎo"], "fish": ["鱼", "yú"], "duck": ["鸭子", "yāzi"], "pig": ["猪", "zhū"], "cow": ["牛", "niú"], "sheep": ["绵羊", "miányáng"], "hen": ["母鸡", "mǔjī"], "frog": ["青蛙", "qīngwā"], "bear": ["熊", "xióng"], "panda": ["熊猫", "xióngmāo"], "snake": ["蛇", "shé"], "giraffe": ["长颈鹿", "chángjǐnglù"], "zebra": ["斑马", "bānmǎ"], "kangaroo": ["袋鼠", "dàishǔ"], "crocodile": ["鳄鱼", "èyú"], "owl": ["猫头鹰", "māotóuyīng"], "rhinoceros": ["犀牛", "xīniú"], "hippopotamus": ["河马", "hémǎ"], "camel": ["骆驼", "luòtuo"], "deer": ["鹿", "lù"], "fox": ["狐狸", "húli"], "wolf": ["狼", "láng"], "squirrel": ["松鼠", "sōngshǔ"], "hedgehog": ["刺猬", "cìwei"], "bat": ["蝙蝠", "biānfú"], "koala": ["考拉", "kǎolā"], "goat": ["山羊", "shānyáng"], "buffalo": ["水牛", "shuǐniú"], "mouse|con chuột": ["老鼠", "lǎoshǔ"], "mouse": ["鼠标", "shǔbiāo"], "leopard": ["豹子", "bàozi"], "gorilla": ["大猩猩", "dàxīngxing"], "dinosaur": ["恐龙", "kǒnglóng"], "lizard": ["蜥蜴", "xīyì"], "apple": ["苹果", "píngguǒ"], "banana": ["香蕉", "xiāngjiāo"], "orange|màu cam": ["橙色", "chéngsè"], "orange": ["橙子", "chéngzi"], "grape": ["葡萄", "pútao"], "watermelon": ["西瓜", "xīguā"], "strawberry": ["草莓", "cǎoméi"], "pineapple": ["菠萝", "bōluó"], "lemon": ["柠檬", "níngméng"], "peach": ["桃子", "táozi"], "cherry": ["樱桃", "yīngtáo"], "carrot": ["胡萝卜", "húluóbo"], "tomato": ["西红柿", "xīhóngshì"], "mango": ["芒果", "mángguǒ"], "coconut": ["椰子", "yēzi"], "pear": ["梨", "lí"], "kiwi": ["猕猴桃", "míhóutáo"], "avocado": ["牛油果", "niúyóuguǒ"], "corn": ["玉米", "yùmǐ"], "potato": ["土豆", "tǔdòu"], "onion": ["洋葱", "yángcōng"], "garlic": ["大蒜", "dàsuàn"], "broccoli": ["西兰花", "xīlánhuā"], "cucumber": ["黄瓜", "huángguā"], "eggplant": ["茄子", "qiézi"], "mushroom": ["蘑菇", "mógu"], "chili": ["辣椒", "làjiāo"], "melon": ["甜瓜", "tiánguā"], "green apple": ["青苹果", "qīngpíngguǒ"], "lettuce": ["生菜", "shēngcài"], "peanut": ["花生", "huāshēng"], "chestnut": ["栗子", "lìzi"], "bread": ["面包", "miànbāo"], "rice|gạo": ["大米", "dàmǐ"], "rice": ["米饭", "mǐfàn"], "egg": ["鸡蛋", "jīdàn"], "milk": ["牛奶", "niúnǎi"], "cheese": ["奶酪", "nǎilào"], "pizza": ["比萨饼", "bǐsàbǐng"], "noodles": ["面条", "miàntiáo"], "coffee": ["咖啡", "kāfēi"], "cake": ["蛋糕", "dàngāo"], "ice cream": ["冰淇淋", "bīngqílín"], "chicken": ["鸡肉", "jīròu"], "hamburger": ["汉堡包", "hànbǎobāo"], "sandwich": ["三明治", "sānmíngzhì"], "hot dog": ["热狗", "règǒu"], "french fries": ["薯条", "shǔtiáo"], "sushi": ["寿司", "shòusī"], "soup": ["汤", "tāng"], "salad": ["沙拉", "shālā"], "cookie": ["饼干", "bǐnggān"], "chocolate": ["巧克力", "qiǎokèlì"], "candy": ["糖果", "tángguǒ"], "donut": ["甜甜圈", "tiántiánquān"], "honey": ["蜂蜜", "fēngmì"], "tea": ["茶", "chá"], "juice": ["果汁", "guǒzhī"], "beer": ["啤酒", "píjiǔ"], "pasta": ["意大利面", "yìdàlìmiàn"], "curry": ["咖喱", "gālí"], "dumpling": ["饺子", "jiǎozi"], "taco": ["墨西哥卷饼", "mòxīgē juǎnbǐng"], "burrito": ["墨西哥卷", "mòxīgē juǎn"], "popcorn": ["爆米花", "bàomǐhuā"], "pancakes": ["煎饼", "jiānbing"], "croissant": ["牛角面包", "niújiǎo miànbāo"], "pretzel": ["椒盐卷饼", "jiāoyán juǎnbǐng"], "steak": ["牛排", "niúpái"], "rice ball": ["饭团", "fàntuán"], "bento": ["便当", "biàndāng"], "pie": ["馅饼", "xiànbǐng"], "cupcake": ["纸杯蛋糕", "zhǐbēi dàngāo"], "lollipop": ["棒棒糖", "bàngbàngtáng"], "wine": ["葡萄酒", "pútaojiǔ"], "cocktail": ["鸡尾酒", "jīwěijiǔ"], "soft drink": ["汽水", "qìshuǐ"], "fried egg": ["煎蛋", "jiāndàn"], "birthday cake": ["生日蛋糕", "shēngrì dàngāo"], "bacon": ["培根", "péigēn"], "doctor": ["医生", "yīshēng"], "teacher": ["老师", "lǎoshī"], "farmer": ["农民", "nóngmín"], "cook|đầu bếp": ["厨师", "chúshī"], "cook": ["做饭", "zuòfàn"], "police officer": ["警察", "jǐngchá"], "firefighter": ["消防员", "xiāofángyuán"], "pilot": ["飞行员", "fēixíngyuán"], "artist": ["画家", "huàjiā"], "singer": ["歌手", "gēshǒu"], "scientist": ["科学家", "kēxuéjiā"], "mechanic": ["修理工", "xiūlǐgōng"], "astronaut": ["宇航员", "yǔhángyuán"], "judge": ["法官", "fǎguān"], "office worker": ["白领", "báilǐng"], "builder": ["建筑工人", "jiànzhù gōngrén"], "guard": ["保安", "bǎo'ān"], "detective": ["侦探", "zhēntàn"], "programmer": ["程序员", "chéngxùyuán"], "dancer": ["舞蹈家", "wǔdǎojiā"], "photographer": ["摄影师", "shèyǐngshī"], "nurse": ["护士", "hùshi"], "waiter": ["服务员", "fúwùyuán"], "clown": ["小丑", "xiǎochǒu"], "student": ["学生", "xuésheng"], "car": ["汽车", "qìchē"], "bus": ["公共汽车", "gōnggòng qìchē"], "train": ["火车", "huǒchē"], "plane": ["飞机", "fēijī"], "bicycle": ["自行车", "zìxíngchē"], "motorbike": ["摩托车", "mótuōchē"], "ship": ["轮船", "lúnchuán"], "helicopter": ["直升机", "zhíshēngjī"], "taxi": ["出租车", "chūzūchē"], "truck": ["卡车", "kǎchē"], "rocket": ["火箭", "huǒjiàn"], "ambulance": ["救护车", "jiùhùchē"], "scooter": ["踏板车", "tàbǎnchē"], "tram": ["电车", "diànchē"], "subway": ["地铁", "dìtiě"], "tractor": ["拖拉机", "tuōlājī"], "sailboat": ["帆船", "fānchuán"], "race car": ["赛车", "sàichē"], "skateboard": ["滑板", "huábǎn"], "fire truck": ["消防车", "xiāofángchē"], "police car": ["警车", "jǐngchē"], "canoe": ["独木舟", "dúmùzhōu"], "cable car": ["缆车", "lǎnchē"], "speedboat": ["快艇", "kuàitǐng"], "flying saucer": ["飞碟", "fēidié"], "fuel pump": ["加油站", "jiāyóuzhàn"], "traffic light": ["红绿灯", "hónglǜdēng"], "anchor": ["锚", "máo"], "bus stop": ["公交车站", "gōngjiāo chēzhàn"], "minibus": ["小巴", "xiǎobā"], "sun": ["太阳", "tàiyáng"], "moon": ["月亮", "yuèliang"], "star": ["星星", "xīngxing"], "rain": ["雨", "yǔ"], "snow": ["雪", "xuě"], "cloud": ["云", "yún"], "rainbow": ["彩虹", "cǎihóng"], "lightning": ["闪电", "shǎndiàn"], "tree": ["树", "shù"], "flower": ["花", "huā"], "mountain": ["山", "shān"], "wave": ["海浪", "hǎilàng"], "fire": ["火", "huǒ"], "earth": ["地球", "dìqiú"], "volcano": ["火山", "huǒshān"], "desert": ["沙漠", "shāmò"], "island": ["岛", "dǎo"], "leaf": ["叶子", "yèzi"], "cactus": ["仙人掌", "xiānrénzhǎng"], "tornado": ["龙卷风", "lóngjuǎnfēng"], "fog": ["雾", "wù"], "sunrise": ["日出", "rìchū"], "sunset": ["日落", "rìluò"], "comet": ["彗星", "huìxīng"], "palm tree": ["棕榈树", "zōnglǘshù"], "forest": ["森林", "sēnlín"], "camping": ["露营", "lùyíng"], "water drop": ["水滴", "shuǐdī"], "ice": ["冰", "bīng"], "sunny": ["晴天", "qíngtiān"], "cloudy": ["多云", "duōyún"], "rainy": ["下雨", "xiàyǔ"], "snowy": ["下雪", "xiàxuě"], "stormy": ["暴风雨", "bàofēngyǔ"], "windy": ["刮风", "guāfēng"], "foggy": ["有雾", "yǒu wù"], "hot": ["热", "rè"], "cold": ["冷", "lěng"], "thunder": ["打雷", "dǎléi"], "umbrella": ["雨伞", "yǔsǎn"], "snowman": ["雪人", "xuěrén"], "partly cloudy": ["晴转多云", "qíng zhuǎn duōyún"], "thermometer": ["温度计", "wēndùjì"], "spring": ["春天", "chūntiān"], "summer": ["夏天", "xiàtiān"], "autumn": ["秋天", "qiūtiān"], "winter": ["冬天", "dōngtiān"], "flood": ["洪水", "hóngshuǐ"], "book": ["书", "shū"], "phone": ["手机", "shǒujī"], "key": ["钥匙", "yàoshi"], "clock": ["钟", "zhōng"], "glasses": ["眼镜", "yǎnjìng"], "bag": ["书包", "shūbāo"], "computer": ["电脑", "diànnǎo"], "camera": ["照相机", "zhàoxiàngjī"], "lamp": ["灯", "dēng"], "scissors": ["剪刀", "jiǎndāo"], "gift": ["礼物", "lǐwù"], "television": ["电视", "diànshì"], "envelope": ["信封", "xìnfēng"], "balloon": ["气球", "qìqiú"], "trophy": ["奖杯", "jiǎngbēi"], "flag": ["旗子", "qízi"], "pen": ["钢笔", "gāngbǐ"], "map": ["地图", "dìtú"], "tent": ["帐篷", "zhàngpeng"], "microscope": ["显微镜", "xiǎnwēijìng"], "telescope": ["望远镜", "wàngyuǎnjìng"], "medicine": ["药", "yào"], "baby bottle": ["奶瓶", "nǎipíng"], "hourglass": ["沙漏", "shālòu"], "flashlight": ["手电筒", "shǒudiàntǒng"], "lock": ["锁", "suǒ"], "ring": ["戒指", "jièzhi"], "crown": ["皇冠", "huángguān"], "lipstick": ["口红", "kǒuhóng"], "sunglasses": ["太阳镜", "tàiyángjìng"], "package": ["包裹", "bāoguǒ"], "newspaper": ["报纸", "bàozhǐ"], "vase": ["花瓶", "huāpíng"], "joystick": ["游戏手柄", "yóuxì shǒubǐng"], "pushpin": ["图钉", "túdīng"], "eye": ["眼睛", "yǎnjing"], "ear": ["耳朵", "ěrduo"], "nose": ["鼻子", "bízi"], "mouth": ["嘴巴", "zuǐba"], "hand": ["手", "shǒu"], "foot": ["脚", "jiǎo"], "leg": ["腿", "tuǐ"], "arm": ["胳膊", "gēbo"], "tooth": ["牙齿", "yáchǐ"], "brain": ["大脑", "dànǎo"], "tongue": ["舌头", "shétou"], "bone": ["骨头", "gǔtou"], "heart": ["心", "xīn"], "hair": ["头发", "tóufa"], "nail": ["指甲", "zhǐjia"], "footprints": ["脚印", "jiǎoyìn"], "finger": ["手指", "shǒuzhǐ"], "thumb": ["大拇指", "dàmǔzhǐ"], "fist": ["拳头", "quántou"], "clap": ["拍手", "pāishǒu"], "skull": ["骷髅", "kūlóu"], "eyes": ["双眼", "shuāngyǎn"], "waving hand": ["挥手", "huīshǒu"], "peace sign": ["剪刀手", "jiǎndāoshǒu"], "ok sign": ["OK手势", "OK shǒushì"], "praying hands": ["双手合十", "shuāngshǒu héshí"], "handshake": ["握手", "wòshǒu"], "shirt": ["衬衫", "chènshān"], "pants": ["裤子", "kùzi"], "dress": ["连衣裙", "liányīqún"], "cap": ["棒球帽", "bàngqiúmào"], "sneakers": ["运动鞋", "yùndòngxié"], "socks": ["袜子", "wàzi"], "coat": ["外套", "wàitào"], "scarf": ["围巾", "wéijīn"], "gloves": ["手套", "shǒutào"], "tie": ["领带", "lǐngdài"], "boots": ["靴子", "xuēzi"], "bikini": ["泳衣", "yǒngyī"], "hat": ["帽子", "màozi"], "high heels": ["高跟鞋", "gāogēnxié"], "sandals": ["凉鞋", "liángxié"], "kimono": ["和服", "héfú"], "handbag": ["手提包", "shǒutíbāo"], "lab coat": ["白大褂", "báidàguà"], "top hat": ["礼帽", "lǐmào"], "graduation cap": ["学士帽", "xuéshìmào"], "helmet": ["头盔", "tóukuī"], "shorts": ["短裤", "duǎnkù"], "pajamas": ["睡衣", "shuìyī"], "backpack": ["背包", "bēibāo"], "house": ["房子", "fángzi"], "bed": ["床", "chuáng"], "door": ["门", "mén"], "chair": ["椅子", "yǐzi"], "toilet": ["马桶", "mǎtǒng"], "bathtub": ["浴缸", "yùgāng"], "shower": ["淋浴", "línyù"], "window": ["窗户", "chuānghu"], "broom": ["扫帚", "sàozhou"], "soap|nước rửa bát": ["洗洁精", "xǐjiéjīng"], "soap": ["肥皂", "féizào"], "candle": ["蜡烛", "làzhú"], "mirror": ["镜子", "jìngzi"], "sofa": ["沙发", "shāfā"], "telephone": ["电话", "diànhuà"], "mailbox": ["信箱", "xìnxiāng"], "trash can": ["垃圾桶", "lājītǒng"], "basket": ["篮子", "lánzi"], "toothbrush": ["牙刷", "yáshuā"], "sponge": ["海绵", "hǎimián"], "pillow": ["枕头", "zhěntou"], "blanket": ["被子", "bèizi"], "towel": ["毛巾", "máojīn"], "comb": ["梳子", "shūzi"], "tissue": ["纸巾", "zhǐjīn"], "garden": ["花园", "huāyuán"], "knife": ["刀", "dāo"], "fork": ["叉子", "chāzi"], "spoon": ["勺子", "sháozi"], "chopsticks": ["筷子", "kuàizi"], "plate": ["盘子", "pánzi"], "bowl": ["碗", "wǎn"], "cup": ["杯子", "bēizi"], "glass": ["玻璃杯", "bōlibēi"], "bottle": ["瓶子", "píngzi"], "pot": ["锅", "guō"], "frying pan": ["平底锅", "píngdǐguō"], "salt": ["盐", "yán"], "water": ["水", "shuǐ"], "butter": ["黄油", "huángyóu"], "bucket": ["水桶", "shuǐtǒng"], "father": ["爸爸", "bàba"], "mother": ["妈妈", "māma"], "grandfather": ["爷爷", "yéye"], "grandmother": ["奶奶", "nǎinai"], "baby": ["宝宝", "bǎobao"], "boy": ["男孩", "nánhái"], "girl": ["女孩", "nǚhái"], "child": ["孩子", "háizi"], "family": ["家庭", "jiātíng"], "friends": ["朋友", "péngyou"], "couple": ["情侣", "qínglǚ"], "uncle": ["叔叔", "shūshu"], "aunt": ["阿姨", "āyí"], "bride": ["新娘", "xīnniáng"], "groom": ["新郎", "xīnláng"], "wedding": ["婚礼", "hūnlǐ"], "king": ["国王", "guówáng"], "queen": ["女王", "nǚwáng"], "love": ["爱", "ài"], "kiss": ["亲吻", "qīnwěn"], "hug": ["拥抱", "yōngbào"], "pregnant woman": ["孕妇", "yùnfù"], "old man": ["老爷爷", "lǎoyéye"], "twins": ["双胞胎", "shuāngbāotāi"], "football": ["足球", "zúqiú"], "basketball": ["篮球", "lánqiú"], "tennis": ["网球", "wǎngqiú"], "volleyball": ["排球", "páiqiú"], "baseball": ["棒球", "bàngqiú"], "swimming": ["游泳", "yóuyǒng"], "boxing": ["拳击", "quánjī"], "golf": ["高尔夫球", "gāo'ěrfūqiú"], "skiing": ["滑雪", "huáxuě"], "cycling": ["骑自行车", "qí zìxíngchē"], "running": ["跑步", "pǎobù"], "badminton": ["羽毛球", "yǔmáoqiú"], "rugby": ["橄榄球", "gǎnlǎnqiú"], "table tennis": ["乒乓球", "pīngpāngqiú"], "bowling": ["保龄球", "bǎolíngqiú"], "hockey": ["曲棍球", "qūgùnqiú"], "ice skating": ["滑冰", "huábīng"], "surfing": ["冲浪", "chōnglàng"], "rowing": ["划船", "huáchuán"], "weightlifting": ["举重", "jǔzhòng"], "yoga": ["瑜伽", "yújiā"], "gymnastics": ["体操", "tǐcāo"], "fencing": ["击剑", "jījiàn"], "archery": ["射箭", "shèjiàn"], "horse racing": ["赛马", "sàimǎ"], "darts": ["飞镖", "fēibiāo"], "medal": ["奖牌", "jiǎngpái"], "karate": ["空手道", "kōngshǒudào"], "fishing": ["钓鱼", "diàoyú"], "climbing": ["登山", "dēngshān"], "diving": ["潜水", "qiánshuǐ"], "guitar": ["吉他", "jítā"], "piano": ["钢琴", "gāngqín"], "drum": ["鼓", "gǔ"], "violin": ["小提琴", "xiǎotíqín"], "trumpet": ["小号", "xiǎohào"], "saxophone": ["萨克斯", "sàkèsī"], "microphone": ["麦克风", "màikèfēng"], "headphones": ["耳机", "ěrjī"], "music note": ["音符", "yīnfú"], "bell": ["铃铛", "língdang"], "radio": ["收音机", "shōuyīnjī"], "accordion": ["手风琴", "shǒufēngqín"], "musical notes": ["旋律", "xuánlǜ"], "sheet music": ["乐谱", "yuèpǔ"], "CD": ["光盘", "guāngpán"], "loudspeaker": ["喇叭", "lǎba"], "mute": ["静音", "jìngyīn"], "dancing": ["跳舞", "tiàowǔ"], "disco": ["迪斯科", "dísīkē"], "studio mic": ["录音话筒", "lùyīn huàtǒng"], "megaphone": ["扩音器", "kuòyīnqì"], "happy": ["开心", "kāixīn"], "sad": ["难过", "nánguò"], "angry": ["生气", "shēngqì"], "sleepy": ["困", "kùn"], "scared": ["害怕", "hàipà"], "surprised": ["惊讶", "jīngyà"], "laughing": ["大笑", "dàxiào"], "cool": ["酷", "kù"], "sick": ["生病", "shēngbìng"], "in love": ["恋爱", "liàn'ài"], "thinking": ["思考", "sīkǎo"], "crying": ["哭泣", "kūqì"], "embarrassed": ["尴尬", "gāngà"], "bored": ["无聊", "wúliáo"], "worried": ["担心", "dānxīn"], "excited": ["兴奋", "xīngfèn"], "shy": ["害羞", "hàixiū"], "confused": ["困惑", "kùnhuò"], "relaxed": ["放松", "fàngsōng"], "tired": ["累", "lèi"], "silly": ["傻", "shǎ"], "nervous": ["紧张", "jǐnzhāng"], "disgusted": ["恶心", "ěxin"], "winking": ["眨眼", "zhǎyǎn"], "smiling": ["微笑", "wēixiào"], "kissing": ["飞吻", "fēiwěn"], "celebrating": ["庆祝", "qìngzhù"], "dizzy": ["头晕", "tóuyūn"], "relieved": ["松了口气", "sōngle kǒuqì"], "whale": ["鲸鱼", "jīngyú"], "dolphin": ["海豚", "hǎitún"], "shark": ["鲨鱼", "shāyú"], "octopus": ["章鱼", "zhāngyú"], "crab": ["螃蟹", "pángxiè"], "turtle": ["乌龟", "wūguī"], "shrimp": ["虾", "xiā"], "squid": ["鱿鱼", "yóuyú"], "lobster": ["龙虾", "lóngxiā"], "seal": ["海豹", "hǎibào"], "penguin": ["企鹅", "qǐ'é"], "oyster": ["牡蛎", "mǔlì"], "tropical fish": ["热带鱼", "rèdàiyú"], "blowfish": ["河豚", "hétún"], "shell": ["贝壳", "bèiké"], "swimmer": ["游泳者", "yóuyǒngzhě"], "bee": ["蜜蜂", "mìfēng"], "butterfly": ["蝴蝶", "húdié"], "ant": ["蚂蚁", "mǎyǐ"], "spider": ["蜘蛛", "zhīzhū"], "ladybug": ["瓢虫", "piáochóng"], "mosquito": ["蚊子", "wénzi"], "snail": ["蜗牛", "wōniú"], "worm": ["虫子", "chóngzi"], "scorpion": ["蝎子", "xiēzi"], "cricket": ["蟋蟀", "xīshuài"], "fly|bay": ["飞", "fēi"], "fly": ["苍蝇", "cāngying"], "caterpillar": ["毛毛虫", "máomaochóng"], "spider web": ["蜘蛛网", "zhīzhūwǎng"], "germ": ["细菌", "xìjūn"], "eagle": ["老鹰", "lǎoyīng"], "parrot": ["鹦鹉", "yīngwǔ"], "swan": ["天鹅", "tiān'é"], "flamingo": ["火烈鸟", "huǒlièniǎo"], "peacock": ["孔雀", "kǒngquè"], "turkey": ["火鸡", "huǒjī"], "rooster": ["公鸡", "gōngjī"], "chick": ["小鸡", "xiǎojī"], "hatching chick": ["破壳小鸡", "pòké xiǎojī"], "dove": ["鸽子", "gēzi"], "rose": ["玫瑰", "méigui"], "sunflower": ["向日葵", "xiàngrìkuí"], "tulip": ["郁金香", "yùjīnxiāng"], "hibiscus": ["扶桑花", "fúsānghuā"], "daisy": ["雏菊", "chújú"], "cherry blossom": ["樱花", "yīnghuā"], "bouquet": ["花束", "huāshù"], "lotus": ["荷花", "héhuā"], "bamboo": ["竹子", "zhúzi"], "herb": ["香草", "xiāngcǎo"], "clover": ["三叶草", "sānyècǎo"], "seedling": ["幼苗", "yòumiáo"], "maple leaf": ["枫叶", "fēngyè"], "fallen leaf": ["落叶", "luòyè"], "evergreen tree": ["松树", "sōngshù"], "rice plant": ["稻子", "dàozi"], "wilted flower": ["枯萎的花", "kūwěi de huā"], "school": ["学校", "xuéxiào"], "hospital": ["医院", "yīyuàn"], "hotel": ["酒店", "jiǔdiàn"], "church": ["教堂", "jiàotáng"], "factory": ["工厂", "gōngchǎng"], "castle": ["城堡", "chéngbǎo"], "stadium": ["体育场", "tǐyùchǎng"], "post office": ["邮局", "yóujú"], "shop": ["商店", "shāngdiàn"], "beach": ["海滩", "hǎitān"], "park": ["公园", "gōngyuán"], "bridge": ["桥", "qiáo"], "bank": ["银行", "yínháng"], "office": ["办公楼", "bàngōnglóu"], "department store": ["百货商店", "bǎihuò shāngdiàn"], "Japanese castle": ["日本城堡", "Rìběn chéngbǎo"], "mosque": ["清真寺", "qīngzhēnsì"], "tower": ["东京塔", "Dōngjīng tǎ"], "Statue of Liberty": ["自由女神像", "Zìyóu Nǚshén xiàng"], "Mount Fuji": ["富士山", "Fùshì Shān"], "ferris wheel": ["摩天轮", "mótiānlún"], "fountain": ["喷泉", "pēnquán"], "city": ["城市", "chéngshì"], "night city": ["城市夜景", "chéngshì yèjǐng"], "village": ["村庄", "cūnzhuāng"], "roller coaster": ["过山车", "guòshānchē"], "carousel": ["旋转木马", "xuánzhuǎn mùmǎ"], "circus": ["马戏团", "mǎxìtuán"], "cinema": ["电影院", "diànyǐngyuàn"], "library": ["图书馆", "túshūguǎn"], "airport": ["机场", "jīchǎng"], "railway": ["铁路", "tiělù"], "highway": ["高速公路", "gāosù gōnglù"], "hammer": ["锤子", "chuízi"], "saw": ["锯子", "jùzi"], "screwdriver": ["螺丝刀", "luósīdāo"], "wrench": ["扳手", "bānshou"], "axe": ["斧头", "fǔtóu"], "ladder": ["梯子", "tīzi"], "magnet": ["磁铁", "cítiě"], "pencil": ["铅笔", "qiānbǐ"], "paintbrush": ["画笔", "huàbǐ"], "battery": ["电池", "diànchí"], "toolbox": ["工具箱", "gōngjùxiāng"], "nut and bolt": ["螺丝", "luósī"], "gear": ["齿轮", "chǐlún"], "chain": ["链子", "liànzi"], "pickaxe": ["镐", "gǎo"], "plug": ["插头", "chātóu"], "fire extinguisher": ["灭火器", "mièhuǒqì"], "brick": ["砖", "zhuān"], "compass": ["指南针", "zhǐnánzhēn"], "ruler": ["尺子", "chǐzi"], "shield": ["盾牌", "dùnpái"], "magnifying glass": ["放大镜", "fàngdàjìng"], "thread": ["线", "xiàn"], "oil barrel": ["油桶", "yóutǒng"], "red": ["红色", "hóngsè"], "blue": ["蓝色", "lánsè"], "green": ["绿色", "lǜsè"], "yellow": ["黄色", "huángsè"], "purple": ["紫色", "zǐsè"], "pink": ["粉红色", "fěnhóngsè"], "brown": ["棕色", "zōngsè"], "black": ["黑色", "hēisè"], "white": ["白色", "báisè"], "gray": ["灰色", "huīsè"], "gold": ["金色", "jīnsè"], "silver": ["银色", "yínsè"], "sky blue": ["天蓝色", "tiānlánsè"], "navy": ["深蓝色", "shēnlánsè"], "dark green": ["深绿色", "shēnlǜsè"], "light green": ["浅绿色", "qiǎnlǜsè"], "beige": ["米色", "mǐsè"], "maroon": ["褐红色", "hèhóngsè"], "turquoise": ["青绿色", "qīnglǜsè"], "zero": ["零", "líng"], "one": ["一", "yī"], "two": ["二", "èr"], "three": ["三", "sān"], "four": ["四", "sì"], "five": ["五", "wǔ"], "six": ["六", "liù"], "seven": ["七", "qī"], "eight": ["八", "bā"], "nine": ["九", "jiǔ"], "ten": ["十", "shí"], "eleven": ["十一", "shíyī"], "twelve": ["十二", "shí'èr"], "thirteen": ["十三", "shísān"], "fourteen": ["十四", "shísì"], "fifteen": ["十五", "shíwǔ"], "sixteen": ["十六", "shíliù"], "seventeen": ["十七", "shíqī"], "eighteen": ["十八", "shíbā"], "nineteen": ["十九", "shíjiǔ"], "twenty": ["二十", "èrshí"], "thirty": ["三十", "sānshí"], "forty": ["四十", "sìshí"], "fifty": ["五十", "wǔshí"], "one hundred": ["一百", "yìbǎi"], "circle": ["圆形", "yuánxíng"], "square": ["正方形", "zhèngfāngxíng"], "rectangle": ["长方形", "chángfāngxíng"], "triangle": ["三角形", "sānjiǎoxíng"], "oval": ["椭圆形", "tuǒyuánxíng"], "diamond|hình thoi": ["菱形", "língxíng"], "diamond": ["钻石", "zuànshí"], "pentagon": ["五边形", "wǔbiānxíng"], "hexagon": ["六边形", "liùbiānxíng"], "octagon": ["八边形", "bābiānxíng"], "crescent": ["月牙", "yuèyá"], "cross": ["十字", "shízì"], "arrow": ["箭头", "jiàntóu"], "cube": ["正方体", "zhèngfāngtǐ"], "sphere": ["球体", "qiútǐ"], "cylinder": ["圆柱体", "yuánzhùtǐ"], "cone": ["圆锥体", "yuánzhuītǐ"], "pyramid": ["金字塔", "jīnzìtǎ"], "Monday": ["星期一", "xīngqīyī"], "Tuesday": ["星期二", "xīngqī'èr"], "Wednesday": ["星期三", "xīngqīsān"], "Thursday": ["星期四", "xīngqīsì"], "Friday": ["星期五", "xīngqīwǔ"], "Saturday": ["星期六", "xīngqīliù"], "Sunday": ["星期天", "xīngqītiān"], "January": ["一月", "yīyuè"], "February": ["二月", "èryuè"], "March": ["三月", "sānyuè"], "April": ["四月", "sìyuè"], "May": ["五月", "wǔyuè"], "June": ["六月", "liùyuè"], "July": ["七月", "qīyuè"], "August": ["八月", "bāyuè"], "September": ["九月", "jiǔyuè"], "October": ["十月", "shíyuè"], "November": ["十一月", "shíyīyuè"], "December": ["十二月", "shí'èryuè"], "morning": ["早上", "zǎoshang"], "noon": ["中午", "zhōngwǔ"], "afternoon": ["下午", "xiàwǔ"], "evening": ["晚上", "wǎnshang"], "night": ["夜晚", "yèwǎn"], "midnight": ["半夜", "bànyè"], "alarm clock": ["闹钟", "nàozhōng"], "watch": ["手表", "shǒubiǎo"], "stopwatch": ["秒表", "miǎobiǎo"], "timer": ["定时器", "dìngshíqì"], "calendar": ["日历", "rìlì"], "today": ["今天", "jīntiān"], "tomorrow": ["明天", "míngtiān"], "yesterday": ["昨天", "zuótiān"], "week": ["星期", "xīngqī"], "weekend": ["周末", "zhōumò"], "month": ["月", "yuè"], "year": ["年", "nián"], "hour": ["小时", "xiǎoshí"], "minute": ["分钟", "fēnzhōng"], "second": ["秒", "miǎo"], "money": ["钱", "qián"], "coin": ["硬币", "yìngbì"], "credit card": ["信用卡", "xìnyòngkǎ"], "wallet": ["钱包", "qiánbāo"], "chart": ["上升图表", "shàngshēng túbiǎo"], "receipt": ["收据", "shōujù"], "calculator": ["计算器", "jìsuànqì"], "savings": ["存款", "cúnkuǎn"], "shopping cart": ["购物车", "gòuwùchē"], "price tag": ["价格标签", "jiàgé biāoqiān"], "dollar": ["美元", "měiyuán"], "euro": ["欧元", "ōuyuán"], "yen": ["日元", "rìyuán"], "pound": ["英镑", "yīngbàng"], "spending": ["花钱", "huāqián"], "shopping bags": ["购物袋", "gòuwùdài"], "ATM": ["取款机", "qǔkuǎnjī"], "scale": ["秤", "chèng"], "falling chart": ["下降图表", "xiàjiàng túbiǎo"], "planet": ["行星", "xíngxīng"], "UFO": ["飞碟", "fēidié"], "alien": ["外星人", "wàixīngrén"], "satellite": ["卫星", "wèixīng"], "galaxy": ["银河", "yínhé"], "shooting star": ["流星", "liúxīng"], "full moon": ["满月", "mǎnyuè"], "new moon": ["新月", "xīnyuè"], "half moon": ["半月", "bànyuè"], "eclipse": ["日食", "rìshí"], "sparkles": ["闪闪发光", "shǎnshǎn fāguāng"], "robot": ["机器人", "jīqìrén"], "satellite dish": ["卫星天线", "wèixīng tiānxiàn"], "Christmas tree": ["圣诞树", "shèngdànshù"], "Santa Claus": ["圣诞老人", "Shèngdàn lǎorén"], "fireworks": ["烟花", "yānhuā"], "sparkler": ["仙女棒", "xiānnǚbàng"], "lantern": ["灯笼", "dēnglong"], "party popper": ["礼花筒", "lǐhuātǒng"], "confetti": ["彩纸屑", "cǎizhǐxiè"], "ghost": ["鬼", "guǐ"], "pumpkin": ["南瓜", "nánguā"], "mooncake": ["月饼", "yuèbing"], "red envelope": ["红包", "hóngbāo"], "carp streamer": ["鲤鱼旗", "lǐyúqí"], "bamboo decoration": ["竹饰", "zhúshì"], "ribbon": ["蝴蝶结", "húdiéjié"], "party": ["派对", "pàiduì"], "champagne": ["香槟", "xiāngbīn"], "moon viewing": ["赏月", "shǎngyuè"], "desktop": ["台式电脑", "táishì diànnǎo"], "keyboard": ["键盘", "jiànpán"], "printer": ["打印机", "dǎyìnjī"], "video camera": ["摄像机", "shèxiàngjī"], "light bulb": ["灯泡", "dēngpào"], "floppy disk": ["软盘", "ruǎnpán"], "video game": ["电子游戏", "diànzǐ yóuxì"], "antenna": ["天线", "tiānxiàn"], "speaker": ["音箱", "yīnxiāng"], "smartwatch": ["智能手表", "zhìnéng shǒubiǎo"], "email": ["电子邮件", "diànzǐ yóujiàn"], "link": ["链接", "liànjiē"], "dragon": ["龙", "lóng"], "unicorn": ["独角兽", "dújiǎoshòu"], "fairy": ["仙女", "xiānnǚ"], "wizard": ["巫师", "wūshī"], "mermaid": ["美人鱼", "měirényú"], "genie": ["灯神", "dēngshén"], "vampire": ["吸血鬼", "xīxuèguǐ"], "zombie": ["僵尸", "jiāngshī"], "elf": ["精灵", "jīnglíng"], "angel": ["天使", "tiānshǐ"], "crystal ball": ["水晶球", "shuǐjīngqiú"], "sword": ["剑", "jiàn"], "treasure": ["宝藏", "bǎozàng"], "long-necked dinosaur": ["长颈龙", "chángjǐnglóng"], "superhero": ["超级英雄", "chāojí yīngxióng"], "villain": ["坏人", "huàirén"], "notebook": ["笔记本", "bǐjìběn"], "eraser": ["橡皮", "xiàngpí"], "glue": ["胶水", "jiāoshuǐ"], "blackboard": ["黑板", "hēibǎn"], "globe": ["地球仪", "dìqiúyí"], "paper clip": ["回形针", "huíxíngzhēn"], "folder": ["文件夹", "wénjiànjiā"], "crayon": ["蜡笔", "làbǐ"], "palette": ["调色板", "tiáosèbǎn"], "test": ["考试", "kǎoshì"], "letters": ["字母", "zìmǔ"], "lunch box": ["饭盒", "fànhé"], "homework": ["作业", "zuòyè"], "bookmark": ["书签", "shūqiān"], "gold medal": ["金牌", "jīnpái"], "run": ["跑", "pǎo"], "walk": ["走路", "zǒulù"], "sleep": ["睡觉", "shuìjiào"], "eat": ["吃", "chī"], "drink|đồ uống": ["饮料", "yǐnliào"], "drink": ["喝", "hē"], "read": ["读", "dú"], "write": ["写", "xiě"], "sing": ["唱歌", "chànggē"], "dance": ["跳舞", "tiàowǔ"], "swim": ["游泳", "yóuyǒng"], "cry": ["哭", "kū"], "laugh": ["笑", "xiào"], "wash": ["洗", "xǐ"], "draw": ["画画", "huàhuà"], "listen": ["听", "tīng"], "talk": ["说话", "shuōhuà"], "think": ["想", "xiǎng"], "look": ["看", "kàn"], "climb": ["爬", "pá"], "drive": ["开车", "kāichē"], "ride": ["骑车", "qíchē"], "kick": ["踢球", "tīqiú"], "buy": ["买", "mǎi"], "give": ["送", "sòng"], "sit": ["坐", "zuò"], "stand": ["站", "zhàn"], "wait": ["等", "děng"], "wake up": ["起床", "qǐchuáng"], "open": ["打开", "dǎkāi"], "call": ["打电话", "dǎ diànhuà"], "play": ["玩游戏", "wán yóuxì"], "take photo": ["拍照", "pāizhào"], "teddy bear": ["玩具熊", "wánjùxióng"], "slippers": ["拖鞋", "tuōxié"], "picture": ["画", "huà"], "toothpaste": ["牙膏", "yágāo"], "tap": ["水龙头", "shuǐlóngtóu"], "bubbles": ["泡泡", "pàopao"], "smile": ["笑容", "xiàoróng"], "face": ["脸", "liǎn"], "bath": ["洗澡", "xǐzǎo"], "shoes": ["鞋子", "xiézi"], "stop sign": ["停车标志", "tíngchē biāozhì"], "road": ["马路", "mǎlù"], "hello": ["你好", "nǐ hǎo"], "building": ["大楼", "dàlóu"], "music": ["音乐", "yīnyuè"], "kite": ["风筝", "fēngzheng"], "yo-yo": ["溜溜球", "liūliūqiú"], "puzzle": ["拼图", "pīntú"], "dice": ["骰子", "tóuzi"], "chess": ["国际象棋", "guójì xiàngqí"], "playing cards": ["扑克牌", "pūkèpái"], "brother": ["兄弟", "xiōngdì"], "sister": ["姐妹", "jiěmèi"], "muscle": ["肌肉", "jīròu"], "shampoo": ["洗发水", "xǐfàshuǐ"], "laundry basket": ["洗衣篮", "xǐyīlán"], "clean": ["干净", "gānjìng"], "rubber duck": ["橡皮鸭", "xiàngpíyā"], "wet": ["湿", "shī"], "sweat": ["汗水", "hànshuǐ"], "germs": ["病菌", "bìngjūn"], "clothes": ["衣服", "yīfu"], "hot spring": ["温泉", "wēnquán"], "wind": ["风", "fēng"], "dry": ["干", "gān"], "meat": ["肉", "ròu"], "vegetables": ["蔬菜", "shūcài"], "question": ["问题", "wèntí"], "answer": ["答案", "dá'àn"], "number": ["数字", "shùzì"], "science": ["科学", "kēxué"], "idea": ["主意", "zhǔyi"], "correct": ["对", "duì"], "wrong": ["错", "cuò"], "plus": ["加号", "jiāhào"], "minus": ["减号", "jiǎnhào"], "quiet": ["安静", "ānjìng"], "study": ["学习", "xuéxí"], "graph": ["图表", "túbiǎo"], "bandage": ["创可贴", "chuāngkětiē"], "sneeze": ["打喷嚏", "dǎ pēntì"], "mask": ["口罩", "kǒuzhào"], "nine o'clock": ["九点", "jiǔ diǎn"], "yawn": ["打哈欠", "dǎ hāqian"], "stethoscope": ["听诊器", "tīngzhěnqì"], "syringe": ["注射器", "zhùshèqì"], "fever": ["发烧", "fāshāo"], "lights off": ["关灯", "guān dēng"], "wash hands": ["洗手", "xǐshǒu"], "dream": ["梦", "mèng"], "snore": ["打呼噜", "dǎ hūlu"], "storybook": ["故事书", "gùshishū"], "lullaby": ["摇篮曲", "yáolánqǔ"], "bedtime": ["睡觉时间", "shuìjiào shíjiān"], "night sky": ["夜空", "yèkōng"], "nightmare": ["噩梦", "èmèng"], "cousin": ["表兄弟姐妹", "biǎo xiōngdì jiěmèi"], "neighbor": ["邻居", "línjū"], "school uniform": ["校服", "xiàofú"], "raincoat": ["雨衣", "yǔyī"], "T-shirt": ["T恤", "T xù"], "toilet paper": ["卫生纸", "wèishēngzhǐ"], "razor": ["剃须刀", "tìxūdāo"], "hair dryer": ["吹风机", "chuīfēngjī"], "headache": ["头疼", "tóuténg"], "vomit": ["呕吐", "ǒutù"], "toothache": ["牙疼", "yáténg"], "wheelchair": ["轮椅", "lúnyǐ"], "blood": ["血", "xuè"], "healthy": ["健康", "jiànkāng"], "driver": ["司机", "sījī"], "soldier": ["士兵", "shìbīng"], "fisherman": ["渔民", "yúmín"], "hairdresser": ["理发师", "lǐfàshī"], "shop assistant": ["售货员", "shòuhuòyuán"], "writer": ["作家", "zuòjiā"], "jump": ["跳", "tiào"], "pull": ["拉", "lā"], "throw": ["扔", "rēng"], "help": ["帮助", "bāngzhù"], "close": ["关", "guān"], "clean|lau dọn": ["打扫", "dǎsǎo"], "play|chơi": ["玩", "wán"], "coconut|nước dừa": ["椰子水", "yēzishuǐ"], "big": ["大", "dà"], "small": ["小", "xiǎo"], "tall": ["高", "gāo"], "fast": ["快", "kuài"], "slow": ["慢", "màn"], "heavy": ["重", "zhòng"], "light": ["轻", "qīng"], "strong": ["强壮", "qiángzhuàng"], "new": ["新", "xīn"], "old": ["旧", "jiù"], "young": ["年轻", "niánqīng"], "loud": ["吵", "chǎo"], "sweet": ["甜", "tián"], "sour": ["酸", "suān"], "spicy": ["辣", "là"], "salty": ["咸", "xián"], "bitter": ["苦", "kǔ"], "beautiful": ["漂亮", "piàoliang"], "dirty": ["脏", "zāng"], "hungry": ["饿", "è"], "wardrobe": ["衣柜", "yīguì"], "fan": ["电风扇", "diànfēngshàn"], "air conditioner": ["空调", "kōngtiáo"], "curtain": ["窗帘", "chuānglián"], "table": ["桌子", "zhuōzi"], "desk": ["书桌", "shūzhuō"], "bookshelf": ["书架", "shūjià"], "washing machine": ["洗衣机", "xǐyījī"], "refrigerator": ["冰箱", "bīngxiāng"], "stove": ["燃气灶", "ránqìzào"], "rice cooker": ["电饭锅", "diànfànguō"], "teapot": ["茶壶", "cháhú"], "blueberries": ["蓝莓", "lánméi"], "sweet potato": ["红薯", "hóngshǔ"], "bell pepper": ["甜椒", "tiánjiāo"], "olive": ["橄榄", "gǎnlǎn"], "porridge": ["粥", "zhōu"], "bubble tea": ["奶茶", "nǎichá"], "sake": ["清酒", "qīngjiǔ"], "doll": ["娃娃", "wáwa"], "ball": ["球", "qiú"], "toy car": ["玩具车", "wánjùchē"], "toy train": ["玩具火车", "wánjù huǒchē"], "blocks": ["积木", "jīmù"], "magic wand": ["魔法棒", "mófǎbàng"], "hamster": ["仓鼠", "cāngshǔ"], "puppy": ["小狗", "xiǎogǒu"], "goldfish": ["金鱼", "jīnyú"], "orangutan": ["猩猩", "xīngxing"], "sloth": ["树懒", "shùlǎn"], "otter": ["水獭", "shuǐtǎ"], "raccoon": ["浣熊", "huànxióng"], "skunk": ["臭鼬", "chòuyòu"], "llama": ["羊驼", "yángtuó"], "badger": ["獾", "huān"], "boar": ["野猪", "yězhū"], "beetle": ["甲虫", "jiǎchóng"], "cockroach": ["蟑螂", "zhāngláng"], "river": ["河", "hé"], "rock": ["石头", "shítou"], "wood": ["木头", "mùtou"], "supermarket": ["超市", "chāoshì"], "restaurant": ["饭店", "fàndiàn"], "market": ["市场", "shìchǎng"], "zoo": ["动物园", "dòngwùyuán"], "museum": ["博物馆", "bówùguǎn"], "police station": ["派出所", "pàichūsuǒ"], "fire station": ["消防站", "xiāofángzhàn"], "temple": ["寺庙", "sìmiào"], "suitcase": ["行李箱", "xínglixiāng"], "passport": ["护照", "hùzhào"], "ticket": ["票", "piào"], "postcard": ["明信片", "míngxìnpiàn"], "souvenir": ["纪念品", "jìniànpǐn"], "tour bus": ["旅游大巴", "lǚyóu dàbā"], "cruise ship": ["游轮", "yóulún"], "sightseeing": ["观光", "guānguāng"], "swimming pool": ["游泳池", "yóuyǒngchí"], "sunscreen": ["防晒霜", "fángshàishuāng"], "Vietnam": ["越南", "Yuènán"], "China": ["中国", "Zhōngguó"], "Japan": ["日本", "Rìběn"], "Korea": ["韩国", "Hánguó"], "Thailand": ["泰国", "Tàiguó"], "Laos": ["老挝", "Lǎowō"], "Cambodia": ["柬埔寨", "Jiǎnpǔzhài"], "Singapore": ["新加坡", "Xīnjiāpō"], "Malaysia": ["马来西亚", "Mǎláixīyà"], "Indonesia": ["印度尼西亚", "Yìndùníxīyà"], "Philippines": ["菲律宾", "Fēilǜbīn"], "India": ["印度", "Yìndù"], "Australia": ["澳大利亚", "Àodàlìyà"], "United States": ["美国", "Měiguó"], "Canada": ["加拿大", "Jiānádà"], "Brazil": ["巴西", "Bāxī"], "United Kingdom": ["英国", "Yīngguó"], "France": ["法国", "Fǎguó"], "Germany": ["德国", "Déguó"], "Italy": ["意大利", "Yìdàlì"], "Spain": ["西班牙", "Xībānyá"], "Russia": ["俄罗斯", "Éluósī"], "Egypt": ["埃及", "Āijí"], "stretch": ["伸懒腰", "shēn lǎnyāo"], "children crossing": ["注意儿童", "zhùyì értóng"], "turn left": ["左转", "zuǒ zhuǎn"], "turn right": ["右转", "yòu zhuǎn"], "go straight": ["直走", "zhí zǒu"], "line up": ["排队", "páiduì"], "canteen": ["食堂", "shítáng"], "timetable": ["课程表", "kèchéngbiǎo"], "notice board": ["公告栏", "gōnggàolán"], "computer room": ["电脑室", "diànnǎoshì"], "restroom": ["厕所", "cèsuǒ"], "drinking water": ["饮用水", "yǐnyòngshuǐ"], "principal": ["校长", "xiàozhǎng"], "school bag": ["书包", "shūbāo"], "raise hand": ["举手", "jǔshǒu"], "hide and seek": ["捉迷藏", "zhuōmícáng"], "rest": ["休息", "xiūxi"], "math": ["数学", "shùxué"], "history": ["历史", "lìshǐ"], "art": ["美术", "měishù"], "English": ["英语", "Yīngyǔ"], "good job": ["真棒", "zhēn bàng"], "wash feet": ["洗脚", "xǐ jiǎo"], "good night": ["晚安", "wǎn'ān"], "close eyes": ["闭眼睛", "bì yǎnjing"], "dark": ["黑暗", "hēi'àn"]};
  function zhW(list) {
    var out = [], seen = {};
    list.forEach(function (w) {
      var z = ZH[w[0] + '|' + w[1]] || ZH[w[0]];
      if (!z || seen[z[0]]) return;
      seen[z[0]] = 1;
      out.push([z[0], w[1], w[2], z[1]]);
    });
    return out;
  }
  TOPICS.forEach(function (t) { t.w = zhW(t.w); });
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
  ].map(function (r) { return { i: r[0], n: r[1], c: r[2], w: zhW(parseW(r[3])) }; });
  var CH = [['Buổi sáng ở nhà', 0, 4], ['Đi học', 4, 8], ['Buổi chiều', 8, 11], ['Buổi tối', 11, 15]];
  var DAYWORDS = L.reduce(function (a, l) { return a + l.w.length; }, 0);

  /* ================= NHỮNG CÂU GIAO TIẾP CƠ BẢN =================
     Mỗi câu: [tiếng Anh, nghĩa tiếng Việt, chữ Hán, pinyin]. Thêm câu mới vào đúng nhóm. */
  var LANG = 'zh';
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
  try { var q = JSON.parse(localStorage.getItem('zh_dg_p')); if (q && q.s) P = q; } catch (e) {}
  while (P.s.length < 15) P.s.push(0);
  if (P.lv !== 2) P.lv = 1;
  if (!P.mw) P.mw = {};
  function save() { try { localStorage.setItem('zh_dg_p', JSON.stringify(P)); } catch (e) {} }
  function best(id) { try { return +localStorage.getItem('zh_wg_best_' + id) || 0; } catch (e) { return 0; } }
  function setBest(id, v) { try { localStorage.setItem('zh_wg_best_' + id, v); } catch (e) {} }
  function plays(id) { try { return +localStorage.getItem('zh_wg_plays_' + id) || 0; } catch (e) { return 0; } }
  function addPlay(id) { try { localStorage.setItem('zh_wg_plays_' + id, plays(id) + 1); } catch (e) {} }

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
      var u = new SpeechSynthesisUtterance(w); u.lang = 'zh-CN'; u.rate = 0.8; try { var vs = speechSynthesis.getVoices().filter(function (v) { return /^zh(-|_)(CN|Hans)/i.test(v.lang) || /^zh$/i.test(v.lang); }); if (vs.length) u.voice = vs[0]; } catch (x) {}
      var done = false;
      function fin() { if (done) return; done = true; pend = Math.max(0, pend - 1); }
      u.onend = fin; u.onerror = fin;
      setTimeout(fin, 3500); // phòng khi trình duyệt không báo kết thúc
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
  '.zg-root{position:fixed;left:0;top:0;right:0;bottom:0;height:100vh;height:100dvh;z-index:99999;display:none;flex-direction:column;background:linear-gradient(180deg,#3a0d12,#8f1f26);color:#fff;font-family:' + TF + ';-webkit-font-smoothing:antialiased;-webkit-user-select:none;user-select:none;overflow:hidden}' +
  '.zg-root.on{display:flex}.zg-root *{box-sizing:border-box}' +
  '.zg-scr{display:none;flex:1;flex-direction:column;min-height:0}.zg-scr.on{display:flex}' +
  '.zg-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(12px,env(safe-area-inset-top)) 16px 10px}' +
  '.zg-title{font-size:20px;font-weight:800;line-height:1.25}.zg-top .zg-title.fl{flex:1;font-size:18px}' +
  '.zg-btn{border:0;border-radius:14px;padding:10px 16px;font-size:16px;font-weight:700;color:#fff;background:rgba(255,255,255,.16);cursor:pointer;font-family:inherit}' +
  '.zg-btn:active{transform:scale(.97)}.zg-btn.main{background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 6px 18px rgba(34,197,94,.35)}.zg-btn.sel{background:#f59e0b}' +
  '.zg-choice{flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:16px 18px max(24px,env(safe-area-inset-bottom));max-width:520px;width:100%;margin:0 auto}' +
  '.zg-big{border:0;border-radius:22px;padding:26px 16px;color:#fff;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 10px 24px rgba(0,0,0,.3)}' +
  '.zg-big:active{transform:scale(.98)}.zg-big .ic{font-size:54px;line-height:1.1;font-family:' + EF + '}.zg-big .nm{font-size:21px;font-weight:800;text-align:center}.zg-big .sub{font-size:13px;opacity:.92;text-align:center;line-height:1.4}' +
  '.zg-grid{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 16px max(20px,env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;align-content:start}' +
  '.zg-tw{display:flex;flex-direction:column;gap:5px;align-items:stretch}' +
  '.zg-gh{grid-column:1/-1;font-size:16px;font-weight:800;color:#fde68a;margin:10px 0 -4px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.18)}' +
  '.zg-pc{min-height:26px;display:flex;align-items:flex-end;justify-content:center}' +
  '.zg-pc span{background:#f59e0b;color:#3b2300;font-size:13px;font-weight:900;border-radius:999px;padding:3px 11px;box-shadow:0 3px 8px rgba(0,0,0,.3)}' +
  '.zg-topic{border:0;border-radius:18px;padding:18px 10px 14px;color:#fff;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 8px 20px rgba(0,0,0,.25);flex:1}' +
  '.zg-topic:active{transform:scale(.97)}.zg-topic .ic{font-size:46px;line-height:1.1;font-family:' + EF + '}.zg-topic .nm{font-size:16px;font-weight:800;text-align:center;line-height:1.25}.zg-topic .sub{font-size:12px;opacity:.92;text-align:center}' +
  '.zg-scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 16px max(20px,env(safe-area-inset-bottom))}' +
  '.zg-info{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;font-size:15px;font-weight:700}' +
  '.zg-scroll h3{font-size:15px;margin:14px 0 8px;color:#ffd9a8}' +
  '.zg-nodes{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}' +
  '.zg-node{border:0;border-radius:16px;padding:12px 8px;color:#fff;font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:0 6px 16px rgba(0,0,0,.25)}' +
  '.zg-node .ic{font-size:34px;font-family:' + EF + '}.zg-node .nm{font-size:14px;font-weight:800;text-align:center;line-height:1.25}.zg-node .st{font-size:15px;color:#fde68a;letter-spacing:2px}.zg-node .rv{font-size:11px;color:#fecaca;font-weight:700}' +
  '.zg-node.lock{filter:grayscale(1) brightness(.6);cursor:default}' +
  '.zg-words{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin:10px 0 16px}' +
  '.zg-wd{background:rgba(255,255,255,.12);border-radius:14px;padding:10px 6px;text-align:center;cursor:pointer;font-size:13px}.zg-wd.rv{background:rgba(239,68,68,.28)}' +
  '.zg-wd .e{font-size:34px;line-height:1.2;font-family:' + EF + '}.zg-wd b{display:block;font-size:22px;line-height:1.3}.zg-wd i{display:block;font-style:normal;font-size:13px;color:#fde68a;margin-bottom:2px}.zg-wd span{opacity:.85}' +
  '.zg-hud{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:max(10px,env(safe-area-inset-top)) 14px 8px}' +
  '.zg-pill{background:rgba(255,255,255,.16);border-radius:999px;padding:7px 12px;font-size:16px;font-weight:800;white-space:nowrap;font-variant-numeric:tabular-nums}.zg-pill.bad{color:#fecaca}' +
  '.zg-bar{height:6px;margin:0 14px 6px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden}.zg-bar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#22c55e,#facc15,#ef4444);transform-origin:left}' +
  '.zg-spd{display:flex;align-items:center;gap:8px;margin:0 14px 6px;font-size:14px;color:#ffe2c4}.zg-spd input{flex:1;min-width:0;accent-color:#22c55e;height:28px}.zg-spd b{min-width:48px;text-align:right;color:#fff;font-variant-numeric:tabular-nums}' +
  '.zg-stage{position:relative;flex:1;min-height:0;touch-action:none}.zg-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}' +
  '.zg-mean{padding:12px 16px max(16px,env(safe-area-inset-bottom));background:rgba(45,8,12,.78);border-top:2px solid rgba(255,255,255,.25);text-align:center}' +
  '.zg-mean small{display:block;font-size:12px;letter-spacing:1px;color:#ffc98f;font-weight:700}.zg-mean b{display:block;font-size:30px;line-height:1.2;font-weight:800;margin-top:2px}' +
  '.zg-res{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:max(20px,env(safe-area-inset-top)) 18px max(24px,env(safe-area-inset-bottom));text-align:center}' +
  '.zg-res h2{margin:6px 0 4px;font-size:25px}.zg-stars{font-size:46px;color:#fde68a;letter-spacing:6px}.zg-mny{font-size:40px;font-weight:900;margin:6px 0;font-variant-numeric:tabular-nums}' +
  '.zg-stats{display:flex;justify-content:center;gap:10px;margin:10px 0 14px;flex-wrap:wrap}.zg-stat{background:rgba(255,255,255,.12);border-radius:14px;padding:10px 14px;min-width:92px;font-size:13px}.zg-stat b{display:block;font-size:22px}' +
  '.zg-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0 18px}' +
  '.zg-list{text-align:left;max-width:520px;margin:0 auto}.zg-list h4{font-size:15px;margin:14px 0 6px;color:#ffd9a8}' +
  '.zg-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.09);margin-bottom:6px;font-size:15px}.zg-row.miss{background:rgba(239,68,68,.22)}' +
  '.zg-row .e{font-size:26px;font-family:' + EF + '}.zg-row b{display:block;font-size:19px}.zg-row b i{font-style:normal;font-size:13px;font-weight:600;color:#fde68a;margin-left:6px}.zg-row span span{opacity:.85;font-size:14px}';
  st.textContent += '.zg-ph{background:rgba(255,255,255,.12);border-radius:16px;padding:12px 14px;margin-bottom:10px;cursor:pointer;display:flex;gap:12px;align-items:center}' +
  '.zg-ph:active{transform:scale(.99)}.zg-ph .sp{flex:none;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:20px}' +
  '.zg-ph .tx{flex:1;min-width:0}.zg-ph b{display:block;font-size:19px;line-height:1.35}.zg-ph i{display:block;font-style:normal;color:#fde68a;font-size:14px;margin-top:2px}.zg-ph span.vi{display:block;opacity:.88;font-size:14px;margin-top:3px}' +
  '.zg-pq{max-width:520px;margin:0 auto;text-align:center}.zg-pq .q{background:rgba(255,255,255,.14);border-radius:18px;padding:18px 14px;margin:8px 0 14px}.zg-pq .q b{display:block;font-size:24px;line-height:1.35}.zg-pq .q i{display:block;font-style:normal;color:#fde68a;margin-top:4px}' +
  '.zg-opt{display:block;width:100%;text-align:left;border:0;border-radius:14px;padding:13px 14px;margin-bottom:8px;font-size:16px;font-weight:700;color:#fff;background:rgba(255,255,255,.16);cursor:pointer;font-family:inherit}' +
  '.zg-opt.ok{background:#16a34a}.zg-opt.bad{background:#dc2626}.zg-opt:disabled{cursor:default}';
  document.head.appendChild(st);

  /* ================= DOM ================= */
  var root = document.createElement('div');
  root.className = 'zg-root';
  root.innerHTML = '' +
  '<div class="zg-scr on" id="zgMenu"><div class="zg-top"><button class="zg-btn" data-a="close" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl">🀄 Học tiếng Trung – chọn hình thức học</div><button class="zg-btn" data-a="close">✕ Đóng</button></div>' +
    '<div class="zg-choice">' +
    '<button class="zg-big" data-a="topics" style="background:linear-gradient(145deg,#3b82f6,#1d4ed8)"><span class="ic">📚</span><span class="nm">Từ vựng tiếng Trung theo chủ đề</span><span class="sub">Chọn chủ đề yêu thích và hứng từ trong 2 phút</span></button>' +
    '<button class="zg-big" data-a="day" style="background:linear-gradient(145deg,#f59e0b,#ea580c)"><span class="ic">🌞</span><span class="nm">Một ngày của bé</span><span class="sub">Phá đảo 15 màn từ lúc thức dậy đến khi đi ngủ, hơn ' + DAYWORDS + ' từ vựng</span></button>' +
    '<button class="zg-big" data-a="phr" style="background:linear-gradient(145deg,#14b8a6,#0f766e)"><span class="ic">💬</span><span class="nm">Những câu giao tiếp cơ bản</span><span class="sub">' + PHRN + ' câu thông dụng theo ' + PHR.length + ' tình huống: nghe, đọc theo và luyện tập</span></button>' +
    '</div></div>' +
  '<div class="zg-scr" id="zgTopics"><div class="zg-top"><button class="zg-btn" data-a="menu" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl">Hãy chọn một chủ đề để bắt đầu chơi</div></div><div class="zg-grid" id="zgGrid"></div></div>' +
  '<div class="zg-scr" id="zgMap"><div class="zg-top"><button class="zg-btn" data-a="menu" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl">🌞 Một ngày của bé</div></div>' +
    '<div class="zg-scroll"><div class="zg-info"><span id="zgInfo"></span><span><button class="zg-btn" id="zgL1" data-a="lv1" style="padding:6px 12px;font-size:14px">Cấp 1 (có hình)</button> <button class="zg-btn" id="zgL2" data-a="lv2" style="padding:6px 12px;font-size:14px">Cấp 2 (chỉ chữ)</button></span></div><div id="zgMapList"></div></div></div>' +
  '<div class="zg-scr" id="zgIntro"><div class="zg-top"><button class="zg-btn" data-a="introback" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl" id="zgIT"></div></div>' +
    '<div class="zg-scroll"><div style="font-size:14px;color:#ffe2c4;line-height:1.5" id="zgIntroTxt"></div><div class="zg-words" id="zgWords"></div><div style="text-align:center;position:sticky;bottom:0;padding:12px 0 4px;background:linear-gradient(rgba(143,31,38,0),#8f1f26 45%)"><button class="zg-btn main" data-a="go">▶ Bắt đầu</button></div></div></div>' +
  '<div class="zg-scr" id="zgPlay"><div class="zg-hud"><button class="zg-btn" data-a="quit" style="padding:8px 12px">←</button><div class="zg-pill" id="zgTime">⏱ 2:00</div><div class="zg-pill" id="zgOk">✅ 0</div><div class="zg-pill" id="zgMoney">💰 0đ</div></div>' +
    '<div class="zg-bar"><i id="zgBar"></i></div>' +
    '<div class="zg-spd" id="zgSpdRow"><span>🐢</span><input type="range" id="zgSpd" min="0.3" max="1.5" step="0.1"><span>🐇</span><b id="zgSpdV"></b></div>' +
    '<div class="zg-stage" id="zgStage"><canvas id="zgCv"></canvas></div>' +
    '<div class="zg-mean"><small>Nghĩa của từ – hứng chữ Hán đúng</small><b id="zgMean">…</b></div></div>' +
  '<div class="zg-scr" id="zgPhr"><div class="zg-top"><button class="zg-btn" data-a="menu" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl">💬 Những câu giao tiếp cơ bản</div></div><div class="zg-grid" id="zgPhrGrid"></div></div>' +
  '<div class="zg-scr" id="zgPhrL"><div class="zg-top"><button class="zg-btn" data-a="phr" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl" id="zgPhrT"></div></div><div class="zg-scroll" id="zgPhrList"></div></div>' +
  '<div class="zg-scr" id="zgPhrQ"><div class="zg-top"><button class="zg-btn" data-a="phrback" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl" id="zgPhrQT"></div></div><div class="zg-scroll"><div class="zg-pq" id="zgPhrQB"></div></div></div>' +
  '<div class="zg-scr" id="zgEnd"><div class="zg-top"><button class="zg-btn" data-a="endback" style="padding:8px 14px;font-size:20px">←</button><div class="zg-title fl">Kết quả</div></div><div class="zg-res" id="zgRes" style="padding-top:4px"></div></div>';
  document.body.appendChild(root);

  var $ = function (id) { return document.getElementById(id); };
  var scr = { menu: $('zgMenu'), topics: $('zgTopics'), map: $('zgMap'), intro: $('zgIntro'), play: $('zgPlay'), end: $('zgEnd'), phr: $('zgPhr'), phrl: $('zgPhrL'), phrq: $('zgPhrQ') };
  function show(k) { for (var n in scr) scr[n].classList.toggle('on', n === k); }
  var cv = $('zgCv'), ctx = cv.getContext('2d'), stage = $('zgStage');
  var meanEl = $('zgMean'), spdEl = $('zgSpd'), spdV = $('zgSpdV');
  function spdLabel() { spdV.textContent = 'x' + SPEED.toFixed(1).replace('.', ','); }
  spdEl.value = SPEED; spdLabel();
  spdEl.addEventListener('input', function () { SPEED = parseFloat(spdEl.value) || 1; try { localStorage.setItem('zh_wg_speed', SPEED); } catch (e) {} spdLabel(); });

  /* ================= MÀN CHỌN CHỦ ĐỀ ================= */
  function renderTopics() {
    var grid = $('zgGrid'); grid.innerHTML = '';
    var lastG = -1;
    MENU.forEach(function (t, ti) {
      var tl = ti >= lkFree(MENU.length) && !lkOpen();
      if (t.g !== lastG) { lastG = t.g; var hh = document.createElement('div'); hh.className = 'zg-gh'; hh.textContent = t.g < GROUPS.length ? GROUPS[t.g] : '🎲 Ôn tập'; grid.appendChild(hh); }
      var w = document.createElement('div'); w.className = 'zg-tw';
      var n = plays(t.id), bs = best(t.id);
      var pc = document.createElement('div'); pc.className = 'zg-pc';
      if (n > 0) pc.innerHTML = '<span>🔁 Đã chơi ' + n + ' lần</span>';
      var b = document.createElement('button'); b.className = 'zg-topic';
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
    $('zgInfo').textContent = '⭐ ' + tot + '/45 · 💰 ' + money(P.m);
    $('zgL1').classList.toggle('sel', P.lv === 1); $('zgL2').classList.toggle('sel', P.lv === 2);
    var h = '';
    CH.forEach(function (c) {
      h += '<h3>' + c[0] + '</h3><div class="zg-nodes">';
      for (var i = c[1]; i < c[2]; i++) {
        var lock = i > 0 && !P.s[i - 1], rv = (P.mw[i] || []).length;
        h += '<button class="zg-node' + (lock ? ' lock' : '') + '" ' + (lock ? '' : 'data-a="lvl" data-i="' + i + '"') + ' style="background:linear-gradient(145deg,' + L[i].c + ',' + L[i].c + 'bb)"><span class="ic">' + (lock ? '🔒' : L[i].i) + '</span><span class="nm">' + (i >= lkFree(L.length) && !lkOpen() ? '🔒 ' : '') + (i + 1) + '. ' + L[i].n + '</span><span class="st">' + stars(P.s[i]) + '</span>' + (rv && !lock ? '<span class="rv">📌 ' + rv + ' từ cần ôn</span>' : '') + '</button>';
      }
      h += '</div>';
    });
    $('zgMapList').innerHTML = h;
  }
  var introT = null, introW = [];
  function openTopicIntro(t) {
    stopSpeak();
    introT = t; introW = t.w;
    var bs = best(t.id);
    $('zgIT').textContent = t.i + ' Chủ đề: ' + t.n;
    $('zgIntroTxt').innerHTML = 'Chủ đề này có <b>' + t.w.length + '</b> từ vựng. Chạm vào từng thẻ để nghe phát âm và nhớ nghĩa, rồi bấm Bắt đầu. Trong 2 phút, hãy hứng đúng chữ Hán khớp với nghĩa tiếng Việt ở phía dưới màn hình.' + (bs ? '<br>🏆 Kỷ lục của bạn: <b>' + money(bs) + '</b>' : '');
    $('zgWords').innerHTML = t.w.map(function (w, k) { return '<div class="zg-wd" data-a="say" data-i="' + k + '"><div class="e">' + ic(w, 36) + '</div><b>' + w[0] + '</b><i>' + w[3] + '</i><span>' + w[1] + '</span></div>'; }).join('');
    $('zgIntro').querySelector('.zg-scroll').scrollTop = 0;
    show('intro');
  }
  function openIntro(i) {
    introT = null; introW = L[i].w;
    cur = i; var lv = L[i], N = lv.w.length, mw = P.mw[i] || [];
    $('zgIT').textContent = lv.i + ' Màn ' + (i + 1) + ': ' + lv.n;
    var need = Math.ceil(N * 0.6);
    $('zgIntroTxt').innerHTML = 'Chạm vào từng thẻ để nghe phát âm, làm quen rồi bấm Bắt đầu. Cần hứng đúng ít nhất <b>' + need + '/' + N + '</b> từ để qua màn.' +
      (mw.length ? '<br>📌 Có <b>' + mw.length + '</b> từ (nền đỏ) bạn chọn sai lần trước – chúng sẽ xuất hiện sớm hơn và nhiều hơn.' : '');
    $('zgWords').innerHTML = lv.w.map(function (w, k) { return '<div class="zg-wd' + (mw.indexOf(w[0]) >= 0 ? ' rv' : '') + '" data-a="say" data-i="' + k + '"><div class="e">' + ic(w, 36) + '</div><b>' + w[0] + '</b><i>' + w[3] + '</i><span>' + w[1] + '</span></div>'; }).join('');
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
    $('zgSpdRow').style.display = '';
    show('play');
    G = { mode: 'topic', topic: topic, secs: GAME_SECONDS, left: GAME_SECONDS, money: 0, ok: 0, bad: 0, items: [], floats: [], bag: [],
          got: {}, missed: {}, wait: 0.4, target: null, bx: 0, tx: 0, bw: 120, flash: 0, flashC: '', last: 0, pic: true };
    begin();
  }
  function startDay(li) {
    stopSpeak(); cur = li;
    $('zgSpdRow').style.display = 'none';
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
    var lane = W / n, cw = Math.min(96, lane - 14), ch = G.pic ? cw * 1.3 : cw * 0.86;
    var base = H * (0.30 + 0.10 * (1 - G.left / G.secs));
    if (G.mode === 'day') base *= 0.6 + 0.3 * G.li / 14 + (P.lv === 2 ? 0.15 : 0);
    G.items = opts.map(function (o, i) {
      return { w: o, ok: o === t, x: i * lane + (lane - cw) / 2 + rand(-4, 4), y: -ch - rand(0, 40), cw: cw, ch: ch, vy: base * rand(0.92, 1.12) };
    });
  }
  function fl(x, y, text, color) { G.floats.push({ x: x, y: y, t: 0, text: text, color: color }); }
  function hud() {
    var s = Math.max(0, Math.ceil(G.left));
    $('zgTime').textContent = '⏱ ' + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    $('zgOk').textContent = G.mode === 'day' ? '✅ ' + Object.keys(G.got).length + '/' + G.total : '✅ ' + G.ok;
    var m = $('zgMoney'); m.textContent = '💰 ' + money(G.money); m.classList.toggle('bad', G.money < 0);
    $('zgBar').style.transform = 'scaleX(' + Math.max(0, G.left / G.secs) + ')';
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
        if (it.ok) { G.missed[it.w[0]] = it.w; fl(W / 2, H * 0.5, 'Lỡ: ' + it.w[0] + ' ' + it.w[3], '#fde68a'); }
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
      var txtY, pyY;
      if (G.pic) { drawIcon(it.w[2], it.x + it.cw / 2, it.y + it.ch * 0.30, it.cw * 0.46); txtY = it.y + it.ch * 0.64; pyY = it.y + it.ch * 0.86; }
      else { txtY = it.y + it.ch * 0.42; pyY = it.y + it.ch * 0.78; }
      var fs = Math.round(Math.max(16, it.cw * (G.pic ? 0.25 : 0.3)));
      ctx.font = '800 ' + fs + 'px ' + TF;
      while (ctx.measureText(it.w[0]).width > it.cw - 10 && fs > 10) { fs--; ctx.font = '800 ' + fs + 'px ' + TF; }
      ctx.fillStyle = '#7f1d1d'; ctx.fillText(it.w[0], it.x + it.cw / 2, txtY);
      var ps = Math.round(Math.max(11, it.cw * 0.14));
      ctx.font = '700 ' + ps + 'px ' + TF;
      while (ctx.measureText(it.w[3]).width > it.cw - 8 && ps > 8) { ps--; ctx.font = '700 ' + ps + 'px ' + TF; }
      ctx.fillStyle = '#b45309'; ctx.fillText(it.w[3], it.x + it.cw / 2, pyY);
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
      return '<div class="zg-row ' + cls + '"><span class="e">' + ic(w, 28) + '</span><span><b>' + w[0] + '<i>' + w[3] + '</i></b><span>' + w[1] + '</span></span></div>'; }).join('');
  }
  function fe(a, ok) { try { if (window.farmEarn) window.farmEarn('zh', a, ok); } catch (e) {} }
  function finish() {
    cancelAnimationFrame(raf); stopSpeak();
    var g = G;
    if (g.mode === 'topic') {
      var id = g.topic.id, prev = best(id), isNew = g.money > prev && g.money > 0; sfx(g.money > 0 ? 'win' : 'bad');
      if (isNew) setBest(id, g.money);
      fe(g.money, g.ok);
      var total = g.ok + g.bad, acc = total ? Math.round(g.ok * 100 / total) : 0;
      var h = '<div style="font-size:54px">' + (g.money > 0 ? '🎉' : '⏰') + '</div><h2>Hết giờ! – ' + g.topic.n + '</h2>' +
        '<div class="zg-mny" style="color:' + (g.money >= 0 ? '#4ade80' : '#f87171') + '">' + money(g.money, 1) + '</div>' +
        (isNew ? '<div style="color:#fde68a;font-weight:800">🏆 Kỷ lục mới!</div>' : (prev ? '<div style="opacity:.8">Kỷ lục: ' + money(prev) + '</div>' : '')) +
        '<div class="zg-stats"><div class="zg-stat"><b>' + g.ok + '</b>Hứng đúng</div><div class="zg-stat"><b>' + g.bad + '</b>Hứng sai</div><div class="zg-stat"><b>' + acc + '%</b>Chính xác</div></div>' +
        '<div class="zg-acts"><button class="zg-btn main" data-a="again">▶ Chơi lại</button><button class="zg-btn" data-a="topics">Chọn chủ đề</button></div>';
      var got = Object.keys(g.got), mis = Object.keys(g.missed).filter(function (k) { return !g.got[k]; });
      h += '<div class="zg-list">';
      if (got.length) h += '<h4>✅ Từ bạn đã nhớ (' + got.length + ')</h4>' + rows(got, g.got, '');
      if (mis.length) h += '<h4>📌 Từ cần ôn lại (' + mis.length + ')</h4>' + rows(mis, g.missed, 'miss');
      h += '</div>';
      $('zgRes').innerHTML = h;
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
        '<div class="zg-stars">' + stars(sr) + '</div><div>Hứng đúng <b>' + n + '/' + N + '</b> từ</div>' +
        '<div class="zg-mny" style="color:' + (gain >= 0 ? '#4ade80' : '#f87171') + '">' + money(gain, 1) + '</div>' +
        (pass ? '<div style="opacity:.85;font-size:14px">đã gồm thưởng ' + money(sr * 20000) + ' cho ' + sr + ' sao</div>' : '<div style="opacity:.85;font-size:14px">Cần hứng đúng ít nhất ' + Math.ceil(N * 0.6) + ' từ để qua màn</div>') +
        '<div class="zg-acts">' + (pass ? '<button class="zg-btn main" data-a="' + (last ? 'win' : 'next') + '">' + (last ? '🏆 Phá đảo!' : '▶ Màn tiếp theo') + '</button>' : '') +
        '<button class="zg-btn" data-a="retry">↻ Chơi lại</button><button class="zg-btn" data-a="map">Bản đồ</button></div>';
      if (mis2.length) h2 += '<div class="zg-list"><h4>📌 Từ cần ôn lại (' + mis2.length + ') – lần chơi lại sẽ xuất hiện nhiều hơn</h4>' + rows(mis2, g.missed, 'miss') + '</div>';
      $('zgRes').innerHTML = h2;
    }
    $('zgRes').scrollTop = 0; show('end');
  }
  function winScreen() {
    var tot = P.s.reduce(function (a, b) { return a + b; }, 0);
    $('zgRes').innerHTML = '<div style="font-size:70px">🏆</div><h2>Phá đảo "Một ngày của bé"!</h2><div class="zg-stars">★</div>' +
      '<div>Bé đã hoàn thành cả 15 màn và học ' + DAYWORDS + ' từ vựng</div><div class="zg-mny" style="color:#fde68a">⭐ ' + tot + '/45</div>' +
      '<div style="font-size:18px;font-weight:800">Tổng tiền thưởng: ' + money(P.m) + '</div>' +
      '<div class="zg-acts"><button class="zg-btn main" data-a="map">Về bản đồ (chơi lại lấy thêm sao)</button></div>';
    show('end');
  }
  function toMap() { cancelAnimationFrame(raf); G = null; stopSpeak(); renderMap(); show('map'); }
  function toTopics() { cancelAnimationFrame(raf); G = null; stopSpeak(); renderTopics(); show('topics'); }


  /* ================= MÀN CÂU GIAO TIẾP ================= */
  var phG = 0, PQ = null;
  function renderPhr() {
    $('zgPhrGrid').innerHTML = PHR.map(function (g, k) {
      return '<div class="zg-tw"><div class="zg-pc"></div><button class="zg-topic" data-a="phrcat" data-i="' + k + '" style="background:linear-gradient(145deg,' + g.c + ',' + g.c + 'bb)"><span class="ic">' + (k >= lkFree(PHR.length) && !lkOpen() ? '🔒' : g.i) + '</span><span class="nm">' + g.n + '</span><span class="sub">' + g.p.length + ' câu</span></button></div>';
    }).join('');
    show('phr');
  }
  function renderPhrList(k) {
    phG = k; var g = PHR[k];
    $('zgPhrT').textContent = g.i + ' ' + g.n;
    $('zgPhrList').innerHTML = '<div style="font-size:14px;color:#ffe2c4;line-height:1.5;margin-bottom:10px">Chạm vào từng câu để nghe phát âm rồi đọc theo. Học xong, bấm Luyện tập để kiểm tra.</div>' +
      g.p.map(function (p, i) { return '<div class="zg-ph" data-a="phsay" data-i="' + i + '"><span class="sp">🔊</span><span class="tx"><b>' + phT(p) + '</b>' + (phPy(p) ? '<i>' + phPy(p) + '</i>' : '') + '<span class="vi">' + p[1] + '</span></span></div>'; }).join('') +
      '<div style="text-align:center;position:sticky;bottom:0;padding:16px 0 6px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.45) 55%)"><button class="zg-btn main" data-a="phquiz">🎯 Luyện tập</button></div>';
    $('zgPhrList').scrollTop = 0;
    show('phrl');
  }
  function phQuizStart() {
    var g = PHR[phG];
    PQ = { qs: shuffle(g.p.slice()).slice(0, Math.min(8, g.p.length)), n: 0, ok: 0, pick: -1, opts: [] };
    phQuizDraw();
    show('phrq');
  }
  function phQuizDraw() {
    var g = PHR[phG], B = $('zgPhrQB');
    $('zgPhrQT').textContent = '🎯 Luyện tập: ' + g.n;
    if (PQ.n >= PQ.qs.length) {
      var all = PQ.ok === PQ.qs.length; if (!PQ.done) { PQ.done = 1; if (PQ.ok * 4 >= PQ.qs.length * 3) sfx('win'); }
      B.innerHTML = '<div style="font-size:54px">' + (all ? '🏆' : (PQ.ok * 2 >= PQ.qs.length ? '🎉' : '💪')) + '</div><h2 style="margin:6px 0">Đúng ' + PQ.ok + '/' + PQ.qs.length + ' câu</h2>' +
        '<div style="opacity:.85">' + (all ? 'Tuyệt vời! Bạn đã nhớ hết các câu.' : 'Hãy nghe lại các câu và luyện tập thêm nhé.') + '</div>' +
        '<div class="zg-acts"><button class="zg-btn main" data-a="phquiz">↻ Luyện lại</button><button class="zg-btn" data-a="phrback">📖 Xem lại các câu</button><button class="zg-btn" data-a="phr">Chọn tình huống khác</button></div>';
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
      '<div style="font-size:14px;margin-bottom:8px;color:#ffe2c4">Câu này có nghĩa là gì?</div>' +
      PQ.opts.map(function (o, i) { var c = done ? (o === p ? ' ok' : (i === PQ.pick ? ' bad' : '')) : ''; return '<button class="zg-opt' + c + '" data-a="phans" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + o[1] + '</button>'; }).join('') +
      (done ? '<div class="zg-acts"><button class="zg-btn main" data-a="phnext">' + (PQ.n + 1 < PQ.qs.length ? 'Câu tiếp theo ▶' : 'Xem kết quả ▶') + '</button></div>' : '');
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
  window.SixZhGame = api;
})();
