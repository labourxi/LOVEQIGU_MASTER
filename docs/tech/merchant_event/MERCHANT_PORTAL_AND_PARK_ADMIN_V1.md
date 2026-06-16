# MERCHANT_PORTAL_AND_PARK_ADMIN_V1

# 商家后台与景区园区管理后台技术方案 V1

```yaml
project: LOVEQIGU / AR游伴
session: B会话｜TECH
module: Merchant Event Engine
version: V1
status: APPROVED_FOR_TECH_ARCHITECTURE
owner: TECH
date: 2026-06-07
upstream:
  - docs/product/merchant_event_engine/MERCHANT_EVENT_ENGINE_V1.md
  - docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_CASE_V1.md
  - docs/product/merchant_event_engine/LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md
  - docs/product/merchant_event_engine/MERCHANT_EVENT_ENGINE_INDEX_V1.md
  - docs/product/exploration/EXPLORATION_NODE_MODEL_V1.md
created_for: 普通商家后台、景区/园区负责人后台、平台审核与活动数据看板 MVP 框架
```

---

# 1. 文档定位

本文档是 **B 会话（TECH）** 对 A 会话已冻结商家活动引擎产品规格的 **技术落地评估与 MVP 架构方案**。

一句话定义：

```text
为 AR游伴补齐「普通商家后台 + 景区/园区负责人后台 + 平台运营审核」三层 B 端能力框架，并与活动运营、卡券核销、数据看板打通，且不污染主线信物、数字藏品、探索点与权益中心既有规则。
```

**本文档不包含：**

- 过细运营话术、物料设计、复盘模板（A 会话职责）
- POS 对接、自动分账、复杂 CRM（MVP 暂缓）
- 对 frozen Canon 正文的修改

---

# 2. 技术目标

## 2.1 B 端能力目标

```text
1. 普通商家后台 — 面向提供卡券合作的商家
2. 景区/园区负责人后台 — 面向景区、园区、街区、商圈管理者
3. 平台管理员审核机制 — 面向 AR游伴运营人员
```

## 2.2 MVP 框架目标

| 角色 | MVP 必须达成 |
|------|-------------|
| **商家** | 登录 · 提交卡券 · 查看领取/核销数据 · 申请参与活动 · 处理核销 |
| **园区负责人** | 登录 · 查看所属活动/商家/数据 · 发起活动申请 |
| **平台管理员** | 审核商家/卡券/活动 · 发布/暂停/结束活动 · 查看总数据 · 代核销兜底 |

---

# 3. 现状评估

## 3.1 结论摘要

| 维度 | 现状 |
|------|------|
| B 端数据模型 | **几乎为零**；产品 spec 完整，代码无 schema |
| API / 后端 | **不存在**；miniapp 纯本地 `require()` |
| 商家/园区后台应用 | **不存在**；`apps/admin` 无实现 |
| RBAC | **不存在** |
| C 端权益/卡券 | **只读占位**；`rights.v1` 静态 coupon，无核销 |
| 可复用产品 spec | **完整**；`merchant_event_engine/` 四份核心文档 |

## 3.2 已有资产清单

| 资产 | 路径 | 可复用方式 |
|------|------|-----------|
| 商家活动引擎架构 | `docs/product/merchant_event_engine/MERCHANT_EVENT_ENGINE_V1.md` | 字段、状态机、模块划分 |
| 首场活动案例 | `LOVEQIGU_FIRST_EVENT_CASE_V1.md` | MVP 验收场景 |
| 后台配置方案 | `LOVEQIGU_FIRST_EVENT_ADMIN_CONFIG_V1.md` | Admin 字段/按钮/任务链 |
| 探索实体模型 | `docs/product/exploration/EXPLORATION_NODE_MODEL_V1.md` | `SCENIC` · `MERCHANT` · `BENEFIT` ENTITY 对齐 |
| 权益 Canon | `docs/product/rights_center/LOVEQIGU_POINTS_AND_RIGHTS_CANON_V1.md` | L1 商业层边界 |
| C 端权益中心 | `apps/miniapp/pages/rights-center/` | 接入 `user_coupon` 展示 |
| 权益数据 schema | `data/rights/*.json` · `loveqigu.rights.v1` | **不可**直接当 coupon_template |
| 景区原型 mock | `apps/miniapp/services/prototype/prototype-runtime-service.js` | 演示用；可被 `park` 主数据替换 |
| Live Ops 活动 | `LIVE_OPS_ENGINE/campaigns.yaml` | L2 运营模板；**非**商家联动活动 |
| Chapter Registry 模式 | `apps/miniapp/services/chapter/chapter-runtime-registry.js` | 新 registry 聚合模式参考 |

