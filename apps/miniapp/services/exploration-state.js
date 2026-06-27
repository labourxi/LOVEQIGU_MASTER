/**
 * EXPLORATION STATE — 探索统一状态模型 V1
 *
 * 将现有 checkin-state-machine (IDLE→AVAILABLE→...→COMPLETED) 映射为
 * 产品层的三态模型：
 *
 *   NOT_EXPLORED  →  尚未抵达或打卡
 *   EXPLORING     →  已打卡，正在探索流程中
 *   REVEALABLE    →  可触发 XR 显现
 *
 * XR 系统仅监听 REVEALABLE 状态。
 */

/**
 * 根据 checkin 状态映射为产品层状态。
 *
 * @param {string} checkinState - 来自 checkin-state-machine 的 state
 * @returns {string} NOT_EXPLORED | EXPLORING | REVEALABLE
 */
function mapState(checkinState) {
  switch (checkinState) {
    case 'RELIC_REVEALED':
    case 'COUPON_UNLOCKED':
    case 'COMPLETED':
      return 'REVEALABLE';
    case 'CHECKED_IN':
    case 'AR_SCANNED':
    case 'FALLBACK_COMPLETED':
      return 'REVEALABLE';
    case 'ARRIVED':
      return 'EXPLORING';
    case 'AVAILABLE':
      return 'EXPLORING';
    case 'IDLE':
      return 'NOT_EXPLORED';
    default:
      return 'NOT_EXPLORED';
  }
}

/**
 * 根据任务完成状态进行二次映射（兼容无 state machine 的旧数据）。
 *
 * @param {boolean} taskCompleted - 任务是否已完成
 * @param {string} checkinState - 可选的 checkin 状态
 * @returns {string}
 */
function resolveState(taskCompleted, checkinState) {
  if (checkinState) {
    return mapState(checkinState);
  }
  if (taskCompleted) {
    return 'REVEALABLE';
  }
  return 'NOT_EXPLORED';
}

/**
 * 判断是否可以触发 XR 显现。
 */
function canReveal(state) {
  return state === 'REVEALABLE';
}

module.exports = {
  mapState: mapState,
  resolveState: resolveState,
  canReveal: canReveal,
  STATES: {
    NOT_EXPLORED: 'NOT_EXPLORED',
    EXPLORING: 'EXPLORING',
    REVEALABLE: 'REVEALABLE'
  }
};
