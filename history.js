/* 6PAY - Game Khám phá lịch sử Việt Nam. File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
 var st=document.createElement("style");st.textContent="#vnh-root{--bg:#f7edd8;--paper:#fffaf0;--ink:#3a2817;--muted:#7a6650;--red:#b3261e;--gold:#c9922e;--line:#e6d6b0;--ok:#2e7d32;--bad:#c62828;\n  font-family:\"Segoe UI\",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg);border:2px solid var(--line);border-radius:18px;max-width:900px;margin:0 auto;overflow:hidden;position:relative;line-height:1.5}\n#vnh-root *{box-sizing:border-box}\n#vnh-root button{font:inherit;color:inherit;cursor:pointer}\n.vh-top{display:flex;align-items:center;gap:8px;padding:12px 16px;background:linear-gradient(90deg,#7a1d16,#b3261e);color:#fff;flex-wrap:wrap}\n.vh-top h1{font-size:18px;margin:0;flex:1;cursor:pointer;min-width:180px}\n.vh-chip{background:rgba(255,255,255,.18);padding:4px 10px;border-radius:99px;font-size:13px;white-space:nowrap}\n.vh-main{padding:18px;min-height:420px}\n.vh-h2{font-size:22px;margin:0 0 6px}\n.vh-sub{color:var(--muted);margin:0 0 16px}\n.vh-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\n.vh-mode{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:16px;text-align:left;transition:.15s}\n.vh-mode:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(90,50,10,.15);border-color:var(--gold)}\n.vh-mode .big{font-size:34px;display:block}\n.vh-mode b{display:block;font-size:17px;margin:4px 0 2px}\n.vh-mode small{color:var(--muted)}\n.vh-btn{background:var(--red);color:#fff!important;border:0;border-radius:10px;padding:10px 18px;font-weight:600}\n.vh-btn:hover{filter:brightness(1.1)}\n.vh-btn.alt{background:#fff;color:var(--ink)!important;border:1px solid var(--line)}\n.vh-btn.sm{padding:6px 12px;font-size:13px}\n.vh-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}\n.vh-era{display:flex;align-items:center;gap:12px;width:100%;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin-bottom:8px;text-align:left}\n.vh-era:hover{border-color:var(--gold)}\n.vh-era.lock{opacity:.5}\n.vh-ico{font-size:28px;width:40px;text-align:center}\n.vh-et{flex:1}.vh-et small{display:block;color:var(--muted)}\n.vh-st{color:var(--gold);letter-spacing:2px;font-size:18px}\n.vh-story{background:var(--paper);border-left:5px solid var(--gold);border-radius:10px;padding:14px 16px;margin:10px 0}\n.vh-q{font-size:19px;font-weight:600;margin:10px 0 14px}\n.vh-opt{display:block;width:100%;text-align:left;background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:11px 14px;margin-bottom:9px}\n.vh-opt:hover:not([disabled]){border-color:var(--gold)}\n.vh-opt.ok{background:#e6f4e7;border-color:var(--ok)}\n.vh-opt.bad{background:#fde7e7;border-color:var(--bad)}\n.vh-opt[disabled]{cursor:default}\n.vh-note{background:#fff3d6;border-radius:10px;padding:10px 14px;margin:10px 0}\n.vh-prog{height:8px;background:var(--line);border-radius:9px;overflow:hidden;margin-bottom:6px}\n.vh-prog i{display:block;height:100%;background:var(--red);transition:width .2s}\n.vh-hint{background:var(--paper);border:1px dashed var(--gold);border-radius:10px;padding:9px 12px;margin-bottom:8px}\n.vh-hint.off{opacity:.45}\n.vh-collect{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}\n.vh-cardx{background:var(--paper);border:2px solid var(--gold);border-radius:14px;padding:12px;text-align:center}\n.vh-cardx .big{font-size:40px}\n.vh-cardx small{color:var(--muted);display:block}\n.vh-cardx.off{border-style:dashed;border-color:var(--line);opacity:.55}\n.vh-ord{display:flex;align-items:center;gap:10px;width:100%;background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:9px;text-align:left}\n.vh-ord:hover:not(.done){border-color:var(--gold)}\n.vh-ord.done{background:#e6f4e7;border-color:var(--ok);cursor:default}\n.vh-ord .num{min-width:30px;height:30px;border-radius:50%;background:var(--line);display:flex;align-items:center;justify-content:center;font-weight:700}\n.vh-ord.done .num{background:var(--ok);color:#fff}\n.vh-ord .yr{margin-left:auto;color:var(--ok);font-weight:700}\n@keyframes vhshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}\n.vh-shake{animation:vhshake .3s;border-color:var(--bad)!important}\n.vh-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);background:#3a2817;color:#fff;padding:8px 16px;border-radius:99px;font-size:14px;z-index:5}\n.vh-timer{font-size:28px;font-weight:700;color:var(--red)}\n.vh-big{font-size:56px;text-align:center}\n.vh-center{text-align:center}\n@media(max-width:560px){.vh-main{padding:12px}.vh-q{font-size:17px}}\n.vh-nav{margin:-4px 0 12px}\n.vh-back{background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 14px;font-weight:700;font-size:14px;color:var(--ink)}\n.vh-back:hover{border-color:var(--gold)}\n.vh-story p{margin:0 0 10px}.vh-story p:last-child{margin-bottom:0}\n.vh-facts{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0}\n.vh-facts>b{display:block;margin-bottom:6px}\n.vh-fact{display:flex;gap:12px;padding:6px 0;border-top:1px dashed var(--line);font-size:14.5px}\n.vh-fact span:first-child{flex:none;min-width:96px;font-weight:700;color:var(--red)}\n\n\n";document.head.appendChild(st);
 var d=document.createElement("div");d.innerHTML="<div class=\"gm-ov\" id=\"vnhOv\"><div class=\"gm-bar\"><button class=\"gm-x\" onclick=\"GameOv.back('vnh')\">← Quay lại</button><button class=\"gm-x\" onclick=\"GameOv.close('vnh')\">✕ Đóng</button></div><div class=\"gm-body\"><div id=\"vnh-root\"></div></div></div>";while(d.firstChild)document.body.appendChild(d.firstChild);
})();
(function(){
'use strict';
const KEY='vnh_history_v1';
const root=document.getElementById('vnh-root');
const DEF=()=>({done:{},pts:0,best:{arena:0,order:0,who:0},unlockAll:false});
let S=DEF();
try{const x=JSON.parse(localStorage.getItem(KEY));if(x)S=Object.assign(DEF(),x)}catch(e){}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===================== DỮ LIỆU ===================== */
/* Câu hỏi: [câu hỏi, ĐÁP ÁN ĐÚNG, sai1, sai2, sai3, giải thích] — thứ tự đáp án sẽ được xáo khi chơi */
const ERAS=[
{id:'hb',ic:'🥁',n:'Thời dựng nước: Hồng Bàng – Văn Lang – Âu Lạc',y:'Đến năm 179 TCN',
 story:[
 'Từ hàng chục vạn năm trước, trên đất Việt Nam đã có người sinh sống, để lại dấu tích ở Núi Đọ, Sơn Vi, Hòa Bình, Bắc Sơn. Cùng với nghề trồng lúa nước, cư dân dần định cư thành làng, trải qua các nền văn hóa Phùng Nguyên, Đồng Đậu, Gò Mun và đạt đến đỉnh cao với văn hóa Đông Sơn rực rỡ, nổi tiếng với kỹ thuật đúc đồng và những chiếc trống đồng.',
 'Khoảng thế kỷ VII TCN, nhà nước đầu tiên của người Việt là Văn Lang ra đời, đứng đầu là các vua Hùng, đóng đô ở Phong Châu (Phú Thọ). Nước chia làm 15 bộ, đứng đầu mỗi bộ là lạc tướng; giúp việc vua có các lạc hầu. Con trai vua gọi là quan lang, con gái gọi là mị nương. Cư dân sống bằng nghề trồng lúa nước, đúc đồng, làm gốm, dệt vải, có tục thờ cúng tổ tiên và nhiều lễ hội. Các truyền thuyết như Sơn Tinh – Thủy Tinh, Thánh Gióng, bánh chưng bánh giầy phản ánh đời sống và khát vọng của người xưa.',
 'Cuối thế kỷ III TCN, Thục Phán hợp nhất người Âu Việt và Lạc Việt, lập nước Âu Lạc (năm 208 TCN), xưng An Dương Vương và dời đô về Cổ Loa. Thành Cổ Loa được xây theo hình xoắn ốc kiên cố, gắn với truyền thuyết nỏ thần do Cao Lỗ chế tạo. Năm 179 TCN, Triệu Đà dùng mưu kế chiếm được Âu Lạc, mở đầu thời kỳ Bắc thuộc kéo dài hơn một nghìn năm.'],
 facts:[['Thiên niên kỷ I TCN','Văn hóa Đông Sơn rực rỡ, nghề đúc đồng phát triển'],['Khoảng TK VII TCN','Nhà nước Văn Lang ra đời, kinh đô Phong Châu'],['208 TCN','Thục Phán lập nước Âu Lạc, đóng đô Cổ Loa'],['179 TCN','Triệu Đà chiếm Âu Lạc, mở đầu thời Bắc thuộc']],
 qs:[
 ['Nền văn hóa rực rỡ thời các vua Hùng, nổi tiếng với kỹ thuật đúc đồng và trống đồng là?','Văn hóa Đông Sơn','Văn hóa Sa Huỳnh','Văn hóa Óc Eo','Văn hóa Hòa Bình','Văn hóa Đông Sơn phát triển ở lưu vực sông Hồng, sông Mã, sông Cả.'],
 ['Nhà nước đầu tiên của người Việt có tên là gì?','Văn Lang','Âu Lạc','Vạn Xuân','Đại Cồ Việt','Văn Lang do các vua Hùng đứng đầu.'],
 ['Kinh đô của nước Văn Lang đặt ở đâu?','Phong Châu','Cổ Loa','Hoa Lư','Thăng Long','Phong Châu nay thuộc tỉnh Phú Thọ.'],
 ['Nước Văn Lang chia làm bao nhiêu bộ?','15 bộ','10 bộ','12 bộ','20 bộ','Đứng đầu mỗi bộ là lạc tướng.'],
 ['Nghề sản xuất chính của cư dân Văn Lang là gì?','Trồng lúa nước','Săn bắt, hái lượm','Chăn nuôi du mục','Buôn bán đường biển','Nghề trồng lúa nước là cơ sở của đời sống người Việt cổ.'],
 ['Truyền thuyết Sơn Tinh – Thủy Tinh phản ánh điều gì?','Cuộc đấu tranh chống lũ lụt của người Việt','Việc dời đô về Thăng Long','Cuộc kháng chiến chống quân Tống','Nghề đúc đồng thời Đông Sơn','Sơn Tinh tượng trưng cho sức mạnh chiến thắng thiên tai.'],
 ['Ai đã hợp nhất người Âu Việt và Lạc Việt, lập nước Âu Lạc?','Thục Phán (An Dương Vương)','Lạc Long Quân','Triệu Đà','Ngô Quyền','Nước Âu Lạc ra đời năm 208 TCN.'],
 ['Thành Cổ Loa có hình dáng đặc biệt nào?','Hình xoắn ốc','Hình vuông','Hình tròn một vòng','Hình chữ nhật','Cổ Loa nay thuộc Đông Anh, Hà Nội.'],
 ['Năm 179 TCN, ai đã đánh chiếm Âu Lạc?','Triệu Đà','Mã Viện','Tô Định','Hoằng Tháo','Sự kiện này mở đầu hơn một nghìn năm Bắc thuộc.']],
 card:{ic:'🥁',t:'Trống đồng Đông Sơn',d:'Biểu tượng của nền văn minh sông Hồng.'}},

{id:'bt',ic:'⚔️',n:'Một nghìn năm Bắc thuộc và đấu tranh giành độc lập',y:'179 TCN – 938',
 story:[
 'Năm 179 TCN, Triệu Đà sáp nhập Âu Lạc vào Nam Việt. Năm 111 TCN, nhà Hán chiếm Nam Việt và chia đất ta thành các quận do thái thú cai quản. Sau nhà Hán còn có các triều Ngô, Tấn, Lưu Tống, Tề, Lương, Tùy, Đường kế tiếp nhau đô hộ, kéo dài hơn một nghìn năm.',
 'Các triều đại phương Bắc bắt người Việt cống nạp sản vật quý, đánh thuế nặng và thi hành chính sách đồng hóa. Dù vậy, nhân dân ta vẫn giữ gìn tiếng nói, phong tục, tập quán và liên tục nổi dậy: Hai Bà Trưng (năm 40), Bà Triệu (năm 248), Lý Bí (năm 542), Mai Thúc Loan (đầu thế kỷ VIII), Phùng Hưng (cuối thế kỷ VIII)...',
 'Đầu thế kỷ X, khi nhà Đường suy yếu, năm 905 Khúc Thừa Dụ giành quyền tự chủ; họ Khúc rồi Dương Đình Nghệ tiếp nối xây dựng nền tự chủ. Năm 938, Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng bằng bãi cọc ngầm, chấm dứt hoàn toàn thời Bắc thuộc.'],
 facts:[['179 TCN','Triệu Đà chiếm Âu Lạc'],['40','Hai Bà Trưng khởi nghĩa ở Mê Linh'],['248','Bà Triệu khởi nghĩa'],['544','Lý Bí lập nước Vạn Xuân'],['905','Khúc Thừa Dụ giành quyền tự chủ'],['938','Ngô Quyền thắng trận Bạch Đằng']],
 qs:[
 ['Cuộc khởi nghĩa Hai Bà Trưng nổ ra vào năm nào?','Năm 40','Năm 248','Năm 544','Năm 938','Khởi nghĩa bắt đầu ở Mê Linh, nhanh chóng giành lại 65 thành.'],
 ['Hai Bà Trưng khởi nghĩa chống lại viên thái thú tàn bạo nào?','Tô Định','Mã Viện','Triệu Đà','Sĩ Nhiếp','Tô Định là thái thú nhà Hán ở Giao Chỉ.'],
 ['Bà Triệu (Triệu Thị Trinh) khởi nghĩa vào năm nào?','Năm 248','Năm 40','Năm 544','Năm 905','Bà khởi nghĩa ở vùng núi Nưa (Thanh Hóa) chống ách đô hộ nhà Ngô.'],
 ['Năm 544, Lý Bí lập nước có tên là gì?','Vạn Xuân','Đại Cồ Việt','Đại Việt','Âu Lạc','Lý Bí xưng là Lý Nam Đế.'],
 ['Ai được nhân dân suy tôn là Bố Cái Đại Vương?','Phùng Hưng','Mai Thúc Loan','Khúc Thừa Dụ','Dương Đình Nghệ','Phùng Hưng khởi nghĩa ở vùng Đường Lâm vào cuối thế kỷ VIII.'],
 ['Mai Thúc Loan nổi dậy chống nhà Đường, được nhân dân gọi là gì?','Mai Hắc Đế','Bố Cái Đại Vương','Lý Nam Đế','Triệu Việt Vương','Ông lập căn cứ ở Hoan Châu (Nghệ An – Hà Tĩnh ngày nay).'],
 ['Việc làm của Khúc Thừa Dụ năm 905 có ý nghĩa gì?','Giành quyền tự chủ, đặt nền móng cho độc lập','Lên ngôi hoàng đế, lập triều đại mới','Đánh thắng quân Nam Hán trên sông Bạch Đằng','Dời đô về Thăng Long','Đây là bước mở đầu cho nền tự chủ của người Việt.'],
 ['Năm 938, Ngô Quyền đánh bại quân Nam Hán trên con sông nào?','Sông Bạch Đằng','Sông Như Nguyệt','Sông Gianh','Sông Mã','Ông cho đóng cọc nhọn ngầm, lợi dụng thủy triều để tiêu diệt thuyền giặc.'],
 ['Dù bị đô hộ hơn một nghìn năm, điều quan trọng nhất người Việt giữ được là gì?','Tiếng nói, phong tục và ý chí độc lập','Chữ viết và luật pháp riêng','Quân đội thường trực','Triều đình riêng','Nhờ vậy dân tộc ta không bị đồng hóa và giành lại được độc lập.']],
 card:{ic:'🐘',t:'Hai Bà Trưng',d:'Hai nữ anh hùng đầu tiên dựng cờ khởi nghĩa.'}},

{id:'dl',ic:'🏯',n:'Ngô – Đinh – Tiền Lê: Xây nền độc lập',y:'939 – 1009',
 story:[
 'Sau chiến thắng Bạch Đằng, năm 939 Ngô Quyền xưng vương, đóng đô ở Cổ Loa, xây dựng chính quyền riêng. Nhưng ông mất sớm (năm 944), triều đình lục đục, đất nước rơi vào loạn 12 sứ quân (944 – 968), các thủ lĩnh cát cứ từng vùng.',
 'Đinh Bộ Lĩnh, người Hoa Lư (Ninh Bình), dẹp được loạn 12 sứ quân, thống nhất giang sơn. Năm 968, ông lên ngôi hoàng đế (Đinh Tiên Hoàng), đặt quốc hiệu Đại Cồ Việt, đóng đô ở Hoa Lư. Nhà nước có quốc hiệu và kinh đô riêng, khẳng định vị thế ngang hàng với phương Bắc.',
 'Năm 979, Đinh Tiên Hoàng bị ám hại, con nhỏ lên nối ngôi trong lúc quân Tống lăm le xâm lược. Triều đình suy tôn Thập đạo tướng quân Lê Hoàn lên ngôi (980), lập nhà Tiền Lê. Năm 981, ông chỉ huy quân dân đánh bại quân Tống cả trên bộ lẫn trên sông. Năm 1005 Lê Hoàn mất, triều đình suy yếu, đến năm 1009 Lý Công Uẩn lên ngôi, mở ra thời kỳ nhà Lý.'],
 facts:[['939','Ngô Quyền xưng vương, đóng đô Cổ Loa'],['944 – 968','Loạn 12 sứ quân'],['968','Đinh Bộ Lĩnh lên ngôi, quốc hiệu Đại Cồ Việt, đóng đô Hoa Lư'],['980 – 981','Lê Hoàn lên ngôi và đánh thắng quân Tống'],['1009','Lý Công Uẩn lên ngôi, kết thúc nhà Tiền Lê']],
 qs:[
 ['Năm 939, Ngô Quyền xưng vương và đóng đô ở đâu?','Cổ Loa','Hoa Lư','Thăng Long','Phong Châu','Cổ Loa từng là kinh đô của An Dương Vương.'],
 ['Sau khi Ngô Quyền mất, đất nước rơi vào tình trạng nào?','Loạn 12 sứ quân','Chiến tranh Nam – Bắc triều','Chiến tranh Trịnh – Nguyễn','Thời Bắc thuộc lần thứ tư','Các sứ quân cát cứ từng vùng, đất nước bị chia rẽ.'],
 ['Ai là người dẹp loạn 12 sứ quân, thống nhất đất nước?','Đinh Bộ Lĩnh','Lê Hoàn','Lý Công Uẩn','Khúc Thừa Dụ','Ông còn được gọi là Vạn Thắng Vương.'],
 ['Năm 968, Đinh Bộ Lĩnh lên ngôi hoàng đế, xưng là gì?','Đinh Tiên Hoàng','Đinh Phế Đế','Lê Đại Hành','Lý Thái Tổ','Ông đặt niên hiệu là Thái Bình.'],
 ['Quốc hiệu của nước ta thời nhà Đinh là gì?','Đại Cồ Việt','Vạn Xuân','Đại Ngu','Đại Việt','Đại Cồ Việt có nghĩa là nước Việt lớn.'],
 ['Kinh đô Hoa Lư nay thuộc tỉnh nào?','Ninh Bình','Thanh Hóa','Phú Thọ','Nam Định','Hoa Lư có núi non hiểm trở, dễ phòng thủ.'],
 ['Lê Hoàn lên ngôi năm 980 đã lập ra triều đại nào?','Nhà Tiền Lê','Nhà Hậu Lê','Nhà Lý','Nhà Trần','Ông còn được gọi là Lê Đại Hành.'],
 ['Cuộc kháng chiến chống Tống lần thứ nhất do Lê Hoàn chỉ huy diễn ra vào năm nào?','Năm 981','Năm 1075','Năm 938','Năm 1288','Quân Tống bị đánh bại ở Bạch Đằng và Chi Lăng.'],
 ['Vì sao Thập đạo tướng quân Lê Hoàn được triều đình suy tôn lên ngôi?','Có tài, có công và cần người chỉ huy chống Tống khi vua còn nhỏ','Là con trai của Ngô Quyền','Được nhà Tống phong làm vua','Đã đánh thắng quân Mông Cổ','Tình thế đất nước lúc đó đòi hỏi một vị vua đủ sức lãnh đạo kháng chiến.']],
 card:{ic:'⛰️',t:'Cố đô Hoa Lư',d:'Kinh đô đầu tiên của nhà nước phong kiến độc lập.'}},

{id:'ly',ic:'🐉',n:'Nhà Lý: Thăng Long ra đời',y:'1009 – 1225',
 story:[
 'Năm 1009, Lý Công Uẩn được triều đình suy tôn lên ngôi, mở đầu nhà Lý. Năm 1010, ông ban Chiếu dời đô, chuyển kinh đô từ Hoa Lư ra thành Đại La và đổi tên là Thăng Long (rồng bay lên). Từ đó Thăng Long trở thành trung tâm chính trị, văn hóa của đất nước suốt nhiều thế kỷ.',
 'Nhà Lý xây dựng nhà nước quy củ: năm 1042 ban Hình thư, bộ luật thành văn đầu tiên; năm 1054 đặt quốc hiệu Đại Việt; năm 1070 lập Văn Miếu; năm 1075 mở khoa thi đầu tiên; năm 1076 lập Quốc Tử Giám. Đạo Phật rất thịnh, nhiều chùa tháp được dựng như chùa Một Cột (1049). Nông nghiệp, thủ công nghiệp, thương nghiệp đều phát triển.',
 'Giữa thế kỷ XI, nhà Tống chuẩn bị xâm lược. Lý Thường Kiệt chủ động đem quân đánh vào Ung Châu, Khâm Châu, Liêm Châu (1075) để phá thế chuẩn bị của giặc, rồi lui về xây phòng tuyến trên sông Như Nguyệt. Năm 1077, quân dân ta giành thắng lợi, vang lên bài thơ Nam quốc sơn hà. Năm 1225, Lý Chiêu Hoàng nhường ngôi cho chồng là Trần Cảnh, nhà Lý kết thúc.'],
 facts:[['1009','Lý Công Uẩn lên ngôi, lập nhà Lý'],['1010','Chiếu dời đô, kinh đô Thăng Long'],['1042','Ban hành Hình thư'],['1054','Quốc hiệu Đại Việt'],['1070','Xây dựng Văn Miếu'],['1075 – 1077','Kháng chiến chống Tống do Lý Thường Kiệt chỉ huy'],['1225','Nhà Lý kết thúc, nhà Trần thành lập']],
 qs:[
 ['Chiếu dời đô của Lý Công Uẩn được ban vào năm nào?','Năm 1010','Năm 1009','Năm 1070','Năm 1225','Kinh đô được chuyển từ Hoa Lư ra Đại La.'],
 ['Tên gọi Thăng Long có nghĩa là gì?','Rồng bay lên','Rồng trở về','Núi cao sông dài','Đất lành chim đậu','Theo truyền thuyết, vua thấy rồng vàng bay lên khi thuyền cập bến Đại La.'],
 ['Quốc hiệu Đại Việt được đặt vào năm 1054 dưới thời vua nào?','Lý Thánh Tông','Lý Thái Tổ','Trần Nhân Tông','Lê Thánh Tông','Quốc hiệu này được sử dụng trong nhiều thế kỷ.'],
 ['Bộ luật thành văn đầu tiên của nước ta, ban hành năm 1042, có tên là gì?','Hình thư','Quốc triều hình luật','Hoàng Việt luật lệ','Hồng Đức thiện chính thư','Hình thư được ban hành dưới thời Lý Thái Tông.'],
 ['Văn Miếu ở Thăng Long được xây dựng vào năm nào?','Năm 1070','Năm 1010','Năm 1075','Năm 1428','Văn Miếu thờ Khổng Tử và các bậc hiền triết Nho học.'],
 ['Chùa Một Cột được xây dựng dưới thời vua nào?','Lý Thái Tông','Trần Nhân Tông','Lê Thánh Tông','Quang Trung','Chùa được xây năm 1049 với hình dáng như một đóa sen nở trên mặt nước.'],
 ['Năm 1075, Lý Thường Kiệt chủ động đem quân đánh sang đâu?','Ung Châu, Khâm Châu, Liêm Châu của nhà Tống','Kinh đô của nhà Tống','Chăm Pa','Thành Đại La','Mục đích là phá thế chuẩn bị xâm lược của nhà Tống.'],
 ['Lý Thường Kiệt xây dựng phòng tuyến chặn giặc trên con sông nào?','Sông Như Nguyệt','Sông Bạch Đằng','Sông Gianh','Sông Hương','Phòng tuyến Như Nguyệt nằm trên sông Cầu.'],
 ['Bài thơ Nam quốc sơn hà được xem là gì?','Bản tuyên ngôn độc lập đầu tiên','Bài hịch tướng sĩ','Bộ luật của nhà Lý','Bài văn tế anh hùng','Bài thơ khẳng định chủ quyền của nước Nam.'],
 ['Năm 1225, Lý Chiêu Hoàng nhường ngôi cho ai?','Trần Cảnh','Trần Thủ Độ','Lê Hoàn','Hồ Quý Ly','Trần Cảnh lên ngôi, tức Trần Thái Tông, mở đầu nhà Trần.']],
 card:{ic:'🏙️',t:'Thăng Long',d:'Kinh đô nghìn năm của đất nước.'}},

{id:'tr',ic:'🛡️',n:'Nhà Trần: Ba lần đánh thắng quân Mông – Nguyên',y:'1225 – 1400',
 story:[
 'Năm 1225, Trần Cảnh lên ngôi (Trần Thái Tông), mở đầu nhà Trần với sự hỗ trợ của Trần Thủ Độ. Nhà Trần chú trọng đắp đê, khai hoang, phát triển giáo dục, khoa cử và sử học: Lê Văn Hưu biên soạn Đại Việt sử ký (1272). Chữ Nôm ngày càng phổ biến.',
 'Thế kỷ XIII, đế quốc Mông Cổ, về sau là nhà Nguyên, mạnh nhất thế giới, ba lần xâm lược Đại Việt (1258, 1285, 1287 – 1288). Vua tôi nhà Trần đồng lòng: Hội nghị Bình Than (1282), Hội nghị Diên Hồng (1284) hỏi ý kiến các bô lão; Trần Quốc Tuấn (Hưng Đạo Vương) viết Hịch tướng sĩ và Binh thư yếu lược. Chiến lược “vườn không nhà trống” kết hợp rút lui chiến lược rồi phản công đã làm giặc kiệt sức.',
 'Các chiến thắng lẫy lừng: Đông Bộ Đầu (1258); Hàm Tử, Chương Dương, Tây Kết (1285); Bạch Đằng (1288) bắt sống Ô Mã Nhi. Sau chiến thắng, Phật giáo thiền phái Trúc Lâm do Trần Nhân Tông sáng lập phát triển mạnh. Cuối thế kỷ XIV nhà Trần suy yếu; năm 1400, Hồ Quý Ly lập nhà Hồ.'],
 facts:[['1225','Nhà Trần thành lập'],['1258','Kháng chiến chống Mông Cổ lần thứ nhất (Đông Bộ Đầu)'],['1284','Hội nghị Diên Hồng'],['1285','Chiến thắng Hàm Tử, Chương Dương, Tây Kết'],['1287 – 1288','Chiến thắng Bạch Đằng'],['1400','Hồ Quý Ly lập nhà Hồ']],
 qs:[
 ['Nhà Trần thành lập năm 1225 sau khi ai lên ngôi?','Trần Cảnh','Trần Thủ Độ','Trần Hưng Đạo','Trần Quốc Toản','Trần Cảnh lên ngôi tức Trần Thái Tông.'],
 ['Ai biên soạn bộ Đại Việt sử ký, bộ quốc sử đầu tiên của nước ta?','Lê Văn Hưu','Ngô Sĩ Liên','Nguyễn Trãi','Phan Huy Chú','Bộ sử được hoàn thành năm 1272.'],
 ['Quân dân nhà Trần đã đánh thắng quân Mông – Nguyên mấy lần?','3 lần','2 lần','4 lần','5 lần','Các năm 1258, 1285 và 1287 – 1288.'],
 ['Hội nghị Diên Hồng (1284) được triệu tập để làm gì?','Hỏi ý kiến các bô lão nên đánh hay hòa','Bàn việc dời đô','Phong chức cho các tướng','Ban hành luật mới','Các bô lão đồng thanh hô “Đánh!”.'],
 ['Ai là tác giả của Hịch tướng sĩ?','Trần Quốc Tuấn','Lý Thường Kiệt','Nguyễn Trãi','Trần Nhân Tông','Hịch khích lệ tinh thần chiến đấu của quân sĩ.'],
 ['Vị tướng trẻ nào đã bóp nát quả cam khi không được dự Hội nghị Bình Than?','Trần Quốc Toản','Trần Khánh Dư','Phạm Ngũ Lão','Yết Kiêu','Ông có lá cờ thêu sáu chữ “Phá cường địch, báo hoàng ân”.'],
 ['Chiến lược nổi tiếng của quân dân nhà Trần khi giặc mạnh là gì?','Vườn không nhà trống, rút lui chiến lược rồi phản công','Cố thủ trong thành','Cầu hòa ngay từ đầu','Liên minh với nhà Tống','Cách đánh này làm giặc thiếu lương thực và mỏi mệt.'],
 ['Năm 1285, quân dân nhà Trần giành thắng lợi ở những địa danh nào?','Hàm Tử, Chương Dương, Tây Kết','Rạch Gầm, Xoài Mút','Chi Lăng, Xương Giang','Ngọc Hồi, Đống Đa','Các chiến thắng này mở đường giải phóng Thăng Long.'],
 ['Trong trận Bạch Đằng năm 1288, quân ta đã bắt sống tướng nào của quân Nguyên?','Ô Mã Nhi','Thoát Hoan','Toa Đô','Liễu Thăng','Trận đánh dùng bãi cọc ngầm và lợi dụng thủy triều.'],
 ['Ai là người sáng lập thiền phái Trúc Lâm?','Trần Nhân Tông','Trần Thái Tông','Lý Công Uẩn','Lê Thánh Tông','Ông xuất gia và lập thiền phái Trúc Lâm trên núi Yên Tử.']],
 card:{ic:'🌊',t:'Hưng Đạo Vương',d:'Vị tướng ba lần đánh thắng quân Mông – Nguyên.'}},

{id:'ho',ic:'🗡️',n:'Nhà Hồ, thuộc Minh và Khởi nghĩa Lam Sơn',y:'1400 – 1427',
 story:[
 'Cuối thế kỷ XIV, nhà Trần suy yếu. Hồ Quý Ly, một đại thần có quyền lực, thực hiện nhiều cải cách: hạn điền, hạn nô, phát hành tiền giấy (Thông bảo hội sao), đề cao chữ Nôm, đổi mới thi cử. Năm 1400, ông lên ngôi lập nhà Hồ, đặt quốc hiệu Đại Ngu, dời đô vào Tây Đô (Thanh Hóa) và xây Thành Nhà Hồ bằng những khối đá lớn.',
 'Năm 1406, nhà Minh mượn cớ “phù Trần diệt Hồ” đem quân xâm lược. Do chưa đoàn kết được lòng dân, cuộc kháng chiến của nhà Hồ thất bại (1407). Nhà Minh đặt ách đô hộ tàn bạo, bóc lột nặng nề, đốt sách vở, bắt thợ giỏi sang Trung Quốc, khiến nhiều cuộc khởi nghĩa nổ ra.',
 'Năm 1418, Lê Lợi dựng cờ khởi nghĩa ở Lam Sơn (Thanh Hóa), có Nguyễn Trãi làm quân sư. Sau những năm gian khổ, nghĩa quân chuyển vào Nghệ An (1424), rồi tiến ra Bắc, thắng trận Tốt Động – Chúc Động (1426), Chi Lăng – Xương Giang (1427) tiêu diệt viện binh do Liễu Thăng chỉ huy. Cuối năm 1427, Vương Thông xin hòa, rút quân về nước. Năm 1428, Lê Lợi lên ngôi, Nguyễn Trãi soạn Bình Ngô đại cáo.'],
 facts:[['1400','Hồ Quý Ly lập nhà Hồ, quốc hiệu Đại Ngu'],['1407','Nhà Minh chiếm nước ta, bắt đầu thời thuộc Minh'],['1418','Lê Lợi dựng cờ khởi nghĩa ở Lam Sơn'],['1426','Chiến thắng Tốt Động – Chúc Động'],['1427','Chiến thắng Chi Lăng – Xương Giang, Hội thề Đông Quan'],['1428','Lê Lợi lên ngôi, Bình Ngô đại cáo ra đời']],
 qs:[
 ['Quốc hiệu của nước ta thời nhà Hồ là gì?','Đại Ngu','Đại Cồ Việt','Đại Việt','Vạn Xuân','Đại Ngu có nghĩa là sự yên vui lớn.'],
 ['Thành Nhà Hồ (Tây Đô), Di sản thế giới của UNESCO, thuộc tỉnh nào?','Thanh Hóa','Nghệ An','Ninh Bình','Thừa Thiên Huế','Thành được xây bằng những khối đá lớn rất kiên cố.'],
 ['Một chính sách cải cách của Hồ Quý Ly là gì?','Phát hành tiền giấy','Cho phép mua bán nô tì tự do','Bãi bỏ khoa cử','Cấm dùng chữ Nôm','Tiền giấy được gọi là Thông bảo hội sao.'],
 ['Nhà Minh xâm lược nước ta với danh nghĩa nào?','Phù Trần diệt Hồ','Giúp nhà Lý phục quốc','Cứu giúp dân nghèo','Mở đường thông thương','Cuộc kháng chiến của nhà Hồ thất bại năm 1407.'],
 ['Lê Lợi dựng cờ khởi nghĩa chống quân Minh ở đâu?','Lam Sơn','Mê Linh','Tây Sơn','Hoa Lư','Khởi nghĩa Lam Sơn kéo dài 10 năm (1418 – 1427).'],
 ['Nguyễn Trãi dâng cho Lê Lợi bản kế sách nào?','Bình Ngô sách','Hịch tướng sĩ','Chiếu dời đô','Binh thư yếu lược','Nguyễn Trãi trở thành quân sư số một của nghĩa quân.'],
 ['Trận Tốt Động – Chúc Động năm 1426 có ý nghĩa gì?','Tiêu diệt phần lớn quân chủ lực của Minh, tạo bước ngoặt','Giải phóng hoàn toàn đất nước','Đánh tan viện binh Liễu Thăng','Dời đô ra Thăng Long','Sau trận này, quân Minh bị dồn vào cố thủ trong thành Đông Quan.'],
 ['Viện binh của quân Minh do ai chỉ huy bị tiêu diệt ở trận Chi Lăng – Xương Giang (1427)?','Liễu Thăng','Vương Thông','Mã Viện','Tôn Sĩ Nghị','Liễu Thăng bị giết ở ải Chi Lăng.'],
 ['Cuộc kháng chiến chống Minh kết thúc bằng sự kiện nào?','Hội thề Đông Quan, Vương Thông rút quân','Trận Bạch Đằng','Hội nghị Diên Hồng','Trận Rạch Gầm – Xoài Mút','Lê Lợi cho quân Minh về nước an toàn để tránh đổ máu thêm.'],
 ['Sau chiến thắng, Lê Lợi lên ngôi hoàng đế với niên hiệu gì?','Thuận Thiên','Hồng Đức','Quang Trung','Gia Long','Lê Lợi lên ngôi năm 1428, đặt quốc hiệu Đại Việt.'],
 ['Truyền thuyết nào gắn với Lê Lợi và tên gọi Hồ Hoàn Kiếm?','Trả gươm thần cho Rùa Vàng','Đánh thắng thủy quái','Cưỡi voi ra trận','Giấc mơ thấy rồng','Hồ Hoàn Kiếm còn gọi là Hồ Gươm, nằm giữa Hà Nội.']],
 card:{ic:'📜',t:'Bình Ngô đại cáo',d:'Áng văn khẳng định nền độc lập của dân tộc.'}},

{id:'le',ic:'📖',n:'Hậu Lê sơ: Thời Hồng Đức thịnh trị',y:'1428 – 1527',
 story:[
 'Năm 1428, Lê Lợi lên ngôi, lập nhà Hậu Lê (giai đoạn đầu gọi là Lê sơ), quốc hiệu Đại Việt, đóng đô Đông Kinh (Thăng Long). Nhà Lê ra sức khôi phục kinh tế, chia ruộng đất cho nông dân, củng cố quân đội theo chính sách “ngụ binh ư nông”. Năm 1442, vụ án Lệ Chi Viên khiến Nguyễn Trãi và gia đình bị hại oan.',
 'Thời vua Lê Thánh Tông (1460 – 1497), niên hiệu Quang Thuận và Hồng Đức, đất nước đạt thời kỳ cực thịnh. Nhà vua cải cách hành chính theo hướng tập trung quyền lực, ban hành Quốc triều hình luật (Luật Hồng Đức), vẽ bản đồ Hồng Đức, mở rộng giáo dục khoa cử và cho dựng bia tiến sĩ ở Văn Miếu. Sử học phát triển với Đại Việt sử ký toàn thư của Ngô Sĩ Liên.',
 'Năm 1471, Lê Thánh Tông đem quân đánh Chăm Pa, mở rộng lãnh thổ, lập thừa tuyên Quảng Nam. Sau khi ông mất, triều đình suy yếu, các thế lực quan lại, ngoại thích tranh giành quyền lực; năm 1527, Mạc Đăng Dung cướp ngôi lập nhà Mạc, kết thúc giai đoạn Lê sơ.'],
 facts:[['1428','Lê Lợi lên ngôi, lập nhà Hậu Lê'],['1442','Vụ án Lệ Chi Viên'],['1460 – 1497','Lê Thánh Tông trị vì, thời Hồng Đức thịnh trị'],['1471','Đánh Chăm Pa, lập thừa tuyên Quảng Nam'],['1479','Ngô Sĩ Liên hoàn thành Đại Việt sử ký toàn thư'],['1527','Mạc Đăng Dung cướp ngôi nhà Lê']],
 qs:[
 ['Vị vua nào đưa nhà Hậu Lê đến thời cực thịnh?','Lê Thánh Tông','Lê Thái Tổ','Lê Nhân Tông','Lê Chiêu Thống','Thời kỳ này gọi là thời Hồng Đức.'],
 ['Kinh đô Thăng Long thời Lê sơ được gọi là gì?','Đông Kinh','Tây Đô','Phú Xuân','Hoa Lư','Tên gọi này gắn với hồ Hoàn Kiếm và khu vực Hà Nội ngày nay.'],
 ['Bộ luật nổi tiếng của nhà Hậu Lê là gì?','Quốc triều hình luật (Luật Hồng Đức)','Hình thư','Hoàng Việt luật lệ','Luật Gia Long','Đây là bộ luật tương đối hoàn chỉnh của chế độ phong kiến Việt Nam.'],
 ['Điểm tiến bộ nổi bật của Luật Hồng Đức là gì?','Bảo vệ một số quyền lợi của phụ nữ','Cho phép mua bán nô lệ tự do','Bãi bỏ mọi hình phạt','Cấm việc học hành thi cử','Ví dụ: con gái cũng được hưởng quyền thừa kế tài sản.'],
 ['Năm 1471, Lê Thánh Tông thực hiện việc gì?','Đánh Chăm Pa, lập thừa tuyên Quảng Nam','Dời đô vào Huế','Đánh thắng quân Thanh','Dẹp loạn 12 sứ quân','Lãnh thổ nước ta được mở rộng về phía nam.'],
 ['Bia tiến sĩ ở Văn Miếu – Quốc Tử Giám được UNESCO công nhận là gì?','Di sản tư liệu thế giới','Di sản thiên nhiên thế giới','Kiệt tác truyền khẩu','Công viên địa chất toàn cầu','Bia tiến sĩ khắc tên những người đỗ đạt, thể hiện truyền thống hiếu học.'],
 ['Vụ án Lệ Chi Viên năm 1442 liên quan đến danh nhân nào?','Nguyễn Trãi','Trần Hưng Đạo','Lý Thường Kiệt','Nguyễn Du','Nguyễn Trãi sau này được minh oan và UNESCO tôn vinh là Danh nhân văn hóa thế giới.'],
 ['Ai là tác giả của Đại Việt sử ký toàn thư?','Ngô Sĩ Liên','Lê Văn Hưu','Phan Huy Chú','Lê Quý Đôn','Bộ sử được biên soạn dưới thời Lê Thánh Tông.'],
 ['Năm 1527, ai đã cướp ngôi nhà Lê, lập nhà Mạc?','Mạc Đăng Dung','Nguyễn Kim','Trịnh Kiểm','Hồ Quý Ly','Sự kiện này mở đầu thời kỳ chia cắt, phân tranh kéo dài.']],
 card:{ic:'📖',t:'Luật Hồng Đức',d:'Bộ luật tiêu biểu của thời Lê sơ thịnh trị.'}},

{id:'tn',ic:'🗺️',n:'Mạc, Lê Trung hưng và Trịnh – Nguyễn phân tranh',y:'1527 – 1771',
 story:[
 'Năm 1527, Mạc Đăng Dung lập nhà Mạc. Một bộ phận quan lại nhà Lê không chịu thần phục: Nguyễn Kim phò Lê Trang Tông lập triều đình ở Thanh Hóa (1533), mở đầu cuộc chiến tranh Nam – Bắc triều kéo dài nhiều chục năm. Năm 1592, Trịnh Tùng chiếm Thăng Long; nhà Mạc lui lên Cao Bằng, tồn tại đến năm 1677.',
 'Từ đó vua Lê chỉ còn là hình thức, quyền hành thuộc chúa Trịnh ở Đàng Ngoài. Năm 1558, Nguyễn Hoàng xin vào trấn thủ Thuận Hóa, xây dựng thế lực ở Đàng Trong. Hai họ Trịnh – Nguyễn đánh nhau suốt 1627 – 1672 với 7 lần giao tranh lớn, lấy sông Gianh (Quảng Bình) làm giới tuyến rồi phải ngừng chiến.',
 'Ở Đàng Trong, chúa Nguyễn đẩy mạnh khai hoang, mở rộng lãnh thổ về phía nam; năm 1698, Nguyễn Hữu Cảnh lập phủ Gia Định. Thương nghiệp phát triển với Phố Hiến, Hội An; chữ Quốc ngữ ra đời nhờ các giáo sĩ phương Tây, tiêu biểu là Alexandre de Rhodes. Cuối thế kỷ XVIII, đời sống nông dân khổ cực, nhiều cuộc khởi nghĩa nổ ra, chuẩn bị cho phong trào Tây Sơn.'],
 facts:[['1527','Mạc Đăng Dung lập nhà Mạc'],['1533','Nguyễn Kim lập triều Lê Trung hưng ở Thanh Hóa'],['1558','Nguyễn Hoàng vào trấn thủ Thuận Hóa'],['1592','Trịnh Tùng chiếm Thăng Long, nhà Mạc lui lên Cao Bằng'],['1627 – 1672','Chiến tranh Trịnh – Nguyễn'],['1651','Từ điển Việt – Bồ – La của Alexandre de Rhodes'],['1698','Nguyễn Hữu Cảnh lập phủ Gia Định']],
 qs:[
 ['Nhà Mạc do ai lập ra năm 1527?','Mạc Đăng Dung','Nguyễn Kim','Trịnh Tùng','Lê Lợi','Mạc Đăng Dung cướp ngôi nhà Lê.'],
 ['Chiến tranh Nam – Bắc triều diễn ra giữa nhà Mạc và thế lực nào?','Nhà Lê Trung hưng do họ Nguyễn, họ Trịnh phò tá','Nhà Trần','Nhà Tây Sơn','Nhà Hồ','Cuộc chiến kéo dài nhiều chục năm.'],
 ['Sau khi thất bại, nhà Mạc lui lên căn cứ nào?','Cao Bằng','Thanh Hóa','Gia Định','Quảng Nam','Nhà Mạc còn tồn tại ở đây đến năm 1677.'],
 ['Năm 1558, Nguyễn Hoàng xin vào trấn thủ vùng đất nào?','Thuận Hóa','Gia Định','Cao Bằng','Hải Dương','Đây là bước đầu xây dựng cơ nghiệp của chúa Nguyễn ở Đàng Trong.'],
 ['Giới tuyến chia cắt Đàng Ngoài và Đàng Trong là con sông nào?','Sông Gianh','Sông Bến Hải','Sông Hồng','Sông Đồng Nai','Sông Gianh thuộc tỉnh Quảng Bình.'],
 ['Đàng Ngoài do dòng họ nào nắm quyền cai quản?','Chúa Trịnh','Chúa Nguyễn','Nhà Mạc','Nhà Tây Sơn','Đàng Trong do chúa Nguyễn cai quản.'],
 ['Chiến tranh Trịnh – Nguyễn (1627 – 1672) có bao nhiêu lần giao tranh lớn?','7 lần','3 lần','5 lần','10 lần','Hai bên không phân thắng bại, cuối cùng ngừng chiến lấy sông Gianh làm ranh giới.'],
 ['Thương cảng nào ở Đàng Ngoài nổi tiếng với câu “Thứ nhất Kinh Kỳ, thứ nhì …”?','Phố Hiến','Hội An','Cửa Hàn','Hà Tiên','Phố Hiến nay thuộc tỉnh Hưng Yên.'],
 ['Phủ Gia Định được lập năm 1698 bởi ai?','Nguyễn Hữu Cảnh','Nguyễn Hoàng','Trịnh Tùng','Mạc Cảnh Huống','Đây là bước quan trọng trong công cuộc mở đất phương Nam.'],
 ['Giáo sĩ nào có công lớn trong việc hoàn thiện chữ Quốc ngữ, xuất bản từ điển Việt – Bồ – La năm 1651?','Alexandre de Rhodes','Pigneau de Béhaine','Francis Garnier','Henri Rivière','Chữ Quốc ngữ dùng chữ cái Latinh để ghi âm tiếng Việt.']],
 card:{ic:'🗺️',t:'Phủ Gia Định',d:'Dấu mốc mở cõi về phương Nam.'}},

{id:'ts',ic:'🔥',n:'Phong trào Tây Sơn',y:'1771 – 1802',
 story:[
 'Giữa thế kỷ XVIII, chính quyền chúa Nguyễn ở Đàng Trong suy yếu, quyền thần Trương Phúc Loan lộng quyền, nông dân khổ sở. Năm 1771, ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ dựng cờ khởi nghĩa ở ấp Tây Sơn (Bình Định). Đến năm 1777, nghĩa quân lật đổ chúa Nguyễn ở Đàng Trong; năm 1778, Nguyễn Nhạc xưng hoàng đế, niên hiệu Thái Đức.',
 'Năm 1785, Nguyễn Huệ đại phá quân Xiêm trong trận Rạch Gầm – Xoài Mút trên sông Tiền. Năm 1786, Tây Sơn tiến ra Bắc, lật đổ chính quyền chúa Trịnh. Khi quân Thanh kéo sang xâm lược, ngày 25 tháng 12 năm 1788, Nguyễn Huệ lên ngôi hoàng đế, niên hiệu Quang Trung, rồi hành quân thần tốc ra Bắc.',
 'Mùa xuân năm Kỷ Dậu (1789), quân Tây Sơn tiến công thần tốc, đánh đồn Hà Hồi, Ngọc Hồi, giải phóng Thăng Long vào mùng 5 Tết, đại phá quân Thanh do Tôn Sĩ Nghị chỉ huy. Quang Trung còn ban Chiếu khuyến nông, dùng chữ Nôm làm chữ viết chính thức, chăm lo kinh tế và giáo dục. Ông mất năm 1792; năm 1802, Nguyễn Ánh đánh bại Tây Sơn, lập nhà Nguyễn.'],
 facts:[['1771','Anh em Tây Sơn khởi nghĩa ở Bình Định'],['1778','Nguyễn Nhạc xưng hoàng đế, niên hiệu Thái Đức'],['1785','Chiến thắng Rạch Gầm – Xoài Mút'],['1788','Nguyễn Huệ lên ngôi, niên hiệu Quang Trung'],['1789','Đại phá quân Thanh ở Ngọc Hồi – Đống Đa'],['1792','Quang Trung qua đời'],['1802','Nguyễn Ánh lập nhà Nguyễn, Tây Sơn sụp đổ']],
 qs:[
 ['Khởi nghĩa Tây Sơn nổ ra năm 1771 ở vùng đất nào?','Ấp Tây Sơn (Bình Định)','Lam Sơn (Thanh Hóa)','Mê Linh (Hà Nội)','Yên Thế (Bắc Giang)','Phong trào do ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ lãnh đạo.'],
 ['Ai xưng hoàng đế năm 1778 với niên hiệu Thái Đức?','Nguyễn Nhạc','Nguyễn Huệ','Nguyễn Lữ','Nguyễn Ánh','Nguyễn Nhạc là người anh cả trong ba anh em Tây Sơn.'],
 ['Chiến thắng Rạch Gầm – Xoài Mút (1785) đánh bại quân nào?','Quân Xiêm','Quân Thanh','Quân Minh','Quân Nguyên','Trận thủy chiến diễn ra trên sông Tiền.'],
 ['Nguyễn Huệ lên ngôi hoàng đế năm 1788 với niên hiệu gì?','Quang Trung','Gia Long','Thái Đức','Hồng Đức','Ông là một trong những nhà quân sự kiệt xuất của lịch sử Việt Nam.'],
 ['Chỉ huy quân Thanh sang xâm lược nước ta năm 1788 là ai?','Tôn Sĩ Nghị','Liễu Thăng','Vương Thông','Thoát Hoan','Quân Thanh bị đánh tan vào đầu năm 1789.'],
 ['Quang Trung đại phá quân Thanh vào thời điểm nào?','Mùng 5 Tết Kỷ Dậu (1789)','Mùng 1 Tết Mậu Thân (1968)','Rằm tháng Giêng năm 1285','Ngày 30 tháng Chạp năm 1788','Quân Tây Sơn hành quân thần tốc từ Phú Xuân ra Bắc.'],
 ['Chiến thắng nào năm 1789 đánh tan quân Thanh?','Ngọc Hồi – Đống Đa','Rạch Gầm – Xoài Mút','Chi Lăng – Xương Giang','Bạch Đằng','Ngày nay gò Đống Đa ở Hà Nội vẫn còn di tích.'],
 ['Dưới triều Quang Trung, loại chữ nào được dùng làm chữ viết chính thức?','Chữ Nôm','Chữ Quốc ngữ','Chữ Hán','Chữ Latinh','Đây là biểu hiện của ý thức tự tôn dân tộc.'],
 ['Quang Trung qua đời vào năm nào?','Năm 1792','Năm 1789','Năm 1802','Năm 1788','Ông mất khi còn rất trẻ, đang chuẩn bị nhiều kế hoạch lớn.'],
 ['Ai là người đánh bại Tây Sơn, lập nên triều Nguyễn năm 1802?','Nguyễn Ánh','Trịnh Sâm','Lê Chiêu Thống','Nguyễn Hoàng','Nguyễn Ánh lên ngôi, niên hiệu Gia Long.']],
 card:{ic:'🐎',t:'Hoàng đế Quang Trung',d:'Nguyễn Huệ, người anh hùng áo vải.'}},

{id:'ng',ic:'🏰',n:'Triều Nguyễn thời kỳ độc lập',y:'1802 – 1858',
 story:[
 'Năm 1802, Nguyễn Ánh đánh bại Tây Sơn, lên ngôi hoàng đế (Gia Long), lập nhà Nguyễn, đóng đô ở Phú Xuân (Huế). Năm 1804, quốc hiệu Việt Nam được chính thức sử dụng; năm 1838, vua Minh Mạng đổi thành Đại Nam. Sau nhiều thế kỷ chia cắt, đất nước thống nhất từ Bắc chí Nam.',
 'Vua Minh Mạng (1820 – 1841) cải cách hành chính mạnh mẽ, chia cả nước thành 30 tỉnh và phủ Thừa Thiên, tăng cường quyền lực trung ương, đồng thời thực thi chủ quyền trên các quần đảo Hoàng Sa, Trường Sa. Nhà Nguyễn xây dựng Kinh thành Huế, hệ thống lăng tẩm và ban hành bộ luật Hoàng Việt luật lệ (Luật Gia Long) năm 1815.',
 'Tuy nhiên, từ giữa thế kỷ XIX, nhà Nguyễn thi hành chính sách bế quan tỏa cảng, cấm đạo, kinh tế nông nghiệp trì trệ, đời sống nhân dân khổ cực, nhiều cuộc nổi dậy xảy ra. Trong khi đó, các nước tư bản phương Tây đua nhau tìm thuộc địa. Năm 1858, thực dân Pháp nổ súng xâm lược nước ta.'],
 facts:[['1802','Gia Long lên ngôi, lập nhà Nguyễn, đóng đô Huế'],['1804','Quốc hiệu Việt Nam được sử dụng'],['1815','Ban hành Hoàng Việt luật lệ'],['1831 – 1832','Minh Mạng cải cách hành chính, chia 30 tỉnh'],['1838','Đổi quốc hiệu thành Đại Nam'],['1858','Pháp nổ súng tấn công Đà Nẵng']],
 qs:[
 ['Nhà Nguyễn được thành lập năm nào?','Năm 1802','Năm 1788','Năm 1858','Năm 1945','Nguyễn Ánh lên ngôi, niên hiệu Gia Long.'],
 ['Kinh đô của triều Nguyễn đặt ở đâu?','Huế (Phú Xuân)','Hà Nội','Hoa Lư','Gia Định','Kinh thành Huế được xây dựng từ năm 1805.'],
 ['Quốc hiệu Việt Nam được chính thức sử dụng từ năm nào?','Năm 1804','Năm 1802','Năm 1838','Năm 1945','Quốc hiệu này được đặt dưới thời vua Gia Long.'],
 ['Ai là vị vua đổi quốc hiệu thành Đại Nam năm 1838?','Minh Mạng','Gia Long','Thiệu Trị','Tự Đức','Minh Mạng còn cải cách mạnh mẽ về hành chính.'],
 ['Minh Mạng chia cả nước thành khoảng bao nhiêu tỉnh (ngoài phủ Thừa Thiên)?','30 tỉnh','63 tỉnh','10 tỉnh','15 tỉnh','Cải cách hành chính diễn ra vào những năm 1831 – 1832.'],
 ['Triều Nguyễn khẳng định chủ quyền ở Hoàng Sa, Trường Sa bằng việc làm nào?','Cử thủy quân ra đo đạc, cắm cờ, dựng bia, trồng cây','Giao cho nước ngoài quản lý','Bỏ mặc không quan tâm','Chỉ ghi trong sách văn học','Nhiều tư liệu của triều Nguyễn ghi nhận các hoạt động này.'],
 ['Kinh thành Huế bắt đầu được xây dựng dưới thời vua nào?','Gia Long','Tự Đức','Bảo Đại','Quang Trung','Kinh thành Huế là công trình kiến trúc đồ sộ của triều Nguyễn.'],
 ['Cổng chính phía nam của Hoàng thành Huế có tên là gì?','Ngọ Môn','Cửa Hiển Nhơn','Cửa Thượng Tứ','Cổng Tam Quan','Ngọ Môn là nơi diễn ra nhiều đại lễ của triều đình.'],
 ['Chính sách nào của nhà Nguyễn khiến đất nước khó phát triển và khó đối phó với phương Tây?','Bế quan tỏa cảng','Mở cửa thông thương','Khuyến khích công thương nghiệp','Cải cách giáo dục theo phương Tây','Việc hạn chế giao thương làm đất nước tụt hậu so với thế giới.']],
 card:{ic:'🏰',t:'Kinh thành Huế',d:'Kinh đô cuối cùng của chế độ phong kiến Việt Nam.'}},

{id:'ph',ic:'⚓',n:'Pháp xâm lược và các phong trào yêu nước',y:'1858 – 1930',
 story:[
 'Ngày 1/9/1858, thực dân Pháp nổ súng tấn công Đà Nẵng, nhưng bị quân dân ta chặn đánh nên chuyển vào đánh Gia Định (1859). Triều Nguyễn do dự, dần nhượng bộ: Hiệp ước Nhâm Tuất (1862) cắt ba tỉnh miền Đông Nam Kỳ; đến năm 1867 Pháp chiếm nốt ba tỉnh miền Tây. Các hiệp ước Quý Mùi (1883) và Giáp Thân – Pa-tơ-nốt (1884) chấm dứt nền độc lập của nước ta, đặt dưới sự bảo hộ của Pháp.',
 'Nhân dân không chịu khuất phục: Trương Định, Nguyễn Trung Trực (đốt tàu Ét-pê-răng năm 1861) ở Nam Kỳ; phong trào Cần Vương (1885 – 1896) bùng nổ sau chiếu Cần Vương của vua Hàm Nghi, tiêu biểu là khởi nghĩa Hương Khê của Phan Đình Phùng; khởi nghĩa nông dân Yên Thế do Hoàng Hoa Thám lãnh đạo kéo dài hơn 30 năm (1884 – 1913).',
 'Đầu thế kỷ XX xuất hiện những con đường cứu nước mới: Phan Bội Châu chủ trương bạo động, tổ chức phong trào Đông du (1905 – 1908) đưa thanh niên sang Nhật; Phan Châu Trinh chủ trương cải cách, nâng cao dân trí, dân quyền; Đông Kinh nghĩa thục (1907) truyền bá tư tưởng mới. Ngày 5/6/1911, Nguyễn Tất Thành rời Bến Nhà Rồng ra đi tìm đường cứu nước, mở ra hướng đi mới cho cách mạng Việt Nam.'],
 facts:[['1858','Pháp nổ súng tấn công Đà Nẵng'],['1862','Hiệp ước Nhâm Tuất'],['1884','Hiệp ước Pa-tơ-nốt, Pháp đặt ách bảo hộ'],['1885 – 1896','Phong trào Cần Vương'],['1884 – 1913','Khởi nghĩa Yên Thế'],['1905 – 1908','Phong trào Đông du'],['1911','Nguyễn Tất Thành ra đi tìm đường cứu nước']],
 qs:[
 ['Ngày 1/9/1858, thực dân Pháp nổ súng xâm lược nước ta lần đầu tại đâu?','Đà Nẵng','Hải Phòng','Hà Nội','Cần Thơ','Quân Pháp và Tây Ban Nha tấn công bán đảo Sơn Trà.'],
 ['Hiệp ước Nhâm Tuất (1862) nhượng cho Pháp những tỉnh nào?','Biên Hòa, Gia Định, Định Tường','Hà Nội, Nam Định, Hải Dương','Vĩnh Long, An Giang, Hà Tiên','Quảng Nam, Quảng Ngãi, Bình Định','Hiệp ước còn nhượng cả đảo Côn Lôn.'],
 ['Hiệp ước Pa-tơ-nốt (1884) có tác động gì?','Nhà Nguyễn chính thức thừa nhận sự bảo hộ của Pháp, mất độc lập','Nước ta giành lại độc lập','Pháp rút quân khỏi Việt Nam','Hai nước kết thành đồng minh','Từ đây nước ta trở thành thuộc địa nửa phong kiến.'],
 ['Ai chỉ huy nghĩa quân đốt cháy tàu Ét-pê-răng của Pháp năm 1861?','Nguyễn Trung Trực','Trương Định','Phan Đình Phùng','Hoàng Hoa Thám','Ông là vị anh hùng nổi tiếng của vùng đất Nam Bộ.'],
 ['Chiếu Cần Vương năm 1885 được ban dưới danh nghĩa của vị vua nào?','Hàm Nghi','Tự Đức','Bảo Đại','Duy Tân','Phong trào Cần Vương kêu gọi văn thân sĩ phu giúp vua cứu nước.'],
 ['Ai là lãnh tụ của cuộc khởi nghĩa Hương Khê?','Phan Đình Phùng','Hoàng Hoa Thám','Phan Bội Châu','Nguyễn Thiện Thuật','Khởi nghĩa Hương Khê là đỉnh cao của phong trào Cần Vương.'],
 ['Cuộc khởi nghĩa nông dân kéo dài nhất chống Pháp (1884 – 1913) do ai lãnh đạo?','Hoàng Hoa Thám','Phan Đình Phùng','Trương Định','Nguyễn Trung Trực','Căn cứ của khởi nghĩa đặt ở vùng Yên Thế (Bắc Giang).'],
 ['Phong trào Đông du do ai khởi xướng?','Phan Bội Châu','Phan Châu Trinh','Nguyễn Ái Quốc','Lương Văn Can','Phong trào đưa thanh niên sang Nhật học tập để cứu nước.'],
 ['Phan Châu Trinh chủ trương cứu nước theo con đường nào?','Cải cách, nâng cao dân trí và dân quyền','Khởi nghĩa vũ trang quy mô lớn','Dựa vào nước ngoài để đánh Pháp','Thương lượng với triều đình','Ông chủ trương “Khai dân trí, chấn dân khí, hậu dân sinh”.'],
 ['Năm 1911, Nguyễn Tất Thành ra đi tìm đường cứu nước từ bến cảng nào?','Bến Nhà Rồng (Sài Gòn)','Cảng Hải Phòng','Cảng Cam Ranh','Cảng Tourane (Đà Nẵng)','Ông rời bến Nhà Rồng ngày 5/6/1911 trên tàu Đô đốc Latouche-Tréville.']],
 card:{ic:'⚓',t:'Bến Nhà Rồng',d:'Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước.'}},

{id:'dg',ic:'⭐',n:'Đảng ra đời và Cách mạng tháng Tám',y:'1930 – 1945',
 story:[
 'Sau những năm bôn ba nhiều châu lục, năm 1920 Nguyễn Ái Quốc tìm thấy con đường cứu nước theo chủ nghĩa Mác – Lênin. Năm 1925, Người thành lập Việt Nam Thanh niên Cách mạng đồng chí hội ở Quảng Châu. Ngày 3/2/1930, tại Hương Cảng (Hồng Kông), Nguyễn Ái Quốc chủ trì hội nghị hợp nhất các tổ chức cộng sản, thành lập Đảng Cộng sản Việt Nam, thông qua Cương lĩnh chính trị đầu tiên.',
 'Phong trào cách mạng 1930 – 1931 lên cao với Xô viết Nghệ – Tĩnh; thời kỳ 1936 – 1939 đấu tranh đòi dân sinh, dân chủ. Năm 1939, Chiến tranh thế giới thứ hai bùng nổ; năm 1940 Nhật vào Đông Dương, nhân dân ta chịu hai tầng áp bức Pháp – Nhật. Tháng 5/1941, Nguyễn Ái Quốc chủ trì Hội nghị Trung ương 8 tại Pác Bó (Cao Bằng), thành lập Mặt trận Việt Minh; ngày 22/12/1944, Đội Việt Nam Tuyên truyền Giải phóng quân ra đời do Võ Nguyên Giáp chỉ huy.',
 'Ngày 9/3/1945, Nhật đảo chính Pháp; nạn đói cuối 1944 – đầu 1945 làm hơn hai triệu đồng bào chết. Thời cơ chín muồi, Tổng khởi nghĩa nổ ra: ngày 19/8 giành chính quyền ở Hà Nội, 23/8 ở Huế, 25/8 ở Sài Gòn. Ngày 30/8, vua Bảo Đại thoái vị. Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.'],
 facts:[['1920','Nguyễn Ái Quốc tìm thấy con đường cứu nước'],['3/2/1930','Đảng Cộng sản Việt Nam ra đời'],['1930 – 1931','Phong trào Xô viết Nghệ – Tĩnh'],['5/1941','Thành lập Mặt trận Việt Minh ở Pác Bó'],['22/12/1944','Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân'],['9/3/1945','Nhật đảo chính Pháp'],['19/8/1945','Tổng khởi nghĩa giành chính quyền ở Hà Nội'],['2/9/1945','Tuyên ngôn Độc lập, nước VNDCCH ra đời']],
 qs:[
 ['Đảng Cộng sản Việt Nam được thành lập vào ngày nào?','Ngày 3/2/1930','Ngày 19/5/1941','Ngày 2/9/1945','Ngày 7/5/1954','Ngày 3/2 hằng năm là ngày kỷ niệm thành lập Đảng.'],
 ['Hội nghị hợp nhất các tổ chức cộng sản năm 1930 diễn ra ở đâu?','Hương Cảng (Hồng Kông)','Pác Bó (Cao Bằng)','Tân Trào (Tuyên Quang)','Quảng Châu (Trung Quốc)','Hội nghị diễn ra từ ngày 6/1 đến 7/2/1930; ngày 3/2 được lấy làm ngày thành lập Đảng.'],
 ['Ai là người chủ trì hội nghị hợp nhất thành lập Đảng?','Nguyễn Ái Quốc','Trần Phú','Lê Hồng Phong','Võ Nguyên Giáp','Nguyễn Ái Quốc sau này lấy tên là Hồ Chí Minh.'],
 ['Phong trào đấu tranh đỉnh cao của cách mạng 1930 – 1931 là gì?','Xô viết Nghệ – Tĩnh','Khởi nghĩa Yên Bái','Phong trào Đông du','Phong trào Cần Vương','Lần đầu tiên chính quyền của công nông được thành lập ở nhiều làng xã.'],
 ['Mặt trận Việt Minh được thành lập tháng 5/1941 ở đâu?','Pác Bó (Cao Bằng)','Tân Trào (Tuyên Quang)','Hà Nội','Huế','Hội nghị Trung ương 8 do Nguyễn Ái Quốc chủ trì.'],
 ['Đội Việt Nam Tuyên truyền Giải phóng quân (22/12/1944) do ai chỉ huy?','Võ Nguyên Giáp','Hoàng Hoa Thám','Phan Đình Phùng','Trần Hưng Đạo','Đây là tiền thân của Quân đội nhân dân Việt Nam.'],
 ['Ngày 9/3/1945, Nhật Bản đã làm gì ở Đông Dương?','Đảo chính lật đổ Pháp','Rút quân khỏi Đông Dương','Ký hiệp ước với Việt Minh','Trao trả độc lập cho Việt Nam','Sự kiện này tạo ra thời cơ cho cách mạng.'],
 ['Nạn đói năm Ất Dậu (1945) đã làm khoảng bao nhiêu đồng bào chết?','Hơn 2 triệu người','Khoảng 10 nghìn người','Khoảng 100 nghìn người','Khoảng 500 nghìn người','Đây là hậu quả của chính sách vơ vét của Pháp và Nhật.'],
 ['Tổng khởi nghĩa giành chính quyền ở Hà Nội diễn ra ngày nào?','Ngày 19/8/1945','Ngày 23/8/1945','Ngày 25/8/1945','Ngày 2/9/1945','Ngày 19/8 được gọi là ngày Cách mạng tháng Tám.'],
 ['Vị vua cuối cùng của triều Nguyễn thoái vị ngày 30/8/1945 là ai?','Bảo Đại','Duy Tân','Hàm Nghi','Khải Định','Sự kiện đánh dấu sự sụp đổ của chế độ quân chủ ở Việt Nam.'],
 ['Nhà nước ra đời ngày 2/9/1945 có tên là gì?','Việt Nam Dân chủ Cộng hòa','Cộng hòa Xã hội chủ nghĩa Việt Nam','Đại Nam','Việt Nam Cộng hòa','Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.']],
 card:{ic:'⭐',t:'Ngày Quốc khánh 2/9',d:'Nước Việt Nam Dân chủ Cộng hòa ra đời.'}},

{id:'kc',ic:'🎖️',n:'Kháng chiến chống thực dân Pháp',y:'1945 – 1954',
 story:[
 'Sau Cách mạng tháng Tám, nước ta đứng trước muôn vàn khó khăn: “giặc đói, giặc dốt, giặc ngoại xâm”. Ngày 6/1/1946, cuộc Tổng tuyển cử bầu Quốc hội đầu tiên diễn ra; thực dân Pháp trở lại xâm lược Nam Bộ rồi gây hấn ở Hà Nội. Ngày 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến.',
 'Cuộc kháng chiến toàn dân, toàn diện, trường kỳ, tự lực cánh sinh. Thu – đông 1947, ta đánh bại cuộc tấn công lên Việt Bắc của Pháp. Chiến dịch Biên giới thu – đông 1950 giải phóng một dải biên giới Việt – Trung, phá thế bao vây. Năm 1951, Đảng ra hoạt động công khai với tên Đảng Lao động Việt Nam.',
 'Đông – Xuân 1953 – 1954, Pháp tập trung binh lực xây dựng tập đoàn cứ điểm Điện Biên Phủ trong kế hoạch Nava. Chiến dịch Điện Biên Phủ do Đại tướng Võ Nguyên Giáp chỉ huy diễn ra từ 13/3 đến 7/5/1954, tướng Đờ Cát-xtơ-ri cùng toàn bộ bộ chỉ huy bị bắt. Hiệp định Giơ-ne-vơ (21/7/1954) công nhận độc lập, chủ quyền của Việt Nam, Lào, Campuchia; nước ta tạm thời chia hai miền ở vĩ tuyến 17.'],
 facts:[['6/1/1946','Tổng tuyển cử bầu Quốc hội đầu tiên'],['19/12/1946','Lời kêu gọi toàn quốc kháng chiến'],['Thu – đông 1947','Chiến thắng Việt Bắc'],['Thu – đông 1950','Chiến dịch Biên giới'],['13/3 – 7/5/1954','Chiến dịch Điện Biên Phủ'],['21/7/1954','Hiệp định Giơ-ne-vơ']],
 qs:[
 ['Ngày 6/1/1946 diễn ra sự kiện quan trọng nào?','Tổng tuyển cử bầu Quốc hội đầu tiên','Tuyên ngôn Độc lập','Chiến thắng Điện Biên Phủ','Hiệp định Giơ-ne-vơ','Đây là lần đầu tiên nhân dân Việt Nam đi bầu cử tự do.'],
 ['Lời kêu gọi toàn quốc kháng chiến vang lên vào ngày nào?','Ngày 19/12/1946','Ngày 2/9/1945','Ngày 6/1/1946','Ngày 7/5/1954','Lời kêu gọi do Chủ tịch Hồ Chí Minh ra.'],
 ['Chiến thắng Việt Bắc thu – đông 1947 có ý nghĩa gì?','Đánh bại cuộc tấn công lớn của Pháp, bảo vệ cơ quan đầu não kháng chiến','Kết thúc cuộc kháng chiến chống Pháp','Giải phóng hoàn toàn miền Bắc','Đánh bại quân Mỹ','Chiến lược đánh nhanh thắng nhanh của Pháp bị thất bại.'],
 ['Chiến dịch Biên giới thu – đông 1950 đạt kết quả gì?','Giải phóng một dải biên giới Việt – Trung, mở rộng căn cứ địa','Giải phóng Hà Nội','Kết thúc chiến tranh','Chiếm Điện Biên Phủ','Cuộc kháng chiến chuyển sang giai đoạn mới chủ động hơn.'],
 ['Chiến dịch Điện Biên Phủ diễn ra trong khoảng thời gian nào?','Từ 13/3 đến 7/5/1954','Từ 19/8 đến 2/9/1945','Từ 26/4 đến 30/4/1975','Từ 10/3 đến 30/3/1975','Chiến dịch kéo dài 56 ngày đêm.'],
 ['Ai là Tổng tư lệnh chỉ huy chiến dịch Điện Biên Phủ?','Võ Nguyên Giáp','Văn Tiến Dũng','Hoàng Văn Thái','Nguyễn Chí Thanh','Ông còn được gọi là vị Đại tướng huyền thoại.'],
 ['Tướng Pháp nào bị bắt sống ở Điện Biên Phủ?','Đờ Cát-xtơ-ri','Na-va','Xa-lăng','Đờ Lát đơ Tát-xi-nhi','Tập đoàn cứ điểm Điện Biên Phủ hoàn toàn bị tiêu diệt.'],
 ['Ở Điện Biên Phủ, quyết định thay đổi phương châm tác chiến thành gì?','Đánh chắc, tiến chắc','Đánh nhanh, thắng nhanh','Cố thủ, chờ viện trợ','Đánh du kích phân tán','Việc đổi phương châm đã góp phần quan trọng vào thắng lợi.'],
 ['Hiệp định Giơ-ne-vơ năm 1954 lấy đường nào làm giới tuyến quân sự tạm thời?','Vĩ tuyến 17 (sông Bến Hải)','Vĩ tuyến 38','Sông Gianh','Sông Hồng','Việt Nam tạm thời chia thành hai miền Bắc – Nam, sẽ tổng tuyển cử thống nhất.']],
 card:{ic:'🎖️',t:'Chiến thắng Điện Biên Phủ',d:'Chiến thắng “lừng lẫy năm châu, chấn động địa cầu”.'}},

{id:'cm',ic:'🚩',n:'Kháng chiến chống Mỹ, thống nhất đất nước',y:'1954 – 1975',
 story:[
 'Sau Hiệp định Giơ-ne-vơ, miền Bắc hoàn toàn giải phóng và bước vào xây dựng chủ nghĩa xã hội; miền Nam bị Mỹ dựng chính quyền Ngô Đình Diệm, đất nước bị chia cắt. Phong trào Đồng khởi (1960), mạnh nhất ở Bến Tre, làm lung lay chính quyền Sài Gòn; ngày 20/12/1960, Mặt trận Dân tộc Giải phóng miền Nam Việt Nam thành lập.',
 'Mỹ lần lượt tiến hành “chiến tranh đặc biệt” (1961 – 1965), “chiến tranh cục bộ” (1965 – 1968), “Việt Nam hóa chiến tranh” (1969 – 1973), đồng thời dùng không quân đánh phá miền Bắc. Nhân dân hai miền đoàn kết một lòng: miền Bắc vừa chiến đấu vừa chi viện qua đường Hồ Chí Minh (đường Trường Sơn), miền Nam đánh bại từng chiến lược của Mỹ; cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 làm lung lay ý chí xâm lược.',
 'Cuối tháng 12/1972, quân dân miền Bắc đánh bại cuộc tập kích bằng B-52 của Mỹ, làm nên chiến thắng “Điện Biên Phủ trên không”. Hiệp định Pa-ri (27/1/1973) buộc Mỹ rút quân. Năm 1975, chiến dịch Tây Nguyên mở màn ở Buôn Ma Thuột (10/3), tiếp đến chiến dịch Huế – Đà Nẵng và Chiến dịch Hồ Chí Minh (26 – 30/4/1975). Trưa 30/4/1975, xe tăng húc đổ cổng Dinh Độc Lập, đất nước hoàn toàn thống nhất.'],
 facts:[['1960','Phong trào Đồng khởi; 20/12 thành lập Mặt trận Dân tộc Giải phóng miền Nam'],['1964 – 1965','Mỹ đánh phá miền Bắc, đưa quân vào miền Nam'],['1968','Tổng tiến công và nổi dậy Tết Mậu Thân'],['12/1972','Chiến thắng “Điện Biên Phủ trên không”'],['27/1/1973','Ký Hiệp định Pa-ri'],['10/3/1975','Mở màn chiến dịch Tây Nguyên ở Buôn Ma Thuột'],['30/4/1975','Giải phóng miền Nam, thống nhất đất nước']],
 qs:[
 ['Phong trào Đồng khởi năm 1960 bùng nổ mạnh mẽ ở tỉnh nào?','Bến Tre','Quảng Trị','Nghệ An','Thái Nguyên','Đồng khởi chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công.'],
 ['Mặt trận Dân tộc Giải phóng miền Nam Việt Nam thành lập ngày nào?','Ngày 20/12/1960','Ngày 2/9/1945','Ngày 30/4/1975','Ngày 27/1/1973','Mặt trận đoàn kết các tầng lớp nhân dân miền Nam chống Mỹ.'],
 ['Tuyến đường vận tải chiến lược chi viện cho miền Nam được gọi là gì?','Đường Hồ Chí Minh (đường Trường Sơn)','Quốc lộ 1A','Đường Thiên lý','Đường tuần tra biên giới','Đường được mở từ năm 1959, vượt Trường Sơn nối hai miền.'],
 ['Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân diễn ra vào năm nào?','Năm 1968','Năm 1954','Năm 1972','Năm 1975','Cuộc tiến công làm lung lay ý chí xâm lược của Mỹ.'],
 ['Chiến thắng “Điện Biên Phủ trên không” diễn ra vào năm nào?','Năm 1972','Năm 1968','Năm 1954','Năm 1975','Quân dân Hà Nội bắn rơi nhiều máy bay B-52 của Mỹ trong 12 ngày đêm.'],
 ['Hiệp định Pa-ri được ký ngày 27/1/1973 có nội dung quan trọng nào?','Mỹ cam kết rút quân khỏi miền Nam Việt Nam','Việt Nam chia thành hai nước','Mỹ được đóng quân lâu dài','Chấm dứt quan hệ hai miền','Hiệp định tạo điều kiện thuận lợi cho cuộc tổng tiến công 1975.'],
 ['Chiến dịch Tây Nguyên năm 1975 mở màn ở đâu?','Buôn Ma Thuột','Đà Lạt','Pleiku','Kon Tum','Trận Buôn Ma Thuột ngày 10/3/1975 mở ra thế thắng lớn.'],
 ['Chiến dịch cuối cùng giải phóng Sài Gòn có tên là gì?','Chiến dịch Hồ Chí Minh','Chiến dịch Điện Biên Phủ','Chiến dịch Biên giới','Chiến dịch Việt Bắc','Chiến dịch diễn ra từ 26 đến 30/4/1975.'],
 ['Ngày 30/4/1975, người nào tuyên bố đầu hàng tại Dinh Độc Lập?','Dương Văn Minh','Ngô Đình Diệm','Nguyễn Văn Thiệu','Nguyễn Cao Kỳ','Xe tăng quân giải phóng húc đổ cổng Dinh Độc Lập vào trưa 30/4/1975.'],
 ['Sự kiện nào kết thúc cuộc kháng chiến chống Mỹ cứu nước?','Giải phóng miền Nam, thống nhất đất nước ngày 30/4/1975','Ký Hiệp định Giơ-ne-vơ năm 1954','Cách mạng tháng Tám 1945','Công cuộc Đổi mới năm 1986','Non sông thu về một mối sau hơn 20 năm chia cắt.']],
 card:{ic:'🚩',t:'Ngày 30/4/1975',d:'Non sông thu về một mối.'}},

{id:'dm',ic:'🌟',n:'Xây dựng, bảo vệ đất nước và Đổi mới',y:'1975 – nay',
 story:[
 'Ngày 2/7/1976, Quốc hội nước Việt Nam thống nhất quyết định tên nước là Cộng hòa Xã hội chủ nghĩa Việt Nam, thủ đô Hà Nội; thành phố Sài Gòn – Gia Định được đổi tên thành Thành phố Hồ Chí Minh. Những năm đầu sau chiến tranh, đất nước gặp nhiều khó khăn: hậu quả chiến tranh nặng nề, bị bao vây cấm vận, lại phải bảo vệ biên giới Tây Nam và biên giới phía Bắc (1979).',
 'Tháng 12/1986, Đại hội VI của Đảng quyết định đường lối Đổi mới: chuyển từ cơ chế tập trung quan liêu bao cấp sang phát triển kinh tế nhiều thành phần theo cơ chế thị trường có sự quản lý của Nhà nước, theo định hướng xã hội chủ nghĩa. Nhờ đó, từ một nước thiếu lương thực, Việt Nam trở thành một trong những nước xuất khẩu gạo hàng đầu thế giới.',
 'Việt Nam mở rộng quan hệ đối ngoại: bình thường hóa quan hệ với Hoa Kỳ (1995), gia nhập ASEAN (1995), tham gia APEC (1998), trở thành thành viên thứ 150 của WTO (2007). Nhiều di sản được UNESCO ghi danh như Quần thể di tích Cố đô Huế (1993), Vịnh Hạ Long (1994), Phố cổ Hội An, Thánh địa Mỹ Sơn (1999)... Ngày nay đất nước tiếp tục công nghiệp hóa, hiện đại hóa và hội nhập quốc tế.'],
 facts:[['2/7/1976','Quốc hội đặt tên nước là Cộng hòa Xã hội chủ nghĩa Việt Nam'],['12/1986','Đại hội VI, bắt đầu công cuộc Đổi mới'],['1993','Cố đô Huế được UNESCO công nhận là Di sản văn hóa thế giới'],['1995','Gia nhập ASEAN và bình thường hóa quan hệ với Hoa Kỳ'],['1998','Tham gia APEC'],['2007','Trở thành thành viên thứ 150 của WTO']],
 qs:[
 ['Từ ngày 2/7/1976, tên nước ta là gì?','Cộng hòa Xã hội chủ nghĩa Việt Nam','Việt Nam Dân chủ Cộng hòa','Việt Nam Cộng hòa','Đại Nam','Quốc hội khóa VI quyết định tên nước và thủ đô Hà Nội.'],
 ['Sau khi thống nhất, thành phố Sài Gòn – Gia Định được đổi tên thành gì?','Thành phố Hồ Chí Minh','Thành phố Phú Xuân','Thành phố Đông Kinh','Thành phố Cần Thơ','Tên gọi này để tưởng nhớ Chủ tịch Hồ Chí Minh.'],
 ['Công cuộc Đổi mới của Việt Nam bắt đầu từ năm nào?','Năm 1986','Năm 1975','Năm 1954','Năm 1995','Đại hội VI của Đảng đã khởi xướng đường lối Đổi mới.'],
 ['Đường lối kinh tế của công cuộc Đổi mới là gì?','Kinh tế nhiều thành phần, cơ chế thị trường định hướng xã hội chủ nghĩa','Kinh tế tập trung bao cấp hoàn toàn','Chỉ phát triển nông nghiệp tự cung tự cấp','Đóng cửa với bên ngoài','Đổi mới giải phóng sức sản xuất, nâng cao đời sống nhân dân.'],
 ['Việt Nam gia nhập Hiệp hội các quốc gia Đông Nam Á (ASEAN) vào năm nào?','Năm 1995','Năm 1986','Năm 2007','Năm 1976','Cùng năm này, Việt Nam bình thường hóa quan hệ với Hoa Kỳ.'],
 ['Việt Nam trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới (WTO) năm nào?','Năm 2007','Năm 1995','Năm 1998','Năm 1986','Việc gia nhập WTO mở rộng thị trường cho hàng hóa Việt Nam.'],
 ['Quần thể di tích nào của Việt Nam được UNESCO công nhận là Di sản văn hóa thế giới năm 1993?','Cố đô Huế','Phố cổ Hội An','Thành Nhà Hồ','Hoàng thành Thăng Long','Đây là di sản thế giới đầu tiên của Việt Nam.'],
 ['Vịnh Hạ Long lần đầu được UNESCO công nhận là Di sản thiên nhiên thế giới vào năm nào?','Năm 1994','Năm 1975','Năm 2007','Năm 1945','Vịnh nổi tiếng với hàng nghìn đảo đá vôi.'],
 ['Thành tựu nổi bật của Việt Nam trong nông nghiệp sau Đổi mới là gì?','Từ nước thiếu lương thực thành nước xuất khẩu gạo hàng đầu thế giới','Ngừng sản xuất lúa gạo','Chỉ nhập khẩu lương thực','Bỏ hẳn nông nghiệp','Đây là kết quả của việc đổi mới cơ chế quản lý nông nghiệp.']],
 card:{ic:'🌟',t:'Công cuộc Đổi mới',d:'Mở cửa, hội nhập và phát triển.'}}
];

