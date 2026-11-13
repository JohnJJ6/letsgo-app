/* Offline shell. Page: serve the cached copy at once, refresh it in the background (new version on next launch). */
const V = 'app-2a6d4ff32d', CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "vendor/d3.min.js"];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url); if (r.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const key = r.mode === 'navigate' ? 'index.html' : r;
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(key, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) c.put(key, res.clone()); return res });
    if (hit) { if (r.mode === 'navigate') e.waitUntil(net.catch(() => { })); return hit }
    return net;
  }));
});
