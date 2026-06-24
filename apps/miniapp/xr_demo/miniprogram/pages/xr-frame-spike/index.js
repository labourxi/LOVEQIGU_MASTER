function detectXrCapabilities() {
  const hasWx = typeof wx !== 'undefined';
  const hasCamera = hasWx && typeof wx.createCameraContext === 'function';
  const canUseCamera = hasWx && typeof wx.canIUse === 'function' ? wx.canIUse('camera') : false;
  const hasXrFrameApi = hasWx && typeof wx.createXRFrame === 'function';
  const hasXrFrameGlobal = typeof globalThis !== 'undefined' && typeof globalThis.XRFrame !== 'undefined';
  const hasXrScene = typeof globalThis !== 'undefined' && typeof globalThis.XRScene !== 'undefined';
  const hasXrAsset = typeof globalThis !== 'undefined' && typeof globalThis.XRAsset !== 'undefined';

  return {
    xrFrameExists: Boolean(hasXrFrameApi || hasXrFrameGlobal),
    cameraReady: Boolean(hasCamera || canUseCamera),
    xrSceneReady: Boolean(hasXrScene),
    xrObjectRenderReady: Boolean((hasXrFrameApi || hasXrFrameGlobal) && hasXrScene && hasXrAsset),
    xrAssetReady: Boolean(hasXrAsset),
    pluginReady: false,
    devtoolsMessage: hasXrFrameApi
      ? 'XR-Frame API detected'
      : 'XR-Frame API not found in this miniapp runtime'
  };
}

Page({
  data: {
    xrFrameExists: false,
    cameraReady: false,
    xrSceneReady: false,
    xrAssetReady: false,
    xrObjectRenderReady: false,
    pluginReady: false,
    devtoolsMessage: '',
    bootState: 'WAITING'
  },

  onLoad() {
    const caps = detectXrCapabilities();
    const bootState = caps.xrObjectRenderReady ? 'READY' : 'NOT_READY';
    this.setData({
      xrFrameExists: caps.xrFrameExists,
      cameraReady: caps.cameraReady,
      xrSceneReady: caps.xrSceneReady,
      xrAssetReady: caps.xrAssetReady,
      xrObjectRenderReady: caps.xrObjectRenderReady,
      pluginReady: caps.pluginReady,
      devtoolsMessage: caps.devtoolsMessage,
      bootState
    });
  }
});