## 3.3 明确缺失

```text
merchant / park / activity / coupon_template / user_coupon / coupon_redemption
activity_application / activity_merchant / stats_daily
merchant_user / park_operator / RBAC
HTTP API / 云函数 / 数据库
apps/merchant-portal / apps/park-portal / apps/admin
核销码生成与校验 / 审核工作流 / 日统计聚合
```

## 3.4 C 端权益边界（必须遵守）

来源：`data/rights/rights.json` · `loveqigu.rights.v1`

```text
rights = L1 商业层；不得与 Relic 仪式链混用
relic = 故事推进资产；Rights 不得解锁或替代 Relic 进度
活动卡券领取后 → 以 L1 权益条目进入权益中心，不得做成优惠券商城首页
```

当前权益中心状态（`pages/rights-center/index.js`）：

```text
「权益数据已可见，领取接口尚未接入。」
```

---

# 4. 角色权限模型

## 4.1 角色定义

| 角色 ID | 中文 | 范围 |
|---------|------|------|
| `super_admin` | 平台超级管理员 | 全部权限 |
| `operation_admin` | 平台运营管理员 | 活动、商家、卡券、审核、发布、数据看板 |
| `park_admin` | 景区/园区负责人 | 仅所属 `park_id` 的数据、活动、商家、申请 |
| `merchant_admin` | 普通商家管理员 | 仅所属 `merchant_id` 的资料、卡券、申请、核销数据 |
| `merchant_staff` | 商家店员/核销人员 | 核销 + 基础核销记录查看 |

## 4.2 权限矩阵（MVP）

| 能力 | super | operation | park | merchant_admin | merchant_staff |
|------|:-----:|:---------:|:----:|:--------------:|:--------------:|
| 审核商家 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 审核卡券 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 审核/发布活动 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 提交活动申请 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 申请参与活动 | — | — | — | ✅ | ❌ |
| 创建/提交卡券 | — | — | — | ✅ | ❌ |
| 核销卡券 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 代核销兜底 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 查看园区总数据 | ✅ | ✅ | ✅(本园区) | ❌ | ❌ |
| 查看商家数据 | ✅ | ✅ | ✅(本园区) | ✅(本店) | ✅(本店核销) |

## 4.3 数据隔离规则

```text
所有 list/detail API 必须强制注入 scope：
  park_admin    → WHERE park_id = :current_park_id
  merchant_*    → WHERE merchant_id = :current_merchant_id
  operation_*   → 可读全量；写操作需 audit_log
```

---

# 5. 功能模块规格

## 5.1 普通商家后台

| 模块 | MVP 能力 |
|------|----------|
| 商家登录 | 手机号/账号密码；`merchant_id` 绑定；微信授权预留 |
| 商家资料 | 名称、类型、园区、联系人、地址、图片、简介；关键字段需平台审核 |
| 卡券管理 | 新建草稿 · 提交审核 · 查看通过/驳回 · 下架 · 库存/领取/核销数 |
| 活动申请 | 查看可参与活动 · 申请 · 选卡券 · 查看状态 · 下一期意向 |
| 核销管理 | 扫码核销 · 输码核销 · 今日/历史记录 · 异常处理 |
| 数据统计 | 曝光 · 领取 · 核销 · 转化率 · 按活动维度 |
| 消息通知 | MVP 可暂缓；预留字段 |
| 账号设置 | MVP：改密、绑定手机 |

### 卡券状态机

```text
draft → pending_review → approved → active
                      ↘ rejected
active → paused → expired → archived
```

## 5.2 景区/园区负责人后台

| 模块 | MVP 能力 |
|------|----------|
| 园区概览 | 进行中活动 · 商家数 · 访问/参与 · 领取/核销 · 热门点位/商家 |
| 活动管理 | 查看所属活动 · 发起活动需求 · 查看状态/数据/复盘 |
| 商家管理 | 所属商家列表 · 合作状态 · 卡券/核销数据 · 邀请/推荐 |
| 活动申请 | 提交活动名称/类型/时间/目标/商家/点位 |
| 数据看板 | 访问 · 参与 · 任务完成 · 探索点热度 · 商家排行 |
| 报告导出 | MVP：CSV · 简版 Markdown/HTML |

