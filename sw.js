/* Service worker — makes the guide installable and usable offline.
 *
 * Strategy: NETWORK-FIRST for our own files, so an edit/redeploy is always
 * picked up immediately when online; the cache is only a fallback for offline.
 * (A previous "cache-first" version could keep serving stale CSS/JS — don't do
 * that during active development.) Bump VERSION to force-evict old caches.
 */
const VERSION = "tamsui-v2";
const CORE = [
  "./", "index.html", "manifest.webmanifest",
  "css/styles.css",
  "js/i18n.js", "js/predict.js", "js/render.js", "js/map.js", "js/app.js",
  "data/strings.js", "data/places.js", "data/routes.js",
  "data/events.js", "data/food.js", "data/crowd_model.js",
  "assets/icons/icon.svg", "assets/icons/icon-192.png", "assets/icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); })); })
      .then(function () { return self.skipWaiting(); })   // activate the new SW asap
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf(VERSION) !== 0; })
        .map(function (k) { return caches.delete(k); }));   // drop old (stale) caches
    }).then(function () { return self.clients.claim(); })    // take over open tabs
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  // Network-first for everything: fresh when online, cached when offline.
  e.respondWith(
    fetch(req).then(function (res) {
      // Cache same-origin successful responses for offline use.
      if (res && res.ok && new URL(req.url).origin === location.origin) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || (req.mode === "navigate" ? caches.match("index.html") : undefined);
      });
    })
  );
});
