# PROJECT_KNOWLEDGE_SYNC_V2_REPORT

Generated: 2026-06-12

## NEW KNOWLEDGE

### PACKAGE_BLESSING_SYSTEM

Files loaded:

- `docs/product/blessing_system/BLESSING_CANON_V1.md`
- `docs/product/blessing_system/BLESSING_GOVERNANCE_RULE_V1.md`
- `docs/product/blessing_system/BLESSING_LIBRARY_V1.md`
- `docs/product/blessing_system/LOVEQIGU_BLESSING_COLLECTION_CANON_V1.md`

Purpose:

- define the blessing collection product boundary
- keep blessings distinct from rewards, progression, and trading
- define the blessing library admission rules

Core rules:

- LOVEQIGU is an Eastern blessing collection platform
- blessings are collectible memorial assets, not a growth system
- `天人合一` remains the only growth system
- digital collectibles are blessing carriers, not independent growth assets
- blessings are responses / companionship /安定 surfaces, not reward mechanics

Frozen constraints:

- no blessing leveling
- no blessing strengthening
- no blessing advancement
- no blessing value growth
- no blessing marketplace semantics
- no trading, gifting, or exchange semantics for blessings

Dependencies:

- blessing library
- digital collectible presentation
- share / propagation surfaces
- rights / blessing commercial lane
- AR blessing surfaces

Task categories:

- blessing collection UX
- digital collectible presentation
- blessing library admission and governance
- rights-center blessing copy
- scenic / AR blessing display

### PACKAGE_RELIC_SYSTEM

Files loaded:

- `docs/product/relic_system/HEAVEN_SYSTEM_HIERARCHY_CANON_V1.md`
- `docs/product/relic_system/RELIC_CONTENT_DENSITY_RULE_V1.md`
- `docs/product/relic_system/RELIC_CONTENT_GENERATION_CANON_V1.md`
- `docs/product/relic_system/RELIC_DROP_ALGORITHM_CANON_V1.md`
- `docs/product/relic_system/RELIC_NAMING_RULE_V1.md`
- `docs/product/relic_system/RELIC_SYSTEM_ALIGNMENT_REPORT_V1.md`
- `docs/product/relic_system/RELIC_SYSTEM_REGISTRY_V1.md`
- `docs/product/relic_system/RELIC_VISUAL_CANON_V1.md`
- `docs/product/relic_system/STAR_OFFICER_BATCH_PLAN_V1.md`

Purpose:

- define the relic hierarchy, naming, density, generation, and visual canon
- establish the sole relic coordination entry point
- provide the batch production order for core relic content

Core rules:

- the valid hierarchy is `164 stars -> 28 mansions -> 4 quadrants -> heaven`
- relic system is the sole relic coordination entry point
- relics use standard naming and fixed data identity
- relics must be structurally generated and can be batch-produced
- relic visuals follow a unified eastern / restrained / ceremonial style

Frozen constraints:

- no intermediate hierarchy layers
- no level reordering
- no generic growth-system language
- no duplicate relic acquisition
- no independent treasure-style or reward-style semantics
- no arbitrary naming drift

Dependencies:

- visual canon
- content generation canon
- naming rule
- drop algorithm
- separation rule
- relic registry

Task categories:

- relic content generation
- relic naming and identity work
- relic visual asset generation
- relic drop / acquisition logic
- relic data registry maintenance
- chapter-linked relic rollout

### PACKAGE_PRODUCT_GOVERNANCE

Files loaded:

- `docs/product/governance/FILTER_CANON_V1.md`
- `docs/product/governance/FRAME_CANON_V1.md`
- `docs/product/governance/LOVEQIGU_PRODUCT_CANON_V1_AUDIT_PATCH_01.md`

Purpose:

- define product-level filter and frame governance
- align page naming and surface naming to the current product canon
- enforce blessed / relic / scenic boundary correctness

Core rules:

- filters and frames are platform assets
- filters and frames are not scenic assets and not discovery templates
- filter / frame counts are capped and require product approval after threshold
- scenic / landing / rights surfaces must use the current product naming model
- blessings are platform collectibles, not progression resources

Frozen constraints:

- no unbounded filter expansion
- no frame expansion without product approval
- no reuse of scene assets as platform assets
- no mixing of blessing, relic, and commercial semantics

Dependencies:

- blessing library presentation
- digital collectible styling
- product approval flow
- home / scenic / rights naming alignment
- terminology checks

Task categories:

- filter governance
- frame governance
- copy alignment audits
- scenic / landing page naming fixes
- rights / blessing terminology alignment

## TASK LOAD RULES

### Blessing tasks

Load in this order:

