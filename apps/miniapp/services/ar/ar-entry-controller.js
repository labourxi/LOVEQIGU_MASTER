const bus = require('../xr/xr-event-bus.js');
const xrStability = require('./xr-stability-layer.js');

let initialized = false;

function initEntry() {
  if (initialized) {
    return;
  }
  initialized = true;
  console.log('[AR ENTRY INIT]');
}

/**
 * 原始触发方式（保持向后兼容）
 */
function trigger(payload) {
  initEntry();

  bus.emit('USER_ENTER', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });

  bus.emit('XR_START_PIPELINE', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });

  bus.emit('XR_USER_TRIGGER', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });
}

/**
 * 带稳定性加固的触发方式。
 * 使用 xrStability.executeXRInit 执行 XR init，
 * 包含重试（800ms/1500ms/2500ms）、超时保护（6s）、设备检测、fallback UI。
 *
 * @param {object} payload
 * @param {object} context
 * @param {object} context.pageCtx - page this，用于 fallback UI
 * @returns {Promise<{status: string, mode: string, reason: string}>}
 */
function triggerStable(payload, context) {
  initEntry();
  context = context || {};
  var pageCtx = context.pageCtx;

  // 先发传统事件（向后兼容）
  bus.emit('USER_ENTER', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });

  bus.emit('XR_USER_TRIGGER', {
    source: 'entry_button',
    ...(payload && typeof payload === 'object' ? payload : {})
  });

  // 通过稳定性层执行 XR init
  return xrStability.executeXRInit({
    pipeline: function () {
      return new Promise(function (resolve, reject) {
        bus.emit('XR_START_PIPELINE', {
          source: 'entry_button',
          ...(payload && typeof payload === 'object' ? payload : {})
        });

        // XR_WORLD_READY 或 XR_FAILED 决定结果
        var offReady = bus.on('XR_WORLD_READY', function (data) {
          offReady();
          offFailed();
          resolve({ started: true, xrReady: data });
        });
        var offFailed = bus.on('XR_FAILED', function (data) {
          offReady();
          offFailed();
          reject(new Error('xr_failed:' + (data && data.reason ? data.reason : 'unknown')));
        });
      });
    },
    pageCtx: pageCtx
  });
}

function triggerARStart(payload) {
  trigger(payload);
}

function triggerARStartStable(payload, context) {
  return triggerStable(payload, context);
}

module.exports = {
  initEntry,
  trigger,
  triggerStable,
  triggerARStart,
  triggerARStartStable
};
