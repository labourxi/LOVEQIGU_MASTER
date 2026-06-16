# LANDMARK_AR_AUTOGEN_PIPELINE_V1

# Landmark AR 自动生成流水线 V1

---

## Status

```yaml
document_id: LANDMARK_AR_AUTOGEN_PIPELINE_V1
version: V1
status: REVIEW
review_batch: TODAY_DOCUMENT_BUILD_BATCH_V1
updated_at: 2026-06-07
owner: Engineering / AR Factory
priority: P0
note: 当前项目首个进入工程验证阶段的自动化生产线
upstream:
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/product/ar_factory/LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1.md
index: docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
current_active_candidate: true
```

---

## Purpose

定义 AR Factory Phase1 的 **地标探索点 AR 草稿自动生成流水线**。

验证重点：

```text
自动生成链路端到端可跑通
```

不验证：

```text
AR 内容质量极限 · 复杂动画 · 世界级 AR 体验
```

---

## Scope

### In Scope

- 10 阶段流水线（S1–S10）
- 阶段 I/O · Ready 分级 · 失败回退
- PoC 案例（爱企谷 · 古树探索点 · 3 张照片）
- 与 Review Gate · Publish Gateway 的衔接

### Out of Scope

- Worker 实现代码
- Gemini / OpenCV 参数调优
- 非地标类 AR（商户室内等）

---

## Architecture

```text
S1 INGEST ──→ S2 SUBJECT ──→ S3 ANCHOR ──→ S4 SCORE
                                              ↓
S10 PUBLISH ←─ S9 REVIEW ←── S8 CONFIG ←── S7 TEMPLATE
                                              ↑
                         S5 STANDING ──→ S6 GUIDE
```

| Stage | 名称 | 引擎 |
|-------|------|------|
| S1 | INGEST | 上传服务 |
| S2 | SUBJECT | Gemini Vision |
| S3 | ANCHOR | OpenCV ORB + AKAZE |
| S4 | SCORE | Feature / Distribution / Lighting / Texture |
| S5 | STANDING | 规则生成 |
| S6 | GUIDE | 模板生成 |
| S7 | TEMPLATE | AR_TEMPLATE_LIBRARY_V1 |
| S8 | CONFIG | Schema 组装 |
| S9 | REVIEW | 人工审核（必须） |
| S10 | PUBLISH | Runtime Registry |

---

## Components

| 组件 | Stage | 产出 |
|------|-------|------|
| `ingest_record` | S1 | 照片 URI + explore_point 绑定 |
| `subject_bbox` | S2 | 主体框 + 标签 |
| `anchor_set` | S3–S4 | 特征描述 + score |
| `standing_guide` | S5 | 站位图 |
| `scan_guide` | S6 | 引导图 + 文案 |
| `template_ref` | S7 | template_id + confidence |
| `draft_package` | S8 | 完整草稿包 |
| `review_decision` | S9 | approved / rejected |
| `publish_record` | S10 | Runtime 发布记录 |

### Ready 分级

| Stage | Ready | 说明 |
|-------|-------|------|
| S1–S6, S8 | AUTO_READY | 可全自动 |
| S7 | PARTIAL_READY | 低 confidence 须人工 |
| S9–S10 | MANUAL | 必须人工 |

---

## Workflow

### 标准流水线

```text
上传 1–5 张 JPG/PNG + explore_point 元数据
  → S1 INGEST
  → S2 识别主体（Gemini Vision）
  → S3 提取锚点（ORB+AKAZE）
  → S4 评分（四维 + total）
  → S5 规则生成站位图
  → S6 模板生成引导图
  → S7 模板库匹配
  → S8 组装 draft_package
  → S9 人工审核
  → S10 发布至 Runtime
```

### PoC：爱企谷 · 古树探索点

```text
上传 3 张古树照片
  → 识别主体 → 提取锚点 → 评分
  → 生成站位图 → 生成引导图
  → 匹配 AR 模板 → 生成 AR 配置
  → 审核 → 发布
```

### 失败与回退

| 失败点 | 行为 |
|--------|------|
| 主体识别失败 | `needs_manual_subject` · 运营框选 |
| 锚点分 < 0.50 | 强制 `tpl_landmark_scan_hint_v1` + 人工确认 |
| 模板 confidence < 0.70 | 人工模板选择 |
| 审核驳回 | 保留 draft · 可重跑 S5–S8 |
| Schema 校验失败 | 阻断 S9 · 保留 stage_error |

---

## Runtime Mapping

| Stage 产出 | Schema | 路径 |
|------------|--------|------|
| draft_package | `loveqigu.ar_factory.draft_package.v1` | `data/ar_factory/drafts/{draft_id}/` |
| publish_record | `loveqigu.ar_factory.publish_record.v1` | `runtime/registry/releases.json` |
| 文档登记 | — | `registry/runtime_registry.json` |

Pipeline 版本字段：

```yaml
pipeline_version: LANDMARK_AR_AUTOGEN_PIPELINE_V1
```

---

## Governance Rules

1. S9 Review **不可跳过** · 禁止 Phase1 自动发布。
2. 流水线版本须写入 `draft_package.pipeline_version`。
3. 失败须保留 raw 与 stage_error · 便于 PoC 调试。
4. 本 Pipeline 为 AR Factory **CURRENT_ACTIVE** 候选生产线。
5. 与 Orchestrator 集成时 · Factory 生产 · Orchestrator 调度 · Review 验收。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | S1–S10 阶段完整 · I/O 明确 | 文档评审 |
| AC-2 | PoC 流程可逐步映射 | 工程走查 |
| AC-3 | 失败回退策略完整 | 工程评审 |
| AC-4 | 与 Phase1 Freeze 结论一致 | 对照 LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1 |
| AC-5 | 状态 = REVIEW · 未冻结 | 索引检查 |

```yaml
LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW: PENDING
PHASE1_CAN_BUILD: YES  # 待 Review 确认
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 · 标准结构 · REVIEW | Cursor |
| V1.0-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 本批次回退至 REVIEW | Cursor |
