# VISUAL PRODUCTION SYSTEM — FULL AUDIT REPORT V1

> **审计日期**: 2026-07-01 14:52
> **审计范围**: 全系统视觉生产线（设计层 → 执行层 → 生成层 → 资产层）
> **审计方法**: 全项目文件扫描 + 交叉引用分析
> **审计规则**: 仅分析当前系统真实状态，不提出新功能

---

## 1. SYSTEM STATUS

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    SYSTEM STATUS: PARTIALLY STABLE               ║
║                                                                  ║
║  设计层:    ⚠️ 碎片化（V3 / V4 并存，未统一）                     ║
║  执行层:    🔴 分裂（3 条独立管线，无统一调度）                    ║
║  生成层:    🔴 无实际 API 调用（所有适配器返回 SPEC_READY）       ║
║  资产层:    ✅ 稳定（16 个文件全部就位，路径正确）                  ║
║                                                                  ║
║  综合判定:  PARTIALLY STABLE 但不是 INDUSTRIALLY READY           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 2. LAYER-BY-LAYER ANALYSIS

### A. DESIGN LAYER — ⚠️ FRAGMENTED

| 维度 | 状态 | 详情 |
|------|------|------|
| 结构定义是否统一 | ❌ 否 | 存在 3 个冻结架构文档，互相冲突 |
| 是否有单一权威来源 | ❌ 否 | V3（管线）与 V4（系统架构）定义不同规则集 |

**发现的架构文档（docs/freeze/）：**

| 文档 | 定义内容 | 与系统关系 |
|------|---------|-----------|
| `VISUAL_PRODUCTION_PIPELINE_FREEZE_V3.md` | 8 步视觉生产管线 | Landing Page 执行的唯一允许流程 |
| `VISUAL_PRODUCTION_PIPELINE_FREEZE_V1.md` | 7 步视觉生产管线（旧版） | 被 V3 取代但未移除 |
| `VISUAL_SYSTEM_ARCHITECTURE_DESIGN_V4.md` | 全系统视觉架构设计规则 | V3 的设计输入约束 |
| `BOTTOM_NAV_SYSTEM_V6_FINAL_STRUCTURE.md` | 底部导航结构 | 约束页面数量与类型 |
| `UI_SPEC_LAYER_V1.md` | 机器可读页面规格 schema | 约束页面结构输出格式 |
| `VISUAL_ASSET_CONTRACT_V1.md` | 资产注册合同 | 约束资产命名与注册 |
| `UI_CONTRACT_SYSTEM_V1.md` | UI 合同系统 | 与管线并列的UI规则 |

**冲突 1 — V3 与 V4 规则冲突：**

```
V3 RULE-001: No generation before structure approval
V4 RULE-002: No single-page-first design allowed (必须先定义全系统架构)

→ 矛盾点：
  V3 允许对一个页面（如 landing）独立执行完整管线。
  V4 要求必须先有全系统架构才能设计任何页面。
  → 两个冻结规则互相矛盾，不存在优先级裁定。
```

**冲突 2 — V1 文件未移除：**

`VISUAL_PRODUCTION_PIPELINE_FREEZE_V1.md` 仍存在于 `docs/freeze/` 目录中，标注为 FROZEN。V3 声明"取代 V1"，但 V1 文档本身未标志为 SUPERSEDED 或 DEPRECATED。存在被读取到错误版本的风险。

**冲突 3 — 双规则 RULE-004：**

| 版本 | RULE-004 内容 |
|------|-------------|
| V1 | No fallback UI considered production asset |
| V3 | Full page visual is SINGLE SOURCE OF TRUTH |

两条 RULE-004 完全不同的内容，但在不同文档中都是"第四条规则"。如果读者只看 V1（旧），会得到完全不同的约束。

---

### B. EXECUTION LAYER — 🔴 SPLIT (3 PARALLEL PIPELINES)

**发现 3 条独立管线并存：**

