# VISUAL_PRE_FLIGHT_SYSTEM_V1

> **Visual Pre-Flight System — 视觉执行前检查系统**  
> **文件标识**：`VISUAL_PRE_FLIGHT_SYSTEM_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-30  
> **状态**：🚨 **强制冻结级规范**  
> **用途**：UI 相关任务执行前的视觉合规检查门，返回 PASS / FAIL / BLOCK  

---

# §0 PURPOSE（系统目的）

本系统作为 `GOVERNANCE_RUNTIME_ENGINE_V1` STEP 3 的**执行体**。

每次 Cursor 执行 UI 相关任务前，必须运行 Pre-Flight Check：

```text
TASK → UI-RELATED? → VISUAL_PRE_FLIGHT → PASS → EXECUTE
                                         → FAIL → REPORT
                                         → BLOCK → STOP
```

---

# §1 CHECK STRUCTURE（检查结构）

## 1.1 三大检查域

| 域 | 编号 | 名称 | 职责 |
|----|------|------|------|
| 资产 | VPF-100 | Asset Existence Check | 验证引用的视觉文件是否存在 |
| 结构 | VPF-200 | UI Structure Validation | 验证 UI 结构是否符合契约 |
| 安全 | VPF-300 | Fallback Safety Validation | 验证 fallback 机制是否安全 |

---

## 1.2 返回值

| 结果 | 含义 | 行为 |
|------|------|------|
| **PASS** | 全部检查通过 | 允许执行 |
| **FAIL** | 检查未通过，但可修复 | 输出修复清单；由 GPT 决定是否继续 |
| **BLOCK** | 检查未通过，不可绕过 | 阻断执行；必须由 GPT 指令解除 |

---

# §2 VPF-100: ASSET EXISTENCE CHECK（资产存在性检查）

## 2.1 检查目标

验证任务涉及的所有视觉资产文件**在本地文件系统中实际存在**。

## 2.2 检查范围

| 检查项 | 方法 |
|--------|------|
| 图片文件 | 使用 `Glob` 验证路径存在 |
| 注册表条目 | 确认 `/assets/asset_registry.json` 中存在对应 entry |
| 资产映射 | 确认 `ASSET_MAP` 或 `getAssetMap()` 中存在对应 key |

## 2.3 判定标准

```text
PASS  = 所有引用的资产文件都存在 + 已注册
FAIL  = 部分资产不存在（输出缺失清单）
BLOCK = 所有资产都不存在 + 且任务为"视觉优化"
```

## 2.4 输出格式

```json
{
  "check": "VPF-100",
  "status": "PASS | FAIL | BLOCK",
  "assets_checked": 5,
  "assets_found": 3,
  "assets_missing": [
    { "asset_id": "aigugu_landing_bg", "path": "/images/scene/aiqigu_landing_v1.jpg" },
    { "asset_id": "fallback", "path": "/images/fallback.jpg" }
  ],
  "registry_status": "MISSING | PARTIAL | COMPLETE",
  "verdict": "human-readable summary"
}
```

---

## 2.5 可接受的缺失原因

| 原因 | 是否可接受 |
|------|-----------|
| 设计团队未交付 | ⚠️ FAIL（需标注为 P0 阻塞） |
| 路径迁移中 | ⚠️ FAIL（需标注 pending migration） |
| 占位文件（placeholder） | ✔ PASS（需确认占位文件存在） |
| 开发阶段临时缺失 | ❌ BLOCK（验收阶段不允许） |

---

# §3 VPF-200: UI STRUCTURE VALIDATION（UI 结构验证）

## 3.1 检查目标

验证 UI 结构是否符合 `VISUAL_ASSET_CONTRACT_V1` 的约束：

- 没有直接写死的图片路径
- 所有图片引用通过 `ASSET_MAP` 或 `data` 绑定
- WXML 中没有未注册的资产引用

## 3.2 检查范围

| 检查项 | 方法 | 阻断条件 |
|--------|------|---------|
| 硬编码路径 | 搜索 `/assets/` 或 `/images/` 或 `/static/` 在 WXML 中 | 任何直接路径 |
| 未绑定引用 | 搜索 WXML 中 `src="..."` 非 `{{}}` 表达式 | 任何硬编码 |
| 组件隔离 | 确认图片引用只出现在 JS 层（`assetMap`），不在 WXML 层 | 违规引用 |
| Portal/CSS 替代 | 确认 CSS 已实现的视觉无需额外图片 | 不适用时忽略 |

## 3.3 判定标准

```text
PASS  = 无硬编码路径 + 所有引用通过绑定
FAIL  = 存在硬编码路径（列出所有需要修复的文件）
BLOCK = 多个文件存在硬编码路径 + 任务未提供清理方案
```

---

## 3.4 Landing Page 专项检查

Landing Page (`pages/landing/index.wxml`) 必须满足：

| 元素 | 必须通过 | 禁止 |
|------|---------|------|
| 背景 `<image>` | `src="{{bgImage}}"` | `src="/images/xxx.jpg"` |
| CSS 场景 | `style="background-image: url({{bgImage}});"` | `background-image: url('/images/xxx.jpg')` |
| 节点卡片 | 无 `<image>` | 未注册图片 |
| 登录按钮 | CSS-only 或 `assetMap` 引用 | 图片硬编码 |

---

# §4 VPF-300: FALLBACK SAFETY VALIDATION（Fallback 安全性验证）

## 4.1 检查目标

验证 fallback 机制符合 `AI_COLLABORATION_GOVERNANCE_V1 §1.1`：

- fallback 不是默认渲染策略
- fallback 有终止条件（不会无限循环）
- fallback 本身不会失败（零文件依赖）

## 4.2 检查范围

| 检查项 | 方法 | 通过条件 |
|--------|------|---------|
| Fallback 链终止 | 搜索 `_fallbackAttempted` 或等效守卫 | 存在终止条件 |
| 无限循环保护 | 搜索 setData → binderror → onImgError 循环 | 有循环中断逻辑 |
| 最终 fallback 安全性 | 确认最终 fallback 为 CSS gradient（零文件依赖） | 不是图片路径 |
| Fallback 作为默认 | 检查 init `data` 中是否使用 fallback 路径作为 primary | primary 必须是真实图片路径 |

## 4.3 判定标准

```text
PASS  = 符合全部通过条件
FAIL  = 缺少循环保护或最终 fallback 不安全（可修复）
BLOCK = fallback 作为默认策略 + 无任何终止条件
```

---

## 4.4 最终 fallback 安全要求

| Fallback 类型 | 安全性 | 是否允许 |
|---------------|--------|---------|
| CSS gradient | ✅ 零文件依赖 | ✔ 允许 |
| 本地 placeholder 图片 | ⚠️ 依赖文件存在 | ✔ 允许（文件需存在） |
| 网络图片 URL | ❌ 依赖网络 | ❌ 不允许 |
| 空字符串 | ⚠️ 可能造成空白 | ❌ 不允许（必须有视觉表达） |

---

# §5 EXECUTION OUTPUT（执行输出）

## 5.1 完整 Pre-Flight 输出

每次执行后必须输出：

```text
[VISUAL PRE-FLIGHT] === CHECK RESULT ===
  overall: PASS | FAIL | BLOCK
  VPF-100 (asset existence):     PASS | FAIL | BLOCK
  VPF-200 (ui structure):        PASS | FAIL | BLOCK
  VPF-300 (fallback safety):     PASS | FAIL | BLOCK
  missing_assets: [list]
  hardcoded_paths: [list]
  fallback_issues: [list]
  verdict: <one line>
