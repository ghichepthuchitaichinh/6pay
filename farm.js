/* 6PAY - Game Nông trại vui vẻ (bản 2026.10.31-4: đổi tỷ lệ là số dư 6 ví tự tính lại như app, tỷ lệ 6 ví dùng chung với app, mỗi chuồng nuôi 5–12 con, thanh 6 ví, cây lâu năm, 3 loại phân, chuồng tự chọn, mua hàng ở chợ, bỏ chuyển tiền giữa các ví, thú hoang & nhiệm vụ bảo vệ, tự động tưới, tiền chia 6 ví, thiên tai 5 giờ/lần, công trình có thu nhập thụ động, nhiệm vụ 6 ví, bản đồ kéo/zoom, cánh đồng và chuồng mới). File này được index.html tải về khi người dùng mở trò chơi.
   Trồng cây, nuôi gà – bò – cừu – cá – ong, xây công trình, chế biến nông sản, giao đơn hàng và ghi sổ thu chi.
   Nông trại được NỐI với các game học: tiền thưởng kiếm được trong Lịch sử Việt Nam, Khám phá Việt Nam, từ vựng tiếng Anh,
   tiếng Trung, Toán học cấp 1, Đố vui tài chính, Dạy trẻ xem đồng hồ được cộng hết vào ví nông trại (qua hộp thư farm6_inbox).
   Mục "Nhiệm vụ" yêu cầu chơi các game học để mở thêm đất, chuồng trại và công trình.
   Bản đồ Ruộng/Chuồng kéo được bằng 1 ngón, phóng to/thu nhỏ bằng 2 ngón; các cánh đồng mới và chuồng vịt, dê, heo nằm bên ngoài, mở bằng nhiệm vụ.
   Cây và vật nuôi vẫn lớn khi đóng app (tính theo đồng hồ của máy). Tiến độ lưu trên máy (localStorage). */
