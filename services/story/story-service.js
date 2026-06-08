const data = require('../../data/story/chapters.json');

function loadData() {
  return data;
}

function getAllChapters() {
  return loadData().chapters;
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
  getNodesByChapterId,
};
