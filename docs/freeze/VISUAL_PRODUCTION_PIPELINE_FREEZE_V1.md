# VISUAL_PRODUCTION_PIPELINE_FREEZE_V1

> 冻结日期：2026-06-30  
> 冻结状态：**FROZEN**  
> 冻结范围：Landing Page + AR 视觉生产流程  
> 冻结效力：本流程是所有 Landing Page 和 AR 视觉生产的**唯一允许流程**  
> 违反后果：任何偏离本流程的生产视为无效（INVALID）

---

## 1. 冻结声明

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  VISUAL PRODUCTION PIPELINE V1 - FROZEN                             │
│                                                                     │
│  This workflow is now the ONLY allowed process for all              │
│  Landing Page and AR visual production.                             │
│                                                                     │
│  Any deviation from this flow is considered INVALID.                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. 管线顺序（强制）

```
STEP 1 ─── STRUCTURE DESIGN ─────────── 执行引擎: GPT
            页面结构设计、布局规划、信息架构
            ↓ 产出: 结构设计文档（STRUCTURE_SPEC）
            ↓ GATE: 结构需通过审批

STEP 2 ─── FULL PAGE VISUAL ─────────── 执行引擎: AI IMAGE SYSTEM
            完整页面视觉生成
            ↓ 产出: 全页视觉稿（FULL_PAGE_VISUAL）
            ↓ GATE: 视觉需通过自动评分

STEP 3 ─── AUTOMATED QUALITY ────────── 执行引擎: AI QA
            自动质量评分（视觉一致性、品牌合规）
            ↓ 产出: 质量报告（QA_REPORT）
            ↓ GATE: 评分需达标

STEP 4 ─── HUMAN APPROVAL ───────────── 执行引擎: USER (最终决策)
            人工审批（用户最终决定）
            ↓ 产出: 审批结果（APPROVAL / REJECT）
            ↓ GATE: 必须获得 HUMAN APPROVED

STEP 5 ─── VISUAL ASSET DECOMPOSITION ─ 执行引擎: CURSOR
            视觉资产分解（切图、图标、纹理提取）
            ↓ 产出: 资产清单（ASSET_LIST）
            ↓ GATE: 资产清单需完整

STEP 6 ─── ENGINEERING INTEGRATION ──── 执行引擎: CURSOR
            工程集成（文件放置、assetMap 绑定、构建配置）
            ↓ 产出: 集成版本（INTEGRATED_BUILD）
            ↓ GATE: 集成需通过验证

STEP 7 ─── LANDING PAGE RUNTIME ──────── 执行引擎: VALIDATION
            Landing Page 运行时验证
            ↓ 产出: 验证报告（VALIDATION_REPORT）
            ↓ GATE: 零 500 错误 / 零 timeout / 零缺失资源

             → → → RELEASE READY ← ← ←
```

---

## 3. 硬性规则

