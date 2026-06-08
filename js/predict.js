/* =============================================================================
 * predict.js — runs the crowd-prediction model in the browser.
 *
 * It loads the tree exported by ml/train.py (window.CROWD_MODEL) and walks it in
 * a few lines. If that file is missing, it falls back to rulesPredict(), a plain
 * re-implementation of the simulator in ml/make_dataset.py — so the app always
 * works (even opened straight from disk with no server).
 *
 * The feature order MUST match ml/make_dataset.py feature_row().
 * ========================================================================== */
(function () {
  "use strict";

  // Must match PATTERNS in ml/make_dataset.py
  var PATTERNS = ["street", "sunset", "nature", "indoor", "temple", "park"];

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ---- Time context -------------------------------------------------------
  // dow: 0 = Monday ... 6 = Sunday (note: JS Date.getDay() is 0 = Sunday).
  function nowContext() {
    var d = new Date();
    return {
      dow: (d.getDay() + 6) % 7,
      hour: clamp(d.getHours(), 6, 21),
      month: d.getMonth() + 1,
      isRain: 0
    };
  }
  function isWeekend(dow) { return dow >= 5 ? 1 : 0; }
  function inSeason(season, month) {
    return season && month >= season[0] && month <= season[1] ? 1 : 0;
  }

  // ---- Feature vector (identical order to the Python trainer) -------------
  function buildFeatures(place, ctx) {
    var m = place.model;
    var oneHot = PATTERNS.map(function (p) { return p === m.pattern ? 1 : 0; });
    return [
      ctx.dow, ctx.hour, ctx.month, isWeekend(ctx.dow), ctx.isRain ? 1 : 0,
      m.pop, m.weather, inSeason(m.season, ctx.month)
    ].concat(oneHot);
  }

  // ---- Decision-tree inference -------------------------------------------
  function evalTree(tree, x) {
    var n = 0;
    while (tree.l[n] !== -1) {            // -1 marks a leaf
      n = x[tree.f[n]] <= tree.t[n] ? tree.l[n] : tree.r[n];
    }
    return tree.v[n];
  }

  // ---- Rules fallback (mirror of ml/make_dataset.py) ---------------------
  function hourFactor(pattern, h) {
    switch (pattern) {
      case "street": return 0.15 + 0.95 * Math.exp(-Math.pow((h - 16) / 4.5, 2));
      case "sunset": return 0.10 + 1.00 * Math.exp(-Math.pow((h - 17.5) / 2.2, 2));
      case "nature": return 0.20 + 0.85 * Math.exp(-Math.pow((h - 11) / 4.0, 2));
      case "indoor": return 1.05 * 0.5 * (Math.tanh((h - 9.5) / 0.8) - Math.tanh((h - 16.5) / 0.8));
      case "temple": return 0.25 + 0.80 * Math.exp(-Math.pow((h - 9) / 3.5, 2));
      case "park":   return 0.20 + 0.85 * Math.exp(-Math.pow((h - 15) / 3.5, 2));
      default:       return 0.5;
    }
  }
  function rulesPredict(place, ctx) {
    var m = place.model;
    var val = m.pop
      * hourFactor(m.pattern, ctx.hour)
      * (isWeekend(ctx.dow) ? 1.35 : 1.0)
      * (ctx.isRain ? (1.0 - m.weather * 0.6) : 1.0)
      * (inSeason(m.season, ctx.month) ? 1.9 : 1.0);
    return clamp(val, 0, 100);
  }

  // ---- Public prediction --------------------------------------------------
  function predictCrowd(place, ctx) {
    ctx = ctx || nowContext();
    var model = window.CROWD_MODEL;
    if (model && model.trees && model.trees.length) {
      var x = buildFeatures(place, ctx), sum = 0;
      for (var i = 0; i < model.trees.length; i++) sum += evalTree(model.trees[i], x);
      return clamp(sum / model.trees.length, 0, 100);
    }
    return rulesPredict(place, ctx);          // model file not loaded
  }

  function crowdBucket(score) {
    return score >= 66 ? "high" : score >= 33 ? "medium" : "low";
  }

  // Smooth green → amber → red for pin colours and meters.
  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function mix(c1, c2, t) {
    return "rgb(" + lerp(c1[0], c2[0], t) + "," + lerp(c1[1], c2[1], t) + "," + lerp(c1[2], c2[2], t) + ")";
  }
  var GREEN = [45, 169, 110], AMBER = [240, 169, 70], RED = [230, 80, 62];
  function crowdColor(score) {
    var t = clamp(score, 0, 100) / 100;
    return t < 0.5 ? mix(GREEN, AMBER, t / 0.5) : mix(AMBER, RED, (t - 0.5) / 0.5);
  }

  // Calmest day this week: predict at each place's peak hour across Mon–Sun.
  var PEAK_HOUR = { street: 16, sunset: 17, nature: 11, indoor: 13, temple: 9, park: 15 };
  function weeklyProfile(place) {
    var base = nowContext();
    var hour = PEAK_HOUR[place.model.pattern] || 14;
    var values = [], best = 0;
    for (var dow = 0; dow < 7; dow++) {
      var v = predictCrowd(place, { dow: dow, hour: hour, month: base.month, isRain: 0 });
      values.push(v);
      if (v < values[best]) best = dow;
    }
    return { values: values, bestDay: best, hour: hour };
  }

  window.Predict = {
    nowContext: nowContext,
    predictCrowd: predictCrowd,
    crowdBucket: crowdBucket,
    crowdColor: crowdColor,
    weeklyProfile: weeklyProfile,
    usingModel: function () { return !!(window.CROWD_MODEL && window.CROWD_MODEL.trees); }
  };
})();
