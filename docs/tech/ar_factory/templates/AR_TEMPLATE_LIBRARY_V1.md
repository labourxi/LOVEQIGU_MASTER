# AR_TEMPLATE_LIBRARY_V1

# AR 模板库 V1

---

## Status

```yaml
document_id: AR_TEMPLATE_LIBRARY_V1
version: V1
status: REVIEW
review_batch: TODAY_DOCUMENT_BUILD_BATCH_V1
updated_at: 2026-06-07
owner: Product / AR Factory
priority: P0
upstream:
  - docs/tech/ar_factory/AR_FACTORY_ARCHITECTURE_V1.md
  - docs/product/ar/AR_INTERACTION_ARCHITECTURE_V1.md
index: docs/tech/ar_factory/AR_FACTORY_INDEX_V1.md
```

---

## Purpose

定义 Phase1 **Template Driven** AR 配置的可复用模板集合。

Pipeline 通过模板匹配产出 `ar_config.template_id`，使 Factory 草稿生成 **可预测、可审核、可复用**。

---

## Scope

### In Scope

- 模板结构定义
- Phase1 四类地标模板
- 匹配规则与置信度阈值
- 与 interaction_script / reveal_asset 的默认绑定

### Out of Scope

- 复杂 3D 模板
- 自定义脚本引擎实现
- Lottie 资产制作规范（见 Lottie Library）

---

## Architecture

```text
Analyze 输出（主体类型 + 锚点评分 + 活动标签）
        ↓
Template Matcher
        ↓
template_id + confidence
        ↓
ar_config 组装（Draft Generator）
        ↓
C 端 Interaction 按 template 渲染
```

---

## Components

### 模板结构

| 组件 | 说明 |
|------|------|
| `template_id` | 唯一标识 |
| `display_name` | 运营可读名称 |
| `ar_type` | 交互类型枚举 |
| `interaction_script` | 默认交互脚本 ID |
| `reveal_slot` | 揭示资产槽位定义 |
| `completion_event` | 默认完成事件码 |
| `anchor_requirements` | 最低锚点分 · 最少特征点 |
| `guide_template` | 引导图文案模板 ID |

### Phase1 模板清单

| template_id | display_name | ar_type | 典型场景 |
|-------------|--------------|---------|----------|
| `tpl_landmark_static_reveal_v1` | 地标静态揭示 | `static_reveal` | 古树 · 石碑 · 固定地标 |
| `tpl_landmark_lottie_blessing_v1` | 地标接福 Lottie | `lottie_reveal` | 接福活动探索点 |
| `tpl_landmark_scan_hint_v1` | 地标扫描引导 | `scan_hint` | 锚点弱 · 需站位引导 |
| `tpl_landmark_photo_overlay_v1` | 地标照片叠层 | `photo_overlay` | 2D 叠层 · PoC 默认回退 |

### 匹配规则

```text
输入: 主体类型 + 锚点评分 + 活动类型 + 探索点标签
输出: template_id + confidence

confidence >= 0.70 → AUTO_READY（自动匹配）
confidence <  0.70 → PARTIAL_READY（人工确认）
```

| 条件 | 推荐模板 |
|------|----------|
| 锚点 total ≥ 0.75 · 接福活动 | `tpl_landmark_lottie_blessing_v1` |
| 锚点 total ≥ 0.65 · 无活动 | `tpl_landmark_static_reveal_v1` |
| 锚点 total < 0.65 | `tpl_landmark_scan_hint_v1` |
| PoC 默认回退 | `tpl_landmark_photo_overlay_v1` |

---

## Workflow

### 模板匹配流

```text
1. 读取 Analyze 输出的 score.total + subject_label + activity_tag
2. 按规则表计算候选 template 列表
3. 取最高 confidence 候选
4. confidence >= 0.70 → 写入 template_ref
5. confidence < 0.70 → 标记 needs_manual_template · 进入审核 UI
6. Draft Generator 按 template 填充 ar_config 默认值
```

### 人工 override

```text
运营在 Review UI 可更换 template_id
  → 重新生成 ar_config + guide
  → 保留原匹配记录于 draft metadata
```

---

## Runtime Mapping

| 模板字段 | ar_config 字段 | C 端消费 |
|----------|----------------|----------|
| `template_id` | `ar_config.template_id` | 渲染分支选择 |
| `interaction_script` | `ar_config.interaction_script` | 状态机脚本 |
| `reveal_slot` | `ar_config.reveal_assets[]` | Lottie / overlay |
| `completion_event` | `ar_config.completion_event` | 进度写入 |
| `guide_template` | `scan_guide` 文案 | 扫描引导 UI |

模板定义文件建议路径：

```text
data/ar_factory/templates/{template_id}.json
```

---

## Governance Rules

1. Phase1 **不新增** 复杂 3D 模板。
2. 新模板须 Factory 评审 · 版本递增 · 登记 AR_FACTORY_INDEX。
3. 模板不得引入非 Canon 世界观内容。
4. 接福活动模板与主线信物模板 **逻辑隔离**。
5. 回退模板 `tpl_landmark_photo_overlay_v1` 必须始终可用。

---

## Acceptance Criteria

| # | 条件 | 验证方式 |
|---|------|----------|
| AC-1 | 四类 Phase1 模板完整定义 | 文档评审 |
| AC-2 | 匹配规则与 confidence 阈值明确 | 工程评审 |
| AC-3 | 与 Runtime Schema `template_ref` 对齐 | 交叉对照 |
| AC-4 | 人工 override 路径可描述 | 产品走查 |
| AC-5 | 状态 = REVIEW | 索引检查 |

```yaml
AR_TEMPLATE_LIBRARY_V1_REVIEW: PENDING
```

---

## Change Log

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| V1.0-draft | 2026-06-07 | 初稿 · TODAY_DOCUMENT_BUILD_BATCH_V1 · 标准结构 · REVIEW | Cursor |
| V1.0-freeze-attempt | 2026-06-08 | 曾短暂标记 FROZEN · 本批次回退至 REVIEW | Cursor |
