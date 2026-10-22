/* Mivyx Hub service worker: pages + song list always come fresh from GitHub, everything else is cached for offline */
const CACHE='mivyx-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const keep=(r,res)=>{if(res&&res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const fresh=r.mode==='navigate'||u.pathname.endsWith('/')||/\.(html|json)$/.test(u.pathname);
 e.respondWith(fresh
  ?fetch(r,{cache:'no-cache'}).then(res=>keep(r,res)).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  :caches.match(r).then(m=>m||fetch(r).then(res=>keep(r,res))))});
