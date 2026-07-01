// ═════════════════════════════════════════════════════════════════════
// V5.9.16 — STORE ACCESSOR (shared helper for all pages)
//
// Provides safe access to world_runtime_store and visual_injector
// from any page context.
// ═════════════════════════════════════════════════════════════════════

function getStore() {
  try {
    var app = typeof getApp !== 'undefined' ? getApp() : null;
    return (app && app.globalData && app.globalData.worldRuntimeStore) || null;
  } catch (e) {
    return null;
  }
}

function getVisualInjector() {
  try {
    var app = typeof getApp !== 'undefined' ? getApp() : null;
    return (app && app.globalData && app.globalData.visualInjector) || null;
  } catch (e) {
    return null;
  }
}

function getWorldSeed() {
  try {
    var app = typeof getApp !== 'undefined' ? getApp() : null;
    return (app && app.globalData && app.globalData.worldSeed) || null;
  } catch (e) {
    return null;
  }
}

module.exports = {
  getStore: getStore,
  getVisualInjector: getVisualInjector,
  getWorldSeed: getWorldSeed
};
