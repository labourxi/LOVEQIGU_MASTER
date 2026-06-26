/**
 * SPLASH_STABILITY — V1.0 首屏加载稳定性层
 *
 * 问题：首屏加载过慢
 * 方案：拆分 skeleton → UI → AR lazy load 三段式
 *
 * 集成方式：
 * 在 page/index/index.js onLoad() / refresh() 中调用
 *
 * 流程：
 *   splashLoadSequence(pageContext, {
 *     uiReady: fn,     // 1. 立即显示 skeleton
 *     dataReady: fn,   // 2. 加载业务数据
 *     arReady: fn      // 3. 延迟加载 AR 资源
 *   })
 */

const AR_LAZY_DELAY = 2000;

/**
 * Execute splash load sequence with guaranteed timing.
 *
 * @param {object} pageCtx - page context (this)
 * @param {object} phases
 * @param {Function} phases.uiReady - renders skeleton (synchronous)
 * @param {Function} phases.dataReady - loads page data, returns Promise
 * @param {Function} phases.arReady - loads AR module lazily, no-return optional
 * @param {object} options
 * @param {number} options.minSplashMs - minimum splash display time (default 800)
 * @param {number} options.arLazyDelay - delay before AR lazy load (default 2000)
 * @param {string} options.skeletonKey - skeleton flag key in page data (default 'loading')
 */
function splashLoadSequence(pageCtx, phases, options) {
  options = options || {};
  var minSplashMs = options.minSplashMs || 800;
  var arLazyDelay = options.arLazyDelay || AR_LAZY_DELAY;
  var skeletonKey = options.skeletonKey || 'loading';
  var splashStart = Date.now();

  if (!pageCtx || typeof pageCtx.setData !== 'function') {
    return Promise.reject(new Error('[splash] invalid page context'));
  }

  // Phase 1: skeleton immediate
  if (typeof phases.uiReady === 'function') {
    phases.uiReady();
  }

  // Phase 2: load data → hide skeleton
  var dataPromise = phases.dataReady ? Promise.resolve().then(function () {
    return phases.dataReady();
  }) : Promise.resolve();

  return dataPromise.then(function (result) {
    var elapsed = Date.now() - splashStart;
    var remaining = Math.max(0, minSplashMs - elapsed);

    if (remaining > 0) {
      return delay(remaining).then(function () { return result; });
    }
    return result;
  }).then(function (result) {
    // Ensure skeleton is hidden
    var data = {};
    data[skeletonKey] = false;
    pageCtx.setData(data);

    // Phase 3: lazy AR load (fire and forget)
    if (typeof phases.arReady === 'function') {
      delay(arLazyDelay).then(function () {
        try {
          phases.arReady();
        } catch (e) {
          console.warn('[splash] AR lazy load error', e);
        }
      });
    }

    return result;
  }).catch(function (err) {
    var data = {};
    data[skeletonKey] = false;
    pageCtx.setData(data);
    throw err;
  });
}

/**
 * Simple splash guard: ensure skeleton is shown first,
 * then set a minimum visible time before switching to content.
 *
 * @param {object} pageCtx
 * @param {Function} contentLoader - returns Promise<data>
 * @param {number} minMs - minimum splash ms
 */
function splashGuard(pageCtx, contentLoader, minMs) {
  minMs = minMs || 800;
  var start = Date.now();

  return Promise.resolve().then(function () {
    return contentLoader();
  }).then(function (result) {
    var elapsed = Date.now() - start;
    var remaining = Math.max(0, minMs - elapsed);
    if (remaining > 0) {
      return delay(remaining).then(function () { return result; });
    }
    return result;
  });
}

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  splashLoadSequence: splashLoadSequence,
  splashGuard: splashGuard
};
