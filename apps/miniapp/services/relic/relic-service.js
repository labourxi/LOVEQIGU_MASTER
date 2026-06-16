const chapterRegistry = require('../chapter/chapter-runtime-registry');
const relicAliasService = require('../relic-alias/relic-alias-service');

function getAllRelics() {
  return chapterRegistry.getAllRelics().map((relic) => relicAliasService.enrichRelic({ ...relic }));
}

function getRelicById(id) {
  const relic = chapterRegistry.getRelicById(id);
  return relicAliasService.enrichRelic(relic ? { ...relic } : null);
}

function getRelicsByChapterId(chapterId) {
  return chapterRegistry
    .getRelicsByChapterId(chapterId)
    .map((relic) => relicAliasService.enrichRelic({ ...relic }));
}

function getAssetBoundary() {
  return chapterRegistry.getAssetBoundary();
}

module.exports = {
  getAllRelics,
  getRelicById,
  getRelicsByChapterId,
  getAssetBoundary
};
