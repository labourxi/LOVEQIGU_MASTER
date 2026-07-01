# QA SCORING SYSTEM AUDIT REPORT V1

> **审计日期**: 2026-07-01 15:28
> **审计目标**: 确认 `aiqigu_landing_v1.jpg`（即梦 API 生成）是否经过内部评分机制筛选
> **审计范围**: QA 评分管线完整性与执行历史追溯
> **审计模式**: 只读追溯 / 无修改

---

## 1. 结论

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  生成的图片 aiqigu_landing_v1.jpg 未经过 QA 评分机制筛选        ║
║                                                                  ║
║  QA SCORING:     NOT EXECUTED on the generated image            ║
║  STEP 3 状态:    跳过                                             ║
║  STEP 4 状态:    预批（生成前已标记 APPROVED）                    ║
║  评分引擎存在:   是（qa_scoring_engine.js）                       ║
║  评分引擎被调用: 否                                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 2. 管线步骤执行状态

| 步骤 | 名称 | 执行引擎 | 状态 | 实际执行时间 |
|------|------|---------|------|------------|
| 0 | STRUCTURE DESIGN | GPT | ✅ 完成 | 2026-07-01 14:12 |
| 1 | STRUCTURE APPROVAL | HUMAN | ✅ 完成 | 2026-07-01 14:12 |
| 2 | FULL PAGE VISUAL | AI IMAGE SYSTEM | ✅ 完成 | 2026-07-01 15:19 (Seedream Ark, HTTP 200, 44.7s) |
| **3** | **VISUAL QA** | **AUTO** | **❌ 跳过** | **未执行** |
| **4** | **FINAL HUMAN APPROVAL** | **HUMAN** | **❌ 预批** | **2026-07-01 14:32（生成前已写入 spec）** |
| 5 | VISUAL DECOMPOSITION | CURSOR | ❌ 未执行 | — |
| 6 | ASSET PRODUCTION | CURSOR + AI | ❌ 未执行 | — |
| 7 | RUNTIME RECONSTRUCTION | CURSOR | ❌ 未执行 | — |

---

## 3. 根因分析

### 3.1 门禁步序错乱

管线 V3 定义的正确顺序：

```
STEP 2 (生成) → STEP 3 (QA评分) → STEP 4 (人工审批)
```

实际执行顺序：

```
STEP 4 (预批) → STEP 2 (生成) → （跳过 STEP 3）
```

**证据**: `assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json`

```json
"approval": {
    "step": 4,
    "status": "APPROVED",
    "date": "2026-07-01 14:32",
    "engine": "HUMAN",
    "gate": "UNLOCKED — proceed to STEP 5 after generation"
}
```

该 approval 记录在生成脚本执行**之前**就已存在。STEP 4 的门禁在生成发生前就被解锁了。

### 3.2 QA 引擎存在但未被调用

| 文件 | 路径 | 状态 |
|------|------|------|
| QA 评分引擎 | `apps/miniapp/core/visual-pipeline/qa_scoring_engine.js` | ✅ 文件存在 |
| 生成脚本 #1 | `scripts/generate_landing_v1.py` | ❌ 未引用 QA |
| 生成脚本 #2 | `scripts/generate_landing_v1_v2.py` | ❌ 未引用 QA |
| 生成脚本 #3 | `scripts/landing_v1_real_generation.py` | ❌ 仅含 JPEG "quality=95" 参数，非评分调用 |

三个生成脚本均未加载或调用 `qa_scoring_engine.js`。QA 引擎处于**存在但孤立**状态。

### 3.3 唯一一次 QA 执行并非针对图片

之前管线 Bootstrap 阶段执行了一次 QA 评分，记录在 `docs/production/TASK_REPORT_VISUAL_PIPELINE_BOOTSTRAP_V1.md` 中：

| 维度 | 评分对象 | 得分 |
|------|---------|------|
| Style completeness | STRUCTURE_SPEC 文档 | 1.00 |
| Layout fidelity | STRUCTURE_SPEC 文档 | 1.00 |
| Spec coherence | STRUCTURE_SPEC 文档 | 1.00 |
| Render constraints | STRUCTURE_SPEC 文档 | 1.00 |
| **最终分** | **文档规格** | **1.00/1.00** |

