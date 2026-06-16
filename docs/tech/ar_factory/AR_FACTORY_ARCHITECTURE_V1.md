# AR_FACTORY_ARCHITECTURE_V1

# AR Factory 架构 V1

---

## Status

```yaml
document_id: AR_FACTORY_ARCHITECTURE_V1
version: V1
status: REVIEW
review_batch: TODAY_DOCUMENT_BUILD_BATCH_V1
updated_at: 2026-06-07
owner: Engineering / AR Factory
priority: P0
upstream:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.md
  - docs/product/ar_factory/LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1.md
downstream:
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
index: docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
```

---

## Purpose

定义 AR Factory 作为 AR游伴 **AR 内容生产子系统** 的总架构。

Phase1 本质：

```text
AR 自动草稿生成系统
```

不是：

```text
AR 全自动生产系统 · 自动发布
```

---

## Scope

### In Scope

- 子系统分层（Ingest · Analyze · Template · Draft · Review · Publish）
- 技术路线与 Phase1 能力分级（AUTO / PARTIAL / NOT_READY）
- 与 C 端 Interaction · Runtime · Admin 的边界
- PoC 范围（爱企谷 · 古树探索点）

### Out of Scope

- 具体 Pipeline 阶段细节（见 LANDMARK_AR_AUTOGEN_PIPELINE_V1）
- JSON Schema 字段（见 AR_FACTORY_RUNTIME_SCHEMA_V1）
- 模板清单（见 AR_TEMPLATE_LIBRARY_V1）
- miniapp 业务代码

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  Admin / Operator UI（审核 · 发布 · 回滚）                │
├─────────────────────────────────────────────────────────┤
│  Pipeline Orchestrator（LANDMARK_AR_AUTOGEN_PIPELINE）   │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ Ingest   │ Analyze  │ Template │ Draft    │ Publish     │
│ 上传     │ 主体/锚点 │ 模板匹配  │ 配置生成  │ Registry    │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
                              ↓
                    AR Interaction Layer（消费 ar_config）
```

### 能力分级

| 能力 | 方案 | Phase1 |
|------|------|--------|
| 主体识别 | Gemini Vision | AUTO_READY |
| 视觉锚点 | OpenCV ORB + AKAZE | AUTO_READY |
| 锚点评分 | Feature / Distribution / Lighting / Texture | AUTO_READY |
| 站位图 | 规则生成 | AUTO_READY |
| 引导图 | 模板生成 | AUTO_READY |
| AR 配置 | Template Driven | AUTO_READY |
| AR 类型 / 模板推荐 | 规则 + 置信度 | PARTIAL_READY |
| 多图融合 / 复杂评分 | — | PARTIAL_READY |
| 高质量 3D / 复杂动画 | — | NOT_READY |
| 自动发布 | — | NOT_READY |

---

## Components

| 组件 | 职责 |
|------|------|
| **Ingest Service** | 图片上传 · 绑定 explore_point 元数据 |
| **Analyze Service** | Gemini Vision 主体识别 · ORB+AKAZE 锚点 · 评分 |
| **Template Matcher** | 模板库匹配 · 推荐 AR 类型 |
| **Draft Generator** | 站位图 / 引导图 · ar_config 组装 |
| **Review Queue** | 人工审核 · 通过 / 驳回 |
| **Publish Gateway** | 审核通过后写入 Runtime registry |
| **Operator UI** | 运营上传 · 审核 · 发布 · 回滚 |

---

## Workflow

### 端到端生产流

```text
运营上传照片 + 探索点元数据
  → Ingest
  → Analyze（主体 + 锚点 + 评分）
  → Template Match
  → Draft Gen（站位图 + 引导图 + ar_config）
  → Review Queue（人工必须）
  → Publish → Runtime
```

### Phase1 允许 / 禁止

**允许**：

```text
上传照片 · 自动分析 · 自动生成 AR 草稿 · 人工审核 · 发布
```

**禁止定义为 Phase1 目标**：

```text
上传照片 · 自动生成最终 AR 内容 · 自动发布
```

---

## Runtime Mapping

| Factory 产出 | Schema | Runtime 路径 |
|--------------|--------|--------------|
| 草稿包 | `loveqigu.ar_factory.draft_package.v1` | `data/ar_factory/drafts/{draft_id}/` |
| 锚点集 | `loveqigu.ar_factory.anchor_set.v1` | `drafts/{id}/anchors/` |
| AR 配置 | `loveqigu.ar_factory.ar_config.v1` | `drafts/{id}/ar_config.json` |
| 发布记录 | `loveqigu.ar_factory.publish_record.v1` | `runtime/registry/` · `registry/runtime_registry.json` |

Factory **不写** miniapp 业务逻辑；**只产出** 符合 Schema 的 JSON 包。

---

## Governance Rules

1. 发布必须经过 **人工审核** · 禁止 Phase1 自动发布。
2. 产出物须符合 `AR_FACTORY_RUNTIME_SCHEMA_V1`。
3. 验证重点是 **自动生成链路**，不是 AR 内容质量极限。
4. 新能力须标注 AUTO / PARTIAL / NOT_READY · 不得越级承诺。
5. Orchestrator 负责调度 · Factory 负责生产 · Review 负责验收 · Runtime 负责运行。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 六层子系统职责清晰 | 架构评审 |
| AC-2 | 能力分级与 Phase1 Freeze 一致 | 对照 LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1 |
| AC-3 | Runtime 边界无侵入 miniapp | 工程评审 |
| AC-4 | PoC 案例可映射到 Pipeline | 交叉对照 Pipeline 文档 |
| AC-5 | 状态 = REVIEW | 索引检查 |

```yaml
AR_FACTORY_ARCHITECTURE_V1_REVIEW: PENDING
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 · 标准结构 · REVIEW | Cursor |
| V1.0-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 本批次回退至 REVIEW | Cursor |
