# AR游伴 · 产品总览

**文档 ID：** `01_product/product_overview.md`  
**版本：** V1.1-ENG  
**状态：** ENGINEERING_STANDARD  
**输入：** 景区签约范围、`park_id`/`activity_id`、探索点清单、Canon 冻结内容  
**输出：** 产品边界定义、主链路规格、角色矩阵、与 XR/CRM 对齐口径  

**上游引用：** `docs/ar-product-definition-v1.md` · `docs/product/ar_factory/AR_YOUBAN_SYSTEM_FREEZE_MASTER_V1.md` · `AGENTS.md`  
**关联：** `02_technical/runtime_flow.md` · `02_technical/system_boundary.md` · `05_crm/relic_data_model.md`

---

## 1. Definition（定义）

### 1.1 系统定义

AR游伴 是 **空间事件驱动系统**：用户在真实空间（`space`）中触发探索事件，经 **XR Runtime** 完成显现，通过 **Event Bus** 协调内核与 UI，获得 **信物（relic）** 并写入 **CRM 行为数据**。

```text
USER → XR → EVENT BUS → SPACE → RELIC → CRM
```

### 1.2 产品类型

| 字段 | 值 |
|------|-----|
| 产品名 | AR游伴（唯一，英文键 `ARYOUBAN`） |
| 品类 | 空间行为记录与运营系统 |
| 载体 | 微信小程序（C 端）+ HTML 运营后台（B 端） |
| 非目标 | 游戏 · AR 特效 Demo · 积分商城 · 抽卡 · C 端虚拟道具付费 |

### 1.3 输入 / 输出

| 方向 | 结构 |
|------|------|
| **输入** | `park_id`, `activity_id`, `point_id[]`, 发布状态, 用户 `user_id` |
| **输出** | 可探索小程序链路、`userPointStates[]`, `userRelics[]`, `couponClaims[]`, 试点 KPI 原始字段 |

### 1.4 核心名词（L2 产品层）

| 名词 | 英文键 | 数据锚点 | 禁止混用 |
|------|--------|----------|----------|
| 空间 | `space` | `explorationPoints[]` | 与 `world` 混称场域内核 |
| 探索点 | `exploration_point` | `point_id` / `ep_*` | 打卡地图 |
| 信物 | `relic` | `userRelics[]` | 数字藏品、NFT、道具 |
| 显现 | `revelation` | `ar-entry` · `startARScan` | 纯特效播放 |
| 探索地图 | `explore-map` | `pages/explore-map` | 打卡地图 |
| 权益中心 | `rights-center` | `unlockCoupon` | 积分商城 |
| 回响 | `echo` | `journey.latestRelic` | 回应（仪式语境） |

### 1.5 与 XR 系统关系

| 产品层职责 | XR 层职责 | 分界 |
|------------|-----------|------|
| 页面导航、动效 overlay | `runtime-builder` 管线 | UI 不 `bindtap` 在 `xr-scene` 内 |
| `adapter.startARScan` 业务状态 | Marker 跟踪、`XR_STATE` | adapter 写 `userPointStates`，bridge 不写 relic |
| 信物显现 `revealRelic` | `world-engine` 星宿/经络事件 | 信物持久化仅在 adapter |
| 试点 KPI 统计 | `XR_FAILED` 降级 | 失败必须 FALLBACK，不断链 |

详见：`02_technical/system_boundary.md`

### 1.6 明确不包含（MVP）

- 抽卡、等级、战力、排行榜  
- C 端虚拟道具售卖  
- 自动分账、POS、复杂会员 CRM  
- Canon 外新神祇 / 文明 / 组织 / 历史事件  

---

## 2. System Design（结构设计）

### 2.1 产品分层（与代码映射）