```

---

## 5.2 Pre-Flight 与 Governance Engine 的关系

```text
GOVERNANCE_RUNTIME_ENGINE
  └── STEP 3: UI RENDER GATE
        └── calls → VISUAL_PRE_FLIGHT_SYSTEM
                      ├── VPF-100
                      ├── VPF-200
                      └── VPF-300
```

Pre-Flight 返回 `PASS` 时，STEP 3 继续。
Pre-Flight 返回 `FAIL` 时，STEP 3 输出修复清单并暂停。
Pre-Flight 返回 `BLOCK` 时，STEP 3 触发 `GB-001` 阻断。

---

# §6 COMPLIANCE REQUIREMENTS（合规要求）

## 6.1 与 VISUAL_ASSET_CONTRACT_V1 的对齐

| 条款 | 本系统中的实现 |
|------|---------------|
| §2 资产目录结构 | VPF-100 路径验证 |
| §3 Asset Registry | VPF-100 注册检查 |
| §4 禁止未注册资源 | VPF-200 |
| §12 Cursor 执行规则 | 完整 Pre-Flight 流程 |

## 6.2 与 AI_COLLABORATION_GOVERNANCE_V1 的对齐

| 条款 | 本系统中的实现 |
|------|---------------|
| §1.1 视觉资产前置 | VPF-100 + VPF-300 |
| §5 Visual First Principle | VPF-200 |
| §2.2 Cursor 执行权 | Pre-Flight 输出作为执行上下文 |

---

# ❄️ 冻结声明

STATUS: FROZEN
VERSION: V1
DATE: 2026-06-30
OWNER: LOVEQIGU
PARENT: AI_COLLABORATION_GOVERNANCE_V1
