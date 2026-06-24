# AR游伴 · XR 技术架构

**文档 ID：** `02_technical/xr_architecture.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** 用户 UI 操作、空间/Marker、adapter 扫描请求  
**输出：** 显现状态、Event Bus 事件、信物触发前置、UI overlay 反馈  

**上位引用：** `XR_RUNTIME_POLICY_FREEZE_V1` · `AR_YOUBAN_SYSTEM_FREEZE_MASTER_V1`  
**关联：** `xr_state_machine.md` · `event_bus_contract.md`

---

## 1. Definition（定义）

### 1.1 XR Runtime 定义

在 AR游伴 中，**XR Runtime** 指以下可执行集合：

```text
xr-event-bus + runtime-builder + world-engine + ar-runtime-bridge + Marker 宿主组件
```

不是单个页面，也不是微信 `xr-frame` 本身。

### 1.2 输入 / 输出

| 类型 | 内容 |
|------|------|
| **输入** | `XR_USER_TRIGGER`；`adapter.startARScan(pointId)`；Marker 姿态事件 |
| **输出** | `XR_STATE_CHANGE` / `XR_FAILED`；`userPointStates` 迁移；`pilot-fx` 动效；页面 `primaryAction` |

### 1.3 硬约束

1. UI 与 `xr-frame` **解耦**（validator 强制）  
2. 首页 **仅** `ar-entry-controller.trigger()`，不 bootstrap 全量 runtime  
3. 失败 **必须** 走 FALLBACK 或 toast+return，禁止白屏  

---

## 2. System Design（结构设计）

### 2.1 分层架构

```text
┌─────────────────────────────────────────────────────────────┐
│ L4  UI Layer                                                │
│ pages/* · pilot-fx-overlay · safe-interaction                 │
├─────────────────────────────────────────────────────────────┤
│ L3  Control Layer                                           │
│ ar-entry-controller · user-runtime-adapter                  │
├─────────────────────────────────────────────────────────────┤
│ L2  Event Bus Layer                                         │
│ xr-event-bus │ ar-event-bus │ user-app-adapter              │
├─────────────────────────────────────────────────────────────┤
│ L1  XR Runtime Core                                         │
│ runtime-builder │ world-engine │ ar-runtime-bridge          │
├─────────────────────────────────────────────────────────────┤
│ L0  XR Host                                                 │
│ ar-marker-xr-scene (xr-frame only)                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 模块注册表

| 模块 | 路径 | 输入 | 输出 |
|------|------|------|------|
| ar-entry-controller | `services/ar/ar-entry-controller.js` | trigger payload | `XR_USER_TRIGGER` |
| runtime-builder | `core/runtime/runtime-builder.js` | bus 事件 | 管线状态、`XR_FAILED` |
| world-engine | `core/world/world-engine.js` | `XR_USER_TRIGGER` | `RELIC_CREATED`、`STAR_LIGHTED` |
| ar-runtime-bridge | `apps/shared/data-adapter/ar-runtime-bridge.js` | 设备/会话 | `bridgeMode` |
| ar-marker-entry | `components/ar-marker-entry/` | Marker | `ar-event-bus` 事件 |
| pilot-fx-overlay | `components/pilot-fx-overlay/` | effectId | UI 动效（非 XR 内） |

### 2.3 页面 XR 嵌入矩阵

| 页面 | xr-frame | 说明 |
|------|----------|------|
| index | 否 | 仅 emit trigger |
| explore-map | 否 | 可选跳转 xr_demo |
| ar-entry | 是（子组件） | overlay 承载全部 UI |
| lottie | 否 | 信物仪式 UI |

---

## 3. Flow（流程）

### 3.1 Runtime 流程图（启动）

```text
                    ┌─────────────────┐
                    │  UI: trigger()  │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ emit XR_USER_TRIGGER         │
              └──────────────┬───────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│runtime-builder │  │ world-engine   │  │ UI: pilot-fx   │
│ INIT→READY→    │  │ 星宿/经络启动  │  │ xr_start_v1    │
│ RUNNING        │  │                │  │ safeNavigate   │
└───────┬────────┘  └────────────────┘  └────────────────┘
        │ timeout / error
        ▼
┌────────────────┐
│ XR_FAILED      │──► toast + FALLBACK 路径
└────────────────┘
```

### 3.2 显现业务流（adapter + ar-entry phase）

详见 `xr_state_machine.md` §3.1。摘要：

```text
mockCheckIn → startARScan → [AR|FALLBACK] → complete* → revealRelic
```

### 3.3 State Machine 索引

| 状态机 | 文档 |
|--------|------|
| XR Runtime `IDLE…FAILED` | `xr_state_machine.md` §2.1 |
| Revelation `phase` | `xr_state_machine.md` §2.3 |
| 探索点 `userPointStates.status` | `xr_state_machine.md` §2.5 |

### 3.4 Event Bus 索引

完整事件表：`event_bus_contract.md` §2.1–2.2

---

## 4. Data Model（数据模型）

### 4.1 arScanSessions

```json
{
  "id": "scan_session_uuid",
  "pointId": "ep_001",
  "userId": "user_001",
  "status": "SCANNING | SUCCESS | TIMEOUT",
  "bridgeMode": "AR | FALLBACK",
  "startedAt": "ISO8601",
  "completedAt": "ISO8601"
}
```

### 4.2 startARScan 响应

```json
{
  "ok": true,
  "scanSessionId": "scan_session_uuid",
  "bridgeMode": "AR",
  "bridgeResult": { "mode": "AR" },
  "message": "显现流程已开始",
  "statusLabel": "显现进行中"
}
```

### 4.3 Runtime Package 引用

```json
{
  "schema_id": "loveqigu.ar.runtime.runtime_package.v1",
  "anchor_binding": { "anchor_type": "image_anchor" },
  "runtime_binding": {
    "ar_entity_ref": "ar_entity",
    "ar_runtime_flow_ref": "ar_runtime_flow"
  }
}
```

路径：`apps/miniapp/data/runtime/ar_factory/*/`

---

## 5. Example（示例）

### 5.1 首页启动（标准）

```javascript
// pages/index/index.js — 允许模式
const entry = require('../../services/ar/ar-entry-controller.js');
entry.trigger({ source: 'index_enter_scenic' });
this.safeNavigate('/pages/explore-map/index?pilotScene=explore');
```

### 5.2 ar-entry 分层 WXML

```xml
<view class="xr-page-fixed">
  <view class="xr-host-layer">
    <ar-marker-xr-scene />
  </view>
  <view class="ui-overlay-layer">
    <button bindtap="onPrimaryAction">{{primaryLabel}}</button>
  </view>
