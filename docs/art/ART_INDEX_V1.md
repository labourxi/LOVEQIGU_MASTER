# ART_INDEX_V1

Version: V1.5  
Status: ACTIVE  
Owner: LOVEQIGU ART  
Updated: 2026-06-18  

---

# 1. Purpose

This index is the single entry point for `docs/art/` assets.

It is index-only:

- do not modify existing ART canon files
- do not rename files
- do not move files
- do not create new visual rules

If duplicate or unclear files are found, list them as `WARN`.

---

# 2. Primary Load Order

Future ART tasks **must** load art docs in this order:

```text
ART_BIBLE_V1
        ↓
ART_02_VISUAL_ASSET_SPEC_V1
        ↓
ART_03_VISUAL_PHILOSOPHY_V1
        ↓
ART_03A_REVELATION_PARTICLE_SYSTEM_V1
        ↓
ART_03B_TREASURE_REVELATION_TEMPLATE_V1
        ↓
ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1
        ↓
FOUR_SYMBOL_VISUAL_SYSTEM_V1.1
        ↓
ART_04_VISUAL_PROTOTYPE_V1
```

Secondary / parallel stacks (relic identity, dual-home, scenic pipeline, star activation V2, etc.) load **after** the primary chain unless a task explicitly scopes to them.

---

# 3. Primary Chain Registry

Each entry includes: Purpose · Status · Dependencies · Related Visual Layer · Related Runtime Layer.

---

## ART_BIBLE_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/ART_BIBLE_V1.md` |
| **Purpose** | Project supreme visual temperament: Eastern contemplative field-guide aesthetic, color system, typography, anti-keywords, and global visual exclusions. |
| **Status** | FROZEN · `ART_BIBLE_V1_COMPLETE = YES` |
| **Dependencies** | Product world canon (`LOVEQIGU_CORE_PHILOSOPHY_V1` · `LOVEQIGU_AXIOM_V1`) — upstream, external to `docs/art/` |
| **Related Visual Layer** | Global palette (玄青 · 鎏金 · 宣纸白) · title/body typography · ritual vs commercial tone split · asset temperament keywords |
| **Related Runtime Layer** | `apps/miniapp/config/brand.v1.js` · design tokens · all visible miniapp surfaces (indirect) |

---

## ART_02_VISUAL_ASSET_SPEC_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/ART_02_VISUAL_ASSET_SPEC_V1.md` |
| **Purpose** | Asset tree, naming rules, Lottie breakdown, particle/seal families, and production quality bar for star-ritual assets. |
| **Status** | FROZEN · `ART_02_VISUAL_ASSET_SPEC_V1_COMPLETE = YES` |
| **Dependencies** | `ART_BIBLE_V1` |
| **Related Visual Layer** | `assets/star-ritual/{lottie,textures,audio,typography,particles,seals}` · art02_* naming series |
| **Related Runtime Layer** | `apps/miniapp/services/lottie/lottie-service.js` · Lottie asset production pipeline |

---

## ART_03_VISUAL_PHILOSOPHY_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md` |
| **Purpose** | Defines ART-03 visual philosophy: revelation ≠ acquisition,遮蔽消散, observational (not explosive) motion, and shared language for treasure · blessing · star · meridian · AR reveal moments. |
| **Status** | FROZEN · restored and registered; referenced by `ART_03A` · `ART_03C` · `TREASURE_ARCHETYPE_SYSTEM_V1` |
| **Dependencies** | `ART_BIBLE_V1` · `ART_02_VISUAL_ASSET_SPEC_V1` |
| **Related Visual Layer** | Revelation path (遮蔽 → 消散 → 刻线 → 关系 → 回响 → 祝福) · connection-lighting temperament · particle restraint rules |
| **Related Runtime Layer** | All reveal sequences: `ar-entry` · `celebration-modal` · `first-light-service` · star-map · meridian-map · digital-collectible |
| **Candidate (non-equivalent)** | `docs/art/ART_03_REVELATION_RITUAL_V1.md` §核心哲学 · `docs/ART_BIBLE_V1.md` §Visual Philosophy |

---

## ART_03A_REVELATION_PARTICLE_SYSTEM_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md` |
| **Purpose** | Particle asset canon for all revelation states: micro-light · resonance wave · connection flow · awakening spark; unified motion language across treasure, blessing, star, meridian, four-symbol, and AR scenes. |
| **Status** | FROZEN · `READY_FOR_IMPLEMENTATION = YES` |
| **Dependencies** | `ART_03_VISUAL_PHILOSOPHY_V1` · `REVELATION_EXPERIENCE_ARCHITECTURE_V1` · `BLESSING_RESONANCE_MODEL_V1` · `RELIC_CANON_V2` |
| **Related Visual Layer** | PARTICLE_001–004 · Lottie particle textures · Canvas micro-light layers · Resonance Wave (水面波纹, not 冲击波) |
| **Related Runtime Layer** | `ar_imprint_particles_v1` (chapter AR events) · `services/immersion/first-light-service.js` · `components/celebration-modal/*` · `pages/lottie/index` |

