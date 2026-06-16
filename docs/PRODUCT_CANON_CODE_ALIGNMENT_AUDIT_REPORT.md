# PRODUCT_CANON_CODE_ALIGNMENT_AUDIT_REPORT

Generated: 2026-06-11

## Verdict

`FAIL`

The MiniApp is partially aligned with the frozen product canon, but the current code still leaks task/reward/store language into the home and rights surfaces, and the scenic landing implementation does not yet match the dedicated landing-page model described in canon.

## PASS

### Explore map

- `apps/miniapp/pages/explore-map/index.js`
- `apps/miniapp/pages/explore-map/index.wxml`
- `apps/miniapp/pages/explore-map/index.json`

This surface is aligned with `docs/product/explore_map/LOVEQIGU_EXPLORE_MAP_CANON_V1.md`:

- page title is `探索地图`
- it presents chapter selection, exploration nodes, and AR entry
- it does not frame the surface as a task map, combat map, or leaderboard
- it keeps the route in exploration language rather than commercial language

### Blessing / collectible boundary

- `apps/miniapp/services/chapter/*-relics.js`
- `apps/miniapp/services/chapter/*-ar-events.js`
- `apps/miniapp/pages/digital-collectible/index.js`
- `apps/miniapp/pages/relic-archive/index.js`

These surfaces keep the separation between story progression assets and digital collectible / sharing assets. The code repeatedly states that digital collectibles are marketing and communication assets, not relic progression.

## WARN

### Dual-home architecture is structurally correct but over-extended

- `apps/miniapp/pages/index/index.js`
- `apps/miniapp/services/home/home-policy-service.js`
- `apps/miniapp/services/home/home-shell-service.js`
- `apps/miniapp/components/home-mode-switch/home-mode-switch.wxml`

The dual-home split matches `docs/DUAL_HOME_PRODUCT_ARCHITECTURE_V1.md`, but the actual home shell currently exposes extra reward, synthesis, and prototype dashboard surfaces that pull the entry page away from the canon-defined “where to go” first impression.

### Scenic list/detail are prototype-backed instead of canonical scenic landing pages

- `apps/miniapp/pages/scenic-list/index.js`
- `apps/miniapp/pages/scenic-detail/index.js`
- `apps/miniapp/services/prototype/prototype-runtime-service.js`

The scenic pages are usable, but they are still runtime-prototype pages. They do not yet implement the dedicated scenic landing-page model with per-scenic routing, site-based entry, and independently modeled scenic surfaces.

### Governance warnings remain external

- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`
- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md`

These are not code alignment failures by themselves, but they confirm the repository still carries legacy governance warning debt.

## FAIL

### 1. Homepage does not stay inside the canon-defined entry intent

Files:

- `apps/miniapp/pages/index/index.js`
- `apps/miniapp/pages/index/index.wxml`
- `apps/miniapp/components/explore-home-panel/explore-home-panel.wxml`
- `apps/miniapp/services/home/home-shell-service.js`
- `apps/miniapp/services/reward/reward-center-service.js`
- `apps/miniapp/pages/reward-center/index.*`
- `apps/miniapp/pages/synthesis/index.*`

Mismatch:

- `docs/product/homepage/LOVEQIGU_HOMEPAGE_CANON_V1.md` says the home page is a scenic exploration and rights entry surface whose first question is “where to go today.”
- The current home shell adds `我的奖励`, `淇＄墿鍚堟垚`, growth progress, prototype dashboard cards, star map, meridian map, and other utility surfaces directly into the entry experience.
- That makes the home feel like a mixed dashboard / task center rather than a clean scenic-and-rights entry page.

Recommended fix:

- remove reward/task-style primary blocks from the home surface
- reduce the home to the canon-defined scenic and rights entry hierarchy
- move synthesis / reward / growth surfaces out of the first-viewport home shell

### 2. Rights center is positioned like a store, not an exploration gift center

Files:

