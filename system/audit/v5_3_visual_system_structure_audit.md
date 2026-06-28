# V5.3 视觉系统结构审计报告

**审计日期：** 2026-06-27  
**审计范围：** LOVEQIGU_MINIAPP — pages/index, pages/ar-entry, pages/explore-map, app.json, app.js, system/ui/, xr_demo 引用, data/ 状态数据  
**审计工具：** 静态代码分析 + 渲染树推导  
**目标：** 定位"首页UI无变化 / landing与explore混合 / XR污染 / loading异常"的根因

---

## 审计任务1：路由结构检查

### app.json 路由注册

```json
"entryPagePath": "pages/landing/index",
"pages": [
  "pages/landing/index",        // ① 入口页（QR扫码 / 微信登录）
  "pages/index/index",          // ② 探索首页（登录后）
  "pages/explore-map/index",    // ③ 探索地图
  "pages/ar-entry/index",       // ④ AR 入口桥接
  "pages/xr-primitive-sample/index", // ⑤ XR 渲染基线页
  "pages/atom/index",           // ⑥-
  // ... 共 29 页
]
```

### 检查结论

| 检查项 | 结果 |
|--------|------|
| 当前实际首页（entry page） | `pages/landing/index` — 正确指向 QR 扫码 / 登录页 |
| Landing 是否独立入口 | ✅ 是，`entryPagePath` 明确指向 landing |
| Explore 与 Index 是否共用页面 | ❌ 否，`pages/index/index` 与 `pages/explore-map/index` 是两个独立页面 |
| app.json 是否存在合并路径 | ❌ 无，所有页面独立注册 |
| **双首页是否被合并为单页结构** | **否，双首页结构正常** ✅ |

**判定：路由结构无问题。双首页系统（landing → index）完好。**

---

## 审计任务2：UI渲染链检查

### 渲染树结构（文本）

#### `pages/index/index.wxml` — 探索首页

```
<view.proto-page.user-phase1-page>                     ← 始终渲染
  <view.ui-ambient-layer>                               ← 氛围光层（始终渲染）
    <ambient-glow--top />
    <ambient-glow--bottom />
  </view>

  <view.home-skeleton wx:if="{{loading}}">              ← 条件：loading=true
    <hero placeholder />
    <3 stat pills />
    <cta placeholder />
    <2 content panels />
  </view>

  <block wx:else>                                       ← 条件：loading=false
    <view.user-home-scroll>
      "AR游伴" / "看见即是找回"
      {{eventSummary.title}}
      <view.user-verse> — 引导语
      <view.user-hero-stats> — 3 统计条（进度/信物/礼遇）
      <button.user-primary-cta> — "开始探索"
    </view>
    <view.proto-section wx:if="{{recommendedPoint}}">    ← 条件：有推荐点
      今日推荐 / 推荐点详情 + 按钮
    </view>
    <view.proto-section>                                  ← 始终渲染
      探索路径（5 个导航入口）
    </view>
    <view.proto-section>                                  ← 始终渲染
      今日回响
    </view>
  </block>

  <pilot-fx-overlay />                                   ← 始终渲染
  <user-bottom-nav />                                    ← 始终渲染
</view>
```

#### `pages/explore-map/index.wxml` — 探索地图

```
<view.exp-page>
  <view.exp-atmosphere />                                ← 雾层背景
  <view.exp-header>                                      ← 头部+统计
  <view.exp-map>                                         ← 浮动节点地图
  <view.exp-next>                                        ← 推荐点
  <view.exp-section>                                     ← 探索印记（信物入口）
  <user-bottom-nav />
  <pilot-fx-overlay />
</view>
```

#### `pages/landing/index.wxml` — 登录页

```
<view.landing-page>
  <view.landing-skeleton wx:if="{{loading}}">            ← 骨架加载
  <block wx:else>
    <view.landing-atmosphere />                          ← 雾山背景
    <view.landing-content>
      <landing-world-title> — 标题+印章+光晕
      <landing-guide> — 东方引导语
      <landing-scan-badge wx:if="{{scanResult}}">
      <landing-actions> — 印章登录按钮 + 扫码按钮
    </view>
    <landing-footer>
  </block>
</view>
```

### 关键发现：重复渲染（P0）

**`pages/index/index.js` 中 `onLoad` + `onShow` 共触发 6 次 `refresh()`：**