```text
┌─────────────────────────────────────────────────────────────┐
│ L4 商业运营层                                                │
│ platform-admin · park-admin · merchant-portal · 审查发布     │
├─────────────────────────────────────────────────────────────┤
│ L3 信物与 CRM 层                                             │
│ userRelics · userProgress · couponClaims · relic-archive     │
├─────────────────────────────────────────────────────────────┤
│ L2 探索体验层（UI）                                          │
│ index · explore-map · merchant-event/detail · ar-entry       │
│ lottie · event-complete · rights-center                    │
├─────────────────────────────────────────────────────────────┤
│ L1 控制与适配层                                              │
│ user-runtime-adapter · ar-entry-controller · pilot-scene-flow│
├─────────────────────────────────────────────────────────────┤
│ L0 XR + Event Bus + 数据适配                                 │
│ xr-event-bus · runtime-builder · world-engine              │
│ user-app-adapter · ar-runtime-bridge · mock-source         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 端与仓库映射

| 端 | 路径 | 职责 |
|----|------|------|
| C 端小程序 | `apps/miniapp/` | 用户探索全链路 |
| 共享适配器 | `apps/shared/data-adapter/` | Mock 运行时 / 未来 API |
| 小程序桥接 | `apps/miniapp/services/user-runtime-adapter/` | 加载 adapter、默认 `user_001` |
| 平台后台 | `apps/admin/platform-admin/` | 审查、发布 |
| 景区后台 | `apps/admin/park-admin/` | 园区运营 |
| 商家门户 | `apps/admin/merchant-portal/` | 礼遇核销 |

### 2.3 活动容器模型

```text
Park (park_id)
 └── Activity (activity_id)
       ├── ExplorationPoint (point_id) × N
       │     ├── RelicTemplate (relic_id)
       │     ├── ARContent (ar_content_id)
       │     └── Coupon (coupon_id, 可选)
       └── Merchant × M
```

**数据源：** `mock-source.js` → `explorationPoints`, `relics`, `arContents`, `coupons`

### 2.4 信物 vs 数字藏品（资产边界）

| 资产 | 类型 | 存储 | 用途 |
|------|------|------|------|
| Relic 信物 | 故事进度 | `userRelics` | 探索闭环、CRM |
| Digital Collectible | 营销传播 | `digital-collectible` 服务 | 传播素材 |

**禁止：** 同一 `id` 跨表；同一 UI 模块混展示。

### 2.5 品类对比表

| 维度 | AR游伴 | 传统景区小程序 | AR 外包 Demo |
|------|--------|----------------|--------------|
| 核心对象 | space + relic + 行为链 | 图文 + 券 | 单次 3D |
| 技术形态 | XR Runtime + Event Bus | 静态 CMS | 孤立页面 |
| 失败策略 | FALLBACK + toast | 常无 | 常无 |
| 交付单元 | 1 park × 3 point × 90d | 上线即可 | 验收即结束 |

---

## 3. Flow（流程）

### 3.1 主链路（用户 · step-by-step）

```text
Step 1  index          onEnterScenic → xr_start_v1 → XR_USER_TRIGGER
Step 2  explore-map    选择探索点 → space_trail_v1
Step 3  detail         mockCheckIn → CHECKED_IN
Step 4  ar-entry       startARScan → SCANNING → completeARScan|Fallback → AR_SCANNED
Step 5  lottie         revealRelic → RELIC_REVEALED → relic_emerge_v1
Step 6  rights-center unlockCoupon → COMPLETED (可选)
Step 7  event-complete 商业完成提示
```

### 3.2 探索点状态机（adapter 层）

```text
LOCKED → AVAILABLE → ARRIVED → CHECKED_IN → AR_SCANNED
       → AR_SCANNED_WITH_FALLBACK → RELIC_REVEALED → COUPON_UNLOCKED → COMPLETED
```

**状态标签：** `status-map.js` · domain=`exploration`

### 3.3 事件驱动切面（与 XR 并行）

```text
UI tap
  → ar-entry-controller.trigger({ source })
  → xr-event-bus.emit('XR_USER_TRIGGER')
  → runtime-builder: IDLE→INIT→READY→RUNNING
  → world-engine: RELIC_CREATED / STAR_LIGHTED (仪式层)
  → pilot-fx-overlay (UI 动效，不阻塞 bus)
```

**契约：** `02_technical/event_bus_contract.md`

### 3.4 B 端发布链路

```text
内容生产 → 平台审查(reviewRecords) → 发布(publishRecords)
        → runtimeStatus=PUBLISHED → C 端 getExplorationPointDetail 可读
```

### 3.5 降级路径（产品口径）

```text
startARScan.bridgeMode=FALLBACK
  → completeARFallback
  → pointState.status=AR_SCANNED_WITH_FALLBACK
  → revealRelic (同一入口，不中断信物)
