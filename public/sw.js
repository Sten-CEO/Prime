// Service Worker minimal juste pour activer la PWA

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// On laisse passer les requêtes sans gestion de cache compliquée
self.addEventListener("fetch", () => {});
