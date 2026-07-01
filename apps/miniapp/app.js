const brand = require('./config/brand.v1');

// ════════════════════════════════════════════════════════════════
// V5.9.22 — BOOT TRACE & SAFE MODE
// ════════════════════════════════════════════════════════════════
console.log('[BOOT TRACE] app launch start — ' + new Date().toISOString());

// ════════════════════════════════════════════════════════════════
// V5.9.22 — WASM SUPPORT DETECTION (EARLY GUARD)
//
// Run before any AR/XR module loads. If WebAssembly is unavailable,
// set a global flag that all AR-related modules MUST check before
// attempting WASM-dependent operations.
//
// This prevents startup timeout caused by AR engine blocking on
// unsupported WASM environment at boot.
// ════════════════════════════════════════════════════════════════
if (typeof WebAssembly === 'undefined' || typeof WebAssembly.instantiate !== 'function') {
  console.warn('[WASM GUARD] WebAssembly not supported — switching to fallback mode');
  globalThis.__AR_WASM_DISABLED__ = true;
} else {
  globalThis.__AR_WASM_DISABLED__ = false;
}

// ─── Boot lock guard (prevents double init if onLaunch re-enters) ───
var __bootLock = false;

// ─── BOOTING FLAG — blocks all navigation during startup ───
// Set true at boot start. Released ONLY after first page's
// onReady + nextTick completes (meaning all setData and DOM
// updates have been flushed).
//
// safeNavigate() MUST check globalThis.__BOOT_READY__ and
// block ALL navigation until first page is fully stable.
globalThis.__BOOTING__ = true;
globalThis.__BOOT_READY__ = false;
globalThis.__UI_FROZEN__ = false;


// ─── Global boot promise (diagnostic hook, NOT consumed by WeChat framework) ───
// WeChat Mini Program does NOT await this — it's a diagnostic signal
// that external code can use to know when app.js boot sequence completed.
var __bootReadyResolver = null;
globalThis.__BOOT_PROMISE = new Promise(function(resolve) {
  __bootReadyResolver = resolve;
});

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
// BOOT SEQUENCE — Synchronous module initialization
//
// IMPORTANT:
// WeChat Mini Program requires synchronous boot. onLaunch CANNOT be async.
// All require() calls here are synchronous and MUST complete before App() is called.
// The bootReadyResolver is a diagnostic signal, NOT consumed by the WeChat framework.
//
// ════════════════════════════════════════════════════════════════

// ─── BOOT_SAFE_MODE flag ───
var BOOT_SAFE_MODE = globalThis.__BOOT_SAFE_MODE__ === true;

if (BOOT_SAFE_MODE) {
  console.log('[BOOT TRACE] SAFE MODE ACTIVE — skipping non-critical modules');
}

// ════════════════════════════════════════════════════════════════
// LEVEL 0: Visual Bible Enforcer (ABSOLUTE HIGHEST PRIORITY)
//
// Boots BEFORE all other systems. Sets globalThis.__VISUAL_BIBLE_BOOTED__.
// ALL visual tokens and component styles are validated against this.
// See: docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md
// See: docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1.md
// ════════════════════════════════════════════════════════════════
if (!BOOT_SAFE_MODE) {
  console.time('[BOOT TRACE] visual bible');
  try {
    var visualBibleEnforcer = require('./core/visual/visual_bible_enforcer');
    visualBibleEnforcer.bootVisualBibleEnforcer();
    console.log('[BOOT TRACE] visual bible enforcer booted OK');
  } catch (e) {
    console.log('[BOOT TRACE] visual bible enforcer skipped:', e.message);
  }
  console.timeEnd('[BOOT TRACE] visual bible');
}

console.log('[BOOT TRACE] === BOOT SEQUENCE START ===');

