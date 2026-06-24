# BACKEND_ADMIN_VISUAL_IMPLEMENTATION_PLAN_V1

## 文档定位

本文档为 LOVEQIGU / AR游伴 **后台三端**（商家 / 园区负责人 / 平台超管）的视觉落地总方案。

**本轮产出：** 范围确认、视觉原则冻结、目录扫描、页面映射、组件盘点、实施优先级与下一步建议。

**本轮不做：** 大规模改代码、重构后台、改动 Runtime / 接口 / 权限。

**前置文档：** `docs/ui_implementation/USER_AND_ADMIN_PAGE_VISUAL_IMPLEMENTATION_SCOPE_V1.md`（用户端 Phase 1 已完成主要视觉落地）

---

## 1. 后台视觉总定位

**东方克制型运营后台**

| 维度 | 用户端 | 后台端 |
|------|--------|--------|
| 气质 | 探索、信物、礼遇、文化韵味、轻仪式感 | 清晰、可信、稳定、可操作 |
| 目标 | 情感与闭环体验 | 低学习成本、状态明确、数据可读 |
| 信息密度 | 留白、叙事 | 指标 + 列表 + 操作分层 |
| 品牌 | 强文化体验 | 保留 AR游伴识别，不牺牲效率 |

后台**不应**照搬用户端强文化体验，也**不应**做成普通蓝白 SaaS 模板或复杂 BI 大屏。

---

## 2. 商家后台定位

**核心目标：** 商家 10 秒内看懂：今天领了多少券、核销多少、有哪些卡券、有无待办、问题从哪提交。

**关键词：** 简单 · 直观 · 低门槛 · 少按钮 · 看得懂

**技术形态：** 静态 HTML 工作台（`apps/admin/merchant-portal/`），左侧导航 + 顶栏 + 卡片指标（`backoffice-shell.js` + `backoffice.css`）

**Phase 1 验收问题：**
- 今日领取 / 今日核销是否首屏可见？
- 扫码核销是否一键可达？
- 待处理工单是否可发现？

---

## 3. 园区负责人后台定位

**核心目标：** 让园区负责人看到合作价值、活动效果、商家表现与轻量优化入口。

**关键词：** 数据看板 · 活动效果 · 商家表现 · 简单趋势

**技术形态：** `apps/admin/park-admin/`，结构与商家后台同系（共享 `backoffice-shell.js`）

**约束：** 非一线复杂运营 — 编辑能力轻量，复杂配置留给超管。

---

## 4. 平台超管后台定位

**核心目标：** 支撑景区、活动、商家、卡券、审查、发布与平台运营。

**关键词：** 内容生产 · 审查 · 发布 · 配置 · 状态追踪 · 运营效率

**技术形态：** `apps/admin/platform-admin/`，部分页面使用 `AdminComponentLibrary` + `platform-admin-ui.js`

**约束：** 信息密度可高于商家/园区端，但必须**分层清楚**（总览 → 模块 → 明细）。

**缺口：** 探索点 / 信物 / 祝福 / AR / 美术需求等**内容生产页**尚未独立落地（见 §11）。

---

## 5. 后台视觉原则

### 5.1 色彩

| 用途 | 建议 |
|------|------|
| 背景 | 米白 `#faf9f7`、浅灰白、暖灰 |
| 主文字 | 墨色、深灰 |
| 强调 | 深绿 `#263a34`、旧金 `#b68a3d` |
| 状态 | 低饱和绿 / 橙 / 红、中性灰 |

深绿仅用于：顶栏、主按钮、重要状态、品牌识别区。**不大面积深色铺满内容区。**

现有 token：`apps/admin/shared/figma-ready/tokens.css` · `tokens.json`

### 5.2 布局

优先：**左侧导航 + 顶部信息栏 + 主内容区**

- 商家 / 园区：`backoffice-shell.js` 渲染 `#bo-sidebar` + `#bo-topnav`
- 超管：`platform-admin-ui.js` / `AdminComponentLibrary.renderAppShell`

必须保证：当前位置、主操作、数据状态、返回路径清楚。

### 5.3 信息结构（单页模板）

