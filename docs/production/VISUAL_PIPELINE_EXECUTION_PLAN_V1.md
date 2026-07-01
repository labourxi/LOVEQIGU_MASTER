# VISUAL PIPELINE EXECUTION PLAN V1

> 管线类型：**图像生成管线编排计划**  
> 角色：Visual Asset Orchestrator（编排器）  
> 执行引擎：外部图像模型（Gemini / SD / DALL·E / 豆包 / 即梦）  
> 生成日期：2026-06-30

---

## PIPELINE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│ INPUT: 15 assets × structured prompts                              │
│                                                                    │
│   ↓ API CALLS (batch by priority)                                 │
│                                                                    │
│ OUTPUT: 15 image files                                             │
│   ├── 3 JPEG (P0 scene)   → /static/scene/                        │
│   ├── 5 PNG   (P1 UI)     → /static/{ui,bg,scene}/                │
│   └── 7 PNG   (P2 icon)   → /static/{icon,relic,collectible}/     │
│                                                                    │
│ POST-PIPELINE:                                                     │
│   → assetMap update                                                │
│   → bgImage activation                                             │
│   → build config update                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PHASE 1: ASSET LIST (FINAL)

## 1.1 去重后资产清单（唯一文件 = 15 个）

| Batch | Asset ID | 文件名 | 目标路径 | 格式 | 尺寸 |
|-------|---------|--------|---------|------|------|
| B0-P0 | ASSET-001 | `aiqigu_landing_v1.jpg` | `static/scene/` | JPEG | 750×1624 |
| B0-P0 | ASSET-002 | `landing_fallback.jpg` | `static/scene/` | JPEG | 750×1624 |
| B0-P0 | ASSET-003 | `aiqigu_landing_v1.webp` | `static/scene/` | WebP | 750×1624 |
| B1-P1 | ASSET-004 | `aiqigu_street_v1.jpg` | `static/scene/` | JPEG | 750×1624 |
| B1-P1 | ASSET-005 | `portal_ring_gold_v1.png` | `static/ui/` | PNG-alpha | 200×200 |
| B1-P1 | ASSET-006 | `portal_mist_v1.png` | `static/bg/` | PNG-alpha | 750×300 |
| B1-P1 | ASSET-007 | `explore_card_glass_v1.png` | `static/ui/` | PNG-alpha | 180×200 |
| B1-P1 | ASSET-008 | `stat_panel_gold_glass_v1.png` | `static/ui/` | PNG-alpha | 280×140 |
| B2-P2 | ASSET-009 | `wechat_login_gold_v1.png` | `static/icon/` | PNG-alpha | 36×36 |
| B2-P2 | ASSET-010 | `location_v1.png` | `static/icon/` | PNG-alpha | 32×32 |
| B2-P2 | ASSET-011 | `relic_v1.png` | `static/icon/` | PNG-alpha | 32×32 |
| B2-P2 | ASSET-012 | `collectible_v1.png` | `static/icon/` | PNG-alpha | 32×32 |
| B2-P2 | ASSET-013 | `ar_v1.png` | `static/icon/` | PNG-alpha | 32×32 |
| B2-P2 | ASSET-014 | `frame_gold_v2.png` | `static/relic/` | PNG-alpha | 300×400 |
| B2-P2 | ASSET-015 | `collectible_frame_v1.png` | `static/collectible/` | PNG-alpha | 320×320 |

---

# PHASE 2: STRUCTURED PROMPTS

## 2.1 Prompt Architecture

Every prompt has 5 layers:

```
[CONTEXT]     → LOVEQIGU world + AIGU VALLEY setting + Visual Bible rules
[INTENT]      → what this asset communicates
[STYLE]       → art direction + color palette + forbidden patterns
[COMPOSITION] → layout + focus + framing
[OUTPUT]      → format + size + technical requirements
```

### Global Constraints (apply to ALL prompts)

