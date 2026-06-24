# AR游伴 · 信物数据模型

**文档 ID：** `05_crm/relic_data_model.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** `relic_id` 模板、`point_id`、用户显现完成状态、`user_id`  
**输出：** `userRelics[]` 实例、`userProgress.collectedRelicIds`、CRM 映射字段、图谱关联键  

**关联：** `02_technical/runtime_flow.md` · `02_technical/system_boundary.md` · `user_behavior_model.md` · `03_visual/relic_visual_spec.md`

---

## 1. Definition（定义）

### 1.1 信物（Relic）定义

信物 = **用户与空间发生关系后的故事进度资产**（`relic`），由探索点绑定模板，经显现流程实例化为 `UserRelic`。

```text
RelicTemplate (内容生产)
    → 显现触发 (adapter.revealRelic)
    → UserRelic (CRM 实例)
    → 回响 / 星图 / 经络 (展示层，Canon 驱动)
```

**不是：** 数字藏品、NFT、游戏道具、积分奖品。

### 1.2 在核心链路中的位置

```text
USER → XR → EVENT BUS → SPACE → RELIC → CRM
                              ↑       ↑
                         point_id  userRelics[]
```

- **SPACE：** `explorationPoints[].relicId` 绑定模板  
- **XR：** 提供显现前置（`AR_SCANNED`），不直接写 `userRelics`  
- **CRM：** `revealRelic` 唯一写入入口  

### 1.3 输入 / 输出

| 方向 | 结构 |
|------|------|
| **输入** | `pointId`, `userId`, `pointState.status ∈ {AR_SCANNED, AR_SCANNED_WITH_FALLBACK, RELIC_REVEALED}`, `detail.relic` |
| **输出** | `UserRelic` 行、`pointState.status=RELIC_REVEALED`、`userProgress.collectedRelicIds` 更新 |

---

## 2. System Design（结构设计）

### 2.1 实体关系（ER 文字版）

```text
Park 1──* Activity 1──* ExplorationPoint 1──1 RelicTemplate
                                              │
User 1──* UserPointState (per point)
User 1──* UserRelic *──1 RelicTemplate
UserRelic ──optional── CouponClaim (sourceRelicId)
```

### 2.2 双表分离（强制）

| 集合 | 路径 | 用途 |
|------|------|------|
| `relics` | `mock-source.relics` | 模板 / 内容生产 |
| `userRelics` | session `userRelics` | 用户拥有实例 |
| `digitalCollectibles` | 独立服务 | 营销传播 |

**禁止：** `relic_001` 同时作为藏品 ID 与信物进度 ID 混展示。

### 2.3 RelicTemplate 字段（内容层）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✓ | `relic_001` |
| `parkId` | string | ✓ | 景区 |
| `activityId` | string | ✓ | 活动 |
| `explorationPointId` | string | ✓ | 绑定探索点 |
| `name` | string | ✓ | L3 展示名 |
| `chapter` | string | | 章节 |
| `node` | string | | 图谱节点名 |
| `level` | string | | 进度层级标签 |
| `appearStatus` | enum | ✓ | 显现配置状态 |
| `copyStatus` | enum | | 文案状态 |
| `arStatus` | enum | | AR 绑定状态 |
| `artStatus` | enum | | 美术状态 |
| `reviewStatus` | enum | | 审查 |
| `publishStatus` | enum | | 发布 |
| `runtimeStatus` | enum | ✓ | `READY` 才可被 C 端读取 |

### 2.4 UserRelic 字段（CRM 实例层）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✓ | `ur_*` 实例 ID |
| `userId` | string | ✓ | 用户 |
| `relicId` | string | ✓ | 模板 ID |
| `parkId` | string | ✓ | 冗余，便于报表 |
| `activityId` | string | ✓ | 活动 |
| `explorationPointId` | string | ✓ | 来源探索点 |
| `status` | enum | ✓ | `COLLECTED`（写入时） |
| `revealedAt` | ISO8601 | ✓ | 显现时间 |
| `source` | string | ✓ | `exploration_mock` / 未来 API |
| `chapter` | string | | 自模板复制 |
| `node` | string | | 自模板复制 |

### 2.5 CRM 映射字段（报表 / B 端）

| CRM 字段 | 来源 | 用途 |
|----------|------|------|
| `userProgress.collectedRelicIds[]` | `syncUserProgress` | 活动完成度 |
| `userPointStates.relicRevealedAt` | `revealRelic` | 点时间线 |
| `couponClaims.sourceRelicId` | `unlockCoupon` | 礼遇归因 |
| `journey.latestRelic` | `getHomeData` 聚合 | 首页回响 |
| `reviewRecords` (targetType=relic) | 内容生产 | 发布门禁 |

### 2.6 图谱关联（展示，非 CRM 主键）

| 展示系统 | 关联键 | 说明 |
|----------|--------|------|
| 星图 `star-map` | `relic.node` + Canon 别名 | 不臆造新别名 |
| 经络 `meridian-map` | 章节进度 | 只读 userRelics |
| 信物册 `relic-archive` | `userId` + `activityId` | `getRelicArchive` |

**GAP：** 图谱自动点亮若与 `world-engine` 事件不一致，以 `userRelics` 为准。

---

## 3. Flow（流程）

### 3.1 信物 Lifecycle（端到端）

```text
[1] CONTENT_DRAFT
      relics[].reviewStatus=DRAFT
