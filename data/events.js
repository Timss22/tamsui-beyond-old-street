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
    id: "wharf-sunset-concerts",
    date: "2026-07-04",
    place: "fishermans-wharf",
    tag: "music",
    title: { en: "Fisherman's Wharf Sunset Concerts", zh: "漁人碼頭夕陽音樂會" },
    desc: {
      en: "Free open-air live music on the boardwalk every summer weekend as the sun goes down over the harbour.",
      zh: "整個夏季的週末，當夕陽沒入港灣，木棧道上都有免費的露天現場音樂。"
    }
  },
  {
    id: "bali-bike-kite",
    date: "2026-08-15",
    place: "bali-left-bank",
    tag: "outdoor",
    title: { en: "Bali Left Bank Bike & Kite Day", zh: "八里左岸單車風箏日" },
    desc: {
      en: "Family kite-flying and riverside cycling on the breezy Bali lawns — easy to reach now via the new bridge.",
      zh: "在八里清風徐徐的草坪上放風箏、騎單車的親子活動——如今經由新大橋輕鬆抵達。"
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
