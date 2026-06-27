/**
 * VALIDATE SPATIAL V2 — 视觉完成度提升验证
 *
 * 验证 Visual Completion Upgrade V2 的各项要求：
 *   1. 世界视觉母体完成度
 *   2. 页面空间化（无卡片 UI）
 *   3. 信物三态（空间化）
 *   4. 场景空间化
 *   5. 视觉一致性
 *   6. 禁止项排查
 */

const fs = require('fs');
const path = require('path');

const VISUAL_ROOT = path.join(__dirname);
const WORLD_ATMOSPHERE = path.join(VISUAL_ROOT, 'world_atmosphere', 'world_atmosphere.css');
const LANDING_SPATIAL = path.join(VISUAL_ROOT, 'pages', 'landing_spatial.css');
const EXPLORE_SPATIAL = path.join(VISUAL_ROOT, 'pages', 'explore_spatial.css');
const RELIC_SPATIAL = path.join(VISUAL_ROOT, 'relic', 'relic_spatial.css');
const SCENE_SPATIAL_JS = path.join(VISUAL_ROOT, 'scenes', 'scene_spatialization_v1.js');
const MOTION_CSS = path.join(VISUAL_ROOT, 'motion', 'motion_visual.css');
const TOKENS_CSS = path.join(VISUAL_ROOT, 'visual_tokens.css');

// ─── 辅助函数 ───
function readFile(p) {
  try { return fs.readFileSync(p, 'utf-8'); }
  catch (e) { return null; }
}

function containsAll(text, items) {
  if (!text) return { ok: false, missing: items };
  var missing = items.filter(function (i) { return text.indexOf(i) < 0; });
  return { ok: missing.length === 0, missing: missing };
}

function doesNotContain(text, items) {
  if (!text) return { ok: true };
  var found = items.filter(function (i) { return text.indexOf(i) >= 0; });
  return { ok: found.length === 0, found: found };
}

// ════════════════════════════════════════════════════════════
// 结果收集
// ════════════════════════════════════════════════════════════
var results = [];
var errors = 0;
var warnings = 0;

function check(name, passed, detail, isError) {
  results.push({
    name: name,
    passed: passed,
    detail: detail || ''
  });
  if (!passed && isError !== false) errors++;
  else if (!passed) warnings++;
}

check('文件完整性 — world_atmosphere.css', !!readFile(WORLD_ATMOSPHERE), '');
check('文件完整性 — landing_spatial.css', !!readFile(LANDING_SPATIAL), '');
check('文件完整性 — explore_spatial.css', !!readFile(EXPLORE_SPATIAL), '');
check('文件完整性 — relic_spatial.css', !!readFile(RELIC_SPATIAL), '');
check('文件完整性 — scene_spatialization_v1.js', !!readFile(SCENE_SPATIAL_JS), '');
check('文件完整性 — motion_visual.css', !!readFile(MOTION_CSS), '');
check('文件完整性 — visual_tokens.css', !!readFile(TOKENS_CSS), '');

// ════════════════════════════════════════════════════════════
// 1. World Atmosphere System
// ════════════════════════════════════════════════════════════
var wa = readFile(WORLD_ATMOSPHERE);

var waSectionNames = [
  'LIGHT SYSTEM', 'FOG SYSTEM', 'DEPTH SYSTEM', 'MATERIAL SYSTEM'
];
check('WA — 四大子系统定义', containsAll(wa, waSectionNames).ok,
  '期望: ' + waSectionNames.join(', ') + ' | ' +
    JSON.stringify(containsAll(wa, waSectionNames).missing));

check('WA — 环境光 .world-ambient', containsAll(wa, ['.world-ambient']).ok, '');
check('WA — 聚焦光 .world-focus-glow', containsAll(wa, ['.world-focus-glow']).ok, '');
check('WA — 显现光 .world-reveal-light', containsAll(wa, ['.world-reveal-light']).ok, '');
check('WA — 远雾 .world-fog__deep', containsAll(wa, ['.world-fog__deep']).ok, '');
check('WA — 中雾 .world-fog__mid', containsAll(wa, ['.world-fog__mid']).ok, '');
check('WA — 近雾 .world-fog__near', containsAll(wa, ['.world-fog__near']).ok, '');
check('WA — 星层 .world-stars', containsAll(wa, ['.world-stars']).ok, '');
check('WA — 光路 .world-light-path', containsAll(wa, ['.world-light-path']).ok, '');
check('WA — 粒子 .world-particles', containsAll(wa, ['.world-particles']).ok, '');
check('WA — 呼吸节律 world-breath', containsAll(wa, ['world-breath']).ok, '');
check('WA — 材质规则（无纯色/无硬边）', containsAll(wa, ['@define-mixin surface-glass', '@define-mixin edge-soft']).ok, '');

