// Service Worker minimal pour activer l'installation PWA
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// On laisse la requête passer sans cache spécial (c'est suffisant pour install)
self.addEventListener("fetch", () => {});
