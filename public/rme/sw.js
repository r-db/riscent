/* RME Innovations — simple offline-first service worker */
const CACHE = "rme-v4";
const ASSETS = [
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./img/hero-rooftop.jpg",
  "./img/home-dusk.jpg",
  "./img/valley-day.jpg"
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
        }).catch(() => caches.match("./index.html"))
    )
  );
});
