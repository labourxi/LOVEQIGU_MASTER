const rewardCenterService = require('../../services/reward/reward-center-service');

function buildPageData() {
  return rewardCenterService.getRewardCenter();
}

Page({
  data: buildPageData(),

  onLoad() {
    this.refreshData();
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    this.setData(buildPageData());
  }
});
