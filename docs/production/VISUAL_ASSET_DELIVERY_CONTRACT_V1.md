# VISUAL ASSET DELIVERY CONTRACT V1

> 合同日期：2026-06-30  
> 合同状态：**发布中 — 等待图像生成管线执行**  
> 前置文档：`ASSET_PRODUCTION_BACKLOG_V1.md`

---

# STEP 1: ASSET BACKLOG STABILITY VERIFICATION

## 1.1 再验证结果

| 验证项 | 结果 |
|--------|------|
| 新缺失资产发现 | **无** — 所有 23 个已记录资产仍然缺失 |
| 重复资产定义 | **存在 8 组重复**（同一文件被多个注册源以不同路径引用） |
| 路径冲突 | **存在 3 种前缀**：`/static/` | `/images/` | `/assets/` |

### 重复明细（同一物理文件，多个注册 ID）

| 物理文件 | 注册 ID（/static/ 源） | 注册 ID（/images/ 源） |
|---------|---------------------|---------------------|
| `aiqigu_landing_v1.jpg` | `bg` | `aigugu_landing_bg`, `landing_bg` |
| `aiqigu_street_v1.jpg` | `scene_street` | `scene_aiqigu_street` |
| `portal_ring_gold_v1.png` | `portal_ring` | `portal_ring_gold` |
| `portal_mist_v1.png` | `portal_mist` | `portal_mist_layer` |
| `explore_card_glass_v1.png` | `ui_card_glass` | `ui_explore_card` |
| `stat_panel_gold_glass_v1.png` | `ui_stat_glass` | `ui_stat_glass` |
| `wechat_login_gold_v1.png` | `icon_login` | `icon_wechat_login` |

**处理方式**：生产层面只需要按 `/static/` 路径存放一份文件。代码层面后续统一为 `/static/` 路径后，这些重复会自动收敛。

## 1.2 结论

> **ASSET BACKLOG STABLE: YES**

---

# STEP 2: ASSET PRIORITY CLASSIFICATION (PRODUCTION-READY)

## 2.1 P0 — Blocking Landing Page Visual Completeness

这些资产交付前，Landing Page **视觉上不可发布**。

| # | 资产名称 | 目标路径 | 格式 | UI 层级 | 阻塞原因 |
|---|---------|---------|------|---------|---------|
| 1 | `aiqigu_landing_v1.jpg` | `static/scene/` | JPEG | L1 背景场景 | 主场景图像缺失，用户看到纯渐变 |
| 2 | `landing_fallback.jpg` | `static/scene/` | JPEG | L1 背景回退 | 主图失败后无回退场景图 |
| 3 | `aiqigu_landing_v1.webp` | `static/scene/` | WebP | L1 背景性能 | 仅优化项，可降级为仅 JPG |

**P0 小计：2 个阻塞 + 1 个优化 = 3 个资产**

## 2.2 P1 — Core Visual Enhancement

这些资产增强 Landing Page 视觉深度，但缺失时 UI 仍然可用。

| # | 资产名称 | 目标路径 | 格式 | UI 层级 | 增强效果 |
|---|---------|---------|------|---------|---------|
| 4 | `aiqigu_street_v1.jpg` | `static/scene/` | JPEG | L1 场景扩展 | 街道扩展场景 |
| 5 | `portal_ring_gold_v1.png` | `static/ui/` | PNG-alpha | L2 Portal 光环 | 金色光环纹理叠加 |
| 6 | `portal_mist_v1.png` | `static/bg/` | PNG-alpha | L2 Portal 雾层 | 雾层纹理叠加 |
| 7 | `explore_card_glass_v1.png` | `static/ui/` | PNG-alpha | L4 卡片 | 探索卡玻璃质感 overlay |
| 8 | `stat_panel_gold_glass_v1.png` | `static/ui/` | PNG-alpha | L3 数据面板 | 统计面板玻璃质感 overlay |

**P1 小计：5 个资产**

## 2.3 P2 — UI Polish / Icon System

这些资产是 UI 图标和框架，不阻塞渲染但影响品牌一致性。

