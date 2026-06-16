# ADMIN_UI_COMPONENT_LIBRARY_V1

# 运营后台统一组件库 V1

---

## Status

```yaml
document_id: ADMIN_UI_COMPONENT_LIBRARY_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Design System
priority: P1
current_active_component_library: true
upstream:
  - docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
  - docs/admin/dashboard/ADMIN_OPERATION_DASHBOARD_SPEC_V1.1.md
  - docs/product/backoffice/BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1.md
index: docs/admin/ADMIN_INDEX_V1.md
```

---

## Purpose

建立 **AR游伴后台统一组件库**，为全部运营后台提供可复用、可验收、低装饰的 UI 组件规范。

适用于：

```text
平台后台 · 景区后台 · 商家后台 · 运营后台 · 活动后台
```

---

## Scope

### In Scope

- P0 / P1 / P2 冻结组件规格
- 布局壳层（SIDEBAR_V1 · TOPBAR_V1）
- 东方元素使用规范
- 与 ADMIN_OPERATION_VISUAL_SYSTEM_V1 的视觉对齐

### Out of Scope

- 用户前台组件
- 高保真 Figma 源文件（见 BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1）
- 具体页面线框（见 ADMIN_OPERATION_DASHBOARD_SPEC_V1.1）

---

## Architecture

```text
ADMIN_OPERATION_VISUAL_SYSTEM_V1（视觉宪法 · 东方运营控制台）
        ↓
ADMIN_UI_COMPONENT_LIBRARY_V1（组件库 · 本文件）
        ↓
BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1（Design Tokens + 实现）
        ↓
Platform / Park / Merchant Admin Pages
```

### 设计原则

| 原则 | 说明 |
|------|------|
| ACTION_FIRST | 操作优先 · 减少装饰干扰 |
| ORIENTAL_OPERATION_CONSOLE | 东方运营控制台 · 非古风化 |
| LOW_DECORATION | 低装饰 · 表格与数据优先 |

---

## Components

### 组件优先级总览

#### P0（必须实现）

| 组件 ID | 名称 |
|---------|------|
| BUTTON_V1 | 按钮体系 |
| STATUS_TAG_V1 | 状态标签 |
| WORK_CARD_V1 | 今日工作卡片 |
| DATA_TABLE_V1 | 数据表格 |

#### P1（次优先）

| 组件 ID | 名称 |
|---------|------|
| METRIC_CARD_V1 | 指标卡片 |
| FILTER_BAR_V1 | 筛选栏 |
| ALERT_CARD_V1 | 告警卡片 |

#### P2（扩展）

| 组件 ID | 名称 |
|---------|------|
| VISITOR_JOURNEY_PANEL_V1 | 游客路径面板 |
| MERCHANT_INSIGHT_PANEL_V1 | 商家洞察面板 |
| EMPTY_STATE_V1 | 空状态 |
| DASHBOARD_HERO_V1 | 仪表盘 Hero |

---

### BUTTON_V1

#### Primary Button

| 属性 | 规格 |
|------|------|
| 用途 | 发布活动 · 创建探索点 · 审核通过 · 发布数字藏品 |
| 背景 | 墨青 |
| 文字 | 白字 |
| 圆角 | 8px |

#### Secondary Button

| 属性 | 规格 |
|------|------|
| 用途 | 编辑 · 查看 · 预览 |
| 样式 | 描边 · 墨青/青灰 · 低饱和 |

#### Danger Button

| 属性 | 规格 |
|------|------|
| 用途 | 删除 · 停用 · 驳回 |
| 颜色 | 朱砂红 |

---

### STATUS_TAG_V1

允许品牌化表达：

```text
已落印 · 已钤印 · 已启封
```

#### 状态映射

| 技术态 | 展示态 |
|--------|--------|
| Draft | 草稿 |
| Review | 待审 |
| Approved | 已落印 |
| Published | 已钤印 |
| Active | 已启封 |
| Disabled | 已封存 |

---

### WORK_CARD_V1

| 属性 | 规格 |
|------|------|
| 用途 | TODAY_WORK_PANEL |
| 特点 | 大数字 · 高优先级 · 快速处理 |
| 装饰 | 最低 · 数据与 CTA 优先 |

---

### METRIC_CARD_V1

| 属性 | 规格 |
|------|------|
| 用途 | 运营数据 · 财务数据 · 活动数据 |
| 特点 | 高密度 · 低装饰 |

---

### ALERT_CARD_V1

| 属性 | 规格 |
|------|------|
| 用途 | 异常 · 告警 · 系统通知 |
| 等级 | P0 · P1 · P2 |

---

### DATA_TABLE_V1

**后台最高优先级组件**

| 原则 | 说明 |
|------|------|
| 表格优先 | 信息密度与可读性第一 |
| 装饰最少 | 不得牺牲扫描效率 |

**允许**：

