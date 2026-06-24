# ADMIN_BLESSING_UI_GUIDELINE_V1

# 后台福文化 UI 规范 V1（已替代）

---

## Status

```yaml
document_id: ADMIN_BLESSING_UI_GUIDELINE_V1
version: V1
status: SUPERSEDED
superseded_by: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
superseded_date: 2026-06-16
updated_at: 2026-06-16
owner: Product / Operations
priority: P1
active: false
index: docs/admin/ADMIN_INDEX_V1.md
```

---

## Status Notice

本文件已完成历史使命。

项目视觉体系演进后：

福文化体系被重新定位为：

**活动运营视觉体系**

而非：

**后台总体视觉体系**。

因此：

`ADMIN_BLESSING_UI_GUIDELINE_V1` 不再作为当前生效规范。

---

## Replacement

### 替代关系

```yaml
CURRENT_ACTIVE_ADMIN_VISUAL_SYSTEM: ADMIN_OPERATION_VISUAL_SYSTEM_V1
CURRENT_ACTIVE_ACTIVITY_VISUAL_SYSTEM: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
```

| 层级 | 当前生效规范 | 路径 |
|------|--------------|------|
| 后台视觉宪法 | `ADMIN_OPERATION_VISUAL_SYSTEM_V1` | `docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md` |
| 活动福文化视觉 | `ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1` | `docs/activity/visual/ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1.md` |

福文化内容继承方：`ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1`

后台总体视觉继承方：`ADMIN_OPERATION_VISUAL_SYSTEM_V1`

---

## Architecture

### 视觉体系分层

```text
产品层
  ↓
东方探索体系

活动层
  ↓
福文化体系（ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1）

后台层
  ↓
东方运营控制台（ADMIN_OPERATION_VISUAL_SYSTEM_V1）
```

---

## Historical Note

本文件曾定义后台福文化 UI 方向，其福文化表达已由 `ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1` 承接；后台壳层与运营控制台视觉由 `ADMIN_OPERATION_VISUAL_SYSTEM_V1` 统一冻结。

**禁止**将本文件作为当前设计或实现的引用源。

---

## Superseded Record

```yaml
date: 2026-06-16
reason: 福文化从后台主视觉体系迁移至活动视觉体系
replacement: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
admin_visual_successor: ADMIN_OPERATION_VISUAL_SYSTEM_V1
retention: 保留 · 不删除
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1 | 2026-06-07 | 初版（后台福文化 UI 规范） | Cursor |
| V1-superseded | 2026-06-16 | 标记 SUPERSEDED · 福文化迁移至活动体系 | Cursor |

```yaml
ADMIN_BLESSING_UI_GUIDELINE_V1: SUPERSEDED
ADMIN_BLESSING_UI_GUIDELINE_V1_SUPERSEDED: YES
```
