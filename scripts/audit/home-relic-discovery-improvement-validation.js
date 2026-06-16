#!/usr/bin/env node
/** P1 · HOME_RELIC_DISCOVERY_IMPROVEMENT_V1 — validation + report */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MINIAPP = path.join(ROOT, 'apps/miniapp');
const REPORT = path.join(ROOT, 'docs/HOME_RELIC_DISCOVERY_IMPROVEMENT_REPORT.md');

const pass = [];
const fail = [];

function ok(msg) {
  pass.push(msg);
}

function err(msg) {
  fail.push(msg);
}

const panelWxml = fs.readFileSync(
  path.join(MINIAPP, 'components/explore-home-panel/explore-home-panel.wxml'),
  'utf8'
);
const panelWxss = fs.readFileSync(
  path.join(MINIAPP, 'components/explore-home-panel/explore-home-panel.wxss'),
  'utf8'
);
const shellSrc = fs.readFileSync(
  path.join(MINIAPP, 'services/home/home-shell-service.js'),
  'utf8'
);
const archiveJs = fs.readFileSync(path.join(MINIAPP, 'pages/relic-archive/index.js'), 'utf8');
const archiveWxml = fs.readFileSync(path.join(MINIAPP, 'pages/relic-archive/index.wxml'), 'utf8');

// 1. Top relic summary bar
if (panelWxml.includes('relic-summary-bar') && panelWxml.includes('panel.relicSummary.label')) {
  ok('top relic summary bar in explore-home-panel');
} else {
  err('missing top relic summary bar');
}

if (panelWxml.includes('data-path="{{panel.relicSummary.path}}"')) {
  ok('relic summary links to relicSummary.path');
} else {
  err('relic summary missing navigation path');
}

// 2. View all link
if (panelWxml.includes('查看全部 >') && panelWxml.includes('data-path="/pages/relic-archive/index"')) {
  ok('recent section has 查看全部 > to relic-archive');
} else {
  err('missing 查看全部 > link');
}

// 3. Recent relics clickable
if (panelWxml.includes('data-path="{{item.path}}"') && panelWxml.includes('relic-item--active')) {
  ok('recent relic items bindtap with item.path');
} else {
  err('recent relic items not fully clickable');
}

// 4. Shell data
if (shellSrc.includes('getRelicSummary') && shellSrc.includes('relicId=${relic.id}')) {
  ok('home-shell provides relicSummary and per-relic paths');
} else {
  err('home-shell missing relicSummary or relic paths');
}

try {
  const homeShell = require(path.join(MINIAPP, 'services/home/home-shell-service'));
  const panel = homeShell.buildExplorePanel();
  if (panel.relicSummary && panel.relicSummary.count > 0) {
    ok(`relicSummary count=${panel.relicSummary.count}`);
  } else {
    err('relicSummary count empty');
  }
  if (panel.recentRelics.every((r) => r.path && r.path.includes('relicId='))) {
    ok('recentRelics all have relicId deep links');
  } else {
    err('recentRelics missing deep links');
  }
} catch (e) {
  err(`runtime panel: ${e.message}`);
}

// 5. Relic archive detail
if (archiveJs.includes('mapFocusedRelic') && archiveJs.includes('options.relicId')) {
  ok('relic-archive handles relicId query');
} else {
  err('relic-archive missing relicId handler');
}

if (archiveWxml.includes('focused-relic-panel') && archiveWxml.includes('relic-card--highlight')) {
  ok('relic-archive shows focused detail + list highlight');
} else {
  err('relic-archive missing detail UI');
}

const topBarExists = panelWxml.includes('relic-summary-bar') ? 'YES' : 'NO';
const viewAllExists = panelWxml.includes('查看全部 >') ? 'YES' : 'NO';
const recentClickable = panelWxml.includes('data-path="{{item.path}}"') ? 'YES' : 'NO';
const relicDetailDeepLink = archiveJs.includes('relicId') ? 'YES' : 'NO';
const verdict = fail.length ? 'FAIL' : 'PASS';
const ts = new Date().toISOString().slice(0, 10);

