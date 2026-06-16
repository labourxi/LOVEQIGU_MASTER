const chapterRegistry = require('../chapter/chapter-runtime-registry');

function getAllChapters() {
  return chapterRegistry.getAllChapters().map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    display_title: chapter.display_title,
    status: chapter.status,
    summary: chapter.summary,
    progress: { ...chapter.progress },
    nodes: chapter.nodes.map((node) => ({ ...node }))
  }));
}

function getChapterById(id) {
  const chapter = chapterRegistry.getChapterById(id);
  if (!chapter) return null;
  return {
    id: chapter.id,
    title: chapter.title,
    display_title: chapter.display_title,
    status: chapter.status,
    summary: chapter.summary,
    progress: { ...chapter.progress },
    nodes: chapter.nodes.map((node) => ({ ...node }))
  };
}

function getNodesByChapterId(chapterId) {
  return chapterRegistry.getNodesByChapterId(chapterId);
}

module.exports = {
  getAllChapters,
  getChapterById,
  getNodesByChapterId
};
