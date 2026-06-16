const chapterRegistry = require('../chapter/chapter-runtime-registry');

function getAllArEvents() {
  return chapterRegistry.getAllArEvents().map((event) => ({ ...event }));
}

function getArEventById(id) {
  return chapterRegistry.getArEventById(id);
}

function getArEventByCode(code) {
  return chapterRegistry.getArEventByCode(code);
}

function getArEventsByChapterId(chapterId) {
  return chapterRegistry.getArEventsByChapterId(chapterId);
}

module.exports = {
  getAllArEvents,
  getArEventById,
  getArEventByCode,
  getArEventsByChapterId
};
