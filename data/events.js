/* =============================================================================
 * events.js — "What's On" (part of "Plan C: Smart Guide & Events").
 * NOTE: dates are illustrative samples for the project demo. Before going live,
 * confirm real dates on the New Taipei City Tourism site (see README.md).
 * `place` (optional) links an event to a pin in places.js.
 * `season` events show a date range instead of a single day.
 * ========================================================================== */
window.EVENTS = [
  {
    id: "bridge-opening",
    date: "2026-05-12",
    place: "tamkang-bridge",
    tag: "bridge",
    featured: true,
    title: { en: "Tamkang Bridge Opening Celebrations", zh: "淡江大橋通車慶典" },
    desc: {
      en: "The new bridge is open! Evening light shows on Zaha Hadid's single mast, plus guided first-walks across to Bali all summer.",
      zh: "新橋通車了！札哈‧哈蒂單塔的夜間燈光秀，以及整個夏季跨越至八里的首航導覽。"
    }
  },
  {
    id: "art-festival",
    date: "2026-10-24",
    place: "old-street",
    tag: "festival",
    title: { en: "Tamsui Environment Art Festival", zh: "淡水環境藝術節" },
    desc: {
      en: "Tamsui's much-loved community arts parade winds through the streets with giant puppets and neighbourhood performances.",
      zh: "淡水備受喜愛的社區藝術大遊行，帶著巨型藝偶與街坊表演穿街走巷。"
    }
  },
  {
    id: "tianyuan-blossoms",
    date: "2027-02-20",
    dateEnd: "2027-03-20",
    place: "tianyuan",
    tag: "nature",
    season: true,
    title: { en: "Tianyuan Temple Cherry Blossom Season", zh: "天元宮櫻花季" },
    desc: {
      en: "Taiwan's most famous urban cherry blossoms bloom around the temple. Go on a weekday morning to beat the crowds.",
      zh: "全台最著名的都市櫻花在寶塔周圍綻放。建議平日清晨前往，避開人潮。"
    }
  }
];
