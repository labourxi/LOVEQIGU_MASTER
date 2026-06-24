const userProgress = require('../../services/user-progress/index');
const merchantEventService = require('../../services/merchant-event');
const userFrontend = require('../../services/user-frontend.js');
const safeInteraction = require('../../behaviors/safe-interaction');

function buildPageData() {
  const progress = userProgress.readProgress();
  const overview = merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
  const activityProgress = progress.event.activities[merchantEventService.ACTIVITY_ID] || {};
  const journey = userFrontend.buildJourneySummary();
  const completionRate = overview.stats.completionRate;

  return {
    activeTab: 'progress',
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
    merchantHighlights: overview.points,
    bottomNav: journey.nav
  };
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.refresh();
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.refresh());
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refresh());
    }
  },

  onShow() {
    this.refresh();
    if (merchantEventService.ensureReadyAsync) {
      merchantEventService.ensureReadyAsync().then(() => this.refresh());
    }
    if (userFrontend.ensureReadyAsync) {
      userFrontend.ensureReadyAsync().then(() => this.refresh());
    }
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenEvent() {
    this.safeNavigate('/pages/merchant-event/index/index', {
      fallbackTitle: '活动页暂未开放'
    });
  },

  onOpenExploration() {
    this.safeNavigate('/pages/explore-map/index', {
      fallbackTitle: '探索地图暂未开放'
    });
  },

  onOpenCompletion() {
    if (!this.data.isComplete) {
      this.showFallbackToast('活动尚未完成');
      return;
    }
    this.safeNavigate('/pages/event-complete/index');
  },

  onBottomNavChange() {}
});
