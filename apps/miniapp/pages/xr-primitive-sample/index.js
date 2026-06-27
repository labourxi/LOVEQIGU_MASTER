const PROBE_DELAYS_MS = [500, 1500, 3000, 6000];

function nowIso() {
  return new Date().toISOString();
}

function hasRect(rect) {
  return !!rect && typeof rect.width === 'number' && typeof rect.height === 'number';
}

function isNumericSize(rect) {
  return hasRect(rect) && rect.width > 0 && rect.height > 0;
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

function normalizePrimitiveSampleState(state) {
  const nextState = Object.assign({}, state);
  const surfaceFound = nextState.surfaceBoxQueryResult === 'FOUND';
  const nodeFound = nextState.primitiveNodeQueryResult === 'FOUND';
  const objectFound = nextState.primitiveObjectQueryResult === 'FOUND';

  if (surfaceFound) {
    nextState.primitiveSampleMounted = true;
    nextState.primitiveRenderSurfaceVisible = true;
    nextState.primitiveSurfaceObserved = true;
  }

  if (objectFound || nodeFound) {
    nextState.primitiveObjectVisible = true;
    nextState.primitiveSampleStatus = 'PRIMITIVE_RENDER_READY';
    nextState.primitiveBlockReason = '';
    nextState.primitiveError = null;
  } else if (surfaceFound) {
    nextState.primitiveObjectVisible = false;
    nextState.primitiveSampleStatus = 'PRIMITIVE_RENDER_BLOCKED';
    nextState.primitiveBlockReason = 'PRIMITIVE_OBJECT_QUERY_NOT_FOUND';
  } else {
    nextState.primitiveSampleMounted = false;
    nextState.primitiveRenderSurfaceVisible = false;
    nextState.primitiveSurfaceObserved = false;
    nextState.primitiveObjectVisible = false;
    nextState.primitiveSampleStatus = 'PRIMITIVE_RENDER_BLOCKED';
    nextState.primitiveBlockReason = 'PRIMITIVE_SURFACE_QUERY_NOT_FOUND';
  }

  if (nextState.primitiveObjectQueryResult === 'FOUND' && nextState.primitiveObjectVisible === false) {
    nextState.primitiveObjectVisible = true;
    nextState.primitiveSampleStatus = 'PRIMITIVE_RENDER_READY';
    nextState.primitiveBlockReason = '';
    nextState.primitiveError = null;
    console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] STATE_CONTRADICTION_FIXED');
  }

  if (nextState.primitiveSampleStatus === 'PRIMITIVE_RENDER_BLOCKED' && nextState.primitiveBlockReason === 'PRIMITIVE_OBJECT_QUERY_NOT_FOUND' && nextState.primitiveObjectQueryResult === 'FOUND') {
    nextState.primitiveSampleStatus = 'PRIMITIVE_RENDER_READY';
    nextState.primitiveBlockReason = '';
    nextState.primitiveObjectVisible = true;
    nextState.primitiveError = null;
    console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] STATE_CONTRADICTION_FIXED');
  }

  if (nextState.primitiveSampleStatus === 'PRIMITIVE_RENDER_READY') {
    nextState.primitiveObjectVisible = true;
    nextState.primitiveBlockReason = '';
    nextState.primitiveError = null;
  }

  return nextState;
}