```
WORLD: 爱企谷 (AIGU VALLEY) — a mysterious fog valley between worlds
MOOD:  游离之域 · 世界正在显现 (drifting domain · the world is revealing)
STYLE: Chinese ink-wash meets atmospheric fantasy
       深林黑 #0A1A14 as base, 暖金 #C8A24A as accent
       Low saturation (0.35-0.55), dark tone (brightness 0.5-0.65)
       No neon, no cyberpunk, no high-purity fluorescent colors
       No rainbow gradients, no game UI elements
       No text or branding (UI layer handles text)
       No human characters (distant silhouettes OK)
       Mist layering, warm golden light, entry gate metaphor
```

---

## 2.2 P0 Prompts (BLOCKING — Landing Visual)

### PROMPT-A001: aiqigu_landing_v1.jpg

```
=== CONTEXT ===
This is the entry scene for 爱企谷 (AIGU VALLEY) — a mystical 
fog-shrouded valley mobile game world. First visual impression.

=== INTENT ===
A majestic mountain valley landscape seen from a low vantage point.
The valley stretches into distant fog. Warm golden light emanates 
from the valley heart. There is a subtle "gate" or "passage" 
metaphor — the entrance to the world is about to reveal itself.

=== STYLE ===
- Chinese ink-wash landscape aesthetic interpreted through atmospheric rendering
- NOT photorealistic — painterly, misty, contemplative
- Deep forest black (#0A1A14) as dominant tone
- Warm gold (#C8A24A) as the only accent — appears as light, not as color
- Multiple mountain layers receding into fog (at least 4 depth planes)
- Mist and fog form a visual path toward the center
- Very subtle golden light rays penetrating mist from valley center

=== COMPOSITION ===
- Mobile portrait: 750px wide × 1624px tall
- Bottom 20%: dark valley floor / foreground
- Middle 50%: layered mountain ranges receding to distant peaks
- Top 30%: misty sky with faint warm glow near horizon
- Center ~40-45% from bottom: the "gate" zone — where light converges
- Subjects: mountains, fog, light — NO buildings, NO people
- Rule: low contrast between layers (atmospheric perspective)

=== COLOR PALETTE (strict) ===
- Primary:    #0A1A14 (deep forest black, 60%+ of image)
- Secondary:  #0E221A (slightly lighter green-black)
- Terrain:    #1A2E22, #1E3628, #142E24 (mountain tones)
- Accent:     #C8A24A (gold) — used ONLY for light, less than 5% of pixels
- Mist:       rgba(232,224,208, opacity 0.04-0.15)
- Final tone: Low saturation (35-55%), low brightness (50-65%)

=== OUTPUT ===
- Format: JPEG
- Dimensions: 750 × 1624 pixels
- File size target: <500KB
- No embedded metadata
- sRGB color space
```

### PROMPT-A002: landing_fallback.jpg

```
=== CONTEXT ===
Fallback scene for 爱企谷 landing page. Shown when primary 
scene fails to load. Must be more minimal — a "reduced" version 
of the same world.

=== INTENT ===
A vastly simplified landscape. Only 2-3 mountain silhouette 
layers, almost monochromatic. The world is present but dormant.
Very faint gold edge-light on mountain crests is the only 
indication of the AIGU VALLEY world.

=== STYLE ===
- Minimalist ink-wash — bare mountain outlines
- Near-monochromatic: deep greens to black
- Saturation < 20%, brightness 30-50%
- Much darker than primary scene
- No light rays, no particles, no gate metaphor
- Only one subtle visual cue: faint gold tracing on mountain tops

=== COMPOSITION ===
- Mobile portrait: 750 × 1624px
- 2-3 mountain silhouette layers across middle 40%
- Top 40%: solid near-black gradient
- Bottom 30%: solid near-black
- Simplicity is the goal

=== COLOR PALETTE (strict) ===
- Primary:    #0A1A14 (80%+ of image)
- Silhouette: #142E24, #183026 (barely visible)
- Accent:     rgba(200,162,74, opacity 0.02-0.04) — almost invisible

=== OUTPUT ===
- Format: JPEG
- Dimensions: 750 × 1624 pixels
- File size target: <200KB (compression-friendly due to simplicity)
- sRGB
```

