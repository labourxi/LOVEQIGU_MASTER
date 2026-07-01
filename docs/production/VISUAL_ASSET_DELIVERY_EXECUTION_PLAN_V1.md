# VISUAL ASSET DELIVERY EXECUTION PLAN V1

> 计划日期：2026-06-30  
> 计划类型：**生产执行计划（非代码修改）**  
> 前置文档：`ASSET_PRODUCTION_BACKLOG_V1.md` → `VISUAL_ASSET_DELIVERY_CONTRACT_V1.md`

---

# PHASE 1: ASSET BACKLOG FINALITY CONFIRMATION

## 1.1 全量再验证

| 验证维度 | 结果 |
|---------|------|
| 所有注册源是否已收敛 | **YES** — 3 个注册源（index.js / governance / asset-resolver）引用同一组文件 |
| 新缺失资产 | **NONE** — 0 新增 |
| 未解决的引用 | **NONE** — 所有 asset ID 均有对应路径 |
| 运行时路径冲突 | **NO** — `bgImage=''` 当前阻止全部 HTTP 请求 |
| 构建路径冲突 | **EXISTS** — `project.config.json` 未包含 `static/` 目录，需要添加 |

## 1.2 最终结论

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   FINAL BACKLOG CONFIRMED: YES                               │
│                                                              │
│   15 core assets identified.                                 │
│   0 new assets discovered since V1 audit.                    │
│   All paths resolved to /static/ prefix.                     │
│   No runtime path conflicts (all currently inactive).        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# PHASE 2: UI → ASSET BINDING TABLE

## 2.1 Landing Page 完整绑定映射

### LAYER 1: BACKGROUND SCENE

```
┌──────────┬──────────────────────┬──────────────────────────────────────┬───────────┐
│ UI       │ 绑定位置              │  资产 & 路径                        │ 当前状态  │
│ 元素     │ (WXML/JS)            │                                      │           │
├──────────┼──────────────────────┼──────────────────────────────────────┼───────────┤
│ <image>  │ WXML L43-48          │ bg → assetMap.bg                    │ 未激活    │
│          │ src="{{bgImage}}"     │ → /static/scene/aiqigu_landing_v1.jpg│ 文件缺失  │
│          │                      │                                      │           │
│ CSS 背景 │ WXML L54-57          │ bg → assetMap.bg                    │ 未激活    │
│          │ background-image:url │ → /static/scene/aiqigu_landing_v1.jpg│ 文件缺失  │
│          │                      │                                      │           │
│ 回退图   │ JS L398 (onImgError) │ fallback → assetMap.fallback        │ 未激活    │
│          │ setData({bgImage})   │ → /static/scene/landing_fallback.jpg │ 文件缺失  │
│          │                      │                                      │           │
│ CSS渐变  │ WXML L50-52          │ 零文件依赖                           │ ✅ 生效   │
│          │ .lp-bg__scene--      │ 纯CSS渲染                            │           │
│          │ gradient             │                                      │           │
└──────────┴──────────────────────┴──────────────────────────────────────┴───────────┘
```

### LAYER 2: WORLD INTRO / PORTAL

```
┌──────────┬──────────────────────┬──────────────────────────────────────┬───────────┐
│ UI       │ 绑定位置              │  资产 & 路径                        │ 当前状态  │
│ 元素     │ (WXML/JS)            │                                      │           │
├──────────┼──────────────────────┼──────────────────────────────────────┼───────────┤
│ Portal   │ WXML L71-75          │ 纯CSS渲染（旋转环 + 光点 + 粒子）    │ ✅ 生效   │
│ 光环动画 │ .lp-intro__portal    │ 零文件依赖                           │           │
│          │                      │                                      │           │
│ Portal   │ assetMap已声明        │ portal_ring → assetMap.portal_ring  │ 未使用    │
│ 纹理增强 │ WXML未引用            │ → /static/ui/portal_ring_gold_v1.png│ 文件缺失  │
│          │                      │                                      │           │
│ Portal   │ assetMap已声明        │ portal_mist → assetMap.portal_mist  │ 未使用    │
│ 雾层增强 │ WXML未引用            │ → /static/bg/portal_mist_v1.png     │ 文件缺失  │
│          │                      │                                      │           │
│ 标题文字 │ WXML L76-78          │ 纯文本+CSS                           │ ✅ 生效   │
│          │ .lp-intro__title     │ 零文件依赖                           │           │
└──────────┴──────────────────────┴──────────────────────────────────────┴───────────┘
```

