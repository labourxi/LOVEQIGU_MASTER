/**
 * XR_STABILITY_LAYER — V2.0 上线级 XR 初始化稳定性加固
 *
 * 需求：
 *   1. 重试机制（最多3次），间隔 800ms → 1500ms → 2500ms
 *   2. fallback UI：失败显示"普通探索模式"，禁止白屏/卡死
 *   3. 超时保护：XR初始化超过 6 秒自动降级
 *   4. 设备检测：低端设备直接 fallback
 *   5. 统一返回 { status, mode, reason }
 *   6. 禁止任何情况下 UI 无响应
 *
 * 集成方式：
 *   const xrStability = require('./xr-stability-layer.js');
 *   const result = await xrStability.executeXRInit({
 *     pipeline: () => builder.startXRRenderPipeline(options),
 *     onFallbackUI: () => { showFallbackUI(pageCtx); }
 *   });
 */

var safeJson = require('../../utils/safe-json');
var guardStorageValue = safeJson.guardStorageValue;
var ERROR_LOG_KEY = 'xr_init_error_log';

/* ---- 设备检测 ---- */

/**
 * 检测是否为低端设备（memory / gpu 不足）
 * 返回 { lowEnd: boolean, reason: string }
 */
function detectDeviceCapability() {
  var result = { lowEnd: false, reason: '' };

  try {
    var sysInfo = wx.getSystemInfoSync();

    // 内存检测（微信小程序 platform 不直接暴露 memory，用 benchmark 替代）
    if (sysInfo.benchmarkLevel !== undefined && sysInfo.benchmarkLevel <= 10) {
      result.lowEnd = true;
      result.reason = 'low_benchmark:' + sysInfo.benchmarkLevel;
      return result;
    }

    // GPU / 渲染器检测
    if (sysInfo.renderer) {
      var lowGPUSignatures = ['Mali-400', 'Adreno 3', 'Adreno 4', 'PowerVR', 'Intel HD Graphics 2000'];
      for (var i = 0; i < lowGPUSignatures.length; i += 1) {
        if (sysInfo.renderer.indexOf(lowGPUSignatures[i]) >= 0) {
          result.lowEnd = true;
          result.reason = 'low_gpu:' + sysInfo.renderer;
          return result;
        }
      }
    }

    // 内存（部分微信版本可获取 memory）
    if (typeof sysInfo.memory === 'number' && sysInfo.memory > 0 && sysInfo.memory < 1024) {
      result.lowEnd = true;
      result.reason = 'low_memory:' + sysInfo.memory + 'MB';
      return result;
    }

    // 低端设备型号启发式
    var lowEndModels = ['iPhone 5', 'iPhone 6', 'iPhone SE', 'OPPO A', 'vivo Y', 'Redmi Note 5'];
    var model = (sysInfo.model || '') + ' ' + (sysInfo.brand || '');
    for (var j = 0; j < lowEndModels.length; j += 1) {
      if (model.indexOf(lowEndModels[j]) >= 0) {
        result.lowEnd = true;
        result.reason = 'low_end_model:' + model;
        return result;
      }
    }
  } catch (e) {
    result.lowEnd = false;
    result.reason = 'detect_failed';
  }

  return result;
}

/* ---- 错误日志 ---- */