**注意：** 园区负责人 **不直接发布活动**；发布权归平台 `operation_admin`。

### 活动状态机

```text
draft → pending_review → approved → published → active → ended → archived
```

## 5.3 平台管理员后台（EVENT_OPERATION_CENTER）

| 模块 | MVP 能力 |
|------|----------|
| 商家审核 | 资料审核 · 合作状态 |
| 卡券审核 | 内容/权益/文案 |
| 活动审核 | 规则/文案/资产/商家参与 |
| 活动发布 | publish · pause · end |
| 数据总览 | 商家/园区/活动维度 |
| 异常核销 | 代核销兜底 |

### 统一审核状态

```text
pending_review → approved | rejected | needs_revision
```

---

# 6. 数据模型

## 6.1 新增实体（全部需新建）

建议目录：`data/merchant_event/`（MVP JSON seed）→ 后续迁移 DB。

### merchant

```text
id, name, type, park_id, contact_name, contact_phone,
address, cover_image, description, business_hours,
status, review_status, created_at, updated_at
```

### merchant_user

```text
id, merchant_id, user_id, role, status, created_at, updated_at
```

### park / park_operator

```text
park: id, name, code, region, cover_image, status, ...
park_operator: id, park_id, user_id, role, status, created_at, updated_at
```

### activity

```text
id, name, code, type, park_id, status,
start_time, end_time, description, cover_image,
created_by, created_at, updated_at
```

### activity_application

```text
id, park_id, merchant_id (nullable), activity_id (nullable),
application_type, title, description, status, review_note,
created_at, updated_at
```

### coupon_template

```text
id, merchant_id, activity_id (nullable), name, type, description, terms,
start_time, end_time, stock_total, stock_remaining, per_user_limit,
need_offline_redeem, status, review_status, created_at, updated_at
```

### user_coupon

```text
id, user_id, coupon_template_id, merchant_id, activity_id,
code, status, claimed_at, redeemed_at (nullable), redeemed_by (nullable)
```

### coupon_redemption

```text
id, user_coupon_id, merchant_id, activity_id, redeem_code,
redeemed_by, redeem_method, status, note, created_at
```

### activity_merchant

```text
id, activity_id, merchant_id, participation_level, status,
created_at, updated_at
```

### stats_daily

```text
id, date, park_id, activity_id (nullable), merchant_id (nullable),
metric_key, metric_value, created_at, updated_at
```

### 建议补充

```text
audit_log       — 平台审核流水
user_account    — B 端登录主体（若独立于 C 端 openid）
activity_asset  — 活动信物/活动数字藏品/活动凭证（与主线 relic 隔离）
activity_task   — 活动任务进度（绑定 exploration_node_id）
```

## 6.2 与 EXPLORATION_NODE_MODEL 对齐

```text
park        ↔ SCENIC ENTITY
merchant    ↔ MERCHANT ENTITY
coupon_template / user_coupon ↔ BENEFIT ENTITY（L1 商业层）
exploration_node_id — 活动任务挂载已有探索点，不重写 CH 剧情
```

## 6.3 资产隔离规则（冻结）

| 资产 | 存储域 | 禁止 |
|------|--------|------|
| 主线信物 | `data/relics/` · relic services | 活动信物不得写入 |
| 活动信物 | `activity_asset.type = event_relic` | 不进 synthesis / star-map |
| 数字藏品（主线） | CONTENT_ENGINE DC | 活动 DC 独立表 |
| 活动数字藏品 | `activity_asset.type = event_dc` | 不承诺金融价值 |
| 商家卡券 | `coupon_template` / `user_coupon` | 不进 relic 合成链 |

---

# 7. 页面路由

## 7.1 商家后台

```text
/merchant/login
/merchant/dashboard
/merchant/profile
/merchant/coupons
/merchant/coupons/new
/merchant/coupons/:id
/merchant/activities
/merchant/activities/:id
/merchant/redemptions
/merchant/reports
/merchant/settings
```

## 7.2 景区/园区后台

```text
/park/login
/park/dashboard
/park/activities
/park/activities/new-request
/park/activities/:id
/park/merchants
/park/merchants/:id
/park/coupons
/park/stats
/park/reports
/park/settings
```

