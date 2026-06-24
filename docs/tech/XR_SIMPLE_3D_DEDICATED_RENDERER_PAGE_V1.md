# XR_SIMPLE_3D_DEDICATED_RENDERER_PAGE_V1

## Official Guidance Applied

- page must configure renderer: xr-frame
- no mixed view inside renderer page
- no wx:if around xr-scene
- local gltf path uses relative path
- selectorQuery does not cross into custom component internals

## Problem

Smoke Test page mixed view, status, and xr-scene content. That path made inline scene initialization unstable and harder to diagnose.

## Decision

Create an independent `renderer="xr-frame"` page for the minimal GLTF render baseline.
Smoke Test becomes the entry page and result display surface only.

## Implementation

- dedicated_renderer_page_created:
- renderer_xr_frame_configured:
- pure_xr_scene_wxml:
- minimal_gltf_reused:
- event_channel_result_return:
- storage_result_fallback:
- smoke_test_navigation_entry_added:
- smoke_test_inline_scene_disabled:
- marker_added: NO
- anchor_added: NO
- texture_added: NO
- business_data_added: NO

## Expected Result

Open the dedicated Simple 3D Renderer page:

- scene ready
- object found
- status = SIMPLE_3D_RENDER_READY

Return to Smoke Test:

- SIMPLE_3D_OBJECT_VISIBLE = YES
- SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY
- SIMPLE_3D_RENDER_BLOCK_REASON = empty
- SIMPLE_3D_RENDER_SOURCE = dedicated_renderer_page