1. `docs/PROJECT_CONTEXT_REGISTRY_V1.md`
2. `docs/PROJECT_CONTEXT_MEMORY_V1.md`
3. `docs/product/blessing_system/BLESSING_CANON_V1.md`
4. `docs/product/blessing_system/BLESSING_GOVERNANCE_RULE_V1.md`
5. `docs/product/blessing_system/BLESSING_LIBRARY_V1.md`
6. `docs/product/blessing_system/LOVEQIGU_BLESSING_COLLECTION_CANON_V1.md`

Use this package for:

- blessing UI
- blessing library admission
- digital collectible presentation that represents blessings
- rights-center blessing copy

### Relic tasks

Load in this order:

1. `docs/PROJECT_CONTEXT_REGISTRY_V1.md`
2. `docs/PROJECT_CONTEXT_MEMORY_V1.md`
3. `docs/product/relic_system/HEAVEN_SYSTEM_HIERARCHY_CANON_V1.md`
4. `docs/product/relic_system/RELIC_SYSTEM_REGISTRY_V1.md`
5. `docs/product/relic_system/RELIC_NAMING_RULE_V1.md`
6. `docs/product/relic_system/RELIC_DROP_ALGORITHM_CANON_V1.md`
7. `docs/product/relic_system/RELIC_CONTENT_GENERATION_CANON_V1.md`
8. `docs/product/relic_system/RELIC_VISUAL_CANON_V1.md`
9. `docs/product/relic_system/RELIC_CONTENT_DENSITY_RULE_V1.md`

Use this package for:

- relic generation
- relic naming
- relic visuals
- relic acquisition / drop logic
- relic registry maintenance

### Product governance tasks

Load in this order:

1. `docs/PROJECT_CONTEXT_REGISTRY_V1.md`
2. `docs/PROJECT_CONTEXT_MEMORY_V1.md`
3. `docs/product/governance/FILTER_CANON_V1.md`
4. `docs/product/governance/FRAME_CANON_V1.md`
5. `docs/product/governance/LOVEQIGU_PRODUCT_CANON_V1_AUDIT_PATCH_01.md`
6. `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`

Use this package for:

- filter governance
- frame governance
- product naming alignment
- scenic / landing / rights copy checks
- terminology enforcement at the product layer

## PRELIGHT LOAD RULES

- If a task touches blessing, blessing library, digital collectible presentation, or rights-center blessing copy, preflight must load `PACKAGE_BLESSING_SYSTEM`.
- If a task touches relic generation, relic naming, relic visuals, or relic acquisition, preflight must load `PACKAGE_RELIC_SYSTEM`.
- If a task touches filters, frames, scenic naming, landing-page naming, or rights copy, preflight must load `PACKAGE_PRODUCT_GOVERNANCE`.
- If a task touches more than one of these clusters, load the union of the relevant packages in registry-first order.
- If a task conflicts with `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`, `docs/world/*`, or `docs/canon/*`, the task is blocked until the source canon is clarified.

## MEMORY IMPACT

- Add `PACKAGE_BLESSING_SYSTEM` as a mandatory context bundle for blessing-related tasks.
- Add `PACKAGE_RELIC_SYSTEM` as a mandatory context bundle for relic-related tasks.
- Add `PACKAGE_PRODUCT_GOVERNANCE` as a mandatory context bundle for product governance and naming tasks.
- Keep the terminology alias behavior unchanged: `docs/language/LOVEQIGU_TERMINOLOGY_V1.md` remains authoritative until a separate final terminology file exists.
- Continue to block any attempt to convert blessings into a growth system or to merge relic progression with blessing semantics.

## REGISTRY IMPACT

- Register the 16 newly frozen `docs/product/*` files as first-class coordination inputs.
- Group them into three registry clusters:
  - blessing system
  - relic system
  - product governance
- Keep `docs/product/blessing_system/*`, `docs/product/governance/*`, and `docs/product/relic_system/*` visible to task routing.
- Mark the new docs as frozen references, not implementation targets.

## ROUTER IMPACT

- Add explicit router entries for blessing-system tasks, relic-system tasks, and product-governance tasks.
- Blessing tasks should route to owner `A` when they are product / policy / naming decisions, and to `B` or `C` only for implementation or content follow-up.
- Relic tasks should route to owner `C` for content generation and to `B` for tooling or runtime integration.
- Product governance tasks should route to owner `B` when they are enforcement / validation / registry tasks.
- The router should treat `docs/product/*` as frozen knowledge, not mutable implementation work.

## READINESS

- The new blessing, relic, and product governance canon files are now part of the project knowledge layer.
- The registry should be updated to reflect the new frozen product canon cluster.
- Memory and preflight should load these packages automatically for future related tasks.
- Router coverage should be extended, but no structural router rewrite is required.
- No source canon was changed by this sync.

`PROJECT_KNOWLEDGE_SYNC_V2_COMPLETE = YES`
