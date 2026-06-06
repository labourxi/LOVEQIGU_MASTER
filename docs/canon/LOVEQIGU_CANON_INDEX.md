# LOVEQIGU_CANON_INDEX

> **爱企谷项目 · 规则体系总目录**  
> **文件标识**：`LOVEQIGU_CANON_INDEX.md`  
> **版本**：V1.4  
> **日期**：2026-06-02  
> **用途**：定义文档层级、职责、冲突裁决与引用规则  
> **性质**：**索引与治理文件** — 不新增世界规则，不修改正典  

---

## 0. 最高规则（不可变更）

| 项 | 值 |
|----|-----|
| **唯一 P0 正典** | [`docs/canon/LOVEQIGU_WORLD_RULES_CANON_V1.md`](LOVEQIGU_WORLD_RULES_CANON_V1.md) |
| 正典内容 | 《归真纪元十二律》V1.5 |
| 本索引权限 | 编排、引用、裁决流程 — **无权增删改 Canon 条文** |

```text
一切 LOVEQIGU 文档与实现
        ↓ 不得违背
LOVEQIGU_WORLD_RULES_CANON_V1（已冻结 · 见 §1 Canon Freeze Rule）
        ↓ 空白边界
CANON_GAP_REGISTRY（L0.5 · 见 §3 · 不得填补 Gap）
        ↓ 仅转述已述部分
LOVEQIGU_WORLD_BIBLE_V1（L1）
```

---

## 1. Canon Freeze Rule（正典冻结规则）

### 1.1 冻结声明

[`LOVEQIGU_WORLD_RULES_CANON_V1.md`](LOVEQIGU_WORLD_RULES_CANON_V1.md) 被 **冻结** 为爱企谷项目 **最高规则（LEVEL 0 · P0）**。

自冻结生效起：

- 文件内容为 **只读正典**
- 任何层级文档与实现 **不得与之冲突**
- **不得** 在正典文件内直接编辑、覆盖、追加条文

### 1.2 无权直接修改的角色

以下角色 **均无权** 直接修改 `LOVEQIGU_WORLD_RULES_CANON_V1`：

| 角色 | 说明 |
|------|------|
| **Cursor** | AI 辅助写作 / 代码生成 |
| **秒哒** | 前端实现与体验设计 |
| **运营** | 活动、文案、对外宣传 |
| **设计师** | 视觉、Hero、信物美术 |

包括但不限于：直接在 Canon 文件中改字、通过 PR 修改 Canon、在分支中「临时」调整 Canon。

### 1.3 唯一合法变更路径

若确需修改世界规则，**必须** 走以下流程：

```text
1. 创建变更提案
   └── docs/world/proposals/CANON_CHANGE_PROPOSAL_{YYYYMMDD}_{slug}.md

2. 创世层审核
   └── 世界观负责人 / 项目创世层（非 Cursor · 非秒哒 · 非运营单方）

3. 审核通过后版本升级
   └── 发布新正典文件（例：LOVEQIGU_WORLD_RULES_CANON_V1.1.md）
   └── 更新 LOVEQIGU_CANON_INDEX §0 指针
   └── 全库 L1–L4 对齐审查

4. 旧版 Canon 归档
   └── 原 V1 文件标记 Frozen / Superseded，不再作为生效正典
```

**禁止**：跳过提案与审核，直接编辑现行 Canon 文件。

### 1.4 CANON_CHANGE_PROPOSAL 最低结构

提案文件 **必须** 包含：

| 字段 | 说明 |
|------|------|
| 提案编号 | `CCP-{YYYYMMDD}-{序号}` |
| 提案人 | 姓名 / 角色 |
| 变更动机 | 为何现有 Canon 不足（须具体） |
| 拟变更条款 | 指向第十二律 / 序章 / 关于× 等现有条目 |
| 拟议正文 | 完整替换或增补条文（ diff 形式） |
| 影响评估 | 受影响的 L1 Bible / L2 章节 / L3 UI / L4 实现 |
| 冲突检查 | 与未变更条款是否自洽 |
| 审核结论 | 创世层：批准 / 驳回 / 延期 |
| 目标版本 | 例：`CANON_V1.1` |

