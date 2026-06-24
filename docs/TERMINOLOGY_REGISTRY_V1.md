# AR游伴 · 术语注册表 V1.1-ENG

**状态：** ENGINEERING_STANDARD  
**冲突裁决：** `AGENTS.md` > `docs/language/*` > 本表  

---

## 1. 项目与系统

| 中文 | 键 | 定义 |
|------|-----|------|
| AR游伴 | `ARYOUBAN` | 唯一产品/项目名 |
| 空间行为记录与运营系统 | `space-ops-system` | 品类定义，非「App」 |
| XR Runtime | `xr-runtime` | `runtime-builder` + `world-engine` + 管线 |
| 空间 | `space` | 有绑定的物理/Marker 场域 |
| 世界 | `world` | `world-engine` 内结构化星宿/经络/信物图 |

## 2. 资产

| 中文 | 键 | 存储 | 禁止 |
|------|-----|------|------|
| 信物 | `relic` | `userRelics` | 称数字藏品 |
| 数字藏品 | `digital_collectible` | 独立模块 | 称信物 |

## 3. 事件

| 中文 | 键 | 总线 |
|------|-----|------|
| 事件总线（XR） | `xr-event-bus` | `services/xr/xr-event-bus.js` |
| 事件总线（AR Marker） | `ar-event-bus` | `services/ar-event-bus.js` |

## 4. 页面与路由（L2）

| 中文 | 路由 |
|------|------|
| 探索地图 | `/pages/explore-map/index` |
| 权益中心 | `/pages/rights-center/index` |
| 信物档案 | `/pages/relic-archive/index` |

## 5. 探索点状态（Adapter）

`AVAILABLE` → `ARRIVED` → `CHECKED_IN` → `AR_SCANNED` → `RELIC_REVEALED` → `COUPON_UNLOCKED` → `COMPLETED`

## 6. 显现页相位（ar-entry）

`idle` | `scanning_ar` | `fallback_ready` | `ar_complete` | `fallback_complete` | `error`

## 7. XR Runtime 状态（runtime-builder）

`IDLE` | `INIT` | `READY` | `RUNNING` | `FAILED`
