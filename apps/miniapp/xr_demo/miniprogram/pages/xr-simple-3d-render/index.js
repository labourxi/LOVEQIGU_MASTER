function nowIsoString() {
  try {
    return new Date().toISOString();
  } catch (err) {
    return '';
  }
}

function buildResult(payload) {
  return {
    status: payload.status || 'SIMPLE_3D_RENDER_UNKNOWN',
    objectVisible: Boolean(payload.objectVisible),
    blockReason: payload.blockReason || '',
    sceneReady: Boolean(payload.sceneReady),
    assetLoaded: Boolean(payload.assetLoaded),
    assetError: payload.assetError || '',
    sceneQueryResult: payload.sceneQueryResult || 'NOT_FOUND',
    objectQueryResult: payload.objectQueryResult || 'NOT_FOUND',
    gltfQueryResult: payload.gltfQueryResult || 'NOT_FOUND',
    cameraQueryResult: payload.cameraQueryResult || 'NOT_FOUND',
    checkedAt: payload.checkedAt || nowIsoString(),
    source: payload.source || 'dedicated_renderer_page'
  };
}

Page({
  data: {
    sceneReady: false,
    assetLoaded: false,
    assetError: '',
    objectFound: false,
    gltfFound: false,
    renderStatus: 'NOT_STARTED',
    blockReason: '',
    lastPublishedStatus: '',
    checkedAt: '',
    sceneQueryResult: 'NOT_FOUND',
    objectQueryResult: 'NOT_FOUND',
    gltfQueryResult: 'NOT_FOUND',
    cameraQueryResult: 'NOT_FOUND'
  },

  onLoad() {
    this._diagnosticsTimers = [];
    this._reportedReady = false;
    this._eventChannel = this.getOpenerEventChannel ? this.getOpenerEventChannel() : null;
    this._latestRendererResult = null;

    const checkedAt = nowIsoString();
    this.publishRendererResult({
      status: 'SIMPLE_3D_RENDER_STARTED',
      objectVisible: false,
      blockReason: '',
      sceneReady: false,
      assetLoaded: false,
      assetError: '',
      sceneQueryResult: '',
      objectQueryResult: '',
      gltfQueryResult: '',
      cameraQueryResult: '',
      checkedAt
    });
  },

  onReady() {
    this.scheduleRendererDiagnostics();
  },

  onUnload() {
    const latestResult = this._latestRendererResult;
    if (latestResult) {
      this.publishRendererResult(latestResult);
    } else {
      this.publishRendererResult({
        status: 'SIMPLE_3D_RENDER_BLOCKED',
        objectVisible: false,
        blockReason: 'SIMPLE_3D_RENDERER_UNLOADED_WITHOUT_RESULT',
        sceneReady: this.data.sceneReady,
        assetLoaded: this.data.assetLoaded,
        assetError: this.data.assetError || '',
        sceneQueryResult: this.data.sceneQueryResult || 'NOT_FOUND',
        objectQueryResult: this.data.objectQueryResult || 'NOT_FOUND',
        gltfQueryResult: this.data.gltfQueryResult || 'NOT_FOUND',
        cameraQueryResult: this.data.cameraQueryResult || 'NOT_FOUND',
        checkedAt: nowIsoString()
      });
    }
    this.clearRendererDiagnostics();
  },

  handleSceneReady(event) {
    console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] SCENE_READY', event);
    const checkedAt = nowIsoString();
    this.setData({
      sceneReady: true,
      renderStatus: 'SIMPLE_3D_RENDER_SCENE_READY',
      lastPublishedStatus: 'SIMPLE_3D_RENDER_SCENE_READY',
      checkedAt
    });
    this.publishRendererResult({
      status: 'SIMPLE_3D_RENDER_SCENE_READY',
      objectVisible: false,
      blockReason: '',
      sceneReady: true,
      assetLoaded: this.data.assetLoaded,
      assetError: this.data.assetError || '',
      sceneQueryResult: 'READY_EVENT_FIRED',
      objectQueryResult: this.data.objectQueryResult || 'NOT_FOUND',
      gltfQueryResult: this.data.gltfQueryResult || 'NOT_FOUND',
      cameraQueryResult: this.data.cameraQueryResult || 'NOT_FOUND',
      checkedAt
    });
    setTimeout(() => {
      this.runRendererDiagnostics('scene_ready');
    }, 1000);
  },

  handleAssetLoad(event) {
    console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] ASSET_LOAD', event);
    const checkedAt = nowIsoString();
    this.setData({
      assetLoaded: true,
      assetError: '',
      renderStatus: 'SIMPLE_3D_RENDER_ASSET_LOADED',
      lastPublishedStatus: 'SIMPLE_3D_RENDER_ASSET_LOADED',
      checkedAt
    });
    this.publishRendererResult({
      status: 'SIMPLE_3D_RENDER_ASSET_LOADED',
      objectVisible: false,
      blockReason: '',
      sceneReady: this.data.sceneReady,
      assetLoaded: true,
      assetError: '',
      sceneQueryResult: this.data.sceneQueryResult || 'NOT_FOUND',
      objectQueryResult: this.data.objectQueryResult || 'NOT_FOUND',
      gltfQueryResult: this.data.gltfQueryResult || 'NOT_FOUND',
      cameraQueryResult: this.data.cameraQueryResult || 'NOT_FOUND',
      checkedAt
    });
    setTimeout(() => {
      this.runRendererDiagnostics('asset_loaded');
    }, 1000);
  },

  handleAssetError(event) {
    console.error('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] ASSET_ERROR', event);
    const checkedAt = nowIsoString();
    const assetError = JSON.stringify((event && event.detail) || event || {});
    this.setData({
      assetLoaded: false,
      assetError,
      renderStatus: 'SIMPLE_3D_RENDER_BLOCKED',
      blockReason: 'SIMPLE_3D_RENDER_ASSET_LOAD_ERROR',
      lastPublishedStatus: 'SIMPLE_3D_RENDER_BLOCKED',
      checkedAt
    });
    this.publishRendererResult({
      status: 'SIMPLE_3D_RENDER_BLOCKED',
      objectVisible: false,
      blockReason: 'SIMPLE_3D_RENDER_ASSET_LOAD_ERROR',
      sceneReady: this.data.sceneReady,
      assetLoaded: false,
      assetError,
      sceneQueryResult: this.data.sceneQueryResult || 'NOT_FOUND',
      objectQueryResult: this.data.objectQueryResult || 'NOT_FOUND',
      gltfQueryResult: this.data.gltfQueryResult || 'NOT_FOUND',
      cameraQueryResult: this.data.cameraQueryResult || 'NOT_FOUND',
      checkedAt
    });
  },

  clearRendererDiagnostics() {
    if (Array.isArray(this._diagnosticsTimers)) {
      this._diagnosticsTimers.forEach((timer) => clearTimeout(timer));
    }
    this._diagnosticsTimers = [];
  },

  scheduleRendererDiagnostics() {
    this.clearRendererDiagnostics();
    const delays = [1000, 3000, 5000, 8000, 10000];
    this._diagnosticsTimers = delays.map((delay) => {
      return setTimeout(() => {
        this.runRendererDiagnostics('timer_' + delay);
      }, delay);
    });
  },

  publishRendererResult(result) {
    const normalized = buildResult(result || {});
    this._latestRendererResult = normalized;
    console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] PUBLISH_RENDERER_RESULT', normalized);

    this.setData({
      sceneReady: normalized.sceneReady,
      assetLoaded: normalized.assetLoaded,
      assetError: normalized.assetError,
      objectFound: normalized.objectVisible,
      gltfFound: normalized.gltfQueryResult === 'FOUND',
      renderStatus: normalized.status,
      blockReason: normalized.blockReason,
      lastPublishedStatus: normalized.status,
      checkedAt: normalized.checkedAt,
      sceneQueryResult: normalized.sceneQueryResult,
      objectQueryResult: normalized.objectQueryResult,
      gltfQueryResult: normalized.gltfQueryResult,
      cameraQueryResult: normalized.cameraQueryResult
    });

    try {
      wx.setStorageSync('XR_SIMPLE_3D_RENDER_RESULT_V1', normalized);
    } catch (err) {
      console.warn('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] STORAGE_WRITE_FAIL', err);
    }

    if (this._eventChannel && typeof this._eventChannel.emit === 'function') {
      try {
        this._eventChannel.emit('simple3dRendererResult', normalized);
      } catch (err) {
        console.warn('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] EVENT_CHANNEL_EMIT_FAIL', err);
      }
    }

    return normalized;
  },

  runRendererDiagnostics(reason) {
    if (this._reportedReady && this.data.renderStatus === 'SIMPLE_3D_RENDER_READY') {
      return;
    }

    console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] RENDERER_DIAGNOSTICS_START', {
      reason: reason || 'manual'
    });

    const queryFactory = typeof this.createSelectorQuery === 'function'
      ? this.createSelectorQuery()
      : (typeof wx !== 'undefined' && typeof wx.createSelectorQuery === 'function' ? wx.createSelectorQuery() : null);

    if (!queryFactory) {
      const checkedAt = nowIsoString();
      const result = this.publishRendererResult({
        status: 'SIMPLE_3D_RENDER_BLOCKED',
        objectVisible: false,
        blockReason: 'SIMPLE_3D_RENDERER_SELECTOR_QUERY_UNAVAILABLE',
        sceneReady: this.data.sceneReady,
        assetLoaded: this.data.assetLoaded,
        assetError: this.data.assetError || '',
        sceneQueryResult: 'NOT_FOUND',
        objectQueryResult: 'NOT_FOUND',
        gltfQueryResult: 'NOT_FOUND',
        cameraQueryResult: 'NOT_FOUND',
        checkedAt
      });
      this.setData({
        renderStatus: result.status,
        blockReason: result.blockReason,
        checkedAt: result.checkedAt,
        sceneQueryResult: result.sceneQueryResult,
        objectQueryResult: result.objectQueryResult,
        gltfQueryResult: result.gltfQueryResult,
        cameraQueryResult: result.cameraQueryResult
      });
      console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] RENDERER_DIAGNOSTICS_BLOCKED', result);
      return;
    }

    const query = queryFactory.in ? queryFactory.in(this) : queryFactory;
    query.select('#xr-simple-3d-render-scene').boundingClientRect();
    query.select('#xr-simple-3d-render-object').boundingClientRect();
    query.select('#xr-simple-3d-render-gltf').boundingClientRect();
    query.select('#xr-simple-3d-render-camera').boundingClientRect();

    query.exec((res) => {
      const results = Array.isArray(res) ? res : [];
      const sceneRect = results[0] || null;
      const objectRect = results[1] || null;
      const gltfRect = results[2] || null;
      const cameraRect = results[3] || null;
      const sceneFound = Boolean(sceneRect && sceneRect.width > 0 && sceneRect.height > 0);
      const objectFound = Boolean(objectRect && objectRect.width > 0 && objectRect.height > 0);
      const gltfFound = Boolean(gltfRect && gltfRect.width > 0 && gltfRect.height > 0);
      const cameraFound = Boolean(cameraRect && cameraRect.width > 0 && cameraRect.height > 0);
      const objectOrGltfFound = Boolean(objectFound || gltfFound);
      const checkedAt = nowIsoString();

      console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] RENDERER_DIAGNOSTICS_RESULT', {
        reason: reason || 'manual',
        sceneFound,
        objectFound,
        gltfFound,
        cameraFound,
        checkedAt
      });

      if (this._reportedReady && this.data.renderStatus === 'SIMPLE_3D_RENDER_READY') {
        return;
      }

      if (sceneFound && objectOrGltfFound) {
        this._reportedReady = true;
        const result = this.publishRendererResult({
          status: 'SIMPLE_3D_RENDER_READY',
          objectVisible: true,
          blockReason: '',
          sceneReady: true,
          assetLoaded: this.data.assetLoaded,
          assetError: this.data.assetError || '',
          sceneQueryResult: 'FOUND',
          objectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          gltfQueryResult: gltfFound ? 'FOUND' : 'NOT_FOUND',
          cameraQueryResult: cameraFound ? 'FOUND' : 'NOT_FOUND',
          checkedAt
        });
        this.setData({
          sceneReady: true,
          objectFound: true,
          gltfFound,
          renderStatus: result.status,
          blockReason: '',
          checkedAt: result.checkedAt,
          sceneQueryResult: 'FOUND',
          objectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
          gltfQueryResult: gltfFound ? 'FOUND' : 'NOT_FOUND',
          cameraQueryResult: cameraFound ? 'FOUND' : 'NOT_FOUND'
        });
        console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] SIMPLE_3D_RENDER_READY', result);
        return;
      }

      const blockReason = sceneFound
        ? 'SIMPLE_3D_RENDER_OBJECT_OR_GLTF_NOT_FOUND'
        : 'SIMPLE_3D_RENDER_SCENE_NOT_FOUND';

      const result = this.publishRendererResult({
        status: 'SIMPLE_3D_RENDER_BLOCKED',
        objectVisible: false,
        blockReason,
        sceneReady: sceneFound,
        assetLoaded: this.data.assetLoaded,
        assetError: this.data.assetError || '',
        sceneQueryResult: sceneFound ? 'FOUND' : 'NOT_FOUND',
        objectQueryResult: objectFound ? 'FOUND' : 'NOT_FOUND',
        gltfQueryResult: gltfFound ? 'FOUND' : 'NOT_FOUND',
        cameraQueryResult: cameraFound ? 'FOUND' : 'NOT_FOUND',
        checkedAt
      });

      this.setData({
        sceneReady: sceneFound,
        objectFound,
        gltfFound,
        renderStatus: result.status,
        blockReason: result.blockReason,
        checkedAt: result.checkedAt,
        sceneQueryResult: result.sceneQueryResult,
        objectQueryResult: result.objectQueryResult,
        gltfQueryResult: result.gltfQueryResult,
        cameraQueryResult: result.cameraQueryResult
      });

      console.log('[XR_SIMPLE_3D_RENDERER_CAMERA_LIGHT_SCALE_FIX_V1] SIMPLE_3D_RENDER_BLOCKED', result);
    });
  }
});
