# AR_PRODUCT_INDEX_V1

# AR 产品文档索引 V1

```yaml
project: LOVEQIGU / AR游伴
module: AR Product Index
version: V1
status: ACTIVE
updated_at: 2026-06-16
review_batch: AR_INTERACTION_ARCHITECTURE_V1.1_REVISION
```

---

## CURRENT_ACTIVE_AR_ARCHITECTURE

```yaml
CURRENT_ACTIVE_AR_ARCHITECTURE: AR_INTERACTION_ARCHITECTURE_V1.1
CURRENT_ACTIVE_AR_ARCHITECTURE_STATUS: FROZEN
freeze_date: 2026-06-16
```

---

## 1. 已冻结文档（FROZEN）

### 1.1 AR_INTERACTION_ARCHITECTURE_V1.1

```yaml
filename: AR_INTERACTION_ARCHITECTURE_V1.1.md
path: docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
type: Interaction Architecture
version: V1.1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
review_score: 98
approved_for_runtime: true
supersedes: AR_INTERACTION_ARCHITECTURE_V1
description: C 端 AR 交互架构 · Layer 0 导航 · ARRIVED · alignment_overlay · Reveal Types · Activity Flow
fixes:
  - FIX-01 Location Navigation
  - FIX-02 ARRIVED
  - FIX-03 alignment_overlay
  - FIX-04 Reveal Types
  - FIX-05 Activity Completion Flow
  - FIX-06 Navigation → AR Flow
  - FIX-07 AC-6–AC-10
```

---

## 2. 已替代文档（SUPERSEDED）

### 2.1 AR_INTERACTION_ARCHITECTURE_V1

```yaml
filename: AR_INTERACTION_ARCHITECTURE_V1.md
path: docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.md
type: Interaction Architecture
version: V1
status: SUPERSEDED
superseded_by: AR_INTERACTION_ARCHITECTURE_V1.1
updated_at: 2026-06-07
description: V1 初稿 · 已被 V1.1 替代 · 保留只读参考
note: 保留 · 不删除
```

---

## 3. 下游

```yaml
downstream:
  - docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
```

---

## 4. 文档关系

```text
AR_PRODUCT_INDEX_V1
│
├── AR_INTERACTION_ARCHITECTURE_V1.1  [FROZEN] ← CURRENT_ACTIVE_AR_ARCHITECTURE
│   └── C 端 AR 交互架构（V1.1 · 已冻结）
│       └── → AR Factory 技术栈
│
└── AR_INTERACTION_ARCHITECTURE_V1     [SUPERSEDED]
    └── 历史版本 · 只读参考 · 保留
```