```javascript
// onLoad (page 首次加载)
this.refresh();                                          // ① 同步
merchantEventService.ensureReadyAsync().then(refresh);   // ② 异步
userFrontend.ensureReadyAsync().then(refresh);            // ③ 异步

// onShow (每次页面显示)
this.refresh();                                          // ④ 同步
merchantEventService.ensureReadyAsync().then(refresh);   // ⑤ 异步
userFrontend.ensureReadyAsync().then(refresh);            // ⑥ 异步
```

**每条 `refresh()` 路径：**
- 调用 `buildPageData()`
- `buildPageData()` 第一行执行 `userRuntime.boot()`（幂等但同步）
- 然后 `userRuntime.getAdapter()` → `getHomeData()` / `getExploreMapData()` — 全量同步计算
- 最终 `this.setData(...)` 重新渲染整个页面

### 叠加渲染模块

| 始终渲染 | 条件渲染 |
|---------|---------|
| `ui-ambient-layer`（氛围） | `loading` skeleton |
| `pilot-fx-overlay` | `recommendedPoint` 推荐区 |
| `user-bottom-nav` | |
| 探索路径导航区 | |
| 今日回响区 | |

**结论：无"同一页面多个UI模块叠加导致混合"问题。** landing / index / explore-map 三个页面各自独立渲染，不重叠。

---

## 审计任务3：状态机检查

### 现存状态机清单

| 文件 | 职责 | 是否有 UI 副作用 |
|------|------|-----------------|
| `services/exploration-state.js` | 产品层三态映射：NOT_EXPLORED → EXPLORING → REVEALABLE | ❌ 纯函数，无 setData / 无存储 |
| `services/ar/checkin-state-machine.js` | 打卡流程状态机：IDLE → ... → COMPLETED，带 `wx.getStorageSync` 持久化 | ❌ 仅操作 storage，不接触 UI |
| `app.js globalData` | 仅存 `systemInfo`、`isHarmonyOS` | ❌ 无 UI 相关 |
| `behaviors/phase1-page-guard.js` | 仅 `shareGuard.suppressUserFacingShareMenus()` | ❌ 无状态 |

### 状态机关键问题

| 检查项 | 结果 |
|--------|------|
| `landing_state` 是否存在 | ❌ 不存在独立声明。Landing 的状态是 `data.loading / loggedIn / scanResult` |
| `explore_state` 是否存在 | ❌ 不存在。`index` 和 `explore-map` 各自独立调用 `getAdapter()` → `getHomeData()` |
| `xr_state` 是否阻断 UI | ❌ 否。XR 状态完全隔离在 `ar-entry` / `xr-primitive-sample` 中 |
| 是否存在 state 互相覆盖 | ❌ 否。不同页面间无共享状态覆盖 |

**结论：状态机错误导致UI合并 → 否。** 状态机之间不互相覆盖，且与页面 UI 渲染分离。

---

## 审计任务4：XR污染检查

### XR 残留扫描

| 扫描项 | 文件数 | 结果 |
|--------|--------|------|
| `xr_demo` 引用 | 0 | ✅ 已全部清除，无代码引用 |
| `ENGINE_WASM` | 0 | ✅ 已全部清除 |
| `draco_mini` / `draco` | 0 | ✅ 已全部清除 |
| `WXWebAssembly` / `WebAssembly.instantiate` | 0 | ✅ 已全部清除 |
| `xr_demo/` 目录是否残留 | 目录存在 | ⚠️ 目录 `apps/miniapp/xr_demo/` 仍在磁盘上（`git status` 显示为 untracked），但无任何代码引用它 |

### XR 触发链路

```
explore-map → onOpenScanShell()
  → rhythm.exploreFeedback()         // V5.4 节奏系统
  → xrTrigger.emit({pointId})        // 标准事件触发
  → wx.navigateTo('/pages/ar-entry/index')
    → ar-entry: XR 节奏系统 (5.2s)
      → wx.navigateTo('/pages/xr-primitive-sample/index')
        → xr-primitive-sample: 纯渲染 xr-frame
```

**结论：XR是否影响首页渲染链 → 否。** XR 完全隔离。`pages/index/index` 中不存在任何 XR 引用。

---

## 审计任务5：loading卡死检查

### loading 生命周期路径

```
data: { loading: true, ...emptyHomeState() }
  ↓
onLoad() → refresh()
  ↓
buildPageData():
  ├─ adapter 存在 → { loading: false, ...adapterData }
  └─ adapter 不存在 → { loading: false, ...overviewData }
  ↓
refresh() 异常:
  catch → { loading: false, ...emptyHomeState() }
```

### 关键发现

