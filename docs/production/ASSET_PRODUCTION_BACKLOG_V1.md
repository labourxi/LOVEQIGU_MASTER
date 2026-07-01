# ASSET PRODUCTION BACKLOG V1

> 报告日期：2026-06-30  
> 审计范围：全项目 UI 视觉资产  
> 审计模式：只读审计 / 零修改 / 零生成  
> 目标对象：设计师 / AI 图像生成管线  

---

# ⚠️ 审计前置结论

**Landing Page 当前因缺少视觉资产而阻塞。**

这不是代码问题。这是资产交付失败。

---

# 🔴 STEP 1: ASSET INVENTORY AUDIT

## 1.1 所有资产注册来源

项目中有 **5 个独立的资产注册源**，路径前缀不一致：

| # | 注册源文件 | 路径前缀 | 资产条目数 |
|---|-----------|---------|-----------|
| A | `apps/miniapp/pages/landing/index.js` (getAssetMap) | `/static/` | 9 |
| B | `apps/miniapp/core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | `/images/` | 13 |
| C | `apps/miniapp/core/ui-spec-runtime/asset-resolver.js` (DEFAULT_ASSET_MAP) | `/images/` | 11 |
| D | `docs/freeze/VISUAL_ASSET_CONTRACT_V1.md` | `/assets/` | 5+ |
| E | `apps/miniapp/assets/star-ritual/asset-manifest.json` | `/assets/star-ritual/` | 10 (全部 marked `available: false`) |

## 1.2 REQUIRED ASSETS — 被 UI 引用但缺失

### 类别 1: Landing Page 场景（P0 — 渲染阻塞根因）

来源：`pages/landing/index.js` assetMap + `GOVERNANCE_RUNTIME_HOOK_V2.js` registry

| # | 资产 ID | 预期路径 | 引用源 | 磁盘存在 |
|---|---------|---------|--------|---------|
| 1 | `bg` | `/static/scene/aiqigu_landing_v1.jpg` | landing/index.js L107 | ❌ |
| 2 | `bg_webp` | `/static/scene/aiqigu_landing_v1.webp` | landing/index.js L108 | ❌ |
| 3 | `fallback` | `/static/scene/landing_fallback.jpg` | landing/index.js L109, L398 | ❌ |
| 4 | `scene_street` | `/static/scene/aiqigu_street_v1.jpg` | landing/index.js L110 | ❌ |
| 5 | `aigugu_landing_bg` | `/images/scene/aiqigu_landing_v1.jpg` | governance V2 L32, asset-resolver L18 | ❌ |
| 6 | `landing_bg` | `/images/scene/aiqigu_landing_v1.jpg` | governance V2 L33, asset-resolver L19 | ❌ |
| 7 | `scene_aiqigu_street` | `/images/scene/aiqigu_street_v1.jpg` | governance V2 L34, asset-resolver L20 | ❌ |

**注意：** #1-4 使用 `/static/` 前缀，#5-7 使用 `/images/` 前缀。但指向的是**相同文件**（aiqigu_landing_v1.jpg / aiqigu_street_v1.jpg）。

### 类别 2: Landing Page Portal / UI 装饰（P1）

来源：`pages/landing/index.js` + `GOVERNANCE_RUNTIME_HOOK_V2.js`

| # | 资产 ID | 预期路径 | 引用源 | 磁盘存在 |
|---|---------|---------|--------|---------|
| 8 | `portal_ring` | `/static/ui/portal_ring_gold_v1.png` | landing/index.js L112 | ❌ |
| 9 | `portal_mist` | `/static/bg/portal_mist_v1.png` | landing/index.js L111 | ❌ |
| 10 | `ui_card_glass` | `/static/ui/explore_card_glass_v1.png` | landing/index.js L114 | ❌ |
| 11 | `ui_stat_glass` | `/static/ui/stat_panel_gold_glass_v1.png` | landing/index.js L115 | ❌ |
| 12 | `portal_ring_gold` | `/images/ui/portal_ring_gold_v1.png` | governance V2 L37, asset-resolver L23 | ❌ |
| 13 | `portal_mist_layer` | `/images/bg/portal_mist_v1.png` | governance V2 L38, asset-resolver L24 | ❌ |
| 14 | `ui_explore_card` | `/images/ui/explore_card_glass_v1.png` | governance V2 L39, asset-resolver L25 | ❌ |
| 15 | `ui_stat_glass` | `/images/ui/stat_panel_gold_glass_v1.png` | governance V2 L40, asset-resolver L26 | ❌ |

### 类别 3: Icons（P2）

来源：`GOVERNANCE_RUNTIME_HOOK_V2.js` + `asset-resolver.js`

| # | 资产 ID | 预期路径 | 引用源 | 磁盘存在 |
|---|---------|---------|--------|---------|
| 16 | `icon_login` | `/static/icon/wechat_login_gold_v1.png` | landing/index.js L113 | ❌ |
| 17 | `icon_wechat_login` | `/images/icon/wechat_login_gold_v1.png` | governance V2 L43, asset-resolver L29 | ❌ |
| 18 | `icon_location` | `/images/icon/location_v1.png` | governance V2 L44, asset-resolver L30 | ❌ |
| 19 | `icon_relic` | `/images/icon/relic_v1.png` | governance V2 L45, asset-resolver L31 | ❌ |
| 20 | `icon_collectible` | `/images/icon/collectible_v1.png` | governance V2 L46, asset-resolver L32 | ❌ |
| 21 | `icon_ar` | `/images/icon/ar_v1.png` | governance V2 L47, asset-resolver L33 | ❌ |

### 类别 4: Relic / Collectible 视觉（P2）

来源：`GOVERNANCE_RUNTIME_HOOK_V2.js` + `asset-resolver.js`

| # | 资产 ID | 预期路径 | 引用源 | 磁盘存在 |
|---|---------|---------|--------|---------|
| 22 | `relic_glow_frame` | `/images/relic/frame_gold_v2.png` | governance V2 L50, asset-resolver L36 | ❌ |
| 23 | `collectible_frame` | `/images/collectible/frame_v1.png` | governance V2 L51, asset-resolver L37 | ❌ |

### 类别 5: Star Ritual 资产（P3 — 全部标记 unavailable）

来源：`apps/miniapp/assets/star-ritual/asset-manifest.json`

| # | 资产 ID / 用途 | 预期路径 | 状态 |
|---|---------------|---------|------|
| 24 | Lottie: chart_open | `/assets/star-ritual/lottie/chart_open.json` | `available: false` |
| 25 | Lottie: star_activate | `/assets/star-ritual/lottie/star_activate.json` | `available: false` |
| 26 | Lottie: gold_flow | `/assets/star-ritual/lottie/gold_flow.json` | `available: false` |
| 27 | Lottie: seal_complete | `/assets/star-ritual/lottie/seal_complete.json` | `available: false` |
| 28 | Texture: paper_bg | `/assets/star-ritual/textures/paper_bg.webp` | `available: false` |
| 29 | Texture: star_glow | `/assets/star-ritual/textures/star_glow.webp` | `available: false` |
| 30 | Texture: seal | `/assets/star-ritual/textures/seal.webp` | `available: false` |
| 31 | Audio: ignition | `/assets/star-ritual/audio/ignition.mp3` | `available: false` |
| 32 | Audio: flow | `/assets/star-ritual/audio/flow.mp3` | `available: false` |
| 33 | Audio: completion | `/assets/star-ritual/audio/completion.mp3` | `available: false` |

---

## 1.3 EXISTING ASSETS — 物理存在于仓库

### 类别 A: Landing Page 相关（archive 中，未被引用）

来源：`archive/legacy/visual_production/VISUAL_LANDING_PRODUCTION_V1/batch_001/`

| 文件 | 大小估计 | 来源 | 是否被任何 UI 引用 |
|------|---------|------|------------------|
| `landing_page_final_v1__doubao__v1.png` | 未知 | 豆包 AI 生成 | ❌ 未引用 |
| `landing_page_final_v1__doubao__v2.png` | 未知 | 豆包 AI 生成 | ❌ 未引用 |
| `explore_home_final_v1__doubao__v1.png` | 未知 | 豆包 AI 生成 | ❌ 未引用 |
| `explore_home_final_v1__doubao__v2.png` | 未知 | 豆包 AI 生成 | ❌ 未引用 |

**这些文件存在于 `archive/` 目录中，从未被任何 UI 代码引用。** 它们是历史 AI 生成产出，但未进入生产管线。

### 类别 B: AR Factory 参考图

来源：`data/ar_factory/poc/landmark_tree_v1/` 及相关变体

| 文件 | 用途 | 是否被 UI 引用 |
|------|------|--------------|
| `tree_full.jpg` ~ `tree_trunk.jpg` (8张) | 地标 AR 定位参考图 | ❌ AR 运行时内部使用 |
| `position_guide.png` | AR 位置引导覆盖层 | ❌ AR 运行时内部使用 |
| `alignment_overlay.png` | AR 对齐覆盖层 | ❌ AR 运行时内部使用 |
| `dragon_imprint_overlay.webp/png` | 青龙印记预览 | ❌ AR 效果预览 |
| `dragon_energy_flow.webp/png` | 青龙能量流预览 | ❌ AR 效果预览 |
| `dragon_head_reveal.webp/png` | 青龙首显现预览 | ❌ AR 效果预览 |
| `azure_dragon_seal.webp/png` | 青龙封印预览 | ❌ AR 效果预览 |
| `preview_sheet.webp/png` | 效果预览合辑 | ❌ AR 效果预览 |

**全部属于 AR 工厂子系统的参考图，与 Landing Page UI 无关。**

### 类别 C: 爱企谷概念参考图

来源：`assets/aiqigu/images/`

| 数量 | 文件名模式 | 来源 | 是否被 UI 引用 |
|------|-----------|------|--------------|
| 27 张 | `Snipaste_*`, `微信图片_*` | 设计参考截图 | ❌ 未引用 |

**这些是设计过程中收集的参考截图，未在 UI 中使用。**

### 类别 D: Visual Autopilot 候选图

来源：`assets/visual-autopilot/candidates/`

| 数量 | 文件名模式 | 是否被 UI 引用 |
|------|-----------|--------------|
| ~100+ | `seedream_ark_*.jpg` | ❌ 未引用 |

**AI 图像筛选管线的候选输出，未接入 UI。**

### 类别 E: Visual Factory / Golden Phoenix 批次

来源：`data/visual_factory/batches/golden_phoenix_v1/`

| 文件 | 是否被 UI 引用 |
|------|--------------|
| `GOLDEN_PHOENIX_GEMINI_R1_01.png`, `R1_02.png` | ❌ 未引用 |
| `GOLDEN_PHOENIX_DOUBAO_R1_01.png`, `R1_02.png` | ❌ 未引用 |

**视觉工厂实验批次，未接入 UI。**

### 类别 F: 小程序内 AR 运行时资产

来源：`apps/miniapp/assets/ar_factory/landmark_ar_poc_v1/`

| 文件 | 是否被 UI 引用 |
|------|--------------|
| `position_guide.png` | ❌ AR 运行时内部使用 |
| `alignment_overlay.png` | ❌ AR 运行时内部使用 |

---

## 1.4 ORPHAN REFERENCES — 有 UI 引用但无文件

即 1.2 节中列出的 **全部 23 个资产（#1-23）**。

## 1.5 UNUSED ASSETS — 文件存在但从未被 UI 使用

即 1.3 节中列出的 **全部现有文件**（约 160+ 个）。

---

# 🔴 STEP 2: LANDING PAGE ASSET DEPENDENCY MAP

## 2.1 UI 元素 → 所需文件 → 状态

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LANDING PAGE UI ELEMENT TO ASSET MAPPING                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ LAYER 1: BACKGROUND SCENE                                                    │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ <image class="lp-bg__image">                                          │  │
│ │   src="{{bgImage}}" (从 assetMap.bg 或 assetMap.fallback 绑定)          │  │
│ │   → 当前 bgImage='' → 不渲染                                            │  │
│ │   → 需要：aiqigu_landing_v1.jpg（主场景）                                │  │
│ │   → 需要：landing_fallback.jpg（回退场景）                                │  │
│ │   → STATUS: ❌ 两个文件均缺失                                            │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ CSS .lp-bg__scene (background-image)                                   │  │
│ │   → 与 <image> 共享 bgImage                                             │  │
│ │   → STATUS: ❌ 同上                                                    │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ CSS .lp-bg__scene--gradient (纯 CSS 渐变回退)                           │  │
│ │   → 零文件依赖，始终可用                                                │  │
│ │   → STATUS: ✅ 生产就绪（但无场景图像）                                  │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ LAYER 2: PORTAL INTRO SECTION                                                │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ .lp-intro__portal（光环 / 核心光点 / 浮游粒子）                          │  │
│ │   → 纯 CSS 动画渲染，零文件依赖                                          │  │
│ │   → STATUS: ✅ 生产就绪                                                │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ .lp-intro__portal 装饰增强（assetMap.portal_ring / portal_mist）         │  │
│ │   → 需要：portal_ring_gold_v1.png（金色光环纹理）                        │  │
│ │   → 需要：portal_mist_v1.png（雾层纹理）                                 │  │
│ │   → STATUS: ❌ 两个文件均缺失（当前未使用，assetMap 已声明但 WXML 未引用） │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ LAYER 3: STATS DASHBOARD                                                    │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ .lp-stat-card（4 格数据面板：探索点 / 信物 / 权益 / 进度）                │  │
│ │   → 纯 CSS glass morphism 渲染，零文件依赖                               │  │
│ │   → assetMap.ui_stat_glass（玻璃面板纹理）已声明但 WXML 未引用            │  │
│ │   → STATUS: ✅ UI 已就绪（增强纹理可选）                                 │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ LAYER 4: EXPLORATION CAROUSEL                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ .lp-carousel__item（10 个探索节点）                                      │  │
│ │   → 纯 CSS 渲染，零文件依赖                                              │  │
│ │   → assetMap.ui_card_glass（卡片玻璃纹理）已声明但 WXML 未引用            │  │
│ │   → STATUS: ✅ UI 已就绪（增强纹理可选）                                 │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ LAYER 5: LOGIN CTA                                                          │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ .lp-login-fixed__btn（微信一键登录按钮）                                  │  │
│ │   → 当前使用纯文本 Unicode 图标 ""（WXML L148）                      │  │
│ │   → assetMap.icon_login（wechat_login_gold_v1.png）已声明但 WXML 未引用   │  │
│ │   → STATUS: ✅ UI 已就绪（图标替换可选）                                 │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ LAYER 6: SECONDARY CTA (logged-in users)                                    │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ .lp-cta--primary / .lp-cta__hint                                       │  │
│ │   → 纯 CSS 渲染，零文件依赖                                              │  │
│ │   → STATUS: ✅ 生产就绪                                                │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 跨页面的全局资产依赖

除 Landing Page 外，`GOVERNANCE_RUNTIME_HOOK_V2.js` 和 `asset-resolver.js` 声明的资产被以下页面引用：

| 资产 | 引用页面 | 当前处理方式 |
|------|---------|------------|
| `icon_location` | 探索地图类页面 | 缺失，未触发 |
| `icon_relic` | 信物类页面 | 缺失，未触发 |
| `icon_collectible` | 数字藏品类页面 | 缺失，未触发 |
| `icon_ar` | AR 扫描类页面 | 缺失，未触发 |
| `relic_glow_frame` | 信物详情类页面 | 缺失，未触发 |
| `collectible_frame` | 数字藏品详情类页面 | 缺失，未触发 |

**这些资产目前因对应页面尚未渲染或使用 assetMap 而未被消费。但一旦接入，会立即暴露相同的 HTTP 500 错误。**

---

# 🔴 STEP 3: VISUAL PRODUCTION SPECIFICATION

## 3.1 生产规范

### 路径约定（决定）

> **最终决定：使用 `/static/` 前缀作为唯一生产路径。**

理由：
1. `pages/landing/index.js`（当前活跃的渲染代码）已经使用 `/static/`
2. `/images/` 和 `/assets/` 是历史遗留
3. 所有新资产放入 `apps/miniapp/static/` 目录

### 构建配置变更（一次性）

需要在 `project.config.json` 的 `packOptions.include` 中添加：

```json
{ "type": "folder", "value": "static" }
```

## 3.2 P0 资产 — Landing Page 场景（阻塞级）

按优先级排序：

### ASSET-001: aiqigu_landing_v1.jpg

| 属性 | 值 |
|------|-----|
| **文件名** | `aiqigu_landing_v1.jpg` |
| **放置路径** | `apps/miniapp/static/scene/aiqigu_landing_v1.jpg` |
| **UI 用法** | Landing Page 全屏背景场景图 |
| **格式** | JPEG |
| **推荐尺寸** | 750px × 1624px（iPhone 15 逻辑分辨率）或更高 2x |
| **视觉风格** | 爱企谷山谷 / 雾景 / 温暖金色光线 / 门隐喻 |
| **关联资产 ID** | `bg`（index.js assetMap），`aigugu_landing_bg` / `landing_bg`（governance） |
| **优先级** | **P0 — Landing Page 渲染依赖** |
| **当前状态** | ❌ 缺失 |

### ASSET-002: landing_fallback.jpg

| 属性 | 值 |
|------|-----|
| **文件名** | `landing_fallback.jpg` |
| **放置路径** | `apps/miniapp/static/scene/landing_fallback.jpg` |
| **UI 用法** | 主图加载失败时的回退场景 |
| **格式** | JPEG |
| **推荐尺寸** | 750px × 1624px |
| **视觉风格** | 极简 / 深色 / 低饱和度 / 不影响上述风格 |
| **关联资产 ID** | `fallback`（index.js assetMap + onImgError 回退） |
| **优先级** | **P0 — 回退链路依赖** |
| **当前状态** | ❌ 缺失 |

### ASSET-003: aiqigu_landing_v1.webp

| 属性 | 值 |
|------|-----|
| **文件名** | `aiqigu_landing_v1.webp` |
| **放置路径** | `apps/miniapp/static/scene/aiqigu_landing_v1.webp` |
| **UI 用法** | WebP 格式的同一场景图（性能优化） |
| **格式** | WebP |
| **推荐尺寸** | 750px × 1624px |
| **优先级** | **P0 — 性能优化（可降级为仅 JPG）** |
| **当前状态** | ❌ 缺失 |

### ASSET-004: aiqigu_street_v1.jpg

| 属性 | 值 |
|------|-----|
| **文件名** | `aiqigu_street_v1.jpg` |
| **放置路径** | `apps/miniapp/static/scene/aiqigu_street_v1.jpg` |
| **UI 用法** | 场景扩展图（当前未直接渲染，但 assetMap 已声明） |
| **格式** | JPEG |
| **推荐尺寸** | 750px × 1624px |
| **视觉风格** | 爱企谷街道 / 延伸景观 |
| **关联资产 ID** | `scene_street`（index.js assetMap），`scene_aiqigu_street`（governance） |
| **优先级** | **P1 — 功能性增强** |
| **当前状态** | ❌ 缺失 |

## 3.3 P1 资产 — Portal / UI 装饰

### ASSET-005: portal_ring_gold_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `portal_ring_gold_v1.png` |
| **放置路径** | `apps/miniapp/static/ui/portal_ring_gold_v1.png` |
| **UI 用法** | Portal 光环纹理 / 装饰层 |
| **格式** | PNG（需 alpha 通道） |
| **推荐尺寸** | 200px × 200px（逻辑像素） |
| **优先级** | **P1 — 视觉增强** |
| **当前状态** | ❌ 缺失 |

### ASSET-006: portal_mist_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `portal_mist_v1.png` |
| **放置路径** | `apps/miniapp/static/bg/portal_mist_v1.png` |
| **UI 用法** | 雾层背景纹理 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 全屏宽幅 |
| **优先级** | **P1 — 视觉增强** |
| **当前状态** | ❌ 缺失 |

### ASSET-007: explore_card_glass_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `explore_card_glass_v1.png` |
| **放置路径** | `apps/miniapp/static/ui/explore_card_glass_v1.png` |
| **UI 用法** | 探索卡片的玻璃质感纹理 overlay |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 180px × 200px |
| **优先级** | **P1 — 视觉增强** |
| **当前状态** | ❌ 缺失 |

### ASSET-008: stat_panel_gold_glass_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `stat_panel_gold_glass_v1.png` |
| **放置路径** | `apps/miniapp/static/ui/stat_panel_gold_glass_v1.png` |
| **UI 用法** | 统计面板的玻璃质感纹理 overlay |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 280px × 140px |
| **优先级** | **P1 — 视觉增强** |
| **当前状态** | ❌ 缺失 |

## 3.4 P2 资产 — Icons

### ASSET-009: wechat_login_gold_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `wechat_login_gold_v1.png` |
| **放置路径** | `apps/miniapp/static/icon/wechat_login_gold_v1.png` |
| **UI 用法** | 微信一键登录按钮图标 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 36px × 36px（逻辑像素） |
| **优先级** | **P2 — 图标替换（当前使用 Unicode 文本）** |
| **当前状态** | ❌ 缺失 |

### ASSET-010: location_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `location_v1.png` |
| **放置路径** | `apps/miniapp/static/icon/location_v1.png` |
| **UI 用法** | 探索地图位置图标 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 32px × 32px |
| **优先级** | **P2 — 探索页资产** |
| **当前状态** | ❌ 缺失 |

### ASSET-011: relic_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `relic_v1.png` |
| **放置路径** | `apps/miniapp/static/icon/relic_v1.png` |
| **UI 用法** | 信物相关图标 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 32px × 32px |
| **优先级** | **P2 — 探索页资产** |
| **当前状态** | ❌ 缺失 |

### ASSET-012: collectible_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `collectible_v1.png` |
| **放置路径** | `apps/miniapp/static/icon/collectible_v1.png` |
| **UI 用法** | 数字藏品相关图标 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 32px × 32px |
| **优先级** | **P2 — 探索页资产** |
| **当前状态** | ❌ 缺失 |

### ASSET-013: ar_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `ar_v1.png` |
| **放置路径** | `apps/miniapp/static/icon/ar_v1.png` |
| **UI 用法** | AR 扫描相关图标 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 32px × 32px |
| **优先级** | **P2 — 探索页资产** |
| **当前状态** | ❌ 缺失 |

## 3.5 P2 资产 — Relic / Collectible 框架

### ASSET-014: frame_gold_v2.png

| 属性 | 值 |
|------|-----|
| **文件名** | `frame_gold_v2.png` |
| **放置路径** | `apps/miniapp/static/relic/frame_gold_v2.png` |
| **UI 用法** | 信物详情的金色装饰框架 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 按信物卡片尺寸 |
| **优先级** | **P2 — 信物页资产** |
| **当前状态** | ❌ 缺失 |

### ASSET-015: collectible_frame_v1.png

| 属性 | 值 |
|------|-----|
| **文件名** | `collectible_frame_v1.png` |
| **放置路径** | `apps/miniapp/static/collectible/frame_v1.png` |
| **UI 用法** | 数字藏品详情装饰框架 |
| **格式** | PNG（带透明度） |
| **推荐尺寸** | 按藏品卡片尺寸 |
| **优先级** | **P2 — 藏品页资产** |
| **当前状态** | ❌ 缺失 |

---

# 🟥 STEP 4: CRITICAL BLOCKER CONFIRMATION

## 4.1 汇总统计

| 指标 | 数值 |
|------|------|
| **已注册资产总数** | 23 个（去重后） |
| **磁盘存在** | 0 个 |
| **磁盘缺失** | 23 个 |
| **其中 Landing Page 直接依赖** | 9 个 |
| **其中 Landing Page 渲染阻塞** | 2 个（aiqigu_landing_v1.jpg, landing_fallback.jpg） |

## 4.2 Landing Page 渲染依赖完整性

| UI 层级 | 依赖类型 | 完整性 |
|---------|---------|--------|
| 骨架屏 (skeleton) | 零文件依赖（纯 CSS） | 100% |
| CSS 渐变背景 | 零文件依赖（纯 CSS） | 100% |
| Portal 光环动画 | 零文件依赖（纯 CSS） | 100% |
| Stats 数据面板 | 零文件依赖（纯 CSS） | 100% |
| 探索节点轮播 | 零文件依赖（纯 CSS） | 100% |
| CTA 按钮 | 零文件依赖（纯 CSS + 文本图标） | 100% |
| 登录按钮 | 零文件依赖（纯 CSS + Unicode 文本图标） | 100% |
| **场景背景图** | **依赖 JPEG 文件** | **0%** |
| **场景回退图** | **依赖 JPEG 文件** | **0%** |

**Landing Page 渲染依赖完整性（含增强资产）：23/23 缺失 → 0%**

**Landing Page 核心功能性完整性（不含增强资产）：100%**

## 4.3 UI 是否可以在无资产情况下生产就绪

| 问题 | 回答 |
|------|------|
| UI 是否渲染？ | **YES** — 已通过 CSS 渐变 + 纯 CSS 动画完全渲染 |
| 用户是否看到场景图像？ | **NO** — 只有深色渐变背景，无山谷场景 |
| 用户能否交互？ | **YES** — 按钮、登录、轮播均可操作 |
| 是否触发 HTTP 500？ | **NO** — `bgImage=''` 当前已阻断图片请求 |
| 整体生产就绪？ | **NO — 视觉上不可作为生产版本发布** |

**结论：UI 在不依赖资产的情况下功能完整，但视觉上不满足生产标准。**

---

# 📋 ASSET PRODUCTION BACKLOG V1 — 交付清单

```
┌──────┬─────────────────────────────────────┬──────────┬──────────────────────────────────────┐
│ 优先级 │ 资产名称                             │ 格式      │ 目标路径                              │
├──────┼─────────────────────────────────────┼──────────┼──────────────────────────────────────┤
│ P0   │ aiqigu_landing_v1.jpg               │ JPEG     │ apps/miniapp/static/scene/           │
│ P0   │ landing_fallback.jpg                │ JPEG     │ apps/miniapp/static/scene/           │
│ P0   │ aiqigu_landing_v1.webp              │ WebP     │ apps/miniapp/static/scene/           │
│ P1   │ aiqigu_street_v1.jpg                │ JPEG     │ apps/miniapp/static/scene/           │
│ P1   │ portal_ring_gold_v1.png             │ PNG      │ apps/miniapp/static/ui/             │
│ P1   │ portal_mist_v1.png                  │ PNG      │ apps/miniapp/static/bg/             │
│ P1   │ explore_card_glass_v1.png           │ PNG      │ apps/miniapp/static/ui/             │
│ P1   │ stat_panel_gold_glass_v1.png        │ PNG      │ apps/miniapp/static/ui/             │
│ P2   │ wechat_login_gold_v1.png            │ PNG      │ apps/miniapp/static/icon/           │
│ P2   │ location_v1.png                     │ PNG      │ apps/miniapp/static/icon/           │
│ P2   │ relic_v1.png                        │ PNG      │ apps/miniapp/static/icon/           │
│ P2   │ collectible_v1.png                  │ PNG      │ apps/miniapp/static/icon/           │
│ P2   │ ar_v1.png                           │ PNG      │ apps/miniapp/static/icon/           │
│ P2   │ frame_gold_v2.png                   │ PNG      │ apps/miniapp/static/relic/          │
│ P2   │ collectible_frame_v1.png            │ PNG      │ apps/miniapp/static/collectible/    │
└──────┴─────────────────────────────────────┴──────────┴──────────────────────────────────────┘
```

## 交付后需执行的操作

1. **将资产文件放入** `apps/miniapp/static/scene/`, `static/ui/`, `static/bg/`, `static/icon/`, `static/relic/`, `static/collectible/`
2. **更新** `project.config.json` 的 `packOptions.include` 添加 `{ "type": "folder", "value": "static" }`
3. **删除过时注册源**（可选）：清理 `GOVERNANCE_RUNTIME_HOOK_V2.js` 和 `asset-resolver.js` 中的 `/images/` 路径，统一为 `/static/`
4. **验证**：重新构建后检查控制台无 `Failed to load local image resource` 错误

---

*报告生成于 2026-06-30 · 审计引擎：Cursor Agent · 审计模式：只读审计 / 零修改 / 零生成*
