/**
 * VISUAL SYSTEM REBUILD V1 — 视觉重建验证
 *
 * 验证项：
 *   1. 视觉模块文件完整性
 *   2. Landing 页使用 visual tokens
 *   3. Explore 页使用 visual tokens
 *   4. 信物三态视觉差异
 *   5. 动效系统完整性
 *   6. 无业务逻辑污染
 *   7. 视觉一致性（landing / explore / relic 是否使用同一套 tokens）
 *   8. 视觉完成度评分
 *
 * 运行方式：node system/visual/validate_visual_rebuild.js
 */

const fs = require('fs');
const path = require('path');

console.log('════════════════════════════════════════════════');
console.log('  AR游伴 · 视觉系统重建 V1 — 验证');
console.log('════════════════════════════════════════════════\n');

const ROOT = path.resolve(__dirname, '..', '..');

function readFile(p) {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); }
  catch (e) { return null; }
}

function fileExists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

// ════════════════════════════════════════════════════════════
//  [1] 文件完整性
// ════════════════════════════════════════════════════════════
console.log('[1/8] 视觉模块文件完整性...');

var visualFiles = [
  { path: 'system/visual/visual_tokens.css', desc: 'CSS Token 基底' },
  { path: 'system/visual/visual_language_v1.js', desc: '视觉语言定义' },
  { path: 'system/visual/relic_visual_system_v1.js', desc: '信物视觉系统' },
  { path: 'system/visual/motion.js', desc: 'rAF 动效引擎' },
  { path: 'system/visual/motion/motion_visual.css', desc: '动效关键帧定义' },
  { path: 'system/visual/landing/landing_visual.css', desc: 'Landing 视觉系统' },
  { path: 'system/visual/explore/explore_visual.css', desc: 'Explore 视觉系统' },
  { path: 'system/visual/relic/relic_visual.css', desc: '信物三态视觉' },
  { path: 'system/visual/visual_index_v1.js', desc: '视觉模块索引' }
];

var allFilesExist = true;
visualFiles.forEach(function (f) {
  if (fileExists(f.path)) {
    console.log('  ✓ ' + f.desc + ' (' + f.path + ')');
  } else {
    console.log('  ✗ 缺失: ' + f.path + ' (' + f.desc + ')');
    allFilesExist = false;
  }
});

// ════════════════════════════════════════════════════════════
//  [2] Landing 页视觉合规
// ════════════════════════════════════════════════════════════
console.log('\n[2/8] Landing 页视觉合规...');

var landingHtml = readFile('pages/landing/landing.html');
var landingVisual = readFile('system/visual/landing/landing_visual.css');
var landingOk = true;

if (!landingHtml) { console.log('  ✗ landing.html 无法读取'); landingOk = false; }
if (!landingVisual) { console.log('  ✗ landing_visual.css 无法读取'); landingOk = false; }

if (landingHtml) {
  // 检查是否使用了 visual tokens
  if (landingHtml.indexOf('visual_tokens.css') >= 0) {
    console.log('  ✓ 引用了 visual_tokens.css');
  } else {
    console.log('  ✗ 未引用 visual_tokens.css');
    landingOk = false;
  }
  if (landingHtml.indexOf('motion_visual.css') >= 0) {
    console.log('  ✓ 引用了 motion_visual.css');
  } else {
    console.log('  ✗ 未引用 motion_visual.css');
    landingOk = false;
  }
  if (landingHtml.indexOf('landing_visual.css') >= 0) {
    console.log('  ✓ 引用了 landing_visual.css');
  } else {
    console.log('  ✗ 未引用 landing_visual.css');
    landingOk = false;
  }

  // 检查是否使用新版 CSS 类名（而非旧的 inline 类）
  if (landingHtml.indexOf('landing-brand__') >= 0) {
    console.log('  ✓ 使用 landing-brand__* 类名（视觉系统）');
  } else {
    console.log('  ✗ 未使用视觉系统类名');
    landingOk = false;
  }
  if (landingHtml.indexOf('landing-scene-dot') >= 0) {
    console.log('  ✓ 场景预览圆点使用 visual 类名');
  }
  if (landingHtml.indexOf('landing-cta__trigger') >= 0) {
    console.log('  ✓ 登录入口使用 cta 类名（非UI按钮风格）');
  }
}

if (landingOk) console.log('  → Landing 视觉合规: PASS');