---

## ART_03B_TREASURE_REVELATION_TEMPLATE_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md` |
| **Purpose** | Treasure revelation flow template: particle gather → pattern form → treasure appear → name reveal; emotion target =「发现宝物」not「领取奖励」. |
| **Status** | FROZEN · restored and registered; referenced by `ART_03A` · `ART_03C` · `TREASURE_ARCHETYPE_SYSTEM_V1` · `ART_04` P02 |
| **Dependencies** | `ART_03_VISUAL_PHILOSOPHY_V1` · `ART_03A_REVELATION_PARTICLE_SYSTEM_V1` · `TREASURE_ARCHETYPE_SYSTEM_V1` |
| **Related Visual Layer** | P02 宝物显现 · DISCOVERY_TEMPLATE_001/002 reveal stages · treasure archetype visual mother-templates |
| **Related Runtime Layer** | `pages/ar-entry/*` · `pages/digital-collectible/*` · `services/digital-collectible/digital-collectible-service.js` · `ART_04` prototype flow P02 |
| **Candidate (partial)** | `docs/art/TREASURE_ARCHETYPE_SYSTEM_V1.md` (archetype rules) · `docs/art/ART_03_REVELATION_RITUAL_V1.md` (shared reveal path) |

---

## ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md` |
| **Purpose** | Connection-lighting template for all graph-illumination scenes: star name · constellation · four-symbol · acupoint · meridian · unity; six-stage flow (Dark Hold → Line Emerge → Node Awakening → Stable Light → Resonance → Settled). |
| **Status** | FROZEN · `READY_FOR_IMPLEMENTATION = YES` |
| **Dependencies** | `ART_03_VISUAL_PHILOSOPHY_V1` · `ART_03A_REVELATION_PARTICLE_SYSTEM_V1` · `RELIC_CANON_V2` · `FOUR_SYMBOL_ARCHITECTURE_V1` |
| **Related Visual Layer** | Connection Flow · Awakening Spark · Resonance Wave · star-map / meridian-map / heaven-human-unity UI lighting states |
| **Related Runtime Layer** | `services/star-map/star-map-service.js` · `services/meridian-map/meridian-map-service.js` · `services/heaven-human-unity/heaven-human-unity-service.js` · `services/immersion/first-light-service.js` · `pages/star-map/*` · `pages/meridian-map/*` · `pages/heaven-human-unity/*` |

---

## FOUR_SYMBOL_VISUAL_SYSTEM_V1.1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1_1.md` |
| **Purpose** | World visualization layer and visual expression authority for Four Symbol scenes; carries the visual canon for青龙 / 朱雀 / 白虎 / 玄武 / central axis without redefining philosophy, governance, or runtime behavior. |
| **Status** | ACTIVE · Frozen YES · Current Active YES · Layer `ART_CORE_CANON` · Authority YES |
| **Dependencies** | `ART_BIBLE_V1` · `ART_03_VISUAL_PHILOSOPHY_V1` |
| **Downstream** | `ART_03A_REVELATION_PARTICLE_SYSTEM_V1` · `ART_03B_TREASURE_REVELATION_TEMPLATE_V1` · `ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1` · `ART_04_VISUAL_PROTOTYPE_V1` |
| **Role** | Visual expression authority only; not philosophy, governance, or runtime. |

---

## ART_04_VISUAL_PROTOTYPE_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md` (**WARN**: content currently at `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md.txt`) |
| **Purpose** | ART-04 visual prototype stage: validate experience, emotion, pacing, and worldview presentation across P01–P08 (祥云之门 → 宝物 → 藏品 → 信物 → 星宿 → 图谱 → 天人合一预告). |
| **Status** | FROZEN · content present · extension mismatch `WARN` |
| **Dependencies** | Full ART-03 primary chain · `DISCOVERY_TEMPLATE_001` · UI page specs (PAGE_05–07) · `TREASURE_ARCHETYPE_SYSTEM_V1` |
| **Related Visual Layer** | Prototype screens P01–P08 · Canvas + Lottie stack · 东方图谱墙 · 青龙星图 progressive illumination |
| **Related Runtime Layer** | `services/prototype/prototype-runtime-service.js` · `pages/index/*` · `pages/relic-archive/*` · `pages/synthesis/*` · `pages/reward-center/*` · miniapp clickable prototype surfaces |

