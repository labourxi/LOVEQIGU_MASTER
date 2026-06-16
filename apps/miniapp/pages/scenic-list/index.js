const prototypeRuntime = require('../../services/prototype/prototype-runtime-service');

function buildPageData() {
  const list = prototypeRuntime.getScenicList();
  return {
    nearby: list.nearby,
    hot: list.hot,
    recommended: list.recommended
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onOpenDetail(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      return;
    }
    wx.navigateTo({ url: `/pages/scenic-detail/index?id=${id}` });
  }
});
