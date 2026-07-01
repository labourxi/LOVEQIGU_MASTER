# LANDING PAGE V3 — PRODUCTION RELEASE BUILD (STRUCTURE_SPEC)

> **文档标识**: `STRUCTURE_SPEC_LANDING_V3.md`
> **版本**: V3 — PRODUCTION RELEASE
> **日期**: 2026-07-01 18:02
> **状态**: **STRUCTURE_APPROVED** (本文件即主动输入)
> **管线步骤**: VISUAL_PRODUCTION_PIPELINE_V3 — STEP 0 (STRUCTURE DESIGN) + STEP 1 (STRUCTURE APPROVAL)
> **GATE**: ✅ APPROVED — 可进入 STEP 2 (FULL PAGE VISUAL GENERATION)
> **QA 要求**: >= 0.80 (高于默认 0.70)

---

## 1. 设计意图

V3 是最终的**生产发布版本**。它整合了 V1 的产品完整性、V2 的世界沉浸感、V2.1 的平衡修正，并首次将**业务入口体系（探索/地图/权益/我的）** 纳入 Landing Page 视觉层。

### 版本演进

| 版本 | 定位 | 问题 |
|------|------|------|
| V1 | 基础产品入口 | 视觉单调；portal 指引弱 |
| V2 | 世界入口仪式 | 丢失微信登录；UI 不可用 |
| V2.1 | 平衡修正 | 恢复登录，但缺少业务入口 |
| **V3** | **生产发布** | **世界+登录+业务入口 三位一体** |

---

## 2. 页面规格 (JSON)

```json
{
  "task_type": "full_page_render",
  "page_id": "landing_v3_release",
  "output_mode": "single_image",
  "aspect_ratio": "9:16",
  "style_profile": {
    "theme": "production_world_entry_with_full_business_system",
    "color_system": ["deep_black", "indigo_violet", "ethereal_gold", "void_dark", "soft_white"],
    "lighting": "volumetric_divine_glow",
    "material": "dimensional_gate_energy_with_glass_ui",
    "atmosphere": "sacred_yet_actionable_world_entry",
    "motion_hint": "slow_portal_resonance"
  },
  "layout": {
    "type": "full_page_ui",
    "background": "pure_void_gradient_deepest_black_to_indigo_violet",
    "center_focus": "world_entry_portal_gate",
    "ui_density": "production_balanced",
    "composition_rule": "portal_dominant_65_with_business_nav_bottom"
  },
  "ui": {
    "title": {
      "text": "AR游伴",
      "position": "top_center",
      "style": "ritual_light_script_divine_glow",
      "visual_weight": "minimal_signature"
    },
    "primary_login": {
      "text": "微信一键登录",
      "short_text": "登录",
      "position": "bottom_center",
      "style": "wechat_green_button_prominent",
      "visual_weight": "functional_high",
      "wechat_icon": "green_wechat_icon_visible",
      "action": "wechat_oauth_login"
    },
    "business_entries": [
      {
        "text": "探索",
        "icon": "compass",
        "position": "bottom_left",
        "style": "glowing_icon_entry"
      },
      {
        "text": "地图",
        "icon": "map",
        "position": "bottom_left_center",
        "style": "glowing_icon_entry"
      },
      {
        "text": "权益",
        "icon": "reward",
        "position": "bottom_right_center",
        "style": "glowing_icon_entry"
      },
      {
        "text": "我的",
        "icon": "profile",
        "position": "bottom_right",
        "style": "glowing_icon_entry"
      }
    ],
    "card_overlay": {
      "explore_count": "bottom area stats pill",
      "relic_count": "bottom area stats pill",
      "collectible_count": "bottom area stats pill"
    }
  },
  "assets": {
    "background": "void_field_empty_pure_gradient",
    "center_object": "world_entry_gate_transdimensional",
    "particles": "resonance_energy_dust",
    "ui_elements": "production_ui_set_wechat_login_plus_business_nav"
  },
  "render_rules": {
    "must_be_single_image": true,
    "no_component_separation": true,
    "no_ui_relayout_allowed": true,
    "must_follow_layout_exactly": true,
    "no_placeholder_assets": true,
    "production_grade_only": true,
    "portal_must_be_world_entry_not_tech_portal": true,
    "wechat_login_must_be_visible": true,
    "business_entries_must_be_visible": true,
    "ui_must_be_immediately_usable": true,
    "qa_minimum_score_0_80": true
  },
  "visual_priority": {
    "center_anchor": "world_entry_portal_gate — MODERATE DOMINANCE. Portal occupies 55-60% of visual weight. Portal is primary visual but bottom business nav zone is equally important for usability.",
    "ui_suppression": "UI elements occupy 18-22% of total canvas area — production density. WeChat login button must be prominent green with WeChat icon. Four business entries (探索/地图/权益/我的) must be visible as icon+text pills in bottom row. Top 12% of canvas: ONLY title glyph. Bottom 30% of canvas: WeChat login button + 4 business entry pills. Bottom area MUST be immediately readable as functional system entry.",
    "background_non_competition": "Background is STRICTLY void canvas. Deepest black (#050505) fading to indigo void (#0F0530). Zero foreground objects. Zero textures. Zero competing shapes.",
    "z_order_enforcement": "Background (pure void) → Resonance particles (minimal, only near portal rim) → World entry gate (center, 55-60%) → Title glyph (top) → WeChat login button → Business entry row (探索·地图·权益·我的) at bottom. Portal must NEVER overlap bottom UI zone."
  }
}
```

