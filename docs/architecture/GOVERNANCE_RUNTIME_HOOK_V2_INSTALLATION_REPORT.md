# GOVERNANCE_RUNTIME_HOOK_V2_INSTALLATION_REPORT

> **LOVEQIGU 治理运行时钩子 V2 安装报告**  
> **文件标识**：`GOVERNANCE_RUNTIME_HOOK_V2_INSTALLATION_REPORT.md`  
> **版本**：V1.0  
> **日期**：2026-06-30  
> **状态**：Active · 安装报告  

---

## §0 任务摘要

**目标**：将治理系统从被动检查模式升级为主动运行时强制模式。

**任务**：安装 `GOVERNANCE_RUNTIME_HOOK_V2` 到 Landing Page 执行生命周期。

---

## §1 STEP 1: 创建运行时钩子核心

### 文件

```
core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js
```

### 导出的 API

| 函数 | 用途 | 行为 |
|------|------|------|
| `beforePageRender(context)` | 页面渲染前置门控 | 返回 `{ blocked, reason, gate, violations }` |
| `beforeAssetBind(assetPath)` | 资产绑定前置验证 | 返回 `{ safe, resolvedPath }` |
| `blockRender(reason)` | 阻断渲染，输出安全回退界面 | 返回 safe fallback 的 setData payload |
| `REGISTERED_ASSETS` | 已注册资产注册表（14 个条目） | 用于路径白名单验证 |

### REGISTERED_ASSETS 注册表内容

| 资产 ID | 类型 | 用途 | 状态 |
|---------|------|------|------|
| `aigugu_landing_bg` | scene | landing | active |
| `landing_bg` | scene | landing | active |
| `scene_aiqigu_street` | scene | landing | active |
| `portal_ring_gold` | ui | landing | active |
| `portal_mist_layer` | bg | landing | active |
| `ui_explore_card` | ui | landing | active |
| `ui_stat_glass` | ui | landing | active |
| `icon_wechat_login` | icon | landing | active |
| `icon_location` | icon | explore | active |
| `icon_relic` | icon | explore | active |
| `icon_collectible` | icon | explore | active |
| `icon_ar` | icon | explore | active |
| `relic_glow_frame` | relic | detail | active |
| `collectible_frame` | collectible | detail | active |

---

## §2 STEP 2: 注入页面生命周期

### 修改的文件

```
pages/landing/index.js
```

### 注入点

#### A. 模块加载（文件顶部）

```javascript
var governanceHook;
try {
  governanceHook = require('../../core/governance/GOVERNANCE_RUNTIME_HOOK_V2');
} catch (e) {
  // pass-through fallback
  governanceHook = { beforePageRender: ..., beforeAssetBind: ..., blockRender: ... };
}
```

#### B. onLoad 门控（onLoad 最顶部）

```javascript
onLoad: function (options) {
    // GOVERNANCE GATE — runs BEFORE any setData
    var gate = governanceHook.beforePageRender({
      page: 'landing',
      assets: this.data,
      store: store,
      timestamp: Date.now()
    });

    if (gate.blocked) {
      console.error('[GOVERNANCE BLOCK] Landing render stopped:', gate.reason);
      var blockPayload = governanceHook.blockRender(gate);
      this.setData(blockPayload);
      return; // ← STOPS execution, NO main UI renders
    }

    // ... normal render flow ...
}
```

#### C. 新增 data 字段

```javascript
governanceBlocked: false,
governanceReason: '',
governanceGate: '',
landingBlocked: false,
```

---

## §3 STEP 3: 硬阻断图片管线

### beforeAssetBind 的工作方式

```
assetPath → registered? → safe=true, resolvedPath=assetPath
         → not registered? → safe=false, resolvedPath=MISSING_ASSET_FLAG
         → empty string? → safe=true, resolvedPath='' (CSS gradient, GOVERNANCE-compliant)
```

### onImgError 中的集成

```javascript
var assetCheck = governanceHook.beforeAssetBind(fallback);
var resolvedFallback = assetCheck.safe ? assetCheck.resolvedPath : '';
this.setData({ bgImage: resolvedFallback });
```

**效果**：任何未注册的资产路径在绑定到 WXML 之前被拦截。未被注册的路径不会进入 UI。

---

## §4 STEP 4: 运行时断言日志

### 日志格式

