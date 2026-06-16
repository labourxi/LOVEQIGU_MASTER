# ADMIN_INDEX_V1

# 运营后台文档索引 V1

```yaml
project: LOVEQIGU / AR游伴
module: Admin Documentation Index
version: V1
status: ACTIVE
updated_at: 2026-06-16
review_batch: DOCUMENT_RECOVERY_BATCH_V1
```

---

## CURRENT_ACTIVE

```yaml
CURRENT_ACTIVE_VISUAL_SYSTEM: ADMIN_OPERATION_VISUAL_SYSTEM_V1
CURRENT_ACTIVE_VISUAL_SYSTEM_STATUS: FROZEN
CURRENT_ACTIVE_COMPONENT_LIBRARY: ADMIN_UI_COMPONENT_LIBRARY_V1
CURRENT_ACTIVE_COMPONENT_LIBRARY_STATUS: FROZEN
CURRENT_ACTIVE_DASHBOARD: ADMIN_OPERATION_DASHBOARD_SPEC_V1.1
CURRENT_ACTIVE_DASHBOARD_STATUS: REVIEW
CURRENT_ACTIVE_HIGH_FIDELITY_UI: ADMIN_HIGH_FIDELITY_UI_V1
CURRENT_ACTIVE_HIGH_FIDELITY_UI_STATUS: FROZEN
CURRENT_ACTIVE_ADMIN_ASSET_PACK: ADMIN_VISUAL_ASSET_PACK_V1
CURRENT_ACTIVE_ADMIN_ASSET_PACK_STATUS: FROZEN
CURRENT_ACTIVE_ADMIN_PROTOTYPE: ADMIN_REAL_SCREEN_PROTOTYPE_V1
CURRENT_ACTIVE_ADMIN_PROTOTYPE_STATUS: FROZEN
freeze_date: 2026-06-16
```

---

## 1. 已冻结文档（FROZEN）

### 1.1 ADMIN_OPERATION_VISUAL_SYSTEM_V1

```yaml
filename: ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
path: docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md
type: Visual System
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS_WITH_MODIFICATION
review_score: 89
approved_for_admin_system: true
supersedes: ADMIN_BLESSING_UI_GUIDELINE_V1
description: 东方运营控制台 · 70/15/10/5 构成 · 墨青/松石绿主色 · 印记状态语言 · P0 禁止项
visual_route: Oriental Operations Console
```

### 1.2 ADMIN_UI_COMPONENT_LIBRARY_V1

```yaml
filename: ADMIN_UI_COMPONENT_LIBRARY_V1.md
path: docs/admin/design_system/ADMIN_UI_COMPONENT_LIBRARY_V1.md
type: Component Library
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_admin_ui: true
description: 后台统一组件库 · ACTION_FIRST · P0/P1/P2 组件 · SIDEBAR/TOPBAR · 东方元素规范
upstream: ADMIN_OPERATION_VISUAL_SYSTEM_V1
includes:
  - BUTTON_V1
  - STATUS_TAG_V1
  - WORK_CARD_V1
  - DATA_TABLE_V1
  - METRIC_CARD_V1
  - FILTER_BAR_V1
  - ALERT_CARD_V1
  - SIDEBAR_V1
  - TOPBAR_V1
```

### 1.3 ADMIN_HIGH_FIDELITY_UI_V1

```yaml
filename: ADMIN_HIGH_FIDELITY_UI_V1.md
path: docs/admin/visual/ADMIN_HIGH_FIDELITY_UI_V1.md
type: High Fidelity UI
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_admin_ui: true
description: 高保真像素规格 · P0 组件 · SIDEBAR/TOPBAR 壳层 · Token 对齐
upstream: ADMIN_UI_COMPONENT_LIBRARY_V1
```

### 1.4 ADMIN_VISUAL_ASSET_PACK_V1

