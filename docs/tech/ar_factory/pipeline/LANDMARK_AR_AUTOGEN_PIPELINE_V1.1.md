# LANDMARK_AR_AUTOGEN_PIPELINE_V1.1

# Landmark AR 自动生成流水线 V1.1

---

## Status

```yaml
document_id: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
version: V1.1
status: FROZEN
review_batch: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1_REVISION_TASK
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Engineering / AR Factory
priority: P0
current_active_autogen_pipeline: true
note: 当前项目首个进入工程验证阶段的自动化生产线
supersedes: LANDMARK_AR_AUTOGEN_PIPELINE_V1
upstream:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.1.md
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1_REVIEW.md
  - docs/product/ar_factory/LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1.md
index: docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
freeze_basis:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.1.md
fixes_applied:
  - P0-001 S4 AR_TYPE
  - P0-002 factory_package
  - P0-003 S2 SUBJECT 扩展
  - P0-004 AR 类型推荐
  - P0-005 S6.5 ALIGNMENT
  - P1-001 ~ P1-006
supports_interaction_v1_1: true
supports_runtime_schema_v1_1: true
```

---

## Purpose

定义 AR Factory Phase1 的 **地标探索点 AR 自动草稿生成流水线**（V1.1），对齐：

```text
AR_INTERACTION_ARCHITECTURE_V1.1
AR_FACTORY_RUNTIME_SCHEMA_V1.1
```

完整链路：

```text
图片上传 → 主体识别 → 锚点生成 → AR 类型判断 → 站位图 → 引导图 → 对准层
→ 模板匹配 → factory_package → 审核 → publish_build() → runtime_package → AR 体验
```

Phase1 本质：**自动草稿 + 人工审核发布**（非全自动上线）。

---

## Scope

### In Scope

- S1–S10 + S6.5 阶段定义 · I/O · Ready 分级
- factory_package 组装 · publish_build() · runtime_package 发布
- PoC：爱企谷 · 古树 · 3 张照片
- ARRIVED / SCANNING 引导映射

### Out of Scope

- Worker 实现代码 · CV 参数调优
- 非探索点类 AR（商户室内等）
- Phase2 必填的全景/GPS 强校验

---

## Architecture

### 流水线总览

```text
S1 INGEST
  ↓
S2 SUBJECT
  ↓
S3 ANCHOR（含锚点评分）
  ↓
S4 AR_TYPE          ← FIX-01
  ↓
S5 STANDING
  ↓
S6 GUIDE
  ↓
S6.5 ALIGNMENT      ← FIX-03
  ↓
S7 TEMPLATE
  ↓
S8 CONFIG（factory_package）  ← FIX-04
  ↓
S9 REVIEW
  ↓
S10 PUBLISH（publish_build → runtime_package）  ← FIX-05
```

| Stage | 名称 | 引擎 / 规则 |
|-------|------|-------------|
| S1 | INGEST | 上传服务 |
| S2 | SUBJECT | Gemini Vision |
| S3 | ANCHOR | OpenCV ORB + AKAZE · 四维评分 |
| S4 | AR_TYPE | 规则 + S2 输出 |
| S5 | STANDING | 规则生成 |
| S6 | GUIDE | 模板生成 scan_guide |
| S6.5 | ALIGNMENT | 轮廓提取 + 叠层生成 |
| S7 | TEMPLATE | AR_TEMPLATE_LIBRARY_V1 + Reveal Mapping |
| S8 | CONFIG | factory_package 组装 |
| S9 | REVIEW | 人工审核（必须） |
| S10 | PUBLISH | publish_build() → Runtime |

### 与 V1.1 交互状态映射（FIX-10）

| Pipeline 产出 | Interaction 状态 | 阶段 |
|---------------|------------------|------|
| `navigation_binding` | NAVIGATING | navigation |
| `standing_guide` + `scan_guide` | **ARRIVED** | arrival |
| `alignment_overlay` | **SCANNING** | scanning |
| `anchor` | ANCHOR_LOCKED | anchor_lock |
| `interaction_script` | INTERACTING | interaction |
| `reveal_type` + assets | REVEALING | reveal |
| `completion_event` + bindings | COMPLETED | completion |

```text
standing_guide  → ARRIVED（环境观察 · 目标确认）
alignment_overlay → SCANNING（轮廓对准）
```

---

## Components

### S1 · ingest_record（FIX-07）

| 字段 | 类型 | Phase1 | 说明 |
|------|------|--------|------|
| `photos` | array | ✓ 必填 | 1–5 张 JPG/PNG |
| `exploration_point_id` | string | ✓ | 探索点 ID |
| `gps_location` | object | 可选 | `{ latitude, longitude }` |
| `panorama_images` | array | 可选 | 全景图 URI |
| `reference_images` | array | 可选 | 识别参考图 |
| `spot_description` | string | 可选 | 探索点介绍 |
| `scenic_description` | string | 可选 | 景区介绍 |

