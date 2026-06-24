# AR游伴 · 用户行为模型

**文档 ID：** `05_crm/user_behavior_model.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** UI 交互、adapter 方法调用、Event Bus 事件、会话时间戳  
**输出：** `userPointStates` 迁移日志、行为事件 catalog、试点 KPI 计算字段  

**关联：** `runtime_flow.md` · `relic_data_model.md` · `06_deployment/pilot_deployment_sop.md` · `event_bus_contract.md`

---

## 1. Definition（定义）

### 1.1 用户行为定义

用户行为 = 在空间系统中 **可被记录、可聚合、可复盘** 的动作与状态迁移，服务于 CRM 与试点 KPI，**不** 用于游戏数值（等级/战力/抽卡）。

```text
行为 = 事件（瞬时） + 状态（持久） + 归因键（park/point/activity/user）
```

### 1.2 在核心链路中的位置

```text
USER → XR → EVENT BUS → SPACE → RELIC → CRM
  │      │        │         │        │      │
  └─行为事件─┴─XR事件──┴─空间状态──┴─信物───┴─持久化
```

### 1.3 输入 / 输出

| 方向 | 内容 |
|------|------|
| **输入** | 页面生命周期、adapter 调用、bus emit、错误兜底 |
| **输出** | 状态表迁移、事件 catalog、KPI 分子分母、未来 `behavior_log[]` |

### 1.4 状态 vs 事件

| 类型 | 存储 | 示例 |
|------|------|------|
| **状态** | `userPointStates[].status` | `CHECKED_IN` |
| **事件** | 瞬时 / 未来日志表 | `enter_scenic` |
| **会话** | `arScanSessions` | `SCANNING` → `SUCCESS` |

**MVP：** 状态以 adapter session 为准；离散事件由 adapter 方法 **隐式** 代表（见 §2.2）。

---

## 2. System Design（结构设计）

### 2.1 行为分类树

```text
Behavior
├── Navigation（导航）
│   ├── enter_scenic
│   ├── open_explore_map
│   ├── open_point_detail
│   └── tab_switch
├── Exploration（探索）
│   ├── mock_check_in
│   └── point_status_change
├── Manifestation（显现）
│   ├── start_ar_scan
│   ├── complete_ar_scan
│   ├── complete_ar_fallback
│   └── xr_user_trigger (bus)
├── Relic（信物）
│   └── reveal_relic
├── Benefit（权益）
│   ├── unlock_coupon
│   └── redeem_coupon (B端)
└── System（系统）
    ├── safe_navigate_fail
    ├── xr_failed
    └── app_error