/* Ai là ai: [tên, icon, gợi ý 1, 2, 3] — gợi ý càng về sau càng dễ */
const WHO=[
['Ngô Quyền','🌊','Quê ở Đường Lâm (Sơn Tây).','Dùng cọc nhọn cắm ngầm dưới lòng sông.','Năm 938 đánh bại quân Nam Hán, xưng vương năm 939.'],
['Đinh Bộ Lĩnh','🌾','Thuở nhỏ chăn trâu, lấy bông lau làm cờ tập trận.','Dẹp loạn 12 sứ quân.','Lên ngôi hoàng đế, đặt quốc hiệu Đại Cồ Việt, đóng đô Hoa Lư.'],
['Lý Công Uẩn','🐉','Lớn lên trong chùa, được nhà sư nuôi dạy.','Lập ra triều đại nhà Lý năm 1009.','Ban Chiếu dời đô, đưa kinh đô ra Thăng Long.'],
['Lý Thường Kiệt','🏹','Danh tướng triều Lý.','Chủ động tiến công sang đất Tống năm 1075 để phá thế chuẩn bị xâm lược.','Bài thơ “Nam quốc sơn hà” gắn với tên tuổi ông.'],
['Trần Hưng Đạo','⚔️','Được phong Quốc công Tiết chế của nhà Trần.','Soạn “Hịch tướng sĩ”.','Ba lần chỉ huy quân dân đánh thắng quân Mông – Nguyên.'],
['Lê Lợi','🗡️','Gắn với căn cứ Lam Sơn.','Truyền thuyết về thanh gươm thần và Hồ Hoàn Kiếm.','Lãnh tụ khởi nghĩa Lam Sơn, lên ngôi năm 1428, lập nhà Hậu Lê.'],
['Nguyễn Trãi','📜','Con của Nguyễn Phi Khanh.','Quân sư số một của nghĩa quân Lam Sơn.','Soạn “Bình Ngô đại cáo”.'],
['Quang Trung (Nguyễn Huệ)','🐎','Xuất thân từ phong trào khởi nghĩa Tây Sơn.','Hành quân thần tốc từ Phú Xuân ra Bắc.','Đại phá quân Thanh năm 1789 ở Ngọc Hồi – Đống Đa.'],
['Bà Triệu','🐘','Nữ anh hùng gắn với vùng núi Nưa (Thanh Hóa).','Khởi nghĩa năm 248 chống ách đô hộ nhà Ngô.','Nổi tiếng với lời tuyên bố muốn cưỡi gió mạnh, đạp sóng dữ.'],
['Hồ Chí Minh','⭐','Tên khai sinh là Nguyễn Sinh Cung.','Năm 1911 ra đi tìm đường cứu nước từ Bến Nhà Rồng.','Đọc Tuyên ngôn Độc lập ngày 2/9/1945 tại Quảng trường Ba Đình.'],
['Võ Nguyên Giáp','🎖️','Vị Đại tướng đầu tiên của Quân đội nhân dân Việt Nam.','Từng là học trò, sau là cộng sự thân cận của Chủ tịch Hồ Chí Minh.','Chỉ huy chiến dịch Điện Biên Phủ năm 1954.']
];

