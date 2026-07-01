# VISUAL ASSET PRODUCTION PIPELINE AUDIT REPORT V1

> 审计日期：2026-06-30  
> 审计范围：全项目视觉资产生产线相关文档 + 代码 + 管线系统  
> 审计模式：只读审计 / 系统级能力评估

---

## 1. 生产线文档位置索引

### 1.1 管线架构层（最高级母架构）

| # | 文件路径 | 内容 | 状态 |
|---|---------|------|------|
| 1 | `docs/content-engine/CONTENT_FACTORY_MASTER_ARCHITECTURE_V1.md` | 内容工厂母架构 — 全部内容生产体系最高级架构。定义 CONTENT_FACTORY 统管 WORLD / VISUAL / PROMPT / RUNTIME 四个子工厂。 | FROZEN |
| 2 | `docs/product/content/CONTENT_ASSET_PRODUCTION_V1.md` | 内容资产生产总体系 — 四象/经络/宝物/祝福/文化语句/景区适配六大内容体系的生产规则。 | FROZEN |

### 1.2 Visual Autopilot 管线（多模型图像生成编排）

| # | 文件路径 | 内容 | 状态 |
|---|---------|------|------|
| 3 | `docs/governance/VISUAL_AUTOPILOT_V3_ARCHITECTURE_V1.md` | V3 架构 — 多模型视觉生成编排系统。管线：Prompt → Model Router → Multi Provider → Candidate Pool → Audit → Scoring → Selection → Registry → Freeze Gate → Runtime。 | PROPOSED |
| 4 | `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md` | L1 Prompt Generator → L2 Multi-Model Gen → L3 Audit → L4 Scoring → L5 Registry → L6 Freeze Gate。6 层架构。 | PROPOSED |
| 5 | `docs/governance/VISUAL_AUTOPILOT_PIPELINE_INTEGRATION_V1.md` | V3 组件端到端集成蓝图 — 执行序列、模块交互、输入输出契约、治理检查点、Freeze 集成。 | DRAFT |
| 6 | `docs/governance/VISUAL_AUTOPILOT_ROUTER_V1.md` | 路由策略 — 根据意图风格（RITUAL/COMMERCIAL/SCENIC/COLLECTIBLE）分发到 OpenAI / Gemini / 万相 / 文心一格 / Seedream。 | PROPOSED |
| 7 | `docs/governance/VISUAL_AUTOPILOT_SELECTION_ENGINE_V1.md` | 选择引擎 — 从候选池中选出优胜者。 | PROPOSED |
| 8 | `docs/governance/VISUAL_AUTOPILOT_EVALUATOR_V1.md` | 评估器 — 对候选图像进行评分。 | PROPOSED |
| 9 | `docs/governance/VISUAL_AUTOPILOT_PROVIDER_CAPABILITY_MATRIX_V1.md` | 供应商能力矩阵 — 各模型的能力对比。 | DRAFT |
| 10 | `docs/governance/VISUAL_AUTOPILOT_PROVIDER_ABSTRACTION_V1.md` | 供应商抽象层 — 统一接口定义。 | DRAFT |
| 11 | `docs/governance/VISUAL_AUTOPILOT_PROVIDER_IMPLEMENTATION_V1.md` | 供应商实现层 — 各模型的具体实现。 | DRAFT |
| 12 | `docs/governance/VISUAL_AUTOPILOT_COST_CONTROL_V1.md` | 成本控制策略 — 按模型/分辨率定价。 | PROPOSED |
| 13 | `docs/governance/VISUAL_AUTOPILOT_GOVERNANCE_V1.md` | 管线治理规则 — AI 协作治理。 | PROPOSED |

### 1.3 Visual Factory（后台可视化管理台）

