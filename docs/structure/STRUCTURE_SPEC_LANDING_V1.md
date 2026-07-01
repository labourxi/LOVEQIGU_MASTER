# LANDING PAGE V1 — STRUCTURE_SPEC (APPROVED)

> **文档标识**: `STRUCTURE_SPEC_LANDING_V1.md`
> **版本**: V1
> **日期**: 2026-07-01
> **状态**: **STRUCTURE_APPROVED** (2026-07-01 14:12)
> **管线步骤**: VISUAL_PRODUCTION_PIPELINE_V3 — STEP 0 (STRUCTURE DESIGN) + STEP 1 (STRUCTURE APPROVAL)
> **GATE**: ✅ APPROVED — 可进入 STEP 2 (FULL PAGE VISUAL GENERATION)

---

## 1. 设计意图

本结构规格定义 Landing page "AR游伴" 的视觉设计方向。

与当前已实现的 Landing Page (`apps/miniapp/pages/landing/`) 的不同之处：

| 维度 | 当前实现 | 本规格 |
|------|---------|--------|
| 品牌标题 | "爱企谷" (AIGU VALLEY) | "AR游伴" |
| 视觉主题 | 东方水墨 + 雾谷 + 暖金 | 东方神秘科幻 + 太空 + 能量传送门 |
| 色彩系统 | `#0A1A14` (深林黑) + `#C8A24A` (暖金) | black / indigo / violet / gold_light |
| 材质 | 雾层 + 玻璃态 | 能量雾 + 玻璃 + 霓虹 |
| 氛围 | 神圣 / 古老 / 游离 | 神圣未来主义 / 太空 |
| CTA | "微信一键登录" | "进入世界" |
| 副操作 | 无 | "故事" + "说明" |

> **注意**: 本结构规格可能构成对当前冻结管线的一次全新视觉生产循环。已冻结的资产（静态场景图、图标等）可能被此新视觉稿替换。

---

## 2. 页面规格（原始 JSON）

```json
{
  "task_type": "full_page_render",
  "page_id": "landing_v1",
  "output_mode": "single_image",
  "aspect_ratio": "9:16",
  "style_profile": {
    "theme": "oriental_mystic_sci_fi",
    "color_system": ["deep_black", "indigo", "violet", "gold_light"],
    "lighting": "volumetric_soft_glow",
    "material": "energy_mist_glass_neon",
    "atmosphere": "sacred_futuristic_space",
    "motion_hint": "slow_particle_flow"
  },
  "layout": {
    "type": "full_page_ui",
    "background": "deep_space_gradient_black_to_indigo",
    "center_focus": "energy_portal_gate",
    "ui_density": "very_low",
    "composition_rule": "center_dominant_symmetry"
  },
  "ui": {
    "title": {
      "text": "AR游伴",
      "position": "top_center",
      "style": "thin_white_glow_text"
    },
    "primary_cta": {
      "text": "进入世界",
      "position": "bottom_center",
      "style": "glowing_energy_button"
    },
    "secondary_cta": [
      {
        "text": "故事",
        "position": "bottom_left"
      },
      {
        "text": "说明",
        "position": "bottom_right"
      }
    ]
  },
  "assets": {
    "background": "procedural_cosmic_field",
    "center_object": "rotating_energy_portal",
    "particles": "floating_star_dust",
    "ui_elements": "minimal_glow_interface_set"
  },
  "render_rules": {
    "must_be_single_image": true,
    "no_component_separation": true,
    "no_ui_relayout_allowed": true,
    "must_follow_layout_exactly": true,
    "no_placeholder_assets": true,
    "production_grade_only": true
  },
  "visual_priority": {
    "center_anchor": "energy_portal_gate — STRICT DOMINANCE. Portal occupies 60-70% of visual weight. Background must not compete.",
    "ui_suppression": "UI elements (title, CTAs) occupy <15% of total canvas area. Background must NOT add decorative elements in top 20% or bottom 25% of canvas.",
    "background_non_competition": "Background is strictly a canvas. No foreground objects. No complex textures. No competing focal points. Gradient + particles only.",
    "z_order_enforcement": "Background → Particles → Portal → [All UI elements] must be strictly separated layers. Portal must NOT overlap UI zones."
  }
}
```

---

## 3. 样式档案（Style Profile）

| 维度 | 值 | 说明 |
|------|-----|------|
| 主题 | `oriental_mystic_sci_fi` | 东方神秘科幻 — 东方哲学意象 + 未来主义视觉语言 |
| 色彩 | deep_black / indigo / violet / gold_light | 深黑为底 → 靛蓝过渡 → 紫罗兰点缀 → 金光辉光 |
| 光照 | volumetric_soft_glow | 体积光、软辉光 — 非硬边缘光照 |
| 材质 | energy_mist_glass_neon | 能量雾（半透明光雾）、玻璃（折射/反射）、霓虹（自发光边缘） |
| 氛围 | sacred_futuristic_space | 神圣未来主义太空感 — 庄重、空灵、非科幻战斗风格 |
| 动感提示 | slow_particle_flow | 慢速粒子流 — 非快速动态，强调静止中的流动感 |