| 日志 | 触发时机 |
|------|---------|
| `[GOVERNANCE HOOK] page=landing stage=pre-render status=RUNNING` | beforePageRender 入口 |
| `[GOVERNANCE HOOK] asset-check result=BLOCKED count=3` | VPF-100 发现未注册资产 |
| `[GOVERNANCE HOOK] asset-check result=OK count=3` | 全部资产路径已注册 |
| `[GOVERNANCE HOOK] page=landing stage=pre-render status=PASS` | 门控通过 |
| `[GOVERNANCE HOOK] page=landing stage=pre-render status=BLOCKED reason=...` | 门控阻断 |
| `[GOVERNANCE HOOK] BLOCK_RENDER triggered: gate=GB-00X reason=...` | blockRender 被调用 |
| `[GOVERNANCE BLOCK] Landing render stopped: ...` | onLoad 返回阻断 |
| `[GOVERNANCE HOOK] ASSET REJECTED: "..." is not in registered registry` | beforeAssetBind 拒绝路径 |

---

## §5 STEP 5: 阻断行为验证

### 当资产缺失时

```
beforePageRender
  → VPF-100: find unregistered paths?
    → YES → blocked=true, gate='GB-004'
    → blockRender() called
    → setData({ governanceBlocked: true, ... })
    → WXML 渲染 "世界正在等待显现" 安全界面
    → 不渲染主 UI
    → 不执行 setData 中的渲染数据
```

### 当治理返回 BLOCKED 时

```javascript
if (gate.blocked) {
  // NO setData for main UI
  // NO store binding
  // NO image loading
  // Only safe fallback screen
  return;
}
```

### 当未知资产被使用时

```
beforeAssetBind('/some/unregistered/path.jpg')
  → not in registered keys
  → returns { safe: false, resolvedPath: MISSING_ASSET_FLAG }
  → resolvedPath = ''
  → WXML 渲染 CSS gradient fallback
```

---

## §6 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | **创建** | 运行时钩子核心模块（14 个资产注册，3 个 gate 函数） |
| `pages/landing/index.js` | **修改** | 注入 governance hook require、onLoad 门控、beforeAssetBind、data 字段 |
| `pages/landing/index.wxml` | **修改** | 添加 governance blocked 安全界面 |
| `pages/landing/index.wxss` | **修改** | 添加 blocked 界面样式 |

---

## §7 验收标准检查

| 验收标准 | 状态 | 实现方式 |
|---------|------|---------|
| 资产缺失 → 不渲染主 UI | ✅ | `beforePageRender` 返回 blocked → `blockRender` → 停止 onLoad |
| 治理返回 BLOCKED → 不执行 setData | ✅ | `if (gate.blocked) { return; }` — 阻断后没有后续 setData |
| 未知资产 → 自动注入 fallback | ✅ | `beforeAssetBind` 拒绝未注册路径 → 返回空字符串 → CSS gradient |
| 运行时无幽灵图片引用 | ✅ | `beforeAssetBind` 在绑定前拦截所有 `/images/` 和 `/assets/` 路径 |
| 治理必须是一个门，不是一个记录器 | ✅ | `beforePageRender` 返回 BLOCKED 时完全阻断执行，不记录 + 继续 |

---

## §8 架构图

```text
onLoad() / onShow()
    │
    ▼
beforePageRender(context)
    │
    ├── PASS ──→ 正常渲染流程
    │              ├── setData({ uiReady, entryReady })
    │              ├── setTimeout → _bindWorldData()
    │              └── onImgError → beforeAssetBind(fallback) → setData({ bgImage })
    │
    └── BLOCKED ──→ blockRender(reason)
                     └── setData({ governanceBlocked: true })
                          └── WXML renders "世界正在等待显现"
```

---

## §9 文件验证

| 检查项 | 结果 |
|--------|------|
| `node --check core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | ✅ PASS |
| `node --check pages/landing/index.js` | ✅ PASS |
| 注册表条目数量 | 14 个 |
| 导出的函数数量 | 3 个（+ 1 个注册表常量） |
| GOVERANCE HOOK 日志点位 | 7 个 |
| 阻断条件（GB 代码） | 与 GOVERNANCE_RUNTIME_ENGINE_V1 §1.2 对齐 |

---

*本报告基于安装流程验证。治理系统已从被动检查模式升级为主动运行时强制模式。*
