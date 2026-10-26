/* 6PAY - Game Khám phá Việt Nam. File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
 var st=document.createElement("style");st.textContent="#vnv-root{--bg:#eaf6f3;--paper:#ffffff;--ink:#12302e;--muted:#5b7a76;--main:#0f766e;--gold:#e0a21b;--line:#cfe5e0;--ok:#2e7d32;--bad:#c62828;\n  font-family:\"Segoe UI\",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg);border:2px solid var(--line);border-radius:18px;max-width:900px;margin:0 auto;overflow:hidden;position:relative;line-height:1.5}\n#vnv-root *{box-sizing:border-box}\n#vnv-root button{font:inherit;color:inherit;cursor:pointer}\n.vv-top{display:flex;align-items:center;gap:8px;padding:12px 16px;background:linear-gradient(90deg,#0b4f4a,#0f766e);color:#fff;flex-wrap:wrap}\n.vv-top h1{font-size:18px;margin:0;flex:1;cursor:pointer;min-width:180px}\n.vv-chip{background:rgba(255,255,255,.18);padding:4px 10px;border-radius:99px;font-size:13px;white-space:nowrap}\n.vv-main{padding:18px;min-height:420px}\n.vv-h2{font-size:22px;margin:0 0 6px}\n.vv-sub{color:var(--muted);margin:0 0 14px}\n.vv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\n.vv-mode{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:16px;text-align:left;transition:.15s}\n.vv-mode:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(10,80,70,.18);border-color:var(--main)}\n.vv-mode .big{font-size:34px;display:block}\n.vv-mode b{display:block;font-size:17px;margin:4px 0 2px}\n.vv-mode small{color:var(--muted)}\n.vv-btn{background:var(--main);color:#fff!important;border:0;border-radius:10px;padding:10px 18px;font-weight:600}\n.vv-btn:hover{filter:brightness(1.12)}\n.vv-btn.alt{background:#fff;color:var(--ink)!important;border:1px solid var(--line)}\n.vv-btn.sm{padding:6px 12px;font-size:13px}\n.vv-btn[disabled]{opacity:.45;cursor:not-allowed}\n.vv-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}\n.vv-mapwrap{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}\n.vv-map{flex:0 0 auto;width:100%;max-width:400px;margin:0 auto;background:linear-gradient(#cfeaf5,#e6f5fb);border-radius:14px;border:1px solid var(--line)}\n.vv-side{flex:1;min-width:220px}\n.vv-node{cursor:pointer}\n.vv-node:hover circle.c{stroke:#000;stroke-width:2}\n.vv-q{font-size:19px;font-weight:600;margin:10px 0 14px}\n.vv-opt{display:block;width:100%;text-align:left;background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:11px 14px;margin-bottom:9px}\n.vv-opt:hover:not([disabled]){border-color:var(--main)}\n.vv-opt.ok{background:#e6f4e7;border-color:var(--ok)}\n.vv-opt.bad{background:#fde7e7;border-color:var(--bad)}\n.vv-opt[disabled]{cursor:default}\n.vv-note{background:#e3f6f1;border-radius:10px;padding:10px 14px;margin:10px 0}\n.vv-story{background:var(--paper);border-left:5px solid var(--main);border-radius:10px;padding:14px 16px;margin:10px 0}\n.vv-prog{height:8px;background:var(--line);border-radius:9px;overflow:hidden;margin-bottom:6px}\n.vv-prog i{display:block;height:100%;background:var(--main);transition:width .2s}\n.vv-big{font-size:56px;text-align:center}\n.vv-center{text-align:center}\n.vv-stamps{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}\n.vv-stamp{background:var(--paper);border:3px double var(--main);border-radius:14px;padding:12px;text-align:center}\n.vv-stamp .big{font-size:36px}\n.vv-stamp small{display:block;color:var(--muted)}\n.vv-stamp.off{border-style:dashed;border-color:var(--line);opacity:.55}\n.vv-pic{font-size:110px;text-align:center;padding:14px;background:var(--paper);border:1px solid var(--line);border-radius:14px;margin-bottom:10px;overflow:hidden;transition:filter .2s}\n.vv-hint{background:var(--paper);border:1px dashed var(--gold);border-radius:10px;padding:8px 12px;margin-bottom:8px}\n.vv-hint.off{opacity:.45}\n.vv-food{font-size:64px;text-align:center}\n.vv-regs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}\n.vv-reg{background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:14px 6px;font-weight:700}\n.vv-reg:hover:not([disabled]){border-color:var(--main)}\n.vv-reg.ok{background:#e6f4e7;border-color:var(--ok)}\n.vv-reg.bad{background:#fde7e7;border-color:var(--bad)}\n.vv-act{display:flex;align-items:center;gap:10px;width:100%;background:var(--paper);border:2px solid var(--line);border-radius:12px;padding:10px 12px;margin-bottom:8px;text-align:left}\n.vv-act:hover:not([disabled]){border-color:var(--main)}\n.vv-act.sel{background:#e3f6f1;border-color:var(--main)}\n.vv-act[disabled]:not(.sel){opacity:.4}\n.vv-act .ic{font-size:24px}\n.vv-act .tx{flex:1}.vv-act .tx small{display:block;color:var(--muted)}\n.vv-act .jy{color:var(--gold);font-weight:700;white-space:nowrap}\n.vv-meter{display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 12px}\n.vv-meter span{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:6px 12px;font-weight:600}\n.vv-meter .over{color:var(--bad)}\n.vv-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);background:#12302e;color:#fff;padding:8px 16px;border-radius:99px;font-size:14px;z-index:5}\n@media(max-width:560px){.vv-main{padding:12px}.vv-q{font-size:17px}.vv-pic{font-size:80px}}\n";document.head.appendChild(st);
 var d=document.createElement("div");d.innerHTML="<div class=\"gm-ov\" id=\"vnvOv\"><div class=\"gm-bar\"><button class=\"gm-x\" onclick=\"GameOv.back('vnv')\">← Quay lại</button><button class=\"gm-x\" onclick=\"GameOv.close('vnv')\">✕ Đóng</button></div><div class=\"gm-body\"><div id=\"vnv-root\"></div></div></div>";while(d.firstChild)document.body.appendChild(d.firstChild);
})();
(function(){
'use strict';
const KEY='vnv_travel_v1';
const root=document.getElementById('vnv-root');
const DEF=()=>({stamps:{},pts:0,best:{guess:0,food:0,trip:0}});
let S=DEF();
try{const x=JSON.parse(localStorage.getItem(KEY));if(x)S=Object.assign(DEF(),x)}catch(e){}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const LKOPEN=()=>!window.SixLock||window.SixLock.isOpen();
const LKASK=(ok,no)=>{if(window.SixLock)window.SixLock.ask(ok,no);else if(ok)ok()};
const LKFREE=n=>Math.ceil(n/3);
const SFX=k=>{try{if(window.sfx)window.sfx(k)}catch(e){}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const vnd=k=>(k*1000).toLocaleString('vi-VN')+'đ';

/* ===================== DỮ LIỆU ===================== */
/* Câu hỏi: [câu hỏi, ĐÁP ÁN ĐÚNG, sai1, sai2, sai3, giải thích] */
/* x,y: toạ độ trên bản đồ minh hoạ; a: 'l' (nhãn bên trái) | 'r' (bên phải) | 'b' (bên dưới) */
/* 34 tỉnh, thành phố sau sáp nhập (đánh số 1-34 từ Bắc xuống Nam). x,y: vị trí số trên bản đồ. Thêm nội dung cho từng nơi bằng intro, tip, qs: [câu hỏi, ĐÁP ÁN ĐÚNG, sai1, sai2, sai3, giải thích] */
const STOPS=[
{id:'p1',n:'Lai Châu',s:'Lai Châu',ic:'📍',x:94.5,y:91.0,intro:'',tip:'',qs:[]},
{id:'p2',n:'Điện Biên',s:'Điện Biên',ic:'📍',x:82.5,y:127.3,intro:'',tip:'',qs:[]},
{id:'p3',n:'Lào Cai',s:'Lào Cai',ic:'📍',x:131.2,y:108.3,intro:'',tip:'',qs:[]},
{id:'p4',n:'Tuyên Quang',s:'Tuyên Quang',ic:'📍',x:176.5,y:85.3,intro:'',tip:'',qs:[]},
{id:'p5',n:'Cao Bằng',s:'Cao Bằng',ic:'📍',x:239.7,y:79.3,intro:'',tip:'',qs:[]},
{id:'p6',n:'Thái Nguyên',s:'Thái Nguyên',ic:'📍',x:223.8,y:98.3,intro:'',tip:'',qs:[]},
{id:'p7',n:'Lạng Sơn',s:'Lạng Sơn',ic:'📍',x:246.8,y:119.3,intro:'',tip:'',qs:[]},
{id:'p8',n:'Quảng Ninh',s:'Quảng Ninh',ic:'📍',x:290.0,y:144.7,intro:'',tip:'',qs:[]},
{id:'p9',n:'Bắc Ninh',s:'Bắc Ninh',ic:'📍',x:252.8,y:147.5,intro:'',tip:'',qs:[]},
{id:'p10',n:'Phú Thọ',s:'Phú Thọ',ic:'📍',x:178.5,y:150.8,intro:'',tip:'',qs:[]},
{id:'p11',n:'Sơn La',s:'Sơn La',ic:'📍',x:116.3,y:151.5,intro:'',tip:'',qs:[]},
{id:'p12',n:'TP Hà Nội',s:'TP Hà Nội',ic:'📍',x:205.5,y:170.3,intro:'',tip:'',qs:[]},
{id:'p13',n:'TP Hải Phòng',s:'TP Hải Phòng',ic:'📍',x:252.5,y:172.7,intro:'',tip:'',qs:[]},
{id:'p14',n:'Hưng Yên',s:'Hưng Yên',ic:'📍',x:238.0,y:189.2,intro:'',tip:'',qs:[]},
{id:'p15',n:'Ninh Bình',s:'Ninh Bình',ic:'📍',x:221.3,y:199.2,intro:'',tip:'',qs:[]},
{id:'p16',n:'Thanh Hóa',s:'Thanh Hóa',ic:'📍',x:198.7,y:222.0,intro:'',tip:'',qs:[]},
{id:'p17',n:'Nghệ An',s:'Nghệ An',ic:'📍',x:165.5,y:256.5,intro:'',tip:'',qs:[]},
{id:'p18',n:'Hà Tĩnh',s:'Hà Tĩnh',ic:'📍',x:203.7,y:307.0,intro:'',tip:'',qs:[]},
{id:'p19',n:'Quảng Trị',s:'Quảng Trị',ic:'📍',x:260.2,y:382.8,intro:'',tip:'',qs:[]},
{id:'p20',n:'TP Huế',s:'TP Huế',ic:'📍',x:290.5,y:406.8,intro:'',tip:'',qs:[]},
{id:'p21',n:'TP Đà Nẵng',s:'TP Đà Nẵng',ic:'📍',x:319.2,y:442.7,intro:'',tip:'',qs:[]},
{id:'p22',n:'Quảng Ngãi',s:'Quảng Ngãi',ic:'📍',x:311.2,y:492.0,intro:'',tip:'',qs:[]},
{id:'p23',n:'Gia Lai',s:'Gia Lai',ic:'📍',x:339.0,y:533.2,intro:'',tip:'',qs:[]},
{id:'p24',n:'Đắk Lắk',s:'Đắk Lắk',ic:'📍',x:332.2,y:592.0,intro:'',tip:'',qs:[]},
{id:'p25',n:'Khánh Hòa',s:'Khánh Hòa',ic:'📍',x:361.8,y:638.8,intro:'',tip:'',qs:[]},
{id:'p26',n:'Lâm Đồng',s:'Lâm Đồng',ic:'📍',x:317.8,y:646.5,intro:'',tip:'',qs:[]},
{id:'p27',n:'Đồng Nai',s:'Đồng Nai',ic:'📍',x:258.3,y:637.8,intro:'',tip:'',qs:[]},
{id:'p28',n:'TP.HCM',s:'TP.HCM',ic:'📍',x:246.5,y:670.5,intro:'',tip:'',qs:[]},
{id:'p29',n:'Tây Ninh',s:'Tây Ninh',ic:'📍',x:220.7,y:649.2,intro:'',tip:'',qs:[]},
{id:'p30',n:'Đồng Tháp',s:'Đồng Tháp',ic:'📍',x:198.0,y:708.7,intro:'',tip:'',qs:[]},
{id:'p31',n:'An Giang',s:'An Giang',ic:'📍',x:165.2,y:706.7,intro:'',tip:'',qs:[]},
{id:'p32',n:'Vĩnh Long',s:'Vĩnh Long',ic:'📍',x:229.7,y:725.8,intro:'',tip:'',qs:[]},
{id:'p33',n:'TP Cần Thơ',s:'TP Cần Thơ',ic:'📍',x:202.0,y:741.7,intro:'',tip:'',qs:[]},
{id:'p34',n:'Cà Mau',s:'Cà Mau',ic:'📍',x:167.5,y:770.3,intro:'',tip:'',qs:[]}
];


/* ===== THÔNG TIN CHI TIẾT 34 TỈNH, THÀNH =====
   Nguồn: Nghị quyết 202/2025/QH15 (sắp xếp đơn vị hành chính cấp tỉnh) và các nghị quyết sắp xếp đơn vị cấp xã năm 2025.
   Diện tích (km²), dân số (nghìn người, ước tính cuối 2024) mang tính tham khảo.
   Muốn sửa nội dung một tỉnh: tìm dòng P('pN', ...) tương ứng bên dưới.
   Thứ tự tham số: id, f (các tỉnh đã sáp nhập, để [] nếu giữ nguyên), trung tâm hành chính, đơn vị cấp xã, diện tích, dân số (nghìn),
   quốc lộ/cao tốc, sông hồ vịnh, 1 sông/hồ tiêu biểu (dùng cho câu hỏi), 4 địa danh nổi tiếng, danh sách điểm nổi bật, mẹo du lịch. */
const PI={};
function P(id,f,tt,hc,dt,dn,ql,song,sk,pl,nb,tip){PI[id]={f:f,tt:tt,hc:hc,dt:dt,dn:dn,ql:ql,song:song,sk:sk,pl:pl,nb:nb,tip:tip};}

P('p1',[],'Khu vực thành phố Lai Châu','38 xã, phường (36 xã và 2 phường)',9068.7,460,
 'QL4D, QL12, QL32','Sông Đà, sông Nậm Na; hồ thủy điện Lai Châu','Sông Nậm Na',
 ['Đèo Ô Quy Hồ','Cao nguyên Sìn Hồ','Đỉnh Putaleng','Thác Tác Tình'],
 ['Tỉnh cực Tây Bắc, có đường biên giới với Trung Quốc.','Có đỉnh Putaleng cao khoảng 3.049 m và đèo Ô Quy Hồ nối sang Lào Cai.','Nhiều dân tộc cùng sinh sống như Thái, Mông, Dao, Hà Nhì...','Có nhà máy thủy điện Lai Châu trên sông Đà.'],
 'Nên đi vào mùa xuân để ngắm hoa ban, hoa đào; đường đèo nhiều nên cần lái xe cẩn thận.');

P('p2',[],'Thành phố Điện Biên Phủ','45 xã, phường (42 xã và 3 phường)',9539.9,674,
 'QL12, QL6, QL279','Sông Nậm Rốm, sông Đà, đầu nguồn sông Mã; hồ Pá Khoang','Hồ Pá Khoang',
 ['Đồi A1','Hầm Đờ Cát','Cánh đồng Mường Thanh','Cửa khẩu Tây Trang'],
 ['Nơi diễn ra chiến dịch Điện Biên Phủ (13/3 – 7/5/1954), kết thúc cuộc kháng chiến chống Pháp.','Có cánh đồng Mường Thanh, một trong những cánh đồng lớn nhất vùng Tây Bắc.','Có biên giới với Lào và Trung Quốc; cửa khẩu quốc tế Tây Trang thông sang Lào.','Có nhiều di tích: đồi A1, hầm Đờ Cát-xtơ-ri, Bảo tàng Chiến thắng Điện Biên Phủ.'],
 'Nên tham quan đồi A1, hầm Đờ Cát và Bảo tàng Chiến thắng Điện Biên Phủ.');

P('p3',['Yên Bái','Lào Cai'],'Khu vực thành phố Yên Bái (cũ)','99 xã, phường (89 xã và 10 phường)',13256.9,1779,
 'Cao tốc Nội Bài – Lào Cai, QL70, QL4E, QL37, QL32','Sông Hồng, sông Chảy, sông Nậm Thi; hồ Thác Bà','Hồ Thác Bà',
 ['Đỉnh Fansipan','Ruộng bậc thang Mù Cang Chải','Bản Cát Cát (Sa Pa)','Chợ phiên Bắc Hà'],
 ['Có đỉnh Fansipan cao khoảng 3.143 m, được gọi là “nóc nhà Đông Dương”.','Ruộng bậc thang Mù Cang Chải là Di tích quốc gia đặc biệt.','Có cửa khẩu quốc tế Lào Cai thông sang Trung Quốc.','Hồ Thác Bà là hồ nhân tạo lớn ở vùng Tây Bắc, nổi tiếng với hàng nghìn đảo nhỏ.'],
 'Mùa lúa chín (tháng 9 – 10) và mùa mây, sương là dịp đẹp để lên Sa Pa, Mù Cang Chải.');

P('p4',['Hà Giang','Tuyên Quang'],'Khu vực thành phố Tuyên Quang','124 xã, phường (117 xã và 7 phường)',13795.6,1865,
 'QL2, QL2C, QL37, QL34, QL4C','Sông Lô, sông Gâm, sông Phó Đáy, sông Miện; hồ Na Hang','Hồ Na Hang',
 ['Cột cờ Lũng Cú','Cao nguyên đá Đồng Văn','Khu di tích Tân Trào','Hồ Na Hang'],
 ['Cao nguyên đá Đồng Văn là Công viên địa chất toàn cầu của UNESCO.','Cột cờ Lũng Cú ở vùng địa đầu cực Bắc của Tổ quốc.','Tân Trào là thủ đô khu giải phóng, nơi họp Quốc dân Đại hội tháng 8/1945.','Có hồ Na Hang – Lâm Bình và thủy điện Tuyên Quang trên sông Gâm.'],
 'Mùa hoa tam giác mạch (tháng 10 – 11) ở Hà Giang rất đẹp; đường đèo cần lái xe cẩn thận.');

P('p5',[],'Thành phố Cao Bằng','56 xã, phường (53 xã và 3 phường)',6700.4,573,
 'QL3, QL4A, QL34, QL4C','Sông Bằng Giang, sông Quây Sơn, sông Gâm; hồ Thang Hen','Sông Bằng Giang',
 ['Thác Bản Giốc','Động Ngườm Ngao','Khu di tích Pác Bó','Hồ Thang Hen'],
 ['Thác Bản Giốc là một trong những thác nước đẹp nhất nằm trên đường biên giới quốc gia.','Có Công viên địa chất toàn cầu UNESCO Non nước Cao Bằng.','Pác Bó là nơi Chủ tịch Hồ Chí Minh trở về nước năm 1941, có suối Lê-nin và núi Các Mác.','Có đường biên giới dài với Trung Quốc.'],
 'Thác Bản Giốc nhiều nước và đẹp hơn vào mùa mưa; mùa đông nên mang áo ấm.');

P('p6',['Bắc Kạn','Thái Nguyên'],'Thành phố Thái Nguyên','92 xã, phường (77 xã và 15 phường)',8375.2,1799,
 'QL3, QL3B, QL37, QL1B, QL279; cao tốc Hà Nội – Thái Nguyên','Sông Cầu, sông Công; hồ Núi Cốc, hồ Ba Bể','Hồ Núi Cốc',
 ['Chè Tân Cương','ATK Định Hóa','Hồ Ba Bể','Bảo tàng Văn hóa các dân tộc Việt Nam'],
 ['Nổi tiếng với chè Tân Cương, được xem là thủ phủ chè của miền Bắc.','Hồ Ba Bể là hồ nước ngọt tự nhiên lớn nhất Việt Nam, thuộc Vườn quốc gia Ba Bể, khu Ramsar.','ATK Định Hóa là an toàn khu của cách mạng thời kháng chiến chống Pháp.','Là trung tâm công nghiệp lớn của miền Bắc, có khu công nghiệp Yên Bình (Phổ Yên).'],
 'Ghé đồi chè Tân Cương và thưởng thức trà mới vào mùa xuân.');

P('p7',[],'Thành phố Lạng Sơn','65 xã, phường (61 xã và 4 phường)',8310.2,881,
 'QL1A, QL1B, QL4A, QL4B, QL31, QL279; cao tốc Bắc Giang – Lạng Sơn','Sông Kỳ Cùng, sông Thương','Sông Kỳ Cùng',
 ['Cửa khẩu Hữu Nghị','Động Tam Thanh','Núi Mẫu Sơn','Ải Chi Lăng'],
 ['Có cửa khẩu quốc tế Hữu Nghị và ga Đồng Đăng, cửa ngõ sang Trung Quốc.','Sông Kỳ Cùng là con sông lớn chảy ngược về phía Bắc.','Núi Mẫu Sơn cao khoảng 1.541 m, mùa đông có thể có sương muối, băng giá.','Ải Chi Lăng là nơi diễn ra trận đánh lịch sử năm 1427; có Công viên địa chất toàn cầu UNESCO Lạng Sơn.'],
 'Nên thưởng thức vịt quay, bánh cuốn Lạng Sơn ở khu chợ Đông Kinh – Kỳ Lừa.');

P('p8',[],'Thành phố Hạ Long','54 xã, phường, đặc khu (30 phường, 22 xã, 2 đặc khu Vân Đồn và Cô Tô)',6207.9,1497,
 'QL18, QL10, QL4B, QL18C; cao tốc Hạ Long – Hải Phòng, Hạ Long – Vân Đồn – Móng Cái','Sông Ka Long, sông Bạch Đằng, sông Đá Bạc, sông Tiên Yên; vịnh Hạ Long, vịnh Bái Tử Long','Vịnh Bái Tử Long',
 ['Vịnh Hạ Long','Đảo Tuần Châu','Đảo Cô Tô','Cửa khẩu Móng Cái'],
 ['Vịnh Hạ Long là Di sản thiên nhiên thế giới của UNESCO.','Yên Tử là trung tâm của Thiền phái Trúc Lâm do vua Trần Nhân Tông sáng lập.','Có vùng than Hòn Gai – Cẩm Phả, cảng hàng không quốc tế Vân Đồn.','Móng Cái là cửa khẩu lớn với Trung Quốc.'],
 'Nên đặt trước tour du thuyền Vịnh Hạ Long vào mùa hè và dịp lễ.');

P('p9',['Bắc Giang','Bắc Ninh'],'Khu vực thành phố Bắc Giang','99 xã, phường (66 xã và 33 phường)',4718.6,3619,
 'QL1A, QL17, QL18, QL31, QL37, QL38','Sông Cầu, sông Đuống, sông Thái Bình, sông Thương, sông Lục Nam; hồ Cấm Sơn','Hồ Cấm Sơn',
 ['Đền Đô','Chùa Bút Tháp','Làng tranh Đông Hồ','Chùa Vĩnh Nghiêm'],
 ['Dân ca quan họ Bắc Ninh là Di sản văn hóa phi vật thể đại diện của nhân loại (UNESCO 2009).','Có tranh dân gian Đông Hồ và đền Đô thờ các vua nhà Lý.','Là trung tâm công nghiệp điện tử lớn của cả nước.','Bắc Giang (cũ) nổi tiếng với vải thiều Lục Ngạn và chùa Vĩnh Nghiêm.'],
 'Hội Lim (ngày 13 tháng Giêng âm lịch) là dịp nghe hát quan họ truyền thống.');

P('p10',['Hòa Bình','Vĩnh Phúc','Phú Thọ'],'Thành phố Việt Trì','148 xã, phường (133 xã và 15 phường)',9361.4,4022,
 'QL2, QL32, QL6, QL2C, QL21, QL12B; cao tốc Nội Bài – Lào Cai','Sông Hồng, sông Lô, sông Đà, sông Cà Lồ; hồ Hòa Bình, hồ Đại Lải, đầm Vạc','Ngã ba sông Bạch Hạc',
 ['Đền Hùng','Thị trấn Tam Đảo','Hồ Hòa Bình','Thung lũng Mai Châu'],
 ['Đền Hùng là nơi thờ các vua Hùng; Giỗ Tổ vào ngày 10 tháng 3 âm lịch.','Tín ngưỡng thờ cúng Hùng Vương và Hát Xoan Phú Thọ là di sản UNESCO.','Thủy điện Hòa Bình trên sông Đà tạo nên hồ Hòa Bình rộng lớn.','Gồm các vùng Việt Trì, Vĩnh Yên, Hòa Bình với nhiều nghề truyền thống và du lịch nghỉ dưỡng.'],
 'Giỗ Tổ Hùng Vương vào ngày 10 tháng 3 âm lịch hằng năm là dịp hành hương lớn nhất.');

P('p11',[],'Thành phố Sơn La','75 xã, phường (67 xã và 8 phường)',14109.8,1404,
 'QL6, QL37, QL43, QL4G','Sông Đà, sông Mã, sông Nậm La; hồ thủy điện Sơn La','Hồ thủy điện Sơn La',
 ['Cao nguyên Mộc Châu','Nhà tù Sơn La','Đỉnh Tà Xùa','Thác Dải Yếm'],
 ['Thủy điện Sơn La có công suất 2.400 MW, thuộc loại lớn nhất Việt Nam.','Cao nguyên Mộc Châu nổi tiếng với chè, sữa bò, hoa mận, hoa đào.','Nhà tù Sơn La là di tích quốc gia đặc biệt.','Xòe Thái được UNESCO ghi danh là di sản văn hóa phi vật thể (2021).'],
 'Mùa hoa mận, hoa đào (tháng 1 – 2) ở Mộc Châu rất đẹp.');

P('p12',[],'Thủ đô Hà Nội','126 xã, phường (51 phường và 75 xã)',3359.8,8719,
 'QL1A, QL2, QL3, QL5, QL6, QL32, QL21; cao tốc Pháp Vân – Cầu Giẽ, Nội Bài – Lào Cai, Hà Nội – Hải Phòng, Hà Nội – Thái Nguyên; vành đai 3','Sông Hồng, sông Đuống, sông Đáy, sông Nhuệ, sông Tô Lịch; Hồ Tây, hồ Hoàn Kiếm, hồ Đồng Mô, hồ Suối Hai','Hồ Tây',
 ['Hồ Hoàn Kiếm','Văn Miếu – Quốc Tử Giám','Hoàng thành Thăng Long','Làng gốm Bát Tràng'],
 ['Thủ đô của nước Việt Nam, kinh đô Thăng Long từ năm 1010.','Khu di tích Hoàng thành Thăng Long là Di sản văn hóa thế giới (UNESCO 2010).','Có Văn Miếu – Quốc Tử Giám, khu phố cổ 36 phố phường, hồ Gươm.','Có nhiều làng nghề: gốm Bát Tràng, lụa Vạn Phúc...; điểm du lịch Chùa Hương, núi Ba Vì.'],
 'Mùa thu Hà Nội (tháng 9 – 11) có tiết trời dễ chịu, hợp để dạo phố cổ.');

P('p13',['Hải Dương','Hải Phòng'],'Khu vực thành phố Hải Phòng','114 xã, phường, đặc khu (45 phường, 67 xã, 2 đặc khu Cát Hải và Bạch Long Vĩ)',3194.7,4664,
 'QL5, QL10, QL37, QL38, QL17B; cao tốc Hà Nội – Hải Phòng, Hải Phòng – Hạ Long','Sông Cấm, sông Lạch Tray, sông Bạch Đằng, sông Văn Úc, sông Thái Bình, sông Kinh Thầy','Sông Cấm',
 ['Đảo Cát Bà','Bán đảo Đồ Sơn','Khu di tích Côn Sơn – Kiếp Bạc','Đảo Bạch Long Vĩ'],
 ['Có cảng biển lớn nhất miền Bắc, gồm cảng nước sâu Lạch Huyện.','Vịnh Hạ Long – quần đảo Cát Bà là Di sản thiên nhiên thế giới (UNESCO).','Hải Dương (cũ) có khu di tích Côn Sơn – Kiếp Bạc và nổi tiếng với bánh đậu xanh.','Bạch Long Vĩ là đảo giữa vịnh Bắc Bộ.'],
 'Mùa hè nên đi biển Đồ Sơn, Cát Bà; thử bánh đa cua, nem cua bể Hải Phòng.');

P('p14',['Thái Bình','Hưng Yên'],'Khu vực thành phố Hưng Yên','104 xã, phường (93 xã và 11 phường)',2514.8,3567,
 'QL5, QL10, QL37, QL38, QL39','Sông Hồng, sông Luộc, sông Trà Lý, sông Hóa, sông Thái Bình; hồ Bán Nguyệt, đầm Dạ Trạch','Sông Trà Lý',
 ['Phố Hiến','Chùa Keo','Biển Đồng Châu','Văn miếu Xích Đằng'],
 ['Là tỉnh có diện tích nhỏ nhất cả nước sau sáp nhập (khoảng 2.514 km²).','Phố Hiến xưa từng là thương cảng sầm uất: “Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến”.','Nổi tiếng với nhãn lồng Hưng Yên; Thái Bình (cũ) là vựa lúa lớn của đồng bằng Bắc Bộ.','Có chùa Keo, biển Đồng Châu và cửa Ba Lạt (cửa sông Hồng ra biển).'],
 'Mùa nhãn chín (khoảng tháng 8) nên ghé Phố Hiến để thưởng thức nhãn lồng.');

P('p15',['Hà Nam','Nam Định','Ninh Bình'],'Thành phố Ninh Bình','129 xã, phường (97 xã và 32 phường)',3942.6,4412,
 'QL1A, QL10, QL21, QL38B; cao tốc Pháp Vân – Cầu Giẽ – Ninh Bình, Cao Bồ – Mai Sơn, Ninh Bình – Hải Phòng','Sông Đáy, sông Hoàng Long, sông Vân, sông Châu Giang, sông Ninh Cơ, sông Hồng','Sông Hoàng Long',
 ['Quần thể Tràng An','Cố đô Hoa Lư','Nhà thờ đá Phát Diệm','Đền Trần (Nam Định)'],
 ['Quần thể danh thắng Tràng An là Di sản thế giới hỗn hợp (UNESCO 2014).','Hoa Lư là kinh đô của nhà Đinh, nhà Tiền Lê; có chùa Bái Đính, Tam Cốc – Bích Động.','Vườn quốc gia Cúc Phương là vườn quốc gia đầu tiên của Việt Nam (1962).','Nam Định (cũ) có Phủ Dầy, đền Trần; Hà Nam (cũ) có chùa Tam Chúc.'],
 'Đi thuyền Tràng An, Tam Cốc vào mùa lúa chín (tháng 5 – 6) rất đẹp.');

