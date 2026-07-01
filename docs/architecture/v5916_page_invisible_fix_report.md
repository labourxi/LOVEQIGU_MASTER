# V5.9.16 — 页面不可见问题根因分析报告

## 问题现象

执行完三个页面（个人中心 / 权益中心 / 探索首页）的代码修改后，页面在开发者工具中看起来没有任何变化。"我的"页面点击后提示"页面未开放"。

## 根因分析

### 根因一：底部导航指向旧页面路径

`components/user-bottom-nav/index.js` 中的路径全部指向了旧的页面文件夹：

| 按钮 | 旧路径（错误） | 新路径（正确） |
|------|--------------|--------------|
| 探索 | `/pages/explore-map/index` | `/pages/index/index` |
| 信物 | `/pages/relic-archive/index` | `/pages/relic/index` |
| 权益 | `/pages/rights-center/index` | `/pages/rights/index` |
| 我的 | `/pages/profile/index` | `/pages/my/index` |

这意味着每次点击底部导航，都跳转到了旧页面，而我们的修改是在新页面上。

### 根因二：安全导航白名单未注册新页面

`utils/safe-interaction.js` 中有一个 `REGISTERED_PAGES` 白名单数组，用于在 `navigateTo` 前预检查页面是否存在。即使底部导航路径改对了，`safeNavigate()` 也会在第 89 行拦截：
```js
if (!isPageRegistered(url)) {
    console.warn('⚠️ XR page not found, fallback UI — url:', url);
    showFallbackToast(options.fallbackTitle || '页面暂未开放');
    return false;
}
```

新页面 `/pages/my/index`、`/pages/rights/index`、`/pages/relic/index` 不在白名单中，因此被拦截并弹出"页面未开放"的 toast。

### 根因三：Tab 路径白名单未更新

`utils/user-tab-nav.js` 的 `TAB_PATHS` 用于判断导航方式是 `wx.reLaunch`（Tab 切换）还是 `wx.navigateTo`（普通跳转）。新页面未加入该数组，虽然不影响功能，但会导致导航行为不一致。

## 修复内容

### 文件 1: `components/user-bottom-nav/index.js`

**修改**：将 4 个底部导航按钮的 `path` 从旧路径改为新路径。

```diff
- { key: 'map', label: '探索', path: '/pages/explore-map/index' },
- { key: 'relic', label: '信物', path: '/pages/relic-archive/index' },
- { key: 'rights', label: '权益', path: '/pages/rights-center/index' },
- { key: 'me', label: '我的', path: '/pages/profile/index' }
+ { key: 'map', label: '探索', path: '/pages/index/index' },
+ { key: 'relic', label: '信物', path: '/pages/relic/index' },
+ { key: 'rights', label: '权益', path: '/pages/rights/index' },
+ { key: 'me', label: '我的', path: '/pages/my/index' }
```

### 文件 2: `utils/safe-interaction.js`

**修改**：在 `REGISTERED_PAGES` 白名单末尾追加新页面路径。

```diff
+  '/pages/my/index',
+  '/pages/rights/index',
+  '/pages/relic/index',
+  '/pages/merchant/coupons/index',
+  '/pages/landing/index'
```

### 文件 3: `utils/user-tab-nav.js`

**修改**：在 `TAB_PATHS` 追加新页面路径。

```diff
+  '/pages/my/index',
+  '/pages/rights/index',
+  '/pages/relic/index'
```

## 过程中的其他发现

### WXML 三元运算符（潜在白屏风险）

在排查过程中发现 `pages/index/index.wxml` 和 `pages/relic/index.wxml` 中使用了 WXML 不支持的三元运算符：

```wxml
<!-- 错误：WXML 不支持三元运算符 -->
<view style="width: {{_storeTotalCount > 0 ? (_storeVisitedCount / _storeTotalCount * 100) : 0}}%;"></view>
```

修复方式：将计算逻辑移到 JS 侧预计算，WXML 只引用预计算好的值。

```wxml
<!-- 正确：WXML 只引用预计算值 -->
<view style="width: {{_storeProgressPercent}}%;"></view>
```

### Store 的 activeTab 与页面覆盖逻辑

`world_runtime_store.js` 中的 `buildMyRenderTree()` 返回 `activeTab: 'home'`，但页面 JS 的 `buildPageData()` 会在第 91 行覆盖为 `activeTab: 'me'`。这种设计是正确的——store 提供通用默认值，页面按需覆盖。因此 store 中的 `activeTab` 值不影响实际渲染。

## 经验教训

1. **三个白名单需要同步更新**：`app.json`（路由注册）、`safe-interaction.js`（安全导航）、`user-tab-nav.js`（Tab 导航），修改页面路径时三个文件都要改。

2. **WXML 禁止 JS 运算符**：微信小程序 WXML 不支持 `{{condition ? a : b}}`、`{{a + b}}` 等运算，所有运算必须在 JS 中预计算。

3. **Console 日志是调试的第一入口**：本次问题通过 Console 中的 `"⚠️ XR page not found, fallback UI"` 日志直接定位了根因。
