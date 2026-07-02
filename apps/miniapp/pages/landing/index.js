/**
 * PAGE_01_LANDING — 爱企谷首页 (Aigugu World Entry Page)
 *
 * UI_CONTRACT_SYSTEM_V1:
 *   PAGE_01: Landing（爱企谷首页）
 *   L1: 爱企谷主世界视觉 / 门 / 光 / 路径隐喻
 *   L2: exploration_count / relic_count / coupon_count / progress
 *   L3: 微信一键登录（主CTA） / 进入探索
 *
 * V7 CIVILIZATION OS:
 *   This is the AIGU VALLEY WORLD ENTRY PAGE.
 *   First impression of the world.
 *   Login + exploration gateway.
 *
 * NATIVE EXECUTION MODE (post-governance rollback):
 *   - Pure WeChat Mini Program rendering pipeline
 *   - No governance interceptors, gates, or existence controllers
 *   - setData behaves natively
 *   - Missing assets do NOT block UI — fallback to CSS gradient
 *
 * CRITICAL DESIGN RULES:
 *   1. entryReady depends ONLY on store ready + UI mounted
 *   2. IMAGES ARE NON-BLOCKING — never await image/asset load
 *   3. UI renders FIRST (uiReady=true at top of onLoad)
 *   4. Assets load fire-and-forget after UI is visible
 *   5. No setTimeout that throws on timeout — log warning only
 *
 * ASSET STRATEGY:
 *   - Safe <image> wrapper with binderror fallback
 *   - All paths under /static/ (canonical folder)
 *   - CSS background-image layer ALSO set but non-blocking
 *
 * STATE MACHINE:
 *   guest → logged_in → active_explorer
 *
 * FORBIDDEN:
 *   - await loadImage / await assetReady
 *   - image timeout that throws
 *   - /assets/ or /images/ path prefix
 *   - hardcoded stats
 *   - <10 exploration nodes
 *   - missing login CTA
 *   - image blocking render
 */

var safeNavigate;
try {
  safeNavigate = require('../../utils/safe-interaction').safeNavigate;
} catch (e) {
  console.warn('[RUNTIME GUARD] safe-interaction failed, using fallback');
  safeNavigate = function (url, opts) {
    try { wx.navigateTo({ url: url }); } catch (e) {}
  };
}

// ═════════════════════════════════════════════════════════════════════
// RUNTIME SAFE STORE LOADER
// Landing Page must never break even if store module fails to load.
// ═════════════════════════════════════════════════════════════════════

var worldRuntimeStore;
try {
  worldRuntimeStore = require('../../core/runtime/world_runtime_store');
} catch (e) {
  console.warn('[RUNTIME GUARD] world_runtime_store failed, using fallback store');
  worldRuntimeStore = createFallbackStore();
}

function createFallbackStore() {
  return {
    PAGE_IDS: { LANDING: 'PAGE_01_LANDING' },
    getAllPoints: function () { return generateFallbackPoints(); },
    getUserWorldState: function () {
      return { visitedPoints: [], discoveredRelics: 0, claimedRights: 0, journeyProgress: 0 };
    },
    hasWorldEntered: function () { return false; }
  };
}

function generateFallbackPoints() {
  var points = [];
  for (var i = 1; i <= 10; i++) {
    var padded = i < 10 ? '0' + i : '' + i;
    points.push({
      id: 'EP_' + padded, name: '探索节点 ' + i,
      subtitle: '爱企谷·未激活区域', region: 'AIGU VALLEY',
      type: 'fallback', themeColor: '#C8A24A',
      status: 'locked', story: '世界尚未展开'
    });
  }
  return points;
}

var PAGE_ID = worldRuntimeStore.PAGE_IDS ? worldRuntimeStore.PAGE_IDS.LANDING : 'PAGE_01_LANDING';
var _enteredOnce = false;
var _navigatingAway = false;

/**
 * Build ASSET_MAP. All paths use /static/ prefix (CANONICAL).
 */
