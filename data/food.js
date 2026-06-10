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
  }
];
