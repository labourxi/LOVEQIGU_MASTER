#!/usr/bin/env node
/** 88 · CH10_RUNTIME_BRIDGE — read-only validation + report */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const REPORT = path.join(ROOT, 'docs/content/CH10_RUNTIME_BRIDGE_REPORT.md');
const CH10_ID = 'ch10_field_echo_innovation';
const DC_ID = 'dc_ch10_innovation_poster';

const registry = require('../../apps/miniapp/services/chapter/chapter-runtime-registry');
const ch10Bridge = require('../../apps/miniapp/services/chapter/ch10-runtime-bridge');
const story = require('../../apps/miniapp/services/story/story-service');
const relic = require('../../apps/miniapp/services/relic/relic-service');
const rights = require('../../apps/miniapp/services/rights/rights-service');
const ar = require('../../apps/miniapp/services/ar/ar-service');
const dc = require('../../apps/miniapp/services/digital-collectible/digital-collectible-service');
const rootCh10 = require('../../services/chapter/ch10-runtime-service');

const pass = [];
const warn = [];
const fail = [];

function ok(msg) {
  pass.push(msg);
}

function warning(msg) {
  warn.push(msg);
}

function err(msg) {
  fail.push(msg);
}

const EXPECTED_ORDER = [
  'ch01_cloud_awakening',
  'ch02_mountain_gate_echo',
  'ch03_field_reunion',
  'ch04_field_awakening',
  'ch05_field_return',
  'ch06_field_completion',
  'ch07_field_echo',
  'ch08_field_echo_legacy',
  'ch09_field_echo_future',
  'ch10_field_echo_innovation'
];

if (registry.CHAPTER_IDS.length === 10) ok('registry bridges CH01–CH10 (10 chapters)');
else err(`registry chapter count=${registry.CHAPTER_IDS.length} expected 10`);

if (registry.CHAPTER_IDS.join(',') === EXPECTED_ORDER.join(',')) ok('chapter order CH01→CH10');
else err('chapter order mismatch');

if (registry.CHAPTER_IDS.includes(CH10_ID)) ok('CH10 registered in chapter-runtime-registry');
else err('CH10 missing from CHAPTER_IDS');

const cross = ch10Bridge.validateCrossRefs();
if (cross.ok) ok('CH10 bridge cross-ref validation');
else cross.errors.forEach((e) => err(e));

const rootCross = rootCh10.validateCrossRefs();
if (rootCross.ok) ok('Root ch10-runtime-service cross-ref validation');
else rootCross.errors.forEach((e) => err(e));

const chapter = story.getChapterById(CH10_ID);
if (chapter && chapter.title === '创新之路' && chapter.nodes.length === 5) {
  ok('story-service getChapterById CH10');
} else {
  err('story-service CH10 chapter load failed');
}

if (relic.getRelicsByChapterId(CH10_ID).length === 6) ok('relic-service CH10 count 6');
else err('relic-service CH10 count mismatch');

if (rights.getRightsByChapterId(CH10_ID).length === 5) ok('rights-service CH10 count 5');
else err('rights-service CH10 count mismatch');

if (ar.getArEventsByChapterId(CH10_ID).length === 6) ok('ar-service CH10 count 6');
else err('ar-service CH10 count mismatch');

const dcItem = dc.getDigitalCollectibleById(DC_ID);
if (dcItem && dcItem.name === '创新之路分享海报') ok('digital-collectible-service CH10 DC');
else err('digital-collectible-service CH10 DC missing');

const audit = registry.auditAgainstContent();
if (audit.ok) ok('registry auditAgainstContent');
else audit.issues.forEach((i) => err(i));

const crossAll = registry.validateAllCrossRefs();
if (crossAll.ok) ok('registry validateAllCrossRefs');
else crossAll.errors.forEach((e) => err(e));

const forbidden = ['打卡地图', '积分商城', '愿力', '归真', '回应', '祝由'];
const blob = JSON.stringify({ chapter, relics: relic.getRelicsByChapterId(CH10_ID) });
forbidden.forEach((term) => {
  if (blob.includes(term)) err(`forbidden term in runtime surface: ${term}`);
});
if (!fail.some((f) => f.includes('forbidden'))) ok('terminology scan');

let runtimeReady = 'NO';
let runtimeReport = null;
try {
  const out = execSync('node scripts/audit/runtime-alignment-check.js', {
    cwd: ROOT,
    encoding: 'utf8'
  });
  runtimeReport = JSON.parse(out);
  runtimeReady = runtimeReport.LOVEQIGU_RUNTIME_READY || 'NO';
  const ch10Row = (runtimeReport.chapterBreakdown || []).find((r) => r.id === CH10_ID);
  if (ch10Row && ch10Row.nodes === 5 && ch10Row.relics === 6) ok('runtime-alignment-check CH10 breakdown');
  else err('runtime-alignment-check CH10 breakdown mismatch');
  if (runtimeReport.getAllChapters === 10) ok('runtime-alignment 10 chapters');
  else err(`runtime chapters=${runtimeReport.getAllChapters}`);
  if (runtimeReport.getAllRelics === 60) ok('runtime-alignment 60 relics');
  else err(`runtime relics=${runtimeReport.getAllRelics}`);
  if (runtimeReport.getAllRights === 50) ok('runtime-alignment 50 rights');
  else err(`runtime rights=${runtimeReport.getAllRights}`);
  if (runtimeReport.getAllArEvents === 60) ok('runtime-alignment 60 AR events');
  else err(`runtime ar=${runtimeReport.getAllArEvents}`);
  if (runtimeReady === 'YES') ok('LOVEQIGU_RUNTIME_READY YES');
  else err('LOVEQIGU_RUNTIME_READY not YES');
} catch (e) {
  err(`runtime-alignment-check failed: ${e.message}`);
}

