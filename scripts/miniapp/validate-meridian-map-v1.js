/**
 * MERIDIAN_MAP_SYSTEM_V1 validation — run: node scripts/miniapp/validate-meridian-map-v1.js
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const meridianCatalog = require(path.join(ROOT, 'apps/miniapp/data/meridian-map/meridian-catalog.js'));
const relicMeridianAliasMap = require(path.join(ROOT, 'apps/miniapp/data/relic-alias/relic-meridian-alias-map.js'));
const meridianMapService = require(path.join(ROOT, 'apps/miniapp/services/meridian-map/meridian-map-service.js'));

const REQUIRED_APIS = [
  'getMeridianOverview',
  'getMeridianList',
  'getMeridianDetail',
  'getPointById',
  'getRelicMeridianMapping',
  'getLitPointsByOwnedRelics'
];

const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

REQUIRED_APIS.forEach((name) => {
  assert(typeof meridianMapService[name] === 'function', `缺少 API: ${name}`);
});

assert(meridianCatalog.total_points === 365, `total_points 应为 365，实际 ${meridianCatalog.total_points}`);
assert(meridianCatalog.regular_meridians.length === 12, '十二正经数量应为 12');
assert(meridianCatalog.extraordinary_vessels.length === 8, '奇经八脉数量应为 8');
assert(meridianCatalog.meridian_count === 20, '经络总数应为 20');

const lung = meridianCatalog.regular_meridians.find((m) => m.id === 'lung');
const largeIntestine = meridianCatalog.regular_meridians.find((m) => m.id === 'large_intestine');
const stomach = meridianCatalog.regular_meridians.find((m) => m.id === 'stomach');

assert(lung && lung.points.length === 11 && !lung.placeholder, '手太阴肺经不完整');
assert(largeIntestine && largeIntestine.points.length === 20 && !largeIntestine.placeholder, '手阳明大肠经不完整');
assert(stomach && stomach.points.length === 45 && !stomach.placeholder, '足阳明胃经不完整');

assert(lung.points.some((p) => p.id === 'yunmen' && p.name === '云门'), '缺少云门穴');

const du = meridianCatalog.extraordinary_vessels.find((m) => m.id === 'du');
assert(du && du.points.length === 28, '督脉应为 28 穴');

const mappingCount = relicMeridianAliasMap.mappings.length;
assert(mappingCount >= 60, `映射信物不足 60，当前 ${mappingCount}`);

relicMeridianAliasMap.mappings.forEach((entry) => {
  const located = meridianMapService.getPointById(entry.point_id);
  assert(located, `穴位 ${entry.point_id} 在 catalog 中不存在`);
});

const overview = meridianMapService.getMeridianOverview();
assert(overview.title === '我的经络图', 'overview.title 应为「我的经络图」');
assert(overview.regularMeridians.length === 12, 'overview 应含十二正经');
assert(overview.extraordinaryVessels.length === 8, 'overview 应含奇经八脉');
assert(overview.completedDisplay.endsWith('/20'), '已完成经络应以 /20 计');

const unmapped = meridianMapService.getRelicMeridianMapping('relic_nonexistent_test');
assert(unmapped === null, '未映射信物应返回 null');

const litWithMock = meridianMapService.getLitPointsByOwnedRelics([
  { id: 'relic_ch01_gate_badge', status: 'recorded' }
]);
assert(litWithMock.length === 1 && litWithMock[0].point_id === 'yunmen', '点亮逻辑异常');

const meridianPageJs = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/pages/meridian-map/index.js'),
  'utf8'
);
assert(!/prototype-runtime-service/.test(meridianPageJs), '经络图页不应依赖 prototype-runtime');

const homeShell = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/services/home/home-shell-service.js'),
  'utf8'
);
assert(/getMeridianMapSummary/.test(homeShell), '首页缺少经络图摘要');

const homePanel = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/components/explore-home-panel/explore-home-panel.wxml'),
  'utf8'
);
assert(/经络图/.test(homePanel), '首页组件缺少经络图入口');

console.log('MERIDIAN_VALIDATION_ERRORS=' + errors.length);
errors.forEach((e) => console.log('ERROR:', e));

if (!errors.length) {
  console.log('MAPPING_COUNT=' + mappingCount);
  console.log('TOTAL_POINTS=' + meridianCatalog.total_points);
  console.log('MERIDIAN_COUNT=' + meridianCatalog.meridian_count);
  console.log('LIT_POINTS_DEFAULT=' + overview.lit);
  console.log('PASS=YES');
  process.exit(0);
}

process.exit(1);