| # | 资产名称 | 目标路径 | 格式 | 用途 |
|---|---------|---------|------|------|
| 9 | `wechat_login_gold_v1.png` | `static/icon/` | PNG-alpha | 微信登录按钮图标 |
| 10 | `location_v1.png` | `static/icon/` | PNG-alpha | 探索地图位置图标 |
| 11 | `relic_v1.png` | `static/icon/` | PNG-alpha | 信物图标 |
| 12 | `collectible_v1.png` | `static/icon/` | PNG-alpha | 数字藏品图标 |
| 13 | `ar_v1.png` | `static/icon/` | PNG-alpha | AR 扫描图标 |
| 14 | `frame_gold_v2.png` | `static/relic/` | PNG-alpha | 信物详情装饰框 |
| 15 | `collectible_frame_v1.png` | `static/collectible/` | PNG-alpha | 藏品详情装饰框 |

**P2 小计：7 个资产**

## 2.4 P3 — AR / Future System Assets

这些资产属于未来特性管线，当前不阻塞任何 UI。

| # | 资产名称 | 目标路径 | 格式 | 系统 |
|---|---------|---------|------|------|
| 16-19 | Lottie JSON × 4 | `assets/star-ritual/lottie/` | JSON | 星轨仪式动画 |
| 20-22 | Texture × 3 | `assets/star-ritual/textures/` | WebP | 星轨仪式纹理 |
| 23-25 | Audio × 3 | `assets/star-ritual/audio/` | MP3 | 星轨仪式音效 |

**P3 小计：10 个资产（全部 marked `available: false`）**

## 2.5 总览

```
P0: ■■■■■■■■■■■■■■■■■■■■  3  (20%)   ← 立即生产
P1: ■■■■■■■■■■■■■■■■■■   5  (33%)   ← 第一批增强
P2: ■■■■■■■■■■■■■■■      7  (47%)   ← 第二批 icon/框架
P3: (单独管线)
----
总计: 15 个核心资产 + 10 个未来资产
```

---

# STEP 3: VISUAL PRODUCTION PIPELINE INPUT

以下是为 **AI 图像生成管线** 定义的精确 prompt。每个 prompt 遵守：

- Language Constitution L3（Canon / Ritual / Worldview Language）
- 爱企谷世界观约束
- Visual Bible 颜色约束
- Canon 约束（不发明 / 不填充空白）

## 3.1 P0 PRODUCTION INPUTS

