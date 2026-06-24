# REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1

## 1. 文档定位

本文件记录 LOVEQIGU / AR游伴 Phase 3 的 AR Runtime Bridge mock 实现结果。

本轮基于 `REAL_AR_RUNTIME_BRIDGE_PLAN_V1` 创建 `apps/shared/data-adapter/ar-runtime-bridge.js`，用于统一设备能力检测、摄像头 / 定位权限 mock、AR 会话 mock、fallback、错误归一化、调试工具和未来真实 AR SDK 替换边界。

本轮不接真实 AR SDK，不调用真实摄像头，不调用真实定位，不修改页面视觉，不改 Runtime 数据结构。

---

## 2. 实现范围

已实现：

1. ARRuntimeBridge
2. detectDeviceCapabilities
3. requestCameraPermission
4. requestLocationPermission
5. startARSession
6. reportARProgress
7. completeARSession
8. completeFallback
9. disposeARSession
10. normalizeARError
11. getBridgeState
12. resetBridgeState
13. setMockCapabilities
14. getMockCapabilities
15. window.LQGARuntimeBridge
16. window.LQGARDebug

---

## 3. 文件范围

新增：

- `apps/shared/data-adapter/ar-runtime-bridge.js`

更新：

- `apps/shared/data-adapter/index.js`
- `apps/shared/data-adapter/README.md`
- `docs/ui_implementation/VISUAL_LANDING_INDEX_V1.md`

---

## 4. 边界说明

本轮没有：

1. 接真实 AR SDK
2. 调用真实摄像头
3. 调用真实定位
4. 接真实扫码能力
5. 修改页面代码
6. 修改 Runtime 数据结构
7. 修改 Phase 2 mock 用户探索流程
8. 绕过 user-app-adapter
9. 写入 userRelics
10. 写入 couponClaims

---

## 5. 后续建议

下一步建议进入：

**REAL_AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1**

目标：

1. 让 user-app-adapter 的 startARScan / completeARScan / fallback-complete 使用 ARRuntimeBridge
2. 仍不接真实 AR SDK
3. 页面调用保持不变
4. 验证 fallback / success / timeout / camera denied 场景

---

## 6. 验收标记

```
REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1_CREATED = YES
AR_RUNTIME_BRIDGE_FILE_CREATED = YES
AR_RUNTIME_BRIDGE_METHODS_IMPLEMENTED = YES
AR_RUNTIME_BRIDGE_STATE_MODEL_IMPLEMENTED = YES
AR_RUNTIME_BRIDGE_MOCK_CAPABILITIES_READY = YES
AR_RUNTIME_BRIDGE_CAMERA_PERMISSION_MOCK_READY = YES
AR_RUNTIME_BRIDGE_LOCATION_PERMISSION_MOCK_READY = YES
AR_RUNTIME_BRIDGE_SESSION_MOCK_READY = YES
AR_RUNTIME_BRIDGE_FALLBACK_MOCK_READY = YES
AR_RUNTIME_BRIDGE_ERROR_NORMALIZATION_READY = YES
AR_RUNTIME_BRIDGE_DEBUG_TOOL_READY = YES
AR_RUNTIME_BRIDGE_INDEX_EXPORT_READY = YES
AR_RUNTIME_BRIDGE_README_UPDATED = YES
NO_REAL_AR_SDK_CONNECTED = CONFIRMED
NO_REAL_CAMERA_CALLED = CONFIRMED
NO_REAL_LOCATION_CALLED = CONFIRMED
NO_RUNTIME_DATA_CHANGE = CONFIRMED
NO_PAGE_UI_CHANGE = CONFIRMED
READY_FOR_AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1 = YES
```
