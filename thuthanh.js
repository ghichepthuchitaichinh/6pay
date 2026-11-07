/* 6PAY - Game "THỦ THÀNH TIẾNG ANH" (bản 2026.11.07-6: cốt truyện quái trộm từ vựng mang về thành của chúng. Bản 2026.11.07-5: bỏ nút tua nhanh 2×, game luôn chạy tốc độ bình thường để người chơi nghe rõ từng từ. Bản 2026.11.07-4: hiện phiên âm IPA + cách đọc kiểu Việt ở màn ôn từ, thanh từ vựng, bảng đọc từ và bảng kết quả)
   (bản 2026.11.07-6) CỐT TRUYỆN: bầy quái lẻn vào KHO TỪ VỰNG (đầu đường, phía trên) đánh cắp từ vựng, mỗi con vác 1 từ
   để mang về THÀNH CỦA CHÚNG (cuối đường, phía dưới). Nhiệm vụ của người chơi: xây chòi chặn đường, không cho quái mang từ về thành.
   Mỗi màn là 1 kho từ vựng theo chủ đề (dùng chung 60 chủ đề của Game học từ vựng tiếng Anh – words.js).
   📚 trên thanh trên cùng = số từ kho còn giữ được (20). Mỗi con quái về tới thành = mất 1 từ (trùm = mất 5).
   MUỐN CÓ VÀNG XÂY CHÒI: phải ĐỌC ĐÚNG phát âm từ vựng (app nghe giọng bạn qua micro):
     • Các từ của đợt sắp tới hiện ở thanh dưới cùng: chạm vào từ → nghe mẫu → đọc → đúng thì nhận vàng
       (đọc đúng ngay lần đầu +30 vàng, lần 2 +20, từ lần 3 +12).
     • Chạm vào con quái đang đi để đọc từ nó vác: đúng thì quái bị choáng, mất máu và bạn được +12 vàng.
   Máy không nghe được giọng (trình duyệt không hỗ trợ micro): nghe mẫu rồi chọn đúng từ (thưởng ít hơn).
   Qua màn: 📚 còn ≥ 80% → ⭐⭐⭐, ≥ 40% → ⭐⭐, còn lại ⭐. Mỗi ⭐ +10.000đ và mỗi từ đọc đúng +2.000đ chuyển vào Nông trại Sixpay.
   Mỗi vùng đất (nhóm chủ đề) mở sẵn kho từ đầu tiên, bảo vệ được kho trước mới mở kho sau.
   Gọi: SixCastleGame.open() / SixCastleGame.close() */