(function () {
  if (window.FarmGame) return;

  var KEY = 'farm6_v1', INBOX = 'farm6_inbox';
  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var TF = '"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

  /* ================= DỮ LIỆU =================
     Cây trồng: id, tên, emoji, cấp mở, giá hạt giống (đ), thời gian lớn (giây), giá bán (đ), kinh nghiệm, màu lá.
     Lãi trồng trọt được giữ ở mức vừa phải: muốn mở đất, mua vật nuôi, xây công trình thì nên vào mục 🎮 Phụ bản (chơi game học). */
  var CROPS = [
    { id: 'lua', n: 'Lúa', e: '🌾', lv: 1, cost: 5000, t: 45, sell: 6500, xp: 1, leaf: '#8bc34a' },
    { id: 'carot', n: 'Cà rốt', e: '🥕', lv: 1, cost: 8000, t: 90, sell: 10500, xp: 2, leaf: '#4caf50' },
    { id: 'ngo', n: 'Ngô', e: '🌽', lv: 2, cost: 12000, t: 150, sell: 16000, xp: 3, leaf: '#66bb6a' },
    { id: 'cachua', n: 'Cà chua', e: '🍅', lv: 3, cost: 18000, t: 240, sell: 24000, xp: 4, leaf: '#43a047' },
    { id: 'bapcai', n: 'Bắp cải', e: '🥬', lv: 4, cost: 22000, t: 300, sell: 29000, xp: 5, leaf: '#7cb342' },
    { id: 'ot', n: 'Ớt', e: '🌶️', lv: 5, cost: 26000, t: 420, sell: 35000, xp: 6, leaf: '#2e7d32' },
    { id: 'dau', n: 'Dâu tây', e: '🍓', lv: 6, cost: 32000, t: 540, sell: 43000, xp: 7, leaf: '#388e3c' },
    { id: 'huongduong', n: 'Hướng dương', e: '🌻', lv: 7, cost: 40000, t: 720, sell: 54000, xp: 9, leaf: '#558b2f' },
    { id: 'dua', n: 'Dưa hấu', e: '🍉', lv: 8, cost: 55000, t: 1080, sell: 75000, xp: 12, leaf: '#33691e' },
    { id: 'khoai', n: 'Khoai lang', e: '🍠', lv: 9, cost: 60000, t: 1200, sell: 82000, xp: 13, leaf: '#6d9b3a' },
    { id: 'bi', n: 'Bí ngô', e: '🎃', lv: 10, cost: 80000, t: 1800, sell: 110000, xp: 18, leaf: '#689f38' },
    { id: 'nho', n: 'Nho', e: '🍇', lv: 12, cost: 100000, t: 2400, sell: 140000, xp: 24, leaf: '#4e7d2a' },
    /* Cây ăn quả LÂU NĂM (per): trồng 1 lần, lần đầu lớn chậm (t), sau đó cứ re giây lại ra quả, không phải gieo lại */
    { id: 'chuoi', n: 'Chuối', e: '🍌', lv: 3, cost: 60000, t: 1800, re: 900, sell: 30000, xp: 4, leaf: '#65a30d', per: 1 },
    { id: 'chanh', n: 'Chanh', e: '🍋', lv: 5, cost: 90000, t: 2700, re: 1200, sell: 40000, xp: 5, leaf: '#4d7c0f', per: 1 },
    { id: 'cam', n: 'Cam', e: '🍊', lv: 7, cost: 130000, t: 3600, re: 1500, sell: 52000, xp: 6, leaf: '#3f7d20', per: 1 },
    { id: 'tao', n: 'Táo', e: '🍎', lv: 9, cost: 180000, t: 5400, re: 2100, sell: 68000, xp: 8, leaf: '#2f6b1f', per: 1 },
    { id: 'daoq', n: 'Đào', e: '🍑', lv: 11, cost: 240000, t: 7200, re: 2700, sell: 86000, xp: 10, leaf: '#3a7a2a', per: 1 },
    { id: 'xoai', n: 'Xoài', e: '🥭', lv: 13, cost: 320000, t: 10800, re: 3600, sell: 110000, xp: 13, leaf: '#2d6a1f', per: 1 },
    { id: 'dua2', n: 'Dừa', e: '🥥', lv: 15, cost: 420000, t: 14400, re: 5400, sell: 150000, xp: 17, leaf: '#4a7c2a', per: 1 }
  ];
  /* Phân bón: giá càng cao, rút ngắn thời gian càng nhiều (cut = phần thời gian còn lại bị cắt bỏ) */
  var FERTS = [
    { id: 'f1', n: 'Phân hữu cơ', e: '🧪', p: 20000, cut: 0.5, d: 'Rút ngắn 50% thời gian còn lại' },
    { id: 'f2', n: 'Phân NPK', e: '🧴', p: 60000, cut: 0.75, d: 'Rút ngắn 75% thời gian còn lại' },
    { id: 'f3', n: 'Phân kích thích siêu tốc', e: '⚗️', p: 150000, cut: 1, d: 'Cây chín ngay lập tức!' }
  ];
  var FZM = {}; FERTS.forEach(function (f) { FZM[f.id] = f; });
  /* Vật nuôi: ăn 1 nông sản (feed) rồi sau t giây cho 1 sản phẩm (p). cap = số con mỗi chuồng/ao (ít nhất 5), q = nhiệm vụ cần làm để mở chuồng */
  var ANIMALS = [
    { id: 'ga', n: 'Gà', e: '🐔', pen: 'Chuồng gà', lv: 2, cost: 60000, feed: 'lua', p: 'trung', t: 180, cap: 8, grass: '#9ccc65' },
    { id: 'bo', n: 'Bò', e: '🐄', pen: 'Chuồng bò', lv: 3, q: 'q3', cost: 200000, feed: 'ngo', p: 'sua', t: 360, cap: 5, grass: '#8bc34a' },
    { id: 'cuu', n: 'Cừu', e: '🐑', pen: 'Chuồng cừu', lv: 6, q: 'q9', cost: 320000, feed: 'carot', p: 'len', t: 480, cap: 6, grass: '#aed581' },
    { id: 'ca', n: 'Cá', e: '🐠', pen: 'Ao cá', lv: 5, q: 'q7', cost: 150000, feed: 'lua', p: 'catuoi', t: 300, cap: 10, grass: '#4fc3f7', water: 1 },
    { id: 'ong', n: 'Ong', e: '🐝', pen: 'Trại ong', lv: 8, q: 'q13', cost: 450000, feed: 'huongduong', p: 'mat', t: 900, cap: 6, grass: '#c5e1a5' },
    { id: 'vit', n: 'Vịt', e: '🦆', pen: 'Chuồng vịt', lv: 9, q: 'q24', cost: 380000, feed: 'ngo', p: 'longvit', t: 420, cap: 8, grass: '#80deea', water: 1 },
    { id: 'de', n: 'Dê', e: '🐐', pen: 'Chuồng dê', lv: 11, q: 'q26', cost: 520000, feed: 'bapcai', p: 'suade', t: 600, cap: 5, grass: '#c5e1a5' },
    { id: 'heo', n: 'Heo', e: '🐖', pen: 'Chuồng heo', lv: 13, q: 'q29', cost: 700000, feed: 'khoai', p: 'nam', t: 1200, cap: 5, grass: '#d7ccc8' }
  ];
  var PRODUCTS = {
    trung: { id: 'trung', n: 'Trứng gà', e: '🥚', sell: 12000, xp: 2 },
    sua: { id: 'sua', n: 'Sữa bò', e: '🥛', sell: 30000, xp: 4 },
    len: { id: 'len', n: 'Len cừu', e: '🧶', sell: 28000, xp: 5 },
    catuoi: { id: 'catuoi', n: 'Cá tươi', e: '🐟', sell: 15000, xp: 3 },
    mat: { id: 'mat', n: 'Mật ong', e: '🍯', sell: 80000, xp: 9 },
    banhmi: { id: 'banhmi', n: 'Bánh mì', e: '🥖', sell: 26000, xp: 4 },
    phomai: { id: 'phomai', n: 'Phô mai', e: '🧀', sell: 78000, xp: 8 },
    aolen: { id: 'aolen', n: 'Áo len', e: '🧥', sell: 72000, xp: 9 },
    mutdau: { id: 'mutdau', n: 'Mứt dâu', e: '🫙', sell: 165000, xp: 14 },
    longvit: { id: 'longvit', n: 'Lông vịt', e: '🪶', sell: 22000, xp: 4 },
    suade: { id: 'suade', n: 'Sữa dê', e: '🍼', sell: 45000, xp: 6 },
    nam: { id: 'nam', n: 'Nấm quý', e: '🍄', sell: 140000, xp: 14 },
    goi: { id: 'goi', n: 'Gối lông vịt', e: '🛏️', sell: 120000, xp: 12 }
  };
  /* Công trình: q = nhiệm vụ mở khoá, req = phải xây công trình khác trước, r = công thức chế biến (xưởng) */
  var BUILDS = [
    { id: 'them', n: 'Thềm nhà', e: '🪵', lv: 1, q: 'q1', cost: 150000, d: 'Lát thềm gỗ trước nhà. Mở <b>🎁 Quà mỗi ngày</b> ở mục Nhiệm vụ.' },
    { id: 'gieng', n: 'Giếng nước', e: '🪣', lv: 3, q: 'q4', cost: 250000, d: 'Thêm nút <b>Tưới hết</b> (1 chạm tưới cả ruộng). Cây đã tưới lớn nhanh gấp 1,7 lần.' },
    { id: 'lobanh', n: 'Lò bánh mì', e: '🔥', lv: 4, q: 'q5', cost: 400000, r: { i: [['lua', 3]], o: 'banhmi', t: 240 }, d: 'Nướng 3 🌾 lúa thành 1 🥖 bánh mì, bán được giá hơn.' },
    { id: 'bosua', n: 'Xưởng bơ sữa', e: '🏭', lv: 6, q: 'q10', cost: 700000, r: { i: [['sua', 2]], o: 'phomai', t: 420 }, d: 'Làm 2 🥛 sữa thành 1 🧀 phô mai.' },
    { id: 'xetai', n: 'Xe tải giao hàng', e: '🛻', lv: 7, q: 'q11', cost: 900000, d: 'Có thêm 1 đơn hàng cùng lúc và tiền thưởng đơn hàng tăng 20%.' },
    { id: 'maydet', n: 'Máy dệt', e: '🧵', lv: 8, q: 'q14', cost: 1200000, r: { i: [['len', 2]], o: 'aolen', t: 600 }, d: 'Dệt 2 🧶 len thành 1 🧥 áo len.' },
    { id: 'coixay', n: 'Cối xay gió', e: '🌀', lv: 9, q: 'q15', cost: 1500000, d: 'Gió mát giúp mọi cây trồng lớn nhanh hơn 15%.' },
    { id: 'nha2', n: 'Nhà gạch', e: '🏡', lv: 10, q: 'q17', req: 'them', cost: 2000000, d: 'Xây lại nhà bằng gạch đỏ. Quà mỗi ngày nhiều gấp đôi.' },
    { id: 'mut', n: 'Xưởng làm mứt', e: '🍓', lv: 11, q: 'q18', cost: 1800000, r: { i: [['dau', 3]], o: 'mutdau', t: 720 }, d: 'Sên 3 🍓 dâu tây thành 1 🫙 hũ mứt dâu.' },
    { id: 'chan', n: 'Xưởng chăn gối', e: '🪡', lv: 12, q: 'q28', cost: 2500000, r: { i: [['longvit', 3]], o: 'goi', t: 900 }, d: 'May 3 🪶 lông vịt thành 1 🛏️ gối lông vịt.' },
    { id: 'nha3', n: 'Biệt thự', e: '🏰', lv: 14, q: 'q21', req: 'nha2', cost: 5000000, d: 'Ngôi nhà mơ ước! Quà mỗi ngày gấp 3 và bán hàng ở chợ được giá hơn 10%.' }
  ];
  /* Hàng ruộng: cấp cần, nhiệm vụ cần, giá */
  var LAND = { 4: { lv: 2, q: 'q2', c: 250000 }, 5: { lv: 4, q: 'q6', c: 600000 }, 6: { lv: 7, q: 'q12', c: 1500000 }, 7: { lv: 10, q: 'q16', c: 3000000 } };
  var COLS = 5, MAXROWS = 7, MAIN = COLS * MAXROWS;
  /* BẢN ĐỒ RUỘNG (đơn vị thế giới, kéo/zoom được). Ruộng chính ở giữa, các cánh đồng mở rộng ở bên ngoài hàng rào. */
  var CW = 64, HD = 150, MX = 356, MY = 180, FW = 1032, FH = 1200;
  var FIELDS = [
    { id: 'dong', n: 'Vườn phía Đông', x: 746, y: 230, c: 4, r: 4, lv: 6, q: 'q22', cost: 1200000 },
    { id: 'tay', n: 'Vườn phía Tây', x: 30, y: 230, c: 4, r: 4, lv: 8, q: 'q23', cost: 2000000 },
    { id: 'nam', n: 'Cánh đồng phía Nam', x: 292, y: 700, c: 7, r: 3, lv: 11, q: 'q27', cost: 3500000 },
    { id: 'xa', n: 'Cánh đồng lớn', x: 228, y: 960, c: 9, r: 3, lv: 15, q: 'q31', cost: 6000000 }
  ];
  var TOTAL = MAIN;
  FIELDS.forEach(function (f) { f.i0 = TOTAL; TOTAL += f.c * f.r; f.w = f.c * CW; f.h = f.r * CW; });
  var FLM = {}; FIELDS.forEach(function (f) { FLM[f.id] = f; });
  var FERT_PRICE = 20000;

  /* Các game học nối với nông trại (không gồm Cờ vua và Bước nhảy tài chính) */
  var GAMES = [
    { k: 'vnh', n: 'Lịch sử Việt Nam', e: '🇻🇳', u: 'câu', d: 'Mỗi câu trả lời đúng +10.000đ' },
    { k: 'vnv', n: 'Khám phá Việt Nam', e: '🧭', u: 'câu', d: 'Mỗi câu trả lời đúng +10.000đ' },
    { k: 'en', n: 'Từ vựng tiếng Anh', e: '🔤', u: 'từ', d: 'Hứng đúng mỗi từ +10.000đ' },
    { k: 'zh', n: 'Từ vựng tiếng Trung', e: '🀄', u: 'từ', d: 'Hứng đúng mỗi từ +10.000đ' },
    { k: 'math', n: 'Toán học cấp 1', e: '🧮', u: 'câu', d: 'Thử thách theo lớp và bảng cửu chương' },
    { k: 'quiz', n: 'Đố vui tài chính', e: '🎯', u: 'câu', d: 'Trả lời đúng và nhanh để được nhiều tiền' },
    { k: 'clock', n: 'Dạy trẻ xem đồng hồ', e: '🕒', u: 'giờ', d: 'Bấm “Đố bé xem giờ”: mỗi câu đúng +10.000đ' }
  ];
  /* ================= NHIỆM VỤ THEO 6 VÍ =================
     Mỗi ví (giống 6 hũ trong app 6PAY) có một danh sách nhiệm vụ. Bấm "Thực hiện" là CHI tiền từ ví nông trại,
     làm xong việc được giao thì NHẬN tiền + kinh nghiệm. Kinh nghiệm giúp lên cấp → mở thêm đất, chuồng, công trình.
     Loại việc (k):
       learn: học đúng c câu/từ trong game học g (t = chủ đề tiếng Anh/Trung)
       farm : làm việc trên nông trại, ev = loại việc, x = món cụ thể (không có = món nào cũng được), c = số lần
       wait : chờ s giây (gửi tiết kiệm, đầu tư, đi chơi…), tiền vẫn chạy khi đóng app
       give : giao các món trong kho (it) */
  var WALLETS = [
    { k: 'essential', n: 'Thiết yếu', e: '🏠', c: '#0ea5e9', q: '“Đừng đánh đổi những điều thiết yếu hôm nay để chạy theo những điều xa xỉ ngày mai”',
      d: 'Những khoản <b>phải chi</b> để gia đình và nông trại hoạt động: ăn uống, điện nước, nông cụ, thức ăn cho vật nuôi. Chi đúng chỗ thì nông trại mới làm ra tiền.' },
    { k: 'education', n: 'Phát triển bản thân', e: '📚', c: '#8b5cf6', q: '“Học không phải để giỏi hơn người khác, mà để trở thành phiên bản tốt hơn của chính mình”',
      d: 'Đóng học phí cho các <b>khoá học</b> rồi vào học thật. Kiến thức là khoản đầu tư sinh lời nhiều nhất: học xong nhận lại nhiều hơn số tiền đã bỏ ra.' },
    { k: 'saving', n: 'Tiết kiệm', e: '🐷', c: '#ec4899', q: '“Đừng tiết kiệm những gì còn lại sau khi chi tiêu, hãy chi tiêu những gì còn lại sau khi tiết kiệm”',
      d: 'Gửi tiền có <b>kỳ hạn</b>: gửi càng lâu, lãi càng nhiều. Rút trước hạn thì chỉ lấy lại tiền gốc, không có lãi. Kiên nhẫn chính là bí quyết!' },
    { k: 'invest', n: 'Đầu tư', e: '📈', c: '#16a34a', q: '“Rủi ro đến từ việc bạn không biết mình đang dùng tiền làm gì”',
      d: 'Bỏ vốn để tiền <b>sinh ra tiền</b>. Có khoản chắc chắn lãi ít, có khoản lãi nhiều nhưng cũng có thể lỗ. Chỉ đầu tư số tiền bạn chấp nhận mất, và nên chia nhỏ ra nhiều nơi.' },
    { k: 'share', n: 'Chia sẻ', e: '🤝', c: '#f59e0b', q: '“Của cải làm nên sự giàu có, lòng nhân ái làm nên sự vĩ đại”',
      d: 'Giúp đỡ người khác bằng tiền, nông sản hoặc công sức. Chia sẻ <b>không được hoàn tiền</b>: bạn cho đi thật sự. Đổi lại bạn nhận được rất nhiều kinh nghiệm và niềm vui khi giúp người khác.' },
    { k: 'enjoy', n: 'Hưởng thụ', e: '🎉', c: '#ef4444', q: '“Đừng chờ đến khi giàu có mới hạnh phúc, hãy học cách hạnh phúc trên hành trình làm giàu”',
      d: 'Vui chơi để nạp năng lượng! Tiền hưởng thụ đã tiêu là <b>không lấy lại được</b>, chỉ nhận về kinh nghiệm và niềm vui. Hãy hưởng thụ <b>vừa đủ</b> với số tiền trong ví này.' }
  ];
  var WM = {}; WALLETS.forEach(function (w) { WM[w.k] = w; });
  /* Chủ đề tiếng Anh/Trung dùng cho khoá học (mã giống trong game từ vựng) */
  var TOPIC = { fruits: '🍎 Trái cây', colors: '🎨 Màu sắc', family: '👪 Gia đình', pets: '🐶 Vật nuôi & nông trại', numbers: '🔢 Số đếm', food: '🍕 Món ăn', school: '📚 Trường học', body: '🧍 Cơ thể',
    clothes: '👕 Quần áo', vegetables: '🥕 Rau củ', jobs: '👨‍⚕️ Nghề nghiệp', weather: '⛅ Thời tiết & mùa', transport: '🚗 Giao thông', sports: '⚽ Thể thao', money: '💰 Tiền bạc & mua sắm', emotions: '😊 Cảm xúc',
    places: '🏫 Địa điểm', travel: '🧳 Du lịch', countries: '🌏 Quốc gia', tech: '💻 Công nghệ', space: '🪐 Vũ trụ', nature: '🌈 Thiên nhiên', music: '🎸 Âm nhạc', time: '⏰ Thời gian', days: '📅 Thứ & tháng', toys: '🧸 Đồ chơi', kitchen: '🍴 Nhà bếp' };
  var EVN = { plant: ['Gieo', 'hạt giống'], water: ['Tưới', 'ô ruộng'], harvest: ['Thu hoạch', 'cây'], feed: ['Cho vật nuôi ăn', 'lần'], collect: ['Thu', 'sản phẩm từ vật nuôi'], make: ['Chế biến', 'món ở xưởng'], order: ['Giao', 'đơn hàng'], sell: ['Bán', 'món ở chợ'], fert: ['Bón phân', 'lần'] };

  function base(lv) { return 10000 + 10000 * lv; }   // mức chi chuẩn theo cấp
  function r1k(n) { return Math.max(0, Math.round(n / 1000) * 1000); }
  var MISSIONS = [], MSM = {};
  /* w = ví, lv = cấp, e = biểu tượng, n = tên, d = bài học, k/p = loại việc, o = tuỳ chỉnh (cost = hệ số chi, pay = hệ số nhận, xp = hệ số KN, req = điều kiện) */
  function M(w, lv, e, n, d, k, p, o) {
    o = o || {};
    /* [hệ số chi, hệ số nhận, hệ số KN]. Thiết yếu, Phát triển bản thân, Tiết kiệm: luôn lãi. Đầu tư: lãi hoặc lỗ. Chia sẻ, Hưởng thụ: chỉ nhận kinh nghiệm. */
    var dw = { essential: [1, 1.4, 1], education: [0.8, 1.5, 1], saving: [1, 1, 1], invest: [1, 1, 1], share: [0.6, 0, 1.7], enjoy: [0.8, 0, 1.4] }[w];
    var m = { id: w.charAt(0) + w.charAt(1) + (MISSIONS.length + 1), w: w, lv: lv, e: e, n: n, d: d, k: k, req: o.req };
    for (var key in p) m[key] = p[key];
    var cost = o.c0 ? 0 : r1k(base(lv) * dw[0] * (o.cost || 1));
    if (o.pct) { m.pct = o.pct; cost = 0; }
    m.cost = cost;
    if (w === 'saving') m.rate = o.rate;
    else if (w === 'invest') m.rng = o.rng || [0.85, 1.9];
    else m.pay = dw[1] ? Math.max(cost + 1000, r1k((cost || base(lv) * 0.6) * dw[1] * (o.pay || 1))) : 0;
    m.xp = Math.max(3, Math.round(need(lv) * 0.22 * dw[2] * (o.xp || 1)));
    if (o.fert && dw[1]) m.fert = o.fert;
    MISSIONS.push(m); MSM[m.id] = m;
  }
  function F(ev, c, x) { return { ev: ev, c: c, x: x }; }
  function G(it) { return { it: it }; }
  function T(s) { return { s: s }; }
  function LN(g, c, t) { return { g: g, c: c, t: t }; }

  /* ---------- 🏠 THIẾT YẾU ---------- */
  var w = 'essential';
  M(w, 1, '🧑‍🌾', 'Mua cuốc xẻng cho vụ mùa', 'Nông cụ là thứ phải có để làm ra tiền. Mua xong, hãy gieo 5 hạt giống.', 'farm', F('plant', 5));
  M(w, 1, '🚿', 'Trả tiền nước tưới ruộng', 'Cây không có nước sẽ héo. Trả tiền nước rồi tưới 6 ô ruộng.', 'farm', F('water', 6));
  M(w, 1, '🧺', 'Mua giỏ tre đựng nông sản', 'Có giỏ mới để đựng nông sản: hãy thu hoạch 8 cây.', 'farm', F('harvest', 8));
  M(w, 2, '🍚', 'Đi chợ nấu bữa cơm gia đình', 'Ăn uống là khoản chi thiết yếu nhất. Mua mắm muối ở chợ và góp 3 🌾 lúa, 2 🥕 cà rốt từ kho.', 'give', G([['lua', 3], ['carot', 2]]), { cost: 0.8 });
  M(w, 2, '🐔', 'Mua cám cho gà', 'Vật nuôi cần ăn đều đặn mới khoẻ. Mua cám rồi cho vật nuôi ăn 4 lần.', 'farm', F('feed', 4), { req: 'a:ga' });
  M(w, 3, '📦', 'Mua bao bì đóng gói', 'Đóng gói sạch đẹp giúp bán hàng tốt hơn. Bán 10 món ở chợ.', 'farm', F('sell', 10));
  M(w, 3, '🏚️', 'Sửa mái nhà bị dột', 'Nhà cửa an toàn là nhu cầu thiết yếu. Chờ thợ sửa xong.', 'wait', T(180));
  M(w, 3, '💉', 'Mua thuốc phòng bệnh cho gà', 'Gà khoẻ mới đẻ nhiều trứng. Thu 4 🥚 trứng gà.', 'farm', F('collect', 4, 'trung'), { req: 'a:ga' });
  M(w, 4, '⛽', 'Đổ xăng cho xe chở hàng', 'Chi phí đi lại để làm việc là khoản thiết yếu. Giao 2 đơn hàng.', 'farm', F('order', 2));
  M(w, 4, '🍳', 'Chuẩn bị bữa sáng đủ chất', 'Bữa sáng đủ chất giúp cả nhà khoẻ mạnh. Góp 2 🥚 trứng và 1 🥛 sữa.', 'give', G([['trung', 2], ['sua', 1]]), { req: 'a:bo' });
  M(w, 5, '🌱', 'Mua hạt giống cho vụ mới', 'Muốn thu thì phải gieo. Gieo 20 hạt giống.', 'farm', F('plant', 20));
  M(w, 5, '🩺', 'Khám sức khoẻ định kỳ cho cả nhà', 'Sức khoẻ là vốn quý nhất, đừng tiếc tiền cho khoản này.', 'wait', T(300));
  M(w, 5, '🐄', 'Thuê bác sĩ thú y khám cho bò', 'Bò khoẻ cho nhiều sữa. Thu 3 🥛 sữa bò.', 'farm', F('collect', 3, 'sua'), { req: 'a:bo' });
  M(w, 6, '👷', 'Trả tiền thuê người làm mùa vụ', 'Vụ mùa bận rộn cần thêm người giúp. Thu hoạch 25 cây.', 'farm', F('harvest', 25));
  M(w, 6, '🐟', 'Thay nước ao cá', 'Nước sạch thì cá mới lớn. Thu 4 🐟 cá tươi.', 'farm', F('collect', 4, 'catuoi'), { req: 'a:ca' });
  M(w, 7, '🪵', 'Mua củi cho lò bánh mì', 'Có củi thì lò mới chạy. Nướng 2 🥖 bánh mì.', 'farm', F('make', 2, 'banhmi'), { req: 'b:lobanh' });
  M(w, 7, '🧂', 'Mua gia vị nấu bữa tối', 'Góp 4 🌽 ngô và 3 🍅 cà chua cho bữa tối của gia đình.', 'give', G([['ngo', 4], ['cachua', 3]]));
  M(w, 8, '🔧', 'Bảo dưỡng xe chở hàng', 'Xe tốt thì giao hàng đúng hẹn. Giao 4 đơn hàng.', 'farm', F('order', 4));
  M(w, 8, '🪚', 'Sửa hàng rào bị gió đổ', 'Hàng rào hỏng thì gà chạy mất! Chờ sửa xong.', 'wait', T(600));
  M(w, 9, '✂️', 'Thuê kéo cắt lông cừu', 'Có dụng cụ tốt mới làm được việc. Thu 3 🧶 len cừu.', 'farm', F('collect', 3, 'len'), { req: 'a:cuu' });
  M(w, 9, '🧀', 'Mua men làm phô mai', 'Nguyên liệu là chi phí bắt buộc khi sản xuất. Làm 1 🧀 phô mai.', 'farm', F('make', 1, 'phomai'), { req: 'b:bosua' });
  M(w, 10, '📜', 'Trả tiền thuê đất cánh đồng', 'Thuê đất phải trả tiền đúng hạn. Thu hoạch 40 cây.', 'farm', F('harvest', 40));
  M(w, 11, '🧵', 'Mua chỉ cho máy dệt', 'Dệt 1 🧥 áo len.', 'farm', F('make', 1, 'aolen'), { req: 'b:maydet' });
  M(w, 11, '🌧️', 'Trữ lương thực mùa mưa bão', 'Luôn có sẵn đồ dự phòng cho ngày khó khăn. Góp 10 🌾 lúa và 5 🥚 trứng vào kho dự trữ.', 'give', G([['lua', 10], ['trung', 5]]));
  M(w, 12, '🧤', 'Mua đồ bảo hộ lấy mật ong', 'An toàn lao động là khoản chi không thể bỏ qua. Thu 2 🍯 mật ong.', 'farm', F('collect', 2, 'mat'), { req: 'a:ong' });
  M(w, 13, '🌽', 'Mua cám dự trữ cho cả trại', 'Cho vật nuôi ăn 10 lần.', 'farm', F('feed', 10));
  M(w, 14, '🧹', 'Dọn dẹp chuồng vịt', 'Chuồng sạch vịt mới khoẻ. Thu 4 🪶 lông vịt.', 'farm', F('collect', 4, 'longvit'), { req: 'a:vit' });
  M(w, 15, '🧧', 'Chuẩn bị mâm cơm ngày Tết', 'Góp 3 🥖 bánh mì, 4 🐟 cá tươi và 2 🍉 dưa hấu.', 'give', G([['banhmi', 3], ['catuoi', 4], ['dua', 2]]));
  M(w, 16, '❄️', 'Thuê kho lạnh bảo quản hàng', 'Hàng tươi lâu, bán được giá. Giao 6 đơn hàng.', 'farm', F('order', 6));
  M(w, 18, '🚜', 'Mua máy cày cho cánh đồng lớn', 'Máy móc giúp làm nhanh hơn. Thu hoạch 60 cây.', 'farm', F('harvest', 60));
  M(w, 20, '🏥', 'Mua bảo hiểm y tế cho cả nhà', 'Bảo hiểm giúp gia đình không bị bất ngờ khi ốm đau.', 'wait', T(1800));

  /* ---------- 📚 PHÁT TRIỂN BẢN THÂN ---------- */
  w = 'education';
  [[1, 'fruits', 5], [1, 'colors', 5], [2, 'family', 6], [2, 'pets', 6], [3, 'numbers', 7], [3, 'food', 7], [4, 'school', 8], [4, 'body', 8], [5, 'clothes', 8], [5, 'vegetables', 8],
   [6, 'jobs', 10], [6, 'weather', 10], [7, 'transport', 10], [7, 'sports', 10], [8, 'money', 12], [8, 'toys', 10], [9, 'emotions', 12], [10, 'places', 12], [11, 'travel', 14], [11, 'kitchen', 12],
   [12, 'countries', 14], [13, 'tech', 14], [14, 'space', 15], [15, 'nature', 15], [16, 'music', 15], [17, 'time', 15], [18, 'days', 15]].forEach(function (x) {
    M(w, x[0], '🔤', 'Khoá học tiếng Anh: ' + TOPIC[x[1]], 'Đóng học phí rồi vào game Từ vựng tiếng Anh, chủ đề ' + TOPIC[x[1]] + '. Hứng đúng ' + x[2] + ' từ để hoàn thành khoá học.', 'learn', LN('en', x[2], x[1]));
  });
  [[3, 'family', 5], [5, 'fruits', 6], [7, 'numbers', 8], [9, 'food', 8], [11, 'colors', 10], [13, 'money', 10], [15, 'school', 12], [17, 'pets', 12], [19, 'transport', 12]].forEach(function (x) {
    M(w, x[0], '🀄', 'Khoá học tiếng Trung: ' + TOPIC[x[1]], 'Đóng học phí rồi vào game Từ vựng tiếng Trung, chủ đề ' + TOPIC[x[1]] + '. Hứng đúng ' + x[2] + ' từ.', 'learn', LN('zh', x[2], x[1]), { cost: 1.1, pay: 1.05 });
  });
  [[1, 5, 'Toán vui nhập môn'], [3, 8, 'Lớp toán cộng trừ'], [6, 12, 'Lớp bảng cửu chương'], [9, 15, 'Lớp toán tư duy'], [12, 20, 'Luyện thi toán'], [16, 25, 'Lớp toán nâng cao']].forEach(function (x) {
    M(w, x[0], '🧮', x[2], 'Đóng học phí rồi vào game Toán học, trả lời đúng ' + x[1] + ' câu.', 'learn', LN('math', x[1]));
  });
  [[2, 5, 'Câu lạc bộ Sử Việt'], [5, 8, 'Lớp lịch sử các triều đại'], [8, 10, 'Tham quan bảo tàng Lịch sử'], [12, 15, 'Khoá học anh hùng dân tộc'], [16, 20, 'Hội thi Sử Việt']].forEach(function (x) {
    M(w, x[0], '🇻🇳', x[2], 'Vào game Lịch sử Việt Nam, trả lời đúng ' + x[1] + ' câu.', 'learn', LN('vnh', x[1]));
  });
  [[2, 5, 'Lớp địa lý quê hương'], [6, 8, 'Khám phá 34 tỉnh thành'], [10, 12, 'Khoá học văn hoá vùng miền'], [14, 15, 'Hành trình đất nước'], [18, 20, 'Thi Hiểu biết Việt Nam']].forEach(function (x) {
    M(w, x[0], '🧭', x[2], 'Vào game Khám phá Việt Nam, trả lời đúng ' + x[1] + ' câu.', 'learn', LN('vnv', x[1]));
  });
  [[1, 3, 'Lớp tài chính cho bé'], [4, 5, 'Khoá học quản lý tiền tiêu vặt'], [7, 8, 'Khoá học 6 chiếc hũ'], [11, 10, 'Khoá học đầu tư thông minh'], [15, 12, 'Hội thảo tự do tài chính'], [19, 15, 'Thi Nhà tài chính nhí']].forEach(function (x) {
    M(w, x[0], '🎯', x[2], 'Vào Đố vui tài chính, trả lời đúng ' + x[1] + ' câu.', 'learn', LN('quiz', x[1]), { pay: 1.2 });
  });
  [[1, 4, 'Bé tập xem đồng hồ'], [5, 6, 'Lớp quản lý thời gian'], [10, 8, 'Khoá học giờ giấc khoa học']].forEach(function (x) {
    M(w, x[0], '🕒', x[2], 'Vào game Dạy trẻ xem đồng hồ, đọc đúng ' + x[1] + ' giờ.', 'learn', LN('clock', x[1]));
  });
  M(w, 3, '🐣', 'Khoá kỹ thuật nuôi gà', 'Học cách chăm gà rồi thực hành: thu 5 🥚 trứng.', 'farm', F('collect', 5, 'trung'), { req: 'a:ga' });
  M(w, 5, '🍅', 'Khoá trồng cà chua sạch', 'Thực hành: thu hoạch 6 🍅 cà chua.', 'farm', F('harvest', 6, 'cachua'));
  M(w, 6, '👩‍🍳', 'Lớp học làm bánh mì', 'Thực hành: nướng 2 🥖 bánh mì.', 'farm', F('make', 2, 'banhmi'), { req: 'b:lobanh' });
  M(w, 8, '🍓', 'Khoá trồng dâu tây', 'Thực hành: thu hoạch 6 🍓 dâu tây.', 'farm', F('harvest', 6, 'dau'));
  M(w, 10, '🐄', 'Khoá chăn nuôi bò sữa', 'Thực hành: thu 5 🥛 sữa bò.', 'farm', F('collect', 5, 'sua'), { req: 'a:bo' });
  M(w, 12, '🐝', 'Khoá nuôi ong lấy mật', 'Thực hành: thu 3 🍯 mật ong.', 'farm', F('collect', 3, 'mat'), { req: 'a:ong' });
  M(w, 14, '🗣️', 'Lớp kỹ năng bán hàng', 'Thực hành: giao 5 đơn hàng.', 'farm', F('order', 5));
  M(w, 16, '🍇', 'Khoá trồng nho', 'Thực hành: thu hoạch 6 🍇 nho.', 'farm', F('harvest', 6, 'nho'));

  /* ---------- 🐷 TIẾT KIỆM (gửi tiền có kỳ hạn, nhận lại gốc + lãi) ---------- */
  w = 'saving';
  M(w, 1, '🐖', 'Bỏ heo đất lần đầu', 'Gửi tiền vào heo đất 2 phút, nhận lại kèm 2% lãi.', 'wait', T(120), { rate: 0.02 });
  M(w, 1, '💌', 'Trả cho mình trước', 'Mỗi khoản thu đều tự chia vào ví Tiết kiệm trước khi tiêu: đó là “trả cho mình trước”. Gửi một nửa số tiền trong ví Tiết kiệm 3 phút, lãi 3%.', 'wait', T(180), { pct: 0.5, rate: 0.03 });
  M(w, 2, '📗', 'Sổ tiết kiệm kỳ hạn 5 phút', 'Gửi 5 phút, lãi 3%.', 'wait', T(300), { cost: 1.5, rate: 0.03 });
  M(w, 2, '👟', 'Tiết kiệm mua đôi giày mới', 'Để dành dần cho món đồ mình thích thay vì xin tiền bố mẹ. Gửi 10 phút, lãi 4%.', 'wait', T(600), { rate: 0.04 });
  M(w, 3, '📘', 'Sổ tiết kiệm kỳ hạn 15 phút', 'Gửi 15 phút, lãi 5%.', 'wait', T(900), { cost: 2, rate: 0.05 });
  M(w, 3, '💌', 'Trả cho mình trước (lần 2)', 'Lặp lại thói quen tốt: gửi một nửa ví Tiết kiệm trong 10 phút, lãi 4%.', 'wait', T(600), { pct: 0.5, rate: 0.04 });
  M(w, 4, '🆘', 'Lập quỹ dự phòng khẩn cấp', 'Quỹ khẩn cấp giúp bạn không hoảng khi có chuyện bất ngờ. Gửi 30 phút, lãi 6%.', 'wait', T(1800), { cost: 2.5, rate: 0.06 });
  M(w, 5, '🚲', 'Tiết kiệm mua xe đạp', 'Mục tiêu rõ ràng giúp tiết kiệm dễ hơn. Gửi 30 phút, lãi 6%.', 'wait', T(1800), { cost: 3, rate: 0.06 });
  M(w, 5, '📙', 'Sổ tiết kiệm kỳ hạn 1 giờ', 'Gửi 1 giờ, lãi 8%.', 'wait', T(3600), { cost: 3, rate: 0.08 });
  M(w, 6, '💌', 'Gửi 60% ví Tiết kiệm', 'Gửi 60% ví Tiết kiệm trong 1 giờ, lãi 8%.', 'wait', T(3600), { pct: 0.6, rate: 0.08 });
  M(w, 7, '📕', 'Sổ tiết kiệm kỳ hạn 2 giờ', 'Gửi 2 giờ, lãi 10%.', 'wait', T(7200), { cost: 4, rate: 0.1 });
  M(w, 8, '🎓', 'Tiết kiệm học phí năm sau', 'Lo trước cho việc học. Gửi 1 giờ, lãi 8%.', 'wait', T(3600), { cost: 4, rate: 0.08 });
  M(w, 9, '🏦', 'Sổ tiết kiệm kỳ hạn 4 giờ', 'Gửi 4 giờ, lãi 12%. Hợp để gửi trước khi đi học.', 'wait', T(14400), { cost: 5, rate: 0.12 });
  M(w, 10, '🌙', 'Gửi tiết kiệm qua đêm', 'Gửi trước khi đi ngủ, sáng dậy nhận lãi: 8 giờ, lãi 15%.', 'wait', T(28800), { cost: 6, rate: 0.15 });
  M(w, 11, '🚜', 'Gửi 70% ví Tiết kiệm để mua máy cày', 'Gửi 70% ví Tiết kiệm trong 4 giờ, lãi 12%.', 'wait', T(14400), { pct: 0.7, rate: 0.12 });
  M(w, 12, '🕛', 'Sổ tiết kiệm kỳ hạn 12 giờ', 'Gửi 12 giờ, lãi 18%.', 'wait', T(43200), { cost: 8, rate: 0.18 });
  M(w, 13, '📅', 'Sổ tiết kiệm kỳ hạn 1 ngày', 'Gửi 1 ngày, lãi 22%.', 'wait', T(86400), { cost: 8, rate: 0.22 });
  M(w, 14, '🎁', 'Tiết kiệm mua quà Tết cho ông bà', 'Gửi 6 giờ, lãi 13%.', 'wait', T(21600), { cost: 10, rate: 0.13 });
  M(w, 15, '🗓️', 'Sổ tiết kiệm kỳ hạn 2 ngày', 'Gửi 2 ngày, lãi 30%.', 'wait', T(172800), { cost: 12, rate: 0.3 });
  M(w, 16, '🌟', 'Quỹ ước mơ', 'Gửi 80% ví Tiết kiệm trong 1 ngày, lãi 22%.', 'wait', T(86400), { pct: 0.8, rate: 0.22 });
  M(w, 17, '📆', 'Sổ tiết kiệm kỳ hạn 3 ngày', 'Gửi 3 ngày, lãi 40%.', 'wait', T(259200), { cost: 15, rate: 0.4 });
  M(w, 18, '🏛️', 'Sổ tiết kiệm kỳ hạn 1 tuần', 'Lãi kép: tiền lãi lại sinh ra lãi. Gửi 7 ngày, lãi 70%.', 'wait', T(604800), { cost: 20, rate: 0.7 });

  /* ---------- 📈 ĐẦU TƯ (rng = lãi/lỗ ngẫu nhiên trong khoảng, nhân với vốn) ---------- */
  w = 'invest';
  M(w, 2, '🥕', 'Đầu tư vụ cà rốt', 'Bỏ vốn mua giống, chăm sóc rồi thu hoạch: đầu tư vào việc mình hiểu rõ. Thu hoạch 6 🥕 cà rốt. Giá bán lúc thu hoạch có thể lên hoặc xuống.', 'farm', F('harvest', 6, 'carot'));
  M(w, 2, '🤝', 'Cho bạn mượn tiền mua giống', 'Cho vay có lãi: thường được trả đủ kèm lãi, nhưng đôi khi bạn trả thiếu. 5 phút, nhận lại 95–125%.', 'wait', T(300), { rng: [0.95, 1.25] });
  M(w, 3, '🧃', 'Góp vốn quầy nước mía ở chợ', 'Kinh doanh nhỏ có thể lãi hoặc lỗ. 10 phút, nhận lại 90–150% vốn.', 'wait', T(600), { rng: [0.9, 1.5] });
  M(w, 3, '🐔', 'Mua thêm gà đẻ trứng', 'Tài sản sinh ra thu nhập. Thu 6 🥚 trứng.', 'farm', F('collect', 6, 'trung'), { req: 'a:ga', pay: 1.1 });
  M(w, 4, '🛡️', 'Quỹ đầu tư an toàn', 'Rủi ro thấp, lãi vừa phải, rất hiếm khi lỗ. 15 phút, nhận lại 98–120% vốn.', 'wait', T(900), { cost: 1.5, rng: [0.98, 1.2] });
  M(w, 4, '🍉', 'Góp vốn vụ dưa của bác hàng xóm', 'Rủi ro cao: trúng mùa lãi to, mất mùa thì lỗ. 15 phút, nhận lại 60–190% vốn.', 'wait', T(900), { rng: [0.6, 1.9] });
  M(w, 5, '🌽', 'Mở rộng vụ ngô', 'Thu hoạch 10 🌽 ngô.', 'farm', F('harvest', 10, 'ngo'));
  M(w, 6, '🪙', 'Mua vàng tích trữ', 'Giá vàng lên xuống thất thường. 30 phút, nhận lại 85–145% vốn.', 'wait', T(1800), { cost: 2, rng: [0.85, 1.45] });
  M(w, 6, '🥖', 'Mở tiệm bánh mì nhỏ', 'Chế biến giúp tăng giá trị nông sản. Nướng 3 🥖 bánh mì.', 'farm', F('make', 3, 'banhmi'), { req: 'b:lobanh', pay: 1.2 });
  M(w, 7, '🏘️', 'Mua cổ phần hợp tác xã', 'Làm chủ một phần hợp tác xã, nhận lợi nhuận. 1 giờ, nhận lại 108–130% vốn.', 'wait', T(3600), { cost: 3, rng: [0.9, 1.3] });
  M(w, 8, '📝', 'Ký hợp đồng cung cấp nông sản', 'Có khách hàng ổn định. Giao 4 đơn hàng.', 'farm', F('order', 4), { pay: 1.2 });
  M(w, 8, '🍜', 'Góp vốn mở quán phở', 'Rủi ro rất cao! 1 giờ, nhận lại 50–220% vốn. Đừng bỏ hết tiền vào một chỗ.', 'wait', T(3600), { cost: 2, rng: [0.5, 2.2] });
  M(w, 9, '🏠', 'Đầu tư nhà kính trồng dâu', 'Thu hoạch 8 🍓 dâu tây.', 'farm', F('harvest', 8, 'dau'), { cost: 1.5 });
  M(w, 10, '📊', 'Quỹ chỉ số (đầu tư dài hạn)', 'Chia vốn vào nhiều công ty cùng lúc, giảm rủi ro. 2 giờ, nhận lại 110–135% vốn.', 'wait', T(7200), { cost: 4, rng: [0.92, 1.35] });
  M(w, 10, '🧀', 'Sản xuất phô mai đóng hộp', 'Làm 2 🧀 phô mai.', 'farm', F('make', 2, 'phomai'), { req: 'b:bosua', cost: 2 });
  M(w, 11, '🏺', 'Đầu tư xưởng gốm Bát Tràng', '2 giờ, nhận lại 80–160% vốn.', 'wait', T(7200), { cost: 4, rng: [0.8, 1.6] });
  M(w, 12, '🐝', 'Mở rộng trại ong', 'Thu 4 🍯 mật ong.', 'farm', F('collect', 4, 'mat'), { req: 'a:ong', cost: 2 });
  M(w, 13, '🏫', 'Mua trái phiếu làng xây trường', 'Cho làng vay tiền xây trường, nhận lãi đều đặn. 4 giờ, nhận lại 112–145% vốn.', 'wait', T(14400), { cost: 6, rng: [0.95, 1.45] });
  M(w, 14, '🫙', 'Xuất khẩu mứt dâu', 'Làm 2 🫙 mứt dâu.', 'farm', F('make', 2, 'mutdau'), { req: 'b:mut', cost: 3 });
  M(w, 15, '🌿', 'Khởi nghiệp nông sản sạch', '8 giờ, nhận lại 90–190% vốn.', 'wait', T(28800), { cost: 8, rng: [0.9, 1.9] });
  M(w, 16, '🛏️', 'Thương hiệu gối lông vịt', 'Làm 2 🛏️ gối lông vịt.', 'farm', F('make', 2, 'goi'), { req: 'b:chan', cost: 4 });
  M(w, 17, '🗺️', 'Mua đất nông nghiệp lâu dài', '12 giờ, nhận lại 115–160% vốn.', 'wait', T(43200), { cost: 10, rng: [0.9, 1.6] });
  M(w, 18, '🧺', 'Danh mục đầu tư đa dạng', 'Chia nhỏ vốn vào nhiều nơi: ít khi lỗ. 1 ngày, nhận lại 120–180% vốn.', 'wait', T(86400), { cost: 12, rng: [0.95, 1.8] });

  /* ---------- 🤝 CHIA SẺ ---------- */
  w = 'share';
  M(w, 1, '✏️', 'Ủng hộ quỹ khuyến học của trường', 'Góp tiền giúp các bạn nghèo có sách vở.', 'wait', T(60), { fert: 1 });
  M(w, 1, '🍚', 'Tặng lúa cho bếp ăn tình thương', 'Chia sẻ không nhất thiết là tiền. Tặng 3 🌾 lúa.', 'give', G([['lua', 3]]), { c0: 1, fert: 1 });
  M(w, 2, '🙌', 'Giúp bác hàng xóm thu hoạch', 'Chia sẻ thời gian và công sức: thu hoạch 6 cây giúp bác.', 'farm', F('harvest', 6), { c0: 1 });
  M(w, 2, '📚', 'Mua sách tặng thư viện làng', 'Sách giúp nhiều bạn nhỏ được đọc.', 'wait', T(120), { fert: 1 });
  M(w, 3, '🥚', 'Tặng trứng cho bếp ăn trường học', 'Tặng 4 🥚 trứng gà.', 'give', G([['trung', 4]]), { c0: 1, req: 'a:ga', fert: 1 });
  M(w, 4, '🌊', 'Ủng hộ đồng bào vùng lũ', 'Một chút của mình là rất nhiều với người đang khó khăn.', 'wait', T(300), { cost: 1.5, fert: 1 });
  M(w, 4, '🐾', 'Gửi rau củ cho trạm cứu hộ động vật', 'Tặng 5 🥕 cà rốt và 3 🌽 ngô.', 'give', G([['carot', 5], ['ngo', 3]]), { c0: 1, fert: 1 });
  M(w, 5, '🥛', 'Tặng sữa cho trẻ em mồ côi', 'Tặng 2 🥛 sữa bò.', 'give', G([['sua', 2]]), { c0: 1, req: 'a:bo', fert: 1 });
  M(w, 5, '🌳', 'Trồng cây xanh cho làng', 'Mua cây giống và gieo 10 hạt.', 'farm', F('plant', 10), { fert: 1 });
  M(w, 6, '🛣️', 'Góp tiền sửa đường vào bản', 'Con đường tốt giúp các bạn đi học an toàn.', 'wait', T(600), { cost: 1.5, fert: 1 });
  M(w, 7, '🥖', 'Phát bánh mì miễn phí', 'Tặng 3 🥖 bánh mì cho người lao động nghèo.', 'give', G([['banhmi', 3]]), { c0: 1, req: 'b:lobanh', fert: 2 });
  M(w, 8, '💧', 'Xây giếng nước sạch cho làng bên', 'Nước sạch giúp cả làng khoẻ mạnh.', 'wait', T(900), { cost: 2, fert: 2 });
  M(w, 9, '🧥', 'Tặng áo len cho trẻ em vùng cao', 'Tặng 2 🧥 áo len ấm áp.', 'give', G([['aolen', 2]]), { c0: 1, req: 'b:maydet', fert: 2 });
  M(w, 10, '👵', 'Biếu quà ông bà', 'Tặng 1 🍯 mật ong và 6 🥚 trứng.', 'give', G([['mat', 1], ['trung', 6]]), { c0: 1, req: 'a:ong', fert: 2 });
  M(w, 11, '🚚', 'Giao hàng giúp cô Lan bị ốm', 'Giao 3 đơn hàng giúp cô.', 'farm', F('order', 3), { c0: 1, fert: 2 });
  M(w, 12, '🍱', 'Bữa trưa yêu thương', 'Tặng 5 🐟 cá và 1 🧀 phô mai cho người vô gia cư.', 'give', G([['catuoi', 5], ['phomai', 1]]), { c0: 1, req: 'b:bosua', fert: 2 });
  M(w, 13, '🎓', 'Học bổng cho học sinh vượt khó', 'Tiền của bạn giúp một bạn khác tiếp tục đi học.', 'wait', T(1800), { cost: 3, fert: 3 });
  M(w, 14, '🛏️', 'Tặng gối cho viện dưỡng lão', 'Tặng 1 🛏️ gối lông vịt.', 'give', G([['goi', 1]]), { c0: 1, req: 'b:chan', fert: 3 });
  M(w, 15, '🌉', 'Góp tiền xây cầu cho bản làng', 'Cây cầu mới giúp cả bản qua suối mùa lũ.', 'wait', T(3600), { cost: 4, fert: 3 });
  M(w, 17, '🏮', 'Quà Trung thu cho trẻ em', 'Tặng 2 🫙 mứt dâu và 1 🍉 dưa hấu.', 'give', G([['mutdau', 2], ['dua', 1]]), { c0: 1, req: 'b:mut', fert: 3 });
  M(w, 19, '❤️', 'Quỹ trái tim cho em', 'Góp tiền phẫu thuật tim cho các bạn nhỏ.', 'wait', T(7200), { cost: 6, fert: 4 });

  /* ---------- 🎉 HƯỞNG THỤ ---------- */
  w = 'enjoy';
  M(w, 1, '🍦', 'Ăn kem cùng bạn', 'Một niềm vui nho nhỏ, vừa túi tiền.', 'wait', T(60));
  M(w, 1, '🪁', 'Thả diều trên đê', 'Niềm vui không tốn đồng nào!', 'wait', T(90), { c0: 1 });
  M(w, 2, '📖', 'Mua truyện tranh mới', 'Đọc truyện thư giãn sau giờ làm.', 'wait', T(180));
  M(w, 3, '🎬', 'Đi xem phim hoạt hình', 'Cả nhà cùng xem phim.', 'wait', T(300));
  M(w, 3, '🏸', 'Chơi cầu lông với bố mẹ', 'Vận động vui khoẻ, không mất tiền.', 'wait', T(120), { c0: 1 });
  M(w, 4, '🦁', 'Đi tham quan sở thú', 'Ngắm các con vật từ khắp nơi.', 'wait', T(300));
  M(w, 5, '🍢', 'Tiệc nướng ngoài vườn', 'Mời bạn bè dùng nông sản nhà trồng: 4 🌽 ngô và 3 🍅 cà chua.', 'give', G([['ngo', 4], ['cachua', 3]]), { cost: 0.5 });
  M(w, 5, '🌊', 'Đi công viên nước', 'Một ngày hè mát lạnh.', 'wait', T(600), { cost: 1.2 });
  M(w, 6, '🧩', 'Mua đồ chơi lắp ráp', 'Chọn đồ chơi vừa túi tiền, chơi được lâu.', 'wait', T(300));
  M(w, 7, '🧺', 'Picnic cuối tuần', 'Mang theo 2 🥖 bánh mì và 3 🍓 dâu tây.', 'give', G([['banhmi', 2], ['dau', 3]]), { cost: 0.5, req: 'b:lobanh' });
  M(w, 7, '🎤', 'Xem ca nhạc thiếu nhi', 'Âm nhạc làm tâm hồn vui vẻ.', 'wait', T(900));
  M(w, 8, '🍽️', 'Ăn buffet cùng gia đình', 'Thỉnh thoảng thưởng cho cả nhà một bữa ngon.', 'wait', T(600), { cost: 1.2 });
  M(w, 9, '⛺', 'Cắm trại ở rừng thông', 'Ngủ lều, ngắm sao.', 'wait', T(1800), { cost: 1.5 });
  M(w, 10, '🎂', 'Tổ chức tiệc sinh nhật', 'Chuẩn bị 2 🍉 dưa hấu, 2 🥖 bánh mì và 4 🥚 trứng.', 'give', G([['dua', 2], ['banhmi', 2], ['trung', 4]]), { cost: 0.6, req: 'b:lobanh' });
  M(w, 11, '🌲', 'Du lịch Đà Lạt cuối tuần', 'Chuyến đi cần để dành tiền trước.', 'wait', T(3600), { cost: 3 });
  M(w, 12, '🏊', 'Đi bơi cùng bạn bè', 'Vừa vui vừa khoẻ.', 'wait', T(1200));
  M(w, 13, '🏖️', 'Nghỉ hè ở biển Nha Trang', 'Một kỳ nghỉ thật đáng nhớ.', 'wait', T(7200), { cost: 4 });
  M(w, 14, '🫖', 'Tiệc trà chiều', 'Mời bạn bè 1 🫙 mứt dâu và 1 🧀 phô mai.', 'give', G([['mutdau', 1], ['phomai', 1]]), { cost: 0.5, req: 'b:mut' });
  M(w, 15, '⛵', 'Tham quan Vịnh Hạ Long', 'Kỳ quan thiên nhiên thế giới!', 'wait', T(10800), { cost: 5 });
  M(w, 17, '🏝️', 'Du lịch Phú Quốc cùng gia đình', 'Cả nhà cùng nghỉ dưỡng.', 'wait', T(21600), { cost: 7 });
  M(w, 19, '✈️', 'Du lịch nước ngoài', 'Chuyến đi lớn: phải tiết kiệm thật lâu mới đi được.', 'wait', T(43200), { cost: 10 });

  /* Mở rộng nông trại theo cấp (thay cho nhiệm vụ mở khoá cũ): thêm chỗ nuôi khi đạt cấp */
  var CAPUP = [{ a: 'bo', lv: 5, k: 2 }, { a: 'ca', lv: 9, k: 2 }, { a: 'cuu', lv: 12, k: 2 }, { a: 'ga', lv: 12, k: 4 }, { a: 'ong', lv: 13, k: 2 }, { a: 'vit', lv: 15, k: 3 }, { a: 'bo', lv: 16, k: 2 }, { a: 'de', lv: 16, k: 2 }];
  var MAX_ACTIVE = 2;
  /* KHU CHUỒNG: 15 ô đất, người chơi tự chọn xây chuồng nuôi con gì (có thể nhiều chuồng cùng loại).
     LOTLV = cấp cần để dùng ô đó. Xây chuồng trừ ví Đầu tư. */
  var NLOT = 15, LOTLV = [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], BCOLS = 3;
  function penCost(a) { return Math.round(a.cost * 1.2 / 1000) * 1000; }   // mỗi ví làm tối đa 2 nhiệm vụ cùng lúc

  var CM = {}; CROPS.forEach(function (c) { CM[c.id] = c; });
  var AM = {}; ANIMALS.forEach(function (a) { AM[a.id] = a; });
  var BM = {}; BUILDS.forEach(function (b) { BM[b.id] = b; });
  /* Thu nhập thụ động của công trình: inc = đồng/giờ, tích tối đa INC_CAP giờ rồi dừng (phải ghé thu thường xuyên).
     src = công trình kiếm tiền bằng cách nào (dạy trẻ khái niệm "tài sản tạo ra thu nhập"). */
  var INC_CAP = 8;
  var BINC = {
    them: [1500, 'Khách ghé thềm nhà mua rau củ'], gieng: [2500, 'Bán nước giếng sạch cho hàng xóm'], lobanh: [4000, 'Bán bánh mì nóng cho khách qua đường'],
    bosua: [7000, 'Giao sữa tươi mỗi sáng cho cửa hàng'], xetai: [9000, 'Chở hàng thuê cho cả làng'], maydet: [12000, 'Nhận dệt vải thuê'],
    coixay: [15000, 'Xay bột thuê cho bà con'], nha2: [20000, 'Cho khách du lịch thuê phòng homestay'], mut: [18000, 'Bán mứt cho siêu thị'],
    chan: [25000, 'Nhận may chăn gối theo đơn'], nha3: [50000, 'Homestay cao cấp đón khách du lịch']
  };
  BUILDS.forEach(function (b) { b.inc = BINC[b.id][0]; b.src = BINC[b.id][1]; });
  /* Vị trí công trình trên bản đồ Ruộng (x = giữa, y = chân móng) */
  var BPOS = {
    them: { x: MX + 60, y: HD - 4, h: 1 }, nha2: { x: MX + 60, y: HD - 4, h: 1 }, nha3: { x: MX + 60, y: HD - 4, h: 1 },
    gieng: { x: MX + 123, y: HD - 3, sm: 1 }, coixay: { x: MX + 250, y: HD - 3, sm: 1 },
    lobanh: { x: 140, y: 650, roof: '#b45309', wall: '#fde68a' }, bosua: { x: 140, y: 820, roof: '#2563eb', wall: '#e0f2fe' }, maydet: { x: 140, y: 990, roof: '#7c3aed', wall: '#ede9fe' },
    mut: { x: 890, y: 650, roof: '#db2777', wall: '#fce7f3' }, chan: { x: 890, y: 820, roof: '#0d9488', wall: '#ccfbf1' }, xetai: { x: 890, y: 990, roof: '#475569', wall: '#e2e8f0', gar: 1 }
  };
  var LOTS = ['lobanh', 'bosua', 'maydet', 'mut', 'chan', 'xetai'];
  var GM = {}; GAMES.forEach(function (g) { GM[g.k] = g; });
  function item(id) { return CM[id] || PRODUCTS[id]; }
  function need(lv) { return 10 * lv + 5 * lv * lv; }   // kinh nghiệm cần để lên cấp tiếp

  /* ================= TRẠNG THÁI & LƯU TRỮ ================= */
  function emptyPlots() { var p = []; for (var i = 0; i < TOTAL; i++) p.push({ c: null, p: 0, t: 0, w: 0 }); return p; }
  function fresh() {
    var an = {}; ANIMALS.forEach(function (a) { an[a.id] = []; });
    return { v: 2, m: 300000, start: 300000, xp: 0, lv: 1, rows: 3, plots: emptyPlots(), inv: {}, an: an, fert: 3, orders: [], log: [], tin: 0, tout: 0, sel: 'lua', seen: 0, made: Date.now(),
      gs: {}, bld: {}, fac: {}, fx: {}, ms: {}, ev: {}, wl: {}, inc: {}, jar: null, si: null, jx: null, pct: null, fix: [], dis: null, dmg: null, def: {}, raid: null, pens: null, fz: null, selF: 'f1', bday: null, mw: 'essential', gift: '', tipCam: 0 };
  }
  var S = fresh();
  function load() {
    var o = null;
    try { o = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    S = fresh();
    if (o && o.plots && (o.v === 1 || o.v === 2)) {
      for (var k in o) S[k] = o[k];
      if (o.v === 1) {
        // Bản cũ: ruộng 4 cột → bản mới 5 cột. Giữ nguyên cây đang trồng, vốn ban đầu cũ là 200.000đ.
        var np = emptyPlots();
        o.plots.forEach(function (pl, i) { var r = Math.floor(i / 4), c = i % 4; if (r < MAXROWS && pl) np[r * COLS + c] = pl; });
        S.plots = np; S.start = 200000; S.v = 2; S.orders = [];
      }
    }
    var F = fresh();
    ['gs', 'bld', 'fac', 'fx', 'ms', 'ev', 'wl', 'inc', 'inv', 'an'].forEach(function (k) { if (!S[k] || typeof S[k] !== 'object') S[k] = F[k]; });
    if (!S.start) S.start = 200000;
    delete S.q; delete S.dq;   // nhiệm vụ kiểu cũ (đã thay bằng nhiệm vụ 6 ví)
    if (!WM[S.mw]) S.mw = 'essential';
    if (!S.pct) { S.pct = {}; for (var pk in PCT_DEF) S.pct[pk] = PCT_DEF[pk]; }
    // Chuyển sang cách tính số dư giống app: toàn bộ tiền đang có được chia lại theo tỷ lệ hiện tại
    if (typeof S.si !== 'number' || !S.jx) {
      var m0 = S.jar ? JK.reduce(function (a, k) { return a + (+S.jar[k] || 0); }, 0) : S.m;
      S.si = Math.max(0, m0); S.jx = {}; JK.forEach(function (k) { S.jx[k] = 0; });
    }
    S.jar = {}; JK.forEach(function (k) { if (typeof S.jx[k] !== 'number') S.jx[k] = 0; }); syncM();
    if (!S.def || typeof S.def !== 'object') S.def = {};
    // Chuồng kiểu cũ (mỗi loại 1 chuồng cố định) → ô chuồng tự chọn: mỗi loại đang nuôi được xếp vào các ô đầu tiên
    if (!Array.isArray(S.pens)) S.pens = [];
    while (S.pens.length < NLOT) S.pens.push(null);
    ANIMALS.forEach(function (a) {
      (S.an[a.id] || []).forEach(function (x) {
        if (x.pen != null && S.pens[x.pen] && S.pens[x.pen].a === a.id) return;
        var cap = capPen(a), lot = -1;
        for (var i = 0; i < NLOT; i++) if (S.pens[i] && S.pens[i].a === a.id && S.an[a.id].filter(function (y) { return y.pen === i; }).length < cap) { lot = i; break; }
        if (lot < 0) for (i = 0; i < NLOT; i++) if (!S.pens[i]) { S.pens[i] = { a: a.id }; lot = i; break; }
        x.pen = lot < 0 ? 0 : lot;
      });
    });
    if (!S.fz) S.fz = { f1: S.fert || 0, f2: 0, f3: 0 }; FERTS.forEach(function (f) { if (typeof S.fz[f.id] !== 'number') S.fz[f.id] = 0; }); if (!FZM[S.selF]) S.selF = 'f1';
    if (!Array.isArray(S.fix)) S.fix = []; if (!S.dmg) S.dmg = { house: 0, pen: {}, sick: {}, bld: {} };
    for (var bk in S.bld) if (!S.inc[bk]) S.inc[bk] = Date.now();
    while (S.plots.length < TOTAL) S.plots.push({ c: null, p: 0, t: 0, w: 0 });
    ANIMALS.forEach(function (a) { if (!S.an[a.id]) S.an[a.id] = []; });
    S.plots.forEach(function (pl) { if (pl.c && !CM[pl.c]) { pl.c = null; pl.p = 0; } });
    if (!CM[S.sel]) S.sel = 'lua';
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S, function (k, v) { return k.charAt(0) === '_' ? undefined : v; })); } catch (e) {} }

  /* ================= TIỆN ÍCH ================= */
  function money(n, sg) { var s = Math.abs(Math.round(n)).toLocaleString('vi-VN') + 'đ'; return n < 0 ? '−' + s : (sg && n > 0 ? '+' + s : s); }
  function short(n) { var a = Math.abs(n), s; if (a >= 1e9) s = (a / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ'; else if (a >= 1e6) s = (a / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tr'; else if (a >= 1e3) s = Math.round(a / 1e3) + 'k'; else s = '' + a; return (n < 0 ? '−' : '') + s; }
  function dur(sec) { sec = Math.max(0, Math.ceil(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? h + ' giờ ' + m + ' phút' : (m ? m + ':' + ('0' + s).slice(-2) : s + ' giây'); }
  function durL(sec) { return sec >= 3600 ? Math.floor(sec / 3600) + ' giờ' + (sec % 3600 ? ' ' + Math.round(sec % 3600 / 60) + ' phút' : '') : sec >= 60 ? (sec % 60 ? Math.floor(sec / 60) + ' phút ' + sec % 60 + ' giây' : sec / 60 + ' phút') : sec + ' giây'; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sfx(k) { try { if (window.sfx) window.sfx(k); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function dayKey() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function built(id) { return !!S.bld[id]; }
  function sp(id) { return Math.round(item(id).sell * (built('nha3') ? 1.1 : 1) / 100) * 100; }   // giá bán ở chợ

  /* Sổ thu chi: gộp các khoản giống nhau phát sinh liên tiếp trong 2 phút */
  function addLog(k, amt, key, name, e, q) {
    q = q || 1;
    if (k === 'in') S.tin += amt; else S.tout += amt;
    var L = S.log[0], now = Date.now();
    if (L && L.key === key && L.k === k && now - L.ts < 120000) { L.a += amt; L.q += q; L.ts = now; }
    else { S.log.unshift({ ts: now, k: k, a: amt, key: key, n: name, e: e, q: q }); if (S.log.length > 150) S.log.length = 150; }
  }
  /* ================= 6 VÍ (giống 6 hũ trong app) =================
     Mọi khoản THU được tự chia vào 6 ví theo tỷ lệ cài đặt. Mọi khoản CHI lấy từ đúng ví của nó:
     hạt giống, phân bón, sửa chữa → Thiết yếu; đất, vật nuôi, công trình → Đầu tư; nhiệm vụ → ví của nhiệm vụ. */
  var JK = ['essential', 'education', 'saving', 'invest', 'share', 'enjoy'];
  var PCT_DEF = { essential: 50, education: 10, saving: 5, invest: 15, share: 5 };
  var PCT_PRESETS = [{ n: '6PAY mặc định', p: { essential: 50, education: 10, saving: 5, invest: 15, share: 5 } }, { n: '6 chiếc lọ chuẩn', p: { essential: 55, education: 10, saving: 10, invest: 10, share: 5 } }, { n: 'Tiết kiệm mạnh', p: { essential: 50, education: 10, saving: 15, invest: 15, share: 5 } }];
  /* Tỷ lệ dùng chung với trang chủ app 6PAY (window.sixPct do index.html cung cấp); mở game riêng lẻ thì dùng bản lưu trong game */
  function curPct() { try { if (window.sixPct) { var a = window.sixPct.get(); if (a && typeof a.essential === 'number') return a; } } catch (e) {} return S.pct || PCT_DEF; }
  function pctOf(k) { var p = curPct(); return k === 'enjoy' ? Math.max(0, 100 - p.essential - p.education - p.saving - p.invest - p.share) : p[k]; }
  /* Số dư mỗi ví tính GIỐNG APP: (tổng các khoản thu được chia × tỷ lệ của ví) + các khoản riêng của ví đó (chi tiêu là số âm).
     S.si = tổng tiền thu được chia theo tỷ lệ; S.jx[k] = tiền vào/ra riêng của ví k.
     Vì vậy đổi tỷ lệ là số dư cả 6 ví tự tính lại ngay, tổng tiền không đổi. */
  function syncM() {
    var p = curPct(), sum = 0;
    JK.forEach(function (k) { var v = Math.round(S.si * (k === 'enjoy' ? Math.max(0, 100 - p.essential - p.education - p.saving - p.invest - p.share) : p[k]) / 100 + (S.jx[k] || 0)); S.jar[k] = v; sum += v; });
    S.m = sum;
  }
  function addMoney(a, to) {
    if (!a) return;
    if (to) S.jx[to] = (S.jx[to] || 0) + a; else S.si += a;
    syncM();
  }
  function has(w, a) { syncM(); return S.jar[w] >= a; }
  function takeMoney(w, a) { S.jx[w] = (S.jx[w] || 0) - a; syncM(); }
  function addXP(x) {
    S.xp += x; var up = false, from = S.lv;
    while (S.xp >= need(S.lv)) { S.xp -= need(S.lv); S.lv++; up = true; }
    if (up) setTimeout(function () { levelUp(from); }, 350);
  }

  /* ================= TIỀN TỪ CÁC GAME HỌC (HỘP THƯ) ================= */
  function drain() {
    var box = null;
    try { box = JSON.parse(localStorage.getItem(INBOX)); } catch (e) {}
    if (!Array.isArray(box) || !box.length) return null;
    try { localStorage.removeItem(INBOX); } catch (e) {}
    var sum = {}, tot = 0, okT = 0;
    box.forEach(function (x) {
      if (!x || !GM[x.g]) return;
      var a = Math.max(0, Math.round(+x.a || 0)), ok = Math.max(0, Math.round(+x.ok || 0));
      var gs = S.gs[x.g] || (S.gs[x.g] = { ok: 0, earn: 0 });
      gs.ok += ok; gs.earn += a; okT += ok;
      if (x.t) { var gt = S.gs[x.g + ':' + x.t] || (S.gs[x.g + ':' + x.t] = { ok: 0, earn: 0 }); gt.ok += ok; gt.earn += a; }
      if (a) { addMoney(a); tot += a; sum[x.g] = (sum[x.g] || 0) + a; addLog('in', a, 'earn_' + x.g, 'Tiền học tập: ' + GM[x.g].n, GM[x.g].e); }
    });
    var xp = Math.round(tot / 20000);
    if (xp) addXP(xp);
    save();
    return tot || okT ? { tot: tot, sum: sum, xp: xp } : null;
  }

  /* ================= NHIỆM VỤ (logic) ================= */
  function stat(g) { var x = S.gs[g]; return x ? x.ok : 0; }
  function evc(k) { return S.ev[k] || 0; }
  function ev(k, x, n) { n = n || 1; S.ev[k] = evc(k) + n; if (x) S.ev[k + ':' + x] = evc(k + ':' + x) + n; }
  function mKey(m) { return m.k === 'learn' ? (m.t ? m.g + ':' + m.t : m.g) : m.x ? m.ev + ':' + m.x : m.ev; }
  function mCur(m) { return m.k === 'learn' ? stat(mKey(m)) : evc(mKey(m)); }
  function mSt(m) { return S.ms[m.id] || null; }   // {s:1 đang làm, b: mốc, t: lúc bắt đầu, c: tiền đã chi} | {s:2 xong}
  function reqOk(m) {
    if (!m.req) return true;
    var p = m.req.split(':');
    return p[0] === 'b' ? built(p[1]) : (S.an[p[1]] || []).length > 0;
  }
  function reqText(m) {
    var p = m.req.split(':');
    return p[0] === 'b' ? 'Cần xây ' + BM[p[1]].e + ' ' + BM[p[1]].n : 'Cần nuôi ít nhất 1 con ' + AM[p[1]].e + ' ' + AM[p[1]].n.toLowerCase();
  }
  function mCost(m) { return m.pct ? Math.max(20000, r1k(S.jar.saving * m.pct)) : m.cost; }
  function mProg(m) {   // 0..1
    var e = mSt(m); if (!e || e.s !== 1) return e && e.s === 2 ? 1 : 0;
    if (m.k === 'wait') return Math.min(1, (Date.now() - e.t) / (m.s * 1000));
    if (m.k === 'give') return m.it.every(function (x) { return (S.inv[x[0]] || 0) >= x[1]; }) ? 1 : 0;
    return Math.min(1, (mCur(m) - e.b) / m.c);
  }
  function mDone(m) { var e = mSt(m); return !!e && e.s === 1 && m.k !== 'give' && mProg(m) >= 1; }
  function mActive(wk) { return MISSIONS.filter(function (m) { var e = mSt(m); return m.w === wk && e && e.s === 1; }); }
  function mPayText(m, c) {
    if (m.w === 'saving') return money(r1k(c * (1 + m.rate)));
    if (m.rng) return short(r1k(c * m.rng[0])) + ' – ' + short(r1k(c * m.rng[1]));
    return money(m.pay);
  }
  function mTask(m) {
    if (m.k === 'learn') return (m.g === 'clock' ? 'Đọc đúng ' + m.c + ' giờ' : m.g === 'en' || m.g === 'zh' ? 'Hứng đúng ' + m.c + ' từ' : 'Trả lời đúng ' + m.c + ' câu') + ' · ' + GM[m.g].e + ' ' + GM[m.g].n + (m.t ? ' – ' + TOPIC[m.t] : '');
    if (m.k === 'farm') { var E = EVN[m.ev], I = m.x && item(m.x); return E[0] + ' ' + m.c + ' ' + (I ? I.e + ' ' + I.n.toLowerCase() : E[1]); }
    if (m.k === 'wait') return '⏱ ' + durL(m.s);
    return 'Giao: ' + m.it.map(function (x) { return x[1] + ' ' + item(x[0]).e; }).join(', ');
  }
  function walletReady(wk) { var n = 0; MISSIONS.forEach(function (m) { if (m.w === wk && (mDone(m) || (mSt(m) && mSt(m).s === 1 && m.k === 'give' && mProg(m) >= 1))) n++; }); return n; }
  function giftAmt() { return (20000 + S.lv * 5000) * (built('nha3') ? 3 : built('nha2') ? 2 : 1); }
  function giftReady() { return built('them') && S.gift !== dayKey() && !S.dmg.house; }
  function claimable() { var n = S.fix.filter(function (f) { return !f.s; }).length + (S.lv >= RAID_LV && !S.def.rao ? 1 : 0); WALLETS.forEach(function (W0) { n += walletReady(W0.k); }); if (giftReady()) n++; return n; }
  function wlog(wk, k, a) { var x = S.wl[wk] || (S.wl[wk] = { o: 0, i: 0, n: 0 }); x[k] += a; }

  /* Bắt đầu: chi tiền từ ví nông trại */
  function mStart(id) {
    var m = MSM[id]; if (!m || mSt(m) || S.lv < m.lv || !reqOk(m)) return;
    if (mActive(m.w).length >= MAX_ACTIVE) { toast('Ví ' + WM[m.w].n + ' đang có ' + MAX_ACTIVE + ' nhiệm vụ. Hoàn thành bớt rồi nhận thêm nhé!'); return; }
    var c = mCost(m);
    if (!has(m.w, c)) { noMoney(c, m.w); return; }
    takeMoney(m.w, c);
    if (c) { addLog('out', c, 'm_' + m.id, WM[m.w].e + ' ' + m.n, m.e); wlog(m.w, 'o', c); }
    S.ms[m.id] = { s: 1, b: m.k === 'wait' || m.k === 'give' ? 0 : mCur(m), t: Date.now(), c: c };
    sfx('ok'); save(); hud(); renderQuest();
    toast(m.e + ' Đã nhận nhiệm vụ' + (c ? ', chi ' + money(c) : '') + '. ' + (m.k === 'wait' ? 'Quay lại sau ' + durL(m.s) + ' nhé!' : m.k === 'learn' ? 'Bấm “Vào học” để bắt đầu.' : m.k === 'give' ? 'Gom đủ hàng rồi bấm “Giao”.' : 'Ra nông trại làm việc thôi!'));
  }
  /* Hoàn thành: nhận tiền + KN */
  function mClaim(id) {
    var m = MSM[id], e = mSt(m); if (!m || !e || e.s !== 1) return;
    if (m.k === 'give') {
      if (mProg(m) < 1) { toast('Chưa đủ hàng trong kho'); return; }
      m.it.forEach(function (x) { S.inv[x[0]] -= x[1]; });
    } else if (mProg(m) < 1) return;
    var c = e.c || 0, pay, note = '';
    if (m.w === 'saving') { pay = r1k(c * (1 + m.rate)); note = 'Tiền gốc ' + money(c) + ' + lãi ' + money(pay - c) + '. Kiên nhẫn đã được đền đáp!'; }
    else if (m.rng) {
      var R = m.rng[0] + Math.random() * (m.rng[1] - m.rng[0]); pay = r1k(c * R);
      note = pay >= c ? 'Lãi <b>' + money(pay - c) + '</b> (' + Math.round((pay / c - 1) * 100) + '%). Khoản đầu tư thành công!' : 'Lỗ <b>' + money(c - pay) + '</b>. Đầu tư luôn có rủi ro: lần sau hãy chia nhỏ vốn và chọn khoản phù hợp nhé.';
    } else pay = m.pay;
    addMoney(pay, m.w === 'saving' || m.w === 'invest' ? m.w : null); if (pay) { addLog('in', pay, 'mr_' + m.id, 'Hoàn thành: ' + m.n, m.e); wlog(m.w, 'i', pay); }
    wlog(m.w, 'n', 1);
    if (m.fert) S.fz.f1 += m.fert;
    S.ms[m.id] = { s: 2, p: pay, c: c, d: Date.now() };
    addXP(m.xp); sfx('win'); save(); hud(); renderQuest();
    var W0 = WM[m.w];
    sheet('<div class="fm-modal"><div class="big">' + m.e + '</div><h2>Hoàn thành!</h2><p><b>' + esc(m.n) + '</b></p>' +
      '<div class="fm-ul">' + (c ? '<span>Đã chi ' + money(c) + '</span>' : '') + (pay ? '<span>Nhận <b style="color:#15803d">' + money(pay) + '</b></span>' : '') + '<span>+' + m.xp + ' KN</span>' + (m.fert ? '<span><i>🧪</i>+' + m.fert + '</span>' : '') + '</div>' +
      (note ? '<p>' + note + '</p>' : '') + (!pay && c ? '<p>' + (m.w === 'share' ? 'Bạn đã cho đi ' + money(c) + '. Cảm ơn tấm lòng của bạn!' : 'Bạn đã tiêu ' + money(c) + ' cho niềm vui. Tiền hưởng thụ không lấy lại, nhưng bạn đã nạp đầy năng lượng!') + '</p>' : '') +
      (pay ? '<p style="font-size:13px">' + (m.w === 'saving' || m.w === 'invest' ? 'Tiền đã trở về ví ' + W0.e + ' ' + W0.n + '.' : 'Tiền thưởng đã được chia vào 6 ví theo tỷ lệ của bạn.') + '</p>' : '') + '<p style="font-size:13px">' + W0.e + ' ' + W0.q + '</p>' +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn" data-a="sheetClose">Tuyệt vời!</button></div></div>');
  }
  /* Huỷ: tiết kiệm = rút trước hạn (lấy lại gốc, không lãi); việc khác = bỏ nhiệm vụ (mất tiền đã chi) */
  function mCancel(id) {
    var m = MSM[id], e = mSt(m); if (!m || !e || e.s !== 1) return;
    var sv = m.w === 'saving';
    confirmBox(sv ? '🐷' : '↩️', sv ? 'Rút tiền trước hạn?' : 'Bỏ nhiệm vụ này?', sv ? 'Bạn chỉ nhận lại tiền gốc <b>' + money(e.c) + '</b>, không có lãi và không có kinh nghiệm.' : 'Số tiền đã chi <b>' + money(e.c || 0) + '</b> sẽ không được trả lại. Bạn có thể nhận lại nhiệm vụ sau.', sv ? 'Rút tiền' : 'Bỏ nhiệm vụ', function () {
      if (sv && e.c) { addMoney(e.c, 'saving'); addLog('in', e.c, 'mc_' + m.id, 'Rút trước hạn: ' + m.n, '🐷'); wlog(m.w, 'i', e.c); }
      delete S.ms[m.id]; save(); hud(); renderQuest();
    });
  }
  /* Đi làm nhiệm vụ */
  function mGo(id) {
    var m = MSM[id]; if (!m) return;
    if (m.k === 'learn') { play(m.g, m.t); return; }
    if (m.k === 'farm') {
      if (m.ev === 'feed' || m.ev === 'collect') setTab('barn');
      else if (m.ev === 'make') setTab('build');
      else if (m.ev === 'order' || m.ev === 'sell') { mSub = m.ev === 'sell' ? 'inv' : 'ord'; setTab('market'); }
      else { setTab('field'); if (m.ev === 'water') toast('🪣 Bấm nút Tưới hết để tưới cả ruộng'); else if (m.ev === 'plant') tool = 'seed'; else if (m.ev === 'fert') tool = 'fert'; if (m.x && CM[m.x] && CM[m.x].lv <= S.lv) S.sel = m.x; toolsUI(); }
      toast(m.e + ' ' + mTask(m));
    }
  }
  /* Thêm chỗ nuôi theo cấp */
  function penOpen(a) { return S.lv >= a.lv; }
  function capPen(a) { var c = a.cap; CAPUP.forEach(function (u) { if (u.a === a.id && S.lv >= u.lv) c += u.k; }); return c; }   // sức chứa mỗi chuồng
  function penList(i) { var P = S.pens[i]; return P ? S.an[P.a].filter(function (x) { return x.pen === i; }) : []; }
  function nextCap(a) { for (var i = 0; i < CAPUP.length; i++) if (CAPUP[i].a === a.id && S.lv < CAPUP[i].lv) return CAPUP[i]; return null; }
  /* Lộ trình mở khoá theo cấp */
  function unlocksAt(lv) {
    var u = [];
    for (var r in LAND) if (LAND[r].lv === lv) u.push({ e: '🪧', t: 'Mở rộng ruộng hàng ' + r, go: 'field' });
    FIELDS.forEach(function (f) { if (f.lv === lv) u.push({ e: '🌾', t: f.n + ' (' + f.c * f.r + ' ô đất)', go: 'field' }); });
    ANIMALS.forEach(function (a) { if (a.lv === lv) u.push({ e: a.e, t: 'Được nuôi ' + a.n.toLowerCase(), go: 'barn' }); });
    CAPUP.forEach(function (c) { if (c.lv === lv) u.push({ e: AM[c.a].e, t: 'Thêm ' + c.k + ' chỗ mỗi ' + AM[c.a].pen.toLowerCase(), go: 'barn' }); });
    var nl = LOTLV.filter(function (l) { return l === lv; }).length; if (nl) u.push({ e: '🟫', t: 'Thêm ' + nl + ' ô đất xây chuồng', go: 'barn' });
    BUILDS.forEach(function (b) { if (b.lv === lv) u.push({ e: b.e, t: 'Được xây ' + b.n.toLowerCase(), go: 'build' }); });
    CROPS.forEach(function (c) { if (c.lv === lv && lv > 1) u.push({ e: c.e, t: 'Hạt giống ' + c.n.toLowerCase(), go: 'field' }); });
    return u;
  }
  function nextUnlock() { for (var l = S.lv + 1; l <= 30; l++) { var u = unlocksAt(l); if (u.length) return { lv: l, u: u }; } return null; }

  /* ================= THIÊN TAI: MƯA BÃO / GIÓ LỐC (5 giờ một lần, từ cấp 3) =================
     Làm hỏng hoa màu, dột nhà, hỏng xưởng, hỏng chuồng, vật nuôi bị ốm. Mỗi thiệt hại thành 1 "sự cố" ở mục Nhiệm vụ:
     trả chi phí sửa chữa (trừ ví Thiết yếu), chờ thợ sửa xong thì mọi thứ hoạt động lại. */
  var checkDisasterLater = false, lastAW = 0;
  var DIS_EVERY = 5 * 3600 * 1000, DIS_LV = 3, WX = null;
  var FIXD = { rao: [120, '🪵', 'Sửa hàng rào bị phá'], crop: [60, '🧹', 'Dọn ruộng sau bão'], house: [120, '🏚️', 'Sửa mái nhà bị dột'], bld: [120, '🔧', 'Sửa mái xưởng bị dột'], pen: [90, '🔨', 'Sửa chuồng bị hỏng'], sick: [150, '🩺', 'Mời bác sĩ thú y'] };
  function animPaused(aid) { return !!(S.dmg.pen[aid] || S.dmg.sick[aid]); }
  function checkDisaster(now) {
    if (S.lv < DIS_LV) return;
    if (!S.dis) { S.dis = { next: now + DIS_EVERY, n: 0 }; return; }
    if (now >= S.dis.next) { S.dis.next = now + DIS_EVERY; disaster(now); }
  }
  function fixTitle(f) {
    if (f.t === 'crop') return 'Dọn ' + f.n + ' ô ruộng bị hỏng';
    if (f.t === 'rao') return 'Sửa hàng rào bị gấu phá';
    if (f.t === 'house') return 'Sửa mái nhà bị dột';
    if (f.t === 'bld') return 'Sửa mái ' + BM[f.a].n.toLowerCase();
    if (f.t === 'pen') return 'Sửa ' + AM[f.a].pen.toLowerCase();
    return 'Chữa bệnh cho ' + AM[f.a].n.toLowerCase() + ' (' + S.an[f.a].length + ' con)';
  }
  function fixDesc(f) {
    if (f.t === 'crop') return 'Hoa màu bị ' + (f.w === 'rain' ? 'ngập úng' : 'gió quật gãy') + ', không thu hoạch được. Phải thuê người dọn rồi mới gieo lại được.';
    if (f.t === 'rao') return 'Hàng rào thủng một đoạn, cáo và sói có thể vào bắt vật nuôi bất cứ lúc nào!';
    if (f.t === 'house') return 'Nhà dột nên tạm dừng thu nhập của ngôi nhà và quà mỗi ngày.';
    if (f.t === 'bld') return 'Xưởng dột nên tạm dừng thu nhập và không làm được mẻ mới.';
    if (f.t === 'pen') return 'Chuồng hỏng, ' + AM[f.a].n.toLowerCase() + ' không ăn và không cho sản phẩm.';
    return AM[f.a].n + ' bị ốm sau trận ' + (f.w === 'rain' ? 'mưa lạnh' : 'gió lốc') + ', không ăn và không cho sản phẩm.';
  }
  function disaster(now) {
    var w = Math.random() < 0.5 ? 'rain' : 'wind', R = Math.random, fx = [], lv = S.lv;
    var planted = []; for (var i = 0; i < TOTAL; i++) { var pl = S.plots[i]; if (plotOpen(i) && pl.c && !pl.dmg) planted.push(i); }
    var hit = planted.filter(function () { return R() < 0.35; });
    if (planted.length && !hit.length && R() < 0.7) hit.push(planted[Math.floor(R() * planted.length)]);
    // cây ăn quả lâu năm chịu được bão, chỉ bị rụng quả (phải chờ lứa sau); cây ngắn ngày thì bị hỏng
    var trees = hit.filter(function (i) { return CM[S.plots[i].c].per; }); hit = hit.filter(function (i) { return !CM[S.plots[i].c].per; });
    trees.forEach(function (i) { S.plots[i].p = 0; S.plots[i].t = now; });
    if (hit.length) { hit.forEach(function (i) { S.plots[i].dmg = w === 'rain' ? 1 : 2; }); fx.push({ t: 'crop', n: hit.length, c: r1k(Math.max(5000, hit.length * (2000 + lv * 300))) }); }
    if (!S.dmg.house && R() < (w === 'rain' ? 0.65 : 0.35)) { S.dmg.house = 1; fx.push({ t: 'house', c: r1k(base(lv) * 1.2) }); }
    var bl = LOTS.filter(function (id) { return built(id) && !S.dmg.bld[id]; });
    if (bl.length && R() < (w === 'wind' ? 0.5 : 0.35)) { var b = bl[Math.floor(R() * bl.length)]; S.dmg.bld[b] = 1; fx.push({ t: 'bld', a: b, c: r1k(BM[b].cost * 0.06) }); }
    var own = ANIMALS.filter(function (a) { return S.an[a.id].length && !animPaused(a.id); });
    if (own.length && R() < (w === 'wind' ? 0.6 : 0.3)) { var a1 = own.splice(Math.floor(R() * own.length), 1)[0]; S.dmg.pen[a1.id] = 1; fx.push({ t: 'pen', a: a1.id, c: r1k(a1.cost * 0.35) }); }
    if (own.length && R() < (w === 'rain' ? 0.6 : 0.3)) { var a2 = own[Math.floor(R() * own.length)]; S.dmg.sick[a2.id] = 1; fx.push({ t: 'sick', a: a2.id, c: r1k(a2.cost * 0.12 * Math.min(4, S.an[a2.id].length)) }); }
    if (!fx.length && trees.length) { S.dis.last = now; WX = { w: w, until: Date.now() + 14000, p: [] }; save(); sheetLater('<div class="fm-modal"><div class="big">' + (w === 'rain' ? '🌧️' : '🌪️') + '</div><h2>' + (w === 'rain' ? 'Mưa bão vừa đi qua!' : 'Gió lốc vừa đi qua!') + '</h2><p>' + trees.length + ' cây ăn quả bị rụng hết quả, phải chờ lứa sau. May là cây lâu năm rất khoẻ, không bị hỏng!</p><div class="fm-row" style="justify-content:center"><button class="fm-btn" data-a="sheetClose">Đóng</button></div></div>'); return; }
    if (!fx.length) { if (!S.dmg.house) { S.dmg.house = 1; fx.push({ t: 'house', c: r1k(base(lv) * 1.2) }); } else return; }
    fx.forEach(function (f, k) { f.id = 'f' + now + k; f.w = w; f.s = 0; S.fix.push(f); });
    S.dis.last = now; S.dis.n = (S.dis.n || 0) + 1;
    WX = { w: w, until: Date.now() + 14000, p: [] };
    var tot = fx.reduce(function (a, f) { return a + f.c; }, 0);
    save(); badges();
    sheetLater('<div class="fm-modal"><div class="big">' + (w === 'rain' ? '🌧️' : '🌪️') + '</div><h2>' + (w === 'rain' ? 'Một trận mưa bão vừa đi qua!' : 'Gió lốc vừa quét qua nông trại!') + '</h2>' +
      (trees.length ? '<p style="font-size:13.5px">🌳 ' + trees.length + ' cây ăn quả bị rụng quả (cây vẫn khoẻ, chờ lứa sau).</p>' : '') +
      '<ul class="fm-earnlist">' + fx.map(function (f) { return '<li><span>' + FIXD[f.t][1] + ' ' + fixTitle(f) + '</span><b style="color:#dc2626">−' + short(f.c) + '</b></li>'; }).join('') + '</ul>' +
      '<p>Tổng chi phí sửa chữa: <b>' + money(tot) + '</b>, trừ vào ví 🏠 Thiết yếu' + (S.jar.essential < tot ? ' (ví này đang chỉ có ' + money(S.jar.essential) + ')' : '') + '.</p>' +
      '<p style="font-size:13px">Chuyện bất ngờ luôn có thể xảy ra. Vì vậy cần có <b>quỹ dự phòng</b> trong ví 🐷 Tiết kiệm để không bị động khi gặp sự cố.</p>' +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Để sau</button><button class="fm-btn org" data-a="tab" data-t="quest">🔧 Đi sửa chữa</button></div></div>');
  }
  function fixStart(id) {
    var f = S.fix.filter(function (x) { return x.id === id; })[0]; if (!f || f.s) return;
    if (!has('essential', f.c)) { noMoney(f.c, 'essential'); return; }
    takeMoney('essential', f.c); addLog('out', f.c, 'fix_' + f.t, 'Sửa chữa: ' + fixTitle(f), FIXD[f.t][1]);
    f.s = 1; f.st = Date.now(); sfx('ok'); save(); hud(); renderQuest();
    toast(FIXD[f.t][1] + ' Thợ đang sửa, xong sau ' + durL(FIXD[f.t][0]) + '.');
  }
  function fixTick(now) {
    var done = [];
    S.fix = S.fix.filter(function (f) {
      if (f.s !== 1 || now - f.st < FIXD[f.t][0] * 1000) return true;
      if (f.t === 'crop') S.plots.forEach(function (pl) { if (pl.dmg) { pl.dmg = 0; pl.c = null; pl.p = 0; pl.w = 0; } });
      else if (f.t === 'rao') S.dmg.rao = 0;
      else if (f.t === 'house') { S.dmg.house = 0; ['them', 'nha2', 'nha3'].forEach(function (k) { if (built(k)) S.inc[k] = now; }); }
      else if (f.t === 'bld') { delete S.dmg.bld[f.a]; S.inc[f.a] = now; }
      else if (f.t === 'pen') { delete S.dmg.pen[f.a]; S.an[f.a].forEach(function (x) { x.t = now; }); }
      else { delete S.dmg.sick[f.a]; S.an[f.a].forEach(function (x) { x.t = now; }); }
      done.push(f); return false;
    });
    if (done.length) {
      var xp = 0; done.forEach(function (f) { xp += Math.max(3, Math.round(need(S.lv) * 0.06)); });
      addXP(xp); save(); hud(); toast('✅ Đã sửa xong: ' + done.map(fixTitle).join(', ') + ' · +' + xp + ' KN'); sfx('win');
      if (tab === 'quest') renderQuest();
    }
  }
  function fixHtml() {
    if (!S.fix.length) return '';
    var h = '<div class="fm-fix"><b>🚨 Sự cố cần xử lý (' + S.fix.length + ')</b><small>Chi phí sửa chữa trừ ví 🏠 Thiết yếu (đang có ' + short(S.jar.essential) + ')</small>';
    S.fix.forEach(function (f) {
      h += '<div class="fm-card"><div class="fm-li"><span class="fm-ic">' + FIXD[f.t][1] + '</span><div class="bd"><b class="t">' + fixTitle(f) + '</b><small>' + fixDesc(f) + '</small>';
      if (f.s === 1) { var p = Math.min(1, (Date.now() - f.st) / (FIXD[f.t][0] * 1000)); h += '<div class="fm-pb"><i id="xp_' + f.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="xt_' + f.id + '">🔧 Đang sửa · còn ' + dur((1 - p) * FIXD[f.t][0]) + '</div>'; }
      else h += '<div class="fm-row"><button class="fm-btn org" data-a="fixGo" data-f="' + f.id + '">🔧 Sửa ngay · −' + short(f.c) + '</button></div>';
      h += '</div></div></div>';
    });
    return h + '</div>';
  }

  /* ================= THÚ HOANG & BẢO VỆ NÔNG TRẠI =================
     Khoảng 4 giờ một lần (từ cấp 4) có thú hoang mò đến bắt vật nuôi:
       🦊 Cáo bắt gà            → bị chặn nếu có hàng rào
       🐺 Sói bắt gà, cừu, dê   → bị chặn nếu có hàng rào + chòi canh (chỉ có hàng rào thì chặn được 1 nửa)
       🐻 Gấu phá hàng rào      → bị đuổi đi nếu có chòi bắn cung; không có thì phá rào và bắt vật nuôi
     Nhiệm vụ bảo vệ: xây hàng rào, chòi canh, chòi bắn cung (chi từ ví Thiết yếu: an toàn là nhu cầu thiết yếu). */
  var RAID_EVERY = 4 * 3600 * 1000, RAID_LV = 4;
  var DEFS = [
    { id: 'rao', n: 'Xây hàng rào bao quanh nông trại', e: '🪵', lv: 4, c: 300000, t: 180, d: 'Hàng rào gỗ chắc chắn bao quanh cả nông trại. Chặn được cáo và thú nhỏ vào bắt gà.' },
    { id: 'choi', n: 'Xây chòi canh', e: '🛖', lv: 6, c: 600000, t: 300, req: 'rao', d: 'Có người canh gác ngày đêm, phát hiện sói từ xa. Có cả hàng rào và chòi canh thì sói không vào được.' },
    { id: 'cung', n: 'Xây chòi bắn cung', e: '🏹', lv: 9, c: 1200000, t: 480, req: 'choi', d: 'Cung thủ đuổi những con thú lớn như gấu, không để chúng phá hàng rào và bắt vật nuôi.' }
  ];
  var DFM = {}; DEFS.forEach(function (d) { DFM[d.id] = d; });
  var PRED = {
    fox: { n: 'Cáo', e: '🦊', lv: 4, tg: ['ga'] },
    wolf: { n: 'Sói', e: '🐺', lv: 7, tg: ['cuu', 'ga', 'de'] },
    bear: { n: 'Gấu', e: '🐻', lv: 10, tg: ['bo', 'cuu', 'heo', 'de', 'ga'] }
  };
  function hasDef(id) { var d = S.def[id]; return !!(d && d.s === 2) && !(id === 'rao' && S.dmg.rao); }
  function defState(D) { var d = S.def[D.id]; if (d) return d.s === 2 ? 'done' : 'build'; if (S.lv < D.lv) return 'lv'; if (D.req && !(S.def[D.req] && S.def[D.req].s === 2)) return 'req'; return 'buy'; }
  function checkRaid(now) {
    if (S.lv < RAID_LV) return;
    if (!S.raid) { S.raid = { next: now + RAID_EVERY / 2, n: 0 }; return; }   // lần đầu: sau 2 giờ
    if (now >= S.raid.next) { S.raid.next = now + RAID_EVERY; raid(now); }
  }
  function raid(now) {
    var ks = Object.keys(PRED).filter(function (k) { return S.lv >= PRED[k].lv; }), k = ks[Math.floor(Math.random() * ks.length)], P = PRED[k];
    var own = P.tg.filter(function (a) { return S.an[a] && S.an[a].length; });
    if (!own.length) return;   // không có con mồi: thú bỏ đi
    var take = 0, blocked = false, broke = false, why = '';
    if (k === 'fox') { if (hasDef('rao')) { blocked = true; why = 'Hàng rào đã chặn con cáo ở ngoài!'; } else take = 1 + (Math.random() < 0.5 ? 1 : 0); }
    else if (k === 'wolf') {
      if (hasDef('rao') && hasDef('choi')) { blocked = true; why = 'Người canh trên chòi canh phát hiện sói từ xa, hàng rào giữ chúng ở ngoài!'; }
      else if (hasDef('rao') && Math.random() < 0.5) { blocked = true; why = 'May quá, hàng rào đã chặn được sói lần này. Nhưng không có chòi canh thì lần sau chưa chắc!'; }
      else take = 2;
    } else {
      if (hasDef('cung')) { blocked = true; why = 'Cung thủ trên chòi bắn cung đã đuổi con gấu chạy mất!'; }
      else if (hasDef('rao')) { broke = true; take = 1; }
      else take = 2;
    }
    var lost = [];
    for (var i = 0; i < take; i++) {
      var pool = own.filter(function (a) { return S.an[a].length; }); if (!pool.length) break;
      var a = pool[Math.floor(Math.random() * pool.length)]; S.an[a].pop();
      lost.push(a);
    }
    if (broke) { S.dmg.rao = 1; S.fix.push({ id: 'f' + now + 'r', t: 'rao', s: 0, c: r1k(DFM.rao.c * 0.25), w: 'bear' }); }
    S.raid.n = (S.raid.n || 0) + 1; S.raid.last = { k: k, t: now, lost: lost.length, blocked: blocked };
    var val = lost.reduce(function (s0, a) { return s0 + AM[a].cost; }, 0), cnt = {};
    lost.forEach(function (a) { cnt[a] = (cnt[a] || 0) + 1; });
    save(); badges();
    var tips = [];
    if (!hasDef('rao') && S.lv >= DFM.rao.lv && !S.def.rao) tips.push('🪵 Xây hàng rào để chặn cáo');
    if (k !== 'fox' && !S.def.choi && S.lv >= DFM.choi.lv) tips.push('🛖 Xây chòi canh để chặn sói');
    if (k === 'bear' && !S.def.cung) tips.push('🏹 Xây chòi bắn cung để đuổi gấu' + (S.lv < DFM.cung.lv ? ' (mở ở cấp ' + DFM.cung.lv + ')' : ''));
    sheetLater('<div class="fm-modal"><div class="big">' + (blocked ? '🛡️' : P.e) + '</div><h2>' + (blocked ? P.n + ' đã bị chặn lại!' : P.n + ' vào nông trại!') + '</h2>' +
      (blocked ? '<p>' + why + ' Đàn vật nuôi an toàn. Tiền chi cho an toàn thật xứng đáng!</p>' :
        '<p>' + (broke ? 'Con gấu to quá, đã <b>phá hàng rào</b> để vào. ' : '') + 'Nông trại bị mất:</p><div class="fm-ul">' + Object.keys(cnt).map(function (a) { return '<span><i>' + AM[a].e + '</i>' + cnt[a] + ' con ' + AM[a].n.toLowerCase() + '</span>'; }).join('') + '</div>' +
        '<p>Thiệt hại khoảng <b style="color:#dc2626">' + money(val) + '</b>' + (broke ? ', chưa kể tiền sửa hàng rào' : '') + '.</p>') +
      (tips.length ? '<p style="font-size:13.5px"><b>Nhiệm vụ bảo vệ:</b> ' + tips.join(' · ') + '</p>' : '') +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Đóng</button>' + (tips.length || broke ? '<button class="fm-btn org" data-a="tab" data-t="quest">🛡️ Bảo vệ nông trại</button>' : '') + '</div></div>');
  }
  function defStart(id) {
    var D = DFM[id]; if (defState(D) !== 'buy') return;
    if (!has('essential', D.c)) { noMoney(D.c, 'essential'); return; }
    takeMoney('essential', D.c); addLog('out', D.c, 'def_' + id, D.n, D.e);
    S.def[id] = { s: 1, st: Date.now() }; sfx('ok'); save(); hud(); renderQuest();
    toast(D.e + ' Thợ đang xây, xong sau ' + durL(D.t) + '.');
  }
  function defTick(now) {
    DEFS.forEach(function (D) {
      var d = S.def[D.id]; if (!d || d.s !== 1 || now - d.st < D.t * 1000) return;
      d.s = 2; var xp = Math.max(10, Math.round(need(S.lv) * 0.3)); addXP(xp); save(); hud(); sfx('win');
      toast('🎉 ' + D.n.replace('Xây ', 'Đã xây xong ') + '! +' + xp + ' KN');
      if (tab === 'quest') renderQuest();
    });
  }
  function defHtml() {
    if (S.lv < RAID_LV) return '';
    var all = DEFS.every(function (D) { return defState(D) === 'done'; });
    if (all) return '<div class="fm-card done" style="padding:9px 12px;font-size:13.5px">🛡️ Nông trại đã được bảo vệ đầy đủ: 🪵 hàng rào, 🛖 chòi canh, 🏹 chòi bắn cung.</div>';
    var h = '<div class="fm-def"><b>🛡️ Nhiệm vụ bảo vệ nông trại</b><small>Thú hoang (🦊 cáo, 🐺 sói, 🐻 gấu) thỉnh thoảng mò đến bắt vật nuôi. Chi phí xây trừ ví 🏠 Thiết yếu.</small>';
    DEFS.forEach(function (D) {
      var st = defState(D), d = S.def[D.id];
      h += '<div class="fm-card' + (st === 'done' ? ' done' : st === 'lv' || st === 'req' ? ' lock' : '') + '"><div class="fm-li"><span class="fm-ic">' + D.e + '</span><div class="bd"><b class="t">' + D.n + (st === 'done' ? ' ✅' : '') + '</b><small>' + D.d + '</small>';
      if (st === 'build') { var p = Math.min(1, (Date.now() - d.st) / (D.t * 1000)); h += '<div class="fm-pb"><i id="dp_' + D.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="dt_' + D.id + '">🔨 Đang xây · còn ' + dur((1 - p) * D.t) + '</div>'; }
      else if (st === 'buy') h += '<div class="fm-row"><button class="fm-btn org" data-a="defGo" data-d="' + D.id + '">🔨 Xây · −' + short(D.c) + '</button><span class="fm-tag">+' + Math.max(10, Math.round(need(S.lv) * 0.3)) + ' KN</span></div>';
      else if (st === 'lv') h += '<div><span class="fm-tag">🔒 Mở ở cấp ' + D.lv + '</span><span class="fm-tag">Giá ' + short(D.c) + '</span></div>';
      else if (st === 'req') h += '<div><span class="fm-tag">Cần ' + DFM[D.req].n.replace('Xây ', '').toLowerCase() + ' trước</span></div>';
      h += '</div></div></div>';
    });
    return h + '</div>';
  }
  /* Vẽ hàng rào quanh nông trại + chòi canh, chòi bắn cung */
  var TOWER = { choi: { x: 60, y: 1175 }, cung: { x: 975, y: 1175 } };
  function perimeter(c, Wd, top) {
    if (!S.def.rao || S.def.rao.s !== 2) return;
    fence(c, 10, top, Wd.w - 20, Wd.h - top - 12);
    if (S.dmg.rao) {   // đoạn rào bị gấu phá
      var bx = Wd.w / 2 - 40, by = Wd.h - 14;
      c.fillStyle = '#5aa83a'; c.fillRect(bx, by - 14, 80, 24);
      c.strokeStyle = '#7a5032'; c.lineWidth = 4; c.beginPath(); c.moveTo(bx + 4, by - 2); c.lineTo(bx + 30, by - 18); c.moveTo(bx + 50, by + 4); c.lineTo(bx + 76, by - 10); c.stroke();
      c.font = '800 12px ' + TF; var t = '🔧 Rào bị phá', w = c.measureText(t).width + 16;
      c.fillStyle = '#dc2626'; rr(c, Wd.w / 2 - w / 2, by - 44, w, 22, 11); c.fill(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, Wd.w / 2, by - 32.5);
    }
  }
  function tower(c, x, by, kind) {
    var d = S.def[kind]; if (!d) return;
    if (d.s === 1) { emo(c, '🏗️', x, by - 30, 40); return; }
    c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(x, by, 32, 8, 0, 0, 7); c.fill();
    c.strokeStyle = '#7a5032'; c.lineWidth = 5; c.beginPath(); c.moveTo(x - 22, by); c.lineTo(x - 14, by - 70); c.moveTo(x + 22, by); c.lineTo(x + 14, by - 70); c.stroke();
    c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 20, by - 20); c.lineTo(x + 18, by - 46); c.moveTo(x + 20, by - 20); c.lineTo(x - 18, by - 46); c.stroke();
    c.fillStyle = '#a16207'; c.fillRect(x - 24, by - 82, 48, 14);
    c.fillStyle = kind === 'cung' ? '#7f1d1d' : '#92400e'; c.beginPath(); c.moveTo(x - 30, by - 80); c.lineTo(x, by - 108); c.lineTo(x + 30, by - 80); c.closePath(); c.fill();
    emo(c, kind === 'cung' ? '🏹' : '👀', x, by - 75, 16);
    if (kind === 'cung') { c.save(); c.translate(x + 20, by - 96); c.rotate(-0.6 + Math.sin(tm * 2) * 0.1); emo(c, '🚩', 0, 0, 16); c.restore(); }
    c.font = '800 11px ' + TF; var t = kind === 'cung' ? 'Chòi bắn cung' : 'Chòi canh', w = c.measureText(t).width + 14;
    c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, x - w / 2, by + 6, w, 18, 9); c.fill(); c.fillStyle = '#4a3416'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, x, by + 15.5);
  }
  function drawDefenses() {
    perimeter(ctx, WORLD.field, HD + 6);
    tower(ctx, TOWER.choi.x, TOWER.choi.y, 'choi'); tower(ctx, TOWER.cung.x, TOWER.cung.y, 'cung');
  }

  /* ================= MÔ PHỎNG THỜI GIAN ================= */
  function gmul(pl) { return (pl.w ? (built('gieng') ? 1.7 : 1.5) : 1) * (built('coixay') ? 1.15 : 1); }
  function update(now) {
    for (var i = 0; i < S.plots.length; i++) {
      var pl = S.plots[i]; if (!pl.c || pl.p >= 1 || pl.dmg) continue;
      pl.p = Math.min(1, pl.p + (now - pl.t) / (ct(pl) * 1000) * gmul(pl)); pl.t = now;
    }
    ANIMALS.forEach(function (a) {
      var pz = animPaused(a.id);
      S.an[a.id].forEach(function (x) { if (pz) { x.t = now; return; } if (x.s === 1) { x.p = Math.min(1, x.p + (now - x.t) / (a.t * 1000)); x.t = now; if (x.p >= 1) x.s = 2; } });
    });
    BUILDS.forEach(function (b) { var f = S.fac[b.id]; if (b.r && f && f.s === 1 && now - f.t >= b.r.t * 1000) f.s = 2; });
  }
  function ct(pl) { var c = CM[pl.c]; return c.per && pl.n ? c.re : c.t; }   // thời gian lớn: cây lâu năm từ lần 2 chỉ cần re giây
  function left(pl) { return (1 - pl.p) * ct(pl) / gmul(pl); }

  /* ================= ĐƠN HÀNG ================= */
  function orderSlots() { return built('xetai') ? 4 : 3; }
  function orderPool() {
    var pool = CROPS.filter(function (c) { return c.lv <= S.lv; }).map(function (c) { return c.id; });
    ANIMALS.forEach(function (a) { if (S.an[a.id].length) pool.push(a.p); });
    BUILDS.forEach(function (b) { if (b.r && built(b.id)) pool.push(b.r.o); });
    return pool;
  }
  var NAMES = ['Cô Lan bán xôi', 'Chú Tư quán phở', 'Bếp ăn trường học', 'Siêu thị mini', 'Nhà hàng Sen Vàng', 'Bà Ba bán chè', 'Tiệm bánh Hạnh Phúc', 'Quán cơm Bình Dân', 'Chợ đầu mối', 'Hợp tác xã', 'Khách sạn Biển Xanh', 'Cửa hàng tiện lợi'];
  function genOrder() {
    var pool = shuffle(orderPool()), k = Math.min(pool.length, ri(1, S.lv >= 3 ? 3 : 2)), it = [], val = 0, xp = 2;
    for (var i = 0; i < k; i++) {
      var id = pool[i], P = !!PRODUCTS[id], q = P ? ri(1, 2 + Math.floor(S.lv / 5)) : ri(2, Math.min(8, 3 + Math.floor(S.lv / 2)));
      if ((CM[id] && CM[id].t >= 600) || (P && PRODUCTS[id].sell >= 70000)) q = ri(1, 2);
      it.push([id, q]); val += item(id).sell * q; xp += item(id).xp * q;
    }
    return { it: it, m: Math.round(val * 1.2 / 1000) * 1000, xp: xp, who: NAMES[ri(0, NAMES.length - 1)], tr: ['🚚', '🛻', '🚛', '🛵'][ri(0, 3)] };
  }
  function orderPay(o) { return built('xetai') ? Math.round(o.m * 1.2 / 1000) * 1000 : o.m; }
  function fillOrders() { while (S.orders.length < orderSlots()) S.orders.push(genOrder()); }
  function canDeliver(o) { return o.it.every(function (x) { return (S.inv[x[0]] || 0) >= x[1]; }); }

  /* ================= CSS ================= */
  var st = document.createElement('style');
  st.textContent = '' +
  '#fmOv{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;background:#5aa83a;color:#24361a;font-family:' + TF + ';-webkit-font-smoothing:antialiased;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;overflow:hidden}' +
  '#fmOv.on{display:flex}#fmOv *{box-sizing:border-box}#fmOv button{font:inherit;cursor:pointer;color:inherit}' +
  '.fm-top{flex:none;display:flex;align-items:center;gap:8px;padding:max(8px,env(safe-area-inset-top)) 10px 8px;background:linear-gradient(180deg,#2f6b1f,#3f8a29);color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.25);z-index:2}' +
  '.fm-ib{flex:none;min-width:42px;height:42px;border:0;border-radius:12px;background:rgba(255,255,255,.18);color:#fff!important;font-size:18px;font-weight:800;padding:0 10px}' +
  '.fm-lv{flex:1;min-width:0;display:flex;align-items:center;gap:8px}' +
  '.fm-badge{flex:none;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe082,#f59e0b);color:#5b3300;font-weight:900;font-size:17px;display:flex;align-items:center;justify-content:center;border:2px solid #fff3c4;box-shadow:0 2px 6px rgba(0,0,0,.3)}' +
  '.fm-xp{flex:1;min-width:0}.fm-xp small{display:block;font-size:11px;font-weight:700;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.fm-xpb{height:9px;border-radius:6px;background:rgba(0,0,0,.25);overflow:hidden;margin-top:3px}.fm-xpb i{display:block;height:100%;background:linear-gradient(90deg,#a3e635,#facc15);border-radius:6px;transition:width .3s}' +
  '.fm-money{flex:none;border:0;background:rgba(0,0,0,.22);color:#fff!important;border-radius:999px;padding:8px 12px;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}' +
  '.fm-main{flex:1;min-height:0;position:relative}' +
  '.fm-wbar{flex:none;display:flex;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:4px 6px 5px;background:#2f6b1f;box-shadow:0 2px 8px rgba(0,0,0,.2);z-index:2;touch-action:pan-x}.fm-wbar::-webkit-scrollbar{display:none}' +
  '.fm-wbar button{flex:1 0 auto;min-width:0;position:relative;border:0;border-radius:10px;background:#fffdf5;padding:3px 6px 4px;text-align:center;color:#4a3416!important;border-bottom:3px solid var(--wc);line-height:1.2}' +
  '.fm-wbar .n{display:block;font-size:10.5px;font-weight:800;white-space:nowrap;letter-spacing:-.2px}.fm-wbar .n i{font-style:normal;color:#9a8660;font-weight:700}.fm-wbar .b{display:block;font-size:13.5px;font-weight:900;font-variant-numeric:tabular-nums;color:#1e3a8a}' +
  '.fm-wbar button.set{flex:0 0 auto;background:#fef3c7}.fm-wbar button.set .b{color:#92400e}.fm-wbar button.on{background:var(--wc);color:#fff!important}.fm-wbar button.on .n i,.fm-wbar button.on .b{color:#fff}.fm-wbar .dot{position:absolute;top:-3px;right:-2px;min-width:16px;height:16px;border-radius:8px;background:#ef4444;color:#fff;font-size:10px;line-height:16px;padding:0 4px}' +
  '.fm-stage{position:absolute;inset:0;touch-action:none}.fm-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}' +
  '.fm-tools{position:absolute;left:50%;transform:translateX(-50%);bottom:8px;width:max-content;max-width:100%;display:flex;gap:6px;padding:8px 6px 2px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x;z-index:1}.fm-tools::-webkit-scrollbar{display:none}' +
  '.fm-zoom{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:1}.fm-zoom button{width:36px;height:36px;border:0;border-radius:11px;background:rgba(255,255,255,.85);box-shadow:0 3px 10px rgba(0,0,0,.22);font-size:20px;font-weight:900;color:#3b2a14!important;line-height:1;font-family:' + EF + '}.fm-zoom button:active{transform:scale(.92)}' +
  '.fm-tool{flex:none;white-space:nowrap;pointer-events:auto;border:0;border-radius:16px;background:rgba(255,255,255,.94);box-shadow:0 4px 12px rgba(0,0,0,.25);padding:6px 6px;display:flex;flex-direction:column;align-items:center;min-width:58px;font-size:11px;font-weight:800;color:#3b2a14!important;position:relative}' +
  '.fm-tool .e{font-size:25px;line-height:1.15;font-family:' + EF + '}.fm-tool.on{background:#fff7d1;box-shadow:0 0 0 3px #f59e0b,0 4px 12px rgba(0,0,0,.25)}' +
  '.fm-tool .n{position:absolute;top:-6px;right:-4px;background:#ef4444;color:#fff;border-radius:999px;font-size:11px;padding:1px 6px}' +
  '.fm-panel{position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 12px 24px;background:linear-gradient(180deg,#fef9e7,#f3e7c4);display:none}.fm-panel.on{display:block}' +
  '.fm-nav{flex:none;background:#fffdf5;border-top:1px solid #e5d9b6;padding:0 0 env(safe-area-inset-bottom);box-shadow:0 -2px 10px rgba(0,0,0,.1);z-index:2}' +
  '.fm-navs{display:flex;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;scroll-snap-type:x proximity;padding:5px 8px 4px;touch-action:pan-x;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 12px,#000 calc(100% - 12px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 12px,#000 calc(100% - 12px),transparent 100%)}.fm-navs::-webkit-scrollbar{display:none}' +
  '.fm-nav button{flex:1 0 auto;min-width:68px;scroll-snap-align:center;border:0;background:none;padding:5px 12px 4px;border-radius:12px;display:flex;flex-direction:column;align-items:center;font-size:12px;font-weight:800;color:#6b5a3a!important;position:relative;white-space:nowrap}' +
  '.fm-nav button .e{font-size:22px;line-height:1.2;font-family:' + EF + '}.fm-nav button.on{background:#ffeeba;color:#7a4a00!important}' +
  '.fm-navs{gap:2px}.fm-nav button.earn{color:#9a3412!important}.fm-nav button.earn.on{background:#fde68a}.fm-nav button.earn .e{animation:fmPulse 2.4s ease-in-out infinite}' +
  '@keyframes fmPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}' +
  '.fm-nav .dot{position:absolute;top:0;right:4px;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;line-height:18px;padding:0 5px}' +
  '.fm-h{font-size:18px;font-weight:900;margin:2px 0 4px;color:#5b3a12}.fm-sub{font-size:13px;color:#7a6440;margin:0 0 10px;line-height:1.5}' +
  '.fm-card{background:#fff;border-radius:16px;padding:12px;margin-bottom:10px;box-shadow:0 2px 8px rgba(120,80,0,.12)}' +
  '.fm-ord{display:flex;gap:10px;align-items:flex-start}.fm-ord .tr{font-size:40px;font-family:' + EF + ';line-height:1}.fm-ord .bd{flex:1;min-width:0}' +
  '.fm-ord b.w{display:block;font-size:15px;color:#5b3a12}.fm-need{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}' +
  '.fm-need span{background:#f6f0de;border-radius:10px;padding:4px 8px;font-weight:800;font-size:14px;white-space:nowrap}.fm-need span.ok{background:#dcfce7;color:#166534}.fm-need span.no{background:#fee2e2;color:#991b1b}' +
  '.fm-need span i{font-style:normal;font-family:' + EF + ';font-size:18px;vertical-align:-2px;margin-right:2px}' +
  '.fm-rw{font-size:14px;font-weight:800;color:#15803d}.fm-row{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}' +
  '.fm-btn{border:0;border-radius:12px;padding:9px 14px;font-weight:800;font-size:14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff!important;box-shadow:0 3px 8px rgba(22,163,74,.3)}' +
  '.fm-btn.alt{background:#f1e7cc;color:#6b4a14!important;box-shadow:none}.fm-btn.org{background:linear-gradient(135deg,#f59e0b,#ea580c);box-shadow:0 3px 8px rgba(234,88,12,.3)}.fm-btn.blu{background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 3px 8px rgba(37,99,235,.3)}.fm-btn:disabled{opacity:.45;cursor:default}' +
  '.fm-inv{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
  '.fm-it{background:#fff;border-radius:16px;padding:10px;text-align:center;box-shadow:0 2px 8px rgba(120,80,0,.12)}.fm-it .e{font-size:40px;font-family:' + EF + ';line-height:1.2}' +
  '.fm-it b{display:block;font-size:15px}.fm-it small{display:block;color:#7a6440;font-size:12px;margin-bottom:6px}.fm-it .q{font-size:20px;font-weight:900;color:#5b3a12}.fm-it .fm-btn{padding:7px 8px;font-size:13px;flex:1}' +
  '.fm-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.fm-sum div{background:#fff;border-radius:14px;padding:10px 6px;text-align:center;box-shadow:0 2px 8px rgba(120,80,0,.1);font-size:12px;color:#7a6440}' +
  '.fm-sum b{display:block;font-size:16px;font-variant-numeric:tabular-nums}' +
  '.fm-log{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px dashed #eadfc0;font-size:14px}.fm-log .e{font-size:24px;font-family:' + EF + ';width:30px;text-align:center}.fm-log .t{flex:1;min-width:0}.fm-log small{display:block;color:#9a8660;font-size:12px}' +
  '.fm-log .a{font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap}.fm-log .a.in{color:#15803d}.fm-log .a.out{color:#dc2626}' +
  '.fm-tb{width:100%;border-collapse:collapse;font-size:13px}.fm-tb th{text-align:left;color:#7a6440;font-weight:800;padding:6px 4px;border-bottom:2px solid #eadfc0}.fm-tb td{padding:7px 4px;border-bottom:1px solid #f1e8cf;font-variant-numeric:tabular-nums}.fm-tb td.e{font-family:' + EF + ';font-size:20px;width:30px}.fm-tb .g{color:#15803d;font-weight:800}' +
  '.fm-sheet{position:absolute;inset:0;z-index:5;display:none;background:rgba(20,30,10,.45);align-items:flex-end;justify-content:center}.fm-sheet.on{display:flex}' +
  '.fm-sb{width:100%;max-width:560px;max-height:84%;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#fffdf5;border-radius:22px 22px 0 0;padding:14px 14px max(16px,env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.3);animation:fmUp .22s ease-out}' +
  '@keyframes fmUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
  '.fm-seed{display:flex;align-items:center;gap:10px;width:100%;border:2px solid #eadfc0;background:#fff;border-radius:16px;padding:9px 10px;margin-bottom:8px;text-align:left}' +
  '.fm-seed.on{border-color:#f59e0b;background:#fff7d1}.fm-seed:disabled{opacity:.5}.fm-seed .e{font-size:34px;font-family:' + EF + ';width:42px;text-align:center}.fm-seed .tx{flex:1;min-width:0}.fm-seed b{font-size:16px}' +
  '.fm-seed small{display:block;font-size:12px;color:#7a6440;line-height:1.45}.fm-seed .pr{text-align:right;font-weight:900;font-size:14px;color:#15803d;white-space:nowrap}.fm-seed .pr small{color:#9a8660;font-weight:700}' +
  '.fm-modal{text-align:center}.fm-modal .big{font-size:64px;font-family:' + EF + ';line-height:1.2}.fm-modal h2{margin:4px 0 6px;color:#5b3a12}.fm-modal p{color:#6b5a3a;line-height:1.55;margin:6px 0}' +
  '.fm-ul{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}.fm-ul span{background:#fff;border:2px solid #f3d98b;border-radius:14px;padding:6px 10px;font-weight:800}.fm-ul span i{font-style:normal;font-family:' + EF + ';font-size:22px;vertical-align:-3px;margin-right:4px}' +
  '.fm-guide{text-align:left;margin:8px 0;padding:0;list-style:none}.fm-guide li{display:flex;gap:10px;align-items:flex-start;margin:8px 0;line-height:1.5;color:#4a3a20}.fm-guide li i{font-style:normal;font-family:' + EF + ';font-size:24px}' +
  '.fm-toast{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:rgba(36,54,26,.92);color:#fff;padding:9px 16px;border-radius:18px;font-size:14px;font-weight:700;z-index:6;pointer-events:none;max-width:92%;text-align:center;transition:opacity .25s;opacity:0}.fm-toast.on{opacity:1}' +
  '.fm-seg{position:sticky;top:-12px;z-index:3;display:flex;background:#5b3a12;border-radius:16px;padding:5px;gap:5px;margin:-4px 0 12px;box-shadow:0 0 0 6px #fdf6e3,0 6px 14px rgba(60,30,0,.35)}.fm-seg button{flex:1;border:0;border-radius:12px;padding:11px 4px;font-weight:900;font-size:15px;background:none;color:#fde9b8!important;position:relative;white-space:nowrap}.fm-seg button.on{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff!important;box-shadow:0 3px 8px rgba(0,0,0,.3)}' +
  '.fm-seg .dot{display:inline-block;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;line-height:18px;padding:0 5px;margin-left:4px}' +
  '.fm-ic{flex:none;width:52px;height:52px;border-radius:14px;background:#f6f0de;display:flex;align-items:center;justify-content:center;font-size:30px;font-family:' + EF + '}' +
  '.fm-li{display:flex;gap:10px;align-items:flex-start}.fm-li .bd{flex:1;min-width:0}.fm-li b.t{display:block;font-size:15px;color:#4a3416;line-height:1.35}.fm-li small{display:block;font-size:12.5px;color:#7a6440;line-height:1.45;margin-top:2px}' +
  '.fm-pb{height:10px;border-radius:6px;background:#efe6cc;overflow:hidden;margin:7px 0 3px}.fm-pb i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#a3e635);border-radius:6px}' +
  '.fm-pt{font-size:12.5px;font-weight:800;color:#5b3a12}' +
  '.fm-card.done{background:#f0fdf4;box-shadow:0 0 0 2px #86efac}.fm-card.lock{opacity:.6}.fm-card.hot{box-shadow:0 0 0 2px #f59e0b,0 2px 8px rgba(120,80,0,.12)}' +
  '.fm-tag{display:inline-block;background:#fef3c7;color:#92400e;border-radius:8px;padding:2px 7px;font-size:11.5px;font-weight:800;margin:4px 4px 0 0}.fm-tag.g{background:#dcfce7;color:#166534}.fm-tag.b{background:#dbeafe;color:#1e40af}' +
  '.fm-hero{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;border-radius:18px;padding:14px;margin-bottom:12px;box-shadow:0 4px 14px rgba(234,88,12,.3)}.fm-hero b{font-size:17px}.fm-hero p{margin:6px 0 0;font-size:13.5px;line-height:1.5;opacity:.95}' +
  '.fm-wtabs{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:4px -12px 10px;padding:4px 12px 6px;position:sticky;top:-12px;z-index:2;background:linear-gradient(180deg,#fef9e7 80%,rgba(254,249,231,0))}.fm-wtabs::-webkit-scrollbar{display:none}' +
  '.fm-wtabs button{flex:none;position:relative;display:flex;flex-direction:column;align-items:center;gap:0;min-width:72px;border:2px solid #eadfc0;background:#fff;border-radius:14px;padding:4px 10px;font-weight:800;font-size:11.5px;color:#5b3a12!important;white-space:nowrap}' +
  '.fm-wtabs .wb{display:block;margin-top:2px;font-size:11px;font-weight:700;opacity:.85;font-variant-numeric:tabular-nums}.fm-wtabs .wb b{font-size:12.5px;font-weight:900}.fm-wtabs button .e{font-size:21px;line-height:1.15;font-family:' + EF + '}.fm-wtabs button.on{border-color:var(--wc);background:var(--wc);color:#fff!important;box-shadow:0 3px 10px rgba(0,0,0,.18)}' +
  '.fm-wtabs .dot{position:absolute;top:-6px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;line-height:18px;padding:0 5px;border:2px solid #fff}' +
  '.fm-whead{background:#fff;border-radius:14px;padding:9px 12px;margin-bottom:6px;border-left:6px solid var(--wc);box-shadow:0 2px 8px rgba(120,80,0,.12)}.fm-whead summary{cursor:pointer;list-style:none;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}.fm-whead summary::-webkit-details-marker{display:none}.fm-whead summary>b{font-size:16px;color:#4a3416}.fm-whead summary:after{content:"ⓘ";margin-left:auto;color:#9a8660}.fm-whead p{margin:6px 0 0;font-size:13px;line-height:1.5;color:#6b5a3a}.fm-whead p.q{font-style:italic;color:#9a8660;font-size:12.5px}' +
  '.fm-wst{font-size:12px;color:#7a6440}.fm-wst b{font-variant-numeric:tabular-nums}' +
  '.fm-h2{font-size:15px;font-weight:900;color:#5b3a12;margin:12px 2px 8px}.fm-goal{display:block;width:100%;text-align:left;border:0;border-radius:14px;padding:8px 12px;margin-bottom:8px;background:linear-gradient(135deg,#fffbeb,#fef3c7);box-shadow:0 0 0 2px #fcd34d}.fm-goal .t{display:block;font-weight:800;font-size:13px;color:#5b3a12;line-height:1.35}.fm-goal .fm-pb{display:block;margin:5px 0 3px;height:8px}.fm-goal .s{font-size:11.5px;color:#7a6440}' +
  '.fm-done{background:#fff;border-radius:14px;padding:8px 12px;margin-top:10px}.fm-done summary{font-weight:800;color:#166534;cursor:pointer;padding:4px 0}' +
  '.fm-jar{display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:8px 10px;margin-bottom:7px;border-left:5px solid var(--wc);box-shadow:0 2px 6px rgba(120,80,0,.1)}.fm-jar .e{font-size:26px;font-family:' + EF + '}.fm-jar .t{flex:1;min-width:0}.fm-jar .t b{display:block;font-size:14.5px;color:#4a3416}.fm-jar small{font-size:11.5px;color:#9a8660}' +
  '.fm-jar .bar{display:block;height:6px;border-radius:3px;background:#f1e8cf;margin-top:4px;overflow:hidden}.fm-jar .bar i{display:block;height:100%;background:var(--wc)}.fm-jar .v{font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;color:#4a3416}.fm-jar .fm-btn{padding:6px 9px}' +
  '.fm-in{font:inherit;font-size:16px;border:2px solid #eadfc0;border-radius:10px;padding:7px 9px;background:#fffdf5;color:#3b2a14;width:100%}.fm-jar .fm-in{width:68px;text-align:right;padding:5px 7px}.fm-lb{display:block;font-size:12.5px;font-weight:800;color:#7a6440;margin:8px 0 4px}' +
  '.fm-def{background:#ecfccb;border:2px solid #84cc16;border-radius:16px;padding:10px 10px 2px;margin-bottom:10px}.fm-def>b{display:block;color:#365314;font-size:15px}.fm-def>small{display:block;color:#4d7c0f;font-size:12px;margin:2px 0 8px}' +
  '.fm-fix{background:#fee2e2;border:2px solid #f87171;border-radius:16px;padding:10px 10px 2px;margin-bottom:10px}.fm-fix>b{display:block;color:#991b1b;font-size:15px}.fm-fix>small{display:block;color:#b91c1c;font-size:12px;margin:2px 0 8px}' +
  '.fm-earnlist{text-align:left;margin:10px 0;padding:0;list-style:none}.fm-earnlist li{display:flex;justify-content:space-between;gap:8px;padding:7px 4px;border-bottom:1px dashed #eadfc0;font-weight:700;color:#4a3a20}.fm-earnlist li b{color:#15803d}';
  document.head.appendChild(st);

  /* ================= KHUNG GIAO DIỆN ================= */
  var ov = document.createElement('div'); ov.id = 'fmOv';
  ov.innerHTML = '' +
    '<div class="fm-top"><button class="fm-ib" data-a="back" aria-label="Quay lại">←</button>' +
      '<div class="fm-lv"><div class="fm-badge" id="fmLv">1</div><div class="fm-xp"><small id="fmXpT"></small><div class="fm-xpb"><i id="fmXp"></i></div></div></div>' +
      '<button class="fm-money" id="fmM" data-a="jars" aria-label="6 ví của nông trại">💰 0đ</button><button class="fm-ib" data-a="close" aria-label="Đóng">✕</button></div>' +
    '<div class="fm-wbar" id="fmWB"></div>' +
    '<div class="fm-main" id="fmMain">' +
      '<div class="fm-stage" id="fmStage"><canvas id="fmCv"></canvas>' +
        '<div class="fm-zoom" id="fmZoom"><button data-a="zin" aria-label="Phóng to">＋</button><button data-a="zout" aria-label="Thu nhỏ">－</button><button data-a="zhome" aria-label="Về giữa nông trại">🏠</button></div>' +
        '<div class="fm-tools" id="fmTools">' +
          '<button class="fm-tool on" data-a="tool" data-t="seed"><span class="e" id="fmSeedE">🌾</span><span id="fmSeedN">Gieo hạt</span></button>' +
          '<button class="fm-tool" id="fmWA" data-a="waterAll"><span class="e">🪣</span>Tưới hết</button>' +
          '<button class="fm-tool" data-a="tool" data-t="fert"><span class="e" id="fmFertE">🧪</span>Phân bón ▾<span class="n" id="fmFert">0</span></button>' +
          '<button class="fm-tool" data-a="harvestAll"><span class="e">🧺</span>Thu hết</button>' +
        '</div></div>' +
      '<div class="fm-panel" id="fmP_build"></div><div class="fm-panel" id="fmP_market"></div><div class="fm-panel" id="fmP_quest"></div><div class="fm-panel" id="fmP_earn"></div><div class="fm-panel" id="fmP_book"></div>' +
      '<div class="fm-sheet" id="fmSheet"><div class="fm-sb" id="fmSB"></div></div>' +
      '<div class="fm-toast" id="fmToast"></div>' +
    '</div>' +
    '<div class="fm-nav" id="fmNav"><div class="fm-navs" id="fmNavS">' +
      '<button class="on" data-a="tab" data-t="field"><span class="e">🌱</span>Ruộng</button>' +
      '<button data-a="tab" data-t="barn"><span class="e">🐔</span>Chuồng<span class="dot" id="fmDotB" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="build"><span class="e">🏗️</span>Xây<span class="dot" id="fmDotK" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="market"><span class="e">🏪</span>Chợ<span class="dot" id="fmDotO" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="quest"><span class="e">🎯</span>Nhiệm vụ<span class="dot" id="fmDotQ" style="display:none"></span></button>' +
      '<button class="earn" data-a="tab" data-t="earn"><span class="e">🎮</span>Phụ bản</button>' +
      '<button data-a="book"><span class="e">📒</span>Sổ thu chi</button>' +
    '</div></div>';
  document.body.appendChild(ov);

  var $ = function (id) { return document.getElementById(id); };
  var cv = $('fmCv'), ctx = cv.getContext('2d'), stage = $('fmStage');
  var tab = 'field', tool = 'seed', W = 0, H = 0, DPR = 2, raf = 0, running = false, tm = 0, lastSave = 0, lastPanel = 0;
  var FX = [], FL = [], TIP = null, HITS = [], POS = {}, mSub = 'ord', retTab = 'earn', facSig = '';

  /* ================= BỐ CỤC & CAMERA =================
     Ruộng và Chuồng là 2 "bản đồ" lớn hơn màn hình. Camera (x, y = góc trên-trái, z = độ phóng) quyết định phần nào hiện ra.
     Kéo 1 ngón để di chuyển, chụm/mở 2 ngón (hoặc lăn chuột) để thu nhỏ/phóng to. */
  var L = { hd: HD, gap: 5, pens: [] };
  var WORLD = { field: { w: FW, h: FH }, barn: { w: 400, h: 600 } };
  var CAMS = { field: null, barn: null }, cam = null, CANIM = null, INERT = null, barnCols = 0;
  var PW = 340, PH = 210, PG = 22;
  function resize() {
    var r = stage.getBoundingClientRect();
    W = Math.max(240, r.width); H = Math.max(300, r.height);
    DPR = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    penLayout();
    ['field', 'barn'].forEach(function (k) { if (CAMS[k]) clampCam(CAMS[k], k); });
    useCam();
  }
  function penLayout() {
    L.pens = []; for (var i = 0; i < NLOT; i++) { var c = i % BCOLS, r = Math.floor(i / BCOLS); L.pens.push({ i: i, x: 20 + c * (PW + PG), y: HD + 10 + r * (PH + PG), w: PW, h: PH }); }
    WORLD.barn = { w: 40 + BCOLS * PW + (BCOLS - 1) * PG, h: HD + 10 + Math.ceil(NLOT / BCOLS) * (PH + PG) + 10 };
  }
  function bottomPad(k) { return k === 'field' ? 84 : 12; }
  function minZ(k) { var Wd = WORLD[k]; return Math.max(0.3, Math.min(W / (Wd.w + 40), (H - bottomPad(k)) / (Wd.h + 20))); }
  var MAXZ = 2.6;
  function clampCam(c, k) {
    var Wd = WORLD[k], m = 30;
    c.z = Math.max(minZ(k), Math.min(MAXZ, c.z));
    var vw = W / c.z, vh = H / c.z, bp = bottomPad(k) / c.z;
    if (vw >= Wd.w + 2 * m) c.x = (Wd.w - vw) / 2; else c.x = Math.max(-m, Math.min(Wd.w + m - vw, c.x));
    if (vh >= Wd.h + m + bp) c.y = (Wd.h + m + bp - vh) / 2 - 0; else c.y = Math.max(0, Math.min(Wd.h + m + bp - vh, c.y));
    return c;
  }
  function homeCam(k) {
    var c;
    if (k === 'field') {
      // Khung nhìn ban đầu: ngôi nhà + ruộng chính vừa khít màn hình (giống bản cũ)
      var rx0 = MX - 24, rw = CW * COLS + 48, ry0 = 40, rh = MY + CW * MAXROWS + 16 - ry0;
      var z = Math.min(1.9, (W - 12) / rw, (H - bottomPad(k) - 4) / rh);
      c = { z: z, x: rx0 + rw / 2 - W / z / 2, y: ry0 + rh / 2 - (H - bottomPad(k)) / z / 2 };
    } else {
      var z2 = Math.max(minZ(k), Math.min(1.15, (W - 12) / (PW + 40), (W - 12) / WORLD.barn.w * (W >= 900 ? 1 : 3)));
      c = { z: z2, x: W >= 900 ? WORLD.barn.w / 2 - W / z2 / 2 : 20 + PW / 2 - W / z2 / 2, y: 0 };
    }
    return clampCam(c, k);
  }
  function useCam() { if (!W || (tab !== 'field' && tab !== 'barn')) return; if (!CAMS[tab]) CAMS[tab] = homeCam(tab); cam = CAMS[tab]; }
  function toWorld(p) { return { x: cam.x + p.x / cam.z, y: cam.y + p.y / cam.z }; }
  function zoomAt(sx, sy, f) {
    if (!cam) return; INERT = null; CANIM = null;
    var w = toWorld({ x: sx, y: sy }); cam.z = Math.max(minZ(tab), Math.min(MAXZ, cam.z * f));
    cam.x = w.x - sx / cam.z; cam.y = w.y - sy / cam.z; clampCam(cam, tab);
  }
  /* Bay camera tới một điểm (dùng khi vừa mở khoá đất/chuồng mới) */
  function flyTo(k, wx, wy, z) {
    if (!CAMS[k]) CAMS[k] = homeCam(k);
    var c = CAMS[k], tz = Math.max(minZ(k), Math.min(MAXZ, z || c.z));
    var to = clampCam({ z: tz, x: wx - W / tz / 2, y: wy - (H - bottomPad(k)) / tz / 2 }, k);
    CANIM = { k: k, from: { x: c.x, y: c.y, z: c.z }, to: to, t: 0 };
  }
  function stepCam(dt) {
    if (CANIM) {
      var c = CAMS[CANIM.k]; CANIM.t = Math.min(1, CANIM.t + dt / 0.6); var e = 1 - Math.pow(1 - CANIM.t, 3);
      c.x = CANIM.from.x + (CANIM.to.x - CANIM.from.x) * e; c.y = CANIM.from.y + (CANIM.to.y - CANIM.from.y) * e; c.z = CANIM.from.z + (CANIM.to.z - CANIM.from.z) * e;
      if (CANIM.t >= 1) CANIM = null;
    } else if (INERT && cam) {
      cam.x -= INERT.vx * dt / cam.z; cam.y -= INERT.vy * dt / cam.z;
      var k = Math.exp(-dt * 5); INERT.vx *= k; INERT.vy *= k;
      var ox = cam.x, oy = cam.y; clampCam(cam, tab);
      if (ox !== cam.x) INERT.vx = 0; if (oy !== cam.y) INERT.vy = 0;
      if (Math.abs(INERT.vx) + Math.abs(INERT.vy) < 8) INERT = null;
    }
  }
  function view() { return { x0: cam.x, y0: cam.y, x1: cam.x + W / cam.z, y1: cam.y + H / cam.z }; }
  function vis(v, x, y, w, h) { return x + w >= v.x0 && x <= v.x1 && y + h >= v.y0 && y <= v.y1; }

  /* Ô đất: 0..34 là ruộng chính (5 cột × 7 hàng), sau đó lần lượt là các cánh đồng mở rộng */
  function fieldOf(i) { for (var k = FIELDS.length - 1; k >= 0; k--) if (i >= FIELDS[k].i0) return FIELDS[k]; return null; }
  function plotRect(i) {
    var g = L.gap, f = i >= MAIN ? fieldOf(i) : null, x0 = f ? f.x : MX, y0 = f ? f.y : MY, cols = f ? f.c : COLS, j = f ? i - f.i0 : i;
    var c = j % cols, r = Math.floor(j / cols);
    return { x: x0 + c * CW + g / 2, y: y0 + r * CW + g / 2, s: CW - g };
  }
  function fieldOpen(f) { return !!S.fx[f.id]; }
  function plotOpen(i) { if (i < 0 || i >= TOTAL) return false; if (i < MAIN) return Math.floor(i / COLS) < S.rows; return fieldOpen(fieldOf(i)); }

  /* ================= VẼ NỀN (lưu sẵn để nhẹ máy) ================= */
  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function emo(c, ch, x, y, s) { c.font = Math.round(s) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(ch, x, y); }
  function drawSky(c, kind, v) {
    var hd = HD, W = WORLD[kind].w, X0 = Math.min(0, v.x0) - 2, X1 = Math.max(W, v.x1) + 2, Y0 = Math.min(0, v.y0) - 2;
    var g = c.createLinearGradient(0, 0, 0, hd); g.addColorStop(0, '#7cc8f5'); g.addColorStop(1, '#d6f0ff');
    c.fillStyle = '#7cc8f5'; c.fillRect(X0, Y0, X1 - X0, -Y0 + 1);
    c.fillStyle = g; c.fillRect(X0, 0, X1 - X0, hd + 2);
    var sx = W - 40, sy = hd * 0.32, sg = c.createRadialGradient(sx, sy, 4, sx, sy, 42);
    sg.addColorStop(0, 'rgba(255,240,150,1)'); sg.addColorStop(0.4, 'rgba(255,214,90,.85)'); sg.addColorStop(1, 'rgba(255,214,90,0)');
    c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, 42, 0, 7); c.fill();
    c.fillStyle = '#ffd54a'; c.beginPath(); c.arc(sx, sy, 15, 0, 7); c.fill();
    c.fillStyle = '#9ed27a'; c.beginPath(); c.moveTo(X0, hd); c.lineTo(X0, hd * 0.7); c.lineTo(0, hd * 0.7); c.quadraticCurveTo(W * 0.18, hd * 0.45, W * 0.42, hd * 0.8); c.quadraticCurveTo(W * 0.62, hd * 0.5, W * 0.85, hd * 0.75); c.quadraticCurveTo(W * 0.95, hd * 0.6, W, hd * 0.7); c.lineTo(X1, hd * 0.7); c.lineTo(X1, hd); c.fill();
    c.fillStyle = '#86c35f'; c.beginPath(); c.moveTo(X0, hd + 2); c.lineTo(X0, hd * 0.88); c.lineTo(0, hd * 0.88); c.quadraticCurveTo(W * 0.3, hd * 0.7, W * 0.6, hd * 0.92); c.quadraticCurveTo(W * 0.8, hd * 0.75, W, hd * 0.88); c.lineTo(X1, hd * 0.88); c.lineTo(X1, hd + 2); c.fill();
    var R = mulberry(7), nt = Math.round(W / 60);
    for (var i = 0; i < nt; i++) { var tx = R() * W, ty = hd * (0.62 + R() * 0.22), ts = 6 + R() * 6; c.fillStyle = '#5d8f3a'; c.fillRect(tx - 1.5, ty, 3, ts * 0.9); c.fillStyle = i % 2 ? '#4f9a35' : '#5fae3f'; c.beginPath(); c.arc(tx, ty, ts, 0, 7); c.fill(); }
    if (kind === 'field') {
      var hs = 66, hx = MX + 60;
      house(c, hx, hd - 4, hs);
      if (built('gieng')) well(c, hx + hs * 0.95, hd - 3, hs * 0.58);
      if (built('coixay')) { L.mill = { x: MX + 250, y: hd - 3, s: hs * 0.9 }; millBase(c, L.mill.x, L.mill.y, L.mill.s); } else L.mill = null;
    } else barn(c, W / 2, hd - 4, 84);
  }
  function house(c, x, by, s) {
    c.save(); c.translate(x, by);
    var lvH = built('nha3') ? 3 : built('nha2') ? 2 : 1;
    c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(0, 0, s * 0.7, s * 0.09, 0, 0, 7); c.fill();
    if (lvH === 3) {
      // biệt thự 2 tầng
      c.fillStyle = '#fffaf0'; c.fillRect(-s * 0.55, -s * 0.9, s * 1.1, s * 0.9);
      c.strokeStyle = '#d6c3a0'; c.lineWidth = 1.5; c.strokeRect(-s * 0.55, -s * 0.9, s * 1.1, s * 0.9);
      c.fillStyle = '#1e40af'; c.beginPath(); c.moveTo(-s * 0.66, -s * 0.86); c.lineTo(0, -s * 1.22); c.lineTo(s * 0.66, -s * 0.86); c.closePath(); c.fill();
      c.fillStyle = '#d1d5db'; c.fillRect(-s * 0.55, -s * 0.47, s * 1.1, s * 0.05);
      c.fillStyle = '#7fd3ff'; [-0.4, -0.08, 0.24].forEach(function (k) { c.fillRect(s * k, -s * 0.78, s * 0.16, s * 0.2); c.fillRect(s * k, -s * 0.36, s * 0.16, s * 0.16); });
      c.fillStyle = '#8d5a2b'; rr(c, -s * 0.09, -s * 0.3, s * 0.18, s * 0.3, 3); c.fill();
      c.fillStyle = '#e5e7eb'; c.fillRect(-s * 0.5, -s * 0.05, s * 1.0, s * 0.05);
    } else {
      c.fillStyle = lvH === 2 ? '#c0583f' : '#fff3d6'; c.fillRect(-s * 0.42, -s * 0.55, s * 0.84, s * 0.55);
      if (lvH === 2) { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; for (var yy = -s * 0.5; yy < 0; yy += s * 0.09) { c.beginPath(); c.moveTo(-s * 0.42, yy); c.lineTo(s * 0.42, yy); c.stroke(); } }
      c.strokeStyle = lvH === 2 ? '#8e3a28' : '#c9a66b'; c.lineWidth = 1.5; c.strokeRect(-s * 0.42, -s * 0.55, s * 0.84, s * 0.55);
      c.fillStyle = lvH === 2 ? '#374151' : '#d84b3c'; c.beginPath(); c.moveTo(-s * 0.55, -s * 0.52); c.lineTo(0, -s * 0.98); c.lineTo(s * 0.55, -s * 0.52); c.closePath(); c.fill();
      c.fillStyle = lvH === 2 ? '#1f2937' : '#b8382b'; c.fillRect(-s * 0.55, -s * 0.55, s * 1.1, s * 0.06);
      c.fillStyle = '#8d5a2b'; rr(c, -s * 0.1, -s * 0.32, s * 0.2, s * 0.32, 3); c.fill();
      c.fillStyle = '#7fd3ff'; c.fillRect(-s * 0.33, -s * 0.42, s * 0.16, s * 0.14); c.fillRect(s * 0.17, -s * 0.42, s * 0.16, s * 0.14);
      c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.strokeRect(-s * 0.33, -s * 0.42, s * 0.16, s * 0.14); c.strokeRect(s * 0.17, -s * 0.42, s * 0.16, s * 0.14);
      c.fillStyle = '#9a6b4a'; c.fillRect(s * 0.22, -s * 0.95, s * 0.1, s * 0.22);
    }
    if (built('them')) {
      // thềm gỗ trước nhà
      c.fillStyle = '#9a6235'; rr(c, -s * 0.7, -s * 0.06, s * 1.4, s * 0.16, 3); c.fill();
      c.fillStyle = '#c08a55'; rr(c, -s * 0.7, -s * 0.06, s * 1.4, s * 0.07, 3); c.fill();
      c.strokeStyle = '#6b4226'; c.lineWidth = 1; for (var k = -0.56; k <= 0.6; k += 0.14) { c.beginPath(); c.moveTo(s * k, -s * 0.06); c.lineTo(s * k, s * 0.1); c.stroke(); }
      c.fillStyle = '#b07a4c'; c.fillRect(-s * 0.16, s * 0.1, s * 0.32, s * 0.06);
      [-0.6, 0.6].forEach(function (k) { c.fillStyle = '#b45309'; c.beginPath(); c.moveTo(s * k - 5, -s * 0.06); c.lineTo(s * k + 5, -s * 0.06); c.lineTo(s * k + 4, -s * 0.06 - 8); c.lineTo(s * k - 4, -s * 0.06 - 8); c.fill(); [['#ef4444', -3], ['#facc15', 0], ['#ec4899', 3]].forEach(function (f) { c.fillStyle = f[0]; c.beginPath(); c.arc(s * k + f[1], -s * 0.06 - 11 - Math.abs(f[1]) * 0.3, 3, 0, 7); c.fill(); }); });
    }
    c.restore();
  }
  function well(c, x, by, s) {
    c.save(); c.translate(x, by);
    c.fillStyle = '#9ca3af'; rr(c, -s * 0.45, -s * 0.38, s * 0.9, s * 0.38, 4); c.fill();
    c.strokeStyle = '#6b7280'; c.lineWidth = 1; c.beginPath(); c.moveTo(-s * 0.45, -s * 0.2); c.lineTo(s * 0.45, -s * 0.2); c.stroke();
    c.fillStyle = '#7a5032'; c.fillRect(-s * 0.42, -s * 1.0, s * 0.08, s * 0.62); c.fillRect(s * 0.34, -s * 1.0, s * 0.08, s * 0.62);
    c.fillStyle = '#b8382b'; c.beginPath(); c.moveTo(-s * 0.6, -s * 0.95); c.lineTo(0, -s * 1.3); c.lineTo(s * 0.6, -s * 0.95); c.closePath(); c.fill();
    c.restore();
  }
  function millBase(c, x, by, s) {
    c.save(); c.translate(x, by);
    c.fillStyle = 'rgba(0,0,0,.14)'; c.beginPath(); c.ellipse(0, 0, s * 0.35, s * 0.06, 0, 0, 7); c.fill();
    c.fillStyle = '#f5f5f4'; c.beginPath(); c.moveTo(-s * 0.22, 0); c.lineTo(-s * 0.12, -s * 0.95); c.lineTo(s * 0.12, -s * 0.95); c.lineTo(s * 0.22, 0); c.closePath(); c.fill();
    c.strokeStyle = '#a8a29e'; c.lineWidth = 1.2; c.stroke();
    c.fillStyle = '#8d5a2b'; rr(c, -s * 0.06, -s * 0.22, s * 0.12, s * 0.22, 2); c.fill();
    c.restore();
  }
  function millBlades() {
    if (!L.mill) return; var m = L.mill, s = m.s, cx = m.x, cy = m.y - s * 0.95;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(tm * 1.2);
    for (var k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.rect(s * 0.04, -s * 0.06, s * 0.5, s * 0.12); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = '#92400e'; ctx.beginPath(); ctx.arc(0, 0, s * 0.05, 0, 7); ctx.fill(); ctx.restore();
  }
  function barn(c, x, by, s) {
    c.save(); c.translate(x, by);
    c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(0, 0, s * 0.75, s * 0.08, 0, 0, 7); c.fill();
    c.fillStyle = '#c0392b'; c.beginPath(); c.moveTo(-s * 0.55, 0); c.lineTo(-s * 0.55, -s * 0.5); c.lineTo(0, -s * 0.85); c.lineTo(s * 0.55, -s * 0.5); c.lineTo(s * 0.55, 0); c.closePath(); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = '#6d2a20'; c.beginPath(); c.moveTo(-s * 0.62, -s * 0.47); c.lineTo(0, -s * 0.9); c.lineTo(s * 0.62, -s * 0.47); c.lineTo(s * 0.58, -s * 0.42); c.lineTo(0, -s * 0.82); c.lineTo(-s * 0.58, -s * 0.42); c.closePath(); c.fill();
    c.fillStyle = '#8e2b20'; rr(c, -s * 0.2, -s * 0.38, s * 0.4, s * 0.38, 2); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(-s * 0.2, -s * 0.38, s * 0.4, s * 0.38);
    c.beginPath(); c.moveTo(-s * 0.2, -s * 0.38); c.lineTo(s * 0.2, 0); c.moveTo(s * 0.2, -s * 0.38); c.lineTo(-s * 0.2, 0); c.stroke();
    c.fillStyle = '#ffe9a8'; c.beginPath(); c.arc(0, -s * 0.6, s * 0.08, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.stroke();
    c.fillStyle = '#b0bec5'; rr(c, s * 0.62, -s * 0.78, s * 0.24, s * 0.78, 6); c.fill(); c.fillStyle = '#90a4ae'; c.beginPath(); c.arc(s * 0.74, -s * 0.78, s * 0.12, Math.PI, 0); c.fill();
    c.restore();
  }
  /* Cỏ: vẽ 1 viên gạch cỏ rồi lát kín bản đồ (nhẹ máy khi kéo/zoom) */
  var grassPat = null;
  function grassTile() {
    var T = 160, k = 2, t = document.createElement('canvas'); t.width = T * k; t.height = T * k;
    var c = t.getContext('2d'); c.scale(k, k);
    c.fillStyle = '#6fb84c'; c.fillRect(0, 0, T, T);
    var R = mulberry(11);
    for (var i = 0; i < 120; i++) {
      var x = R() * T, y = R() * T, s = 3 + R() * 4;
      c.strokeStyle = R() < 0.5 ? 'rgba(46,110,30,.45)' : 'rgba(190,240,140,.5)'; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(x - s * 0.5, y - s); c.lineTo(x, y); c.lineTo(x + s * 0.5, y - s); c.stroke();
    }
    for (i = 0; i < 9; i++) { x = 4 + R() * (T - 8); y = 4 + R() * (T - 8); c.fillStyle = ['#fff', '#ffe066', '#ffb3c7', '#c7a6ff'][Math.floor(R() * 4)]; c.beginPath(); c.arc(x, y, 1.8 + R(), 0, 7); c.fill(); c.fillStyle = '#ffcc33'; c.beginPath(); c.arc(x, y, 0.8, 0, 7); c.fill(); }
    var p = ctx.createPattern(t, 'repeat');
    try { p.setTransform(new DOMMatrix([1 / k, 0, 0, 1 / k, 0, 0])); } catch (e) { p = ctx.createPattern((function () { var u = document.createElement('canvas'); u.width = T; u.height = T; u.getContext('2d').drawImage(t, 0, 0, T, T); return u; })(), 'repeat'); }
    return p;
  }
  function ground(v) {
    if (!grassPat) grassPat = grassTile();
    ctx.fillStyle = grassPat; ctx.fillRect(v.x0 - 2, Math.max(HD, v.y0 - 2), v.x1 - v.x0 + 4, v.y1 - Math.max(HD, v.y0) + 4);
  }
  function fence(c, x, y, w, h) {
    var post = function (px, py) { c.fillStyle = '#9b6a3c'; rr(c, px - 3, py - 10, 6, 14, 2); c.fill(); c.fillStyle = '#c08a55'; c.fillRect(px - 3, py - 10, 2, 12); };
    c.strokeStyle = '#a8743f'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x + w, y - 6); c.moveTo(x, y + h - 2); c.lineTo(x + w, y + h - 2); c.moveTo(x, y); c.lineTo(x, y + h); c.moveTo(x + w, y); c.lineTo(x + w, y + h); c.stroke();
    for (var px = x; px <= x + w + 0.5; px += Math.max(22, w / Math.round(w / 28))) { post(px, y - 2); post(px, y + h + 2); }
    for (var py = y + 28; py < y + h - 10; py += 28) { post(x, py); post(x + w, py); }
  }
  /* Cây xanh trang trí và đường đất nối các cánh đồng (tính 1 lần) */
  var TREES = (function () {
    var R = mulberry(5), out = [], boxes = [[MX - 30, MY - 30, CW * COLS + 60, CW * MAXROWS + 50], [MX - 40, 60, 360, 120]];
    FIELDS.forEach(function (f) { boxes.push([f.x - 34, f.y - 50, f.w + 68, f.h + 84]); });
    LOTS.forEach(function (id) { var P = BPOS[id]; boxes.push([P.x - 85, P.y - 150, 170, 185]); });
    boxes.push([10, 1050, 110, 150], [915, 1050, 110, 150]);
    for (var n = 0; n < 400 && out.length < 46; n++) {
      var x = 10 + R() * (FW - 20), y = HD + 20 + R() * (FH - HD - 30), s = 10 + R() * 9, ok = true;
      boxes.forEach(function (b) { if (x > b[0] - s && x < b[0] + b[2] + s && y > b[1] - s && y < b[1] + b[3] + s) ok = false; });
      out.forEach(function (t) { if (Math.abs(t.x - x) < 30 && Math.abs(t.y - y) < 30) ok = false; });
      if (ok) out.push({ x: x, y: y, s: s, k: R() < 0.25 ? 1 : 0 });
    }
    return out.sort(function (a, b) { return a.y - b.y; });
  })();
  var PATHS = [[MX - 12, MY + 260, 286, 358], [MX + CW * COLS + 12, MY + 260, 746, 358], [MX + 160, MY + CW * MAXROWS + 8, MX + 160, 700], [MX + 160, 892, MX + 160, 960]];
  function drawFieldWorld(v) {
    ground(v); drawSky(ctx, 'field', v);
    ctx.lineCap = 'round';
    PATHS.forEach(function (p) { ctx.strokeStyle = '#c9a46a'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[2], p[3]); ctx.stroke(); ctx.strokeStyle = '#dcbd85'; ctx.lineWidth = 12; ctx.stroke(); });
    ctx.lineCap = 'butt';
    TREES.forEach(function (t) {
      if (!vis(v, t.x - 30, t.y - 40, 60, 60)) return;
      ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(t.x, t.y + t.s * 0.9, t.s * 0.9, t.s * 0.25, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#7a5032'; ctx.fillRect(t.x - 2.5, t.y, 5, t.s * 0.9);
      if (t.k) { ctx.fillStyle = '#2f7d32'; ctx.beginPath(); ctx.moveTo(t.x, t.y - t.s * 2); ctx.lineTo(t.x + t.s * 0.9, t.y + t.s * 0.2); ctx.lineTo(t.x - t.s * 0.9, t.y + t.s * 0.2); ctx.fill(); }
      else { ctx.fillStyle = '#3f9a35'; ctx.beginPath(); ctx.arc(t.x, t.y - t.s * 0.5, t.s, 0, 7); ctx.fill(); ctx.fillStyle = '#5fbf46'; ctx.beginPath(); ctx.arc(t.x - t.s * 0.3, t.y - t.s * 0.8, t.s * 0.5, 0, 7); ctx.fill(); }
    });
    var fw = CW * COLS, fh = CW * MAXROWS;
    ctx.fillStyle = 'rgba(160,120,70,.35)'; rr(ctx, MX - 10, MY - 10, fw + 20, fh + 20, 16); ctx.fill();
    ctx.fillStyle = 'rgba(120,85,45,.22)'; rr(ctx, MX - 5, MY - 5, fw + 10, fh + 10, 12); ctx.fill();
    fence(ctx, MX - 13, MY - 10, fw + 26, fh + 18);
    FIELDS.forEach(function (f) {
      if (!fieldOpen(f) || !vis(v, f.x - 20, f.y - 20, f.w + 40, f.h + 40)) return;
      ctx.fillStyle = 'rgba(160,120,70,.35)'; rr(ctx, f.x - 10, f.y - 10, f.w + 20, f.h + 20, 16); ctx.fill();
      fence(ctx, f.x - 13, f.y - 10, f.w + 26, f.h + 18);
    });
  }
  /* Nền mỗi chuồng (cỏ/nước) vẽ sẵn 1 lần */
  var penTex = {};
  function penTexture(a) {
    if (penTex[a.id]) return penTex[a.id];
    var k = 2, t = document.createElement('canvas'); t.width = PW * k; t.height = PH * k;
    var c = t.getContext('2d'); c.scale(k, k);
    var g = c.createLinearGradient(0, 0, 0, PH);
    if (a.water) { g.addColorStop(0, a.id === 'vit' ? '#9be7a0' : '#7dd3fc'); g.addColorStop(1, a.id === 'vit' ? '#66bb6a' : '#0284c7'); } else { g.addColorStop(0, a.grass); g.addColorStop(1, '#7cb342'); }
    c.fillStyle = g; rr(c, 0, 0, PW, PH, 16); c.fill();
    if (a.id === 'vit') { c.fillStyle = '#4fc3f7'; c.beginPath(); c.ellipse(PW * 0.62, PH * 0.62, PW * 0.3, PH * 0.24, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2; c.stroke(); }
    var R = mulberry(31 + ANIMALS.indexOf(a));
    for (var n = 0; n < PW * PH / 300; n++) {
      var x = 8 + R() * (PW - 16), y = 30 + R() * (PH - 36);
      if (a.id === 'vit' && Math.pow((x - PW * 0.62) / (PW * 0.31), 2) + Math.pow((y - PH * 0.62) / (PH * 0.25), 2) < 1) continue;
      if (a.water && a.id !== 'vit') { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 5, y); c.quadraticCurveTo(x, y - 3, x + 5, y); c.stroke(); }
      else { c.strokeStyle = 'rgba(50,110,30,.35)'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x - 2, y - 4); c.lineTo(x, y); c.lineTo(x + 2, y - 4); c.stroke(); }
    }
    if (!a.water || a.id === 'vit') { c.fillStyle = '#8d5a2b'; rr(c, PW - 64, PH - 22, 52, 14, 5); c.fill(); c.fillStyle = '#e6c56a'; rr(c, PW - 60, PH - 20, 44, 6, 3); c.fill(); }
    var stone = a.water && a.id !== 'vit';
    c.strokeStyle = stone ? '#a8a29e' : '#a8743f'; c.lineWidth = 4; rr(c, 2, 2, PW - 4, PH - 4, 15); c.stroke();
    c.strokeStyle = stone ? '#d6d3d1' : '#c99a62'; c.lineWidth = 1.5; rr(c, 6, 6, PW - 12, PH - 12, 12); c.stroke();
    return (penTex[a.id] = t);
  }
  function drawBarnWorld(v) {
    ground(v); drawSky(ctx, 'barn', v); perimeter(ctx, WORLD.barn, HD + 2);
    L.pens.forEach(function (p) {
      if (!vis(v, p.x, p.y, p.w + 4, p.h + 4)) return;
      var P = S.pens[p.i];
      if (P) { ctx.fillStyle = 'rgba(0,0,0,.10)'; rr(ctx, p.x + 2, p.y + 4, p.w, p.h, 16); ctx.fill(); ctx.drawImage(penTexture(AM[P.a]), p.x, p.y, p.w, p.h); return; }
      var open = S.lv >= LOTLV[p.i];
      ctx.fillStyle = open ? 'rgba(160,120,70,.38)' : 'rgba(60,90,40,.45)'; rr(ctx, p.x, p.y, p.w, p.h, 16); ctx.fill();
      ctx.strokeStyle = open ? '#fde68a' : 'rgba(255,255,255,.4)'; ctx.setLineDash([9, 6]); ctx.lineWidth = open ? 3 : 2; rr(ctx, p.x + 3, p.y + 3, p.w - 6, p.h - 6, 14); ctx.stroke(); ctx.setLineDash([]);
    });
  }

  /* ================= VẼ CÂY TRỒNG ================= */
  function leaf(c, x, y, len, wid, ang, col) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(wid, -len * 0.5, 0, -len); c.quadraticCurveTo(-wid, -len * 0.5, 0, 0); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -len * 0.85); c.stroke();
    c.restore();
  }
  function shade(hex, f) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; r = Math.min(255, Math.round(r * f)); g = Math.min(255, Math.round(g * f)); b = Math.min(255, Math.round(b * f)); return 'rgb(' + r + ',' + g + ',' + b + ')'; }
  function drawPlant(c, x, by, s, cr, p, i) {
    var sw = Math.sin(tm * 1.8 + i * 1.3) * 0.06;
    if (p < 0.12) {
      c.fillStyle = '#6b4423'; c.beginPath(); c.ellipse(x, by, s * 0.16, s * 0.06, 0, 0, 7); c.fill();
      c.fillStyle = '#f3e3b0'; [-1, 0, 1].forEach(function (k) { c.beginPath(); c.ellipse(x + k * s * 0.08, by - 1 + Math.abs(k), s * 0.025, s * 0.018, k * 0.5, 0, 7); c.fill(); });
      return;
    }
    if (p < 1) {
      var g = (p - 0.12) / 0.88, h = s * (0.16 + 0.36 * g), n = 2 + Math.floor(g * 4), col = cr.leaf;
      if (cr.id === 'lua') {
        for (var k = 0; k < 3 + n; k++) leaf(c, x + (k - (2 + n) / 2) * s * 0.035, by, h * (0.8 + (k % 2) * 0.25), s * 0.025, (k - (2 + n) / 2) * 0.12 + sw, k % 2 ? col : shade(col, 0.82));
      } else {
        c.strokeStyle = shade(col, 0.7); c.lineWidth = Math.max(1.5, s * 0.025); c.beginPath(); c.moveTo(x, by); c.lineTo(x + sw * h, by - h * 0.75); c.stroke();
        for (k = 0; k < n; k++) { var side = k % 2 ? 1 : -1, yy = by - h * (0.12 + 0.55 * k / n); leaf(c, x + sw * h * (k / n), yy, h * (0.55 - 0.12 * k / n), h * 0.22, side * (0.75 + 0.15 * k) + sw, k % 2 ? col : shade(col, 0.85)); }
        leaf(c, x + sw * h, by - h * 0.7, h * 0.35, h * 0.14, sw, shade(col, 1.15));
      }
      if (g > 0.55) { c.globalAlpha = Math.min(1, (g - 0.55) / 0.45) * 0.85; emo(c, cr.e, x + sw * h, by - h * 0.78, s * (0.14 + 0.16 * g)); c.globalAlpha = 1; }
      return;
    }
    var col2 = cr.leaf, bs = s * 0.5;
    for (k = 0; k < 6; k++) leaf(c, x, by, bs * (0.62 + (k % 3) * 0.1), bs * 0.26, -1.2 + k * 0.48 + sw, k % 2 ? col2 : shade(col2, 0.82));
    var bob = Math.sin(tm * 3 + i) * s * 0.02;
    c.save(); c.shadowColor = 'rgba(0,0,0,.28)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    emo(c, cr.e, x, by - s * 0.3 + bob, s * 0.5); c.restore();
  }
  /* Cây ăn quả lâu năm: lớn dần thành cây to, rồi ra quả theo mùa */
  function drawTree(c, x, by, s, cr, p, i, n) {
    var g = n ? 1 : Math.max(0.15, p), sw = Math.sin(tm * 1.5 + i) * 0.03;
    var h = s * (0.25 + 0.4 * g), r = s * (0.14 + 0.2 * g);
    c.fillStyle = '#7a5032'; c.beginPath(); c.moveTo(x - s * 0.04 * g - 1, by); c.lineTo(x - s * 0.02, by - h); c.lineTo(x + s * 0.02, by - h); c.lineTo(x + s * 0.04 * g + 1, by); c.fill();
    c.save(); c.translate(x, by - h); c.rotate(sw);
    c.fillStyle = shade(cr.leaf, 0.85); c.beginPath(); c.arc(-r * 0.5, r * 0.15, r * 0.75, 0, 7); c.arc(r * 0.5, r * 0.15, r * 0.75, 0, 7); c.fill();
    c.fillStyle = cr.leaf; c.beginPath(); c.arc(0, -r * 0.2, r, 0, 7); c.fill();
    c.fillStyle = shade(cr.leaf, 1.2); c.beginPath(); c.arc(-r * 0.3, -r * 0.5, r * 0.4, 0, 7); c.fill();
    var fr = (n || p > 0.6) ? Math.max(0, (p - 0.35) / 0.65) : 0;
    if (fr > 0) { c.globalAlpha = p >= 1 ? 1 : 0.85; [[-0.45, 0], [0.4, -0.25], [0, 0.35]].forEach(function (q, k) { if (k < 1 + Math.floor(fr * 2.99)) emo(c, cr.e, q[0] * r, q[1] * r, s * (0.1 + 0.1 * fr)); }); c.globalAlpha = 1; }
    c.restore();
  }
  function star(c, x, y, r, a) {
    c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = '#fff59d'; c.beginPath();
    for (var k = 0; k < 8; k++) { var rad = k % 2 ? r * 0.35 : r, an = k * Math.PI / 4; c.lineTo(Math.cos(an) * rad, Math.sin(an) * rad); }
    c.closePath(); c.fill(); c.restore();
  }
  function ring(c, x, y, r, p, col) {
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    c.strokeStyle = '#e5e7eb'; c.lineWidth = r * 0.34; c.beginPath(); c.arc(x, y, r * 0.66, 0, 7); c.stroke();
    c.strokeStyle = col || '#22c55e'; c.beginPath(); c.arc(x, y, r * 0.66, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); c.stroke();
  }

  /* ================= CÔNG TRÌNH TRÊN BẢN ĐỒ ================= */
  function incOf(id) {
    var b = BM[id]; if (!built(id) || !b.inc) return 0;
    if (S.dmg.bld[id] || (S.dmg.house && (id === 'them' || id === 'nha2' || id === 'nha3'))) return 0;
    var t = S.inc[id] || S.bld[id] || Date.now(), h = Math.min(INC_CAP, (Date.now() - t) / 3600000);
    return Math.floor(h * b.inc / 100) * 100;
  }
  function incFull(id) { var t = S.inc[id] || S.bld[id]; return built(id) && Date.now() - t >= INC_CAP * 3600000; }
  function collectInc(id) {
    var a = incOf(id), b = BM[id]; if (a < 1000) return 0;
    addMoney(a); S.inc[id] = Date.now(); addLog('in', a, 'inc_' + id, 'Thu nhập: ' + b.n, b.e); return a;
  }
  function canMake(b) { return b.r.i.every(function (x) { return (S.inv[x[0]] || 0) >= x[1]; }); }
  function workshop(c, P, b, done) {
    var x = P.x, by = P.y;
    c.fillStyle = 'rgba(0,0,0,.16)'; c.beginPath(); c.ellipse(x, by + 2, 72, 12, 0, 0, 7); c.fill();
    if (!done) {
      var st = bState(b);
      c.fillStyle = st === 'buy' ? 'rgba(180,120,50,.45)' : 'rgba(120,90,50,.28)'; rr(c, x - 70, by - 100, 140, 108, 14); c.fill();
      c.strokeStyle = st === 'buy' ? '#fde68a' : 'rgba(255,255,255,.55)'; c.setLineDash([7, 5]); c.lineWidth = st === 'buy' ? 3 : 2; rr(c, x - 68, by - 98, 136, 104, 12); c.stroke(); c.setLineDash([]);
      emo(c, st === 'buy' ? '🏗️' : '🔒', x, by - 66, 30);
      emo(c, b.e, x + 40, by - 80, 18);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.font = '800 13px ' + TF; c.fillText(b.n, x, by - 34, 130);
      c.font = '700 11.5px ' + TF; c.fillStyle = st === 'buy' ? '#fef3c7' : 'rgba(255,255,255,.85)';
      c.fillText(st === 'buy' ? 'Chạm để xây · ' + short(b.cost) : st === 'req' ? 'Cần ' + BM[b.req].n.toLowerCase() : 'Mở ở cấp ' + b.lv, x, by - 16, 130);
      return;
    }
    // tường + mái + cửa
    c.fillStyle = P.wall; rr(c, x - 56, by - 62, 112, 62, 4); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1.5; rr(c, x - 56, by - 62, 112, 62, 4); c.stroke();
    c.fillStyle = P.roof; c.beginPath(); c.moveTo(x - 66, by - 58); c.lineTo(x - 44, by - 98); c.lineTo(x + 44, by - 98); c.lineTo(x + 66, by - 58); c.closePath(); c.fill();
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x - 66, by - 60, 132, 5);
    if (!P.gar) { c.fillStyle = '#7a5032'; c.fillRect(x + 26, by - 112, 12, 26); }
    if (P.gar) { c.fillStyle = '#94a3b8'; rr(c, x - 44, by - 46, 88, 46, 3); c.fill(); c.strokeStyle = '#64748b'; for (var k = 1; k < 5; k++) { c.beginPath(); c.moveTo(x - 44, by - 46 + k * 9); c.lineTo(x + 44, by - 46 + k * 9); c.stroke(); } }
    else {
      c.fillStyle = '#8d5a2b'; rr(c, x - 12, by - 36, 24, 36, 3); c.fill();
      c.fillStyle = '#7fd3ff'; c.fillRect(x - 46, by - 46, 24, 18); c.fillRect(x + 22, by - 46, 24, 18);
      c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.strokeRect(x - 46, by - 46, 24, 18); c.strokeRect(x + 22, by - 46, 24, 18);
    }
    // biển hiệu
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x - 8, by - 78, 15, 0, 7); c.fill(); c.strokeStyle = P.roof; c.lineWidth = 2; c.stroke();
    emo(c, b.e, x - 8, by - 77, 19);
    if (P.gar) emo(c, '🛻', x + 44, by - 12, 34);
    c.font = '800 12px ' + TF; var tw = c.measureText(b.n).width + 16;
    c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, x - tw / 2, by + 6, tw, 20, 10); c.fill();
    c.fillStyle = '#4a3416'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b.n, x, by + 16.5);
  }
  var BHITS = [];
  function drawBuildings(v) {
    BHITS = [];
    LOTS.forEach(function (id) {
      var P = BPOS[id], b = BM[id]; if (!vis(v, P.x - 90, P.y - 160, 180, 200)) { BHITS.push({ id: id, x: P.x - 72, y: P.y - 112, w: 144, h: 140 }); return; }
      var done = built(id); workshop(ctx, P, b, done);
      BHITS.push({ id: id, x: P.x - 72, y: P.y - 112, w: 144, h: 140 });
      if (!done) return;
      var f = S.fac[id];
      if (b.r && f && f.s === 1) {
        var p = Math.min(1, (Date.now() - f.t) / (b.r.t * 1000));
        for (var k = 0; k < 3; k++) { var ph = (tm * 0.6 + k / 3) % 1; ctx.globalAlpha = 0.55 * (1 - ph); ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.arc(P.x + 32 + Math.sin(ph * 6 + k) * 4, P.y - 114 - ph * 34, 5 + ph * 8, 0, 7); ctx.fill(); }
        ctx.globalAlpha = 1; ring(ctx, P.x + 50, P.y - 84, 12, p, '#f59e0b');
      } else if (b.r && f && f.s === 2) {
        bubble(P.x - 8, P.y - 126 + Math.sin(tm * 5) * 3, 34, PRODUCTS[b.r.o].e, '#fff7d1'); star(ctx, P.x + 14, P.y - 140, 5, tm * 2);
      } else if (b.r && canMake(b)) bubble(P.x - 8, P.y - 124, 26, '▶️', '#dcfce7');
      if (S.dmg.bld[id]) leak(P.x - 8, P.y - 104);
      else coinPill(id, P.x - 46, P.y - 120);
    });
    // nhà, giếng, cối xay gió (vẽ trên đường chân trời, ở drawSky) → chỉ thêm túi tiền và vùng chạm
    var hx = BPOS.them.x, hy = BPOS.them.y;
    if (S.dmg.house) leak(hx, hy - (built('nha3') ? 92 : 76));
    var hs = ['them', 'nha2', 'nha3'].reduce(function (a, id) { return a + incOf(id); }, 0);
    if (hs >= 1000 || giftReady()) coinPill('house', hx - 30, hy - (built('nha3') ? 104 : 88), hs, giftReady());
    BHITS.push({ id: 'house', x: hx - 46, y: hy - 90, w: 92, h: 100 });
    if (built('gieng')) { coinPill('gieng', BPOS.gieng.x - 20, BPOS.gieng.y - 70); BHITS.push({ id: 'gieng', x: BPOS.gieng.x - 24, y: BPOS.gieng.y - 52, w: 48, h: 56 }); }
    if (built('coixay')) { coinPill('coixay', BPOS.coixay.x - 22, BPOS.coixay.y - 108); BHITS.push({ id: 'coixay', x: BPOS.coixay.x - 30, y: BPOS.coixay.y - 90, w: 60, h: 94 }); }
  }
  function leak(x, y) {   // mái dột: giọt nước rơi + biển cần sửa
    for (var k = 0; k < 3; k++) { var ph = (tm * 0.9 + k / 3) % 1; ctx.globalAlpha = 1 - ph; emo(ctx, '💧', x - 14 + k * 14, y + 22 + ph * 36, 12); }
    ctx.globalAlpha = 1;
    ctx.font = '800 12px ' + TF; var t = '🔧 Bị dột', w = ctx.measureText(t).width + 16;
    ctx.fillStyle = '#dc2626'; rr(ctx, x - w / 2, y - 8 + Math.sin(tm * 4) * 2, w, 22, 11); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y + 3.5 + Math.sin(tm * 4) * 2);
  }
  function coinPill(id, x, y, amt, gift) {
    if (amt == null) amt = incOf(id);
    if (amt < 1000 && !gift) return;
    var full = id !== 'house' && incFull(id), t = (gift ? '🎁 ' : '') + (amt >= 1000 ? '🪙 +' + short(amt) : 'Quà');
    ctx.font = '800 12px ' + TF; var w = ctx.measureText(t).width + 16, yy = y + Math.sin(tm * 3 + x) * 2;
    ctx.fillStyle = 'rgba(0,0,0,.2)'; rr(ctx, x + 1, yy + 2, w, 22, 11); ctx.fill();
    ctx.fillStyle = full ? '#f97316' : '#facc15'; rr(ctx, x, yy, w, 22, 11); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; rr(ctx, x, yy, w, 22, 11); ctx.stroke();
    ctx.fillStyle = '#5b3300'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(t, x + 8, yy + 11.5);
  }
  /* Chạm vào công trình: thu tiền, lấy hàng, chạy xưởng – tất cả trong 1 chạm */
  function tapBuilding(wx, wy) {
    for (var i = BHITS.length - 1; i >= 0; i--) {
      var h = BHITS[i]; if (wx < h.x || wx > h.x + h.w || wy < h.y || wy > h.y + h.h) continue;
      var id = h.id, P = id === 'house' ? BPOS.them : BPOS[id], got = 0, msg = [];
      if (id === 'house') {
        ['them', 'nha2', 'nha3'].forEach(function (k) { got += collectInc(k); });
        if (giftReady()) { var gm = giftAmt(); S.gift = dayKey(); addMoney(gm); S.fz.f1++; addLog('in', gm, 'gift', 'Quà mỗi ngày', '🎁'); got += gm; msg.push('🎁 Quà mỗi ngày'); }
        if (!got && S.dmg.house) { toast('💧 Nhà bị dột: tạm dừng thu nhập và quà mỗi ngày. Vào 🎯 Nhiệm vụ → Sự cố để sửa mái.'); return true; }
        if (!got) { toast(built('them') ? '🏠 Nhà của bạn. Thu nhập: +' + short(['them', 'nha2', 'nha3'].reduce(function (a, k) { return a + (built(k) ? BM[k].inc : 0); }, 0)) + '/giờ, ghé lại sau nhé!' : '🏠 Xây 🪵 Thềm nhà (mục Xây) để nhà có thu nhập và quà mỗi ngày.'); return true; }
      } else {
        var b = BM[id];
        if (!built(id)) {
          var st = bState(b);
          if (st === 'buy') doBuild(id);
          else toast(b.e + ' ' + b.n + (st === 'lv' ? ': mở ở cấp ' + b.lv + '. Làm 🎯 Nhiệm vụ để lên cấp!' : ': cần xây ' + BM[b.req].n.toLowerCase() + ' trước'));
          return true;
        }
        var f = S.fac[id];
        if (b.r && f && f.s === 2) { facGet(id, true); msg.push('+1 ' + PRODUCTS[b.r.o].e); }
        got = collectInc(id);
        if (S.dmg.bld[id]) msg.push('💧 Xưởng bị dột! Vào 🎯 Nhiệm vụ → Sự cố để sửa');
        else if (b.r && (!S.fac[id] || S.fac[id].s === 0)) {
          if (canMake(b)) { facGo(id, true); msg.push('▶ Bắt đầu làm ' + PRODUCTS[b.r.o].e); }
          else if (!msg.length && !got) msg.push('Cần ' + b.r.i.map(function (x) { return x[1] + ' ' + item(x[0]).e; }).join(' ') + ' để làm ' + PRODUCTS[b.r.o].e);
        } else if (b.r && S.fac[id] && S.fac[id].s === 1 && !msg.length && !got) msg.push('Đang làm ' + PRODUCTS[b.r.o].e + ' · còn ' + dur(b.r.t - (Date.now() - S.fac[id].t) / 1000));
        if (!msg.length && !got) msg.push(b.e + ' ' + b.src + ': +' + short(b.inc) + '/giờ. Ghé lại sau nhé!');
      }
      if (got) { burst(P.x, P.y - 90, ['#facc15', '#fde047', '#fff'], 14); floatTxt(P.x, P.y - 100, '+' + short(got), '#fef08a'); sfx('win'); msg.unshift('🪙 +' + money(got)); }
      else sfx('ok');
      toast(msg.join(' · ')); hud(); save();
      return true;
    }
    return false;
  }

  /* ================= VẼ RUỘNG ================= */
  function landState(row) {   // row: số thứ tự hàng (1..7)
    var Ld = LAND[row]; if (!Ld) return null;
    if (S.lv < Ld.lv) return { k: 'lv', Ld: Ld };
    return { k: 'buy', Ld: Ld };
  }
  function fieldState(f) {
    if (fieldOpen(f)) return 'open';
    if (S.lv < f.lv) return 'lv';
    return 'buy';
  }
  function drawPlot(i) {
    var R = plotRect(i), pl = S.plots[i];
    ctx.fillStyle = 'rgba(0,0,0,.18)'; rr(ctx, R.x + 1, R.y + 3, R.s, R.s, 10); ctx.fill();
    if (pl.dmg) {   // hoa màu bị bão làm hỏng
      ctx.fillStyle = pl.dmg === 1 ? '#5b4a3a' : '#6b4f35'; rr(ctx, R.x, R.y, R.s, R.s, 10); ctx.fill();
      if (pl.dmg === 1) { ctx.fillStyle = 'rgba(96,165,250,.55)'; ctx.beginPath(); ctx.ellipse(R.x + R.s / 2, R.y + R.s * 0.7, R.s * 0.38, R.s * 0.14, 0, 0, 7); ctx.fill(); }
      ctx.save(); ctx.translate(R.x + R.s / 2, R.y + R.s * 0.55); ctx.rotate(pl.dmg === 2 ? 1.1 : 0.3); emo(ctx, '🥀', 0, 0, R.s * 0.46); ctx.restore();
      emo(ctx, '⚠️', R.x + R.s * 0.82, R.y + R.s * 0.18, R.s * 0.22);
      return;
    }
    var wet = pl.c && pl.w && pl.p < 1;
    var g = ctx.createLinearGradient(0, R.y, 0, R.y + R.s);
    g.addColorStop(0, wet ? '#7a5032' : '#b07a4c'); g.addColorStop(1, wet ? '#5c3920' : '#8e5d36');
    ctx.fillStyle = g; rr(ctx, R.x, R.y, R.s, R.s, 10); ctx.fill();
    ctx.strokeStyle = wet ? 'rgba(40,20,5,.5)' : 'rgba(90,55,25,.45)'; ctx.lineWidth = Math.max(1.5, R.s * 0.03);
    for (var f = 1; f <= 3; f++) { var fy = R.y + R.s * f / 4; ctx.beginPath(); ctx.moveTo(R.x + R.s * 0.12, fy); ctx.quadraticCurveTo(R.x + R.s / 2, fy + R.s * 0.04, R.x + R.s * 0.88, fy); ctx.stroke(); }
    ctx.strokeStyle = wet ? 'rgba(255,255,255,.12)' : 'rgba(255,230,190,.35)'; ctx.lineWidth = 1.5; rr(ctx, R.x + 1, R.y + 1, R.s - 2, R.s - 2, 9); ctx.stroke();
    if (wet) { ctx.fillStyle = 'rgba(160,215,255,.55)'; for (var d = 0; d < 3; d++) { ctx.beginPath(); ctx.ellipse(R.x + R.s * (0.2 + d * 0.3), R.y + R.s * (0.84 - (d % 2) * 0.5), R.s * 0.035, R.s * 0.02, 0, 0, 7); ctx.fill(); } }
    if (pl.c) {
      var cr = CM[pl.c];
      if (cr.per) drawTree(ctx, R.x + R.s / 2, R.y + R.s * 0.86, R.s, cr, pl.p, i, pl.n); else drawPlant(ctx, R.x + R.s / 2, R.y + R.s * 0.8, R.s, cr, pl.p, i);
      if (pl.p < 1) ring(ctx, R.x + R.s - R.s * 0.14, R.y + R.s * 0.14, Math.max(7, R.s * 0.11), pl.p, pl.w ? '#38bdf8' : '#22c55e');
      else { star(ctx, R.x + R.s * 0.18, R.y + R.s * 0.2, R.s * 0.07, tm * 2 + i); star(ctx, R.x + R.s * 0.84, R.y + R.s * 0.3, R.s * 0.05, -tm * 2 + i); }
    }
  }
  /* Bảng gỗ ghi điều kiện mở khoá */
  function sign(x, y, w, h, ic, t1, t2) {
    emo(ctx, ic, x + h * 0.42, y + h / 2, h * 0.42);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.font = '800 ' + Math.round(Math.max(12, Math.min(16, h * 0.2))) + 'px ' + TF;
    ctx.fillText(t1, x + h * 0.8, y + h * 0.38, w - h * 0.9);
    ctx.font = '600 ' + Math.round(Math.max(10.5, Math.min(13, h * 0.16))) + 'px ' + TF; ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.fillText(t2, x + h * 0.8, y + h * 0.66, w - h * 0.9);
  }
  function drawField() {
    var now = Date.now(), v = view();
    for (var i = 0; i < TOTAL; i++) {
      if (!plotOpen(i)) continue;
      var R = plotRect(i); if (!vis(v, R.x - 4, R.y - 30, R.s + 8, R.s + 34)) continue;
      drawPlot(i);
    }
    var fw = CW * COLS - L.gap, ch = CW - L.gap;
    for (var r = S.rows; r < MAXROWS; r++) {
      var a = plotRect(r * COLS), y = a.y, x = a.x, w = fw, h = ch;
      ctx.fillStyle = 'rgba(70,120,40,.55)'; rr(ctx, x, y, w, h, 10); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; rr(ctx, x + 2, y + 2, w - 4, h - 4, 9); ctx.stroke(); ctx.setLineDash([]);
      if (r === S.rows) {
        var ls = landState(r + 1);
        if (ls.k === 'lv') sign(x, y, w, h, '🔒', 'Mở ở cấp ' + ls.Ld.lv, 'Thêm 5 ô đất trồng');
        else sign(x, y, w, h, '🪧', 'Mở rộng ruộng: ' + money(ls.Ld.c), 'Chạm để mua thêm 5 ô đất');
      } else { emo(ctx, ['🌿', '🍀', '🌼'][r % 3], x + w / 2, y + h / 2, h * 0.32); }
    }
    // Các cánh đồng bên ngoài chưa mở: bãi cỏ hoang có bảng chỉ dẫn
    FIELDS.forEach(function (f) {
      var st = fieldState(f); if (st === 'open' || !vis(v, f.x, f.y, f.w, f.h)) return;
      ctx.fillStyle = st === 'buy' ? 'rgba(150,105,55,.55)' : 'rgba(55,100,30,.5)'; rr(ctx, f.x, f.y, f.w, f.h, 14); ctx.fill();
      ctx.strokeStyle = st === 'buy' ? '#fde68a' : 'rgba(255,255,255,.45)'; ctx.setLineDash([8, 6]); ctx.lineWidth = st === 'buy' ? 3 : 2; rr(ctx, f.x + 2, f.y + 2, f.w - 4, f.h - 4, 12); ctx.stroke(); ctx.setLineDash([]);
      var R0 = mulberry(f.i0);
      for (var k = 0; k < f.c * f.r * 0.7; k++) emo(ctx, ['🌿', '🍀', '🌼', '🪨', '🌾'][Math.floor(R0() * 5)], f.x + 14 + R0() * (f.w - 28), f.y + 14 + R0() * (f.h - 28), 13 + R0() * 6);
      var bh = 64, bw = Math.min(f.w - 16, 300), bx = f.x + (f.w - bw) / 2, by = f.y + (f.h - bh) / 2;
      ctx.fillStyle = 'rgba(0,0,0,.2)'; rr(ctx, bx + 2, by + 4, bw, bh, 14); ctx.fill();
      ctx.fillStyle = st === 'buy' ? '#b45309' : 'rgba(36,54,26,.88)'; rr(ctx, bx, by, bw, bh, 14); ctx.fill();
      var n = f.c * f.r;
      if (st === 'lv') sign(bx + 4, by, bw - 8, bh, '🔒', f.n + ' · ' + n + ' ô', 'Mở ở cấp ' + f.lv);
      else sign(bx + 4, by, bw - 8, bh, '🪧', 'Mua ' + f.n.toLowerCase(), money(f.cost) + ' · chạm để mua ' + n + ' ô đất');
    });
    // Tên các cánh đồng đã mở
    FIELDS.forEach(function (f) {
      if (!fieldOpen(f) || !vis(v, f.x, f.y - 40, f.w, 40)) return;
      ctx.font = '800 13px ' + TF; var tw = ctx.measureText(f.n).width + 20, tx = f.x + f.w / 2 - tw / 2, ty = f.y - 38;
      ctx.fillStyle = 'rgba(255,255,255,.9)'; rr(ctx, tx, ty, tw, 22, 11); ctx.fill();
      ctx.fillStyle = '#5b3a12'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(f.n, tx + tw / 2, ty + 11.5);
    });
    drawDefenses();
    drawBuildings(v);
    millBlades();
  }
  /* Bong bóng thông tin cây: vẽ theo toạ độ màn hình để luôn dễ đọc dù đang thu nhỏ */
  function drawTip() {
    if (!TIP || Date.now() >= TIP.until) { TIP = null; return; }
    var P = S.plots[TIP.i]; if (!P.c || P.p >= 1) return;
    var R2 = plotRect(TIP.i), txt = CM[P.c].n + ' · còn ' + dur(left(P)) + (P.w ? ' 💧' : '');
    var sx = (R2.x + R2.s / 2 - cam.x) * cam.z, sy = (R2.y - cam.y) * cam.z, sb = (R2.y + R2.s - cam.y) * cam.z;
    ctx.font = '800 14px ' + TF; var tw = ctx.measureText(txt).width + 22, tx = Math.min(W - tw - 6, Math.max(6, sx - tw / 2)), ty = sy - 36;
    if (ty < 4) ty = sb + 6;
    ctx.fillStyle = 'rgba(36,54,26,.92)'; rr(ctx, tx, ty, tw, 30, 15); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, tx + tw / 2, ty + 15);
  }

  /* ================= VẼ CHUỒNG TRẠI ================= */
  function pos(x) { return x._q || (x._q = { x: rnd(0.08, 0.8), y: rnd(0.42, 0.62), tx: rnd(0.08, 0.8), ty: rnd(0.42, 0.62), d: 1, w: rnd(0, 2) }); }
  function pill(c, x, y, txt, bg, fg, fn) {
    c.font = '800 13px ' + TF; var w = c.measureText(txt).width + 22, h = 30;
    c.fillStyle = 'rgba(0,0,0,.15)'; rr(c, x - w, y + 2, w, h, 15); c.fill();
    c.fillStyle = bg; rr(c, x - w, y, w, h, 15); c.fill();
    c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x - w / 2, y + h / 2 + 0.5);
    if (fn) HITS.push({ x: x - w, y: y, w: w, h: h, fn: fn });
    return w;
  }
  function pillL(c, x, y, txt, bg, fg, fn) { c.font = '800 13px ' + TF; var w = c.measureText(txt).width + 22; pill(c, x + w, y, txt, bg, fg, fn); return w; }
  function drawBarn(dt) {
    var v = view();
    L.pens.forEach(function (p) {
      if (!vis(v, p.x, p.y, p.w, p.h)) return;
      var P = S.pens[p.i];
      if (!P) {   // ô trống: chọn xây chuồng
        var open = S.lv >= LOTLV[p.i];
        emo(ctx, open ? '🏗️' : '🔒', p.x + p.w / 2, p.y + p.h / 2 - 26, 34);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 15px ' + TF;
        ctx.fillText(open ? 'Ô đất trống ' + (p.i + 1) : 'Ô đất ' + (p.i + 1) + ' · mở ở cấp ' + LOTLV[p.i], p.x + p.w / 2, p.y + p.h / 2 + 8, p.w - 20);
        if (open) { ctx.font = '800 13px ' + TF; var tw0 = ctx.measureText('＋ Chọn vật nuôi & xây chuồng').width + 22; pill(ctx, p.x + p.w / 2 + tw0 / 2, p.y + p.h / 2 + 28, '＋ Chọn vật nuôi & xây chuồng', '#f59e0b', '#fff', function () { penPick(p.i); }); }
        else { ctx.font = '600 12.5px ' + TF; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillText('Làm 🎯 Nhiệm vụ để lên cấp', p.x + p.w / 2, p.y + p.h / 2 + 30, p.w - 20); }
        return;
      }
      var a = AM[P.a], list = penList(p.i), cap = capPen(a);
      ctx.font = '800 14px ' + TF; var lt = a.pen + ' ' + list.length + '/' + cap, lw = ctx.measureText(lt).width + 44;
      ctx.fillStyle = 'rgba(255,255,255,.9)'; rr(ctx, p.x + 10, p.y + 8, lw, 28, 14); ctx.fill();
      ctx.fillStyle = '#4a3416'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '800 14px ' + TF;
      ctx.fillText(lt, p.x + 38, p.y + 22); emo(ctx, a.e, p.x + 24, p.y + 22, 18);
      if (list.length && p.w - lw > 170) { ctx.font = '700 12px ' + TF; ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.textAlign = 'left'; ctx.fillText('Ăn ' + CM[a.feed].e + ' → ' + PRODUCTS[a.p].e + ' sau ' + durL(a.t), p.x + lw + 18, p.y + 22); }
      var bx = p.x + 12, by = p.y + p.h - 38;
      if (list.length) bx += pillL(ctx, bx, by, '⚡ Chăm tất cả', '#16a34a', '#fff', function () { careAll(a, p.i); }) + 8;
      if (list.length < cap) bx += pillL(ctx, bx, by, '＋ Mua ' + a.n.toLowerCase() + ' ' + short(a.cost), '#f59e0b', '#fff', function () { buyAnimal(a, p.i); }) + 8;
      else if (nextCap(a)) bx += pillL(ctx, bx, by, '🔒 Thêm chỗ ở cấp ' + nextCap(a).lv, 'rgba(255,255,255,.92)', '#92400e', function () { toast('Lên cấp ' + nextCap(a).lv + ' thì mỗi ' + a.pen.toLowerCase() + ' nuôi được nhiều hơn. Hoặc xây thêm chuồng ở ô đất trống!'); }) + 8;
      if (!list.length) pillL(ctx, bx, by, '🔄 Đổi', 'rgba(255,255,255,.92)', '#92400e', function () { penDemolish(p.i); });
      if (!list.length) {
        ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.textAlign = 'center'; ctx.font = '700 14px ' + TF;
        ctx.fillText((a.water ? 'Ao trống' : 'Chuồng trống') + ' – hãy mua ' + a.n.toLowerCase() + ' đầu tiên!', p.x + p.w / 2, p.y + p.h * 0.42, p.w - 16);
        ctx.font = '600 13px ' + TF; ctx.fillText('Cho ăn ' + CM[a.feed].e + ' ' + CM[a.feed].n + ' → nhận ' + PRODUCTS[a.p].e + ' ' + PRODUCTS[a.p].n + ' sau ' + durL(a.t), p.x + p.w / 2, p.y + p.h * 0.42 + 20, p.w - 16);
      }
      var sz = Math.min(44, p.h * 0.32, p.w / (cap + 1.5));
      var order = list.slice().sort(function (u, w2) { return pos(u).y - pos(w2).y; });
      order.forEach(function (x, k) {
        var q = pos(x);        q.w -= dt;
        if (q.w <= 0) { var dx = q.tx - q.x, dy = q.ty - q.y, dd = Math.sqrt(dx * dx + dy * dy); if (dd < 0.01) { q.tx = rnd(0.08, 0.8); q.ty = rnd(0.42, 0.62); q.w = rnd(0.8, 3); } else { var spd = 0.06 * dt; q.x += dx / dd * Math.min(spd, dd); q.y += dy / dd * Math.min(spd, dd); q.d = dx < 0 ? -1 : 1; } }
        var top = p.y + 40 + sz * 1.05, bot = p.y + p.h - 44 - sz * 0.45, ax = p.x + 14 + q.x * (p.w - 28), ay = bot <= top ? (top + bot) / 2 : top + (q.y - 0.42) / 0.2 * (bot - top), walking = q.w <= 0;
        x._x = ax; x._y = ay; x._s = sz;
        if (!a.water) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(ax, ay + sz * 0.42, sz * 0.38, sz * 0.1, 0, 0, 7); ctx.fill(); }
        ctx.save(); ctx.translate(ax, ay - (walking ? Math.abs(Math.sin(tm * 10 + k)) * sz * 0.08 : 0)); ctx.scale(-q.d, 1); emo(ctx, a.e, 0, 0, sz); ctx.restore();
        var bubY = ay - sz * 0.95;
        if (x.s === 0) { bubble(ax, bubY, sz * 0.5, CM[a.feed].e, '#fff'); }
        else if (x.s === 1) ring(ctx, ax + sz * 0.4, ay - sz * 0.55, Math.max(8, sz * 0.2), x.p, '#f59e0b');
        else { var bb = Math.sin(tm * 5 + k) * 3; bubble(ax, bubY + bb, sz * 0.55, PRODUCTS[a.p].e, '#fff7d1'); star(ctx, ax + sz * 0.45, bubY - sz * 0.25, sz * 0.12, tm * 2); }
      });
      if (animPaused(a.id)) {
        var pen = S.dmg.pen[a.id], txt = pen ? '🔨 Chuồng bị gió lốc làm hỏng' : '🤒 ' + a.n + ' bị ốm, cần chữa bệnh';
        ctx.fillStyle = pen ? 'rgba(120,53,15,.45)' : 'rgba(30,64,175,.28)'; rr(ctx, p.x, p.y, p.w, p.h, 16); ctx.fill();
        if (pen) { ctx.strokeStyle = '#78350f'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p.x + 30, p.y + 50); ctx.lineTo(p.x + 70, p.y + 90); ctx.moveTo(p.x + p.w - 40, p.y + 60); ctx.lineTo(p.x + p.w - 80, p.y + 110); ctx.stroke(); }
        ctx.font = '800 14px ' + TF; var tw2 = ctx.measureText(txt).width + 24;
        ctx.fillStyle = '#dc2626'; rr(ctx, p.x + p.w / 2 - tw2 / 2, p.y + p.h / 2 - 34, tw2, 30, 15); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, p.x + p.w / 2, p.y + p.h / 2 - 18.5);
        ctx.font = '800 13px ' + TF; var tw3 = ctx.measureText('🔧 Đi sửa chữa').width + 22;
        pill(ctx, p.x + p.w / 2 + tw3 / 2, p.y + p.h / 2 + 4, '🔧 Đi sửa chữa', '#f59e0b', '#fff', function () { setTab('quest'); });
      }
    });
  }
  function bubble(x, y, s, e, bg) {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, s * 0.62, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - s * 0.15, y + s * 0.5); ctx.lineTo(x, y + s * 0.85); ctx.lineTo(x + s * 0.15, y + s * 0.5); ctx.fill(); ctx.restore();
    emo(ctx, e, x, y + 1, s * 0.7);
  }

  /* ================= HIỆU ỨNG ================= */
  function burst(x, y, cols, n) { for (var i = 0; i < (n || 10); i++) FX.push({ x: x, y: y, vx: rnd(-90, 90), vy: rnd(-170, -60), t: 0, life: rnd(0.5, 0.9), r: rnd(2, 4.5), c: cols[i % cols.length] }); }
  function floatTxt(x, y, t, c) { FL.push({ x: x, y: y, t: 0, txt: t, c: c || '#fff' }); }
  function drawFX(dt) {
    for (var i = FX.length - 1; i >= 0; i--) { var f = FX[i]; f.t += dt; if (f.t > f.life) { FX.splice(i, 1); continue; } f.vy += 380 * dt; f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = 1 - f.t / f.life; ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    for (i = FL.length - 1; i >= 0; i--) {
      var t = FL[i]; t.t += dt; if (t.t > 1.2) { FL.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, 1.6 - t.t * 1.3); ctx.font = '900 17px ' + TF; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.strokeText(t.txt, t.x, t.y - t.t * 46); ctx.fillStyle = t.c; ctx.fillText(t.txt, t.x, t.y - t.t * 46);
    }
    ctx.globalAlpha = 1;
  }
  var clouds = [{ x: 0.1, y: 0.22, s: 1 }, { x: 0.55, y: 0.12, s: 0.75 }, { x: 0.8, y: 0.3, s: 0.9 }];
  function drawClouds(dt) {
    clouds.forEach(function (c) {
      c.x += dt * 0.008 * c.s; if (c.x > 1.2) c.x = -0.25;
      var x = c.x * WORLD[tab].w, y = c.y * HD, s = 16 * c.s;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.arc(x + s * 1.1, y - s * 0.4, s * 1.2, 0, 7); ctx.arc(x + s * 2.3, y, s * 0.95, 0, 7); ctx.fill();
      ctx.fillRect(x, y - 2, s * 2.3, s * 0.9);
    });
  }

  /* Hiệu ứng mưa / gió lốc vài giây sau khi thiên tai xảy ra */
  function drawWeather(dt) {
    var P = WX.p, left = (WX.until - Date.now()) / 1000, a = Math.min(1, left / 3);
    ctx.fillStyle = 'rgba(30,41,59,' + (0.28 * a) + ')'; ctx.fillRect(0, 0, W, H);
    var n = WX.w === 'rain' ? 140 : 26;
    while (P.length < n) P.push({ x: Math.random() * W, y: Math.random() * H, s: 0.6 + Math.random() * 0.8, r: Math.random() * 6 });
    ctx.globalAlpha = a;
    P.forEach(function (q) {
      if (WX.w === 'rain') {
        q.y += 700 * q.s * dt; q.x -= 120 * q.s * dt; if (q.y > H) { q.y = -20; q.x = Math.random() * (W + 80); }
        ctx.strokeStyle = 'rgba(191,219,254,.8)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - 4, q.y + 14 * q.s); ctx.stroke();
      } else {
        q.x += 420 * q.s * dt; q.y += Math.sin(tm * 3 + q.r) * 60 * dt; q.r += dt * 6; if (q.x > W + 30) { q.x = -30; q.y = Math.random() * H; }
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); emo(ctx, q.s > 1 ? '🍂' : '🍃', 0, 0, 16 + q.s * 8); ctx.restore();
      }
    });
    if (WX.w === 'wind') { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; for (var k = 0; k < 5; k++) { var yy = (k * 137 + tm * 90) % H; ctx.beginPath(); ctx.moveTo(((tm * 500 + k * 200) % (W + 300)) - 300, yy); ctx.quadraticCurveTo(((tm * 500 + k * 200) % (W + 300)) - 150, yy - 20, ((tm * 500 + k * 200) % (W + 300)), yy); ctx.stroke(); } }
    ctx.globalAlpha = 1;
  }

  /* ================= VÒNG LẶP ================= */
  var lastT = 0;
  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now; tm += dt;
    var t = Date.now(); update(t);
    if (t - lastSave > 5000) { lastSave = t; checkDisaster(t); checkRaid(t); save(); badges(); walletBar(); }
    if (S.fix.length) fixTick(t);
    defTick(t);
    if (tab === 'field' || tab === 'barn') {
      useCam(); stepCam(dt); HITS = [];
      var z = cam.z * DPR, v = view();
      ctx.setTransform(z, 0, 0, z, -cam.x * z, -cam.y * z);
      if (tab === 'field') drawFieldWorld(v); else drawBarnWorld(v);
      if (v.y0 < HD) drawClouds(dt);
      if (tab === 'field') drawField(); else drawBarn(dt);
      drawFX(dt);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (tab === 'field') drawTip();
      if (WX && Date.now() < WX.until) drawWeather(dt); else WX = null;
    } else if (tab === 'build' && t - lastPanel > 1000) { lastPanel = t; tickBuild(); }
    else if (tab === 'quest' && t - lastPanel > 1000) { lastPanel = t; tickQuest(); }
    raf = requestAnimationFrame(loop);
  }

  /* ================= HÀNH ĐỘNG TRÊN RUỘNG ================= */
  var drag = null;
  function plotAt(x, y) {   // toạ độ thế giới → số ô (-1 nếu không trúng ô nào)
    if (x >= MX && y >= MY && x < MX + CW * COLS && y < MY + CW * MAXROWS) return Math.floor((y - MY) / CW) * COLS + Math.floor((x - MX) / CW);
    for (var k = 0; k < FIELDS.length; k++) { var f = FIELDS[k]; if (x >= f.x && y >= f.y && x < f.x + f.w && y < f.y + f.h) return f.i0 + Math.floor((y - f.y) / CW) * f.c + Math.floor((x - f.x) / CW); }
    return -1;
  }
  /* Chạm/vuốt vào ô này có làm gì không? (để phân biệt "vuốt gieo hạt" với "kéo bản đồ") */
  function actionable(i) {
    if (!plotOpen(i)) return false;
    var pl = S.plots[i]; if (pl.dmg) return false;
    if (pl.c && pl.p >= 1) return true;
    if (tool === 'seed') return !pl.c;
    if (tool === 'water') return !!pl.c && !pl.w;
    if (tool === 'fert') return !!pl.c && pl.p < 1 && (S.fz[S.selF] || 0) > 0;
    return false;
  }
  function noMoney(need, w) {   // mỗi ví chỉ tiêu số tiền đang có, không đủ thì không được tiêu
    w = w || 'essential'; var W0 = WM[w];
    sfx('bad');
    toast('💸 Ví ' + W0.e + ' ' + W0.n + ' chỉ còn ' + money(S.jar[w]) + ', không đủ ' + money(need) + '. Hãy kiếm thêm tiền (bán hàng, 🎮 Phụ bản) để ví này đầy lên nhé!');
  }

  function plant(i) {
    var pl = S.plots[i], cr = CM[S.sel], R = plotRect(i);
    if (cr.lv > S.lv) { toast('🔒 ' + cr.n + ' mở ở cấp ' + cr.lv); return false; }
    var sw = cr.per ? 'invest' : 'essential';   // cây ăn quả lâu năm là khoản đầu tư dài hạn
    if (!has(sw, cr.cost)) { noMoney(cr.cost, sw); return false; }
    takeMoney(sw, cr.cost); addLog('out', cr.cost, 'seed_' + cr.id, (cr.per ? 'Mua cây giống ' : 'Mua hạt giống ') + cr.n, cr.e);
    pl.c = cr.id; pl.p = 0; pl.t = Date.now(); pl.w = 0; pl.n = 0; ev('plant', cr.id);
    burst(R.x + R.s / 2, R.y + R.s * 0.8, ['#8d5a2b', '#6b4423', '#c08a55'], 7);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.4, '−' + short(cr.cost), '#fecaca');
    return true;
  }
  function harvest(i, quiet) {
    var pl = S.plots[i], cr = CM[pl.c], R = plotRect(i);
    S.inv[cr.id] = (S.inv[cr.id] || 0) + 1;
    if (cr.per) { pl.p = 0; pl.t = Date.now(); pl.w = 0; pl.n = (pl.n || 0) + 1; } else { pl.c = null; pl.p = 0; pl.w = 0; }
    ev('harvest', cr.id);
    burst(R.x + R.s / 2, R.y + R.s * 0.5, ['#fde047', '#86efac', '#fff'], 10);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.35, '+1 ' + cr.e, '#fef08a');
    if (!quiet) sfx('ok');
    addXP(cr.xp);
  }
  function water(i) {
    var pl = S.plots[i], R = plotRect(i);
    if (!pl.c || pl.p >= 1 || pl.w || pl.dmg) return false;
    update(Date.now()); pl.w = 1; ev('water');
    burst(R.x + R.s / 2, R.y + R.s * 0.3, ['#7dd3fc', '#38bdf8', '#e0f2fe'], 9);
    return true;
  }
  /* Tự động tưới: cứ vài giây tưới hết các ô đang trồng chưa được tưới */
  function autoWater() { var n = 0; for (var j = 0; j < TOTAL; j++) if (plotOpen(j) && water(j)) n++; if (n) save(); return n; }
  function fert(i) {
    var pl = S.plots[i], R = plotRect(i);
    if (!pl.c || pl.p >= 1 || pl.dmg) return false;
    var F = FZM[S.selF];
    if (!(S.fz[F.id] > 0)) { toast(F.e + ' Hết ' + F.n.toLowerCase() + '. Bấm lại nút Phân bón để mua hoặc chọn loại khác.'); return false; }
    update(Date.now()); S.fz[F.id]--; ev('fert'); pl.p = Math.min(1, pl.p + (1 - pl.p) * F.cut);
    burst(R.x + R.s / 2, R.y + R.s * 0.4, ['#c4b5fd', '#a78bfa', '#fff'], 10);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.3, F.cut >= 1 ? '⚡ Chín ngay!' : '⚡ −' + Math.round(F.cut * 100) + '% thời gian', '#ddd6fe');
    toolsUI(); return true;
  }
  function act(i, first) {
    if (i < 0 || i >= TOTAL) return;
    if (!plotOpen(i)) {
      if (!first) return;
      if (i < MAIN) { if (Math.floor(i / COLS) === S.rows) buyLand(); }
      else buyField(fieldOf(i));
      return;
    }
    var pl = S.plots[i];
    if (pl.dmg) { if (first) { toast('🥀 Hoa màu bị ' + (pl.dmg === 1 ? 'ngập úng' : 'gió quật gãy') + '. Vào 🎯 Nhiệm vụ → Sự cố để dọn ruộng.'); sfx('bad'); } return; }
    if (pl.c && pl.p >= 1) { harvest(i); hud(); return; }
    if (tool === 'seed') {
      if (!pl.c) { if (plant(i)) { hud(); if (first) sfx('ok'); } }
      else if (first) { if (CM[pl.c].per) treeSheet(i); else TIP = { i: i, until: Date.now() + 2200 }; }
    }
    else if (tool === 'fert') { if (fert(i) && first) sfx('ok'); }
  }
  function buyLand() {
    var r = S.rows; if (r >= MAXROWS) return;
    var ls = landState(r + 1);
    if (ls.k === 'lv') { toast('🔒 Đạt cấp ' + ls.Ld.lv + ' để mở rộng ruộng. Làm 🎯 Nhiệm vụ để tích kinh nghiệm nhé!'); return; }
    confirmBox('🪧', 'Mở rộng ruộng?', 'Mua thêm 5 ô đất với giá <b>' + money(ls.Ld.c) + '</b>. Đây là khoản <b>đầu tư</b>: tốn tiền một lần nhưng giúp nông trại thu được nhiều hơn mỗi ngày.', 'Mua đất', function () {
      if (!has('invest', ls.Ld.c)) { noMoney(ls.Ld.c, 'invest'); return; }
      takeMoney('invest', ls.Ld.c); S.rows++; addLog('out', ls.Ld.c, 'land' + S.rows, 'Mua thêm đất (hàng ' + S.rows + ')', '🪧'); sfx('win'); save(); hud(); toast('🎉 Ruộng đã rộng hơn!');
    });
  }
  function buyField(f) {
    var st = fieldState(f), n = f.c * f.r;
    if (st === 'lv') { toast('🔒 ' + f.n + ' mở ở cấp ' + f.lv + '. Làm 🎯 Nhiệm vụ để tích kinh nghiệm nhé!'); return; }
    if (st !== 'buy') return;
    confirmBox('🌾', 'Mua ' + f.n.toLowerCase() + '?', 'Thêm <b>' + n + ' ô đất</b> bên ngoài hàng rào với giá <b>' + money(f.cost) + '</b>. Đây là khoản <b>đầu tư</b>: trả một lần, trồng được mãi mãi.', 'Mua đất', function () {
      if (!has('invest', f.cost)) { noMoney(f.cost, 'invest'); return; }
      takeMoney('invest', f.cost); S.fx[f.id] = Date.now(); addLog('out', f.cost, 'fld_' + f.id, 'Mua ' + f.n.toLowerCase(), '🌾');
      addXP(Math.max(5, Math.round(f.cost / 100000)));
      sfx('win'); save(); hud(); toast('🎉 Đã mở ' + f.n + '! Chạm hoặc vuốt để gieo hạt.');
      burst(f.x + f.w / 2, f.y + f.h / 2, ['#fde047', '#86efac', '#fff', '#f59e0b'], 24);
    });
  }

  /* ================= VẬT NUÔI ================= */
  function buyAnimal(a, i) {
    if (penList(i).length >= capPen(a)) { toast('Chuồng đã đầy. Xây thêm chuồng ở ô đất trống để nuôi thêm!'); return; }
    if (!has('invest', a.cost)) { noMoney(a.cost, 'invest'); return; }
    takeMoney('invest', a.cost); S.an[a.id].push({ s: 0, p: 0, t: Date.now(), pen: i }); addLog('out', a.cost, 'buy_' + a.id, 'Mua ' + a.n.toLowerCase(), a.e);
    sfx('win'); hud(); save(); toast(a.e + ' Đã mua thêm 1 con ' + a.n.toLowerCase() + '. Chạm vào để cho ăn ' + CM[a.feed].e);
  }
  function feedOne(a, x) {
    if ((S.inv[a.feed] || 0) < 1) return false;
    S.inv[a.feed]--; x.s = 1; x.p = 0; x.t = Date.now(); ev('feed', a.id); return true;
  }
  function collectOne(a, x) {
    S.inv[a.p] = (S.inv[a.p] || 0) + 1; x.s = 0; x.p = 0; ev('collect', a.p); addXP(PRODUCTS[a.p].xp);
    if (x._x) { burst(x._x, x._y - 20, ['#fde047', '#fff', '#fdba74'], 9); floatTxt(x._x, x._y - 30, '+1 ' + PRODUCTS[a.p].e + ' +' + PRODUCTS[a.p].xp + ' KN', '#fef08a'); }
  }
  function careAll(a, i) {
    if (animPaused(a.id)) { toast((S.dmg.pen[a.id] ? '🔨 ' + a.pen + ' bị hỏng' : '🤒 ' + a.n + ' đang bị ốm') + '. Vào 🎯 Nhiệm vụ → Sự cố để xử lý.'); setTab('quest'); return; }
    var got = 0, fed = 0, miss = 0;
    var list = penList(i);
    list.forEach(function (x) { if (x.s === 2) { collectOne(a, x); got++; } });
    list.forEach(function (x) { if (x.s === 0) { if (feedOne(a, x)) fed++; else miss++; } });
    if (got || fed) sfx('ok');
    toast((got ? 'Thu ' + got + ' ' + PRODUCTS[a.p].e + '. ' : '') + (fed ? 'Cho ăn ' + fed + ' con. ' : '') + (miss ? 'Thiếu ' + miss + ' ' + CM[a.feed].e + ' ' + CM[a.feed].n + ' để cho ăn.' : '') || 'Các con đang no, chờ chút nhé!');
    hud(); save();
  }
  function tapBarn(x, y) {
    for (var h = HITS.length - 1; h >= 0; h--) { var b = HITS[h]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.fn(); return; } }
    for (var i = 0; i < L.pens.length; i++) {
      if (!S.pens[i]) continue;
      var a = AM[S.pens[i].a], list = penList(i);
      for (var k = list.length - 1; k >= 0; k--) {
        var o = list[k]; if (o._x == null) continue;
        if (Math.abs(x - o._x) < o._s * 0.7 && y > o._y - o._s * 1.4 && y < o._y + o._s * 0.6) {
          if (animPaused(a.id)) { toast((S.dmg.pen[a.id] ? '🔨 ' + a.pen + ' bị hỏng' : '🤒 ' + a.n + ' đang bị ốm') + '. Vào 🎯 Nhiệm vụ → Sự cố để xử lý.'); sfx('bad'); return; }
          if (o.s === 2) { collectOne(a, o); sfx('ok'); }
          else if (o.s === 0) {
            if (feedOne(a, o)) { sfx('ok'); burst(o._x, o._y, ['#fde68a', '#bef264'], 6); floatTxt(o._x, o._y - 30, '−1 ' + CM[a.feed].e, '#fff'); }
            else { toast('Cần 1 ' + CM[a.feed].e + ' ' + CM[a.feed].n + ' để cho ' + a.n.toLowerCase() + ' ăn. Hãy trồng thêm ở Ruộng!'); sfx('bad'); }
          } else toast(a.e + ' Đang làm ra ' + PRODUCTS[a.p].e + ' ' + PRODUCTS[a.p].n.toLowerCase() + ', còn ' + dur((1 - o.p) * a.t));
          hud(); save(); return;
        }
      }
    }
    // chạm vào ô đất trống
    for (i = 0; i < L.pens.length; i++) {
      var p = L.pens[i]; if (S.pens[i] || x < p.x || x > p.x + p.w || y < p.y || y > p.y + p.h) continue;
      if (S.lv >= LOTLV[i]) penPick(i); else toast('🔒 Ô đất ' + (i + 1) + ' mở ở cấp ' + LOTLV[i] + '. Làm 🎯 Nhiệm vụ để tích kinh nghiệm nhé!');
      return;
    }
  }
  /* Chọn loại vật nuôi cho ô đất trống: tuỳ ý thích và số tiền trong ví Đầu tư */
  function penPick(i) {
    var h = '<div class="fm-h">🏗️ Ô đất ' + (i + 1) + ': nuôi con gì?</div><p class="fm-sub">Chọn vật nuôi hợp với sở thích và <b>số tiền trong ví 📈 Đầu tư</b> (đang có ' + money(S.jar.invest) + '). Tiền xây chuồng và mua con giống đều trừ ví Đầu tư. Có thể xây nhiều chuồng cùng một loại.</p>';
    ANIMALS.forEach(function (a) {
      var lk = S.lv < a.lv, pc = penCost(a), cnt = S.pens.filter(function (P) { return P && P.a === a.id; }).length;
      h += '<div class="fm-seed' + (lk ? '' : '') + '" style="cursor:default' + (lk ? ';opacity:.5' : '') + '"><span class="e">' + (lk ? '🔒' : a.e) + '</span><span class="tx"><b>' + a.pen + (cnt ? ' <small style="display:inline;color:#15803d">(đang có ' + cnt + ')</small>' : '') + '</b>' +
        '<small>' + (lk ? 'Mở ở cấp ' + a.lv : 'Chuồng ' + money(pc) + ' · mỗi con ' + money(a.cost) + ' · nuôi ' + capPen(a) + ' con<br>Ăn ' + CM[a.feed].e + ' ' + CM[a.feed].n.toLowerCase() + ' → ' + PRODUCTS[a.p].e + ' ' + PRODUCTS[a.p].n.toLowerCase() + ' (bán ' + short(PRODUCTS[a.p].sell) + ') mỗi ' + durL(a.t)) + '</small>' +
        (lk ? '' : '<span class="fm-row" style="margin-top:6px"><button class="fm-btn org" data-a="penBuild" data-i="' + i + '" data-k="' + a.id + '"' + (S.jar.invest < pc ? ' disabled' : '') + '>🔨 Xây · ' + short(pc) + '</button>' + (S.jar.invest < pc ? '<span class="fm-tag">Ví Đầu tư chưa đủ</span>' : '') + '</span>') + '</span></div>';
    });
    sheet(h + '<button class="fm-btn alt" data-a="sheetClose" style="width:100%">Để sau</button>');
  }
  function penBuild(i, k) {
    var a = AM[k], pc = penCost(a);
    if (S.pens[i] || S.lv < LOTLV[i] || S.lv < a.lv) return;
    if (!has('invest', pc)) { noMoney(pc, 'invest'); return; }
    takeMoney('invest', pc); addLog('out', pc, 'pen_' + k, 'Xây ' + a.pen.toLowerCase(), a.e);
    S.pens[i] = { a: k }; addXP(Math.max(3, Math.round(pc / 50000)));
    closeSheet(); sfx('win'); save(); hud();
    var p = L.pens[i]; burst(p.x + p.w / 2, p.y + p.h / 2, ['#fde047', '#86efac', '#fff'], 24);
    toast('🎉 Đã xây ' + a.pen.toLowerCase() + '! Bấm “＋ Mua ' + a.n.toLowerCase() + '” để nuôi con đầu tiên.');
  }
  function penDemolish(i) {
    var P = S.pens[i]; if (!P || penList(i).length) return;
    var a = AM[P.a], back = Math.round(penCost(a) * 0.5 / 1000) * 1000;
    confirmBox('🔄', 'Dỡ ' + a.pen.toLowerCase() + '?', 'Dỡ chuồng để xây chuồng khác ở ô này. Bán lại vật liệu được <b>' + money(back) + '</b> (một nửa giá xây) vào ví Đầu tư.', 'Dỡ chuồng', function () {
      S.pens[i] = null; addMoney(back, 'invest'); addLog('in', back, 'pen_sell', 'Bán vật liệu ' + a.pen.toLowerCase(), '🔄'); save(); hud(); penPick(i);
    });
  }

  /* ================= GIAO DIỆN HTML ================= */
  function hud() {
    $('fmLv').textContent = S.lv;
    var nd = need(S.lv); $('fmXp').style.width = Math.min(100, S.xp / nd * 100) + '%';
    $('fmXpT').textContent = 'Cấp ' + S.lv + ' · ' + S.xp + '/' + nd + ' KN';
    syncM(); $('fmM').textContent = '💰 ' + money(S.m); walletBar();
    toolsUI(); badges();
  }
  function jarAmt(n) { return n >= 1e6 ? (n / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + 'tr' : n >= 1e4 ? Math.floor(n / 1000).toLocaleString('vi-VN') + 'k' : n.toLocaleString('vi-VN') + 'đ'; }
  function walletBar() {
    var el = $('fmWB'); if (!el) return;
    syncM(); var mt = $('fmM'); if (mt) mt.textContent = '💰 ' + money(S.m);
    var sl = el.scrollLeft;
    el.innerHTML = WALLETS.map(function (x) {
      var n = walletReady(x.k);
      return '<button class="' + (tab === 'quest' && S.mw === x.k ? 'on' : '') + '" data-a="wtab" data-w="' + x.k + '" style="--wc:' + x.c + '" title="' + x.n + '"><span class="n">' + x.e + ' ' + (x.k === 'education' ? 'Phát triển' : x.n) + ' <i>' + pctOf(x.k) + '%</i></span><span class="b">' + jarAmt(S.jar[x.k]) + '</span>' + (n ? '<span class="dot">' + n + '</span>' : '') + '</button>';
    }).join('') + '<button class="set" data-a="pctSet" aria-label="Cài đặt tỷ lệ 6 ví" style="--wc:#fde68a"><span class="n">⚙️ Tỷ lệ</span><span class="b" style="font-size:12px">Cài đặt</span></button>';
    el.scrollLeft = sl;
  }
  function toolsUI() {
    var cr = CM[S.sel];
    $('fmSeedE').textContent = cr.e; $('fmSeedN').textContent = cr.n + ' ▾';
    $('fmFert').textContent = S.fz[S.selF] || 0; $('fmFertE').textContent = FZM[S.selF].e;
    var bs = $('fmTools').querySelectorAll('[data-t]');
    for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-t') === tool);
  }
  function dot(id, n) { var d = $(id); d.style.display = n ? '' : 'none'; d.textContent = n; }
  function badges() {
    fillOrders();
    dot('fmDotO', S.orders.filter(canDeliver).length);
    var b = 0; ANIMALS.forEach(function (a) { S.an[a.id].forEach(function (x) { if (x.s === 2) b++; }); });
    dot('fmDotB', b);
    var f = 0; BUILDS.forEach(function (x) { var s = S.fac[x.id]; if (s && s.s === 2) f++; });
    dot('fmDotK', f);
    dot('fmDotQ', claimable());
  }
  var toastT = 0;
  function toast(t) { var el = $('fmToast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2800); }
  function sheet(html) { $('fmSB').innerHTML = html; $('fmSheet').classList.add('on'); $('fmSB').scrollTop = 0; }
  var sheetQ = [];
  function closeSheet() { $('fmSheet').classList.remove('on'); if (sheetQ.length) { var nx = sheetQ.shift(); setTimeout(function () { if (running) sheet(nx); }, 220); } }
  function sheetLater(html) { if ($('fmSheet').classList.contains('on')) sheetQ.push(html); else sheet(html); }
  var confirmFn = null;
  function confirmBox(e, t, body, ok, fn) {
    confirmFn = fn;
    sheet('<div class="fm-modal"><div class="big">' + e + '</div><h2>' + t + '</h2><p>' + body + '</p><div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Để sau</button><button class="fm-btn org" data-a="confirm">' + ok + '</button></div></div>');
  }
  function seedSheet() {
    var h = '<div class="fm-h">🌱 Chọn hạt giống</div><p class="fm-sub">Chọn xong, chạm (hoặc vuốt) lên các ô đất trống để gieo. <b>Lãi</b> = giá bán − tiền hạt giống. Cây lâu lớn thích hợp trồng trước khi đi học, đi ngủ.</p>';
    CROPS.forEach(function (c, ci) {
      var lk = c.lv > S.lv, pr = c.sell - c.cost;
      if (c.per && !CROPS[ci - 1].per) h += '<div class="fm-h" style="margin-top:12px">🌳 Cây ăn quả lâu năm</div><p class="fm-sub">Cây giống đắt (trừ ví 📈 Đầu tư) và lần đầu lớn lâu, nhưng <b>trồng 1 lần, thu hoạch mãi mãi</b>, không tốn tiền giống nữa. Đúng là một khoản đầu tư dài hạn!</p>';
      if (c.per) { h += '<button class="fm-seed' + (S.sel === c.id ? ' on' : '') + '" data-a="pick" data-c="' + c.id + '"' + (lk ? ' disabled' : '') + '><span class="e">' + (lk ? '🔒' : c.e) + '</span><span class="tx"><b>' + c.n + '</b><small>' + (lk ? 'Mở ở cấp ' + c.lv : 'Cây giống ' + money(c.cost) + ' · lần đầu ' + durL(c.t) + ' · sau đó cứ ' + durL(c.re) + ' ra 1 lứa · bán ' + money(c.sell)) + '</small></span>' + (lk ? '' : '<span class="pr">+' + short(c.sell) + '<small>mỗi lứa</small></span>') + '</button>'; return; }
      h += '<button class="fm-seed' + (S.sel === c.id ? ' on' : '') + '" data-a="pick" data-c="' + c.id + '"' + (lk ? ' disabled' : '') + '><span class="e">' + (lk ? '🔒' : c.e) + '</span><span class="tx"><b>' + c.n + '</b>' +
        '<small>' + (lk ? 'Mở ở cấp ' + c.lv : 'Hạt ' + money(c.cost) + ' · ⏱ ' + durL(c.t) + ' · bán ' + money(c.sell)) + '</small></span>' +
        (lk ? '' : '<span class="pr">+' + short(pr) + '<small>lãi/cây</small></span>') + '</button>';
    });
    sheet(h);
  }
  function treeSheet(i) {
    var pl = S.plots[i], c = CM[pl.c];
    sheet('<div class="fm-modal"><div class="big">🌳</div><h2>Cây ' + c.n.toLowerCase() + ' ' + c.e + '</h2><p>' + (pl.n ? 'Đã cho ' + pl.n + ' lứa quả. ' : 'Cây non đang lớn. ') + 'Lứa quả tiếp theo sau <b>' + dur(left(pl)) + '</b>' + (pl.w ? ' 💧' : '') + '.</p>' +
      '<p style="font-size:13px">Cây lâu năm: trồng 1 lần, cứ ' + durL(c.re) + ' lại ra quả, mỗi lứa bán ' + money(sp(c.id)) + '. Muốn trồng cây khác ở ô này thì phải chặt cây đi.</p>' +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Để cây lại</button><button class="fm-btn" style="background:#b91c1c" data-a="chop" data-i="' + i + '">🪓 Chặt cây</button></div></div>');
  }
  function fertSheet() {
    var h = '<div class="fm-h">🧪 Chọn loại phân bón</div><p class="fm-sub">Bón vào cây đang lớn. <b>Phân càng đắt càng rút ngắn nhiều thời gian.</b> Mua bằng tiền ví 🏠 Thiết yếu.</p>';
    FERTS.forEach(function (f) {
      h += '<div class="fm-seed' + (S.selF === f.id ? ' on' : '') + '" style="cursor:default"><span class="e">' + f.e + '</span><span class="tx"><b>' + f.n + '</b><small>' + f.d + ' · ' + money(f.p) + '/túi · đang có <b>' + (S.fz[f.id] || 0) + '</b> túi</small>' +
        '<span class="fm-row" style="margin-top:6px"><button class="fm-btn" data-a="pickF" data-f="' + f.id + '"' + (S.fz[f.id] ? '' : ' disabled') + '>Dùng loại này</button><button class="fm-btn org" data-a="buyFert" data-f="' + f.id + '" data-q="1">Mua 1 · ' + short(f.p) + '</button></span></span></div>';
    });
    sheet(h + '<button class="fm-btn alt" data-a="sheetClose" style="width:100%">Đóng</button>');
  }
  function levelUp(from) {
    from = Math.min(from || S.lv - 1, S.lv - 1);
    sfx('win'); try { if (window.addStar) window.addStar(); } catch (e) {}
    var un = [], bonus = 0, go = '', nm = 0;
    for (var l = from + 1; l <= S.lv; l++) {
      unlocksAt(l).forEach(function (u) { un.push('<span><i>' + u.e + '</i>' + u.t + '</span>'); if (!go) go = u.go; });
      bonus += l * 10000;
      nm += MISSIONS.filter(function (m) { return m.lv === l; }).length;
    }
    addMoney(bonus); S.fz.f1 += 2; addLog('in', bonus, 'lv' + S.lv, 'Thưởng lên cấp ' + S.lv, '🎁');
    if (nm) un.push('<span><i>🎯</i>' + nm + ' nhiệm vụ mới</span>');
    var nx = nextUnlock();
    sheetLater('<div class="fm-modal"><div class="big">🎉</div><h2>Lên cấp ' + S.lv + '!</h2><p>Thưởng <b>' + money(bonus) + '</b> + 🧪 2 túi phân bón. Con được cộng 1 điểm ⭐ vào app.</p>' +
      (un.length ? '<p><b>Mở khoá mới:</b></p><div class="fm-ul">' + un.join('') + '</div>' : '') +
      (nx ? '<p style="font-size:13px">Tiếp theo ở cấp ' + nx.lv + ': ' + nx.u.map(function (u) { return u.e + ' ' + u.t; }).join(', ') + '</p>' : '') +
      '<div class="fm-row" style="justify-content:center">' + (go ? '<button class="fm-btn org" data-a="tab" data-t="' + go + '">Đi xem ngay</button>' : '') + '<button class="fm-btn" data-a="sheetClose">Tuyệt vời!</button></div></div>');
    hud(); save();
  }
  function guide() {
    sheet('<div class="fm-modal"><div class="big">👩‍🌾</div><h2>Chào mừng đến Nông trại 6PAY!</h2><ul class="fm-guide">' +
      '<li><i>🌱</i><span>Chọn hạt giống, rồi <b>chạm hoặc vuốt</b> lên ô đất trống để gieo. Bấm 🪣 <b>Tưới hết</b> và bón phân để cây lớn nhanh hơn (phân càng đắt càng nhanh). Cây ăn quả 🌳 trồng 1 lần, thu hoạch mãi.</span></li>' +
      '<li><i>✋</i><span><b>Kéo 1 ngón</b> để di chuyển bản đồ, <b>chụm hoặc mở 2 ngón</b> để thu nhỏ, phóng to. Bấm 🏠 để quay về giữa nông trại.</span></li>' +
      '<li><i>🐔</i><span>Ở <b>Chuồng</b>, tự chọn ô đất để xây chuồng nuôi gà, bò, cừu, cá, ong, vịt, dê, heo… tuỳ ý thích và số tiền trong ví Đầu tư.</span></li>' +
      '<li><i>🏗️</i><span>Xây thềm nhà, giếng nước, lò bánh mì, xưởng phô mai… để nông trại ngày càng to đẹp.</span></li>' +
      '<li><i>🎮</i><span><b>Phụ bản:</b> chơi các game học (tiếng Anh, Toán, Lịch sử…). Toàn bộ tiền thưởng được chuyển vào nông trại. Đây là cách kiếm tiền <b>nhanh nhất</b>!</span></li>' +
      '<li><i>🎯</i><span><b>Nhiệm vụ 6 ví:</b> Thiết yếu, Phát triển bản thân, Tiết kiệm, Đầu tư, Chia sẻ, Hưởng thụ. Bỏ tiền ra làm nhiệm vụ, hoàn thành thì nhận lại tiền và <b>kinh nghiệm</b>. Đủ kinh nghiệm thì lên cấp, mở thêm đất, chuồng, vật nuôi, công trình.</span></li>' +
      '<li><i>💰</i><span>Tiền kiếm được tự chia vào <b>6 ví</b> theo tỷ lệ (chạm vào số tiền ở góc trên để xem và đổi tỷ lệ). Chi tiêu ở ví nào thì trừ tiền ví đó, ví nào hết tiền thì không tiêu được.</span></li>' +
      '<li><i>🦊</i><span>Thú hoang (cáo, sói, gấu) có thể mò vào bắt vật nuôi. Làm nhiệm vụ <b>xây hàng rào, chòi canh, chòi bắn cung</b> để bảo vệ nông trại.</span></li>' +
      '<li><i>🌧️</i><span>Khoảng 5 giờ lại có một trận mưa bão hoặc gió lốc làm hỏng hoa màu, dột nhà, hỏng chuồng, vật nuôi bị ốm. Hãy để dành <b>quỹ dự phòng</b> để sửa chữa!</span></li>' +
      '</ul><button class="fm-btn" data-a="sheetClose" style="width:100%">Bắt đầu thôi!</button></div>');
  }
  function backSheet(got) {
    var rows = Object.keys(got.sum).map(function (k) { return '<li><span>' + GM[k].e + ' ' + GM[k].n + '</span><b>+' + money(got.sum[k]) + '</b></li>'; }).join('');
    var nc = claimable();
    sheet('<div class="fm-modal"><div class="big">🧑‍🌾</div><h2>' + (got.tot ? 'Mang về +' + money(got.tot) + '!' : 'Chào mừng trở lại!') + '</h2>' +
      (got.tot ? '<p>Tiền thưởng học tập đã được chuyển vào ví nông trại' + (got.xp ? ', kèm <b>+' + got.xp + ' kinh nghiệm</b>' : '') + '.</p><ul class="fm-earnlist">' + rows + '</ul>' : '<p>Tiến độ nhiệm vụ đã được cập nhật.</p>') +
      (nc ? '<p>🎯 Có <b>' + nc + '</b> phần thưởng nhiệm vụ đang chờ nhận!</p>' : '') +
      '<div class="fm-row" style="justify-content:center">' + (nc ? '<button class="fm-btn org" data-a="tab" data-t="quest">🎯 Nhận thưởng</button>' : '') + '<button class="fm-btn" data-a="sheetClose">Tuyệt vời!</button></div></div>');
    sfx('win');
  }

  /* --- Chợ: đơn hàng + kho --- */
  function renderMarket() {
    fillOrders();
    var nOrd = S.orders.filter(canDeliver).length;
    var h = '<div class="fm-seg"><button class="' + (mSub === 'ord' ? 'on' : '') + '" data-a="msub" data-t="ord">🚚 Đơn hàng' + (nOrd ? '<span class="dot">' + nOrd + '</span>' : '') + '</button><button class="' + (mSub === 'inv' ? 'on' : '') + '" data-a="msub" data-t="inv">📦 Kho</button><button class="' + (mSub === 'buy' ? 'on' : '') + '" data-a="msub" data-t="buy">🛒 Mua hàng</button></div>';
    if (mSub === 'buy') { $('fmP_market').innerHTML = h + buyHtml(); return; }
    if (mSub === 'ord') {
      h += '<p class="fm-sub">Khách đặt hàng trả giá cao hơn bán lẻ ở chợ khoảng 20%' + (built('xetai') ? ' (xe tải: thêm 20% nữa)' : '') + '. Gom đủ hàng rồi bấm Giao hàng. Không làm được đơn nào thì bấm Đổi đơn.</p>';
      S.orders.forEach(function (o, k) {
        var ok = canDeliver(o);
        h += '<div class="fm-card fm-ord"><span class="tr">' + o.tr + '</span><div class="bd"><b class="w">' + esc(o.who) + '</b><div class="fm-need">' +
          o.it.map(function (x) { var hv = S.inv[x[0]] || 0, I = item(x[0]); return '<span class="' + (hv >= x[1] ? 'ok' : 'no') + '"><i>' + I.e + '</i>' + Math.min(hv, x[1]) + '/' + x[1] + '</span>'; }).join('') +
          '</div><div class="fm-rw">Thưởng: ' + money(orderPay(o)) + ' · +' + o.xp + ' KN</div><div class="fm-row"><button class="fm-btn" data-a="deliver" data-i="' + k + '"' + (ok ? '' : ' disabled') + '>✅ Giao hàng</button><button class="fm-btn alt" data-a="skip" data-i="' + k + '">🔄 Đổi đơn</button></div></div></div>';
      });
    } else {
      var ids = CROPS.map(function (c) { return c.id; }).concat(Object.keys(PRODUCTS)).filter(function (id) { return S.inv[id] > 0; });
      var val = ids.reduce(function (a, id) { return a + S.inv[id] * sp(id); }, 0);
      h += '<p class="fm-sub">Giá trị hàng trong kho: <b>' + money(val) + '</b>. Nên giữ lại lúa, ngô, cà rốt, hướng dương để cho vật nuôi ăn và giao đơn hàng.' + (built('nha3') ? ' Biệt thự giúp bán giá hơn 10%.' : '') + '</p>';
      if (!ids.length) h += '<div class="fm-card" style="text-align:center;color:#7a6440">Kho đang trống. Hãy ra Ruộng thu hoạch nhé! 🌾</div>';
      else h += '<div class="fm-inv">' + ids.map(function (id) { var I = item(id), q = S.inv[id];
        return '<div class="fm-it"><div class="e">' + I.e + '</div><b>' + I.n + '</b><small>Giá chợ ' + money(sp(id)) + '</small><div class="q">× ' + q + '</div><div class="fm-row"><button class="fm-btn alt" data-a="sell" data-c="' + id + '" data-q="1">Bán 1</button><button class="fm-btn" data-a="sell" data-c="' + id + '" data-q="' + q + '">Bán hết</button></div></div>'; }).join('') + '</div>';
      h += '<div class="fm-h" style="margin-top:16px">🏪 Cửa hàng vật tư</div>' +
        FERTS.map(function (f) { return '<div class="fm-card" style="display:flex;align-items:center;gap:10px"><span style="font-size:36px;font-family:' + EF + '">' + f.e + '</span><div style="flex:1"><b>' + f.n + '</b><div class="fm-sub" style="margin:2px 0 6px">' + f.d + '. Đang có ' + (S.fz[f.id] || 0) + ' túi · ' + money(f.p) + '/túi.</div><div class="fm-row" style="margin:0"><button class="fm-btn org" data-a="buyFert" data-f="' + f.id + '" data-q="1">Mua 1 túi</button><button class="fm-btn org" data-a="buyFert" data-f="' + f.id + '" data-q="5">Mua 5 (' + short(f.p * 5) + ')</button></div></div></div>'; }).join('');
    }
    h += '<div class="fm-row" style="justify-content:center;margin-top:14px"><button class="fm-btn alt" data-a="book">📒 Xem sổ thu chi</button></div>';
    $('fmP_market').innerHTML = h;
  }
  /* Mua hàng ở chợ: đắt hơn giá bán 50%, mỗi ngày chỉ được mua 3 loại sản phẩm, trừ ví Thiết yếu */
  var BUY_TYPES = 3, BUY_MUL = 1.5;
  function bp(id) { return Math.round(item(id).sell * BUY_MUL / 100) * 100; }
  function buyDay() { if (!S.bday || S.bday.d !== dayKey()) S.bday = { d: dayKey(), ids: [] }; return S.bday; }
  function buyable() {
    var ids = CROPS.filter(function (c) { return c.lv <= S.lv; }).map(function (c) { return c.id; });
    ANIMALS.forEach(function (a) { if (a.lv <= S.lv && ids.indexOf(a.p) < 0) ids.push(a.p); });
    BUILDS.forEach(function (b) { if (b.r && b.lv <= S.lv) ids.push(b.r.o); });
    return ids;
  }
  function buyHtml() {
    var D = buyDay(), left = BUY_TYPES - D.ids.length;
    var h = '<p class="fm-sub">Thiếu hàng để giao đơn, cho vật nuôi ăn hay làm nhiệm vụ? Mua ở chợ được, nhưng <b>đắt hơn giá bán ' + Math.round((BUY_MUL - 1) * 100) + '%</b>, nên tự trồng, tự nuôi vẫn lời hơn. Mua bằng ví 🏠 Thiết yếu (đang có ' + money(S.jar.essential) + ').</p>' +
      '<div class="fm-card" style="padding:10px 12px;font-size:14px">🛒 Hôm nay đã chọn <b>' + D.ids.length + '/' + BUY_TYPES + '</b> loại' + (D.ids.length ? ': ' + D.ids.map(function (id) { return item(id).e; }).join(' ') : '') + (left ? '. Còn được chọn ' + left + ' loại nữa.' : '. Hết lượt chọn loại mới, mai quay lại nhé! (Vẫn mua thêm được các loại đã chọn.)') + '</div>';
    h += '<div class="fm-inv">' + buyable().map(function (id) {
      var I = item(id), pr = bp(id), mine = D.ids.indexOf(id) >= 0, can = mine || left > 0;
      return '<div class="fm-it"' + (can ? '' : ' style="opacity:.5"') + '><div class="e">' + I.e + '</div><b>' + I.n + '</b><small>Giá mua <b style="color:#dc2626">' + money(pr) + '</b><br>(bán được ' + money(sp(id)) + ') · có ' + (S.inv[id] || 0) + '</small>' +
        (can ? '<div class="fm-row"><button class="fm-btn org" data-a="mbuy" data-c="' + id + '" data-q="1">Mua 1</button><button class="fm-btn org" data-a="mbuy" data-c="' + id + '" data-q="5">Mua 5</button></div>' : '<span class="fm-tag">Hết lượt hôm nay</span>') + '</div>';
    }).join('') + '</div>';
    return h;
  }
  function mBuy(id, q) {
    var D = buyDay(), I = item(id), c = bp(id) * q;
    if (D.ids.indexOf(id) < 0) { if (D.ids.length >= BUY_TYPES) { toast('Mỗi ngày chỉ được mua ' + BUY_TYPES + ' loại sản phẩm. Mai quay lại nhé!'); return; } }
    if (!has('essential', c)) { noMoney(c, 'essential'); return; }
    if (D.ids.indexOf(id) < 0) D.ids.push(id);
    takeMoney('essential', c); S.inv[id] = (S.inv[id] || 0) + q; addLog('out', c, 'mbuy_' + id, 'Mua ở chợ: ' + I.n, I.e, q);
    sfx('ok'); toast('🛒 Đã mua ' + q + ' ' + I.e + ' ' + I.n.toLowerCase() + ', trả ' + money(c)); save(); hud(); renderMarket();
  }
  function deliver(k) {
    var o = S.orders[k]; if (!o || !canDeliver(o)) return;
    var pay = orderPay(o);
    o.it.forEach(function (x) { S.inv[x[0]] -= x[1]; });
    addMoney(pay); addLog('in', pay, 'ord' + Date.now(), 'Giao đơn hàng cho ' + o.who, o.tr);
    ev('order'); addXP(o.xp); S.orders.splice(k, 1); fillOrders(); sfx('win'); toast('🎉 Đã giao hàng, nhận ' + money(pay)); hud(); save(); renderMarket();
  }
  function sell(id, q) {
    q = Math.min(q, S.inv[id] || 0); if (q <= 0) return;
    var I = item(id), amt = sp(id) * q;
    S.inv[id] -= q; addMoney(amt); ev('sell', id, q); addLog('in', amt, 'sell_' + id, 'Bán ' + I.n, I.e, q);
    sfx('ok'); toast('💰 Bán ' + q + ' ' + I.e + ' được ' + money(amt)); hud(); save(); renderMarket();
  }

  /* --- Xây dựng & chế biến --- */
  function bState(b) {
    if (built(b.id)) return 'done';
    if (S.lv < b.lv) return 'lv';
    if (b.req && !built(b.req)) return 'req';
    return 'buy';
  }
  function facHtml(b) {
    var f = S.fac[b.id] || { s: 0 }, r = b.r, O = PRODUCTS[r.o];
    var ins = r.i.map(function (x) { var hv = S.inv[x[0]] || 0; return '<span class="fm-tag ' + (hv >= x[1] ? 'g' : '') + '">' + item(x[0]).e + ' ' + Math.min(hv, x[1]) + '/' + x[1] + ' ' + item(x[0]).n.toLowerCase() + '</span>'; }).join('');
    var h = '<div style="margin-top:6px">' + ins + '<span class="fm-tag b">→ ' + O.e + ' ' + O.n + ' · ⏱ ' + durL(r.t) + ' · bán ' + short(O.sell) + '</span></div>';
    if (f.s === 1) {
      var p = Math.min(1, (Date.now() - f.t) / (r.t * 1000));
      h += '<div class="fm-pb"><i id="fp_' + b.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="ft_' + b.id + '">Đang làm ' + O.e + ' · còn ' + dur((1 - p) * r.t) + '</div>';
    } else if (f.s === 2) h += '<div class="fm-row"><button class="fm-btn org" data-a="facGet" data-b="' + b.id + '">' + O.e + ' Lấy ' + O.n.toLowerCase() + '</button></div>';
    else { var can = r.i.every(function (x) { return (S.inv[x[0]] || 0) >= x[1]; }); h += '<div class="fm-row"><button class="fm-btn" data-a="facGo" data-b="' + b.id + '"' + (can ? '' : ' disabled') + '>▶ Bắt đầu làm</button>' + (can ? '' : '<span class="fm-sub" style="margin:8px 0 0">Chưa đủ nguyên liệu</span>') + '</div>'; }
    return h;
  }
  function renderBuild() {
    var h = '<div class="fm-h">🏗️ Xây dựng nông trại</div><p class="fm-sub">Công trình mở khoá khi nông trại <b>đạt đủ cấp</b> (làm 🎯 Nhiệm vụ để tích kinh nghiệm), rồi trả tiền để xây. Xây xong, công trình <b>hiện trên nông trại</b> và tạo <b>thu nhập thụ động</b> mỗi giờ: chạm vào để thu tiền. Xưởng chế biến biến nông sản thành hàng có giá trị cao hơn.</p>';
    var order = BUILDS.slice().sort(function (a, b) { var o = { done: 0, buy: 1, req: 3, lv: 4 }; return o[bState(a)] - o[bState(b)] || a.lv - b.lv; });
    order.forEach(function (b) {
      var s = bState(b);
      h += '<div class="fm-card' + (s === 'done' ? ' done' : s === 'buy' ? ' hot' : s === 'lv' ? ' lock' : '') + '"><div class="fm-li"><span class="fm-ic">' + b.e + '</span><div class="bd"><b class="t">' + b.n + (s === 'done' ? ' ✅' : '') + '</b><small>' + b.d + '</small>';
      h += '<div style="margin-top:4px"><span class="fm-tag g">💰 Thu nhập +' + short(b.inc) + '/giờ</span><span class="fm-tag">' + b.src + '</span></div>';
      if (s === 'done') { if (incOf(b.id) >= 1000) h += '<div class="fm-row"><button class="fm-btn org" data-a="bsee" data-b="' + b.id + '">🪙 Ra nông trại thu ' + short(incOf(b.id)) + '</button></div>'; else h += '<div class="fm-row"><button class="fm-btn alt" data-a="bsee" data-b="' + b.id + '">📍 Xem trên nông trại</button></div>'; if (b.r) h += facHtml(b); }
      else if (s === 'buy') h += '<div class="fm-row"><button class="fm-btn org" data-a="build" data-b="' + b.id + '">🔨 Xây · ' + money(b.cost) + '</button></div>';
      else if (s === 'req') h += '<div style="margin-top:6px"><span class="fm-tag">Cần xây ' + BM[b.req].e + ' ' + BM[b.req].n + ' trước</span></div>';
      else h += '<div style="margin-top:6px"><span class="fm-tag">🔒 Mở ở cấp ' + b.lv + '</span><span class="fm-tag">Giá xây: ' + short(b.cost) + '</span></div>';
      h += '</div></div></div>';
    });
    $('fmP_build').innerHTML = h;
    facSig = BUILDS.map(function (b) { return (S.fac[b.id] || {}).s || 0; }).join('');
  }
  function tickBuild() {
    var sig = BUILDS.map(function (b) { return (S.fac[b.id] || {}).s || 0; }).join('');
    if (sig !== facSig) { renderBuild(); badges(); return; }
    BUILDS.forEach(function (b) {
      var f = S.fac[b.id]; if (!b.r || !f || f.s !== 1) return;
      var p = Math.min(1, (Date.now() - f.t) / (b.r.t * 1000)), bar = $('fp_' + b.id), tx = $('ft_' + b.id);
      if (bar) bar.style.width = Math.round(p * 100) + '%';
      if (tx) tx.textContent = 'Đang làm ' + PRODUCTS[b.r.o].e + ' · còn ' + dur((1 - p) * b.r.t);
    });
  }
  function doBuild(id) {
    var b = BM[id]; if (bState(b) !== 'buy') return;
    confirmBox(b.e, 'Xây ' + b.n + '?', b.d + '<br>Chi phí: <b>' + money(b.cost) + '</b>', 'Xây ngay', function () {
      if (!has('invest', b.cost)) { noMoney(b.cost, 'invest'); return; }
      takeMoney('invest', b.cost); S.bld[id] = Date.now(); addLog('out', b.cost, 'bld_' + id, 'Xây ' + b.n.toLowerCase(), b.e);
      S.inc[id] = Date.now();
      addXP(Math.max(5, Math.round(b.cost / 50000)));
      sfx('win'); save(); hud();
      // Đưa người chơi ra nông trại, bay tới công trình mới để thấy nông trại đã thay đổi
      var P = BPOS[id];
      setTab('field'); flyTo('field', P.x, P.y - (P.h ? 20 : 50), 1.35);
      setTimeout(function () { burst(P.x, P.y - 60, ['#fde047', '#86efac', '#fff', '#f59e0b'], 30); floatTxt(P.x, P.y - 110, '🎉 ' + b.n, '#fef08a'); }, 600);
      sheetLater('<div class="fm-modal"><div class="big">' + b.e + '</div><h2>Đã xây xong ' + b.n + '!</h2><p>Công trình đã xuất hiện trên nông trại của bạn.</p>' +
        '<div class="fm-ul"><span><i>💰</i>Thu nhập thụ động +' + short(b.inc) + '/giờ</span></div><p style="font-size:13.5px">' + b.src + '. Chạm vào công trình để thu tiền (tích tối đa ' + INC_CAP + ' giờ, nên ghé thu thường xuyên).</p>' +
        '<p style="font-size:13.5px"><b>Tác dụng:</b> ' + b.d + '</p><p style="font-size:12.5px;color:#9a8660">Bỏ ' + money(b.cost) + ' xây công trình, mỗi ngày thu về đến ' + money(b.inc * INC_CAP * 3) + ' nếu ghé thu 3 lần. Đây là <b>tài sản tạo ra thu nhập</b>!</p>' +
        '<div class="fm-row" style="justify-content:center"><button class="fm-btn" data-a="sheetClose">Tuyệt vời!</button></div></div>');
    });
  }
  function facGo(id, q) {
    var b = BM[id], r = b.r; if (!built(id)) return;
    if (S.dmg.bld[id]) { toast('💧 ' + b.n + ' bị dột, phải sửa xong mới làm được. Vào 🎯 Nhiệm vụ → Sự cố.'); return; }
    if (!r.i.every(function (x) { return (S.inv[x[0]] || 0) >= x[1]; })) { toast('Chưa đủ nguyên liệu'); return; }
    r.i.forEach(function (x) { S.inv[x[0]] -= x[1]; });
    S.fac[id] = { s: 1, t: Date.now() }; if (!q) sfx('ok'); save(); if (tab === 'build') renderBuild();
  }
  function facGet(id, q) {
    var b = BM[id], f = S.fac[id]; if (!f || f.s !== 2) return;
    var O = PRODUCTS[b.r.o]; S.inv[O.id] = (S.inv[O.id] || 0) + 1; f.s = 0; ev('make', O.id); addXP(O.xp);
    if (!q) { sfx('win'); toast('+1 ' + O.e + ' ' + O.n + ' · +' + O.xp + ' KN'); } save(); hud(); if (tab === 'build') renderBuild();
  }

  /* --- Nhiệm vụ --- */
  function playBtn(g, lbl) { return '<button class="fm-btn blu" data-a="play" data-g="' + g + '">▶ ' + (lbl || 'Chơi ngay') + '</button>'; }
  function renderQuest() {
    var wk = S.mw, W0 = WM[wk], h = fixHtml() + defHtml();
    // Mục tiêu tiếp theo (mở khoá bằng kinh nghiệm)
    var nx = nextUnlock(), nd = need(S.lv);
    if (nx) {
      h += '<button class="fm-goal" data-a="roadmap"><span class="t">🏆 Cấp ' + nx.lv + ' mở: ' + nx.u.map(function (u) { return u.e + ' ' + u.t; }).join(', ') + '</span>' +
        '<span class="fm-pb"><i style="width:' + Math.round(S.xp / nd * 100) + '%"></i></span><span class="s">Cấp ' + S.lv + ' · ' + S.xp + '/' + nd + ' KN · <u>Xem lộ trình ›</u></span></button>';
    }
    if (giftReady()) h += '<div class="fm-card hot" style="padding:9px 12px;display:flex;align-items:center;gap:10px"><span style="font-size:26px;font-family:' + EF + '">🎁</span><b style="flex:1;font-size:14px">Quà mỗi ngày: ' + money(giftAmt()) + ' + 🧪1</b><button class="fm-btn org" data-a="gift">Nhận</button></div>';
    var list = MISSIONS.filter(function (m) { return m.w === wk; }), st = S.wl[wk] || { o: 0, i: 0, n: 0 };
    var done = list.filter(function (m) { var e = mSt(m); return e && e.s === 2; });
    h += '<details class="fm-whead" style="--wc:' + W0.c + '"' + (S.wseen && S.wseen[wk] ? '' : ' open') + ' data-w="' + wk + '"><summary><b>' + W0.e + ' Ví ' + W0.n + '</b><span class="fm-wst">Số dư <b style="color:#1d4ed8">' + short(S.jar[wk]) + '</b> · Chi <b style="color:#dc2626">' + short(st.o) + '</b> · Nhận <b style="color:#15803d">' + short(st.i) + '</b> · Xong <b>' + done.length + '/' + list.length + '</b></span></summary><p>' + W0.d + '</p><p class="q">' + W0.q + '</p></details>';
    var act = list.filter(function (m) { var e = mSt(m); return e && e.s === 1; });
    var avail = list.filter(function (m) { return !mSt(m) && S.lv >= m.lv; }).sort(function (a, b) { return (reqOk(b) ? 1 : 0) - (reqOk(a) ? 1 : 0) || b.lv - a.lv; });
    var lock = list.filter(function (m) { return !mSt(m) && S.lv < m.lv; }).sort(function (a, b) { return a.lv - b.lv; });
    if (act.length) { h += '<div class="fm-h2">⏳ Đang làm (' + act.length + '/' + MAX_ACTIVE + ')</div>'; act.forEach(function (m) { h += mCard(m, 'act'); }); }
    var full = act.length >= MAX_ACTIVE;
    h += '<div class="fm-h2">📋 Nhiệm vụ có thể nhận (' + avail.length + ')</div>';
    if (full) h += '<p class="fm-sub">Ví này đang làm ' + MAX_ACTIVE + ' nhiệm vụ. Hoàn thành bớt rồi nhận thêm nhé!</p>';
    if (!avail.length) h += '<div class="fm-card" style="text-align:center;color:#7a6440">Đã nhận hết nhiệm vụ ở cấp này. Lên cấp để có nhiệm vụ mới! 🌟</div>';
    var showN = qMore[wk] ? avail.length : 6;
    avail.slice(0, showN).forEach(function (m) { h += mCard(m, full ? 'full' : 'new'); });
    if (avail.length > showN) h += '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="qmore">Xem thêm ' + (avail.length - showN) + ' nhiệm vụ ▾</button></div>';
    if (lock.length) { h += '<div class="fm-h2">🔒 Sắp mở</div>'; lock.slice(0, 3).forEach(function (m) { h += mCard(m, 'lock'); }); }
    if (done.length) {
      h += '<details class="fm-done"><summary>✅ Đã hoàn thành ' + done.length + ' nhiệm vụ</summary>' + done.map(function (m) { var e = mSt(m); return '<div class="fm-log"><span class="e">' + m.e + '</span><span class="t">' + esc(m.n) + '</span><span class="a in">+' + short(e.p || 0) + '</span></div>'; }).join('') + '</details>';
    }
    var tot = MISSIONS.filter(function (m) { var e = mSt(m); return e && e.s === 2; }).length;
    h += '<p class="fm-sub" style="text-align:center;margin-top:10px">Tổng cộng đã hoàn thành ' + tot + '/' + MISSIONS.length + ' nhiệm vụ ở 6 ví</p>';
    var pn = $('fmP_quest');
    pn.innerHTML = h;
    walletBar(); var wt = $('fmWB'), on = wt && wt.querySelector('.on'); if (on && (on.offsetLeft < wt.scrollLeft || on.offsetLeft + on.offsetWidth > wt.scrollLeft + wt.clientWidth)) wt.scrollLeft = on.offsetLeft - 20;
    qSig = questSig();
  }
  var qMore = {}, qSig = '';
  function mCard(m, mode) {
    var e = mSt(m), p = mProg(m), c = e && e.c != null ? e.c : mCost(m), rq = !reqOk(m);
    var cls = mode === 'lock' ? ' lock' : mode === 'act' && p >= 1 ? ' hot' : '';
    var h = '<div class="fm-card' + cls + '"><div class="fm-li"><span class="fm-ic">' + (mode === 'lock' ? '🔒' : m.e) + '</span><div class="bd"><b class="t">' + esc(m.n) + '</b><small>' + m.d + '</small>' +
      '<div><span class="fm-tag b">' + mTask(m) + '</span></div><div>' +
      (m.pct && !e ? '<span class="fm-tag">Chi: ' + Math.round(m.pct * 100) + '% số tiền (≈' + short(c) + ')</span>' : c ? '<span class="fm-tag">Chi: −' + short(c) + '</span>' : '<span class="fm-tag g">Miễn phí</span>') +
      (m.w === 'saving' ? '<span class="fm-tag g">Nhận: ' + mPayText(m, c) + ' (lãi ' + Math.round(m.rate * 100) + '%)</span>' : m.rng ? '<span class="fm-tag g">Nhận: ' + mPayText(m, c) + ' (lãi hoặc lỗ)</span>' : m.pay ? '<span class="fm-tag g">Nhận: +' + short(m.pay) + '</span>' : '<span class="fm-tag">Không hoàn tiền</span>') +
      '<span class="fm-tag">+' + m.xp + ' KN</span>' + (m.fert ? '<span class="fm-tag">🧪 +' + m.fert + '</span>' : '') + '</div>';
    if (mode === 'lock') h += '<div style="margin-top:6px"><span class="fm-tag">🔒 Mở ở cấp ' + m.lv + '</span></div>';
    else if (mode === 'act') {
      var wt = m.k === 'wait', left = wt ? Math.max(0, m.s - (Date.now() - e.t) / 1000) : 0;
      h += '<div class="fm-pb"><i id="mp_' + m.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="mt_' + m.id + '">' + mProgText(m) + '</div><div class="fm-row">';
      if (m.k === 'give') h += '<button class="fm-btn org" data-a="mclaim" data-m="' + m.id + '"' + (p >= 1 ? '' : ' disabled') + '>🎁 Giao hàng</button>';
      else if (p >= 1) h += '<button class="fm-btn org" data-a="mclaim" data-m="' + m.id + '">🎁 Nhận ' + (m.rng ? 'kết quả' : 'thưởng') + '</button>';
      else if (m.k === 'learn') h += '<button class="fm-btn blu" data-a="mgo" data-m="' + m.id + '">▶ Vào học</button>';
      else if (m.k === 'farm') h += '<button class="fm-btn blu" data-a="mgo" data-m="' + m.id + '">🌱 Đi làm</button>';
      if (p < 1 || m.k === 'give') h += '<button class="fm-btn alt" data-a="mcancel" data-m="' + m.id + '">' + (m.w === 'saving' ? '🐷 Rút trước hạn' : 'Bỏ') + '</button>';
      h += '</div>';
    } else {
      h += '<div class="fm-row">' + (rq ? '<span class="fm-tag">' + reqText(m) + '</span>' : '<button class="fm-btn' + (m.w === 'share' || m.w === 'saving' ? ' org' : '') + '" data-a="mstart" data-m="' + m.id + '"' + (mode === 'full' ? ' disabled' : '') + '>' + (c ? '💸 Thực hiện · −' + short(c) : '✋ Thực hiện') + '</button>') + '</div>';
    }
    return h + '</div></div></div>';
  }
  function mProgText(m) {
    var e = mSt(m); if (!e) return '';
    if (m.k === 'wait') { var left = m.s - (Date.now() - e.t) / 1000; return left > 0 ? '⏱ Còn ' + dur(left) : '✅ Đã xong, bấm nhận!'; }
    if (m.k === 'give') return m.it.map(function (x) { var hv = S.inv[x[0]] || 0; return item(x[0]).e + ' ' + Math.min(hv, x[1]) + '/' + x[1]; }).join(' · ');
    var n = Math.min(m.c, mCur(m) - e.b); return n + '/' + m.c + (m.k === 'learn' ? (m.g === 'en' || m.g === 'zh' ? ' từ' : m.g === 'clock' ? ' giờ' : ' câu') : '');
  }
  function questSig() { return S.fix.map(function (f) { return f.id + f.s; }).join() + JSON.stringify(S.def) + '#' + MISSIONS.filter(function (m) { var e = mSt(m); return e && e.s === 1; }).map(function (m) { return m.id + (mProg(m) >= 1 ? 1 : 0); }).join(',') + '|' + S.lv + giftReady(); }
  function tickQuest() {
    if (questSig() !== qSig) { renderQuest(); badges(); return; }
    DEFS.forEach(function (D) {
      var d = S.def[D.id]; if (!d || d.s !== 1) return; var p = Math.min(1, (Date.now() - d.st) / (D.t * 1000)), b = $('dp_' + D.id), t = $('dt_' + D.id);
      if (b) b.style.width = Math.round(p * 100) + '%'; if (t) t.textContent = '🔨 Đang xây · còn ' + dur((1 - p) * D.t);
    });
    S.fix.forEach(function (f) {
      if (f.s !== 1) return; var p = Math.min(1, (Date.now() - f.st) / (FIXD[f.t][0] * 1000)), b = $('xp_' + f.id), t = $('xt_' + f.id);
      if (b) b.style.width = Math.round(p * 100) + '%'; if (t) t.textContent = '🔧 Đang sửa · còn ' + dur((1 - p) * FIXD[f.t][0]);
    });
    MISSIONS.forEach(function (m) {
      var e = mSt(m); if (!e || e.s !== 1 || m.k !== 'wait') return;
      var b = $('mp_' + m.id), t = $('mt_' + m.id);
      if (b) b.style.width = Math.round(mProg(m) * 100) + '%'; if (t) t.textContent = mProgText(m);
    });
  }
  function roadmap() {
    var h = '<div class="fm-h">🗺️ Lộ trình mở khoá</div><p class="fm-sub">Làm nhiệm vụ ở 6 ví để tích kinh nghiệm (KN). Đủ KN thì lên cấp và mở thêm đất, chuồng, vật nuôi, công trình.</p>';
    for (var l = 2; l <= 20; l++) {
      var u = unlocksAt(l); if (!u.length) continue;
      h += '<div class="fm-card' + (S.lv >= l ? ' done' : '') + '" style="padding:10px"><b>' + (S.lv >= l ? '✅' : '🔒') + ' Cấp ' + l + '</b><div class="fm-ul" style="justify-content:flex-start;margin:6px 0 0">' + u.map(function (x) { return '<span><i>' + x.e + '</i>' + x.t + '</span>'; }).join('') + '</div></div>';
    }
    sheet(h + '<button class="fm-btn" data-a="sheetClose" style="width:100%">Đóng</button>');
  }
  function navScroll() {
    var nv = $('fmNavS'), b = nv.querySelector('button.on'); if (!b) return;
    var l = b.offsetLeft, r = l + b.offsetWidth;
    if (l < nv.scrollLeft + 24) nv.scrollTo({ left: Math.max(0, l - 24), behavior: 'smooth' });
    else if (r > nv.scrollLeft + nv.clientWidth - 24) nv.scrollTo({ left: r - nv.clientWidth + 24, behavior: 'smooth' });
  }

  /* --- Kiếm tiền --- */
  function renderEarn() {
    var tot = 0; GAMES.forEach(function (g) { tot += (S.gs[g.k] || {}).earn || 0; });
    var h = '<div class="fm-hero"><b>🎮 Phụ bản: kiếm thêm tiền cho nông trại</b><p>Học mà chơi, chơi mà học! <b>Toàn bộ tiền thưởng</b> trong các trò chơi dưới đây được chuyển vào ví nông trại, kèm điểm kinh nghiệm. Một lượt chơi tốt có thể mang về 100.000đ – 300.000đ.</p><p>Đã mang về tổng cộng: <b>' + money(tot) + '</b></p></div>';
    var need = {};
    MISSIONS.forEach(function (m) { if (m.k === 'learn' && mSt(m) && mSt(m).s === 1 && !mDone(m)) need[m.g] = 1; });
    GAMES.forEach(function (g) {
      var gs = S.gs[g.k] || { ok: 0, earn: 0 };
      h += '<div class="fm-card' + (need[g.k] ? ' hot' : '') + '"><div class="fm-li"><span class="fm-ic">' + g.e + '</span><div class="bd"><b class="t">' + g.n + '</b><small>' + g.d + '</small>' +
        '<div>' + (need[g.k] ? '<span class="fm-tag">📚 Đang có khoá học</span>' : '') + '<span class="fm-tag g">Đã mang về ' + short(gs.earn) + '</span><span class="fm-tag b">Đúng ' + gs.ok + ' ' + g.u + '</span></div>' +
        '<div class="fm-row">' + playBtn(g.k, 'Chơi') + '</div></div></div></div>';
    });
    h += '<p class="fm-sub" style="text-align:center">Chơi xong, bấm ← hoặc ✕ để thoát game là tự quay về nông trại.</p>';
    $('fmP_earn').innerHTML = h;
  }
  function play(g, t) {
    if (!window.farmPlay) { toast('Hãy mở Nông trại từ app 6PAY để chơi các game học.'); return; }
    retTab = tab === 'quest' ? 'quest' : 'earn'; save(); window.farmPlay(g, t ? { topic: t } : null);
  }

  /* --- 6 ví: số dư, cài đặt tỷ lệ, chuyển tiền --- */
  function jarSheet() {
    var h = '<div class="fm-h">💰 6 ví của nông trại</div><p class="fm-sub">Mọi khoản thu (bán hàng, đơn hàng, học tập, thưởng…) được <b>tự chia vào 6 ví</b> theo tỷ lệ bên dưới. Chi tiêu ở đâu thì trừ tiền ở ví đó: hạt giống, phân bón, sửa chữa trừ ví Thiết yếu; mua đất, vật nuôi, xây công trình trừ ví Đầu tư. <b>Ví nào có bao nhiêu thì chỉ được tiêu bấy nhiêu</b>, không chuyển tiền qua lại giữa các ví.</p>' +
      '<div class="fm-card" style="text-align:center;padding:10px">Tổng tiền: <b style="font-size:20px">' + money(S.m) + '</b></div>';
    WALLETS.forEach(function (W0) {
      var v = S.jar[W0.k], tot = S.m || 1;
      h += '<div class="fm-jar" style="--wc:' + W0.c + '"><span class="e">' + W0.e + '</span><span class="t"><b>' + W0.n + '</b><small>Nhận ' + pctOf(W0.k) + '% mỗi khoản thu</small><span class="bar"><i style="width:' + Math.max(0, Math.min(100, Math.round(v / tot * 100))) + '%"></i></span></span><span class="v">' + money(v) + '</span></div>';
    });
    h += '<div class="fm-row" style="justify-content:center;margin-top:10px"><button class="fm-btn org" data-a="pctSet">⚙️ Cài đặt tỷ lệ</button></div>' +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="book">📒 Sổ thu chi</button><button class="fm-btn alt" data-a="sheetClose">Đóng</button></div>';
    sheet(h);
  }
  function pctSheet() {
    var h = '<div class="fm-h">⚙️ Tỷ lệ chia tiền vào 6 ví</div><p class="fm-sub"><b>Dùng chung với tỷ lệ ở trang chủ app 6PAY</b>: đổi ở đây thì app cũng đổi theo, và ngược lại. Ví Hưởng thụ nhận phần còn lại. Đổi tỷ lệ thì <b>số dư cả 6 ví được tính lại ngay</b> (giống app), tổng tiền không đổi.</p><div class="fm-row" style="margin-bottom:8px">' +
      PCT_PRESETS.map(function (x, i) { return '<button class="fm-btn alt" data-a="pctPre" data-i="' + i + '" style="flex:1;padding:8px 6px;font-size:12.5px"><b>' + x.n + '</b><br><small>' + [x.p.essential, x.p.education, x.p.saving, x.p.invest, x.p.share, 100 - x.p.essential - x.p.education - x.p.saving - x.p.invest - x.p.share].join('/') + '</small></button>'; }).join('') + '</div>';
    WALLETS.slice(0, 5).forEach(function (W0) { h += '<div class="fm-jar" style="--wc:' + W0.c + '"><span class="e">' + W0.e + '</span><span class="t"><b>' + W0.n + '</b></span><span class="v"><input class="fm-in" id="fpc_' + W0.k + '" type="number" inputmode="numeric" min="0" max="100" value="' + curPct()[W0.k] + '"> %</span></div>'; });
    h += '<div class="fm-jar" style="--wc:' + WM.enjoy.c + '"><span class="e">🎉</span><span class="t"><b>Hưởng thụ (còn lại)</b></span><span class="v" id="fpcE">' + pctOf('enjoy') + '%</span></div><div id="fpcErr" class="fm-sub" style="color:#dc2626;text-align:center"></div>' +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="jars">Huỷ</button><button class="fm-btn" id="fpcOk" data-a="pctOk">✓ Xác nhận</button></div>';
    sheet(h);
  }
  function pctLive() {
    var sm = 0; JK.slice(0, 5).forEach(function (k) { sm += Math.max(0, parseInt($('fpc_' + k).value, 10) || 0); });
    $('fpcE').textContent = (100 - sm) + '%'; $('fpcOk').disabled = sm > 100; $('fpcErr').textContent = sm > 100 ? 'Tổng tỷ lệ vượt quá 100%. Hãy giảm bớt.' : '';
  }


  /* --- Sổ thu chi --- */
  function renderBook() {
    var prof = S.tin - S.tout, today = new Date(); today.setHours(0, 0, 0, 0);
    var ti = 0, to = 0; S.log.forEach(function (l) { if (l.ts >= today.getTime()) { if (l.k === 'in') ti += l.a; else to += l.a; } });
    var learn = 0; GAMES.forEach(function (g) { learn += (S.gs[g.k] || {}).earn || 0; });
    var h = '<div class="fm-h">📒 Sổ thu chi nông trại</div><p class="fm-sub">Người nông dân giỏi luôn ghi chép: tiền vào (thu) và tiền ra (chi). <b>Lãi = Thu − Chi</b>. Vốn ban đầu: ' + money(S.start) + '.</p>' +
      '<div class="fm-sum"><div>Tổng thu<b style="color:#15803d">' + short(S.tin) + '</b></div><div>Tổng chi<b style="color:#dc2626">' + short(S.tout) + '</b></div><div>' + (prof >= 0 ? 'Lãi' : 'Lỗ') + '<b style="color:' + (prof >= 0 ? '#15803d' : '#dc2626') + '">' + short(prof) + '</b></div></div>' +
      '<div class="fm-card" style="font-size:14px">📅 Hôm nay: thu <b style="color:#15803d">' + money(ti) + '</b>, chi <b style="color:#dc2626">' + money(to) + '</b> → ' + (ti - to >= 0 ? 'lãi' : 'lỗ') + ' <b>' + money(Math.abs(ti - to)) + '</b></div>' +
      '<div class="fm-card" style="font-size:14px">🎓 Tiền kiếm được từ học tập: <b style="color:#15803d">' + money(learn) + '</b>' + (S.tin ? ' (' + Math.round(learn / S.tin * 100) + '% tổng thu)' : '') + '</div>' +
      (function () {
        var to = 0; WALLETS.forEach(function (x) { to += (S.wl[x.k] || {}).o || 0; });
        return '<div class="fm-card"><b>👛 Chi tiêu theo 6 ví</b><div class="fm-sub" style="margin:4px 0 6px">Bạn đã chia tiền vào các ví như thế nào? Người quản lý giỏi chi cho cả 6 ví, không dồn hết vào một chỗ.</div><table class="fm-tb"><tr><th></th><th>Ví</th><th>Đã chi</th><th>Tỉ lệ</th><th>Đã nhận</th></tr>' +
          WALLETS.map(function (x) { var q = S.wl[x.k] || { o: 0, i: 0, n: 0 }; return '<tr><td class="e">' + x.e + '</td><td>' + x.n + '<br><small style="color:#9a8660">' + q.n + ' nhiệm vụ</small></td><td style="color:#dc2626">' + short(q.o) + '</td><td>' + (to ? Math.round(q.o / to * 100) : 0) + '%</td><td class="g">' + short(q.i) + '</td></tr>'; }).join('') + '</table></div>';
      })() +
      '<div class="fm-card"><b>📊 Bảng tính lãi từng loại cây</b><div class="fm-sub" style="margin:4px 0 6px">Lãi mỗi phút = lãi ÷ số phút cây lớn (chưa tưới). Dùng để chọn cây có lợi nhất.</div><table class="fm-tb"><tr><th></th><th>Cây</th><th>Lãi/cây</th><th>Thời gian</th><th>Lãi/phút</th></tr>' +
      CROPS.map(function (c) { var pr = c.per ? c.sell : c.sell - c.cost, tt = c.per ? c.re : c.t; return '<tr' + (c.lv > S.lv ? ' style="opacity:.45"' : '') + '><td class="e">' + c.e + '</td><td>' + c.n + (c.per ? ' 🌳' : '') + '</td><td class="g">+' + short(pr) + '</td><td>' + durL(tt) + '</td><td class="g">' + short(Math.round(pr / (tt / 60))) + '</td></tr>'; }).join('') + '</table></div>' +
      '<div class="fm-card"><b>🧾 Ghi chép gần đây</b>';
    if (!S.log.length) h += '<div class="fm-sub" style="margin-top:6px">Chưa có khoản nào. Gieo hạt đầu tiên nhé!</div>';
    S.log.slice(0, 60).forEach(function (l) {
      var d = new Date(l.ts);
      h += '<div class="fm-log"><span class="e">' + l.e + '</span><span class="t">' + esc(l.n) + (l.q > 1 ? ' × ' + l.q : '') + '<small>' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' · ' + d.getDate() + '/' + (d.getMonth() + 1) + '</small></span><span class="a ' + l.k + '">' + (l.k === 'in' ? '+' : '−') + money(l.a) + '</span></div>';
    });
    $('fmP_book').innerHTML = h + '</div><div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="reset">↺ Chơi lại từ đầu</button></div>';
  }

  /* ================= CHUYỂN TAB ================= */
  var PANELS = ['build', 'market', 'quest', 'earn', 'book'];
  function setTab(t) {
    tab = t; closeSheet();
    var nb = $('fmNav').querySelectorAll('button'); for (var i = 0; i < nb.length; i++) nb[i].classList.toggle('on', nb[i].getAttribute('data-t') === t || (t === 'book' && nb[i].getAttribute('data-a') === 'book'));
    PANELS.forEach(function (p) { $('fmP_' + p).classList.toggle('on', p === t); });
    stage.style.visibility = (t === 'field' || t === 'barn') ? 'visible' : 'hidden';
    $('fmTools').style.display = t === 'field' ? '' : 'none';
    if (t === 'build') renderBuild(); else if (t === 'market') renderMarket(); else if (t === 'quest') renderQuest(); else if (t === 'earn') renderEarn(); else if (t === 'book') renderBook();
    var pn = $('fmP_' + t); if (pn) pn.scrollTop = 0;
    useCam(); badges(); navScroll(); walletBar();
  }

  /* ================= SỰ KIỆN: CHẠM, KÉO, CHỤM 2 NGÓN ================= */
  function pt(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  var PTR = {}, G = null, SLOP = 8;
  function nPtr() { return Object.keys(PTR).length; }
  function twoPts() { var k = Object.keys(PTR); return [PTR[k[0]], PTR[k[1]]]; }
  function startPinch() {
    var q = twoPts(), mx = (q[0].x + q[1].x) / 2, my = (q[0].y + q[1].y) / 2;
    G = { mode: 'pinch', d0: Math.max(20, Math.hypot(q[0].x - q[1].x, q[0].y - q[1].y)), z0: cam.z, wm: toWorld({ x: mx, y: my }) };
  }
  function startPan(p) { G = { mode: 'pan', sx: p.x, sy: p.y, cx: cam.x, cy: cam.y, hist: [{ x: p.x, y: p.y, t: performance.now() }] }; }
  function endPaint() { if (drag) { drag = null; save(); } }
  stage.addEventListener('pointerdown', function (e) {
    if (e.target !== cv || !cam) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var p = pt(e); PTR[e.pointerId] = p;
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    INERT = null; CANIM = null;
    var n = nPtr();
    if (n === 1) {
      G = { mode: 'tap', sx: p.x, sy: p.y, cx: cam.x, cy: cam.y, hist: [{ x: p.x, y: p.y, t: performance.now() }] };
      if (tab === 'field') {
        var w = toWorld(p), i = plotAt(w.x, w.y);
        if (i >= 0 && actionable(i)) {
          // Bắt đầu trên ô có việc để làm: giữ/vuốt để gieo, tưới, bón, thu hoạch hàng loạt
          G.mode = 'paintWait'; G.i = i;
          G.timer = setTimeout(function () { if (G && G.mode === 'paintWait') { G.mode = 'paint'; drag = { last: G.i }; act(G.i, true); } }, 170);
        }
      }
    } else if (n === 2) {
      if (G && G.timer) clearTimeout(G.timer);
      endPaint(); startPinch();
    }
  });
  stage.addEventListener('pointermove', function (e) {
    if (!PTR[e.pointerId] || !G) return;
    var p = pt(e); PTR[e.pointerId] = p;
    if (G.mode === 'pinch') {
      if (nPtr() < 2) return;
      var q = twoPts(), mx = (q[0].x + q[1].x) / 2, my = (q[0].y + q[1].y) / 2, d = Math.hypot(q[0].x - q[1].x, q[0].y - q[1].y);
      cam.z = Math.max(minZ(tab), Math.min(MAXZ, G.z0 * d / G.d0));
      cam.x = G.wm.x - mx / cam.z; cam.y = G.wm.y - my / cam.z; clampCam(cam, tab);
      return;
    }
    var moved = Math.hypot(p.x - G.sx, p.y - G.sy) > SLOP;
    if (G.mode === 'paintWait' && moved) { clearTimeout(G.timer); G.mode = 'paint'; drag = { last: G.i }; act(G.i, true); }
    else if (G.mode === 'tap' && moved) { G.mode = 'pan'; }
    if (G.mode === 'paint') {
      var w = toWorld(p), i = plotAt(w.x, w.y);
      if (i !== drag.last) { drag.last = i; if (plotOpen(i)) act(i, false); }
    } else if (G.mode === 'pan') {
      cam.x = G.cx - (p.x - G.sx) / cam.z; cam.y = G.cy - (p.y - G.sy) / cam.z; clampCam(cam, tab);
      var now = performance.now(); G.hist.push({ x: p.x, y: p.y, t: now }); while (G.hist.length > 2 && now - G.hist[0].t > 100) G.hist.shift();
    }
  });
  function ptrEnd(e, cancel) {
    if (!PTR[e.pointerId]) return;
    delete PTR[e.pointerId];
    if (!G) return;
    var n = nPtr();
    if (G.mode === 'pinch') {
      if (n === 1) { var k = Object.keys(PTR)[0]; startPan(PTR[k]); }
      else if (n === 0) G = null;
      return;
    }
    if (n > 0) return;
    var g = G; G = null;
    if (g.timer) clearTimeout(g.timer);
    if (cancel) { endPaint(); return; }
    if (g.mode === 'paintWait') { act(g.i, true); save(); }
    else if (g.mode === 'paint') endPaint();
    else if (g.mode === 'tap') {
      var w = toWorld({ x: g.sx, y: g.sy });
      if (tab === 'barn') tapBarn(w.x, w.y); else if (!tapBuilding(w.x, w.y)) { act(plotAt(w.x, w.y), true); save(); }
    } else if (g.mode === 'pan') {
      // Thả tay khi đang vuốt nhanh: bản đồ trôi thêm một chút (quán tính)
      var h = g.hist, a = h[0], b = h[h.length - 1], dt = (b.t - a.t) / 1000;
      if (dt > 0.01 && performance.now() - b.t < 80) { var vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt, sp = Math.hypot(vx, vy); if (sp > 150) { var mx = 2600 / Math.max(sp, 2600); INERT = { vx: vx * mx, vy: vy * mx }; } }
    }
  }
  stage.addEventListener('pointerup', function (e) { ptrEnd(e, false); });
  stage.addEventListener('pointercancel', function (e) { ptrEnd(e, true); });
  stage.addEventListener('wheel', function (e) {
    if (!cam || (tab !== 'field' && tab !== 'barn')) return;
    e.preventDefault();
    var p = pt(e);
    if (e.ctrlKey || Math.abs(e.deltaY) >= Math.abs(e.deltaX)) zoomAt(p.x, p.y, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)));
    else { INERT = null; cam.x += e.deltaX / cam.z; clampCam(cam, tab); }
  }, { passive: false });
  // Safari trên iPhone/iPad: chặn cử chỉ phóng to cả trang khi đang chụm 2 ngón trong game
  ['gesturestart', 'gesturechange'].forEach(function (t) { stage.addEventListener(t, function (e) { e.preventDefault(); }); });

  ov.addEventListener('input', function (e) { if (e.target && e.target.id && e.target.id.indexOf('fpc_') === 0) pctLive(); });
  ov.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null;
    if (!el) { if (e.target === $('fmSheet')) closeSheet(); return; }
    if (el.disabled) return;
    var a = el.getAttribute('data-a');
    if (a === 'close') api.close();
    else if (a === 'back') { if ($('fmSheet').classList.contains('on')) closeSheet(); else if (tab !== 'field') setTab('field'); else api.close(); }
    else if (a === 'tab') setTab(el.getAttribute('data-t'));
    else if (a === 'book') setTab('book');
    else if (a === 'msub') { mSub = el.getAttribute('data-t'); renderMarket(); }
    else if (a === 'tool') { var t = el.getAttribute('data-t'); if (t === 'seed' && tool === 'seed') seedSheet(); if (t === 'fert' && tool === 'fert') fertSheet(); tool = t; toolsUI(); if (t === 'water') toast('🚿 Chạm hoặc vuốt qua các ô đang trồng để tưới'); else if (t === 'fert') toast('🧪 Chạm vào cây đang lớn để bón phân (còn ' + S.fert + ' túi)'); }
    else if (a === 'pick') { S.sel = el.getAttribute('data-c'); tool = 'seed'; toolsUI(); closeSheet(); save(); toast(CM[S.sel].e + ' Chạm hoặc vuốt lên ô đất trống để gieo ' + CM[S.sel].n); }
    else if (a === 'harvestAll') { var n = 0; for (var i = 0; i < TOTAL; i++) { var pl = S.plots[i]; if (plotOpen(i) && pl.c && pl.p >= 1 && !pl.dmg) { harvest(i, true); n++; } } if (n) { sfx('ok'); toast('🧺 Thu hoạch ' + n + ' ô'); } else toast('Chưa có cây nào chín ✨'); hud(); save(); }
    else if (a === 'waterAll') { var w = 0; for (var j = 0; j < TOTAL; j++) if (plotOpen(j) && water(j)) w++; if (w) { sfx('ok'); toast('🪣 Đã tưới ' + w + ' ô'); } else toast('Không có ô nào cần tưới'); save(); }
    else if (a === 'sheetClose') closeSheet();
    else if (a === 'confirm') { closeSheet(); if (confirmFn) confirmFn(); confirmFn = null; }
    else if (a === 'deliver') deliver(+el.getAttribute('data-i'));
    else if (a === 'skip') { S.orders.splice(+el.getAttribute('data-i'), 1); fillOrders(); save(); renderMarket(); badges(); }
    else if (a === 'sell') sell(el.getAttribute('data-c'), +el.getAttribute('data-q'));
    else if (a === 'buyFert') { var q = +el.getAttribute('data-q'), FF = FZM[el.getAttribute('data-f') || 'f1'], c = q * FF.p; if (!has('essential', c)) { noMoney(c, 'essential'); return; } takeMoney('essential', c); S.fz[FF.id] += q; addLog('out', c, 'fert_' + FF.id, 'Mua ' + FF.n.toLowerCase(), FF.e, q); sfx('ok'); hud(); save(); if ($('fmSheet').classList.contains('on')) fertSheet(); else renderMarket(); }
    else if (a === 'pickF') { S.selF = el.getAttribute('data-f'); tool = 'fert'; toolsUI(); closeSheet(); save(); toast(FZM[S.selF].e + ' Chạm vào cây đang lớn để bón ' + FZM[S.selF].n.toLowerCase()); }
    else if (a === 'chop') { var ci = +el.getAttribute('data-i'), cp = S.plots[ci]; cp.c = null; cp.p = 0; cp.w = 0; cp.n = 0; closeSheet(); save(); sfx('ok'); toast('🪓 Đã chặt cây. Ô đất trống, có thể gieo cây khác.'); }
    else if (a === 'build') doBuild(el.getAttribute('data-b'));
    else if (a === 'facGo') facGo(el.getAttribute('data-b'));
    else if (a === 'facGet') facGet(el.getAttribute('data-b'));
    else if (a === 'play') play(el.getAttribute('data-g'));
    else if (a === 'wtab') { S.wseen = S.wseen || {}; if (tab === 'quest') S.wseen[S.mw] = 1; S.mw = el.getAttribute('data-w'); save(); if (tab !== 'quest') setTab('quest'); else renderQuest(); var pq = $('fmP_quest'), wh = pq.querySelector('.fm-whead'); pq.scrollTop = wh ? wh.offsetTop - 8 : 0; }
    else if (a === 'mstart') mStart(el.getAttribute('data-m'));
    else if (a === 'mclaim') mClaim(el.getAttribute('data-m'));
    else if (a === 'mcancel') mCancel(el.getAttribute('data-m'));
    else if (a === 'mgo') mGo(el.getAttribute('data-m'));
    else if (a === 'qmore') { qMore[S.mw] = 1; renderQuest(); }
    else if (a === 'roadmap') roadmap();
    else if (a === 'mbuy') mBuy(el.getAttribute('data-c'), +el.getAttribute('data-q'));
    else if (a === 'penBuild') penBuild(+el.getAttribute('data-i'), el.getAttribute('data-k'));
    else if (a === 'fixGo') fixStart(el.getAttribute('data-f'));
    else if (a === 'defGo') defStart(el.getAttribute('data-d'));
    else if (a === 'jars') jarSheet();
    else if (a === 'pctSet') pctSheet();
    else if (a === 'pctPre') { var pp = PCT_PRESETS[+el.getAttribute('data-i')].p; JK.slice(0, 5).forEach(function (k) { $('fpc_' + k).value = pp[k]; }); pctLive(); }
    else if (a === 'pctOk') { var sm = 0, np = {}; JK.slice(0, 5).forEach(function (k) { np[k] = Math.max(0, Math.min(100, parseInt($('fpc_' + k).value, 10) || 0)); sm += np[k]; }); if (sm > 100) return; S.pct = np; try { if (window.sixPct) window.sixPct.set(np); } catch (e) {} syncM(); save(); hud(); if (tab === 'quest') renderQuest(); toast('✓ Đã lưu tỷ lệ. Số dư 6 ví đã được chia lại theo tỷ lệ mới.'); jarSheet(); }
    else if (a === 'bsee') { var P = BPOS[el.getAttribute('data-b')]; setTab('field'); flyTo('field', P.x, P.y - (P.h ? 20 : 50), 1.35); toast('Chạm vào công trình để thu tiền và lấy hàng'); }
    else if (a === 'zin') zoomAt(W / 2, (H - bottomPad(tab)) / 2, 1.3);
    else if (a === 'zout') zoomAt(W / 2, (H - bottomPad(tab)) / 2, 1 / 1.3);
    else if (a === 'zhome') { INERT = null; var hc = homeCam(tab); CANIM = { k: tab, from: { x: cam.x, y: cam.y, z: cam.z }, to: hc, t: 0 }; }
    else if (a === 'gift') { if (giftReady()) { var gm = giftAmt(); S.gift = dayKey(); addMoney(gm); S.fz.f1++; addLog('in', gm, 'gift', 'Quà mỗi ngày', '🎁'); sfx('win'); toast('🎁 Nhận ' + money(gm) + ' và 1 túi phân bón'); save(); hud(); renderQuest(); } }
    else if (a === 'reset') confirmBox('↺', 'Chơi lại từ đầu?', 'Toàn bộ ruộng, vật nuôi, công trình, kho và sổ thu chi sẽ bị xoá.', 'Xoá và chơi lại', function () { try { localStorage.removeItem(KEY); } catch (e) {} load(); POS = {}; CAMS = { field: null, barn: null }; save(); hud(); setTab('field'); guide(); });
  });
  window.addEventListener('resize', function () { if (running) resize(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && running) save(); });

  /* ================= API CÔNG KHAI ================= */
  var api = {
    open: function (o) {
      load(); var got = drain(); update(Date.now()); fillOrders(); checkDisasterLater = true;
      ov.classList.add('on'); document.body.style.overflow = 'hidden';
      tool = 'seed';
      setTab(o && o.back ? retTab : 'field');
      requestAnimationFrame(function () {
        resize(); hud(); running = true; lastT = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
        if (!S.seen) { S.seen = 1; S.tipCam = 1; save(); guide(); }
        else if (got) backSheet(got);
        if (checkDisasterLater) { checkDisasterLater = false; checkDisaster(Date.now()); checkRaid(Date.now()); }
        if (!S.tipCam) { S.tipCam = 1; save(); setTimeout(function () { toast('✋ Mới: kéo 1 ngón để đi quanh nông trại, chụm 2 ngón để phóng to/thu nhỏ'); }, got ? 0 : 600); }
      });
    },
    close: function () { sheetQ = []; running = false; cancelAnimationFrame(raf); save(); closeSheet(); ov.classList.remove('on'); document.body.style.overflow = ''; }
  };
  window.FarmGame = api;
})();
