# LOVEQIGU Core MVP Build Report

Date: 2026-06-07
Prompt: `prompts/build_core_mvp.md`

## Summary

Built the first MiniApp Core MVP page set for:

- `pages/explore-map/index`
- `pages/rights-center/index`
- `pages/relic-archive/index`
- `pages/story-archive/index`
- `pages/ar-entry/index`

The implementation uses placeholder content only where full data is not available. Canon files and governance files were not modified.

## Files Created

- `apps/miniapp/pages/relic-archive/index.js`
- `apps/miniapp/pages/relic-archive/index.json`
- `apps/miniapp/pages/relic-archive/index.wxml`
- `apps/miniapp/pages/relic-archive/index.wxss`
- `docs/MVP_BUILD_REPORT.md`

## Files Modified

- `apps/miniapp/app.json`
- `apps/miniapp/project.config.json`
- `apps/miniapp/pages/index/index.js`
- `apps/miniapp/pages/explore-map/index.js`
- `apps/miniapp/pages/explore-map/index.wxml`
- `apps/miniapp/pages/explore-map/index.wxss`
- `apps/miniapp/pages/rights-center/index.js`
- `apps/miniapp/pages/rights-center/index.wxml`
- `apps/miniapp/pages/rights-center/index.wxss`
- `apps/miniapp/pages/story-archive/index.js`
- `apps/miniapp/pages/story-archive/index.wxml`
- `apps/miniapp/pages/story-archive/index.wxss`
- `apps/miniapp/pages/ar-entry/index.js`
- `apps/miniapp/pages/ar-entry/index.wxml`
- `apps/miniapp/pages/ar-entry/index.wxss`
- `docs/OMX_REPORT.md`

## Route Changes

- Added `pages/relic-archive/index` to `apps/miniapp/app.json`.
- Removed `pages/relics/index` from the registered route list for the MVP route set.
- Updated the homepage entry for `信物档案` to navigate to `/pages/relic-archive/index`.
- Added a WeChat compile condition for `pages/relic-archive/index` in `project.config.json`.

## MVP Coverage

Explore Map:

- Shows exploration regions.
- Shows discovered locations.
- Shows personal exploration progress.
- Contains no ranking or level display.

Rights Center:

- Uses commercial-layer copy only.
- Shows benefits and redemption placeholders.
- Avoids ritual/worldview language.

Relic Archive:

- Shows Relic records as story progression assets.
- Separates Relic records from user-generated传播资产.
- Does not describe Relic as a marketing asset.

Story Archive:

- Uses timeline style.
- Uses chapter style.
- Uses archive/read-only style.

AR Entry:

- Provides `AR_GATE_OPEN_V1` entry.
- Provides `AR_IMPRINT_PARTICLES_V1` entry.
- Uses placeholder interaction only.
- Does not implement fake AR.

## OMX Result

Command:

```powershell
node scripts\omx\run_omx_checks.js
```

Result:

- Checks run: 4
- Passed: 4
- Failed: 0
- Violations: 0

## Unresolved Gaps

- Full chapter L2 data for `云门初醒` nodes is not present in runtime data files.
- Real AR capability and camera integration are intentionally not implemented.
- Redemption, order, payment, and核销 APIs are not implemented.
- Relic persistence is represented by static MVP records only.
- Story Archive future chapters remain placeholders to avoid filling Canon gaps.