```yaml
filename: ADMIN_VISUAL_ASSET_PACK_V1.md
path: docs/admin/visual/ADMIN_VISUAL_ASSET_PACK_V1.md
type: Visual Asset Pack
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_admin_ui: true
description: 后台统一视觉资产包 · 印记/云纹/金石/侧栏图标 · 8 类资产库
upstream: ADMIN_OPERATION_VISUAL_SYSTEM_V1
includes:
  - OPERATION_SEAL_LIBRARY_V1
  - CLOUD_PATTERN_LIBRARY_V1
  - STONE_TEXTURE_LIBRARY_V1
  - STATUS_BADGE_LIBRARY_V1
  - SIDEBAR_ICON_LIBRARY_V1
  - DASHBOARD_HERO_TEXTURE_V1
  - EMPTY_STATE_LIBRARY_V1
  - TABLE_DECORATION_LIBRARY_V1
```

### 1.5 ADMIN_REAL_SCREEN_PROTOTYPE_V1

```yaml
filename: ADMIN_REAL_SCREEN_PROTOTYPE_V1.md
path: docs/admin/prototype/ADMIN_REAL_SCREEN_PROTOTYPE_V1.md
type: Real Screen Prototype
version: V1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
approved_for_admin_ui: true
description: 5 屏真机原型规格 · Platform/Activity/Review/Merchant/Park
upstream: ADMIN_HIGH_FIDELITY_UI_V1
```

---

## 2. 待审查文档（REVIEW）

### 2.1 ADMIN_OPERATION_DASHBOARD_SPEC_V1.1

```yaml
filename: ADMIN_OPERATION_DASHBOARD_SPEC_V1.1.md
path: docs/admin/dashboard/ADMIN_OPERATION_DASHBOARD_SPEC_V1.1.md
type: Dashboard Spec
status: REVIEW
updated_at: 2026-06-07
description: 运营首页仪表盘 · ACTION_FIRST · TODAY_WORK_PANEL · QUICK_ACTION · ROLE_HOME
includes:
  - ACTION_FIRST_RULE
  - TODAY_WORK_PANEL
  - QUICK_ACTION_FIRST_RULE
  - ROLE_HOME_MODE
```

---

## 3. 已替代文档（SUPERSEDED）

### 3.1 ADMIN_BLESSING_UI_GUIDELINE_V1

```yaml
filename: ADMIN_BLESSING_UI_GUIDELINE_V1
status: SUPERSEDED
superseded_by: ADMIN_OPERATION_VISUAL_SYSTEM_V1
note: 不再保留为主文件 · 保留 · 不删除
```

---

## 4. 关联文档

```yaml
filename: ADMIN_CONTENT_MODEL_V1.md
path: docs/admin/ADMIN_CONTENT_MODEL_V1.md
type: Content Model
status: REGISTERED
```

```yaml
filename: BACKOFFICE_BLESSING_VISUAL_SYSTEM_V1.md
path: docs/product/backoffice/BACKOFFICE_BLESSING_VISUAL_SYSTEM_V1.md
type: Visual System (Backoffice)
status: APPROVED
note: 上游来源 · 已由 ADMIN_OPERATION_VISUAL_SYSTEM_V1 统一升级并冻结
```

---

## 5. 文档关系

```text
ADMIN_INDEX_V1
│
├── ADMIN_OPERATION_VISUAL_SYSTEM_V1    [FROZEN] ← CURRENT_ACTIVE_VISUAL_SYSTEM
│   └── 东方运营控制台（Oriental Operations Console）
│
├── ADMIN_UI_COMPONENT_LIBRARY_V1       [FROZEN] ← CURRENT_ACTIVE_COMPONENT_LIBRARY
│   └── P0/P1/P2 组件 · SIDEBAR · TOPBAR
│
├── ADMIN_HIGH_FIDELITY_UI_V1         [FROZEN] ← CURRENT_ACTIVE_HIGH_FIDELITY_UI
│   └── 高保真像素规格
│
├── ADMIN_VISUAL_ASSET_PACK_V1        [FROZEN] ← CURRENT_ACTIVE_ADMIN_ASSET_PACK
│   └── 8 类后台视觉资产库
│
├── ADMIN_REAL_SCREEN_PROTOTYPE_V1    [FROZEN] ← CURRENT_ACTIVE_ADMIN_PROTOTYPE
│   └── 5 屏真机原型
│
└── ADMIN_OPERATION_DASHBOARD_SPEC_V1.1 [REVIEW] ← CURRENT_ACTIVE_DASHBOARD
    └── 首页仪表盘规格
```