/* Sắp xếp sự kiện: [tên sự kiện, năm] */
const ORD=[
[['Khởi nghĩa Hai Bà Trưng',40],['Chiến thắng Bạch Đằng của Ngô Quyền',938],['Lý Công Uẩn dời đô ra Thăng Long',1010],['Chiến thắng Bạch Đằng của Trần Hưng Đạo',1288]],
[['Hồ Quý Ly lập nhà Hồ',1400],['Lê Lợi lên ngôi, kết thúc khởi nghĩa Lam Sơn',1428],['Quang Trung đại phá quân Thanh',1789],['Gia Long lên ngôi, lập nhà Nguyễn',1802]],
[['Pháp nổ súng tấn công Đà Nẵng',1858],['Hiệp ước Pa-tơ-nốt',1884],['Đảng Cộng sản Việt Nam thành lập',1930],['Cách mạng tháng Tám',1945]],
[['Tuyên ngôn Độc lập',1945],['Chiến thắng Điện Biên Phủ',1954],['Giải phóng miền Nam, thống nhất đất nước',1975],['Công cuộc Đổi mới bắt đầu',1986]],
[['Đinh Bộ Lĩnh lên ngôi hoàng đế',968],['Lê Hoàn đại thắng quân Tống',981],['Xây dựng Văn Miếu',1070],['Lý Thường Kiệt kháng chiến chống Tống (phòng tuyến Như Nguyệt)',1077]],
[['Chiến thắng Rạch Gầm – Xoài Mút',1785],['Nguyễn Huệ lên ngôi hoàng đế, niên hiệu Quang Trung',1788],['Chiến thắng Ngọc Hồi – Đống Đa',1789],['Nguyễn Ánh lên ngôi, niên hiệu Gia Long',1802]]
];