[2] CONTENT_APPROVED
      reviewStatus=APPROVED, runtimeStatus=READY
[3] POINT_BOUND
      explorationPoints[].relicId 指向模板
[4] USER_EXPLORE
      userPointStates: AVAILABLE → ... → AR_SCANNED
[5] TRIGGER_READY
      isPointARScanned(pointState) === true
[6] REVEAL
      revealRelic → userRelics.push, status=COLLECTED
[7] POINT_RELIC_REVEALED
      userPointStates.status=RELIC_REVEALED
[8] BENEFIT_LINK (可选)
      unlockCoupon.sourceRelicId=relicId
[9] ARCHIVE_VISIBLE
      getRelicArchive 可读
[10] COMPLETED
      userPointStates.status=COMPLETED
```

### 3.2 Trigger 机制（显现触发）

#### 前置条件（AND）

| # | 条件 | 检查位置 |
|---|------|----------|
| C1 | `getExplorationPointDetail.relic` 存在 | adapter |
| C2 | `isPointARScanned(pointState)` 或已是 `RELIC_REVEALED` | adapter |
| C3 | 用户未持有同 `relicId` 的 `COLLECTED/REVEALED` 实例 | adapter |
| C4 | 模板 `runtimeStatus=READY`（经发布链） | mock-source |

#### 触发调用

```text
pages/lottie/index.js
  → user-runtime-adapter.revealRelic(pointId)
  → user-app-adapter.revealRelic(pointId, userId)
```

#### 禁止触发

- `completeARScan` 内部自动 reveal（当前 **未实现**，保持禁止）  
- `world-engine` `RELIC_CREATED` 回调写 CRM  
- 未 `CHECKED_IN` 直接 reveal  

### 3.3 幂等与重复显现

```text
revealRelic 第二次调用（同 relicId）
  → ok: true
  → message: "信物已显现，无需重复操作。"
  → 不新增 userRelics 行
