# PROJECT_KNOWLEDGE_SYNC_REPORT

Generated: 2026-06-11

## NEW KNOWLEDGE

### [docs/LOVEQIGU_BLESSING_COLLECTION_CANON_V1.md](D:/LOVEQIGU_MASTER/docs/LOVEQIGU_BLESSING_COLLECTION_CANON_V1.md)

- Purpose: defines the blessing collection product boundary.
- Core rules:
  - LOVEQIGU is not an AR game, not an AR treasure hunt, and not a digital collectible platform.
  - The final positioning is an Eastern blessing collection platform.
  - Blessings are collectible memorial assets, not progression systems.
  - Only one growth system exists: `天人合一`.
  - Digital collectibles are blessing carriers, not independent growth assets.
- Frozen constraints:
  - no blessing leveling
  - no blessing strengthening
  - no blessing advancement
  - no blessing value growth
- Dependencies:
  - blessing collection flow
  - digital collectible generation
  - share / propagation surface
- Affected tasks:
  - blessing collection UX
  - digital collectible presentation
  - rights / blessing commercial surfaces

### [docs/DUAL_HOME_PRODUCT_ARCHITECTURE_V1.md](D:/LOVEQIGU_MASTER/docs/DUAL_HOME_PRODUCT_ARCHITECTURE_V1.md)

- Purpose: defines the dual home architecture.
- Core rules:
  - one physical home shell, two logical home modes
  - `探索首页` handles `Path A` and `Path B`
  - `结缘首页` handles `Path C`
  - first entry uses source-based default, then a visible manual switch, then persisted last mode
  - path switching must remain permanent and visible
- Frozen constraints:
  - do not collapse the two intents into one blended home
  - do not hide the switch behind settings
  - do not inject L1 commercial language into the exploration shell
- Dependencies:
  - home policy service
  - home shell service
  - home mode switch component
- Affected tasks:
  - homepage routing
  - mode persistence
  - commercial/exploration split

### [docs/ART_BIBLE_V1.md](D:/LOVEQIGU_MASTER/docs/ART_BIBLE_V1.md)

- Purpose: defines the AR companion visual temperament.
- Core rules:
  - Eastern, ritualized, observational, and high-grade
  - not a game shell
  - not fantasy combat
  - not loot-driven
  - material palette over synthetic palette
- Frozen constraints:
  - keep AR as a witnessing surface
  - preserve calm, restraint, and clarity
  - avoid neon / cyber / casino styling
- Dependencies:
  - STAR_ACTIVATION_RITUAL_V1
  - ART_02_VISUAL_ASSET_SPEC_V1
- Affected tasks:
  - AR-02 implementation
  - art asset integration
  - ritual motion language

### [apps/miniapp/pages/rights-center/index.js](D:/LOVEQIGU_MASTER/apps/miniapp/pages/rights-center/index.js) and [apps/miniapp/pages/rights-center/index.wxml](D:/LOVEQIGU_MASTER/apps/miniapp/pages/rights-center/index.wxml)

- Purpose: rights center surface for commercial / activity entry.
- Core rules:
  - read-only commercial display
  - no order / payment / redemption completion path yet
  - rights data is mapped from the rights service
  - primary action is to view campaign closure
- Frozen constraints:
  - rights remain distinct from relic progression
  - the surface is a commercial lane, not a ritual lane
- Dependencies:
  - rights service
  - campaign service
  - CH10 rights data
- Affected tasks:
  - Path C
  - commercial home mode
  - rights browsing

### [apps/miniapp/pages/scenic-list/index.js](D:/LOVEQIGU_MASTER/apps/miniapp/pages/scenic-list/index.js) and [apps/miniapp/pages/scenic-detail/index.js](D:/LOVEQIGU_MASTER/apps/miniapp/pages/scenic-detail/index.js)

- Purpose: prototype scenic discovery surfaces.
- Core rules:
  - scenic list is grouped by nearby / hot / recommended
  - scenic detail is runtime-backed and uses prototype scenic data
  - scenic detail can bridge to explore map and rights center
  - digital collectible displays are preview / sharing surfaces, not Relic progression
- Frozen constraints:
  - scenic pages are prototype runtime surfaces
  - do not mutate canon data
  - do not convert scenic UI into ranking or reward mechanics
- Dependencies:
  - prototype runtime service
  - rights service
  - story service
  - digital collectible service
- Affected tasks:
  - homepage quick links
  - scenic detail entry
  - explore / rights cross-navigation

### [apps/miniapp/services/prototype/prototype-runtime-service.js](D:/LOVEQIGU_MASTER/apps/miniapp/services/prototype/prototype-runtime-service.js)

- Purpose: runtime-backed mock scenic / star / meridian data provider.
- Core rules:
  - does not mutate content-layer JSON or Canon
  - provides scenic list/detail, home dashboard, star map, meridian map, and relic library summaries
  - scenic detail can surface runtime digital collectibles when chapter-linked
- Frozen constraints:
  - keep it read-only over source data
  - use it as a presentation bridge only
- Dependencies:
  - story service
  - relic service
  - rights service
  - digital collectible service
- Affected tasks:
  - homepage
  - scenic list/detail
  - prototype map surfaces

