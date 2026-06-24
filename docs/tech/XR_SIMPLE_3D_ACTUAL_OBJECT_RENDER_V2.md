# XR_SIMPLE_3D_ACTUAL_OBJECT_RENDER_V2

## Current Baseline

- XR_PRIMITIVE_SAMPLE_MINIMAL_GLTF_RENDER = PASS
- primitive_object_visible = YES
- primitive_sample_status = PRIMITIVE_RENDER_READY
- ready_for_simple_3d_render_v2 = YES

## Purpose

将隔离页已验证的最小 GLTF 渲染链路迁移到 xr-simple-3d-frame。

## Implementation

- minimal_gltf_reused:
- xr_simple_3d_frame_renderer_confirmed:
- xr_asset_load_gltf_added:
- xr_gltf_added:
- xr_camera_added:
- simple3dready_event_added:
- simple3dblocked_event_added:
- smoke_test_event_bridge_added:
- external_texture_added: NO
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Status Result

- simple3dRenderRequested:
- simple3dObjectVisible:
- simple3dRenderStatus:
- simple3dRenderBlockReason:

## Manual Verification Required

用户需要：

1. 打开 XR Smoke Test
2. 点击 Start camera preview baseline
3. 确认 CAMERA_PREVIEW_STATUS = CAMERA_PREVIEW_READY
4. 点击 Start minimal 3D render
5. 查看：
   - SIMPLE_3D_RENDER_REQUESTED = YES
   - SIMPLE_3D_OBJECT_VISIBLE = YES
   - SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY
   - SIMPLE_3D_RENDER_BLOCK_REASON = 空
6. XR Surface 不消失
7. 页面不崩溃
