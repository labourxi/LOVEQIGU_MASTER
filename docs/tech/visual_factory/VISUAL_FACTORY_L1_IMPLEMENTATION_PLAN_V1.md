# VISUAL_FACTORY_L1_IMPLEMENTATION_PLAN_V1

## 1. Document Status

```yaml
status: DRAFT
priority: P0
module: Visual Factory
level: L1
```

## 2. Background

The project already has:

- `CONTENT_FACTORY`
- `VISUAL_FACTORY_SCHEMA`
- `ADMIN_CONTENT_MODEL`
- `AR_FACTORY`

Current gap:

- Art Requirement Generator
- Prompt Generator
- Generation Queue
- Visual Task Board

This document defines the first implementation step for Visual Factory L1.

## 3. Goal

Build Visual Factory L1 so the system can automatically produce:

- exploration point visual tasks
- art requirement documents
- prompts
- waiting generation queue items

The first version removes repetitive manual work while keeping human review and external model generation in the loop.

## 4. Scope

### 4.1 In Scope

- Visual Task creation
- Art Requirement generation
- Prompt generation
- Generation queue management
- Admin page skeletons for visual operations
- AR Factory alignment for `DRAGON_IMPRINT_LITE`

### 4.2 Out of Scope

- Direct Runtime publication
- Direct Release publication
- Auto approval without review
- New visual taxonomy outside the frozen current system
- New visual model providers

## 5. Current Automation Level

```yaml
CURRENT: L0
TARGET: L1
```

### L0

- Manual task writing
- Manual requirement decomposition
- Manual prompt drafting
- Manual queue tracking

### L1

- Exploration point input
- Automatic requirement generation
- Automatic prompt generation
- Waiting generation queue creation
- Human review and external generation remain required

## 6. Functional Modules

### 6.1 Visual Task

Visual Task is the operational unit for one exploration point visual request.

Data structure:

```json
{
  "id": "",
  "type": "landmark_ar",
  "exploration_point_id": "",
  "title": "",
  "status": "draft",
  "priority": "p0",
  "created_at": ""
}
```

### 6.2 Art Requirement Generator

Input:

- exploration point name
- exploration point context

Output:

```json
{
  "effect_type": "dragon_imprint_lite",
  "landmark_type": "ancient_tree",
  "shareability_target": "S",
  "style": "oriental_mystic",
  "assets": [
    "dragon_imprint_overlay",
    "dragon_energy_flow",
    "dragon_head_reveal",
    "azure_dragon_seal"
  ]
}
```

Output file:

- `art_requirement.json`

### 6.3 Prompt Generator

Input:

- `art_requirement.json`

Output:

- `dragon_imprint.prompt.md`

Prompt format:

- execution target
- goal
- style constraints
- complete prompt text

### 6.4 Generation Queue

Queue states:

```yaml
DRAFT
PROMPT_READY
WAITING_GENERATION
GENERATED
REVIEWING
APPROVED
```

Queue flow:

```text
探索点 -> Visual Task -> Prompt -> WAITING_GENERATION
```

## 7. Admin Module

### 7.1 Module Path

```text
apps/admin/modules/visual-factory/
```

### 7.2 Pages

- Visual Task List
- Visual Task Detail
- Prompt Preview
- Generation Queue

### 7.3 Menu Entry

Add a new admin menu item:

- 视觉任务

### 7.4 Page Fields

List page:

- 标题
- 探索点
- 效果类型
- 状态
- 优先级
- 创建时间

Detail page:

- 需求单
- Prompt
- 状态
- 输出资产

## 8. AR Factory Integration

When the effect type is:

```text
DRAGON_IMPRINT_LITE
```

Visual Factory should automatically produce a request bundle for:

- `dragon_imprint_overlay`
- `dragon_energy_flow`
- `dragon_head_reveal`
- `azure_dragon_seal`

This bundle is the handoff artifact for AR Factory and prompt/model generation.

## 9. Proposed Data Objects

### 9.1 Visual Task Object

Fields:

- id
- type
- exploration_point_id
- title
- status
- priority
- created_at

### 9.2 Art Requirement Object

Fields:

- effect_type
- landmark_type
- shareability_target
- style
- assets

### 9.3 Prompt Object

Fields:

- title
- target_model
- objective
- style_notes
- prompt_text

### 9.4 Generation Queue Item

Fields:

- task_id
- prompt_id
- status
- created_at
- updated_at

## 10. Implementation Recommendation

Recommended order:

1. Visual Task schema
2. Art Requirement Generator
3. Prompt Generator
4. Generation Queue
5. Admin module skeleton
6. AR Factory handoff bundle
7. Validation report

## 11. Validation Criteria

The implementation is ready when the following can be produced automatically:

- exploration point -> visual task
- visual task -> art requirement.json
- art requirement.json -> prompt.md
- prompt -> waiting generation queue
- admin can list and inspect tasks

## 12. Success Marker

```yaml
VISUAL_FACTORY_AUTOMATION_LEVEL:
  CURRENT: L0
  TARGET: L1
```

