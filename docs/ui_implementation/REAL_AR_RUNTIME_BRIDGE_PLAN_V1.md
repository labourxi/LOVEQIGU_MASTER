# REAL_AR_RUNTIME_BRIDGE_PLAN_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的 AR Runtime Bridge。

`REAL_AR_DEVICE_INTEGRATION_V1` 已经明确真实 AR SDK、摄像头、定位、QR credential、AR scan credential、fallback 和真机验收路径。

但在直接接真实 AR SDK 前，需要先建立一个稳定的桥接层规划：

```
页面
→ user-app-adapter
→ ar-runtime-bridge
→ mock AR / fallback / future AR SDK
→ user-app-adapter
→ 服务端状态写入
```

本文件用于定义 `apps/shared/data-adapter/ar-runtime-bridge.js` 的职责、接口、状态、错误归一化、mock 行为、fallback 行为和后续真实 SDK 替换边界。

本轮只做规划，不直接接真实 AR SDK，不修改页面代码。

---

## 2. 本轮目标

本轮目标：

1. 定义 AR Runtime Bridge 的职责
2. 定义 bridge 与 user-app-adapter 的关系
3. 定义 bridge 与未来真实 AR SDK 的关系
4. 定义设备能力检测接口
5. 定义摄像头 / 定位权限请求接口
6. 定义 AR 会话启动 / 进度 / 完成 / 失败 / 释放接口
7. 定义 fallback 完成接口
8. 定义错误归一化规则
9. 定义 mock implementation 行为
10. 定义后续真实 SDK 替换边界
11. 定义页面不得直接调用 AR SDK 的规则
12. 定义后续实施顺序

---

## 3. 当前基础

已完成基础：

1. USER_EXPLORATION_RUNTIME_FLOW_V1
2. REAL_USER_EXPLORATION_API_V1
3. REAL_CONTENT_PRODUCTION_API_V1
4. REAL_AR_DEVICE_INTEGRATION_V1

当前已有相关文件：

1. apps/shared/data-adapter/user-app-adapter.js
2. apps/shared/data-adapter/content-production-adapter.js
3. apps/shared/data-adapter/status-map.js
4. apps/shared/data-adapter/mock-source.js
5. apps/shared/data-adapter/adapter-session.js

建议后续新增文件：

```
apps/shared/data-adapter/ar-runtime-bridge.js
```

本轮只规划，不创建真实 SDK 实现。

---

## 4. AR Runtime Bridge 定位

AR Runtime Bridge 是用户端 AR 能力的统一抽象层。

它负责：

1. 检测设备能力
2. 请求摄像头权限
3. 请求定位权限
4. 启动 AR 会话
5. 上报 AR 识别进度
6. 完成 AR 会话
7. 完成 fallback 流程
8. 释放 AR 资源
9. 归一化 AR 错误
10. 屏蔽真实 AR SDK 差异

它不负责：

1. 用户进度写入
2. 信物显现写入
3. 礼遇领取写入
4. 权益核销写入
5. 直接修改 userPointState
6. 直接生成 userRelics
7. 直接访问页面 DOM
8. 直接绕过 user-app-adapter

业务状态仍由 `user-app-adapter` 和服务端 API 负责。

---

## 5. 调用链路

标准调用链路：

```
用户点击 AR 显现入口
→ 页面调用 userAppAdapter.startARScan(pointId, userId)
→ user-app-adapter 创建 / 获取 scanSession
→ user-app-adapter 调用 ar-runtime-bridge.detectDeviceCapabilities()
→ user-app-adapter 调用 ar-runtime-bridge.requestCameraPermission()
→ user-app-adapter 调用 ar-runtime-bridge.startARSession(arContent, options)
→ ar-runtime-bridge 使用 mock / fallback / future SDK 执行显现
→ ar-runtime-bridge 返回完成结果
→ user-app-adapter 调用 completeARScan()
→ 服务端或 mock session 写入 AR_SCANNED
→ 用户进入 revealRelic
```

页面层只允许调用：

1. user-app-adapter
2. 页面视觉组件

页面层不得直接调用：

1. AR SDK
2. 摄像头 SDK
3. 定位 SDK
4. ar-runtime-bridge 内部实现细节
5. adapter-session 写入方法

---

## 6. Bridge 接口设计

