# XR_CAMERA_PERMISSION_CHECK_V1

## Current Baseline

- XR_MINIMAL_RUNTIME_BASELINE_V1 = PASS_WITH_WARNING
- XR_NEXT_INCREMENT_PLAN_V1 = COMPLETE
- current_increment = camera_permission_check

## Purpose

在进入后续 Camera Preview / AR 预览前，先稳定相机权限检测链路。

## Implementation

- app_json_camera_permission_declared: YES
- check_camera_permission_added: YES
- request_camera_permission_added: YES
- open_setting_added: YES
- permission_status_ui_added: YES
- xr_smoke_test_preserved: YES

## Permission States

- UNKNOWN
- NOT_REQUESTED
- GRANTED
- DENIED

## Safety Rules

- 未授权不导致页面崩溃
- 拒绝授权不误判 XR Runtime 失败
- 不自动弹窗打扰用户
- 不接 Marker
- 不接 3D 模型
- 不接业务数据

## Manual Verification Required

用户需要在微信开发者工具 / 真机中验证：

1. 打开 XR Smoke Test
2. 查看 Camera Permission 状态
3. 点击检测相机权限
4. 点击请求相机权限
5. 允许授权后应显示 GRANTED
6. 拒绝授权后应显示 DENIED
7. 点击打开权限设置后返回，应重新检测权限
8. XR Surface 状态不应被破坏

## Final Output

- XR_CAMERA_PERMISSION_CHECK_CREATED = YES
- CAMERA_PERMISSION_DECLARED_IN_APP_JSON = YES
- CHECK_CAMERA_PERMISSION_ADDED = YES
- REQUEST_CAMERA_PERMISSION_ADDED = YES
- OPEN_CAMERA_PERMISSION_SETTING_ADDED = YES
- CAMERA_PERMISSION_UI_ADDED = YES
- XR_SMOKE_TEST_PRESERVED = YES