```

### 2.2 事件 Catalog（MVP · adapter 映射）

| event_id | 触发点 | adapter / 代码 | 状态副作用 |
|----------|--------|----------------|------------|
| `enter_scenic` | 首页进入景区 | `index.onEnterScenic` | — |
| `xr_user_trigger` | 景区门 / 显现 | `ar-entry-controller.trigger` | XR_STATE 迁移 |
| `open_explore_map` | 导航 | `wx.navigateTo` explore-map | — |
| `view_point_detail` | 打开详情 | `getExplorationPointDetail` | — |
| `mock_check_in` | 打卡 | `mockCheckIn` | → `CHECKED_IN` |
| `start_ar_scan` | 开始显现 | `startARScan` | session `SCANNING` |
| `complete_ar_scan` | AR 完成 | `completeARScan` | → `AR_SCANNED` |
| `complete_ar_fallback` | 备用完成 | `completeARFallback` | → `AR_SCANNED_WITH_FALLBACK` |
| `reveal_relic` | 信物显现 | `revealRelic` | → `RELIC_REVEALED` |
| `unlock_coupon` | 领取礼遇 | `unlockCoupon` | → `COMPLETED` |
| `redeem_coupon` | 商家核销 | `merchant-admin-adapter.redeem` | claim `USED` |

### 2.3 Event Bus 行为事件（只记不发 CRM 写）

| bus_event | 域 | 计入 KPI | 写 CRM |
|-----------|-----|----------|--------|
| `XR_USER_TRIGGER` | XR | 可选（显现尝试） | 否 |
| `XR_STATE_CHANGE` | XR | 调试 | 否 |
| `XR_FAILED` | XR | `fallback_ratio` 相关 | 否 |
| `ar:detected` | Marker | 显现质量 | 否 |
| `ar:lost` | Marker | 显现质量 | 否 |
| `RELIC_CREATED` | world | 否（仪式） | 否 |

### 2.4 归因维度（所有行为必带）

| 键 | 来源 | 说明 |
|----|------|------|
| `user_id` | session | 默认 `user_001` mock |
| `park_id` | point / user | 景区 |
| `activity_id` | point | 活动容器 |
| `point_id` | 探索点 | 可为空（导航级） |
| `relic_id` | reveal 后 | 信物归因 |
| `scan_session_id` | AR | 显现会话 |
| `bridge_mode` | startARScan | `AR` / `FALLBACK` |
| `timestamp` | ISO8601 | 客户端/adapter `nowIso()` |

### 2.5 试点 5 KPI ↔ 行为映射

| KPI | 分子事件 | 分母事件 |
|-----|----------|----------|
| K1 `explore_completion_rate` | `reveal_relic` ok | `enter_scenic` |
| K2 `relic_acquisition_rate` | `reveal_relic` ok | `start_ar_scan` ok |
| K3 `benefit_claim_rate` | `unlock_coupon` ok | `reveal_relic` ok |
| K4 `manifest_success_rate` | `complete_ar_scan` | `complete_ar_scan` + `complete_ar_fallback` |
| K5 `d7_return_rate` | 会话 reopen | 首次 `enter_scenic` |

---

## 3. Flow（流程）

### 3.1 行为采集流（MVP）

```text
Step 1  用户 UI 操作
Step 2  页面调用 user-runtime-adapter
Step 3  user-app-adapter 执行业务
Step 4  更新 userPointStates / userRelics / arScanSessions
Step 5  persistSession()
Step 6  （未来）append behavior_log
Step 7  B 端 adapter 聚合报表
```

### 3.2 单点探索行为序列（标准）

```text
T+0   enter_scenic          (index)
T+1   open_explore_map      (explore-map)
T+2   view_point_detail     (detail, point_id=ep_001)
T+3   mock_check_in         → CHECKED_IN
T+4   start_ar_scan         → SCANNING, bridge_mode
T+5   complete_ar_*         → AR_SCANNED | AR_SCANNED_WITH_FALLBACK
T+6   reveal_relic          → RELIC_REVEALED, userRelics+
T+7   unlock_coupon         → COMPLETED, couponClaims+
T+8   pilot_complete_toast  (event-complete)
```

### 3.3 行为序列（含 XR 并行）

```text
时间轴 │
UI     │ enter_scenic ─────────────────── mock_check_in ─ start_ar ─ reveal
Bus    │     XR_USER_TRIGGER ─ XR_STATE_CHANGE* ──────────────── RELIC_CREATED*
CRM    │ ─────────────────────────── CHECKED_IN ─ AR_SCANNED ─ RELIC_REVEALED
       │
       * 不与 CRM 写入强一致；以 adapter 状态为准
```

### 3.4 失败行为流

```text
start_ar_scan (fail)
  → event: start_ar_scan_failed
  → 用户可选 complete_ar_fallback

reveal_relic (fail, 未 AR)
  → event: reveal_relic_blocked
  → pointState 不变

XR_FAILED
  → event: xr_failed
  → UI toast + FALLBACK 引导
