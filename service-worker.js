// Service Worker for SoccerInABox PWA
const CACHE_STATIC = 'static-v1';
const CACHE_DATA = 'data-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/logistics.js',
  '/js/field.js',
  '/js/storage.js',
  '/manifest.json',
  '/assets/ration_test.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_STATIC && key !== CACHE_DATA)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for static assets
  if (ASSETS_TO_CACHE.includes(request.url) ||
      request.url.startsWith(self.location.origin + '/css/') ||
      request.url.startsWith(self.location.origin + '/js/') ||
      request.url.endsWith('.html') ||
      request.url.endsWith('.json') &&
      !request.url.includes('/api/')) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
    return;
  }

  // Network-first for API calls (if any) with cache fallback
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone response to put in cache
          const copy = response.clone();
          caches.open(CACHE_DATA).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});