// Service Worker for Post-Code Engineering
// Provides offline access to the site after first visit.
//
// Caching strategy:
// - HTML: network-first, fallback to cache (so updates are seen)
// - CSS/JS/SVG/JPG/PNG: cache-first (rarely change, important for offline)
// - Everything else: network-only
//
// Version: bump CACHE_NAME to invalidate all clients on deploy.

const CACHE_NAME = 'pce-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/site.webmanifest',
  '/opensearch.xml',
  '/humans.txt',
  '/assets/main.css',
  '/assets/css/style.css',
  '/assets/images/og-default.png',
  '/assets/images/og/cold-start.jpg',
  '/assets/images/og/loop-engineering.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Best-effort precache; ignore individual failures
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((e) => console.warn('[SW] precache skip', url, e))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML: network-first
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Static assets: cache-first
  if (/\.(css|js|svg|jpg|jpeg|png|gif|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }
});