```

### 3.5 B 端可见行为（间接）

| B 端 | 读到的用户行为 |
|------|----------------|
| park-admin | 活动完成率、点位状态分布 |
| merchant-portal | 领取/核销 |
| platform-admin | 发布与审查日志 |

**GAP：** 实时行为看板待后端；MVP 用 adapter session 导出 JSON。

---

## 4. Data Model（数据模型）

### 4.1 behavior_log 行 schema（未来 · 现可 Mock）

```json
{
  "$schema": "aryouban.behavior.log.v1",
  "type": "object",
  "required": ["id", "eventId", "userId", "timestamp"],
  "properties": {
    "id": { "type": "string" },
    "eventId": { "type": "string" },
    "userId": { "type": "string" },
    "parkId": { "type": "string" },
    "activityId": { "type": "string" },
    "pointId": { "type": "string" },
    "relicId": { "type": "string" },
    "scanSessionId": { "type": "string" },
    "bridgeMode": { "enum": ["AR", "FALLBACK", ""] },
    "statusBefore": { "type": "string" },
    "statusAfter": { "type": "string" },
    "ok": { "type": "boolean" },
    "message": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" },
    "source": { "enum": ["miniapp", "adapter", "bus"] }
  }
}
```

### 4.2 状态迁移记录 schema

```json
{
  "eventId": "mock_check_in",
  "userId": "user_001",
  "pointId": "ep_001",
  "statusBefore": "AVAILABLE",
  "statusAfter": "CHECKED_IN",
  "timestamp": "2026-06-23T10:05:00+08:00"
}
```

### 4.3 日聚合 snapshot（试点日报）

```json
{
  "$schema": "aryouban.behavior.daily_snapshot.v1",
  "date": "2026-06-23",
  "parkId": "park_001",
  "metrics": {
    "enter_scenic": 120,
    "mock_check_in": 95,
    "start_ar_scan": 88,
    "complete_ar_scan": 40,
    "complete_ar_fallback": 45,
    "reveal_relic": 82,
    "unlock_coupon": 70,
    "xr_failed": 3
  },
  "derived": {
    "explore_completion_rate": 0.683,
    "relic_acquisition_rate": 0.932,
    "benefit_claim_rate": 0.854,
    "manifest_success_rate": 0.471,
    "fallback_ratio": 0.529
  }
}
```

### 4.4 userPointState 作为行为终态快照

```json
{
  "userId": "user_001",
  "pointId": "ep_001",
  "status": "COMPLETED",
  "arrivedAt": "2026-06-23T10:04:00+08:00",
  "checkedInAt": "2026-06-23T10:05:00+08:00",
  "arScannedAt": "2026-06-23T10:08:00+08:00",
  "relicRevealedAt": "2026-06-23T10:10:00+08:00",
  "couponUnlockedAt": "2026-06-23T10:12:00+08:00"
}
```

### 4.5 arScanSession 行为片段

```json
{
  "id": "scan_xxx",
  "userId": "user_001",
  "pointId": "ep_001",
  "status": "SUCCESS",
  "bridgeMode": "FALLBACK",
  "startedAt": "2026-06-23T10:06:00+08:00",
  "completedAt": "2026-06-23T10:08:00+08:00"
}
```

### 4.6 事件 ID 枚举（稳定）

```json
{
  "navigation": ["enter_scenic", "open_explore_map", "view_point_detail", "tab_switch"],
  "exploration": ["mock_check_in", "point_status_change"],
  "manifestation": ["start_ar_scan", "complete_ar_scan", "complete_ar_fallback", "xr_user_trigger", "xr_failed"],
  "relic": ["reveal_relic", "reveal_relic_blocked"],
  "benefit": ["unlock_coupon", "redeem_coupon"],
  "system": ["safe_navigate_fail", "app_error"]
}
```

---

## 5. Example（示例）

### 5.1 推导 KPI（从 session 计数）

```javascript
// 假设已从 adapter-session 导出 sess
function computePilotKpis(sess, enterScenicCount) {
  const uid = 'user_001';
  const starts = sess.arScanSessions.filter(s => s.userId === uid).length;
  const arOk = sess.arScanSessions.filter(s =>
    s.userId === uid && (s.status === 'SUCCESS' || s.status === 'COMPLETED')
  ).length;
  const fbOk = sess.arScanSessions.filter(s =>
    s.userId === uid && s.status === 'FALLBACK_COMPLETED'
  ).length;
  const relics = sess.userRelics.filter(r => r.userId === uid).length;
  const claims = sess.couponClaims.filter(c => c.userId === uid).length;

  return {
    explore_completion_rate: relics / Math.max(enterScenicCount, 1),
    relic_acquisition_rate: relics / Math.max(starts, 1),
    benefit_claim_rate: claims / Math.max(relics, 1),
    manifest_success_rate: arOk / Math.max(arOk + fbOk, 1),
    fallback_ratio: fbOk / Math.max(arOk + fbOk, 1)
  };
}
```

### 5.2 标准用户时间线（文档样例）

```text
user_001 @ ep_001 @ 2026-06-23