Phase1 允许 GPS/介绍为空 · Phase2 推荐填写。

---

### S2 · subject_result（FIX-02）

| 字段 | 类型 | 说明 |
|------|------|------|
| `subject_bbox` | object | 主体框 |
| `subject_type` | string | 例：`ancient_tree` · `stone_tablet` · `building` · `landscape` |
| `subject_confidence` | number | 0.0–1.0 |
| `landmark_score` | number | 地标适合度 |
| `ar_recommendation` | enum | 初步 AR 类型推荐 |

**示例**：

```json
{
  "subject_type": "ancient_tree",
  "subject_confidence": 0.93,
  "landmark_score": 0.89,
  "ar_recommendation": "landmark_ar"
}
```

---

### S3 · anchor_result

| 字段 | 类型 | 说明 |
|------|------|------|
| `anchor_type` | enum | Phase1 默认 `image_anchor` |
| `descriptor_uri` | string | 特征描述文件 |
| `anchor_score` | object | feature_points · distribution · lighting · texture · total |
| `reference_images` | array | Factory only · 源照片 |

---

### S4 · ar_type_result（FIX-01 · FIX-04）

| 字段 | 类型 | 说明 |
|------|------|------|
| `ar_type` | enum | `landmark_ar` · `world_ar` · `body_ar` · `surface_ar` |
| `ar_recommendation` | string | 推荐说明 |
| `ar_confidence` | number | 0.0–1.0 |

**ar_type 枚举**：

```yaml
ar_type: [landmark_ar, world_ar, body_ar, surface_ar]
```

**推荐规则**：

| 主体 / 场景 | ar_type |
|-------------|---------|
| 古树 | `landmark_ar` |
| 石碑 | `landmark_ar` |
| 建筑 | `landmark_ar` |
| 景观 | `landmark_ar` |
| 景区入口广场 | `world_ar` |
| 大型开放空间 | `world_ar` |
| 游客互动拍照点 | `body_ar` |
| 平面识别物 | `surface_ar` |

输入：S2 `subject_type` · `landmark_score` · `ar_recommendation` + S1 `spot_description` · ingest 上下文。

---

### S5 · standing_guide

| 字段 | 类型 | 说明 |
|------|------|------|
| `guide_uri` | string | 站位图 URI |
| `camera_position` | object | 建议机位 · 距离 · 角度 |
| `rule_params` | object | 规则参数 |

用于 **ARRIVED** 阶段展示。

---

### S6 · scan_guide

| 字段 | 类型 | 说明 |
|------|------|------|
| `guide_uri` | string | 引导图 URI |
| `hint_text` | string | 扫描引导文案 |

---

### S6.5 · alignment_overlay（FIX-03 · P0-005）

| 字段 | 类型 | 说明 |
|------|------|------|
| `overlay_uri` | string | 半透明叠层 |
| `contour_uri` | string | 参考轮廓 SVG/PNG |
| `alignment_threshold` | number | 默认 0.75 |
| `hint_text` | string | 例：「请将古树轮廓与参考轮廓重合」 |
| `alignment_success_text` | string | 例：「对准成功 · 可以开始探索」 |

适用：古树 · 石碑 · 建筑 · 景观 · Landmark AR 轮廓对准。  
用于 **SCANNING** 阶段。

---

### S7 · template_binding（FIX-06）

| 字段 | 类型 | 说明 |
|------|------|------|
| `template_id` | string | 模板 ID |
| `template_confidence` | number | 匹配置信度 |
| `reveal_type` | enum | Reveal Mapping Table 派生 |

**Reveal Mapping Table**（引用 Schema V1.1）：

| template_id | reveal_type |
|-------------|-------------|
| `tpl_landmark_photo_overlay_v1` | `trace_reveal` |
| `tpl_landmark_static_reveal_v1` | `atlas_reveal` |
| `tpl_landmark_lottie_blessing_v1` | `mark_reveal` |
| `tpl_landmark_scan_hint_v1` | `trace_reveal` |

---

### S8 · factory_package（FIX-04）

Schema：`loveqigu.ar_factory.factory_package.v1`

| 区块 | 内容 |
|------|------|
| `ar_entity` | ar_id · exploration_point_id · status=draft · ar_type · reveal_type（来自 S7） |
| `ar_anchor` | S3 anchor_result |
| `ar_guidance` | standing_guide · scan_guide · alignment_overlay |
| `template_binding` | S7 输出 |
| `activity_binding` | S8 组装 · 活动 AR 时必填（FIX-09） |
| `navigation_binding` | S8 组装 · FIX-08 |
| `review_payload` | review_status · pipeline_version · template_confidence · classifier_result |