### PROMPT-A003: aiqigu_landing_v1.webp

```
=== CONTEXT ===
WebP variant of PROMPT-A001.

=== NOTES ===
- Same visual as A001
- Convert final JPG to WebP format using any image converter tool
- No visual generation needed — this is a format conversion task
- Target: <300KB
```

---

## 2.3 P1 Prompts (Core Visual Enhancement)

### PROMPT-A004: aiqigu_street_v1.jpg

```
=== CONTEXT ===
Extended scene view for 爱企谷. This is the view "through the gate" —
looking into the valley along a path or street.

=== INTENT ===
A narrow pathway or street leading into the AIGU VALLEY. 
Flanked by low walls or buildings (silhouettes only). 
A warm golden light source at the end of the path. 
The feeling of moving inward, deeper into the world.

=== STYLE ===
- Same visual language as A001
- Darker overall — this is an interior/transitional space
- Walls/buildings are dark silhouettes (no detail)
- Path surface catches faint gold reflection
- The light ahead is warmer and more focused than A001

=== COMPOSITION ===
- Mobile portrait: 750 × 1624px
- Path/street runs from bottom-center toward center-distance
- Flanked by wall-like silhouettes on left and right (bottom 40%)
- Light source at end of path (center 40-50% from top)
- Top 30%: sky similar to A001

=== COLOR PALETTE ===
- Primary:    #0A1A14
- Walls:      #1A2E22, #1E3628
- Path:       #142E24
- Light:      #C8A24A (gold, more concentrated than A001)

=== OUTPUT ===
- Format: JPEG
- Dimensions: 750 × 1624 pixels
- sRGB
```

### PROMPT-A005: portal_ring_gold_v1.png

```
=== CONTEXT ===
Decorative overlay texture for the portal entrance animation on 
LOVEQIGU landing page. This is NOT a standalone image — it is an 
alpha-channel overlay that sits on top of the scene.

=== INTENT ===
A set of concentric ring patterns in gold line art style. 
Very thin, elegant, semi-transparent. Designed to be placed 
over the portal area and rotated via CSS animation.

=== STYLE ===
- Minimal line art
- 3-5 concentric circles with variations:
  - Solid fine lines (stroke width: 0.5-1px logical)
  - Dashed/dotted circle variations
  - Small decorative dots at cardinal points (12, 3, 6, 9 o'clock)
- All lines are golden (#C8A24A)
- Background: COMPLETELY TRANSPARENT
- Overall opacity of lines: 0.1-0.3 (subtle)

=== COMPOSITION ===
- Square: 200 × 200 pixels
- Content centered
- Outermost circle ~190px diameter
- Innermost circle ~70px diameter
- Small center dot (~6px)

=== OUTPUT ===
- Format: PNG with full alpha transparency
- Dimensions: 200 × 200 pixels
- File size target: <10KB
- NO background whatsoever
```

### PROMPT-A006: portal_mist_v1.png

```
=== CONTEXT ===
Mist texture overlay for the portal area background.

=== INTENT ===
A very soft, diffuse mist cloud texture. Semi-transparent 
white-gold gradient patches. Used as a CSS background overlay 
to add atmospheric depth to the portal zone.

=== STYLE ===
- 2-3 soft radial gradient patches
- Center-feather transitions (sharp center, fading edges)
- Very low opacity (5-15% after compositing)
- Colors: #E8D8B4 (mist white) and #C8A24A (gold) at very low alpha
- Subtle — should barely be visible when overlaid

=== COMPOSITION ===
- Wide format: 750 × 300 pixels
- Mist patches distributed horizontally
- Edge gradient for seamless tiling

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 750 × 300 pixels
- File size target: <20KB
```

