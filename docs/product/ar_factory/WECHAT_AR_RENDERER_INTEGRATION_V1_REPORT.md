# WECHAT_AR_RENDERER_INTEGRATION_V1_REPORT

## Scope
Audit only. No code changes were required to determine whether the current miniapp can bind `LANDMARK_AR_P0_EFFECT_PROTOTYPE_V1` to WeChat XR-Frame.

## Repository Evidence

### XR-Frame / XR Renderer
- Search result for `XR-Frame`, `XRScene`, `XRAsset`, `XRFrame`, `createXR`, `xr-frame`, `wx.xr` in `apps/miniapp`, `scripts`, and `docs`: no runtime implementation found.
- There is no miniapp page or service that imports or instantiates a WeChat XR renderer.

### Current AR Runtime
- `apps/miniapp/services/ar-runtime/runtime-service.js`
  - Loads static runtime packages from `apps/miniapp/data/runtime/ar_factory/...`
  - Loads anchor payloads from generated `anchor.js`
  - Loads overlay assets from generated PNGs
  - Returns static routes such as `/pages/lottie/index?...`
  - Does not call WeChat XR APIs
- `apps/miniapp/pages/ar-entry/index.js`
  - Orchestrates `merchant-event` + `user-frontend` + `ar-runtime`
  - Uses `runtimePkg`, `loadAnchor()`, `loadOverlay()`, `startRuntimeFlow()`
  - No `XRFrame` / `XRScene` / `XRAsset` usage
- `apps/miniapp/pages/lottie/index.js`
  - Handles ritual preview and revelation flow
  - No XR renderer binding
- `apps/miniapp/services/ar-factory/ar-factory-service.js`
  - Reads static anchor / anchor quality evidence
  - Produces runtime package snapshots
  - No XR renderer binding

### Camera / Native AR Capability
- Search result for `<camera>`, `wx.createCameraContext`, `createCamera`, `takePhoto`, and `wx.createXRFrame`: no miniapp runtime usage found.
- Existing `camera_enabled: false` fields in chapter AR event data are canonical/runtime flags, not proof of camera renderer integration.

## Verdict

- `XR_FRAME_EXISTS = NO`
- `CAMERA_READY = NO`
- `ANCHOR_BINDING_READY = YES`
- `RUNTIME_TO_RENDERER_READY = NO`
- `WECHAT_AR_MVP_READY = NO`

## Why It Fails
1. The current miniapp AR chain is a static runtime-package + overlay flow, not a WeChat XR-Frame renderer.
2. The repo does not contain a real XR rendering layer or any `XRScene` / `XRAsset` / `XRFrame` integration.
3. There is no native camera/XR entry path that can consume `Dragon Overlay` as a live renderer surface.

## Recommended Technical Route
1. Keep the existing `LANDMARK_AR_P0_EFFECT_PROTOTYPE_V1` runtime package as the data source.
2. Add a dedicated WeChat XR-Frame renderer layer that:
   - binds the camera surface,
   - consumes the anchor payload,
   - maps `Dragon Imprint Lite` assets into XR rendering primitives,
   - renders the overlay as live scene content rather than static PNG preview.
3. Reuse the existing `AR_ENTITY` / `AR_EFFECT` / `AR_RUNTIME_FLOW` package shape as the renderer contract.

## Estimated Work
- Renderer spike: medium
- Camera + anchor binding: medium
- Overlay rendering replacement: medium
- Runtime integration into existing miniapp pages: low to medium

## Risk Points
- WeChat XR-Frame availability varies by SDK and device support.
- The current codebase already has a working static AR preview path; replacing it with XR rendering needs a separate renderer contract.
- The existing runtime package uses image overlays, not live GPU scene objects.

## Next Files To Touch
- `apps/miniapp/services/ar-runtime/runtime-service.js`
- `apps/miniapp/pages/ar-entry/index.js`
- `apps/miniapp/pages/lottie/index.js`
- `apps/miniapp/services/ar-factory/ar-factory-service.js`
- New XR renderer layer if the WeChat SDK is confirmed available

## Final Conclusion
- `WECHAT_AR_RENDERER_INTEGRATION_V1 = FAIL`

