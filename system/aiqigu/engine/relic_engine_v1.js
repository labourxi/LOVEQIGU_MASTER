/**
 * RELIC ENGINE V1 — 信物引擎（主编排器）
 *
 * 将场景节点（scene）转化为可交互信物系统的完整流程：
 *
 *   用户进入节点 → 触发信物生成 → 状态迁移 → 存档 → UI展示
 *
 * 编排流程：
 *   relic_engine_v1.js (orchestrator)
 *     ├── relic_generator_v1.js      (scene_id → relic instance)
 *     ├── relic_state_machine_v1.js  (LOCKED → ACTIVE → COLLECTED)
 *     └── relic_store_v1.js          (persistence layer)
 *
 * 数据来源：
 *   - /system/aiqigu/v1/relic_system_v1.json  (7枚信物定义)
 *   - /system/aiqigu/scene_map_v1.json         (7个真实场景)
 *   - /system/audit/aiqigu_reality_audit_v1.js (审计规则)
 *
 * 约束：
 *   - 禁止随机生成无场景来源信物
 *   - 禁止神话命名
 *   - 禁止跨节点共享信物
 *   - 每个 node 只能生成 1 个主信物
 */

import { generateRelicByScene, checkScenesForRelics, getPrerequisites, isValidScene } from './relic_generator_v1.js';
import { initRelicState, transitionRelicState, getRelicStates, getRelicState, canTransition, RELIC_STATE } from './relic_state_machine_v1.js';
import { saveCollectedRelic, getCollectedRelics, getCollectedRelic, isRelicCollected, isSceneCollected, getCollectionProgress } from './relic_store_v1.js';

// ─── 触发类型映射（scene_map → trigger_type） ───
// entry_trigger  = 首次进入场景自动触发
// proximity_trigger = 靠近场景范围内触发（GPS + 图像识别）
// interaction_trigger = 用户主动交互后触发（扫描/点击/停留）
const SCENE_TRIGGER_MAP = {
  entrance_plaza: 'entry_trigger',
  entrance_landscape: 'proximity_trigger',
  jiangnan_street: 'interaction_trigger',
  interior_cafe: 'interaction_trigger',
  interior_bookstore: 'interaction_trigger',
  interior_craft_hall: 'interaction_trigger',
  central_plaza: 'proximity_trigger'
};

// ─── 引擎控制状态 ───
let engineReady = false;
let engineLog = [];

/**
 * 初始化信物引擎。
 * 扫描所有合法场景节点，预初始化信物状态。
 *
 * @param {string} [userId] - 用户ID（预留）
 * @returns {{ success: boolean, relic_count: number, scenes: Array }}
 */
export function initEngine(userId) {
  engineLog = [];

  // 1. 获取所有可生成信物的场景
  const sceneList = checkScenesForRelics();

  // 2. 预初始化每个场景的信物状态为 LOCKED
  var initCount = 0;
  sceneList.forEach(function (scene) {
    if (scene.has_relic) {
      const result = generateRelicByScene(scene.scene_id, userId);
      if (result.success && result.relic) {
        initRelicState(result.relic.relic_id, scene.scene_id, userId);
        initCount++;
        engineLog.push('init: ' + scene.scene_id + ' -> ' + result.relic.relic_id + ' [LOCKED]');
      }
    }
  });

  engineReady = (initCount > 0);

  return {
    success: engineReady,
    relic_count: initCount,
    scenes: sceneList,
    userId: userId || null
  };
}

/**
 * 主入口：用户进入场景节点 → 触发信物生命周期。
 *
 * 流程：
 *   1. 验证场景是否合法
 *   2. 检查该场景是否已有信物被收集（唯一性）
 *   3. 检查前置条件是否满足
 *   4. 生成信物实例
 *   5. 迁移状态 LOCKED → ACTIVE
 *   6. 返回信物实例供UI渲染
 *
 * @param {string} sceneId - 场景节点ID
 * @param {string} [userId] - 用户ID（预留）
 * @returns {object} 触发结果
 */
