const digitalCollectibleService = require('../../services/digital-collectible/digital-collectible-service');

function mapCollectibles() {
  return digitalCollectibleService.getAllDigitalCollectibles().map((item) => ({
    id: item.collectible_id,
    title: item.title,
    meta: item.role,
    copy: item.copy,
    tag: item.display_context,
    path: item.next_path
  }));
}

function buildPageData() {
  return {
    title: 'Digital Collectible',
    intro: 'Digital Collectible stays in the marketing and communication boundary and does not unlock Relics.',
    highlights: ['Communication asset', 'No progression effect', 'Continue to Next Activity'],
    sectionTitle: 'Collectibles',
    sectionSubtitle: 'These records are display-only communication assets.',
    actionLabel: 'Open Next Activity',
    items: mapCollectibles()
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
