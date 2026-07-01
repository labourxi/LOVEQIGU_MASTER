/**
 * PAGE_04_RIGHTS — 探索礼遇中心 (Exploration Rights Center)
 *
 * SYSTEM RULES:
 *   - PAGE_ID = 'PAGE_08_RIGHTS'
 *   - Data: ALL from store.buildRightsRenderTree()
 *   - Events: subscribes to RIGHTS_UPDATED, STATE_SYNCED
 *   - Behaviors: claim reward, redeem coupon, view history
 *   - NOT e-commerce. Rewards earned through exploration.
 */

var safeInteraction = require('../../behaviors/safe-interaction');
var storeAccessor = require('../../shared/store-accessor');
var eventBus = require('../../core/event/ar-event-bus');
var injectWorldContent = require('../../content/world/inject_world_content').injectWorldContent;

var store = null;
try { store = storeAccessor.getStore(); } catch (e) {}

var PAGE_ID = store ? store.PAGE_IDS.RIGHTS : 'PAGE_08_RIGHTS';

// ─── ON_EVENT declarations ───
var ON_EVENTS = {
  RIGHTS_UPDATED: 'RIGHTS_UPDATED',
  STATE_SYNCED: 'STATE_SYNCED'
};

// ─── Event handler refs for cleanup ───
var _handlers = {};

function getStore() {
  try { return storeAccessor.getStore(); } catch (e) { return null; }
}

function getInjector() {
  try { return storeAccessor.getVisualInjector(); } catch (e) { return null; }
}

function showToast(title, icon) {
  try { wx.showToast({ title: title || '', icon: icon || 'none', duration: 2000 }); } catch (e) {}
}

/**
 * Build page data from store ONLY (SYSTEM RULE #6).
 */
function buildPageData() {
  var s = getStore();
  var injector = getInjector();

  if (!s) {
    return {
      pageId: PAGE_ID,
      loading: false,
      activeTab: 'rights',
      _storeUnavailable: true
    };
  }

  var renderTree = s.buildRightsRenderTree();

  if (injector) {
    renderTree = injector.injectVisualTokens(renderTree);
  }

  renderTree = injectWorldContent('rights', renderTree);
  renderTree.pageId = PAGE_ID;
  renderTree.activeTab = 'rights';

  return renderTree;
}