P('p16',[],'Thành phố Thanh Hóa','166 xã, phường (147 xã và 19 phường)',11114.7,4324,
 'QL1A, QL45, QL47, QL217, QL15C; cao tốc Bắc – Nam phía Đông','Sông Mã, sông Chu, sông Bưởi, sông Yên, sông Lèn; hồ Cửa Đạt, hồ Sông Mực','Hồ Cửa Đạt',
 ['Thành Nhà Hồ','Biển Sầm Sơn','Di tích Lam Kinh','Khu bảo tồn Pù Luông'],
 ['Thành Nhà Hồ là Di sản văn hóa thế giới (UNESCO 2011).','Có di tích Lam Kinh (quê hương nhà Lê), trống đồng Đông Sơn, hang Con Moong.','Có biển Sầm Sơn, suối cá thần Cẩm Lương và khu bảo tồn Pù Luông.','Là tỉnh có nhiều đơn vị cấp xã nhất cả nước (166); Nghi Sơn là khu kinh tế lớn.'],
 'Mùa hè đi biển Sầm Sơn; ghé Thành Nhà Hồ vào mùa khô để tham quan thuận lợi.');

P('p17',[],'Thành phố Vinh','130 xã, phường (119 xã và 11 phường)',16486.5,3831,
 'QL1A, QL7, QL46, QL48; đường Hồ Chí Minh; cao tốc Bắc – Nam','Sông Lam (sông Cả), sông Hiếu, sông Hoàng Mai, sông Con; hồ Vực Mấu, hồ Bản Mồng','Sông Hiếu',
 ['Làng Sen (quê Bác)','Biển Cửa Lò','Vườn quốc gia Pù Mát','Đền Cuông'],
 ['Là một trong những tỉnh có diện tích lớn nhất cả nước (khoảng 16.486 km²).','Làng Sen là quê hương Chủ tịch Hồ Chí Minh.','Có Khu dự trữ sinh quyển Tây Nghệ An (UNESCO) và Vườn quốc gia Pù Mát.','Dân ca Ví, Giặm Nghệ Tĩnh là di sản UNESCO (2014).'],
 'Mùa hè tắm biển Cửa Lò; thưởng thức cháo lươn và cam Vinh.');

P('p18',[],'Thành phố Hà Tĩnh','69 xã, phường (60 xã và 9 phường)',5994.4,1623,
 'QL1A, QL8, QL15A, QL12C; đường Hồ Chí Minh; cao tốc Bắc – Nam','Sông La, sông Lam, sông Ngàn Sâu, sông Ngàn Phố; hồ Kẻ Gỗ, hồ Sông Rác','Hồ Kẻ Gỗ',
 ['Ngã ba Đồng Lộc','Khu lưu niệm Nguyễn Du','Chùa Hương Tích','Biển Thiên Cầm'],
 ['Quê hương đại thi hào Nguyễn Du (Tiên Điền), Danh nhân văn hóa thế giới.','Ngã ba Đồng Lộc là di tích ghi dấu 10 cô gái thanh niên xung phong.','Có chùa Hương Tích trên dãy Hồng Lĩnh và biển Thiên Cầm.','Có cửa khẩu Cầu Treo sang Lào; khu kinh tế Vũng Áng.'],
 'Thưởng thức kẹo cu đơ, cam bù Hương Sơn và ghé khu lưu niệm Nguyễn Du.');

P('p19',['Quảng Bình','Quảng Trị'],'Khu vực thành phố Đồng Hới (Quảng Bình cũ)','78 xã, phường, đặc khu (69 xã, 8 phường, 1 đặc khu Cồn Cỏ)',12700,1870,
 'QL1A, QL9, QL12A, QL15, QL49; đường Hồ Chí Minh; cao tốc Bắc – Nam','Sông Gianh, sông Nhật Lệ, sông Kiến Giang, sông Bến Hải, sông Thạch Hãn; hồ Rào Quán','Sông Bến Hải',
 ['Thành cổ Quảng Trị','Cầu Hiền Lương','Vườn quốc gia Phong Nha – Kẻ Bàng','Địa đạo Vịnh Mốc'],
 ['Phong Nha – Kẻ Bàng là Di sản thiên nhiên thế giới, có hang Sơn Đoòng, hang động lớn nhất thế giới.','Sông Bến Hải – cầu Hiền Lương là giới tuyến quân sự tạm thời tại vĩ tuyến 17 (1954 – 1975).','Thành cổ Quảng Trị gắn với 81 ngày đêm chiến đấu năm 1972; có địa đạo Vịnh Mốc.','Đảo Cồn Cỏ nằm ngoài khơi biển Đông.'],
 'Muốn thăm hang Sơn Đoòng cần đặt trước vì số lượng khách mỗi năm rất hạn chế.');

P('p20',[],'Thành phố Huế','40 xã, phường (21 phường và 19 xã)',4947.1,1432,
 'QL1A, QL49; hầm Hải Vân, hầm Phước Tượng – Phú Gia','Sông Hương, sông Bồ, sông Ô Lâu; phá Tam Giang – Cầu Hai, đầm Lập An; hồ Tả Trạch','Phá Tam Giang – Cầu Hai',
 ['Đại Nội Huế','Chùa Thiên Mụ','Lăng Tự Đức','Vườn quốc gia Bạch Mã'],
 ['Quần thể di tích Cố đô Huế là Di sản văn hóa thế giới (UNESCO 1993).','Nhã nhạc cung đình Huế là di sản UNESCO (2003).','Có sông Hương – núi Ngự, chùa Thiên Mụ, các lăng tẩm vua Nguyễn.','Là thành phố trực thuộc Trung ương từ năm 2025.'],
 'Nên ghé Đại Nội, thưởng thức bún bò Huế và các món ăn cung đình.');

P('p21',['Quảng Nam','Đà Nẵng'],'Thành phố Đà Nẵng','94 xã, phường, đặc khu (23 phường, 70 xã, 1 đặc khu Hoàng Sa)',11859.6,3065,
 'QL1A, QL14B, QL14D, QL14E, QL14G, QL40B; cao tốc Đà Nẵng – Quảng Ngãi; hầm Hải Vân','Sông Hàn, sông Cu Đê, sông Vu Gia, sông Thu Bồn, sông Trường Giang; hồ Phú Ninh, hồ Hòa Trung','Sông Hàn',
 ['Phố cổ Hội An','Cầu Rồng','Thánh địa Mỹ Sơn','Ngũ Hành Sơn'],
 ['Phố cổ Hội An và Thánh địa Mỹ Sơn là hai Di sản văn hóa thế giới (UNESCO 1999).','Cù Lao Chàm là Khu dự trữ sinh quyển thế giới (UNESCO 2009).','Có cầu Rồng, cầu sông Hàn, Bà Nà Hills, bán đảo Sơn Trà, Ngũ Hành Sơn.','Quản lý quần đảo Hoàng Sa (đặc khu Hoàng Sa).'],
 'Nên đi biển Mỹ Khê vào mùa hè và dạo Hội An đêm rằm để xem đèn lồng.');

P('p22',['Kon Tum','Quảng Ngãi'],'Thành phố Quảng Ngãi','96 xã, phường, đặc khu (86 xã, 9 phường, 1 đặc khu Lý Sơn)',14832.5,2161,
 'QL1A, QL14, QL14C, QL24, QL40, QL40B; đường Hồ Chí Minh','Sông Trà Khúc, sông Vệ, sông Trà Bồng, sông Đăk Bla, sông Pô Kô; hồ Thạch Nham, hồ Ya Ly','Sông Trà Khúc',
 ['Đảo Lý Sơn','Núi Thiên Ấn','Khu chứng tích Sơn Mỹ','Khu du lịch Măng Đen'],
 ['Đảo Lý Sơn có địa hình núi lửa cổ và nổi tiếng với tỏi.','Có nhà máy lọc dầu Dung Quất.','Có khu chứng tích Sơn Mỹ; Kon Tum (cũ) có nhà rông, nhà thờ gỗ và vùng Măng Đen.','Đỉnh Ngọc Linh (2.598 m) và sâm Ngọc Linh nổi tiếng.'],
 'Mùa biển êm (khoảng tháng 3 – 8) là thời điểm tốt để ra đảo Lý Sơn.');

P('p23',['Bình Định','Gia Lai'],'Thành phố Quy Nhơn (Bình Định cũ)','135 xã, phường (110 xã và 25 phường)',21576.5,3583,
 'QL1A, QL19, QL14, QL25, QL19B, QL1D; đường Hồ Chí Minh','Sông Ba, sông Kôn, sông Sê San, sông Ayun, sông Hà Thanh; Biển Hồ, hồ Ayun Hạ, hồ Ya Ly, đầm Thị Nại','Đầm Thị Nại',
 ['Biển Hồ Pleiku','Eo Gió','Tháp Đôi','Bảo tàng Quang Trung'],
 ['Là tỉnh có diện tích lớn thứ hai cả nước (khoảng 21.577 km²), có cả cao nguyên và biển.','Không gian văn hóa cồng chiêng Tây Nguyên là di sản UNESCO.','Quy Nhơn có Eo Gió, Kỳ Co, Tháp Đôi; Pleiku có Biển Hồ.','Bình Định (cũ) là quê hương Tây Sơn và vùng đất võ.'],
 'Mùa khô (tháng 11 – 4) ở Tây Nguyên nắng đẹp, hoa dã quỳ nở rộ cuối năm.');

P('p24',['Phú Yên','Đắk Lắk'],'Thành phố Buôn Ma Thuột','102 xã, phường (88 xã và 14 phường)',18096.4,3347,
 'QL1A, QL14, QL25, QL26, QL27, QL29, QL19C; đường Hồ Chí Minh','Sông Srêpốk, sông Krông Ana, sông Krông Nô, sông Ba (Đà Rằng); hồ Lắk, hồ Ea Kao, đầm Ô Loan','Hồ Lắk',
 ['Buôn Đôn','Hồ Lắk','Bảo tàng Thế giới Cà phê','Gành Đá Đĩa'],
 ['Buôn Ma Thuột là thủ phủ cà phê của Việt Nam.','Có Buôn Đôn, hồ Lắk, thác Dray Nur – Dray Sáp và lễ hội đua voi.','Phú Yên (cũ) có Gành Đá Đĩa, vịnh Xuân Đài, Mũi Điện (Đại Lãnh) – nơi đón ánh bình minh đầu tiên trên đất liền.','Có cả vùng Tây Nguyên và dải ven biển Nam Trung Bộ.'],
 'Lễ hội Cà phê Buôn Ma Thuột thường tổ chức vào tháng 3.');

P('p25',['Ninh Thuận','Khánh Hòa'],'Thành phố Nha Trang','65 xã, phường, đặc khu (48 xã, 16 phường, 1 đặc khu Trường Sa)',8555.9,2243,
 'QL1A, QL26, QL27, QL27B, QL27C; cao tốc Bắc – Nam','Sông Cái Nha Trang, sông Dinh, sông Cái Phan Rang; vịnh Nha Trang, vịnh Cam Ranh, vịnh Vân Phong; đầm Nại','Vịnh Cam Ranh',
 ['Vịnh Nha Trang','Tháp Bà Ponagar','Tháp Po Klong Garai','Vịnh Vĩnh Hy'],
 ['Vịnh Nha Trang là thành viên Câu lạc bộ những vịnh biển đẹp nhất thế giới.','Quản lý quần đảo Trường Sa (đặc khu Trường Sa).','Có tháp Bà Ponagar, tháp Po Klong Garai; Ninh Thuận (cũ) nổi tiếng với nho, cừu, đồi cát Nam Cương.','Có cảng quốc tế Cam Ranh và vịnh nước sâu Cam Ranh.'],
 'Biển Nha Trang thường êm từ tháng 1 đến tháng 8, thích hợp để lặn ngắm san hô.');

P('p26',['Đắk Nông','Bình Thuận','Lâm Đồng'],'Thành phố Đà Lạt','124 xã, phường, đặc khu (103 xã, 20 phường, 1 đặc khu Phú Quý)',24233.1,3872,
 'QL1A, QL20, QL27, QL28, QL55, QL14; cao tốc Phan Thiết – Dầu Giây, Vĩnh Hảo – Phan Thiết, Liên Khương – Prenn','Sông Đồng Nai, sông Đa Nhim, sông La Ngà, sông Sêrêpốk; hồ Xuân Hương, hồ Tuyền Lâm, hồ Tà Đùng, hồ Đa Mi','Hồ Tuyền Lâm',
 ['Hồ Xuân Hương','Núi Lang Biang','Đồi cát Mũi Né','Hồ Tà Đùng'],
 ['Là tỉnh có diện tích lớn nhất cả nước (khoảng 24.233 km²).','Đà Lạt nổi tiếng là thành phố ngàn hoa trên cao nguyên Lang Biang; Lang Biang là Khu dự trữ sinh quyển UNESCO.','Đắk Nông (cũ) có Công viên địa chất toàn cầu UNESCO và hồ Tà Đùng.','Bình Thuận (cũ) có Mũi Né, Phan Thiết và đảo Phú Quý.'],
 'Đà Lạt mát mẻ quanh năm, nên mang theo áo khoác mỏng.');

P('p28',['Bà Rịa – Vũng Tàu','Bình Dương','TP.HCM'],'Thành phố Hồ Chí Minh (cũ)','168 xã, phường, đặc khu (113 phường, 54 xã, 1 đặc khu Côn Đảo)',6772.6,14002,
 'QL1, QL13, QL22, QL50, QL51, QL56; cao tốc TP.HCM – Long Thành – Dầu Giây, TP.HCM – Trung Lương; vành đai 3','Sông Sài Gòn, sông Đồng Nai, sông Nhà Bè, sông Thị Vải, sông Soài Rạp; kênh Nhiêu Lộc – Thị Nghè','Sông Nhà Bè',
 ['Dinh Độc Lập','Nhà thờ Đức Bà','Địa đạo Củ Chi','Nhà tù Côn Đảo'],
 ['Là địa phương đông dân nhất cả nước (khoảng 14 triệu người).','Có Dinh Độc Lập, Nhà thờ Đức Bà, chợ Bến Thành, địa đạo Củ Chi.','Có cảng Cái Mép – Thị Vải ở Bà Rịa – Vũng Tàu (cũ) và nhiều khu công nghiệp ở Bình Dương (cũ).','Côn Đảo với hệ thống nhà tù lịch sử; Vũng Tàu có Bãi Sau và tượng Chúa Kitô.'],
 'Hãy thử ẩm thực đường phố và tránh giờ cao điểm khi di chuyển.');

P('p27',['Bình Phước','Đồng Nai'],'Thành phố Biên Hòa','95 xã, phường (72 xã và 23 phường)',12737.2,4491,
 'QL1, QL13, QL14, QL20, QL51, QL56; cao tốc TP.HCM – Long Thành – Dầu Giây, Dầu Giây – Phan Thiết','Sông Đồng Nai, sông Bé, sông La Ngà, sông Thị Vải; hồ Trị An, hồ Thác Mơ','Hồ Trị An',
 ['Vườn quốc gia Cát Tiên','Văn miếu Trấn Biên','Núi Bà Rá','Khu du lịch Bửu Long'],
 ['Vườn quốc gia Cát Tiên là Khu dự trữ sinh quyển thế giới (UNESCO 2001).','Văn miếu Trấn Biên ở Biên Hòa là di tích về Nho học vùng Nam Bộ.','Có hồ Trị An rộng lớn trên sông Đồng Nai và dự án sân bay quốc tế Long Thành.','Bình Phước (cũ) nổi tiếng với hạt điều, cao su và núi Bà Rá.'],
 'Nên đi Vườn quốc gia Cát Tiên vào mùa khô để đi bộ, ngắm chim.');

P('p29',['Long An','Tây Ninh'],'Thành phố Tân An (Long An cũ)','96 xã, phường (82 xã và 14 phường)',8536.4,3254,
 'QL1, QL22, QL22B, QL62, QL50','Sông Sài Gòn, sông Vàm Cỏ Đông, sông Vàm Cỏ Tây; hồ Dầu Tiếng','Hồ Dầu Tiếng',
 ['Núi Bà Đen','Tòa Thánh Cao Đài','Cửa khẩu Mộc Bài','Vườn quốc gia Lò Gò – Xa Mát'],
 ['Núi Bà Đen cao khoảng 986 m, là ngọn núi cao nhất Nam Bộ.','Hồ Dầu Tiếng là hồ nhân tạo lớn nhất Việt Nam.','Có Tòa Thánh Cao Đài Tây Ninh và cửa khẩu quốc tế Mộc Bài với Campuchia.','Long An (cũ) có vùng Đồng Tháp Mười và làng nổi Tân Lập.'],
 'Có thể đi cáp treo lên núi Bà Đen; xem lễ cúng chính ngọ tại Tòa Thánh.');

P('p30',['Tiền Giang','Đồng Tháp'],'Thành phố Mỹ Tho (Tiền Giang cũ)','102 xã, phường (82 xã và 20 phường)',5938.6,4370,
 'QL1A, QL30, QL80, QL62, QL50; cao tốc TP.HCM – Trung Lương – Mỹ Thuận – Cần Thơ','Sông Tiền, sông Sở Thượng, sông Sở Hạ, kênh Nguyễn Văn Tiếp, kênh Hồng Ngự – Vĩnh Hưng','Sông Sở Thượng',
 ['Vườn quốc gia Tràm Chim','Làng hoa Sa Đéc','Chùa Vĩnh Tràng','Chợ nổi Cái Bè'],
 ['Vườn quốc gia Tràm Chim là nơi bảo tồn sếu đầu đỏ, khu Ramsar.','Làng hoa Sa Đéc nổi tiếng; Mỹ Tho có chùa Vĩnh Tràng, cù lao Thới Sơn.','Có chợ nổi Cái Bè và vùng vườn cây ăn trái bên sông Tiền.','Có khu di tích Gò Tháp và hủ tiếu Mỹ Tho nổi tiếng.'],
 'Mùa nước nổi (khoảng tháng 8 – 11) đi Tràm Chim, Đồng Tháp Mười rất thú vị.');

P('p31',['Kiên Giang','An Giang'],'Thành phố Rạch Giá (Kiên Giang cũ)','102 xã, phường, đặc khu (85 xã, 14 phường, 3 đặc khu Phú Quốc, Thổ Châu, Kiên Hải)',9888.9,4952,
 'QL91, QL80, QL91C, QL63, QL61, QL N1','Sông Tiền, sông Hậu, kênh Vĩnh Tế, kênh Rạch Giá – Hà Tiên, kênh Thoại Hà','Kênh Vĩnh Tế',
 ['Miếu Bà Chúa Xứ núi Sam','Rừng tràm Trà Sư','Đảo Phú Quốc','Hòn Phụ Tử (Hà Tiên)'],
 ['Phú Quốc là đảo lớn nhất Việt Nam; Kiên Giang có Khu dự trữ sinh quyển UNESCO.','Có vùng Thất Sơn (núi Cấm, núi Sam) và rừng tràm Trà Sư.','Hà Tiên có Hòn Phụ Tử, Mũi Nai; vùng biển đảo Nam Du, Thổ Châu.','Là tỉnh đông dân nhất đồng bằng sông Cửu Long (khoảng 4,95 triệu người).'],
 'Lễ vía Bà Chúa Xứ núi Sam tổ chức vào tháng 4 âm lịch hằng năm.');

P('p32',['Bến Tre','Vĩnh Long','Trà Vinh'],'Thành phố Vĩnh Long','124 xã, phường (105 xã và 19 phường)',6296.2,4258,
 'QL1A, QL53, QL54, QL57, QL60; cao tốc Trung Lương – Mỹ Thuận – Cần Thơ; cầu Mỹ Thuận','Sông Tiền, sông Hậu, sông Cổ Chiên, sông Hàm Luông, sông Ba Lai, sông Măng Thít','Sông Cổ Chiên',
 ['Cù lao An Bình','Ao Bà Om','Cầu Mỹ Thuận','Chùa Âng'],
 ['Gồm vùng đất giữa sông Tiền, sông Hậu với nhiều cù lao và vườn trái cây.','Bến Tre (cũ) được gọi là xứ dừa; Trà Vinh (cũ) có Ao Bà Om, chùa Âng, nhiều chùa Khmer.','Vĩnh Long (cũ) có cầu Mỹ Thuận, nhà cổ Cai Cường, Văn Thánh miếu.','Có đường bờ biển ở phía Đông và nhiều cửa sông lớn.'],
 'Đi thuyền trên sông Cổ Chiên, ghé vườn trái cây, thăm cù lao.');

P('p33',['Sóc Trăng','Hậu Giang','Cần Thơ'],'Thành phố Cần Thơ','103 xã, phường (72 xã và 31 phường)',6360.8,4200,
 'QL1A, QL91, QL61, QL61C, QL60, đường Nam Sông Hậu; cầu Cần Thơ','Sông Hậu, sông Cần Thơ, sông Mỹ Thanh, kênh Xà No, kênh Quản Lộ – Phụng Hiệp','Sông Cần Thơ',
 ['Chợ nổi Cái Răng','Bến Ninh Kiều','Nhà cổ Bình Thủy','Chùa Dơi (Sóc Trăng)'],
 ['Cần Thơ là thành phố trung tâm của đồng bằng sông Cửu Long, gọi là “Tây Đô”.','Có chợ nổi Cái Răng, bến Ninh Kiều, nhà cổ Bình Thủy.','Sóc Trăng (cũ) có chùa Dơi, lễ hội Ok Om Bok và đua ghe ngo của người Khmer.','Hậu Giang (cũ) có ngã bảy Phụng Hiệp; cầu Cần Thơ bắc qua sông Hậu.'],
 'Hãy dậy sớm (khoảng 5 – 7 giờ sáng) để ghé chợ nổi Cái Răng.');

P('p34',['Bạc Liêu','Cà Mau'],'Thành phố Cà Mau','64 xã, phường (55 xã và 9 phường)',7942.4,2607,
 'QL1A, QL63; đường Hồ Chí Minh (Năm Căn – Đất Mũi); cao tốc Cần Thơ – Cà Mau','Sông Gành Hào, sông Ông Đốc, sông Bảy Háp, sông Cửa Lớn, sông Đầm Dơi','Sông Gành Hào',
 ['Mũi Cà Mau','Vườn quốc gia U Minh Hạ','Nhà Công tử Bạc Liêu','Điện gió Bạc Liêu'],
 ['Mũi Cà Mau (Đất Mũi) là điểm cực Nam của Tổ quốc; Vườn quốc gia Mũi Cà Mau là khu Ramsar và dự trữ sinh quyển.','Có rừng đước, rừng tràm U Minh Hạ.','Bạc Liêu (cũ) có Nhà Công tử Bạc Liêu, điện gió ven biển, nghề làm muối và bài “Dạ cổ hoài lang”.','Cà Mau (cũ) có bờ biển dài khoảng 254 km.'],
 'Có thể đi ca nô vào Vườn quốc gia Mũi Cà Mau; nhớ mang đồ chống muỗi.');


STOPS.forEach(s=>{const x=PI[s.id];if(!x)return;Object.assign(s,x);s.intro=x.nb.join('\n');s.tip=x.tip;});

function vvNum(v,d){return v.toLocaleString('vi-VN',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}
function vvPop(k){return k>=1000?'khoảng '+(k/1000).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2})+' triệu người':'khoảng '+k+' nghìn người';}
function vvRank(key,s){return STOPS.slice().sort((a,b)=>b[key]-a[key]).indexOf(s)+1;}
function vvMerge(s){return s.f&&s.f.length?'Sáp nhập từ '+s.f.join(' + '):'Giữ nguyên, không sáp nhập';}
function vvCap(t){return t.charAt(0).toUpperCase()+t.slice(1);}

/* Tự tạo 3 câu hỏi cho mỗi tỉnh từ dữ liệu ở trên */
(function(){
  const J=a=>a.join(' + ');
  const pick=(a,n)=>shuffle(a).slice(0,n);
  const merged=STOPS.filter(s=>s.f&&s.f.length);
  const kept=STOPS.filter(s=>s.pl&&!(s.f&&s.f.length));
  STOPS.forEach(s=>{
    if(!s.pl)return;
    const others=STOPS.filter(o=>o!==s&&o.pl);
    const qs=[];
    if(s.f&&s.f.length){
      const w=pick(merged.filter(o=>o!==s).map(o=>J(o.f)),3);
      qs.push(['Tỉnh, thành '+s.s+' hiện nay được hình thành từ việc sáp nhập những tỉnh nào?',J(s.f),w[0],w[1],w[2],s.s+' được sắp xếp theo Nghị quyết 202/2025/QH15 từ: '+J(s.f)+'.']);
    }else{
      const w=pick(merged.map(o=>o.s),3);
      qs.push(['Tỉnh, thành nào sau đây được giữ nguyên, không sáp nhập năm 2025?',s.s,w[0],w[1],w[2],'Cả nước có 11 tỉnh, thành giữ nguyên: '+kept.map(o=>o.s).join(', ')+'.']);
    }
    const pw=pick(others.map(o=>pick(o.pl,1)[0]),3);
    qs.push(['Địa danh nào sau đây thuộc '+s.s+'?',pick(s.pl,1)[0],pw[0],pw[1],pw[2],'Một số địa danh nổi bật của '+s.s+': '+s.pl.join(', ')+'.']);
    const sw=pick(others.map(o=>o.sk),3);
    qs.push(['Sông, hồ hoặc vịnh nào sau đây thuộc '+s.s+'?',s.sk,sw[0],sw[1],sw[2],'Các sông, hồ, vịnh tiêu biểu của '+s.s+': '+s.song+'.']);
    s.qs=qs;
  });
})();

/* ===== THÔNG TIN DU LỊCH BỔ SUNG CHO 34 TỈNH, THÀNH =====
   dc: danh lam thắng cảnh · ds: đặc sản nổi tiếng · tq: nơi tham quan, di tích · dd: điểm dừng chân, check-in.
   Muốn sửa: tìm đúng mã tỉnh (p1 … p34) rồi thêm/bớt trong danh sách. */
