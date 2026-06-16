# ADMIN_OPERATION_VISUAL_SYSTEM_V1

# 运营后台视觉体系 V1 · 东方运营控制台

---

## Status

```yaml
document_id: ADMIN_OPERATION_VISUAL_SYSTEM_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Operations
priority: P1
current_active_visual_system: true
supersedes:
  - ADMIN_BLESSING_UI_GUIDELINE_V1
upstream:
  - docs/product/backoffice/BACKOFFICE_BLESSING_VISUAL_SYSTEM_V1.md
  - docs/product/backoffice/BACKOFFICE_DESIGN_SYSTEM_V1.md
  - docs/product/backoffice/BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1.md
index: docs/admin/ADMIN_INDEX_V1.md
```

---

## Purpose

统一 AR游伴 **全部运营后台** 的视觉语言、命名体系与文化心智。

后台视觉路线正式冻结为：

```text
东方运营控制台
（Oriental Operations Console）
```

不是标准 SaaS Admin · 也不是全站福文化化 · 实现 **运营效率优先的东方品牌识别**。

---

## Scope

### In Scope（适用范围）

- 平台后台
- 商家后台
- 景区后台
- 运营后台
- 活动后台

### Out of Scope（不适用范围）

- 用户前台
- 探索页
- 活动海报
- 景区宣传页
- miniapp C 端视觉（见 DUAL_HOME_VISUAL_SYSTEM_V1）
- 具体页面线框（见 ADMIN_OPERATION_DASHBOARD_SPEC_V1.1）

---

## Architecture

```text
ADMIN_OPERATION_VISUAL_SYSTEM_V1（视觉宪法 · 东方运营控制台）
        ↓
BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1（Design Tokens + 组件）
        ↓
Platform / Park / Merchant Admin Pages
        ↓
ADMIN_OPERATION_DASHBOARD_SPEC_V1.1（首页信息架构）
```

### 核心原则

| 维度 | 要求 |
|------|------|
| 东方化 | **是** · 但不能古风化 |
| 品牌感 | **是** · 但不能牺牲效率 |
| 文化表达 | **是** · 但不能降低可读性 |

### 视觉构成比例

| 成分 | 比例 |
|------|------|
| 现代企业级后台 | **70%** |
| 东方留白 | **15%** |
| 金石感 | **10%** |
| 云纹与印记语言 | **5%** |

**禁止反向配置**：

```text
50% 传统元素 + 50% 后台功能  ← 禁止
```

### 数据优先原则 · 权重

| 层级 | 内容 | 权重 |
|------|------|------|
| 第一层 | 运营效率 | **80%** |
| 第二层 | 品牌识别 | **15%** |
| 第三层 | 文化表达 | **5%** |

---

## Components

### 核心视觉语言

**允许**：

```text
云纹 · 金石感 · 拓片纹理 · 印记状态 · 东方留白 · 低饱和色彩
```

### 推荐主色

| Token | 名称 | 用途 |
|-------|------|------|
| Ink Cyan | 墨青 | 主背景层级 · 导航 |
| Slate Gray | 青灰 | 次级面板 · 边框 |
| Pine Green | 松石绿 | 成功态 · 正向指标 |
| Stone Gray | 金石灰 | 表格 · 数据区 |

### 辅助色

| Token | 名称 | 用途 |
|-------|------|------|
| Aged Gold | 旧金 | 印记 · 荣誉 · 高级指标 |
| Pale Jade | 浅玉色 | 卡片背景 · 留白区 |

### 中国红使用规则

**仅允许**：

```text
危险操作 · 重要提醒 · 活动运营
```

**禁止**：

```text
全站主色 · 大面积红色背景
```

> 历史 Token `Blessing Red (#C83A30)` 保留于 **活动运营模块** · 不得作为全站主色。

### 云纹体系

- **允许**：Header · Banner · 活动页顶部 · 透明度 5%–8%
- **禁止**：满屏祥云 · 大面积古风贴图

### 福文化使用规则

**允许**（限定模块）：

```text
活动系统 · 福印系统 · 接福活动 · 福礼体系 · 活动运营模块
```

**不允许**：

```text
全后台福文化化
```

