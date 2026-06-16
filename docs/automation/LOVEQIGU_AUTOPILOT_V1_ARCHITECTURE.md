# LOVEQIGU Autopilot V1 — Architecture

> **文件标识**：`LOVEQIGU_AUTOPILOT_V1_ARCHITECTURE.md`  
> **版本**：V1.0  
> **日期**：2026-06-08  
> **Mission**：66 · `LOVEQIGU_AUTOPILOT_V1_ARCHITECTURE`  
> **性质**：**架构设计 only · 不修改业务文件 · 不执行自动化**

---

## §0 背景与现状

### 0.1 章节状态（截至 2026-06-08）

| 章 | Content Canon | L2 四层 JSON | DC Registry | 章节链路 | 冻结 |
|----|:-------------:|:------------:|:-----------:|:--------:|:----:|
| CH01 | 全局 + exemplar | **active** | CH01 ref in AR | → CH02 | **已冻结** |
| CH02 | V1 | **active** | **已登记** | ← CH01 · next TBD | **已冻结** |
| CH03 | V1 | **Fill 完成** | **已登记** | prev CH02 · next TBD | **未冻结** |

### 0.2 设计目标

将 CH01→CH03 已验证的 **手工 + 半自动** 生产线，抽象为可复用的 **LOVEQIGU_AUTOPILOT_V1**，在 **不扩 Lore · 不填 Gap · 不替代 Canon** 的前提下，最大化 L2 工厂步骤的自动化，并把 **方向裁决** 保留给人工。

### 0.3 上位约束

| 文档 | 角色 |
|------|------|
| [`AGENTS.md`](../../AGENTS.md) | Canon / 术语 / 资产边界 |
| [`LOVEQIGU_AUTOMATION_STRATEGY_MEMO.md`](../beiwang/LOVEQIGU_AUTOMATION_STRATEGY_MEMO.md) | 审查 > 治理 > 工作流 > 扩展 |
| [`LOVEQIGU_AUTOPILOT_V1.md`](LOVEQIGU_AUTOPILOT_V1.md) | V1 运行规范（已实现子集） |
| [`automation/chapters/registry.yaml`](../../automation/chapters/registry.yaml) | 章节注册表 |

---

## §1 生产线总览

### 1.1 标准流水线（目标序）

用户指定的 **九段式** 生产序列为 Autopilot V1 的 **逻辑架构**（与部分已实施脚本的阶段顺序略有差异，见 §1.3）：

```text
┌─────────────────────────────────────────────────────────────────┐
│  ① Canon                    [HUMAN · 方向稿]                     │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ② Placeholder              [AUTO · 四章空壳 JSON]               │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ③ Audit (Placeholder)      [AUTO · 壳结构 / 边界 / 无实体]       │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ④ Fill                     [SEMI · 5/6/5/6 工厂填充]            │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⑤ Audit (Content)          [AUTO · 跨层 / Canon / 术语]         │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⑥ Digital Collectible Reg  [AUTO · Registry MD · 非 Relic]     │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⑦ Link                     [AUTO · prev.next_chapter 接线]       │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⑧ Freeze                   [SEMI · Freeze Report · 人工裁决]   │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
                    [HUMAN · Git baseline / tag]
```

### 1.2 工厂常量（不可变）

| 维度 | CH01 exemplar | 后续章 |
|------|---------------|--------|
| Story 节点 | 5 | 5 |
| Relic | 6 | 6 |
| Rights | 5 | 5 |
| AR Event | 6 | 6 |
| 印谱 | A | B · C · … 独立 |
| 觉察结构 | five_awareness | 同型 |

### 1.3 实施差异说明

当前 [`run_chapter_autopilot.py`](../../scripts/autopilot/run_chapter_autopilot.py) 将 **Post-Fill Audit** 与 **Link / DC** 合并执行，**未单独实现 Placeholder Audit 阶段**。架构上 **③ 必须存在**（CH02/CH03 实践中通过 Placeholder CREATE_REPORT 人工确认）；V1.1 应补独立 `audit --mode placeholder`。

---

## §2 自动步骤

