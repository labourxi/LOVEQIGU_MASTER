# ADMIN_HIGH_FIDELITY_UI_V1

# 运营后台高保真 UI 规范 V1

---

## Status

```yaml
document_id: ADMIN_HIGH_FIDELITY_UI_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Design System
priority: P1
current_active_high_fidelity_ui: true
upstream:
  - docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
  - docs/admin/design_system/ADMIN_UI_COMPONENT_LIBRARY_V1.md
  - docs/product/backoffice/BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1.md
index: docs/admin/ADMIN_INDEX_V1.md
```

---

## Purpose

将 `ADMIN_UI_COMPONENT_LIBRARY_V1` 组件规格升级为 **高保真 UI 规范**，定义像素级布局、间距、字体与组件拼装规则，供设计与前端实现对齐。

---

## Scope

### In Scope

- 1440 × 900 主画布 · 1920 × 1080 宽屏延展
- P0 / P1 组件高保真规格
- SIDEBAR_V1 · TOPBAR_V1 壳层
- 平台 / 景区 / 商家后台共用框架

### Out of Scope

- 活动层福文化视觉（见 ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1）
- 业务逻辑与 API
- 动效与微交互细则

---

## Architecture

```text
ADMIN_OPERATION_VISUAL_SYSTEM_V1（视觉宪法）
        ↓
ADMIN_UI_COMPONENT_LIBRARY_V1（组件库）
        ↓
ADMIN_HIGH_FIDELITY_UI_V1（高保真 UI · 本文件）
        ↓
BACKOFFICE_FIGMA_READY_UI_SYSTEM_V1（Token + 实现）
        ↓
ADMIN_REAL_SCREEN_PROTOTYPE_V1（真机屏原型）
```

---

## Components

### 画布与栅格

| 属性 | 规格 |
|------|------|
| 主画布 | 1440 × 900 |
| 内容区最大宽 | 1600px 居中 |
| 内容区内边距 | 24px |
| 栅格基准 | 4px |

### 壳层规格

#### SIDEBAR_V1

| 属性 | 规格 |
|------|------|
| 宽度 | 240px |
| 背景 | `#FFFFFF` |
| 菜单字号 | 14px |
| Active 态 | 金浅底 `#EBE0D4` + 左 3px 墨青线 |
| 分组标题 | 12px · `#9A8B7A` |

#### TOPBAR_V1

| 属性 | 规格 |
|------|------|
| 高度 | 56px |
| 背景 | `#FFFFFF` |
| 底边 | 1px `#E8E4DE` |
| 结构 | Logo 32×32 · 搜索 · 消息 · 通知 · 账号 |

### P0 组件像素规格

#### BUTTON_V1 · Primary

| 属性 | 规格 |
|------|------|
| 高度 | 36px |
| 内边距 | 0 16px |
| 圆角 | 8px |
| 背景 | 墨青 `#2A4A52` |
| 文字 | 14px · 白色 |

#### STATUS_TAG_V1

| 属性 | 规格 |
|------|------|
| 高度 | 24px |
| 内边距 | 0 8px |
| 圆角 | 8px |
| 字号 | 12px |

#### WORK_CARD_V1

| 属性 | 规格 |
|------|------|
| 最小高度 | 120px |
| 内边距 | 20px |
| 圆角 | 12px |
| 主数字 | 32px · tabular nums |

#### DATA_TABLE_V1

| 属性 | 规格 |
|------|------|
| 行高 | 48px |
| 单元格 padding | 12px 16px |
| 表头 | 12px · `#9A8B7A` |
| 行 hover | `#FAF9F7` |
| 分割线 | 1px `#E8E4DE` |

### 色彩 Token（高保真标注）

| Token | 值 | 用途 |
|-------|-----|------|
| `color.bg.page` | `#F7F5F0` | 页面背景 |
| `color.bg.panel` | `#FFFFFF` | 卡片 / 表格容器 |
| `color.text.primary` | `#2B2118` | 标题 / 主文字 |
| `color.text.secondary` | `#6F5D4D` | 描述 |
| `color.text.muted` | `#9A8B7A` | 表头 / placeholder |
| `color.border.default` | `#E8E4DE` | 分割线 |
| `color.accent.default` | `#2A4A52` | 墨青 · 主 CTA |
| `color.semantic.success` | `#2C7A4B` | 松石绿 · 成功 |
| `color.semantic.warning` | `#B26B1B` | 琥珀 · 待审 |
| `color.semantic.danger` | `#A4412B` | 朱砂 · 危险 |

---

## Runtime Mapping

| 高保真规范 | 实现层 | 路径 |
|------------|--------|------|
| Design Tokens | Figma Ready | `apps/admin/shared/figma-ready/tokens.json` |
| CSS Variables | Figma Ready | `apps/admin/shared/figma-ready/tokens.css` |
| 组件样式 | System CSS | `apps/admin/shared/figma-ready/system.css` |
| 组件拼装 | UI System | `apps/admin/shared/figma-ready/ui-system.js` |
| 示例页 | Figma Ready | `apps/admin/shared/figma-ready/overview.html` |

---

## Governance Rules

1. 高保真规格不得突破 `ADMIN_OPERATION_VISUAL_SYSTEM_V1` 的 70/15/10/5 构成比例。
2. DATA_TABLE_V1 禁止大面积纹理 · 祥云覆盖 · 仿古纸背景。
3. 活动模块可在后台活动页引用福印标签，但不得改变壳层主色体系。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | P0 组件像素规格完整 | 设计评审 |
| AC-2 | 壳层与 Token 对齐 Figma Ready | 前端走查 |
| AC-3 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ADMIN_HIGH_FIDELITY_UI_V1: FROZEN
CURRENT_ACTIVE_HIGH_FIDELITY_UI: ADMIN_HIGH_FIDELITY_UI_V1
READY_FOR_REAL_SCREEN_PROTOTYPE: YES
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
| V1-freeze | 2026-06-16 | 初版创建并冻结 · 高保真像素规格 | Cursor |
| V1-recovery | 2026-06-16 | DOCUMENT_RECOVERY_BATCH_V1 恢复 | Cursor |