Page({
  behaviors: [safeInteraction],

  data: buildPageData(),

  onLoad: function() {
    this.setData(buildPageData());

    // ─── ON_EVENT: Subscribe to rights updates ───
    var that = this;
    _handlers.onRightsUpdated = eventBus.on(ON_EVENTS.RIGHTS_UPDATED, function() {
      console.log('[PAGE_04_RIGHTS] event: RIGHTS_UPDATED');
      that.setData(buildPageData());
    });
    _handlers.onStateSynced = eventBus.on(ON_EVENTS.STATE_SYNCED, function() {
      console.log('[PAGE_04_RIGHTS] event: STATE_SYNCED');
      that.setData(buildPageData());
    });
  },

  onUnload: function() {
    // Cleanup event subscriptions
    if (_handlers.onRightsUpdated) _handlers.onRightsUpdated();
    if (_handlers.onStateSynced) _handlers.onStateSynced();
  },

  onShow: function() {
    this.setData(buildPageData());
  },

  // ═══════════════════════════════════════════════════
  // ON_EVENT: Claim Reward
  // ═══════════════════════════════════════════════════
  onClaimReward: function(rewardId, rewardName) {
    var s = getStore();
    if (!s) { showToast('系统暂不可用'); return; }

    var result = s.claimRight(rewardId);
    if (result && result.success) {
      showToast('已领取 ' + (rewardName || '') + '，心愿值 +1', 'success');
      this.setData(buildPageData());
    } else {
      var reason = result ? result.reason : 'unknown';
      if (reason === 'already_claimed') showToast('该奖励已领取');
      else showToast('领取失败，请重试');
    }
  },

  // ═══════════════════════════════════════════════════
  // ON_EVENT: Redeem Coupon
  // ═══════════════════════════════════════════════════
  onRedeemCoupon: function(couponId, cost, couponName) {
    var s = getStore();
    if (!s) { showToast('系统暂不可用'); return; }

    var points = s.getRightsPoints();
    if (points.points < cost) {
      showToast('心愿值不足，需要 ' + cost + ' 心愿值');
      return;
    }

    var result = s.redeemRight(couponId);
    if (result && result.success) {
      showToast('已兑换 ' + (couponName || '') + '，消耗 ' + cost + ' 心愿值', 'success');
      this.setData(buildPageData());
    } else {
      showToast('兑换失败，请重试');
    }
  },

  // ═══════════════════════════════════════════════════
  // ON_EVENT: Central action handler
  // ═══════════════════════════════════════════════════
  onRewardAction: function(e) {
    var ds = e && e.currentTarget && e.currentTarget.dataset;
    if (!ds) return;

    var id = ds.id;
    var action = ds.action;
    var status = ds.status;
    var cost = ds.cost || 0;
    if (!id) return;

    // Find item name from store data (SYSTEM RULE #6: don't generate in UI)
    var itemName = '';
    var allData = this.data;
    for (var s = 0; s < (allData.sections || []).length; s++) {
      for (var i = 0; i < (allData.sections[s].items || []).length; i++) {
        if (allData.sections[s].items[i].id === id) {
          itemName = allData.sections[s].items[i].name || '';
        }
      }
    }

    if (action === 'claim') {
      if (status === 'available') this.onClaimReward(id, itemName);
      else if (status === 'claimed') showToast('已领取');
      else showToast('暂不可领取');
    } else if (action === 'redeem') {
      if (status === 'available') this.onRedeemCoupon(id, cost, itemName);
      else if (status === 'locked') showToast('心愿值不足');
      else showToast('该权益不可兑换');
    }
  },

  // ═══════════════════════════════════════════════════
  // ON_EVENT: View history detail
  // ═══════════════════════════════════════════════════
  onViewHistory: function(e) {
    var ds = e && e.currentTarget && e.currentTarget.dataset;
    var id = ds ? ds.id : '';

    var itemData = null;
    var allData = this.data;
    for (var i = 0; i < (allData.sections && allData.sections[2] && allData.sections[2].items || []).length; i++) {
      if (allData.sections[2].items[i].id === id) itemData = allData.sections[2].items[i];
    }
    if (!itemData) {
      for (var i = 0; i < (allData.rewardFeed || []).length; i++) {
        if (allData.rewardFeed[i].id === id) itemData = allData.rewardFeed[i];
      }
    }

    if (itemData) {
      try {
        wx.showModal({
          title: itemData.name || '权益详情',
          content: '来源：' + (itemData.source || '-') + '\n状态：' + (itemData.statusLabel || itemData.type || '-') +
            '\n有效期：' + (itemData.expire || '-') + '\n\n' + (itemData.description || ''),
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#C8A24A'
        });
      } catch (e) {}
    } else {
      try {
        wx.showModal({
          title: '奖励详情',
          content: '来源：' + (ds && ds.id ? ds.id : '未知') + '\n功能开发中',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#C8A24A'
        });
      } catch (e) {}
    }
  },

  // ═══════════════════════════════════════════════════
  // ON_EVENT: Navigate
  // ═══════════════════════════════════════════════════
  onNavigateToRelic: function() {
    this.safeNavigate('/pages/relic/index', { fallbackTitle: '印记中心暂未开放' });
  },

  onNavigateToExplore: function() {
    this.safeNavigate('/pages/index/index', { fallbackTitle: '探索页暂未开放' });
  },

  onNavigateToMy: function() {
    this.safeNavigate('/pages/my/index', { fallbackTitle: '个人中心暂未开放' });
  },

  onBottomNavChange: function() {}
});
