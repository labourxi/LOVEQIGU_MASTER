# XR_TEMPLATE_TO_SCENIC_POINT_RENDERER_PLAN_V1

## Purpose

Plan the first real scenic-point XR renderer page derived from the accepted xr-primitive-sample baseline.

This plan must not modify the accepted baseline.

## Accepted Baseline

apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index

Accepted status:

- XR_STANDARD_MINIMAL_RENDERER_TEMPLATE_ANDROID_PASS = YES
- PRIMITIVE_SAMPLE_FROZEN_AS_ACCEPTED_BASELINE = YES

## Why Derive Instead Of Rewrite

Future XR pages must copy the accepted baseline structure because:

- renderer="xr-frame" configuration is sensitive
- xr-scene must follow the accepted root structure
- camera / light / scale / gltf path must remain stable
- ordinary page mixed XR is forbidden
- component bridge is not accepted as baseline

## Proposed New Page

Recommended new page path:

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

Purpose:

Render a single scenic-point XR object using the accepted minimal XR template.

Initial scope:

- one local minimal GLTF
- no Marker
- no Anchor
- no external texture
- no business data binding
- no dynamic model switching
- no runtime chapter data
- no merchant data
- no activity data

## Page Rules

Required:

- index.json must include "renderer": "xr-frame"
- xr-scene must be root node
- no view / button / text / scroll-view inside renderer page
- xr-scene must not use wx:if
- local model path must be relative to page directory
- camera position and target must be explicit
- ambient light required
- directional light required
- model scale explicit
- diagnostic logs required
- result must be written to storage if opened from normal page

Forbidden:

- Marker
- Anchor
- Plane tracking
- ARSystem
- VisionKit
- external GLB
- texture
- large asset over 200KB
- business data
- cross-component selectorQuery
- ordinary UI mixed into renderer page

## Derivation Strategy

Step 1:

Copy xr-primitive-sample into a new page:

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

Step 2:

Rename internal ids only if necessary:

- xr-scenic-point-scene
- xr-scenic-point-object
- xr-scenic-point-gltf
- xr-scenic-point-camera

Step 3:

Keep model path local:

models/test.gltf

Step 4:

Keep camera / light / scale structure aligned with accepted baseline.

Step 5:

Add only minimal result reporting:

wx.setStorageSync('XR_SCENIC_POINT_RENDER_RESULT_V1', result)

Step 6:

Do Android real-device verification.

## Acceptance Criteria

The first scenic-point renderer page can be accepted only if Android real-device scan confirms:

- XR_SCENIC_POINT_RENDER_PAGE_OPENED = YES
- XR_SCENIC_POINT_SCENE_READY = YES
- XR_SCENIC_POINT_SURFACE_VISIBLE = YES
- XR_SCENIC_POINT_OBJECT_VISIBLE = YES
- XR_SCENIC_POINT_OBJECT_QUERY_RESULT = FOUND
- XR_SCENIC_POINT_RENDER_STATUS = READY
- XR_SCENIC_POINT_BLOCK_REASON = 空

## Stop Conditions

If derived page fails while baseline page still passes:

- do not modify baseline
- compare index.json / wxml / wxss / js against baseline
- rollback derived page to baseline clone
- do not introduce Marker / Anchor until minimal derived page passes

## Product Integration Boundary

Before this derived page passes:

Product pages may continue with:

- normal miniapp UI
- scan entry
- exploration point page
- blessing reveal
- token display
- Canvas / Lottie / particle animation

XR must remain enhancement layer, not MVP blocker.

## Next Implementation Task

XR_SCENIC_POINT_RENDERER_BASELINE_DERIVATION_V1

Purpose:

Create the first derived renderer page by cloning the accepted xr-primitive-sample baseline.

## Final Output

- XR_TEMPLATE_TO_SCENIC_POINT_RENDERER_PLAN_CREATED = YES
- ACCEPTED_BASELINE_REFERENCED = YES
- NEW_RENDERER_PAGE_PATH_PROPOSED = YES
- MARKER_INCLUDED = NO
- ANCHOR_INCLUDED = NO
- BUSINESS_DATA_INCLUDED = NO
- READY_FOR_SCENIC_POINT_RENDERER_DERIVATION = YES
