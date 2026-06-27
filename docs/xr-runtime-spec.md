# LOVEQIGU XR 运行规范 V1

> 本规范为 **强制执行规范**，所有 XR/AR 运行时代码必须遵守。
>
> 版本：V1
> 生效日期：2026-06-27
> 适用范围：`apps/miniapp/` 及任何涉及 XR 运行时的模块

---

## 1. 核心原则

### 1.1 UI 层不直接控制 XR Scene

**规则：**

- UI 层（Page、Component、WXML 逻辑）**禁止**直接调用 XR scene API（如 `scene.add()`, `scene.remove()`, `xrFrame` 原生接口）。
- UI 层只能通过**事件总线**（`xr-event-bus.js` / `ar-event-bus.js`）向 XR 运行时发送信号。
- XR 运行时是唯一有权操作 XR scene 的模块。

**禁止：**

```javascript
// ❌ 禁止：UI 层直接操作 XR scene
onLoad() {
  const scene = xrFrame.Scene.create();
  scene.addChild(model);
}

// ❌ 禁止：UI 层持有 XR 引用
this.xrScene = scene;
```

**允许：**

```javascript
// ✅ 通过事件总线通信
arEventBus.emit('ar:detected', { relicId: 'relic_01' });
```

---

### 1.2 XR 必须由 Reset + Init 双阶段驱动

**规则：**

- 每次进入 XR 页面必须先执行 `reset()`，再执行 `init()`。
- **禁止**在 `init()` 中假设上次状态仍然有效。
- `reset()` 必须清除：
  - scene graph（场景图）
  - marker state（标记状态）
  - 信物数据缓存
  - spatial anchors（空间锚点）
  - world persistence memory（内存中的世界持久化）
  - event bus listeners（事件总线监听器）

**流程：**

```
进入 XR 页面
  ↓
resetXR() —— 清除所有运行时状态
  ↓
    等待用户触发 / 自动触发
      ↓
    initXR() —— 重新初始化 scene、camera、resource
```

**实现参考：**

- 统一的 `resetXR()` 函数定义在 `apps/miniapp/core/runtime/resetXR.js`
- 在 `ar-entry` 页面的 `onShow()` 中**必须**调用 `resetXR({ keepEventBus: true })`

---

### 1.3 所有信物 / 节点必须来自 Data Layer

**规则：**

- XR 运行时**不得**自行生成或伪造信物数据。
- 所有 relic / node 数据必须从 Data Layer 获取：
  - `relic_engine_v1.js`（信物引擎）
  - `scene_map_v1.json`（场景节点数据）
  - `relic_store_v1.js`（信物存储）
- XR 运行时只负责**视觉呈现**，不负责数据决策。

**数据流：**

```
Data Layer (relic_engine / scene_map)
  ↓
UI / 事件总线
  ↓
XR Runtime（仅渲染）
```

**禁止：**

```javascript
// ❌ 禁止：XR 运行时生成信物
function onMarkerDetected() {
  const relic = { id: '自制信物', name: '伪造数据' };
  this.renderRelic(relic);
}
```

---

### 1.4 禁止 XR Singleton 长生命周期缓存

**规则：**

- XR 运行时**不允许**持有跨页面/跨会话的全局单例。
- 任何 XR 模块的生命周期**不得超过**当前 XR 会话的生命周期。
- 会话结束时（页面 `onUnload` / `resetXR`），所有 XR 相关缓存必须被释放。

**具体要求：**

| 缓存类型 | 处理方式 |
|---------|---------|
| XR scene instance | 每次会话重建，不可复用 |
| XR camera instance | 随 scene 重建 |
| Marker state | 随 reset 清空 |
| Relic cache（内存） | 随 reset 清空 |
| Event bus listeners | 随 reset 清除（或指定 keep） |
| Spatial anchors | 随 reset 清除 |
| Resource loader state | 随 reset 重置 |

**允许：**

- Data Layer 的持久化数据（如 `wx.setStorageSync` 存储的信物记录）不属于 XR 运行时缓存，可以跨会话保留。

**禁止：**

```javascript
// ❌ 禁止：全局 XR 单例
var globalScene = null;
function getScene() {
  if (!globalScene) globalScene = createScene();
  return globalScene;
}

// ❌ 禁止：跨会话复用 XR 实例
var xrRuntime = new XRRuntime();
// 用户离开页面再回来 → 仍然复用同一个 xrRuntime
```

---

### 1.5 每次 UI Reload 必须触发 XR 重建

**规则：**

