/**
 * Generate full CH01–CH10 relic ↔ star / meridian alias maps.
 * Run: node scripts/miniapp/generate-relic-alias-maps.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'apps/miniapp/data/relic-alias');

const starCatalog = require(path.join(ROOT, 'apps/miniapp/data/star-map/star-catalog.js'));
const meridianCatalog = require(path.join(ROOT, 'apps/miniapp/data/meridian-map/meridian-catalog.js'));
const chapterRegistry = require(path.join(ROOT, 'apps/miniapp/services/chapter/chapter-runtime-registry.js'));

const STAR_OVERRIDES = {
  relic_ch01_gate_badge: 'xin_02',
  relic_ch01_cloud_gate_imprint_a: 'jiao_01',
  relic_ch01_plaza: 'fang_03'
};

const POINT_OVERRIDES = {
  relic_ch01_gate_badge: 'yunmen',
  relic_ch01_cloud_gate_imprint_a: 'zhongfu',
  relic_ch01_plaza: 'tianfu'
};

function collectStars() {
  const stars = [];
  starCatalog.symbols.forEach((symbol) => {
    symbol.mansions.forEach((mansion) => {
      mansion.stars.forEach((star) => {
        stars.push({
          star_alias_id: star.alias_ref,
          star_alias_name: star.name,
          mansion_id: mansion.id,
          mansion_name: mansion.name,
          symbol_id: symbol.id,
          symbol_name: symbol.name
        });
      });
    });
  });
  return stars;
}

function collectPoints() {
  const points = [];
  meridianCatalog.meridians.forEach((meridian) => {
    meridian.points.forEach((point) => {
      points.push({
        point_id: point.id,
        point_name: point.name,
        meridian_id: meridian.id,
        meridian_name: meridian.name
      });
    });
  });
  return points;
}

function assignUnique(relics, pool, overrides, keyField) {
  const used = new Set(Object.values(overrides));
  let poolIndex = 0;
  return relics.map((relic) => {
    const overrideId = overrides[relic.id];
    let entry = null;
    if (overrideId) {
      entry = pool.find((item) => item[keyField] === overrideId);
    }
    if (!entry) {
      while (poolIndex < pool.length && used.has(pool[poolIndex][keyField])) {
        poolIndex += 1;
      }
      entry = pool[poolIndex];
      poolIndex += 1;
    }
    if (!entry) {
      throw new Error(`池不足，无法映射信物 ${relic.id}`);
    }
    used.add(entry[keyField]);
    return {
      relic_id: relic.id,
      relic_name: relic.name,
      ...entry
    };
  });
}

function writeModule(filePath, schema, mappings) {
  const body = `/** 信物别名映射 — 自动生成，共 ${mappings.length} 条 */\n\nmodule.exports = {\n  schema: '${schema}',\n  version: '1.0.0',\n  mappings: ${JSON.stringify(mappings, null, 2)}\n};\n`;
  fs.writeFileSync(filePath, body, 'utf8');
}

const relics = chapterRegistry.getAllRelics();
const stars = collectStars();
const points = collectPoints();

if (relics.length > stars.length) {
  throw new Error(`星名池不足：信物 ${relics.length}，星 ${stars.length}`);
}
if (relics.length > points.length) {
  throw new Error(`穴位池不足：信物 ${relics.length}，穴 ${points.length}`);
}

const starMappings = assignUnique(relics, stars, STAR_OVERRIDES, 'star_alias_id');
const pointMappings = assignUnique(relics, points, POINT_OVERRIDES, 'point_id');

fs.mkdirSync(OUT_DIR, { recursive: true });
writeModule(
  path.join(OUT_DIR, 'relic-star-alias-map.js'),
  'loveqigu.relic_alias.star.v1',
  starMappings
);
writeModule(
  path.join(OUT_DIR, 'relic-meridian-alias-map.js'),
  'loveqigu.relic_alias.meridian.v1',
  pointMappings
);

console.log('STAR_MAPPINGS=' + starMappings.length);
console.log('POINT_MAPPINGS=' + pointMappings.length);
console.log('OUT=' + OUT_DIR);
