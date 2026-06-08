# LOVEQIGU Data Model Report

Date: 2026-06-07
Prompt: `prompts/build_data_model.md`

## Summary

Created the first shared data model layer for MiniApp, services, AR, and future operations. All data is placeholder-only and read-only. No Canon files, governance files, or MiniApp UI files were modified for this data model task.

## Files Created

Data:

- `data/story/chapters.json`
- `data/relics/relics.json`
- `data/rights/rights.json`
- `data/ar/ar-events.json`

Services:

- `services/story/story-service.js`
- `services/relic/relic-service.js`
- `services/rights/rights-service.js`
- `services/ar/ar-service.js`

Report:

- `docs/DATA_MODEL_REPORT.md`

## Schema Overview

`data/story/chapters.json`:

- `schema`
- `source`
- `chapters[]`
- `chapters[].nodes[]`
- references to `location_ref`, `ar_event_refs`, and `relic_refs`

`data/relics/relics.json`:

- `schema`
- `source`
- `asset_boundary`
- `relics[]`
- Relic records use `chapter_id`, `node_id`, `type`, `status`, and `progression_role`

`data/rights/rights.json`:

- `schema`
- `source`
- `layer`
- `rights[]`
- rights records use `type`, `status`, and `redemption`

`data/ar/ar-events.json`:

- `schema`
- `source`
- `events[]`
- AR records include `code`, `interaction`, `camera_enabled`, and `fake_ar_enabled`

## Service Overview

`story-service.js`:

- `getAllChapters()`
- `getChapterById(id)`
- `getNodesByChapterId(chapterId)`

`relic-service.js`:

- `getAllRelics()`
- `getRelicById(id)`
- `getRelicsByChapterId(chapterId)`
- `getAssetBoundary()`

`rights-service.js`:

- `getAllRights()`
- `getRightById(id)`
- `getRightsByType(type)`

`ar-service.js`:

- `getAllArEvents()`
- `getArEventById(id)`
- `getArEventByCode(code)`

## Validation

JSON parsing:

- `data/story/chapters.json`: passed
- `data/relics/relics.json`: passed
- `data/rights/rights.json`: passed
- `data/ar/ar-events.json`: passed

Service getter smoke test:

- chapters: 1
- nodes in `ch01_cloud_awakening`: 5
- relics in `ch01_cloud_awakening`: 3
- rights: 3
- AR lookup by `AR_GATE_OPEN_V1`: passed

OMX:

```powershell
node scripts\omx\run_omx_checks.js
```

- Checks run: 4
- Passed: 4
- Failed: 0
- Violations: 0

## Unresolved Gaps

- Chapter node content remains placeholder-only because full approved L2 runtime data is not present.
- Relic persistence is not implemented; services only read static JSON.
- Rights redemption, payment, order, and核销 integrations are not implemented.
- AR events are placeholders only; no camera or real AR runtime is implemented.
- Future operations schemas may need IDs, timestamps, user ownership, audit fields, and localization after API/database requirements are approved.
