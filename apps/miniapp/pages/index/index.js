/**
 * PAGE_EXPLORE — 世界探索主界面 (World Explore Hub)
 *
 * SYSTEM RULES:
 *   - PAGE_ID = 'PAGE_EXPLORE'
 *   - DATA: ALL from store.buildExploreRenderTree() — NO local generation
 *   - EVENTS: subscribes to STATE_SYNCED, COLLECTION_UPDATED
 *   - Must show 10 exploration nodes at all times (no empty state)
 *   - No relic/echo/collectible mixing — these belong to PAGE_06/PAGE_07
 *
 * CONTRACT (PAGE_CONTRACT_V1 §3):
 *   Role: 世界状态机入口 · 探索节点分发器
 *   Data: relic_store, world_state, exploration_nodes (10 required)
 *   UI: current node, progress bar, exploration card list
 *   BEHAVIOR:
 *     ON_NODE_CLICK → PAGE_AR_CAPTURE
 *     ON_NODE_DETAIL → PAGE_07C_RELIC_DETAIL
 */

const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');
const pilotScene = require('../../behaviors/pilot-scene');

var storeAccessor = require('../../shared/store-accessor');
var eventBus = require('../../core/event/ar-event-bus');

// SYSTEM CONTRACT
var store = null;
try { store = storeAccessor.getStore(); } catch (e) {}
var PAGE_ID = store ? store.PAGE_IDS.EXPLORE : 'PAGE_EXPLORE';
var ON_EVENTS = { STATE_SYNCED: 'STATE_SYNCED', COLLECTION_UPDATED: 'COLLECTION_UPDATED' };

function getStore() {
  try { return storeAccessor.getStore(); } catch (e) { return null; }
}

Page({
  behaviors: [phase1PageGuard, safeInteraction, pilotScene],

  data: {
    pageId: PAGE_ID,
    loading: true,
    activeTab: 'home',
    // All render data comes from store.buildExploreRenderTree()
    renderTree: null
  },

  _initialized: false,
  _isDestroyed: false,

  onLoad() {
    this._isDestroyed = false;

    // Subscribe to system events
    var self = this;
    this._offStateSynced = eventBus.on(ON_EVENTS.STATE_SYNCED, function() {
      if (!self._isDestroyed) self._refresh();
    });
    this._offCollectionUpdated = eventBus.on(ON_EVENTS.COLLECTION_UPDATED, function() {
      if (!self._isDestroyed) self._refresh();
    });

    this._refresh();
  },

  onUnload() {
    this._isDestroyed = true;
    if (this._offStateSynced) this._offStateSynced();
    if (this._offCollectionUpdated) this._offCollectionUpdated();
  },

  onShow() {
    // Refresh data on each show to reflect latest state
    this._refresh();
  },

  onReady() {
    // Legacy boot signal — must be kept for app deferredInit
    globalThis.__BOOT_STATE__ = globalThis.__BOOT_STATE__ || {};
    globalThis.__BOOT_STATE__.uiRendered = true;
    try {
      var app = typeof getApp !== 'undefined' ? getApp() : null;
      if (app && typeof app.deferredInit === 'function') app.deferredInit();
    } catch (e) {}
  },

  /**
   * Refresh all page data from store.
   * SYSTEM RULE #6: ALL data from store. No local generation.
   */
  _refresh: function() {
    if (this._isDestroyed) return;
    var s = getStore();
    if (!s) {
      // Store unavailable — show minimal loading state
      this.setData({
        loading: false,
        renderTree: null,
        activeTab: 'home'
      });
      return;
    }

    var renderTree = s.buildExploreRenderTree();
    this.setData({
      loading: false,
      renderTree: renderTree || null,
      activeTab: 'home'
    });
  },

  // ═══════════════════════════════════════════════
  // ON_EVENT: Navigate to AR capture
  // Per contract: ON_NODE_CLICK → PAGE_AR_CAPTURE
  // ═══════════════════════════════════════════════
  onOpenExploreMap: function() {
    this.safeNavigate('/pages/ar-entry/index', { fallbackTitle: 'AR探索暂未开放' });
  },

  // ═══════════════════════════════════════════════
  // ON_EVENT: Point detail → relic detail
  // Per contract: ON_NODE_DETAIL → PAGE_07C_RELIC_DETAIL
  // ═══════════════════════════════════════════════
  onOpenPointDetail: function(event) {
    var pointId = event && event.currentTarget && event.currentTarget.dataset
      ? event.currentTarget.dataset.pointId : '';
    if (!pointId) { this.showFallbackToast('功能开发中'); return; }
    this.safeNavigate('/pages/relic/index?pointId=' + encodeURIComponent(pointId),
      { fallbackTitle: '印记追溯开发中' });
  },

  // ═══════════════════════════════════════════════
  // ON_EVENT: Navigation shortcuts
  // ═══════════════════════════════════════════════
  onOpenRelicArchive: function() {
    this.safeNavigate('/pages/relics/index', { fallbackTitle: '印记中心暂未开放' });
  },

  onOpenRightsCenter: function() {
    this.safeNavigate('/pages/rights/index', { fallbackTitle: '权益中心暂未开放' });
  },

  onOpenProfile: function() {
    this.safeNavigate('/pages/my/index', { fallbackTitle: '个人中心暂未开放' });
  },

  onOpenSeals: function() {
    this.safeNavigate('/pages/seals/index', { fallbackTitle: '印鉴页暂未开放' });
  },

  onOpenRewardCenter: function() {
    this.safeNavigate('/pages/reward-center/index', { fallbackTitle: '共鸣册暂未开放' });
  },

  onOpenActivity: function() {
    this.safeNavigate('/pages/merchant-event/index/index', { fallbackTitle: '活动页暂未开放' });
  },

  onBottomNavChange: function() {}
});