const PX={
p1:{dc:['Đèo Ô Quy Hồ','Cao nguyên Sìn Hồ','Thác Tác Tình','Động Pusamcap','Đỉnh Putaleng'],ds:['Chè Shan tuyết Tam Đường','Thịt trâu gác bếp','Cá suối nướng','Rượu San Thàng','Măng đắng'],tq:['Bản San Thàng','Bản Sin Suối Hồ','Đồi chè Tam Đường','Cầu kính Rồng Mây'],dd:['Cổng trời Ô Quy Hồ','Cầu kính Rồng Mây','Hồ thủy điện Lai Châu']},
p2:{dc:['Hồ Pá Khoang','Cánh đồng Mường Thanh','Đèo Pha Đin','Ngã ba biên giới A Pa Chải'],ds:['Gạo Điện Biên','Pa pỉnh tộp (cá nướng gập)','Xôi nếp nương','Cà phê Điện Biên','Thịt trâu gác bếp'],tq:['Đồi A1','Hầm Đờ Cát-xtơ-ri','Bảo tàng Chiến thắng Điện Biên Phủ','Tượng đài Chiến thắng Điện Biên Phủ'],dd:['Cột mốc A Pa Chải – điểm cực Tây','Cầu Mường Thanh','Cửa khẩu Tây Trang']},
p3:{dc:['Đỉnh Fansipan','Ruộng bậc thang Mù Cang Chải','Thung lũng Mường Hoa','Hồ Thác Bà','Đèo Khau Phạ'],ds:['Thắng cố','Cá hồi Sa Pa','Táo mèo','Gạo nếp Tú Lệ','Cốm Tú Lệ'],tq:['Bản Cát Cát','Chợ phiên Bắc Hà','Dinh Hoàng A Tưởng','Nhà thờ đá Sa Pa'],dd:['Thị xã Sa Pa','Đèo Khau Phạ (bay dù lượn)','Cửa khẩu quốc tế Lào Cai','Thung lũng Tú Lệ']},
p4:{dc:['Cao nguyên đá Đồng Văn','Đèo Mã Pì Lèng','Sông Nho Quế','Hồ Na Hang','Núi đôi Quản Bạ'],ds:['Cam sành Hàm Yên','Bánh tam giác mạch','Mật ong bạc hà','Chè Shan tuyết Hà Giang','Bánh gai Chiêm Hóa'],tq:['Khu di tích Tân Trào','Dinh thự họ Vương','Phố cổ Đồng Văn','Cột cờ Lũng Cú'],dd:['Cổng trời Quản Bạ','Đỉnh đèo Mã Pì Lèng','Làng văn hóa Lô Lô Chải','Lễ hội Thành Tuyên (rước đèn Trung thu)']},
p5:{dc:['Thác Bản Giốc','Động Ngườm Ngao','Hồ Thang Hen','Núi Mắt Thần','Sông Quây Sơn'],ds:['Hạt dẻ Trùng Khánh','Bánh cuốn canh Cao Bằng','Vịt quay bảy vị','Bánh áp chao','Miến dong'],tq:['Khu di tích Pác Bó (hang Cốc Bó, suối Lê-nin)','Rừng Trần Hưng Đạo','Chùa Phật tích Trúc Lâm Bản Giốc','Làng rèn Phúc Sen'],dd:['Đèo Mã Phục','Làng đá Khuổi Ky','Đèo Khau Cốc Chà']},
p6:{dc:['Hồ Núi Cốc','Hồ Ba Bể','Động Puông','Thác Đầu Đẳng'],ds:['Chè Tân Cương','Bánh chưng Bờ Đậu','Miến dong Bắc Kạn','Bánh coóc mò','Cam quýt Bắc Kạn'],tq:['ATK Định Hóa','Bảo tàng Văn hóa các dân tộc Việt Nam','ATK Chợ Đồn','Đền Đuổm'],dd:['Đồi chè Tân Cương','Khu du lịch hồ Núi Cốc','Bến thuyền hồ Ba Bể']},
p7:{dc:['Núi Mẫu Sơn','Động Tam Thanh','Núi Tô Thị (nàng Tô Thị)','Động Nhị Thanh'],ds:['Vịt quay Lạng Sơn','Lợn quay Lạng Sơn','Khâu nhục','Phở chua','Na Chi Lăng','Hồng không hạt Bảo Lâm'],tq:['Ải Chi Lăng','Thành nhà Mạc','Đền Bắc Lệ','Chùa Tam Thanh'],dd:['Chợ Đông Kinh','Chợ Kỳ Lừa','Cửa khẩu Hữu Nghị','Đỉnh Mẫu Sơn']},
p8:{dc:['Vịnh Hạ Long','Vịnh Bái Tử Long','Đảo Cô Tô','Đảo Quan Lạn','Núi Yên Tử'],ds:['Chả mực Hạ Long','Sá sùng','Ngán','Sam biển','Rượu ba kích'],tq:['Khu di tích Yên Tử','Bảo tàng Quảng Ninh','Đền Cửa Ông','Bãi cọc Bạch Đằng'],dd:['Cầu Bãi Cháy','Đảo Tuần Châu','Bãi biển Trà Cổ','Cửa khẩu Móng Cái']},
p9:{dc:['Hồ Khuôn Thần','Khu bảo tồn Tây Yên Tử','Khu du lịch Suối Mỡ'],ds:['Bánh phu thê Đình Bảng','Bánh tẻ làng Chờ','Vải thiều Lục Ngạn','Mì Chũ','Bánh đa Kế'],tq:['Đền Đô','Chùa Dâu','Chùa Phật Tích','Chùa Bút Tháp','Chùa Vĩnh Nghiêm'],dd:['Hội Lim (dân ca quan họ)','Làng tranh Đông Hồ','Làng gốm Phù Lãng','Đình Đình Bảng']},
p10:{dc:['Thị trấn Tam Đảo','Hồ Hòa Bình','Thung lũng Mai Châu','Hồ Đại Lải','Vườn quốc gia Xuân Sơn'],ds:['Thịt chua Thanh Sơn','Quả cọ Phú Thọ','Cam Cao Phong','Cơm lam Hòa Bình','Su su Tam Đảo','Cá thính Lập Thạch'],tq:['Khu di tích Đền Hùng','Thiền viện Trúc Lâm Tây Thiên','Tháp Bình Sơn','Bảo tàng Hùng Vương'],dd:['Bản Lác (Mai Châu)','Đồi chè Long Cốc','Suối khoáng Kim Bôi','Nhà máy thủy điện Hòa Bình']},
p11:{dc:['Cao nguyên Mộc Châu','Đỉnh Tà Xùa','Thác Dải Yếm','Rừng thông Bản Áng','Hang Dơi'],ds:['Bê chao Mộc Châu','Sữa Mộc Châu','Mận hậu Sơn La','Chẳm chéo','Cá nướng pa pỉnh tộp Sơn La'],tq:['Nhà tù Sơn La','Nhà máy thủy điện Sơn La','Bảo tàng Sơn La','Đồi chè trái tim'],dd:['Cầu kính Bạch Long','Sống lưng khủng long Tà Xùa','Đồi chè Mộc Châu']},
p12:{dc:['Hồ Hoàn Kiếm','Hồ Tây','Chùa Hương (Hương Sơn)','Núi Ba Vì'],ds:['Phở Hà Nội','Bún chả','Chả cá Lã Vọng','Cốm làng Vòng','Bánh cuốn Thanh Trì','Bún thang'],tq:['Lăng Chủ tịch Hồ Chí Minh','Văn Miếu – Quốc Tử Giám','Hoàng thành Thăng Long','Chùa Một Cột','Nhà hát Lớn Hà Nội','Làng cổ Đường Lâm'],dd:['Phố cổ Hà Nội','Phố đi bộ quanh Hồ Gươm','Cầu Long Biên','Làng gốm Bát Tràng']},
p13:{dc:['Đảo Cát Bà','Vịnh Lan Hạ','Bán đảo Đồ Sơn','Đảo Bạch Long Vĩ','Côn Sơn – Kiếp Bạc'],ds:['Bánh đa cua','Nem cua bể','Bánh mì que','Bánh đậu xanh Hải Dương','Vải thiều Thanh Hà','Bánh gai Ninh Giang'],tq:['Khu di tích Côn Sơn – Kiếp Bạc','Nhà hát Lớn Hải Phòng','Chùa Dư Hàng','Đền Nghè','Văn miếu Mao Điền'],dd:['Phố hoa phượng đỏ','Thị trấn Cát Bà','Bãi biển Đồ Sơn','Cảng Hải Phòng']},
p14:{dc:['Biển Đồng Châu','Cồn Vành','Bãi biển Cồn Đen'],ds:['Nhãn lồng Hưng Yên','Tương Bần','Gà Đông Tảo','Bánh cáy làng Nguyễn','Canh cá Quỳnh Côi'],tq:['Phố Hiến','Văn miếu Xích Đằng','Chùa Keo (Thái Bình)','Đền Trần Thái Bình','Đền Chử Đồng Tử'],dd:['Chùa Nôm','Làng chiếu Hới','Đền Mẫu Hưng Yên']},
p15:{dc:['Quần thể Tràng An','Tam Cốc – Bích Động','Khu bảo tồn Vân Long','Vườn quốc gia Cúc Phương','Biển Thịnh Long'],ds:['Cơm cháy Ninh Bình','Thịt dê núi','Phở bò Nam Định','Kẹo Sìu Châu','Cá kho làng Vũ Đại','Bánh nhãn Hải Hậu'],tq:['Cố đô Hoa Lư','Chùa Bái Đính','Nhà thờ đá Phát Diệm','Đền Trần (Nam Định)','Chùa Tam Chúc','Chùa Phổ Minh'],dd:['Hang Múa','Làng Vũ Đại (làng Chí Phèo)','Nhà thờ đổ Hải Lý']},
p16:{dc:['Biển Sầm Sơn','Khu bảo tồn Pù Luông','Suối cá thần Cẩm Lương','Động Từ Thức','Biển Hải Tiến'],ds:['Nem chua Thanh Hóa','Chè lam Phủ Quảng','Gỏi cá nhệch','Bánh răng bừa','Bánh gai Tứ Trụ'],tq:['Thành Nhà Hồ','Di tích Lam Kinh','Đền Bà Triệu','Đền Sòng Sơn'],dd:['Cầu Hàm Rồng','Hòn Trống Mái (Sầm Sơn)','Bản Hiêu (Pù Luông)']},
p17:{dc:['Biển Cửa Lò','Vườn quốc gia Pù Mát','Đảo Lan Châu','Thác Khe Kèm','Biển Quỳnh'],ds:['Cháo lươn Nghệ An','Nhút Thanh Chương','Cam Vinh','Bánh mướt Diễn Châu','Tương Nam Đàn'],tq:['Khu di tích Kim Liên (Làng Sen)','Đền Cuông','Khu di tích Truông Bồn','Đền Ông Hoàng Mười','Quảng trường Hồ Chí Minh (Vinh)'],dd:['Đồi chè Thanh Chương','Thành cổ Vinh','Đảo chè Thanh An']},
p18:{dc:['Biển Thiên Cầm','Hồ Kẻ Gỗ','Núi Hồng Lĩnh','Biển Xuân Thành','Vườn quốc gia Vũ Quang'],ds:['Kẹo cu đơ','Bưởi Phúc Trạch','Cam bù Hương Sơn','Mực nhảy Vũng Áng'],tq:['Ngã ba Đồng Lộc','Khu lưu niệm Nguyễn Du','Chùa Hương Tích','Khu lưu niệm Trần Phú','Khu di tích Hải Thượng Lãn Ông'],dd:['Cầu Bến Thủy','Đèo Ngang','Biển Xuân Thành']},
p19:{dc:['Vườn quốc gia Phong Nha – Kẻ Bàng','Động Thiên Đường','Hang Sơn Đoòng','Biển Nhật Lệ','Biển Cửa Tùng','Đảo Cồn Cỏ'],ds:['Cháo canh Quảng Bình','Bánh lọc Quảng Bình','Khoai deo','Bánh ướt Phương Lang','Cà phê Khe Sanh','Hồ tiêu Cùa'],tq:['Thành cổ Quảng Trị','Cầu Hiền Lương – sông Bến Hải','Địa đạo Vịnh Mốc','Nghĩa trang liệt sĩ Trường Sơn','Mộ Đại tướng Võ Nguyên Giáp (Vũng Chùa)','Quảng Bình Quan'],dd:['Vũng Chùa – Đảo Yến','Cửa khẩu Lao Bảo','Đồi cát Quang Phú','Căn cứ Khe Sanh']},
p20:{dc:['Sông Hương','Núi Ngự Bình','Phá Tam Giang','Biển Lăng Cô','Vườn quốc gia Bạch Mã'],ds:['Bún bò Huế','Cơm hến','Bánh bèo','Bánh khoái','Chè Huế','Mè xửng','Tôm chua Huế'],tq:['Đại Nội Huế','Chùa Thiên Mụ','Lăng Khải Định','Lăng Tự Đức','Lăng Minh Mạng','Điện Hòn Chén'],dd:['Cầu Trường Tiền','Chợ Đông Ba','Cầu ngói Thanh Toàn','Đầm Chuồn']},
p21:{dc:['Bán đảo Sơn Trà','Bà Nà Hills','Ngũ Hành Sơn','Biển Mỹ Khê','Cù Lao Chàm','Đèo Hải Vân'],ds:['Mì Quảng','Cao lầu Hội An','Bánh tráng cuốn thịt heo','Cơm gà Tam Kỳ','Bê thui Cầu Mống'],tq:['Phố cổ Hội An','Chùa Cầu','Thánh địa Mỹ Sơn','Chùa Linh Ứng','Bảo tàng Điêu khắc Chăm'],dd:['Cầu Vàng (Bà Nà)','Cầu Rồng','Chợ Hàn','Làng rau Trà Quế','Rừng dừa Bảy Mẫu']},
p22:{dc:['Đảo Lý Sơn','Khu du lịch Măng Đen','Núi Thiên Ấn','Biển Sa Huỳnh','Núi Ngọc Linh'],ds:['Cá bống sông Trà','Tỏi Lý Sơn','Đường phổi','Kẹo gương','Sâm Ngọc Linh','Gỏi lá Kon Tum'],tq:['Khu chứng tích Sơn Mỹ','Nhà thờ gỗ Kon Tum','Cầu treo Kon Klor','Ngục Kon Tum'],dd:['Cổng Tò Vò (Lý Sơn)','Ngã ba Đông Dương (cửa khẩu Bờ Y)','Hồ Đắk Ke (Măng Đen)']},
p23:{dc:['Biển Hồ (hồ T’Nưng)','Eo Gió','Kỳ Co','Ghềnh Ráng Tiên Sa','Núi lửa Chư Đăng Ya'],ds:['Phở khô Gia Lai','Bánh ít lá gai','Bánh xèo tôm nhảy','Chả cá Quy Nhơn','Rượu Bàu Đá'],tq:['Tháp Đôi','Bảo tàng Quang Trung','Tháp Bánh Ít','Mộ Hàn Mặc Tử','Quảng trường Đại Đoàn Kết (Pleiku)'],dd:['Đồi chè Biển Hồ','Bãi biển Quy Nhơn','Thác Phú Cường']},
p24:{dc:['Gành Đá Đĩa','Vịnh Xuân Đài','Mũi Điện (Mũi Đại Lãnh)','Hồ Lắk','Thác Dray Nur','Vườn quốc gia Yok Đôn'],ds:['Cà phê Buôn Ma Thuột','Cá ngừ đại dương Phú Yên','Bánh canh hẹ','Gà nướng Bản Đôn','Bơ sáp Đắk Lắk'],tq:['Khu du lịch Buôn Đôn','Bảo tàng Thế giới Cà phê','Tháp Nhạn','Nhà thờ Mằng Lăng','Biệt điện Bảo Đại (Buôn Ma Thuột)'],dd:['Bãi Xép','Hải đăng Đại Lãnh','Buôn Akô Dhông','Đầm Ô Loan']},
p25:{dc:['Vịnh Nha Trang','Vịnh Vĩnh Hy','Vịnh Cam Ranh','Đảo Bình Ba','Đồi cát Nam Cương','Vườn quốc gia Núi Chúa'],ds:['Yến sào Khánh Hòa','Bún cá Nha Trang','Nem Ninh Hòa','Nho Ninh Thuận','Thịt cừu Ninh Thuận','Bánh căn'],tq:['Tháp Bà Ponagar','Tháp Po Klong Garai','Viện Hải dương học Nha Trang','Chùa Long Sơn','Làng gốm Bàu Trúc'],dd:['Hòn Chồng','Hang Rái','Huyện đảo Trường Sa','Hòn Mun']},
p26:{dc:['Hồ Xuân Hương','Núi Langbiang','Thác Datanla','Đồi cát Mũi Né','Hồ Tà Đùng','Đảo Phú Quý','Bàu Trắng'],ds:['Dâu tây Đà Lạt','Atiso Đà Lạt','Bánh tráng nướng','Nước mắm Phan Thiết','Thanh long Bình Thuận','Mứt Đà Lạt'],tq:['Thung lũng Tình Yêu','Ga Đà Lạt','Dinh Bảo Đại','Tháp Chăm Pô Sah Inư','Hải đăng Kê Gà','Công viên địa chất Đắk Nông'],dd:['Chợ Đà Lạt','Quảng trường Lâm Viên','Làng chài Mũi Né','Suối Tiên (Mũi Né)']},
p27:{dc:['Vườn quốc gia Cát Tiên','Núi Bà Rá','Hồ Trị An','Thác Giang Điền','Núi Chứa Chan'],ds:['Bưởi Tân Triều','Hạt điều Bình Phước','Chôm chôm Long Khánh','Sầu riêng Long Khánh'],tq:['Văn miếu Trấn Biên','Khu du lịch Bửu Long','Nhà tù Bà Rá','Di tích Sóc Bom Bo','Khu di tích Chiến khu Đ'],dd:['Cù lao Phố','Làng bưởi Tân Triều','Thủy điện Trị An']},
p28:{dc:['Côn Đảo','Bãi Sau Vũng Tàu','Rừng Sác Cần Giờ','Núi Tao Phùng (tượng Chúa Kitô)'],ds:['Cơm tấm Sài Gòn','Hủ tiếu Nam Vang','Bánh mì Sài Gòn','Bánh khọt Vũng Tàu','Măng cụt Lái Thiêu'],tq:['Dinh Độc Lập','Nhà thờ Đức Bà','Bưu điện Thành phố','Địa đạo Củ Chi','Bảo tàng Chứng tích Chiến tranh','Nhà tù Côn Đảo','Chùa Bà Thiên Hậu (Thủ Dầu Một)'],dd:['Phố đi bộ Nguyễn Huệ','Chợ Bến Thành','Tòa nhà Landmark 81','Bến Nhà Rồng','Hải đăng Vũng Tàu']},
p29:{dc:['Núi Bà Đen','Hồ Dầu Tiếng','Vườn quốc gia Lò Gò – Xa Mát','Làng nổi Tân Lập','Đồng Tháp Mười (Long An)'],ds:['Bánh tráng phơi sương Trảng Bàng','Bánh canh Trảng Bàng','Muối tôm Tây Ninh','Mãng cầu Bà Đen','Gạo nàng thơm Chợ Đào','Lạp xưởng Cần Đước'],tq:['Tòa Thánh Cao Đài','Căn cứ Trung ương Cục miền Nam','Nhà trăm cột (Long An)','Khu di tích Vàm Nhựt Tảo'],dd:['Cáp treo núi Bà Đen','Cửa khẩu Mộc Bài','Làng nổi Tân Lập']},
p30:{dc:['Vườn quốc gia Tràm Chim','Đồng sen Tháp Mười','Cồn Thới Sơn','Biển Tân Thành (Gò Công)'],ds:['Hủ tiếu Mỹ Tho','Hủ tiếu Sa Đéc','Xoài Cao Lãnh','Nem Lai Vung','Vú sữa Lò Rèn'],tq:['Chùa Vĩnh Tràng','Khu di tích Gò Tháp','Nhà cổ Huỳnh Thủy Lê','Khu di tích Nguyễn Sinh Sắc','Di tích Rạch Gầm – Xoài Mút'],dd:['Làng hoa Sa Đéc','Chợ nổi Cái Bè','Cầu Rạch Miễu']},
p31:{dc:['Đảo Phú Quốc','Núi Sam','Rừng tràm Trà Sư','Núi Cấm','Quần đảo Nam Du','Hồ Tà Pạ'],ds:['Nước mắm Phú Quốc','Hồ tiêu Phú Quốc','Mắm Châu Đốc','Bún cá Châu Đốc','Đường thốt nốt'],tq:['Miếu Bà Chúa Xứ núi Sam','Lăng Thoại Ngọc Hầu','Chùa Tây An','Nhà tù Phú Quốc','Hòn Phụ Tử (Hà Tiên)'],dd:['Cáp treo Hòn Thơm','Chợ đêm Phú Quốc','Cửa khẩu Tịnh Biên','Thị trấn Hà Tiên']},
p32:{dc:['Cù lao An Bình','Ao Bà Om','Cồn Phụng','Biển Ba Động'],ds:['Kẹo dừa Bến Tre','Bánh tráng Mỹ Lồng','Bưởi Năm Roi','Bún nước lèo Trà Vinh','Sầu riêng Cái Mơn','Cam sành Tam Bình'],tq:['Chùa Âng','Văn Thánh Miếu Vĩnh Long','Khu lưu niệm Nguyễn Đình Chiểu','Chùa Hang (Trà Vinh)','Di tích Đồng Khởi (Bến Tre)'],dd:['Cầu Mỹ Thuận','Cầu Hàm Luông','Chợ nổi Trà Ôn','Làng gạch gốm Mang Thít']},
p33:{dc:['Sông Hậu','Cồn Sơn','Vườn cò Bằng Lăng','Khu bảo tồn Lung Ngọc Hoàng'],ds:['Bánh pía Sóc Trăng','Bún nước lèo Sóc Trăng','Lẩu mắm','Khóm Cầu Đúc','Bánh cống'],tq:['Nhà cổ Bình Thủy','Chùa Dơi','Chùa Chén Kiểu','Thiền viện Trúc Lâm Phương Nam','Chùa Ông (Cần Thơ)'],dd:['Chợ nổi Cái Răng','Bến Ninh Kiều','Cầu Cần Thơ','Chợ nổi Ngã Bảy']},
p34:{dc:['Mũi Cà Mau','Vườn quốc gia U Minh Hạ','Hòn Khoai','Rừng đước Năm Căn','Đầm Thị Tường'],ds:['Cua Cà Mau','Ba khía Rạch Gốc','Tôm khô Rạch Gốc','Mật ong rừng U Minh','Muối Bạc Liêu','Bánh tằm Cà Mau'],tq:['Nhà Công tử Bạc Liêu','Khu lưu niệm nhạc sĩ Cao Văn Lầu','Chùa Xiêm Cán','Quán âm Phật đài (Mẹ Nam Hải)'],dd:['Cột mốc tọa độ GPS 0001 (Đất Mũi)','Cánh đồng điện gió Bạc Liêu','Biểu tượng mũi tàu – Mũi Cà Mau']}
};
STOPS.forEach(s=>{const x=PX[s.id];if(x)Object.assign(s,x);});

/* Thêm câu hỏi về tổng quan và điểm nổi bật */
(function(){
  const pick=(a,n)=>shuffle(a).slice(0,n);
  STOPS.forEach(s=>{
    if(!s.pl||!s.dc)return;
    const others=STOPS.filter(o=>o!==s&&o.dc);
    const mine=new Set([].concat(s.dc,s.ds,s.tq,s.dd,s.pl));
    const wrong=(key)=>{const pool=[];others.forEach(o=>(o[key]||[]).forEach(v=>{if(!mine.has(v)&&pool.indexOf(v)<0)pool.push(v)}));return pick(pool,3)};
    const one=a=>pick(a,1)[0];
    const add=(q,key,kind)=>{const r=one(s[key]),w=wrong(key);if(w.length===3)s.qs.push([q,r,w[0],w[1],w[2],kind+' của '+s.s+': '+s[key].join(', ')+'.'])};
    add('Danh lam thắng cảnh nào sau đây thuộc '+s.s+'?','dc','Một số danh lam thắng cảnh');
    add('Đặc sản nào sau đây nổi tiếng của '+s.s+'?','ds','Đặc sản nổi tiếng');
    add('Di tích, nơi tham quan nào sau đây ở '+s.s+'?','tq','Những nơi tham quan nổi bật');
    add('Điểm dừng chân, check-in nào sau đây thuộc '+s.s+'?','dd','Điểm dừng chân nổi bật');
    const tt=s=>vvCap(s.tt.replace(/^Khu vực /,''));
    const tw=pick(others.map(tt).filter(x=>x!==tt(s)),3);
    s.qs.push(['Trung tâm hành chính của '+s.s+' đặt ở đâu?',tt(s),tw[0],tw[1],tw[2],'Trung tâm hành chính của '+s.s+': '+tt(s)+'.']);
    const fa=v=>'Khoảng '+vvNum(Math.round(v/100)*100)+' km²';
    const aw=[];shuffle(others.slice()).forEach(o=>{const t=fa(o.dt);if(t!==fa(s.dt)&&aw.indexOf(t)<0&&aw.length<3)aw.push(t)});
    s.qs.push(['Diện tích của '+s.s+' vào khoảng bao nhiêu?',fa(s.dt),aw[0],aw[1],aw[2],s.s+' rộng khoảng '+vvNum(s.dt,1)+' km², đứng thứ '+vvRank('dt',s)+'/34 cả nước.']);
    const pw=[];shuffle(others.slice()).forEach(o=>{const t=vvPop(o.dn);if(t!==vvPop(s.dn)&&pw.indexOf(t)<0&&pw.length<3)pw.push(t)});
    s.qs.push(['Dân số của '+s.s+' vào khoảng bao nhiêu?',vvCap(vvPop(s.dn)),vvCap(pw[0]),vvCap(pw[1]),vvCap(pw[2]),s.s+' có '+vvPop(s.dn)+', đứng thứ '+vvRank('dn',s)+'/34 cả nước.']);
  });
})();

/* Đoán địa danh: [tên, emoji, gợi ý 1, gợi ý 2] */
const PLACES=[
['Vịnh Hạ Long','⛰️🚢','Có hàng nghìn đảo đá vôi.','Di sản thiên nhiên thế giới ở miền Bắc.'],
['Phố cổ Hội An','🏮','Nổi tiếng với đèn lồng nhiều màu.','Có Chùa Cầu và món cao lầu.'],
['Chợ nổi Cái Răng','🛶🍍','Mua bán ngay trên sông nước.','Ở gần thành phố Cần Thơ.'],
['Đà Lạt','🌸🌲','Thành phố ngàn hoa trên cao nguyên.','Có hồ Xuân Hương.'],
['Sa Pa','🌾⛰️','Gần đỉnh Fansipan.','Ruộng bậc thang vàng vào mùa lúa chín.'],
['Phong Nha – Kẻ Bàng','🦇','Có nhiều hang động đá vôi kỳ vĩ.','Nơi có hang Sơn Đoòng, hang động lớn bậc nhất thế giới.'],
['Cột cờ Lũng Cú','🚩','Ở nơi địa đầu Tổ quốc.','Đánh dấu cực Bắc của Việt Nam.'],
['Tràng An','🛶⛰️','Du khách ngồi thuyền xuyên qua các hang động.','Gần cố đô Hoa Lư.'],
['Đảo Phú Quốc','🏝️','Hòn đảo lớn nhất Việt Nam.','Nổi tiếng với nước mắm và hồ tiêu.'],
['Kinh thành Huế','🏯','Có Ngọ Môn và sông Hương bên cạnh.','Kinh đô cuối cùng của chế độ phong kiến.'],
['Địa đạo Củ Chi','🕳️','Hệ thống đường hầm dưới lòng đất.','Nằm gần TP. Hồ Chí Minh.']
];

/* Đặc sản về đúng quê: [tên món, emoji, miền, ghi chú] */
const FOODS=[
['Phở','🍜','Bắc','Phở gắn bó với Hà Nội và Nam Định.'],
['Bún chả','🥢','Bắc','Món nổi tiếng của Hà Nội.'],
['Chả cá Lã Vọng','🐟','Bắc','Cá rán nghệ ăn với thì là, đặc sản Hà Nội.'],
['Cốm làng Vòng','🌾','Bắc','Cốm là thức quà thu của Hà Nội.'],
['Bánh cuốn Thanh Trì','🥟','Bắc','Bánh cuốn mỏng ăn kèm chả quế.'],
['Bún bò Huế','🍲','Trung','Đậm đà vị sả và mắm ruốc.'],
['Mì Quảng','🍜','Trung','Đặc sản của vùng Quảng Nam – Đà Nẵng.'],
['Cao lầu','🥘','Trung','Chỉ có ở Hội An.'],
['Bánh bèo chén','🥣','Trung','Món bánh nhỏ xinh của cố đô Huế.'],
['Nem lụi','🍢','Trung','Thịt nướng quấn bánh tráng, đặc sản Huế.'],
['Cơm tấm','🍚','Nam','Gạo tấm ăn với sườn nướng, hợp với Sài Gòn.'],
['Hủ tiếu Mỹ Tho','🍜','Nam','Món đặc trưng của miền Tây Nam Bộ.'],
['Lẩu mắm','🍲','Nam','Đặc sản vùng sông nước miền Tây.'],
['Bánh pía','🥮','Nam','Bánh nhân sầu riêng, đậu xanh nổi tiếng ở Sóc Trăng.']
];

/* Chuyến đi có ngân sách: b = ngân sách (nghìn đồng), d = số ngày, it = [tên, emoji, ngày, chi phí(nghìn đồng), điểm hài lòng] */
const TRIPS=[
{n:'Bắc Bộ 3 ngày',b:3000,d:3,it:[
 ['Dạo phố cổ & Hồ Gươm','🚶',0.5,100,6],['Ăn bún chả, phở, chả cá','🍜',0.5,250,7],['Du thuyền Vịnh Hạ Long','🚢',1,1100,10],
 ['Chèo thuyền Tràng An','🛶',1,400,9],['Chùa Bái Đính','🛕',0.5,150,5],['Văn Miếu & Bảo tàng','🏛️',0.5,80,5],
 ['Xem múa rối nước','🎭',0.5,120,5],['Spa cao cấp','💆',0.5,900,4],['Nhà hàng hải sản sang trọng','🦞',0.5,800,5],['Đạp xe quanh Hồ Tây','🚲',0.5,50,4]]},
{n:'Miền Trung 4 ngày',b:4500,d:4,it:[
 ['Tham quan Đại Nội Huế','🏯',0.5,200,8],['Thuyền trên sông Hương','⛵',0.5,150,6],['Ẩm thực cung đình Huế','🍲',0.5,150,6],
 ['Phố cổ Hội An về đêm','🏮',0.5,250,8],['Lớp học nấu ăn Hội An','👩‍🍳',0.5,600,6],['Bà Nà Hills','🎡',1,1200,9],
 ['Biển Mỹ Khê','🏖️',0.5,50,5],['Thánh địa Mỹ Sơn','🛕',0.5,300,7],['Đèo Hải Vân','🏍️',0.5,200,7],['Nghỉ resort 5 sao 1 đêm','🏨',1,2500,6]]},
{n:'Miền Nam 3 ngày',b:2500,d:3,it:[
 ['Dinh Độc Lập','🏛️',0.5,80,6],['Chợ Bến Thành & ẩm thực','🍜',0.5,250,7],['Địa đạo Củ Chi','🕳️',0.5,300,7],
 ['Chợ nổi Cái Răng','🛶',1,700,10],['Vườn trái cây miền Tây','🍍',0.5,150,6],['Phố đi bộ Nguyễn Huệ','🚶',0.5,50,4],
 ['Bảo tàng Chứng tích chiến tranh','🏛️',0.5,40,6],['Du thuyền ăn tối sang trọng','🍽️',0.5,1200,5],['Cà phê sách & quán cà phê','☕',0.5,100,4],['Bay trực thăng ngắm thành phố','🚁',0.5,1500,5]]}
];

/* ===================== KHUNG GIAO DIỆN ===================== */
root.innerHTML='<div class="vv-top"><h1 data-a="home">🧭 Khám phá Việt Nam</h1><span class="vv-chip" id="vv-pts"></span><span class="vv-chip" id="vv-badge"></span></div><div class="vv-main" id="vv-main"></div>';
const main=document.getElementById('vv-main');
let timer=null;
const stopTimer=()=>{if(timer){clearInterval(timer);timer=null}};
const draw=h=>{main.innerHTML=h};
function top(){
  document.getElementById('vv-pts').textContent='⭐ '+S.pts+' điểm';
  const n=STOPS.filter(s=>S.stamps[s.id]!=null).length;
  document.getElementById('vv-badge').textContent=n>=STOPS.length?'🏅 Người lữ hành':'🛂 '+n+'/'+STOPS.length+' con dấu';
}
function toast(t){const d=document.createElement('div');d.className='vv-toast';d.textContent=t;root.appendChild(d);setTimeout(()=>d.remove(),1800)}
function addPts(n){S.pts+=n;persist();top()}

const A={};
const NAVMAP={home:null,holidays:'home',hday:'holidays',hdq:'holidays',trip:'home',stop:'trip',startq:'trip',pass:'home',food:'home',guess:'home',budget:'home'};
let curScr='home';
root.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t||t.disabled)return;const f=A[t.dataset.a];if(f){if(Object.prototype.hasOwnProperty.call(NAVMAP,t.dataset.a))curScr=t.dataset.a;f(t.dataset,t)}});
window.vnvBack=function(){const p=NAVMAP[curScr];if(!p)return false;curScr=p;A[p]();const b=document.querySelector('#vnvOv .gm-body');if(b)b.scrollTop=0;return true;};

/* ===================== NHỮNG NGÀY QUAN TRỌNG TRONG NĂM =====================
   Thêm một ngày: thêm 1 dòng vào HD theo dạng
   {d:'ngày/tháng dương lịch' (hoặc l:'ngày/tháng âm lịch'),g:nhóm 0-3,ic:'biểu tượng',n:'tên ngày',y:'năm gốc',off:1 nếu là ngày nghỉ lễ,mt:'mô tả',ls:'lịch sử hình thành',yn:'ý nghĩa'} */
