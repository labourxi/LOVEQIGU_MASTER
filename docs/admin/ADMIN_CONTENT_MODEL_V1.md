# ADMIN Content Model V1

> **文件标识**：`ADMIN_CONTENT_MODEL_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-08  
> **Mission**：11 · ADMIN_CONTENT_MODEL_V1  
> **层级**：Admin · Content Administration Model（非 L0 Canon · 非 L2 章节 JSON）  
> **性质**：**后台数据模型占位 · 支持未来探索点自动扩展 · 不实现 Admin UI**

---

## §0 定位

本文件定义 LOVEQIGU **内容管理后台** 的底层数据模型，用于未来 **checkpoint（探索点）** 扩展时的占位生成、审查与 Runtime 发布编排。

```text
ADMIN_CONTENT_MODEL_V1（本文件 · 模型契约）
        ↓
autopilot/admin/*（占位 JSON · schemas · generation_rules）
        ↓
[sandbox] 验收 / dry-run
        ↓
[future] Runtime registry publish（freeze 后 · 人工 G-FREEZE）
```

### 边界

| 是 | 不是 |
|----|------|
| 后台管理数据模型 | L0 Canon |
| 占位 / 模板 / 规则 | CH01–CH05 正式 L2 JSON |
| 未来 Autopilot 消费契约 | Admin UI 页面 |
| 美术需求队列元数据 | 信物 rarity / 等级系统 |

### 约束

- **不修改** L0 Canon · 全局 Content Canon  
- **不修改** CH01–CH05 `data/story|relics|rights|ar/*`  
- **不填补** Canon Gap · **不新增** Lore  

---

## §1 四类核心对象

### 1.1 `checkpoint`

**用途：** 表示一个未来探索点，从 placeholder 到 runtime 发布的生命周期容器。

| 字段 | 类型 | 说明 |
|------|------|------|
| `schema` | string | `loveqigu.admin.checkpoint.v1` |
| `checkpoint_id` | string | 稳定标识 · 签发后不可变 |
| `chapter_id` | string | 所属章（如 `CH06` · 或 `TBD`） |
| `map_region` | string | 探索地图区域 / 段 |
| `title` | string | 人类可读探索点名称 |
| `placeholder_status` | enum | `draft` · `placeholder` · `filled` · `retired` |
| `runtime_status` | enum | `draft_only` · `bridge_pending` · `published` |
| `relic_template_ref` | string | 关联 relic_template 路径 |
| `ar_template_ref` | string | 关联 AR 占位 / art 模板路径 |
| `audit_status` | enum | `pending` · `pass` · `pass_with_warning` · `fail` |
| `publish_status` | enum | `unpublished` · `freeze_prep` · `published` |

---

### 1.2 `relic_template`

**用途：** 未来信物占位生成的蓝图（**非最终 Relic 实体**）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `schema` | string | `loveqigu.admin.relic_template.v1` |
| `relic_template_id` | string | 稳定模板 ID |
| `chapter_id` | string | 所属章 |
| `relic_type` | string | 模板类别（如 `awareness_relic` · `imprint_relic`） |
| `template_class` | string | 管理用分类 · **非** 用户可见 rarity |
| `required_art` | array[string] | 所需美术输入 |
| `required_story` | array[string] | 所需 Story 引用 |
| `required_rights` | array[string] | 所需 L1 Rights 引用 |
| `dc_enabled` | boolean | 是否可挂 Digital Collectible（传播面） |
| `status` | enum | `draft` · `active` · `frozen` · `retired` |

> **术语：** `template_class` 替代 prompt 中 `rarity_level` 字段名，避免与 Relic 禁止语义混淆。

---

### 1.3 `art_requirement`

**用途：** 自动或半自动生成的美术任务单。

| 字段 | 类型 | 说明 |
|------|------|------|
| `schema` | string | `loveqigu.admin.art_requirement.v1` |
| `art_requirement_id` | string | 稳定任务 ID |
| `source_checkpoint` | string | 来源 checkpoint |
| `asset_type` | string | 资产族（`placeholder_art` · `share_poster` · …） |
| `asset_name` | string | 可读标签 |
| `asset_description` | string | 编辑 brief |
| `priority` | enum | `low` · `normal` · `high` |
| `status` | enum | `queued` · `in_progress` · `done` · `blocked` |

---

### 1.4 `generation_rule`

**用途：** Autopilot 声明式规则集 · 映射触发器 → 生成动作。

| 字段 | 类型 | 说明 |
|------|------|------|
| `schema` | string | `loveqigu.admin.generation_rule.v1` |
| `rule_id` | string | 稳定规则 ID |
| `trigger` | string | 触发事件 / 状态迁移 |
| `target_object` | enum | `checkpoint` · `relic_template` · `art_requirement` · `runtime_registry` |
| `generation_action` | string | `placeholder_create` · `audit` · `fill` · `dc_register` · `freeze_prep` |
| `audit_required` | boolean | 是否需审计门 |
| `freeze_required` | boolean | 是否需 freeze 门 |
| `runtime_publish_required` | boolean | 是否需 runtime 发布 |

---

## §2 未来 Super Admin 操作（无 UI）

| 操作 | 流程 |
|------|------|
| A · 新增探索点 | checkpoint → placeholder → audit |
| B · 生成信物占位 | checkpoint → relic_template → placeholder relic |
| C · 生成 AR 占位 | checkpoint → AR placeholder → runtime bridge |
| D · 生成美术需求单 | checkpoint → art_requirement → asset queue |
| E · 提交审查 | audit → governance gate → OMX |
| F · 发布 Runtime | freeze → runtime registry → runtime publish |

---

## §3 Autopilot 消费模型

1. 加载 `autopilot/admin/manifest/ADMIN_CONTENT_MODEL_V1_MANIFEST.json`  
2. 解析 checkpoint · template · art · rule 图  
3. 按 `generation_rule` 展开占位  
4. 经 audit / governance / freeze 门  
5. **仅** freeze 批准后写入 runtime registry  

---

## §4 文件布局（V1）

```text
autopilot/admin/
  schemas/           # 四类 schema 占位
  checkpoints/       # checkpoint 占位实例
  relic_templates/
  art_requirements/
  generation_rules/
  manifest/          # 总 manifest · Autopilot 入口
```

Sandbox 验收路径（不变）：`sandbox/admin/*`

---

## §5 成功标记

`ADMIN_CONTENT_MODEL_V1_COMPLETE = YES`
