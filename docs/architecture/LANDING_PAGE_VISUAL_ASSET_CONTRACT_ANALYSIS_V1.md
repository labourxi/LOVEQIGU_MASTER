# LANDING_PAGE_VISUAL_ASSET_CONTRACT_ANALYSIS_V1

> **爱企谷 Landing Page ChatGPT VISUAL_ASSET_CONTRACT_V1 方案分析报告**  
> **文件标识**：`LANDING_PAGE_VISUAL_ASSET_CONTRACT_ANALYSIS_V1.md`  
> **版本**：V1.0  
> **日期**：2026-06-30  
> **状态**：Active · 分析报告  
> **性质**：技术分析 · 不修改 Canon · 不修改资产定义 · 不改代码  

---

## §0 背景

ChatGPT 在"图片缺失"问题讨论后，给出了第二份产物：**`VISUAL_ASSET_CONTRACT_V1`（冻结版）**。

这份文档与之前的方案（`LANDING_PAGE_ASSET_SYSTEM_ANALYSIS_V1.md` 所分析的）不同——不再是工程修复指令，而是**产品级视觉资产规范**。

本文档分析其正确性和可执行性。

---

## §1 文档结构概述

ChatGPT 的 `VISUAL_ASSET_CONTRACT_V1` 包含 8 个章节：

| 章节 | 内容 |
|------|------|
| §1 总原则 | 图片不是运行依赖，但必须有视觉表达；资产分级（P0/P1/P2） |
| §2 必备视觉资产 | 5 个 P0 资产，含文件名建议 |
| §3 增强视觉资产 | 3 个 P1 资产，推荐但不必须 |
| §4 fallback 规则 | 图片缺失时的分层行为 |
| §5 UI 渲染规则 | 优先级链 |
| §6 禁止行为 | Cursor 不允许做的操作 |
| §7 验收标准 | 视觉/功能/世界观三维度 |
| §8 执行指令 | Cursor 引用规则 |

---

## §2 逐项分析

### 2.1 §1 总原则

#### "图片不是运行依赖，但必须存在视觉表达"

**判定：✅ 正确**

ChatGPT 准确地区分了"工程原则"和"产品要求"两个维度。这与当前的代码状态一致：

- 工程层：`onLoad` 第一行即设置 `uiReady: true`，零图片依赖（已实现）
- 产品层：Landing Page 必须传递世界观氛围，不能是纯数据面板（当前仅 gradient，缺真实视觉）

#### 视觉资产分级（P0 / P1 / P2）

**判定：✅ 方向正确，但定义需要对齐现有代码**

ChatGPT 定义了三级：

| 等级 | 判定 | 问题 |
|------|------|------|
| P0：世界观入口视觉 | ✅ 合理 | |
| P1：场景增强视觉 | ✅ 合理 | |
| P2：装饰类元素 | ✅ 合理 | |

---

### 2.2 §2 必备视觉资产清单

#### P0-1：主背景世界图

**要求**：东方幻想 / 爱企谷世界观 / 全屏 / 非纯渐变

**建议文件名**：`/assets/scene/aiqigu_landing_hero.jpg`

**判定：✅ 内容正确，❌ 路径错误**

当前代码中 asset map 指向 `/images/scene/aiqigu_landing_v1.jpg`。ChatGPT 建议的是 `/assets/scene/aiqigu_landing_hero.jpg`。路径不统一。如果实施，需要决定一个规范路径，不能在两个地方用不同的前缀。

**实际需要解决的问题**：无论 `/images/` 还是 `/assets/`，文件都不存在。这是设计团队交付问题，不是代码问题。

#### P0-2：世界入口中心符号图

**用途**：`爱企谷 / AIGU VALLEY` 上方视觉中心 / 星图 / 能量结构

**建议文件名**：`/assets/ui/world_core_symbol.png`

**判定：✅ 有产品价值，但当前 Portal 已实现**

当前 WXML 中的 `lp-intro__portal` 区域（第 71-75 行）已经包含：