| 发现 | 严重程度 | 说明 |
|------|---------|------|
| **重复 refresh 6 次** | **P0** | `onLoad` + `onShow` 中共 6 次调用 `refresh()`，每次全量同步重算 |
| **`buildPageData()` 同步计算** | **P1** | `userRuntime.boot()` + `getAdapter()` + `getHomeData()` 同步执行，无异步保护 |
| **`explore-map` 无 loading 状态** | **P2** | `data: buildPageData()` 直接初始化，无 skeleton |
| **loading 不会被卡死** | ✅ | catch 分支总会将 `loading` 置 `false` |

**结论：loading 不阻断渲染，但性能受损。** loading 本身不会卡死（catch 总会置 false）。但 **重复 6 次的同步 refresh+setData** 导致：
- 骨架屏闪现 → 内容渲染 → 再次重算
- 用户感知为"UI无变化"（实际每次都在全量重算）
- 低端设备可能出现闪白

---

## 最终结论

### Top 3 根因

| 优先级 | 根因 | 影响 |
|--------|------|------|
| **P0** | **`pages/index/index.js`、`explore-map/index.js` 中 `onLoad`/`onShow` 重复调用 `refresh()` 最多 6 次** | 每次全量同步重算数据管线（boot → getAdapter → getHomeData），导致骨架屏闪烁、内容跳变、UI 短暂空白。用户感知为"首页UI无变化"。 |
| **P1** | **`buildPageData()` 同步执行全量数据管线，无渐进式加载** | `userRuntime.boot()` + `getAdapter()` + `getHomeData()` 同步执行。任何环节抛出同步异常（如 adapter 未就绪）直接进入 catch，页面显示空状态，无过渡加载体验。 |
| **P2** | **`explore-map` 页面无 loading/skeleton 状态** | `data: buildPageData()` 直接初始化，首次加载慢时用户直接看到空白或部分数据。 |

### 关键问题回答

| 问题 | 答案 |
|------|------|
| 双首页系统是否已失效 | **否** — `entryPagePath: "pages/landing/index"` + `pages/index/index` 独立注册，结构正常 |
| 是否存在"双首页被合并为单页结构" | **否** — landing / index / explore-map 是三个独立页面 |
| XR 是否污染首页 UI | **否** — 首页无 XR 引用，XR 完全隔离在 ar-entry / xr-primitive-sample 中 |
| loading 是否阻断渲染 | **否，但性能受损** — loading 不会被卡住，但重复 6 次的同步 refresh+setData 导致 UI 闪烁和性能浪费 |

### 修复优先级

| 优先级 | 修复项 |
|--------|--------|
| **P0** | 消除 `onLoad`/`onShow` 中多余的 `refresh()` 调用。应在 `onLoad` 首次调用一次，`onShow` 仅在参数变化时刷新。 |
| **P1** | 为 `buildPageData()` 增加渐进式加载策略：先渲染骨架/缓存数据，异步完成后更新。`userRuntime.boot()` 应支持 `ensureReadyAsync` 类似模式。 |
| **P2** | `explore-map` 页面增加 loading/skeleton 状态，与 `index` 页面保持一致。 |
| **P3** | 清理磁盘上残留的 `apps/miniapp/xr_demo/` 目录（untracked，但无代码引用）。 |

---

## 附录：审计文件清单

| 文件路径 | 审计内容 |
|----------|----------|
| `apps/miniapp/app.json` | 路由注册、entryPagePath |
| `apps/miniapp/app.js` | 全局状态、onLaunch 链路 |
| `apps/miniapp/pages/landing/index.*` | 登录页 UI 渲染树、loading 生命周期 |
| `apps/miniapp/pages/index/index.*` | 探索首页渲染树、refresh 重复调用 |
| `apps/miniapp/pages/explore-map/index.*` | 探索地图渲染树、loading 缺失 |
| `apps/miniapp/pages/ar-entry/index.js` | XR 触发链路、业务逻辑隔离 |
| `apps/miniapp/pages/xr-primitive-sample/index.*` | XR 渲染页是否纯净 |
| `apps/miniapp/services/exploration-state.js` | 产品层状态机 |
| `apps/miniapp/services/ar/checkin-state-machine.js` | 打卡流程状态机 |
| `apps/miniapp/behaviors/phase1-page-guard.js` | 页面守卫行为 |
| `apps/miniapp/services/user-runtime-adapter/index.js` | boot() / getAdapter() 同步性 |
| `system/ui/*.js` | UI 交互系统（无页面引用，不影响渲染） |
