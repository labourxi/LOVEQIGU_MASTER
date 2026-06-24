const synthesisService = require('../../services/synthesis/synthesis-service');
const safeInteraction = require('../../behaviors/safe-interaction');

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
      console.error('[seals.refreshData]', error);
      this.showFallbackToast('功能开发中');
    }
  },

  onBackHome() {
    this.safeNavigate('/pages/index/index', {
      fallbackTitle: '首页暂未开放'
    });
  }
});
