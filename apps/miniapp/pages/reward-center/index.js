const rewardCenterService = require('../../services/reward/reward-center-service');
const safeInteraction = require('../../behaviors/safe-interaction');

function buildPageData() {
  return rewardCenterService.getRewardCenter();
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.refreshData();
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    try {
      this.setData(buildPageData());
    } catch (error) {
      console.error('[reward-center.refreshData]', error);
      this.showFallbackToast('功能开发中');
    }
  },

  onBackHome() {
    this.safeNavigate('/pages/index/index', {
      fallbackTitle: '首页暂未开放'
    });
  }
});
