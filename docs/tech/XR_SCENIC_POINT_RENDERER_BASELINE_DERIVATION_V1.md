# XR_SCENIC_POINT_RENDERER_BASELINE_DERIVATION_V1

## Purpose

Create the first derived scenic-point XR renderer page from the accepted xr-primitive-sample baseline.

## Source Baseline

apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/index

## New Page

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Scope

- local minimal GLTF only
- no Marker
- no Anchor
- no Plane tracking
- no ARSystem
- no VisionKit
- no texture
- no business data
- no dynamic model switching

## Implementation

- baseline_cloned:
- renderer_xr_frame_configured:
- local_gltf_copied:
- app_json_registered:
- scenic_point_status_prefix_added:
- storage_result_added:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Acceptance Criteria

Android real-device scan must confirm:

- XR_SCENIC_POINT_RENDER_PAGE_OPENED = YES
- XR_SCENIC_POINT_SCENE_READY = YES
- XR_SCENIC_POINT_SURFACE_VISIBLE = YES
- XR_SCENIC_POINT_OBJECT_VISIBLE = YES
- XR_SCENIC_POINT_OBJECT_QUERY_RESULT = FOUND
- XR_SCENIC_POINT_RENDER_STATUS = READY
- XR_SCENIC_POINT_BLOCK_REASON = 空

## Rollback Rule

If this page fails while xr-primitive-sample still passes:

- do not modify xr-primitive-sample
- compare derived page against baseline
- rollback derived page to exact baseline clone
- do not introduce Marker / Anchor
