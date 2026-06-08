const CHAPTERS = [
  {
    id: 'ch01_cloud_awakening',
    title: '云门初醒',
    progress: {
      explored_nodes: 1,
      total_nodes: 3
    },
    nodes: [
      {
        id: 'n1_gate',
        title: '门前阈值',
        status: 'available',
        ar_event_refs: ['ar_gate_open_v1'],
        relic_refs: ['relic_ch01_gate'],
      },
      {
        id: 'n2_plaza',
        title: '中央广场',
        status: 'mvp_placeholder',
        ar_event_refs: ['ar_imprint_particles_v1'],
        relic_refs: ['relic_ch01_plaza'],
      },
      {
        id: 'n3_field',
        title: '云间留痕',
        status: 'placeholder',
        ar_event_refs: ['ar_gate_open_v1'],
        relic_refs: ['relic_ch01_field'],
      }
    ]
  }
];

function getAllChapters() {
  return CHAPTERS.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    progress: { ...chapter.progress },
    nodes: chapter.nodes.map((node) => ({ ...node }))
  }));
}

function getChapterById(id) {
  return getAllChapters().find((chapter) => chapter.id === id) || null;
}

function getNodesByChapterId(chapterId) {
  const chapter = getChapterById(chapterId);
  return chapter ? chapter.nodes : [];
}

module.exports = {
  getAllChapters,
  getChapterById,
  getNodesByChapterId
};
