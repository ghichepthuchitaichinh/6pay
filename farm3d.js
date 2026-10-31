/* 6PAY - NÔNG TRẠI SIXPAY · CHẾ ĐỘ XEM 3D (bản thử 2026.10.31-3d1)
   Dựng lại nông trại hiện tại thành cảnh 3D: ruộng và cây trồng (lớn dần theo thời gian thật), chuồng và vật nuôi đi lại,
   nhà ở, giếng, cối xay gió, các xưởng sản xuất, hàng rào, chòi canh, chòi bắn cung.
   Kéo 1 ngón để xoay, chụm 2 ngón để phóng to/thu nhỏ, kéo 2 ngón để di chuyển.
   Dùng thư viện three.js (r149): tìm file three.min.js cạnh app trước, không có thì tải từ CDN.
   Gọi: Farm3D.open({ snap: function () { return dữ liệu nông trại }, onClose: fn }) */
(function () {
  if (window.Farm3D) return;
  var TF = '"Be Vietnam Pro",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  var EF = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var THREE_SRC = ['games/three.min.js', './three.min.js', 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js', 'https://unpkg.com/three@0.149.0/build/three.min.js'];

  function loadThree(cb) {
    if (window.THREE && window.THREE.WebGLRenderer) { cb(true); return; }
    var i = 0;
    (function nx() {
      if (i >= THREE_SRC.length) { cb(false); return; }
      var s = document.createElement('script'); s.src = THREE_SRC[i++];
      s.onload = function () { if (window.THREE && window.THREE.WebGLRenderer) cb(true); else nx(); };
      s.onerror = function () { s.remove(); nx(); };
      document.head.appendChild(s);
    })();
  }

  var css =
    '#f3Ov{position:fixed;inset:0;z-index:100000;display:none;background:#9fd3f5;font-family:' + TF + ';-webkit-user-select:none;user-select:none;touch-action:none;-webkit-tap-highlight-color:transparent}#f3Ov.on{display:block}' +
    '#f3Ov canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.f3-top{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:8px;padding:max(8px,env(safe-area-inset-top)) 10px 8px;background:linear-gradient(180deg,rgba(20,50,10,.75),rgba(20,50,10,0));color:#fff;z-index:2;pointer-events:none}' +
    '.f3-top>*{pointer-events:auto}.f3-ttl{flex:1;font-weight:800;font-size:16px;text-shadow:0 1px 3px rgba(0,0,0,.5);pointer-events:none}.f3-ttl small{display:block;font-weight:600;font-size:11.5px;opacity:.9}' +
    '.f3-b{flex:none;min-width:42px;height:42px;border:0;border-radius:13px;background:rgba(255,255,255,.92);color:#24361a;font:800 17px ' + TF + ';box-shadow:0 3px 10px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:0 10px}.f3-b:active{transform:scale(.94)}' +
    '.f3-side{position:absolute;right:10px;bottom:max(14px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:8px;z-index:2}' +
    '.f3-chips{position:absolute;left:10px;bottom:max(14px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:6px;z-index:2}' +
    '.f3-chips button{border:0;border-radius:12px;padding:8px 12px;background:rgba(255,255,255,.92);font:800 13px ' + TF + ';color:#24361a;box-shadow:0 3px 10px rgba(0,0,0,.2);text-align:left}' +
    '.f3-msg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(255,250,240,.96);border-radius:18px;padding:16px 18px;max-width:86%;text-align:center;font-size:14.5px;line-height:1.45;color:#24361a;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:3}' +
    '.f3-tip{position:absolute;left:50%;top:calc(max(8px,env(safe-area-inset-top)) + 58px);transform:translateX(-50%);background:rgba(20,40,10,.8);color:#fff;padding:7px 14px;border-radius:14px;font-size:12.5px;font-weight:700;white-space:nowrap;z-index:2;transition:opacity .6s;pointer-events:none}';

  var ov, T, R, scene, cam, sun, hemi, clock, raf = 0, O = null, D = null, running = false;
  var world = {}, anims = [], spin = [], smokes = [], bobs = [], cells = {}, auto = false, night = false;
  var orbit = { th: -0.75, ph: 0.92, r: 95, tx: 4, tz: 2, vth: 0 };

  function $(id) { return document.getElementById(id); }
  function build() {
    if (ov) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    ov = document.createElement('div'); ov.id = 'f3Ov';
    ov.innerHTML = '<div class="f3-top"><button class="f3-b" data-a="close" aria-label="Quay lại">←</button><div class="f3-ttl">🧊 Nông trại 3D<small id="f3Sub">Bản thử · chỉ để ngắm</small></div></div>' +
      '<div class="f3-tip" id="f3Tip">☝️ Kéo để xoay · 🤏 chụm để phóng to · ✌️ kéo 2 ngón để di chuyển</div>' +
      '<div class="f3-chips"><button data-a="go" data-z="field">🌾 Khu trồng trọt</button><button data-a="go" data-z="barn">🐄 Khu chăn nuôi</button><button data-a="go" data-z="all">🗺️ Toàn cảnh</button></div>' +
      '<div class="f3-side"><button class="f3-b" data-a="night" id="f3N" aria-label="Ngày đêm">🌙</button><button class="f3-b" data-a="auto" id="f3A" aria-label="Tự xoay">🎥</button><button class="f3-b" data-a="zin">＋</button><button class="f3-b" data-a="zout">－</button></div>' +
      '<div class="f3-msg" id="f3Msg" style="display:none"></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-a]') : null; if (!el) return;
      var a = el.getAttribute('data-a');
      if (a === 'close') close();
      else if (a === 'auto') { auto = !auto; $('f3A').style.background = auto ? '#fde68a' : ''; }
      else if (a === 'night') { night = !night; $('f3N').textContent = night ? '☀️' : '🌙'; lighting(); }
      else if (a === 'zin') orbit.r = Math.max(18, orbit.r / 1.25);
      else if (a === 'zout') orbit.r = Math.min(170, orbit.r * 1.25);
      else if (a === 'go') { var z = el.getAttribute('data-z'); var pt = cam && cam.aspect < 1; flyTo(z === 'field' ? { tx: world.cF.x, tz: world.cF.z + 3, r: pt ? 62 : 48 } : z === 'barn' ? { tx: world.cB.x, tz: world.cB.z + 3, r: pt ? 58 : 44 } : { tx: world.cA.x, tz: world.cA.z + 4, r: pt ? 120 : 90 }); }
    });
    window.addEventListener('resize', function () { if (running) size(); });
  }
  function msg(h) { var m = $('f3Msg'); if (!h) { m.style.display = 'none'; return; } m.innerHTML = h; m.style.display = 'block'; }

  function open(o) {
    build(); O = o || {};
    ov.classList.add('on'); O.ovf = document.body.style.overflow; document.body.style.overflow = 'hidden';
    msg('⏳ Đang dựng nông trại 3D…');
    loadThree(function (ok) {
      if (!ok) { msg('😥 Không tải được thư viện 3D (three.js).<br>Hãy bật mạng rồi thử lại, hoặc đặt file <b>three.min.js</b> cạnh app.<br><br><button class="f3-b" data-a="close" style="margin:auto">Quay lại</button>'); return; }
      try { setup(); } catch (e) { console.error(e); msg('😥 Máy này chưa chạy được đồ hoạ 3D (WebGL).<br><br><button class="f3-b" data-a="close" style="margin:auto">Quay lại</button>'); return; }
      msg(''); running = true; clock = new THREE.Clock(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
      var tip = $('f3Tip'); tip.style.opacity = 1; setTimeout(function () { tip.style.opacity = 0; }, 4500);
    });
  }
  function close() {
    running = false; cancelAnimationFrame(raf);
    if (R) { try { disposeScene(); R.dispose(); R.forceContextLoss(); } catch (e) {} if (R.domElement.parentNode) R.domElement.parentNode.removeChild(R.domElement); R = null; }
    ov.classList.remove('on'); document.body.style.overflow = O && O.ovf || ''; msg('');
    var cb = O && O.onClose; O = null; if (cb) try { cb(); } catch (e) {}
  }
  function disposeScene() {
    scene.traverse(function (m) { if (m.geometry) m.geometry.dispose(); if (m.material) { (Array.isArray(m.material) ? m.material : [m.material]).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); }); } });
    EMO = {}; MAT = {};
  }

  /* ===== Vật liệu, hình khối dùng chung ===== */
  var MAT = {}, EMO = {};
  function mat(c, o) { var k = c + (o ? JSON.stringify(o) : ''); if (!MAT[k]) { var p = { color: c, flatShading: true }; for (var x in o) p[x] = o[x]; MAT[k] = new THREE.MeshLambertMaterial(p); } return MAT[k]; }
  function box(w, h, d, c) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); }
  function cyl(rt, rb, h, c, seg) { return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 8), mat(c)); }
  function ball(r, c, det) { return new THREE.Mesh(new THREE.IcosahedronGeometry(r, det == null ? 1 : det), mat(c)); }
  function cone(r, h, c, seg) { return new THREE.Mesh(new THREE.ConeGeometry(r, h, seg || 8), mat(c)); }
  function at(m, x, y, z) { m.position.set(x, y, z); return m; }
  function shadow(m) { m.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return m; }
  function grp() { var g = new THREE.Group(); for (var i = 0; i < arguments.length; i++) g.add(arguments[i]); return g; }
  function roof(w, d, h, c) { var m = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 4, 1), mat(c)); m.rotation.y = Math.PI / 4; m.scale.set(w * 0.72, h, d * 0.72); return m; }
  /* Emoji thành ảnh nổi (sprite) luôn quay về phía camera */
  function emoTex(e) {
    if (EMO[e]) return EMO[e];
    var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d');
    x.font = '100px ' + EF; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, 64, 72);
    var t = new THREE.CanvasTexture(c); t.anisotropy = 4; EMO[e] = t; return t;
  }
  function emoji(e, s) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: emoTex(e), transparent: true, depthWrite: false })); sp.scale.set(s, s, s); return sp; }
  function label(txt, e) {
    var c = document.createElement('canvas'), x = c.getContext('2d'); x.font = '800 40px ' + TF; var w = Math.ceil(x.measureText(txt).width) + (e ? 70 : 30);
    c.width = w; c.height = 64; x = c.getContext('2d');
    x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); if (x.roundRect) x.roundRect(0, 4, w, 56, 28); else x.rect(0, 4, w, 56); x.fill();
    if (e) { x.font = '40px ' + EF; x.textBaseline = 'middle'; x.fillText(e, 12, 34); }
    x.font = '800 34px ' + TF; x.fillStyle = '#3b2a12'; x.textBaseline = 'middle'; x.fillText(txt, e ? 60 : 15, 34);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    sp.scale.set(w / 36, 64 / 36, 1); return sp;
  }

  /* ===== Bố cục (đơn vị: mét) =====
     Khu trồng trọt bên trái: 15 ô ruộng lớn (3 cột × 5 hàng), mỗi ô 4×4 luống.
     Khu chăn nuôi bên phải: 15 ô chuồng (3 cột × 5 hàng). Nhà và công trình ở phía sau. */
  var FX = [-31, -20, -9], PX = [12, 24, 36], RZ = [-20, -9, 2, 13, 24], PL = 9, PEN = 10;

  function setup() {
    D = O.snap ? O.snap() : null; if (!D) throw new Error('no data');
    R = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    R.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    ov.insertBefore(R.domElement, ov.firstChild);
    scene = new THREE.Scene();
    cam = new THREE.PerspectiveCamera(45, 1, 0.5, 600);
    hemi = new THREE.HemisphereLight(0xdff4ff, 0x5d8a3a, 0.75); scene.add(hemi);
    sun = new THREE.DirectionalLight(0xfff3d6, 0.85); sun.position.set(-40, 70, 35); sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536); var sc = sun.shadow.camera; sc.left = -70; sc.right = 70; sc.top = 60; sc.bottom = -60; sc.near = 10; sc.far = 200; sun.shadow.bias = -0.0008;
    scene.add(sun); scene.add(sun.target);
    anims = []; spin = []; smokes = []; bobs = []; cells = {};
    ground(); scenery(); field(); barn(); buildings(); defenses(); lighting();
    size(); bindTouch();
    // tâm các khu đang dùng để camera bay tới
    function cen(list) { if (!list.length) return null; var x = 0, z = 0; list.forEach(function (p) { x += p[0]; z += p[1]; }); return { x: x / list.length, z: z / list.length }; }
    var fl = [], bl = []; D.big.forEach(function (B, k) { if (B.open) fl.push([FX[k % 3], RZ[Math.floor(k / 3)]]); });
    D.pens.forEach(function (P, i) { if (P) bl.push([PX[i % 3], RZ[Math.floor(i / 3)]]); });
    world.cF = cen(fl) || { x: -20, z: 2 }; world.cB = cen(bl) || { x: 24, z: 2 }; world.cA = cen(fl.concat(bl, [[-20, -38], [-20, -38]])) || { x: 4, z: 0 };
    var portrait = cam.aspect < 1;
    orbit.th = -0.35; orbit.ph = 0.95; orbit.tx = world.cA.x; orbit.tz = world.cA.z + 4; orbit.r = portrait ? 120 : 90;
  }
  function size() { if (!R) return; var w = ov.clientWidth, h = ov.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  function lighting() {
    if (!scene) return;
    var sky = night ? 0x1b2347 : 0x9fd3f5;
    scene.background = new THREE.Color(sky); scene.fog = new THREE.Fog(sky, 140, 320);
    hemi.intensity = night ? 0.28 : 0.62; hemi.color.set(night ? 0x8090c0 : 0xdff4ff);
    sun.intensity = night ? 0.25 : 0.85; sun.color.set(night ? 0x9fb3ff : 0xfff3d6);
    (world.lamps || []).forEach(function (l) { l.visible = night; });
    if (world.moon) world.moon.visible = night; if (world.sunBall) world.sunBall.visible = !night;
  }

  function ground() {
    var g = new THREE.PlaneGeometry(400, 400, 60, 60); g.rotateX(-Math.PI / 2);
    var cols = [], col = new THREE.Color(), pos = g.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i), z = pos.getZ(i), d = Math.max(Math.abs(x - 4) - 58, Math.abs(z - 2) - 46, 0);
      pos.setY(i, d > 0 ? Math.pow(d, 1.2) * 0.09 * (0.7 + 0.3 * Math.sin(x * 0.07) * Math.cos(z * 0.09)) : 0);
      col.setHSL(0.26 + Math.sin(x * 0.3 + z * 0.2) * 0.012, 0.42, 0.36 + ((x * 7 + z * 13) % 5) * 0.006 + (d > 0 ? 0.03 : 0));
      cols.push(col.r, col.g, col.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.computeVertexNormals();
    var m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })); m.receiveShadow = true; scene.add(m);
    // đường đất chính giữa 2 khu và đường ngang phía trước nhà
    var road = new THREE.Mesh(new THREE.PlaneGeometry(6, 64), mat(0xc9a46b)); road.rotation.x = -Math.PI / 2; at(road, 1.5, 0.03, 2); road.receiveShadow = true; scene.add(road);
    var road2 = new THREE.Mesh(new THREE.PlaneGeometry(84, 5), mat(0xc9a46b)); road2.rotation.x = -Math.PI / 2; at(road2, 2.5, 0.031, -29); road2.receiveShadow = true; scene.add(road2);
  }
  function tree(x, z, s, kind) {
    var g = new THREE.Group();
    if (kind === 'pine') { g.add(at(cyl(0.25, 0.35, 1.6, 0x6b4423, 6), 0, 0.8, 0)); g.add(at(cone(1.6, 2.6, 0x2f6b2a, 7), 0, 2.6, 0)); g.add(at(cone(1.2, 2.2, 0x3b7f33, 7), 0, 3.8, 0)); }
    else { g.add(at(cyl(0.25, 0.35, 1.8, 0x7a5032, 6), 0, 0.9, 0)); g.add(at(ball(1.5, 0x4f9a3a), 0, 2.8, 0)); g.add(at(ball(1.0, 0x5fae45), 0.8, 3.4, 0.3)); }
    g.scale.setScalar(s); at(g, x, 0, z); g.rotation.y = x * z; scene.add(shadow(g)); return g;
  }
  function scenery() {
    var rnd = mulberry(42);
    for (var i = 0; i < 110; i++) {
      var a = rnd() * Math.PI * 2, rr = 72 + rnd() * 60, x = 4 + Math.cos(a) * rr * 1.1, z = 2 + Math.sin(a) * rr * 0.85;
      var y = 0; tree(x, z, 1.2 + rnd() * 1.4, rnd() < 0.5 ? 'pine' : 'oak').position.y = y;
    }
    for (i = 0; i < 18; i++) tree(-50 + i * 6 + rnd() * 2, -48 - rnd() * 6, 1 + rnd() * 0.6, i % 3 ? 'oak' : 'pine');
    // mây
    world.clouds = [];
    for (i = 0; i < 9; i++) {
      var c = new THREE.Group(), mm = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true, transparent: true, opacity: 0.92 });
      for (var j = 0; j < 4; j++) { var b = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + rnd() * 2, 0), mm); b.position.set(j * 3.2 - 5, rnd() * 1.5, rnd() * 2); c.add(b); }
      c.position.set(-120 + rnd() * 240, 38 + rnd() * 14, -90 + rnd() * 120); scene.add(c); world.clouds.push(c);
    }
    world.sunBall = at(new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff1a8, fog: false })), -150, 110, -200); scene.add(world.sunBall);
    world.moon = at(new THREE.Mesh(new THREE.SphereGeometry(5, 16, 12), new THREE.MeshBasicMaterial({ color: 0xf1f5f9, fog: false })), 120, 100, -200); scene.add(world.moon);
    // ao nhỏ trang trí
    var pond = new THREE.Mesh(new THREE.CircleGeometry(5, 20), new THREE.MeshLambertMaterial({ color: 0x4fb3e8, transparent: true, opacity: 0.9 })); pond.rotation.x = -Math.PI / 2; at(pond, 52, 0.05, 30); scene.add(pond);
  }
  function fenceRect(cx, cz, w, d, c, h, gap) {
    var g = new THREE.Group(), hh = h || 0.9, col = c || 0x8b5a2b;
    function side(x0, z0, x1, z1) {
      var L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(2, Math.round(L / 1.6)), ang = Math.atan2(z1 - z0, x1 - x0);
      for (var i = 0; i <= n; i++) { var t = i / n; if (gap && Math.abs(t - 0.5) < gap) continue; g.add(at(box(0.18, hh, 0.18, col), x0 + (x1 - x0) * t, hh / 2, z0 + (z1 - z0) * t)); }
      [0.35, 0.75].forEach(function (k) {
        if (gap) { [[0, 0.5 - gap], [0.5 + gap, 1]].forEach(function (s) { var r = box(L * (s[1] - s[0]), 0.1, 0.08, col); r.rotation.y = -ang; at(r, x0 + (x1 - x0) * (s[0] + s[1]) / 2, hh * k, z0 + (z1 - z0) * (s[0] + s[1]) / 2); g.add(r); }); }
        else { var r = box(L, 0.1, 0.08, col); r.rotation.y = -ang; at(r, (x0 + x1) / 2, hh * k, (z0 + z1) / 2); g.add(r); }
      });
    }
    var x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    side(x0, z0, x1, z0); side(x1, z0, x1, z1); side(x1, z1, x0, z1); side(x0, z1, x0, z0);
    return shadow(g);
  }

  /* ===== Khu trồng trọt ===== */
  var FRUIT = { lua: 0xf2c94c, carot: 0xf97316, ngo: 0xfacc15, cachua: 0xef4444, bapcai: 0x86efac, ot: 0xdc2626, dau: 0xe11d48, huongduong: 0xfbbf24, khoai: 0x9a3412, bi: 0xf59e0b, chanh: 0xa3e635 };
  function field() {
    D.big.forEach(function (B, k) {
      var x = FX[k % 3], z = RZ[Math.floor(k / 3)];
      if (!B.open) {
        var lk = at(emoji('🔒', 2), x, 1.4, z); scene.add(lk);
        var gr = new THREE.Mesh(new THREE.PlaneGeometry(PL, PL), mat(0x7fb24f)); gr.rotation.x = -Math.PI / 2; at(gr, x, 0.02, z); gr.receiveShadow = true; scene.add(gr);
        for (var q = 0; q < 6; q++) scene.add(at(ball(0.35 + Math.random() * 0.3, 0x5c9c3a, 0), x + (Math.random() - 0.5) * 7, 0.2, z + (Math.random() - 0.5) * 7));
        return;
      }
      var base = shadow(at(box(PL, 0.3, PL, 0x8a5a33), x, 0.15, z)); scene.add(base);
      scene.add(fenceRect(x, z, PL + 0.8, PL + 0.8, 0xa0703f, 0.7, 0.12));
      for (var j = 0; j < 16; j++) {
        var cx = x - PL / 2 + (j % 4 + 0.5) * PL / 4, cz = z - PL / 2 + (Math.floor(j / 4) + 0.5) * PL / 4;
        var soil = at(box(PL / 4 - 0.3, 0.22, PL / 4 - 0.3, 0x6b4226), cx, 0.38, cz); soil.receiveShadow = true; scene.add(soil);
        cells[k + ':' + j] = { x: cx, z: cz, soil: soil, g: null, id: '' };
      }
      scene.add(at(label('Ô ruộng ' + (k + 1)), x, 0.9, z + PL / 2 + 1.1));
    });
    updateCrops();
  }
  function plant(c) {
    var g = new THREE.Group(), leaf = new THREE.Color(c.leaf || '#4caf50').getHex(), fr = FRUIT[c.id] || 0xf472b6;
    if (c.per) {   // cây ăn quả lâu năm
      g.add(at(cyl(0.12, 0.18, 1.2, 0x7a5032, 6), 0, 0.6, 0)); var cn = at(ball(0.85, leaf), 0, 1.6, 0); g.add(cn);
      g.userData.fruit = []; for (var i = 0; i < 6; i++) { var f = at(ball(0.13, fr, 0), Math.cos(i) * 0.7, 1.4 + (i % 3) * 0.25, Math.sin(i) * 0.7); g.add(f); g.userData.fruit.push(f); }
    } else if (c.id === 'lua' || c.id === 'ngo') {
      for (i = 0; i < 7; i++) { var st = at(cyl(0.035, 0.05, c.id === 'ngo' ? 1.4 : 0.9, leaf, 4), Math.cos(i * 2.4) * 0.45, c.id === 'ngo' ? 0.7 : 0.45, Math.sin(i * 2.4) * 0.45); st.rotation.z = Math.cos(i) * 0.12; g.add(st); }
      g.userData.fruit = []; for (i = 0; i < 4; i++) { var h = at(c.id === 'ngo' ? cyl(0.1, 0.1, 0.35, fr, 6) : ball(0.12, fr, 0), Math.cos(i * 1.6) * 0.35, c.id === 'ngo' ? 0.9 : 0.95, Math.sin(i * 1.6) * 0.35); g.add(h); g.userData.fruit.push(h); }
    } else if (c.id === 'huongduong') {
      for (i = 0; i < 3; i++) { var s = at(cyl(0.05, 0.06, 1.5, leaf, 5), (i - 1) * 0.4, 0.75, (i % 2) * 0.3); g.add(s); }
      g.userData.fruit = []; for (i = 0; i < 3; i++) { var fl = at(cyl(0.28, 0.28, 0.08, fr, 10), (i - 1) * 0.4, 1.55, (i % 2) * 0.3); fl.rotation.x = 1.2; g.add(fl); g.userData.fruit.push(fl); }
    } else {
      g.add(at(ball(0.42, leaf, 0), 0, 0.35, 0)); g.add(at(ball(0.3, leaf, 0), 0.3, 0.3, 0.2)); g.add(at(ball(0.3, leaf, 0), -0.25, 0.32, -0.2));
      g.userData.fruit = []; for (i = 0; i < 4; i++) { var b = at(ball(0.14, fr, 0), Math.cos(i * 1.57 + 0.4) * 0.42, 0.42, Math.sin(i * 1.57 + 0.4) * 0.42); g.add(b); g.userData.fruit.push(b); }
    }
    return shadow(g);
  }
  function updateCrops() {
    D.big.forEach(function (B, k) {
      if (!B.open) return;
      var by = {}; B.cells.forEach(function (c) { by[c.i] = c; });
      for (var j = 0; j < 16; j++) {
        var C = cells[k + ':' + j]; if (!C) continue; var c = by[j], id = c ? c.id + (c.per ? 'p' : '') : '';
        if (C.id !== id) {
          if (C.g) { scene.remove(C.g); C.g = null; } if (C.rp) { scene.remove(C.rp); bobs = bobs.filter(function (b0) { return b0 !== C.rp; }); C.rp = null; }
          C.id = id; if (c) { C.g = at(plant(c), C.x, 0.49, C.z); C.g.rotation.y = j * 1.3; scene.add(C.g); }
        }
        if (C.g && c) {
          var p = Math.max(0.12, c.p), s = c.per ? 0.55 + 0.45 * Math.min(1, p * 1.4) : 0.2 + 0.8 * p;
          C.g.scale.setScalar(s); (C.g.userData.fruit || []).forEach(function (f) { f.visible = c.p >= 1 || (c.per ? false : c.p > 0.8); });
          C.soil.material = mat(c.w ? 0x4a2c17 : 0x6b4226);
          if (c.p >= 1 && !C.rp) { C.rp = at(emoji(c.e, 1.1), C.x, 2.4, C.z); scene.add(C.rp); bobs.push(C.rp); }
          if (c.p < 1 && C.rp) { scene.remove(C.rp); bobs = bobs.filter(function (b0) { return b0 !== C.rp; }); C.rp = null; }
        } else C.soil.material = mat(0x6b4226);
      }
    });
  }

  /* ===== Khu chăn nuôi ===== */
  function animal(id) {
    var g = new THREE.Group(), legs = function (c, h, w, d) { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p) { g.add(at(cyl(0.07, 0.07, h, c, 5), p[0] * w, h / 2, p[1] * d)); }); };
    if (id === 'ga' || id === 'vit') {
      var wc = id === 'ga' ? 0xffffff : 0xf8fafc;
      g.add(at(ball(0.32, wc), 0, 0.45, 0)); g.add(at(ball(0.2, id === 'vit' ? 0x15803d : wc), 0, 0.78, 0.22));
      var bk = at(cone(0.07, 0.2, 0xf59e0b, 4), 0, 0.76, 0.45); bk.rotation.x = Math.PI / 2; if (id === 'vit') bk.scale.set(1.8, 1, 0.6); g.add(bk);
      if (id === 'ga') g.add(at(box(0.06, 0.14, 0.18, 0xdc2626), 0, 0.98, 0.2));
      g.add(at(cone(0.16, 0.3, wc, 5), 0, 0.6, -0.32));
      legs(0xf59e0b, 0.28, 0.1, 0.02); g.scale.setScalar(id === 'ga' ? 0.9 : 1);
    } else if (id === 'bo') {
      g.add(at(box(0.7, 0.6, 1.3, 0xf8fafc), 0, 0.85, 0)); g.add(at(box(0.72, 0.35, 0.4, 0x1f2937), 0, 0.95, 0.15)); g.add(at(box(0.5, 0.3, 0.35, 0x1f2937), 0.1, 0.8, -0.4));
      g.add(at(box(0.42, 0.42, 0.45, 0xf8fafc), 0, 1.15, 0.8)); g.add(at(box(0.3, 0.18, 0.12, 0xfda4af), 0, 1.02, 1.05));
      g.add(at(cone(0.05, 0.22, 0xe5e7eb, 4), -0.18, 1.45, 0.78)); g.add(at(cone(0.05, 0.22, 0xe5e7eb, 4), 0.18, 1.45, 0.78));
      legs(0xf8fafc, 0.6, 0.25, 0.48);
    } else if (id === 'cuu' || id === 'de') {
      var body = id === 'cuu' ? 0xf5f5f4 : 0xd6b38a;
      if (id === 'cuu') { for (var i = 0; i < 6; i++) g.add(at(ball(0.3, body, 0), Math.cos(i) * 0.18, 0.75 + (i % 2) * 0.12, (i - 2.5) * 0.15)); }
      else g.add(at(box(0.5, 0.48, 0.95, body), 0, 0.75, 0));
      g.add(at(box(0.28, 0.3, 0.34, id === 'cuu' ? 0x292524 : 0xa16207), 0, 1.0, 0.6));
      if (id === 'de') { g.add(at(cone(0.04, 0.3, 0x78716c, 4), -0.08, 1.28, 0.55)); g.add(at(cone(0.04, 0.3, 0x78716c, 4), 0.08, 1.28, 0.55)); g.add(at(cone(0.05, 0.16, 0xfafaf9, 4), 0, 0.82, 0.78)); }
      legs(id === 'cuu' ? 0x292524 : 0x92400e, 0.5, 0.15, 0.3);
    } else if (id === 'heo') {
      var pb = at(ball(0.48, 0xf9a8d4, 1), 0, 0.68, 0); pb.scale.set(1, 0.9, 1.45); g.add(pb);
      var sn = at(cyl(0.14, 0.14, 0.12, 0xf472b6, 8), 0, 0.72, 0.72); sn.rotation.x = Math.PI / 2; g.add(sn);
      g.add(at(cone(0.1, 0.18, 0xf472b6, 4), -0.2, 1.08, 0.45)); g.add(at(cone(0.1, 0.18, 0xf472b6, 4), 0.2, 1.08, 0.45));
      legs(0xf9a8d4, 0.36, 0.22, 0.38);
    } else if (id === 'ca') {
      var fb = at(ball(0.25, 0xfb923c, 1), 0, 0, 0); fb.scale.set(0.6, 0.8, 1.4); g.add(fb);
      var tl = at(cone(0.2, 0.3, 0xf97316, 4), 0, 0, -0.42); tl.rotation.x = -Math.PI / 2; g.add(tl);
    } else return emoji('🐾', 1.2);
    return shadow(g);
  }
  function barn() {
    var hiveN = 0;
    D.pens.forEach(function (P, i) {
      var x = PX[i % 3], z = RZ[Math.floor(i / 3)];
      if (!P) {
        var gr = new THREE.Mesh(new THREE.PlaneGeometry(PEN, PEN), mat(0x86bf55)); gr.rotation.x = -Math.PI / 2; at(gr, x, 0.02, z); scene.add(gr);
        scene.add(at(emoji('🪧', 1.6), x, 1.1, z)); return;
      }
      if (P.water) {
        var w = new THREE.Mesh(new THREE.BoxGeometry(PEN - 1.2, 0.4, PEN - 1.2), new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78 })); at(w, x, 0.12, z); scene.add(w);
        var rim = at(box(PEN - 0.6, 0.25, PEN - 0.6, 0xa8a29e), x, 0.06, z); scene.add(rim);
      } else { var g2 = new THREE.Mesh(new THREE.PlaneGeometry(PEN, PEN), mat(P.a === 'heo' ? 0xb08a6a : 0x9bd06a)); g2.rotation.x = -Math.PI / 2; at(g2, x, 0.03, z); g2.receiveShadow = true; scene.add(g2); }
      scene.add(fenceRect(x, z, PEN, PEN, 0xf5f0e6, 1, 0.1));
      // chuồng nhỏ
      if (P.a === 'ong') {
        for (var h = 0; h < Math.max(1, Math.min(4, Math.ceil(P.cnt / 2))); h++) { var hv = shadow(grp(at(box(1, 0.8, 1, 0xfde047), 0, 0.4, 0), at(box(1.1, 0.12, 1.1, 0xfbbf24), 0, 0.85, 0))); at(hv, x - 2.5 + h * 1.7, 0, z - 1); scene.add(hv); }
        for (var b = 0; b < Math.max(3, P.cnt * 2); b++) { var bee = at(ball(0.12, 0xfacc15, 0), x, 1.5, z); scene.add(bee); anims.push({ m: bee, bee: 1, cx: x, cz: z, ph: Math.random() * 6, r: 1 + Math.random() * 2.5 }); }
      } else if (!P.water) {
        var sh = shadow(grp(at(box(3, 1.8, 2.2, P.a === 'ga' || P.a === 'vit' ? 0xd97706 : 0xb91c1c), 0, 0.9, 0), at(roof(3.4, 2.6, 1.1, 0x7c2d12), 0, 2.35, 0), at(box(0.8, 1.1, 0.05, 0x451a03), 0, 0.55, 1.12)));
        at(sh, x - PEN / 2 + 2.2, 0, z - PEN / 2 + 1.8); scene.add(sh);
        scene.add(at(box(1.6, 0.3, 0.5, 0x92400e), x + 2.8, 0.15, z - 3.6)); // máng ăn
      }
      scene.add(at(label(P.n + ' · ' + P.cnt, P.e), x, 3.6, z));
      if (P.a === 'ong') return;
      for (var k = 0; k < P.cnt; k++) {
        var m = animal(P.a), ax = x + (Math.random() - 0.5) * (PEN - 3), az = z + (Math.random() - 0.5) * (PEN - 3) + 1;
        at(m, ax, P.water ? (P.a === 'vit' ? 0.25 : -0.05) : 0, az); scene.add(m);
        anims.push({ m: m, cx: x, cz: z + 0.6, half: PEN / 2 - 1.4, tx: ax, tz: az, sp: P.a === 'ca' ? 1.2 : P.a === 'ga' || P.a === 'vit' ? 1.1 : 0.6, wait: Math.random() * 3, swim: !!P.water, y0: m.position.y, kind: P.a });
      }
    });
  }

  /* ===== Nhà ở & công trình ===== */
  function house(kind) {
    var g = new THREE.Group();
    if (kind === 'nha3') {
      g.add(at(box(9, 3.2, 6, 0xf8fafc), 0, 1.6, 0)); g.add(at(box(6, 2.6, 5, 0xf1f5f9), -1, 4.5, -0.3));
      g.add(at(roof(10, 7, 1.8, 0x1d4ed8), 0, 4.1, 0)); g.add(at(roof(7, 6, 1.8, 0x1e40af), -1, 6.7, -0.3));
      for (var i = 0; i < 4; i++) g.add(at(cyl(0.2, 0.2, 3.2, 0xffffff, 8), -3 + i * 2, 1.6, 3.4));
      g.add(at(box(1.4, 2.2, 0.1, 0x7c2d12), 0, 1.1, 3.02));
      [-3, 3].forEach(function (x) { g.add(at(box(1.2, 1, 0.1, 0x93c5fd), x, 2, 3.02)); });
    } else if (kind === 'nha2') {
      g.add(at(box(7, 3, 5, 0xb45309), 0, 1.5, 0)); g.add(at(roof(8, 6, 2.2, 0x991b1b), 0, 4.1, 0));
      g.add(at(box(1.2, 2, 0.1, 0x451a03), 0, 1, 2.52)); [-2.3, 2.3].forEach(function (x) { g.add(at(box(1.1, 1, 0.1, 0xbae6fd), x, 1.8, 2.52)); });
      g.add(at(box(0.8, 1.6, 0.8, 0x78350f), 2.2, 4.6, -1));
    } else {
      g.add(at(box(6, 2.6, 4.5, 0xe7c9a0), 0, 1.3, 0)); g.add(at(roof(7, 5.5, 2, 0xb91c1c), 0, 3.6, 0));
      g.add(at(box(1.1, 1.9, 0.1, 0x7c4a1e), 0, 0.95, 2.27)); [-1.9, 1.9].forEach(function (x) { g.add(at(box(1, 0.9, 0.1, 0x93c5fd), x, 1.6, 2.27)); });
      if (kind === 'them') g.add(at(box(7, 0.25, 1.8, 0xa16207), 0, 0.12, 3.1));
    }
    var lamp = new THREE.PointLight(0xffc56b, 1.4, 16); at(lamp, 0, 2.2, 4); lamp.visible = false; g.add(lamp); (world.lamps = world.lamps || []).push(lamp);
    return shadow(g);
  }
  function factory(B, i) {
    var cols = [0xfef3c7, 0xe0f2fe, 0xfce7f3, 0xdcfce7, 0xede9fe, 0xffedd5], rc = [0xb45309, 0x0369a1, 0xbe185d, 0x15803d, 0x6d28d9, 0xc2410c];
    var g = new THREE.Group();
    g.add(at(box(5, 3, 4, cols[i % 6]), 0, 1.5, 0)); g.add(at(roof(5.6, 4.6, 1.4, rc[i % 6]), 0, 3.7, 0));
    g.add(at(box(1.6, 2, 0.1, 0x57534e), 0, 1, 2.02)); g.add(at(cyl(0.35, 0.45, 2.6, 0x78716c), 1.6, 4.2, -1));
    var sm = []; for (var k = 0; k < 3; k++) { var s = at(new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), new THREE.MeshLambertMaterial({ color: 0xe5e7eb, transparent: true, opacity: 0.8 })), 1.6, 5.6 + k, -1); g.add(s); sm.push(s); }
    smokes.push(sm);
    g.add(at(emoji(B.e, 2), 0, 6.6, 0));
    return shadow(g);
  }
  function buildings() {
    var has = {}; D.blds.forEach(function (b) { has[b.id] = 1; });
    var hk = has.nha3 ? 'nha3' : has.nha2 ? 'nha2' : has.them ? 'them' : 'nha';
    var H = house(hk); at(H, -20, 0, -38); scene.add(H);
    scene.add(at(label(hk === 'nha3' ? 'Biệt thự' : hk === 'nha2' ? 'Nhà gạch' : 'Nhà của bạn', '🏡'), -20, hk === 'nha3' ? 9.5 : 7, -38));
    if (has.gieng) { var wl = shadow(grp(at(cyl(1, 1.1, 1, 0x9ca3af, 12), 0, 0.5, 0), at(cyl(0.85, 0.85, 0.1, 0x38bdf8, 12), 0, 0.95, 0), at(box(0.15, 2.2, 0.15, 0x7a5032), -0.9, 1.6, 0), at(box(0.15, 2.2, 0.15, 0x7a5032), 0.9, 1.6, 0), at(roof(2.4, 1.6, 0.8, 0x92400e), 0, 3, 0))); at(wl, -31, 0, -34); scene.add(wl); }
    if (has.coixay) {
      var wm = new THREE.Group(); wm.add(at(cyl(0.9, 1.6, 7, 0xf5f5f4, 8), 0, 3.5, 0)); wm.add(at(cone(1.2, 1.5, 0x991b1b, 8), 0, 7.7, 0));
      var hub = new THREE.Group(); at(hub, 0, 6.6, 1.2);
      for (var k = 0; k < 4; k++) { var bl = at(box(0.6, 4.2, 0.08, 0xfef9c3), 0, 2.1, 0); var arm = new THREE.Group(); arm.add(bl); arm.rotation.z = k * Math.PI / 2; hub.add(arm); }
      wm.add(hub); spin.push(hub); at(wm, -9, 0, -40); scene.add(shadow(wm));
    }
    var fac = D.blds.filter(function (b) { return ['them', 'nha2', 'nha3', 'gieng', 'coixay'].indexOf(b.id) < 0; });
    fac.forEach(function (B, i) {
      var f = factory(B, i), col = i % 6, row = Math.floor(i / 6);
      at(f, 6 + col * 7.5, 0, -38 - row * 7); f.rotation.y = 0; scene.add(f);
    });
    if (!fac.length) scene.add(at(label('Khu sản xuất (chưa xây xưởng)', '🏭'), 24, 1.5, -38));
  }
  function watchTower(x, z, archer) {
    var g = new THREE.Group();
    [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].forEach(function (p) { g.add(at(cyl(0.12, 0.15, 5, 0x7a5032, 6), p[0], 2.5, p[1])); });
    g.add(at(box(2.6, 0.25, 2.6, 0xa16207), 0, 5, 0)); g.add(at(box(2.6, 0.7, 0.1, 0x92400e), 0, 5.45, 1.25)); g.add(at(box(2.6, 0.7, 0.1, 0x92400e), 0, 5.45, -1.25));
    g.add(at(roof(3.2, 3.2, 1.5, archer ? 0x991b1b : 0x92400e), 0, 6.8, 0));
    g.add(at(emoji(archer ? '🏹' : '👀', 1.4), 0, 5.9, 0));
    if (archer) g.add(at(emoji('🚩', 1.2), 1.3, 8, 0));
    at(g, x, 0, z); scene.add(shadow(g));
  }
  function defenses() {
    var d = D.defs || {};
    if (d.rao) scene.add(fenceRect(4, -6, 92, 84, 0x7a5032, 1.6, 0));
    if (d.choi) [[-43, -47], [51, -47], [-43, 35], [51, 35]].forEach(function (p) { watchTower(p[0], p[1], false); });
    if (d.cung) [[-43, -6], [51, -6]].forEach(function (p) { watchTower(p[0], p[1], true); });
  }

  /* ===== Điều khiển camera (cảm ứng + chuột) ===== */
  var ptrs = {}, last = null, fly = null;
  function bindTouch() {
    var el = R.domElement;
    el.addEventListener('pointerdown', function (e) { el.setPointerCapture(e.pointerId); ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; last = null; fly = null; orbit.vth = 0; });
    el.addEventListener('pointermove', function (e) {
      if (!ptrs[e.pointerId]) return; var p = ptrs[e.pointerId], dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      var ids = Object.keys(ptrs);
      if (ids.length === 1) { orbit.th -= dx * 0.006; orbit.ph = clamp(orbit.ph - dy * 0.005, 0.25, 1.45); orbit.vth = -dx * 0.006; }
      else if (ids.length >= 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], dist = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (last) {
          orbit.r = clamp(orbit.r * last.d / Math.max(10, dist), 18, 170);
          var k = orbit.r * 0.0016, mdx = mx - last.mx, mdy = my - last.my, s = Math.sin(orbit.th), c = Math.cos(orbit.th);
          orbit.tx = clamp(orbit.tx - (c * mdx + s * mdy) * k, -60, 70); orbit.tz = clamp(orbit.tz - (-s * mdx + c * mdy) * k, -55, 45);
        }
        last = { d: dist, mx: mx, my: my };
      }
    });
    function up(e) { delete ptrs[e.pointerId]; last = null; }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', function (e) { e.preventDefault(); orbit.r = clamp(orbit.r * Math.exp(e.deltaY * 0.001), 18, 170); }, { passive: false });
  }
  function flyTo(t) { fly = { from: { tx: orbit.tx, tz: orbit.tz, r: orbit.r }, to: t, k: 0 }; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ===== Vòng lặp ===== */
  var refreshT = 0, tt = 0;
  function loop() {
    if (!running) return;
    var dt = Math.min(0.05, clock.getDelta()); tt += dt;
    if (fly) { fly.k = Math.min(1, fly.k + dt * 1.6); var e = 1 - Math.pow(1 - fly.k, 3); ['tx', 'tz', 'r'].forEach(function (k) { orbit[k] = fly.from[k] + (fly.to[k] - fly.from[k]) * e; }); if (fly.k >= 1) fly = null; }
    if (auto) orbit.th += dt * 0.12; else if (!Object.keys(ptrs).length && Math.abs(orbit.vth) > 0.0005) { orbit.th += orbit.vth; orbit.vth *= 0.92; }
    var cp = Math.cos(orbit.ph), sp = Math.sin(orbit.ph);
    cam.position.set(orbit.tx + orbit.r * sp * Math.sin(orbit.th), orbit.r * cp + 2, orbit.tz + orbit.r * sp * Math.cos(orbit.th));
    cam.lookAt(orbit.tx, 0, orbit.tz);
    sun.position.set(orbit.tx - 40, 70, orbit.tz + 35); sun.target.position.set(orbit.tx, 0, orbit.tz);
    anims.forEach(function (a) {
      if (a.bee) { a.ph += dt * 2.5; a.m.position.set(a.cx + Math.cos(a.ph) * a.r, 1.4 + Math.sin(a.ph * 3) * 0.4, a.cz + Math.sin(a.ph * 1.3) * a.r); return; }
      var m = a.m;
      if (a.wait > 0) { a.wait -= dt; m.position.y = a.y0 + (a.swim ? Math.sin(tt * 2 + a.cx) * 0.05 : 0); return; }
      var dx = a.tx - m.position.x, dz = a.tz - m.position.z, d = Math.hypot(dx, dz);
      if (d < 0.2) { a.tx = a.cx + (Math.random() - 0.5) * 2 * a.half; a.tz = a.cz + (Math.random() - 0.5) * 2 * a.half; a.wait = a.swim ? 0 : 1 + Math.random() * 4; return; }
      var st = Math.min(d, a.sp * dt); m.position.x += dx / d * st; m.position.z += dz / d * st;
      var ang = Math.atan2(dx, dz), da = ((ang - m.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI; m.rotation.y += da * Math.min(1, dt * 6);
      m.position.y = a.y0 + (a.swim ? Math.sin(tt * 3) * 0.05 : Math.abs(Math.sin(tt * 10 * a.sp)) * 0.08);
    });
    spin.forEach(function (h) { h.rotation.z -= dt * 1.2; });
    smokes.forEach(function (sm) { sm.forEach(function (s, i) { var k = (tt * 0.35 + i / 3) % 1; s.position.y = 4.8 + k * 3.2; s.position.x = 1.6 + k * 0.8; s.scale.setScalar(0.6 + k * 1.4); s.material.opacity = 0.75 * (1 - k); }); });
    bobs.forEach(function (b, i) { b.position.y = 2.4 + Math.sin(tt * 3 + i) * 0.18; });
    (world.clouds || []).forEach(function (c) { c.position.x += dt * 1.5; if (c.position.x > 140) c.position.x = -140; });
    refreshT += dt; if (refreshT > 3 && O && O.snap) { refreshT = 0; try { D = O.snap(); updateCrops(); } catch (e2) {} }
    R.render(scene, cam);
    raf = requestAnimationFrame(loop);
  }

  window.Farm3D = { open: open, close: close, ver: '3d1' };
})();