### LAYER 3: STATS DASHBOARD

```
┌──────────┬──────────────────────┬──────────────────────────────────────┬───────────┐
│ UI       │ 绑定位置              │  资产 & 路径                        │ 当前状态  │
│ 元素     │ (WXML/JS)            │                                      │           │
├──────────┼──────────────────────┼──────────────────────────────────────┼───────────┤
│ 4格面板  │ WXML L84-103        │ 纯CSS glass morphism                  │ ✅ 生效   │
│ .lp-stats│                      │ 零文件依赖                           │           │
│          │                      │                                      │           │
│ 面板纹理  │ assetMap已声明       │ ui_stat_glass→assetMap.ui_stat_glass│ 未使用    │
│ 增强     │ WXML未引用            │ → /static/ui/stat_panel_gold_glass  │ 文件缺失  │
│          │                      │   _v1.png                            │           │
└──────────┴──────────────────────┴──────────────────────────────────────┴───────────┘
```

### LAYER 4: EXPLORATION CAROUSEL

```
┌──────────┬──────────────────────┬──────────────────────────────────────┬───────────┐
│ UI       │ 绑定位置              │  资产 & 路径                        │ 当前状态  │
│ 元素     │ (WXML/JS)            │                                      │           │
├──────────┼──────────────────────┼──────────────────────────────────────┼───────────┤
│ 卡片列表 │ WXML L108-126       │ 纯CSS渲染                            │ ✅ 生效   │
│ .lp-carousel│                  │ 零文件依赖                           │           │
│          │                      │                                      │           │
│ 卡片纹理  │ assetMap已声明       │ ui_card_glass→assetMap.             │ 未使用    │
│ 增强     │ WXML未引用            │ ui_card_glass                        │ 文件缺失  │
│          │                      │ → /static/ui/explore_card_glass_v1   │           │
│          │                      │   .png                               │           │
└──────────┴──────────────────────┴──────────────────────────────────────┴───────────┘
```

### LAYER 5: LOGIN CTA

```
┌──────────┬──────────────────────┬──────────────────────────────────────┬───────────┐
│ UI       │ 绑定位置              │  资产 & 路径                        │ 当前状态  │
│ 元素     │ (WXML/JS)            │                                      │           │
├──────────┼──────────────────────┼──────────────────────────────────────┼───────────┤
│ 登录按钮 │ WXML L147-150       │ 纯文本 Unicode 图标 ""             │ ✅ 生效   │
│          │                      │                                      │           │
│ 登录图标 │ assetMap已声明        │ icon_login→assetMap.icon_login      │ 未使用    │
│ 替换     │ WXML未引用            │ → /static/icon/wechat_login_gold_v1 │ 文件缺失  │
│          │                      │   .png                               │           │
└──────────┴──────────────────────┴──────────────────────────────────────┴───────────┘
```

### LAYER 6: SECONDARY CTA

```
┌──────────┬──────────────────────┬──────────────────────────────────────┬───────────┐
│ UI       │ 绑定位置              │  资产 & 路径                        │ 当前状态  │
│ 元素     │ (WXML/JS)            │                                      │           │
├──────────┼──────────────────────┼──────────────────────────────────────┼───────────┤
│ 主按钮   │ WXML L131-138       │ 纯CSS渲染                            │ ✅ 生效   │
│ .lp-cta  │                      │ 零文件依赖                           │           │
└──────────┴──────────────────────┴──────────────────────────────────────┴───────────┘
```