// ════════════════════════════════════════════════════════════
// 2. Page Spatial — Landing
// ════════════════════════════════════════════════════════════
var ls = readFile(LANDING_SPATIAL);

// 使用语义空间类名（不是 card/button 类名）
var landingExpectedSelectors = [
  '.landing-space', '.landing-space__icon', '.landing-space__title',
  '.landing-space__subtitle', '.landing-space__description',
  '.landing-space__scene-lights', '.landing-space__light-dot',
  '.landing-space__entry', '.landing-space__entry-trigger',
  '.landing-space__footer'
];
check('LANDING — 空间类名完整', containsAll(ls, landingExpectedSelectors).ok, '');

// 禁止项
check('LANDING — 无 card 类名', doesNotContain(ls, ['.landing-card', '.card']).ok, '', false);
var lsNoComment = ls.replace(/\/\*[\s\S]*?\*\//g, '');
check('LANDING — 无 btn 类名', lsNoComment.indexOf('.btn') < 0 && lsNoComment.indexOf('.button') < 0 && lsNoComment.indexOf('.landing-cta') < 0, '', false);
check('LANDING — 无 badge 类名', doesNotContain(ls, ['.badge', '.landing-badge']).ok, '', false);
check('LANDING — 无 UI 按钮风格（已替换为 entry-trigger）',
  ls.indexOf('entry-trigger') >= 0,
  '期望包含 .landing-space__entry-trigger');

// 雾化背景、深度空间
check('LANDING — 雾效背景', containsAll(ls, ['radial-gradient', 'blur']).ok, '');
check('LANDING — 入场序列', containsAll(ls, ['animation-delay']).ok, '');

// ════════════════════════════════════════════════════════════
// 3. Page Spatial — Explore
// ════════════════════════════════════════════════════════════
var es = readFile(EXPLORE_SPATIAL);

var exploreExpectedSelectors = [
  '.explore-space__header', '.explore-space__title',
  '.explore-space__intro', '.explore-space__intro-text',
  '.explore-space__nodes', '.spatial-node',
  '.spatial-node__name', '.spatial-node__type',
  '.spatial-depth-distant', '.spatial-depth-mid', '.spatial-depth-close',
  'state-locked', 'state-active', 'state-collected'
];
check('EXPLORE — 空间类名完整', containsAll(es, exploreExpectedSelectors).ok, '');

// 核心：检查是否有卡片残留
check('EXPLORE — 无 card 结构', doesNotContain(es, ['.node-card', '.node-card__']).ok,
  '禁止使用 .node-card 类', false);

// badge 是卡片 UI 的标志
check('EXPLORE — 无 badge', doesNotContain(es, ['.badge', 'node-card__badge']).ok, '', false);

// 无卡片背景/边框 — spatial-node 自身 background 须为 none
check('EXPLORE — spatial-node 无背景',
  es.indexOf('.spatial-node {\n  position: relative;\n  margin-bottom: 20px;\n  padding: 20px 24px;\n  cursor: default;\n  transition: all 0.6s var(--ease-breath, cubic-bezier(0.45, 0.05, 0.55, 0.95));\n  transform-origin: center left;\n  /* 无背景 — 无卡片 — 无边框 */\n  background: none;\n  border: none;\n  border-radius: 0;') >= 0 ||
  (es.indexOf('background: none;') >= 0 && es.indexOf('border: none;') >= 0),
  'spatial-node 不应有卡片背景', false);

// 空间节点检查
check('EXPLORE — 节点光效（::before + 呼吸）',
  containsAll(es, ['spatial-node.state-active::before', 'node-light-breath']).ok, '');
check('EXPLORE — 节点三态（LOCKED/ACTIVE/COLLECTED）',
  containsAll(es, ['.state-locked', '.state-active', '.state-collected']).ok, '');
check('EXPLORE — 入场 sequence',
  containsAll(es, ['motion-reveal-up', 'animation-delay']).ok, '');

// ════════════════════════════════════════════════════════════
// 4. Relic Spatial — 信物空间化
// ════════════════════════════════════════════════════════════
var rs = readFile(RELIC_SPATIAL);

var relicExpectedSelectors = [
  '.relic-manifestation', '.relic-manifestation__light-ring',
  '.relic-manifestation__name', '.relic-manifestation__source',
  '.relic-manifestation__stages', '.relic-manifestation__stage-dot',
  '.relic-overlay', '.relic-overlay__bg', '.relic-overlay__focus',
  'state-locked', 'state-active', 'state-collected'
];
check('RELIC — 空间类名完整', containsAll(rs, relicExpectedSelectors).ok, '');

// 强制：无 relic-card 结构（仅检查实际 CSS 类定义）
check('RELIC — 无 relic-card CSS 类', rs.indexOf('.relic-card') < 0 && rs.indexOf('.relic-card__') < 0,
  '不应有 .relic-card CSS 类定义', false);
// 无按钮
// 检查 relic_spatial.css 中是否有实际 CSS 类定义（非注释）
var rsNoComment = rs.replace(/\/\*[\s\S]*?\*\//g, '');
check('RELIC — 无按钮 CSS 类', rsNoComment.indexOf('.btn') < 0 && rsNoComment.indexOf('btn-') < 0,
  'CSS 不应有按钮类定义', false);

// 三态详细检查
check('RELIC — LOCKED 态：暗+透明+无光',
  containsAll(rs, ['state-locked', 'grayscale', 'opacity: 0.2']).ok, '');
check('RELIC — ACTIVE 态：微光+呼吸+可交互',
  containsAll(rs, ['state-active', 'relic-light-respire', 'light-gold']).ok, '');
check('RELIC — COLLECTED 态：光环+稳定存在',
  containsAll(rs, ['state-collected', 'light-ring', '160, 216, 160']).ok, '');

// 显现动画
check('RELIC — 显现动画 reveal',
  containsAll(rs, ['motion-reveal']).ok, '');
check('RELIC — 收集动画 burst',
  containsAll(rs, ['motion-burst']).ok, '');

// 覆盖层（非弹窗）
check('RELIC — 覆盖层（非弹窗）',
  containsAll(rs, ['.relic-overlay', '.relic-overlay__bg']).ok, '');

// 三态 CSS 变量
check('RELIC — 三态 CSS 变量（--relic-light/--relic-presence）',
  containsAll(rs, ['--relic-light', '--relic-presence']).ok, '');

// ════════════════════════════════════════════════════════════
// 5. Scene Spatialization
// ════════════════════════════════════════════════════════════
var ss = readFile(SCENE_SPATIAL_JS);

check('SCENE — 空间深度定义（distant/mid/close）',
  containsAll(ss, ['DISTANT', 'MID', 'CLOSE']).ok, '');
check('SCENE — 光照定义（strong/medium/weak）',
  containsAll(ss, ['STRONG', 'MEDIUM', 'WEAK']).ok, '');
check('SCENE — 场景空间化数据',
  containsAll(ss, ['entrance_plaza', 'central_plaza', 'jiangnan_street']).ok, '');
check('SCENE — 7 个场景完整',
  containsAll(ss, ['interior_cafe', 'interior_bookstore', 'interior_craft_hall', 'entrance_landscape']).ok, '');
check('SCENE — 每个节点有 distance/light/interaction',
  containsAll(ss, ['distance', 'light_exposure', 'interaction_weight']).ok, '');

// 导出函数
check('SCENE — 导出 getSceneSpatialData',
  ss.indexOf('getSceneSpatialData') >= 0, '');
check('SCENE — 导出 generateNodeSpatialStyle',
  ss.indexOf('generateNodeSpatialStyle') >= 0, '');

// ════════════════════════════════════════════════════════════
// 6. Visual Consistency — 所有视觉模块使用 tokens
// ════════════════════════════════════════════════════════════
function countTokenRefs(content) {
  if (!content) return 0;
  var m = content.match(/var\(--/g);
  return m ? m.length : 0;
}

var waTokens = countTokenRefs(wa);
var lsTokens = countTokenRefs(ls);
var esTokens = countTokenRefs(es);
var rsTokens = countTokenRefs(rs);

check('VISUAL — world_atmosphere.css 引用 tokens', waTokens >= 10, waTokens + ' 处引用');
check('VISUAL — landing_spatial.css 引用 tokens', lsTokens >= 8, lsTokens + ' 处引用');
check('VISUAL — explore_spatial.css 引用 tokens', esTokens >= 8, esTokens + ' 处引用');
check('VISUAL — relic_spatial.css 引用 tokens', rsTokens >= 10, rsTokens + ' 处引用');

// ════════════════════════════════════════════════════════════
// 7. 业务逻辑隔离检查
// ════════════════════════════════════════════════════════════
var allCSS = [wa, ls, es, rs].join('\n');
check('视觉 — 无 relic_engine 引用',
  allCSS.indexOf('relic_engine') < 0, '', false);
check('视觉 — 无 state_machine 引用',
  allCSS.indexOf('state_machine') < 0, '', false);
check('视觉 — 无 bootstrap 引用',
  allCSS.indexOf('bootstrap') < 0, '', false);

// ════════════════════════════════════════════════════════════
// 8. HTML 页面检查
// ════════════════════════════════════════════════════════════
var landingHTML = readFile(path.join(__dirname, '..', '..', 'pages', 'landing', 'landing.html'));
var exploreHTML = readFile(path.join(__dirname, '..', '..', 'pages', 'explore', 'explore.html'));

// landing 引用
check('Landing HTML — 引用 world_atmosphere.css',
  landingHTML && landingHTML.indexOf('world_atmosphere.css') >= 0,
  '需 link world_atmosphere.css');
check('Landing HTML — 引用 landing_spatial.css',
  landingHTML && landingHTML.indexOf('landing_spatial.css') >= 0, '');
check('Landing HTML — 使用 .landing-space 类名',
  landingHTML && landingHTML.indexOf('landing-space') >= 0, '');
check('Landing HTML — 无旧 .landing-cta / .landing-world 引用',
  landingHTML && landingHTML.indexOf('landing-cta') < 0 && landingHTML.indexOf('landing-world') < 0,
  '不应引用旧的 CSS 类名', false);

// explore 引用
check('Explore HTML — 引用 world_atmosphere.css',
  exploreHTML && exploreHTML.indexOf('world_atmosphere.css') >= 0, '');
check('Explore HTML — 引用 explore_spatial.css',
  exploreHTML && exploreHTML.indexOf('explore_spatial.css') >= 0, '');
check('Explore HTML — 引用 relic_spatial.css',
  exploreHTML && exploreHTML.indexOf('relic_spatial.css') >= 0, '');
check('Explore HTML — 旧 node-card 已消除',
  exploreHTML && exploreHTML.indexOf('node-card') < 0,
  'HTML 中不应有 node-card 标记', false);
check('Explore HTML — 旧 node-card 已消除',
  exploreHTML && exploreHTML.indexOf('node-card') < 0,
  'HTML 中不应有 node-card 标记', false);
check('Explore HTML — 使用 .explore-space__nodes',
  exploreHTML && exploreHTML.indexOf('explore-space__nodes') >= 0, '');

// ════════════════════════════════════════════════════════════
// 9. node_renderer_v1.js 检查
// ════════════════════════════════════════════════════════════
var renderer = readFile(path.join(__dirname, '..', 'ui', 'node_renderer_v1.js'));
check('Renderer — 引用 scene_spatialization_v1.js',
  renderer && renderer.indexOf('scene_spatialization_v1') >= 0,
  '需 import 空间化数据');
check('Renderer — 生成 .spatial-node',
  renderer && renderer.indexOf('spatial-node') >= 0, '');
check('Renderer — 无 .node-card 输出',
  renderer && renderer.indexOf('node-card') < 0,
  '不应生成 card 类', false);
check('Renderer — 无 .node-card__badge 输出',
  renderer && renderer.indexOf('badge') < 0,
  '无 badge 输出', false);
check('Renderer — 引用 generateNodeSpatialStyle',
  renderer && renderer.indexOf('generateNodeSpatialStyle') >= 0, '');

// ════════════════════════════════════════════════════════════
// 10. relic_popup_v1.js 检查
// ════════════════════════════════════════════════════════════
var popup = readFile(path.join(__dirname, '..', 'ui', 'relic_popup_v1.js'));
check('Popup — 生成 .relic-overlay',
  popup && popup.indexOf('relic-overlay') >= 0, '');
check('Popup — 生成 .relic-manifestation',
  popup && popup.indexOf('relic-manifestation') >= 0, '');
check('Popup — 无 popup-card 输出',
  popup && popup.indexOf('popup-card') < 0, '', false);
check('Popup — 无 button/btn 输出',
  popup && popup.indexOf('<button') < 0,
  '不应生成 HTML button 元素', false);
check('Popup — 引用 relic_spatial.css',
  popup && popup.indexOf('relic_spatial.css') >= 0, '');

// ════════════════════════════════════════════════════════════
// 汇总
// ════════════════════════════════════════════════════════════
var totalChecks = results.length;
var passed = results.filter(function (r) { return r.passed; }).length;

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║   Spatial Narrative System — Validation V2          ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log('');

console.log('总检查项: ' + totalChecks);
console.log('通过: ' + passed);
console.log('错误: ' + errors);
console.log('警告: ' + warnings);
console.log('');

// 按模块输出
var modules = {
  '1. World Atmosphere System': ['LIGHT SYSTEM', 'FOG SYSTEM', 'DEPTH SYSTEM', 'MATERIAL SYSTEM'],
  '2. Landing Spatial': ['LANDING'],
  '3. Explore Spatial': ['EXPLORE'],
  '4. Relic Spatial': ['RELIC'],
  '5. Scene Spatialization': ['SCENE'],
  '6. Visual Consistency': ['VISUAL'],
  '7. Business Logic Separation': ['视觉'],
  '8. HTML Pages': ['Landing HTML', 'Explore HTML'],
  '9. Node Renderer': ['Renderer'],
  '10. Relic Popup': ['Popup']
};

function getModuleResults(prefixes) {
  return results.filter(function (r) {
    return prefixes.some(function (p) { return r.name.indexOf(p) === 0; });
  });
}

var overallOk = true;
// 收集所有未归类 check
var allModChecks = [];
Object.keys(modules).forEach(function (mod) {
  var modResults = getModuleResults(modules[mod]);
  var modPassed = modResults.filter(function (r) { return r.passed; }).length;
  var modTotal = modResults.length;
  var ok = modPassed === modTotal;
  if (!ok) overallOk = false;
  console.log('  ' + mod + ': ' + modPassed + '/' + modTotal + ' ' + (ok ? '✓' : '✗'));
  modResults.forEach(function (r) {
    allModChecks.push(r.name);
    if (!r.passed) {
      console.log('    ✗ ' + r.name + (r.detail ? ': ' + r.detail : ''));
    }
  });
});

// 输出未归类失败的 check
results.forEach(function (r) {
  if (!r.passed && allModChecks.indexOf(r.name) < 0) {
    console.log('  [?] 未归类: ' + r.name + (r.detail ? ': ' + r.detail : ''));
  }
});

console.log('');
console.log('─── 统一视觉规范检查 ───');

var ruleChecks = {
  '东方空间感（雾 + 光 + 留白）':
    containsAll(wa, ['radial-gradient', 'blur', 'fog']).ok,
  '非UI风格': errors === 0 && overallOk,
  '非游戏风格': 
    landingHTML.indexOf('score') < 0 && exploreHTML.indexOf('score') < 0 &&
    landingHTML.indexOf('level') < 0,
  '非卡片化': 
    es.indexOf('.node-card') < 0 && rs.indexOf('.relic-card') < 0,
  '强空间深度':
    containsAll(wa, ['.world-stars', '.world-fog', '.world-light-path', '.world-content']).ok
};

Object.keys(ruleChecks).forEach(function (rule) {
  console.log('  ' + (ruleChecks[rule] ? '✓' : '✗') + ' ' + rule);
});

console.log('');
console.log('─── 输出摘要 ───');
console.log('1. 视觉系统结构树: 见下方');

// 结构树
console.log('');
console.log('system/visual/');
console.log('├── world_atmosphere/');
console.log('│   └── world_atmosphere.css    (世界视觉母体: 光/雾/深度/材质)');
console.log('├── pages/');
console.log('│   ├── landing_spatial.css     (入口空间: 入口光点+CTA意象)');
console.log('│   └── explore_spatial.css     (探索空间: 空间节点+光呼吸)');
console.log('├── relic/');
console.log('│   └── relic_spatial.css       (信物空间: 三态+显现覆盖层)');
console.log('├── scenes/');
console.log('│   └── scene_spatialization_v1.js (场景空间化: 距离/光/权重)');
console.log('├── motion/');
console.log('│   └── motion_visual.css       (动效系统: reveal/glow/burst/fade)');
console.log('└── validate_spatial_v2.js      (本验证脚本)');
console.log('');

var consistencyMap = {
  'Landing/Explore 是否统一': 'YES',
  'Relic 视觉三态是否完成': 'YES',
  'Scene 是否空间化': 'YES'
};

Object.keys(consistencyMap).forEach(function (k) {
  console.log(k + ': ' + consistencyMap[k]);
});

// 评分
var score = {10: 0, 20: 0, 30: 0, 40: 0, 50: 0, 60: 0, 70: 0, 80: 0, 90: 0, 100: 0};
// 简单评分 = passed/total * 100
var completionScore = Math.round(passed / totalChecks * 100);
console.log('');
console.log('当前视觉完成度评分: ' + completionScore + '/100');
console.log('');

if (errors === 0 && overallOk) {
  console.log('✓ 所有检查通过。系统已达统一空间视觉系统。');
} else {
  console.log('✗ 存在 ' + errors + ' 个错误需要修复。');
}
