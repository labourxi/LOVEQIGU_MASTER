# XR_SCENIC_POINT_RENDERER_WRAPPER_ENTRY_V1

## Purpose

Add a safe wrapper entry in XR Smoke Test that opens the accepted scenic-point renderer and reads the storage result after return.

## Accepted Renderer

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Implementation

- smoke_test_wrapper_entry_added:
- navigate_to_renderer_added:
- storage_result_read_added:
- fallback_ux_added:
- renderer_internals_unchanged:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Result Storage

Reads:

XR_SCENIC_POINT_RENDER_RESULT_V1

Displays:

- XR_SCENIC_POINT_RENDER_RETURNED
- XR_SCENIC_POINT_RENDER_STATUS
- XR_SCENIC_POINT_OBJECT_VISIBLE
- XR_SCENIC_POINT_BLOCK_REASON
- XR_SCENIC_POINT_CHECKED_AT

## Acceptance Criteria

After opening Renderer and returning to XR Smoke Test:

- XR_SCENIC_POINT_RENDER_RETURNED = YES
- XR_SCENIC_POINT_RENDER_STATUS = READY / BLOCKED / UNKNOWN
- XR_SCENIC_POINT_OBJECT_VISIBLE = YES / NO
- XR_SCENIC_POINT_BLOCK_REASON is shown if blocked
- fallback copy appears if not ready

## Forbidden

- Do not modify renderer internals
- Do not mix xr-scene in Smoke Test
- Do not add Marker / Anchor / ARSystem / VisionKit
- Do not bind business data
