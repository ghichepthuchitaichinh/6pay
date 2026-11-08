/* 6PAY - Game "Phá đảo chủ đề" (tiếng Anh & tiếng Trung). Bản 2026.11.05-1.
   Mở từ nút nổi 🏝️ trong mục "Từ vựng theo chủ đề" của Game tiếng Anh / Game tiếng Trung.
   Luật chơi kiểu xếp kẹo: đổi chỗ 2 viên kẹo cạnh nhau để có hàng 3 viên giống nhau trở lên.
   Mỗi viên kẹo là 1 từ vựng. Ăn viên nào, app đọc từ đó và hiện chữ + nghĩa tiếng Việt ở dưới cùng.
   Mỗi chủ đề là 1 hòn đảo. Các màn trên đảo chia nhau TOÀN BỘ từ vựng của chủ đề (mỗi màn 5–6 từ).
   (bản 2026.11.02-5) Thiên về HỌC: không giới hạn lượt, không thua. Phải ăn đủ TẤT CẢ các từ trong danh sách mới qua màn.
   Mỗi màn có đồng hồ bấm giờ: xong càng nhanh càng nhiều sao (⭐⭐⭐ / ⭐⭐ / ⭐), lưu thời gian tốt nhất của từng màn.
   (bản 2026.11.05-1) Mỗi từ phải ăn 12 viên (trước là 6). Màn CUỐI mỗi đảo có LỚP BĂNG 🧊 phủ lên nhiều viên kẹo từ vựng:
   viên có băng bị ăn lần 1 chỉ vỡ băng (không tính), phải ăn thêm lần nữa mới được tính.
   Kẹo đặc biệt: hàng 4 → kẹo sọc · hình L, T → kẹo gói · hàng 5 → kẹo cầu vồng. */