提案存放路径：`docs/world/proposals/CANON_CHANGE_PROPOSAL_*.md`（目录可建，首提案时创建）。

### 1.5 版本命名

| 状态 | 文件名示例 | 说明 |
|------|------------|------|
| 当前生效（冻结） | `LOVEQIGU_WORLD_RULES_CANON_V1.md` | 现行最高规则 |
| 审核通过后 | `LOVEQIGU_WORLD_RULES_CANON_V1.1.md` | 次世代正典 |
| 后续 | `…_V1.2.md` · `…_V2.md` | 仅创世层定版 |

本索引 **只登记生效版本指针**；历史版本保留只读归档。

### 1.6 与 Cursor / 自动化工具

- Cursor 及一切 Agent：**只读** 引用 Canon，**不得** 写入或 `StrReplace` Canon 文件  
- 内容生成若与 Canon 冲突：**修改 L1–L4**，**不修改 L0**  
- 用户指令「修改 Canon」时：Agent 应 **拒绝直接修改**，引导创建 `CANON_CHANGE_PROPOSAL`

---

## 2. Story Authority（叙事权限）

### 2.1 核心分工

爱企谷叙事内容按 **四层权限** 划分。**各层只定义其职责范围内的事**，不得僭越。

| 层级 | 标识 | 叙事权限 | 主文档 / 数据 |
|------|------|----------|---------------|
| **L0** | **WORLD_RULES** | **定义世界** | `LOVEQIGU_WORLD_RULES_CANON_V1.md` |
| **L1** | **WORLD_BIBLE** | **定义历史** | `LOVEQIGU_WORLD_BIBLE_V1.md` · `data/world/lore.json` |
| **L2** | **CHAPTERS** | **定义事件** | `data/chapters/*` · `CHAPTER_FACTORY_V1.md` |
| **L3** | **UI** | **定义表达** | `LOVEQIGU_UI_SYSTEM_V1.md` · Hero · Typography |

```text
WORLD_RULES   →  世界是什么（法则 · 本质 · 边界）
WORLD_BIBLE   →  世界发生过什么（历史 · 纪元 · 因果）
CHAPTERS      →  用户经历什么（事件 · 节点 · 信物触发）
UI            →  如何被看见（视觉 · 交互 · 语气 · 形式）
```

**L4 产品实现** 不参与叙事定义，只 **执行** L2 内容与 L3 规范（API · 代码 · 数据库）。

### 2.2 各层叙事边界

#### WORLD_RULES · 定义世界

| 允许 | 禁止 |
|------|------|
| 宇宙法则、术语本质（信物/残印/云门/愿力） | 具体人物传记、章节剧情 |
| 价值边界（归位、不预言、不战力） | UI 尺寸、动效参数 |
| 不可违背的「世界如何运转」 | 用户旅程、弹窗文案 |

**原则**：只说 **世界是什么**，不说 **发生了什么故事**。

#### WORLD_BIBLE · 定义历史

| 允许 | 禁止 |
|------|------|
| 纪元脉络、大分化/云门/祝由等 **Canon 内** 历史转述 | 新增与 L0 冲突的设定 |
| 术语索引、Legacy 对齐标注 | 预写 Canon 未述的「上古秘史」 |
| UI 级短 lore（`lore.json` · `quotes.json`） | 具体章节节点文案、用户操作事件 |

**原则**：只说 **世界发生过什么**，不说 **用户正在经历什么**。

#### CHAPTERS · 定义事件

| 允许 | 禁止 |
|------|------|
| 卷章结构、节点文案、信物配置、用户旅程 | 新世界观大事件、新势力、新法则 |
| 产品术语（印谱、章成、愿力计分）在 Canon 对齐下使用 | 改写 Canon 术语本质 |
| `data/chapters/*.json` 运行时内容 | 视觉 token、组件规范 |

**原则**：只说 **用户经历什么**，不说 **世界法则是什么**（引用 L0）或 **纪元全貌是什么**（引用 L1）。

#### UI · 定义表达

