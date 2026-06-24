# XR_SIMPLE_3D_RENDERER_CLONE_PRIMITIVE_SAMPLE_FIX_V1

## Current Baseline

- primitive_sample_used_as_source = YES
- primitive_sample_minimal_gltf_render = PASS
- dedicated_renderer_page_opened = YES
- dedicated_renderer_page_result_return = NEED_MANUAL_TEST

## Problem

The dedicated `renderer="xr-frame"` page can open and show a black XR surface, but the returned render result is still not stable in the Smoke Test flow.

## Decision

Clone the verified Primitive Sample render structure into the dedicated renderer page, then keep only the result publishing and return bridge logic around it.

## Implementation

- primitive_sample_structure_cloned: YES
- renderer_xr_frame_configured: YES
- xr_frame_wrapper_added: YES
- xr_scene_structure_aligned: YES
- xr_camera_ar_mode_aligned: YES
- minimal_gltf_reused: YES
- storage_result_publish_added: YES
- event_channel_result_publish_added: YES
- on_unload_result_publish_added: YES
- smoke_test_storage_read_confirmed: YES
- marker_added: NO
- anchor_added: NO
- texture_added: NO
- business_data_added: NO

## Expected Result

The dedicated renderer page should return one of:

- `SIMPLE_3D_RENDER_READY`
- `SIMPLE_3D_RENDER_BLOCKED`

Smoke Test should read the latest renderer result from storage and show the returned status without relying on inline `xr-scene`.
