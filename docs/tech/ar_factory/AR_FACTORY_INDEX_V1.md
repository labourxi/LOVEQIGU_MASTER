# AR_FACTORY_INDEX_V1

# AR Factory 文档索引 V1

```yaml
project: LOVEQIGU / AR游伴
module: AR Factory Index
version: V1
status: ACTIVE
updated_at: 2026-06-18
review_batch: CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1_FREEZE
```

---

## CURRENT_ACTIVE

```yaml
CURRENT_ACTIVE_AUTOGEN_PIPELINE: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
CURRENT_ACTIVE_AUTOGEN_PIPELINE_STATUS: FROZEN
CURRENT_ACTIVE_RUNTIME_SCHEMA: AR_FACTORY_RUNTIME_SCHEMA_V1.1
CURRENT_ACTIVE_RUNTIME_SCHEMA_STATUS: FROZEN
freeze_date: 2026-06-16
```

---

## 1. 已冻结文档（FROZEN）

### 1.1 AR_FACTORY_RUNTIME_SCHEMA_V1.1

```yaml
filename: AR_FACTORY_RUNTIME_SCHEMA_V1.1.md
path: docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.1.md
type: Runtime Schema
version: V1.1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
review_score: 91
approved_for_runtime: true
supersedes: AR_FACTORY_RUNTIME_SCHEMA_V1
description: 双层 Factory/Runtime Package · ar_entity · ar_guidance · alignment_overlay · AR_RUNTIME_FLOW
review_report: docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW.md
```

### 1.2 LANDMARK_AR_AUTOGEN_PIPELINE_V1.1

```yaml
filename: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1.md
path: docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.1.md
type: Pipeline
version: V1.1
status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
review_score: 94
approved_for_runtime: true
priority: P0
supersedes: LANDMARK_AR_AUTOGEN_PIPELINE_V1
description: 地标 AR 自动生成流水线 · S4 AR_TYPE · S6.5 ALIGNMENT · factory_package · publish_build
fixes: FIX-01–FIX-12
upstream: AR_INTERACTION_ARCHITECTURE_V1.1 · AR_FACTORY_RUNTIME_SCHEMA_V1.1
review_report: docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW.md
note: 当前项目首个进入工程验证阶段的自动化生产线
```

### 1.3 AR_VIRAL_ENGINE_POSITIONING_V1

```yaml
filename: AR_VIRAL_ENGINE_POSITIONING_V1.md
path: docs/product/ar/AR_VIRAL_ENGINE_POSITIONING_V1.md
type: Product Strategy
status: FROZEN
priority: P0
module: Product Strategy
description: 定义AR显现体验为AR游伴传播引擎（AR Viral Engine），明确传播飞轮与商业飞轮双体系。
```

### 1.4 CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1

```yaml
filename: CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1.md
path: docs/product/ar_factory/archetype/CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1.md
type: Cultural Archetype Library
version: V1
status: FROZEN
freeze_date: 2026-06-18
priority: P0
owner: ART / PRODUCT
description: 中国文化原型库 · 地标→文化原型→AR显现→Runtime Package 核心知识层 · CULTURAL_ARCHETYPE_ENGINE
engine_id: CULTURAL_ARCHETYPE_ENGINE
upstream: AR_VIRAL_ENGINE_POSITIONING_V1 · LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
```

### 1.5 CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1

```yaml
filename: CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md
path: docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md
type: Visual Bible
version: V1
status: FROZEN
freeze_date: 2026-06-18
priority: P0
owner: ART
description: 中国文化原型视觉圣经 · 统一 AR Factory · AI生图 · Lottie · Runtime 视觉标准
upstream: CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1 · ART_BIBLE_V1 · AR_VIRAL_ENGINE_POSITIONING_V1
```

### 1.2.1 LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW

```yaml
filename: LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW.md
path: docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW.md
type: Review Report
status: RESOLVED
review_date: 2026-06-16
target: LANDMARK_AR_AUTOGEN_PIPELINE_V1
result: PASS_WITH_MODIFICATION
resolved_by: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
```

### 1.1.1 AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW

```yaml
filename: AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW.md
path: docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW.md
type: Review Report
status: RESOLVED
resolved_by: AR_FACTORY_RUNTIME_SCHEMA_V1.1
```

---

## 2. 待审查文档（REVIEW）

### 2.1 AR_FACTORY_ARCHITECTURE_V1

```yaml
filename: AR_FACTORY_ARCHITECTURE_V1.md
path: docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
type: Architecture
status: REVIEW
updated_at: 2026-06-07
description: AR Factory 子系统分层 · 技术路线 · Runtime 边界
```

### 2.2 AR_TEMPLATE_LIBRARY_V1

```yaml
filename: AR_TEMPLATE_LIBRARY_V1.md
path: docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
type: Template Library
status: REVIEW
updated_at: 2026-06-07
description: Phase1 Template Driven 模板清单 · reveal_type 以 Schema V1.1 Mapping 为准
```

---

## 3. 已替代文档（SUPERSEDED）

### 3.1 AR_FACTORY_RUNTIME_SCHEMA_V1

```yaml
filename: AR_FACTORY_RUNTIME_SCHEMA_V1.md
path: docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.md
status: SUPERSEDED
superseded_by: AR_FACTORY_RUNTIME_SCHEMA_V1.1
note: 保留 · 不删除
```

### 3.2 LANDMARK_AR_AUTOGEN_PIPELINE_V1

```yaml
filename: LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
path: docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
type: Pipeline
version: V1
status: SUPERSEDED
superseded_by: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
updated_at: 2026-06-07
description: V1 初稿 · 已被 V1.1 替代 · 保留只读参考
note: 保留 · 不删除
```

---

## 4. 关联文档

```yaml
filename: LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1.md
path: docs/product/ar_factory/LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1.md
type: Phase Freeze
status: APPROVED
```

---

## 5. 文档关系

```text
AR_FACTORY_INDEX_V1
│
├── AR_FACTORY_RUNTIME_SCHEMA_V1.1          [FROZEN] ← CURRENT_ACTIVE_RUNTIME_SCHEMA
│
├── LANDMARK_AR_AUTOGEN_PIPELINE_V1.1       [FROZEN] ← CURRENT_ACTIVE_AUTOGEN_PIPELINE
│   └── LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW  [RESOLVED]
│
├── AR_VIRAL_ENGINE_POSITIONING_V1          [FROZEN · P0 · Product Strategy]
│
├── CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1   [FROZEN · P0 · Cultural Archetype]
│   └── CULTURAL_ARCHETYPE_ENGINE
│
├── CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1      [FROZEN · P0 · Visual Bible]
│
├── LANDMARK_AR_AUTOGEN_PIPELINE_V1         [SUPERSEDED] · 保留
│
├── AR_FACTORY_ARCHITECTURE_V1              [REVIEW]
│
└── AR_TEMPLATE_LIBRARY_V1                  [REVIEW]
```

---

## 6. 上游

```yaml
upstream:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/product/ar/AR_VIRAL_ENGINE_POSITIONING_V1.md
  - docs/product/ar_factory/archetype/CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1.md
  - docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md
  - docs/product/ar/AR_PRODUCT_INDEX_V1.md
```
