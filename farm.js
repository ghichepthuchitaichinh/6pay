/* 6PAY - Game NÔNG TRẠI SIXPAY (bản 2026.10.31-5: quy hoạch 4 khu Trồng trọt – Chăn nuôi – Sản xuất – Vui chơi, nhiệm vụ xếp theo hướng dẫn chi tiêu của từng ví,
   mọi khoản chi đều ghi rõ trừ ví nào, chuồng nuôi hiện trạng thái rõ ràng (có sản phẩm / chưa cho ăn / đang nuôi), nút 🔔 Thông báo: lịch sử thiên tai, thú hoang,
   thiệt hại và nông sản còn thiếu cho đơn hàng). File này được index.html tải về khi người dùng mở trò chơi.
   Trồng cây, nuôi gà – bò – cừu – cá – ong, xây xưởng chế biến, khu vui chơi, giao đơn hàng và ghi sổ thu chi.
   Nông trại được NỐI với các game học: tiền thưởng kiếm được trong Lịch sử Việt Nam, Khám phá Việt Nam, từ vựng tiếng Anh,
   tiếng Trung, Toán học cấp 1, Đố vui tài chính, Dạy trẻ xem đồng hồ được cộng hết vào ví nông trại (qua hộp thư farm6_inbox).
   Bản đồ Trồng trọt/Chăn nuôi kéo được bằng 1 ngón, phóng to/thu nhỏ bằng 2 ngón.
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
  var FARM_B0 = ['them', 'nha2', 'nha3', 'gieng', 'coixay'];   // công trình nằm ở Khu trồng trọt
  /* Bố cục ruộng KIỂU CŨ (chỉ dùng để chuyển dữ liệu người chơi cũ sang bố cục mới) */
  var OLD_COLS = 5, OLD_MAIN = 35;
  var OLD_FIELDS = [{ id: 'dong', i0: 35, n: 16 }, { id: 'tay', i0: 51, n: 16 }, { id: 'nam', i0: 67, n: 21 }, { id: 'xa', i0: 88, n: 27 }];
  /* ===== KHU TRỒNG TRỌT: 15 ô ruộng lớn xếp 5 hàng × 3 cột, mỗi ô lớn có rào riêng và 4×4 = 16 ô đất con =====
     Ô lớn số 1 mở sẵn. Các ô sau mở theo cấp và mua bằng ví 📈 Đầu tư. Đánh số từ trái sang phải, từ trên xuống. */
  var CW = 64, BP = 4, BPS = BP * CW, HD = 150, BIGN = 15, CELLS = BP * BP;
  var BCX = [150, 486, 822], BY0 = HD + 100, BSTEP = 336;
  var FW = BCX[2] + BPS + 150, FH = BY0 + 4 * BSTEP + BPS + 80;
  var MX = BCX[0] + BPS / 2 - 60;   // mốc vẽ nhà (ngay trên ô ruộng 1), giếng, cối xay gió trên đường chân trời
  var BIGLV = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  var BIGC = [0, 200000, 350000, 500000, 700000, 900000, 1200000, 1500000, 1900000, 2400000, 3000000, 3600000, 4300000, 5000000, 6000000];
  var BIG = [];
  for (var bk = 0; bk < BIGN; bk++) { var br = Math.floor(bk / 3), bc = bk % 3; BIG.push({ k: bk, r: br, c: bc, x: BCX[bc], y: BY0 + br * BSTEP, lv: BIGLV[bk], cost: BIGC[bk] }); }
  var TOTAL = BIGN * CELLS;
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
  /* HƯỚNG DẪN CHI TIÊU CỦA TỪNG VÍ: nên chi cho gì, không dùng cho gì, và các nhóm nhiệm vụ (g = [mã, biểu tượng, tên nhóm]) */
  var WGUIDE = {
    essential: { use: 'Ăn uống, nhà cửa, điện nước, sức khoẻ, đi lại và các chi phí để làm ra tiền: hạt giống, phân bón, sửa chữa, bảo vệ nông trại, mua hàng còn thiếu ở chợ.', no: 'Đồ chơi, đi chơi, du lịch (→ 🎉 Hưởng thụ). Mua đất, vật nuôi, xây xưởng (→ 📈 Đầu tư).',
      g: [['an', '🍚', 'Ăn uống hằng ngày'], ['sx', '🧑‍🌾', 'Chi phí sản xuất'], ['nha', '🏠', 'Nhà cửa & an toàn'], ['yte', '🩺', 'Sức khoẻ'], ['dilai', '⛽', 'Đi lại & giao hàng']] },
    education: { use: 'Học phí các khoá học: ngoại ngữ, kiến thức, kiến thức tài chính, kỹ năng làm nông.', no: 'Truyện, đồ chơi giải trí (→ 🎉 Hưởng thụ).',
      g: [['nn', '🔤', 'Ngoại ngữ'], ['kt', '🧠', 'Kiến thức & tư duy'], ['tc', '🎯', 'Kiến thức tài chính'], ['nghe', '🧑‍🏫', 'Kỹ năng nghề nông']] },
    saving: { use: 'Gửi tiền có kỳ hạn, để dành cho mục tiêu lớn, lập quỹ dự phòng cho lúc gặp chuyện bất ngờ.', no: 'Tiêu xài hằng ngày. Rút trước hạn thì mất lãi.',
      g: [['tt', '💌', 'Trả cho mình trước'], ['mt', '🎯', 'Để dành cho mục tiêu'], ['dp', '🆘', 'Quỹ dự phòng'], ['ky', '🏦', 'Sổ tiết kiệm có kỳ hạn']] },
    invest: { use: 'Mua tài sản sinh ra tiền: đất, cây ăn quả lâu năm, vật nuôi, chuồng trại, xưởng, công trình; góp vốn kinh doanh.', no: 'Chi tiêu hằng ngày. Chỉ đầu tư số tiền chấp nhận mất và nên chia nhỏ ra nhiều nơi.',
      g: [['kd', '🌾', 'Kinh doanh nông trại (việc mình hiểu rõ)'], ['at', '🛡️', 'Đầu tư an toàn, lãi vừa phải'], ['rr', '⚠️', 'Rủi ro cao: lãi to hoặc lỗ']] },
    share: { use: 'Giúp đỡ gia đình, hàng xóm, cộng đồng, quyên góp từ thiện bằng tiền, nông sản hoặc công sức.', no: 'Mua đồ cho bản thân.',
      g: [['gd', '👵', 'Gia đình & hàng xóm'], ['cd', '🏫', 'Cộng đồng & trường học'], ['tth', '❤️', 'Từ thiện & cứu trợ']] },
    enjoy: { use: 'Vui chơi, giải trí, tiệc tùng, du lịch, xây và chơi ở 🎡 Khu vui chơi của nông trại.', no: 'Lấy tiền ví khác để chơi. Ví này hết tiền thì tạm nghỉ chơi, chờ thu nhập mới.',
      g: [['free', '🪁', 'Vui chơi miễn phí'], ['gt', '🎬', 'Giải trí'], ['tiec', '🍢', 'Ăn uống, tiệc tùng'], ['dl', '✈️', 'Du lịch']] }
  };
  /* Khoản chi nào trừ ví nào (hiện trong mục 💰 6 ví) */
  var SPEND_RULES = [
    ['essential', '🌱 Hạt giống, 🧪 phân bón, 🛒 mua hàng ở chợ, 🔧 sửa chữa sau thiên tai, 🛡️ hàng rào và chòi canh'],
    ['education', '🎓 Học phí các khoá học (nhiệm vụ Phát triển bản thân)'],
    ['saving', '🏦 Gửi tiết kiệm có kỳ hạn (nhận lại gốc + lãi)'],
    ['invest', '🪧 Mua đất, 🌳 cây ăn quả lâu năm, 🐔 vật nuôi, 🏗️ chuồng trại, 🏭 xưởng chế biến, 🏡 công trình'],
    ['share', '🤝 Quyên góp, tặng quà, giúp đỡ người khác'],
    ['enjoy', '🎡 Xây khu vui chơi, 🎟️ vé vào chơi, 🍦 đi chơi, du lịch']
  ];
  function wch(w, a) { var W0 = WM[w]; return '<span class="fm-wch" style="--wc:' + W0.c + '">' + (a != null ? '−' + short(a) + ' · ' : '') + W0.e + ' ' + W0.n + '</span>'; }
  function wpay(w, a) { return '<span class="fm-wpay">💳 Trả bằng ví ' + WM[w].e + ' <b>' + WM[w].n + '</b> (đang có ' + money(S.jar[w]) + ')' + (a != null && S.jar[w] < a ? ' · <b style="color:#dc2626">chưa đủ</b>' : '') + '</span>'; }
  /* Chủ đề tiếng Anh/Trung dùng cho khoá học (mã giống trong game từ vựng) */
  var TOPIC = { fruits: '🍎 Trái cây', colors: '🎨 Màu sắc', family: '👪 Gia đình', pets: '🐶 Vật nuôi & nông trại', numbers: '🔢 Số đếm', food: '🍕 Món ăn', school: '📚 Trường học', body: '🧍 Cơ thể',
    clothes: '👕 Quần áo', vegetables: '🥕 Rau củ', jobs: '👨‍⚕️ Nghề nghiệp', weather: '⛅ Thời tiết & mùa', transport: '🚗 Giao thông', sports: '⚽ Thể thao', money: '💰 Tiền bạc & mua sắm', emotions: '😊 Cảm xúc',
    places: '🏫 Địa điểm', travel: '🧳 Du lịch', countries: '🌏 Quốc gia', tech: '💻 Công nghệ', space: '🪐 Vũ trụ', nature: '🌈 Thiên nhiên', music: '🎸 Âm nhạc', time: '⏰ Thời gian', days: '📅 Thứ & tháng', toys: '🧸 Đồ chơi', kitchen: '🍴 Nhà bếp' };
  var EVN = { plant: ['Gieo', 'hạt giống'], water: ['Tưới', 'ô ruộng'], harvest: ['Thu hoạch', 'cây'], feed: ['Cho vật nuôi ăn', 'lần'], collect: ['Thu', 'sản phẩm từ vật nuôi'], make: ['Chế biến', 'món ở xưởng'], order: ['Giao', 'đơn hàng'], sell: ['Bán', 'món ở chợ'], fert: ['Bón phân', 'lần'], fun: ['Chơi', 'lượt ở 🎡 Khu vui chơi'] };

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
  M('invest', 18, '🚜', 'Đầu tư máy cày cho cánh đồng lớn', 'Máy cày là tài sản giúp làm nhanh hơn, thu nhiều hơn (mua máy móc là khoản đầu tư, không phải chi thiết yếu). Thu hoạch 60 cây.', 'farm', F('harvest', 60));
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

  /* ---------- Nhiệm vụ bổ sung (thêm ở cuối để không làm đổi mã các nhiệm vụ cũ) ---------- */
  M('essential', 2, '💡', 'Trả tiền điện nước tháng này', 'Điện nước là khoản phải trả đúng hạn mỗi tháng, trả trước rồi mới tính chuyện khác.', 'wait', T(120));
  M('essential', 4, '🚌', 'Mua vé xe đi chợ huyện bán hàng', 'Chi phí đi lại để bán hàng là khoản thiết yếu. Bán 8 món ở chợ.', 'farm', F('sell', 8));
  M('share', 3, '👨‍👩‍👧', 'Nấu bữa cơm mời ông bà', 'Chia sẻ với gia đình bằng chính nông sản nhà làm ra. Góp 4 🌾 lúa và 2 🥚 trứng.', 'give', G([['lua', 4], ['trung', 2]]), { c0: 1, req: 'a:ga', fert: 1 });
  M('enjoy', 2, '🎠', 'Dạo chơi khu vui chơi nông trại', 'Ghé 🎡 Khu vui chơi, chơi một lượt ở bất kỳ khu nào (chi vé từ ví Hưởng thụ).', 'farm', F('fun', 1), { c0: 1 });

  /* Xếp nhiệm vụ vào nhóm theo hướng dẫn chi tiêu của từng ví */
  (function () {
    var N = {
      'Đi chợ nấu bữa cơm gia đình': 'an', 'Chuẩn bị bữa sáng đủ chất': 'an', 'Mua gia vị nấu bữa tối': 'an', 'Trữ lương thực mùa mưa bão': 'an', 'Chuẩn bị mâm cơm ngày Tết': 'an',
      'Sửa mái nhà bị dột': 'nha', 'Sửa hàng rào bị gió đổ': 'nha', 'Mua đồ bảo hộ lấy mật ong': 'nha', 'Trả tiền điện nước tháng này': 'nha',
      'Khám sức khoẻ định kỳ cho cả nhà': 'yte', 'Mua bảo hiểm y tế cho cả nhà': 'yte',
      'Đổ xăng cho xe chở hàng': 'dilai', 'Bảo dưỡng xe chở hàng': 'dilai', 'Mua vé xe đi chợ huyện bán hàng': 'dilai', 'Thuê kho lạnh bảo quản hàng': 'dilai',
      'Trả cho mình trước': 'tt', 'Trả cho mình trước (lần 2)': 'tt', 'Gửi 60% ví Tiết kiệm': 'tt',
      'Tiết kiệm mua đôi giày mới': 'mt', 'Tiết kiệm mua xe đạp': 'mt', 'Tiết kiệm học phí năm sau': 'mt', 'Gửi 70% ví Tiết kiệm để mua máy cày': 'mt', 'Tiết kiệm mua quà Tết cho ông bà': 'mt', 'Quỹ ước mơ': 'mt',
      'Lập quỹ dự phòng khẩn cấp': 'dp',
      'Cho bạn mượn tiền mua giống': 'at', 'Quỹ đầu tư an toàn': 'at', 'Mua cổ phần hợp tác xã': 'at', 'Quỹ chỉ số (đầu tư dài hạn)': 'at', 'Mua trái phiếu làng xây trường': 'at', 'Danh mục đầu tư đa dạng': 'at', 'Mua đất nông nghiệp lâu dài': 'at',
      'Giúp bác hàng xóm thu hoạch': 'gd', 'Biếu quà ông bà': 'gd', 'Giao hàng giúp cô Lan bị ốm': 'gd', 'Nấu bữa cơm mời ông bà': 'gd',
      'Ủng hộ quỹ khuyến học của trường': 'cd', 'Mua sách tặng thư viện làng': 'cd', 'Tặng trứng cho bếp ăn trường học': 'cd', 'Trồng cây xanh cho làng': 'cd', 'Góp tiền sửa đường vào bản': 'cd', 'Xây giếng nước sạch cho làng bên': 'cd', 'Học bổng cho học sinh vượt khó': 'cd', 'Góp tiền xây cầu cho bản làng': 'cd',
      'Thả diều trên đê': 'free', 'Chơi cầu lông với bố mẹ': 'free', 'Dạo chơi khu vui chơi nông trại': 'free',
      'Ăn kem cùng bạn': 'tiec', 'Tiệc nướng ngoài vườn': 'tiec', 'Picnic cuối tuần': 'tiec', 'Ăn buffet cùng gia đình': 'tiec', 'Tổ chức tiệc sinh nhật': 'tiec', 'Tiệc trà chiều': 'tiec',
      'Cắm trại ở rừng thông': 'dl', 'Du lịch Đà Lạt cuối tuần': 'dl', 'Nghỉ hè ở biển Nha Trang': 'dl', 'Tham quan Vịnh Hạ Long': 'dl', 'Du lịch Phú Quốc cùng gia đình': 'dl', 'Du lịch nước ngoài': 'dl'
    };
    var DEF = { essential: 'sx', saving: 'ky', share: 'tth', enjoy: 'gt' };
    MISSIONS.forEach(function (m) {
      // m.grp = nhóm (không dùng m.g vì m.g là mã game học của nhiệm vụ học tập)
      if (N[m.n]) m.grp = N[m.n];
      else if (m.w === 'education') m.grp = m.k === 'farm' ? 'nghe' : m.g === 'en' || m.g === 'zh' ? 'nn' : m.g === 'quiz' ? 'tc' : 'kt';
      else if (m.w === 'invest') m.grp = m.k === 'wait' ? 'rr' : 'kd';
      else m.grp = DEF[m.w];
    });
  })();

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
  /* ================= 🎡 KHU VUI CHƠI (ví 🎉 Hưởng thụ) =================
     Xây khu chơi và mua vé đều trừ ví Hưởng thụ. Chơi xong nhận kinh nghiệm + niềm vui, KHÔNG sinh ra tiền (đúng tinh thần ví Hưởng thụ).
     Mỗi khu chơi tối đa FUN_DAY lượt mỗi ngày: hưởng thụ vừa đủ. tk = hệ số giá vé theo cấp, t = thời gian chơi (giây), k = hệ số kinh nghiệm. */
  var FUN_DAY = 3;
  var FUN = [
    { id: 'dieu', n: 'Bãi thả diều', e: '🪁', lv: 1, cost: 0, tk: 0, t: 90, k: 0.6, d: 'Niềm vui không tốn đồng nào: xây miễn phí, chơi miễn phí!' },
    { id: 'cautruot', n: 'Sân chơi cầu trượt', e: '🛝', lv: 2, cost: 60000, tk: 0.25, t: 120, k: 1, d: 'Cầu trượt, xích đu cho cả nhà vui chơi sau giờ làm.' },
    { id: 'cauca', n: 'Hồ câu cá thư giãn', e: '🎣', lv: 3, cost: 150000, tk: 0.35, t: 300, k: 1.3, d: 'Ngồi câu cá, ngắm hoàng hôn bên hồ.' },
    { id: 'ngua', n: 'Vòng quay ngựa gỗ', e: '🎠', lv: 5, cost: 300000, tk: 0.45, t: 420, k: 1.6, d: 'Ngựa gỗ quay vòng theo tiếng nhạc vui tai.' },
    { id: 'camtrai', n: 'Khu cắm trại', e: '⛺', lv: 7, cost: 500000, tk: 0.55, t: 900, k: 2, d: 'Dựng lều, nướng ngô, ngắm sao đêm.' },
    { id: 'hoboi', n: 'Hồ bơi', e: '🏊', lv: 9, cost: 800000, tk: 0.65, t: 1200, k: 2.4, d: 'Bơi lội mát lạnh, vừa vui vừa khoẻ.' },
    { id: 'duquay', n: 'Đu quay khổng lồ', e: '🎡', lv: 12, cost: 1500000, tk: 0.8, t: 1800, k: 3, d: 'Ngắm toàn cảnh nông trại từ trên cao.' },
    { id: 'xiec', n: 'Rạp xiếc', e: '🎪', lv: 15, cost: 2500000, tk: 1, t: 3600, k: 3.6, d: 'Xem xiếc thú, ảo thuật cùng cả gia đình.' }
  ];
  var FUNM = {}; FUN.forEach(function (f) { FUNM[f.id] = f; });
  function item(id) { return CM[id] || PRODUCTS[id]; }
  function need(lv) { return 10 * lv + 5 * lv * lv; }   // kinh nghiệm cần để lên cấp tiếp

  /* ================= TRẠNG THÁI & LƯU TRỮ ================= */
  function emptyPlots() { var p = []; for (var i = 0; i < TOTAL; i++) p.push({ c: null, p: 0, t: 0, w: 0 }); return p; }
  function fresh() {
    var an = {}; ANIMALS.forEach(function (a) { an[a.id] = []; });
    return { v: 2, m: 300000, start: 300000, xp: 0, lv: 1, rows: 3, plots: emptyPlots(), inv: {}, an: an, fert: 3, orders: [], log: [], tin: 0, tout: 0, sel: 'lua', seen: 0, made: Date.now(),
      gs: {}, bld: {}, fac: {}, fx: {}, ms: {}, ev: {}, wl: {}, inc: {}, jar: null, si: null, jx: null, pct: null, fix: [], dis: null, dmg: null, def: {}, raid: null, pens: null, bp: null, fz: null, selF: 'f1', bday: null, mw: 'essential', gift: '', tipCam: 0, fun: {}, nt: [], mg: {} };
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
        o.plots.forEach(function (pl, i) { var r = Math.floor(i / 4), c = i % 4; if (r < 7 && pl) np[r * OLD_COLS + c] = pl; });
        S.plots = np; S.start = 200000; S.v = 2; S.orders = [];
      }
    }
    var F = fresh();
    ['gs', 'bld', 'fac', 'fx', 'ms', 'ev', 'wl', 'inc', 'inv', 'an', 'fun', 'mg'].forEach(function (k) { if (!S[k] || typeof S[k] !== 'object') S[k] = F[k]; });
    if (!Array.isArray(S.nt)) S.nt = [];
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
    // Ruộng kiểu cũ (ruộng chính 5 cột + 4 cánh đồng) → 15 ô lớn 4×4: cây đang trồng được dời sang các ô lớn đầu tiên, đủ số ô đất đã có
    if (!Array.isArray(S.bp)) {
      var oldOpen = [], rows = S.rows || 3;
      for (var oi = 0; oi < (S.plots || []).length; oi++) {
        var isOpen = oi < OLD_MAIN ? Math.floor(oi / OLD_COLS) < rows : OLD_FIELDS.some(function (f) { return S.fx && S.fx[f.id] && oi >= f.i0 && oi < f.i0 + f.n; });
        if (isOpen) oldOpen.push(S.plots[oi]);
      }
      var nb = Math.max(1, Math.min(BIGN, Math.ceil(oldOpen.length / CELLS)));
      S.bp = []; for (var bi = 0; bi < BIGN; bi++) S.bp.push(bi < nb ? 1 : 0);
      var np2 = []; for (var ni = 0; ni < TOTAL; ni++) np2.push(ni < oldOpen.length && oldOpen[ni] ? oldOpen[ni] : { c: null, p: 0, t: 0, w: 0 });
      S.plots = np2;
    }
    while (S.bp.length < BIGN) S.bp.push(0);
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
  function addLog(k, amt, key, name, e, q, w) {
    q = q || 1;
    if (k === 'in') S.tin += amt; else S.tout += amt;
    var L = S.log[0], now = Date.now();
    if (L && L.key === key && L.k === k && L.w === w && now - L.ts < 120000) { L.a += amt; L.q += q; L.ts = now; }
    else { var o = { ts: now, k: k, a: amt, key: key, n: name, e: e, q: q }; if (w) o.w = w; S.log.unshift(o); if (S.log.length > 150) S.log.length = 150; }
  }
  /* CHI TIỀN: luôn ghi rõ trừ ví nào (w) vào sổ thu chi */
  function spend(w, c, key, name, e, q) { takeMoney(w, c); addLog('out', c, key, name, e, q, w); wlog(w, 'o', c); }
  /* Ví của một dòng chi trong sổ (dòng cũ chưa lưu ví thì suy ra từ loại khoản chi) */
  function logW(l) {
    if (l.k !== 'out') return null; if (l.w) return l.w;
    var k = l.key || '';
    if (k.indexOf('m_') === 0) { var m = MSM[k.slice(2)]; return m ? m.w : null; }
    if (k.indexOf('seed_') === 0) { var c = CM[k.slice(5)]; return c && c.per ? 'invest' : 'essential'; }
    if (/^(fert_|fix_|def_|mbuy_)/.test(k)) return 'essential';
    if (/^(land|fld_|buy_|pen_|bld_)/.test(k)) return 'invest';
    if (k.indexOf('fun') === 0) return 'enjoy';
    return null;
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
    if (c) spend(m.w, c, 'm_' + m.id, m.n, m.e);
    S.ms[m.id] = { s: 1, b: m.k === 'wait' || m.k === 'give' ? 0 : mCur(m), t: Date.now(), c: c };
    sfx('ok'); save(); hud(); renderQuest();
    toast(m.e + ' Đã nhận nhiệm vụ' + (c ? ', chi ' + money(c) + ' từ ví ' + WM[m.w].e + ' ' + WM[m.w].n : '') + '. ' + (m.k === 'wait' ? 'Quay lại sau ' + durL(m.s) + ' nhé!' : m.k === 'learn' ? 'Bấm “Vào học” để bắt đầu.' : m.k === 'give' ? 'Gom đủ hàng rồi bấm “Giao”.' : 'Ra nông trại làm việc thôi!'));
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
    addMoney(pay, m.w === 'saving' || m.w === 'invest' ? m.w : null); if (pay) { addLog('in', pay, 'mr_' + m.id, 'Hoàn thành: ' + m.n, m.e, 1, m.w === 'saving' || m.w === 'invest' ? m.w : null); wlog(m.w, 'i', pay); }
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
      if (sv && e.c) { addMoney(e.c, 'saving'); addLog('in', e.c, 'mc_' + m.id, 'Rút trước hạn: ' + m.n, '🐷', 1, 'saving'); wlog(m.w, 'i', e.c); }
      delete S.ms[m.id]; save(); hud(); renderQuest();
    });
  }
  /* Đi làm nhiệm vụ */
  function mGo(id) {
    var m = MSM[id]; if (!m) return;
    if (m.k === 'learn') { play(m.g, m.t); return; }
    if (m.k === 'farm') {
      if (m.ev === 'feed' || m.ev === 'collect') setTab('barn');
      else if (m.ev === 'make') setTab('prod');
      else if (m.ev === 'fun') setTab('fun');
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
    BIG.forEach(function (B) { if (B.lv === lv && B.k > 0) u.push({ e: '🌾', t: 'Ô ruộng số ' + (B.k + 1) + ' (16 ô đất)', go: 'field' }); });
    ANIMALS.forEach(function (a) { if (a.lv === lv) u.push({ e: a.e, t: 'Được nuôi ' + a.n.toLowerCase(), go: 'barn' }); });
    CAPUP.forEach(function (c) { if (c.lv === lv) u.push({ e: AM[c.a].e, t: 'Thêm ' + c.k + ' chỗ mỗi ' + AM[c.a].pen.toLowerCase(), go: 'barn' }); });
    var nl = LOTLV.filter(function (l) { return l === lv; }).length; if (nl) u.push({ e: '🟫', t: 'Thêm ' + nl + ' ô đất xây chuồng', go: 'barn' });
    BUILDS.forEach(function (b) { if (b.lv === lv) u.push({ e: b.e, t: 'Được xây ' + b.n.toLowerCase(), go: 'prod' }); });
    FUN.forEach(function (f) { if (f.lv === lv && lv > 1) u.push({ e: f.e, t: 'Khu vui chơi: ' + f.n.toLowerCase(), go: 'fun' }); });
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
    if (now >= S.dis.next) { var at = S.dis.next; S.dis.next = now + DIS_EVERY; disaster(now, at); }
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
  function disaster(now, at) {
    var w = Math.random() < 0.5 ? 'rain' : 'wind', R = Math.random, fx = [], lv = S.lv, WN = w === 'rain' ? 'Mưa bão' : 'Gió lốc', away = at && now - at > 120000 ? '<p style="font-size:13px">🕒 Xảy ra lúc <b>' + when(at) + '</b>, khi bạn đang vắng nhà.</p>' : '';
    at = at && at < now ? at : now;
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
    if (!fx.length && trees.length) { S.dis.last = now; WX = { w: w, until: Date.now() + 14000, p: [] }; notify('dis', w === 'rain' ? '🌧️' : '🌪️', WN + ' đi qua nông trại', '🌳 ' + trees.length + ' cây ăn quả bị rụng hết quả (cây vẫn khoẻ, chờ lứa sau). Không có thiệt hại khác.', at); save(); badges(); sheetLater('<div class="fm-modal"><div class="big">' + (w === 'rain' ? '🌧️' : '🌪️') + '</div><h2>' + (w === 'rain' ? 'Mưa bão vừa đi qua!' : 'Gió lốc vừa đi qua!') + '</h2>' + away + '<p>' + trees.length + ' cây ăn quả bị rụng hết quả, phải chờ lứa sau. May là cây lâu năm rất khoẻ, không bị hỏng!</p><div class="fm-row" style="justify-content:center"><button class="fm-btn" data-a="sheetClose">Đóng</button></div></div>'); return; }
    if (!fx.length) { if (!S.dmg.house) { S.dmg.house = 1; fx.push({ t: 'house', c: r1k(base(lv) * 1.2) }); } else return; }
    fx.forEach(function (f, k) { f.id = 'f' + now + k; f.w = w; f.s = 0; S.fix.push(f); });
    S.dis.last = now; S.dis.n = (S.dis.n || 0) + 1;
    WX = { w: w, until: Date.now() + 14000, p: [] };
    var tot = fx.reduce(function (a, f) { return a + f.c; }, 0);
    notify('dis', w === 'rain' ? '🌧️' : '🌪️', WN + ' gây thiệt hại ' + money(tot), (trees.length ? '🌳 ' + trees.length + ' cây ăn quả bị rụng quả. ' : '') + fx.map(function (f) { return FIXD[f.t][1] + ' ' + fixTitle(f) + ': ' + money(f.c); }).join(' · ') + '. Chi phí sửa chữa trừ ví 🏠 Thiết yếu.', at, fx.map(function (f) { return f.id; }));
    save(); badges();
    sheetLater('<div class="fm-modal"><div class="big">' + (w === 'rain' ? '🌧️' : '🌪️') + '</div><h2>' + (w === 'rain' ? 'Một trận mưa bão vừa đi qua!' : 'Gió lốc vừa quét qua nông trại!') + '</h2>' + away +
      (trees.length ? '<p style="font-size:13.5px">🌳 ' + trees.length + ' cây ăn quả bị rụng quả (cây vẫn khoẻ, chờ lứa sau).</p>' : '') +
      '<ul class="fm-earnlist">' + fx.map(function (f) { return '<li><span>' + FIXD[f.t][1] + ' ' + fixTitle(f) + '</span><b style="color:#dc2626">−' + short(f.c) + '</b></li>'; }).join('') + '</ul>' +
      '<p>Tổng chi phí sửa chữa: <b>' + money(tot) + '</b>, trừ vào ví 🏠 Thiết yếu' + (S.jar.essential < tot ? ' (ví này đang chỉ có ' + money(S.jar.essential) + ')' : '') + '.</p>' +
      '<p style="font-size:13px">Chuyện bất ngờ luôn có thể xảy ra. Vì vậy cần có <b>quỹ dự phòng</b> trong ví 🐷 Tiết kiệm để không bị động khi gặp sự cố.</p>' +
      '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Để sau</button><button class="fm-btn org" data-a="tab" data-t="quest">🔧 Đi sửa chữa</button></div></div>');
  }
  function fixStart(id) {
    var f = S.fix.filter(function (x) { return x.id === id; })[0]; if (!f || f.s) return;
    if (!has('essential', f.c)) { noMoney(f.c, 'essential'); return; }
    spend('essential', f.c, 'fix_' + f.t, 'Sửa chữa: ' + fixTitle(f), FIXD[f.t][1]);
    f.s = 1; f.st = Date.now(); sfx('ok'); save(); hud(); renderQuest();
    toast(FIXD[f.t][1] + ' Đã trả ' + money(f.c) + ' từ ví 🏠 Thiết yếu. Thợ đang sửa, xong sau ' + durL(FIXD[f.t][0]) + '.');
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
      notify('fix', '✅', 'Đã sửa xong ' + done.length + ' hư hỏng', done.map(function (f) { return FIXD[f.t][1] + ' ' + fixTitle(f); }).join(' · ') + '. Mọi thứ đã hoạt động lại.', now);
      addXP(xp); save(); hud(); toast('✅ Đã sửa xong: ' + done.map(fixTitle).join(', ') + ' · +' + xp + ' KN'); sfx('win');
      if (tab === 'quest') renderQuest();
    }
  }
  function fixHtml() {
    if (!S.fix.length) return '';
    var h = '<details class="fm-fix" open><summary><b>🚨 Hư hỏng cần sửa (' + S.fix.length + ')</b><small>Chi phí sửa trừ ví 🏠 Thiết yếu · đang có ' + short(S.jar.essential) + '</small></summary>';
    S.fix.forEach(function (f) {
      h += '<div class="fm-fx"><span class="e">' + FIXD[f.t][1] + '</span><span class="t"><b>' + fixTitle(f) + '</b><small>' + fixDesc(f) + '</small>';
      if (f.s === 1) { var p = Math.min(1, (Date.now() - f.st) / (FIXD[f.t][0] * 1000)); h += '<span class="fm-pb"><i id="xp_' + f.id + '" style="width:' + Math.round(p * 100) + '%"></i></span><span class="fm-pt" id="xt_' + f.id + '">🔧 Đang sửa · còn ' + dur((1 - p) * FIXD[f.t][0]) + '</span></span>'; }
      else h += '</span><button class="fm-btn org" data-a="fixGo" data-f="' + f.id + '">🔧 −' + short(f.c) + ' 🏠</button>';
      h += '</div>';
    });
    return h + '</details>';
  }


  /* ================= 🔔 THÔNG BÁO =================
     Lưu lại các sự kiện (thiên tai, thú hoang, sửa chữa xong) kèm thời gian và thiệt hại, và tính nông sản còn thiếu cho đơn hàng. */
  function when(ts) {
    var d = new Date(ts), t0 = new Date(); t0.setHours(0, 0, 0, 0);
    var hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return hm + ' ' + (ts >= t0.getTime() ? 'hôm nay' : ts >= t0.getTime() - 86400000 ? 'hôm qua' : 'ngày ' + d.getDate() + '/' + (d.getMonth() + 1));
  }
  function notify(k, e, t, d, ts, fids) {
    if (!Array.isArray(S.nt)) S.nt = [];
    var o = { ts: ts || Date.now(), k: k, e: e, t: t, d: d, u: 1 }; if (fids) o.f = fids;
    S.nt.push(o); S.nt.sort(function (a, b) { return b.ts - a.ts; });
    if (S.nt.length > 60) S.nt.length = 60;
  }
  function unreadN() { return (S.nt || []).filter(function (x) { return x.u; }).length; }
  /* Nơi làm ra một món hàng (để biết thiếu thì đi đâu lấy) */
  function srcOf(id) {
    if (CM[id]) return CM[id].lv > S.lv ? '🔒 Hạt giống mở ở cấp ' + CM[id].lv : '🌾 Trồng ở Khu trồng trọt (' + (CM[id].per ? 'cây lâu năm, lần đầu ' + durL(CM[id].t) + ', sau đó ' + durL(CM[id].re) + '/lứa' : durL(CM[id].t)) + ')';
    for (var i = 0; i < ANIMALS.length; i++) if (ANIMALS[i].p === id) { var a = ANIMALS[i]; return (S.lv < a.lv ? '🔒 ' : '🐄 ') + 'Nuôi ' + a.n.toLowerCase() + ' ' + a.e + ' ở Khu chăn nuôi' + (S.lv < a.lv ? ' (mở ở cấp ' + a.lv + ')' : S.an[a.id].length ? '' : ' (chưa nuôi con nào)'); }
    for (i = 0; i < BUILDS.length; i++) if (BUILDS[i].r && BUILDS[i].r.o === id) { var b = BUILDS[i]; return '🏭 Làm ở ' + b.n.toLowerCase() + ' (Khu sản xuất)' + (built(b.id) ? '' : ' · chưa xây'); }
    return '';
  }
  /* Nông sản còn thiếu: cộng nhu cầu của tất cả đơn hàng + nhiệm vụ giao hàng đang làm, so với kho */
  function shortages() {
    fillOrders();
    var needQ = {}, per = [];
    S.orders.forEach(function (o) {
      var miss = [];
      o.it.forEach(function (x) { needQ[x[0]] = (needQ[x[0]] || 0) + x[1]; var hv = S.inv[x[0]] || 0; if (hv < x[1]) miss.push([x[0], x[1] - hv]); });
      per.push({ e: o.tr, n: 'Đơn ' + o.who, miss: miss });
    });
    MISSIONS.forEach(function (m) {
      var e = mSt(m); if (!e || e.s !== 1 || m.k !== 'give') return;
      var miss = []; m.it.forEach(function (x) { var hv = S.inv[x[0]] || 0; if (hv < x[1]) miss.push([x[0], x[1] - hv]); });
      per.push({ e: m.e, n: 'Nhiệm vụ ' + m.n, miss: miss, m: 1 });
    });
    var rows = Object.keys(needQ).map(function (id) { var hv = S.inv[id] || 0; return { id: id, need: needQ[id], have: hv, lack: Math.max(0, needQ[id] - hv) }; })
      .filter(function (r) { return r.lack > 0; }).sort(function (a, b) { return b.lack - a.lack; });
    return { rows: rows, per: per };
  }
  function notifBadge() { var n = unreadN(); dot('fmDotN', n > 9 ? '9+' : n); }
  function notifSheet() {
    var sh = shortages(), nt = S.nt || [], h = '<div class="fm-h">🔔 Thông báo nông trại</div>';
    // 1) Nông sản còn thiếu
    h += '<div class="fm-card"><b>📦 Nông sản còn thiếu để đủ đơn hàng</b>';
    if (!sh.rows.length) h += '<div class="fm-sub" style="margin:6px 0 0">✅ Kho đã đủ hàng cho tất cả ' + S.orders.length + ' đơn hàng. Ra 🏪 Chợ giao hàng thôi!</div>';
    else {
      h += '<div class="fm-sub" style="margin:4px 0 6px">Cộng tất cả ' + S.orders.length + ' đơn hàng đang chờ, so với số hàng đang có trong kho:</div>';
      sh.rows.forEach(function (r) {
        var I = item(r.id);
        h += '<div class="fm-short"><span class="e">' + I.e + '</span><span class="t"><b>' + I.n + '</b><small>Có ' + r.have + ' / cần ' + r.need + ' · ' + srcOf(r.id) + '</small></span><span class="q">Thiếu ' + r.lack + '</span></div>';
      });
      var lines = sh.per.filter(function (p) { return !p.m && p.miss.length; });
      if (lines.length) h += '<details class="fm-det"><summary>Xem từng đơn hàng còn thiếu gì</summary>' + lines.map(function (p) { return '<div class="fm-log"><span class="e">' + p.e + '</span><span class="t">' + esc(p.n) + '<small>Thiếu ' + p.miss.map(function (x) { return x[1] + ' ' + item(x[0]).e + ' ' + item(x[0]).n.toLowerCase(); }).join(', ') + '</small></span></div>'; }).join('') + '</details>';
      h += '<div class="fm-row"><button class="fm-btn" data-a="tab" data-t="market">🏪 Xem đơn hàng</button><button class="fm-btn alt" data-a="mbuyGo">🛒 Mua bù ở chợ</button></div>';
    }
    var gm = sh.per.filter(function (p) { return p.m && p.miss.length; });
    if (gm.length) h += '<div class="fm-sub" style="margin:10px 0 0"><b>🎯 Nhiệm vụ giao hàng còn thiếu:</b><br>' + gm.map(function (p) { return p.e + ' ' + esc(p.n.replace('Nhiệm vụ ', '')) + ': thiếu ' + p.miss.map(function (x) { return x[1] + ' ' + item(x[0]).e; }).join(', '); }).join('<br>') + '</div>';
    h += '</div>';
    // 2) Sự cố chưa sửa
    var open = S.fix.filter(function (f) { return !f.s; }), fixing = S.fix.filter(function (f) { return f.s === 1; });
    if (open.length || fixing.length) h += '<div class="fm-card" style="box-shadow:0 0 0 2px #f87171"><b>🚨 Hư hỏng đang chờ xử lý</b><div class="fm-sub" style="margin:4px 0 0">' +
      open.map(function (f) { return FIXD[f.t][1] + ' ' + fixTitle(f) + ': <b style="color:#dc2626">' + money(f.c) + '</b>'; }).concat(fixing.map(function (f) { return FIXD[f.t][1] + ' ' + fixTitle(f) + ': 🔧 đang sửa'; })).join('<br>') +
      '</div>' + (open.length ? '<div class="fm-row"><button class="fm-btn org" data-a="tab" data-t="quest">🔧 Đi sửa chữa (ví 🏠 Thiết yếu)</button></div>' : '') + '</div>';
    // 3) Dự báo
    var fc = [];
    if (S.lv >= DIS_LV && S.dis) fc.push('🌦️ Trận mưa bão / gió lốc tiếp theo có thể đến sau khoảng <b>' + durL(Math.max(60, Math.round((S.dis.next - Date.now()) / 60000) * 60)) + '</b>. Hãy để dành tiền ví 🏠 Thiết yếu để sửa chữa.');
    else if (S.lv < DIS_LV) fc.push('🌦️ Từ cấp ' + DIS_LV + ', khoảng 5 giờ lại có một trận mưa bão hoặc gió lốc.');
    if (S.lv >= RAID_LV && S.raid) fc.push('🐾 Thú hoang có thể mò đến sau khoảng <b>' + durL(Math.max(60, Math.round((S.raid.next - Date.now()) / 60000) * 60)) + '</b>' + (hasDef('rao') ? '' : '. Nông trại chưa có hàng rào!'));
    if (fc.length) h += '<div class="fm-card" style="font-size:13.5px;line-height:1.55;color:#4a3a20">' + fc.join('<br>') + '</div>';
    // 4) Lịch sử sự kiện
    h += '<div class="fm-card"><b>🕒 Sự kiện đã xảy ra</b>';
    if (!nt.length) h += '<div class="fm-sub" style="margin:6px 0 0">Chưa có sự kiện nào. Nông trại đang bình yên! 🌤️</div>';
    nt.forEach(function (x) {
      var st = '';
      if (x.f) { var left = x.f.filter(function (id) { return S.fix.some(function (f) { return f.id === id; }); }).length; st = left ? '<span class="fm-tag" style="background:#fee2e2;color:#991b1b">Còn ' + left + ' hư hỏng chưa sửa xong</span>' : '<span class="fm-tag g">Đã khắc phục</span>'; }
      h += '<div class="fm-nt' + (x.u ? ' new' : '') + '"><span class="e">' + x.e + '</span><span class="t"><b>' + esc(x.t) + '</b><small class="tm">🕒 ' + when(x.ts) + '</small><small>' + x.d + '</small>' + st + '</span></div>';
    });
    h += '</div><button class="fm-btn alt" data-a="sheetClose" style="width:100%">Đóng</button>';
    sheet(h);
    nt.forEach(function (x) { x.u = 0; }); save(); notifBadge();
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
    if (now >= S.raid.next) { var at = S.raid.next; S.raid.next = now + RAID_EVERY; raid(now, at < now ? at : now); }
  }
  function raid(now, at) {
    at = at || now;
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
    notify('raid', blocked ? '🛡️' : P.e, blocked ? P.n + ' bị chặn lại, vật nuôi an toàn' : P.n + ' vào bắt mất ' + lost.length + ' con vật nuôi', blocked ? why : (broke ? 'Gấu phá hàng rào (cần sửa). ' : '') + 'Mất: ' + Object.keys(cnt).map(function (a) { return cnt[a] + ' ' + AM[a].e + ' ' + AM[a].n.toLowerCase(); }).join(', ') + ' · thiệt hại khoảng ' + money(val) + '.', at);
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
    spend('essential', D.c, 'def_' + id, D.n, D.e);
    S.def[id] = { s: 1, st: Date.now() }; sfx('ok'); save(); hud(); renderQuest();
    toast(D.e + ' Đã trả ' + money(D.c) + ' từ ví 🏠 Thiết yếu. Thợ đang xây, xong sau ' + durL(D.t) + '.');
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
    var nd = DEFS.filter(function (D) { return defState(D) === 'done'; }).length;
    var h = '<details class="fm-def"><summary><b>🛡️ Bảo vệ nông trại · đã xây ' + nd + '/' + DEFS.length + ' ▾</b>' + (hasDef('rao') ? '' : '<small style="display:block;color:#b45309;margin:2px 0 0">⚠️ Chưa có hàng rào: cáo có thể vào bắt gà</small>') + '</summary><small>Thú hoang (🦊 cáo, 🐺 sói, 🐻 gấu) thỉnh thoảng mò đến bắt vật nuôi. Chi phí xây trừ ví 🏠 Thiết yếu (an toàn là nhu cầu thiết yếu).</small>';
    DEFS.forEach(function (D) {
      var st = defState(D), d = S.def[D.id];
      h += '<div class="fm-card' + (st === 'done' ? ' done' : st === 'lv' || st === 'req' ? ' lock' : '') + '"><div class="fm-li"><span class="fm-ic">' + D.e + '</span><div class="bd"><b class="t">' + D.n + (st === 'done' ? ' ✅' : '') + '</b><small>' + D.d + '</small>';
      if (st === 'build') { var p = Math.min(1, (Date.now() - d.st) / (D.t * 1000)); h += '<div class="fm-pb"><i id="dp_' + D.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="dt_' + D.id + '">🔨 Đang xây · còn ' + dur((1 - p) * D.t) + '</div>'; }
      else if (st === 'buy') h += '<div class="fm-row"><button class="fm-btn org" data-a="defGo" data-d="' + D.id + '">🔨 Xây · −' + short(D.c) + ' 🏠</button><span class="fm-tag">+' + Math.max(10, Math.round(need(S.lv) * 0.3)) + ' KN</span></div>';
      else if (st === 'lv') h += '<div><span class="fm-tag">🔒 Mở ở cấp ' + D.lv + '</span><span class="fm-tag">Giá ' + short(D.c) + '</span></div>';
      else if (st === 'req') h += '<div><span class="fm-tag">Cần ' + DFM[D.req].n.replace('Xây ', '').toLowerCase() + ' trước</span></div>';
      h += '</div></div></div>';
    });
    return h + '</details>';
  }
  /* Vẽ hàng rào quanh nông trại + chòi canh, chòi bắn cung */
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
  /* Chòi canh + chòi bắn cung đặt đủ 4 góc của mỗi khu (xây 1 lần, cả 4 góc cùng có) */
  function cornerTowers(c, Wd, top) {
    if (!S.def.choi && !S.def.cung) return;
    var m = 58, yT = top + 122, yB = Wd.h - 24;
    [m, Wd.w - m].forEach(function (x) { tower(c, x, yT, 'choi'); tower(c, x, yT + 150, 'cung'); tower(c, x, yB - 150, 'cung'); tower(c, x, yB, 'choi'); });
  }
  function drawDefenses(k) {
    k = k || tab; var top = k === 'field' ? HD + 6 : HD + 2;
    perimeter(ctx, WORLD[k], top); cornerTowers(ctx, WORLD[k], top);
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
  '.fm-inv{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}' +
  '.fm-it{background:#fff;border-radius:16px;padding:10px;text-align:center;box-shadow:0 2px 8px rgba(120,80,0,.12)}.fm-it .e{font-size:40px;font-family:' + EF + ';line-height:1.2}' +
  '.fm-it b{display:block;font-size:15px}.fm-it small{display:block;color:#7a6440;font-size:12px;margin-bottom:6px}.fm-it .q{font-size:20px;font-weight:900;color:#5b3a12}.fm-it .fm-btn{padding:7px 8px;font-size:13px;flex:1}' +
  '.fm-inv .fm-it{padding:8px 5px;border-radius:14px}.fm-inv .fm-it .e{font-size:32px}.fm-inv .fm-it b{font-size:13px;line-height:1.25}.fm-inv .fm-it small{font-size:10.5px;margin-bottom:3px}.fm-inv .fm-it .q{font-size:17px}.fm-inv .fm-it .fm-row{gap:4px;margin-top:5px}.fm-inv .fm-it .fm-btn{padding:7px 2px;font-size:11px;white-space:nowrap;border-radius:10px;min-width:0}' +
  '.fm-zbar.two>*{flex:1 1 0;text-align:center;font-size:13.5px;padding:9px 6px;border-radius:12px}.fm-zbar .qv{background:#fff;color:#3b2a14!important}.fm-zbar .qv.on{background:#2563eb;color:#fff!important;box-shadow:0 2px 8px rgba(37,99,235,.4)}' +
  '.fm-pbox{position:absolute;left:6px;right:6px;top:6px;z-index:4;display:none;flex-direction:column;max-height:calc(100% - 12px);background:#fffaf0;border-radius:18px;box-shadow:0 8px 28px rgba(0,0,0,.35);border:2px solid #86c35f;overflow:hidden}.fm-pbox.on{display:flex}' +
  '.fm-pbh{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#e9f5d8;border-bottom:1px solid #c5dca8}.fm-pbh b{flex:1;font-size:15.5px;color:#3b5a1f}.fm-pbh small{font-size:12.5px;font-weight:800;color:#3b2a14;background:#fff;border-radius:999px;padding:4px 10px}.fm-pbh button{border:0;background:rgba(0,0,0,.08);border-radius:10px;width:32px;height:32px;font-size:16px}' +
  '.fm-pbl{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 10px;flex:1 1 auto}.fm-pbr{display:flex;align-items:center;gap:6px;padding:7px 0;border-bottom:1px dashed #e6d7b0}.fm-pbr.sel{background:#f0fdf4}.fm-pbr .e{font-size:28px;font-family:' + EF + ';width:34px;text-align:center}.fm-pbr .n{flex:1;min-width:0}.fm-pbr .n b{display:block;font-size:14px;color:#3b2a14}.fm-pbr .n small{display:block;font-size:11px;color:#7a6440;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.fm-pbr .st{width:30px;height:30px;border:0;border-radius:9px;background:#f1e7cc;font-size:18px;font-weight:900;color:#6b4a14}.fm-pbr input{width:44px;height:30px;border:1.5px solid #d6c3a0;border-radius:9px;text-align:center;font-size:15px;font-weight:800;color:#3b2a14;background:#fff;padding:0}.fm-pbr .all{border:0;border-radius:9px;height:30px;padding:0 8px;background:#16a34a;color:#fff;font-size:11.5px;font-weight:800}' +
  '.fm-pbf{padding:9px 12px 11px;border-top:1px solid #e6d7b0;background:#fff}.fm-pbf .sum{font-size:12.5px;color:#4a3416;line-height:1.5;margin-bottom:7px}.fm-pbf .sum b{color:#15803d}.fm-pbf .sum .r{color:#dc2626;font-weight:800}.fm-pbf .fm-row{margin-top:0}.fm-pbf .fm-btn{flex:1}' +
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
  /* ---- bản 31.10-5: khu, ví, thông báo ---- */
  '.fm-bell{position:relative;font-family:' + EF + '}.fm-bell .dot{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;line-height:18px;padding:0 5px;border:2px solid #3f8a29;font-family:' + TF + '}' +
  '.fm-top .fm-ib{min-width:38px;height:40px;padding:0 8px}.fm-money{padding:8px 10px;font-size:14px}' +
  '.fm-nav button{min-width:64px;padding:5px 6px 4px;font-size:11.5px}' +
  '.fm-zbar{flex:none;display:flex;gap:5px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:5px 8px;background:#e9f5d8;border-bottom:1px solid #c5dca8;z-index:2;touch-action:pan-x}.fm-zbar::-webkit-scrollbar{display:none}.fm-zbar>*{flex:none;border:0;border-radius:999px;padding:6px 11px;font-size:12.5px;font-weight:800;line-height:1.2;box-shadow:0 1px 4px rgba(0,0,0,.18);background:#fff;color:#3b2a14!important;white-space:nowrap}' +
  '.fm-zbar .zn{background:rgba(36,54,26,.88);color:#fff!important}.fm-zbar .ok{background:#16a34a;color:#fff!important}.fm-zbar .warn{background:#ea580c;color:#fff!important}.fm-zbar .bad{background:#dc2626;color:#fff!important}.fm-zbar .work{background:#2563eb;color:#fff!important}.fm-zbar .can{background:#fff7d1}.fm-zbar .go{background:linear-gradient(135deg,#facc15,#f59e0b);color:#5b3300!important}' +
  '.fm-wch{display:inline-block;border-radius:8px;padding:2px 8px;font-size:11.5px;font-weight:800;background:#fff;color:#3b2a14;box-shadow:inset 0 0 0 2px var(--wc);margin:4px 4px 0 0;white-space:nowrap}' +
  '.fm-wpay{display:block;background:#fffbeb;border:1.5px dashed #f59e0b;border-radius:10px;padding:6px 10px;margin:8px 0;font-size:12.5px;color:#7a4a00;line-height:1.45;text-align:left}' +
  '.fm-tag.r{background:#fee2e2;color:#991b1b}.fm-wl{margin-top:2px}' +
  '.fm-zhead{display:flex;gap:10px;align-items:center;background:#fff;border-radius:16px;padding:9px 12px;margin-bottom:8px;border-left:7px solid var(--zc);box-shadow:0 2px 8px rgba(120,80,0,.12)}.fm-zhead .e{font-size:34px;font-family:' + EF + ';line-height:1}.fm-zhead>div>b{display:block;font-size:16px;color:#4a3416}.fm-zhead small{display:block;font-size:12.5px;color:#7a6440;line-height:1.45;margin-top:2px}' +
  '.fm-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.fm-chips span{border-radius:999px;padding:5px 10px;font-size:12.5px;font-weight:800;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.1)}.fm-chips .ok{background:#dcfce7;color:#166534}.fm-chips .work{background:#dbeafe;color:#1e40af}.fm-chips .can{background:#fef9c3;color:#854d0e}.fm-chips .warn{background:#ffedd5;color:#9a3412}.fm-chips .bad{background:#fee2e2;color:#991b1b}' +
  '.fm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px}' +
  '.fm-tile{background:#fff;border-radius:18px;padding:10px;text-align:center;box-shadow:0 2px 8px rgba(120,80,0,.12);border-top:5px solid #e5d9b6;display:flex;flex-direction:column;align-items:center;gap:4px}' +
  '.fm-tile .ic{position:relative;font-size:44px;line-height:1.1;font-family:' + EF + '}.fm-tile .ic i{position:absolute;right:-14px;bottom:-2px;font-style:normal;font-size:20px;background:#fff;border-radius:50%;width:28px;height:28px;line-height:28px;box-shadow:0 1px 4px rgba(0,0,0,.2)}' +
  '.fm-tile .nm{font-size:14.5px;color:#4a3416;line-height:1.25}.fm-tile .d{display:block;font-size:11.5px;color:#7a6440;line-height:1.4}.fm-tile .fm-btn{width:100%;padding:8px 8px;font-size:13px}.fm-tile .fm-pb{width:100%;margin:2px 0}' +
  '.fm-tile.st-ready,.fm-tile.st-ok{border-top-color:#22c55e}.fm-tile.st-work,.fm-tile.st-play{border-top-color:#3b82f6}.fm-tile.st-can,.fm-tile.st-open{border-top-color:#facc15}.fm-tile.st-need{border-top-color:#f97316}.fm-tile.st-leak{border-top-color:#ef4444}.fm-tile.st-buy{border-top-color:#f59e0b}.fm-tile.st-lv,.fm-tile.st-req,.fm-tile.st-rest{opacity:.62}' +
  '.fm-st{border-radius:999px;padding:3px 10px;font-size:12px;font-weight:900;background:#f1e7cc;color:#6b4a14}.fm-st.ok{background:#dcfce7;color:#166534}.fm-st.work{background:#dbeafe;color:#1e40af}.fm-st.can{background:#fef9c3;color:#854d0e}.fm-st.warn{background:#ffedd5;color:#9a3412}.fm-st.bad{background:#fee2e2;color:#991b1b}.fm-st.buy{background:#fef3c7;color:#92400e}' +
  '.fm-tile .rc{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;font-size:12px;font-weight:800}.fm-tile .rc span{border-radius:8px;padding:2px 6px;background:#f6f0de}.fm-tile .rc .g{background:#dcfce7;color:#166534}.fm-tile .rc .r{background:#fee2e2;color:#991b1b}.fm-tile .rc .o{background:#dbeafe;color:#1e40af}' +
  '.fm-tile .inc{font-size:11.5px;font-weight:800;color:#15803d}.fm-btn.mini{width:auto!important;padding:3px 8px!important;font-size:11.5px!important;border-radius:9px;margin-left:4px}' +
  '.fm-arcade{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;border-radius:16px;padding:10px 12px;margin-bottom:10px;background:linear-gradient(135deg,#1e3a8a,#7c3aed);color:#fff!important;box-shadow:0 4px 12px rgba(76,29,149,.35)}.fm-arcade .e{font-size:34px;font-family:' + EF + '}.fm-arcade b{display:block;font-size:15px}.fm-arcade small{display:block;font-size:12px;opacity:.9;line-height:1.4}.fm-arcade .go{margin-left:auto;font-size:26px;font-weight:900}' +
  '.fm-wguide{background:#fff;border-radius:14px;padding:8px 12px;margin-bottom:8px;font-size:12.5px;line-height:1.5;color:#4a3a20;box-shadow:inset 4px 0 0 var(--wc),0 2px 6px rgba(120,80,0,.1)}.fm-wguide div+div{margin-top:3px}' +
  '.fm-gchips{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:0 -12px 8px;padding:2px 12px 4px;touch-action:pan-x}.fm-gchips::-webkit-scrollbar{display:none}.fm-gchips button{flex:none;border:2px solid #eadfc0;background:#fff;border-radius:999px;padding:5px 11px;font-size:12px;font-weight:800;color:#5b3a12!important;white-space:nowrap}.fm-gchips button.on{background:var(--wc);border-color:var(--wc);color:#fff!important}' +
  '.fm-gh{font-size:12.5px;font-weight:900;color:#7a6440;margin:10px 2px 6px;text-transform:uppercase;letter-spacing:.3px}' +
  '.fm-short{display:flex;align-items:center;gap:10px;padding:8px 2px;border-bottom:1px dashed #eadfc0}.fm-short .e{font-size:28px;font-family:' + EF + ';width:34px;text-align:center}.fm-short .t{flex:1;min-width:0}.fm-short b{font-size:14.5px}.fm-short small{display:block;font-size:12px;color:#7a6440;line-height:1.4}.fm-short .q{font-weight:900;color:#dc2626;white-space:nowrap;font-size:14px}' +
  '.fm-det{margin-top:8px}.fm-det summary{cursor:pointer;font-weight:800;font-size:13px;color:#92400e;padding:4px 0}' +
  '.fm-nt{display:flex;gap:10px;padding:9px 2px;border-bottom:1px dashed #eadfc0}.fm-nt .e{font-size:28px;font-family:' + EF + ';width:34px;text-align:center}.fm-nt .t{flex:1;min-width:0}.fm-nt b{display:block;font-size:14px;color:#4a3416}.fm-nt small{display:block;font-size:12.5px;color:#6b5a3a;line-height:1.45;margin-top:2px}.fm-nt small.tm{color:#9a8660;font-weight:700}.fm-nt.new{background:#fff7ed;border-radius:10px}' +
  '.fm-rule{display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px dashed #eadfc0;font-size:12.5px;line-height:1.45;color:#4a3a20}.fm-rule .w{flex:none;width:118px;font-weight:900;border-left:4px solid var(--wc);padding-left:6px}' +
  '.fm-fix summary{cursor:pointer;list-style:none}.fm-fix summary::-webkit-details-marker{display:none}.fm-fix summary b{display:block;color:#991b1b;font-size:15px}.fm-fix summary small{display:block;color:#b91c1c;font-size:12px;margin:2px 0 6px}.fm-fx{display:flex;align-items:center;gap:8px;background:#fff;border-radius:12px;padding:8px;margin-bottom:8px}.fm-fx .e{font-size:26px;font-family:' + EF + '}.fm-fx .t{flex:1;min-width:0}.fm-fx b{display:block;font-size:14px;color:#4a3416}.fm-fx small{display:block;font-size:12px;color:#7a6440;line-height:1.4}.fm-fx .fm-pb{display:block}.fm-fx .fm-btn{flex:none;padding:8px 10px;font-size:13px}' +
  '.fm-acts{margin:0 0 10px;flex-wrap:nowrap}.fm-acts .fm-btn{flex:1;padding:8px 6px;font-size:13px}' +
  '.fm-def summary{cursor:pointer;list-style:none}.fm-def summary::-webkit-details-marker{display:none}.fm-def summary b{color:#365314;font-size:15px}.fm-def>small{display:block;color:#4d7c0f;font-size:12px;margin:4px 0 8px}' +
  '.fm-earnlist{text-align:left;margin:10px 0;padding:0;list-style:none}.fm-earnlist li{display:flex;justify-content:space-between;gap:8px;padding:7px 4px;border-bottom:1px dashed #eadfc0;font-weight:700;color:#4a3a20}.fm-earnlist li b{color:#15803d}';
  document.head.appendChild(st);

  /* ================= KHUNG GIAO DIỆN ================= */
  var ov = document.createElement('div'); ov.id = 'fmOv';
  ov.innerHTML = '' +
    '<div class="fm-top"><button class="fm-ib" data-a="back" aria-label="Quay lại">←</button>' +
      '<div class="fm-lv"><div class="fm-badge" id="fmLv">1</div><div class="fm-xp"><small id="fmXpT"></small><div class="fm-xpb"><i id="fmXp"></i></div></div></div>' +
      '<button class="fm-money" id="fmM" data-a="jars" aria-label="6 ví của nông trại">💰 0đ</button><button class="fm-ib fm-bell" data-a="notif" aria-label="Thông báo">🔔<span class="dot" id="fmDotN" style="display:none"></span></button><button class="fm-ib" data-a="close" aria-label="Đóng">✕</button></div>' +
    '<div class="fm-wbar" id="fmWB"></div><div class="fm-zbar" id="fmZB"></div>' +
    '<div class="fm-main" id="fmMain">' +
      '<div class="fm-stage" id="fmStage"><canvas id="fmCv"></canvas>' +
        '<div class="fm-zoom" id="fmZoom"><button data-a="zin" aria-label="Phóng to">＋</button><button data-a="zout" aria-label="Thu nhỏ">－</button><button data-a="zhome" aria-label="Về giữa nông trại">🏠</button></div>' +
        '<div class="fm-tools" id="fmTools">' +
          '<button class="fm-tool on" data-a="tool" data-t="seed"><span class="e" id="fmSeedE">🌾</span><span id="fmSeedN">Gieo hạt</span></button>' +
          '<button class="fm-tool" id="fmWA" data-a="waterAll"><span class="e">🪣</span>Tưới hết</button>' +
          '<button class="fm-tool" data-a="tool" data-t="fert"><span class="e" id="fmFertE">🧪</span>Phân bón ▾<span class="n" id="fmFert">0</span></button>' +
          '<button class="fm-tool" data-a="harvestAll"><span class="e">🧺</span>Thu hết</button>' +
        '</div></div>' +
      '<div class="fm-pbox" id="fmPB"></div>' +
      '<div class="fm-panel" id="fmP_prod"></div><div class="fm-panel" id="fmP_fun"></div><div class="fm-panel" id="fmP_market"></div><div class="fm-panel" id="fmP_quest"></div><div class="fm-panel" id="fmP_earn"></div><div class="fm-panel" id="fmP_book"></div>' +
      '<div class="fm-sheet" id="fmSheet"><div class="fm-sb" id="fmSB"></div></div>' +
      '<div class="fm-toast" id="fmToast"></div>' +
    '</div>' +
    '<div class="fm-nav" id="fmNav"><div class="fm-navs" id="fmNavS">' +
      '<button class="on" data-a="tab" data-t="field"><span class="e">🌾</span>Trồng trọt<span class="dot" id="fmDotF" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="barn"><span class="e">🐄</span>Chăn nuôi<span class="dot" id="fmDotB" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="prod"><span class="e">🏭</span>Sản xuất<span class="dot" id="fmDotK" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="fun"><span class="e">🎡</span>Vui chơi<span class="dot" id="fmDotV" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="market"><span class="e">🏪</span>Chợ<span class="dot" id="fmDotO" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="quest"><span class="e">🎯</span>Nhiệm vụ<span class="dot" id="fmDotQ" style="display:none"></span></button>' +
      '<button class="earn" data-a="tab" data-t="earn"><span class="e">🎮</span>Phụ bản</button>' +
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
  /* 🏭 Khu sản xuất và 🎡 Khu vui chơi: bản đồ kéo/zoom như ruộng, mỗi công trình 1 lô vuông, xếp 3 cột */
  var LS = 300, LG = 50, LX0 = 125, LY0 = HD + 80;
  var PRODL = BUILDS.filter(function (b) { return FARM_B0.indexOf(b.id) < 0; }).map(function (b) { return b.id; });
  var FUNL = ['arcade'].concat(FUN.map(function (f) { return f.id; }));
  var LOTS2 = {};
  function lotWorld(k, ids) {
    LOTS2[k] = ids.map(function (id, i) { var x = LX0 + (i % 3) * (LS + LG), y = LY0 + Math.floor(i / 3) * (LS + LG); return { id: id, i: i, x: x, y: y, cx: x + LS / 2, by: y + LS * 0.6 }; });
    LOTS2[k].forEach(function (L0) { if (k === 'prod' && BPOS[L0.id]) { BPOS[L0.id].x = L0.cx; BPOS[L0.id].y = L0.by; } });
    var rows = Math.ceil(ids.length / 3);
    return { w: 2 * LX0 + 3 * LS + 2 * LG, h: LY0 + rows * (LS + LG) - LG + 100 };
  }
  var MAPS = ['field', 'barn', 'prod', 'fun'];
  function isMap(t) { return MAPS.indexOf(t) >= 0; }
  var WORLD = { field: { w: FW, h: FH }, barn: { w: 400, h: 600 } };
  WORLD.prod = lotWorld('prod', PRODL); WORLD.fun = lotWorld('fun', FUNL);
  var CAMS = { field: null, barn: null, prod: null, fun: null }, cam = null, CANIM = null, INERT = null, barnCols = 0;
  var PW = 340, PH = 210, PG = 22;
  function resize() {
    var r = stage.getBoundingClientRect();
    W = Math.max(240, r.width); H = Math.max(300, r.height);
    DPR = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    penLayout();
    MAPS.forEach(function (k) { if (CAMS[k]) clampCam(CAMS[k], k); });
    useCam();
  }
  function penLayout() {
    L.pens = []; for (var i = 0; i < NLOT; i++) { var c = i % BCOLS, r = Math.floor(i / BCOLS); L.pens.push({ i: i, x: 110 + c * (PW + PG), y: HD + 10 + r * (PH + PG), w: PW, h: PH }); }
    WORLD.barn = { w: 220 + BCOLS * PW + (BCOLS - 1) * PG, h: HD + 10 + Math.ceil(NLOT / BCOLS) * (PH + PG) + 60 };
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
      // Khung nhìn ban đầu: ngôi nhà + ô ruộng số 1 (cột giữa, hàng đầu)
      var B0 = BIG[0], z = Math.max(minZ(k), Math.min(1.6, (W - 12) / (BPS + 110), (H - bottomPad(k) - 4) / (B0.y + BPS + 30 - 40)));
      c = { z: z, x: B0.x + BPS / 2 - W / z / 2, y: 40 };
    } else if (k === 'prod' || k === 'fun') {
      var z3 = Math.max(minZ(k), Math.min(1.1, (W - 12) / (W >= 900 ? WORLD[k].w : LS * 1.8)));
      c = { z: z3, x: W >= 900 ? WORLD[k].w / 2 - W / z3 / 2 : LX0 + LS / 2 - W / z3 / 2 + (W / z3 - LS) * 0.18, y: 0 };
    } else {
      var z2 = Math.max(minZ(k), Math.min(1.15, (W - 12) / (PW + 40), (W - 12) / WORLD.barn.w * (W >= 900 ? 1 : 3)));
      c = { z: z2, x: W >= 900 ? WORLD.barn.w / 2 - W / z2 / 2 : 110 + PW / 2 - W / z2 / 2, y: 0 };
    }
    return clampCam(c, k);
  }
  function useCam() { if (!W || !isMap(tab)) return; if (!CAMS[tab]) CAMS[tab] = homeCam(tab); cam = CAMS[tab]; }
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
  function bigOf(i) { return BIG[Math.floor(i / CELLS)]; }
  function bigOpen(k) { return !!(S.bp && S.bp[k]); }
  function plotRect(i) {
    var g = L.gap, B = bigOf(i), j = i % CELLS;
    return { x: B.x + (j % BP) * CW + g / 2, y: B.y + Math.floor(j / BP) * CW + g / 2, s: CW - g };
  }
  function plotOpen(i) { if (i < 0 || i >= TOTAL) return false; return bigOpen(Math.floor(i / CELLS)); }

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
    } else if (kind === 'barn') barn(c, W / 2, hd - 4, 84);
    else gate(c, W / 2, hd - 2, kind === 'prod' ? '🏭 KHU SẢN XUẤT' : '🎡 KHU VUI CHƠI', kind === 'prod' ? '#7c3aed' : '#ef4444');
  }
  function gate(c, x, by, txt, col) {   // cổng chào của khu
    c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(x, by, 150, 10, 0, 0, 7); c.fill();
    c.fillStyle = '#7a5032'; c.fillRect(x - 130, by - 92, 12, 92); c.fillRect(x + 118, by - 92, 12, 92);
    c.font = '900 22px ' + TF; var w = Math.max(250, c.measureText(txt).width + 44);
    c.fillStyle = col; rr(c, x - w / 2, by - 118, w, 44, 12); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 3; rr(c, x - w / 2, by - 118, w, 44, 12); c.stroke();
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, by - 95);
    emo(c, '🎈', x - w / 2 - 6, by - 126, 22); emo(c, '🎈', x + w / 2 + 6, by - 126, 22);
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
  /* Đường đất chạy giữa các ô ruộng lớn (quy hoạch vuông vắn) */
  var LANES_V = [BCX[0] + BPS + (BCX[1] - BCX[0] - BPS) / 2, BCX[1] + BPS + (BCX[2] - BCX[1] - BPS) / 2];
  var LANES_H = [0, 1, 2, 3].map(function (r) { return BY0 + r * BSTEP + BPS + (BSTEP - BPS) / 2; });
  function lane(x1, y1, x2, y2) { ctx.strokeStyle = '#c9a46a'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = '#dcbd85'; ctx.lineWidth = 18; ctx.stroke(); }
  function drawFieldWorld(v) {
    ground(v); drawSky(ctx, 'field', v);
    var x0 = BCX[0] - 45, x1 = BCX[2] + BPS + 45, y0 = BY0 - 45, y1 = BY0 + 4 * BSTEP + BPS + 45;
    ctx.lineCap = 'square';
    LANES_V.forEach(function (x) { lane(x, HD + 6, x, y1); });
    LANES_H.forEach(function (y) { lane(x0, y, x1, y); });
    lane(x0, y0, x1, y0); lane(x0, y1, x1, y1); lane(x0, y0, x0, y1); lane(x1, y0, x1, y1);
    lane(BIG[0].x + BPS / 2, HD + 6, BIG[0].x + BPS / 2, y0);
    ctx.lineCap = 'butt';
    BIG.forEach(function (B) {
      if (!vis(v, B.x - 30, B.y - 40, BPS + 60, BPS + 70)) return;
      var op = bigOpen(B.k);
      ctx.fillStyle = op ? 'rgba(160,120,70,.4)' : 'rgba(70,120,40,.45)'; rr(ctx, B.x - 10, B.y - 10, BPS + 20, BPS + 20, 16); ctx.fill();
      if (op) { ctx.fillStyle = 'rgba(120,85,45,.25)'; rr(ctx, B.x - 5, B.y - 5, BPS + 10, BPS + 10, 12); ctx.fill(); }
      if (!op) ctx.globalAlpha = 0.5;
      fence(ctx, B.x - 13, B.y - 10, BPS + 26, BPS + 18);
      ctx.globalAlpha = 1;
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
    ground(v); drawSky(ctx, 'barn', v);
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
  var BHITS = [];
  function drawBuildings(v) {
    BHITS = [];   // xưởng chế biến đã chuyển sang 🏭 Khu sản xuất, ở đây chỉ còn nhà, giếng, cối xay gió
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
      return tapB(h.id);
    }
    return false;
  }
  function tapB(id) {
    {
      var P = id === 'house' ? BPOS.them : BPOS[id], got = 0, msg = [];
      if (id === 'house') {
        ['them', 'nha2', 'nha3'].forEach(function (k) { got += collectInc(k); });
        if (giftReady()) { var gm = giftAmt(); S.gift = dayKey(); addMoney(gm); S.fz.f1++; addLog('in', gm, 'gift', 'Quà mỗi ngày', '🎁'); got += gm; msg.push('🎁 Quà mỗi ngày'); }
        if (!got && S.dmg.house) { toast('💧 Nhà bị dột: tạm dừng thu nhập và quà mỗi ngày. Vào 🎯 Nhiệm vụ → Sự cố để sửa mái.'); return true; }
        if (!got) { toast(built('them') ? '🏠 Nhà của bạn. Thu nhập: +' + short(['them', 'nha2', 'nha3'].reduce(function (a, k) { return a + (built(k) ? BM[k].inc : 0); }, 0)) + '/giờ, ghé lại sau nhé!' : '🏠 Xây 🪵 Thềm nhà (🏭 Sản xuất → 🏡 Công trình) để nhà có thu nhập và quà mỗi ngày.'); return true; }
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
      toast(msg.join(' · ')); hud(); save(); renderProd();
      return true;
    }
  }

  /* ================= VẼ RUỘNG ================= */
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
    BIG.forEach(function (B) {
      if (!vis(v, B.x - 30, B.y - 50, BPS + 60, BPS + 80)) return;
      var st = bigState(B.k);
      // biển số ô ruộng
      ctx.font = '800 13px ' + TF; var lb = '🌾 Ô ruộng ' + (B.k + 1), lw = ctx.measureText(lb).width + 18;
      ctx.fillStyle = st === 'open' ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.7)'; rr(ctx, B.x - 6, B.y - 42, lw, 22, 11); ctx.fill();
      ctx.fillStyle = '#5b3a12'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(lb, B.x + 3, B.y - 30.5);
      if (st === 'open') return;
      var R0 = mulberry(B.k * 7 + 3);
      for (var k = 0; k < 10; k++) emo(ctx, ['🌿', '🍀', '🌼', '🪨', '🌾'][Math.floor(R0() * 5)], B.x + 18 + R0() * (BPS - 36), B.y + 18 + R0() * (BPS - 36), 13 + R0() * 6);
      ctx.strokeStyle = st === 'buy' ? '#fde68a' : 'rgba(255,255,255,.4)'; ctx.setLineDash([8, 6]); ctx.lineWidth = st === 'buy' ? 3 : 2; rr(ctx, B.x + 2, B.y + 2, BPS - 4, BPS - 4, 12); ctx.stroke(); ctx.setLineDash([]);
      var bh = 64, bw = BPS - 24, bx = B.x + 12, by = B.y + (BPS - bh) / 2;
      ctx.fillStyle = 'rgba(0,0,0,.2)'; rr(ctx, bx + 2, by + 4, bw, bh, 14); ctx.fill();
      ctx.fillStyle = st === 'buy' ? '#b45309' : 'rgba(36,54,26,.88)'; rr(ctx, bx, by, bw, bh, 14); ctx.fill();
      if (st === 'lv') sign(bx + 4, by, bw - 8, bh, '🔒', 'Ô ruộng ' + (B.k + 1) + ' · 16 ô đất', 'Mở ở cấp ' + B.lv);
      else sign(bx + 4, by, bw - 8, bh, '🪧', 'Mua ô ruộng ' + (B.k + 1) + ': ' + short(B.cost), 'Ví 📈 Đầu tư · chạm để mua');
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
  /* Trạng thái 1 chuồng: bao nhiêu con có sản phẩm, đói (chưa cho ăn), đang lớn */
  function penStat(i) {
    var P = S.pens[i], r = { ready: 0, hungry: 0, grow: 0, left: 1e9, n: 0, a: P ? AM[P.a] : null, pz: false };
    if (!P) return r;
    var a = AM[P.a]; r.pz = animPaused(a.id);
    penList(i).forEach(function (x) { r.n++; if (x.s === 2) r.ready++; else if (x.s === 0) r.hungry++; else { r.grow++; r.left = Math.min(r.left, (1 - x.p) * a.t); } });
    r.noFeed = r.hungry > 0 && (S.inv[a.feed] || 0) < 1;
    return r;
  }
  /* Viền màu + nhãn trạng thái của chuồng: nhìn qua là biết chuồng nào có sản phẩm, chuồng nào chưa cho ăn */
  function penBadges(p, a, st) {
    var col = st.ready ? '#22c55e' : st.hungry ? (st.noFeed ? '#ef4444' : '#f97316') : '#3b82f6';
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 7; if (!st.ready && !st.hungry) ctx.setLineDash([14, 9]);
    rr(ctx, p.x - 4, p.y - 4, p.w + 8, p.h + 8, 19); ctx.stroke(); ctx.restore();
    var items = [];
    if (st.ready) items.push(['🧺 ' + st.ready + ' ' + PRODUCTS[a.p].e + ' chờ thu', '#16a34a']);
    if (st.hungry) items.push([st.noFeed ? '🍽️ ' + st.hungry + ' con đói · hết ' + CM[a.feed].e : '🍽️ ' + st.hungry + ' con chưa cho ăn', st.noFeed ? '#dc2626' : '#ea580c']);
    if (!items.length) items.push(['⏳ Có ' + PRODUCTS[a.p].e + ' sau ' + dur(st.left), '#2563eb']);
    var k = Math.min(2.4, Math.max(1, 0.85 / cam.z)), fs = Math.round(13 * k), hh = Math.round(28 * k);
    ctx.font = '900 ' + fs + 'px ' + TF;
    if (k > 1.25) {   // đang thu nhỏ: nhãn to ở giữa chuồng
      var y0 = p.y + p.h / 2 - (items.length * (hh + 6)) / 2;
      items.forEach(function (it, n) {
        var w = Math.min(p.w - 12, ctx.measureText(it[0]).width + 24 * k), x = p.x + p.w / 2 - w / 2, y = y0 + n * (hh + 6);
        ctx.fillStyle = 'rgba(0,0,0,.25)'; rr(ctx, x + 2, y + 3, w, hh, hh / 2); ctx.fill();
        ctx.fillStyle = it[1]; rr(ctx, x, y, w, hh, hh / 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it[0], x + w / 2, y + hh / 2 + 1, w - 10);
        HITS.push({ x: x, y: y, w: w, h: hh, fn: function () { careAll(a, p.i); } });
      });
      return;
    }
    var y = p.y + 8;
    items.forEach(function (it) {
      var w = ctx.measureText(it[0]).width + 20, x = p.x + p.w - 10 - w;
      ctx.fillStyle = it[1]; rr(ctx, x, y, w, 26, 13); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; rr(ctx, x, y, w, 26, 13); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it[0], x + w / 2, y + 13.5);
      HITS.push({ x: x, y: y, w: w, h: 26, fn: function () { careAll(a, p.i); } });
      y += 31;
    });
  }
  /* Thanh tóm tắt trên bản đồ: tên khu + việc cần làm (chạm để làm ngay hoặc bay tới chỗ đó) */
  var zbSig = '';
  /* ===== 🌱 Bảng chọn cây trồng vào các ô trống: chọn loại cây + số ô, xác nhận là game tự gieo từ trên xuống ===== */
  var PBQ = {};
  function pbEmpty() {
    var r = []; for (var i = 0; i < TOTAL; i++) { var pl = S.plots[i]; if (plotOpen(i) && !pl.c && !pl.dmg) r.push(i); }
    return r.sort(function (a, b) { var A = plotRect(a), B = plotRect(b); return A.y - B.y || A.x - B.x; });
  }
  function pbSum() { var t = 0; for (var k in PBQ) t += PBQ[k] || 0; return t; }
  function pbSet(id, q) {
    var E = pbEmpty().length, other = pbSum() - (PBQ[id] || 0);
    PBQ[id] = Math.max(0, Math.min(E - other, Math.floor(+q || 0)));
    if (!PBQ[id]) delete PBQ[id];
  }
  function pbCrops() { return CROPS.filter(function (c) { return c.lv <= S.lv; }); }
  function plantBox() {
    var E = pbEmpty().length; if (!E) { toast('Không còn ô trống nào. Thu hoạch hoặc mua thêm ô ruộng nhé!'); return; }
    PBQ = {}; var c0 = CM[S.sel] && CM[S.sel].lv <= S.lv ? S.sel : 'lua'; PBQ[c0] = E;
    pbRender(); $('fmPB').classList.add('on');
  }
  function pbClose() { $('fmPB').classList.remove('on'); }
  function pbRender() {
    var E = pbEmpty().length;
    var h = '<div class="fm-pbh"><b>🌱 Chọn cây trồng</b><small>' + E + ' ô trống</small><button data-a="pbClose" aria-label="Đóng">✕</button></div><div class="fm-pbl">';
    h += pbCrops().map(function (c) {
      var q = PBQ[c.id] || 0, w = c.per ? 'invest' : 'essential';
      return '<div class="fm-pbr' + (q ? ' sel' : '') + '"><span class="e">' + c.e + '</span><span class="n"><b>' + c.n + '</b><small>' + short(c.cost) + '/ô ' + WM[w].e + ' · ' + durL(c.t) + (c.per ? ' · lâu năm' : '') + '</small></span>' +
        '<button class="st" data-a="pbStep" data-c="' + c.id + '" data-d="-1">−</button><input type="number" inputmode="numeric" min="0" max="' + E + '" data-pb="' + c.id + '" value="' + q + '"><button class="st" data-a="pbStep" data-c="' + c.id + '" data-d="1">+</button>' +
        '<button class="all" data-a="pbAll" data-c="' + c.id + '">Toàn bộ</button></div>';
    }).join('');
    h += '</div><div class="fm-pbf" id="fmPBF"></div>';
    $('fmPB').innerHTML = h; pbFoot();
  }
  function pbFoot() {
    var E = pbEmpty().length, n = pbSum(), need = { essential: 0, invest: 0 }, parts = [];
    pbCrops().forEach(function (c) { var q = PBQ[c.id] || 0; if (!q) return; need[c.per ? 'invest' : 'essential'] += q * c.cost; parts.push(c.e + '×' + q); });
    var lack = ['essential', 'invest'].filter(function (w) { return need[w] > S.jar[w]; });
    var h = '<div class="sum">Đã chọn <b>' + n + '/' + E + '</b> ô' + (parts.length ? ': ' + parts.join(' ') : '') + (n < E ? ' · <span class="r">còn ' + (E - n) + ' ô chưa chọn cây</span>' : ' · <b>kín hết ô trống ✓</b>') + '<br>' +
      ['essential', 'invest'].filter(function (w) { return need[w]; }).map(function (w) { return 'Chi ' + money(need[w]) + ' từ ví ' + WM[w].e + ' ' + WM[w].n + ' (đang có ' + short(S.jar[w]) + ')'; }).join('<br>') +
      (lack.length ? '<br><span class="r">⚠️ Ví không đủ tiền: chỉ gieo được đến khi hết tiền.</span>' : '') + '</div>';
    var last = pbCrops().filter(function (c) { return PBQ[c.id]; }).pop();
    h += '<div class="fm-row">' + (n < E && last ? '<button class="fm-btn alt" data-a="pbFill" data-c="' + last.id + '">' + last.e + ' Trồng kín ' + (E - n) + ' ô còn lại</button>' : '<button class="fm-btn alt" data-a="pbClear">Xoá chọn</button>') +
      '<button class="fm-btn" data-a="pbGo"' + (n ? '' : ' disabled') + '>✅ Xác nhận trồng ' + n + ' ô</button></div>';
    $('fmPBF').innerHTML = h;
    var rows = $('fmPB').querySelectorAll('.fm-pbr input');
    for (var i = 0; i < rows.length; i++) { var id = rows[i].getAttribute('data-pb'), q = PBQ[id] || 0; rows[i].parentNode.classList.toggle('sel', q > 0); if (document.activeElement !== rows[i]) rows[i].value = q; }
  }
  function pbGo() {
    var cells = pbEmpty(), k = 0, done = {}, n = 0, keep = S.sel, stop = false;
    pbCrops().forEach(function (c) {
      var q = PBQ[c.id] || 0;
      for (var j = 0; j < q && k < cells.length && !stop; j++) {
        S.sel = c.id;
        if (plant(cells[k])) { k++; n++; done[c.id] = (done[c.id] || 0) + 1; } else stop = true;
      }
    });
    S.sel = keep;
    if (!n) return;
    pbClose(); sfx('ok'); save(); hud(); toolsUI(); zoneBar(true);
    var left = pbEmpty().length;
    toast('🌱 Đã gieo ' + n + ' ô: ' + Object.keys(done).map(function (id) { return CM[id].e + '×' + done[id]; }).join(' ') + (left ? ' · còn ' + left + ' ô trống' : ' · kín hết ô trống!') + (stop ? ' · ⚠️ Ví hết tiền nên dừng gieo' : ''));
  }
  function fieldStat() {
    var r = { ripe: 0, empty: 0, dmg: 0, grow: 0 }, fe = -1;
    for (var i = 0; i < TOTAL; i++) { if (!plotOpen(i)) continue; var pl = S.plots[i]; if (pl.dmg) r.dmg++; else if (!pl.c) { r.empty++; if (fe < 0) fe = i; } else if (pl.p >= 1) r.ripe++; else r.grow++; }
    r.fe = fe; return r;
  }
  function zoneBar(force) {
    var el = $('fmZB'), h = '';
    if (tab === 'field') {
      var f = fieldStat();
      h = (f.ripe ? '<button class="ok" data-a="harvestAll">🧺 ' + f.ripe + ' cây chín · thu</button>' : '') + (f.empty ? '<button class="can" data-a="pbOpen">🌱 ' + f.empty + ' ô trống · chọn cây trồng</button>' : '') + (f.dmg ? '<button class="bad" data-a="tab" data-t="quest">🥀 ' + f.dmg + ' ô bị hỏng</button>' : '') + (!f.ripe && !f.empty && !f.dmg && f.grow ? '<span class="work">⏳ ' + f.grow + ' cây đang lớn</span>' : '');
    } else if (tab === 'barn') {
      var c = { ready: 0, hungry: 0, grow: 0, bad: 0 }, nf = false;
      for (var i = 0; i < NLOT; i++) { var st = penStat(i); if (!st.n) continue; if (st.pz) { c.bad++; continue; } if (st.ready) c.ready++; if (st.hungry) { c.hungry++; if (st.noFeed) nf = true; } if (!st.ready && !st.hungry) c.grow++; }
      h = '<button class="ok" data-a="barnGet">🧺 Thu hết' + (c.ready ? ' (' + c.ready + ')' : '') + '</button><button class="go" data-a="careAllB">⚡ Chăm hết' + (c.hungry ? ' (' + c.hungry + ' đói)' : '') + '</button>';
    }
    else if (tab === 'prod') {
      var pc = prodCounts();
      h = '<span class="zn">🏭 Khu sản xuất</span>' + (pc.ready || pc.can ? '<button class="ok" data-a="prodAll">⚡ ' + (pc.ready ? pc.ready + ' mẻ xong' : '') + (pc.ready && pc.can ? ' · ' : '') + (pc.can ? pc.can + ' đủ nguyên liệu' : '') + '</button>' : '') + (pc.inc >= 1000 ? '<button class="go" data-a="incAll">🪙 Thu +' + short(pc.inc) + '</button>' : '') + (pc.work ? '<span class="work">⏳ ' + pc.work + ' đang làm</span>' : '') + (pc.leak ? '<button class="bad" data-a="tab" data-t="quest">🔧 ' + pc.leak + ' bị dột</button>' : '') + '<button class="can" data-a="lotList" data-k="prod">📋 Danh sách</button>';
    } else if (tab === 'fun') {
      var fr = funReady(), fo = FUN.filter(function (F0) { return funState(F0) === 'open'; }).length;
      h = '<span class="zn">🎡 Khu vui chơi</span>' + (fr ? '<button class="ok" data-a="funAll">😊 ' + fr + ' khu chơi xong · nhận</button>' : '') + (fo ? '<span class="work">🎟️ ' + fo + ' khu còn lượt</span>' : '') + '<button class="can" data-a="lotList" data-k="fun">📋 Danh sách</button>';
    }
    else if (tab === 'quest') {
      h = '<button class="qv' + (qView === 'act' ? ' on' : '') + '" data-a="qview" data-v="act">⏳ Đang thực hiện · ' + qCnt.a + '</button><button class="qv' + (qView === 'new' ? ' on' : '') + '" data-a="qview" data-v="new">📋 Chưa thực hiện · ' + qCnt.n + '</button>';
    }
    var two = tab === 'quest' || tab === 'barn'; if (el.classList.contains('two') !== two) el.classList.toggle('two', two);
    if (force || h !== zbSig) { el.innerHTML = h; zbSig = h; if (force) el.scrollLeft = 0; }
    var dsp = h ? '' : 'none'; if (el.style.display !== dsp) { el.style.display = dsp; if (running) resize(); }
  }
  function zoneGo(k) {
    for (var i = 0; i < NLOT; i++) {
      var st = penStat(i); if (!st.n || st.pz) continue;
      if ((k === 'ready' && st.ready) || (k === 'hungry' && st.hungry) || (k === 'grow' && !st.ready && !st.hungry)) { var p = L.pens[i]; flyTo('barn', p.x + p.w / 2, p.y + p.h / 2, Math.max(cam.z, Math.min(1.1, (W - 16) / (p.w + 40)))); return; }
    }
  }
  /* Chăm cả khu chăn nuôi: thu hết sản phẩm, cho ăn hết các con đói */
  function careEverything(onlyGet) {
    var got = 0, fed = 0, miss = {}, sick = 0;
    for (var i = 0; i < NLOT; i++) {
      var P = S.pens[i]; if (!P) continue; var a = AM[P.a];
      if (animPaused(a.id)) { if (penList(i).length) sick++; continue; }
      penList(i).forEach(function (x) { if (x.s === 2) { collectOne(a, x); got++; } });
      if (!onlyGet) penList(i).forEach(function (x) { if (x.s === 0) { if (feedOne(a, x)) fed++; else miss[a.feed] = (miss[a.feed] || 0) + 1; } });
    }
    var mk = Object.keys(miss);
    if (got || fed) sfx('ok'); else sfx('bad');
    if (onlyGet) { toast(got ? '🧺 Thu ' + got + ' sản phẩm vào kho.' + (sick ? ' ' + sick + ' chuồng đang hỏng/ốm.' : '') : 'Chưa có sản phẩm nào để thu. Bấm ⚡ Chăm hết để cho các con ăn nhé!'); hud(); save(); zoneBar(true); return; }
    toast(((got ? 'Thu ' + got + ' sản phẩm. ' : '') + (fed ? 'Cho ăn ' + fed + ' con. ' : '') + (mk.length ? 'Thiếu ' + mk.map(function (k) { return miss[k] + ' ' + CM[k].e; }).join(', ') + ' để cho ăn (trồng thêm ở Khu trồng trọt). ' : '') + (sick ? sick + ' chuồng đang hỏng/ốm, vào 🎯 Nhiệm vụ để sửa.' : '')) || 'Các con đang no, chờ chút nhé!');
    hud(); save(); zoneBar(true);
  }
  function drawBarn(dt) {
    var v = view(); drawDefenses('barn');
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
      var bx = p.x + 12, by = p.y + p.h - 38;
      if (list.length) bx += pillL(ctx, bx, by, '⚡ Chăm tất cả', '#16a34a', '#fff', function () { careAll(a, p.i); }) + 8;
      if (list.length < cap) bx += pillL(ctx, bx, by, '＋ Mua ' + a.n.toLowerCase() + ' −' + short(a.cost) + ' 📈', '#f59e0b', '#fff', function () { buyAnimal(a, p.i); }) + 8;
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
      if (list.length && !animPaused(a.id)) penBadges(p, a, penStat(p.i));
      if (animPaused(a.id)) {
        var pen = S.dmg.pen[a.id], txt = pen ? '🔨 Chuồng bị gió lốc làm hỏng' : '🤒 ' + a.n + ' bị ốm, cần chữa bệnh';
        ctx.fillStyle = pen ? 'rgba(120,53,15,.45)' : 'rgba(30,64,175,.28)'; rr(ctx, p.x, p.y, p.w, p.h, 16); ctx.fill();
        if (pen) { ctx.strokeStyle = '#78350f'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p.x + 30, p.y + 50); ctx.lineTo(p.x + 70, p.y + 90); ctx.moveTo(p.x + p.w - 40, p.y + 60); ctx.lineTo(p.x + p.w - 80, p.y + 110); ctx.stroke(); }
        var kz = Math.min(2.4, Math.max(1, 0.85 / cam.z)), hz = 30 * kz;
        ctx.save(); ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 7; rr(ctx, p.x - 4, p.y - 4, p.w + 8, p.h + 8, 19); ctx.stroke(); ctx.restore();
        ctx.font = '800 ' + Math.round(14 * kz) + 'px ' + TF; var tw2 = Math.min(p.w - 8, ctx.measureText(txt).width + 24 * kz);
        ctx.fillStyle = '#dc2626'; rr(ctx, p.x + p.w / 2 - tw2 / 2, p.y + p.h / 2 - 4 - hz, tw2, hz, hz / 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, p.x + p.w / 2, p.y + p.h / 2 - 4 - hz / 2 + 1, tw2 - 10);
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
  var lastT = 0, lastZB = 0;
  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now; tm += dt;
    var t = Date.now(); update(t);
    if (t - lastSave > 5000) { lastSave = t; checkDisaster(t); checkRaid(t); save(); badges(); walletBar(); }
    if (S.fix.length) fixTick(t);
    defTick(t);
    if (isMap(tab)) {
      if (t - lastZB > 600) { lastZB = t; zoneBar(); }
      if ((tab === 'prod' || tab === 'fun') && t - lastPanel > 1000) { lastPanel = t; if (tab === 'prod') tickProd(); else tickFun(); }
      useCam(); stepCam(dt); HITS = [];
      var z = cam.z * DPR, v = view();
      ctx.setTransform(z, 0, 0, z, -cam.x * z, -cam.y * z);
      if (tab === 'field') drawFieldWorld(v); else if (tab === 'barn') drawBarnWorld(v); else drawLotWorld(tab, v);
      if (v.y0 < HD) drawClouds(dt);
      if (tab === 'field') drawField(); else if (tab === 'barn') drawBarn(dt); else drawLots(tab, v);
      drawFX(dt);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (tab === 'field') drawTip();
      if (WX && Date.now() < WX.until) drawWeather(dt); else WX = null;
    } else if (tab === 'quest' && t - lastPanel > 1000) { lastPanel = t; tickQuest(); }
    raf = requestAnimationFrame(loop);
  }

  /* ================= HÀNH ĐỘNG TRÊN RUỘNG ================= */
  var drag = null;
  function plotAt(x, y) {   // toạ độ thế giới → số ô (-1 nếu không trúng ô nào)
    for (var q = 0; q < BIGN; q++) { var B = BIG[q]; if (x >= B.x && y >= B.y && x < B.x + BPS && y < B.y + BPS) return q * CELLS + Math.floor((y - B.y) / CW) * BP + Math.floor((x - B.x) / CW); }
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
    spend(sw, cr.cost, 'seed_' + cr.id, (cr.per ? 'Mua cây giống ' : 'Mua hạt giống ') + cr.n, cr.e);
    pl.c = cr.id; pl.p = 0; pl.t = Date.now(); pl.w = 0; pl.n = 0; ev('plant', cr.id);
    burst(R.x + R.s / 2, R.y + R.s * 0.8, ['#8d5a2b', '#6b4423', '#c08a55'], 7);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.4, '−' + short(cr.cost) + ' ' + WM[sw].e, '#fecaca');
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
      buyBig(Math.floor(i / CELLS));
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
  function bigState(k) { var B = BIG[k]; return bigOpen(k) ? 'open' : S.lv < B.lv ? 'lv' : 'buy'; }
  function buyBig(k) {
    var B = BIG[k], st = bigState(k);
    if (st === 'open') return;
    if (st === 'lv') { toast('🔒 Ô ruộng số ' + (k + 1) + ' mở ở cấp ' + B.lv + '. Làm 🎯 Nhiệm vụ để tích kinh nghiệm nhé!'); return; }
    confirmBox('🌾', 'Mua ô ruộng số ' + (k + 1) + '?', 'Thêm <b>16 ô đất</b> có rào quanh với giá <b>' + money(B.cost) + '</b>. Đây là khoản <b>đầu tư</b>: trả một lần, trồng được mãi mãi.<br>' + wpay('invest', B.cost), 'Mua đất', function () {
      if (!has('invest', B.cost)) { noMoney(B.cost, 'invest'); return; }
      S.bp[k] = Date.now(); spend('invest', B.cost, 'big' + k, 'Mua ô ruộng số ' + (k + 1), '🌾');
      addXP(Math.max(5, Math.round(B.cost / 100000)));
      sfx('win'); save(); hud(); toast('🎉 Đã mở ô ruộng số ' + (k + 1) + '! Chạm hoặc vuốt để gieo hạt.');
      burst(B.x + BPS / 2, B.y + BPS / 2, ['#fde047', '#86efac', '#fff', '#f59e0b'], 24);
    });
  }

  /* ================= VẬT NUÔI ================= */
  function buyAnimal(a, i) {
    if (penList(i).length >= capPen(a)) { toast('Chuồng đã đầy. Xây thêm chuồng ở ô đất trống để nuôi thêm!'); return; }
    if (!has('invest', a.cost)) { noMoney(a.cost, 'invest'); return; }
    S.an[a.id].push({ s: 0, p: 0, t: Date.now(), pen: i }); spend('invest', a.cost, 'buy_' + a.id, 'Mua ' + a.n.toLowerCase(), a.e);
    sfx('win'); hud(); save(); toast(a.e + ' Mua 1 con ' + a.n.toLowerCase() + ': −' + money(a.cost) + ' từ ví 📈 Đầu tư. Chạm vào để cho ăn ' + CM[a.feed].e);
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
        '<small>' + (lk ? 'Mở ở cấp ' + a.lv : 'Chuồng ' + money(pc) + ' · mỗi con ' + money(a.cost) + ' (ví 📈 Đầu tư) · nuôi ' + capPen(a) + ' con<br>Ăn ' + CM[a.feed].e + ' ' + CM[a.feed].n.toLowerCase() + ' → ' + PRODUCTS[a.p].e + ' ' + PRODUCTS[a.p].n.toLowerCase() + ' (bán ' + short(PRODUCTS[a.p].sell) + ') mỗi ' + durL(a.t)) + '</small>' +
        (lk ? '' : '<span class="fm-row" style="margin-top:6px"><button class="fm-btn org" data-a="penBuild" data-i="' + i + '" data-k="' + a.id + '"' + (S.jar.invest < pc ? ' disabled' : '') + '>🔨 Xây · −' + short(pc) + ' 📈</button>' + (S.jar.invest < pc ? '<span class="fm-tag">Ví Đầu tư chưa đủ</span>' : '') + '</span>') + '</span></div>';
    });
    sheet(h + '<button class="fm-btn alt" data-a="sheetClose" style="width:100%">Để sau</button>');
  }
  function penBuild(i, k) {
    var a = AM[k], pc = penCost(a);
    if (S.pens[i] || S.lv < LOTLV[i] || S.lv < a.lv) return;
    if (!has('invest', pc)) { noMoney(pc, 'invest'); return; }
    spend('invest', pc, 'pen_' + k, 'Xây ' + a.pen.toLowerCase(), a.e);
    S.pens[i] = { a: k }; addXP(Math.max(3, Math.round(pc / 50000)));
    closeSheet(); sfx('win'); save(); hud();
    var p = L.pens[i]; burst(p.x + p.w / 2, p.y + p.h / 2, ['#fde047', '#86efac', '#fff'], 24);
    toast('🎉 Đã xây ' + a.pen.toLowerCase() + ' (−' + short(pc) + ' ví 📈 Đầu tư)! Bấm “＋ Mua ' + a.n.toLowerCase() + '” để nuôi con đầu tiên.');
  }
  function penDemolish(i) {
    var P = S.pens[i]; if (!P || penList(i).length) return;
    var a = AM[P.a], back = Math.round(penCost(a) * 0.5 / 1000) * 1000;
    confirmBox('🔄', 'Dỡ ' + a.pen.toLowerCase() + '?', 'Dỡ chuồng để xây chuồng khác ở ô này. Bán lại vật liệu được <b>' + money(back) + '</b> (một nửa giá xây) vào ví Đầu tư.', 'Dỡ chuồng', function () {
      S.pens[i] = null; addMoney(back, 'invest'); addLog('in', back, 'pen_sell', 'Bán vật liệu ' + a.pen.toLowerCase(), '🔄', 1, 'invest'); save(); hud(); penPick(i);
    });
  }

  /* ================= GIAO DIỆN HTML ================= */
  function hud() {
    $('fmLv').textContent = S.lv;
    var nd = need(S.lv); $('fmXp').style.width = Math.min(100, S.xp / nd * 100) + '%';
    $('fmXpT').textContent = S.xp + '/' + nd + ' KN';
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
    }).join('') + '<button class="set" data-a="pctSet" aria-label="Cài đặt tỷ lệ 6 ví" style="--wc:#fde68a"><span class="n">⚙️ Tỷ lệ</span><span class="b" style="font-size:12px">Cài đặt</span></button><button class="set" data-a="book" aria-label="Sổ thu chi" style="--wc:#fde68a"><span class="n">📒 Sổ</span><span class="b" style="font-size:12px">Thu chi</span></button>';
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
    var b = 0; for (var pi = 0; pi < NLOT; pi++) { var ps = penStat(pi); if (ps.n && !ps.pz && (ps.ready || ps.hungry)) b++; }
    dot('fmDotB', b);   // số chuồng cần chăm (có sản phẩm hoặc chưa cho ăn)
    var f = 0; BUILDS.forEach(function (x) { var s = wsState(x); if (s === 'ready' || s === 'can') f++; });
    dot('fmDotK', f);
    dot('fmDotQ', claimable());
    dot('fmDotV', funReady());
    var fr = 0; for (var i = 0; i < TOTAL; i++) { var pl = S.plots[i]; if (pl.c && pl.p >= 1 && !pl.dmg && plotOpen(i)) fr++; }
    dot('fmDotF', fr > 99 ? '99+' : fr);
    notifBadge();
  }
  var toastT = 0;
  function toast(t) { var el = $('fmToast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2800); }
  var SK = null;
  function sheet(html) { SK = null; $('fmSB').innerHTML = html; $('fmSheet').classList.add('on'); $('fmSB').scrollTop = 0; }
  var sheetQ = [];
  function closeSheet() { SK = null; $('fmSheet').classList.remove('on'); if (sheetQ.length) { var nx = sheetQ.shift(); setTimeout(function () { if (running) sheet(nx); }, 220); } }
  function sheetLater(html) { if ($('fmSheet').classList.contains('on')) sheetQ.push(html); else sheet(html); }
  var confirmFn = null;
  function confirmBox(e, t, body, ok, fn) {
    confirmFn = fn;
    sheet('<div class="fm-modal"><div class="big">' + e + '</div><h2>' + t + '</h2><p>' + body + '</p><div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Để sau</button><button class="fm-btn org" data-a="confirm">' + ok + '</button></div></div>');
  }
  function seedSheet() {
    var h = '<div class="fm-h">🌱 Chọn hạt giống</div>' + wpay('essential') + '<p class="fm-sub">Hạt giống là chi phí sản xuất nên trừ ví 🏠 Thiết yếu. Chọn xong, chạm (hoặc vuốt) lên các ô đất trống để gieo. <b>Lãi</b> = giá bán − tiền hạt giống. Cây lâu lớn thích hợp trồng trước khi đi học, đi ngủ.</p>';
    CROPS.forEach(function (c, ci) {
      var lk = c.lv > S.lv, pr = c.sell - c.cost;
      if (c.per && !CROPS[ci - 1].per) h += '<div class="fm-h" style="margin-top:12px">🌳 Cây ăn quả lâu năm</div><p class="fm-sub">Cây giống đắt (trừ ví 📈 Đầu tư) và lần đầu lớn lâu, nhưng <b>trồng 1 lần, thu hoạch mãi mãi</b>, không tốn tiền giống nữa. Đúng là một khoản đầu tư dài hạn!</p>';
      if (c.per) { h += '<button class="fm-seed' + (S.sel === c.id ? ' on' : '') + '" data-a="pick" data-c="' + c.id + '"' + (lk ? ' disabled' : '') + '><span class="e">' + (lk ? '🔒' : c.e) + '</span><span class="tx"><b>' + c.n + '</b><small>' + (lk ? 'Mở ở cấp ' + c.lv : 'Cây giống ' + money(c.cost) + ' 📈 · lần đầu ' + durL(c.t) + ' · sau đó cứ ' + durL(c.re) + ' ra 1 lứa · bán ' + money(c.sell)) + '</small></span>' + (lk ? '' : '<span class="pr">+' + short(c.sell) + '<small>mỗi lứa</small></span>') + '</button>'; return; }
      h += '<button class="fm-seed' + (S.sel === c.id ? ' on' : '') + '" data-a="pick" data-c="' + c.id + '"' + (lk ? ' disabled' : '') + '><span class="e">' + (lk ? '🔒' : c.e) + '</span><span class="tx"><b>' + c.n + '</b>' +
        '<small>' + (lk ? 'Mở ở cấp ' + c.lv : 'Hạt ' + money(c.cost) + ' 🏠 · ⏱ ' + durL(c.t) + ' · bán ' + money(c.sell)) + '</small></span>' +
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
    var h = '<div class="fm-h">🧪 Chọn loại phân bón</div>' + wpay('essential') + '<p class="fm-sub">Bón vào cây đang lớn. <b>Phân càng đắt càng rút ngắn nhiều thời gian.</b> Phân bón là chi phí sản xuất nên trừ ví 🏠 Thiết yếu.</p>';
    FERTS.forEach(function (f) {
      h += '<div class="fm-seed' + (S.selF === f.id ? ' on' : '') + '" style="cursor:default"><span class="e">' + f.e + '</span><span class="tx"><b>' + f.n + '</b><small>' + f.d + ' · ' + money(f.p) + '/túi · đang có <b>' + (S.fz[f.id] || 0) + '</b> túi</small>' +
        '<span class="fm-row" style="margin-top:6px"><button class="fm-btn" data-a="pickF" data-f="' + f.id + '"' + (S.fz[f.id] ? '' : ' disabled') + '>Dùng loại này</button><button class="fm-btn org" data-a="buyFert" data-f="' + f.id + '" data-q="1">Mua 1 · −' + short(f.p) + ' 🏠</button></span></span></div>';
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
    sheetLater('<div class="fm-modal"><div class="big">👩‍🌾</div><h2>Chào mừng đến Nông trại Sixpay!</h2><p style="font-size:13.5px">Nông trại có <b>4 khu</b>, chọn ở thanh dưới cùng:</p><ul class="fm-guide">' +
      '<li><i>🌾</i><span><b>Khu trồng trọt:</b> chọn hạt giống rồi <b>chạm hoặc vuốt</b> lên ô đất trống để gieo, bấm 🪣 Tưới hết, bón phân cho cây lớn nhanh. Cây ăn quả 🌳 trồng 1 lần, thu hoạch mãi. Kéo 1 ngón để đi quanh, chụm 2 ngón để phóng to/thu nhỏ.</span></li>' +
      '<li><i>🐄</i><span><b>Khu chăn nuôi:</b> tự chọn ô đất để xây chuồng. Viền <b style="color:#16a34a">xanh lá</b> = có sản phẩm chờ thu, viền <b style="color:#ea580c">cam</b> = có con chưa cho ăn, viền <b style="color:#dc2626">đỏ</b> = hết thức ăn, viền <b style="color:#2563eb">xanh dương</b> = đang nuôi. Bấm ⚡ Chăm hết để thu và cho ăn cả khu.</span></li>' +
      '<li><i>🏭</i><span><b>Khu sản xuất:</b> xưởng chế biến (lò bánh mì, xưởng phô mai, máy dệt…) và công trình có thu nhập mỗi giờ.</span></li>' +
      '<li><i>🎡</i><span><b>Khu vui chơi:</b> xây khu chơi, mua vé bằng ví Hưởng thụ để nhận kinh nghiệm. Hưởng thụ vừa đủ: mỗi khu 3 lượt/ngày.</span></li>' +
      '<li><i>💰</i><span>Tiền kiếm được tự chia vào <b>6 ví</b>. Mỗi nút chi tiền đều ghi rõ <b>trừ ví nào</b> (ví dụ “−5k 🏠” là ví Thiết yếu). Ví nào hết tiền thì không tiêu được, không chuyển tiền giữa các ví.</span></li>' +
      '<li><i>🎯</i><span><b>Nhiệm vụ 6 ví</b> được xếp theo hướng dẫn chi tiêu của từng ví. Hoàn thành để nhận tiền và kinh nghiệm, lên cấp để mở thêm đất, chuồng, xưởng.</span></li>' +
      '<li><i>🎮</i><span><b>Phụ bản:</b> chơi game học (tiếng Anh, Toán, Lịch sử…), tiền thưởng chuyển hết vào nông trại. Đây là cách kiếm tiền <b>nhanh nhất</b>!</span></li>' +
      '<li><i>🔔</i><span><b>Thông báo</b> (góc trên): xem lúc nào có mưa bão, gió lốc, thú hoang, thiệt hại bao nhiêu, và <b>nông sản nào còn thiếu</b> bao nhiêu để đủ đơn hàng.</span></li>' +
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
      h += '<div class="fm-h" style="margin-top:16px">🏪 Cửa hàng vật tư</div>' + wpay('essential') +
        FERTS.map(function (f) { return '<div class="fm-card" style="display:flex;align-items:center;gap:10px"><span style="font-size:36px;font-family:' + EF + '">' + f.e + '</span><div style="flex:1"><b>' + f.n + '</b><div class="fm-sub" style="margin:2px 0 6px">' + f.d + '. Đang có ' + (S.fz[f.id] || 0) + ' túi · ' + money(f.p) + '/túi.</div><div class="fm-row" style="margin:0"><button class="fm-btn org" data-a="buyFert" data-f="' + f.id + '" data-q="1">Mua 1 túi · −' + short(f.p) + ' 🏠</button><button class="fm-btn org" data-a="buyFert" data-f="' + f.id + '" data-q="5">Mua 5 · −' + short(f.p * 5) + ' 🏠</button></div></div></div>'; }).join('');
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
    var h = '<p class="fm-sub">Thiếu hàng để giao đơn, cho vật nuôi ăn hay làm nhiệm vụ? Mua ở chợ được, nhưng <b>đắt hơn giá bán ' + Math.round((BUY_MUL - 1) * 100) + '%</b>, nên tự trồng, tự nuôi vẫn lời hơn. </p>' + wpay('essential') +
      '<div class="fm-card" style="padding:10px 12px;font-size:14px">🛒 Hôm nay đã chọn <b>' + D.ids.length + '/' + BUY_TYPES + '</b> loại' + (D.ids.length ? ': ' + D.ids.map(function (id) { return item(id).e; }).join(' ') : '') + (left ? '. Còn được chọn ' + left + ' loại nữa.' : '. Hết lượt chọn loại mới, mai quay lại nhé! (Vẫn mua thêm được các loại đã chọn.)') + '</div>';
    h += '<div class="fm-inv">' + buyable().map(function (id) {
      var I = item(id), pr = bp(id), mine = D.ids.indexOf(id) >= 0, can = mine || left > 0;
      return '<div class="fm-it"' + (can ? '' : ' style="opacity:.5"') + '><div class="e">' + I.e + '</div><b>' + I.n + '</b><small>Giá mua <b style="color:#dc2626">' + money(pr) + '</b><br>(bán được ' + money(sp(id)) + ') · có ' + (S.inv[id] || 0) + '</small>' +
        (can ? '<div class="fm-row"><button class="fm-btn org" data-a="mbuy" data-c="' + id + '" data-q="1">Mua 1 · −' + short(pr) + ' 🏠</button><button class="fm-btn org" data-a="mbuy" data-c="' + id + '" data-q="5">Mua 5</button></div>' : '<span class="fm-tag">Hết lượt hôm nay</span>') + '</div>';
    }).join('') + '</div>';
    return h;
  }
  function mBuy(id, q) {
    var D = buyDay(), I = item(id), c = bp(id) * q;
    if (D.ids.indexOf(id) < 0) { if (D.ids.length >= BUY_TYPES) { toast('Mỗi ngày chỉ được mua ' + BUY_TYPES + ' loại sản phẩm. Mai quay lại nhé!'); return; } }
    if (!has('essential', c)) { noMoney(c, 'essential'); return; }
    if (D.ids.indexOf(id) < 0) D.ids.push(id);
    S.inv[id] = (S.inv[id] || 0) + q; spend('essential', c, 'mbuy_' + id, 'Mua ở chợ: ' + I.n, I.e, q);
    sfx('ok'); toast('🛒 Đã mua ' + q + ' ' + I.e + ' ' + I.n.toLowerCase() + ': −' + money(c) + ' từ ví 🏠 Thiết yếu'); save(); hud(); renderMarket();
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
  /* ===== Vẽ 🏭 Khu sản xuất / 🎡 Khu vui chơi dạng bản đồ: mỗi công trình 1 lô vuông có rào ===== */
  var prodH = '', funH = '';
  function lotInfo(k, id) {   // trạng thái 1 lô: { s, built, e, n, pill, bg, fg, p (tiến độ) }
    if (k === 'prod') {
      var b = BM[id], s0 = wsState(b), O = b.r && PRODUCTS[b.r.o], f = S.fac[id], r = { s: s0, built: built(id), e: b.e, n: b.n, p: -1 };
      if (s0 === 'lv') { r.pill = '🔒 Mở ở cấp ' + b.lv; r.bg = 'rgba(36,54,26,.88)'; }
      else if (s0 === 'req') { r.pill = '🔒 Cần ' + BM[b.req].n.toLowerCase(); r.bg = 'rgba(36,54,26,.88)'; }
      else if (s0 === 'buy') { r.pill = '🔨 Xây · ' + short(b.cost) + ' 📈'; r.bg = '#ea580c'; }
      else if (s0 === 'leak') { r.pill = '🔧 Bị dột · sửa'; r.bg = '#dc2626'; }
      else if (s0 === 'ready') { r.pill = '✅ Lấy ' + O.e + ' ' + O.n.toLowerCase(); r.bg = '#16a34a'; }
      else if (s0 === 'work') { r.p = Math.min(1, (Date.now() - f.t) / (b.r.t * 1000)); r.pill = '⏳ ' + O.e + ' còn ' + dur((1 - r.p) * b.r.t); r.bg = '#2563eb'; }
      else if (s0 === 'can') { r.pill = '▶ Làm ' + O.e + ' ' + O.n.toLowerCase(); r.bg = '#7c3aed'; }
      else if (s0 === 'need') { r.pill = '⚠️ Thiếu ' + b.r.i.filter(function (x) { return (S.inv[x[0]] || 0) < x[1]; }).map(function (x) { return item(x[0]).e; }).join(''); r.bg = '#d97706'; }
      else { r.pill = '✅ Đang hoạt động'; r.bg = '#16a34a'; }
      r.rc = b.r ? b.r.i.map(function (x) { return item(x[0]).e + x[1]; }).join(' ') + ' → ' + O.e : b.src;
      return r;
    }
    if (id === 'arcade') return { s: 'arc', built: true, e: '🕹️', n: 'Nhà trò chơi Phụ bản', pill: '▶ Chơi game học kiếm tiền', bg: '#0891b2', p: -1, rc: 'Miễn phí · tiếng Anh, Toán, Lịch sử…' };
    var F0 = FUNM[id], s1 = funState(F0), x = S.fun[id], c = funTicket(F0), q = { s: s1, built: !!x, e: F0.e, n: F0.n, p: -1 };
    if (s1 === 'lv') { q.pill = '🔒 Mở ở cấp ' + F0.lv; q.bg = 'rgba(36,54,26,.88)'; }
    else if (s1 === 'buy') { q.pill = F0.cost ? '🔨 Xây · ' + short(F0.cost) + ' 🎉' : '🔨 Xây miễn phí'; q.bg = '#ea580c'; }
    else if (s1 === 'play') { q.p = Math.min(1, (Date.now() - x.t) / (F0.t * 1000)); q.pill = '😄 Đang chơi · còn ' + dur((1 - q.p) * F0.t); q.bg = '#2563eb'; }
    else if (s1 === 'ready') { q.pill = '😊 Nhận +' + funXP(F0) + ' KN'; q.bg = '#16a34a'; }
    else if (s1 === 'rest') { q.pill = '🌙 Hết lượt hôm nay'; q.bg = 'rgba(36,54,26,.8)'; }
    else { q.pill = '🎟️ Chơi' + (c ? ' · ' + short(c) : ' miễn phí') + ' (' + (FUN_DAY - x.n) + '/' + FUN_DAY + ')'; q.bg = '#7c3aed'; }
    q.rc = F0.d;
    return q;
  }
  function drawLotWorld(k, v) {
    ground(v); drawSky(ctx, k, v);
    var Wd = WORLD[k], x0 = LX0 - 30, x1 = Wd.w - LX0 + 30, y0 = LY0 - 30, rows = Math.ceil(LOTS2[k].length / 3), y1 = LY0 + rows * (LS + LG) - LG + 30;
    ctx.lineCap = 'square';
    for (var i = 1; i < 3; i++) { var lx = LX0 + i * (LS + LG) - LG / 2; lane(lx, y0, lx, y1); }
    for (var r = 1; r < rows; r++) { var ly = LY0 + r * (LS + LG) - LG / 2; lane(x0, ly, x1, ly); }
    lane(x0, y0, x1, y0); lane(x0, y1, x1, y1); lane(x0, y0, x0, y1); lane(x1, y0, x1, y1); lane(Wd.w / 2, HD + 4, Wd.w / 2, y0);
    ctx.lineCap = 'butt';
    LOTS2[k].forEach(function (L0) {
      if (!vis(v, L0.x - 20, L0.y - 50, LS + 40, LS + 70)) return;
      var I = lotInfo(k, L0.id);
      if (I.built) {
        ctx.fillStyle = k === 'prod' ? '#e3cfa3' : '#b7e39b'; rr(ctx, L0.x, L0.y, LS, LS, 18); ctx.fill();
        ctx.fillStyle = k === 'prod' ? 'rgba(120,80,40,.12)' : 'rgba(40,110,30,.12)';
        for (var t = 0; t < 4; t++) { rr(ctx, L0.x + 14 + t * (LS - 28) / 4 + 4, L0.y + LS - 40, (LS - 28) / 4 - 8, 20, 6); ctx.fill(); }
        fence(ctx, L0.x + 10, L0.y + 14, LS - 20, LS - 24);
      } else {
        ctx.fillStyle = 'rgba(70,120,40,.45)'; rr(ctx, L0.x, L0.y, LS, LS, 18); ctx.fill();
        var R0 = mulberry(L0.i * 13 + (k === 'prod' ? 5 : 9));
        for (var q = 0; q < 9; q++) emo(ctx, ['🌿', '🍀', '🌼', '🪨', '🌾'][Math.floor(R0() * 5)], L0.x + 24 + R0() * (LS - 48), L0.y + 24 + R0() * (LS - 48), 13 + R0() * 6);
        ctx.strokeStyle = I.s === 'buy' ? '#fde68a' : 'rgba(255,255,255,.45)'; ctx.setLineDash([8, 6]); ctx.lineWidth = I.s === 'buy' ? 3 : 2; rr(ctx, L0.x + 2, L0.y + 2, LS - 4, LS - 4, 16); ctx.stroke(); ctx.setLineDash([]);
      }
    });
  }
  function workshop(c, x, by, s, P, e, on) {
    c.fillStyle = 'rgba(0,0,0,.16)'; c.beginPath(); c.ellipse(x, by, s * 0.62, s * 0.08, 0, 0, 7); c.fill();
    if (P.gar) {   // nhà xe
      c.fillStyle = P.wall; c.fillRect(x - s * 0.55, by - s * 0.5, s * 1.1, s * 0.5);
      c.fillStyle = P.roof; c.beginPath(); c.moveTo(x - s * 0.62, by - s * 0.48); c.lineTo(x - s * 0.5, by - s * 0.72); c.lineTo(x + s * 0.5, by - s * 0.72); c.lineTo(x + s * 0.62, by - s * 0.48); c.closePath(); c.fill();
      c.fillStyle = '#334155'; c.fillRect(x - s * 0.42, by - s * 0.42, s * 0.84, s * 0.42);
      emo(c, e, x, by - s * 0.2, s * 0.42); return;
    }
    c.fillStyle = '#78716c'; c.fillRect(x + s * 0.22, by - s * 0.95, s * 0.14, s * 0.36);   // ống khói
    if (on) for (var k = 0; k < 3; k++) { var ph = (tm * 0.5 + k / 3) % 1; c.globalAlpha = 0.75 * (1 - ph); c.fillStyle = '#f5f5f4'; c.beginPath(); c.arc(x + s * 0.29 + ph * 14, by - s * 0.98 - ph * 40, 6 + ph * 10, 0, 7); c.fill(); }
    c.globalAlpha = 1;
    c.fillStyle = P.wall; c.fillRect(x - s * 0.5, by - s * 0.55, s, s * 0.55);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; c.strokeRect(x - s * 0.5, by - s * 0.55, s, s * 0.55);
    c.fillStyle = P.roof; c.beginPath(); c.moveTo(x - s * 0.62, by - s * 0.52); c.lineTo(x, by - s * 0.92); c.lineTo(x + s * 0.62, by - s * 0.52); c.closePath(); c.fill();
    c.fillStyle = '#7a5032'; rr(c, x - s * 0.12, by - s * 0.3, s * 0.24, s * 0.3, 3); c.fill();
    c.fillStyle = '#bfdbfe'; c.fillRect(x - s * 0.4, by - s * 0.42, s * 0.18, s * 0.14); c.fillRect(x + s * 0.22, by - s * 0.42, s * 0.18, s * 0.14);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x, by - s * 0.66, s * 0.13, 0, 7); c.fill();
    emo(c, e, x, by - s * 0.66, s * 0.17);
  }
  function pillC(cx, y, txt, bg, fn) { ctx.font = '800 13px ' + TF; var w = ctx.measureText(txt).width + 22; return pill(ctx, cx + w / 2, y, txt, bg, '#fff', fn); }
  function drawLots(k, v) {
    LOTS2[k].forEach(function (L0) {
      if (!vis(v, L0.x - 30, L0.y - 60, LS + 60, LS + 90)) return;
      var I = lotInfo(k, L0.id), cx = L0.cx, go = function () { lotTap(k, L0.id); };
      // biển tên lô
      ctx.font = '800 13px ' + TF; var lb = I.e + ' ' + I.n, lw = ctx.measureText(lb).width + 18;
      ctx.fillStyle = I.built ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.72)'; rr(ctx, L0.x - 4, L0.y - 34, lw, 24, 12); ctx.fill();
      ctx.fillStyle = '#5b3a12'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(lb, L0.x + 5, L0.y - 21.5);
      if (!I.built) {
        var bh = 66, bw = LS - 30, bx = L0.x + 15, byy = L0.y + LS / 2 - bh / 2 - 18;
        ctx.fillStyle = 'rgba(0,0,0,.2)'; rr(ctx, bx + 2, byy + 4, bw, bh, 14); ctx.fill();
        ctx.fillStyle = I.s === 'buy' ? '#b45309' : 'rgba(36,54,26,.88)'; rr(ctx, bx, byy, bw, bh, 14); ctx.fill();
        sign(bx + 4, byy, bw - 8, bh, I.s === 'buy' ? I.e : '🔒', I.n, I.s === 'buy' ? 'Chạm để xây' : I.pill.replace('🔒 ', ''));
        if (I.s === 'buy') pillC(cx, L0.y + LS - 70, I.pill, I.bg, go);
        return;
      }
      var by = L0.by;
      if (k === 'prod') workshop(ctx, cx, by, 150, BPOS[L0.id], I.e, I.s === 'work');
      else if (L0.id === 'arcade') workshop(ctx, cx, by, 150, { roof: '#0891b2', wall: '#cffafe' }, '🕹️', true);
      else {
        var R1 = mulberry(L0.i * 31 + 7);
        for (var d = 0; d < 4; d++) emo(ctx, ['🌳', '🌷', '🎈', '🌻', '🪴'][Math.floor(R1() * 5)], L0.x + (d % 2 ? LS - 38 : 38), L0.y + (d < 2 ? 52 : LS - 92), 24);
        ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.beginPath(); ctx.ellipse(cx, by, 70, 10, 0, 0, 7); ctx.fill();
        var bob = I.s === 'play' ? Math.sin(tm * 4) * 4 : 0;
        emo(ctx, I.e, cx, by - 60 + bob, 110);
        if (I.s === 'play') { emo(ctx, '🧒', cx - 70, by - 8 + Math.sin(tm * 6) * 4, 26); emo(ctx, '👨‍👩‍👧', cx + 74, by - 10 + Math.cos(tm * 5) * 3, 26); }
      }
      if (k === 'prod' && incOf(L0.id) >= 1000) coinPill(L0.id, cx + 40, by - 150);
      if (S.dmg.bld && S.dmg.bld[L0.id]) leak(cx, by - 150);
      // công thức / mô tả ngắn
      ctx.font = '700 12px ' + TF; ctx.fillStyle = '#5b3a12'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(I.rc.replace(/<[^>]+>/g, ''), cx, by + 22, LS - 40);
      if (I.p >= 0) { var pw = LS - 90; ctx.fillStyle = 'rgba(0,0,0,.18)'; rr(ctx, cx - pw / 2, by + 36, pw, 9, 5); ctx.fill(); ctx.fillStyle = '#22c55e'; rr(ctx, cx - pw / 2, by + 36, Math.max(9, pw * I.p), 9, 5); ctx.fill(); }
      pillC(cx, L0.y + LS - 62, I.pill, I.bg, go);
    });
    drawDefenses(k);
  }
  function tapLots(x, y) {
    for (var h = HITS.length - 1; h >= 0; h--) { var b = HITS[h]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.fn(); return; } }
    var L1 = LOTS2[tab].filter(function (q) { return x >= q.x && x <= q.x + LS && y >= q.y - 34 && y <= q.y + LS; })[0];
    if (L1) lotTap(tab, L1.id);
  }
  /* Chạm vào lô: làm luôn việc chính (xây, lấy hàng, làm mẻ mới, thu tiền, vào chơi); không có việc gì thì mở bảng chi tiết */
  function lotTap(k, id) {
    if (k === 'prod') {
      var b = BM[id], s0 = wsState(b);
      if (s0 === 'buy') { doBuild(id); return; }
      if ((s0 === 'ready' || s0 === 'can' || incOf(id) >= 1000) && s0 !== 'leak') { tapB(id); return; }
      lotSheet(k, id); return;
    }
    if (id === 'arcade') { setTab('earn'); return; }
    var s1 = funState(FUNM[id]);
    if (s1 === 'buy') funBuild(id); else if (s1 === 'open') funPlay(id); else if (s1 === 'ready') funClaim(id); else lotSheet(k, id);
  }
  function lotSheet(k, id) {
    if (k === 'prod') renderProd(); else renderFun();
    sheet(''); SK = { k: k, id: id || null }; refreshLot(k);
  }
  function refreshLot(k) {
    if (!SK || SK.k !== k || !$('fmSheet').classList.contains('on')) return;
    var h;
    if (SK.id) {
      h = '<div class="fm-grid" style="grid-template-columns:1fr">' + (k === 'prod' ? buildTile(BM[SK.id]) : funTile(FUNM[SK.id])) + '</div>' +
        '<div class="fm-row" style="justify-content:center;margin-top:10px"><button class="fm-btn alt" data-a="lotList" data-k="' + k + '">📋 Xem tất cả ' + (k === 'prod' ? 'xưởng & công trình' : 'khu chơi') + '</button><button class="fm-btn" data-a="sheetClose">Đóng</button></div>';
    } else h = (k === 'prod' ? prodH : funH) + '<div class="fm-row" style="justify-content:center;margin-top:10px"><button class="fm-btn" data-a="sheetClose">Đóng</button></div>';
    var sb = $('fmSB'), st = sb.scrollTop; sb.innerHTML = h; sb.scrollTop = st;
  }
  function funAll() {
    var xp = 0, n = 0;
    FUN.forEach(function (F0) { if (funState(F0) !== 'ready') return; S.fun[F0.id].s = 0; ev('fun', F0.id); xp += funXP(F0); n++; });
    if (!n) { toast('Chưa có khu chơi nào xong.'); return; }
    addXP(xp); sfx('win'); save(); hud(); renderFun(); badges(); toast('😊 Cả nhà vui chơi xong ' + n + ' khu · +' + xp + ' KN');
  }
  /* --- 🏭 KHU SẢN XUẤT: xưởng chế biến + công trình nông trại --- */
  var FARM_B = FARM_B0, pSub = 'fac', prodSig = '';
  function wsState(b) {
    if (!built(b.id)) return bState(b);   // lv | req | buy
    if (S.dmg.bld[b.id] || (S.dmg.house && (b.id === 'them' || b.id === 'nha2' || b.id === 'nha3'))) return 'leak';
    if (!b.r) return 'idle';
    var f = S.fac[b.id];
    if (f && f.s === 2) return 'ready';
    if (f && f.s === 1) return 'work';
    return canMake(b) ? 'can' : 'need';
  }
  function fixFor(b) { return S.fix.filter(function (f) { return (f.t === 'bld' && f.a === b.id) || (f.t === 'house' && (b.id === 'them' || b.id === 'nha2' || b.id === 'nha3')); })[0]; }
  function prodCounts() {
    var c = { ready: 0, work: 0, can: 0, need: 0, leak: 0, inc: 0 };
    BUILDS.forEach(function (b) { var s = wsState(b); if (c[s] != null) c[s]++; if (built(b.id)) c.inc += incOf(b.id); });
    return c;
  }
  function tile(cls, ic, sub, name, st, stc, body) {
    return '<div class="fm-tile ' + cls + '"><div class="ic">' + ic + (sub ? '<i>' + sub + '</i>' : '') + '</div><b class="nm">' + name + '</b>' + (st ? '<div class="fm-st ' + stc + '">' + st + '</div>' : '') + body + '</div>';
  }
  function buildTile(b) {
    var s = wsState(b), O = b.r && PRODUCTS[b.r.o], f = S.fac[b.id], body = '', st = '', stc = '';
    if (s === 'lv') { st = '🔒 Mở ở cấp ' + b.lv; stc = 'lock'; body = '<small class="d">' + b.d + '</small><div class="fm-wl">' + wch('invest', b.cost) + '</div>'; }
    else if (s === 'req') { st = '🔒 Cần xây ' + BM[b.req].n.toLowerCase() + ' trước'; stc = 'lock'; body = '<small class="d">' + b.d + '</small><div class="fm-wl">' + wch('invest', b.cost) + '</div>'; }
    else if (s === 'buy') { st = '🏗️ Có thể xây'; stc = 'buy'; body = '<small class="d">' + b.d + '</small><button class="fm-btn org" data-a="build" data-b="' + b.id + '"' + (S.jar.invest < b.cost ? ' disabled' : '') + '>🔨 Xây · −' + short(b.cost) + ' 📈</button><div class="fm-wl">' + wch('invest') + (S.jar.invest < b.cost ? ' <span class="fm-tag" style="background:#fee2e2;color:#991b1b">Ví chưa đủ</span>' : '') + '</div>'; }
    else {
      if (s === 'leak') {
        var fx = fixFor(b); st = '💧 Bị dột, tạm dừng hoạt động'; stc = 'bad';
        if (fx && fx.s === 1) body += '<div class="fm-pt">🔧 Thợ đang sửa · còn ' + dur(FIXD[fx.t][0] - (Date.now() - fx.st) / 1000) + '</div>';
        else if (fx) body += '<button class="fm-btn org" data-a="fixGo" data-f="' + fx.id + '">🔧 Sửa · −' + short(fx.c) + ' 🏠</button>';
      } else if (s === 'ready') { st = '✅ Xong 1 ' + O.e + ' ' + O.n.toLowerCase(); stc = 'ok'; body += '<button class="fm-btn org" data-a="facGet" data-b="' + b.id + '">' + O.e + ' Lấy hàng</button>'; }
      else if (s === 'work') { var p = Math.min(1, (Date.now() - f.t) / (b.r.t * 1000)); st = '⏳ Đang làm ' + O.e; stc = 'work'; body += '<div class="fm-pb"><i id="fp_' + b.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="ft_' + b.id + '">còn ' + dur((1 - p) * b.r.t) + '</div>'; }
      else if (s === 'can') { st = '▶ Đủ nguyên liệu'; stc = 'can'; body += '<button class="fm-btn" data-a="facGo" data-b="' + b.id + '">▶ Bắt đầu làm ' + O.e + '</button>'; }
      else if (s === 'need') { st = '⚠️ Thiếu nguyên liệu'; stc = 'warn'; }
      else { st = '✅ Đang hoạt động'; stc = 'ok'; body += '<small class="d">' + b.d + '</small>'; }
      if (b.r) body += '<div class="rc">' + b.r.i.map(function (x) { var hv = S.inv[x[0]] || 0; return '<span class="' + (hv >= x[1] ? 'g' : 'r') + '">' + item(x[0]).e + ' ' + Math.min(hv, x[1]) + '/' + x[1] + '</span>'; }).join('') + '<span class="o">→ ' + O.e + ' · ' + durL(b.r.t) + '</span></div>';
      var ia = incOf(b.id);
      body += '<div class="inc">🪙 +' + short(b.inc) + '/giờ' + (ia >= 1000 ? ' <button class="fm-btn mini" data-a="incGet" data-b="' + b.id + '">Thu +' + short(ia) + '</button>' : '') + '</div>';
    }
    return tile('st-' + s, s === 'lv' || s === 'req' ? '🔒' : b.e, O ? O.e : '', b.n, st, stc, body);
  }
  function renderProd() {
    var c = prodCounts();
    var h = '<div class="fm-zhead" style="--zc:#7c3aed"><span class="e">🏭</span><div><b>Khu sản xuất</b><small>Chế biến nông sản thành hàng giá cao, công trình có thu nhập mỗi giờ. Xây dựng trừ ví 📈 Đầu tư (đang có ' + short(S.jar.invest) + ').</small></div></div>';
    h += '<div class="fm-chips">' + (c.ready ? '<span class="ok">✅ ' + c.ready + ' mẻ xong</span>' : '') + (c.work ? '<span class="work">⏳ ' + c.work + ' đang làm</span>' : '') + (c.can ? '<span class="can">▶ ' + c.can + ' đủ nguyên liệu</span>' : '') + (c.need ? '<span class="warn">⚠️ ' + c.need + ' thiếu nguyên liệu</span>' : '') + (c.leak ? '<span class="bad">💧 ' + c.leak + ' bị dột</span>' : '') + (c.inc >= 1000 ? '<span class="ok">🪙 ' + short(c.inc) + ' chờ thu</span>' : '') + '</div>';
    if (c.ready || c.can || c.inc >= 1000) h += '<div class="fm-row fm-acts">' + (c.ready || c.can ? '<button class="fm-btn org" data-a="prodAll">⚡ Lấy hàng & làm mẻ mới</button>' : '') + (c.inc >= 1000 ? '<button class="fm-btn" data-a="incAll">🪙 Thu tiền tất cả +' + short(c.inc) + '</button>' : '') + '</div>';
    h += '<div class="fm-seg"><button class="' + (pSub === 'fac' ? 'on' : '') + '" data-a="psub" data-t="fac">🏭 Xưởng chế biến</button><button class="' + (pSub === 'bld' ? 'on' : '') + '" data-a="psub" data-t="bld">🏡 Công trình</button></div>';
    var list = BUILDS.filter(function (b) { return pSub === 'fac' ? FARM_B.indexOf(b.id) < 0 : FARM_B.indexOf(b.id) >= 0; });
    var ord = { ready: 0, leak: 1, can: 2, work: 3, need: 4, idle: 5, buy: 6, req: 7, lv: 8 };
    list.sort(function (a, b) { return ord[wsState(a)] - ord[wsState(b)] || a.lv - b.lv; });
    h += '<div class="fm-grid">' + list.map(buildTile).join('') + '</div>';
    if (pSub === 'bld') h += '<p class="fm-sub" style="margin-top:10px">🏠 Nhà, giếng nước và cối xay gió nằm ở <b>Khu trồng trọt</b>: chạm vào nhà để thu tiền và nhận 🎁 quà mỗi ngày.</p>';
    else h += '<p class="fm-sub" style="margin-top:10px">Mẹo: hàng chế biến bán được giá cao hơn nông sản thô và hay có trong đơn hàng. Thiếu nguyên liệu thì xem 🔔 Thông báo để biết cần trồng, nuôi thêm gì.</p>';
    prodH = h; prodSig = prodSigOf(); refreshLot('prod');
  }
  function prodSigOf() { return BUILDS.map(function (b) { return wsState(b) + (incOf(b.id) >= 1000 ? 1 : 0); }).join(',') + pSub + S.fix.map(function (f) { return f.s; }).join(''); }
  function tickProd() {
    if (prodSigOf() !== prodSig) { renderProd(); badges(); return; }
    BUILDS.forEach(function (b) {
      var f = S.fac[b.id]; if (!b.r || !f || f.s !== 1) return;
      var p = Math.min(1, (Date.now() - f.t) / (b.r.t * 1000)), bar = $('fp_' + b.id), tx = $('ft_' + b.id);
      if (bar) bar.style.width = Math.round(p * 100) + '%'; if (tx) tx.textContent = 'còn ' + dur((1 - p) * b.r.t);
    });
  }
  function prodAll() {
    var got = [], go = 0;
    BUILDS.forEach(function (b) { if (!b.r || !built(b.id) || S.dmg.bld[b.id]) return; var f = S.fac[b.id]; if (f && f.s === 2) { facGet(b.id, true); got.push(PRODUCTS[b.r.o].e); } });
    BUILDS.forEach(function (b) { if (!b.r || !built(b.id) || S.dmg.bld[b.id]) return; var f = S.fac[b.id]; if ((!f || f.s === 0) && canMake(b)) { facGo(b.id, true); go++; } });
    sfx(got.length || go ? 'win' : 'bad');
    toast((got.length ? 'Lấy ' + got.join(' ') + '. ' : '') + (go ? 'Bắt đầu ' + go + ' mẻ mới.' : got.length ? '' : 'Chưa có xưởng nào xong hoặc đủ nguyên liệu.'));
    save(); hud(); renderProd();
  }
  function incAll() {
    var t = 0; BUILDS.forEach(function (b) { if (built(b.id)) t += collectInc(b.id); });
    if (t) { sfx('win'); toast('🪙 Thu ' + money(t) + ' từ các công trình. Tiền được chia vào 6 ví theo tỷ lệ.'); } else toast('Chưa có tiền để thu, ghé lại sau nhé!');
    save(); hud(); if (tab === 'prod') renderProd();
  }

  /* --- 🎡 KHU VUI CHƠI --- */
  var funSig = '';
  function funTicket(F0) { return F0.tk ? Math.max(5000, r1k(base(S.lv) * F0.tk)) : 0; }
  function funXP(F0) { return Math.max(2, Math.round(need(S.lv) * 0.035 * F0.k)); }
  function funDay(x) { if (x.d !== dayKey()) { x.d = dayKey(); x.n = 0; } return x; }
  function funState(F0) {
    var x = S.fun[F0.id];
    if (!x) return S.lv < F0.lv ? 'lv' : 'buy';
    if (x.s === 1) return Date.now() - x.t >= F0.t * 1000 ? 'ready' : 'play';
    return funDay(x).n >= FUN_DAY ? 'rest' : 'open';
  }
  function funReady() { return FUN.filter(function (F0) { return funState(F0) === 'ready'; }).length; }
  function funBuild(id) {
    var F0 = FUNM[id]; if (funState(F0) !== 'buy') return;
    var go = function () {
      if (F0.cost && !has('enjoy', F0.cost)) { noMoney(F0.cost, 'enjoy'); return; }
      if (F0.cost) spend('enjoy', F0.cost, 'funb_' + id, 'Xây ' + F0.n.toLowerCase(), F0.e);
      S.fun[id] = { b: Date.now(), s: 0, d: dayKey(), n: 0 };
      var xp = Math.max(5, Math.round(F0.cost / 40000)); addXP(xp);
      sfx('win'); save(); hud(); renderFun(); toast('🎉 Đã xây ' + F0.n.toLowerCase() + (F0.cost ? ' (−' + short(F0.cost) + ' ví 🎉 Hưởng thụ)' : '') + ' · +' + xp + ' KN');
    };
    if (!F0.cost) { go(); return; }
    confirmBox(F0.e, 'Xây ' + F0.n.toLowerCase() + '?', F0.d + '<br>Chi phí: <b>' + money(F0.cost) + '</b>. Tiền hưởng thụ đã tiêu thì không lấy lại, đổi lại cả nhà có chỗ vui chơi.<br>' + wpay('enjoy', F0.cost), 'Xây ngay', go);
  }
  function funPlay(id) {
    var F0 = FUNM[id], st = funState(F0); if (st !== 'open') { if (st === 'rest') toast('Hôm nay đã chơi ' + F0.n.toLowerCase() + ' ' + FUN_DAY + ' lượt rồi. Hưởng thụ vừa đủ thôi, mai chơi tiếp nhé!'); return; }
    var c = funTicket(F0);
    if (c && !has('enjoy', c)) { noMoney(c, 'enjoy'); return; }
    if (c) spend('enjoy', c, 'fun_' + id, 'Vé ' + F0.n.toLowerCase(), F0.e);
    var x = funDay(S.fun[id]); x.s = 1; x.t = Date.now(); x.n++;
    sfx('ok'); save(); hud(); renderFun();
    toast(F0.e + (c ? ' Mua vé ' + money(c) + ' từ ví 🎉 Hưởng thụ. ' : ' Miễn phí! ') + 'Chơi xong sau ' + durL(F0.t) + '.');
  }
  function funClaim(id) {
    var F0 = FUNM[id]; if (funState(F0) !== 'ready') return;
    var x = S.fun[id], xp = funXP(F0); x.s = 0; ev('fun', id); addXP(xp);
    sfx('win'); save(); hud(); renderFun(); badges();
    toast('😊 Vui quá! Chơi ' + F0.n.toLowerCase() + ' xong · +' + xp + ' KN');
  }
  function funTile(F0) {
      var st = funState(F0), x = S.fun[F0.id], c = funTicket(F0), body = '', s1 = '', sc = '';
      if (st === 'lv') { s1 = '🔒 Mở ở cấp ' + F0.lv; sc = 'lock'; body = '<small class="d">' + F0.d + '</small><div class="fm-wl">' + wch('enjoy', F0.cost || null) + '</div>'; }
      else if (st === 'buy') { s1 = '🏗️ Có thể xây'; sc = 'buy'; body = '<small class="d">' + F0.d + '</small><button class="fm-btn org" data-a="funBuild" data-f="' + F0.id + '"' + (F0.cost && S.jar.enjoy < F0.cost ? ' disabled' : '') + '>' + (F0.cost ? '🔨 Xây · −' + short(F0.cost) + ' 🎉' : '🔨 Xây miễn phí') + '</button><div class="fm-wl">' + wch('enjoy') + (F0.cost && S.jar.enjoy < F0.cost ? ' <span class="fm-tag" style="background:#fee2e2;color:#991b1b">Ví chưa đủ</span>' : '') + '</div>'; }
      else if (st === 'play') { var p = Math.min(1, (Date.now() - x.t) / (F0.t * 1000)); s1 = '😄 Đang vui chơi'; sc = 'work'; body = '<div class="fm-pb"><i id="vp_' + F0.id + '" style="width:' + Math.round(p * 100) + '%"></i></div><div class="fm-pt" id="vt_' + F0.id + '">còn ' + dur((1 - p) * F0.t) + '</div>'; }
      else if (st === 'ready') { s1 = '✅ Chơi xong!'; sc = 'ok'; body = '<button class="fm-btn org" data-a="funGet" data-f="' + F0.id + '">😊 Nhận niềm vui +' + funXP(F0) + ' KN</button>'; }
      else if (st === 'rest') { s1 = '🌙 Đã chơi đủ ' + FUN_DAY + ' lượt hôm nay'; sc = 'lock'; body = '<small class="d">Mai quay lại chơi tiếp nhé!</small>'; }
      else { s1 = '🎟️ Còn ' + (FUN_DAY - x.n) + '/' + FUN_DAY + ' lượt hôm nay'; sc = 'can'; body = '<button class="fm-btn" data-a="funPlay" data-f="' + F0.id + '"' + (c && S.jar.enjoy < c ? ' disabled' : '') + '>' + (c ? '🎟️ Vào chơi · −' + short(c) + ' 🎉' : '🎟️ Vào chơi miễn phí') + '</button><small class="d">⏱ ' + durL(F0.t) + ' · +' + funXP(F0) + ' KN' + (c && S.jar.enjoy < c ? ' · ví Hưởng thụ chưa đủ' : '') + '</small>'; }
      return tile('st-' + st, st === 'lv' ? '🔒' : F0.e, '', F0.n, s1, sc, body);
  }
  function renderFun() {
    var nB = FUN.filter(function (F0) { return S.fun[F0.id]; }).length;
    var h = '<div class="fm-zhead" style="--zc:#ef4444"><span class="e">🎡</span><div><b>Khu vui chơi</b><small>Xây khu chơi và mua vé đều trừ ví 🎉 Hưởng thụ (đang có ' + short(S.jar.enjoy) + '). Chơi xong nhận kinh nghiệm, không sinh ra tiền. Tối đa ' + FUN_DAY + ' lượt/khu/ngày: hưởng thụ vừa đủ!</small></div></div>';
    h += '<button class="fm-arcade" data-a="tab" data-t="earn"><span class="e">🕹️</span><span><b>Nhà trò chơi Phụ bản</b><small>Chơi game học (tiếng Anh, Toán, Lịch sử…) để kiếm tiền cho nông trại. Miễn phí!</small></span><span class="go">›</span></button>';
    h += '<div class="fm-grid">' + FUN.map(funTile).join('') + '</div>';
    h += '<p class="fm-sub" style="margin-top:10px">' + (nB ? 'Đã xây ' + nB + '/' + FUN.length + ' khu chơi. ' : '') + '“Đừng chờ đến khi giàu có mới hạnh phúc, hãy học cách hạnh phúc trên hành trình làm giàu.”</p>';
    funH = h; funSig = funSigOf(); refreshLot('fun');
  }
  function funSigOf() { return FUN.map(function (F0) { return funState(F0); }).join(',') + S.lv + (S.jar.enjoy > 0 ? Math.floor(Math.log10(S.jar.enjoy + 1) * 4) : 0); }
  function tickFun() {
    if (funSigOf() !== funSig) { renderFun(); badges(); return; }
    FUN.forEach(function (F0) {
      var x = S.fun[F0.id]; if (!x || x.s !== 1) return;
      var p = Math.min(1, (Date.now() - x.t) / (F0.t * 1000)), bar = $('vp_' + F0.id), tx = $('vt_' + F0.id);
      if (bar) bar.style.width = Math.round(p * 100) + '%'; if (tx) tx.textContent = 'còn ' + dur((1 - p) * F0.t);
    });
  }
  function doBuild(id) {
    var b = BM[id]; if (bState(b) !== 'buy') return;
    confirmBox(b.e, 'Xây ' + b.n + '?', b.d + '<br>Chi phí: <b>' + money(b.cost) + '</b><br>' + wpay('invest', b.cost), 'Xây ngay', function () {
      if (!has('invest', b.cost)) { noMoney(b.cost, 'invest'); return; }
      S.bld[id] = Date.now(); spend('invest', b.cost, 'bld_' + id, 'Xây ' + b.n.toLowerCase(), b.e);
      S.inc[id] = Date.now();
      addXP(Math.max(5, Math.round(b.cost / 50000)));
      sfx('win'); save(); hud();
      // Đưa người chơi ra nông trại, bay tới công trình mới để thấy nông trại đã thay đổi
      var P = BPOS[id], onMap = FARM_B.indexOf(id) >= 0;
      if (onMap) {
        setTab('field'); flyTo('field', P.x, P.y - (P.h ? 20 : 50), 1.35);
        setTimeout(function () { burst(P.x, P.y - 60, ['#fde047', '#86efac', '#fff', '#f59e0b'], 30); floatTxt(P.x, P.y - 110, '🎉 ' + b.n, '#fef08a'); }, 600);
      } else {
        setTab('prod'); flyTo('prod', P.x, P.y - 60, 1);
        setTimeout(function () { burst(P.x, P.y - 80, ['#fde047', '#c4b5fd', '#fff', '#f59e0b'], 30); floatTxt(P.x, P.y - 130, '🎉 ' + b.n, '#fef08a'); }, 600);
      }
      renderProd();
      sheetLater('<div class="fm-modal"><div class="big">' + b.e + '</div><h2>Đã xây xong ' + b.n + '!</h2><p>' + (onMap ? 'Công trình đã xuất hiện ở Khu trồng trọt.' : 'Công trình đã có ở 🏭 Khu sản xuất.') + ' Đã trả ' + money(b.cost) + ' từ ví 📈 Đầu tư.</p>' +
        '<div class="fm-ul"><span><i>💰</i>Thu nhập thụ động +' + short(b.inc) + '/giờ</span></div><p style="font-size:13.5px">' + b.src + '. Chạm vào công trình (hoặc nút Thu ở Khu sản xuất) để thu tiền (tích tối đa ' + INC_CAP + ' giờ, nên ghé thu thường xuyên).</p>' +
        '<p style="font-size:13.5px"><b>Tác dụng:</b> ' + b.d + '</p><p style="font-size:12.5px;color:#9a8660">Bỏ ' + money(b.cost) + ' xây công trình, mỗi ngày thu về đến ' + money(b.inc * INC_CAP * 3) + ' nếu ghé thu 3 lần. Đây là <b>tài sản tạo ra thu nhập</b>!</p>' +
        '<div class="fm-row" style="justify-content:center"><button class="fm-btn" data-a="sheetClose">Tuyệt vời!</button></div></div>');
    });
  }
  function facGo(id, q) {
    var b = BM[id], r = b.r; if (!built(id)) return;
    if (S.dmg.bld[id]) { toast('💧 ' + b.n + ' bị dột, phải sửa xong mới làm được. Vào 🎯 Nhiệm vụ → Sự cố.'); return; }
    if (!r.i.every(function (x) { return (S.inv[x[0]] || 0) >= x[1]; })) { toast('Chưa đủ nguyên liệu'); return; }
    r.i.forEach(function (x) { S.inv[x[0]] -= x[1]; });
    S.fac[id] = { s: 1, t: Date.now() }; if (!q) { sfx('ok'); toast('▶ ' + b.n + ' bắt đầu làm ' + PRODUCTS[r.o].e + ', xong sau ' + durL(r.t)); } save(); if (tab === 'prod' && !q) renderProd();
  }
  function facGet(id, q) {
    var b = BM[id], f = S.fac[id]; if (!f || f.s !== 2) return;
    var O = PRODUCTS[b.r.o]; S.inv[O.id] = (S.inv[O.id] || 0) + 1; f.s = 0; ev('make', O.id); addXP(O.xp);
    if (!q) { sfx('win'); toast('+1 ' + O.e + ' ' + O.n + ' · +' + O.xp + ' KN'); } save(); hud(); if (tab === 'prod' && !q) renderProd();
  }

  /* --- Nhiệm vụ --- */
  function playBtn(g, lbl) { return '<button class="fm-btn blu" data-a="play" data-g="' + g + '">▶ ' + (lbl || 'Chơi ngay') + '</button>'; }
  var qView = null, qCnt = { a: 0, n: 0 };
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
    var hHead = h.length;
    h += '<details class="fm-whead" style="--wc:' + W0.c + '" data-w="' + wk + '"><summary><b>' + W0.e + ' Ví ' + W0.n + '</b><span class="fm-wst">Số dư <b style="color:#1d4ed8">' + short(S.jar[wk]) + '</b> · Chi <b style="color:#dc2626">' + short(st.o) + '</b> · Nhận <b style="color:#15803d">' + short(st.i) + '</b> · Xong <b>' + done.length + '/' + list.length + '</b></span></summary><p>' + W0.d + '</p><p class="q">' + W0.q + '</p></details>';
    var G0 = WGUIDE[wk];
    h += '<div class="fm-wguide" style="--wc:' + W0.c + '"><div><b>✅ Ví này dùng cho:</b> ' + G0.use + '</div><div><b>🚫 Không dùng cho:</b> ' + G0.no + '</div></div>';
    var act = list.filter(function (m) { var e = mSt(m); return e && e.s === 1; });
    var gOrd = {}; G0.g.forEach(function (g, k) { gOrd[g[0]] = k; });
    var avail = list.filter(function (m) { return !mSt(m) && S.lv >= m.lv; }).sort(function (a, b) { return gOrd[a.grp] - gOrd[b.grp] || (reqOk(b) ? 1 : 0) - (reqOk(a) ? 1 : 0) || b.lv - a.lv; });
    var gsel = S.mg[wk] || '';
    if (gsel && gOrd[gsel] == null) gsel = '';
    var cnt = {}; avail.forEach(function (m) { cnt[m.grp] = (cnt[m.grp] || 0) + 1; });
    var gchips = '<div class="fm-gchips"><button class="' + (gsel ? '' : 'on') + '" data-a="mgrp" data-g="" style="--wc:' + W0.c + '">Tất cả · ' + avail.length + '</button>' + G0.g.map(function (g) { return '<button class="' + (gsel === g[0] ? 'on' : '') + '" data-a="mgrp" data-g="' + g[0] + '" style="--wc:' + W0.c + '">' + g[1] + ' ' + g[2] + ' · ' + (cnt[g[0]] || 0) + '</button>'; }).join('') + '</div>';
    if (gsel) avail = avail.filter(function (m) { return m.grp === gsel; });
    var lock = list.filter(function (m) { return !mSt(m) && S.lv < m.lv; }).sort(function (a, b) { return a.lv - b.lv; });
    var nAvail = list.filter(function (m) { return !mSt(m) && S.lv >= m.lv; }).length;
    if (!qView) qView = act.length ? 'act' : 'new';
    qCnt = { a: act.length, n: nAvail };
    var isAct = qView === 'act';
    if (isAct) h = h.slice(0, hHead);
    if (isAct) {
      if (!act.length) {
        h += '<div class="fm-card" style="text-align:center;color:#7a6440">Ví ' + W0.e + ' ' + W0.n + ' chưa có nhiệm vụ nào đang làm.<div class="fm-row" style="justify-content:center"><button class="fm-btn" data-a="qview" data-v="new">📋 Xem nhiệm vụ chưa thực hiện</button></div></div>';
      }
      var oth = JK.filter(function (k) { return k !== wk; }).map(function (k) { var n = MISSIONS.filter(function (m) { var e = mSt(m); return m.w === k && e && e.s === 1; }).length; return n ? '<button class="fm-btn alt" data-a="wtab" data-w="' + k + '" style="flex:none;padding:6px 10px;font-size:12.5px">' + WM[k].e + ' ' + WM[k].n + ' · ' + n + '</button>' : ''; }).join('');
      if (oth) h += '<div class="fm-sub" style="margin:8px 0 2px">Các ví khác đang làm nhiệm vụ:</div><div class="fm-row" style="margin-top:4px">' + oth + '</div>';
    }
    if (isAct && act.length) { h += '<div class="fm-h2">⏳ Đang làm (' + act.length + '/' + MAX_ACTIVE + ')</div>'; act.forEach(function (m) { h += mCard(m, 'act'); }); }
    var full = act.length >= MAX_ACTIVE;
    if (!isAct) {
    h += '<div class="fm-h2">📋 Nhiệm vụ có thể nhận (' + avail.length + ')</div>' + gchips;
    if (full) h += '<p class="fm-sub">Ví này đang làm ' + MAX_ACTIVE + ' nhiệm vụ. Hoàn thành bớt rồi nhận thêm nhé!</p>';
    if (!avail.length) h += '<div class="fm-card" style="text-align:center;color:#7a6440">Đã nhận hết nhiệm vụ ở cấp này. Lên cấp để có nhiệm vụ mới! 🌟</div>';
    var showN = qMore[wk] || gsel ? avail.length : 8, lastG = '';
    avail.slice(0, showN).forEach(function (m) {
      if (!gsel && m.grp !== lastG) { lastG = m.grp; var gg = G0.g[gOrd[m.grp]]; h += '<div class="fm-gh">' + gg[1] + ' ' + gg[2] + '</div>'; }
      h += mCard(m, full ? 'full' : 'new');
    });
    if (avail.length > showN) h += '<div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="qmore">Xem thêm ' + (avail.length - showN) + ' nhiệm vụ ▾</button></div>';
    if (lock.length) { h += '<div class="fm-h2">🔒 Sắp mở</div>'; lock.slice(0, 3).forEach(function (m) { h += mCard(m, 'lock'); }); }
    }
    if (isAct && done.length) {
      h += '<details class="fm-done"><summary>✅ Đã hoàn thành ' + done.length + ' nhiệm vụ</summary>' + done.map(function (m) { var e = mSt(m); return '<div class="fm-log"><span class="e">' + m.e + '</span><span class="t">' + esc(m.n) + '</span><span class="a in">+' + short(e.p || 0) + '</span></div>'; }).join('') + '</details>';
    }
    var tot = MISSIONS.filter(function (m) { var e = mSt(m); return e && e.s === 2; }).length;
    h += '<p class="fm-sub" style="text-align:center;margin-top:10px">Tổng cộng đã hoàn thành ' + tot + '/' + MISSIONS.length + ' nhiệm vụ ở 6 ví</p>';
    var pn = $('fmP_quest');
    pn.innerHTML = h; zoneBar(true);
    walletBar(); var wt = $('fmWB'), on = wt && wt.querySelector('.on'); if (on && (on.offsetLeft < wt.scrollLeft || on.offsetLeft + on.offsetWidth > wt.scrollLeft + wt.clientWidth)) wt.scrollLeft = on.offsetLeft - 20;
    qSig = questSig();
  }
  var qMore = {}, qSig = '';
  function mCard(m, mode) {
    var e = mSt(m), p = mProg(m), c = e && e.c != null ? e.c : mCost(m), rq = !reqOk(m);
    var cls = mode === 'lock' ? ' lock' : mode === 'act' && p >= 1 ? ' hot' : '';
    var h = '<div class="fm-card' + cls + '"><div class="fm-li"><span class="fm-ic">' + (mode === 'lock' ? '🔒' : m.e) + '</span><div class="bd"><b class="t">' + esc(m.n) + '</b><small>' + m.d + '</small>' +
      '<div><span class="fm-tag b">' + mTask(m) + '</span></div><div>' +
      (m.pct && !e ? '<span class="fm-tag r">Chi: ' + Math.round(m.pct * 100) + '% ví ' + WM[m.w].e + ' ' + WM[m.w].n + ' (≈' + short(c) + ')</span>' : c ? '<span class="fm-tag r">Chi: −' + short(c) + ' từ ví ' + WM[m.w].e + ' ' + WM[m.w].n + '</span>' : '<span class="fm-tag g">Miễn phí</span>') +
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
      h += '<div class="fm-row">' + (rq ? '<span class="fm-tag">' + reqText(m) + '</span>' : '<button class="fm-btn' + (m.w === 'share' || m.w === 'saving' ? ' org' : '') + '" data-a="mstart" data-m="' + m.id + '"' + (mode === 'full' ? ' disabled' : '') + '>' + (c ? '💸 Thực hiện · −' + short(c) + ' ' + WM[m.w].e : '✋ Thực hiện') + '</button>') + '</div>';
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
    h += '<div class="fm-card" style="margin-top:10px"><b>💳 Khoản chi nào trừ ví nào?</b>' + SPEND_RULES.map(function (r) { return '<div class="fm-rule" style="--wc:' + WM[r[0]].c + '"><span class="w">' + WM[r[0]].e + ' ' + WM[r[0]].n + '</span><span>' + r[1] + '</span></div>'; }).join('') + '<div class="fm-sub" style="margin:6px 0 0">Mỗi nút chi tiền trong game đều ghi kèm biểu tượng ví (ví dụ “−5k 🏠”), sổ thu chi cũng ghi rõ từng khoản trừ ví nào.</div></div>' +
      '<div class="fm-row" style="justify-content:center;margin-top:10px"><button class="fm-btn org" data-a="pctSet">⚙️ Cài đặt tỷ lệ</button></div>' +
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
        return '<div class="fm-card"><b>👛 Chi tiêu theo 6 ví</b><div class="fm-sub" style="margin:4px 0 6px">Mọi khoản chi (hạt giống, vật nuôi, xây dựng, nhiệm vụ, vé vui chơi…) đều trừ đúng ví của nó. Người quản lý giỏi chi cho cả 6 ví, không dồn hết vào một chỗ.</div><table class="fm-tb"><tr><th></th><th>Ví</th><th>Đã chi</th><th>Tỉ lệ</th><th>Đã nhận</th></tr>' +
          WALLETS.map(function (x) { var q = S.wl[x.k] || { o: 0, i: 0, n: 0 }; return '<tr><td class="e">' + x.e + '</td><td>' + x.n + '<br><small style="color:#9a8660">' + q.n + ' nhiệm vụ</small></td><td style="color:#dc2626">' + short(q.o) + '</td><td>' + (to ? Math.round(q.o / to * 100) : 0) + '%</td><td class="g">' + short(q.i) + '</td></tr>'; }).join('') + '</table></div>';
      })() +
      '<div class="fm-card"><b>📊 Bảng tính lãi từng loại cây</b><div class="fm-sub" style="margin:4px 0 6px">Lãi mỗi phút = lãi ÷ số phút cây lớn (chưa tưới). Dùng để chọn cây có lợi nhất.</div><table class="fm-tb"><tr><th></th><th>Cây</th><th>Lãi/cây</th><th>Thời gian</th><th>Lãi/phút</th></tr>' +
      CROPS.map(function (c) { var pr = c.per ? c.sell : c.sell - c.cost, tt = c.per ? c.re : c.t; return '<tr' + (c.lv > S.lv ? ' style="opacity:.45"' : '') + '><td class="e">' + c.e + '</td><td>' + c.n + (c.per ? ' 🌳' : '') + '</td><td class="g">+' + short(pr) + '</td><td>' + durL(tt) + '</td><td class="g">' + short(Math.round(pr / (tt / 60))) + '</td></tr>'; }).join('') + '</table></div>' +
      '<div class="fm-card"><b>🧾 Ghi chép gần đây</b>';
    if (!S.log.length) h += '<div class="fm-sub" style="margin-top:6px">Chưa có khoản nào. Gieo hạt đầu tiên nhé!</div>';
    S.log.slice(0, 60).forEach(function (l) {
      var d = new Date(l.ts);
      var lw = logW(l);
      h += '<div class="fm-log"><span class="e">' + l.e + '</span><span class="t">' + esc(l.n) + (l.q > 1 ? ' × ' + l.q : '') + '<small>' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' · ' + d.getDate() + '/' + (d.getMonth() + 1) + (lw ? ' · trừ ví ' + WM[lw].e + ' ' + WM[lw].n : l.k === 'in' ? (l.w ? ' · về ví ' + WM[l.w].e + ' ' + WM[l.w].n : ' · chia vào 6 ví') : '') + '</small></span><span class="a ' + l.k + '">' + (l.k === 'in' ? '+' : '−') + money(l.a) + '</span></div>';
    });
    $('fmP_book').innerHTML = h + '</div><div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="reset">↺ Chơi lại từ đầu</button></div>';
  }

  /* ================= CHUYỂN TAB ================= */
  var PANELS = ['market', 'quest', 'earn', 'book'];
  function setTab(t) {
    if (t === 'build') t = 'prod';
    tab = t; closeSheet(); pbClose();
    var nb = $('fmNav').querySelectorAll('button'); for (var i = 0; i < nb.length; i++) nb[i].classList.toggle('on', nb[i].getAttribute('data-t') === t || (t === 'book' && nb[i].getAttribute('data-a') === 'book'));
    PANELS.forEach(function (p) { $('fmP_' + p).classList.toggle('on', p === t); });
    stage.style.visibility = isMap(t) ? 'visible' : 'hidden';
    $('fmTools').style.display = t === 'field' ? '' : 'none';
    zbSig = ''; zoneBar(true);
    if (t === 'prod') renderProd(); else if (t === 'fun') renderFun(); else if (t === 'market') renderMarket(); else if (t === 'quest') renderQuest(); else if (t === 'earn') renderEarn(); else if (t === 'book') renderBook();
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
      if (tab === 'barn') tapBarn(w.x, w.y); else if (tab === 'prod' || tab === 'fun') tapLots(w.x, w.y); else if (!tapBuilding(w.x, w.y)) { act(plotAt(w.x, w.y), true); save(); }
    } else if (g.mode === 'pan') {
      // Thả tay khi đang vuốt nhanh: bản đồ trôi thêm một chút (quán tính)
      var h = g.hist, a = h[0], b = h[h.length - 1], dt = (b.t - a.t) / 1000;
      if (dt > 0.01 && performance.now() - b.t < 80) { var vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt, sp = Math.hypot(vx, vy); if (sp > 150) { var mx = 2600 / Math.max(sp, 2600); INERT = { vx: vx * mx, vy: vy * mx }; } }
    }
  }
  stage.addEventListener('pointerup', function (e) { ptrEnd(e, false); });
  stage.addEventListener('pointercancel', function (e) { ptrEnd(e, true); });
  stage.addEventListener('wheel', function (e) {
    if (!cam || !isMap(tab)) return;
    e.preventDefault();
    var p = pt(e);
    if (e.ctrlKey || Math.abs(e.deltaY) >= Math.abs(e.deltaX)) zoomAt(p.x, p.y, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)));
    else { INERT = null; cam.x += e.deltaX / cam.z; clampCam(cam, tab); }
  }, { passive: false });
  // Safari trên iPhone/iPad: chặn cử chỉ phóng to cả trang khi đang chụm 2 ngón trong game
  ['gesturestart', 'gesturechange'].forEach(function (t) { stage.addEventListener(t, function (e) { e.preventDefault(); }); });

  ov.addEventListener('input', function (e) { if (e.target && e.target.id && e.target.id.indexOf('fpc_') === 0) pctLive(); });
  ov.addEventListener('input', function (e) { var t = e.target, id = t.getAttribute && t.getAttribute('data-pb'); if (!id) return; pbSet(id, t.value); pbFoot(); });
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
    else if (a === 'buyFert') { var q = +el.getAttribute('data-q'), FF = FZM[el.getAttribute('data-f') || 'f1'], c = q * FF.p; if (!has('essential', c)) { noMoney(c, 'essential'); return; } S.fz[FF.id] += q; spend('essential', c, 'fert_' + FF.id, 'Mua ' + FF.n.toLowerCase(), FF.e, q); sfx('ok'); toast(FF.e + ' Mua ' + q + ' túi ' + FF.n.toLowerCase() + ': −' + money(c) + ' từ ví 🏠 Thiết yếu'); hud(); save(); if ($('fmSheet').classList.contains('on')) fertSheet(); else renderMarket(); }
    else if (a === 'pickF') { S.selF = el.getAttribute('data-f'); tool = 'fert'; toolsUI(); closeSheet(); save(); toast(FZM[S.selF].e + ' Chạm vào cây đang lớn để bón ' + FZM[S.selF].n.toLowerCase()); }
    else if (a === 'chop') { var ci = +el.getAttribute('data-i'), cp = S.plots[ci]; cp.c = null; cp.p = 0; cp.w = 0; cp.n = 0; closeSheet(); save(); sfx('ok'); toast('🪓 Đã chặt cây. Ô đất trống, có thể gieo cây khác.'); }
    else if (a === 'build') doBuild(el.getAttribute('data-b'));
    else if (a === 'notif') notifSheet();
    else if (a === 'psub') { pSub = el.getAttribute('data-t'); renderProd(); }
    else if (a === 'prodAll') prodAll();
    else if (a === 'incAll') incAll();
    else if (a === 'incGet') { var ig = collectInc(el.getAttribute('data-b')); if (ig) { sfx('win'); toast('🪙 +' + money(ig) + ', chia vào 6 ví theo tỷ lệ'); } save(); hud(); renderProd(); }
    else if (a === 'funBuild') funBuild(el.getAttribute('data-f'));
    else if (a === 'funPlay') funPlay(el.getAttribute('data-f'));
    else if (a === 'funGet') funClaim(el.getAttribute('data-f'));
    else if (a === 'funAll') funAll();
    else if (a === 'lotList') lotSheet(el.getAttribute('data-k'));
    else if (a === 'lotGo') { var lk = el.getAttribute('data-k'), lid = el.getAttribute('data-i'); closeSheet(); if (tab !== lk) setTab(lk); var LL = LOTS2[lk].filter(function (q) { return q.id === lid; })[0]; if (LL) flyTo(lk, LL.cx, LL.y + LS / 2, Math.max(0.8, cam ? cam.z : 1)); }
    else if (a === 'zgo') zoneGo(el.getAttribute('data-k'));
    else if (a === 'zgoF') { var fs = fieldStat(); if (fs.fe >= 0) { var FR = plotRect(fs.fe); flyTo('field', FR.x + FR.s / 2, FR.y + FR.s / 2, Math.max(cam.z, 1)); } tool = 'seed'; toolsUI(); toast(CM[S.sel].e + ' Chạm hoặc vuốt lên ô đất trống để gieo ' + CM[S.sel].n.toLowerCase() + ' (hạt giống trừ ví ' + (CM[S.sel].per ? '📈 Đầu tư' : '🏠 Thiết yếu') + ')'); }
    else if (a === 'careAllB') careEverything();
    else if (a === 'barnGet') careEverything(true);
    else if (a === 'qview') { qView = el.getAttribute('data-v'); renderQuest(); $('fmP_quest').scrollTop = 0; }
    else if (a === 'pbOpen') plantBox();
    else if (a === 'pbClose') pbClose();
    else if (a === 'pbStep') { pbSet(el.getAttribute('data-c'), (PBQ[el.getAttribute('data-c')] || 0) + (+el.getAttribute('data-d'))); pbRender(); }
    else if (a === 'pbAll') { var pc0 = el.getAttribute('data-c'); PBQ = {}; PBQ[pc0] = pbEmpty().length; pbRender(); }
    else if (a === 'pbFill') { var pc1 = el.getAttribute('data-c'); pbSet(pc1, (PBQ[pc1] || 0) + pbEmpty().length - pbSum()); pbRender(); }
    else if (a === 'pbClear') { PBQ = {}; pbRender(); }
    else if (a === 'pbGo') pbGo();
    else if (a === 'mbuyGo') { mSub = 'buy'; setTab('market'); }
    else if (a === 'mgrp') { S.mg[S.mw] = el.getAttribute('data-g'); save(); renderQuest(); }
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
    else if (a === 'bsee') { var bid = el.getAttribute('data-b'), P = BPOS[bid], zk = FARM_B.indexOf(bid) >= 0 ? 'field' : 'prod'; setTab(zk); flyTo(zk, P.x, P.y - (P.h ? 20 : 50), zk === 'field' ? 1.35 : 1); toast('Chạm vào công trình để thu tiền và lấy hàng'); }
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
        if (!S.seen) { S.seen = 1; S.tipCam = 1; S.news5 = 1; save(); guide(); }
        else { if (got) backSheet(got); if (!S.news5) { S.news5 = 1; save(); guide(); } }
        if (checkDisasterLater) { checkDisasterLater = false; checkDisaster(Date.now()); checkRaid(Date.now()); }
        if (!S.tipCam) { S.tipCam = 1; save(); setTimeout(function () { toast('✋ Mới: kéo 1 ngón để đi quanh nông trại, chụm 2 ngón để phóng to/thu nhỏ'); }, got ? 0 : 600); }
      });
    },
    close: function () { sheetQ = []; running = false; cancelAnimationFrame(raf); save(); closeSheet(); ov.classList.remove('on'); document.body.style.overflow = ''; }
  };
  window.FarmGame = api;
})();