---

# 4. Extended File Registry

| File | Relative Path | Purpose | Status | Related Task | Dependency Relationship |
|---|---|---|---|---|---|
| `ART_BIBLE_V1.md` | `docs/ART_BIBLE_V1.md` | Supreme visual temperament and global art rules. | FROZEN | Visual bible | Upstream for entire ART stack; external to `docs/art/`. |
| `ART_02_VISUAL_ASSET_SPEC_V1.md` | `docs/ART_02_VISUAL_ASSET_SPEC_V1.md` | Asset tree, naming, Lottie/particle/seal families. | FROZEN | Visual asset spec | Depends on ART_BIBLE; upstream for production assets. |
| `ART_03_VISUAL_PHILOSOPHY_V1.md` | `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md` | ART-03 visual philosophy and shared reveal language. | FROZEN | ART-03 philosophy | Depends on ART_BIBLE + ART_02; upstream for ART_03A/B/C. |
| `ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md` | `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md` | Particle system across reveal, relic, star, and AR states. | FROZEN | Particle implementation | Depends on ART_03 philosophy + product resonance/relic canon. |
| `ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md` | `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md` | Treasure revelation flow template. | FROZEN | Treasure reveal template | Depends on ART_03A + treasure archetype system. |
| `ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md` | `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md` | Connection-lighting for star/meridian/unity graphs. | FROZEN | Connection lighting | Depends on ART_03A + four-symbol + relic canon. |
| `FOUR_SYMBOL_VISUAL_SYSTEM_V1_1.md` | `docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1_1.md` | World visualization layer for Four Symbol scenes. | ACTIVE · Frozen YES · Current Active YES · Layer ART_CORE_CANON · Authority YES | Four Symbol visual authority | Depends on ART_BIBLE + ART_03 philosophy; downstream for ART_03A/B/C and ART_04. |
| `ART_04_VISUAL_PROTOTYPE_V1.md` | `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md` | First visual prototype validating P01–P08 experience. | FROZEN · **WARN .txt** | Visual prototype | Depends on full ART-03 chain + discovery templates. |
| `ART_02_RELIC_IDENTITY_SYSTEM_V1.md` | `docs/art/ART_02_RELIC_IDENTITY_SYSTEM_V1.md` | Relic identity, meaning, and distinction from treasure/reward. | FREEZE | Relic identity | Parallel stack; depends on ART_03 visual language. |
| `ART_02_RELIC_LANGUAGE_V1.md` | `docs/art/ART_02_RELIC_LANGUAGE_V1.md` | Relic vocabulary and forbidden language. | FREEZE | Relic language | Depends on relic identity system. |
| `ART_02_KEY_VISUAL_V1.md` | `docs/art/ART_02_KEY_VISUAL_V1.md` | Overall AR companion visual temperament. | FREEZE | Key visual | Depends on relic identity + dual-home framing. |
| `ART_02_DUAL_HOME_VISUAL_SYSTEM_V1.md` | `docs/art/ART_02_DUAL_HOME_VISUAL_SYSTEM_V1.md` | Dual-home visual system for visitor and explorer modes. | FREEZE | Dual-home visual | Depends on product home architecture + key visual. |
| `ART_02_AR_CULTURAL_EXPERIENCE_MODEL_V1.md` | `docs/art/ART_02_AR_CULTURAL_EXPERIENCE_MODEL_V1.md` | AR cultural experience model (culture-driven, not game-driven). | FREEZE | AR cultural model | Depends on AR tone and product cultural framing. |
| `ART_02_ASSET_PACKAGE_V1.md` | `docs/art/ART_02_ASSET_PACKAGE_V1.md` | First-stage asset package and grouped categories. | FREEZE | Asset package | Depends on ART_02 key visual + relic + dual-home + AR model. |
| `ART_03_REVELATION_RITUAL_V1.md` | `docs/art/ART_03_REVELATION_RITUAL_V1.md` | Shared visual language for revelation moments. | FREEZE | Revelation ritual | Candidate partial source for missing ART_03_VISUAL_PHILOSOPHY. |
| `ART_03_RELATIONSHIP_REVEALED_V1.md` | `docs/art/ART_03_RELATIONSHIP_REVEALED_V1.md` | What is revealed: relationship, not object acquisition. | FREEZE | Relationship revealed | Depends on revelation ritual. |
| `ART_03_FINAL_KEYFRAME_GUIDE_V1.md` | `docs/art/ART_03_FINAL_KEYFRAME_GUIDE_V1.md` | Final keyframe behavior after ritual ends. | FREEZE | Final keyframe | Depends on revelation ritual + relationship revealed. |
| `ART_03_STAR_ACTIVATION_V2.md` | `docs/art/ART_03_STAR_ACTIVATION_V2.md` | Unified visual logic for star activation. | FREEZE | Star activation V2 | Parallel stack; depends on ART_03 revelation ritual. |
| `TREASURE_ARCHETYPE_SYSTEM_V1.md` | `docs/art/TREASURE_ARCHETYPE_SYSTEM_V1.md` | Five treasure archetypes and production rules. | FROZEN | Treasure archetypes | Candidate partial source for missing ART_03B. |
| `ART_SCENIC_CONTENT_PIPELINE_V1.md` | `docs/art/ART_SCENIC_CONTENT_PIPELINE_V1.md` | Scenic content production pipeline. | FREEZE | Scenic pipeline | Depends on scene data + asset packages. |
| `ART_INDEX_V1.md` | `docs/art/ART_INDEX_V1.md` | This index file. | ACTIVE | ART index maintenance | Index only; no downstream implementation. |
| `VISUAL_AUTOPILOT_PIPELINE_V1.md` | `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md` | Automated visual asset pipeline: prompt → audit → score → registry → freeze. | ACTIVE · Frozen YES | Visual production governance | Depends on ART primary chain; governs asset entry to Runtime. |
| `AR_VIRAL_ENGINE_POSITIONING_V1.md` | `docs/product/ar/AR_VIRAL_ENGINE_POSITIONING_V1.md` | Defines AR revelation as AR Viral Engine; dual flywheel; Shareability Score for reveal schemes. | FROZEN · P0 | AR revelation shareability | Product Strategy cross-ref; informs ART_03 reveal moments + AR cultural experience shareability. |
| `CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md` | `docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md` | Cultural Archetype Visual Bible; unified visual standards for AR Factory · AI · Lottie · Runtime. | FROZEN · P0 | Cultural archetype visuals | Depends on ART_BIBLE · CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1; upstream for archetype image generation. |

