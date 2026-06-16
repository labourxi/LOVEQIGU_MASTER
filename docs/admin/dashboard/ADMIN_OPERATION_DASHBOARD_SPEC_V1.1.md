# ADMIN_OPERATION_DASHBOARD_SPEC_V1.1

# 运营后台首页仪表盘规格 V1.1

---

## Status

```yaml
document_id: ADMIN_OPERATION_DASHBOARD_SPEC_V1.1
version: V1.1
status: REVIEW
review_batch: TODAY_DOCUMENT_BUILD_BATCH_V1
updated_at: 2026-06-07
owner: Product / Admin UX
priority: P0
upstream:
  - docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
  - docs/product/platform/PLATFORM_ADMIN_CONSOLE_V1.md
  - docs/product/backoffice/BACKOFFICE_DESIGN_SYSTEM_V1.md
index: docs/admin/ADMIN_INDEX_V1.md
current_active_dashboard_candidate: true
includes:
  - ACTION_FIRST_RULE
  - TODAY_WORK_PANEL
  - QUICK_ACTION_FIRST_RULE
  - ROLE_HOME_MODE
```

---

## Purpose

定义平台 / 园区 / 商家三类运营后台 **首页仪表盘** 的信息架构、布局与交互规则。

V1.1 核心升级：

```text
从「KPI 数字墙」转为「行动优先 · 今日工作 · 角色差异化首页」
```

---

## Scope

### In Scope

- ACTION_FIRST_RULE · TODAY_WORK_PANEL · QUICK_ACTION_FIRST_RULE · ROLE_HOME_MODE
- 1280+ 布局结构
- 三类角色首页差异
- 与视觉体系的约束关系

### Out of Scope

- 子页面（活动详情 / 商家审核等）线框
- 后端待办 API 设计
- 实时数据刷新策略

---

## Architecture

```text
用户登录
  ↓
ROLE_HOME_MODE 解析
  ↓
┌─────────────────────────────────────────────┐
│ Header + 云纹 Banner                         │
├──────────────────────┬──────────────────────┤
│ TODAY_WORK_PANEL     │ QUICK_ACTIONS        │
│ (ACTION_FIRST 主区)  │ (QUICK_ACTION_FIRST) │
├──────────────────────┴──────────────────────┤
│ Secondary KPI Strip（可折叠）                │
└─────────────────────────────────────────────┘
```

---

## Components

### ACTION_FIRST_RULE（行动优先规则）

首页首屏必须呈现 **可执行下一步**，而非静态数据摘要。

| 规则 ID | 说明 |
|---------|------|
| A1 | 首屏左侧 ≥40% 宽度留给「待办 / 行动」 |
| A2 | 每个待办项含：标题 · 截止/紧急度 · 一键跳转 |
| A3 | 无待办时展示「推荐行动」而非空白 |
| A4 | 数据指标不得占据首屏唯一焦点 |
| A5 | 行动项按 `urgency × business_impact` 排序 |

### TODAY_WORK_PANEL（今日工作面板）

| 字段 | 说明 |
|------|------|
| `panel_id` | `today_work_{role}` |
| `sections` | `urgent` · `scheduled` · `watching` |
| `item_fields` | title · source · count · action_url · due_at |

| 分区 | 视觉 | 含义 |
|------|------|------|
| `urgent` | Blessing Red 标记 | 需今日完成 |
| `scheduled` | Ink Black | 今日计划 |
| `watching` | 灰色 · 可折叠 | 需关注但不阻塞 |

**平台运营示例**：

```text
urgent:     3 家商家待审核 · 2 个活动待发布
scheduled:  爱企谷初见寻宝节 D-2 检查清单
watching:   核销异常率上升 · 福礼库存预警
```

### QUICK_ACTION_FIRST_RULE（快捷行动优先规则）

| 规则 ID | 说明 |
|---------|------|
| Q1 | 快捷行动 ≤6 个 · 超出收入「更多」 |
| Q2 | 每个行动 = 图标 + 福文化命名 + 直达路由 |
| Q3 | 禁止纯设置类入口占据快捷位 |
| Q4 | 平台 / 园区 / 商家各自独立配置表 |
| Q5 | 使用 Blessing Red 主按钮样式 |

