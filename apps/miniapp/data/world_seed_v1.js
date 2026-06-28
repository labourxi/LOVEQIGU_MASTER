// ═════════════════════════════════════════════════════════════════════
// world_seed_v1.js
//
// SINGLE SOURCE OF TRUTH — LOVEQIGU world seed data.
//
// This is a .js module (not .json) because WeChat Mini Program
// require() does NOT support .json files outside the project package.
//
// Canonical data mirror: /data/world_seed_v1.json (legacy, deleted).
// ═════════════════════════════════════════════════════════════════════

module.exports = {
  "meta": {
    "version": "v1",
    "title": "LOVEQIGU World Seed",
    "world": "爱企谷 · 游离之域",
    "visual_language": "Eastern poetic minimal / mist-ink-gold / stone-green",
    "purpose": "UI validation only — no production content system"
  },

  "explore_points": [
    {
      "id": "AQG_01",
      "name": "四象入口",
      "subtitle": "初入之境",
      "description": "雾起之地，入口如封印展开。四象石柱分立两侧，地面刻痕隐现金色微光。",
      "themeColor": "#C8A24A",
      "atmosphere": "mist / stone gate / soft gold light",
      "location": "入口广场",
      "decorativeGroup": "origin",
      "related_ids": ["relic_aqg_01", "coupon_aqg_cafe_tea", "col_aqg_poster"]
    },
    {
      "id": "AQG_02",
      "name": "雾林",
      "subtitle": "迷途之境",
      "description": "林间白雾缭绕，古木虬枝如墨笔勾勒。远处有鸟鸣，近处有苔痕。",
      "themeColor": "#4A7C6B",
      "atmosphere": "mist / ancient trees / moss stone",
      "location": "爱企谷林区",
      "decorativeGroup": "journey",
      "related_ids": ["relic_aqg_02", "col_aqg_photo_frame"]
    },
    {
      "id": "AQG_03",
      "name": "石径",
      "subtitle": "蜿蜒之途",
      "description": "青石板路蜿蜒而上，两侧石灯静立。每一步踏下，石面似有回响。",
      "themeColor": "#8A9A9E",
      "atmosphere": "stone path / lantern light / twilight",
      "location": "爱企谷步道",
      "decorativeGroup": "journey",
      "related_ids": ["relic_aqg_03", "coupon_aqg_bookstore_mark"]
    },
    {
      "id": "AQG_04",
      "name": "回声台",
      "subtitle": "音痕之地",
      "description": "圆形石台，中央有一方凹痕。站在其上发声，四壁回响如古钟余韵。",
      "themeColor": "#A8C8D8",
      "atmosphere": "round stone / echo ripple / pale blue",
      "location": "爱企谷中庭",
      "decorativeGroup": "journey",
      "related_ids": ["relic_aqg_04", "col_aqg_social_card"]
    },
    {
      "id": "AQG_05",
      "name": "祈愿台",
      "subtitle": "望星之所",
      "description": "高台之上，独对苍穹。地面刻有北斗七星，台角悬有古铜风铃。",
      "themeColor": "#7f4f24",
      "atmosphere": "open platform / star map / bronze bell / night wind",
      "location": "爱企谷天台",
      "decorativeGroup": "echo",
      "related_ids": ["relic_aqg_05"]
    },
    {
      "id": "AQG_06",
      "name": "残卷阁",
      "subtitle": "藏文之所",
      "description": "半露天竹阁，案上散落古卷残页。墨迹已淡，字迹仍可辨。",
      "themeColor": "#D4B878",
      "atmosphere": "bamboo pavilion / ancient scrolls / ink trace",
      "location": "爱企谷竹阁",
      "decorativeGroup": "echo",
      "related_ids": ["relic_aqg_06", "col_aqg_memory_scroll", "coupon_aqg_craft_stamp"]
    },
    {
      "id": "AQG_07",
      "name": "星痕池",
      "subtitle": "映天之镜",
      "description": "一池静水，池底铺满黑色卵石。入夜时分，星辰倒映其中，如光点沉入水底。",
      "themeColor": "#6B8E9B",
      "atmosphere": "still water / star reflection / dark stone / night glow",
      "location": "爱企谷池苑",
      "decorativeGroup": "echo",
      "related_ids": ["relic_aqg_07", "col_aqg_star_map", "coupon_aqg_stargazer_map"]
    },
    {
      "id": "AQG_08",
      "name": "风语桥",
      "subtitle": "过风之处",
      "description": "木桥横跨浅溪，两侧系有素白布条。风过时布条轻扬，发出低语般的沙沙声。",
      "themeColor": "#BDAA8A",
      "atmosphere": "wooden bridge / white cloth / wind whisper / stream",
      "location": "爱企谷溪径",
      "decorativeGroup": "climax",
      "related_ids": ["relic_aqg_08", "col_aqg_invite_card"]
    },
    {
      "id": "AQG_09",
      "name": "旧忆碑林",
      "subtitle": "遗刻之园",
      "description": "数十块古碑错落而立，碑文风化过半。指尖抚过刻痕，似能感知旧时回响。",
      "themeColor": "#5C6B5A",
      "atmosphere": "stone steles / weathered carvings / moss / memory glow",
      "location": "爱企谷碑园",
      "decorativeGroup": "climax",
      "related_ids": []
    },
    {
      "id": "AQG_10",
      "name": "归真之门",
      "subtitle": "终见之地",
      "description": "两柱之间，空无一物。光从柱间倾泻而下，如一道无形的门扉。跨过即是归处。",
      "themeColor": "#E8D8B4",
      "atmosphere": "stone pillars / light gate / transcendence / gold haze",
      "location": "爱企谷终点",
      "decorativeGroup": "void",
      "related_ids": ["coupon_aqg_gate_pin"]
    }
  ],

  "relics": [
    {
      "id": "relic_aqg_01",
      "name": "四象残片",
      "phenomenon": "入口印记",
      "emotion": "被封印的门唤醒了记忆",
      "material": "jade",
      "color": "#C8A24A",
      "symbol": "启",
      "occurrence_context": "入口广场·地面",
      "origin_point": "AQG_01",
      "location": "四象入口",
      "personality": { "tone": "warm", "emotionalBias": "echo", "resonance": "mid" },
      "bias": { "accuracy": "medium", "distortion": "location_shifted" },
      "awareness": { "userDetected": true, "reactionLevel": "reactive" },
      "related_ids": ["AQG_01", "col_aqg_poster", "coupon_aqg_cafe_tea"]
    },
    {
      "id": "relic_aqg_02",
      "name": "雾中木痕",
      "phenomenon": "林雾印记",
      "emotion": "树影深处有未名的注视",
      "material": "wood",
      "color": "#4A7C6B",
      "symbol": "木",
      "occurrence_context": "雾林·古木下",
      "origin_point": "AQG_02",
      "location": "雾林",
      "personality": { "tone": "soft", "emotionalBias": "longing", "resonance": "low" },
      "bias": { "accuracy": "low", "distortion": "time_shifted" },
      "awareness": { "userDetected": true, "reactionLevel": "subtle" },
      "related_ids": ["AQG_02", "col_aqg_photo_frame"]
    },
    {
      "id": "relic_aqg_03",
      "name": "石中星痕",
      "phenomenon": "石径回响",
      "emotion": "古老的脚步仍在回响",
      "material": "stone",
      "color": "#8A9A9E",
      "symbol": "石",
      "occurrence_context": "石径·青石板下",
      "origin_point": "AQG_03",
      "location": "石径",
      "personality": { "tone": "neutral", "emotionalBias": "silence", "resonance": "mid" },
      "bias": { "accuracy": "high", "distortion": "none" },
      "awareness": { "userDetected": true, "reactionLevel": "stable" },
      "related_ids": ["AQG_03", "coupon_aqg_bookstore_mark"]
    },
    {
      "id": "relic_aqg_04",
      "name": "风中回响",
      "phenomenon": "回声印记",
      "emotion": "空气仍在振动",
      "material": "silk",
      "color": "#A8C8D8",
      "symbol": "风",
      "occurrence_context": "回声台·凹痕中",
      "origin_point": "AQG_04",
      "location": "回声台",
      "personality": { "tone": "soft", "emotionalBias": "echo", "resonance": "high" },
      "bias": { "accuracy": "medium", "distortion": "location_shifted" },
      "awareness": { "userDetected": true, "reactionLevel": "aware" },
      "related_ids": ["AQG_04", "col_aqg_social_card"]
    },
    {
      "id": "relic_aqg_05",
      "name": "未亮心愿",
      "phenomenon": "祈愿印记",
      "emotion": "星辰仍未回应",
      "material": "bronze",
      "color": "#7f4f24",
      "symbol": "愿",
      "occurrence_context": "祈愿台·北斗星刻",
      "origin_point": "AQG_05",
      "location": "祈愿台",
      "personality": { "tone": "heavy", "emotionalBias": "longing", "resonance": "mid" },
      "bias": { "accuracy": "unstable", "distortion": "identity_shifted" },
      "awareness": { "userDetected": true, "reactionLevel": "reactive" },
      "related_ids": ["AQG_05"]
    },
    {
      "id": "relic_aqg_06",
      "name": "墨中残章",
      "phenomenon": "残卷印记",
      "emotion": "文字尚未完整",
      "material": "ink",
      "color": "#D4B878",
      "symbol": "卷",
      "occurrence_context": "残卷阁·案上",
      "origin_point": "AQG_06",
      "location": "残卷阁",
      "personality": { "tone": "fragmented", "emotionalBias": "confusion", "resonance": "low" },
      "bias": { "accuracy": "low", "distortion": "identity_shifted" },
      "awareness": { "userDetected": true, "reactionLevel": "subtle" },
      "related_ids": ["AQG_06", "col_aqg_memory_scroll", "coupon_aqg_craft_stamp"]
    },
    {
      "id": "relic_aqg_07",
      "name": "水中星碎",
      "phenomenon": "星痕印记",
      "emotion": "光点正在下沉",
      "material": "light",
      "color": "#6B8E9B",
      "symbol": "星",
      "occurrence_context": "星痕池·水面下",
      "origin_point": "AQG_07",
      "location": "星痕池",
      "personality": { "tone": "soft", "emotionalBias": "silence", "resonance": "high" },
      "bias": { "accuracy": "high", "distortion": "time_shifted" },
      "awareness": { "userDetected": true, "reactionLevel": "aware" },
      "related_ids": ["AQG_07", "col_aqg_star_map", "coupon_aqg_stargazer_map"]
    },
    {
      "id": "relic_aqg_08",
      "name": "风过留痕",
      "phenomenon": "风语印记",
      "emotion": "布条仍在低语",
      "material": "silk",
      "color": "#BDAA8A",
      "symbol": "语",
      "occurrence_context": "风语桥·布条上",
      "origin_point": "AQG_08",
      "location": "风语桥",
      "personality": { "tone": "warm", "emotionalBias": "protection", "resonance": "mid" },
      "bias": { "accuracy": "medium", "distortion": "none" },
      "awareness": { "userDetected": true, "reactionLevel": "reactive" },
      "related_ids": ["AQG_08", "col_aqg_invite_card"]
    }
  ],

  "collectibles": [
    {
      "id": "col_aqg_poster",
      "title": "爱企谷探索海报",
      "role": "探索旅程的视觉记录",
      "display_context": "分享传播",
      "copy": "记录你在爱企谷的探索轨迹，与朋友分享这片游离之域。",
      "next_path": "/pages/next-activity/index",
      "related_ids": ["relic_aqg_01", "AQG_01", "merchant_aqg_cafe"]
    },
    {
      "id": "col_aqg_photo_frame",
      "title": "雾林相框",
      "role": "场域记念影像",
      "display_context": "个人收藏",
      "copy": "雾林深处的光影，定格在古木与苔痕之间。",
      "next_path": "/pages/next-activity/index",
      "related_ids": ["relic_aqg_02", "AQG_02", "merchant_aqg_bookstore"]
    },
    {
      "id": "col_aqg_social_card",
      "title": "回声社交卡",
      "role": "印记社交分享",
      "display_context": "社交入口",
      "copy": "你在回声台留下的声音，成为可以传递的记忆碎片。",
      "next_path": "/pages/next-activity/index",
      "related_ids": ["relic_aqg_04", "AQG_04", "merchant_aqg_craft"]
    },
    {
      "id": "col_aqg_invite_card",
      "title": "归途邀请卡",
      "role": "好友回访邀请",
      "display_context": "回访分享",
      "copy": "邀请朋友一同跨越归真之门，完成探索旅程。",
      "next_path": "/pages/next-activity/index",
      "related_ids": ["relic_aqg_08", "AQG_08", "merchant_aqg_gate"]
    },
    {
      "id": "col_aqg_star_map",
      "title": "星痕图鉴",
      "role": "星图收藏记念",
      "display_context": "收藏展示",
      "copy": "星痕池中的倒影被永远保存，成为你与这片土地的连接。",
      "next_path": "/pages/next-activity/index",
      "related_ids": ["relic_aqg_07", "AQG_07", "merchant_aqg_cafe"]
    },
    {
      "id": "col_aqg_memory_scroll",
      "title": "残卷复刻本",
      "role": "文化记忆留存",
      "display_context": "文化传播",
      "copy": "残卷阁中的墨迹片段被拓印下来，成为可携带的记忆。",
      "next_path": "/pages/next-activity/index",
      "related_ids": ["relic_aqg_06", "AQG_06", "merchant_aqg_bookstore"]
    }
  ],

  "merchant_coupons": [
    {
      "id": "coupon_aqg_cafe_tea",
      "merchant_id": "merchant_aqg_cafe",
      "merchant_name": "爱企谷茶舍",
      "title": "桂花酿茶券",
      "description": "探索之后，凭此券在茶舍换一杯暖茶。",
      "benefit_value": "限时免费兑换",
      "related_ids": ["AQG_01", "relic_aqg_01", "col_aqg_poster"]
    },
    {
      "id": "coupon_aqg_bookstore_mark",
      "merchant_id": "merchant_aqg_bookstore",
      "merchant_name": "爱企谷书驿",
      "title": "书页书签券",
      "description": "在书驿领取独家设计书签一枚，记录你的探索篇章。",
      "benefit_value": "限量领取",
      "related_ids": ["AQG_03", "relic_aqg_03", "col_aqg_photo_frame"]
    },
    {
      "id": "coupon_aqg_craft_stamp",
      "merchant_id": "merchant_aqg_craft",
      "merchant_name": "爱企谷手作坊",
      "title": "手作印章体验券",
      "description": "在手作坊体验亲手制作一枚古法印章，刻下你的印记。",
      "benefit_value": "预约体验",
      "related_ids": ["AQG_06", "relic_aqg_06", "col_aqg_memory_scroll"]
    },
    {
      "id": "coupon_aqg_gate_pin",
      "merchant_id": "merchant_aqg_gate",
      "merchant_name": "归真之门驿站",
      "title": "归途纪念徽章券",
      "description": "完成探索后领取专属纪念徽章，象征跨越归真之门。",
      "benefit_value": "完整体验兑换",
      "related_ids": ["AQG_10", "col_aqg_invite_card"]
    },
    {
      "id": "coupon_aqg_stargazer_map",
      "merchant_id": "merchant_aqg_cafe",
      "merchant_name": "爱企谷茶舍",
      "title": "星图明信片券",
      "description": "以星痕池为灵感设计的星图明信片，寄给未来的自己。",
      "benefit_value": "消费满赠",
      "related_ids": ["AQG_07", "relic_aqg_07", "col_aqg_star_map"]
    }
  ],

  "routes": [
    {
      "id": "route_aqg_main",
      "name": "爱企谷探索主线",
      "description": "从四象入口出发，穿过雾林与石径，抵达归真之门。",
      "origin": "AQG_01",
      "destination": "AQG_10",
      "waypoints": ["AQG_02", "AQG_03", "AQG_04", "AQG_05", "AQG_06", "AQG_07", "AQG_08", "AQG_09"],
      "visual_theme": "golden path / mist thinning / light intensifying",
      "estimated_time": "60–90分钟",
      "related_ids": ["relic_aqg_01", "relic_aqg_02", "relic_aqg_03", "relic_aqg_04", "relic_aqg_05", "relic_aqg_06", "relic_aqg_07", "relic_aqg_08", "coupon_aqg_gate_pin"]
    },
    {
      "id": "route_aqg_echo",
      "name": "回响支线",
      "description": "专注于回声台与残卷阁的回响体验，感受声音与文字的记忆。",
      "origin": "AQG_04",
      "destination": "AQG_06",
      "waypoints": ["AQG_05"],
      "visual_theme": "ripple / ink swirl / soft vibration",
      "estimated_time": "20–30分钟",
      "related_ids": ["relic_aqg_04", "relic_aqg_06", "col_aqg_social_card", "col_aqg_memory_scroll"]
    },
    {
      "id": "route_aqg_stargaze",
      "name": "观星支线",
      "description": "从祈愿台到星痕池，在夜空下感受星辰与倒影的对话。",
      "origin": "AQG_05",
      "destination": "AQG_07",
      "waypoints": [],
      "visual_theme": "night sky / water reflection / starlight",
      "estimated_time": "15–20分钟",
      "related_ids": ["relic_aqg_05", "relic_aqg_07", "col_aqg_star_map", "coupon_aqg_stargazer_map"]
    }
  ]
};
