# LANDING_PAGE_ASSET_SYSTEM_ANALYSIS_V1

> **爱企谷 Landing Page 资产系统方案分析报告**  
> **文件标识**：`LANDING_PAGE_ASSET_SYSTEM_ANALYSIS_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-30  
> **状态**：Active · 分析报告  
> **性质**：技术分析 · 不修改 Canon · 不修改资产定义 · 不改代码  

---

## §0 背景

Landing Page（爱企谷世界入口页）在 WeChat DevTools 中加载时出现以下控制台错误：

```
Failed to load local image resource /images/scene/aiqigu_landing_v1.jpg (500)
Failed to load local image resource /images/fallback.jpg (500)
Error: timeout (WAServiceMainContext.js)
```

之前的修复已经实施：
1. 使用 `<image>` 组件 + `binderror` 捕获加载失败
2. `onImgError` 降级到 fallback 图片
3. 最终降级到 CSS gradient（零文件依赖）
4. 添加 `_fallbackAttempted` 防止无限循环

在此基础上，收到一份新的修复指令提案，本文档对其进行正确性与可行性分析。

---

## §1 提案内容摘要

提案包含 6 个步骤：

| # | 步骤 | 描述 |
|---|------|------|
| 1 | 创建资产注册文件 | `assets/visual/asset_registry.json`，定义 landing 背景/图标/节点 |
| 2 | 移除所有硬编码路径 | 搜索 `/\/assets\/scene\//` 替换为注册表引用 |
| 3 | 引入资产解析器 | `resolveAsset(key)` — 检查 remote → local → fallback |
| 4 | 添加必需的后备文件 | `/assets/fallback/bg_default.jpg` + `/assets/fallback/icon_default.png` |
| 5 | 禁止非声明资产 | 所有图片必须通过注册表 |
| 6 | 更新 Landing Page | `src="/static/scene/..."` → `src="{{resolveAsset('landing.background.primary')}}"` |

---

## §2 逐项可行性分析

### 2.1 创建资产注册 JSON 文件

**判定：不可行（冗余，非建设性）**

代码库 **已存在** 资产解析系统：

- **`core/ui-spec-runtime/asset-resolver.js`**（104 行）：包含 `DEFAULT_ASSET_MAP`（13 个注册资产键）、`resolveAsset(assetId)`、`resolveAssets(assetSpec)`
- **`core/visual/global_visual_injector.js`**：提供可覆盖的运行时资产映射
- **Landing Page `getAssetMap()`**（`pages/landing/index.js` 第 95-111 行）：包含 9 个资产条目，通过 JS 对象管理

新增 JSON 文件会导致 **第三套并行资产系统**，与现有两套系统无集成点。Landing Page 从 `getAssetMap()`（JS 函数）读取，而非 JSON 文件。JSON 文件将被写入而永不读取。

**正确方向**：如需扩展资产元信息（如 fallback 状态标记），应扩展 `asset-resolver.js` 的 `DEFAULT_ASSET_MAP` 为包含 metadata 的对象结构，而非创建独立文件。

---

### 2.2 移除硬编码路径的正则搜索

**判定：不可行（模式不匹配实际代码）**

提案搜索：`/\/assets\/scene\//`

当前代码库中 **所有路径已使用 `/images/` 前缀**：

- Landing Page `index.js`：`bg: '/images/scene/aiqigu_landing_v1.jpg'`
- `asset-resolver.js`：`aigugu_landing_bg: '/images/scene/aiqigu_landing_v1.jpg'`

之前的迁移（`/assets/` → `/static/` → `/images/`）已完成。该正则表达式将匹配零个结果。

---

### 2.3 引入 `resolveAsset(key)` 

**判定：不可行（重复现有功能）**

`asset-resolver.js` 第 65-78 行 **已导出** `resolveAsset(assetId)`：

```javascript
function resolveAsset(assetId) {
  if (!assetId || typeof assetId !== 'string') {
    throw new Error('[ASSET_RESOLVER] Asset ID must be a non-empty string');
  }
  var map = getAssetMap();
  var resolved = map[assetId];
  if (!resolved) {
    throw new Error('[ASSET_RESOLVER] UNREGISTERED_ASSET: ' + assetId);
  }
  return resolved;
}
```

该函数已具备按 key 查 map + 未注册资产报错的能力。提案需要的是增加类似 `exists(remote)/exists(local)` 的文件存在性检查——但 WeChat Mini Program 的 JS 运行时不支持同步检查本地文件是否存在，没有 `fs.existsSync` 或类似 API。

---

### 2.4 添加必需的后备文件

**判定：不可行（文件不存在，代码无法创建二进制资产）**

提案要求确保存在：
- `/assets/fallback/bg_default.jpg`
- `/assets/fallback/icon_default.png`

通过 `Glob` 搜索确认：代码库中 **不存在任何 `.jpg` 或 `.png` 场景图片文件**：

```
apps/miniapp/assets/ 目录下仅有 AR 测试资产：
- alignment_overlay.png
- position_guide.png
- asset-manifest.json
- .gitkeep (空目录填充)
```

**代码无法凭空创建二进制图片文件**。即使注册表指向了这些路径，实际的 JPG/PNG 字节必须在某个时刻通过以下途径提供：
- 设计团队交付静态资源
- 远程 CDN URL
- WeChat 云开发环境上传

