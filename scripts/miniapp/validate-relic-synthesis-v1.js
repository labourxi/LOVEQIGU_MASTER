/**
 * RELIC_SYNTHESIS_SYSTEM_V1 validation
 * Run: node scripts/miniapp/validate-relic-synthesis-v1.js
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const starRules = require(path.join(ROOT, 'apps/miniapp/data/synthesis/star-synthesis-rules.js'));
const symbolRules = require(path.join(ROOT, 'apps/miniapp/data/synthesis/symbol-synthesis-rules.js'));
const heavenRules = require(path.join(ROOT, 'apps/miniapp/data/synthesis/heaven-seal-rules.js'));
const meridianRules = require(path.join(ROOT, 'apps/miniapp/data/synthesis/meridian-synthesis-rules.js'));
const humanRules = require(path.join(ROOT, 'apps/miniapp/data/synthesis/human-seal-rules.js'));
const synthesisService = require(path.join(ROOT, 'apps/miniapp/services/synthesis/synthesis-service.js'));
const synthesisStorage = require(path.join(ROOT, 'apps/miniapp/services/synthesis/synthesis-storage.js'));
const unityService = require(path.join(ROOT, 'apps/miniapp/services/heaven-human-unity/heaven-human-unity-service.js'));
const starMapService = require(path.join(ROOT, 'apps/miniapp/services/star-map/star-map-service.js'));
const meridianMapService = require(path.join(ROOT, 'apps/miniapp/services/meridian-map/meridian-map-service.js'));

const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

const APIS = [
  'getAvailableSyntheses',
  'canSynthesize',
  'performSynthesis',
  'getHeavenSealProgress',
  'getHumanSealProgress'
];
APIS.forEach((name) => {
  assert(typeof synthesisService[name] === 'function', `缺少 API: ${name}`);
});

assert(starRules.mansion_rules.length === 28, '宿印规则应为 28');
assert(symbolRules.symbol_rules.length === 4, '四象印规则应为 4');
assert(heavenRules.heaven_rule, '缺少天印规则');
assert(meridianRules.meridian_rules.length >= 12, '经络印规则不足');
assert(humanRules.human_rule, '缺少人印规则');

const xinRule = starRules.mansion_rules.find((rule) => rule.mansion_id === 'xin');
assert(xinRule && xinRule.reward_relic.name === '心宿印', '心宿印规则缺失');
assert(xinRule.reward_relic.reward_type === 'cultural_experience', '心宿印奖励类型异常');

const qinglongRule = symbolRules.symbol_rules.find((rule) => rule.symbol_id === 'qinglong');
assert(qinglongRule && qinglongRule.reward_relic.name === '青龙印', '青龙印规则缺失');
assert(qinglongRule.reward_relic.reward_type === 'physical_relic', '青龙印奖励类型异常');

assert(heavenRules.heaven_rule.reward_relic.reward_type === 'certificate', '天印奖励类型异常');

synthesisStorage.resetStateForTest();
const beforeStar = starMapService.getStarMapOverview().lit;
const beforeMeridian = meridianMapService.getMeridianOverview().lit;

const available = synthesisService.getAvailableSyntheses();
assert(available.length > 0, '合成列表为空');

const ready = available.filter((item) => item.canPerform);
assert(ready.length > 0, '无可合成项（条件识别失败）');

const target = ready.find((item) => item.id === 'mansion_xin') || ready[0];
assert(synthesisService.canSynthesize(target.id), 'canSynthesize 应为 true');

const result = synthesisService.performSynthesis(target.id);
assert(result.ok, 'performSynthesis 失败');

const records = synthesisStorage.getSynthesizedRecords();
assert(records.length === 1, '合成记录未写入');

const afterStar = starMapService.getStarMapOverview().lit;
const afterMeridian = meridianMapService.getMeridianOverview().lit;
assert(afterStar === beforeStar, '星图点亮数不应因合成而丢失');
assert(afterMeridian === beforeMeridian, '经络点亮数不应因合成而丢失');

const heaven = synthesisService.getHeavenSealProgress();
const human = synthesisService.getHumanSealProgress();
assert(heaven.symbolProgress.length === 4, '天印四象进度缺失');
assert(human.regularMeridians.length >= 12, '正经印进度缺失');

const unity = unityService.getHeavenHumanUnityOverview();
assert(unity.starLitDisplay.indexOf('0/') !== 0, '星图进度仍为 0');
assert(unity.meridianLitDisplay.indexOf('0/') !== 0, '经络图进度仍为 0');

const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'apps/miniapp/app.json'), 'utf8'));
assert(appJson.pages.includes('pages/synthesis/index'), '未注册 synthesis 页面');
assert(appJson.pages.includes('pages/seals/index'), '未注册 seals 页面');

const homePanel = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/components/explore-home-panel/explore-home-panel.wxml'),
  'utf8'
);
assert(/信物合成/.test(homePanel), '首页缺少信物合成入口');

console.log('SYNTHESIS_VALIDATION_ERRORS=' + errors.length);
errors.forEach((e) => console.log('ERROR:', e));

if (!errors.length) {
  console.log('READY_COUNT=' + ready.length);
  console.log('STAR_LIT=' + afterStar);
  console.log('MERIDIAN_LIT=' + afterMeridian);
  console.log('PASS=YES');
  process.exit(0);
}

process.exit(1);