## 7.3 平台管理员后台

```text
/admin/merchants
/admin/merchants/review
/admin/coupons/review
/admin/parks
/admin/activities
/admin/activities/review
/admin/redemptions
/admin/stats
```

## 7.4 C 端 miniapp 增量（不改探索主线）

```text
pages/merchant-event/index       — 活动首页
pages/merchant-event/progress    — 任务进度
pages/merchant-event/coupons     — 活动卡券领取
pages/rights-center/index        — 已有；接入 user_coupon
```

---

# 8. API 规格

当前项目 **零 HTTP API**。MVP 建议新建 `apps/api/` 或微信云开发。

## 8.1 商家 API

```text
POST   /api/merchant/auth/login
GET    /api/merchant/profile
PUT    /api/merchant/profile
GET    /api/merchant/coupons
POST   /api/merchant/coupons
PUT    /api/merchant/coupons/:id
POST   /api/merchant/coupons/:id/submit-review
GET    /api/merchant/activities
POST   /api/merchant/activities/:id/apply
POST   /api/merchant/redemptions/verify
GET    /api/merchant/stats
```

## 8.2 园区 API

```text
POST   /api/park/auth/login
GET    /api/park/dashboard
GET    /api/park/activities
POST   /api/park/activity-applications
GET    /api/park/merchants
GET    /api/park/coupons
GET    /api/park/stats
GET    /api/park/reports/export
```

## 8.3 平台 API

```text
GET    /api/admin/merchants
POST   /api/admin/merchants/:id/review
GET    /api/admin/coupons/review
POST   /api/admin/coupons/:id/review
GET    /api/admin/activity-applications
POST   /api/admin/activity-applications/:id/review
POST   /api/admin/activities/:id/publish
POST   /api/admin/activities/:id/pause
POST   /api/admin/activities/:id/end
GET    /api/admin/stats
POST   /api/admin/redemptions/override
```

## 8.4 C 端 API（与 B 端分离）

```text
GET    /api/c/activities/:code
POST   /api/c/activities/:id/tasks/complete
POST   /api/c/coupons/:templateId/claim
GET    /api/c/coupons/mine
```

---

# 9. 系统架构

```text
┌─────────────────────────────────────────────────────────────┐
│  C 端：apps/miniapp                                         │
│  探索主线 · 信物 · 星图 · 权益中心 · 活动页（增量）          │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS /api/c/*
┌───────────────────────────▼─────────────────────────────────┐
│  B 端：apps/merchant-portal · apps/park-portal · apps/admin   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS /api/merchant|park|admin/*
┌───────────────────────────▼─────────────────────────────────┐
│  API 层：apps/api/（新建）                                   │
│  RBAC · 审核 · 核销 · 统计聚合                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  数据层：data/merchant_event/ → DB（merchant_event 平行域）    │
│  不写入 data/relics/ · 不修改 rights canon 正文              │
└─────────────────────────────────────────────────────────────┘
```

---

# 10. MVP 实施边界

## 10.1 第一阶段必须做

```text
1.  商家登录 / 账号绑定
2.  商家资料管理
3.  商家卡券创建与提交审核
4.  平台卡券审核
5.  商家卡券核销
6.  商家数据看板
7.  景区/园区负责人登录
8.  景区/园区活动数据看板
9.  景区/园区商家列表
10. 景区/园区活动申请
11. 平台活动申请审核
```

## 10.2 第一阶段暂缓

```text
复杂 CRM · 自动分账 · POS 对接 · 复杂会员等级
复杂广告竞价 · 复杂复盘 PDF · 复杂营销自动化
商家自助创建完整活动 · 微信授权登录（可预留）
```

---

# 11. 验收标准

## 11.1 商家后台

```text
□ 商家可以登录
□ 商家可以编辑基础资料
□ 商家可以创建卡券并提交审核
□ 平台可以审核卡券
□ 商家可以查看领取数和核销数
□ 商家可以完成核销
□ 商家可以申请参与活动
```

## 11.2 景区/园区后台

```text
□ 负责人可以登录
□ 只能看到所属园区数据
□ 可以查看活动列表与参与商家
□ 可以查看卡券领取和核销数据
□ 可以提交活动申请
□ 可以查看活动数据看板
```

## 11.3 平台后台

