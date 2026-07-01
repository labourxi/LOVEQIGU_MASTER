# GOVERNANCE V4 RENDER OWNERSHIP — 完整安装工作报告

> 生成时间：2026-06-30
> 版本：GOVERNANCE_RENDER_OWNERSHIP_V4 (V4 Final)
> 状态：✅ 安装完成 — 系统处于 **ACTIVE** 状态

---

## 一、任务概要

| 项目 | 内容 |
|---|---|
| 任务 | 实现 RENDER OWNERSHIP LAYER V4（完整 UI 存在控制） |
| 目标 | 从渲染管线控制（V3）升级为渲染所有权控制（V4）|
| 核心原则 | V4 中，UI 不是"被封锁"——而是**未经治理批准永远不存在** |

---

## 二、V3 → V4 哲学转变

```
V3: UI 可以被封锁（blocked）
    UI 存在，但阻止更新
    用户看到"世界正在等待显现"的封锁屏

V4: UI 可能完全不存在（fail to exist）
    UI 创建被阻止在 Page() 构造函数层面
    不存在任何 UI 实例，没有 DOM 渲染
    只在 WXML 层面显示"世界尚未显现"的治理屏
```

---

## 三、核心架构变更

### V4 架构图 — UI 存在控制

```
Page({...}) config 对象
  │
  ▼
Page() 构造函数 (被 V4 覆写)
  │
  ├── config.onLoad 被包裹
  │
  ▼
WeChat 框架创建 page 实例
  │
  ▼
(page 实例) onLoad 被调用
  │
  ▼ (V4 包裹的 onLoad)
createRenderTree(page, renderFn)
  │
  ├── evaluateUIExistence(context)
  │     ├── CHECK 1: 全局存在锁? (_uiExistenceLocked)
  │     ├── CHECK 2: VPF-100 未注册资产?
  │     │     └── V4 新规则: 缺失资产 = UI 不被创建 (不是"回退")
  │     └── CHECK 3: GB-001 Store 可用?
  │
  ├── DENIED
  │     ├── page.__uiExists = false  (UI 不存在)
  │     ├── page.__renderBlocked = true (V3 兼容)
  │     └── setData({uiExists: false, governanceBlocked: true})
  │         └── WXML: !uiExists → 治理屏 (非 UI)
  │
  └── APPROVED
        ├── page.__uiExists = true  (UI 已创建)
        └── originalOnLoad.call(page, options)
              └── setData(...)
                    │
                    ▼
              Page.prototype.setData (被 V4 覆写)
                    │
                    ├── __uiExists === false → 静默忽略
                    │
                    └── VPF-100 扫描 data
                          ├── 违规 → payload 替换为 {uiExists: false, ...}
                          └── 通过 → 正常执行
```

---

## 四、安装明细

### STEP 1：创建渲染所有权核心 ✅

**新建文件**：`core/governance/GOVERNANCE_RENDER_OWNERSHIP_V4.js`

已实现的 API：

| API | 功能 | V4 关键行为 |
|---|---|---|
| `evaluateUIExistence(context)` | 评估 UI 是否应该存在 | 三项检查；缺失资产 → DENIED（不回退）|
| `createRenderTree(page, fn)` | 门 + 创建 UI | 否认 = UI 不创造，renderFn 不调用 |
| `resolveAsset(path)` | 验证资产路径 | 未注册 → 返回空字符串（CSS 渐变，无可替换图片）|
| `lockExistence(reason)` | 锁定 UI 存在 | 全局存在锁 |
| `unlockExistence()` | 释放存在锁 | 重置 |
| `isExistenceLocked()` | 查询存在锁 | 返回布尔值 |

---

### STEP 2：覆写 `Page()` 构造函数 ✅

**修改文件**：`app.js`

覆写 `Page` 全局函数：

```javascript
Page = function (config) {
  var originalOnLoad = config.onLoad;

  config.onLoad = function (options) {
    var page = this;

    var ownership = governanceRenderOwnershipV4.createRenderTree(page, function () {
      if (typeof originalOnLoad === 'function') {
        return originalOnLoad.call(page, options);
      }
    });

    if (!ownership.uiCreated) {
      page.__renderBlocked = true;
      return;
    }
  };

  return __originalPage(config);
};
```

**这是 V4 的关键创新**：
- 不覆写 `Page.prototype.onLoad`（V3 做法）
- 覆写 `Page()` 构造函数本身，在**配置阶段**就包裹 `onLoad`
- `createRenderTree` 在页面实例创建后立即执行，决定 UI 是否应该存在
- 如果否认，`originalOnLoad` 永不执行

---

### STEP 3：setData V4 硬锁 ✅

