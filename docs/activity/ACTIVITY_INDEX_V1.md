# ACTIVITY_INDEX_V1

# 活动系统文档索引 V1

```yaml
project: LOVEQIGU / AR游伴
module: Activity Documentation Index
version: V1
status: ACTIVE
updated_at: 2026-06-16
review_batch: DOCUMENT_RECOVERY_BATCH_V1
```

---

## CURRENT_ACTIVE

```yaml
CURRENT_ACTIVE_ACTIVITY_VISUAL_SYSTEM: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
CURRENT_ACTIVE_ACTIVITY_VISUAL_SYSTEM_STATUS: FROZEN
CURRENT_ACTIVE_ACTIVITY_ASSET_PACK: ACTIVITY_VISUAL_ASSET_PACK_V1
CURRENT_ACTIVE_ACTIVITY_ASSET_PACK_STATUS: FROZEN
freeze_date: 2026-06-16
```

---

## 1. 已冻结文档（FROZEN）

### 1.1 ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1

```yaml
filename: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1.md
path: docs/activity/visual/ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1.md
type: Visual Guideline
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS_WITH_REPOSITION
approved_for_activity_system: true
repositioned_from: ADMIN_BLESSING_UI_GUIDELINE_V1
description: 活动系统福文化视觉规范 · 接福/集福/纳福/福礼/节庆/数字藏品赐福
```

### 1.2 ACTIVITY_VISUAL_ASSET_PACK_V1

```yaml
filename: ACTIVITY_VISUAL_ASSET_PACK_V1.md
path: docs/activity/visual/ACTIVITY_VISUAL_ASSET_PACK_V1.md
type: Visual Asset Pack
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_activity_system: true
description: 活动系统统一视觉资产包 · 8 类资产库 · 福印/云纹/海报/福册/数字藏品赐福
upstream: ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1
includes:
  - BLESSING_SEAL_LIBRARY_V1
  - BLESSING_CLOUD_LIBRARY_V1
  - BLESSING_PATTERN_LIBRARY_V1
  - BLESSING_BADGE_LIBRARY_V1
  - ACTIVITY_HERO_LIBRARY_V1
  - ACTIVITY_POSTER_LIBRARY_V1
  - BLESSING_COLLECTION_LIBRARY_V1
  - DIGITAL_COLLECTION_BLESSING_LIBRARY_V1
```

---

## 2. 关联文档

```yaml
filename: ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
path: docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
type: Visual System (Admin)
status: FROZEN
note: 后台整体视觉宪法 · 活动模块引用但不替代本索引文档
```

---

## 3. 文档关系

```text
ACTIVITY_INDEX_V1
│
├── ACTIVITY_BLESSING_VISUAL_GUIDELINE_V1  [FROZEN] ← CURRENT_ACTIVE_ACTIVITY_VISUAL_SYSTEM
│   └── 福文化活动系统视觉规范
│
└── ACTIVITY_VISUAL_ASSET_PACK_V1          [FROZEN] ← CURRENT_ACTIVE_ACTIVITY_ASSET_PACK
    └── 8 类活动视觉资产库
```