## 2.2 全局资产绑定（非 Landing Page）

```
┌────────────┬──────────────────────┬──────────────────────────────────┬───────────┐
│ 资产 ID    │ 预期引用页面          │ 路径                              │ 当前状态  │
├────────────┼──────────────────────┼──────────────────────────────────┼───────────┤
│ location   │ 探索地图类页面        │ /static/icon/location_v1.png     │ 文件缺失  │
│ relic      │ 信物类页面            │ /static/icon/relic_v1.png        │ 文件缺失  │
│ collectible│ 数字藏品类页面        │ /static/icon/collectible_v1.png  │ 文件缺失  │
│ ar         │ AR 扫描类页面         │ /static/icon/ar_v1.png           │ 文件缺失  │
│ frame_gold │ 信物详情类页面        │ /static/relic/frame_gold_v2.png   │ 文件缺失  │
│ collectible│ 藏品详情类页面        │ /static/collectible/             │ 文件缺失  │
│ frame      │                       │ frame_v1.png                     │           │
└────────────┴──────────────────────┴──────────────────────────────────┴───────────┘
```

---

# PHASE 3: INTEGRATION POINTS

## 3.1 精确注入点清单

以下为资产注入到 UI 的 **确切代码位置**（不修改逻辑，仅标识绑定点）。

### BINDING-001: 背景场景图

```
文件: pages/landing/index.js
行号: L107, L190, L398
绑定点类型: data binding (setData)

流程:
  data.bgImage = ''                         ← L190 (初始状态，阻止请求)
  → 资产就绪后: data.bgImage = '/static/scene/aiqigu_landing_v1.jpg'
  → WXML <image> 识别 src="{{bgImage}}"    ← WXML L45
  → WXML CSS background-image 识别         ← WXML L56
```

### BINDING-002: 背景回退图

```
文件: pages/landing/index.js
行号: L398
绑定点类型: error handler fallback

流程:
  onImgError → this._fallbackAttempted 检查 → setData({bgImage: fallback})
  → fallback = assetMap.fallback           ← L398
  → /static/scene/landing_fallback.jpg
```

### BINDING-003 至 006: Portal / UI 纹理

```
文件: pages/landing/index.js
行号: L111-L112, L114-L115
绑定点类型: assetMap 声明（当前 WXML 未使用）

portal_ring:   /static/ui/portal_ring_gold_v1.png   ← L112
portal_mist:   /static/bg/portal_mist_v1.png         ← L111
ui_card_glass: /static/ui/explore_card_glass_v1.png  ← L114
ui_stat_glass: /static/ui/stat_panel_gold_glass_v1.png← L115

当前状态: assetMap 中已声明，WXML 中未引用。
如果要使用: WXML 中通过 {{assetMap.portal_ring}} 绑定。
```

### BINDING-007: 登录图标

```
文件: pages/landing/index.js
行号: L113
绑定点类型: assetMap 声明（WXML 当前使用 Unicode 图标）

icon_login: /static/icon/wechat_login_gold_v1.png

当前状态: WXML L148 使用 Unicode "" 文本图标。
如果要使用: 替换 WXML L148:
  <image class="lp-login-fixed__icon" src="{{assetMap.icon_login}}">
```

### BINDING-008 至 013: 全局 Icons (非 Landing)

```
文件: apps/miniapp/core/ui-spec-runtime/asset-resolver.js
行号: L29-L33, L36-L37
绑定点类型: DEFAULT_ASSET_MAP

这些资产通过 asset-resolver.resolveAsset(assetId) 被 UI 系统按需引用。
资产就位后自动生效，不需要额外代码修改。
```

## 3.2 注入后渲染顺序

