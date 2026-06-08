const data = require('../../data/relics/relics.json');

function loadData() {
  return data;
}

function getAllRelics() {
  return loadData().relics;
}

function getRelicById(id) {
  return getAllRelics().find((relic) => relic.id === id) || null;
}

function getRelicsByChapterId(chapterId) {
  return getAllRelics().filter((relic) => relic.chapter_id === chapterId);
}

function getAssetBoundary() {
  return loadData().asset_boundary;
}

module.exports = {
  getAllRelics,
  getRelicById,
  getRelicsByChapterId,
  getAssetBoundary,
};