---

# 5. Governance References

## VISUAL_AUTOPILOT_PIPELINE_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md` |
| **Role** | **Visual Production Governance** |
| **Status** | ACTIVE · Frozen YES |
| **Purpose** | First-generation automated visual asset pipeline: L1 Prompt Generator → L2 Multi-Model Generation → L3 Visual Audit → L4 Visual Scoring → L5 Visual Registry → L6 Freeze Gate → Manual Approval → Runtime. |
| **Dependencies** | `ART_BIBLE_V1` · `ART_INDEX_V1` · `FOUR_SYMBOL_VISUAL_SYSTEM_V1.1` · `ART_03_VISUAL_PHILOSOPHY_V1` · `ART_04_VISUAL_PROTOTYPE_V1` |
| **Related Visual Layer** | Audit against ART Bible · Four Symbol Visual System · ART_03 philosophy; scoring dimensions (Eastern Atmosphere · Ritual · Blank Space · Ancient Texture · Revelation · Four Symbol Consistency · Runtime Feasibility) |
| **Related Runtime Layer** | `docs/art/assets/` · `reports/art/` — assets enter Runtime only after Audit Record · Score Record · Freeze Record |

**Governance rule**: Visual assets must never bypass Audit → Score → Freeze directly into Runtime.

## AR_VIRAL_ENGINE_POSITIONING_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/product/ar/AR_VIRAL_ENGINE_POSITIONING_V1.md` |
| **Role** | **Product Strategy · AR Viral Engine** |
| **Status** | FROZEN · P0 |
| **Module** | Product Strategy |
| **Purpose** | 定义 AR 显现体验为 AR 游伴传播引擎（AR Viral Engine）；明确传播飞轮与商业飞轮双体系；未来 AR 显现方案须评估 Shareability Score。 |
| **Dependencies** | `ART_03_VISUAL_PHILOSOPHY_V1` · `ART_02_AR_CULTURAL_EXPERIENCE_MODEL_V1` · `AR_INTERACTION_ARCHITECTURE_V1.1` (product layer) |
| **Related Visual Layer** | AR revelation shareability · 神兽显现 · 古树现龙 · 石碑现字 · 星宿点亮 · 震撼视觉体验 |
| **Related Runtime Layer** | AR reveal evaluation criteria; does not define runtime implementation |

**Strategy rule**: Future AR reveal visuals should be evaluated against Shareability Score (拍摄 · 朋友圈 · 抖音 · 转发 · 记忆点).

## CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1