| 允许 | 禁止 |
|------|------|
| 颜色、字体、Hero、组件、动效、弹窗结构 | 发明 Lore、新增历史、新增世界法则 |
| 文案 tone、空状态呈现、content-driven 映射 | 硬编码替代 L2 JSON 内容源 |
| 读取 L2 渲染；约束 L2 文案气质 | 把「信物」等 Canon 术语重新定义为战利品/道具 |

**原则**：只说 **如何表达**，不说 **表达什么内容**（内容来自 L2）。

### 2.3 僭越判定

| 若在… | 却做了… | 判定 |
|-------|---------|------|
| WORLD_BIBLE | 写 CH01 n3 节点对白 | **僭越** → 归入 L2 |
| CHAPTERS | 新增「第四势力」设定 | **僭越** → 须 L0 提案或 L1 对齐 |
| UI 规范 | 定义信物本质是「装备」 | **僭越** → 术语本质属 L0 |
| UI 实现 | 弹窗文案硬编码，绕过 JSON | **僭越** → L4 须读 L2 |
| WORLD_RULES | 写用户点击顺序 | **僭越** → 属 L2 旅程 |

### 2.4 与 §3 层级目录的对应

```text
§2 Story Authority（叙事权限）     §3 目录结构（文档归属）
─────────────────────────────────────────────────────────
WORLD_RULES  · 定义世界      ↔    LEVEL 0
（治理 · 空白登记）          ↔    LEVEL 0.5  CANON_GAP_REGISTRY
WORLD_BIBLE  · 定义历史      ↔    LEVEL 1
CHAPTERS     · 定义事件      ↔    LEVEL 2
UI           · 定义表达      ↔    LEVEL 3
（实现执行）                 ↔    LEVEL 4
```

冲突裁决时：**先查 §2 是否僭越**，再按 §5 优先级修改下位层。

---

## 3. 目录结构（LEVEL 0 → 0.5 → 4）