```

### 3.4 与 XR / Event Bus 关系

| 事件 | 域 | 写 userRelics？ |
|------|-----|----------------|
| `XR_USER_TRIGGER` | XR | 否 |
| `completeARScan` | CRM | 否（仅 AR_SCANNED） |
| `RELIC_CREATED` | world-engine | 否 |
| `revealRelic` | CRM | **是** |

---

## 4. Data Model（数据模型）

### 4.1 RelicTemplate JSON Schema

```json
{
  "$schema": "aryouban.relic.template.v1",
  "type": "object",
  "required": ["id", "parkId", "activityId", "explorationPointId", "name", "runtimeStatus"],
  "properties": {
    "id": { "type": "string", "pattern": "^relic_" },
    "parkId": { "type": "string" },
    "activityId": { "type": "string" },
    "explorationPointId": { "type": "string", "pattern": "^ep_" },
    "name": { "type": "string" },
    "chapter": { "type": "string" },
    "node": { "type": "string" },
    "level": { "type": "string" },
    "appearStatus": {
      "enum": ["PENDING_GENERATION", "CONFIGURED", "FINALIZED"]
    },
    "copyStatus": { "enum": ["DRAFT", "FINALIZED"] },
    "arStatus": { "enum": ["PENDING_BINDING", "BOUND"] },
    "artStatus": { "enum": ["PENDING", "BOUND"] },
    "reviewStatus": { "enum": ["DRAFT", "PENDING_REVIEW", "APPROVED"] },
    "publishStatus": { "enum": ["DRAFT", "READY_TO_PUBLISH", "PUBLISHED"] },
    "runtimeStatus": { "enum": ["NOT_READY", "READY", "PUBLISHED"] }
  }
}
```

### 4.2 UserRelic JSON Schema

```json
{
  "$schema": "aryouban.relic.user_instance.v1",
  "type": "object",
  "required": [
    "id", "userId", "relicId", "parkId", "activityId",
    "explorationPointId", "status", "revealedAt", "source"
  ],
  "properties": {
    "id": { "type": "string", "pattern": "^ur_" },
    "userId": { "type": "string" },
    "relicId": { "type": "string" },
    "parkId": { "type": "string" },
    "activityId": { "type": "string" },
    "explorationPointId": { "type": "string" },
    "status": { "enum": ["COLLECTED", "REVEALED"] },
    "revealedAt": { "type": "string", "format": "date-time" },
    "source": { "enum": ["exploration_mock", "api"] },
    "chapter": { "type": "string" },
    "node": { "type": "string" }
  }
}
```

### 4.3 revealRelic 响应 schema

```json
{
  "$schema": "aryouban.adapter.reveal_relic.response.v1",
  "type": "object",
  "required": ["ok", "status", "message"],
  "properties": {
    "ok": { "type": "boolean" },
    "status": { "enum": ["REVEALED", "COLLECTED", "HIDDEN"] },
    "statusLabel": { "type": "string" },
    "message": { "type": "string" },
    "userRelic": { "$ref": "aryouban.relic.user_instance.v1" },
    "relic": { "$ref": "aryouban.relic.template.v1" },
    "pointState": { "$ref": "aryouban.point_state.v1" }
  }
}
```

### 4.4 Mock 种子示例（relic_001）

```json
{
  "id": "relic_001",
  "parkId": "park_001",
  "activityId": "activity_001",
  "explorationPointId": "ep_001",
  "name": "初见印记",
  "chapter": "第一章",
  "node": "初遇",
  "level": "初遇",
  "appearStatus": "CONFIGURED",
  "copyStatus": "FINALIZED",
  "arStatus": "BOUND",
  "artStatus": "BOUND",
  "reviewStatus": "PENDING_REVIEW",
  "publishStatus": "READY_TO_PUBLISH",
  "runtimeStatus": "READY"
}
```

### 4.5 写入后 UserRelic 示例

```json
{
  "id": "ur_1700000000001",
  "userId": "user_001",
  "relicId": "relic_001",
  "parkId": "park_001",
  "activityId": "activity_001",
  "explorationPointId": "ep_001",
  "status": "COLLECTED",
  "revealedAt": "2026-06-23T10:10:00+08:00",
  "source": "exploration_mock",
  "chapter": "第一章",
  "node": "初遇"
}
```

### 4.6 CRM 聚合：userProgress 片段

```json
{
  "userId": "user_001",
  "activityId": "activity_001",
  "visitedPointIds": ["ep_001"],
  "completedPointIds": [],
  "collectedRelicIds": ["relic_001"],
  "claimedCouponIds": ["claim_xxx"],
  "progressPercent": 33
}
```

### 4.7 couponClaim 归因字段

```json
{
  "id": "claim_xxx",
  "couponId": "coupon_001",
  "userId": "user_001",
  "sourcePointId": "ep_001",
  "sourceRelicId": "relic_001",
  "claimStatus": "UNUSED"
}
```

---

## 5. Example（示例）

### 5.1 完整显现脚本

```javascript
const a = global.LQGUserAppAdapter; // 已 boot，见 product_overview §5.1
const pid = 'ep_001', uid = 'user_001';

