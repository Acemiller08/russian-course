const CACHE = 'russian-course-2f7fbf13a3';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "favicon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin || /version\.json/.test(req.url)) return;
  const isPage = req.mode === 'navigate';
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(isPage ? 'index.html' : req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r.ok) c.put(isPage ? 'index.html' : req, r.clone()); return r; }).catch(() => null);
    return isPage ? (await Promise.race([net, new Promise(r => setTimeout(() => r(null), 2500))])) || hit || net : hit || net;
  }));
});