```text
爱企谷 LOVEQIGU 项目文档树
│
├── LEVEL 0 · 世界规则（World Rules）                    [P0 · 唯一正典 · 已冻结]
│   └── docs/world/LOVEQIGU_WORLD_RULES_CANON_V1.md    ← 只读 · 见 §1
│
├── LEVEL 0.5 · 正典治理（Canon Governance Layer）      [P0 附属 · 不新增规则]
│   ├── docs/LOVEQIGU_CANON_INDEX.md                   ← 本文件 · 层级索引与裁决
│   ├── docs/CANON_GAP_REGISTRY.md                     ← Canon 空白登记 · 边界控制
│   └── docs/world/proposals/                          ← 变更提案（CANON_CHANGE_PROPOSAL）
│       └── CANON_CHANGE_PROPOSAL_*.md
│
├── LEVEL 1 · 世界设定（World Setting）                [P1 · Canon 下位展开]
│   ├── docs/world/LOVEQIGU_WORLD_BIBLE_V1.md          ← 主设定索引 · Skeleton V1.0
│   ├── docs/world/WORLD_BIBLE_V1_ALIGNMENT_REPORT.md  ← Skeleton 对齐报告
│   ├── docs/world/NARRATIVE_DATA_MAP.md
│   ├── data/world/lore.json
│   ├── data/world/quotes.json
│   └── [Legacy · 待对齐或只读引用]
│       ├── docs/world/CREATION_MEMO_V1.md
│       ├── docs/world/WORLD_BIBLE_V1_OUTLINE.md
│       ├── docs/world/WORLD_BIBLE_V1_ARCHITECTURE.md
│       ├── docs/world/WORLD_BIBLE_V1_FULL.md
│       ├── docs/world/KUNLUN_SYSTEM_V1.md
│       ├── docs/world/PATH_OF_RETURN_V1.md
│       └── docs/world/TAIYI_CHRONICLE_V1.md
│
├── LEVEL 2 · 章节内容（Chapter Content）              [P2 · 卷/章/节点/信物文案]
│   ├── docs/CHAPTER_FACTORY_V1.md                       ← 章节生产 SOP
│   ├── docs/ch01/                                     ← CH01 文档包
│   │   ├── CH01_MIAODA_HANDOFF_V1.md
│   │   ├── CH01_FRONTEND_SUPPLEMENT.md
│   │   ├── CH01_NODE_CONTENT_PACK.md
│   │   ├── CH01_USER_JOURNEY_V1.md
│   │   ├── CH01_CONTENT_GAP_REPORT.md
│   │   ├── COLLECTIBLE_UI_SPEC_V1.md
│   │   └── CHAPTER_NODE_TEMPLATE.md
│   ├── docs/world/ch01_cloud_awakening/               ← CH01 世界观配置
│   │   ├── CH01_CLOUD_AWAKENING_CONFIG.md
│   │   ├── LOVEQIGU_IMPRINTS_V1.md
│   │   ├── CH01_ART_ASSET_BRIEF.md
│   │   └── CH01_VISUAL_CLASSIFICATION.md
│   ├── docs/collectibles/                             ← 信物文案规范
│   │   ├── COLLECTIBLE_REWARD_POPUP_V1.md
│   │   └── COLLECTIBLE_REWARD_DETAIL_V1.md
│   └── data/                                          ← 章节运行时内容
│       ├── chapters/ch01_cloud_awakening/               （chapter.json · n*.json）
│       ├── chapters/chapter_node_template.json
│       ├── chapters/chapter_template.json
│       ├── collectibles/templates.json
│       ├── collectibles/stories.json
│       └── ch01/                                        （Legacy 单体 JSON / SQL）
│
├── LEVEL 3 · 设计系统（Design System）                [P3 · 体验 / 视觉 / 交互]
│   ├── docs/LOVEQIGU_UI_SYSTEM_V1.md                  ← UI 主规范 V1.1
│   ├── docs/HERO_SYSTEM_V1.md
│   ├── docs/Typography System V1.md
│   ├── docs/TYPOGRAPHY_DESIGN_MAP_V1.md
│   └── docs/TYPOGRAPHY_MIGRATION_V1.md
│
└── LEVEL 4 · 产品实现（Product Implementation）         [P4 · 工程 / API / 代码]
    ├── docs/API.md · docs/COMMERCIAL_API.md
    ├── docs/DATABASE_DESIGN.md · docs/database/
    ├── docs/ARCHITECTURE_STATUS.md · docs/FRONTEND_INTEGRATION.md
    ├── docs/DECISIONS.md · docs/PROJECT_MILESTONES.md
    ├── frontend/src/                                    （Taro 小程序）
    ├── src/                                             （ARYB 后端）
    ├── data/ch01/collectibles_seed_ch01.sql
    └── docs/ch01/CH01_CONTENT_GAP_REPORT.md             （实现缺口 · 亦属 L4 验收）
```

### 3.1 层级关系图

```text
    ┌─────────────────────────────────────┐
    │  L0  LOVEQIGU_WORLD_RULES_CANON    │  ← 最高 · 已冻结（§1）
    └─────────────────┬───────────────────┘
                      │ 不得违背
    ┌─────────────────▼───────────────────┐
    │  L0.5  Canon Governance             │  ← 索引 · Gap 登记 · 提案
    │        CANON_INDEX · GAP_REGISTRY   │     不新增规则 · 不填补 Gap
    └─────────────────┬───────────────────┘
                      │ 仅转述 Canon 已述
    ┌─────────────────▼───────────────────┐
    │  L1  World Setting / Bible / lore   │
    └─────────────────┬───────────────────┘
                      │ 不得扩写冲突 Lore
    ┌─────────────────▼───────────────────┐
    │  L2  Chapter Content / JSON / 信物   │
    └─────────────────┬───────────────────┘
                      │ 不得违反气质与合规
    ┌─────────────────▼───────────────────┐
    │  L3  Design System / Hero / Typo    │
    └─────────────────┬───────────────────┘
                      │ 实现须可读 L2 内容
    ┌─────────────────▼───────────────────┐
    │  L4  Code / API / DB / 部署          │
    └─────────────────────────────────────┘
```

---

## 4. 各层职责

