# XR_MINIMAL_RUNTIME_BASELINE_V1

## Current Decision

- Official XR Demo Import 保留为参考入口
- XR Smoke Test 作为 AR游伴自研 XR 基础入口模板
- 后续 AR 页面优先基于 Smoke Test 扩展，不再优先依赖复杂官方 Demo Import

## Verified Signals

- XR Smoke Test page opened: YES
- XR Surface visible: YES
- xr-frame node query result: YES
- scene ready event: YES
- minimal_xr_ready: NEED_MANUAL_TEST

## Important Finding

即使 `wx.canIUse('xr-frame')` 或 `wx.createXRFrame` 返回不理想，也不能直接判定 XR 不可用。
必须结合 runtime observed result：

- scene ready event
- xr-frame selector result
- render surface visibility

## Next AR Development Direction

下一步不要继续搬运完整 Official Demo。
建议基于 Smoke Test 逐步增加：

1. camera permission check
2. camera preview
3. simple 3D object
4. marker detection
5. AR exploration asset binding
6. runtime data bridge

## Manual Verification Required

用户需要：

1. 清缓存
2. 重启开发者工具
3. 重新导入 `apps/miniapp`
4. 重新编译
5. 进入 XR Smoke Test
6. 确认页面显示：
   - `XR_FRAME_NODE_EXISTS = YES`
   - `SCENE_READY_EVENT_FIRED = YES`
   - `XR_RENDER_SURFACE_EXISTS = YES`
   - `MINIMAL_XR_READY = YES`

## XR_SMOKE_TEST_SCENE_READY_STATE_SYNC_FIX_V1

### Finding

- raw capability check may return NO
- runtime observed result can still be YES
- scene ready event is the reliable minimal XR signal

### Fixed

- scene_ready_event_mapped: YES
- xr_frame_query_mapped: YES
- render_surface_query_mapped: YES
- minimal_xr_ready_recalculated: YES
- timeout_recovery_supported: YES

### Expected Manual Result

- XR_FRAME_NODE_EXISTS = YES
- SCENE_READY_EVENT_FIRED = YES
- XR_RENDER_SURFACE_EXISTS = YES
- MINIMAL_XR_READY = YES
- RUNTIME_BLOCK_REASON = empty or MINIMAL_XR_READY

## XR_SMOKE_TEST_OBSERVED_READY_FALLBACK_V1

### Finding

- xr-frame node exists: YES
- render surface exists: YES
- scene ready page callback: NO
- observed runtime ready: YES

### Decision

不伪造 `sceneReadyEventFired`。
新增 observed readiness fallback。

### Result Semantics

- `SCENE_READY_EVENT_FIRED = NO` 表示页面未捕获 ready 回调
- `MINIMAL_XR_SURFACE_READY = YES` 表示 xr-frame 渲染面已经实际挂载
- `MINIMAL_XR_READY_STATUS = PASS_WITH_EVENT_CALLBACK_WARNING` 表示可作为后续自研 XR 基础入口继续推进

## XR_SMOKE_TEST_OBSERVED_READY_FALLBACK_V1_CONTINUE

### Result Semantics Clarification

- `sceneReadyEventFired` 只代表页面层 ready 回调是否捕获成功
- `runtimeObservedReady` 只代表页面已经观测到最小 XR 渲染面挂载成功
- `MINIMAL_XR_SURFACE_READY` 才表示最小 XR 渲染链路已经对页面可见
- `MINIMAL_XR_READY_STATUS = PASS_WITH_EVENT_CALLBACK_WARNING` 表示功能可继续推进，但页面层 ready 回调仍缺失

## XR_SMOKE_TEST_EMPTY_SCENE_BASELINE_V1

### Purpose

将 `xr-smoke-test` 固化为 AR游伴最小 XR 空场景基线测试页，用于隔离 XR Runtime、分包、renderer、懒加载、资源阻塞等问题。

### Current Strategy

- 不再优先依赖 Official XR Demo Import
- 保留 Official XR Demo 作为参考
- `xr-smoke-test` 作为自研 XR 基础模板
- 先验证空 XR 场景，再逐步增加相机、Marker、3D 模型、业务数据

### Config Check

- `lazyCodeLoading_requiredComponents`: YES
- `xr_subpackage_root`: `xr_demo/miniprogram`
- `xr_smoke_test_registered`: YES
- `camera_permission_declared`: YES
- `project_lib_version`: `3.15.2`

### Empty Scene Baseline

- `model_assets_removed`: YES
- `marker_assets_removed`: YES
- `ar_preview_dependency_removed`: YES
- `official_demo_dependency_removed`: YES
- `business_data_dependency_removed`: YES
- `render_surface_preserved`: YES

### Runtime Status Semantics

- `sceneReadyEventFired`: 页面层 ready 回调是否捕获成功
- `minimalXrSurfaceReady`: XR 渲染面是否已通过运行时观测确认
- `runtimeObservedReady`: 页面是否已经观测到最小 XR 渲染面挂载成功
- `readyEventCallbackMissing`: 页面未捕获 ready 回调但已观测到渲染面
- `minimalXrReadyStatus`: `PASS` / `PASS_WITH_EVENT_CALLBACK_WARNING` / `FAIL`

### Timeout Policy

- `timeout_seconds`: 8
- `retry_interval_seconds`: 1
- `timeout_does_not_override_observed_ready`: YES

### Worker Warning

- `reportRealtimeAction_project_call_found`: NO
- `reportRealtimeAction_wrapped`: NO
- `reportRealtimeAction_internal_warning`: NO

### Manual Verification Required

用户需要：

1. 清除全部缓存
2. 完全关闭微信开发者工具
3. 重新导入 `apps/miniapp`
4. 重新编译
5. 打开 XR Smoke Test
6. 观察页面状态：
   - `XR_FRAME_NODE_EXISTS`
   - `XR_RENDER_SURFACE_EXISTS`
   - `MINIMAL_XR_SURFACE_READY`
   - `MINIMAL_XR_READY_STATUS`
7. 再进行真机预览验证

## XR_SMOKE_TEST_READY_EVENT_BINDING_FIX_V1

### Current Finding

- xr-frame node exists: YES
- render surface exists: YES
- internal scene ready log visible: YES
- page scene ready callback fired: NEED_MANUAL_TEST

### Fix Applied

- ready_event_binding_added: YES
- ready_event_handler_name: onXrSceneReady
- wxml_binding_checked: YES
- js_handler_checked: YES
- minimal_xr_ready_recalc_checked: YES
- timeout_success_override_prevented: YES

### Expected Manual Result

- SCENE_READY_EVENT_FIRED = YES
- MINIMAL_XR_READY = YES
- RUNTIME_STATUS = MINIMAL_XR_READY
- RUNTIME_BLOCK_REASON = empty

## XR_SMOKE_TEST_SCENE_READY_STATE_SYNC_FIX_V1_CONTINUE

### Finding

- raw capability check may return NO
- runtime observed result can still be YES
- scene ready event is the reliable minimal XR signal

### Fixed

- scene_ready_event_mapped: YES
- xr_frame_query_mapped: YES
- render_surface_query_mapped: YES
- minimal_xr_ready_recalculated: YES
- timeout_recovery_supported: YES

### Expected Manual Result

- XR_FRAME_NODE_EXISTS = YES
- SCENE_READY_EVENT_FIRED = YES
- XR_RENDER_SURFACE_EXISTS = YES
- MINIMAL_XR_READY = YES
- RUNTIME_BLOCK_REASON = empty or MINIMAL_XR_READY