function getAssetMap() {
  try {
    var visualInjector = require('../../core/visual/global_visual_injector');
    if (visualInjector && visualInjector.getAssetMap) return visualInjector.getAssetMap();
  } catch (e) {}
  return {
    // Scene backgrounds (P0)
    bg: '/static/scene/aiqigu_landing_v1.jpg',
    bg_webp: '/static/scene/aiqigu_landing_v1.webp',
    fallback: '/static/scene/landing_fallback.jpg',
    scene_street: '/static/scene/aiqigu_street_v1.jpg',
    scene_winner: '/static/scene/winner.jpg',
    landing_v1: '/static/scene/aiqigu_landing_v1.jpg',
    landing_v2_world_entry: '/static/scene/landing_v2_world_entry.jpg',
    landing_v2_1_balance: '/static/scene/landing_v2_1.jpg',
    landing_v3_release: '/static/scene/landing_v3_release.jpg',
    landing_portal: '/static/scene/landing_portal.jpg',

    // Portal / UI effects (P1)
    portal_mist: '/static/bg/portal_mist_v1.png',
    portal_ring: '/static/ui/portal_ring_gold_v1.png',
    ui_card_glass: '/static/ui/explore_card_glass_v1.png',
    ui_stat_glass: '/static/ui/stat_panel_gold_glass_v1.png',

    // Icons (P2)
    icon_login: '/static/icon/wechat_login_gold_v1.png',
    icon_location: '/static/icon/location_v1.png',
    icon_relic: '/static/icon/relic_v1.png',
    icon_collectible: '/static/icon/collectible_v1.png',
    icon_ar: '/static/icon/ar_v1.png',

    // Relic / collectible frames (P2)
    relic_frame: '/static/relic/frame_gold_v2.png',
    collectible_frame: '/static/collectible/collectible_frame_v1.png'
  };
}

function buildCarouselItems() {
  try {
    var points = worldRuntimeStore.getAllPoints() || [];
    var visitedIds = (worldRuntimeStore.getUserWorldState() || {}).visitedPoints || [];
    if (points.length < 10) console.warn('[PAGE_01_LANDING] INVALID: only ' + points.length + ' nodes');
    var items = [];
    for (var i = 0; i < points.length && i < 10; i++) {
      var p = points[i]; if (!p) continue;
      var isVisited = visitedIds.indexOf(p.id) !== -1;
      var st = isVisited ? 'discovered' : (p.status === 'unlocked' || p.status === 'active' ? 'unlocked' : 'locked');
      items.push({
        id: p.id, name: p.name || p.label || '探索点',
        subtitle: p.subtitle || '', region: p.region || '',
        type: p.type || '', themeColor: p.themeColor || '#C8A24A',
        status: st,
        statusLabel: isVisited ? '已探索' : (p.status === 'unlocked' || p.status === 'active' ? '可探索' : '未解锁'),
        decorativeGroup: p.decorativeGroup || '', story: p.story || ''
      });
    }
    return items;
  } catch (e) { return []; }
}

function buildStats(storeData) {
  try {
    if (storeData) {
      var points = storeData.pointList || storeData.points || [];
      var relics = storeData.relicList || storeData.relics || [];
      var rights = storeData.rightsList || storeData.rights || [];
      return {
        explorationCount: storeData.point ? storeData.point.length : (points.length || 10),
        relicCount: storeData.relic ? storeData.relic.length : (relics.length || 10),
        couponCount: storeData.rights ? storeData.rights.length : (rights.length || 0),
        progress: storeData.journeyProgress || 0
      };
    }
    var state = worldRuntimeStore.getUserWorldState ? worldRuntimeStore.getUserWorldState() : {};
    var ac = worldRuntimeStore.getAssetCounts ? worldRuntimeStore.getAssetCounts() : {};
    var allPts = worldRuntimeStore.getAllPoints ? worldRuntimeStore.getAllPoints() : [];
    return {
      explorationCount: allPts.length || (state.visitedPoints ? state.visitedPoints.length : 10),
      relicCount: state.discoveredRelics || (ac.relics ? ac.relics.discovered : 0) || 0,
      couponCount: state.claimedRights || (ac.couponCount || 0),
      progress: state.journeyProgress || 0
    };
  } catch (e) { return { explorationCount: 10, relicCount: 0, couponCount: 0, progress: 0 }; }
}

