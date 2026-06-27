/**
 * RELIC GENERATOR V1 — 信物生成器
 *
 * 将场景节点（scene_id）转化为可交互信物实例。
 * 每个 scene.node_id 只能生成 1 个主信物（唯一性）。
 *
 * 数据来源：
 *   - /system/aiqigu/v1/relic_system_v1.json (7枚信物定义)
 *   - /system/aiqigu/scene_map_v1.json (场景节点)
 *
 * 约束：
 *   - 禁止随机生成无场景来源信物
 *   - 禁止跨节点共享信物
 *   - 禁止神话/星象/玄学命名
 *   - 所有信物必须绑定 trigger_type（entry_trigger / proximity_trigger / interaction_trigger）
 */

// ─── 信物定义注册表（内联自 relic_system_v1.json） ───
// 生产环境应从 /system/aiqigu/v1/relic_system_v1.json 加载
const RELIC_DEFINITIONS = Object.freeze({
  relic_entrance_greeting: {
    relic_id: 'relic_entrance_greeting',
    relic_name: '入口印记',
    scene_id: 'entrance_plaza',
    trigger_type: 'entry_trigger',
    interaction_type: 'entry',
    visual_stage_count: 4,
    max_collect_count: 1,
    prerequisite_ids: [],
    brand: '启程之印'
  },
  relic_garden_grove: {
    relic_id: 'relic_garden_grove',
    relic_name: '林荫印记',
    scene_id: 'entrance_landscape',
    trigger_type: 'proximity_trigger',
    interaction_type: 'explore',
    visual_stage_count: 4,
    max_collect_count: 1,
    prerequisite_ids: ['relic_entrance_greeting'],
    brand: '古树见证印'
  },
  relic_street_sign: {
    relic_id: 'relic_street_sign',
    relic_name: '老街印记',
    scene_id: 'jiangnan_street',
    trigger_type: 'interaction_trigger',
    interaction_type: 'explore',
    visual_stage_count: 4,
    max_collect_count: 1,
    prerequisite_ids: ['relic_garden_grove'],
    brand: '匠心印'
  },
  relic_cafe_seal: {
    relic_id: 'relic_cafe_seal',
    relic_name: '咖啡印记',
    scene_id: 'interior_cafe',
    trigger_type: 'interaction_trigger',
    interaction_type: 'reward',
    visual_stage_count: 4,
    max_collect_count: 1,
    prerequisite_ids: ['relic_street_sign'],
    brand: '咖啡馆印记'
  },
  relic_book_page: {
    relic_id: 'relic_book_page',
    relic_name: '书页印记',
    scene_id: 'interior_bookstore',
    trigger_type: 'interaction_trigger',
    interaction_type: 'explore',
    visual_stage_count: 4,
    max_collect_count: 1,
    prerequisite_ids: ['relic_cafe_seal'],
    brand: '书页印记'
  },
  relic_craft_seal: {
    relic_id: 'relic_craft_seal',
    relic_name: '手作印记',
    scene_id: 'interior_craft_hall',
    trigger_type: 'interaction_trigger',
    interaction_type: 'reward',
    visual_stage_count: 4,
    max_collect_count: 1,
    prerequisite_ids: ['relic_book_page'],
    brand: '手作印记'
  },
  relic_center_core: {
    relic_id: 'relic_center_core',
    relic_name: '中心印记',
    scene_id: 'central_plaza',
    trigger_type: 'proximity_trigger',
    interaction_type: 'narrative',
    visual_stage_count: 5,
    max_collect_count: 1,
    prerequisite_ids: [
      'relic_entrance_greeting',
      'relic_garden_grove',
      'relic_street_sign',
      'relic_cafe_seal',
      'relic_book_page',
      'relic_craft_seal'
    ],
    brand: '万象之印'
  }
});

// ─── scene_id → relic_id 索引 ───
const SCENE_TO_RELIC = Object.freeze({
  entrance_plaza: 'relic_entrance_greeting',
  entrance_landscape: 'relic_garden_grove',
  jiangnan_street: 'relic_street_sign',
  interior_cafe: 'relic_cafe_seal',
  interior_bookstore: 'relic_book_page',
  interior_craft_hall: 'relic_craft_seal',
  central_plaza: 'relic_center_core'
});

// ─── 场景清单（来自 scene_map_v1.json 中的7个交互节点） ───
const VALID_SCENE_IDS = Object.freeze([
  'entrance_plaza',
  'entrance_landscape',
  'jiangnan_street',
  'interior_cafe',
  'interior_bookstore',
  'interior_craft_hall',
  'central_plaza'
]);