(function () {
  if (window.SixCastleGame) return;

  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var TF = '"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  var PKEY = 'tt_p';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var START_GOLD = 100, HPMAX = 20;
  var REWARD = [30, 20, 12], ENEMY_REWARD = 12, PICK_REWARD = 15;
  var STAR_VND = 10000, WORD_VND = 2000;

  /* ================= TIỆN ÍCH ================= */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hashS(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function shuffle(a, r) { r = r || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function money(n) { return Math.round(n).toLocaleString('vi-VN') + 'đ'; }

  /* ================= ÂM THANH ================= */
  var AC = null, SND = { on: true };
  try { SND.on = localStorage.getItem('tt_snd') !== '0'; } catch (e) {}
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return AC; }
  function tone(f, t0, dur, type, vol, slide) {
    var c = ac(); if (!c || !SND.on) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + (t0 || 0);
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function sfx(k) {
    if (!SND.on) return;
    if (k === 'arrow') tone(900, 0, 0.07, 'triangle', 0.05, 500);
    else if (k === 'boom') { tone(160, 0, 0.3, 'sawtooth', 0.12, 40); tone(90, 0.02, 0.35, 'square', 0.06, 30); }
    else if (k === 'ice') tone(1400, 0, 0.12, 'sine', 0.05, 2200);
    else if (k === 'die') tone(420, 0, 0.14, 'square', 0.05, 120);
    else if (k === 'coin') { tone(988, 0, 0.08, 'square', 0.07); tone(1319, 0.08, 0.22, 'square', 0.07); }
    else if (k === 'build') { tone(330, 0, 0.08, 'triangle', 0.12); tone(494, 0.08, 0.08, 'triangle', 0.12); tone(659, 0.16, 0.16, 'triangle', 0.12); }
    else if (k === 'bad') tone(200, 0, 0.25, 'sawtooth', 0.08, 120);
    else if (k === 'hurt') tone(120, 0, 0.3, 'square', 0.1, 60);
    else if (k === 'horn') { tone(220, 0, 0.5, 'sawtooth', 0.07); tone(330, 0.05, 0.5, 'sawtooth', 0.05); }
    else if (k === 'win') [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.3, 'triangle', 0.13); });
    else if (k === 'lose') [392, 330, 262, 196].forEach(function (f, i) { tone(f, i * 0.16, 0.35, 'sawtooth', 0.07); });
    else if (k === 'tap') tone(660, 0, 0.05, 'sine', 0.06);
  }

  /* ================= ĐỌC TỪ (giọng máy) ================= */
  var lastSay = 0;
  function say(w, done) {
    lastSay = Date.now();
    if (window.SixTTS && window.SixTTS.ok) { window.SixTTS.speak(w, 'en-US', 0.85, done || null, { flush: true }); return; }
    try {
      speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(w); u.lang = 'en-US'; u.rate = 0.85;
      if (done) { var f = false, fin = function () { if (!f) { f = true; done(); } }; u.onend = fin; u.onerror = fin; setTimeout(fin, 2500); }
      speechSynthesis.speak(u);
    } catch (e) { if (done) setTimeout(done, 300); }
  }
  function hush() { try { if (window.SixTTS) window.SixTTS.stop(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }

  /* ================= SO KHỚP PHÁT ÂM ================= */
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function enNum(n) { n = +n; if (n < 20) return ONES[n]; if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''); if (n === 100) return 'one hundred'; if (n === 1000) return 'one thousand'; return String(n); }
  function normEn(s) { return String(s).toLowerCase().replace(/\d+/g, function (m) { return ' ' + enNum(m) + ' '; }).replace(/[’`]/g, "'").replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function lev(a, b) { var m = a.length, n = b.length; if (!m) return n; if (!n) return m; var p = [], j; for (j = 0; j <= n; j++) p[j] = j; for (var i = 1; i <= m; i++) { var c = [i]; for (j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
  function matchWord(target, alts) {
    var t = normEn(target), tc = t.replace(/[ ']/g, ''); if (!t) return true;
    return alts.some(function (a) {
      var x = normEn(a); if (!x) return false; var xc = x.replace(/[ ']/g, '');
      if (x === t || xc === tc || (' ' + x + ' ').indexOf(' ' + t + ' ') >= 0 || (xc.indexOf(tc) >= 0 && xc.length <= tc.length + 4)) return true;
      return tc.length >= 5 && 1 - lev(xc, tc) / Math.max(xc.length, tc.length) >= 0.8;
    });
  }

  /* ================= DỮ LIỆU ================= */
  var DATA = null;
  function loadData() {
    if (DATA) return Promise.resolve(DATA);
    var A0 = window.SixWordGame;
    var p = A0 && A0.data ? Promise.resolve() : (window.loadGame ? window.loadGame('words') : Promise.reject(new Error('no loader')));
    return p.then(function () {
      var A = window.SixWordGame; if (!A || !A.data) throw new Error('no data');
      var tops = [];
      A.data.topics.forEach(function (t) {
        var seen = {}, w = [];
        t.w.forEach(function (x) { var k = String(x[0]).toLowerCase(); if (!seen[k]) { seen[k] = 1; w.push(x); } });
        if (w.length < 6) return;
        tops.push({ id: t.id, n: t.n, i: t.i, c: t.c || '#2563eb', g: t.g || 0, w: w, ti: tops.length });
      });
      DATA = { topics: tops, groups: A.data.groups || [], img: A.data.img, pron: A.data.pron };
      return DATA;
    });
  }
  function picImg(p) { if (p && p.charAt(0) === '@' && DATA && DATA.img) return DATA.img(p.slice(1)) || null; return null; }
  function picHtml(p, sz) {
    var im = picImg(p);
    return im ? '<img src="' + im.src + '" alt="" style="width:' + sz + 'px;height:' + sz + 'px;vertical-align:middle">' :
      '<span style="font-family:' + EF.replace(/"/g, "'") + ';font-size:' + Math.round(sz * 0.86) + 'px;line-height:1">' + esc(p) + '</span>';
  }
  /* Phiên âm: x = [từ, nghĩa, hình]. Trả về { ipa: '/ˈkæmərə/', vi: 'kém-mơ-rơ' } (cách đọc kiểu Việt: âm tiết có dấu sắc là âm nhấn) */
  function pronOf(x) {
    var t = ''; try { t = DATA && DATA.pron ? DATA.pron(x) || '' : ''; } catch (e) {}
    var k = t.indexOf(' · '); return t ? { ipa: k >= 0 ? t.slice(0, k) : t, vi: k >= 0 ? t.slice(k + 3) : '' } : { ipa: '', vi: '' };
  }
  function pronHtml(x, cls) { var p = pronOf(x); if (!p.ipa && !p.vi) return ''; return '<div class="' + (cls || 'tt-pr') + '">' + (p.ipa ? '<span class="ipa">' + esc(p.ipa) + '</span>' : '') + (p.vi ? '<span class="vi">🗣️ ' + esc(p.vi) + '</span>' : '') + '</div>'; }

  /* ================= TIẾN ĐỘ ================= */
  var P = null;
  function prog() { if (!P) { try { P = JSON.parse(localStorage.getItem(PKEY)); } catch (e) {} if (!P || !P.s) P = { s: {}, b: {} }; } return P; }
  function saveProg() { try { localStorage.setItem(PKEY, JSON.stringify(prog())); } catch (e) {} }
  function stars(id) { return prog().s[id] || 0; }
  function unlocked(tp) {
    var list = DATA.topics.filter(function (t) { return t.g === tp.g; }), i = list.indexOf(tp);
    return i <= 0 || stars(list[i - 1].id) > 0;
  }

  /* ================= GIAO DIỆN ================= */
  var root = null;
  var css = document.createElement('style');
  css.textContent = [
    '.tt-root{position:fixed;inset:0;z-index:100050;display:none;font-family:' + TF + ';color:#fff;background:#0b1530;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;overscroll-behavior:contain}',
    '.tt-root.on{display:block}.tt-root *{box-sizing:border-box}',
    '.tt-scr{position:absolute;inset:0;display:none;flex-direction:column}.tt-scr.on{display:flex}',
    '.tt-top{display:flex;align-items:center;gap:8px;padding:max(10px,env(safe-area-inset-top)) 10px 8px;background:linear-gradient(180deg,rgba(8,15,40,.96),rgba(8,15,40,.82));box-shadow:0 2px 12px rgba(0,0,0,.35);position:relative;z-index:3}',
    '.tt-top h1{flex:1;margin:0;font-size:18px;font-weight:900;line-height:1.2;letter-spacing:.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.tt-ib{border:0;border-radius:12px;min-width:40px;height:40px;padding:0 10px;font-size:19px;font-weight:900;font-family:inherit;color:#fff;background:rgba(255,255,255,.14);cursor:pointer;flex:none}.tt-ib:active{transform:scale(.94)}',
    '.tt-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 12px max(24px,env(safe-area-inset-bottom))}',
    /* bản đồ */
    '.tt-mapbg{background:radial-gradient(ellipse at 50% -10%,#3b5bdb 0%,#1e2a6b 35%,#0b1530 75%)}',
    '.tt-hero{position:relative;border-radius:22px;padding:16px 16px 14px;margin:0 auto 14px;max-width:640px;overflow:hidden;background:linear-gradient(135deg,#7c2d12,#b45309 45%,#f59e0b);box-shadow:0 10px 30px rgba(0,0,0,.4)}',
    '.tt-hero b{display:block;font-size:22px;font-weight:900;text-shadow:0 2px 0 rgba(0,0,0,.25)}.tt-hero small{display:block;font-size:13.5px;opacity:.95;margin-top:4px;line-height:1.45;max-width:72%}',
    '.tt-hero i{position:absolute;right:8px;bottom:-6px;font-style:normal;font-size:76px;font-family:' + EF + ';filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))}',
    '.tt-hero .st{display:inline-block;margin-top:8px;background:rgba(0,0,0,.25);border-radius:999px;padding:4px 12px;font-weight:800;font-size:13px}',
    '.tt-grp{max-width:640px;margin:16px auto 8px;font-size:15px;font-weight:900;color:#fde68a;display:flex;align-items:center;gap:8px}.tt-grp:after{content:"";flex:1;height:2px;background:linear-gradient(90deg,rgba(253,230,138,.5),transparent)}',
    '.tt-grid{max-width:640px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
    '@media(min-width:520px){.tt-grid{grid-template-columns:repeat(4,1fr)}}',
    '.tt-cs{position:relative;border:0;border-radius:18px;padding:10px 6px 9px;color:#fff;font-family:inherit;cursor:pointer;text-align:center;background:linear-gradient(180deg,var(--c),rgba(0,0,0,.35)),var(--c);box-shadow:0 6px 0 rgba(0,0,0,.28),0 8px 18px rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.25);min-height:118px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}',
    '.tt-cs:active{transform:translateY(3px);box-shadow:0 3px 0 rgba(0,0,0,.28),0 4px 10px rgba(0,0,0,.3)}',
    '.tt-cs .ca{position:relative;width:62px;height:50px;margin-bottom:4px}',
    '.tt-cs .ca svg{position:absolute;inset:0;width:62px;height:50px}.tt-cs .ca span{position:absolute;left:50%;top:22px;transform:translateX(-50%);font-family:' + EF + ';font-size:22px;line-height:1}',
    '.tt-cs .nm{font-size:12.5px;font-weight:800;line-height:1.25;text-shadow:0 1px 2px rgba(0,0,0,.4)}',
    '.tt-cs .ss{font-size:12px;margin-top:auto;padding-top:3px;letter-spacing:1px}',
    '.tt-cs.lk{filter:grayscale(.85) brightness(.7)}.tt-cs.lk:after{content:"🔒";position:absolute;right:6px;top:5px;font-family:' + EF + ';font-size:16px}',
    '.tt-cs.dn:before{content:"✓";position:absolute;left:7px;top:5px;width:20px;height:20px;border-radius:50%;background:#16a34a;font-size:13px;font-weight:900;line-height:20px;box-shadow:0 1px 3px rgba(0,0,0,.4)}',
    /* giới thiệu */
    '.tt-ibox{max-width:640px;margin:0 auto}',
    '.tt-ihead{border-radius:22px;padding:16px;background:linear-gradient(135deg,var(--c),#1e293b);box-shadow:0 10px 26px rgba(0,0,0,.35);display:flex;align-items:center;gap:14px}',
    '.tt-ihead .e{font-family:' + EF + ';font-size:54px;line-height:1;filter:drop-shadow(0 4px 6px rgba(0,0,0,.3))}.tt-ihead b{font-size:20px;font-weight:900;display:block}.tt-ihead small{font-size:13.5px;opacity:.9}',
    '.tt-how{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}',
    '.tt-how div{background:rgba(255,255,255,.08);border-radius:16px;padding:10px 8px;text-align:center;font-size:12.5px;line-height:1.35;font-weight:600}.tt-how div i{display:block;font-style:normal;font-family:' + EF + ';font-size:28px;margin-bottom:4px}',
    '.tt-wl{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}@media(min-width:520px){.tt-wl{grid-template-columns:repeat(3,1fr)}}',
    '.tt-wc{display:flex;align-items:center;gap:10px;background:#fff;color:#0f172a;border-radius:14px;padding:8px 10px;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.2)}.tt-wc:active{transform:scale(.97)}',
    '.tt-wc .p{flex:none;width:42px;text-align:center}.tt-wc b{display:block;font-size:15px;line-height:1.2;word-break:break-word}.tt-wc small{display:block;font-size:12.5px;color:#475569;line-height:1.25}',
    '.tt-wc .tt-pr{line-height:1.25;margin:1px 0}.tt-wc .tt-pr span{display:block;font-size:11.5px}.tt-wc .tt-pr .ipa{color:#7c3aed;font-family:"Segoe UI","Noto Sans","DejaVu Sans",Arial,sans-serif}.tt-wc .tt-pr .vi{color:#b45309;font-weight:700}',
    '.tt-say .tt-pr{margin-top:3px;line-height:1.35}.tt-say .tt-pr span{display:inline-block;margin-right:10px;font-size:15px}.tt-say .tt-pr .ipa{color:#c4b5fd;font-family:"Segoe UI","Noto Sans","DejaVu Sans",Arial,sans-serif}.tt-say .tt-pr .vi{color:#fde68a;font-weight:800}',
    '.tt-say .tip{font-size:12px;opacity:.7;margin-top:2px}',
    '.tt-chip .vi{display:block;font-size:11px;font-weight:700;color:#92400e;text-align:left;white-space:nowrap}',
    '.tt-go{position:sticky;bottom:0;padding:12px 0 4px;background:linear-gradient(180deg,transparent,#0b1530 40%)}',
    '.tt-btn{display:block;width:100%;border:0;border-radius:18px;padding:15px;font-size:18px;font-weight:900;font-family:inherit;color:#fff;cursor:pointer;background:linear-gradient(180deg,#f97316,#c2410c);box-shadow:0 5px 0 #7c2d12,0 10px 22px rgba(0,0,0,.35)}.tt-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #7c2d12}',
    '.tt-btn.g{background:linear-gradient(180deg,#22c55e,#15803d);box-shadow:0 5px 0 #14532d,0 10px 22px rgba(0,0,0,.35)}.tt-btn.s{background:rgba(255,255,255,.16);box-shadow:none}',
    /* trận đấu */
    '.tt-hud{display:flex;gap:6px;flex:1;min-width:0;justify-content:center}',
    '.tt-pill{display:flex;align-items:center;gap:4px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:5px 10px;font-weight:900;font-size:15px;white-space:nowrap}.tt-pill i{font-style:normal;font-family:' + EF + '}',
    '.tt-pill.bump{animation:ttBump .45s}@keyframes ttBump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}',
    '.tt-pill.hurt{animation:ttHurt .45s}@keyframes ttHurt{0%,100%{background:rgba(0,0,0,.35)}40%{background:#dc2626}}',
    '.tt-stage{position:relative;flex:1;min-height:0;overflow:hidden;background:#14532d}',
    '.tt-stage canvas{position:absolute;left:0;top:0;touch-action:none}',
    '.tt-wavebtn{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:4;border:0;border-radius:999px;padding:10px 18px;font-size:16px;font-weight:900;font-family:inherit;color:#fff;cursor:pointer;background:linear-gradient(180deg,#ef4444,#991b1b);box-shadow:0 4px 0 #450a0a,0 8px 18px rgba(0,0,0,.45);white-space:nowrap;animation:ttGlow 1.4s ease-in-out infinite}',
    '.tt-wavebtn small{font-weight:700;opacity:.85;font-size:12px;margin-left:4px}.tt-wavebtn:active{transform:translateX(-50%) translateY(3px)}',
    '@keyframes ttGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18)}}',
    '.tt-banner{position:absolute;left:0;right:0;top:38%;z-index:5;text-align:center;pointer-events:none;opacity:0;transform:scale(.7);transition:opacity .3s,transform .3s}',
    '.tt-banner.on{opacity:1;transform:scale(1)}.tt-banner b{display:inline-block;padding:10px 26px;border-radius:16px;background:rgba(0,0,0,.6);font-size:26px;font-weight:900;text-shadow:0 2px 0 #000;border:2px solid rgba(253,224,71,.7)}.tt-banner small{display:block;margin-top:6px;font-weight:700;font-size:14px;text-shadow:0 1px 3px #000}',
    '.tt-toast{position:absolute;left:50%;bottom:70px;transform:translateX(-50%) translateY(20px);z-index:6;max-width:92%;background:rgba(15,23,42,.94);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:9px 14px;font-size:14px;font-weight:700;line-height:1.4;text-align:center;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}',
    '.tt-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}',
    '.tt-pop{position:absolute;z-index:7;width:236px;background:rgba(15,23,42,.97);border:2px solid rgba(253,224,71,.5);border-radius:16px;padding:8px;box-shadow:0 12px 30px rgba(0,0,0,.55);display:none}',
    '.tt-pop.on{display:block}.tt-pop h4{margin:2px 4px 6px;font-size:14px;font-weight:900;color:#fde68a}',
    '.tt-opt{display:flex;align-items:center;gap:8px;width:100%;border:0;border-radius:12px;padding:8px;margin-bottom:5px;background:rgba(255,255,255,.1);color:#fff;font-family:inherit;text-align:left;cursor:pointer}',
    '.tt-opt:last-child{margin-bottom:0}.tt-opt i{font-style:normal;font-family:' + EF + ';font-size:24px;width:32px;text-align:center}.tt-opt b{display:block;font-size:14px}.tt-opt small{display:block;font-size:11.5px;opacity:.8}',
    '.tt-opt em{margin-left:auto;font-style:normal;font-weight:900;font-size:14px;color:#fde047;white-space:nowrap}.tt-opt.no{opacity:.45}.tt-opt.red{background:rgba(220,38,38,.35)}.tt-opt.grn{background:rgba(22,163,74,.4)}',
    '.tt-bank{flex:none;background:linear-gradient(180deg,#3f2a14,#2a1b0c);border-top:3px solid #a16207;padding:7px 0 max(8px,env(safe-area-inset-bottom));position:relative;z-index:3}',
    '.tt-bank .hd{display:flex;align-items:center;justify-content:space-between;padding:0 12px 5px;font-size:12.5px;font-weight:800;color:#fde68a}',
    '.tt-chips{display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:2px 12px 4px;scrollbar-width:none;min-height:62px}.tt-chips::-webkit-scrollbar{display:none}',
    '.tt-chip{flex:none;display:flex;align-items:center;gap:7px;border:0;border-radius:14px;padding:6px 10px 6px 7px;background:linear-gradient(180deg,#fef3c7,#fcd34d);color:#3b2300;font-family:inherit;cursor:pointer;box-shadow:0 3px 0 #92400e;animation:ttIn .35s}',
    '.tt-chip:active{transform:translateY(2px);box-shadow:0 1px 0 #92400e}.tt-chip b{display:block;font-size:15px;font-weight:900;line-height:1.15;text-align:left}.tt-chip small{display:block;font-size:11.5px;font-weight:800;color:#a16207;text-align:left}',
    '.tt-chip .p{width:34px;text-align:center;flex:none}.tt-chip.tried{background:linear-gradient(180deg,#fee2e2,#fca5a5);box-shadow:0 3px 0 #991b1b}',
    '@keyframes ttIn{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}',
    '.tt-empty{padding:12px;font-size:13px;opacity:.85;line-height:1.4;white-space:normal}',
    /* bảng đọc từ */
    '.tt-say{position:absolute;left:0;right:0;bottom:0;z-index:8;padding:12px 14px 14px;background:linear-gradient(180deg,rgba(30,41,59,.97),rgba(15,23,42,.99));border-top:3px solid #f59e0b;border-radius:22px 22px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.5);transform:translateY(105%);transition:transform .25s;text-align:center}',
    '.tt-say.on{transform:none}.tt-say .x{position:absolute;right:10px;top:10px}',
    '.tt-say .top{display:flex;align-items:center;justify-content:center;gap:12px;margin:2px 40px 6px}.tt-say .w{font-size:32px;font-weight:900;line-height:1.15;word-break:break-word}',
    '.tt-say .mn{font-size:15px;opacity:.9;margin-top:3px}',
    '.tt-say .fb{min-height:44px;font-size:15px;line-height:1.4;margin:6px 0}.tt-say .ok{color:#4ade80;font-weight:900;font-size:19px}.tt-say .bad{color:#fca5a5;font-weight:800}',
    '.tt-say .row{display:flex;align-items:center;justify-content:center;gap:16px}',
    '.tt-mic{width:84px;height:84px;border-radius:50%;border:0;font-size:38px;cursor:pointer;color:#fff;background:radial-gradient(circle at 35% 30%,#ff8a8a,#dc2626);box-shadow:0 8px 20px rgba(220,38,38,.45);font-family:' + EF + '}',
    '.tt-mic.rec{animation:ttPulse 1s ease-in-out infinite}@keyframes ttPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,90,90,.75)}50%{box-shadow:0 0 0 20px rgba(255,90,90,0)}}',
    '.tt-say .ch{display:grid;grid-template-columns:1fr;gap:7px;max-width:360px;margin:0 auto}.tt-say .ch button{border:0;border-radius:12px;padding:12px;font-size:17px;font-weight:800;font-family:inherit;color:#fff;background:rgba(255,255,255,.14);cursor:pointer}',
    '.tt-say .ch button.okb{background:#16a34a}.tt-say .ch button.bdb{background:#dc2626}',
    /* kết thúc */
    '.tt-end{position:absolute;inset:0;z-index:9;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.72);padding:16px}',
    '.tt-end.on{display:flex}.tt-endc{width:100%;max-width:420px;max-height:100%;overflow-y:auto;background:linear-gradient(180deg,#1e3a8a,#0f172a);border:2px solid rgba(253,224,71,.55);border-radius:24px;padding:18px 16px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.6);animation:ttIn .4s}',
    '.tt-endc .big{font-family:' + EF + ';font-size:64px;line-height:1}.tt-endc h2{margin:6px 0 2px;font-size:24px;font-weight:900}.tt-endc .stars{font-size:38px;letter-spacing:4px;margin:6px 0;font-family:' + EF + '}',
    '.tt-endc .sum{font-size:14.5px;line-height:1.5;opacity:.95;margin-bottom:10px}.tt-endc .farm{display:inline-block;background:rgba(22,163,74,.35);border-radius:999px;padding:5px 14px;font-weight:800;font-size:14px;margin-bottom:10px}',
    '.tt-endc .wl{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0 12px}.tt-endc .wl span{background:rgba(255,255,255,.12);border-radius:10px;padding:4px 9px;font-size:13.5px;font-weight:700;cursor:pointer}.tt-endc .wl span.bd{background:rgba(220,38,38,.35)}',
    '.tt-endc .acts{display:grid;gap:9px}'
  ].join('');
  document.head.appendChild(css);

  function castleSvg(c) {
    return '<svg viewBox="0 0 62 50" aria-hidden="true"><defs><linearGradient id="ttg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset="1" stop-color="#9ca3af"/></linearGradient></defs>' +
      '<rect x="4" y="14" width="14" height="34" rx="2" fill="url(#ttg)" stroke="#475569" stroke-width="1.5"/><rect x="44" y="14" width="14" height="34" rx="2" fill="url(#ttg)" stroke="#475569" stroke-width="1.5"/>' +
      '<rect x="14" y="20" width="34" height="28" fill="url(#ttg)" stroke="#475569" stroke-width="1.5"/>' +
      '<path d="M4 14h3v-4h3v4h2v-4h3v4h3" fill="#cbd5e1" stroke="#475569" stroke-width="1.2"/><path d="M44 14h3v-4h3v4h2v-4h3v4h3" fill="#cbd5e1" stroke="#475569" stroke-width="1.2"/>' +
      '<path d="M26 48v-9a5 5 0 0 1 10 0v9z" fill="#3f2a14"/><line x1="11" y1="10" x2="11" y2="1" stroke="#475569" stroke-width="1.5"/><path d="M11 1l9 3-9 3z" fill="' + c + '"/>' +
      '<line x1="51" y1="10" x2="51" y2="1" stroke="#475569" stroke-width="1.5"/><path d="M51 1l9 3-9 3z" fill="' + c + '"/></svg>';
  }

  function ensure() {
    if (root) return;
    root = document.createElement('div'); root.className = 'tt-root';
    root.innerHTML =
      '<div class="tt-scr tt-mapbg" id="ttMap"><div class="tt-top"><button class="tt-ib" data-a="close" aria-label="Quay lại">←</button><h1>🏰 Thủ thành tiếng Anh</h1><button class="tt-ib" data-a="snd" id="ttSnd"></button></div><div class="tt-body" id="ttMapB"></div></div>' +
      '<div class="tt-scr tt-mapbg" id="ttIntro"><div class="tt-top"><button class="tt-ib" data-a="map" aria-label="Quay lại">←</button><h1 id="ttIT"></h1></div><div class="tt-body" id="ttIB"></div></div>' +
      '<div class="tt-scr" id="ttGame">' +
      '<div class="tt-top"><button class="tt-ib" data-a="quit" aria-label="Quay lại">←</button>' +
      '<div class="tt-hud"><span class="tt-pill" id="ttHP" title="Số từ trong kho còn giữ được"><i>📚</i><span></span></span><span class="tt-pill" id="ttGold"><i>💰</i><span></span></span><span class="tt-pill" id="ttWv"><i>👹</i><span></span></span></div>' +
      '<button class="tt-ib" data-a="pause" id="ttPau">⏸</button></div>' +
      '<div class="tt-stage" id="ttStage"><canvas id="ttCv"></canvas>' +
      '<button class="tt-wavebtn" data-a="wave" id="ttWB"></button>' +
      '<div class="tt-banner" id="ttBan"></div><div class="tt-toast" id="ttToast"></div><div class="tt-pop" id="ttPop"></div>' +
      '<div class="tt-say" id="ttSay"></div><div class="tt-end" id="ttEnd"></div></div>' +
      '<div class="tt-bank"><div class="hd"><span>📜 Đọc đúng từ để nhận vàng xây chòi</span><span id="ttBN"></span></div><div class="tt-chips" id="ttChips"></div></div>' +
      '</div>';
    document.body.appendChild(root);
    root.addEventListener('click', onClick);
    var cv = $('ttCv');
    cv.addEventListener('pointerdown', onTap);
    window.addEventListener('resize', function () { if (G && root.classList.contains('on')) lay(); });
  }
  function show(id) { ['ttMap', 'ttIntro', 'ttGame'].forEach(function (k) { $(k).classList.toggle('on', k === id); }); }
  function sndBtn() { var b = $('ttSnd'); if (b) b.textContent = SND.on ? '🔊' : '🔇'; }

  /* ================= MÀN HÌNH BẢN ĐỒ ================= */
  function renderMap() {
    var tops = DATA.topics, tot = 0;
    tops.forEach(function (t) { tot += stars(t.id); });
    var h = '<div class="tt-hero"><b>Lũ quái đang trộm từ vựng!</b><small>Mỗi chủ đề là một kho từ vựng. Bầy quái lẻn vào, mỗi con vác trộm một từ để mang về thành của chúng. Hãy đọc đúng từ để có vàng, xây chòi chặn đường – đừng để chúng mang từ nào về thành!</small>' +
      '<span class="st">⭐ ' + tot + ' / ' + tops.length * 3 + '</span><i>🏰</i></div>';
    var byG = {};
    tops.forEach(function (t) { (byG[t.g] = byG[t.g] || []).push(t); });
    Object.keys(byG).sort(function (a, b) { return a - b; }).forEach(function (g) {
      h += '<div class="tt-grp">' + esc(DATA.groups[g] || 'Vùng đất ' + (+g + 1)) + '</div><div class="tt-grid">';
      byG[g].forEach(function (t) {
        var s = stars(t.id), lk = !unlocked(t);
        h += '<button class="tt-cs' + (lk ? ' lk' : '') + (s ? ' dn' : '') + '" style="--c:' + t.c + '" data-a="castle" data-i="' + t.ti + '">' +
          '<div class="ca">' + castleSvg(t.c) + '<span>' + esc(t.i) + '</span></div><div class="nm">' + esc(t.n) + '</div>' +
          '<div class="ss">' + (s ? '⭐'.repeat(s) + '<span style="opacity:.3">' + '⭐'.repeat(3 - s) + '</span>' : '<span style="opacity:.75;font-size:11.5px;letter-spacing:0">' + t.w.length + ' từ</span>') + '</div></button>';
      });
      h += '</div>';
    });
    $('ttMapB').innerHTML = h;
  }

  /* ================= MÀN HÌNH GIỚI THIỆU THÀNH ================= */
  var CUR = null;
  function openIntro(tp) {
    CUR = tp; hush();
    var nW = planWaves(tp).length;
    $('ttIT').textContent = '🏰 ' + tp.n;
    var h = '<div class="tt-ibox"><div class="tt-ihead" style="--c:' + tp.c + '"><span class="e">' + esc(tp.i) + '</span><div><b>Kho từ: ' + esc(tp.n) + '</b><small>' + tp.w.length + ' từ vựng · ' + nW + ' đợt quái' + (stars(tp.id) ? ' · Tốt nhất: ' + '⭐'.repeat(stars(tp.id)) : '') + '</small></div></div>' +
      '<div style="margin:12px 0 0;padding:12px 14px;border-radius:16px;background:rgba(127,29,29,.45);border:1px solid rgba(252,165,165,.35);font-size:14px;line-height:1.5">👹 <b>Bầy quái đang trộm từ</b> trong kho “' + esc(tp.n) + '”. Mỗi con vác một từ, chạy theo con đường để mang về <b>thành của chúng</b>. Hãy xây chòi chặn đường, <b>không để chúng mang từ nào về thành!</b></div>' +
      '<div class="tt-how"><div><i>🎤</i>Chạm vào từ ở thanh dưới, đọc đúng để nhận 💰</div><div><i>🏹</i>Chạm ô đá ➕ dọc đường để xây chòi chặn quái</div><div><i>👹</i>Chạm vào quái, đọc đúng từ nó đang trộm để làm nó choáng</div></div>' +
      '<div class="tt-grp" style="margin-top:6px">📖 Ôn từ trước khi vào trận (chạm để nghe)</div>' +
      '<div style="font-size:12.5px;opacity:.85;margin:-2px 0 8px;line-height:1.45">Dòng tím là phiên âm quốc tế (IPA). Dòng 🗣️ là cách đọc gần đúng bằng chữ Việt: âm tiết có <b>dấu sắc</b> là âm cần nhấn mạnh.</div><div class="tt-wl">';
    tp.w.forEach(function (x, i) {
      h += '<div class="tt-wc" data-a="hear" data-i="' + i + '"><div class="p">' + picHtml(x[2], 38) + '</div><div><b>' + esc(x[0]) + '</b>' + pronHtml(x) + '<small>' + esc(x[1]) + '</small></div></div>';
    });
    h += '</div><div class="tt-go"><button class="tt-btn" data-a="start">⚔️ Vào trận chặn quái trộm từ</button></div></div>';
    $('ttIB').innerHTML = h; $('ttIB').scrollTop = 0;
    show('ttIntro');
  }

  /* ================= THIẾT KẾ TRẬN ĐẤU ================= */
  var MAPS = [
    [[0.18, -0.06], [0.18, 0.2], [0.8, 0.2], [0.8, 0.42], [0.22, 0.42], [0.22, 0.63], [0.78, 0.63], [0.78, 0.79], [0.5, 0.79], [0.5, 0.9]],
    [[0.82, -0.06], [0.82, 0.17], [0.2, 0.17], [0.2, 0.37], [0.64, 0.37], [0.64, 0.57], [0.2, 0.57], [0.2, 0.77], [0.5, 0.77], [0.5, 0.9]],
    [[0.5, -0.06], [0.5, 0.12], [0.84, 0.12], [0.84, 0.3], [0.16, 0.3], [0.16, 0.5], [0.84, 0.5], [0.84, 0.69], [0.2, 0.69], [0.2, 0.8], [0.5, 0.8], [0.5, 0.9]]
  ];
  var TW = {
    arrow: { n: 'Chòi cung thủ', e: '🏹', c: 50, r: 0.27, d: 9, cd: 0.62, roof: '#dc2626', info: 'Bắn nhanh, bắn xa' },
    cannon: { n: 'Chòi pháo đá', e: '💣', c: 90, r: 0.23, d: 26, cd: 1.7, sp: 0.085, roof: '#334155', info: 'Nổ lan, diệt cả bầy' },
    ice: { n: 'Chòi băng', e: '❄️', c: 70, r: 0.22, d: 4, cd: 0.9, slow: 0.5, roof: '#0ea5e9', info: 'Làm quái đi chậm lại' }
  };
  var TW_KEYS = ['arrow', 'cannon', 'ice'];
  var EN = {
    bat: { e: '🦇', hp: 24, spd: 0.13, sz: 0.075 },
    gob: { e: '👺', hp: 42, spd: 0.095, sz: 0.085 },
    ghost: { e: '👻', hp: 52, spd: 0.085, sz: 0.085 },
    zom: { e: '🧟', hp: 82, spd: 0.062, sz: 0.09 },
    ogre: { e: '👹', hp: 125, spd: 0.056, sz: 0.1 },
    boss: { e: '🐲', hp: 650, spd: 0.04, sz: 0.15, dmg: 5 }
  };
  function planWaves(tp) {
    var n = tp.w.length, K = clamp(Math.ceil(n / 6), 3, 8);
    var r = rng(hashS('tt' + tp.id)), order = shuffle(tp.w.map(function (x, i) { return i; }), r), waves = [], k = 0;
    for (var j = 0; j < K; j++) {
      var sz = Math.floor(n / K) + (j < n % K ? 1 : 0); waves.push(order.slice(k, k + sz)); k += sz;
    }
    return waves;
  }
  function waveEnemies(G, k) {
    var words = G.waves[k], list = [], pool = ['gob', 'bat'];
    if (k >= 1) pool.push('ghost'); if (k >= 2) pool.push('zom'); if (k >= 3) pool.push('ogre');
    var r = rng(hashS(G.tp.id + 'w' + k + G.seed));
    words.forEach(function (w) { list.push({ t: pool[Math.floor(r() * pool.length)], w: w }); });
    // Đợt sau có thêm quái vác lại từ của các đợt trước (ôn lại từ cũ)
    var old = []; for (var j = 0; j < k; j++) old = old.concat(G.waves[j]);
    var extra = Math.min(old.length, k * 2);
    shuffle(old, r).slice(0, extra).forEach(function (w) { list.splice(Math.floor(r() * (list.length + 1)), 0, { t: pool[Math.floor(r() * pool.length)], w: w }); });
    if (k === G.waves.length - 1) list.push({ t: 'boss', w: G.waves[k][0] });
    return list;
  }

  /* ================= TRẠNG THÁI TRẬN ================= */
  var G = null, CV = null, X = null, BG = null, W = 0, H = 0, DPR = 1, raf = 0, last = 0;
  function newGame(tp) {
    G = {
      tp: tp, seed: Math.floor(Math.random() * 1e6), map: MAPS[tp.ti % MAPS.length], waves: planWaves(tp), wave: 0, phase: 'prep',
      hp: HPMAX, gold: START_GOLD, towers: [], enemies: [], shots: [], fx: [], txt: [], spots: null, q: [], qT: 0,
      paused: false, said: {}, bank: [], ok: 0, t: 0, prepT: 30, shake: 0, sel: -1, flagT: 0, ended: false
    };
    G.waves[0].forEach(function (w) { addBank(w); });
  }
  function addBank(w) { if (G.bank.indexOf(w) < 0 && !(G.said[w] && G.said[w].ok)) G.bank.push(w); }

  /* ================= BỐ CỤC ================= */
  var PATH = [], PLEN = 0, PW = 30;
  function lay() {
    var st = $('ttStage'); if (!st) return;
    var sw = st.clientWidth, sh = st.clientHeight; if (!sw || !sh) return;
    W = Math.min(sw, Math.round(sh * 0.78)); H = sh; DPR = Math.min(2.5, window.devicePixelRatio || 1);
    CV = $('ttCv'); X = CV.getContext('2d');
    CV.width = Math.round(W * DPR); CV.height = Math.round(H * DPR);
    CV.style.width = W + 'px'; CV.style.height = H + 'px'; CV.style.left = Math.round((sw - W) / 2) + 'px';
    PW = Math.max(26, W * 0.085);
    PATH = G.map.map(function (p) { return { x: p[0] * W, y: p[1] * H }; });
    PLEN = 0; for (var i = 1; i < PATH.length; i++) { PATH[i].L = PLEN; PLEN += Math.hypot(PATH[i].x - PATH[i - 1].x, PATH[i].y - PATH[i - 1].y); PATH[i].E = PLEN; }
    if (!G.spots) G.spots = makeSpots();
    drawBG();
  }
  function distSeg(px, py, a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy, t = l ? ((px - a.x) * dx + (py - a.y) * dy) / l : 0;
    t = clamp(t, 0, 1); return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
  }
  function distPath(px, py) { var m = 1e9; for (var i = 1; i < PATH.length; i++) m = Math.min(m, distSeg(px, py, PATH[i - 1], PATH[i])); return m; }
  function makeSpots() {
    var cand = [], step = W * 0.065, R = W * 0.25;
    for (var y = H * 0.05; y < H * 0.8; y += step) for (var x = W * 0.08; x <= W * 0.92; x += step) {
      var d = distPath(x, y); if (d < PW * 1.05 || d > PW * 1.75) continue;
      var cov = 0; for (var s = 0; s <= 60; s++) { var p = posAt(s / 60); if (p.y > 0 && Math.hypot(p.x - x, p.y - y) < R) cov++; }
      cand.push({ x: x, y: y, c: cov });
    }
    cand.sort(function (a, b) { return b.c - a.c; });
    var out = [], gap = W * 0.17;
    cand.forEach(function (c) { if (out.length >= 11) return; if (out.every(function (o) { return Math.hypot(o.x - c.x, o.y - c.y) > gap; })) out.push(c); });
    return out.map(function (o) { return { nx: o.x / W, ny: o.y / H }; });
  }
  function posAt(f) {
    var d = clamp(f, 0, 1) * PLEN;
    for (var i = 1; i < PATH.length; i++) if (d <= PATH[i].E || i === PATH.length - 1) {
      var a = PATH[i - 1], b = PATH[i], seg = b.E - b.L || 1, t = clamp((d - b.L) / seg, 0, 1);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, dx: b.x - a.x, dy: b.y - a.y };
    }
    return PATH[PATH.length - 1];
  }
  function spotXY(s) { return { x: s.nx * W, y: s.ny * H }; }

  /* ----- vẽ nền (cỏ, đường, cây) vào 1 canvas riêng, chỉ vẽ lại khi đổi kích thước ----- */
  function drawBG() {
    BG = document.createElement('canvas'); BG.width = CV.width; BG.height = CV.height;
    var b = BG.getContext('2d'); b.scale(DPR, DPR);
    var gr = b.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3f9142'); gr.addColorStop(0.5, '#4caf50'); gr.addColorStop(1, '#3d8b40');
    b.fillStyle = gr; b.fillRect(0, 0, W, H);
    var r = rng(hashS(G.tp.id + 'bg'));
    for (var i = 0; i < 260; i++) { b.fillStyle = r() < 0.5 ? 'rgba(20,83,45,.22)' : 'rgba(187,247,208,.16)'; b.beginPath(); b.ellipse(r() * W, r() * H, 3 + r() * 10, 2 + r() * 5, 0, 0, 7); b.fill(); }
    var FL = ['#fde047', '#f472b6', '#fff', '#c4b5fd', '#fb923c'];
    for (i = 0; i < 70; i++) { var fx = r() * W, fy = r() * H; if (distPath(fx, fy) < PW) continue; b.fillStyle = FL[i % FL.length]; b.beginPath(); b.arc(fx, fy, 1.6 + r() * 1.6, 0, 7); b.fill(); }
    // con đường đất
    function poly() { b.beginPath(); b.moveTo(PATH[0].x, PATH[0].y); for (var j = 1; j < PATH.length; j++) b.lineTo(PATH[j].x, PATH[j].y); }
    b.lineJoin = 'round'; b.lineCap = 'round';
    poly(); b.strokeStyle = 'rgba(0,0,0,.22)'; b.lineWidth = PW + 12; b.stroke();
    poly(); b.strokeStyle = '#8a5a2b'; b.lineWidth = PW + 6; b.stroke();
    poly(); b.strokeStyle = '#d9b07a'; b.lineWidth = PW; b.stroke();
    poly(); b.strokeStyle = 'rgba(255,240,200,.35)'; b.lineWidth = PW * 0.35; b.setLineDash([PW * 0.3, PW * 0.6]); b.stroke(); b.setLineDash([]);
    for (i = 0; i < 90; i++) { var p = posAt(r()); b.fillStyle = r() < 0.5 ? 'rgba(120,80,40,.45)' : 'rgba(255,255,255,.35)'; b.beginPath(); b.arc(p.x + (r() - 0.5) * PW * 0.8, p.y + (r() - 0.5) * PW * 0.8, 1 + r() * 2, 0, 7); b.fill(); }
    // ánh vàng quanh kho từ vựng (đầu đường)
    var s0 = PATH[1]; var cg = b.createRadialGradient(s0.x, 0, 4, s0.x, 0, PW * 1.8); cg.addColorStop(0, 'rgba(253,224,71,.55)'); cg.addColorStop(1, 'rgba(253,224,71,0)');
    b.fillStyle = cg; b.fillRect(s0.x - PW * 2, 0, PW * 4, PW * 1.8);
    // cây cối, đá trang trí
    var spots = (G.spots || []).map(spotXY), TREES = ['🌳', '🌲', '🌳', '🌴', '🪨', '🌲', '🌳', '🍄'];
    b.textAlign = 'center'; b.textBaseline = 'middle';
    var placed = 0;
    for (i = 0; i < 400 && placed < 26; i++) {
      var tx = r() * W, ty = r() * H * 0.84 + 6; if (distPath(tx, ty) < PW * 1.1) continue;
      if (spots.some(function (s) { return Math.hypot(s.x - tx, s.y - ty) < W * 0.11; })) continue;
      var e = TREES[Math.floor(r() * TREES.length)], sz = W * (e === '🪨' || e === '🍄' ? 0.05 : 0.075 + r() * 0.03);
      b.fillStyle = 'rgba(0,0,0,.18)'; b.beginPath(); b.ellipse(tx, ty + sz * 0.42, sz * 0.38, sz * 0.13, 0, 0, 7); b.fill();
      b.fillStyle = '#000'; b.font = sz + 'px ' + EF; b.fillText(e, tx, ty); placed++;
    }
    // vệt sáng nhẹ
    var vg = b.createRadialGradient(W / 2, H * 0.45, W * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.28)');
    b.fillStyle = vg; b.fillRect(0, 0, W, H);
  }

  /* ================= VÒNG LẶP ================= */
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    var dt = Math.min(0.05, ((ts - (last || ts)) / 1000)); last = ts;
    if (!G || !X) return;
    var m = G.paused || G.ended ? 0 : (SAY ? 0.18 : 1);   // luôn chạy tốc độ bình thường (không có nút tua nhanh)
    G.flagT += dt;
    if (m) step(dt * m);
    if (!G.paused && !G.ended && G.phase === 'prep' && !SAY) { G.prepT -= dt; if (G.prepT <= 0) startWave(); else waveBtn(); }
    render(dt);
  }
  function step(dt) {
    G.t += dt;
    // xuất quái
    if (G.phase === 'run' && G.q.length) {
      G.qT -= dt;
      if (G.qT <= 0) {
        var o = G.q.shift(), D = EN[o.t], sc = (1 + 0.2 * G.wave) * (1 + Math.min(0.6, G.tp.ti * 0.012));
        G.enemies.push({ t: o.t, w: o.w, hp: D.hp * sc, max: D.hp * sc, f: 0, slowT: 0, stunT: 0, said: false, bob: Math.random() * 6, hit: 0 });
        G.qT = o.t === 'boss' ? 2.2 : Math.max(0.85, 1.7 - G.wave * 0.09);
        if (o.t === 'boss') { banner('🐲 Trùm trộm từ xuất hiện!', 'Đừng để nó mang từ về thành – mất tới 5 từ!'); sfx('horn'); }
      }
    }
    // quái di chuyển
    for (var i = G.enemies.length - 1; i >= 0; i--) {
      var e = G.enemies[i], D2 = EN[e.t];
      if (e.stunT > 0) e.stunT -= dt;
      else { var sp = D2.spd * W * (e.slowT > 0 ? 0.5 : 1); e.f += sp * dt / PLEN; }
      if (e.slowT > 0) e.slowT -= dt; if (e.hit > 0) e.hit -= dt;
      e.bob += dt * 8;
      if (e.f >= 1) { G.enemies.splice(i, 1); hurt(D2.dmg || 1, e); if (SAY && SAY.e === e) closeSay(); }
    }
    // chòi bắn
    G.towers.forEach(function (t) {
      var T = TW[t.k], s = spotXY(G.spots[t.s]), rr = T.r * W * (1 + 0.08 * (t.lv - 1));
      t.cd -= dt; if (t.fl > 0) t.fl -= dt;
      if (t.cd > 0) return;
      var best = null;
      G.enemies.forEach(function (e) { var p = posAt(e.f); if (p.y > -10 && Math.hypot(p.x - s.x, p.y - (s.y - W * 0.02)) <= rr && (!best || e.f > best.f)) best = e; });
      if (!best) return;
      t.cd = T.cd / (1 + 0.12 * (t.lv - 1)); t.fl = 0.15;
      var dmg = T.d * Math.pow(1.5, t.lv - 1), sy = s.y - W * 0.075;
      if (t.k === 'cannon') { var p = posAt(Math.min(1, best.f + EN[best.t].spd * W * 0.55 / PLEN)); G.shots.push({ k: 'cannon', x: s.x, y: sy, sx: s.x, sy: sy, tx: p.x, ty: p.y, t: 0, dur: 0.55, d: dmg, sp: T.sp * W }); sfx('boom'); }
      else { G.shots.push({ k: t.k, x: s.x, y: sy, e: best, d: dmg, v: W * (t.k === 'arrow' ? 1.6 : 1.1), slow: T.slow }); sfx(t.k === 'arrow' ? 'arrow' : 'ice'); }
    });
    // đạn bay
    for (i = G.shots.length - 1; i >= 0; i--) {
      var b = G.shots[i];
      if (b.k === 'cannon') {
        b.t += dt; var k = Math.min(1, b.t / b.dur);
        b.x = b.sx + (b.tx - b.sx) * k; b.y = b.sy + (b.ty - b.sy) * k - Math.sin(k * Math.PI) * W * 0.12;
        if (k >= 1) {
          G.shots.splice(i, 1); boom(b.tx, b.ty, b.sp);
          G.enemies.slice().forEach(function (e) { var p = posAt(e.f); var dd = Math.hypot(p.x - b.tx, p.y - b.ty); if (dd < b.sp) dmgE(e, b.d * (dd < b.sp * 0.4 ? 1 : 0.6)); });
        }
        continue;
      }
      if (G.enemies.indexOf(b.e) < 0) { G.shots.splice(i, 1); continue; }
      var p2 = posAt(b.e.f), ty = p2.y - EN[b.e.t].sz * W * 0.35, dx = p2.x - b.x, dy = ty - b.y, dl = Math.hypot(dx, dy), mv = b.v * dt;
      b.a = Math.atan2(dy, dx);
      if (dl <= mv + 4) {
        G.shots.splice(i, 1);
        if (b.slow) { b.e.slowT = 1.6; spark(p2.x, ty, ['#e0f2fe', '#7dd3fc', '#fff'], 5); } else spark(p2.x, ty, ['#fde68a', '#fff'], 3);
        dmgE(b.e, b.d);
      } else { b.x += dx / dl * mv; b.y += dy / dl * mv; }
    }
    // hiệu ứng
    for (i = G.fx.length - 1; i >= 0; i--) { var f = G.fx[i]; f.l -= dt; if (f.l <= 0) { G.fx.splice(i, 1); continue; } if (f.vx != null) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += W * 0.9 * dt; } }
    for (i = G.txt.length - 1; i >= 0; i--) { var tx = G.txt[i]; tx.l -= dt; tx.y -= W * 0.08 * dt; if (tx.l <= 0) G.txt.splice(i, 1); }
    if (G.shake > 0) G.shake -= dt;
    // hết đợt
    if (G.phase === 'run' && !G.q.length && !G.enemies.length && !G.ended) waveDone();
  }
  function dmgE(e, d) {
    if (G.enemies.indexOf(e) < 0) return;
    e.hp -= d; e.hit = 0.12;
    if (e.hp <= 0) {
      var p = posAt(e.f), x = G.tp.w[e.w];
      G.enemies.splice(G.enemies.indexOf(e), 1);
      spark(p.x, p.y - W * 0.03, ['#fde047', '#f97316', '#fff', '#a3e635'], 12);
      var ty = p.y - W * 0.1; G.txt.forEach(function (t) { if (Math.abs(t.y - ty) < W * 0.05 && Math.abs(t.x - p.x) < W * 0.4) ty = t.y - W * 0.055; });
      G.txt.push({ x: p.x, y: ty, s: x[0] + ' · ' + x[1], c: '#fff', l: 1.6, big: 1 });
      sfx('die');
      if (!SAY && Date.now() - lastSay > 900) say(x[0]);
      if (SAY && SAY.e === e) SAY.e = null;
    }
  }
  function hurt(n, e) {
    G.hp = Math.max(0, G.hp - n); G.shake = 0.35; sfx('hurt');
    var c = PATH[PATH.length - 1]; G.txt.push({ x: c.x, y: c.y - W * 0.12, s: '📜 Mất từ “' + G.tp.w[e.w][0] + '”' + (n > 1 ? ' (−' + n + ')' : ''), c: '#fecaca', l: 1.6 });
    hud('hp');
    if (G.hp <= 0) endGame(false);
  }
  function spark(x, y, cols, n) { for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, v = W * (0.15 + Math.random() * 0.35); G.fx.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - W * 0.2, l: 0.5 + Math.random() * 0.3, c: cols[i % cols.length], r: 1.5 + Math.random() * 2.5 }); } }
  function boom(x, y, r) { G.fx.push({ ring: 1, x: x, y: y, r: r, l: 0.35, L: 0.35 }); spark(x, y, ['#f97316', '#fbbf24', '#78716c', '#fff'], 14); }

  /* ================= ĐỢT QUÁI ================= */
  function startWave() {
    if (G.phase !== 'prep' || G.ended) return;
    G.phase = 'run'; G.q = waveEnemies(G, G.wave); G.qT = 0.6;
    banner('Đợt ' + (G.wave + 1) + ' / ' + G.waves.length, G.q.length + ' con quái đang lẻn vào trộm từ!'); sfx('horn');
    waveBtn(); hud();
  }
  function waveDone() {
    if (G.wave >= G.waves.length - 1) { endGame(true); return; }
    G.wave++; G.phase = 'prep'; G.prepT = 30;
    G.waves[G.wave].forEach(function (w) { addBank(w); });
    banner('Đã chặn đợt ' + G.wave + '! 🎉', 'Đọc từ của đợt tới để có thêm vàng xây chòi'); sfx('coin');
    renderBank(); waveBtn(); hud();
  }
  function waveBtn() {
    var b = $('ttWB'); if (!b) return;
    if (G.phase !== 'prep' || G.ended) { b.style.display = 'none'; return; }
    b.style.display = '';
    var t = '⚔️ Bắt đầu đợt ' + (G.wave + 1) + '/' + G.waves.length + '<small>(' + Math.ceil(Math.max(0, G.prepT)) + 's)</small>';
    if (b._t !== t) { b._t = t; b.innerHTML = t; }
  }
  var banT = 0;
  function banner(t, s) { var el = $('ttBan'); el.innerHTML = '<b>' + esc(t) + '</b>' + (s ? '<small>' + esc(s) + '</small>' : ''); el.classList.add('on'); clearTimeout(banT); banT = setTimeout(function () { el.classList.remove('on'); }, 1900); }
  var toT = 0;
  function toast(t) { var el = $('ttToast'); el.innerHTML = t; el.classList.add('on'); clearTimeout(toT); toT = setTimeout(function () { el.classList.remove('on'); }, 2600); }

  /* ================= HUD & THANH TỪ VỰNG ================= */
  var hudV = {};
  function hud(fx) {
    var hp = $('ttHP').lastChild, gd = $('ttGold').lastChild, wv = $('ttWv').lastChild;
    hp.textContent = G.hp; gd.textContent = G.gold; wv.textContent = (G.wave + 1) + '/' + G.waves.length;
    if (fx === 'gold') { var e = $('ttGold'); e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
    if (fx === 'hp') { var h = $('ttHP'); h.classList.remove('hurt'); void h.offsetWidth; h.classList.add('hurt'); }
    $('ttPau').textContent = G.paused ? '▶' : '⏸';
  }
  function reward(w) { var s = G.said[w]; return REWARD[Math.min(2, s ? s.n : 0)]; }
  function renderBank() {
    var c = $('ttChips'), h = '';
    G.bank.forEach(function (w) {
      var x = G.tp.w[w], s = G.said[w], gain = SR ? reward(w) : PICK_REWARD;
      var pv = pronOf(x).vi;
      h += '<button class="tt-chip' + (s && s.n ? ' tried' : '') + '" data-a="chip" data-w="' + w + '"><span class="p">' + picHtml(x[2], 30) + '</span><span><b>' + esc(x[0]) + '</b>' + (pv ? '<span class="vi">🗣️ ' + esc(pv) + '</span>' : '') + '<small>+' + gain + ' 💰</small></span></button>';
    });
    if (!h) h = '<div class="tt-empty">✅ Đã đọc hết từ của đợt này. Chạm vào con quái đang trộm từ để đọc từ nó vác, được thêm 💰 và làm quái choáng!</div>';
    c.innerHTML = h;
    $('ttBN').textContent = G.bank.length ? G.bank.length + ' từ' : '';
  }

  /* ================= BẢNG ĐỌC TỪ ================= */
  var SAY = null, rec = null, recTimer = 0;
  function openSay(w, e) {
    stopRec(); closePop();
    SAY = { w: w, e: e || null, st: '', heard: '', mode: SR ? 'mic' : 'pick', opts: null, pick: -1 };
    drawSay(); $('ttSay').classList.add('on');
    if (SAY.mode === 'mic') { var s0 = SAY; say(G.tp.w[w][0], function () { setTimeout(function () { if (SAY === s0 && !rec && SAY.st === '') listen(); }, 250); }); }
    else say(G.tp.w[w][0]);
  }
  function closeSay() { stopRec(); SAY = null; var el = $('ttSay'); if (el) el.classList.remove('on'); }
  function pickOpts(w) {
    var others = G.tp.w.map(function (x, i) { return i; }).filter(function (i) { return i !== w; });
    var o = shuffle(others).slice(0, 2).concat([w]); return shuffle(o);
  }
  function drawSay() {
    if (!SAY) return;
    var x = G.tp.w[SAY.w], fb = '', body = '';
    if (SAY.mode === 'mic') {
      if (SAY.st === 'rec') fb = '🎙️ Đang nghe… hãy đọc to và rõ';
      else if (SAY.st === 'ok') fb = '<span class="ok">✅ Chuẩn rồi! ' + esc(SAY.msg || '') + '</span>';
      else if (SAY.st === 'wrong') fb = '<span class="bad">Máy nghe thành: “' + esc(SAY.heard || '…') + '”</span>&nbsp;– nghe mẫu rồi đọc lại nhé';
      else if (SAY.st === 'nospeech') fb = 'Chưa nghe thấy gì. Bấm 🎤 rồi đọc to hơn nhé.';
      else if (SAY.st === 'nosr') fb = '<span class="bad">Không dùng được micro.</span>&nbsp;Hãy cho phép app dùng micro, hoặc chọn từ thay vì đọc.';
      else fb = 'Nghe mẫu, rồi bấm 🎤 và đọc từ này';
      body = '<div class="row"><button class="tt-ib" data-a="sayhear" style="height:54px;padding:0 16px;font-size:16px">🔊 Nghe mẫu</button>' +
        '<button class="tt-mic' + (SAY.st === 'rec' ? ' rec' : '') + '" data-a="mic">🎤</button>' +
        (SAY.st === 'nosr' ? '<button class="tt-ib" data-a="topick" style="height:54px;padding:0 14px;font-size:15px">👆 Chọn từ</button>' : '<span style="width:96px"></span>') + '</div>';
    } else {
      if (!SAY.opts) SAY.opts = pickOpts(SAY.w);
      fb = SAY.st === 'ok' ? '<span class="ok">✅ Đúng rồi! ' + esc(SAY.msg || '') + '</span>' : SAY.st === 'wrong' ? '<span class="bad">Chưa đúng, nghe lại rồi chọn nhé</span>' : 'Nghe mẫu rồi chọn đúng từ tiếng Anh';
      body = '<div class="ch">' + SAY.opts.map(function (i) { var cl = SAY.st === 'ok' && i === SAY.w ? 'okb' : SAY.pick === i && i !== SAY.w ? 'bdb' : ''; return '<button class="' + cl + '" data-a="pick" data-w="' + i + '">' + esc(G.tp.w[i][0]) + '</button>'; }).join('') +
        '</div><div style="margin-top:8px"><button class="tt-ib" data-a="sayhear" style="padding:0 16px;font-size:15px">🔊 Nghe lại</button></div>';
    }
    var showWord = SAY.mode === 'mic' || SAY.st === 'ok';
    $('ttSay').innerHTML = '<button class="tt-ib x" data-a="sayx">✕</button>' +
      '<div class="top"><div>' + picHtml(x[2], 58) + '</div><div style="text-align:left"><div class="w">' + (showWord ? esc(x[0]) : '❓❓❓') + '</div>' +
      (showWord ? pronHtml(x) : '') + '<div class="mn">' + esc(x[1]) + '</div></div></div>' +
      (showWord && pronOf(x).vi ? '<div class="tip">🗣️ Cách đọc gần đúng: âm có dấu sắc là âm nhấn</div>' : '') +
      (SAY.e ? '<div style="font-size:13px;color:#fca5a5;font-weight:700">👹 Đọc đúng để làm tên trộm choáng váng!</div>' : '') +
      '<div class="fb">' + fb + '</div>' + body;
  }
  function stopRec() { clearTimeout(recTimer); if (rec) { var r = rec; rec = null; try { r.onresult = r.onerror = r.onend = null; r.abort(); } catch (e) {} } }
  function listen() {
    if (!SR || rec || !SAY) return;
    hush();
    var s0 = SAY, target = G.tp.w[SAY.w][0], r = new SR(); rec = r;
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    var got = false;
    r.onresult = function (e) {
      got = true; var alts = [];
      for (var i = 0; i < e.results.length; i++) for (var j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript);
      stopRec(); if (SAY !== s0) return;
      SAY.heard = alts[0] || '';
      if (matchWord(target, alts)) success(); else fail();
    };
    r.onerror = function (e) {
      var er = e && e.error; stopRec(); if (SAY !== s0) return;
      SAY.st = (er === 'not-allowed' || er === 'service-not-allowed' || er === 'audio-capture' || er === 'network') ? 'nosr' : 'nospeech'; drawSay();
    };
    r.onend = function () { if (!got && rec === r) { stopRec(); if (SAY === s0) { SAY.st = 'nospeech'; drawSay(); } } };
    SAY.st = 'rec'; SAY.heard = ''; drawSay();
    try { r.start(); } catch (e) { stopRec(); SAY.st = 'nosr'; drawSay(); return; }
    recTimer = setTimeout(function () { if (rec === r) { try { r.stop(); } catch (e) {} } }, 6000);
  }
  function fail() {
    var s = G.said[SAY.w] || (G.said[SAY.w] = { n: 0, ok: 0 }); s.n++;
    SAY.st = 'wrong'; sfx('bad'); drawSay(); renderBank();
  }
  function success() {
    var w = SAY.w, s = G.said[w] || (G.said[w] = { n: 0, ok: 0 }), gain;
    if (SAY.e) {
      gain = ENEMY_REWARD; var e = SAY.e;
      if (G.enemies.indexOf(e) >= 0) { e.stunT = 2.2; e.said = true; var p = posAt(e.f); spark(p.x, p.y - W * 0.05, ['#fde047', '#fff', '#a78bfa'], 12); dmgE(e, e.max * 0.25); }
    } else gain = SAY.mode === 'pick' ? PICK_REWARD : reward(w);
    if (!s.ok) G.ok++;
    s.ok = 1;
    var i = G.bank.indexOf(w); if (i >= 0) G.bank.splice(i, 1);
    G.gold += gain; SAY.st = 'ok'; SAY.msg = '+' + gain + ' 💰';
    sfx('coin'); drawSay(); renderBank(); hud('gold');
    var s0 = SAY; setTimeout(function () { if (SAY === s0) closeSay(); }, 900);
  }

  /* ================= XÂY CHÒI ================= */
  function towerAt(si) { for (var i = 0; i < G.towers.length; i++) if (G.towers[i].s === si) return G.towers[i]; return null; }
  function openPop(si) {
    G.sel = si; var t = towerAt(si), p = spotXY(G.spots[si]), el = $('ttPop'), h;
    if (!t) {
      h = '<h4>🔨 Xây chòi ở đây</h4>' + TW_KEYS.map(function (k) {
        var T = TW[k]; return '<button class="tt-opt' + (G.gold < T.c ? ' no' : '') + '" data-a="build" data-k="' + k + '"><i>' + T.e + '</i><span><b>' + T.n + '</b><small>' + T.info + '</small></span><em>' + T.c + ' 💰</em></button>';
      }).join('');
    } else {
      var T = TW[t.k], up = upCost(t);
      h = '<h4>' + T.e + ' ' + T.n + ' · cấp ' + t.lv + '</h4>' +
        (t.lv < 3 ? '<button class="tt-opt grn' + (G.gold < up ? ' no' : '') + '" data-a="up"><i>⬆️</i><span><b>Nâng lên cấp ' + (t.lv + 1) + '</b><small>Mạnh hơn, bắn xa hơn</small></span><em>' + up + ' 💰</em></button>' : '<div style="font-size:13px;opacity:.8;margin:2px 4px 6px">⭐ Đã đạt cấp cao nhất</div>') +
        '<button class="tt-opt red" data-a="sell"><i>💱</i><span><b>Bán chòi</b><small>Lấy lại một phần vàng</small></span><em>+' + Math.floor(t.spent * 0.6) + ' 💰</em></button>';
    }
    el.innerHTML = h; el.classList.add('on');
    var cvl = CV.offsetLeft, pw = el.offsetWidth, ph = el.offsetHeight, st = $('ttStage');
    var x = clamp(cvl + p.x - pw / 2, 6, st.clientWidth - pw - 6), y = p.y + W * 0.07;
    if (y + ph > st.clientHeight - 6) y = p.y - W * 0.13 - ph;
    el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(Math.max(6, y)) + 'px';
  }
  function closePop() { G && (G.sel = -1); var el = $('ttPop'); if (el) el.classList.remove('on'); }
  function upCost(t) { return Math.round(TW[t.k].c * 0.8 * t.lv); }
  function needGold(n) { toast('Còn thiếu <b>' + (n - G.gold) + ' 💰</b>. Đọc đúng các từ ở thanh dưới (hoặc chạm vào quái để đọc) để nhận vàng!'); sfx('bad'); }
  function build(k) {
    var T = TW[k]; if (G.gold < T.c) { needGold(T.c); return; }
    G.gold -= T.c; G.towers.push({ k: k, s: G.sel, lv: 1, cd: 0.2, fl: 0, spent: T.c });
    var p = spotXY(G.spots[G.sel]); spark(p.x, p.y, ['#fde68a', '#a16207', '#fff'], 12); sfx('build');
    closePop(); hud('gold');
  }

  /* ================= VẼ ================= */
  function rr(x, y, w, h, r) { X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r); X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); }
  function emo(e, x, y, sz) { X.fillStyle = '#000'; X.font = sz + 'px ' + EF; X.fillText(e, x, y); }
  function render() {
    X.setTransform(DPR, 0, 0, DPR, 0, 0);
    var sh = G.shake > 0 ? (Math.random() - 0.5) * 6 : 0;
    X.save(); X.translate(sh, sh * 0.6);
    X.drawImage(BG, 0, 0, W, H);
    X.textAlign = 'center'; X.textBaseline = 'middle';
    drawCastle(); drawVault();
    // vòng tầm bắn khi đang chọn
    if (G.sel >= 0) {
      var sp = spotXY(G.spots[G.sel]), tt = towerAt(G.sel), rad = tt ? TW[tt.k].r * W * (1 + 0.08 * (tt.lv - 1)) : TW.arrow.r * W;
      X.fillStyle = 'rgba(255,255,255,.12)'; X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 2; X.setLineDash([6, 6]);
      X.beginPath(); X.arc(sp.x, sp.y, rad, 0, 7); X.fill(); X.stroke(); X.setLineDash([]);
    }
    // ô đá xây chòi
    var pulse = 0.5 + 0.5 * Math.sin(G.flagT * 4);
    G.spots.forEach(function (s, i) {
      if (towerAt(i)) return;
      var p = spotXY(s), r = W * 0.05, can = G.gold >= TW.arrow.c;
      X.fillStyle = 'rgba(0,0,0,.25)'; X.beginPath(); X.ellipse(p.x, p.y + r * 0.35, r * 1.05, r * 0.55, 0, 0, 7); X.fill();
      var g = X.createLinearGradient(0, p.y - r, 0, p.y + r); g.addColorStop(0, '#d6d3d1'); g.addColorStop(1, '#78716c');
      X.fillStyle = g; X.beginPath(); X.ellipse(p.x, p.y, r, r * 0.62, 0, 0, 7); X.fill();
      X.strokeStyle = can ? 'rgba(253,224,71,' + (0.55 + 0.45 * pulse) + ')' : 'rgba(255,255,255,.35)'; X.lineWidth = can ? 3 : 2;
      X.beginPath(); X.ellipse(p.x, p.y, r + (can ? pulse * 3 : 0), r * 0.62 + (can ? pulse * 2 : 0), 0, 0, 7); X.stroke();
      X.fillStyle = can ? '#fef08a' : 'rgba(255,255,255,.75)'; X.font = '900 ' + Math.round(r * 1.05) + 'px ' + TF; X.fillText('+', p.x, p.y + 1);
    });
    // chòi + quái theo thứ tự từ trên xuống
    var list = [];
    G.towers.forEach(function (t) { list.push({ y: spotXY(G.spots[t.s]).y, t: t }); });
    G.enemies.forEach(function (e) { list.push({ y: posAt(e.f).y, e: e }); });
    list.sort(function (a, b) { return a.y - b.y; });
    list.forEach(function (o) { if (o.t) drawTower(o.t); else drawEnemy(o.e); });
    G.enemies.forEach(drawSign);
    // đạn
    G.shots.forEach(function (b) {
      if (b.k === 'arrow') { X.save(); X.translate(b.x, b.y); X.rotate(b.a || 0); X.strokeStyle = '#7c2d12'; X.lineWidth = 2.5; X.beginPath(); X.moveTo(-10, 0); X.lineTo(8, 0); X.stroke(); X.fillStyle = '#e5e7eb'; X.beginPath(); X.moveTo(12, 0); X.lineTo(6, -4); X.lineTo(6, 4); X.fill(); X.fillStyle = '#f87171'; X.fillRect(-12, -3, 4, 6); X.restore(); }
      else if (b.k === 'ice') { X.fillStyle = '#e0f2fe'; X.shadowColor = '#38bdf8'; X.shadowBlur = 10; X.beginPath(); X.arc(b.x, b.y, W * 0.013, 0, 7); X.fill(); X.shadowBlur = 0; }
      else { X.fillStyle = 'rgba(0,0,0,.25)'; X.beginPath(); X.ellipse(b.sx + (b.tx - b.sx) * (b.t / b.dur), b.sy + (b.ty - b.sy) * (b.t / b.dur), 6, 3, 0, 0, 7); X.fill(); var g2 = X.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, W * 0.022); g2.addColorStop(0, '#9ca3af'); g2.addColorStop(1, '#1f2937'); X.fillStyle = g2; X.beginPath(); X.arc(b.x, b.y, W * 0.02, 0, 7); X.fill(); }
    });
    // hiệu ứng
    G.fx.forEach(function (f) {
      if (f.ring) { var k = 1 - f.l / f.L; X.strokeStyle = 'rgba(251,146,60,' + (1 - k) + ')'; X.lineWidth = 5 * (1 - k) + 1; X.beginPath(); X.arc(f.x, f.y, f.r * (0.3 + k * 0.8), 0, 7); X.stroke(); X.fillStyle = 'rgba(254,215,170,' + (0.4 * (1 - k)) + ')'; X.fill(); return; }
      X.globalAlpha = clamp(f.l * 2, 0, 1); X.fillStyle = f.c; X.beginPath(); X.arc(f.x, f.y, f.r, 0, 7); X.fill(); X.globalAlpha = 1;
    });
    G.txt.forEach(function (t) {
      X.globalAlpha = clamp(t.l * 1.5, 0, 1); X.font = '900 ' + Math.round(W * (t.big ? 0.042 : 0.038)) + 'px ' + TF;
      X.lineWidth = 4; X.strokeStyle = 'rgba(0,0,0,.75)'; X.strokeText(t.s, clamp(t.x, W * 0.2, W * 0.8), t.y); X.fillStyle = t.c; X.fillText(t.s, clamp(t.x, W * 0.2, W * 0.8), t.y); X.globalAlpha = 1;
    });
    X.restore();
    if (G.paused && !G.ended) { X.fillStyle = 'rgba(0,0,0,.45)'; X.fillRect(0, 0, W, H); X.fillStyle = '#fff'; X.font = '900 ' + Math.round(W * 0.08) + 'px ' + TF; X.fillText('⏸ Tạm dừng', W / 2, H * 0.45); }
  }
  function drawCastle() {
    var end = PATH[PATH.length - 1], cx = end.x, base = Math.min(H - 4, end.y + W * 0.2), cw = W * 0.4, ch = W * 0.2, top = base - ch, c = G.tp.c;
    var hurtF = G.shake > 0;   // lúc quái mang được từ về: thành của quái lóe sáng tím
    c = '#7f1d1d';
    X.fillStyle = 'rgba(0,0,0,.28)'; X.beginPath(); X.ellipse(cx, base, cw * 0.62, W * 0.035, 0, 0, 7); X.fill();
    function stone(x, y, w, h) {
      var g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, hurtF ? '#a855f7' : '#57534e'); g.addColorStop(0.5, hurtF ? '#c084fc' : '#78716c'); g.addColorStop(1, hurtF ? '#7e22ce' : '#3f3a36');
      X.fillStyle = g; X.fillRect(x, y, w, h); X.strokeStyle = '#1c1917'; X.lineWidth = 1.5; X.strokeRect(x, y, w, h);
      X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1;
      for (var yy = y + 8, r = 0; yy < y + h; yy += 8, r++) { X.beginPath(); X.moveTo(x, yy); X.lineTo(x + w, yy); X.stroke(); for (var xx = x + (r % 2 ? 6 : 0); xx < x + w; xx += 12) { X.beginPath(); X.moveTo(xx, yy - 8); X.lineTo(xx, yy); X.stroke(); } }
    }
    function crenel(x, w, y) { var n = Math.max(3, Math.round(w / 9)), cwid = w / (n * 2 - 1); X.fillStyle = '#57534e'; X.strokeStyle = '#1c1917'; for (var i = 0; i < n; i++) { X.fillRect(x + i * cwid * 2, y - 7, cwid, 7); X.strokeRect(x + i * cwid * 2, y - 7, cwid, 7); } }
    var tw = cw * 0.24, wallY = top + ch * 0.28;
    stone(cx - cw / 2 + tw * 0.6, wallY, cw - tw * 1.2, base - wallY); crenel(cx - cw / 2 + tw * 0.6, cw - tw * 1.2, wallY);
    stone(cx - cw / 2, top, tw, base - top); crenel(cx - cw / 2, tw, top);
    stone(cx + cw / 2 - tw, top, tw, base - top); crenel(cx + cw / 2 - tw, tw, top);
    // cổng
    var gw = cw * 0.2, gh = ch * 0.45; X.fillStyle = '#1a0f0a'; X.beginPath(); X.moveTo(cx - gw / 2, base); X.lineTo(cx - gw / 2, base - gh + gw / 2); X.arc(cx, base - gh + gw / 2, gw / 2, Math.PI, 0); X.lineTo(cx + gw / 2, base); X.fill();
    X.strokeStyle = '#92400e'; X.lineWidth = 1.5; for (var k = 1; k < 4; k++) { X.beginPath(); X.moveTo(cx - gw / 2 + gw * k / 4, base); X.lineTo(cx - gw / 2 + gw * k / 4, base - gh + 4); X.stroke(); }
    // cửa sổ
    X.fillStyle = 'rgba(250,204,21,' + (0.55 + 0.35 * Math.sin(G.flagT * 3)) + ')'; [[cx - cw / 2 + tw / 2, top + ch * 0.35], [cx + cw / 2 - tw / 2, top + ch * 0.35]].forEach(function (p) { rr(p[0] - 4, p[1] - 7, 8, 14, 4); X.fill(); });
    // cờ chủ đề bay phấp phới
    [cx - cw / 2 + tw / 2, cx + cw / 2 - tw / 2, cx].forEach(function (fx, i) {
      var fy = (i === 2 ? wallY - 7 : top - 7), ph = W * (i === 2 ? 0.1 : 0.075);
      X.strokeStyle = '#334155'; X.lineWidth = 2; X.beginPath(); X.moveTo(fx, fy); X.lineTo(fx, fy - ph); X.stroke();
      var fw = W * (i === 2 ? 0.075 : 0.05), fh = fw * 0.62, wv = Math.sin(G.flagT * 5 + i) * 3;
      X.fillStyle = c; X.beginPath(); X.moveTo(fx, fy - ph); X.quadraticCurveTo(fx + fw / 2, fy - ph - 3 + wv, fx + fw, fy - ph + wv * 0.5); X.lineTo(fx + fw, fy - ph + fh + wv * 0.5); X.quadraticCurveTo(fx + fw / 2, fy - ph + fh + 3 - wv, fx, fy - ph + fh); X.fill();
      if (i === 2) emo('👹', fx + fw / 2, fy - ph + fh / 2 + wv * 0.3, fh * 0.75);
    });
    // biển tên thành của quái + số từ đã bị chúng mang về
    var lost = HPMAX - G.hp, lb = 'THÀNH CỦA QUÁI' + (lost ? ' · 📜 ' + lost : ''), fs = Math.max(10, Math.round(W * 0.03));
    X.font = '900 ' + fs + 'px ' + TF; var lw = X.measureText(lb).width + fs * 1.4, ly = base - fs * 0.2;
    X.fillStyle = 'rgba(28,25,23,.85)'; rr(cx - lw / 2, ly - fs * 1.5, lw, fs * 1.5, fs * 0.5); X.fill();
    X.strokeStyle = '#7f1d1d'; X.lineWidth = 1.5; X.stroke(); X.fillStyle = '#fca5a5'; X.fillText(lb, cx, ly - fs * 0.72);
  }
  /* Kho từ vựng ở đầu đường: nơi bầy quái lẻn vào trộm từ */
  function drawVault() {
    var p = PATH[0], s = W * 0.1, x = clamp(p.x, s * 1.3, W - s * 1.3), y = s * 0.62;
    var g = X.createRadialGradient(x, y, 2, x, y, s * 1.2); g.addColorStop(0, 'rgba(253,224,71,.5)'); g.addColorStop(1, 'rgba(253,224,71,0)');
    X.fillStyle = g; X.beginPath(); X.arc(x, y, s * 1.2, 0, 7); X.fill();
    X.fillStyle = 'rgba(0,0,0,.25)'; rr(x - s * 1.15 + 2, y - s * 0.55 + 3, s * 2.3, s * 1.1, s * 0.25); X.fill();
    var gg = X.createLinearGradient(0, y - s * 0.55, 0, y + s * 0.55); gg.addColorStop(0, '#fde68a'); gg.addColorStop(1, '#d97706');
    X.fillStyle = gg; rr(x - s * 1.15, y - s * 0.55, s * 2.3, s * 1.1, s * 0.25); X.fill(); X.strokeStyle = '#92400e'; X.lineWidth = 2; X.stroke();
    emo('📚', x - s * 0.62, y, s * 0.62); emo(G.tp.i, x + s * 0.62, y, s * 0.55);
    var fs = Math.max(9, Math.round(W * 0.026)); X.font = '900 ' + fs + 'px ' + TF;
    X.lineWidth = 3; X.strokeStyle = 'rgba(0,0,0,.6)'; X.strokeText('KHO TỪ VỰNG', x, y + s * 0.55 + fs * 0.85); X.fillStyle = '#fef08a'; X.fillText('KHO TỪ VỰNG', x, y + s * 0.55 + fs * 0.85);
  }
  function drawTower(t) {
    var T = TW[t.k], p = spotXY(G.spots[t.s]), s = W * 0.11 * (1 + 0.06 * (t.lv - 1)), x = p.x, y = p.y, fl = t.fl > 0 ? 1.06 : 1;
    X.fillStyle = 'rgba(0,0,0,.3)'; X.beginPath(); X.ellipse(x, y + s * 0.08, s * 0.5, s * 0.2, 0, 0, 7); X.fill();
    // chân đá
    var g = X.createLinearGradient(x - s * 0.4, 0, x + s * 0.4, 0); g.addColorStop(0, '#a8a29e'); g.addColorStop(0.5, '#e7e5e4'); g.addColorStop(1, '#78716c');
    X.fillStyle = g; X.beginPath(); X.moveTo(x - s * 0.42, y + s * 0.05); X.lineTo(x - s * 0.34, y - s * 0.28); X.lineTo(x + s * 0.34, y - s * 0.28); X.lineTo(x + s * 0.42, y + s * 0.05); X.closePath(); X.fill();
    X.strokeStyle = '#57534e'; X.lineWidth = 1.3; X.stroke();
    // thân gỗ
    X.fillStyle = '#92400e'; X.fillRect(x - s * 0.3, y - s * 0.62, s * 0.08, s * 0.36); X.fillRect(x + s * 0.22, y - s * 0.62, s * 0.08, s * 0.36);
    X.fillStyle = '#b45309'; rr(x - s * 0.36, y - s * 0.68, s * 0.72, s * 0.12, 3); X.fill();
    // người/vũ khí trong chòi
    X.save(); X.translate(x, y - s * 0.47); X.scale(fl, fl); emo(T.e, 0, 0, s * 0.36); X.restore();
    // mái
    X.fillStyle = T.roof; X.beginPath(); X.moveTo(x - s * 0.46, y - s * 0.66); X.lineTo(x, y - s * 1.02); X.lineTo(x + s * 0.46, y - s * 0.66); X.closePath(); X.fill();
    X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.5; X.stroke();
    X.fillStyle = 'rgba(255,255,255,.25)'; X.beginPath(); X.moveTo(x - s * 0.3, y - s * 0.7); X.lineTo(x, y - s * 0.95); X.lineTo(x - s * 0.05, y - s * 0.7); X.fill();
    // sao cấp độ
    if (t.lv > 1) { X.font = '900 ' + Math.round(s * 0.2) + 'px ' + TF; X.fillStyle = '#fde047'; X.strokeStyle = '#000'; X.lineWidth = 3; var st = '★'.repeat(t.lv); X.strokeText(st, x, y + s * 0.18); X.fillText(st, x, y + s * 0.18); }
  }
  function drawEnemy(e) {
    var D = EN[e.t], p = posAt(e.f), sz = D.sz * W, by = Math.abs(Math.sin(e.bob)) * sz * 0.1;
    if (p.y < -sz) return;
    X.fillStyle = 'rgba(0,0,0,.3)'; X.beginPath(); X.ellipse(p.x, p.y + sz * 0.3, sz * 0.38, sz * 0.13, 0, 0, 7); X.fill();
    if (e.slowT > 0) { X.fillStyle = 'rgba(125,211,252,.35)'; X.beginPath(); X.arc(p.x, p.y - sz * 0.1, sz * 0.55, 0, 7); X.fill(); }
    X.save(); X.translate(p.x, p.y - by);
    if (p.dx < 0) X.scale(-1, 1);
    if (e.hit > 0) X.globalAlpha = 0.6;
    emo(D.e, 0, 0, sz); X.restore(); X.globalAlpha = 1;
    if (e.stunT > 0) { for (var i = 0; i < 3; i++) { var a = G.flagT * 5 + i * 2.1; emo('⭐', p.x + Math.cos(a) * sz * 0.4, p.y - sz * 0.55 + Math.sin(a) * sz * 0.12, sz * 0.22); } }
    e._x = p.x; e._y = p.y; e._s = sz;
  }
  function drawSign(e) {
    var D = EN[e.t], p = posAt(e.f), sz = D.sz * W; if (p.y < -sz * 2) return;
    var x = G.tp.w[e.w], fs = Math.max(11, Math.round(W * 0.034)) * (e.t === 'boss' ? 1.15 : 1);
    X.font = '800 ' + fs + 'px ' + TF;
    var ps = fs * 1.35, tw = X.measureText(x[0]).width, bw = tw + ps + fs * 1.0, bh = fs * 1.75;
    var bx = clamp(p.x - bw / 2, 2, W - bw - 2), byy = p.y - sz * 0.62 - bh - fs * 0.7 - Math.abs(Math.sin(e.bob)) * sz * 0.08;
    // cán cầm biển
    X.strokeStyle = '#78350f'; X.lineWidth = 2.5; X.beginPath(); X.moveTo(p.x + sz * 0.18, p.y - sz * 0.15); X.lineTo(clamp(p.x, bx + 6, bx + bw - 6), byy + bh); X.stroke();
    X.fillStyle = 'rgba(0,0,0,.3)'; rr(bx + 1, byy + 2, bw, bh, 7); X.fill();
    X.fillStyle = e.said ? '#dcfce7' : '#fffbeb'; rr(bx, byy, bw, bh, 7); X.fill();
    X.strokeStyle = e.said ? '#16a34a' : G.tp.c; X.lineWidth = 2; X.stroke();
    var im = picImg(x[2]), px = bx + fs * 0.35 + ps / 2, py = byy + bh / 2;
    if (im && im.complete && im.naturalWidth) X.drawImage(im, px - ps / 2, py - ps / 2, ps, ps); else if (!im) emo(x[2], px, py + 1, ps * 0.85);
    X.fillStyle = '#1c1917'; X.font = '800 ' + fs + 'px ' + TF; X.textAlign = 'left'; X.fillText(x[0], bx + fs * 0.6 + ps, py + 1); X.textAlign = 'center';
    // máu
    var hw = Math.max(sz * 0.8, 26), hx = p.x - hw / 2, hy = byy + bh + 3;
    X.fillStyle = 'rgba(0,0,0,.6)'; X.fillRect(hx - 1, hy - 1, hw + 2, 5); X.fillStyle = e.hp / e.max > 0.5 ? '#4ade80' : e.hp / e.max > 0.25 ? '#facc15' : '#f87171'; X.fillRect(hx, hy, hw * clamp(e.hp / e.max, 0, 1), 3);
    e._sx = bx; e._sy = byy; e._sw = bw; e._sh = bh;
  }

  /* ================= CHẠM VÀO BẢN ĐỒ ================= */
  function onTap(ev) {
    if (!G || G.ended) return;
    ac();
    var r = CV.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
    if (SAY) { closeSay(); return; }
    // chạm vào quái (thân hoặc biển từ)
    var hit = null, bd = 1e9;
    G.enemies.forEach(function (e) {
      if (e._x == null) return;
      var onSign = e._sx != null && x >= e._sx - 4 && x <= e._sx + e._sw + 4 && y >= e._sy - 4 && y <= e._sy + e._sh + 8;
      var d = Math.hypot(x - e._x, y - (e._y - e._s * 0.2));
      if (onSign) d = Math.min(d, 1);
      if ((onSign || d < Math.max(e._s * 0.7, 26)) && d < bd) { bd = d; hit = e; }
    });
    if (hit) {
      closePop();
      if (hit.said) { say(G.tp.w[hit.w][0]); toast('Bạn đã đọc đúng từ <b>' + esc(G.tp.w[hit.w][0]) + '</b> của con quái này rồi 👍'); return; }
      sfx('tap'); openSay(hit.w, hit); return;
    }
    // chạm vào ô xây chòi
    var si = -1, sd = W * 0.085;
    G.spots.forEach(function (s, i) { var p = spotXY(s), d = Math.hypot(x - p.x, y - (p.y - (towerAt(i) ? W * 0.04 : 0))); if (d < sd) { sd = d; si = i; } });
    if (si >= 0) { sfx('tap'); if (G.sel === si) closePop(); else openPop(si); return; }
    closePop();
  }

  /* ================= KẾT THÚC ================= */
  function endGame(win) {
    if (G.ended) return;
    G.ended = true; closeSay(); closePop(); waveBtn();
    var st = win ? (G.hp >= HPMAX * 0.8 ? 3 : G.hp >= HPMAX * 0.4 ? 2 : 1) : 0, tp = G.tp, pv = prog(), old = pv.s[tp.id] || 0;
    if (win) { if (st > old) pv.s[tp.id] = st; pv.b[tp.id] = Math.max(pv.b[tp.id] || 0, G.hp); saveProg(); }
    var vnd = (win ? st * STAR_VND : 0) + G.ok * WORD_VND;
    try { if (window.farmEarn && (vnd || G.ok)) window.farmEarn('castle', vnd, G.ok, tp.id); } catch (e) {}
    if (win) { try { localStorage.setItem('farm6_pass', String(Date.now())); } catch (e) {} }
    sfx(win ? 'win' : 'lose');
    var good = [], bad = [];
    tp.w.forEach(function (x, i) { var s = G.said[i]; if (s && s.ok) good.push(i); else bad.push(i); });
    var next = null;
    if (win) { var list = DATA.topics.filter(function (t) { return t.g === tp.g; }), k = list.indexOf(tp); next = list[k + 1] || DATA.topics[tp.ti + 1] || null; }
    var h = '<div class="tt-endc"><div class="big">' + (win ? '🏆' : '💥') + '</div><h2>' + (win ? 'Bảo vệ kho từ thành công!' : 'Quái đã cướp quá nhiều từ!') + '</h2>' +
      (win ? '<div class="stars">' + '⭐'.repeat(st) + '<span style="opacity:.25">' + '⭐'.repeat(3 - st) + '</span></div>' : '') +
      '<div class="sum">' + (win ? 'Kho còn giữ ' + G.hp + '/' + HPMAX + ' 📚 · ' : 'Bạn chặn được ' + G.wave + '/' + G.waves.length + ' đợt · ') + 'Đọc đúng <b>' + G.ok + '/' + tp.w.length + '</b> từ</div>' +
      (vnd ? '<div class="farm">🧑‍🌾 +' + money(vnd) + ' vào Nông trại</div>' : '') +
      (bad.length ? '<div style="font-size:13.5px;font-weight:800;color:#fca5a5">Từ cần luyện thêm (chạm để nghe):</div><div class="wl">' + bad.slice(0, 24).map(function (i) { var pv = pronOf(tp.w[i]).vi; return '<span class="bd" data-a="hearw" data-i="' + i + '">' + esc(tp.w[i][0]) + (pv ? ' <i style="font-style:normal;color:#fde68a">(' + esc(pv) + ')</i>' : '') + ' · ' + esc(tp.w[i][1]) + '</span>'; }).join('') + '</div>' : '<div class="sum">🎉 Bạn đã đọc đúng toàn bộ từ vựng trong kho!</div>') +
      '<div class="acts">' + (next && win ? '<button class="tt-btn g" data-a="next" data-i="' + next.ti + '">▶ Kho từ tiếp: ' + esc(next.n) + '</button>' : '') +
      '<button class="tt-btn" data-a="again">🔁 Chơi lại kho từ này</button><button class="tt-btn s" data-a="map">🗺️ Về bản đồ các kho từ</button></div></div>';
    var el = $('ttEnd'); el.innerHTML = h; el.classList.add('on');
  }

  /* ================= SỰ KIỆN ================= */
  function startGame(tp) {
    hush(); closeSay();
    newGame(tp); show('ttGame');
    $('ttEnd').classList.remove('on'); closePop();
    requestAnimationFrame(function () {
      lay(); renderBank(); hud(); waveBtn();
      banner('Kho từ: ' + tp.n, 'Quái sắp tới trộm từ – mau chuẩn bị chòi chặn đường!');
      setTimeout(function () { if (G && G.tp === tp && !G.towers.length) toast('💡 Chạm vào từ ở thanh dưới để đọc và nhận vàng, rồi chạm ô đá <b>➕</b> để xây chòi chặn quái.'); }, 2200);
      if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
    });
  }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function onClick(ev) {
    var el = ev.target.closest ? ev.target.closest('[data-a]') : null; if (!el) return;
    var a = el.getAttribute('data-a'); ac();
    if (a === 'close') { close(); return; }
    if (a === 'snd') { SND.on = !SND.on; try { localStorage.setItem('tt_snd', SND.on ? '1' : '0'); } catch (e) {} sndBtn(); return; }
    if (a === 'castle') {
      var tp = DATA.topics[+el.getAttribute('data-i')];
      if (!unlocked(tp)) { var list = DATA.topics.filter(function (t) { return t.g === tp.g; }); alertMap('🔒 Hãy bảo vệ kho từ "' + list[list.indexOf(tp) - 1].n + '" trước để mở kho này.'); return; }
      openIntro(tp); return;
    }
    if (a === 'hear') { say(CUR.w[+el.getAttribute('data-i')][0]); return; }
    if (a === 'start') { startGame(CUR); return; }
    if (a === 'map') { stopLoop(); closeSay(); if (G) G.ended = true; G = null; renderMap(); show('ttMap'); return; }
    if (!G) return;
    if (a === 'quit') {
      if (G.ended) { el = null; stopLoop(); G = null; renderMap(); show('ttMap'); return; }
      G.paused = true; hud();
      var e2 = $('ttEnd');
      e2.innerHTML = '<div class="tt-endc"><div class="big">🏳️</div><h2>Rời trận?</h2><div class="sum">Trận đấu chưa xong sẽ không được lưu.</div><div class="acts"><button class="tt-btn g" data-a="resume">▶ Chơi tiếp</button><button class="tt-btn s" data-a="map">🗺️ Rời trận, về bản đồ</button></div></div>';
      e2.classList.add('on'); return;
    }
    if (a === 'resume') { $('ttEnd').classList.remove('on'); G.paused = false; hud(); return; }
    if (a === 'again') { startGame(G.tp); return; }
    if (a === 'next') { openIntro(DATA.topics[+el.getAttribute('data-i')]); stopLoop(); G = null; return; }
    if (a === 'hearw') { say(G.tp.w[+el.getAttribute('data-i')][0]); return; }
    if (G.ended) return;
    if (a === 'pause') { G.paused = !G.paused; hud(); return; }
    if (a === 'wave') { startWave(); return; }
    if (a === 'chip') { openSay(+el.getAttribute('data-w'), null); return; }
    if (a === 'build') { build(el.getAttribute('data-k')); return; }
    if (a === 'up') { var t = towerAt(G.sel), c = upCost(t); if (G.gold < c) { needGold(c); return; } G.gold -= c; t.spent += c; t.lv++; var p = spotXY(G.spots[t.s]); spark(p.x, p.y - W * 0.05, ['#fde047', '#fff', '#86efac'], 14); sfx('build'); hud('gold'); openPop(G.sel); return; }
    if (a === 'sell') { var t2 = towerAt(G.sel); G.gold += Math.floor(t2.spent * 0.6); G.towers.splice(G.towers.indexOf(t2), 1); sfx('coin'); hud('gold'); closePop(); return; }
    if (a === 'sayx') { closeSay(); return; }
    if (a === 'sayhear') { if (!SAY) return; stopRec(); if (SAY.st === 'rec') SAY.st = ''; say(G.tp.w[SAY.w][0]); drawSay(); return; }
    if (a === 'mic') { if (!SAY) return; if (rec) { stopRec(); SAY.st = ''; drawSay(); } else listen(); return; }
    if (a === 'topick') { if (!SAY) return; stopRec(); SAY.mode = 'pick'; SAY.st = ''; SAY.opts = null; drawSay(); say(G.tp.w[SAY.w][0]); return; }
    if (a === 'pick') {
      if (!SAY || SAY.st === 'ok') return; var w = +el.getAttribute('data-w'); SAY.pick = w;
      if (w === SAY.w) success(); else { var s = G.said[SAY.w] || (G.said[SAY.w] = { n: 0, ok: 0 }); s.n++; SAY.st = 'wrong'; sfx('bad'); drawSay(); }
    }
  }
  function alertMap(t) {
    var el = document.createElement('div');
    el.style.cssText = 'position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:9;max-width:90%;background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:10px 16px;font-weight:700;font-size:14px;text-align:center';
    el.textContent = t; $('ttMap').appendChild(el); setTimeout(function () { el.remove(); }, 2600);
  }

  /* ================= MỞ / ĐÓNG ================= */
  function open() {
    ensure(); sndBtn();
    root.classList.add('on');
    $('ttMapB').innerHTML = '<div style="text-align:center;padding:60px 0;font-size:16px;opacity:.85">⏳ Đang mở các kho từ vựng…</div>';
    show('ttMap');
    loadData().then(function () { renderMap(); }).catch(function () {
      $('ttMapB').innerHTML = '<div style="text-align:center;padding:50px 16px;font-size:15px;line-height:1.5">Không tải được dữ liệu từ vựng (file words.js).<br>Hãy kiểm tra mạng rồi mở lại game.</div>';
    });
  }
  function close() {
    stopLoop(); closeSay(); hush(); G = null;
    if (root) root.classList.remove('on');
  }
  window.SixCastleGame = { open: open, close: close };
})();
