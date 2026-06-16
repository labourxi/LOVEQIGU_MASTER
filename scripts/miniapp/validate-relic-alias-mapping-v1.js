/**
 * RELIC_ALIAS_MAPPING_SYSTEM_V1 validation
 * Run: node scripts/miniapp/validate-relic-alias-mapping-v1.js
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const starMap = require(path.join(ROOT, 'apps/miniapp/data/relic-alias/relic-star-alias-map.js'));
const meridianMap = require(path.join(ROOT, 'apps/miniapp/data/relic-alias/relic-meridian-alias-map.js'));
const relicAliasService = require(path.join(ROOT, 'apps/miniapp/services/relic-alias/relic-alias-service.js'));
const starMapService = require(path.join(ROOT, 'apps/miniapp/services/star-map/star-map-service.js'));
const meridianMapService = require(path.join(ROOT, 'apps/miniapp/services/meridian-map/meridian-map-service.js'));
const unityService = require(path.join(ROOT, 'apps/miniapp/services/heaven-human-unity/heaven-human-unity-service.js'));
const chapterRegistry = require(path.join(ROOT, 'apps/miniapp/services/chapter/chapter-runtime-registry.js'));

const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

const relics = chapterRegistry.getAllRelics();
const stats = relicAliasService.getMappingStats();
const starOverview = starMapService.getStarMapOverview();
const meridianOverview = meridianMapService.getMeridianOverview();
const unityOverview = unityService.getHeavenHumanUnityOverview();

assert(relics.length === 60, `信物总数应为 60，实际 ${relics.length}`);
assert(starMap.mappings.length === 60, `星图映射应为 60，实际 ${starMap.mappings.length}`);
assert(meridianMap.mappings.length === 60, `经络映射应为 60，实际 ${meridianMap.mappings.length}`);
assert(stats.starMappedCount === 60, `STAR_ALIAS_MAPPED 不足 60`);
assert(stats.pointMappedCount === 60, `POINT_ALIAS_MAPPED 不足 60`);

const requiredRecent = [
  'relic_ch01_gate_badge',
  'relic_ch01_cloud_gate_imprint_a',
  'relic_ch01_plaza'
];
requiredRecent.forEach((id) => {
  assert(relicAliasService.getStarMappingByRelicId(id), `最近信物缺少星图映射: ${id}`);
  assert(relicAliasService.getMeridianMappingByRelicId(id), `最近信物缺少经络映射: ${id}`);
});

relics.forEach((relic) => {
  const enriched = relicAliasService.enrichRelic(relic);
  assert(enriched.star_alias_id, `缺少 star_alias_id: ${relic.id}`);
  assert(enriched.star_alias_name, `缺少 star_alias_name: ${relic.id}`);
  assert(enriched.point_alias_id, `缺少 point_alias_id: ${relic.id}`);
  assert(enriched.point_alias_name, `缺少 point_alias_name: ${relic.id}`);
});

const starIds = starMap.mappings.map((item) => item.star_alias_id);
const pointIds = meridianMap.mappings.map((item) => item.point_id);
assert(new Set(starIds).size === starIds.length, '星图映射存在重复 star_alias_id');
assert(new Set(pointIds).size === pointIds.length, '经络映射存在重复 point_id');

assert(starOverview.lit > 0, '星图点亮数仍为 0');
assert(meridianOverview.lit > 0, '经络图点亮数仍为 0');
assert(parseInt(unityOverview.heavenDisplay, 10) > 0 || unityOverview.heavenSealedCount > 0, '天印进度未更新');
assert(parseInt(unityOverview.humanDisplay, 10) > 0 || unityOverview.humanSealedCount > 0, '人印进度未更新');

console.log('RELIC_ALIAS_VALIDATION_ERRORS=' + errors.length);
errors.forEach((e) => console.log('ERROR:', e));

if (!errors.length) {
  console.log('STAR_ALIAS_MAPPED_COUNT=' + stats.starMappedCount);
  console.log('POINT_ALIAS_MAPPED_COUNT=' + stats.pointMappedCount);
  console.log('STAR_LIT=' + starOverview.litDisplay);
  console.log('MERIDIAN_LIT=' + meridianOverview.litDisplay);
  console.log('UNITY_HEAVEN=' + unityOverview.heavenDisplay);
  console.log('UNITY_HUMAN=' + unityOverview.humanDisplay);
  console.log('PASS=YES');
  process.exit(0);
}

process.exit(1);
