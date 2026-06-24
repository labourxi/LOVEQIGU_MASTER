const echoService = require('../../services/echo/echo-service');
const safeInteraction = require('../../behaviors/safe-interaction');

function mapEchoes() {
  return echoService.getAllEchoes().map((item) => ({
    id: item.echo_id,
    title: item.title,
    meta: item.source,
    copy: item.copy,
    tag: '回响',
    path: '/pages/digital-collectible/index'
  }));
}

function buildPageData() {
  return {
    title: '回响',
    intro: '回响闭合场域体验回应，随后进入数字藏品步骤。',
    highlights: ['闭合步骤', '不新增世界观', '继续数字藏品'],
    sectionTitle: '回响状态',
    sectionSubtitle: '仅展示已定回响引用。',
    actionLabel: '进入数字藏品',
    items: mapEchoes()
  };
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onNavigate(event) {
    const { path } = event.currentTarget.dataset;
    if (!path) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(path);
  }
});