const HD_GROUPS=['Lễ, Tết truyền thống','Ngày kỷ niệm của đất nước, dân tộc','Ngày truyền thống các ngành, lực lượng','Ngày của các tổ chức và cộng đồng'];
const HD=[
{d:'1/1',g:0,ic:'🎆',n:'Tết Dương lịch',off:1,mt:'Ngày đầu tiên của năm mới theo lịch Dương (lịch Gregory), người lao động được nghỉ 1 ngày hưởng nguyên lương.',ls:'Lịch Gregory được dùng phổ biến trên thế giới; ở Việt Nam, lịch Dương được sử dụng chính thức trong hành chính và đời sống bên cạnh lịch Âm truyền thống.',yn:'Thời khắc khép lại năm cũ, mở đầu năm mới với những kế hoạch và mong ước tốt đẹp; nhiều nơi tổ chức đếm ngược, bắn pháo hoa.'},
{l:'1/1',g:0,ic:'🧧',n:'Tết Nguyên Đán',off:1,mt:'Tết cổ truyền lớn nhất của dân tộc, bắt đầu từ ngày mùng 1 tháng Giêng âm lịch. Người lao động được nghỉ 5 ngày.',ls:'"Nguyên" là bắt đầu, "Đán" là buổi sáng sớm – Tết Nguyên Đán là buổi sáng đầu tiên của năm mới. Phong tục đón Tết gắn với nền văn minh lúa nước: cúng ông Công ông Táo, gói bánh chưng, bánh tét, cúng tất niên, đón giao thừa, chúc Tết, lì xì.',yn:'Dịp sum họp gia đình, tưởng nhớ tổ tiên, gửi lời chúc phúc và khởi đầu một năm mới an lành, may mắn.'},
{l:'15/1',g:0,ic:'📜',n:'Rằm tháng Giêng – Ngày Thơ Việt Nam',mt:'Tết Nguyên tiêu (Rằm tháng Giêng) đồng thời là Ngày Thơ Việt Nam.',ls:'Từ năm 2003, Hội Nhà văn Việt Nam tổ chức Ngày Thơ Việt Nam vào dịp Rằm tháng Giêng, gợi nhớ bài thơ "Nguyên tiêu" (Rằm tháng Giêng) Bác Hồ viết năm 1948 ở chiến khu Việt Bắc.',yn:'Tôn vinh thơ ca, lan tỏa tình yêu tiếng Việt và văn học đến với mọi người.'},
{l:'10/3',g:0,ic:'🏺',n:'Giỗ Tổ Hùng Vương',off:1,mt:'Ngày tưởng nhớ các vua Hùng – những người có công dựng nước. Người lao động được nghỉ 1 ngày hưởng nguyên lương.',ls:'Lễ hội Đền Hùng (Phú Thọ) có từ lâu đời. Từ năm 2007, Giỗ Tổ Hùng Vương chính thức là ngày nghỉ lễ. Năm 2012, "Tín ngưỡng thờ cúng Hùng Vương ở Phú Thọ" được UNESCO ghi danh là Di sản văn hóa phi vật thể đại diện của nhân loại.',yn:'"Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng mười tháng ba" – ngày cả dân tộc hướng về cội nguồn, thể hiện đạo lý "uống nước nhớ nguồn".'},
{l:'5/5',g:0,ic:'🍑',n:'Tết Đoan Ngọ (Tết diệt sâu bọ)',mt:'Tết truyền thống giữa năm vào giữa trưa ngày mùng 5 tháng 5 âm lịch.',ls:'Theo quan niệm dân gian, đây là lúc dương khí mạnh nhất, cũng là thời điểm sâu bọ phát triển. Người dân ăn hoa quả chua, rượu nếp, bánh tro để "diệt sâu bọ", hái lá thuốc vào giờ Ngọ.',yn:'Cầu sức khỏe, mùa màng bội thu; giữ gìn nét đẹp văn hóa nông nghiệp.'},
{l:'15/7',g:0,ic:'🌹',n:'Lễ Vu Lan báo hiếu',mt:'Ngày lễ Rằm tháng Bảy, dịp con cháu tưởng nhớ, báo đáp công ơn cha mẹ, ông bà.',ls:'Bắt nguồn từ tích Mục Kiền Liên cứu mẹ trong Phật giáo; ở Việt Nam hòa quyện với tín ngưỡng thờ cúng tổ tiên. Tục "bông hồng cài áo": hoa hồng đỏ cho người còn mẹ, hoa trắng cho người đã mất mẹ.',yn:'Đề cao đạo hiếu, lòng biết ơn cha mẹ – một giá trị cốt lõi của người Việt.'},
{l:'15/8',g:0,ic:'🥮',n:'Tết Trung thu',mt:'Tết của thiếu nhi vào đêm trăng tròn nhất năm, rằm tháng Tám âm lịch.',ls:'Trung thu gắn với mùa thu hoạch và tục ngắm trăng; trẻ em rước đèn ông sao, đèn kéo quân, phá cỗ, múa lân, ăn bánh nướng, bánh dẻo. Hằng năm Bác Hồ đều gửi thư cho thiếu nhi nhân dịp Trung thu.',yn:'Thể hiện tình yêu thương, sự quan tâm của gia đình và xã hội dành cho trẻ em.'},
{l:'23/12',g:0,ic:'🐟',n:'Tết ông Công ông Táo',mt:'Ngày tiễn ông Táo về trời, mở đầu những ngày chuẩn bị đón Tết Nguyên Đán.',ls:'Theo tín ngưỡng dân gian, Táo quân trông coi việc bếp núc, mỗi năm về trời báo cáo với Ngọc Hoàng. Các gia đình cúng tiễn và thả cá chép làm "phương tiện" cho Táo quân.',yn:'Dịp dọn dẹp nhà cửa, tổng kết năm cũ, mong một năm mới đầm ấm, sung túc.'},

{d:'6/1',g:1,ic:'🗳️',n:'Ngày Tổng tuyển cử bầu Quốc hội đầu tiên',y:'1946',mt:'Kỷ niệm cuộc Tổng tuyển cử đầu tiên của nước Việt Nam Dân chủ Cộng hòa.',ls:'Ngày 6/1/1946, hơn 89% cử tri cả nước đi bầu Quốc hội khóa I, lần đầu tiên mọi công dân từ 18 tuổi, không phân biệt nam nữ, giàu nghèo, đều có quyền bầu cử.',yn:'Khẳng định tính chính danh của Nhà nước cách mạng và quyền làm chủ của nhân dân.'},
{d:'3/2',g:1,ic:'🚩',n:'Ngày thành lập Đảng Cộng sản Việt Nam',y:'1930',mt:'Kỷ niệm ngày ra đời của Đảng Cộng sản Việt Nam.',ls:'Đầu năm 1930, lãnh tụ Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất các tổ chức cộng sản tại Hương Cảng (Trung Quốc). Đại hội lần thứ III của Đảng (1960) quyết định lấy ngày 3/2 hằng năm làm ngày kỷ niệm thành lập Đảng.',yn:'Đánh dấu bước ngoặt của cách mạng Việt Nam, chấm dứt khủng hoảng về đường lối cứu nước.'},
{d:'30/4',g:1,ic:'🇻🇳',n:'Ngày Giải phóng miền Nam, thống nhất đất nước',y:'1975',off:1,mt:'Ngày nghỉ lễ, kỷ niệm chiến thắng lịch sử của Chiến dịch Hồ Chí Minh.',ls:'11 giờ 30 phút ngày 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập, chính quyền Sài Gòn tuyên bố đầu hàng, miền Nam hoàn toàn giải phóng.',yn:'Kết thúc 21 năm kháng chiến chống Mỹ, non sông thu về một mối, mở ra kỷ nguyên độc lập, thống nhất.'},
{d:'1/5',g:1,ic:'🛠️',n:'Ngày Quốc tế Lao động',y:'1886',off:1,mt:'Ngày của người lao động trên toàn thế giới; ở Việt Nam là ngày nghỉ lễ hưởng nguyên lương.',ls:'Bắt nguồn từ cuộc đấu tranh đòi ngày làm việc 8 giờ của công nhân Chicago (Mỹ) tháng 5/1886. Năm 1889, Quốc tế II lấy ngày 1/5 làm ngày đoàn kết của giai cấp công nhân. Ở Việt Nam, năm 1930 lần đầu có các cuộc mít tinh kỷ niệm ngày 1/5.',yn:'Tôn vinh người lao động, cổ vũ tinh thần đoàn kết vì việc làm, thu nhập và điều kiện làm việc tốt hơn.'},
{d:'7/5',g:1,ic:'🏆',n:'Ngày Chiến thắng Điện Biên Phủ',y:'1954',mt:'Kỷ niệm chiến thắng "lừng lẫy năm châu, chấn động địa cầu".',ls:'Sau 56 ngày đêm (13/3 – 7/5/1954), quân đội ta do Đại tướng Võ Nguyên Giáp chỉ huy đã tiêu diệt toàn bộ tập đoàn cứ điểm Điện Biên Phủ, bắt sống tướng Đờ Cát-tơ-ri.',yn:'Buộc Pháp ký Hiệp định Giơ-ne-vơ, kết thúc 9 năm kháng chiến; cổ vũ phong trào giải phóng dân tộc trên thế giới.'},
{d:'19/5',g:1,ic:'🌸',n:'Ngày sinh Chủ tịch Hồ Chí Minh',y:'1890',mt:'Kỷ niệm ngày sinh của Chủ tịch Hồ Chí Minh – lãnh tụ vĩ đại của dân tộc.',ls:'Bác sinh ngày 19/5/1890 tại làng Hoàng Trù (quê ngoại), xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Năm 1987, UNESCO ra nghị quyết tôn vinh Người là "Anh hùng giải phóng dân tộc, nhà văn hóa kiệt xuất".',yn:'Dịp học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh.'},
{d:'27/7',g:1,ic:'🕯️',n:'Ngày Thương binh – Liệt sĩ',y:'1947',mt:'Ngày tri ân các anh hùng liệt sĩ, thương binh, bệnh binh và người có công với cách mạng.',ls:'Ngày 27/7/1947, tại Đại Từ (Thái Nguyên), đại diện các ngành, đoàn thể đã họp và chọn ngày 27/7 làm "Ngày Thương binh toàn quốc". Năm 1955 đổi thành "Ngày Thương binh – Liệt sĩ". Bác Hồ gửi thư và góp chiếc áo lụa, một tháng lương để ủng hộ thương binh.',yn:'Thể hiện đạo lý "uống nước nhớ nguồn", "đền ơn đáp nghĩa" của dân tộc.'},
{d:'19/8',g:1,ic:'⭐',n:'Ngày Cách mạng tháng Tám thành công',y:'1945',mt:'Kỷ niệm thắng lợi của cuộc Tổng khởi nghĩa giành chính quyền.',ls:'Ngày 19/8/1945, hàng chục vạn nhân dân Hà Nội khởi nghĩa giành chính quyền; tiếp đó là Huế (23/8) và Sài Gòn (25/8). Chỉ trong khoảng 15 ngày, cách mạng thành công trên cả nước.',yn:'Đập tan ách thống trị của thực dân, phong kiến, đưa nhân dân ta từ thân phận nô lệ thành người làm chủ đất nước.'},
{d:'2/9',g:1,ic:'🇻🇳',n:'Quốc khánh nước Cộng hòa xã hội chủ nghĩa Việt Nam',y:'1945',off:1,mt:'Ngày Tết Độc lập của dân tộc. Người lao động được nghỉ 2 ngày (ngày 2/9 và một ngày liền kề).',ls:'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa – nay là nước Cộng hòa xã hội chủ nghĩa Việt Nam.',yn:'Khẳng định quyền độc lập, tự do của dân tộc Việt Nam trước toàn thế giới.'},
{d:'10/10',g:1,ic:'🏙️',n:'Ngày Giải phóng Thủ đô',y:'1954',mt:'Kỷ niệm ngày bộ đội ta tiếp quản Thủ đô Hà Nội.',ls:'Thi hành Hiệp định Giơ-ne-vơ, sáng 10/10/1954 các đơn vị Quân đội nhân dân Việt Nam tiến vào tiếp quản Hà Nội trong niềm vui của hàng chục vạn người dân. Chiều cùng ngày, lễ chào cờ được tổ chức trọng thể tại Cột cờ Hà Nội.',yn:'Hà Nội trở về với nhân dân, mở ra thời kỳ xây dựng Thủ đô trong hòa bình.'},
{d:'9/11',g:1,ic:'⚖️',n:'Ngày Pháp luật Việt Nam',y:'1946',mt:'Ngày nâng cao ý thức tôn trọng và chấp hành pháp luật của mọi người dân.',ls:'Ngày 9/11/1946, Quốc hội thông qua bản Hiến pháp đầu tiên của nước Việt Nam Dân chủ Cộng hòa. Luật Phổ biến, giáo dục pháp luật năm 2012 quy định ngày 9/11 hằng năm là Ngày Pháp luật, thực hiện từ năm 2013.',yn:'Đề cao tinh thần thượng tôn pháp luật, xây dựng Nhà nước pháp quyền.'},
{d:'18/11',g:1,ic:'🤝',n:'Ngày Đại đoàn kết toàn dân tộc',y:'1930',mt:'Ngày hội của khối đại đoàn kết, tổ chức tại các khu dân cư trên cả nước.',ls:'Ngày 18/11/1930, Hội Phản đế Đồng minh – tổ chức tiền thân của Mặt trận Tổ quốc Việt Nam – được thành lập. Từ năm 2003, ngày này được tổ chức thành "Ngày hội Đại đoàn kết toàn dân tộc".',yn:'"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công" – sức mạnh làm nên mọi thắng lợi.'},
{d:'23/11',g:1,ic:'🏯',n:'Ngày Di sản văn hóa Việt Nam',y:'1945',mt:'Ngày tôn vinh, bảo vệ và phát huy giá trị các di sản văn hóa của dân tộc.',ls:'Ngày 23/11/1945, Chủ tịch Hồ Chí Minh ký Sắc lệnh số 65 về bảo tồn cổ tích trên toàn cõi Việt Nam. Năm 2005, Thủ tướng Chính phủ quyết định lấy ngày 23/11 hằng năm là Ngày Di sản văn hóa Việt Nam.',yn:'Nhắc nhở mỗi người giữ gìn di sản – "hồn cốt" của dân tộc – cho các thế hệ mai sau.'},
{d:'24/11',g:1,ic:'🎭',n:'Ngày Văn hóa Việt Nam',y:'1946',off:1,mt:'Ngày tôn vinh văn hóa Việt Nam. Theo Nghị quyết của Quốc hội về phát triển văn hóa Việt Nam (thông qua năm 2026), người lao động được nghỉ làm việc, hưởng nguyên lương vào ngày này.',ls:'Ngày 24/11/1946, tại Hội nghị Văn hóa toàn quốc lần thứ nhất, Chủ tịch Hồ Chí Minh khẳng định: "Văn hóa phải soi đường cho quốc dân đi". Ngày 24/11 được chọn làm Ngày Văn hóa Việt Nam.',yn:'Khẳng định văn hóa là nền tảng tinh thần, là sức mạnh nội sinh của sự phát triển đất nước.'},
{d:'19/12',g:1,ic:'📣',n:'Ngày Toàn quốc kháng chiến',y:'1946',mt:'Kỷ niệm ngày cả dân tộc đứng lên kháng chiến chống thực dân Pháp.',ls:'Tối 19/12/1946, Chủ tịch Hồ Chí Minh ra "Lời kêu gọi toàn quốc kháng chiến": "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ". Quân dân Hà Nội chiến đấu 60 ngày đêm giam chân địch.',yn:'Biểu tượng của ý chí quyết tâm bảo vệ độc lập, tự do của dân tộc.'},
{d:'22/12',g:1,ic:'🎖️',n:'Ngày thành lập Quân đội nhân dân Việt Nam – Ngày hội Quốc phòng toàn dân',y:'1944',mt:'Ngày truyền thống của Quân đội nhân dân Việt Nam; từ năm 1989 đồng thời là Ngày hội Quốc phòng toàn dân.',ls:'Ngày 22/12/1944, tại khu rừng Trần Hưng Đạo (Cao Bằng), Đội Việt Nam Tuyên truyền Giải phóng quân gồm 34 chiến sĩ do đồng chí Võ Nguyên Giáp chỉ huy được thành lập, ngay sau đó đánh thắng hai đồn Phai Khắt, Nà Ngần.',yn:'Tôn vinh "Bộ đội Cụ Hồ" – quân đội từ nhân dân mà ra, vì nhân dân mà chiến đấu.'},

{d:'15/1',g:2,ic:'✈️',n:'Ngày truyền thống ngành Hàng không dân dụng Việt Nam',y:'1956',mt:'Ngày truyền thống của những người làm nghề hàng không.',ls:'Ngày 15/1/1956, Cục Hàng không dân dụng Việt Nam được thành lập theo Nghị định của Thủ tướng Chính phủ.',yn:'Ghi nhận sự phát triển của ngành hàng không, cầu nối Việt Nam với thế giới.'},
{d:'27/2',g:2,ic:'🩺',n:'Ngày Thầy thuốc Việt Nam',y:'1955',mt:'Ngày tôn vinh đội ngũ y, bác sĩ, dược sĩ và cán bộ ngành y tế.',ls:'Ngày 27/2/1955, Chủ tịch Hồ Chí Minh gửi thư cho Hội nghị cán bộ y tế với lời dặn nổi tiếng "Lương y phải như từ mẫu" (người thầy thuốc giỏi đồng thời phải như người mẹ hiền).',yn:'Tôn vinh nghề cao quý cứu người, nhắc nhở y đức của người thầy thuốc.'},
{d:'3/3',g:2,ic:'🛂',n:'Ngày truyền thống Bộ đội Biên phòng – Ngày Biên phòng toàn dân',y:'1959',mt:'Ngày truyền thống của lực lượng bảo vệ biên giới quốc gia.',ls:'Ngày 3/3/1959, lực lượng Công an nhân dân vũ trang (nay là Bộ đội Biên phòng) được thành lập. Từ năm 1989, ngày 3/3 đồng thời là Ngày Biên phòng toàn dân.',yn:'Nhấn mạnh trách nhiệm của toàn dân trong bảo vệ chủ quyền, an ninh biên giới.'},
{d:'15/3',g:2,ic:'🎬',n:'Ngày truyền thống Điện ảnh Việt Nam',y:'1953',mt:'Ngày truyền thống của những người làm điện ảnh.',ls:'Ngày 15/3/1953, Chủ tịch Hồ Chí Minh ký Sắc lệnh thành lập Doanh nghiệp quốc gia Chiếu bóng và Chụp ảnh Việt Nam tại chiến khu Việt Bắc.',yn:'Ghi nhận những đóng góp của điện ảnh trong việc phản ánh đời sống và lịch sử dân tộc.'},
{d:'27/3',g:2,ic:'🏃',n:'Ngày Thể thao Việt Nam',y:'1946',mt:'Ngày khuyến khích toàn dân rèn luyện thân thể, phát triển thể thao.',ls:'Ngày 27/3/1946, Chủ tịch Hồ Chí Minh ra "Lời kêu gọi toàn dân tập thể dục": "Mỗi một người dân yếu ớt, tức là cả nước yếu ớt; mỗi một người dân mạnh khỏe là cả nước mạnh khỏe".',yn:'Cổ vũ phong trào "Toàn dân rèn luyện thân thể theo gương Bác Hồ vĩ đại".'},
{d:'28/3',g:2,ic:'🪖',n:'Ngày truyền thống Dân quân tự vệ',y:'1935',mt:'Ngày truyền thống của lực lượng vũ trang quần chúng ở cơ sở.',ls:'Ngày 28/3/1935, Đại hội lần thứ nhất của Đảng (họp tại Ma Cao) thông qua Nghị quyết về đội tự vệ – văn kiện đầu tiên của Đảng về xây dựng lực lượng tự vệ.',yn:'Ghi nhận vai trò của lực lượng "vừa sản xuất, vừa chiến đấu" bảo vệ xóm làng.'},
{d:'27/4',g:2,ic:'📐',n:'Ngày Kiến trúc sư Việt Nam',y:'1948',mt:'Ngày truyền thống của giới kiến trúc sư.',ls:'Ngày 27/4/1948, tại Việt Bắc, Đoàn Kiến trúc sư Việt Nam (tiền thân của Hội Kiến trúc sư Việt Nam) được thành lập.',yn:'Tôn vinh những người kiến tạo không gian sống, đô thị và công trình của đất nước.'},
{d:'29/4',g:2,ic:'🏗️',n:'Ngày truyền thống ngành Xây dựng',y:'1958',mt:'Ngày truyền thống của ngành Xây dựng Việt Nam.',ls:'Ngày 29/4/1958, Bộ Kiến trúc (tiền thân của Bộ Xây dựng) được thành lập.',yn:'Ghi nhận những đóng góp của ngành trong việc xây dựng cơ sở hạ tầng, nhà ở, đô thị.'},
{d:'6/5',g:2,ic:'🏦',n:'Ngày truyền thống ngành Ngân hàng Việt Nam',y:'1951',mt:'Ngày truyền thống của ngành Ngân hàng.',ls:'Ngày 6/5/1951, Chủ tịch Hồ Chí Minh ký Sắc lệnh số 15/SL thành lập Ngân hàng Quốc gia Việt Nam – nay là Ngân hàng Nhà nước Việt Nam.',yn:'Ghi nhận vai trò của ngân hàng trong việc ổn định tiền tệ và phát triển kinh tế.'},
{d:'7/5',g:2,ic:'⚓',n:'Ngày thành lập Hải quân nhân dân Việt Nam',y:'1955',mt:'Ngày truyền thống của Quân chủng Hải quân.',ls:'Ngày 7/5/1955, Bộ Quốc phòng ra Nghị định thành lập Cục Phòng thủ bờ bể – tiền thân của Hải quân nhân dân Việt Nam. Ngày 5/8/1964, Hải quân ta đánh thắng trận đầu, đánh đuổi tàu khu trục Mỹ khỏi vùng biển miền Bắc.',yn:'Tôn vinh lực lượng nòng cốt bảo vệ chủ quyền biển, đảo thiêng liêng của Tổ quốc.'},
{d:'14/5',g:2,ic:'🏭',n:'Ngày truyền thống ngành Công Thương',y:'1951',mt:'Ngày truyền thống của ngành Công nghiệp và Thương mại.',ls:'Ngày 14/5/1951, Bộ Công Thương được thành lập (theo Sắc lệnh số 21/SL), đánh dấu sự ra đời của cơ quan quản lý nhà nước về công nghiệp và thương mại.',yn:'Ghi nhận vai trò của sản xuất và lưu thông hàng hóa đối với đời sống, kinh tế đất nước.'},
{d:'18/5',g:2,ic:'🔬',n:'Ngày Khoa học và Công nghệ Việt Nam',y:'1963',mt:'Ngày tôn vinh các nhà khoa học và hoạt động khoa học, công nghệ.',ls:'Ngày 18/5/1963, Chủ tịch Hồ Chí Minh đến dự và nói chuyện tại Đại hội lần thứ II Hội Phổ biến khoa học kỹ thuật Việt Nam. Từ năm 2013, ngày 18/5 hằng năm là Ngày Khoa học và Công nghệ Việt Nam.',yn:'Khẳng định khoa học, công nghệ là động lực quan trọng để phát triển đất nước.'},
{d:'21/6',g:2,ic:'📰',n:'Ngày Báo chí cách mạng Việt Nam',y:'1925',mt:'Ngày truyền thống của những người làm báo.',ls:'Ngày 21/6/1925, lãnh tụ Nguyễn Ái Quốc sáng lập báo Thanh Niên tại Quảng Châu (Trung Quốc) – tờ báo cách mạng đầu tiên của Việt Nam.',yn:'Tôn vinh báo chí – "vũ khí sắc bén" trên mặt trận tư tưởng, văn hóa.'},
{d:'15/7',g:2,ic:'🎒',n:'Ngày truyền thống lực lượng Thanh niên xung phong',y:'1950',mt:'Ngày truyền thống của các thế hệ thanh niên xung phong.',ls:'Ngày 15/7/1950, theo chỉ thị của Bác Hồ, đội Thanh niên xung phong công tác trung ương đầu tiên được thành lập, phục vụ Chiến dịch Biên giới.',yn:'Tôn vinh tinh thần "đâu cần thanh niên có, việc gì khó có thanh niên".'},
{d:'26/7',g:2,ic:'🏛️',n:'Ngày truyền thống ngành Kiểm sát nhân dân',y:'1960',mt:'Ngày truyền thống của Viện Kiểm sát nhân dân.',ls:'Ngày 26/7/1960, Chủ tịch Hồ Chí Minh ký lệnh công bố Luật Tổ chức Viện Kiểm sát nhân dân, đánh dấu sự ra đời của ngành Kiểm sát.',yn:'Ghi nhận vai trò kiểm sát hoạt động tư pháp, bảo vệ pháp luật và quyền con người.'},
{d:'15/8',g:2,ic:'📮',n:'Ngày truyền thống ngành Bưu điện',y:'1945',mt:'Ngày truyền thống của ngành Bưu chính, Viễn thông.',ls:'Ngày 15/8/1945, Ủy ban Khởi nghĩa toàn quốc quyết định tổ chức bộ phận giao thông liên lạc phục vụ Tổng khởi nghĩa; ngày này trở thành Ngày truyền thống ngành Bưu điện.',yn:'Ghi nhận vai trò thông tin liên lạc trong cách mạng và trong cuộc sống hiện đại.'},
{d:'19/8',g:2,ic:'👮',n:'Ngày truyền thống Công an nhân dân – Ngày hội Toàn dân bảo vệ an ninh Tổ quốc',y:'1945',mt:'Ngày truyền thống của lực lượng Công an nhân dân.',ls:'Ngày 19/8/1945, cùng với thắng lợi của Cách mạng tháng Tám, lực lượng Công an nhân dân ra đời. Từ năm 2005, ngày 19/8 đồng thời là Ngày hội Toàn dân bảo vệ an ninh Tổ quốc.',yn:'Tôn vinh lực lượng "vì nước quên thân, vì dân phục vụ".'},
{d:'28/8',g:2,ic:'🏢',n:'Ngày truyền thống của nhiều bộ, ngành',y:'1945',mt:'Ngày truyền thống chung của các ngành Ngoại giao, Tài chính, Tư pháp, Giao thông vận tải và một số ngành khác.',ls:'Ngày 28/8/1945, Chính phủ lâm thời nước Việt Nam Dân chủ Cộng hòa ra Tuyên cáo công bố danh sách thành viên, gồm các bộ đầu tiên của nhà nước cách mạng.',yn:'Đánh dấu sự ra đời của bộ máy nhà nước kiểu mới, phục vụ nhân dân.'},
{d:'10/9',g:2,ic:'🛃',n:'Ngày truyền thống Hải quan Việt Nam',y:'1945',mt:'Ngày truyền thống của ngành Hải quan.',ls:'Ngày 10/9/1945, Bộ trưởng Bộ Nội vụ Võ Nguyên Giáp ký Sắc lệnh thành lập Sở Thuế quan và Thuế gián thu – tổ chức tiền thân của Hải quan Việt Nam.',yn:'Ghi nhận vai trò "người gác cửa" kinh tế của đất nước.'},
{d:'13/9',g:2,ic:'⚖️',n:'Ngày truyền thống Tòa án nhân dân',y:'1945',mt:'Ngày truyền thống của ngành Tòa án.',ls:'Ngày 13/9/1945, Chủ tịch Hồ Chí Minh ký Sắc lệnh số 33C thành lập các Tòa án quân sự – mốc đánh dấu sự ra đời của hệ thống Tòa án nhân dân.',yn:'Đề cao công lý, công bằng và sự nghiêm minh của pháp luật.'},
{d:'13/10',g:2,ic:'💼',n:'Ngày Doanh nhân Việt Nam',y:'1945',mt:'Ngày tôn vinh đội ngũ doanh nhân.',ls:'Ngày 13/10/1945, Chủ tịch Hồ Chí Minh gửi thư cho giới công thương Việt Nam. Năm 2004, Thủ tướng Chính phủ quyết định lấy ngày 13/10 hằng năm là Ngày Doanh nhân Việt Nam.',yn:'Ghi nhận vai trò của doanh nhân trong phát triển kinh tế, tạo việc làm, làm giàu cho đất nước.'},
{d:'10/10',g:2,ic:'💻',n:'Ngày Chuyển đổi số quốc gia',y:'2022',mt:'Ngày thúc đẩy chuyển đổi số trên mọi lĩnh vực.',ls:'Năm 2022, Thủ tướng Chính phủ quyết định lấy ngày 10/10 hằng năm là Ngày Chuyển đổi số quốc gia.',yn:'Khuyến khích người dân, doanh nghiệp, cơ quan nhà nước ứng dụng công nghệ số.'},
{d:'22/10',g:2,ic:'🛩️',n:'Ngày truyền thống Bộ đội Phòng không – Không quân',y:'1963',mt:'Ngày truyền thống của Quân chủng Phòng không – Không quân.',ls:'Ngày 22/10/1963, Bộ Quốc phòng hợp nhất Bộ Tư lệnh Phòng không và Cục Không quân thành Quân chủng Phòng không – Không quân, lực lượng làm nên chiến thắng "Điện Biên Phủ trên không" năm 1972.',yn:'Tôn vinh những người bảo vệ vùng trời Tổ quốc.'},
{d:'12/11',g:2,ic:'⛏️',n:'Ngày truyền thống công nhân mỏ',y:'1936',mt:'Ngày truyền thống của công nhân ngành Than – Khoáng sản.',ls:'Ngày 12/11/1936, khoảng 3 vạn công nhân vùng mỏ Quảng Ninh tổng bãi công, buộc chủ mỏ Pháp phải tăng lương, giảm giờ làm.',yn:'Tôn vinh truyền thống "Kỷ luật và đồng tâm" của thợ mỏ.'},
{d:'14/11',g:2,ic:'🌾',n:'Ngày truyền thống ngành Nông nghiệp',y:'1945',mt:'Ngày truyền thống của ngành Nông nghiệp và Phát triển nông thôn.',ls:'Ngày 14/11/1945, Bộ Canh nông (tiền thân của ngành Nông nghiệp) được thành lập trong Chính phủ Liên hiệp lâm thời.',yn:'Ghi nhận vai trò của nông nghiệp – "trụ đỡ" của nền kinh tế.'},
{d:'20/11',g:2,ic:'👩‍🏫',n:'Ngày Nhà giáo Việt Nam',y:'1982',mt:'Ngày tôn vinh thầy cô giáo và những người làm công tác giáo dục.',ls:'Năm 1958 Việt Nam tham gia hoạt động của Hiến chương các nhà giáo quốc tế. Năm 1982, Hội đồng Bộ trưởng quyết định lấy ngày 20/11 hằng năm là Ngày Nhà giáo Việt Nam.',yn:'Thể hiện truyền thống "tôn sư trọng đạo", "uống nước nhớ nguồn" của dân tộc.'},
{d:'23/11',g:2,ic:'🔎',n:'Ngày truyền thống Thanh tra Việt Nam',y:'1945',mt:'Ngày truyền thống của ngành Thanh tra.',ls:'Ngày 23/11/1945, Chủ tịch Hồ Chí Minh ký Sắc lệnh số 64/SL thành lập Ban Thanh tra đặc biệt – tổ chức tiền thân của Thanh tra Việt Nam.',yn:'Góp phần giữ gìn kỷ cương, phòng chống tham nhũng, tiêu cực.'},
{d:'27/11',g:2,ic:'🛢️',n:'Ngày truyền thống ngành Dầu khí',y:'1961',mt:'Ngày truyền thống của ngành Dầu khí Việt Nam.',ls:'Ngày 27/11/1961, Đoàn Thăm dò dầu lửa 36 – tổ chức đầu tiên của ngành Dầu khí – được thành lập.',yn:'Ghi nhận ngành kinh tế mũi nhọn góp phần bảo đảm an ninh năng lượng.'},
{d:'21/12',g:2,ic:'⚡',n:'Ngày truyền thống ngành Điện lực',y:'1954',mt:'Ngày truyền thống của ngành Điện lực Việt Nam.',ls:'Ngày 21/12/1954, Chủ tịch Hồ Chí Minh đến thăm Nhà máy đèn Bờ Hồ (Hà Nội) vừa được tiếp quản; ngày này trở thành Ngày truyền thống ngành Điện.',yn:'Tôn vinh những người mang ánh sáng và năng lượng đến mọi miền đất nước.'},

{d:'9/1',g:3,ic:'🎓',n:'Ngày truyền thống Học sinh, Sinh viên Việt Nam',y:'1950',mt:'Ngày truyền thống của học sinh, sinh viên cả nước.',ls:'Ngày 9/1/1950, hàng nghìn học sinh, sinh viên Sài Gòn – Chợ Lớn xuống đường đấu tranh chống thực dân Pháp; anh Trần Văn Ơn hy sinh, trở thành biểu tượng của tuổi trẻ yêu nước.',yn:'Khơi dậy tinh thần yêu nước, ý chí vươn lên trong học tập của học sinh, sinh viên.'},
{d:'8/3',g:3,ic:'💐',n:'Ngày Quốc tế Phụ nữ',y:'1910',mt:'Ngày tôn vinh phụ nữ trên toàn thế giới.',ls:'Năm 1910, Hội nghị phụ nữ xã hội chủ nghĩa quốc tế đề xuất lấy một ngày hằng năm làm ngày quốc tế của phụ nữ, gắn với các cuộc đấu tranh của nữ công nhân đòi quyền bình đẳng; sau đó ngày 8/3 được chọn. Năm 1977, Liên Hợp Quốc chính thức công nhận.',yn:'Đề cao bình đẳng giới và những đóng góp của phụ nữ trong gia đình và xã hội.'},
{d:'26/3',g:3,ic:'🌟',n:'Ngày thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh',y:'1931',mt:'Ngày truyền thống của Đoàn Thanh niên.',ls:'Tháng 3/1931, Hội nghị Trung ương Đảng quyết định thành lập Đoàn Thanh niên Cộng sản Đông Dương. Đại hội Đoàn lần thứ III (1961) lấy ngày 26/3/1931 làm ngày thành lập Đoàn.',yn:'Đoàn là "đội dự bị tin cậy của Đảng", trường học của thanh niên Việt Nam.'},
{d:'21/4',g:3,ic:'📚',n:'Ngày Sách và Văn hóa đọc Việt Nam',y:'2014',mt:'Ngày khuyến khích phong trào đọc sách trong cộng đồng.',ls:'Năm 2014, Thủ tướng Chính phủ quyết định lấy ngày 21/4 hằng năm là Ngày Sách Việt Nam; từ năm 2022 đổi tên thành Ngày Sách và Văn hóa đọc Việt Nam.',yn:'Xây dựng thói quen đọc sách, nâng cao tri thức và văn hóa đọc của người Việt.'},
{d:'15/5',g:3,ic:'🧣',n:'Ngày thành lập Đội Thiếu niên Tiền phong Hồ Chí Minh',y:'1941',mt:'Ngày truyền thống của các bạn đội viên khăn quàng đỏ.',ls:'Ngày 15/5/1941, tại Pác Bó (Cao Bằng), Đội Nhi đồng Cứu vong – tiền thân của Đội Thiếu niên Tiền phong Hồ Chí Minh – được thành lập với 5 đội viên đầu tiên do anh Nông Văn Dền (Kim Đồng) làm đội trưởng.',yn:'Giáo dục thiếu niên theo 5 điều Bác Hồ dạy, trở thành "cháu ngoan Bác Hồ".'},
{d:'1/6',g:3,ic:'🎈',n:'Ngày Quốc tế Thiếu nhi',y:'1950',mt:'Ngày vì quyền lợi và hạnh phúc của trẻ em trên toàn thế giới.',ls:'Năm 1949, Liên đoàn Phụ nữ Dân chủ Quốc tế quyết định lấy ngày 1/6 làm ngày quốc tế bảo vệ thiếu nhi, tổ chức lần đầu năm 1950. Ở Việt Nam, tháng 6 hằng năm là Tháng hành động vì trẻ em.',yn:'Nhắc nhở cả xã hội chăm lo, bảo vệ trẻ em – "trẻ em hôm nay, thế giới ngày mai".'},
{d:'6/6',g:3,ic:'👴',n:'Ngày truyền thống Người cao tuổi Việt Nam',y:'1941',mt:'Ngày tôn vinh người cao tuổi.',ls:'Gắn với bức thư "Kính cáo đồng bào" lãnh tụ Nguyễn Ái Quốc gửi ngày 6/6/1941, kêu gọi các bậc phụ lão cùng toàn dân đoàn kết đánh đuổi giặc. Ngày 6/6 được chọn là Ngày truyền thống Người cao tuổi Việt Nam.',yn:'Thể hiện truyền thống "kính lão đắc thọ", ghi nhận vai trò "tuổi cao – gương sáng" của người cao tuổi.'},
{d:'28/6',g:3,ic:'👨‍👩‍👧',n:'Ngày Gia đình Việt Nam',y:'2001',mt:'Ngày tôn vinh giá trị gia đình.',ls:'Năm 2001, Thủ tướng Chính phủ quyết định lấy ngày 28/6 hằng năm là Ngày Gia đình Việt Nam.',yn:'Gia đình là tế bào của xã hội; ngày này nhắc nhở xây dựng gia đình "no ấm, bình đẳng, tiến bộ, hạnh phúc".'},
{d:'28/7',g:3,ic:'👷',n:'Ngày thành lập Công đoàn Việt Nam',y:'1929',mt:'Ngày truyền thống của tổ chức Công đoàn.',ls:'Ngày 28/7/1929, Tổng Công hội Đỏ Bắc Kỳ – tổ chức tiền thân của Công đoàn Việt Nam – được thành lập tại Hà Nội.',yn:'Công đoàn là tổ chức đại diện, chăm lo, bảo vệ quyền lợi hợp pháp của người lao động.'},
{d:'14/10',g:3,ic:'🌾',n:'Ngày thành lập Hội Nông dân Việt Nam',y:'1930',mt:'Ngày truyền thống của giai cấp nông dân Việt Nam.',ls:'Ngày 14/10/1930, Hội nghị Trung ương Đảng lần thứ nhất ra quyết định thành lập Nông hội đỏ – tổ chức tiền thân của Hội Nông dân Việt Nam.',yn:'Tôn vinh người nông dân – lực lượng đông đảo, gắn bó với đất nước.'},
{d:'15/10',g:3,ic:'🙋',n:'Ngày truyền thống Hội Liên hiệp Thanh niên Việt Nam',y:'1956',mt:'Ngày truyền thống của Hội Liên hiệp Thanh niên Việt Nam.',ls:'Ngày 15/10/1956, Hội Liên hiệp Thanh niên Việt Nam được thành lập tại Đại hội đại biểu toàn quốc ở Hà Nội.',yn:'Tập hợp, đoàn kết rộng rãi thanh niên Việt Nam trong và ngoài nước.'},
{d:'20/10',g:3,ic:'🌺',n:'Ngày Phụ nữ Việt Nam',y:'1930',mt:'Ngày tôn vinh phụ nữ Việt Nam, kỷ niệm ngày thành lập Hội Liên hiệp Phụ nữ Việt Nam.',ls:'Ngày 20/10/1930, Hội Phụ nữ phản đế Đông Dương – tiền thân của Hội Liên hiệp Phụ nữ Việt Nam – được thành lập.',yn:'Ghi nhận phẩm chất "Anh hùng, bất khuất, trung hậu, đảm đang" của phụ nữ Việt Nam.'},
{d:'6/12',g:3,ic:'🎖️',n:'Ngày truyền thống Hội Cựu chiến binh Việt Nam',y:'1989',mt:'Ngày truyền thống của các cựu chiến binh.',ls:'Ngày 6/12/1989, Hội Cựu chiến binh Việt Nam được thành lập.',yn:'Phát huy bản chất "Bộ đội Cụ Hồ" của những người lính trong thời bình.'}
];
const HD_NOW=()=>{const t=new Date();return new Date(t.getFullYear(),t.getMonth(),t.getDate())};
/* Ngày diễn ra sắp tới (kể cả hôm nay). Ngày âm lịch dùng bộ chuyển lịch của app 6PAY nếu có. */
function hdNext(h){
  const t=HD_NOW();
  if(h.d){const [dd,mm]=h.d.split('/').map(Number);let x=new Date(t.getFullYear(),mm-1,dd);if(x<t)x=new Date(t.getFullYear()+1,mm-1,dd);return x}
  if(typeof window.convertSolar2Lunar!=='function')return null;
  const [ld,lm]=h.l.split('/').map(Number);
  for(let k=0;k<400;k++){const x=new Date(t.getFullYear(),t.getMonth(),t.getDate()+k);const L=window.convertSolar2Lunar(x.getDate(),x.getMonth()+1,x.getFullYear(),7);if(L[0]===ld&&L[1]===lm&&!L[3])return x}
  return null;
}
function hdDays(h){const x=hdNext(h);return x?Math.round((x-HD_NOW())/86400000):null}
function hdLabel(h){return h.d?h.d:h.l+' âm lịch'}
function hdSortKey(h){const p=(h.d||h.l).split('/').map(Number);return (h.l?0:0)+p[1]*100+p[0]}
let hdGrp=-1;
function hdFree(i){
  if(LKOPEN())return true;
  const g=HD[i].g,ord=HD.map((x,k)=>k).filter(k=>HD[k].g===g).sort((a,b)=>hdSortKey(HD[a])-hdSortKey(HD[b])||a-b);
  return ord.indexOf(i)<LKFREE(ord.length);
}
function hdCount(n){return n===0?'Hôm nay':n===1?'Ngày mai':'Còn '+n+' ngày'}
function hdList(){
  stopTimer();
  const tabs=['Tất cả'].concat(HD_GROUPS).map((g,k)=>`<button class="hd-tab ${hdGrp===k-1?'on':''}" data-a="hdgrp" data-g="${k-1}">${esc(g)}</button>`).join('');
  const withDays=HD.map((h,i)=>({h,i,n:hdDays(h)})).filter(o=>o.n!==null).sort((a,b)=>a.n-b.n);
  const nx=withDays[0];
  const soon=nx?`<button class="hd-next" data-a="hday" data-i="${nx.i}"><span class="hd-nx-l">${hdCount(nx.n)}</span><span class="hd-nx-ic">${nx.h.ic}</span><span><b>${esc(nx.h.n)}</b><small>${esc(hdLabel(nx.h))}</small></span></button>`:'';
  let h='';
  HD_GROUPS.forEach((g,gi)=>{
    if(hdGrp>=0&&hdGrp!==gi)return;
    const items=HD.map((x,i)=>({x,i})).filter(o=>o.x.g===gi).sort((a,b)=>hdSortKey(a.x)-hdSortKey(b.x));
    h+=`<h3 class="hd-gh">${esc(g)} <small>(${items.length})</small></h3>`+items.map(o=>{const n=hdDays(o.x);
      return `<button class="hd-item" data-a="hday" data-i="${o.i}"><span class="hd-date ${o.x.l?'lunar':''}"><b>${esc((o.x.d||o.x.l))}</b><small>${o.x.l?'âm lịch':'dương lịch'}</small></span><span class="hd-ic">${hdFree(o.i)?o.x.ic:'🔒'}</span><span class="hd-t"><b>${esc(o.x.n)}</b><small>${o.x.off?'🎌 Ngày nghỉ lễ · ':''}${n!==null?hdCount(n):''}</small></span><span class="hd-go">›</span></button>`}).join('');
  });
  draw(`<h2 class="vv-h2">📅 Những ngày quan trọng trong năm</h2><p class="vv-sub">${HD.length} ngày lễ, ngày kỷ niệm của đất nước, dân tộc và ngày truyền thống của các ngành, tổ chức. Chạm vào từng ngày để đọc mô tả, lịch sử và ý nghĩa.</p>
  <div class="vv-row" style="margin:0 0 10px"><button class="vv-btn" data-a="hdq" data-i="">🎯 Bắt đầu thử thách (10 câu ngẫu nhiên)</button></div>
  ${soon?'<div class="hd-soon-h">⏳ Sắp tới gần nhất</div>'+soon:''}
  <div class="hd-tabs">${tabs}</div>${h}
  <div class="vv-row"><button class="vv-btn alt sm" data-a="home">← Về trang chủ</button></div>`);
}
A.holidays=hdList;
A.hdgrp=d=>{hdGrp=+d.g;hdList()};
A.hday=d=>{
  if(!hdFree(+d.i))return LKASK(()=>{curScr='hday';A.hday(d)});
  const i=+d.i,h=HD[i],n=hdDays(h),nx=hdNext(h);
  const sec=(t,v)=>v?`<div class="hd-sec"><b>${t}</b><p>${esc(v)}</p></div>`:'';
  const order=HD.map((x,k)=>k).sort((a,b)=>hdSortKey(HD[a])-hdSortKey(HD[b])||a-b);
  const pos=order.indexOf(i),prev=order[pos-1],next=order[pos+1];
  draw(`<div class="vv-center"><div class="vv-big">${h.ic}</div></div>
  <h2 class="vv-h2 vv-center">${esc(h.n)}</h2>
  <div class="hd-meta"><span>🗓️ ${esc(hdLabel(h))}</span>${h.y?`<span>📌 Mốc gốc: ${esc(h.y)}</span>`:''}${h.off?'<span class="off">🎌 Ngày nghỉ lễ</span>':''}${n!==null?`<span>⏳ ${hdCount(n)}${nx&&n>1?' ('+nx.toLocaleDateString('vi-VN')+')':''}</span>`:''}</div>
  <div class="vv-story hd-detail">${sec('📖 Giới thiệu',h.mt)}${sec('🏛️ Lịch sử hình thành',h.ls)}${sec('🌟 Ý nghĩa',h.yn)}</div>
  <div class="vv-row">${prev!==undefined?`<button class="vv-btn alt" data-a="hday" data-i="${prev}">◀ Ngày trước</button>`:''}${next!==undefined?`<button class="vv-btn" data-a="hday" data-i="${next}">Ngày tiếp theo ▶</button>`:''}<button class="vv-btn alt" data-a="holidays">☰ Danh sách</button></div>
  <div class="vv-row"><button class="vv-btn" data-a="hdq" data-i="${i}">🎯 Bắt đầu thử thách về ngày này</button></div>`);
  const b=document.querySelector('#vnvOv .gm-body');if(b)b.scrollTop=0;
};
(function(){const st=document.createElement('style');st.textContent=
'.px-box{border-left-color:var(--gold)}.px-sec{padding:6px 0;border-top:1px dashed var(--line)}.px-sec:first-child{border-top:0;padding-top:0}.px-sec b{display:block;margin-bottom:4px}.px-tags{display:flex;flex-wrap:wrap;gap:6px}.px-tags span{background:#e3f6f1;color:var(--ink);border-radius:99px;padding:3px 10px;font-size:13.5px}'+
'.hd-tabs{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px;margin:12px 0 4px}'+
'.hd-tab{flex:none;border:1px solid var(--line);background:var(--paper);border-radius:99px;padding:6px 12px;font-size:13px;white-space:nowrap}'+
'.hd-tab.on{background:var(--main);border-color:var(--main);color:#fff!important}'+
'.hd-gh{font-size:15px;color:var(--main);margin:14px 0 8px}.hd-gh small{color:var(--muted);font-weight:400}'+
'.hd-item{display:flex;align-items:center;gap:10px;width:100%;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:8px 12px;margin-bottom:8px;text-align:left}'+
'.hd-date{flex:none;width:62px;text-align:center;background:#e3f6f1;color:var(--main);border-radius:10px;padding:5px 2px;line-height:1.15}'+
'.hd-date b{display:block;font-size:17px}.hd-date small{font-size:11px;opacity:.8}.hd-date.lunar{background:#fff3d6;color:#9a6a00}'+
'.hd-ic{flex:none;font-size:24px}.hd-t{flex:1;min-width:0}.hd-t b{display:block;font-size:15px;line-height:1.35}.hd-t small{color:var(--muted);font-size:12.5px}'+
'.hd-go{color:var(--gold);font-size:22px;font-weight:700}'+
'.hd-soon-h{font-size:13px;font-weight:700;color:var(--muted);margin:4px 0 6px}'+
'.hd-next{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:linear-gradient(135deg,#0f766e,#14a38f);color:#fff!important;border:0;border-radius:14px;padding:12px 14px}'+
'.hd-next b{display:block;font-size:16px;line-height:1.3}.hd-next small{opacity:.9}.hd-nx-ic{font-size:30px}'+
'.hd-nx-l{flex:none;background:rgba(255,255,255,.2);border-radius:10px;padding:6px 8px;font-weight:800;font-size:13px;text-align:center;max-width:80px}'+
'.hd-meta{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 10px}.hd-meta span{background:var(--paper);border:1px solid var(--line);border-radius:99px;padding:4px 10px;font-size:13px}.hd-meta .off{background:#fde8e8;border-color:#f5c2c2;color:#b42318}'+
'.hd-sec{padding:8px 0;border-top:1px dashed var(--line)}.hd-sec:first-child{border-top:0;padding-top:0}.hd-sec b{display:block;color:var(--main);margin-bottom:2px}.hd-sec p{margin:0;font-size:15px;line-height:1.6}';
document.head.appendChild(st);})();