/* ===================== KHUNG GIAO DIỆN ===================== */
root.innerHTML='<div class="vh-top"><h1 data-a="home"><svg viewBox="0 0 30 20" width="26" height="17" style="vertical-align:-3px;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,.35)" aria-hidden="true"><rect width="30" height="20" fill="#DA251D"/><polygon fill="#FFFF00" points="15,4.5 16.35,8.65 20.71,8.65 17.18,11.21 18.53,15.35 15,12.79 11.47,15.35 12.82,11.21 9.29,8.65 13.65,8.65"/></svg> Khám phá lịch sử Việt Nam</h1><span class="vh-chip" id="vh-pts"></span><span class="vh-chip" id="vh-badge"></span></div><div class="vh-main" id="vh-main"></div>';
const main=document.getElementById('vh-main');
let timer=null;
const stopTimer=()=>{if(timer){clearInterval(timer);timer=null}};
const draw=h=>{main.innerHTML=(hist.length&&cur.a!=='home'?'<div class="vh-nav"><button class="vh-back" data-a="back">← Quay lại</button></div>':'')+h};
const toTop=()=>{const b=document.querySelector('#vnhOv .gm-body');if(b)b.scrollTop=0};
function top(){
  document.getElementById('vh-pts').textContent='⭐ '+S.pts+' điểm';
  const n=Object.keys(S.done).length;
  document.getElementById('vh-badge').textContent=n>=ERAS.length?'🏅 Nhà sử học':'📚 '+n+'/'+ERAS.length+' thời kỳ';
}
function toast(t){const d=document.createElement('div');d.className='vh-toast';d.textContent=t;root.appendChild(d);setTimeout(()=>d.remove(),1800)}
function addPts(n){S.pts+=n;persist();top()}

