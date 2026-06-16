const story = require('../../apps/miniapp/services/story/story-service');
const relic = require('../../apps/miniapp/services/relic/relic-service');
const rights = require('../../apps/miniapp/services/rights/rights-service');
const ar = require('../../apps/miniapp/services/ar/ar-service');
const dc = require('../../apps/miniapp/services/digital-collectible/digital-collectible-service');
const registry = require('../../apps/miniapp/services/chapter/chapter-runtime-registry');

const CHAPTER_IDS = registry.CHAPTER_IDS;
const BRIDGE_COUNT = CHAPTER_IDS.length;
const audit = registry.auditAgainstContent();
const cross = registry.validateAllCrossRefs();
const chapters = story.getAllChapters();
const chapterDcs = registry.getChapterDigitalCollectibles();

const report = {
  getAllChapters: chapters.length,
  chapterTitles: chapters.map((c) => ({ id: c.id, title: c.title, nodes: c.nodes.length })),
  getAllRelics: relic.getAllRelics().length,
  getAllRights: rights.getAllRights().length,
  getAllArEvents: ar.getAllArEvents().length,
  getAllDigitalCollectibles: dc.getAllDigitalCollectibles().length,
  chapterBreakdown: CHAPTER_IDS.map((id) => ({
    id,
    title: story.getChapterById(id) && story.getChapterById(id).title,
    nodes: story.getNodesByChapterId(id).length,
    relics: relic.getRelicsByChapterId(id).length,
    rights: rights.getRightsByChapterId(id).length,
    ar: ar.getArEventsByChapterId(id).length,
    dc: dc.getDigitalCollectibleByChapterId(id).map((x) => x.token_id || x.collectible_id)
  })),
  dcById: chapterDcs.map((item) => ({
    id: item.token_id,
    found: !!dc.getDigitalCollectibleById(item.token_id)
  })),
  audit,
  cross
};

const expectedRelics = BRIDGE_COUNT * 6;
const expectedRights = BRIDGE_COUNT * 5;
const expectedAr = BRIDGE_COUNT * 6;

const ready =
  report.getAllChapters === BRIDGE_COUNT &&
  report.getAllRelics === expectedRelics &&
  report.getAllRights === expectedRights &&
  report.getAllArEvents === expectedAr &&
  report.dcById.every((item) => item.found) &&
  audit.ok &&
  cross.ok;

report.LOVEQIGU_RUNTIME_READY = ready ? 'YES' : 'NO';
console.log(JSON.stringify(report, null, 2));