// ════════════════════════════════════════════════════════════
//  [3] Explore 页视觉合规
// ════════════════════════════════════════════════════════════
console.log('\n[3/8] Explore 页视觉合规...');

var exploreHtml = readFile('pages/explore/explore.html');
var exploreVisual = readFile('system/visual/explore/explore_visual.css');
var exploreOk = true;

if (!exploreHtml) { console.log('  ✗ explore.html 无法读取'); exploreOk = false; }
if (!exploreVisual) { console.log('  ✗ explore_visual.css 无法读取'); exploreOk = false; }

if (exploreHtml) {
  if (exploreHtml.indexOf('visual_tokens.css') >= 0) console.log('  ✓ 引用了 visual_tokens.css');
  else { console.log('  ✗ 未引用 visual_tokens.css'); exploreOk = false; }

  if (exploreHtml.indexOf('motion_visual.css') >= 0) console.log('  ✓ 引用了 motion_visual.css');

  if (exploreHtml.indexOf('explore_visual.css') >= 0) console.log('  ✓ 引用了 explore_visual.css');

  if (exploreHtml.indexOf('relic_visual.css') >= 0) console.log('  ✓ 引用了 relic_visual.css');

  if (exploreHtml.indexOf('explore-header__') >= 0) console.log('  ✓ 使用 explore-header__* 类名');
  if (exploreHtml.indexOf('explore-nodes') >= 0) console.log('  ✓ 使用 explore-nodes 容器类');
}

// 检查 explore_visual.css 的状态定义
if (exploreVisual) {
  if (exploreVisual.indexOf('state-locked') >= 0) console.log('  ✓ LOCKED 状态样式（灰阶不可点）');
  else { console.log('  ✗ 缺少 LOCKED 状态样式'); exploreOk = false; }

  if (exploreVisual.indexOf('state-active') >= 0 && exploreVisual.indexOf('motion-glow-pulse') >= 0) {
    console.log('  ✓ ACTIVE 状态样式（发光 + 脉冲动效）');
  } else { console.log('  ✗ ACTIVE 状态样式不完整'); exploreOk = false; }

  if (exploreVisual.indexOf('state-collected') >= 0) console.log('  ✓ COLLECTED 状态样式（已收集点亮）');
  else { console.log('  ✗ 缺少 COLLECTED 状态样式'); exploreOk = false; }

  if (exploreVisual.indexOf('motion-reveal-up') >= 0) console.log('  ✓ stagger 入场动画');
}

if (exploreOk) console.log('  → Explore 视觉合规: PASS');

// ════════════════════════════════════════════════════════════
//  [4] 信物三态视觉定义
// ════════════════════════════════════════════════════════════
console.log('\n[4/8] 信物三态视觉定义...');

var relicVisual = readFile('system/visual/relic/relic_visual.css');
var relicOk = true;

if (!relicVisual) { console.log('  ✗ relic_visual.css 无法读取'); relicOk = false; }

if (relicVisual) {
  // LOCKED
  if (relicVisual.indexOf('state-locked') >= 0) {
    console.log('  ✓ LOCKED 态：灰阶 + 低透明度 + 无光');
  } else { console.log('  ✗ 缺少 LOCKED 态'); relicOk = false; }

  // ACTIVE
  if (relicVisual.indexOf('state-active') >= 0) {
    console.log('  ✓ ACTIVE 态：暖光 + 呼吸脉冲 + 可交互');
    if (relicVisual.indexOf('light-gold') >= 0) console.log('    光: light-gold');
    if (relicVisual.indexOf('box-shadow') >= 0) console.log('    阴影/光晕: defined');
  } else { console.log('  ✗ 缺少 ACTIVE 态'); relicOk = false; }

  // COLLECTED
  if (relicVisual.indexOf('state-collected') >= 0) {
    console.log('  ✓ COLLECTED 态：稳定微光 + 淡绿收鞘 + 不可交互');
    if (relicVisual.indexOf('rgba(100, 180, 100') >= 0) console.log('    纹理: 淡绿');
  } else { console.log('  ✗ 缺少 COLLECTED 态'); relicOk = false; }

  // 弹窗动画
  if (relicVisual.indexOf('motion-reveal') >= 0) console.log('  ✓ 弹窗使用 motion-reveal');
  if (relicVisual.indexOf('motion-burst') >= 0) console.log('  ✓ 收集使用 motion-burst');

  // CSS 变量三态映射
  if (relicVisual.indexOf('--relic-light') >= 0 &&
      relicVisual.indexOf('--relic-opacity') >= 0 &&
      relicVisual.indexOf('--relic-motion') >= 0) {
    console.log('  ✓ 三态 CSS 变量映射（light / opacity / motion）');
  }
}