建议 `ar-runtime-bridge.js` 暴露以下方法：

### 6.1 detectDeviceCapabilities

```js
async function detectDeviceCapabilities(options = {})
```

返回：

```json
{
  "camera": true,
  "location": true,
  "motion": false,
  "webgl": true,
  "canvas": true,
  "arSupported": false,
  "fallbackRecommended": true,
  "network": "GOOD",
  "recommendedMode": "FALLBACK"
}
```

用途：判断是否可进入真实 AR；判断是否推荐 fallback；作为 startARScan 的前置信息。

### 6.2 requestCameraPermission

```js
async function requestCameraPermission(options = {})
```

返回：

```json
{
  "status": "CAMERA_GRANTED",
  "granted": true,
  "message": "摄像头已授权"
}
```

状态：CAMERA_UNKNOWN、CAMERA_GRANTED、CAMERA_DENIED、CAMERA_UNAVAILABLE。

### 6.3 requestLocationPermission

```js
async function requestLocationPermission(options = {})
```

返回：

```json
{
  "status": "LOCATION_GRANTED",
  "granted": true,
  "message": "定位已授权"
}
```

状态：LOCATION_UNKNOWN、LOCATION_GRANTED、LOCATION_DENIED、LOCATION_UNAVAILABLE、LOCATION_OUT_OF_RANGE。

### 6.4 startARSession

```js
async function startARSession(arContent, options = {})
```

入参：

```json
{
  "arContent": {},
  "scanSessionId": "scan_001",
  "pointId": "ep_001",
  "mode": "MOCK_AR_OR_FALLBACK",
  "timeoutSeconds": 60
}
```

返回：

```json
{
  "ok": true,
  "sessionStatus": "STARTED",
  "mode": "FALLBACK",
  "message": "显现流程已开始"
}
```

### 6.5 reportARProgress

```js
async function reportARProgress(scanSessionId, payload = {})
```

用途：上报 SCANNING / RECOGNIZED / TIMEOUT 等状态；用于日志和调试；不作为可信完成依据。

返回：

```json
{
  "ok": true,
  "status": "SCANNING",
  "progress": 0.5
}
```

### 6.6 completeARSession

```js
async function completeARSession(scanSessionId, payload = {})
```

返回：

```json
{
  "ok": true,
  "status": "COMPLETED",
  "credential": "MOCK_AR_CREDENTIAL",
  "credentialType": "AR_SCAN_SUCCESS",
  "message": "显现完成"
}
```

说明：mock 阶段返回 mock credential；真实 SDK 阶段由 SDK / 服务端返回可信 credential；不在 bridge 内写入 userRelics。

### 6.7 completeFallback

```js
async function completeFallback(scanSessionId, reason = "AR_NOT_SUPPORTED")
```

返回：

```json
{
  "ok": true,
  "status": "FALLBACK_COMPLETED",
  "fallbackUsed": true,
  "fallbackReason": "AR_NOT_SUPPORTED",
  "credential": "MOCK_FALLBACK_CREDENTIAL",
  "message": "已使用备用显现流程"
}
```

### 6.8 disposeARSession

```js
async function disposeARSession(scanSessionId)
```

用途：释放摄像头、释放 AR SDK 实例、清理计时器、清理临时监听。

返回：

```json
{
  "ok": true,
  "disposed": true
}
```

### 6.9 normalizeARError

```js
function normalizeARError(error)
```

返回：

```json
{
  "ok": false,
  "errorCode": "AR_NOT_SUPPORTED",
  "statusLabel": "设备不支持",
  "message": "当前设备暂不支持 AR，可使用备用显现"
}
```

---

## 7. Bridge 状态模型

Bridge 内部状态建议：

1. IDLE
2. DETECTING
3. PERMISSION_REQUESTING
4. READY
5. STARTING
6. SCANNING
7. RECOGNIZED
8. COMPLETED
9. FALLBACK_READY
10. FALLBACK_COMPLETED
11. FAILED
12. DISPOSED

状态流：

```
IDLE → DETECTING → PERMISSION_REQUESTING → READY → STARTING → SCANNING → RECOGNIZED → COMPLETED → DISPOSED
```

fallback 流：

```
IDLE → DETECTING → FALLBACK_READY → FALLBACK_COMPLETED → DISPOSED
```

