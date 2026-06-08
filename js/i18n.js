/* =============================================================================
 * i18n.js — language switching (English default, Traditional Chinese available).
 *
 * UI "chrome" text lives in data/strings.js and is tagged in the HTML with
 * data-i18n / data-i18n-ph / data-i18n-aria attributes. Content text (place
 * names, blurbs, ...) is stored inline as {en, zh} objects and read with L().
 *
 * Add another language later: add a block to data/strings.js, give every place/
 * route/event a value for the new key, then push the code into LANGS below.
 * ========================================================================== */
(function () {
  "use strict";

  var LANGS = ["en", "zh"];                 // order shown in the switcher
  var HTML_LANG = { en: "en", zh: "zh-Hant" };

  var I18N = {
    lang: "en",
    langs: LANGS,

    init: function () {
      var saved = null, param = null;
      try { saved = localStorage.getItem("tamsui-lang"); } catch (e) {}
      try { param = new URLSearchParams(location.search).get("lang"); } catch (e) {}
      // Priority: ?lang= (shareable links) > saved choice > English default.
      this.lang = LANGS.indexOf(param) >= 0 ? param
        : (LANGS.indexOf(saved) >= 0 ? saved : "en");
      if (LANGS.indexOf(param) >= 0) { try { localStorage.setItem("tamsui-lang", param); } catch (e) {} }
      return this;
    },

    // Translate a UI-string key.
    t: function (key) {
      var S = window.STRINGS || {};
      return (S[this.lang] && S[this.lang][key]) || (S.en && S.en[key]) || key;
    },

    // Localise an inline {en, zh} content object.
    L: function (obj) {
      if (obj == null) return "";
      if (typeof obj === "string") return obj;
      return obj[this.lang] != null ? obj[this.lang] : (obj.en != null ? obj.en : "");
    },

    // Swap every tagged element in the static HTML.
    apply: function () {
      document.documentElement.lang = HTML_LANG[this.lang] || "en";
      var self = this;
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = self.t(el.getAttribute("data-i18n"));
      });
      document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
        el.setAttribute("placeholder", self.t(el.getAttribute("data-i18n-ph")));
      });
      document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
        el.setAttribute("aria-label", self.t(el.getAttribute("data-i18n-aria")));
      });
    },

    set: function (lang) {
      if (LANGS.indexOf(lang) < 0 || lang === this.lang) {
        if (lang === this.lang) this.apply();
        return;
      }
      this.lang = lang;
      try { localStorage.setItem("tamsui-lang", lang); } catch (e) {}
      this.apply();
      // Tell JS-rendered sections (cards, map popups...) to rebuild.
      document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
    }
  };

  I18N.init();
  window.I18N = I18N;
  // Short global helpers used across render.js / map.js / app.js
  window.t = function (k) { return I18N.t(k); };
  window.L = function (o) { return I18N.L(o); };
})();
