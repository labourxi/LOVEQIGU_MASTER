/**
 * CLICK ROUTER V1 — 点击路由系统
 *
 * 前端点击交互系统的中枢。
 * 负责将 UI 的 node_id 点击事件转发给 relic_engine_v1，
 * 不生成信物、不管理状态、不调用 bootstrap。
 *
 * 数据流：
 *   UI Click (node_id)
 *     → click_router_v1.handleNodeClick(node_id)
 *       → relic_engine_v1.enterScene(sceneId)
 *         → relic_engine_v1 内部调用 generator / state_machine / store
 *       → 返回结果 → 转发给 relic_popup_v1 或 node_renderer_v1
 *
 * 约束：
 *   ❌ UI不能生成信物
 *   ❌ UI不能管理state
 *   ❌ UI不能调用bootstrap
 *   ❌ UI不能绕过relic_engine
 *
 * 依赖：
 *   - /system/aiqigu/engine/relic_engine_v1.js
 *   - /system/ui/relic_popup_v1.js
 *   - /system/aiqigu/scene_map_v1.json
 */

import { enterScene, collectRelic, canEnterScene, getUserStatus, initEngine } from '../aiqigu/engine/relic_engine_v1.js';
import { showRelic, showError, showCollectConfirm } from './relic_popup_v1.js';

// ─── Scene Map 索引（内置自 scene_map_v1.json） ───
// UI 层只读引用，用于 node_id → scene_id 查找，不用于生成信物
const SCENE_MAP_INDEX = Object.freeze({
  entrance_plaza: {
    scene_id: 'entrance_plaza',
    scene_name: '入口广场',
    scene_type: '广场',
    is_interaction_node: true,
    recommended_relic_type: '视觉信物（启程之印）'
  },
  central_plaza: {
    scene_id: 'central_plaza',
    scene_name: '中心广场',
    scene_type: '广场',
    is_interaction_node: true,
    recommended_relic_type: '叙事信物（万象之印）'
  },
  jiangnan_street: {
    scene_id: 'jiangnan_street',
    scene_name: '江南老街',
    scene_type: '街区',
    is_interaction_node: true,
    recommended_relic_type: '行为信物（匠心印）'
  },
  entrance_landscape: {
    scene_id: 'entrance_landscape',
    scene_name: '入口景观（古树）',
    scene_type: '景观',
    is_interaction_node: true,
    recommended_relic_type: '视觉信物（古树见证印）'
  },
  interior_cafe: {
    scene_id: 'interior_cafe',
    scene_name: '爱企谷咖啡',
    scene_type: '室内商业',
    is_interaction_node: true,
    recommended_relic_type: '行为信物（咖啡馆印记）'
  },
  interior_bookstore: {
    scene_id: 'interior_bookstore',
    scene_name: '爱企谷书店',
    scene_type: '室内商业',
    is_interaction_node: true,
    recommended_relic_type: '行为信物（书页印记）'
  },
  interior_craft_hall: {
    scene_id: 'interior_craft_hall',
    scene_name: '爱企谷手作馆',
    scene_type: '室内商业',
    is_interaction_node: true,
    recommended_relic_type: '叙事信物（手作印记）'
  }
});

// ─── UI 状态缓存（只读反射，引擎是唯一真实来源） ───
// 每次点击后刷新，绝不在 UI 层持久化
let cachedStatus = null;

/**
 * 初始化点击路由系统。
 * 内部调用引擎的 initEngine()，确保引擎已在运行。
 *
 * @param {string} [userId]
 * @returns {{ success: boolean, scene_count: number }}
 */
export function initClickRouter(userId) {
  const engineResult = initEngine(userId);
  if (engineResult.success) {
    cachedStatus = getUserStatus();
  }
  return {
    success: engineResult.success,
    scene_count: engineResult.relic_count
  };
}

/**
 * 核心方法：处理用户对场景节点的点击。
 *
 * 流程：
 *   1. 通过 node_id 查询 scene_map 索引
 *   2. 调用 canEnterScene() 预检
 *   3. 若可进入，调用 enterScene() 触发信物
 *   4. 若成功，触发 relic_popup_v1 展示
 *   5. 刷新 UI 状态缓存
 *
 * @param {string} nodeId - 场景节点 ID
 * @returns {Promise<object>} 交互结果
 */
