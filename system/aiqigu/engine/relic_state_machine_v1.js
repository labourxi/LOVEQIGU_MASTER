/**
 * RELIC STATE MACHINE V1 — 信物状态机
 *
 * LOCKED → ACTIVE → COLLECTED
 *
 * 每个信物有且仅有三种状态。
 * 状态迁移由用户行为触发，不可逆向。
 *
 * 数据来源：
 *   - /system/aiqigu/v1/relic_system_v1.json (信物定义)
 *   - /system/aiqigu/scene_map_v1.json (场景节点)
 *   - /system/audit/aiqigu_reality_audit_v1.js (审计规则)
 *
 * 约束：
 *   - 禁止随机生成无场景来源信物
 *   - 禁止跨节点共享信物
 *   - 每个 node 只能生成 1 个主信物
 */

// ─── 状态常量 ───
export const RELIC_STATE = Object.freeze({
  LOCKED: 'LOCKED',
  ACTIVE: 'ACTIVE',
  COLLECTED: 'COLLECTED'
});

// ─── 状态迁移映射表 ───
// 只允许定义的迁移，其他均为非法
const TRANSITIONS = Object.freeze({
  LOCKED: ['ACTIVE'],
  ACTIVE: ['COLLECTED'],
  COLLECTED: []
});

// ─── 内部状态存储 ───
// key: relic_id, value: { state, timestamp, node_id, user_id }
const relicStates = new Map();

/**
 * 初始化信物状态。
 * 创建信物实例并将其状态设为 LOCKED。
 *
 * @param {string} relicId - 信物ID
 * @param {string} nodeId  - 来源场景节点ID
 * @param {string} [userId] - 用户ID（预留）
 * @returns {{ state: string, timestamp: number }}
 */
export function initRelicState(relicId, nodeId, userId) {
  if (relicStates.has(relicId)) {
    // 已存在则直接返回现有状态（幂等）
    return relicStates.get(relicId);
  }

  const entry = {
    state: RELIC_STATE.LOCKED,
    timestamp: Date.now(),
    node_id: nodeId,
    user_id: userId || null
  };

  relicStates.set(relicId, entry);
  return entry;
}

/**
 * 迁移信物状态。
 * LOCKED → ACTIVE：用户进入触发范围
 * ACTIVE → COLLECTED：用户完成收集
 *
 * @param {string} relicId - 信物ID
 * @param {string} targetState - 目标状态
 * @returns {{ success: boolean, entry: object|null, error: string|null }}
 */
export function transitionRelicState(relicId, targetState) {
  const entry = relicStates.get(relicId);
  if (!entry) {
    return { success: false, entry: null, error: 'relic_not_found: ' + relicId };
  }

  const currentState = entry.state;
  const allowed = TRANSITIONS[currentState];

  if (!allowed || allowed.indexOf(targetState) < 0) {
    return {
      success: false,
      entry: entry,
      error: 'invalid_transition: ' + currentState + ' -> ' + targetState
    };
  }

  entry.state = targetState;
  entry.timestamp = Date.now();
  relicStates.set(relicId, entry);

  return { success: true, entry: entry, error: null };
}

/**
 * 批量获取信物状态。
 *
 * @param {string[]} relicIds - 信物ID数组
 * @returns {Array} 每个信物的状态对象
 */
export function getRelicStates(relicIds) {
  if (!relicIds || relicIds.length === 0) {
    // 返回全部
    const result = [];
    relicStates.forEach(function (entry, relicId) {
      result.push({ relic_id: relicId, state: entry.state, node_id: entry.node_id });
    });
    return result;
  }

  return relicIds.map(function (id) {
    const entry = relicStates.get(id);
    if (!entry) return { relic_id: id, state: null, node_id: null };
    return { relic_id: id, state: entry.state, node_id: entry.node_id };
  });
}

/**
 * 获取单个信物状态。
 *
 * @param {string} relicId
 * @returns {object|null}
 */
export function getRelicState(relicId) {
  const entry = relicStates.get(relicId);
  if (!entry) return null;
  return { relic_id: relicId, state: entry.state, node_id: entry.node_id };
}

/**
 * 重置所有信物状态（用于测试 / 新用户场景）。
 */
export function resetAllStates() {
  relicStates.clear();
}

/**
 * 检查当前是否可迁移到目标状态。
 *
 * @param {string} currentState
 * @param {string} targetState
 * @returns {boolean}
 */
export function canTransition(currentState, targetState) {
  const allowed = TRANSITIONS[currentState];
  if (!allowed) return false;
  return allowed.indexOf(targetState) >= 0;
}

/**
 * 获取信物状态的统计信息。
 * @returns {{ locked: number, active: number, collected: number, total: number }}
 */
export function getStateStats() {
  let locked = 0;
  let active = 0;
  let collected = 0;

  relicStates.forEach(function (entry) {
    if (entry.state === RELIC_STATE.LOCKED) locked++;
    else if (entry.state === RELIC_STATE.ACTIVE) active++;
    else if (entry.state === RELIC_STATE.COLLECTED) collected++;
  });

  return {
    locked: locked,
    active: active,
    collected: collected,
    total: locked + active + collected
  };
}
