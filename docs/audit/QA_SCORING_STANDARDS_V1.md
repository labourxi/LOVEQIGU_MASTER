# QA SCORING STANDARDS AND QUALITY ROOT CAUSE ANALYSIS V1

> **文档标识**: `QA_SCORING_STANDARDS_V1.md`
> **日期**: 2026-07-01 15:42
> **状态**: 分析报告 — 非冻结

---

## 1. 结论：出图质量不佳的根因

```
出图质量不佳的原因不是评分机制失效，而是评分标准太宽松。
```

具体来说：

| 根因 | 严重性 | 说明 |
|------|--------|------|
| **评分标准是规格合规检查，不是审美质量检查** | 🔴 核心问题 | QA 引擎检查的是"图片是否符合 spec 中写的关键词"，不是"图片看起来好不好" |
| **style_consistency 只查了 spec 关键词是否存在** | 🔴 高 | 只要 spec 中有 `oriental_mystic_sci_fi` 这个字符串，style 就给 0.85。不检查图片实际有没有 portal gate、粒子效果 |
| **clarity 只查分辨率和文件大小** | 🟡 中 | 750×1624、226KB 自动给高分。不检查模糊度、噪点、JPEG 压缩伪影 |
| **ui_fit 用 avg brightness 替代真实 UI 适配** | 🟡 中 | 平均亮度 36/255 → 自动判为"适合 UI 叠加"。不检查是否确实有空出 CTA 位置 |
| **completeness 只查了文件是否可打开** | 🔴 高 | 只要文件非空且 Pillow.verify() 不报错 → 0.85。不检查：画面是否完整、元素是否被截断、是否有 AI 伪影 |
| **评分引擎从未看到 layout 具体结构** | 🔴 高 | spec 要求"顶部的 AR游伴文字、底部的进入世界按钮、中心的 portal gate"——但 QA 引擎完全不验证这些元素是否实际存在于图片中 |
| **阈值太低** | 🟡 中 | 0.70 的阈值意味着即使 style_consistency 和 completeness 都接近硬编码默认值，也能通过 |

---

## 2. 评分标准来源追溯

| 评分维度 | 来源文档 | 原始定义 | 移植后实际实现 |
|---------|---------|---------|-------------|
| **style_consistency** | `apps/miniapp/core/visual-pipeline/qa_scoring_engine.js` L7-8 | "matches the LOVEQIGU ink-wash + gold accent visual direction" | Python 版改为检查 spec JSON 中的 theme/color_system/atmosphere 字符串存在性 |
| **clarity** | JS L70-101 | "readable at mobile portrait dimensions" — 检查 fileSize + aspectRatio | Python: fileSize>100000 + resolution>=750x1334 → 高 |
| **ui_fit** | JS L103-134 | "works as a background layer (not competing with UI)" — 检查类型 + 暗色背景 | Python: avg_brightness < 100 → 暗色适合 UI |
| **completeness** | JS L136-151 | "full scene, no cut-off elements, no obvious AI artifacts" | Python: 仅 fileSize>300 + verify() → 通过 |

---

## 3. 实际图片 vs spec 要求差距分析

| Spec 要求 | 图片实际表现 | 差距 | QA 是否检测到 |
|-----------|------------|------|-------------|
| deep_space_gradient 黑→靛蓝 | 平均 RGB(34,31,66) — 主要是深色 | ✅ 基本匹配 | ❌ 未检测（QA 不做像素分析） |
| energy_portal_gate 中心传送门 | 未知 — 需目视检查 | ❓ 无法自动判定 | ❌ QA 完全不验证中心元素 |
| 标题 "AR游伴" top_center | 未知 — 需目视检查 | ❓ 无法自动判定 | ❌ QA 不检查文字渲染 |
| 主 CTA "进入世界" bottom_center | 未知 | ❓ | ❌ |
| 副 CTA "故事" / "说明" | 未知 | ❓ | ❌ |
| floating_star_dust 粒子 | 未知 | ❓ | ❌ |
| 低 UI 密度 | 像素分布：66% 在 0-52 亮度，高对比区域很少 | ⚠️ 非常暗，但缺乏高光层次 | ❌ 亮度检测通过（亮了有问题，暗了才合格——逻辑颠倒） |

**像素色彩匹配分析：**

| Spec 颜色 | 占比 | 说明 |
|-----------|------|------|
| `#050510` (deep_black) | 33.5% | 大量深黑像素 |
| `#1A0A3E` (indigo) | 29.6% | 大量靛蓝像素 |
| `#7B2D8E` (violet) | 0.4% | 紫色点缀极少 |
| `#E8C86A` (gold_light) | 0.1% | 金色高光极少 |