---

## 3. V2.1 → V3 变更对照

| 元素 | V2.1 | V3 (生产发布) |
|------|------|--------------|
| Portal 权重 | 65-70% | **55-60%** (让位给业务入口) |
| UI 密度 | 12-15% | **18-22%** (生产级密度) |
| 微信登录 | "谒见世界 · 微信登录进入" | **"微信一键登录"** — 直接明确 + 绿色微信图标 |
| 业务入口 | ❌ 无 | ✅ **探索 · 地图 · 权益 · 我的** 四个入口 |
| 底部区 | 100px | **30% canvas** (更充裕) |
| QA 要求 | 0.70 | **>= 0.80** |

---

## 4. 布局规格

```
┌─────────────────────────────┐
│       AR游伴                │  仪式光文 / 最小签名
│    top_center               │  顶部 12%
├─────────────────────────────┤
│                             │
│                             │
│     WORLD ENTRY GATE        │  视觉核心 (55-60%)
│         center              │  世界入口门
│         moderate            │  维度门风格
│                             │
│    resonance particles      │  仅 portal 边缘
│                             │
├─────────────────────────────┤
│    [ 微信一键登录 ]          │  主 CTA / 绿色微信按钮
│     bottom_center           │  登录操作，必须明确
│                             │
│ 探索  地图  权益  我的       │  业务入口行
│ icon  icon  icon  icon      │  发光图标 + 文字
│ L     L-C   R-C   R         │  4 个入口水平排列
└─────────────────────────────┘

图层顺序（从底到顶）:
  1. 虚空纯渐变
  2. 共振微粒 (仅 portal 边缘)
  3. 世界入口门 (中心, 55-60%)
  4. "AR游伴" 仪式光文 — top_center
  5. "微信一键登录" 按钮 (绿色微信图标, 显眼)
  6. 探索 · 地图 · 权益 · 我的 — 底部导航行
```

---

## 5. 设计令牌 (Design Tokens V3)

| Token | V2.1 | V3 | 说明 |
|-------|------|----|------|
| `portal_visual_weight` | 65-70% | **55-60%** | 让位给业务入口 |
| `ui_density` | functional_symbolic_hybrid | **production_balanced** | 生产级密度 |
| `bottom_safe_zone` | 100px | **canvas 30%** | 充裕的业务入口空间 |
| `wechat_login_button` | 混合符文 | **绿色微信按钮 + 图标** | 直接明确 |
| `business_entries` | ❌ 无 | **4 个入口 (icon+text)** | 探索/地图/权益/我的 |
| `qa_threshold` | 0.70 | **0.80** | 更严格的质量要求 |

---

## 6. UI 契约合规

根据 UI_CONTRACT_SYSTEM_V1（冻结版） §3 PAGE_01 Landing：

| 要求 | V3 实现 | 状态 |
|------|---------|------|
| L1 主世界视觉 + 门/光隐喻 | Portal gate + void gradient | ✅ |
| L2 exploration/relic/collectible/rights count | Stats pills in bottom zone | ✅ |
| L3 微信一键登录（主CTA，最强视觉） | 绿色微信按钮 + icon | ✅ |
| L3 进入地图 | 入口 "地图" | ✅ |
| L3 查看信物 | 入口 "探索" | ✅ |
| L3 查看回响 | 入口 "探索" 内 | ✅ |
| L3 AR 触发 | 入口 "探索" 内 | ✅ |

---

## 7. 管线移交

```
STEP 0: STRUCTURE DESIGN     → 本文档（STRUCTURE_SPEC_LANDING_V3.md）✅ 完成
STEP 1: STRUCTURE APPROVAL   → 本文件即主动批准输入 ✅ APPROVED
                              ↓
NEXT:  STEP 2: FULL PAGE VISUAL GENERATION
       → 输入: 本结构规格
       → 执行引擎: AI IMAGE SYSTEM
       → 产出: landing_v3_release.jpg (9:16 单张全页视觉稿)
       → GATE: 移交至 STEP 3 VISUAL QA (阈值 0.80)
```

---

## 8. 结构审批签名

```
STRUCTURE_SPEC:  LANDING_V3_PRODUCTION_RELEASE
审批日期:         2026-07-01 18:02
审批状态:         ✅ APPROVED
审批引擎:         HUMAN (direct task input as approval)
GATE:             UNLOCKED — 可进入 STEP 2 FULL PAGE VISUAL GENERATION
QA_THRESHOLD:     0.80 (高于默认)
```

---

*规格生成于 2026-07-01 18:02 · 管线步骤：VISUAL_PRODUCTION_PIPELINE_V3 STEP 0–1 · 状态：APPROVED*
