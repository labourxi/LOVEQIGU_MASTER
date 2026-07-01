# LANDING PAGE V1 — 完整文档

> **文件位置:** `apps/miniapp/pages/landing/`
> **页面 ID:** `PAGE_01_LANDING`
> **世界:** AIGU VALLEY · 爱企谷游离之域
> **系统:** V7 CIVILIZATION OS — AIGU VALLEY WORLD ENTRY PAGE
> **导出时间:** 2026-06-30

---

## 目录

1. [文件结构](#1-文件结构)
2. [`index.json` — 页面配置](#2-indexjson--页面配置)
3. [`index.js` — 页面逻辑](#3-indexjs--页面逻辑)
4. [`index.wxml` — 页面模板](#4-indexwxml--页面模板)
5. [`index.wxss` — 页面样式](#5-indexwxss--页面样式)
6. [数据绑定对照表](#6-数据绑定对照表)
7. [状态机](#7-状态机)
8. [动画系统](#8-动画系统)
9. [设计令牌](#9-设计令牌)
10. [核心规格验证清单](#10-核心规格验证清单)

---

## 1. 文件结构

```
pages/landing/
├── index.json     (6 行)  — 页面配置
├── index.js       (321 行) — 页面逻辑
├── index.wxml     (160 行) — 页面模板
└── index.wxss     (621 行) — 页面样式
```

---

## 2. `index.json` — 页面配置

```json
{
  "navigationStyle": "custom",
  "backgroundColor": "#0A1A14",
  "usingComponents": {}
}
```

| 字段 | 值 | 说明 |
|------|-----|------|
| `navigationStyle` | `"custom"` | 自定义导航栏，隐藏微信原生导航 |
| `backgroundColor` | `"#0A1A14"` | 深林黑背景色 |
| `usingComponents` | `{}` | 无依赖组件 |

---

## 3. `index.js` — 页面逻辑

### 3.1 依赖

```javascript
var store = require('../../core/runtime/world_runtime_store');
var safeNavigate = require('../../utils/safe-interaction').safeNavigate;
```

- `world_runtime_store` — 所有数据绑定的来源
- `safe-interaction` — 安全导航守卫（防重复跳转、错误回退）

### 3.2 模块级常量和状态

```javascript
var PAGE_ID = store.PAGE_IDS.LANDING || 'PAGE_01_LANDING';
var _enteredOnce = false;      // 防止 onLoad 重复进入
var _navigatingAway = false;   // 防止重复导航锁
```

### 3.3 工具函数

#### `getAssetMap()`

从 visual injector 获取 ASSET_MAP，失败时使用硬编码 fallback。

```javascript
function getAssetMap() { ... }
```

**Fallback 映射:**

| Key | 路径 |
|-----|------|
| `aigugu_landing_bg` | `/assets/scene/aiqigu_landing_v1.jpg` |
| `landing_bg` | `/assets/scene/aiqigu_landing_v1.jpg` |
| `scene_aiqigu_street` | `/assets/scene/aiqigu_street_v1.jpg` |
| `portal_mist_layer` | `/assets/bg/portal_mist_v1.png` |
| `portal_ring_gold` | `/assets/ui/portal_ring_gold_v1.png` |
| `icon_wechat_login_gold` | `/assets/icon/wechat_login_gold_v1.png` |
| `ui_explore_card_glass` | `/assets/ui/explore_card_glass_v1.png` |
| `ui_stat_panel_gold_glass` | `/assets/ui/stat_panel_gold_glass_v1.png` |

#### `buildCarouselItems()`

从 `store.getAllPoints()` 构建 10 个探索节点数据。如果 <10 个节点，输出 INVALID 警告。

**每个 carouselItem 结构:**

```javascript
{
  id:              string,  // EP_001 ~ EP_010
  name:            string,  // 节点名称
  subtitle:        string,  // 副标题
  region:          string,  // 区域（新规范字段）
  type:            string,  // 节点类型（新规范字段）
  themeColor:      string,  // 主题色, 默认 '#C8A24A'
  status:          'discovered' | 'unlocked' | 'locked',
  statusLabel:     '已探索' | '可探索' | '未解锁',
  decorativeGroup: string,  // 装饰分组
  story:           string   // 故事文本（新规范字段）
}
```

#### `buildStats()`

从 `store.getUserWorldState()` 绑定 4 个统计值。

| 返回字段 | Store 来源 | 说明 |
|----------|-----------|------|
| `explorationCount` | `state.visitedPoints.length` | 已访问探索点数量 |
| `relicCount` | `state.discoveredRelics` | 已发现信物数量 |
| `couponCount` | `state.claimedRights` | 已领取权益数量 |
| `progress` | `state.journeyProgress` | 探索进度百分比（0–100） |

#### `getUserType()`

根据用户状态返回用户类型。

| 返回值 | 条件 |
|--------|------|
| `'guest'` | 未进入世界 / 无用户 |
| `'logged_in'` | `hasWorldEntered()` 为 true |
| `'active_explorer'` | visitedPoints > 3 或 discoveredRelics > 2 |

### 3.4 Page 对象

#### `data`（初始数据）

```javascript
{
  pageId:         PAGE_ID,           // 'PAGE_01_LANDING'
  loading:        true,              // 骨架屏状态
  userType:       'guest',           // 用户类型
  assetMap:       getAssetMap(),     // 资源映射表
  stats:          buildStats(),      // 统计数据
  carouselItems:  buildCarouselItems() // 探索轮播数据
}
```

#### 生命周期

| 方法 | 行为 |
|------|------|
| `onLoad(options)` | ① 检查 `__BOOT_READY__` → ② 检查 `hasWorldEntered` → ③ 检查 `_enteredOnce` → ④ 初始化页面或跳转探索页 |
| `onShow()` | 重复 entry gate 检查，刷新数据 |
| `onReady()` | 标记 `__pageReady`，延迟设置 `__UI_FROZEN__ = true` |

#### 事件处理

| 事件 | 处理函数 | 行为 |
|------|---------|------|
| 微信一键登录 | `onWechatLogin` | 显示 loading → 模拟登录 → `markWorldEntered()` → 导航至 `/pages/index/index` |
| 进入探索 | `onEnterExplore` | 直接调用 `_enterExplore()` |
| 探索点点击 | `onCarouselTap(e)` | 从 `e.currentTarget.dataset.index` 获取索引 → 导航至探索页 |
| 内部导航 | `_enterExplore()` | 防重复导航锁 → `safeNavigate('/pages/index/index', { replace: true })` → 失败时 `wx.reLaunch` |

#### `_initPage()`

初始化页面数据的核心方法。在 `onLoad` 和 `onShow` 中调用。

```javascript
_initPage: function () {
  var userType = getUserType();
  var stats = buildStats();
  var carouselItems = buildCarouselItems();
  var assetMap = getAssetMap();

  // V7 VALIDATION
  if (!assetMap.aigugu_landing_bg) {
    console.error('[PAGE_01_LANDING] INVALID: no background asset (aigugu_landing_bg)');
  }
  if (carouselItems.length < 10) {
    console.error('[PAGE_01_LANDING] INVALID: only ' + carouselItems.length + ' nodes (need 10)');
  }

  this.setData({ loading: false, userType, stats, carouselItems, assetMap });
}
```

---

## 4. `index.wxml` — 页面模板

### 4.1 整体结构

```
<view class="lp-page">
  ├── [骨架屏]  <view wx:if="{{loading}}">
  │   ├── lp-skeleton__bg
  │   ├── lp-skeleton__title
  │   ├── lp-skeleton__stats
  │   └── lp-skeleton__cta
  │
  └── [主内容]  <block wx:else>
      │
      ├── LAYER 1: <view class="lp-bg">
      │   ├── lp-bg__scene        (background-image: {{assetMap.aigugu_landing_bg}})
      │   ├── lp-bg__depth        (景深渐变层)
      │   ├── lp-bg__fog ×3       (雾层，延迟 0s/10s/20s)
      │   ├── lp-bg__warm-light   (暖金色光源)
      │   └── lp-bg__light-rays   (金色光柱)
      │
      ├── LAYER 2: <view class="lp-intro">
      │   ├── lp-intro__portal
      │   │   ├── lp-intro__ring       (3 层旋转光环)
      │   │   ├── lp-intro__core        (金色核心光点)
      │   │   └── lp-intro__particles   (浮游粒子)
      │   ├── lp-intro__title      "爱企谷"
      │   ├── lp-intro__roman      "AIGU VALLEY"
      │   └── lp-intro__verse      "游离之域 · 世界正在显现"
      │
      ├── LAYER 3: <view class="lp-stats">
      │   └── <view class="lp-stats__grid"> (2×2)
      │       ├── <lp-stat-card>  {{stats.explorationCount}}  探索点已启
      │       ├── <lp-stat-card>  {{stats.relicCount}}         信物已得
      │       ├── <lp-stat-card>  {{stats.couponCount}}        权益已领
      │       └── <lp-stat-card>  {{stats.progress}}%          探索进度
      │
      ├── LAYER 4: <view class="lp-carousel-wrap">
      │   ├── lp-carousel-label   "十个世界节点"
      │   └── <scroll-view scroll-x>
      │       └── <view wx:for="{{carouselItems}}" wx:key="id">
      │           ├── lp-carousel__dot       (圆点，背景色 = item.themeColor)
      │           ├── lp-carousel__name      {{item.name}}
      │           ├── lp-carousel__subtitle  {{item.subtitle}}  (条件显示)
      │           ├── lp-carousel__region    {{item.region}}    (条件显示)
      │           └── lp-carousel__status    {{item.statusLabel}}
      │
      └── LAYER 5+6: <view class="lp-actions">
          ├── [guest]  <button> 微信一键登录
          │   └── <view class="lp-cta__hint"> "登录后进入探索世界"
          └── [logged_in]  <button> 进入探索
              └── <view class="lp-cta__hint"> (动态提示文字)
</view>

<!-- P0: 微信一键登录 — 固定底部覆盖层 -->
<block wx:if="{{!loading && userType === 'guest'}}">
  <view class="lp-login-fixed">
    <button class="lp-login-fixed__btn"> 微信一键登录 </button>
    <view class="lp-login-fixed__hint"> "登录后进入爱企谷探索世界" </view>
  </view>
</block>
```

### 4.2 各层定位与 z-index

| 层 | CSS 类 | 定位 | z-index |
|----|--------|------|---------|
| 背景场景 | `lp-bg` | `position: fixed; inset: 0` | 0 |
| 世界入口 | `lp-intro` | `position: relative` | 1 |
| 数据面板 | `lp-stats` | `position: relative` | 1 |
| 探索轮播 | `lp-carousel-wrap` | `position: relative` | 1 |
| 行为层 | `lp-actions` | `position: relative` | 1 |
| P0 登录 CTA | `lp-login-fixed` | `position: fixed; bottom: 0` | 100 |

### 4.3 条件渲染

| 条件 | 显示内容 |
|------|----------|
| `{{loading}}` | 骨架屏（4 个 placeholder） |
| `!loading && userType === 'guest'` | 内容区 + 固定底部"微信一键登录" |
| `!loading && userType !== 'guest'` | 内容区 + "进入探索"CTA |

---

## 5. `index.wxss` — 页面样式

### 5.1 设计令牌

```
Primary:   #0A1A14 (deep forest black)
Accent:    #C8A24A (gold light)
Secondary: rgba(200, 162, 74, 0.X)
Text:      rgba(232, 224, 208, 0.X) (fog white)
```

### 5.2 视觉风格规则

| 规则 | 实现 |
|------|------|
| 雾层深度叠加 | 3 组 radial-gradient 雾层 + 渐隐 depth 层 |
| 金色强调色 | `#C8A24A` 用于所有金色元素、边框、文字、发光 |
| 暖金色光线 | 底部径向渐变 + 斜向线性渐变光柱 |
| 玻璃拟态 | `backdrop-filter: blur()` + 半透明背景 + 微妙边框 |
| 垂直层级 | `flex-direction: column` + padding/间距 |
| 非扁平卡片 | `backdrop-filter` + `box-shadow` + 圆角 |
| 非游戏 UI | 无霓虹、卡通、像素、街机元素 |
| P0 固定底部 | `position: fixed; bottom: 0; z-index: 100` + 渐变背景 |

### 5.3 禁止样式清单

```css
/* FORBIDDEN in this file */
- flat backgrounds
- game UI (neon, cartoon, pixel, arcade)
- flat card style
- hardcoded asset paths
```

### 5.4 完整 CSS 类名索引

| CSS 类 | 用途 | 数量 |
|--------|------|------|
| `.lp-page` | 页面容器 | 1 |
| `.lp-skeleton` / `__bg` / `__title` / `__stats` / `__cta` | 骨架屏 | 5 |
| `.lp-bg` / `__scene` / `__depth` / `__fog` / `__warm-light` / `__light-rays` | 背景场景 | 6 |
| `.lp-intro` / `__portal` / `__ring` / `__core` / `__particles` / `__title` / `__roman` / `__verse` | 世界入口 | 8 |
| `.lp-stats` / `__grid` | 数据面板容器 | 2 |
| `.lp-stat-card` / `__value` / `__label` | 统计卡片 | 3 |
| `.lp-carousel-wrap` / `__label` / `__item` / `__dot` / `__name` / `__subtitle` / `__status` / `__region` | 探索轮播 | 9 |
| `.lp-carousel__item--unlocked` / `--active` / `--discovered` / `--locked` | 节点状态变体 | 4 |
| `.lp-actions` / `.lp-cta` / `--primary` / `__icon` / `__label` / `__hint` | 行为层 | 6 |
| `.lp-login-fixed` / `__btn` / `__icon` / `__label` / `__hint` | P0 固定 CTA | 5 |

---

## 6. 数据绑定对照表

| 模板绑定 | 来源函数 | 数据路径 |
|----------|----------|---------|
| `{{assetMap.aigugu_landing_bg}}` | `getAssetMap()` | 背景场景 URL |
| `{{stats.explorationCount}}` | `buildStats()` | `store.getUserWorldState().visitedPoints.length` |
| `{{stats.relicCount}}` | `buildStats()` | `store.getUserWorldState().discoveredRelics` |
| `{{stats.couponCount}}` | `buildStats()` | `store.getUserWorldState().claimedRights` |
| `{{stats.progress}}` | `buildStats()` | `store.getUserWorldState().journeyProgress` |
| `{{carouselItems}}` | `buildCarouselItems()` | `store.getAllPoints()` 映射为 10 个节点 |
| `{{item.themeColor}}` | `buildCarouselItems()` | 每个节点的主题色 |
| `{{item.statusLabel}}` | `buildCarouselItems()` | 状态中文标签 |
| `{{userType}}` | `getUserType()` | `'guest'` / `'logged_in'` / `'active_explorer'` |

---

## 7. 状态机

```
                ┌─────────────┐
                │   guest     │  ← 未登录用户
                └──────┬──────┘
                       │ 微信一键登录
                       ▼
                ┌─────────────┐
                │ logged_in   │  ← 已登录、轻度探索
                └──────┬──────┘
                       │ 探索 > 3 点 或 信物 > 2
                       ▼
                ┌─────────────┐
                │ active_     │  ← 深度探索者
                │ explorer    │
                └─────────────┘
```

Entry gate 流程:

```
APP START
  │
  ├── hasWorldEntered() === true  → 直接跳转探索页（永久绕过 landing）
  │
  └── hasWorldEntered() === false → 展示 landing 页面
        │
        └── 用户点击"微信一键登录"
              │
              ├── markWorldEntered()    (锁死 entry gate)
              └── navigateTo(explore)   (replace 模式)
```

---

## 8. 动画系统

| 动画名 | 时长 | 应用元素 | 效果描述 |
|--------|------|----------|---------|
| `lp-shimmer` | 2.5s | 骨架屏 4 个元素 | 透明度脉冲闪烁（间隔 0.3s 依次） |
| `lp-fog-drift` | 30s | 3 层雾（延迟 0/10/20s） | 平移 + 缩放 + 透明度变化 |
| `lp-warm-pulse` | 8s | 暖金色光源 | 呼吸式脉动，opacity 0.4→0.8 |
| `lp-rays-shift` | 12s | 金色光柱 | 角度偏移，opacity 0.3→0.7 |
| `lp-ring-spin` | 24s/18s/12s | 3 层 Portal 光环 | 旋转动画（内外反向） |
| `lp-core-breathe` | 4s | Portal 核心光点 | 缩放 + 发光呼吸 |
| `lp-particle-drift` | 8s | 浮游粒子 | 8 方向随机飘移 |

---

## 9. 设计令牌

### 颜色

| 令牌 | 值 | 用途 |
|------|-----|------|
| 深林黑 | `#0A1A14` | 页面主背景色 |
| 金色光 | `#C8A24A` | 强调色：边框、文字、发光、按钮 |
| 金色 30% | `rgba(200, 162, 74, 0.3)` | 弱化强调元素 |
| 金色 10% | `rgba(200, 162, 74, 0.1)` | 极弱金色（边框、背景） |
| 雾白 65% | `rgba(232, 224, 208, 0.65)` | 主要文字（数值） |
| 雾白 20% | `rgba(232, 224, 208, 0.2)` | 次要文字（标签） |
| 雾白 10% | `rgba(232, 224, 208, 0.1)` | 提示文字 |

### 间距

| 令牌 | 值（rpx） | 用途 |
|------|-----------|------|
| 页面底部安全空间 | 240 | 给固定 CTA 留空间 |
| section 间距 | 48 | 各层之间 |
| 卡片内边距 | 28/16 | stat-card 内容间距 |
| 轮播项间距 | 16 | carousel item 间隔 |
| 文字间距 | 2–16 | letter-spacing 值 |

### 圆角

| 令牌 | 值（rpx） | 用途 |
|------|-----------|------|
| 卡片 | 20 | stat-card、carousel item |
| 按钮 | 48/50 | CTA 按钮（胶囊形） |
| 骨架屏副 | 8/16 | skeleton placeholder |

### 阴影

| 令牌 | 值 |
|------|-----|
| CTA 按钮发光 | `0 0 60rpx rgba(200, 162, 74, 0.04)` |
| CTA 按钮内发光 | `inset 0 0 40rpx rgba(200, 162, 74, 0.02)` |
| 玻璃卡片阴影 | `0 2rpx 20rpx rgba(200, 162, 74, 0.02)` |
| 玻璃卡片内发光 | `inset 0 0 30rpx rgba(200, 162, 74, 0.01)` |
| Portal 核心发光 | `0 0 40rpx 12rpx rgba(200, 162, 74, 0.12)` |

### z-index 体系

| 层 | z-index |
|----|---------|
| 背景场景 | 0 |
| 内容层（intro/stats/carousel/actions） | 1 |
| P0 固定 CTA | 100 |

---

## 10. 核心规格验证清单

### 已实现（通过 V7 验证）

| # | 规格 | 状态 | 实现位置 |
|---|------|------|----------|
| 1 | 背景使用 `ASSET_MAP.aigugu_landing_bg` | ✅ | WXML 行 45: `background-image: url({{assetMap.aigugu_landing_bg}})` |
| 2 | 雾层 + 景深 + 暖金色光线 | ✅ | WXSS 行 94–174: 6 个背景子层 |
| 3 | 世界入口介绍 | ✅ | WXML 行 58–67: portal + title + roman + verse |
| 4 | 统计数据从 store 绑定（无硬编码） | ✅ | JS 行 111–124: `buildStats()` → 4 个 store 字段 |
| 5 | 10 个探索节点（seed_data） | ✅ | JS 行 70–104: `getAllPoints()` → 10 节点 |
| 6 | 节点包含 id/name/status | ✅ | JS 行 87–98: id, name, status (locked/unlocked/discovered) |
| 7 | 横向滚动布局 | ✅ | WXML 行 102: `<scroll-view scroll-x>` |
| 8 | "微信一键登录" P0 CTA | ✅ | WXML 行 128–133 + 151–158; WXSS z-index: 100 |
| 9 | P0 固定底部 + always visible + 最高 z-index | ✅ | WXSS 行 555–571: `position: fixed; bottom: 0; z-index: 100` |
| 10 | "进入探索" 二级 CTA | ✅ | WXML 行 137–141: logged-in 状态显示 |
| 11 | 登录后导航至 `/pages/index/index` | ✅ | JS 行 301–319: `_enterExplore()` → `{ replace: true }` |
| 12 | 玻璃拟态卡片（非扁平） | ✅ | WXSS 行 341–347: `backdrop-filter: blur()` + `box-shadow` |
| 13 | 无游戏风格 UI | ✅ | 全部使用雾/金/石色系，无 neon/pixel/cartoon |
| 14 | 运行时 INVALID 检测 | ✅ | JS 行 222–227: bg asset 检查 + node count 检查 |
| 15 | entry gate 防重复进入 | ✅ | JS 行 148–181: `hasWorldEntered` + `_enteredOnce` |
| 16 | 防重复导航锁 | ✅ | JS 行 301–306: `_navigatingAway` 标志 |
| 17 | 骨架加载状态 | ✅ | WXML 行 30–35: 4 个 skeleton placeholder |

### 禁止项验证

| 禁止项 | 状态 |
|--------|------|
| 不使用扁平背景 | ✅ 多层雾 + depth + 光线 |
| 不硬编码图片路径 | ✅ 全部通过 `assetMap` 引用 |
| 不硬编码统计数据 | ✅ 全部从 store 动态绑定 |
| 不少于 10 个探索节点 | ✅ 运行时检查 |
| 不少登录 CTA | ✅ P0 + scroll 双保险 |
| 无游戏 UI | ✅ 纯东方诗意风格 |
| 无扁平卡片 | ✅ 玻璃拟态 |

---

*文档结束*
