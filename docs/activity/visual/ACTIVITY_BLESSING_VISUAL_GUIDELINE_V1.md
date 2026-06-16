# ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1

# 活动系统福文化视觉规范 V1

---

## Status

```yaml
document_id: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
version: V1
status: FROZEN
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Operations
priority: P1
current_active_activity_visual_system: true
repositioned_from: ADMIN_BLESSING_UI_GUIDELINE_V1
index: docs/activity/ACTIVITY_INDEX_V1.md
```

---

## Purpose

根据会话 C 专项审查结果，`ADMIN_BLESSING_UI_GUIDELINE_V1` 不再作为后台总体视觉规范，调整为 **活动系统专项视觉规范**。

建立 AR游伴 **福文化活动系统** 的统一视觉语言，服务于接福、集福、纳福、福礼、节庆及数字藏品赐福活动。

---

## Scope

### 适用范围

- 接福活动
- 集福活动
- 纳福活动
- 福礼活动
- 节庆活动
- 数字藏品赐福活动

### 不适用范围

- 平台后台
- 景区后台
- 商家后台
- AR 工厂
- 内容工厂
- 探索地图
- AR 体验页

---

## Architecture

```text
产品层 → 东方探索体系
活动层 → 福文化体系（本文件）
后台层 → 东方运营控制台（ADMIN_OPERATION_VISUAL_SYSTEM_V1）
```

### 视觉定位

福文化活动系统

关键词：接福 · 集福 · 纳福 · 福印 · 福礼 · 福册 · 吉祥 · 祝福 · 节庆

---

## Components

### 视觉元素

**允许**：

```text
福印 · 云纹 · 中国红 · 旧金色 · 玉色 · 印记纹样 · 节庆视觉元素
```

**限制**：

```text
中国红 ≤ 25%
```

**禁止**：

```text
婚庆风 · 国潮海报风 · 满版福字 · 大面积纹样覆盖 · 复杂传统图腾
```

### 福印体系

| 业务状态 | 印记语言 |
|----------|----------|
| 审核通过 | 已落印 |
| 发布成功 | 已钤印 |
| 活动开始 | 已启封 |
| 活动结束 | 已归册 |

### 福礼体系

允许：福礼券 · 福礼礼包 · 福礼奖励 · 福礼兑换

### 福册体系

允许：个人福册 · 活动福册 · 年度福册

### 数字藏品体系

允许：赐福 · 纳福 · 福缘 · 福册收藏

### 活动中心视觉

允许：云纹 · 福印 · 中国红 · 节庆主题视觉

### 活动专题页

允许：接福活动专题 · 集福活动专题 · 纳福活动专题

### 后台活动模块

允许：活动状态福印化 · 活动标签福印化 · 活动专题视觉化

---

## Workflow

### 后台整体体系

后台整体视觉遵循：

```text
docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
```

福文化 **仅属于活动运营层**，不得渗透至全后台视觉宪法。

---

## Governance Rules

1. **术语**：使用官方术语 · 禁止积分商城 / 打卡地图 / 愿力 / 归真 / 回应 / 祝由。
2. **福印 ≠ 数字藏品 ≠ 信物**：三者视觉与文案分离。
3. **中国红**：活动层允许 · 占比 ≤ 25% · 不得作为后台主色。
4. **历史文档**：`ADMIN_BLESSING_UI_GUIDELINE_V1` 状态 SUPERSEDED · 保留 · 不删除。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 活动专项定位明确 · 与后台视觉分离 | 产品评审 |
| AC-2 | 福印状态映射完整 | 设计评审 |
| AC-3 | 禁止项与比例限制明确 | 设计走查 |
| AC-4 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |

```yaml
ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1: FROZEN
CURRENT_ACTIVE_ACTIVITY_VISUAL_SYSTEM: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
READY_FOR_ACTIVITY_DESIGN: YES
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS_WITH_REPOSITION
approved_for_activity_system: true
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1-freeze | 2026-06-16 | 自 ADMIN_BLESSING_UI_GUIDELINE_V1 重定位并冻结 | Cursor |
| V1-recovery | 2026-06-16 | DOCUMENT_RECOVERY_BATCH_V1 恢复 | Cursor |