> 该 QA 是对 **文本规格** 的评分，不是对生成的图片的评分。

---

## 4. 评分机制的结构性问题

### 4.1 QA 引擎与生成管线无集成

```
┌──────────────────────┐     ┌──────────────────────┐
│  qa_scoring_engine   │     │  Generation Scripts  │
│  (core/visual-       │     │  (scripts/*.py)      │
│   pipeline/)         │     │                      │
│                      │     │  只做: HTTP调用      │
│  JavaScript 模块     │     │       下载           │
│  可评估 4 个维度     │     │       裁剪           │
│  有权重重计算        │     │       保存           │
│  有阈值检查 (0.7)    │     │       注册           │
│                      │     │                      │
│  未被任何脚本导入    │     │  不做: 评分           │
│                      │     │       质量检查        │
└──────────────────────┘     └──────────────────────┘
        孤立                              独立运行
```

### 4.2 STEP 4 预批绕过门禁

`landing_v1_generation_spec.json` 中记录的状态显示 "HUMAN APPROVED"，但该 approval 是：
- 在 Cursor Agent 的一次对话中通过 `AskQuestion` UI 收集的
- 写入 spec JSON 时图片尚未生成
- 没有对最终图片的可视化审查机制

### 4.3 无评分反馈循环

V3 管线要求 "If score < threshold → regenerate asset. Loop max 3 times"。当前：
- 无评分 → 无法触发再生循环
- 生成→注册是单向的，不存在反馈回路
- 图片质量无法通过系统自身检测

---

## 5. 全部生成脚本调用追溯

| 调用序号 | 脚本 | 时间 | API | 结果 | 是否调用 QA |
|---------|------|------|-----|------|-----------|
| 1 | `visual_generation_bridge_v1.py` | 15:12 | OpenAI + Gemini | ❌ 两者均失败 | ❌ |
| 2 | `generate_landing_v1.py` | 15:12 | Seedream Ark | ⚠️ 生成但路径错误 | ❌ |
| 3 | `generate_landing_v1_v2.py` | 15:13 | Seedream Ark | ✅ 生成到正确路径（`landing_v1_final.png`) | ❌ |
| 4 | `landing_v1_real_generation.py` | 15:19 | Seedream Ark | ✅ 最终生成（`aiqigu_landing_v1.jpg`, 226KB) | ❌ |

**4 次调用中，0 次执行了 QA 评分。**

---

## 6. 评分引擎能力（已验证）

`apps/miniapp/core/visual-pipeline/qa_scoring_engine.js` 具备：

- **4 维评分**：style_consistency (0.35) + clarity (0.25) + ui_fit (0.25) + completeness (0.15)
- **加权总分计算**
- **阈值检查**：默认 0.70
- **再生循环指示**：regenerationCount / regenerationNeeded
- **通过/失败判定**

但该引擎是 JavaScript 模块，而生成脚本是 Python。两者之间：
- 没有 IPC / CLI 调用桥接
- 没有共享的评分标准
- 没有相同的色彩空间参考

---

## 7. 建议（非新功能，仅基于审计发现的修复路径）

| 问题 | 影响 | 修复路径 |
|------|------|---------|
| QA 步骤跳过 | 图片未经验证进入系统 | 在生成脚本中嵌入评分调用，或生成后手动执行 QA |
| STEP 4 预批 | 门禁逻辑失效 | 将 approval 标记移到 STEP 4 实际执行时，而非提前写入 |
| JS 引擎 / Python 脚本语言隔阂 | 无法自动集成 | 将评分逻辑移植到 Python，或通过 Node.js CLI 桥接 |
| 无评分反馈循环 | 低质量图片无法被系统识别 | 评分后写回 spec，阈值不通过时标记 regeneration_needed |

---

*审计于 2026-07-01 15:28 · 审计引擎：Cursor Agent · 审计模式：只读分析 / 无修改*