| # | 阶段 | 输入 | 输出 | V1 实现度 |
|---|------|------|------|:---------:|
| A1 | **CANON_CHECK** | `CHxx_CONTENT_CANON_V1.md` 存在性 | pass / stop | 已实现 |
| A2 | **PLACEHOLDER_CREATE** | Canon + registry | 4× JSON 空壳 · `status: placeholder` | 已实现 |
| A3 | **PLACEHOLDER_AUDIT** | 空壳 JSON | 结构/schema/边界 · 0 实体 | **待独立化** |
| A4 | **CONTENT_FILL** | manifest + Canon 方向 | 5 节点 · 6 信物 · 5 权益 · 6 AR | **半自动**（Cursor/Agent） |
| A5 | **CONTENT_AUDIT** | 四层 JSON | PASS / PASS_WITH_WARNING / FAIL | 已实现 `validate` |
| A6 | **DC_REGISTER** | completion AR `digital_collectible_refs` | `DIGITAL_COLLECTIBLE_REGISTRY_CHxx.md` | 已实现（模板级） |
| A7 | **CHAPTER_LINK** | registry prev/next | 上一章 `next_chapter` 更新 | 已实现 |
| A8 | **FINAL_AUDIT** | 五层（含 DC） | 含 DC 的终审报告 | 已实现 |
| A9 | **FREEZE_PREP** | 终审 PASS | `CHxx_FINAL_FREEZE_REPORT.md` | 部分实现 |

**全自动边界：** A1–A3 · A5–A9（只读/模板写入）  
**非全自动：** A4 Fill（需 Canon 方向与 manifest 语义）

---

## §3 人工步骤

| # | 步骤 | 责任人 | 原因 | 不可自动化 |
|---|------|--------|------|:----------:|
| H1 | **起草 / 冻结 Content Canon** | 内容负责人 | 七问方向 · Lore 边界 · 不填 Gap | ✓ |
| H2 | **Manifest 语义确认** | 内容 + 工程 | 节点题名 · 觉察语 · 不发明 Canon 外语义 | ✓ |
| H3 | **Fill 质量目检**（可选） | 内容负责人 | 博物馆气质 · L3 copy 克制 | 建议保留 |
| H4 | **Audit FAIL 裁决** | 内容 + 工程 | 修复 vs 回退 Canon | ✓ |
| H5 | **Freeze 裁决** | 发布负责人 | `CHxx_READY` · 是否打 tag / commit | ✓ |
| H6 | **Git baseline** | 发布负责人 | 仓库策略 · 不自动 force push | ✓ |
| H7 | **CH04+ 启动** | 总协调 | 确认 CH03 冻结后再扩展 | ✓ |

---

## §4 Cursor 职责

| 职责 | 做 | 不做 |
|------|----|------|
| **内容审查** | Placeholder / Content Audit · 跨层引用 · Canon 对齐 | 修改 L0 Canon |
| **Fill 执行** | 按 CH01 工厂生成 CHxx 四层 JSON | 发明新神明 / 文明 / 组织 |
| **报告** | `*_CREATE_REPORT.md` · `*_AUDIT_*` | 替代 Governance 规则制定 |
| **冻结前审查** | Final Audit · Freeze Prep 文档 | 自动 git commit |
| **Autopilot 演进** | 架构 / 脚本 / workflow 设计 | 跳过 Audit 直接扩展 |

**Cursor 在流水线中的位置：**

```text
H1 Canon ──▶ [Cursor] A2 Placeholder ──▶ [Cursor/Script] A3 Audit
         ──▶ [Cursor] A4 Fill ──▶ [Cursor/Script] A5 Audit
         ──▶ [Script] A6–A9 ──▶ H5 Freeze 裁决
```

---

## §5 OMX 职责

| 检查项 | 脚本 / 入口 | Gate |
|--------|-------------|------|
| 术语违例 | `scripts/omx/run_omx_checks.js` | 打卡/成就/升级/抽卡/归真/回应/祝由 |
| Canon 引用 | `scripts/omx/check-canon.js` | 不覆盖 L0 |
| JSON 合法性 | `scripts/omx/check-json.js` | schema 可读 |
| 路由 / IA | `scripts/omx/check-routes.js` | Tab 结构不变 |