Factory 阶段 **仅** 产出 factory_package · 不产出 runtime_package。

---

### navigation_binding（FIX-08 · S8 组装）

| 字段 | 来源 |
|------|------|
| `latitude` | ingest gps_location 或探索点 registry |
| `longitude` | 同上 |
| `arrival_radius_m` | 默认 30 · 可配置 |
| `distance` | 运行时更新 · Phase1 可为 null |
| `eta` | 运行时更新 · Phase1 可为 null |
| `nearby_points_ref` | 探索点 registry |

用于：Explore Map → Navigation → Arrival。

---

### activity_binding（FIX-09 · S8 组装）

| 字段 | 说明 |
|------|------|
| `activity_id` | 活动实例 · 非活动 AR 为 null |
| `blessing_stamp` | 福印发放配置 |
| `activity_progress` | 活动进度键 + increment |
| `reward_mapping` | 福礼 / 活动积分 |
| `rights_center_route` | 权益中心路由 |

用于：接福 · 集福 · 纳福 · 福礼领取 · 权益中心。

---

### S10 · publish_build()（FIX-05）

```text
factory_package（review_status = approved）
  ↓
publish_build()
  ↓
runtime_package（loveqigu.ar.runtime.runtime_package.v1）
  ↓
data/ar/runtime/{ar_id}/runtime_package.json
  ↓
publish_record
```

runtime_package 结构 **完全符合** `AR_FACTORY_RUNTIME_SCHEMA_V1.1` · 剥离 review_payload · reference_images · classifier_result。

---

## Workflow

### 标准流水线

```text
上传照片 + 元数据（ingest_record）
  → S1 INGEST
  → S2 SUBJECT（subject_type · confidence · landmark_score · ar_recommendation）
  → S3 ANCHOR（image_anchor · descriptor · anchor_score）
  → S4 AR_TYPE（ar_type · ar_confidence）
  → S5 STANDING（standing_guide · camera_position）
  → S6 GUIDE（scan_guide）
  → S6.5 ALIGNMENT（alignment_overlay）
  → S7 TEMPLATE（template_id · template_confidence · reveal_type）
  → S8 CONFIG（factory_package）
  → S9 REVIEW（人工）
  → S10 PUBLISH（publish_build → runtime_package）
```

### PoC：爱企谷 · 古树 · 3 张照片

```text
上传 3 张古树照片
  → 识别主体（ancient_tree · landmark_ar）
  → 提取锚点 · 评分
  → AR 类型确认 landmark_ar
  → 生成站位图 · 引导图 · alignment_overlay
  → 匹配模板 · 派生 reveal_type
  → 组装 factory_package
  → 人工审核
  → publish_build → runtime_package
  → C 端 AR 体验
```

### 失败与回退

| 失败点 | 行为 |
|--------|------|
| 主体识别失败 | `needs_manual_subject` · 运营框选 · 重跑 S4–S8 |
| 锚点分 < 0.50 | 强制 `tpl_landmark_scan_hint_v1` · trace_reveal |
| ar_confidence < 0.70 | 人工确认 ar_type |
| 模板 confidence < 0.70 | 人工模板选择 |
| alignment 生成失败 | 降级 scan_guide only · 标记 partial_alignment |
| 审核驳回 | 保留 factory_package · 可重跑 S5–S8 |
| Schema 校验失败 | 阻断 S9 · stage_error |

---

## Runtime Mapping（FIX-11）

| Stage 产出 | Schema | 路径 |
|------------|--------|------|
| factory_package | `loveqigu.ar_factory.factory_package.v1` | `data/ar_factory/drafts/{draft_id}/` |
| runtime_package | `loveqigu.ar.runtime.runtime_package.v1` | `data/ar/runtime/{ar_id}/` |
| publish_record | `loveqigu.ar_factory.publish_record.v1` | `runtime/registry/releases.json` |

**上游对齐**：

```yaml
runtime_schema: AR_FACTORY_RUNTIME_SCHEMA_V1.1  # FROZEN
interaction_architecture: AR_INTERACTION_ARCHITECTURE_V1.1  # FROZEN
template_library: AR_TEMPLATE_LIBRARY_V1
```

### Interaction V1.1 映射

| Pipeline 字段 | Interaction 对象 / 状态 |
|---------------|-------------------------|
| navigation_binding | NAVIGATING · explore-map |
| standing_guide | ARRIVED |
| alignment_overlay | SCANNING |
| ar_anchor | ANCHOR_LOCKED |
| template_binding.reveal_type | REVEALING |
| activity_binding | Activity Completion Flow |
| rights_center_route | 权益中心 |

