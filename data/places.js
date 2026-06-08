/* =============================================================================
 * places.js — the heart of the guide.
 * One source of truth for every spot shown on the map, the gem grid and the
 * recommender. Loaded as a plain <script> (sets window.PLACES) so the app also
 * works by double-clicking index.html (no fetch / no server required).
 *
 * Each place has:
 *   id        unique slug (must match ml/make_dataset.py if you retrain)
 *   name/blurb/whyGo  bilingual {en, zh-Hant}
 *   category  history | nature | culture | views | food | temple | bridge
 *   area      "tamsui" | "bali"
 *   crowd     baseline busyness: "high" | "medium" | "low"
 *   hotspot   true = an over-crowded spot we want to redirect people AWAY from
 *   featured  true = the star (Tamkang Bridge)
 *   vibe      tags the recommender matches against
 *   lat,lng   approximate coordinates (good enough to place the pin correctly)
 *   image     null, or "assets/img/<file>" — drop a photo in and it auto-shows
 *   hours     optional opening hours string
 *   model     attributes the crowd-prediction model uses (see ml/README.md):
 *               pop      base popularity 0–100 (how busy at its peak)
 *               pattern  daily rhythm: street | sunset | nature | indoor | temple | park
 *               weather  0–1 sensitivity to rain (outdoor high, indoor low)
 *               season   null, or [startMonth, endMonth] peak window (1–12)
 * ========================================================================== */