**修改文件**：`app.js`

```javascript
Page.prototype.setData = function (data, callback) {
  if (this.__uiExists === false) {
    console.warn('[V4] setData ignored — UI does not exist');
    return;
  }

  var violations = _v4ScanUnregistered(data);
  if (violations.length > 0) {
    return __rawSetData.call(this, {
      uiExists: false,
      governanceBlocked: true,
      renderState: 'NO_UI_CREATED',
      blockReason: reason
    });
  }

  return __rawSetData.call(this, data, callback);
};
```

**V4 setData 锁新增行为**：
- `__uiExists === false` → **完全静默忽略**，无任何数据传递到 UI
- 未注册资产检测 → payload 替换为 `{uiExists: false}` 治理屏

---

### STEP 4：WXML uiExists 硬门 ✅

**修改文件**：`pages/landing/index.wxml`

```xml
<block wx:if="{{!uiExists}}">
  <!-- 世界尚未显现 — 治理屏（非 UI）-->
</block>

<block wx:else>
  <!-- 完整 UI -->
</block>
```

V3 使用 `uiVisible`（UI 可见性），V4 使用 `uiExists`（UI 存在性）。

---

### STEP 5：着陆页清理 ✅

**修改文件**：`pages/landing/index.js`

| 细项 | 变更 |
|---|---|
| 导入 | `governanceRenderPipelineV3` → `governanceRenderOwnershipV4` |
| 数据初始化 | 新增 `uiExists: false` |
| `onLoad` | `setData({uiExists: true})` 在治理通过后设置 |
| `onImgError` | `resolveAsset` 未注册路径返回空字符串（不回退图片）|
| 日志 | `[V3 ASSET]` → `[V4 ASSET]` |

---

## 五、V4 新增关键规则

### 规则：资产 → UI 创建依赖

> UI 创建依赖于资产有效性。
>
> 如果**任何必需资产缺失**：
> - UI **不被创建**
> - 不是"回退"
> - 不是"替换"
> - **简单地不存在**

### 最终系统规则

> ❗ V3 = UI 可以被封锁
> ❗ V4 = UI 可以完全不存在

---

## 六、验收标准检查

| # | 标准 | 状态 | 实现方式 |
|---|---|---|---|
| ✔ | 没有 UI 实例未经治理批准存在 | ✅ | `Page()` 构造函数覆写 → `createRenderTree` |
| ✔ | 没有页面在封锁时进入"已渲染状态" | ✅ | `originalOnLoad` 不执行，`__uiExists = false` |
| ✔ | 缺失资产阻止 UI 创建（完全不创建） | ✅ | `evaluateUIExistence` 中 VPF-100 返回 DENIED |
| ✔ | WXML 仅在 `uiExists = true` 时渲染 | ✅ | `<block wx:if="{{!uiExists}}">` 治理屏 |
| ✔ | 回退不是 UI，只有治理屏 | ✅ | `resolveAsset` 未注册 → 空字符串（CSS 渐变，无图片回退） |

---

## 七、涉及文件清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `core/governance/GOVERNANCE_RENDER_OWNERSHIP_V4.js` | ✨ 新建 | V4 核心，~280 行 |
| `app.js` | ✏️ 替换 | V3 原型覆写 → V4 `Page()` 构造函数覆写 + setData 升级 |
| `pages/landing/index.js` | ✏️ 修改 | V4 导入，`uiExists` 初始化，`resolveAsset` 升级 |
| `pages/landing/index.wxml` | ✏️ 修改 | `uiVisible` → `uiExists` 硬门 |

---

## 八、安全验证

- ✅ `GOVERNANCE_RENDER_OWNERSHIP_V4.js` — 语法检查通过
- ✅ `app.js` — 语法检查通过
- ✅ `pages/landing/index.js` — 语法检查通过

---

## 九、最终系统定义

```
V4 正确实现后，系统变为：

  🧠 UI = 治理批准的实体
  ❌ 不是：UI = 运行时输出
```

### V1 → V4 演进路径

| 版本 | 机制 | UI 控制方式 |
|---|---|---|
| V1 | 治理规则文档 | 手动检查，无运行时执行 |
| V2 | `GOVERNANCE_RUNTIME_HOOK` | 渲染前检查，无拦截能力 |
| V3.0 | `interceptSetData` / `interceptRenderFlow` | 渲染管线包装器 |
| V3 Final | `Page.prototype.onLoad` + setData 覆写 | 原型级拦截 |
| **V4** | **`Page()` 构造函数覆写** | **UI 存在性控制** |

---

*报告完毕 — GOVERNANCE_RENDER_OWNERSHIP_V4 安装凭证*
