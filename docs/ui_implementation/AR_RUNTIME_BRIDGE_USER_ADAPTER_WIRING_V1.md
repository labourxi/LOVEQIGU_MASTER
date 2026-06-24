# AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1

## 1. 文档定位

本文件记录 LOVEQIGU / AR游伴 Phase 3 的 AR Runtime Bridge 与 user-app-adapter 接线结果。

本轮基于 REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1，将 user-app-adapter 的 AR 流程接入 apps/shared/data-adapter/ar-runtime-bridge.js mock bridge。

本轮不接真实 AR SDK，不调用真实摄像头，不调用真实定位，不修改页面 UI，不改 Runtime 数据结构。

## 2. 接线范围

已接线：

1. user-app-adapter.startARScan
2. user-app-adapter.completeARScan
3. user-app-adapter complete fallback flow
4. arRuntimeBridge.detectDeviceCapabilities
5. arRuntimeBridge.requestCameraPermission
6. arRuntimeBridge.startARSession
7. arRuntimeBridge.completeARSession
8. arRuntimeBridge.completeFallback
9. arRuntimeBridge.normalizeARError

## 3. 调用链路

页面仍调用 user-app-adapter：

页面
→ user-app-adapter.startARScan
→ ar-runtime-bridge.detectDeviceCapabilities
→ ar-runtime-bridge.requestCameraPermission / startARSession
→ user-app-adapter.completeARScan / completeARFallback
→ user-app-adapter 写入 mock session 状态
→ 用户继续 revealRelic

页面不直接调用 AR SDK。

## 4. 边界说明

本轮没有：

1. 接真实 AR SDK
2. 调用真实摄像头
3. 调用真实定位
4. 修改页面 UI
5. 修改 Runtime 数据结构
6. 让 bridge 写 userRelics
7. 让 bridge 写 couponClaims
8. 让 bridge 直接 revealRelic
9. 让 bridge 直接 unlockCoupon

## 5. 验收场景

建议在 console 或现有页面流程中验证：

1. 默认 fallback 场景
2. AR supported success 场景
3. camera denied 场景
4. AR timeout 场景
5. fallback complete 场景
6. completeARScan 后不自动 revealRelic
7. revealRelic 仍需单独调用

## 6. 后续建议

下一步建议进入：

AR_RUNTIME_BRIDGE_PAGE_STATE_ACCEPTANCE_V1

目标：

1. 验证页面 AR 状态展示是否合理
2. 验证 fallback / success / timeout / camera denied 的用户提示
3. 不接真实 AR SDK
4. 不改产品主流程

## 7. 验收标记

AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1_CREATED = YES
USER_APP_ADAPTER_AR_BRIDGE_RESOLUTION_READY = YES
USER_APP_ADAPTER_START_AR_SCAN_BRIDGE_CONNECTED = YES
USER_APP_ADAPTER_COMPLETE_AR_SCAN_BRIDGE_CONNECTED = YES
USER_APP_ADAPTER_FALLBACK_BRIDGE_CONNECTED = YES
USER_APP_ADAPTER_AR_ERROR_NORMALIZATION_READY = YES
USER_APP_ADAPTER_AR_BUSINESS_BOUNDARY_CONFIRMED = YES
PAGE_CALLING_STYLE_UNCHANGED = CONFIRMED
NO_REAL_AR_SDK_CONNECTED = CONFIRMED
NO_REAL_CAMERA_CALLED = CONFIRMED
NO_REAL_LOCATION_CALLED = CONFIRMED
NO_RUNTIME_DATA_CHANGE = CONFIRMED
NO_PAGE_UI_CHANGE = CONFIRMED
READY_FOR_AR_RUNTIME_BRIDGE_PAGE_STATE_ACCEPTANCE_V1 = YES
