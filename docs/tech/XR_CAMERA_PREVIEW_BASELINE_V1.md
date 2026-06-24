# XR_CAMERA_PREVIEW_BASELINE_V1

## Current Preconditions

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_CAMERA_PERMISSION_CHECK_V1 = PASS
- XR_CAMERA_PERMISSION_CHECK_ACCEPTANCE_FREEZE_V1 = COMPLETE
- XR_CAMERA_PREVIEW_BASELINE_V1_PLAN = COMPLETE
- camera_permission_granted_required = YES

## Purpose

验证最小 Camera Preview 前置状态链路。  
本阶段不接 Marker、不接 3D 模型、不接业务数据。

## Implementation

- camera_preview_status_fields_added: YES
- start_camera_preview_baseline_added: YES
- camera_permission_guard_added: YES
- xr_surface_preservation_check_added: YES
- camera_preview_ui_added: YES
- structured_logs_added: YES

## Status Fields

- cameraPreviewRequested
- cameraPreviewAvailable
- cameraPreviewSurfaceVisible
- cameraPreviewStatus
- cameraPreviewBlockReason
- cameraPreviewCheckedAt
- cameraPreviewError

## Status Meaning

- `CAMERA_PREVIEW_READY`:
  表示相机权限与 XR Surface 前置条件通过，不表示 Marker AR 已经完成。

- `CAMERA_PREVIEW_BLOCKED`:
  表示被权限、XR Surface 或 API 能力阻断。

## Safety Rules

- 不接 Marker
- 不接 Anchor
- 不接 3D 模型
- 不接 GLB / 贴图
- 不接业务数据
- 不破坏 XR Smoke Test
- 不改 Official XR Demo

## Manual Verification Required

用户需要：

1. 打开 XR Smoke Test
2. 确认相机权限为 GRANTED
3. 点击启动相机预览基线
4. 查看状态：
   - CAMERA_PREVIEW_REQUESTED = YES
   - CAMERA_PREVIEW_STATUS = CAMERA_PREVIEW_READY / CAMERA_PREVIEW_BLOCKED
   - XR Surface 仍存在
   - 页面不崩溃
5. 如果状态为 BLOCKED，记录 block reason

## Final Output

- XR_CAMERA_PREVIEW_BASELINE_CREATED = YES
- CAMERA_PREVIEW_STATUS_FIELDS_ADDED = YES
- START_CAMERA_PREVIEW_BASELINE_ADDED = YES
- CAMERA_PERMISSION_GUARD_ADDED = YES
- XR_SURFACE_PRESERVATION_CHECK_ADDED = YES
- CAMERA_PREVIEW_UI_ADDED = YES
- STRUCTURED_LOGS_ADDED = YES
