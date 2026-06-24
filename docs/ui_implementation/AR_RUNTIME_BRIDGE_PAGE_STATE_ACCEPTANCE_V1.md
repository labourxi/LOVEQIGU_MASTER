# AR_RUNTIME_BRIDGE_PAGE_STATE_ACCEPTANCE_V1

## 1. 文档定位

本文件记录 LOVEQIGU / AR游伴 Phase 3 的 AR Runtime Bridge 页面状态验收结果。

本轮基于 AR_RUNTIME_BRIDGE_USER_ADAPTER_WIRING_V1，验证用户端页面在 mock AR bridge 下的 fallback、success、camera denied、timeout、fallback complete、revealRelic 独立触发等状态展示是否合理。

本轮不接真实 AR SDK，不调用真实摄像头，不调用真实定位，不改 Runtime 数据结构。

## 2. 验收范围

验收页面：

1. 探索点详情页 — `apps/miniapp/pages/merchant-event/detail/`
2. AR 显现页 — `apps/miniapp/pages/ar-entry/`
3. 信物显现仪式页 — `apps/miniapp/pages/lottie/`
4. 信物库联动 — `apps/miniapp/pages/relic-archive/`（边界文案检查，未改页面）

## 3. 验收场景

### 场景 1：默认 fallback 场景 — PASS

**操作：** 默认 bridge capabilities → 打卡 → `userApp.startARScan` → `completeARFallback`

**结果：**

- `startARScan` 返回 `bridgeMode = FALLBACK`
- AR 页显示「可使用备用显现 / 备用显现」模式提示
- 主按钮为「完成备用显现」，无「跳过 / 失败」语义
- `completeARFallback` 后状态 `AR_SCANNED_WITH_FALLBACK`，提示可继续显现信物

**标记：** `AR_PAGE_DEFAULT_FALLBACK_STATE_PASS = YES`

### 场景 2：AR supported success 场景 — PASS

**操作：** `setCapabilities({ camera: true, arSupported: true })` → `startARScan` → 用户点击「完成显现」→ `completeARScan`

**结果：**

- `startARScan` 返回 `bridgeMode = AR`
- `completeARScan` 返回 `status = AR_SCANNED`、`nextAction = REVEAL_RELIC`
- 页面显示「显现完成」，主按钮变为「显现信物」
- **未**自动调用 `revealRelic`，`complete.relic` 为 null

**标记：** `AR_PAGE_SUCCESS_STATE_PASS = YES` / `AR_PAGE_NO_AUTO_RELIC_REVEAL_PASS = YES`

### 场景 3：camera denied 场景 — PASS

**操作：** 浏览器 console `LQGARDebug.simulateCameraDenied()` → `startARScan`

**结果：**

- adapter 返回 `bridgeError.errorCode = CAMERA_DENIED`
- AR 页显示「请允许摄像头权限，或使用备用显现流程」
- 提供「完成备用显现」路径，不阻断主流程
- 无抽奖 / 奖励失败语义

**标记：** `AR_PAGE_CAMERA_DENIED_STATE_PASS = YES`

### 场景 4：AR timeout 场景 — PASS

**操作：** 显现流程中 `completeARScan` 收到 bridge `AR_SCAN_TIMEOUT`

**结果：**

- 页面显示「显现超时，请重试或使用备用流程」
- 提供「重试显现流程」与备用显现入口（error 态 secondary）
- 不自动 `revealRelic` / `unlockCoupon`

**标记：** `AR_PAGE_TIMEOUT_STATE_PASS = YES`

### 场景 5：fallback complete 场景 — PASS

**操作：** `startARScan` → `completeARFallback(scanSessionId, userId, reason)`

**结果：**

- 返回 `status = AR_SCANNED_WITH_FALLBACK`
- 页面显示「备用显现完成」
- `nextAction = REVEAL_RELIC`，主按钮「显现信物」
- 文案保留「显现 / 备用显现」，无「跳过 AR」

**标记：** `AR_PAGE_FALLBACK_COMPLETE_STATE_PASS = YES`

### 场景 6：revealRelic 独立触发 — PASS

**操作：** `completeARScan` / `completeARFallback` 后检查 session → 用户在 lottie 页点击「显现信物」→ `revealRelic`

**结果：**

- complete 后 `userRelics` 未新增
- `revealRelic` 单独调用后才新增
- 详情页 / 信物库仍为「故事进度资产 · 非数字藏品」边界表达

**标记：** `AR_PAGE_RELIC_REVEAL_SEPARATION_PASS = YES` / `RELIC_NOT_DIGITAL_COLLECTIBLE_UI_PASS = YES`