> 叙事权限总览见 **§2 Story Authority**（WORLD_RULES 定义世界 · WORLD_BIBLE 定义历史 · CHAPTERS 定义事件 · UI 定义表达）。  
> 本节为各层 **文档归属与维护细则**。

### LEVEL 0 · 世界规则

| 项 | 说明 |
|----|------|
| **职责** | 定义不可违背的宇宙法则、术语本质、价值边界 |
| **内容** | 十二律；序章/终章；大分化/云门/祝由/愿力/探索者之 Canon 定稿 |
| **谁维护** | 创世层 · 变更 **仅** 通过 §1 Canon Freeze Rule → `CANON_CHANGE_PROPOSAL` |
| **谁消费** | 全体内容、设计、工程 |
| **禁止** | 产品需求、UI 参数、章节剧情写入 L0 |

### LEVEL 0.5 · 正典治理

| 项 | 说明 |
|----|------|
| **职责** | 索引层级、登记 Canon 空白、裁决引用流程、提案路径 — **不定义世界观** |
| **主文档** | `LOVEQIGU_CANON_INDEX.md` · `CANON_GAP_REGISTRY.md` |
| **提案** | `docs/world/proposals/CANON_CHANGE_PROPOSAL_*.md` |
| **允许** | 登记 Gap 状态（DEFINED / PARTIAL / UNDECLARED / FORBIDDEN）；更新索引与对照表 |
| **禁止** | 填补 Gap 内容；新增世界规则；间接修改 L0 条文 |
| **与 L1** | Bible 扩写前 **必须先查** `CANON_GAP_REGISTRY`；`UNDECLARED` / `FORBIDDEN` 项不得写入 L1 |

### LEVEL 1 · 世界设定

| 项 | 说明 |
|----|------|
| **职责** | 在 Canon 框架内组织、索引、转述世界观；提供 UI 级短文本 |
| **主文档** | `LOVEQIGU_WORLD_BIBLE_V1.md` · **`WORLD_BIBLE_V1_ALIGNMENT_REPORT.md`** |
| **当前版本** | **Skeleton V1.0** — §0–§8 骨架 · **无正文** · 不填 Gap |
| **数据** | `data/world/lore.json` · `quotes.json` |
| **允许** | Canon 转述、术语表、叙事—产品映射、Legacy 标注 |
| **禁止** | 新增与 Canon 冲突的设定；预写 Canon 未述历史；**填补 CANON_GAP_REGISTRY 中 UNDECLARED / FORBIDDEN 项** |
| **Legacy** | `CREATION_MEMO` / 旧 WORLD_BIBLE 系列 — 冲突时 **以 L0 为准**，逐步对齐 |

### LEVEL 2 · 章节内容

| 项 | 说明 |
|----|------|
| **职责** | 卷章结构、节点文案、信物配置、用户旅程、JSON 内容层 |
| **主文档** | `CHAPTER_FACTORY_V1.md` · `docs/ch01/*` · `data/chapters/*` |
| **允许** | 产品术语（印谱、章成、愿力计分）在 Canon 对齐前提下使用 |
| **禁止** | 新世界观大事件；预言/改运/医疗；战力/境界/抽卡叙事 |
| **CH02+** | 复制 CH01 工厂流程，不新增 L0/L1 设定 |

### LEVEL 3 · 设计系统

| 项 | 说明 |
|----|------|
| **职责** | 视觉、字体、Hero、组件、动效、弹窗结构、content-driven UI 规范 |
| **主文档** | `LOVEQIGU_UI_SYSTEM_V1.md` · `HERO_SYSTEM_V1.md` · `Typography System V1.md` |
| **允许** | 尺寸、颜色 token、交互模式、文案 tone 约束 |
| **禁止** | 改写 Canon 定义（如把「信物」定义为战利品） |
| **与 L2** | L3 读取 L2 JSON 渲染；L2 文案 tone 服从 L3 + Canon |

### LEVEL 4 · 产品实现

