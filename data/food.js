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
    desc: {
      en: "A beloved riverside drinks stand famed for golden-hour views — grab a zingy calamansi soda or sea-salt coffee and watch the sunset.",
      zh: "深受喜愛的河畔飲品攤，以黃昏美景聞名——點杯沁涼的金桔氣泡飲或海鹽咖啡，靜看夕陽西下。"
    },
    dir: "朝日夫婦 淡水",
    image: null
  },
  {
    id: "dark-palace",
    icon: "🍛",
    name: { en: "Dark Palace Taiwanese Gourmet", zh: "黑殿飯店（右岸店）" },
    desc: {
      en: "A hearty Taiwanese diner known for its crispy pork-chop rice and late-night comfort classics — now on the Bali side.",
      zh: "份量十足的台式飯館，以酥香排骨飯與深夜療癒小吃聞名——如今在八里右岸也吃得到。"
    },
    dir: "黑殿飯店 八里",
    image: null
  },
  {
    id: "twentytwo-sandwiches",
    icon: "🥪",
    name: { en: "Twentytwo Sandwiches", zh: "歐式三明治" },   // verify pairing
    desc: {
      en: "Generous European-style sandwiches stacked with fresh fillings — a perfect grab-and-go brunch before the riverside.",
      zh: "用料豐富的歐式三明治，夾滿新鮮餡料——是漫步河岸前最對味的外帶早午餐。"
    },
    dir: "Twentytwo Sandwiches 淡水",
    image: null
  },
  {
    id: "kooks",
    icon: "🍴",
    name: { en: "Kooks", zh: "異嗑堂（淡水店）" },             // verify pairing
    desc: {
      en: "A cosy Tamsui bistro popular with students for its big, creative plates of Taiwanese-Western comfort food.",
      zh: "溫馨的淡水小餐館，以份量大、創意十足的台式西餐療癒料理深受學生喜愛。"
    },
    dir: "異嗑堂 淡水",
    image: null
  },
  {
    id: "hooked-burger",
    icon: "🍔",
    name: { en: "Hooked Burger", zh: "Hooked Burger" },
    desc: {
      en: "Juicy handmade burgers with thick patties and loaded toppings — a satisfying break from the street snacks.",
      zh: "多汁的手作漢堡，厚實肉排搭配滿滿配料——是逛累小吃後最過癮的選擇。"
    },
    dir: "Hooked Burger 淡水",
    image: null
  },
  {
    id: "bar-salix",
    icon: "🍸",
    name: { en: "Bar Salix", zh: "煽樓" },
    desc: {
      en: "A laid-back bar and grill for an evening drink and small bites once the day-trippers have headed home.",
      zh: "悠閒的小酒館與燒烤，待一日遊人潮散去後，最適合來杯小酒配點心。"
    },
    dir: "煽樓 淡水",
    image: null
  },
  {
    id: "la-villa-danshui",
    icon: "🍽️",
    name: { en: "La Villa Danshui", zh: "La Villa Danshui" },
    desc: {
      en: "A relaxed Western restaurant for pasta, pizza and a glass of wine — a calmer sit-down option away from the crowds.",
      zh: "輕鬆的西式餐廳，供應義大利麵、披薩與紅酒——遠離人潮、可坐下慢食的好去處。"
    },
    dir: "La Villa Danshui 淡水",
    image: null
  },
  {
    id: "tonsho-ramen",
    icon: "🍜",
    name: { en: "Tonsho Japanese Ramen", zh: "豚將日式拉麵（淡水店）" },  // verify EN name
    desc: {
      en: "Rich, slow-simmered tonkotsu ramen with springy noodles and melt-in-the-mouth pork — proper Japanese comfort in a bowl.",
      zh: "熬煮多時的濃郁豚骨拉麵，搭配彈牙麵條與入口即化的叉燒——一碗道地的日式療癒。"
    },
    dir: "豚將拉麵 淡水",
    image: null
  },
  {
    id: "jiuwang-ice",
    icon: "🧋",
    name: { en: "Jiuwang Ice Room", zh: "九旺冰室" },           // verify EN name
    desc: {
      en: "A Hong-Kong-style ice room for silky milk tea, pineapple buns and shaved-ice desserts to beat the Tamsui heat.",
      zh: "港式冰室，供應絲滑奶茶、菠蘿油與綿綿剉冰——消解淡水暑氣的最佳去處。"
    },
    dir: "九旺冰室 淡水",
    image: null
  }
];
