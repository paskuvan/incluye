// Service worker de Incluye — instalabilidad (PWA) + offline básico.
// Estrategia: network-first para navegación (nunca servir HTML viejo si hay red),
// con fallback a caché cuando no hay conexión. Assets estáticos: cache-first.
const CACHE = "incluye-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return; // no interceptar POST ni orígenes externos (Supabase, etc.)
  }

  // Navegación (páginas): red primero, caché si falla.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match(OFFLINE_URL))),
    );
    return;
  }

  // Assets estáticos (_next, imágenes, íconos): caché primero, red de respaldo.
  if (/\/_next\/|\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/.test(request.url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
  }
});
