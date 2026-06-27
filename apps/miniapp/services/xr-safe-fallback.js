/**
 * XR SAFE FALLBACK — 全局 XR 安全降级触发器
 *
 * 当以下任意失败时强制进入 XR SAFE MODE：
 *   - route fail（导航跳转不到 XR 页面）
 *   - storage fail（storage 数据损坏或读取失败）
 *   - marker fail（marker 无法绑定 / asset 加载失败）
 *
 * 行为：
 *   - 不进入 render loop
 *   - 不调用 destroy
 *   - 显示静态占位 UI
 *   - 页面继续运行
 *
 * 使用方式：
 *   const xrSafeFallback = require('../../services/xr-safe-fallback');
 *   xrSafeFallback.trigger(reason);
 */

var bus = null;
try {
  bus = require('./xr/xr-event-bus.js');
} catch (e) {
  // event bus 不可用时静默降级
}

var SAFE_FALLBACK_REASONS = {
  ROUTE_FAIL: 'route_fail',
  STORAGE_FAIL: 'storage_fail',
  MARKER_FAIL: 'marker_fail',
  ASSET_FAIL: 'asset_fail',
  NETWORK_FAIL: 'network_fail',
  UNKNOWN: 'unknown'
};

var triggered = false;

/**
 * 触发 XR 安全降级。
 *
 * @param {string} reason - 降级原因（取自 SAFE_FALLBACK_REASONS）
 * @param {object} [detail] - 附加信息（可选）
 */
function trigger(reason, detail) {
  if (triggered) return;
  triggered = true;

  var safeReason = reason || SAFE_FALLBACK_REASONS.UNKNOWN;
  console.warn('🛡️ XR SAFE FALLBACK TRIGGERED:', safeReason, detail || '');

  // 通过事件总线通知 XR 运行时
  if (bus && typeof bus.emit === 'function') {
    bus.emit('XR_SAFE_FALLBACK', {
      reason: safeReason,
      detail: detail || {},
      timestamp: Date.now()
    });
  }

  // 设置全局标志（供页面 / 组件实时读取）
  if (typeof globalThis !== 'undefined') {
    globalThis.__XR_SAFE_FALLBACK__ = {
      active: true,
      reason: safeReason,
      timestamp: Date.now()
    };
  }
}

/**
 * 重置安全降级状态（允许再次触发）。
 * 在 resetXR / 页面 onLoad 时调用。
 */
function reset() {
  triggered = false;
  if (typeof globalThis !== 'undefined') {
    globalThis.__XR_SAFE_FALLBACK__ = {
      active: false,
      reason: '',
      timestamp: 0
    };
  }
}

/**
 * 检查当前是否处于安全降级状态。
 */
function isActive() {
  if (triggered) return true;
  if (typeof globalThis !== 'undefined' && globalThis.__XR_SAFE_FALLBACK__) {
    return globalThis.__XR_SAFE_FALLBACK__.active === true;
  }
  return false;
}

module.exports = {
  trigger: trigger,
  reset: reset,
  isActive: isActive,
  SAFE_FALLBACK_REASONS: SAFE_FALLBACK_REASONS
};