### 状态标签语言

| 标准态 | 印记语言 |
|--------|----------|
| 已发布 | 已钤印 |
| 审核通过 | 已落印 |
| 已生效 | 已启封 |

### 命名映射

| 技术名 | 展示名 |
|--------|--------|
| Merchant Center | 福礼商家中心 |
| Coupon Center | 福礼中心 |
| Activity Center | 接福活动中心 |
| Reward Center | 福印中心 |
| Collection Center | 福册中心 |

技术字段（`merchant` / `coupon` / `activity`）可保留于 API / 数据层。

### 看板展示语言

```text
福礼商家 · 接福活动 · 福礼领取 · 福礼核销 · 福印获得
```

---

## Workflow

### 视觉落地流

```text
1. 读取本文件视觉宪法（东方运营控制台）
2. 确认 70/15/10/5 构成比例
3. 引用 Figma Ready tokens.json / tokens.css
4. 运营模块优先效率 · 活动模块可加强福文化表达
5. Dashboard 遵循 ADMIN_OPERATION_DASHBOARD_SPEC_V1.1
6. Review Gate 验收视觉一致性
```

### 升级路径

```text
ADMIN_BLESSING_UI_GUIDELINE_V1 [SUPERSEDED]
  → BACKOFFICE_BLESSING_VISUAL_SYSTEM_V1（产品层来源）
  → ADMIN_OPERATION_VISUAL_SYSTEM_V1（东方运营控制台 · FROZEN）
```

---

## Runtime Mapping

| 视觉规范 | 实现层 | 路径 |
|----------|--------|------|
| Design Tokens | Figma Ready | `apps/admin/shared/figma-ready/tokens.json` |
| CSS Variables | Figma Ready | `apps/admin/shared/figma-ready/tokens.css` |
| 组件库 | UI System | `apps/admin/shared/figma-ready/ui-system.js` |
| 平台后台 | Phase2 Pages | `apps/admin/platform-admin/` |
| 共享壳层 | Backoffice Shell | `apps/admin/shared/backoffice-shell.js` |

本文件为 **规范层** · 不直接映射代码文件。

---

## Governance Rules

### 禁止事项（P0）

```text
禁止卷轴菜单
禁止毛笔标题
禁止仿古纸背景
禁止满屏祥云
禁止婚庆红风格
禁止国潮海报风后台
禁止大面积纹理覆盖表格
```

### 通用规则

1. **术语**：禁止积分商城 / 打卡地图 / 愿力 / 归真 / 回应 / 祝由 等非官方词。
2. **语言层级**：L1 商业 / L2 产品 / L3 Canon · 后台默认 L2 · 活动页可 L1。
3. **福印 ≠ 数字藏品 ≠ 信物**：三者视觉与文案分离。
4. **权重**：80% 运营能力 · 15% 品牌识别 · 5% 文化表达。
5. 本文件 supersede `ADMIN_BLESSING_UI_GUIDELINE_V1` · 后者不再作为主规范引用。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 东方运营控制台定位明确 | 设计评审 |
| AC-2 | 70/15/10/5 构成比例已冻结 | 文档评审 |
| AC-3 | P0 禁止事项完整 | 设计走查 |
| AC-4 | 状态标签印记语言已定义 | 产品评审 |
| AC-5 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ADMIN_OPERATION_VISUAL_SYSTEM_V1: FROZEN
ADMIN_BLESSING_UI_GUIDELINE_V1: SUPERSEDED
CURRENT_ACTIVE_VISUAL_SYSTEM: ADMIN_OPERATION_VISUAL_SYSTEM_V1
READY_FOR_ADMIN_UI_DESIGN: YES
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS_WITH_MODIFICATION
review_score: 89
approved_for_admin_system: true
```

### 冻结结论

后台视觉路线正式冻结为 **东方运营控制台（Oriental Operations Console）**。

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · 自 BACKOFFICE_BLESSING 升级 · REVIEW | Cursor |
| V1.0-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 回退至 REVIEW | Cursor |
| V1-freeze | 2026-06-16 | 冻结为东方运营控制台 · 70/15/10/5 · P0 禁止项 · review_score 89 | Cursor |