```yaml
pipeline_version: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
```

---

## Governance Rules

1. S9 Review **不可跳过** · S10 publish_build **不可自动触发**（Phase1）。
2. Factory **仅** 产出 factory_package · C 端 **仅** 消费 runtime_package。
3. `reveal_type` **仅** 经 Reveal Mapping Table 派生 · 禁止双轨定义。
4. `landmark_ar` 须含完整 `alignment_overlay`（S6.5）。
5. 活动 AR 须配 `activity_binding` · 禁止活动路径使用 `relic_reveal`。
6. 失败保留 raw + stage_error · 便于 PoC 调试。
7. Orchestrator 调度 · Factory 生产 · Review 验收 · Runtime 运行。

---

## Automation Boundary（FIX-12）

### AUTO_READY

```text
上传（S1）
主体识别（S2）
锚点生成（S3）
站位图（S5）
引导图（S6）
alignment_overlay（S6.5）
模板匹配（S7 · 高 confidence）
factory_package 组装（S8）
```

### PARTIAL_READY

```text
AR 类型推荐（S4 · ar_confidence < 0.70）
低置信度模板（S7 · template_confidence < 0.70）
低质量图片 / 低锚点分
alignment 降级（partial_alignment）
GPS/介绍缺失（Phase1 可空）
```

### MANUAL_REQUIRED

```text
S9 REVIEW
S10 PUBLISH（publish_build）
上线发布 · 可发布 AR 节点生效
```

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | S1–S10 + S6.5 完整 · I/O 明确 | 文档评审 |
| AC-2 | PoC 古树 3 张可逐步映射 | 工程走查 |
| AC-3 | 失败回退完整 | 工程评审 |
| AC-4 | 与 Phase1 Freeze 一致 | 对照 LANDMARK_AR_AUTOGEN_PHASE1_FREEZE_V1 |
| AC-5 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |
| **AC-11** | **S4 AR_TYPE 存在** | 审查闭环 |
| **AC-12** | **alignment_overlay 存在（S6.5）** | 审查闭环 |
| **AC-13** | **factory_package 存在（S8）** | 审查闭环 |
| **AC-14** | **publish_build() 存在（S10）** | 审查闭环 |
| **AC-15** | **runtime_package 存在** | 审查闭环 |
| **AC-16** | **reveal_type 存在（S7）** | 审查闭环 |
| **AC-17** | **navigation_binding 存在** | 审查闭环 |
| **AC-18** | **activity_binding 存在** | 审查闭环 |

```yaml
LANDMARK_AR_AUTOGEN_PIPELINE_V1.1_REVIEW: PASS
LANDMARK_AR_AUTOGEN_PIPELINE_V1.1: FROZEN
CURRENT_ACTIVE_AUTOGEN_PIPELINE: LANDMARK_AR_AUTOGEN_PIPELINE_V1.1
PHASE1_CAN_BUILD: YES
READY_FOR_ENGINEERING_VALIDATION: YES
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
review_score: 94
approved_for_runtime: true
```

### 冻结依据

```yaml
upstream_frozen:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.1.md
```

### 冻结结论 · Phase1 自动化

```text
主体识别 · 锚点生成 · AR 类型推荐 · 站位图生成 · 引导图生成
alignment_overlay 生成 · 模板匹配 · factory_package 生成
```

### Phase1 人工

```text
S9 REVIEW · S10 PUBLISH · 上线发布
```

### 冻结定义

**允许**：

```text
上传 → 自动分析 → 自动草稿 → 人工审核 → 发布
```

**禁止定义为**：

```text
上传 → 自动上线
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 | Cursor |
| **V1.1** | **2026-06-16** | **审查修订 · FIX-01–FIX-12 · 对齐 Schema/Interaction V1.1** | **Cursor** |
| V1.1-freeze | 2026-06-16 | 审查通过 · FROZEN · review_score 94 · approved_for_runtime | Cursor |

### V1.1 修订项对照

| Fix ID | 内容 |
|--------|------|
| FIX-01 | S4 AR_TYPE |
| FIX-02 | S2 SUBJECT 扩展 |
| FIX-03 | S6.5 ALIGNMENT |
| FIX-04 | S8 factory_package |
| FIX-05 | S10 publish_build() |
| FIX-06 | S7 reveal_type 派生 |
| FIX-07 | ingest_record 扩展 |
| FIX-08 | navigation_binding |
| FIX-09 | activity_binding |
| FIX-10 | ARRIVED / SCANNING 映射 |
| FIX-11 | Runtime Mapping V1.1 |
| FIX-12 | 自动化边界声明 |
