# VISUAL_PRODUCTION_PIPELINE_FREEZE_V3

> 冻结日期：2026-07-01  
> 冻结状态：**FROZEN**  
> 冻结范围：Landing Page 视觉生产流程  
> 冻结效力：本流程是 Landing Page 视觉生产的**唯一允许流程**  
> 违反后果：任何偏离本流程的生产视为无效（INVALID）  
> 取代版本：V1（2026-06-30 冻结）

> **V3 升级说明**  
> 本版本从 V1 的 7 步流程升级为 8 步流程（0–7），将 "HUMAN APPROVAL" 拆分为两步（结构审批 + 最终审批），新增 "FULL PAGE VISUAL IS SINGLE SOURCE OF TRUTH" 规则，并去除了 AR 视觉范围。

---

## 1. 冻结声明

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  VISUAL PRODUCTION PIPELINE V3 - FROZEN                             │
│                                                                     │
│  This is the ONLY allowed workflow for all                           │
│  Landing Page visual production.                                    │
│                                                                     │
│  Any deviation from this flow is considered INVALID.                │
│                                                                     │
│  Supersedes VISUAL_PRODUCTION_PIPELINE_FREEZE_V1                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. 管线顺序（强制）

```
STEP 0 ─── STRUCTURE DESIGN ─────────── 执行引擎: GPT
            页面结构设计、布局规划、信息架构
            ↓ 产出: 结构设计文档（STRUCTURE_SPEC）
            ↓ GATE: 移交至审批

STEP 1 ─── STRUCTURE APPROVAL ───────── 执行引擎: HUMAN
            人工审批结构设计
            ↓ 产出: 审批结果（APPROVED / REJECTED）
            ↓ GATE: 必须 APPROVED 才能进入下一步

STEP 2 ─── FULL PAGE VISUAL ─────────── 执行引擎: AI IMAGE SYSTEM
            完整页面视觉生成
            ↓ 产出: 全页视觉稿（FULL_PAGE_VISUAL）
            ↓ GATE: 移交至自动评分

STEP 3 ─── VISUAL QA ────────────────── 执行引擎: AUTO
            自动质量评分（视觉一致性、品牌合规、UI 适配）
            ↓ 产出: 质量报告（QA_REPORT）
            ↓ GATE: 评分必须 ≥ 阈值

STEP 4 ─── FINAL HUMAN APPROVAL ─────── 执行引擎: HUMAN
            最终人工审批完整视觉稿
            ↓ 产出: 审批结果（APPROVED / REJECTED）
            ↓ GATE: 必须 APPROVED 才能进入分解

STEP 5 ─── VISUAL DECOMPOSITION ─────── 执行引擎: CURSOR
            从 APPROVED 全页视觉稿中提取切图、图标、纹理
            ↓ 产出: 资产清单（ASSET_LIST）
            ↓ GATE: 清单必须完整

STEP 6 ─── ASSET PRODUCTION ─────────── 执行引擎: CURSOR + AI
            资产文件生成、格式转换、尺寸适配
            ↓ 产出: 生产资产（PRODUCTION_ASSETS）
            ↓ GATE: 资产需通过验证

STEP 7 ─── RUNTIME RECONSTRUCTION ───── 执行引擎: CURSOR
            构建集成、assetMap 绑定、运行时验证
            ↓ 产出: 发布版本（RELEASE_BUILD）
            ↓ GATE: 零 500 错误 / 零 timeout / 零缺失资源

             → → → RELEASE READY ← ← ←
```

---

## 3. 硬性规则

