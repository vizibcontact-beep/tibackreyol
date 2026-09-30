// Ti Bac Kréyol — service worker : ouverture rapide et jeu solo hors connexion
const VERSION='tibac-v13';
const SHELL=[
 "./",
 "index.html",
 "style.css",
 "app.js",
 "data.js",
 "config.js",
 "vendor/supabase.js",
 "manifest.webmanifest",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "avatars/bwabwa.jpg",
 "avatars/chouval.jpg",
 "avatars/diabrouj.jpg",
 "avatars/djables.jpg",
 "avatars/lapen.jpg",
 "avatars/lapofig.jpg",
 "avatars/manibe.jpg",
 "avatars/manmandlo.jpg",
 "avatars/maskilili.jpg",
 "avatars/mokozonbi.jpg",
 "avatars/mounmo.jpg",
 "avatars/soukougnan.jpg",
 "avatars/tig.jpg",
 "avatars/tijan.jpg",
 "avatars/touloulou.jpg",
 "avatars/vaval.jpg",
 "avatars/zamba.jpg",
 "avatars/zonbi.jpg"
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin)return; // Supabase et polices : toujours en direct
  const fresh=req.mode==='navigate'||/\.(js|css|webmanifest)$/.test(url.pathname);
  if(fresh){ // réseau d'abord, copie locale si hors connexion
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));return r;}).catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))));
  }else{ // images : copie locale d'abord
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(req,cp));return res;})));
  }
});

// Notifications : défi du jour, invitations, demandes d'amis
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{};}catch(err){d={body:e.data&&e.data.text()};}
  e.waitUntil(self.registration.showNotification(d.title||'Ti Bac Kréyol',{
    body:d.body||'',tag:d.tag||'tibac',renotify:true,icon:'icons/icon-192.png',badge:'icons/icon-192.png',data:{url:d.url||'./'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
    for(const w of ws){if(w.url.startsWith(self.registration.scope)&&'focus' in w){return w.navigate(url).then(x=>(x||w).focus()).catch(()=>w.focus());}}
    return clients.openWindow(url);
  }));
});