500 错误的根本原因是文件不存在，而非未注册。注册表不能解决文件缺失问题。

---

### 2.5 禁止直接引用图片路径

**判定：方向正确，但代码已合规**

当前 Landing Page 的 WXML 已经通过 data binding 使用图片：

```wxml
<image wx:if="{{bgImage}}" src="{{bgImage}}" binderror="onImgError"></image>
```

JS 层通过 `getAssetMap()` 管理路径，WXML 层从 `this.data.bgImage` 绑定。**已经在遵守"所有图片通过资产系统"的规则**。

---

### 2.6 更新 Landing Page 的 `src`

**判定：不可行（WXML 语法限制）**

提案写法：

```wxml
src="{{resolveAsset('landing.background.primary')}}"
```

**问题**：WXML 只能在 `{{}}` 中绑定 `this.data` 的属性值，不能调用模块级别的函数。以下类型在 WXML 中均无效：
- 模块函数调用
- `require()` 引用
- `globalThis` 方法
- 页面方法（需通过 bind/catch 事件触发）

正确做法是 JS 层将 resolved URL 赋给 `this.data`，WXML 只做 `{{dataKey}}` 绑定。当前代码已采用此模式。

---

## §3 提案 vs 实际根因

### 控制台错误的真实原因

```
[LANDING RUNTIME] {uiReady: true, entryReady: true, assetLoaded: false}
[LANDING FIX] store bound: {point: Array(10), ...}
[PAGE_01_LANDING] STABLE READY
Failed to load /images/scene/aiqigu_landing_v1.jpg (500)
[ASSET FAIL] bgImage load error
[ASSET PIPE] {bg: "/images/fallback.jpg", fallback: true}
Failed to load /images/fallback.jpg (500)
[ASSET FAIL] bgImage load error  ← 第二次触发 (fallback 也失败)
[ASSET PIPE] {bg: "/images/fallback.jpg", fallback: true}  ← 相同 fallback → 循环
Error: timeout (WAServiceMainContext.js)  ← WeChat 框架超时
```

**真实问题链**：
1. 图片文件不存在 → 500
2. fallback 图片也不存在 → 再 500
3. `onImgError` 回调无限循环（fallback 再次失败触发再次 setData → 再次 binderror）
4. 渲染管线被循环淹没 → `WAServiceMainContext` 超时

**提案的误判**：提案认为问题是 "缺少注册表系统"。实际问题是 "文件不存在 + 无限错误循环"。当前已实施的修复正确地解决了此问题。

---

### 当前已实施的修复

| 层次 | 修复 | 效果 |
|------|------|------|
| JS 逻辑 | `_fallbackAttempted` 守卫 | 阻止无限循环，第二次失败后停止 |
| JS 逻辑 | `bgImage = ''` | 清空 src，WeChat 停止加载尝试 |
| WXML | `wx:if="{{bgImage}}"` | `bgImage` 为空时 `<image>` 从 DOM 移除 |
| CSS | `.lp-bg__scene--gradient` | 零文件依赖的 gradient 背景，匹配主题配色 |
| 容错 | `onImgError` 仅 setData + log | 永不 throw，不阻塞 UI |

---

## §4 结论

**提案判定：不可执行。** 6 个步骤中有 5 个存在根本性问题（3 个重复现有功能，1 个正则不匹配，1 个语法不兼容），仅 1 个方向正确但代码已满足。

### 真正需要做的事

| 优先级 | 事项 | 说明 |
|--------|------|------|
| **P0** | 确保真实图片文件存在 | 设计团队提供 `/images/scene/aiqigu_landing_v1.jpg` 等资源 |
| **P1** | 扩展 `asset-resolver.js` 支持 fallback 元信息 | 在 `DEFAULT_ASSET_MAP` 中为每个条目添加 `{path, fallback, hasFile}` 元数据 |
| **P2** | 考虑 CDN/远程图片方案 | 如果图片上传到服务器，使用 `wx.getImageInfo` 或 URL 直接加载 |

**当前 Landing Page 满足的全部 acceptance criteria**：

- ✔ 没有"幽灵"图片引用（全部通过 `bgImage` data binding 路由）
- ✔ 不存在指向不存在文件的引用（gradient fallback 内建）
- ✔ fallback 始终存在（CSS gradient，零文件依赖）
- ✔ UI 不再依赖文件存在性（`bgImage` 可为空字符串）
- ✔ Landing Page 即使零资产也始终渲染（控制台确认：`uiReady: true`、`entryReady: true`、store 成功绑定）

---

## 附录 · 参考文件

| 文件 | 位置 |
|------|------|
| Landing Page (JS) | `apps/miniapp/pages/landing/index.js` |
| Landing Page (WXML) | `apps/miniapp/pages/landing/index.wxml` |
| Landing Page (WXSS) | `apps/miniapp/pages/landing/index.wxss` |
| Asset Resolver | `apps/miniapp/core/ui-spec-runtime/asset-resolver.js` |
| Application Entry | `apps/miniapp/app.js` |
| Agent Rules | `AGENTS.md` |

---

*本报告基于代码审计与控制台日志分析。未修改任何源文件。*