/**
 * 根据 scene_id 生成信物实例。
 * 每个 scene_id 只能生成 1 个主信物。
 *
 * @param {string} sceneId - 场景节点ID
 * @param {string} [userId] - 用户ID（预留）
 * @returns {{ success: boolean, relic: object|null, error: string|null }}
 */
export function generateRelicByScene(sceneId, userId) {
  // 1. 验证 scene_id 是否合法
  if (!sceneId || VALID_SCENE_IDS.indexOf(sceneId) < 0) {
    return {
      success: false,
      relic: null,
      error: 'invalid_scene: ' + sceneId + ' (must be one of: ' + VALID_SCENE_IDS.join(', ') + ')'
    };
  }

  // 2. 查找 scene_id 对应的 relic_id
  const relicId = SCENE_TO_RELIC[sceneId];
  if (!relicId) {
    return {
      success: false,
      relic: null,
      error: 'no_relic_for_scene: ' + sceneId
    };
  }

  // 3. 获取信物定义
  const def = RELIC_DEFINITIONS[relicId];
  if (!def) {
    return {
      success: false,
      relic: null,
      error: 'relic_definition_not_found: ' + relicId
    };
  }

  // 4. 生成信物实例
  const relic = {
    relic_id: def.relic_id,
    relic_name: def.relic_name,
    source_node: def.scene_id,
    trigger_condition: def.trigger_type,
    visual_stage: 0,
    timestamp: Date.now(),
    user_id: userId || null,
    state: 'LOCKED',
    brand: def.brand,
    interaction_type: def.interaction_type
  };

  return { success: true, relic: relic, error: null };
}

/**
 * 批量检查场景节点是否可生成信物。
 *
 * @param {string[]} sceneIds - 场景节点ID数组
 * @returns {Array} 每个scene的可生成结果
 */
export function checkScenesForRelics(sceneIds) {
  if (!sceneIds || sceneIds.length === 0) {
    // 返回全部可生成的scene
    return VALID_SCENE_IDS.map(function (sid) {
      return {
        scene_id: sid,
        has_relic: true,
        relic_id: SCENE_TO_RELIC[sid],
        trigger_type: RELIC_DEFINITIONS[SCENE_TO_RELIC[sid]].trigger_type
      };
    });
  }

  return sceneIds.map(function (sid) {
    if (VALID_SCENE_IDS.indexOf(sid) < 0) {
      return { scene_id: sid, has_relic: false, relic_id: null, trigger_type: null };
    }
    return {
      scene_id: sid,
      has_relic: true,
      relic_id: SCENE_TO_RELIC[sid],
      trigger_type: RELIC_DEFINITIONS[SCENE_TO_RELIC[sid]].trigger_type
    };
  });
}

/**
 * 获取信物的前置条件列表。
 *
 * @param {string} relicId
 * @returns {string[]} 前置信物ID列表
 */
export function getPrerequisites(relicId) {
  const def = RELIC_DEFINITIONS[relicId];
  if (!def) return [];
  return def.prerequisite_ids;
}

/**
 * 根据 trigger_type 过滤可触发的信物。
 *
 * @param {string} triggerType - entry_trigger | proximity_trigger | interaction_trigger
 * @returns {Array} 匹配的信物定义列表
 */
export function getRelicsByTriggerType(triggerType) {
  const validTriggers = ['entry_trigger', 'proximity_trigger', 'interaction_trigger'];
  if (validTriggers.indexOf(triggerType) < 0) return [];

  const result = [];
  Object.keys(RELIC_DEFINITIONS).forEach(function (id) {
    const def = RELIC_DEFINITIONS[id];
    if (def.trigger_type === triggerType) {
      result.push(def);
    }
  });
  return result;
}

/**
 * 获取所有信物定义的摘要。
 * @returns {Array}
 */
export function getAllRelicDefinitions() {
  return Object.keys(RELIC_DEFINITIONS).map(function (id) {
    const def = RELIC_DEFINITIONS[id];
    return {
      relic_id: def.relic_id,
      relic_name: def.relic_name,
      scene_id: def.scene_id,
      trigger_type: def.trigger_type,
      has_prerequisites: def.prerequisite_ids.length > 0,
      prerequisite_count: def.prerequisite_ids.length
    };
  });
}

/**
 * 验证 scene_id 是否合法（来自 scene_map_v1.json 交互节点）。
 * @param {string} sceneId
 * @returns {boolean}
 */
export function isValidScene(sceneId) {
  return VALID_SCENE_IDS.indexOf(sceneId) >= 0;
}
