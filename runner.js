/* 6PAY - Game Bước nhảy tài chính. File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
 var st=document.createElement("style");st.textContent="#g6Wrap{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:rgba(10,15,30,.95);align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:'Be Vietnam Pro',system-ui,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\n#g6Wrap.show{display:flex}\n#g6Box{width:100%;max-width:640px;color:#fff}\n#g6Top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:16px;font-weight:bold}\n#g6Snd,#g6Close,#g6Back{background:#33415f;color:#fff;border:none;border-radius:8px;font:inherit;font-size:16px;padding:6px 12px;cursor:pointer}\n#g6Cv{width:100%;height:auto;border-radius:12px;touch-action:none;display:block}\n#g6Msg{margin-top:10px;font-size:14px;line-height:1.4;color:#c9d4ee;text-align:center;min-height:20px}\n#g6Rot{display:none;margin-top:8px;text-align:center;font-size:13px;color:#ffd54f}\n@media (orientation:portrait) and (max-width:700px){#g6Rot{display:block}}\n@media (orientation:landscape) and (max-height:500px){\n#g6Wrap{padding:6px}\n#g6Box{max-width:none}\n#g6Top{margin-bottom:4px;font-size:14px}\n#g6Cv{width:100%;height:calc(100vh - 90px);object-fit:contain}\n#g6Msg{margin-top:6px;font-size:12px;min-height:16px}\n}";document.head.appendChild(st);
 var d=document.createElement("div");d.innerHTML="\n<div id=\"g6Wrap\">\n  <div id=\"g6Box\">\n   <div id=\"g6Top\"><span><button id=\"g6Back\" type=\"button\" aria-label=\"Quay lại\">←</button> Bước nhảy tài chính</span><span><button id=\"g6Snd\" type=\"button\" aria-label=\"Bật tắt âm thanh\">🔊</button> <button id=\"g6Close\" type=\"button\">✕ Đóng</button></span></div>\n    <canvas id=\"g6Cv\" width=\"640\" height=\"240\"></canvas>\n    <div id=\"g6Msg\"></div>\n    <div id=\"g6Rot\">📱 Xoay ngang điện thoại để chơi thoải mái hơn</div>\n  </div>\n</div>\n";while(d.firstChild)document.body.appendChild(d.firstChild);
})();
(function () {
  if (window.open6PayGame) return;

  // ======== CÁC SỐ CÓ THỂ CHỈNH ========
  var BLUE_MONEY = 20000;   // chạm ô xanh: được cộng
  var RED_MONEY  = 30000;   // chạm ô đỏ: bị trừ
  var V0 = 300;             // tốc độ cơ bản (px/giây)
  var MAXT = 90;            // tối đa 90 giây mỗi cửa
  var BOOST_MAX = 3;        // chạy nhanh nhất gấp 3 lần tốc độ cơ bản
  var BOOST_UP = 1.2;       // tốc độ tăng dần khi giữ nửa trái (lần/giây)
  var BOOST_DOWN = 1.0;     // tốc độ giảm dần khi nhả tay
  var DUCK_BRAKE = 3;       // khi đang cúi, tốc độ giảm nhanh gấp 3 lần
  var STUMBLE_T = 0.6;      // thời gian loạng choạng sau khi va ô đỏ (giây)
  var STUMBLE_F = 0.5;      // tốc độ lúc loạng choạng (0,5 = còn một nửa)
  var HOLD_MS = 180;        // giữ nửa phải quá thời gian này thì tính là cúi
  var MAX_DPR = 4;          // độ nét tối đa của canvas (nhân với mật độ điểm ảnh màn hình)
  // =====================================

  var FONT = "'Be Vietnam Pro','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

  var W = 640, H = 240, GY = 200, PX = 70, PW = 36, PH = 36, PD = 20;
  var GRAV = 2200, JUMP = 700;
  var LEN = V0 * MAXT;      // quãng đường mỗi cửa
  var OW = 56;
  var KEY = '6pay_game_rank_v3';
  var PAUSE_CY = 231;       // vị trí biểu tượng tạm dừng (giữa dòng chữ hướng dẫn phía dưới)

  var DOORS = [
    { l: 'Thiết yếu', i: '🏠', c: '#2c7be5',
      good: 'Tiền nhà|Tiền điện|Tiền nước|Internet|Gạo|Rau củ|Thịt cá|Trứng sữa|Nấu ăn ở nhà|Xăng xe|Vé xe buýt|Bảo dưỡng xe|Thuốc men|Khám bệnh|Bảo hiểm y tế|Gas nấu ăn|Nước uống|Xà phòng|Kem đánh răng|Giấy vệ sinh|Quần áo cần thiết|Giày đi làm|Học phí con|Sữa cho bé|Cước điện thoại|Sửa nhà cửa|Đồ dùng nhà bếp|Chăn màn|Vệ sinh nhà ở|Bảo hiểm xã hội'.split('|'),
      bad: 'Ăn ngoài liên tục|Trà sữa mỗi ngày|Đồ xa xỉ|Mua dự trữ quá nhiều|Ăn vặt vô độ|Giao đồ ăn liên tục|Nhậu nhẹt|Thuốc lá|Rượu bia|Mua đồ trùng lặp|Bỏ phí thực phẩm|Bật điện lãng phí|Xả nước phí|Đổi điện thoại mới|Mua theo quảng cáo|Hàng hiệu|Gói cước thừa|Đăng ký không dùng|Taxi không cần|Sửa xe quá mức|Mua đồ chỉ vì sale|Đồ chơi đắt tiền|Trang trí đắt đỏ|Mỹ phẩm để không|Quần áo cất tủ|Buffet hằng tuần|Cà phê sang mỗi ngày|Mua sắm lúc buồn|Vay nóng chi tiêu|Nợ thẻ tín dụng'.split('|') },
    { l: 'Phát triển bản thân', i: '📚', c: '#8e44ad',
      good: 'Sách kỹ năng|Khóa học online|Học phí|Học ngoại ngữ|Tiếng Anh giao tiếp|Học tin học|Học lập trình|Kỹ năng mềm|Kỹ năng quản lý|Hội thảo hữu ích|Workshop|Chứng chỉ nghề|Sách tài chính|Sách tâm lý|Từ điển|Bút vở|Máy tính học tập|Phần mềm học|Người cố vấn|Câu lạc bộ học tập|Kỹ năng thuyết trình|Học đầu tư|Kỹ năng bán hàng|Podcast học tập|Khóa học nghề|Lệ phí thi chứng chỉ|Học nhạc|Học bơi|Học thiền|Gặp người thầy giỏi'.split('|'),
      bad: 'Mua khóa bỏ dở|Sách chất đống|Thiết bị quá đắt|Khóa làm giàu nhanh|Chứng chỉ vô giá trị|Sưu tầm khóa học|Mua combo thừa|Học vì sĩ diện|Máy xịn không dùng|App học bỏ dở|Hội thảo bán hàng|Lớp không uy tín|Mua sách để khoe|Văn phòng phẩm thừa|Cày phim thay học|Lướt mạng giết giờ|Trì hoãn học|Học dàn trải|Vay tiền học vô định|Bút đắt tiền|Đổi khóa liên tục|Mua tài khoản lậu|Bằng cấp giả|Khóa học đa cấp|Sắm đồ hiệu đi học|Không ôn bài|Học thêm không cần|App tốn kém|Mua tài liệu rồi quên|Học mà không hành'.split('|') },
    { l: 'Tiết kiệm', i: '🐷', c: '#16a085',
      good: 'Gửi tiết kiệm|Quỹ dự phòng|Để dành mua nhà|Để dành mua xe|Quỹ cưới hỏi|Quỹ du lịch|Quỹ y tế|Quỹ tuổi già|Quỹ học phí con|Sổ có kỳ hạn|Tiết kiệm tự động|Heo đất|Hưởng lãi kép|Cất tiền đầu tháng|Trả cho mình trước|Tiết kiệm online|Giảm chi cố định|So sánh giá|Mua đúng nhu cầu|Sửa đồ cũ|Tự nấu ăn|Đi chung xe|Tắt điện khi không dùng|Lập ngân sách|Ghi chép thu chi|Đặt mục tiêu tiết kiệm|Gửi thêm tiền thưởng|Quỹ bảo hiểm|Chờ 48 giờ mới mua|Mua đồ cũ còn tốt'.split('|'),
      bad: 'Rút ra tiêu vặt|Dùng khi chưa khẩn cấp|Cho vay không giấy tờ|Vay nóng|Tiêu hết mới tiết kiệm|Rút sổ trước hạn|Mua theo cảm xúc|Mua vì khuyến mãi|Săn flash sale|Chốt đơn livestream|Cất tiền mặt trong nhà|Quên ghi chép|Không có mục tiêu|Quẹt thẻ quá hạn mức|Gửi nơi thiếu uy tín|Cho bạn mượn mãi|Lấy quỹ dự phòng đi chơi|Tiêu ngay tiền thưởng|Mua combo thừa|Nâng cấp không cần|Mua vì sợ lỡ|Phí duy trì thừa|Chi tiêu quên tính|Trả góp liên tục|Cá cược|Đánh bạc|Bỏ bê mục tiêu|Mua sắm lúc buồn|Vay để mua sắm|Rút lãi tiêu luôn'.split('|') },
    { l: 'Đầu tư', i: '📈', c: '#e67e22',
      good: 'Chứng chỉ quỹ|ETF|Cổ phiếu hiểu rõ|Trái phiếu uy tín|Vàng dài hạn|Đầu tư định kỳ|Đa dạng hóa|Dùng tiền nhàn rỗi|Vốn kinh doanh nhỏ|Học trước khi đầu tư|Đọc báo cáo tài chính|Đặt mức cắt lỗ|Kiên nhẫn dài hạn|Nhận cổ tức|Bất động sản có kế hoạch|Quỹ mở|Quỹ hưu trí|Tài khoản chứng khoán|Phân bổ tài sản|Đầu tư vào kỹ năng|Kiểm tra pháp lý|Hỏi chuyên gia chính thống|Theo dõi danh mục|Tái đầu tư lãi|Giữ tiền mặt dự phòng|Tài sản tạo dòng tiền|Nhà cho thuê|Kinh doanh nhỏ|Hiểu rõ rủi ro|Ghi nhật ký đầu tư'.split('|'),
      bad: 'Vay tiền đầu tư|Tin lời hứa lãi cao|Cam kết không rủi ro|Dồn hết một chỗ|FOMO đu theo|Nghe tin đồn|Nhóm kín báo mã|Mô hình Ponzi|Đa cấp|Tiền ảo đu đỉnh|Đòn bẩy quá cao|Mua đỉnh bán đáy|Bán tháo hoảng loạn|Đầu tư không hiểu|Lướt sóng liên tục|Vay ký quỹ|Góp vốn không giấy tờ|Chuyển tiền người lạ|Cung cấp mã OTP|Bấm link lạ|Sàn không giấy phép|Theo đám đông|Không đặt cắt lỗ|Gồng lỗ|Dồn một mã duy nhất|Dùng tiền sinh hoạt|Bỏ qua phí|Cá độ gọi là đầu tư|Đầu tư theo cảm xúc|Hứa chắc lãi 5%/tháng'.split('|') },
    { l: 'Chia sẻ', i: '🤝', c: '#d35400',
      good: 'Biếu cha mẹ|Hỗ trợ người thân|Mừng cưới|Thăm bệnh|Viếng đám|Từ thiện|Quyên góp bão lũ|Giúp người khó khăn|Quà ý nghĩa|Quà sinh nhật bạn|Mừng tân gia|Giúp bạn lúc khó|Học bổng|Ủng hộ trẻ em|Bữa cơm từ thiện|Nuôi thú bị bỏ rơi|Mua sách tặng|Quà thầy cô|Lì xì ngày Tết|Giúp hàng xóm|Quỹ lớp|Quỹ gia đình|Họp mặt gia đình|Tiếp đãi khách|Mời bạn một bữa|Gây quỹ cộng đồng|Giúp đồng nghiệp|Quà cho con|Đóng góp chùa, nhà thờ|Quà Trung thu'.split('|'),
      bad: 'Chi vì sĩ diện|Cho vay vượt sức|Bỏ quên chính mình|Mừng quá khả năng|Khoe khoang|Chiều lòng mọi người|Cho vay không đòi|Từ thiện không rõ nguồn|Góp quỹ lừa đảo|Quà đắt tiền để khoe|Đãi tiệc quá lố|Vay tiền để cho|Không dám từ chối|Chia sẻ vượt ngân sách|Mua quà cạnh tranh|Tặng để nhờ vả|Chi khi chưa rõ|Bao cả bàn|Mừng theo phong trào|Đưa tiền người lạ|Kêu gọi qua mạng không rõ|Cho mượn mãi không trả|Cắt tiền thiết yếu để cho|Quên chăm sóc bản thân|Giúp mà hại gia đình|Chuyển khoản vội|Góp tiền kiểu đa cấp|Quà để hối lộ|Tặng vượt thu nhập|Mua danh bằng tiền'.split('|') },
    { l: 'Hưởng thụ', i: '🎉', c: '#e84393',
      good: 'Ăn nhà hàng|Cà phê cùng bạn|Xem phim|Du lịch|Nghỉ dưỡng|Cắm trại|Karaoke|Chơi thể thao|Spa thư giãn|Massage|Sách yêu thích|Chơi game vừa phải|Nghe hòa nhạc|Tham quan bảo tàng|Đi picnic|Đi biển|Leo núi|Sở thích cá nhân|Tự thưởng bản thân|Sinh nhật bản thân|Kỷ niệm ngày cưới|Đi chơi cùng gia đình|Nấu bữa ngon|Mua hoa|Làm đẹp|Cắt tóc|Đồ yêu thích|Chụp ảnh kỷ niệm|Nghỉ ngơi|Quà cho chính mình'.split('|'),
      bad: 'Chi vượt mức ví|Trả góp để hưởng thụ|Mua theo hứng|Mua vì khuyến mãi|Nhậu mỗi ngày|Du lịch bằng thẻ vay|Spa trả góp|Mua đồ hiệu|Săn sale vô độ|Cá cược|Nạp tiền game|Mua skin|Quẹt thẻ quên tính|Tiêu hết lương|Tiệc tùng quá đà|Phòng sang chảnh|Mua xe để khoe|Sống ảo tốn kém|Ăn uống lãng phí|Lấy tiền ví khác|Vay để đi chơi|Nợ thẻ tín dụng|Mua điện thoại đắt|Cà phê sang mỗi ngày|Đồ công nghệ thừa|Gói thuê bao thừa|Cá độ bóng đá|Xổ số mỗi ngày|Hưởng thụ trước nghĩa vụ|Mua sắm lúc buồn'.split('|') }
  ];

  var HINT = 'Nửa trái màn hình: giữ để chạy nhanh (đang cúi thì không tăng tốc được), nhả ra thì chậm dần. Nửa phải: chạm để nhảy, giữ để cúi. Ô xanh: chạm vào để nhận tiền. Ô đỏ: tránh, chạm vào bị trừ tiền và chậm lại. Tạm dừng: chạm vào hai gạch dọc ở giữa phía dưới khung game. Máy tính: Space nhảy, ↓ cúi, → chạy nhanh, P tạm dừng.';

  // ===== Âm thanh (tạo bằng Web Audio, không cần file âm thanh) =====
  var SND_KEY='6pay_game_sound', sndOn=true;
  try{sndOn=localStorage.getItem(SND_KEY)!=='0';}catch(e){}
  var AC=null, mg=null, musicTimer=0, musicStep=0;
  function acInit(){
    if(AC){ if(AC.state==='suspended'){try{AC.resume();}catch(e){}} return; }
    try{
      var A=window.AudioContext||window.webkitAudioContext; if(!A)return;
      AC=new A(); mg=AC.createGain(); mg.gain.value=sndOn?1:0; mg.connect(AC.destination);
    }catch(e){AC=null;}
  }
  function tone(f,d,type,vol,delay,slideTo){
    if(!AC||!sndOn)return;
    try{
      var t0=AC.currentTime+(delay||0), o=AC.createOscillator(), g=AC.createGain();
      o.type=type||'square'; o.frequency.setValueAtTime(f,t0);
      if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t0+d);
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.exponentialRampToValueAtTime(vol||0.15,t0+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
      o.connect(g); g.connect(mg); o.start(t0); o.stop(t0+d+0.03);
    }catch(e){}
  }
  var SND={
    jump:function(){tone(300,0.16,'square',0.12,0,700);},
    coin:function(){tone(988,0.08,'square',0.13,0);tone(1319,0.2,'square',0.13,0.07);},
    hit:function(){tone(220,0.3,'sawtooth',0.2,0,60);},
    start:function(){tone(440,0.1,'square',0.12,0);tone(660,0.18,'square',0.12,0.1);},
    door:function(){[523,659,784,1047].forEach(function(f,i){tone(f,0.18,'triangle',0.18,i*0.12);});},
    win:function(){[523,659,784,1047,784,1047,1319].forEach(function(f,i){tone(f,0.22,'triangle',0.2,i*0.13);});}
  };
  var MEL=[523,0,659,0,784,659,0,523,587,0,698,0,880,698,0,587];
  function musicTick(){
    if(!AC||!sndOn||state!=='run'||paused||!wrap.classList.contains('show'))return;
    var f=MEL[musicStep%MEL.length]; musicStep++;
    if(f)tone(f,0.14,'triangle',0.05,0);
    if(musicStep%4===1)tone(131,0.35,'sine',0.07,0);
  }
  function musicStart(){ if(!musicTimer)musicTimer=setInterval(musicTick,200); }
  function musicStop(){ clearInterval(musicTimer); musicTimer=0; }
  function sndBtn(){ var b=document.getElementById('g6Snd'); if(b)b.textContent=sndOn?'🔊':'🔇'; }
  var spokenObs = null;
function speakVN(text){
  try{
    if(!window.speechSynthesis || !sndOn) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN'; u.rate = 1;
    speechSynthesis.speak(u);
  }catch(e){}
}
function stopSpeech(){ try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){} }
  function toggleSound(){
    sndOn=!sndOn;
    try{localStorage.setItem(SND_KEY,sndOn?'1':'0');}catch(e){}
    if(mg)mg.gain.value=sndOn?1:0;
    if(!sndOn) stopSpeech();
    sndBtn();
  }
  var wrap = document.getElementById('g6Wrap');
  var cv = document.getElementById('g6Cv');
  var ctx = cv.getContext('2d');
  var msg = document.getElementById('g6Msg');

  var state = 'ready', stateAt = 0, paused = false;
  var di = 0, totMoney = 0, totTime = 0, doorRes = null, rankIdx = -1;
  var y, vy, dist, t, money, base, slow, mult, obs, got, hits, flash, toast, duck, scroll;
  var ptrs = {}, kD = false, kB = false;
  var last = 0, raf = 0;
  var SX = 1, SY = 1;       // hệ số quy đổi từ tọa độ game (640×240) sang điểm ảnh thật của canvas

  function sh(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function fm(n) { return Math.round(n).toLocaleString('vi-VN') + ' ₫'; }
  function ft(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60).toFixed(1)).slice(-4).replace('.', ','); }

  function setState(s) { state = s; stateAt = Date.now(); ptrs = {}; paused = false; if (s !== 'run') stopSpeech(); }
  function togglePause() {
    if (state !== 'run') return;
    paused = !paused;
    if (paused) stopSpeech();
    ptrs = {}; kD = false; kB = false;
  }

  // ===== Độ nét: độ phân giải thật của canvas = kích thước hiển thị × mật độ điểm ảnh màn hình =====
  function fit() {
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    var s = Math.min(r.width / W, r.height / H) * dpr;
    var nw = Math.max(W, Math.round(W * s)), nh = Math.round(nw * H / W);
    if (cv.width !== nw || cv.height !== nh) { cv.width = nw; cv.height = nh; }
  }
  function onResize() { if (wrap.classList.contains('show')) { fit(); setTimeout(fit, 250); } }

  function rankLoad() { try { var a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function rankSave(m, tm) {
    var a = rankLoad(), e = { m: m, t: tm, d: Date.now() };
    a.push(e);
    a.sort(function (p, q) { return (q.m - p.m) || (p.t - q.t); });
    a = a.slice(0, 10);
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (x) {}
    return a.indexOf(e);
  }

  // Tạo 60 chướng ngại cho một cửa: 30 xanh + 30 đỏ, thứ tự ngẫu nhiên.
  // Mỗi chướng ngại hoặc nằm dưới đất (phải nhảy) hoặc treo trên cao (phải cúi).
  function build(d) {
    var g = sh(d.good), b = sh(d.bad), kinds = [], i;
    for (i = 0; i < 60; i++) kinds.push(i < 30);
    kinds = sh(kinds);
    var gi = 0, bi = 0, list = [];
    for (i = 0; i < 60; i++) {
      var blue = kinds[i];
      list.push({
        blue: blue, air: Math.random() < 0.5,
        label: blue ? g[gi++ % g.length] : b[bi++ % b.length],
        p: 400 + i * 430 + (Math.random() * 120 - 60), done: false
      });
    }
    return list;
  }

  function startDoor() {
    spokenObs = null;
    y = 0; vy = 0; dist = 0; t = 0; money = totMoney; base = totMoney; slow = 0; mult = 1; got = 0; hits = 0;
    flash = 0; toast = null; duck = false; scroll = 0;
    obs = build(DOORS[di]);
    setState('door');
    msg.textContent = HINT;
  }
  function resetAll() { di = 0; totMoney = 0; totTime = 0; rankIdx = -1; }

  function endDoor() {
    doorRes = { money: money - base, total: money, time: t, got: got, hits: hits };
    totMoney = money; totTime += t;
   SND.door(); setState('doorEnd');
  }
  function advance() {
    if (Date.now() - stateAt < 450) return;
  if (state === 'ready') { SND.start(); resetAll(); startDoor(); }
    else if (state === 'door') { setState('run'); }
    else if (state === 'doorEnd') {
      if (di + 1 < DOORS.length && di + 1 >= Math.ceil(DOORS.length / 3) && window.SixLock && !window.SixLock.isOpen()) {
        window.SixLock.ask(function () { stateAt = 0; advance(); });
        return;
      }
      di++;
      if (di >= DOORS.length) { rankIdx = rankSave(totMoney, totTime); SND.win(); setState('final'); }
      else startDoor();
    }
    else if (state === 'final') { resetAll(); startDoor(); }
  }

function jump() { if (state === 'run' && !paused && y === 0) { vy = JUMP; SND.jump(); } }
  function anyLeft() { for (var k in ptrs) if (ptrs[k].s === 'l') return true; return false; }
  function holdDuck() {
    var n = performance.now();
    for (var k in ptrs) if (ptrs[k].s === 'r' && n - ptrs[k].t0 >= HOLD_MS) return true;
    return false;
  }

  function hit(ax, ay, aw, ah, bx, by, bw, bh) { return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by; }
  function oGeom(o) { return o.air ? { y: 70, h: 102 } : { y: GY - 44, h: 44 }; }

  function update(dt) {
    duck = (kD || holdDuck()) && y === 0;
    var boosting = (anyLeft() || kB) && !duck;
    mult += (boosting ? BOOST_UP : -(duck ? BOOST_DOWN * DUCK_BRAKE : BOOST_DOWN)) * dt;
    if (mult > BOOST_MAX) mult = BOOST_MAX;
    if (mult < 1) mult = 1;
    if (slow > 0) slow -= dt;
    var sp = V0 * mult * (slow > 0 ? STUMBLE_F : 1);
    dist += sp * dt; scroll += sp * dt; t += dt;

    vy -= GRAV * dt; y += vy * dt;
    if (y <= 0) { y = 0; vy = 0; }

    if (flash > 0) flash -= dt;
    if (toast) { toast.t -= dt; if (toast.t <= 0) toast = null; }

    var ph = duck ? PD : PH;
    var pl = PX + 5, pw = PW - 10, pt = GY - y - ph + 3, pH = ph - 3;
    for (var i = 0; i < obs.length; i++) {
      var o = obs[i]; if (o.done) continue;
      var sx = PX + o.p - dist;
      if (sx > W || sx < -OW - 10) continue;
      var g = oGeom(o);
      if (hit(pl, pt, pw, pH, sx + 4, g.y + 3, OW - 8, g.h - 3)) {
        o.done = true;
      if (o.blue) { SND.coin(); money += BLUE_MONEY; got++; toast = { txt: '+' + fm(BLUE_MONEY), t: 0.9, c: '#7dffa8' }; }
      else { SND.hit(); money -= RED_MONEY; hits++; mult = 1; slow = STUMBLE_T; flash = 0.35; toast = { txt: '-' + fm(RED_MONEY), t: 0.9, c: '#ff8a80' }; }
      }
    }
    if (dist >= LEN || t >= MAXT) endDoor();
  }

  function rr(x, yy, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, yy);
    ctx.arcTo(x + w, yy, x + w, yy + h, r);
    ctx.arcTo(x + w, yy + h, x, yy + h, r);
    ctx.arcTo(x, yy + h, x, yy, r);
    ctx.arcTo(x, yy, x + w, yy, r);
    ctx.closePath();
  }

  // ===== Vẽ chữ nét nhất có thể =====
  // Chữ được vẽ trực tiếp bằng điểm ảnh thật (cỡ chữ nhân hệ số, tọa độ làm tròn về số nguyên)
  // nên các nét chữ và dấu tiếng Việt khớp đúng lưới điểm ảnh, không bị nhòe do phóng to.
  function fnt(sz) { return 'bold ' + Math.max(8, Math.round(sz * SX)) + 'px ' + FONT; }
  // Font Be Vietnam Pro có ký tự ghép (ligature) cho các cặp như "Ti", "fi", "fl": chữ i bị mất chấm và dính vào chữ T
  // nên "Tiền" trông như "TIền". Chèn ký tự không độ rộng (U+200C) vào trước i, f, l để ngắt ký tự ghép, giữ chữ i bình thường.
  function nl(s) { return String(s).replace(/([A-Za-z])(?=[ifl])/g, '$1\u200C'); }
  function T(s, x, yy, sz, col, al) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = fnt(sz);
    ctx.fillStyle = col || '#fff';
    ctx.textAlign = al || 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(nl(s), Math.round(x * SX), Math.round(yy * SY));
    ctx.restore();
  }
  function tw(s, sz) {
    ctx.save();
    ctx.font = fnt(sz);
    var w = ctx.measureText(nl(s)).width;
    ctx.restore();
    return w / SX;
  }
  function panel() { ctx.fillStyle = 'rgba(10,15,30,.8)'; ctx.fillRect(0, 0, W, H); }

  // Biểu tượng tạm dừng (hai gạch dọc xám mờ) hoặc tiếp tục (tam giác) ở giữa dòng chữ hướng dẫn
  function drawPauseIcon(play) {
    var cx = W / 2, cy = PAUSE_CY;
    ctx.fillStyle = 'rgba(190,198,215,.55)';
    if (play) {
      ctx.beginPath(); ctx.moveTo(cx - 5, cy - 8); ctx.lineTo(cx + 8, cy); ctx.lineTo(cx - 5, cy + 8); ctx.closePath(); ctx.fill();
    } else {
      rr(cx - 8, cy - 7, 5, 14, 1.5); ctx.fill();
      rr(cx + 3, cy - 7, 5, 14, 1.5); ctx.fill();
    }
  }

  function drawBanner() {
    var n = null;
    for (var i = 0; i < obs.length; i++) {
      var o = obs[i]; if (o.done) continue;
      var sx = PX + o.p - dist;
      if (sx + OW >= PX - 4 && sx < W) { n = o; break; }
    }
    if (!n) return;
    if (n !== spokenObs && state === 'run' && !paused) { spokenObs = n; speakVN(n.label); }
    var txt = (n.blue ? 'NÊN CHI: ' : 'NÊN TRÁNH: ') + n.label;
    var fs = 14;
    while (tw(txt, fs) > W - 50 && fs > 9) fs--;
    var w = tw(txt, fs) + 24;
    ctx.fillStyle = n.blue ? '#2e86de' : '#d64541';
    rr((W - w) / 2, 32, w, 24, 12); ctx.fill();
    T(txt, W / 2, 49, fs, '#fff');
  }

  function draw() {
    SX = cv.width / W; SY = cv.height / H;
    ctx.setTransform(SX, 0, 0, SY, 0, 0);
    try { ctx.textRendering = 'optimizeLegibility'; ctx.fontKerning = 'normal'; } catch (e) {}

    var d = DOORS[di] || DOORS[0];
    var gr = ctx.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#1b2a4a'); gr.addColorStop(1, '#16213e');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.12; ctx.fillStyle = d.c; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;

    ctx.strokeStyle = '#8fa3c7'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, GY + 1); ctx.lineTo(W, GY + 1); ctx.stroke();
    ctx.fillStyle = '#5b6f96';
    for (var k = -1; k < 18; k++) ctx.fillRect(k * 40 - ((scroll || 0) % 40) + 10, GY + 10, 14, 2);

    var running = (state === 'run' || state === 'doorEnd');
    if (running && obs) {
      for (var i = 0; i < obs.length; i++) {
        var o = obs[i]; if (o.done) continue;
        var sx = PX + o.p - dist;
        if (sx > W + 10 || sx < -OW - 10) continue;
        var g = oGeom(o);
        if (o.air) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx + OW / 2, 58); ctx.lineTo(sx + OW / 2, g.y); ctx.stroke(); }
        ctx.fillStyle = o.blue ? '#2e86de' : '#e74c3c';
        rr(sx, g.y, OW, g.h, 8); ctx.fill();
        // dấu + / − vẽ bằng hình khối để không phụ thuộc font
        var mx = sx + OW / 2, my = g.y + g.h / 2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(mx - 9, my - 2, 18, 4);
        if (o.blue) ctx.fillRect(mx - 2, my - 9, 4, 18);
      }
    }

     // nhân vật (hình người)
    var ph = duck ? PD : PH, fy = GY - (y || 0), cx = PX + PW / 2;
    var L = function (x1, y1, x2, y2, w, col) {
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    var SKIN = '#f1c27d', SHIRT = '#f5b301', PANTS = '#34495e', HAIR = '#4a3320';
    var hx, hy, hr;
    if (duck) {
      // cúi: ngồi thấp, người chúi về phía trước
      L(cx - 4, fy - 9, cx + 2, fy - 1, 5, PANTS);
      L(cx - 4, fy - 9, cx - 10, fy - 1, 5, PANTS);
      L(cx + 6, fy - 11, cx - 4, fy - 9, 7, SHIRT);
      L(cx + 6, fy - 11, cx + 15, fy - 8, 3.5, SKIN);
      hx = cx + 10; hy = fy - 14; hr = 5;
    } else if (y > 0) {
      // nhảy: co chân, giơ tay
      L(cx, fy - 12, cx + 9, fy - 8, 5, PANTS);
      L(cx, fy - 12, cx - 8, fy - 4, 5, PANTS);
      L(cx, fy - 24, cx - 1, fy - 12, 7, SHIRT);
      L(cx, fy - 23, cx + 9, fy - 31, 3.5, SKIN);
      L(cx, fy - 23, cx - 8, fy - 29, 3.5, SKIN);
      hx = cx + 2; hy = fy - 30; hr = 6;
    } else {
      // chạy: chân tay đung đưa
      var s = Math.sin(scroll / 12);
      L(cx, fy - 12, cx + 10 * s, fy - Math.max(0, -s) * 6, 5, PANTS);
      L(cx, fy - 12, cx - 10 * s, fy - Math.max(0, s) * 6, 5, PANTS);
      L(cx, fy - 24, cx - 1, fy - 12, 7, SHIRT);
      L(cx, fy - 22, cx - 9 * s, fy - 14, 3.5, SKIN);
      L(cx, fy - 22, cx + 9 * s, fy - 14, 3.5, SKIN);
      hx = cx + 2; hy = fy - 30; hr = 6;
    }
    // đầu và tóc
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = HAIR; ctx.beginPath(); ctx.arc(hx, hy, hr, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(hx + 3, hy + 1, 1.3, 0, Math.PI * 2); ctx.fill();

    if (flash > 0) { ctx.fillStyle = 'rgba(231,76,60,' + Math.min(0.35, flash) + ')'; ctx.fillRect(0, 0, W, H); }

    if (state === 'run') {
      drawBanner();
      // thanh tiến độ cửa
      ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(0, 0, W, 4);
      ctx.fillStyle = d.c; ctx.fillRect(0, 0, W * Math.min(1, dist / LEN), 4);
      // thông tin
      T(d.i + ' Cửa ' + (di + 1) + '/6 · ' + d.l, 12, 24, 13, '#fff', 'left');
      T('Thời gian: ' + t.toFixed(1).replace('.', ',') + ' s / ' + MAXT + ' s', W / 2, 24, 13, '#ffd54f');
      T('💰 ' + fm(money), W - 12, 24, 13, money < 0 ? '#ff8a80' : '#7dffa8', 'right');
      // thanh tốc độ
      ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(12, 216, 110, 6);
      ctx.fillStyle = '#f5b301'; ctx.fillRect(12, 216, 110 * (mult - 1) / (BOOST_MAX - 1), 6);
      T('Tốc độ', 130, 223, 11, '#c9d4ee', 'left');
      // đường chia hai nửa màn hình
      ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2, 62); ctx.lineTo(W / 2, 214); ctx.stroke(); ctx.setLineDash([]);
      // chữ hướng dẫn phía dưới + nút tạm dừng ở chính giữa
      T('Giữ: Chạy nhanh', 160, 236, 12, 'rgba(255,255,255,.5)');
      T('Chạm: Nhảy · Giữ: Cúi', 480, 236, 12, 'rgba(255,255,255,.5)');
      drawPauseIcon(false);
      if (toast) T(toast.txt, PX + 18, 92, 15, toast.c, 'left');
    }

    if (state === 'ready') {
      panel();
      T('Bước nhảy tài chính', W / 2, 52, 24);
      T('6 cửa = 6 ví · mỗi cửa 60 chướng ngại, tối đa 90 giây', W / 2, 84, 14, '#c9d4ee');
      T('Xanh: chạm vào để nhận ' + fm(BLUE_MONEY), W / 2, 110, 14, '#7dd3ff');
      T('Đỏ: tránh! chạm bị trừ ' + fm(RED_MONEY) + ' và chậm lại', W / 2, 132, 14, '#ff8a80');
      var rk = rankLoad();
      if (rk.length) T('Kỷ lục: ' + fm(rk[0].m) + ' · ' + ft(rk[0].t), W / 2, 164, 14, '#ffd54f');
      T('Chạm để bắt đầu', W / 2, 205, 16);
    }
    if (state === 'door') {
      panel();
      T('CỬA ' + (di + 1) + '/6', W / 2, 90, 30);
      T(d.i + ' ' + d.l, W / 2, 132, 26, '#ffd54f');
      T('Sẵn sàng...', W / 2, 175, 15, '#c9d4ee');
    }
    if (state === 'doorEnd' && doorRes) {
      panel();
      T('Xong cửa ' + (di + 1) + ': ' + d.i + ' ' + d.l, W / 2, 62, 22);
      T('Cửa này: ' + (doorRes.money >= 0 ? '+' : '') + fm(doorRes.money), W / 2, 98, 17, doorRes.money >= 0 ? '#7dffa8' : '#ff8a80');
      T('Tổng cộng: ' + fm(doorRes.total), W / 2, 130, 20, doorRes.total >= 0 ? '#7dffa8' : '#ff8a80');
      T('Thời gian: ' + ft(doorRes.time), W / 2, 160, 16, '#ffd54f');
      T(di + 1 >= DOORS.length ? 'Chạm để xem kết quả' : 'Chạm để qua cửa tiếp theo', W / 2, 205, 16);
    }
    if (state === 'final') {
      panel();
      T('HOÀN THÀNH 6 CỬA', W / 2, 36, 22);
      T('Tổng tiền: ' + fm(totMoney), W / 2, 66, 18, totMoney >= 0 ? '#7dffa8' : '#ff8a80');
      T('Tổng thời gian: ' + ft(totTime), W / 2, 90, 16, '#ffd54f');
      T(rankIdx >= 0 ? 'Bạn xếp hạng #' + (rankIdx + 1) + ' trên máy này' : 'Chưa vào top 10', W / 2, 114, 14);
      var rk2 = rankLoad();
      for (var r = 0; r < Math.min(3, rk2.length); r++) {
        T('#' + (r + 1) + '  ' + fm(rk2[r].m) + '  ·  ' + ft(rk2[r].t), W / 2, 142 + r * 21, 14, r === rankIdx ? '#ffd54f' : '#c9d4ee');
      }
      T('Chạm để chơi lại', W / 2, 224, 15);
    }
    if (paused) {
      panel();
      T('Tạm dừng', W / 2, 108, 30, '#ffd54f');
      T('Chạm vào màn hình để tiếp tục', W / 2, 146, 15, '#c9d4ee');
      drawPauseIcon(true);
    }
  }

  function loop(ts) {
    var dt = (ts - last) / 1000;
    if (isNaN(dt) || dt < 0) dt = 0.016;
    if (dt > 0.05) dt = 0.05;
    last = ts;
    if (state === 'run' && !paused) update(dt);
    if (state === 'door' && Date.now() - stateAt > 1700) setState('run');
    draw();
    raf = requestAnimationFrame(loop);
  }

  // ===== Điều khiển cảm ứng =====
  // Đổi tọa độ chạm sang tọa độ game (tính cả phần viền khi canvas hiển thị kiểu "contain")
  function toGame(e) {
    var r = cv.getBoundingClientRect();
    var sc = Math.min(r.width / W, r.height / H) || 1;
    var ox = (r.width - W * sc) / 2, oy = (r.height - H * sc) / 2;
    return { x: (e.clientX - r.left - ox) / sc, y: (e.clientY - r.top - oy) / sc };
  }
  function pauseHit(e) { var g = toGame(e); return Math.abs(g.x - W / 2) <= 30 && g.y >= 206; }
  function sideOf(e) { var g = toGame(e); return g.x < W / 2 ? 'l' : 'r'; }

  cv.addEventListener('pointerdown', function (e) {
    e.preventDefault();
 acInit(); if (state !== 'run') { advance(); return; }
    if (paused) { togglePause(); return; }       // đang tạm dừng: chạm bất kỳ đâu để tiếp tục
    if (pauseHit(e)) { togglePause(); return; }  // chạm hai gạch dọc ở giữa phía dưới: tạm dừng
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    ptrs[e.pointerId] = { s: sideOf(e), t0: performance.now() };
  });
  function up(e) {
    var p = ptrs[e.pointerId]; if (!p) return;
    delete ptrs[e.pointerId];
    if (state === 'run' && p.s === 'r' && e.type === 'pointerup' && performance.now() - p.t0 < HOLD_MS) jump();
  }
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);

  // ===== Bàn phím (máy tính) =====
  function kd(e) {
    var c = e.code;
    if (c === 'KeyP') { e.preventDefault(); if (!e.repeat) togglePause(); }
    else if (c === 'Space' || c === 'ArrowUp' || c === 'KeyW') {
      e.preventDefault();
      if (!e.repeat) { if (state === 'run') jump(); else advance(); }
    } else if (c === 'ArrowDown' || c === 'KeyS') { e.preventDefault(); kD = true; }
    else if (c === 'ArrowRight' || c === 'KeyD' || c === 'ShiftLeft') { e.preventDefault(); kB = true; }
    else if (c === 'Enter') { advance(); }
    else if (c === 'Escape') { close(); }
  }
  function ku(e) {
    var c = e.code;
    if (c === 'ArrowDown' || c === 'KeyS') kD = false;
    if (c === 'ArrowRight' || c === 'KeyD' || c === 'ShiftLeft') kB = false;
  }

  function lockLandscape() { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); } catch (e) {} }
  function goLandscape() {
    try {
      var el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { var p = req.call(el); if (p && p.then) p.then(lockLandscape, lockLandscape); else lockLandscape(); }
      else lockLandscape();
    } catch (e) {}
  }
  function leaveLandscape() {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
    try {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    } catch (e) {}
  }

  function open() {
    resetAll();
    obs = []; y = 0; vy = 0; dist = 0; t = 0; money = 0; mult = 1; scroll = 0; duck = false; flash = 0; toast = null;
    setState('ready');
    msg.textContent = HINT;
    wrap.classList.add('show');
    document.body.style.overflow = 'hidden';
    fit();
    // Nạp sẵn font có đủ dấu tiếng Việt để chữ trong canvas không bị đổi font giữa chừng
    try { if (document.fonts && document.fonts.load) document.fonts.load('700 16px "Be Vietnam Pro"', 'Ạ ắ ữ ỳ ₫ Đ ơ ư').catch(function () {}); } catch (e) {}
    goLandscape();
setTimeout(fit, 300); acInit(); musicStart(); sndBtn();
    document.addEventListener('keydown', kd);
    document.addEventListener('keyup', ku);
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }
  function close() {
    wrap.classList.remove('show');
    stopSpeech();
    document.body.style.overflow = '';
    leaveLandscape();
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', kd);
    document.removeEventListener('keyup', ku);
  ptrs = {}; kD = false; kB = false; paused = false; musicStop();
    state = 'ready';
  }

  // Đổi kích thước / xoay màn hình thì tính lại độ phân giải canvas cho nét
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  document.addEventListener('fullscreenchange', onResize);
  document.addEventListener('webkitfullscreenchange', onResize);
  // Chuyển sang app khác / khóa màn hình thì tự tạm dừng
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && wrap.classList.contains('show') && state === 'run' && !paused) togglePause();
  });

  wrap.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.getElementById('g6Close').addEventListener('click', close);
  document.getElementById('g6Back').addEventListener('click', close);
    document.getElementById('g6Snd').addEventListener('click', function(){ acInit(); toggleSound(); });
  window.open6PayGame = open;
})();
