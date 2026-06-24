/**
 * Unified chapter runtime registry - lazy loads chapter bridges on demand.
 * No chapter bridge is required at module load time.
 */

const CHAPTER_LOADERS = {
  CH01: () => require('./ch01-runtime-bridge'),
  CH02: () => require('./ch02-runtime-bridge'),
  CH03: () => require('./ch03-runtime-bridge'),
  CH04: () => require('./ch04-runtime-bridge'),
  CH05: () => require('./ch05-runtime-bridge'),
  CH06: () => require('./ch06-runtime-bridge'),
  CH07: () => require('./ch07-runtime-bridge'),
  CH08: () => require('./ch08-runtime-bridge'),
  CH09: () => require('./ch09-runtime-bridge'),
  CH10: () => require('./ch10-runtime-bridge')
};

const CHAPTER_IDS = Object.keys(CHAPTER_LOADERS);
const bridgeCache = Object.create(null);

function loadBridgeByCode(chapterCode) {
  if (!chapterCode || !CHAPTER_LOADERS[chapterCode]) {
    return null;
  }
  if (!bridgeCache[chapterCode]) {
    const factory = CHAPTER_LOADERS[chapterCode];
    bridgeCache[chapterCode] = factory();
  }
  return bridgeCache[chapterCode];
}

function loadChapter(chapterCode) {
  return loadBridgeByCode(chapterCode);
}

function loadAllBridges() {
  return CHAPTER_IDS.map((chapterCode) => loadBridgeByCode(chapterCode)).filter(Boolean);
}

function getRegisteredBridges() {
  return loadAllBridges().map((bridge) => ({ ...bridge }));
}

function getAllChapters() {
  return loadAllBridges().map((bridge) => bridge.getStoryChapter());
}

function getChapterById(id) {
  const bridge = loadAllBridges().find((item) => item.CHAPTER_ID === id);
  return bridge ? bridge.getStoryChapter() : null;
}

function getNodesByChapterId(chapterId) {
  const chapter = getChapterById(chapterId);
  return chapter ? chapter.nodes : [];
}

function getAllRelics() {
  return loadAllBridges().flatMap((bridge) => bridge.getRelics());
}

function getRelicById(id) {
  return getAllRelics().find((relic) => relic.id === id) || null;
}

function getRelicsByChapterId(chapterId) {
  return getAllRelics().filter((relic) => relic.chapter_id === chapterId);
}

function getAllRights() {
  return loadAllBridges().flatMap((bridge) => bridge.getRights());
}

function getRightById(id) {
  return getAllRights().find((right) => right.id === id) || null;
}

function getRightsByChapterId(chapterId) {
  return getAllRights().filter((right) => right.chapter_id === chapterId);
}

function getAllArEvents() {
  return loadAllBridges().flatMap((bridge) => bridge.getArEvents());
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
  return loadAllBridges().map((bridge) => bridge.getDigitalCollectible());
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
  const bridge = loadBridgeByCode('CH01');
  return bridge ? bridge.getAssetBoundary() : null;
}

function validateAllCrossRefs() {
  const results = loadAllBridges().map((bridge) => bridge.validateCrossRefs());
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

  loadAllBridges().forEach((bridge) => {
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
  loadChapter,
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
