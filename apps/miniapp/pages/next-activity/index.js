const nextActivityService = require('../../services/next-activity/next-activity-service');

function mapActivities() {
  return nextActivityService.getAllNextActivities().map((item) => ({
    id: item.activity_id,
    title: item.title,
    meta: item.path,
    copy: item.copy,
    tag: 'Next Activity',
    path: item.path
  }));
}

function buildPageData() {
  return {
    title: 'Next Activity',
    intro: 'This terminal surface returns the user to an existing app destination.',
    highlights: ['Terminal step', 'No new Canon', 'Reuse existing routes'],
    sectionTitle: 'Next destinations',
    sectionSubtitle: 'These routes keep the journey inside the existing app structure.',
    actionLabel: 'Open Route',
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
