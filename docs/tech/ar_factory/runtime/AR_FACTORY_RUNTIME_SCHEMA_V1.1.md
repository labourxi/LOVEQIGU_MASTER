# AR_FACTORY_RUNTIME_SCHEMA_V1.1

# AR Factory Runtime Schema V1.1

---

## Status

```yaml
document_id: AR_FACTORY_RUNTIME_SCHEMA_V1.1
version: V1.1
status: FROZEN
review_batch: AR_FACTORY_RUNTIME_SCHEMA_V1.1_REVISION_TASK
freeze_date: 2026-06-16
updated_at: 2026-06-16
owner: Engineering / AR Factory
priority: P0
current_active_runtime_schema: true
supersedes: AR_FACTORY_RUNTIME_SCHEMA_V1
upstream:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
  - docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW.md
index: docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
freeze_basis:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
fixes_applied:
  - P0-001 alignment_overlay
  - P0-002 reveal_type
  - P0-003 AR_RUNTIME_FLOW
  - P0-004 Factory/Runtime Separation
  - P1-002 Activity Flow
  - P1-003 Navigation Layer
  - P1-004 AR_ENTITY
```

---

## Purpose

定义 AR Factory 与 Runtime 之间的 **双层 JSON Schema 契约**（Factory Package · Runtime Package），确保：

```text
Factory 产出 → Schema 校验 → publish_build() → Runtime 消费 → C 端 V1.1 Interaction 加载
```

V1.1 相对 V1 解决专项审查 **P0-001 – P0-004** 及 **P1-002 – P1-004**。

Schema 前缀：

```text
loveqigu.ar_factory.*.v1   — Factory Package（生产 · 审核）
loveqigu.ar.runtime.*.v1   — Runtime Package（发布 · C 端消费）
```

---

## Scope

### In Scope

- Runtime 实体：`ar_entity` · `ar_guidance` · `anchor` · `activity_binding` · `navigation_binding`
- Factory 实体：`factory_package` · `publish_record`
- AR_RUNTIME_FLOW · Runtime State Mapping
- Reveal Mapping Table（template_id → reveal_type）
- `publish_build()` 发布规则

### Out of Scope

- 数据库表设计 · API 路由
- CV 算法内部结构 · Prompt / Classifier 日志持久化格式
- miniapp 渲染实现

---

## Architecture

### 双层结构（FIX-08）

```text
┌─────────────────────────────────────────────────────────────┐
│  Factory Package（loveqigu.ar_factory.*.v1）                   │
│  允许：review_status · pipeline_version · reference_images   │
│        template_confidence · classifier_result               │
├─────────────────────────────────────────────────────────────┤
│  Review Gate → publish_build()                               │
├─────────────────────────────────────────────────────────────┤
│  Runtime Package（loveqigu.ar.runtime.*.v1）                   │
│  禁止：review_status · pipeline_version · reference_images   │
│        classifier_result                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    miniapp · explore-map · ar-entry
```

### AR_RUNTIME_FLOW（FIX-03）

标准 Runtime 流程 · 映射 `AR_INTERACTION_ARCHITECTURE_V1.1`：

```text
navigation
  ↓
arrival
  ↓
scanning
  ↓
anchor_lock
  ↓
interaction
  ↓
reveal
  ↓
completion
```

### 系统位置

```text
LANDMARK_AR_AUTOGEN_PIPELINE_V1
        ↓
Factory Package（S8 组装）
        ↓
Review Gate
        ↓
publish_build()
        ↓
Runtime Package（ar_entity + bindings）
        ↓
AR_INTERACTION_ARCHITECTURE_V1.1 状态机
```

---

## Components

### FIX-01 · `loveqigu.ar.runtime.ar_entity.v1`

