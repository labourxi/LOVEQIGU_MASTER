# PLATFORM_ADMIN_VISUAL_POLISH_V1

## 1. 本次实施目标

基于 `BACKEND_ADMIN_VISUAL_IMPLEMENTATION_PLAN_V1` 与已通过的商家 / 园区后台 Phase 1，对 LOVEQIGU / AR游伴 **平台超管后台** 执行 Phase 1 视觉 polish。

**目标：** 让平台运营人员在 10 秒内看懂景区 / 商家 / 活动 / 卡券规模、待审查与待发布队列、工单与风险状态，并清楚找到审查中心与发布中心。

**边界：** 不重构架构、不改 Runtime 数据、不改接口、不一次性实现内容生产五页完整功能。

**视觉定位：** 东方克制型运营后台 · 平台治理版 — 延续温润米白 / 深绿 / 暖金，信息密度高于商家 / 园区端，但分层清楚。

---

## 2. 平台超管后台页面范围

根路径：`apps/admin/platform-admin/`

| # | 页面 | 路径 | 优先级 | 本轮状态 |
|---|------|------|--------|----------|
| 1 | 平台总览 | `dashboard/` | P0 | **已 polish** |
| 2 | 审查中心 | `reviews/` | P0 | **已 polish** |
| 3 | 发布中心 | `publish/` | P0 | **已 polish** |
| 4 | 活动管理 | `activities/` | P0 | **已 polish** |
| 5 | 景区管理 | `parks/` | P1 | **已 polish** |
| 6 | 商家管理 | `merchants/` | P1 | **已 polish** |
| 7 | 卡券管理 | `coupons/` | P1 | **已 polish** |
| 8 | 工单中心 | `tickets/` | P1 | **已对齐 shell** |
| 9 | 培训中心 | `training/` | P1 | **已 polish** |
| 10 | 系统设置 | `settings/` | P1 | **已对齐 shell** |
| 11 | 登录 | `login/` | P1 | 保持可用 |
| 12 | 核验 / 消息子页 | `verification/*`, `messages/*` | P1 | 样式通过 `platform-admin-ui` 中文徽章对齐 |
| 13 | 活动 / 卡券子页 | `activities/*`, `coupons/*` | — | 保留原功能，未强制重写 |

---

## 3. 修改页面清单

### 3.1 核心页面 HTML

| 文件 | 变更摘要 |
|------|----------|
| `dashboard/index.html` | 迁移 `backoffice` shell；8 KPI；待处理 / 发布队列 / 风险提醒；内容生产缺口卡片 |
| `reviews/index.html` | 审查列表 + 详情面板；通过 / 驳回 / 待补充；中文状态 |
| `publish/index.html` | 发布风险提示；待发布队列；确认发布；日志占位 |
| `activities/index.html` | 活动状态 / 平台检查 / 发布状态分列；进行中无发布检查主操作 |
| `parks/index.html` | 景区合作状态中文、指标列 |
| `merchants/index.html` | 商家业态、核销、合作状态 |
| `coupons/index.html` | 卡券核销率、风险提示 |
| `training/index.html` | 迁移 shell，培训卡片中文 |
| `tickets/index.html` | 改用 `PlatformPageBoot` |
| `settings/index.html` | 改用 `PlatformPageBoot` |

### 3.2 共享文件

| 文件 | 变更摘要 |
|------|----------|
| `apps/admin/shared/backoffice.css` | `.bo-app--platform` 暖色主题；`bo-platform-*`、`bo-review-*`、`bo-publish-*`、`bo-risk-notice`、`bo-content-gap-card` |
| `apps/admin/shared/backoffice-shell.js` | 平台中文侧栏；顶栏单角色 + 后台切换下拉；`STATUS_MAP` 扩展；`bo-app--platform` |
| `platform-admin/shared/page-boot.js` | **新增** `PlatformPageBoot.boot()` |
| `platform-admin/shared/platform-admin-ui.js` | `badge()` 优先使用 `BackofficeShell.STATUS_MAP` 中文 |
| `platform-admin/shared/shell.js` | 保留兼容（部分子页仍可用） |

---

## 4. 超管首页 polish 说明

**路径：** `dashboard/`

首屏：平台总览标题 + 本周摘要 + 审查 / 发布 / 工单快捷入口  
中部：8 指标卡（景区、商家、活动、卡券、用户参与、待审查、待发布、待处理工单）  
下部：待处理事项、发布队列、风险提醒、内容生产缺口占位

**验收：** `PLATFORM_DASHBOARD_10_SECOND_READABILITY = YES`

---

## 5. 审查中心 polish 说明

待审查列表：类型、来源、状态、提交时间、操作  
详情面板：审查意见、驳回原因、通过 / 驳回 / 待补充  
状态：待审查、待补充、处理中、已通过、已驳回

**验收：** `PLATFORM_REVIEW_CENTER_CLEAR = YES`

---

## 6. 发布中心 polish 说明

待发布队列：审查状态、发布检查、Runtime、风险列  
发布按钮需确认；发布风险顶栏提示；日志 / 回滚 Mock 占位  
状态：待发布、已发布、发布失败、已阻断