```text
极弱金石纹 · 透明度 ≤ 3%
```

**禁止**：

```text
祥云覆盖 · 仿古纸背景 · 大面积纹理
```

---

### FILTER_BAR_V1

统一筛选器 · 标准字段：

```text
关键词 · 日期 · 状态 · 景区 · 活动 · 搜索
```

---

### VISITOR_JOURNEY_PANEL_V1

**景区后台专用**

显示：

```text
游客路径 · 热门节点 · 流失节点 · 完成率
```

---

### MERCHANT_INSIGHT_PANEL_V1

**商家后台专用**

显示：

```text
AI 建议 · 运营建议 · 活动建议 · 优惠券建议
```

---

### EMPTY_STATE_V1

**允许**：

```text
云纹 · 淡墨 · 金石纹
```

**禁止**：

```text
国潮插画 · 大幅装饰画
```

---

### DASHBOARD_HERO_V1

**允许**：

```text
极淡云纹 · 极淡金石纹 · 低饱和东方色 · 透明度 ≤ 5%
```

---

### SIDEBAR_V1

#### 固定结构

```text
Dashboard
景区管理
商家管理
活动中心
探索点
内容工厂
AR 工厂
数字藏品
工单系统
系统设置
```

**禁止**：

```text
卷轴菜单 · 古籍菜单
```

---

### TOPBAR_V1

#### 结构

```text
Logo · 搜索 · 消息 · 通知 · 账号
```

**允许**：

```text
云纹分隔线 · 印记图标
```

---

### 东方元素使用规范

| 元素 | 推荐度 | 说明 |
|------|--------|------|
| 东方留白 | ★★★★★ | 默认推荐 |
| 金石感 | ★★★★★ | 表格/卡片弱纹理 |
| 云纹 | ★★★★☆ | Header/Hero 限定 |
| 印记语言 | ★★★★☆ | 状态标签品牌化 |

| 元素 | 限制 | 说明 |
|------|------|------|
| 中国红 | ★★☆☆☆ | 仅危险操作 · 运营活动 |

**禁止**：

```text
卷轴 · 毛笔字体 · 仿古纸 · 婚庆红 · 国潮插画
```

---

## Workflow

### 组件落地流

```text
1. 读取 ADMIN_OPERATION_VISUAL_SYSTEM_V1 视觉宪法
2. 按 P0 → P1 → P2 优先级实现组件
3. 引用 Figma Ready tokens / ui-system
4. DATA_TABLE_V1 与 BUTTON_V1 优先验收
5. Dashboard 页面引用 WORK_CARD_V1 / METRIC_CARD_V1
6. Review Gate 对照本文件验收
```

---

## Runtime Mapping

| 组件规范 | 实现层 | 路径 |
|----------|--------|------|
| Design Tokens | Figma Ready | `apps/admin/shared/figma-ready/tokens.json` |
| CSS Variables | Figma Ready | `apps/admin/shared/figma-ready/tokens.css` |
| 组件库 | UI System | `apps/admin/shared/figma-ready/ui-system.js` |
| 共享壳层 | Backoffice Shell | `apps/admin/shared/backoffice-shell.js` |
| 平台后台 | Phase2 Pages | `apps/admin/platform-admin/` |

本文件为 **规范层** · 组件 ID 为设计与实现的统一引用键。

---

## Governance Rules

1. **术语**：禁止积分商城 / 打卡地图 / 愿力 / 归真 / 回应 / 祝由 等非官方词。
2. **P0 组件**：BUTTON_V1 · STATUS_TAG_V1 · WORK_CARD_V1 · DATA_TABLE_V1 不得跳过。
3. **DATA_TABLE_V1**：禁止大面积纹理 · 祥云覆盖 · 仿古纸背景。
4. **SIDEBAR_V1**：禁止卷轴菜单 · 古籍菜单。
5. **东方元素**：遵循 ADMIN_OPERATION_VISUAL_SYSTEM_V1 的 70/15/10/5 构成比例。
6. **福印 ≠ 数字藏品 ≠ 信物**：组件文案与图标分离。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | P0 四组件规格完整 | 设计评审 |
| AC-2 | STATUS_TAG_V1 印记映射完整 | 产品评审 |
| AC-3 | DATA_TABLE_V1 禁止项明确 | 设计走查 |
| AC-4 | SIDEBAR_V1 / TOPBAR_V1 结构冻结 | 架构评审 |
| AC-5 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ADMIN_UI_COMPONENT_LIBRARY_V1: FROZEN
CURRENT_ACTIVE_COMPONENT_LIBRARY: ADMIN_UI_COMPONENT_LIBRARY_V1
READY_FOR_HIGH_FIDELITY_UI: YES
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
| V1-freeze | 2026-06-16 | 初版创建并冻结 · P0/P1/P2 组件 · SIDEBAR/TOPBAR · 东方元素规范 | Cursor |