### PROMPT-001: aiqigu_landing_v1.jpg

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-001: aiqigu_landing_v1.jpg                                    │
│ 目标路径: apps/miniapp/static/scene/aiqigu_landing_v1.jpg           │
│ 格式: JPEG · 尺寸: 750×1624 px (或 2x: 1500×3248 px)               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   爱企谷(AIGU VALLEY)主世界入口场景 —— 玩家首次进入世界的第一视觉。  │
│   需要传达: 游离之域 · 世界正在显现                                   │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   - 神秘山谷 / 山间雾景                                              │
│   - 中国山水意境化（非写实照片，非游戏化）                             │
│   - 温暖金色光线（#C8A24A 金色作为点缀）                             │
│   - 深色主调（#0A1A14 深林黑作为底色）                               │
│   - 薄雾层叠，光影通透                                               │
│   - 有"门"的隐喻 —— 入口/显现的象征                                 │
│                                                                     │
│ COMPOSITION RULES:                                                  │
│   - 画面重心在下方 1/3（山谷/地面层）                                │
│   - 上方保留留白空间（用于 UI 文字叠加）                             │
│   - 水平居中构图，对称中带自然不对称                                │
│   - 金色光从画面中心偏下位置向上发散                                │
│   - 饱和度: 0.35-0.55（低饱和度，符合 Visual Bible）                 │
│   - 亮度: 0.50-0.65（暗调）                                         │
│                                                                     │
│ FORBIDDEN:                                                          │
│   - 高纯度荧光色                                                    │
│   - 彩虹渐变背景                                                    │
│   - 霓虹 / 赛博 / 像素风格                                          │
│   - 游戏化UI元素                                                    │
│   - 人物角色（除非是远处剪影）                                      │
│   - 文字 / 品牌标识（UI层处理）                                     │
│                                                                     │
│ COLOR PALETTE:                                                      │
│   Primary:   #0A1A14 (deep forest black)                            │
│   Accent:    #C8A24A (gold light)                                   │
│   Secondary: rgba(200, 162, 74, 0.3-0.6)                           │
│   Mist:      rgba(232, 224, 208, 0.1-0.3) (fog white)              │
│   Deep:      #1A1A2E, #16213E (navy variants)                      │
│                                                                     │
│ CANON REFERENCE:                                                    │
│   "游离之域 · 世界正在显现"                                          │
│   "爱企谷" (AIGU VALLEY)                                            │
│   First impression of the world — entry gate metaphor              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PROMPT-002: landing_fallback.jpg

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-002: landing_fallback.jpg                                     │
│ 目标路径: apps/miniapp/static/scene/landing_fallback.jpg            │
│ 格式: JPEG · 尺寸: 750×1624 px                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   主场景图加载失败时的回退场景。                                      │
│   更极简、更暗、更低视觉层级。                                        │
│   与主场景同一世界观但更抽象。                                        │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   - 极简山水剪影（远山轮廓）                                         │
│   - 更深色的主调                                                    │
│   - 几乎单色（深绿到黑色渐变）                                       │
│   - 仅有微弱金色边缘光                                              │
│   - 雾感更重，细节更少                                              │
│                                                                     │
│ COMPOSITION RULES:                                                  │
│   - 极简构图，2-3 层远山/雾层                                        │
│   - 上方 50-60% 纯色渐变为 UI 留白                                  │
│   - 饱和度: < 0.2                                                   │
│   - 亮度: 0.3-0.5                                                   │
│                                                                     │
│ FORBIDDEN:                                                          │
│   同 PROMPT-001                                                     │
│                                                                     │
│ COLOR PALETTE:                                                      │
│   Primary:   #0A1A14 (深林黑)                                       │
│   Accent:    rgba(200, 162, 74, 0.1-0.2) (微金)                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PROMPT-003: aiqigu_landing_v1.webp

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-003: aiqigu_landing_v1.webp                                   │
│ 目标路径: apps/miniapp/static/scene/aiqigu_landing_v1.webp          │
│ 格式: WebP · 尺寸: 750×1624 px                                     │
│                                                                     │
│ NOTE:                                                               │
│   PROMPT-001 的 WebP 转码版本。                                      │
│   如果图像生成管线直接支持 WebP 输出，则直接输出 WebP。                │
│   否则，从 JPG 转码即可。                                            │
│                                                                     │
│ 优先级: 可降级 — 仅 JPG 也可接受                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 3.2 P1 PRODUCTION INPUTS

