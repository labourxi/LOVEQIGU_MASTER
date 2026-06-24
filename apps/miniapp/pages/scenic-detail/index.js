const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');
const merchantEventService = require('../../services/merchant-event');
const phase1PageGuard = require('../../behaviors/phase1-page-guard');
const safeInteraction = require('../../behaviors/safe-interaction');

function mapNearbyCoupons(eventOverview) {
  return (eventOverview.coupons || [])
    .filter((item) => item && item.status !== 'LOCKED')
    .slice(0, 3)
    .map((item) => ({
      id: item.coupon_id || item.point_id || item.coupon_name,
      name: item.coupon_name || '在地礼遇',
      merchant: item.merchant_name || '附近商家'
    }));
}

function buildPageData(id) {
  const scenic = prototypeRuntime.getScenicDetail(id);
  if (!scenic) {
    return {
      missing: true,
      title: '探索点未找到',
      activeTab: 'map'
    };
  }
  const eventOverview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const nearbyCoupons = mapNearbyCoupons(eventOverview);
  return {
    missing: false,
    activeTab: 'map',
    scenic,
    nearbyCoupons,
    eventOverview,
    eventQuickStats: [
      { label: '已完成任务', value: eventOverview.stats.completedTaskCount },
      { label: '已获信物', value: eventOverview.stats.ownedRelicCount },
      { label: '已领卡券', value: eventOverview.stats.claimedCouponCount }
    ]
  };
}

Page({
  behaviors: [phase1PageGuard, safeInteraction],
  data: buildPageData(''),

  onLoad(options) {
    this.setData(buildPageData(options.id || 'scenic_aiqiugu'));
  },

  onOpenExplore() {
    const scenic = this.data.scenic;
    if (scenic && scenic.runtimeChapterIds) {
      this.safeNavigate('/pages/explore-map/index');
      return;
    }
    this.showFallbackToast('探索地图功能即将开放');
  },

  onNavigate() {
    this.showFallbackToast('导航功能即将开放');
  },

  onOpenRights() {
    this.safeNavigate('/pages/rights-center/index');
  },

  onOpenMerchantEvent() {
    this.safeNavigate('/pages/merchant-event/index/index');
  },

  onOpenMerchantEventExploration() {
    this.safeNavigate('/pages/merchant-event/exploration/index');
  },

  onStartCheckIn() {
    this.safeNavigate('/pages/merchant-event/exploration/index');
  },

  onBottomNavChange() {}
});