/* ===================== THỬ THÁCH: NHỮNG NGÀY QUAN TRỌNG ===================== */
function hdMake(i){
  const h=HD[i],others=HD.filter((x,k)=>k!==i),lab=hdLabel(h);
  const wl=()=>{const pool=[];shuffle(others).forEach(o=>{const v=hdLabel(o);if(v!==lab&&pool.indexOf(v)<0)pool.push(v)});return pool.slice(0,3)};
  const wn=()=>{const pool=[];shuffle(others).forEach(o=>{if(hdLabel(o)!==lab&&pool.indexOf(o.n)<0)pool.push(o.n)});return pool.slice(0,3)};
  const qs=[];
  qs.push({q:'"'+h.n+'" vào ngày nào?',a:lab,w:wl(),ex:h.n+': '+lab+'. '+h.mt});
  qs.push({q:'Ngày '+lab+' là ngày gì?',a:h.n,w:wn(),ex:'Ngày '+lab+' là '+h.n+'. '+h.mt});
  if(h.y){const pool=[];shuffle(others).forEach(o=>{if(o.y&&o.y!==h.y&&pool.indexOf(o.y)<0)pool.push(o.y)});
    qs.push({q:'"'+h.n+'" gắn với mốc lịch sử năm nào?',a:h.y,w:pool.slice(0,3),ex:h.ls});}
  qs.push({q:'"'+h.n+'" thuộc nhóm nào?',a:HD_GROUPS[h.g],w:HD_GROUPS.filter(g=>g!==HD_GROUPS[h.g]),ex:h.n+' thuộc nhóm: '+HD_GROUPS[h.g]+'.'});
  return qs.filter(q=>q.w.length===3);
}
function hdOffQ(){
  const on=HD.filter(h=>h.off),off=HD.filter(h=>!h.off),a=shuffle(on)[0];
  return {q:'Ngày nào sau đây là ngày nghỉ lễ, người lao động được nghỉ hưởng nguyên lương?',a:a.n,w:shuffle(off).slice(0,3).map(o=>o.n),ex:'Các ngày nghỉ lễ: '+on.map(o=>o.n).join(', ')+'.'};
}
let HQ=null;
A.hdq=d=>{
  const one=d&&d.i!==undefined&&d.i!==''?+d.i:-1;
  let qs;
  if(one>=0)qs=shuffle(hdMake(one));
  else{qs=shuffle(HD.map((h,i)=>i).filter(hdFree)).slice(0,9).map(i=>shuffle(hdMake(i))[0]);qs.push(hdOffQ());qs=shuffle(qs)}
  HQ={one:one,qs:qs,n:0,ok:0,pick:null,opts:[]};hdqDraw();
};
function hdqDraw(){
  const tot=HQ.qs.length;
  const b=document.querySelector('#vnvOv .gm-body');if(b)b.scrollTop=0;
  if(HQ.n>=tot){
    const pct=HQ.ok/tot,st=pct>=0.9?3:pct>=0.7?2:pct>=0.5?1:0;if(!HQ.done){HQ.done=1;if(st>=2)SFX('win')}
    draw(`<div class="vv-center"><div class="vv-big">${st?'📅':'💪'}</div><h2 class="vv-h2">Đúng ${HQ.ok}/${tot} câu</h2>
    <div style="color:var(--gold);font-size:30px;letter-spacing:3px">${'★'.repeat(st)}${'☆'.repeat(3-st)}</div>
    <p>${st===3?'Tuyệt vời! Bạn nhớ rất rõ những ngày quan trọng.':st?'Khá lắm! Đọc lại để nhớ chắc hơn nhé.':'Hãy đọc lại thông tin các ngày rồi thử lại nhé.'}</p></div>
    <div class="vv-row" style="justify-content:center"><button class="vv-btn" data-a="hdq" data-i="${HQ.one>=0?HQ.one:''}">↻ Làm lại</button>${HQ.one>=0?`<button class="vv-btn alt" data-a="hday" data-i="${HQ.one}">📖 Đọc lại ngày này</button>`:''}<button class="vv-btn alt" data-a="holidays">☰ Danh sách ngày</button></div>`);
    return;
  }
  const q=HQ.qs[HQ.n];if(!HQ.opts.length)HQ.opts=shuffle([q.a].concat(q.w));
  const p=HQ.pick;
  draw(`<div class="vv-prog"><i style="width:${(HQ.n+(p!==null?1:0))/tot*100}%"></i></div>
  <small class="vv-sub">📅 Thử thách ngày quan trọng · Câu ${HQ.n+1}/${tot} · Đã đúng: ${HQ.ok}</small>
  <div class="vv-q">${esc(q.q)}</div>`+
  HQ.opts.map((o,i)=>{let c='';if(p!==null){if(o===q.a)c='ok';else if(i===p)c='bad'}
    return `<button class="vv-opt ${c}" data-a="hdqa" data-i="${i}" ${p!==null?'disabled':''}>${esc(o)}</button>`}).join('')+
  (p!==null?`<div class="vv-note">${HQ.opts[p]===q.a?'✅ Chính xác! +10 điểm. ':'❌ Chưa đúng. '}${esc(q.ex)}</div>
  <button class="vv-btn" data-a="hdqn">${HQ.n+1<tot?'Câu tiếp theo ▶':'Xem kết quả ▶'}</button>`:''));
}
A.hdqa=d=>{if(HQ.pick!==null)return;HQ.pick=+d.i;if(HQ.opts[HQ.pick]===HQ.qs[HQ.n].a){HQ.ok++;addPts(10);SFX('ok')}else SFX('bad');hdqDraw()};
A.hdqn=()=>{HQ.n++;HQ.pick=null;HQ.opts=[];hdqDraw()};

/* ===================== TRANG CHỦ ===================== */
function home(){
  stopTimer();top();
  draw(`<h2 class="vv-h2">Sẵn sàng cho chuyến đi xuyên Việt chưa?</h2>
  <p class="vv-sub">Thu thập đủ ${STOPS.length} con dấu của ${STOPS.length} tỉnh, thành phố để nhận danh hiệu <b>Người lữ hành</b>.</p>
  <div class="vv-grid">
   <button class="vv-mode" data-a="trip"><span class="big">🗺️</span><b>Hành trình xuyên Việt</b><small>Bản đồ hình chữ S, ${STOPS.length} điểm dừng, mỗi nơi có thử thách và một con dấu.</small></button>
   <button class="vv-mode" data-a="holidays"><span class="big">📅</span><b>Những ngày quan trọng trong năm</b><small>${HD.length} ngày lễ, ngày kỷ niệm và ngày truyền thống các ngành: mô tả, lịch sử, ý nghĩa.</small></button>
   <button class="vv-mode" data-a="food"><span class="big">🍜</span><b>Đặc sản về đúng quê</b><small>Món ăn này thuộc miền nào? Kỷ lục: ${S.best.food}</small></button>
   <button class="vv-mode" data-a="guess"><span class="big">🔍</span><b>Đoán địa danh qua ảnh mờ</b><small>Hình rõ dần theo thời gian, đoán càng sớm càng nhiều điểm. Kỷ lục: ${S.best.guess}</small></button>
   <button class="vv-mode" data-a="budget"><span class="big">💰</span><b>Chuyến đi có ngân sách</b><small>Chọn hoạt động trong giới hạn tiền và số ngày để vui nhất. Kỷ lục: ${S.best.trip}</small></button>
   <button class="vv-mode" data-a="pass"><span class="big">🛂</span><b>Hộ chiếu của tôi</b><small>Xem các con dấu bạn đã sưu tầm.</small></button>
  </div>
  <div class="vv-row"><button class="vv-btn alt sm" data-a="reset">🗑️ Xóa tiến trình</button></div>`);
}
A.home=home;
A.reset=()=>{if(confirm('Xóa toàn bộ điểm và tiến trình?')){S=DEF();persist();home()}};