| 项 | 说明 |
|----|------|
| **职责** | 代码、API、数据库、部署、联调、缺口报告、验收 |
| **主文档** | `API.md` · `DATABASE_DESIGN.md` · `ARCHITECTURE_STATUS.md` |
| **代码** | `frontend/` · `src/` · SQL seed |
| **允许** | 工程字段名、路由、表结构、Mock |
| **禁止** | 在代码注释/默认文案中硬编码与 Canon 冲突的 Lore |
| **原则** | **content-driven** — 用户可见文案来自 L2 JSON，非 L4 硬编码 |

---

## 5. 冲突处理原则

### 5.1 裁决优先级（高 → 低）

```text
L0  Canon
  → L0.5  Canon Governance（索引 · Gap 登记 — 不新增规则）
    → L1  World Setting（含 LOVEQIGU_WORLD_BIBLE_V1）
      → L2  Chapter Content
        → L3  Design System
          → L4  Product Implementation
```

**同级冲突**：较新版本 > 较旧版本；标注 `V1.1` > `V1.0`。

### 5.2 典型冲突场景

| 场景 | 裁决 |
|------|------|
| L1 Legacy（CREATION_MEMO）与 L0 Canon 矛盾 | **L0 胜**；Legacy 标记只读或待修订 |
| L2 章节文案与 L0 第十二律（归位）矛盾 | **修改 L2** |
| L3 UI 规范与 L2 JSON 字段不一致 | **L2 为内容源**；L3 改映射或 L2 补字段 |
| L4 代码硬编码文案与 L2 JSON 不一致 | **以 L2 为准**；删硬编码 |
| L2 信物描述 vs L1 lore.json | **对齐 L0 本质**后统一 L2 与 lore |
| 产品需求 vs Canon | **需求让步或改表述**；不得改 Canon |

### 5.3 禁止行为

- 为赶工期在 L4 写死与 Canon 冲突的弹窗文案  
- 在 L2 以「游戏化」名义引入 Canon 禁止概念（战力、抽卡、改运）  
- 通过本索引或 Bible **间接修改** L0 条文  
- 无 Canon 依据，在 L1 扩写「上古史」「新势力」  
- 跳过 `CANON_GAP_REGISTRY`，在 Bible / 章节中填补 **UNDECLARED** 空白  

### 5.4 修订流程

```text
发现冲突
  → 标注冲突文档与 Canon 条款号
  → 判定层级（L1–L4 修改 / L0 仅提案）
  → L0 变更：§1 Canon Freeze Rule → CANON_CHANGE_PROPOSAL → 创世层审核 → CANON_Vx.x
  → L0.5：更新 CANON_GAP_REGISTRY 对应项状态
  → L1–L4：按 CHAPTER_FACTORY / PR 流程修改
  → 更新 DECISIONS.md（工程决策）或 Bible 修订记录（设定）
```

---

## 6. 文档引用规则

### 6.1 引用格式

Markdown 文档内引用：

```markdown
依据 [Canon · 第十一律](world/LOVEQIGU_WORLD_RULES_CANON_V1.md)
参见 [L2 · CH01 节点包](ch01/CH01_NODE_CONTENT_PACK.md)
```

JSON / 代码注释：

```text
// canon_ref: tenth_law_collectible
// content_src: data/chapters/ch01_cloud_awakening/n1_gate.json
```

### 6.2 向下引用（允许）

| 源层 | 可引用 |
|------|--------|
| L0 | —（不被引用为下位，只被引用） |
| L0.5 | L0 |
| L1 | L0 · L0.5（Gap 边界） |
| L2 | L0 · L0.5 · L1 |
| L3 | L0 · L0.5 · L1 · L2（结构，非扩写 Lore） |
| L4 | L0–L3 · L2 JSON 为文案源 |

### 6.3 向上引用（限制）

| 源层 | 规则 |
|------|------|
| L4 代码 | **不得**定义世界观；只能读 L2 data |
| L3 UI 规范 | **不得**重新定义 Canon 术语本质 |
| L2 章节 | **不得**新增 L0 级法则；产品术语须标注 `[L2]` |
| L1 设定 | **不得**覆盖 L0；只能转述与索引 |

### 6.4 跨层引用清单（常用）