```
┌─────────────────────────────────────────────────────────────────────┐
│ RULE-001                                                           │
│ No asset generation before structure approval                      │
│ ─────────────────────────────────────────────────────────────────── │
│ 在 STEP 1 结构设计通过审批之前，不得进入 STEP 2 视觉生成。            │
│ 违反：生成的任何资产视为无效。                                       │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-002                                                           │
│ No decomposition before visual approval                            │
│ ─────────────────────────────────────────────────────────────────── │
│ 在 STEP 4 人工审批通过之前，不得进入 STEP 5 资产分解。               │
│ 违反：分解的资产视为无效。                                           │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-003                                                           │
│ No integration before asset freeze                                 │
│ ─────────────────────────────────────────────────────────────────── │
│ 在 STEP 5 资产清单冻结之前，不得进入 STEP 6 工程集成。               │
│ 违反：集成的代码/配置视为无效。                                      │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-004                                                           │
│ No fallback UI considered production asset                         │
│ ─────────────────────────────────────────────────────────────────── │
│ CSS 渐变、纯文本图标、骨架屏等回退方案不是生产资产。                  │
│ 生产资产必须是经过完整管线生成的视觉文件。                            │
├─────────────────────────────────────────────────────────────────────┤
│ RULE-005                                                           │
│ No skipping stages allowed                                         │
│ ─────────────────────────────────────────────────────────────────── │
│ 所有 7 个步骤必须按顺序完整执行。任何跳级行为使结果无效。             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. 管线角色

| 步骤 | 步骤名称 | 执行者 | 产出物 | 门禁条件 |
|------|---------|--------|--------|---------|
| 1 | STRUCTURE DESIGN | GPT | STRUCTURE_SPEC | 结构审批通过 |
| 2 | FULL PAGE VISUAL | AI IMAGE SYSTEM | FULL_PAGE_VISUAL | 评分达标 |
| 3 | AUTOMATED QUALITY | AI QA | QA_REPORT | 评分达标 |
| 4 | HUMAN APPROVAL | USER | APPROVAL / REJECT | APPROVED |
| 5 | VISUAL ASSET DECOMPOSITION | CURSOR | ASSET_LIST | 清单完整 |
| 6 | ENGINEERING INTEGRATION | CURSOR | INTEGRATED_BUILD | 验证通过 |
| 7 | LANDING PAGE RUNTIME VALIDATION | VALIDATION | VALIDATION_REPORT | 零错误 |

---

## 5. 历史对话索引（本管线的溯源依据）

以下为本管线的建设和执行过程记录：

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

---

## 6. 已冻结的代码变更

以下变更已经应用并随本冻结一起生效：

| 文件 | 变更 | 目的 |
|------|------|------|
| `apps/miniapp/project.config.json` | 添加 `static/` 到 packOptions.include | 构建系统包含资产目录 |
| `apps/miniapp/pages/landing/index.js` | `bgImage: ''` → 真实路径 | 场景图激活 |
| `apps/miniapp/core/ui-spec-runtime/asset-resolver.js` | 11 条路径 `/images/` → `/static/` | 注册源统一 |
| `apps/miniapp/core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | 13 条路径 `/images/` → `/static/` | 注册源统一 |
| `apps/miniapp/static/scene/aiqigu_landing_v1.jpg` | 新增 | P0 场景资产 |
| `apps/miniapp/static/scene/landing_fallback.jpg` | 新增 | P0 回退资产 |
| `apps/miniapp/static/scene/aiqigu_landing_v1.webp` | 新增 | P0 WebP 优化 |
| `apps/miniapp/static/scene/aiqigu_street_v1.jpg` | 新增 | P1 街道扩展 |
| `apps/miniapp/static/ui/portal_ring_gold_v1.png` | 新增 | P1 光环纹理 |
| `apps/miniapp/static/bg/portal_mist_v1.png` | 新增 | P1 雾层纹理 |
| `apps/miniapp/static/ui/explore_card_glass_v1.png` | 新增 | P1 卡片玻璃 |
| `apps/miniapp/static/ui/stat_panel_gold_glass_v1.png` | 新增 | P1 面板玻璃 |
| `apps/miniapp/static/icon/wechat_login_gold_v1.png` | 新增 | P2 登录图标 |
| `apps/miniapp/static/icon/location_v1.png` | 新增 | P2 位置图标 |
| `apps/miniapp/static/icon/relic_v1.png` | 新增 | P2 信物图标 |
| `apps/miniapp/static/icon/collectible_v1.png` | 新增 | P2 藏品图标 |
| `apps/miniapp/static/icon/ar_v1.png` | 新增 | P2 AR 图标 |
| `apps/miniapp/static/relic/frame_gold_v2.png` | 新增 | P2 信物框 |
| `apps/miniapp/static/collectible/collectible_frame_v1.png` | 新增 | P2 藏品框 |

---

## 7. 冻结签名

```
冻结日期: 2026-06-30
冻结版本: V1
冻结范围: Landing Page + AR 视觉生产全流程
冻结效力: 本流程是所有 Landing Page 和 AR 视觉生产的唯一允许流程
违反后果: 任何偏离本流程的生产视为无效（INVALID）
冻结机构: LOVEQIGU VISUAL PRODUCTION GOVERNANCE
```

---

*冻结于 2026-06-30 23:29 · 冻结引擎：Cursor Agent · 冻结模式：全流程冻结 / 不可偏离*