/* ===== Bản đồ Việt Nam: dựng lại theo bản đồ hành chính (toạ độ theo ảnh gốc 600×828) ===== */
const VN_VIEW='24 38 536 774';
/* Trung Quốc (kèm đảo Hải Nam), Lào, Thái Lan, Campuchia */
const VN_NB=[["#fffbd5","M457 217L446 211L441 211L435 214L416 214L407 219L389 216L384 221L374 223L369 226L367 235L361 237L353 245L346 249L345 259L343 262L343 279L346 284L346 293L369 305L378 305L388 308L397 307L400 301L415 297L418 291L433 283L433 277L444 249L453 238L459 236L460 225ZM20 34L20 89L22 92L43 91L54 76L65 81L76 92L81 92L85 85L91 80L93 75L97 77L99 82L103 82L106 77L109 77L114 82L116 88L123 89L126 81L132 74L136 74L138 79L144 79L153 73L159 73L164 69L164 59L169 55L183 50L185 47L188 47L199 61L203 62L211 69L217 69L221 66L225 66L232 72L246 70L253 76L252 83L244 89L244 98L250 104L250 114L264 120L272 130L278 131L281 135L286 135L289 137L306 135L311 140L317 140L320 137L329 136L330 133L337 133L339 128L344 128L348 133L354 133L357 136L363 136L366 138L367 146L384 144L389 141L390 137L393 138L393 141L402 142L404 146L398 149L398 155L394 158L393 174L398 176L398 187L404 194L404 200L407 203L413 203L414 206L428 205L436 197L436 190L426 183L426 174L416 172L415 168L421 163L427 163L431 156L440 155L440 150L443 147L458 145L459 141L475 143L477 138L486 139L488 137L492 137L496 133L497 128L502 128L503 122L506 122L508 125L513 125L518 129L522 129L526 125L535 126L542 119L551 120L553 118L552 108L555 105L555 100L560 99L561 97L565 97L571 103L579 103L578 33Z"],["#fad5e6","M20 91L20 306L28 306L31 310L36 310L38 308L53 308L55 310L73 308L75 311L80 311L88 303L88 299L90 297L106 303L119 303L129 315L136 328L156 348L157 357L152 365L152 395L167 411L184 419L181 426L181 431L185 436L193 441L192 446L186 451L186 455L189 457L187 466L193 471L190 482L190 494L185 499L173 506L173 510L180 517L193 516L195 518L199 518L210 526L221 526L223 524L223 516L218 510L217 506L225 505L228 501L235 500L237 496L242 497L253 507L264 507L266 504L273 504L279 496L289 495L289 491L292 489L293 476L290 471L295 468L296 452L289 446L285 445L276 433L278 429L287 424L288 418L282 417L271 409L271 406L266 405L258 395L254 395L252 397L249 396L243 383L242 371L233 362L232 356L227 356L224 354L214 341L202 330L199 323L199 318L193 315L193 311L191 309L187 309L178 302L174 295L176 289L176 284L174 282L153 275L147 269L133 261L130 257L118 252L118 250L125 244L125 235L127 233L134 232L145 236L152 236L161 227L163 221L168 216L167 210L152 203L153 194L145 194L145 192L152 186L152 181L146 179L132 167L125 167L121 170L113 171L108 179L103 178L99 174L90 174L79 165L70 151L72 140L76 137L75 129L71 128L70 126L61 128L59 118L36 90L26 89Z"],["#e4eaac","M122 301L110 302L97 296L88 296L85 302L79 306L75 317L65 317L56 324L53 324L48 318L34 316L29 312L24 312L24 315L20 316L20 597L24 597L26 599L25 608L30 612L50 616L50 609L53 602L53 595L41 583L40 566L34 558L34 542L36 540L42 540L42 537L52 530L69 507L77 503L87 503L92 500L96 500L100 503L144 503L155 500L163 505L166 512L170 512L180 504L188 501L191 497L191 486L195 474L195 468L190 464L192 460L190 452L194 448L194 438L184 429L187 422L187 417L177 414L171 410L153 391L154 369L158 361L157 344L132 318L130 312Z"],["#fdd8c6","M293 489L288 489L285 493L277 494L272 501L265 501L262 505L255 505L244 494L236 493L232 498L227 498L224 503L214 505L214 509L221 519L218 525L214 525L198 515L182 515L175 508L167 509L164 501L160 499L149 499L143 501L115 501L90 498L85 501L74 500L66 505L52 525L40 534L40 538L31 540L31 552L34 564L39 570L40 587L51 597L49 615L52 623L54 624L55 632L61 636L64 646L66 647L66 677L68 679L82 678L84 668L88 665L94 669L94 674L96 677L95 683L88 684L86 687L86 694L91 698L104 695L110 697L122 696L125 700L129 700L131 703L138 703L142 698L157 698L167 688L167 678L181 680L185 676L196 676L202 674L205 680L211 680L216 684L221 684L222 670L208 658L207 642L212 641L217 636L224 637L228 640L234 640L238 623L263 621L276 609L288 610L293 604L294 590L289 571L295 560L295 541L289 532L289 525L284 519L284 515L286 514L286 506L291 500Z"]];
/* 34 tỉnh/thành sau sáp nhập: [màu, đường viền, tên] (dựng lại theo ảnh bản đồ 34 tỉnh thành) */
const VN_PROV=[["#f6d55c","M42.2 74.2L41.5 76.8L40.5 77.8L40.5 80.5L41.2 81.8L44.8 85.5L50.8 86.2L53.2 87.2L62.2 96.2L62.8 98.5L67.2 103.2L67.2 103.8L71.2 107.2L73.8 108.2L74.2 108.8L78.8 109.5L79.8 110.5L83.8 111.2L85.2 112.2L87.2 112.2L88.5 111.2L89.8 111.5L90.8 110.5L94.8 109.8L98.5 108.2L100.5 108.2L101.5 109.2L101.8 111.5L99.8 115.2L99.8 125.5L100.8 125.8L101.5 124.5L101.5 121.2L100.8 120.8L101.8 115.8L104.2 115.2L106.2 117.2L107.2 120.2L110.2 122.8L114.2 128.2L120.5 129.2L120.8 129.8L122.5 130.5L124.8 130.5L126.2 131.5L128.2 131.5L129.5 132.2L135.2 131.2L137.2 131.5L137.8 132.5L137.8 135.2L137.2 135.5L137.2 140.2L138.2 141.2L138.8 143.5L142.5 146.5L148.2 147.2L150.8 146.2L151.2 145.5L153.2 145.5L154.5 146.5L158.2 146.5L159.8 147.2L160.2 147.8L162.5 148.5L164.5 150.5L164.8 152.8L165.8 153.8L165.5 160.2L166.5 161.2L165.8 165.5L166.8 166.5L167.8 169.2L172.5 173.5L174.2 176.2L173.8 177.5L171.2 179.8L167.2 179.8L165.5 180.8L164.2 182.5L164.2 184.2L164.8 184.8L166.5 184.8L166.5 183.8L167.8 182.2L172.5 181.2L175.2 178.8L175.8 175.8L176.5 175.2L168.5 166.8L167.8 162.5L167.8 156.5L167.2 155.2L167.2 153.2L166.5 152.8L166.8 150.5L166.2 150.2L166.2 148.5L164.2 147.8L162.2 146.2L160.5 146.2L160.2 145.5L157.5 144.5L148.5 144.2L147.5 145.2L146.2 145.2L144.8 144.2L142.5 144.2L140.2 141.8L139.5 140.2L139.8 133.2L139.2 130.5L138.5 129.8L133.5 129.5L132.5 130.2L127.8 130.2L126.5 129.2L121.8 128.5L121.5 127.8L117.5 127.5L111.8 123.2L109.5 119.2L108.5 118.5L107.5 115.8L105.2 113.5L103.8 111.2L103.8 107.2L105.5 105.5L105.8 104.2L107.8 101.5L111.2 100.2L113.5 95.8L114.2 95.5L113.8 92.5L112.2 90.2L112.2 85.5L113.2 84.2L113.5 80.8L114.8 77.8L111.2 74.2L108.2 74.2L106.2 72.5L104.2 72.5L102.5 73.2L101.8 74.2L99.2 74.2L97.2 72.2L89.2 71.5L86.8 72.5L84.5 77.2L82.8 78.8L80.8 79.2L78.8 81.5L78.8 82.2L77.5 83.2L77.5 83.8L75.5 85.2L73.5 85.2L67.8 78.8L59.2 74.2L52.8 74.2L49.8 72.8L49.2 71.8L45.2 71.5L43.8 72.2Z","Lai Châu"],["#5aa9e6","M40.2 80.8L33.8 86.5L31.8 86.5L30.5 87.2L30.2 89.8L28.5 91.8L28.5 94.8L29.2 96.5L32.8 100.2L33.5 100.2L34.5 101.5L38.2 103.8L42.2 107.8L43.2 110.2L44.5 111.5L44.8 113.8L45.5 114.2L45.2 114.5L46.8 116.8L49.2 117.8L49.5 118.5L51.2 118.5L52.5 119.5L52.5 123.8L51.5 124.8L51.5 129.8L52.2 130.8L58.5 130.5L59.2 131.2L68.2 131.5L68.2 136.2L67.2 137.2L66.5 139.8L65.5 140.5L65.5 142.8L64.5 143.8L64.5 147.5L63.2 149.2L62.8 150.8L63.5 152.5L66.2 155.5L67.2 160.5L69.5 161.5L72.8 164.5L72.8 165.8L74.5 167.8L74.2 169.2L74.8 169.5L75.2 170.8L77.8 172.8L82.5 169.2L84.2 165.5L91.2 159.5L91.8 157.2L92.8 156.2L93.2 150.8L92.2 148.2L91.2 147.2L91.2 142.8L99.2 133.2L100.2 128.2L100.2 125.8L99.2 124.5L99.5 115.2L101.5 111.5L101.2 109.2L100.5 108.5L98.5 108.5L94.8 110.2L90.8 110.8L89.8 111.8L88.5 111.5L87.2 112.5L85.2 112.5L83.8 111.5L79.8 110.8L78.8 109.8L74.2 109.2L73.8 108.5L71.2 107.5L66.8 103.8L66.8 103.2L62.5 98.5L61.8 96.2L53.2 87.5L50.8 86.5L44.8 85.8Z","Điện Biên"],["#3caea3","M115.2 78.2L113.8 80.8L113.5 84.2L112.5 85.5L112.5 90.2L114.2 92.5L114.5 95.5L113.8 95.8L111.5 100.2L107.8 101.8L105.8 105.5L104.2 107.2L104.2 111.2L106.5 114.8L107.8 115.8L108.8 118.5L111.2 121.2L110.8 121.5L112.5 123.5L117.5 127.2L121.5 127.5L121.8 128.2L126.5 128.8L127.8 129.8L132.5 129.8L133.5 129.2L138.5 129.5L139.5 130.5L140.2 133.2L139.8 140.2L140.5 141.8L142.5 143.8L144.8 143.8L146.2 144.8L147.5 144.8L148.5 143.8L157.5 144.2L160.2 145.2L160.5 145.8L162.2 145.8L165.5 148.2L166.8 148.2L168.8 144.8L168.8 143.2L167.8 141.5L167.8 139.8L169.2 137.5L169.2 135.8L168.5 135.2L170.8 132.5L176.8 129.5L177.2 124.5L176.2 124.2L174.8 122.8L174.8 121.5L171.8 119.2L171.5 114.8L170.2 114.2L165.2 108.5L164.8 105.8L164.2 104.8L161.8 104.5L157.5 101.5L155.5 101.2L151.8 97.5L151.5 96.5L146.2 91.8L145.5 90.2L145.5 87.8L144.8 87.5L145.2 82.2L143.5 79.5L143.8 75.5L143.2 74.2L140.2 74.2L139.2 72.2L135.5 72.2L129.5 70.8L125.8 73.8L125.8 75.8L125.2 76.2L124.8 77.8L123.2 80.2L117.2 80.2Z","Lào Cai"],["#5aa9e6","M187.2 41.8L186.8 42.5L185.2 43.2L184.8 44.2L183.2 44.2L181.5 46.2L177.2 46.8L173.5 49.2L168.5 49.5L164.2 54.2L162.8 54.8L162.8 55.5L161.2 57.2L160.8 66.2L159.2 67.2L157.5 67.2L155.5 68.8L150.8 68.8L147.2 71.2L143.5 74.5L144.2 75.5L143.8 79.5L145.5 82.2L145.2 87.5L145.8 87.8L145.8 90.2L146.5 91.8L148.5 93.8L149.2 93.8L155.5 100.8L157.5 101.2L160.5 103.5L164.5 104.8L165.2 105.8L165.5 108.5L166.8 109.5L166.8 110.2L168.5 111.5L168.8 112.5L171.8 114.8L172.2 119.2L175.2 121.5L175.2 122.8L177.5 124.5L177.2 129.8L178.8 130.2L181.5 132.5L183.5 132.5L185.2 133.8L184.8 134.2L187.2 136.2L188.2 139.8L187.8 141.2L186.8 141.8L186.8 143.8L189.8 145.8L192.5 145.8L194.2 144.8L197.2 145.2L200.2 143.5L199.8 139.5L201.2 138.2L201.2 136.5L200.2 135.8L200.2 134.2L201.8 132.2L203.2 131.8L202.8 129.5L199.5 126.8L199.5 125.5L203.5 124.8L206.5 121.8L207.2 120.2L210.2 120.2L212.8 119.2L212.8 117.8L208.2 113.8L207.8 111.5L205.5 111.2L203.2 108.8L203.2 107.5L205.5 106.8L205.8 106.2L207.2 106.2L208.5 107.8L209.8 108.5L211.2 107.5L211.2 105.8L211.8 105.5L212.2 104.2L211.5 102.8L209.8 102.2L206.5 102.2L205.2 103.5L203.2 104.2L202.2 103.5L202.2 101.8L202.8 100.2L203.5 99.8L203.5 98.5L202.8 98.5L201.5 97.2L201.5 96.2L202.5 94.8L202.5 93.8L203.8 92.8L204.8 92.8L206.5 91.2L206.5 86.2L207.2 85.8L207.2 84.5L206.5 84.2L205.8 81.5L203.8 79.8L201.8 79.2L197.5 73.2L193.8 70.2L193.5 67.8L192.8 67.5L193.8 64.5L198.2 60.5L199.2 60.2L202.5 56.5L201.5 55.5L201.8 51.8L198.2 49.5L196.8 46.5L190.5 42.5Z","Tuyên Quang"],["#ef6f5e","M193.2 67.5L193.8 67.8L194.2 70.2L195.2 70.5L197.8 73.2L202.5 79.2L203.5 79.2L204.5 77.8L206.8 76.8L207.2 76.2L211.8 76.5L213.5 77.2L215.2 79.8L217.5 79.8L218.8 78.8L219.8 78.8L222.5 81.8L224.5 82.5L227.2 84.8L229.5 85.5L235.2 91.5L236.8 91.5L237.2 90.8L239.5 90.5L240.5 91.5L242.8 91.5L245.5 93.2L247.5 92.8L249.2 91.2L249.8 87.8L251.2 84.8L254.5 80.5L254.5 76.2L255.2 75.5L256.8 75.8L257.8 74.5L257.8 71.8L257.2 70.2L253.8 66.8L247.8 66.5L244.8 68.2L237.2 68.2L235.2 64.2L231.5 61.2L225.8 60.5L224.8 61.2L221.2 61.2L220.2 62.5L219.2 62.8L214.8 62.8L214.2 61.8L209.8 59.2L208.8 57.8L206.5 57.8L205.5 56.8L201.8 57.2L201.8 57.8L199.2 60.5L194.2 64.5Z","Cao Bằng"],["#3caea3","M256.5 75.8L254.8 76.2L254.8 80.5L251.5 84.8L250.2 87.8L249.5 91.2L246.5 93.5L245.5 93.5L242.8 91.8L240.5 91.8L239.5 90.8L237.2 91.2L236.8 91.8L235.2 91.8L231.5 88.5L231.5 87.8L229.5 85.8L227.2 85.2L224.5 82.8L222.5 82.2L219.8 79.2L218.8 79.2L217.5 80.2L215.2 80.2L213.5 77.5L211.8 76.8L207.2 76.5L206.8 77.2L204.5 78.2L203.5 79.5L206.2 81.5L206.8 84.2L207.5 84.5L207.5 85.8L206.8 86.2L206.8 91.2L204.8 93.2L202.8 93.8L202.8 94.8L201.8 96.2L201.8 97.2L203.8 98.5L203.8 99.8L203.2 100.2L202.5 101.8L202.5 103.5L204.5 103.5L206.5 101.8L209.8 101.8L211.5 102.5L212.5 104.2L212.2 105.5L211.5 105.8L211.5 107.5L209.8 108.8L208.5 108.2L207.2 106.5L203.5 107.5L203.5 108.8L205.5 110.8L207.5 110.8L208.2 111.5L208.5 113.8L213.2 117.8L213.2 119.2L211.8 120.2L207.2 120.5L206.8 121.8L203.5 125.2L199.8 125.5L199.8 126.8L202.2 128.5L203.5 130.5L203.5 131.8L202.8 132.5L201.8 132.5L200.5 134.2L200.5 135.8L201.5 136.5L201.5 138.2L200.2 139.5L200.5 143.5L206.2 142.8L209.2 145.5L210.5 145.5L212.2 146.8L212.2 147.5L217.8 147.2L225.2 142.2L225.8 134.5L228.5 132.5L230.5 133.2L232.5 132.8L234.2 131.2L234.5 129.8L233.8 128.2L232.8 127.5L232.5 123.2L227.2 117.2L222.5 114.8L222.5 112.8L223.8 111.8L228.8 111.2L230.8 108.8L231.5 109.2L233.8 106.8L236.5 107.2L236.8 106.5L239.5 105.5L243.8 102.5L245.8 102.8L246.2 103.5L255.2 103.2L254.2 97.2L253.2 96.2L253.5 86.8L254.5 85.5L255.5 82.2L256.2 81.8L256.2 79.2L256.8 78.2Z","Thái Nguyên"],["#ef6f5e","M222.8 112.8L222.8 114.8L224.5 115.2L227.2 116.8L232.8 123.2L233.2 127.5L234.2 128.2L234.8 129.8L234.5 131.2L232.2 133.2L232.2 134.2L234.2 135.8L236.8 136.8L237.5 137.8L239.2 137.5L241.8 138.8L242.8 138.8L243.2 138.2L245.2 138.2L247.2 137.2L248.2 135.8L249.8 135.5L254.5 135.8L255.8 135.2L258.8 135.2L261.5 135.8L262.5 136.8L265.2 137.5L267.5 139.5L267.5 140.8L268.8 142.5L269.5 145.8L269.2 148.5L268.5 148.8L270.2 148.8L274.5 143.5L276.2 143.5L277.2 142.8L277.2 142.2L277.8 141.8L277.8 138.5L278.5 137.2L280.5 135.5L282.2 133.2L282.5 131.5L283.5 130.8L282.8 130.2L283.2 129.5L281.2 128.8L278.5 126.5L277.8 126.5L273.2 121.8L273.2 120.5L270.8 117.5L269.8 114.2L265.8 114.2L264.8 112.8L261.2 111.8L260.8 111.2L257.8 110.2L256.5 108.2L256.5 104.5L255.5 103.5L246.2 103.8L245.8 103.2L243.8 102.8L239.5 105.8L236.8 106.8L236.5 107.5L233.8 107.2L231.5 109.5L230.8 109.2L228.8 111.5L223.8 112.2Z","Lạng Sơn"],["#7cc576","M283.2 131.2L282.5 133.2L278.2 138.5L278.2 141.8L277.5 142.2L277.5 142.8L276.2 143.8L274.5 143.8L270.2 149.2L268.5 149.2L267.5 150.5L267.5 152.5L269.5 154.8L275.5 154.2L276.5 155.2L280.5 155.8L283.2 157.5L287.2 156.5L288.2 156.8L291.5 161.8L293.8 164.2L295.2 167.8L296.2 169.2L297.2 169.2L297.5 163.8L299.8 161.8L300.2 157.2L302.2 155.2L304.5 154.2L304.5 153.2L302.8 151.5L302.2 149.8L302.5 144.8L304.2 143.8L312.8 144.2L313.2 144.8L316.2 144.2L316.8 142.2L317.5 141.8L317.5 137.2L314.5 133.5L312.2 132.8L309.5 133.5L308.2 132.2L301.2 132.2L298.2 134.2L287.8 133.5L286.5 131.5Z","Quảng Ninh"],["#a78bda","M216.8 167.8L217.2 168.5L219.2 169.2L219.8 170.2L221.2 170.2L225.8 172.5L228.5 174.8L231.2 175.2L231.5 173.5L232.2 173.2L232.5 170.5L233.2 169.8L235.5 169.5L235.8 168.8L236.5 169.2L236.8 168.5L238.2 168.5L241.2 164.8L241.8 161.2L243.5 159.5L245.2 158.8L263.5 158.8L270.5 159.5L274.5 159.2L276.8 159.8L277.2 160.5L281.2 161.5L281.5 162.2L283.8 162.8L288.2 167.2L296.2 169.8L294.5 167.2L293.5 164.2L291.2 161.8L288.2 157.2L287.2 156.8L283.2 157.8L280.5 156.2L276.5 155.5L275.5 154.5L272.5 154.5L271.2 155.2L268.8 154.8L267.2 152.5L267.2 150.5L268.8 148.5L269.2 147.2L268.8 143.5L267.5 141.8L267.2 139.5L263.8 137.2L262.5 137.2L261.5 136.2L258.8 135.5L255.8 135.5L254.5 136.2L248.2 136.2L247.2 137.5L245.2 138.5L243.2 138.5L242.8 139.2L238.5 137.8L238.2 138.2L238.8 138.8L239.2 140.8L239.8 141.2L237.5 143.5L236.2 143.5L232.8 141.5L232.2 140.5L231.2 140.5L230.8 141.8L226.5 146.2L226.5 146.8L220.8 151.5L220.5 158.8L219.8 159.2L219.5 164.2Z","Bắc Ninh"],["#f4a259","M174.8 130.5L174.2 131.5L170.8 132.8L168.8 135.2L169.5 135.8L169.5 137.5L168.2 139.8L168.2 141.5L169.2 143.2L169.2 144.8L167.8 147.5L166.5 148.5L166.5 150.2L167.2 150.5L166.8 152.8L167.5 153.2L167.5 155.2L168.2 156.5L168.2 162.5L168.8 166.8L176.8 175.5L176.2 175.8L175.5 178.8L173.2 181.2L167.8 182.5L166.8 183.8L166.8 185.2L168.2 186.2L170.2 186.2L173.8 188.5L176.5 187.8L182.5 188.2L183.5 189.8L187.5 193.5L187.2 195.2L188.8 196.8L191.5 197.2L194.5 196.5L196.5 197.8L205.5 200.2L210.5 195.5L210.5 193.8L211.2 193.5L211.2 190.8L210.2 189.8L209.2 186.2L207.2 185.2L206.5 184.2L205.5 184.2L202.8 180.8L200.2 180.8L197.5 177.8L195.5 177.8L193.2 180.2L192.2 179.8L191.8 180.5L188.8 177.8L188.2 172.5L189.2 171.8L190.5 169.2L189.8 168.8L189.2 166.2L187.2 163.2L187.5 156.8L190.8 153.8L192.2 153.8L194.8 155.8L197.8 156.2L198.2 156.8L201.2 157.5L205.5 160.2L208.2 160.5L208.8 159.8L209.2 155.8L210.2 154.8L209.5 151.8L210.2 151.5L210.5 148.8L211.8 147.8L211.8 146.8L210.5 145.8L209.2 145.8L206.2 143.2L199.5 143.8L198.8 144.8L197.2 145.5L194.2 145.2L192.5 146.2L189.8 146.2L186.2 143.2L187.8 139.8L186.8 136.2L184.5 134.2L184.8 133.8L183.5 132.8L181.5 132.8L178.8 130.5L176.8 129.8Z","Phú Thọ"],["#f4a259","M78.8 172.5L80.5 173.8L84.5 174.5L88.8 177.5L94.5 177.8L97.2 179.5L98.8 179.5L102.5 182.2L111.2 182.2L116.2 173.2L120.5 173.2L124.8 171.2L132.5 171.2L132.8 171.8L133.8 171.8L144.2 182.2L144.2 185.8L154.8 185.2L156.8 186.2L157.5 187.2L161.5 186.5L163.5 184.8L163.8 182.5L165.5 180.5L167.2 179.5L171.2 179.5L173.5 177.5L173.8 176.2L172.2 173.5L167.5 169.2L166.5 166.5L165.5 165.5L165.5 163.8L166.2 163.5L166.2 161.2L165.2 160.2L165.5 153.8L164.5 152.8L164.2 150.5L162.5 148.8L160.2 148.2L159.8 147.5L158.2 146.8L154.5 146.8L153.2 145.8L151.2 145.8L150.8 146.5L148.2 147.5L142.5 146.8L138.5 143.5L137.8 141.2L136.8 140.2L136.8 135.5L137.5 135.2L137.2 131.8L135.2 131.5L129.5 132.5L128.2 131.8L126.2 131.8L124.8 130.8L122.5 130.8L120.8 130.2L120.5 129.5L114.2 128.5L112.2 126.5L109.8 122.8L106.8 120.2L105.8 117.2L104.2 115.5L102.2 115.8L101.5 117.8L101.2 120.8L101.8 121.2L101.8 124.5L100.5 126.2L99.5 133.2L91.5 142.8L91.5 147.2L92.5 148.2L93.5 150.8L93.2 156.2L92.2 157.2L92.2 158.5L89.5 160.8L89.2 161.8L84.5 165.5L82.8 169.2Z","Sơn La"],["#f6d55c","M231.8 133.5L228.5 132.8L226.2 134.5L225.8 141.5L224.2 143.5L221.2 144.8L217.8 147.5L213.5 147.5L210.8 148.8L210.5 151.5L209.8 151.8L210.5 154.8L209.5 155.8L209.2 159.8L208.2 160.8L205.5 160.5L201.2 157.8L198.2 157.2L197.8 156.5L194.8 156.2L192.2 154.2L190.8 154.2L187.8 156.8L187.5 163.2L189.5 166.2L190.2 168.8L190.8 169.2L189.5 171.8L188.5 172.5L188.8 177.2L190.8 179.5L191.5 179.5L191.8 180.2L192.2 179.5L193.2 179.8L195.5 177.5L197.5 177.5L199.5 179.2L200.2 180.5L202.8 180.5L205.5 183.8L206.5 183.8L207.2 184.8L209.2 185.8L210.5 189.8L211.5 190.5L211.8 186.8L215.5 183.5L216.5 181.8L218.2 180.8L218.2 179.2L217.5 178.8L217.8 175.8L217.2 175.5L216.5 173.5L215.5 172.8L215.2 169.5L216.5 168.5L216.8 167.2L217.8 166.5L219.2 164.2L219.5 159.2L220.2 158.8L220.5 151.5L226.2 146.8L226.2 146.2L230.5 141.8L230.5 140.8L231.2 140.2L232.2 140.2L232.8 141.2L236.2 143.2L238.2 142.8L239.5 141.2L238.8 140.8L238.5 138.8L236.8 137.2L234.2 136.2L231.8 134.2Z","TP Hà Nội"],["#f28bb3","M231.5 175.2L235.5 180.2L237.8 180.8L238.8 181.8L242.8 182.5L247.2 187.2L250.5 187.5L250.8 188.2L251.8 186.8L253.5 186.2L261.8 186.2L263.8 187.5L265.5 184.8L265.2 183.8L263.5 182.8L263.5 179.2L264.8 177.8L276.8 177.2L277.8 178.2L280.8 179.2L281.2 179.8L282.5 179.8L282.8 179.2L286.2 178.2L293.5 178.5L294.5 178.2L296.2 176.2L296.5 170.8L296.2 170.2L293.2 169.5L292.2 168.5L288.2 167.5L283.8 163.2L274.5 159.5L270.5 159.8L263.5 159.2L245.2 159.2L243.5 159.8L242.2 161.2L241.5 164.8L238.2 168.8L236.8 168.8L236.5 169.5L235.8 169.2L235.5 169.8L232.8 170.5L232.5 173.2L231.8 173.5Z","TP Hải Phòng"],["#7cc576","M216.8 168.2L215.5 169.5L215.8 172.8L216.8 173.5L217.5 175.5L218.2 175.8L217.8 178.8L218.5 179.2L218.5 180.8L224.2 186.8L228.2 186.8L228.2 189.5L230.8 191.8L230.8 192.5L242.2 201.5L242.2 202.2L240.8 203.5L238.5 204.2L235.8 207.2L234.2 208.2L231.2 211.2L231.2 212.2L232.2 212.2L234.2 210.5L236.2 210.8L237.2 209.5L237.8 209.8L238.8 208.8L244.2 208.8L246.5 209.5L246.8 208.8L250.2 208.2L251.2 206.8L251.2 205.5L251.8 205.2L251.5 198.2L250.5 197.2L250.5 187.8L248.2 187.8L246.5 187.2L242.8 182.8L238.8 182.2L237.8 181.2L235.5 180.5L233.2 178.2L232.2 175.8L228.5 175.2L225.8 172.8L221.2 170.5L219.8 170.5L219.2 169.5L217.2 168.8Z","Hưng Yên"],["#f28bb3","M217.8 181.2L212.2 186.8L212.2 189.8L211.5 190.8L211.5 193.5L210.8 193.8L210.8 195.5L206.8 199.5L204.8 200.5L204.8 201.2L206.8 201.8L206.8 202.5L208.2 203.2L208.2 204.5L213.2 209.5L214.8 210.2L221.5 210.2L223.8 210.8L224.5 211.5L224.8 213.5L222.8 216.8L223.2 218.5L231.2 218.5L233.5 217.8L235.2 215.8L236.2 211.2L234.2 210.8L232.2 212.5L231.2 212.5L230.8 211.2L238.5 203.8L240.8 203.2L241.8 201.5L230.5 192.5L230.5 191.8L227.8 189.5L228.2 187.2L224.2 187.2L221.2 184.5L221.2 183.8L219.5 182.5L219.8 182.2Z","Ninh Bình"],["#4f86c6","M144.2 186.2L144.2 188.2L140.2 191.2L140.2 198.2L148.2 198.2L149.2 199.2L149.5 205.5L160.8 211.8L161.5 214.5L163.8 215.5L167.5 215.8L168.8 217.2L168.8 218.5L171.8 221.2L171.5 221.5L175.5 222.2L176.2 223.2L178.2 223.8L178.8 224.5L177.8 228.8L178.5 233.2L181.2 235.8L184.5 235.5L186.2 236.2L187.8 237.8L187.8 242.2L191.2 242.8L193.2 245.5L194.5 246.2L198.8 250.8L200.8 251.5L202.2 252.8L205.5 253.2L206.5 254.5L207.2 257.2L209.5 258.8L210.8 257.5L211.8 253.8L211.8 246.2L212.8 244.8L212.8 238.2L214.5 234.8L216.8 232.2L217.2 229.8L218.2 229.2L219.2 226.5L219.8 226.2L220.8 219.8L222.5 218.2L223.2 215.2L224.5 213.5L224.2 211.5L221.5 210.5L214.8 210.5L213.2 209.8L207.8 204.5L207.8 203.2L206.8 202.8L206.8 202.2L205.2 201.8L203.8 200.2L201.5 199.8L200.5 198.8L196.5 198.2L194.5 196.8L191.5 197.5L188.8 197.2L186.8 195.2L187.2 193.5L186.2 192.2L185.2 191.8L182.8 188.8L181.5 188.2L176.5 188.2L173.8 188.8L170.2 186.5L168.2 186.5L167.8 185.8L164.8 185.2L164.5 184.5L163.8 184.5L161.5 186.8L159.2 187.5L157.5 187.5L156.8 186.5L154.8 185.5Z","Thanh Hóa"],["#a78bda","M123.2 232.2L123.2 235.2L121.2 236.8L121.2 238.5L122.2 239.8L121.8 242.2L115.2 248.2L115.2 252.5L114.5 252.8L114.5 254.5L117.8 257.8L123.2 258.5L125.5 259.5L126.2 260.5L129.8 262.8L131.2 264.5L133.2 265.2L135.8 267.8L136.5 267.8L137.8 269.5L140.2 270.2L141.2 271.2L143.2 271.5L147.2 276.2L151.8 278.5L152.5 279.5L156.2 281.8L158.5 281.8L160.5 282.8L163.5 282.8L165.5 284.5L168.5 284.5L169.8 285.5L171.8 285.8L172.2 289.5L182.8 289.5L183.8 288.8L185.8 288.8L187.2 289.5L187.2 290.2L190.8 291.8L197.2 291.5L198.2 290.5L201.8 291.5L204.2 289.5L204.8 289.5L205.8 288.2L209.8 287.2L209.2 284.8L208.5 284.5L208.2 281.5L205.8 278.5L205.5 273.5L204.5 272.2L204.8 267.2L207.8 263.5L208.5 258.5L206.8 257.2L206.2 254.5L205.5 253.5L202.2 253.2L200.8 251.8L198.8 251.2L194.5 246.5L192.8 245.5L191.2 243.2L187.8 242.5L187.2 241.5L187.8 239.2L187.5 237.8L186.2 236.5L184.5 235.8L181.2 236.2L178.2 233.2L177.5 230.8L177.8 226.2L178.5 224.5L176.2 223.5L175.5 222.5L171.5 221.8L171.5 221.2L168.5 218.5L168.5 217.2L167.5 216.2L163.8 215.8L161.2 214.5L161.2 219.5L159.5 221.8L159.5 223.2L158.8 223.5L158.5 224.8L151.2 232.2L141.2 232.2L137.5 230.2L126.2 230.2Z","Nghệ An"],["#4f86c6","M172.2 289.8L172.2 298.2L175.8 304.8L177.5 306.2L178.8 308.5L180.8 308.5L184.8 313.2L190.5 313.5L191.2 314.2L191.2 318.2L193.2 318.2L196.5 320.8L197.2 322.2L197.2 324.5L199.5 323.5L202.5 323.5L204.8 322.8L205.2 322.2L206.8 321.8L208.8 320.2L210.8 320.2L212.2 319.5L218.8 319.5L221.2 320.8L222.2 322.2L223.5 322.2L225.8 324.2L227.8 324.5L228.8 325.5L234.5 325.8L242.8 320.5L242.5 318.8L239.8 315.8L237.8 314.8L232.2 309.2L229.5 308.2L226.5 305.2L224.2 305.2L221.5 303.5L219.2 303.5L217.2 301.5L216.5 297.2L213.8 294.2L212.8 291.5L212.2 291.2L211.5 288.5L210.2 287.5L205.8 288.5L204.8 289.8L204.2 289.8L201.8 291.8L198.2 290.8L197.2 291.8L190.8 292.2L187.2 290.5L187.2 289.8L185.8 289.2L183.8 289.2L182.8 289.8Z","Hà Tĩnh"],["#f4a259","M197.5 324.5L197.2 326.2L200.2 330.2L200.2 333.2L207.5 340.5L208.2 340.5L212.2 344.2L221.5 356.5L224.2 358.2L226.2 358.2L227.5 359.2L228.8 359.2L230.5 360.5L231.2 365.2L237.5 371.5L238.2 372.8L240.2 374.2L241.2 386.2L246.2 394.2L247.2 399.2L248.2 400.2L250.5 400.2L253.2 403.2L258.8 402.8L263.2 407.2L265.2 407.5L266.2 408.8L268.5 409.2L269.2 409.8L269.2 412.2L272.2 414.2L275.5 408.5L274.8 404.2L276.5 401.8L277.2 395.8L279.5 394.2L283.5 394.2L283.8 392.8L287.5 389.8L288.2 390.2L289.8 388.8L289.8 387.8L285.8 382.8L282.2 380.8L277.8 376.5L277.2 374.5L275.8 373.2L275.5 370.8L274.5 369.8L273.8 364.2L271.8 362.2L269.2 361.5L260.8 362.2L257.8 359.8L257.8 357.5L256.2 356.2L253.5 351.8L251.2 349.5L251.5 348.8L250.5 348.2L248.5 343.8L247.5 343.2L245.8 340.8L246.2 340.5L243.8 337.8L244.5 330.5L243.2 328.8L243.5 321.5L242.5 320.8L241.8 321.8L239.8 322.5L239.2 323.5L234.5 326.2L228.8 325.8L227.8 324.8L225.8 324.5L223.5 322.5L222.2 322.5L221.2 321.2L218.8 319.8L212.2 319.8L210.8 320.5L208.8 320.5L206.8 322.2L205.2 322.5L204.8 323.2Z","Quảng Trị"],["#f6d55c","M318.5 408.2L309.8 407.5L308.5 405.8L307.8 402.5L303.2 397.8L299.8 395.5L299.5 394.5L298.8 394.5L297.8 392.8L297.2 392.8L294.2 389.5L292.5 388.8L290.2 388.8L288.2 390.5L287.5 390.2L286.8 391.2L285.2 391.8L283.5 394.5L279.5 394.5L277.5 395.8L276.8 401.8L275.2 404.2L275.8 408.5L272.5 414.5L279.2 419.2L279.2 424.5L285.5 424.8L287.5 422.8L290.2 422.8L291.2 422.2L296.2 422.2L297.5 420.8L301.2 421.5L305.8 421.5L309.2 418.8L310.5 418.8L312.2 417.5L314.2 413.5L317.8 410.5Z","TP Huế"],["#3caea3","M274.2 428.2L274.5 436.8L282.2 447.2L283.5 447.5L286.5 450.8L289.5 451.5L291.5 453.8L293.2 454.8L293.2 463.5L297.5 461.5L299.5 461.5L299.8 460.8L300.8 461.5L302.5 460.8L305.2 461.2L306.5 462.5L307.8 462.5L313.2 465.8L316.8 466.2L319.2 468.5L321.2 472.8L324.5 475.8L325.5 475.8L326.5 474.8L330.2 473.5L331.8 471.8L333.5 468.8L333.5 465.2L338.2 459.8L342.5 459.8L345.2 459.2L350.8 455.5L352.5 453.8L350.5 449.5L346.5 445.2L345.2 442.5L341.2 437.8L340.8 435.5L339.8 433.2L339.2 432.8L339.2 431.5L335.8 427.8L336.2 426.5L334.5 425.2L332.8 425.2L331.8 424.2L331.2 419.8L326.8 413.8L326.8 411.5L325.2 410.2L325.5 409.8L321.8 409.5L320.2 408.2L318.8 408.2L318.2 410.5L314.5 413.5L312.5 417.5L310.5 419.2L309.2 419.2L305.8 421.8L301.2 421.8L297.5 421.2L296.2 422.5L291.2 422.5L290.2 423.2L287.5 423.2L285.5 425.2L279.2 424.8L278.8 425.5Z","TP Đà Nẵng"],["#5aa9e6","M363.2 460.5L361.5 460.2L360.8 459.2L358.8 458.5L358.5 457.8L355.5 456.8L352.8 454.5L351.8 454.5L350.8 455.8L345.2 459.5L342.5 460.2L338.2 460.2L333.8 465.2L333.8 468.8L332.2 471.8L330.2 473.8L329.2 473.8L325.5 476.2L323.8 475.8L320.8 472.8L318.8 468.5L316.8 466.5L313.2 466.2L312.2 465.2L309.8 464.5L309.2 463.5L306.5 462.8L305.8 461.8L304.2 461.2L302.5 461.2L300.2 462.2L299.8 465.5L299.5 461.8L297.5 461.8L293.2 463.8L292.8 465.5L288.5 467.8L288.2 476.2L290.2 478.2L290.2 494.5L288.2 499.2L284.2 503.2L284.2 511.2L281.2 514.2L281.2 520.2L286.2 526.2L286.5 529.5L289.2 528.8L289.8 527.8L295.2 524.8L296.8 522.2L298.2 521.2L298.2 520.5L302.2 516.5L307.2 515.2L307.5 514.5L312.2 513.2L312.5 512.5L314.8 512.5L315.8 511.8L319.8 511.2L320.8 510.2L324.2 509.5L325.2 508.5L326.5 508.5L329.2 507.2L329.8 506.2L331.8 505.5L337.2 500.2L337.2 499.5L337.8 499.2L337.8 497.2L339.5 494.2L343.5 490.8L346.2 491.8L346.8 492.8L348.8 493.5L349.8 494.5L355.5 494.2L356.8 493.2L368.8 493.2L371.5 494.2L372.2 489.8L370.8 488.5L368.5 488.2L366.2 485.5L366.2 483.5L365.5 482.2L365.5 474.5L363.2 469.8L362.2 469.2L362.2 464.8Z","Quảng Ngãi"],["#ef6f5e","M371.2 494.2L368.8 493.5L356.8 493.5L355.5 494.5L349.8 494.8L348.8 493.8L346.8 493.2L346.2 492.2L343.5 491.2L341.8 492.2L338.8 495.5L338.2 499.2L335.2 502.8L334.2 503.2L331.8 505.8L329.8 506.5L329.2 507.5L326.5 508.8L325.2 508.8L324.2 509.8L320.8 510.5L319.8 511.5L315.8 512.2L314.8 512.8L312.5 512.8L312.2 513.5L308.2 514.5L307.2 515.5L302.2 516.8L298.5 520.5L298.5 521.2L297.2 522.2L297.2 522.8L295.2 525.2L289.8 528.2L289.2 529.2L286.5 529.8L286.5 535.8L287.2 537.5L288.5 538.5L289.5 540.8L291.8 543.5L293.2 548.5L293.2 557.2L292.2 559.2L299.5 559.2L300.8 560.2L311.2 560.2L312.5 559.5L314.8 559.5L317.5 557.8L321.5 557.8L324.2 557.2L325.5 558.8L327.8 558.8L329.8 559.8L330.5 560.8L332.5 561.5L332.8 562.2L334.2 562.2L335.5 563.8L337.5 564.8L338.8 566.8L338.2 569.5L338.5 571.2L340.5 573.5L341.5 573.8L341.5 574.5L344.8 576.8L346.2 576.5L346.8 575.2L348.5 573.8L349.8 573.8L353.2 571.2L356.8 569.8L358.5 567.2L358.2 561.5L359.2 558.2L358.2 556.8L358.2 552.8L358.8 552.5L358.8 551.8L360.2 550.8L364.2 550.5L368.5 546.8L375.8 546.2L376.8 545.2L378.2 545.2L379.2 539.8L380.5 538.8L382.2 536.2L382.2 534.5L381.5 533.5L381.5 529.5L380.5 528.5L380.8 524.8L379.2 522.8L379.5 515.5L378.5 513.5L377.2 512.5L375.2 507.8L374.2 507.2L374.2 504.2L372.8 499.8L371.8 498.8L371.8 495.2Z","Gia Lai"],["#a78bda","M388.2 580.5L385.8 576.5L384.8 575.8L384.2 573.8L383.2 573.2L382.5 570.8L381.8 570.5L382.2 569.8L381.5 569.5L381.8 564.8L380.8 563.8L380.8 559.2L380.2 558.2L380.2 550.2L379.5 547.5L378.2 545.5L376.8 545.5L375.8 546.5L368.5 547.2L363.5 551.2L359.5 551.5L358.5 552.8L358.5 556.8L359.5 558.8L358.5 561.5L358.8 567.2L356.8 570.2L353.2 571.5L349.8 574.2L348.5 574.2L346.2 576.8L345.2 577.2L343.8 576.8L338.2 571.2L337.8 569.5L338.5 566.8L337.5 565.2L335.5 564.2L334.2 562.5L332.8 562.5L332.5 561.8L330.5 561.2L329.8 560.2L327.8 559.2L325.5 559.2L324.2 557.5L321.5 558.2L317.5 558.2L314.8 559.8L312.5 559.8L311.2 560.5L300.8 560.5L299.5 559.5L291.8 559.5L287.2 568.2L287.2 578.5L288.5 580.8L289.2 583.5L289.8 583.8L290.2 585.8L292.8 586.2L297.2 590.8L303.2 591.5L304.5 590.5L308.8 590.8L310.5 594.5L310.5 596.8L312.8 598.8L312.5 599.2L314.2 600.8L314.2 608.8L317.2 609.8L318.8 611.5L319.2 613.8L321.2 615.5L325.5 615.5L328.5 616.5L329.5 617.8L332.2 616.8L334.5 615.2L337.8 611.5L345.8 612.2L346.2 612.8L347.2 612.8L347.8 612.2L348.2 608.2L347.5 607.8L347.5 605.5L348.2 605.5L348.2 602.8L348.8 602.2L351.8 602.5L353.2 601.8L355.8 601.8L358.2 599.8L359.8 593.5L362.5 591.8L364.8 592.5L367.5 590.2L368.5 590.5L369.8 589.5L369.8 588.2L374.5 584.5L380.5 585.2L381.5 586.8L383.5 588.5L383.8 587.2L387.8 583.5Z","Đắk Lắk"],["#f28bb3","M374.5 584.8L374.2 585.5L371.8 586.5L370.2 588.2L370.2 589.5L368.5 590.8L367.5 590.5L364.8 592.8L362.5 592.2L359.8 593.8L359.5 597.2L358.5 598.5L358.5 599.8L355.8 602.2L348.5 602.8L348.5 605.5L347.8 605.5L347.8 607.8L348.5 608.2L348.2 612.2L350.5 614.2L350.8 616.2L352.8 618.8L353.2 624.2L349.5 629.5L348.8 636.5L348.2 636.8L348.2 642.2L347.8 643.5L346.8 644.2L347.2 646.8L351.8 650.8L352.5 653.2L356.8 657.5L356.8 658.8L357.8 660.8L364.8 660.5L366.5 658.5L366.5 655.2L367.2 654.8L367.5 652.2L368.8 651.2L373.5 651.2L374.8 650.5L375.2 649.5L375.2 643.8L376.2 642.5L376.2 628.8L376.5 625.5L377.2 624.5L377.2 620.2L378.2 618.8L378.5 597.5L380.5 594.8L382.8 593.8L382.8 592.2L383.8 590.8L383.8 589.2L381.2 586.8L380.5 585.5Z","Khánh Hòa"],["#7cc576","M290.8 586.5L290.5 590.8L291.2 591.8L291.2 601.2L287.2 606.2L275.8 606.8L272.8 607.5L275.2 612.8L275.8 613.2L276.5 616.2L277.5 617.2L277.2 618.5L277.8 618.8L278.2 624.5L278.8 626.2L283.2 630.5L282.8 631.8L283.5 632.2L283.2 638.8L281.8 640.5L279.5 641.8L278.5 643.2L278.5 644.2L281.5 647.8L283.2 648.5L285.5 650.5L285.5 652.5L286.2 652.8L285.8 653.2L286.8 653.5L291.8 658.8L291.5 661.2L289.5 663.8L289.5 666.5L288.2 668.2L287.2 674.2L289.5 676.5L289.5 677.5L291.8 680.2L292.5 682.2L291.8 684.5L290.8 685.2L290.5 687.8L289.2 688.8L289.2 689.8L290.5 691.5L290.8 693.5L292.8 696.2L292.8 697.2L296.2 697.2L300.5 696.2L300.8 695.5L303.2 694.5L304.2 693.2L306.5 692.5L306.8 691.8L312.5 691.5L314.2 690.8L315.5 689.5L317.5 684.2L319.5 681.8L322.8 681.2L323.8 680.2L328.5 680.2L332.2 678.8L334.8 676.2L336.8 675.2L341.8 669.8L343.2 669.5L343.5 668.8L348.5 668.8L350.5 667.8L352.2 666.2L353.8 663.2L356.2 660.8L356.8 660.8L357.2 659.8L356.5 657.5L351.5 652.2L351.5 650.8L347.2 647.2L346.5 645.8L346.5 644.2L347.5 643.5L347.8 642.2L347.8 636.8L348.5 636.5L349.2 629.5L352.8 624.2L352.5 618.8L350.5 616.2L350.2 614.2L348.5 612.5L346.2 613.2L345.8 612.5L337.8 611.8L334.5 615.5L330.2 618.2L329.5 618.2L328.5 616.8L325.5 615.8L321.2 615.8L318.8 613.8L318.5 611.5L317.2 610.2L315.2 609.8L313.8 608.8L313.8 600.8L312.2 599.2L312.5 598.8L310.2 596.8L310.2 594.5L309.2 593.2L308.8 591.2L304.5 590.8L303.2 591.8L297.2 591.2L292.8 586.5Z","Lâm Đồng"],["#f4a259","M272.8 607.8L262.2 618.2L252.2 618.2L250.2 620.2L235.2 621.2L235.2 626.5L232.5 634.5L231.8 635.2L229.8 635.2L232.8 638.2L234.2 638.2L236.2 640.2L236.8 641.5L236.8 643.8L237.5 645.5L238.2 645.8L238.5 649.2L242.5 653.2L245.2 653.5L246.2 654.8L246.2 656.2L252.2 660.8L258.2 661.8L259.8 663.5L259.5 664.5L260.2 664.8L261.2 668.5L261.8 668.8L261.2 669.2L260.5 671.2L259.2 672.2L259.2 673.5L258.2 674.8L256.8 675.5L255.5 677.2L256.2 677.8L255.5 682.8L256.5 684.2L255.8 687.5L256.8 688.5L257.5 690.8L259.8 693.2L262.5 693.5L262.8 694.2L266.2 692.2L271.2 691.2L273.5 689.5L278.5 689.5L281.5 690.8L284.2 689.8L284.8 688.8L288.8 688.8L290.2 687.8L290.5 685.2L291.5 684.5L292.2 682.8L291.5 680.2L290.2 679.2L289.2 676.5L286.8 674.2L287.8 668.2L289.2 666.5L289.2 663.8L291.2 661.2L291.5 658.8L286.8 653.8L285.5 653.2L285.8 652.8L285.2 652.5L285.2 650.5L281.5 648.2L278.2 644.2L278.2 643.2L279.2 641.8L281.8 640.2L282.8 638.8L283.2 632.2L282.5 631.8L282.8 630.5L278.5 626.2L277.8 624.5L277.5 618.8L276.8 618.5L277.2 617.2L276.2 616.2L275.5 613.2L274.8 612.8Z","Đồng Nai"],["#4f86c6","M237.8 649.8L236.8 651.2L236.8 652.2L234.2 655.5L234.2 658.2L231.8 659.8L231.5 662.2L231.8 663.5L234.8 666.2L235.2 669.5L233.8 671.8L234.5 676.2L237.5 678.8L238.2 681.2L239.2 681.8L239.2 683.2L240.2 685.2L240.2 688.5L242.8 690.8L243.5 692.2L247.5 692.5L249.8 695.2L249.8 700.5L248.8 701.2L247.8 703.8L247.8 705.5L248.8 706.5L248.8 707.8L250.5 708.2L251.2 709.2L253.2 709.8L257.2 705.8L268.8 705.8L270.2 706.8L279.2 706.8L280.5 706.2L284.2 706.2L286.8 705.5L289.8 702.5L290.2 700.5L292.5 697.5L292.5 696.2L291.2 694.8L288.8 689.2L284.8 689.2L284.2 690.2L281.5 691.2L278.5 689.8L273.5 689.8L271.2 691.5L266.2 692.5L263.5 694.5L262.8 694.5L262.5 693.8L259.8 693.5L257.2 690.8L256.5 688.5L255.5 687.5L256.2 684.2L255.2 682.8L255.2 681.2L255.8 680.2L255.8 677.8L255.2 677.2L256.8 675.2L257.8 674.8L258.8 673.5L258.8 672.2L260.2 671.2L260.8 669.2L261.5 668.8L260.8 668.5L260.2 665.5L259.2 664.5L259.5 663.5L258.2 662.2L252.2 661.2L249.5 659.5L245.8 656.2L245.2 653.8L242.5 653.5L238.8 649.5Z","TP.HCM"],["#f6d55c","M214.2 634.2L209.2 639.2L204.2 640.2L204.2 646.2L206.2 648.2L206.2 661.2L209.2 664.2L209.2 667.2L212.2 667.2L212.8 668.5L217.2 672.5L217.2 677.2L216.2 678.2L208.2 678.2L205.2 674.2L205.2 671.2L197.2 671.2L193.2 674.2L189.2 674.2L190.5 679.5L192.2 681.5L195.8 683.8L196.8 686.2L198.8 687.5L199.2 690.8L201.5 694.2L199.5 696.5L199.5 697.8L202.8 700.8L206.8 701.2L209.5 699.8L210.2 698.8L212.8 698.2L213.8 697.2L218.8 697.2L222.2 695.8L222.5 695.2L224.2 695.2L224.5 695.8L227.2 696.5L228.2 697.5L230.2 698.2L230.8 699.2L235.2 701.8L237.2 703.8L237.2 705.2L238.5 707.5L244.5 707.5L245.8 708.2L248.2 708.2L248.5 706.5L247.5 705.5L247.5 703.8L248.5 701.2L249.5 700.5L249.5 695.2L247.5 692.8L243.5 692.5L242.5 690.8L239.8 688.5L239.8 685.2L238.8 683.2L238.8 681.8L237.8 681.2L237.2 678.8L234.2 676.2L233.5 671.8L234.8 669.5L234.5 666.2L231.5 663.5L231.2 662.2L231.5 659.8L233.8 658.2L233.8 655.5L234.5 654.2L236.5 652.2L236.8 650.5L238.2 649.5L237.8 645.8L237.2 645.5L236.5 643.8L236.5 641.5L234.2 638.5L232.8 638.5L229.2 634.8Z","Tây Ninh"],["#5aa9e6","M176.8 677.2L176.8 680.5L176.2 680.8L175.5 683.8L175.8 685.5L178.8 687.8L179.5 690.5L181.5 692.8L181.5 694.2L182.5 695.8L187.5 700.2L187.2 700.8L188.5 701.8L189.8 701.8L190.5 702.8L189.8 704.2L187.2 706.5L185.2 707.2L186.2 711.5L189.5 714.8L193.5 715.8L195.8 718.2L197.5 718.8L199.2 718.5L201.5 719.2L203.2 717.8L204.8 717.8L206.8 716.2L208.2 716.2L209.5 714.5L209.5 709.8L212.2 707.8L214.2 707.8L214.5 708.5L216.8 708.8L217.8 710.2L220.2 711.2L222.5 711.2L223.8 710.5L231.8 710.5L234.2 709.5L234.5 708.8L235.5 708.8L235.8 709.5L237.8 709.5L239.2 708.5L237.2 705.8L236.8 703.8L235.2 702.2L230.8 699.5L230.2 698.5L228.2 697.8L227.2 696.8L225.8 696.8L224.2 695.5L222.5 695.5L222.2 696.2L218.8 697.5L213.8 697.5L212.8 698.5L211.5 698.5L206.8 701.5L203.8 701.5L202.2 700.8L199.2 697.8L199.2 696.5L201.2 694.2L198.8 690.8L198.5 687.5L196.5 686.2L195.8 684.2L192.2 681.8L190.2 679.5L188.8 674.2L182.2 674.2L179.2 677.2Z","Đồng Tháp"],["#a78bda","M112.2 700.8L110.8 701.5L109.8 703.2L107.2 705.5L106.5 708.8L107.2 709.2L107.8 711.5L109.5 714.2L110.2 719.8L111.2 720.8L111.2 722.2L113.2 724.2L115.2 724.5L115.8 724.2L115.8 722.5L116.5 721.5L116.2 716.8L116.8 716.5L116.8 713.5L117.5 712.5L118.2 708.5L116.2 703.2L114.5 701.5ZM164.2 675.2L163.2 676.2L163.2 679.2L162.5 680.2L162.2 688.2L154.2 696.2L139.2 696.2L137.2 698.2L126.2 698.2L126.2 704.2L126.8 704.2L129.5 706.8L137.5 707.2L139.2 709.5L139.2 711.8L140.8 713.8L141.8 716.8L143.2 717.8L145.8 717.8L147.8 716.5L152.2 716.5L156.2 720.5L157.5 720.8L159.8 723.8L161.2 724.5L161.2 729.5L159.2 731.2L156.8 731.5L154.8 733.5L153.8 735.2L153.8 736.5L152.8 737.5L152.8 742.2L151.8 743.5L152.2 748.5L157.2 748.8L158.8 748.5L159.8 747.5L163.8 747.8L166.8 748.8L172.5 754.5L175.2 754.8L177.5 752.5L178.8 748.8L179.5 748.8L180.2 746.8L182.2 744.8L182.5 745.2L182.8 743.8L182.2 742.5L182.2 739.8L185.2 736.5L185.8 734.2L188.2 731.5L188.2 728.8L187.5 727.2L184.2 723.8L184.2 723.2L181.5 720.5L180.8 718.5L179.5 717.5L179.2 713.8L180.8 712.2L181.5 710.8L180.8 710.5L180.8 709.5L182.8 707.2L187.2 706.2L189.5 704.2L190.2 702.8L189.8 702.2L188.5 702.2L187.2 701.2L187.2 700.2L182.2 695.8L181.2 694.2L181.2 692.8L179.2 690.5L178.5 687.8L175.5 685.5L175.2 683.8L175.8 680.8L176.5 680.5L176.5 677.2L173.2 677.2L171.2 675.2Z","An Giang"],["#3caea3","M211.2 708.5L209.8 709.8L209.5 715.2L208.2 716.5L206.8 716.5L204.8 718.2L203.2 718.2L201.2 719.8L202.8 723.8L203.5 724.2L203.8 725.5L207.8 729.2L208.5 729.2L210.8 731.8L212.5 732.5L213.2 733.5L216.5 734.2L217.2 734.8L217.8 737.2L218.8 738.2L218.8 740.5L219.5 742.2L221.2 743.5L223.5 747.5L224.5 748.2L224.5 749.5L226.5 753.2L229.8 753.2L233.5 755.8L235.5 755.8L236.5 754.8L237.5 754.8L238.8 753.8L239.5 751.5L240.2 751.2L240.2 745.8L241.8 743.2L241.8 740.2L241.2 738.8L241.5 733.8L243.5 732.2L243.8 729.5L244.8 728.5L245.2 726.5L247.5 724.2L250.8 723.2L252.5 721.5L252.5 710.2L250.5 708.5L240.8 707.8L239.5 708.2L237.8 709.8L235.8 709.8L235.5 709.2L234.5 709.2L234.2 709.8L231.8 710.8L223.8 710.8L222.5 711.5L220.2 711.5L217.8 710.5L216.8 709.2L214.5 708.8L214.2 708.2Z","Vĩnh Long"],["#ef6f5e","M182.8 707.5L181.2 709.5L181.2 710.5L181.8 710.8L181.2 712.2L179.5 713.8L179.8 717.5L181.2 718.5L181.8 720.5L187.8 727.2L188.5 728.8L188.2 732.2L186.2 734.2L185.5 736.5L182.5 739.8L182.5 742.5L183.2 744.5L183.8 744.5L184.2 745.2L186.5 744.5L186.8 745.2L188.8 745.5L190.8 747.8L190.8 750.2L191.8 752.2L193.8 753.8L203.8 754.2L205.5 755.8L204.8 757.8L205.2 761.5L206.8 759.5L208.2 758.8L212.2 758.5L216.2 754.8L217.8 754.5L218.8 753.5L225.8 752.8L225.8 751.8L224.2 749.5L224.2 748.2L223.2 747.5L220.8 743.5L219.2 742.2L218.5 740.5L218.5 738.2L217.8 737.8L216.8 734.8L213.2 733.8L205.2 727.2L202.5 723.8L201.5 720.8L200.8 720.5L201.2 719.5L199.2 718.8L197.5 719.2L195.8 718.5L193.5 716.2L189.5 715.2L185.8 711.5L184.8 707.2Z","TP Cần Thơ"],["#7cc576","M205.2 755.8L202.8 754.2L193.8 754.2L191.5 752.2L190.5 750.2L190.5 747.8L188.8 745.8L186.8 745.5L186.5 744.8L185.2 744.8L184.8 745.5L184.2 745.5L183.8 744.8L182.8 744.8L182.5 745.5L182.2 745.2L180.5 746.8L179.8 748.8L179.2 748.8L177.8 752.5L175.2 755.2L172.5 754.8L166.8 749.2L163.8 748.2L159.8 747.8L159.5 748.5L157.2 749.2L152.2 748.8L151.8 757.8L150.8 758.8L150.8 767.8L149.8 768.8L149.8 771.8L150.5 772.8L150.5 790.5L149.5 791.8L149.5 794.8L150.2 796.5L151.2 797.2L155.5 796.8L156.5 796.2L159.5 796.2L161.5 794.8L165.5 793.8L169.5 790.2L170.5 788.5L172.5 788.2L172.8 787.5L174.2 787.2L178.8 782.8L180.8 778.8L181.5 778.5L183.2 774.2L189.8 767.5L192.2 767.8L192.5 767.2L198.2 765.8L199.2 764.8L202.8 764.2L204.8 761.5L204.5 757.8Z","Cà Mau"],["#4f86c6","M246 788L241 791L241 794L243 794Z","TP.HCM (Côn Đảo)"]];
/* Đường bao ngoài lãnh thổ (đất liền + Phú Quốc + Côn Đảo) */
const VN_SIL="M112.2 700.8L110.8 701.5L109.8 703.2L107.2 705.5L106.5 708.8L107.2 709.2L107.8 711.5L109.5 714.2L110.2 719.8L111.2 720.8L111.2 722.2L113.2 724.2L115.2 724.5L115.8 724.2L115.8 722.5L116.5 721.5L116.2 716.8L116.8 716.5L116.8 713.5L117.5 712.5L118.2 708.5L116.2 703.2L114.5 701.5ZM188.8 41.8L187.2 41.8L186.8 42.5L185.2 43.2L184.8 44.2L183.2 44.2L181.5 46.2L177.2 46.8L173.5 49.2L168.5 49.5L164.2 54.2L162.8 54.8L162.8 55.5L161.2 57.2L160.8 66.2L159.2 67.2L157.5 67.2L155.5 68.8L150.8 68.8L143.8 74.2L140.2 74.2L139.2 72.2L135.5 72.2L129.5 70.8L125.8 73.8L125.8 75.8L125.2 76.2L124.8 77.8L123.2 80.2L117.2 80.2L111.2 74.2L108.2 74.2L106.2 72.5L104.2 72.5L102.5 73.2L101.8 74.2L99.2 74.2L97.2 72.2L89.2 71.5L86.8 72.5L84.5 77.2L82.8 78.8L80.8 79.2L76.8 84.5L75.5 85.2L73.5 85.2L67.8 78.8L59.2 74.2L52.8 74.2L49.8 72.8L49.2 71.8L45.2 71.5L43.8 72.2L42.2 74.2L41.5 76.8L40.5 77.8L40.5 80.5L33.8 86.5L31.8 86.5L30.5 87.2L30.2 89.8L28.5 91.8L28.5 94.8L29.2 96.5L32.8 100.2L33.5 100.2L34.5 101.5L38.2 103.8L42.2 107.8L43.2 110.2L44.5 111.5L44.8 113.8L45.5 114.2L45.2 114.5L46.8 116.8L49.2 117.8L49.5 118.5L51.2 118.5L52.5 119.5L52.5 123.8L51.5 124.8L51.5 129.8L52.2 130.8L58.5 130.5L59.2 131.2L68.2 131.5L68.2 136.2L67.2 137.2L66.5 139.8L65.5 140.5L65.5 142.8L64.5 143.8L64.5 147.5L63.2 149.2L62.8 150.8L63.5 152.5L66.2 155.5L67.2 160.5L69.5 161.5L72.8 164.5L72.8 165.8L74.5 167.8L74.2 169.2L76.8 172.5L78.5 172.5L80.2 173.2L80.5 173.8L84.5 174.5L89.8 177.8L94.5 177.8L97.2 179.5L98.8 179.5L102.5 182.2L111.2 182.2L116.2 173.2L120.5 173.2L124.8 171.2L132.5 171.2L132.8 171.8L133.8 171.8L144.2 182.2L144.2 188.2L140.2 191.2L140.2 198.2L148.2 198.2L149.2 199.2L149.2 205.2L161.2 212.2L161.2 219.5L159.5 221.8L159.5 223.2L158.8 223.5L158.5 224.8L151.2 232.2L141.2 232.2L137.5 230.2L126.2 230.2L123.5 231.8L123.2 235.2L121.2 236.8L121.2 238.5L122.2 239.8L121.8 242.2L115.2 248.2L115.2 252.5L114.5 252.8L114.5 254.5L117.8 257.8L123.2 258.5L125.5 259.5L126.2 260.5L129.8 262.8L131.2 264.5L133.2 265.2L135.8 267.8L136.5 267.8L137.8 269.5L140.2 270.2L141.2 271.2L143.2 271.5L147.2 276.2L151.8 278.5L152.5 279.5L156.2 281.8L158.5 281.8L160.5 282.8L163.5 282.8L165.5 284.5L168.5 284.5L172.2 286.2L172.2 298.2L175.8 304.8L177.5 306.2L178.8 308.5L180.8 308.5L184.8 313.2L190.5 313.5L191.2 314.2L191.2 318.2L193.8 318.5L196.5 320.8L197.2 322.2L197.2 326.2L200.2 330.2L200.2 333.2L207.5 340.5L208.2 340.5L212.2 344.2L221.5 356.5L224.2 358.2L226.2 358.2L227.5 359.2L228.8 359.2L230.5 360.5L231.2 365.2L237.5 371.5L238.2 372.8L240.2 374.2L241.2 386.2L246.2 394.2L247.2 399.2L248.2 400.2L250.5 400.2L253.2 403.2L258.8 402.8L263.2 407.2L265.2 407.5L266.2 408.8L268.5 409.2L269.2 409.8L269.5 412.5L279.2 419.2L279.2 425.2L274.2 428.2L274.2 436.2L282.2 447.2L283.5 447.5L286.5 450.8L289.5 451.5L291.5 453.8L293.2 454.8L293.2 465.2L288.2 468.2L288.2 476.2L290.2 478.2L290.2 494.5L288.2 499.2L284.2 503.2L284.2 511.2L281.2 514.2L281.2 520.2L286.2 526.2L286.5 535.8L287.2 537.5L288.5 538.5L289.5 540.8L291.8 543.5L293.2 548.5L293.2 557.2L287.2 568.2L287.2 578.5L290.8 586.5L290.5 590.8L291.2 591.8L291.2 601.2L287.2 606.2L273.2 607.2L262.2 618.2L252.2 618.2L250.2 620.2L235.2 621.2L235.2 626.5L232.5 634.5L231.8 635.2L214.2 634.2L209.2 639.2L204.2 640.2L204.2 646.2L206.2 648.2L206.2 661.2L209.2 664.2L209.2 667.2L212.2 667.2L212.8 668.5L217.2 672.5L217.2 677.2L216.2 678.2L208.2 678.2L205.2 674.2L205.2 671.2L197.2 671.2L193.2 674.2L182.2 674.2L179.2 677.2L173.2 677.2L171.2 675.2L164.2 675.2L163.2 676.2L163.2 679.2L162.5 680.2L162.2 688.2L154.2 696.2L139.2 696.2L137.2 698.2L126.2 698.2L126.2 704.2L126.8 704.2L129.5 706.8L137.5 707.2L139.2 709.5L139.2 711.8L140.8 713.8L141.8 716.8L143.2 717.8L145.8 717.8L147.8 716.5L152.2 716.5L156.2 720.5L157.5 720.8L161.5 725.2L161.2 729.5L159.2 731.2L156.8 731.5L154.2 734.5L153.8 736.5L152.8 737.5L152.8 742.2L151.8 743.5L151.8 747.8L152.5 748.2L151.8 749.2L151.8 757.8L150.8 758.8L150.8 767.8L149.8 768.8L149.8 771.8L150.5 772.8L150.5 790.5L149.5 791.8L149.5 794.8L150.2 796.5L151.2 797.2L159.5 796.2L161.5 794.8L165.5 793.8L169.5 790.2L170.5 788.5L172.5 788.2L172.8 787.5L174.2 787.2L178.8 782.8L180.8 778.8L181.5 778.5L183.2 774.2L189.8 767.5L192.2 767.8L192.5 767.2L198.2 765.8L199.2 764.8L202.2 764.5L204.5 762.5L204.8 761.5L206.2 760.8L206.8 759.5L208.2 758.8L212.2 758.5L216.2 754.8L217.8 754.5L218.2 753.8L219.8 753.2L229.8 753.2L233.5 755.8L235.5 755.8L236.5 754.8L238.5 754.2L239.5 751.5L240.2 751.2L240.2 745.8L241.8 743.2L241.8 740.2L241.2 738.8L241.5 733.8L243.5 732.2L243.8 729.5L244.8 728.5L245.2 726.5L247.5 724.2L250.8 723.2L252.5 721.5L252.5 710.2L256.5 706.2L268.8 705.8L270.2 706.8L279.2 706.8L280.5 706.2L284.2 706.2L286.8 705.5L289.8 702.5L290.2 700.5L292.8 697.2L299.5 696.5L303.2 694.5L304.2 693.2L306.5 692.5L306.8 691.8L312.5 691.5L314.2 690.8L315.5 689.5L317.5 684.2L319.5 681.8L322.8 681.2L323.8 680.2L328.5 680.2L332.2 678.8L334.8 676.2L336.8 675.2L341.8 669.8L343.2 669.5L343.5 668.8L348.5 668.8L350.5 667.8L356.2 660.8L363.8 660.8L365.8 659.8L366.5 658.5L366.5 655.2L367.2 654.8L367.5 652.2L368.8 651.2L373.5 651.2L374.8 650.5L375.2 649.5L375.2 643.8L376.2 642.5L376.2 628.8L376.5 625.5L377.2 624.5L377.2 620.2L378.2 618.8L378.5 597.5L380.5 594.8L382.8 593.8L382.8 592.2L383.8 590.8L383.8 587.2L388.2 582.8L388.2 580.5L385.8 576.5L384.8 575.8L384.2 573.8L383.2 573.2L382.5 570.8L381.8 570.5L382.2 569.8L381.5 569.5L381.8 564.8L380.8 563.8L380.8 559.2L380.2 558.2L380.2 550.2L379.5 547.5L378.2 545.8L379.2 539.8L380.5 538.8L382.2 536.2L382.2 534.5L381.5 533.5L381.5 529.5L380.5 528.5L380.8 524.8L379.2 522.8L379.5 515.5L378.5 513.5L377.2 512.5L375.2 507.8L374.2 507.2L373.5 501.5L371.8 498.8L371.5 494.2L372.2 489.8L370.8 488.5L368.5 488.2L366.2 485.5L366.2 483.5L365.5 482.2L365.5 474.5L363.2 469.8L362.2 469.2L362.2 464.8L363.2 460.5L361.5 460.2L360.8 459.2L358.8 458.5L358.5 457.8L355.5 456.8L351.8 454.2L352.5 453.5L351.8 453.2L352.2 452.5L351.5 452.2L350.5 449.5L346.5 445.2L345.2 442.5L341.2 437.8L340.8 435.5L339.8 433.2L339.2 432.8L339.2 431.5L335.8 427.8L336.2 426.5L334.5 425.2L332.8 425.2L331.8 424.2L331.2 419.8L326.8 413.8L326.8 411.5L325.2 410.2L325.5 409.8L321.8 409.5L320.2 408.2L309.8 407.5L308.5 405.8L307.8 402.5L303.2 397.8L299.8 395.5L299.5 394.5L298.8 394.5L297.8 392.8L297.2 392.8L294.2 389.5L292.5 388.8L290.2 388.8L287.8 384.8L285.8 382.8L282.2 380.8L277.8 376.5L277.2 374.5L275.8 373.2L275.5 370.8L274.5 369.8L273.8 364.2L271.8 362.2L269.2 361.5L260.8 362.2L257.8 359.8L257.8 357.5L256.2 356.2L253.5 351.8L251.2 349.5L251.5 348.8L250.5 348.2L248.5 343.8L247.5 343.2L245.8 340.8L246.2 340.5L243.8 337.8L244.5 330.5L243.2 328.8L243.5 321.5L242.8 320.8L242.5 318.8L239.8 315.8L237.8 314.8L232.2 309.2L229.5 308.2L226.5 305.2L224.2 305.2L221.5 303.5L219.2 303.5L217.2 301.5L216.5 297.2L213.8 294.2L212.8 291.5L212.2 291.2L211.5 288.5L209.8 287.2L209.2 284.8L208.5 284.5L207.8 280.8L205.8 278.5L205.5 273.5L204.5 272.2L204.8 267.2L208.2 262.8L208.5 258.8L209.5 258.8L210.8 257.5L211.5 255.8L211.8 246.2L212.8 244.8L212.8 238.2L214.5 234.8L216.8 232.2L217.2 229.8L218.2 229.2L219.2 226.5L219.8 226.2L219.8 224.2L220.5 223.2L221.2 219.2L222.2 218.2L231.2 218.5L233.5 217.8L235.2 215.8L235.2 214.5L236.2 212.8L236.2 210.8L237.2 209.5L237.8 209.8L238.8 208.8L244.2 208.8L246.5 209.5L246.8 208.8L250.2 208.2L251.2 206.8L251.2 205.5L251.8 205.2L251.5 198.2L250.5 197.2L250.8 187.8L253.5 186.2L261.8 186.2L263.8 187.5L265.5 184.8L265.2 183.8L263.5 182.8L263.5 179.2L264.8 177.8L276.8 177.2L277.8 178.2L280.8 179.2L281.2 179.8L282.5 179.8L282.8 179.2L286.2 178.2L294.5 178.2L295.8 176.8L296.5 175.2L296.2 169.5L297.5 168.5L297.5 163.8L299.8 161.8L300.2 160.8L300.2 157.2L302.2 155.2L304.5 154.2L304.5 153.2L302.8 151.5L302.2 149.8L302.5 144.8L304.2 143.8L312.8 144.2L313.2 144.8L316.2 144.2L316.8 142.2L317.5 141.8L317.5 137.2L314.5 133.5L312.2 132.8L309.5 133.5L308.2 132.2L301.2 132.2L298.2 134.2L287.8 133.5L286.5 131.5L283.8 131.2L282.8 130.2L283.2 129.5L281.2 128.8L278.5 126.5L277.8 126.5L273.2 121.8L273.2 120.5L270.8 117.5L269.8 114.2L265.8 114.2L264.8 112.8L261.2 111.8L260.8 111.2L258.8 110.8L257.5 109.8L256.5 108.2L256.5 104.5L255.2 103.2L254.2 97.2L253.2 96.2L253.5 86.8L254.5 85.5L255.5 82.2L256.2 81.8L256.2 79.2L256.8 78.2L256.8 75.5L257.8 74.5L257.8 71.8L257.2 70.2L253.8 66.8L247.8 66.5L244.8 68.2L237.2 68.2L235.2 64.2L233.2 62.2L228.8 60.5L221.2 61.2L220.2 62.5L219.2 62.8L214.8 62.8L214.2 61.8L209.8 59.2L208.8 57.8L206.5 57.8L205.5 56.8L202.8 56.8L201.5 55.5L201.8 51.8L197.5 48.8L196.8 46.5ZM246 788L241 791L241 794L243 794Z";
/* Quần đảo Hoàng Sa, Trường Sa */
const VN_ISL=[[485.5,362],[522.8,369.4],[526.4,369.8],[531,371.5],[529.9,376.6],[497.6,392.7],[497.9,404.4],[505.4,406.7],[500.9,415.7],[543.1,415.1],[472.9,429.4],[531.5,742.1],[525.5,747.5],[501.4,780.4],[525.5,780.6],[494.8,784.8],[512.2,784.2],[522.2,784],[488,786.5],[480.5,795.4],[467.1,796]];
function vnMapBase(){
  const nb=VN_NB.map(n=>`<path d="${n[1]}" fill="${n[0]}" stroke="#d3c3ae" stroke-width="1" stroke-linejoin="round"/>`).join('');
  const pv=VN_PROV.map(p=>`<path d="${p[1]}" fill="${p[0]}" fill-rule="evenodd" stroke="#ffffff" stroke-width="1.1" stroke-linejoin="round"><title>${p[2]||''}</title></path>`).join('');
  const isl=VN_ISL.map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="2.6" ry="2" fill="#2f8fc9" stroke="#fff" stroke-width=".6"/>`).join('');
  return `<defs><filter id="vvSh" x="-10%" y="-10%" width="125%" height="125%"><feDropShadow dx="1.5" dy="2.5" stdDeviation="3" flood-color="#0b4f4a" flood-opacity=".35"/></filter></defs>
  <rect x="24" y="38" width="536" height="774" fill="#d3effb"/>
  <path d="M24 316H560M24 617H560" stroke="#7fc3df" stroke-width="1" stroke-dasharray="2 4" fill="none"/>
  ${nb}
  <path d="${VN_SIL}" fill="#f1e4b0" filter="url(#vvSh)"/>${pv}
  <path d="${VN_SIL}" fill="none" stroke="#6e5a35" stroke-width="1.4" stroke-linejoin="round"/>
  ${isl}
  <g font-family="Segoe UI,Roboto,Arial,sans-serif" text-anchor="middle" font-style="italic">
  <text x="400" y="88" font-size="14" fill="#8a8f88" letter-spacing="4">TRUNG QUỐC</text>
  <text x="70" y="300" font-size="14" fill="#8f7184" letter-spacing="5">LÀO</text>
  <text x="78" y="418" font-size="14" fill="#7f8a52" letter-spacing="4">THÁI LAN</text>
  <text x="190" y="560" font-size="14" fill="#9a7866" letter-spacing="4">CAMPUCHIA</text>
  <text x="345" y="205" font-size="13" fill="#3b7a99" letter-spacing="2">VỊNH BẮC BỘ</text>
  <text x="405" y="262" font-size="12" fill="#6f6a4a" font-style="normal" font-weight="600">ĐẢO HẢI NAM</text>
  <text x="405" y="277" font-size="10" fill="#6f6a4a">(Trung Quốc)</text>
  <text x="488" y="500" font-size="14" fill="#3b7a99" letter-spacing="3">BIỂN ĐÔNG</text>
  <text x="488" y="600" font-size="14" fill="#3b7a99" letter-spacing="3">BIỂN ĐÔNG</text>
  <text x="508" y="347" font-size="11" fill="#2d6f95">QĐ. Hoàng Sa</text>
  <text x="505" y="730" font-size="11" fill="#2d6f95">QĐ. Trường Sa</text>
  <text x="62" y="745" font-size="12" fill="#3b7a99" letter-spacing="2" transform="rotate(-62 62 745)">Vịnh Thái Lan</text></g>
  <g transform="translate(538 76)" fill="#5b7a76" font-family="Arial,sans-serif" text-anchor="middle"><path d="M0 -14 L5 4 L0 0 L-5 4Z"/><text y="17" font-size="10" font-weight="700">B</text></g>`;
}

/* ===================== HÀNH TRÌNH XUYÊN VIỆT ===================== */
A.trip=()=>{
  stopTimer();
  let svg=`<svg class="vv-map" viewBox="${VN_VIEW}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bản đồ Việt Nam">${vnMapBase()}`;
  STOPS.forEach((s,i)=>{
    const dn=S.stamps[s.id]!=null;
    svg+=`<g class="vv-node" data-a="stop" data-i="${i}"><circle class="c" cx="${s.x}" cy="${s.y}" r="8.5" fill="${dn?'#2e7d32':(i>=LKFREE(STOPS.length)&&!LKOPEN()?'#9ca3af':'#e0a21b')}" stroke="#fff" stroke-width="1.6"/>
    <text x="${s.x}" y="${s.y+3.6}" font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle">${i+1}</text></g>`;
  });
  svg+='</svg>';
  const n=STOPS.filter(s=>S.stamps[s.id]!=null).length;
  draw(`<h2 class="vv-h2">🗺️ Hành trình xuyên Việt</h2><p class="vv-sub">Bản đồ gồm 34 tỉnh, thành phố được đánh số từ 1 đến 34. Bấm vào một số trên bản đồ (hoặc trong danh sách) để xem.</p>
  <div class="vv-mapwrap">${svg}<div class="vv-side">
   <div class="vv-note">Đã thu thập: <b>${n}/${STOPS.length}</b> con dấu.<br><small>Bản đồ chỉ mang tính minh họa.</small></div>`+
  STOPS.map((s,i)=>`<button class="vv-act ${S.stamps[s.id]!=null?'sel':''}" data-a="stop" data-i="${i}"><span class="ic">${s.ic}</span><span class="tx"><b>${i+1}. ${esc(s.n)}</b></span><span class="jy">${S.stamps[s.id]!=null?'✅ '+'★'.repeat(S.stamps[s.id]):(i>=LKFREE(STOPS.length)&&!LKOPEN()?'🔒':'')}</span></button>`).join('')+
  `<div class="vv-row"><button class="vv-btn alt sm" data-a="home">← Về trang chủ</button></div></div></div>`);
};