```html
<view class="lp-intro__portal">
  <view class="lp-intro__ring"></view>    <!-- 旋转光环 -->
  <view class="lp-intro__core"></view>    <!-- 光点核心 -->
  <view class="lp-intro__particles"></view>
</view>
```

这部分使用纯 CSS 实现了旋转光环 + 核心光点 + 粒子效果，没有图片依赖。ChatGPT 建议的是用真实 PNG 图片替代 CSS 模拟。这属于**视觉增强**，不是必须的。

#### P0-3：10 个探索节点 icon

**要求**：每个节点有真实图标 / 统一风格

**建议文件名**：`/assets/nodes/node_01.png` ～ `node_10.png`

**判定：✅ 有产品价值，但当前 carousel 无 icon slot**

当前 carousel 渲染（WXML 第 111-124 行）的每个节点卡片包含：

- `lp-carousel__dot` — 仅有色圆点（样式来自 `item.themeColor`）
- `lp-carousel__name` — 节点名称
- `lp-carousel__subtitle` — 副标题
- `lp-carousel__region` — 区域
- `lp-carousel__status` — 状态标签

**没有图片 slot**。如果要实施 P0-3，需要：
- 在 `buildCarouselItems()` 中添加 `icon` 字段
- 在 `node` 的种子数据（`world_seed_v1.js`）中添加每个节点的图标路径
- 在 WXML 中添加 `<image>` 元素

这是一个产品改动，不是"修 bug"。

#### P0-4：登录入口视觉（微信登录按钮背景）

**要求**：半透明光层或玉质按钮背景

**建议文件名**：`/assets/ui/login_button_bg.png`

**判定：❌ 不必要（CSS 已实现等效效果）**

当前登录按钮 CSS（WXSS 第 622-643 行）：

```css
.lp-login-fixed__btn {
  background: rgba(200, 162, 74, 0.09);
  border: 1rpx solid rgba(200, 162, 74, 0.18);
  color: #C8A24A;
  box-shadow:
    0 0 60rpx rgba(200, 162, 74, 0.04),
    inset 0 0 40rpx rgba(200, 162, 74, 0.02);
}
```

这已经实现了金玉质感的半透明按钮（金色边框 + 光晕 + 内发光）。用图片替代反而会增加一个网络请求和潜在失败点，且 CSS 实现的按钮在视觉上已经符合"玉质"要求。

#### P0-5：世界加载态视觉（Loading Scene）

**用途**：`世界正在显现...`

**建议文件名**：`/assets/scene/world_loading.jpg`

**判定：❌ 不必要（skeleton 已实现）**

当前 skeleton loading（WXML 第 27-31 行）包含：

- `lp-skeleton__bg` — 背景占位
- `lp-skeleton__title` — 标题占位
- `lp-skeleton__stats` — 统计面板占位
- `lp-skeleton__cta` — CTA 按钮占位

全部使用 CSS shimmer 动画（WXSS 第 85-88 行），不需要图片。Loading 的 `世界正在显现...` 文本在 `lp-intro__verse` 中始终显示（WXML 第 78 行）。

---

### 2.3 §3 P1 增强视觉资产

| 资产 | 判定 | 说明 |
|------|------|------|
| 卡片背景纹理 | ✅ 可选但可做 | 当前 card 是 glass morphism（`backdrop-filter: blur`），有图片纹理可以增强，但不是必须 |
| 渐变雾层 overlay | ❌ 不必要 | CSS fog 层（`lp-bg__fog` × 3 + 粒子 + 暖光 + 光线）已经用纯 CSS 实现完整的雾层效果 |
| 光点粒子贴图 | ❌ 不必要 | `lp-bg__particles` 使用 CSS `radial-gradient` 生成粒子，有动画，不需要贴图 |

---

### 2.4 §4 fallback 规则

#### "图片缺失行为必须遵守：if (imgFail) { useGradientFallback(); logWarning(); }"

**判定：✅ 已实现**

当前 `onImgError` 的完整逻辑：

