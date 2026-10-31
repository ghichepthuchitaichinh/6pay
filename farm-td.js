/* 6PAY - NHIỆM VỤ THỦ THÀNH cho game Nông trại Sixpay (bản 2026.10.31-td1)
   Khi bầy thú hoang (🦊 cáo, 🐺 sói, 🐻 gấu) kéo đến, người chơi đặt chòi phòng thủ dọc con đường từ bìa rừng xuống chuồng trại.
   Công trình bảo vệ đã xây trong nông trại sẽ mở thêm loại chòi trong trận:
     🪵 Hàng rào  → được đặt rào chắn trên đường (thú phải phá rào mới đi tiếp)
     🛖 Chòi canh → được đặt chòi canh (nhìn xa, giúp các chòi đứng gần bắn xa hơn)
     🏹 Chòi bắn cung → được đặt cung thủ (bắn mạnh, rất hiệu quả với gấu)
   Nông dân ném đá và chó giữ nhà luôn có sẵn.
   File này được farm.js tải về khi cần. Gọi: FarmTD.start({ k, tier, defs, animals, onEnd }) */
(function () {
  if (window.FarmTD) return;
  var TF = '"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var COLS = 7, ROWS = 12, BARN = 11;   // hàng 11 là chuồng trại (không xây được)

  /* ===== Bản đồ: 3 kiểu đường mòn, chọn ngẫu nhiên mỗi trận ===== */
  var PATHS = [
    [[1, -1], [1, 3], [5, 3], [5, 6], [1, 6], [1, 9], [3, 9], [3, 11]],
    [[5, -1], [5, 2], [2, 2], [2, 5], [5, 5], [5, 8], [2, 8], [2, 10], [3, 10], [3, 11]],
    [[3, -1], [3, 2], [1, 2], [1, 5], [5, 5], [5, 9], [3, 9], [3, 11]]
  ];

  /* ===== Thú hoang ===== */
  var EN = {
    fox: { n: 'Cáo', e: '🦊', hp: 26, spd: 1.7, gold: 6, bite: 6, life: 1, sz: 0.62 },
    wolf: { n: 'Sói', e: '🐺', hp: 62, spd: 1.22, gold: 9, bite: 13, life: 1, sz: 0.7 },
    bear: { n: 'Gấu', e: '🐻', hp: 280, spd: 0.6, gold: 38, bite: 45, life: 2, sz: 0.92 }
  };
  /* Các đợt tấn công theo loại thú dẫn đầu bầy */
  var WAVES = {
    fox: [[['fox', 5, 1.1]], [['fox', 8, 0.9]], [['fox', 10, 0.75]], [['fox', 14, 0.6]]],
    wolf: [[['fox', 6, 1]], [['fox', 4, 0.9], ['wolf', 3, 1.4]], [['wolf', 7, 1.2]], [['fox', 6, 0.6], ['wolf', 8, 1]], [['wolf', 12, 0.85]]],
    bear: [[['wolf', 5, 1.2]], [['fox', 6, 0.7], ['wolf', 5, 1]], [['wolf', 5, 1], ['bear', 1, 2]], [['wolf', 8, 0.9], ['bear', 2, 3]], [['fox', 6, 0.5], ['wolf', 8, 0.8], ['bear', 3, 2.6]]]
  };

  /* ===== Chòi phòng thủ =====
     c: giá (xu), r: tầm bắn (ô), d: sát thương, cd: thời gian nạp (giây), need: công trình cần xây ở nông trại */
  var TW = {
    farmer: { n: 'Nông dân ném đá', e: '🧑‍🌾', c: 40, r: 2.0, d: 7, cd: 0.9, ps: 7, pk: 'stone', info: 'Rẻ, bắn đều tay. Có sẵn.' },
    dog: { n: 'Chó giữ nhà', e: '🐕', c: 55, r: 1.45, d: 3, cd: 0.7, slow: 0.45, info: 'Sủa làm cả bầy chạy chậm lại. Có sẵn.' },
    watch: { n: 'Chòi canh', e: '🛖', c: 70, r: 3.2, d: 6, cd: 1.1, ps: 9, pk: 'spear', aura: 1.6, need: 'choi', info: 'Nhìn rất xa. Chòi đứng sát bên bắn xa hơn 20%.' },
    archer: { n: 'Cung thủ', e: '🏹', c: 90, r: 2.6, d: 16, cd: 0.75, ps: 14, pk: 'arrow', bear: 1.6, need: 'cung', info: 'Bắn mạnh, gây thêm 60% sát thương lên gấu.' },
    fence: { n: 'Rào chắn', e: '🪵', c: 30, hp: [90, 170, 270], need: 'rao', path: 1, info: 'Đặt trên đường. Thú phải phá rào mới đi tiếp.' }
  };
  var TORDER = ['farmer', 'dog', 'watch', 'archer', 'fence'];
  var NEEDN = { rao: '🪵 Hàng rào', choi: '🛖 Chòi canh', cung: '🏹 Chòi bắn cung' };
  var DMUL = [1, 1.6, 2.4], RADD = [0, 0.25, 0.5];
  function upCost(T, lv) { return Math.round(T.c * (lv === 1 ? 0.9 : 1.4) / 5) * 5; }

  /* ===== Giao diện ===== */
  var css =
    '#tdOv{position:fixed;inset:0;z-index:100000;display:none;flex-direction:column;background:#1f3d14;font-family:' + TF + ';color:#24361a;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none}#tdOv.on{display:flex}' +
    '#tdOv *{box-sizing:border-box}' +
    '.td-top{flex:none;display:flex;align-items:center;gap:6px;padding:max(8px,env(safe-area-inset-top)) 8px 8px;background:linear-gradient(180deg,#3b2410,#5b3a17);color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.35);z-index:2}' +
    '.td-ib{flex:none;min-width:40px;height:40px;border:0;border-radius:12px;background:rgba(255,255,255,.16);color:#fff;font:800 18px ' + TF + ';display:flex;align-items:center;justify-content:center;padding:0 8px}.td-ib:active{transform:scale(.94)}' +
    '.td-ttl{flex:1;min-width:0;font-weight:800;font-size:15px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.td-ttl small{display:block;font-weight:600;font-size:11.5px;opacity:.8}' +
    '.td-pill{flex:none;display:flex;align-items:center;gap:3px;padding:6px 9px;border-radius:12px;background:rgba(0,0,0,.28);font-weight:800;font-size:14px;font-variant-numeric:tabular-nums}' +
    '.td-stage{position:relative;flex:1;min-height:0;overflow:hidden}.td-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.td-bar{flex:none;background:#fffaf0;border-top:3px solid #8b5a2b;padding:8px 8px max(8px,env(safe-area-inset-bottom));min-height:72px;z-index:2}' +
    '.td-hint{font-size:13.5px;line-height:1.35;text-align:center;color:#5b3a12;padding:4px 6px}' +
    '.td-row{display:flex;gap:6px;align-items:stretch;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-x}.td-row::-webkit-scrollbar{display:none}' +
    '.td-tw{flex:1 0 66px;min-width:66px;border:0;border-radius:14px;background:#f3e6c4;padding:6px 4px;display:flex;flex-direction:column;align-items:center;gap:1px;font:700 11.5px ' + TF + ';color:#4a3416;box-shadow:inset 0 -3px 0 rgba(0,0,0,.12)}' +
    '.td-tw .e{font-size:26px;line-height:1.1;font-family:' + EF + '}.td-tw b{font-size:12.5px;color:#b45309}.td-tw.no{opacity:.45}.td-tw.lk{opacity:.55;background:#e5e7eb}.td-tw:active{transform:scale(.95)}' +
    '.td-btn{border:0;border-radius:14px;padding:11px 16px;font:800 15px ' + TF + ';color:#fff;background:linear-gradient(180deg,#22c55e,#15803d);box-shadow:0 3px 0 #14532d}.td-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #14532d}' +
    '.td-btn.org{background:linear-gradient(180deg,#fb923c,#ea580c);box-shadow:0 3px 0 #9a3412}.td-btn.red{background:linear-gradient(180deg,#f87171,#dc2626);box-shadow:0 3px 0 #7f1d1d}.td-btn.alt{background:#e7dcc0;color:#4a3416;box-shadow:0 3px 0 #bfae86}' +
    '.td-btn[disabled]{opacity:.45}' +
    '.td-info{display:flex;align-items:center;gap:10px}.td-info .e{font-size:34px;font-family:' + EF + '}.td-info .bd{flex:1;min-width:0;font-size:12.5px;line-height:1.3}.td-info .bd b{font-size:14.5px;display:block}' +
    '.td-mod{position:absolute;inset:0;z-index:5;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(10,20,5,.62)}.td-mod.on{display:flex}' +
    '.td-box{width:100%;max-width:440px;max-height:100%;overflow:auto;background:#fffaf0;border-radius:22px;padding:18px 16px;box-shadow:0 12px 40px rgba(0,0,0,.45);text-align:center}' +
    '.td-box h2{margin:4px 0 6px;font-size:21px;color:#5b3a12}.td-box p{margin:6px 0;font-size:14px;line-height:1.45}.td-box .big{font-size:54px;line-height:1.1;font-family:' + EF + '}' +
    '.td-list{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0;text-align:left}.td-list div{background:#f3e6c4;border-radius:12px;padding:7px 8px;font-size:12px;line-height:1.3}.td-list div.lk{background:#eceff1;color:#6b7280}.td-list i{font-style:normal;font-size:20px;font-family:' + EF + ';margin-right:4px;vertical-align:-3px}' +
    '.td-en{display:flex;justify-content:center;gap:14px;margin:6px 0 2px;font-size:12.5px;font-weight:700}.td-en span{display:flex;flex-direction:column;align-items:center}.td-en i{font-style:normal;font-size:30px;font-family:' + EF + '}' +
    '.td-stars{font-size:38px;letter-spacing:4px;margin:4px 0}.td-stars .off{filter:grayscale(1);opacity:.35}' +
    '.td-gr{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}' +
    '.td-banner{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) scale(.6);opacity:0;pointer-events:none;z-index:4;background:rgba(59,36,16,.9);color:#fde68a;padding:12px 22px;border-radius:18px;font-weight:900;font-size:22px;white-space:nowrap;transition:all .35s cubic-bezier(.2,1.6,.4,1)}.td-banner.on{opacity:1;transform:translate(-50%,-50%) scale(1)}';

  var ov, cv, ctx, bar, mod, banner, elGold, elLife, elWave, elTtl, elSpd, elPause;
  function $(id) { return document.getElementById(id); }
  function build() {
    if (ov) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    ov = document.createElement('div'); ov.id = 'tdOv';
    ov.innerHTML =
      '<div class="td-top"><button class="td-ib" data-a="quit" aria-label="Quay lại">←</button>' +
      '<div class="td-ttl" id="tdTtl">🛡️ Thủ thành</div>' +
      '<span class="td-pill" id="tdLife">❤️ 10</span><span class="td-pill" id="tdGold">🪙 0</span>' +
      '<button class="td-ib" id="tdSpd" data-a="spd" aria-label="Tốc độ">×1</button><button class="td-ib" id="tdPause" data-a="pause" aria-label="Tạm dừng">⏸</button></div>' +
      '<div class="td-stage" id="tdStage"><canvas id="tdCv"></canvas><div class="td-banner" id="tdBan"></div><div class="td-mod" id="tdMod"><div class="td-box" id="tdBox"></div></div></div>' +
      '<div class="td-bar" id="tdBar"></div>';
    document.body.appendChild(ov);
    cv = $('tdCv'); ctx = cv.getContext('2d'); bar = $('tdBar'); mod = $('tdMod'); banner = $('tdBan');
    elGold = $('tdGold'); elLife = $('tdLife'); elTtl = $('tdTtl'); elSpd = $('tdSpd'); elPause = $('tdPause');
    cv.addEventListener('pointerdown', onTap);
    ov.addEventListener('click', onClick);
    window.addEventListener('resize', function () { if (G) resize(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden && G && G.state === 'play' && !G.paused) togglePause(); });
  }

  /* ===== Trạng thái trận ===== */
  var G = null, raf = 0, lastT = 0, DPR = 1, W = 0, H = 0, S0 = 40, OX = 0, OY = 0, BG = null, SPR = {};
  function sfx(k) { try { if (window.sfx) window.sfx(k); } catch (e) {} }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  function makePath(pts) {
    var P = pts.map(function (p) { return { x: p[0] + 0.5, y: p[1] + 0.5 }; }), seg = [], tot = 0, tiles = {};
    for (var i = 0; i < P.length - 1; i++) {
      var a = P[i], b = P[i + 1], L = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
      seg.push({ a: a, b: b, L: L, s: tot });
      var dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y);
      for (var k = 0; k <= L; k++) {
        var cx = Math.floor(a.x + dx * k), cy = Math.floor(a.y + dy * k), key = cx + ',' + cy;
        if (cy >= 0 && cy < BARN && tiles[key] == null) tiles[key] = tot + k;   // khoảng cách tới tâm ô
      }
      tot += L;
    }
    return { pts: P, seg: seg, len: tot, tiles: tiles };
  }
  function posAt(d) {
    var sg = G.path.seg;
    for (var i = 0; i < sg.length; i++) {
      var s = sg[i]; if (d <= s.s + s.L || i === sg.length - 1) { var t = Math.max(0, Math.min(1, (d - s.s) / s.L)); return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t, dx: s.b.x - s.a.x }; }
    }
    return { x: 0, y: 0, dx: 0 };
  }

  function start(o) {
    build();
    o = o || {};
    var k = EN[o.k] ? o.k : 'fox', defs = o.defs || {}, tier = o.tier || 3;
    var nd = (defs.rao ? 1 : 0) + (defs.choi ? 1 : 0) + (defs.cung ? 1 : 0);
    G = {
      k: k, o: o, defs: defs, tier: tier, path: makePath(PATHS[Math.floor(Math.random() * PATHS.length)]),
      gold: 110 + nd * 35, life: 10, life0: 10, wave: 0, waves: WAVES[k], hpMul: 1 + Math.max(0, tier - 3) * 0.3,
      towers: {}, en: [], pr: [], fx: [], spawn: [], state: 'intro', spd: 1, paused: false, sel: null, cd: 0, kills: 0, bearIn: 0, tm: 0,
      animals: (o.animals && o.animals.length ? o.animals : ['🐔', '🐔', '🐄']).slice(0, 8)
    };
    elSpd.textContent = '×1'; elPause.textContent = '⏸';
    elTtl.innerHTML = '🛡️ Thủ thành<small id="tdWave">Đợt 0/' + G.waves.length + '</small>';
    elWave = $('tdWave');
    G.ovf = document.body.style.overflow; ov.classList.add('on'); document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { resize(); hud(); intro(); cancelAnimationFrame(raf); lastT = performance.now(); raf = requestAnimationFrame(loop); });
  }

  function intro() {
    var k = G.k, kinds = {};
    G.waves.forEach(function (w) { w.forEach(function (g) { kinds[g[0]] = 1; }); });
    var lst = TORDER.map(function (id) {
      var T = TW[id], lk = T.need && !G.defs[T.need];
      return '<div class="' + (lk ? 'lk' : '') + '"><i>' + T.e + '</i><b>' + T.n + '</b> · ' + T.c + '🪙<br>' + (lk ? '🔒 Xây ' + NEEDN[T.need] + ' ở nông trại để mở' : T.info) + '</div>';
    }).join('');
    showMod('<div class="big">' + EN[k].e + '</div><h2>Bầy ' + EN[k].n.toLowerCase() + ' đang kéo đến!</h2>' +
      '<p>Thú hoang theo đường mòn từ bìa rừng xuống chuồng trại. Chạm vào ô cỏ để <b>đặt chòi phòng thủ</b>, đừng để chúng chạm tới vật nuôi ❤️.</p>' +
      '<div class="td-en">' + Object.keys(kinds).map(function (e) { return '<span><i>' + EN[e].e + '</i>' + EN[e].n + '</span>'; }).join('') + '</div>' +
      '<div class="td-list">' + lst + '</div>' +
      '<p style="font-size:12.5px;color:#6b7280">Hạ thú được thêm 🪙 xu để xây tiếp. Chạm vào chòi đã đặt để nâng cấp hoặc bán.</p>' +
      '<div class="td-gr"><button class="td-btn alt" data-a="skip">Để rào tự lo</button><button class="td-btn org" data-a="go">⚔️ Vào trận</button></div>');
  }
  function showMod(h) { $('tdBox').innerHTML = h; mod.classList.add('on'); }
  function hideMod() { mod.classList.remove('on'); }
  function ban(t) { banner.textContent = t; banner.classList.add('on'); clearTimeout(ban.t); ban.t = setTimeout(function () { banner.classList.remove('on'); }, 1600); }

  function resize() {
    var stg = $('tdStage'), r = stg.getBoundingClientRect();
    DPR = Math.min(3, window.devicePixelRatio || 1); W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    S0 = Math.floor(Math.min(W / COLS, H / (ROWS + 0.9)));
    OX = Math.round((W - S0 * COLS) / 2); OY = Math.round((H - S0 * (ROWS + 0.9)) / 2 + S0 * 0.9);
    SPR = {}; drawBG();
  }
  /* Emoji vẽ sẵn ra ảnh nhỏ (nét sắc, vẽ nhanh) */
  function spr(e, px) {
    px = Math.round(px); var key = e + px; if (SPR[key]) return SPR[key];
    var c = document.createElement('canvas'), s = Math.ceil(px * 1.3 * DPR); c.width = c.height = s;
    var x = c.getContext('2d'); x.font = Math.round(px * DPR) + 'px ' + EF; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, s / 2, s / 2 + px * DPR * 0.06);
    SPR[key] = c; return c;
  }
  function emo(c, e, x, y, px, flip) {
    var im = spr(e, px), s = im.width / DPR;
    if (flip) { c.save(); c.translate(x, y); c.scale(-1, 1); c.drawImage(im, -s / 2, -s / 2, s, s); c.restore(); }
    else c.drawImage(im, x - s / 2, y - s / 2, s, s);
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function tx(c) { return OX + c * S0; } function ty(r) { return OY + r * S0; }
  function isPath(c, r) { return G.path.tiles[c + ',' + r] != null; }

  /* Nền: cỏ, hoa, đường mòn, bìa rừng, chuồng trại (vẽ 1 lần) */
  function drawBG() {
    BG = document.createElement('canvas'); BG.width = cv.width; BG.height = cv.height;
    var c = BG.getContext('2d'); c.scale(DPR, DPR);
    var R = mulberry(7 + G.path.len * 13);
    c.fillStyle = '#2d5a1b'; c.fillRect(0, 0, W, H);
    for (var r = 0; r < BARN; r++) for (var q = 0; q < COLS; q++) {
      c.fillStyle = (r + q) % 2 ? '#6cbf45' : '#64b53e'; c.fillRect(tx(q), ty(r), S0, S0);
      for (var n = 0; n < 5; n++) { c.fillStyle = 'rgba(40,90,20,.22)'; c.fillRect(tx(q) + R() * S0, ty(r) + R() * S0, 2, 5); }
    }
    // đường mòn
    var P = G.path.pts;
    function poly(w, col, dash) {
      c.beginPath(); c.moveTo(tx(P[0].x), ty(P[0].y - 0.6));
      P.forEach(function (p) { c.lineTo(tx(p.x), ty(p.y)); });
      c.lineWidth = w; c.strokeStyle = col; c.lineJoin = 'round'; c.lineCap = 'round'; c.setLineDash(dash || []); c.stroke(); c.setLineDash([]);
    }
    poly(S0 * 0.92, '#7a5230'); poly(S0 * 0.78, '#c8a26a'); poly(S0 * 0.5, '#d4b07a'); poly(S0 * 0.08, 'rgba(120,80,40,.35)', [S0 * 0.12, S0 * 0.5]);
    // hoa, đá trang trí
    var deco = ['🌼', '🌸', '🍀', '🪨', '🌷', '🍄'];
    for (r = 0; r < BARN; r++) for (q = 0; q < COLS; q++) {
      if (isPath(q, r) || R() > 0.32) continue;
      var e = deco[Math.floor(R() * deco.length)];
      c.globalAlpha = 0.85; emo(c, e, tx(q) + S0 * (0.2 + R() * 0.6), ty(r) + S0 * (0.2 + R() * 0.6), S0 * 0.24); c.globalAlpha = 1;
    }
    // bìa rừng phía trên
    var g = c.createLinearGradient(0, 0, 0, OY); g.addColorStop(0, '#0f2a0a'); g.addColorStop(1, '#24501a');
    c.fillStyle = g; c.fillRect(0, 0, W, OY);
    for (var i = -1; i < COLS * 2 + 2; i++) {
      var x = OX + i * S0 / 2 + (i % 2) * S0 * 0.2, y = OY - S0 * 0.25 - (i % 3) * S0 * 0.12;
      if (Math.abs(x - tx(P[0].x)) < S0 * 0.45) continue;
      emo(c, i % 3 ? '🌲' : '🌳', x, y, S0 * (0.75 + (i % 3) * 0.12));
    }
    // chuồng trại phía dưới
    var by = ty(BARN), bh = H - by;
    c.fillStyle = '#a8d672'; c.fillRect(0, by, W, bh);
    c.fillStyle = '#c8a26a'; c.fillRect(tx(3) + S0 * 0.11, by, S0 * 0.78, S0 * 0.55);
    // hàng rào
    c.strokeStyle = '#7a5032'; c.lineWidth = Math.max(2, S0 * 0.06);
    c.beginPath(); c.moveTo(0, by + S0 * 0.18); c.lineTo(tx(3), by + S0 * 0.18); c.moveTo(tx(4), by + S0 * 0.18); c.lineTo(W, by + S0 * 0.18);
    c.moveTo(0, by + S0 * 0.36); c.lineTo(tx(3), by + S0 * 0.36); c.moveTo(tx(4), by + S0 * 0.36); c.lineTo(W, by + S0 * 0.36); c.stroke();
    for (x = S0 * 0.2; x < W; x += S0 * 0.42) { if (x > tx(3) - 4 && x < tx(4) + 4) continue; c.fillStyle = '#8b5a2b'; c.fillRect(x, by + S0 * 0.05, S0 * 0.08, S0 * 0.42); }
    // nhà kho đỏ
    var bx = tx(3) + S0 / 2, bw = S0 * 1.3, bt = by + S0 * 0.42, bhh = S0 * 0.56;
    c.fillStyle = '#b91c1c'; c.fillRect(bx - bw / 2, bt, bw, bhh);
    c.fillStyle = '#7f1d1d'; c.beginPath(); c.moveTo(bx - bw / 2 - 5, bt + 2); c.lineTo(bx, bt - S0 * 0.3); c.lineTo(bx + bw / 2 + 5, bt + 2); c.closePath(); c.fill();
    c.fillStyle = '#fef3c7'; c.fillRect(bx - S0 * 0.2, bt + S0 * 0.14, S0 * 0.4, bhh - S0 * 0.14);
    c.strokeStyle = '#b91c1c'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - S0 * 0.2, bt + S0 * 0.14); c.lineTo(bx + S0 * 0.2, bt + bhh); c.moveTo(bx + S0 * 0.2, bt + S0 * 0.14); c.lineTo(bx - S0 * 0.2, bt + bhh); c.stroke();
  }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ===== Điều khiển ===== */
  function onTap(e) {
    if (!G || G.state === 'intro' || G.state === 'end') return;
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    var q = Math.floor((x - OX) / S0), w = Math.floor((y - OY) / S0);
    if (q < 0 || q >= COLS || w < 0 || w >= BARN) { G.sel = null; panel(); return; }
    G.sel = { c: q, r: w }; panel();
  }
  function onClick(e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null; if (!el || !G) return;
    var a = el.getAttribute('data-a');
    if (a === 'go') { hideMod(); G.state = 'build'; G.cd = 0; panel(); ban('Đặt chòi rồi bấm ▶ Bắt đầu'); }
    else if (a === 'skip') { hideMod(); finish({ skip: true }); }
    else if (a === 'quit') {
      if (G.state === 'end') { closeOv(); return; }
      if (G.state === 'intro') { hideMod(); finish({ skip: true }); return; }
      if (!G.paused) togglePause();
      showMod('<div class="big">🏳️</div><h2>Rời trận?</h2><p>Nếu rời trận bây giờ, nông trại chỉ còn trông vào hàng rào và các chòi đã xây ở nông trại (giống như không ai canh gác).</p><div class="td-gr"><button class="td-btn alt" data-a="resume">Chơi tiếp</button><button class="td-btn red" data-a="skip">Rời trận</button></div>');
    }
    else if (a === 'resume') { hideMod(); if (G.paused) togglePause(); }
    else if (a === 'pause') { if (G.state === 'play' || G.state === 'build') { togglePause(); if (G.paused) showMod('<div class="big">⏸</div><h2>Tạm dừng</h2><div class="td-gr"><button class="td-btn" data-a="resume">▶ Chơi tiếp</button></div>'); else hideMod(); } }
    else if (a === 'spd') { G.spd = G.spd === 1 ? 2 : 1; elSpd.textContent = '×' + G.spd; }
    else if (a === 'wave') nextWave();
    else if (a === 'put') put(el.getAttribute('data-t'));
    else if (a === 'up') upgrade();
    else if (a === 'sell') sell();
    else if (a === 'desel') { G.sel = null; panel(); }
    else if (a === 'home') closeOv();
  }
  function togglePause() { G.paused = !G.paused; elPause.textContent = G.paused ? '▶' : '⏸'; }
  function key(c, r) { return c + ',' + r; }

  function panel() {
    var h = '';
    if (G.state === 'end') { bar.innerHTML = ''; return; }
    var s = G.sel, T0 = s && G.towers[key(s.c, s.r)];
    if (s && T0) {
      var T = TW[T0.t], lv = T0.lv, uc = lv < 3 ? upCost(T, lv) : 0, sv = Math.round(T0.spent * 0.6);
      var stat = T.hp ? 'Độ bền ' + Math.ceil(T0.hp) + '/' + T.hp[lv - 1] : 'Sát thương ' + Math.round(T.d * DMUL[lv - 1]) + ' · Tầm ' + (T.r + RADD[lv - 1] + (T0.aura || 0)).toFixed(1) + ' ô';
      h = '<div class="td-info"><span class="e">' + T.e + '</span><div class="bd"><b>' + T.n + ' · cấp ' + lv + ' ' + '⭐'.repeat(lv) + '</b>' + stat + '</div>' +
        (lv < 3 ? '<button class="td-btn org" data-a="up"' + (G.gold < uc ? ' disabled' : '') + '>⬆ ' + uc + '🪙</button>' : '') +
        '<button class="td-btn alt" data-a="sell">Bán +' + sv + '</button></div>';
    } else if (s) {
      var onP = isPath(s.c, s.r);
      h = '<div class="td-row">' + TORDER.filter(function (id) { return !!TW[id].path === onP; }).map(function (id) {
        var T = TW[id], lk = T.need && !G.defs[T.need];
        return '<button class="td-tw' + (lk ? ' lk' : G.gold < T.c ? ' no' : '') + '" data-a="put" data-t="' + id + '"><span class="e">' + (lk ? '🔒' : T.e) + '</span>' + T.n + '<b>' + (lk ? 'Chưa mở' : T.c + '🪙') + '</b></button>';
      }).join('') + '<button class="td-tw" data-a="desel"><span class="e">✖️</span>Đóng<b>&nbsp;</b></button></div>';
      if (onP && !G.defs.rao) h += '<div class="td-hint" style="padding-top:6px">Ô này là đường mòn. Xây 🪵 Hàng rào ở nông trại để được đặt rào chắn.</div>';
    } else if (G.state === 'build') {
      h = '<div class="td-info"><span class="e">' + (G.wave ? '✅' : '🗺️') + '</span><div class="bd"><b>' + (G.wave ? 'Đã chặn đợt ' + G.wave + '!' : 'Chuẩn bị phòng thủ') + '</b>Chạm vào ô cỏ để đặt chòi.' + (G.wave ? ' Đợt sau tự đến sau <span id="tdCd">' + Math.ceil(G.cd) + '</span> giây.' : '') + '</div>' +
        '<button class="td-btn" data-a="wave">▶ ' + (G.wave ? 'Gọi đợt ' + (G.wave + 1) + (G.wave ? ' +15🪙' : '') : 'Bắt đầu') + '</button></div>';
    } else {
      h = '<div class="td-hint">⚔️ Đợt ' + G.wave + '/' + G.waves.length + ' đang tấn công! Chạm vào ô cỏ để đặt thêm chòi.</div>';
    }
    bar.innerHTML = h;
  }
  function hud() {
    elGold.textContent = '🪙 ' + G.gold; elLife.textContent = '❤️ ' + G.life;
    if (elWave) elWave.textContent = 'Bầy ' + EN[G.k].n.toLowerCase() + ' · đợt ' + G.wave + '/' + G.waves.length;
  }
  function auraOf(c, r) {
    var b = 0;
    for (var k in G.towers) { var t = G.towers[k]; if (t.t !== 'watch') continue; if (Math.hypot(t.c - c, t.r - r) <= TW.watch.aura && !(t.c === c && t.r === r)) b = Math.max(b, 0.2); }
    return b;
  }
  function recalcAura() { for (var k in G.towers) { var t = G.towers[k]; if (TW[t.t].r) t.aura = (TW[t.t].r + RADD[t.lv - 1]) * auraOf(t.c, t.r); } }
  function put(id) {
    var s = G.sel, T = TW[id]; if (!s || G.towers[key(s.c, s.r)]) return;
    if (T.need && !G.defs[T.need]) { ban('🔒 Xây ' + NEEDN[T.need] + ' ở nông trại'); return; }
    if (G.gold < T.c) { ban('Chưa đủ 🪙 xu'); sfx('bad'); return; }
    G.gold -= T.c;
    G.towers[key(s.c, s.r)] = { t: id, c: s.c, r: s.r, lv: 1, cd: 0, spent: T.c, hp: T.hp ? T.hp[0] : 0, ang: 0, aura: 0, kick: 0 };
    recalcAura(); puff(s.c + 0.5, s.r + 0.5, '#fde68a'); buzz(15);
    hud(); panel();
  }
  function upgrade() {
    var s = G.sel, t = s && G.towers[key(s.c, s.r)]; if (!t || t.lv >= 3) return;
    var T = TW[t.t], c = upCost(T, t.lv); if (G.gold < c) return;
    G.gold -= c; t.spent += c; t.lv++; if (T.hp) t.hp = T.hp[t.lv - 1];
    recalcAura(); puff(t.c + 0.5, t.r + 0.5, '#facc15'); sfx('ok'); hud(); panel();
  }
  function sell() {
    var s = G.sel, k0 = s && key(s.c, s.r), t = G.towers[k0]; if (!t) return;
    G.gold += Math.round(t.spent * 0.6); delete G.towers[k0]; recalcAura(); G.sel = null; hud(); panel();
  }
  function nextWave() {
    if (G.state !== 'build' || G.wave >= G.waves.length) return;
    if (G.wave && G.cd > 1) { G.gold += 15; }
    G.wave++; G.state = 'play'; G.sel = null;
    var t = 0.5, list = [];
    G.waves[G.wave - 1].forEach(function (g) { for (var i = 0; i < g[1]; i++) { list.push({ t: g[0], at: t }); t += g[2]; } t += 1.2; });
    G.spawn = list; G.wt = 0;
    ban('Đợt ' + G.wave + ': ' + G.waves[G.wave - 1].map(function (g) { return g[1] + ' ' + EN[g[0]].e; }).join(' + '));
    hud(); panel();
  }

  /* ===== Mô phỏng ===== */
  function spawnOne(t) {
    var E = EN[t], hp = Math.round(E.hp * G.hpMul * (1 + 0.1 * (G.wave - 1)));
    G.en.push({ t: t, d: -0.6, hp: hp, max: hp, slow: 0, x: 0, y: 0, dx: 0, bob: Math.random() * 6, hit: 0, wait: 0 });
  }
  function step(dt) {
    G.tm += dt;
    if (G.state === 'build' && G.wave) { G.cd -= dt; var ce = $('tdCd'); if (ce) ce.textContent = Math.max(0, Math.ceil(G.cd)); if (G.cd <= 0) nextWave(); }
    if (G.state === 'play') {
      G.wt += dt;
      while (G.spawn.length && G.spawn[0].at <= G.wt) spawnOne(G.spawn.shift().t);
    }
    // thú di chuyển
    for (var i = G.en.length - 1; i >= 0; i--) {
      var e = G.en[i], E = EN[e.t], sp = E.spd * (e.slow > 0 ? 0.55 : 1);
      e.slow -= dt; e.hit -= dt; e.bob += dt * 9;
      var nd = e.d + sp * dt, blk = null;
      for (var k in G.towers) {
        var tw = G.towers[k]; if (tw.t !== 'fence') continue;
        var td = G.path.tiles[k]; if (td == null) continue;
        var front = td - 0.42;
        if (e.d <= front + 0.001 && nd >= front) { blk = tw; nd = front; break; }
      }
      e.d = nd;
      if (blk) {
        e.wait += dt; blk.hp -= E.bite * dt; blk.kick = 0.15;
        if (e.wait > 0.4) { e.wait = 0; puff(blk.c + 0.5, blk.r + 0.5, '#a16207', 3); }
        if (blk.hp <= 0) { delete G.towers[key(blk.c, blk.r)]; puff(blk.c + 0.5, blk.r + 0.5, '#7a5032', 10); text(blk.c + 0.5, blk.r + 0.3, 'Rào vỡ!', '#fca5a5'); if (G.sel && G.sel.c === blk.c && G.sel.r === blk.r) { G.sel = null; panel(); } }
      }
      var p = posAt(e.d); e.x = p.x; e.y = p.y; if (p.dx) e.dx = p.dx;
      if (e.d >= G.path.len - 0.1) {
        G.en.splice(i, 1); G.life = Math.max(0, G.life - E.life); if (e.t === 'bear') G.bearIn++;
        text(3.5, BARN + 0.2, '−' + E.life + '❤️', '#fecaca'); sfx('bad'); buzz(60); G.shake = 0.3; hud();
        if (G.life <= 0) { endGame(false); return; }
      }
    }
    // chòi bắn
    for (k in G.towers) {
      var t = G.towers[k], T = TW[t.t]; if (!T.r) continue;
      t.cd -= dt; t.kick = Math.max(0, t.kick - dt);
      if (t.cd > 0) continue;
      var rng = T.r + RADD[t.lv - 1] + (t.aura || 0), cx = t.c + 0.5, cy = t.r + 0.5, best = null;
      if (t.t === 'dog') {
        var any = false;
        G.en.slice().forEach(function (e2) { if (Math.hypot(e2.x - cx, e2.y - cy) <= rng) { any = true; e2.slow = 1.3; hurt(e2, T.d * DMUL[t.lv - 1]); } });
        if (any) { t.cd = T.cd; t.kick = 0.25; G.fx.push({ k: 'ring', x: cx, y: cy, r: rng, t: 0, d: 0.45 }); }
        continue;
      }
      G.en.forEach(function (e2) { if (Math.hypot(e2.x - cx, e2.y - cy) <= rng && (!best || e2.d > best.d)) best = e2; });
      if (best) {
        t.cd = T.cd; t.kick = 0.18; t.ang = Math.atan2(best.y - cy, best.x - cx);
        G.pr.push({ k: T.pk, x: cx, y: cy - 0.2, tg: best, sp: T.ps, dmg: T.d * DMUL[t.lv - 1] * (T.bear && best.t === 'bear' ? T.bear : 1), ang: t.ang, lx: best.x, ly: best.y });
      }
    }
    // đạn bay
    for (i = G.pr.length - 1; i >= 0; i--) {
      var b = G.pr[i], alive = G.en.indexOf(b.tg) >= 0;
      if (alive) { b.lx = b.tg.x; b.ly = b.tg.y; }
      var dx = b.lx - b.x, dy = b.ly - b.y, dd = Math.hypot(dx, dy), mv = b.sp * dt;
      b.ang = Math.atan2(dy, dx);
      if (dd <= mv) { G.pr.splice(i, 1); if (alive) hurt(b.tg, b.dmg); puff(b.lx, b.ly, b.k === 'stone' ? '#9ca3af' : '#fde68a', 4); continue; }
      b.x += dx / dd * mv; b.y += dy / dd * mv;
    }
    // hiệu ứng
    for (i = G.fx.length - 1; i >= 0; i--) { var f = G.fx[i]; f.t += dt; if (f.vx != null) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 3 * dt; } if (f.t >= f.d) G.fx.splice(i, 1); }
    if (G.shake) G.shake = Math.max(0, G.shake - dt);
    // hết đợt
    if (G.state === 'play' && !G.spawn.length && !G.en.length) {
      var bonus = 20 + 5 * G.wave; G.gold += bonus;
      if (G.wave >= G.waves.length) { endGame(true); return; }
      G.state = 'build'; G.cd = 10; ban('✅ Chặn xong đợt ' + G.wave + ' · +' + bonus + '🪙'); sfx('ok'); hud(); panel();
    }
  }
  function hurt(e, d) {
    e.hp -= d; e.hit = 0.12;
    if (e.hp <= 0 && G.en.indexOf(e) >= 0) {
      G.en.splice(G.en.indexOf(e), 1); var gd = EN[e.t].gold; G.gold += gd; G.kills++;
      text(e.x, e.y - 0.3, '+' + gd + '🪙', '#fde68a'); puff(e.x, e.y, '#fef3c7', 8); hud();
      if (G.sel && !G.towers[key(G.sel.c, G.sel.r)]) panel(); else if (G.sel) panelSoft();
    }
  }
  function panelSoft() { /* cập nhật nút nâng cấp khi đủ tiền */ var b = bar.querySelector('[data-a="up"]'), t = G.sel && G.towers[key(G.sel.c, G.sel.r)]; if (b && t) b.disabled = G.gold < upCost(TW[t.t], t.lv); bar.querySelectorAll('.td-tw[data-t]').forEach(function (el) { var T = TW[el.getAttribute('data-t')]; if (!(T.need && !G.defs[T.need])) el.classList.toggle('no', G.gold < T.c); }); }
  function puff(x, y, col, n) { n = n || 6; for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = 0.6 + Math.random() * 1.4; G.fx.push({ k: 'p', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6, t: 0, d: 0.45 + Math.random() * 0.3, c: col }); } }
  function text(x, y, s, col) { G.fx.push({ k: 't', x: x, y: y, s: s, c: col, t: 0, d: 1 }); }

  /* ===== Vẽ ===== */
  function draw() {
    var c = ctx; c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(BG, 0, 0);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (G.shake) c.translate((Math.random() - 0.5) * 6 * G.shake / 0.3, 0);
    var s = S0;
    // vật nuôi trong chuồng
    var by = ty(BARN), slots = [0.6, 1.5, 2.3, 4.7, 5.5, 6.4, 1.05, 5.95], alive = Math.ceil(G.animals.length * G.life / G.life0);
    for (var i = 0; i < G.animals.length; i++) {
      var ax = OX + slots[i] * s, ay = by + s * 0.7 + (i >= 6 ? s * 0.2 : 0) + Math.sin(G.tm * 3 + i) * 1.5;
      c.globalAlpha = i < alive ? 1 : 0.22; emo(c, G.animals[i], ax, ay, s * 0.42); c.globalAlpha = 1;
    }
    // ô đang chọn
    if (G.sel) {
      var sx = tx(G.sel.c), sy = ty(G.sel.r), T0 = G.towers[key(G.sel.c, G.sel.r)];
      c.strokeStyle = '#fff'; c.lineWidth = 3; c.setLineDash([6, 4]); rr(c, sx + 2, sy + 2, s - 4, s - 4, 8); c.stroke(); c.setLineDash([]);
      if (T0 && TW[T0.t].r) { var rg = (TW[T0.t].r + RADD[T0.lv - 1] + (T0.aura || 0)) * s; c.fillStyle = 'rgba(255,255,255,.14)'; c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; c.beginPath(); c.arc(sx + s / 2, sy + s / 2, rg, 0, 7); c.fill(); c.stroke(); }
    }
    // chòi & rào (vẽ theo hàng để chồng lớp đúng)
    var keys = Object.keys(G.towers).sort(function (a, b) { return G.towers[a].r - G.towers[b].r; });
    keys.forEach(function (k) { drawTower(c, G.towers[k]); });
    // thú hoang
    G.en.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (e) {
      var E = EN[e.t], x = tx(e.x), y = ty(e.y) + Math.sin(e.bob) * s * 0.03, z = s * E.sz;
      c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x, ty(e.y) + z * 0.42, z * 0.38, z * 0.12, 0, 0, 7); c.fill();
      if (e.slow > 0) { c.strokeStyle = 'rgba(96,165,250,.85)'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, ty(e.y) + z * 0.42, z * 0.46, z * 0.16, 0, 0, 7); c.stroke(); }
      if (e.hit > 0) c.globalAlpha = 0.6;
      emo(c, E.e, x, y, z, e.dx > 0);
      c.globalAlpha = 1;
      if (e.hp < e.max) { var bw = z * 0.8; c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(x - bw / 2 - 1, y - z * 0.62 - 1, bw + 2, 6); c.fillStyle = e.hp / e.max > 0.5 ? '#22c55e' : e.hp / e.max > 0.25 ? '#f59e0b' : '#ef4444'; c.fillRect(x - bw / 2, y - z * 0.62, bw * Math.max(0, e.hp / e.max), 4); }
    });
    // đạn
    G.pr.forEach(function (b) {
      var x = tx(b.x), y = ty(b.y);
      if (b.k === 'stone') { c.fillStyle = '#6b7280'; c.beginPath(); c.arc(x, y, s * 0.07, 0, 7); c.fill(); c.fillStyle = '#d1d5db'; c.beginPath(); c.arc(x - 1, y - 1, s * 0.03, 0, 7); c.fill(); }
      else {
        c.save(); c.translate(x, y); c.rotate(b.ang); var L = b.k === 'spear' ? s * 0.42 : s * 0.34;
        c.strokeStyle = b.k === 'spear' ? '#78350f' : '#a16207'; c.lineWidth = b.k === 'spear' ? 3 : 2; c.beginPath(); c.moveTo(-L, 0); c.lineTo(0, 0); c.stroke();
        c.fillStyle = '#e5e7eb'; c.beginPath(); c.moveTo(4, 0); c.lineTo(-4, -3.5); c.lineTo(-4, 3.5); c.closePath(); c.fill();
        if (b.k === 'arrow') { c.fillStyle = '#ef4444'; c.fillRect(-L, -2.5, 5, 5); }
        c.restore();
      }
    });
    // hiệu ứng
    G.fx.forEach(function (f) {
      var a = 1 - f.t / f.d;
      if (f.k === 'p') { c.globalAlpha = a; c.fillStyle = f.c; c.beginPath(); c.arc(tx(f.x), ty(f.y), s * 0.05 * (0.5 + a), 0, 7); c.fill(); }
      else if (f.k === 't') { c.globalAlpha = Math.min(1, a * 2); c.font = '900 ' + Math.round(s * 0.3) + 'px ' + TF; c.textAlign = 'center'; c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,.6)'; c.strokeText(f.s, tx(f.x), ty(f.y - f.t * 0.6)); c.fillStyle = f.c; c.fillText(f.s, tx(f.x), ty(f.y - f.t * 0.6)); }
      else if (f.k === 'ring') { c.globalAlpha = a * 0.8; c.strokeStyle = '#93c5fd'; c.lineWidth = 3; c.beginPath(); c.arc(tx(f.x), ty(f.y), f.r * s * (0.4 + 0.6 * f.t / f.d), 0, 7); c.stroke(); }
    });
    c.globalAlpha = 1;
    // trời chạng vạng phía rừng
    var g = c.createLinearGradient(0, 0, 0, H * 0.45); g.addColorStop(0, 'rgba(30,20,60,.35)'); g.addColorStop(1, 'rgba(30,20,60,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * 0.45);
    if (G.state === 'build' && !G.wave) {   // mũi tên chỉ hướng thú đến
      var p0 = G.path.pts[0], ay2 = ty(0.2) + Math.sin(G.tm * 5) * 4;
      c.font = '900 ' + Math.round(s * 0.5) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('⬇️', tx(p0.x), ay2);
    }
  }
  function drawTower(c, t) {
    var T = TW[t.t], s = S0, x = tx(t.c) + s / 2, y = ty(t.r) + s / 2, k = t.kick > 0 ? Math.sin(t.kick * 40) * 1.5 : 0;
    if (t.t === 'fence') {
      var hp = t.hp / T.hp[t.lv - 1];
      c.save(); c.translate(x + k, y);
      c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, s * 0.3, s * 0.42, s * 0.1, 0, 0, 7); c.fill();
      for (var i = -2; i <= 2; i++) { c.fillStyle = i % 2 ? '#92400e' : '#a16207'; rr(c, i * s * 0.16 - s * 0.06, -s * 0.32, s * 0.12, s * 0.62, 3); c.fill(); c.fillStyle = '#78350f'; c.beginPath(); c.moveTo(i * s * 0.16 - s * 0.06, -s * 0.32); c.lineTo(i * s * 0.16, -s * 0.42); c.lineTo(i * s * 0.16 + s * 0.06, -s * 0.32); c.fill(); }
      c.fillStyle = '#7c2d12'; c.fillRect(-s * 0.42, -s * 0.16, s * 0.84, s * 0.08); c.fillRect(-s * 0.42, s * 0.1, s * 0.84, s * 0.08);
      if (hp < 0.5) { c.strokeStyle = '#1c1917'; c.lineWidth = 2; c.beginPath(); c.moveTo(-s * 0.2, -s * 0.25); c.lineTo(-s * 0.05, 0); c.lineTo(-s * 0.15, s * 0.2); c.stroke(); }
      c.restore();
      c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(x - s * 0.36, y - s * 0.5, s * 0.72, 5); c.fillStyle = hp > 0.5 ? '#a3e635' : '#f97316'; c.fillRect(x - s * 0.36 + 1, y - s * 0.5 + 1, (s * 0.72 - 2) * Math.max(0, hp), 3);
      stars(c, x, y + s * 0.42, t.lv);
      return;
    }
    // bệ gỗ
    c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(x, y + s * 0.3, s * 0.4, s * 0.12, 0, 0, 7); c.fill();
    var col = { farmer: '#a16207', dog: '#b45309', watch: '#78350f', archer: '#7f1d1d' }[t.t];
    if (t.t === 'watch' || t.t === 'archer') {
      c.strokeStyle = '#5b3a17'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - s * 0.3, y + s * 0.3); c.lineTo(x - s * 0.2, y - s * 0.12); c.moveTo(x + s * 0.3, y + s * 0.3); c.lineTo(x + s * 0.2, y - s * 0.12); c.moveTo(x - s * 0.26, y + s * 0.18); c.lineTo(x + s * 0.22, y - s * 0.04); c.stroke();
      c.fillStyle = col; rr(c, x - s * 0.34, y - s * 0.22, s * 0.68, s * 0.16, 4); c.fill();
      c.fillStyle = t.t === 'archer' ? '#991b1b' : '#92400e'; c.beginPath(); c.moveTo(x - s * 0.4, y - s * 0.42); c.lineTo(x, y - s * 0.66); c.lineTo(x + s * 0.4, y - s * 0.42); c.closePath(); c.fill();
      emo(c, t.t === 'archer' ? '🏹' : '👀', x + k, y - s * 0.32, s * 0.3);
      if (t.t === 'archer') { c.save(); c.translate(x + s * 0.3, y - s * 0.62); c.rotate(-0.4 + Math.sin(G.tm * 3) * 0.12); emo(c, '🚩', 0, 0, s * 0.22); c.restore(); }
    } else {
      c.fillStyle = col; c.beginPath(); c.ellipse(x, y + s * 0.18, s * 0.38, s * 0.18, 0, 0, 7); c.fill();
      c.fillStyle = '#d97706'; c.beginPath(); c.ellipse(x, y + s * 0.12, s * 0.34, s * 0.14, 0, 0, 7); c.fill();
      emo(c, T.e, x + k, y - s * 0.08 - (t.kick > 0 ? s * 0.05 : 0), s * 0.56, t.t === 'farmer' && Math.cos(t.ang) > 0);
    }
    stars(c, x, y + s * 0.42, t.lv);
  }
  function stars(c, x, y, n) { if (n < 2) return; c.font = '800 ' + Math.round(S0 * 0.2) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('⭐'.repeat(n), x, y); }

  function loop(now) {
    if (!G) return;
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now;
    if (!G.paused && G.state !== 'intro' && G.state !== 'end') { var n = G.spd; for (var i = 0; i < n; i++) { step(dt); if (!G || G.state === 'end') break; } }
    if (G) { draw(); raf = requestAnimationFrame(loop); }
  }

  /* ===== Kết thúc ===== */
  function endGame(win) {
    G.state = 'end'; G.sel = null; panel();
    var lostL = G.life0 - G.life, stars = win ? (lostL === 0 ? 3 : lostL <= 3 ? 2 : 1) : 0;
    G.res = { win: win, stars: stars, livesLost: lostL, bearIn: G.bearIn, kills: G.kills, k: G.k };
    sfx(win ? 'win' : 'bad');
    var st = '<div class="td-stars">' + [1, 2, 3].map(function (i) { return '<span class="' + (i <= stars ? '' : 'off') + '">⭐</span>'; }).join('') + '</div>';
    showMod('<div class="big">' + (win ? '🏆' : EN[G.k].e) + '</div><h2>' + (win ? 'Thủ thành thành công!' : 'Bầy thú đã tràn vào chuồng!') + '</h2>' + (win ? st : '') +
      '<p>Hạ được <b>' + G.kills + '</b> con thú hoang. ' + (win ? (lostL ? 'Có ' + lostL + ' lần thú lọt tới chuồng trại.' : 'Không con nào chạm được tới chuồng trại! 🎉') : 'Nông trại giờ chỉ còn trông vào hàng rào và các chòi đã xây.') + '</p>' +
      (win ? '<p style="font-size:13px;color:#15803d">Phần thưởng kinh nghiệm và tiền được cộng vào nông trại.</p>' : '<p style="font-size:13px">💡 Mẹo: đặt chòi ở khúc quanh của đường mòn để bắn được lâu hơn, nâng cấp chòi ⭐, và xây thêm công trình bảo vệ ở nông trại để mở chòi mạnh hơn.</p>') +
      '<div class="td-gr"><button class="td-btn" data-a="home">Về nông trại</button></div>');
  }
  function finish(r) { if (!G) return; G.res = r; closeOv(); }
  function closeOv() {
    if (!G) return;
    var r = G.res || { skip: true }, cb = G.o.onEnd, ovf = G.ovf || '';
    cancelAnimationFrame(raf); hideMod(); ov.classList.remove('on'); document.body.style.overflow = ovf; G = null;
    try { if (cb) cb(r); } catch (e) { console.error(e); }
  }

  window.FarmTD = { start: start, ver: 'td1', _g: function () { return G; }, _step: function (dt) { if (G && G.state !== 'end') step(dt); } };
})();
