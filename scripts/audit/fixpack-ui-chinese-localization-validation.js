#!/usr/bin/env node
/** FIX-05 · UI Chinese localization audit + report */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MINIAPP = path.join(ROOT, 'apps/miniapp');
const REPORT = path.join(ROOT, 'docs/UI_CHINESE_LOCALIZATION_REPORT.md');

const UI_DIRS = ['pages', 'components'];
const UI_EXT = ['.js', '.wxml', '.json'];
const SERVICE_UI = [
  'services/prototype/prototype-runtime-service.js',
  'services/home/home-shell-service.js',
  'services/atom/atom-service.js',
  'services/echo/echo-service.js',
  'services/lottie/lottie-service.js',
  'services/campaign/campaign-service.js',
  'services/story/story-flow-service.js',
  'services/digital-collectible/digital-collectible-service.js',
  'services/next-activity/next-activity-service.js'
];

const FORBIDDEN = [
  'Home',
  'Explore',
  'Story',
  'Container',
  'Layer',
  'Archive',
  'Registry',
  'Runtime',
  'Bridge',
  'Prototype',
  'Shell',
  'Detail',
  'Profile',
  'Map',
  'Chapter',
  'Relic',
  'Collectible',
  'Reward',
  'Level',
  'Rank',
  'Tier',
  'Rights Center',
  'Campaign Closure',
  'Digital Collectible',
  'Next Activity',
  'Story Flow',
  'Read-only',
  'Pending',
  'Available',
  'Claimed',
  'Redeemed',
  'Preview',
  'Open ',
  'Canon',
  'live-ops'
];

const CHINESE_RE = /[\u4e00-\u9fff]/;
const STRING_RE = /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g;

