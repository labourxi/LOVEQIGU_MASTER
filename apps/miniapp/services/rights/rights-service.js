const chapterRegistry = require('../chapter/chapter-runtime-registry');

function getAllRights() {
  return chapterRegistry.getAllRights().map((right) => ({
    ...right,
    redemption: right.redemption ? { ...right.redemption } : null
  }));
}

function getRightById(id) {
  return chapterRegistry.getRightById(id);
}

function getRightsByType(type) {
  return getAllRights().filter((right) => right.type === type);
}

function getRightsByChapterId(chapterId) {
  return chapterRegistry.getRightsByChapterId(chapterId);
}

module.exports = {
  getAllRights,
  getRightById,
  getRightsByType,
  getRightsByChapterId
};
