/**
 * Generate synthesis rule files from star / meridian catalogs.
 * Run: node scripts/miniapp/generate-synthesis-rules.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'apps/miniapp/data/synthesis');
const starCatalog = require(path.join(ROOT, 'apps/miniapp/data/star-map/star-catalog.js'));
const meridianCatalog = require(path.join(ROOT, 'apps/miniapp/data/meridian-map/meridian-catalog.js'));

function rewardTypeForMansion() {
  return 'cultural_experience';
}

function rewardTypeForSymbol() {
  return 'physical_relic';
}

function rewardTypeForHeaven() {
  return 'certificate';
}

function rewardTypeForMeridian(meridian) {
  return meridian.category === 'extraordinary' ? 'cultural_experience' : 'cultural_experience';
}

function rewardDesc(type, name) {
  if (type === 'physical_relic') {
    return `${name} · 实体信物资格`;
  }
  if (type === 'certificate') {
    return `${name} · 高阶体验资格`;
  }
  return `${name} · 东方文化体验资格`;
}

const mansionRules = [];
starCatalog.symbols.forEach((symbol) => {
  symbol.mansions.forEach((mansion) => {
    const rewardType = rewardTypeForMansion();
    const rewardName = `${mansion.name}印`;
    mansionRules.push({
      id: `mansion_${mansion.id}`,
      level: 'mansion',
      mansion_id: mansion.id,
      mansion_name: mansion.name,
      symbol_id: symbol.id,
      symbol_name: symbol.name,
      required_stars: mansion.stars.map((star) => star.alias_ref),
      required_star_names: mansion.stars.map((star) => star.name),
      reward_relic: {
        id: `seal_${mansion.id}`,
        name: rewardName,
        reward_type: rewardType,
        reward_desc: rewardDesc(rewardType, rewardName)
      }
    });
  });
});

const symbolRules = starCatalog.symbols.map((symbol) => {
  const rewardType = rewardTypeForSymbol();
  const rewardName = `${symbol.short_name}印`;
  return {
    id: `symbol_${symbol.id}`,
    level: 'symbol',
    symbol_id: symbol.id,
    symbol_name: symbol.name,
    symbol_short_name: symbol.short_name,
    required_mansion_seals: symbol.mansions.map((m) => `seal_${m.id}`),
    required_mansion_names: symbol.mansions.map((m) => `${m.name}印`),
    reward_relic: {
      id: `seal_${symbol.id}`,
      name: rewardName,
      reward_type: rewardType,
      reward_desc: rewardDesc(rewardType, rewardName)
    }
  };
});

const heavenRule = {
  id: 'heaven_seal',
  level: 'heaven',
  required_symbol_seals: symbolRules.map((rule) => rule.reward_relic.id),
  required_symbol_names: symbolRules.map((rule) => rule.reward_relic.name),
  reward_relic: {
    id: 'seal_heaven',
    name: '天印',
    reward_type: rewardTypeForHeaven(),
    reward_desc: rewardDesc(rewardTypeForHeaven(), '天印')
  }
};

const meridianRules = meridianCatalog.meridians
  .filter((meridian) => meridian.points.length > 0)
  .map((meridian) => {
    const suffix = meridian.category === 'extraordinary' ? '奇经印' : '经络印';
    const shortLabel = meridian.short_name || meridian.name;
    const rewardName = `${shortLabel}印`;
    const rewardType = rewardTypeForMeridian(meridian);
    return {
      id: `meridian_${meridian.id}`,
      level: 'meridian',
      meridian_id: meridian.id,
      meridian_name: meridian.name,
      category: meridian.category,
      required_points: meridian.points.map((point) => point.id),
      required_point_names: meridian.points.map((point) => point.name),
      reward_relic: {
        id: `seal_${meridian.id}`,
        name: rewardName,
        reward_type: rewardType,
        reward_desc: rewardDesc(rewardType, rewardName)
      }
    };
  });

const humanRule = {
  id: 'human_seal',
  level: 'human',
  required_meridian_seals: meridianRules.map((rule) => rule.reward_relic.id),
  required_meridian_names: meridianRules.map((rule) => rule.reward_relic.name),
  reward_relic: {
    id: 'seal_human',
    name: '人印',
    reward_type: 'certificate',
    reward_desc: rewardDesc('certificate', '人印')
  }
};

function writeModule(name, body) {
  const content = `/** 合成规则 — 自动生成 */\n\nmodule.exports = ${JSON.stringify(body, null, 2)};\n`;
  fs.writeFileSync(path.join(OUT, name), content, 'utf8');
}

fs.mkdirSync(OUT, { recursive: true });
writeModule('star-synthesis-rules.js', {
  schema: 'loveqigu.synthesis.star.v1',
  version: '1.0.0',
  mansion_rules: mansionRules
});
writeModule('symbol-synthesis-rules.js', {
  schema: 'loveqigu.synthesis.symbol.v1',
  version: '1.0.0',
  symbol_rules: symbolRules
});
writeModule('heaven-seal-rules.js', {
  schema: 'loveqigu.synthesis.heaven.v1',
  version: '1.0.0',
  heaven_rule: heavenRule
});
writeModule('meridian-synthesis-rules.js', {
  schema: 'loveqigu.synthesis.meridian.v1',
  version: '1.0.0',
  meridian_rules: meridianRules
});
writeModule('human-seal-rules.js', {
  schema: 'loveqigu.synthesis.human.v1',
  version: '1.0.0',
  human_rule: humanRule
});

console.log('MANSION_RULES=' + mansionRules.length);
console.log('SYMBOL_RULES=' + symbolRules.length);
console.log('MERIDIAN_RULES=' + meridianRules.length);
console.log('OUT=' + OUT);
