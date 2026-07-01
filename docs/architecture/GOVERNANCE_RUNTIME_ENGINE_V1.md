# GOVERNANCE_RUNTIME_ENGINE_V1

> **Governance Runtime Engine — 执行时治理引擎**  
> **文件标识**：`GOVERNANCE_RUNTIME_ENGINE_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-30  
> **状态**：🚨 **强制冻结级规范**  
> **用途**：定义 Cursor 每次执行任务时的治理检查流水线与阻断规则  

---

# §0 PURPOSE（系统目的）

本引擎定义所有 Cursor 执行操作的**前置检查流水线**与**运行时阻断规则**。

每次执行必须经过：

```text
ENTRY → GOVERNANCE CHECK → STATE LOAD → UI RENDER → ASSET LOAD → FINAL READY
```

任何未通过检查的操作必须阻断。

---

# §1 EXECUTION PIPELINE（执行流水线）

## 1.1 完整流水线

```text
┌────────────────────────────────────────────────────┐
│                    TASK ENTRY                       │
│  (Task request received; no modification yet)      │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│  ⚙️  STEP 1: GOVERNANCE CHECK                      │
│  Validate against AI_COLLABORATION_GOVERNANCE_V1   │
│  Validate against VISUAL_ASSET_CONTRACT_V1         │
│  Validate against this engine                      │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│  ⚙️  STEP 2: STATE LOAD                            │
│  Read current codebase state                       │
│  Read current file structure                       │
│  Read current asset registry                       │
│  Capture baseline before any modification          │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│  ⚙️  STEP 3: UI RENDER GATE                        │
│  If task is UI-related:                            │
│    → VISUAL_PRE_FLIGHT check required              │
│    → Must have asset contract compliance           │
│    → Must have existing or registered assets       │
│  If non-UI task:                                   │
│    → Skip visual check, proceed to execution       │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│  ⚙️  STEP 4: ASSET LOAD GATE                       │
│  Verify referenced asset paths exist               │
│  Verify no fake/placeholder paths in code           │
│  Verify fallback is NOT the default strategy        │
│  Log all asset references with existence status     │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│  ⚙️  STEP 5: EXECUTION                             │
│  (Task modification occurs here)                   │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│  ⚙️  STEP 6: POST-EXECUTION VERIFICATION            │
│  Re-check governance compliance                    │
│  Verify NO new fake paths introduced               │
│  Verify NO silent patches                          │
│  Verify NO bypass of check gates                   │
│  Log execution summary                             │
└────────────────────────┬───────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────┐
│                    FINAL READY                      │
│  (Ready for GPT approval)                          │
└────────────────────────────────────────────────────┘
```

---

## 1.2 阻断条件（GATE BLOCK RULES）

任何以下条件触发时，执行**必须阻断**：

| 阻断ID | 条件 | 触发步骤 |
|--------|------|---------|
| GB-001 | 任务涉及 UI 但 VISUAL_PRE_FLIGHT 未通过 | STEP 3 |
| GB-002 | 代码中引用不存在的 image path | STEP 4 |
| GB-003 | fallback 被用作默认渲染策略（非异常路径） | STEP 4 |
| GB-004 | 缺少 asset_registry.json 注册 | STEP 4 |
| GB-005 | 任务涉及架构修改但未经 GPT 审批 | STEP 1 |
| GB-006 | 修改了冻结规范文件中声明的禁止修改区域 | STEP 6 |
| GB-007 | 检测到 silent patch（无日志、无审计的修改） | STEP 6 |
| GB-008 | 执行后引入了新的非法 asset 引用 | STEP 6 |

---

## 1.3 阻断输出规范

当阻断发生时，Cursor **必须输出**：

```json
{
  "status": "BLOCKED",
  "gate": "GB-00X",
  "reason": "human-readable explanation",
  "violated_rule": "reference to specific rule",
  "file_path": "affected file(s)",
  "line_reference": "specific line(s) if applicable"
}
```

---

# §2 ASSET BLOCKING LOGIC（资产阻断逻辑）

## 2.1 定义

Asset Blocking = 任何 UI 渲染被资产加载成功与否所阻塞的情况。

## 2.2 强制检查

| 检查项 | 方法 | 阻断条件 |
|--------|------|---------|
| 同步加载 | 搜索 `await loadImage` / `await assetReady` / `await imageReady` | 任何匹配 |
| 渲染队列阻塞 | `onLoad` 中 asset 加载在 UI render 之前执行 | 非 fire-and-forget |
| 超时阻断 | `setTimeout` 中 asset 未加载完成则 throw | 任何匹配 |
| 无限重试 | asset 失败进入无限循环且无终止条件 | `_fallbackAttempted` 或等效守卫缺失 |

## 2.3 通过条件

```text
✔ 所有 image 加载为 fire-and-forget
✔ UI render 不等待任何 image 加载
✔ 无 asset 超时 throw
✔ asset 失败有终止条件（最大重试次数）
```

---

# §3 TIMEOUT SOURCE TRACING（超时溯源）

## 3.1 定义

Timeout Source Tracing = 当运行时出现 `Error: timeout` 时，定位其来源是：

- WeChat 框架层超时（不可控）
- 应用层超时（可控）

## 3.2 应用层超时可接受类型

| 类型 | 示例 | 是否可接受 |
|------|------|-----------|
| 网络请求 | `wx.request` 超时 | ⚠️ 需 fallback |
| 设备 API | `wx.getLocation` 超时 | ⚠️ 需 fallback |
| 用户操作 | 用户无操作 | ✔ 可接受 |
| 框架渲染 | `WAServiceMainContext` 超时 | ✔ 不可控 |

## 3.3 不可接受的应用层超时

| 类型 | 阻断条件 |
|------|---------|
| 资产加载循环 | asset fail → setData → asset fail → 无限循环 |
| store 轮询超时 | `while + await` 轮询超时后无 fallback |
| 同步阻塞 | `await somePromise` 在 UI render 之前 |

## 3.4 溯源输出格式

当超时被追踪到应用层时，必须输出：

```text
[TIMEOUT TRACE]
  source: <function / module / loop>
  type: asset_polling | store_polling | render_blocking | infinite_loop
  chain: event_A → event_B → timeout
  fix: <required fix>