**验收：** `PLATFORM_PUBLISH_CENTER_CLEAR = YES`

---

## 7. 活动管理 polish 说明

分列：活动状态、平台检查、发布状态  
进行中活动 → 运营协助；未上线 → 审查 / 发布检查 / 发布中心  
不与园区「运营巡检」混淆

**验收：** `PLATFORM_ACTIVITY_MANAGEMENT_CLEAR = YES` · `PLATFORM_ACTIVITY_CHECK_AND_PUBLISH_STATUS_SEPARATED = YES`

---

## 8–10. 景区 / 商家 / 卡券管理

- **景区：** 合作中 / 未启用 / 待配置 / 已暂停（静态中文徽章）
- **商家：** 业态、参与活动、核销量、联系人脱敏
- **卡券：** 发放 / 领取 / 核销 / 核销率、风险提示

**验收：** 各 `*_READABLE = YES`

---

## 11. 工单 / 消息 / 培训 / 核验

工单、设置、培训已对齐 `backoffice` shell；核验 / 消息子页保留原结构，`platform-admin-ui.badge()` 输出中文。

**验收：** `PLATFORM_SUPPORT_PAGES_STYLE_ALIGNED = YES`

---

## 12. 共享样式说明

新增类：`bo-platform-summary`、`bo-platform-kpi-grid`、`bo-review-queue`、`bo-review-panel`、`bo-publish-queue`、`bo-publish-panel`、`bo-risk-notice`、`bo-content-gap-card`

---

## 13. 状态中文映射

扩展 `BackofficeShell.STATUS_MAP`：`NEED_INFO`、`READY_TO_PUBLISH`、`PUBLISH_FAILED`、`ROLLED_BACK`、`SUSPENDED`、`RUNNING` 等；`PENDING_REVIEW` → 待审查。

页面静态徽章与 STATUS_MAP 一致。

**验收：** `PLATFORM_ADMIN_VISIBLE_STATUS_CHINESE = YES`

---

## 14. 顶栏权限显示

平台顶栏：单一「平台管理员」徽章 + 控制台入口 +「更多后台」下拉（商家 / 园区），避免重复角色按钮与横向溢出。

**验收：** `PLATFORM_TOPBAR_* = YES`

---

## 15. 内容生产页面缺口记录

| 页面 | 状态 |
|------|------|
| 探索点管理 | **MISSING** — 待建设 |
| 信物管理 | **MISSING** — 待建设 |
| 祝福内容管理 | **MISSING** — 待建设 |
| AR 内容管理 | **MISSING** — 待建设 |
| 美术需求单 | **MISSING** — 待建设 |

Dashboard「内容生产专项」区已展示轻量占位；侧栏「专项待建设」链至该锚点。

**验收：** `PLATFORM_CONTENT_PRODUCTION_GAP_RECORDED = YES` · `PLATFORM_ADMIN_CONTENT_PRODUCTION_PAGES_REQUIRED = YES`

---

## 16. 不改动项

Runtime 数据、接口、权限底层、后台目录结构、内容生产完整功能、用户端页面

---

## 17. 风险点

| 风险 | 缓解 |
|------|------|
| 部分子页仍用 `platform-admin-ui` 旧 shell | 中文徽章已桥接；后续专项迁移 |
| 双 shell 并存 | 核心 P0/P1 已统一 `backoffice` |
| Mock 数据与 KPI 静态值 | Phase 1 演示接受 |

---

## 18. 下一步建议

1. 浏览器验收：登录 → 总览 → 审查 → 发布 → 活动管理闭环  
2. 内容生产五页独立专项  
3. 核验 / 消息子页迁移 `backoffice` shell  
4. KPI 与 mock-store 只读联动

---

## 19. 验收标记

```
PLATFORM_ADMIN_VISUAL_POLISH_V1_CREATED = YES
PLATFORM_DASHBOARD_10_SECOND_READABILITY = YES
PLATFORM_REVIEW_CENTER_CLEAR = YES
PLATFORM_PUBLISH_CENTER_CLEAR = YES
PLATFORM_ACTIVITY_MANAGEMENT_CLEAR = YES
PLATFORM_ACTIVITY_CHECK_AND_PUBLISH_STATUS_SEPARATED = YES
PLATFORM_SCENIC_MANAGEMENT_READABLE = YES
PLATFORM_MERCHANT_MANAGEMENT_READABLE = YES
PLATFORM_COUPON_MANAGEMENT_READABLE = YES
PLATFORM_SUPPORT_PAGES_STYLE_ALIGNED = YES
PLATFORM_TOPBAR_ROLE_SWITCHER_CLEAN = YES
PLATFORM_TOPBAR_NO_DUPLICATE_ROLE_BUTTONS = YES
PLATFORM_TOPBAR_NO_HORIZONTAL_OVERFLOW = YES
PLATFORM_ADMIN_VISIBLE_STATUS_CHINESE = YES
PLATFORM_CONTENT_PRODUCTION_GAP_RECORDED = YES
PLATFORM_ADMIN_CONTENT_PRODUCTION_PAGES_REQUIRED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PLATFORM_ADMIN_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 PLATFORM_ADMIN_VISUAL_POLISH_V1*