| # | 文件路径 | 内容 | 状态 |
|---|---------|------|------|
| 14 | `docs/tech/visual_factory/VISUAL_FACTORY_L1_IMPLEMENTATION_PLAN_V1.md` | 视觉工厂 L1 实施计划 — 从 L0（手工）到 L1（自动生成需求+Prompt+队列）。 | DRAFT |
| 15 | `docs/tech/visual_factory/VISUAL_FACTORY_L1_RUNTIME_BUILD_REPORT.md` | L1 运行时构建报告 — 6 个服务模块 + 3 个 Schema + Admin 页面已创建。 | REPORT |
| 16 | `docs/tech/visual_factory/VISUAL_FACTORY_L2_PROVIDER_SPIKE_REPORT_V1.md` | L2 供应商集成 Spike — 测试外部模型接入。 | REPORT |
| 17 | `docs/tech/visual_factory/11VISUAL_FACTORY_BATCH_EXPORTER_V1_REPORT.md` | 批次导出器 — 批量资产导出工具。 | REPORT |
| 18 | `docs/tech/visual_factory/ARCHETYPE_VISUAL_FACTORY_AUTOMATION_V1_REPORT.md` | 原型视觉工厂自动化 — 四象系统自动化生产。 | REPORT |

### 1.4 代码实现（运行时管线）

| # | 路径 | 内容 | 状态 |
|---|------|------|------|
| 19 | `orchestrator/factories/adapters/visual_factory.py` | VisualFactoryAdapter — 编排器端的视觉工厂适配器。调用 `run_multi_candidate_ranking` + HumanReviewGate。 | 实现 |
| 20 | `scripts/visual_autopilot/pipeline.py` | VisualPipeline — Python 管线主类：Router → Evaluator → Audit → Selection → Judge。 | 实现 |
| 21 | `scripts/visual_autopilot/main.py` | CLI 入口 — 运行完整管线。 | 实现 |
| 22 | `scripts/visual_autopilot/executor.py` | 执行器 — 调用各模型供应商。 | 实现 |
| 23 | `scripts/visual_autopilot/candidate_judge.py` | 候选判断 — 对生成图像评分/排名。 | 实现 |
| 24 | `scripts/visual_autopilot/human_alignment.py` | 人类对齐 — 人工偏好对齐。 | 实现 |
| 25 | `scripts/visual_autopilot/gemini_judge.py` | Gemini 评判 — 使用 Gemini 作为评判模型。 | 实现 |
| 26 | `apps/admin/modules/visual-factory/services/visual-task-service.js` | 视觉任务服务 — Admin 后台任务管理。 | 实现 |
| 27 | `apps/admin/modules/visual-factory/services/art-requirement-generator.js` | 艺术需求生成器 — 自动生成 art requirement。 | 实现 |
| 28 | `apps/admin/modules/visual-factory/services/prompt-generator.js` | Prompt 生成器 — 自动生成各模型的 prompt。 | 实现 |
| 29 | `apps/admin/modules/visual-factory/services/generation-queue.js` | 生成队列 — 管理待生成任务队列。 | 实现 |

### 1.5 资产生产执行层（近期实际产出）

| # | 文件路径 | 内容 | 生成日期 |
|---|---------|------|---------|
| 30 | `docs/production/ASSET_PRODUCTION_BACKLOG_V1.md` | 资产生产积压清单 — 全项目 UI 视觉资产审计结果。15 个缺失资产。 | 2026-06-30 |
| 31 | `docs/production/VISUAL_ASSET_DELIVERY_CONTRACT_V1.md` | 视觉资产交付合同 — 生产规格 + Prompt + 优先级分类。 | 2026-06-30 |
| 32 | `docs/production/VISUAL_ASSET_DELIVERY_EXECUTION_PLAN_V1.md` | 交付执行计划 — UI → 资产绑定映射 + 注入点 + 生产顺序。 | 2026-06-30 |
| 33 | `docs/production/VISUAL_PIPELINE_EXECUTION_PLAN_V1.md` | 管线执行计划 — 结构化 Prompt + API 调用规格 + 存储规则。 | 2026-06-30 |
| 34 | `docs/production/TASK_REPORT_VISUAL_ASSET_EXECUTION_V1.md` | 资产生成执行报告 — 15 个资产已生成并放置。 | 2026-06-30 |

### 1.6 相关管线文档