```

---

# §4 UI EXECUTION GATING RULES（UI 执行门控）

## 4.1 门控定义

UI 执行门控 = 是否允许对 UI 层执行修改的决策矩阵。

## 4.2 门控决策矩阵

| 前置条件 | 无图 | 有 placeholder | 有真实图 |
|----------|------|----------------|---------|
| 修复 bug | ❌ BLOCK | ✔ 允许 | ✔ 允许 |
| 新增功能 | ❌ BLOCK | ✔ 允许（标注 placeholder） | ✔ 允许 |
| UI 调整 | ❌ BLOCK | ✔ 允许（仅结构） | ✔ 允许 |
| 视觉优化 | ❌ BLOCK | ❌ BLOCK | ✔ 允许 |

## 4.3 门控豁免

仅以下情况可通过：

- **DEFERRED_VISUAL_MODE**：任务明确标注 `[DEFERRED_VISUAL]`，且只修改结构/数据层
- **PURE_BUGFIX_MODE**：任务明确标注 `[PURE_BUGFIX]`，且不影响 UI 渲染结果

---

# §5 OUTPUT REQUIREMENTS（输出规范）

## 5.1 每次执行后必须输出

```text
[GOVERNANCE ENGINE] === CHECK RESULT ===
  status: PASS | BLOCKED
  pipeline:
    step 1 (governance check): PASS | BLOCKED
    step 2 (state load):       PASS | BLOCKED
    step 3 (ui render gate):   PASS | SKIPPED | BLOCKED
    step 4 (asset load gate):  PASS | BLOCKED
    step 5 (execution):        COMPLETED | SKIPPED
    step 6 (post verification): PASS | BLOCKED
  blocks: [list of GB-XXX if any]
  summary: <one line>
```

---

# §6 COMPLIANCE REQUIREMENTS（合规要求）

## 6.1 与 AI_COLLABORATION_GOVERNANCE_V1 的对齐

| 条款 | 本引擎中的实现 |
|------|---------------|
| §1.1 视觉资产前置原则 | STEP 3 + STEP 4 |
| §2.2 Cursor 的驳回权 | §1.2 阻断条件 |
| §3 冲突对齐机制 | 阻断 → 输出冲突包 |
| §4 修复归档 | STEP 6 + 执行摘要 |
| §5 Visual First | 门控决策矩阵 |

---

## 6.2 与 VISUAL_ASSET_CONTRACT_V1 的对齐

| 条款 | 本引擎中的实现 |
|------|---------------|
| §2 资产目录结构 | STEP 4 路径验证 |
| §3 Asset Registry | STEP 4 注册检查 |
| §4 禁止未注册资源 | GB-004 |
| §12 Cursor 执行规则 | 完整流水线 |

---

# ❄️ 冻结声明

STATUS: FROZEN
VERSION: V1
DATE: 2026-06-30
OWNER: LOVEQIGU
PARENT: AI_COLLABORATION_GOVERNANCE_V1