window.PLACES = [
  /* ---- The two over-crowded hotspots (we redirect FROM these) ----------- */
  {
    id: "old-street",
    name: { en: "Tamsui Old Street", zh: "淡水老街" },
    category: "food", area: "tamsui", crowd: "high", hotspot: true,
    vibe: ["food", "culture"],
    lat: 25.1693, lng: 121.4412, image: null,
    blurb: {
      en: "Tamsui's famous waterfront market street — snacks, souvenirs and shoulder-to-shoulder crowds, especially on weekends.",
      zh: "淡水著名的河岸商店街——小吃、伴手禮，以及摩肩接踵的人潮，週末尤其擁擠。"
    },
    whyGo: {
      en: "The classic first stop. Come early, grab an A-gei, then move on to the quieter gems nearby.",
      zh: "經典的第一站。建議早點來，吃份阿給，再前往附近更清幽的私房景點。"
    },
    model: { pop: 96, pattern: "street", weather: 0.5, season: null }
  },
  {
    id: "riverside",
    name: { en: "Tamsui Riverside (Golden Waterfront)", zh: "淡水金色水岸" },
    category: "views", area: "tamsui", crowd: "high", hotspot: true,
    vibe: ["views", "sunset"],
    lat: 25.1672, lng: 121.4389, image: null,
    blurb: {
      en: "The riverside promenade beside Old Street, packed at dusk for its golden river views.",
      zh: "老街旁的河濱步道，黃昏時為了金色河景而擠得水洩不通。"
    },
    whyGo: {
      en: "Lovely at sunset — but the very same sky is far calmer from Fisherman's Wharf or the new bridge.",
      zh: "黃昏很美——但在漁人碼頭或新淡江大橋看同一片夕陽，會清幽許多。"
    },
    model: { pop: 92, pattern: "sunset", weather: 0.7, season: null }
  },

  /* ---- The star: the new bridge (Objective 2) --------------------------- */
  {
    id: "tamkang-bridge",
    name: { en: "Tamkang Bridge (Danjiang Bridge)", zh: "淡江大橋" },
    category: "bridge", area: "tamsui", crowd: "low", featured: true,
    vibe: ["views", "sunset", "bridge"],
    lat: 25.1608, lng: 121.4052, image: null,
    blurb: {
      en: "The brand-new Zaha Hadid–designed bridge across the river mouth — the world's longest single-tower cable-stayed bridge, opened 12 May 2026.",
      zh: "全新落成、由札哈‧哈蒂（Zaha Hadid）設計的跨河口大橋——世界最長的單塔斜張橋，於2026年5月12日通車。"
    },
    whyGo: {
      en: "Walk or cycle across for jaw-dropping sunset views — and reach the peaceful Bali side in minutes.",
      zh: "步行或騎單車跨越，飽覽絕美夕陽——數分鐘即可抵達清幽的八里。"
    },
    model: { pop: 48, pattern: "sunset", weather: 0.6, season: null }
  },

  /* ---- Quiet gems, Tamsui side ----------------------------------------- */
  {
    id: "fort-san-domingo",
    name: { en: "Fort San Domingo", zh: "紅毛城" },
    category: "history", area: "tamsui", crowd: "medium",
    vibe: ["history", "views", "culture"],
    lat: 25.1756, lng: 121.4327, image: null,
    hours: "09:30–17:00 (closed Mondays)",
    blurb: {
      en: "A red-brick fort begun in 1628 and later held by the Dutch and British — Taiwan's most storied colonial landmark.",
      zh: "一座始建於1628年、後由荷蘭與英國接管的紅磚城堡——台灣最具故事性的殖民地標。"
    },
    whyGo: {
      en: "Sweeping river-mouth views and centuries of history, ten minutes uphill from the crush.",
      zh: "距離人潮僅十分鐘上坡，便能飽覽河口景致與數百年歷史。"
    },
    model: { pop: 56, pattern: "indoor", weather: 0.35, season: null }
  },
  {
    id: "hobe-fort",
    name: { en: "Hobe Fort", zh: "滬尾礮臺" },
    category: "history", area: "tamsui", crowd: "low",
    vibe: ["history", "quiet"],
    lat: 25.1795, lng: 121.4253, image: null,
    hours: "09:30–17:00 (closed Mondays)",
    blurb: {
      en: "A beautifully preserved 1880s coastal artillery fort tucked into greenery above the town.",
      zh: "一座保存完好的1880年代海岸礮臺，隱身於山林綠意之中。"
    },
    whyGo: {
      en: "Quiet ramparts, sea breezes and almost no one around — history without the queues.",
      zh: "寧靜的城垣、徐徐海風、幾乎不見人影——有歷史而無排隊之苦。"
    },
    model: { pop: 28, pattern: "indoor", weather: 0.4, season: null }
  },
  {
    id: "little-white-house",
    name: { en: "Little White House", zh: "小白宮" },
    category: "history", area: "tamsui", crowd: "low",
    vibe: ["history", "views", "quiet"],
    lat: 25.1729, lng: 121.4358, image: null,
    hours: "09:30–17:00 (closed Mondays)",
    blurb: {
      en: "A graceful whitewashed former customs residence (1870) with arched verandas and harbour views.",
      zh: "一棟優雅的白色前海關官邸（1870年），有著拱形迴廊與港口景致。"
    },
    whyGo: {
      en: "A photogenic, peaceful colonial villa that most day-trippers walk straight past.",
      zh: "上鏡又寧靜的殖民風別墅，多數一日遊旅客都匆匆錯過。"
    },
    model: { pop: 36, pattern: "indoor", weather: 0.3, season: null }
  },
  {
    id: "cloud-gate",
    name: { en: "Cloud Gate Theater", zh: "雲門劇場" },
    category: "culture", area: "tamsui", crowd: "low",
    vibe: ["art", "culture", "quiet", "nature"],
    lat: 25.1838, lng: 121.4302, image: null,
    blurb: {
      en: "The hillside home of Taiwan's world-famous Cloud Gate Dance Theatre, set among trees and lawns.",
      zh: "台灣享譽國際的雲門舞集所在地，坐落於山坡的樹林與草坪之間。"
    },
    whyGo: {
      en: "Open-air sculpture, forest paths and river views — a serene escape ten minutes from Old Street.",
      zh: "戶外雕塑、林間步道與河景——距老街十分鐘的寧靜天地。"
    },
    model: { pop: 26, pattern: "park", weather: 0.4, season: null }
  },
  {
    id: "aletheia",
    name: { en: "Aletheia University & Oxford College", zh: "真理大學與牛津學堂" },
    category: "culture", area: "tamsui", crowd: "low",
    vibe: ["history", "culture", "quiet"],
    lat: 25.1763, lng: 121.4308, image: null,
    blurb: {
      en: "A historic Christian college (1882) with a stunning chapel and Taiwan's first Western-style schoolhouse, Oxford College.",
      zh: "一所歷史悠久的基督教學院（1882年），擁有壯麗教堂，以及台灣第一所西式學堂——牛津學堂。"
    },
    whyGo: {
      en: "One of Taiwan's prettiest campuses — free to wander and blissfully uncrowded on weekdays.",
      zh: "台灣最美的校園之一——可自由漫步，平日清幽宜人。"
    },
    model: { pop: 32, pattern: "park", weather: 0.35, season: null }
  },
  {
    id: "tamkang-high",
    name: { en: "Tamkang High School", zh: "淡江中學" },
    category: "culture", area: "tamsui", crowd: "low",
    vibe: ["culture", "history"],
    lat: 25.1779, lng: 121.4332, image: null,
    blurb: {
      en: "A historic school with a landmark octagonal tower, famous as the setting of Jay Chou's film “Secret”.",
      zh: "一所歷史悠久的中學，以八角塔聞名，是周杰倫電影《不能說的祕密》的取景地。"
    },
    whyGo: {
      en: "A nostalgic, leafy campus for fans and photographers — visit quietly and respect school hours.",
      zh: "充滿懷舊氣息的綠蔭校園，適合影迷與攝影者——請輕聲參觀，並尊重校園作息。"
    },
    model: { pop: 30, pattern: "park", weather: 0.35, season: null }
  },
  {
    id: "shi-mansion",
    name: { en: "Shi Family Mansion", zh: "施家古厝" },
    category: "history", area: "tamsui", crowd: "low",
    vibe: ["history", "culture", "quiet"],
    lat: 25.1718, lng: 121.4385, image: null,
    blurb: {
      en: "A century-old traditional courtyard house, a quiet relic of old Tamsui hidden just above the bustle.",
      zh: "一座百年三合院古厝，是隱身於喧囂之上、淡水昔日的靜謐遺跡。"
    },
    whyGo: {
      en: "A genuine hidden gem — traditional architecture with hardly another visitor in sight.",
      zh: "名副其實的私房景點——傳統建築之美，幾乎不見其他遊客。"
    },
    model: { pop: 16, pattern: "indoor", weather: 0.3, season: null }
  },
  {
    id: "mangrove",
    name: { en: "Hongshulin Mangrove Reserve", zh: "紅樹林生態保護區" },
    category: "nature", area: "tamsui", crowd: "low",
    vibe: ["nature", "family", "quiet"],
    lat: 25.1547, lng: 121.4592, image: null,
    blurb: {
      en: "A protected estuary of water mangroves with a boardwalk trail full of fiddler crabs and birdlife.",
      zh: "一片受保護的水筆仔紅樹林河口，木棧道上滿是招潮蟹與豐富鳥類生態。"
    },
    whyGo: {
      en: "A flat, breezy nature walk right by an MRT stop — perfect for families, never crowded.",
      zh: "緊鄰捷運站、平坦舒爽的自然步道——適合親子，且從不擁擠。"
    },
    model: { pop: 30, pattern: "nature", weather: 0.6, season: null }
  },
  {
    id: "tianyuan",
    name: { en: "Tianyuan Temple", zh: "淡水天元宮" },
    category: "temple", area: "tamsui", crowd: "medium",
    vibe: ["temple", "nature", "views"],
    lat: 25.1958, lng: 121.4759, image: null,
    blurb: {
      en: "A grand multi-storey temple up in the hills, famous nationwide for its cherry blossoms in spring.",
      zh: "坐落山中的宏偉多層寶塔廟宇，以春季櫻花聞名全台。"
    },
    whyGo: {
      en: "Serene most of the year — visit on a weekday, or brave the glorious (busy) blossom season in Feb–Mar.",
      zh: "一年中大多時候十分清幽——可挑平日前往，或在二、三月迎接絢爛（但擁擠）的櫻花季。"
    },
    model: { pop: 40, pattern: "temple", weather: 0.5, season: [2, 3] }
  },
  {
    id: "fishermans-wharf",
    name: { en: "Fisherman's Wharf & Lover's Bridge", zh: "漁人碼頭與情人橋" },
    category: "views", area: "tamsui", crowd: "medium",
    vibe: ["views", "sunset", "family"],
    lat: 25.1828, lng: 121.4106, image: null,
    blurb: {
      en: "A breezy harbour with a marina, boardwalks and the white Lover's Bridge — Tamsui's classic sunset spot.",
      zh: "一座清風徐徐的港灣，有遊艇碼頭、木棧道與白色情人橋——淡水經典的夕陽勝地。"
    },
    whyGo: {
      en: "Wide-open space that soaks up the crowds — the same famous sunset, with room to breathe.",
      zh: "開闊的空間能消化人潮——同樣著名的夕陽，卻多了從容呼吸的空間。"
    },
    model: { pop: 72, pattern: "sunset", weather: 0.6, season: null }
  },

  /* ---- Across the new bridge: the under-touristed Bali side ------------- */
  {
    id: "bali-old-street",
    name: { en: "Bali Old Street", zh: "八里老街" },
    category: "food", area: "bali", crowd: "medium",
    vibe: ["food", "culture", "family"],
    lat: 25.1512, lng: 121.4088, image: null,
    blurb: {
      en: "A laid-back riverside old street across the water, known for arcades, snacks and twin-yolk taro balls.",
      zh: "河對岸悠閒的河濱老街，以拱廊、小吃與雙胞胎、芋圓聞名。"
    },
    whyGo: {
      en: "All the old-street charm with a fraction of the crowds — now minutes away via the new bridge.",
      zh: "擁有老街的全部魅力，人潮卻只剩零頭——如今經由新大橋僅數分鐘可達。"
    },
    model: { pop: 46, pattern: "street", weather: 0.5, season: null }
  },
  {
    id: "bali-left-bank",
    name: { en: "Bali Left Bank Park", zh: "八里左岸公園" },
    category: "nature", area: "bali", crowd: "low",
    vibe: ["nature", "views", "family"],
    lat: 25.1535, lng: 121.4075, image: null,
    blurb: {
      en: "A green riverside park and bike path with open lawns and the best views back toward Tamsui.",
      zh: "一座河濱綠地公園與自行車道，有開闊草坪及回望淡水的最佳視野。"
    },
    whyGo: {
      en: "Rent a bike, picnic on the grass, and watch the sunset light up the new bridge — crowd-free.",
      zh: "租台單車、在草地野餐，看夕陽點亮新大橋——遠離人潮。"
    },
    model: { pop: 36, pattern: "park", weather: 0.6, season: null }
  },
  {
    id: "shihsanhang",
    name: { en: "Shihsanhang Museum of Archaeology", zh: "十三行博物館" },
    category: "culture", area: "bali", crowd: "low",
    vibe: ["culture", "history", "family"],
    lat: 25.1641, lng: 121.4038, image: null,
    hours: "09:30–17:00 (closed Mondays)",
    blurb: {
      en: "A striking modern museum on the Bali shore preserving the 1,800-year-old Shihsanhang Iron Age culture.",
      zh: "八里岸邊一座造型獨特的現代博物館，保存著1800年前的十三行鐵器時代文化。"
    },
    whyGo: {
      en: "Award-winning architecture and Taiwan's prehistory, indoors and rain-proof — and almost tourist-free.",
      zh: "屢獲殊榮的建築與台灣史前文化，室內不怕雨——且幾乎沒有觀光客。"
    },
    model: { pop: 30, pattern: "indoor", weather: 0.15, season: null }
  }
];