```

---

## 4. Data Model（数据模型）

### 4.1 产品域顶层实体

```json
{
  "$schema": "aryouban.product.domain.v1",
  "entities": {
    "park": { "id": "park_001", "name": "string", "status": "ACTIVE|DISABLED" },
    "activity": { "id": "activity_001", "parkId": "park_001", "publishStatus": "PUBLISHED" },
    "exploration_point": { "id": "ep_001", "relicId": "relic_001", "runtimeStatus": "READY" },
    "user_progress": { "userId": "user_001", "visitedPointIds": [], "collectedRelicIds": [] },
    "user_point_state": { "pointId": "ep_001", "status": "AVAILABLE" },
    "user_relic": { "relicId": "relic_001", "status": "COLLECTED" }
  }
}
```

### 4.2 首页输出（getHomeData）

```json
{
  "park": { "id": "park_001", "name": "爱企谷" },
  "journey": {
    "progressPercent": 0,
    "latestRelic": null,
    "nextPointId": "ep_001"
  },
  "recommendedPoints": [{ "id": "ep_001", "name": "入口广场" }]
}
```

### 4.3 探索点详情输出（getExplorationPointDetail）

```json
{
  "point": { "id": "ep_001", "name": "入口广场", "parkId": "park_001" },
  "relic": { "id": "relic_001", "name": "初见印记", "chapter": "第一章" },
  "benefit": { "id": "coupon_001", "name": "咖啡到店礼" },
  "pointState": { "status": "AVAILABLE", "statusLabel": "可探索" },
  "userRelic": null,
  "canCheckIn": true,
  "canStartAR": false,
  "canRevealRelic": false
}
```

### 4.4 试点 KPI 字段（产品定义）

| KPI ID | 分子 | 分母 | 采集点 |
|--------|------|------|--------|
| `explore_completion_rate` | ≥1 信物用户 | 进入景区用户 | index + userRelics |
| `relic_acquisition_rate` | revealRelic ok | startARScan ok | adapter |
| `benefit_claim_rate` | unlockCoupon ok | revealRelic ok | couponClaims |
| `manifest_success_rate` | AR_SCANNED | AR_SCANNED + FALLBACK | arScanSessions |
| `d7_return_rate` | 7 日再访 | 首次用户 | GAP（待后端） |

### 4.5 PRD 最小字段模板

```json
{
  "requirement_id": "REQ-001",
  "park_id": "park_001",
  "point_id": "ep_001",
  "pre_status": ["AVAILABLE", "CHECKED_IN"],
  "trigger_event": "XR_USER_TRIGGER",
  "adapter_method": "mockCheckIn",
  "pages": ["pages/merchant-event/detail/index"],
  "crm_impact": ["userPointStates", "userRelics"],
  "fallback": "completeARFallback",
  "canon_conflict": false
}
```

---

## 5. Example（示例）

### 5.1 可运行 Mock 会话（Node REPL）

```bash
cd d:\LOVEQIGU_MASTER
node -e "
require('./apps/shared/data-adapter/mock-source.js');
require('./apps/shared/data-adapter/status-map.js');
require('./apps/shared/data-adapter/adapter-session.js');
require('./apps/shared/data-adapter/ar-runtime-bridge.js');
require('./apps/shared/data-adapter/user-app-adapter.js');
var g = global;
g.LQGAdapterSessionStore.initSession({ mockSource: g.LQGMockSource, mode: 'memory' });
var a = g.LQGUserAppAdapter;
var uid = 'user_001';
var pid = 'ep_001';
console.log('1 checkIn', a.mockCheckIn(pid, uid).status);
console.log('2 startAR', a.startARScan(pid, uid).bridgeMode);
var sid = a.startARScan(pid, uid).scanSessionId;
console.log('3 complete', a.completeARScan(sid, uid).status);
console.log('4 relic', a.revealRelic(pid, uid).userRelic.relicId);
console.log('5 coupon', a.unlockCoupon(pid, uid).couponClaim.claimCode);
"
```

**期望末行：** `claimCode` 形如 `LQG-CAFE-*`

### 5.2 首次游客时间线（ep_001）

| 时刻 | 页面 | adapter / bus | 状态 |
|------|------|---------------|------|
| T+0 | index | `onEnterScenic` + `XR_USER_TRIGGER` | — |
| T+1 | explore-map | 导航 | AVAILABLE |
| T+2 | detail | `mockCheckIn` | CHECKED_IN |
| T+3 | ar-entry | `startARScan` | SCANNING |
| T+4 | ar-entry | `completeARFallback` | AR_SCANNED_WITH_FALLBACK |
| T+5 | lottie | `revealRelic` | RELIC_REVEALED |
| T+6 | event-complete | toast | COMPLETED |

### 5.3 信物文案正确性

| 场景 | 正确（L2/L3） | 错误 |
|------|---------------|------|
| 显现成功 | 「你找回了新的信物。」 | 「获得稀有藏品」 |
| 完成页 | 「你已完成一次探索体验。」 | 「升级 LV.2」 |

### 5.4 小程序人工验收（10 步）

| # | 操作 | 预期 |
|---|------|------|
| 1 | 冷启动 | 首页可点，无白屏 |
| 2 | 进入景区 | `xr_start_v1` + 跳转探索地图 |
| 3 | Tab 五栏 | 均可达 |
| 4 | 单点闭环 | event-complete 出现 |
| 5 | 信物册 | relic-archive 可见「初见印记」 |
| 6 | 权益中心 | 礼遇或空态 |
| 7 | FALLBACK | 备用显现可完成信物 |
| 8 | 重进小程序 | session 进度保留 |
| 9 | 错误路由 | toast「页面暂未开放」 |
| 10 | validate_build | PASS |

---

## 6. Execution Notes（执行说明）

### 6.1 新人阅读顺序

```text
PROJECT_DOCS_INDEX_V2.md
→ product_overview.md (本文件)
→ 02_technical/runtime_flow.md
→ 02_technical/system_boundary.md
→ 05_crm/relic_data_model.md
```

### 6.2 构建门禁

```bash
node scripts/user_frontend/validate_build.js
node scripts/user_frontend/validate_pilot_scene_product.js
node scripts/user_frontend/validate_production_ui_stability.js
node scripts/user_frontend/validate_xr_ui_decouple.js
```

### 6.3 产品评审检查清单

- [ ] 功能是否落在 USER→XR→BUS→SPACE→RELIC→CRM 链路上？  
- [ ] 是否混用信物与数字藏品？  
- [ ] 是否使用探索地图、权益中心、回响？  
- [ ] 失败是否有 FALLBACK / toast？  
- [ ] 是否越界 system_boundary（抽卡/分账/Canon 扩写）？  

### 6.4 变更同步矩阵

| 变更类型 | 首要更新 |
|----------|----------|
| 新探索点 | `feature_spec` · `scenic_spot_integration` |
| XR 行为 | `xr_architecture` · `event_bus_contract` |
| 信物字段 | `relic_data_model` |
| 行为事件 | `user_behavior_model` |
| 收费 | `business_model` · `pricing_scenarios` |

### 6.5 C 端核心路由表

| 路由 | 产品名 |
|------|--------|
| `/pages/index/index` | 首页 |
| `/pages/explore-map/index` | 探索地图 |
| `/pages/merchant-event/detail/index` | 探索点详情 |
| `/pages/ar-entry/index` | 显现流程 |
| `/pages/lottie/index` | 显现仪式 |
| `/pages/relic-archive/index` | 信物册 |
| `/pages/rights-center/index` | 权益中心 |
| `/pages/event-complete/index` | 完成页 |

### 6.6 adapter 方法清单（产品依赖）

| 方法 | 产品语义 |
|------|----------|
| `getHomeData` | 首页 |
| `getExploreMapData` | 探索地图 |
| `getExplorationPointDetail` | 探索点详情 |
| `mockCheckIn` | 现场到达打卡 |
| `startARScan` / `completeARScan` | 显现（AR） |
| `completeARFallback` | 显现（备用） |
| `revealRelic` | 信物显现 |
| `unlockCoupon` | 权益领取 |
| `getRelicArchive` | 信物册 |
| `getProfileData` | 个人中心 |

### 6.7 角色场景矩阵

| 角色 | 场景 | 成功标准 |
|------|------|----------|
| 首次游客 | index → 单点信物 | `userRelics.length ≥ 1` |
| 回访游客 | map → 未点亮 point | status 推进 |
| 景区运营 | park-admin | KPI 可读 |
| 商家 | merchant-portal | 核销成功 |
| 平台 | platform-admin | 发布 PASS |

### 6.8 与 LOVEQIGU Canon

- 世界观叙事以 `docs/canon/*` 为准；产品文档 **不扩写** 设定缺口  
- 缺口：上报，不臆造  

---

*产品总览 V1.1-ENG · Batch 1*
