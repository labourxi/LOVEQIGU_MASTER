# LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW

# Landmark AR AutoGen Pipeline V1 专项审查报告

---

## Status

```yaml
document_id: LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW
version: V1
status: APPROVED_FOR_REVISION
review_type: SPECIALIZED_CROSS_VALIDATION
review_date: 2026-06-16
target_document: LANDMARK_AR_AUTOGEN_PIPELINE_V1
target_path: docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
upstream_frozen:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.1.md
upstream_review:
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/product/ar_factory/LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1.md
owner: Engineering / AR Factory
reviewer: Cursor
```

---

## Purpose

验证 `LANDMARK_AR_AUTOGEN_PIPELINE_V1` 是否能够真实支撑：

```text
AR_INTERACTION_ARCHITECTURE_V1.1
AR_FACTORY_RUNTIME_SCHEMA_V1.1
```

并形成完整链路：

```text
图片上传 → 主体识别 → 锚点生成 → 站位图 → 引导图 → 模板匹配
→ Runtime Package → AR 体验
```

---

## Executive Summary

| 维度 | 得分 | 说明 |
|------|------|------|
| 阶段完整性（S1–S10） | 70/100 | 10 阶段存在 · 命名/职责与 V1.1 要求不完全对齐 |
| V1.1 交互架构支撑 | 45/100 | 缺 alignment_overlay · AR 类型阶段 · ARRIVED 流程绑定 |
| Runtime Schema V1.1 对齐 | 40/100 | 仍引用 V1 draft_package · 未定义 publish_build / runtime_package |
| PoC 可实施性（古树 3 张） | 75/100 | 站位图/引导图可 AUTO · Runtime 发布须人工 |
| 全链路闭环 | 50/100 | Factory 草稿链可描述 · 可发布 AR 节点文档未闭合 |
| **综合评分** | **58/100** | |

```yaml
review_result: PASS_WITH_MODIFICATION
overall_score: 58
p0_count: 5
p1_count: 6
can_freeze: false
final_verdict: PASS_WITH_MODIFICATION
```

Pipeline 文档 **具备 Phase1 骨架**，但相对已冻结的 **Runtime Schema V1.1** 与 **Interaction V1.1** 存在结构性滞后。**今天** 按现有文档可实现「上传 3 张古树 → 自动生成站位图 + 引导图 + Factory 草稿」，**不能** 在无修订情况下文档级承诺「自动生成完整 Runtime Package 并可发布 AR 节点」（S9/S10 为 MANUAL，且 S8 未对齐 V1.1）。

---

## Part 1 · Pipeline 完整性审查

### 审查结论：PARTIAL · 1 项 P0

| 要求阶段 | Pipeline 当前 | 判定 |
|----------|---------------|------|
| S1 上传素材 | S1 INGEST | ✓ |
| S2 主体识别 | S2 SUBJECT | ✓ |
| S3 锚点评估 | S3 ANCHOR + S4 SCORE（拆分） | ⚠️ 功能覆盖 · 非独立「评估」阶段 |
| **S4 AR 类型判断** | **缺失** · 仅有 S4 SCORE | ❌ **P0** |
| S5 站位图生成 | S5 STANDING | ✓ |
| S6 引导图生成 | S6 GUIDE | ✓ |
| S7 模板匹配 | S7 TEMPLATE | ✓ |
| **S8 Runtime Package 组装** | S8 CONFIG → `draft_package` | ❌ **P0** · 非 runtime_package |
| S9 审核 | S9 REVIEW | ✓ |
| S10 发布 | S10 PUBLISH | ✓ · 但未定义 publish_build() |

```yaml
severity: P0
issue_id: P0-001
title: 缺少独立 S4 AR 类型判断阶段
impact: 无法驱动 landmark_ar / world_ar / body_ar / surface_ar 推荐
```

```yaml
severity: P0
issue_id: P0-002
title: S8 产出 draft_package（V1）而非 factory_package + runtime_package（V1.1）
impact: 与 AR_FACTORY_RUNTIME_SCHEMA_V1.1 双层结构不对齐
```

---

## Part 2 · 输入结构审查

### 审查结论：P1 · Phase1 古树 PoC 部分满足