```
PIPELINE A: DOCUMENT PIPELINE (V3)
──────────────────────────────────
定义位置:  docs/freeze/VISUAL_PRODUCTION_PIPELINE_FREEZE_V3.md
执行入口:  无自动化入口 — 由 CURSOR AGENT 手动执行
状态:     已执行到 STEP 4 (landing_v1 规格已批准)
自动化:   无 — 所有步骤需要人工触发
ORCHESTRATOR: pipeline_orchestrator.js（实现 V1 逻辑，不是 V3）

PIPELINE B: PYTHON AUTOPILOT (V3 SKELETON)
───────────────────────────────────────────
定义位置:  scripts/visual_autopilot/main.py, executor.py, pipeline.py
执行入口:  python main.py（不会触发任何生成）
状态:     SKELETON READY — 管线类已定义但未激活
执行 trigger: run() → route → generate → audit → judge → evaluate → select → freeze
关键冲突: 永远不会到达 image_generation_bridge_v1.py（那是 V1）

PIPELINE C: PYTHON GENERATION BRIDGE (V1)
───────────────────────────────────────────
定义位置:  scripts/visual_autopilot/visual_generation_bridge_v1.py
执行入口:  python visual_generation_bridge_v1.py --prompt "..."
状态:     存活但孤立 — 可独立触发 API 调用
与 V3 关系: 无集成 — 在 V3 管线外独立运行
```

**执行层关键发现：**