### PROMPT-A007: explore_card_glass_v1.png

```
=== CONTEXT ===
Glass texture overlay for exploration carousel cards.

=== INTENT ===
A frosted/translucent glass panel texture. Used as a CSS 
background overlay on carousel items to create a glass-morphism 
effect. Very subtle.

=== STYLE ===
- Frosted glass surface
- Subtle top-to-bottom gradient (lighter at top edge)
- 1-2 diagonal scratch/reflection lines (very faint)
- Faint gold edge glow on bottom
- Colors: transparent with very faint rgba(200,162,74,0.02-0.04)
- Sharp corners for rectangular application

=== COMPOSITION ===
- Vertical card: 180 × 200 pixels
- Glass gradient: top 15% slightly brighter
- Reflection: thin diagonal strip at ~25% from top

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 180 × 200 pixels
- File size target: <5KB
```

### PROMPT-A008: stat_panel_gold_glass_v1.png

```
=== CONTEXT ===
Glass texture overlay for the 4-stat dashboard panel.

=== INTENT ===
Same glass-morphism aesthetic as A007 but in horizontal format.
Frosted glass panel with faint gold accent.

=== STYLE ===
- Same frosted glass aesthetic as A007
- Horizontal orientation
- Top gradient lighter, bottom darker
- Faint diagonal reflection line
- Gold edge hint at bottom

=== COMPOSITION ===
- Wide panel: 280 × 140 pixels
- Glass gradient: top 20% brighter, smooth fade

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 280 × 140 pixels
- File size target: <5KB
```

---

## 2.4 P2 Prompts (Icon System)

### PROMPT-A009: wechat_login_gold_v1.png

```
=== CONTEXT ===
WeChat login button icon for landing page login CTA.

=== INTENT ===
A minimal line-art WeChat chat bubble icon. Golden, thin, elegant.

=== STYLE ===
- Single continuous line art
- Stroke width: ~1.5px logical
- Color: #C8A24A (gold) at opacity 0.6
- NO filled areas — outline only
- Background: COMPLETELY TRANSPARENT

=== COMPOSITION ===
- 36 × 36 pixels
- Simple chat bubble silhouette
- Two dots inside for eyes/expression

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 36 × 36 pixels
```

### PROMPT-A010: location_v1.png

```
=== CONTEXT ===
Location/map pin icon for explore map pages.

=== INTENT ===
A minimalist map pin/marker icon. Gold line art.

=== STYLE ===
- Single continuous line art, stroke ~1.5px
- Color: rgba(200,162,74, 0.6)
- Pin shape (circle + pointed bottom)
- Small inner dot
- Background: TRANSPARENT

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 32 × 32 pixels
```

### PROMPT-A011: relic_v1.png

```
=== CONTEXT ===
Relic badge/medal icon for relic-related UI.

=== INTENT ===
A star or badge shape — representing a discovered relic.

=== STYLE ===
- Single continuous line art, stroke ~1.5px
- Color: rgba(200,162,74, 0.6)
- 5-pointed star or badge outline
- Small inner circle
- Background: TRANSPARENT

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 32 × 32 pixels
```

### PROMPT-A012: collectible_v1.png

```
=== CONTEXT ===
Digital collectible/diamond icon.

=== INTENT ===
A diamond or gem shape — representing a digital collectible.

=== STYLE ===
- Single continuous line art, stroke ~1.5px
- Color: rgba(200,162,74, 0.6)
- Diamond/hexagon outline
- Internal facet lines (2-3 thin lines)
- Background: TRANSPARENT

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 32 × 32 pixels
```

### PROMPT-A013: ar_v1.png

