const CACHE_NAME = 'alnasiru-aims-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/api.js',
  '/app.js',
  '/icon-192.png',
  '/icon-512.png'
];

// Install service worker and cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