```
顶部：页面标题 + 说明 + 关键操作
中部：核心指标 + 筛选 + 快捷入口
下部：列表 / 表格 + 状态标签 + 详情入口
```

### 5.4 表格

禁止每页仅「搜索框 + 表格 + 按钮」。推荐：

- 指标卡 + 轻筛选 + 列表表格
- 卡片摘要 + 表格明细
- 状态流 + 操作按钮

### 5.5 状态标签（用户可见层）

**统一中文，** 推荐：草稿 / 待审查 / 已通过 / 已驳回 / 待发布 / 已发布 / 已下线 / 待核销 / 已核销 / 已结算 / 待付款 / 异常 / 已完成 / 处理中 / 待处理

**现状风险：** Mock 与部分 UI 仍展示 `DRAFT`、`PENDING`、`PROCESSING` 等英文 — 视觉 polish 阶段需映射为中文标签（内部字段可保留英文）。

---

## 6. 后台实施优先级

### Phase 1 — 商家后台核心闭环（**建议下一步优先**）

1. 商家工作台
2. 卡券管理 + 详情
3. 核销管理 + 记录
4. 财务数据
5. 工单 + 帮助

### Phase 2 — 园区负责人数据看板

1. 数据总览
2. 商家数据看板
3. 活动数据看板
4. 活动管理轻量页
5. 工单

### Phase 3 — 平台超管运营后台

1. 超管首页
2. 景区 / 活动 / 商家 / 卡券
3. 审查 + 发布
4. **内容生产页补齐**（探索点、信物、祝福、AR、美术需求）

---

## 7. 当前后台目录扫描结果

### 7.1 根目录

| 路径 | 状态 | 说明 |
|------|------|------|
| `apps/admin/` | **存在** | 后台总入口 hub（三端跳转） |
| `apps/admin/index.html` | **存在** | 三端控制台入口页 |

### 7.2 商家后台 — `apps/admin/merchant-portal/`

| 路径 | 状态 |
|------|------|
| 根目录 | **存在** — 16 文件（13 业务页 + index + shared） |
| `merchant_dashboard/` | 工作台 |
| `merchant_coupons/` · `merchant_coupon_detail/` | 卡券 |
| `merchant_scan/` | 扫码核销 |
| `merchant_redemptions/` · `merchant_redemption_detail/` | 核销记录 / 详情 |
| `merchant_finance/` | 财务 |
| `merchant_account/` · `merchant_staff/` | 账号 / 核销员 |
| `merchant_tickets/` · `merchant_ticket_new/` · `merchant_ticket_detail/` | 工单 |
| `merchant_help/` | 帮助 |
| `shared/page-boot.js` · `redemption-store.js` | 页面引导与 Mock |

### 7.3 园区负责人后台 — `apps/admin/park-admin/`

| 路径 | 状态 |
|------|------|
| 根目录 | **存在** — 9 文件 |
| `park_admin_dashboard/` | 数据总览 |
| `park_admin_merchants/` | 商家数据 |
| `park_admin_activities/` | 活动列表 |
| `park_admin_activity_detail/` · `park_admin_activity_new/` · `park_admin_activity_publish_check/` | 活动详情 / 新建 / 发布检查 |
| `park_admin_tickets/` | 工单 |
| `shared/page-boot.js` | 页面引导 |

### 7.4 平台超管后台 — `apps/admin/platform-admin/`

| 路径 | 状态 |
|------|------|
| 根目录 | **存在** — 37+ HTML/JS/CSS |
| `dashboard/` | 超管首页 |
| `login/` | 登录 |
| `parks/` | 景区管理 |
| `activities/` (+ create/edit/publish/close) | 活动管理 |
| `merchants/` | 商家管理 |
| `coupons/` (+ inventory/review/statistics/templates) | 卡券管理 |
| `reviews/` | 审查中心 |
| `publish/` | 发布中心 |
| `settings/` | 系统设置 |
| `tickets/` (+ merchants/scenic/technical) | 工单 |
| `training/` | 培训 |
| `verification/` (+ records/exceptions/verifiers/ranking) | 核验 |
| `messages/` (+ activity/review/system/training) | 消息 |
| `shared/` | shell、mock-store、platform-admin-ui |