const A={};
/* Điều hướng: mỗi màn đều có nút ← quay lại màn trước đó */
let cur={a:'home',d:{}},hist=[];
const NAVS={journey:1,era:1,startq:1,who:1,order:1,arena:1,collect:1};
const SCROLLTOP={back:1,home:1,journey:1,era:1,startq:1,who:1,order:1,arena:1,collect:1,qnext:1,wnext:1,onext:1,anext:1};
const sameNav=(x,y)=>x.a===y.a&&String(x.d.i)===String(y.d.i);
root.addEventListener('click',e=>{
  const t=e.target.closest('[data-a]');if(!t||t.disabled)return;
  const a=t.dataset.a;
  if(a==='back'){
    stopTimer();
    const p=hist.pop();
    if(!p){cur={a:'home',d:{}};home();toTop();return}
    cur=p;A[p.a](p.d,null);toTop();return;
  }
  const f=A[a];if(!f)return;
  if(a==='home'){hist=[];cur={a:'home',d:{}}}
  else if(NAVS[a]){
    const n={a:a,d:Object.assign({},t.dataset)};
    if(!sameNav(n,cur)){
      const k=hist.findIndex(x=>sameNav(x,n));
      if(k>=0)hist.length=k;               /* quay lại một màn đã đi qua */
      else if(cur.a!=='startq')hist.push(cur);
      else if(n.a==='era'&&hist.length&&hist[hist.length-1].a==='era')hist.pop(); /* màn câu hỏi chỉ là màn tạm */
    }
    cur=n;
  }
  f(t.dataset,t);
  if(SCROLLTOP[a])toTop();
});