---

## 4. 布局规格（Layout）

| 维度 | 值 | 说明 |
|------|-----|------|
| 类型 | full_page_ui | 全页 UI，非纯背景图 |
| 背景 | deep_space_gradient_black_to_indigo | 深空渐变：顶部深黑 → 底部靛蓝 |
| 中心焦点 | energy_portal_gate | 能量传送门 — 页面视觉核心 |
| UI 密度 | very_low | 极低 UI 密度 — 内容呼吸感，留白为主 |
| 构图规则 | center_dominant_symmetry | 中心主导对称构图 |

### 4.1 页面层级结构

```
┌─────────────────────────────┐
│        TOP AREA             │  UI 层
│    "AR游伴" 标题            │  薄白辉光文字
│        top_center           │
├─────────────────────────────┤
│                             │
│                             │
│     ENERGY PORTAL           │  视觉核心
│        GATE                 │  旋转能量传送门
│        center               │
│                             │
│     floating_star_dust      │  粒子系统
│                             │
├─────────────────────────────┤
│  故事       说明            │  副 CTA
│  bottom_L   bottom_R        │
│                             │
│     [ 进入世界 ]            │  主 CTA
│     glowing_energy_button   │  发光能量按钮
│        bottom_center        │
└─────────────────────────────┘

图层顺序（从底到顶）:
  1. 深空渐变背景 (deep_space_gradient_black_to_indigo)
  2. 浮动静星尘粒子 (floating_star_dust)
  3. 能量传送门 (rotating_energy_portal) — 中心
  4. "AR游伴" 标题 — top_center
  5. 副 CTA "故事" / "说明" — bottom_left / bottom_right
  6. 主 CTA "进入世界" — bottom_center
```

---

## 5. 设计令牌（Design Tokens）

| Token | 值 | 用途 |
|-------|-----|------|
| `color_bg_primary` | `#050510` (deep_black) | 背景主色 — 顶部 |
| `color_bg_secondary` | `#1A0A3E` (indigo) | 背景过渡色 — 底部 |
| `color_accent_violet` | `#7B2D8E` (violet) | 辅助点缀色 |
| `color_accent_gold` | `#E8C86A` (gold_light) | 辉光强调色 |
| `color_text_primary` | `rgba(255,255,255,0.92)` | 主要文字 |
| `color_text_glow` | `rgba(255,255,255,0.6)` | 辉光文字 |
| `font_title` | `27px` / `thin` / `glow` | "AR游伴" 标题 |
| `font_cta_primary` | `16px` / `medium` / `glow` | 主按钮文字 |
| `font_cta_secondary` | `12px` / `light` | 副按钮文字 |
| `spacing_top_safe` | `60px` | 顶部安全间距 |
| `spacing_bottom_safe` | `40px` | 底部安全间距 |
| `portal_size` | `180px` × `180px` | 传送门视觉尺寸 |

---

## 6. 渲染规则

| 规则 | 强制 | 说明 |
|------|------|------|
| must_be_single_image | ✅ | 输出为单张完整图片，非拆分组件 |
| no_component_separation | ✅ | 不允许分组件渲染后拼接 |
| no_ui_relayout_allowed | ✅ | 不允许 AI 自行重新布局 — 严格遵循 layout 定义 |
| must_follow_layout_exactly | ✅ | 精确遵循层级结构 |
| no_placeholder_assets | ✅ | 不允许占位符 — 所有元素需生产级渲染 |
| production_grade_only | ✅ | 仅生产级质量 |

---

## 7. 管线移交

```
STEP 0: STRUCTURE DESIGN     → 本文档（STRUCTURE_SPEC_LANDING_V1.md）✅ 完成
STEP 1: STRUCTURE APPROVAL   → 人工审批 ✅ APPROVED (2026-07-01 14:12)
                              ↓
NEXT:  STEP 2: FULL PAGE VISUAL GENERATION
       → 输入: 本结构规格
       → 执行引擎: AI IMAGE SYSTEM
       → 产出: FULL_PAGE_VISUAL (9:16 单张全页视觉稿)
       → GATE: 移交至 STEP 3 VISUAL QA
```

---

## 8. 结构审批签名

```
STRUCTURE_SPEC:  LANDING_V1
审批日期:         2026-07-01 14:12
审批状态:         ✅ APPROVED
审批引擎:         HUMAN (via STRUCTURE_SPEC document as approved input)
GATE:             UNLOCKED — 可进入 STEP 2 FULL PAGE VISUAL GENERATION
```

---

*规格生成于 2026-07-01 14:12 · 管线步骤：VISUAL_PRODUCTION_PIPELINE_V3 STEP 0–1 · 状态：APPROVED*
