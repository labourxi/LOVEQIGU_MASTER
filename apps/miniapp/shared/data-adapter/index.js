/**
 * LOVEQIGU unified data adapter entry.
 * mode: "mock" | "api" (api not implemented in Phase 2 Step 1)
 */
(function (global) {
  var mode = "mock";

  function resolve(name) {
    if (typeof require === "function") {
      try { return require("./" + name); } catch (e) { /* browser */ }
    }
    var map = {
      "mock-source": global.LQGMockSource,
      "status-map": global.LQGStatusMap,
      "role-map": global.LQGRoleMap,
      "adapter-session": global.LQGAdapterSessionStore,
      "user-app-adapter": global.LQGUserAppAdapter,
      "merchant-admin-adapter": global.LQGMerchantAdminAdapter,
      "park-admin-adapter": global.LQGParkAdminAdapter,
      "platform-admin-adapter": global.LQGPlatformAdminAdapter,
      "content-production-adapter": global.LQGContentProductionAdapter,
      "search-adapter": global.LQGSearchAdapter,
      "ar-runtime-bridge": global.LQGARRuntimeBridge || global.LQGARuntimeBridge || global.ARRuntimeBridge
    };
    return map[name];
  }

  function getMode() { return mode; }
  function setMode(next) {
    if (next === "mock" || next === "api") mode = next;
    return mode;
  }

  function createDataAdapter() {
    var statusMap = resolve("status-map") || {};
    var roleMap = resolve("role-map") || {};
    var sessionStore = resolve("adapter-session") || global.LQGAdapterSessionStore;
    var mockSource = resolve("mock-source");

    if (sessionStore && sessionStore.initSession && mockSource) {
      sessionStore.initSession({ mockSource: mockSource, mode: "sessionStorage" });
    }

    return {
      mode: mode,
      setMode: setMode,
      getMode: getMode,
      mockSource: resolve("mock-source"),
      session: sessionStore || {},
      userApp: resolve("user-app-adapter") || {},
      merchantAdmin: resolve("merchant-admin-adapter") || {},
      parkAdmin: resolve("park-admin-adapter") || {},
      platformAdmin: resolve("platform-admin-adapter") || {},
      contentProduction: resolve("content-production-adapter") || {},
      search: resolve("search-adapter") || {},
      arRuntimeBridge: resolve("ar-runtime-bridge") || global.LQGARRuntimeBridge || global.LQGARuntimeBridge || global.ARRuntimeBridge || {},
      status: { formatStatus: statusMap.formatStatus || function (s) { return { code: s, label: s }; } },
      role: { getRoleConfig: roleMap.getRoleConfig || function () { return null; }, getAllRoles: roleMap.getAllRoles || function () { return []; } }
    };
  }

  var dataAdapter = createDataAdapter();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = dataAdapter;
  }
  global.LoveqiguDataAdapter = dataAdapter;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
