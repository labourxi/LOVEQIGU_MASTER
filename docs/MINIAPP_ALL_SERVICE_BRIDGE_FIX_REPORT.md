# MINIAPP All Service Bridge Fix Report

Generated: 2026-06-07T22:20:53.2630901+08:00

## Fixed Pages

- `apps/miniapp/pages/explore-map/index.js`
- `apps/miniapp/pages/ar-entry/index.js`
- `apps/miniapp/pages/atom/index.js`
- `apps/miniapp/pages/lottie/index.js`
- `apps/miniapp/pages/echo/index.js`
- `apps/miniapp/pages/digital-collectible/index.js`
- `apps/miniapp/pages/next-activity/index.js`
- `apps/miniapp/pages/story-archive/index.js`
- `apps/miniapp/pages/story-flow/index.js`
- `apps/miniapp/pages/rights-center/index.js`
- `apps/miniapp/pages/campaign-closure/index.js`
- `apps/miniapp/pages/relic-archive/index.js`

## Fixed Services

- `apps/miniapp/services/story/story-service.js`
- `apps/miniapp/services/story/story-flow-service.js`
- `apps/miniapp/services/ar/ar-service.js`
- `apps/miniapp/services/atom/atom-service.js`
- `apps/miniapp/services/lottie/lottie-service.js`
- `apps/miniapp/services/echo/echo-service.js`
- `apps/miniapp/services/digital-collectible/digital-collectible-service.js`
- `apps/miniapp/services/campaign/campaign-service.js`
- `apps/miniapp/services/next-activity/next-activity-service.js`
- `apps/miniapp/services/rights/rights-service.js`
- `apps/miniapp/services/relic/relic-service.js`

## Deleted External Require Paths

- `../../../../services/story/story-service`
- `../../../../services/story/story-flow-service`
- `../../../../services/ar/ar-service`
- `../../../../services/atom/atom-service`
- `../../../../services/lottie/lottie-service`
- `../../../../services/echo/echo-service`
- `../../../../services/digital-collectible/digital-collectible-service`
- `../../../../services/campaign/campaign-service`
- `../../../../services/next-activity/next-activity-service`
- `../../../../services/rights/rights-service`
- `../../../../services/relic/relic-service`

## New Local Bridge Services

- The miniapp now resolves all required page data through `apps/miniapp/services/*`.
- The local services expose the RC1-facing functions needed by the pages:
  - `getAllChapters`
  - `getNodesByChapterId`
  - `getAllStoryFlows`
  - `getStoryFlowById`
  - `getAllArEvents`
  - `getArEventById`
  - `getArEventByCode`
  - `getAllAtoms`
  - `getAllLotties`
  - `getAllEchoes`
  - `getAllDigitalCollectibles`
  - `getAllCampaigns`
  - `getAllNextActivities`
  - `getAllRights`
  - `getAllRelics`
  - `getAssetBoundary`

## Verification

- `node --check` passed for all JavaScript files under `apps/miniapp`.
- Runtime load check with stubbed `Page` and `wx` globals returned `OK`.
- No `../../../../services/` or `../../../services/` requires remain inside `apps/miniapp`.

## Project Owner Checkpoint

- The miniapp pages now load through local bridge services only.
- The RC1 entry pages no longer depend on repository-root service modules.

`MINIAPP_ALL_SERVICE_BRIDGE_FIX_COMPLETE = YES`
