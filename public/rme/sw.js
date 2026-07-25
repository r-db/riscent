/* RME Innovations — simple offline-first service worker */
const CACHE = "rme-v6";
const ASSETS = [
  "/rme/index.html",
  "/rme/css/styles.css",
  "/rme/js/app.js",
  "/rme/manifest.webmanifest",
  "/rme/icons/icon.svg",
  "/rme/img/hero-rooftop.jpg",
  "/rme/img/home-dusk.jpg",
  "/rme/img/valley-day.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          const copy = res.clone();
          if (res.ok && e.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        }).catch(() => caches.match("/rme/index.html"))
    )
  );
});
