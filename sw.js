// Service Worker cho 6PAY — chạy offline, luôn ưu tiên bản mới nhất từ mạng.
const CACHE_NAME='6pay-cache-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
 e.waitUntil(Promise.all(ASSETS.map(a=>caches.open(CACHE_NAME).then(c=>c.add(a).catch(()=>{})))));
 self.skipWaiting();
});

self.addEventListener('activate',e=>{
 e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
 );
 self.clients.claim();
});

self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 // Ưu tiên mạng (bỏ qua bộ nhớ đệm trình duyệt); mất mạng thì dùng bản đã lưu.
 e.respondWith(
  fetch(e.request,{cache:'no-cache'}).then(res=>{
   const copy=res.clone();
   caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{});
   return res;
  }).catch(()=>caches.match(e.request))
 );
});
