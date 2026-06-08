const storyFlowService = require('../../services/story/story-flow-service');

function mapFlows() {
  return storyFlowService.getAllStoryFlows().map((flow) => ({
    id: flow.flow_id,
    title: flow.title,
    meta: flow.flow_id,
    copy: flow.copy,
    tag: 'AR Closure',
    path: flow.closure_path
  }));
}

function buildPageData() {
  return {
    title: 'Story Flow',
    intro: 'Story Flow execution opens the AR event closure step and then hands off to Echo.',
    highlights: ['Execution surface', 'No new Canon', 'Continue to AR closure'],
    sectionTitle: 'Story flows',
    sectionSubtitle: 'These flow definitions only reference approved CH01 assets.',
    actionLabel: 'Open AR Closure',
    items: mapFlows()
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
