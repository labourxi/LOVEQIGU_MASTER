/**
 * STAR_MAP_SYSTEM_V1 validation — run: node scripts/miniapp/validate-star-map-v1.js
 */

const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const starCatalog = require(path.join(ROOT, 'apps/miniapp/data/star-map/star-catalog.js'));
const relicStarAliasMap = require(path.join(ROOT, 'apps/miniapp/data/relic-alias/relic-star-alias-map.js'));
const starMapService = require(path.join(ROOT, 'apps/miniapp/services/star-map/star-map-service.js'));

const REQUIRED_APIS = [
  'getStarMapOverview',
  'getSymbolList',
  'getSymbolDetail',
  'getMansionDetail',
  'getStarByAliasId',
  'getRelicStarMapping',
  'getLitStarsByOwnedRelics'
];

const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

REQUIRED_APIS.forEach((name) => {
  assert(typeof starMapService[name] === 'function', `缺少 API: ${name}`);
});

assert(starCatalog.total_stars === 164, `total_stars 应为 164，实际 ${starCatalog.total_stars}`);
assert(Array.isArray(starCatalog.symbols) && starCatalog.symbols.length === 4, '四象数量应为 4');

const qinglong = starCatalog.symbols.find((s) => s.id === 'qinglong');
assert(qinglong && qinglong.mansions.length === 7, '青龙七宿不完整');
assert(qinglong && !qinglong.placeholder, '青龙不应为占位');

['zhuque', 'baihu', 'xuanwu'].forEach((id) => {
  const symbol = starCatalog.symbols.find((s) => s.id === id);
  assert(symbol && symbol.mansions.length === 7, `${id} 七宿结构缺失`);
});

const mappingCount = relicStarAliasMap.mappings.length;
assert(mappingCount >= 60, `映射信物不足 60，当前 ${mappingCount}`);

const homeRecentIds = [
  'relic_ch01_gate_badge',
  'relic_ch01_cloud_gate_imprint_a',
  'relic_ch01_plaza'
];
homeRecentIds.forEach((id) => {
  assert(starMapService.getRelicStarMapping(id), `首页最近信物未映射: ${id}`);
});

relicStarAliasMap.mappings.forEach((entry) => {
  const located = starMapService.getStarByAliasId(entry.star_alias_id);
  assert(located, `别名 ${entry.star_alias_id} 在 catalog 中不存在`);
});

const overview = starMapService.getStarMapOverview();
assert(overview.title === '我的星图', 'overview.title 应为「我的星图」');
assert(overview.symbols.length === 4, 'overview 应含四象');

const unmapped = starMapService.getRelicStarMapping('relic_nonexistent_test');
assert(unmapped === null, '未映射信物应返回 null');

const litWithMock = starMapService.getLitStarsByOwnedRelics([
  { id: 'relic_ch01_gate_badge', status: 'recorded' }
]);
assert(litWithMock.length === 1 && litWithMock[0].alias_id === 'xin_02', '点亮逻辑异常');

const fs = require('fs');
const starMapPageJs = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/pages/star-map/index.js'),
  'utf8'
);
assert(!/prototype-runtime-service/.test(starMapPageJs), '星图页不应依赖 prototype-runtime');

const homeDashboardPath = path.join(ROOT, 'apps/miniapp/services/prototype/prototype-runtime-service.js');
const homeDashboard = fs.readFileSync(homeDashboardPath, 'utf8');
assert(/label: '星图'/.test(homeDashboard), '首页快捷入口缺少星图');

console.log('STAR_MAP_VALIDATION_ERRORS=' + errors.length);
errors.forEach((e) => console.log('ERROR:', e));

if (!errors.length) {
  console.log('MAPPING_COUNT=' + mappingCount);
  console.log('TOTAL_STARS=' + starCatalog.total_stars);
  console.log('QINGLONG_MANSIONS=' + qinglong.mansions.length);
  console.log('QINGLONG_STARS=' + qinglong.star_count);
  console.log('LIT_STARS_DEFAULT=' + overview.lit);
  console.log('PASS=YES');
  process.exit(0);
}

process.exit(1);
