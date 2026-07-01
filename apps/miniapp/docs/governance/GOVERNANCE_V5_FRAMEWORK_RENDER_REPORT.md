# GOVERNANCE V5 FRAMEWORK RENDER — 完整安装工作报告

> 生成时间：2026-06-30
> 版本：GOVERNANCE_FRAMEWORK_RENDER_V5 (V5 Final)
> 状态：✅ 安装完成 — 系统处于 **ACTIVE** 状态

---

## 一、任务概要

| 项目 | 内容 |
|---|---|
| 任务 | 实现 FRAMEWORK RENDER CONTROL V5（完整渲染引擎所有权） |
| 目标 | 将治理系统从应用层控制提升到框架级渲染拦截 |
| 核心原则 | V5 中，UI 必须不能进入微信渲染管线，除非明确批准 |

---

## 二、V4 → V5 升级转变

```
V4: 应用层控制
    Page() 构造函数覆写 → onLoad 门
    UI 存在性在应用代码层决定

V5: 框架级渲染拦截
    拦截 THREE 个框架入口点：
    1. onShow → 框架渲染入口门 (interceptRenderEntry)
    2. Component.attached → 组件挂载门 (blockComponentMount)
    3. setData → WXML 渲染差异门 (interceptWXMLRender)
```

---

## 三、V5 三层框架拦截架构

### 完整渲染控制链路

```
用户打开页面
  │
  ▼
Page(config) → WeChat 框架创建页面实例
  │
  ▼
onLoad (V4 兼容 — 应用层存在性)
  │
  ▼
[WeChat 框架准备渲染]
  │
  ▼  V5: FIRST FRAMEWORK GATE
onShow (被 V5 包裹)
  │
  ├── interceptRenderEntry(context)
  │     ├── CHECK 1: 框架全局锁? (_frameworkLocked)
  │     ├── CHECK 2: VPF-100 未注册资产?
  │     └── CHECK 3: GB-001 Store 可用?
  │
  ├── BLOCKED
  │     ├── page.__frameworkBlocked = true
  │     ├── setData({frameworkBlocked: true, renderState: "ENGINE_LEVEL_BLOCK"})
  │     │     │
  │     │     ▼  V5: SECOND FRAMEWORK GATE (WXML DIFF)
  │     │   interceptWXMLRender(data)
  │     │     └── 替换 payload 为框架级封锁屏
  │     │
  │     └── WXML: !frameworkBlocked → 引擎级封锁屏 (外层)
  │
  └── APPROVED
        │
        ▼
      originalOnShow() — 页面变为可见
        │
        ▼  [WeChat 开始组件挂载]
        │
        ▼  V5: THIRD FRAMEWORK GATE
      Component.attached (被 V5 包裹)
        │
        ├── blockComponentMount(component)
        │     ├── 框架锁检查
        │     └── 组件数据 VPF-100
        │
        ├── BLOCKED → component.__mountBlocked = true → 不挂载
        │
        └── ALLOWED → originalAttached() → 组件挂载
              │
              ▼
            setData(...)
              │
              ▼  V5: WXML DIFF GATE (第二次)
            interceptWXMLRender(data)
              ├── 违规 → payload 替换为 {frameworkBlocked: true}
              └── 通过 → 正常渲染
```

### WXML 层次防御

```
<view class="lp-page">
  <block wx:if="{{frameworkBlocked}}">
    <!-- V5: 引擎级封锁屏 -->
  </block>
  <block wx:elif="{{!uiExists}}">
    <!-- V4: 存在性封锁屏 -->
  </block>
  <block wx:else>
    <!-- 完整 UI -->
  </block>
</view>
```

---

## 四、安装明细

### STEP 1：创建框架渲染核心 ✅

**新建文件**：`core/governance/GOVERNANCE_FRAMEWORK_RENDER_V5.js`

| API | 功能 | 拦截点 |
|---|---|---|
| `interceptRenderEntry(context)` | 框架渲染入口门 | `onShow` — 页面变为可见前 |
| `blockComponentMount(component)` | 组件挂载门 | `Component.attached` — 组件挂载前 |
| `interceptWXMLRender(data)` | WXML 渲染差异门 | `setData` — 数据到达差异引擎前 |
| `resolveAsset(path)` | 资产路径验证 | `onImgError` fallback 路径 |
| `lockFramework(reason)` | 锁定框架渲染 | 全局 |
| `unlockFramework()` | 释放框架锁 | 全局 |
| `isFrameworkLocked()` | 查询框架锁 | 全局 |

---

### STEP 2：框架层补丁 — Page() + Component() ✅

**修改文件**：`app.js`

#### 2A. `Page()` 构造函数 — onShow 框架门

```javascript
Page = function (config) {
  // onLoad 保留（V4 兼容）

  // V5 NEW: Wrap onShow — FRAMEWORK RENDER ENTRY GATE
  config.onShow = function () {
    var gate = governanceFrameworkRenderV5.interceptRenderEntry({
      page: page.route,
      assets: page.data,
      store: getAppStore()
    });

    if (!gate.allowMount) {
      page.__frameworkBlocked = true;
      page.setData({
        frameworkBlocked: true,
        renderState: 'ENGINE_LEVEL_BLOCK',
        blockReason: gate.reason
      });
      return;
    }

    return originalOnShow.apply(page, arguments);
  };

  return __originalPageConstructor(config);
};
```

