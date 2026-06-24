function inspectXrRuntime() {
  const hasWx = typeof wx !== 'undefined';
  const hasCreateXRFrame = hasWx && typeof wx.createXRFrame === 'function';
  const hasCreateCameraContext = hasWx && typeof wx.createCameraContext === 'function';
  const hasCameraComponent = hasWx && typeof wx.canIUse === 'function' ? wx.canIUse('camera') : false;
  const hasXRScene = typeof globalThis !== 'undefined' && typeof globalThis.XRScene !== 'undefined';
  const hasXRAsset = typeof globalThis !== 'undefined' && typeof globalThis.XRAsset !== 'undefined';
  const hasXRFrame = typeof globalThis !== 'undefined' && typeof globalThis.XRFrame !== 'undefined';

  return {
    xrFrameExists: Boolean(hasCreateXRFrame || hasXRFrame),
    cameraReady: Boolean(hasCreateCameraContext || hasCameraComponent),
    xrSceneReady: Boolean(hasXRScene),
    xrAssetReady: Boolean(hasXRAsset),
    xrObjectRenderReady: Boolean((hasCreateXRFrame || hasXRFrame) && hasXRScene && hasXRAsset),
    devtoolsHint: hasCreateXRFrame
      ? 'XR-Frame API detected; attempting bootstrap'
      : 'XR-Frame API not available in this runtime'
  };
}

function tryBootstrapXrFrame() {
  if (typeof wx === 'undefined' || typeof wx.createXRFrame !== 'function') {
    return { ok: false, reason: 'wx.createXRFrame unavailable' };
  }

  try {
    const xr = wx.createXRFrame({
      fail: function fail() {}
    });
    return { ok: Boolean(xr), reason: xr ? 'XRFrame created' : 'XRFrame creation returned empty' };
  } catch (error) {
    return { ok: false, reason: error && error.message ? error.message : 'XRFrame creation failed' };
  }
}

Page({
  data: {
    xrFrameExists: false,
    cameraReady: false,
    xrSceneReady: false,
    xrAssetReady: false,
    xrObjectRenderReady: false,
    xrBootstrapReady: false,
    bootstrapReason: '',
    devtoolsHint: '',
    renderState: 'WAITING',
    deviceVerificationRequired: false
  },

  onLoad() {
    const caps = inspectXrRuntime();
    const bootstrap = tryBootstrapXrFrame();
    const renderState = bootstrap.ok ? 'BOOTED' : 'FAILED';
    this.setData({
      xrFrameExists: caps.xrFrameExists,
      cameraReady: caps.cameraReady,
      xrSceneReady: caps.xrSceneReady,
      xrAssetReady: caps.xrAssetReady,
      xrObjectRenderReady: caps.xrObjectRenderReady,
      xrBootstrapReady: bootstrap.ok,
      bootstrapReason: bootstrap.reason,
      devtoolsHint: caps.devtoolsHint,
      renderState,
      deviceVerificationRequired: !bootstrap.ok
    });
  }
});
