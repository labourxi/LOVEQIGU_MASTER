# XR_NEXT_INCREMENT_PLAN_V1

## Current Baseline

- xr_smoke_test_real_device_verified: YES
- minimal_xr_surface_ready: YES
- runtime_observed_ready: YES
- minimal_xr_ready_status: PASS_WITH_EVENT_CALLBACK_WARNING
- official_xr_demo_role: reference_only
- xr_smoke_test_role: self_owned_xr_base_template

## Development Principle

- 不再从 Official XR Demo Import 扩展
- 后续基于 XR Smoke Test 增量开发
- 每次只增加一个能力点
- 每个能力点必须可回退
- 不允许一次性接入相机、Marker、模型、业务数据全部能力

## Increment Options

### Option A: Camera Permission Check

目标：
- 进入 XR 页面前检测相机权限
- 用户拒绝时给出提示
- 用户允许后继续进入 Camera Baseline

验收：
- camera_permission_known = YES
- camera_permission_granted = YES / NO
- no_crash_when_denied = YES

### Option B: Camera Preview Baseline

目标：
- 在 Smoke Test 基础上增加最小相机预览
- 不接 Marker
- 不接模型
- 不接业务数据

验收：
- camera_preview_surface_visible = YES
- no_runtime_timeout = YES

### Option C: Simple 3D Object Render

目标：
- 在 XR Surface 中渲染一个最小 3D 物体
- 不接 Marker
- 不接复杂模型
- 不加载大资源

验收：
- simple_object_visible = YES
- render_surface_preserved = YES

### Option D: Marker / Anchor Probe

目标：
- 验证 Marker 或 Anchor 能力
- 不接业务信物
- 不接复杂 UI

验收：
- marker_probe_initialized = YES
- marker_detection_event_observed = YES / NO

### Option E: Exploration Point Asset Binding

目标：
- 将探索点数据与 AR 资源绑定
- 先使用 mock asset
- 不接复杂生成资产

验收：
- exploration_point_id_received = YES
- ar_asset_id_resolved = YES
- mock_ar_asset_loaded = YES

### Option F: Runtime Data Bridge

目标：
- 将 Runtime 数据桥接到 XR 页面
- 确认页面能读取探索点、信物、状态

验收：
- runtime_payload_received = YES
- runtime_payload_valid = YES

## Recommended Order

推荐顺序：

1. Camera Permission Check
2. Camera Preview Baseline
3. Simple 3D Object Render
4. Exploration Point Asset Binding
5. Runtime Data Bridge
6. Marker / Anchor Probe

理由：
- 先处理权限和相机链路，排除最基础的运行前置条件
- 再验证最小相机预览和最小 3D 渲染，确认 XR 基础渲染面稳定
- 然后再接探索点资产和运行时数据，避免把数据问题误判成渲染问题
- Marker / Anchor 依赖更多环境能力，适合放在后面单独隔离验证

## Risk Control

- 不允许一次性修改 Official XR Demo
- 不允许引入大模型 / GLB / 大贴图
- 不允许破坏 XR Smoke Test
- 不允许破坏代码质量已通过状态
- 每个增量必须独立 smoke test

## Next Codex Task Recommendation

XR_CAMERA_PERMISSION_CHECK_V1

## Final Output

- XR_NEXT_INCREMENT_PLAN_CREATED = YES
- RECOMMENDED_NEXT_TASK = XR_CAMERA_PERMISSION_CHECK_V1