export function enterScene(sceneId, userId) {
  const logEntry = { sceneId: sceneId, timestamp: Date.now(), steps: [] };

  // 1. 验证 scene_id
  if (!isValidScene(sceneId)) {
    logEntry.error = 'invalid_scene: ' + sceneId;
    engineLog.push(logEntry);
    return { success: false, error: 'invalid_scene_id', scene: sceneId };
  }
  logEntry.steps.push('scene_validated');

  // 2. 检查该场景是否已被收集
  if (isSceneCollected(sceneId)) {
    logEntry.error = 'already_collected';
    engineLog.push(logEntry);
    return { success: false, error: 'scene_already_collected', scene: sceneId };
  }
  logEntry.steps.push('collection_check_passed');

  // 3. 生成信物实例
  const genResult = generateRelicByScene(sceneId, userId);
  if (!genResult.success) {
    logEntry.error = genResult.error;
    engineLog.push(logEntry);
    return { success: false, error: genResult.error, scene: sceneId };
  }
  const relic = genResult.relic;
  logEntry.steps.push('relic_generated: ' + relic.relic_id);

  // 4. 检查前置条件
  const prerequisites = getPrerequisites(relic.relic_id);
  if (prerequisites.length > 0) {
    var missingPrereqs = [];
    prerequisites.forEach(function (prereqId) {
      if (!isRelicCollected(prereqId)) {
        missingPrereqs.push(prereqId);
      }
    });
    if (missingPrereqs.length > 0) {
      logEntry.error = 'missing_prerequisites: ' + missingPrereqs.join(', ');
      engineLog.push(logEntry);
      return {
        success: false,
        error: 'prerequisites_not_met',
        scene: sceneId,
        relic: relic,
        missing_prerequisites: missingPrereqs
      };
    }
  }
  logEntry.steps.push('prerequisites_checked');

  // 5. 迁移状态 LOCKED → ACTIVE
  const transitionResult = transitionRelicState(relic.relic_id, RELIC_STATE.ACTIVE);
  if (!transitionResult.success) {
    logEntry.error = transitionResult.error;
    engineLog.push(logEntry);
    return { success: false, error: transitionResult.error, scene: sceneId };
  }
  relic.state = 'ACTIVE';
  logEntry.steps.push('state_transition: LOCKED -> ACTIVE');

  engineLog.push(logEntry);

  return {
    success: true,
    scene: sceneId,
    relic: relic,
    trigger_type: SCENE_TRIGGER_MAP[sceneId] || null,
    visual_stages: relic.visual_stage
  };
}

/**
 * 用户完成收集 → 存档。
 *
 * 流程：
 *   1. 迁移状态 ACTIVE → COLLECTED
 *   2. 保存到持久化层
 *
 * @param {string} relicId
 * @returns {object}
 */
export function collectRelic(relicId) {
  // 1. 状态迁移
  const transitionResult = transitionRelicState(relicId, RELIC_STATE.COLLECTED);
  if (!transitionResult.success) {
    return { success: false, error: transitionResult.error };
  }

  // 2. 获取信物实例信息
  const stateInfo = getRelicState(relicId);
  if (!stateInfo) {
    return { success: false, error: 'relic_state_not_found: ' + relicId };
  }

  // 3. 构造存档条目
  const relicForStore = {
    relic_id: relicId,
    relic_name: null,
    source_node: stateInfo.node_id,
    trigger_condition: null,
    brand: null,
    interaction_type: null,
    visual_stage: 4,
    timestamp: Date.now(),
    user_id: null,
    state: 'COLLECTED'
  };

  // 尝试从 generator 获取完整定义补充字段
  const genResult = generateRelicByScene(stateInfo.node_id);
  if (genResult.success && genResult.relic) {
    relicForStore.relic_name = genResult.relic.relic_name;
    relicForStore.trigger_condition = genResult.relic.trigger_condition;
    relicForStore.brand = genResult.relic.brand;
    relicForStore.interaction_type = genResult.relic.interaction_type;
  }

  // 4. 保存
  const saveResult = saveCollectedRelic(relicForStore);
  if (!saveResult.success) {
    return { success: false, error: saveResult.error };
  }

  engineLog.push({ action: 'collected', relicId: relicId, timestamp: Date.now() });

  return {
    success: true,
    relic_id: relicId,
    collected: true
  };
}

/**
 * 获取用户的完整信物状态。
 *
 * @returns {object}
 */
export function getUserStatus() {
  const stateList = getRelicStates();
  const collectedList = getCollectedRelics();
  const progress = getCollectionProgress(7);

  return {
    states: stateList,
    collected: collectedList,
    progress: progress
  };
}

/**
 * 检查用户是否可以进入某个场景节点。
 *
 * @param {string} sceneId
 * @returns {object}
 */
export function canEnterScene(sceneId) {
  if (!isValidScene(sceneId)) {
    return { can_enter: false, reason: 'invalid_scene' };
  }

  if (isSceneCollected(sceneId)) {
    return { can_enter: false, reason: 'already_collected' };
  }

  const genResult = generateRelicByScene(sceneId);
  if (!genResult.success) {
    return { can_enter: false, reason: genResult.error };
  }

  const prerequisites = getPrerequisites(genResult.relic.relic_id);
  var missingPrereqs = [];
  prerequisites.forEach(function (prereqId) {
    if (!isRelicCollected(prereqId)) {
      missingPrereqs.push(prereqId);
    }
  });

  if (missingPrereqs.length > 0) {
    return {
      can_enter: false,
      reason: 'prerequisites_not_met',
      missing_prerequisites: missingPrereqs
    };
  }

  return { can_enter: true, reason: null };
}

/**
 * 获取引擎日志。
 * @returns {Array}
 */
export function getEngineLog() {
  return engineLog;
}

/**
 * 重置引擎（测试用途）。
 */
export function resetEngine() {
  engineReady = false;
  engineLog = [];
  const { resetAllStates } = require('./relic_state_machine_v1.js');
  const { clearStore } = require('./relic_store_v1.js');
  resetAllStates();
  clearStore();
}