## 4. 页面边界

确认：

1. 页面仍调用 `user-app-adapter`（经 `user-runtime-adapter`） — **CONFIRMED**
2. 页面不直接调用 `ARRuntimeBridge` — **CONFIRMED**（miniapp pages grep 无匹配）
3. 页面不直接调用 `LQGARDebug` — **CONFIRMED**
4. 页面不直接写 `userRelics` / `couponClaims` / adapter-session — **CONFIRMED**
5. `completeARScan` 不自动 `revealRelic` — **CONFIRMED**
6. `completeARFallback` 不自动 `revealRelic` — **CONFIRMED**
7. `revealRelic` 由 lottie 页用户点击「显现信物」触发 — **CONFIRMED**

## 5. 文案与体验边界

确认：

1. fallback → 「备用显现」 — **YES**
2. camera denied → 「请允许摄像头权限，或使用备用显现流程」 — **YES**
3. timeout → 「显现超时，请重试或使用备用流程」 — **YES**
4. success → 「显现完成」 — **YES**
5. 下一步 → 「显现信物」 — **YES**
6. 无「跳过 AR」 — **YES**
7. 无「抽奖 / 爆奖 / SSR」 — **YES**（AR 页范围）
8. 无「数字藏品领取」 — **YES**（探索点详情保留分离说明）

## 6. 轻量修复

| 文件 | 修改内容 | 原因 |
|------|----------|------|
| `apps/miniapp/pages/ar-entry/index.js` | 显现状态机；分步 start / complete / fallback；移除 600ms 自动 complete；错误与 fallback 提示 | 对齐 bridge 接线与 6 个验收场景 |
| `apps/miniapp/pages/ar-entry/index.wxml` | 「扫描」→「显现 / 备用显现」；动态主/次按钮 | 文案与按钮态验收 |
| `apps/miniapp/pages/ar-entry/index.json` | 导航标题「AR 显现」 | 去除「扫描页」歧义 |
| `apps/miniapp/services/user-runtime-adapter/index.js` | boot 时加载 `ar-runtime-bridge.js` | miniapp 内 bridge mock 可用 |
| `apps/miniapp/pages/merchant-event/detail/index.js` | `resolveNextStepLabel` 按 adapter 能力展示下一步 | 详情页 AR / 显现入口状态 |
| `apps/miniapp/pages/lottie/index.js` | runtime mock 下调用 `adapter.revealRelic` | revealRelic 独立触发 |
| `apps/miniapp/pages/lottie/index.wxml` | 「显现信物」「返回显现流程」 | 去除「扫描壳」语义 |

## 7. 仍未做事项

本轮没有：

1. 接真实 AR SDK
2. 调用真实摄像头
3. 调用真实定位
4. 调用真实扫码能力
5. 改 Runtime 数据结构
6. 改用户端主流程架构
7. 自动触发 revealRelic / unlockCoupon
8. 大改页面视觉

## 8. 后续建议

下一步建议进入：

**AR_MOCK_FLOW_REGRESSION_FREEZE_V1**

目标：冻结当前 mock AR 流程（adapter bridge 接线 → 页面状态展示），作为后续真实 AR SDK 接入前的稳定基准。

## 9. 验收标记

AR_RUNTIME_BRIDGE_PAGE_STATE_ACCEPTANCE_V1_CREATED = YES
AR_PAGE_DEFAULT_FALLBACK_STATE_PASS = YES
AR_PAGE_SUCCESS_STATE_PASS = YES
AR_PAGE_CAMERA_DENIED_STATE_PASS = YES
AR_PAGE_TIMEOUT_STATE_PASS = YES
AR_PAGE_FALLBACK_COMPLETE_STATE_PASS = YES
AR_PAGE_RELIC_REVEAL_SEPARATION_PASS = YES
AR_PAGE_NO_AUTO_RELIC_REVEAL_PASS = YES
RELIC_NOT_DIGITAL_COLLECTIBLE_UI_PASS = YES
PAGE_STILL_CALLS_USER_APP_ADAPTER = CONFIRMED
NO_DIRECT_AR_SDK_PAGE_CALL = CONFIRMED
NO_REAL_AR_SDK_CONNECTED = CONFIRMED
NO_REAL_CAMERA_CALLED = CONFIRMED
NO_REAL_LOCATION_CALLED = CONFIRMED
NO_RUNTIME_DATA_CHANGE = CONFIRMED
NO_PAGE_UI_MAJOR_CHANGE = CONFIRMED
READY_FOR_AR_MOCK_FLOW_REGRESSION_FREEZE_V1 = YES