(function () {
  if (window.SixMatchGame) return;

  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var EFH = EF.replace(/"/g, "'");
  var TF = '-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  var C = 7, R = 9;                            // bàn 7 cột × 9 hàng (kẹo to hơn, dễ nhìn trên điện thoại)
  var STAR_PRICE = 10000;                      // mỗi sao khi qua màn: +10.000đ vào Nông trại
  var COLORS = ['#ff4d6d', '#ff9f1c', '#ffd23f', '#2ec27e', '#3a86ff', '#a259ff'];
  var COMBO = ['', '', 'Great!', 'Super!', 'Awesome!', 'Fantastic!', 'Amazing!', 'Unbelievable!'];
  var PKEY = 'mg2_p_';                         // tiến độ (mỗi ngôn ngữ lưu riêng)

  /* ================= TIỆN ÍCH ================= */
  function $(id) { return document.getElementById(id); }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hashS(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
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
  function noise(t, d, f0, f1, vol, q, dest) {
    var c = AC;
    if (!NOISE) { NOISE = c.createBuffer(1, c.sampleRate * 2, c.sampleRate); var x = NOISE.getChannelData(0); for (var i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; }
    var s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = NOISE; fl.type = 'bandpass'; fl.Q.value = q || 1.2; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.3, t + Math.min(0.3, d / 3)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(dest || master); s.start(t); s.stop(t + d + 0.05);
  }
  var PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];
  function sfx(k, n) {
    var c = ac(); if (!c) return;
    try {
      var t = c.currentTime + 0.01;
      if (k === 'swap') noise(t, 0.16, 600, 2400, 0.18, 0.8);
      else if (k === 'bad') { tone(220, t, 0.12, 'square', 0.06, 200); tone(180, t + 0.13, 0.16, 'square', 0.06, 150); }
      else if (k === 'select') tone(880, t, 0.07, 'sine', 0.08, 1200);
      else if (k === 'pop') {           // ăn kẹo: tiếng "bóp bong bóng" cao dần theo chuỗi combo
        var f = PENTA[Math.min(PENTA.length - 1, (n || 1) - 1)];
        tone(f, t, 0.18, 'triangle', 0.2, f * 1.5); tone(f * 2, t + 0.03, 0.12, 'sine', 0.06);
        noise(t, 0.07, 2000, 5000, 0.08, 2);
      }
      else if (k === 'make') { [0, 2, 4, 7].forEach(function (s, i) { tone(PENTA[s] * 1.5, t + i * 0.06, 0.22, 'sine', 0.1); }); }
      else if (k === 'line') { tone(1600, t, 0.35, 'sawtooth', 0.06, 180); noise(t, 0.3, 4000, 600, 0.12, 0.7); }
      else if (k === 'boom') { tone(140, t, 0.45, 'sine', 0.35, 40); noise(t, 0.4, 900, 120, 0.3, 0.6); }
      else if (k === 'rainbow') { for (var i = 0; i < 10; i++) tone(PENTA[i], t + i * 0.035, 0.3, 'sine', 0.08); noise(t, 0.6, 300, 6000, 0.12, 0.5); }
      else if (k === 'shuffle') { for (var j = 0; j < 6; j++) noise(t + j * 0.05, 0.08, 1000 + j * 300, 3000, 0.08, 1); }
      else if (k === 'goal') { tone(1318.5, t, 0.16, 'triangle', 0.12); tone(1760, t + 0.08, 0.22, 'triangle', 0.12); }
      else if (k === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, t + i * 0.12, 0.25, 'square', 0.06); tone(f / 2, t + i * 0.12, 0.25, 'triangle', 0.08); });
        [1046.5, 1318.5, 1568].forEach(function (f) { tone(f, t + 0.5, 0.9, 'triangle', 0.1); });
        for (var m = 0; m < 8; m++) tone(PENTA[5 + (m % 5)] * 1.5, t + 0.6 + m * 0.07, 0.15, 'sine', 0.05);
      }
      else if (k === 'lose') { [392, 349.23, 311.13, 261.63].forEach(function (f, i) { tone(f, t + i * 0.22, 0.3, 'triangle', 0.12); }); }
      else if (k === 'star') { tone(1318.5, t, 0.3, 'sine', 0.15); tone(1975.5, t + 0.06, 0.3, 'sine', 0.08); }
      else if (k === 'splash') { noise(t, 0.5, 400, 2500, 0.14, 0.6); }
    } catch (e) {}
  }
  /* Nhạc nền đảo nhiệt đới + tiếng sóng biển nhẹ (bật/tắt bằng nút 🎵) */
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
        if (st % 16 === 0) noise(MUS.next, 3.6, 300, 900, 0.5, 0.4, MUS.gain);   // tiếng sóng
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

  /* ================= DỮ LIỆU TỪ VỰNG & CÁC MÀN ================= */
  var LANG = 'en', DATA = { en: null, zh: null };
  function langApi(l) { return l === 'zh' ? window.SixZhGame : window.SixWordGame; }
  function loadData(l) {
    if (DATA[l]) return Promise.resolve(DATA[l]);
    var a = langApi(l);
    var p = a && a.data ? Promise.resolve() : (window.loadGame ? window.loadGame(l === 'zh' ? 'zh' : 'words') : Promise.reject(new Error('no loader')));
    return p.then(function () {
      var A = langApi(l); if (!A || !A.data) throw new Error('no data');
      var tops = [], levels = [];
      A.data.topics.forEach(function (t) {
        // Bỏ từ trùng hình hoặc trùng chữ (hai viên kẹo giống hệt nhau sẽ gây nhầm)
        var seen = {}, w = [];
        t.w.forEach(function (x) { if (!seen['p' + x[2]] && !seen['w' + x[0]]) { seen['p' + x[2]] = 1; seen['w' + x[0]] = 1; w.push(x); } });
        if (w.length < 5) return;
        var ti = tops.length, tp = { id: t.id, n: t.n, i: t.i, c: t.c, w: w, L0: levels.length, levels: [] };
        // Chia TOÀN BỘ từ của chủ đề vào các màn, mỗi màn 5–6 từ (màn thiếu thì mượn thêm từ ở màn khác)
        var order = shuffle(w.map(function (x, i) { return i; }), rng(hashS(l + t.id)));
        var nL = Math.max(1, Math.ceil(order.length / 6)), base = Math.floor(order.length / nL), rem = order.length % nL, k = 0;
        for (var j = 0; j < nL; j++) {
          var sz = base + (j < rem ? 1 : 0), own = order.slice(k, k + sz); k += sz;
          var list = own.slice();
          for (var q = 0; list.length < 5 && q < order.length * 2; q++) { var b = order[(k + q) % order.length]; if (list.indexOf(b) < 0) list.push(b); }
          var lv = { L: levels.length, ti: ti, sub: j, words: list.map(function (x) { return w[x]; }), own: own.length };
          levels.push(lv); tp.levels.push(lv);
        }
        tops.push(tp);
      });
      DATA[l] = { topics: tops, levels: levels, img: A.data.img };
      return DATA[l];
    });
  }
  function D() { return DATA[LANG]; }
  function picImg(p) { if (p && p.charAt(0) === '@') { var im = D().img(p.slice(1)); return im || null; } return null; }
  function picHtml(p, sz) { var im = picImg(p); return im ? '<img src="' + im.src + '" style="width:' + sz + 'px;height:' + sz + 'px;vertical-align:middle">' : '<span style="font-family:' + EFH + ';font-size:' + sz + 'px;line-height:1">' + p + '</span>'; }
  function levelCount() { return D().levels.length; }
  function levelDef(L) {
    var lv = D().levels[L], tp = D().topics[lv.ti], K = lv.words.length;
    var d = Math.min(1, lv.ti / 40);                           // độ khó tăng dần theo đảo
    // Mỗi từ phải ăn 12–16 viên (đảo sau khó hơn). Màn cuối đảo có lớp băng bảo vệ kẹo từ vựng.
    // Mốc sao theo thời gian tính theo số viên phải ăn (màn có băng được cộng thêm 40% thời gian).
    var quota = 12 + Math.round(d * 4), ice = lv.sub === tp.levels.length - 1, tf = ice ? 1.4 : 1;
    return { L: L, ti: lv.ti, sub: lv.sub, nsub: tp.levels.length, topic: tp, words: lv.words, K: K, ice: ice,
      quota: quota, t3: Math.round(K * quota * 3 * tf), t2: Math.round(K * quota * 5 * tf) };
  }
  var PR = { en: null, zh: null };
  function prog() {
    if (!PR[LANG]) { var p = null; try { p = JSON.parse(localStorage.getItem(PKEY + LANG)); } catch (e) {} PR[LANG] = p && p.s ? p : { s: {}, b: {} }; }
    return PR[LANG];
  }
  function saveProg() { try { localStorage.setItem(PKEY + LANG, JSON.stringify(prog())); } catch (e) {} }
  function starsOf(L) { return prog().s[L] || 0; }
  function bestT(L) { return (prog().t || {})[L] || 0; }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2); }
  // (bản 2026.11.07-1) Qua màn lần đầu phải làm đúng bài kiểm tra (phát âm + chọn nghĩa) mới mở màn sau
  function qzPend(L) { return !!(prog().q || {})[L]; }
  function qzGate(L) { return L > 0 && starsOf(L - 1) > 0 && qzPend(L - 1); }   // màn L đang chờ bài kiểm tra của màn trước
  function unlocked(L) { return L === 0 || (starsOf(L - 1) > 0 && !qzPend(L - 1)); }
  function totalStars() { var s = 0, p = prog().s; for (var k in p) s += p[k]; return s; }

  /* ================= CSS ================= */
  var SEA = 'background:linear-gradient(180deg,#7fe3ff 0%,#2ec4f1 22%,#1497d4 55%,#0b5fa5 100%)';
  var st = document.createElement('style');
  st.textContent = '' +
  '.mg-root{position:fixed;inset:0;height:100vh;height:100dvh;z-index:100000;display:none;flex-direction:column;color:#fff;font-family:' + TF + ';-webkit-font-smoothing:antialiased;-webkit-user-select:none;user-select:none;overflow:hidden;' + SEA + '}' +
  '.mg-root.on{display:flex}.mg-root *{box-sizing:border-box}' +
  /* sóng biển chuyển động */
  '.mg-wv{position:absolute;inset:-20% -50%;pointer-events:none;opacity:.35;background-image:radial-gradient(ellipse 40px 9px at 50% 100%,transparent 60%,rgba(255,255,255,.9) 62%,transparent 75%);background-size:120px 70px;animation:mgWv 9s linear infinite}' +
  '.mg-wv.b{opacity:.2;background-size:180px 110px;animation-duration:14s;animation-direction:reverse}' +
  '@keyframes mgWv{from{transform:translate(0,0)}to{transform:translate(120px,70px)}}' +
  '.mg-sun{position:absolute;left:0;right:0;top:0;height:40%;pointer-events:none;background:radial-gradient(60% 70% at 80% -10%,rgba(255,250,200,.65),transparent 70%)}' +
  '.mg-bub{position:absolute;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.7),rgba(255,255,255,.08) 60%,transparent 70%);pointer-events:none;animation:mgUp linear infinite}' +
  '@keyframes mgUp{from{transform:translateY(110vh)}to{transform:translateY(-20vh)}}' +
  '.mg-scr{display:none;flex:1;flex-direction:column;min-height:0;position:relative;z-index:1}.mg-scr.on{display:flex}' +
  '.mg-top{display:flex;align-items:center;gap:8px;padding:max(8px,env(safe-area-inset-top)) 10px 6px}' +
  '.mg-t{flex:1;min-width:0;font-size:17px;font-weight:900;line-height:1.2;text-shadow:0 2px 6px rgba(0,40,90,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.mg-btn{border:0;border-radius:14px;padding:9px 14px;font:800 15px ' + TF + ';color:#fff;background:rgba(0,50,100,.28);cursor:pointer;box-shadow:inset 0 -3px 0 rgba(0,0,0,.15)}' +
  '.mg-btn:active{transform:scale(.96)}.mg-btn.ic{padding:7px 10px;font-size:18px;min-width:40px}.mg-btn.off{opacity:.45}' +
  '.mg-btn.go{background:linear-gradient(180deg,#5ef08a,#18b45a);box-shadow:inset 0 -4px 0 #0e8a43,0 6px 16px rgba(20,160,80,.4);font-size:18px;padding:13px 22px}' +
  '.mg-btn.pk{background:linear-gradient(180deg,#38c8f5,#0b80c8);box-shadow:inset 0 -4px 0 #075e94,0 6px 16px rgba(10,110,180,.35)}' +
  '.mg-home{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px 18px max(24px,env(safe-area-inset-bottom));text-align:center}' +
  '.mg-logo{font-size:38px;font-weight:900;line-height:1.1;background:linear-gradient(180deg,#fff7a8,#ffd23f 45%,#ff8a00);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 #0b4f8a) drop-shadow(0 8px 14px rgba(0,40,80,.5))}' +
  '.mg-isl0{font-size:64px;font-family:' + EF + ';animation:mgBob 2.6s ease-in-out infinite}@keyframes mgBob{50%{transform:translateY(-8px)}}' +
  '.mg-lang{display:flex;gap:12px;width:100%;max-width:420px}' +
  '.mg-lc{flex:1;border:0;border-radius:22px;padding:18px 8px;color:#fff;cursor:pointer;font-family:inherit;box-shadow:0 10px 24px rgba(0,40,80,.35),inset 0 -5px 0 rgba(0,0,0,.18)}' +
  '.mg-lc .f{font-size:42px;font-family:' + EF + '}.mg-lc b{display:block;font-size:19px;margin-top:4px}.mg-lc small{display:block;font-size:12.5px;opacity:.92;margin-top:3px}' +
  '.mg-how{max-width:420px;background:rgba(0,50,100,.28);border-radius:18px;padding:12px 14px;font-size:13.5px;line-height:1.55;text-align:left}' +
  /* ---- bản đồ biển với các hòn đảo ---- */
  '.mg-map{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;position:relative}' +
  '.mg-sea{position:relative;width:100%;max-width:560px;margin:0 auto}' +
  '.mg-route{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none}' +
  '.mg-isl{position:absolute;width:86%;height:268px}' +
  '.mg-isl svg.land{position:absolute;inset:0;width:100%;height:100%;overflow:visible}' +
  '.mg-isl .deco{position:absolute;font-family:' + EF + ';pointer-events:none;filter:drop-shadow(0 3px 2px rgba(0,60,40,.35))}' +
  '.mg-isl .ico{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:66px;height:66px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:38px;font-family:' + EF + ';box-shadow:0 4px 0 rgba(0,0,0,.15),0 0 0 4px rgba(255,255,255,.45)}' +
  '.mg-isl .sign{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);max-width:92%;background:linear-gradient(180deg,#b7793f,#8a5326);border:2px solid #5d3415;border-radius:10px;padding:4px 12px;font-size:13.5px;font-weight:900;color:#fff7e0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 4px 0 #5d3415,0 6px 10px rgba(0,0,0,.3);text-shadow:0 1px 2px rgba(0,0,0,.4)}' +
  '.mg-isl .sign small{font-weight:700;opacity:.85}' +
  '.mg-node{position:absolute;width:52px;margin:-26px 0 0 -26px;border:0;background:none;color:#fff;cursor:pointer;font-family:inherit;padding:0;display:flex;flex-direction:column;align-items:center}' +
  '.mg-node i{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:20px;font-weight:900;' +
    'background:radial-gradient(circle at 35% 30%,#fff 0,#ffe27a 22%,#ffb300 60%,#e07b00 100%);color:#6a3300;box-shadow:0 5px 0 #a65400,0 8px 12px rgba(0,0,0,.3);border:3px solid #fff}' +
  '.mg-node.cur i{animation:mgPulse 1.1s ease-in-out infinite;background:radial-gradient(circle at 35% 30%,#fff 0,#a8ffcf 22%,#21d07a 60%,#0d8a4c 100%);color:#04381d;box-shadow:0 5px 0 #08663a,0 0 0 7px rgba(255,255,255,.4)}' +
  '@keyframes mgPulse{50%{transform:scale(1.12)}}' +
  '.mg-node.lock i{background:radial-gradient(circle at 35% 30%,#f4f4f4,#a8a8b8);color:#555;box-shadow:0 5px 0 #6d6d80;font-size:18px;border-color:#ddd}' +
  '.mg-node b{font-size:13px;letter-spacing:.5px;color:#fff59d;text-shadow:0 1px 3px rgba(0,0,0,.8);min-height:16px;margin-top:2px;white-space:nowrap}' +
  '.mg-boat{position:absolute;font-size:40px;font-family:' + EF + ';animation:mgRock 2.4s ease-in-out infinite;pointer-events:none;z-index:2}@keyframes mgRock{50%{transform:rotate(-8deg) translateY(-4px)}}' +
  '.mg-fish{position:absolute;font-size:24px;font-family:' + EF + ';opacity:.85;pointer-events:none}' +
  /* ---- màn chơi ---- */
  '.mg-hud{display:flex;align-items:stretch;gap:6px;padding:0 8px 5px}' +
  '.mg-box{background:rgba(0,45,95,.38);border:2px solid rgba(255,255,255,.4);border-radius:14px;padding:4px 8px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:58px}' +
  '.mg-box small{font-size:10px;font-weight:800;letter-spacing:.5px;opacity:.9;text-transform:uppercase}.mg-box b{font-size:22px;line-height:1.1;font-variant-numeric:tabular-nums}' +
  '.mg-sc{flex:1;align-items:stretch;min-width:0}.mg-pb{position:relative;height:9px;border-radius:6px;background:rgba(255,255,255,.28);margin-top:3px;overflow:hidden}.mg-pb i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,#ffe066,#ff9f1c)}' +
  '.mg-st{font-size:16px;letter-spacing:2px;line-height:1.2}.mg-st span{filter:grayscale(1) brightness(1.4);opacity:.55}.mg-st span.on{filter:none;opacity:1}' +
  '.mg-goals{display:flex;gap:4px;padding:0 8px 6px;justify-content:center}' +
  '.mg-g{flex:1 1 0;min-width:0;max-width:64px;background:rgba(255,255,255,.92);color:#0b4f8a;border-radius:12px;padding:3px 2px 2px;display:flex;flex-direction:column;align-items:center;line-height:1;box-shadow:0 3px 0 rgba(0,40,80,.25);position:relative}' +
  '.mg-g b{font-size:13px;font-weight:900;margin-top:2px;font-variant-numeric:tabular-nums}.mg-g.ok{background:#d9ffe6;color:#0d8a4c}.mg-g.ok:after{content:"✓";position:absolute;top:-6px;right:-3px;background:#18b45a;color:#fff;border-radius:50%;width:17px;height:17px;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center}' +
  '.mg-stage{position:relative;flex:1;min-height:0;touch-action:none}.mg-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;touch-action:none}' +
  '.mg-card{margin:0 8px max(8px,env(safe-area-inset-bottom));border-radius:18px;background:linear-gradient(180deg,#fff,#eafaff);color:#08406e;display:flex;align-items:center;gap:10px;padding:7px 10px;min-height:68px;box-shadow:0 8px 22px rgba(0,40,80,.35)}' +
  '.mg-card .pic{flex:none;width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:#dff4ff}' +
  '.mg-card .tx{flex:1;min-width:0}.mg-card .w{font-size:23px;font-weight:900;line-height:1.15;color:#0b6fb8;word-break:break-word}.mg-card .py{font-size:14px;color:#e8590c;font-weight:700}.mg-card .m{font-size:15.5px;font-weight:700;color:#08406e}' +
  '.mg-card .say{flex:none;border:0;width:44px;height:44px;border-radius:50%;background:linear-gradient(180deg,#38c8f5,#0b80c8);color:#fff;font-size:19px;cursor:pointer;box-shadow:inset 0 -3px 0 rgba(0,0,0,.2)}' +
  '.mg-card.pop{animation:mgCard .35s ease}@keyframes mgCard{0%{transform:scale(.94)}60%{transform:scale(1.03)}100%{transform:scale(1)}}' +
  '.mg-mod{position:absolute;inset:0;z-index:5;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,30,60,.6)}.mg-mod.on{display:flex}' +
  '.mg-pan{width:100%;max-width:420px;max-height:100%;overflow-y:auto;border-radius:26px;background:linear-gradient(180deg,#fff,#eafaff);color:#08406e;padding:16px 14px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.45);animation:mgIn .3s ease;border:4px solid #7fe3ff}' +
  '@keyframes mgIn{from{transform:scale(.85);opacity:0}}' +
  '.mg-pan h2{margin:2px 0 6px;font-size:22px;color:#0b6fb8}.mg-pan p{margin:6px 0;font-size:14px;line-height:1.5}' +
  '.mg-stars{font-size:44px;letter-spacing:6px;margin:2px 0}.mg-stars span{display:inline-block;filter:grayscale(1);opacity:.3}.mg-stars span.on{filter:none;opacity:1;animation:mgStar .5s ease both}@keyframes mgStar{0%{transform:scale(0) rotate(-90deg)}70%{transform:scale(1.3)}100%{transform:scale(1)}}' +
  '.mg-rule{background:#fff8dc;border-radius:12px;padding:7px 10px;font-size:12.5px;line-height:1.5;text-align:left;color:#6a4a00;margin:8px 0}' +
  '.mg-wl{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:7px;margin:8px 0;text-align:center}' +
  '.mg-wi{background:#dff4ff;border-radius:14px;padding:7px 4px;cursor:pointer}.mg-wi b{display:block;font-size:15px;color:#0b6fb8;margin-top:2px;word-break:break-word}.mg-wi i{display:block;font-style:normal;font-size:12px;color:#e8590c}.mg-wi small{font-size:12.5px;display:block}' +
  '.mg-wi.ok{background:#d9ffe6;box-shadow:inset 0 0 0 2px #18b45a}.mg-wi.no{background:#ffe8e8;box-shadow:inset 0 0 0 2px #ff7a7a}.mg-wi em{display:block;font-style:normal;font-size:11.5px;font-weight:800;margin-top:2px}' +
  '.mg-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px}' +
  '.mg-load{flex:1;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800}';
  document.head.appendChild(st);

  /* ================= DOM ================= */
  var root = document.createElement('div'); root.className = 'mg-root';
  var bubs = '<div class="mg-wv"></div><div class="mg-wv b"></div><div class="mg-sun"></div>';
  for (var bi = 0; bi < 10; bi++) { var sz0 = 10 + Math.round(Math.random() * 30); bubs += '<div class="mg-bub" style="left:' + Math.round(Math.random() * 96) + '%;width:' + sz0 + 'px;height:' + sz0 + 'px;animation-duration:' + (10 + Math.random() * 12).toFixed(1) + 's;animation-delay:-' + (Math.random() * 15).toFixed(1) + 's"></div>'; }
  root.innerHTML = bubs +
  '<div class="mg-scr on" id="mgHome"><div class="mg-top"><button class="mg-btn ic" data-a="close">←</button><div class="mg-t"></div><button class="mg-btn" data-a="close">✕ Đóng</button></div>' +
    '<div class="mg-home"><div class="mg-isl0">🏝️</div><div class="mg-logo">PHÁ ĐẢO<br>CHỦ ĐỀ</div>' +
    '<div class="mg-lang"><button class="mg-lc" data-a="lang" data-l="en" style="background:linear-gradient(160deg,#4facfe,#2b5ce6)"><div class="f">🇬🇧</div><b>Tiếng Anh</b><small id="mgPEn"></small></button>' +
    '<button class="mg-lc" data-a="lang" data-l="zh" style="background:linear-gradient(160deg,#ff6b6b,#d62839)"><div class="f">🇨🇳</div><b>Tiếng Trung</b><small id="mgPZh"></small></button></div>' +
    '<div class="mg-how" id="mgHow"></div></div></div>' +
  '<div class="mg-scr" id="mgMapS"><div class="mg-top"><button class="mg-btn ic" data-a="home">←</button><div class="mg-t" id="mgMapT"></div><button class="mg-btn ic" data-a="help">❔</button></div><div class="mg-map" id="mgMap"></div></div>' +
  '<div class="mg-scr" id="mgLoad"><div class="mg-load">🏝️ Đang ra đảo…</div></div>' +
  '<div class="mg-scr" id="mgPlay"><div class="mg-top"><button class="mg-btn ic" data-a="pause">←</button><div class="mg-t" id="mgLvT"></div>' +
    '<button class="mg-btn ic" id="mgMu" data-a="music">🎵</button><button class="mg-btn ic" id="mgVo" data-a="voice">🔊</button></div>' +
    '<div class="mg-hud"><div class="mg-box" style="min-width:74px"><small>⏱ Thời gian</small><b id="mgTime">0:00</b></div>' +
      '<div class="mg-box mg-sc"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px"><small>Từ đã xong</small><b id="mgScore" style="font-size:19px">0</b></div><div class="mg-pb"><i id="mgPbI"></i></div></div>' +
      '<div class="mg-box"><small id="mgTg">Sao</small><div class="mg-st" id="mgSt"></div></div></div>' +
    '<div class="mg-goals" id="mgGoals"></div>' +
    '<div class="mg-stage" id="mgStage"><canvas id="mgCv"></canvas></div>' +
    '<div class="mg-card" id="mgCard"><div class="pic" id="mgCP"></div><div class="tx"><div class="w" id="mgCW"></div><div class="py" id="mgCY"></div><div class="m" id="mgCM"></div></div><button class="say" data-a="sayc">🔊</button></div></div>' +
  '<div class="mg-mod" id="mgMod"><div class="mg-pan" id="mgPan"></div></div>';
  document.body.appendChild(root);

  var RULES = '👉 Vuốt hoặc chạm để <b>đổi chỗ 2 viên kẹo cạnh nhau</b>, tạo hàng 3 viên giống nhau trở lên.<br>🔊 Ăn viên nào, app <b>đọc từ</b> đó và hiện <b>chữ + nghĩa</b> ở dưới cùng.<br>' +
    '✅ Ăn đủ <b>tất cả các từ</b> trong danh sách là qua màn. Không giới hạn lượt, cứ thong thả học.<br>⏱ Mỗi màn có đồng hồ bấm giờ: xong càng nhanh càng nhiều ⭐.<br>' +
    '✨ Hàng 4 → kẹo sọc phá cả hàng · Hình L, T → kẹo gói nổ tung · Hàng 5 → kẹo cầu vồng xoá cả loại.<br>🏝️ Mỗi đảo là 1 chủ đề, các màn trên đảo chứa đủ mọi từ của chủ đề. Mỗi ⭐ được <b>+' + money(STAR_PRICE) + '</b> vào Nông trại.';
  $('mgHow').innerHTML = RULES;

  var scr = { home: $('mgHome'), map: $('mgMapS'), load: $('mgLoad'), play: $('mgPlay') };
  function show(k) { for (var n in scr) scr[n].classList.toggle('on', n === k); if (k !== 'play') musicStop(); }
  function modal(h) { $('mgPan').innerHTML = h; $('mgMod').classList.add('on'); $('mgPan').scrollTop = 0; }
  function unmodal() { $('mgMod').classList.remove('on'); }

  /* ================= TRANG CHỌN NGÔN NGỮ & BẢN ĐỒ ================= */
  var FIXED = '';   // mở từ game tiếng Anh/Trung: chỉ chơi ngôn ngữ đó, nút ← quay về game cũ
  function renderHome() {
    ['en', 'zh'].forEach(function (l) {
      var keep = LANG; LANG = l; var s = totalStars(); LANG = keep;
      $(l === 'en' ? 'mgPEn' : 'mgPZh').textContent = s ? '⭐ ' + s + ' sao' : 'Bắt đầu phá đảo';
    });
  }
  function openLang(l) {
    LANG = l;
    show('load');
    loadData(l).then(function () { renderMap(true); show('map'); })
      .catch(function () { if (FIXED) api.close(); else show('home'); modal('<h2>😢 Chưa mở được</h2><p>Không tải được từ vựng ' + (l === 'zh' ? 'tiếng Trung' : 'tiếng Anh') + '. Hãy kiểm tra mạng rồi thử lại.</p><div class="mg-acts"><button class="mg-btn go" data-a="unmod">Đã hiểu</button></div>'); });
  }
  /* Hình hòn đảo: viền mềm ngẫu nhiên nhưng cố định cho từng đảo */
  function blob(r0, cx, cy, rx, ry, jit, n) {
    var pts = [];
    for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, k = 1 + (r0() - 0.5) * jit; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    var d = '';
    for (var j = 0; j < n; j++) {
      var p0 = pts[(j - 1 + n) % n], p1 = pts[j], p2 = pts[(j + 1) % n], p3 = pts[(j + 2) % n];
      if (!j) d += 'M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }
  var ISH = 300;   // chiều cao mỗi đảo trên bản đồ
  var DECO = ['🌴', '🌴', '🌺', '🌿', '🍍', '🥥', '🐚', '🦀', '🌼', '🪨', '🐢', '⛱️'];
  function renderMap(scroll) {
    var tops = D().topics, cur = -1, h = '', route = '', TH = tops.length * ISH + 140;
    for (var L = 0; L < levelCount(); L++) if (unlocked(L) && !starsOf(L)) { cur = L; break; }
    $('mgMapT').textContent = (LANG === 'zh' ? '🇨🇳 Tiếng Trung' : '🇬🇧 Tiếng Anh') + ' · ⭐ ' + totalStars() + '/' + levelCount() * 3;
    var curT = cur < 0 ? tops.length - 1 : D().levels[cur].ti, centers = [];
    tops.forEach(function (t, ti) {
      var left = ti % 2 === 0, top = 40 + ti * ISH, r0 = rng(hashS(t.id) + 7);
      centers.push([left ? 45 : 55, top + 134]);
      var dHalo = blob(r0, 150, 128, 146, 112, 0.18, 9), dSand = blob(r0, 150, 128, 128, 96, 0.2, 10), dGrass = blob(r0, 150, 120, 100, 72, 0.26, 9);
      var col = t.c;
      h += '<div class="mg-isl" id="mgIsl' + ti + '" style="top:' + top + 'px;' + (left ? 'left:1%' : 'right:1%') + '">' +
        '<svg class="land" viewBox="0 0 300 256" preserveAspectRatio="none">' +
          '<path d="' + dHalo + '" fill="#9ff0ff" opacity=".55"/>' +
          '<path d="' + dSand + '" fill="#f7d98b" stroke="#e8bf62" stroke-width="3"/>' +
          '<path d="' + dGrass + '" fill="' + col + '" opacity=".28"/>' +
          '<path d="' + dGrass + '" fill="url(#mgGr)" opacity=".85"/>' +
        '</svg>';
      // đồ trang trí trên đảo
      var dc = [[14, 30], [80, 24], [10, 70], [86, 66], [30, 16]];
      dc.forEach(function (p, k) { var e = DECO[Math.floor(r0() * DECO.length)]; h += '<span class="deco" style="left:' + p[0] + '%;top:' + p[1] + '%;font-size:' + (k < 2 ? 30 : 22) + 'px">' + e + '</span>'; });
      h += '<div class="ico">' + t.i + '</div>';
      // các màn đặt quanh đảo theo hình elip
      var lv = t.levels, n = lv.length;
      lv.forEach(function (x, k) {
        var a = n === 1 ? Math.PI * 0.75 : Math.PI * (0.78 + 1.44 * k / (n - 1)), px = 50 + Math.cos(a) * 37, py = 47 + Math.sin(a) * 34;
        var L2 = x.L, ok = unlocked(L2), sv = starsOf(L2);
        h += '<button class="mg-node' + (!ok ? ' lock' : L2 === cur ? ' cur' : '') + '" data-a="lvl" data-l="' + L2 + '" style="left:' + px.toFixed(1) + '%;top:' + py.toFixed(1) + '%"><i>' + (ok ? (k + 1) : qzGate(L2) ? '📝' : '🔒') + '</i><b>' + (ok ? '★'.repeat(sv) + '☆'.repeat(3 - sv) : '') + '</b></button>';
      });
      h += '<div class="sign">Đảo ' + (ti + 1) + ': ' + esc(t.n) + ' <small>· ' + t.w.length + ' từ</small></div></div>';
      if (ti % 3 === 1) h += '<span class="mg-fish" style="top:' + (top + ISH - 30) + 'px;' + (left ? 'right:8%' : 'left:8%') + '">' + ['🐠', '🐬', '🐟', '🦈', '🐙'][ti % 5] + '</span>';
    });
    for (var i = 1; i < centers.length; i++) { var a = centers[i - 1], b = centers[i]; route += 'M' + a[0] + ' ' + a[1] + ' C' + a[0] + ' ' + (a[1] + 140) + ' ' + b[0] + ' ' + (b[1] - 140) + ' ' + b[0] + ' ' + b[1] + ' '; }
    var bc = centers[curT] || [50, 100];
    var html = '<div class="mg-sea" style="height:' + TH + 'px">' +
      '<svg class="mg-route" viewBox="0 0 100 ' + TH + '" preserveAspectRatio="none"><defs><linearGradient id="mgGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8be36a"/><stop offset="1" stop-color="#3fa34d"/></linearGradient></defs>' +
      '<path d="' + route + '" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>' +
      h + '<span class="mg-boat" style="top:' + (bc[1] - 150) + 'px;' + (curT % 2 === 0 ? 'right:6%' : 'left:6%') + '">⛵</span></div>';
    $('mgMap').innerHTML = html;
    if (scroll) setTimeout(function () { var e = $('mgIsl' + curT); if (e) $('mgMap').scrollTop = Math.max(0, e.offsetTop - 80); }, 30);
  }
  // (bản 2026.11.08-8) Phiên âm: tiếng Anh = chỉ IPA (đã bỏ cách đọc kiểu Việt); tiếng Trung = pinyin · cách đọc kiểu Việt
  function prTxt(w) { var A = langApi(LANG); try { if (A && A.data && A.data.pron) return A.data.pron(w) || ''; } catch (e) {} return LANG === 'zh' ? (w[3] || '') : ''; }
  function wordHtml(w, sz) {
    var pr = prTxt(w);
    return picHtml(w[2], sz) + '<b>' + esc(w[0]) + '</b>' + (pr ? '<i>' + esc(pr) + '</i>' : '') + '<small>' + esc(w[1]) + '</small>';
  }
  var PRE = null;
  function preLevel(L) {
    var def = levelDef(L); PRE = def;
    modal('<div style="font-size:14px;font-weight:800;color:#0b80c8">' + def.topic.i + ' Đảo ' + (def.ti + 1) + ' · Màn ' + (def.sub + 1) + '/' + def.nsub + '</div><h2>' + esc(def.topic.n) + '</h2>' +
      '<div class="mg-stars">' + [1, 2, 3].map(function (i) { return '<span class="' + (starsOf(L) >= i ? 'on' : '') + '">⭐</span>'; }).join('') + '</div>' +
      '<p>🎯 Ăn mỗi từ <b>' + def.quota + ' viên</b>. Ăn đủ <b>tất cả ' + def.K + ' từ</b> dưới đây là qua màn. Không giới hạn lượt.</p>' +
      (def.ice ? '<div class="mg-rule" style="background:#e3f6ff;color:#0b5f94">🧊 <b>Màn cuối đảo – có lớp băng!</b><br>Nhiều viên kẹo được phủ băng. Ăn lần 1 chỉ làm vỡ băng (chưa tính), ăn thêm lần nữa mới được tính.</div>' : '') +
      '<div class="mg-rule">⏱ Xong trong <b>' + mmss(def.t3) + '</b>: ⭐⭐⭐ &nbsp;·&nbsp; trong <b>' + mmss(def.t2) + '</b>: ⭐⭐ &nbsp;·&nbsp; chậm hơn: ⭐' + (bestT(L) ? '<br>🏅 Thời gian tốt nhất của bạn: <b>' + mmss(bestT(L)) + '</b>' : '') + '</div>' +
      '<p style="font-size:13px;color:#4a7aa0;margin-bottom:0">Các từ trong màn này (chạm để nghe):</p>' +
      '<div class="mg-wl">' + def.words.map(function (w, i) { return '<div class="mg-wi" data-a="sayw" data-i="' + i + '">' + wordHtml(w, 34) + '</div>'; }).join('') + '</div>' +
      '<div class="mg-acts"><button class="mg-btn pk" data-a="unmod">Để sau</button><button class="mg-btn go" data-a="start">▶ Chơi</button></div>');
  }

  /* ================= TRẠNG THÁI VÁN CHƠI ================= */
  var G = null, cv = $('mgCv'), ctx = cv.getContext('2d'), stage = $('mgStage');
  var W = 0, H = 0, DPR = 1, S = 40, OX = 0, OY = 0, raf = 0, SPR = {}, tid = 1;
  var tweens = [], parts = [], texts = [], beams = [], shake = 0, banner = null;
  var NC = C * R;
  function cell(r, c) { return G.b[r * C + c]; }
  function setCell(r, c, t) { G.b[r * C + c] = t; }
  function mk(t, sp) { return { id: tid++, t: t, sp: sp || '', x: 0, y: 0, s: 1, a: 1, ice: 0, ia: 0 }; }
  var ICE0 = 0.4, ICE1 = 0.22;                 // màn cuối đảo: 40% kẹo lúc đầu & 22% kẹo rơi xuống có lớp băng
  function frost(tl) { if (G && G.def.ice && tl && !tl.sp && tl.t >= 0) { tl.ice = 1; tl.ia = 1; } return tl; }
  function rowOf(i) { return Math.floor(i / C); }
  function colOf(i) { return i % C; }

  function start(def) {
    hush(); unmodal();
    G = { def: def, K: def.K, b: new Array(NC), moves: 0, score: 0, ms: 0, busy: true, sel: null, got: [], spoken: [], hintT: 0, hint: null, over: false };
    for (var i = 0; i < def.K; i++) G.got[i] = 0;
    do { for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) { var t; do { t = Math.floor(Math.random() * G.K); } while ((c >= 2 && cell(r, c - 1).t === t && cell(r, c - 2).t === t) || (r >= 2 && cell(r - 1, c).t === t && cell(r - 2, c).t === t)); setCell(r, c, mk(t)); } } while (!findMove());
    for (var r2 = 0; r2 < R; r2++) for (var c2 = 0; c2 < C; c2++) { var tl = cell(r2, c2); tl.x = c2; tl.y = r2 - R - 1 - Math.random() * 2; if (Math.random() < ICE0) frost(tl); }
    $('mgLvT').textContent = def.topic.i + ' Đảo ' + (def.ti + 1) + ' · Màn ' + (def.sub + 1) + '/' + def.nsub;
    $('mgMu').classList.toggle('off', !MUS.on); $('mgVo').classList.toggle('off', !VOICE.on);
    cardWord(0, false);
    show('play'); resize(); hud(); musicStart(); sfx('splash');
    if (def.ice) banner = { s: '🧊 Ice!', l: 1.4 };
    cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop);
    gravityAnim().then(function () { G.busy = false; G.hintT = performance.now(); });
  }

  /* ================= GIAO DIỆN TRONG VÁN ================= */
  function doneCount() { var n = 0; for (var i = 0; i < G.K; i++) if (G.got[i] >= G.def.quota) n++; return n; }
  function timeStars(sec) { return sec <= G.def.t3 ? 3 : sec <= G.def.t2 ? 2 : 1; }
  function curStars() { return timeStars(G.ms / 1000); }
  var lastTT = '';
  function tickTime() {
    var t = mmss(G.ms / 1000); if (t === lastTT) return; lastTT = t; $('mgTime').textContent = t;
    var s = curStars(), nx = s === 3 ? G.def.t3 : s === 2 ? G.def.t2 : 0;
    $('mgSt').innerHTML = [1, 2, 3].map(function (i) { return '<span class="' + (s >= i ? 'on' : '') + '">⭐</span>'; }).join('');
    $('mgTg').textContent = nx ? 'còn ' + mmss(nx - G.ms / 1000) : 'Sao';
  }
  function hud() {
    if (!G) return;
    var dn = doneCount(), tot = 0; for (var q = 0; q < G.K; q++) tot += Math.min(G.def.quota, G.got[q]);
    $('mgScore').textContent = dn + '/' + G.K;
    $('mgPbI').style.width = Math.min(100, tot / (G.K * G.def.quota) * 100) + '%';
    lastTT = ''; tickTime();
    var gh = '';
    for (var i = 0; i < G.K; i++) { var left = Math.max(0, G.def.quota - G.got[i]); gh += '<div class="mg-g' + (left ? '' : ' ok') + '">' + picHtml(G.def.words[i][2], 24) + '<b>' + left + '</b></div>'; }
    $('mgGoals').innerHTML = gh;
  }
  var cardT = -1;
  function cardWord(t, pop) {
    if (!G || t < 0 || t >= G.K) return;
    var w = G.def.words[t]; cardT = t;
    $('mgCP').innerHTML = picHtml(w[2], 40); $('mgCW').textContent = w[0];
    var pr = prTxt(w); $('mgCY').textContent = pr; $('mgCY').style.display = pr ? '' : 'none';
    $('mgCM').textContent = w[1];
    if (pop) { var c = $('mgCard'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
  }
  /* Ăn kẹo loại t: hiện từ ở dưới cùng và đọc to (mỗi lượt đọc tối đa 3 từ khác nhau để không bị dồn) */
  function announce(t) {
    if (t < 0 || t >= G.K || G.spoken.indexOf(t) > -1) return;
    G.spoken.push(t);
    if (G.spoken.length > 3) return;
    cardWord(t, true); say(G.def.words[t][0], G.spoken.length === 1);
  }

  /* ================= VẼ ================= */
  function resize() {
    var r = stage.getBoundingClientRect(); DPR = Math.min(3, window.devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    S = Math.floor(Math.min((W - 12) / C, (H - 10) / R)); OX = Math.round((W - S * C) / 2); OY = Math.max(4, Math.round((H - S * R) / 2));
    SPR = {};
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function drawPic(c, p, cx, cy, sz) {
    var im = picImg(p);
    if (im) { if (im.complete && im.naturalWidth) c.drawImage(im, cx - sz / 2, cy - sz / 2, sz, sz); else im.addEventListener('load', function () { SPR = {}; }, { once: true }); return; }
    c.font = Math.round(sz * 0.86) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(p, cx, cy + sz * 0.04);
  }
  function candy(t, sp) {
    var px = Math.max(8, Math.round(S * DPR)), o = document.createElement('canvas'); o.width = o.height = px;
    var c = o.getContext('2d'), m = px * 0.05, w = px - 2 * m;
    if (sp === 'b') {   // kẹo cầu vồng: viên sô-cô-la rắc cốm 6 màu
      var g0 = c.createRadialGradient(px * 0.38, px * 0.34, px * 0.05, px / 2, px / 2, px * 0.46);
      g0.addColorStop(0, '#8d5a3b'); g0.addColorStop(0.6, '#5a321c'); g0.addColorStop(1, '#2e160a');
      c.fillStyle = g0; c.beginPath(); c.arc(px / 2, px / 2, px * 0.44, 0, 7); c.fill();
      var rr = rng(7);
      for (var i = 0; i < 26; i++) { var a = rr() * 6.28, d = rr() * px * 0.36; c.save(); c.translate(px / 2 + Math.cos(a) * d, px / 2 + Math.sin(a) * d); c.rotate(rr() * 3); c.fillStyle = COLORS[i % 6]; rrect(c, -px * 0.035, -px * 0.012, px * 0.07, px * 0.024, px * 0.012); c.fill(); c.restore(); }
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(px * 0.38, px * 0.3, px * 0.16, px * 0.08, -0.6, 0, 7); c.fill();
      return o;
    }
    var col = COLORS[t % 6];
    c.save(); c.shadowColor = 'rgba(0,30,60,.35)'; c.shadowBlur = px * 0.05; c.shadowOffsetY = px * 0.035;
    rrect(c, m, m, w, w, px * 0.24);
    var g = c.createRadialGradient(px * 0.35, px * 0.3, px * 0.05, px / 2, px / 2, px * 0.62);
    g.addColorStop(0, shade(col, 0.55)); g.addColorStop(0.45, col); g.addColorStop(1, shade(col, -0.35));
    c.fillStyle = g; c.fill(); c.restore();
    rrect(c, m, m, w, w, px * 0.24); c.lineWidth = px * 0.03; c.strokeStyle = shade(col, -0.45); c.stroke();
    if (sp === 'h' || sp === 'v') {   // kẹo sọc
      c.save(); rrect(c, m, m, w, w, px * 0.24); c.clip(); c.fillStyle = 'rgba(255,255,255,.8)';
      for (var k = 0; k < 4; k++) { var p0 = m + w * (0.1 + k * 0.25); if (sp === 'h') c.fillRect(m, p0, w, w * 0.1); else c.fillRect(p0, m, w * 0.1, w); }
      c.restore();
    }
    if (sp === 'w') {   // kẹo gói: viền vàng + 2 tai gói
      c.lineWidth = px * 0.08; c.strokeStyle = '#ffe14d'; rrect(c, m + px * 0.035, m + px * 0.035, w - px * 0.07, w - px * 0.07, px * 0.2); c.stroke();
      c.fillStyle = '#ffd000';
      [[m, px / 2, -1], [px - m, px / 2, 1]].forEach(function (e) { c.beginPath(); c.moveTo(e[0], e[1]); c.lineTo(e[0] + e[2] * px * 0.06, e[1] - px * 0.14); c.lineTo(e[0] + e[2] * px * 0.06, e[1] + px * 0.14); c.closePath(); c.fill(); });
    }
    // Ô tròn sáng ở giữa để hình từ vựng luôn rõ, hình chiếm gần hết viên kẹo
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(px / 2, px / 2 + px * 0.01, px * 0.37, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(px * 0.3, px * 0.17, px * 0.14, px * 0.055, -0.5, 0, 7); c.fill();
    drawPic(c, G.def.words[t][2], px / 2, px / 2 + px * 0.01, px * 0.62);
    return o;
  }
  /* Lớp băng phủ trên viên kẹo (màn cuối đảo) */
  function iceSprite() {
    if (SPR.ice) return SPR.ice;
    var px = Math.max(8, Math.round(S * DPR)), o = document.createElement('canvas'); o.width = o.height = px;
    var c = o.getContext('2d'), m = px * 0.03, w = px - 2 * m;
    rrect(c, m, m, w, w, px * 0.24);
    var g = c.createLinearGradient(0, 0, px, px);
    g.addColorStop(0, 'rgba(235,250,255,.62)'); g.addColorStop(0.5, 'rgba(170,225,255,.42)'); g.addColorStop(1, 'rgba(120,200,250,.58)');
    c.fillStyle = g; c.fill();
    c.lineWidth = px * 0.06; c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke();
    rrect(c, m + px * 0.06, m + px * 0.06, w - px * 0.12, w - px * 0.12, px * 0.18); c.lineWidth = px * 0.025; c.strokeStyle = 'rgba(90,180,240,.8)'; c.stroke();
    c.save(); rrect(c, m, m, w, w, px * 0.24); c.clip();
    c.fillStyle = 'rgba(255,255,255,.75)';
    c.beginPath(); c.moveTo(px * 0.1, px * 0.42); c.lineTo(px * 0.42, px * 0.1); c.lineTo(px * 0.52, px * 0.1); c.lineTo(px * 0.1, px * 0.52); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(px * 0.55, px * 0.92); c.lineTo(px * 0.92, px * 0.55); c.lineTo(px * 0.92, px * 0.62); c.lineTo(px * 0.62, px * 0.92); c.closePath(); c.fill();
    c.restore();
    c.font = Math.round(px * 0.26) + 'px ' + EF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('❄️', px * 0.8, px * 0.2);
    return (SPR.ice = o);
  }
  function iceBurst(r, c) {
    var x = c * S + S / 2, y = r * S + S / 2;
    for (var i = 0; i < 10; i++) { var a = Math.random() * 6.28, v = 150 + Math.random() * 150; parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 100, r: S * (0.05 + Math.random() * 0.06), c: i % 2 ? '#bfeaff' : '#ffffff', l: 1, k: 1.8 + Math.random(), st: i % 3 === 0 }); }
  }
  function sprite(t, sp) { var k = sp === 'b' ? 'b' : t + (sp || ''); return SPR[k] || (SPR[k] = candy(t, sp)); }

  var last = 0;
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (var i = tweens.length - 1; i >= 0; i--) { var tw = tweens[i], p = Math.min(1, (now - tw.t0) / tw.ms); tw.f(tw.e(p)); if (p >= 1) { tweens.splice(i, 1); tw.res(); } }
    if (G && !G.over && !$('mgMod').classList.contains('on') && !document.hidden) { G.ms += dt * 1000; tickTime(); }
    if (G && !G.busy && !G.over && now - G.hintT > 3500 && !G.hint) G.hint = findMove();
    draw(now, dt);
    raf = requestAnimationFrame(loop);
  }
  function draw(now, dt) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    if (!G) return;
    var sx = 0, sy = 0; if (shake > 0) { sx = (Math.random() - 0.5) * shake; sy = (Math.random() - 0.5) * shake; shake = Math.max(0, shake - dt * 40); }
    var BW = S * C, BH = S * R;
    ctx.save(); ctx.translate(OX + sx, OY + sy);
    // Khay kẹo kiểu bè gỗ trên biển
    ctx.fillStyle = 'rgba(0,40,90,.3)'; rrect(ctx, -6, -6, BW + 12, BH + 12, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2.5; ctx.stroke();
    for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) { ctx.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.24)'; rrect(ctx, c * S + 1, r * S + 1, S - 2, S - 2, S * 0.18); ctx.fill(); }
    ctx.save(); ctx.beginPath(); ctx.rect(-6, -6, BW + 12, BH + 12); ctx.clip();
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
      if (tl.ia > 0) { ctx.globalAlpha = tl.a * tl.ia; ctx.drawImage(iceSprite(), x, y, sz, sz); ctx.globalAlpha = tl.a; }
      if (G.sel && tl === G.sel.t) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; rrect(ctx, x + 2, y + 2, sz - 4, sz - 4, sz * 0.24); ctx.stroke(); }
    }
    ctx.globalAlpha = 1; ctx.restore();
    // Tia sáng của kẹo sọc
    for (var bI = beams.length - 1; bI >= 0; bI--) {
      var bm = beams[bI]; bm.l -= dt * 2.6; if (bm.l <= 0) { beams.splice(bI, 1); continue; }
      ctx.globalAlpha = bm.l; var gr;
      if (bm.d === 'h') { gr = ctx.createLinearGradient(0, bm.i * S, 0, bm.i * S + S); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(-6, bm.i * S + S * (0.5 - 0.4 * bm.l), BW + 12, S * 0.8 * bm.l); }
      else { gr = ctx.createLinearGradient(bm.i * S, 0, bm.i * S + S, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(bm.i * S + S * (0.5 - 0.4 * bm.l), -6, S * 0.8 * bm.l, BH + 12); }
    }
    ctx.globalAlpha = 1;
    // Hạt kẹo vỡ
    for (var pI = parts.length - 1; pI >= 0; pI--) {
      var p = parts[pI]; p.l -= dt * p.k; if (p.l <= 0) { parts.splice(pI, 1); continue; }
      p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      ctx.globalAlpha = Math.min(1, p.l * 1.6); ctx.fillStyle = p.c;
      if (p.st) star(ctx, p.x, p.y, p.r * p.l + 1); else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.4 + p.l * 0.6), 0, 7); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    // Chữ điểm bay lên
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (var tI = texts.length - 1; tI >= 0; tI--) {
      var tx = texts[tI]; tx.l -= dt * 1.3; if (tx.l <= 0) { texts.splice(tI, 1); continue; }
      ctx.globalAlpha = Math.min(1, tx.l * 2); ctx.font = '900 ' + Math.round(S * 0.4) + 'px ' + TF;
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,50,100,.85)'; ctx.strokeText(tx.s, tx.x, tx.y - (1 - tx.l) * S); ctx.fillStyle = tx.c; ctx.fillText(tx.s, tx.x, tx.y - (1 - tx.l) * S);
    }
    ctx.globalAlpha = 1; ctx.restore();
    // Chữ khen ở giữa màn hình
    if (banner) {
      banner.l -= dt * 0.9; if (banner.l <= 0) banner = null;
      else {
        var k = banner.l > 0.8 ? 1 + (banner.l - 0.8) * 4 : 1, fs = Math.min(W / 7, 56) * k;
        ctx.globalAlpha = Math.min(1, banner.l * 2.5); ctx.font = '900 ' + Math.round(fs) + 'px ' + TF; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var gy = ctx.createLinearGradient(0, H / 2 - fs / 2, 0, H / 2 + fs / 2); gy.addColorStop(0, '#fff7a8'); gy.addColorStop(0.5, '#ffd23f'); gy.addColorStop(1, '#ff8a00');
        ctx.lineWidth = 8; ctx.strokeStyle = '#0b4f8a'; ctx.strokeText(banner.s, W / 2, H / 2); ctx.fillStyle = gy; ctx.fillText(banner.s, W / 2, H / 2); ctx.globalAlpha = 1;
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
  function same(a, t) { return a && a.sp !== 'b' && a.t === t; }
  function runs() {
    var out = [];
    for (var r = 0; r < R; r++) for (var c = 0; c < C;) {
      var a = cell(r, c), t = a && a.sp !== 'b' ? a.t : -9, e = c + 1;
      while (e < C && t >= 0 && same(cell(r, e), t)) e++;
      if (t >= 0 && e - c >= 3) { var cs = []; for (var k = c; k < e; k++) cs.push(r * C + k); out.push({ d: 'h', t: t, cells: cs }); }
      c = e;
    }
    for (var c2 = 0; c2 < C; c2++) for (var r2 = 0; r2 < R;) {
      var b = cell(r2, c2), t2 = b && b.sp !== 'b' ? b.t : -9, e2 = r2 + 1;
      while (e2 < R && t2 >= 0 && same(cell(e2, c2), t2)) e2++;
      if (t2 >= 0 && e2 - r2 >= 3) { var cs2 = []; for (var k2 = r2; k2 < e2; k2++) cs2.push(k2 * C + c2); out.push({ d: 'v', t: t2, cells: cs2 }); }
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
    for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) {
      var i = r * C + c, a = G.b[i]; if (!a) continue;
      var nb = []; if (c < C - 1) nb.push(i + 1); if (r < R - 1) nb.push(i + C);
      for (var k = 0; k < nb.length; k++) {
        var j = nb[k], b = G.b[j]; if (!b) continue;
        if (a.sp === 'b' || b.sp === 'b' || (a.sp && b.sp)) return { a: a, b: b, i: i, j: j };
        swapIn(i, j); var ok = runs().some(function (rn) { return rn.cells.indexOf(i) > -1 || rn.cells.indexOf(j) > -1; }); swapIn(i, j);
        if (ok) return { a: a, b: b, i: i, j: j };
      }
    }
    return null;
  }
  /* Kẹo cầu vồng tự nổ: ưu tiên loại từ còn thiếu nhiều nhất (giúp người chơi ăn đủ từ) */
  function rainbowType() {
    var n = {}; G.b.forEach(function (t) { if (t && t.sp !== 'b' && t.t >= 0) n[t.t] = (n[t.t] || 0) + 1; });
    var best = -1, bt = 0; for (var k in n) { var need = Math.max(0, G.def.quota - G.got[k]) * 10 + n[k]; if (need > best) { best = need; bt = +k; } } return bt;
  }
  function blast(set, keep) {
    var q = Object.keys(set).map(Number), seen = {}, fx = { line: 0, boom: 0, rb: 0 };
    while (q.length) {
      var i = q.shift(); if (seen[i]) continue; seen[i] = 1;
      var tl = G.b[i]; if (!tl || keep[i]) continue;
      var r = rowOf(i), c = colOf(i), add = [];
      if (tl.sp === 'h') { for (var k = 0; k < C; k++) add.push(r * C + k); beams.push({ d: 'h', i: r, l: 1 }); fx.line++; }
      else if (tl.sp === 'v') { for (var k2 = 0; k2 < R; k2++) add.push(k2 * C + c); beams.push({ d: 'v', i: c, l: 1 }); fx.line++; }
      else if (tl.sp === 'w') { for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { var rr = r + dr, cc = c + dc; if (rr >= 0 && rr < R && cc >= 0 && cc < C) add.push(rr * C + cc); } fx.boom++; }
      else if (tl.sp === 'b') { var bt = rainbowType(); announce(bt); G.b.forEach(function (x, j) { if (x && x.t === bt && x.sp !== 'b') add.push(j); }); fx.rb++; }
      add.forEach(function (j) { if (!set[j] && !keep[j]) { set[j] = 1; q.push(j); } });
    }
    return fx;
  }
  function clearSet(set, creates, chain) {
    var keep = {}; creates.forEach(function (cr) { keep[cr.i] = 1; });
    var fx = blast(set, keep), n = 0, idx = [], before = doneCount();
    var cracked = [];
    for (var k in set) { k = +k; if (keep[k] || !G.b[k]) continue; if (G.b[k].ice) { cracked.push(k); continue; } idx.push(k); n++; }
    // Viên có lớp băng: lần ăn này chỉ làm vỡ băng, viên kẹo ở lại và chưa được tính
    cracked.forEach(function (i) { var tl = G.b[i]; tl.ice = 0; iceBurst(rowOf(i), colOf(i)); texts.push({ s: '🧊', x: colOf(i) * S + S / 2, y: rowOf(i) * S + S / 2, c: '#bfeaff', l: 1 }); tween(260, function (p) { tl.ia = 1 - p; }); });
    if (cracked.length) sfx('splash');
    if (fx.rb) sfx('rainbow'); else if (fx.boom) sfx('boom'); else if (fx.line) sfx('line'); else sfx('pop', chain);
    if (fx.boom || fx.rb) shake = Math.max(shake, 14); else if (fx.line) shake = Math.max(shake, 7);
    var pts = n * 60 * chain + (fx.line * 120) + (fx.boom * 200) + (fx.rb * 400);
    G.score += pts;
    var cx = 0, cy = 0;
    idx.forEach(function (i) {
      var tl = G.b[i], r = rowOf(i), c = colOf(i); cx += c; cy += r;
      if (tl.t >= 0 && tl.sp !== 'b') G.got[tl.t]++;
      burst(r, c, tl.sp === 'b' ? -1 : tl.t, !!tl.sp);
    });
    if (doneCount() > before) sfx('goal');
    creates.forEach(function (cr) { var tl = G.b[cr.i]; if (tl) { tl.t = cr.t; tl.sp = cr.sp; tl.ice = 0; tl.ia = 0; } });
    if (creates.length) sfx('make');
    var anims = idx.map(function (i) { var tl = G.b[i]; return tween(200, function (p) { tl.s = 1 + p * 0.25; tl.a = 1 - p; }, easeIn).then(function () { if (G && G.b[i] === tl) G.b[i] = null; }); });
    creates.forEach(function (cr) { var tl = G.b[cr.i]; if (tl) anims.push(tween(300, function (p) { tl.s = p < 0.5 ? 1 + p * 0.6 : 1.3 - (p - 0.5) * 0.6; })); });
    hud();
    if (!idx.length && cracked.length) anims.push(wait(260));
    return Promise.all(anims);
  }
  /* Kẹo mới: ưu tiên nhẹ các từ còn thiếu để màn chơi không bị "kẹt" 1 từ */
  function newType() {
    if (Math.random() < 0.4) { var need = []; for (var i = 0; i < G.K; i++) if (G.got[i] < G.def.quota) need.push(i); if (need.length && need.length < G.K) return need[Math.floor(Math.random() * need.length)]; }
    return Math.floor(Math.random() * G.K);
  }
  function gravityAnim() {
    var anims = [];
    for (var c = 0; c < C; c++) {
      var wr = R - 1;
      for (var r = R - 1; r >= 0; r--) { var tl = cell(r, c); if (tl) { if (wr !== r) { setCell(wr, c, tl); setCell(r, c, null); } wr--; } }
      var spawn = 0;
      for (var r2 = wr; r2 >= 0; r2--) { var nt = mk(newType()); if (Math.random() < ICE1) frost(nt); spawn++; nt.x = c; nt.y = -spawn; setCell(r2, c, nt); }
      for (var r3 = 0; r3 < R; r3++) { var t3 = cell(r3, c); if (t3.y !== r3 || t3.x !== c) { var dist = r3 - t3.y; anims.push(moveTile(t3, c, r3, Math.max(160, 70 * Math.sqrt(Math.abs(dist)) * 2.4), bounce)); } }
    }
    return Promise.all(anims);
  }
  async function cascade(hot) {
    var chain = 0;
    while (G) {
      var gs = groups(); if (!gs.length) break;
      chain++;
      var set = {}, creates = [];
      gs.forEach(function (g) {
        g.cells.forEach(function (i) { set[i] = 1; });
        announce(g.t);
        var spec = specialOf(g);
        if (spec) { var pos = placeOf(g, spec, hot); if (!creates.some(function (x) { return x.i === pos; })) creates.push({ i: pos, t: g.t, sp: spec.sp }); }
      });
      if (chain >= 2) { var m = COMBO[Math.min(COMBO.length - 1, chain)]; if (m) banner = { s: m, l: 1.2 }; }
      await clearSet(set, creates, chain);
      if (!G) return chain;
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
    var ri = rowOf(i), ci = colOf(i), rj = rowOf(j), cj = colOf(j);
    sfx('swap');
    await Promise.all([moveTile(a, cj, rj, 170), moveTile(b, ci, ri, 170)]);
    if (!G) return;
    swapIn(i, j);
    if (a.sp === 'b' || b.sp === 'b' || (a.sp && b.sp)) { G.moves++; hud(); await combo(a, b, j, i); if (!G) return; await cascade(null); return afterMove(); }
    var gs = groups(), touch = gs.some(function (g) { return g.set[i] || g.set[j]; });
    if (!touch) {
      sfx('bad');
      await Promise.all([moveTile(a, ci, ri, 170), moveTile(b, cj, rj, 170)]);
      if (!G) return;
      swapIn(i, j); G.busy = false; G.hintT = performance.now(); return;
    }
    G.moves++; hud();
    await cascade([j, i]);
    afterMove();
  }
  async function combo(a, b, pa, pb) {
    var set = {}, ra = rowOf(pa), ca = colOf(pa);
    function add(r, c) { if (r >= 0 && r < R && c >= 0 && c < C) set[r * C + c] = 1; }
    if (a.sp === 'b' && b.sp === 'b') {          // 2 kẹo cầu vồng: xoá cả bàn
      for (var i = 0; i < NC; i++) set[i] = 1;
      a.sp = b.sp = ''; a.t = b.t = -1; banner = { s: 'Wow!!!', l: 1.4 }; sfx('rainbow');
    } else if (a.sp === 'b' || b.sp === 'b') {
      var bomb = a.sp === 'b' ? a : b, o = bomb === a ? b : a, T = o.t;
      announce(T); bomb.sp = ''; bomb.t = -1;
      var targets = []; G.b.forEach(function (x, k) { if (x && x.t === T && x.sp !== 'b') targets.push(k); });
      if (o.sp) { targets.forEach(function (k) { G.b[k].sp = o.sp === 'w' ? 'w' : (Math.random() < 0.5 ? 'h' : 'v'); G.b[k].ice = 0; G.b[k].ia = 0; }); sfx('make'); await wait(380); if (!G) return; }
      targets.forEach(function (k) { set[k] = 1; }); set[G.b.indexOf(bomb)] = 1;
      banner = { s: 'Rainbow!', l: 1.2 };
    } else {
      var spA = a.sp, spB = b.sp; a.sp = b.sp = '';
      announce(a.t); announce(b.t);
      set[pa] = 1; set[pb] = 1;
      var lines = (spA === 'w') + (spB === 'w');
      if (lines === 2) { for (var dr = -2; dr <= 2; dr++) for (var dc = -2; dc <= 2; dc++) add(ra + dr, ca + dc); sfx('boom'); shake = 18; }
      else if (lines === 1) { for (var d = -1; d <= 1; d++) { for (var k2 = 0; k2 < C; k2++) add(ra + d, k2); for (var k4 = 0; k4 < R; k4++) add(k4, ca + d); } for (var z = -1; z <= 1; z++) { beams.push({ d: 'h', i: ra + z, l: 1 }); beams.push({ d: 'v', i: ca + z, l: 1 }); } sfx('line'); shake = 14; }
      else { for (var k3 = 0; k3 < C; k3++) add(ra, k3); for (var k5 = 0; k5 < R; k5++) add(k5, ca); beams.push({ d: 'h', i: ra, l: 1 }); beams.push({ d: 'v', i: ca, l: 1 }); }
      banner = { s: 'Super!', l: 1.2 };
    }
    await clearSet(set, [], 1);
    if (!G) return;
    await gravityAnim();
  }
  async function afterMove() {
    if (!G) return;
    hud();
    if (doneCount() === G.K) return finale(true);           // ăn đủ tất cả các từ: qua màn
    if (!findMove()) await reshuffle();
    if (!G) return;
    G.busy = false; G.hintT = performance.now(); G.spoken = [];
  }
  async function reshuffle() {
    banner = { s: 'Shuffle!', l: 1.1 }; sfx('shuffle');
    var tries = 0;
    do {
      var ts = G.b.filter(function (t) { return t && !t.sp; }).map(function (t) { return t.t; }); shuffle(ts);
      var k = 0; G.b.forEach(function (t) { if (t && !t.sp) t.t = ts[k++]; });
      tries++;
    } while ((groups().length || !findMove()) && tries < 60);
    await tween(420, function (p) { if (G) G.b.forEach(function (t) { if (t) t.s = 1 - Math.sin(p * Math.PI) * 0.5; }); });
  }
  /* Kết thúc: lượt còn thừa biến thành kẹo sọc và nổ (thưởng điểm) */
  async function finale(win) {
    G.busy = true; G.over = true;   // dừng đồng hồ ngay khi ăn đủ tất cả các từ
    banner = { s: 'Clear!', l: 1.2 }; await wait(900); if (!G) return;
    endScreen(win);
  }

  /* ================= KẾT THÚC MÀN ================= */
  function endScreen(win) {
    var def = G.def, L = def.L, dn = doneCount(), sec = Math.max(1, Math.round(G.ms / 1000));
    var stars = win ? timeStars(sec) : 0;
    var prev = starsOf(L), gain = 0, pb = bestT(L), rec = win && (!pb || sec < pb);
    if (win) {
      if ((!prev || qzPend(L)) && L + 1 < levelCount()) { if (!prog().q) prog().q = {}; prog().q[L] = 1; }
      if (stars > prev) { gain = (stars - prev) * STAR_PRICE; prog().s[L] = stars; }
      if (!prog().t) prog().t = {}; if (rec) prog().t[L] = sec; saveProg();
      sfx('win');
      try { if (window.farmEarn && (gain || dn)) window.farmEarn('match', gain, dn, def.topic.id); } catch (e) {}
      try { localStorage.setItem('farm6_pass', String(Date.now())); } catch (e) {}   // học xong 1 màn cũng mở khoá giờ nghỉ Nông trại
    } else sfx('lose');
    musicStop();
    var words = def.words.map(function (w, i) { var ok = G.got[i] >= def.quota; return '<div class="mg-wi ' + (ok ? 'ok' : 'no') + '" data-a="sayw" data-i="' + i + '">' + wordHtml(w, 30) + '<em style="color:' + (ok ? '#0d8a4c' : '#c0392b') + '">' + (ok ? '✓ Đã ăn đủ ' : '✗ Ăn ' + G.got[i] + '/') + def.quota + '</em></div>'; }).join('');
    var next = L + 1 < levelCount() && unlocked(L + 1);
    var msg = '🎉 Bạn đã học đủ <b>tất cả ' + def.K + ' từ</b> trong <b>' + mmss(sec) + '</b>.' + (rec && pb ? ' 🏅 Kỷ lục mới!' : '') +
      (stars < 3 ? '<br><small>Xong trong ' + mmss(stars === 2 ? def.t3 : def.t2) + ' để được ' + (stars === 2 ? '⭐⭐⭐' : '⭐⭐') + '.</small>' : '');
    modal((win ? '<div style="font-size:48px">' + (stars === 3 ? '🏆' : '🏝️') + '</div><h2>Qua màn ' + (def.sub + 1) + ' · Đảo ' + (def.ti + 1) + '!</h2>' : '<div style="font-size:48px">🌊</div><h2>Chưa qua màn</h2>') +
      '<div class="mg-stars">' + [1, 2, 3].map(function (i) { return '<span class="' + (stars >= i ? 'on' : '') + '" style="animation-delay:' + (i * 0.25) + 's">⭐</span>'; }).join('') + '</div>' +
      '<p style="font-size:24px;font-weight:900;color:#0b6fb8;margin:2px 0">⏱ ' + mmss(sec) + '</p><p>' + msg + '</p>' + (pb && !rec ? '<p style="font-size:13px;color:#4a7aa0">🏅 Thời gian tốt nhất: ' + mmss(pb) + '</p>' : '') +
      (gain ? '<p>🧑‍🌾 <b>+' + money(gain) + '</b> đã chuyển vào Nông trại</p>' : '') +
      '<p style="font-size:13px;color:#4a7aa0;margin:8px 0 0">📚 Ôn lại từ vựng (chạm để nghe):</p><div class="mg-wl">' + words + '</div>' +
      (win && qzPend(L) ? '<p style="background:#fff4d6;color:#7a4b00;border-radius:12px;padding:8px 10px;font-size:14px;margin:10px 0 0">📝 Hãy làm <b>bài kiểm tra</b>: đọc đúng từ vựng và chọn đúng nghĩa để mở màn tiếp theo.</p>' : '') +
      '<div class="mg-acts"><button class="mg-btn pk" data-a="tomap">🗺️ Bản đồ</button><button class="mg-btn pk" data-a="again">↻ Chơi lại</button>' + (win && qzPend(L) ? '<button class="mg-btn go" data-a="quiz">📝 Làm bài kiểm tra</button>' : win && next ? '<button class="mg-btn go" data-a="next">▶ Màn tiếp</button>' : '') + '</div>');
    if (win) setTimeout(function () { sfx('star'); }, 300);
  }
  /* Bài kiểm tra sau màn (bản 2026.11.07-1) — dùng SixLevelQuiz trong index.html */
  function startQuiz(L) {
    var lv = D().levels[L], tp = D().topics[lv.ti];
    var passed = function () { if (prog().q) delete prog().q[L]; saveProg(); unmodal(); stopPlay(); renderMap(false); show('map'); if (L + 1 < levelCount()) preLevel(L + 1); };
    if (!window.SixLevelQuiz) { passed(); return; }   // app bản cũ chưa có bài kiểm tra: không chặn người chơi
    musicStop(); hush();
    window.SixLevelQuiz.open({ lang: LANG, title: 'Đảo ' + (lv.ti + 1) + ' · Màn ' + (lv.sub + 1), words: lv.words, all: tp.w, pron: prTxt, onPass: passed });
  }
  function stopPlay() { cancelAnimationFrame(raf); raf = 0; tweens = []; parts = []; texts = []; beams = []; banner = null; G = null; musicStop(); hush(); }

  /* ================= ĐIỀU KHIỂN ================= */
  var down = null;
  function cellAt(e) {
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left - OX, y = e.clientY - r.top - OY;
    var c = Math.floor(x / S), rr = Math.floor(y / S);
    if (c < 0 || c >= C || rr < 0 || rr >= R) return -1;
    return rr * C + c;
  }
  function adj(i, j) { return Math.abs(rowOf(i) - rowOf(j)) + Math.abs(colOf(i) - colOf(j)) === 1; }
  cv.addEventListener('pointerdown', function (e) {
    if (!G || G.busy || G.over) return;
    var i = cellAt(e); if (i < 0) return;
    e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    G.hintT = performance.now(); G.hint = null;
    if (G.sel && G.sel.i !== i && adj(G.sel.i, i)) { var s0 = G.sel.i; G.sel = null; trySwap(s0, i); return; }
    down = { i: i, x: e.clientX, y: e.clientY, done: false };
    var tl = G.b[i]; G.sel = { i: i, t: tl }; sfx('select');
    if (tl && tl.sp !== 'b' && tl.t >= 0) cardWord(tl.t, false);
  });
  cv.addEventListener('pointermove', function (e) {
    if (!down || down.done || !G || G.busy) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < S * 0.35) return;
    var r = rowOf(down.i), c = colOf(down.i), j = -1;
    if (Math.abs(dx) > Math.abs(dy)) { if (dx > 0 && c < C - 1) j = down.i + 1; else if (dx < 0 && c > 0) j = down.i - 1; }
    else { if (dy > 0 && r < R - 1) j = down.i + C; else if (dy < 0 && r > 0) j = down.i - C; }
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
    else if (a === 'home') { if (FIXED) api.close(); else { renderHome(); show('home'); } }
    else if (a === 'help') modal('<div style="font-size:44px">🏝️</div><h2>Cách chơi</h2><div class="mg-how" style="background:#eafaff;color:#08406e">' + RULES + '</div><div class="mg-acts"><button class="mg-btn go" data-a="unmod">Đã hiểu</button></div>');
    else if (a === 'lang') openLang(el.getAttribute('data-l'));
    else if (a === 'lvl') { var L = +el.getAttribute('data-l'); if (!unlocked(L)) { if (qzGate(L)) startQuiz(L - 1); else sfx('bad'); return; } sfx('select'); preLevel(L); }
    else if (a === 'quiz') { if (G) startQuiz(G.def.L); }
    else if (a === 'unmod') unmodal();
    else if (a === 'start') { if (PRE) start(PRE); }
    else if (a === 'sayw') { var i = +el.getAttribute('data-i'), def = G ? G.def : PRE; if (def && def.words[i]) say(def.words[i][0], true); }
    else if (a === 'sayc') { if (G && cardT >= 0) say(G.def.words[cardT][0], true); }
    else if (a === 'music') { MUS.on = !MUS.on; setB('mg_music', MUS.on); el.classList.toggle('off', !MUS.on); if (MUS.on) musicStart(); else musicStop(); }
    else if (a === 'voice') { VOICE.on = !VOICE.on; setB('mg_voice', VOICE.on); el.classList.toggle('off', !VOICE.on); if (!VOICE.on) hush(); }
    else if (a === 'pause') {
      if (!G || G.over) { stopPlay(); renderMap(true); show('map'); return; }
      musicStop();
      modal('<div style="font-size:44px">⏸️</div><h2>Tạm dừng</h2><p>Thoát bây giờ thì màn chơi này sẽ không được tính.</p><div class="mg-acts"><button class="mg-btn pk" data-a="quit">🗺️ Về bản đồ</button><button class="mg-btn go" data-a="resume">▶ Chơi tiếp</button></div>');
    }
    else if (a === 'resume') { unmodal(); musicStart(); }
    else if (a === 'quit' || a === 'tomap') { unmodal(); stopPlay(); renderMap(true); show('map'); }
    else if (a === 'again') { var d0 = G ? G.def : PRE; stopPlay(); start(levelDef(d0.L)); }
    else if (a === 'next') { var d1 = G.def; stopPlay(); renderMap(false); show('map'); preLevel(d1.L + 1); }
  });

  /* ================= API CÔNG KHAI ================= */
  var api = {
    // o.lang = 'en' | 'zh': mở thẳng bản đồ đảo của ngôn ngữ đó (từ nút nổi trong game tiếng Anh / tiếng Trung)
    open: function (o) {
      root.classList.add('on'); document.body.style.overflow = 'hidden'; unmodal();
      try { if (window.SixTTS) window.SixTTS.warm(); } catch (e) {}
      FIXED = o && (o.lang === 'en' || o.lang === 'zh') ? o.lang : '';
      if (FIXED) openLang(FIXED); else { renderHome(); show('home'); }
    },
    close: function () {
      stopPlay(); unmodal(); root.classList.remove('on');
      if (!document.querySelector('.eg-root.on,.zg-root.on')) document.body.style.overflow = '';
    }
  };
  window.SixMatchGame = api;
})();
