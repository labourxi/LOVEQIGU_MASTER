# SAFE ROLLBACK REPORT — 治理系统回滚报告

> 生成时间：2026-06-30
> 回滚目标：恢复原生微信小程序渲染管线
> 移除范围：V3/V4/V5 运行时治理注入层

---

## 一、回滚概要

| 项目 | 内容 |
|---|---|
| 操作 | 安全回滚 — 将着陆页恢复为原生执行模式 |
| 目标 | 移除所有治理运行时注入层，恢复纯微信小程序渲染管线 |
| 范围 | `app.js`（全局原型补丁）+ `pages/landing/`（页面代码）+ `core/governance/`（运行时模块）|

---

## 二、回滚明细

### STEP 1：删除运行时治理文件 ✅

已删除以下文件：

| 文件 | 版本 | 大小 |
|---|---|---|
| `core/governance/GOVERNANCE_RENDER_LOCK_V3.js` | V3.0 | ~12KB |
| `core/governance/GOVERNANCE_RENDER_PIPELINE_V3.js` | V3 Final | ~18KB |
| `core/governance/GOVERNANCE_RENDER_OWNERSHIP_V4.js` | V4 | ~16KB |
| `core/governance/GOVERNANCE_FRAMEWORK_RENDER_V5.js` | V5 | ~16KB |

**保留**：
- `core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` — 仅用于向后引用，未在代码中引用
- `docs/` 下的架构文档（非运行时依赖）

---

### STEP 2：移除全局原型补丁 ✅

**文件**：`app.js`

移除以下所有覆写：

| 覆写 | 位置 | 移除内容 |
|---|---|---|
| `Page()` 构造函数覆写 | 第 289-429 行 | 整个 V5 框架渲染控制节 |
| `onLoad` 包裹 | Page() 构造函数内 | 移除 onLoad 包裹逻辑 |
| `onShow` 框架门 | Page() 构造函数内 | 移除 `interceptRenderEntry` 调用 |
| `Component()` 构造函数覆写 | Component 节 | 移除 `blockComponentMount` 调用 |
| `Page.prototype.setData` 覆写 | setData 节 | 移除所有 setData 拦截逻辑 |
| `__rawSetData` 引用 | 全局 | 移除 |
| `_v4ScanUnregistered` 辅助函数 | 全局 | 移除 |
| `governanceFrameworkRenderV5` 导入 | 全局 | 移除 |

**恢复后**：`app.js` 中 `App()` 定义之前只有引导序列（boot sequence）+ entry system + AR engine，无任何治理相关代码。

---

### STEP 3：恢复原生着陆页 JS ✅

**文件**：`pages/landing/index.js`

移除的内容：

| 细项 | 移除 |
|---|---|
| `governanceFrameworkRenderV5` 导入 | V5 模块引用 |
| `governanceHook` 导入 | V2 钩子引用 |
| 数据字段 `governanceBlocked` | 治理封锁标志 |
| 数据字段 `governanceReason` | 治理封锁原因 |
| 数据字段 `governanceGate` | 治理门编号 |
| 数据字段 `landingBlocked` | 着陆页封锁标志 |
| 数据字段 `frameworkBlocked` | V5 框架封锁标志 |
| 数据字段 `uiExists` | V4 存在性标志 |
| 数据字段 `uiVisible` | V3 可见性标志 |
| `setData({uiVisible: true, uiExists: true})` | onLoad 中治理 setData |
| `resolveAsset()` 调用 | onImgError 中的治理资产解析 |
| 治理相关日志 | `[V3 ASSET]`, `[V4 ASSET]`, `[V5 ASSET]` |

保留的核心逻辑：

