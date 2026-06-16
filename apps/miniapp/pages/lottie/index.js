const lottieService = require('../../services/lottie/lottie-service');

function mapTemplates() {
  return lottieService.getAllLotties().map((item) => ({
    id: item.template_id,
    title: item.title,
    meta: item.category,
    copy: item.copy,
    tag: item.usage,
    path: '/pages/echo/index'
  }));
}

function buildPageData() {
  return {
    title: '动效模板',
    intro: '动效模板复用已定语言，仅支持现有闭合链路。',
    highlights: ['仅表达层', '不改世界观', '继续回响'],
    sectionTitle: '动效模板',
    sectionSubtitle: '模板保持在已定动效设计边界内。',
    actionLabel: '进入回响',
    items: mapTemplates()
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onNavigate(event) {
    const { path } = event.currentTarget.dataset;

    wx.navigateTo({
      url: path
    });
  }
});
