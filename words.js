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
    sh_pyramid: '<polygon points="32,6 58,52 6,52" fill="#fbbf24"/><polygon points="32,6 58,52 32,52" fill="#d97706"/>'
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
  function T(id, i, n, c, w) { return { id: id, i: i, n: n, c: c, w: typeof w === 'string' ? parseW(w) : w }; }
  var TOPICS = [
    T('animals', '🦁', 'Động vật', '#f59e0b', 'cat|con mèo|🐱;dog|con chó|🐶;horse|con ngựa|🐴;rabbit|con thỏ|🐰;monkey|con khỉ|🐵;elephant|con voi|🐘;lion|sư tử|🦁;tiger|con hổ|🐯;bird|con chim|🐦;fish|con cá|🐟;duck|con vịt|🦆;pig|con lợn|🐷;cow|con bò|🐮;sheep|con cừu|🐑;hen|con gà mái|🐔;frog|con ếch|🐸;bear|con gấu|🐻;panda|gấu trúc|🐼;snake|con rắn|🐍;giraffe|hươu cao cổ|🦒;zebra|ngựa vằn|🦓;kangaroo|chuột túi|🦘;crocodile|cá sấu|🐊;owl|con cú|🦉;rhinoceros|con tê giác|🦏;hippopotamus|hà mã|🦛;camel|con lạc đà|🐪;deer|con hươu|🦌;fox|con cáo|🦊;wolf|con sói|🐺;squirrel|con sóc|🐿️;hedgehog|con nhím|🦔;bat|con dơi|🦇;koala|gấu koala|🐨;goat|con dê|🐐;buffalo|con trâu|🐃;mouse|con chuột|🐭;leopard|con báo|🐆;gorilla|khỉ đột|🦍;dinosaur|khủng long|🦖;lizard|thằn lằn|🦎'),
    T('fruits', '🍎', 'Trái cây & rau củ', '#ef4444', 'apple|quả táo|🍎;banana|quả chuối|🍌;orange|quả cam|🍊;grape|quả nho|🍇;watermelon|dưa hấu|🍉;strawberry|dâu tây|🍓;pineapple|quả dứa|🍍;lemon|quả chanh|🍋;peach|quả đào|🍑;cherry|quả anh đào|🍒;carrot|cà rốt|🥕;tomato|cà chua|🍅;mango|quả xoài|🥭;coconut|quả dừa|🥥;pear|quả lê|🍐;kiwi|quả kiwi|🥝;avocado|quả bơ|🥑;corn|bắp ngô|🌽;potato|khoai tây|🥔;onion|củ hành|🧅;garlic|củ tỏi|🧄;broccoli|súp lơ xanh|🥦;cucumber|dưa chuột|🥒;eggplant|cà tím|🍆;mushroom|nấm|🍄;chili|quả ớt|🌶️;melon|dưa lê|🍈;green apple|táo xanh|🍏;lettuce|rau xà lách|🥬;peanut|đậu phộng|🥜;chestnut|hạt dẻ|🌰'),
    T('food', '🍕', 'Đồ ăn & thức uống', '#f97316', 'bread|bánh mì|🍞;rice|cơm / gạo|🍚;egg|quả trứng|🥚;milk|sữa|🥛;cheese|phô mai|🧀;pizza|bánh pizza|🍕;noodles|mì / phở|🍜;coffee|cà phê|☕;cake|bánh ngọt|🍰;ice cream|kem|🍦;chicken|thịt gà|🍗;hamburger|bánh hamburger|🍔;sandwich|bánh sandwich|🥪;hot dog|xúc xích kẹp bánh|🌭;french fries|khoai tây chiên|🍟;sushi|sushi|🍣;soup|món súp|🍲;salad|món salad|🥗;cookie|bánh quy|🍪;chocolate|sô cô la|🍫;candy|kẹo|🍬;donut|bánh vòng|🍩;honey|mật ong|🍯;tea|trà|🍵;juice|nước ép|🧃;beer|bia|🍺;pasta|mì Ý|🍝;curry|cà ri|🍛;dumpling|há cảo|🥟;taco|bánh taco|🌮;burrito|bánh burrito|🌯;popcorn|bắp rang|🍿;pancakes|bánh kếp|🥞;croissant|bánh sừng bò|🥐;pretzel|bánh quy xoắn|🥨;steak|bít tết|🥩;rice ball|cơm nắm|🍙;bento|cơm hộp|🍱;pie|bánh nướng|🥧;cupcake|bánh cupcake|🧁;lollipop|kẹo mút|🍭;wine|rượu vang|🍷;cocktail|cốc tai|🍹;soft drink|nước ngọt|🥤;fried egg|trứng ốp la|🍳;birthday cake|bánh sinh nhật|🎂;bacon|thịt xông khói|🥓'),
    T('jobs', '👨‍⚕️', 'Nghề nghiệp', '#06b6d4', 'doctor|bác sĩ|👨‍⚕️;teacher|giáo viên|👩‍🏫;farmer|nông dân|👨‍🌾;cook|đầu bếp|👨‍🍳;police officer|cảnh sát|👮;firefighter|lính cứu hỏa|🧑‍🚒;pilot|phi công|🧑‍✈️;artist|họa sĩ|🧑‍🎨;singer|ca sĩ|🧑‍🎤;scientist|nhà khoa học|🧑‍🔬;mechanic|thợ máy|🧑‍🔧;astronaut|phi hành gia|🧑‍🚀;judge|thẩm phán|🧑‍⚖️;office worker|nhân viên văn phòng|🧑‍💼;builder|công nhân xây dựng|👷;guard|lính gác|💂;detective|thám tử|🕵️;programmer|lập trình viên|🧑‍💻;dancer|vũ công|💃;photographer|nhiếp ảnh gia|📸;nurse|y tá|👩‍⚕️;waiter|bồi bàn|🤵;clown|chú hề|🤡;student|học sinh|🧑‍🎓'),
    T('transport', '🚗', 'Phương tiện', '#3b82f6', 'car|ô tô|🚗;bus|xe buýt|🚌;train|tàu hỏa|🚆;plane|máy bay|✈️;bicycle|xe đạp|🚲;motorbike|xe máy|🏍️;ship|tàu thủy|🚢;helicopter|trực thăng|🚁;taxi|xe taxi|🚕;truck|xe tải|🚚;rocket|tên lửa|🚀;ambulance|xe cứu thương|🚑;scooter|xe tay ga|🛵;tram|xe điện|🚋;subway|tàu điện ngầm|🚇;tractor|máy kéo|🚜;sailboat|thuyền buồm|⛵;race car|xe đua|🏎️;skateboard|ván trượt|🛹;fire truck|xe cứu hỏa|🚒;police car|xe cảnh sát|🚓;canoe|ca nô|🛶;cable car|cáp treo|🚠;speedboat|xuồng máy|🚤;flying saucer|đĩa bay|🛸;fuel pump|trạm xăng|⛽;traffic light|đèn giao thông|🚦;anchor|mỏ neo|⚓;bus stop|trạm xe buýt|🚏;minibus|xe khách nhỏ|🚐'),
    T('nature', '🌈', 'Thiên nhiên', '#10b981', 'sun|mặt trời|☀️;moon|mặt trăng|🌙;star|ngôi sao|⭐;rain|cơn mưa|🌧️;snow|tuyết|❄️;cloud|đám mây|☁️;rainbow|cầu vồng|🌈;lightning|tia chớp|⚡;tree|cái cây|🌳;flower|bông hoa|🌸;mountain|ngọn núi|⛰️;wave|con sóng|🌊;fire|ngọn lửa|🔥;earth|trái đất|🌍;volcano|núi lửa|🌋;desert|sa mạc|🏜️;island|hòn đảo|🏝️;leaf|chiếc lá|🍃;cactus|xương rồng|🌵;tornado|lốc xoáy|🌪️;fog|sương mù|🌫️;sunrise|bình minh|🌅;sunset|hoàng hôn|🌇;comet|sao chổi|☄️;palm tree|cây cọ|🌴;forest|khu rừng|🌲;camping|cắm trại|🏕️;water drop|giọt nước|💧;ice|băng đá|🧊'),
    T('weather', '⛅', 'Thời tiết & mùa', '#0891b2', 'sunny|trời nắng|☀️;cloudy|trời nhiều mây|☁️;rainy|trời mưa|🌧️;snowy|trời tuyết|❄️;stormy|có bão|⛈️;windy|có gió|💨;foggy|có sương mù|🌫️;hot|nóng|🥵;cold|lạnh|🥶;rainbow|cầu vồng|🌈;thunder|sấm chớp|⚡;tornado|lốc xoáy|🌪️;umbrella|cái ô|☂️;snowman|người tuyết|⛄;partly cloudy|có mây rải rác|⛅;thermometer|nhiệt kế|🌡️;spring|mùa xuân|🌱;summer|mùa hè|🏖️;autumn|mùa thu|🍂;winter|mùa đông|☃️;sunrise|bình minh|🌅;sunset|hoàng hôn|🌇;flood|lũ lụt|🌊'),
    T('objects', '🎒', 'Đồ vật quanh ta', '#8b5cf6', 'book|quyển sách|📖;phone|điện thoại|📱;key|chìa khóa|🔑;clock|đồng hồ|⏰;umbrella|cái ô / dù|☂️;glasses|kính mắt|👓;bag|cái cặp / ba lô|🎒;computer|máy tính|💻;camera|máy ảnh|📷;lamp|bóng đèn|💡;scissors|cái kéo|✂️;gift|món quà|🎁;television|ti vi|📺;envelope|phong bì|✉️;balloon|bóng bay|🎈;trophy|cúp|🏆;flag|lá cờ|🚩;pen|cây bút|🖊️;map|bản đồ|🗺️;tent|cái lều|⛺;microscope|kính hiển vi|🔬;telescope|kính thiên văn|🔭;medicine|viên thuốc|💊;baby bottle|bình sữa|🍼;hourglass|đồng hồ cát|⏳;flashlight|đèn pin|🔦;lock|ổ khóa|🔒;ring|chiếc nhẫn|💍;crown|vương miện|👑;lipstick|son môi|💄;sunglasses|kính râm|🕶️;package|gói hàng|📦;newspaper|tờ báo|📰;vase|cái bình|🏺;joystick|cần điều khiển|🕹️;pushpin|cái ghim|📌'),
    T('body', '🧍', 'Cơ thể', '#f43f5e', 'eye|con mắt|👁️;ear|cái tai|👂;nose|cái mũi|👃;mouth|cái miệng|👄;hand|bàn tay|✋;foot|bàn chân|🦶;leg|cái chân|🦵;arm|cánh tay|💪;tooth|cái răng|🦷;brain|bộ não|🧠;tongue|cái lưỡi|👅;bone|xương|🦴;heart|trái tim|❤️;hair|mái tóc|💇;nail|móng tay|💅;footprints|dấu chân|👣;finger|ngón tay|☝️;thumb|ngón cái|👍;fist|nắm đấm|✊;clap|vỗ tay|👏;skull|đầu lâu|💀;eyes|đôi mắt|👀;waving hand|vẫy tay|👋;peace sign|chữ V|✌️;ok sign|dấu OK|👌;praying hands|chắp tay|🙏;handshake|bắt tay|🤝'),
    T('clothes', '👕', 'Quần áo', '#0ea5e9', 'shirt|áo sơ mi|👕;pants|quần dài|👖;dress|váy liền|👗;cap|mũ lưỡi trai|🧢;sneakers|giày thể thao|👟;socks|đôi tất|🧦;coat|áo khoác|🧥;scarf|khăn quàng|🧣;gloves|găng tay|🧤;tie|cà vạt|👔;boots|đôi ủng|🥾;bikini|đồ bơi|👙;hat|cái mũ|👒;high heels|giày cao gót|👠;sandals|dép xăng đan|👡;kimono|áo kimono|👘;handbag|túi xách|👜;lab coat|áo blouse|🥼;top hat|mũ chóp cao|🎩;graduation cap|mũ tốt nghiệp|🎓;helmet|mũ bảo hiểm|⛑️;shorts|quần đùi|🩳;pajamas|đồ ngủ|@pajamas;backpack|ba lô|🎒'),
    T('home', '🏠', 'Trong nhà', '#a16207', 'house|ngôi nhà|🏠;bed|cái giường|🛏️;door|cánh cửa|🚪;chair|cái ghế|🪑;toilet|bồn cầu|🚽;bathtub|bồn tắm|🛁;shower|vòi sen|🚿;window|cửa sổ|🪟;broom|cái chổi|🧹;soap|xà phòng|🧼;candle|ngọn nến|🕯️;mirror|cái gương|🪞;sofa|ghế sofa|🛋️;telephone|điện thoại bàn|☎️;mailbox|hòm thư|📫;trash can|thùng rác|🗑️;basket|cái giỏ|🧺;toothbrush|bàn chải đánh răng|🪥;sponge|bọt biển|🧽;pillow|cái gối|@pillow;blanket|cái chăn|@blanket;towel|khăn tắm|@towel;comb|cái lược|@comb;tissue|khăn giấy|@tissue;garden|khu vườn|🏡'),
    T('kitchen', '🍴', 'Nhà bếp', '#b45309', 'knife|con dao|🔪;fork|cái nĩa|🍴;spoon|cái thìa|🥄;chopsticks|đôi đũa|🥢;plate|cái đĩa|🍽️;bowl|cái bát|🥣;cup|cái tách|☕;glass|cái ly|🥃;bottle|cái chai|🍾;pot|cái nồi|🍲;frying pan|cái chảo|🍳;salt|muối|🧂;baby bottle|bình sữa|🍼;fire|bếp lửa|🔥;trash can|thùng rác|🗑️;water|nước|💧;ice|đá viên|🧊;butter|bơ|🧈;bread|bánh mì|🍞;egg|quả trứng|🥚;rice|cơm|🍚;sponge|bọt biển|🧽;soap|nước rửa bát|🧼;bucket|cái xô|🪣;broom|cái chổi|🧹;basket|cái giỏ|🧺'),
    T('family', '👪', 'Gia đình & con người', '#e11d48', 'father|bố|👨;mother|mẹ|👩;grandfather|ông|👴;grandmother|bà|👵;baby|em bé|👶;boy|bé trai|👦;girl|bé gái|👧;child|đứa trẻ|🧒;family|gia đình|👪;friends|bạn bè|👫;couple|cặp đôi|💑;uncle|chú / bác|🧔;aunt|cô / dì|👩‍🦰;bride|cô dâu|👰;groom|chú rể|🤵;wedding|đám cưới|💒;king|nhà vua|🤴;queen|nữ hoàng|👸;love|tình yêu|💕;kiss|nụ hôn|💋;hug|cái ôm|🤗;pregnant woman|bà bầu|🤰;old man|ông già|🧓;twins|cặp song sinh|👯'),
    T('sports', '⚽', 'Thể thao', '#16a34a', 'football|bóng đá|⚽;basketball|bóng rổ|🏀;tennis|quần vợt|🎾;volleyball|bóng chuyền|🏐;baseball|bóng chày|⚾;swimming|bơi lội|🏊;boxing|đấm bốc|🥊;golf|đánh gôn|⛳;skiing|trượt tuyết|⛷️;cycling|đạp xe|🚴;running|chạy bộ|🏃;badminton|cầu lông|🏸;rugby|bóng bầu dục|🏉;table tennis|bóng bàn|🏓;bowling|ném bowling|🎳;hockey|khúc côn cầu|🏒;ice skating|trượt băng|⛸️;surfing|lướt sóng|🏄;rowing|chèo thuyền|🚣;weightlifting|cử tạ|🏋️;yoga|yoga|🧘;gymnastics|thể dục dụng cụ|🤸;fencing|đấu kiếm|🤺;archery|bắn cung|🏹;horse racing|đua ngựa|🏇;darts|phi tiêu|🎯;medal|huy chương|🏅;karate|võ karate|🥋;fishing|câu cá|🎣;climbing|leo núi|🧗;diving|lặn|🤿'),
    T('music', '🎸', 'Âm nhạc', '#7c3aed', 'guitar|đàn ghi-ta|🎸;piano|đàn piano|🎹;drum|cái trống|🥁;violin|đàn vi-ô-lông|🎻;trumpet|kèn trumpet|🎺;saxophone|kèn saxophone|🎷;microphone|micro|🎤;headphones|tai nghe|🎧;music note|nốt nhạc|🎵;bell|cái chuông|🔔;radio|đài radio|📻;accordion|đàn accordion|🪗;musical notes|giai điệu|🎶;sheet music|bản nhạc|🎼;CD|đĩa CD|💿;loudspeaker|cái loa|🔊;mute|tắt tiếng|🔇;dancing|nhảy múa|💃;disco|nhảy disco|🕺;studio mic|micro phòng thu|🎙️;megaphone|loa tay|📢'),
    T('emotions', '😊', 'Cảm xúc', '#eab308', 'happy|vui vẻ|😊;sad|buồn|😢;angry|tức giận|😠;sleepy|buồn ngủ|😴;scared|sợ hãi|😱;surprised|ngạc nhiên|😮;laughing|cười lớn|😂;cool|ngầu|😎;sick|bị ốm|🤒;in love|đang yêu|😍;thinking|đang suy nghĩ|🤔;crying|khóc|😭;embarrassed|xấu hổ|😳;bored|chán|😑;worried|lo lắng|😟;excited|háo hức|🤩;shy|ngại ngùng|🥺;confused|bối rối|😕;relaxed|thư giãn|😌;tired|mệt mỏi|😫;silly|ngớ ngẩn|🤪;nervous|hồi hộp|😬;disgusted|ghê tởm|🤢;winking|nháy mắt|😉;smiling|mỉm cười|🙂;kissing|hôn gió|😘;celebrating|ăn mừng|🥳;dizzy|chóng mặt|😵;relieved|nhẹ nhõm|😅'),
    T('sea', '🐬', 'Sinh vật biển', '#0284c7', 'whale|cá voi|🐋;dolphin|cá heo|🐬;shark|cá mập|🦈;octopus|bạch tuộc|🐙;crab|con cua|🦀;turtle|con rùa|🐢;shrimp|con tôm|🦐;squid|con mực|🦑;lobster|tôm hùm|🦞;seal|hải cẩu|🦭;penguin|chim cánh cụt|🐧;oyster|con hàu|🦪;tropical fish|cá nhiệt đới|🐠;blowfish|cá nóc|🐡;shell|vỏ sò|🐚;swimmer|người bơi|🏊;anchor|mỏ neo|⚓'),
    T('insects', '🦋', 'Côn trùng', '#65a30d', 'bee|con ong|🐝;butterfly|con bướm|🦋;ant|con kiến|🐜;spider|con nhện|🕷️;ladybug|bọ rùa|🐞;mosquito|con muỗi|🦟;snail|con ốc sên|🐌;worm|con giun|🪱;scorpion|con bọ cạp|🦂;cricket|con dế|🦗;fly|con ruồi|🪰;caterpillar|sâu bướm|🐛;spider web|mạng nhện|🕸️;germ|vi khuẩn|🦠'),
    T('birds', '🦜', 'Các loài chim', '#0d9488', 'eagle|đại bàng|🦅;parrot|con vẹt|🦜;swan|thiên nga|🦢;flamingo|hồng hạc|🦩;peacock|con công|🦚;turkey|gà tây|🦃;rooster|gà trống|🐓;hen|gà mái|🐔;chick|gà con|🐤;hatching chick|gà con nở|🐣;dove|chim bồ câu|🕊️;duck|con vịt|🦆;owl|con cú|🦉;penguin|chim cánh cụt|🐧;bird|con chim|🐦;egg|quả trứng|🥚'),
    T('flowers', '🌻', 'Hoa & cây cối', '#ca8a04', 'rose|hoa hồng|🌹;sunflower|hoa hướng dương|🌻;tulip|hoa tulip|🌷;hibiscus|hoa dâm bụt|🌺;daisy|hoa cúc|🌼;cherry blossom|hoa anh đào|🌸;bouquet|bó hoa|💐;lotus|hoa sen|🪷;bamboo|cây tre|🎍;herb|rau thơm|🌿;clover|cỏ ba lá|🍀;palm tree|cây cọ|🌴;seedling|cây non|🌱;maple leaf|lá phong|🍁;fallen leaf|lá rụng|🍂;cactus|xương rồng|🌵;evergreen tree|cây thông|🌲;tree|cái cây|🌳;rice plant|cây lúa|🌾;mushroom|cây nấm|🍄;wilted flower|hoa héo|🥀'),
    T('places', '🏫', 'Địa điểm', '#db2777', 'school|trường học|🏫;hospital|bệnh viện|🏥;hotel|khách sạn|🏨;church|nhà thờ|⛪;factory|nhà máy|🏭;castle|lâu đài|🏰;stadium|sân vận động|🏟️;post office|bưu điện|🏤;shop|cửa hàng|🏪;beach|bãi biển|🏖️;park|công viên|🏞️;bridge|cây cầu|🌉;bank|ngân hàng|🏦;office|tòa nhà văn phòng|🏢;department store|trung tâm mua sắm|🏬;Japanese castle|lâu đài Nhật|🏯;mosque|nhà thờ Hồi giáo|🕌;tower|tháp Tokyo|🗼;Statue of Liberty|tượng Nữ thần Tự do|🗽;Mount Fuji|núi Phú Sĩ|🗻;ferris wheel|vòng quay|🎡;fountain|đài phun nước|⛲;city|thành phố|🏙️;night city|thành phố về đêm|🌃;village|ngôi làng|🏘️;roller coaster|tàu lượn|🎢;carousel|đu quay|🎠;circus|rạp xiếc|🎪;cinema|rạp chiếu phim|🎦;library|thư viện|🏛️;airport|sân bay|🛫;railway|đường ray|🛤️;highway|đường cao tốc|🛣️'),
    T('tools', '🔨', 'Dụng cụ', '#64748b', 'hammer|cái búa|🔨;saw|cái cưa|🪚;screwdriver|tua vít|🪛;wrench|cờ lê|🔧;axe|cái rìu|🪓;ladder|cái thang|🪜;magnet|nam châm|🧲;pencil|bút chì|✏️;paintbrush|cọ vẽ|🖌️;bucket|cái xô|🪣;battery|pin|🔋;toolbox|hộp đồ nghề|🧰;nut and bolt|ốc vít|🔩;gear|bánh răng|⚙️;chain|sợi xích|⛓️;pickaxe|cái cuốc|⛏️;plug|phích cắm|🔌;fire extinguisher|bình cứu hỏa|🧯;brick|viên gạch|🧱;compass|la bàn|🧭;ruler|thước kẻ|📏;shield|cái khiên|🛡️;magnifying glass|kính lúp|🔍;knife|con dao|🔪;thread|sợi chỉ|🧵;oil barrel|thùng dầu|🛢️'),
    T('colors', '🎨', 'Màu sắc', '#ea580c', colW),
    T('numbers', '🔢', 'Số đếm', '#2563eb', numW),
    T('shapes', '🔷', 'Hình khối', '#7c3aed', shapeW),
    T('days', '📅', 'Thứ & tháng', '#dc2626', dayW),
    T('time', '⏰', 'Thời gian', '#0f766e', timeW),
    T('money', '💰', 'Tiền bạc & mua sắm', '#15803d', 'money|tiền|💵;coin|đồng xu|🪙;credit card|thẻ tín dụng|💳;wallet|cái ví|👛;bank|ngân hàng|🏦;chart|biểu đồ tăng|📈;diamond|kim cương|💎;receipt|hóa đơn|🧾;calculator|máy tính|🧮;savings|tiền tiết kiệm|💰;shopping cart|xe đẩy hàng|🛒;price tag|nhãn giá|🏷️;dollar|đô la|💲;euro|đồng euro|💶;yen|đồng yên|💴;pound|đồng bảng Anh|💷;spending|tiêu tiền|💸;shopping bags|túi mua sắm|🛍️;ATM|máy ATM|🏧;scale|cái cân|⚖️;falling chart|biểu đồ giảm|📉'),
    T('space', '🪐', 'Vũ trụ', '#4f46e5', 'planet|hành tinh|🪐;earth|trái đất|🌍;moon|mặt trăng|🌙;sun|mặt trời|☀️;star|ngôi sao|⭐;comet|sao chổi|☄️;rocket|tên lửa|🚀;astronaut|phi hành gia|🧑‍🚀;UFO|đĩa bay|🛸;alien|người ngoài hành tinh|👽;satellite|vệ tinh|🛰️;telescope|kính thiên văn|🔭;galaxy|dải ngân hà|🌌;shooting star|sao băng|🌠;full moon|trăng tròn|🌕;new moon|trăng non|🌑;half moon|trăng bán nguyệt|🌓;eclipse|nhật thực|🌘;sparkles|lấp lánh|✨;robot|người máy|🤖;satellite dish|chảo vệ tinh|📡'),
    T('festivals', '🎄', 'Lễ hội & tiệc tùng', '#be123c', 'Christmas tree|cây thông Noel|🎄;Santa Claus|ông già Noel|🎅;gift|món quà|🎁;fireworks|pháo hoa|🎆;sparkler|pháo bông|🎇;lantern|đèn lồng|🏮;birthday cake|bánh sinh nhật|🎂;balloon|bóng bay|🎈;party popper|pháo giấy|🎉;confetti|giấy rắc hoa|🎊;ghost|con ma|👻;pumpkin|quả bí ngô|🎃;snowman|người tuyết|⛄;mooncake|bánh trung thu|🥮;red envelope|bao lì xì|🧧;carp streamer|cờ cá chép|🎏;bamboo decoration|cành trúc|🎍;bouquet|bó hoa|💐;ribbon|cái nơ|🎀;party|bữa tiệc|🥳;champagne|rượu sâm panh|🍾;bell|cái chuông|🔔;candy|kẹo|🍬;moon viewing|ngắm trăng|🎑'),
    T('tech', '💻', 'Công nghệ', '#475569', 'computer|máy tính|💻;desktop|máy tính để bàn|🖥️;keyboard|bàn phím|⌨️;mouse|con chuột máy tính|🖱️;printer|máy in|🖨️;phone|điện thoại|📱;camera|máy ảnh|📷;video camera|máy quay phim|📹;television|ti vi|📺;radio|đài radio|📻;robot|người máy|🤖;satellite|vệ tinh|🛰️;battery|pin|🔋;plug|phích cắm|🔌;light bulb|bóng đèn|💡;floppy disk|đĩa mềm|💾;CD|đĩa CD|💿;joystick|cần điều khiển|🕹️;video game|trò chơi điện tử|🎮;headphones|tai nghe|🎧;microphone|micro|🎤;telephone|điện thoại bàn|☎️;antenna|ăng-ten|📡;speaker|cái loa|🔊;smartwatch|đồng hồ thông minh|⌚;email|thư điện tử|📧;link|đường liên kết|🔗'),
    T('fantasy', '🐉', 'Thế giới thần tiên', '#9333ea', 'dragon|con rồng|🐉;unicorn|kỳ lân|🦄;fairy|nàng tiên|🧚;wizard|pháp sư|🧙;mermaid|nàng tiên cá|🧜;genie|thần đèn|🧞;vampire|ma cà rồng|🧛;zombie|xác sống|🧟;elf|chú lùn tai nhọn|🧝;angel|thiên thần|👼;ghost|con ma|👻;alien|người ngoài hành tinh|👽;robot|người máy|🤖;castle|lâu đài|🏰;crown|vương miện|👑;crystal ball|quả cầu pha lê|🔮;sword|thanh kiếm|⚔️;shield|cái khiên|🛡️;treasure|kho báu|💎;king|nhà vua|🤴;queen|nữ hoàng|👸;dinosaur|khủng long|🦖;long-necked dinosaur|khủng long cổ dài|🦕;skull|đầu lâu|💀;superhero|siêu anh hùng|🦸;villain|nhân vật phản diện|🦹'),
    T('school', '📚', 'Trường học', '#e11d48', 'school|trường học|🏫;teacher|giáo viên|👩‍🏫;student|học sinh|🧑‍🎓;book|quyển sách|📖;notebook|quyển vở|📓;pencil|bút chì|✏️;pen|bút mực|🖊️;ruler|thước kẻ|📏;scissors|cái kéo|✂️;eraser|cục tẩy|@eraser;glue|hồ dán|@glue;blackboard|bảng đen|@blackboard;backpack|cặp sách|🎒;calculator|máy tính bỏ túi|🧮;map|bản đồ|🗺️;globe|quả địa cầu|🌍;paper clip|kẹp giấy|📎;folder|tập hồ sơ|📁;crayon|bút sáp màu|🖍️;graduation cap|mũ tốt nghiệp|🎓;library|thư viện|🏛️;bell|chuông trường|🔔;clock|đồng hồ|🕗;microscope|kính hiển vi|🔬;palette|bảng màu|🎨;test|bài kiểm tra|💯;letters|chữ cái|🔤;calendar|quyển lịch|📅;lunch box|hộp cơm|🍱;homework|bài tập về nhà|📝;pushpin|cái ghim|📌;magnifying glass|kính lúp|🔍;bookmark|thẻ đánh dấu|🔖;gold medal|huy chương vàng|🥇;trophy|chiếc cúp|🏆;flag|lá cờ|🚩'),
    T('verbs', '🏃', 'Động từ thường gặp', '#0ea5e9', 'run|chạy|🏃;walk|đi bộ|🚶;sleep|ngủ|😴;eat|ăn|🍽️;drink|uống|🥤;read|đọc|📖;write|viết|✍️;sing|hát|🎤;dance|nhảy múa|💃;swim|bơi|🏊;cry|khóc|😭;laugh|cười|😂;cook|nấu ăn|🍳;wash|rửa|🧼;draw|vẽ|🎨;listen|nghe|🎧;talk|nói chuyện|🗣️;think|suy nghĩ|🤔;look|nhìn|👀;climb|leo|🧗;drive|lái xe|🚗;fly|bay|✈️;ride|đạp xe|🚴;kick|đá bóng|⚽;buy|mua|🛒;give|tặng|🎁;love|yêu|❤️;sit|ngồi|🪑;stand|đứng|🧍;hug|ôm|🤗;kiss|hôn|😘;wait|đợi|⏳;wake up|thức dậy|⏰;open|mở|🚪;call|gọi điện|📞;play|chơi game|🎮;take photo|chụp ảnh|📷')
  ];
  var ALL = [], _seen = {};
  TOPICS.forEach(function (t) { t.w.forEach(function (w) { var k = w[0].toLowerCase(); if (!_seen[k]) { _seen[k] = 1; ALL.push(w); } }); });
  var MENU = TOPICS.concat([{ id: 'mix', n: 'Tổng hợp tất cả', i: '🎲', c: '#ec4899', w: ALL }]);

  /* ================= MỘT NGÀY CỦA BÉ: 15 MÀN x 20 TỪ ================= */
  var L = [
    ['🛏️', 'Phòng ngủ', '#6366f1', 'bed|giường|🛏️;pillow|gối|@pillow;blanket|chăn|@blanket;alarm clock|đồng hồ báo thức|⏰;window|cửa sổ|🪟;door|cửa ra vào|🚪;lamp|đèn|💡;teddy bear|gấu bông|🧸;mirror|gương|🪞;slippers|dép|🩴;picture|bức tranh|🖼️;moon|mặt trăng|🌙;sunrise|bình minh|🌅;rooster|gà trống|🐓;bird|con chim|🐦;flower|bông hoa|🌸;heart|trái tim|❤️;robot|người máy|🤖;crown|vương miện|👑;horse|con ngựa|🐴'],
    ['🪥', 'Đánh răng rửa mặt', '#0ea5e9', 'toothbrush|bàn chải đánh răng|🪥;toothpaste|kem đánh răng|@toothpaste;tooth|răng|🦷;soap|xà phòng|🧼;water|nước|💧;tap|vòi nước|🚰;bubbles|bọt xà phòng|🫧;towel|khăn mặt|@towel;comb|cái lược|@comb;toilet|bồn cầu|🚽;sponge|bọt biển|🧽;smile|nụ cười|😁;face|khuôn mặt|🙂;mouth|cái miệng|👄;nose|cái mũi|👃;eye|con mắt|👁️;ear|cái tai|👂;tongue|cái lưỡi|👅;hand|bàn tay|✋;bath|tắm|🛀'],
    ['🥣', 'Ăn sáng', '#f59e0b', 'bread|bánh mì|🍞;egg|quả trứng|🥚;milk|sữa|🥛;noodles|mì|🍜;sandwich|bánh sandwich|🥪;banana|quả chuối|🍌;cheese|phô mai|🧀;juice|nước ép|🧃;rice|cơm|🍚;bowl|cái bát|🥣;spoon|cái thìa|🥄;honey|mật ong|🍯;coffee|cà phê|☕;tea|trà|🍵;pancakes|bánh kếp|🥞;bacon|thịt xông khói|🥓;croissant|bánh sừng bò|🥐;apple|quả táo|🍎;orange|quả cam|🍊;fried egg|trứng ốp la|🍳'],
    ['👕', 'Quần áo', '#ec4899', 'shirt|áo sơ mi|👕;pants|quần dài|👖;dress|váy|👗;socks|đôi tất|🧦;shoes|giày|👟;cap|mũ lưỡi trai|🧢;coat|áo khoác|🧥;scarf|khăn quàng|🧣;gloves|găng tay|🧤;glasses|kính mắt|👓;watch|đồng hồ đeo tay|⌚;backpack|ba lô|🎒;hat|cái mũ|👒;tie|cà vạt|👔;boots|đôi ủng|🥾;sandals|dép xăng đan|👡;high heels|giày cao gót|👠;bikini|đồ bơi|👙;kimono|áo kimono|👘;handbag|túi xách|👜'],
    ['🚌', 'Trên đường đi học', '#14b8a6', 'bicycle|xe đạp|🚲;bus|xe buýt|🚌;car|ô tô|🚗;motorbike|xe máy|🏍️;traffic light|đèn giao thông|🚦;stop sign|biển dừng|🛑;road|con đường|🛣️;bridge|cây cầu|🌉;tree|cái cây|🌳;umbrella|cái ô|☂️;rain|cơn mưa|🌧️;shop|cửa hàng|🏪;train|tàu hỏa|🚆;plane|máy bay|✈️;taxi|xe taxi|🚕;truck|xe tải|🚚;ambulance|xe cứu thương|🚑;fire truck|xe cứu hỏa|🚒;police car|xe cảnh sát|🚓;scooter|xe tay ga|🛵'],
    ['🏫', 'Đến trường', '#ef4444', 'school|trường học|🏫;teacher|giáo viên|👩‍🏫;student|học sinh|🧑‍🎓;friends|bạn bè|👫;bell|chuông|🔔;flag|lá cờ|🚩;hello|xin chào|👋;morning|buổi sáng|🌅;football|bóng đá|⚽;basketball|bóng rổ|🏀;building|tòa nhà|🏢;clock|đồng hồ|🕗;library|thư viện|🏛️;lunch box|hộp cơm|🍱;graduation cap|mũ tốt nghiệp|🎓;calendar|quyển lịch|📅;microphone|micro|🎤;music|âm nhạc|🎵;gold medal|huy chương vàng|🥇;megaphone|cái loa tay|📢'],
    ['📖', 'Lớp học', '#8b5cf6', 'book|quyển sách|📖;notebook|quyển vở|📓;pencil|bút chì|✏️;pen|bút mực|🖊️;ruler|thước kẻ|📏;scissors|cái kéo|✂️;eraser|cục tẩy|@eraser;glue|hồ dán|@glue;computer|máy tính|💻;map|bản đồ|🗺️;globe|quả địa cầu|🌍;calculator|máy tính bấm|🧮;paper clip|kẹp giấy|📎;pushpin|cái ghim|📌;magnifying glass|kính lúp|🔍;folder|tập hồ sơ|📁;crayon|bút sáp màu|🖍️;telescope|kính thiên văn|🔭;bookmark|thẻ đánh dấu|🔖;blackboard|bảng đen|@blackboard'],
    ['🪁', 'Ra chơi', '#f97316', 'kite|con diều|🪁;yo-yo|yo-yo|🪀;puzzle|trò xếp hình|🧩;dice|xúc xắc|🎲;balloon|bóng bay|🎈;ice cream|kem|🍦;candy|kẹo|🍬;cookie|bánh quy|🍪;drink|đồ uống|🥤;run|chạy|🏃;chess|cờ vua|♟️;video game|trò chơi điện tử|🎮;carousel|đu quay|🎠;ferris wheel|vòng quay|🎡;roller coaster|tàu lượn|🎢;popcorn|bắp rang|🍿;lollipop|kẹo mút|🍭;bowling|ném bowling|🎳;playing cards|bài tây|🃏;darts|phi tiêu|🎯'],
    ['🏠', 'Về nhà', '#16a34a', 'house|ngôi nhà|🏠;key|chìa khóa|🔑;mother|mẹ|👩;father|bố|👨;grandmother|bà|👵;grandfather|ông|👴;baby|em bé|👶;brother|anh/em trai|👦;sister|chị/em gái|👧;dog|con chó|🐶;cat|con mèo|🐱;sofa|ghế sofa|🛋️;family|gia đình|👪;television|ti vi|📺;telephone|điện thoại bàn|☎️;mailbox|hòm thư|📫;garden|khu vườn|🏡;lock|ổ khóa|🔒;uncle|chú / bác|🧔;child|đứa trẻ|🧒'],
    ['🏊', 'Tập thể dục', '#0284c7', 'swimming|bơi lội|🏊;cycling|đạp xe|🚴;volleyball|bóng chuyền|🏐;badminton|cầu lông|🏸;tennis|quần vợt|🎾;table tennis|bóng bàn|🏓;yoga|yoga|🧘;dance|nhảy múa|💃;weightlifting|cử tạ|🏋️;muscle|cơ bắp|💪;medal|huy chương|🏅;trophy|chiếc cúp|🏆;boxing|đấm bốc|🥊;golf|đánh gôn|⛳;skiing|trượt tuyết|⛷️;surfing|lướt sóng|🏄;rowing|chèo thuyền|🚣;baseball|bóng chày|⚾;rugby|bóng bầu dục|🏉;ice skating|trượt băng|⛸️'],
    ['🚿', 'Tắm giặt', '#06b6d4', 'shower|vòi hoa sen|🚿;bathtub|bồn tắm|🛁;shampoo|dầu gội|🧴;laundry basket|giỏ đồ giặt|🧺;bucket|cái xô|🪣;broom|cái chổi|🧹;hot|nóng|🥵;cold|lạnh|🥶;clean|sạch sẽ|✨;rubber duck|vịt cao su|🦆;hair|mái tóc|💇;sun|mặt trời|☀️;wet|ướt|💦;sweat|mồ hôi|😓;germs|vi khuẩn|🦠;clothes|quần áo|👚;hot spring|suối nước nóng|♨️;thread|sợi chỉ|🧵;wind|gió|💨;dry|khô|🏜️'],
    ['🍲', 'Ăn tối', '#dc2626', 'fish|cá|🐟;chicken|thịt gà|🍗;meat|thịt|🥩;soup|món súp|🍲;vegetables|rau|🥬;tomato|cà chua|🍅;carrot|cà rốt|🥕;potato|khoai tây|🥔;corn|bắp ngô|🌽;watermelon|dưa hấu|🍉;plate|cái đĩa|🍽️;chopsticks|đôi đũa|🥢;pizza|bánh pizza|🍕;hamburger|bánh hamburger|🍔;french fries|khoai tây chiên|🍟;salad|món salad|🥗;shrimp|con tôm|🦐;fork|cái nĩa|🍴;knife|con dao|🔪;pasta|mì Ý|🍝'],
    ['📝', 'Học bài', '#7c3aed', 'chair|cái ghế|🪑;homework|bài tập về nhà|📝;write|viết|✍️;test|bài kiểm tra|💯;brain|bộ não|🧠;question|câu hỏi|❓;answer|câu trả lời|✅;number|con số|🔢;letters|chữ cái|🔤;headphones|tai nghe|🎧;science|khoa học|🔬;star|ngôi sao|⭐;idea|ý tưởng|💡;correct|đúng|✔️;wrong|sai|❌;plus|dấu cộng|➕;minus|dấu trừ|➖;quiet|yên lặng|🤫;study|học|🤓;graph|biểu đồ|📊'],
    ['🤧', 'Vệ sinh buổi tối', '#0d9488', 'pajamas|đồ ngủ|@pajamas;trash can|thùng rác|🗑️;mosquito|con muỗi|🦟;medicine|thuốc|💊;thermometer|nhiệt kế|🌡️;bandage|băng dán|🩹;sneeze|hắt hơi|🤧;mask|khẩu trang|😷;night|ban đêm|🌃;tissue|khăn giấy|@tissue;nine o\'clock|chín giờ|🕘;yawn|ngáp|🥱;stethoscope|ống nghe|🩺;syringe|ống tiêm|💉;fever|sốt|🤒;hospital|bệnh viện|🏥;doctor|bác sĩ|👨‍⚕️;nurse|y tá|👩‍⚕️;lights off|tắt đèn|🌑;wash hands|rửa tay|🙌'],
    ['😴', 'Đi ngủ', '#4338ca', 'sleep|ngủ|😴;dream|giấc mơ|💭;snore|ngáy|💤;storybook|truyện cổ tích|📚;kiss|hôn|😘;hug|ôm|🤗;owl|con cú|🦉;bat|con dơi|🦇;candle|ngọn nến|🕯️;full moon|trăng tròn|🌕;shooting star|sao băng|🌠;cricket|con dế|🦗;lullaby|bài hát ru|🎶;bedtime|giờ đi ngủ|🛌;night sky|bầu trời đêm|🌌;angel|thiên thần|👼;fairy|nàng tiên|🧚;ghost|con ma|👻;nightmare|ác mộng|😨;lantern|đèn lồng|🏮']
  ].map(function (r) { return { i: r[0], n: r[1], c: r[2], w: parseW(r[3]) }; });
  var CH = [['Buổi sáng ở nhà', 0, 4], ['Đi học', 4, 8], ['Buổi chiều', 8, 11], ['Buổi tối', 11, 15]];
  var DAYWORDS = L.reduce(function (a, l) { return a + l.w.length; }, 0);

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
  document.head.appendChild(st);

  /* ================= DOM ================= */
  var root = document.createElement('div');
  root.className = 'eg-root';
  root.innerHTML = '' +
  '<div class="eg-scr on" id="egMenu"><div class="eg-top"><button class="eg-btn" data-a="close" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">🎮 Hãy chọn hình thức học bạn thích</div><button class="eg-btn" data-a="close">✕ Đóng</button></div>' +
    '<div class="eg-choice">' +
    '<button class="eg-big" data-a="topics" style="background:linear-gradient(145deg,#3b82f6,#1d4ed8)"><span class="ic">📚</span><span class="nm">Từ vựng tiếng Anh theo chủ đề</span><span class="sub">Chọn chủ đề yêu thích và hứng từ trong 2 phút</span></button>' +
    '<button class="eg-big" data-a="day" style="background:linear-gradient(145deg,#f59e0b,#ea580c)"><span class="ic">🌞</span><span class="nm">Một ngày của bé</span><span class="sub">Phá đảo 15 màn từ lúc thức dậy đến khi đi ngủ, hơn ' + DAYWORDS + ' từ vựng</span></button>' +
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
  '<div class="eg-scr" id="egEnd"><div class="eg-top"><button class="eg-btn" data-a="endback" style="padding:8px 14px;font-size:20px">←</button><div class="eg-title fl">Kết quả</div></div><div class="eg-res" id="egRes" style="padding-top:4px"></div></div>';
  document.body.appendChild(root);

  var $ = function (id) { return document.getElementById(id); };
  var scr = { menu: $('egMenu'), topics: $('egTopics'), map: $('egMap'), intro: $('egIntro'), play: $('egPlay'), end: $('egEnd') };
  function show(k) { for (var n in scr) scr[n].classList.toggle('on', n === k); }
  var cv = $('egCv'), ctx = cv.getContext('2d'), stage = $('egStage');
  var meanEl = $('egMean'), spdEl = $('egSpd'), spdV = $('egSpdV');
  function spdLabel() { spdV.textContent = 'x' + SPEED.toFixed(1).replace('.', ','); }
  spdEl.value = SPEED; spdLabel();
  spdEl.addEventListener('input', function () { SPEED = parseFloat(spdEl.value) || 1; try { localStorage.setItem('wg_speed', SPEED); } catch (e) {} spdLabel(); });

  /* ================= MÀN CHỌN CHỦ ĐỀ ================= */
  function renderTopics() {
    var grid = $('egGrid'); grid.innerHTML = '';
    MENU.forEach(function (t) {
      var w = document.createElement('div'); w.className = 'eg-tw';
      var n = plays(t.id), bs = best(t.id);
      var pc = document.createElement('div'); pc.className = 'eg-pc';
      if (n > 0) pc.innerHTML = '<span>🔁 Đã chơi ' + n + ' lần</span>';
      var b = document.createElement('button'); b.className = 'eg-topic';
      b.style.background = 'linear-gradient(145deg,' + t.c + ',' + t.c + 'bb)';
      b.innerHTML = '<span class="ic">' + t.i + '</span><span class="nm">' + t.n + '</span><span class="sub">' + t.w.length + ' từ' + (bs ? ' · Kỷ lục ' + money(bs) : '') + '</span>';
      b.onclick = function () { openTopicIntro(t); };
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
        h += '<button class="eg-node' + (lock ? ' lock' : '') + '" ' + (lock ? '' : 'data-a="lvl" data-i="' + i + '"') + ' style="background:linear-gradient(145deg,' + L[i].c + ',' + L[i].c + 'bb)"><span class="ic">' + (lock ? '🔒' : L[i].i) + '</span><span class="nm">' + (i + 1) + '. ' + L[i].n + '</span><span class="st">' + stars(P.s[i]) + '</span>' + (rv && !lock ? '<span class="rv">📌 ' + rv + ' từ cần ôn</span>' : '') + '</button>';
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
          G.money += REWARD; G.ok++; G.got[it.w[0]] = it.w;
          fl(G.bx, by - 10, money(REWARD, 1), '#4ade80');
          G.flash = 0.25; G.flashC = 'rgba(34,197,94,.30)';
          speak(it.w[0]); G.items = []; G.wait = 0.55; break;
        } else {
          G.money -= PENALTY; G.bad++;
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
  function finish() {
    cancelAnimationFrame(raf); stopSpeak();
    var g = G;
    if (g.mode === 'topic') {
      var id = g.topic.id, prev = best(id), isNew = g.money > prev && g.money > 0;
      if (isNew) setBest(id, g.money);
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
      P.m = Math.max(0, P.m + gain); if (sr > P.s[g.li]) P.s[g.li] = sr;
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

  /* ================= SỰ KIỆN ================= */
  root.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null; if (!el) return;
    var a = el.getAttribute('data-a'), i = parseInt(el.getAttribute('data-i'), 10);
    if (a === 'close') api.close();
    else if (a === 'menu') { stopSpeak(); show('menu'); }
    else if (a === 'topics') toTopics();
    else if (a === 'day') { renderMap(); show('map'); }
    else if (a === 'lv1' || a === 'lv2') { P.lv = a === 'lv1' ? 1 : 2; save(); renderMap(); }
    else if (a === 'lvl') openIntro(i);
    else if (a === 'say') { stopSpeak(); speak(introW[i][0]); }
    else if (a === 'go') { if (introT) startTopic(introT); else startDay(cur); }
    else if (a === 'retry') startDay(cur);
    else if (a === 'introback') { stopSpeak(); if (introT) toTopics(); else toMap(); }
    else if (a === 'quit') { if (G && G.mode === 'topic') toTopics(); else toMap(); }
    else if (a === 'map') toMap();
    else if (a === 'again') startTopic(G ? G.topic : TOPICS[0]);
    else if (a === 'next') openIntro(cur + 1);
    else if (a === 'win') winScreen();
    else if (a === 'endback') { if (G && G.mode === 'topic') toTopics(); else toMap(); }
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
