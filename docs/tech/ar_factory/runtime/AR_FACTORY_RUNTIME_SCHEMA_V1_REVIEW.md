# AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW

# AR Factory Runtime Schema V1 专项审查报告

---

## Status

```yaml
document_id: AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW
version: V1
status: APPROVED_FOR_REVISION
review_type: SPECIALIZED_CROSS_VALIDATION
review_date: 2026-06-16
review_batch: AR_FACTORY_RUNTIME_SCHEMA_V1_SPECIAL_REVIEW
target_document: AR_FACTORY_RUNTIME_SCHEMA_V1
target_path: docs/tech/ar_factory/runtime/AR_FACTORY_RUNTIME_SCHEMA_V1.md
upstream_frozen:
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.1.md
upstream_review:
  - docs/tech/ar_factory/pipeline/LANDMARK_AR_AUTOGEN_PIPELINE_V1.md
  - docs/tech/ar_factory/templates/AR_TEMPLATE_LIBRARY_V1.md
owner: Engineering / AR Factory
reviewer: Cursor
```

---

## Purpose

验证 `AR_FACTORY_RUNTIME_SCHEMA_V1` 是否能够支撑：

```text
AR_INTERACTION_ARCHITECTURE_V1.1（已冻结）
LANDMARK_AR_AUTOGEN_PIPELINE_V1
Explore Map → Navigation → AR → Activity → Rights Center 完整链路
```

并识别：字段缺失 · 结构重复 · Runtime 无法映射 · Factory/Runtime 边界混乱等问题。

---

## Scope

### 审查范围

- Part 1 · AR_ENTITY
- Part 2 · AR_GUIDANCE（含 alignment_overlay）
- Part 3 · AR_ANCHOR
- Part 4 · AR_TEMPLATE / Reveal Types
- Part 5 · AR_RUNTIME_FLOW
- Part 6 · Activity Flow
- Part 7 · Navigation Layer
- Part 8 · Factory Boundary

### 不在本次范围

- JSON Schema 实现代码
- miniapp 页面实现
- Gemini / OpenCV 参数调优

---

## Executive Summary

| 维度 | 得分 | 说明 |
|------|------|------|
| V1.1 交互架构支撑度 | 38/100 | 缺 AR_ENTITY · reveal_type · alignment_overlay · Runtime Flow |
| Pipeline 支撑度 | 72/100 | draft_package 可承载 S8 产出 · 发布态与 Factory 草稿未分离 |
| 全链路支撑度 | 45/100 | Navigation / Activity / Rights 链路不完整 |
| Factory/Runtime 边界 | 55/100 | review_status · draft 结构混入 Runtime 路径 |
| **综合评分** | **52/100** | |

```yaml
review_result: PASS_WITH_MODIFICATION
overall_score: 52
p0_count: 4
p1_count: 5
can_freeze: false
final_verdict: PASS_WITH_MODIFICATION
```

存在 **P0 缺陷**（`alignment_overlay` 缺失等），按审查规则 **不可直接冻结**。Pipeline Phase1 地标草稿链路可部分跑通，但 **无法完整支撑已冻结的 V1.1 交互架构**，须修订为 V1.1 Schema 后复审。

---

## Part 1 · AR_ENTITY

### 审查结论：FAIL

当前 Schema **未定义** `AR_ENTITY`（或等价的 Runtime 发布实体）。字段分散在 `draft_package` / `ar_config` 中，且不完整。

| 要求字段 | 当前状态 | 位置 |
|----------|----------|------|
| `ar_id` | ❌ 缺失 | 仅有 `ar_config.config_id` · 语义不等价 |
| `exploration_point_id` | ⚠️ 部分 | `draft_package.explore_point_id`（命名不一致） |
| `status` | ❌ 缺失 | Runtime 实体无 lifecycle 状态 |
| `ar_type` | ❌ 缺失 | 无 Landmark / World / Body 分类 |
| `reveal_type` | ❌ 缺失 | V1.1 要求 `ar_config.reveal_type` · Schema 未定义 |

### Reveal Types 映射验证

V1.1 冻结五类：

```text
trace_reveal · mark_reveal · record_reveal · relic_reveal · atlas_reveal
```

当前 `ar_config.v1` 仅有 `template_id` · **无 `reveal_type` 枚举** · C 端无法按 Reveal Type 分支渲染。

