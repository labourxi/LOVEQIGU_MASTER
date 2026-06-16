# ACTIVITY_VISUAL_ASSET_PACK_V1

# 活动系统统一视觉资产包 V1

---

## Status

```yaml
document_id: ACTIVITY_VISUAL_ASSET_PACK_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Operations
priority: P1
current_active_activity_asset_pack: true
upstream:
  - docs/activity/visual/ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1.md
index: docs/activity/ACTIVITY_INDEX_V1.md
```

---

## Purpose

建立 **AR游伴活动系统统一视觉资产包**，服务于接福、集福、纳福、福礼、节庆及数字藏品赐福活动。

---

## Scope

### 服务范围

- 接福活动
- 集福活动
- 纳福活动
- 福礼活动
- 节庆活动
- 数字藏品赐福活动

---

## Components

### ASSET-01 · BLESSING_SEAL_LIBRARY_V1

福印素材库

| 类型 |
|------|
| 已落印 |
| 已钤印 |
| 已启封 |
| 已归册 |
| 待赐福 |
| 待领取 |
| 待集齐 |

**要求**：SVG 优先 · 单色版本 · 双色版本 · 深色模式版本

---

### ASSET-02 · BLESSING_CLOUD_LIBRARY_V1

云纹素材库

| 类型 |
|------|
| 角落云纹 |
| 顶部云纹 |
| 边框云纹 |
| 连续云纹 |

**透明度**：5% 以内

---

### ASSET-03 · BLESSING_PATTERN_LIBRARY_V1

活动纹样库

| 类型 |
|------|
| 福册纹样 |
| 印记纹样 |
| 星图纹样 |
| 卷册纹样 |

**禁止**：复杂传统图腾 · 宗教图案 · 大面积纹样铺满

---

### ASSET-04 · BLESSING_BADGE_LIBRARY_V1

活动徽章库

| 类型 |
|------|
| 首次接福 |
| 集福达人 |
| 纳福达人 |
| 活动完成 |
| 全福达成 |

**风格**：现代徽章 · 非游戏奖章

---

### ASSET-05 · ACTIVITY_HERO_LIBRARY_V1

活动头图区

| 类型 |
|------|
| 接福活动 |
| 集福活动 |
| 纳福活动 |
| 中秋活动 |
| 春节活动 |

**要求**：运营活动风格 · 可替换标题 · 可替换时间 · 可替换景区

---

### ASSET-06 · ACTIVITY_POSTER_LIBRARY_V1

活动海报模板

| 尺寸 |
|------|
| 1080 × 1920 |
| 1080 × 1350 |
| 750 × 1334 |

**支持**：微信 · 朋友圈 · 小红书 · 景区海报

---

### ASSET-07 · BLESSING_COLLECTION_LIBRARY_V1

福册资产

| 类型 |
|------|
| 空福册 |
| 部分完成 |
| 全部完成 |
| 年度福册 |

---

### ASSET-08 · DIGITAL_COLLECTION_BLESSING_LIBRARY_V1

数字藏品赐福资产

| 类型 |
|------|
| 赐福成功 |
| 纳福成功 |
| 福缘达成 |
| 收藏完成 |

---

## Visual Principles

### 活动系统允许

中国红 · 旧金色 · 云纹 · 福印 · 节庆元素

### 比例建议

| 成分 | 比例 |
|------|------|
| 现代运营活动 | 75% |
| 福文化表达 | 25% |

### 禁止事项

```text
禁止婚庆风 · 禁止国潮海报风 · 禁止满版福字
禁止宗教化 · 禁止仙侠化 · 禁止游戏奖励风
```

---

## Governance Rules

1. 资产包仅用于 **活动层** · 不得用于后台控制台主视觉。
2. 福印素材与后台印记状态语言对齐，但视觉表达可加强福文化。
3. 数字藏品资产与信物（Relic）资产分离。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | ASSET-01 至 ASSET-08 结构完整 | 设计评审 |
| AC-2 | 视觉原则与禁止项明确 | 产品评审 |
| AC-3 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ACTIVITY_VISUAL_ASSET_PACK_V1: FROZEN
CURRENT_ACTIVE_ACTIVITY_ASSET_PACK: ACTIVITY_VISUAL_ASSET_PACK_V1
READY_FOR_ACTIVITY_UI_DESIGN: YES
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_activity_system: true
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1-freeze | 2026-06-16 | 初版创建并冻结 · 8 类资产库 | Cursor |
| V1-recovery | 2026-06-16 | DOCUMENT_RECOVERY_BATCH_V1 恢复 | Cursor |