// STEP 1: Load world seed data
console.time('[BOOT TRACE] seed load');
var _seed;
try {
  _seed = require('./data/world_seed_v1');
  if (!_seed || !_seed.explore_points || _seed.explore_points.length === 0) {
    throw new Error('seed module is empty');
  }
  globalThis.__SAFE_MODE__ = false;
  console.log('[BOOT TRACE] seed loaded OK (' + (_seed.explore_points ? _seed.explore_points.length : 0) + ' points)');
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
console.timeEnd('[BOOT TRACE] seed load');

// STEP 2: Boot world_runtime_store
console.time('[BOOT TRACE] store boot');
var WORLD_RUNTIME_STORE;
try {
  WORLD_RUNTIME_STORE = require('./core/runtime/world_runtime_store');
  WORLD_RUNTIME_STORE.bootWorldRuntimeStore();
  console.log('[BOOT TRACE] store booted OK');
} catch (e) {
  console.error('[V5.9.16] world_runtime_store boot failed:', e.message);
  WORLD_RUNTIME_STORE = null;
}
console.timeEnd('[BOOT TRACE] store boot');

// STEP 3: Inject visual system
console.time('[BOOT TRACE] visual injector');
var VISUAL_INJECTOR;
try {
  VISUAL_INJECTOR = require('./core/visual/global_visual_injector');
  VISUAL_INJECTOR.bootGlobalVisualInjector();
  console.log('[BOOT TRACE] visual injector booted OK');
} catch (e) {
  console.error('[V5.9.16] visual injector boot failed:', e.message);
  VISUAL_INJECTOR = null;
}
console.timeEnd('[BOOT TRACE] visual injector');

// STEP 4: Boot component registry
console.time('[BOOT TRACE] component registry');
try {
  var COMPONENT_GUARD = require('./core/component/component_resolver_guard');
  COMPONENT_GUARD.bootComponentRegistry();
  console.log('[BOOT TRACE] component registry booted OK');
} catch (e) {
  console.log('[BOOT TRACE] component registry skipped (non-critical):', e.message);
}
console.timeEnd('[BOOT TRACE] component registry');

// ════════════════════════════════════════════════════════════════
// ENTRY SYSTEM GATE
//
// HARD TIMEOUT: If store fails or hangs, force fallback unlock
// within 2 seconds so the landing page never stays in pending flow.
// ════════════════════════════════════════════════════════════════

var ENTRY_TIMEOUT_MS = 2000;
var _entryResolved = false;

/**
 * Compute entry state — forced determination that always produces
 * a ready state so the landing page can render regardless of store health.
 */
function computeEntryState(store) {
  try {
    if (store && typeof store.hasWorldEntered === 'function' && store.hasWorldEntered()) {
      return {
        entryReady: true,
        hasLoginGate: true,
        worldMode: 'entered'
      };
    }
  } catch (e) {
    console.warn('[ENTRY SYSTEM] computeEntryState error:', e.message);
  }
  return {
    entryReady: true,
    hasLoginGate: true,
    worldMode: 'landing_active'
  };
}

function resolveEntrySystem(state) {
  if (_entryResolved) return;
  _entryResolved = true;

  globalThis.__ENTRY_STATE__ = state;
  globalThis.__ENTRY_STATE__.flow = state.worldMode === 'entered' ? 'entered' : 'landing';

  console.log('[ENTRY SYSTEM] resolved — flow:', globalThis.__ENTRY_STATE__.flow, 'mode:', state.worldMode);
}

console.time('[BOOT TRACE] entry system');
(function _initEntrySystem() {
  globalThis.__ENTRY_STATE__ = {
    flow: 'pending'
  };

  // HARD TIMEOUT — forces fallback unlock within 2 seconds
  setTimeout(function () {
    if (!_entryResolved) {
      console.warn('[ENTRY SYSTEM] forced fallback unlock triggered');
      console.log('[TIMEOUT TRACE] entry system hard timeout fired — ' + Date.now());
      resolveEntrySystem({
        entryReady: true,
        hasLoginGate: true,
        worldMode: 'fallback'
      });
    }
  }, ENTRY_TIMEOUT_MS);

  try {
    var store = require('./core/runtime/world_runtime_store');
    var entryState = computeEntryState(store);
    resolveEntrySystem(entryState);
    console.log('[ENTRY DEBUG] entryState:', JSON.stringify(entryState));
    console.log('[TIMEOUT TRACE] entry system resolved synchronously — ' + Date.now());
  } catch (e) {
    console.warn('[ENTRY SYSTEM] init failed:', e.message);
    resolveEntrySystem({
      entryReady: true,
      hasLoginGate: true,
      worldMode: 'fallback'
    });
    globalThis.__SAFE_MODE__ = true;
  }
})();
console.timeEnd('[BOOT TRACE] entry system');

// ════════════════════════════════════════════════════════════════
// V5.9.22 — AR EVENT ENGINE BOOT (SKIP IN SAFE MODE)
//
// FIRE-AND-FORGET: AR engine init MUST NEVER block UI rendering.
// If WASM is unavailable, skip entirely.
// If init fails, only log — never throw.
// ════════════════════════════════════════════════════════════════
console.time('[BOOT TRACE] AR event engine');
if (BOOT_SAFE_MODE || globalThis.__AR_WASM_DISABLED__ === true) {
  if (BOOT_SAFE_MODE) {
    console.log('[BOOT TRACE] SAFE MODE: skipping AR event engine');
  } else {
    console.log('[BOOT TRACE] WASM DISABLED: skipping AR event engine');
  }
} else {
  try {
    var arEventProcessor = require('./core/event/ar-event-processor');
    arEventProcessor.initArEventProcessor();
    console.log('[BOOT TRACE] AR event engine booted OK');
  } catch (e) {
    console.warn('[AR EVENT ENGINE] boot failed (non-blocking):', e.message);
  }
}
console.timeEnd('[BOOT TRACE] AR event engine');

// ─── RESOLVE BOOT PROMISE (diagnostic only) ───
if (typeof __bootReadyResolver === 'function') {
  __bootReadyResolver();
}
console.log('[BOOT TRACE] === BOOT SEQUENCE COMPLETE ===');
console.log('[TIMEOUT TRACE] boot sequence complete — ' + Date.now());

// ════════════════════════════════════════════════════════════════
// App instance
//
// CRITICAL: onLaunch is SYNCHRONOUS. WeChat Mini Program framework
// does not support async onLaunch. Making it async would cause
// undefined behavior and potential timeout.
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// App instance
//
// CRITICAL: onLaunch is SYNCHRONOUS. WeChat Mini Program framework
// does not support async onLaunch. Making it async would cause
// undefined behavior and potential timeout.
// ════════════════════════════════════════════════════════════════
App({
  globalData: {
    appName: brand.productName,
    systemInfo: null,
    worldSeed: _seed,
    safeMode: globalThis.__SAFE_MODE__,
    worldRuntimeStore: WORLD_RUNTIME_STORE,
    visualInjector: VISUAL_INJECTOR
  },

  onLaunch: function _onLaunch() {
    if (__bootLock) {
      console.log('[BOOT TRACE] BOOT LOCK — ignoring re-entrant onLaunch');
      console.log('[TIMEOUT TRACE] onLaunch re-entrant — ' + Date.now());
      return;
    }
    __bootLock = true;

    console.log('[BOOT TRACE] onLaunch start');
    console.log('[TIMEOUT TRACE] onLaunch entered — ' + Date.now());
    globalThis.__APP_LAUNCHED__ = Date.now();
    globalThis.__BOOT_STATE__.launched = true;

    // ─── Store accessor: getApp().store.getState() — canonical world state ───
    var self = this;
    if (WORLD_RUNTIME_STORE) {
      self.store = {
        getState: function () {
          try {
            var points = WORLD_RUNTIME_STORE.getAllPoints ? WORLD_RUNTIME_STORE.getAllPoints() : [];
            var relics = WORLD_RUNTIME_STORE.getAllRelics ? WORLD_RUNTIME_STORE.getAllRelics() : [];
            var rights = WORLD_RUNTIME_STORE.getAllRights ? WORLD_RUNTIME_STORE.getAllRights() : [];
            var userWorldState = WORLD_RUNTIME_STORE.getUserWorldState ? WORLD_RUNTIME_STORE.getUserWorldState() : {};
            var hasEntered = WORLD_RUNTIME_STORE.hasWorldEntered ? WORLD_RUNTIME_STORE.hasWorldEntered() : false;
            return {
              point: points,
              relic: relics,
              rights: rights,
              pointList: points,
              relicList: relics,
              rightsList: rights,
              journeyProgress: userWorldState.journeyProgress || 0,
              userState: {
                isGuest: !hasEntered,
                hasEnteredWorld: hasEntered,
                visitedPoints: userWorldState.visitedPoints || [],
                discoveredRelics: userWorldState.discoveredRelics || 0,
                claimedRights: userWorldState.claimedRights || 0
              }
            };
          } catch (e) {
            console.warn('[APP STORE] getState error:', e.message);
            return null;
          }
        }
      };
    }
    console.log('[BOOT TRACE] onLaunch complete');
    console.log('[TIMEOUT TRACE] onLaunch complete — ' + Date.now());
  },

  onError: function _onError(error) {
    console.error('[app.onError]', error);
    return true;
  },

  onUnhandledRejection: function _onUnhandledRejection(res) {
    console.error('[app.onUnhandledRejection]', res);
  }
});
