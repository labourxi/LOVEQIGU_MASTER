const storyService = require('../../services/story/story-service');
const storyFlowService = require('../../services/story/story-flow-service');

const CHAPTER_STATUS_LABELS = {
  mvp_placeholder: 'Structure ready',
  placeholder: 'Pending entry'
};

function mapTimeline() {
  return storyService.getAllChapters().map((chapter) => ({
    id: chapter.id,
    phase: 'Chapter',
    chapter: chapter.title,
    status: CHAPTER_STATUS_LABELS[chapter.status] || chapter.status,
    copy: `${chapter.summary} Includes ${storyService.getNodesByChapterId(chapter.id).length} nodes.`
  }));
}

function buildPageData() {
  return {
    title: 'Story Archive',
    intro: 'Timeline, chapter structure, and archive view are kept read-only while the user opens Story Flow execution.',
    archiveRules: [
      'Chapter timeline only',
      'Read-only archive surface',
      'No new Canon'
    ],
    storyFlowCount: storyFlowService.getAllStoryFlows().length,
    primaryLabel: 'Open Story Flow',
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
