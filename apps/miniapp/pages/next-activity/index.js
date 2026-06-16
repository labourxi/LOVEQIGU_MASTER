const nextActivityService = require('../../services/next-activity/next-activity-service');

function mapActivities() {
  return nextActivityService.getAllNextActivities().map((item) => ({
    id: item.activity_id,
    title: item.title,
    meta: '应用内路由',
    copy: item.copy,
    tag: '下一步',
    path: item.path
  }));
}

function buildPageData() {
  return {
    title: '下一步活动',
    intro: '此终端页面将用户带回已有应用目的地。',
    highlights: ['终端步骤', '不新增世界观', '复用已有路由'],
    sectionTitle: '下一步目的地',
    sectionSubtitle: '路由保持在现有应用结构内。',
    actionLabel: '前往',
    items: mapActivities()
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