```text
□ 可以审核商家、卡券、活动申请
□ 可以发布 / 暂停 / 结束活动
□ 可以查看商家、园区、活动总数据
□ 可以代核销兜底
```

## 11.4 权限

```text
□ 商家不能看其它商家数据
□ 商家不能发布/审核活动
□ 园区不能看其它园区数据
□ 园区不能越权发布平台活动
□ 平台管理员统一管理
```

---

# 12. 风险与控制

| 风险 | 等级 | 控制措施 |
|------|------|----------|
| 活动信物污染主线信物 | 🔴 | 独立 `activity_asset`；禁止写 `data/relics/` |
| 权益中心变优惠券商城 | 🔴 | 卡券仅在活动任务后出现；首页不列券 |
| 数字藏品混用/金融暗示 | 🟠 | 活动 DC 独立；审核拦截金融文案 |
| 无后端从零建设 | 🟠 | MVP：JSON/SQLite + 单 API 服务 |
| 权限越权 | 🔴 | 强制 scope + 集成测试 |
| 重复核销 | 🟠 | `user_coupon.status` 原子更新；redemption 幂等 |
| 探索点与活动耦合 | 🟡 | 任务引用 `node_id`，不改 CH 剧情 |
| A/B 文档漂移 | 🟡 | 技术 doc 登记 INDEX |

---

# 13. 对现有 C 端影响

| 系统 | 影响 | 策略 |
|------|------|------|
| 探索/探索点 | 🟢 低 | 活动挂载已有节点 |
| 主线信物 | 🟢 无 | 活动信物不进 relic 链 |
| 数字藏品 | 🟢 低 | 活动 DC 独立发放 |
| 权益中心 | 🟡 增量 | 接入 user_coupon；保留 L1 边界 |
| 星图/经络/合成 | 🟢 无 | 不修改现有 service |
| 祝福系统 | 🟢 无 | 与商家卡券分离 |
| prototype 景区 mock | 🟡 | 逐步接 park 主数据 |

---

# 14. MVP 实施任务清单（Codex 可执行）

| ID | 任务名 | 产出 | 依赖 | 估时 |
|----|--------|------|------|------|
| **T1** | `MERCHANT_EVENT_DATA_SCHEMA_V1` | JSON Schema + seed + validate 脚本 | ADMIN_CONFIG | 1–2d |
| **T2** | `MERCHANT_EVENT_API_SKELETON_V1` | API + RBAC + 文件 DB | T1 | 2–3d |
| **T3** | `MERCHANT_PORTAL_MVP_V1` | 商家后台 6 页 | T2 | 2–3d |
| **T4** | `PARK_PORTAL_MVP_V1` | 园区后台 5 页 | T2 | 2d |
| **T5** | `PLATFORM_EVENT_ADMIN_MVP_V1` | 平台审核 + 发布 | T2 | 2d |
| **T6** | `MINIAPP_MERCHANT_EVENT_C_V1` | C 端活动页 + 权益中心对接 | T2 | 2d |
| **T7** | `MERCHANT_EVENT_INDEX_TECH_REGISTER` | INDEX 登记技术文档 | T1 | 0.5d |

**建议顺序：** T1 → T2 → (T3 ∥ T4 ∥ T5) → T6 → T7

**总估时：** 约 10–14 人日（单人串行）

---

# 15. 当前结论

```text
MERCHANT_PORTAL_AND_PARK_ADMIN_V1 = APPROVED_FOR_TECH_ARCHITECTURE
```

| 判断 | 结论 |
|------|------|
| 能否复用现有 merchant/coupon 代码？ | **不能**；仅复用产品 spec 与 C 端展示壳 |
| MVP 是否可落地？ | **可以**；需新建 API + 三端后台 + C 端活动薄层 |
| 是否影响主线 Canon？ | **可控**；严格隔离 merchant_event 平行域 |
| 最大缺口 | **后端 + RBAC 从零开始** |

---

# 16. 下一阶段建议

优先启动：

```text
T1: MERCHANT_EVENT_DATA_SCHEMA_V1
```

产出路径建议：

```text
docs/tech/merchant_event/MERCHANT_EVENT_DATA_SCHEMA_V1.json
data/merchant_event/seed/loveqigu_first_event_case_v1.json
scripts/merchant_event/validate-schema.js
```

---

**Success Marker:**

```text
MERCHANT_PORTAL_AND_PARK_ADMIN_V1_COMPLETE = YES
```
