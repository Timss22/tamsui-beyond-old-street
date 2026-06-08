/* Service worker — makes the guide installable and usable offline after the
 * first visit. Paths are relative so it works under a GitHub Pages subpath. */
const VERSION = "tamsui-v1";
const CORE = [
  "./", "index.html", "manifest.webmanifest",
  "css/styles.css",
  "js/i18n.js", "js/predict.js", "js/render.js", "js/map.js", "js/app.js",
  "data/strings.js", "data/places.js", "data/routes.js",
  "data/events.js", "data/food.js", "data/crowd_model.js",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION)
      // Cache each item individually so one missing file can't break install.
      .then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); })); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf(VERSION) !== 0; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var sameOrigin = new URL(req.url).origin === location.origin;

  if (sameOrigin) {
    // App shell + data: cache-first, fall back to network, then to index.html.
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return caches.match("index.html"); });
      })
    );
  } else {
    // CDNs / map tiles / fonts: network-first, fall back to runtime cache.
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION + "-cdn").then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
  }
});
