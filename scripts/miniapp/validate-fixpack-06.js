/**
 * FIXPACK-06 validation
 * Run: node scripts/miniapp/validate-fixpack-06.js
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const MINIAPP = path.join(ROOT, 'apps/miniapp');

const errors = [];
const forbiddenUserPatterns = [/爱企谷/, /\bLOVEQIGU\b/, /LOVEQIGU_/];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function walk(dir, acc) {
  if (!fs.existsSync(dir)) {
    return acc;
  }
  fs.readdirSync(dir).forEach((name) => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules') {
        return;
      }
      walk(full, acc);
    } else if (/\.(wxml|js)$/.test(name)) {
      acc.push(full);
    }
  });
  return acc;
}

function isUserFacingPath(filePath) {
  const rel = path.relative(MINIAPP, filePath).replace(/\\/g, '/');
  if (rel.startsWith('pages/') || rel.startsWith('components/')) {
    return true;
  }
  if (rel === 'app.js' || rel.startsWith('services/home/') || rel.startsWith('services/prototype/')) {
    return true;
  }
  if (rel === 'config/brand.v1.js') {
    return true;
  }
  return false;
}

const userFiles = [];
['pages', 'components', 'services/home', 'services/prototype', 'config'].forEach((segment) => {
  walk(path.join(MINIAPP, segment), userFiles);
});
if (fs.existsSync(path.join(MINIAPP, 'app.js'))) {
  userFiles.push(path.join(MINIAPP, 'app.js'));
}

userFiles.forEach((filePath) => {
  if (!isUserFacingPath(filePath)) {
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  forbiddenUserPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      errors.push(`用户可见文案违规: ${path.relative(ROOT, filePath)} 匹配 ${pattern}`);
    }
  });
});

const firstLight = require(path.join(MINIAPP, 'services/immersion/first-light-service.js'));
const culturalCopy = require(path.join(MINIAPP, 'data/cultural/cultural-copy.js'));
const rewardCenter = require(path.join(MINIAPP, 'services/reward/reward-center-service.js'));
const synthesisService = require(path.join(MINIAPP, 'services/synthesis/synthesis-service.js'));
const synthesisStorage = require(path.join(MINIAPP, 'services/synthesis/synthesis-storage.js'));

firstLight.resetForTest();
assert(firstLight.checkFirstStarLit(1), '首次星名提示缺失');
assert(firstLight.checkFirstPointLit(1), '首次穴位提示缺失');
assert(firstLight.checkFirstMansionSeal(), '首次宿印提示缺失');
assert(firstLight.checkFirstMeridianSeal(), '首次经络印提示缺失');

assert(culturalCopy.symbols.qinglong, '青龙文化文案缺失');
assert(culturalCopy.meridians.lung, '肺经文化文案缺失');
assert(culturalCopy.mansions.xin, '心宿文化文案缺失');

const center = rewardCenter.getRewardCenter();
assert(center.categories.length === 3, '奖励中心分类不足');
assert(center.categories[0].title === '文化体验', '文化体验分类缺失');

assert(fs.existsSync(path.join(MINIAPP, 'pages/reward-center/index.js')), '奖励中心页面缺失');
assert(fs.existsSync(path.join(MINIAPP, 'components/celebration-modal/celebration-modal.wxml')), '庆祝弹窗组件缺失');

const appJson = JSON.parse(fs.readFileSync(path.join(MINIAPP, 'app.json'), 'utf8'));
assert(appJson.pages.includes('pages/reward-center/index'), 'app.json 未注册奖励中心');

const homePanel = fs.readFileSync(
  path.join(MINIAPP, 'components/explore-home-panel/explore-home-panel.wxml'),
  'utf8'
);
assert(/我的奖励/.test(homePanel), '首页缺少我的奖励入口');
assert(/信物合成/.test(homePanel), '首页缺少信物合成入口');

synthesisStorage.resetStateForTest();
const ready = synthesisService.getAvailableSyntheses().filter((item) => item.canPerform);
if (ready.length) {
  const result = synthesisService.performSynthesis(ready[0].id);
  assert(result.ok, '合成执行失败');
}

const brand = require(path.join(MINIAPP, 'config/brand.v1.js'));
assert(brand.productName === 'AR游伴', '产品名应为 AR游伴');
assert(!/爱企谷/.test(brand.demoScenicName), 'demoScenicName 仍含爱企谷');

console.log('FIXPACK_06_VALIDATION_ERRORS=' + errors.length);
errors.forEach((e) => console.log('ERROR:', e));

if (!errors.length) {
  console.log('PASS=YES');
  process.exit(0);
}

process.exit(1);