Template Library 使用 `ar_type`（`static_reveal` / `lottie_reveal` / `scan_hint` / `photo_overlay`），与 V1.1 `reveal_type` **命名空间不一致** → **结构重复 / 语义冲突**。

---

## Part 2 · AR_GUIDANCE

### 审查结论：P0 缺陷

| 对象 | 要求 | 当前状态 |
|------|------|----------|
| `standing_guide` | ✓ | ✓ 存在于 `draft_package` · 仅「URI + 规则参数」 |
| `scan_guide` | ✓ | ✓ 存在于 `draft_package` |
| `alignment_overlay` | **必须存在** | ❌ **完全缺失** |

V1.1 冻结映射：

```text
alignment_overlay → standing_guide.overlay_uri
```

当前 Schema：

- 无 `alignment_overlay` 独立对象
- `standing_guide` 未定义 `overlay_uri` · `contour_uri` · `alignment_threshold` 等字段
- Runtime Mapping 表未列出 alignment 层

```yaml
severity: P0
issue_id: P0-001
title: alignment_overlay 未在 Runtime Schema 中定义
impact: Landmark AR 轮廓对准无法从 Factory 发布到 C 端
```

---

## Part 3 · AR_ANCHOR

### 审查结论：PARTIAL · Phase1 Landmark 可覆盖 · World/Body 不可

当前仅 `loveqigu.ar_factory.anchor_set.v1`（ORB+AKAZE 图像锚点）→ 等价于 **`image_anchor` only**。

| 锚点类型 | 要求 | 当前 |
|----------|------|------|
| `image_anchor` | Landmark AR | ✓ 部分覆盖 |
| `gps_anchor` | World AR · 到达判定 | ❌ 缺失 |
| `body_anchor` | Body AR | ❌ 缺失 |

无 `anchor_type` 枚举 · 无多锚点联合结构 · 无法表达 V1.1 `ARRIVED` 的 GPS 到达半径判定。

```yaml
severity: P1
issue_id: P1-001
title: 锚点类型单一 · 仅支持 image_anchor
note: Phase1 Landmark PoC 可接受 · World/Body AR 须 V1.1+ 扩展
```

---

## Part 4 · AR_TEMPLATE

### 审查结论：FAIL · 与 V1.1 / Template Library 不一致

| reveal_type（V1.1） | Schema 支持 | Template Library 对应 |
|---------------------|-------------|----------------------|
| `trace_reveal` | ❌ | `tpl_landmark_photo_overlay_v1` |
| `mark_reveal` | ❌ | `tpl_landmark_lottie_blessing_v1` |
| `record_reveal` | ❌ | `tpl_landmark_static_reveal_v1` |
| `relic_reveal` | ❌ | 主线专用（未在 Template Library 登记） |
| `atlas_reveal` | ❌ | `tpl_landmark_static_reveal_v1` |

问题：

1. Schema 无 `reveal_type` 字段
2. Template Library 用 `ar_type` · 与 V1.1 `reveal_type` **双轨并行**
3. `template_ref`（draft）与 `template_id`（ar_config）重复 · 缺 `reveal_type` 派生规则

```yaml
severity: P0
issue_id: P0-002
title: reveal_type 未入 Schema · 与 Template Library ar_type 冲突
```

---

## Part 5 · AR_RUNTIME_FLOW

### 审查结论：FAIL · 流程章节缺失

Schema 当前 Workflow 仅为：

```text
Schema 校验流
发布校验流
```

**不存在** C 端 Runtime 状态流定义。

V1.1 冻结状态机：

```text
IDLE → NAVIGATING → ARRIVED → SCANNING → ANCHOR_LOCKED → INTERACTING → REVEALING → COMPLETED
```

等价 Runtime Flow（Schema 应定义）：

```text
navigation → arrival → scanning → anchor_lock → interaction → reveal → completion
```

Schema 中 **无任何对应章节**。未出现旧版 `navigation → alignment → recognition → reveal → completion`，但也 **未升级** 至 V1.1 七态模型。

```yaml
severity: P0
issue_id: P0-003
title: 缺少 AR_RUNTIME_FLOW · 无法映射 V1.1 状态机
```

---

## Part 6 · Activity Flow

### 审查结论：FAIL

V1.1 Activity Completion Flow 要求 Runtime 可路由至福印 / 活动积分 / 福礼 / 活动中心。

当前 Schema 仅有 `ar_config.completion_event`（string）· **不足以支撑活动流**。