失败流：

```
STARTING / SCANNING → FAILED → FALLBACK_READY 或 DISPOSED
```

---

## 8. Mock Implementation 行为

本阶段 mock bridge 应模拟：

1. 设备能力检测
2. 摄像头授权成功 / 失败
3. 定位授权成功 / 失败
4. AR 支持 / 不支持
5. AR 扫描进度
6. AR 扫描完成
7. AR 扫描超时
8. fallback 完成
9. 错误归一化

mock 默认策略：

```json
{
  "camera": true,
  "location": true,
  "arSupported": false,
  "fallbackRecommended": true,
  "recommendedMode": "FALLBACK"
}
```

mock 不应：调用真实摄像头、调用真实定位、调用真实 AR SDK、修改页面结构、写入真实 Runtime、伪装为真机验收通过。

---

## 9. Fallback 行为

fallback 是备用显现流程，不是失败跳过。

fallback 应保持：显现仪式、东方克制视觉、信物回应感、用户仍需确认完成、仍需服务端 / adapter 写入 AR_SCANNED_WITH_FALLBACK。

fallback 可实现为：Canvas 显现动画、Lottie 显现动画、静态图 + 仪式文案、QR credential 确认、低端设备友好流程。

fallback 禁止：直接给奖励、直接跳过信物显现、变成失败补偿、使用抽奖 / 爆奖语义、绕过 user-app-adapter。

---

## 10. 错误归一化规则

Bridge 应把底层错误归一化为统一 errorCode：

| errorCode | 中文提示 |
| --------- | -------- |
| CAMERA_DENIED | 请允许摄像头权限，或使用备用显现流程 |
| CAMERA_UNAVAILABLE | 当前设备无法使用摄像头 |
| LOCATION_DENIED | 请允许定位，或使用现场二维码完成验证 |
| LOCATION_OUT_OF_RANGE | 当前不在探索点范围内 |
| AR_NOT_SUPPORTED | 当前设备暂不支持 AR，可使用备用显现 |
| AR_RESOURCE_LOAD_FAILED | AR 资源加载失败，请稍后重试 |
| AR_SCAN_TIMEOUT | 显现超时，请重试或使用备用流程 |
| AR_CREDENTIAL_INVALID | 显现凭证无效，请重新扫描 |
| AR_SESSION_NOT_FOUND | 未找到 AR 会话 |
| AR_SESSION_EXPIRED | AR 会话已过期，请重新开始 |
| AR_ALREADY_COMPLETED | 该显现流程已完成 |
| FALLBACK_NOT_ALLOWED | 当前探索点不允许备用流程 |
| NETWORK_ERROR | 网络异常，请稍后重试 |

错误返回格式统一为：

```json
{
  "ok": false,
  "errorCode": "AR_SCAN_TIMEOUT",
  "statusLabel": "显现超时",
  "message": "显现超时，请重试或使用备用流程"
}
```

---

## 11. 与 user-app-adapter 的关系

`user-app-adapter` 负责业务状态：startARScan、completeARScan、revealRelic、更新 userPointState、写入 scanSession、写入 operationLog。

`ar-runtime-bridge` 负责设备与运行时能力：检测设备、请求权限、启动 AR / fallback、返回完成凭证、归一化错误。

边界：

1. bridge 不直接 revealRelic
2. bridge 不直接 unlockCoupon
3. bridge 不直接写 userRelics
4. bridge 不直接改权益状态
5. adapter 不直接依赖某个具体 AR SDK
6. 页面不直接调用真实 AR SDK

---

## 12. 与真实 AR SDK 的替换边界

未来真实 SDK 接入时，只替换 bridge 内部实现，不改页面和 user-app-adapter 对外方法。

替换前：

```
ar-runtime-bridge mock → simulate progress → return mock credential
```

替换后：

```
ar-runtime-bridge real → initialize AR SDK → load arContent.assetUrl → request camera → scan / recognize → SDK callback → return real credential
```

不得改变：user-app-adapter 方法名、页面调用方式、completeARSession 返回结构、normalizeARError 返回结构、fallback 接口、错误码体系。

---

## 13. 文件规划

后续实施建议新增：

```
apps/shared/data-adapter/ar-runtime-bridge.js
```

建议导出：

