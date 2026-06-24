# XR_MINIMAL_FRAME_SMOKE_TEST_V1

## Purpose

验证当前项目 / 分包 / 基础库 / 真机环境是否能挂载最小 XR Runtime。

## Current Context

- XR_PAGE_OPENED = YES
- XR_COMPONENT_LIFECYCLE_READY = YES
- XR_RUNTIME_INITIALIZATION_TIMEOUT = YES
- OFFICIAL_XR_DEMO_INTERNAL_XR_NODE_FOUND = NO

## Files Created

- smoke_test_page_js: `apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.js`
- smoke_test_page_json: `apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.json`
- smoke_test_page_wxml: `apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.wxml`
- smoke_test_page_wxss: `apps/miniapp/xr_demo/miniprogram/pages/xr-smoke-test/index.wxss`

## App Registration

- subpackage_root: `xr_demo/miniprogram`
- page_registered: YES
- smoke_test_navigation_url: `/xr_demo/miniprogram/pages/xr-smoke-test/index`

## Smoke Test Checks

- PAGE_LOADED: NEED_MANUAL_TEST
- PAGE_READY: NEED_MANUAL_TEST
- XR_API_DETECTED: NEED_MANUAL_TEST
- XR_FRAME_NODE_EXISTS: NEED_MANUAL_TEST
- XR_SCENE_NODE_EXISTS: NEED_MANUAL_TEST
- XR_RENDER_SURFACE_EXISTS: NEED_MANUAL_TEST
- RUNTIME_BLOCK_REASON: `XR_INITIALIZATION_TIMEOUT`

## Worker / Realtime Report Check

- reportRealtimeAction_project_call_found: NO
- reportRealtimeAction_wrapped: NO
- reportRealtimeAction_internal_only: NO

## Manual Verification Required

用户需要：

1. 清除全部缓存
2. 重启微信开发者工具
3. 重新导入 `apps/miniapp`
4. 重新编译
5. 进入 Official XR Demo
6. 点击 `XR Smoke Test`
7. 查看页面状态
8. 查看 Console 输出
9. 如果开发者工具模拟器失败，再用真机预览验证
10. 若真机调试上传 503，换网络 / 手机热点 / 关闭代理后重试

## Result Interpretation

如果 Smoke Test 也失败：

- 说明当前环境 / 基础库 / XR Runtime 初始化层仍有问题
- 下一步查 `app.json` / `project.config.json` / 真机权限 / 基础库 / 微信版本

如果 Smoke Test 成功：

- 说明 XR Runtime 基础能力可用
- 说明 Official XR Demo Import 组件内部实现或搬运方式有问题
- 下一步改造 `xr-ar-camera` / `xr-template-arPreview` 内部 WXML 和初始化流程
