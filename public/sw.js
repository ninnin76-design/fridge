// Version update - Change this when you deploy a new version to force update
const CACHE_NAME = 'moms-fridge-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
  // Force this new service worker to become the active one, bypassing the waiting state
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(clients.claim());

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

// Fetch: Network First for HTML, Cache First for others
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Navigation requests (HTML pages) -> Network First
  // This ensures the user always gets the latest index.html with correct JS paths
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

  // 2. Asset requests (JS, CSS, Images) -> Cache First
  // Stale-While-Revalidate strategy could also be used, but Cache First is safer for hashed assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request);
      })
  );
});