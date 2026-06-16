# ART_02_VISUAL_ASSET_SPEC_V1

Generated: 2026-06-09

## Verdict

`ART_02_VISUAL_ASSET_SPEC_V1_COMPLETE = YES`

## 1. Asset Tree

### Recommended directory structure

```text
assets/star-ritual/
├── lottie/
├── textures/
├── audio/
├── typography/
├── particles/
└── seals/
```

### Asset families

| Family | Purpose |
|---|---|
| `lottie` | ritual line motion, seal opening, chart contraction |
| `textures` | paper grain, ink wash, bronze patina, soft grain masks |
| `audio` | ambient field tone, star ignition, flow tone, completion tone |
| `typography` | short ritual lines, sealing copy, metadata labels |
| `particles` | star dust, golden flow, quiet field drift |
| `seals` | completion seal, witness seal, star-seat seal marks |

## 2. Asset Naming Rules

### Naming pattern

- `art02_star_quiet_01`
- `art02_star_chart_open_01`
- `art02_star_seat_light_01`
- `art02_gold_flow_01`
- `art02_completion_seal_01`

### Naming principles

- stable
- descriptive
- series-aware
- no game jargon
- no reward jargon

### Do not use

- `gacha`
- `loot`
- `reward`
- `SSR`
- `levelup`
- `battle`

## 3. Lottie Breakdown

ART-02 should be built from a small, reusable Lottie stack rather than one giant animation.

### Lottie_01 — Star Chart Open

Purpose:
- open the ritual field into the chart state

Motion:
-卷轴展开
- chart edges reveal
- quiet hold

Suggested length:
- `1.5s` to `2.5s`

### Lottie_02 — Star Seat Response

Purpose:
- show the selected star seat answering

Motion:
- point breathes
- glow rises softly
- no flash

Suggested length:
- `1.5s` to `2.0s`

### Lottie_03 — Gold Flow Thread

Purpose:
- connect the activated point back into the wider constellation

Motion:
- gold thread traces a curved route
- motion should feel woven

Suggested length:
- `2.0s` to `3.0s`

### Lottie_04 — Completion Seal

Purpose:
- confirm that the ritual has settled

Motion:
- seal descends
- rests quietly
- no explosive landing

Suggested length:
- `1.0s` to `1.8s`

## 4. Lottie Technical Split

### Lottie responsibilities

Lottie should handle:

- chart opening and closing
- seal appearance
- restrained line motion
- state confirmation transitions

### Canvas responsibilities

Canvas should handle:

- particle drift
- star dust
- layered field grain
- long flowing trails
- subtle constellation background

### Optional Spine responsibilities

Use Spine only if a character or ceremonial figure must appear in a ritual-specific branch.

Spine should not be the default implementation for ART-02.

## 5. Paper and Background Spec

### Paper background

The base background should feel like paper and archival field space.

Requirements:

- warm paper tone
- low contrast grain
- slight textured depth
- not pure white

### Texture types

- 宣纸 grain
- old paper wash
- ink edge fade
- bronze patina mask

### Compression guidance

- keep textures small and reusable
- use tiling where possible
- avoid large bitmap backgrounds unless necessary

## 6. Star Map Spec

### Node system

Each star point should define:

- node size
- node color
- glow intensity
- connecting line width
- active / inactive / witnessed state

### Node scale guidance

| State | Size | Behavior |
|---|---|---|
| Unseen | small | quiet, low opacity |
| Seen | medium | stable presence |
| Active | medium-large | breathing glow |
| Witnessed | medium | settled glow + seal confirmation |

### Node color guidance

- base node: muted mineral tone
- active node: restrained gold
- witness node: gold with low red seal accent if needed

### Line system

- keep line widths thin
- preserve reading space
- do not turn the chart into a neon web

## 7. Gold Flow Spec

Golden flow is the primary visual connector in ART-02.

### Motion requirements

- continuous
- curved
- smooth
- ceremonial
- not explosive

### Visual requirements

- low-saturation gold
- narrow trail
- soft bloom
- short tail decay

### Avoid

- thick neon ribbons
- spark rain
- hard sci-fi beams
- explosion core

## 8. Seal Spec

The seal is the ritual closure asset.

### Seal requirements

-朱砂-like accent
- compact size
- stable silhouette
- archival feeling
- non-reward tone

### Seal behavior

- appears after the star seat settles
- confirms the event
- remains visible for a short hold
- then contracts or fades gently

### Seal anti-behavior

- no prize stamp
- no achievement medal shine
- no trophy pop

## 9. Copy Layout Spec

### Copy placement

- lower third or side margin
- must not cover the activated node
- must have breathing space

### Copy style

- 1 line preferred
- 2 lines maximum
- ritual type
- compact
- readable

### Copy animation

- fade in
- hold
- no typewriter effect
- no dramatic bounce

## 10. Sound Asset Spec

### Audio layers

| Layer | Purpose |
|---|---|
| ambient | field quiet, pre-ritual stability |
| ignition | star point acknowledgment |
| flow | connective gold motion |
| completion | settle and return |

### Audio constraints

- low noise
- no arcade impact
- no blast
- no exaggerated chime stack

### Suggested durations

- ambient bed: loopable
- ignition cue: under 1s
- flow cue: 2s to 4s
- completion cue: under 1.5s

## 11. Performance Constraints

The asset set must be mobile-safe.

### Constraints

- total runtime asset stack should stay light
- prefer vector and procedural motion over heavy bitmap sequences
- keep particle counts controlled
- avoid full-screen overdraw

### Miniapp guidance

- Lottie and Canvas should be the primary runtime layers
- texture assets should be reused across states
- audio should be short and optional

## 12. State Model

### Required states

- `未回应`
- `已回应`
- `激活中`
- `已归位`

### State mapping

| State | Visual behavior |
|---|---|
| `未回应` | chart quiet, node dim |
| `已回应` | node visible, line present |
| `激活中` | glow and gold flow active |
| `已归位` | seal and stable witness state |

## 13. Asset Priority

### P0

- Lottie_01 star chart open
- Lottie_02 star seat response
- particle field base
- star node glyph set
- completion seal

### P1

- Lottie_03 gold flow thread
- texture masks
- ritual copy layout
- ambient / ignition / completion audio

### P2

- optional character or ceremonial branch
- extended constellation variants
- later star system expansion

## 14. Quality Bar

Each asset must be:

- calm
- legible
- reusable
- highly controlled
- culturally consistent

Each asset must avoid:

- game reward spectacle
- cheap fantasy styling
- loud motion clutter
- productized toy aesthetics

## 15. Implementation Guidance

This document is an asset spec, not an implementation plan.

It should be used by the team to produce:

- ready-to-animate Lottie assets
- reusable particle patterns
- restrained sound cues
- star-point state symbols

## 16. Output Marker

`ART_02_VISUAL_ASSET_SPEC_V1_COMPLETE = YES`

