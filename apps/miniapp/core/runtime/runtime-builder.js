const bus = require('../../services/xr/xr-event-bus.js');
const ritual = require('../../services/ar/ar-ritual-controller.js');
const { attachWorldRenderer, renderStarInRealSpace, XR_SAFE_RENDER } = require('../../services/ar/world-renderer.js');
const { bindPilotRuntime } = require('../../services/ar/ar-pilot-runtime.js');
const persistence = require('../../services/ar/ar-persistence-store.js');
const spatialStore = require('../../services/ar/ar-spatial-store.js');
const cloud = require('../../services/ar/ar-cloud-sync.js');
const xrStability = require('../../services/ar/xr-stability-layer.js');

const XR_STATE = Object.freeze({
  IDLE: 'IDLE',
  INIT: 'INIT',
  READY: 'READY',
  RUNNING: 'RUNNING',
  FAILED: 'FAILED'
});

const PILOT_MODE = true;

function createRuntimeBuilder(options = {}) {
  const steps = [];
  let running = false;
  const context = options.context || null;
  const pageCtx = options.pageCtx || null;
  let scheduled = false;
  let spatialRelicRenderBound = false;
  let worldLifecycleBound = false;
  let xrTriggerBound = false;
  let xrContextBound = false;
  let xrState = XR_STATE.IDLE;
  let xrReadyFlags = {
    world: false,
    camera: false
  };
  let xrReadyTimeout = null;
  let xrListenersBound = false;
  let xrUserTriggerEmitted = false;
  let xrContext = {
    worldEngine: null,
    cameraStarter: null
  };
  let xrStabilityResult = null;

  function emitStateChange(previous, next, detail = {}) {
    bus.emit('XR_STATE_CHANGE', {
      previous,
      state: next,
      detail
    });
  }

  function pilotLog() {
    if (!PILOT_MODE || typeof console === 'undefined' || !console.log) {
      return;
    }
    console.log.apply(console, arguments);
  }

  function safeRuntimeGuard(handler, label) {
    return function guarded(payload) {
      try {
        return handler.call(this, payload);
      } catch (error) {
        handleXRFailure('runtime_guard_failed', error, {
          label
        });
        return null;
      }
    };
  }

  function setXRState(next, detail = {}) {
    if (xrState === next) {
      return xrState;
    }
    const previous = xrState;
    xrState = next;
    emitStateChange(previous, next, detail);
    return xrState;
  }

  function resetXRReadiness() {
    xrReadyFlags = {
      world: false,
      camera: false
    };
    xrUserTriggerEmitted = false;
  }

  function clearXRReadyTimeout() {
    if (xrReadyTimeout) {
      clearTimeout(xrReadyTimeout);
    }
    xrReadyTimeout = null;
  }

  function handleXRFailure(reason, error, detail = {}) {
    if (xrState === XR_STATE.FAILED) {
      return xrState;
    }
    clearXRReadyTimeout();
    setXRState(XR_STATE.FAILED, {
      reason,
      detail,
      error: error && error.message ? error.message : null
    });
    bus.emit('XR_FAILED', {
      state: XR_STATE.FAILED,
      reason,
      detail,
      error: error && error.message ? error.message : null
    });
    return xrState;
  }

  function scheduleXRFailure() {
    clearXRReadyTimeout();
    xrReadyTimeout = setTimeout(() => {
      if (xrState === XR_STATE.READY || xrState === XR_STATE.RUNNING || xrState === XR_STATE.FAILED) {
        return;
      }
      setXRState(XR_STATE.FAILED, {
        reason: 'ready_timeout',
        readiness: {
          ...xrReadyFlags
        }
      });
      bus.emit('XR_FAILED', {
        state: XR_STATE.FAILED,
        reason: 'ready_timeout',
        readiness: {
          ...xrReadyFlags
        }
      });
    }, 5000);
  }

  function finalizeXRReady() {
    if (!xrReadyFlags.world || !xrReadyFlags.camera) {
      return;
    }
    if (xrState === XR_STATE.FAILED || xrState === XR_STATE.READY || xrState === XR_STATE.RUNNING) {
      return;
    }
    clearXRReadyTimeout();
    setXRState(XR_STATE.READY, {
      readiness: {
        ...xrReadyFlags
      }
    });
    bus.emit('XR_WORLD_READY', {
      state: XR_STATE.READY,
      readiness: {
        ...xrReadyFlags
      }
    });
    scheduleNextFrame(() => {
      if (xrState !== XR_STATE.READY) {
        return;
      }
      setXRState(XR_STATE.RUNNING, {
        readiness: {
          ...xrReadyFlags
        }
      });
    });
  }

  function handleXRReady(payload = {}) {
    const source = payload.source === 'world' || payload.source === 'camera'
      ? payload.source
      : null;

    if (source) {
      xrReadyFlags[source] = true;
    }

    bus.emit('XR_STATE_CHANGE', {
      previous: xrState,
      state: xrState,
      detail: {
        readiness: {
          ...xrReadyFlags
        },
        source: source || 'unknown'
      }
    });

    finalizeXRReady();
  }

  function bindXRPipeline() {
    if (xrListenersBound) {
      return;
    }
    xrListenersBound = true;
    bindPilotRuntime(bus);
    bus.on('XR_START_PIPELINE', safeRuntimeGuard(handleXRStartPipeline, 'XR_START_PIPELINE'));
    bus.on('XR_READY', safeRuntimeGuard(handleXRReady, 'XR_READY'));
  }

  function bindXRContext(boundContext = {}) {
      xrContext = {
      ...xrContext,
      ...boundContext
    };
    xrContextBound = true;
    bindXRPipeline();
    return api;
  }

  async function handleXRStartPipeline(payload = {}) {
    bindXRPipeline();
    resetXRReadiness();
    setXRState(XR_STATE.INIT, {
      source: payload && payload.source ? payload.source : 'entry_button'
    });
    scheduleXRFailure();

    await yieldToFrame();

    try {
      await startXRRenderPipeline({
        loadStarScene() {
          if (xrContext.worldEngine && typeof xrContext.worldEngine.start === 'function') {
            return Promise.resolve().then(() => xrContext.worldEngine.start());
          }
          return null;
        },
        loadMeridianScene() {
          if (typeof xrContext.cameraStarter === 'function') {
            return Promise.resolve().then(() => xrContext.cameraStarter(payload));
          }
          return null;
        },
        renderInWorldSpace(position, relic) {
          return XR_SAFE_RENDER(() => {
            bus.emit('XR_RENDER_WORLD_SPACE', {
              position: position || (relic && relic.position) || null,
              relic: relic || null
            });
            return true;
          }, relic);
        }
      });
    } catch (error) {
      handleXRFailure('pipeline_start_failed', error, {
        source: payload && payload.source ? payload.source : 'entry_button'
      });
      return getXRState();
    }

    if (!xrUserTriggerEmitted) {
      xrUserTriggerEmitted = true;
      bus.emit('XR_USER_TRIGGER', {
        source: 'pipeline',
        readiness: {
          ...xrReadyFlags
        }
      });
    }

    return getXRState();
  }

  function queueStep(name, delayMs, handler) {
    if (!name || typeof handler !== 'function') {
      return api;
    }
    steps.push({
      name,
      delayMs: Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0,
      handler
    });
    return api;
  }

  async function executeStepAsync(step) {
    if (!step || typeof step.handler !== 'function') {
      return null;
    }
    await yieldToFrame();
    const result = await Promise.resolve().then(() => step.handler.call(context, {
      name: step.name,
      context
    }));
    await yieldToFrame();
    return result;
  }

  function scheduleStep(step, delayMs = 0) {
    const waitMs = Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0;
    return new Promise((resolve) => {
      const run = () => {
        executeStepAsync(step)
          .then(resolve)
          .catch(() => resolve(null));
      };
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          setTimeout(run, waitMs);
        });
        return;
      }
      setTimeout(run, waitMs);
    });
  }

  function scheduleNextFrame(fn) {
    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(() => {
        if (typeof fn === 'function') {
          fn();
        }
      });
    }
    return setTimeout(() => {
      if (typeof fn === 'function') {
        fn();
      }
    }, 16);
  }

  function yieldEveryN(ms = 30) {
    const delay = Number.isFinite(ms) ? Math.max(0, ms) : 30;
    return new Promise((resolve) => {
      scheduleNextFrame(() => {
        setTimeout(resolve, delay);
      });
    });
  }

  function yieldToNextFrame() {
    return yieldEveryN(0);
  }

  function yieldToFrame() {
    return yieldEveryN(0);
  }

  async function processChunk(items, handler, options = {}) {
    const queue = Array.isArray(items) ? items : [];
    const chunkSize = Number.isFinite(options.chunkSize) ? Math.max(1, options.chunkSize) : 10;
    const yieldMs = Number.isFinite(options.yieldMs) ? Math.max(0, options.yieldMs) : 16;
    const results = [];

    for (let index = 0; index < queue.length; index += 1) {
      const item = queue[index];
      const result = typeof handler === 'function'
        ? await Promise.resolve().then(() => handler.call(context, item, index, queue))
        : item;
      results.push(result);
      if ((index + 1) % chunkSize === 0 && index < queue.length - 1) {
        await yieldEveryN(yieldMs);
      }
    }

    return results;
  }

  async function splitWorkByFrame(workItems, handler, options = {}) {
    return processChunk(workItems, handler, options);
  }

  async function executeMicroTaskQueue(tasks, options = {}) {
    const queue = Array.isArray(tasks) ? tasks.filter((task) => typeof task === 'function') : [];
    const budgetMs = Number.isFinite(options.budgetMs) ? Math.max(1, options.budgetMs) : 30;
    const yieldMs = Number.isFinite(options.yieldMs) ? Math.max(0, options.yieldMs) : 30;
    let lastYield = Date.now();
    const results = [];

    for (let index = 0; index < queue.length; index += 1) {
      const task = queue[index];
      const result = await Promise.resolve().then(() => task.call(context, {
        index,
        total: queue.length,
        context
      }));
      results.push(result);
      if (Date.now() - lastYield >= budgetMs && index < queue.length - 1) {
        lastYield = Date.now();
        await yieldEveryN(yieldMs);
      }
    }

    return results;
  }

  function startXRRenderPipeline(options = {}) {
    const loadStarScene = typeof options.loadStarScene === 'function' ? options.loadStarScene : null;
    const loadMeridianScene = typeof options.loadMeridianScene === 'function' ? options.loadMeridianScene : null;
    const renderInWorldSpace = typeof options.renderInWorldSpace === 'function' ? options.renderInWorldSpace : null;
    const onStart = typeof options.onStart === 'function' ? options.onStart : null;
    const onComplete = typeof options.onComplete === 'function' ? options.onComplete : null;

    if (!worldLifecycleBound) {
      worldLifecycleBound = true;
      bus.emit('AR_WORLD_INIT');
      bus.on('APP_SHOW', safeRuntimeGuard(() => {
        bus.emit('AR_WORLD_RESUME');
      }, 'APP_SHOW'));
      bus.on('APP_HIDE', safeRuntimeGuard(() => {
        persistence.saveWorld({
          anchors: spatialStore.getAllAnchors(),
          userPose: spatialStore.getUserPose()
        });
        cloud.syncNow();
        bus.emit('AR_WORLD_PAUSE');
      }, 'APP_HIDE'));
      bus.on('APP_SHOW', safeRuntimeGuard(() => {
        const remote = cloud.downloadWorld();
        if (remote) {
          bus.emit('AR_WORLD_REMOTE_SYNC', remote);
        }
      }, 'APP_SHOW_REMOTE_SYNC'));
    }

    attachWorldRenderer(bus);

    if (!xrTriggerBound) {
      xrTriggerBound = true;
      bus.on('XR_USER_TRIGGER', safeRuntimeGuard(() => {
        pilotLog('[XR START PIPELINE]');
        ritual.startRitual();
        bus.emit('USER_POSE_UPDATE_INIT');
      }, 'XR_USER_TRIGGER'));
    }

    if (renderInWorldSpace && !spatialRelicRenderBound) {
      spatialRelicRenderBound = true;
      bus.on('RELIC_CREATED', (relic) => {
        XR_SAFE_RENDER(() => renderInWorldSpace(relic && relic.position ? relic.position : null, relic), {
          ...relic,
          kind: 'world object'
        });
      });
    } else if (!renderInWorldSpace && !spatialRelicRenderBound) {
      spatialRelicRenderBound = true;
      bus.on('RELIC_CREATED', (relic) => {
        XR_SAFE_RENDER(() => renderStarInRealSpace({
          position: relic && relic.position ? relic.position : null,
          anchor: relic && relic.id ? relic.id : null
        }), {
          ...relic,
          kind: 'world object'
        });
      });
    }

    return new Promise((resolve, reject) => {
      yieldToFrame().then(() => {
        if (onStart) {
          onStart();
        }

        Promise.resolve()
          .then(() => (loadStarScene ? loadStarScene() : null))
          .then(() => {
            scheduleNextFrame(() => {
              Promise.resolve()
                .then(() => (loadMeridianScene ? loadMeridianScene() : null))
                .then(() => {
                  if (onComplete) {
                    onComplete();
                  }
                  resolve({
                    started: true
                  });
                })
                .catch((error) => {
                  handleXRFailure('render_pipeline_failed', error, {
                    stage: 'meridian'
                  });
                  reject(error);
                });
            });
          })
          .catch((error) => {
            handleXRFailure('render_pipeline_failed', error, {
              stage: 'star'
            });
            reject(error);
          });
      });
    });
  }

  function startXRPipeline(payload = {}) {
    bindXRPipeline();
    bus.emit('XR_START_PIPELINE', payload);
    return getXRState();
  }

  /**
   * 带稳定性加固的 XR 启动入口。
   * 使用 xrStability.executeXRInit 包装，含重试（800ms/1500ms/2500ms）
   * / 超时（6s）/ 设备检测 / fallback UI。
   *
   * @param {object} payload
   * @returns {Promise<{status: string, mode: string, reason: string}>}
   */
  function startXRPipelineStable(payload) {
    payload = payload || {};

    function buildPipelineFn() {
      return new Promise(function (resolve, reject) {
        bindXRPipeline();
        resetXRReadiness();
        setXRState(XR_STATE.INIT, {
          source: payload && payload.source ? payload.source : 'entry_button'
        });
        scheduleXRFailure();

        yieldToFrame().then(function () {
          startXRRenderPipeline({
            loadStarScene: function () {
              if (xrContext.worldEngine && typeof xrContext.worldEngine.start === 'function') {
                return Promise.resolve().then(function () { return xrContext.worldEngine.start(); });
              }
              return null;
            },
            loadMeridianScene: function () {
              if (typeof xrContext.cameraStarter === 'function') {
                return Promise.resolve().then(function () { return xrContext.cameraStarter(payload); });
              }
              return null;
            },
            renderInWorldSpace: function (position, relic) {
              return XR_SAFE_RENDER(function () {
                bus.emit('XR_RENDER_WORLD_SPACE', {
                  position: position || (relic && relic.position) || null,
                  relic: relic || null
                });
                return true;
              }, relic);
            }
          }).then(function (res) {
            if (!xrUserTriggerEmitted) {
              xrUserTriggerEmitted = true;
              bus.emit('XR_USER_TRIGGER', {
                source: 'pipeline',
                readiness: Object.assign({}, xrReadyFlags)
              });
            }
            resolve(res);
          }).catch(function (err) {
            reject(err);
          });
        });
      });
    }

    return xrStability.executeXRInit({
      pipeline: buildPipelineFn,
      pageCtx: pageCtx,
      onAttempt: function (attempt, maxRetry) {
        bus.emit('XR_STATE_CHANGE', {
          previous: xrState,
          state: XR_STATE.INIT,
          detail: {
            attempt: attempt,
            maxRetry: maxRetry,
            source: payload && payload.source ? payload.source : 'entry_button'
          }
        });
      }
    }).then(function (result) {
      xrStabilityResult = result;
      xrStability.broadcastXRResult(bus, result);

      if (result.status === 'success') {
        setXRState(XR_STATE.RUNNING, {
          mode: result.mode,
          reason: result.reason
        });
      } else {
        if (xrState !== XR_STATE.FAILED && xrState !== XR_STATE.RUNNING) {
          clearXRReadyTimeout();
          setXRState(XR_STATE.FAILED, {
            reason: result.reason || 'stability_fallback',
            mode: result.mode,
            stabilityResult: result
          });
        }
      }

      return result;
    });
  }

  function getXRState() {
    return {
      state: xrState,
      readiness: {
        ...xrReadyFlags
      },
      contextBound: xrContextBound,
      stability: xrStabilityResult
    };
  }

  function scheduler() {
    if (running) {
      return api;
    }
    running = true;
    if (scheduled) {
      return api;
    }
    scheduled = true;
    (async () => {
      await yieldToFrame();
      for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index];
        await scheduleStep(step, step.delayMs);
        await yieldToFrame();
      }
    })();
    return api;
  }

  const api = {
    queueStep,
    executeStepAsync,
    executeMicroTaskQueue,
    processChunk,
    splitWorkByFrame,
    yieldToFrame,
    yieldToNextFrame,
    yieldEveryN,
    scheduleNextFrame,
    scheduleStep,
    bindXRContext,
    SAFE_RUNTIME_GUARD: safeRuntimeGuard,
    startXRPipeline,
    startXRPipelineStable,
    XR_START_PIPELINE: startXRPipeline,
    XR_STATE,
    getXRState,
    startXRRenderPipeline,
    scheduler,
    getXRErrorLog: xrStability.getXRErrorLog,
    clearXRErrorLog: xrStability.clearXRErrorLog
  };

  return api;
}

module.exports = {
  createRuntimeBuilder
};