Runtime 发布核心实体 · C 端主索引对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ar_id` | string | ✓ | AR 实体 UUID |
| `exploration_point_id` | string | ✓ | 探索点 ID（统一命名） |
| `status` | enum | ✓ | 见下表 |
| `ar_type` | enum | ✓ | 见下表 |
| `reveal_type` | enum | ✓ | 见下表 · 由 Reveal Mapping 派生 |
| `runtime_version` | string | ✓ | `AR_FACTORY_RUNTIME_SCHEMA_V1.1` |
| `created_at` | ISO8601 | ✓ | 创建时间 |
| `updated_at` | ISO8601 | ✓ | 更新时间 |

**status 枚举**：

```yaml
status: [draft, review, published, disabled, archived]
```

**ar_type 枚举**：

```yaml
ar_type: [landmark_ar, world_ar, body_ar, surface_ar]
```

**reveal_type 枚举**（FIX-02 · 对齐 V1.1）：

```yaml
reveal_type: [trace_reveal, mark_reveal, record_reveal, relic_reveal, atlas_reveal]
```

---

### FIX-02 · `loveqigu.ar.runtime.ar_guidance.v1`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `standing_guide` | object | ✓ | 站位图 · URI · 规则参数 |
| `scan_guide` | object | ✓ | 引导图 · URI · 文案 |
| `alignment_overlay` | object | ✓ | 轮廓对准层 · 见下表 |

**standing_guide**

| 字段 | 类型 | 必填 |
|------|------|------|
| `guide_uri` | string | ✓ |
| `rule_params` | object | — |

**scan_guide**

| 字段 | 类型 | 必填 |
|------|------|------|
| `guide_uri` | string | ✓ |
| `hint_text` | string | ✓ |

**alignment_overlay**（P0-001 · Landmark AR）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `overlay_uri` | string | ✓ | 半透明叠层资源 |
| `contour_uri` | string | ✓ | 参考轮廓 SVG/PNG |
| `alignment_threshold` | number | ✓ | 重合度阈值 · 0.0–1.0 |
| `hint_text` | string | ✓ | 例：「请将古树轮廓与参考轮廓重合」 |
| `alignment_success_text` | string | ✓ | 例：「对准成功 · 可以开始探索」 |

适用场景：古树 · 石碑 · 建筑 · 景观 · 轮廓对准。

---

### FIX-07 · `loveqigu.ar.runtime.anchor.v1`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `anchor_type` | enum | ✓ | 见下表 |
| `anchor_payload` | object | ✓ | 类型相关载荷 |

**anchor_type 枚举**：

```yaml
anchor_type: [image_anchor, gps_anchor, body_anchor]
```

| anchor_type | anchor_payload 要点 | 场景 |
|-------------|---------------------|------|
| `image_anchor` | `descriptor_uri` · `detector` · `feature_count` · `score` | Landmark AR |
| `gps_anchor` | `latitude` · `longitude` · `radius_m` | World AR · 到达判定 |
| `body_anchor` | `body_model_ref` · `joint_set` | Body AR |

Runtime Package **禁止** 包含 `reference_images`（仅 Factory）。

---

### FIX-05 · `loveqigu.ar.runtime.activity_binding.v1`

支持接福 · 集福 · 纳福 · 活动积分 · 福礼领取 · 权益中心。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `activity_id` | string | — | 活动实例 ID · 非活动 AR 可为 null |
| `blessing_stamp` | object | — | 福印发放配置 |
| `activity_progress` | object | — | 活动进度写入规则 |
| `reward_mapping` | object | — | 福礼 / 积分映射 |
| `rights_center_route` | string | — | 权益中心跳转路由 |

**blessing_stamp**

| 字段 | 类型 | 说明 |
|------|------|------|
| `stamp_id` | string | 福印类型 ID |
| `grant_on_completion` | boolean | 完成时发放 |

**activity_progress**

| 字段 | 类型 | 说明 |
|------|------|------|
| `progress_key` | string | 活动进度键 |
| `increment` | number | 完成增量 |

**reward_mapping**

| 字段 | 类型 | 说明 |
|------|------|------|
| `reward_type` | enum | `blessing_stamp` · `activity_points` · `fortune_gift` |
| `reward_ref` | string | 奖励引用 ID |

活动 AR **不强制** 进入主线信物体系 · `relic_reveal` 与 activity_binding 互斥。

---

### FIX-06 · `loveqigu.ar.runtime.navigation_binding.v1`

支持 Explore Map → Navigation → Arrival。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `latitude` | number | ✓ | 探索点纬度 |
| `longitude` | number | ✓ | 探索点经度 |
| `arrival_radius_m` | number | ✓ | ARRIVED 判定半径（米） |
| `distance` | number | — | 运行时距离 · 会话态可更新 |
| `eta` | number | — | 预计到达秒数 · 会话态可更新 |
| `nearby_points_ref` | array | — | 附近探索点 ID 列表 |

`distance` · `eta` 可由 C 端 `navigation_session` 本地更新 · Schema 定义字段契约。

---

### FIX-09 · Reveal Mapping Table

**禁止** Template Library `ar_type` 与 Reveal Types 双轨定义。  
**统一规则**：`template_id` → `reveal_type`（发布时由 `publish_build()` 写入 `ar_entity.reveal_type`）。

| template_id | reveal_type |
|-------------|-------------|
| `tpl_landmark_photo_overlay_v1` | `trace_reveal` |
| `tpl_landmark_static_reveal_v1` | `atlas_reveal` |
| `tpl_landmark_lottie_blessing_v1` | `mark_reveal` |
| `tpl_landmark_scan_hint_v1` | `trace_reveal` |
| *(主线专用)* | `relic_reveal` |
| *(故事/回响模板)* | `record_reveal` |

派生规则：

```text
publish_build(): reveal_type = REVEAL_MAPPING_TABLE[template_id]
```

---

### Factory Package · `loveqigu.ar_factory.factory_package.v1`

Pipeline S8 产出 · **仅 Factory 侧** · 不进入 C 端 Runtime。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `draft_id` | string | ✓ | 草稿 UUID |
| `exploration_point_id` | string | ✓ | 探索点 ID |
| `pipeline_version` | string | ✓ | `LANDMARK_AR_AUTOGEN_PIPELINE_V1` |
| `review_status` | enum | ✓ | `draft` · `pending_review` · `approved` · `rejected` |
| `template_ref` | string | ✓ | 模板 ID |
| `template_confidence` | number | ✓ | 匹配置信度 |
| `classifier_result` | object | — | AI 分类 / 主体识别摘要 |
| `anchor_set` | object | ✓ | 含 `reference_images`（Factory only） |
| `ar_guidance_draft` | object | ✓ | standing · scan · alignment 草稿 |
| `interaction_script` | string | ✓ | 交互脚本 ID |
| `reveal_assets` | array | ✓ | 揭示资产引用 |
| `completion_event` | string | ✓ | 完成事件码 |
| `created_at` | ISO8601 | ✓ | 创建时间 |

**Factory anchor_set 扩展**（含 Factory-only 字段）：

| 字段 | Factory | Runtime |
|------|---------|---------|
| `reference_images` | ✓ 允许 | ❌ 禁止 |
| `descriptor_uri` | ✓ | ✓（经 strip 后写入 anchor_payload） |
| `score` | ✓ | ✓ |

---

### Runtime Package · `loveqigu.ar.runtime.runtime_package.v1`

`publish_build()` 输出 · C 端唯一消费包。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `schema_id` | string | ✓ | `loveqigu.ar.runtime.runtime_package.v1` |
| `ar_entity` | object | ✓ | § ar_entity.v1 |
| `ar_guidance` | object | ✓ | § ar_guidance.v1 |
| `anchor` | object | ✓ | § anchor.v1 |
| `navigation_binding` | object | ✓ | § navigation_binding.v1 |
| `activity_binding` | object | — | § activity_binding.v1 · 活动 AR 必填 |
| `interaction_script` | string | ✓ | 交互脚本 ID |
| `reveal_assets` | array | ✓ | 揭示资产 |
| `completion_event` | string | ✓ | 完成事件码 |
| `runtime_compat` | string | ✓ | `miniapp_ar_v1` |
| `published_at` | ISO8601 | ✓ | 发布时间 |

**Runtime Package 禁止字段**：

```yaml
forbidden: [review_status, pipeline_version, reference_images, classifier_result, template_confidence]
```

---

### `loveqigu.ar_factory.publish_record.v1`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `publish_id` | string | ✓ | 发布 ID |
| `draft_id` | string | ✓ | 源 Factory draft |
| `ar_id` | string | ✓ | Runtime ar_entity.ar_id |
| `runtime_package_uri` | string | ✓ | Runtime 包路径 |
| `registry_ref` | string | ✓ | registry 路径 |
| `published_at` | ISO8601 | ✓ | 发布时间 |
| `published_by` | string | ✓ | 操作员 |

---

### FIX-04 · Runtime State Mapping

| V1.1 交互状态 | AR_RUNTIME_FLOW 阶段 | Runtime 消费对象 |
|---------------|----------------------|------------------|
| `NAVIGATING` | `navigation` | `navigation_binding` · explore-map |
| `ARRIVED` | `arrival` | `navigation_binding.arrival_radius_m` · `ar_guidance` |
| `SCANNING` | `scanning` | `anchor` · `ar_guidance.alignment_overlay` |
| `ANCHOR_LOCKED` | `anchor_lock` | `anchor.anchor_payload` |
| `INTERACTING` | `interaction` | `interaction_script` |
| `REVEALING` | `reveal` | `ar_entity.reveal_type` · `reveal_assets` |
| `COMPLETED` | `completion` | `completion_event` · `activity_binding` |

---

### 枚举与阈值

```yaml
factory_review_status: [draft, pending_review, approved, rejected]
pipeline_stage: [ingest, analyze, template_match, draft_gen, review, publish]
anchor_score_min_publish: 0.65
template_confidence_auto: 0.70
alignment_threshold_default: 0.75
arrival_radius_m_default: 30
```

---

## Workflow

### Schema 校验流

```text
Pipeline Stage 产出
  → Validator（factory schema id + version）
  → 通过 → data/ar_factory/drafts/{draft_id}/
  → 失败 → stage_error
