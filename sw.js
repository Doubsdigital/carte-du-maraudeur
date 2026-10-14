// Réseau d'abord (toujours la dernière version), cache seulement hors ligne.
const C='maraudeur-v20';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).then(r=>c.put(f,r))))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(
    fetch(e.request,same?{cache:'no-cache'}:{}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}
      return res;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}))
  );
});