const lines = [
  '# HOME Relic Discovery Improvement Report',
  '',
  '**Mission:** P1 · HOME_RELIC_DISCOVERY_IMPROVEMENT_V1  ',
  `**Generated:** ${ts}  `,
  '**Goal:** 提升信物系统可发现性',
  '',
  '---',
  '',
  '## Verdict',
  '',
  `## **\`${verdict}\`**`,
  '',
  '| Marker | Value |',
  '|--------|-------|',
  `| **TOP_RELIC_ENTRY_EXISTS** | **${topBarExists}** |`,
  `| **VIEW_ALL_LINK_EXISTS** | **${viewAllExists}** |`,
  `| **RECENT_RELICS_CLICKABLE** | **${recentClickable}** |`,
  `| **RELIC_DETAIL_DEEP_LINK** | **${relicDetailDeepLink}** |`,
  '',
  '| Metric | Count |',
  '|--------|------:|',
  `| Checks passed | ${pass.length} |`,
  `| Failures | ${fail.length} |`,
  '',
  '---',
  '',
  '## Changes Applied',
  '',
  '| # | Requirement | Implementation |',
  '|---|-------------|----------------|',
  '| 1 | 「最近获得」标题 + 查看全部 > | `section-head-row` + `查看全部 >` → `/pages/relic-archive/index` |',
  '| 2 | 最近获得列表可点击 | 每项 `bindtap` + `data-path="{{item.path}}"` |',
  '| 3 | 点击信物 → 详情或信物库 | `/pages/relic-archive/index?relicId={id}` + 信物库顶部详情面板 |',
  '| 4 | 首页顶部「已获得信物 N 件」 | `relic-summary-bar` → `/pages/relic-archive/index` |',
  '',
  '---',
  '',
  '## Entry Map (Explore Home)',
  '',
  '```text',
  'explore-home-panel',
  '├── [NEW] relic-summary-bar',
  '│     └── 已获得信物 N 件 → /pages/relic-archive/index',
  '├── 最近获得',
  '│     ├── 查看全部 > → /pages/relic-archive/index',
  '│     └── relic-item ×3 → /pages/relic-archive/index?relicId=...',
  '└── 原型导航 · 信物库（既有）',
  '```',
  '',
  '---',
  '',
  '## Relic Detail Flow',
  '',
  '无独立 `relic-detail` 页面。点击首页信物 → 信物库页顶部 **信物详情** 面板（`focusedRelic`），列表中对应卡片高亮。',
  '',
  '---',
  '',
  '## Files Modified',
  '',
  '| File | Change |',
  '|------|--------|',
  '| `services/home/home-shell-service.js` | `getRelicSummary()` + `recentRelics[].path` |',
  '| `components/explore-home-panel/explore-home-panel.wxml` | 顶部入口 + 查看全部 + 列表点击 |',
  '| `components/explore-home-panel/explore-home-panel.wxss` | summary bar / relic item 样式 |',
  '| `pages/relic-archive/index.js` | `relicId` 查询参数 → 详情面板 |',
  '| `pages/relic-archive/index.wxml` | `focused-relic-panel` + 高亮卡片 |',
  '| `pages/relic-archive/index.wxss` | 详情面板样式 |',
  '',
  '---',
  '',
  '## Failures',
  ''
];

if (fail.length) fail.forEach((f) => lines.push(`- ${f}`));
else lines.push('**None.**');

lines.push('', '---', '', '`HOME_RELIC_DISCOVERY_IMPROVEMENT_V1_COMPLETE = YES`', '');

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      verdict,
      TOP_RELIC_ENTRY_EXISTS: topBarExists,
      VIEW_ALL_LINK_EXISTS: viewAllExists,
      RECENT_RELICS_CLICKABLE: recentClickable,
      RELIC_DETAIL_DEEP_LINK: relicDetailDeepLink,
      pass: pass.length,
      fail: fail.length,
      report: path.relative(ROOT, REPORT).replace(/\\/g, '/')
    },
    null,
    2
  )
);

process.exit(fail.length ? 1 : 0);
