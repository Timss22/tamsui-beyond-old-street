/* =============================================================================
 * map.js — the interactive "crowd radar" (Leaflet + OpenStreetMap/CARTO).
 * Pins are coloured by the model's predicted busyness for the selected time;
 * the category filter, "skip the crowds" toggle and route overlay all live here.
 * ========================================================================== */
(function () {
  "use strict";

  var MapView = {
    map: null,
    markers: {},          // id -> { marker, place }
    timeCtx: null,
    filter: "all",
    skip: false,
    routeLayer: null,
    activeRoute: null,

    init: function () {
      var el = document.getElementById("map");
      if (!el) return;
      if (typeof L === "undefined" || typeof L.map !== "function") {
        // Leaflet/tiles need a network connection — show a friendly note instead.
        el.classList.add("map-offline");
        el.textContent = window.t("map.offline");
        return;
      }
      this.timeCtx = window.Predict.nowContext();

      this.map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19, subdomains: "abcd"
      }).addTo(this.map);
      // Click the map background to clear a drawn route.
      this.map.on("click", function () { MapView.clearRoute(); });

      var pts = [];
      var self = this;
      window.PLACES.forEach(function (p) {
        var m = L.circleMarker([p.lat, p.lng], self.markerStyle(p, 0));
        m.bindPopup(function () { return self.popupHTML(p); }, { maxWidth: 260 });
        m.on("click", function () { self.clearRoute(); });
        self.markers[p.id] = { marker: m, place: p };
        pts.push([p.lat, p.lng]);
      });
      this.map.fitBounds(pts, { padding: [40, 40] });
      this.refresh();
      // Recalculate size in case the container settled after first paint.
      setTimeout(function () { self.map.invalidateSize(); }, 250);

      document.addEventListener("langchange", function () { self.refreshOpenPopup(); });
    },

    markerStyle: function (p, score) {
      var big = p.hotspot || p.featured;
      return {
        radius: p.featured ? 12 : (p.hotspot ? 11 : 8),
        weight: p.featured ? 3 : 2,
        color: p.featured ? "#7b3fb0" : "#ffffff",
        fillColor: window.Predict.crowdColor(score),
        fillOpacity: 0.92,
        className: big ? "mk-big" : ""
      };
    },

    popupHTML: function (p) {
      var score = window.Predict.predictCrowd(p, this.timeCtx);
      var bucket = window.Predict.crowdBucket(score);
      var emoji = window.Render.categoryEmoji[p.category] || "📍";
      var areaKey = p.area === "bali" ? "common.area_bali" : "common.area_tamsui";
      return '<div class="pop">' +
        '<h4>' + emoji + " " + window.Render.esc(window.tr(p.name)) + "</h4>" +
        '<div class="pop-meta">' + window.t(areaKey) +
          ' · <span style="color:' + window.Predict.crowdColor(score) + '">●</span> ' +
          window.t("crowd." + bucket) + " (" + Math.round(score) + "/100)</div>" +
        '<p>' + window.Render.esc(window.tr(p.blurb)) + "</p>" +
        (p.hours ? '<p class="pop-hours">🕘 ' + window.Render.esc(p.hours) + "</p>" : "") +
        '<div class="pop-note">' + window.t("ml.estimate") + "</div></div>";
    },

    matchesFilter: function (p) {
      if (this.skip && (p.hotspot || window.Predict.crowdBucket(window.Predict.predictCrowd(p, this.timeCtx)) === "high")) return false;
      if (this.filter === "all") return true;
      return p.category === this.filter;
    },

    refresh: function () {
      var self = this;
      Object.keys(this.markers).forEach(function (id) {
        var entry = self.markers[id], p = entry.place, m = entry.marker;
        if (self.matchesFilter(p)) {
          var score = window.Predict.predictCrowd(p, self.timeCtx);
          m.setStyle({ fillColor: window.Predict.crowdColor(score) });
          if (!self.map.hasLayer(m)) m.addTo(self.map);
        } else if (self.map.hasLayer(m)) {
          self.map.removeLayer(m);
        }
      });
    },

    refreshOpenPopup: function () {
      Object.keys(this.markers).forEach(function (id) {
        var m = MapView.markers[id].marker;
        if (m.isPopupOpen && m.isPopupOpen()) m.setPopupContent(MapView.popupHTML(MapView.markers[id].place));
      });
    },

    setTime: function (ctx) { this.timeCtx = ctx; this.refresh(); this.refreshOpenPopup(); },
    setFilter: function (cat) { this.filter = cat; this.refresh(); },
    setSkip: function (on) { this.skip = on; this.refresh(); },

    showRoute: function (routeId) {
      if (this.activeRoute === routeId) { this.clearRoute(); return; }
      this.clearRoute();
      var route = window.ROUTES.find(function (r) { return r.id === routeId; });
      if (!route) return;
      var self = this, latlngs = [], group = L.layerGroup();
      route.stops.forEach(function (id, i) {
        var p = window.PLACES.find(function (x) { return x.id === id; });
        if (!p) return;
        latlngs.push([p.lat, p.lng]);
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({ className: "route-pin", html: "<span>" + (i + 1) + "</span>", iconSize: [26, 26] })
        }).bindPopup(window.Render.esc(window.tr(p.name))).addTo(group);
      });
      L.polyline(latlngs, { color: "#e8553e", weight: 4, opacity: 0.85, dashArray: "2 8" }).addTo(group);
      group.addTo(this.map);
      this.routeLayer = group;
      this.activeRoute = routeId;
      this.map.fitBounds(latlngs, { padding: [60, 60] });
      document.getElementById("map-section").scrollIntoView({ behavior: "smooth", block: "start" });
      // reflect active state on the route buttons
      document.querySelectorAll(".route-show").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-route") === routeId);
        b.textContent = b.getAttribute("data-route") === routeId ? window.t("routes.hide") : window.t("routes.show");
      });
    },

    clearRoute: function () {
      if (this.routeLayer) { this.map.removeLayer(this.routeLayer); this.routeLayer = null; }
      this.activeRoute = null;
      document.querySelectorAll(".route-show").forEach(function (b) {
        b.classList.remove("active"); b.textContent = window.t("routes.show");
      });
    },

    focus: function (id) {
      var entry = this.markers[id];
      if (!entry) return;
      this.skip = false;                       // make sure it's visible
      var skipToggle = document.getElementById("skip-toggle");
      if (skipToggle) skipToggle.checked = false;
      this.filter = "all";
      this.refresh();
      this.map.setView([entry.place.lat, entry.place.lng], 16, { animate: true });
      entry.marker.openPopup();
    }
  };

  window.MapView = MapView;
})();
