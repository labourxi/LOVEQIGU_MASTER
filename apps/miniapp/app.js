const brand = require('./config/brand.v1');

// ════════════════════════════════════════════════════════════════
// BOOT SEQUENCE GUARD
// UI renders first, async init happens after.
// ════════════════════════════════════════════════════════════════
globalThis.__BOOT_STATE__ = {
  launched: false,
  uiRendered: false,
  asyncReady: false
};

// ─── 全局运行时保护层 ───
globalThis.__SAFE_RUNTIME_ERROR__ = null;
globalThis.__SAFE_RUNTIME_GUARD__ = function (err) {
  try {
    console.error('SAFE RUNTIME ERROR:', err && err.message ? err.message : String(err));
    globalThis.__SAFE_RUNTIME_ERROR__ = { ts: Date.now(), msg: String(err && err.message ? err.message : err) };
  } catch (_) {}
  return true;
};
try {
  if (typeof wx !== 'undefined' && typeof wx.onError === 'function') {
    var origOnError = wx.onError;
    wx.onError = function (err) {
      globalThis.__SAFE_RUNTIME_GUARD__(err);
      if (typeof origOnError === 'function') {
        origOnError.call(wx, err);
      }
    };
  }
} catch (_) {}

// ════════════════════════════════════════════════════════════════
// WORLD SEED — loaded at module eval time, before App().
// Synchronous require() is safe here; no async or DOM dependency.
// If seed module is missing, safe fallback activates immediately.
// ════════════════════════════════════════════════════════════════
var _seed;
try {
  _seed = require('./data/world_seed_v1');
  if (!_seed || !_seed.explore_points || _seed.explore_points.length === 0) {
    throw new Error('seed module is empty');
  }
  globalThis.__SAFE_MODE__ = false;
} catch (e) {
  console.error('[CRITICAL] world seed module missing —', e.message || e);
  _seed = {
    explore_points: [],
    relics: [],
    collectibles: [],
    merchant_coupons: [],
    routes: [],
    meta: { version: 'safe-fallback', generatedAt: new Date().toISOString() },
    safeMode: true
  };
  globalThis.__SAFE_MODE__ = true;
}

// ════════════════════════════════════════════════════════════════
// App instance — minimal onLaunch, no async boot dependencies.
// ════════════════════════════════════════════════════════════════
App({
  globalData: {
    appName: brand.productName,
    systemInfo: null,
    worldSeed: _seed,
    safeMode: globalThis.__SAFE_MODE__
  },

  // Deferred async init — called from page onReady after first render.
  deferredInit: function _deferredInit() {
    if (globalThis.__BOOT_STATE__.asyncReady) return;
    globalThis.__BOOT_STATE__.asyncReady = true;

    try {
      this._initPlatformInfo();
    } catch (e) {
      console.error('[deferredInit] platform info error:', e);
    }
  },

  _initPlatformInfo: function _initPlatformInfo() {
    var info;
    try {
      var platformInfo = require('./utils/platform-info');
      // Synchronous safe fallback — no await, no setTimeout.
      info = platformInfo.getDeviceInfoSafe ? platformInfo.getDeviceInfoSafe() : null;
    } catch (e) {
      info = tryWxGetSystemInfo();
    }
    if (info) {
      this.globalData.systemInfo = info;
    }
  },

  onLaunch: function _onLaunch() {
    globalThis.__APP_LAUNCHED__ = Date.now();
    globalThis.__BOOT_STATE__.launched = true;
    // NO async calls here. UI must render first.
  },

  onError: function _onError(error) {
    console.error('[app.onError]', error);
    return true;
  },

  onUnhandledRejection: function _onUnhandledRejection(res) {
    console.error('[app.onUnhandledRejection]', res);
  }
});

// Helper: synchronous wx.getSystemInfoSync wrapped safely.
function tryWxGetSystemInfo() {
  try {
    if (typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function') {
      return wx.getSystemInfoSync();
    }
  } catch (_) {}
  return null;
}
