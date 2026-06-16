const merchantEventService = require('../../../services/merchant-event');

function buildPageData(pointId) {
  const detail =
    merchantEventService.getPointDetail(pointId) ||
    merchantEventService.getPointDetail('point_entrance_plaza');
  return {
    detail,
    activityId: merchantEventService.ACTIVITY_ID
  };
}

function safeToast(title, icon = 'none') {
  if (typeof wx !== 'undefined' && wx.showToast) {
    wx.showToast({ title, icon });
  }
}

function safeModal(options) {
  if (typeof wx !== 'undefined' && wx.showModal) {
    wx.showModal(options);
  }
}

function safeNavigate(url) {
  if (typeof wx !== 'undefined' && wx.navigateTo) {
    wx.navigateTo({ url });
  }
}

Page({
  data: buildPageData(''),

  onLoad(options) {
    this.pointId = options.pointId || 'point_entrance_plaza';
    this.refresh();
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData(buildPageData(this.pointId));
  },

  onBack() {
    if (typeof wx !== 'undefined' && wx.navigateBack) {
      wx.navigateBack({ delta: 1 });
    }
  },

  onOpenExploration() {
    safeNavigate('/pages/merchant-event/exploration/index');
  },

  onOpenProgressCenter() {
    safeNavigate('/pages/progress-center/index');
  },

  onCompleteTask() {
    const detail = this.data.detail;
    if (!detail || !detail.task || detail.task.status === 'COMPLETED') {
      return;
    }

    const overview = merchantEventService.completeTask(this.data.activityId, detail.task.task_id);
    safeToast('任务已完成', 'success');

    const updatedDetail = merchantEventService.getPointDetail(this.pointId);
    if (updatedDetail && updatedDetail.relic && updatedDetail.relic.status === 'OWNED') {
      safeToast(`获得信物：${updatedDetail.relic.relic_name}`, 'success');
    }

    this.refresh();

    if (overview && overview.isComplete) {
      safeModal({
        title: '活动完成',
        content: '已完成全部任务，前往活动完成页查看结果。',
        showCancel: false,
        success: () => safeNavigate('/pages/event-complete/index')
      });
    }
  },

  onClaimCoupon() {
    const detail = this.data.detail;
    if (!detail || !detail.coupon || detail.coupon.status !== 'AVAILABLE') {
      safeToast('请先完成任务并获得信物');
      return;
    }
    merchantEventService.claimCoupon(this.data.activityId, detail.coupon.coupon_id);
    safeToast('卡券已领取', 'success');
    this.refresh();
  }
});