| 输入类型 | 当前支持 | 判定 |
|----------|----------|------|
| 单图 | ✓ 1–5 张 JPG/PNG | ✓ |
| 多图 | ✓ 同上 | ✓ |
| 全景图 | ❌ 未定义 | P1 |
| 景区介绍 | ❌ 未定义 | P1 |
| 探索点介绍 | ⚠️ explore_point 元数据（未展开字段） | P1 |
| 识别图 | ❌ 未定义 | P1 |
| GPS 位置 | ❌ 未在 Pipeline 输入中定义 | P1 |

四类 Landmark 覆盖：

| 类型 | 能否支撑 | 说明 |
|------|----------|------|
| 古树 | ✓ | PoC 明确 |
| 石碑 | ⚠️ | 依赖主体识别 · 无 subject_type 规则 |
| 建筑 | ⚠️ | 同上 |
| 景观 | ⚠️ | 同上 |

```yaml
severity: P1
issue_id: P1-001
title: 输入 Schema 未定义全景图/介绍文案/GPS/识别图
note: Phase1 古树 PoC 可仅用多图 · 全 Landmark 类型须扩展 ingest_record
```

---

## Part 3 · 主体识别审查

### 审查结论：FAIL

当前 S2 产出：`subject_bbox` + 标签。

| 要求字段 | 当前 | 判定 |
|----------|------|------|
| `subject_type` | ❌ | 缺失 |
| `subject_confidence` | ❌ | 缺失 |
| `landmark_score` | ❌ | 缺失 |
| `ar_recommendation` | ❌ | 缺失 |

无法驱动 AR 类型推荐（Part 4 依赖 Part 3）。

```yaml
severity: P0
issue_id: P0-003
title: 主体识别输出字段不足 · 无法驱动 AR 类型与模板推荐
```

---

## Part 4 · AR 类型推荐审查

### 审查结论：FAIL · P0

Pipeline **无** AR 类型推荐阶段/产出。

| ar_type | 推荐场景（要求） | Pipeline |
|---------|------------------|----------|
| `landmark_ar` | 古树 | ⚠️ 隐含 PoC · 无规则 |
| `world_ar` | 景区入口广场 | ❌ |
| `body_ar` | 游客互动拍照点 | ❌ |
| `surface_ar` | — | ❌ |

Runtime Schema V1.1 要求 `ar_entity.ar_type` · Pipeline 未定义写入路径。

```yaml
severity: P0
issue_id: P0-004
title: 无 ar_type 推荐逻辑与阶段
```

---

## Part 5 · 锚点生成审查

### 审查结论：PARTIAL

当前 S3–S4 产出 `anchor_set`：detector · feature_count · score · descriptor_uri · reference_images。

| 要求 | 当前 | 判定 |
|------|------|------|
| `anchor_type` | ❌ | 无枚举 |
| `descriptor` | ⚠️ `descriptor_uri` | 命名不一致 |
| `anchor_score` | ⚠️ `score.total` | 语义覆盖 |

| 锚点类型 | 能否生成 |
|----------|----------|
| `image_anchor` | ✓ Phase1 |
| `gps_anchor` | ❌ |
| `body_anchor` | ❌ |

```yaml
severity: P1
issue_id: P1-002
title: 锚点输出未对齐 runtime.anchor.v1 的 anchor_type + anchor_payload
note: Phase1 Landmark 仅 image_anchor 可接受
```

---

## Part 6 · 站位图生成审查

### 审查结论：PARTIAL

当前 S5 产出 `standing_guide`（站位图）。

| 要求字段 | 当前 | 判定 |
|----------|------|------|
| `standing_guide` | ✓ | 存在 |
| `guide_uri` | ⚠️ | 未在 Pipeline 字段表显式列出 |
| `camera_position` | ❌ | 缺失 |

ARRIVED → SCANNING：V1.1 要求 ARRIVED 展示 standing_guide · Pipeline **未绑定** 状态机阶段。

```yaml
severity: P1
issue_id: P1-003
title: standing_guide 字段未细化 · 未映射 ARRIVED 阶段
```

---

## Part 7 · 对准引导审查

### 审查结论：P0 缺陷

Pipeline **完全未定义** `alignment_overlay` 生成阶段。

Runtime Schema V1.1 **强制** `ar_guidance.alignment_overlay`（landmark_ar）。