```
=== CONTEXT ===
AR/camera scan icon for AR features.

=== INTENT ===
A camera viewfinder or AR frame icon.

=== STYLE ===
- Single continuous line art, stroke ~1.5px
- Color: rgba(200,162,74, 0.6)
- Rectangle with rounded corners (viewfinder)
- Small circle inside (camera lens)
- Corner marks on the frame
- Background: TRANSPARENT

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 32 × 32 pixels
```

### PROMPT-A014: frame_gold_v2.png

```
=== CONTEXT ===
Decorative corner frame for relic detail pages.

=== INTENT ===
Four L-shaped corner ornaments (no edge lines between them).
Creates an invisible "frame" around relic content.

=== STYLE ===
- Line art, stroke ~1.2px
- Color: rgba(200,162,74, 0.35)
- Each corner: 15px horizontal + 15px vertical arm
- Small dot at each corner tip
- Faint glow around the corners (Gaussian blur 1px)
- Background: COMPLETELY TRANSPARENT

=== COMPOSITION ===
- Vertical: 300 × 400 pixels
- Corners positioned at: (10,10), (290,10), (10,390), (290,390)

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 300 × 400 pixels
```

### PROMPT-A015: collectible_frame_v1.png

```
=== CONTEXT ===
Decorative corner frame for collectible detail pages.

=== INTENT ===
Same corner-frame concept as A014 but square aspect ratio.
Four L-shaped ornaments in gold line art.

=== STYLE ===
- Same style as A014
- Square aspect ratio
- Additional subtle mid-point marks on each side

=== COMPOSITION ===
- Square: 320 × 320 pixels
- Corners at: (15,15), (305,15), (15,305), (305,305)
- Mid-point marks: (160,8), (160,312), (8,160), (312,160)

=== OUTPUT ===
- Format: PNG with alpha transparency
- Dimensions: 320 × 320 pixels
```

---

# PHASE 3: API CALL SPECIFICATION

## 3.1 Recommended API: Gemini 2.0 / 豆包 / 即梦

### API Selection Guide

| Model | Best For | Pros | Cons |
|-------|----------|------|------|
| Gemini 2.0 | Scene images (A001-A004) | Best Chinese aesthetic understanding | May need tuning |
| 豆包 | Scene images | Native Chinese cultural context | External API key needed |
| 即梦 | Scene images | Chinese ink-wash specifically trained | External API key needed |
| DALL·E 3 | Icons (A009-A015) | Best for simple vector-like output | May not handle alpha channel |
| Stable Diffusion XL | Scenes + Icons | Open source, controllable | Needs local/cloud setup |

### Recommended Approach

```
SCENE IMAGES (A001, A002, A004):
  → Gemini 2.0 Pro (best Chinese aesthetic understanding)
  → OR 即梦 (specialized for Chinese ink-wash)

UI TEXTURES (A005-A008):
  → DALL·E 3 with transparent background prompt
  → OR Stable Diffusion XL + post-process for alpha

ICONS (A009-A015):
  → DALL·E 3 (simple shapes, high reliability)
  → OR manually redraw in vector software after AI generates reference
```

## 3.2 API Call Parameters

### Gemini API (for scene images)

```
ENDPOINT: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
HEADERS: Content-Type: application/json, x-goog-api-key: ${GEMINI_API_KEY}

BODY (per asset):
{
  "contents": [{
    "parts": [{"text": "<full prompt from PHASE 2>"}]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "maxOutputTokens": 8192
  }
}
```

### DALL·E 3 API (for icons and textures)

```
ENDPOINT: POST https://api.openai.com/v1/images/generations
HEADERS: Content-Type: application/json, Authorization: Bearer ${OPENAI_API_KEY}

BODY (per asset):
{
  "model": "dall-e-3",
  "prompt": "<full prompt from PHASE 2>",
  "n": 1,
  "size": "1024x1024",
  "quality": "standard",
  "style": "natural"
}
```

### 即梦 API (if available)

