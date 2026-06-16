const merchantEventService = require('../../../services/merchant-event');

function buildPageData() {
  return merchantEventService.getActivityOverview(merchantEventService.ACTIVITY_ID);
}

Page({
  data: buildPageData(),

  onLoad() {
    this.refresh();
  },

  refresh() {
    this.setData(buildPageData());
  },

  onOpenDetail(event) {
    const pointId = event.currentTarget.dataset.pointId;
    if (pointId) {
      wx.navigateTo({ url: `/pages/merchant-event/detail/index?pointId=${pointId}` });
    }
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  }
});

