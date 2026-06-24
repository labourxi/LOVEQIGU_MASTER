const merchantEventService = require('../../../services/merchant-event');
const safeInteraction = require('../../../behaviors/safe-interaction');

function buildPageData() {
  const overview = merchantEventService.enterActivity(merchantEventService.ACTIVITY_ID);
  return {
    activity: overview.activity,
    stats: [
      { label: '已完成任务', value: overview.stats.completedTaskCount, unit: '个' },
      { label: '已获信物', value: overview.stats.ownedRelicCount, unit: '件' },
      { label: '已领卡券', value: overview.stats.claimedCouponCount, unit: '张' },
      { label: '已探索点', value: overview.stats.exploredCount, unit: '处' }
    ],
    points: overview.points,
    tasks: overview.tasks,
    relics: overview.relics,
    coupons: overview.coupons
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
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenExploration() {
    this.safeNavigate('/pages/merchant-event/exploration/index');
  },

  onOpenPoint(event) {
    const pointId = event.currentTarget.dataset.pointId;
    if (!pointId) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(`/pages/merchant-event/detail/index?pointId=${pointId}`);
  },

  onCompleteTask(event) {
    const taskId = event.currentTarget.dataset.taskId;
    if (!taskId) {
      this.showFallbackToast('功能开发中');
      return;
    }
    merchantEventService.completeTask(merchantEventService.ACTIVITY_ID, taskId);
    this.refresh();
  },

  onClaimCoupon(event) {
    const couponId = event.currentTarget.dataset.couponId;
    if (!couponId) {
      this.showFallbackToast('功能开发中');
      return;
    }
    merchantEventService.claimCoupon(merchantEventService.ACTIVITY_ID, couponId);
    this.refresh();
  }
});
