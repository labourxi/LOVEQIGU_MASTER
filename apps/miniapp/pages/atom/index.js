const atomService = require('../../services/atom/atom-service');
const safeInteraction = require('../../behaviors/safe-interaction');

function mapAtoms() {
  return atomService.getAllAtoms().map((atom) => ({
    id: atom.atom_id,
    title: atom.title,
    meta: '云门初醒流程',
    copy: atom.copy,
    tag: '内容节点',
    path: atom.next_path
  }));
}

function buildPageData() {
  return {
    title: '内容节点',
    intro: '探索路径从场域入口经内容节点记录进入动效步骤。',
    highlights: ['仅用已定初觉引用', '不新增世界观', '继续动效'],
    sectionTitle: '内容节点记录',
    sectionSubtitle: '条目仅展示已定流程引用。',
    actionLabel: '进入动效',
    items: mapAtoms()
  };
}

Page({
  behaviors: [safeInteraction],
  data: buildPageData(),

  onLoad() {
    this.setData(buildPageData());
  },

  onNavigate(event) {
    const { path } = event.currentTarget.dataset;
    if (!path) {
      this.showFallbackToast('功能开发中');
      return;
    }
    this.safeNavigate(path);
  }
});
