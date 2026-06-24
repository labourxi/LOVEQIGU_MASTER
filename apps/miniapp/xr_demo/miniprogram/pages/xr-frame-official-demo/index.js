const PROBE_DELAYS_MS = [500, 1500, 3000, 6000];
let xrRuntimeMapper;

function nowIso() {
  return new Date().toISOString();
}

function buildQueryResult(selector, rect) {
  return {
    selector,
    found: !!rect,
    width: rect && typeof rect.width === 'number' ? rect.width : 0,
    height: rect && typeof rect.height === 'number' ? rect.height : 0,
    top: rect && typeof rect.top === 'number' ? rect.top : 0,
    left: rect && typeof rect.left === 'number' ? rect.left : 0
  };
}

function normalizeMvpState(state) {
  const next = Object.assign({}, state);
  const surfaceFound = next.surfaceBoxQueryResult === 'FOUND';
  const sceneFound = next.sceneQueryResult === 'FOUND';
  const nodeFound = next.runtimeNodeQueryResult === 'FOUND';
  const objectFound = next.runtimeObjectQueryResult === 'FOUND';

  if (surfaceFound) {
    next.xrPageOpened = true;
  }

  if (surfaceFound || sceneFound) {
    next.xrCameraReady = true;
  }

  if (sceneFound) {
    next.xrSceneReady = true;
  }

  if (nodeFound || objectFound) {
    next.xrRenderReady = true;
    next.xrBlockReason = '';
  } else if (sceneFound) {
    next.xrRenderReady = false;
    next.xrBlockReason = 'XR_RUNTIME_OBJECT_QUERY_NOT_FOUND';
  } else {
    next.xrRenderReady = false;
    next.xrBlockReason = 'XR_RUNTIME_SCENE_QUERY_NOT_FOUND';
  }

  if (next.xrRenderReady) {
    next.xrCameraReady = true;
    next.xrSceneReady = true;
  }

  return next;
}

function getXRRuntimeMapper() {
  if (!xrRuntimeMapper) {
    xrRuntimeMapper = require('../../services/xr-runtime-mapper/index.js');
  }
  return xrRuntimeMapper;
}

