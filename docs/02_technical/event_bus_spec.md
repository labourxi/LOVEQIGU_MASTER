# AR游伴 · Event Bus 规范（已迁移）

**文件 ID：** `02_technical/event_bus_spec.md`  
**版本：** V1.1-ENG  
**状态：** SUPERSEDED  

---

## 迁移说明

本文档已由工程标准版取代，请使用：

**→ [`event_bus_contract.md`](./event_bus_contract.md)**

该文件包含：

- 双总线定义（`xr-event-bus` · `ar-event-bus`）
- 事件注册表与 JSON payload schema
- 发布/订阅时序与错误隔离规则
- 与 `xr_state_machine.md` 的状态对齐

---

## 快速 API 引用

```javascript
bus.on(event, fn)   // 返回 off
bus.off(event, fn)
bus.emit(event, data)  // 监听器异常隔离
```

| 总线 | 路径 |
|------|------|
| xr-event-bus | `apps/miniapp/services/xr/xr-event-bus.js` |
| ar-event-bus | `apps/miniapp/services/ar-event-bus.js` |

---

*请勿在本文件追加新事件；所有变更写入 event_bus_contract.md*