| 字段 | Pipeline | Schema V1.1 |
|------|----------|-------------|
| `overlay_uri` | ❌ | ✓ 必填 |
| `contour_uri` | ❌ | ✓ 必填 |
| `alignment_threshold` | ❌ | ✓ 必填 |
| `hint_text` | ❌ | ✓ 必填 |

```yaml
severity: P0
issue_id: P0-005
title: 缺少 alignment_overlay 生成（建议 S5.5 或 S6 扩展）
impact: 无法闭合 V1.1 SCANNING 轮廓对准 · Landmark AR 发布阻断
```

---

## Part 8 · 模板匹配审查

### 审查结论：PARTIAL

当前 S7 产出：`template_ref` → `template_id` + confidence。

| 要求 | 当前 | 判定 |
|------|------|------|
| `template_id` | ✓ | |
| `template_confidence` | ✓ | |
| `reveal_type` | ❌ | Schema V1.1 要求 publish_build 派生 · Pipeline 未声明 |

与 AR_TEMPLATE_LIBRARY_V1 映射：✓ 规则表存在 · 但 **reveal_type 派生** 仅在 Schema V1.1 Reveal Mapping Table · Pipeline 未引用。

```yaml
severity: P1
issue_id: P1-004
title: S7 未输出 reveal_type · 未引用 Reveal Mapping Table
```

---

## Part 9 · Runtime 生成审查

### 审查结论：FAIL · P0（与 P0-002 合并）

| 要求 | 当前 | 判定 |
|------|------|------|
| 最终 `runtime_package` | ❌ | S8 仅 `draft_package` |
| `factory_package`（V1.1） | ❌ | 未命名 |
| `publish_build()` | ❌ | S10 仅「发布至 Runtime Registry」 |
| `navigation_binding` | ❌ | 未在 Pipeline 组装 |
| `activity_binding` | ❌ | 未在 Pipeline 组装 |

Runtime Mapping 仍引用：

```text
loveqigu.ar_factory.draft_package.v1  ← 已 SUPERSEDED
```

应对齐：

```text
S8 → factory_package.v1
S10 → publish_build() → runtime_package.v1
```

---

## Part 10 · 自动化边界审查

### 当前文档 Ready 分级

| Stage | 文档标注 | 审查确认 |
|-------|----------|----------|
| S1 INGEST | AUTO_READY | ✓ |
| S2 SUBJECT | AUTO_READY | ⚠️ 失败需人工框选 |
| S3 ANCHOR | AUTO_READY | ✓ |
| S4 SCORE | AUTO_READY | ✓ |
| S5 STANDING | AUTO_READY | ✓ |
| S6 GUIDE | AUTO_READY | ✓ |
| S7 TEMPLATE | PARTIAL_READY | ✓ |
| S8 CONFIG | AUTO_READY | ⚠️ 应对齐 V1.1 factory_package |
| S9 REVIEW | MANUAL | ✓ |
| S10 PUBLISH | MANUAL | ✓ |

### AUTO_READY（今天可实现 · 文档级）

```text
上传 1–5 张照片
主体识别（Gemini Vision · 失败则人工）
ORB+AKAZE 锚点提取 + 评分
规则生成站位图
模板生成引导图（scan_guide）
模板匹配（高 confidence 时）
组装 Factory 草稿包（修订后 factory_package）
```

### PARTIAL_READY（今天可实现 · 需人工确认）

```text
AR 类型推荐（当前缺失 · 须默认 landmark_ar）
模板 confidence < 0.70
低锚点分强制 scan_hint 模板
主体识别失败 · needs_manual_subject
reveal_type 派生（须在 S7/S8 显式化）
alignment_overlay 生成（当前缺失 · 须新增或人工上传轮廓）
```

### MANUAL_REQUIRED（今天不可跳过）

```text
S9 人工审核
S10 发布 · publish_build() · 写入 runtime_package
可发布 AR 节点上线
```

### 核心问题回答

**今天是否能够实现：上传 3 张古树照片 → 自动生成站位图 + 引导图 + Runtime Package？**

| 步骤 | 今天是否成立 | 条件 |
|------|--------------|------|
| 上传 3 张古树照片 | ✓ | S1 |
| 自动生成站位图 | ✓ | S5 AUTO_READY |
| 自动生成引导图 | ✓ | S6 AUTO_READY |
| 自动生成 alignment_overlay | ❌ | Pipeline 未定义 |
| 自动生成 Factory Package | ⚠️ | 工程可实现 · **文档须修订为 V1.1** |
| 自动生成 Runtime Package | ❌ | 须 S9 审核 + S10 publish_build · MANUAL |
| **生成可发布 AR 节点** | **⚠️ 部分** | **草稿自动 · 发布须人工** |

