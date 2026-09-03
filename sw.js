// Minimal service worker -- its only real job is to exist with a genuine
// (non-empty) fetch handler, which is what Chrome on Android checks for
// before offering a proper "Install app" experience with its own icon and
// app-drawer entry, rather than just a plain bookmark shortcut. This
// intentionally doesn't try to cache your actual app (that content lives
// behind Google's login wall anyway, cross-origin, and isn't something a
// service worker sitting on GitHub Pages could usefully cache).

const CACHE_NAME = 'chevairi-shell-v1';

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // A real (if simple) network-first pass-through -- a literally empty
  // handler is deliberately ignored by Chrome's installability check, so
  // this needs to actually do something, even if that something is just
  // "fetch it normally, and fall back to any matching cached copy if the
  // network request fails."
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
