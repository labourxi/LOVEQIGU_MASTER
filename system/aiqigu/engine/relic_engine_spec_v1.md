# AR游伴 · 信物引擎 V1 规范说明

> 版本：AIQIGU_RELIC_ENGINE_V1  
> 日期：2026-06-27  
> 状态：FROZEN

---

## 一、概述

信物引擎是将"场景节点（scene）"转化为"可交互信物系统"的核心编排层。

用户行为链路：

```
进入场景节点 → 触发信物生成 → LOCKED → ACTIVE → COLLECTED → 存档 → UI展示
```

---

## 二、系统架构

```
relic_engine_v1.js (Orchestrator)
  ├── relic_generator_v1.js      (scene_id → relic instance)
  ├── relic_state_machine_v1.js  (LOCKED → ACTIVE → COLLECTED)
  └── relic_store_v1.js          (持久化 / storage)
```

### 2.1 组件职责

| 组件 | 文件 | 职责 |
|------|------|------|
| 主编排器 | `relic_engine_v1.js` | 编排完整信物生命周期，对外提供统一 API |
| 信物生成器 | `relic_generator_v1.js` | 根据 `scene_id` 生成唯一信物实例；维护 scene → relic 映射 |
| 信物状态机 | `relic_state_machine_v1.js` | 管理三态迁移：LOCKED → ACTIVE → COLLECTED |
| 信物存档 | `relic_store_v1.js` | 用户收集记录持久化，进度统计 |

---

## 三、数据来源

引擎数据基于以下已审计的系统文件：

| 文件 | 内容 | 用途 |
|------|------|------|
| `/system/aiqigu/v1/relic_system_v1.json` | 7 枚信物定义 | 信物 ID、名称、品牌、前置条件 |
| `/system/aiqigu/scene_map_v1.json` | 7 个真实交互场景 | 场景 ID、空间结构、AR 候选点 |
| `/system/aiqigu/v1/relic_mapping_table_v1.md` | 信物映射表 | 辅助参考文档 |
| `/system/audit/aiqigu_reality_audit_v1.js` | 真实空间对齐审计 | 约束规则（无虚构、无神话） |

---

## 四、核心数据结构

### 4.1 信物实例（relic instance）

由 `relic_generator_v1.generateRelicByScene()` 生成：

```javascript
{
  relic_id: "relic_entrance_greeting",
  relic_name: "入口印记",
  source_node: "entrance_plaza",
  trigger_condition: "entry_trigger",
  visual_stage: 0,
  timestamp: 1719451200000,
  user_id: "user_001",
  state: "LOCKED",
  brand: "启程之印",
  interaction_type: "entry"
}
```

### 4.2 信物状态（state machine entry）

由 `relic_state_machine_v1` 管理：

```javascript
{
  state: "LOCKED",     // LOCKED | ACTIVE | COLLECTED
  timestamp: 1719451200000,
  node_id: "entrance_plaza",
  user_id: "user_001"
}
```

### 4.3 存档条目（store entry）

由 `relic_store_v1` 持久化：

```javascript
{
  relic_id: "relic_entrance_greeting",
  relic_name: "入口印记",
  source_node: "entrance_plaza",
  trigger_condition: "entry_trigger",
  brand: "启程之印",
  interaction_type: "entry",
  visual_stage: 4,
  timestamp: 1719451200000,
  user_id: "user_001",
  state: "COLLECTED"
}
```

---

## 五、状态机规则

### 5.1 状态定义

```
LOCKED    → 信物未激活，等待用户进入触发范围
ACTIVE    → 信物已触发，正在播放 AR 显现动画，可收集
COLLECTED → 信物已收集入档，不可再次激活
```

### 5.2 迁移规则

| 当前状态 | 可迁移至 | 触发条件 |
|----------|----------|----------|
| LOCKED | ACTIVE | 用户进入场景触发范围 + 前置条件满足 |
| ACTIVE | COLLECTED | 用户完成 AR 交互后确认收集 |
| COLLECTED | (无) | 终态，不可逆 |

### 5.3 唯一性约束

- 每个 scene.node_id 只能生成 **1 个主信物**
- 每个 relic_id 只能被收集 **1 次**（`max_collect_count: 1`）
- 不可跨节点共享信物

---

## 六、触发机制

信物绑定三种 trigger_type，映射自 `scene_map_v1.json` 的 7 个交互节点：