```
┌─────────────────────────────────────────────────────────────────────┐
│ RULE-001                                                           │
│ No generation before structure approval                            │
│ ─────────────────────────────────────────────────────────────────── │
│ 在 STEP 1 结构审批通过之前，不得进入 STEP 2 全页视觉生成。          │
│ 违反：生成的任何视觉内容视为无效。                                   │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-002                                                           │
│ No decomposition before full page approval                         │
│ ─────────────────────────────────────────────────────────────────── │
│ 在 STEP 4 最终人工审批通过之前，不得进入 STEP 5 视觉分解。          │
│ 违反：分解的资产视为无效。                                           │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-003                                                           │
│ No asset creation outside approved visual source                   │
│ ─────────────────────────────────────────────────────────────────── │
│ 所有资产文件必须从 APPROVED 全页视觉稿中分解提取。                   │
│ 禁止凭空创建、从其他页面借用、或在视觉审批前独立生产资产。           │
│ 违反：独立生产的资产视为无效，不得纳入 assetMap。                    │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-004                                                           │
│ Full page visual is SINGLE SOURCE OF TRUTH                         │
│ ─────────────────────────────────────────────────────────────────── │
│ STEP 2 生成的 FULL_PAGE_VISUAL 是视觉面目的唯一权威来源。           │
│ 所有后续步骤（分解、生产、集成）必须严格基于该视觉稿。               │
│ 禁止任何步骤引入视觉稿中不存在的元素、颜色、布局或资产。            │
│ 违反：引入的非来源元素视为无效。                                     │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-005                                                           │
│ No skipping stages allowed                                         │
│ ─────────────────────────────────────────────────────────────────── │
│ 所有 8 个步骤（0–7）必须按顺序完整执行。                             │
│ 任何跳级行为使结果无效。                                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. 管线角色

| 步骤 | 步骤名称 | 执行者 | 产出物 | 门禁条件 |
|------|---------|--------|--------|---------|
| 0 | STRUCTURE DESIGN | GPT | STRUCTURE_SPEC | 移交至审批 |
| 1 | STRUCTURE APPROVAL | HUMAN | APPROVED / REJECTED | APPROVED |
| 2 | FULL PAGE VISUAL | AI IMAGE SYSTEM | FULL_PAGE_VISUAL | 移交至 QA |
| 3 | VISUAL QA | AUTO | QA_REPORT | 评分 ≥ 阈值 |
| 4 | FINAL HUMAN APPROVAL | HUMAN | APPROVED / REJECTED | APPROVED |
| 5 | VISUAL DECOMPOSITION | CURSOR | ASSET_LIST | 清单完整 |
| 6 | ASSET PRODUCTION | CURSOR + AI | PRODUCTION_ASSETS | 验证通过 |
| 7 | RUNTIME RECONSTRUCTION | CURSOR | RELEASE_BUILD | 零错误 |

---

## 5. 已冻结的基础设施模块

以下管线基础设施已随 V1 + V3 冻结生效，位于 `apps/miniapp/core/visual-pipeline/`：

| 模块 | 文件 | 用途 |
|------|------|------|
| 管线编排器 | `pipeline_orchestrator.js` | 步骤顺序强制、门禁锁定、RULE-001 至 RULE-005 执行 |
| 提示词生成器 | `prompt_builder.js` | 从 STRUCTURE_SPEC 生成 AI 就绪提示词 |
| 图片 API 适配器 | `image_api_adapter.js` | 多模型抽象层（Gemini / DALL·E 3 / Seedream） |
| QA 评分引擎 | `qa_scoring_engine.js` | 4 维度自动质量评分 |
| 资产验证器 | `asset_validator.js` | 文件存在性、大小、格式验证 |
| 视觉分解器 | `asset_decomposer.js` | 全页视觉 → 单体资产分解规格 |
| 资产映射写入器 | `asset_map_writer.js` | assetMap JS 补丁生成 |

---

## 6. 管线执行历史

| 阶段 | 对话 | 产出文档 |
|------|------|---------|
| 审计 | Landing Page 资产链路审计 | `docs/reports/LANDING_PAGE_ASSET_CHAIN_AUDIT_REPORT_2026-06-30.md` |
| 积压 | 资产生产积压清单 | `docs/production/ASSET_PRODUCTION_BACKLOG_V1.md` |
| 合同 | 视觉资产交付合同 | `docs/production/VISUAL_ASSET_DELIVERY_CONTRACT_V1.md` |
| 计划 | 交付执行计划 | `docs/production/VISUAL_ASSET_DELIVERY_EXECUTION_PLAN_V1.md` |
| 编排 | 管线执行计划 | `docs/production/VISUAL_PIPELINE_EXECUTION_PLAN_V1.md` |
| 执行 | 资产生成执行 | `docs/production/TASK_REPORT_VISUAL_ASSET_EXECUTION_V1.md` |
| 审计 | 管线审计 | `docs/audit/VISUAL_ASSET_PRODUCTION_PIPELINE_AUDIT_REPORT_V1.md` |
| 交付 | 交付层实现 | `docs/production/TASK_REPORT_VISUAL_DELIVERY_LAYER_V1.md` |
| 引导 | 管线引导 | `docs/production/TASK_REPORT_VISUAL_PIPELINE_BOOTSTRAP_V1.md` |
| 部署 | 运行时交付引擎 | `docs/production/TASK_REPORT_VISUAL_RUNTIME_DELIVERY_V1.md` |

---

## 7. 已冻结的代码变更

以下变更是管线 V1 + V3 的执行产出，随本冻结一起生效：

### 7.1 管线基础设施

| 文件 | 变更 |
|------|------|
| `apps/miniapp/core/visual-pipeline/pipeline_orchestrator.js` | 新建 — 8 步管线编排器 |
| `apps/miniapp/core/visual-pipeline/prompt_builder.js` | 新建 — 提示词生成 |
| `apps/miniapp/core/visual-pipeline/image_api_adapter.js` | 新建 — API 适配器 |
| `apps/miniapp/core/visual-pipeline/qa_scoring_engine.js` | 新建 — QA 评分 |
| `apps/miniapp/core/visual-pipeline/asset_validator.js` | 新建 — 资产验证 |
| `apps/miniapp/core/visual-pipeline/asset_decomposer.js` | 新建 — 视觉分解 |
| `apps/miniapp/core/visual-pipeline/asset_map_writer.js` | 新建 — assetMap 写入 |

### 7.2 构建配置

| 文件 | 变更 |
|------|------|
| `apps/miniapp/project.config.json` | 添加 `static/` 到 packOptions.include |

### 7.3 运行时绑定

| 文件 | 变更 |
|------|------|
| `apps/miniapp/pages/landing/index.js` | `getAssetMap()` 从 9 条 → 16 条条目 |
| `apps/miniapp/pages/landing/index.js` | `bgImage: ''` → `/static/scene/aiqigu_landing_v1.jpg` |

### 7.4 注册源统一

| 文件 | 变更 |
|------|------|
| `apps/miniapp/core/ui-spec-runtime/asset-resolver.js` | 路径 `/images/` → `/static/` |
| `apps/miniapp/core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | 路径 `/images/` → `/static/` |