let Q=null;
A.stop=d=>{if(+d.i>=LKFREE(STOPS.length)&&!LKOPEN())return LKASK(()=>{curScr='stop';A.stop(d)});const s=STOPS[+d.i];
  const hdr=`<div class="vv-center"><div class="vv-big">${s.ic}</div></div><h2 class="vv-h2 vv-center">${+d.i+1}. ${esc(s.n)}</h2>`;
  if(!s.hc){draw(hdr+`<div class="vv-story">Nội dung của nơi này sẽ sớm được cập nhật.</div><div class="vv-row"><button class="vv-btn alt" data-a="trip">← Bản đồ</button></div>`);return}
  const rows=[
   ['🏛️ Hình thành',vvMerge(s)],
   ['📍 Trung tâm hành chính',vvCap(s.tt.replace(/^Khu vực /,''))],
   ['🧩 Đơn vị cấp xã',s.hc],
   ['📐 Diện tích','khoảng '+vvNum(s.dt,1)+' km² (thứ '+vvRank('dt',s)+'/34 cả nước)'],
   ['👥 Dân số',vvPop(s.dn)+' (thứ '+vvRank('dn',s)+'/34, số liệu làm tròn)'],
   ['🛣️ Quốc lộ, cao tốc chính',s.ql],
   ['🌊 Sông, hồ, vịnh',s.song]
  ].map(r=>`<div style="margin:6px 0"><b>${r[0]}:</b> ${esc(r[1])}</div>`).join('');
  draw(hdr+`<div class="vv-note">${rows}</div>
  <div class="vv-story"><b>⭐ Điểm nổi bật</b><br>${s.intro.split('\n').map(x=>'• '+esc(x)).join('<br>')}</div>
  ${s.dc?`<div class="vv-story px-box">${[['🏞️ Danh lam thắng cảnh',s.dc],['🍲 Đặc sản nổi tiếng',s.ds],['🏛️ Nơi tham quan, di tích nổi bật',s.tq],['📸 Điểm dừng chân, check-in',s.dd]].map(r=>`<div class="px-sec"><b>${r[0]}</b><div class="px-tags">${r[1].map(x=>'<span>'+esc(x)+'</span>').join('')}</div></div>`).join('')}</div>`:''}
  ${s.qs&&s.qs.length?`<div class="vv-note">🎯 Thử thách gồm <b>${s.qs.length}</b> câu hỏi về tổng quan và điểm nổi bật. Trả lời đúng ít nhất <b>${Math.ceil(s.qs.length*0.6)}</b> câu để nhận con dấu.</div>`:''}
  <div class="vv-row">${s.qs&&s.qs.length?`<button class="vv-btn" data-a="startq" data-i="${d.i}">Bắt đầu thử thách ▶</button>`:''}<button class="vv-btn alt" data-a="trip">← Bản đồ</button></div>`)};
