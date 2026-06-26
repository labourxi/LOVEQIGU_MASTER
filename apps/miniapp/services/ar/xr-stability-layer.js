/**
 * XR_STABILITY_LAYER — V1.0 XR 初始化稳定性层
 *
 * 问题：XR 初始化偶发失败
 * 方案：retry + fallback 兜底 + 错误日志追踪
 *
 * 集成方式：
 * runtime-builder.js startXRPipeline()/handleXRStartPipeline() 前调用
 * wrapXRPipeline(builder, options) 返回增强版 builder
 */

const MAX_RETRY = 3;
const RETRY_DELAY_MS = 1500;
const ERROR_LOG_KEY = 'lqg_xr_error_log';

function getErrorLog() {
  try {
    var raw = wx.getStorageSync(ERROR_LOG_KEY);
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function appendErrorLog(entry) {
  try {
    var log = getErrorLog();
    log.push(Object.assign({
      ts: Date.now(),
      ts_iso: new Date().toISOString()
    }, entry));
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

function safeDelay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

/**
 * Wrap an XR pipeline start function with retry + fallback + error logging.
 *
 * @param {Function} originalStart - original startXRPipeline / handleXRStartPipeline
 * @param {Function} onFallback - fallback handler when all retries exhausted
 * @param {object} options
 * @param {number} options.maxRetry - max retry count (default 3)
 * @param {number} options.retryDelay - delay between retries (default 1500ms)
 * @param {string} options.pipelineName - label for error log
 */
function wrapXRStart(originalStart, onFallback, options) {
  options = options || {};
  var maxRetry = options.maxRetry || MAX_RETRY;
  var retryDelay = options.retryDelay || RETRY_DELAY_MS;
  var pipelineName = options.pipelineName || 'xr_pipeline';

  return function xrStartWithStability(payload) {
    var self = this;
    var attempt = 0;
    var lastError = null;

    function attemptStart() {
      attempt += 1;
      try {
        var result = originalStart.call(self, payload);
        if (result && typeof result.then === 'function') {
          return result.then(function (res) {
            appendErrorLog({
              pipeline: pipelineName,
              action: 'start_success',
              attempt: attempt
            });
            return res;
          }).catch(function (err) {
            lastError = err;
            appendErrorLog({
              pipeline: pipelineName,
              action: 'start_failed',
              attempt: attempt,
              error: err && err.message ? err.message : String(err)
            });
            if (attempt < maxRetry) {
              return safeDelay(retryDelay).then(attemptStart);
            }
            appendErrorLog({
              pipeline: pipelineName,
              action: 'all_retries_exhausted',
              attempt: attempt,
              error: lastError && lastError.message ? lastError.message : String(lastError)
            });
            if (typeof onFallback === 'function') {
              return onFallback.call(self, payload, lastError, { attempt: attempt });
            }
            throw lastError;
          });
        }
        appendErrorLog({
          pipeline: pipelineName,
          action: 'start_success',
          attempt: attempt
        });
        return result;
      } catch (err) {
        lastError = err;
        appendErrorLog({
          pipeline: pipelineName,
          action: 'start_failed_sync',
          attempt: attempt,
          error: err && err.message ? err.message : String(err)
        });
        if (attempt < maxRetry) {
          return safeDelay(retryDelay).then(attemptStart);
        }
        appendErrorLog({
          pipeline: pipelineName,
          action: 'all_retries_exhausted',
          attempt: attempt,
          error: lastError && lastError.message ? lastError.message : String(lastError)
        });
        if (typeof onFallback === 'function') {
          return onFallback.call(self, payload, lastError, { attempt: attempt });
        }
        throw lastError;
      }
    }

    return attemptStart();
  };
}

/**
 * Wrap the entire runtime-builder with XR stability layer.
 *
 * @param {object} builder - result of createRuntimeBuilder()
 * @param {object} options
 */
function wrapXRPipeline(builder, options) {
  if (!builder) return builder;
  options = options || {};

  var originalStart = builder.startXRPipeline || builder.XR_START_PIPELINE;
  if (typeof originalStart !== 'function') return builder;

  var fallbackPipeline = options.fallbackPipeline || function (payload) {
    console.warn('[XR_STABILITY] fallback pipeline activated');
    if (builder.getXRState) {
      var state = builder.getXRState();
      if (state.state !== 'FAILED') {
        if (builder.setXRState) builder.setXRState('FAILED', { reason: 'fallback_activated' });
      }
    }
    var bus = options.eventBus;
    if (bus && typeof bus.emit === 'function') {
      bus.emit('XR_FALLBACK_ACTIVATED', {
        reason: 'pipeline_retry_exhausted',
        pipeline: options.pipelineName || 'xr_pipeline'
      });
    }
    return { started: false, fallback: true };
  };

  var wrapped = wrapXRStart(originalStart, fallbackPipeline, {
    maxRetry: options.maxRetry || MAX_RETRY,
    retryDelay: options.retryDelay || RETRY_DELAY_MS,
    pipelineName: options.pipelineName || 'xr_pipeline'
  });

  builder.startXRPipeline = wrapped;
  builder.XR_START_PIPELINE = wrapped;
  builder.__xrStabilityActive = true;

  return builder;
}

/**
 * Get error log for diagnostics.
 */
function getXRErrorLog() {
  return getErrorLog();
}

module.exports = {
  wrapXRStart: wrapXRStart,
  wrapXRPipeline: wrapXRPipeline,
  getXRErrorLog: getXRErrorLog,
  clearXRErrorLog: clearErrorLog
};
