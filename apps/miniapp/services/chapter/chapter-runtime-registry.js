/**
 * Unified chapter runtime registry — CH01–CH10
 * Aligns with automation/chapters/registry.yaml chapter order.
 */
const ch01Bridge = require('./ch01-runtime-bridge');
const ch02Bridge = require('./ch02-runtime-bridge');
const ch03Bridge = require('./ch03-runtime-bridge');
const ch04Bridge = require('./ch04-runtime-bridge');
const ch05Bridge = require('./ch05-runtime-bridge');
const ch06Bridge = require('./ch06-runtime-bridge');
const ch07Bridge = require('./ch07-runtime-bridge');
const ch08Bridge = require('./ch08-runtime-bridge');
const ch09Bridge = require('./ch09-runtime-bridge');
const ch10Bridge = require('./ch10-runtime-bridge');

const BRIDGES = [
  ch01Bridge,
  ch02Bridge,
  ch03Bridge,
  ch04Bridge,
  ch05Bridge,
  ch06Bridge,
  ch07Bridge,
  ch08Bridge,
  ch09Bridge,
  ch10Bridge
];

const CHAPTER_IDS = BRIDGES.map((bridge) => bridge.CHAPTER_ID);

function getRegisteredBridges() {
  return BRIDGES.map((bridge) => ({ ...bridge }));
}

function getAllChapters() {
  return BRIDGES.map((bridge) => bridge.getStoryChapter());
}

function getChapterById(id) {
  const bridge = BRIDGES.find((item) => item.CHAPTER_ID === id);
  return bridge ? bridge.getStoryChapter() : null;
}

function getNodesByChapterId(chapterId) {
  const chapter = getChapterById(chapterId);
  return chapter ? chapter.nodes : [];
}

function getAllRelics() {
  return BRIDGES.flatMap((bridge) => bridge.getRelics());
}

function getRelicById(id) {
  return getAllRelics().find((relic) => relic.id === id) || null;
}

function getRelicsByChapterId(chapterId) {
  return getAllRelics().filter((relic) => relic.chapter_id === chapterId);
}

function getAllRights() {
  return BRIDGES.flatMap((bridge) => bridge.getRights());
}

function getRightById(id) {
  return getAllRights().find((right) => right.id === id) || null;
}

function getRightsByChapterId(chapterId) {
  return getAllRights().filter((right) => right.chapter_id === chapterId);
}

function getAllArEvents() {
  return BRIDGES.flatMap((bridge) => bridge.getArEvents());
}

function getArEventById(id) {
  return getAllArEvents().find((event) => event.id === id) || null;
}

function getArEventByCode(code) {
  return getAllArEvents().find((event) => event.code === code) || null;
}

function getArEventsByChapterId(chapterId) {
  return getAllArEvents().filter((event) => event.chapter_id === chapterId);
}

function getChapterDigitalCollectibles() {
  return BRIDGES.map((bridge) => bridge.getDigitalCollectible());
}

function getDigitalCollectibleById(id) {
  return getChapterDigitalCollectibles().find(
    (item) => item.token_id === id || item.collectible_id === id
  ) || null;
}

function getDigitalCollectiblesByChapterId(chapterId) {
  return getChapterDigitalCollectibles().filter((item) => item.chapter_id === chapterId);
}

function getAssetBoundary() {
  return ch01Bridge.getAssetBoundary();
}

function validateAllCrossRefs() {
  const results = BRIDGES.map((bridge) => bridge.validateCrossRefs());
  const errors = results.flatMap((result) =>
    result.errors.map((error) => `${result.chapter_code}: ${error}`)
  );
  return {
    ok: errors.length === 0,
    errors,
    chapters: results
  };
}

function auditAgainstContent() {
  const expected = { nodes: 5, relics: 6, rights: 5, ar: 6 };
  const issues = [];

  BRIDGES.forEach((bridge) => {
    const chapter = bridge.getStoryChapter();
    const counts = {
      nodes: chapter.nodes.length,
      relics: bridge.getRelics().length,
      rights: bridge.getRights().length,
      ar: bridge.getArEvents().length
    };
    Object.keys(expected).forEach((key) => {
      if (counts[key] !== expected[key]) {
        issues.push(`${bridge.CHAPTER_CODE} ${key}=${counts[key]} expected ${expected[key]}`);
      }
    });
    if (!bridge.getDigitalCollectible()) {
      issues.push(`${bridge.CHAPTER_CODE} missing digital collectible`);
    }
  });

  return { ok: issues.length === 0, issues };
}

module.exports = {
  CHAPTER_IDS,
  getRegisteredBridges,
  getAllChapters,
  getChapterById,
  getNodesByChapterId,
  getAllRelics,
  getRelicById,
  getRelicsByChapterId,
  getAllRights,
  getRightById,
  getRightsByChapterId,
  getAllArEvents,
  getArEventById,
  getArEventByCode,
  getArEventsByChapterId,
  getChapterDigitalCollectibles,
  getDigitalCollectibleById,
  getDigitalCollectiblesByChapterId,
  getAssetBoundary,
  validateAllCrossRefs,
  auditAgainstContent
};
