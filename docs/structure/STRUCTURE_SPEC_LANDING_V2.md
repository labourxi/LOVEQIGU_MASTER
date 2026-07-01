# LANDING PAGE V2 — WORLD ENTRY VERSION (STRUCTURE_SPEC)

> **文档标识**: `STRUCTURE_SPEC_LANDING_V2.md`
> **版本**: V2 — WORLD ENTRY
> **日期**: 2026-07-01 17:01
> **状态**: **STRUCTURE_APPROVED** (本文件即主动输入)
> **管线步骤**: VISUAL_PRODUCTION_PIPELINE_V3 — STEP 0 (STRUCTURE DESIGN) + STEP 1 (STRUCTURE APPROVAL)
> **GATE**: ✅ APPROVED — 可进入 STEP 2 (FULL PAGE VISUAL GENERATION)

---

## 1. 设计意图

V2 的核心转变：将 Landing Page 从 **"产品入口 UI"** 升级为 **"世界系统召唤仪式"**。

| 维度 | V1 (产品入口) | V2 (世界入口) |
|------|--------------|--------------|
| 角色 | 用户 → 点击进入 App | 用户 → 被召唤进入世界 |
| 视觉重心 | 传送门占 60–70% | 传送门占 75–85% |
| UI 密度 | < 15% | < 10% — 符号级别 |
| CTA 语言 | "进入世界" / "故事" / "说明" | 仪式/召唤语言 |
| 背景角色 | 装饰性深空 | 纯粹氛围 — 无任何竞争元素 |
| 传送门风格 | 能量旋转门 | 世界入口门 — 更宏大、更庄严 |
| 整体氛围 | 神圣未来主义 | 世界降神 / 维度入口 |

**核心原则**：页面不是"用户操作入口"，而是"世界系统在用户面前的显现"。

---

## 2. 页面规格 (JSON)

```json
{
  "task_type": "full_page_render",
  "page_id": "landing_v2_world_entry",
  "output_mode": "single_image",
  "aspect_ratio": "9:16",
  "style_profile": {
    "theme": "world_entry_invocation",
    "color_system": ["deep_black", "indigo_violet", "ethereal_gold", "void_dark"],
    "lighting": "volumetric_divine_glow",
    "material": "dimensional_gate_energy",
    "atmosphere": "world_descending_sacred",
    "motion_hint": "slow_portal_resonance"
  },
  "layout": {
    "type": "full_page_ui",
    "background": "pure_void_gradient_deepest_black_to_indigo_violet",
    "center_focus": "world_entry_portal_gate",
    "ui_density": "symbolic_only",
    "composition_rule": "portal_dominant_95_percent"
  },
  "ui": {
    "title": {
      "text": "AR游伴",
      "position": "top_center",
      "style": "ritual_light_script_divine_glow",
      "visual_weight": "minimal_signature"
    },
    "primary_ritual": {
      "text": "谒见世界",
      "position": "bottom_center",
      "style": "invocation_glyph_gate_ring",
      "visual_weight": "symbolic_presence"
    },
    "secondary_ritual": [
      {
        "text": "往世书",
        "position": "bottom_left",
        "style": "ancient_script_fragment"
      },
      {
        "text": "启明录",
        "position": "bottom_right",
        "style": "light_inscription"
      }
    ]
  },
  "assets": {
    "background": "void_field_empty_pure_gradient",
    "center_object": "world_entry_gate_transdimensional",
    "particles": "resonance_energy_dust",
    "ui_elements": "ritual_glyph_set_symbolic"
  },
  "render_rules": {
    "must_be_single_image": true,
    "no_component_separation": true,
    "no_ui_relayout_allowed": true,
    "must_follow_layout_exactly": true,
    "no_placeholder_assets": true,
    "production_grade_only": true,
    "portal_must_be_world_entry_not_tech_portal": true,
    "ui_is_symbolic_not_functional": true
  },
  "visual_priority": {
    "center_anchor": "world_entry_portal_gate — ABSOLUTE DOMINANCE. Portal occupies 75-85% of visual weight. Portal is the ONLY visual subject. Background is void — no competition whatsoever.",
    "ui_suppression": "UI elements occupy <10% of total canvas area — symbolic layer only, not functional. Title and CTAs are fragments of invocation script, NOT product UI. Top 15% of canvas: ONLY title glyph. Bottom 20% of canvas: ONLY ritual CTAs. No decorative elements anywhere.",
    "background_non_competition": "Background is STRICTLY void canvas. The deepest black (#050505) fading to indigo void (#0F0530). Zero foreground objects. Zero textures. Zero competing shapes. Only the portal exists as visual content.",
    "z_order_enforcement": "Background (pure void) → Resonance particles (minimal, only near portal rim) → World entry gate (center, absolute dominance) → Ritual glyph UI layer (symbolic fragments only). Gate must NEVER overlap ritual text zones."
  }
}
```

---