```javascript
onImgError: function (e) {
  if (this._fallbackAttempted) {
    // 二次失败 → gradient fallback（零文件依赖）
    this.setData({ bgImage: '', _bgGradient: '...' });
    return;
  }
  this._fallbackAttempted = true;
  // 一次失败 → fallback 图片
  this.setData({ bgImage: fallback });
}
```

符合 ChatGPT 的要求，甚至更稳健（有 `_fallbackAttempted` 防止无限循环）。

---

### 2.5 §5 UI 渲染规则

#### Landing 背景优先级：P0 hero image → fallback gradient

**判定：✅ 已实现**

当前渲染路径：

```
bgImage 有值 → <image> + CSS background-image（P0）
bgImage 为空 → CSS gradient（fallback）
```

#### 节点渲染：icon image > emoji fallback > text fallback

**判定：❌ 未实现，但当前 carousel 无图片需求**

当前 carousel 没有 icon slot，也没有 emoji fallback。如果要实现这条规则，需要产品决策——是否值得为 10 个节点引入 icon 图片。

#### 登录按钮：image button bg > CSS button > text button

**判定：❌ 过于复杂，当前 CSS button 已满足要求**

ChatGPT 的三级降级（图片 → CSS → 纯文本）在实践中对登录按钮是过度设计。CSS 按钮已经是"有图增强、无图可用"的状态，不需要再增加一个纯文本按钮层。

---

### 2.6 §6 禁止行为

| 禁止项 | 判定 | 说明 |
|--------|------|------|
| 删除 image 只用 gradient | ✅ 合理 | 产品层需要真实图片，不能完全删除 |
| 纯文字替代节点 icon | ✅ 合理 | 但当前 carousel 没有 icon，需要先决定是否加 |
| UI 卡片完全无纹理 | ✅ 合理 | 当前有 glass morphism + 边框 + 光晕，已有纹理感 |
| Landing 变成"数据面板风格" | ✅ 合理 | 当前有入口视觉（portal + 文字 + 背景层），已经是世界观风格 |

---

### 2.7 §7 验收标准

#### 视觉成立标准：一眼可识别"世界观入口"

**当前状态：⚠️ 无图时仅部分满足**

降级后 CSS gradient 无法提供"东方幻想入口"的视觉叙事。需要真实图片才能完全满足。

#### 有至少 3 层视觉深度（背景 / 中层 / UI）

**当前状态：✅ 满足**

当前渲染层（WXML 第 40-65 行）：

| 层级 | 元素 |
|------|------|
| 背景 | `lp-bg__image` / `lp-bg__scene` / `lp-bg__depth` |
| 中层 | `lp-bg__fog` × 3 / `lp-bg__warm-light` / `lp-bg__light-rays` / `lp-bg__particles` |
| UI | `lp-intro` / `lp-stats` / `lp-carousel-wrap` / `lp-actions` / `lp-login-fixed` |

**3 层视觉深度已实现。**

#### 功能成立标准：无图可运行 ✔ 有图更沉浸 ✔✔

**当前状态：✅ 满足**

无图时已验证可正常运行。有图时通过 `onImgError` 的 fallback 机制可以正常显示。

#### 世界观成立标准：用户感知为"进入一个世界"而非"打开一个小程序页面"

**当前状态：⚠️ 无图时仅部分满足**

CSS 实现的视觉（深色背景 + 金色光晕 + 旋转 Portal + 雾层漂移 + 粒子）在一定程度上传递了世界观感。但缺少真实场景图片时，与"进入一个世界"的目标仍有差距。这只能由图片资产填补。

---

## §3 宏观评判

### 3.1 这份文档的价值

ChatGPT 这份 `VISUAL_ASSET_CONTRACT_V1` 的**主要价值在于产品层面**：

1. **明确了视觉资产分级**（P0/P1/P2）—— 当前代码没有一个冻结的资产优先级
2. **提出了清晰的验收标准**（视觉成立 / 功能成立 / 世界观成立）
3. **强调了"世界观入口"的产品目标** —— 系统已经稳定，现在问题是"世界的脸"

### 3.2 这份文档的问题