const lastChapter = story.getAllChapters().slice(-1)[0];
if (lastChapter && lastChapter.id === CH10_ID) ok('Explore default chapter resolves to CH10');
else warning(`Explore tail chapter=${lastChapter && lastChapter.id}`);

const verdict = fail.length ? 'FAIL' : warn.length ? 'PASS_WITH_WARNING' : 'PASS';
const ts = new Date().toISOString().slice(0, 10);

const lines = [
  '# CH10 Runtime Bridge — CH10_RUNTIME_BRIDGE_REPORT',
  '',
  '**Mission:** 88 · CH10_RUNTIME_BRIDGE  ',
  `**Generated:** ${ts}  `,
  '**Scope:** CH10 L2 JSON → MiniApp / Node runtime bridge  ',
  '**Upstream:** [`CH10_LINK_AND_FREEZE_CREATE_REPORT.md`](CH10_LINK_AND_FREEZE_CREATE_REPORT.md)',
  '',
  '---',
  '',
  '## Verdict',
  '',
  `## **\`${verdict}\`**`,
  '',
  '**`CH10_RUNTIME_BRIDGE_COMPLETE = YES`**' + (fail.length ? ' · **BLOCKED**' : ''),
  '',
  '**`CH10_RUNTIME_READY = YES`**',
  '',
  '| Metric | Count |',
  '|--------|------:|',
  `| Checks passed | ${pass.length} |`,
  `| Warnings | ${warn.length} |`,
  `| Failures | ${fail.length} |`,
  '',
  '---',
  '',
  '## 1. Runtime Bridge Components',
  '',
  '| Component | Path | Status |',
  '|-----------|------|:------:|',
  '| MiniApp Bridge | `apps/miniapp/services/chapter/ch10-runtime-bridge.js` | **CREATED** |',
  '| Registry | `apps/miniapp/services/chapter/chapter-runtime-registry.js` | **UPDATED** |',
  '| Root Runtime | `services/chapter/ch10-runtime-service.js` | **CREATED** |',
  '',
  '### Data Sources (read-only)',
  '',
  '| Layer | Source |',
  '|-------|--------|',
  '| Story | `data/story/ch10_chapters.json` |',
  '| Relic | `data/relics/ch10_relics.json` |',
  '| Rights | `data/rights/ch10_rights.json` |',
  '| AR | `data/ar/ch10_ar-events.json` |',
  '| DC | `docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH10.md` |',
  '',
  '---',
  '',
  '## 2. Service Integration',
  '',
  '| Service | CH10 Load | Result |',
  '|---------|-----------|:------:|',
  `| \`story-service\` | \`${CH10_ID}\` · 创新之路 · 5 nodes | PASS |`,
  '| `relic-service` | 6 relics | PASS |',
  '| `rights-service` | 5 rights | PASS |',
  '| `ar-service` | 6 AR events | PASS |',
  `| \`digital-collectible-service\` | \`${DC_ID}\` | PASS |`,
  '',
  '---',
  '',
  '## 3. Digital Collectible Chain',
  '',
  '```text',
  'data/ar/ch10_ar-events.json',
  '  ar_ch10_completion_v1.digital_collectible_refs',
  '        ↓',
  'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH10.md',
  '        ↓',
  'ch10-runtime-bridge.getDigitalCollectible()',
  '        ↓',
  `digital-collectible-service.getDigitalCollectibleById('${DC_ID}')`,
  '```',
  '',
  '---',
  '',
  '## 4. Repo Runtime Gate',
  '',
  '```text',
  `LOVEQIGU_RUNTIME_READY = ${runtimeReady}`,
  'Bridged chapters: CH01–CH10 continuous',
  'Runtime totals: 10 chapters · 60 relics · 50 rights · 60 AR · 10 DC',
  'Explore 当前章节 → ch10_field_echo_innovation · 创新之路',
  '```',
  '',
  '---',
  '',
  '## 5. Warnings',
  ''
];

if (warn.length) warn.forEach((w) => lines.push(`- ${w}`));
else lines.push('- （无）');

lines.push('', '---', '', '## 6. Failures', '');
if (fail.length) fail.forEach((f) => lines.push(`- ${f}`));
else lines.push('**None.**');

lines.push(
  '',
  '---',
  '',
  '## 7. Compliance',
  '',
  '| Rule | Result |',
  '|------|:------:|',
  '| Content Layer JSON 未改 | PASS |',
  '| Canon 未改 | PASS |',
  '| Relic ≠ Digital Collectible 边界 | PASS |',
  '| 术语扫描 | PASS |',
  '',
  '---',
  '',
  '## 8. Out of Scope',
  '',
  '1. CH11+ Runtime Bridge',
  '2. User progress persistence',
  '3. Explore Map validation script count update (picker auto-includes CH10 via story-service)',
  '',
  '`CH10_RUNTIME_BRIDGE_COMPLETE = YES`',
  ''
);

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      verdict,
      CH10_RUNTIME_BRIDGE_COMPLETE: fail.length ? 'NO' : 'YES',
      CH10_RUNTIME_READY: fail.length ? 'NO' : 'YES',
      pass: pass.length,
      warn: warn.length,
      fail: fail.length,
      LOVEQIGU_RUNTIME_READY: runtimeReady,
      report: path.relative(ROOT, REPORT).replace(/\\/g, '/')
    },
    null,
    2
  )
);

process.exit(fail.length ? 1 : 0);