/* ===================== TRANG CHỦ ===================== */
function home(){
  stopTimer();top();
  draw(`<h2 class="vh-h2">Chào mừng bạn đến với dòng thời gian sống!</h2>
  <p class="vh-sub">Chọn một chế độ chơi. Hoàn thành cả ${ERAS.length} giai đoạn lịch sử để nhận danh hiệu <b>Nhà sử học</b>.</p>
  <div class="vh-grid">
   <button class="vh-mode" data-a="journey"><span class="big">⏳</span><b>Hành trình thời gian</b><small>${ERAS.length} màn theo đúng các giai đoạn lịch sử: giới thiệu chi tiết, nhiều câu hỏi, mở khóa thẻ di sản.</small></button>
   <button class="vh-mode" data-a="who"><span class="big">🕵️</span><b>Ai là ai?</b><small>Đoán nhân vật qua 3 gợi ý. Gợi ý càng ít, điểm càng cao. Kỷ lục: ${S.best.who}</small></button>
   <button class="vh-mode" data-a="order"><span class="big">🧩</span><b>Sắp xếp sự kiện</b><small>Bấm các sự kiện theo đúng thứ tự thời gian. Kỷ lục: ${S.best.order}</small></button>
   <button class="vh-mode" data-a="arena"><span class="big">⚡</span><b>Đấu trường 60 giây</b><small>Trả lời thật nhanh nhiều câu hỏi, chuỗi đúng liên tiếp được thưởng thêm. Kỷ lục: ${S.best.arena}</small></button>
   <button class="vh-mode" data-a="collect"><span class="big">🎴</span><b>Bộ sưu tập di sản</b><small>Xem các thẻ bạn đã mở khóa.</small></button>
  </div>
  <div class="vh-row"><button class="vh-btn alt sm" data-a="reset">🗑️ Xóa tiến trình</button></div>`);
}
A.home=home;
A.reset=()=>{if(confirm('Xóa toàn bộ điểm và tiến trình?')){S=DEF();persist();home()}};

