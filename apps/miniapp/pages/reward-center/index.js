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
  var collectibles = (seed && seed.collectibles) || [];
  var coupons = (seed && seed.merchant_coupons) || [];

  var categories = [];

  if (collectibles.length > 0) {
    categories.push({
      id: 'collectibles',
      title: '数字藏品',
      items: collectibles.map(function(c) {
        return {
          id: c.id,
          name: c.title,
          desc: c.copy,
          status: '可领取',
          unlocked: true,
          reward_type: 'collectible',
          reward_type_label: c.display_context || '传播资产',
          related_ids: c.related_ids || []
        };
      })
    });
  }

  if (coupons.length > 0) {
    categories.push({
      id: 'merchant_coupons',
      title: '商户礼遇',
      items: coupons.map(function(c) {
        return {
          id: c.id,
          name: c.title,
          desc: c.description + ' (' + c.merchant_name + ')',
          status: '待领取',
          unlocked: true,
          reward_type: 'coupon',
          reward_type_label: c.benefit_value || '限时兑换',
          merchant_name: c.merchant_name,
          related_ids: c.related_ids || []
        };
      })
    });
  }

  return {
    activeTab: 'reward',
    title: '共鸣册',
    subtitle: '数字藏品 · 商户礼遇',
    categories: categories,
    synthesizedCount: collectibles.length + coupons.length
  };
}

Page({
  behaviors: [safeInteraction],
  data: { activeTab: 'reward', title: '共鸣册', subtitle: '数字藏品 · 商户礼遇', categories: [], synthesizedCount: 0 },

  onLoad() {
    this.setData(buildPageData());
  },

  onShow() {
    this.setData(buildPageData());
  },

  onBackHome() {
    this.safeNavigate('/pages/index/index', { fallbackTitle: '首页暂未开放' });
  }
});
