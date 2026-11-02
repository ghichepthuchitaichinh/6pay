/* 6PAY - Game "Xếp kẹo từ vựng" (tiếng Anh & tiếng Trung).
   Luật chơi kiểu xếp kẹo: đổi chỗ 2 viên kẹo cạnh nhau để có hàng 3 viên giống nhau trở lên.
   Mỗi viên kẹo là 1 từ vựng. Ăn viên nào, app đọc từ đó và hiện chữ + nghĩa tiếng Việt ở dưới cùng.
   Kẹo đặc biệt:  hàng 4 → kẹo sọc (phá cả hàng / cả cột) · hình chữ L, T → kẹo gói (nổ 3×3)
                  hàng 5 → kẹo cầu vồng (đổi với viên nào thì xoá hết loại đó).
   Dữ liệu từ vựng lấy từ words.js (tiếng Anh) và chinese.js (tiếng Trung): mỗi chủ đề là 1 hòn đảo gồm 3 màn.
   File này được index.html tải về khi người dùng mở trò chơi. */
(function () {
  if (window.SixMatchGame) return;

  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var TF = '-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  var N = 8;                                   // bàn 8 × 8
  var STAR_PRICE = 10000;                      // mỗi sao khi qua màn: +10.000đ vào Nông trại
  var COLORS = ['#ff4d6d', '#ff9f1c', '#ffd23f', '#2ec27e', '#3a86ff', '#a259ff'];
  var COMBO = ['', '', 'Great!', 'Super!', 'Awesome!', 'Fantastic!', 'Amazing!', 'Unbelievable!'];

  /* ================= TIỆN ÍCH ================= */
  function $(id) { return document.getElementById(id); }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffle(a, r) { r = r || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function money(n) { return Math.abs(n).toLocaleString('vi-VN') + 'đ'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function soundOn() { try { return localStorage.getItem('6pay-sound-v1') !== '0'; } catch (e) { return true; } }
  function getB(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v === '1'; } catch (e) { return d; } }
  function setB(k, v) { try { localStorage.setItem(k, v ? '1' : '0'); } catch (e) {} }
  function shade(hex, f) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function m(c) { return Math.max(0, Math.min(255, Math.round(f > 0 ? c + (255 - c) * f : c * (1 + f)))); }
    return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')'; }

  /* ================= ÂM THANH (tự tạo, không cần file) ================= */
  var AC = null, master = null;
  function ac() {
    if (!soundOn()) return null;
    try {
      if (!AC) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; AC = new A(); master = AC.createGain(); master.gain.value = 0.9; master.connect(AC.destination); }
      if (AC.state === 'suspended') AC.resume();
      return AC;
    } catch (e) { return null; }
  }
  function tone(f, t, d, type, vol, to, dest) {
    var c = AC, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + d + 0.05);
  }
  var NOISE = null;
  function noise(t, d, f0, f1, vol, q) {
    var c = AC;
    if (!NOISE) { NOISE = c.createBuffer(1, c.sampleRate * 1, c.sampleRate); var x = NOISE.getChannelData(0); for (var i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; }
    var s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = NOISE; fl.type = 'bandpass'; fl.Q.value = q || 1.2; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(master); s.start(t); s.stop(t + d + 0.05);
  }
  var PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];
  function sfx(k, n) {
    var c = ac(); if (!c) return;
    try {
      var t = c.currentTime + 0.01;
      if (k === 'swap') noise(t, 0.16, 600, 2400, 0.18, 0.8);
      else if (k === 'bad') { tone(220, t, 0.12, 'square', 0.06, 200); tone(180, t + 0.13, 0.16, 'square', 0.06, 150); }
      else if (k === 'select') tone(880, t, 0.07, 'sine', 0.08, 1200);
      else if (k === 'pop') {           // ăn kẹo: tiếng "pop" cao dần theo chuỗi combo
        var f = PENTA[Math.min(PENTA.length - 1, (n || 1) - 1)];
        tone(f, t, 0.18, 'triangle', 0.2, f * 1.5); tone(f * 2, t + 0.03, 0.12, 'sine', 0.06);
        noise(t, 0.07, 2000, 5000, 0.08, 2);
      }
      else if (k === 'make') { [0, 2, 4, 7].forEach(function (s, i) { tone(PENTA[s] * 1.5, t + i * 0.06, 0.22, 'sine', 0.1); }); }
      else if (k === 'line') { tone(1600, t, 0.35, 'sawtooth', 0.06, 180); noise(t, 0.3, 4000, 600, 0.12, 0.7); }
      else if (k === 'boom') { tone(140, t, 0.45, 'sine', 0.35, 40); noise(t, 0.4, 900, 120, 0.3, 0.6); }
      else if (k === 'rainbow') { for (var i = 0; i < 10; i++) tone(PENTA[i], t + i * 0.035, 0.3, 'sine', 0.08); noise(t, 0.6, 300, 6000, 0.12, 0.5); }
      else if (k === 'shuffle') { for (var j = 0; j < 6; j++) noise(t + j * 0.05, 0.08, 1000 + j * 300, 3000, 0.08, 1); }
      else if (k === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, t + i * 0.12, 0.25, 'square', 0.06); tone(f / 2, t + i * 0.12, 0.25, 'triangle', 0.08); });
        [1046.5, 1318.5, 1568].forEach(function (f) { tone(f, t + 0.5, 0.9, 'triangle', 0.1); });
        for (var m = 0; m < 8; m++) tone(PENTA[5 + (m % 5)] * 1.5, t + 0.6 + m * 0.07, 0.15, 'sine', 0.05);
      }
      else if (k === 'lose') { [392, 349.23, 311.13, 261.63].forEach(function (f, i) { tone(f, t + i * 0.22, 0.3, 'triangle', 0.12); }); }
      else if (k === 'star') { tone(1318.5, t, 0.3, 'sine', 0.15); tone(1975.5, t + 0.06, 0.3, 'sine', 0.08); }
    } catch (e) {}
  }
  /* Nhạc nền hộp nhạc nhẹ nhàng (bật/tắt bằng nút 🎵) */
  var MUS = { on: getB('mg_music', true), timer: 0, next: 0, step: 0, gain: null };
  var CHORDS = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
  var MEL = [0, 2, 4, 2, 5, 4, 2, 1, 0, 2, 4, 5, 7, 5, 4, 2];
  function musicStart() {
    musicStop(); if (!MUS.on) return; var c = ac(); if (!c) return;
    MUS.gain = c.createGain(); MUS.gain.gain.value = 0.05; MUS.gain.connect(master);
    MUS.next = c.currentTime + 0.1; MUS.step = 0;
    MUS.timer = setInterval(function () {
      if (!AC || !MUS.gain) return;
      while (MUS.next < AC.currentTime + 0.4) {
        var st = MUS.step, beat = 0.27, ch = CHORDS[Math.floor(st / 8) % 4];
        if (st % 8 === 0) ch.forEach(function (f) { tone(f / 2, MUS.next, beat * 7, 'sine', 0.35, 0, MUS.gain); });
        var f2 = PENTA[MEL[st % 16]] / 2;
        if (st % 2 === 0 || Math.random() < 0.5) tone(f2 * (st % 16 > 11 ? 2 : 1), MUS.next, beat * 1.6, 'triangle', 0.5, 0, MUS.gain);
        MUS.next += beat; MUS.step++;
      }
    }, 120);
  }
  function musicStop() { clearInterval(MUS.timer); MUS.timer = 0; if (MUS.gain) { try { MUS.gain.disconnect(); } catch (e) {} MUS.gain = null; } }

  /* ================= ĐỌC TỪ ================= */
  var VOICE = { on: getB('mg_voice', true) };
  function say(w, flush) {
    if (!VOICE.on || !w) return;
    var lang = LANG === 'zh' ? 'zh-CN' : 'en-US', rate = LANG === 'zh' ? 0.8 : 0.9;
    if (window.SixTTS && window.SixTTS.ok) { window.SixTTS.speak(w, lang, rate, null, { flush: flush }); return; }
    try { if (flush) speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(w); u.lang = lang; u.rate = rate; speechSynthesis.speak(u); } catch (e) {}
  }
  function hush() { try { if (window.SixTTS) window.SixTTS.stop(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }

  /* ================= DỮ LIỆU TỪ VỰNG ================= */
  var LANG = 'en';
  try { if (localStorage.getItem('mg_lang') === 'zh') LANG = 'zh'; } catch (e) {}
  var DATA = { en: null, zh: null };
  function langApi(l) { return l === 'zh' ? window.SixZhGame : window.SixWordGame; }
  function loadData(l) {
    if (DATA[l]) return Promise.resolve(DATA[l]);
    var a = langApi(l);
    var p = a && a.data ? Promise.resolve() : (window.loadGame ? window.loadGame(l === 'zh' ? 'zh' : 'words') : Promise.reject(new Error('no loader')));
    return p.then(function () {
      var A = langApi(l); if (!A || !A.data) throw new Error('no data');
      var tops = [];
      A.data.topics.forEach(function (t) {
        var seen = {}, w = [];
        t.w.forEach(function (x) { if (!seen[x[2]] && !seen['w' + x[0]]) { seen[x[2]] = 1; seen['w' + x[0]] = 1; w.push(x); } });
        if (w.length >= 6) tops.push({ id: t.id, n: t.n, i: t.i, c: t.c, w: w });
      });
      DATA[l] = { topics: tops, img: A.data.img };
      return DATA[l];
    });
  }
  function D() { return DATA[LANG]; }
  function picImg(p) { if (p && p.charAt(0) === '@') { var im = D().img(p.slice(1)); return im || null; } return null; }
  function picHtml(p, sz) { var im = picImg(p); return im ? '<img src="' + im.src + '" style="width:' + sz + 'px;height:' + sz + 'px;vertical-align:middle">' : '<span style="font-family:' + EF.replace(/"/g, "'") + ';font-size:' + sz + 'px;line-height:1">' + p + '</span>'; }

  /* ================= MÀN CHƠI ================= */
  function levelCount() { return D().topics.length * 3; }
  function levelDef(L) {
    var ti = Math.floor(L / 3), sub = L % 3, tp = D().topics[ti];
    var r = rng(ti * 7919 + sub * 131 + (LANG === 'zh' ? 99991 : 7));
    var K = sub === 0 ? 5 : 6;
    var words = shuffle(tp.w.slice(), r).slice(0, K);
    var d = Math.min(1, ti / 40);                           // độ khó tăng dần theo đảo
    var def = { L: L, ti: ti, sub: sub, topic: tp, words: words, K: K };
    if (sub === 0) { def.kind = 'score'; def.moves = 20; def.target = Math.round((9000 + d * 6000) / 100) * 100; }
    else if (sub === 1) { def.kind = 'collect'; def.moves = 22; def.target = 6000 + Math.round(d * 40) * 100; def.goals = [{ t: 0, n: 18 + Math.round(d * 12) }, { t: 1, n: 18 + Math.round(d * 12) }]; }
    else { def.kind = 'collect'; def.moves = 25; def.target = 8000 + Math.round(d * 40) * 100; def.goals = [{ t: 0, n: 14 + Math.round(d * 10) }, { t: 2, n: 14 + Math.round(d * 10) }, { t: 4, n: 14 + Math.round(d * 10) }]; }
    return def;
  }
  /* Tiến độ: mỗi ngôn ngữ lưu riêng */
  var PR = { en: null, zh: null };
  function prog() {
    if (!PR[LANG]) { var p = null; try { p = JSON.parse(localStorage.getItem('mg_p_' + LANG)); } catch (e) {} PR[LANG] = p && p.s ? p : { s: {}, b: {} }; }
    return PR[LANG];
  }
  function saveProg() { try { localStorage.setItem('mg_p_' + LANG, JSON.stringify(prog())); } catch (e) {} }
  function starsOf(L) { return prog().s[L] || 0; }
  function unlocked(L) { return L === 0 || starsOf(L - 1) > 0; }
  function totalStars() { var s = 0, p = prog().s; for (var k in p) s += p[k]; return s; }

  /* ================= CSS ================= */
  var st = document.createElement('style');
  st.textContent = '' +
  '.mg-root{position:fixed;inset:0;height:100vh;height:100dvh;z-index:99999;display:none;flex-direction:column;color:#fff;font-family:' + TF + ';-webkit-font-smoothing:antialiased;-webkit-user-select:none;user-select:none;overflow:hidden;' +
    'background:radial-gradient(120% 80% at 50% 0%,#ffb6e1 0%,#c58cff 40%,#6a5cff 75%,#3b2a8f 100%)}' +
  '.mg-root.on{display:flex}.mg-root *{box-sizing:border-box}' +
  '.mg-bub{position:absolute;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.55),rgba(255,255,255,.08) 60%,transparent 70%);pointer-events:none;animation:mgUp linear infinite}' +
  '@keyframes mgUp{from{transform:translateY(110vh)}to{transform:translateY(-20vh)}}' +
  '.mg-scr{display:none;flex:1;flex-direction:column;min-height:0;position:relative;z-index:1}.mg-scr.on{display:flex}' +
  '.mg-top{display:flex;align-items:center;gap:8px;padding:max(10px,env(safe-area-inset-top)) 12px 8px}' +
  '.mg-t{flex:1;font-size:18px;font-weight:900;line-height:1.2;text-shadow:0 2px 6px rgba(60,0,90,.45)}' +
  '.mg-btn{border:0;border-radius:14px;padding:9px 14px;font:800 15px ' + TF + ';color:#fff;background:rgba(255,255,255,.2);cursor:pointer;box-shadow:inset 0 -3px 0 rgba(0,0,0,.15)}' +
  '.mg-btn:active{transform:scale(.96)}.mg-btn.ic{padding:8px 11px;font-size:19px;min-width:42px}.mg-btn.off{opacity:.45}' +
  '.mg-btn.go{background:linear-gradient(180deg,#5ef08a,#18b45a);box-shadow:inset 0 -4px 0 #0e8a43,0 6px 16px rgba(20,160,80,.4);font-size:18px;padding:13px 22px}' +
  '.mg-btn.pk{background:linear-gradient(180deg,#ff8ad1,#e83e9c);box-shadow:inset 0 -4px 0 #b4206f,0 6px 16px rgba(230,60,150,.4)}' +
  '.mg-home{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px 18px max(24px,env(safe-area-inset-bottom));text-align:center}' +
  '.mg-logo{font-size:40px;font-weight:900;line-height:1.1;letter-spacing:.5px;background:linear-gradient(180deg,#fff7a8,#ffd23f 45%,#ff7b00);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 #a2207a) drop-shadow(0 8px 14px rgba(70,0,90,.5))}' +
  '.mg-candies{font-size:46px;font-family:' + EF + ';animation:mgBob 2.2s ease-in-out infinite}@keyframes mgBob{50%{transform:translateY(-8px) rotate(-4deg)}}' +
  '.mg-lang{display:flex;gap:12px;width:100%;max-width:420px}' +
  '.mg-lc{flex:1;border:0;border-radius:22px;padding:18px 8px;color:#fff;cursor:pointer;font-family:inherit;box-shadow:0 10px 24px rgba(40,0,80,.35),inset 0 -5px 0 rgba(0,0,0,.18)}' +
  '.mg-lc .f{font-size:42px;font-family:' + EF + '}.mg-lc b{display:block;font-size:19px;margin-top:4px}.mg-lc small{display:block;font-size:12.5px;opacity:.92;margin-top:3px}' +
  '.mg-how{max-width:420px;background:rgba(255,255,255,.16);border-radius:18px;padding:12px 14px;font-size:13.5px;line-height:1.55;text-align:left}' +
  '.mg-map{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 14px max(24px,env(safe-area-inset-bottom))}' +
  '.mg-isl{position:relative;border-radius:24px;padding:12px 12px 14px;margin:0 auto 14px;max-width:520px;box-shadow:0 10px 22px rgba(30,0,70,.3),inset 0 -6px 0 rgba(0,0,0,.15)}' +
  '.mg-isl h3{margin:0 0 8px;font-size:16px;display:flex;align-items:center;gap:8px;text-shadow:0 2px 4px rgba(0,0,0,.25)}.mg-isl h3 span{font-size:26px;font-family:' + EF + '}' +
  '.mg-nodes{display:flex;justify-content:space-around;align-items:center;gap:6px}' +
  '.mg-node{width:74px;border:0;background:none;color:#fff;cursor:pointer;font-family:inherit;padding:0;display:flex;flex-direction:column;align-items:center;gap:3px}' +
  '.mg-node i{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:21px;font-weight:900;' +
    'background:radial-gradient(circle at 35% 30%,#fff 0,#ffe27a 22%,#ffb300 60%,#e07b00 100%);color:#7a3b00;box-shadow:0 5px 0 #a65400,0 8px 14px rgba(0,0,0,.3)}' +
  '.mg-node.cur i{animation:mgPulse 1.1s ease-in-out infinite;background:radial-gradient(circle at 35% 30%,#fff 0,#a8ffcf 22%,#21d07a 60%,#0d8a4c 100%);color:#04381d;box-shadow:0 5px 0 #08663a,0 0 0 6px rgba(255,255,255,.35)}' +
  '@keyframes mgPulse{50%{transform:scale(1.1)}}' +
  '.mg-node.lock i{background:radial-gradient(circle at 35% 30%,#eee,#9a9ab0);color:#555;box-shadow:0 5px 0 #66667a;font-size:20px}' +
  '.mg-node b{font-size:15px;letter-spacing:1px;color:#fff59d;text-shadow:0 1px 3px rgba(0,0,0,.5);min-height:18px}' +
  '.mg-hud{display:flex;align-items:stretch;gap:8px;padding:0 10px 6px}' +
  '.mg-box{background:rgba(40,10,90,.38);border:2px solid rgba(255,255,255,.35);border-radius:16px;padding:5px 9px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:64px}' +
  '.mg-box small{font-size:10.5px;font-weight:800;letter-spacing:.5px;opacity:.85;text-transform:uppercase}.mg-box b{font-size:24px;line-height:1.1;font-variant-numeric:tabular-nums}' +
  '.mg-sc{flex:1;align-items:stretch}.mg-pb{position:relative;height:10px;border-radius:6px;background:rgba(255,255,255,.25);margin-top:4px}.mg-pb i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,#ffe066,#ff7ab8)}' +
  '.mg-pb em{position:absolute;top:-7px;font-style:normal;font-size:14px;transform:translateX(-50%);filter:grayscale(1) brightness(1.3);opacity:.7}.mg-pb em.on{filter:none;opacity:1}' +
  '.mg-goals{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.mg-g{display:flex;align-items:center;gap:3px;font-weight:900;font-size:16px}.mg-g.ok{color:#9dffb0}' +
  '.mg-stage{position:relative;flex:1;min-height:0;touch-action:none}.mg-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;touch-action:none}' +
  '.mg-card{margin:0 10px max(10px,env(safe-area-inset-bottom));border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,240,250,.96));color:#3a1460;display:flex;align-items:center;gap:12px;padding:9px 12px;min-height:76px;box-shadow:0 8px 22px rgba(30,0,70,.35)}' +
  '.mg-card .pic{flex:none;width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#f3e8ff}' +
  '.mg-card .tx{flex:1;min-width:0}.mg-card .w{font-size:25px;font-weight:900;line-height:1.15;color:#7c1fd1;word-break:break-word}.mg-card .py{font-size:14px;color:#e8590c;font-weight:700}.mg-card .m{font-size:16px;font-weight:700;color:#3a1460}' +
  '.mg-card .say{flex:none;border:0;width:46px;height:46px;border-radius:50%;background:linear-gradient(180deg,#b388ff,#7c3aed);color:#fff;font-size:20px;cursor:pointer;box-shadow:inset 0 -3px 0 rgba(0,0,0,.2)}' +
  '.mg-card.pop{animation:mgCard .35s ease}@keyframes mgCard{0%{transform:scale(.94)}60%{transform:scale(1.03)}100%{transform:scale(1)}}' +
  '.mg-mod{position:absolute;inset:0;z-index:5;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(25,5,60,.6)}.mg-mod.on{display:flex}' +
  '.mg-pan{width:100%;max-width:420px;max-height:100%;overflow-y:auto;border-radius:26px;background:linear-gradient(180deg,#fff,#fbefff);color:#3a1460;padding:18px 16px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.45);animation:mgIn .3s ease}' +
  '@keyframes mgIn{from{transform:scale(.85);opacity:0}}' +
  '.mg-pan h2{margin:2px 0 6px;font-size:23px;color:#7c1fd1}.mg-pan p{margin:6px 0;font-size:14.5px;line-height:1.5}' +
  '.mg-stars{font-size:46px;letter-spacing:6px;margin:4px 0}.mg-stars span{display:inline-block;filter:grayscale(1);opacity:.35}.mg-stars span.on{filter:none;opacity:1;animation:mgStar .5s ease both}@keyframes mgStar{0%{transform:scale(0) rotate(-90deg)}70%{transform:scale(1.3)}100%{transform:scale(1)}}' +
  '.mg-wl{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;margin:10px 0;text-align:center}' +
  '.mg-wi{background:#f3e8ff;border-radius:14px;padding:8px 4px;cursor:pointer}.mg-wi b{display:block;font-size:15px;color:#7c1fd1;margin-top:2px}.mg-wi i{display:block;font-style:normal;font-size:12px;color:#e8590c}.mg-wi small{font-size:12.5px}' +
  '.mg-wi.g{outline:3px solid #ff9f1c}' +
  '.mg-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px}' +
  '.mg-load{flex:1;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800}';
  document.head.appendChild(st);

  /* ================= DOM ================= */
  var root = document.createElement('div'); root.className = 'mg-root';
  var bubs = ''; for (var bi = 0; bi < 12; bi++) { var sz = 14 + Math.round(Math.random() * 46); bubs += '<div class="mg-bub" style="left:' + Math.round(Math.random() * 96) + '%;width:' + sz + 'px;height:' + sz + 'px;animation-duration:' + (9 + Math.random() * 12).toFixed(1) + 's;animation-delay:-' + (Math.random() * 15).toFixed(1) + 's"></div>'; }
  root.innerHTML = bubs +
  '<div class="mg-scr on" id="mgHome"><div class="mg-top"><button class="mg-btn ic" data-a="close">←</button><div class="mg-t"></div><button class="mg-btn" data-a="close">✕ Đóng</button></div>' +
    '<div class="mg-home"><div class="mg-candies">🍬🍭🍫🍩</div><div class="mg-logo">XẾP KẸO<br>TỪ VỰNG</div>' +
    '<div class="mg-lang"><button class="mg-lc" data-a="lang" data-l="en" style="background:linear-gradient(160deg,#4facfe,#2b5ce6)"><div class="f">🇬🇧</div><b>Tiếng Anh</b><small id="mgPEn"></small></button>' +
    '<button class="mg-lc" data-a="lang" data-l="zh" style="background:linear-gradient(160deg,#ff6b6b,#d62839)"><div class="f">🇨🇳</div><b>Tiếng Trung</b><small id="mgPZh"></small></button></div>' +
    '<div class="mg-how">👉 Vuốt hoặc chạm để <b>đổi chỗ 2 viên kẹo cạnh nhau</b>, tạo hàng 3 viên giống nhau trở lên.<br>🔊 Ăn viên nào, app <b>đọc từ</b> đó và hiện <b>chữ + nghĩa</b> ở dưới cùng.<br>' +
    '✨ Hàng 4 → kẹo sọc phá cả hàng · Hình L, T → kẹo gói nổ tung · Hàng 5 → kẹo cầu vồng xoá cả loại.<br>⭐ Mỗi sao khi qua màn được <b>+' + money(STAR_PRICE) + '</b> chuyển vào Nông trại.</div></div></div>' +
  '<div class="mg-scr" id="mgMapS"><div class="mg-top"><button class="mg-btn ic" data-a="home">←</button><div class="mg-t" id="mgMapT"></div><button class="mg-btn" data-a="close">✕</button></div><div class="mg-map" id="mgMap"></div></div>' +
  '<div class="mg-scr" id="mgLoad"><div class="mg-load">🍬 Đang mở hộp kẹo…</div></div>' +
  '<div class="mg-scr" id="mgPlay"><div class="mg-top"><button class="mg-btn ic" data-a="pause">←</button><div class="mg-t" id="mgLvT"></div>' +
    '<button class="mg-btn ic" id="mgMu" data-a="music">🎵</button><button class="mg-btn ic" id="mgVo" data-a="voice">🔊</button></div>' +
    '<div class="mg-hud"><div class="mg-box"><small>Lượt</small><b id="mgMoves">0</b></div>' +
      '<div class="mg-box mg-sc"><div style="display:flex;justify-content:space-between;align-items:baseline"><small>Điểm</small><b id="mgScore" style="font-size:20px">0</b></div><div class="mg-pb" id="mgPb"><i id="mgPbI"></i><em>⭐</em><em>⭐</em><em>⭐</em></div></div>' +
      '<div class="mg-box"><small>Mục tiêu</small><div class="mg-goals" id="mgGoals"></div></div></div>' +
    '<div class="mg-stage" id="mgStage"><canvas id="mgCv"></canvas></div>' +
    '<div class="mg-card" id="mgCard"><div class="pic" id="mgCP"></div><div class="tx"><div class="w" id="mgCW"></div><div class="py" id="mgCY"></div><div class="m" id="mgCM"></div></div><button class="say" data-a="sayc">🔊</button></div></div>' +
  '<div class="mg-mod" id="mgMod"><div class="mg-pan" id="mgPan"></div></div>';
  document.body.appendChild(root);

  var scr = { home: $('mgHome'), map: $('mgMapS'), load: $('mgLoad'), play: $('mgPlay') };
  function show(k) { for (var n in scr) scr[n].classList.toggle('on', n === k); if (k !== 'play') musicStop(); }
  function modal(h) { $('mgPan').innerHTML = h; $('mgMod').classList.add('on'); }
  function unmodal() { $('mgMod').classList.remove('on'); }

  /* ================= TRANG CHỦ & BẢN ĐỒ ================= */
  function renderHome() {
    ['en', 'zh'].forEach(function (l) {
      var keep = LANG; LANG = l; var s = totalStars(); LANG = keep;
      $(l === 'en' ? 'mgPEn' : 'mgPZh').textContent = s ? '⭐ ' + s + ' sao' : 'Bắt đầu phá đảo';
    });
  }
  function openLang(l) {
    LANG = l; try { localStorage.setItem('mg_lang', l); } catch (e) {}
    show('load');
    loadData(l).then(function () { renderMap(true); show('map'); })
      .catch(function () { show('home'); modal('<h2>😢 Chưa mở được</h2><p>Không tải được từ vựng ' + (l === 'zh' ? 'tiếng Trung' : 'tiếng Anh') + '. Hãy kiểm tra mạng rồi thử lại.</p><div class="mg-acts"><button class="mg-btn go" data-a="unmod">Đã hiểu</button></div>'); });
  }
  function renderMap(scroll) {
    var tops = D().topics, h = '', cur = -1;
    for (var L = 0; L < levelCount(); L++) if (unlocked(L) && !starsOf(L)) { cur = L; break; }
    $('mgMapT').textContent = (LANG === 'zh' ? '🇨🇳 Tiếng Trung' : '🇬🇧 Tiếng Anh') + ' · ⭐ ' + totalStars() + '/' + levelCount() * 3;
    tops.forEach(function (t, ti) {
      h += '<div class="mg-isl" id="mgIsl' + ti + '" style="background:linear-gradient(150deg,' + t.c + ',' + shade(t.c, -0.35) + ');' + (ti % 2 ? 'margin-left:auto;margin-right:0;width:94%' : 'width:94%;margin-left:0') + '">' +
        '<h3><span>' + t.i + '</span>Đảo ' + (ti + 1) + ': ' + esc(t.n) + '</h3><div class="mg-nodes">';
      for (var s = 0; s < 3; s++) {
        var L2 = ti * 3 + s, ok = unlocked(L2), sv = starsOf(L2);
        h += '<button class="mg-node' + (!ok ? ' lock' : L2 === cur ? ' cur' : '') + '" data-a="lvl" data-l="' + L2 + '"><i>' + (ok ? (L2 + 1) : '🔒') + '</i><b>' + (sv ? '★'.repeat(sv) + '☆'.repeat(3 - sv) : (ok ? '☆☆☆' : '')) + '</b></button>';
      }
      h += '</div></div>';
    });
    $('mgMap').innerHTML = h;
    if (scroll) { var ci = Math.max(0, Math.floor((cur < 0 ? levelCount() - 1 : cur) / 3)); setTimeout(function () { var e = $('mgIsl' + ci); if (e) $('mgMap').scrollTop = Math.max(0, e.offsetTop - 120); }, 30); }
  }
  function wordHtml(w, sz) {
    return picHtml(w[2], sz) + '<b>' + esc(w[0]) + '</b>' + (LANG === 'zh' ? '<i>' + esc(w[3] || '') + '</i>' : '') + '<small>' + esc(w[1]) + '</small>';
  }
  function goalText(def) {
    if (def.kind === 'score') return 'Đạt <b>' + def.target.toLocaleString('vi-VN') + ' điểm</b> trong ' + def.moves + ' lượt.';
    return 'Ăn đủ ' + def.goals.map(function (g) { return '<b>' + g.n + ' ' + picHtml(def.words[g.t][2], 18) + ' ' + esc(def.words[g.t][0]) + '</b>'; }).join(', ') + ' trong ' + def.moves + ' lượt.';
  }
  var PRE = null;
  function preLevel(L) {
    var def = levelDef(L); PRE = def;
    modal('<div style="font-size:15px;font-weight:800;color:#e83e9c">' + def.topic.i + ' Đảo ' + (def.ti + 1) + ' · Màn ' + (L + 1) + '</div><h2>' + esc(def.topic.n) + '</h2>' +
      '<div class="mg-stars">' + [1, 2, 3].map(function (i) { return '<span class="' + (starsOf(L) >= i ? 'on' : '') + '">⭐</span>'; }).join('') + '</div>' +
      '<p>🎯 ' + goalText(def) + '</p><p style="font-size:13px;color:#7a5a9a">Các từ trong màn này (chạm để nghe):</p>' +
      '<div class="mg-wl">' + def.words.map(function (w, i) { var g = def.goals && def.goals.some(function (x) { return x.t === i; }); return '<div class="mg-wi' + (g ? ' g' : '') + '" data-a="sayw" data-i="' + i + '">' + wordHtml(w, 34) + '</div>'; }).join('') + '</div>' +
      '<div class="mg-acts"><button class="mg-btn pk" data-a="unmod">Để sau</button><button class="mg-btn go" data-a="start">▶ Chơi</button></div>');
  }

  /* ================= TRẠNG THÁI VÁN CHƠI ================= */
  var G = null, cv = $('mgCv'), ctx = cv.getContext('2d'), stage = $('mgStage');
  var W = 0, H = 0, DPR = 1, S = 40, OX = 0, OY = 0, raf = 0, SPR = {}, tid = 1;
  var tweens = [], parts = [], texts = [], beams = [], shake = 0, banner = null;
  function cell(r, c) { return G.b[r * N + c]; }
  function setCell(r, c, t) { G.b[r * N + c] = t; }
  function mk(t, sp) { return { id: tid++, t: t, sp: sp || '', x: 0, y: 0, s: 1, a: 1 }; }

  function start(def) {
    hush(); unmodal();
    G = { def: def, K: def.K, b: new Array(N * N), moves: def.moves, score: 0, busy: true, sel: null, got: [], eaten: {}, spoken: [], hintT: 0, hint: null, over: false, chain: 0 };
    (def.goals || []).forEach(function (g) { G.got[g.t] = 0; });
    for (var i = 0; i < def.K; i++) G.eaten[i] = 0;
    // Bàn ban đầu: không có sẵn hàng 3, và phải có ít nhất 1 nước đi
    do { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { var t; do { t = Math.floor(Math.random() * G.K); } while ((c >= 2 && cell(r, c - 1).t === t && cell(r, c - 2).t === t) || (r >= 2 && cell(r - 1, c).t === t && cell(r - 2, c).t === t)); setCell(r, c, mk(t)); } } while (!findMove());
    for (var r2 = 0; r2 < N; r2++) for (var c2 = 0; c2 < N; c2++) { var tl = cell(r2, c2); tl.x = c2; tl.y = r2 - N - 1 - Math.random() * 2; }
    $('mgLvT').textContent = def.topic.i + ' Màn ' + (def.L + 1) + ': ' + def.topic.n;
    $('mgMu').classList.toggle('off', !MUS.on); $('mgVo').classList.toggle('off', !VOICE.on);
    cardWord(def.goals ? def.goals[0].t : 0, false);
    show('play'); resize(); hud(); musicStart();
    cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop);
    gravityAnim().then(function () { G.busy = false; G.hintT = performance.now(); });
  }

  /* ================= GIAO DIỆN TRONG VÁN ================= */
  function hud() {
    if (!G) return;
    $('mgMoves').textContent = G.moves; $('mgScore').textContent = G.score.toLocaleString('vi-VN');
    var T = G.def.target, mx = T * 2.4, p = Math.min(1, G.score / mx);
    $('mgPbI').style.width = (p * 100) + '%';
    var em = $('mgPb').querySelectorAll('em'), th = [1, 1.6, 2.3];
    for (var i = 0; i < 3; i++) { em[i].style.left = (th[i] / 2.4 * 100) + '%'; em[i].classList.toggle('on', G.score >= T * th[i]); }
    var gh = '';
    if (G.def.kind === 'score') gh = '<div class="mg-g' + (G.score >= T ? ' ok' : '') + '">🎯 ' + (G.score >= T ? '✓' : short(T)) + '</div>';
    else G.def.goals.forEach(function (g) { var left = Math.max(0, g.n - (G.got[g.t] || 0)); gh += '<div class="mg-g' + (left ? '' : ' ok') + '">' + picHtml(G.def.words[g.t][2], 20) + (left || '✓') + '</div>'; });
    $('mgGoals').innerHTML = gh;
  }
  function short(n) { return n >= 1000 ? (n / 1000).toLocaleString('vi-VN') + 'k' : n; }
  var cardT = -1;
  function cardWord(t, pop) {
    if (!G || t < 0 || t >= G.K) return;
    var w = G.def.words[t]; cardT = t;
    $('mgCP').innerHTML = picHtml(w[2], 40); $('mgCW').textContent = w[0];
    $('mgCY').textContent = LANG === 'zh' ? (w[3] || '') : ''; $('mgCY').style.display = LANG === 'zh' ? '' : 'none';
    $('mgCM').textContent = w[1];
    if (pop) { var c = $('mgCard'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
  }
  /* Ăn kẹo loại t: hiện từ ở dưới cùng và đọc to (mỗi lượt đọc tối đa 3 từ khác nhau để không bị dồn) */
  function announce(t) {
    if (t < 0 || G.spoken.indexOf(t) > -1) return;
    G.spoken.push(t); G.eaten[t] = (G.eaten[t] || 0);
    if (G.spoken.length > 3) return;
    cardWord(t, true); say(G.def.words[t][0], G.spoken.length === 1);
  }

  /* ================= VẼ ================= */
  function resize() {
    var r = stage.getBoundingClientRect(); DPR = Math.min(3, window.devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    S = Math.floor(Math.min((W - 14) / N, (H - 14) / N)); OX = Math.round((W - S * N) / 2); OY = Math.round((H - S * N) / 2);
    buildSprites();
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function drawPic(c, p, cx, cy, sz) {
    var im = picImg(p);
    if (im) { if (im.complete && im.naturalWidth) c.drawImage(im, cx - sz / 2, cy - sz / 2, sz, sz); else im.addEventListener('load', function () { buildSprites(); }, { once: true }); return; }
    c.font = Math.round(sz * 0.86) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(p, cx, cy + sz * 0.04);
  }
  function candy(t, sp) {
    var px = Math.max(8, Math.round(S * DPR)), o = document.createElement('canvas'); o.width = o.height = px;
    var c = o.getContext('2d'), m = px * 0.07, w = px - 2 * m;
    if (sp === 'b') {   // kẹo cầu vồng: viên sô-cô-la rắc cốm 6 màu
      var g0 = c.createRadialGradient(px * 0.38, px * 0.34, px * 0.05, px / 2, px / 2, px * 0.46);
      g0.addColorStop(0, '#8d5a3b'); g0.addColorStop(0.6, '#5a321c'); g0.addColorStop(1, '#2e160a');
      c.fillStyle = g0; c.beginPath(); c.arc(px / 2, px / 2, px * 0.43, 0, 7); c.fill();
      var rr = rng(7);
      for (var i = 0; i < 26; i++) { var a = rr() * 6.28, d = rr() * px * 0.36; c.save(); c.translate(px / 2 + Math.cos(a) * d, px / 2 + Math.sin(a) * d); c.rotate(rr() * 3); c.fillStyle = COLORS[i % 6]; rrect(c, -px * 0.035, -px * 0.012, px * 0.07, px * 0.024, px * 0.012); c.fill(); c.restore(); }
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(px * 0.38, px * 0.3, px * 0.16, px * 0.08, -0.6, 0, 7); c.fill();
      return o;
    }
    var col = COLORS[t % 6];
    c.save(); c.shadowColor = 'rgba(40,0,60,.35)'; c.shadowBlur = px * 0.06; c.shadowOffsetY = px * 0.04;
    rrect(c, m, m, w, w, px * 0.26);
    var g = c.createRadialGradient(px * 0.35, px * 0.3, px * 0.05, px / 2, px / 2, px * 0.62);
    g.addColorStop(0, shade(col, 0.55)); g.addColorStop(0.45, col); g.addColorStop(1, shade(col, -0.35));
    c.fillStyle = g; c.fill(); c.restore();
    rrect(c, m, m, w, w, px * 0.26); c.lineWidth = px * 0.035; c.strokeStyle = shade(col, -0.45); c.stroke();
    if (sp === 'h' || sp === 'v') {   // kẹo sọc
      c.save(); rrect(c, m, m, w, w, px * 0.26); c.clip(); c.fillStyle = 'rgba(255,255,255,.8)';
      for (var k = 0; k < 4; k++) { var p0 = m + w * (0.1 + k * 0.25); if (sp === 'h') c.fillRect(m, p0, w, w * 0.1); else c.fillRect(p0, m, w * 0.1, w); }
      c.restore();
    }
    if (sp === 'w') {   // kẹo gói: viền vàng + 2 tai gói
      c.lineWidth = px * 0.09; c.strokeStyle = '#ffe14d'; rrect(c, m + px * 0.04, m + px * 0.04, w - px * 0.08, w - px * 0.08, px * 0.22); c.stroke();
      c.fillStyle = '#ffd000';
      [[m, px / 2, -1], [px - m, px / 2, 1]].forEach(function (e) { c.beginPath(); c.moveTo(e[0], e[1]); c.lineTo(e[0] + e[2] * px * 0.06, e[1] - px * 0.14); c.lineTo(e[0] + e[2] * px * 0.06, e[1] + px * 0.14); c.closePath(); c.fill(); });
    }
    // Ô tròn sáng ở giữa để hình từ vựng luôn rõ
    c.fillStyle = 'rgba(255,255,255,.88)'; c.beginPath(); c.arc(px / 2, px / 2 + px * 0.01, px * 0.345, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(px * 0.33, px * 0.2, px * 0.15, px * 0.06, -0.5, 0, 7); c.fill();
    drawPic(c, G.def.words[t][2], px / 2, px / 2 + px * 0.01, px * 0.58);
    return o;
  }
  function buildSprites() { SPR = {}; }
  function sprite(t, sp) { var k = sp === 'b' ? 'b' : t + (sp || ''); return SPR[k] || (SPR[k] = candy(t, sp)); }

  var last = 0;
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (var i = tweens.length - 1; i >= 0; i--) { var tw = tweens[i], p = Math.min(1, (now - tw.t0) / tw.ms); tw.f(tw.e(p)); if (p >= 1) { tweens.splice(i, 1); tw.res(); } }
    if (G && !G.busy && !G.over && now - G.hintT > 5500 && !G.hint) G.hint = findMove();
    draw(now, dt);
    raf = requestAnimationFrame(loop);
  }
  function draw(now, dt) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    if (!G) return;
    var sx = 0, sy = 0; if (shake > 0) { sx = (Math.random() - 0.5) * shake; sy = (Math.random() - 0.5) * shake; shake = Math.max(0, shake - dt * 40); }
    ctx.save(); ctx.translate(OX + sx, OY + sy);
    // Khay kẹo
    ctx.fillStyle = 'rgba(40,10,90,.35)'; rrect(ctx, -7, -7, S * N + 14, S * N + 14, 18); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2; ctx.stroke();
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { ctx.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.2)'; rrect(ctx, c * S + 1, r * S + 1, S - 2, S - 2, S * 0.18); ctx.fill(); }
    ctx.save(); ctx.beginPath(); ctx.rect(-7, -7, S * N + 14, S * N + 14); ctx.clip();
    var hp = G.hint ? 1 + Math.sin(now / 160) * 0.08 : 1;
    for (var i = 0; i < G.b.length; i++) {
      var tl = G.b[i]; if (!tl || tl.a <= 0) continue;
      var sc = tl.s;
      if (G.hint && (tl === G.hint.a || tl === G.hint.b)) sc *= hp;
      if (G.sel && tl === G.sel.t) sc *= 1.08 + Math.sin(now / 120) * 0.04;
      var sz = S * sc, x = tl.x * S + (S - sz) / 2, y = tl.y * S + (S - sz) / 2;
      ctx.globalAlpha = tl.a;
      if (tl.sp === 'b' || tl.t < 0) { ctx.save(); ctx.translate(tl.x * S + S / 2, tl.y * S + S / 2); ctx.rotate(now / 900); ctx.drawImage(sprite(0, 'b'), -sz / 2, -sz / 2, sz, sz); ctx.restore(); }
      else ctx.drawImage(sprite(tl.t, tl.sp), x, y, sz, sz);
      if (G.sel && tl === G.sel.t) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; rrect(ctx, x + 2, y + 2, sz - 4, sz - 4, sz * 0.25); ctx.stroke(); }
    }
    ctx.globalAlpha = 1; ctx.restore();
    // Tia sáng của kẹo sọc
    for (var bI = beams.length - 1; bI >= 0; bI--) {
      var bm = beams[bI]; bm.l -= dt * 2.6; if (bm.l <= 0) { beams.splice(bI, 1); continue; }
      ctx.globalAlpha = bm.l; var gr;
      if (bm.d === 'h') { gr = ctx.createLinearGradient(0, bm.i * S, 0, bm.i * S + S); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(-7, bm.i * S + S * (0.5 - 0.4 * bm.l), S * N + 14, S * 0.8 * bm.l); }
      else { gr = ctx.createLinearGradient(bm.i * S, 0, bm.i * S + S, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(bm.i * S + S * (0.5 - 0.4 * bm.l), -7, S * 0.8 * bm.l, S * N + 14); }
    }
    ctx.globalAlpha = 1;
    // Hạt kẹo vỡ
    for (var pI = parts.length - 1; pI >= 0; pI--) {
      var p = parts[pI]; p.l -= dt * p.k; if (p.l <= 0) { parts.splice(pI, 1); continue; }
      p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      ctx.globalAlpha = Math.min(1, p.l * 1.6); ctx.fillStyle = p.c;
      if (p.st) { star(ctx, p.x, p.y, p.r * p.l + 1); } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.4 + p.l * 0.6), 0, 7); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    // Chữ điểm bay lên
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (var tI = texts.length - 1; tI >= 0; tI--) {
      var tx = texts[tI]; tx.l -= dt * 1.3; if (tx.l <= 0) { texts.splice(tI, 1); continue; }
      ctx.globalAlpha = Math.min(1, tx.l * 2); ctx.font = '900 ' + Math.round(S * 0.42) + 'px ' + TF;
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(70,0,110,.8)'; ctx.strokeText(tx.s, tx.x, tx.y - (1 - tx.l) * S); ctx.fillStyle = tx.c; ctx.fillText(tx.s, tx.x, tx.y - (1 - tx.l) * S);
    }
    ctx.globalAlpha = 1; ctx.restore();
    // Chữ khen ở giữa màn hình
    if (banner) {
      banner.l -= dt * 0.9; if (banner.l <= 0) banner = null;
      else {
        var k = banner.l > 0.8 ? 1 + (banner.l - 0.8) * 4 : 1, fs = Math.min(W / 7, 56) * k;
        ctx.globalAlpha = Math.min(1, banner.l * 2.5); ctx.font = '900 ' + Math.round(fs) + 'px ' + TF; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var gy = ctx.createLinearGradient(0, H / 2 - fs / 2, 0, H / 2 + fs / 2); gy.addColorStop(0, '#fff7a8'); gy.addColorStop(0.5, '#ffd23f'); gy.addColorStop(1, '#ff7b00');
        ctx.lineWidth = 8; ctx.strokeStyle = '#8e1aa8'; ctx.strokeText(banner.s, W / 2, H / 2); ctx.fillStyle = gy; ctx.fillText(banner.s, W / 2, H / 2); ctx.globalAlpha = 1;
      }
    }
  }
  function star(c, x, y, r) { c.beginPath(); for (var i = 0; i < 10; i++) { var a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
  function burst(r, c, t, big) {
    var x = c * S + S / 2, y = r * S + S / 2, col = t >= 0 ? COLORS[t % 6] : '#fff', n = big ? 14 : 8;
    for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, v = (big ? 260 : 170) * (0.4 + Math.random()); parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, r: S * (0.06 + Math.random() * 0.07), c: i % 3 ? col : '#fff', l: 1, k: 1.6 + Math.random(), st: i % 4 === 0 }); }
  }

  /* ================= HOẠT ẢNH ================= */
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  function easeIn(p) { return p * p; }
  function bounce(p) { if (p < 0.8) { var q = p / 0.8; return q * q; } var z = (p - 0.8) / 0.2; return 1 - Math.sin(z * Math.PI) * 0.06; }
  function tween(ms, f, e) { return new Promise(function (res) { tweens.push({ t0: performance.now(), ms: ms, f: f, e: e || easeOut, res: res }); }); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function moveTile(tl, x1, y1, ms, e) { var x0 = tl.x, y0 = tl.y; return tween(ms, function (p) { tl.x = x0 + (x1 - x0) * p; tl.y = y0 + (y1 - y0) * p; }, e); }

  /* ================= LUẬT CHƠI ================= */
  function runs() {
    var out = [];
    for (var r = 0; r < N; r++) for (var c = 0; c < N;) {
      var t = cell(r, c) ? cell(r, c).t : -9, e = c + 1;
      while (e < N && t >= 0 && cell(r, e) && cell(r, e).sp !== 'b' && cell(r, e).t === t) e++;
      if (t >= 0 && cell(r, c).sp !== 'b' && e - c >= 3) { var cs = []; for (var k = c; k < e; k++) cs.push(r * N + k); out.push({ d: 'h', t: t, cells: cs }); }
      c = e;
    }
    for (var c2 = 0; c2 < N; c2++) for (var r2 = 0; r2 < N;) {
      var t2 = cell(r2, c2) ? cell(r2, c2).t : -9, e2 = r2 + 1;
      while (e2 < N && t2 >= 0 && cell(e2, c2) && cell(e2, c2).sp !== 'b' && cell(e2, c2).t === t2) e2++;
      if (t2 >= 0 && cell(r2, c2).sp !== 'b' && e2 - r2 >= 3) { var cs2 = []; for (var k2 = r2; k2 < e2; k2++) cs2.push(k2 * N + c2); out.push({ d: 'v', t: t2, cells: cs2 }); }
      r2 = e2;
    }
    return out;
  }
  function groups() {
    var rs = runs(), gs = [];
    rs.forEach(function (rn) {
      var hit = gs.filter(function (g) { return g.t === rn.t && rn.cells.some(function (i) { return g.set[i]; }); });
      var g = hit[0] || { t: rn.t, set: {}, runs: [] };
      if (!hit[0]) gs.push(g);
      for (var h = 1; h < hit.length; h++) { hit[h].runs.forEach(function (x) { g.runs.push(x); }); for (var k in hit[h].set) g.set[k] = 1; gs.splice(gs.indexOf(hit[h]), 1); }
      g.runs.push(rn); rn.cells.forEach(function (i) { g.set[i] = 1; });
    });
    gs.forEach(function (g) { g.cells = Object.keys(g.set).map(Number); });
    return gs;
  }
  function specialOf(g) {
    var mx = 0, hasH = false, hasV = false, longest = null;
    g.runs.forEach(function (r) { if (r.cells.length > mx) { mx = r.cells.length; longest = r; } if (r.d === 'h') hasH = true; else hasV = true; });
    if (mx >= 5) return { sp: 'b', run: longest };
    if (hasH && hasV) return { sp: 'w', run: null };
    if (mx === 4) return { sp: longest.d === 'h' ? 'v' : 'h', run: longest };
    return null;
  }
  function placeOf(g, spec, hot) {
    for (var i = 0; i < (hot || []).length; i++) if (g.set[hot[i]]) return hot[i];
    if (spec.sp === 'w') { var cnt = {}; g.runs.forEach(function (r) { r.cells.forEach(function (c) { cnt[c] = (cnt[c] || 0) + 1; }); }); for (var k in cnt) if (cnt[k] > 1) return +k; }
    var cs = spec.run ? spec.run.cells : g.cells; return cs[Math.floor(cs.length / 2)];
  }
  function swapIn(i, j) { var t = G.b[i]; G.b[i] = G.b[j]; G.b[j] = t; }
  function findMove() {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var i = r * N + c, a = G.b[i]; if (!a) continue;
      var nb = []; if (c < N - 1) nb.push(i + 1); if (r < N - 1) nb.push(i + N);
      for (var k = 0; k < nb.length; k++) {
        var j = nb[k], b = G.b[j]; if (!b) continue;
        if (a.sp === 'b' || b.sp === 'b' || (a.sp && b.sp)) return { a: a, b: b, i: i, j: j };
        swapIn(i, j); var ok = runs().some(function (rn) { return rn.cells.indexOf(i) > -1 || rn.cells.indexOf(j) > -1; }); swapIn(i, j);
        if (ok) return { a: a, b: b, i: i, j: j };
      }
    }
    return null;
  }
  function typeCount() { var n = {}; G.b.forEach(function (t) { if (t && t.sp !== 'b') n[t.t] = (n[t.t] || 0) + 1; }); var best = 0, bt = 0; for (var k in n) if (n[k] > best) { best = n[k]; bt = +k; } return bt; }

  /* Xoá các ô (có kích hoạt kẹo đặc biệt nằm trong vùng bị xoá) */
  function blast(set, keep) {
    var q = Object.keys(set).map(Number), seen = {}, fx = { line: 0, boom: 0, rb: 0 };
    while (q.length) {
      var i = q.shift(); if (seen[i]) continue; seen[i] = 1;
      var tl = G.b[i]; if (!tl || keep[i]) continue;
      var r = Math.floor(i / N), c = i % N, add = [];
      if (tl.sp === 'h') { for (var k = 0; k < N; k++) add.push(r * N + k); beams.push({ d: 'h', i: r, l: 1 }); fx.line++; }
      else if (tl.sp === 'v') { for (var k2 = 0; k2 < N; k2++) add.push(k2 * N + c); beams.push({ d: 'v', i: c, l: 1 }); fx.line++; }
      else if (tl.sp === 'w') { for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { var rr = r + dr, cc = c + dc; if (rr >= 0 && rr < N && cc >= 0 && cc < N) add.push(rr * N + cc); } fx.boom++; }
      else if (tl.sp === 'b') { var bt = typeCount(); announce(bt); G.b.forEach(function (x, j) { if (x && x.t === bt && x.sp !== 'b') add.push(j); }); fx.rb++; }
      add.forEach(function (j) { if (!set[j] && !keep[j]) { set[j] = 1; q.push(j); } });
    }
    return fx;
  }
  /* Thực hiện xoá: hoạt ảnh, điểm, mục tiêu */
  function clearSet(set, creates, chain) {
    var keep = {}; creates.forEach(function (cr) { keep[cr.i] = 1; });
    var fx = blast(set, keep), n = 0, idx = [];
    for (var k in set) { k = +k; if (keep[k] || !G.b[k]) continue; idx.push(k); n++; }
    if (fx.rb) sfx('rainbow'); else if (fx.boom) sfx('boom'); else if (fx.line) sfx('line'); else sfx('pop', chain);
    if (fx.boom || fx.rb) shake = Math.max(shake, 14); else if (fx.line) shake = Math.max(shake, 7);
    var pts = n * 60 * chain + (fx.line * 120) + (fx.boom * 200) + (fx.rb * 400);
    G.score += pts;
    var cx = 0, cy = 0;
    idx.forEach(function (i) {
      var tl = G.b[i], r = Math.floor(i / N), c = i % N; cx += c; cy += r;
      if (tl.t >= 0 && tl.sp !== 'b') { if (G.got[tl.t] != null) G.got[tl.t]++; G.eaten[tl.t] = (G.eaten[tl.t] || 0) + 1; }
      burst(r, c, tl.sp === 'b' ? -1 : tl.t, !!tl.sp);
    });
    if (n) texts.push({ s: '+' + pts, x: (cx / n) * S + S / 2, y: (cy / n) * S + S / 2, l: 1, c: chain > 1 ? '#ffe066' : '#fff' });
    creates.forEach(function (cr) { var tl = G.b[cr.i]; if (tl) { tl.t = cr.t; tl.sp = cr.sp; } });
    if (creates.length) sfx('make');
    var anims = idx.map(function (i) { var tl = G.b[i]; return tween(200, function (p) { tl.s = 1 + p * 0.25; tl.a = 1 - p; }, easeIn).then(function () { if (G.b[i] === tl) G.b[i] = null; }); });
    creates.forEach(function (cr) { var tl = G.b[cr.i]; if (tl) anims.push(tween(300, function (p) { tl.s = p < 0.5 ? 1 + p * 0.6 : 1.3 - (p - 0.5) * 0.6; })); });
    hud();
    return Promise.all(anims);
  }
  /* Kẹo rơi xuống, kẹo mới rơi từ trên */
  function gravityAnim() {
    var anims = [];
    for (var c = 0; c < N; c++) {
      var wr = N - 1;
      for (var r = N - 1; r >= 0; r--) { var tl = cell(r, c); if (tl) { if (wr !== r) { setCell(wr, c, tl); setCell(r, c, null); } wr--; } }
      var spawn = 0;
      for (var r2 = wr; r2 >= 0; r2--) { var nt = mk(Math.floor(Math.random() * G.K)); spawn++; nt.x = c; nt.y = -spawn; setCell(r2, c, nt); }
      for (var r3 = 0; r3 < N; r3++) { var t3 = cell(r3, c); if (t3.y !== r3 || t3.x !== c) { var dist = r3 - t3.y; anims.push(moveTile(t3, c, r3, Math.max(160, 70 * Math.sqrt(Math.abs(dist)) * 2.4), bounce)); } }
    }
    return Promise.all(anims);
  }
  /* Chuỗi: tìm hàng → xoá → rơi → lặp lại */
  async function cascade(hot) {
    var chain = 0;
    while (true) {
      var gs = groups(); if (!gs.length) break;
      chain++;
      var set = {}, creates = [];
      gs.forEach(function (g) {
        g.cells.forEach(function (i) { set[i] = 1; });
        announce(g.t);
        var spec = specialOf(g);
        if (spec) { var pos = placeOf(g, spec, hot); if (!creates.some(function (x) { return x.i === pos; })) creates.push({ i: pos, t: g.t, sp: spec.sp }); }
      });
      if (chain >= 2) { var m = COMBO[Math.min(COMBO.length - 1, chain)]; if (m) { banner = { s: m, l: 1.2 }; } }
      await clearSet(set, creates, chain);
      await gravityAnim();
      hot = null;
    }
    return chain;
  }

  /* ================= ĐỔI CHỖ ================= */
  async function trySwap(i, j) {
    if (!G || G.busy || G.over) return;
    var a = G.b[i], b = G.b[j]; if (!a || !b) return;
    G.busy = true; G.hint = null; G.sel = null; G.spoken = [];
    var ri = Math.floor(i / N), ci = i % N, rj = Math.floor(j / N), cj = j % N;
    sfx('swap');
    await Promise.all([moveTile(a, cj, rj, 170), moveTile(b, ci, ri, 170)]);
    swapIn(i, j);
    // Ghép 2 kẹo đặc biệt, hoặc kẹo cầu vồng với bất kỳ viên nào
    if (a.sp === 'b' || b.sp === 'b' || (a.sp && b.sp)) { G.moves--; hud(); await combo(a, b, j, i); await cascade(null); return afterMove(); }
    var gs = groups(), touch = gs.some(function (g) { return g.set[i] || g.set[j]; });
    if (!touch) {
      sfx('bad');
      await Promise.all([moveTile(a, ci, ri, 170), moveTile(b, cj, rj, 170)]);
      swapIn(i, j); G.busy = false; G.hintT = performance.now(); return;
    }
    G.moves--; hud();
    await cascade([j, i]);
    afterMove();
  }
  async function combo(a, b, pa, pb) {
    var set = {}, ra = Math.floor(pa / N), ca = pa % N;
    function add(r, c) { if (r >= 0 && r < N && c >= 0 && c < N) set[r * N + c] = 1; }
    if (a.sp === 'b' && b.sp === 'b') {          // 2 kẹo cầu vồng: xoá cả bàn
      for (var i = 0; i < N * N; i++) set[i] = 1;
      a.sp = b.sp = ''; a.t = b.t = -1; banner = { s: 'Wow!!!', l: 1.4 }; sfx('rainbow');
    } else if (a.sp === 'b' || b.sp === 'b') {
      var bomb = a.sp === 'b' ? a : b, o = bomb === a ? b : a, T = o.t;
      announce(T); bomb.sp = ''; bomb.t = -1;
      var targets = []; G.b.forEach(function (x, k) { if (x && x.t === T && x.sp !== 'b') targets.push(k); });
      if (o.sp) {   // cầu vồng + kẹo sọc/gói: cả loại biến thành kẹo đặc biệt rồi nổ
        targets.forEach(function (k) { G.b[k].sp = o.sp === 'w' ? 'w' : (Math.random() < 0.5 ? 'h' : 'v'); }); sfx('make'); await wait(380);
      }
      targets.forEach(function (k) { set[k] = 1; }); set[G.b.indexOf(bomb)] = 1;
      banner = { s: 'Rainbow!', l: 1.2 };
    } else {
      var spA = a.sp, spB = b.sp; a.sp = b.sp = '';
      announce(a.t); announce(b.t);
      set[pa] = 1; set[pb] = 1;
      var lines = (spA === 'w') + (spB === 'w');
      if (lines === 2) { for (var dr = -2; dr <= 2; dr++) for (var dc = -2; dc <= 2; dc++) add(ra + dr, ca + dc); sfx('boom'); shake = 18; }
      else if (lines === 1) { for (var d = -1; d <= 1; d++) for (var k2 = 0; k2 < N; k2++) { add(ra + d, k2); add(k2, ca + d); } for (var z = -1; z <= 1; z++) { beams.push({ d: 'h', i: ra + z, l: 1 }); beams.push({ d: 'v', i: ca + z, l: 1 }); } sfx('line'); shake = 14; }
      else { for (var k3 = 0; k3 < N; k3++) { add(ra, k3); add(k3, ca); } beams.push({ d: 'h', i: ra, l: 1 }); beams.push({ d: 'v', i: ca, l: 1 }); }
      banner = { s: 'Super!', l: 1.2 };
    }
    await clearSet(set, [], 1);
    await gravityAnim();
  }
  function goalsDone() {
    if (G.def.kind === 'score') return false;
    return G.def.goals.every(function (g) { return (G.got[g.t] || 0) >= g.n; });
  }
  async function afterMove() {
    hud();
    if (goalsDone()) return finale(true);
    if (G.moves <= 0) return finale(G.def.kind === 'score' && G.score >= G.def.target);
    if (!findMove()) await reshuffle();
    G.busy = false; G.hintT = performance.now(); G.spoken = [];
  }
  async function reshuffle() {
    banner = { s: 'Shuffle!', l: 1.1 }; sfx('shuffle');
    var tries = 0;
    do {
      var ts = G.b.filter(function (t) { return t && !t.sp; }).map(function (t) { return t.t; }); shuffle(ts);
      var k = 0; G.b.forEach(function (t) { if (t && !t.sp) t.t = ts[k++]; });
      tries++;
    } while ((groups().length || !findMove()) && tries < 50);
    SPR = SPR; await tween(420, function (p) { G.b.forEach(function (t) { if (t) t.s = 1 - Math.sin(p * Math.PI) * 0.5; }); });
  }
  /* Hết lượt / hoàn thành: lượt còn thừa biến thành kẹo sọc và nổ (thưởng điểm) */
  async function finale(win) {
    G.busy = true;
    if (win && G.moves > 0) {
      banner = { s: 'Bonus!', l: 1.2 }; await wait(500);
      var n = Math.min(G.moves, 12), pool = [];
      G.b.forEach(function (t, k) { if (t && !t.sp) pool.push(k); }); shuffle(pool);
      for (var i = 0; i < n && i < pool.length; i++) { var tl = G.b[pool[i]]; tl.sp = Math.random() < 0.5 ? 'h' : 'v'; tl.s = 1.3; G.moves--; G.score += 300; hud(); sfx('star'); await wait(110); tl.s = 1; }
      var set = {}; G.b.forEach(function (t, k) { if (t && t.sp) set[k] = 1; });
      if (Object.keys(set).length) { G.spoken = [99, 98, 97]; await clearSet(set, [], 2); await gravityAnim(); await cascade(null); }
    }
    G.over = true; endScreen(win);
  }

  /* ================= KẾT THÚC MÀN ================= */
  function endScreen(win) {
    var def = G.def, T = def.target, L = def.L;
    var stars = win ? 1 + (G.score >= T * 1.6 ? 1 : 0) + (G.score >= T * 2.3 ? 1 : 0) : 0;
    var prev = starsOf(L), gain = 0;
    if (win) {
      if (stars > prev) { gain = (stars - prev) * STAR_PRICE; prog().s[L] = stars; }
      prog().b[L] = Math.max(prog().b[L] || 0, G.score); saveProg();
      sfx('win');
      var learned = 0; for (var k in G.eaten) if (G.eaten[k] > 0) learned++;
      try { if (window.farmEarn && (gain || learned)) window.farmEarn('match', gain, learned, def.topic.id); } catch (e) {}
    } else sfx('lose');
    musicStop();
    var words = def.words.map(function (w, i) { return '<div class="mg-wi" data-a="sayw" data-i="' + i + '">' + wordHtml(w, 30) + '<div style="font-size:11.5px;color:#9a7ab8">Đã ăn ' + (G.eaten[i] || 0) + '</div></div>'; }).join('');
    var next = L + 1 < levelCount() && unlocked(L + 1);
    modal((win ? '<div style="font-size:50px">🏆</div><h2>Qua màn ' + (L + 1) + '!</h2>' : '<div style="font-size:50px">😢</div><h2>Chưa qua màn</h2>') +
      '<div class="mg-stars">' + [1, 2, 3].map(function (i) { return '<span class="' + (stars >= i ? 'on' : '') + '" style="animation-delay:' + (i * 0.25) + 's">⭐</span>'; }).join('') + '</div>' +
      '<p style="font-size:20px;font-weight:900;color:#7c1fd1">' + G.score.toLocaleString('vi-VN') + ' điểm</p>' +
      (win ? (gain ? '<p>🧑‍🌾 <b>+' + money(gain) + '</b> đã chuyển vào Nông trại</p>' : '<p style="font-size:13px;color:#7a5a9a">Được nhiều sao hơn lần trước thì nhận thêm tiền thưởng.</p>')
           : '<p>' + (def.kind === 'score' ? 'Cần ' + T.toLocaleString('vi-VN') + ' điểm.' : 'Chưa ăn đủ mục tiêu.') + ' Thử lại nhé, con làm được mà!</p>') +
      '<p style="font-size:13px;color:#7a5a9a;margin-top:10px">📚 Ôn lại từ vựng (chạm để nghe):</p><div class="mg-wl">' + words + '</div>' +
      '<div class="mg-acts"><button class="mg-btn pk" data-a="tomap">🗺️ Bản đồ</button><button class="mg-btn pk" data-a="again">↻ Chơi lại</button>' + (win && next ? '<button class="mg-btn go" data-a="next">▶ Màn tiếp</button>' : '') + '</div>');
    if (win) setTimeout(function () { sfx('star'); }, 300);
  }
  function stopPlay() { cancelAnimationFrame(raf); raf = 0; tweens = []; parts = []; texts = []; beams = []; banner = null; G = null; musicStop(); hush(); }

  /* ================= ĐIỀU KHIỂN ================= */
  var down = null;
  function cellAt(e) {
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left - OX, y = e.clientY - r.top - OY;
    var c = Math.floor(x / S), rr = Math.floor(y / S);
    if (c < 0 || c >= N || rr < 0 || rr >= N) return -1;
    return rr * N + c;
  }
  function adj(i, j) { var r1 = Math.floor(i / N), c1 = i % N, r2 = Math.floor(j / N), c2 = j % N; return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1; }
  cv.addEventListener('pointerdown', function (e) {
    if (!G || G.busy || G.over) return;
    var i = cellAt(e); if (i < 0) return;
    e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    G.hintT = performance.now(); G.hint = null;
    if (G.sel && G.sel.i !== i && adj(G.sel.i, i)) { var s0 = G.sel.i; G.sel = null; trySwap(s0, i); return; }
    down = { i: i, x: e.clientX, y: e.clientY, done: false };
    var tl = G.b[i]; G.sel = { i: i, t: tl }; sfx('select');
    if (tl && tl.sp !== 'b') cardWord(tl.t, false);
  });
  cv.addEventListener('pointermove', function (e) {
    if (!down || down.done || !G || G.busy) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < S * 0.35) return;
    var r = Math.floor(down.i / N), c = down.i % N, j = -1;
    if (Math.abs(dx) > Math.abs(dy)) { if (dx > 0 && c < N - 1) j = down.i + 1; else if (dx < 0 && c > 0) j = down.i - 1; }
    else { if (dy > 0 && r < N - 1) j = down.i + N; else if (dy < 0 && r > 0) j = down.i - N; }
    down.done = true;
    if (j >= 0) { G.sel = null; trySwap(down.i, j); }
  });
  ['pointerup', 'pointercancel'].forEach(function (t) { cv.addEventListener(t, function () { down = null; }); });
  window.addEventListener('resize', function () { if (G && scr.play.classList.contains('on')) resize(); });
  document.addEventListener('visibilitychange', function () { if (!root.classList.contains('on')) return; if (document.hidden) musicStop(); else if (G && !G.over && scr.play.classList.contains('on') && !$('mgMod').classList.contains('on')) musicStart(); });

  root.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null; if (!el) return;
    var a = el.getAttribute('data-a');
    if (a === 'close') api.close();
    else if (a === 'home') { renderHome(); show('home'); }
    else if (a === 'lang') openLang(el.getAttribute('data-l'));
    else if (a === 'lvl') { var L = +el.getAttribute('data-l'); if (!unlocked(L)) { sfx('bad'); return; } sfx('select'); preLevel(L); }
    else if (a === 'unmod') unmodal();
    else if (a === 'start') { if (PRE) start(PRE); }
    else if (a === 'sayw') { var i = +el.getAttribute('data-i'), def = G ? G.def : PRE; if (def && def.words[i]) say(def.words[i][0], true); }
    else if (a === 'sayc') { if (G && cardT >= 0) say(G.def.words[cardT][0], true); }
    else if (a === 'music') { MUS.on = !MUS.on; setB('mg_music', MUS.on); el.classList.toggle('off', !MUS.on); if (MUS.on) musicStart(); else musicStop(); }
    else if (a === 'voice') { VOICE.on = !VOICE.on; setB('mg_voice', VOICE.on); el.classList.toggle('off', !VOICE.on); if (!VOICE.on) hush(); }
    else if (a === 'pause') {
      if (!G || G.over) { stopPlay(); renderMap(true); show('map'); return; }
      musicStop();
      modal('<div style="font-size:46px">⏸️</div><h2>Tạm dừng</h2><p>Thoát bây giờ thì màn chơi này sẽ không được tính.</p><div class="mg-acts"><button class="mg-btn pk" data-a="quit">🗺️ Về bản đồ</button><button class="mg-btn go" data-a="resume">▶ Chơi tiếp</button></div>');
    }
    else if (a === 'resume') { unmodal(); musicStart(); }
    else if (a === 'quit' || a === 'tomap') { unmodal(); stopPlay(); renderMap(true); show('map'); }
    else if (a === 'again') { var d0 = G ? G.def : PRE; stopPlay(); start(levelDef(d0.L)); }
    else if (a === 'next') { var d1 = G.def; stopPlay(); renderMap(false); preLevel(d1.L + 1); show('map'); }
  });

  /* ================= API CÔNG KHAI ================= */
  var api = {
    open: function () {
      root.classList.add('on'); document.body.style.overflow = 'hidden'; unmodal(); renderHome(); show('home');
      try { if (window.SixTTS) window.SixTTS.warm(); } catch (e) {}
    },
    close: function () { stopPlay(); unmodal(); root.classList.remove('on'); document.body.style.overflow = ''; }
  };
  window.SixMatchGame = api;
})();