Page({
  data: {
    pageLoaded: false,
    pageReady: false,
    primitiveSampleMounted: false,
    primitiveRenderSurfaceVisible: false,
    primitiveSurfaceObserved: false,
    primitiveObjectVisible: false,
    primitiveObjectQueryResult: '',
    primitiveSampleStatus: 'NOT_STARTED',
    primitiveBlockReason: '',
    primitiveCheckedAt: '',
    primitiveError: null,
    minimalGltfAssetAdded: true,
    minimalGltfAssetSizeKb: '',
    primitiveRenderMode: 'GLTF_ONLY_BASELINE',
    primitiveTrackerEnabled: false,
    primitiveTrackerType: 'none',
    primitiveQueryResult: null,
    selectorDiagnostics: [],
    surfaceBoxQueryResult: null,
    sceneQueryResult: null,
    primitiveNodeQueryResult: null,
    primitiveObjectQueryResult: null,
    selectorDiagnosticsCheckedAt: ''
  },

  onLoad() {
    this.setData({
      pageLoaded: true
    });
  },

  onReady() {
    this.setData({
      pageReady: true,
      primitiveSampleStatus: 'SAMPLE_PAGE_READY',
      primitiveCheckedAt: nowIso()
    });
    this.schedulePrimitiveProbes();
  },

  onUnload() {
    if (Array.isArray(this._probeTimers)) {
      this._probeTimers.forEach((timer) => clearTimeout(timer));
    }
    this._probeTimers = [];
  },

  handleReady(event) {
    console.log('[XR_PRIMITIVE_SAMPLE_STATUS_SYNC_AND_TRACKER_ISOLATION_FIX_V1] HANDLE_READY', event);
    this.setData({
      primitiveSampleMounted: true,
      primitiveCheckedAt: nowIso(),
      primitiveError: null
    });

    this.schedulePrimitiveProbes();
  },

  schedulePrimitiveProbes() {
    if (Array.isArray(this._probeTimers)) {
      this._probeTimers.forEach((timer) => clearTimeout(timer));
    }

    this._probeTimers = PROBE_DELAYS_MS.map((delay) => {
      return setTimeout(() => {
        this.runPrimitiveSelectorDiagnostics(delay);
      }, delay);
    });
  },

  runPrimitiveSelectorDiagnostics(delayMs) {
    console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] FOUND_TO_READY_SYNC_START');

    const query = this.createSelectorQuery ? this.createSelectorQuery() : wx.createSelectorQuery();
    const selectors = [
      '#xr-primitive-surface-box',
      '#xr-primitive-scene',
      '#xr-primitive-node',
      '#xr-primitive-object'
    ];

    const results = [];
    selectors.forEach(function (selector) {
      query.select(selector).boundingClientRect(function (rect) {
        results.push({
          selector: selector,
          found: !!rect,
          width: rect ? rect.width : 0,
          height: rect ? rect.height : 0,
          top: rect ? rect.top : 0,
          left: rect ? rect.left : 0
        });
      });
    });

    query.exec(() => {
      const surface = results.find(item => item.selector === '#xr-primitive-surface-box');
      const scene = results.find(item => item.selector === '#xr-primitive-scene');
      const node = results.find(item => item.selector === '#xr-primitive-node');
      const object = results.find(item => item.selector === '#xr-primitive-object');

      const surfaceFound = !!(surface && surface.found && surface.width > 0 && surface.height > 0);
      const sceneFound = !!(scene && scene.found);
      const nodeFound = !!(node && node.found);
      const objectFound = !!(object && object.found);

      console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] SURFACE_FOUND', surfaceFound ? surface : null);
      console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] PRIMITIVE_NODE_OR_OBJECT_FOUND', {
        nodeFound,
        objectFound
      });

      const nextState = normalizePrimitiveSampleState({
        selectorDiagnostics: results,
        surfaceBoxQueryResult: surfaceFound ? 'FOUND' : 'NOT_FOUND',
        sceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
        primitiveNodeQueryResult: nodeFound ? 'FOUND' : 'NOT_FOUND',
        primitiveObjectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
        selectorDiagnosticsCheckedAt: nowIso(),
        primitiveSampleMounted: surfaceFound,
        primitiveRenderSurfaceVisible: surfaceFound,
        primitiveSurfaceObserved: surfaceFound,
        primitiveObjectVisible: objectFound || nodeFound,
        primitiveSampleStatus: objectFound || nodeFound
          ? 'PRIMITIVE_RENDER_READY'
          : surfaceFound
            ? 'PRIMITIVE_RENDER_BLOCKED'
            : 'PRIMITIVE_RENDER_BLOCKED',
        primitiveBlockReason: objectFound || nodeFound
          ? ''
          : surfaceFound
            ? 'PRIMITIVE_OBJECT_QUERY_NOT_FOUND'
            : 'PRIMITIVE_SURFACE_QUERY_NOT_FOUND',
        primitiveCheckedAt: nowIso(),
        primitiveQueryResult: {
          surface,
          scene,
          node,
          object
        }
      });

      this.setData(nextState);

      if (nextState.primitiveSampleStatus === 'PRIMITIVE_RENDER_READY') {
        console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] PRIMITIVE_RENDER_READY_SYNCED');
        console.log('[XR_PRIMITIVE_FOUND_TO_READY_STATE_SYNC_FIX_V1] BLOCK_REASON_CLEARED');
      }
    });
  }
});
