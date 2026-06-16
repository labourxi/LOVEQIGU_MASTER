const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');
const merchantEventService = require('../../services/merchant-event');

function buildPageData(id) {
  const scenic = prototypeRuntime.getScenicDetail(id);
  if (!scenic) {
    return {
      missing: true,
      title: '景区未找到'
    };
  }
  const eventOverview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  return {
    missing: false,
    scenic,
    eventOverview,
    eventQuickStats: [
      { label: '已完成任务', value: eventOverview.stats.completedTaskCount },
      { label: '已获信物', value: eventOverview.stats.ownedRelicCount },
      { label: '已领卡券', value: eventOverview.stats.claimedCouponCount }
    ]
  };
}

Page({
  data: buildPageData(''),

  onLoad(options) {
    this.setData(buildPageData(options.id || 'scenic_aiqiugu'));
  },

  onOpenExplore() {
    const scenic = this.data.scenic;
    if (scenic && scenic.runtimeChapterIds) {
      wx.navigateTo({ url: '/pages/explore-map/index' });
      return;
    }
    wx.showToast({ title: '探索地图功能即将开放', icon: 'none' });
  },

  onNavigate() {
    wx.showToast({ title: '导航功能即将开放', icon: 'none' });
  },

  onOpenRights() {
    wx.navigateTo({ url: '/pages/rights-center/index' });
  },

  onOpenMerchantEvent() {
    wx.navigateTo({ url: '/pages/merchant-event/index/index' });
  },

  onOpenMerchantEventExploration() {
    wx.navigateTo({ url: '/pages/merchant-event/exploration/index' });
  }
});

