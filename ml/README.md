# The crowd-prediction model

This folder trains the small model that predicts **how busy each Tamsui spot is** at a given
day and time. The website runs the trained model in the browser (no server, no Python) to power
the recommender, the map's colour radar, and the "best time to visit" charts.

## ⚠️ Read this first — where the data comes from
There is **no public, real-time foot-traffic feed** for these spots. So we **simulate** a
representative dataset from well-documented patterns and train the model on it. The app always
labels its output *"estimate of typical busyness — not live data."*

This is a deliberate, honest design: in a real deployment you would replace the simulator with
**real data** (transit ridership, anonymised telecom/foot-traffic, ticket sales) and re-run
`train.py` — nothing else would change. The simulator's assumptions (in `make_dataset.py`) are
themselves the design artifact: they document *what we believe drives the crowds*.

## The assumptions we encode (`make_dataset.py`)
For every place we set a base popularity, a daily-rhythm "pattern", a rain sensitivity, and an
optional seasonal peak. The simulator then combines:

- **Daily rhythm** by pattern: `street` builds to a 13–19 peak; `sunset` spikes at golden hour;
  `nature` favours late morning; `indoor` is flat during opening hours and ~0 otherwise;
  `temple` peaks in the morning; `park` peaks in the family afternoon.
- **Weekend effect:** Saturdays/Sundays ≈ +35% busier.
- **Rain:** suppresses outdoor places (by their `weather` sensitivity); museums barely care.
- **Season:** Tianyuan Temple roughly doubles during the Feb–Mar cherry-blossom season.
- A little random noise, then clipped to 0–100.

## Features (must match `js/predict.js`)
```
[ dow, hour, month, is_weekend, is_rain,
  pop, weather_sens, in_season,
  pat_street, pat_sunset, pat_nature, pat_indoor, pat_temple, pat_park ]
```

## The model
A single, right-sized **DecisionTreeRegressor** (`train.py`). We chose one tree because:
- the simulator is low-noise and we only ever predict for 16 known spots, so one tree fits it
  tightly, and
- it serialises to a **small** file (~100 KB) the browser can walk in ~10 lines. (A deep Random
  Forest reached the same accuracy but exported to ~5 MB — too heavy for a web page.)

Typical result: **held-out MAE ≈ 2.5 / 100**, **R² ≈ 0.97**.

## Retrain
```bash
python3 -m venv ../.venv && source ../.venv/bin/activate
pip install scikit-learn
python3 train.py        # prints metrics + sanity checks, writes ../data/crowd_model.js
```

`train.py` also prints sanity checks you can eyeball, e.g. *Old Street · Saturday 17:00 → ~100*,
*Mangrove · Tuesday 10:00 → ~30*, *Tianyuan in blossom season → ~99* vs *off-season → ~50*.

## How the browser uses it
`data/crowd_model.js` sets `window.CROWD_MODEL`. `js/predict.js` builds the feature vector for a
place + time and walks the tree. If the model file is ever missing, `predict.js` falls back to a
plain re-implementation of the simulator, so the app still works.
