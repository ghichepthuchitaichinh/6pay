// Service Worker cho 6PAY — cho phép app hoạt động khi offline
// và được trình duyệt nhận diện là "có thể cài đặt" (PWA).
const CACHE_NAME='6pay-cache-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-1024.png'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).catch(()=>{}));
 self.skipWaiting();
});

self.addEventListener('activate',e=>{
 e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
 );
 self.clients.claim();
});

self.addEventListener('fetch',e=>{
 // Luôn ưu tiên lấy bản mới nhất từ mạng; nếu mất mạng thì dùng bản đã lưu cache.
 e.respondWith(
  fetch(e.request).then(res=>{
   const copy=res.clone();
   caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{});
   return res;
  }).catch(()=>caches.match(e.request))
 );
});
