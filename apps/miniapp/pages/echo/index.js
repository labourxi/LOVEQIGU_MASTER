const echoService = require('../../services/echo/echo-service');

function mapEchoes() {
  return echoService.getAllEchoes().map((item) => ({
    id: item.echo_id,
    title: item.title,
    meta: item.source,
    copy: item.copy,
    tag: 'Echo',
    path: '/pages/digital-collectible/index'
  }));
}

function buildPageData() {
  return {
    title: 'Echo',
    intro: 'Echo closes the AR event response and hands the user into Digital Collectible.',
    highlights: ['Closure step', 'No new lore', 'Continue to Digital Collectible'],
    sectionTitle: 'Echo states',
    sectionSubtitle: 'Only existing echo references are exposed here.',
    actionLabel: 'Open Digital Collectible',
    items: mapEchoes()
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