| 需求 | 引用路径 |
|------|----------|
| 术语本质（信物/残印/云门） | L0 Canon |
| Canon 空白 / 可否扩写 | L0.5 `CANON_GAP_REGISTRY.md` |
| World Bible 骨架 / 对齐状态 | L1 `LOVEQIGU_WORLD_BIBLE_V1.md` · `WORLD_BIBLE_V1_ALIGNMENT_REPORT.md` |
| 章节结构 / 节点 JSON | L2 `data/chapters/` + `CHAPTER_FACTORY_V1.md` |
| 弹窗/详情文案 | L2 `data/collectibles/stories.json` + `docs/collectibles/` |
| Hero / 字体 | L3 `HERO_SYSTEM_V1.md` + `Typography System V1.md` |
| 秒哒接入 | L2 `CH01_MIAODA_HANDOFF_V1.md` + L3 `CH01_FRONTEND_SUPPLEMENT.md` |
| API / 表结构 | L4 `API.md` · `DATABASE_DESIGN.md` |
| UI 空状态/关键词 | L1 `data/world/lore.json` |

### 6.5 新建文档归属判定

| 若文档主要… | 归入 |
|-------------|------|
| 定义宇宙法则 / 价值不可违背 | **不可新建** — 仅 L0 提案 |
| 登记 Canon 空白 / 索引 / 裁决流程 | **L0.5** |
| 组织世界观 / 术语 / 纪元结构 | L1 |
| 写某一章节点/信物/旅程文案 | L2 |
| 规定颜色/字体/Hero/组件 | L3 |
| 描述 API/表/部署/代码结构 | L4 |

新建后 **必须** 在本索引 §3 目录树中登记（PR 时更新 `LOVEQIGU_CANON_INDEX.md`）。

---

## 7. 快速 lookup

### 7.1 按角色

| 角色 | 先读 |
|------|------|
| 世界观 / 内容 | L0 → L0.5 Gap Registry → L1 Bible（Skeleton）→ Alignment Report → L2 Factory |
| 秒哒前端 | L3 UI/Hero/Typo → L2 Handoff → L2 JSON |
| ARYB 后端 | L4 API/DB → L2 JSON schema |
| 验收 / QA | L2 User Journey → L4 Gap Report → L0 合规 |

### 7.2 按 CH01 MVP

| 步骤 | 文档 |
|------|------|
| 1 | L0 Canon（合规底线） |
| 2 | L0.5 `CANON_GAP_REGISTRY.md`（空白边界） |
| 3 | L2 `CH01_MIAODA_HANDOFF_V1.md` |
| 4 | L2 `data/chapters/ch01_cloud_awakening/` |
| 5 | L3 `LOVEQIGU_UI_SYSTEM_V1.md` |
| 6 | L4 `CH01_CONTENT_GAP_REPORT.md` |

---

## 8. 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.4 | 2026-06-02 | L1 `LOVEQIGU_WORLD_BIBLE_V1` 升格 Skeleton V1.0 · 新增 Alignment Report |
| V1.3 | 2026-06-02 | 新增 L0.5 Canon Governance Layer · `CANON_GAP_REGISTRY.md` |
| V1.2 | 2026-06-02 | 新增 §2 Story Authority；明确 WORLD_RULES / BIBLE / CHAPTERS / UI 叙事权限 |
| V1.1 | 2026-06-02 | 新增 §1 Canon Freeze Rule；正典变更须 CANON_CHANGE_PROPOSAL |
| V1.0 | 2026-06-02 | 首版；建立 L0–L4 索引体系；L0 锁定 Canon V1.5 |

---

## 9. 声明

- 本文档 **不** 构成世界规则的一部分。  
- 本文档 **不** 修改 [`LOVEQIGU_WORLD_RULES_CANON_V1.md`](world/LOVEQIGU_WORLD_RULES_CANON_V1.md)（已冻结 · 见 §1）。  
- 本文档 **不** 新增任何 Canon 条文。  
- 本文档仅负责：**索引 · 分层 · 裁决 · 引用**。

---

*爱企谷项目规则体系总目录 · LOVEQIGU_CANON_INDEX V1.4*