## 3. 升级变换对照

| 元素 | V1 | V2 (世界入口) |
|------|----|--------------|
| title | "AR游伴" — 薄白辉光 | "AR游伴" — 仪式光文 / 神圣辉光 |
| primary CTA | "进入世界" — 发光能量按钮 | "谒见世界" — 召唤符文门环 |
| sec CTA L | "故事" | "往世书" — 古代经文碎片 |
| sec CTA R | "说明" | "启明录" — 光之铭文 |
| portal 权重 | 60-70% | 75-85% |
| UI 密度 | <15% | <10% — 纯符号层 |
| 背景 | 深空渐变 + 星尘粒子 | 虚空纯渐变 — 零竞争 |
| 用户角色 | 操作者 | 被召唤者 |

---

## 4. 样式档案（Style Profile）

| 维度 | 值 | 说明 |
|------|-----|------|
| 主题 | `world_entry_invocation` | 世界入口召唤 — 非科幻、非产品、非游戏 |
| 色彩 | deep_black / indigo_violet / ethereal_gold / void_dark | 虚空黑为底、靛紫过渡、空灵金为 portal 色 |
| 光照 | volumetric_divine_glow | 体积神光 — 神圣而非科技感的辉光 |
| 材质 | dimensional_gate_energy | 维度门能量 — 超越物质世界的视觉语言 |
| 氛围 | world_descending_sacred | 世界降临 — 庄严、敬畏、非战斗 |
| 动感提示 | slow_portal_resonance | 慢速传送门共振 — 脉冲式而非流动式 |

---

## 5. 布局规格（Layout）

```
┌─────────────────────────────┐
│       AR游伴                │  仪式光文 / 符号层
│    top_center               │  视觉权重：最小签名
│    minimal weight           │
├─────────────────────────────┤
│                             │
│                             │
│     WORLD ENTRY GATE        │  绝对视觉核心
│      (75-85%)               │  世界入口门
│         center              │  维度门 ＞ 能量门
│                             │
│    resonance dust           │  仅 portal 边缘微粒
│    (portal rim only)        │
│                             │
├─────────────────────────────┤
│  往世书          启明录      │  仪式碎片
│  bottom_L       bottom_R    │
│                             │
│      谒见世界               │  召唤符文
│    bottom_center            │
└─────────────────────────────┘

图层顺序（从底到顶）:
  1. 虚空纯渐变 (pure_void_gradient)
  2. 共振微粒 (仅 portal 边缘) 
  3. 世界入口门 (中心, 75-85% 视觉权重)
  4. "AR游伴" 仪式光文 — top_center
  5. "往世书" / "启明录" 仪式碎片 — bottom_L / bottom_R
  6. "谒见世界" 召唤符文 — bottom_center
```

---

## 6. 设计令牌（Design Tokens V2）

| Token | V1 值 | V2 值 | 说明 |
|-------|-------|-------|------|
| `color_bg_primary` | `#050510` | `#050505` | 更深的虚空黑 |
| `color_bg_secondary` | `#1A0A3E` | `#0F0530` | 靛紫虚空 |
| `color_accent_violet` | `#7B2D8E` | `#5A1A7A` | 更内敛的紫 |
| `color_accent_gold` | `#E8C86A` | `#D4AF37` | 更庄严的金 |
| `portal_size` | 180×180px | 240×240px | 更大、更主导 |
| `portal_visual_weight` | 60-70% | 75-85% | 绝对主导 |
| `ui_density` | very_low | symbolic_only | 符号级别 |
| `font_title` | 27px / thin / glow | 24px / ritual_light / divine_glow | 更小、更神圣 |
| `font_cta_primary` | 16px / medium / glow | 14px / invocation / gate_ring | 更小、更仪式化 |

---

## 7. 管线移交

```
STEP 0: STRUCTURE DESIGN     → 本文档（STRUCTURE_SPEC_LANDING_V2.md）✅ 完成
STEP 1: STRUCTURE APPROVAL   → 本文件即主动批准输入 ✅ APPROVED
                              ↓
NEXT:  STEP 2: FULL PAGE VISUAL GENERATION
       → 输入: 本结构规格
       → 执行引擎: AI IMAGE SYSTEM
       → 产出: landing_v2_world_entry.jpg (9:16 单张全页视觉稿)
       → GATE: 移交至 STEP 3 VISUAL QA
```

---

## 8. 结构审批签名

```
STRUCTURE_SPEC:  LANDING_V2_WORLD_ENTRY
审批日期:         2026-07-01 17:01
审批状态:         ✅ APPROVED
审批引擎:         HUMAN (direct task input as approval)
GATE:             UNLOCKED — 可进入 STEP 2 FULL PAGE VISUAL GENERATION
```

---

*规格生成于 2026-07-01 17:01 · 管线步骤：VISUAL_PRODUCTION_PIPELINE_V3 STEP 0–1 · 状态：APPROVED*
