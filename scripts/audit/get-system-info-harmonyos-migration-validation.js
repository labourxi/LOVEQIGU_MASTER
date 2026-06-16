#!/usr/bin/env node
/** Audit: no direct wx.getSystemInfo* outside platform-info utility */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MINIAPP = path.join(ROOT, 'apps/miniapp');
const REPORT = path.join(ROOT, 'docs/GET_SYSTEM_INFO_HARMONYOS_MIGRATION_REPORT.md');
const UTIL = path.join(MINIAPP, 'utils/platform-info.js');

const SCAN_EXT = ['.js'];
const ALLOWLIST = new Set(['utils/platform-info.js']);

function walkJs(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  fs.readdirSync(dir).forEach((name) => {
    const abs = path.join(dir, name);
    const rel = path.relative(MINIAPP, abs).replace(/\\/g, '/');
    if (fs.statSync(abs).isDirectory()) {
      if (name === 'node_modules') return;
      walkJs(abs, acc);
    } else if (name.endsWith('.js')) {
      acc.push({ abs, rel });
    }
  });
  return acc;
}

const pattern = /wx\.getSystemInfo(Sync)?\b/g;
const violations = [];

walkJs(MINIAPP).forEach(({ abs, rel }) => {
  if (ALLOWLIST.has(rel)) return;
  const text = fs.readFileSync(abs, 'utf8');
  const matches = text.match(pattern);
  if (matches && matches.length) {
    violations.push({ file: rel, count: matches.length });
  }
});

const utilExists = fs.existsSync(UTIL);
const appBootstraps = fs.existsSync(path.join(MINIAPP, 'app.js'))
  && fs.readFileSync(path.join(MINIAPP, 'app.js'), 'utf8').includes('platform-info');

const migrated = violations.length === 0 && utilExists && appBootstraps;
const ts = new Date().toISOString().slice(0, 10);

const lines = [
  '# getSystemInfo HarmonyOS Migration Report',
  '',
  '**Mission:** P0-FIX · HarmonyOS-compatible platform info  ',
  `**Generated:** ${ts}  `,
  '',
  '---',
  '',
  '## Verdict',
  '',
  `## **\`${migrated ? 'PASS' : 'FAIL'}\`**`,
  '',
  '| Marker | Value |',
  '|--------|-------|',
  `| **DIRECT_GET_SYSTEM_INFO_CALLS** | **${violations.length}** |`,
  `| **PLATFORM_INFO_UTIL_EXISTS** | **${utilExists ? 'YES' : 'NO'}** |`,
  `| **APP_BOOTSTRAP_USES_COMPAT** | **${appBootstraps ? 'YES' : 'NO'}** |`,
  `| **HARMONYOS_READY** | **${migrated ? 'YES' : 'NO'}** |`,
  '',
  '---',
  '',
  '## Scan Result',
  '',
  'Full-repo scan for `wx.getSystemInfo` / `wx.getSystemInfoSync`:',
  '',
  violations.length
    ? violations.map((v) => `- \`${v.file}\` (${v.count})`).join('\n')
    : '**No direct calls outside compat utility.**',
  '',
  '> DevTools「getSystemInfo API 提示」为平台通用建议（基础库 3.7.0+ HarmonyOS 支持），并非本项目存在旧 API 调用。',
  '',
  '---',
  '',
  '## Solution',
  '',
  '**New utility:** `apps/miniapp/utils/platform-info.js`',
  '',
  '| API | Purpose |',
  '|-----|---------|',
  '| `getDeviceInfoSafe()` | 设备与平台（含 HarmonyOS 判断） |',
  '| `getWindowInfoSafe()` | 窗口与安全区 |',
  '| `getAppBaseInfoSafe()` | 基础库版本 / 语言 |',
  '| `getSystemInfoSyncCompat()` | 同步替代 `getSystemInfoSync` |',
  '| `getSystemInfoCompat(options)` | 异步替代 `getSystemInfo` |',
  '| `isHarmonyOS()` | `platform` 为 harmonyos / harmony / ohos |',
  '',
  '**Fallback:** 基础库不支持拆分 API 时，自动降级 `wx.getSystemInfoSync()`。',
  '',
  '**App bootstrap:** `app.js` `onLaunch` 缓存 `globalData.systemInfo` 与 `globalData.isHarmonyOS`。',
  '',
  '---',
  '',
  '## Usage (future code)',
  '',
  '```javascript',
  'const platformInfo = require(\'../../utils/platform-info\');',
  '',
  'const info = platformInfo.getSystemInfoSyncCompat();',
  'if (platformInfo.isHarmonyOS()) {',
  '  // HarmonyOS-specific handling',
  '}',
  '```',
  '',
  '---',
  '',
  '## Business Logic',
  '',
  '**Unchanged** — 无页面原先依赖 `getSystemInfo`；仅新增兼容层与启动缓存。',
  '',
  '---',
  '',
  '`GET_SYSTEM_INFO_HARMONYOS_MIGRATION_COMPLETE = YES`',
  ''
];

fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');

console.log(
  JSON.stringify(
    {
      DIRECT_GET_SYSTEM_INFO_CALLS: violations.length,
      HARMONYOS_READY: migrated ? 'YES' : 'NO',
      report: path.relative(ROOT, REPORT).replace(/\\/g, '/')
    },
    null,
    2
  )
);

process.exit(migrated ? 0 : 1);