| # | 文件路径 | 内容 |
|---|---------|------|
| 35 | `docs/art/scenic/aiqigu/AIQIGU_ASSET_PRODUCTION_PACKAGE_V1.md` | 爱企谷资产生产包 — 首个真实景区样板资产生产。 |
| 36 | `docs/art/ART_SCENIC_CONTENT_PIPELINE_V1.md` | 景区内容管线 — 景区-内容生产流程。 |
| 37 | `docs/art/AZURE_DRAGON_GENERATION_WORKFLOW_V1.md` | 青龙生成工作流 — 四象青龙具体生成流程。 |
| 38 | `docs/art/VERMILION_BIRD_GENERATION_WORKFLOW_V1.md` | 朱雀生成工作流 — 四象朱雀具体生成流程。 |
| 39 | `docs/admin/visual/ADMIN_VISUAL_ASSET_PACK_V1.md` | 管理后台视觉资产包 — Admin UI 视觉资产。 |
| 40 | `docs/admin/visual/ADMIN_OPERATION_VISUAL_SYSTEM_V1.md` | 管理后台运营视觉系统 — Admin 运营侧视觉。 |
| 41 | `docs/visual_autopilot/ART_RUNTIME_DEPLOYMENT_V1.md` | 艺术运行时部署 — Prompt → Asset → Registry → Runtime → User 全链路。 |

---

## 2. 管线架构全景

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VISUAL ASSET PRODUCTION PIPELINE                  │
│                         (系统架构全景图)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MASTER ARCHITECTURE                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ CONTENT_FACTORY_MASTER_ARCHITECTURE (最高级母架构)              │  │
│  │ 管: WORLD / VISUAL / PROMPT / RUNTIME 四个子工厂               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│         ↓                                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ CONTENT_ASSET_PRODUCTION (资产生产总体系)                        │  │
│  │ 六套内容体系: 四象 / 经络 / 宝物 / 祝福 / 文化语句 / 景区适配    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│         ↓                                                           │
├─────────────────────────────────────────────────────────────────────┤
│  VISUAL AUTOPILOT (多模型生成编排管线)     VISUAL FACTORY (后台管理) │
│  ┌──────────────────────────────┐      ┌─────────────────────────┐  │
│  │ 1. Task Intake               │      │ Visual Task Board       │  │
│  │ 2. Prompt Package Generator  │─────→│ Art Requirement Gen     │  │
│  │ 3. Model Router              │      │ Prompt Generator        │  │
│  │    ├─ OpenAI                  │      │ Generation Queue        │  │
│  │    ├─ Gemini                  │      │ Batch Exporter          │  │
│  │    ├─ 万相(阿里)              │      └─────────────────────────┘  │
│  │    ├─ 文心一格(百度)          │                                    │
│  │    └─ Seedream(字节)          │      ORCHESTRATOR LAYER           │
│  │ 4. Multi-Provider Generation │      ┌─────────────────────────┐  │
│  │ 5. Candidate Pool            │      │ Factory Dispatcher      │  │
│  │ 6. Visual Audit Engine       │←────→│ VisualFactoryAdapter    │  │
│  │ 7. Visual Scoring Engine     │      │ HumanReviewGate         │  │
│  │ 8. Selection Engine          │      │ Release Manager         │  │
│  │ 9. Freeze Gate               │      └─────────────────────────┘  │
│  │ 10. Asset Registry           │                                    │
│  │ 11. Runtime Approval         │      SCRIPTS LAYER                │
│  └──────────────────────────────┘      ┌─────────────────────────┐  │
│                                         │ pipeline.py (主管线)     │  │
│                                         │ candidate_judge.py      │  │
│                                         │ gemini_judge.py         │  │
│                                         │ human_alignment.py      │  │
│                                         │ executor.py             │  │
│                                         │ config.py               │  │
│                                         └─────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  ASSET PRODUCTION EXECUTION (近期执行层)                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ASSET_PRODUCTION_BACKLOG_V1  (资产审计)                        │  │
│  │   → VISUAL_ASSET_DELIVERY_CONTRACT_V1  (生产合同)               │  │
│  │     → VISUAL_ASSET_DELIVERY_EXECUTION_PLAN_V1  (执行计划)       │  │
│  │       → VISUAL_PIPELINE_EXECUTION_PLAN_V1  (管线编排)          │  │
│  │         → TASK_REPORT_VISUAL_ASSET_EXECUTION_V1  (执行报告)     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 管线能力评估

### 3.1 能力矩阵

