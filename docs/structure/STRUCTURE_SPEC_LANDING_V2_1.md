# LANDING PAGE V2.1 — BALANCE FIX (STRUCTURE_SPEC)

> **文档标识**: `STRUCTURE_SPEC_LANDING_V2_1.md`
> **版本**: V2.1 — BALANCE FIX
> **日期**: 2026-07-01 17:59
> **状态**: **STRUCTURE_APPROVED** (本文件即主动输入)
> **管线步骤**: VISUAL_PRODUCTION_PIPELINE_V3 — STEP 0 (STRUCTURE DESIGN) + STEP 1 (STRUCTURE APPROVAL)
> **GATE**: ✅ APPROVED — 可进入 STEP 2 (FULL PAGE VISUAL GENERATION)

---

## 1. 设计意图

V2.1 的核心目标：**在产品入口功能完整性和世界入口沉浸感之间取得平衡**。

V2 的教训：纯仪式语言去掉了微信登录、去掉了操作入口，导致页面虽然好看但不可用。
V2.1 的修正：保留 portal 主导（65-70%），恢复微信一键登录按钮，CTA 使用混合文案。

| 维度 | V2 (过度仪式化) | V2.1 (平衡版) |
|------|----------------|--------------|
| portal 权重 | 75-85% | **65-70%** |
| UI 密度 | < 10% 纯符号 | **12-15% 功能符号混合** |
| 微信登录 | ❌ 移除 | ✅ **必须恢复** |
| CTA 语言 | 纯诗意 ("谒见世界") | **混合 ("谒见世界 / 微信登录")** |
| 副操作 | 纯仪式 ("往世书"/"启明录") | **混合 ("故事·往世书"/"说明·启明录")** |
| 用户角色 | 被召唤者 | **操作者 + 被召唤者双重身份** |

---

## 2. 页面规格 (JSON)

```json
{
  "task_type": "full_page_render",
  "page_id": "landing_v2_1_balance",
  "output_mode": "single_image",
  "aspect_ratio": "9:16",
  "style_profile": {
    "theme": "world_entry_with_product_entry",
    "color_system": ["deep_black", "indigo_violet", "ethereal_gold", "void_dark"],
    "lighting": "volumetric_divine_glow",
    "material": "dimensional_gate_energy",
    "atmosphere": "sacred_world_gate_with_actionable_entry",
    "motion_hint": "slow_portal_resonance"
  },
  "layout": {
    "type": "full_page_ui",
    "background": "pure_void_gradient_deepest_black_to_indigo_violet",
    "center_focus": "world_entry_portal_gate",
    "ui_density": "functional_symbolic_hybrid",
    "composition_rule": "portal_dominant_with_actionable_bottom"
  },
  "ui": {
    "title": {
      "text": "AR游伴",
      "position": "top_center",
      "style": "ritual_light_script_divine_glow",
      "visual_weight": "minimal_signature"
    },
    "primary_cta": {
      "text": "谒见世界 · 微信登录进入",
      "short_text": "微信一键登录",
      "position": "bottom_center",
      "style": "glowing_energy_button_with_wechat_icon",
      "visual_weight": "functional_prominent",
      "wechat_login_visible": true
    },
    "secondary_cta": [
      {
        "text": "故事 · 往世书",
        "position": "bottom_left",
        "style": "hybrid_ancient_script"
      },
      {
        "text": "说明 · 启明录",
        "position": "bottom_right",
        "style": "hybrid_light_inscription"
      }
    ]
  },
  "assets": {
    "background": "void_field_empty_pure_gradient",
    "center_object": "world_entry_gate_transdimensional",
    "particles": "resonance_energy_dust",
    "ui_elements": "functional_ritual_hybrid_set"
  },
  "render_rules": {
    "must_be_single_image": true,
    "no_component_separation": true,
    "no_ui_relayout_allowed": true,
    "must_follow_layout_exactly": true,
    "no_placeholder_assets": true,
    "production_grade_only": true,
    "portal_must_be_world_entry_not_tech_portal": true,
    "wechat_login_button_must_be_visible": true,
    "cta_must_be_actionable_not_purely_poetic": true
  },
  "visual_priority": {
    "center_anchor": "world_entry_portal_gate — STRONG DOMINANCE. Portal occupies 65-70% of visual weight. Portal is the primary visual subject. Background is void — no competition.",
    "ui_suppression": "UI elements occupy 12-15% of total canvas area — functional-symbolic hybrid. WeChat login button must be recognizable as a login action. Top 15% of canvas: ONLY title glyph. Bottom 25% of canvas: login CTA + secondary nav. Bottom area must clearly read as actionable entry.",
    "background_non_competition": "Background is STRICTLY void canvas. The deepest black (#050505) fading to indigo void (#0F0530). Zero foreground objects. Zero textures. Zero competing shapes. Only the portal and bottom UI exist as visual content.",
    "z_order_enforcement": "Background (pure void) → Resonance particles (minimal, only near portal rim) → World entry gate (center, 65-70%) → Title glyph (top) → WeChat login button + secondary nav (bottom). Portal must NEVER overlap bottom UI zone."
  }
}
```

