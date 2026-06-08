/* =============================================================================
 * app.js — wires the whole page together: language switcher, nav, bridge
 * countdown, the "Where should I go?" recommender, the map time-radar controls,
 * and the PWA service worker.
 * ========================================================================== */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var VIBE_TAGS = {
    nature: ["nature", "quiet", "park"],
    history: ["history", "culture", "art"],
    food: ["food"],
    views: ["views", "sunset", "bridge"]
  };

  var state = {
    recWhen: "now", recVibe: "any", includeBali: true, recRan: false,
    radarMode: "now", radarHour: 14
  };

  /* ---- PWA ------------------------------------------------------------- */
  function registerSW() {
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  /* ---- Bridge countdown ------------------------------------------------ */
  var OPEN_DATE = new Date("2026-05-12T00:00:00");
  function updateCountdown() {
    var el = $("bridge-countdown");
    if (!el) return;
    var days = Math.floor((Date.now() - OPEN_DATE.getTime()) / 86400000);
    var open = days >= 0;
    var label = open ? window.t("bridge.countdown_open") : window.t("bridge.countdown_soon");
    el.innerHTML = label + ' <b class="cd-num">' + Math.abs(days) + "</b> " + window.t("bridge.days");
  }

  /* ---- Hero stats ------------------------------------------------------ */
  function fillStats() {
    if ($("stat-places")) $("stat-places").textContent = window.PLACES.length;
    if ($("stat-routes")) $("stat-routes").textContent = window.ROUTES.length;
    if ($("stat-gems")) {
      $("stat-gems").textContent = window.PLACES.filter(function (p) {
        return !p.hotspot && !p.featured;
      }).length;
    }
  }

  /* ---- Language switcher ----------------------------------------------- */
  function setupLang() {
    var btn = $("lang-btn"), menu = $("lang-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    menu.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        window.I18N.set(b.getAttribute("data-lang"));
        menu.classList.remove("open");
      });
    });
    document.addEventListener("click", function () { menu.classList.remove("open"); });
    updateLangButton();
  }
  function updateLangButton() {
    if ($("lang-current")) $("lang-current").textContent = window.I18N.lang === "zh" ? "繁中" : "EN";
    document.querySelectorAll("#lang-menu [data-lang]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === window.I18N.lang);
    });
  }

  /* ---- Mobile nav ------------------------------------------------------ */
  function setupNav() {
    var toggle = $("nav-toggle"), menu = $("nav-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () { menu.classList.toggle("open"); });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { menu.classList.remove("open"); });
      });
    }
  }

  /* ---- Recommender ----------------------------------------------------- */
  function populateDays() {
    var sel = $("rec-day");
    if (!sel) return;
    var keep = sel.value;
    sel.innerHTML = "";
    for (var d = 0; d < 7; d++) {
      var o = document.createElement("option");
      o.value = d;
      o.textContent = window.t("days." + d);
      sel.appendChild(o);
    }
    sel.value = keep || String((window.Predict.nowContext().dow));
  }

  function setupRecommender() {
    populateDays();
    if ($("rec-hour-val") && $("rec-hour")) $("rec-hour-val").textContent = pad($("rec-hour").value) + ":00";
    if ($("rec-run")) $("rec-run").addEventListener("click", runRecommender);
    document.querySelectorAll("[data-when]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.recWhen = b.getAttribute("data-when");
        setActive("[data-when]", b);
        $("rec-custom-fields").classList.toggle("hidden", state.recWhen !== "custom");
        runRecommender();
      });
    });
    document.querySelectorAll("[data-vibe]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.recVibe = b.getAttribute("data-vibe");
        setActive("[data-vibe]", b);
        runRecommender();
      });
    });
    if ($("rec-bali")) $("rec-bali").addEventListener("change", function () {
      state.includeBali = $("rec-bali").checked; runRecommender();
    });
    if ($("rec-day")) $("rec-day").addEventListener("change", runRecommender);
    if ($("rec-hour")) $("rec-hour").addEventListener("input", function () {
      $("rec-hour-val").textContent = pad($("rec-hour").value) + ":00"; runRecommender();
    });
  }

  function runRecommender() {
    var ctx;
    if (state.recWhen === "now") ctx = window.Predict.nowContext();
    else ctx = {
      dow: parseInt($("rec-day").value, 10),
      hour: parseInt($("rec-hour").value, 10),
      month: window.Predict.nowContext().month, isRain: 0
    };
    var tags = VIBE_TAGS[state.recVibe];
    var rows = window.PLACES
      .filter(function (p) { return !p.hotspot; })
      .filter(function (p) { return state.includeBali || p.area !== "bali"; })
      .map(function (p) {
        var match = !tags || p.vibe.some(function (v) { return tags.indexOf(v) >= 0; });
        return { p: p, crowd: window.Predict.predictCrowd(p, ctx), match: match };
      })
      .filter(function (r) { return r.match; })
      .sort(function (a, b) { return a.crowd - b.crowd; })
      .slice(0, 3);
    window.Render.recommend(rows);
    state.recRan = true;
  }

  /* ---- Map time-radar + filters ---------------------------------------- */
  function setupRadar() {
    document.querySelectorAll("[data-radar]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.radarMode = b.getAttribute("data-radar");
        setActive("[data-radar]", b);
        applyRadar();
      });
    });
    var slider = $("radar-hour");
    if (slider) slider.addEventListener("input", function () {
      state.radarHour = parseInt(slider.value, 10);
      applyRadar();
    });
    applyRadar();
  }
  function applyRadar() {
    if (!window.MapView || !window.MapView.map) return;
    var slider = $("radar-hour"), label = $("radar-label"), ctx, text;
    var now = window.Predict.nowContext();
    if (state.radarMode === "now") {
      ctx = now;
      state.radarHour = now.hour;
      if (slider) { slider.value = now.hour; slider.disabled = true; }
      text = window.t("map.time_now");
    } else {
      var dow = state.radarMode === "weekend" ? 6 : 2;
      ctx = { dow: dow, hour: state.radarHour, month: now.month, isRain: 0 };
      if (slider) slider.disabled = false;
      text = window.t("days." + dow) + " · " + pad(state.radarHour) + ":00";
    }
    if (label) label.textContent = text;
    window.MapView.setTime(ctx);
  }
  function setupFilters() {
    document.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        setActive("[data-cat]", b);
        if (window.MapView) window.MapView.setFilter(b.getAttribute("data-cat"));
      });
    });
    if ($("skip-toggle")) $("skip-toggle").addEventListener("change", function () {
      if (window.MapView) window.MapView.setSkip($("skip-toggle").checked);
    });
  }

  function setActive(selector, btn) {
    document.querySelectorAll(selector).forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
  }

  /* ---- Jump from a card to its pin on the map -------------------------- */
  window.focusPlace = function (id) {
    var menu = $("nav-menu"); if (menu) menu.classList.remove("open");
    var section = $("map-section");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { if (window.MapView) window.MapView.focus(id); }, 450);
  };

  window.App = {
    rerenderRecommendations: function () { if (state.recRan) runRecommender(); }
  };

  /* ---- Boot ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    window.I18N.apply();
    fillStats();
    window.Render.all();
    setupLang();
    setupNav();
    setupRecommender();
    setupFilters();
    runRecommender();
    updateCountdown();
    registerSW();
    // The map depends on an external library; never let it break the rest.
    try { window.MapView.init(); } catch (err) { console.warn("Map init failed:", err); }
    setupRadar();

    document.addEventListener("langchange", function () {
      updateCountdown();
      updateLangButton();
      populateDays();            // localized day names
      applyRadar();              // radar label words
    });
  });
})();
