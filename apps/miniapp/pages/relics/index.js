/**
 * PAGE_06_MY_RELICS — 信物世界 (Relic World + Atlases)
 *
 * PAGE_CONTRACT_V1:
 *   View A: RELIC_VIEW —  my relics (circular orbit)
 *   View B: HEAVEN ATLAS — star/seasons (PAGE_07A)
 *   View C: HUMAN ATLAS — meridian/acupoints (PAGE_07B)
 *   View D: RELIC DETAIL — single relic focus (PAGE_07C)
 *
 * SYSTEM RULES:
 *   - PAGE_ID = 'PAGE_06_MY_RELICS'
 *   - Data: ALL from store (relic_store / echo_store)
 *   - Events: subscribes to COLLECTION_UPDATED, STATE_SYNCED
 *   - Never mixes with collectibles (they are at PAGE_07_COLLECTION)
 */

var store = require('../../core/runtime/world_runtime_store');
var eventBus = require('../../core/event/ar-event-bus');
var injectWorldContent = require('../../content/world/inject_world_content').injectWorldContent;
var safeInteraction = require('../../behaviors/safe-interaction');

var PAGE_ID = store.PAGE_IDS.MY_RELICS;

var ON_EVENTS = {
  COLLECTION_UPDATED: 'COLLECTION_UPDATED',
  STATE_SYNCED: 'STATE_SYNCED'
};

Page({
  behaviors: [safeInteraction],

  data: {
    pageId: PAGE_ID,
    loading: true,
    renderTree: null,
    pageType: 'PAGE_06',  // PAGE_06 | PAGE_07A | PAGE_07B
    detailVisible: false,
    detailAsset: null,
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
    var pageType = this.data.pageType || 'PAGE_06';
    var tree = null;

    if (pageType === 'PAGE_06') {
      tree = store.buildCollectionRenderTree();
    } else if (pageType === 'PAGE_07A') {
      tree = store.buildHeavenAtlasRenderTree();
    } else if (pageType === 'PAGE_07B') {
      tree = store.buildHumanAtlasRenderTree();
    } else {
      tree = store.buildCollectionRenderTree();
    }

    if (tree) {
      tree = injectWorldContent('collection', tree);
      this.setData({
        loading: false,
        renderTree: tree,
        pageType: pageType,
        detailVisible: false,
        detailAsset: null
      });
    } else {
      this.setData({ loading: false });
    }
  },

  /**
   * ON_EVENT: Switch between PAGE_06 / PAGE_07A / PAGE_07B
   */
  onSubViewSwitch: function(e) {
    var newPageType = e.currentTarget.dataset.pageType;
    if (!newPageType || newPageType === this.data.pageType) return;

    var validTypes = ['PAGE_06', 'PAGE_07A', 'PAGE_07B'];
    if (validTypes.indexOf(newPageType) === -1) return;

    this.setData({
      pageType: newPageType,
      detailVisible: false,
      detailAsset: null
    });
    this._refresh();
  },

  /**
   * ON_EVENT: Tap relic node → show detail (PAGE_07C)
   */
  onRelicNodeTap: function(e) {
    var relicId = e.currentTarget.dataset.id;
    if (!relicId) return;

    var tree = this.data.renderTree;
    if (!tree || !tree.relicNodes) return;

    for (var i = 0; i < tree.relicNodes.length; i++) {
      if (tree.relicNodes[i].id === relicId) {
        this.setData({
          detailVisible: true,
          detailAsset: tree.relicNodes[i]
        });
        return;
      }
    }
  },

  onDetailClose: function() {
    this.setData({
      detailVisible: false,
      detailAsset: null
    });
  },

  onBottomNavChange: function() {},

  noop: function() {}
});
