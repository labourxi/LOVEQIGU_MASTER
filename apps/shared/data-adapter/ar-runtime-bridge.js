/**
 * LOVEQIGU AR Runtime Bridge — Phase 3 mock implementation.
 * No real AR SDK, camera, or location. Business state stays in user-app-adapter.
 */
(function (global) {
  var BRIDGE_STATES = [
    "IDLE", "DETECTING", "PERMISSION_REQUESTING", "READY", "STARTING",
    "SCANNING", "RECOGNIZED", "COMPLETED", "FALLBACK_READY", "FALLBACK_COMPLETED",
    "FAILED", "DISPOSED"
  ];

  var DEFAULT_CAPABILITIES = {
    camera: true,
    location: true,
    motion: false,
    webgl: true,
    canvas: true,
    arSupported: false,
    fallbackRecommended: true,
    network: "GOOD",
    recommendedMode: "FALLBACK"
  };

  var ERROR_MESSAGES = {
    CAMERA_DENIED: { statusLabel: "摄像头未授权", message: "请允许摄像头权限，或使用备用显现流程" },
    CAMERA_UNAVAILABLE: { statusLabel: "摄像头不可用", message: "当前设备无法使用摄像头" },
    LOCATION_DENIED: { statusLabel: "定位未授权", message: "请允许定位，或使用现场二维码完成验证" },
    LOCATION_OUT_OF_RANGE: { statusLabel: "不在范围内", message: "当前不在探索点范围内" },
    AR_NOT_SUPPORTED: { statusLabel: "设备不支持", message: "当前设备暂不支持 AR，可使用备用显现" },
    AR_RESOURCE_LOAD_FAILED: { statusLabel: "资源加载失败", message: "AR 资源加载失败，请稍后重试" },
    AR_SCAN_TIMEOUT: { statusLabel: "显现超时", message: "显现超时，请重试或使用备用流程" },
    AR_CREDENTIAL_INVALID: { statusLabel: "凭证无效", message: "显现凭证无效，请重新扫描" },
    AR_SESSION_NOT_FOUND: { statusLabel: "会话不存在", message: "未找到 AR 会话" },
    AR_SESSION_EXPIRED: { statusLabel: "会话已过期", message: "AR 会话已过期，请重新开始" },
    AR_ALREADY_COMPLETED: { statusLabel: "已完成", message: "该显现流程已完成" },
    FALLBACK_NOT_ALLOWED: { statusLabel: "不允许备用流程", message: "当前探索点不允许备用流程" },
    NETWORK_ERROR: { statusLabel: "网络异常", message: "网络异常，请稍后重试" },
    UNKNOWN_AR_ERROR: { statusLabel: "显现异常", message: "显现过程出现异常，请稍后重试" }
  };

  var mockCapabilities = cloneCaps(DEFAULT_CAPABILITIES);
  var bridgeState = createBridgeState("IDLE");
  var forceCameraDeniedNext = false;

  function nowIso() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + "+08:00";
  }

  function cloneCaps(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function createBridgeState(state) {
    return {
      state: state,
      lastSessionId: null,
      lastError: null,
      lastMode: null,
      updatedAt: nowIso()
    };
  }

  function setBridgeState(state, extras) {
    bridgeState.state = state;
    bridgeState.updatedAt = nowIso();
    if (extras) {
      if (extras.lastSessionId !== undefined) bridgeState.lastSessionId = extras.lastSessionId;
      if (extras.lastError !== undefined) bridgeState.lastError = extras.lastError;
      if (extras.lastMode !== undefined) bridgeState.lastMode = extras.lastMode;
    }
  }

  function mergeCapabilities(override) {
    var caps = cloneCaps(mockCapabilities);
    if (override && typeof override === "object") {
      Object.keys(override).forEach(function (key) {
        caps[key] = override[key];
      });
    }
    caps.recommendedMode = (caps.arSupported && caps.camera) ? "AR" : "FALLBACK";
    if (!caps.arSupported || !caps.camera) {
      caps.fallbackRecommended = true;
    }
    return caps;
  }

  function normalizeARError(error) {
    var code = "UNKNOWN_AR_ERROR";
    if (error) {
      if (typeof error === "string") code = error;
      else if (error.errorCode) code = error.errorCode;
      else if (error.code) code = error.code;
      else if (error.message && ERROR_MESSAGES[error.message]) code = error.message;
    }
    if (!ERROR_MESSAGES[code]) code = "UNKNOWN_AR_ERROR";
    var meta = ERROR_MESSAGES[code];
    return {
      ok: false,
      errorCode: code,
      statusLabel: meta.statusLabel,
      message: meta.message
    };
  }

  function detectDeviceCapabilities(options) {
    options = options || {};
    setBridgeState("DETECTING");
    var caps = mergeCapabilities(options.override);
    var nextState = caps.recommendedMode === "AR" ? "READY" : "FALLBACK_READY";
    setBridgeState(nextState, { lastMode: caps.recommendedMode });
    return Object.assign({ ok: true }, caps);
  }

  function requestCameraPermission(options) {
    options = options || {};
    setBridgeState("PERMISSION_REQUESTING");

    if (options.forceDenied || forceCameraDeniedNext) {
      forceCameraDeniedNext = false;
      var denied = normalizeARError({ errorCode: "CAMERA_DENIED" });
      setBridgeState("FALLBACK_READY", { lastError: denied });
      return Object.assign({
        status: "CAMERA_DENIED",
        granted: false
      }, denied);
    }

    if (!mockCapabilities.camera) {
      var unavailable = normalizeARError({ errorCode: "CAMERA_UNAVAILABLE" });
      setBridgeState("FALLBACK_READY", { lastError: unavailable });
      return Object.assign({
        status: "CAMERA_UNAVAILABLE",
        granted: false
      }, unavailable);
    }

    setBridgeState("READY");
    return {
      ok: true,
      status: "CAMERA_GRANTED",
      granted: true,
      message: "摄像头已授权"
    };
  }

  function requestLocationPermission(options) {
    options = options || {};
    setBridgeState("PERMISSION_REQUESTING");

    if (options.forceDenied) {
      var denied = normalizeARError({ errorCode: "LOCATION_DENIED" });
      setBridgeState("FALLBACK_READY", { lastError: denied });
      return Object.assign({ status: "LOCATION_DENIED", granted: false }, denied);
    }

    if (options.forceOutOfRange) {
      var outOfRange = normalizeARError({ errorCode: "LOCATION_OUT_OF_RANGE" });
      setBridgeState("FAILED", { lastError: outOfRange });
      return Object.assign({ status: "LOCATION_OUT_OF_RANGE", granted: false }, outOfRange);
    }

    if (!mockCapabilities.location) {
      var unavailable = normalizeARError({ errorCode: "LOCATION_DENIED" });
      setBridgeState("FALLBACK_READY", { lastError: unavailable });
      return Object.assign({ status: "LOCATION_UNAVAILABLE", granted: false }, unavailable);
    }

    setBridgeState("READY");
    return {
      ok: true,
      status: "LOCATION_GRANTED",
      granted: true,
      message: "定位已授权"
    };
  }

  function startARSession(arContent, options) {
    options = options || {};
    if (!arContent || !arContent.id) {
      var loadFail = normalizeARError({ errorCode: "AR_RESOURCE_LOAD_FAILED" });
      setBridgeState("FAILED", { lastError: loadFail });
      return loadFail;
    }

    setBridgeState("STARTING");
    var scanSessionId = options.scanSessionId || "scan_mock_" + Date.now();
    var pointId = options.pointId || arContent.sourcePointId || "";
    var timeoutSeconds = options.timeoutSeconds || 60;
    var caps = mergeCapabilities();
    var mode = options.mode;

    if (mode !== "AR" && mode !== "FALLBACK") {
      mode = (caps.arSupported && caps.camera) ? "AR" : "FALLBACK";
    } else if (mode === "AR" && (!caps.arSupported || !caps.camera)) {
      mode = "FALLBACK";
    }

    if (mode === "AR") {
      setBridgeState("SCANNING", { lastSessionId: scanSessionId, lastMode: "AR" });
    } else {
      setBridgeState("FALLBACK_READY", { lastSessionId: scanSessionId, lastMode: "FALLBACK" });
    }

    return {
      ok: true,
      sessionStatus: "STARTED",
      mode: mode,
      scanSessionId: scanSessionId,
      pointId: pointId,
      timeoutSeconds: timeoutSeconds,
      message: "显现流程已开始"
    };
  }

  function reportARProgress(scanSessionId, payload) {
    payload = payload || {};
    if (!scanSessionId) {
      return normalizeARError({ errorCode: "AR_SESSION_NOT_FOUND" });
    }

    var status = payload.status || "SCANNING";
    if (status === "TIMEOUT") {
      setBridgeState("FAILED", { lastSessionId: scanSessionId, lastError: normalizeARError({ errorCode: "AR_SCAN_TIMEOUT" }) });
      return normalizeARError({ errorCode: "AR_SCAN_TIMEOUT" });
    }

    if (status === "FAILED") {
      setBridgeState("FAILED", { lastSessionId: scanSessionId });
    } else if (status === "RECOGNIZED") {
      setBridgeState("RECOGNIZED", { lastSessionId: scanSessionId });
    } else {
      setBridgeState("SCANNING", { lastSessionId: scanSessionId });
    }

    return {
      ok: true,
      status: status,
      progress: typeof payload.progress === "number" ? payload.progress : 0,
      scanSessionId: scanSessionId
    };
  }

  function completeARSession(scanSessionId, payload) {
    payload = payload || {};
    if (!scanSessionId) {
      return normalizeARError({ errorCode: "AR_SESSION_NOT_FOUND" });
    }
    if (payload.forceTimeout) {
      setBridgeState("FAILED", { lastSessionId: scanSessionId, lastError: normalizeARError({ errorCode: "AR_SCAN_TIMEOUT" }) });
      return normalizeARError({ errorCode: "AR_SCAN_TIMEOUT" });
    }
    if (payload.forceInvalidCredential) {
      setBridgeState("FAILED", { lastSessionId: scanSessionId, lastError: normalizeARError({ errorCode: "AR_CREDENTIAL_INVALID" }) });
      return normalizeARError({ errorCode: "AR_CREDENTIAL_INVALID" });
    }

    setBridgeState("COMPLETED", { lastSessionId: scanSessionId, lastMode: bridgeState.lastMode || "AR" });
    return {
      ok: true,
      status: "COMPLETED",
      credential: "MOCK_AR_CREDENTIAL",
      credentialType: "AR_SCAN_SUCCESS",
      scanSessionId: scanSessionId,
      message: "显现完成"
    };
  }

  function completeFallback(scanSessionId, reason) {
    reason = reason || "AR_NOT_SUPPORTED";
    if (!scanSessionId) {
      return normalizeARError({ errorCode: "AR_SESSION_NOT_FOUND" });
    }

    setBridgeState("FALLBACK_COMPLETED", { lastSessionId: scanSessionId, lastMode: "FALLBACK" });
    return {
      ok: true,
      status: "FALLBACK_COMPLETED",
      fallbackUsed: true,
      fallbackReason: reason,
      credential: "MOCK_FALLBACK_CREDENTIAL",
      credentialType: "AR_FALLBACK_SUCCESS",
      scanSessionId: scanSessionId,
      message: "已使用备用显现流程"
    };
  }

  function disposeARSession(scanSessionId) {
    setBridgeState("DISPOSED", { lastSessionId: null, lastMode: null, lastError: null });
    return {
      ok: true,
      disposed: true,
      scanSessionId: scanSessionId || null
    };
  }

  function getBridgeState() {
    return cloneCaps(bridgeState);
  }

  function resetBridgeState() {
    bridgeState = createBridgeState("IDLE");
    forceCameraDeniedNext = false;
    return getBridgeState();
  }

  function setMockCapabilities(payload) {
    if (payload && typeof payload === "object") {
      Object.keys(payload).forEach(function (key) {
        mockCapabilities[key] = payload[key];
      });
      mockCapabilities.recommendedMode = (mockCapabilities.arSupported && mockCapabilities.camera) ? "AR" : "FALLBACK";
    }
    return getMockCapabilities();
  }

  function getMockCapabilities() {
    return cloneCaps(mockCapabilities);
  }

  var ARRuntimeBridge = {
    detectDeviceCapabilities: detectDeviceCapabilities,
    requestCameraPermission: requestCameraPermission,
    requestLocationPermission: requestLocationPermission,
    startARSession: startARSession,
    reportARProgress: reportARProgress,
    completeARSession: completeARSession,
    completeFallback: completeFallback,
    disposeARSession: disposeARSession,
    normalizeARError: normalizeARError,
    getBridgeState: getBridgeState,
    resetBridgeState: resetBridgeState,
    setMockCapabilities: setMockCapabilities,
    getMockCapabilities: getMockCapabilities,
    simulateCameraDenied: function () {
      mockCapabilities.camera = true;
      forceCameraDeniedNext = true;
      return getMockCapabilities();
    },
    BRIDGE_STATES: BRIDGE_STATES.slice()
  };

  function mountDebugTools() {
    if (typeof window === "undefined") return;
    // Production builds should disable debug mount before release.
    window.LQGARuntimeBridge = ARRuntimeBridge;
    window.LQGARDebug = {
      getCapabilities: getMockCapabilities,
      setCapabilities: setMockCapabilities,
      simulateCameraDenied: function () {
        mockCapabilities.camera = true;
        forceCameraDeniedNext = true;
        return getMockCapabilities();
      },
      simulateARUnsupported: function () {
        return setMockCapabilities({
          arSupported: false,
          fallbackRecommended: true,
          recommendedMode: "FALLBACK"
        });
      },
      simulateARTimeout: function () {
        return normalizeARError({ errorCode: "AR_SCAN_TIMEOUT" });
      },
      simulateARSuccess: function () {
        return completeARSession("debug_scan_session");
      },
      simulateFallbackSuccess: function () {
        return completeFallback("debug_scan_session", "AR_NOT_SUPPORTED");
      },
      reset: function () {
        mockCapabilities = cloneCaps(DEFAULT_CAPABILITIES);
        return resetBridgeState();
      }
    };
  }

  mountDebugTools();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ARRuntimeBridge;
  }
  global.LQGARRuntimeBridge = ARRuntimeBridge;
  global.ARRuntimeBridge = ARRuntimeBridge;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global);