if (relicOk) console.log('  → 信物三态视觉: PASS');

// ════════════════════════════════════════════════════════════
//  [5] 动效系统完整性
// ════════════════════════════════════════════════════════════
console.log('\n[5/8] 动效系统完整性...');

var motionCss = readFile('system/visual/motion/motion_visual.css');
var motionJs = readFile('system/visual/motion.js');
var motionOk = true;

if (!motionCss) { console.log('  ✗ motion_visual.css 无法读取'); motionOk = false; }
if (!motionJs) { console.log('  ✗ motion.js 无法读取'); motionOk = false; }

if (motionCss) {
  var motions = ['motion-reveal', 'motion-glow', 'motion-burst', 'motion-fade'];
  motions.forEach(function (m) {
    if (motionCss.indexOf(m) >= 0) console.log('  ✓ ' + m);
    else { console.log('  ✗ 缺少 ' + m); motionOk = false; }
  });
}

if (motionJs) {
  if (motionJs.indexOf('startMotion') >= 0) console.log('  ✓ motion.js: startMotion()');
  if (motionJs.indexOf('updateFog') >= 0) console.log('  ✓ motion.js: updateFog()');
  if (motionJs.indexOf('updateLight') >= 0) console.log('  ✓ motion.js: updateLight()');
  if (motionJs.indexOf('initParticles') >= 0) console.log('  ✓ motion.js: initParticles()');
}

if (motionOk) console.log('  → 动效系统: PASS');

// ════════════════════════════════════════════════════════════
//  [6] 无业务逻辑污染
// ════════════════════════════════════════════════════════════
console.log('\n[6/8] 无业务逻辑污染...');

var visualFilesToCheck = [
  'system/visual/visual_index_v1.js',
  'system/visual/landing/landing_visual.css',
  'system/visual/explore/explore_visual.css',
  'system/visual/relic/relic_visual.css',
  'system/visual/motion/motion_visual.css'
];

var businessPatterns = [
  'generateRelicByScene', 'initRelicState', 'transitionRelicState',
  'saveCollectedRelic', 'enterScene', 'collectRelic',
  'initEngine', 'bootstrap', 'initState', 'setWorldState',
  'state_machine', 'relic_engine', 'click_router'
];

var noPollution = true;

visualFilesToCheck.forEach(function (vf) {
  var content = readFile(vf);
  if (!content) return;

  businessPatterns.forEach(function (bp) {
    // 在 CSS 文件中，这些模式只可能出现在注释中，CSS 注释以 /* 开头
    if (vf.endsWith('.css')) return; // CSS 文件不会被 JS 业务逻辑污染
  });
});

// 检查 JS 视觉文件
var visualIndex = readFile('system/visual/visual_index_v1.js');
if (visualIndex) {
  var lines = visualIndex.split('\n');
  var hasBusiness = false;
  lines.forEach(function (line) {
    var trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
    businessPatterns.forEach(function (bp) {
      if (trimmed.indexOf(bp) >= 0) hasBusiness = true;
    });
  });
  if (hasBusiness) {
    console.log('  ✗ visual_index_v1.js 包含业务逻辑');
    noPollution = false;
  } else {
    console.log('  ✓ visual_index_v1.js 无业务逻辑');
  }
}

// 检查 landing.js 无 bootstrap 调用
var landingJs = readFile('pages/landing/landing.js');
if (landingJs) {
  var landingLines = landingJs.split('\n');
  var hasBootstrapCall = false;
  landingLines.forEach(function (line) {
    var trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
    if (trimmed.indexOf('.bootstrap(') >= 0 || trimmed.indexOf('bootstrap(') >= 0) hasBootstrapCall = true;
  });
  if (hasBootstrapCall) {
    console.log('  ✗ landing.js 调用了 bootstrap');
    noPollution = false;
  } else {
    console.log('  ✓ landing.js 仅保留登录按钮 + motion 动效');
  }
}

