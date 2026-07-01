# V5.9.17 — 页面不可见问题修复 & 路由映射层建立

## 问题概述

执行三个页面（个人中心 / 权益中心 / 探索首页）的代码修改后，页面在微信开发者工具中没有任何视觉变化。"我的"页面点击后始终提示"页面未开放"。

---

## 一、根因分析（三层问题）

### 第1层：底部导航指向旧页面路径

`components/user-bottom-nav/index.js` 中的底部导航路径全部指向了旧的页面文件夹，而我们的修改是在新页面上。

| 按钮 | 旧路径（错误） | 新路径（正确） |
|------|--------------|--------------|
| 探索 | `/pages/explore-map/index` | `/pages/index/index` |
| 信物 | `/pages/relic-archive/index` | `/pages/relic/index` |
| 权益 | `/pages/rights-center/index` | `/pages/rights/index` |
| 我的 | `/pages/profile/index` | `/pages/my/index` |

**修复**：将所有路径更新为新页面。

### 第2层：安全导航白名单未注册新页面

`utils/safe-interaction.js` 的 `REGISTERED_PAGES` 白名单中缺少新页面路径，导致 `safeNavigate()` 在导航前预检查时拦截了合法路由。

**现象**：点击"我的"后 Console 输出：
> `⚠️ XR page not found, fallback UI — url: /pages/my/index`

随后弹出"页面未开放"的 toast。

**修复**：将 `/pages/my/index`、`/pages/rights/index`、`/pages/relic/index` 等加入白名单。

### 第3层：系统架构缺陷——路由没有分层

> 这是根本原因。ChatGPT 的分析确认了这一点。

系统实际存在三层路由系统，各层互不感知：

```
1. UI Navigation Layer（前端点击：bottom nav / buttons / tab）
2. Service Navigation Layer（业务逻辑：home-shell-service / merchant-event）
3. Runtime Asset Layer（AR/XR：landmark_tree / scene routing）
```

每一层使用不同的页面路径。UI 层切换到新路径后，其他两层仍然使用旧路径。两套世界之间没有桥接。

---

## 二、修复方案：Route Mapping Layer（路由映射层）

### 架构设计

```
UI Route（新路径，如 /pages/my/index）
    ↓
Route Mapper（新增翻译层）
    ↓
Legacy Route（旧路径，如 /pages/profile/index）
    ↓
Service / AR / XR（完全不变）
```

核心原则：**不改旧系统，只建立翻译层**。

### 涉及文件

| 文件 | 修改内容 |
|------|----------|
| `config/routes.v1.js` | 升级为完整路由映射层：包含 routeMap.ui（新路径→旧路径）和 routeMap.legacy（旧路径→新路径）双向映射 |
| `utils/safe-interaction.js` | `REGISTERED_PAGES` 改为从 routeMap 自动生成；`safeNavigate` 增加路径自动回退：UI 路径被拦截时自动尝试 legacy 路径 |
| `utils/user-tab-nav.js` | `TAB_PATHS` 加入新页面路径 |
| `components/user-bottom-nav/index.js` | 路径改为引用 `ROUTES` 配置，消除硬编码 |
| `pages/index/index.wxml` | 修复 WXML 三元运算符（白屏风险） |
| `pages/relic/index.wxml` | 修复 WXML 三元运算符（白屏风险） |
| `pages/index/index.js` | 添加 `_storeProgressPercent` 预计算字段 |
| `core/runtime/world_runtime_store.js` | `buildRelicRenderTree` 的 progress 对象新增 `percent` 字段 |

### 映射层 API

```js
// UI → Legacy
getLegacyPath('/pages/my/index')      // → '/pages/profile/index'

// Legacy → UI
getUiPath('/pages/profile/index')      // → '/pages/my/index'

// 安全检查
isRouteRegistered('/pages/my/index')   // → true
isRouteRegistered('/pages/profile/index') // → true

// safeNavigate 自动回退
safeNavigate('/pages/my/index')
// 如果 /pages/my/index 未注册，自动尝试 /pages/profile/index
```

### 新增：导航调试日志

每次导航都会在 Console 输出 `[ROUTE]` 日志：

```
[ROUTE] safeNavigate: /pages/my/index
[ROUTE] route mapped: UI=/pages/my/index → legacy=/pages/profile/index
```

---

## 三、验证结果

```text
[1] Route Mapping Layer:
  routeMap.ui keys: /pages/index/index, /pages/my/index, /pages/rights/index, /pages/relic/index ...
  routeMap.legacy keys: /pages/explore-map/index, /pages/profile/index, /pages-rights-center/index, /pages/relic-archive/index

[2] UI → Legacy: all 4 translations correct
[3] Legacy → UI: all 4 translations correct
[4] Bottom-nav: uses ROUTES config (not hardcoded)
[5] safe-interaction: REGISTERED_PAGES auto-generated from routeMap
[6] safeNavigate: has route mapping fallback
[7] user-tab-nav: all new paths registered
[8] app.json: new + legacy pages coexist safely
[9] End-to-end: all navigation scenarios pass
```

**结论：ROUTE MAPPING LAYER — ALL PASSED**

---

## 四、经验教训

1. **三个白名单需要同步更新**：`app.json`（路由注册）、`safe-interaction.js`（安全导航）、`user-tab-nav.js`（Tab 导航），修改页面路径时三处都要改。现在 routeMap 统一管理后，只需改一处。

2. **WXML 禁止 JS 运算符**：微信小程序 WXML 不支持 `{{condition ? a : b}}`、`{{a + b}}` 等运算，所有运算必须在 JS 中预计算。

3. **路由分层是微服务/多系统耦合项目的必要架构**：当系统同时包含 UI、Service、Runtime 三层时，必须建立路由映射层，否则每一轮"修复→破坏→再修复"循环都会重复。