</view>
```

### 5.3 验证命令

```bash
node scripts/user_frontend/validate_xr_ui_decouple.js
node scripts/user_frontend/validate_build.js
```

期望：`XR_UI_DECOUPLE_PASS` · `USER_FRONTEND_BUILD_PASS`

---

## 6. Execution Notes（执行说明）

### 6.1 变更审批矩阵

| 文件 | 变更级别 |
|------|----------|
| runtime-builder.js | 架构评审 |
| world-engine.js | 架构评审 |
| xr-event-bus.js | 架构评审 |
| pages/* · pilot/* | 产品迭代 |

### 6.2 真机状态（冻结参考）

| 能力 | 状态 |
|------|------|
| XR Renderer | PASS |
| Marker Runtime | FAIL（REAL_AR_READY: NO） |
| Mock + FALLBACK 闭环 | PASS |

策略：**先保证闭环，再追 Marker 真机。**

### 6.3 本地调试步骤

1. 开发者工具 → `apps/miniapp`  
2. 首页「进入景区」→ 过滤 `XR_USER_TRIGGER`  
3. ar-entry → `startARScan` / `completeARScan`  
4. 失败路径 → 确认 FALLBACK 与 toast  

### 6.4 关联文档

- `runtime_flow.md` — Adapter 端到端  
- `system_boundary.md` — 模块边界  
- `failure_recovery_sop.md` — 运营降级  
- `03_visual/xr_visual_spec.md` — UI 动效接入  

---

*XR 架构 V1.1-ENG · 工程标准文档*
