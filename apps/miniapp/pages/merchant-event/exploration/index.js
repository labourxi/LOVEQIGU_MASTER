const merchantEventService = require('../../../services/merchant-event');
const safeInteraction = require('../../../behaviors/safe-interaction');

function buildPageData() {
  return merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.refresh();
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenDetail(event) {
    const pointId = event.currentTarget.dataset.pointId;
    if (!pointId) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(`/pages/merchant-event/detail/index?pointId=${pointId}`);
  },

  onBack() {
    if (typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          this.showFallbackToast('页面暂未开放');
        }
      });
      return;
    }
    this.showFallbackToast('页面暂未开放');
  }
});
