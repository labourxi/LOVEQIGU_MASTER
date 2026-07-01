/**
 * PAGE_07_COLLECTION — 藏品中心 (Collectible Gallery)
 *
 * PAGE_CONTRACT_V1 §6:
 *   Role: 用户影像记录系统 · 数字记忆容器
 *   Data: collectible_store ONLY
 *   UI: gallery grid (separated from relic system)
 *   RULE: No relic, no progression, no meaning attachment
 *         Only captured media
 *
 * SYSTEM RULES:
 *   - PAGE_ID = 'PAGE_07_COLLECTION'
 *   - All data from collectible_store (SYSTEM RULE #6)
 *   - Never mixed with relics
 */

var store = require('../../core/runtime/world_runtime_store');
var eventBus = require('../../core/event/ar-event-bus');
var injectWorldContent = require('../../content/world/inject_world_content').injectWorldContent;

var PAGE_ID = store.PAGE_IDS.COLLECTION;

var ON_EVENTS = {
  COLLECTION_UPDATED: 'COLLECTION_UPDATED',
  STATE_SYNCED: 'STATE_SYNCED'
};

Page({
  data: {
    pageId: PAGE_ID,
    loading: true,
    collectibles: [],
    // This tab key matches the bottom-nav item which is now 'relic'
    // (the 'collection' tab was renamed to 'relic' in PAGE_CONTRACT_V1)
    activeTab: 'relic'
  },

  onLoad() {
    this._refresh();
    var self = this;
    this._offCollectionUpdated = eventBus.on(ON_EVENTS.COLLECTION_UPDATED, function() {
      self._refresh();
    });
    this._offStateSynced = eventBus.on(ON_EVENTS.STATE_SYNCED, function() {
      self._refresh();
    });
  },

  onUnload() {
    if (this._offCollectionUpdated) this._offCollectionUpdated();
    if (this._offStateSynced) this._offStateSynced();
  },

  onShow() {
    this._refresh();
  },

  _refresh: function() {
    var allCollectibles = store.getAllCollectibles ? store.getAllCollectibles() : [];
    this.setData({
      loading: false,
      collectibles: allCollectibles || []
    });
  },

  /** ON_EVENT: View collectible detail */
  onCollectibleTap: function(e) {
    // Placeholder — shows fallback toast
    try { wx.showToast({ title: '数字藏品详情', icon: 'none' }); } catch (e) {}
  },

  onBottomNavChange: function() {}
});
