// Service worker mínimo para que la app cumpla los requisitos de PWA y
// pueda ser "agregada a la pantalla de inicio" en iOS y Android.
//
// Estrategia: "network-first" — siempre intenta traer la última versión
// desde la red; si la red falla, sirve lo cacheado. Así el equipo de
// Juan siempre ve lo más reciente y sólo cae al cache cuando hay un
// hueco de conectividad. No se cachean archivos privados (Supabase),
// solo los HTML/JS/CSS estáticos del bundle.

const CACHE = 'mape-antonia-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // No interceptar peticiones a Supabase ni a APIs externas.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Cachear sólo respuestas 200 OK de tipo basic.
        if (res && res.ok && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req)),
  );
});