**OMX 原则（来自 Strategy Memo）：** 发现问题 **先报告 · 不自动修复**。  
**在 Autopilot 中的挂载点：** A5 Content Audit **之后**、A8 Final Audit **之前**（或与 Final Audit 并行）。

---

## §6 Governance 职责

| 检查项 | 脚本 | 范围 |
|--------|------|------|
| 资产边界 | `scripts/governance/check_content_engine.js` | Relic ≠ DC · Rights L1 隔离 |
| Content Engine 字段 | `governance/content_engine_rules.yaml` | 受治理字段 |
| Canon Gap | `docs/canon/CANON_GAP_REGISTRY.md` | UNDECLARED / FORBIDDEN |

**Governance 原则：** `report_only` 模式下 WARN 允许；FAIL 阻断下游 Link / Freeze。  
**挂载点：** 每次 Audit 阶段后 · 与 OMX 并列。

---

## §7 Ductor 职责

| 职责 | 说明 |
|------|------|
| **编排** | `ductor/workflows/chapter_content_autopilot.yaml` 定义阶段顺序 |
| **调度** | `scripts/ductor/run_chapter_autopilot.js` 调用 Python runner |
| **门禁** | FAIL → 停止 · WARN → 记录并继续（可配置） |
| **报告聚合** | 合并 Console + `LOVEQIGU_AUTOPILOT_V1_REPORT.md` |
| **不做** | 修改世界观 · 修改治理规则 · 代替 H1/H5 |

**Ductor 与 Content Engine Pipeline 关系：**

```text
Chapter Autopilot（CHxx L2 JSON）
        ∥ 独立
Content Engine Pipeline（YAML 库 · OMX · Governance）
        ↓
Release / Baseline（人工 G-FREEZE）
```

---

## §8 暂停点（Human Gates）

| ID | 名称 | 触发条件 | 动作 | 当前 CH03 状态 |
|----|------|----------|------|----------------|
| **P0** | G-CANON | 无 `CHxx_CONTENT_CANON_V1.md` | **STOP** | CH03 Canon ✓ |
| **P1** | G-PLACEHOLDER-AUDIT-FAIL | 壳 audit fail | **STOP** | 未独立跑 |
| **P2** | G-FILL | 无 manifest / 占位未升 active | **STOP** | Fill ✓ |
| **P3** | G-CONTENT-AUDIT-FAIL | content audit FAIL | **STOP** | 待 Final Audit |
| **P4** | G-OMX-FAIL | OMX failed > 0 | **STOP** | 待挂接 |
| **P5** | G-GOV-FAIL | Governance FAIL | **STOP** | 待挂接 |
| **P6** | G-LINK-CONFIRM | 修改上一章 `next_chapter` | **PAUSE**（可选自动） | CH02→CH03 **未接线** |
| **P7** | G-FREEZE | Freeze Prep 完成 | **PAUSE** | **待执行** |
| **P8** | G-BASELINE | Git commit / tag | **STOP** | 未执行 |

> **Autopilot V1 设计原则：** 仅 P0 · P2 · P3 · P7 · P8 **必须** 通知用户；其余可静默写报告。

---

## §9 自动化成熟度等级

引用 [`LOVEQIGU_AUTOMATION_STRATEGY_MEMO.md`](../beiwang/LOVEQIGU_AUTOMATION_STRATEGY_MEMO.md) 六级模型：

| Level | 名称 | 状态 |
|-------|------|------|
| 0 | 纯人工 | 已超越 |
| 1 | Codex 可生成 | 已超越 |
| 2 | + Governance | 已接入（report_only） |
| 3 | + Cursor 审查 | **CH01–CH03 已验证** |
| 4 | + OMX | 已接入 · 未纳入 Chapter Autopilot 门禁 |
| 5 | + Ductor 编排 | **当前位置** · runner + workflow 已建 |
| 6 | 全自动闭环 | **未达成** |

### 9.1 当前判定：**Level 5（偏早期）**

依据：