---

## 3. V2 → V2.1 变更对照

| 元素 | V2 | V2.1 |
|------|----|------|
| portal 权重 | 75-85% | **65-70%** |
| UI 密度 | symbolic_only (>10%) | **functional_symbolic_hybrid (12-15%)** |
| 主 CTA | "谒见世界" (纯仪式) | **"谒见世界 · 微信登录进入" (混合)** |
| 微信登录 | ❌ 无 | **✅ 必须可见** |
| 副 CTA L | "往世书" | **"故事 · 往世书"** |
| 副 CTA R | "启明录" | **"说明 · 启明录"** |
| render_rule | ui_is_symbolic_not_functional | **wechat_login_button_must_be_visible** |
| 背景区 | 20% 底部 (仅仪式) | **25% 底部 (登录 + 导航)** |
| 用户角色 | 被召唤者 | **操作者 + 被召唤者** |

---

## 4. 布局规格

```
┌─────────────────────────────┐
│       AR游伴                │  仪式光文 / 最小签名
│    top_center               │
│    minimal weight           │
├─────────────────────────────┤
│                             │
│                             │
│     WORLD ENTRY GATE        │  视觉核心 (65-70%)
│         center              │  世界入口门
│         dominant            │  维度门风格
│                             │
│    resonance dust           │  仅 portal 边缘
│    (portal rim only)        │
│                             │
├─────────────────────────────┤
│  故事·往世书    说明·启明录  │  混合文案
│  bottom_L       bottom_R    │
│                             │
│  谒见世界 · 微信登录进入     │  主 CTA / 登录按钮
│    bottom_center            │  必须可见为登录操作
└─────────────────────────────┘

图层顺序（从底到顶）:
  1. 虚空纯渐变 (pure_void_gradient)
  2. 共振微粒 (仅 portal 边缘)
  3. 世界入口门 (中心, 65-70% 视觉权重)
  4. "AR游伴" 仪式光文 — top_center
  5. "故事·往世书" / "说明·启明录" — bottom_L / bottom_R
  6. "谒见世界 · 微信登录进入" 按钮 — bottom_center
```

---

## 5. 设计令牌 (Design Tokens V2.1)

| Token | V2 | V2.1 | 说明 |
|-------|----|------|------|
| `portal_visual_weight` | 75-85% | **65-70%** | 降低以让位给 UI |
| `ui_density` | symbolic_only | **functional_symbolic_hybrid** | 功能符号混合 |
| `bottom_safe_zone` | 80px | **100px** | 更多空间给登录按钮 |
| `font_cta_primary` | 14px / invocation | **16px / medium / glow** | 更大的可读性 |
| `portal_size` | 240px | **220px** | 略微缩小让位 UI |

---

## 6. 管线移交

```
STEP 0: STRUCTURE DESIGN     → 本文档（STRUCTURE_SPEC_LANDING_V2_1.md）✅ 完成
STEP 1: STRUCTURE APPROVAL   → 本文件即主动批准输入 ✅ APPROVED
                              ↓
NEXT:  STEP 2: FULL PAGE VISUAL GENERATION
       → 输入: 本结构规格
       → 执行引擎: AI IMAGE SYSTEM
       → 产出: landing_v2_1.jpg (9:16 单张全页视觉稿)
       → GATE: 移交至 STEP 3 VISUAL QA
```

---

## 7. 结构审批签名

```
STRUCTURE_SPEC:  LANDING_V2_1_BALANCE
审批日期:         2026-07-01 17:59
审批状态:         ✅ APPROVED
审批引擎:         HUMAN (direct task input as approval)
GATE:             UNLOCKED — 可进入 STEP 2 FULL PAGE VISUAL GENERATION
```

---

*规格生成于 2026-07-01 17:59 · 管线步骤：VISUAL_PRODUCTION_PIPELINE_V3 STEP 0–1 · 状态：APPROVED*
