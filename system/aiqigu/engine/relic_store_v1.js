/**
 * RELIC STORE V1 — 信物存档 / 持久化层
 *
 * 管理用户已收集信物的存档操作。
 * 使用 sessionStorage 作为临时存储（适配小程序环境），
 * 预留 server_sync 接口用于后续服务器同步。
 *
 * 数据来源：
 *   - /system/aiqigu/v1/relic_system_v1.json (信物定义)
 *   - /system/aiqigu/engine/relic_state_machine_v1.js (信物状态)
 *
 * 约束：
 *   - 每个 node 只能存储 1 个主信物（唯一性）
 *   - 禁止跨节点共享信物
 *   - 所有信物必须有 scene_id 来源
 */

const STORAGE_KEY = 'aiqigu_relic_store_v1';

// ─── 内存缓存 ───
let storeCache = null;

/**
 * 加载存档（从 sessionStorage 或空初始化）。
 * @returns {object}
 */
function loadStore() {
  if (storeCache) return storeCache;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      storeCache = JSON.parse(raw);
      return storeCache;
    }
  } catch (e) {
    // sessionStorage 不可用，忽略
  }

  storeCache = { relics: {}, collected_ids: [], collected_count: 0 };
  return storeCache;
}

/**
 * 持久化存档到 sessionStorage。
 */
function persistStore() {
  if (!storeCache) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storeCache));
  } catch (e) {
    // storage 不可用，忽略
  }
}

/**
 * 保存已收集的信物。
 *
 * @param {object} relic - 信物实例（由 relic_generator_v1 生成）
 * @returns {{ success: boolean, error: string|null }}
 */
export function saveCollectedRelic(relic) {
  if (!relic || !relic.relic_id) {
    return { success: false, error: 'invalid_relic: missing relic_id' };
  }

  const store = loadStore();

  // 唯一性检查：是否重复收集
  if (store.collected_ids.indexOf(relic.relic_id) >= 0) {
    return { success: false, error: 'duplicate_relic: ' + relic.relic_id + ' already collected' };
  }

  // 检查 source_node 是否合法
  if (!relic.source_node) {
    return { success: false, error: 'invalid_relic: missing source_node' };
  }

  // 该 node 是否已有其他信物
  var existingForNode = null;
  Object.keys(store.relics).forEach(function (id) {
    if (store.relics[id].source_node === relic.source_node) {
      existingForNode = id;
    }
  });
  if (existingForNode) {
    return {
      success: false,
      error: 'node_occupied: ' + relic.source_node + ' already has relic ' + existingForNode
    };
  }

  // 保存
  const entry = {
    relic_id: relic.relic_id,
    relic_name: relic.relic_name,
    source_node: relic.source_node,
    trigger_condition: relic.trigger_condition,
    brand: relic.brand,
    interaction_type: relic.interaction_type,
    visual_stage: typeof relic.visual_stage === 'number' ? relic.visual_stage : 0,
    timestamp: relic.timestamp || Date.now(),
    user_id: relic.user_id || null,
    state: 'COLLECTED'
  };

  store.relics[relic.relic_id] = entry;
  store.collected_ids.push(relic.relic_id);
  store.collected_count = store.collected_ids.length;

  persistStore();
  return { success: true, error: null };
}

/**
 * 获取已收集信物列表。
 * @returns {Array}
 */
export function getCollectedRelics() {
  const store = loadStore();
  return store.collected_ids.map(function (id) {
    return store.relics[id];
  });
}

/**
 * 获取单个已收集信物。
 * @param {string} relicId
 * @returns {object|null}
 */
export function getCollectedRelic(relicId) {
  const store = loadStore();
  return store.relics[relicId] || null;
}

/**
 * 检查信物是否已收集。
 * @param {string} relicId
 * @returns {boolean}
 */
export function isRelicCollected(relicId) {
  const store = loadStore();
  return store.collected_ids.indexOf(relicId) >= 0;
}

/**
 * 检查场景节点是否已有信物被收集。
 * @param {string} sceneId
 * @returns {boolean}
 */
export function isSceneCollected(sceneId) {
  const store = loadStore();
  var found = false;
  Object.keys(store.relics).forEach(function (id) {
    if (store.relics[id].source_node === sceneId) {
      found = true;
    }
  });
  return found;
}

/**
 * 获取收集进度。
 * @param {number} totalRelicCount - 系统信物总数（默认7）
 * @returns {{ collected: number, total: number, percentage: number, unlocked_next: string|null }}
 */
export function getCollectionProgress(totalRelicCount) {
  const store = loadStore();
  const total = typeof totalRelicCount === 'number' ? totalRelicCount : 7;
  const collected = store.collected_count;

  // 探索路径顺序（来自 relic_system_v1.json summary.exploration_path_sequence）
  const sequence = [
    'relic_entrance_greeting',
    'relic_garden_grove',
    'relic_street_sign',
    'relic_cafe_seal',
    'relic_book_page',
    'relic_craft_seal',
    'relic_center_core'
  ];

  // 找到下一个未收集的信物
  var unlockedNext = null;
  for (var i = 0; i < sequence.length; i++) {
    if (store.collected_ids.indexOf(sequence[i]) < 0) {
      unlockedNext = sequence[i];
      break;
    }
  }

  return {
    collected: collected,
    total: total,
    percentage: total > 0 ? Math.round((collected / total) * 100) : 0,
    unlocked_next: unlockedNext
  };
}

/**
 * 清除存档（用于测试 / 用户重置）。
 */
export function clearStore() {
  storeCache = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

/**
 * 获取存档的 JSON 摘要。
 * @returns {object}
 */
export function getStoreSummary() {
  const store = loadStore();
  return {
    total_collected: store.collected_count,
    collected_ids: store.collected_ids,
    relics: store.relics
  };
}