### PROMPT-004: aiqigu_street_v1.jpg

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-004: aiqigu_street_v1.jpg                                     │
│ 目标路径: apps/miniapp/static/scene/aiqigu_street_v1.jpg            │
│ 格式: JPEG · 尺寸: 750×1624 px                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   爱企谷街道/路径场景 —— 延伸景观。                                   │
│   与主场景同一世界观，从山谷入口向内延伸的视角。                      │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   - 延续 PROMPT-001 的美学                                          │
│   - 街道/路径/巷道的隐喻                                            │
│   - 更"向内"的视角（已穿过门）                                      │
│                                                                     │
│ FORBIDDEN: 同 PROMPT-001                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PROMPT-005: portal_ring_gold_v1.png

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-005: portal_ring_gold_v1.png                                  │
│ 目标路径: apps/miniapp/static/ui/portal_ring_gold_v1.png            │
│ 格式: PNG (带 alpha 通道) · 尺寸: 200×200 px                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   Portal 光环装饰纹理 —— 用于入口光环动画叠加。                      │
│   半透明金色环形纹理，用于 CSS 旋转动画。                             │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   - 同心圆环 / 轨道线                                               │
│   - 金色 (#C8A24A) 细线                                            │
│   - 透明度 0.1-0.3                                                  │
│   - 非实心 — 细线/虚线风格                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PROMPT-006: portal_mist_v1.png

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-006: portal_mist_v1.png                                       │
│ 目标路径: apps/miniapp/static/bg/portal_mist_v1.png                 │
│ 格式: PNG (带 alpha 通道) · 尺寸: 全屏宽幅                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   雾层背景纹理 —— 用于 Portal 区域的半透明雾状 overlay。             │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   - 半透明雾状纹理                                                   │
│   - 白色/金色渐变透明度                                              │
│   - 径向渐变或块状分布                                              │
│   - 非常淡 (opacity ~0.05-0.15)                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PROMPT-007: explore_card_glass_v1.png

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-007: explore_card_glass_v1.png                                │
│ 目标路径: apps/miniapp/static/ui/explore_card_glass_v1.png          │
│ 格式: PNG (带 alpha 通道) · 尺寸: 180×200 px                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   探索卡片玻璃质感纹理 overlay。                                     │
│   用于探索节点轮播卡片的背景纹理。                                    │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   - 毛玻璃/磨砂玻璃效果                                             │
│   - 金色边缘微光                                                    │
│   - 半透明，带细微反射条纹                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PROMPT-008: stat_panel_gold_glass_v1.png

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET-008: stat_panel_gold_glass_v1.png                             │
│ 目标路径: apps/miniapp/static/ui/stat_panel_gold_glass_v1.png       │
│ 格式: PNG (带 alpha 通道) · 尺寸: 280×140 px                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VISUAL INTENT:                                                      │
│   统计面板玻璃质感纹理 overlay。                                     │
│   用于 4 格数据统计卡片的背景纹理。                                   │
│                                                                     │
│ STYLE DIRECTION:                                                    │
│   同 PROMPT-007，水平方向延伸                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 3.3 P2 PRODUCTION INPUTS

### PROMPT-009 至 PROMPT-015: Icon System

```
┌─────────────────────────────────────────────────────────────────────┐
│ 统一规范 (适用于 ASSET-009 至 015)                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 格式: PNG (带 alpha 通道)                                           │
│ 风格: 金色细线风格 (gold line art)                                   │
│ 颜色: #C8A24A 金色                                                  │
│ 透明度: 0.6-0.8                                                     │
│ 线宽: 1-2px 细线                                                   │
│ 背景: 透明                                                          │
│ 圆角: 柔和无尖锐直角                                                 │
│                                                                     │
│ 具体图标:                                                           │
│                                                                     │
│ ASSET-009: wechat_login_gold_v1.png (36×36 px)                     │
│   → 微信品牌图标 — 简约微信气泡/对话符号                             │
│                                                                     │
│ ASSET-010: location_v1.png (32×32 px)                              │
│   → 位置/地图 pin 图标                                              │
│                                                                     │
│ ASSET-011: relic_v1.png (32×32 px)                                 │
│   → 信物/徽章/印记图标                                              │
│                                                                     │
│ ASSET-012: collectible_v1.png (32×32 px)                           │
│   → 藏品/收藏品图标                                                 │
│                                                                     │
│ ASSET-013: ar_v1.png (32×32 px)                                    │
│   → AR/扫描/摄像头图标                                              │
│                                                                     │
│ ASSET-014: frame_gold_v2.png (按卡片尺寸)                           │
│   → 信物详情金色装饰框 — 四角/边缘装饰                              │
│                                                                     │
│ ASSET-015: collectible_frame_v1.png (按卡片尺寸)                    │
│   → 藏品详情装饰框 — 四角/边缘装饰                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# STEP 4: FINAL DELIVERY CONTRACT

## 4.1 系统状态

```
┌────────────────────────────────────────────────────────────────┐
│                     VISUAL ASSET PRODUCTION                     │
│                     READY: YES                                  │
│                                                                │
│  All audit data is collected.                                  │
│  All paths are resolved.                                       │
│  All prompts are defined.                                      │
│  AI image generation pipeline can begin.                       │
└────────────────────────────────────────────────────────────────┘
```

## 4.2 阻塞项统计

| 类别 | 计数 |
|------|------|
| P0 阻塞（Landing 视觉完整） | **2**（aiqigu_landing_v1.jpg, landing_fallback.jpg） |
| P0 优化（WebP 转码） | **1**（aiqigu_landing_v1.webp） |
| P1 视觉增强 | **5** |
| P2 图标系统 | **7** |
| **核心资产总计** | **15** |
| P3 未来资产 | 10（不在本次交付范围） |

## 4.3 图像生成管线就绪状态

```
┌────────────────────────────────────────────────────────────────┐
│                     READY FOR IMAGE GENERATION                 │
│                     PIPELINE: YES                               │
│                                                                │
│  Pipeline can start from P0 assets.                           │
│  Each asset has:                                               │
│    ✓ Exact file name                                          │
│    ✓ Exact target path                                        │
│    ✓ Format specification                                     │
│    ✓ Size specification                                       │
│    ✓ Visual intent description                                │
│    ✓ Style direction                                          │
│    ✓ Composition rules                                        │
│    ✓ Color palette                                            │
│    ✓ Forbidden patterns                                       │
│    ✓ Canon/worldview constraints                              │
└────────────────────────────────────────────────────────────────┘
```

## 4.4 交付执行顺序（推荐）

```
ITERATION 1 (P0 — Landing becomes visual)
├── aiqigu_landing_v1.jpg    → /static/scene/
├── landing_fallback.jpg     → /static/scene/
└── aiqigu_landing_v1.webp   → /static/scene/ (从 JPG 转码)

→ 交付后效果：Landing Page 从纯渐变 → 显示爱企谷山谷场景

ITERATION 2 (P1 — Visual depth)
├── aiqigu_street_v1.jpg     → /static/scene/
├── portal_ring_gold_v1.png  → /static/ui/
├── portal_mist_v1.png       → /static/bg/
├── explore_card_glass_v1.png→ /static/ui/
└── stat_panel_gold_glass_v1.png→ /static/ui/

→ 交付后效果：Portal 区有纹理叠加，卡片有玻璃质感

ITERATION 3 (P2 — Icon system)
├── wechat_login_gold_v1.png → /static/icon/
├── location_v1.png          → /static/icon/
├── relic_v1.png             → /static/icon/
├── collectible_v1.png       → /static/icon/
├── ar_v1.png                → /static/icon/
├── frame_gold_v2.png        → /static/relic/
└── collectible_frame_v1.png → /static/collectible/

→ 交付后效果：图标统一为视觉品牌风格

POST-DELIVERY (Ops — one-time config change)
└── project.config.json → packOptions.include: [{ "type": "folder", "value": "static" }]
```

---

# 附录 A: 目录结构（交付后）

```
apps/miniapp/
├── static/                          ← NEW — 生产资产目录
│   ├── scene/
│   │   ├── aiqigu_landing_v1.jpg    ← P0 — 主场景
│   │   ├── aiqigu_landing_v1.webp   ← P0 — WebP 优化
│   │   ├── landing_fallback.jpg     ← P0 — 回退场景
│   │   └── aiqigu_street_v1.jpg     ← P1 — 街道扩展
│   ├── bg/
│   │   └── portal_mist_v1.png       ← P1 — 雾层纹理
│   ├── ui/
│   │   ├── portal_ring_gold_v1.png  ← P1 — 光环纹理
│   │   ├── explore_card_glass_v1.png← P1 — 卡片玻璃
│   │   └── stat_panel_gold_glass_v1.png← P1 — 面板玻璃
│   ├── icon/
│   │   ├── wechat_login_gold_v1.png ← P2 — 微信登录
│   │   ├── location_v1.png          ← P2 — 位置
│   │   ├── relic_v1.png             ← P2 — 信物
│   │   ├── collectible_v1.png       ← P2 — 藏品
│   │   └── ar_v1.png                ← P2 — AR
│   ├── relic/
│   │   └── frame_gold_v2.png        ← P2 — 信物框
│   └── collectible/
│       └── collectible_frame_v1.png ← P2 — 藏品框
├── project.config.json              ← 需要添加 static include
```

---

*合同生成于 2026-06-30 · 生成引擎：Cursor Agent · 生成模式：纯生产准备 · 零代码 / 零图像*
