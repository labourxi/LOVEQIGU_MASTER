const userProgress = require('../../services/user-progress');
const merchantEventService = require('../../services/merchant-event');

function uniqueMerchants(points) {
  const seen = new Set();
  return points.filter((point) => {
    if (!point || !point.merchant_id || seen.has(point.merchant_id)) {
      return false;
    }
    seen.add(point.merchant_id);
    return true;
  });
}

function buildPageData() {
  const progress = userProgress.readProgress();
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const activityProgress = progress.event.activities[merchantEventService.ACTIVITY_ID] || {};
  const completionRate = overview.stats.completionRate;

  return {
    activity: overview.activity,
    completionRate,
    isComplete: overview.isComplete,
    stats: [
      { label: '完成任务数', value: overview.stats.completedTaskCount, unit: '个' },
      { label: '已获信物数', value: overview.stats.ownedRelicCount, unit: '个' },
      { label: '已领卡券数', value: overview.stats.claimedCouponCount, unit: '张' },
      { label: '活动完成度', value: completionRate, unit: '%' }
    ],
    progressSummary: {
      enteredAt: activityProgress.entered_at || '',
      completedTasks: overview.stats.completedTaskCount,
      taskCount: overview.stats.taskCount,
      ownedRelics: overview.stats.ownedRelicCount,
      claimedCoupons: overview.stats.claimedCouponCount
    },
    tasks: overview.tasks,
    relics: overview.relics,
    coupons: overview.coupons,
    merchantHighlights: uniqueMerchants(overview.points)
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.refresh();
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenEvent() {
    wx.navigateTo({ url: '/pages/merchant-event/index/index' });
  },

  onOpenExploration() {
    wx.navigateTo({ url: '/pages/merchant-event/exploration/index' });
  },

  onOpenCompletion() {
    if (!this.data.isComplete) {
      return;
    }
    wx.navigateTo({ url: '/pages/event-complete/index' });
  }
});