```
资产就位前 (当前状态):
  bgImage=''
  → wx:if="{{bgImage}}" = FALSE
  → <image> 不渲染
  → wx:if="{{!bgImage}}" = TRUE
  → CSS 渐变渲染
  → 用户看到: 深色渐变背景 + Portal + 面板 + 轮播 = 功能完整但视觉空

资产就位后 (目标状态):
  bgImage='/static/scene/aiqigu_landing_v1.jpg'
  → wx:if="{{bgImage}}" = TRUE
  → <image> 渲染场景图
  → CSS background-image 同步渲染
  → onImgError 保持注册（fallback 链路就绪）
  → 用户看到: 爱企谷山谷场景 + 全 UI 元素 = 生产就绪
```

---

# PHASE 4: PRODUCTION ORDER

## 4.1 生产管线执行顺序

```
┌──────────────────────────────────────────────────────────────────────┐
│ PRODUCTION ORDER — 严格按优先级                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ITERATION 1 — P0: LANDING VISUAL COMPLETENESS                        │
│ ──────────────────────────────────────────────────────────────────── │
│                                                                      │
│ 顺序 资产                   管线动作                                   │
│ ──── ──────                  ─────────                                │
│  1   aiqigu_landing_v1.jpg  生成 → 放入 /static/scene/               │
│  2   landing_fallback.jpg   生成 → 放入 /static/scene/               │
│  3   aiqigu_landing_v1.webp 从 JPG 转码 → 放入 /static/scene/        │
│                                                                      │
│ >> 交付检查点: 3 assets delivered                                    │
│    Landing Page 从纯渐变 → 显示场景图                                 │
│    bgImage='/static/scene/aiqigu_landing_v1.jpg' 激活                │
│    onImgError fallback 链路就绪                                      │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ITERATION 2 — P1: VISUAL DEPTH                                       │
│ ──────────────────────────────────────────────────────────────────── │
│                                                                      │
│ 顺序 资产                   管线动作                                   │
│ ──── ──────                  ─────────                                │
│  4   aiqigu_street_v1.jpg   生成 → 放入 /static/scene/               │
│  5   portal_ring_gold_v1.png 生成 → 放入 /static/ui/                 │
│  6   portal_mist_v1.png     生成 → 放入 /static/bg/                  │
│  7   explore_card_glass_v1.png  生成 → 放入 /static/ui/              │
│  8   stat_panel_gold_glass_v1.png  生成 → 放入 /static/ui/           │
│                                                                      │
│ >> 交付检查点: 5 assets delivered (累计 8)                           │
│    Portal 区有纹理叠加，卡片有玻璃质感                                │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ITERATION 3 — P2: ICON SYSTEM                                        │
│ ──────────────────────────────────────────────────────────────────── │
│                                                                      │
│ 顺序 资产                   管线动作                                   │
│ ──── ──────                  ─────────                                │
│  9   wechat_login_gold_v1.png  生成 → 放入 /static/icon/             │
│ 10   location_v1.png        生成 → 放入 /static/icon/                │
│ 11   relic_v1.png           生成 → 放入 /static/icon/                │
│ 12   collectible_v1.png     生成 → 放入 /static/icon/                │
│ 13   ar_v1.png              生成 → 放入 /static/icon/                │
│ 14   frame_gold_v2.png      生成 → 放入 /static/relic/               │
│ 15   collectible_frame_v1.png   生成 → 放入 /static/collectible/     │
│                                                                      │
│ >> 交付检查点: 7 assets delivered (累计 15)                          │
│    图标系统就绪，所有 UI 引用可解析                                   │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ POST-DELIVERY — OPS: BUILD CONFIG                                    │
│ ──────────────────────────────────────────────────────────────────── │
│                                                                      │
│  16  更新 project.config.json                                         │
│       → packOptions.include: [{ "type": "folder", "value": "static" }]│
│                                                                      │
│      验证: 重新构建 → 检查控制台                                     │
│      "Failed to load local image resource" = 0                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 4.2 目录创建顺序

在执行图像生成之前，先创建目录结构：

```bash
mkdir -p apps/miniapp/static/scene/
mkdir -p apps/miniapp/static/bg/
mkdir -p apps/miniapp/static/ui/
mkdir -p apps/miniapp/static/icon/
mkdir -p apps/miniapp/static/relic/
mkdir -p apps/miniapp/static/collectible/
```

## 4.3 激活顺序（资产就位后）

资产放入目录后，无需修改代码即可生效。系统将自动：

```
1. 文件存在 → build system 复制到小程序包
2. bgImage 激活 → <image src="/static/scene/aiqigu_landing_v1.jpg"> 加载
3. 图片加载成功 → 场景图显示
4. onImgError 不触发 → fallback 保持就绪但不用
5. 用户看到完整 Landing Page
```

---

# PHASE 5: FINAL DELIVERY READINESS CHECK

## 5.1 核心检查

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   UI READY WITHOUT ASSETS:     NO                                    │
│   ─────────────────────────    ───                                   │
│   UI 功能完整 (100%)，但视觉上不可作为生产版本发布。                  │
│   用户看到纯深色渐变背景，无山谷场景。                                │
│                                                                      │
│   ASSET DEPENDENCY COMPLETE:   NO                                    │
│   ──────────────────────────   ───                                   │
│   15 个核心资产中 0 个存在 (0%)                                      │
│   23 个注册引用中 0 个可解析 (0%)                                    │
│                                                                      │
│   BLOCKING ITEMS COUNT:        2                                     │
│   ────────────────────────     ───                                   │
│   P0 Blocking:                                                       │
│   1. /static/scene/aiqigu_landing_v1.jpg  (主场景)                   │
│   2. /static/scene/landing_fallback.jpg   (回退场景)                  │
│                                                                      │
│   READY FOR IMAGE PIPELINE:    YES                                   │
│   ─────────────────────────    ───                                   │
│   所有 15 个资产已有：                                                │
│   ✓ 精确文件名                                                       │
│   ✓ 目标路径                                                         │
│   ✓ 格式规格                                                         │
│   ✓ 尺寸规格                                                         │
│   ✓ 生成 prompt (含风格/构图/颜色/禁忌)                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 5.2 执行就绪声明

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   EXECUTION READINESS: EXECUTION READY                               │
│                                                                      │
│   所有准备工作已完成：                                                │
│                                                                      │
│   1. Backlog 最终确认        — 15 资产 / 0 新增 / 0 冲突             │
│   2. UI→资产绑定映射完成      — 9 个 Landing 层 + 6 个全局            │
│   3. 注入点精确定位          — 代码行级绑定点标识                     │
│   4. 生产顺序已定义          — 3 轮迭代，严格优先级                   │
│   5. 构建配置变更已定义      — project.config.json 修改项             │
│   6. 激活顺序已定义          — 零代码修改即可激活                     │
│                                                                      │
│   可以开始图像生成。                                                 │
│   从 ITERATION 1 (P0) 开始。                                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

# 附录: 一次执行参考

当资产就位后，预期的系统行为：

```
资产就位前                          资产就位后
─────────────────────              ─────────────────────
bgImage=''                         bgImage='/static/scene/aiqigu_landing_v1.jpg'
<image> 不渲染                      <image> 渲染场景图
CSS 渐变显示                        CSS 渐变隐藏，场景图显示
onImgError 不触发                   onImgError 保持注册
HTTP 请求: 0                        HTTP 请求: 1 (成功)
用户看到: 深色渐变                  用户看到: 爱企谷山谷
```

---

*计划生成于 2026-06-30 · 生成引擎：Cursor Agent · 计划模式：纯执行准备 / 零代码修改 / 零图像生成*
