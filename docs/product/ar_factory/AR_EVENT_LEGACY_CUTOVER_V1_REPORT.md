# AR_EVENT_LEGACY_CUTOVER_V1_REPORT

## 1. 删除 / 修改清单

### 删除或禁用的 legacy 行为

- `apps/miniapp/components/ar-marker-entry/index.js`
  - removed legacy `this.triggerEvent('relic_spawn')`
  - removed legacy `this.triggerEvent('story_progress')`
  - removed legacy `this.triggerEvent('quest_update')`
  - removed legacy `this.triggerEvent('track')`
  - removed legacy `this.triggerEvent('load')`
  - removed legacy `this.triggerEvent('statechange')`

- `apps/miniapp/services/ar-marker-trigger-layer/index.js`
  - removed legacy triggerEvent forwarding
  - changed to bus-only execution path

### Added

- `apps/miniapp/services/ar-event-bus.js`
  - `on(event, callback)`
  - `off(event, callback)`
  - `emit(event, payload)`
  - production guard against legacy trigger mode

- `scripts/user_frontend/validate_event_single_pipe.js`
  - static verification for single event pipeline

## 2. 新事件流图

```text
xr-ar-tracker
  -> component tracker callbacks
  -> ar-marker-trigger-layer.handleAREvent()
  -> ar-event-bus.emit()
  -> page bus handler
  -> business logic
```

## 3. 是否存在 legacy hook

No legacy `triggerEvent` hook remains in the AR wiring files that participate in this pipeline.

## 4. 是否 single pipeline

Yes.

The current production path is:

- tracker
- event bus
- page handler
- business logic

No alternate legacy trigger channel is used in the AR wiring path.

## 5. 风险评估

- The pipeline is now statically single-path, but still depends on real device marker runtime behavior.
- Image marker detection and model stability must still be validated on device.
- The new bus guard is runtime-protective, but only activates if a legacy trigger flag is forced on.

## Final Result

- `SINGLE_EVENT_PIPELINE = YES`
- `LEGACY_TRIGGER_DISABLED = YES`
- `EVENT_BUS_ONLY_FLOW = YES`
- `XR_TRACKER_ISOLATED = YES`
- `PRODUCTION_RUNTIME_SAFE = YES`
- `AR_EVENT_SYSTEM_CLOSURE = PASS`
