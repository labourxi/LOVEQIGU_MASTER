# AR_FACTORY_RUNTIME_SCHEMA_V1

# AR Factory Runtime Schema V1

---

## Status

```yaml
document_id: AR_FACTORY_RUNTIME_SCHEMA_V1
version: V1
status: REVIEW
review_batch: TODAY_DOCUMENT_BUILD_BATCH_V1
updated_at: 2026-06-07
owner: Engineering
priority: P0
upstream:
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.md
index: docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
```

---

## Purpose

定义 AR Factory 产出物与 Runtime 消费物之间的 **JSON Schema 契约**，确保：

```text
Factory 产出 → Schema 校验 → Runtime 消费 → C 端 Interaction 加载
```

Schema 前缀：`loveqigu.ar_factory.*.v1`

---

## Scope

### In Scope

- `draft_package` · `anchor_set` · `ar_config` · `publish_record`
- 枚举 · 阈值 · 文件布局建议
- 与 C 端交互对象的字段映射

### Out of Scope

- 数据库表设计
- API 路由定义
- CV 算法内部数据结构

---

## Architecture

```text
Pipeline 各 Stage 产出
        ↓
Schema Validator
        ↓
draft_package（审核前）
        ↓
Review Gate
        ↓
publish_record + Runtime Registry
        ↓
miniapp ar_config 加载
```

---

## Components

### 2.1 `loveqigu.ar_factory.draft_package.v1`

AR 草稿包 · Pipeline 最终产出 · 审核前。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `draft_id` | string | ✓ | 草稿 UUID |
| `explore_point_id` | string | ✓ | 探索点 ID |
| `pipeline_version` | string | ✓ | `LANDMARK_AR_AUTOGEN_PIPELINE_V1` |
| `anchor_set` | object | ✓ | 见 §2.2 |
| `standing_guide` | object | ✓ | 站位图 URI + 规则参数 |
| `scan_guide` | object | ✓ | 引导图 URI + 文案 |
| `template_ref` | string | ✓ | 模板 ID |
| `ar_config` | object | ✓ | 见 §2.3 |
| `review_status` | enum | ✓ | `draft` · `pending_review` · `approved` · `rejected` |
| `created_at` | ISO8601 | ✓ | 创建时间 |

### 2.2 `loveqigu.ar_factory.anchor_set.v1`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `anchor_id` | string | ✓ | 锚点集 ID |
| `detector` | string | ✓ | `orb_akaze_v1` |
| `feature_count` | number | ✓ | 特征点数量 |
| `score` | object | ✓ | `{ feature_points, distribution, lighting, texture, total }` |
| `descriptor_uri` | string | ✓ | 特征描述文件路径 |
| `reference_images` | array | ✓ | 源照片 URI 列表 |

### 2.3 `loveqigu.ar_factory.ar_config.v1`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `config_id` | string | ✓ | 配置 ID |
| `template_id` | string | ✓ | 模板库引用 |
| `interaction_script` | string | ✓ | 交互脚本 ID |
| `reveal_assets` | array | ✓ | Lottie / 图片引用 |
| `completion_event` | string | ✓ | 完成事件码 |
| `runtime_compat` | string | ✓ | `miniapp_ar_v1` |

### 2.4 `loveqigu.ar_factory.publish_record.v1`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `publish_id` | string | ✓ | 发布 ID |
| `draft_id` | string | ✓ | 源草稿 |
| `registry_ref` | string | ✓ | Runtime registry 路径 |
| `published_at` | ISO8601 | ✓ | 发布时间 |
| `published_by` | string | ✓ | 操作员 |

### 枚举与阈值

```yaml
review_status: [draft, pending_review, approved, rejected]
pipeline_stage: [ingest, analyze, template_match, draft_gen, review, publish]
anchor_score_min_publish: 0.65  # Phase1 建议阈值 · 可配置
template_confidence_auto: 0.70
template_confidence_manual: 0.70  # 低于此值须人工确认
```

---

## Workflow

### Schema 校验流

```text
Stage 产出 JSON
  → Validator（schema id + version）
  → 通过 → 写入 draft 目录
  → 失败 → 标记 stage_error · 保留 raw 供调试
```

### 发布校验流

```text
review_status = approved
  → 校验 anchor_set.score.total >= anchor_score_min_publish
  → 生成 publish_record
  → 写入 runtime/registry
```

---

## Runtime Mapping

| Schema | 文件路径 | 注册表 |
|--------|----------|--------|
| draft_package | `data/ar_factory/drafts/{draft_id}/manifest.json` | `registry/runtime_registry.json` |
| anchor_set | `data/ar_factory/drafts/{draft_id}/anchors/` | — |
| ar_config | `data/ar_factory/drafts/{draft_id}/ar_config.json` | `runtime/registry/assets.json` |
| publish_record | `runtime/registry/releases.json` | `registry/runtime_registry.json` |

### C 端字段消费

| Schema 字段 | Interaction 对象 |
|-------------|------------------|
| `ar_config.interaction_script` | `interaction_script` |
| `ar_config.reveal_assets` | `reveal_asset` |
| `anchor_set.descriptor_uri` | `anchor_set` |
| `standing_guide` / `scan_guide` | UI 引导层 |

---

## Governance Rules

1. Schema 变更须版本递增 · 不得 silent break `miniapp_ar_v1` 消费方。
2. 未通过 Schema 校验的 draft **不得** 进入 Review Queue。
3. `anchor_score_min_publish` 为 Phase1 建议值 · 运营可配置 · 须记录在 publish_record。
4. 字段命名与 AR_INTERACTION_ARCHITECTURE_V1 对象表保持一致。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 四个核心 Schema 字段完整 | 文档评审 |
| AC-2 | 与 Interaction 架构对象一一映射 | 交叉对照 |
| AC-3 | 枚举与 Pipeline stage 对齐 | 交叉对照 Pipeline |
| AC-4 | 文件布局建议可实施 | 工程评审 |
| AC-5 | 状态 = REVIEW | 索引检查 |

```yaml
AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW: PENDING
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 · 标准结构 · REVIEW | Cursor |
| V1.0-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 本批次回退至 REVIEW | Cursor |