| 功能 | 保留 |
|---|---|
| `worldRuntimeStore` 导入 | ✅ 运行时存储 |
| `safeNavigate` 导入 | ✅ 安全导航 |
| `getAssetMap()` | ✅ 资产映射 |
| `buildCarouselItems()` | ✅ 轮播项构建 |
| `buildStats()` | ✅ 统计数据构建 |
| `getUserType()` | ✅ 用户类型判断 |
| `onLoad` | ✅ 原生生命周期 |
| `_bindWorldData()` | ✅ 数据绑定 |
| `onShow` | ✅ 原生生命周期 |
| `onReady` | ✅ 原生生命周期 |
| `onImgError` | ✅ 原生错误处理（直接回退） |
| `_initPage()` | ✅ 页面初始化 |
| `onWechatLogin` | ✅ 登录处理 |
| `onEnterExplore` / `_enterExplore` | ✅ 探索导航 |

---

### STEP 4：恢复 WXML 渲染 ✅

**文件**：`pages/landing/index.wxml`

| 移除 | 保留 |
|---|---|
| V5 `frameworkBlocked` 外层门 | 骨架加载（`loading \|\| !uiReady`） |
| V4 `uiExists` 中层门 | 完整 UI 内容 |
| 治理封锁屏（3 个版本） | 主内容区域 |

原始结构恢复：

```xml
<view class="lp-page">
  <view wx:if="{{loading || !uiReady}}">
    <!-- 骨架加载 -->
  </view>
  <block wx:else>
    <!-- 完整 UI -->
  </block>
</view>
<!-- 登录按钮（独立条件） -->
```

---

## 三、验收标准检查

| # | 标准 | 状态 | 验证方式 |
|---|---|---|---|
| ✔ | 页面在没有治理系统的情况下渲染 | ✅ | 无治理模块加载，无原型覆写 |
| ✔ | 没有原型覆写存在 | ✅ | `Page()` / `Component()` / `setData` 已恢复原生 |
| ✔ | setData 行为原生 | ✅ | 无拦截层 |
| ✔ | WXML 正常渲染 | ✅ | 无 `frameworkBlocked` / `uiExists` 门 |
| ✔ | 缺失资产不阻止 UI | ✅ | `onImgError` 直接回退，不调用 `resolveAsset` |
| ✔ | 即使资产加载失败，着陆页完全可见 | ✅ | CSS 渐变作为最终回退 |

---

## 四、文件状态汇总

| 文件 | 状态 | 说明 |
|---|---|---|
| `app.js` | ✏️ 修改 | 移除所有治理原型覆写（~140 行删除） |
| `pages/landing/index.js` | ✏️ 修改 | 移除治理导入 + 数据字段 + 拦截逻辑（~80 行删除） |
| `pages/landing/index.wxml` | ✏️ 修改 | 移除 3 层治理门（~30 行删除） |
| `core/governance/GOVERNANCE_FRAMEWORK_RENDER_V5.js` | ❌ 删除 | V5 框架渲染核心 |
| `core/governance/GOVERNANCE_RENDER_OWNERSHIP_V4.js` | ❌ 删除 | V4 存在性控制 |
| `core/governance/GOVERNANCE_RENDER_PIPELINE_V3.js` | ❌ 删除 | V3 管线控制 |
| `core/governance/GOVERNANCE_RENDER_LOCK_V3.js` | ❌ 删除 | V3.0 锁核心 |
| `core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | ✅ 保留 | 向后引用（未在代码中引用） |

---

## 五、安全验证

- ✅ `app.js` — 语法检查通过
- ✅ `pages/landing/index.js` — 语法检查通过

---

## 六、最终系统状态

```
回滚完成后，系统状态变为：

  🧠 UI = 原生微信渲染输出
  ❌ 不是：UI = 治理控制系统

渲染管线：
  Page(config) → 原生 onLoad → 原生 setData → WXML diff → 原生渲染
  无拦截、无门控、无存在性检查

资产加载：
  onImgError → log → fallback image → CSS gradient (zero-block)
  资产缺失不影响 UI 渲染
```

---

*报告完毕 — 安全回滚凭证*