| 能力维度 | 当前等级 | 说明 |
|---------|---------|------|
| **Prompt 生成自动化** | L3 | Admin 后台的 `prompt-generator.js` 可根据 canon 自动生成各模型的专属 prompt |
| **多模型生成编排** | L2 | `VisualRouter` 可根据意图分配模型，但种子数据量有限 |
| **候选图像评分** | L2 | `candidate_judge.py` + `gemini_judge.py` 可实现评分，但准确度待验证 |
| **人工审核集成** | L2 | `HumanReviewGate` 已实现，有 review_package 流程 |
| **Freeze Gate 冻结** | L1 | Freeze gate 架构已定义但运行时集成测试有限 |
| **Admin 管理台** | L1 | 6 个服务模块已创建，UI page skeletons 存在，但未深度集成到主 Admin |
| **Orchestrator 适配** | L2 | `VisualFactoryAdapter` 已注册到 Factory Dispatcher，可通过 workflow 触发 |
| **批量导出** | L1 | `batch_exporter` 已实现，输出到 `assets/visual-autopilot/` |

### 3.2 管线完备度

```
VISUAL AUTOPILOT (架构层):
  Prompt Gen    ■■■■□□□□□□  40%  (定义但不完善)
  Router        ■■■□□□□□□□  30%  (种子路由有限)
  Provider Gen  ■■■■□□□□□□  40%  (5个provider接口，但部分不可用)
  Audit         ■■□□□□□□□□  20%  (架构定义，实现有限)
  Scoring       ■■□□□□□□□□  20%  (基础实现，需要校准)
  Selection     ■■□□□□□□□□  20%  (基础实现)
  Freeze Gate   ■■□□□□□□□□  20%  (架构存在，运行时弱)
  Registry      ■□□□□□□□□□  10%  (基础注册表)
  Runtime Deploy□  0%  (未有直接发布到小程序的管线)

VISUAL FACTORY (后台层):
  Task Board    ■■■■□□□□□□  40%  (UI + 服务存在)
  Art Req Gen   ■■■■□□□□□□  40%  (服务存在)
  Prompt Gen    ■■■■□□□□□□  40%  (服务存在)
  Gen Queue     ■■■■□□□□□□  40%  (服务存在)
  Batch Export  ■■■□□□□□□□  30%  (实现存在)
  Admin UI      ■■■□□□□□□□  30%  (page skeletons)
```

### 3.3 管线当前可用能力

| 能力 | 是否可用 | 备注 |
|------|---------|------|
| 从 Canon 自动生成艺术需求 | ✅ 可用 | `art-requirement-generator.js` 服务就绪 |
| 从艺术需求自动生成 Prompt | ✅ 可用 | `prompt-generator.js` 服务就绪，支持 ChatGP / Gemini / Doubao 格式 |
| 创建视觉任务并加入队列 | ✅ 可用 | `visual-task-service.js` + `generation-queue.js` 就绪 |
| 通过编排器触发管线 | ✅ 可用 | `VisualFactoryAdapter` 已注册到 Factory Dispatcher |
| 多模型并行生成 | ⚠️ 部分可用 | 代码架构就绪，但部分模型 API key 未配置 |
| 候选图像自动评分 | ⚠️ 部分可用 | `candidate_judge.py` + `gemini_judge.py` 就绪，但需要校准 |
| 人工审核 + 发布 | ✅ 可用 | `HumanReviewGate` + `review_package` 流程完整 |
| Freeze 后发布到 Runtime | ❌ 不可用 | Freeze gate 有架构定义但未完整集成到小程序发布 |
| Admin 可视化操作 | ⚠️ 部分可用 | 页面存在但未完全集成到主 Admin 导航 |

### 3.4 管线局限性

| 限制项 | 说明 |
|--------|------|
| 无直接小程序发布 | 资产生成后需要手动放入 `apps/miniapp/static/` 目录 |
| Provider API keys 不完整 | 5 个模型供应商中部分未配置实际 API key |
| 评分校准不足 | `candidate_judge` 的评分标准需要更多人类校准数据 |
| Freeze Gate 运行时未充分测试 | V3 架构中的 Freeze Gate 定义完整但测试覆盖不足 |
| Admin UI 未完全集成 | Visual Factory 的 Admin pages 存在但未在导航中显示 |

---

## 4. 管线中各子系统的角色

