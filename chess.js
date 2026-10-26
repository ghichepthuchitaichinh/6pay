/* 6PAY - Game Cờ vua. File này được index.html tải về khi người dùng mở trò chơi. */
(function(){
 var st=document.createElement("style");st.textContent="#chessOv{background:#1d2330}\n#chess-root{font-family:'Be Vietnam Pro',system-ui,sans-serif;color:#fff;max-width:560px;margin:0 auto;padding-bottom:16px}\n#chess-root *{box-sizing:border-box}\n#chess-root h1{font-size:20px;margin:0 0 4px;cursor:pointer}\n.ch-sub{color:#aab4c8;font-size:13.5px;line-height:1.5;margin:0 0 14px}\n.ch-btn{display:block;width:100%;text-align:left;font:inherit;font-size:15px;font-weight:700;color:#fff;background:#2c3750;border:1px solid #3d4a69;border-radius:14px;padding:13px 14px;margin-bottom:10px;cursor:pointer}\n.ch-btn small{display:block;font-weight:400;color:#aab4c8;font-size:12.5px;margin-top:2px}\n.ch-btn.main{background:#2c5fa8;border-color:#2c5fa8}\n.ch-btn.sm{display:inline-block;width:auto;font-size:14px;padding:9px 14px;margin:0 8px 8px 0}\n.ch-st{min-height:22px;font-size:14.5px;font-weight:700;margin:6px 0 8px;text-align:center}\n.ch-b{display:grid;grid-template-columns:repeat(8,1fr);width:100%;max-width:520px;margin:0 auto;border:3px solid #3d4a69;border-radius:6px;overflow:hidden;touch-action:manipulation}\n.ch-s{aspect-ratio:1;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;font-size:min(9.6vw,50px);line-height:1}\n.ch-s.l{background:#f0d9b5}.ch-s.d{background:#b58863}\n.ch-s.lm{box-shadow:inset 0 0 0 100px rgba(255,214,0,.35)}\n.ch-s.sel{box-shadow:inset 0 0 0 100px rgba(60,200,90,.5)}\n.ch-s.ck{box-shadow:inset 0 0 0 100px rgba(230,50,50,.55)}\n.ch-s.mv::after{content:\"\";width:28%;height:28%;border-radius:50%;background:rgba(30,120,50,.55);position:absolute}\n.ch-s.cp::after{content:\"\";position:absolute;inset:4%;border-radius:50%;border:4px solid rgba(30,120,50,.65)}\n.ch-s .pw{color:#fff!important;-webkit-text-fill-color:#fff;-webkit-text-stroke:1.6px #000;paint-order:stroke fill;text-shadow:0 1px 2px rgba(0,0,0,.6)}\n.ch-s .pb{color:#000!important;-webkit-text-fill-color:#000;-webkit-text-stroke:.7px #fff;paint-order:stroke fill}\n.ch-res{background:#2c3750;border-radius:14px;padding:14px;margin-top:12px;text-align:center}\n.ch-res b{display:block;font-size:18px;margin-bottom:10px}\n.ch-bar{display:flex;gap:8px;justify-content:center;margin-top:10px;flex-wrap:wrap}\n.ch-lv{display:flex;justify-content:space-between;align-items:center;gap:8px}\n.ch-star{color:#f4c542;white-space:nowrap}";document.head.appendChild(st);
 var d=document.createElement("div");d.innerHTML="<div class=\"gm-ov\" id=\"chessOv\"><div class=\"gm-bar\"><button class=\"gm-x\" onclick=\"GameOv.back('chess')\">← Quay lại</button><button class=\"gm-x\" onclick=\"GameOv.close('chess')\">✕ Đóng</button></div><div class=\"gm-body\"><div id=\"chess-root\"></div></div></div>";while(d.firstChild)document.body.appendChild(d.firstChild);
})();
(function(){
'use strict';
/* Chặn chế độ 'Auto Dark Mode' của Chrome/Edge tự đảo màu bàn cờ và quân cờ */
try{var _m=document.createElement('meta');_m.name='color-scheme';_m.content='only light';document.head.appendChild(_m)}catch(e){}
var root=document.getElementById('chess-root');
var KEY='6pay_chess_v1',S={camp:1,win:{}};
try{var x=JSON.parse(localStorage.getItem(KEY));if(x)S=Object.assign(S,x)}catch(e){}
function sv(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var LV=[null,
 {n:'Cấp 1 · Tập sự',d:'Đi gần như ngẫu nhiên, hay bỏ quân.'},
 {n:'Cấp 2 · Sơ cấp',d:'Nhìn trước 1 nước, hay mắc sai lầm.'},
 {n:'Cấp 3 · Trung bình',d:'Nhìn trước 2 nước, biết tránh bị ăn quân.'},
 {n:'Cấp 4 · Khá',d:'Nhìn trước 3 nước, biết tính đổi quân.'},
 {n:'Cấp 5 · Cao thủ',d:'Nhìn sâu 4 nước, tính các nước ăn quân liên tiếp.'},
 {n:'Cấp 6 · Đại kiện tướng',d:'Mạnh nhất của game: nhìn sâu nhiều nước, suy nghĩ tới 4,5 giây.'}];

/* ===== LUẬT CỜ & ĐỘNG CƠ ===== */
var U={p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'},V={p:100,n:320,b:330,r:500,q:900,k:0};
var N8=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
var K8=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
var BD=K8.filter(function(d){return d[0]&&d[1]}),RD=K8.filter(function(d){return !d[0]||!d[1]});
function isW(c){return c!==''&&c===c.toUpperCase()}
function start(){
 var b='rnbqkbnrpppppppp'.split('').concat(Array(32).fill(''),'PPPPPPPPRNBQKBNR'.split(''));
 return {b:b,t:'w',c:{K:1,Q:1,k:1,q:1},ep:-1,h:0};
}
function att(b,s,w){
 var r=s>>3,c=s&7,y,x,q,i,d,e,pr=w?r+1:r-1,P=w?'P':'p';
 for(d=-1;d<=1;d+=2){if(pr>=0&&pr<8&&c+d>=0&&c+d<8&&b[pr*8+c+d]===P)return true}
 var kn=w?'N':'n',kg=w?'K':'k';
 for(i=0;i<8;i++){y=r+N8[i][0];x=c+N8[i][1];if(y>=0&&y<8&&x>=0&&x<8&&b[y*8+x]===kn)return true;
  y=r+K8[i][0];x=c+K8[i][1];if(y>=0&&y<8&&x>=0&&x<8&&b[y*8+x]===kg)return true}
 var sl=[[BD,w?'B':'b'],[RD,w?'R':'r']],Q=w?'Q':'q';
 for(var k=0;k<2;k++)for(i=0;i<4;i++){d=sl[k][0][i][0];e=sl[k][0][i][1];y=r+d;x=c+e;
  while(y>=0&&y<8&&x>=0&&x<8){q=b[y*8+x];if(q){if(q===sl[k][1]||q===Q)return true;break}y+=d;x+=e}}
 return false;
}
function gen(p,qo){
 var b=p.b,w=p.t==='w',out=[],s,c,r,f,t;
 for(s=0;s<64;s++){c=b[s];if(!c||isW(c)!==w)continue;r=s>>3;f=s&7;t=c.toLowerCase();
  if(t==='p'){
   var dd=w?-1:1,r1=r+dd,pr=r1===(w?0:7);
   var add=function(to,ep){if(pr){out.push({f:s,t:to,pr:'q'});out.push({f:s,t:to,pr:'n'})}else out.push({f:s,t:to,ep:ep})};
   if(!qo&&!b[r1*8+f]){add(r1*8+f);if(r===(w?6:1)&&!b[(r1+dd)*8+f])out.push({f:s,t:(r1+dd)*8+f})}
   for(var dc=-1;dc<=1;dc+=2){var xx=f+dc;if(xx<0||xx>7)continue;var to=r1*8+xx,q=b[to];
    if(q&&isW(q)!==w)add(to);else if(to===p.ep)add(to,true)}
  }else if(t==='n'||t==='k'){
   var L=t==='n'?N8:K8;
   for(var i=0;i<8;i++){var y=r+L[i][0],x=f+L[i][1];if(y<0||y>7||x<0||x>7)continue;var q2=b[y*8+x];
    if(q2&&isW(q2)===w)continue;if(qo&&!q2)continue;out.push({f:s,t:y*8+x})}
   if(t==='k'&&!qo){var h=w?60:4,R=w?'R':'r';
    if(s===h&&!att(b,s,!w)){
     if((w?p.c.K:p.c.k)&&!b[h+1]&&!b[h+2]&&b[h+3]===R&&!att(b,h+1,!w)&&!att(b,h+2,!w))out.push({f:s,t:h+2,cs:1});
     if((w?p.c.Q:p.c.q)&&!b[h-1]&&!b[h-2]&&!b[h-3]&&b[h-4]===R&&!att(b,h-1,!w)&&!att(b,h-2,!w))out.push({f:s,t:h-2,cs:1});
    }}
  }else{
   var D=t==='b'?BD:(t==='r'?RD:K8);
   for(var j=0;j<D.length;j++){var y2=r+D[j][0],x2=f+D[j][1];
    while(y2>=0&&y2<8&&x2>=0&&x2<8){var q3=b[y2*8+x2];
     if(q3){if(isW(q3)!==w)out.push({f:s,t:y2*8+x2});break}
     if(!qo)out.push({f:s,t:y2*8+x2});y2+=D[j][0];x2+=D[j][1]}}
  }
 }
 return out;
}
function play(p,m){
 var b=p.b.slice(),c=b[m.f],w=isW(c),cr={K:p.c.K,Q:p.c.Q,k:p.c.k,q:p.c.q},ep=-1,cap=b[m.t]!=='';
 b[m.t]=m.pr?(w?m.pr.toUpperCase():m.pr):c;b[m.f]='';
 if(m.ep){b[m.t+(w?8:-8)]='';cap=true}
 if(m.cs){if(m.t>m.f){b[m.f+1]=b[m.f+3];b[m.f+3]=''}else{b[m.f-1]=b[m.f-4];b[m.f-4]=''}}
 var pw=c.toLowerCase()==='p';
 if(pw&&Math.abs(m.t-m.f)===16)ep=(m.t+m.f)/2;
 if(c==='K'){cr.K=cr.Q=0}if(c==='k'){cr.k=cr.q=0}
 [m.f,m.t].forEach(function(s){if(s===63)cr.K=0;if(s===56)cr.Q=0;if(s===7)cr.k=0;if(s===0)cr.q=0});
 return {b:b,t:w?'b':'w',c:cr,ep:ep,h:(pw||cap)?0:p.h+1};
}
function inCk(p){var w=p.t==='w';return att(p.b,p.b.indexOf(w?'K':'k'),!w)}
function legal(p,qo){
 var w=p.t==='w',k=w?'K':'k';
 return gen(p,qo).filter(function(m){var n=play(p,m);return !att(n.b,n.b.indexOf(k),!w)});
}
var CEN=[];for(var s0=0;s0<64;s0++)CEN.push(-(Math.abs((s0>>3)-3.5)+Math.abs((s0&7)-3.5)));
function ev(p){
 var sc=0;
 for(var s=0;s<64;s++){var c=p.b[s];if(!c)continue;var w=isW(c),t=c.toLowerCase(),r=s>>3,v=V[t];
  if(t==='n'||t==='b')v+=CEN[s]*6;
  else if(t==='q')v+=CEN[s]*1.5;
  else if(t==='p')v+=(w?6-r:r-1)*8+CEN[s]*2;
  else if(t==='k')v+=(w?r-7:-r)*8;
  sc+=w?v:-v}
 return p.t==='w'?sc:-sc;
}
var DL=0,nodes=0;
function ord(p,ms){
 return ms.map(function(m){var c=p.b[m.t];m.o=(c?1000+10*V[c.toLowerCase()]-V[p.b[m.f].toLowerCase()]/10:0)+(m.pr==='q'?800:0);return m})
  .sort(function(a,b){return b.o-a.o});
}
function qs(p,a,bt,d){
 var st=ev(p);if(st>=bt)return st;if(st>a)a=st;if(d<=0)return st;
 var ms=ord(p,legal(p,1));
 for(var i=0;i<ms.length;i++){var s=-qs(play(p,ms[i]),-bt,-a,d-1);if(s>=bt)return s;if(s>a)a=s}
 return a;
}
function sr(p,d,a,bt,pl,Q){
 if((++nodes&1023)===0&&Date.now()>DL)throw 0;
 if(p.h>=100)return 0;
 var ms=legal(p);if(!ms.length)return inCk(p)?-30000+pl:0;
 if(d<=0)return Q?qs(p,a,bt,6):ev(p);
 ms=ord(p,ms);
 for(var i=0;i<ms.length;i++){var s=-sr(play(p,ms[i]),d-1,-bt,-a,pl+1,Q);if(s>=bt)return s;if(s>a)a=s}
 return a;
}
function R(a){return a[Math.random()*a.length|0]}
function pick(p,L){
 var ms=legal(p);if(!ms.length)return null;
 if(L===1){var cs=ms.filter(function(m){return p.b[m.t]});return R(cs.length&&Math.random()<.5?cs:ms)}
 var cfg=[0,0,{d:1,n:60},{d:2,n:20},{d:3,q:1,n:5},{d:4,q:1,T:2200},{d:12,q:1,T:4500}][L];
 DL=Date.now()+(cfg.T||1500);nodes=0;
 var best=ms[0];
 for(var d=1;d<=cfg.d;d++){
  try{
   var o=ord(p,ms.slice());
   if(d>1)o.unshift.apply(o,o.splice(o.indexOf(best),1));
   var bs=-1e9,bm=null;
   for(var i=0;i<o.length;i++){
    var s=-sr(play(p,o[i]),d-1,-1e9,-bs,1,cfg.q)+(cfg.n?Math.random()*cfg.n:0);
    if(s>bs){bs=s;bm=o[i]}}
   best=bm;if(bs>29000)break;
  }catch(e){break}
 }
 return best;
}
function insuf(p){
 var n=0;for(var i=0;i<64;i++){var c=p.b[i];if(c&&c.toLowerCase()!=='k'){var t=c.toLowerCase();if(t==='p'||t==='r'||t==='q')return false;n++}}
 return n<=1;
}
window.__chess={start:start,legal:legal,play:play,pick:pick};
window.chessBack=function(){
 if(scr==='game'){
  if(!over&&stk.length&&!confirm('Rời khỏi ván cờ đang chơi? Ván này sẽ bị hủy.'))return true;
  if(mode==='f')A.levels();else menu();
  return true;
 }
 if(scr==='levels'){menu();return true;}
 return false;
};

/* ===== GIAO DIỆN ===== */
var mode='f',lvl=1,pos,stk,sel,hl,last,over,busy,scr='menu';
var A={};
root.addEventListener('click',function(e){var t=e.target.closest('[data-a]');if(t&&A[t.dataset.a])A[t.dataset.a](t.dataset)});
function stars(l){return S.win[l]?'<span class="ch-star">★ Đã thắng</span>':''}
function menu(){scr='menu';
 busy=false;over=null;
 root.innerHTML='<h1 data-a="menu">♟️ Cờ vua</h1><p class="ch-sub">Bạn cầm quân trắng, đi trước. Chọn cách chơi:</p>'+
 '<button class="ch-btn main" data-a="camp" data-n="1">🏆 Chiến dịch<small>Thắng 6 trận liên tiếp từ dễ đến khó. Thua thì chơi lại hoặc thoát.</small></button>'+
 (S.camp>1?'<button class="ch-btn" data-a="camp" data-n="'+S.camp+'">▶ Tiếp tục chiến dịch từ cấp '+S.camp+'</button>':'')+
 '<button class="ch-btn" data-a="levels">🎯 Chọn cấp độ thử thách<small>Tự chọn đối thủ từ cấp 1 đến cấp 6.</small></button>'+
 '<p class="ch-sub">Mỗi lần thắng bạn được cộng 1 điểm ⭐ vào app.</p>';
}
A.menu=menu;
A.levels=function(){scr='levels';busy=false;
 root.innerHTML='<h1 data-a="menu">🎯 Chọn cấp độ</h1><p class="ch-sub">Cấp càng cao, máy càng suy nghĩ sâu.</p>'+
 LV.slice(1).map(function(l,i){return '<button class="ch-btn" data-a="free" data-n="'+(i+1)+'"><span class="ch-lv"><span>'+l.n+'</span>'+stars(i+1)+'</span><small>'+l.d+'</small></button>'}).join('')+
 '<button class="ch-btn sm" data-a="menu">← Quay lại</button>';
};
function begin(m,l){scr='game';mode=m;lvl=l;pos=start();stk=[];sel=null;hl=[];last=null;over=null;busy=false;draw()}
A.camp=function(d){begin('c',+d.n)};
A.free=function(d){begin('f',+d.n)};
A.again=function(){begin(mode,lvl)};
A.next=function(){begin('c',lvl+1)};
A.resign=function(){if(!over&&!busy&&confirm('Bạn muốn đầu hàng ván này?')){over={w:'b',txt:'Bạn đã đầu hàng'};try{if(window.sfx)window.sfx('bad')}catch(e){}draw()}};
A.undo=function(){if(busy||over||mode!=='f'||!stk.length)return;pos=stk.pop();sel=null;hl=[];last=null;draw()};
function status(){
 if(over){
  if(over.w)return (over.w==='w'?'🎉 Bạn thắng!':'😔 Bạn thua')+(over.txt?' · '+over.txt:'');
  return '🤝 '+over.txt;
 }
 if(busy)return '🤔 Máy đang suy nghĩ...';
 return inCk(pos)?'⚠️ Bạn đang bị chiếu!':'Đến lượt bạn (quân trắng)';
}
function draw(){
 var ck=!over&&inCk(pos)?pos.b.indexOf(pos.t==='w'?'K':'k'):-1,h='';
 for(var s=0;s<64;s++){var c=pos.b[s],dk=((s>>3)+(s&7))&1;
  h+='<div class="ch-s '+(dk?'d':'l')+(sel===s?' sel':'')+(ck===s?' ck':'')+(last&&(last[0]===s||last[1]===s)?' lm':'')+(hl.indexOf(s)>-1?(c?' cp':' mv'):'')+'" data-a="sq" data-s="'+s+'">'+
   (c?'<span class="'+(isW(c)?'pw':'pb')+'">'+U[c.toLowerCase()]+'\uFE0E</span>':'')+'</div>'}
 var res='';
 if(over){
  var win=over.w==='w',b='';
  if(mode==='c'){
   if(win&&lvl<6)b='<button class="ch-btn main" data-a="next">Trận kế tiếp: '+LV[lvl+1].n+' ▶</button>';
   else if(win)b='<button class="ch-btn main" data-a="menu">🏆 Phá đảo chiến dịch! Về menu</button>';
   else b='<button class="ch-btn main" data-a="again">↻ Chơi lại trận này</button><button class="ch-btn" data-a="menu">Thoát</button>';
  }else b='<button class="ch-btn main" data-a="again">↻ Chơi lại</button><button class="ch-btn" data-a="levels">Chọn cấp khác</button><button class="ch-btn" data-a="menu">Menu</button>';
  res='<div class="ch-res"><b>'+(win?'Chiến thắng!':over.w?'Bạn đã thua':'Hòa')+'</b>'+b+'</div>';
 }
 root.innerHTML='<h1 data-a="menu">♟️ '+(mode==='c'?'Chiến dịch · Trận '+lvl+'/6':'Thử thách')+'</h1><p class="ch-sub" style="margin-bottom:4px">'+LV[lvl].n+'</p>'+
  '<div class="ch-st">'+status()+'</div><div class="ch-b">'+h+'</div>'+res+
  (over?'':'<div class="ch-bar">'+(mode==='f'?'<button class="ch-btn sm" data-a="undo">↩ Đi lại</button>':'')+'<button class="ch-btn sm" data-a="resign">🏳️ Đầu hàng</button></div>');
}
function check(){
 var ms=legal(pos);
 if(!ms.length)over={w:pos.t==='w'?'b':'w',txt:inCk(pos)?'':(pos.t==='w'?'Bạn hết nước đi':'Máy hết nước đi')};
 else if(pos.h>=100)over={txt:'Hòa (luật 50 nước)'};
 else if(insuf(pos))over={txt:'Hòa (không đủ quân chiếu hết)'};
 if(over){try{if(window.sfx)window.sfx(over.w==='w'?'win':'bad')}catch(e){}}
 if(over&&over.w==='w'){
  S.win[lvl]=1;if(mode==='c'&&lvl>=S.camp)S.camp=Math.min(6,lvl+1);sv();
  try{addStar()}catch(e){}
 }
}
function move(m){
 stk.push(pos);pos=play(pos,m);last=[m.f,m.t];sel=null;hl=[];check();
 if(!over&&pos.t==='b'){busy=true;draw();setTimeout(ai,60)}else draw();
}
function ai(){
 if(!busy)return;var m=pick(pos,lvl);busy=false;
 if(m){stk.push(pos);pos=play(pos,m);last=[m.f,m.t];check()}
 draw();
}
A.sq=function(d){
 if(busy||over)return;var s=+d.s,c=pos.b[s];
 if(sel!==null){
  var ms=legal(pos).filter(function(m){return m.f===sel&&m.t===s&&(!m.pr||m.pr==='q')});
  if(ms.length){move(ms[0]);return}
 }
 if(c&&isW(c)){sel=s;hl=legal(pos).filter(function(m){return m.f===s}).map(function(m){return m.t})}
 else{sel=null;hl=[]}
 draw();
};
menu();
})();
