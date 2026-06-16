# ART_KNOWLEDGE_SYNC_V1_REPORT

Generated: 2026-06-12

## NEW KNOWLEDGE

### PACKAGE_ART_VISUAL_SYSTEM

This package consolidates the currently frozen ART visual canon into one loadable knowledge bundle for future ART / Runtime / UX work.

Loaded files:

- `docs/ART_BIBLE_V1.md`
- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`
- `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`
- `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md.txt`

Referenced but missing:

- `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md`
- `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md`

Partial candidates for the missing files:

- `docs/art/ART_03_REVELATION_RITUAL_V1.md`
- `docs/art/TREASURE_ARCHETYPE_SYSTEM_V1.md`

## FILE NOTES

### `docs/ART_BIBLE_V1.md`

Purpose:

- project supreme visual temperament
- Eastern, contemplative, observational AR posture

Visual rules:

- Eastern, not decorative
- ritual, not theatrical
- calm, not noisy
- material, not synthetic
- no game shell / combat / loot styling

Animation rules:

- not a motion spec
- only sets the tone for restrained motion

Interaction rules:

- AR moments should feel like recognition, not reward

Runtime dependencies:

- all visible miniapp surfaces indirectly

Asset dependencies:

- upstream for the entire ART stack

### `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`

Purpose:

- asset tree
- naming rules
- Lottie breakdown
- particle / seal families
- production quality bar

Visual rules:

- star ritual assets should remain calm and reusable
- no game-jargon asset naming

Animation rules:

- `Lottie_01` star chart open
- `Lottie_02` star seat response
- `Lottie_03` gold flow thread
- `Lottie_04` completion seal

Interaction rules:

- use the smallest possible Lottie/Canvas stack
- keep mobile-safe runtime behavior

Runtime dependencies:

- `apps/miniapp/services/lottie/lottie-service.js`

Asset dependencies:

- `assets/star-ritual/*`
- particle masks
- seal assets

### `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`

Purpose:

- canonical particle language for revelation states
- shared particle system across treasure, blessing, star, meridian, four-symbol, and AR scenes

Visual rules:

- micro-light
- resonance wave
- connection flow
- awakening spark
- no explosive spectacle

Animation rules:

- `dark -> visible -> connected -> confirmed -> settled`
- particles should reveal response, not excitement

Interaction rules:

- particle motion should help the user feel recognized and connected

Runtime dependencies:

- `services/immersion/first-light-service.js`
- `components/celebration-modal/*`
- `pages/lottie/index`
- chapter AR event particle use cases

Asset dependencies:

- `ART_03_VISUAL_PHILOSOPHY_V1` is a declared dependency but is currently missing on disk
- `BLESSING_RESONANCE_MODEL_V1`
- `RELIC_CANON_V2`

### `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`

Purpose:

- connection lighting template for star / mansion / four-symbol / meridian / unity graphs

Visual rules:

- lighting is recognition, not acquisition
- stable glow, not explosion
- restoration, not leveling

Animation rules:

- six-stage flow: dormant -> awakening -> connection flow -> node awakening -> stable light -> resonance
- maintain slow, quiet transitions

Interaction rules:

- lighting should tell the user the connection was found again

Runtime dependencies:

- `services/star-map/star-map-service.js`
- `services/meridian-map/meridian-map-service.js`
- `services/heaven-human-unity/heaven-human-unity-service.js`
- `services/immersion/first-light-service.js`

Asset dependencies:

- `ART_03_VISUAL_PHILOSOPHY_V1` is a declared dependency but is currently missing on disk
- `ART_03A_REVELATION_PARTICLE_SYSTEM_V1`
- `RELIC_CANON_V2`
- `FOUR_SYMBOL_ARCHITECTURE_V1`

### `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md.txt`

Purpose:

- first visual prototype stage
- validates experience, emotion, pacing, and worldview presentation

Visual rules:

- not a game
- not a reward system
- not an acquisition system
- focus on discovery, manifestation, connection, and return

Animation rules:

- use the prototype flow: discovery -> manifestation -> collectible reveal -> star activation -> constellation completion -> heaven-human-unity preview
- keep motion restrained and legible

Interaction rules:

- users should feel they discovered and understood something
- users should not feel they merely earned a prize

Runtime dependencies:

- `services/prototype/prototype-runtime-service.js`
- `pages/index/*`
- `pages/relic-archive/*`
- `pages/synthesis/*`
- `pages/reward-center/*`

Asset dependencies:

- full ART-03 primary chain
- `DISCOVERY_TEMPLATE_001`
- UI page specs for prototype screens

## VISUAL LOAD ORDER

Future ART work should load in this order:

1. `docs/ART_BIBLE_V1.md`
2. `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
3. `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md` if present
4. `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`
5. `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md` if present
6. `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`
7. `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md.txt`

Primary chain rule:

- `ART_BIBLE_V1` overrides all lower ART layers on temperament and exclusions.
- ART-03 philosophy, when present, overrides ART-03A / ART-03B / ART-03C on shared visual meaning.
- Runtime prototype files may only reflect frozen visual canon; they cannot redefine it.

## ART DEPENDENCIES

### Declared but missing

- `ART_03_VISUAL_PHILOSOPHY_V1`
- `ART_03B_TREASURE_REVELATION_TEMPLATE_V1`

### Available dependency anchors

- `ART_BIBLE_V1`
- `ART_02_VISUAL_ASSET_SPEC_V1`
- `ART_03A_REVELATION_PARTICLE_SYSTEM_V1`
- `ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1`
- `ART_04_VISUAL_PROTOTYPE_V1.md.txt`
- `ART_03_REVELATION_RITUAL_V1`
- `TREASURE_ARCHETYPE_SYSTEM_V1`
- `BLESSING_RESONANCE_MODEL_V1`
- `RELIC_CANON_V2`

### Runtime dependency summary

- ART-03A and ART-03C both point into reveal-heavy runtime surfaces.
- ART-04 points into prototype surfaces rather than source canon.
- The missing ART-03 philosophy and ART-03B treasure template are blocking only for tasks that require those explicit anchors.

## MEMORY IMPACT

- Add `PACKAGE_ART_VISUAL_SYSTEM` as the mandatory context bundle for future ART / Runtime / UX tasks that touch visual canon.
- Keep `ART_BIBLE_V1` and `ART_02_VISUAL_ASSET_SPEC_V1` as the first two required loads.
- When a task needs reveal motion, load `ART_03A_REVELATION_PARTICLE_SYSTEM_V1` and `ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1`.
- When a task needs prototype behavior, include `ART_04_VISUAL_PROTOTYPE_V1.md.txt` and treat it as the current prototype source.
- If a task explicitly requires `ART_03_VISUAL_PHILOSOPHY_V1` or `ART_03B_TREASURE_REVELATION_TEMPLATE_V1`, mark it blocked until a file exists or a source-of-truth alias is declared.

## REGISTRY IMPACT

- Add the ART visual package to the coordination registry as a first-class art bundle.
- Preserve the existing `docs/art/ART_INDEX_V1.md` primary chain order.
- Register the missing ART-03 philosophy and ART-03B treasure template as open gaps, not as invented files.
- Track `ART_04_VISUAL_PROTOTYPE_V1.md.txt` as a `.txt` extension mismatch that should be normalized only in a separate file-ops task.

## PRELIGHT IMPACT

- Preflight for ART tasks should load `PACKAGE_ART_VISUAL_SYSTEM` before implementation.
- If `ART_03_VISUAL_PHILOSOPHY_V1` is a required dependency, preflight must return `BLOCKED`.
- If `ART_03B_TREASURE_REVELATION_TEMPLATE_V1` is a required dependency, preflight must return `BLOCKED`.
- If the task can proceed using `ART_03_REVELATION_RITUAL_V1` and `TREASURE_ARCHETYPE_SYSTEM_V1` as partial candidates, preflight may return `WARN` instead of `BLOCKED`, but only when the task scope allows that substitution.

## ROUTER IMPACT

- ART visual tasks should continue routing to owner `C`.
- Implementation follow-up for ART visual assets should route to `B`.
- If a task is primarily about visual meaning, motion language, or reveal restraint, route through the art/content lane rather than the tech lane.
- Router entries should distinguish the primary ART visual chain from secondary runtime/prototype surfaces.

## READINESS

- The ART visual knowledge layer is now synchronized to the available frozen docs.
- The primary chain is clear, but two explicit dependencies remain missing on disk.
- No canon files were modified.
- The generated report captures the current state without inventing replacement canon.

`ART_KNOWLEDGE_SYNC_V1_COMPLETE = YES`
