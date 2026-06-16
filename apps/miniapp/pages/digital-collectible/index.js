const digitalCollectibleService = require('../../services/digital-collectible/digital-collectible-service');

function mapCollectibles() {
  return digitalCollectibleService.getAllDigitalCollectibles().map((item) => ({
    id: item.collectible_id || item.token_id,
    title: item.title || item.name,
    meta: item.role || '传播资产',
    copy: item.copy,
    tag: item.display_context || '传播',
    path: item.next_path || '/pages/next-activity/index'
  }));
}

function buildPageData() {
  return {
    title: '数字藏品',
    intro: '数字藏品保持在营销与传播边界，不解锁信物进度。',
    highlights: ['传播资产', '无进度影响', '继续下一步活动'],
    sectionTitle: '数字藏品',
    sectionSubtitle: '记录仅供展示的传播资产。',
    actionLabel: '进入下一步活动',
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
