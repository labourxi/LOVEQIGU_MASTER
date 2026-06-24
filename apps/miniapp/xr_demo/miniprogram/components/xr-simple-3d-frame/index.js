const TRACE = '[XR_SIMPLE_3D_ACTUAL_OBJECT_RENDER_V2]';
const PROBE_DELAYS_MS = [500, 1500, 3000];

function nowIsoString() {
  return new Date().toISOString();
}

function isVisibleRect(rect) {
  return !!rect && typeof rect.width === 'number' && typeof rect.height === 'number' && rect.width > 0 && rect.height > 0;
}

function buildDetail(state) {
  return {
    frameExists: Boolean(state.frameExists),
    sceneExists: Boolean(state.sceneExists),
    nodeExists: Boolean(state.nodeExists),
    objectExists: Boolean(state.objectExists),
    renderSurfaceExists: Boolean(state.renderSurfaceExists),
    objectVisible: Boolean(state.objectVisible),
    status: state.status,
    blockReason: state.blockReason,
    renderMode: 'GLTF_ONLY_BASELINE',
    checkedAt: nowIsoString(),
    error: state.error || ''
  };
}

function buildInternalDiagnosticsDetail(results) {
  const surface = results[0] || null;
  const scene = results[1] || null;
  const node = results[2] || null;
  const object = results[3] || null;
  const surfaceFound = isVisibleRect(surface);
  const nodeFound = isVisibleRect(node);
  const objectFound = isVisibleRect(object);
  const ready = Boolean(nodeFound || objectFound);
  return {
    surfaceFound,
    nodeFound,
    objectFound,
    ready,
    diagnostics: results,
    checkedAt: nowIsoString(),
    surfaceRect: surface || null,
    sceneRect: scene || null,
    nodeRect: node || null,
    objectRect: object || null
  };
}

