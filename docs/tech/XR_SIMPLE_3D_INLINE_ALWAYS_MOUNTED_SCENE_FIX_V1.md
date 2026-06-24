# XR_SIMPLE_3D_INLINE_ALWAYS_MOUNTED_SCENE_FIX_V1

## Problem

xr-simple-3d-frame component outer shell is mounted, but internal nodes and events are not stable.
Page-level diagnostics can only see host/component and cannot reliably query internal scene/node/object.

## Decision

Use an inline XR Scene inside the Smoke Test page.
xr-scene stays mounted on initial page render and is never destroyed by wx:if.
Clicking Start minimal 3D render only starts diagnostics and state sync.

## Implementation

- inline_scene_always_mounted:
- wx_if_removed_from_xr_scene:
- fixed_surface_size_added:
- minimal_gltf_reused:
- delayed_diagnostics_added:
- marker_added: NO
- anchor_added: NO
- texture_added: NO
- business_data_added: NO
- worker_tracking_changed: NO

## Expected Result

After clicking Start minimal 3D render:

- SIMPLE_3D_INLINE_SURFACE_BOX_QUERY_RESULT = FOUND
- SIMPLE_3D_INLINE_SCENE_QUERY_RESULT = FOUND
- SIMPLE_3D_INLINE_NODE_QUERY_RESULT = FOUND
- SIMPLE_3D_INLINE_OBJECT_QUERY_RESULT = FOUND
- SIMPLE_3D_OBJECT_VISIBLE = YES
- SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY
- SIMPLE_3D_RENDER_BLOCK_REASON = empty

