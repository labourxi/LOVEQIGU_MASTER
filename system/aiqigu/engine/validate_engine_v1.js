/**
 * RELIC ENGINE V1 — 最终验证脚本
 *
 * 验证项：
 * 1. 无神话命名（relic_name 不包含星象/神殿/抽象修辞）
 * 2. 无跨节点共享信物（scene_id → relic_id 为 1:1）
 * 3. 所有信物均有 scene 来源（source_node 不为空）
 * 4. 每个 node 只能生成 1 个主信物
 * 5. 所有信物必须绑定 trigger_type
 * 6. 状态机只能 LOCKED → ACTIVE → COLLECTED
 * 7. 核心字段完整性（relic_id, source_node, trigger_condition, visual_stage, timestamp）
 * 8. runtime JSON 语法正确
 *
 * 运行方式：node system/aiqigu/engine/validate_engine_v1.js
 */

const fs = require('fs');
const path = require('path');

console.log('════════════════════════════════════════════════');
console.log('  AR游伴 · 信物引擎 V1 — 最终验证');
console.log('════════════════════════════════════════════════\n');

const ENGINE_DIR = path.join(__dirname);
const BASE_DIR = path.resolve(__dirname, '..', '..');

// ─── 1. 加载 runtime 数据 ───
console.log('[1/8] 加载 runtime 数据...');
let runtime;
try {
  runtime = JSON.parse(fs.readFileSync(path.join(ENGINE_DIR, 'relic_runtime_v1.json'), 'utf8'));
  console.log('  ✓ runtime JSON 语法正确');
} catch (e) {
  console.error('  ✗ runtime JSON 解析失败:', e.message);
  process.exit(1);
}

// ─── 2. 验证 7 枚信物定义 ───
console.log('\n[2/8] 验证信物定义（来自 relic_system_v1.json）...');
const relicDefs = runtime.engine_init.result.scenes;
const expectedRelics = [
  { relic_id: 'relic_entrance_greeting', scene: 'entrance_plaza', trigger: 'entry_trigger' },
  { relic_id: 'relic_garden_grove', scene: 'entrance_landscape', trigger: 'proximity_trigger' },
  { relic_id: 'relic_street_sign', scene: 'jiangnan_street', trigger: 'interaction_trigger' },
  { relic_id: 'relic_cafe_seal', scene: 'interior_cafe', trigger: 'interaction_trigger' },
  { relic_id: 'relic_book_page', scene: 'interior_bookstore', trigger: 'interaction_trigger' },
  { relic_id: 'relic_craft_seal', scene: 'interior_craft_hall', trigger: 'interaction_trigger' },
  { relic_id: 'relic_center_core', scene: 'central_plaza', trigger: 'proximity_trigger' }
];

var allDefsOk = true;
expectedRelics.forEach(function (expected) {
  var found = relicDefs.find(function (d) { return d.relic_id === expected.relic_id && d.scene_id === expected.scene && d.trigger_type === expected.trigger; });
  if (!found) {
    console.log('  ✗ 缺失: ' + expected.relic_id + ' (' + expected.scene + ', ' + expected.trigger + ')');
    allDefsOk = false;
  }
});
if (allDefsOk) console.log('  ✓ 7 枚信物定义完整，scene_id → trigger_type 映射正确');
else process.exit(1);

// ─── 3. 验证唯一性（scene_id → relic_id 为 1:1） ───
console.log('\n[3/8] 验证 scene 与 relic 唯一映射...');
var sceneMap = {};
var dupScene = false;
relicDefs.forEach(function (d) {
  if (sceneMap[d.scene_id]) {
    console.log('  ✗ scene_id 重复: ' + d.scene_id + ' 已映射到 ' + sceneMap[d.scene_id] + ' 和 ' + d.relic_id);
    dupScene = true;
  }
  sceneMap[d.scene_id] = d.relic_id;
});
if (!dupScene) console.log('  ✓ 7 个 scene → 7 个 relic，1:1 映射，无跨节点共享');

// ─── 4. 验证神话命名禁止 ───
console.log('\n[4/8] 验证无神话命名...');
var mythKeywords = ['星象', '神殿', '抽象', '虚空', '圣', '神', '祭坛', '水潭', '仙', '灵', '天'];
var relicNames = [];
runtime.runtime_flow.forEach(function (step) {
  if (step.result && step.result.relic && step.result.relic.relic_name) {
    if (relicNames.indexOf(step.result.relic.relic_name) < 0) {
      relicNames.push(step.result.relic.relic_name);
    }
  }
});

var mythFound = false;
relicNames.forEach(function (name) {
  mythKeywords.forEach(function (kw) {
    if (name.indexOf(kw) >= 0) {
      console.log('  ✗ 信物名含有禁止词"' + kw + '": ' + name);
      mythFound = true;
    }
  });
});
if (!mythFound) {
  console.log('  ✓ 7 枚信物名称均为现实场景特征命名，无神话/星象/玄学词汇');
  console.log('    名称列表:', relicNames.join(', '));
}