### 7.5 共享资产 — `apps/admin/shared/`

| 路径 | 状态 | 说明 |
|------|------|------|
| `backoffice-shell.js` | **存在** | 三端侧栏 / 顶栏配置与渲染 |
| `backoffice.css` | **存在** | 商家 / 园区设计系统 V1 |
| `admin-frontphase1.css` · `admin-frontphase1.js` | **存在** | Phase1 前台样式辅助 |
| `components/index.js` | **存在** | `AdminComponentLibrary` 组件库 |
| `components/library.css` | **存在** | 组件样式 |
| `components/demo.html` | **存在** | 组件演示 |
| `figma-ready/` | **存在** | tokens、ui-system、review-center、coupon-center、page-assembly 等高保真参考 |

**技术栈结论：** 后台为 **静态 HTML + 原生 JS + CSS**，非小程序；三端页面均已落地 HTML 骨架，视觉 polish 与状态中文映射待 Phase 1 起分批实施。

---

## 8. 商家后台页面映射表

| # | 页面名称 | 现有路径 | 状态 | 视觉 polish | 备注 |
|---|----------|----------|------|-------------|------|
| 1 | 商家工作台 | `apps/admin/merchant-portal/merchant_dashboard/` | **EXISTS** | **YES** | 已有今日领取/核销指标，可强化 10 秒可读性 |
| 2 | 卡券管理 | `apps/admin/merchant-portal/merchant_coupons/` | **EXISTS** | **YES** | |
| 3 | 卡券详情 | `apps/admin/merchant-portal/merchant_coupon_detail/` | **EXISTS** | **YES** | |
| 4 | 核销管理 | `apps/admin/merchant-portal/merchant_scan/` | **EXISTS** | **YES** | 扫码核销主入口 |
| 5 | 核销记录 | `apps/admin/merchant-portal/merchant_redemptions/` | **EXISTS** | **YES** | |
| 6 | 财务数据 | `apps/admin/merchant-portal/merchant_finance/` | **EXISTS** | **YES** | |
| 7 | 账号管理 | `apps/admin/merchant-portal/merchant_account/` | **EXISTS** | **YES** | 侧栏称「门店资料」 |
| 8 | 工单 | `apps/admin/merchant-portal/merchant_tickets/` | **EXISTS** | **YES** | |
| 9 | 新建工单 | `apps/admin/merchant-portal/merchant_ticket_new/` | **EXISTS** | **YES** | |
| 10 | 工单详情 | `apps/admin/merchant-portal/merchant_ticket_detail/` | **EXISTS** | **YES** | |
| 11 | 帮助 / FAQ | `apps/admin/merchant-portal/merchant_help/` | **EXISTS** | **YES** | |
| — | 核销详情（扩展） | `merchant_redemption_detail/` | **EXISTS** | PARTIAL | 目标清单外，可复用 |
| — | 核销员管理（扩展） | `merchant_staff/` | **EXISTS** | PARTIAL | 目标清单外 |

**商家端结论：** 目标 11 页 **全部 EXISTS**；Phase 1 以视觉 polish + 状态中文 + 工作台首屏优化为主，无需新建页面。

---

## 9. 园区负责人后台页面映射表

| # | 页面名称 | 现有路径 | 状态 | 视觉 polish | 备注 |
|---|----------|----------|------|-------------|------|
| 1 | 数据总览 | `apps/admin/park-admin/park_admin_dashboard/` | **EXISTS** | **YES** | |
| 2 | 商家数据看板 | `apps/admin/park-admin/park_admin_merchants/` | **EXISTS** | **YES** | |
| 3 | 活动数据看板 | `apps/admin/park-admin/park_admin_activities/` | **PARTIAL** | **YES** | 与活动管理同页，看板/列表合一 |
| 4 | 活动管理 | `apps/admin/park-admin/park_admin_activities/` | **PARTIAL** | **YES** | 轻量 Mock，无复杂编辑器 |
| 5 | 活动详情 | `apps/admin/park-admin/park_admin_activity_detail/` | **EXISTS** | **YES** | |
| 6 | 新建活动 | `apps/admin/park-admin/park_admin_activity_new/` | **EXISTS** | **YES** | |
| 7 | 发布检查 | `apps/admin/park-admin/park_admin_activity_publish_check/` | **EXISTS** | **YES** | |
| 8 | 工单 | `apps/admin/park-admin/park_admin_tickets/` | **EXISTS** | **YES** | |

