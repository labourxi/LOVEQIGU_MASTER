# MINIAPP Fix Module Require Path Report

Generated: 2026-06-07T17:15:00+08:00

## Fix Applied

- Updated `apps/miniapp/pages/explore-map/index.js` to require the story service from the miniapp-local bridge path:
  - `../../../services/story/story-service`
- Added `apps/miniapp/services/story/story-service.js` as a bridge module to the repo-root story service.

## Validation

- `node --check apps/miniapp/pages/explore-map/index.js` passed.
- `node --check apps/miniapp/services/story/story-service.js` passed.
- Runtime require check returned `OK` for `getAllChapters()`.

## Render Coverage

- Page title: present
- Exploration area: present
- Discovered nodes: present
- AR preview button: present

## Scope Notes

- No Canon, World Bible, or terminology files were changed.
- No existing page was removed.
- No existing asset was deleted.

`MINIAPP_FIX_MODULE_REQUIRE_PATH_COMPLETE = YES`
