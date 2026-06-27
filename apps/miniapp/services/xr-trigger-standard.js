/**
 * XR TRIGGER STANDARD — V5.3
 *
 * 这是 Explore Layer → XR Layer 的唯一触发协议。
 *
 * 规则：
 *   - EXPLORE 层只允许 emit TRIGGER_EVENT
 *   - XR 层只允许 listen TRIGGER_EVENT
 *   - 禁止 EXPLORE 层直接调用 XR page navigate
 *
 * 使用方式（EXPLORE 层）：
 *   const xrTrigger = require('../../services/xr-trigger-standard');
 *   xrTrigger.emit({ pointId: 'ep_001' });
 *
 * 使用方式（XR 层）：
 *   const xrTrigger = require('../../services/xr-trigger-standard');
 *   xrTrigger.listen((payload) => { ... });
 */

var _listener = null;

var XR_TRIGGER_EVENT = 'xr:trigger';

function emit(payload) {
  if (typeof _listener === 'function') {
    _listener(payload || {});
  }
}

function listen(fn) {
  _listener = typeof fn === 'function' ? fn : null;
}

function reset() {
  _listener = null;
}

module.exports = {
  XR_TRIGGER_EVENT: XR_TRIGGER_EVENT,
  emit: emit,
  listen: listen,
  reset: reset
};
