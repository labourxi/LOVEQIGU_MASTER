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
    title: 'Lottie',
    intro: 'Motion templates reuse approved language and only support the existing RC1 closure chain.',
    highlights: ['Expression only', 'No Canon change', 'Continue to Echo'],
    sectionTitle: 'Motion templates',
    sectionSubtitle: 'Templates stay within the approved motion-design boundary.',
    actionLabel: 'Open Echo',
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
