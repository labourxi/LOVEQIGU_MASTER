const relicService = require('../../services/relic/relic-service');
const storyService = require('../../services/story/story-service');

const RELIC_TYPE_LABELS = {
  awareness_relic: '觉察信物',
  imprint_relic: '残印信物',
  chapter_completion_relic: '章成信物'
};

const RELIC_STATUS_LABELS = {
  recorded: '已记录',
  placeholder: '待记录'
};

function getChapterTitle(chapterId) {
  const chapter = storyService.getChapterById(chapterId);
  return chapter ? chapter.title : chapterId;
}

function getNodeTitle(chapterId, nodeId) {
  const node = storyService.getNodesByChapterId(chapterId).find((item) => item.id === nodeId);
  return node ? node.title : nodeId;
}

function mapRecords() {
  return relicService.getAllRelics().map((relic) => ({
    name: relic.name,
    chapter: getChapterTitle(relic.chapter_id),
    type: RELIC_TYPE_LABELS[relic.type] || relic.type,
    source: getNodeTitle(relic.chapter_id, relic.node_id),
    status: RELIC_STATUS_LABELS[relic.status] || relic.status,
    meaning: relic.display_copy
  }));
}

function buildPageData() {
  const boundary = relicService.getAssetBoundary();

  return {
    title: '信物档案',
    intro: '信物是故事进度资产，用于记录探索、印迹与章成结果。',
    records: mapRecords(),
    boundary: boundary.rule
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  }
});
