# LAYERED RENDERING V4 — Portal-Only Strategy Report

> **Date**: 2026-07-01
> **Engine**: doubao-seedream-5-0-260128 (Jimeng/Seedream Ark)
> **Status**: COMPLETED — Runtime updated to use layered architecture

---

## Problem

Previous V1-V3 approach asked AI to generate a full landing page **including** precise UI elements (WeChat login button, navigation entries, text labels) within the same image. This forced the AI to compromise on both:

- **Portal aesthetics**: constrained by need to leave room for UI
- **UI precision**: AI models are poor at rendering exact buttons/icon layouts

Result: images passed QA spec compliance (portal exists, UI exists) but lacked visual beauty.

---

## Solution: Layered Rendering (V4)

### Architecture

| Layer | Content | Source | z-index |
|-------|---------|--------|---------|
| **Layer A** | Portal background scene | AI-generated image (`landing_portal.jpg`) | 0 |
| **Layer B** | CSS depth overlay | `lp-bg__depth` gradient | 1 |
| **Layer C** | CSS fog + particles + warm-light | WXSS styles | 2 |
| **Layer D** | CSS UI overlay (login button, nav entries) | WXML `lp-login-fixed` | 100 |

### Key improvement

Portal background is now generated **without any UI constraints**. The prompt explicitly states:
- `NO user interface elements`
- `NO buttons. NO text. NO navigation`
- `Pure visual scene — background only`

This allows the AI to focus entirely on: portal composition, color, lighting, atmosphere, particles.

---

## Generation Results

8 portal-only candidates generated across 4 aesthetic styles:

| Style | Seeds | Status |
|-------|-------|--------|
| **sacred_gold** — Ethereal gold rings + violet glow | 5302, 1026 | OK |
| **cosmic_mist** — Pale gold portal + cosmic fog | 2314, 643 | OK |
| **ancient_awakening** — Warm amber + geometric runes | 2444, **3026** | **SELECTED** |
| **pure_void_crown** — Minimalist halo in absolute void | 2573, 9272 | OK |

**User selected**: `ancient_awakening` style, seed=3026

---

## Runtime Changes

### New files
- `apps/miniapp/static/scene/landing_portal.jpg` — Portal-only background (750x1333, correct 9:16)
- `apps/miniapp/static/scene/landing_portal_raw.jpg` — Raw 2048x2048 backup

### Modified files

| File | Change |
|------|--------|
| `pages/landing/index.js` | Added `landing_portal` to asset map; default `bgImage` changed to landing_portal |
| `pages/landing/index.wxss` | Removed opacity/saturation/brightness filters from `.lp-bg__image` (full brightness for portal); updated depth gradient for dark portal background |
| `core/ui-spec-runtime/asset-resolver.js` | Registered `landing_portal` in DEFAULT_ASSET_MAP |
| `core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` | Registered `landing_portal` and `landing_portal_raw` in REGISTERED_ASSETS |

### Aspect ratio fix (all candidates)
Previous images (V1-V3) were 750x1624 (ratio 0.4618, WRONG).  
Now corrected to **750x1333** (ratio 0.5625 = 9:16, CORRECT).

---

## File Inventory

```
apps/miniapp/static/scene/
├── landing_portal.jpg              # Selected portal background (750x1333)
├── landing_portal_raw.jpg          # Raw 2048x2048 backup
├── landing_v3_release.jpg          # Previous V3 release (kept for fallback)
└── ...

assets/visual-autopilot/candidates/
├── portal_raw_ancient_awakening_s3026_1782903689.jpg   # Selected raw
├── portal_crop_ancient_awakening_s3026_1782903689.jpg  # Selected crop
├── portal_raw_sacred_gold_s5302_*.jpg
├── portal_raw_sacred_gold_s1026_*.jpg
├── portal_raw_cosmic_mist_s2314_*.jpg
├── portal_raw_cosmic_mist_s643_*.jpg
├── portal_raw_ancient_awakening_s2444_*.jpg
├── portal_raw_pure_void_crown_s2573_*.jpg
├── portal_raw_pure_void_crown_s9272_*.jpg
└── (corresponding crop files for all)
```

---

## Next Steps

1. **Test in real mini program** — Verify portal renders at full brightness with CSS overlay
2. **Further portal refinement** — If current portal is not fully satisfying, try:
   - New seeds within ancient_awakening style
   - Slightly modified prompt (adjust warmth, portal size, particle density)
3. **UI overlay tuning** — Adjust login button opacity, colors if needed to match portal