1. **无统一触发入口** — 不存在一个命令或脚本同时覆盖全部 8 步
2. **pipeline_orchestrator.js 过期** — 实装 V1（7 步）逻辑，不是 V3（8 步）
3. **visual_factory.py** 使用 `run_multi_candidate_ranking`（候选排名管线），与 V3 文档管线完全不同
4. **orchestrator/** 是第四个独立管线系统（任务状态机 + factory dispatcher + publish runtime），与 V1/V3 无集成

---

### C. GENERATION LAYER — 🔴 NO ACTUAL API CALLS

| 组件 | 声明执行 | 实际执行 |
|------|---------|---------|
| `image_api_adapter.js` (visual-pipeline/) | 生成图片 | ❌ 返回 `SPEC_READY` — API 调用被注释掉 |
| `visual_generation_bridge_v1.py` (visual_autopilot/) | V1 生成桥 | ✅ 可实际调用 OpenAI/Gemini API |
| `providers/gemini.py` (visual_autopilot/) | Gemini API | ✅ HTTP 请求已实现 |
| `providers/seedream_ark.py` | Seedream API | ✅ HTTP 请求已实现 |

**关键问题：**

```
image_api_adapter.js（miniapp 侧管线模块）:
  - 自称 "FROZEN PIPELINE STEP 2 EXECUTOR"
  - 但 generate() 函数中：
    "// ─── ACTUAL API CALL WOULD HAPPEN HERE ───"
    "// In production, this makes HTTP requests..."
    "// For now, returns the call spec for manual/scripted execution."
  → 这是阻断生成层的根本原因。
  → 如果 V3 管线被激活，该适配器会返回 SPEC_READY 而非图片数据。

visual_generation_bridge_v1.py（Python 侧生成桥）:
  - 可实际生成图片（代码中有 HTTP 调用）
  - 但被放置在 visual_autopilot/ 目录下作为独立脚本
  - 与 V3 管线无集成路径
```

**生成的着陆页视觉规格：**

```
assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json
  - 包含 3 个 API provider 的完整 payload 规格
  - 包含精确提示词、负提示词、色板
  - 但：STATUS = EXECUTION_SPEC_READY（从未执行）
  - 规格中的 STEP 4 APPROVAL 标记在生成之前就被标注为 APPROVED
    → 违反了 V3 的顺序门禁逻辑（生成 → QA → 才到 HUMAN APPROVAL）
```

---

### D. ASSET LAYER — ✅ STABLE

**静态资产清单（apps/miniapp/static/）：**

| 分类 | 文件数 | 覆盖资产 |
|------|--------|---------|
| scene/ | 5 | aiqigu_landing_v1.jpg, webp, fallback, street, winner |
| bg/ | 1 | portal_mist_v1.png |
| ui/ | 3 | portal_ring, card_glass, stat_glass |
| icon/ | 5 | login, location, relic, collectible, ar |
| relic/ | 1 | frame_gold_v2.png |
| collectible/ | 1 | collectible_frame_v1.png |
| **总计** | **16** | **全部路径正确，文件非空** |

**构建配置：**
- `project.config.json` ✅ 已包含 `static/` 文件夹到 packOptions.include
- 不存在构建过滤排除 `static/` 的风险

**资产注册（3 份注册表）：**

| 注册表 | 条目数 | 键名风格 | 状态 |
|--------|--------|---------|------|
| `GOVERNANCE_RUNTIME_HOOK_V2.js` | 14 | snake_case | ✅ 全部指向真实文件 |
| `asset-resolver.js` | 13 | snake_case | ✅ 全部指向真实文件 |
| `index.js getAssetMap()` | 15 | short_camelCase | ✅ 全部指向真实文件 |

**资产层风险：**

1. **winner.jpg 未注册到 governance 和 resolver** — 只在 index.js 中存在。如果 governance gate 激活，winner.jpg 会触发 UNREGISTERED_ASSET 错误。
2. **index.js assetMap 键名与 governance/resolver 不兼容** — 无法互换使用。
3. **bgImage 第 205 行硬编码路径** — 绕过 assetMap，直接写 `/static/scene/aiqigu_landing_v1.jpg`。
4. **15 个文件中 14 个文件为 SVG 兼容文件（非真实 JPEG/PNG 编码）** — 仅 `winner.jpg`（521KB）是真实 JPEG 图片。

---

## 3. SYSTEM CONFLICTS — 完整清单

### CONFLICT-001: V1 与 V3 管线文档并存

```
严重性: ⚠️ 中
位置: docs/freeze/VISUAL_PRODUCTION_PIPELINE_FREEZE_V1.md（未标记为 SUPERSEDED）
影响: 读者可能引用 V1 规则而非 V3 规则
修复需求: V1 文档需要更新状态为 SUPERSEDED
```

### CONFLICT-002: V3 与 V4 规则直接矛盾

```
严重性: 🔴 高
V3 RULE-001: "No generation before structure approval" (单页面即可)
V4 RULE-002: "No single-page-first design allowed" (必须全系统优先)
影响: CURSOR AGENT 无法确定遵循哪个规则。当前 task 中通过 OVERRIDE 解决，但不能作为长期方案。
修复需求: 需要明确的优先级裁定（两个冻结文档哪个优先）
```

### CONFLICT-003: pipeline_orchestrator.js 实现的是 V1

```
严重性: ⚠️ 中
位置: apps/miniapp/core/visual-pipeline/pipeline_orchestrator.js
影响: orchestrator 的 7 步逻辑与 V3 的 8 步流程不匹配
修复需求: 需要更新为 V3 步骤定义
```

### CONFLICT-004: 生成层被阻断

```
严重性: 🔴 高
影响: image_api_adapter.js 返回 SPEC_READY 而非图片。整个 V3 管线在 STEP 2 处阻断。
修复需求: 需要集成 visual_generation_bridge_v1.py 到 V3 管线，或升级 image_api_adapter.js 到实际 API 调用。
```

### CONFLICT-005: 3 条管线系统无集成

```
严重性: 🔴 高
系统 A: V3 文档管线（CURSOR 手动执行）
系统 B: Python Autopilot（dormant V3 skeleton）
系统 C: Python Generation Bridge（active V1 CLI）
系统 D: Orchestrator 独立管线（factory_dispatcher + task_state_machine）
影响: 4 个管线系统各自独立运行。资产产出不互通，状态不共享。
```

### CONFLICT-006: landing_v1_generation_spec.json 步序错误

```
严重性: ⚠️ 中
位置: assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json
问题: STEP 4 (FINAL HUMAN APPROVAL) 在生成发生前就被标记为 APPROVED
影响: 违反了 V3 "生成 → QA → 审批" 的顺序门禁逻辑
```

### CONFLICT-007: 三份资产注册表键名不一致

```
严重性: ⚠️ 低
键名: "bg" vs "aigugu_landing_bg" vs "landing_bg"
winner.jpg: 只注册在 index.js，未在 governance/resolver 注册
影响: governance gate 激活时可能阻断 winner.jpg 渲染
```

---

## 4. ACTUAL EXECUTION FLOW DIAGRAM

```
                          ┌──────────────────────────────────────┐
                          │           REAL FLOW                  │
                          │  （非理想，实际已发生的路径）          │
                          └──────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  开发者/用户                                                         │
  │    │                                                                │
  │    ├──→ [手动] 编写 STRUCTURE_SPEC → docs/structure/               │
  │    │          ↓                                                     │
  │    ├──→ [手动] 编写冻结文档 → docs/freeze/                         │
  │    │          ↓                                                     │
  │    ├──→ [CURSOR] 执行管线步骤（全手动）                             │
  │    │          ├──→ STEP 0-1: STRUCTURE DESIGN + APPROVAL            │
  │    │          ├──→ STEP 2:  生成 PROMPT SPEC                       │
  │    │          │              └──→ image_api_adapter.js → SPEC_READY │
  │    │          │                                ↓ (阻断)             │
  │    │          │              无法生成实际图片                       │
  │    │          ├──→ STEP 3:  QA 评估规格（跳过图片，评估文档）      │
  │    │          └──→ STEP 4:  HUMAN APPROVAL                         │
  │    │                                                                 │
  │    ├──→ [Python] visual_generation_bridge_v1.py                     │
  │    │          ├──→ 实际调用 OpenAI/Gemini API                       │
  │    │          ├──→ 保存图片到 assets/visual-autopilot/candidates/  │
  │    │          └──→ 产出 winner 到 assets/visual-autopilot/winner/  │
  │    │                                                                 │
  │    ├──→ [CURSOR] 手动部署资产                                       │
  │    │          ├──→ 复制到 apps/miniapp/static/                      │
  │    │          ├──→ 更新 index.js assetMap                           │
  │    │          └──→ 验证文件存在                                      │
  │    │                                                                 │
  │    └──→ [Python] orchestrator 管线（独立路径）                      │
  │               ├──→ task_planner → factory_dispatcher                │
  │               ├──→ visual_factory → run_multi_candidate_ranking    │
  │               └──→ human_review_gate → publish_runtime              │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘

  KEY:
  [手动] = 需要 HUMAN 操作
  [CURSOR] = Cursor Agent 执行
  [Python] = Python 脚本执行
  (阻断) = 无法继续自动执行
```

---

## 5. CRITICAL GAPS

### GAP-1: 无自动执行入口
不存在一条命令可以执行完整 V3 管线。所有步骤需要 HUMAN + CURSOR 手动协调。

### GAP-2: image_api_adapter.js 不生成图片
V3 管线的 STEP 2 核心组件被注释为 "返回规格，不执行 API 调用"。这是管线自动化的根本阻断点。

### GAP-3: V3 skeleton 未激活
`scripts/visual_autopilot/main.py` 输出 `VISUAL_AUTOPILOT_V3_SKELETON_READY` 但不执行任何生成。executor.py 构建了 V3 管线类但从不被调用。

### GAP-4: 资产注册表分裂
三份注册表使用不同键名。`winner.jpg`（521KB 真实图片）未注册到 governance 系统。

### GAP-5: V1 文档残留
V1 冻结文档未被标记为 SUPERSEDED，存在被误用风险。

### GAP-6: 无质量分阈值定义
V3 STEP 3 要求 "评分 ≥ 阈值"，但阈值未在任何冻结文档中明确定义。QA 运行时使用硬编码 0.7。

### GAP-7: 无一致性校验
系统架构 V4 要求跨页面一致性，但没有自动化校验检查页面间是否共享设计令牌。

---

## 6. MISSING GOVERNANCE LAYERS

| 应该存在 | 实际状态 |
|---------|---------|
| 管线冲突仲裁（V3 vs V4 谁优先） | ❌ 缺失 |
| 版本迁移策略（V1 → V3） | ❌ V1 文件未标记 SUPERSEDED |
| 生成层 API 密钥管理 | ⚠️ 代码中有 KEY 检查逻辑，但无集中管理 |
| 资产注册表同步协议 | ❌ 3 份注册表无同步机制 |
| 管线执行日志 | ❌ 无执行历史记录系统 |

---

## 7. AMBIGUOUS TRIGGER CONDITIONS

| 条件 | 歧义 |
|------|------|
| "生成前必须有结构审批" | 审批者是谁？审批标准是什么？ |
| "评分 ≥ 阈值" | 阈值未定义。不同风格（水墨 vs 太空）用同一标准？ |
| "全系统架构必须先于单页面" | 与 V3 管道冲突，无优先级裁定 |
| "HUMAN APPROVAL" | 谁有审批权？审批反馈周期？ |

---

## 8. INDUSTRIAL STABILITY ASSESSMENT

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  是否可以重复执行 Landing Page 生成？                              ║
║                                                                  ║
║  [资产层]       ✅ 可以 — 文件就位、路径正确、构建包含             ║
║  [设计层]       ⚠️ 有条件 — 需要先确定 V3 vs V4 优先级           ║
║  [执行层]       ❌ 不可以 — 无统一入口，3 条管线割裂              ║
║  [生成层]       ❌ 不可以 — 无实际 API 调用路径                   ║
║                                                                  ║
║  INDUSTRIAL READINESS: NOT READY                                  ║
║  → 当前系统适合人工引导的 CURSOR 辅助生产                         ║
║  → 不适合无人值守的工业化重复生产                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 9. RECOMMENDATION

基于审计结果（不提出新功能），当前系统的结构性建议：

### 必须解决的问题（阻止系统进入工业化）:

1. **V1 文档标记为 SUPERSEDED** — 防止 V1 被错误引用
2. **V3 vs V4 优先级裁定** — 需要在冻结文档中明确哪个优先
3. **image_api_adapter.js API 调用激活** — 否则 STEP 2 永远无法产出图片

### 建议的修复顺序（按严重性）:

```
P0: 解决 CONFLICT-002（V3 vs V4 规则矛盾）
    → 否则每次 Landing Page 生产前都需要 OVERRIDE
    
P0: 解决 CONFLICT-004（生成层阻断）
    → 否则管线在 STEP 2 永久阻断
    
P1: 解决 CONFLICT-001（V1 文档残留）
    → 防止规则误读
    
P1: 解决 CONFLICT-003（orchestrator V1 逻辑）
    → 确保执行层与冻结规则一致
    
P2: 解决 CONFLICT-005（3 条管线无集成）
    → 长期工业化基础
```

---

## 附录 A: 扫描文件索引

| 类别 | 文件数 | 总行数（估计） |
|------|--------|--------------|
| 冻结文档 (docs/freeze/) | 16 | ~2,400 |
| 生产文档 (docs/production/) | 8 | ~1,600 |
| 结构规格 (docs/structure/) | 1 | ~215 |
| 审计文档 (docs/audit/) | 11 | ~4,400 |
| 报告 (docs/reports/) | 2 | ~400 |
| 管线基础设施 (core/visual-pipeline/) | 7 | ~850 |
| Python Autopilot (scripts/visual_autopilot/) | 36 | ~8,000 |
| Orchestrator (orchestrator/) | 44 | ~6,000 |
| 生成规格 (assets/visual-pipeline/) | 2 | ~180 |
| 备选图片 (assets/visual-autopilot/) | 126+ | ~3.2GB |
| 静态资产 (apps/miniapp/static/) | 16 | ~540KB |
| **合计** | **~269+** | **~24,000+ lines** |

---

*审计于 2026-07-01 14:52 · 审计引擎：Cursor Agent · 审计模式：只读分析 / 无新功能提案*