```

### 发布校验流 · publish_build()（FIX-08）

```text
factory_package.review_status = approved
  → 校验 anchor score >= anchor_score_min_publish
  → REVEAL_MAPPING_TABLE[template_ref] → reveal_type
  → strip forbidden fields（reference_images · classifier_result · …）
  → 组装 runtime_package（ar_entity + ar_guidance + anchor + bindings）
  → ar_entity.status = published
  → 写入 data/ar/runtime/{ar_id}/runtime_package.json
  → 生成 publish_record
  → 注册 runtime/registry + registry/runtime_registry.json
```

### AR_RUNTIME_FLOW 用户旅程

```text
1. navigation   — 探索地图 · GPS · distance · eta
2. arrival      — 进入 arrival_radius_m · 展示 ar_guidance
3. scanning     — 相机 · alignment_overlay 可选
4. anchor_lock  — 锚点稳定
5. interaction  — interaction_script
6. reveal       — reveal_type 分支 · reveal_assets
7. completion   — completion_event · activity_binding · rights_center_route
```

---

## Runtime Mapping

| 对象 | Schema | 路径 | 消费方 |
|------|--------|------|--------|
| Factory Package | `loveqigu.ar_factory.factory_package.v1` | `data/ar_factory/drafts/{draft_id}/` | Admin · Review |
| Runtime Package | `loveqigu.ar.runtime.runtime_package.v1` | `data/ar/runtime/{ar_id}/` | miniapp |
| ar_entity | `loveqigu.ar.runtime.ar_entity.v1` | runtime_package 内 | ar-entry |
| ar_guidance | `loveqigu.ar.runtime.ar_guidance.v1` | runtime_package 内 | ar-entry |
| navigation_binding | `loveqigu.ar.runtime.navigation_binding.v1` | runtime_package 内 | explore-map |
| activity_binding | `loveqigu.ar.runtime.activity_binding.v1` | runtime_package 内 | 活动引擎 · rights-center |
| publish_record | `loveqigu.ar_factory.publish_record.v1` | `runtime/registry/releases.json` | Admin |

### miniapp 页面映射

| 页面 | Runtime 对象 |
|------|--------------|
| `pages/explore-map/` | `navigation_binding` · NAVIGATING |
| `pages/ar-entry/` | `ar_entity` · `ar_guidance` · `anchor` · ARRIVED→COMPLETED |
| `pages/lottie/` | `mark_reveal` · `trace_reveal` |
| `pages/echo/` | `record_reveal` |
| `pages/relic-archive/` | `atlas_reveal` · `relic_reveal` |
| `pages/rights-center/` | `activity_binding.rights_center_route` |

### 全链路

```text
Explore Map → Navigation → AR → Activity → Rights Center
     ↑            ↑          ↑       ↑            ↑