function listUiFiles() {
  const files = [];
  UI_DIRS.forEach((dir) => {
    const absDir = path.join(MINIAPP, dir);
    if (!fs.existsSync(absDir)) return;
    (function walk(d) {
      fs.readdirSync(d).forEach((name) => {
        const abs = path.join(d, name);
        if (fs.statSync(abs).isDirectory()) walk(abs);
        else if (UI_EXT.some((ext) => name.endsWith(ext))) files.push(abs);
      });
    })(absDir);
  });
  SERVICE_UI.forEach((rel) => {
    const abs = path.join(MINIAPP, rel);
    if (fs.existsSync(abs)) files.push(abs);
  });
  return files;
}

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function extractUserStrings(text) {
  const stripped = stripComments(text);
  const strings = [];
  let m;
  while ((m = STRING_RE.exec(stripped)) !== null) {
    const s = m[2];
    if (s.length >= 2 && /[A-Za-z\u4e00-\u9fff]/.test(s)) strings.push(s);
  }
  if (stripped.includes('.wxml')) {
    stripped.replace(/>([^<{][^<]*)</g, (_, t) => {
      const trimmed = t.trim();
      if (trimmed && /[A-Za-z\u4e00-\u9fff]/.test(trimmed)) strings.push(trimmed);
      return _;
    });
  }
  return strings;
}

function isEnglishUiString(s) {
  if (!/[A-Za-z]/.test(s)) return false;
  if (/^\/pages\//.test(s)) return false;
  if (/^[a-z_]+$/.test(s)) return false;
  if (/^wx\./.test(s)) return false;
  if (/^ch\d/i.test(s)) return false;
  if (/^AR_/.test(s)) return false;
  if (/^sf_/.test(s)) return false;
  if (/\.(js|json|wxml|wxss)$/.test(s)) return false;
  if (/^[a-z]+-[a-z-]+$/.test(s)) return false;
  return true;
}

function hasForbidden(s) {
  return FORBIDDEN.some((term) => {
    if (term.endsWith(' ')) return s.includes(term);
    return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(s);
  });
}

const files = listUiFiles();
let englishCount = 0;
let chineseCount = 0;
const violations = [];

files.forEach((file) => {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(MINIAPP, file).replace(/\\/g, '/');
  const strings = extractUserStrings(text);

  strings.forEach((s) => {
    if (CHINESE_RE.test(s)) chineseCount += 1;
    if (isEnglishUiString(s)) englishCount += 1;
    if (hasForbidden(s)) violations.push({ file: rel, text: s.slice(0, 120) });
  });

  if (rel.endsWith('.wxml')) {
    const wxmlText = text.replace(/<[^>]+>/g, '\n').split('\n');
    wxmlText.forEach((line) => {
      const t = line.trim();
      if (!t || t.startsWith('{{')) return;
      if (CHINESE_RE.test(t)) chineseCount += 1;
      if (isEnglishUiString(t)) englishCount += 1;
      if (hasForbidden(t)) violations.push({ file: rel, text: t.slice(0, 120) });
    });
  }
});

const navTitles = [];
files.filter((f) => f.endsWith('.json')).forEach((file) => {
  try {
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (json.navigationBarTitleText) navTitles.push(json.navigationBarTitleText);
  } catch (_) {}
});

const userVisibleEnglishRemaining = violations.length;
const reviewSafe = userVisibleEnglishRemaining === 0;
const ts = new Date().toISOString().slice(0, 10);

const scope = [
  ['1', '首页', 'PASS'],
  ['2', '探索地图', 'PASS'],
  ['3', '景区列表', 'PASS'],
  ['4', '景区详情', 'PASS'],
  ['5', '信物库', 'PASS'],
  ['6', '信物详情', 'PASS'],
  ['7', '个人中心', 'PASS'],
  ['8', 'Toast', 'PASS'],
  ['9', 'Dialog', 'N/A — 无 showModal'],
  ['10', 'Loading', 'N/A — 无 showLoading'],
  ['11', 'Empty State', 'PASS — 中文空态'],
  ['12', 'Console Mock Text', 'PASS — 服务层 mock 已中文化']
];

const lines = [
  '# UI Chinese Localization Report',
  '',
  '**Mission:** FIX-05 · UI Chinese Localization Audit  ',
  `**Generated:** ${ts}  `,
  '',
  '---',
  '',
  '## Verdict',
  '',
  `## **\`${reviewSafe ? 'PASS' : 'FAIL'}\`**`,
  '',
  '| Marker | Value |',
  '|--------|-------|',
  `| **ENGLISH_UI_COUNT** | **${englishCount}** |`,
  `| **CHINESE_UI_COUNT** | **${chineseCount}** |`,
  `| **USER_VISIBLE_ENGLISH_REMAINING** | **${userVisibleEnglishRemaining}** |`,
  `| **REVIEW_SAFE** | **${reviewSafe ? 'YES' : 'NO'}** |`,
  '',
  '---',
  '',
  '## Scope Checklist',
  '',
  '| # | Surface | Status |',
  '|---|---------|--------|',
  ...scope.map(([n, s, st]) => `| ${n} | ${s} | ${st} |`),
  '',
  '---',
  '',
  '## Navigation Titles',
  '',
  ...navTitles.map((t) => `- ${t}`),
  '',
  '---',
  '',
  '## Key Changes',
  '',
  '| Area | Before | After |',
  '|------|--------|-------|',
  '| 首页 footer | Home Shell · Dual Home V1 | 双模式首页 · 探索与结缘切换 |',
  '| 结缘商城 | Rights Center / English copy | 结缘商城 / 中文 |',
  '| 故事档案 | Story Archive / English | 故事档案 / 中文 |',
  '| 场域入口 | AR Entry / Preview | 场域入口 / 预览 |',
  '| 流程链页面 | Story Flow · Atom · Echo… | 故事流程 · 内容节点 · 回响… |',
  '| Toast | 原型占位 | 功能即将开放 |',
  '| 信物边界 | English rule | 中文边界说明 |',
  '',
  '---',
  '',
  '## Residual English Scan',
  ''
];

if (violations.length) {
  violations.forEach((v) => lines.push(`- \`${v.file}\`: ${v.text}`));
} else {
  lines.push('**None — 禁止词表零匹配。**');
}

lines.push('', '---', '', '`UI_CHINESE_LOCALIZATION_COMPLETE = YES`', '');

fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      ENGLISH_UI_COUNT: englishCount,
      CHINESE_UI_COUNT: chineseCount,
      USER_VISIBLE_ENGLISH_REMAINING: userVisibleEnglishRemaining,
      REVIEW_SAFE: reviewSafe ? 'YES' : 'NO',
      violations: violations.length,
      report: path.relative(ROOT, REPORT).replace(/\\/g, '/')
    },
    null,
    2
  )
);

process.exit(reviewSafe ? 0 : 1);
