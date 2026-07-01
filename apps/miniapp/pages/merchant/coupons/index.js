// ═══════════════════════════════════════════
// V5.9.16 — MERCHANT COUPONS (Enriched)
//
// Product-level UX:
// - Real merchant coupon data
// - Journey narrative flow
// - Claim/used states
// ═══════════════════════════════════════════

var safeInteraction = require('../../../behaviors/safe-interaction');
var storeAccessor = require('../../../shared/store-accessor');

function getStore() {
  try { return storeAccessor.getStore(); } catch (e) { return null; }
}

function getInjector() {
  try { return storeAccessor.getVisualInjector(); } catch (e) { return null; }
}

function buildPageData() {
  var store = getStore();
  var injector = getInjector();

  var renderTree;
  if (store) {
    renderTree = store.buildMerchantRenderTree();
  } else {
    renderTree = {
      loading: false,
      activeTab: 'coupons',
      title: '探索礼遇',
      subtitle: '商户礼券',
      kicker: '礼遇',
      hasCoupons: false,
      sections: [],
      emptyState: null,
      background: []
    };
  }

  // Inject visual tokens
  if (injector) {
    renderTree = injector.injectVisualTokens(renderTree);
  }

  // Legacy fields for WXML compatibility
  renderTree.hasCoupons = renderTree.hasCoupons;

  return renderTree;
}

Page({
  behaviors: [safeInteraction],

  data: buildPageData(),

  onLoad: function() {
    this.setData(buildPageData());
  },

  onShow: function() {
    this.setData(buildPageData());
  },

  onShowQr: function(e) {
    this.showFallbackToast('核销码功能开发中');
  },

  onCouponDetail: function(e) {
    this.showFallbackToast('礼券详情开发中');
  }
});
