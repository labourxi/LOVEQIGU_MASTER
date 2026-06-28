const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');

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
  try {
    var seed = getWorldSeed();
    if (!seed) return null;

    var points = seed.explore_points || [];
    var relics = seed.relics || [];
    var coupons = seed.merchant_coupons || [];
    var routes = seed.routes || [];
    var collectibles = seed.collectibles || [];

    var decoratedPoints = points.map(function(p, idx) {
      return {
        point_id: p.id,
        point_name: p.name,
        isLit: idx < 3,
        isNext: idx === 0,
        state: idx < 3 ? 'lit' : idx === 0 ? 'next' : 'dim',
        statusLabel: idx < 3 ? '已点亮' : '待探索',
        hint: idx < 3 ? '印记已显现' : idx === 0 ? '建议从这里继续前行' : '等待你的脚步',
        related_ids: p.related_ids || [],
        related_relic: relics.find(function(r) { return r.origin_point === p.id; }) || null
      };
    });

    var graphNodes = decoratedPoints.map(function(item) {
      return {
        point_id: item.point_id,
        point_name: item.point_name,
        isLit: item.isLit,
        isNext: item.isNext,
        state: item.state,
        hint: item.hint,
        statusLabel: item.statusLabel
      };
    });

    var recommendedPoint = decoratedPoints.length > 0 ? decoratedPoints[0] : null;

    return {
      activeTab: 'map',
      loading: false,
      activity: { event_name: '爱企谷 · 游离之域', event_id: 'LOVEQIGU_FIRST_EVENT_CASE_V1' },
      stats: {
        completedTaskCount: 0,
        ownedRelicCount: relics.length,
        claimedCouponCount: coupons.length,
        completionRate: 0,
        taskCount: points.length
      },
      points: decoratedPoints,
      graphNodes: graphNodes,
      recommendedPoint: recommendedPoint,
      tasks: [],
      relics: relics,
      coupons: coupons,
      routes: routes,
      collectibles: collectibles,
      journey: {
        activityName: '爱企谷探索',
        points: points,
        routes: routes,
        nav: { currentKey: 'explore', keys: ['home', 'explore', 'relic', 'reward', 'profile'] }
      },
      bottomNav: { currentKey: 'explore' }
    };
  } catch (err) {
    console.error('[explore-map] buildPageData error:', err);
    return null;
  }
}

Page({
  behaviors: [phase1PageGuard, safeInteraction, pilotScene],

  data: {
    loading: true,
    activeTab: 'map',
    activity: null,
    stats: { completedTaskCount: 0, ownedRelicCount: 0, claimedCouponCount: 0, completionRate: 0, taskCount: 0 },
    points: [],
    graphNodes: [],
    recommendedPoint: null,
    tasks: [],
    relics: [],
    coupons: [],
    routes: [],
    collectibles: [],
    journey: null,
    bottomNav: null
  },

  _initialized: false,
  _refreshLock: false,
  _isDestroyed: false,

  onLoad(options) {
    this._isDestroyed = false;
    this.initPage();
  },

  onShow() {},

  onUnload() { this._isDestroyed = true; },

  initPage() {
    if (this._initialized) return;
    this._initialized = true;
    this._refreshLock = true;

    var data = buildPageData();
    if (data === null) {
      console.error('[explore-map] initPage: buildPageData returned null (seed missing)');
    } else {
      data.loading = false;
      this.setData(data);
    }

    var self = this;
    setTimeout(function () { self._refreshLock = false; }, 300);
  },

  refresh(source) {
    if (this._isDestroyed || this._refreshLock) return;
    try {
      var data = buildPageData();
      if (data !== null) this.setData(data);
    } catch (error) {
      console.error('[explore-map] refresh error:', error);
    }
  },

  onBack() { this.safeNavigate('/pages/index/index'); },

  onOpenDetail(event) {
    var pointId = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.pointId : '';
    if (!pointId) { this.showFallbackToast('功能开发中'); return; }
    this.safeNavigate('/pages/merchant-event/detail/index?pointId=' + encodeURIComponent(pointId));
  },

  onOpenScanShell(event) {
    var pointId = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.pointId : '';
    if (!pointId) { this.showFallbackToast('功能开发中'); return; }
    this.safeNavigate('/pages/ar-entry/index?pointId=' + encodeURIComponent(pointId));
  },

  onOpenProgressCenter() { this.safeNavigate('/pages/progress-center/index'); },
  onBottomNavChange() {}
});
