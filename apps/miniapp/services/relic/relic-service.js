const RELICS = [
  {
    id: 'relic_ch01_gate',
    name: '门前徽章',
    chapter_id: 'ch01_cloud_awakening',
    node_id: 'n1_gate',
    type: 'awareness_relic',
    status: 'recorded',
    display_copy: '探索地图中的门前标记。'
  },
  {
    id: 'relic_ch01_plaza',
    name: '中央印痕',
    chapter_id: 'ch01_cloud_awakening',
    node_id: 'n2_plaza',
    type: 'imprint_relic',
    status: 'recorded',
    display_copy: '章节中央节点的进度记录。'
  },
  {
    id: 'relic_ch01_field',
    name: '云间纪记',
    chapter_id: 'ch01_cloud_awakening',
    node_id: 'n3_field',
    type: 'chapter_completion_relic',
    status: 'recorded',
    display_copy: '章节收束后的可见记录。'
  }
];

function getAllRelics() {
  return RELICS.map((relic) => ({ ...relic }));
}

function getRelicById(id) {
  return getAllRelics().find((relic) => relic.id === id) || null;
}

function getRelicsByChapterId(chapterId) {
  return getAllRelics().filter((relic) => relic.chapter_id === chapterId);
}

function getAssetBoundary() {
  return {
    rule: '信物用于故事进度展示；数字藏品用于营销与传播。',
    note: 'Relic 和 Digital Collectible 保持分离。'
  };
}

module.exports = {
  getAllRelics,
  getRelicById,
  getRelicsByChapterId,
  getAssetBoundary
};