navigation_   navigation_  runtime_ activity_   reward_
binding       binding      package binding     mapping
```

---

## Governance Rules

1. **Factory / Runtime 分离**：C 端 **仅** 加载 `runtime_package` · 禁止读取 Factory draft。
2. **字段命名**：`exploration_point_id` 为 Runtime 标准名 · Factory 迁移期可接受 `explore_point_id` alias。
3. **reveal_type 单一来源**：仅 Reveal Mapping Table 派生 · 禁止 Template Library 独立定义 reveal 语义。
4. **relic_reveal 隔离**：活动 AR 禁止 `relic_reveal` · 须配 `activity_binding`。
5. **alignment_overlay 必填**：`landmark_ar` 类型 Runtime Package 须含完整 `alignment_overlay`。
6. **Schema 变更**：须版本递增 · 不得 silent break `miniapp_ar_v1`。
7. **upstream 对齐**：字段与 `AR_INTERACTION_ARCHITECTURE_V1.1` 对象表一致。
8. **禁止泄漏**：Prompt · AI 推理原文 · Classifier 完整日志 **不得** 进入 Runtime Package。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | Factory + Runtime 双层 Schema 完整 | 文档评审 |
| AC-2 | 与 AR_INTERACTION_ARCHITECTURE_V1.1 对象映射 | 交叉对照 |
| AC-3 | 与 Pipeline S8/S10 阶段对齐 | 交叉对照 Pipeline |
| AC-4 | publish_build() 规则可实施 | 工程评审 |
| AC-5 | 状态 = FROZEN · 索引与注册表已同步 | 索引检查 |
| **AC-11** | **AR_ENTITY 存在** | 专项审查闭环 |
| **AC-12** | **alignment_overlay 存在** | 专项审查闭环 |
| **AC-13** | **AR_RUNTIME_FLOW 存在** | 专项审查闭环 |
| **AC-14** | **Activity Binding 存在** | 专项审查闭环 |
| **AC-15** | **Navigation Binding 存在** | 专项审查闭环 |
| **AC-16** | **Factory / Runtime 已分离** | 专项审查闭环 |

```yaml
AR_FACTORY_RUNTIME_SCHEMA_V1.1_REVIEW: PASS
AR_FACTORY_RUNTIME_SCHEMA_V1.1: FROZEN
CURRENT_ACTIVE_RUNTIME_SCHEMA: AR_FACTORY_RUNTIME_SCHEMA_V1.1
READY_FOR_RUNTIME_IMPLEMENTATION: YES
```

---

## Freeze Record

```yaml
freeze_status: FROZEN
freeze_date: 2026-06-16
review_result: PASS
review_score: 91
approved_for_runtime: true
```

### 冻结依据

```yaml
upstream_frozen:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
upstream_aligned:
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
  - docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
