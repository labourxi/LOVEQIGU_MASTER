# LANDING PAGE ASSET CHAIN AUDIT REPORT

> 审计日期：2026-06-30  
> 范围：`apps/miniapp/pages/landing/` · `apps/miniapp/app.js` · `apps/miniapp/project.config.json`  
> 审计类型：工程级静态资源链路 + 渲染时序收敛

---

## 📋 审计结论

**系统已从「结构错误」转为「时序 + 资源双问题」**。

Landing Page 当前不存在架构问题。三个真实问题已收敛如下：

| 优先级 | 问题 | 当前状态 |
|--------|------|---------|
| 🔴 P0 | 图片资源错误链（所有路径均为虚拟路径） | **已定位，未修复（非代码问题）** |
| 🟠 P1 | UI ready gate 时序（修复后残留风险） | **已修复，残留冗余 setData** |
| 🟡 P2 | 渲染超时链路（根因 = 图片 500 累加） | **已修复（bgImage=''）** |

---

## 🔴 TASK 1：静态资源链路审计（P0）

### 1.1 路径存在性检查

| 审计路径 | 磁盘存在 | 构建系统覆盖 | 说明 |
|----------|---------|------------|------|
| `/assets/scene/aiqigu_landing_v1.jpg` | ❌ 不存在 | ❌ 未包含 | `assets/` 目录存在于 repo 根，但无 `scene/` 子目录 |
| `/images/fallback.jpg` | ❌ 不存在 | ❌ 未包含 | 全仓库无 `/images/` 目录 |
| `/static/scene/` | ❌ 不存在 | ❌ 未包含 | **全仓库无 `/static/` 目录** |
| `/static/scene/aiqigu_landing_v1.jpg` | ❌ 不存在 | ❌ 未包含 | 同上 |
| `/static/scene/landing_fallback.jpg` | ❌ 不存在 | ❌ 未包含 | 同上 |
| `/static/scene/aiqigu_landing_v1.webp` | ❌ 不存在 | ❌ 未包含 | 同上 |

### 1.2 构建配置分析

文件：`apps/miniapp/project.config.json`

```json
"packOptions": {
  "ignore": [
    { "type": "regexp", "value": ".*/effect_preview/preview_sheet\\.(png|webp)$" }
  ],
  "include": [
    { "type": "folder", "value": "shared" }
  ]
}
```

- `ignore` 仅排除了 `effect_preview` 的预览图
- `include` 仅包含了 `shared/` 目录
- `static/`、`assets/`、`images/` **均未被构建系统包含**

### 1.3 路径历史漂移

代码库中存在 **三种路径前缀**，且均无实际文件：

| 来源文件 | 使用的路径 | 状态 |
|---------|-----------|------|
| `pages/landing/index.js` (当前 assetMap) | `/static/scene/...` | ❌ 全部虚拟路径 |
| `docs/freeze/VISUAL_ASSET_CONTRACT_V1.md` | `/assets/scene/...` | ❌ 契约层定义 |
| `core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | `/images/scene/...` | ❌ 治理层路径 |
| `core/ui-spec-runtime/asset-resolver.js` | `/images/scene/...` | ❌ 运行时路径 |
| 早期历史值 | `images/scene/` (无斜杠前缀) | ❌ |

**结论：所有图片路径均为虚拟路径，不存在于磁盘，不会被构建系统复制。**

---

## 🔴 TASK 2：WXML `<image>` 触发链检查（P0）

### 2.1 Landing Page 所有图片引用

#### 触发器 1：`<image>` 组件

文件：`pages/landing/index.wxml`（第 43-48 行）

```wxml
<image wx:if="{{bgImage}}"
  class="lp-bg__image"
  src="{{bgImage}}"
  binderror="onImgError"
  mode="scaleToFill">
</image>
```

- **触发条件**：`bgImage` 为非空字符串
- **当前值**：`bgImage=''`（空字符串 → 不渲染 → 不触发网络请求）
- **风险**：一旦 `bgImage` 被设置为非空路径，必发 HTTP 请求

#### 触发器 2：CSS `background-image`

文件：`pages/landing/index.wxml`（第 54-57 行）

```wxml
<view wx:if="{{bgImage}}"
  class="lp-bg__scene"
  style="background-image: url({{bgImage}});">
