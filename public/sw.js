// Version update to force refresh
const CACHE_NAME = 'moms-fridge-v4';

// Initial core assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
  // Activate new SW immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  // NOTE: Removed clients.claim() to prevent "White Screen" on first load.
  // The SW will take control on the next page reload, ensuring the first load
  // completes without interruption.

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old cache versions
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Network First for HTML, Cache First (with Dynamic Caching) for Assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Navigation requests (HTML pages) -> Network First
  // Ensures user gets the latest index.html (which points to new JS hashes)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache with new version
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // If offline, fall back to cache
          return caches.match(request);
        })
    );
    return;
  }

  // 2. Asset requests (JS, CSS, Images, etc.) -> Cache First, then Network & Cache
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request).then((networkResponse) => {
          // Check if valid response (basic or cors for CDNs)
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }

          // Clone response to save to cache
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            // Dynamic Caching: Save fetched asset for next time
            cache.put(request, responseToCache);
          });

          return networkResponse;
        });
      })
  );
});