```
ENDPOINT: depends on 即梦 API gateway
Recommended for A001, A002, A004 due to Chinese ink-wash specialization
```

## 3.3 Batch Execution Order

```
BATCH 0 (P0 - BLOCKING, execute FIRST):
  → A001: Gemini or 即梦
  → A002: Gemini or 即梦
  → A003: CONVERT from A001 JPG (no API call needed)

BATCH 1 (P1 - Enhancement):
  → A004: Gemini or 即梦
  → A005: DALL·E 3 or Stable Diffusion
  → A006: DALL·E 3 or Stable Diffusion
  → A007: DALL·E 3 or Stable Diffusion
  → A008: DALL·E 3 or Stable Diffusion

BATCH 2 (P2 - Icons):
  → A009-A013: DALL·E 3 (batch if API supports)
  → A014-A015: DALL·E 3 or manual vector
```

---

# PHASE 4: FILE STORAGE RULES

## 4.1 Directory Structure (MUST create before pipeline execution)

```bash
mkdir -p apps/miniapp/static/scene
mkdir -p apps/miniapp/static/bg
mkdir -p apps/miniapp/static/ui
mkdir -p apps/miniapp/static/icon
mkdir -p apps/miniapp/static/relic
mkdir -p apps/miniapp/static/collectible
```

## 4.2 Naming Rules (STRICT)

```
- Use ONLY the exact filenames listed in PHASE 1
- NO version suffixes (no _v1, _v2 — kept in name already)
- NO uppercase
- NO spaces
- Use .jpg for JPEG, .png for PNG, .webp for WebP
- DO NOT overwrite existing files without checking
```

## 4.3 Post-API Processing

```
For PNG-alpha assets (A005-A015):
  1. API may output JPEG (no alpha) → need to:
     a. Remove background (white → transparent)
     b. Convert to PNG with alpha channel
  2. Tools: remove.bg / Photoshop / GIMP / ImageMagick
     command: magick input.jpg -transparent white output.png

For JPEG assets (A001, A002, A004):
  1. Direct output from API
  2. Post-process to target size if needed:
     command: magick input.png -resize 750x1624 output.jpg
  3. Optimize file size:
     command: magick input.jpg -quality 85 output.jpg

For WebP (A003):
  1. Convert from A001 JPG:
     command: magick aiqigu_landing_v1.jpg aiqigu_landing_v1.webp
```

---

# PHASE 5: ASSET MAP UPDATE SPECIFICATION

## 5.1 Target File: `apps/miniapp/pages/landing/index.js`

```
Current (L106-116):
  return {
    bg: '/static/scene/aiqigu_landing_v1.jpg',
    bg_webp: '/static/scene/aiqigu_landing_v1.webp',
    fallback: '/static/scene/landing_fallback.jpg',
    scene_street: '/static/scene/aiqigu_street_v1.jpg',
    portal_mist: '/static/bg/portal_mist_v1.png',
    portal_ring: '/static/ui/portal_ring_gold_v1.png',
    icon_login: '/static/icon/wechat_login_gold_v1.png',
    ui_card_glass: '/static/ui/explore_card_glass_v1.png',
    ui_stat_glass: '/static/ui/stat_panel_gold_glass_v1.png'
  };
```

**Update needed**: NONE. The current assetMap paths already match the file destinations. The mapping is correct as-is.

## 5.2 Additional Register Files

### `apps/miniapp/core/ui-spec-runtime/asset-resolver.js` (DEFAULT_ASSET_MAP)

```
Current paths use /images/ prefix.
RECOMMENDED: Update to /static/ to match actual file locations:
  aigugu_landing_bg:   '/images/...' → '/static/scene/aiqigu_landing_v1.jpg'
  portal_ring_gold:    '/images/...' → '/static/ui/portal_ring_gold_v1.png'
  etc. for all 11 entries
```