1. **文件名路径不统一**：建议用 `/assets/scene/`，当前代码用 `/images/scene/`
2. **部分资产必要性存疑**（P0-4 登录按钮背景、P0-5 loading 图片、P1-2 雾层、P1-3 粒子）
3. **缺少 WXML 集成方案**：10 个节点 icon 需要新加 `<image>` slot，不是"替换现有"操作
4. **没有考虑 WeChat Mini Program 的图片加载机制**：`<image>` 组件需要设置 `mode`、`lazy-load`、`webp` 等属性

### 3.3 可作为规范的部分

以下内容可以直接冻结为产品规范：

| 可冻结项 | 来源 |
|---------|------|
| 资产分级标准（P0/P1/P2） | §1.2 |
| 验收三维度（视觉/功能/世界观） | §7 |
| fallback 行为原则 | §4 |
| P0-1 必须存在（主背景图） | §2 |
| P0-3 节点 icon（问题待产品确认） | §2 |

以下内容**不应直接使用**：

| 不适用的项 | 原因 |
|-----------|------|
| 具体的文件名和路径 | 不匹配现有代码规范（`/images/` vs `/assets/`） |
| P0-4 登录按钮图片 | CSS 已实现且更优 |
| P0-5 loading 图片 | Skeleton CSS 已实现且更优 |
| P1-2 雾层 overlay | CSS fog 层已实现 |
| P1-3 粒子贴图 | CSS particles 已实现 |
| §4 的 `blur + gradient` 分层 | 没有实际应用场景（loading 后直接显示 UI） |
| §5 登录按钮的三级降级 | 过度设计 |

---

## §4 结论

### 4.1 这份文档是否可以执行？

**部分可执行。**

| 可执行部分 | 需要产品讨论的部分 |
|-----------|------------------|
| 冻结 P0-1 主背景图的规格 | P0-3 节点 icon 是否需要（当前 carousel 无 icon） |
| 冻结 §1.2 资产分级标准 | 路径规范（`/images/` vs `/assets/`） |
| 冻结 §7 验收三维度 | |
| 将当前代码的对齐状态写入 contract | |

### 4.2 与当前代码的对齐度

| ChatGPT 要求 | 当前代码状态 |
|-------------|------------|
| "图片不是运行依赖" | ✅ 已实现（`onImgError` → gradient fallback） |
| "必须有视觉表达" | ⚠️ 无图时 gradient 表达，有图时需补文件 |
| "至少 3 层视觉深度" | ✅ 已实现（背景/中层/UI） |
| "无图可运行" | ✅ 已验证 |
| "节点 icon" | ❌ 未实现（无 icon slot） |
| P0-1 主背景图 | 文件不存在，需设计交付 |
| "世界观入口"感知 | ⚠️ 无图时无法完全满足 |

### 4.3 一句话总结

> 这份文档是一个**合格的产品视觉规范提案**，可以作为产品团队和设计团队的交付标准。但作为"Cursor 可执行指令"，约 **40% 的内容需要调整后才能对接现有代码**（路径统一、区分 CSS 已实现项、增加 WXML 集成方案）。**不可直接作为代码执行。**

---

## 附录 · 参考文件

| 文件 | 位置 |
|------|------|
| Landing Page (JS) | `apps/miniapp/pages/landing/index.js` |
| Landing Page (WXML) | `apps/miniapp/pages/landing/index.wxml` |
| Landing Page (WXSS) | `apps/miniapp/pages/landing/index.wxss` |
| Asset Resolver | `apps/miniapp/core/ui-spec-runtime/asset-resolver.js` |
| 资产系统分析报告 | `docs/architecture/LANDING_PAGE_ASSET_SYSTEM_ANALYSIS_V1.md` |
| ChatGPT 方案分析报告 | `docs/architecture/LANDING_PAGE_CHATGPT_SOLUTION_ANALYSIS_V1.md` |
| Agent Rules | `AGENTS.md` |

---

*本报告基于代码审计、ChatGPT 方案比对和产品逻辑推演。未修改任何源文件。*