Component({
  lifetimes: {
    created() {
      console.log(TRACE, 'SIMPLE_3D_COMPONENT_CREATED');
    },
    attached() {
      console.log(TRACE, 'SIMPLE_3D_COMPONENT_ATTACHED');
      this.emitMounted('attached');
    },
    ready() {
      console.log(TRACE, 'SIMPLE_3D_COMPONENT_READY');
      console.log(TRACE, 'SIMPLE_3D_COMPONENT_MOUNTED');
      this.emitMounted('ready');
      this.scheduleDiagnostics();
    },
    detached() {
      console.log(TRACE, 'SIMPLE_3D_COMPONENT_DETACHED');
      this.clearDiagnostics();
    }
  },

  pageLifetimes: {
    show() {
      this.scheduleDiagnostics();
    }
  },

  methods: {
    emitMounted(phase) {
      const detail = {
        mounted: true,
        phase: phase || 'ready',
        checkedAt: nowIsoString()
      };
      console.log(TRACE, 'SIMPLE_3D_MOUNTED_EVENT_RECEIVED', detail);
      this.triggerEvent('simple3dmounted', detail);
    },

    clearDiagnostics() {
      if (Array.isArray(this._diagnosticTimers)) {
        this._diagnosticTimers.forEach((timer) => clearTimeout(timer));
      }
      this._diagnosticTimers = [];
    },

    scheduleDiagnostics() {
      this.clearDiagnostics();
      this._diagnosticTimers = PROBE_DELAYS_MS.map((delay) => {
        return setTimeout(() => {
          this.runInternalDiagnostics('timer_' + delay);
        }, delay);
      });
    },

    runInternalDiagnostics(reason) {
      const checkedAt = nowIsoString();
      console.log('[XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1] INTERNAL_DIAGNOSTICS_START', {
        reason,
        checkedAt
      });

      const emitMounted = (diagnostics) => {
        const mountedDetail = {
          mounted: true,
          reason: reason || 'internal_diagnostics',
          checkedAt,
          diagnostics
        };
        console.log('[XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1] TRIGGER_SIMPLE3D_MOUNTED', mountedDetail);
        this.triggerEvent('simple3dmounted', mountedDetail);
      };

      const emitBlocked = (detail) => {
        if (this._hasReportedReady) {
          return;
        }
        console.log('[XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1] TRIGGER_SIMPLE3D_BLOCKED', detail);
        this.triggerEvent('simple3dblocked', detail);
      };

      const emitReady = (detail) => {
        if (this._hasReportedReady) {
          return;
        }
        this._hasReportedReady = true;
        console.log('[XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1] TRIGGER_SIMPLE3D_READY', detail);
        this.triggerEvent('simple3dready', detail);
      };

      console.log(TRACE, 'SIMPLE_3D_QUERY_START', {
        reason,
        checkedAt
      });

      if (typeof this.createSelectorQuery !== 'function') {
        const diagnostics = [];
        const detail = buildDetail({
          frameExists: false,
          sceneExists: false,
          nodeExists: false,
          objectExists: false,
          renderSurfaceExists: false,
          objectVisible: false,
          status: 'SIMPLE_3D_RENDER_BLOCKED',
          blockReason: 'XR_SIMPLE_GEOMETRY_TAG_NOT_AVAILABLE',
          error: 'XR_SIMPLE_GEOMETRY_TAG_NOT_AVAILABLE'
        });
        console.log('[XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1] INTERNAL_QUERY_RESULT', diagnostics);
        console.log(TRACE, 'SIMPLE_3D_QUERY_RESULT', detail);
        console.log(TRACE, 'SIMPLE_3D_RENDER_BLOCKED', detail);
        emitMounted(diagnostics);
        emitBlocked({
          objectVisible: false,
          status: 'SIMPLE_3D_RENDER_BLOCKED',
          blockReason: 'SIMPLE_3D_SURFACE_QUERY_NOT_FOUND_INTERNAL',
          renderMode: 'GLTF_ONLY_BASELINE',
          surfaceFound: false,
          nodeFound: false,
          objectFound: false,
          diagnostics,
          checkedAt
        });
        return;
      }

      const query = this.createSelectorQuery();
      query.select('#xr-simple-3d-surface-box').boundingClientRect();
      query.select('#xr-simple-3d-scene').boundingClientRect();
      query.select('#xr-simple-3d-node').boundingClientRect();
      query.select('#xr-simple-3d-object').boundingClientRect();
      query.exec((res) => {
        const results = Array.isArray(res) ? res : [];
        const detail = buildInternalDiagnosticsDetail(results);
        const diagnostics = [
          { selector: '#xr-simple-3d-surface-box', found: detail.surfaceFound, width: detail.surfaceRect ? detail.surfaceRect.width : 0, height: detail.surfaceRect ? detail.surfaceRect.height : 0, top: detail.surfaceRect ? detail.surfaceRect.top : 0, left: detail.surfaceRect ? detail.surfaceRect.left : 0 },
          { selector: '#xr-simple-3d-scene', found: !!detail.sceneRect, width: detail.sceneRect ? detail.sceneRect.width : 0, height: detail.sceneRect ? detail.sceneRect.height : 0, top: detail.sceneRect ? detail.sceneRect.top : 0, left: detail.sceneRect ? detail.sceneRect.left : 0 },
          { selector: '#xr-simple-3d-node', found: detail.nodeFound, width: detail.nodeRect ? detail.nodeRect.width : 0, height: detail.nodeRect ? detail.nodeRect.height : 0, top: detail.nodeRect ? detail.nodeRect.top : 0, left: detail.nodeRect ? detail.nodeRect.left : 0 },
          { selector: '#xr-simple-3d-object', found: detail.objectFound, width: detail.objectRect ? detail.objectRect.width : 0, height: detail.objectRect ? detail.objectRect.height : 0, top: detail.objectRect ? detail.objectRect.top : 0, left: detail.objectRect ? detail.objectRect.left : 0 }
        ];
        let status = 'SIMPLE_3D_RENDER_BLOCKED';
        let blockReason = 'XR_RENDER_NODE_NOT_FOUND';
        if (!detail.surfaceFound) {
          blockReason = 'XR_SIMPLE_GEOMETRY_TAG_NOT_AVAILABLE';
        } else if (detail.ready) {
          status = 'SIMPLE_3D_RENDER_READY';
          blockReason = '';
        } else {
          blockReason = 'SIMPLE_3D_OBJECT_QUERY_NOT_FOUND_INTERNAL';
        }

        const eventDetail = buildDetail({
          frameExists: detail.surfaceFound,
          sceneExists: Boolean(detail.sceneRect),
          nodeExists: detail.nodeFound,
          objectExists: detail.objectFound,
          renderSurfaceExists: detail.surfaceFound || Boolean(detail.sceneRect),
          objectVisible: detail.ready,
          status,
          blockReason
        });

        console.log('[XR_SIMPLE_3D_COMPONENT_INTERNAL_DIAGNOSTICS_AND_EVENT_BRIDGE_FIX_V1] INTERNAL_QUERY_RESULT', diagnostics);
        console.log(TRACE, 'SIMPLE_3D_FRAME_QUERY', detail.surfaceRect);
        console.log(TRACE, 'SIMPLE_3D_SCENE_QUERY', detail.sceneRect);
        console.log(TRACE, 'SIMPLE_3D_NODE_QUERY', detail.nodeRect);
        console.log(TRACE, 'SIMPLE_3D_OBJECT_QUERY', detail.objectRect);
        console.log(TRACE, 'SIMPLE_3D_QUERY_RESULT', eventDetail);
        emitMounted(diagnostics);

        if (status === 'SIMPLE_3D_RENDER_READY') {
          console.log(TRACE, 'SIMPLE_3D_RENDER_READY', eventDetail);
          emitReady({
            objectVisible: true,
            status: 'SIMPLE_3D_RENDER_READY',
            blockReason: '',
            renderMode: 'GLTF_ONLY_BASELINE',
            surfaceFound: detail.surfaceFound,
            nodeFound: detail.nodeFound,
            objectFound: detail.objectFound,
            diagnostics,
            checkedAt
          });
        } else {
          console.log(TRACE, 'SIMPLE_3D_RENDER_BLOCKED', eventDetail);
          emitBlocked({
            objectVisible: false,
            status: 'SIMPLE_3D_RENDER_BLOCKED',
            blockReason,
            renderMode: 'GLTF_ONLY_BASELINE',
            surfaceFound: detail.surfaceFound,
            nodeFound: detail.nodeFound,
            objectFound: detail.objectFound,
            diagnostics,
            checkedAt
          });
        }
      });
    }
  }
});