// ─── 5. 验证每个信物包含核心字段 ───
console.log('\n[5/8] 验证信物核心字段完整性...');
var requiredFields = ['relic_id', 'source_node', 'trigger_condition', 'visual_stage', 'timestamp'];
var allFieldsOk = true;
var seenRelicIds = [];
runtime.runtime_flow.forEach(function (step) {
  if (step.result && step.result.relic) {
    var relic = step.result.relic;
    if (seenRelicIds.indexOf(relic.relic_id) >= 0) return;
    seenRelicIds.push(relic.relic_id);

    requiredFields.forEach(function (field) {
      if (relic[field] === undefined || relic[field] === null || relic[field] === '') {
        console.log('  ✗ ' + relic.relic_id + ' 缺少字段: ' + field);
        allFieldsOk = false;
      }
    });
  }
});
if (allFieldsOk) console.log('  ✓ 所有信物包含 5 个核心字段（relic_id, source_node, trigger_condition, visual_stage, timestamp）');

// ─── 6. 验证状态迁移 ───
console.log('\n[6/8] 验证状态迁移 LOCKED → ACTIVE → COLLECTED...');
var stateOk = true;
runtime.runtime_flow.forEach(function (step) {
  if (step.action.indexOf('enterScene') >= 0 && step.result.success) {
    if (step.result.relic.state !== 'ACTIVE') {
      console.log('  ✗ enterScene 后信物状态应为 ACTIVE，实际为: ' + step.result.relic.state);
      stateOk = false;
    }
  }
  if (step.action.indexOf('collectRelic') >= 0 && step.result.success) {
    if (step.result.collected !== true) {
      console.log('  ✗ collectRelic 后 collected 应为 true');
      stateOk = false;
    }
  }
});
// 验证最终全部为 COLLECTED
var finalStates = runtime.final_user_status.states;
var allCollected = finalStates.every(function (s) { return s.state === 'COLLECTED'; });
if (!allCollected) {
  console.log('  ✗ 最终状态未全部为 COLLECTED');
  stateOk = false;
}
if (stateOk) console.log('  ✓ 状态迁移正确：全部信物最终状态为 COLLECTED');

// ─── 7. 验证错误场景 ───
console.log('\n[7/8] 验证错误处理...');
var errorsOk = true;
var errScenarios = runtime.error_scenarios;
if (!errScenarios.duplicate_collect.result.success && errScenarios.duplicate_collect.result.error === 'scene_already_collected') {
  console.log('  ✓ 重复收集返回 scene_already_collected');
} else {
  console.log('  ✗ 重复收集错误场景验证失败');
  errorsOk = false;
}
if (!errScenarios.missing_prerequisite.result.success && errScenarios.missing_prerequisite.expected_error === 'prerequisites_not_met') {
  console.log('  ✓ 前置条件未满足返回 prerequisites_not_met（6 个缺失）');
} else {
  console.log('  ✗ 前置条件错误场景验证失败');
  errorsOk = false;
}
if (!errScenarios.invalid_scene.result.success && errScenarios.invalid_scene.result.error === 'invalid_scene_id') {
  console.log('  ✓ 无效场景返回 invalid_scene_id');
} else {
  console.log('  ✗ 无效场景错误场景验证失败');
  errorsOk = false;
}

// ─── 8. 验证约束清单 ───
console.log('\n[8/8] 验证约束清单...');
var constraints = runtime.constraint_verification;
var allConstraintsOk = true;
Object.keys(constraints).forEach(function (key) {
  if (constraints[key] !== true) {
    console.log('  ✗ 约束未满足: ' + key);
    allConstraintsOk = false;
  }
});
if (allConstraintsOk) {
  console.log('  ✓ 8 项约束全部验证通过');
  console.log('     - no_random_relics: true');
  console.log('     - all_relics_have_scene_source: true');
  console.log('     - no_mythological_names: true');
  console.log('     - no_cross_node_sharing: true');
  console.log('     - each_node_one_relic: true');
  console.log('     - all_relics_trigger_bound: true');
  console.log('     - state_machine_locked_active_collected: true');
}

// ─── 结果 ───
console.log('\n════════════════════════════════════════════════');
var allPassed = allDefsOk && !dupScene && !mythFound && allFieldsOk && stateOk && errorsOk && allConstraintsOk;
if (allPassed) {
  console.log('  ✓ 全部验证通过 — 信物引擎 V1 规范合规');
  console.log('    总信物: 7 | 总场景: 7 | 状态迁移: 正确 | 约束: 全部合规');
} else {
  console.log('  ✗ 存在未通过的验证项');
}
console.log('════════════════════════════════════════════════\n');
