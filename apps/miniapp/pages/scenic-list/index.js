const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');
const safeInteraction = require('../../behaviors/safe-interaction');

function buildPageData() {
  const list = prototypeRuntime.getScenicList();
  return {
    nearby: list.nearby,
    hot: list.hot,
    recommended: list.recommended
  };
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onOpenDetail(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(`/pages/scenic-detail/index?id=${id}`);
  }
});