**园区端结论：** 8 项目标页均有 HTML 承载；活动看板与活动管理 **PARTIAL** 合并，Phase 2 可考虑拆分视图或 Tab。

---

## 10. 平台超管后台页面映射表

| # | 页面名称 | 现有路径 | 状态 | 视觉 polish | 备注 |
|---|----------|----------|------|-------------|------|
| 1 | 超管首页 | `apps/admin/platform-admin/dashboard/` | **EXISTS** | **YES** | |
| 2 | 景区管理 | `apps/admin/platform-admin/parks/` | **EXISTS** | **YES** | |
| 3 | 活动管理 | `apps/admin/platform-admin/activities/` (+ create/edit/publish/close) | **EXISTS** | **YES** | 含子流程页 |
| 4 | 商家管理 | `apps/admin/platform-admin/merchants/` | **EXISTS** | **YES** | |
| 5 | 卡券管理 | `apps/admin/platform-admin/coupons/` (+ 子模块) | **EXISTS** | **YES** | inventory/review/statistics/templates |
| 6 | 审查中心 | `apps/admin/platform-admin/reviews/` | **EXISTS** | **YES** | |
| 7 | 发布中心 | `apps/admin/platform-admin/publish/` | **EXISTS** | **YES** | |
| 8 | 工单 | `apps/admin/platform-admin/tickets/` (+ 子类) | **EXISTS** | **YES** | |
| 9 | 消息 | `apps/admin/platform-admin/messages/` (+ 子类) | **EXISTS** | PARTIAL | 目标清单含消息 |
| 10 | 培训 | `apps/admin/platform-admin/training/` | **EXISTS** | PARTIAL | |
| 11 | 核验 | `apps/admin/platform-admin/verification/` (+ 子类) | **EXISTS** | PARTIAL | |
| 12 | 系统设置 | `apps/admin/platform-admin/settings/` | **EXISTS** | **YES** | |
| 13 | 登录 | `apps/admin/platform-admin/login/` | **EXISTS** | **YES** | |
| 14 | 探索点管理 | — | **MISSING** | 待新建 | 见 §11 |
| 15 | 信物管理 | — | **MISSING** | 待新建 | 见 §11 |
| 16 | 祝福内容管理 | — | **MISSING** | 待新建 | 见 §11 |
| 17 | AR 内容管理 | — | **MISSING** | 待新建 | 见 §11 |
| 18 | 美术需求单 | — | **MISSING** | 待新建 | 见 §11 |

**超管端结论：** 运营 / 审查 / 发布闭环页 **EXISTS**；**内容生产五页 MISSING**，需 Phase 3 专项补齐。

---

## 11. 超管缺口页面记录

| 页面 | 状态 | 说明 |
|------|------|------|
| 探索点管理 | **MISSING** | 无独立 `exploration-points/` 或等价目录 |
| 信物管理 | **MISSING** | 无独立 `relics/` 管理页 |
| 祝福内容管理 | **MISSING** | 无独立 `blessings/` / `echo/` 管理页 |
| AR 内容管理 | **MISSING** | 无独立 `ar-content/` 管理页 |
| 美术需求单 | **MISSING** | 无独立 `art-requests/` / 美术需求目录 |

**扫描依据：** `apps/admin/platform-admin/` 全量 glob + 关键词检索（探索点 / 信物 / 祝福 / AR / 美术）无独立 HTML 页。

**后续专项：**

```
PLATFORM_ADMIN_CONTENT_PRODUCTION_PAGES_REQUIRED = YES
```

本轮**不要求创建**上述页面，已在方案中登记；建议在 Phase 3 与 `platform-admin-ui.js` / 审查发布流联动设计。

**可复用参考：** 用户端 Runtime 数据与 miniapp 页面结构（探索地图、信物库、AR 入口）仅作**字段与流程参考**，不可直接复制用户端视觉。

---

## 12. 后台公共组件建议

