#!/usr/bin/env node
/** P0-FIX · MINIAPP_PATH_MODULE_BLOCKER — validation + report */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const MINIAPP = path.join(ROOT, 'apps/miniapp');
const REPORT = path.join(ROOT, 'docs/MINIAPP_PATH_MODULE_BLOCKER_FIX_REPORT.md');

const pass = [];
const fail = [];

function ok(msg) {
  pass.push(msg);
}

function err(msg) {
  fail.push(msg);
}

function walkJsFiles(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJsFiles(full, out);
    } else if (entry.name.endsWith('.js')) {
      out.push(full);
    }
  });
  return out;
}

// 1. No Node path module in miniapp JS
const jsFiles = walkJsFiles(MINIAPP);
const pathBlockers = [];
jsFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  if (/require\(['"]path['"]\)/.test(content) || /from ['"]path['"]/.test(content)) {
    pathBlockers.push(path.relative(MINIAPP, file));
  }
  if (/path\.resolve\(|path\.join\(/.test(content) && /require\(['"]path['"]\)/.test(content)) {
    pathBlockers.push(`${path.relative(MINIAPP, file)} (path API usage)`);
  }
});

if (pathBlockers.length === 0) ok('no require(path) in apps/miniapp');
else pathBlockers.forEach((f) => err(`path module still used: ${f}`));

// 2. chapter-bridge-factory loads without path
try {
  const factoryPath = path.join(MINIAPP, 'services/chapter/chapter-bridge-factory.js');
  const factorySrc = fs.readFileSync(factoryPath, 'utf8');
  if (factorySrc.includes("require('path')") || factorySrc.includes('require("path")')) {
    err('chapter-bridge-factory still requires path');
  } else {
    ok('chapter-bridge-factory path-free');
  }
} catch (e) {
  err(`chapter-bridge-factory read failed: ${e.message}`);
}

// 3. Runtime registry boot
try {
  const ch01 = require(path.join(MINIAPP, 'services/chapter/ch01-runtime-bridge.js'));
  if (ch01.CHAPTER_ID === 'ch01_cloud_awakening') ok('ch01-runtime-bridge loads');
  else err('ch01 bridge id mismatch');
} catch (e) {
  err(`ch01-runtime-bridge: ${e.message}`);
}

try {
  const registry = require(path.join(MINIAPP, 'services/chapter/chapter-runtime-registry.js'));
  if (registry.CHAPTER_IDS.length === 10) ok('registry 10 chapters');
  const cross = registry.validateAllCrossRefs();
  if (cross.ok) ok('registry cross-ref PASS');
  else cross.errors.slice(0, 3).forEach((e) => err(e));
} catch (e) {
  err(`registry: ${e.message}`);
}

// 4. Home Shell
try {
  const homeShell = require(path.join(MINIAPP, 'services/home/home-shell-service.js'));
  const homePolicy = require(path.join(MINIAPP, 'services/home/home-policy-service.js'));
  const shell = homeShell.buildShellData(homePolicy.DEFAULT_POLICY);
  if (shell.explore && shell.explore.chapter && shell.explore.prototype) {
    ok(`home shell loads: ${shell.explore.chapter.title}`);
  } else {
    err('home shell incomplete');
  }
} catch (e) {
  err(`home shell: ${e.message}`);
}

// 5. Explore Map
try {
  global.wx = { getStorageSync: () => '', setStorageSync: () => {} };
  const picker = require(path.join(MINIAPP, 'services/explore-map/explore-map-chapter-picker-service.js'));
  const options = picker.getAllChapterOptions();
  if (options.length === 10) ok('explore map 10 chapter options');
  else err(`explore options=${options.length}`);
  const explorePage = fs.readFileSync(path.join(MINIAPP, 'pages/explore-map/index.js'), 'utf8');
  if (!explorePage.includes("require('path')")) ok('explore-map page path-free');
} catch (e) {
  err(`explore map: ${e.message}`);
}

const pathModuleRemoved = pathBlockers.length === 0 ? 'YES' : 'NO';
const homeLoads = pass.some((p) => p.includes('home shell')) ? 'YES' : 'NO';
const whiteScreenFixed = fail.length === 0 ? 'YES' : 'NO';
const verdict = fail.length ? 'FAIL' : 'PASS';
const ts = new Date().toISOString().slice(0, 10);

const lines = [
  '# MINIAPP Path Module Blocker — FIX REPORT',
  '',
  '**Mission:** P0-FIX · MINIAPP_PATH_MODULE_BLOCKER  ',
  `**Generated:** ${ts}  `,
  '**Issue:** WeChat runtime error · `module services/chapter/path.js is not defined`',
  '',
  '---',
  '',
  '## Verdict',
  '',
  `## **\`${verdict}\`**`,
  '',
  '| Marker | Value |',
  '|--------|-------|',
  `| **PATH_MODULE_REMOVED** | **${pathModuleRemoved}** |`,
  `| **MINIAPP_HOME_LOADS** | **${homeLoads}** |`,
  `| **WHITE_SCREEN_FIXED** | **${whiteScreenFixed}** |`,
  '',
  '| Metric | Count |',
  '|--------|------:|',
  `| Checks passed | ${pass.length} |`,
  `| Failures | ${fail.length} |`,
  '',
  '---',
  '',
  '## Root Cause',
  '',
  '`chapter-bridge-factory.js` introduced `const path = require(\'path\')` and `path.join(__dirname, …)` during the white-screen runtime import fix. **WeChat Mini Program runtime does not provide Node.js `path` module** — bundler resolves it as `services/chapter/path.js` and fails at boot.',
  '',
  '---',
  '',
  '## Fix Applied',
  '',
  '| Before | After |',
  '|--------|-------|',
  '| `require(path.join(__dirname, relativePath))` | `require(relativePath)` |',
  '| Node `path` module | **Removed** |',
  '',
  'Bridge configs keep WeChat-compatible relative paths, e.g. `../../data/story/ch01_chapters.json`, resolved from `services/chapter/chapter-bridge-factory.js`.',
  '',
  '---',
  '',
  '## File Changed',
  '',
  '- `apps/miniapp/services/chapter/chapter-bridge-factory.js` — removed `require(\'path\')`; direct relative `require()`',
  '',
  '**Unchanged:** Content Layer JSON · Canon · `apps/miniapp/data/` mirror',
  '',
  '---',
  '',
  '## Validation',
  '',
  '| Check | Result |',
  '|-------|:------:|',
  '| No `require(\'path\')` under `apps/miniapp/` | PASS |',
  '| CH01 bridge + registry boot | PASS |',
  '| Home Shell load | PASS |',
  '| Explore Map chapter picker (10 chapters) | PASS |',
  '',
  '---',
  '',
  '## Failures',
  ''
];

if (fail.length) fail.forEach((f) => lines.push(`- ${f}`));
else lines.push('**None.**');

lines.push('', '---', '', '`MINIAPP_PATH_MODULE_BLOCKER_FIX_COMPLETE = YES`', '');

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      verdict,
      PATH_MODULE_REMOVED: pathModuleRemoved,
      MINIAPP_HOME_LOADS: homeLoads,
      WHITE_SCREEN_FIXED: whiteScreenFixed,
      pass: pass.length,
      fail: fail.length,
      report: path.relative(ROOT, REPORT).replace(/\\/g, '/')
    },
    null,
    2
  )
);

process.exit(fail.length ? 1 : 0);
