// Sube el número cuando cambies algo para que los móviles cojan la versión nueva.
const CACHE = "paris-2026-v3";
const TILES = "paris-tiles-v1";
const MAX_TILES = 1500;
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png",
  "./vendor/leaflet.js", "./vendor/leaflet.css",
  "./data.js", "./scenes.js", "./app.js",
  "./vendor/fonts/barlow-latin-400-normal.woff2", "./vendor/fonts/barlow-latin-500-normal.woff2",
  "./vendor/fonts/barlow-latin-600-normal.woff2", "./vendor/fonts/barlow-latin-700-normal.woff2",
  "./vendor/fonts/barlow-condensed-latin-500-normal.woff2", "./vendor/fonts/barlow-condensed-latin-600-normal.woff2",
  "./vendor/fonts/barlow-condensed-latin-700-normal.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trimTiles(cache){
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Teselas del mapa: se guardan las que se ven para poder usarlas sin conexión.
  if (url.hostname === "tile.openstreetmap.org"){
    e.respondWith(caches.open(TILES).then(async cache => {
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok || res.type === "opaque"){ cache.put(req, res.clone()); trimTiles(cache); }
        return res;
      } catch { return new Response("", { status: 504 }); }
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // La app: primero la caché (funciona sin conexión) y se actualiza en segundo plano.
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      return hit || (await net) || cache.match("./index.html");
    })
  );
});
