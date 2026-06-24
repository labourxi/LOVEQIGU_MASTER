# XR_RUNTIME_SUPPORT_AND_STATUS_TRACE_V1

## Current State

- XR_PAGE_OPENED = YES
- XR_NAVIGATION_SUCCESS = YES
- XR_COMPONENT_PATH_FIXED = YES
- XR_COMPONENT_RENDERER_FIXED = YES
- XR_SHARE_BEHAVIOR_RUNTIME_ERROR_FIXED = YES

## Current Runtime Status

- XR_FRAME_EXISTS: false
- XR_SCENE_READY: false
- XR_RENDER_READY: false
- MARKER_AR_READY: false
- RUNTIME_TO_XR_COMPATIBLE: false

## Runtime Environment

- SDKVersion: NEED_MANUAL_TEST
- platform: NEED_MANUAL_TEST
- system: NEED_MANUAL_TEST
- brand: NEED_MANUAL_TEST
- model: NEED_MANUAL_TEST
- is_devtools: NEED_MANUAL_TEST
- is_real_device: NEED_MANUAL_TEST

## XR API Capability Check

- canIUse_xr_frame: false
- canIUse_xr_scene: false
- canIUse_camera: true
- xr_api_detected: false
- xr_api_detection_error: NONE

## WXML Tag Check

- XR_FRAME_TAG_EXISTS_IN_WXML: NO
- XR_SCENE_TAG_EXISTS_IN_WXML: NO
- XR_CAMERA_TAG_EXISTS_IN_WXML: NO
- XR_MARKER_TAG_EXISTS_IN_WXML: NO

## Selector Query Check

- xr_frame_query_result: NOT_YET_OBSERVED
- xr_scene_query_result: NOT_YET_OBSERVED
- camera_component_query_result: NOT_YET_OBSERVED
- ar_preview_component_query_result: NOT_YET_OBSERVED

## Manual Test Required

用户需要分别验证：

1. 开发者工具模拟器打开 XR 页面
2. 点击 Camera Demo
3. 点击 AR Preview Demo
4. 查看 Console 输出
5. 真机预览打开 XR 页面
6. 对比模拟器与真机状态差异

## Root Cause Candidates

- DEVTOOLS_SIMULATOR_XR_UNSUPPORTED
- XR_API_NOT_AVAILABLE
- STATUS_DETECTION_LOGIC_INCOMPLETE
- COMPONENT_LOADED_BUT_XR_RUNTIME_NOT_READY
- UNKNOWN

## Next Recommendation

- 真机预览验证
- 修状态检测逻辑
- 加相机权限前置
- 暂时保留 XR Demo 作为技术验证入口