### 7.5 生产资产

| 资产 | 路径 | 优先级 |
|------|------|--------|
| `aiqigu_landing_v1.jpg` | `apps/miniapp/static/scene/` | P0 |
| `aiqigu_landing_v1.webp` | `apps/miniapp/static/scene/` | P0 |
| `landing_fallback.jpg` | `apps/miniapp/static/scene/` | P0 |
| `winner.jpg` | `apps/miniapp/static/scene/` | P0+ |
| `aiqigu_street_v1.jpg` | `apps/miniapp/static/scene/` | P1 |
| `portal_ring_gold_v1.png` | `apps/miniapp/static/ui/` | P1 |
| `portal_mist_v1.png` | `apps/miniapp/static/bg/` | P1 |
| `explore_card_glass_v1.png` | `apps/miniapp/static/ui/` | P1 |
| `stat_panel_gold_glass_v1.png` | `apps/miniapp/static/ui/` | P1 |
| `wechat_login_gold_v1.png` | `apps/miniapp/static/icon/` | P2 |
| `location_v1.png` | `apps/miniapp/static/icon/` | P2 |
| `relic_v1.png` | `apps/miniapp/static/icon/` | P2 |
| `collectible_v1.png` | `apps/miniapp/static/icon/` | P2 |
| `ar_v1.png` | `apps/miniapp/static/icon/` | P2 |
| `frame_gold_v2.png` | `apps/miniapp/static/relic/` | P2 |
| `collectible_frame_v1.png` | `apps/miniapp/static/collectible/` | P2 |

---

## 8. 冻结签名

```
冻结日期: 2026-07-01
冻结版本: V3
冻结范围: Landing Page 视觉生产全流程
冻结效力: 本流程是 Landing Page 视觉生产的唯一允许流程
违反后果: 任何偏离本流程的生产视为无效（INVALID）
取代版本: V1（2026-06-30）
冻结机构: LOVEQIGU VISUAL PRODUCTION GOVERNANCE
```

---

*冻结于 2026-07-01 00:10 · 冻结引擎：Cursor Agent · 冻结模式：全流程冻结 / 不可偏离*
