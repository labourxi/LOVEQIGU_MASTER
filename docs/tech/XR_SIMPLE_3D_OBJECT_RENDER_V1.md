# XR_SIMPLE_3D_OBJECT_RENDER_V1

## Current Preconditions

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_CAMERA_PERMISSION_CHECK_V1 = PASS
- XR_CAMERA_PREVIEW_BASELINE_V1 = PASS
- XR_CAMERA_PREVIEW_BASELINE_ACCEPTANCE_FREEZE_V1 = COMPLETE
- ready_for_simple_3d_object_render = YES

## Purpose

验证最小 3D 物体渲染链路。
本阶段不接 Marker、不接 Anchor、不接 GLB、不接贴图、不接业务数据。

## Implementation

- simple_3d_status_fields_added: YES
- start_simple_3d_object_render_added: YES
- xr_surface_guard_added: YES
- simple_3d_ui_added: YES
- structured_logs_added: YES
- external_asset_added: NO

## Status Fields

- simple3dRenderRequested:
- simple3dObjectVisible:
- simple3dRenderStatus:
- simple3dRenderBlockReason:
- simple3dRenderCheckedAt:

## Status Meaning

- SIMPLE_3D_RENDER_READY:
  表示最小 3D 物体渲染链路已通过。

- SIMPLE_3D_RENDER_BLOCKED:
  表示被 XR Surface、标签支持、节点查询或其它原因阻断。

## Safety Rules

- 不接 Marker
- 不接 Anchor
- 不接 GLB
- 不接贴图
- 不接业务数据
- 不破坏 XR Smoke Test
- 不改 Official XR Demo
- 不新增超过 200KB 资源

## Manual Verification Required

用户需要：

1. 打开 XR Smoke Test
2. 确认相机权限为 GRANTED
3. 确认 Camera Preview Baseline 为 CAMERA_PREVIEW_READY
4. 点击启动最小 3D 渲染
5. 查看状态：
   - SIMPLE_3D_RENDER_REQUESTED = YES
   - SIMPLE_3D_RENDER_STATUS = SIMPLE_3D_RENDER_READY / SIMPLE_3D_RENDER_BLOCKED
   - SIMPLE_3D_OBJECT_VISIBLE = YES / NO
   - XR Surface 仍存在
   - 页面不崩溃
6. 如果状态为 BLOCKED，记录 block reason
