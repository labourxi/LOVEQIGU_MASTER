/**
 * AR_RESOURCE_STABILITY — V1.0 AR 资源加载稳定性层
 *
 * 问题：AR 资源加载不稳定（超时、网络、资源缺失）
 * 方案：重试机制 + 降级资源策略 + 加载追踪
 *
 * 集成方式：
 * 在 ar-runtime.js、ar-runtime-bridge.js 加载资源处调用
 * loadARResourceWithRetry() / loadARSceneWithDegradation()
 */

const MAX_RESOURCE_RETRY = 2;
const RESOURCE_TIMEOUT_MS = 8000;
const DEGRADATION_LEVELS = ['full', 'light', 'minimal', 'fallback'];
const RESOURCE_LOG_KEY = 'lqg_ar_resource_log';

function getResourceLog() {
  try {
    var raw = wx.getStorageSync(RESOURCE_LOG_KEY);
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function appendResourceLog(entry) {
  try {
    var log = getResourceLog();
    log.push(Object.assign({
      ts: Date.now(),
      ts_iso: new Date().toISOString()
    }, entry));
    if (log.length > 100) log = log.slice(-100);
    wx.setStorageSync(RESOURCE_LOG_KEY, log);
  } catch (e) {
    // storage unavailable
  }
}

/**
 * Load an AR resource (image / mesh / manifest / data) with retry + timeout.
 *
 * @param {Function} loader - function that returns a Promise resolving to the resource
 * @param {object} options
 * @param {number} options.timeout - per-attempt timeout in ms (default 8000)
 * @param {number} options.maxRetry - max retries (default 2)
 * @param {string} options.resourceName - label for logging
 * @returns {Promise<*>}
 */
function loadARResourceWithRetry(loader, options) {
  options = options || {};
  var timeout = options.timeout || RESOURCE_TIMEOUT_MS;
  var maxRetry = options.maxRetry || MAX_RESOURCE_RETRY;
  var resourceName = options.resourceName || 'unknown_resource';
  var attempt = 0;

  function attemptLoad() {
    attempt += 1;
    return new Promise(function (resolve, reject) {
      var timedOut = false;
      var timer = setTimeout(function () {
        timedOut = true;
        var err = new Error('AR resource load timeout: ' + resourceName + ' (attempt ' + attempt + ')');
        appendResourceLog({
          resource: resourceName,
          action: 'timeout',
          attempt: attempt,
          timeoutMs: timeout
        });
        reject(err);
      }, timeout);

      Promise.resolve().then(function () {
        return loader();
      }).then(function (result) {
        if (timedOut) return;
        clearTimeout(timer);
        appendResourceLog({
          resource: resourceName,
          action: 'load_success',
          attempt: attempt
        });
        resolve(result);
      }).catch(function (err) {
        if (timedOut) return;
        clearTimeout(timer);
        appendResourceLog({
          resource: resourceName,
          action: 'load_failed',
          attempt: attempt,
          error: err && err.message ? err.message : String(err)
        });
        if (attempt <= maxRetry) {
          setTimeout(function () {
            attemptLoad().then(resolve).catch(reject);
          }, 1000);
        } else {
          reject(err);
        }
      });
    });
  }

  return attemptLoad();
}

/**
 * Load an AR scene / runtime package with automatic degradation strategy.
 *
 * Degradation levels:
 *   full    → load all resources (default)
 *   light   → skip heavy meshes, load only markers + UI
 *   minimal → skip all 3D, use static images
 *   fallback→ skip AR entirely, use inline display
 *
 * @param {object} context - { sceneId, loadFull, loadLight, loadMinimal, loadFallback }
 * @param {object} options
 * @returns {Promise<{ level: string, result: * }>}
 */
function loadARSceneWithDegradation(context, options) {
  options = options || {};
  var contextId = (context && context.sceneId) || 'unknown_scene';

  function tryLevel(levelIndex) {
    var level = DEGRADATION_LEVELS[levelIndex];
    if (!level) {
      return Promise.reject(new Error('AR degradation exhausted for: ' + contextId));
    }

    var loader = null;
    if (level === 'full' && typeof context.loadFull === 'function') loader = context.loadFull;
    else if (level === 'light' && typeof context.loadLight === 'function') loader = context.loadLight;
    else if (level === 'minimal' && typeof context.loadMinimal === 'function') loader = context.loadMinimal;
    else if (level === 'fallback' && typeof context.loadFallback === 'function') loader = context.loadFallback;

    if (!loader) {
      return tryLevel(levelIndex + 1);
    }

    var timeout = options.timeout || (level === 'full' ? 10000 : level === 'light' ? 6000 : 4000);
    var maxRetry = level === 'full' ? 2 : level === 'light' ? 1 : 0;

    return loadARResourceWithRetry(loader, {
      timeout: timeout,
      maxRetry: maxRetry,
      resourceName: contextId + '@' + level
    }).then(function (result) {
      appendResourceLog({
        resource: contextId,
        action: 'degradation_success',
        level: level
      });
      return { level: level, result: result };
    }).catch(function () {
      appendResourceLog({
        resource: contextId,
        action: 'degradation_fallback',
        from_level: level
      });
      return tryLevel(levelIndex + 1);
    });
  }

  return tryLevel(0);
}

/**
 * Check if resource stability should activate fallback based on recent error rate.
 */
function shouldActivateResourceFallback() {
  var log = getResourceLog();
  if (log.length < 3) return false;
  var recent = log.slice(-10);
  var failures = 0;
  for (var i = 0; i < recent.length; i += 1) {
    if (recent[i].action === 'timeout' || recent[i].action === 'load_failed') {
      failures += 1;
    }
  }
  return failures >= 5;
}

module.exports = {
  loadARResourceWithRetry: loadARResourceWithRetry,
  loadARSceneWithDegradation: loadARSceneWithDegradation,
  shouldActivateResourceFallback: shouldActivateResourceFallback,
  getResourceLog: getResourceLog,
  DEGRADATION_LEVELS: DEGRADATION_LEVELS.slice()
};
