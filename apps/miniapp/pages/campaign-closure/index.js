const campaignService = require('../../services/campaign/campaign-service');

function mapCampaigns() {
  return campaignService.getAllCampaigns().map((item) => ({
    id: item.campaign_id,
    title: item.title,
    meta: item.season_ref,
    copy: item.copy,
    tag: '活动记念',
    path: item.next_path
  }));
}

function buildPageData() {
  return {
    title: '活动记念',
    intro: '活动记念打包运营模板，随后进入下一步活动。',
    highlights: ['仅用已定运营引用', '不新增世界观', '继续下一步活动'],
    sectionTitle: '活动模板',
    sectionSubtitle: '模板仅引用已定故事与资产标识。',
    actionLabel: '进入下一步活动',
    items: mapCampaigns()
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
