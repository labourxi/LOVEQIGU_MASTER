// ═════════════════════════════════════════════════════════════════════
// World Seed V2 — Backend Sync Bridge
//
// This file is GENERATED from the admin backend data.
// To regenerate:
//   1. Open the admin backend: apps/admin/platform-admin/platform_exploration_points/index.html
//   2. Click "导出当前数据"
//   3. Convert the exported JSON to this format
//
// RUNTIME:
//   - EXPLORE_WORLD_SEED in content/world/explore_world_seed.js
//     provides narrative enrichment (storyFragment, emotionalNarrative, etc.)
//   - This file provides the structural seed data (which points exist, their bindings)
//
// Data source: LQGAdapterSession.explorationPoints + relics + blessingContents + arContents
// ═════════════════════════════════════════════════════════════════════

(function (global) {
  var seed = {

    // ─── Meta ───
    _meta: {
      version: "V2.0.0",
      exportedAt: "",
      source: "backend_sync",
      migrationNote: "Generated from admin backend exploration points CRUD"
    },

    // ─── Explore Points (10+ hard seed guarantee) ───
    explore_points: [
      { id: "AQG_01", name: "四象入口", subtitle: "初入之境", description: "雾起之地，入口如封印展开。四象石柱分立两侧，地面刻痕隐现金色微光。", themeColor: "#C8A24A", atmosphere: "mist / stone gate / soft gold light", location: "入口广场", decorativeGroup: "origin" },
      { id: "AQG_02", name: "雾林", subtitle: "迷途之境", description: "雾在林间流动，古木参天，根系如经络般在地面蔓延。每一棵树的年轮里都藏着一缕未被唤醒的记忆。", themeColor: "#4A7C6B", atmosphere: "mist / ancient trees / soft green light", location: "爱企谷林区", decorativeGroup: "journey" },
      { id: "AQG_03", name: "石径", subtitle: "步履之境", description: "青石板铺成的小径蜿蜒向前，每一块石板都刻着不同的符号。岁月磨平了棱角，却未磨灭痕迹。", themeColor: "#8A9A9E", atmosphere: "stone / moss / quiet footsteps", location: "爱企谷步道", decorativeGroup: "journey" },
      { id: "AQG_04", name: "回声台", subtitle: "回响之境", description: "圆形石台中央有一道浅浅的凹痕，像是被什么声音震出的印记。站在台上，能听见风穿过石壁的回响。", themeColor: "#A8C8D8", atmosphere: "stone platform / wind echo / soft vibration", location: "爱企谷中心广场", decorativeGroup: "journey" },
      { id: "AQG_05", name: "祈愿台", subtitle: "星辰之境", description: "石台上刻着北斗七星的图案，每一颗星的位置都对应一个字的刻痕。台面中央有一枚未熄灭的香灰。", themeColor: "#7f4f24", atmosphere: "stone altar / starlight / incense", location: "爱企谷文化区", decorativeGroup: "echo" },
      { id: "AQG_06", name: "残卷阁", subtitle: "文字之境", description: "一间半塌的木阁，案上散落着残破的卷轴。墨迹已褪，但某些字句仍然可辨——它们在等一个能读懂的人。", themeColor: "#D4B878", atmosphere: "wood / old paper / fading ink", location: "爱企谷文化区", decorativeGroup: "echo" },
      { id: "AQG_07", name: "星痕池", subtitle: "星落之境", description: "一池静水，水面上仿佛漂浮着碎裂的星光。池底的石头排列成古老的星图，但大多已经偏移。", themeColor: "#6B8E9B", atmosphere: "still water / fractured starlight / submerged map", location: "爱企谷林区", decorativeGroup: "echo" },
      { id: "AQG_08", name: "风语桥", subtitle: "传信之境", description: "一座古朴的石桥横跨溪流，桥栏上系着许多褪色的布条。风过时，布条轻轻飘动，像是在传递什么消息。", themeColor: "#BDAA8A", atmosphere: "stone bridge / wind / fabric rustle", location: "爱企谷溪流区", decorativeGroup: "climax" },
      { id: "AQG_09", name: "旧忆碑林", subtitle: "记忆之境", description: "数十块石碑错落而立，每一块上都刻着不同的名字和日期。有些已经被藤蔓覆盖，有些仍然清晰。", themeColor: "#7A8A7A", atmosphere: "stone steles / vines / silent names", location: "爱企谷文化区", decorativeGroup: "climax" },
      { id: "AQG_10", name: "归真之门", subtitle: "归途之境", description: "一扇朴素的门立在径的尽头，门框上没有任何装饰。推开它，不是离开，而是回到开始的地方。", themeColor: "#C8A24A", atmosphere: "simple gate / golden light / return", location: "爱企谷出口区", decorativeGroup: "void" }
    ]
  };

  // Provide stable export
  seed.getPoint = function (id) {
    return seed.explore_points.find(function (p) { return p.id === id; }) || null;
  };

  seed.getAllPoints = function () {
    return seed.explore_points.slice();
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = seed;
  }
  global.WORLD_SEED_V2 = seed;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
