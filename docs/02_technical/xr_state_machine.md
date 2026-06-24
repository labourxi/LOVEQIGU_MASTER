# AR游伴 · XR 状态机

**文档 ID：** `02_technical/xr_state_machine.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** `XR_USER_TRIGGER`、设备能力、管线回调  
**输出：** `XR_STATE_CHANGE`、`XR_FAILED`、信物触发前置条件  

---

## 1. Definition（定义）

### 1.1 范围

本文定义 **两层状态机**，均属于 AR游伴 XR Runtime：

| 层 | 名称 | 代码位置 | 职责 |
|----|------|----------|------|
| L-A | XR Runtime State | `runtime-builder.js` | 内核管线生命周期 |
| L-B | Revelation Flow Phase | `pages/ar-entry/index.js` | 用户显现业务相位 |

两层通过 **adapter**（`startARScan`/`completeARScan`）与 **Event Bus** 协作，不合并为单一枚举。

### 1.2 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | `XR_USER_TRIGGER` payload、`startARScan` 结果、`completeARScan`/`completeARFallback` 结果、Marker 事件 |
| **输出** | `XR_STATE_CHANGE`、`XR_FAILED`、`userPointStates.status` 迁移、UI `primaryAction` |

---

## 2. System Design（结构设计）

### 2.1 L-A：XR Runtime State 枚举

源码：`apps/miniapp/core/runtime/runtime-builder.js`

```javascript
const XR_STATE = Object.freeze({
  IDLE: 'IDLE',
  INIT: 'INIT',
  READY: 'READY',
  RUNNING: 'RUNNING',
  FAILED: 'FAILED'
});
```

### 2.2 L-A：状态转移表

| 当前 | 事件/条件 | 下一状态 | 副作用 |
|------|-----------|----------|--------|
| IDLE | `XR_USER_TRIGGER` → pipeline start | INIT | `resetXRReadiness`, `scheduleXRFailure` |
| INIT | world+camera ready | READY | `xrReadyFlags` 置位 |
| READY | auto transition | RUNNING | 开始渲染管线 |
| * | `handleXRFailure` / timeout | FAILED | `emit('XR_FAILED')` |
| FAILED | 用户重试 trigger | INIT | 同入口 |

### 2.3 L-B：Revelation Flow Phase 枚举

源码：`pages/ar-entry/index.js` · `resolveActionUi()`

| phase | 含义 |
|-------|------|
| `idle` | 未开始显现 |
| `scanning_ar` | 显现进行中 |
| `fallback_ready` | 可走备用显现 |
| `ar_complete` | AR 显现完成 |
| `fallback_complete` | 备用显现完成 |
| `error` | 异常，可重试 |

### 2.4 L-B：UI 动作映射

| phase | bridgeMode | primaryAction | 用户可见按钮语义 |
|-------|------------|---------------|----------------|
| idle | — | `start` | 开始显现 |
| scanning_ar | AR | `complete_ar` | 完成 AR 显现 |
| scanning_ar / fallback_ready | FALLBACK | `complete_fallback` | 完成备用显现 |
| ar_complete / fallback_complete | — | `reveal` | 前往信物显现 |
| error | — | `retry` | 重试 |

### 2.5 L-C：探索点业务状态（Adapter）

源码：`apps/shared/data-adapter/user-app-adapter.js` · `status-map.js`

与 L-A/L-B 正交，持久化在 `userPointStates`。

---

## 3. Flow（流程）

### 3.1 端到端状态协作图

```text
[UI] entry.trigger()
       │
       ▼
L-A: IDLE ──XR_USER_TRIGGER──► INIT ──► READY ──► RUNNING
       │                              │
       │                              └── timeout ──► FAILED
       │
       ▼
[UI] adapter.startARScan()
       │
       ▼
L-B: idle ──► scanning_ar ──┬──► ar_complete ──► reveal
                            └──► fallback_ready ──► fallback_complete ──► reveal
       │
       ▼
L-C: CHECKED_IN ──► AR_SCANNED ──► RELIC_REVEALED ──► COMPLETED
```

### 3.2 降级路径（强制）

```text
startARScan → bridgeMode=FALLBACK
  → phase=fallback_ready
  → completeARFallback
  → phase=fallback_complete
  → revealRelic (与 AR 成功相同入口)
```

---

## 4. Data Model（数据模型）

### 4.1 XR_STATE_CHANGE 载荷

```json
{
  "previous": "INIT",
  "state": "READY",
  "detail": {
    "source": "index_enter_scenic",
    "readiness": { "world": true, "camera": false }
  }
}
```

### 4.2 XR_FAILED 载荷

```json
{
  "state": "FAILED",
  "reason": "ready_timeout | pipeline_start_failed | runtime_guard_failed",
  "detail": { "label": "XR_USER_TRIGGER" },
  "error": "optional message string"
}
```

### 4.3 ar-entry flow 补丁（页面内存）

```json
{
  "pointId": "ep_001",
  "phase": "scanning_ar",
  "bridgeMode": "AR | FALLBACK",
  "scanSessionId": "session_uuid",
  "bridgeErrorMessage": "",
  "revelationMessage": ""
}
```

### 4.4 userPointStates 单点记录

```json
{
  "pointId": "ep_001",
  "status": "CHECKED_IN",
  "checkedInAt": "ISO8601",
  "arScannedAt": "",
  "relicRevealedAt": ""
}
```

---

## 5. Example（示例）

### 5.1 正常 AR 路径

```text
1. status: AVAILABLE
2. mockCheckIn → CHECKED_IN
3. startARScan → { ok:true, bridgeMode:'AR', scanSessionId:'s1' }
4. phase: scanning_ar
5. completeARScan('s1') → { ok:true }
6. phase: ar_complete → primaryAction: reveal
7. revealRelic → RELIC_REVEALED
```

### 5.2 备用显现路径

```text
1. startARScan → { ok:true, bridgeMode:'FALLBACK' }
2. phase: fallback_ready
3. completeARFallback('s1', reason:'AR_NOT_SUPPORTED')
4. phase: fallback_complete
5. revealRelic → RELIC_REVEALED
```

### 5.3 Runtime 超时

```text
INIT 后 ready_timeout
  → XR_STATE=FAILED
  → XR_FAILED emitted
  → UI: showFallbackToast + 引导 FALLBACK 或返回
```

---

## 6. Execution Notes（执行说明）

### 6.1 实现约束

- 首页 **不得** 调用 `ensureXRRuntime()`；仅 `ar-entry-controller.trigger()`
- 新增 phase 须更新 `resolveActionUi` + 本文 §2.3
- 新增 XR_STATE 须更新 `runtime-builder` + 本文 §2.2

### 6.2 验证

```bash
node scripts/user_frontend/validate_build.js
node scripts/user_frontend/validate_xr_ui_decouple.js
```

### 6.3 关联文档

- `xr_architecture.md` — 模块分层
- `event_bus_contract.md` — 事件契约
- `failure_recovery_sop.md` — FAILED/error 运营处理

---

*状态机以源码为准；文档与代码冲突时以代码为准并开 issue 同步。*