A.startq=d=>{Q={s:+d.i,qs:shuffle(STOPS[+d.i].qs),n:0,right:0,opts:[],picked:null};qScreen()};
function qScreen(){
  const st=STOPS[Q.s],q=Q.qs[Q.n];
  if(!Q.opts.length)Q.opts=shuffle(q.slice(1,5));
  const p=Q.picked;
  draw(`<div class="vv-prog"><i style="width:${(Q.n+(p!==null?1:0))/st.qs.length*100}%"></i></div>
  <small class="vv-sub">${esc(st.n)} · Câu ${Q.n+1}/${st.qs.length}</small>
  <div class="vv-q">${esc(q[0])}</div>`+
  Q.opts.map((o,i)=>{let c='';if(p!==null){if(o===q[1])c='ok';else if(i===p)c='bad'}
    return `<button class="vv-opt ${c}" data-a="ans" data-i="${i}" ${p!==null?'disabled':''}>${esc(o)}</button>`}).join('')+
  (p!==null?`<div class="vv-note">${Q.opts[p]===q[1]?'✅ Chính xác! ':'❌ Chưa đúng. Đáp án: <b>'+esc(q[1])+'</b>. '}${esc(q[5])}</div>
  <button class="vv-btn" data-a="qnext">${Q.n+1<st.qs.length?'Câu tiếp theo ▶':'Xem kết quả ▶'}</button>`:''));
}
A.ans=d=>{if(Q.picked!==null)return;Q.picked=+d.i;const q=Q.qs[Q.n];if(Q.opts[Q.picked]===q[1]){Q.right++;addPts(10);SFX('ok')}else SFX('bad');qScreen()};
A.qnext=()=>{Q.n++;Q.opts=[];Q.picked=null;if(Q.n>=STOPS[Q.s].qs.length)return qEnd();qScreen()};
function qEnd(){
  const st=STOPS[Q.s],N=Q.qs.length,ratio=Q.right/N,pass=Q.right>=Math.ceil(N*0.6),stars=pass?(ratio>=0.9?3:ratio>=0.75?2:1):0,first=pass&&S.stamps[st.id]==null;
  if(pass){S.stamps[st.id]=Math.max(S.stamps[st.id]||0,stars);if(first)S.pts+=20;persist();top()}
  SFX(pass?'win':'bad');
  draw(`<div class="vv-center"><div class="vv-big">${pass?'🛂':'💪'}</div>
  <h2 class="vv-h2">${pass?'Đã đóng dấu '+esc(st.s)+'!':'Gần được rồi, thử lại nhé!'}</h2>
  <div style="color:#e0a21b;font-size:30px;letter-spacing:3px">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
  <p>Bạn trả lời đúng <b>${Q.right}/${N}</b> câu${pass?'':' (cần ít nhất '+Math.ceil(N*0.6)+' câu)'}. ${first?'🎁 Con dấu mới! +20 điểm.':''}</p></div>`+
  (pass?`<div class="vv-note">🧳 <b>Mẹo du lịch:</b> ${esc(st.tip)}</div>`:'')+
  `<div class="vv-row" style="justify-content:center">
   <button class="vv-btn alt" data-a="startq" data-i="${Q.s}">↻ Chơi lại điểm này</button>
   ${pass&&Q.s+1<STOPS.length?`<button class="vv-btn" data-a="stop" data-i="${Q.s+1}">Điểm kế tiếp ▶</button>`:''}
   <button class="vv-btn alt" data-a="trip">🗺️ Bản đồ</button></div>`);
}

/* ===================== HỘ CHIẾU ===================== */
A.pass=()=>{stopTimer();
  draw(`<h2 class="vv-h2">🛂 Hộ chiếu của tôi</h2><p class="vv-sub">Mỗi con dấu là một điểm đến bạn đã chinh phục.</p><div class="vv-stamps">`+
  STOPS.map(s=>S.stamps[s.id]!=null
   ?`<div class="vv-stamp"><div class="big">${s.ic}</div><b>${esc(s.s)}</b><small>${'★'.repeat(S.stamps[s.id])}${'☆'.repeat(3-S.stamps[s.id])}</small></div>`
   :`<div class="vv-stamp off"><div class="big">❓</div><b>${esc(s.s)}</b><small>Chưa đến</small></div>`).join('')+
  `</div><div class="vv-row"><button class="vv-btn alt" data-a="home">← Về trang chủ</button></div>`)};

/* ===================== ĐẶC SẢN VỀ ĐÚNG QUÊ ===================== */
let F=null;
A.food=()=>{stopTimer();F={items:shuffle(FOODS).slice(0,8),i:0,pts:0,ok:0,streak:0,picked:null};foodScreen()};
function foodScreen(){
  if(F.i>=F.items.length)return foodEnd();
  const f=F.items[F.i],p=F.picked,regs=['Bắc','Trung','Nam'];
  draw(`<div class="vv-prog"><i style="width:${F.i/F.items.length*100}%"></i></div>
  <small class="vv-sub">Đặc sản về đúng quê · Món ${F.i+1}/${F.items.length} · Điểm: ${F.pts}${F.streak>=3?' 🔥':''}</small>
  <div class="vv-food">${f[1]}</div><div class="vv-q vv-center">${esc(f[0])} là đặc sản của miền nào?</div>
  <div class="vv-regs">`+regs.map(r=>{let c='';if(p!==null){if(r===f[2])c='ok';else if(r===p)c='bad'}
    return `<button class="vv-reg ${c}" data-a="fans" data-r="${r}" ${p!==null?'disabled':''}>Miền ${r}</button>`}).join('')+`</div>`+
  (p!==null?`<div class="vv-note">${p===f[2]?'✅ Chính xác! ':'❌ Món này thuộc miền '+f[2]+'. '}${esc(f[3])}</div><button class="vv-btn" data-a="fnext">${F.i+1<F.items.length?'Món tiếp theo ▶':'Xem kết quả ▶'}</button>`:''));
}
A.fans=d=>{if(F.picked!==null)return;F.picked=d.r;const f=F.items[F.i];if(d.r===f[2]){F.ok++;F.streak++;F.pts+=10+(F.streak>=3?5:0);SFX('ok')}else{F.streak=0;SFX('bad')}foodScreen()};
A.fnext=()=>{F.i++;F.picked=null;if(F.i<F.items.length&&F.i>=LKFREE(F.items.length)&&!LKOPEN())return LKASK(foodScreen,()=>{F.items=F.items.slice(0,F.i);foodScreen()});foodScreen()};
function foodEnd(){
  addPts(F.pts);const nb=F.pts>S.best.food;if(nb){S.best.food=F.pts;persist()}
  if(nb)SFX('win');
  draw(`<div class="vv-center"><div class="vv-big">🍜</div><h2 class="vv-h2">Hoàn thành!</h2><p>Đúng <b>${F.ok}/${F.items.length}</b> món · <b>${F.pts}</b> điểm ${nb?'🎉 Kỷ lục mới!':'(kỷ lục: '+S.best.food+')'}</p></div>
  <div class="vv-row" style="justify-content:center"><button class="vv-btn" data-a="food">Chơi lại</button><button class="vv-btn alt" data-a="home">Trang chủ</button></div>`);
}

/* ===================== ĐOÁN ĐỊA DANH QUA ẢNH MỜ ===================== */
let G=null;
A.guess=()=>{stopTimer();G={rounds:shuffle(PLACES).slice(0,6),r:0,pts:0,picked:null,opts:[],t0:0,hints:1,gain:0};guessRound()};
function guessRound(){
  if(G.r>=G.rounds.length)return guessEnd();
  const c=G.rounds[G.r];
  G.opts=shuffle([c[0],...shuffle(PLACES.filter(x=>x!==c).map(x=>x[0])).slice(0,3)]);
  G.picked=null;G.hints=1;G.t0=Date.now();
  guessDraw();
  stopTimer();
  timer=setInterval(()=>{
    if(G.picked!==null)return;
    const e=(Date.now()-G.t0)/1000,pic=document.getElementById('vv-pic');
    if(pic)pic.style.filter='blur('+Math.max(0,22-e*1.6).toFixed(1)+'px)';
    const h=1+(e>=5?1:0)+(e>=10?1:0);
    if(h!==G.hints){G.hints=h;guessDraw()}
  },150);
}
function guessDraw(){
  const c=G.rounds[G.r],p=G.picked,e=(Date.now()-G.t0)/1000;
  const blur=p!==null?0:Math.max(0,22-e*1.6);
  draw(`<div class="vv-prog"><i style="width:${G.r/G.rounds.length*100}%"></i></div>
  <small class="vv-sub">Đoán địa danh · Vòng ${G.r+1}/${G.rounds.length} · Điểm: ${G.pts}</small>
  <div class="vv-pic" id="vv-pic" style="filter:blur(${blur.toFixed(1)}px)">${c[1]}</div>`+
  [2,3].map((k,i)=>`<div class="vv-hint ${i<G.hints?'':'off'}">💡 Gợi ý ${i+1}: ${i<G.hints?esc(c[k]):'(sẽ hiện sau '+(i+1)*5+' giây)'}</div>`).join('')+
  `<div class="vv-q">Đây là đâu? <small class="vv-sub">(Đoán càng sớm, điểm càng cao)</small></div>`+
  G.opts.map((o,i)=>{let cl='';if(p!==null){if(o===c[0])cl='ok';else if(i===p)cl='bad'}
    return `<button class="vv-opt ${cl}" data-a="gans" data-i="${i}" ${p!==null?'disabled':''}>${esc(o)}</button>`}).join('')+
  (p!==null?`<div class="vv-note">${G.opts[p]===c[0]?'✅ Chính xác! +'+G.gain+' điểm.':'❌ Đáp án đúng: <b>'+esc(c[0])+'</b>.'}</div><button class="vv-btn" data-a="gnext">${G.r+1<G.rounds.length?'Vòng tiếp ▶':'Xem kết quả ▶'}</button>`:''));
}
A.gans=d=>{
  if(G.picked!==null)return;
  const c=G.rounds[G.r],e=(Date.now()-G.t0)/1000;stopTimer();
  G.picked=+d.i;
  if(G.opts[G.picked]===c[0]){G.gain=Math.max(10,Math.round(60-e*3));G.pts+=G.gain;SFX('ok')}else SFX('bad');
  guessDraw();
};
A.gnext=()=>{G.r++;if(G.r<G.rounds.length&&G.r>=LKFREE(G.rounds.length)&&!LKOPEN())return LKASK(guessRound,()=>{G.rounds=G.rounds.slice(0,G.r);guessRound()});guessRound()};
function guessEnd(){
  stopTimer();addPts(G.pts);const nb=G.pts>S.best.guess;if(nb){S.best.guess=G.pts;persist()}
  if(nb)SFX('win');
  draw(`<div class="vv-center"><div class="vv-big">🔍</div><h2 class="vv-h2">Hoàn thành!</h2><p>Bạn được <b>${G.pts}</b> điểm (tối đa 360). ${nb?'🎉 Kỷ lục mới!':'Kỷ lục: '+S.best.guess}</p></div>
  <div class="vv-row" style="justify-content:center"><button class="vv-btn" data-a="guess">Chơi lại</button><button class="vv-btn alt" data-a="home">Trang chủ</button></div>`);
}

/* ===================== CHUYẾN ĐI CÓ NGÂN SÁCH ===================== */
let B=null;
function bestPlan(t){
  const n=t.it.length;let bj=0,bm=0;
  for(let m=0;m<(1<<n);m++){let c=0,d=0,j=0;
    for(let k=0;k<n;k++)if(m>>k&1){d+=t.it[k][2];c+=t.it[k][3];j+=t.it[k][4]}
    if(c<=t.b&&d<=t.d&&j>bj){bj=j;bm=m}}
  return{j:bj,m:bm};
}
const tot=(t,sel)=>sel.reduce((a,k)=>({c:a.c+t.it[k][3],d:a.d+t.it[k][2],j:a.j+t.it[k][4]}),{c:0,d:0,j:0});
A.budget=()=>{stopTimer();const nT=LKOPEN()?TRIPS.length:LKFREE(TRIPS.length);B={t:TRIPS[Math.random()*nT|0],sel:[],done:false};budgetDraw()};
function budgetDraw(){
  const t=B.t,T=tot(t,B.sel);
  draw(`<h2 class="vv-h2">💰 Chuyến đi có ngân sách: ${esc(t.n)}</h2>
  <p class="vv-sub">Chọn các hoạt động để đạt tổng <b>điểm hài lòng</b> cao nhất mà không vượt quá ngân sách và số ngày.</p>
  <div class="vv-meter"><span class="${T.c>t.b?'over':''}">💵 ${vnd(T.c)} / ${vnd(t.b)}</span><span class="${T.d>t.d?'over':''}">📅 ${T.d} / ${t.d} ngày</span><span>😊 ${T.j} điểm</span></div>`+
  t.it.map((it,k)=>{const on=B.sel.includes(k),fits=T.c+it[3]<=t.b&&T.d+it[2]<=t.d;
    return `<button class="vv-act ${on?'sel':''}" data-a="btog" data-k="${k}" ${!on&&!fits?'disabled':''}><span class="ic">${it[1]}</span><span class="tx"><b>${esc(it[0])}</b><small>${vnd(it[3])} · ${it[2]} ngày</small></span><span class="jy">+${it[4]} 😊</span></button>`}).join('')+
  `<div class="vv-row"><button class="vv-btn" data-a="bdone" ${B.sel.length?'':'disabled'}>Chốt lịch trình ✅</button><button class="vv-btn alt" data-a="budget">Đổi chuyến khác</button><button class="vv-btn alt" data-a="home">Trang chủ</button></div>`);
}
A.btog=d=>{
  const k=+d.k,i=B.sel.indexOf(k);
  if(i>=0)B.sel.splice(i,1);else{const T=tot(B.t,B.sel),it=B.t.it[k];if(T.c+it[3]>B.t.b||T.d+it[2]>B.t.d){toast('Vượt ngân sách hoặc số ngày!');return}B.sel.push(k)}
  budgetDraw();
};
A.bdone=()=>{
  const t=B.t,T=tot(t,B.sel),bp=bestPlan(t),ratio=T.j/bp.j,stars=ratio>=.95?3:ratio>=.8?2:1,pts=Math.round(ratio*50);
  addPts(pts);const nb=pts>S.best.trip;if(nb){S.best.trip=pts;persist()}
  const opt=t.it.map((it,k)=>bp.m>>k&1?it:null).filter(Boolean);
  draw(`<div class="vv-center"><div class="vv-big">${stars===3?'🏆':stars===2?'👏':'🙂'}</div><h2 class="vv-h2">Lịch trình của bạn: ${T.j}/${bp.j} điểm hài lòng</h2>
  <div style="color:#e0a21b;font-size:30px;letter-spacing:3px">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
  <p>+${pts} điểm ${nb?'🎉 Kỷ lục mới!':'(kỷ lục: '+S.best.trip+')'}</p></div>
  <div class="vv-note"><b>Lịch trình tối ưu</b> (${bp.j} điểm):<br>${opt.map(o=>o[1]+' '+esc(o[0])).join('<br>')}</div>
  <div class="vv-row" style="justify-content:center"><button class="vv-btn" data-a="budget">Chuyến mới</button><button class="vv-btn alt" data-a="home">Trang chủ</button></div>`);
};

home();
})();