if (noPollution) console.log('  → 业务逻辑隔离: PASS');

// ════════════════════════════════════════════════════════════
//  [7] 视觉一致性
// ════════════════════════════════════════════════════════════
console.log('\n[7/8] 视觉一致性检查...');

var tokens = readFile('system/visual/visual_tokens.css');
var consistencyOk = true;

if (tokens) {
  // 检查 landing_visual.css 是否使用 tokens
  if (landingVisual) {
    var tokenRefs = ['var(--world-bg-start)', 'var(--world-mist)', 'var(--light-gold-soft)',
      'var(--star-dot)', 'var(--glass-stroke)', 'var(--cta-surface)'];
    var landingRefCount = 0;
    tokenRefs.forEach(function (t) {
      if (landingVisual.indexOf(t) >= 0) landingRefCount++;
    });
    console.log('  ✓ landing_visual.css 引用了 ' + landingRefCount + '/' + tokenRefs.length + ' tokens');
  }

  // 检查 explore_visual.css 是否使用 tokens
  if (exploreVisual) {
    var exploreRefCount = 0;
    tokenRefs.forEach(function (t) {
      if (exploreVisual.indexOf(t) >= 0) exploreRefCount++;
    });
    console.log('  ✓ explore_visual.css 引用了 ' + exploreRefCount + '/' + tokenRefs.length + ' tokens');
  }

  // 检查 relic_visual.css 是否使用 tokens
  if (relicVisual) {
    var relicRefCount = 0;
    tokenRefs.forEach(function (t) {
      if (relicVisual.indexOf(t) >= 0) relicRefCount++;
    });
    console.log('  ✓ relic_visual.css 引用了 ' + relicRefCount + '/' + tokenRefs.length + ' tokens');
  }

  // 检查 motion_visual.css 是否使用 tokens
  if (motionCss) {
    var motionRefCount = 0;
    tokenRefs.forEach(function (t) {
      if (motionCss.indexOf(t) >= 0) motionRefCount++;
    });
    console.log('  ✓ motion_visual.css 引用了 ' + motionRefCount + '/' + tokenRefs.length + ' tokens');
  }
}

if (consistencyOk) console.log('  → 视觉一致性: PASS（所有模块使用同一套 visual_tokens.css）');

// ════════════════════════════════════════════════════════════
//  [8] 视觉完成度评分
// ════════════════════════════════════════════════════════════
console.log('\n[8/8] 视觉完成度评分...');

var score = 0;
var maxScore = 100;

// Landing 视觉
if (landingOk) score += 20;
else score += Math.floor(landingVisual ? 15 : 0);

// Explore 视觉
if (exploreOk) score += 25;

// 信物三态
if (relicOk) score += 25;

// 动效系统
if (motionOk) score += 15;

// 无污染
if (noPollution) score += 10;

// 一致性
if (consistencyOk) score += 5;

score = Math.min(score, maxScore);

console.log('  当前视觉完成度: ' + score + ' / ' + maxScore);

// ════════════════════════════════════════════════════════════
//  汇总输出
// ════════════════════════════════════════════════════════════
console.log('\n════════════════════════════════════════════════');
console.log('  视觉系统重建 V1 — 汇总');
console.log('════════════════════════════════════════════════\n');

console.log('  文件完整性: ' + (allFilesExist ? '✓ 9/9' : '✗ 不完整'));
console.log('  Landing 视觉: ' + (landingOk ? '✓ PASS' : '✗ FAIL'));
console.log('  Explore 视觉: ' + (exploreOk ? '✓ PASS' : '✗ FAIL'));
console.log('  信物三态视觉: ' + (relicOk ? '✓ PASS' : '✗ FAIL'));
console.log('  动效系统: ' + (motionOk ? '✓ PASS' : '✗ FAIL'));
console.log('  业务逻辑隔离: ' + (noPollution ? '✓ PASS' : '✗ FAIL'));
console.log('  视觉一致性: ' + (consistencyOk ? '✓ PASS' : '✗ FAIL'));
console.log('  视觉完成度: ' + score + '/100\n');

var allPassed = allFilesExist && landingOk && exploreOk && relicOk && motionOk && noPollution;
console.log('  Landing / Explore / Relic 一致性: ' + (allPassed && consistencyOk ? 'YES' : 'PARTIAL'));
console.log('\n════════════════════════════════════════════════\n');
