const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');
const userProgress = require('../../services/user-progress');
const merchantEventService = require('../../services/merchant-event');

function buildEventSummary() {
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const progress = userProgress.readProgress();
  const activity = progress.event.activities[merchantEventService.ACTIVITY_ID] || {};
  return {
    title: overview.activity.event_name,
    status: overview.activity.status,
    completedTaskCount: overview.stats.completedTaskCount,
    ownedRelicCount: overview.stats.ownedRelicCount,
    claimedCouponCount: overview.stats.claimedCouponCount,
    enteredAt: activity.entered_at || '未进入',
    latestCoupon: (activity.coupons || []).find((item) => item && item.status === 'CLAIMED') || null
  };
}

function buildPageData() {
  const base = prototypeRuntime.getProfileDashboard();
  return {
    ...base,
    eventSummary: buildEventSummary()
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.refresh();
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenScenic(event) {
    const { id } = event.currentTarget.dataset;
    if (id) {
      wx.navigateTo({ url: `/pages/scenic-detail/index?id=${id}` });
    }
  },

  onOpenStarMap() {
    wx.navigateTo({ url: '/pages/star-map/index' });
  },

  onOpenMeridianMap() {
    wx.navigateTo({ url: '/pages/meridian-map/index' });
  },

  onOpenRelicArchive() {
    wx.navigateTo({ url: '/pages/relic-archive/index' });
  },

  onOpenMerchantEvent() {
    wx.navigateTo({ url: '/pages/merchant-event/index/index' });
  }
});

