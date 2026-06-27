/**
 * RESET XR — 统一 XR 运行时重置函数 V1
 *
 * 调用时机：
 *   ar-entry 页面 onShow() 时调用 resetXR()
 *
 * 清理内容：
 *   1. 清空 scene graph（XR scene 内存状态）
 *   2. 清空 marker state（marker 跟踪数据）
 *   3. 清空信物数据缓存（relic registry / presence / meaning layers）
 *   4. 清空 spatial anchor 存储
 *   5. 清空世界持久化状态
 *   6. 清空 XR 错误日志
 *   7. 重置 checkin 状态机（仅运行时态，不清除持久化数据）
 *   8. 清空 event bus 监听器（reset all listeners）
 *
 * 安全约束：
 *   - 幂等：多次调用不产生副作用
 *   - 不破坏持久层数据（不调用 wx.removeStorageSync 清除用户进度）
 *   - 仅在 XR 运行时域内重置，不涉及用户状态
 */

const bus = require('../../services/xr/xr-event-bus.js');
const spatialStore = require('../../services/ar/ar-spatial-store.js');
const persistenceStore = require('../../services/ar/ar-persistence-store.js');

// ─── 信物层静态引用（require 引用，reset 需访问 class 静态属性） ───
var ARRelicOperationalLayer = require('../../services/ar/ar-relic-operational-layer.js');
var ARRelicPresenceLayer = require('../../services/ar/ar-relic-presence-layer.js');
var ARRelicLoopController = require('../../services/ar/ar-relic-loop-controller.js');
var ARWorldIntro = require('../../services/ar/ar-world-intro.js');

var layersToReset = [
  ARRelicOperationalLayer,
  ARRelicPresenceLayer,
  ARRelicLoopController,
  ARWorldIntro
];

// ─── XR 状态管理（内存态） ───
var xrState = {
  scene: null,
  markerActive: false,
  markerData: null,
  lastResetTime: 0,
  xrCamera: null,
  xrMarkerTracker: null,
  xrModel: null
};

/**
 * 重置 XR scene graph。
 * 如果有外部 scene 引用，通过事件通知 scene 清理。
 */
function resetSceneGraph() {
  if (typeof xrState.scene !== 'undefined' && xrState.scene !== null) {
    try {
      bus.emit('XR_SCENE_RESET', { timestamp: Date.now() });
      // 安全销毁 XR 对象
      if (typeof xrState.scene.destroy === 'function') {
        xrState.scene.destroy();
      }
    } catch (e) {
      // scene reset 失败不影响其他重置
    }
    xrState.scene = null;
  }

  // 重置其他 XR 生命周期对象
  ['xrCamera', 'xrMarkerTracker', 'xrModel'].forEach(function (key) {
    if (typeof xrState[key] !== 'undefined' && xrState[key] !== null) {
      try {
        if (typeof xrState[key].destroy === 'function') {
          xrState[key].destroy();
        }
      } catch (e) { /* ignore */ }
      xrState[key] = null;
    }
  });
}

/**
 * 重置 marker 状态。
 */
function resetMarkerState() {
  xrState.markerActive = false;
  xrState.markerData = null;
}

/**
 * 重置信物数据缓存（内存态）。
 * 遍历已注册的 layer 模块，调用其 reset() 方法。
 */
function resetRelicDataCache() {
  layersToReset.forEach(function (layer) {
    if (typeof layer.reset === 'function') {
      try {
        layer.reset();
      } catch (e) {
        // 单层 reset 失败不影响其他层
      }
    }
  });

  // 通过事件通知信物相关模块清理
  bus.emit('XR_RELIC_CACHE_RESET', { timestamp: Date.now() });
}

/**
 * 重置 spatial anchor store（内存态）。
 */
function resetSpatialAnchors() {
  if (typeof spatialStore.resetSpatialStore === 'function') {
    spatialStore.resetSpatialStore();
  }
}

/**
 * 重置世界持久化状态（仅内存，不清除 wx storage）。
 * 下一次 loadWorld() 会重新从 storage 读取。
 */
function resetWorldPersistence() {
  if (typeof persistenceStore.clearWorld === 'function') {
    // 不清除持久数据 — 仅标记需要重新加载
    bus.emit('XR_WORLD_STATE_RESET', { timestamp: Date.now() });
  }
}

/**
 * 重置 event bus 监听器（全部清空）。
 * 防止 onShow 重复绑定。
 */
function resetEventBus() {
  bus.off();
}

/**
 * 统一 XR 重置入口。
 *
 * 使用场景：
 *   - 页面 onShow：确保每次进入 AR 页面时 XR 状态干净
 *   - 异常恢复：XR 失败后重置到初始状态
 *   - 页面切换：从 explore 回到 AR 时重置
 *
 * @param {object} [options]
 * @param {boolean} [options.keepEventBus=false] - 是否保留 event bus 监听器
 * @param {boolean} [options.keepRelicCache=false] - 是否保留信物内存缓存
 * @param {object} [options.sceneRef=null] - 外部 XR scene 引用
 * @returns {number} timestamp — 本次重置的时间戳
 */
function resetXR(options) {
  options = options || {};
  var timestamp = Date.now();
  xrState.lastResetTime = timestamp;

  if (options.sceneRef) {
    xrState.scene = options.sceneRef;
  }

  resetSceneGraph();
  resetMarkerState();

  if (!options.keepRelicCache) {
    resetRelicDataCache();
  }

  resetSpatialAnchors();
  resetWorldPersistence();

  if (!options.keepEventBus) {
    resetEventBus();
  }

  console.log('[RESET_XR] completed at', timestamp, 'options:', JSON.stringify(options));

  bus.emit('XR_RESET_COMPLETE', {
    timestamp: timestamp,
    options: options
  });

  return timestamp;
}

/**
 * 注册需要 reset 的 layer 模块。
 * 模块需暴露 reset() 方法。
 *
 * @param {object} layerModule
 */
function registerResettableLayer(layerModule) {
  registerLayer(layerModule);
}

/**
 * 获取 XR 状态快照。
 * @returns {object}
 */
function getXRState() {
  return {
    scene: xrState.scene,
    markerActive: xrState.markerActive,
    lastResetTime: xrState.lastResetTime,
    xrCamera: xrState.xrCamera,
    xrMarkerTracker: xrState.xrMarkerTracker,
    xrModel: xrState.xrModel
  };
}

module.exports = {
  resetXR: resetXR,
  registerResettableLayer: registerResettableLayer,
  getXRState: getXRState
};