/* ===================== HÀNH TRÌNH ===================== */
const isOpen=i=>S.unlockAll||i===0||S.done[ERAS[i-1].id]!=null;
const needOf=e=>Math.ceil(e.qs.length*0.6);
function journey(){
  stopTimer();
  const n=ERAS.filter(e=>S.done[e.id]!=null).length;
  draw(`<h2 class="vh-h2">⏳ Hành trình thời gian</h2><p class="vh-sub">Đi qua ${ERAS.length} giai đoạn của lịch sử Việt Nam, từ thời dựng nước đến công cuộc Đổi mới. Mỗi màn có phần giới thiệu chi tiết và nhiều câu hỏi; trả lời đúng ít nhất 60% số câu để qua màn và mở khóa thẻ di sản. Đã hoàn thành: <b>${n}/${ERAS.length}</b>.</p>`+
  ERAS.map((e,i)=>{const o=isOpen(i),st=S.done[e.id]||0;
    return `<button class="vh-era ${o?'':'lock'}" data-a="${o?'era':'locked'}" data-i="${i}"><span class="vh-ico">${o?e.ic:'🔒'}</span><span class="vh-et"><b>Màn ${i+1}: ${e.n}</b><small>${e.y} · ${e.qs.length} câu hỏi</small></span><span class="vh-st">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span></button>`}).join('')+
  `<div class="vh-row"><button class="vh-btn alt sm" data-a="home">← Về trang chủ</button>${S.unlockAll?'':'<button class="vh-btn alt sm" data-a="unlock">🔓 Mở hết các màn (bản thử)</button>'}</div>`);
}
A.journey=journey;
A.locked=()=>toast('Hãy hoàn thành màn trước để mở khóa nhé!');
A.unlock=()=>{S.unlockAll=true;persist();journey()};

