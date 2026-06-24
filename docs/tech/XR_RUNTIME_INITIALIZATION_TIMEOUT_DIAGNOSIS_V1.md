# XR_RUNTIME_INITIALIZATION_TIMEOUT_DIAGNOSIS_V1

## Current State

- XR_PAGE_OPENED = YES
- XR_NAVIGATION_SUCCESS = YES
- XR_COMPONENT_PATH_FIXED = YES
- XR_COMPONENT_RENDERER_FIXED = YES
- XR_SHARE_BEHAVIOR_RUNTIME_ERROR_FIXED = YES

## Timeout Symptom

- XR_FRAME_EXISTS: false
- XR_SCENE_READY: false
- XR_RENDER_READY: false
- MARKER_AR_READY: false
- RUNTIME_TO_XR_COMPATIBLE: false
- error_timeout_present: YES

## Component Lifecycle Trace

### xr-ar-camera

- created: YES
- attached: YES
- ready: YES
- error: NO

### xr-template-arPreview

- created: YES
- attached: YES
- ready: YES
- error: NO

## WXML Tag Check

- XR_FRAME_TAG_EXISTS_IN_WXML: NO
- XR_SCENE_TAG_EXISTS_IN_WXML: NO
- XR_CAMERA_TAG_EXISTS_IN_WXML: NO
- XR_AR_TRACKER_TAG_EXISTS_IN_WXML: NO
- XR_MARKER_TAG_EXISTS_IN_WXML: NO

## Selector Query Result

- XR_PAGE_QUERY_XR_CAMERA: NEED_MANUAL_TEST
- XR_PAGE_QUERY_AR_PREVIEW: NEED_MANUAL_TEST
- XR_CAMERA_COMPONENT_QUERY_XR_FRAME: NEED_MANUAL_TEST
- XR_CAMERA_COMPONENT_QUERY_XR_SCENE: NEED_MANUAL_TEST
- XR_PREVIEW_COMPONENT_QUERY_XR_FRAME: NEED_MANUAL_TEST
- XR_PREVIEW_COMPONENT_QUERY_XR_SCENE: NEED_MANUAL_TEST

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

## Timeout Source

- XR_TIMEOUT_SOURCE_FILE: NOT_LOCATED_IN_REPO
- XR_TIMEOUT_SOURCE_LINE: NOT_LOCATED_IN_REPO
- XR_TIMEOUT_SOURCE_TYPE: UNKNOWN
- XR_TIMEOUT_ERROR_MESSAGE: Error: timeout

## Worker / Realtime Report Check

- reportRealtimeAction_found: NO
- reportRealtimeAction_wrapped: NO
- reportRealtimeAction_internal_warning: NO

## Root Cause Candidates

- COMPONENT_INIT_BLOCKED
- SUBPACKAGE_RESOURCE_LOAD_DELAY
- XR_RUNTIME_NOT_READY
- COMPONENT_INTERNAL_SELECTOR_QUERY_NEEDED
- DEVTOOLS_RUNTIME_COMPATIBILITY_LIMIT
- UNKNOWN

## Next Recommendation

- 真机预览验证
- 修状态检测逻辑
- 暂时保留 XR Demo 作为技术验证入口
- 若真机仍超时，再简化 XR Demo 页面做最小 xr-frame smoke test

## Manual Test Required

用户需要分别验证：

1. 开发者工具模拟器打开 XR 页面
2. 点击 Camera Demo
3. 点击 AR Preview Demo
4. 查看 Console 输出
5. 真机预览打开 XR 页面
6. 对比模拟器与真机状态差异