a.mockCheckIn(pid, uid);
const start = a.startARScan(pid, uid);
const done = start.bridgeMode === 'FALLBACK'
  ? a.completeARFallback(start.scanSessionId, uid)
  : a.completeARScan(start.scanSessionId, uid);
console.assert(done.ok && done.nextAction === 'REVEAL_RELIC');

const r = a.revealRelic(pid, uid);
console.assert(r.ok && r.userRelic.relicId === 'relic_001');
console.assert(r.pointState.status === 'RELIC_REVEALED');

const archive = a.getRelicArchive(uid, 'activity_001');
console.assert(archive.relics.length >= 1);
```

### 5.2 失败：跳过显现

```javascript
a.mockCheckIn('ep_001', 'user_001');
const r = a.revealRelic('ep_001', 'user_001');
// r.ok === false
// r.message === '请先完成 AR 显现'
// r.userRelic === null
```

### 5.3 幂等：二次显现

```javascript
// 继 5.1 之后
const r2 = a.revealRelic('ep_001', 'user_001');
// r2.ok === true
// r2.message === '信物已显现，无需重复操作。'
```

### 5.4 与权益链

```javascript
const c = a.unlockCoupon('ep_001', 'user_001');
// c.couponClaim.sourceRelicId === 'relic_001'
// c.couponClaim.sourcePointId === 'ep_001'
```

---

## 6. Execution Notes（执行说明）

### 6.1 实现路径

| 层 | 文件 |
|----|------|
| 模板种子 | `apps/shared/data-adapter/mock-source.js` → `relics` |
| 写入 | `apps/shared/data-adapter/user-app-adapter.js` → `revealRelic` |
| 小程序桥 | `apps/miniapp/services/user-runtime-adapter/index.js` |
| 信物册页 | `pages/relic-archive/index.js` |
| 仪式页 | `pages/lottie/index.js` |

### 6.2 内容发布门禁

信物 C 端可读条件：

```text
relics[].runtimeStatus === 'READY'
AND explorationPoints[].runtimeStatus === 'READY'
AND activity.publishStatus === 'PUBLISHED'
```

### 6.3 验证

```bash
node scripts/user_frontend/validate_build.js
# 人工：lottie → relic-archive 可见「初见印记」
```

### 6.4 变更同步

| 变更 | 文档 |
|------|------|
| 新增 UserRelic 字段 | 本文件 §4.2 + adapter + `user_behavior_model` |
| 新增模板状态 | 本文件 §4.1 + `mock-source` |
| 触发条件变更 | 本文件 §3.2 + `runtime_flow` |

### 6.5 Canon 规则

- 信物名称、节点别名以 Canon / 内容生产为准  
- 产品文档 **不** 发明新 relic 叙事  
- 缺口：内容审查单，不代码硬编码  

### 6.6 与 XR 关系（摘要）

XR 负责显现 **能力** 与仪式 **事件**；CRM 负责信物 **所有权记录**。  
`RELIC_CREATED` 可用于渲染，**不能** 替代 `userRelics` 记录。

---

*信物数据模型 V1.1-ENG · Batch 1*
