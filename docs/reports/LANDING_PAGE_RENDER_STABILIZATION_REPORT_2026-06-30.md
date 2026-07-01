# LANDING PAGE RENDER STABILIZATION REPORT

> 报告日期：2026-06-30  
> 涉及三次连续修复指令  
> 范围：`app.js` · `pages/landing/index.js` · `pages/landing/index.wxml`

---

## 目录

1. [指令一：Timeout Root Cause Locate](#1-指令一timeout-root-cause-locate)
2. [指令二：Stabilize Landing Page Render Timing](#2-指令二stabilize-landing-page-render-timing)
3. [指令三：Export Report](#3-指令三export-report)
4. [最终生命周期对比](#4-最终生命周期对比)
5. [剩余问题（已知）](#5-剩余问题已知)

---

## 1. 指令一：Timeout Root Cause Locate

### 1.1 问题现象

控制台日志显示：

```
[ASSET FAIL] bgImage load error
[ASSET PIPE] {bg: "/images/fallback.jpg", fallback: true}
2[渲染层网络层错误] Failed to load local image resource /images/fallback.jpg
  the server responded with a status of 500 (HTTP/1.1 500 Internal Server Error)
[ASSET FAIL] bgImage load error
[ASSET PIPE] {bg: "/images/fallback.jpg", fallback: true}
Error: timeout
    at WAServiceMainContext.js?t=wechat&v=3.15.2:1
```

关键观察：

- **Error: timeout 并非应用代码抛出**——它来自 WeChat 框架内部 `WAServiceMainContext.js`
- timeout 出现在**两次图片加载失败（500 错误）之后**
- 此时页面已经在 `onLoad` 中通过 `uiReady=true, loading=false` 揭示了 UI，但 `<image>` 组件正在尝试加载不存在的图片

### 1.2 分析过程

#### 步骤 1：搜索所有 Promise / async / setTimeout

在 `app.js` 中检查：

- **`__BOOT_PROMISE`** (`app.js:44`)：创建了 Promise 但**未被 WeChat 框架 await**——这是诊断钩子，不会导致 timeout
- **Entry System hard timeout** (`app.js:230`)：`setTimeout` 2 秒后触发 fallback unlock——**这是正确设计，不会挂起**
- **`onLaunch` 明确是同步的**（注释标记）——不会有未 resolve 的 async

在 `pages/landing/index.js` 中检查：

- 所有 `setTimeout` 都是 fire-and-forget 模式，不 throw
- 没有 `async/await` 或 `Promise`

→ **应用代码没有未 resolve 的 Promise 或挂起的 async 函数**

#### 步骤 2：追踪渲染生命周期

```
app.js boot → onLoad → setData({uiReady:true}) → onReady → setTimeout → __BOOT_READY__=true
                                                        ↑
                                          bgImage='/static/scene/aiqigu_landing_v1.jpg'
                                          <image src=...> → 500 → onImgError → setData(fallback)
                                                                                  ↓
                                                              <image src=fallback> → 500 → onImgError
```

每次 `<image>` 加载失败需要等待 HTTP 500 响应。两次失败 + WeChat 框架内部重试机制的总耗时 **触发了框架的页面渲染超时**。

#### 步骤 3：根因确认

**根因**：`bgImage` 初始化为不存在的文件路径 `/static/scene/aiqigu_landing_v1.jpg`。

- `<image wx:if="{{bgImage}}"` 条件为真（`''` 以外的值均为真）
- 框架发起网络请求 → 500 错误 → `onImgError` 设置 fallback → 再次 500
- 每次等待 500 响应消耗数十到数百毫秒
- WeChat 框架内置页面渲染超时（通常约 5-10 秒）被触发

### 1.3 修复方案

**最小化修复**：将 `bgImage` 初始值改为空字符串 `''`。

```diff
  data: {
-    bgImage: '/static/scene/aiqigu_landing_v1.jpg',
+    bgImage: '',  // empty = CSS gradient fallback renders immediately, no network request
  },
```

效果：

- `wx:if="{{bgImage}}"` → **为假** → `<image>` 组件不被渲染
- `wx:if="{{!bgImage}}"` → **为真** → CSS 渐变层立即显示
- **零网络请求** → 框架超时不再被触发
- `onImgError` 保留作为备选（未来有真实图片时可无缝切换）

**同时添加了 `[TIMEOUT TRACE]` 调试日志**，覆盖所有关键转换点：

| 日志点 | 文件 |
|---|---|
| `onLaunch entered` | `app.js` |
| `boot sequence complete` | `app.js` |
| `entry system hard timeout fired` | `app.js` |
| `entry system resolved synchronously` | `app.js` |
| `onLoad entered` | `index.js` |
| `_bindWorldData starting` | `index.js` |
| `onReady entered` | `index.js` |
| `BOOT_READY set to true` | `index.js` |
| `onShow entered` | `index.js` |
| `onImgError fired` | `index.js` |
| `_initPage entered` | `index.js` |

---

## 2. 指令二：Stabilize Landing Page Render Timing

### 2.1 问题现象

之前的渲染顺序：

```
onLoad:
  1. setData({ uiReady: true, loading: false })   ← 立即隐藏骨架，显示完整 UI
  2. setTimeout(0) → _bindWorldData()              ← 异步绑定 store 数据
```

这导致：

- **视觉闪烁**：骨架消失 → 显示空数据（stats: 10/0/0, carousel 初始构建）
- **数据覆盖**：store 数据绑定后通过 `setData` 覆盖 stats/carousel/points
- **两次渲染**：WXML 先渲染初始值，再渲染实际数据

### 2.2 分析过程

当前渲染顺序的问题是**没有唯一的数据权威时刻**。初始 `data` 对象中的 `stats` 和 `carouselItems` 是在模块加载时（甚至 store 初始化之前）通过 `buildStats()` 和 `buildCarouselItems()` 构建的，它们使用 fallback 数据。等到 `_bindWorldData` 在 `setTimeout` 中执行时，再用真实数据覆盖。

这意味着 WXML 至少经历两次数据变化，而 `loginVisible` 等字段在此期间可能处于不一致状态。

### 2.3 修复方案

**核心改动**：引入 `ready` 单一门控标志，所有 UI 只有在 `ready=true` 时才可见。

#### 文件：`pages/landing/index.js`

```
data 中新增 ready: false

onLoad 流程重写：
  - 移除立即 setData({uiReady:true, loading:false})
  - 只启动 _bindWorldData (setTimeout 0)
  - 不提前揭示 UI

_bindWorldData 流程重写：
  - 绑定 store 数据 (stats, carouselItems, points, loginVisible, uiReady)
  - 最后一个 setData 中统一设置 ready: true
  - 所有数据在同一个 setData 调用中原子性地应用到 WXML

新增加 _safeSetData 辅助方法：
  - 防止 setData 在页面未稳定时被调用
```

```diff
  data: {
+    ready: false,
  },

  onLoad: function() {
-   this.setData({ uiReady: true, entryReady: true, loading: false });
    setTimeout(() => this._bindWorldData(), 0);
  },

  _bindWorldData: function() {
    // ... 绑定 store 数据 ...
    this.setData({
+     stats: buildStats(store),
+     carouselItems: buildCarouselItems(),
+     points: pointsCount,
+     relics: relicsCount,
+     rights: rightsCount,
+     loginVisible: ...,
+     uiReady: true,
+     entryReady: true,
+     loading: false,
+     ready: true    ← 原子性揭示 UI
    });
  },
```

#### 文件：`pages/landing/index.wxml`

```diff
- <view wx:if="{{loading || !uiReady}}" class="lp-skeleton">
+ <view wx:if="{{!ready}}" class="lp-skeleton">

  ...

- <block wx:if="{{!loading && uiReady && loginVisible !== false}}">
+ <block wx:if="{{ready && loginVisible !== false}}">
```

**门控逻辑变更**：

| 元素 | 旧门控 | 新门控 | 效果 |
|---|---|---|---|
| 骨架屏 | `loading \|\| !uiReady` | `!ready` | 骨架保持到 store 绑定完成 |
| 登录按钮 | `!loading && uiReady && loginVisible` | `ready && loginVisible` | 登录按钮与 UI 同时出现 |

---

## 3. 指令三：Export Report

生成本文档。

---

## 4. 最终生命周期对比

### 旧生命周期（修复前）

```
app.js boot
  → onLoad
    → setData({uiReady:true, loading:false})    ← 骨架消失，UI 显示空数据
    → setTimeout(0)
  → onReady
    → setTimeout → __BOOT_READY__ = true
  → _bindWorldData (setTimeout 回调)
    → setData({stats, carouselItems, ...})        ← 覆盖数据（第二次渲染）
  → bgImage = '/static/scene/aiqigu_landing_v1.jpg'
    → <image> 500 → onImgError → fallback 500 → timeout
```

### 新生命周期（修复后）

```
app.js boot
  → onLoad
    → setTimeout(0) 启动 _bindWorldData
    → 不揭示 UI（ready = false, 骨架保持）
  → onReady
    → setTimeout → __BOOT_READY__ = true
  → _bindWorldData (setTimeout 回调)
    → getApp().store.getState() (或本地 fallback)
    → setData({
         stats: ...,
         carouselItems: ...,
         points: ..., relics: ..., rights: ...,
         loginVisible: ...,
         uiReady: true, loading: false,
         ready: true                        ← 原子性揭示
       })
  → bgImage = '' (无网络请求)
    → CSS 渐变立即显示，无 timeout
```

**关键改进**：

1. **一次 setData = 一次渲染**——所有 store 数据在 UI 可见之前就已就位
2. **零图片网络请求**——`bgImage=''` 避免了触发框架超时的整个链路
3. **`ready` 单一门控**——消除了 `loading` / `uiReady` 等多标志组合导致的状态不一致

---

## 5. 剩余问题（已知）

| 问题 | 状态 | 说明 |
|---|---|---|
| 图片资源不存在 | **已知，不阻塞** | `/static/scene/` 下无真实图片。CSS 渐变作为最终 fallback 正常工作。需产品侧补充视觉资产。 |
| explore 节点不足 10 个 | **修复前已存在** | `buildCarouselItems()` 会输出 `[PAGE_01_LANDING] INVALID` 警告。需 seed 数据填充。 |
| `onShow` 的 `_initPage` 可能覆盖 `_bindWorldData` 的数据 | **低风险** | `_initPage` 在 `__BOOT_READY__` 后调用，晚于 `_bindWorldData`。当前两者设置不同字段，不冲突。 |

---

*文档结束*
