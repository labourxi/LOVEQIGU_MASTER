const storyService = require('../../services/story/story-service');
const arService = require('../../services/ar/ar-service');
const chapterPicker = require('../../services/explore-map/explore-map-chapter-picker-service');

const NODE_STATUS_LABELS = {
  available: '已发现',
  locked: '待解锁',
  placeholder: '待探索',
  mvp_placeholder: '待探索'
};

const EXPLORATION_STATUS = {
  available: '已探索',
  locked: '待解锁',
  placeholder: '待觉察',
  mvp_placeholder: '待觉察'
};

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
      id: node.id,
      name: node.title,
      region: '探索区域',
      state: EXPLORATION_STATUS[node.status] || NODE_STATUS_LABELS[node.status] || node.status,
      hasAr: hasArEntry(node),
      copy: hasArEntry(node)
        ? `已连接 ${arCount} 个 AR 入口，关联 ${relicCount} 个信物。`
        : `探索点节点，关联 ${relicCount} 个信物。`
    };
  });
}

function buildPageData(options) {
  const chapterOptions = chapterPicker.getAllChapterOptions();
  const selectedChapterId = chapterPicker.resolveChapterIdFromOptions(options || {});
  const selectedIndex = chapterPicker.getSelectedChapterIndex();
  const chapter = storyService.getChapterById(selectedChapterId);
  const locations = mapLocations(chapter);
  const arEvents = chapterPicker.getArEventsForChapter(selectedChapterId);

  return {
    chapterOptions,
    selectedChapterId,
    selectedChapterIndex: selectedIndex,
    selectedChapterLabel: chapterOptions[selectedIndex]
      ? chapterOptions[selectedIndex].label
      : '章节待接入',
    progress: {
      chapter: chapter ? chapter.title : '章节待接入',
      displayTitle: chapter && chapter.display_title ? chapter.display_title : '',
      explored: chapter && chapter.progress ? chapter.progress.explored_nodes : 0,
      total: chapter && chapter.progress ? chapter.progress.total_nodes : locations.length,
      note: '切换章节查看各章探索节点；个人进度来自故事数据模型。'
    },
    regions: [
      {
        name: '探索区域',
        desc: `《${chapter ? chapter.title : '—'}》已接入 ${locations.length} 个探索节点与 ${arEvents.length} 个 AR 入口。`,
        status: '开放探索'
      },
      {
        name: '章节切换',
        desc: `共 ${chapterOptions.length} 章可供浏览。`,
        status: '章节选择'
      }
    ],
    locations,
    arEvents
  };
}

Page({
  data: buildPageData(),

  onLoad(options) {
    this.setData(buildPageData(options));
  },

  onChapterPick(event) {
    const index = Number(event.detail.value);
    const option = this.data.chapterOptions[index];
    if (!option) {
      return;
    }
    chapterPicker.setSelectedChapterId(option.id);
    this.setData(buildPageData());
  },

  onOpenAr() {
    const chapterId = this.data.selectedChapterId || '';
    wx.navigateTo({
      url: `/pages/ar-entry/index?context=explore&chapterId=${chapterId}`
    });
  },

  onOpenArForNode() {
    this.onOpenAr();
  }
});