### [apps/miniapp/services/home/home-policy-service.js](D:/LOVEQIGU_MASTER/apps/miniapp/services/home/home-policy-service.js) and [apps/miniapp/services/home/home-shell-service.js](D:/LOVEQIGU_MASTER/apps/miniapp/services/home/home-shell-service.js)

- Purpose: dual-home policy and shell assembly.
- Core rules:
  - mode resolution prefers policy, source, then persisted last mode
  - explore / affinity / campaign are distinct modes
  - campaign visibility is policy-driven
  - the shell is read-only and composes existing services
- Frozen constraints:
  - no mutation of CH01-CH06 bridges or canon data
  - do not remove mode switching
- Dependencies:
  - story service
  - relic service
  - campaign service
  - star map / meridian / heaven-human-unity / synthesis / reward services
- Affected tasks:
  - homepage logic
  - mode switching
  - home panel composition

### [docs/FIXPACK_TERMINOLOGY_REPORT.md](D:/LOVEQIGU_MASTER/docs/FIXPACK_TERMINOLOGY_REPORT.md)

- Purpose: records terminology cleanup around scenic / rights copy.
- Core rules:
  - scenic-detail CTA is aligned to `结缘商城`
  - approved terminology compounds are preserved
- Affected tasks:
  - terminology checks
  - scenic detail CTA
  - rights-center copy

### [docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md](D:/LOVEQIGU_MASTER/docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md)

- Purpose: reports current governance status for Content Engine YAML.
- Core rules:
  - governance checks are schema-aware
  - legacy AR Event V1 records remain accepted when required identity fields are present
  - Digital Collectible may use `presentation_tier`
- Affected tasks:
  - content engine governance
  - cursor compatibility handling
  - relic / digital collectible boundary checks

## UPDATED KNOWLEDGE

- `docs/PROJECT_CONTEXT_REGISTRY_V1.md` should now treat the preflight layer and router layer as operational coordination files.
- `docs/PROJECT_CONTEXT_MEMORY_V1.md` remains correct on terminology aliasing: `docs/language/LOVEQIGU_TERMINOLOGY_V1.md` is authoritative until a separate final terminology file exists.
- `docs/PROJECT_CONTEXT_ROUTER_V1.md` is now physically present and can route `ART_02_IMPLEMENTATION_V1`, `ART_02_ASSET_INTEGRATION_V1`, `ART_02_KEY_VISUAL_V1`, `AUTOPILOT`, and `CH11_CONTENT_CANON_V1`.
- `apps/miniapp/app.json` now reflects the expanded route surface, including scenic, rights, star map, meridian map, heaven-human unity, synthesis, and reward center pages.
- `docs/EXPLORE_MAP_CHAPTER_PICKER_V1_REPORT.md` confirms chapter picker behavior is runtime-bridged, persistent, and scope-limited to exploration nodes and AR entry.

## CONFLICTS

### Terminology

- `apps/miniapp/pages/rights-center/index.js` still triggers a terminology warning because the scanner expects `尚未开放` rather than the current placeholder phrasing.
- This is a copy-level conflict, not a Canon conflict.

### Canon-sensitive wording

- `apps/miniapp/pages/seals/index.js`
- `apps/miniapp/pages/seals/index.json`
- `apps/miniapp/pages/synthesis/index.wxml`

These files are still flagged by the canon checker for the term `成就`. They need review if the pages are intended to remain in the release surface.

### Governance / cursor compatibility

- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md` remains warning-only because the Cursor compatibility audit still reports 51 warnings.
- This is a governance compatibility warning, not a content violation.

## REGISTRY IMPACT

- Add or retain the following coordination entries in the registry layer:
  - `docs/DUAL_HOME_PRODUCT_ARCHITECTURE_V1.md`
  - `docs/LOVEQIGU_BLESSING_COLLECTION_CANON_V1.md`
  - `docs/PROJECT_KNOWLEDGE_SYNC_REPORT.md`
  - `apps/miniapp/services/home/home-policy-service.js`
  - `apps/miniapp/services/home/home-shell-service.js`
  - `apps/miniapp/services/prototype/prototype-runtime-service.js`
  - scenic list / detail page surfaces
  - rights-center page surface
- The registry should continue to treat `docs/language/LOVEQIGU_TERMINOLOGY_V1.md` as the canonical terminology source.

## MEMORY IMPACT

- The memory layer should add these task clusters:
  - dual home architecture and mode switching
  - blessing collection canon and blessing carrier rules
  - scenic discovery prototype runtime
  - rights center commercial lane
- The memory layer should continue to block any attempt to convert blessing assets into a growth system or to mix rights with relic progression.
- The memory layer should keep the current terminology alias behavior unchanged.

## Recommended Actions

1. Keep the new dual-home and blessing canon docs in the active coordination set.
2. Resolve the `尚未开放` terminology mismatch in rights-center copy if that page remains user-facing.
3. Review the canon-sensitive `成就` occurrences in `seals` and `synthesis` before treating those pages as release-clean.
4. Maintain the separation between blessing collectibles, digital collectibles, and relic progression.
5. Preserve the preflight / router / registry chain as the repository’s task-ownership gate.

`PROJECT_KNOWLEDGE_SYNC_COMPLETE = YES`
