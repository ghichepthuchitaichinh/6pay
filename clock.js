/* 6PAY - Dạy trẻ xem đồng hồ. File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
 var st=document.createElement("style");st.textContent="#ckOv{background:linear-gradient(180deg,#0b1d3a,#1d4e89);color:#fff;font-family:'Be Vietnam Pro',system-ui,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\n#ckOv *{box-sizing:border-box}\n.ck-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px}\n.ck-title{flex:1;text-align:center;font-weight:800;font-size:17px;line-height:1.25}\n.ck-ib{width:44px;height:44px;flex:none;border:0;border-radius:12px;background:rgba(255,255,255,.18);color:#fff;font-size:22px;font-weight:700;cursor:pointer;font-family:inherit}\n.ck-ib:active{transform:scale(.96)}\n.ck-body{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;align-items:center;padding:0 14px 18px}\n.ck-svg{width:min(92vw,50vh,440px);height:auto;aspect-ratio:1;touch-action:none;flex:none;display:block;cursor:grab}\n.ck-digital{margin-top:8px;font-size:34px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:1px}\n.ck-say{min-height:44px;margin-top:2px;text-align:center;font-size:16px;font-weight:700;color:#fde68a;line-height:1.4;padding:0 6px}\n.ck-legend{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;font-size:13px;color:#cfe0ff;margin:4px 0 10px}\n.ck-legend i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:5px;vertical-align:-1px}\n.ck-seg{display:flex;gap:8px;width:100%;max-width:440px;margin-bottom:8px}\n.ck-seg button,.ck-now{flex:1;font:inherit;font-size:15px;font-weight:700;color:#fff;background:rgba(255,255,255,.16);border:2px solid transparent;border-radius:14px;padding:11px 8px;cursor:pointer}\n.ck-seg button.on{background:#16a34a;border-color:#86efac}\n.ck-now{flex:none;width:100%;max-width:440px}\n/* Vừa khít 1 màn hình: mặt đồng hồ tự co theo phần còn trống */\n#ckOv{overflow:hidden}\n.ck-bar{padding:6px 12px}\n.ck-body{overflow:hidden;justify-content:space-between;padding:0 14px max(10px,env(safe-area-inset-bottom,0px));gap:clamp(4px,1vh,10px)}\n.ck-face{flex:1 1 0;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;container-type:size}\n.ck-svg{width:min(92vw,38vh,440px);max-width:100%;max-height:100%}\n@supports (width:1cqh){.ck-svg{width:min(100cqw,100cqh,460px)}}\n.ck-digital{margin-top:0;font-size:clamp(24px,4.4vh,34px);line-height:1.1;flex:none}\n.ck-say{flex:none;margin:0;min-height:0;height:2.8em;font-size:clamp(13px,2vh,16px);display:flex;align-items:center;justify-content:center;overflow:hidden}\n.ck-legend{flex:none;margin:0;gap:4px 12px;font-size:clamp(12px,1.7vh,13px)}\n.ck-seg{flex:none;margin:0}\n.ck-seg button,.ck-now{font-size:clamp(13px,2vh,15px);padding:clamp(7px,1.3vh,11px) 6px;line-height:1.2}\n.ck-now{flex:none}\n.ck-tip{flex:none;font-size:12px;color:#9fc0ff;text-align:center;max-width:440px;line-height:1.4}\n@media (max-height:600px){.ck-tip{display:none}.ck-legend{display:none}}\n";document.head.appendChild(st);
 var d=document.createElement("div");d.innerHTML="<div class=\"gm-ov\" id=\"ckOv\">\n <div class=\"ck-bar\">\n  <button class=\"ck-ib\" id=\"ckBack\" type=\"button\" aria-label=\"Quay lại\">←</button>\n  <div class=\"ck-title\">🕒 Dạy trẻ xem đồng hồ</div>\n  <button class=\"ck-ib\" id=\"ckX\" type=\"button\" aria-label=\"Đóng\">✕</button>\n </div>\n <div class=\"ck-body\">\n  <div class=\"ck-face\"><svg class=\"ck-svg\" id=\"ckSvg\" viewBox=\"0 0 300 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Đồng hồ 3 kim\"></svg></div>\n  <div class=\"ck-digital\" id=\"ckDig\">12:00:00</div>\n  <div class=\"ck-say\" id=\"ckSay\"></div>\n  <div class=\"ck-legend\">\n   <span><i style=\"background:#d8453d\"></i>Kim giờ (ngắn, to)</span>\n   <span><i style=\"background:#2c5fa8\"></i>Kim phút (dài)</span>\n   <span><i style=\"background:#f59e0b\"></i>Kim giây (mảnh)</span>\n  </div>\n  <div class=\"ck-seg\">\n   <button type=\"button\" id=\"ckOn\">🔊 Đọc thời gian</button>\n   <button type=\"button\" id=\"ckOff\">🔇 Không đọc</button>\n  </div>\n  <div class=\"ck-seg\">\n   <button type=\"button\" id=\"ckNumOn\">🔢 Hiện giờ bằng số</button>\n   <button type=\"button\" id=\"ckNumOff\">🙈 Ẩn giờ bằng số</button>\n  </div>\n  <button class=\"ck-now\" type=\"button\" id=\"ckNow\">🕒 Đặt theo giờ hiện tại</button>\n  <div class=\"ck-tip\">Hãy dùng ngón tay xoay một kim bất kỳ. Các kim còn lại sẽ quay theo đúng như đồng hồ thật. Thả tay ra để nghe đọc giờ.</div>\n </div>\n</div>";while(d.firstChild)document.body.appendChild(d.firstChild);
})();
(function(){
 if(window.ClockGame)return;
 var ov=document.getElementById('ckOv'), svg=document.getElementById('ckSvg');
 var dig=document.getElementById('ckDig'), say=document.getElementById('ckSay');
 var bOn=document.getElementById('ckOn'), bOff=document.getElementById('ckOff');
 var bNumOn=document.getElementById('ckNumOn'), bNumOff=document.getElementById('ckNumOff');
 var showNum=true;
 try{showNum=localStorage.getItem('6pay_clock_num')!=='0';}catch(e){}
 var T=0;                       // số giây đã trôi qua trong chu kỳ 12 giờ (0 đến 43200)
 var speakOn=true;
 try{speakOn=localStorage.getItem('6pay_clock_speak')!=='0';}catch(e){}
 var LEN={h:62,m:98,s:118};
 var drag=null, hH, hM, hS;

 // ----- Vẽ mặt đồng hồ -----
 (function build(){
  var s='<circle cx="150" cy="150" r="146" fill="#fff" stroke="#2b3a67" stroke-width="6"/>';
  s+='<circle cx="150" cy="150" r="128" fill="#f4f8ff"/>';
  for(var i=0;i<60;i++){
   var a=i*6*Math.PI/180, big=i%5===0, r1=140, r2=big?130:135.5;
   s+='<line x1="'+(150+r1*Math.sin(a)).toFixed(2)+'" y1="'+(150-r1*Math.cos(a)).toFixed(2)+'" x2="'+(150+r2*Math.sin(a)).toFixed(2)+'" y2="'+(150-r2*Math.cos(a)).toFixed(2)+'" stroke="'+(big?'#2b3a67':'#8a97b8')+'" stroke-width="'+(big?3:1.4)+'" stroke-linecap="round"/>';
  }
  var cols=['#ef4444','#f59e0b','#16a34a','#0ea5e9','#7c3aed','#ec4899'];
  for(var n=1;n<=12;n++){
   var b=n*30*Math.PI/180;
   s+='<text x="'+(150+92*Math.sin(b)).toFixed(2)+'" y="'+(150-92*Math.cos(b)).toFixed(2)+'" dy=".35em" text-anchor="middle" font-size="27" font-weight="800" fill="'+cols[(n-1)%6]+'" font-family="Be Vietnam Pro,Arial,sans-serif">'+n+'</text>';
   var mm=n*5;
   s+='<text x="'+(150+119*Math.sin(b)).toFixed(2)+'" y="'+(150-119*Math.cos(b)).toFixed(2)+'" dy=".35em" text-anchor="middle" font-size="10.5" font-weight="700" fill="#6b7280" font-family="Be Vietnam Pro,Arial,sans-serif">'+mm+'</text>';
  }
  s+='<g id="ckHh"><line x1="150" y1="164" x2="150" y2="'+(150-LEN.h)+'" stroke="#d8453d" stroke-width="10" stroke-linecap="round"/><circle cx="150" cy="'+(150-LEN.h)+'" r="10" fill="#d8453d" stroke="#fff" stroke-width="2.5"/></g>';
  s+='<g id="ckHm"><line x1="150" y1="162" x2="150" y2="'+(150-LEN.m)+'" stroke="#2c5fa8" stroke-width="6.5" stroke-linecap="round"/><circle cx="150" cy="'+(150-LEN.m)+'" r="9" fill="#2c5fa8" stroke="#fff" stroke-width="2.5"/></g>';
  s+='<g id="ckHs"><line x1="150" y1="172" x2="150" y2="'+(150-LEN.s)+'" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/><circle cx="150" cy="'+(150-LEN.s)+'" r="8" fill="#f59e0b" stroke="#fff" stroke-width="2.5"/></g>';
  s+='<circle cx="150" cy="150" r="9" fill="#2b3a67" stroke="#fff" stroke-width="2"/>';
  svg.innerHTML=s;
  hH=document.getElementById('ckHh'); hM=document.getElementById('ckHm'); hS=document.getElementById('ckHs');
 })();

 // ----- Tính toán -----
 function degH(){return T/43200*360;}
 function degM(){return (T%3600)/3600*360;}
 function degS(){return (T%60)/60*360;}
 function norm(d,half){var f=2*half;d=((d%f)+f)%f;if(d>half)d-=f;return d;}
 function parts(t){
  var s=Math.floor(t)%43200, h=Math.floor(s/3600)%12;
  return {h:h===0?12:h, m:Math.floor(s%3600/60), s:s%60};
 }
 function pad(n){return (n<10?'0':'')+n;}
 function phrase(p){
  if(p.m===0&&p.s===0)return 'Bây giờ là '+p.h+' giờ đúng';
  var txt='Bây giờ là '+p.h+' giờ '+p.m+' phút '+p.s+' giây';
  var el=p.m*60+p.s;
  if(el>1800){ // quá nửa giờ thì đọc thêm cách nói "kém"
   var rem=3600-el, nh=p.h%12+1;
   txt+=', hoặc là '+nh+' giờ kém '+Math.floor(rem/60)+' phút '+(rem%60)+' giây';
  }
  return txt;
 }
 function render(){
  hH.setAttribute('transform','rotate('+degH().toFixed(3)+' 150 150)');
  hM.setAttribute('transform','rotate('+degM().toFixed(3)+' 150 150)');
  hS.setAttribute('transform','rotate('+degS().toFixed(3)+' 150 150)');
  var p=parts(T);
  dig.textContent=pad(p.h)+':'+pad(p.m)+':'+pad(p.s);
 }

 // ----- Đọc to -----
 function stopSpeech(){try{if(window.speechSynthesis)speechSynthesis.cancel();}catch(e){}}
 function speak(txt){
  if(!speakOn)return;
  try{
   if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
   speechSynthesis.cancel();
   var u=new SpeechSynthesisUtterance(txt);
   u.lang='vi-VN'; u.rate=0.9;
   speechSynthesis.speak(u);
  }catch(e){}
 }
 function setSpeak(v){
  speakOn=v;
  try{localStorage.setItem('6pay_clock_speak',v?'1':'0');}catch(e){}
  if(!v)stopSpeech();
  bOn.classList.toggle('on',v); bOff.classList.toggle('on',!v);
  if(v)speak(phrase(parts(T)));
 }
 function paintToggle(){
  bOn.classList.toggle('on',speakOn);bOff.classList.toggle('on',!speakOn);
  bNumOn.classList.toggle('on',showNum);bNumOff.classList.toggle('on',!showNum);
  dig.style.visibility=showNum?'visible':'hidden';
  say.style.visibility=showNum?'visible':'hidden';
 }
 function setNum(v){
  showNum=v;
  try{localStorage.setItem('6pay_clock_num',v?'1':'0');}catch(e){}
  paintToggle();
 }

 // ----- Điều khiển kim -----
 function pt(e){
  var r=svg.getBoundingClientRect();
  var x=(e.clientX-r.left)*300/r.width-150, y=(e.clientY-r.top)*300/r.height-150;
  return {x:x,y:y,r:Math.sqrt(x*x+y*y),a:(Math.atan2(x,-y)*180/Math.PI+360)%360};
 }
 function segDist(p,deg,L){
  var a=deg*Math.PI/180, ux=Math.sin(a), uy=-Math.cos(a);
  var t=Math.max(0,Math.min(L,p.x*ux+p.y*uy));
  var dx=p.x-t*ux, dy=p.y-t*uy;
  return Math.sqrt(dx*dx+dy*dy);
 }
 function pickHand(p){
  var hs=[{k:'h',d:segDist(p,degH(),LEN.h),L:LEN.h},{k:'m',d:segDist(p,degM(),LEN.m),L:LEN.m},{k:'s',d:segDist(p,degS(),LEN.s),L:LEN.s}];
  var mn=Math.min(hs[0].d,hs[1].d,hs[2].d);
  if(mn>60)return null;
  var c=hs.filter(function(h){return h.d<=mn+10;});
  c.sort(function(a,b){return Math.abs(a.L-p.r)-Math.abs(b.L-p.r);});
  return c[0].k;
 }
 function turn(a){
  if(drag==='s')T+=norm(a/360*60-(T%60),30);
  else if(drag==='m')T+=norm(a/360*3600-(T%3600),1800);
  else if(drag==='h')T+=norm(a/360*43200-T,21600);
  T=((T%43200)+43200)%43200;
  render();
 }
 svg.addEventListener('pointerdown',function(e){
  e.preventDefault();
  var p=pt(e), k=pickHand(p);
  if(!k)return;
  drag=k; stopSpeech(); say.textContent='';
  try{svg.setPointerCapture(e.pointerId);}catch(x){}
  turn(p.a);
 });
 svg.addEventListener('pointermove',function(e){
  if(!drag)return;
  e.preventDefault();
  turn(pt(e).a);
 });
 function release(){
  if(!drag)return;
  drag=null;
  T=Math.round(T)%43200;
  render();
  var txt=phrase(parts(T));
  say.textContent=txt;
  speak(txt);
 }
 svg.addEventListener('pointerup',release);
 svg.addEventListener('pointercancel',release);
 svg.addEventListener('contextmenu',function(e){e.preventDefault();});

 // ----- Nút bấm -----
 function now(){var d=new Date();T=d.getHours()*3600+d.getMinutes()*60+d.getSeconds();T%=43200;}
 document.getElementById('ckNow').addEventListener('click',function(){
  now();render();
  var txt=phrase(parts(T));say.textContent=txt;speak(txt);
 });
 bOn.addEventListener('click',function(){setSpeak(true);});
 bOff.addEventListener('click',function(){setSpeak(false);});
 bNumOn.addEventListener('click',function(){setNum(true);});
 bNumOff.addEventListener('click',function(){setNum(false);});

 function open(){
  now();render();say.textContent='';paintToggle();
  ov.classList.add('show');
  document.body.style.overflow='hidden';
 }
 function close(){
  drag=null;stopSpeech();
  ov.classList.remove('show');
  document.body.style.overflow='';
 }
 document.getElementById('ckBack').addEventListener('click',close);
 document.getElementById('ckX').addEventListener('click',close);
 document.addEventListener('visibilitychange',function(){if(document.hidden)stopSpeech();});
 paintToggle();
 window.ClockGame={open:open,close:close};
})();
