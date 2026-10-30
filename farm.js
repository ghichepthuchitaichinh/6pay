/* 6PAY - Game Nông trại vui vẻ. File này được index.html tải về khi người dùng mở trò chơi.
   Trồng cây, nuôi gà – bò – cừu, giao đơn hàng, bán nông sản và ghi sổ thu chi của nông trại.
   Cây và vật nuôi vẫn lớn khi đóng app (tính theo đồng hồ của máy). Tiến độ lưu trên máy (localStorage). */
(function () {
  if (window.FarmGame) return;

  var KEY = 'farm6_v1';
  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var TF = '"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

  /* ================= DỮ LIỆU =================
     Cây trồng: id, tên, emoji, cấp mở, giá hạt giống (đ), thời gian lớn (giây), giá bán (đ), kinh nghiệm, màu lá */
  var CROPS = [
    { id: 'lua', n: 'Lúa', e: '🌾', lv: 1, cost: 5000, t: 30, sell: 9000, xp: 1, leaf: '#8bc34a' },
    { id: 'carot', n: 'Cà rốt', e: '🥕', lv: 1, cost: 10000, t: 60, sell: 18000, xp: 2, leaf: '#4caf50' },
    { id: 'ngo', n: 'Ngô', e: '🌽', lv: 2, cost: 15000, t: 120, sell: 30000, xp: 3, leaf: '#66bb6a' },
    { id: 'cachua', n: 'Cà chua', e: '🍅', lv: 3, cost: 25000, t: 240, sell: 52000, xp: 5, leaf: '#43a047' },
    { id: 'bapcai', n: 'Bắp cải', e: '🥬', lv: 4, cost: 30000, t: 300, sell: 65000, xp: 6, leaf: '#7cb342' },
    { id: 'ot', n: 'Ớt', e: '🌶️', lv: 5, cost: 35000, t: 360, sell: 78000, xp: 7, leaf: '#2e7d32' },
    { id: 'dau', n: 'Dâu tây', e: '🍓', lv: 6, cost: 45000, t: 480, sell: 100000, xp: 8, leaf: '#388e3c' },
    { id: 'huongduong', n: 'Hướng dương', e: '🌻', lv: 7, cost: 60000, t: 600, sell: 135000, xp: 10, leaf: '#558b2f' },
    { id: 'dua', n: 'Dưa hấu', e: '🍉', lv: 8, cost: 80000, t: 900, sell: 185000, xp: 14, leaf: '#33691e' },
    { id: 'bi', n: 'Bí ngô', e: '🎃', lv: 10, cost: 120000, t: 1500, sell: 290000, xp: 22, leaf: '#689f38' }
  ];
  /* Vật nuôi: ăn 1 nông sản (feed) rồi sau t giây cho 1 sản phẩm (p) */
  var ANIMALS = [
    { id: 'ga', n: 'Gà', e: '🐔', pen: 'Chuồng gà', lv: 2, cost: 80000, feed: 'lua', p: 'trung', t: 120, max: 6, grass: '#9ccc65' },
    { id: 'bo', n: 'Bò', e: '🐄', pen: 'Chuồng bò', lv: 4, cost: 250000, feed: 'ngo', p: 'sua', t: 300, max: 4, grass: '#8bc34a' },
    { id: 'cuu', n: 'Cừu', e: '🐑', pen: 'Chuồng cừu', lv: 6, cost: 400000, feed: 'carot', p: 'len', t: 480, max: 4, grass: '#aed581' }
  ];
  var PRODUCTS = {
    trung: { id: 'trung', n: 'Trứng gà', e: '🥚', sell: 30000, xp: 3 },
    sua: { id: 'sua', n: 'Sữa bò', e: '🥛', sell: 75000, xp: 6 },
    len: { id: 'len', n: 'Len cừu', e: '🧶', sell: 120000, xp: 9 }
  };
  var FERT_PRICE = 20000;           // giá 1 túi phân bón
  var WATER_BOOST = 1.5;            // ruộng đã tưới lớn nhanh gấp 1,5 lần
  var LAND = { 4: [3, 300000], 5: [5, 800000], 6: [8, 2000000] };   // hàng ruộng: [cấp cần, giá]
  var COLS = 4, MAXROWS = 6;

  var CM = {}; CROPS.forEach(function (c) { CM[c.id] = c; });
  var AM = {}; ANIMALS.forEach(function (a) { AM[a.id] = a; });
  function item(id) { return CM[id] || PRODUCTS[id]; }
  function need(lv) { return 10 * lv + 5 * lv * lv; }   // kinh nghiệm cần để lên cấp tiếp

  /* ================= TRẠNG THÁI & LƯU TRỮ ================= */
  function fresh() {
    var p = []; for (var i = 0; i < COLS * MAXROWS; i++) p.push({ c: null, p: 0, t: 0, w: 0 });
    return { v: 1, m: 200000, xp: 0, lv: 1, rows: 3, plots: p, inv: {}, an: { ga: [], bo: [], cuu: [] }, fert: 3, orders: [], log: [], tin: 0, tout: 0, sel: 'lua', seen: 0, made: Date.now() };
  }
  var S = fresh();
  function load() {
    try { var o = JSON.parse(localStorage.getItem(KEY)); if (o && o.v === 1 && o.plots) { S = fresh(); for (var k in o) S[k] = o[k]; } } catch (e) {}
    if (!S.an) S.an = { ga: [], bo: [], cuu: [] };
    ANIMALS.forEach(function (a) { if (!S.an[a.id]) S.an[a.id] = []; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S, function (k, v) { return k.charAt(0) === '_' ? undefined : v; })); } catch (e) {} }

  /* ================= TIỆN ÍCH ================= */
  function money(n, sg) { var s = Math.abs(Math.round(n)).toLocaleString('vi-VN') + 'đ'; return n < 0 ? '−' + s : (sg && n > 0 ? '+' + s : s); }
  function short(n) { var a = Math.abs(n), s; if (a >= 1e9) s = (a / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ'; else if (a >= 1e6) s = (a / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tr'; else if (a >= 1e3) s = Math.round(a / 1e3) + 'k'; else s = '' + a; return (n < 0 ? '−' : '') + s; }
  function dur(sec) { sec = Math.max(0, Math.ceil(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? h + ' giờ ' + m + ' phút' : (m ? m + ':' + ('0' + s).slice(-2) : s + ' giây'); }
  function durL(sec) { return sec >= 60 ? (sec % 60 ? Math.floor(sec / 60) + ' phút ' + sec % 60 + ' giây' : sec / 60 + ' phút') : sec + ' giây'; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sfx(k) { try { if (window.sfx) window.sfx(k); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* Sổ thu chi: gộp các khoản giống nhau phát sinh liên tiếp trong 2 phút */
  function addLog(k, amt, key, name, e, q) {
    q = q || 1;
    if (k === 'in') S.tin += amt; else S.tout += amt;
    var L = S.log[0], now = Date.now();
    if (L && L.key === key && L.k === k && now - L.ts < 120000) { L.a += amt; L.q += q; L.ts = now; }
    else { S.log.unshift({ ts: now, k: k, a: amt, key: key, n: name, e: e, q: q }); if (S.log.length > 120) S.log.length = 120; }
  }
  function addXP(x) {
    S.xp += x; var up = false;
    while (S.xp >= need(S.lv)) { S.xp -= need(S.lv); S.lv++; up = true; }
    if (up) setTimeout(levelUp, 350);
  }

  /* ================= MÔ PHỎNG THỜI GIAN ================= */
  function update(now) {
    for (var i = 0; i < S.plots.length; i++) {
      var pl = S.plots[i]; if (!pl.c || pl.p >= 1) continue;
      var c = CM[pl.c]; pl.p = Math.min(1, pl.p + (now - pl.t) / (c.t * 1000) * (pl.w ? WATER_BOOST : 1)); pl.t = now;
    }
    ANIMALS.forEach(function (a) {
      S.an[a.id].forEach(function (x) { if (x.s === 1) { x.p = Math.min(1, x.p + (now - x.t) / (a.t * 1000)); x.t = now; if (x.p >= 1) x.s = 2; } });
    });
  }
  function left(pl) { var c = CM[pl.c]; return (1 - pl.p) * c.t / (pl.w ? WATER_BOOST : 1); }

  /* ================= ĐƠN HÀNG ================= */
  function orderPool() {
    var pool = CROPS.filter(function (c) { return c.lv <= S.lv; }).map(function (c) { return c.id; });
    ANIMALS.forEach(function (a) { if (S.an[a.id].length) pool.push(a.p); });
    return pool;
  }
  var NAMES = ['Cô Lan bán xôi', 'Chú Tư quán phở', 'Bếp ăn trường học', 'Siêu thị mini', 'Nhà hàng Sen Vàng', 'Bà Ba bán chè', 'Tiệm bánh Hạnh Phúc', 'Quán cơm Bình Dân', 'Chợ đầu mối', 'Hợp tác xã'];
  function genOrder() {
    var pool = shuffle(orderPool()), k = Math.min(pool.length, ri(1, S.lv >= 3 ? 3 : 2)), it = [], val = 0, xp = 2;
    for (var i = 0; i < k; i++) {
      var id = pool[i], P = !!PRODUCTS[id], q = P ? ri(1, 2 + Math.floor(S.lv / 4)) : ri(2, Math.min(8, 3 + Math.floor(S.lv / 2)));
      if (CM[id] && CM[id].t >= 600) q = ri(1, 3);
      it.push([id, q]); val += item(id).sell * q; xp += item(id).xp * q;
    }
    return { it: it, m: Math.round(val * 1.35 / 1000) * 1000, xp: xp, who: NAMES[ri(0, NAMES.length - 1)], tr: ['🚚', '🛻', '🚛', '🛵'][ri(0, 3)] };
  }
  function fillOrders() { while (S.orders.length < 3) S.orders.push(genOrder()); }
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
  '.fm-money{flex:none;background:rgba(0,0,0,.22);border-radius:999px;padding:7px 12px;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}' +
  '.fm-main{flex:1;min-height:0;position:relative}' +
  '.fm-stage{position:absolute;inset:0;touch-action:none}.fm-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}' +
  '.fm-tools{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:8px;padding:0 8px;pointer-events:none;z-index:1}' +
  '.fm-tool{pointer-events:auto;border:0;border-radius:16px;background:rgba(255,255,255,.94);box-shadow:0 4px 12px rgba(0,0,0,.25);padding:6px 10px;display:flex;flex-direction:column;align-items:center;min-width:62px;font-size:11px;font-weight:800;color:#3b2a14!important;position:relative}' +
  '.fm-tool .e{font-size:26px;line-height:1.15;font-family:' + EF + '}.fm-tool.on{background:#fff7d1;box-shadow:0 0 0 3px #f59e0b,0 4px 12px rgba(0,0,0,.25)}' +
  '.fm-tool .n{position:absolute;top:-6px;right:-4px;background:#ef4444;color:#fff;border-radius:999px;font-size:11px;padding:1px 6px}' +
  '.fm-panel{position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 12px 20px;background:linear-gradient(180deg,#fef9e7,#f3e7c4);display:none}.fm-panel.on{display:block}' +
  '.fm-nav{flex:none;display:flex;background:#fffdf5;border-top:1px solid #e5d9b6;padding:4px 4px max(4px,env(safe-area-inset-bottom));box-shadow:0 -2px 10px rgba(0,0,0,.1);z-index:2}' +
  '.fm-nav button{flex:1;border:0;background:none;padding:5px 2px;border-radius:12px;display:flex;flex-direction:column;align-items:center;font-size:11px;font-weight:800;color:#6b5a3a!important;position:relative}' +
  '.fm-nav button .e{font-size:23px;line-height:1.2;font-family:' + EF + '}.fm-nav button.on{background:#ffeeba;color:#7a4a00!important}' +
  '.fm-nav .dot{position:absolute;top:2px;right:calc(50% - 22px);min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:11px;line-height:18px;padding:0 5px}' +
  '.fm-h{font-size:18px;font-weight:900;margin:2px 0 4px;color:#5b3a12}.fm-sub{font-size:13px;color:#7a6440;margin:0 0 10px;line-height:1.5}' +
  '.fm-card{background:#fff;border-radius:16px;padding:12px;margin-bottom:10px;box-shadow:0 2px 8px rgba(120,80,0,.12)}' +
  '.fm-ord{display:flex;gap:10px;align-items:flex-start}.fm-ord .tr{font-size:40px;font-family:' + EF + ';line-height:1}.fm-ord .bd{flex:1;min-width:0}' +
  '.fm-ord b.w{display:block;font-size:15px;color:#5b3a12}.fm-need{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}' +
  '.fm-need span{background:#f6f0de;border-radius:10px;padding:4px 8px;font-weight:800;font-size:14px;white-space:nowrap}.fm-need span.ok{background:#dcfce7;color:#166534}.fm-need span.no{background:#fee2e2;color:#991b1b}' +
  '.fm-need span i{font-style:normal;font-family:' + EF + ';font-size:18px;vertical-align:-2px;margin-right:2px}' +
  '.fm-rw{font-size:14px;font-weight:800;color:#15803d}.fm-row{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}' +
  '.fm-btn{border:0;border-radius:12px;padding:9px 14px;font-weight:800;font-size:14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff!important;box-shadow:0 3px 8px rgba(22,163,74,.3)}' +
  '.fm-btn.alt{background:#f1e7cc;color:#6b4a14!important;box-shadow:none}.fm-btn.org{background:linear-gradient(135deg,#f59e0b,#ea580c);box-shadow:0 3px 8px rgba(234,88,12,.3)}.fm-btn:disabled{opacity:.45;cursor:default}' +
  '.fm-inv{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
  '.fm-it{background:#fff;border-radius:16px;padding:10px;text-align:center;box-shadow:0 2px 8px rgba(120,80,0,.12)}.fm-it .e{font-size:40px;font-family:' + EF + ';line-height:1.2}' +
  '.fm-it b{display:block;font-size:15px}.fm-it small{display:block;color:#7a6440;font-size:12px;margin-bottom:6px}.fm-it .q{font-size:20px;font-weight:900;color:#5b3a12}.fm-it .fm-btn{padding:7px 8px;font-size:13px;flex:1}' +
  '.fm-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.fm-sum div{background:#fff;border-radius:14px;padding:10px 6px;text-align:center;box-shadow:0 2px 8px rgba(120,80,0,.1);font-size:12px;color:#7a6440}' +
  '.fm-sum b{display:block;font-size:16px;font-variant-numeric:tabular-nums}' +
  '.fm-log{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px dashed #eadfc0;font-size:14px}.fm-log .e{font-size:24px;font-family:' + EF + ';width:30px;text-align:center}.fm-log .t{flex:1;min-width:0}.fm-log small{display:block;color:#9a8660;font-size:12px}' +
  '.fm-log .a{font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap}.fm-log .a.in{color:#15803d}.fm-log .a.out{color:#dc2626}' +
  '.fm-tb{width:100%;border-collapse:collapse;font-size:13px}.fm-tb th{text-align:left;color:#7a6440;font-weight:800;padding:6px 4px;border-bottom:2px solid #eadfc0}.fm-tb td{padding:7px 4px;border-bottom:1px solid #f1e8cf;font-variant-numeric:tabular-nums}.fm-tb td.e{font-family:' + EF + ';font-size:20px;width:30px}.fm-tb .g{color:#15803d;font-weight:800}' +
  '.fm-sheet{position:absolute;inset:0;z-index:5;display:none;background:rgba(20,30,10,.45);align-items:flex-end;justify-content:center}.fm-sheet.on{display:flex}' +
  '.fm-sb{width:100%;max-width:560px;max-height:82%;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#fffdf5;border-radius:22px 22px 0 0;padding:14px 14px max(16px,env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.3);animation:fmUp .22s ease-out}' +
  '@keyframes fmUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
  '.fm-seed{display:flex;align-items:center;gap:10px;width:100%;border:2px solid #eadfc0;background:#fff;border-radius:16px;padding:9px 10px;margin-bottom:8px;text-align:left}' +
  '.fm-seed.on{border-color:#f59e0b;background:#fff7d1}.fm-seed:disabled{opacity:.5}.fm-seed .e{font-size:34px;font-family:' + EF + ';width:42px;text-align:center}.fm-seed .tx{flex:1;min-width:0}.fm-seed b{font-size:16px}' +
  '.fm-seed small{display:block;font-size:12px;color:#7a6440;line-height:1.45}.fm-seed .pr{text-align:right;font-weight:900;font-size:14px;color:#15803d;white-space:nowrap}.fm-seed .pr small{color:#9a8660;font-weight:700}' +
  '.fm-modal{text-align:center}.fm-modal .big{font-size:64px;font-family:' + EF + ';line-height:1.2}.fm-modal h2{margin:4px 0 6px;color:#5b3a12}.fm-modal p{color:#6b5a3a;line-height:1.55;margin:6px 0}' +
  '.fm-ul{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}.fm-ul span{background:#fff;border:2px solid #f3d98b;border-radius:14px;padding:6px 10px;font-weight:800}.fm-ul span i{font-style:normal;font-family:' + EF + ';font-size:22px;vertical-align:-3px;margin-right:4px}' +
  '.fm-guide{text-align:left;margin:8px 0;padding:0;list-style:none}.fm-guide li{display:flex;gap:10px;align-items:flex-start;margin:8px 0;line-height:1.5;color:#4a3a20}.fm-guide li i{font-style:normal;font-family:' + EF + ';font-size:24px}' +
  '.fm-toast{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:rgba(36,54,26,.92);color:#fff;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:700;z-index:6;pointer-events:none;max-width:92%;text-align:center;transition:opacity .25s;opacity:0}.fm-toast.on{opacity:1}';
  document.head.appendChild(st);

  /* ================= KHUNG GIAO DIỆN ================= */
  var ov = document.createElement('div'); ov.id = 'fmOv';
  ov.innerHTML = '' +
    '<div class="fm-top"><button class="fm-ib" data-a="back" aria-label="Quay lại">←</button>' +
      '<div class="fm-lv"><div class="fm-badge" id="fmLv">1</div><div class="fm-xp"><small id="fmXpT"></small><div class="fm-xpb"><i id="fmXp"></i></div></div></div>' +
      '<div class="fm-money" id="fmM">💰 0đ</div><button class="fm-ib" data-a="close">✕</button></div>' +
    '<div class="fm-main" id="fmMain">' +
      '<div class="fm-stage" id="fmStage"><canvas id="fmCv"></canvas>' +
        '<div class="fm-tools" id="fmTools">' +
          '<button class="fm-tool on" data-a="tool" data-t="seed"><span class="e" id="fmSeedE">🌾</span><span id="fmSeedN">Gieo hạt</span></button>' +
          '<button class="fm-tool" data-a="tool" data-t="water"><span class="e">🚿</span>Tưới nước</button>' +
          '<button class="fm-tool" data-a="tool" data-t="fert"><span class="e">🧪</span>Phân bón<span class="n" id="fmFert">0</span></button>' +
          '<button class="fm-tool" data-a="harvestAll"><span class="e">🧺</span>Thu hết</button>' +
        '</div></div>' +
      '<div class="fm-panel" id="fmP_orders"></div><div class="fm-panel" id="fmP_inv"></div><div class="fm-panel" id="fmP_book"></div>' +
      '<div class="fm-sheet" id="fmSheet"><div class="fm-sb" id="fmSB"></div></div>' +
      '<div class="fm-toast" id="fmToast"></div>' +
    '</div>' +
    '<div class="fm-nav" id="fmNav">' +
      '<button class="on" data-a="tab" data-t="field"><span class="e">🌱</span>Ruộng</button>' +
      '<button data-a="tab" data-t="barn"><span class="e">🐔</span>Chuồng<span class="dot" id="fmDotB" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="orders"><span class="e">🚚</span>Đơn hàng<span class="dot" id="fmDotO" style="display:none"></span></button>' +
      '<button data-a="tab" data-t="inv"><span class="e">📦</span>Kho</button>' +
      '<button data-a="tab" data-t="book"><span class="e">📒</span>Sổ sách</button>' +
    '</div>';
  document.body.appendChild(ov);

  var $ = function (id) { return document.getElementById(id); };
  var cv = $('fmCv'), ctx = cv.getContext('2d'), stage = $('fmStage');
  var tab = 'field', tool = 'seed', W = 0, H = 0, DPR = 2, raf = 0, running = false, tm = 0, lastSave = 0;
  var FX = [], FL = [], TIP = null, HITS = [], POS = {};
  var bgC = document.createElement('canvas'), bgKey = '';

  /* ================= BỐ CỤC ================= */
  var L = {};
  function resize() {
    var r = stage.getBoundingClientRect();
    W = Math.max(240, r.width); H = Math.max(300, r.height);
    DPR = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    var hd = Math.round(Math.min(120, Math.max(78, H * 0.16)));
    var toolsH = 74, pad = 10;
    var aw = W - pad * 2, ah = H - hd - toolsH - pad;
    var cell = Math.floor(Math.min(aw / COLS, ah / MAXROWS, 118));
    L = { hd: hd, cell: cell, fw: cell * COLS, fh: cell * MAXROWS, toolsH: toolsH };
    L.fx = Math.round((W - L.fw) / 2); L.fy = Math.round(hd + Math.max(6, (ah - L.fh) / 2 + 2));
    L.gap = Math.max(5, Math.round(cell * 0.08));
    // chuồng trại
    var bh = H - hd - 14, ph = Math.floor((bh - 16) / 3);
    var pw = Math.min(W - 20, 680); L.pens = ANIMALS.map(function (a, i) { return { x: Math.round((W - pw) / 2), y: hd + 6 + i * (ph + 8), w: pw, h: ph }; });
    bgKey = '';
  }
  function plotRect(i) {
    var c = i % COLS, r = Math.floor(i / COLS), g = L.gap;
    return { x: L.fx + c * L.cell + g / 2, y: L.fy + r * L.cell + g / 2, s: L.cell - g };
  }

  /* ================= VẼ NỀN (lưu sẵn để nhẹ máy) ================= */
  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function emo(c, ch, x, y, s) { c.font = Math.round(s) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(ch, x, y); }
  function drawSky(c, kind) {
    var hd = L.hd;
    var g = c.createLinearGradient(0, 0, 0, hd); g.addColorStop(0, '#7cc8f5'); g.addColorStop(1, '#d6f0ff');
    c.fillStyle = g; c.fillRect(0, 0, W, hd + 2);
    // mặt trời
    var sx = W - 46, sy = hd * 0.36, sg = c.createRadialGradient(sx, sy, 4, sx, sy, 46);
    sg.addColorStop(0, 'rgba(255,240,150,1)'); sg.addColorStop(0.4, 'rgba(255,214,90,.85)'); sg.addColorStop(1, 'rgba(255,214,90,0)');
    c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, 46, 0, 7); c.fill();
    c.fillStyle = '#ffd54a'; c.beginPath(); c.arc(sx, sy, 17, 0, 7); c.fill();
    // đồi xa
    c.fillStyle = '#9ed27a'; c.beginPath(); c.moveTo(0, hd); c.quadraticCurveTo(W * 0.18, hd * 0.45, W * 0.42, hd * 0.8); c.quadraticCurveTo(W * 0.62, hd * 0.5, W * 0.85, hd * 0.75); c.quadraticCurveTo(W * 0.95, hd * 0.6, W, hd * 0.7); c.lineTo(W, hd); c.fill();
    c.fillStyle = '#86c35f'; c.beginPath(); c.moveTo(0, hd); c.quadraticCurveTo(W * 0.3, hd * 0.7, W * 0.6, hd * 0.92); c.quadraticCurveTo(W * 0.8, hd * 0.75, W, hd * 0.88); c.lineTo(W, hd + 2); c.lineTo(0, hd + 2); c.fill();
    // cây xa
    var R = mulberry(7);
    for (var i = 0; i < 7; i++) { var tx = R() * W, ty = hd * (0.62 + R() * 0.22), ts = 7 + R() * 7; c.fillStyle = '#5d8f3a'; c.fillRect(tx - 1.5, ty, 3, ts * 0.9); c.fillStyle = i % 2 ? '#4f9a35' : '#5fae3f'; c.beginPath(); c.arc(tx, ty, ts, 0, 7); c.fill(); }
    if (kind === 'field') house(c, Math.max(56, W * 0.16), hd - 4, Math.min(70, hd * 0.62));
    else barn(c, W * 0.5, hd - 4, Math.min(92, hd * 0.8));
  }
  function house(c, x, by, s) {
    c.save(); c.translate(x, by);
    c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(0, 0, s * 0.62, s * 0.08, 0, 0, 7); c.fill();
    c.fillStyle = '#fff3d6'; c.fillRect(-s * 0.42, -s * 0.55, s * 0.84, s * 0.55);
    c.strokeStyle = '#c9a66b'; c.lineWidth = 1.5; c.strokeRect(-s * 0.42, -s * 0.55, s * 0.84, s * 0.55);
    c.fillStyle = '#d84b3c'; c.beginPath(); c.moveTo(-s * 0.55, -s * 0.52); c.lineTo(0, -s * 0.98); c.lineTo(s * 0.55, -s * 0.52); c.closePath(); c.fill();
    c.fillStyle = '#b8382b'; c.fillRect(-s * 0.55, -s * 0.55, s * 1.1, s * 0.06);
    c.fillStyle = '#8d5a2b'; rr(c, -s * 0.1, -s * 0.32, s * 0.2, s * 0.32, 3); c.fill();
    c.fillStyle = '#7fd3ff'; c.fillRect(-s * 0.33, -s * 0.42, s * 0.16, s * 0.14); c.fillRect(s * 0.17, -s * 0.42, s * 0.16, s * 0.14);
    c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.strokeRect(-s * 0.33, -s * 0.42, s * 0.16, s * 0.14); c.strokeRect(s * 0.17, -s * 0.42, s * 0.16, s * 0.14);
    c.fillStyle = '#9a6b4a'; c.fillRect(s * 0.22, -s * 0.95, s * 0.1, s * 0.22);
    c.restore();
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
    // chuồng phụ và silo
    c.fillStyle = '#b0bec5'; rr(c, s * 0.62, -s * 0.78, s * 0.24, s * 0.78, 6); c.fill(); c.fillStyle = '#90a4ae'; c.beginPath(); c.arc(s * 0.74, -s * 0.78, s * 0.12, Math.PI, 0); c.fill();
    c.restore();
  }
  function grass(c, y0, h0, seed) {
    var g = c.createLinearGradient(0, y0, 0, H); g.addColorStop(0, '#7cc35a'); g.addColorStop(1, '#5aa83a');
    c.fillStyle = g; c.fillRect(0, y0, W, h0);
    var R = mulberry(seed);
    var n = Math.round(W * h0 / 260);
    for (var i = 0; i < n; i++) {
      var x = R() * W, y = y0 + R() * h0, s = 3 + R() * 4;
      c.strokeStyle = R() < 0.5 ? 'rgba(46,110,30,.45)' : 'rgba(190,240,140,.5)'; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(x - s * 0.5, y - s); c.lineTo(x, y); c.lineTo(x + s * 0.5, y - s); c.stroke();
    }
    for (i = 0; i < n / 14; i++) { x = R() * W; y = y0 + R() * h0; c.fillStyle = ['#fff', '#ffe066', '#ffb3c7', '#c7a6ff'][Math.floor(R() * 4)]; c.beginPath(); c.arc(x, y, 1.8 + R(), 0, 7); c.fill(); c.fillStyle = '#ffcc33'; c.beginPath(); c.arc(x, y, 0.8, 0, 7); c.fill(); }
  }
  function fence(c, x, y, w, h) {
    var post = function (px, py) { c.fillStyle = '#9b6a3c'; rr(c, px - 3, py - 10, 6, 14, 2); c.fill(); c.fillStyle = '#c08a55'; c.fillRect(px - 3, py - 10, 2, 12); };
    c.strokeStyle = '#a8743f'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x + w, y - 6); c.moveTo(x, y + h - 2); c.lineTo(x + w, y + h - 2); c.moveTo(x, y); c.lineTo(x, y + h); c.moveTo(x + w, y); c.lineTo(x + w, y + h); c.stroke();
    for (var px = x; px <= x + w + 0.5; px += Math.max(22, w / Math.round(w / 28))) { post(px, y - 2); post(px, y + h + 2); }
    for (var py = y + 28; py < y + h - 10; py += 28) { post(x, py); post(x + w, py); }
  }
  function buildBg() {
    var key = tab + W + 'x' + H + DPR;
    if (key === bgKey) return; bgKey = key;
    bgC.width = cv.width; bgC.height = cv.height;
    var c = bgC.getContext('2d'); c.setTransform(DPR, 0, 0, DPR, 0, 0);
    grass(c, L.hd, H - L.hd, tab === 'field' ? 11 : 23);
    drawSky(c, tab);
    if (tab === 'field') {
      // lối đi đất và hàng rào quanh ruộng
      c.fillStyle = 'rgba(160,120,70,.35)'; rr(c, L.fx - 12, L.fy - 12, L.fw + 24, L.fh + 24, 18); c.fill();
      c.fillStyle = 'rgba(120,85,45,.22)'; rr(c, L.fx - 6, L.fy - 6, L.fw + 12, L.fh + 12, 14); c.fill();
      fence(c, L.fx - 16, L.fy - 12, L.fw + 32, L.fh + 22);
      emo(c, '🌳', L.fx - 30 < 14 ? 14 : L.fx - 30, L.fy + L.fh * 0.25, 28);
      emo(c, '🌻', W - 16, L.fy + L.fh * 0.55, 20);
    } else {
      L.pens.forEach(function (p, i) {
        var a = ANIMALS[i];
        c.fillStyle = 'rgba(0,0,0,.10)'; rr(c, p.x + 2, p.y + 4, p.w, p.h, 16); c.fill();
        var g = c.createLinearGradient(0, p.y, 0, p.y + p.h); g.addColorStop(0, a.grass); g.addColorStop(1, '#7cb342');
        c.fillStyle = g; rr(c, p.x, p.y, p.w, p.h, 16); c.fill();
        var R = mulberry(31 + i);
        for (var k = 0; k < p.w * p.h / 300; k++) { var x = p.x + 8 + R() * (p.w - 16), y = p.y + 30 + R() * (p.h - 36); c.strokeStyle = 'rgba(50,110,30,.35)'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x - 2, y - 4); c.lineTo(x, y); c.lineTo(x + 2, y - 4); c.stroke(); }
        // máng ăn
        c.fillStyle = '#8d5a2b'; rr(c, p.x + p.w - 64, p.y + p.h - 22, 52, 14, 5); c.fill(); c.fillStyle = '#e6c56a'; rr(c, p.x + p.w - 60, p.y + p.h - 20, 44, 6, 3); c.fill();
        c.strokeStyle = '#a8743f'; c.lineWidth = 4; rr(c, p.x + 2, p.y + 2, p.w - 4, p.h - 4, 15); c.stroke();
        c.strokeStyle = '#c99a62'; c.lineWidth = 1.5; rr(c, p.x + 6, p.y + 6, p.w - 12, p.h - 12, 12); c.stroke();
      });
    }
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
    // chín: bụi lá + nông sản lắc nhẹ
    var col2 = cr.leaf, bs = s * 0.5;
    for (k = 0; k < 6; k++) leaf(c, x, by, bs * (0.62 + (k % 3) * 0.1), bs * 0.26, -1.2 + k * 0.48 + sw, k % 2 ? col2 : shade(col2, 0.82));
    var bob = Math.sin(tm * 3 + i) * s * 0.02;
    c.save(); c.shadowColor = 'rgba(0,0,0,.28)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    emo(c, cr.e, x, by - s * 0.3 + bob, s * 0.5); c.restore();
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

  /* ================= VẼ RUỘNG ================= */
  function drawField() {
    var now = Date.now();
    for (var i = 0; i < COLS * MAXROWS; i++) {
      var R = plotRect(i), row = Math.floor(i / COLS), pl = S.plots[i];
      if (row >= S.rows) continue;
      // ô đất
      ctx.fillStyle = 'rgba(0,0,0,.18)'; rr(ctx, R.x + 1, R.y + 3, R.s, R.s, 12); ctx.fill();
      var wet = pl.c && pl.w && pl.p < 1;
      var g = ctx.createLinearGradient(0, R.y, 0, R.y + R.s);
      g.addColorStop(0, wet ? '#7a5032' : '#b07a4c'); g.addColorStop(1, wet ? '#5c3920' : '#8e5d36');
      ctx.fillStyle = g; rr(ctx, R.x, R.y, R.s, R.s, 12); ctx.fill();
      ctx.strokeStyle = wet ? 'rgba(40,20,5,.5)' : 'rgba(90,55,25,.45)'; ctx.lineWidth = Math.max(1.5, R.s * 0.03);
      for (var f = 1; f <= 3; f++) { var fy = R.y + R.s * f / 4; ctx.beginPath(); ctx.moveTo(R.x + R.s * 0.12, fy); ctx.quadraticCurveTo(R.x + R.s / 2, fy + R.s * 0.04, R.x + R.s * 0.88, fy); ctx.stroke(); }
      ctx.strokeStyle = wet ? 'rgba(255,255,255,.12)' : 'rgba(255,230,190,.35)'; ctx.lineWidth = 1.5; rr(ctx, R.x + 1, R.y + 1, R.s - 2, R.s - 2, 11); ctx.stroke();
      if (wet) { ctx.fillStyle = 'rgba(160,215,255,.55)'; for (var d = 0; d < 3; d++) { ctx.beginPath(); ctx.ellipse(R.x + R.s * (0.2 + d * 0.3), R.y + R.s * (0.84 - (d % 2) * 0.5), R.s * 0.035, R.s * 0.02, 0, 0, 7); ctx.fill(); } }
      if (pl.c) {
        var cr = CM[pl.c];
        drawPlant(ctx, R.x + R.s / 2, R.y + R.s * 0.8, R.s, cr, pl.p, i);
        if (pl.p < 1) ring(ctx, R.x + R.s - R.s * 0.14, R.y + R.s * 0.14, Math.max(8, R.s * 0.11), pl.p, pl.w ? '#38bdf8' : '#22c55e');
        else { star(ctx, R.x + R.s * 0.18, R.y + R.s * 0.2, R.s * 0.07, tm * 2 + i); star(ctx, R.x + R.s * 0.84, R.y + R.s * 0.3, R.s * 0.05, -tm * 2 + i); }
      }
    }
    // hàng đất chưa mở
    for (var r = S.rows; r < MAXROWS; r++) {
      var a = plotRect(r * COLS), y = a.y, x = a.x, w = L.fw - L.gap, h = L.cell - L.gap;
      ctx.fillStyle = 'rgba(70,120,40,.55)'; rr(ctx, x, y, w, h, 12); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; rr(ctx, x + 2, y + 2, w - 4, h - 4, 10); ctx.stroke(); ctx.setLineDash([]);
      if (r === S.rows) {
        var Ld = LAND[r + 1], ok = S.lv >= Ld[0];
        emo(ctx, ok ? '🪧' : '🔒', x + h * 0.42, y + h / 2, h * 0.45);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.font = '800 ' + Math.round(Math.max(13, h * 0.17)) + 'px ' + TF;
        ctx.fillText(ok ? 'Mở rộng ruộng: ' + money(Ld[1]) : 'Mở ở cấp ' + Ld[0], x + h * 0.8, y + h * 0.4);
        ctx.font = '600 ' + Math.round(Math.max(11, h * 0.13)) + 'px ' + TF; ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.fillText(ok ? 'Chạm để mua thêm 4 ô đất' : 'Thêm 4 ô đất trồng', x + h * 0.8, y + h * 0.66);
      } else { emo(ctx, ['🌿', '🍀', '🌼'][r % 3], x + w / 2, y + h / 2, h * 0.35); }
    }
    // gợi ý khi chạm vào cây đang lớn
    if (TIP && now < TIP.until) {
      var P = S.plots[TIP.i]; if (P.c && P.p < 1) {
        var R2 = plotRect(TIP.i), txt = CM[P.c].n + ' · còn ' + dur(left(P)) + (P.w ? ' 💧' : '');
        ctx.font = '800 14px ' + TF; var tw = ctx.measureText(txt).width + 22, tx = Math.min(W - tw - 6, Math.max(6, R2.x + R2.s / 2 - tw / 2)), ty = R2.y - 36;
        if (ty < L.hd) ty = R2.y + R2.s + 6;
        ctx.fillStyle = 'rgba(36,54,26,.92)'; rr(ctx, tx, ty, tw, 30, 15); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, tx + tw / 2, ty + 15);
      }
    } else TIP = null;
  }

  /* ================= VẼ CHUỒNG TRẠI ================= */
  function pos(aid, k, p) {
    var arr = POS[aid] || (POS[aid] = []);
    if (!arr[k]) arr[k] = { x: rnd(0.08, 0.8), y: rnd(0.42, 0.62), tx: rnd(0.08, 0.8), ty: rnd(0.42, 0.62), d: 1, w: rnd(0, 2) };
    return arr[k];
  }
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
    L.pens.forEach(function (p, i) {
      var a = ANIMALS[i], list = S.an[a.id], locked = S.lv < a.lv;
      // tiêu đề chuồng
      ctx.font = '800 14px ' + TF; var lt = a.pen + ' ' + list.length + '/' + a.max, lw = ctx.measureText(lt).width + 44;
      ctx.fillStyle = 'rgba(255,255,255,.9)'; rr(ctx, p.x + 10, p.y + 9, lw, 28, 14); ctx.fill();
      ctx.fillStyle = '#4a3416'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '800 14px ' + TF;
      ctx.fillText(lt, p.x + 38, p.y + 23); emo(ctx, a.e, p.x + 24, p.y + 23, 18);
      if (!locked && list.length) { ctx.font = '700 12px ' + TF; ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.textAlign = 'left'; ctx.fillText('Ăn ' + CM[a.feed].e + ' → ' + PRODUCTS[a.p].e + ' sau ' + durL(a.t), p.x + lw + 18, p.y + 23); }
      if (locked) {
        ctx.fillStyle = 'rgba(40,40,40,.45)'; rr(ctx, p.x, p.y, p.w, p.h, 16); ctx.fill();
        emo(ctx, '🔒', p.x + p.w / 2, p.y + p.h / 2 - 10, 34);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '800 15px ' + TF; ctx.fillText('Mở ở cấp ' + a.lv + ' · nuôi ' + a.n.toLowerCase() + ' lấy ' + PRODUCTS[a.p].n.toLowerCase(), p.x + p.w / 2, p.y + p.h / 2 + 22);
        return;
      }
      var bx = p.x + 12, by = p.y + p.h - 40;
      if (list.length) bx += pillL(ctx, bx, by, '⚡ Chăm tất cả', '#16a34a', '#fff', function () { careAll(a); }) + 8;
      if (list.length < a.max) pillL(ctx, bx, by, '＋ Mua ' + a.n.toLowerCase() + ' ' + short(a.cost), '#f59e0b', '#fff', function () { buyAnimal(a); });
      if (!list.length) {
        ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.textAlign = 'center'; ctx.font = '700 14px ' + TF;
        ctx.fillText('Chuồng trống – hãy mua ' + a.n.toLowerCase() + ' đầu tiên!', p.x + p.w / 2, p.y + p.h * 0.42);
        ctx.font = '600 13px ' + TF; ctx.fillText('Cho ăn ' + CM[a.feed].e + ' ' + CM[a.feed].n + ' → nhận ' + PRODUCTS[a.p].e + ' ' + PRODUCTS[a.p].n + ' sau ' + durL(a.t), p.x + p.w / 2, p.y + p.h * 0.42 + 22);
      }
      var sz = Math.min(46, p.h * 0.34, p.w / (a.max + 1.5));
      // sắp xếp theo y để con phía sau vẽ trước
      var order = list.map(function (x, k) { return k; }).sort(function (u, v) { return pos(a.id, u).y - pos(a.id, v).y; });
      order.forEach(function (k) {
        var x = list[k], q = pos(a.id, k);
        q.w -= dt;
        if (q.w <= 0) { var dx = q.tx - q.x, dy = q.ty - q.y, dd = Math.sqrt(dx * dx + dy * dy); if (dd < 0.01) { q.tx = rnd(0.08, 0.8); q.ty = rnd(0.42, 0.62); q.w = rnd(0.8, 3); } else { var spd = 0.06 * dt; q.x += dx / dd * Math.min(spd, dd); q.y += dy / dd * Math.min(spd, dd); q.d = dx < 0 ? -1 : 1; } }
        var ax = p.x + 14 + q.x * (p.w - 28), ay = p.y + q.y * p.h, walking = q.w <= 0;
        x._x = ax; x._y = ay; x._s = sz;
        ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(ax, ay + sz * 0.42, sz * 0.38, sz * 0.1, 0, 0, 7); ctx.fill();
        ctx.save(); ctx.translate(ax, ay - (walking ? Math.abs(Math.sin(tm * 10 + k)) * sz * 0.08 : 0)); ctx.scale(-q.d, 1); emo(ctx, a.e, 0, 0, sz); ctx.restore();
        var bubY = ay - sz * 0.95;
        if (x.s === 0) { bubble(ax, bubY, sz * 0.5, CM[a.feed].e, '#fff'); }
        else if (x.s === 1) ring(ctx, ax + sz * 0.4, ay - sz * 0.55, Math.max(8, sz * 0.2), x.p, '#f59e0b');
        else { var bb = Math.sin(tm * 5 + k) * 3; bubble(ax, bubY + bb, sz * 0.55, PRODUCTS[a.p].e, '#fff7d1'); star(ctx, ax + sz * 0.45, bubY - sz * 0.25, sz * 0.12, tm * 2); }
      });
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
      var x = c.x * W, y = c.y * L.hd, s = 18 * c.s;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.arc(x + s * 1.1, y - s * 0.4, s * 1.2, 0, 7); ctx.arc(x + s * 2.3, y, s * 0.95, 0, 7); ctx.fill();
      ctx.fillRect(x, y - 2, s * 2.3, s * 0.9);
    });
  }

  /* ================= VÒNG LẶP ================= */
  var lastT = 0;
  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now; tm += dt;
    var t = Date.now(); update(t);
    if (t - lastSave > 5000) { lastSave = t; save(); badges(); }
    if (tab === 'field' || tab === 'barn') {
      buildBg(); HITS = [];
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(bgC, 0, 0);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      drawClouds(dt);
      if (tab === 'field') drawField(); else drawBarn(dt);
      drawFX(dt);
    }
    raf = requestAnimationFrame(loop);
  }

  /* ================= HÀNH ĐỘNG TRÊN RUỘNG ================= */
  var drag = null;
  function plotAt(x, y) {
    if (x < L.fx || y < L.fy || x >= L.fx + L.fw || y >= L.fy + L.fh) return -1;
    var c = Math.floor((x - L.fx) / L.cell), r = Math.floor((y - L.fy) / L.cell);
    return r * COLS + c;
  }
  function plant(i) {
    var pl = S.plots[i], cr = CM[S.sel], R = plotRect(i);
    if (cr.lv > S.lv) { toast('🔒 ' + cr.n + ' mở ở cấp ' + cr.lv); return false; }
    if (S.m < cr.cost) { toast('💸 Không đủ tiền mua hạt ' + cr.n + ' (' + money(cr.cost) + '). Hãy bán bớt nông sản trong Kho!'); sfx('bad'); return false; }
    S.m -= cr.cost; addLog('out', cr.cost, 'seed_' + cr.id, 'Mua hạt giống ' + cr.n, cr.e);
    pl.c = cr.id; pl.p = 0; pl.t = Date.now(); pl.w = 0;
    burst(R.x + R.s / 2, R.y + R.s * 0.8, ['#8d5a2b', '#6b4423', '#c08a55'], 7);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.4, '−' + short(cr.cost), '#fecaca');
    return true;
  }
  function harvest(i, quiet) {
    var pl = S.plots[i], cr = CM[pl.c], R = plotRect(i);
    S.inv[cr.id] = (S.inv[cr.id] || 0) + 1;
    pl.c = null; pl.p = 0; pl.w = 0;
    burst(R.x + R.s / 2, R.y + R.s * 0.5, ['#fde047', '#86efac', '#fff'], 10);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.35, '+1 ' + cr.e, '#fef08a');
    if (!quiet) sfx('ok');
    addXP(cr.xp);
  }
  function water(i) {
    var pl = S.plots[i], R = plotRect(i);
    if (!pl.c || pl.p >= 1 || pl.w) return false;
    update(Date.now()); pl.w = 1;
    burst(R.x + R.s / 2, R.y + R.s * 0.3, ['#7dd3fc', '#38bdf8', '#e0f2fe'], 9);
    return true;
  }
  function fert(i) {
    var pl = S.plots[i], R = plotRect(i);
    if (!pl.c || pl.p >= 1) return false;
    if (S.fert <= 0) { toast('🧪 Hết phân bón. Mua thêm ở mục Kho & Chợ.'); return false; }
    update(Date.now()); S.fert--; pl.p = Math.min(1, pl.p + (1 - pl.p) * 0.5);
    burst(R.x + R.s / 2, R.y + R.s * 0.4, ['#c4b5fd', '#a78bfa', '#fff'], 10);
    floatTxt(R.x + R.s / 2, R.y + R.s * 0.3, '⚡ Nhanh gấp đôi', '#ddd6fe');
    toolsUI(); return true;
  }
  function act(i, first) {
    if (i < 0 || i >= COLS * MAXROWS) return;
    var row = Math.floor(i / COLS);
    if (row >= S.rows) { if (first && row === S.rows) buyLand(); return; }
    var pl = S.plots[i];
    if (pl.c && pl.p >= 1) { harvest(i); hud(); return; }
    if (tool === 'seed') {
      if (!pl.c) { if (plant(i)) { hud(); if (first) sfx('ok'); } }
      else if (first) TIP = { i: i, until: Date.now() + 2200 };
    } else if (tool === 'water') { if (water(i) && first) sfx('ok'); else if (first && pl.c) TIP = { i: i, until: Date.now() + 2200 }; }
    else if (tool === 'fert') { if (fert(i) && first) sfx('ok'); }
  }
  function buyLand() {
    var r = S.rows; if (r >= MAXROWS) return;
    var Ld = LAND[r + 1];
    if (S.lv < Ld[0]) { toast('🔒 Đạt cấp ' + Ld[0] + ' để mở rộng ruộng'); return; }
    confirmBox('🪧', 'Mở rộng ruộng?', 'Mua thêm 4 ô đất với giá <b>' + money(Ld[1]) + '</b>. Đây là khoản <b>đầu tư</b>: tốn tiền một lần nhưng giúp nông trại thu được nhiều hơn mỗi ngày.', 'Mua đất', function () {
      if (S.m < Ld[1]) { toast('💸 Chưa đủ tiền, cần ' + money(Ld[1])); sfx('bad'); return; }
      S.m -= Ld[1]; S.rows++; addLog('out', Ld[1], 'land' + S.rows, 'Mua thêm đất (hàng ' + S.rows + ')', '🪧'); sfx('win'); save(); hud(); toast('🎉 Ruộng đã rộng hơn!');
    });
  }

  /* ================= VẬT NUÔI ================= */
  function buyAnimal(a) {
    var list = S.an[a.id];
    if (list.length >= a.max) { toast('Chuồng đã đầy'); return; }
    if (S.m < a.cost) { toast('💸 Cần ' + money(a.cost) + ' để mua ' + a.n.toLowerCase()); sfx('bad'); return; }
    S.m -= a.cost; list.push({ s: 0, p: 0, t: Date.now() }); addLog('out', a.cost, 'buy_' + a.id, 'Mua ' + a.n.toLowerCase(), a.e);
    sfx('win'); hud(); save(); toast(a.e + ' Đã mua thêm 1 con ' + a.n.toLowerCase() + '. Chạm vào để cho ăn ' + CM[a.feed].e);
  }
  function feedOne(a, x) {
    if ((S.inv[a.feed] || 0) < 1) return false;
    S.inv[a.feed]--; x.s = 1; x.p = 0; x.t = Date.now(); return true;
  }
  function collectOne(a, x) {
    S.inv[a.p] = (S.inv[a.p] || 0) + 1; x.s = 0; x.p = 0; addXP(PRODUCTS[a.p].xp);
    if (x._x) { burst(x._x, x._y - 20, ['#fde047', '#fff', '#fdba74'], 9); floatTxt(x._x, x._y - 30, '+1 ' + PRODUCTS[a.p].e + ' +' + PRODUCTS[a.p].xp + ' KN', '#fef08a'); }
  }
  function careAll(a) {
    var got = 0, fed = 0, miss = 0;
    S.an[a.id].forEach(function (x) { if (x.s === 2) { collectOne(a, x); got++; } });
    S.an[a.id].forEach(function (x) { if (x.s === 0) { if (feedOne(a, x)) fed++; else miss++; } });
    if (got || fed) sfx('ok');
    toast((got ? 'Thu ' + got + ' ' + PRODUCTS[a.p].e + '. ' : '') + (fed ? 'Cho ăn ' + fed + ' con. ' : '') + (miss ? 'Thiếu ' + miss + ' ' + CM[a.feed].e + ' ' + CM[a.feed].n + ' để cho ăn.' : '') || 'Các con đang no, chờ chút nhé!');
    hud(); save();
  }
  function tapBarn(x, y) {
    for (var h = HITS.length - 1; h >= 0; h--) { var b = HITS[h]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.fn(); return; } }
    for (var i = 0; i < ANIMALS.length; i++) {
      var a = ANIMALS[i], list = S.an[a.id];
      for (var k = list.length - 1; k >= 0; k--) {
        var o = list[k]; if (o._x == null) continue;
        if (Math.abs(x - o._x) < o._s * 0.7 && y > o._y - o._s * 1.4 && y < o._y + o._s * 0.6) {
          if (o.s === 2) { collectOne(a, o); sfx('ok'); }
          else if (o.s === 0) {
            if (feedOne(a, o)) { sfx('ok'); burst(o._x, o._y, ['#fde68a', '#bef264'], 6); floatTxt(o._x, o._y - 30, '−1 ' + CM[a.feed].e, '#fff'); }
            else { toast('Cần 1 ' + CM[a.feed].e + ' ' + CM[a.feed].n + ' để cho ' + a.n.toLowerCase() + ' ăn. Hãy trồng thêm ở Ruộng!'); sfx('bad'); }
          } else toast(a.e + ' Đang làm ra ' + PRODUCTS[a.p].e + ' ' + PRODUCTS[a.p].n.toLowerCase() + ', còn ' + dur((1 - o.p) * a.t));
          hud(); save(); return;
        }
      }
    }
  }

  /* ================= GIAO DIỆN HTML ================= */
  function hud() {
    $('fmLv').textContent = S.lv;
    var nd = need(S.lv); $('fmXp').style.width = Math.min(100, S.xp / nd * 100) + '%';
    $('fmXpT').textContent = 'Cấp ' + S.lv + ' · ' + S.xp + '/' + nd + ' KN';
    $('fmM').textContent = '💰 ' + money(S.m);
    toolsUI(); badges();
  }
  function toolsUI() {
    var cr = CM[S.sel];
    $('fmSeedE').textContent = cr.e; $('fmSeedN').textContent = cr.n + ' ▾';
    $('fmFert').textContent = S.fert;
    var bs = $('fmTools').querySelectorAll('[data-t]');
    for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-t') === tool);
  }
  function badges() {
    fillOrders();
    var n = S.orders.filter(canDeliver).length, o = $('fmDotO'); o.style.display = n ? '' : 'none'; o.textContent = n;
    var b = 0; ANIMALS.forEach(function (a) { S.an[a.id].forEach(function (x) { if (x.s === 2) b++; }); });
    var d = $('fmDotB'); d.style.display = b ? '' : 'none'; d.textContent = b;
  }
  var toastT = 0;
  function toast(t) { var el = $('fmToast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600); }
  function sheet(html) { $('fmSB').innerHTML = html; $('fmSheet').classList.add('on'); $('fmSB').scrollTop = 0; }
  function closeSheet() { $('fmSheet').classList.remove('on'); }
  var confirmFn = null;
  function confirmBox(e, t, body, ok, fn) {
    confirmFn = fn;
    sheet('<div class="fm-modal"><div class="big">' + e + '</div><h2>' + t + '</h2><p>' + body + '</p><div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="sheetClose">Để sau</button><button class="fm-btn org" data-a="confirm">' + ok + '</button></div></div>');
  }
  function seedSheet() {
    var h = '<div class="fm-h">🌱 Chọn hạt giống</div><p class="fm-sub">Chọn xong, chạm (hoặc vuốt) lên các ô đất trống để gieo. <b>Lãi</b> = giá bán − tiền hạt giống. Cây lâu lớn thường lãi nhiều hơn, cây nhanh lớn giúp xoay vòng vốn nhanh.</p>';
    CROPS.forEach(function (c) {
      var lk = c.lv > S.lv, pr = c.sell - c.cost;
      h += '<button class="fm-seed' + (S.sel === c.id ? ' on' : '') + '" data-a="pick" data-c="' + c.id + '"' + (lk ? ' disabled' : '') + '><span class="e">' + (lk ? '🔒' : c.e) + '</span><span class="tx"><b>' + c.n + '</b>' +
        '<small>' + (lk ? 'Mở ở cấp ' + c.lv : 'Hạt ' + money(c.cost) + ' · ⏱ ' + durL(c.t) + ' · bán ' + money(c.sell)) + '</small></span>' +
        (lk ? '' : '<span class="pr">+' + short(pr) + '<small>lãi/cây</small></span>') + '</button>';
    });
    sheet(h);
  }
  function levelUp() {
    sfx('win'); try { if (window.addStar) window.addStar(); } catch (e) {}
    var un = [];
    CROPS.forEach(function (c) { if (c.lv === S.lv) un.push('<span><i>' + c.e + '</i>' + c.n + '</span>'); });
    ANIMALS.forEach(function (a) { if (a.lv === S.lv) un.push('<span><i>' + a.e + '</i>Nuôi ' + a.n.toLowerCase() + '</span>'); });
    for (var r in LAND) if (LAND[r][0] === S.lv) un.push('<span><i>🪧</i>Mở rộng ruộng</span>');
    var bonus = S.lv * 20000; S.m += bonus; S.fert += 2; addLog('in', bonus, 'lv' + S.lv, 'Thưởng lên cấp ' + S.lv, '🎁');
    sheet('<div class="fm-modal"><div class="big">🎉</div><h2>Lên cấp ' + S.lv + '!</h2><p>Thưởng <b>' + money(bonus) + '</b> + 🧪 2 túi phân bón. Con được cộng 1 điểm ⭐ vào app.</p>' +
      (un.length ? '<p><b>Mở khoá mới:</b></p><div class="fm-ul">' + un.join('') + '</div>' : '') + '<button class="fm-btn" data-a="sheetClose" style="width:100%;margin-top:8px">Tuyệt vời!</button></div>');
    hud(); save();
  }
  function guide() {
    sheet('<div class="fm-modal"><div class="big">👩‍🌾</div><h2>Chào mừng đến Nông trại 6PAY!</h2><ul class="fm-guide">' +
      '<li><i>🌱</i><span>Chọn hạt giống ở thanh công cụ, rồi <b>chạm hoặc vuốt</b> lên ô đất trống để gieo. Mỗi hạt giống tốn tiền.</span></li>' +
      '<li><i>🚿</i><span>Tưới nước để cây lớn <b>nhanh hơn 1,5 lần</b>. Phân bón 🧪 rút ngắn một nửa thời gian còn lại.</span></li>' +
      '<li><i>🧺</i><span>Cây chín lấp lánh ✨: chạm để thu hoạch, được kinh nghiệm để lên cấp.</span></li>' +
      '<li><i>🐔</i><span>Nuôi gà, bò, cừu: cho ăn nông sản để lấy trứng, sữa, len.</span></li>' +
      '<li><i>🚚</i><span>Giao <b>đơn hàng</b> được giá cao hơn bán ở chợ. Theo dõi lãi lỗ trong <b>Sổ thu chi</b> 📒.</span></li>' +
      '<li><i>⏰</i><span>Cây vẫn lớn khi con thoát game, quay lại là thu hoạch được.</span></li>' +
      '</ul><button class="fm-btn" data-a="sheetClose" style="width:100%">Bắt đầu trồng trọt!</button></div>');
  }

  /* --- Đơn hàng --- */
  function renderOrders() {
    fillOrders();
    var h = '<div class="fm-h">🚚 Đơn hàng</div><p class="fm-sub">Khách đặt hàng trả giá cao hơn bán lẻ ở chợ khoảng 35%. Gom đủ hàng rồi bấm Giao hàng. Không làm được đơn nào thì bấm Đổi đơn.</p>';
    S.orders.forEach(function (o, k) {
      var ok = canDeliver(o);
      h += '<div class="fm-card fm-ord"><span class="tr">' + o.tr + '</span><div class="bd"><b class="w">' + esc(o.who) + '</b><div class="fm-need">' +
        o.it.map(function (x) { var hv = S.inv[x[0]] || 0, I = item(x[0]); return '<span class="' + (hv >= x[1] ? 'ok' : 'no') + '"><i>' + I.e + '</i>' + Math.min(hv, x[1]) + '/' + x[1] + '</span>'; }).join('') +
        '</div><div class="fm-rw">Thưởng: ' + money(o.m) + ' · +' + o.xp + ' KN</div><div class="fm-row"><button class="fm-btn" data-a="deliver" data-i="' + k + '"' + (ok ? '' : ' disabled') + '>✅ Giao hàng</button><button class="fm-btn alt" data-a="skip" data-i="' + k + '">🔄 Đổi đơn</button></div></div></div>';
    });
    $('fmP_orders').innerHTML = h;
  }
  function deliver(k) {
    var o = S.orders[k]; if (!o || !canDeliver(o)) return;
    o.it.forEach(function (x) { S.inv[x[0]] -= x[1]; });
    S.m += o.m; addLog('in', o.m, 'ord' + Date.now(), 'Giao đơn hàng cho ' + o.who, o.tr);
    addXP(o.xp); S.orders.splice(k, 1); fillOrders(); sfx('win'); toast('🎉 Đã giao hàng, nhận ' + money(o.m)); hud(); save(); renderOrders();
  }

  /* --- Kho & chợ --- */
  function renderInv() {
    var ids = CROPS.map(function (c) { return c.id; }).concat(Object.keys(PRODUCTS)).filter(function (id) { return S.inv[id] > 0; });
    var val = ids.reduce(function (a, id) { return a + S.inv[id] * item(id).sell; }, 0);
    var h = '<div class="fm-h">📦 Kho nông sản</div><p class="fm-sub">Giá trị hàng trong kho: <b>' + money(val) + '</b>. Nên giữ lại một ít lúa, ngô, cà rốt để cho vật nuôi ăn và giao đơn hàng.</p>';
    if (!ids.length) h += '<div class="fm-card" style="text-align:center;color:#7a6440">Kho đang trống. Hãy ra Ruộng thu hoạch nhé! 🌾</div>';
    else h += '<div class="fm-inv">' + ids.map(function (id) { var I = item(id), q = S.inv[id];
      return '<div class="fm-it"><div class="e">' + I.e + '</div><b>' + I.n + '</b><small>Giá chợ ' + money(I.sell) + '</small><div class="q">× ' + q + '</div><div class="fm-row"><button class="fm-btn alt" data-a="sell" data-c="' + id + '" data-q="1">Bán 1</button><button class="fm-btn" data-a="sell" data-c="' + id + '" data-q="' + q + '">Bán hết</button></div></div>'; }).join('') + '</div>';
    h += '<div class="fm-h" style="margin-top:16px">🏪 Cửa hàng vật tư</div>' +
      '<div class="fm-card" style="display:flex;align-items:center;gap:10px"><span style="font-size:40px;font-family:' + EF + '">🧪</span><div style="flex:1"><b>Phân bón</b><div class="fm-sub" style="margin:2px 0 0">Đang có ' + S.fert + ' túi · ' + money(FERT_PRICE) + '/túi. Bón vào cây đang lớn để rút ngắn một nửa thời gian còn lại.</div></div></div>' +
      '<div class="fm-row" style="margin-top:-2px"><button class="fm-btn org" data-a="buyFert" data-q="1">Mua 1 túi</button><button class="fm-btn org" data-a="buyFert" data-q="5">Mua 5 túi (' + short(FERT_PRICE * 5) + ')</button></div>';
    $('fmP_inv').innerHTML = h;
  }
  function sell(id, q) {
    q = Math.min(q, S.inv[id] || 0); if (q <= 0) return;
    var I = item(id), amt = I.sell * q;
    S.inv[id] -= q; S.m += amt; addLog('in', amt, 'sell_' + id, 'Bán ' + I.n, I.e, q);
    sfx('ok'); toast('💰 Bán ' + q + ' ' + I.e + ' được ' + money(amt)); hud(); save(); renderInv();
  }

  /* --- Sổ thu chi --- */
  function renderBook() {
    var prof = S.tin - S.tout, today = new Date(); today.setHours(0, 0, 0, 0);
    var ti = 0, to = 0; S.log.forEach(function (l) { if (l.ts >= today.getTime()) { if (l.k === 'in') ti += l.a; else to += l.a; } });
    var h = '<div class="fm-h">📒 Sổ thu chi nông trại</div><p class="fm-sub">Người nông dân giỏi luôn ghi chép: tiền vào (thu) và tiền ra (chi). <b>Lãi = Thu − Chi</b>. Vốn ban đầu: ' + money(200000) + '.</p>' +
      '<div class="fm-sum"><div>Tổng thu<b style="color:#15803d">' + short(S.tin) + '</b></div><div>Tổng chi<b style="color:#dc2626">' + short(S.tout) + '</b></div><div>' + (prof >= 0 ? 'Lãi' : 'Lỗ') + '<b style="color:' + (prof >= 0 ? '#15803d' : '#dc2626') + '">' + short(prof) + '</b></div></div>' +
      '<div class="fm-card" style="font-size:14px">📅 Hôm nay: thu <b style="color:#15803d">' + money(ti) + '</b>, chi <b style="color:#dc2626">' + money(to) + '</b> → ' + (ti - to >= 0 ? 'lãi' : 'lỗ') + ' <b>' + money(Math.abs(ti - to)) + '</b></div>' +
      '<div class="fm-card"><b>📊 Bảng tính lãi từng loại cây</b><div class="fm-sub" style="margin:4px 0 6px">Lãi mỗi phút = lãi ÷ số phút cây lớn (chưa tưới). Dùng để chọn cây có lợi nhất.</div><table class="fm-tb"><tr><th></th><th>Cây</th><th>Lãi/cây</th><th>Thời gian</th><th>Lãi/phút</th></tr>' +
      CROPS.map(function (c) { var pr = c.sell - c.cost; return '<tr' + (c.lv > S.lv ? ' style="opacity:.45"' : '') + '><td class="e">' + c.e + '</td><td>' + c.n + '</td><td class="g">+' + short(pr) + '</td><td>' + durL(c.t) + '</td><td class="g">' + short(Math.round(pr / (c.t / 60))) + '</td></tr>'; }).join('') + '</table></div>' +
      '<div class="fm-card"><b>🧾 Ghi chép gần đây</b>';
    if (!S.log.length) h += '<div class="fm-sub" style="margin-top:6px">Chưa có khoản nào. Gieo hạt đầu tiên nhé!</div>';
    S.log.slice(0, 60).forEach(function (l) {
      var d = new Date(l.ts);
      h += '<div class="fm-log"><span class="e">' + l.e + '</span><span class="t">' + esc(l.n) + (l.q > 1 ? ' × ' + l.q : '') + '<small>' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' · ' + d.getDate() + '/' + (d.getMonth() + 1) + '</small></span><span class="a ' + l.k + '">' + (l.k === 'in' ? '+' : '−') + money(l.a) + '</span></div>';
    });
    $('fmP_book').innerHTML = h + '</div><div class="fm-row" style="justify-content:center"><button class="fm-btn alt" data-a="reset">↺ Chơi lại từ đầu</button></div>';
  }

  /* ================= CHUYỂN TAB ================= */
  function setTab(t) {
    tab = t; closeSheet();
    var nb = $('fmNav').querySelectorAll('button'); for (var i = 0; i < nb.length; i++) nb[i].classList.toggle('on', nb[i].getAttribute('data-t') === t);
    ['orders', 'inv', 'book'].forEach(function (p) { $('fmP_' + p).classList.toggle('on', p === t); });
    stage.style.visibility = (t === 'field' || t === 'barn') ? 'visible' : 'hidden';
    $('fmTools').style.display = t === 'field' ? '' : 'none';
    if (t === 'orders') renderOrders(); else if (t === 'inv') renderInv(); else if (t === 'book') renderBook();
    var pn = $('fmP_' + t); if (pn) pn.scrollTop = 0;
    bgKey = '';
  }

  /* ================= SỰ KIỆN ================= */
  function pt(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  stage.addEventListener('pointerdown', function (e) {
    if (e.target !== cv) return;
    var p = pt(e);
    if (tab === 'barn') { tapBarn(p.x, p.y); return; }
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    var i = plotAt(p.x, p.y); drag = { last: i }; act(i, true);
  });
  stage.addEventListener('pointermove', function (e) {
    if (!drag || tab !== 'field') return;
    var p = pt(e), i = plotAt(p.x, p.y);
    if (i !== drag.last) { drag.last = i; if (i >= 0 && Math.floor(i / COLS) < S.rows) act(i, false); }
  });
  function endDrag() { if (drag) { drag = null; save(); } }
  stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);

  ov.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null;
    if (!el) { if (e.target === $('fmSheet')) closeSheet(); return; }
    if (el.disabled) return;
    var a = el.getAttribute('data-a');
    if (a === 'close') api.close();
    else if (a === 'back') { if ($('fmSheet').classList.contains('on')) closeSheet(); else if (tab !== 'field') setTab('field'); else api.close(); }
    else if (a === 'tab') setTab(el.getAttribute('data-t'));
    else if (a === 'tool') { var t = el.getAttribute('data-t'); if (t === 'seed' && tool === 'seed') seedSheet(); tool = t; toolsUI(); if (t === 'water') toast('🚿 Chạm hoặc vuốt qua các ô đang trồng để tưới'); else if (t === 'fert') toast('🧪 Chạm vào cây đang lớn để bón phân (còn ' + S.fert + ' túi)'); }
    else if (a === 'pick') { S.sel = el.getAttribute('data-c'); tool = 'seed'; toolsUI(); closeSheet(); save(); toast(CM[S.sel].e + ' Chạm hoặc vuốt lên ô đất trống để gieo ' + CM[S.sel].n); }
    else if (a === 'harvestAll') { var n = 0; for (var i = 0; i < S.rows * COLS; i++) { var pl = S.plots[i]; if (pl.c && pl.p >= 1) { harvest(i, true); n++; } } if (n) { sfx('ok'); toast('🧺 Thu hoạch ' + n + ' ô'); } else toast('Chưa có cây nào chín ✨'); hud(); save(); }
    else if (a === 'sheetClose') closeSheet();
    else if (a === 'confirm') { closeSheet(); if (confirmFn) confirmFn(); confirmFn = null; }
    else if (a === 'deliver') deliver(+el.getAttribute('data-i'));
    else if (a === 'skip') { S.orders.splice(+el.getAttribute('data-i'), 1); fillOrders(); save(); renderOrders(); badges(); }
    else if (a === 'sell') sell(el.getAttribute('data-c'), +el.getAttribute('data-q'));
    else if (a === 'buyFert') { var q = +el.getAttribute('data-q'), c = q * FERT_PRICE; if (S.m < c) { toast('💸 Không đủ tiền'); sfx('bad'); return; } S.m -= c; S.fert += q; addLog('out', c, 'fert', 'Mua phân bón', '🧪', q); sfx('ok'); hud(); save(); renderInv(); }
    else if (a === 'reset') confirmBox('↺', 'Chơi lại từ đầu?', 'Toàn bộ ruộng, vật nuôi, kho và sổ thu chi sẽ bị xoá.', 'Xoá và chơi lại', function () { S = fresh(); POS = {}; save(); hud(); setTab('field'); guide(); });
  });
  window.addEventListener('resize', function () { if (running) resize(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && running) save(); });

  /* ================= API CÔNG KHAI ================= */
  var api = {
    open: function () {
      load(); update(Date.now()); fillOrders();
      ov.classList.add('on'); document.body.style.overflow = 'hidden';
      setTab('field'); tool = 'seed';
      requestAnimationFrame(function () { resize(); hud(); running = true; lastT = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); if (!S.seen) { S.seen = 1; save(); guide(); } });
    },
    close: function () { running = false; cancelAnimationFrame(raf); save(); closeSheet(); ov.classList.remove('on'); document.body.style.overflow = ''; }
  };
  window.FarmGame = api;
})();