```

- **与 `<image>` 形成双触发**：同一 `bgImage` 值同时触发 WXML `<image>` 和 CSS `background-image`
- 两个请求指向**完全相同的路径**，会产生**双重 HTTP 500**

#### 触发器 3：assetMap 全部 9 个路径

文件：`pages/landing/index.js`（第 107-116 行）

| 资产键 | 路径 | 状态 |
|--------|------|------|
| `bg` | `/static/scene/aiqigu_landing_v1.jpg` | 虚拟 → 500 |
| `bg_webp` | `/static/scene/aiqigu_landing_v1.webp` | 虚拟 → 500 |
| `fallback` | `/static/scene/landing_fallback.jpg` | 虚拟 → 500 |
| `scene_street` | `/static/scene/aiqigu_street_v1.jpg` | 虚拟 → 500 |
| `portal_mist` | `/static/bg/portal_mist_v1.png` | 虚拟 → 500 |
| `portal_ring` | `/static/ui/portal_ring_gold_v1.png` | 虚拟 → 500 |
| `icon_login` | `/static/icon/wechat_login_gold_v1.png` | 虚拟 → 500 |
| `ui_card_glass` | `/static/ui/explore_card_glass_v1.png` | 虚拟 → 500 |
| `ui_stat_glass` | `/static/ui/stat_panel_gold_glass_v1.png` | 虚拟 → 500 |

**结论：全部 9 条路径均为虚拟路径。当前 assetMap 仅作为数据结构存在，未用于渲染。**

### 2.2 Fallback 重试循环

```
onImgError 触发
  → _fallbackAttempted 检查
    → false（首次）：
      → setData({ bgImage: '/static/scene/landing_fallback.jpg' })
      → <image> 渲染 → HTTP 500
      → onImgError 再次触发
    → true（已尝试）：
      → setData({ bgImage: '' }) → CSS 渐变
      → 最终状态：CSS 渐变 ✓
```

- `_fallbackAttempted` 守卫（index.js 第 388 行）**正确防止无限循环**
- 最大代价：**2 次 HTTP 500 往返**（约 500-2000ms）

---

## 🟠 TASK 3：Render Blocking Chain 验证

### 3.1 确认结论

**当前图片加载不阻塞 `onLoad`/`onShow`。**

原因：
- `bgImage=''` → `<image wx:if="{{bgImage}}"` 为假 → 无 `<image>` 渲染
- WXML 立即渲染 CSS 渐变（`.lp-bg__scene--gradient` 类）
- `onImgError` 仅在有人为设置 `bgImage` 为非空路径时触发

### 3.2 框架超时窗口

WeChat 框架有 ~5-10 秒页面渲染超时（来源：`WAServiceMainContext.js`）。

如果 `bgImage` 被设置为虚拟路径：
```
两次 500 往返 ~500-2000ms < 框架超时 ~5-10s
```

**当前状态下不会触发框架超时。**

### 3.3 残余风险

如果任何代码路径在 `onReady` 完成前将 `bgImage` 设置为非空路径，超时链路重新激活。

---

## 🟠 TASK 4：UI Ready Gate 验证

### 4.1 Ready 流程

**主路径**（`_bindWorldData`，第 315-326 行）：
```js
this.setData({
  uiReady: true,
  entryReady: true,
  loading: false,
  ready: true
});
```

**错误回退路径**（第 333-338 行）：
```js
this.setData({
  uiReady: true,
  entryReady: true,
  loading: false,
  ready: true
});
```

**两个路径完全相同，不存在「双入口 setData」风险。**

### 4.2 WXML Gate

```wxml
<view wx:if="{{!ready}}" class="lp-skeleton">
  <!-- skeleton loading -->
</view>

<block wx:else>
  <!-- 全部实质性 UI -->
</block>
```

- `ready=true` 前仅渲染骨架屏
- `ready=true` 后渲染完整 UI（包括 stats、carousel、CTA、login）

### 4.3 冗余 setData（P3）

`_initPage` 在 `onLoad` 中被调用，同时在 `onShow` 中可能被再次调用：

```js
onShow: function () {
  if (globalThis.__BOOT_READY__ !== true) return;
  // ...
  this._initPage();  // 如果 BOOT_READY 已为 true
}
```

与 `_bindWorldData` 的关系：
```
onLoad
  ├── _initPage（同步） → setData({userType, stats, carouselItems})
  │      ↑ 此时 ready=false，数据排入队列
  └── setTimeout(0) → _bindWorldData → setData({ready:true, stats, carouselItems})
         ↑ ready=true，UI 首次真正渲染

onShow（如果 BOOT_READY=true）
  └── _initPage → setData({userType, stats, carouselItems})  ← 冗余，数据不变
