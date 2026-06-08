const campaignService = require('../../services/campaign/campaign-service');

function mapCampaigns() {
  return campaignService.getAllCampaigns().map((item) => ({
    id: item.campaign_id,
    title: item.title,
    meta: item.season_ref,
    copy: item.copy,
    tag: item.story_flow_ref,
    path: item.next_path
  }));
}

function buildPageData() {
  return {
    title: 'Campaign Closure',
    intro: 'Campaign Closure packages the live-ops templates and hands the user to Next Activity.',
    highlights: ['Existing live-ops refs only', 'No new Canon', 'Continue to Next Activity'],
    sectionTitle: 'Campaign templates',
    sectionSubtitle: 'These templates only reference approved story and asset identifiers.',
    actionLabel: 'Open Next Activity',
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
