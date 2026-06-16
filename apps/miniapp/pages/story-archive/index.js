const storyService = require('../../services/story/story-service');
const storyFlowService = require('../../services/story/story-flow-service');

const CHAPTER_STATUS_LABELS = {
  active: '进行中',
  available: '可探索',
  locked: '待解锁',
  mvp_placeholder: '结构就绪',
  placeholder: '待接入'
};

function mapTimeline() {
  return storyService.getAllChapters().map((chapter) => ({
    id: chapter.id,
    phase: '章节',
    chapter: chapter.title,
    status: CHAPTER_STATUS_LABELS[chapter.status] || chapter.status,
    copy: `${chapter.summary} 含 ${storyService.getNodesByChapterId(chapter.id).length} 个探索节点。`
  }));
}

function buildPageData() {
  return {
    title: '故事档案',
    intro: '时间线、章节结构与档案视图保持只读，可继续进入故事流程执行。',
    archiveRules: [
      '仅章节时间线',
      '只读档案展示',
      '不新增世界观内容'
    ],
    storyFlowCount: storyFlowService.getAllStoryFlows().length,
    primaryLabel: '进入故事流程',
    timeline: mapTimeline()
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onOpenStoryFlow() {
    wx.navigateTo({
      url: '/pages/story-flow/index'
    });
  }
});