export async function handleNodeClick(nodeId) {
  // 1. 查找场景信息
  const sceneInfo = SCENE_MAP_INDEX[nodeId];
  if (!sceneInfo) {
    showError({
      title: '未知场景',
      message: '该场景节点不存在或已被移除'
    });
    return { success: false, error: 'unknown_node', node_id: nodeId };
  }

  if (!sceneInfo.is_interaction_node) {
    showError({
      title: '非交互节点',
      message: '"' + sceneInfo.scene_name + '" 不可进行信物交互'
    });
    return { success: false, error: 'non_interaction_node', node_id: nodeId, scene_name: sceneInfo.scene_name };
  }

  // 2. 预检
  const preCheck = canEnterScene(nodeId);
  if (!preCheck.can_enter) {
    if (preCheck.reason === 'already_collected') {
      showRelic({
        relic_name: sceneInfo.recommended_relic_type,
        visual_stage: 4,
        state: 'COLLECTED',
        source_node: sceneInfo.scene_name,
        message: '该场景的信物已收集'
      });
    } else if (preCheck.reason === 'prerequisites_not_met') {
      showError({
        title: '前置条件未满足',
        message: '请先完成前置场景的探索'
      });
    } else {
      showError({
        title: '无法进入',
        message: preCheck.reason
      });
    }
    cachedStatus = getUserStatus();
    return { success: false, error: preCheck.reason, node_id: nodeId };
  }

  // 3. 调用引擎 — 这是信物生命的唯一入口
  const result = enterScene(nodeId);
  if (!result.success) {
    showError({
      title: '信物触发失败',
      message: result.error || '引擎返回错误'
    });
    cachedStatus = getUserStatus();
    return { success: false, error: result.error, node_id: nodeId };
  }

  // 4. 展示信物弹窗（引擎已处理 LOCKED → ACTIVE）
  const relic = result.relic;
  showRelic({
    relic_id: relic.relic_id,
    relic_name: relic.relic_name,
    source_node: relic.source_node,
    brand: relic.brand,
    state: relic.state,
    visual_stage: relic.visual_stage || 0,
    trigger_condition: relic.trigger_condition,
    interaction_type: relic.interaction_type,
    animation: 'reveal'
  });

  // 5. 刷新状态缓存
  cachedStatus = getUserStatus();

  return {
    success: true,
    node_id: nodeId,
    scene_name: sceneInfo.scene_name,
    relic: relic
  };
}

/**
 * 用户确认收集信物。
 * 仅调用引擎的 collectRelic()，不自行修改状态。
 *
 * @param {string} relicId
 * @returns {Promise<object>}
 */
export async function handleCollectRelic(relicId) {
  const result = collectRelic(relicId);
  if (result.success) {
    showCollectConfirm(relicId);
    cachedStatus = getUserStatus();
    return { success: true, relic_id: relicId };
  }

  showError({
    title: '收集失败',
    message: result.error || '未知错误'
  });
  return { success: false, error: result.error, relic_id: relicId };
}

/**
 * 获取当前节点状态（纯查询，不修改任何数据）。
 *
 * @param {string} nodeId
 * @returns {{ state: string|null, scene_name: string|null }}
 */
export function getNodeStatus(nodeId) {
  const sceneInfo = SCENE_MAP_INDEX[nodeId];
  if (!sceneInfo) return { state: null, scene_name: null };

  cachedStatus = cachedStatus || getUserStatus();

  // 从引擎状态中查找该节点对应的 relic 状态
  var nodeState = 'LOCKED';
  if (cachedStatus && cachedStatus.states) {
    cachedStatus.states.forEach(function (s) {
      if (s.node_id === nodeId) {
        nodeState = s.state;
      }
    });
  }

  return { state: nodeState, scene_name: sceneInfo.scene_name };
}

/**
 * 获取所有节点的状态列表（供 node_renderer 批量渲染用）。
 *
 * @returns {Array} [{ node_id, scene_name, state, scene_type }]
 */
export function getAllNodeStatuses() {
  cachedStatus = cachedStatus || getUserStatus();

  var result = [];
  Object.keys(SCENE_MAP_INDEX).forEach(function (nodeId) {
    var info = SCENE_MAP_INDEX[nodeId];
    var nodeState = 'LOCKED';

    if (cachedStatus && cachedStatus.states) {
      cachedStatus.states.forEach(function (s) {
        if (s.node_id === nodeId) {
          nodeState = s.state;
        }
      });
    }

    result.push({
      node_id: nodeId,
      scene_name: info.scene_name,
      scene_type: info.scene_type,
      state: nodeState,
      is_interaction_node: info.is_interaction_node
    });
  });

  return result;
}

/**
 * 获取用户进度（代理引擎，纯查询）。
 * @returns {object}
 */
export function getProgress() {
  cachedStatus = cachedStatus || getUserStatus();
  if (!cachedStatus) return { collected: 0, total: 7, percentage: 0 };
  return cachedStatus.progress || { collected: 0, total: 7, percentage: 0 };
}
