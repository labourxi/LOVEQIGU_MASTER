# XR_PRODUCT_ENTRY_TO_SCENIC_RENDERER_WRAPPER_V1

## Purpose

Add a non-blocking product entry from a safe ordinary page to the accepted scenic-point renderer.

## Product Page

apps/miniapp/pages/explore-map/index

## Accepted Renderer

apps/miniapp/xr_demo/miniprogram/pages/xr-scenic-point-render/index

## Storage Result

XR_SCENIC_POINT_RENDER_RESULT_V1

## Implementation

- product_xr_entry_added:
- navigate_to_renderer_added:
- storage_result_read_added:
- ready_copy_added:
- fallback_copy_added:
- renderer_internals_unchanged:
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Non-blocking Rule

XR result must not block:

- exploration completion
- token reveal
- blessing reveal
- user progress saving
- normal product navigation

## Acceptance Criteria

After opening renderer and returning to explore page:

- XR_RENDER_RETURNED = YES
- XR_RENDER_STATUS = READY / BLOCKED / UNKNOWN
- XR_OBJECT_VISIBLE = YES / NO
- READY copy appears if ready
- fallback copy appears if not ready
- normal exploration flow remains usable
