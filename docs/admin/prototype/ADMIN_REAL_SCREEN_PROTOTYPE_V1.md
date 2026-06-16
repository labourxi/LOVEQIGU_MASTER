# ADMIN_REAL_SCREEN_PROTOTYPE_V1

# 运营后台真机屏原型规范 V1

---

## Status

```yaml
document_id: ADMIN_REAL_SCREEN_PROTOTYPE_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / UX
priority: P1
current_active_admin_prototype: true
upstream:
  - docs/admin/visual/ADMIN_HIGH_FIDELITY_UI_V1.md
  - docs/admin/dashboard/ADMIN_OPERATION_DASHBOARD_SPEC_V1.1.md
  - docs/product/backoffice/BACKOFFICE_VISUAL_MOCKUP_V1.md
index: docs/admin/ADMIN_INDEX_V1.md
```

---

## Purpose

定义 **运营后台真机屏原型** 的页面清单、布局结构与实现映射，将高保真 UI 规范落地为可验收的静态原型页面。

---

## Scope

### In Scope

- 5 个核心后台屏原型规格
- 1440 × 900 主画布标注
- 与 `apps/admin/` 静态 HTML 实现映射

### Out of Scope

- 动态数据与 API 联调
- 移动端后台适配

---

## Architecture

```text
ADMIN_HIGH_FIDELITY_UI_V1
        ↓
ADMIN_REAL_SCREEN_PROTOTYPE_V1（本文件）
        ↓
apps/admin/shared/figma-ready/*.html
apps/admin/platform-admin/**/index.html
```

---

## Components

### 全局框架（五屏共用）

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ TOPBAR_V1 · 56px                                                         │
├────────────┬─────────────────────────────────────────────────────────────┤
│ SIDEBAR_V1 │ CONTENT · padding 24px                                      │
│ 240px      │  Breadcrumb → Page Header → 主体 → Footer note（可选）       │
└────────────┴─────────────────────────────────────────────────────────────┘
```

### SCREEN-01 · Platform Dashboard

| 属性 | 规格 |
|------|------|
| 角色 | 平台运营 |
| 主区 | TODAY_WORK_PANEL + QUICK_ACTIONS |
| 次区 | Secondary KPI Strip |
| 实现 | `apps/admin/platform-admin/dashboard/index.html` |
| 参考拼装 | `apps/admin/shared/figma-ready/page-assembly.html` |

### SCREEN-02 · Activity Management

| 属性 | 规格 |
|------|------|
| 角色 | 平台运营 |
| 主区 | FILTER_BAR_V1 + DATA_TABLE_V1 |
| 状态列 | STATUS_TAG_V1（印记语言） |
| 主操作 | 创建接福活动 · 发布 |
| 实现 | `apps/admin/platform-admin/activities/index.html` |

### SCREEN-03 · Coupon Review Center

| 属性 | 规格 |
|------|------|
| 角色 | 平台审核 |
| 主区 | 待审列表 + 审核详情抽屉 |
| 状态 | 待审 / 已落印 / 已驳回 |
| 实现 | `apps/admin/shared/figma-ready/review-center.html` |
| 平台页 | `apps/admin/platform-admin/coupons/review/index.html` |

### SCREEN-04 · Merchant Dashboard

| 属性 | 规格 |
|------|------|
| 角色 | 商家运营 |
| 主区 | METRIC_CARD_V1 + 核销路径 |
| 专用 | MERCHANT_INSIGHT_PANEL_V1 |
| 实现 | `apps/admin/merchant-portal/merchant_dashboard/index.html` |

### SCREEN-05 · Park Admin Dashboard

| 属性 | 规格 |
|------|------|
| 角色 | 景区运营 |
| 主区 | VISITOR_JOURNEY_PANEL_V1 + 活动概览 |
| 实现 | `apps/admin/park-admin/park_admin_dashboard/index.html` |

### 组件总览页

| 属性 | 规格 |
|------|------|
| 用途 | 设计验收 · 组件对照 |
| 实现 | `apps/admin/shared/figma-ready/overview.html` |
| 入口 | `apps/admin/shared/figma-ready/index.html` |

---

## Workflow

### 原型验收流

```text
1. 读取 ADMIN_HIGH_FIDELITY_UI_V1 像素规格
2. 打开对应 HTML 原型页
3. 对照 P0 组件：BUTTON · STATUS_TAG · WORK_CARD · DATA_TABLE
4. 检查 SIDEBAR / TOPBAR 结构
5. Dashboard 对照 ADMIN_OPERATION_DASHBOARD_SPEC_V1.1
6. Review Gate 签字验收
```

---

## Runtime Mapping

| 原型屏 | 规范组件 | 实现路径 |
|--------|----------|----------|
| Platform Dashboard | WORK_CARD_V1 · DASHBOARD_HERO_V1 | `platform-admin/dashboard/` |
| Activity List | DATA_TABLE_V1 · FILTER_BAR_V1 | `platform-admin/activities/` |
| Review Center | DATA_TABLE_V1 · ALERT_CARD_V1 | `figma-ready/review-center.html` |
| Coupon Center | DATA_TABLE_V1 · STATUS_TAG_V1 | `figma-ready/coupon-center.html` |
| Merchant Home | METRIC_CARD_V1 | `merchant-portal/merchant_dashboard/` |
| Park Home | VISITOR_JOURNEY_PANEL_V1 | `park-admin/park_admin_dashboard/` |

---

## Governance Rules

1. 原型页为静态 HTML · 不含业务 API · 数据使用 mock。
2. 表格屏必须体现 DATA_TABLE_V1 呼吸感原则（行高 48px · 无斑马纹）。
3. 活动后台模块可显示福印标签，但壳层遵循东方运营控制台，不引入活动专题视觉。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 5 个核心屏原型规格完整 | UX 评审 |
| AC-2 | 实现路径映射到 apps/admin | 前端走查 |
| AC-3 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ADMIN_REAL_SCREEN_PROTOTYPE_V1: FROZEN
CURRENT_ACTIVE_ADMIN_PROTOTYPE: ADMIN_REAL_SCREEN_PROTOTYPE_V1
READY_FOR_UX_ACCEPTANCE: YES
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_admin_ui: true
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1-freeze | 2026-06-16 | 初版创建并冻结 · 5 屏真机原型规格 | Cursor |
| V1-recovery | 2026-06-16 | DOCUMENT_RECOVERY_BATCH_V1 恢复 | Cursor |