> 图片 63% 的像素集中在深黑/靛蓝，但紫色点缀和金色高光几乎不存在。这意味着 spec 要求的 "violet-to-gold gradient portal" 可能没有充分呈现。

---

## 4. 评分机制的根本缺陷

### 缺陷 1：评分基于 spec 文本，不是基于图片内容

```
┌─ QA 实际做的事情 ──────────────────────────────────┐
│                                                     │
│  evaluate_style_consistency(spec) {                 │
│    if "sci_fi" in spec.theme: score = 0.85         │
│    return { pass: true, score: 0.85 }              │
│  }                                                  │
│                                                     │
│  → 完全不看图片                                     │
│  → 图片是空白画布也得 0.85                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 缺陷 2：硬编码默认值掩盖低质量

`evaluate_style_consistency` 起始值 0.85。`evaluate_ui_fit` 起始值 0.85。`evaluate_completeness` 起始值 0.85。三个维度总和权重 0.75，加权后基础得分 = 0.85 × 0.75 = **0.6375**。只有 clarity 是审计驱动的（起始 1.0，扣分才降低）。

这意味着：**即使所有三个规格检查维度都完全不做有意义检测，仅靠默认值 + clarity，得分已经接近通过线。**

### 缺陷 3：亮度检测逻辑颠倒

```
当前逻辑:  avg_brightness < 100 → "dark-toned — good for UI overlay"
真实需求:  需要检查图片是否存在内容，不是有多暗

一张纯黑图片 (brightness = 0) 在此检测中得分最高。
```

### 缺陷 4：无 AI 伪影检测

Seedream / Jimeng 等模型生成的图片可能有：
- 文字渲染错误（乱码、残缺）
- 元素重叠
- 透视错误
- 过度平滑区域
- 重复纹理

当前 QA 完全不检查这些。

---

## 5. 建议的评分标准改进方向

| 当前维度 | 当前扣分逻辑 | 建议改进 |
|---------|------------|---------|
| style_consistency | 仅检查 JSON 关键词存在性 | 增加像素色彩分析：检查 spec 中每种 color 的实际占比是否符合预期 |
| clarity | 尺寸 + 文件大小 | 增加：拉普拉斯方差（模糊度检测）、JPEG 块效应检测 |
| ui_fit | 平均亮度 | 改为：内容区域检测（非纯暗即可）、上下区域是否有信息 |
| completeness | 文件存在 + verify() | 增加：边缘截断检测、元素计数（简单连通域分析） |
| **新增** portal_presence | 无 | 中心区域 180×180 是否有高对比度结构（portal gate） |
| **新增** text_rendering | 无 | 亮色小区域计数（"AR游伴"等文字像素点） |

---

## 6. 当前评分引擎的完整参考来源

| 组件 | 文件路径 | 语言 | 版本 |
|------|---------|------|------|
| JS 原始引擎 | `apps/miniapp/core/visual-pipeline/qa_scoring_engine.js` | JavaScript | V1 |
| Python 移植引擎 | `scripts/qa_scoring_engine.py` | Python | V1（移植版） |
| QA 门禁模块 | `scripts/pipeline_step3_qa.py` | Python | V1 |
| 权重定义 | 两引擎均内嵌 `QA_WEIGHTS` | — | style 0.35, clarity 0.25, ui_fit 0.25, completeness 0.15 |
| 阈值 | 两引擎均硬编码 | — | 0.70 |
| spec 参考 | `assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json` | JSON | V1 |
| 结构规格 | `docs/structure/STRUCTURE_SPEC_LANDING_V1.md` | Markdown | V1 |

---

## 7. 客观评分方法 vs 主观质量

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  客观评分（当前系统做的）                    主观质量（用户需要的）│
│  ─────────────────────────                    ──────────────────│
│  ✓ 文件存在                                  ✓ "看起来好"        │
│  ✓ 分辨率达标                                ✓ 色彩和谐          │
│  ✓ 非空文件                                  ✓ 文字可读          │
│  ✓ 暗色调背景                                ✓ 构图平衡          │
│  ✓ JSON 关键词匹配                           ✓ 无 AI 伪影        │
│  ✓ 格式正确                                  ✓ 氛围到位          │
│                                              ✓ 符合品牌调性      │
│                                                                 │
│  当前系统可以确保"文件没问题"                                   │
│  但无法确保"图片质量好"                                         │
│                                                                 │
│  两者之间的差距就是用户感觉"出图质量不佳"的原因                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*报告生成于 2026-07-01 15:42 · 分析引擎：Cursor Agent · 模式：根因分析 / 非冻结*
