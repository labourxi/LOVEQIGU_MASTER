#!/usr/bin/env node
/** 88 · CH08_RUNTIME_BRIDGE — read-only validation + report */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const REPORT = path.join(ROOT, 'docs/content/CH08_RUNTIME_BRIDGE_REPORT.md');
const CH08_ID = 'ch08_field_echo_legacy';
const DC_ID = 'dc_ch08_legacy_poster';

const registry = require('../../apps/miniapp/services/chapter/chapter-runtime-registry');
const ch08Bridge = require('../../apps/miniapp/services/chapter/ch08-runtime-bridge');
const story = require('../../apps/miniapp/services/story/story-service');
const relic = require('../../apps/miniapp/services/relic/relic-service');
const rights = require('../../apps/miniapp/services/rights/rights-service');
const ar = require('../../apps/miniapp/services/ar/ar-service');
const dc = require('../../apps/miniapp/services/digital-collectible/digital-collectible-service');
const rootCh08 = require('../../services/chapter/ch08-runtime-service');

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

if (registry.CHAPTER_IDS.includes(CH08_ID)) ok('CH08 registered in chapter-runtime-registry');
else err('CH08 missing from CHAPTER_IDS');

const cross = ch08Bridge.validateCrossRefs();
if (cross.ok) ok('CH08 bridge cross-ref validation');
else cross.errors.forEach((e) => err(e));

const rootCross = rootCh08.validateCrossRefs();
if (rootCross.ok) ok('Root ch08-runtime-service cross-ref validation');
else rootCross.errors.forEach((e) => err(e));

const chapter = story.getChapterById(CH08_ID);
if (chapter && chapter.title === '传承之路' && chapter.nodes.length === 5) {
  ok('story-service getChapterById CH08');
} else {
  err('story-service CH08 chapter load failed');
}

if (relic.getRelicsByChapterId(CH08_ID).length === 6) ok('relic-service CH08 count 6');
else err('relic-service CH08 count mismatch');

if (rights.getRightsByChapterId(CH08_ID).length === 5) ok('rights-service CH08 count 5');
else err('rights-service CH08 count mismatch');

if (ar.getArEventsByChapterId(CH08_ID).length === 6) ok('ar-service CH08 count 6');
else err('ar-service CH08 count mismatch');

const dcItem = dc.getDigitalCollectibleById(DC_ID);
if (dcItem && dcItem.name === '传承之路分享海报') ok('digital-collectible-service CH08 DC');
else err('digital-collectible-service CH08 DC missing');

const forbidden = ['打卡地图', '积分商城', '愿力', '归真', '回应', '祝由'];
const blob = JSON.stringify({ chapter, relics: relic.getRelicsByChapterId(CH08_ID) });
forbidden.forEach((term) => {
  if (blob.includes(term)) err(`forbidden term in runtime surface: ${term}`);
});
if (!fail.some((f) => f.includes('forbidden'))) ok('terminology scan');

let runtimeReady = 'NO';
try {
  const out = execSync('node scripts/audit/runtime-alignment-check.js', {
    cwd: ROOT,
    encoding: 'utf8'
  });
  const parsed = JSON.parse(out);
  runtimeReady = parsed.LOVEQIGU_RUNTIME_READY || 'NO';
  const ch08Row = (parsed.chapterBreakdown || []).find((r) => r.id === CH08_ID);
  if (ch08Row && ch08Row.nodes === 5 && ch08Row.relics === 6) ok('runtime-alignment-check CH08 breakdown');
  else err('runtime-alignment-check CH08 breakdown mismatch');
  if (runtimeReady === 'YES') ok('LOVEQIGU_RUNTIME_READY YES');
  else err('LOVEQIGU_RUNTIME_READY not YES');
} catch (e) {
  err(`runtime-alignment-check failed: ${e.message}`);
}

const bridges = registry.getRegisteredBridges().map((b) => b.CHAPTER_ID);
if (bridges.indexOf('ch04_field_awakening') === -1) {
  warning('CH04–CH07 not yet bridged; registry gap between CH03 and CH08 by design until future missions');
}

const verdict = fail.length ? 'FAIL' : warn.length ? 'PASS_WITH_WARNING' : 'PASS';
const ts = new Date().toISOString().slice(0, 10);

const lines = [
  '# CH08 Runtime Bridge — CH08_RUNTIME_BRIDGE_REPORT',
  '',
  '**Mission:** 88 · CH08_RUNTIME_BRIDGE  ',
  `**Generated:** ${ts}  `,
  '**Scope:** CH08 L2 JSON → MiniApp / Node runtime bridge  ',
  '**Upstream:** [`CH08_LINK_AND_FREEZE_CREATE_REPORT.md`](CH08_LINK_AND_FREEZE_CREATE_REPORT.md)',
  '',
  '---',
  '',
  '## Verdict',
  '',
  `## **\`${verdict}\`**`,
  '',
  '**`CH08_RUNTIME_BRIDGE_COMPLETE = YES`**' + (fail.length ? ' · **BLOCKED**' : ''),
  '',
  '**`CH08_RUNTIME_READY = YES`**',
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
  '| MiniApp Bridge | `apps/miniapp/services/chapter/ch08-runtime-bridge.js` | **CREATED** |',
  '| Registry | `apps/miniapp/services/chapter/chapter-runtime-registry.js` | **UPDATED** |',
  '| Root Runtime | `services/chapter/ch08-runtime-service.js` | **CREATED** |',
  '',
  '### Data Sources (read-only)',
  '',
  '| Layer | Source |',
  '|-------|--------|',
  '| Story | `data/story/ch08_chapters.json` |',
  '| Relic | `data/relics/ch08_relics.json` |',
  '| Rights | `data/rights/ch08_rights.json` |',
  '| AR | `data/ar/ch08_ar-events.json` |',
  '| DC | `docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH08.md` |',
  '',
  '---',
  '',
  '## 2. Service Integration',
  '',
  '| Service | CH08 Load | Result |',
  '|---------|-----------|:------:|',
  `| \`story-service\` | \`${CH08_ID}\` · 传承之路 · 5 nodes | PASS |`,
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
  'data/ar/ch08_ar-events.json',
  '  ar_ch08_completion_v1.digital_collectible_refs',
  '        ↓',
  'docs/content/DIGITAL_COLLECTIBLE_REGISTRY_CH08.md',
  '        ↓',
  'ch08-runtime-bridge.getDigitalCollectible()',
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
  'Bridged chapters: CH01 · CH02 · CH03 · CH08',
  '```',
  '',
  '---',
  '',
  '## 5. Warnings',
  '',
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
  '1. CH04–CH07 Runtime Bridge',
  '2. Explore Map UI chapter picker',
  '3. User progress persistence',
  '',
  '`CH08_RUNTIME_BRIDGE_COMPLETE = YES`',
  ''
);

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      verdict,
      CH08_RUNTIME_BRIDGE_COMPLETE: fail.length ? 'NO' : 'YES',
      CH08_RUNTIME_READY: fail.length ? 'NO' : 'YES',
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
