/**
 * HEAVEN_HUMAN_UNITY_SYSTEM_V1 validation — run: node scripts/miniapp/validate-heaven-human-unity-v1.js
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const unityService = require(path.join(ROOT, 'apps/miniapp/services/heaven-human-unity/heaven-human-unity-service.js'));

const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

const overview = unityService.getHeavenHumanUnityOverview();

assert(typeof unityService.getHeavenHumanUnityOverview === 'function', '缺少 getHeavenHumanUnityOverview');
assert(overview.heavenSeals.length === 4, '天印四象数量应为 4');
assert(overview.regularSeals.length === 12, '十二正经数量应为 12');
assert(overview.extraordinarySeals.length >= 4, '奇经八脉进度缺失');
assert(overview.heavenDisplay === `${overview.heavenSealedCount} / 4`, '天印进度格式异常');
assert(overview.humanDisplay === `${overview.humanSealedCount} / ${overview.humanSealTotal}`, '人印进度格式异常');
assert(overview.unityStatusLabel === '未达成' || overview.unityStatusLabel === '已达成', '天人合一状态文案异常');

const heavenNames = overview.heavenSeals.map((item) => item.name);
['青龙印', '朱雀印', '白虎印', '玄武印'].forEach((name) => {
  assert(heavenNames.includes(name), `缺少天印项: ${name}`);
});

assert(/观天之道，察人之身/.test(overview.intro), '缺少说明文案');
assert(/集天印与人印，方可开启天人合一/.test(overview.intro), '缺少说明文案');

const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'apps/miniapp/app.json'), 'utf8'));
assert(appJson.pages.includes('pages/heaven-human-unity/index'), 'app.json 未注册页面');

const homePanel = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/components/explore-home-panel/explore-home-panel.wxml'),
  'utf8'
);
assert(/天人合一/.test(homePanel), '首页缺少天人合一入口');

const pageJs = fs.readFileSync(
  path.join(ROOT, 'apps/miniapp/pages/heaven-human-unity/index.js'),
  'utf8'
);
assert(!/prototype-runtime-service/.test(pageJs), '页面不应依赖 prototype-runtime');

console.log('HEAVEN_HUMAN_UNITY_VALIDATION_ERRORS=' + errors.length);
errors.forEach((e) => console.log('ERROR:', e));

if (!errors.length) {
  console.log('HEAVEN_DISPLAY=' + overview.heavenDisplay);
  console.log('HUMAN_DISPLAY=' + overview.humanDisplay);
  console.log('UNITY_STATUS=' + overview.unityStatusLabel);
  console.log('PASS=YES');
  process.exit(0);
}

process.exit(1);
