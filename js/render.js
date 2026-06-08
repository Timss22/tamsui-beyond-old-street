/* =============================================================================
 * render.js — builds every data-driven section (gem cards, routes, food,
 * events, recommender results) and re-renders them when the language changes.
 * ========================================================================== */
(function () {
  "use strict";

  var CATEGORY_EMOJI = {
    history: "🏛️", nature: "🌿", culture: "🎭",
    views: "🌅", food: "🍜", temple: "⛩️", bridge: "🌉"
  };

  function byId(id) { return document.getElementById(id); }
  function place(id) { return window.PLACES.find(function (p) { return p.id === id; }); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---- Small UI pieces ----------------------------------------------------
  function media(p) {
    // A photo if one was dropped in, otherwise a category gradient + emoji.
    if (p.image) {
      return '<div class="card-media" style="background-image:url(' + esc(p.image) + ')"></div>';
    }
    return '<div class="card-media ph ph-' + esc(p.category) + '"><span>' +
      (CATEGORY_EMOJI[p.category] || "📍") + "</span></div>";
  }

  function crowdMeter(score) {
    var bucket = window.Predict.crowdBucket(score);
    var color = window.Predict.crowdColor(score);
    return '<div class="meter" title="' + Math.round(score) + '/100">' +
      '<span class="meter-label">' + window.t("crowd." + bucket) + "</span>" +
      '<span class="meter-track"><span class="meter-fill" style="width:' +
      Math.round(score) + "%;background:" + color + '"></span></span></div>';
  }

  function sparkline(p) {
    var prof = window.Predict.weeklyProfile(p);
    var bars = prof.values.map(function (v, i) {
      var h = Math.max(8, Math.round(v));
      var best = i === prof.bestDay;
      return '<span class="spark-bar' + (best ? " best" : "") + '" style="height:' + h + '%" ' +
        'title="' + window.t("days." + i) + ": " + Math.round(v) + '/100"></span>';
    }).join("");
    var bestDay = window.t("days." + prof.bestDay);
    return '<div class="spark"><div class="spark-bars">' + bars + "</div>" +
      '<div class="spark-cap">' + window.t("gems.besttime") + " · <b>" + bestDay + "</b></div></div>";
  }

  function areaBadge(p) {
    var key = p.area === "bali" ? "common.area_bali" : "common.area_tamsui";
    return '<span class="badge badge-area">' + window.t(key) + "</span>";
  }

  // ---- Hidden Gems grid ---------------------------------------------------
  function gems() {
    var box = byId("gems-grid");
    if (!box) return;
    var ctx = window.Predict.nowContext();
    var list = window.PLACES
      .filter(function (p) { return !p.hotspot && !p.featured; })
      .map(function (p) { return { p: p, crowd: window.Predict.predictCrowd(p, ctx) }; })
      .sort(function (a, b) { return a.crowd - b.crowd; });

    box.innerHTML = list.map(function (row) {
      var p = row.p;
      return '<article class="card gem" data-focus="' + p.id + '">' +
        media(p) +
        '<div class="card-body">' +
          '<div class="card-head"><h3>' + esc(window.L(p.name)) + "</h3>" + areaBadge(p) + "</div>" +
          crowdMeter(row.crowd) +
          '<p class="blurb">' + esc(window.L(p.blurb)) + "</p>" +
          '<p class="whygo"><b>' + window.t("gems.whygo") + ":</b> " + esc(window.L(p.whyGo)) + "</p>" +
          (p.hours ? '<p class="hours">🕘 ' + esc(p.hours) + "</p>" : "") +
          sparkline(p) +
          '<button class="link-btn" data-focus="' + p.id + '">' + window.t("gems.viewmap") + " →</button>" +
        "</div></article>";
    }).join("");
    wireFocus(box);
  }

  // ---- Themed routes ------------------------------------------------------
  function routes() {
    var box = byId("routes-grid");
    if (!box) return;
    box.innerHTML = window.ROUTES.map(function (r) {
      var stops = r.stops.map(function (id) {
        var p = place(id);
        return "<li>" + (CATEGORY_EMOJI[p.category] || "📍") + " " + esc(window.L(p.name)) + "</li>";
      }).join("");
      return '<article class="card route">' +
        '<div class="card-body">' +
          '<div class="route-top"><span class="route-emoji">' + (CATEGORY_EMOJI[r.icon] || "🧭") + "</span>" +
            (r.promotesBridge ? '<span class="badge badge-bridge">🌉 ' + window.t("routes.bridge_badge") + "</span>" : "") +
          "</div>" +
          "<h3>" + esc(window.L(r.title)) + "</h3>" +
          '<p class="route-dur">⏱ ' + esc(window.L(r.duration)) + "</p>" +
          '<p class="blurb">' + esc(window.L(r.desc)) + "</p>" +
          '<div class="route-stops"><b>' + window.t("routes.stops_label") + "</b><ol>" + stops + "</ol></div>" +
          '<button class="btn btn-soft route-show" data-route="' + r.id + '">' + window.t("routes.show") + "</button>" +
        "</div></article>";
    }).join("");
    box.querySelectorAll(".route-show").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (window.MapView) window.MapView.showRoute(btn.getAttribute("data-route"));
      });
    });
  }

  // ---- Eat Local ----------------------------------------------------------
  function food() {
    var box = byId("food-grid");
    if (!box) return;
    box.innerHTML = window.FOODS.map(function (f) {
      return '<article class="card food">' +
        '<div class="food-emoji">' + f.icon + "</div>" +
        '<div class="card-body"><h3>' + esc(window.L(f.name)) + "</h3>" +
        '<p class="blurb">' + esc(window.L(f.desc)) + "</p></div></article>";
    }).join("");
  }

  // ---- What's On ----------------------------------------------------------
  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (window.I18N.lang === "zh") {
      return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
    }
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function events() {
    var box = byId("events-list");
    if (!box) return;
    var list = window.EVENTS.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    box.innerHTML = list.map(function (ev) {
      var when = ev.season && ev.dateEnd
        ? formatDate(ev.date) + " – " + formatDate(ev.dateEnd)
        : formatDate(ev.date);
      return '<article class="event' + (ev.featured ? " featured" : "") + '">' +
        '<div class="event-date">' + (ev.season ? "🌸 " : "📅 ") + when + "</div>" +
        '<div class="event-body"><h3>' + esc(window.L(ev.title)) + "</h3>" +
        '<p>' + esc(window.L(ev.desc)) + "</p></div></article>";
    }).join("");
  }

  // ---- Recommender results (called by app.js) ----------------------------
  function recommend(rows) {
    var box = byId("rec-results");
    if (!box) return;
    if (!rows.length) {
      box.innerHTML = '<p class="rec-empty">' + window.t("rec.empty") + "</p>";
      return;
    }
    box.innerHTML = rows.map(function (row, i) {
      var p = row.p;
      return '<article class="card rec" data-focus="' + p.id + '">' +
        media(p) +
        '<div class="card-body">' +
          '<div class="card-head"><h3><span class="rank">' + (i + 1) + "</span> " +
            esc(window.L(p.name)) + "</h3>" + areaBadge(p) + "</div>" +
          '<div class="rec-pred"><span>' + window.t("rec.predicted") + "</span>" + crowdMeter(row.crowd) + "</div>" +
          '<p class="whygo">' + esc(window.L(p.whyGo)) + "</p>" +
          '<button class="link-btn" data-focus="' + p.id + '">' + window.t("rec.takeme") + "</button>" +
        "</div></article>";
    }).join("");
    wireFocus(box);
  }

  function wireFocus(scope) {
    scope.querySelectorAll("[data-focus]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        var id = el.getAttribute("data-focus");
        if (window.focusPlace) window.focusPlace(id);
      });
    });
  }

  function all() { gems(); routes(); food(); events(); }

  document.addEventListener("langchange", function () {
    all();
    if (window.App && window.App.rerenderRecommendations) window.App.rerenderRecommendations();
  });

  window.Render = {
    all: all, gems: gems, routes: routes, food: food, events: events,
    recommend: recommend, categoryEmoji: CATEGORY_EMOJI, esc: esc
  };
})();
