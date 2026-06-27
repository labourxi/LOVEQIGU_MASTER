/**
 * CHECKIN_STATE_MACHINE — V1.0 打卡流程统一状态机
 *
 * 问题：打卡流程状态丢失（页面跳转、网络、应用重启）
 * 方案：统一状态机 + 持久化 + 恢复
 *
 * 状态流转：
 *   IDLE → AVAILABLE → ARRIVED → CHECKED_IN → AR_SCANNED → RELIC_REVEALED → COUPON_UNLOCKED → COMPLETED
 *   IDLE → AVAILABLE → ARRIVED → CHECKED_IN → FALLBACK_COMPLETED → COUPON_UNLOCKED → COMPLETED
 *
 * 每个状态转换均是幂等的。
 */

var STATE_KEY = 'lqg_checkin_state_v1';
var LOG_KEY = 'lqg_checkin_log_v1';
var safeJson = null;
try {
  safeJson = require('../../utils/safe-json');
} catch (e) { /* ignore */ }
var safeParse = safeJson && typeof safeJson.safeParse === 'function' ? safeJson.safeParse : function (v) { return v; };
var guardStorageValue = safeJson && typeof safeJson.guardStorageValue === 'function' ? safeJson.guardStorageValue : function (v) { return v; };

var ALLOWED_TRANSITIONS = {
  IDLE: ['AVAILABLE', 'FAILED'],
  AVAILABLE: ['ARRIVED', 'FAILED'],
  ARRIVED: ['CHECKED_IN', 'FAILED'],
  CHECKED_IN: ['AR_SCANNED', 'FALLBACK_COMPLETED', 'FAILED'],
  AR_SCANNED: ['RELIC_REVEALED', 'FAILED'],
  FALLBACK_COMPLETED: ['COUPON_UNLOCKED', 'FAILED'],
  RELIC_REVEALED: ['COUPON_UNLOCKED', 'COMPLETED', 'FAILED'],
  COUPON_UNLOCKED: ['COMPLETED', 'FAILED'],
  COMPLETED: ['FAILED'],
  FAILED: ['AVAILABLE', 'IDLE']
};

function validTransition(from, to) {
  var allowed = ALLOWED_TRANSITIONS[from];
  return allowed && allowed.indexOf(to) >= 0;
}

function loadMachine(pointId) {
  try {
    var raw = wx.getStorageSync(STATE_KEY + ':' + pointId);
    if (!raw) return null;
    raw = guardStorageValue(raw);
    if (!raw) return null;
    return safeParse(raw);
  } catch (e) {
    return null;
  }
}

function saveMachine(pointId, machine) {
  try {
    wx.setStorageSync(STATE_KEY + ':' + pointId, JSON.stringify(machine));
  } catch (e) {
    // storage unavailable
  }
}

function clearMachine(pointId) {
  try {
    wx.removeStorageSync(STATE_KEY + ':' + pointId);
  } catch (e) {
    // storage unavailable
  }
}

function appendLog(pointId, entry) {
  try {
    var key = LOG_KEY + ':' + pointId;
    var raw = guardStorageValue(wx.getStorageSync(key));
    var log = Array.isArray(raw) ? raw : [];
    log.push(Object.assign({ ts: Date.now() }, entry));
    if (log.length > 50) log = log.slice(-50);
    wx.setStorageSync(key, log);
  } catch (e) {
    // storage unavailable
  }
}

function getLog(pointId) {
  try {
    var raw = guardStorageValue(wx.getStorageSync(LOG_KEY + ':' + pointId));
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

/**
 * Create or restore check-in state machine for a point.
 *
 * @param {string} pointId
 * @param {object} options
 * @param {string} options.initialState - state to start from (default 'AVAILABLE')
 * @returns {object} machine
 */
function createMachine(pointId, options) {
  options = options || {};
  var restored = loadMachine(pointId);

  if (restored) {
    appendLog(pointId, { action: 'restored', state: restored.state });
    return restored;
  }

  var machine = {
    pointId: pointId,
    state: options.initialState || 'AVAILABLE',
    transitions: [],
    created: Date.now(),
    updated: Date.now(),
    restored: false
  };

  saveMachine(pointId, machine);
  appendLog(pointId, { action: 'created', state: machine.state });
  return machine;
}

/**
 * Transition state machine to a new state.
 * Returns { ok, machine, error }.
 *
 * @param {object} machine
 * @param {string} toState
 * @param {object} meta - optional metadata attached to the transition
 * @returns {{ ok: boolean, machine: object, error: string|null }}
 */
function transition(machine, toState, meta) {
  if (!machine || !machine.pointId) {
    return { ok: false, machine: machine, error: 'invalid_machine' };
  }

  var state = machine.state || 'IDLE';
  if (state === toState) {
    return { ok: true, machine: machine, error: null };
  }

  if (!validTransition(state, toState)) {
    var err = 'invalid_transition:' + state + '->' + toState;
    appendLog(machine.pointId, { action: 'transition_rejected', from: state, to: toState, error: err });
    return { ok: false, machine: machine, error: err };
  }

  var prev = machine.state;
  machine.state = toState;
  machine.updated = Date.now();
  machine.transitions.push({
    from: prev,
    to: toState,
    meta: meta || {},
    ts: Date.now()
  });

  if (machine.transitions.length > 20) {
    machine.transitions = machine.transitions.slice(-20);
  }

  saveMachine(machine.pointId, machine);
  appendLog(machine.pointId, { action: 'transition', from: prev, to: toState });

  return { ok: true, machine: machine, error: null };
}

/**
 * Reset machine to initial state.
 */
function resetMachine(machine) {
  if (!machine || !machine.pointId) return null;
  var pointId = machine.pointId;
  clearMachine(pointId);
  var fresh = createMachine(pointId, { initialState: 'IDLE' });
  appendLog(pointId, { action: 'reset' });
  return fresh;
}

/**
 * Persist current machine to storage (idempotent).
 */
function persist(machine) {
  if (!machine || !machine.pointId) return;
  saveMachine(machine.pointId, machine);
}

/**
 * Check if machine is in a terminal or near-terminal state.
 */
function isComplete(machine) {
  var s = machine && machine.state;
  return s === 'COMPLETED' || s === 'COUPON_UNLOCKED' || s === 'RELIC_REVEALED';
}

/**
 * Batch log retrieval for diagnostics.
 */
function getTransitionLog(pointId) {
  return getLog(pointId);
}

module.exports = {
  createMachine: createMachine,
  transition: transition,
  resetMachine: resetMachine,
  persist: persist,
  isComplete: isComplete,
  getTransitionLog: getTransitionLog,
  ALLOWED_TRANSITIONS: ALLOWED_TRANSITIONS
};
