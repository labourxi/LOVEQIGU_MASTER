# XR_CAMERA_PREVIEW_BASELINE_V1_PLAN

## Purpose

在 XR Smoke Test 已通过最小运行时基线、相机权限已通过真机验收的基础上，进入最小 Camera Preview 验证。

本阶段只验证相机预览能力，不接 Marker、不接 3D 模型、不接业务数据。

## Current Preconditions

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_CAMERA_PERMISSION_CHECK_V1 = PASS
- camera_permission_granted = YES
- xr_surface_preserved = YES
- code_quality_gate = PASS
- real_device_preview_upload = PASS

## Scope

本阶段允许：

- 在 XR Smoke Test 基础上新增最小 Camera Preview 状态
- 检测相机权限是否已授权
- 如果未授权，提示先完成权限授权
- 如果已授权，进入 camera preview baseline
- 显示 camera preview 状态面板
- 输出结构化日志

本阶段不允许：

- 不接 Marker
- 不接 Anchor
- 不接 3D 模型
- 不接 GLB
- 不接贴图
- 不接业务数据
- 不改 Official XR Demo
- 不破坏 XR Smoke Test 已有状态

## Proposed Runtime Fields

新增或预留以下状态字段：

- cameraPreviewRequested
- cameraPreviewAvailable
- cameraPreviewSurfaceVisible
- cameraPreviewStatus
- cameraPreviewBlockReason
- cameraPreviewCheckedAt

状态枚举：

- NOT_STARTED
- WAITING_FOR_PERMISSION
- PERMISSION_GRANTED
- CAMERA_PREVIEW_READY
- CAMERA_PREVIEW_BLOCKED
- CAMERA_PREVIEW_FAILED

## Verification Target

验收标准：

- camera_permission_granted = YES
- camera_preview_requested = YES
- camera_preview_status = CAMERA_PREVIEW_READY / CAMERA_PREVIEW_BLOCKED
- no_runtime_crash = YES
- xr_surface_preserved = YES
- minimal_xr_surface_ready = YES

## Risk Control

- 若 Camera Preview 失败，不得回滚 XR Smoke Test 基线
- 若权限缺失，不得误判为 XR Runtime 失败
- 若真机与模拟器表现不一致，以真机为准
- 本阶段不能引入大资源，避免代码质量回退

## Next Implementation Task

- XR_CAMERA_PREVIEW_BASELINE_V1

## Final Output

- XR_CAMERA_PREVIEW_BASELINE_PLAN_CREATED = YES
- READY_FOR_CAMERA_PREVIEW_BASELINE = YES
