# XR_MINIMAL_GLTF_PLANE_TRACKER_SAMPLE_V1

## Current Baseline

- primitive_sample_page_opened: YES
- primitive_render_surface_visible: YES
- primitive_object_visible: NO
- primitive_block_reason: PRIMITIVE_SYNTAX_NEEDS_CONFIRMATION

## Reference Used

用户提供的最简 xr-frame 结构：

- xr-scene
- xr-assets
- xr-asset-load type="gltf"
- xr-node
- xr-ar-tracker type="plane"
- xr-gltf
- xr-camera is-ar-camera

## Purpose

在隔离页验证最小 GLTF + Plane Tracker + xr-gltf 渲染链路。
本阶段不接 Marker、不接 Anchor、不接贴图、不接业务数据。

## Implementation

- minimal_gltf_asset_added: YES
- minimal_gltf_asset_path: `apps/miniapp/xr_demo/miniprogram/pages/xr-primitive-sample/models/test.gltf`
- minimal_gltf_asset_size_kb: 1.44
- xr_asset_load_added: YES
- xr_ar_tracker_plane_added: YES
- xr_gltf_added: YES
- xr_camera_added: YES
- external_texture_added: NO
- marker_added: NO
- anchor_added: NO
- business_data_added: NO

## Status Result

- primitiveObjectVisible:
- primitiveSampleStatus:
- primitiveBlockReason:
- primitiveRenderMode:

## Manual Verification Required

用户需要：

1. 打开 XR Primitive Sample
2. 查看：
   - PRIMITIVE_RENDER_SURFACE_VISIBLE
   - PRIMITIVE_OBJECT_VISIBLE
   - PRIMITIVE_SAMPLE_STATUS
   - PRIMITIVE_BLOCK_REASON
3. 如果 PRIMITIVE_RENDER_READY，则下一步可以迁移到 xr-simple-3d-frame
4. 如果 BLOCKED / FAILED，截图并记录 block reason
