const storyService = require('../../services/story/story-service');
const arService = require('../../services/ar/ar-service');

const NODE_STATUS_LABELS = {
  available: '已发现',
  placeholder: '待探索',
  mvp_placeholder: '待探索'
};

function getPrimaryChapter() {
  const chapters = storyService.getAllChapters();
  return chapters[0] || null;
}

function hasArEntry(node) {
  return (node.ar_event_refs || []).some((eventId) => arService.getArEventById(eventId));
}

function mapLocations(chapter) {
  if (!chapter) {
    return [];
  }

  return storyService.getNodesByChapterId(chapter.id).map((node) => {
    const arCount = (node.ar_event_refs || []).length;
    const relicCount = (node.relic_refs || []).length;

    return {
      name: node.title,
      region: '探索区域',
      state: NODE_STATUS_LABELS[node.status] || node.status,
      copy: hasArEntry(node)
        ? `已连接 ${arCount} 个 AR 入口，关联 ${relicCount} 个信物。`
        : `数据模型节点，关联 ${relicCount} 个信物。`
    };
  });
}

function buildPageData() {
  const chapter = getPrimaryChapter();
  const locations = mapLocations(chapter);
  const arEvents = arService.getAllArEvents();

  return {
    progress: {
      chapter: chapter ? chapter.title : '章节待接入',
      explored: chapter && chapter.progress ? chapter.progress.explored_nodes : 0,
      total: chapter && chapter.progress ? chapter.progress.total_nodes : locations.length,
      note: '个人探索进度来自故事数据模型。'
    },
    regions: [
      {
        name: '探索区域',
        desc: `当前已接入 ${locations.length} 个探索节点与 ${arEvents.length} 个 AR 入口。`,
        status: '开放探索'
      },
      {
        name: '后续区域',
        desc: '保留区域容器，等待正式 L2 数据接入。',
        status: '待接入'
      }
    ],
    locations,
    arEvents
  };
}

Page({
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onOpenAr() {
    wx.navigateTo({
      url: '/pages/ar-entry/index'
    });
  }
});