| 子系统 | 角色 | 输入 | 输出 | 状态 |
|--------|------|------|------|------|
| **VISUAL AUTOPILOT** | 多模型图像生成编排 | Canon + Visual System + Asset Request | 候选图像 + 评分 + 选择结果 | PROPOSED |
| **VISUAL FACTORY** | Admin 后台可视化任务管理 | 探索点/信物/活动 | Art Requirement + Prompt + 队列 | DRAFT/L1 |
| **CONTENT FACTORY** | 内容生产母架构 | 世界观规则 + 产品 Canon | 整体内容资产管线调度 | FROZEN |
| **ORCHESTRATOR** | 编排执行引擎 | Workflow 模板 | 工厂调度 + 审核 + 发布 | ACTIVE |
| **SCRIPTS** | 命令行管线执行 | Prompt + 配置 | 生成结果 + 候选池 | ACTIVE |
| **近期生产执行层** | 实际资产生产执行 | 审计积压清单 | 15 个已放置资产 | COMPLETE |

---

## 5. 生产管线总评

### 5.1 管线成熟度：L1.5 / L5

```
L0: 完全手工     ─── 已经过去（历史状态）
L1: 半自动化     ──► 当前水平（部分自动 + 人工在环）
    └── Prompt 自动生成 ✓
    └── 任务队列 ✓
    └── 多模型编排 ⚠️
    └── 评分/选择 基础实现
L2: 自动化管线   ─── 目标下一次迭代
    └── 端到端自动执行
    └── Freeze + Runtime 发布
L3: 大规模生产
L4: 自适应优化
L5: 完全自治
```

### 5.2 管线当前作用

1. **Prompt 生成**：从艺术需求自动生成针对 ChatGPT / Gemini / 豆包的差异化 prompt
2. **任务管理**：在 Admin 后台创建、跟踪视觉任务
3. **多模型编排**：根据视觉意图（仪式/商业/场景/藏品）路由到最合适的模型
4. **候选评分**：对生成的候选图像进行自动评分 + 人工校准
5. **审核流程**：人工审核 + freeze gate 确保资产质量
6. **近期生产**：上述 5 个文档构成了 Jumpstart 实际资产生产（15 个 Landing Page 资产）

### 5.3 管线当前不做的事

1. **不直接发布到小程序运行时** — 需要手动放入 `static/` 目录
2. **不进行 SVG→JPEG/PNG 转换** — 依赖外部工具或 `sharp` 库
3. **不管理小程序内 assetMap** — assetMap 在 `index.js` 中静态定义

---

## 6. 相关数据/资产目录

| 路径 | 内容 |
|------|------|
| `assets/visual-autopilot/candidates/` | 所有管线生成的候选图像（100+ JPG） |
| `assets/visual-autopilot/judge/` | 评判结果 + 排名数据 |
| `assets/visual-autopilot/alignment/` | 人类偏好对齐数据 |
| `assets/visual-autopilot/review/` | 审核包 + 审查状态 |
| `assets/visual-autopilot/winner/` | 最终选中的优胜图像 |
| `data/visual_factory/batches/golden_phoenix_v1/` | 金凤批次生产资产 |
| `apps/miniapp/static/` | 小程序运行时资产目录（15 个近期放置） |

---

## 7. 总结

**LOVEQIGU 拥有一个定义完整的、四层架构的视觉资产生产线体系：**

- **母架构层** (`CONTENT_FACTORY_MASTER_ARCHITECTURE`) 定义了全部内容生产的顶层设计
- **编排层** (`VISUAL_AUTOPILOT` V3) 定义了多模型图像生成的标准管线（Prompt → Router → Generate → Audit → Score → Select → Freeze → Registry）
- **后台层** (`VISUAL_FACTORY` L1) 实现了 Admin 可视化的任务创建、需求生成、Prompt 生成、队列管理
- **执行层** (`docs/production/` 系列) 刚完成了首次实际生产执行（15 个 Landing Page 资产）

当前管线处于 **L1.5** 级别 — 半自动化，人工在环。管线完全有能力支撑视觉资产的批量生产，但从小程序端看，最终的发布环节（放入 `static/` + 更新 assetMap + 激活 `bgImage`）目前是手工操作。

---

*报告生成于 2026-06-30 · 审计引擎：Cursor Agent · 审计模式：只读审计 / 系统级能力评估*