function getErrorLog() {
  try {
    var raw = guardStorageValue(wx.getStorageSync(ERROR_LOG_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function appendErrorLog(entry) {
  try {
    var log = getErrorLog();
    log.push(Object.assign({ ts: Date.now() }, entry));
    if (log.length > 50) log = log.slice(-50);
    wx.setStorageSync(ERROR_LOG_KEY, log);
  } catch (e) {
    // storage unavailable
  }
}

function clearErrorLog() {
  try {
    wx.removeStorageSync(ERROR_LOG_KEY);
  } catch (e) {
    // storage unavailable
  }
}

/* ---- 重试机制（自定义间隔） ---- */

var RETRY_DELAYS = [800, 1500, 2500];
var MAX_RETRY = RETRY_DELAYS.length; // 3
var GLOBAL_TIMEOUT_MS = 6000;

/**
 * 重试 XR 初始化，每次失败间隔递增。
 *
 * @param {Function} pipelineFn - async function 执行 XR pipeline
 * @param {Function} onAttempt - (attempt, maxRetry) 可选，用于 UI 反馈
 * @returns {Promise<{status: string, mode: string, reason: string}>}
 */
function retryXRInit(pipelineFn, onAttempt) {
  var attempt = 0;

  function doAttempt() {
    attempt += 1;
    if (typeof onAttempt === 'function') {
      onAttempt(attempt, MAX_RETRY);
    }

    return Promise.resolve().then(function () {
      return pipelineFn();
    }).then(function (res) {
      // 如果 pipeline 返回了非 success 的统一对象，视为失败 → 触发重试
      if (res && typeof res === 'object' && res.status && res.status !== 'success') {
        throw new Error('pipeline_fallback:' + (res.reason || 'unknown'));
      }
      appendErrorLog({ action: 'init_success', attempt: attempt });
      return {
        status: 'success',
        mode: 'xr',
        reason: 'init_success_at_attempt_' + attempt
      };
    }).catch(function (err) {
      appendErrorLog({
        action: 'init_failed',
        attempt: attempt,
        error: err && err.message ? err.message : String(err)
      });

      if (attempt < MAX_RETRY) {
        var delayMs = RETRY_DELAYS[attempt - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve(doAttempt());
          }, delayMs);
        });
      }

      // 全部重试耗尽 → fallback
      appendErrorLog({ action: 'all_retries_exhausted', attempt: attempt });
      return {
        status: 'fallback',
        mode: 'normal',
        reason: 'retry_exhausted:' + (err && err.message ? err.message : 'unknown')
      };
    });
  }

  return doAttempt();
}

/* ---- 超时保护 ---- */

/**
 * 包裹 pipelineFn，超时 GLOBAL_TIMEOUT_MS 后自动降级。
 * resolve 始终返回 { status, mode, reason }。
 */
function withTimeout(pipelineFn) {
  return new Promise(function (resolve) {
    var timedOut = false;
    var timer = setTimeout(function () {
      timedOut = true;
      appendErrorLog({ action: 'global_timeout', timeoutMs: GLOBAL_TIMEOUT_MS });
      resolve({
        status: 'fallback',
        mode: 'normal',
        reason: 'global_timeout_' + GLOBAL_TIMEOUT_MS + 'ms'
      });
    }, GLOBAL_TIMEOUT_MS);

    Promise.resolve().then(function () {
      return pipelineFn();
    }).then(function (result) {
      if (timedOut) return;
      clearTimeout(timer);
      resolve(result);
    }).catch(function (err) {
      if (timedOut) return;
      clearTimeout(timer);
      resolve({
        status: 'fallback',
        mode: 'normal',
        reason: 'pipeline_error:' + (err && err.message ? err.message : 'unknown')
      });
    });
  });
}

/* ---- fallback UI ---- */

var FALLBACK_UI_SHOWN_KEY = 'xr_fallback_ui_shown';

/**
 * 显示 fallback UI（普通探索模式），禁止白屏/卡死。
 *
 * @param {object} pageCtx - page this，设置了 xrLaunching 的页面
 * @param {Function} onNavigate - fallback 后的导航回调
 */
function showFallbackUI(pageCtx, onNavigate) {
  if (!pageCtx || typeof pageCtx.setData !== 'function') {
    // 没有页面上下文时安静降级
    console.warn('[XR_STABILITY] no page context for fallback UI');
    return;
  }

  try {
    pageCtx.setData({
      xrLaunching: false,
      xrLaunchMessage: '',
      xrFallbackMode: true,
      xrFallbackMessage: '当前设备支持普通探索模式，可继续探索景点与收集信物。'
    });

    try {
      wx.setStorageSync(FALLBACK_UI_SHOWN_KEY, true);
    } catch (e) {
      // ignore
    }
  } catch (e) {
    console.error('[XR_STABILITY] fallback UI setData error', e);
  }

  if (typeof onNavigate === 'function') {
    // 使用 requestAnimationFrame 确保 UI 先更新
    var navFn = function () {
      setTimeout(function () {
        try {
          onNavigate();
        } catch (e) {
          console.error('[XR_STABILITY] fallback navigate error', e);
        }
      }, 100);
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(navFn);
    } else {
      setTimeout(navFn, 16);
    }
  }
}

/**
 * 统一 XR 初始化执行入口。
 *
 * @param {object} context
 * @param {Function} context.pipeline - async () => XR pipeline 启动函数
 * @param {object} context.pageCtx - 可选，page this，用于 fallback UI 更新
 * @param {Function} context.onFallbackUI - 可选，fallback UI 回调
 * @param {Function} context.onAttempt - 可选，(attempt, max) => 重试进度回调
 * @returns {Promise<{status: string, mode: string, reason: string}>}
 */
function executeXRInit(context) {
  context = context || {};
  var pipelineFn = context.pipeline;
  var pageCtx = context.pageCtx;
  var onFallbackUI = context.onFallbackUI;
  var onAttempt = context.onAttempt;

  if (typeof pipelineFn !== 'function') {
    return Promise.resolve({
      status: 'failed',
      mode: 'normal',
      reason: 'no_pipeline_provided'
    });
  }

  // Step 1: 设备检测 —— 低端设备直接 fallback
  var deviceInfo = detectDeviceCapability();
  if (deviceInfo.lowEnd) {
    appendErrorLog({ action: 'device_fallback', reason: deviceInfo.reason });

    var fbCtx = pageCtx || (typeof getCurrentPages === 'function' ? getPageContext() : null);
    (onFallbackUI || showFallbackUI)(fbCtx);

    return Promise.resolve({
      status: 'fallback',
      mode: 'normal',
      reason: 'device_low_end:' + deviceInfo.reason
    });
  }

  // Step 2: 超时保护
  var timedPipeline = withTimeout(pipelineFn);

  // Step 3: 重试执行
  return retryXRInit(function () {
    return timedPipeline;
  }, onAttempt).then(function (result) {
    if (result.status === 'success') {
      return result;
    }

    // fallback 或 failed
    appendErrorLog({ action: 'final_result', status: result.status, reason: result.reason });

    var fbCtx = pageCtx || (typeof getCurrentPages === 'function' ? getPageContext() : null);
    (onFallbackUI || showFallbackUI)(fbCtx);

    return {
      status: 'fallback',
      mode: 'normal',
      reason: result.reason || 'fallback_activated'
    };
  });
}

/**
 * 获取当前页面上下文（微信小程序 getCurrentPages）。
 */
function getPageContext() {
  try {
    var pages = getCurrentPages();
    if (pages && pages.length > 0) {
      return pages[pages.length - 1];
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/* ---- XR 事件总线集成 ---- */

/**
 * 在事件总线上广播 XR 状态。
 *
 * @param {object} bus - event bus (on/emit)
 * @param {object} result - { status, mode, reason }
 */
function broadcastXRResult(bus, result) {
  if (!bus || typeof bus.emit !== 'function') return;

  bus.emit('XR_STATE_CHANGE', {
    previous: null,
    state: result.status === 'success' ? 'RUNNING' : 'FAILED',
    detail: {
      mode: result.mode,
      reason: result.reason,
      stabilityResult: result
    }
  });

  if (result.status === 'success') {
    bus.emit('XR_WORLD_READY', {
      state: 'RUNNING',
      stabilityResult: result
    });
  } else {
    bus.emit('XR_FALLBACK_ACTIVATED', {
      reason: result.reason || 'xr_unavailable',
      mode: result.mode,
      stabilityResult: result
    });
  }
}

module.exports = {
  // 核心入口
  executeXRInit: executeXRInit,
  broadcastXRResult: broadcastXRResult,

  // 子功能（可独立使用）
  detectDeviceCapability: detectDeviceCapability,
  retryXRInit: retryXRInit,
  withTimeout: withTimeout,
  showFallbackUI: showFallbackUI,

  // 日志
  getErrorLog: getErrorLog,
  clearErrorLog: clearErrorLog,

  // 常量
  RETRY_DELAYS: RETRY_DELAYS.slice(),
  MAX_RETRY: MAX_RETRY,
  GLOBAL_TIMEOUT_MS: GLOBAL_TIMEOUT_MS
};