### `apps/miniapp/core/governance/GOVERNANCE_RUNTIME_HOOK_V2.js` (REGISTERED_ASSETS)

```
Current paths use /images/ prefix.
RECOMMENDED: Update to /static/ to match actual file locations.
```

## 5.3 Activation Step (CRITICAL)

After files are placed, activate the scene image:

```
File: apps/miniapp/pages/landing/index.js
Line: L190

Change:
  bgImage: '',
To:
  bgImage: '/static/scene/aiqigu_landing_v1.jpg',
```

This single change makes the landing page render the scene image immediately on load.

---

# PHASE 6: PIPELINE READINESS CHECK

## 6.1 Pre-Pipeline Checklist

```
┌──────────────────────────────────────────────────────────────────────┐
│ BEFORE EXECUTING API CALLS:                                         │
│                                                                     │
│ [ ] API keys ready (Gemini / DALL·E / 即梦)                         │
│ [ ] Directory structure created (PHASE 4.1)                         │
│ [ ] ImageMagick or equivalent installed for post-processing         │
│ [ ] Prompt list exported (PHASE 2 — all 15 prompts)                 │
│ [ ] Batch order defined (PHASE 3.3)                                 │
│ [ ] Fallback plan: if API fails → SVG placeholder                    │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

## 6.2 Execution Script Template

```bash
#!/bin/bash
# VISUAL ASSET PIPELINE EXECUTION SCRIPT
# Run after API keys are set

# === BATCH 0: P0 SCENE ===
echo "=== BATCH 0: P0 SCENE ==="

# A001: aiqigu_landing_v1.jpg
# Call Gemini API with PROMPT-A001 → save to apps/miniapp/static/scene/aiqigu_landing_v1.jpg

# A002: landing_fallback.jpg
# Call Gemini API with PROMPT-A002 → save to apps/miniapp/static/scene/landing_fallback.jpg

# A003: aiqigu_landing_v1.webp (convert from A001)
# magick apps/miniapp/static/scene/aiqigu_landing_v1.jpg \
#   apps/miniapp/static/scene/aiqigu_landing_v1.webp

# === BATCH 1: P1 ENHANCEMENT ===
echo "=== BATCH 1: P1 ==="
# A004-A008: call respective APIs

# === BATCH 2: P2 ICONS ===
echo "=== BATCH 2: P2 ==="
# A009-A015: call respective APIs

echo "=== PIPELINE COMPLETE ==="

# === POST: ACTIVATE ===
# Edit index.js L190 to set bgImage
```

## 6.3 Fallback: If API Unavailable

If external image generation APIs are unavailable, the **SVG placeholders** (generated in the previous execution phase at `docs/production/TASK_REPORT_VISUAL_ASSET_EXECUTION_V1.md`) can be used as interim assets. They are already placed in the correct paths with the correct filenames, using SVG content that WeChat Mini Program's `<image>` component can render.

---

# APPENDIX A: Orchestration Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│ PIPELINE EXECUTION READINESS                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ASSET COUNT:       15              │  API CALLS:    15              │
│ P0 (BLOCKING):     3              │  P1:           5               │
│ P2:                7              │                                │
│                                                                     │
│ API MODELS:        Gemini + DALL·E 3 (+ 即梦 optional)              │
│ OUTPUT FORMATS:    3 JPEG, 1 WebP, 11 PNG-alpha                    │
│ TARGET DIRS:       scene/ bg/ ui/ icon/ relic/ collectible/        │
│ POST-PROCESS:      alpha channel extraction for PNGs               │
│                    size check for scenes (750×1624)                │
│                                                                     │
│ STATUS:            READY FOR PIPELINE EXECUTION                     │
│ ONLY BLOCKER:      API keys + execution environment                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*计划生成于 2026-06-30 · 编排引擎：Cursor Agent · 角色：Visual Asset Orchestrator · 不生成图像 / 仅编排管线*