10:00:00  enter_scenic           park_001
10:00:45  open_explore_map
10:02:10  view_point_detail      point_id=ep_001
10:05:00  mock_check_in          AVAILABLE → CHECKED_IN
10:06:12  start_ar_scan          bridge_mode=FALLBACK
10:08:30  complete_ar_fallback   → AR_SCANNED_WITH_FALLBACK
10:10:05  reveal_relic           relic_id=relic_001 → RELIC_REVEALED
10:12:20  unlock_coupon          claim_id=claim_xxx → COMPLETED
```

### 5.3 从 adapter 回放时间戳

```javascript
const a = global.LQGUserAppAdapter;
const ps = a.getExplorationPointDetail('ep_001', 'user_001').pointState;
// 完成后：
// ps.checkedInAt, ps.arScannedAt, ps.relicRevealedAt, ps.couponUnlockedAt
// 即为行为时间线锚点
```

### 5.4 XR_FAILED 行为记录（概念）

```json
{
  "eventId": "xr_failed",
  "userId": "user_001",
  "pointId": "ep_001",
  "payload": { "state": "FAILED", "reason": "ready_timeout" },
  "timestamp": "2026-06-23T10:07:00+08:00",
  "source": "bus"
}
```

---

## 6. Execution Notes（执行说明）

### 6.1 代码锚点（采集实现）

| 行为 | 文件 |
|------|------|
| enter_scenic | `pages/index/index.js` |
| mock_check_in | `user-app-adapter.mockCheckIn` |
| start/complete AR | `user-app-adapter` + `ar-runtime-bridge` |
| reveal_relic | `user-app-adapter.revealRelic` |
| unlock_coupon | `user-app-adapter.unlockCoupon` |
| xr_user_trigger | `services/ar/ar-entry-controller.js` |
| 兜底 | `utils/safe-interaction.js`, `app.js` |

### 6.2 验证

```bash
node scripts/user_frontend/validate_build.js
node scripts/user_frontend/validate_pilot_scene_product.js
```

人工：跑通 §5.2 时间线，检查 `pointState` 时间戳字段均非空。

### 6.3 试点日报填写

使用 `pilot_deployment_sop.md` §4.2 日报快照 + 本文件 §4.3 派生字段。

### 6.4 扩展协议（接后端时）

1. 在 adapter `persistSession` 后异步 POST `behavior_log`  
2. `eventId` 必须使用 §4.6 枚举，新增需 PR 更本文档  
3. 状态真相源仍为 `userPointStates`；日志可对账  

### 6.5 禁止

- 用行为事件驱动游戏数值  
- 未登记 `eventId` 上生产报表  
- 以 `RELIC_CREATED` 代替 `reveal_relic` 计数  

### 6.6 与 XR 关系

| 问题 | 答案 |
|------|------|
| XR 事件是否写入 CRM？ | 默认否 |
| KPI 以谁为准？ | adapter 状态与 session 计数 |
| FALLBACK 算不算完成？ | 算，`complete_ar_fallback` 计入 K1/K2 |

---

*用户行为模型 V1.1-ENG · Batch 1*
