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
  const claimedCoupons = (activityProgress.coupons || []).filter((item) => item && item.status === 'CLAIMED');
  const ownedRelics = overview.relics.filter((item) => item.status === 'OWNED');

  return {
    activity: overview.activity,
    isComplete: overview.isComplete,
    summary: {
      completedTasks: overview.stats.completedTaskCount,
      taskCount: overview.stats.taskCount,
      ownedRelics: overview.stats.ownedRelicCount,
      claimedCoupons: overview.stats.claimedCouponCount,
      completionRate: overview.stats.completionRate
    },
    completionNote: overview.isComplete ? '恭喜完成全部探索任务' : '活动尚未完成，继续探索即可解锁',
    ownedRelics,
    claimedCoupons,
    recommendedMerchants: uniqueMerchants(overview.points),
    latestTask:
      activityProgress.completed_task_ids && activityProgress.completed_task_ids.length
        ? activityProgress.completed_task_ids[activityProgress.completed_task_ids.length - 1]
        : ''
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

  onBackToProgress() {
    wx.navigateTo({ url: '/pages/progress-center/index' });
  },

  onOpenEvent() {
    wx.navigateTo({ url: '/pages/merchant-event/index/index' });
  },

  onOpenExploration() {
    wx.navigateTo({ url: '/pages/merchant-event/exploration/index' });
  },

  onOpenRightsCenter() {
    wx.navigateTo({ url: '/pages/rights-center/index' });
  }
});
