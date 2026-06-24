# XR_SMOKE_INLINE_SCENE_NOT_FOUND_DIFF_FIX_V1

## Problem

Smoke Test inline Simple 3D currently shows:

- frame found
- scene ready = NO
- scene query = NOT_FOUND
- object query = NOT_FOUND

This means the black container exists, but the inline `xr-scene` is not being recognized in the same way as the passing Primitive Sample page.

## Diff Against Passing Page

- `index_json_diff`:
  - Primitive Sample: `renderer: "xr-frame"`, empty `usingComponents`
  - Smoke Test: `renderer: "xr-frame"`, retains `xr-smoke-frame` for XR Surface baseline
- `wxml_structure_diff`:
  - Primitive Sample: minimal `xr-frame -> xr-scene -> xr-assets -> xr-node -> xr-gltf -> xr-camera`
  - Smoke Test: inline scene now mirrors that structure and keeps `xr-scene` always mounted
- `wxss_size_diff`:
  - Smoke Test inline surface uses a fixed 260px block so the XR canvas has deterministic height
- `selector_strategy_diff`:
  - Primitive Sample: surface / scene / node / object queries succeed from the page
  - Smoke Test: frame found, but scene/node/object require the inline structure to match the passing page more closely
- `root_cause`:
  - Inline scene structure and query timing were not fully aligned with the known-good Primitive Sample path

## Fix

- `smoke_test_index_json_aligned`: YES
- `inline_scene_structure_matched`: YES
- `object_id_moved_to_xr_node`: YES
- `scene_size_confirmed`: YES
- `selector_strategy_aligned`: YES
- `marker_added`: NO
- `anchor_added`: NO
- `texture_added`: NO
- `business_data_added`: NO

## Expected Result

Clicking Start minimal 3D render should produce:

- `SIMPLE_3D_INLINE_SCENE_READY = YES`
- `SIMPLE_3D_INLINE_SCENE_QUERY_RESULT = FOUND`
- `SIMPLE_3D_INLINE_OBJECT_QUERY_RESULT = FOUND`
- `SIMPLE_3D_OBJECT_VISIBLE = YES`
- `SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY`
- `SIMPLE_3D_RENDER_BLOCK_REASON = 空`