- `apps/miniapp/pages/rights-center/index.js`
- `apps/miniapp/pages/rights-center/index.wxml`
- `apps/miniapp/pages/rights-center/index.json`
- `apps/miniapp/services/chapter/*-rights.js`

Mismatch:

- `docs/product/rights_center/LOVEQIGU_POINTS_AND_RIGHTS_CANON_V1.md` says points are exploration motivation only, and the rights center is an exploration gift center, not a shop or ecommerce system.
- The code still presents the surface as `结缘商城`, uses commercial storefront language, and frames the page around redeem / claim style copy.
- That is a canon mismatch even when the terminology file allows the name string.

Recommended fix:

- reframe the page as an exploration gift center
- remove shop / ecommerce / redemption-store phrasing from user-visible copy
- keep rights as exploratory benefits, not commercial checkout flows

### 3. Scenic landing page canon is not fully implemented

Files:

- `apps/miniapp/pages/scenic-list/index.js`
- `apps/miniapp/pages/scenic-list/index.wxml`
- `apps/miniapp/pages/scenic-detail/index.js`
- `apps/miniapp/pages/scenic-detail/index.wxml`
- `apps/miniapp/services/prototype/prototype-runtime-service.js`
- `apps/miniapp/app.json`

Mismatch:

- `docs/product/scenic_access/LOVEQIGU_SCENIC_LANDING_PAGE_CANON_V1.md` requires a dedicated scenic landing-page model with scan-based or direct scenic entry, per-scenic presentation, and independent scenic configuration.
- The current implementation uses generic scenic list/detail prototype pages instead of a canonical per-scenic landing surface.
- There is no evidence of the site-based entry model or per-scenic landing contract in the code path.

Recommended fix:

- add dedicated scenic landing pages or route contracts per scenic
- carry `site_id` / source intent through the scenic entry path
- separate scenic landing presentation from generic prototype list/detail screens

### 4. Canon-sensitive wording still leaks into release pages

Files:

- `apps/miniapp/pages/seals/index.js`
- `apps/miniapp/pages/seals/index.json`
- `apps/miniapp/pages/synthesis/index.js`
- `apps/miniapp/pages/synthesis/index.wxml`
- `apps/miniapp/pages/reward-center/index.*`

Mismatch:

- the canon checker still flags `成就`-style wording in the seals and synthesis surfaces
- the home and reward surfaces still carry reward / achievement framing that conflicts with the frozen product canon’s restraint around growth, ranking, and task-center language

Recommended fix:

- rename or rewrite the affected copy to remove achievement / reward framing
- keep these pages out of the primary release surface until the wording is canon-safe

### 5. Brand and positioning drift

Files:

- `apps/miniapp/pages/index/index.js`
- `apps/miniapp/services/home/home-shell-service.js`
- `apps/miniapp/pages/scenic-detail/index.wxml`

Mismatch:

- the product brand `AR娓镐即` is present, but the current UI still reads like an exploration dashboard with reward and utility layers stacked on top of the brand
- the scenic detail page also mixes scenic preview with rights/store language too early in the flow
- that weakens the canon-defined separation between scenic exploration, blessing collection, and rights entry

Recommended fix:

- keep the brand visible, but simplify the first-viewport hierarchy
- ensure scenic and rights surfaces do not collapse into a generic utility dashboard

## Recommended Fixpack Items

1. Rebuild the homepage so the first viewport answers “where to go today” without exposing reward/task-center language.
2. Reframe rights-center as an exploration gift center and remove store-like redemption copy.
3. Add a dedicated scenic landing-page contract with site-based entry and per-scenic configuration.
4. Remove `成就` and similar achievement framing from seals / synthesis / reward surfaces.
5. Keep digital collectibles explicitly framed as marketing / communication assets, never as a progression system.
6. Preserve the exploration-rights split and do not merge them back into a single generic dashboard.

`PRODUCT_CANON_CODE_ALIGNMENT_AUDIT_COMPLETE = YES`
