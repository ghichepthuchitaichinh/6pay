// Service Worker cho 6PAY — chạy offline, luôn ưu tiên bản mới nhất từ mạng.
// Mỗi lần thay đổi danh sách ASSETS hoặc logic, hãy đổi số phiên bản CACHE_NAME.
const CACHE_NAME='6pay-cache-v9';
const FONT_CACHE='6pay-fonts-v1';
const ASSETS=['./','./index.html','./manifest.json','./version.json',
 './runner.js','./words.js','./chinese.js','./math.js','./history.js','./vietnam.js','./chess.js','./clock.js','./farm.js',
 './icon-192.png','./icon-512.png','./icon-1024.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon-32.png'];

self.addEventListener('install',e=>{
 e.waitUntil(
  caches.open(CACHE_NAME).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{}))))
 );
 self.skipWaiting();
});

self.addEventListener('activate',e=>{
 e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME&&k!==FONT_CACHE).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);

 // Phông chữ Google: dùng bản đã lưu trước, tải nền để cập nhật
 if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
  e.respondWith(
   caches.open(FONT_CACHE).then(c=>c.match(req).then(hit=>{
    const net=fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(req,res.clone());return res;}).catch(()=>hit);
    return hit||net;
   }))
  );
  return;
 }

 // Yêu cầu tới trang khác (GitHub raw, CDN...) hoặc yêu cầu kiểm tra bản mới (?v=): để trình duyệt tự xử lý, không lưu vào cache
 if(url.origin!==location.origin)return;
 if(url.searchParams.has('v'))return;

 // Tệp của app: ưu tiên mạng (bỏ qua bộ nhớ đệm trình duyệt); mất mạng thì dùng bản đã lưu
 e.respondWith(
  fetch(req,{cache:'no-cache'}).then(res=>{
   if(res&&res.status===200&&res.type==='basic'){
    const copy=res.clone();
    caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});
   }
   return res;
  }).catch(()=>caches.match(req,{ignoreSearch:true}).then(hit=>hit||(req.mode==='navigate'?caches.match('./index.html'):undefined)))
 );
});