```

### 冻结结论

已支持全链路：

```text
Explore Map → Navigation → Arrival → AR → Activity → Rights Center
```

已支持能力：

```text
alignment_overlay · reveal_type · activity_binding · navigation_binding
Factory Runtime Separation · AR_RUNTIME_FLOW
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 | Cursor |
| **V1.1** | **2026-06-16** | **专项审查修订 · FIX-01–FIX-10 · 双层 Package · 对齐 V1.1 交互架构** | **Cursor** |
| V1.1-freeze | 2026-06-16 | 审查通过 · FROZEN · review_score 91 · approved_for_runtime | Cursor |

### V1.1 修订项对照

| Fix ID | 内容 |
|--------|------|
| FIX-01 | `loveqigu.ar.runtime.ar_entity.v1` |
| FIX-02 | `loveqigu.ar.runtime.ar_guidance.v1` + alignment_overlay |
| FIX-03 | AR_RUNTIME_FLOW |
| FIX-04 | Runtime State Mapping |
| FIX-05 | `activity_binding.v1` |
| FIX-06 | `navigation_binding.v1` |
| FIX-07 | `anchor.v1` |
| FIX-08 | Factory / Runtime Separation + publish_build() |
| FIX-09 | Reveal Mapping Table |
| FIX-10 | AC-11 – AC-16 |
