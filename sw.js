const CACHE_NAME = 'alnasiru-aims-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/api.js',
  '/app.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Enable navigation preload for faster page loads
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Enable navigation preload if available
      'navigationPreload' in self.registration && self.registration.navigationPreload.enable()
    ])
  );
});

// Install service worker and cache all assets immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Network-first strategy for fresh content, falling back to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        const responseToCache = response.clone();

        // Cache the new response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If network fails, try to get it from cache
        return caches.match(event.request);
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