- ✓ Cursor 审查 + Fill 已跑通 CH01–CH03  
- ✓ Ductor workflow + Python runner 存在  
- ✓ Governance / OMX 在 Content Engine 管线可用  
- ✗ Chapter Autopilot 未闭环 OMX/Governance gate  
- ✗ Fill 仍依赖 Agent manifest，非确定性模板  
- ✗ CH03 未 Freeze · CH02→CH03 未 Link  
- ✗ 无自动 baseline commit  

---

## §10 从 Level 5 升级到 Level 6 路线

### 10.1 Level 6 定义（目标态）

> **新章 Canon 冻结后，Autopilot 在无 Lore 裁决前提下，自动完成 Placeholder → Fill → 双 Audit → DC → Link → Freeze Prep；仅 Freeze Commit 与 Canon 起草需人工确认；失败自动回滚报告并暂停。**

### 10.2 分阶段路线

| 阶段 | 目标 | 关键交付 | 依赖 |
|------|------|----------|------|
| **L5→L5.5** | 闭环 CH03 | CH02→CH03 Link · CH03 Final Audit · CH03 Freeze | 人工触发 Autopilot run |
| **L5.5→L5.8** | 双 Audit 独立化 | `audit --mode placeholder` · `audit --mode content` | 扩展 runner |
| **L5.8→L5.9** | 门禁统一 | OMX + Governance 接入 chapter pipeline · FAIL 阻断 | ductor yaml |
| **L5.9→L6.0** | 确定性 Fill | `automation/chapters/CHxx.manifest.yaml` 驱动模板填充 | Canon 七问字段映射 |
| **L6.0** | 闭环 | _registry 驱动新章 · 失败自动 STOP · 报告聚合 | G-CANON / G-FREEZE 保留 |

### 10.3 Level 6 仍保留的人工步骤

| 步骤 | 原因 |
|------|------|
| Content Canon 起草 | Lore 方向不可算法化 |
| Freeze Git 裁决 | 发布责任 |
| FAIL 语义修复 | 需内容判断 |
| CH04+ 启动审批 | Strategy Memo：审查 > 扩展 |

### 10.4 Level 6 禁止项（继承 AGENTS.md）

- 自动修改 L0 Canon  
- 自动填补 Canon Gap  
- 自动创建 CH04+ 无 Canon  
- Relic / DC 混库  
- 自动 force push  

---

## §11 组件映射表

| 阶段 | Cursor | OMX | Governance | Ductor | Script |
|------|:------:|:---:|:----------:|:------:|--------|
| Canon | 起草 | — | Gap 查阅 | — | — |
| Placeholder | 可选 | JSON | 边界 | 编排 | `placeholder` |
| Audit (壳) | 审查 | JSON | 边界 | gate | `validate --mode placeholder` |
| Fill | **执行** | 术语 | 资产 | 编排 | manifest |
| Audit (内容) | 审查 | **术语** | **资产** | gate | `validate` |
| DC Register | 模板 | — | DC 边界 | 编排 | `register_dc` |
| Link | 可选 | — | — | 编排 | `link_previous` |
| Freeze | 报告 | 全量 | 全量 | 聚合 | `freeze_prep` |

---

## §12 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-06-08 | 首版架构：九段流水线 · 角色分工 · L5→L6 路线 |

---

## 关联文档

| 文档 | 关系 |
|------|------|
| [`LOVEQIGU_AUTOPILOT_V1.md`](LOVEQIGU_AUTOPILOT_V1.md) | 运行规范 |
| [`LOVEQIGU_AUTOPILOT_V1_REPORT.md`](LOVEQIGU_AUTOPILOT_V1_REPORT.md) | 实施报告 |
| [`CH02_FINAL_FREEZE_REPORT.md`](../content/CH02_FINAL_FREEZE_REPORT.md) | CH02 冻结 exemplar |
| [`CH03_CONTENT_FILL_CREATE_REPORT.md`](../content/CH03_CONTENT_FILL_CREATE_REPORT.md) | CH03 当前进度 |

---

`LOVEQIGU_AUTOPILOT_V1_ARCHITECTURE_COMPLETE = YES`
