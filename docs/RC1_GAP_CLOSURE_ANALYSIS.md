# RC1 Gap Closure Analysis

Scope:
- `docs/RC1_USER_JOURNEY_AUDIT_REPORT.md`
- `apps/miniapp/app.json`
- `apps/miniapp/pages/index/index.*`
- `apps/miniapp/pages/explore-map/index.*`
- `apps/miniapp/pages/ar-entry/index.*`
- `apps/miniapp/pages/story-archive/index.*`
- `apps/miniapp/pages/rights-center/index.*`
- `apps/miniapp/pages/relic-archive/index.*`
- `apps/miniapp/pages/profile/index.*`
- `services/story/story-service.js`
- `services/ar/ar-service.js`
- `services/relic/relic-service.js`
- `services/rights/rights-service.js`
- `data/story/chapters.json`
- `data/ar/ar-events.json`
- `data/relics/relics.json`
- `data/rights/rights.json`

## Gap Inventory

### Path A

Observed chain:
- Home -> Explore Map -> AR Entry

Gaps:
- No UI step for Atom.
- No UI step for Lottie.
- No UI step for Echo.
- No UI step for Digital Collectible.
- No explicit next-activity destination.

Impact:
- The path stops at AR preview placeholders.
- The user cannot complete the full RC1 closure sequence in the miniapp UI.

### Path B

Observed chain:
- Home -> Story Archive

Gaps:
- No UI step for Story Flow execution.
- No UI step for AR Event closure.
- No UI step for Echo.
- No UI step for Digital Collectible.

Impact:
- The story archive exposes read-only chapter data only.
- The path does not continue into the requested operational closure chain.

### Path C

Observed chain:
- Home -> Rights Center

Gaps:
- No campaign-closure page or flow surface.
- No next-activity destination.

Impact:
- The rights center exposes read-only benefit placeholders only.
- The path does not support campaign closure or post-campaign continuation.

## Required Pages

Missing or not wired as journey surfaces:
- Atom surface
- Lottie surface
- Echo surface
- Digital Collectible surface
- Next Activity surface
- Campaign Closure surface
- Story Flow execution surface

Present but insufficient for RC1 closure:
- Home
- Explore Map
- AR Entry
- Story Archive
- Rights Center
- Relic Archive
- Profile

## Required Navigation

Existing navigation:
- Home -> Explore Map
- Explore Map -> AR Entry

Missing navigation:
- AR Entry -> Atom
- Atom -> Lottie
- Lottie -> Echo
- Echo -> Digital Collectible
- Digital Collectible -> Next Activity
- Story Archive -> Story Flow execution
- Story Flow execution -> AR Event closure
- AR Event closure -> Echo
- Echo -> Digital Collectible
- Rights Center -> Campaign Closure
- Campaign Closure -> Next Activity

## Required Services

Present:
- `services/story/story-service.js`
- `services/ar/ar-service.js`
- `services/relic/relic-service.js`
- `services/rights/rights-service.js`

Missing as app-facing services:
- Atom service
- Lottie service
- Digital Collectible service
- Campaign closure service
- Next activity service

## Required APIs

Present:
- `getAllChapters`
- `getChapterById`
- `getNodesByChapterId`
- `getAllArEvents`
- `getArEventById`
- `getArEventByCode`
- `getAllRelics`
- `getRelicById`
- `getRelicsByChapterId`
- `getAssetBoundary`
- `getAllRights`
- `getRightById`
- `getRightsByType`

Missing for RC1 journey closure:
- Atom lookup API
- Lottie lookup API
- Digital Collectible lookup API
- Campaign closure / next-activity lookup API

## Release Blockers

P0:
- RC1 user journey is not end-to-end navigable.
- The required closure chain after AR Entry is not present in the UI.
- The required closure chain after Story Archive is not present in the UI.
- The required closure chain after Rights Center is not present in the UI.

P1:
- No app-facing services or APIs exist for Atom, Lottie, Digital Collectible, campaign closure, or next activity surfaces.
- The existing pages are data-display shells rather than journey surfaces.

P2:
- The repository already contains warning-only automation debt outside RC1.
- That debt is not the RC1 blocker, but it affects release posture.

## Recommended Fix Order

P0:
- Wire the RC1 closure chain in the miniapp UI.
- Add the missing journey surfaces or route transitions for Atom, Lottie, Echo, Digital Collectible, Campaign Closure, and Next Activity.

P1:
- Add app-facing services or route data for Atom, Lottie, Digital Collectible, and campaign closure surfaces if the UI needs live data binding.

P2:
- Reassess repo-wide warning-only automation after RC1 journey closure is complete.

## Conclusion

- RC1 is not fully release-ready as an end-to-end user journey.
- The repository is structurally ready, but the UI closure chain is incomplete.
- The missing journey links are the real blocker, not the underlying story or rights data.

RC1_GAP_CLOSURE_ANALYSIS_COMPLETE = YES

