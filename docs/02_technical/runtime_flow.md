# AR游伴 · 运行时流程

**文档 ID：** `02_technical/runtime_flow.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** 用户 UI 操作、`point_id`、`user_id`、设备能力、Marker 事件  
**输出：** adapter 会话状态、`userPointStates` 迁移、Event Bus 事件序列、页面 `primaryAction`  

**关联：** `xr_architecture.md` · `xr_state_machine.md` · `event_bus_contract.md` · `05_crm/user_behavior_model.md`

---

## 1. Definition（定义）

### 1.1 Runtime Flow 定义

Runtime Flow = **从用户动作到持久化状态** 的可执行时序，横跨：

```text
Page → user-runtime-adapter → user-app-adapter → ar-runtime-bridge
     → xr-event-bus → runtime-builder / world-engine
     → persistSession → CRM 实体更新
```

AR游伴 运行时 **不是** 单线程函数调用栈，而是 **UI 同步调用 + Event Bus 异步协作 + adapter 事务写入** 的组合。

### 1.2 核心链路

```text
USER → XR → EVENT BUS → SPACE → RELIC → CRM
```

| 阶段 | 运行时模块 | 持久化 |
|------|------------|--------|
| USER | `pages/*` | — |
| XR | `runtime-builder`, `ar-runtime-bridge` | `arScanSessions` |
| EVENT BUS | `xr-event-bus`, `ar-event-bus` | — |
| SPACE | `getExplorationPointDetail` | `userPointStates` |
| RELIC | `revealRelic` | `userRelics` |
| CRM | `syncUserProgress` | `userProgress`, `couponClaims` |

### 1.3 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | `onEnterScenic`, `mockCheckIn`, `startARScan`, `completeARScan`, `revealRelic`, `XR_USER_TRIGGER` |
| **输出** | `{ ok, status, message, pointState, scanSession, userRelic }` + bus 事件 |

---

## 2. System Design（结构设计）

### 2.1 运行时模块栈

```text
┌──────────────────────────────────────────────────────────┐
│ L5  Pages (apps/miniapp/pages/*)                         │
├──────────────────────────────────────────────────────────┤
│ L4  Miniapp Services                                     │
│     user-runtime-adapter · pilot-scene-flow              │
│     ar-entry-controller · explore-map / home services    │
├──────────────────────────────────────────────────────────┤
│ L3  Shared Adapter (apps/shared/data-adapter/)           │
│     user-app-adapter · adapter-session · mock-source     │
│     ar-runtime-bridge · status-map                       │
├──────────────────────────────────────────────────────────┤
│ L2  Event Bus                                            │
│     xr-event-bus · ar-event-bus                          │
├──────────────────────────────────────────────────────────┤
│ L1  XR Runtime Core                                      │
│     runtime-builder · world-engine · ar-marker-entry     │
└──────────────────────────────────────────────────────────┘
```

### 2.2 数据流（只读 vs 写入）

| 模块 | 读 | 写 |
|------|----|----|
| `mock-source.js` | 模板种子 | 不直接写（只读源） |
| `adapter-session.js` | — | `userPointStates`, `userRelics`, `arScanSessions`, `couponClaims` |
| `ar-runtime-bridge.js` | 设备能力 | 扫描会话元数据（经 adapter 合并） |
| `runtime-builder.js` | bus 事件 | `XR_STATE`（内存） |
| `world-engine.js` | bus 事件 | 仪式层内存状态 |

**硬规则：** bridge **不** 直接写 `userRelics` / `couponClaims`（见 `data-adapter/README.md`）。

### 2.3 双状态机并存

| 层 | 名称 | 枚举位置 | 职责 |
|----|------|----------|------|
| L-A | XR Runtime State | `runtime-builder.js` | `IDLE\|INIT\|READY\|RUNNING\|FAILED` |
| L-B | Revelation Phase | `pages/ar-entry/index.js` | `idle\|scanning_ar\|fallback_ready\|...` |
| L-C | Exploration Status | `user-app-adapter.js` | `AVAILABLE\|...\|COMPLETED` |

**不合并枚举。** 对齐表见 `xr_state_machine.md`。

### 2.4 探索点状态全集（adapter）

| status | 含义 | 下一典型状态 |
|--------|------|--------------|
| `LOCKED` | 未解锁 | `AVAILABLE` |
| `AVAILABLE` | 可探索 | `ARRIVED` / `CHECKED_IN` |
| `ARRIVED` | 已到达 | `CHECKED_IN` |
| `CHECKED_IN` | 已打卡 | `SCANNING` |
| `AR_SCANNED` | AR 显现完成 | `RELIC_REVEALED` |
| `AR_SCANNED_WITH_FALLBACK` | 备用显现完成 | `RELIC_REVEALED` |
| `RELIC_REVEALED` | 信物已显现 | `COUPON_UNLOCKED` |
| `COUPON_UNLOCKED` | 礼遇已领 | `COMPLETED` |
| `COMPLETED` | 探索完成 | 终态 |

标签：`status-map.js` → `DOMAIN_OVERRIDES.exploration`

### 2.5 AR 扫描会话状态

| scan.status | 触发 |
|-------------|------|
| `SCANNING` | `startARScan` |
| `SUCCESS` / `COMPLETED` | `completeARScan` ok |
| `FALLBACK_COMPLETED` | `completeARFallback` |

---

## 3. Flow（流程）

### 3.1 XR 启动流程图（文字版）

```text
                         ┌─────────────────────┐
                         │ 用户：进入景区 / 开始显现 │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
   ┌──────────────────────┐                 ┌──────────────────────┐
   │ UI: pilot-fx xr_start │                 │ UI: ar-entry 开始显现  │
   │ (并行，不阻塞)         │                 └──────────┬───────────┘
   └──────────────────────┘                            │
                                                         ▼
                                            ┌────────────────────────┐
                                            │ ar-entry-controller    │
                                            │ .trigger({ source })   │
                                            └────────────┬───────────┘
                                                         │
                                                         ▼
                                            ┌────────────────────────┐
                                            │ BUS: XR_USER_TRIGGER   │
                                            └────────────┬───────────┘
                                                         │
                         ┌───────────────────────────────┼───────────────────────────────┐
                         │                               │                               │
                         ▼                               ▼                               ▼
              ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
              │ runtime-builder  │          │ world-engine     │          │ adapter          │
              │ IDLE→INIT        │          │ handleXrUserTrigger│         │ startARScan      │
              │ →READY→RUNNING   │          │ RELIC_CREATED*   │          │ (业务会话)        │
              └────────┬─────────┘          └──────────────────┘          └────────┬─────────┘
                       │                                                            │
                       │ on timeout / error                                         │
                       ▼                                                            ▼
              ┌──────────────────┐                                      ┌──────────────────┐
              │ BUS: XR_FAILED   │                                      │ bridgeMode       │
              │ → UI fallback    │                                      │ AR | FALLBACK    │
              └──────────────────┘                                      └──────────────────┘
```

`*` world-engine 仪式事件与 adapter 信物写入 **并行**，CRM 以 adapter 为准。

### 3.2 Event Sequence（进入景区 + 单点探索）

| T | 来源 | 事件 / 方法 | Payload 要点 |
|---|------|-------------|--------------|
| T0 | `index` | `pilot-scene-flow.runStageEffect(ENTER)` | `effectId=xr_start_v1` |
| T1 | `index` | `ar-entry-controller.trigger` | `{ source: 'index_enter_scenic' }` |
| T2 | bus | `XR_USER_TRIGGER` | `{ source }` |
| T3 | builder | `XR_START_PIPELINE` | 内部 |
| T4 | builder | `XR_STATE_CHANGE` | `{ state: 'INIT' }` |
| T5 | builder | `XR_STATE_CHANGE` | `{ state: 'READY' }` |
| T6 | builder | `XR_STATE_CHANGE` | `{ state: 'RUNNING' }` |
| T7 | `index` | `wx.navigateTo` explore-map | `pilotScene=explore` |
| T8 | `detail` | `adapter.mockCheckIn` | `status=CHECKED_IN` |
| T9 | `ar-entry` | `adapter.startARScan` | `bridgeMode`, `scanSessionId` |
| T10 | marker | `ar:detected` / `ar:active` | ar-event-bus |
| T11 | `ar-entry` | `adapter.completeARScan` | `status=AR_SCANNED` |
| T12 | `lottie` | `adapter.revealRelic` | `userRelic.status=COLLECTED` |
| T13 | world | `RELIC_CREATED` | 仪式层（可选 UI） |
| T14 | `rights` | `adapter.unlockCoupon` | `claimStatus=UNUSED` |

完整契约：`event_bus_contract.md`

### 3.3 State Transition（探索点 · 主路径）

```text
[AVAILABLE]
    │ mockCheckIn (ok)
    ▼
[CHECKED_IN]
    │ startARScan (ok, bridgeMode=AR|FALLBACK)
    ▼
[SCANNING]  (arScanSessions, 非 pointState 枚举值)
    │ completeARScan (ok)
    ▼
[AR_SCANNED]
    │ revealRelic (ok)
    ▼
[RELIC_REVEALED]
    │ unlockCoupon (ok)
    ▼
[COMPLETED]
```

### 3.4 State Transition（备用显现路径）

```text
[CHECKED_IN]
    │ startARScan (bridgeMode=FALLBACK)
    ▼
[SCANNING]
    │ completeARFallback (ok)
    ▼
[AR_SCANNED_WITH_FALLBACK]
    │ revealRelic (ok)  ← 与 AR 路径相同入口
    ▼
[RELIC_REVEALED]
```

### 3.5 State Transition（XR Runtime L-A）

```text
IDLE --XR_USER_TRIGGER--> INIT --world+camera ready--> READY --auto--> RUNNING
  ^                              |
  |                              +--timeout/error--> FAILED
  +----------- retry trigger -----+
```

### 3.6 页面调用链（文件级）

```text
pages/index/index.js
  onEnterScenic → pilot-scene-flow + ar-entry-controller

pages/explore-map/index.js
  onLoad(pilotScene) → runStageEffect(EXPLORE)

pages/merchant-event/detail/index.js
  onCheckIn → user-runtime-adapter.mockCheckIn

pages/ar-entry/index.js
  _startARFlow → adapter.startARScan
  _completeAR / _completeFallback → completeARScan | completeARFallback

pages/lottie/index.js
  onCompleteReveal → adapter.revealRelic

pages/event-complete/index.js
  pilot-scene COMPLETE toast
```

### 3.7 session 持久化流

```text
adapter 写操作
  → getSession()  // adapter-session.js
  → mutate userPointStates / userRelics / ...
  → persistSession()  // sessionStorage (miniapp) | memory (node)
```

---

## 4. Data Model（数据模型）

### 4.1 startARScan 响应 schema

```json
{
  "$schema": "aryouban.adapter.start_ar_scan.v1",
  "required": ["ok", "pointId", "status"],
  "properties": {
    "ok": { "type": "boolean" },
    "scanSessionId": { "type": "string" },
    "pointId": { "type": "string" },
    "status": { "enum": ["SCANNING", "FAILED", "COMPLETED"] },
    "statusLabel": { "type": "string" },
    "bridgeMode": { "enum": ["AR", "FALLBACK"] },
    "fallbackAllowed": { "type": "boolean" },
    "message": { "type": "string" },
    "scanSession": { "$ref": "#/definitions/scanSession" }
  }
}
```

### 4.2 scanSession schema

```json
{
  "id": "scan_xxx",
  "userId": "user_001",
  "pointId": "ep_001",
  "status": "SCANNING",
  "bridgeMode": "FALLBACK",
  "startedAt": "ISO8601",
  "completedAt": ""
}
```

### 4.3 completeARScan 响应 schema

```json
{
  "ok": true,
  "status": "AR_SCANNED",
  "nextAction": "REVEAL_RELIC",
  "message": "显现完成，可继续显现信物",
  "scanSession": {},
  "pointState": {
    "pointId": "ep_001",
    "status": "AR_SCANNED",
    "statusLabel": "已扫描"
  }
}
```

### 4.4 userPointState 行 schema

```json
{
  "id": "ups_001",
  "userId": "user_001",
  "pointId": "ep_001",
  "parkId": "park_001",
  "activityId": "activity_001",
  "status": "AVAILABLE",
  "arrivedAt": "",
  "checkedInAt": "",
  "arScannedAt": "",
  "relicRevealedAt": "",
  "couponUnlockedAt": ""
}
```

### 4.5 XR_USER_TRIGGER（运行时交叉引用）

```json
{
  "source": "index_enter_scenic",
  "readiness": {}
}
```

---

## 5. Example（示例）

### 5.1 Node 全链路脚本（可验证）

```javascript
// scripts 外可直接 node -e 执行，见 product_overview §5.1
const path = require('path');
const root = path.join(__dirname, '..'); // 或 LOVEQIGU_MASTER 根

function boot() {
  require(path.join(root, 'apps/shared/data-adapter/mock-source.js'));
  require(path.join(root, 'apps/shared/data-adapter/status-map.js'));
  require(path.join(root, 'apps/shared/data-adapter/adapter-session.js'));
  require(path.join(root, 'apps/shared/data-adapter/ar-runtime-bridge.js'));
  require(path.join(root, 'apps/shared/data-adapter/user-app-adapter.js'));
  const g = global;
  g.LQGAdapterSessionStore.initSession({ mockSource: g.LQGMockSource, mode: 'memory' });
  return g.LQGUserAppAdapter;
}

const a = boot();
const uid = 'user_001';
const pid = 'ep_001';

const steps = [];
steps.push(['mockCheckIn', a.mockCheckIn(pid, uid)]);
const start = a.startARScan(pid, uid);
steps.push(['startARScan', start]);
const complete = start.bridgeMode === 'FALLBACK'
  ? a.completeARFallback(start.scanSessionId, uid)
  : a.completeARScan(start.scanSessionId, uid);
steps.push(['complete', complete]);
steps.push(['revealRelic', a.revealRelic(pid, uid)]);
steps.push(['unlockCoupon', a.unlockCoupon(pid, uid)]);

steps.forEach(([name, r]) => console.log(name, r.ok, r.status));
```

### 5.2 FALLBACK 专用路径

```javascript
const start = a.startARScan('ep_001', 'user_001');
// bridgeMode === 'FALLBACK' 时：
const fb = a.completeARFallback(start.scanSessionId, 'user_001');
// fb.pointState.status === 'AR_SCANNED_WITH_FALLBACK'
// fb.nextAction === 'REVEAL_RELIC'
const relic = a.revealRelic('ep_001', 'user_001');
// relic.ok === true
```

### 5.3 错误：未完成显现即 revealRelic

```javascript
a.mockCheckIn('ep_001', 'user_001');
const r = a.revealRelic('ep_001', 'user_001');
// r.ok === false
// r.message === '请先完成 AR 显现'
```

### 5.4 Event Bus 监听（调试片段）

```javascript
// 仅 miniapp 环境
const bus = require('./apps/miniapp/services/xr/xr-event-bus.js');
bus.on('XR_STATE_CHANGE', (d) => console.log('XR_STATE', d));
bus.on('XR_FAILED', (d) => console.log('XR_FAILED', d));
```

---

## 6. Execution Notes（执行说明）

### 6.1 验证命令

```bash
node scripts/user_frontend/validate_build.js
node scripts/user_frontend/validate_pilot_scene_product.js
node scripts/user_frontend/validate_xr_ui_decouple.js
```

### 6.2 人工回归文档

- `docs/ui_implementation/AR_MOCK_FLOW_REGRESSION_FREEZE_V1.md`  
- `docs/ui_implementation/USER_EXPLORATION_RUNTIME_FLOW_V1.md`  

### 6.3 变更协议

| 变更 | 同步文档 |
|------|----------|
| 新增 adapter 方法 | 本文件 + `product_overview` + `user_behavior_model` |
| 新增 exploration status | `status-map.js` + 本文件 §2.4 |
| 新增 bus 事件 | `event_bus_contract.md` |
| XR 状态枚举变更 | `xr_state_machine.md` + 架构评审 |

### 6.4 与 XR 关系摘要

- **UI 线程：** 页面 → adapter（同步返回 JSON）  
- **XR 线程：** controller → bus → builder（并行，不阻塞 adapter 事务）  
- **CRM 真相源：** adapter `persistSession` 后的 `userPointStates` / `userRelics`  
- **失败：** `XR_FAILED` 或 `completeARScan` fail → `failure_recovery_sop.md`  

### 6.5 禁止模式

- 页面直接改 `mock-source` 数组  
- `completeARScan` 内自动 `revealRelic`（当前实现 **不** 自动触发）  
- 跳过 `CHECKED_IN` 直接 `startARScan`（adapter 拒绝）  

---

*运行时流程 V1.1-ENG · Batch 1*