---

## P0 问题汇总

| ID | 问题 |
|----|------|
| P0-001 | 缺少 S4 AR 类型判断阶段 |
| P0-002 | S8 产出 V1 draft_package · 非 V1.1 factory_package / runtime_package |
| P0-003 | 主体识别输出字段不足 |
| P0-004 | 无 ar_type 推荐逻辑 |
| P0-005 | 缺少 alignment_overlay 生成 |

---

## P1 问题汇总

| ID | 问题 |
|----|------|
| P1-001 | 输入结构不完整（全景/GPS/介绍/识别图） |
| P1-002 | anchor 未对齐 runtime.anchor.v1 |
| P1-003 | standing_guide 未细化 · 未绑 ARRIVED |
| P1-004 | S7 未输出 reveal_type |
| P1-005 | 未组装 navigation_binding / activity_binding |
| P1-006 | upstream 仍引用 Runtime Schema V1 · 非 V1.1 |

---

## 建议修订项（→ Pipeline V1.1）

| # | 修订 |
|---|------|
| R-01 | 新增 **S4 AR_TYPE**：输出 `ar_type` · `ar_recommendation` · 规则表（古树→landmark_ar 等） |
| R-02 | 扩展 **S2 SUBJECT**：`subject_type` · `subject_confidence` · `landmark_score` · `ar_recommendation` |
| R-03 | 新增 **S6.5 ALIGNMENT** 或扩展 S5/S6：生成 `alignment_overlay` 全套字段 |
| R-04 | **S8 重命名/重定义**：组装 `factory_package.v1` · 非 draft_package |
| R-05 | **S10 扩展**：明确 `publish_build()` → `runtime_package.v1` + navigation_binding |
| R-06 | **S7 扩展**：输出 `reveal_type`（Reveal Mapping Table 派生） |
| R-07 | 更新 Runtime Mapping · upstream → Schema V1.1 · Interaction V1.1 |
| R-08 | 扩展 **ingest_record**：GPS · 探索点/景区介绍 · 识别图 · 全景图（Phase1 可选字段） |

---

## 验收标准回答

### 是否支撑 AR Factory Phase 1？

```yaml
phase1_factory_draft_chain: YES   # 上传→分析→草稿 · 文档骨架具备
phase1_runtime_publish_chain: PARTIAL  # 须修订对齐 V1.1 + 人工 S9/S10
phase1_poc_ancient_tree: PARTIAL  # 站位图/引导图 YES · alignment/runtime NO
supports_interaction_v1_1: false
supports_runtime_schema_v1_1: false
```

### 上传 3 张古树照片 → 生成可发布 AR 节点 · 是否成立？

```text
Factory 草稿自动生成：成立（站位图 + 引导图 + 模板匹配 + 草稿包）
完整 Runtime Package 自动生成：不成立（缺 alignment_overlay · 未定义 publish_build）
可发布 AR 节点（无需人工）：不成立（S9/S10 必须人工）
```

**Phase1 正确定义（与 LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1 一致）**：

```text
上传 → 自动分析 → 自动草稿 → 人工审核 → 发布
```

按此定义：**Phase1 可建 · Pipeline 文档须 V1.1 修订后方可冻结。**

---

## 是否可以冻结

```yaml
can_freeze: false
reason: 5 × P0 · 未对齐已冻结 Runtime Schema V1.1
next_step: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1_REVISION
```

---

## 最终结论

```
PASS_WITH_MODIFICATION
```

```yaml
LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW:
  result: PASS_WITH_MODIFICATION
  score: 58
  p0_count: 5
  p1_count: 6
  ready_for_freeze: false
  ready_for_freeze_verdict: NOT_READY
  phase1_can_build: PARTIAL
  poc_three_photos_standing_guide: YES
  poc_three_photos_runtime_package_auto: NO
  poc_publishable_ar_node_without_human: NO
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1 | 2026-06-16 | 专项审查 · 对照 Interaction V1.1 + Runtime Schema V1.1 | Cursor |