| 要求字段 | 当前 |
|----------|------|
| `activity_id` | ❌ |
| `blessing_stamp`（福印） | ❌ |
| `activity_progress` | ❌ |
| `reward_mapping` | ❌ |
| `rights_center_route` | ❌ |

```yaml
severity: P1
issue_id: P1-002
title: Activity Completion 字段缺失
impact: Explore Map → AR → Activity → Rights Center 链路在 Schema 层断裂
```

---

## Part 7 · Navigation Layer

### 审查结论：P1 缺陷

V1.1 Layer 0 要求：`navigation_session` · GPS · 距离 · ETA · 附近探索点。

| 字段 | 当前 |
|------|------|
| `gps_navigation` | ❌ |
| `distance` | ❌ |
| `eta` | ❌ |
| `nearby_points` | ❌ |
| `navigation_session` | ❌ |

V1.1 注明导航会话可为「探索地图本地 / 会话态」→ 可不全部持久化至 Factory 产出，但 Runtime Schema **至少应定义**：

- `explore_point.geo`（lat/lng/radius）供 ARRIVED 判定
- `navigation_binding` 引用关系

当前 `explore_point_id` 仅为 string 引用 · 无地理 / 导航配置结构。

```yaml
severity: P1
issue_id: P1-003
title: Navigation Layer 未在 Runtime Schema 定义
```

---

## Part 8 · Factory Boundary

### 审查结论：PARTIAL FAIL · 边界混乱

| 项 | 应在 Factory | 当前 Schema 位置 | 判定 |
|----|-------------|-----------------|------|
| `review_status` | ✓ Factory | `draft_package` | ⚠️ 若进入 Runtime 则违规 |
| `pipeline_version` | ✓ Factory | `draft_package` | ⚠️ 发布态不应保留 |
| `reference_images` | ✓ Factory 源素材 | `anchor_set` | ⚠️ Runtime 仅需 descriptor |
| `template_confidence` | ✓ Factory | 枚举区 | ✓ 文档级 · 可接受 |
| `pipeline_stage` | ✓ Factory | 枚举区 | ✓ 可接受 |
| Prompt / AI 推理 / Classifier 日志 | Factory only | 未出现 | ✓ 未违规 |

**核心问题**：

- 仅有 `draft_package` · **无独立的 `loveqigu.ar.runtime.ar_entity.v1` 发布态 Schema**
- Publish 流程写入 `runtime/registry` 但未定义「从 draft 剥离后的 Runtime 纯净包」
- Factory 草稿与 Runtime 配置 **同一 Schema 混用** → 违反 Factory / Runtime Separation

```yaml
severity: P0
issue_id: P0-004
title: 缺少 Runtime 发布态 Schema · draft_package 与 Runtime 未分离
```

---

## P0 问题汇总

| ID | 问题 | 影响 |
|----|------|------|
| **P0-001** | `alignment_overlay` 未定义 | Landmark AR 对准层无法发布 |
| **P0-002** | `reveal_type` 缺失 · 与 Template Library 双轨冲突 | Reveal 分支渲染失败 |
| **P0-003** | `AR_RUNTIME_FLOW` 缺失 | 无法映射 V1.1 七态状态机 |
| **P0-004** | Factory / Runtime Schema 未分离 | 审核态字段可能泄漏至 C 端 |

---

## P1 问题汇总

| ID | 问题 | 影响 |
|----|------|------|
| P1-001 | 锚点仅 image · 无 gps/body | World/Body AR 不可扩展 |
| P1-002 | Activity Flow 字段缺失 | 活动 → 福礼 → 权益中心链路断裂 |
| P1-003 | Navigation Layer 缺失 | Layer 0 无法 Schema 级绑定 |
| P1-004 | 无独立 `AR_ENTITY` · 字段命名不一致 | 跨文档映射成本高 |
| P1-005 | upstream 仍引用 V1 非 V1.1 | 治理漂移 |

---

## 建议修订项

### 必须（冻结前 · → V1.1 Schema）