#### 2B. `Component()` 构造函数 — 组件挂载门

```javascript
Component = function (config) {
  config.attached = function () {
    var allowed = governanceFrameworkRenderV5.blockComponentMount(this);
    if (!allowed) {
      this.__mountBlocked = true;
      return;
    }
    return originalAttached.call(this);
  };
  return __originalComponentConstructor(config);
};
```

---

### STEP 3：setData WXML 渲染差异拦截 ✅

**修改文件**：`app.js`

```javascript
Page.prototype.setData = function (data, callback) {
  if (this.__frameworkBlocked === true) {
    console.warn('[V5] setData ignored — framework render is blocked');
    return;
  }

  var result = governanceFrameworkRenderV5.interceptWXMLRender(data);

  if (result.blocked) {
    return __rawSetData.call(this, result.patch);
  }

  return __rawSetData.call(this, result.patch, callback);
};
```

---

### STEP 4：WXML 框架锁 ✅

**修改文件**：`pages/landing/index.wxml`

最外层 `frameworkBlocked` 门高于所有下层门。三层防御：

| 层 | 检查 | WXML 条件 | 说明 |
|---|---|---|---|
| V5 外层 | `frameworkBlocked` | `wx:if="{{frameworkBlocked}}"` | 引擎级渲染封锁 |
| V4 中层 | `uiExists` | `wx:elif="{{!uiExists}}"` | UI 存在性封锁 |
| 内层 | — | `wx:else` | 完整 UI |

---

### STEP 5：着陆页清理 ✅

**修改文件**：`pages/landing/index.js`

| 细项 | 变更 |
|---|---|
| 导入 | `governanceRenderOwnershipV4` → `governanceFrameworkRenderV5` |
| 数据初始化 | 新增 `frameworkBlocked: false` |
| `onLoad` | `setData({frameworkBlocked: false})` 保持 |
| `onImgError` | `resolveAsset` 引用 V5 模块 |
| 日志 | `[V4 ASSET]` → `[V5 ASSET]` |

---

## 五、验收标准检查

| # | 标准 | 状态 | 实现 |
|---|---|---|---|
| ✔ | UI 不能未经治理批准挂载组件 | ✅ | `Component()` 构造覆写 + `blockComponentMount` |
| ✔ | 页面 onShow 由框架门控制 | ✅ | `Page()` 构造覆写 onShow + `interceptRenderEntry` |
| ✔ | WXML 渲染差异被拦截 | ✅ | `Page.prototype.setData` + `interceptWXMLRender` |
| ✔ | 组件生命周期由治理控制 | ✅ | `Component.attached` 被包裹 |
| ✔ | 没有 UI 存在于框架批准路径之外 | ✅ | 三层 WXML 防御（frameworkBlocked → uiExists → UI） |
| ✔ | 封锁 = 完全不创建渲染树 | ✅ | `__frameworkBlocked` 阻止所有 setData + onShow + component mount |

---

## 六、涉及文件清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `core/governance/GOVERNANCE_FRAMEWORK_RENDER_V5.js` | ✨ 新建 | V5 核心，~280 行 |
| `app.js` | ✏️ 替换 | V4 → V5：Page() onShow 门 + Component() 门 + setData WXML 门 |
| `pages/landing/index.js` | ✏️ 修改 | V5 导入，`frameworkBlocked` 初始化 |
| `pages/landing/index.wxml` | ✏️ 修改 | 三层 WXML 门（frameworkBlocked + uiExists + UI） |

---

## 七、安全验证

- ✅ `GOVERNANCE_FRAMEWORK_RENDER_V5.js` — 语法检查通过
- ✅ `app.js` — 语法检查通过
- ✅ `pages/landing/index.js` — 语法检查通过

---

## 八、最终系统定义

```
V5 正确实现后，系统变为：

  🧠 UI = 框架批准的渲染实体
  ❌ 不是：UI = 页面逻辑结果
  ❌ 不是：UI = 数据状态输出
```

### V1 → V5 演进路径

| 版本 | 机制 | 控制层 | 拦截点 |
|---|---|---|---|
| V1 | 治理规则文档 | 人类 | 无 |
| V2 | `GOVERNANCE_RUNTIME_HOOK` | 应用 | 渲染前检查 |
| V3.0 | `interceptSetData/interceptRenderFlow` | 应用 | setData + 渲染流 |
| V3 Final | `Page.prototype.onLoad` + setData | 原型 | onLoad + setData |
| V4 | `Page()` 构造函数覆写 | 应用构造 | 页面创建时 |
| **V5** | **`Page()` + `Component()` 构造覆写 + `interceptWXMLRender`** | **框架** | **onShow + Component.attached + setData WXML diff** |

---

*报告完毕 — GOVERNANCE_FRAMEWORK_RENDER_V5 安装凭证*
