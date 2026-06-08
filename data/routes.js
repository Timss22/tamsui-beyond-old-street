/* =============================================================================
 * routes.js — themed itineraries (this is "Plan B: Themed Routes").
 * Each route is an ordered list of place ids (see places.js). Clicking a route
 * draws the path on the map. Routes are deliberately designed to pull people
 * away from Old Street and across the new bridge to Bali.
 * ========================================================================== */
window.ROUTES = [
  {
    id: "history-forts",
    icon: "history",
    title: { en: "History & Forts Trail", zh: "古蹟與礮臺之旅" },
    duration: { en: "Half day · walking", zh: "半天 · 步行" },
    promotesBridge: false,
    desc: {
      en: "Trace four centuries of Tamsui — Spanish, Dutch, British and Qing — on a quiet uphill loop the day-trippers miss.",
      zh: "在一條一日遊旅客錯過的清幽上坡路線上，走過西、荷、英、清四百年的淡水歷史。"
    },
    stops: ["fort-san-domingo", "little-white-house", "aletheia", "hobe-fort"]
  },
  {
    id: "cross-river",
    icon: "bridge",
    title: { en: "Cross-River Adventure", zh: "跨河探險" },
    duration: { en: "Half day · walk + bike", zh: "半天 · 步行＋單車" },
    promotesBridge: true,
    desc: {
      en: "Cross the brand-new Tamkang Bridge on foot or by bike and discover the calm, under-visited Bali shore.",
      zh: "步行或騎單車跨越全新的淡江大橋，發現寧靜、少有人造訪的八里河岸。"
    },
    stops: ["tamkang-bridge", "bali-left-bank", "shihsanhang", "bali-old-street"]
  },
  {
    id: "nature-escape",
    icon: "nature",
    title: { en: "Nature & Green Escape", zh: "自然綠意小旅行" },
    duration: { en: "Half day · walking", zh: "半天 · 步行" },
    promotesBridge: false,
    desc: {
      en: "Swap the crowds for crabs, trees and lawns — a mangrove boardwalk, an art-filled hillside and a historic campus.",
      zh: "用螃蟹、樹林與草坪取代人潮——紅樹林木棧道、藝術山坡與歷史校園。"
    },
    stops: ["mangrove", "cloud-gate", "aletheia"]
  },
  {
    id: "foodie-trail",
    icon: "food",
    title: { en: "Foodie Back-Lanes", zh: "巷弄美食路線" },
    duration: { en: "2–3 hours · eating!", zh: "2–3 小時 · 美食！" },
    promotesBridge: true,
    desc: {
      en: "Eat your way from Zhenli Street — birthplace of A-gei — to the desserts of Bali Old Street, skipping the worst of the queues.",
      zh: "從阿給的發源地真理街，一路吃到八里老街的甜點，避開最擁擠的排隊人潮。"
    },
    stops: ["aletheia", "old-street", "bali-old-street"]
  },
  {
    id: "sunset-chasers",
    icon: "views",
    title: { en: "Sunset Chasers", zh: "追夕陽路線" },
    duration: { en: "Late afternoon", zh: "傍晚時分" },
    promotesBridge: true,
    desc: {
      en: "Three world-class sunset spots without the Old Street squeeze — finish by watching the new bridge light up from Bali.",
      zh: "三個世界級的夕陽景點，無需擠在老街——最後在八里看著新大橋亮起燈火。"
    },
    stops: ["fishermans-wharf", "tamkang-bridge", "bali-left-bank"]
  }
];
