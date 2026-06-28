const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');

// ═══════════════════════════════════════════
// V5.4.10 — World Seed Consumer
// SINGLE source: apps/miniapp/data/world_seed_v1.js via app.globalData.worldSeed
// ═══════════════════════════════════════════

function getWorldSeed() {
  try {
    var app = typeof getApp !== 'undefined' ? getApp() : null;
    return (app && app.globalData && app.globalData.worldSeed) || null;
  } catch (e) { return null; }
}

function buildPageData() {
  var seed = getWorldSeed();
  if (!seed || !seed.relics || seed.relics.length < 4) {
    return {
      title: '印记册',
      activeTab: 'relic',
      progress: { collected: 0, total: 0 },
      groups: [],
      boundary: '信物是故事进度资产，数字藏品是传播资产，二者不可混用。',
      focusedRelic: null,
      colCount: 3
    };
  }

  var relics = seed.relics;
  var collected = relics.length;

  var groupMap = {};
  for (var i = 0; i < relics.length; i++) {
    var r = relics[i];
    var pointId = r.origin_point || 'unknown';
    if (!groupMap[pointId]) {
      groupMap[pointId] = { scenicId: pointId, scenicName: r.location || pointId, relics: [], collected: 0, total: 0 };
    }
    groupMap[pointId].relics.push({
      id: r.id,
      name: r.name,
      chapter: r.location || '',
      status: '已收藏',
      collected: true,
      description: r.emotion || '',
      awarenessLine: '',
      related_ids: r.related_ids || []
    });
    groupMap[pointId].collected++;
    groupMap[pointId].total++;
  }

  var groups = [];
  for (var key in groupMap) {
    if (groupMap.hasOwnProperty(key)) {
      var g = groupMap[key];
      g.album = {
        colCount: 3,
        ownedCount: g.collected,
        pendingTotal: 0,
        totalRelics: g.total,
        isEmptyOwned: false,
        emptyState: null,
        visibleSlots: g.relics.map(function(r) {
          return { kind: 'owned', key: r.id, id: r.id, name: r.name, chapter: r.chapter, collected: true, highlighted: false, related_ids: r.related_ids };
        }),
        teaserSlots: [],
        foldedPendingCount: 0,
        remainingPendingCount: 0,
        showFold: false,
        showExpandAll: false,
        expandedPendingSlots: []
      };
      groups.push(g);
    }
  }

  return {
    title: '印记册',
    activeTab: 'relic',
    progress: { collected: collected, total: relics.length },
    groups: groups,
    boundary: '信物是故事进度资产，数字藏品是传播资产，二者不可混用。',
    focusedRelic: null,
    colCount: 3
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction],
  data: buildPageData(),

  onLoad(options) {
    this.setData(buildPageData());
  },

  onClearFocus() {
    this.setData(buildPageData());
  },

  onOpenStarMap() { this.showFallbackToast('功能开发中'); },
  onOpenMeridianMap() { this.showFallbackToast('功能开发中'); },
  onOpenRelic() { this.showFallbackToast('功能开发中'); },
  onSlotTap() { this.showFallbackToast('功能开发中'); },
  onTogglePending() {},

  onContinueExplore() {
    this.safeNavigate('/pages/explore-map/index', { fallbackTitle: '探索地图暂未开放' });
  },

  onBottomNavChange() {}
});
