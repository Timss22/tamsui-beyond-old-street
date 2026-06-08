"""
make_dataset.py
===============
Builds the *representative* training set for the Tamsui crowd-prediction model.

Honesty note (read this!):
    There is no public, real-time foot-traffic feed for these spots, so we
    SIMULATE a dataset from well-documented patterns — weekends are busier than
    weekdays, the riverside peaks at sunset, indoor museums ignore the rain,
    Tianyuan Temple spikes during cherry-blossom season, and so on. The model
    then *learns* these patterns from the data. In production you would replace
    this simulator with real data (telecom/foot-traffic, ticket sales, transit
    counts) and retrain — train.py would not need to change.

The assumptions encoded below ARE the design artifact for the write-up.

Feature order (must stay identical to js/predict.js buildFeatures()):
    [ dow, hour, month, is_weekend, is_rain,
      pop, weather_sens, in_season,
      pat_street, pat_sunset, pat_nature, pat_indoor, pat_temple, pat_park ]
"""

import math
import numpy as np

# Daily-rhythm "patterns" → one-hot order used in the feature vector.
PATTERNS = ["street", "sunset", "nature", "indoor", "temple", "park"]

FEATURE_NAMES = [
    "dow", "hour", "month", "is_weekend", "is_rain",
    "pop", "weather_sens", "in_season",
    "pat_street", "pat_sunset", "pat_nature", "pat_indoor", "pat_temple", "pat_park",
]

# Place modelling attributes. ids MUST match data/places.js (the `model` block).
#   pop:     base popularity 0-100   pattern: one of PATTERNS
#   weather: 0-1 rain sensitivity    season:  None or (startMonth, endMonth)
PLACES = [
    ("old-street",        96, "street", 0.50, None),
    ("riverside",         92, "sunset", 0.70, None),
    ("tamkang-bridge",    48, "sunset", 0.60, None),
    ("fort-san-domingo",  56, "indoor", 0.35, None),
    ("hobe-fort",         28, "indoor", 0.40, None),
    ("little-white-house",36, "indoor", 0.30, None),
    ("cloud-gate",        26, "park",   0.40, None),
    ("aletheia",          32, "park",   0.35, None),
    ("tamkang-high",      30, "park",   0.35, None),
    ("shi-mansion",       16, "indoor", 0.30, None),
    ("mangrove",          30, "nature", 0.60, None),
    ("tianyuan",          40, "temple", 0.50, (2, 3)),   # cherry-blossom spike
    ("fishermans-wharf",  72, "sunset", 0.60, None),
    ("bali-old-street",   46, "street", 0.50, None),
    ("bali-left-bank",    36, "park",   0.60, None),
    ("shihsanhang",       30, "indoor", 0.15, None),
]

HOURS = list(range(6, 22))   # 06:00 .. 21:00 — the hours worth visiting


def hour_factor(pattern, h):
    """A 0..~1.1 multiplier describing each place type's daily rhythm."""
    if pattern == "street":   # builds through the day, peaks 13-19
        return 0.15 + 0.95 * math.exp(-((h - 16) / 4.5) ** 2)
    if pattern == "sunset":   # sharp golden-hour peak
        return 0.10 + 1.00 * math.exp(-((h - 17.5) / 2.2) ** 2)
    if pattern == "nature":   # late-morning, fades by evening
        return 0.20 + 0.85 * math.exp(-((h - 11) / 4.0) ** 2)
    if pattern == "indoor":   # flat during opening hours, ~0 outside
        return 1.05 * 0.5 * (math.tanh((h - 9.5) / 0.8) - math.tanh((h - 16.5) / 0.8))
    if pattern == "temple":   # morning worshippers, open daytime
        return 0.25 + 0.80 * math.exp(-((h - 9) / 3.5) ** 2)
    if pattern == "park":     # family afternoons
        return 0.20 + 0.85 * math.exp(-((h - 15) / 3.5) ** 2)
    return 0.5


def in_season(month, season):
    return 1 if (season is not None and season[0] <= month <= season[1]) else 0


def crowd_value(pop, pattern, weather_sens, season, dow, hour, month, is_rain, rng):
    """The simulator: combine the documented effects into a 0-100 crowd score."""
    is_weekend = 1 if dow >= 5 else 0
    f_hour = hour_factor(pattern, hour)
    f_week = 1.35 if is_weekend else 1.0
    f_rain = (1.0 - weather_sens * 0.6) if is_rain else 1.0
    f_season = 1.9 if in_season(month, season) else 1.0
    val = pop * f_hour * f_week * f_rain * f_season
    val += rng.normal(0, 3.0)          # a little real-world noise
    return float(max(0.0, min(100.0, val)))


def feature_row(pop, pattern, weather_sens, season, dow, hour, month, is_rain):
    """Build the model's input vector (same order as js/predict.js)."""
    onehot = [1 if pattern == p else 0 for p in PATTERNS]
    return [
        dow, hour, month, 1 if dow >= 5 else 0, is_rain,
        pop, weather_sens, in_season(month, season),
        *onehot,
    ]


def build_dataset(seed=42):
    """Return (X, y, feature_names) as numpy arrays over the full grid."""
    rng = np.random.default_rng(seed)
    X, y = [], []
    for (_id, pop, pattern, weather_sens, season) in PLACES:
        for dow in range(7):
            for hour in HOURS:
                for month in range(1, 13):
                    for is_rain in (0, 1):
                        X.append(feature_row(pop, pattern, weather_sens, season,
                                             dow, hour, month, is_rain))
                        y.append(crowd_value(pop, pattern, weather_sens, season,
                                             dow, hour, month, is_rain, rng))
    return np.array(X, dtype=float), np.array(y, dtype=float), FEATURE_NAMES


if __name__ == "__main__":
    X, y, names = build_dataset()
    print(f"Built dataset: {X.shape[0]:,} rows × {X.shape[1]} features")
    print("Features:", names)
    print(f"Crowd range: {y.min():.1f} .. {y.max():.1f}  (mean {y.mean():.1f})")
