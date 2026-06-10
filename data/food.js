/* =============================================================================
 * food.js — "Eat Local": real restaurant/stall recommendations from the team.
 * Each item: id (also the photo filename) · icon (emoji fallback) · name {en,zh}
 * · where {en,zh} (the shop) · desc {en,zh} · dir (Google Maps search target for
 * the Directions button) · image (optional; else assets/img/<id>.jpg).
 * ========================================================================== */
window.FOODS = [
  {
    id: "wen-hua-agei",
    icon: "🥟",
    name: { en: "A-gei", zh: "阿給" },
    where: { en: "Wen Hua A-gei", zh: "文化阿給" },
    desc: {
      en: "Bean-curd skin stuffed with glass noodles — the Tamsui classic, from a much-loved stall.",
      zh: "豆皮裡面包冬粉——淡水經典小吃，來自備受喜愛的老店。"
    },
    dir: "文化阿給 淡水",
    image: null
  },
  {
    id: "tamsui-fish-ball",
    icon: "🍢",
    name: { en: "Fish Balls", zh: "魚丸" },
    where: { en: "Tamsui Fish Ball", zh: "淡水魚丸" },
    desc: {
      en: "Springy, bouncy fish balls in a light broth — a fishing-town staple.",
      zh: "吃起來很Q彈的魚丸，浸在清爽的湯頭裡——漁村的經典美味。"
    },
    dir: "新北市淡水區中正路135之2號",
    image: null
  },
  {
    id: "grandma-mochi",
    icon: "🍡",
    name: { en: "Fresh-Milk Mochi", zh: "鮮奶麻糬" },
    where: { en: "Grandma Mochi", zh: "麻吉奶奶鮮奶麻糬" },
    desc: {
      en: "Soft, springy fresh-milk mochi — chewy in the best way.",
      zh: "吃起來QQ彈彈的鮮奶麻糬，軟糯有嚼勁。"
    },
    dir: "麻吉奶奶鮮奶麻糬 淡水",
    image: null
  },
  {
    id: "grand-castella",
    icon: "🍰",
    name: { en: "Castella Cake", zh: "現烤蛋糕" },
    where: { en: "Grand Castella (Yuanwei)", zh: "緣味古早味現烤蛋糕" },
    desc: {
      en: "Freshly-baked old-style castella — wobbly, fluffy and soft.",
      zh: "現烤的古早味蛋糕，鬆軟綿密、入口即化。"
    },
    dir: "緣味古早味現烤蛋糕 淡水",
    image: null
  },
  {
    id: "the-shack-pizza",
    icon: "🍕",
    name: { en: "BBQ Chicken Pizza", zh: "香烤雞披薩" },
    where: { en: "The Shack · Bali", zh: "The Shack 野菇屋 Pizza 八里店" },
    desc: {
      en: "Wood-fired BBQ chicken pizza across the river in Bali — a cosy local favourite.",
      zh: "河對岸八里的窯烤香烤雞披薩，溫馨的在地人氣店。"
    },
    dir: "The Shack 野菇屋 八里",
    image: null
  },

  /* ---- More from the team's restaurant list. SKELETONS: fill in desc {en, zh},
   *      drop a photo at assets/img/<id>.jpg, and double-check the EN/中文 name
   *      pairing (a few are my best guess — marked "verify"). ---- */
  {
    id: "asahi-huuhu",
    icon: "🥤",
    name: { en: "Asahi Huuhu", zh: "朝日夫婦" },
    desc: { en: "", zh: "" },
    dir: "朝日夫婦 淡水",
    image: null
  },
  {
    id: "dark-palace",
    icon: "🍛",
    name: { en: "Dark Palace Taiwanese Gourmet", zh: "黑殿飯店（右岸店）" },
    desc: { en: "", zh: "" },
    dir: "黑殿飯店 八里",
    image: null
  },
  {
    id: "twentytwo-sandwiches",
    icon: "🥪",
    name: { en: "Twentytwo Sandwiches", zh: "歐式三明治" },   // verify pairing
    desc: { en: "", zh: "" },
    dir: "Twentytwo Sandwiches 淡水",
    image: null
  },
  {
    id: "kooks",
    icon: "🍴",
    name: { en: "Kooks", zh: "異嗑堂（淡水店）" },             // verify pairing
    desc: { en: "", zh: "" },
    dir: "異嗑堂 淡水",
    image: null
  },
  {
    id: "hooked-burger",
    icon: "🍔",
    name: { en: "Hooked Burger", zh: "Hooked Burger" },        // add 中文 name
    desc: { en: "", zh: "" },
    dir: "Hooked Burger 淡水",
    image: null
  },
  {
    id: "bar-salix",
    icon: "🍸",
    name: { en: "Bar Salix", zh: "Bar Salix" },                // add 中文 name
    desc: { en: "", zh: "" },
    dir: "Bar Salix 淡水",
    image: null
  },
  {
    id: "la-villa-danshui",
    icon: "🍽️",
    name: { en: "La Villa Danshui", zh: "La Villa Danshui" },  // add 中文 name
    desc: { en: "", zh: "" },
    dir: "La Villa Danshui 淡水",
    image: null
  },
  {
    id: "tonsho-ramen",
    icon: "🍜",
    name: { en: "Tonsho Japanese Ramen", zh: "豚將日式拉麵（淡水店）" },  // verify EN name
    desc: { en: "", zh: "" },
    dir: "豚將拉麵 淡水",
    image: null
  },
  {
    id: "jiuwang-ice",
    icon: "🧋",
    name: { en: "Jiuwang Ice Room", zh: "九旺冰室" },           // verify EN name
    desc: { en: "", zh: "" },
    dir: "九旺冰室 淡水",
    image: null
  },
  {
    id: "shanlou",
    icon: "🍢",
    name: { en: "Shanlou", zh: "煽樓" },                        // verify EN name
    desc: { en: "", zh: "" },
    dir: "煽樓 淡水",
    image: null
  }
];
