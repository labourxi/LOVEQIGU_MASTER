# XR_SIMPLE_3D_ACTUAL_OBJECT_RENDER_V1

## Current Preconditions

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_CAMERA_PERMISSION_CHECK_V1 = PASS
- XR_CAMERA_PREVIEW_BASELINE_V1 = PASS
- XR_SIMPLE_3D_STATUS_ENUM_AND_VISIBILITY_FIX_V1 = PASS

## Purpose

实现最小 3D 对象渲染验证。
本阶段不接 Marker、不接 Anchor、不接 GLB、不接贴图、不接业务数据。

## Implementation

- xr_simple_3d_frame_component_used: YES
- renderer_config_confirmed: YES
- primitive_or_node_added: NO
- external_asset_added: NO
- simple_3d_event_added: YES
- simple_3d_object_query_added: YES

## Status Result

- simple3dRenderRequested:
- simple3dObjectVisible:
- simple3dRenderStatus:
- simple3dRenderBlockReason:

## Block Reasons

- XR_SURFACE_NOT_READY
- CAMERA_PREVIEW_NOT_READY
- XR_SIMPLE_GEOMETRY_TAG_NOT_AVAILABLE
- XR_OBJECT_QUERY_NOT_FOUND
- UNKNOWN

## Manual Verification Required

用户需要：

1. 打开 XR Smoke Test
2. 点击 Start camera preview baseline
3. 确认 `CAMERA_PREVIEW_STATUS = CAMERA_PREVIEW_READY`
4. 点击 Start minimal 3D render
5. 查看：
   - `SIMPLE_3D_RENDER_REQUESTED = YES`
   - `SIMPLE_3D_OBJECT_VISIBLE = YES / NO`
   - `SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY / SIMPLE_3D_RENDER_BLOCKED`
   - `SIMPLE_3D_RENDER_BLOCK_REASON`
6. 页面不崩溃
7. XR Surface 仍存在