**平台默认快捷行动**：

```text
审核商家 · 发布活动 · 发放福礼 · 查看核销 · 消息中心 · 数据导出
```

### ROLE_HOME_MODE（角色首页模式）

| role | home_mode | 首屏焦点 |
|------|-----------|----------|
| `platform_operator` | PLATFORM_HOME | 全平台待办 · 活动生命周期 · 商家接入 |
| `park_operator` | PARK_HOME | 本园活动 · 探索点 · 驻场事项 |
| `merchant_operator` | MERCHANT_HOME | 本店福礼 · 核销 · 店员培训 |

**禁止**：三种角色共用同一 KPI 墙而无差异化待办。

---

## Workflow

### 首页渲染流

```text
1. 用户登录 → 解析 role
2. 加载 ROLE_HOME_MODE 配置
3. 拉取 today_work_{role} 待办数据
4. ACTION_FIRST：按 A1–A5 排序渲染 TODAY_WORK_PANEL
5. QUICK_ACTION_FIRST：渲染 ≤6 快捷行动
6. 次要 KPI Strip 默认折叠 · 可展开
7. 视觉遵循 ADMIN_OPERATION_VISUAL_SYSTEM_V1
```

### 待办项生命周期

```text
系统/人工产生待办
  → 写入 urgent / scheduled / watching
  → 用户点击 action_url 处理
  → 完成后移出面板或降级至 watching
```

---

## Runtime Mapping

| 规格组件 | 实现参考 | 路径 |
|----------|----------|------|
| Platform Home | Phase2 Hub | `apps/admin/platform-admin/index.html` |
| 共享壳层 | Backoffice Shell | `apps/admin/shared/backoffice-shell.js` |
| 视觉 Tokens | Figma Ready | `apps/admin/shared/figma-ready/tokens.css` |
| Mock 数据 | Platform Admin Store | `apps/admin/platform-admin/shared/mock-store.js` |

### 配置数据结构（建议）

```yaml
role_home_config:
  platform_operator:
    quick_actions: [audit_merchant, publish_activity, ...]
    today_work_sections: [urgent, scheduled, watching]
  park_operator: ...
  merchant_operator: ...
```

---

## Governance Rules

1. 遵循 `ADMIN_OPERATION_VISUAL_SYSTEM_V1` 颜色与命名。
2. KPI 使用福文化展示语言（福礼领取 · 核销 · 福印获得）。
3. 首屏 **行动 > 数据** · 违反 ACTION_FIRST_RULE 不予验收。
4. 三种角色首页 **必须差异化** · 违反 ROLE_HOME_MODE 不予验收。
5. 快捷行动禁止暴露技术词（token · API · card_id 等）。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | ACTION_FIRST_RULE 五条完整 | 文档评审 |
| AC-2 | TODAY_WORK_PANEL 结构与示例完整 | 产品走查 |
| AC-3 | QUICK_ACTION_FIRST_RULE 五条完整 | 文档评审 |
| AC-4 | ROLE_HOME_MODE 三角色差异明确 | 设计评审 |
| AC-5 | 布局图与视觉约束对齐 | 交叉对照 Visual System |
| AC-6 | 状态 = REVIEW · 未冻结 | 索引检查 |

```yaml
ADMIN_OPERATION_DASHBOARD_SPEC_V1.1_REVIEW: PENDING
ACTION_FIRST_RULE: INCLUDED
TODAY_WORK_PANEL: INCLUDED
QUICK_ACTION_FIRST_RULE: INCLUDED
ROLE_HOME_MODE: INCLUDED
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0 | — | 首版仪表盘规格（未入库） | — |
| V1.1-draft | 2026-06-07 | 新增 ACTION_FIRST · TODAY_WORK · QUICK_ACTION · ROLE_HOME · TODAY_DOCUMENT_BUILD_BATCH_V1 · REVIEW | Cursor |
| V1.1-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 本批次回退至 REVIEW | Cursor |
