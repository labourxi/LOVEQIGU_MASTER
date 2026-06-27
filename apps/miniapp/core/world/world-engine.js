const bus = require('../../services/xr/xr-event-bus.js');
const { generateRelic } = require('../../services/xr/relic-generator.js');
const { stabilize } = require('../../services/ar/ar-stabilizer.js');
const spatialStore = require('../../services/ar/ar-spatial-store.js');
const persistence = require('../../services/ar/ar-persistence-store.js');

const PILOT_MODE = true;

function createWorldEngine(options = {}) {
  const eventBus = options.bus || bus;
  let starSystem = options.starSystem || null;
  let meridianSystem = options.meridianSystem || null;
  const runtimeBuilder = options.runtimeBuilder || null;

  let artifactState = { status: 'idle', records: [] };
  const subscriptions = [];
  const processedAnchorIds = new Set();
  const processedRelicIds = new Set();

  // 默认初始化 XR 生命周期对象（避免 undefined 进入 lifecycle）
  let sceneRef = null;
  let cameraRef = null;
  let markerRef = null;

  function ensureStarSystem() {
    if (!starSystem) {
      const { createStarSystem } = require('./star-system.js');
      starSystem = createStarSystem();
    }
    return starSystem;
  }

  function ensureMeridianSystem() {
    if (!meridianSystem) {
      const { createMeridianSystem } = require('./meridian-system.js');
      meridianSystem = createMeridianSystem();
    }
    return meridianSystem;
  }

  function on(event, handler) {
    const off = eventBus.on(event, safeRuntimeGuard(handler, event));
    subscriptions.push(off);
  }

  function safeRuntimeGuard(handler, label) {
    return function guarded(payload) {
      try {
        return handler.call(this, payload);
      } catch (error) {
        if (!PILOT_MODE && typeof console !== 'undefined' && console.error) {
          console.error('[WORLD_RUNTIME_ERROR]', label, error);
        }
        eventBus.emit('XR_FAILED', {
          state: 'FAILED',
          reason: 'world_runtime_error',
          label,
          error: error && error.message ? error.message : null
        });
        return null;
      }
    };
  }

  function publish() {
    eventBus.emit('world:updated', getSnapshot());
  }

  function handleDetected(payload) {
    artifactState = {
      status: 'detected',
      records: artifactState.records.concat({
        type: 'ar:detected',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleActive(payload) {
    ensureStarSystem().lightNext();
    artifactState = {
      status: 'star_lighted',
      records: artifactState.records.concat({
        type: 'star_light',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleLost(payload) {
    ensureMeridianSystem().flowNext();
    artifactState = {
      status: 'meridian_flow',
      records: artifactState.records.concat({
        type: 'meridian_flow',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleRelicSpawn(payload) {
    artifactState = {
      status: 'relic_spawn',
      records: artifactState.records.concat({
        type: 'relic_spawn',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleXrUserTrigger(payload) {
    initStarSystem(runtimeBuilder);
    initMeridianSystem(runtimeBuilder);
    if (runtimeBuilder && typeof runtimeBuilder.startXRRenderPipeline === 'function') {
      runtimeBuilder.startXRRenderPipeline({
        loadStarScene() {
          return ensureStarSystem();
        },
        loadMeridianScene() {
          return ensureMeridianSystem();
        },
        renderInWorldSpace(position, relic) {
          eventBus.emit('XR_RENDER_WORLD_SPACE', {
            position: position || (relic && relic.position) || null,
            relic: relic || null
          });
        }
      }).catch(() => {
        eventBus.emit('XR_FAILED', {
          state: 'FAILED',
          reason: 'render_pipeline_failed'
        });
      });
    }
    artifactState = {
      status: 'xr_user_trigger',
      records: artifactState.records.concat({
        type: 'XR_USER_TRIGGER',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleStarLighted(payload) {
    artifactState = {
      status: 'star_lighted',
      records: artifactState.records.concat({
        type: 'STAR_LIGHTED',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleRelicCreated(payload) {
    const relicId = payload && payload.id ? payload.id : null;
    if (relicId && processedRelicIds.has(relicId)) {
      return;
    }
    if (relicId) {
      processedRelicIds.add(relicId);
    }
    artifactState = {
      status: 'relic_created',
      records: artifactState.records.concat({
        type: 'RELIC_CREATED',
        payload,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function bootstrapWorld() {
    const saved = persistence.loadWorld();
    if (!saved) {
      return;
    }

    if (saved.userPose) {
      spatialStore.updateUserPose(saved.userPose);
    }

    Object.keys(saved.anchors || {}).forEach((id) => {
      spatialStore.addAnchor(id, saved.anchors[id]);
    });
  }

  function mergeRemoteWorld(data) {
    if (!data || typeof data !== 'object') {
      return;
    }

    const anchors = data.anchors || {};
    Object.keys(anchors).forEach((id) => {
      spatialStore.addAnchor(id, anchors[id]);
    });

    if (data.userPose) {
      spatialStore.updateUserPose(data.userPose);
    }
  }

  function mapToWorld(marker) {
    const basis = String(marker && marker.id ? marker.id : 'star_unknown');
    let hash = 0;
    for (let index = 0; index < basis.length; index += 1) {
      hash = (hash * 31 + basis.charCodeAt(index)) % 1000;
    }
    return {
      x: Number(((hash % 120) / 100).toFixed(2)),
      y: 0,
      z: Number((((hash >> 2) % 120) / 100).toFixed(2))
    };
  }

  function handleArMarkerDetected(markers) {
    const list = Array.isArray(markers) ? markers : [];
    const cleanMarkers = stabilize(list);
    cleanMarkers.forEach((marker) => {
      const position = mapToWorld(marker);
      const anchor = {
        starId: marker && marker.id ? marker.id : 'star_unknown',
        position
      };
      eventBus.emit('STAR_SPACE_ANCHOR', anchor);
    });
    artifactState = {
      status: 'ar_marker_detected',
      records: artifactState.records.concat({
        type: 'AR_MARKER_DETECTED',
        payload: cleanMarkers,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function handleStarSpaceAnchor(data) {
    if (data && data.starId) {
      if (processedAnchorIds.has(data.starId)) {
        return;
      }
      processedAnchorIds.add(data.starId);
      spatialStore.addAnchor(data.starId, data.position || null);
      bus.emit('STAR_LIGHTED', {
        ...data,
        persistent: true
      });
    }
    artifactState = {
      status: 'star_space_anchor',
      records: artifactState.records.concat({
        type: 'STAR_SPACE_ANCHOR',
        payload: data,
        at: new Date().toISOString()
      })
    };
    publish();
  }

  function start() {
    if (subscriptions.length > 0) {
      eventBus.emit('XR_READY', {
        source: 'world',
        state: 'READY'
      });
      return getSnapshot();
    }
    bootstrapWorld();
    on('XR_USER_TRIGGER', handleXrUserTrigger);
    on('AR_MARKER_DETECTED', handleArMarkerDetected);
    on('STAR_SPACE_ANCHOR', handleStarSpaceAnchor);
    on('STAR_LIGHTED', handleStarLighted);
    on('RELIC_CREATED', handleRelicCreated);
    on('AR_WORLD_INIT', bootstrapWorld);
    on('AR_WORLD_REMOTE_SYNC', mergeRemoteWorld);
    on('ar:detected', handleDetected);
    on('ar:active', handleActive);
    on('ar:lost', handleLost);
    on('relic_spawn', handleRelicSpawn);
    eventBus.emit('XR_READY', {
      source: 'world',
      state: 'READY'
    });
    return getSnapshot();
  }

  function initStarSystem(builder) {
    const shell = ensureStarSystem();
    const queueBuilder = builder || runtimeBuilder || null;
    if (shell && typeof shell.buildAsync === 'function') {
      shell.buildAsync(queueBuilder);
    }
    return getSnapshot();
  }

  function initMeridianSystem(builder) {
    const shell = ensureMeridianSystem();
    const queueBuilder = builder || runtimeBuilder || null;
    if (shell && typeof shell.buildAsync === 'function') {
      shell.buildAsync(queueBuilder);
    }
    return getSnapshot();
  }

  function stop() {
    while (subscriptions.length > 0) {
      const off = subscriptions.pop();
      if (typeof off === 'function') {
        off();
      }
    }
    processedAnchorIds.clear();
    processedRelicIds.clear();

    // ★ 安全销毁 XR 引用对象 ★
    if (typeof sceneRef !== 'undefined' && sceneRef !== null && typeof sceneRef.destroy === 'function') {
      try { sceneRef.destroy(); } catch (e) { /* ignore */ }
    }
    if (typeof cameraRef !== 'undefined' && cameraRef !== null && typeof cameraRef.destroy === 'function') {
      try { cameraRef.destroy(); } catch (e) { /* ignore */ }
    }
    if (typeof markerRef !== 'undefined' && markerRef !== null && typeof markerRef.destroy === 'function') {
      try { markerRef.destroy(); } catch (e) { /* ignore */ }
    }

    sceneRef = null;
    cameraRef = null;
    markerRef = null;

    return getSnapshot();
  }

  function getSnapshot() {
    return {
      star: starSystem ? starSystem.getSnapshot() : null,
      meridian: meridianSystem ? meridianSystem.getSnapshot() : null,
      artifact: artifactState
    };
  }

  return {
    start,
    initStarSystem,
    initMeridianSystem,
    bootstrapWorld,
    mergeRemoteWorld,
    stop,
    getSnapshot
  };
}

module.exports = {
  createWorldEngine
};