Page({
  data: {
    xrPageOpened: false,
    pageReady: false,
    xrCameraReady: false,
    xrSceneReady: false,
    xrRenderReady: false,
    runtimeToXrMappingReady: false,
    runtimePocId: xrRuntimeMapper.DEFAULT_RUNTIME_POC,
    runtimePackageId: '',
    runtimeArId: '',
    runtimeEffectId: '',
    runtimeEffectName: '',
    runtimeEffectType: '',
    runtimeRevealType: '',
    runtimeFlowVersion: '',
    runtimeFlowStageCount: 0,
    runtimeNavigationRadiusM: '',
    runtimeOverlayPath: '',
    runtimeOverlayHint: '',
    runtimeOverlaySuccessText: '',
    runtimeMappingError: '',
    xrRenderMode: 'XR_FRAME_AR_CAMERA',
    xrBlockReason: '',
    xrCheckedAt: '',
    selectorDiagnosticsCheckedAt: '',
    surfaceBoxQueryResult: '',
    sceneQueryResult: '',
    runtimeNodeQueryResult: '',
    runtimeObjectQueryResult: '',
    selectorDiagnostics: []
  },

  onLoad() {
    const mapper = getXRRuntimeMapper();
    const plan = mapper.buildRuntimeScenePlan(this.data.runtimePocId);
    this._runtimePlan = plan;
    this.setData({
      xrPageOpened: true,
      runtimeToXrMappingReady: !!plan.mappingReady,
      runtimePocId: plan.runtimePocId,
      runtimePackageId: plan.runtimePackageId,
      runtimeArId: plan.runtimeArId,
      runtimeEffectId: plan.runtimeEffectId,
      runtimeEffectName: plan.runtimeEffectName,
      runtimeEffectType: plan.runtimeEffectType,
      runtimeRevealType: plan.runtimeRevealType,
      runtimeFlowVersion: plan.runtimeFlowVersion,
      runtimeFlowStageCount: plan.runtimeFlowStageCount,
      runtimeNavigationRadiusM: plan.runtimeNavigationRadiusM || '',
      runtimeOverlayPath: plan.guidance.overlayPath || '',
      runtimeOverlayHint: plan.guidance.overlayHint || '',
      runtimeOverlaySuccessText: plan.guidance.alignmentSuccessText || '',
      runtimeMappingError: plan.ok ? '' : plan.errorMessage || 'XR runtime mapping failed',
      xrCheckedAt: nowIso(),
      xrBlockReason: plan.ok ? '' : (plan.errorMessage || 'XR_RUNTIME_MAPPING_FAILED')
    });
  },

  onReady() {
    this.setData({
      pageReady: true,
      xrCheckedAt: nowIso()
    });
    this.scheduleRuntimeProbes();
  },

  onUnload() {
    if (Array.isArray(this._probeTimers)) {
      this._probeTimers.forEach((timer) => clearTimeout(timer));
    }
    this._probeTimers = [];
  },

  handleSceneReady(event) {
    console.log('[WECHAT_XR_RENDERER_MVP_V1] HANDLE_SCENE_READY', event);
    this.setData({
      xrCameraReady: true,
      xrSceneReady: true,
      xrCheckedAt: nowIso()
    });
    this.scheduleRuntimeProbes();
  },

  handleAssetLoad(event) {
    console.log('[WECHAT_XR_RENDERER_MVP_V1] HANDLE_ASSET_LOAD', event);
    this.setData({
      xrCheckedAt: nowIso()
    });
    this.scheduleRuntimeProbes();
  },

  handleAssetError(event) {
    console.error('[WECHAT_XR_RENDERER_MVP_V1] HANDLE_ASSET_ERROR', event);
    this.setData({
      xrRenderReady: false,
      xrBlockReason: 'XR_RUNTIME_ASSET_LOAD_ERROR',
      xrCheckedAt: nowIso()
    });
  },

  scheduleRuntimeProbes() {
    if (Array.isArray(this._probeTimers)) {
      this._probeTimers.forEach((timer) => clearTimeout(timer));
    }

    this._probeTimers = PROBE_DELAYS_MS.map((delay) => {
      return setTimeout(() => {
        this.runRuntimeSelectorDiagnostics(delay);
      }, delay);
    });
  },

  runRuntimeSelectorDiagnostics(delayMs) {
    console.log('[WECHAT_XR_RENDERER_MVP_V1] RUNTIME_DIAGNOSTICS_START', delayMs);

    const query = this.createSelectorQuery ? this.createSelectorQuery() : wx.createSelectorQuery();
    const selectors = [
      '#xr-runtime-surface-box',
      '#xr-runtime-scene',
      '#xr-runtime-node',
      '#xr-runtime-object'
    ];
    const results = [];

    selectors.forEach((selector) => {
      query.select(selector).boundingClientRect((rect) => {
        results.push(buildQueryResult(selector, rect));
      });
    });

    query.exec(() => {
      const surface = results.find((item) => item.selector === '#xr-runtime-surface-box');
      const scene = results.find((item) => item.selector === '#xr-runtime-scene');
      const node = results.find((item) => item.selector === '#xr-runtime-node');
      const object = results.find((item) => item.selector === '#xr-runtime-object');

      const surfaceFound = !!(surface && surface.found && surface.width > 0 && surface.height > 0);
      const sceneFound = !!(scene && scene.found);
      const nodeFound = !!(node && node.found && node.width > 0 && node.height > 0);
      const objectFound = !!(object && object.found && object.width > 0 && object.height > 0);

      console.log('[WECHAT_XR_RENDERER_MVP_V1] SURFACE_FOUND', surfaceFound ? surface : null);
      console.log('[WECHAT_XR_RENDERER_MVP_V1] SCENE_FOUND', sceneFound ? scene : null);
      console.log('[WECHAT_XR_RENDERER_MVP_V1] NODE_OR_OBJECT_FOUND', {
        nodeFound,
        objectFound
      });

      const nextState = normalizeMvpState({
        selectorDiagnostics: results,
        selectorDiagnosticsCheckedAt: nowIso(),
        surfaceBoxQueryResult: surfaceFound ? 'FOUND' : 'NOT_FOUND',
        sceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
        runtimeNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
        runtimeObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
        xrPageOpened: surfaceFound || this.data.xrPageOpened,
        xrCameraReady: surfaceFound || sceneFound || this.data.xrCameraReady,
        xrSceneReady: sceneFound || this.data.xrSceneReady,
        xrRenderReady: nodeFound || objectFound || this.data.xrRenderReady,
        runtimeToXrMappingReady: this.data.runtimeToXrMappingReady,
        xrCheckedAt: nowIso()
      });

      this.setData(nextState);

      if (nextState.xrRenderReady) {
        console.log('[WECHAT_XR_RENDERER_MVP_V1] XR_RENDER_READY_SYNCED');
        console.log('[WECHAT_XR_RENDERER_MVP_V1] RUNTIME_TO_XR_MAPPING_READY', nextState.runtimeToXrMappingReady);
      }
    });
  }
});
