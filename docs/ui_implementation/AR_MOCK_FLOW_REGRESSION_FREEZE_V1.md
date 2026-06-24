# AR_MOCK_FLOW_REGRESSION_FREEZE_V1

## 1. 文档定位

本文件记录 LOVEQIGU / AR游伴 Phase 3 的 mock AR 全链路回归冻结结果。

本轮基于以下已通过事项：

1. REAL_AR_DEVICE_INTEGRATION_V1
2. REAL_AR_RUNTIME_BRIDGE_PLAN_V1
3. REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1
4. AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1
5. AR_RUNTIME_BRIDGE_PAGE_STATE_ACCEPTANCE_V1

本轮冻结当前 mock AR 流程，作为后续真实 AR SDK 接入前的稳定基准。

本轮不接真实 AR SDK，不调用真实摄像头，不调用真实定位，不改 Runtime 数据结构。

## 2. 冻结范围

冻结范围：

1. `ar-runtime-bridge.js` mock bridge（设备能力、权限 mock、session mock、fallback、错误归一化、`LQGARDebug` / bridge debug helpers）
2. `user-app-adapter.js` AR bridge 接线（`resolveARRuntimeBridge`、`startARScan`、`completeARScan`、`completeARFallback`）
3. `user-runtime-adapter` boot 加载 `ar-runtime-bridge.js`
4. `ar-entry` 页面状态机（fallback / success / camera denied / timeout / fallback complete；无 600ms 自动 complete；无自动 revealRelic）
5. `merchant-event/detail` 下一步状态（`resolveNextStepLabel`）
6. `lottie` 页 `revealRelic` 独立触发
7. `relic-archive` 信物边界文案（故事进度资产 · 非数字藏品）
8. mock session 持久化边界（业务状态仍由 user-app-adapter 写入）

## 3. 回归场景结果

### 场景 1：默认 fallback 全链路 — PASS

**流程：** `startExploration` → `mockCheckIn` → `startARScan` → `completeARFallback` → `revealRelic` → `unlockCoupon`

**结果：**

- `startARScan` 返回 `bridgeMode = FALLBACK`
- `completeARFallback` 返回 `AR_SCANNED_WITH_FALLBACK`，不自动 `revealRelic`
- `revealRelic` 单独调用后新增 `userRelic`
- `unlockCoupon` 单独调用成功（已有 claim 时幂等返回）
- 无真实 AR SDK / 摄像头 / 定位调用

**标记：** `AR_REGRESSION_DEFAULT_FALLBACK_PASS = YES`

### 场景 2：AR supported success 全链路 — PASS

**流程：** `setMockCapabilities({ arSupported: true })` → 打卡 → `startARScan` → `completeARScan` → `revealRelic`

**结果：**

- `startARScan` 返回 `bridgeMode = AR`
- `completeARScan` 返回 `AR_SCANNED`、`nextAction = REVEAL_RELIC`，`relic = null`
- `revealRelic` 单独触发后新增 `userRelic`

**标记：** `AR_REGRESSION_AR_SUCCESS_PASS = YES`

### 场景 3：camera denied → fallback — PASS

**流程：** `simulateCameraDenied()` → `startARScan` → `completeARFallback` → `revealRelic`

**结果：**

- `bridgeError.errorCode = CAMERA_DENIED`，`fallbackAllowed = true`
- fallback 可完成，`revealRelic` 仍独立触发
- 页面文案路径已验收（见 PAGE_STATE_ACCEPTANCE）

**标记：** `AR_REGRESSION_CAMERA_DENIED_FALLBACK_PASS = YES`

### 场景 4：AR timeout → retry / fallback — PASS

**流程：** `startARScan` → 模拟 `AR_SCAN_TIMEOUT` → `completeARFallback` → `revealRelic`

**结果：**

- `completeARScan` 返回 `errorCode = AR_SCAN_TIMEOUT`，`fallbackAllowed = true`
- 不自动 `revealRelic` / `unlockCoupon`
- fallback 完成后可 `revealRelic`

**标记：** `AR_REGRESSION_TIMEOUT_FALLBACK_PASS = YES`

### 场景 5：revealRelic 分离边界 — PASS

**结果：**

- `completeARScan` / `completeARFallback` 后 `userRelics` 未新增
- `revealRelic` 调用后才新增
- UI 无数字藏品领取语义

**标记：** `AR_REGRESSION_RELIC_REVEAL_SEPARATION_PASS = YES`

### 场景 6：coupon unlock 分离边界 — PASS

**结果：**

