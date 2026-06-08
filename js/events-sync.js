/* =============================================================================
 * events-sync.js — live "What's On" from a shared Google Sheet.
 *
 * Reads events from a published Google Sheet (CSV via the CORS-friendly gviz
 * endpoint) and, if it finds any rows, replaces the built-in list and re-renders.
 * If the sheet is empty/unreachable (offline, opened from disk), the built-in
 * events in data/events.js stay — so the site always works.
 *
 * Expected columns in row 1 of the FIRST tab (order/extra columns don't matter,
 * matched by name): Date | Title (EN) | Title (中文) | Description (EN) |
 * Description (中文) | Place | Tag.  Dates as YYYY-MM-DD.
 * ========================================================================== */
(function () {
  "use strict";

  var SHEET_ID = "1e_ctPtuihjMKyNtpvLcLB5XPRhR0FKc6gBu8X7hD3Cc";
  var SHEET_URL = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:csv";

  // RFC-4180-ish CSV parser (handles quotes, commas and newlines inside quotes).
  function parseCSV(text) {
    var rows = [], row = [], field = "", inQ = false, i = 0, c;
    while (i < text.length) {
      c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function findCol(headers, test) {
    for (var i = 0; i < headers.length; i++) if (test(headers[i])) return i;
    return -1;
  }

  function normDate(v) {
    v = (v || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;          // already ISO
    var d = new Date(v);
    if (!isNaN(d.getTime())) {
      return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    }
    return "";                                            // unparseable -> skip row
  }

  function build(rows) {
    if (!rows || !rows.length) return null;
    var H = rows[0].map(function (h) { return (h || "").toLowerCase().trim(); });

    // Works for plain headers ("Title (EN)") AND Google Form question columns
    // ("Event name (English)", plus a "Timestamp" column we ignore).
    // \ben\b matches "(en)" but NOT the "en" inside "ev-en-t".
    function isEn(h) { return /english|\ben\b/.test(h); }
    function isZh(h) { return /中文|chinese|\bzh\b|繁/.test(h); }
    function titleish(h) { return /(title|name)/.test(h) && !/(place|spot|site|location|near|file|photo)/.test(h); }
    function descish(h) { return /(desc|detail)/.test(h); }

    var titleCols = [], descCols = [];
    H.forEach(function (h, i) { if (titleish(h)) titleCols.push(i); if (descish(h)) descCols.push(i); });
    function pick(cols, zh) {
      for (var i = 0; i < cols.length; i++) if (zh ? isZh(H[cols[i]]) : isEn(H[cols[i]])) return cols[i];
      return -1;
    }

    var col = {
      date:  findCol(H, function (h) { return h.indexOf("date") >= 0 && !/(stamp|update)/.test(h); }),
      tEn:   pick(titleCols, false),
      tZh:   pick(titleCols, true),
      dEn:   pick(descCols, false),
      dZh:   pick(descCols, true),
      place: findCol(H, function (h) { return /(place|spot|site|location|near)/.test(h); }),
      tag:   findCol(H, function (h) { return /(tag|type|category)/.test(h); })
    };
    if (col.tEn < 0 && titleCols.length) col.tEn = titleCols[0];
    if (col.dEn < 0 && descCols.length) col.dEn = descCols[0];
    if (col.date < 0) return null;

    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      var cell = function (k) { return col[k] >= 0 && row[col[k]] != null ? String(row[col[k]]).trim() : ""; };
      var date = normDate(cell("date")), tEn = cell("tEn");
      if (!date || !tEn) continue;                        // need a date + an English title
      var tZh = cell("tZh") || tEn, dEn = cell("dEn"), dZh = cell("dZh") || dEn;
      out.push({
        id: "sheet-" + r, date: date,
        place: cell("place") || undefined,
        tag: cell("tag") || "event",
        title: { en: tEn, zh: tZh },
        desc: { en: dEn, zh: dZh }
      });
    }
    return out;
  }

  function load() {
    if (typeof fetch !== "function") return;
    fetch(SHEET_URL, { cache: "no-store" })
      .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
      .then(function (text) {
        var events = build(parseCSV(text));
        if (events && events.length) {                    // only override if the sheet has real rows
          window.EVENTS = events;
          if (window.Render && window.Render.events) window.Render.events();
        }
      })
      .catch(function () { /* keep the built-in events */ });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
    else load();
  }
  // Allow `require()` in a quick node test.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { parseCSV: parseCSV, build: build, normDate: normDate };
  }
})();
