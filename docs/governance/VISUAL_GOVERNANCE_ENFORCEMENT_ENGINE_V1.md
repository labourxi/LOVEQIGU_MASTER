# AR游伴视觉治理执行引擎 V1 — FROZEN

> **版本**: V1
> **冻结日期**: 2026-07-01
> **状态**: FROZEN
> **文件标识**: VISUAL_GOVERNANCE_ENFORCEMENT_ENGINE_V1
> **系统定位**: Cursor 唯一视觉审查与拦截执行引擎

---

# 🚨 1. 系统定位

本文件是：

> 🧱 **Cursor唯一视觉审查与拦截执行引擎**

用于所有：

- UI设计
- Landing Page生成
- Scene Page生成
- 生图Prompt
- Gemini / 豆包输出结果
- 视觉重构任务

---

# 🧭 2. 强制执行规则（核心）

Cursor在执行任何视觉任务前必须：

## STEP 1：识别任务类型

```txt id="classify"
IF task involves:
- UI / UX
- 页面设计
- 视觉生成
- landing page
- scene page
- AR视觉
THEN → MUST RUN VISUAL ENGINE
```

---

## STEP 2：加载三层规范

必须加载：

- **L0**（入口层）— `AR_VISUAL_LAYER_SYSTEM_V4_FROZEN.md §1`
- **L1**（现实增强层）— `AR_VISUAL_LAYER_SYSTEM_V4_FROZEN.md §2`
- **L2**（世界沉浸层）— `AR_VISUAL_LAYER_SYSTEM_V4_FROZEN.md §3-4`

---

## STEP 3：分层归属判断

```txt id="route"
IF SYSTEM ENTRY     → L0 SYSTEM
IF SCENE ENTRY      → L0 SCENE
IF UI PAGE          → L1
IF AR / WORLD       → L2
```

---

# 🚨 3. 自动拦截规则（关键）

## ❌ 禁止输出（直接FAIL）

### L0层违规：

- ❌ UI缺失关键功能入口
- ❌ 登录弱化
- ❌ AR按钮丢失
- ❌ 信息结构不完整

---

### L1层违规：

- ❌ 过度幻想化（星空/神域占主导）
- ❌ UI不可读
- ❌ 游戏化过强
- ❌ 现实感丢失

---

### L2层违规：

- ❌ UI产品化过重
- ❌ 卡片式信息结构
- ❌ 导航系统残留明显
- ❌ 未进入沉浸模式

---

# 🧠 4. 评分系统（强制）

每次输出必须评分：

```txt id="score"
STRUCTURE SCORE (0-100)
VISUAL CONSISTENCY SCORE (0-100)
LAYER COMPLIANCE SCORE (0-100)

PASS CONDITION:
ALL ≥ 80
```

---

# 🚨 5. 拦截机制（核心）

## ❌ 触发FAIL时必须执行：

```txt id="fail"
STOP OUTPUT
DO NOT GENERATE FINAL RESULT

REQUIRE:
- identify violated layer
- list conflict reasons
- suggest correction plan
```

---

# 🧭 6. 修复流程（强制闭环）

```txt id="fix"
FAIL → IDENTIFY LAYER → APPLY RULE → REGENERATE
```

---

# 🧠 7. Cursor输出标准（必须遵守）

每次设计必须输出：

1. 分层归属判断（L0/L1/L2）
2. 是否通过治理规则（PASS / FAIL）
3. 违规点列表
4. 是否允许进入下一步（PASS / FAIL）

---

# 🧱 8. 系统本质

这是一个：

> 🧠 **"视觉生产前置审查系统（Pre-Render Governance Engine）"**

不是后处理，不是优化器。

---

# 🧾 9. 引用链路

```
AR_VISUAL_LAYER_SYSTEM_V4_FROZEN.md  (根视觉规范)
  └── AR_VISUAL_PRODUCTION_GOVERNANCE_V1.md  (规范调度规则)
        └── VISUAL_GOVERNANCE_ENFORCEMENT_ENGINE_V1.md  (本文件 - 执行引擎)
              └── 具体任务执行
```

---

## 冻结元信息

```
STATUS:     FROZEN
VERSION:    V1
DATE:       2026-07-01
OWNER:      LOVEQIGU
SYSTEM:     VISUAL_GOVERNANCE_ENFORCEMENT_ENGINE_V1
TYPE:       Pre-Render Governance Engine
PRIORITY:   最高 — 所有视觉任务必须先经过本引擎
```
