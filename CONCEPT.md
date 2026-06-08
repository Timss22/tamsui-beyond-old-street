# Tamsui · Beyond the Old Street — Project Concept & Design Guideline

*A smart tourism guide for our English II Action Research project.*
*This document is our group's design guideline — use it for the report and the presentation.*

---

## 1. The problem

Tamsui (淡水) is one of northern Taiwan's most visited day-trip destinations, but the
visitors pile into the **same two places**: **Tamsui Old Street** and the **riverside
promenade**. On weekends and at sunset they are shoulder-to-shoulder, which:

- makes the experience worse for tourists,
- puts pressure on local residents and shops, and
- leaves dozens of genuinely beautiful spots nearby almost empty.

At the same time, a once-in-a-generation opportunity has arrived: the **new Tamkang
(Danjiang) Bridge** opened on **12 May 2026**, connecting Tamsui to the quiet **Bali (八里)**
side of the river in minutes.

## 2. Our two objectives

1. **Decongest** Old Street and the riverside by actively steering visitors to quieter
   "hidden gems" — and across the river to under-touristed Bali.
2. **Promote the new Tamkang Bridge** so people come to see it and actually use it.

These two goals reinforce each other: **the bridge *is* the decongestion tool.** "Cross the
new bridge, beat the crowds" is the message that ties the whole project together.

## 3. Where this fits in our proposal

Our midterm proposal compared three plans. This product delivers two of them at once:

| Plan | Owner |
|------|-------|
| **Plan A — Social Media** (Instagram) | *the other team* |
| **Plan B — Themed Routes** | **this app** |
| **Plan C — Smart Guide & Events** | **this app** |

The Instagram account (Plan A) brings people in; **this app gives them somewhere smarter to
go once they're interested.** The two work together — the app's live link goes in the IG bio,
and the IG posts can point to specific gems and routes in the app.

## 4. The solution: a smart, installable web guide

A **mobile-first web app** (a PWA — it installs to a phone home screen) that opens instantly,
needs no login, and is **free to host**. It has nine parts:

1. **Hero** — the message: *"Tamsui has more than one street."*
2. **The New Tamkang Bridge** — a feature with a live "open for N days" counter and the key
   facts (Objective 2).
3. **"Where should I go right now?"** — a recommender that asks *when* and *what mood*, then
   ranks the **calmest** spots that fit (Objective 1).
4. **Crowd-radar map** — every spot pinned and **coloured by how busy it is**, with a time
   slider that predicts any moment and a "Skip the crowds" switch.
5. **Hidden Gems** — cards for the quiet alternatives, each with a "best time to visit" chart.
6. **Themed Routes** — hand-built half-day trails (several cross the new bridge).
7. **Eat Local** — Tamsui's famous snacks, and calmer places to find them.
8. **What's On** — festivals and seasons worth timing your trip around.
9. **Footer** — links back to our Instagram, plus our sources.

It is **bilingual** (English by default, with a one-tap switch to Traditional Chinese) so it
serves both international tourists and local visitors.

## 5. The "smart" part — predicting the crowds

The feature that makes this more than a brochure is a small **machine-learning model** that
predicts how busy each place is for any day and time. It powers the recommender, the map's
colour radar, and the "best time to visit" charts.

**An honesty note we are proud of:** there is no public, real-time crowd feed for these
spots, so we **simulated a representative dataset** from well-known patterns (weekends are
busier than weekdays; the riverside peaks at sunset; museums ignore the rain; Tianyuan Temple
spikes during cherry-blossom season) and **trained a model to learn them**. The app always
labels its numbers *"estimate of typical busyness — not live data."* In a real deployment you
would swap the simulated data for real foot-traffic, transit, or ticket data and retrain — the
rest of the app would not change. (Details in [`ml/README.md`](ml/README.md).)

This is a strong talking point for the presentation: we show that we understand both the value
**and the limits** of a model, and exactly how we would make it real.

## 6. Why these design choices

- **A web app, not a native app:** anyone can open it from a link — no app store, no install
  barrier — and we can host it for free. As a PWA it still *feels* like an app on a phone.
- **No accounts, no tracking:** it just works, which matters for tourists.
- **Data-driven:** all the places, routes, events and translations live in simple files, so
  the whole team can add content without touching the design.
- **Honest about data:** see §5.

## 7. How we measured success (for the report)

The app is designed around a measurable goal — **redistribution**. Things we can point to:

- # of spots promoted **away** from the two hotspots (the app surfaces 14 alternatives).
- The recommender **never** sends people to Old Street or the riverside.
- Several routes and the whole Bali section exist **only because of the new bridge**.
- Predictions visibly turn the hotspots red at peak times while gems stay green.

## 8. Future work

- Plug in **real crowd data** (e.g., transit ridership, anonymised foot-traffic).
- Add **more languages** (the structure already supports it — Japanese and Korean next).
- Partner with local shops to add **the team's own photos** and small offers.
- A "live now" mode using the real current weather.

---

*Built by our group for English II. Map data © OpenStreetMap contributors. Bridge facts from
Zaha Hadid Architects, ArchDaily and Wikipedia.*
