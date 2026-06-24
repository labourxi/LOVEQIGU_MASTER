# XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_V1

## Template Source

Current trusted baseline page:

apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index

This page is frozen as the current minimal XR renderer template.

## Acceptance Evidence

- PRIMITIVE_SAMPLE_MOUNTED = YES
- PRIMITIVE_RENDER_SURFACE_VISIBLE = YES
- PRIMITIVE_SURFACE_OBSERVED = YES
- PRIMITIVE_OBJECT_VISIBLE = YES
- PRIMITIVE_OBJECT_QUERY_RESULT = FOUND
- PRIMITIVE_SAMPLE_STATUS = PRIMITIVE_RENDER_READY
- GLTF_ONLY_BASELINE = PASS

## Official Rules Applied

- renderer page must configure "renderer": "xr-frame"
- xr-scene must be the root node
- no mixed view / button / text in renderer page
- no wx:if around xr-scene
- local gltf path should be relative to page directory
- camera position / target required
- ambient light and directional light required
- gltf scale should be explicit
- selectorQuery can query inline xr-scene / xr-node / xr-gltf
- eventChannel or wx.setStorageSync can return result to normal page

## Standard XR Page Requirements

Any future XR renderer page must copy this template structure first.

Required:

- index.json includes "renderer": "xr-frame"
- index.wxml has xr-scene as root node
- no ordinary UI components in renderer page
- xr-scene always mounted
- model path uses local relative path or approved remote URL
- camera has position and target
- ambient light exists
- directional light exists
- model scale is explicit
- result reporting must use storage or eventChannel if opened from normal page

Forbidden:

- view / button / text / scroll-view inside renderer page
- wx:if on xr-scene
- cross-component selectorQuery for xr-frame internals
- unverified primitive syntax
- large GLB / texture before baseline pass
- Marker / Anchor before minimal renderer pass

## Product Strategy

XR-Frame is not an MVP blocker.

MVP product layer may continue with:

- normal miniapp pages
- scan / exploration point
- token / blessing reveal
- Canvas / Lottie / particle animation
- static 3D-like visual ceremony

XR-Frame remains an enhancement layer until the standard renderer template is stable.

## Next Rule

All future XR work must start from this template:

XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_V1

Do not create new XR pages from scratch.

## Current Page Status

- xr-simple-3d-render = experimental / not current baseline
- Smoke Test entry points to xr-primitive-sample standard template