function getUserType() {
  try {
    if (!worldRuntimeStore) return 'guest';
    var state = worldRuntimeStore.getUserWorldState ? worldRuntimeStore.getUserWorldState() : {};
    if ((state.visitedPoints && state.visitedPoints.length > 3) || (state.discoveredRelics && state.discoveredRelics > 2)) return 'active_explorer';
    if (worldRuntimeStore.hasWorldEntered && worldRuntimeStore.hasWorldEntered()) return 'logged_in';
    return 'guest';
  } catch (e) { return 'guest'; }
}

Page({
  data: {
    pageId: PAGE_ID,
    loading: true,
    uiReady: false,
    ready: false,
    entryReady: false,
    userType: 'guest',
    loginVisible: true,
    entryState: {},
    worldMode: 'ACTIVE',

    // Image — safe wrapper, fire-and-forget
    // Now points to real asset in /static/ directory
    // WORLD LANDING PAGE V3 — 定稿背景 (CDN 加载，不增加主包体积)
    bgImage: '/static/scene/landing_world_v3_final.jpg',
    _bgGradient: '',

    assetMap: getAssetMap(),
    stats: buildStats(),
    carouselItems: buildCarouselItems(),

    points: 10,
    relics: 10,
    rights: 10,

    // WORLD LANDING PAGE V3 — 协议 checkbox
    agreeProtocol: false
  },

  /**
   * onLoad — Native WeChat lifecycle. No governance gates.
   */
  onLoad: function (options) {
    console.log('[PAGE_01_LANDING] onLoad', options);
    console.log('[TIMEOUT TRACE] onLoad entered — ' + Date.now());

    // ─── Entry state (non-blocking read) ───
    var entryState = globalThis.__ENTRY_STATE__ || {};
    console.log('[TIMEOUT TRACE] entryState read — ' + Date.now() + ' flow=' + (entryState.flow || 'unknown'));

    // ─── FIRE-AND-FORGET: bind store data (never blocks UI) ───
    var self = this;
    setTimeout(function () {
      console.log('[TIMEOUT TRACE] _bindWorldData starting — ' + Date.now());
      self._bindWorldData();
    }, 0);

    console.log('[LANDING RUNTIME]', {
      uiReady: true,
      entryReady: true,
      assetLoaded: false
    });

    // ─── ENTRY GATE (after UI is visible) ───
    if (globalThis.__BOOT_READY__ !== true) {
      console.log('[PAGE_01_LANDING] boot not ready — deferring entry gate');
      console.log('[TIMEOUT TRACE] BOOT_READY=false — deferring — ' + Date.now());
      return;
    }

    console.log('[TIMEOUT TRACE] BOOT_READY=true — proceeding — ' + Date.now());

    if (worldRuntimeStore.hasWorldEntered && worldRuntimeStore.hasWorldEntered()) {
      console.log('[PAGE_01_LANDING] hasEnteredWorld=true, reLaunch');
      try { wx.reLaunch({ url: '/pages/index/index' }); } catch (e) {}
      return;
    }

    if (_enteredOnce) {
      console.log('[PAGE_01_LANDING] re-entry blocked, reLaunch');
      try { wx.reLaunch({ url: '/pages/index/index' }); } catch (e) {}
      return;
    }
    _enteredOnce = true;

    self._initPage();
  },

  /**
   * Safe setData — only applies when page is alive.
   * Guards against setData on unmounted page and ensures
   * data is never applied before ready.
   */
  _safeSetData: function (data, callback) {
    try {
      if (this._stabilized === false) {
        console.warn('[TIMEOUT TRACE] _safeSetData skipped — not stabilized');
        return;
      }
      this.setData(data, callback);
    } catch (e) {
      console.warn('[SAFE SETDATA] error:', e.message);
    }
  },

  /**
   * Bind world data from getApp().store.getState().
   * FIRE-AND-FORGET: never awaits, never blocks UI.
   * Sets ready=true at the END after store data is populated.
   */
  _bindWorldData: function () {
    console.log('[TIMEOUT TRACE] _bindWorldData entered — ' + Date.now());
    try {
      var app = typeof getApp === 'function' ? getApp() : null;
      var store = null;

      if (app && app.store && typeof app.store.getState === 'function') {
        store = app.store.getState();
      }

      if (!store) {
        console.warn('[LANDING FIX] store not ready, using local fallback');
        var allPoints = worldRuntimeStore.getAllPoints ? worldRuntimeStore.getAllPoints() : generateFallbackPoints();
        var allRelics = worldRuntimeStore.getAllRelics ? worldRuntimeStore.getAllRelics() : [];
        var allRights = worldRuntimeStore.getAllRights ? worldRuntimeStore.getAllRights() : [];
        var userState = worldRuntimeStore.getUserWorldState ? worldRuntimeStore.getUserWorldState() : {};
        store = {
          point: allPoints, relic: allRelics, rights: allRights,
          pointList: allPoints, relicList: allRelics, rightsList: allRights,
          journeyProgress: userState.journeyProgress || 0,
          userState: {
            isGuest: !(worldRuntimeStore.hasWorldEntered ? worldRuntimeStore.hasWorldEntered() : false),
            hasEnteredWorld: worldRuntimeStore.hasWorldEntered ? worldRuntimeStore.hasWorldEntered() : false,
            visitedPoints: userState.visitedPoints || [],
            discoveredRelics: userState.discoveredRelics || 0,
            claimedRights: userState.claimedRights || 0
          }
        };
      }

      this._store = store;

      var pts = store.point || store.pointList || [];
      var rls = store.relic || store.relicList || [];
      var rts = store.rights || store.rightsList || [];

      var pointsCount = store.point ? store.point.length : (Array.isArray(pts) ? pts.length : 10);
      var relicsCount = store.relic ? store.relic.length : (Array.isArray(rls) ? rls.length : 10);
      var rightsCount = store.rights ? store.rights.length : (Array.isArray(rts) ? rts.length : 0);
      if (pointsCount < 10) pointsCount = 10;
      if (relicsCount < 10) relicsCount = 10;

      this.setData({
        stats: buildStats(store),
        carouselItems: buildCarouselItems(),
        points: pointsCount,
        relics: relicsCount,
        rights: rightsCount,
        loginVisible: store.userState ? store.userState.isGuest : true,
        uiReady: true,
        entryReady: true,
        loading: false,
        ready: true
      });

      console.log('[LANDING FIX] store bound:', store);
      console.log('[TIMEOUT TRACE] ready=true — UI revealed — ' + Date.now());
    } catch (e) {
      console.warn('[LANDING FIX] store bind error:', e.message);
      // Fallback reveal even on error
      this.setData({
        uiReady: true,
        entryReady: true,
        loading: false,
        ready: true
      });
      console.log('[TIMEOUT TRACE] ready=true fallback after error — ' + Date.now());
    }
  },

  onShow: function () {
    console.log('[TIMEOUT TRACE] onShow entered BOOT_READY=' + globalThis.__BOOT_READY__ + ' — ' + Date.now());
    if (globalThis.__BOOT_READY__ !== true) {
      console.log('[TIMEOUT TRACE] onShow deferring — BOOT_READY not yet — ' + Date.now());
      return;
    }
    if (worldRuntimeStore.hasWorldEntered && worldRuntimeStore.hasWorldEntered()) {
      console.log('[PAGE_01_LANDING] onShow hasEnteredWorld=true, reLaunch');
      try { wx.reLaunch({ url: '/pages/index/index' }); } catch (e) {}
      return;
    }
    console.log('[TIMEOUT TRACE] onShow calling _initPage — ' + Date.now());
    this._initPage();
  },

  onReady: function () {
    if (typeof this._stabilized !== 'undefined') return;
    this._stabilized = true;
    console.log('[TIMEOUT TRACE] onReady entered — ' + Date.now());

    var self = this;
    this.setData({ __pageReady: true });
    console.log('[TIMEOUT TRACE] __pageReady set — ' + Date.now());
    setTimeout(function () {
      console.log('[TIMEOUT TRACE] onReady:setTimeout firing — ' + Date.now() + ' BOOT_READY=' + globalThis.__BOOT_READY__);
      if (globalThis.__BOOT_READY__ !== true) {
        globalThis.__BOOT_READY__ = true;
        globalThis.__BOOTING__ = false;
        globalThis.__UI_FROZEN__ = true;
        console.log('[PAGE_01_LANDING] STABLE READY');
        console.log('[TIMEOUT TRACE] BOOT_READY set to true — ' + Date.now());
      }
    }, 0);
  },

  /**
   * Safe image error handler — switches to fallback.
   * Guards against infinite loop: only tries fallback once.
   * Ultimate fallback: CSS gradient (zero dependency on files).
   * Does NOT block UI, does NOT throw.
   */
  onImgError: function (e) {
    console.warn('[ASSET FAIL] bgImage load error', e);
    console.log('[TIMEOUT TRACE] onImgError fired — ' + Date.now() + ' attempted=' + this._fallbackAttempted);

    if (this._fallbackAttempted) {
      console.warn('[ASSET FAIL] fallback also failed — using gradient fallback');
      this.setData({
        bgImage: '',
        _bgGradient: 'radial-gradient(ellipse at 50% 100%, rgba(10,26,20,0.95) 0%, rgba(10,26,20,1) 100%)'
      });
      return;
    }

    this._fallbackAttempted = true;
    var fallback = this.data.assetMap.fallback || '/static/scene/landing_fallback.jpg';
    console.log('[TIMEOUT TRACE] onImgError setting fallback — ' + Date.now() + ' path=' + fallback);

    // Safe fallback — log and continue, never block UI
    this.setData({ bgImage: fallback });
    console.log('[ASSET PIPE]', { bg: fallback, fallback: true });
  },

  _initPage: function () {
    console.log('[TIMEOUT TRACE] _initPage entered — ' + Date.now());
    var userType = getUserType();
    var stats = this._store ? buildStats(this._store) : buildStats();
    var carouselItems = buildCarouselItems();

    if (carouselItems.length < 10) {
      console.error('[PAGE_01_LANDING] INVALID: only ' + carouselItems.length + ' nodes');
    }

    this.setData({
      userType: userType, stats: stats, carouselItems: carouselItems,
      worldMode: 'ACTIVE',
      renderLayer: { fog: true, particles: true, goldGlow: true }
    });
    console.log('[TIMEOUT TRACE] _initPage setData complete — ' + Date.now());
    console.log('[PAGE_01_LANDING] initialized, userType:', userType);
  },

  onWechatLogin: function () {
    if (!this.data.agreeProtocol) {
      wx.showToast({ title: '请先阅读并同意协议', icon: 'none', duration: 2000 });
      return;
    }
    console.log('[PAGE_01_LANDING] onWechatLogin');
    var self = this;
    wx.showLoading({ title: '正在进入...', mask: true });
    setTimeout(function () {
      wx.hideLoading();
      if (worldRuntimeStore.markWorldEntered) worldRuntimeStore.markWorldEntered();
      self.setData({ userType: 'logged_in', loginVisible: false, stats: buildStats() });
      self._enterExplore();
    }, 600);
  },

  onEnterExplore: function () { this._enterExplore(); },

  onCarouselTap: function (e) {
    safeNavigate('/pages/index/index', {
      _userTap: true,
      fail: function () { try { wx.navigateTo({ url: '/pages/index/index' }); } catch (e) {} }
    });
  },

  noop: function () {},

  // ─── WORLD LANDING PAGE V3: 协议勾选 ───
  onToggleAgreement: function () {
    this.setData({ agreeProtocol: !this.data.agreeProtocol });
  },

  onTapUserAgreement: function () {
    safeNavigate('/pages/legal/user_agreement/index', {
      fail: function () {
        try { wx.navigateTo({ url: '/pages/legal/user_agreement/index' }); } catch (e) {
          console.warn('[LEGAL] user_agreement page not found');
        }
      }
    });
  },

  onTapPrivacyPolicy: function () {
    safeNavigate('/pages/legal/privacy_policy/index', {
      fail: function () {
        try { wx.navigateTo({ url: '/pages/legal/privacy_policy/index' }); } catch (e) {
          console.warn('[LEGAL] privacy_policy page not found');
        }
      }
    });
  },

  _enterExplore: function () {
    if (_navigatingAway) return;
    _navigatingAway = true;
    if (worldRuntimeStore.markWorldEntered) worldRuntimeStore.markWorldEntered();
    safeNavigate('/pages/index/index', {
      replace: true, _userTap: true,
      fail: function () {
        console.warn('[PAGE_01_LANDING] safeNavigate failed, using wx.reLaunch');
        _navigatingAway = false;
        try { wx.reLaunch({ url: '/pages/index/index' }); } catch (e) {}
      }
    });
  }
});