| trigger_type | 含义 | 适用场景 |
|-------------|------|----------|
| `entry_trigger` | 首次进入场景自动触发 | 入口广场（探索起点） |
| `proximity_trigger` | 靠近场景范围触发（GPS + 图像识别） | 古树区域、中心广场 |
| `interaction_trigger` | 用户主动交互后触发（扫描/点击/停留） | 老街、咖啡、书店、手作馆 |

---

## 七、引擎 API

### 7.1 `initEngine(userId)`

- 扫描所有合法场景，预初始化信物状态为 LOCKED
- 返回：`{ success, relic_count, scenes }`

### 7.2 `enterScene(sceneId, userId)`

- 用户进入场景 → 验证合法性 + 前置条件 + 唯一性 → 生成信物 → 状态 LOCKED→ACTIVE
- 返回：`{ success, scene, relic, trigger_type }`

### 7.3 `collectRelic(relicId)`

- 用户完成信物收集 → 状态 ACTIVE→COLLECTED → 持久化存档
- 返回：`{ success, relic_id, collected }`

### 7.4 `canEnterScene(sceneId)`

- 预先检查用户是否可以进入某个场景
- 返回：`{ can_enter, reason, missing_prerequisites }`

### 7.5 `getUserStatus()`

- 获取用户信物完整状态
- 返回：`{ states, collected, progress }`

### 7.6 `getEngineLog()`

- 获取引擎执行日志

---

## 八、约束清单

### 8.1 禁止项

| 禁止项 | 说明 |
|--------|------|
| 禁止随机生成无场景来源信物 | 所有信物必须通过 `generateRelicByScene(sceneId)` 生成 |
| 禁止神话命名 | relic_name 必须来源于真实场景特征（如"入口印记"而非"虚空之门"） |
| 禁止星象/神殿/抽象修辞 | 符合 Language Constitution L3 不混层要求 |
| 禁止跨节点共享信物 | 每个 scene_id 对应唯一 relic_id |
| 禁止逆向状态迁移 | COLLECTED 不可回退至 ACTIVE 或 LOCKED |
| 禁止重复收集 | 已收集的 relic_id 再次调用 `collectRelic` 将返回错误 |

### 8.2 强制项

| 强制项 | 说明 |
|--------|------|
| 每个 node 只能生成 1 个主信物 | scene_id → relic_id 映射为 1:1 |
| 所有信物必须有 source_node | 存档条目的 `source_node` 不可为空 |
| 所有信物必须绑定 trigger_type | entry / proximity / interaction 三选一 |
| 信物必须包含 5 个核心字段 | `relic_id`, `source_node`, `trigger_condition`, `visual_stage`, `timestamp` |
| `user_id` 字段必须预留 | 当前可为 null，后续接入用户系统 |

---

## 九、探索路径

引擎内置推荐探索路径（来自 `relic_system_v1.json` summary）：

```
Step 1  → 入口广场  → 入口印记  (entry_trigger)
Step 2  → 古树区域  → 林荫印记  (proximity_trigger)
Step 3  → 江南老街  → 老街印记  (interaction_trigger)
Step 4  → 爱企谷咖啡 → 咖啡印记  (interaction_trigger)
Step 5  → 爱企谷书店 → 书页印记  (interaction_trigger)
Step 6  → 爱企谷手作馆 → 手作印记  (interaction_trigger)
Step 7  → 中心广场  → 中心印记  (proximity_trigger, 需前6枚全部收集)
```

每一步必须按顺序完成前置收集，否则 `enterScene()` 返回 `prerequisites_not_met`。

---

## 十、与外部系统的关系

| 外部系统 | 关系 |
|----------|------|
| AR 引擎 (apps/miniapp) | 调用 `enterScene()` 获取信物实例；调用 `collectRelic()` 在 AR 交互完成后确认收集 |
| UI 展示层 | 调用 `getUserStatus()` 获取信物集合与进度 |
| 信物视觉系统 (`/system/visual/relic_visual_system_v1.js`) | `relic.visual_stage` 驱动 AR 视觉呈现阶段 |
| 世界状态机 (`/system/world_engine/state_machine.js`) | 引擎是 WORLD_ACTIVE 状态下的子系统，不自启 |

---

## 十一、版本记录

| 版本 | 日期 | 变更 |
|------|------|------|
| V1 | 2026-06-27 | 初始版本。基于 relic_system_v1.json (7枚信物) + scene_map_v1.json (7个场景) + aiqigu_reality_audit_v1.js (审计约束) 构建 |