- `revealRelic` 后 `couponClaims` 数量不变
- `unlockCoupon` 调用后才写入 / 返回 claim
- 商家核销链路不受 AR failure 直接影响

**标记：** `AR_REGRESSION_COUPON_UNLOCK_SEPARATION_PASS = YES`

## 4. 边界确认

确认：

1. 页面仍调用 user-app-adapter（经 user-runtime-adapter） — **CONFIRMED**
2. 页面不直接调用 ARRuntimeBridge — **CONFIRMED**（miniapp pages grep 无匹配）
3. 页面不直接调用 LQGARDebug — **CONFIRMED**
4. bridge 不写 userRelics — **CONFIRMED**
5. bridge 不写 couponClaims — **CONFIRMED**
6. bridge 不写 userPointState — **CONFIRMED**
7. `completeARScan` 不自动 revealRelic — **CONFIRMED**
8. `completeARFallback` 不自动 revealRelic — **CONFIRMED**
9. `revealRelic` 不自动 unlockCoupon — **CONFIRMED**
10. 信物不是数字藏品 — **CONFIRMED**

## 5. 是否修复

| 文件 | 修改原因 | 修改内容 | 影响 |
|------|----------|----------|------|
| `apps/shared/data-adapter/ar-runtime-bridge.js` | Node / 回归环境需与浏览器 `LQGARDebug.simulateCameraDenied` 等价能力 | 在 `ARRuntimeBridge` 导出 `simulateCameraDenied` | 仅 mock bridge debug；页面不调用；不影响 UI / Runtime / API |

## 6. 冻结结论

冻结结论：

**AR_MOCK_FLOW_REGRESSION_FREEZE_V1 = PASS**

当前 mock AR 链路可以作为真实 AR SDK 接入前的稳定基准。

后续真实 AR SDK 接入时，应只替换 `ar-runtime-bridge.js` 内部实现，不改页面调用方式，不改 user-app-adapter 对外方法，不改 Runtime 数据结构。

## 7. 后续建议

下一步建议进入：

**REAL_AR_SDK_SELECTION_AND_SPIKE_PLAN_V1**

目标：

1. 评估微信小程序可用 AR 能力
2. 评估第三方 AR SDK 可行性
3. 评估包体、权限、真机兼容性
4. 先做 spike，不直接替换 mock bridge
5. 输出真实 AR SDK 接入路线

## 8. 验收标记

AR_MOCK_FLOW_REGRESSION_FREEZE_V1_CREATED = YES
AR_REGRESSION_DEFAULT_FALLBACK_PASS = YES
AR_REGRESSION_AR_SUCCESS_PASS = YES
AR_REGRESSION_CAMERA_DENIED_FALLBACK_PASS = YES
AR_REGRESSION_TIMEOUT_FALLBACK_PASS = YES
AR_REGRESSION_RELIC_REVEAL_SEPARATION_PASS = YES
AR_REGRESSION_COUPON_UNLOCK_SEPARATION_PASS = YES
AR_MOCK_FLOW_BOUNDARY_CONFIRMED = YES
PAGE_STILL_CALLS_USER_APP_ADAPTER = CONFIRMED
NO_DIRECT_AR_SDK_PAGE_CALL = CONFIRMED
NO_DIRECT_DEBUG_PAGE_CALL = CONFIRMED
BRIDGE_DOES_NOT_WRITE_USER_RELICS = CONFIRMED
BRIDGE_DOES_NOT_WRITE_COUPON_CLAIMS = CONFIRMED
BRIDGE_DOES_NOT_WRITE_USER_POINT_STATE = CONFIRMED
COMPLETE_AR_SCAN_DOES_NOT_AUTO_REVEAL_RELIC = CONFIRMED
COMPLETE_AR_FALLBACK_DOES_NOT_AUTO_REVEAL_RELIC = CONFIRMED
REVEAL_RELIC_DOES_NOT_AUTO_UNLOCK_COUPON = CONFIRMED
RELIC_NOT_DIGITAL_COLLECTIBLE_UI_PASS = YES
NO_REAL_AR_SDK_CONNECTED = CONFIRMED
NO_REAL_CAMERA_CALLED = CONFIRMED
NO_REAL_LOCATION_CALLED = CONFIRMED
NO_RUNTIME_DATA_CHANGE = CONFIRMED
NO_PAGE_UI_MAJOR_CHANGE = CONFIRMED
AR_MOCK_FLOW_REGRESSION_FREEZE_PASS = YES
READY_FOR_REAL_AR_SDK_SELECTION_AND_SPIKE_PLAN_V1 = YES
