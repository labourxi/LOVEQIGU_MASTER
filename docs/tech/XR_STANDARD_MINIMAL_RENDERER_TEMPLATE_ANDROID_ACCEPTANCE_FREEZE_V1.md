# XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_ANDROID_ACCEPTANCE_FREEZE_V1

## Acceptance Result

XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_ANDROID_PASS = YES

## Accepted Baseline Page

apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index

## Real Device

- Device OS: Android
- DevTools simulated profile may vary, but acceptance is based on Android real-device scan result.
- WeChat base library observed in devtools: 3.16.1
- WeChat version observed: 8.0.74

## Evidence

- PRIMITIVE_SAMPLE_MOUNTED = YES
- PRIMITIVE_RENDER_SURFACE_VISIBLE = YES
- PRIMITIVE_SURFACE_OBSERVED = YES
- PRIMITIVE_OBJECT_VISIBLE = YES
- PRIMITIVE_OBJECT_QUERY_RESULT = FOUND
- PRIMITIVE_SAMPLE_STATUS = PRIMITIVE_RENDER_READY
- SURFACE_BOX_QUERY_RESULT = FOUND
- SCENE_QUERY_RESULT = FOUND
- PRIMITIVE_NODE_QUERY_RESULT = FOUND
- Console: PRIMITIVE_RENDER_READY_SYNCED
- Console: BLOCK_REASON_CLEARED

## Technical Conclusion

xr-frame minimal GLTF rendering is feasible in the current project on Android real device.

The accepted template is xr-primitive-sample.

Future XR pages must start from this template instead of being created from scratch.

## Demoted Routes

The following routes are not current baseline:

- xr-simple-3d-render: experimental
- xr-simple-3d-frame component bridge: experimental
- Smoke Test inline xr-scene: stopped
- ordinary page mixed xr-scene: forbidden

## Rules Going Forward

Required:

- renderer page config includes "renderer": "xr-frame"
- xr-scene must be mounted according to accepted template
- no unverified component bridge as baseline
- no ordinary page mixed XR as baseline
- local GLTF path must follow accepted template
- camera / light / scale must follow accepted template

Forbidden before next phase:

- Marker
- Anchor
- external texture
- large GLB
- business data binding

## Next Recommended Task

XR_TEMPLATE_TO_SCENIC_POINT_RENDERER_PLAN_V1

Purpose:

Plan how to derive a real scenic-point XR renderer page from the accepted xr-primitive-sample template without modifying the baseline.