- 每次 UI 层重新加载（包括但不限于：页面 `onShow`、热重载、路由导航返回），必须触发 XR 运行时的完整重建。
- 重建意味着：
  - 执行 `resetXR()` 清空状态
  - XR 运行时重新走 `Init` 流程
  - 不依赖任何先前的 XR 状态

**实现机制：**

```javascript
// 在 ar-entry/index.js onShow() 中：
globalThis.__XR_VERSION__ = Date.now();  // 每次 onShow 更新版本号

// 在 runtime-builder.js startXRRenderPipeline() 中：
if (globalThis.__XR_BUILD_VERSION__ !== globalThis.__XR_VERSION__) {
  // 版本变化 → 强制重建
  xrState = IDLE;
  // 重置所有绑定守卫
  // 重新走初始化流程
  globalThis.__XR_BUILD_VERSION__ = globalThis.__XR_VERSION__;
}
```

**验证面板：**

开发环境中的强制验证面板（`ar-entry` 页面顶部 debug panel）会实时显示：

| 标记 | 来源 | 说明 |
|------|------|------|
| `APP_LAUNCHED` | `app.js onLaunch` | 小程序启动时间 |
| `AR_ENTRY_LOADED` | `ar-entry/index.js onLoad` | XR 页面加载时间 |
| `XR_RUNTIME_INIT` | `runtime-builder.js` | XR 运行时初始化时间 |
| `XR_VERSION` | `ar-entry/index.js onShow` | 当前 XR 重建版本号 |

三个时间戳必须一致（差值 < 60s），否则面板显示红色警告：「XR RUNTIME NOT SYNCED」。

---

## 2. 运行时生命周期

```
小程序启动 (onLaunch)
  ├── __APP_LAUNCHED__ = Date.now()
  │
  ├── 进入 AR 页面 (onLoad)
  │     ├── __AR_ENTRY_LOADED__ = Date.now()
  │     └── init UI
  │
  ├── 页面显示 (onShow)
  │     ├── __XR_VERSION__ = Date.now()      ← 新版本号
  │     ├── resetXR({ keepEventBus: true })   ← 清空运行时状态
  │     │
  │     └── 用户触发 XR
  │           └── startXRRenderPipeline()
  │                 ├── __XR_RUNTIME_INIT__ = Date.now()
  │                 ├── 版本检测 → 检测变化 → 强制重建
  │                 ├── init scene
  │                 └── bind lifecycle
  │
  ├── 页面离开 (onUnload)
  │     └── cleanup (event bus unbind)
  │
  └── 重新进入 (onShow)
        ├── 版本变化 → resetXR → 重建 XR
        └── 旧 XR 实例完全放弃
```

---

## 3. 架构分层

| 层级 | 职责 | 禁止 |
|------|------|------|
| **UI Layer** | Page 生命周期、用户交互事件、debug 面板 | 直接操作 XR scene |
| **Event Bus** | UI ↔ XR 通信 | 承载信物生成逻辑 |
| **XR Runtime** | Scene 管理、相机、渲染、Marker 跟踪 | 自行生成数据、持有全局单例 |
| **Data Layer** | 信物引擎、场景地图、存储 | 依赖 XR 运行时 |

---

## 4. 规范执行检查清单

每条规则在代码审查 / 自动验证时必须检查：

- [ ] UI 层无直接 `xrFrame.Scene` 或 `scene.add/remove` 调用
- [ ] 每次 `onShow` 都调用 `resetXR()`
- [ ] 信物数据全部从 `relic_engine_v1.js` / `scene_map_v1.json` 获取
- [ ] XR 运行时无全局单例（无 `var xrScene = null` 模式）
- [ ] `__XR_VERSION__` 在每次 `onShow` 更新
- [ ] `runtime-builder.js` 实现了版本检测重建逻辑
- [ ] 所有 XR 相关模块在 `resetXR()` 中注册了重置方法
- [ ] 开发环境验证面板可正常显示时间戳及同步状态

---

## 5. 违规处理

| 违规类型 | 处理方式 |
|---------|---------|
| UI 直接操作 XR scene | 代码评审必须拒绝合并 |
| XR 全局单例 | 代码评审必须拒绝合并 |
| reload 不走重建 | 自动检测 → CI 告警 |
| 数据层与 XR 层耦合 | 代码评审必须拒绝合并 |

---

> **这是 LOVEQIGU XR 运行规范 V1（强制执行）**
> 
> 所有 XR/AR 运行时相关开发、审查、CI 验证必须以此规范为准。
> 违反本规范的代码不得合并。