let Q=null;
A.era=d=>{
  const i=+d.i,e=ERAS[i];
  draw(`<div class="vh-center"><div class="vh-big">${e.ic}</div></div>
  <h2 class="vh-h2 vh-center">Màn ${i+1}: ${esc(e.n)}</h2><p class="vh-sub vh-center">${esc(e.y)}</p>
  <div class="vh-story">${e.story.map(p=>'<p>'+esc(p)+'</p>').join('')}</div>
  <div class="vh-facts"><b>📌 Những mốc cần nhớ</b>${e.facts.map(f=>'<div class="vh-fact"><span>'+esc(f[0])+'</span><span>'+esc(f[1])+'</span></div>').join('')}</div>
  <div class="vh-note">🎯 Thử thách gồm <b>${e.qs.length}</b> câu hỏi. Cần trả lời đúng ít nhất <b>${needOf(e)}</b> câu để qua màn.</div>
  <div class="vh-row"><button class="vh-btn" data-a="startq" data-i="${i}">Bắt đầu thử thách ▶</button><button class="vh-btn alt" data-a="journey">← Danh sách màn</button></div>`);
};
A.startq=d=>{const e=ERAS[+d.i];Q={e:+d.i,qs:shuffle(e.qs),n:0,right:0,opts:[],picked:null};qScreen()};
function qScreen(){
  const era=ERAS[Q.e],q=Q.qs[Q.n],tot=Q.qs.length;
  if(!Q.opts.length)Q.opts=shuffle(q.slice(1,5));
  const p=Q.picked;
  draw(`<div class="vh-prog"><i style="width:${(Q.n+(p!==null?1:0))/tot*100}%"></i></div>
  <small class="vh-sub">${esc(era.n)} · Câu ${Q.n+1}/${tot} · Đã đúng: ${Q.right}</small>
  <div class="vh-q">${esc(q[0])}</div>`+
  Q.opts.map((o,i)=>{let c='';if(p!==null){if(o===q[1])c='ok';else if(i===p)c='bad'}
    return `<button class="vh-opt ${c}" data-a="ans" data-i="${i}" ${p!==null?'disabled':''}>${esc(o)}</button>`}).join('')+
  (p!==null?`<div class="vh-note">${Q.opts[p]===q[1]?'✅ Chính xác! ':'❌ Chưa đúng. Đáp án: <b>'+esc(q[1])+'</b>. '}${esc(q[5])}</div>
  <button class="vh-btn" data-a="qnext">${Q.n+1<tot?'Câu tiếp theo ▶':'Xem kết quả ▶'}</button>`:''));
}
A.ans=d=>{if(Q.picked!==null)return;Q.picked=+d.i;const q=Q.qs[Q.n];if(Q.opts[Q.picked]===q[1]){Q.right++;addPts(10)}qScreen()};
A.qnext=()=>{Q.n++;Q.opts=[];Q.picked=null;if(Q.n>=Q.qs.length)return qEnd();qScreen()};
function qEnd(){
  const era=ERAS[Q.e],tot=Q.qs.length,need=needOf(era),pass=Q.right>=need,ratio=Q.right/tot;
  const stars=pass?(ratio>=.9?3:ratio>=.75?2:1):0;
  const first=pass&&S.done[era.id]==null;
  if(pass){S.done[era.id]=Math.max(S.done[era.id]||0,stars);if(first)S.pts+=20;persist();top()}
  draw(`<div class="vh-center"><div class="vh-big">${pass?'🎉':'💪'}</div>
  <h2 class="vh-h2">${pass?'Vượt ải thành công!':'Gần được rồi, thử lại nhé!'}</h2>
  <div class="vh-st" style="font-size:30px">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
  <p>Bạn trả lời đúng <b>${Q.right}/${tot}</b> câu${pass?'.':' (cần ít nhất '+need+' câu). Hãy đọc lại phần giới thiệu rồi thử lại.'}</p></div>`+
  (pass?`<div class="vh-cardx" style="max-width:260px;margin:10px auto"><div class="big">${era.card.ic}</div><b>${era.card.t}</b><small>${era.card.d}</small>${first?'<small style="color:#2e7d32">🎁 Thẻ mới! +20 điểm</small>':''}</div>`:'')+
  `<div class="vh-row" style="justify-content:center">
   <button class="vh-btn alt" data-a="startq" data-i="${Q.e}">↻ Chơi lại màn này</button>
   <button class="vh-btn alt" data-a="era" data-i="${Q.e}">📖 Đọc lại giới thiệu</button>
   ${pass&&Q.e+1<ERAS.length?`<button class="vh-btn" data-a="era" data-i="${Q.e+1}">Màn kế tiếp ▶</button>`:''}
   <button class="vh-btn alt" data-a="journey">Danh sách màn</button></div>`);
}

/* ===================== BỘ SƯU TẬP ===================== */
A.collect=()=>{stopTimer();
  draw(`<h2 class="vh-h2">🎴 Bộ sưu tập di sản</h2><p class="vh-sub">Mở khóa thẻ bằng cách vượt qua từng thời kỳ.</p><div class="vh-collect">`+
  ERAS.map(e=>{const on=S.done[e.id]!=null;
    return on?`<div class="vh-cardx"><div class="big">${e.card.ic}</div><b>${e.card.t}</b><small>${e.card.d}</small></div>`
    :`<div class="vh-cardx off"><div class="big">❓</div><b>Chưa mở khóa</b><small>${e.n}</small></div>`}).join('')+
  `</div><div class="vh-row"><button class="vh-btn alt" data-a="home">← Về trang chủ</button></div>`)};

/* ===================== AI LÀ AI ===================== */
let W=null;
A.who=()=>{stopTimer();W={rounds:shuffle(WHO).slice(0,5),r:0,pts:0,shown:1,picked:null,opts:[]};whoScreen()};
function whoScreen(){
  if(W.r>=W.rounds.length)return whoEnd();
  const c=W.rounds[W.r];
  if(!W.opts.length)W.opts=shuffle([c[0],...shuffle(WHO.filter(x=>x!==c).map(x=>x[0])).slice(0,3)]);
  const p=W.picked;
  draw(`<div class="vh-prog"><i style="width:${W.r/W.rounds.length*100}%"></i></div>
  <small class="vh-sub">Ai là ai? · Vòng ${W.r+1}/${W.rounds.length} · Điểm: ${W.pts}</small>
  <div class="vh-big">${p!==null?c[1]:'🕵️'}</div>`+
  [2,3,4].map((k,i)=>`<div class="vh-hint ${i<W.shown?'':'off'}">💡 Gợi ý ${i+1}: ${i<W.shown?esc(c[k]):'???'}</div>`).join('')+
  (p===null&&W.shown<3?`<button class="vh-btn alt sm" data-a="whint">Xem thêm gợi ý (−10 điểm)</button>`:'')+
  `<div class="vh-q">Nhân vật này là ai? <small class="vh-sub">(Đúng ngay: ${40-W.shown*10} điểm)</small></div>`+
  W.opts.map((o,i)=>{let cl='';if(p!==null){if(o===c[0])cl='ok';else if(i===p)cl='bad'}
    return `<button class="vh-opt ${cl}" data-a="wans" data-i="${i}" ${p!==null?'disabled':''}>${esc(o)}</button>`}).join('')+
  (p!==null?`<div class="vh-note">${W.opts[p]===c[0]?'✅ Chính xác! +'+(40-W.shown*10)+' điểm.':'❌ Đáp án đúng: <b>'+esc(c[0])+'</b>.'}</div><button class="vh-btn" data-a="wnext">Tiếp ▶</button>`:''));
}
A.whint=()=>{if(W.shown<3){W.shown++;whoScreen()}};
A.wans=d=>{if(W.picked!==null)return;W.picked=+d.i;const c=W.rounds[W.r];if(W.opts[W.picked]===c[0]){const g=40-W.shown*10;W.pts+=g;addPts(g)}whoScreen()};
A.wnext=()=>{W.r++;W.shown=1;W.picked=null;W.opts=[];whoScreen()};
function whoEnd(){
  const nb=W.pts>S.best.who;if(nb){S.best.who=W.pts;persist()}
  draw(`<div class="vh-center"><div class="vh-big">🕵️</div><h2 class="vh-h2">Kết thúc!</h2><p>Bạn được <b>${W.pts}</b> điểm (tối đa 150). ${nb?'🎉 Kỷ lục mới!':'Kỷ lục: '+S.best.who}</p></div>
  <div class="vh-row" style="justify-content:center"><button class="vh-btn" data-a="who">Chơi lại</button><button class="vh-btn alt" data-a="home">Trang chủ</button></div>`);
}

/* ===================== SẮP XẾP SỰ KIỆN ===================== */
let O=null;
A.order=()=>{stopTimer();O={sets:shuffle(ORD).slice(0,5),i:0,pts:0};orderSet()};
function orderSet(){
  if(O.i>=O.sets.length)return orderEnd();
  const set=O.sets[O.i].map(x=>({n:x[0],y:x[1]}));
  O.sorted=set.slice().sort((a,b)=>a.y-b.y);
  O.items=shuffle(set);O.next=0;O.mist=0;O.placed={};
  orderDraw();
}
function orderDraw(){
  const fin=O.next>=O.items.length;
  draw(`<div class="vh-prog"><i style="width:${O.i/O.sets.length*100}%"></i></div>
  <small class="vh-sub">Sắp xếp sự kiện · Bộ ${O.i+1}/${O.sets.length} · Điểm: ${O.pts}</small>
  <div class="vh-q">Bấm lần lượt các sự kiện theo thứ tự từ <u>sớm nhất → muộn nhất</u>.</div>`+
  O.items.map((it,k)=>{const r=O.placed[k];
    return `<button class="vh-ord ${r!==undefined?'done':''}" data-a="opick" data-k="${k}"><span class="num">${r!==undefined?r+1:'?'}</span><span>${esc(it.n)}</span>${r!==undefined?`<span class="yr">${it.y}</span>`:''}</button>`}).join('')+
  `<div class="vh-sub">Số lần sai: <b id="vh-mist">${O.mist}</b></div>`+
  (fin?`<div class="vh-note">🎉 Đúng thứ tự! +${Math.max(5,25-5*O.mist)} điểm.</div><button class="vh-btn" data-a="onext">${O.i+1<O.sets.length?'Bộ tiếp theo ▶':'Xem kết quả ▶'}</button>`:''));
}
A.opick=(d,t)=>{
  const k=+d.k;if(O.placed[k]!==undefined)return;
  if(O.sorted.indexOf(O.items[k])===O.next){O.placed[k]=O.next;O.next++;
    if(O.next>=O.items.length){const g=Math.max(5,25-5*O.mist);O.pts+=g;addPts(g)}
    orderDraw();
  }else{O.mist++;const m=document.getElementById('vh-mist');if(m)m.textContent=O.mist;t.classList.add('vh-shake');setTimeout(()=>t.classList.remove('vh-shake'),350)}
};
A.onext=()=>{O.i++;orderSet()};
function orderEnd(){
  const nb=O.pts>S.best.order;if(nb){S.best.order=O.pts;persist()}
  draw(`<div class="vh-center"><div class="vh-big">🧩</div><h2 class="vh-h2">Hoàn thành!</h2><p>Bạn được <b>${O.pts}</b> điểm (tối đa 125). ${nb?'🎉 Kỷ lục mới!':'Kỷ lục: '+S.best.order}</p></div>
  <div class="vh-row" style="justify-content:center"><button class="vh-btn" data-a="order">Chơi lại</button><button class="vh-btn alt" data-a="home">Trang chủ</button></div>`);
}

/* ===================== ĐẤU TRƯỜNG 60 GIÂY ===================== */
let AR=null;
A.arena=()=>{stopTimer();
  const all=[];ERAS.forEach(e=>e.qs.forEach(q=>all.push(q)));
  AR={queue:shuffle(all),k:0,score:0,streak:0,ok:0,bad:0,t0:Date.now(),over:false,lock:false,picked:null,opts:[]};
  AR.opts=shuffle(AR.queue[0].slice(1,5));
  arenaDraw();
  timer=setInterval(()=>{
    const left=Math.max(0,60-(Date.now()-AR.t0)/1000);
    const el=document.getElementById('vh-time');if(el)el.textContent=Math.ceil(left)+'s';
    const bar=document.getElementById('vh-bar');if(bar)bar.style.width=(left/60*100)+'%';
    if(left<=0)arenaEnd();
  },200);
};
function arenaDraw(){
  const q=AR.queue[AR.k%AR.queue.length],p=AR.picked;
  draw(`<div class="vh-row" style="justify-content:space-between;margin:0 0 8px"><span class="vh-timer" id="vh-time">60s</span><span>Điểm: <b>${AR.score}</b> · Chuỗi đúng: <b>${AR.streak}</b>${AR.streak>=3?' 🔥':''}</span></div>
  <div class="vh-prog"><i id="vh-bar" style="width:100%"></i></div>
  <div class="vh-q">${esc(q[0])}</div>`+
  AR.opts.map((o,i)=>{let c='';if(p!==null){if(o===q[1])c='ok';else if(i===p)c='bad'}
    return `<button class="vh-opt ${c}" data-a="aans" data-i="${i}" ${p!==null?'disabled':''}>${esc(o)}</button>`}).join(''));
}
A.aans=d=>{
  if(AR.over||AR.lock)return;AR.lock=true;AR.picked=+d.i;
  const q=AR.queue[AR.k%AR.queue.length];
  if(AR.opts[AR.picked]===q[1]){AR.ok++;AR.streak++;AR.score+=10+(AR.streak>=3?5:0)}else{AR.bad++;AR.streak=0}
  arenaDraw();
  setTimeout(()=>{if(AR.over)return;AR.k++;AR.picked=null;AR.lock=false;AR.opts=shuffle(AR.queue[AR.k%AR.queue.length].slice(1,5));arenaDraw()},650);
};
function arenaEnd(){
  if(AR.over)return;AR.over=true;stopTimer();
  addPts(AR.score);
  const nb=AR.score>S.best.arena;if(nb){S.best.arena=AR.score;persist()}
  draw(`<div class="vh-center"><div class="vh-big">⚡</div><h2 class="vh-h2">Hết giờ!</h2>
  <p>Đúng <b>${AR.ok}</b> câu · Sai <b>${AR.bad}</b> câu</p><p style="font-size:24px">Điểm: <b>${AR.score}</b> ${nb?'🎉 Kỷ lục mới!':'(kỷ lục: '+S.best.arena+')'}</p></div>
  <div class="vh-row" style="justify-content:center"><button class="vh-btn" data-a="arena">Chơi lại</button><button class="vh-btn alt" data-a="home">Trang chủ</button></div>`);
}

home();
})();
