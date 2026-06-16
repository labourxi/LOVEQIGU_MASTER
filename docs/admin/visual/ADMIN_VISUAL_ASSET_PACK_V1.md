# ADMIN_VISUAL_ASSET_PACK_V1

# 运营后台统一视觉资产包 V1

---

## Status

```yaml
document_id: ADMIN_VISUAL_ASSET_PACK_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Design System
priority: P1
current_active_admin_asset_pack: true
upstream:
  - docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
  - docs/admin/visual/ADMIN_HIGH_FIDELITY_UI_V1.md
index: docs/admin/ADMIN_INDEX_V1.md
```

---

## Purpose

建立 **AR游伴运营后台统一视觉资产包**，服务于平台后台、景区后台、商家后台及运营后台的东方运营控制台视觉落地。

---

## Scope

### 服务范围

- 平台后台
- 景区后台
- 商家后台
- 运营后台
- 活动后台（壳层与表格区 · 非活动专题页）

### 不适用范围

- 用户前台 · 探索地图 · AR 体验页
- 活动专题页福文化资产（见 ACTIVITY_VISUAL_ASSET_PACK_V1）

---

## Components

### ASSET-01 · OPERATION_SEAL_LIBRARY_V1

印记状态图标库（后台）

| 类型 |
|------|
| 草稿 |
| 待审 |
| 已落印 |
| 已钤印 |
| 已启封 |
| 已封存 |

**要求**：SVG 优先 · 单色 · 双色 · 16px / 20px / 24px 三档

---

### ASSET-02 · CLOUD_PATTERN_LIBRARY_V1

云纹素材库（后台弱装饰）

| 类型 |
|------|
| Header 云纹 |
| Hero 云纹 |
| 分隔云纹 |

**透明度**：≤ 5%

---

### ASSET-03 · STONE_TEXTURE_LIBRARY_V1

金石感纹理库

| 类型 |
|------|
| 表格弱纹理 |
| 卡片弱纹理 |
| 拓片纹理 |

**透明度**：≤ 3% · 禁止覆盖表格内容区

---

### ASSET-04 · STATUS_BADGE_LIBRARY_V1

状态标签资产

| 语义 | 展示态 |
|------|--------|
| Draft | 草稿 |
| Review | 待审 |
| Approved | 已落印 |
| Published | 已钤印 |
| Active | 已启封 |
| Disabled | 已封存 |

---

### ASSET-05 · SIDEBAR_ICON_LIBRARY_V1

侧栏导航图标库

| 图标 |
|------|
| Dashboard |
| 景区管理 |
| 商家管理 |
| 活动中心 |
| 探索点 |
| 内容工厂 |
| AR 工厂 |
| 数字藏品 |
| 工单系统 |
| 系统设置 |

**风格**：线性图标 · 20px · 墨青 / 青灰

---

### ASSET-06 · DASHBOARD_HERO_TEXTURE_V1

仪表盘 Hero 区纹理

| 类型 |
|------|
| 极淡云纹 |
| 极淡金石纹 |

**透明度**：≤ 5% · 低饱和东方色

---

### ASSET-07 · EMPTY_STATE_LIBRARY_V1

空状态插画资产

**允许**：云纹 · 淡墨 · 金石纹

**禁止**：国潮插画 · 大幅装饰画

---

### ASSET-08 · TABLE_DECORATION_LIBRARY_V1

表格装饰资产（极弱）

| 类型 |
|------|
| 表头弱分隔 |
| 行尾弱印记 |

**禁止**：祥云覆盖 · 仿古纸背景 · 大面积纹理

---

## Visual Principles

### 后台资产允许

墨青 · 松石绿 · 金石感 · 云纹 · 印记语言 · 东方留白

### 比例建议（与视觉宪法对齐）

| 成分 | 比例 |
|------|------|
| 现代企业级后台 | 70% |
| 东方留白 | 15% |
| 金石感 | 10% |
| 云纹与印记语言 | 5% |

### 禁止事项

```text
禁止卷轴 · 毛笔字体 · 仿古纸 · 婚庆红 · 国潮插画
禁止满屏祥云 · 大面积纹理覆盖表格
```

---

## Governance Rules

1. 后台资产包与活动资产包分离 · 不得混用福文化海报模板。
2. 中国红仅用于危险操作与活动运营提醒，不得作为资产包主色。
3. 福印素材为状态品牌化表达，不等于数字藏品或信物图标。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | ASSET-01 至 ASSET-08 结构完整 | 设计评审 |
| AC-2 | 70/15/10/5 比例与禁止项对齐视觉宪法 | 产品评审 |
| AC-3 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ADMIN_VISUAL_ASSET_PACK_V1: FROZEN
CURRENT_ACTIVE_ADMIN_ASSET_PACK: ADMIN_VISUAL_ASSET_PACK_V1
READY_FOR_ADMIN_UI_IMPLEMENTATION: YES
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
| V1-freeze | 2026-06-16 | 初版创建并冻结 · 8 类后台资产库 | Cursor |
| V1-recovery | 2026-06-16 | DOCUMENT_RECOVERY_BATCH_V1 恢复 | Cursor |
