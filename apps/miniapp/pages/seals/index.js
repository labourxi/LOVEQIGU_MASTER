const synthesisService = require('../../services/synthesis/synthesis-service');

function buildPageData() {
  const heaven = synthesisService.getHeavenSealProgress();
  const human = synthesisService.getHumanSealProgress();
  return {
    title: '印鉴进度',
    subtitle: '天印与人印合成进度',
    heaven,
    human
  };
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