| Field | Value |
|-------|-------|
| **Path** | `docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md` |
| **Role** | **Cultural Archetype Visual Bible** |
| **Status** | FROZEN · P0 |
| **Owner** | ART |
| **Purpose** | 统一 AR Factory · AI生图 · Gemini · 豆包 · 外包美术 · Lottie · Runtime 的文化原型视觉标准；定义 P0 原型视觉语言与 Factory 标准输出结构。 |
| **Dependencies** | `ART_BIBLE_V1` · `CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1` · `AR_VIRAL_ENGINE_POSITIONING_V1` |
| **Related Visual Layer** | 财神 · 金凤凰 · 花神 · 金龙 · 孔子 · 东方壁画感 · 显现大于出现 |
| **Related Runtime Layer** | Factory `archetype_name` · `visual_style` · `reveal_sequence` · `blessing_sequence` · `viral_score` output fields |

**Visual rule**: 禁止二次元 · 禁止游戏角色化 · 现实30% / 文化50% / 神性20% · 金龙不采用四象青龙视觉体系。

---

# 6. Section Index

## Primary Chain (load first)

- `docs/ART_BIBLE_V1.md`
- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md`
- `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`
- `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md`
- `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`
- `docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1_1.md`
- `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md` *(WARN .txt)*

## Visual Bible & Key Visual

- `docs/ART_BIBLE_V1.md`
- `docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md`
- `ART_02_KEY_VISUAL_V1.md`
- `ART_02_DUAL_HOME_VISUAL_SYSTEM_V1.md`

## Visual Asset Specs

- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- `ART_02_ASSET_PACKAGE_V1.md`
- `ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`
- `ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`

## Revelation / Ritual / Prototype

- `ART_03_REVELATION_RITUAL_V1.md`
- `ART_03_RELATIONSHIP_REVEALED_V1.md`
- `ART_03_FINAL_KEYFRAME_GUIDE_V1.md`
- `ART_03_STAR_ACTIVATION_V2.md`
- `FOUR_SYMBOL_VISUAL_SYSTEM_V1.1`
- `ART_04_VISUAL_PROTOTYPE_V1.md`

## Relic / Treasure / Scenic

- `ART_02_RELIC_IDENTITY_SYSTEM_V1.md`
- `ART_02_RELIC_LANGUAGE_V1.md`
- `TREASURE_ARCHETYPE_SYSTEM_V1.md`
- `ART_SCENIC_CONTENT_PIPELINE_V1.md`

## Visual Production Governance

- `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md`

## Product Strategy Cross-References

- `docs/product/ar/AR_VIRAL_ENGINE_POSITIONING_V1.md`
- `docs/product/ar_factory/archetype/CHINESE_CULTURAL_ARCHETYPE_LIBRARY_V1.md`

## Cultural Archetype Visual

- `docs/art/cultural_archetype/CULTURAL_ARCHETYPE_VISUAL_BIBLE_V1.md`

---

# 7. Conflict Rules

- `ART_INDEX_V1` is an index only.
- Do not modify existing ART canon files.
- Do not rename files.
- Do not move files.
- Do not create new visual rules.
- **Load order**: Primary chain (§2) overrides section-index grouping when both apply.
- **`ART_BIBLE_V1`** overrides all lower ART layers on temperament and exclusions.
- **`ART_03_VISUAL_PHILOSOPHY_V1`** (when present) overrides ART_03A/B/C on philosophy; cannot weaken ART_BIBLE.
- **Library / prototype instances** cannot redefine frozen canon.
- If duplicate or unclear files are found, list them as `WARN`.

---

# 8. WARN Summary

| ID | File | Issue |
|----|------|-------|
| W1 | `ART_03_VISUAL_PHILOSOPHY_V1.md` | Referenced by multiple canon files; found on disk and registered |
| W2 | `ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md` | Referenced by ART_03A/C + TREASURE_ARCHETYPE + ART_04; found on disk and registered |
| W3 | `ART_04_VISUAL_PROTOTYPE_V1.md` | Full content exists at **`ART_04_VISUAL_PROTOTYPE_V1.md.txt`**; canonical `.md` path missing |
| W4 | `REVELATION_EXPERIENCE_ARCHITECTURE_V1` | Upstream dependency of ART_03A; **not found on disk** |

---

# 9. Readiness

- Primary load order: ART_BIBLE → ART_02 → ART_03 chain → FOUR_SYMBOL → ART_04.
- `VISUAL_AUTOPILOT_PIPELINE_V1` registered under Governance References.
- Extended registry retained for parallel ART-02/03 stacks.
- No existing ART canon file was modified.

`ART_INDEX_V1_UPDATED = YES`
