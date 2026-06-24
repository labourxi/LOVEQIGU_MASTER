const TRACE = '[XR_MINIMAL_FRAME_SMOKE_TEST_V1]';

function safeCanIUse(key) {
  try {
    return typeof wx !== 'undefined' && typeof wx.canIUse === 'function' ? wx.canIUse(key) : false;
  } catch (err) {
    console.warn(TRACE, 'canIUse failed', key, err);
    return false;
  }
}

function safeGetSystemInfo() {
  try {
    if (typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function') {
      return wx.getSystemInfoSync();
    }
  } catch (err) {
    console.warn(TRACE, 'getSystemInfoSync failed', err);
  }
  return {};
}

function nowIsoString() {
  try {
    return new Date().toISOString();
  } catch (err) {
    return '';
  }
}

function isoTimeValue(value) {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function setCameraPermissionState(ctx, state) {
  ctx.setData({
    cameraPermissionKnown: true,
    cameraPermissionGranted: Boolean(state.granted),
    cameraPermissionDenied: Boolean(state.denied),
    cameraPermissionNeedOpenSetting: Boolean(state.needOpenSetting),
    cameraPermissionStatus: state.status || 'UNKNOWN',
    cameraPermissionMessage: state.message || '',
    cameraPermissionCheckedAt: nowIsoString()
  });
}

function detectStatus() {
  const systemInfo = safeGetSystemInfo();
  const rawCreateXRFrame = typeof wx !== 'undefined' && typeof wx.createXRFrame === 'function';
  const rawCanIUseXrFrame = safeCanIUse('xr-frame');
  const rawCanIUseXrScene = safeCanIUse('xr-scene');
  const rawCanIUseCamera = safeCanIUse('camera');
  const xrApiDetected = Boolean(rawCanIUseXrFrame || rawCreateXRFrame);
  console.log(TRACE, 'SYSTEM_INFO', systemInfo);
  console.log(TRACE, 'XR_API_CAPABILITY', {
    createXRFrame: typeof wx !== 'undefined' ? typeof wx.createXRFrame : 'undefined',
    canIUseExists: typeof wx !== 'undefined' && typeof wx.canIUse === 'function',
    canIUseXrFrame: rawCanIUseXrFrame,
    canIUseXrScene: rawCanIUseXrScene,
    canIUseCamera: rawCanIUseCamera,
    xrApiDetected
  });
  return {
    pageLoaded: true,
    pageReady: false,
    xrApiDetected,
    rawCreateXRFrame,
    rawCanIUseXrFrame,
    rawCanIUseXrScene,
    rawCanIUseCamera,
    xrFrameNodeExists: false,
    xrSceneNodeExists: false,
    xrRenderSurfaceExists: false,
    sceneReadyEventFired: false,
    minimalXrSurfaceReady: false,
    runtimeObservedReady: false,
    readyEventCallbackMissing: false,
    minimalXrReady: false,
    minimalXrReadyStatus: 'PENDING',
    runtimeStatus: 'XR_INITIALIZATION_TIMEOUT',
    runtimeBlockReason: 'XR_INITIALIZATION_TIMEOUT',
    systemInfo
  };
}

Page({
  data: {
    pageLoaded: false,
    pageReady: false,
    xrApiDetected: false,
    rawCreateXRFrame: false,
    rawCanIUseXrFrame: false,
    rawCanIUseXrScene: false,
    rawCanIUseCamera: false,
    cameraPermissionKnown: false,
    cameraPermissionGranted: false,
    cameraPermissionDenied: false,
    cameraPermissionNeedOpenSetting: false,
    cameraPermissionStatus: 'UNKNOWN',
    cameraPermissionMessage: '',
    cameraPermissionCheckedAt: '',
    cameraPreviewRequested: false,
    cameraPreviewAvailable: false,
    cameraPreviewSurfaceVisible: false,
    cameraPreviewStatus: 'NOT_STARTED',
    cameraPreviewBlockReason: '',
    cameraPreviewCheckedAt: '',
    cameraPreviewError: null,
    simple3dRenderSource: '',
    simple3dRendererPageOpened: false,
    scenicPointRenderReturned: false,
    scenicPointRenderStatus: 'NOT_STARTED',
    scenicPointObjectVisible: false,
    scenicPointBlockReason: '',
    scenicPointCheckedAt: '',
    scenicPointFallbackMessage: '',
    showSimple3dInlineFrame: false,
    simple3dInlineSceneReady: false,
    simple3dInlineAssetLoadStatus: '',
    simple3dInlineAssetLoadCheckedAt: '',
    simple3dInlineFrameQueryResult: '',
    simple3dInlineSurfaceBoxQueryResult: '',
    simple3dInlineSceneQueryResult: '',
    simple3dInlineNodeQueryResult: '',
    simple3dInlineObjectQueryResult: '',
    simple3dInlineDiagnosticsCheckedAt: '',
    showSimple3dFrame: false,
    simple3dFrameMounted: false,
    simple3dEventReceived: false,
    simple3dLastEventType: '',
    simple3dEventCheckedAt: '',
    simple3dHostQueryResult: '',
    simple3dComponentQueryResult: '',
    simple3dSurfaceBoxQueryResult: '',
    simple3dSceneQueryResult: '',
    simple3dNodeQueryResult: '',
    simple3dObjectQueryResult: '',
    simple3dPageDiagnosticsCheckedAt: '',
    simple3dInternalSurfaceFound: '',
    simple3dInternalNodeFound: '',
    simple3dInternalObjectFound: '',
    simple3dRenderRequested: false,
    simple3dObjectVisible: false,
    simple3dRenderStatus: 'NOT_STARTED',
    simple3dRenderBlockReason: '',
    simple3dRenderCheckedAt: '',
    simple3dRenderError: null,
    simple3dObjectQueryResult: null,
    xrFrameNodeExists: false,
    xrSceneNodeExists: false,
    xrRenderSurfaceExists: false,
    sceneReadyEventFired: false,
    minimalXrSurfaceReady: false,
    runtimeObservedReady: false,
    readyEventCallbackMissing: false,
    minimalXrReady: false,
    minimalXrReadyStatus: 'PENDING',
    queryAttempts: 0,
    maxQueryAttempts: 8,
    retryIntervalSeconds: 1,
    timeoutSeconds: 8,
    runtimeStatus: 'XR_INITIALIZATION_TIMEOUT',
    runtimeBlockReason: 'XR_INITIALIZATION_TIMEOUT'
  },

  onLoad() {
    console.log(TRACE, 'PAGE_LOADED');
    console.log('[XR_PRIMITIVE_SAMPLE_ENTRY_BUTTON_VISIBILITY_FIX_V1] ENTRY_BUTTON_READY');
    this.setData(detectStatus());
    this.checkCameraPermission();
  },

  onReady() {
    console.log(TRACE, 'PAGE_READY');
    this.setData({ pageReady: true });
    this.startSmokePolling();
  },

  onShow() {
    const scenicPointResult = this.readScenicPointRendererResultFromStorage();
    if (scenicPointResult && scenicPointResult.source === 'xr_scenic_point_render_exact_baseline_clone') {
      const incomingTime = isoTimeValue(scenicPointResult.checkedAt);
      const currentTime = isoTimeValue(this.data.scenicPointCheckedAt);
      const shouldApply = scenicPointResult.checkedAt
        ? incomingTime >= currentTime
        : !this.data.scenicPointRenderReturned;
      if (shouldApply) {
        this.applyScenicPointRendererResult(scenicPointResult);
      }
    }

    if (!this.data.simple3dRendererPageOpened && !this.data.simple3dRenderRequested) {
      return;
    }
    const result = this.readSimple3dRendererResultFromStorage();
    if (result && (result.source === 'dedicated_renderer_page' || result.source === 'xr_primitive_sample_standard_template') && result.checkedAt && isoTimeValue(result.checkedAt) > isoTimeValue(this.data.simple3dRenderCheckedAt)) {
      this.applySimple3dRendererResult(result);
    }
  },

  onUnload() {
    this.clearSmokePolling();
    this.clearSimple3dEventTimeout();
    this.clearSimple3dPageDiagnostics();
    this.clearSimple3dInlineDiagnostics();
  },

  checkCameraPermission() {
    console.log('[XR_CAMERA_PERMISSION_CHECK_V1] CHECK_CAMERA_PERMISSION_START');
    if (typeof wx === 'undefined' || typeof wx.getSetting !== 'function') {
      setCameraPermissionState(this, {
        granted: false,
        denied: false,
        needOpenSetting: false,
        status: 'UNKNOWN',
        message: '当前运行环境不支持相机权限检测'
      });
      console.log('[XR_CAMERA_PERMISSION_CHECK_V1] CHECK_CAMERA_PERMISSION_RESULT', {
        supported: false
      });
      return;
    }
    wx.getSetting({
      success: (res) => {
        const authSetting = (res && res.authSetting) || {};
        const hasCameraSetting = Object.prototype.hasOwnProperty.call(authSetting, 'scope.camera');
        const granted = authSetting['scope.camera'] === true;
        const denied = hasCameraSetting && authSetting['scope.camera'] === false;
        const state = granted
          ? {
              granted: true,
              denied: false,
              needOpenSetting: false,
              status: 'GRANTED',
              message: '相机权限已授权'
            }
          : denied
            ? {
                granted: false,
                denied: true,
                needOpenSetting: true,
                status: 'DENIED',
                message: '相机权限已被拒绝，请在设置中开启'
              }
            : {
                granted: false,
                denied: false,
                needOpenSetting: false,
                status: 'NOT_REQUESTED',
                message: '相机权限尚未授权'
              };
        setCameraPermissionState(this, state);
        console.log('[XR_CAMERA_PERMISSION_CHECK_V1] CHECK_CAMERA_PERMISSION_RESULT', {
          supported: true,
          authSetting
        });
      },
      fail: (err) => {
        setCameraPermissionState(this, {
          granted: false,
          denied: false,
          needOpenSetting: false,
          status: 'UNKNOWN',
          message: '相机权限状态检测失败'
        });
        console.warn('[XR_CAMERA_PERMISSION_CHECK_V1] CHECK_CAMERA_PERMISSION_RESULT', err);
      }
    });
  },

  startCameraPreviewBaseline() {
    console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] START_CAMERA_PREVIEW_BASELINE');
    const checkedAt = nowIsoString();
    if (this.data.cameraPermissionGranted !== true) {
      this.setData({
        cameraPreviewRequested: true,
        cameraPreviewAvailable: false,
        cameraPreviewSurfaceVisible: false,
        cameraPreviewStatus: 'WAITING_FOR_PERMISSION',
        cameraPreviewBlockReason: 'CAMERA_PERMISSION_REQUIRED',
        cameraPreviewCheckedAt: checkedAt,
        cameraPreviewError: null
      });
      console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PERMISSION_REQUIRED');
      console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_STATUS_UPDATED', {
        cameraPreviewStatus: 'WAITING_FOR_PERMISSION',
        cameraPreviewBlockReason: 'CAMERA_PERMISSION_REQUIRED'
      });
      return;
    }

    const cameraApiAvailable = Boolean(safeCanIUse('camera'));
    const xrSurfaceVisible = Boolean(this.data.xrFrameNodeExists && this.data.xrRenderSurfaceExists && this.data.minimalXrSurfaceReady && this.data.runtimeObservedReady);
    this.setData({
      cameraPreviewRequested: true,
      cameraPreviewCheckedAt: checkedAt,
      cameraPreviewError: null,
      cameraPreviewStatus: 'PERMISSION_GRANTED',
      cameraPreviewBlockReason: ''
    });

    if (!cameraApiAvailable) {
      this.setData({
        cameraPreviewAvailable: false,
        cameraPreviewSurfaceVisible: false,
        cameraPreviewStatus: 'CAMERA_PREVIEW_BLOCKED',
        cameraPreviewBlockReason: 'CAMERA_API_UNAVAILABLE'
      });
      console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_BLOCKED', {
        reason: 'CAMERA_API_UNAVAILABLE'
      });
      console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_STATUS_UPDATED', {
        cameraPreviewStatus: 'CAMERA_PREVIEW_BLOCKED',
        cameraPreviewBlockReason: 'CAMERA_API_UNAVAILABLE'
      });
      return;
    }

    if (!xrSurfaceVisible) {
      this.setData({
        cameraPreviewAvailable: false,
        cameraPreviewSurfaceVisible: false,
        cameraPreviewStatus: 'CAMERA_PREVIEW_BLOCKED',
        cameraPreviewBlockReason: this.data.runtimeObservedReady ? 'XR_SURFACE_NOT_READY' : 'XR_RUNTIME_OBSERVED_READY_MISSING'
      });
      console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_BLOCKED', {
        reason: this.data.runtimeObservedReady ? 'XR_SURFACE_NOT_READY' : 'XR_RUNTIME_OBSERVED_READY_MISSING'
      });
      console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_STATUS_UPDATED', {
        cameraPreviewStatus: 'CAMERA_PREVIEW_BLOCKED',
        cameraPreviewBlockReason: this.data.runtimeObservedReady ? 'XR_SURFACE_NOT_READY' : 'XR_RUNTIME_OBSERVED_READY_MISSING'
      });
      return;
    }

    this.setData({
      cameraPreviewAvailable: true,
      cameraPreviewSurfaceVisible: true,
      cameraPreviewStatus: 'CAMERA_PREVIEW_READY',
      cameraPreviewBlockReason: ''
    });
    console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_PRECHECK_PASS');
    console.log('[XR_CAMERA_PREVIEW_BASELINE_V1] CAMERA_PREVIEW_STATUS_UPDATED', {
      cameraPreviewStatus: 'CAMERA_PREVIEW_READY',
      cameraPreviewBlockReason: ''
    });
  },

  startSimple3dObjectRender() {
    this.openSimple3dRendererPage();
  },

  openScenicPointRenderer() {
    const startedAt = nowIsoString();
    console.log('[XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1] OPEN_SCENIC_POINT_RENDERER', {
      startedAt
    });
    this.setData({
      scenicPointRenderReturned: false,
      scenicPointRenderStatus: 'OPENING_RENDERER',
      scenicPointObjectVisible: false,
      scenicPointBlockReason: '',
      scenicPointCheckedAt: startedAt,
      scenicPointFallbackMessage: ''
    });

    if (typeof wx === 'undefined' || typeof wx.navigateTo !== 'function') {
      this.setData({
        scenicPointRenderReturned: true,
        scenicPointRenderStatus: 'NAVIGATE_FAILED',
        scenicPointObjectVisible: false,
        scenicPointBlockReason: 'XR_SCENIC_POINT_RENDERER_NAVIGATE_FAILED',
        scenicPointFallbackMessage: '当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。',
        scenicPointCheckedAt: nowIsoString()
      });
      console.error('[XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1] NAVIGATE_FAIL', 'navigateTo unavailable');
      return;
    }

    wx.navigateTo({
      url: '/xr_demo/miniprogram/pages/xr-scenic-point-render/index',
      success: () => {
        console.log('[XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1] NAVIGATE_SUCCESS');
      },
      fail: (err) => {
        console.error('[XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1] NAVIGATE_FAIL', err);
        this.setData({
          scenicPointRenderReturned: true,
          scenicPointRenderStatus: 'NAVIGATE_FAILED',
          scenicPointObjectVisible: false,
          scenicPointBlockReason: 'XR_SCENIC_POINT_RENDERER_NAVIGATE_FAILED',
          scenicPointFallbackMessage: '当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。',
          scenicPointCheckedAt: nowIsoString()
        });
      }
    });
  },

  openSimple3dRendererPage() {
    const startedAt = nowIsoString();
    console.log('[XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_V1] OPEN_STANDARD_TEMPLATE_PAGE', {
      startedAt
    });
    this.setData({
      simple3dRenderRequested: true,
      simple3dRendererPageOpened: true,
      simple3dObjectVisible: false,
      simple3dRenderStatus: 'XR_STANDARD_TEMPLATE_PAGE_OPENED',
      simple3dRenderBlockReason: '',
      simple3dRenderCheckedAt: startedAt,
      simple3dRenderSource: 'xr_primitive_sample_standard_template',
      simple3dEventReceived: false,
      simple3dLastEventType: 'standard_template_page_opened',
      simple3dEventCheckedAt: startedAt,
      showSimple3dInlineFrame: false,
      simple3dInlineSceneReady: false,
      simple3dInlineAssetLoadStatus: '',
      simple3dInlineAssetLoadCheckedAt: '',
      simple3dInlineFrameQueryResult: '',
      simple3dInlineSurfaceBoxQueryResult: '',
      simple3dInlineSceneQueryResult: '',
      simple3dInlineNodeQueryResult: '',
      simple3dInlineObjectQueryResult: '',
      simple3dInlineDiagnosticsCheckedAt: ''
    });

    if (typeof wx === 'undefined' || typeof wx.navigateTo !== 'function') {
      this.setData({
        simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
        simple3dRenderBlockReason: 'SIMPLE_3D_RENDERER_PAGE_NAVIGATION_FAILED',
        simple3dRenderCheckedAt: nowIsoString()
      });
      console.error('[XR_SIMPLE_3D_DEDICATED_RENDERER_PAGE_V1] NAVIGATE_TO_RENDERER_FAIL', 'navigateTo unavailable');
      return;
    }

    wx.navigateTo({
      url: '/xr_demo/miniprogram/pages/xr-primitive-sample/index',
      success: () => {
        console.log('[XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_V1] NAVIGATE_TO_TEMPLATE_SUCCESS');
      },
      fail: (err) => {
        console.error('[XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_V1] NAVIGATE_TO_TEMPLATE_FAIL', err);
        this.setData({
          simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
          simple3dRenderBlockReason: 'XR_STANDARD_TEMPLATE_PAGE_NAVIGATION_FAILED',
          simple3dRenderCheckedAt: nowIsoString()
        });
      }
    });
  },

  applySimple3dRendererResult(result) {
    if (!result) {
      return;
    }

    const incomingTime = isoTimeValue(result.checkedAt);
    const currentTime = isoTimeValue(this.data.simple3dRenderCheckedAt);
    const currentReady = this.data.simple3dRenderStatus === 'SIMPLE_3D_RENDER_READY' && this.data.simple3dObjectVisible === true;
    const status = result.status || 'SIMPLE_3D_RENDER_UNKNOWN';
    const renderReady = status === 'SIMPLE_3D_RENDER_READY';

    if (currentReady && !renderReady) {
      return;
    }

    if (currentReady && incomingTime && incomingTime < currentTime) {
      return;
    }
    const checkedAt = result.checkedAt || nowIsoString();

    this.setData({
      simple3dRenderRequested: true,
      simple3dRendererPageOpened: true,
      simple3dObjectVisible: renderReady ? true : Boolean(result.objectVisible),
      simple3dRenderStatus: status,
      simple3dRenderBlockReason: renderReady ? '' : (result.blockReason || ''),
      simple3dRenderCheckedAt: checkedAt,
      simple3dRenderSource: 'xr_primitive_sample_standard_template',
      simple3dEventReceived: true,
      simple3dLastEventType: 'standard_template_result',
      simple3dEventCheckedAt: checkedAt
    });
  },

  applyScenicPointRendererResult(result) {
    if (!result) {
      return;
    }

    const status = result.status || 'UNKNOWN';
    const objectVisible = Boolean(result.objectVisible);
    const checkedAt = result.checkedAt || nowIsoString();
    const ready = status === 'READY' && objectVisible === true;
    const fallbackMessage = ready ? '' : '当前设备暂未完成 XR 显现，可继续通过普通探索流程获得信物。';

    this.setData({
      scenicPointRenderReturned: true,
      scenicPointRenderStatus: status,
      scenicPointObjectVisible: ready ? true : objectVisible,
      scenicPointBlockReason: ready ? '' : (result.blockReason || ''),
      scenicPointCheckedAt: checkedAt,
      scenicPointFallbackMessage: fallbackMessage
    });
  },

  readSimple3dRendererResultFromStorage() {
    if (typeof wx === 'undefined' || typeof wx.getStorageSync !== 'function') {
      return null;
    }
    try {
      return wx.getStorageSync('XR_SIMPLE_3D_RENDER_RESULT_V1') || null;
    } catch (err) {
      console.warn('[XR_SIMPLE_3D_DEDICATED_RENDERER_PAGE_V1] STORAGE_READ_FAIL', err);
      return null;
    }
  },

  readScenicPointRendererResultFromStorage() {
    if (typeof wx === 'undefined' || typeof wx.getStorageSync !== 'function') {
      return null;
    }
    try {
      return wx.getStorageSync('XR_SCENIC_POINT_RENDER_RESULT_V1') || null;
    } catch (err) {
      console.warn('[XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1] STORAGE_READ_FAIL', err);
      return null;
    }
  },

  openPrimitiveSample() {
    console.log('[XR_PRIMITIVE_SAMPLE_TEMP_ENTRY_BUTTON_V1] OPEN_PRIMITIVE_SAMPLE');
    if (typeof wx === 'undefined' || typeof wx.navigateTo !== 'function') {
      console.error('[XR_PRIMITIVE_SAMPLE_TEMP_ENTRY_BUTTON_V1] NAVIGATE_FAIL', 'navigateTo unavailable');
      return;
    }
    wx.navigateTo({
      url: '/xr_demo/miniprogram/pages/xr-primitive-sample/index',
      success: function () {
        console.log('[XR_PRIMITIVE_SAMPLE_TEMP_ENTRY_BUTTON_V1] NAVIGATE_SUCCESS');
      },
      fail: function (err) {
        console.error('[XR_PRIMITIVE_SAMPLE_TEMP_ENTRY_BUTTON_V1] NAVIGATE_FAIL', err);
        wx.showToast({
          title: 'Primitive Sample 打开失败',
          icon: 'none'
        });
      }
    });
  },

  requestCameraPermission() {
    console.log('[XR_CAMERA_PERMISSION_CHECK_V1] REQUEST_CAMERA_PERMISSION_START');
    if (typeof wx === 'undefined' || typeof wx.authorize !== 'function') {
      setCameraPermissionState(this, {
        granted: false,
        denied: true,
        needOpenSetting: true,
        status: 'DENIED',
        message: '当前运行环境不支持相机权限请求，请在设置中开启'
      });
      console.log('[XR_CAMERA_PERMISSION_CHECK_V1] CAMERA_PERMISSION_DENIED');
      return;
    }
    try {
      wx.authorize({
        scope: 'scope.camera',
        success: () => {
          setCameraPermissionState(this, {
            granted: true,
            denied: false,
            needOpenSetting: false,
            status: 'GRANTED',
            message: '相机权限已授权'
          });
          console.log('[XR_CAMERA_PERMISSION_CHECK_V1] CAMERA_PERMISSION_GRANTED');
        },
        fail: () => {
          setCameraPermissionState(this, {
            granted: false,
            denied: true,
            needOpenSetting: true,
            status: 'DENIED',
            message: '相机权限已被拒绝，请在设置中开启'
          });
          console.log('[XR_CAMERA_PERMISSION_CHECK_V1] CAMERA_PERMISSION_DENIED');
        }
      });
    } catch (err) {
      setCameraPermissionState(this, {
        granted: false,
        denied: true,
        needOpenSetting: true,
        status: 'DENIED',
        message: '相机权限请求失败，请在设置中开启'
      });
      console.warn('[XR_CAMERA_PERMISSION_CHECK_V1] CAMERA_PERMISSION_DENIED', err);
    }
  },

  openCameraPermissionSetting() {
    if (typeof wx === 'undefined' || typeof wx.openSetting !== 'function') {
      return;
    }
    wx.openSetting({
      success: () => {
        console.log('[XR_CAMERA_PERMISSION_CHECK_V1] OPEN_SETTING_RETURNED');
        this.checkCameraPermission();
      },
      fail: (err) => {
        console.warn('[XR_CAMERA_PERMISSION_CHECK_V1] OPEN_SETTING_RETURNED', err);
      }
    });
  },

  updateMinimalXrReady() {
    const strictMinimalXrReady =
      this.data.pageLoaded === true &&
      this.data.pageReady === true &&
      this.data.xrFrameNodeExists === true &&
      this.data.xrRenderSurfaceExists === true &&
      this.data.sceneReadyEventFired === true;
    const observedMinimalXrReady =
      this.data.pageLoaded === true &&
      this.data.pageReady === true &&
      this.data.xrFrameNodeExists === true &&
      this.data.xrRenderSurfaceExists === true;

    const next = {
      minimalXrReady: strictMinimalXrReady,
      minimalXrSurfaceReady: observedMinimalXrReady,
      runtimeObservedReady: observedMinimalXrReady,
      readyEventCallbackMissing: Boolean(observedMinimalXrReady && !this.data.sceneReadyEventFired),
      minimalXrReadyStatus: 'PENDING'
    };

    if (strictMinimalXrReady) {
      next.readyEventCallbackMissing = false;
      next.minimalXrReadyStatus = 'PASS';
      next.runtimeStatus = 'MINIMAL_XR_READY';
      next.runtimeBlockReason = '';
    } else if (observedMinimalXrReady) {
      next.minimalXrReadyStatus = 'PASS_WITH_EVENT_CALLBACK_WARNING';
      next.runtimeStatus = 'MINIMAL_XR_SURFACE_READY';
      next.runtimeBlockReason = 'SCENE_READY_EVENT_NOT_EXPOSED';
    } else {
      next.runtimeStatus = this.data.xrFrameNodeExists && this.data.xrRenderSurfaceExists ? 'SCENE_READY_PENDING' : 'XR_INITIALIZATION_TIMEOUT';
      next.runtimeBlockReason = next.runtimeStatus;
    }

    this.setData(next);

    console.log('[XR_SMOKE_TEST_SCENE_READY_STATE_SYNC_FIX_V1] MINIMAL_XR_READY_RECALCULATED', {
      strictMinimalXrReady,
      observedMinimalXrReady,
      pageLoaded: this.data.pageLoaded,
      pageReady: this.data.pageReady,
      xrFrameNodeExists: this.data.xrFrameNodeExists,
      xrRenderSurfaceExists: this.data.xrRenderSurfaceExists,
      sceneReadyEventFired: this.data.sceneReadyEventFired,
      minimalXrReadyStatus: next.minimalXrReadyStatus,
      runtimeStatus: next.runtimeStatus,
      runtimeBlockReason: next.runtimeBlockReason
    });
  },

  clearSmokePolling() {
    if (this._smokePollingTimer) {
      clearInterval(this._smokePollingTimer);
      this._smokePollingTimer = null;
    }
    if (this._smokeTimeoutTimer) {
      clearTimeout(this._smokeTimeoutTimer);
      this._smokeTimeoutTimer = null;
    }
  },

  clearSimple3dEventTimeout() {
    if (this._simple3dEventTimeoutTimer) {
      clearTimeout(this._simple3dEventTimeoutTimer);
      this._simple3dEventTimeoutTimer = null;
    }
  },

  clearSimple3dInlineDiagnostics() {
    if (Array.isArray(this._simple3dInlineTimers)) {
      this._simple3dInlineTimers.forEach((timer) => clearTimeout(timer));
    }
    this._simple3dInlineTimers = [];
  },

  scheduleSimple3dInlineDiagnostics() {
    this.clearSimple3dInlineDiagnostics();
    const delays = [1000, 3000, 5000, 8000, 10000];
    this._simple3dInlineTimers = delays.map((delay) => {
      return setTimeout(() => {
        this.runSimple3dInlineDiagnostics('timer_' + delay);
      }, delay);
    });
  },

  clearSimple3dPageDiagnostics() {
    if (Array.isArray(this._simple3dPageDiagnosticsTimers)) {
      this._simple3dPageDiagnosticsTimers.forEach((timer) => clearTimeout(timer));
    }
    this._simple3dPageDiagnosticsTimers = [];
  },

  scheduleSimple3dPageDiagnostics() {
    this.clearSimple3dPageDiagnostics();
    const delays = [500, 1500, 3000, 6000];
    this._simple3dPageDiagnosticsTimers = delays.map((delay) => {
      return setTimeout(() => {
        this.runSimple3dPageDiagnostics();
      }, delay);
    });
  },

  startSmokePolling() {
    this.clearSmokePolling();
    this._smokeQueryAttempts = 0;
    this.runPageQuery();
    this._smokePollingTimer = setInterval(() => {
      if (this.data.runtimeObservedReady || this.data.minimalXrReady) {
        this.clearSmokePolling();
        return;
      }
      this._smokeQueryAttempts += 1;
      this.setData({ queryAttempts: this._smokeQueryAttempts });
      if (this._smokeQueryAttempts >= this.data.maxQueryAttempts) {
        this.handleSmokeTimeout();
        this.clearSmokePolling();
        return;
      }
      this.runPageQuery();
    }, this.data.retryIntervalSeconds * 1000);
    this._smokeTimeoutTimer = setTimeout(() => {
      this.handleSmokeTimeout();
      this.clearSmokePolling();
    }, this.data.timeoutSeconds * 1000);
  },

  handleSmokeTimeout() {
    if (this.data.runtimeObservedReady || this.data.minimalXrReady) {
      return;
    }
    if (this.data.minimalXrSurfaceReady) {
      this.setData({
        runtimeStatus: 'MINIMAL_XR_SURFACE_READY',
        runtimeBlockReason: 'SCENE_READY_EVENT_NOT_EXPOSED'
      });
      return;
    }
    this.setData({
      minimalXrReady: false,
      minimalXrSurfaceReady: false,
      runtimeObservedReady: false,
      readyEventCallbackMissing: false,
      minimalXrReadyStatus: 'FAIL',
      runtimeStatus: 'XR_INITIALIZATION_TIMEOUT',
      runtimeBlockReason: 'XR_INITIALIZATION_TIMEOUT'
    });
  },

  onXrSceneReady(event) {
    console.log('[XR_SMOKE_TEST_READY_EVENT_BINDING_FIX_V1] XR_SCENE_READY_EVENT_FIRED', event);
    this.setData({
      sceneReadyEventFired: true,
      xrSceneNodeExists: true,
      xrRenderSurfaceExists: true,
      minimalXrSurfaceReady: true,
      runtimeObservedReady: true,
      readyEventCallbackMissing: false,
      minimalXrReadyStatus: 'PASS',
      runtimeBlockReason: '',
      runtimeStatus: 'MINIMAL_XR_READY'
    }, () => {
      this.updateMinimalXrReady();
    });
  },

  onSceneReady(event) {
    this.onXrSceneReady(event);
  },

  handleSimple3dReady(event) {
    const detail = (event && event.detail) || {};
    const checkedAt = detail.checkedAt || nowIsoString();
    console.log('[XR_SIMPLE_3D_V2_EVENT_AND_MOUNT_DIAGNOSTICS_FIX_V1] SIMPLE_3D_READY_EVENT_RECEIVED', detail);
    this.clearSimple3dEventTimeout();
    this.setData({
      simple3dRenderRequested: true,
      showSimple3dFrame: true,
      simple3dFrameMounted: true,
      simple3dEventReceived: true,
      simple3dLastEventType: 'simple3dready',
      simple3dEventCheckedAt: checkedAt,
      simple3dObjectVisible: true,
      simple3dRenderStatus: 'SIMPLE_3D_RENDER_READY',
      simple3dRenderBlockReason: '',
      simple3dRenderCheckedAt: checkedAt,
      simple3dRenderError: null,
      simple3dObjectQueryResult: detail,
      simple3dInternalSurfaceFound: detail.surfaceFound ? 'YES' : 'NO',
      simple3dInternalNodeFound: detail.nodeFound ? 'YES' : 'NO',
      simple3dInternalObjectFound: detail.objectFound ? 'YES' : 'NO'
    });
    console.log('[XR_SIMPLE_3D_OBJECT_RENDER_V1] SIMPLE_3D_RENDER_STATUS_UPDATED', {
      simple3dRenderStatus: 'SIMPLE_3D_RENDER_READY',
      simple3dRenderBlockReason: ''
    });
  },

  handleSimple3dBlocked(event) {
    const detail = (event && event.detail) || {};
    const checkedAt = detail.checkedAt || nowIsoString();
    const status = detail.status || 'SIMPLE_3D_RENDER_BLOCKED';
    const blockReason = detail.blockReason || 'UNKNOWN';
    console.log('[XR_SIMPLE_3D_V2_EVENT_AND_MOUNT_DIAGNOSTICS_FIX_V1] SIMPLE_3D_BLOCKED_EVENT_RECEIVED', detail);
    this.clearSimple3dEventTimeout();
    this.setData({
      simple3dRenderRequested: true,
      showSimple3dFrame: true,
      simple3dFrameMounted: true,
      simple3dEventReceived: true,
      simple3dLastEventType: 'simple3dblocked',
      simple3dEventCheckedAt: checkedAt,
      simple3dObjectVisible: false,
      simple3dRenderStatus: status === 'SIMPLE_3D_RENDER_FAILED' ? 'SIMPLE_3D_RENDER_FAILED' : 'SIMPLE_3D_RENDER_BLOCKED',
      simple3dRenderBlockReason: blockReason,
      simple3dRenderCheckedAt: checkedAt,
      simple3dRenderError: detail.error || null,
      simple3dObjectQueryResult: detail,
      simple3dInternalSurfaceFound: detail.surfaceFound ? 'YES' : 'NO',
      simple3dInternalNodeFound: detail.nodeFound ? 'YES' : 'NO',
      simple3dInternalObjectFound: detail.objectFound ? 'YES' : 'NO'
    });
    console.log('[XR_SIMPLE_3D_OBJECT_RENDER_V1] SIMPLE_3D_RENDER_STATUS_UPDATED', {
      simple3dRenderStatus: status === 'SIMPLE_3D_RENDER_FAILED' ? 'SIMPLE_3D_RENDER_FAILED' : 'SIMPLE_3D_RENDER_BLOCKED',
      simple3dRenderBlockReason: blockReason
    });
  },

  handleSimple3dMounted(event) {
    const detail = (event && event.detail) || {};
    const checkedAt = detail.checkedAt || nowIsoString();
    console.log('[XR_SIMPLE_3D_V2_EVENT_AND_MOUNT_DIAGNOSTICS_FIX_V1] SIMPLE_3D_MOUNTED_EVENT_RECEIVED', detail);
    this.setData({
      showSimple3dFrame: true,
      simple3dRenderRequested: true,
      simple3dFrameMounted: true,
      simple3dEventReceived: true,
      simple3dLastEventType: 'simple3dmounted',
      simple3dEventCheckedAt: checkedAt,
      simple3dInternalSurfaceFound: detail.surfaceFound ? 'YES' : 'NO',
      simple3dInternalNodeFound: detail.nodeFound ? 'YES' : 'NO',
      simple3dInternalObjectFound: detail.objectFound ? 'YES' : 'NO'
    });
  },

  handleSimple3dInlineSceneReady(event) {
    console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_SCENE_READY', event);
    const checkedAt = nowIsoString();
    this.setData({
      showSimple3dInlineFrame: true,
      simple3dFrameMounted: true,
      simple3dInlineSceneReady: true,
      simple3dEventReceived: true,
      simple3dLastEventType: 'inline_scene_ready',
      simple3dEventCheckedAt: checkedAt
    });
    setTimeout(() => {
      this.runSimple3dInlineDiagnostics('inline_scene_ready');
    }, 1000);
  },

  handleSimple3dInlineAssetLoaded(event) {
    console.log('[XR_SIMPLE_3D_INLINE_MATCH_PRIMITIVE_SAMPLE_STRUCTURE_FIX_V1] INLINE_ASSET_LOADED', event);
    this.setData({
      simple3dInlineAssetLoadStatus: 'LOADED',
      simple3dInlineAssetLoadCheckedAt: nowIsoString()
    });
    setTimeout(() => {
      this.runSimple3dInlineDiagnostics('inline_asset_loaded');
    }, 1000);
  },

  handleSimple3dInlineAssetError(event) {
    console.error('[XR_SIMPLE_3D_INLINE_MATCH_PRIMITIVE_SAMPLE_STRUCTURE_FIX_V1] INLINE_ASSET_ERROR', event);
    const checkedAt = nowIsoString();
    this.setData({
      simple3dInlineAssetLoadStatus: 'ERROR',
      simple3dInlineAssetLoadCheckedAt: checkedAt,
      simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
      simple3dRenderBlockReason: 'SIMPLE_3D_INLINE_ASSET_LOAD_ERROR',
      simple3dRenderCheckedAt: checkedAt
    });
  },

  runSimple3dInlineDiagnostics(reason) {
    console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_DIAGNOSTICS_START', {
      reason: reason || 'manual'
    });
    const checkedAt = nowIsoString();
    this.setData({
      showSimple3dInlineFrame: true
    });
    const queryFactory = typeof this.createSelectorQuery === 'function' ? this.createSelectorQuery() : (typeof wx !== 'undefined' && typeof wx.createSelectorQuery === 'function' ? wx.createSelectorQuery() : null);
    if (!queryFactory) {
      const blockCheckedAt = nowIsoString();
      this.setData({
        simple3dInlineFrameQueryResult: 'NOT_FOUND',
        simple3dInlineSurfaceBoxQueryResult: 'NOT_FOUND',
        simple3dInlineSceneQueryResult: 'NOT_FOUND',
        simple3dInlineNodeQueryResult: 'NOT_FOUND',
        simple3dInlineObjectQueryResult: 'NOT_FOUND',
        simple3dInlineDiagnosticsCheckedAt: blockCheckedAt,
        simple3dFrameMounted: false,
        simple3dEventReceived: true,
        simple3dLastEventType: 'inline_surface_not_found',
        simple3dEventCheckedAt: blockCheckedAt,
        simple3dObjectVisible: false,
        simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
        simple3dRenderBlockReason: 'SIMPLE_3D_INLINE_SURFACE_NOT_FOUND',
        simple3dRenderCheckedAt: blockCheckedAt
      });
      console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_DIAGNOSTICS_BLOCKED', {
        reason: 'selector_query_unavailable'
      });
      return;
    }

    const query = queryFactory.in ? queryFactory.in(this) : queryFactory;
    const selectors = [
      '#xr-simple-3d-inline-surface-box',
      '#xr-simple-3d-inline-frame',
      '#xr-simple-3d-inline-scene',
      '#xr-simple-3d-inline-node',
      '#xr-simple-3d-inline-object'
    ];
    selectors.forEach((selector) => query.select(selector).boundingClientRect());
    query.exec((res) => {
      if (this.data.simple3dRenderStatus === 'SIMPLE_3D_RENDER_READY' && this.data.simple3dObjectVisible === true) {
        return;
      }

      const results = Array.isArray(res) ? res : [];
      const surfaceRect = results[0] || null;
      const frameRect = results[1] || null;
      const sceneRect = results[2] || null;
      const nodeRect = results[3] || null;
      const objectRect = results[4] || null;
      const surfaceFound = Boolean(surfaceRect && surfaceRect.width > 0 && surfaceRect.height > 0);
      const frameFound = Boolean(frameRect && frameRect.width > 0 && frameRect.height > 0);
      const sceneFound = Boolean(sceneRect && sceneRect.width > 0 && sceneRect.height > 0);
      const objectFound = Boolean(objectRect && objectRect.width > 0 && objectRect.height > 0);
      const nodeFound = Boolean((nodeRect && nodeRect.width > 0 && nodeRect.height > 0) || objectFound);
      const ready = Boolean(objectFound || nodeFound);
      const diagnosticsCheckedAt = nowIsoString();

      console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_DIAGNOSTICS_RESULT', {
        reason: reason || 'manual',
        surfaceFound,
        frameFound,
        sceneFound,
        nodeFound,
        objectFound,
        diagnosticsCheckedAt
      });

      if (ready) {
        this.setData({
          showSimple3dInlineFrame: true,
          simple3dFrameMounted: true,
          simple3dEventReceived: true,
          simple3dLastEventType: 'inline_diagnostics_ready',
          simple3dEventCheckedAt: diagnosticsCheckedAt,
          simple3dRenderRequested: true,
          simple3dObjectVisible: true,
          simple3dRenderStatus: 'SIMPLE_3D_RENDER_READY',
          simple3dRenderBlockReason: '',
          simple3dRenderCheckedAt: diagnosticsCheckedAt,
          simple3dRenderError: null,
          simple3dInlineFrameQueryResult: frameFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineSurfaceBoxQueryResult: surfaceFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineDiagnosticsCheckedAt: diagnosticsCheckedAt,
          simple3dInlineSceneReady: sceneFound || this.data.simple3dInlineSceneReady
        });
        console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_READY_SYNCED', {
          surfaceFound,
          sceneFound,
          nodeFound,
          objectFound
        });
        return;
      }

      if (surfaceFound) {
        this.setData({
          showSimple3dInlineFrame: true,
          simple3dFrameMounted: true,
          simple3dEventReceived: true,
          simple3dLastEventType: 'inline_diagnostics_blocked',
          simple3dEventCheckedAt: diagnosticsCheckedAt,
          simple3dRenderRequested: true,
          simple3dObjectVisible: false,
          simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
          simple3dRenderBlockReason: 'SIMPLE_3D_INLINE_OBJECT_QUERY_NOT_FOUND',
          simple3dRenderCheckedAt: diagnosticsCheckedAt,
          simple3dRenderError: null,
          simple3dInlineFrameQueryResult: frameFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineSurfaceBoxQueryResult: 'FOUND',
          simple3dInlineSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          simple3dInlineDiagnosticsCheckedAt: diagnosticsCheckedAt,
          simple3dInlineSceneReady: sceneFound || this.data.simple3dInlineSceneReady
        });
        console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_BLOCKED_SYNCED', {
          surfaceFound,
          sceneFound,
          nodeFound,
          objectFound
        });
        return;
      }

      this.setData({
        showSimple3dInlineFrame: true,
        simple3dFrameMounted: false,
        simple3dEventReceived: true,
        simple3dLastEventType: 'inline_surface_not_found',
        simple3dEventCheckedAt: diagnosticsCheckedAt,
        simple3dRenderRequested: true,
        simple3dObjectVisible: false,
        simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
        simple3dRenderBlockReason: 'SIMPLE_3D_INLINE_SURFACE_NOT_FOUND',
        simple3dRenderCheckedAt: diagnosticsCheckedAt,
        simple3dRenderError: null,
        simple3dInlineFrameQueryResult: frameFound ? 'FOUND' : 'NOT_FOUND',
        simple3dInlineSurfaceBoxQueryResult: 'NOT_FOUND',
        simple3dInlineSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
        simple3dInlineNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
        simple3dInlineObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
        simple3dInlineDiagnosticsCheckedAt: diagnosticsCheckedAt,
        simple3dInlineSceneReady: sceneFound || this.data.simple3dInlineSceneReady
      });
      console.log('[XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1] INLINE_SURFACE_NOT_FOUND', {
        surfaceFound,
        sceneFound,
        nodeFound,
        objectFound
      });
    });
  },

  runSimple3dPageDiagnostics() {
    console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] PAGE_DIAGNOSTICS_START');
    const checkedAt = nowIsoString();
    const queryFactory = typeof this.createSelectorQuery === 'function' ? this.createSelectorQuery() : (typeof wx !== 'undefined' && typeof wx.createSelectorQuery === 'function' ? wx.createSelectorQuery() : null);
    if (!queryFactory) {
      console.warn('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] PAGE_DIAGNOSTICS_BLOCKED', 'selector query unavailable');
      this.setData({
        simple3dPageDiagnosticsCheckedAt: checkedAt,
        simple3dHostQueryResult: 'NOT_FOUND',
        simple3dComponentQueryResult: 'NOT_FOUND',
        simple3dSurfaceBoxQueryResult: 'NOT_FOUND',
        simple3dSceneQueryResult: 'NOT_FOUND',
        simple3dNodeQueryResult: 'NOT_FOUND',
        simple3dObjectQueryResult: 'NOT_FOUND',
        simple3dFrameMounted: false,
        simple3dEventReceived: false,
        simple3dLastEventType: 'page_diagnostics_blocked',
        simple3dEventCheckedAt: checkedAt,
        simple3dObjectVisible: false,
        simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
        simple3dRenderBlockReason: 'SIMPLE_3D_HOST_NOT_FOUND'
      });
      return;
    }

    const query = queryFactory.in ? queryFactory.in(this) : queryFactory;
    const selectors = [
      '#xr-simple-3d-host',
      '#xr-simple-3d-frame-component',
      '#xr-simple-3d-surface-box',
      '#xr-simple-3d-scene',
      '#xr-simple-3d-node',
      '#xr-simple-3d-object'
    ];
    selectors.forEach((selector) => query.select(selector).boundingClientRect());
    query.exec((res) => {
      const results = Array.isArray(res) ? res : [];
      const hostRect = results[0] || null;
      const componentRect = results[1] || null;
      const surfaceBoxRect = results[2] || null;
      const sceneRect = results[3] || null;
      const nodeRect = results[4] || null;
      const objectRect = results[5] || null;

      const hostFound = Boolean(hostRect && hostRect.width > 0 && hostRect.height > 0);
      const componentFound = Boolean(componentRect && componentRect.width > 0 && componentRect.height > 0);
      const surfaceBoxFound = Boolean(surfaceBoxRect && surfaceBoxRect.width > 0 && surfaceBoxRect.height > 0);
      const sceneFound = Boolean(sceneRect && sceneRect.width > 0 && sceneRect.height > 0);
      const nodeFound = Boolean(nodeRect && nodeRect.width > 0 && nodeRect.height > 0);
      const objectFound = Boolean(objectRect && objectRect.width > 0 && objectRect.height > 0);
      const internalFound = Boolean(nodeFound || objectFound);
      const surfaceFound = Boolean(hostFound || surfaceBoxFound || componentFound || sceneFound);
      const alreadyReady = this.data.simple3dRenderStatus === 'SIMPLE_3D_RENDER_READY' && this.data.simple3dObjectVisible === true;

      console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] HOST_QUERY_RESULT', hostRect);
      console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] COMPONENT_QUERY_RESULT', componentRect);
      console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] INTERNAL_NODE_QUERY_RESULT', {
        sceneRect,
        nodeRect,
        objectRect
      });

      if (alreadyReady) {
        this.setData({
          simple3dHostQueryResult: hostFound ? 'FOUND' : 'NOT_FOUND',
          simple3dComponentQueryResult: componentFound ? 'FOUND' : 'NOT_FOUND',
          simple3dSurfaceBoxQueryResult: surfaceBoxFound ? 'FOUND' : 'NOT_FOUND',
          simple3dSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
          simple3dNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
          simple3dObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          simple3dPageDiagnosticsCheckedAt: nowIsoString(),
          simple3dFrameMounted: true,
          simple3dEventReceived: true,
          simple3dLastEventType: 'page_diagnostics_ready',
          simple3dEventCheckedAt: nowIsoString()
        });
        console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] PAGE_DIAGNOSTICS_READY', {
          hostFound,
          componentFound,
          surfaceBoxFound,
          sceneFound,
          nodeFound,
          objectFound
        });
        return;
      }

      if (internalFound) {
        const readyCheckedAt = nowIsoString();
        this.setData({
          simple3dHostQueryResult: hostFound ? 'FOUND' : 'NOT_FOUND',
          simple3dComponentQueryResult: componentFound ? 'FOUND' : 'NOT_FOUND',
          simple3dSurfaceBoxQueryResult: surfaceBoxFound ? 'FOUND' : 'NOT_FOUND',
          simple3dSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
          simple3dNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
          simple3dObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          simple3dPageDiagnosticsCheckedAt: readyCheckedAt,
          simple3dFrameMounted: true,
          simple3dEventReceived: true,
          simple3dLastEventType: 'page_diagnostics_ready',
          simple3dEventCheckedAt: readyCheckedAt,
          simple3dObjectVisible: true,
          simple3dRenderStatus: 'SIMPLE_3D_RENDER_READY',
          simple3dRenderBlockReason: '',
          simple3dRenderError: null
        });
        console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] PAGE_DIAGNOSTICS_READY', {
          hostFound,
          componentFound,
          surfaceBoxFound,
          sceneFound,
          nodeFound,
          objectFound
        });
        return;
      }

      if (surfaceFound) {
        const blockedCheckedAt = nowIsoString();
        this.setData({
          simple3dHostQueryResult: hostFound ? 'FOUND' : 'NOT_FOUND',
          simple3dComponentQueryResult: componentFound ? 'FOUND' : 'NOT_FOUND',
          simple3dSurfaceBoxQueryResult: surfaceBoxFound ? 'FOUND' : 'NOT_FOUND',
          simple3dSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
          simple3dNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
          simple3dObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          simple3dPageDiagnosticsCheckedAt: blockedCheckedAt,
          simple3dFrameMounted: true,
          simple3dEventReceived: false,
          simple3dLastEventType: 'page_diagnostics_blocked',
          simple3dEventCheckedAt: blockedCheckedAt,
          simple3dObjectVisible: false,
          simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
          simple3dRenderBlockReason: 'SIMPLE_3D_INTERNAL_NODE_NOT_QUERYABLE_FROM_PAGE',
          simple3dRenderError: null
        });
        console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] PAGE_DIAGNOSTICS_BLOCKED', {
          hostFound,
          componentFound,
          surfaceBoxFound,
          sceneFound,
          nodeFound,
          objectFound
        });
        return;
      }

      const blockedCheckedAt = nowIsoString();
      this.setData({
        simple3dHostQueryResult: hostFound ? 'FOUND' : 'NOT_FOUND',
        simple3dComponentQueryResult: componentFound ? 'FOUND' : 'NOT_FOUND',
        simple3dSurfaceBoxQueryResult: surfaceBoxFound ? 'FOUND' : 'NOT_FOUND',
        simple3dSceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
        simple3dNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
        simple3dObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
        simple3dPageDiagnosticsCheckedAt: blockedCheckedAt,
        simple3dFrameMounted: false,
        simple3dEventReceived: false,
        simple3dLastEventType: 'page_diagnostics_blocked',
        simple3dEventCheckedAt: blockedCheckedAt,
        simple3dObjectVisible: false,
        simple3dRenderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
        simple3dRenderBlockReason: 'SIMPLE_3D_HOST_NOT_FOUND',
        simple3dRenderError: null
      });
      console.log('[XR_SIMPLE_3D_V2_PAGE_LEVEL_DIAGNOSTICS_FALLBACK_V1] PAGE_DIAGNOSTICS_BLOCKED', {
        hostFound,
        componentFound,
        surfaceBoxFound,
        sceneFound,
        nodeFound,
        objectFound
      });
    });
  },

  onSimple3dReady(event) {
    this.handleSimple3dReady(event);
  },

  onSimple3dBlocked(event) {
    this.handleSimple3dBlocked(event);
  },

  onSimple3dResult(event) {
    this.handleSimple3dBlocked(event);
  },

  runPageQuery() {
    if (typeof wx === 'undefined' || typeof wx.createSelectorQuery !== 'function') {
      console.warn(TRACE, 'page selector query unavailable');
      return;
    }
    wx.createSelectorQuery()
      .in(this)
      .select('#xr-smoke-frame')
      .boundingClientRect()
      .exec((res) => {
        const frameNode = res && res[0] ? res[0] : null;
        console.log(TRACE, 'XR_PAGE_QUERY_XR_CAMERA', frameNode);
        console.log(TRACE, 'XR_FRAME_NODE_EXISTS_QUERY', frameNode);
        const xrFrameNodeExists = Boolean(frameNode);
        const xrRenderSurfaceExists = Boolean(frameNode && (frameNode.width > 0 || frameNode.height > 0));
        this.setData({
          xrFrameNodeExists,
          xrRenderSurfaceExists,
          xrSceneNodeExists: Boolean(this.data.sceneReadyEventFired || this.data.xrSceneNodeExists)
        }, () => {
          this.updateMinimalXrReady();
          if (this.data.runtimeObservedReady || this.data.minimalXrReady) {
            this.clearSmokePolling();
          }
        });
      });
  },

  onSmokeResult(event) {
    const detail = (event && event.detail) || {};
    const xrFrameNodeExists = Boolean(detail.frameExists);
    const xrSceneNodeExists = Boolean(detail.sceneExists || this.data.xrSceneNodeExists);
    const xrRenderSurfaceExists = Boolean(detail.renderSurfaceExists || xrFrameNodeExists);
    const observedMinimalXrReady = Boolean(this.data.pageLoaded && this.data.pageReady && xrFrameNodeExists && xrRenderSurfaceExists);
    this.setData({
      xrFrameNodeExists,
      xrSceneNodeExists,
      xrRenderSurfaceExists,
      xrApiDetected: Boolean(this.data.rawCanIUseXrFrame || this.data.rawCreateXRFrame || xrFrameNodeExists || this.data.sceneReadyEventFired),
      minimalXrSurfaceReady: observedMinimalXrReady,
      runtimeObservedReady: observedMinimalXrReady,
      readyEventCallbackMissing: Boolean(observedMinimalXrReady && !this.data.sceneReadyEventFired),
      minimalXrReadyStatus: observedMinimalXrReady
        ? (this.data.sceneReadyEventFired ? 'PASS' : 'PASS_WITH_EVENT_CALLBACK_WARNING')
        : 'PENDING'
    }, () => {
      this.updateMinimalXrReady();
      if (this.data.runtimeObservedReady || this.data.minimalXrReady) {
        this.clearSmokePolling();
      }
    });
    console.log(TRACE, 'SMOKE_RESULT', detail);
  }
});