```js
export const ARRuntimeBridge = {
  detectDeviceCapabilities,
  requestCameraPermission,
  requestLocationPermission,
  startARSession,
  reportARProgress,
  completeARSession,
  completeFallback,
  disposeARSession,
  normalizeARError,
};
```

也可以挂载到 `window.LQGARuntimeBridge`，仅用于开发调试，不作为业务依赖。

---

## 14. 调试工具规划

建议后续 mock bridge 提供调试对象：

```js
window.LQGARDebug = {
  getCapabilities(),
  setCapabilities(payload),
  simulateCameraDenied(),
  simulateARUnsupported(),
  simulateARTimeout(),
  simulateARSuccess(),
  simulateFallbackSuccess(),
  reset()
}
```

用途：模拟摄像头拒绝、模拟低端设备、模拟 AR 资源加载失败、模拟扫描超时、模拟 fallback 成功、支持回归测试。

调试工具不得在生产模式暴露。

---

## 15. 实施顺序建议

### Step 1：创建 ar-runtime-bridge.js mock

1. 导出完整 bridge 方法
2. 不接真实 AR SDK
3. 默认 fallbackRecommended = true
4. 返回 mock credential

### Step 2：user-app-adapter 接入 bridge

1. startARScan 调用 detectDeviceCapabilities
2. completeARScan 接收 bridge credential
3. fallback-complete 走统一接口
4. 保持页面调用不变

### Step 3：AR 页面最小接入

1. 页面仍调用 user-app-adapter
2. 不直接调用 bridge
3. 显示 fallback / success / error 状态

### Step 4：调试工具

1. 增加 LQGARDebug
2. 支持模拟错误场景
3. 方便验收

### Step 5：真实 SDK 替换预留

1. 将 mock 方法内部实现替换为 SDK 调用
2. 不改 adapter 对外接口
3. 不改页面调用

---

## 16. 验收标准

本规划完成后，应满足：

1. bridge 职责清晰
2. 页面不得直接调用 AR SDK
3. user-app-adapter 仍是业务入口
4. fallback 是显现流程，不是跳过
5. 错误码统一
6. mock bridge 可独立替换为真实 SDK
7. 不改 Runtime 数据结构
8. 不改 Phase 2 mock AR 流程
9. 后续可进入实现任务

---

## 17. 禁止事项

1. 不直接接真实 AR SDK
2. 不调用真实摄像头
3. 不调用真实定位
4. 不改页面结构
5. 不改 Runtime 数据
6. 不绕过 user-app-adapter
7. 不让页面直接调用 AR SDK
8. 不把 fallback 做成跳过
9. 不把 AR 做成抽卡 / 爆奖
10. 不把信物写成数字藏品

验收：`NO_AR_RUNTIME_BRIDGE_LOGIC_CHANGE = CONFIRMED`

---

## 18. 风险点

1. 如果页面直接调用 bridge，后续真实 SDK 替换会变复杂
2. 如果 bridge 直接写业务状态，会破坏 adapter 边界
3. 如果 fallback 体验不统一，会削弱显现仪式感
4. 如果 mock credential 过度接近真实凭证，容易造成误判
5. 如果错误码不统一，页面会出现散落判断
6. 如果调试对象进入生产，会带来安全风险

---

## 19. 下一步建议

完成本规划后，建议进入：

**REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1**

目标：

1. 创建 apps/shared/data-adapter/ar-runtime-bridge.js
2. 实现 mock bridge
3. 提供统一设备能力检测 / fallback / 错误归一化
4. 预留真实 SDK 替换点
5. 不接真实 AR SDK

---

## 20. 验收标记

```
REAL_AR_RUNTIME_BRIDGE_PLAN_V1_CREATED = YES
REAL_AR_RUNTIME_BRIDGE_SCOPE_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_METHODS_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_STATE_MODEL_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_MOCK_BEHAVIOR_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_FALLBACK_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_ERROR_NORMALIZATION_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_ADAPTER_BOUNDARY_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_SDK_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_DEBUG_TOOL_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_AR_RUNTIME_BRIDGE_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_AR_RUNTIME_BRIDGE_PLAN_READY = YES
READY_FOR_REAL_AR_RUNTIME_BRIDGE_IMPLEMENTATION_V1 = YES
```