### 12.1 已有可复用组件（`AdminComponentLibrary`）

路径：`apps/admin/shared/components/index.js` + `library.css`

| 建议名 | 现有实现 | 路径 |
|--------|----------|------|
| AdminShell | `renderAppShell` | `components/index.js` |
| AdminSidebar | `renderSideNav` | 同上 |
| AdminTopbar | `renderTopNav` | 同上 |
| AdminMetricCard | `renderKpiCard` | 同上 |
| AdminStatusTag | `renderStatusBadge` | 同上 |
| AdminTable | `renderTable` | 同上 |
| AdminActionBar | `renderFilterBar` / `renderButton` | 同上 |
| AdminEmptyState | `renderEmptyState` | 同上 |
| — | `renderPageHeader` | 面包屑 + 标题区 |
| — | `renderBreadcrumb` | 导航路径 |
| — | `renderModal` / `renderDrawer` | 弹层 |
| — | `renderPagination` | 分页 |

### 12.2 商家 / 园区 Shell（非组件库，但可复用）

| 建议名 | 现有实现 | 路径 |
|--------|----------|------|
| AdminShell（轻量） | `BackofficeShell.mount()` | `shared/backoffice-shell.js` |
| 样式 token | `backoffice.css` | `shared/backoffice.css` |

### 12.3 本轮仅记录、暂不新建

| 建议组件 | 说明 |
|----------|------|
| AdminListCard | 可用 `card` + `metric` 模式扩展，或从 `renderKpiCard` 衍生 |
| AdminReviewPanel | 参考 `figma-ready/review-center.html` |
| AdminPublishPanel | 参考 `platform-admin/publish/` |
| AdminHelpBlock | 商家 `merchant_help` 可抽为块级组件 |

**原则：** 优先扩展 `AdminComponentLibrary` 与 `backoffice-shell`，避免第二套 UI 框架。

---

## 13. 风险点

| 风险 | 说明 | 缓解 |
|------|------|------|
| 双套 UI 体系 | 商家/园区用 `backoffice.css`，超管用 `platform-admin-ui.css` + 组件库 | Phase 1 先统一 token（figma-ready/tokens），再分批对齐 |
| 英文状态外露 | Mock store 与 badge 仍用 DRAFT/PENDING | polish 时增加展示层中文映射 |
| 内容生产页缺口 | 超管无法独立管理探索点/信物/祝福/AR/美术 | Phase 3 专项，登记 REQUIRED |
| 静态 HTML 维护 | 无构建链，改样式需逐页验证 | 优先改 shared CSS/JS，少改单页 |
| 与用户端视觉混淆 | 直接复制用户端卷轴/图谱风 | 后台仅用品牌色与字体气质，布局保持运营后台 |

---

## 14. 下一步建议

1. **优先实施：商家后台 Phase 1 视觉 polish**（`READY_FOR_MERCHANT_ADMIN_VISUAL_POLISH = YES`）
   - 工作台首屏：今日领取 / 核销 / 待办 / 扫码 CTA
   - 状态标签中文化
   - 统一 `backoffice.css` 指标卡与表格区样式
2. **冻结后台 design tokens**：以 `figma-ready/tokens.css` 为单一色彩源
3. **Phase 2**：园区三看板 polish + 活动页视图拆分评估
4. **Phase 3**：超管 polish + **内容生产五页**新建方案（探索点 / 信物 / 祝福 / AR / 美术需求）
5. **不改动：** Runtime 数据结构、接口、权限逻辑

---

## 15. 验收标记

```
BACKEND_ADMIN_VISUAL_IMPLEMENTATION_PLAN_V1_CREATED = YES
BACKEND_ADMIN_DIRECTORY_SCAN_COMPLETE = YES
MERCHANT_ADMIN_SCOPE_READY = YES
PARK_ADMIN_SCOPE_READY = YES
PLATFORM_ADMIN_SCOPE_READY = YES
PLATFORM_ADMIN_CONTENT_PRODUCTION_PAGES_REQUIRED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_VISUAL_POLISH = YES
```

---

*文档版本：V1 · 2026-06-16 · 承接 USER Phase 1 视觉落地完成态*