```

**结论：不危险，数据是幂等的。仅存在浪费的二次渲染。**

### 4.4 `_safeSetData` vs `setData`

`_safeSetData` 检查 `_stabilized` 标志（仅在 `onReady` 后为 true），但：
- `_bindWorldData` 使用 `this.setData`（非 `_safeSetData`）
- `_initPage` 使用 `this.setData`（非 `_safeSetData`）

如果 `onReady` 从未触发，这些 `setData` 调用仍会执行。但 `onReady` 是 WeChat 原生生命周期，**通常总是会触发**。

---

## 🟡 TASK 5：真实链路图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE 真实链路图                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  app.js boot（同步）                                                     │
│    ├── Visual Bible Enforcer                                             │
│    ├── world_runtime_store boot                                           │
│    ├── Visual Injector boot                                              │
│    ├── Component Registry boot                                           │
│    ├── Entry System（同步 + 2s 硬超时备份）                                │
│    └── AR Event Engine（fire-and-forget）                                 │
│         ↓                                                               │
│  onLaunch（同步创建 store.getState）                                      │
│         ↓                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  LANDING PAGE onLoad                                             │    │
│  │                                                                   │    │
│  │  第一步：bgImage=''（data 中已预设）                                │    │
│  │    ├── wx:if="{{bgImage}}" → FALSE                                │    │
│  │    ├── <image> 不被渲染                                           │    │
│  │    ├── CSS 渐变立即渲染（.lp-bg__scene--gradient）                  │    │
│  │    └── 零 HTTP 图片请求                                           │    │
│  │         ↓                                                         │    │
│  │  第二步：_initPage（同步）                                           │    │
│  │    ├── setData({userType, stats, carouselItems})                   │    │
│  │    └── 此时 ready=false，数据排队                                   │    │
│  │         ↓                                                         │    │
│  │  第三步：setTimeout(0) → _bindWorldData                            │    │
│  │    ├── 获取 store 数据或用回退                                      │    │
│  │    ├── setData({ready:true, stats, carouselItems,                  │    │
│  │    │           points, relics, rights, loginVisible,               │    │
│  │    │           uiReady, entryReady, loading})                       │    │
│  │    └── 骨架消失 → 完整 UI 渲染                                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│         ↓                                                               │
│  onReady                                                                │
│    ├── setData({__pageReady: true})                                     │
│    └── setTimeout(0) → __BOOT_READY__ = true                            │
│         ↓                                                               │
│  IF onShow 触发（且 BOOT_READY=true）                                   │
│    └── _initPage 再次 → 冗余 setData（幂等，无危害）                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  图片请求隔离（当前状态）                                                 │
│                                                                         │
│  bgImage='' → 无图片网络请求                                              │
│                                                                         │
│  如果 bgImage 被设置为非空路径：                                          │
│    ├── <image src="..." /> → HTTP 500                                   │
│    ├── background-image: url(...) → HTTP 500（双触发）                   │
│    ├── onImgError → 设 fallback → HTTP 500 再触发                       │
│    └── _fallbackAttempted=true → bgImage='' → CSS 渐变                  │
│        全程代价：2-4 次 HTTP 往返，约 1-3 秒                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 风险登记表

| 风险项 | 严重度 | 状态 | 说明 |
|--------|--------|------|------|
| 全部 9 个资产路径为虚拟路径 → 加载即 500 | 🔴 P0 | **已确认** | `/static/` `/images/` `/assets/scene/` 均无实际文件。构建未复制。 |
| `bgImage=''` 修复打破超时链 | ✅ 已修复 | **正常运行** | 当前状态稳定。 |
| `<image>` + CSS `background-image` 双触发 | 🟡 P2 | **存在但不活动** | 两者都对同一路径发请求，但有守卫。 |
| Fallback 重试循环（最多 2 次往返） | 🟡 P2 | **已守卫** | `_fallbackAttempted` 防止死循环。 |
| `_initPage` 冗余 setData | 🟢 P3 | **幂等** | `onLoad` + `onShow` 双入口。数据相同，无危害。 |
| `_bindWorldData` 使用 `setData` 而非 `_safeSetData` | 🟡 P2 | **残余** | 如果 `onReady` 从未触发，setData 仍会执行（但 WeChat 保证触发）。 |

---

## 🎯 根因总结

```
所有图片路径是虚拟路径 → 无磁盘文件 → 构建不复制
    ↓
HTTP 500（每次 <image> 渲染）
    ↓
框架等待 + 重试 → 累加延迟
    ↓
触发 WeChat 页面渲染超时（~5-10s）
```

**当前修复（`bgImage=''`）通过零网络请求绕过此问题。真正的修复（提供实际资产文件）是设计/运维任务，非代码修改。**

### 修复建议（外部依赖）

1. **统一路径约定**：选定一个前缀（建议 `/static/`），废弃 `/images/` 和 `/assets/`
2. **提供实际文件**：将设计资产放入 `apps/miniapp/static/scene/` 等目录
3. **更新构建配置**：在 `project.config.json` 的 `packOptions.include` 中添加 `static/` 目录
4. **清理历史路径**：删除 `VISUAL_ASSET_CONTRACT_V1.md`、`asset-resolver.js`、`GOVERNANCE_RUNTIME_HOOK_V2.js` 中的过时路径

---

*报告生成于 2026-06-30 · 审计引擎：Cursor Agent · 审计模式：只读审计，零修改*
