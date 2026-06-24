function detectCapabilities() {
  const hasWx = typeof wx !== 'undefined';
  const hasCreateXRFrame = hasWx && typeof wx.createXRFrame === 'function';
  const hasCameraComponent = hasWx && typeof wx.canIUse === 'function'
    ? wx.canIUse('camera')
    : false;
  const hasCameraContext = hasWx && typeof wx.createCameraContext === 'function';
  const hasXRScene = typeof globalThis !== 'undefined' && typeof globalThis.XRScene !== 'undefined';
  const hasXRAsset = typeof globalThis !== 'undefined' && typeof globalThis.XRAsset !== 'undefined';
  const hasXRFrame = typeof globalThis !== 'undefined' && typeof globalThis.XRFrame !== 'undefined';

  return {
    xrFrameExists: hasCreateXRFrame || hasXRFrame,
    xrSceneReady: hasXRScene,
    xrAssetReady: hasXRAsset,
    cameraReady: hasCameraComponent || hasCameraContext,
    runtimeMessage: hasCreateXRFrame
      ? 'XR-Frame API detected in current runtime'
      : 'XR-Frame API not detected in current miniapp runtime'
  };
}

Page({
  data: {
    xrFrameExists: false,
    cameraReady: false,
    xrSceneReady: false,
    xrAssetReady: false,
    xrObjectRenderReady: false,
    spikeReady: false,
    runtimeMessage: '',
    renderHint: '等待能力检测'
  },

  onLoad() {
    const caps = detectCapabilities();
    const xrObjectRenderReady = Boolean(caps.xrFrameExists && caps.xrSceneReady && caps.xrAssetReady);
    this.setData({
      xrFrameExists: caps.xrFrameExists,
      cameraReady: caps.cameraReady,
      xrSceneReady: caps.xrSceneReady,
      xrAssetReady: caps.xrAssetReady,
      xrObjectRenderReady,
      spikeReady: Boolean(caps.xrFrameExists && caps.cameraReady && xrObjectRenderReady),
      runtimeMessage: caps.runtimeMessage,
      renderHint: xrObjectRenderReady
        ? '可以进入 XR 渲染验证'
        : '当前工程未发现 XR-Frame / XRScene / XRAsset 运行时接入'
    });
  },
});
