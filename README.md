# Tamsui · Beyond the Old Street 🌅🌉

A smart, bilingual tourism guide that **predicts the crowds** and points visitors to Tamsui's
hidden gems — and across the **new Tamkang Bridge** — to relieve the over-crowded Old Street and
riverside.

Built for an English II Action Research project. The full idea is written up in
**[CONCEPT.md](CONCEPT.md)** (use it for the report/presentation).

![icon](assets/icons/icon-192.png)

## What it does
- 🗺️ **Crowd-radar map** — pins coloured by predicted busyness, a time slider, and a *Skip the
  crowds* switch.
- 🧭 **"Where should I go now?"** recommender — ranks the calmest spots that match your mood.
- 💎 **Hidden gems**, 🚶 **themed routes**, 🍜 **local food**, and 📅 **events**.
- 🌉 A feature on the **new Tamkang Bridge** (opened 12 May 2026) with a live day counter.
- 🌐 **English + Traditional Chinese**, switchable in the header; the choice is remembered.
- 📱 Installable **PWA** — works offline after the first visit.

## Run it locally
It's a plain static site — **no build step**.

**Easiest:** double-click `index.html`. (The map and predictions work; the installable-PWA part
only activates when served over http.)

**Recommended (full features):**
```bash
cd "Tamsui_Tourism_App"
python3 -m http.server 8000
# open http://localhost:8000
```

## Project structure
```
index.html              the page (all 9 sections)
css/styles.css          the sunset theme
js/                     i18n · predict · render · map · app
data/                   places · routes · events · food · strings (bilingual) · crowd_model.js
ml/                     the crowd-model trainer (Python) — see ml/README.md
assets/icons/           app icons (+ icon.svg source)
manifest.webmanifest    PWA metadata
sw.js                   service worker (offline)
```

## Edit the content (no coding needed)
- **Add / change a place:** edit `data/places.js`. Give it `name`, `blurb`, `whyGo` in both
  `en` and `zh`, a `category`, `lat`/`lng`, and a `model` block (used by the predictor).
- **Add a photo:** drop an image in `assets/img/` and set `image: "assets/img/yourfile.jpg"` on
  that place. Cards use a clean gradient + icon until a photo is added.
- **Routes / events / food:** `data/routes.js`, `data/events.js`, `data/food.js`.
- **Wording / translations:** `data/strings.js` (the `en` and `zh` blocks).
- **Your Instagram link:** in `index.html`, search for `TODO` in the footer and paste your handle.
- ⚠️ **Event dates are samples** — confirm real dates on the New Taipei City Tourism site.

## Retrain the crowd model (optional)
Only needed if you change the assumptions in `ml/make_dataset.py` or plug in real data.
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install scikit-learn
python3 ml/train.py        # rewrites data/crowd_model.js
```
The website itself never needs Python — the trained model ships as `data/crowd_model.js`.
See **[ml/README.md](ml/README.md)** for how it works.

## Go live on GitHub Pages (one push)
1. Create a new GitHub repo and push this folder to the `main` branch.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) publishes it.
   Your live URL will be `https://<your-username>.github.io/<repo-name>/`.

All paths are relative and a `.nojekyll` file is included, so it works on the Pages subpath.

## Credits
Map © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors · tiles by
[CARTO](https://carto.com/) · [Leaflet](https://leafletjs.com/). Bridge facts: Zaha Hadid
Architects, ArchDaily, Wikipedia.
