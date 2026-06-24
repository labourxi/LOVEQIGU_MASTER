# AR游伴 · Event Bus 契约

**文档 ID：** `02_technical/event_bus_contract.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** 模块 `emit(event, payload)`  
**输出：** 订阅方副作用；异常不向上抛出  

**替代说明：** 本文件为 `event_bus_spec.md` 的工程级上位契约。

---

## 1. Definition（定义）

### 1.1 双总线职责

| 总线 ID | 模块路径 | 域 |
|---------|----------|-----|
| `xr-event-bus` | `apps/miniapp/services/xr/xr-event-bus.js` | XR Runtime · World · 仪式 |
| `ar-event-bus` | `apps/miniapp/services/ar-event-bus.js` | Marker 跟踪生命周期 |

### 1.2 API 契约

```typescript
// 伪代码契约
on(event: string, fn: (data: object) => void): () => void  // 返回 off
off(event: string, fn?: Function): void
emit(event: string, data?: object): void  // 监听器异常隔离
```

**保证：** `emit` 时单个 listener 抛错不影响其他 listener（见源码 try/catch）。

---

## 2. System Design（结构设计）

### 2.1 xr-event-bus 事件注册表

| event | 发布模块 | 订阅模块（典型） | 稳定性 |
|-------|----------|------------------|--------|
| `XR_USER_TRIGGER` | ar-entry-controller | runtime-builder, world-engine | STABLE |
| `XR_START_PIPELINE` | runtime-builder | 内部 | STABLE |
| `XR_STATE_CHANGE` | runtime-builder | 调试/未来 UI | STABLE |
| `XR_FAILED` | runtime-builder | UI fallback | STABLE |
| `XR_RENDER_WORLD_SPACE` | runtime-builder / world-engine | world-renderer | STABLE |
| `RELIC_CREATED` | world-engine | world-renderer | STABLE |
| `STAR_LIGHTED` | world-engine | world-renderer | STABLE |
| `XR_RELIC_SPAWN` | ar-relic-presence-layer | world-renderer | STABLE |
| `AR_RITUAL_START` | ar-ritual-controller | 仪式层 | STABLE |

### 2.2 ar-event-bus 事件注册表

| event | 发布方 | 订阅方 |
|-------|--------|--------|
| `ar:detected` | marker 组件链 | ar-entry 页 |
| `ar:active` | marker 组件链 | ar-entry 页 |
| `ar:lost` | marker 组件链 | ar-entry 页 |
| `ar:statechange` | marker 组件链 | ar-entry 页 |

### 2.3 禁止模式

- 页面 A 直接 `require` 页面 B 并调用其方法（须 bus 或 adapter）
- 在 `xr-scene` WXML 内 `bindtap`
- 未登记事件名投入生产

---

## 3. Flow（流程）

### 3.1 XR 启动链路（事件序列）

```text
T0  UI: ar-entry-controller.trigger({ source })
T1  BUS: emit XR_USER_TRIGGER
T2  runtime-builder: handleXRStartPipeline (若已 bind)
T3  BUS: emit XR_START_PIPELINE (内部)
T4  world-engine: handleXrUserTrigger
T5  BUS: XR_STATE_CHANGE (INIT→READY→RUNNING)
T6  UI: pilot-fx / safeNavigate (与 bus 并行，不阻塞)
```

### 3.2 Marker 检测链路

```text
xr-frame marker state
  → ar-marker-entry
  → ar-event-bus.emit('ar:detected' | 'ar:active' | 'ar:lost')
  → ar-entry handlers (日志/业务钩子)
```

---

## 4. Data Model（数据模型）

### 4.1 XR_USER_TRIGGER

```json
{
  "$schema": "aryouban.event.xr_user_trigger.v1",
  "required": ["source"],
  "properties": {
    "source": {
      "type": "string",
      "enum": [
        "entry_button",
        "index_enter_scenic",
        "pipeline"
      ]
    },
    "readiness": { "type": "object" }
  }
}
```

### 4.2 XR_FAILED

```json
{
  "$schema": "aryouban.event.xr_failed.v1",
  "required": ["state", "reason"],
  "properties": {
    "state": { "const": "FAILED" },
    "reason": { "type": "string" },
    "detail": { "type": "object" },
    "error": { "type": ["string", "null"] }
  }
}
```

### 4.3 ar:detected（示例）

```json
{
  "markerId": "string",
  "timestamp": "ISO8601",
  "source": "ar-marker-entry"
}
```

### 4.4 版本策略

- 新增字段：**向后兼容**，仅追加 optional 字段
- 重命名事件：**禁止**；须新事件名 + 弃用期
- 破坏性变更： bump `aryouban.event.*.v2`

---

## 5. Example（示例）

### 5.1 发布（UI 层）

```javascript
const entry = require('../../services/ar/ar-entry-controller.js');
entry.trigger({ source: 'index_enter_scenic' });
```

### 5.2 订阅与卸载（页面）

```javascript
const bus = require('../../services/xr/xr-event-bus.js');

Page({
  onLoad() {
    this._offFailed = bus.on('XR_FAILED', (payload) => {
      this.showFallbackToast('功能开发中');
      console.error('[XR_FAILED]', payload.reason);
    });
  },
  onUnload() {
    if (this._offFailed) this._offFailed();
  }
});
```

### 5.3 ar-event-bus（ar-entry）

```javascript
const arEventBus = require('../../services/ar-event-bus.js');
arEventBus.on('ar:detected', (payload) => {
  this.onRelicSpawn({ detail: payload, source: 'ar-event-bus' });
});
```

---

## 6. Execution Notes（执行说明）

### 6.1 新增事件 PR Checklist

- [ ] 登记本文 §2.1 或 §2.2
- [ ] 提供 JSON schema 片段
- [ ] 订阅方 onUnload off
- [ ] `validate_build` PASS

### 6.2 调试

微信开发者工具 Console 过滤：`[XR_EVENT_BUS]` · `XR_USER_TRIGGER` · `XR_FAILED`

### 6.3 关联

- `xr_state_machine.md`
- `xr_architecture.md`
- `event_bus_spec.md`（历史别名，指向本文件）

---

*契约版本 V1.1-ENG · 工程标准文档*
