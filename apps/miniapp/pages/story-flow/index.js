const storyFlowService = require('../../services/story/story-flow-service');

function mapFlows() {
  return storyFlowService.getAllStoryFlows().map((flow) => ({
    id: flow.flow_id,
    title: flow.title,
    meta: '云门初醒',
    copy: flow.copy,
    tag: '场域闭合',
    path: flow.closure_path
  }));
}

function buildPageData() {
  return {
    title: '故事流程',
    intro: '故事流程执行打开场域体验闭合步骤，随后进入回响。',
    highlights: ['执行展示面', '不新增世界观', '继续场域闭合'],
    sectionTitle: '故事流程',
    sectionSubtitle: '流程定义仅引用已定初觉章节资产。',
    actionLabel: '进入场域闭合',
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