| # | 修订项 |
|---|--------|
| R-01 | 新增 `loveqigu.ar.runtime.ar_entity.v1`：`ar_id` · `exploration_point_id` · `status` · `ar_type` · `reveal_type` |
| R-02 | 新增 `loveqigu.ar.runtime.ar_guidance.v1`：`standing_guide` · `scan_guide` · **`alignment_overlay`**（含 `overlay_uri` · `contour_uri` · `alignment_threshold` · `hint_text`） |
| R-03 | 扩展 `ar_config.v1`：新增 `reveal_type` enum（五类）· `runtime_flow` 引用 |
| R-04 | 新增 **AR_RUNTIME_FLOW** 章节：`navigation → arrival → scanning → anchor_lock → interaction → reveal → completion` |
| R-05 | Factory / Runtime 分离：`draft_package` 保留 Factory · Publish 生成 `runtime_package` · 剥离 `review_status` · `reference_images` · `pipeline_version` |
| R-06 | 统一 Template 语义：Template Library 增加 `reveal_type` 或 Schema 定义 `template_id → reveal_type` 派生表 |

### 建议（V1.1 同期或 V1.2）

| # | 修订项 |
|---|--------|
| R-07 | 新增 `loveqigu.ar.runtime.activity_binding.v1`：`activity_id` · `blessing_stamp` · `activity_progress` · `reward_mapping` · `rights_center_route` |
| R-08 | 新增 `loveqigu.ar.runtime.navigation_binding.v1`：`explore_point.geo` · `arrival_radius_m` · `nearby_points_ref` |
| R-09 | 扩展 `loveqigu.ar.runtime.anchor.v1`：`anchor_type` = `image_anchor` \| `gps_anchor` \| `body_anchor` |
| R-10 | 更新 upstream → `AR_INTERACTION_ARCHITECTURE_V1.1` |

---

## 全链路验收

| 链路环节 | Schema 是否支撑 | 说明 |
|----------|----------------|------|
| Explore Map | ⚠️ 部分 | 仅有 `explore_point_id` 字符串引用 |
| Navigation | ❌ | 无 geo / navigation_session / ETA |
| AR（扫描→对准→锚点） | ❌ | 无 alignment_overlay · 无 Runtime Flow |
| Activity | ❌ | 无 activity / 福印 / progress 字段 |
| Rights Center | ⚠️ 部分 | 仅 `completion_event` 字符串 · 无 reward_mapping |

### 对上游文档支撑度

| 文档 | 能否支撑 | 判定 |
|------|----------|------|
| `AR_INTERACTION_ARCHITECTURE_V1.1` | **否** | P0-001/002/003 阻断 |
| `LANDMARK_AR_AUTOGEN_PIPELINE_V1` | **部分** | S8 draft_package 可组装 · S10 发布态 Schema 不足 |

### 未来完整链路

```text
Explore Map → Navigation → AR → Activity → Rights Center
```

**当前 Schema 无法闭合此链路。** Pipeline PoC（上传→草稿→审核）可在 Factory 侧独立验证；Runtime 发布与 C 端消费须 **Schema V1.1 修订** 后方可对齐 V1.1 冻结架构。

---

## Acceptance Criteria

| # | 条件 | 结果 |
|---|------|------|
| AC-1 | 八 Part 审查完整 | ✓ |
| AC-2 | P0 / P1 问题明确列出 | ✓ |
| AC-3 | 建议修订项可执行 | ✓ |
| AC-4 | 全链路验收明确回答 | ✓ |
| AC-5 | 最终结论单一输出 | ✓ |

---

## 是否可以冻结

```yaml
can_freeze: false
reason: 4 × P0 · 与已冻结 V1.1 存在结构性缺口
next_step: 修订为 AR_FACTORY_RUNTIME_SCHEMA_V1.1 · 消除 P0 后复审
```

---

## 最终结论

```
PASS_WITH_MODIFICATION
```

```yaml
AR_FACTORY_RUNTIME_SCHEMA_V1_REVIEW:
  result: PASS_WITH_MODIFICATION
  score: 52
  p0_count: 4
  p1_count: 5
  supports_v1_1_interaction: false
  supports_landmark_pipeline: partial
  supports_full_user_journey: false
  ready_for_freeze: false
  ready_for_freeze_verdict: NOT_READY
```

**明确回答**：

- `AR_FACTORY_RUNTIME_SCHEMA_V1` **尚不能** 完整支撑 `AR_INTERACTION_ARCHITECTURE_V1.1`
- `AR_FACTORY_RUNTIME_SCHEMA_V1` **部分能** 支撑 `LANDMARK_AR_AUTOGEN_PIPELINE_V1`（Factory 草稿侧）
- **不能** 支撑 Explore Map → Navigation → AR → Activity → Rights Center 完整链路

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1 | 2026-06-16 | 专项审查报告 · 对照 V1.1 冻结交互架构 | Cursor |
