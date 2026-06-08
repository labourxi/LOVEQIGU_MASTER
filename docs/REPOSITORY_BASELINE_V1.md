# REPOSITORY BASELINE V1

Date: 2026-06-08
Scope: `D:\LOVEQIGU_MASTER`

## Repository State

- Branch: `master`
- Worktree: dirty
- Git hygiene: not clean enough for a baseline freeze commit
- Current state includes intentional source changes, generated reports, archived prompts, backup trees, and temporary files

## Governance State

- `AGENTS.md` rules are in force
- Documentation remains the source of truth
- Canon remains frozen; no Canon files were edited in this freeze pass
- Governance logs exist and record prior automation decisions:
  - `governance/CHANGELOG.md`
  - `governance/AI_DECISION_LOG.md`
- Current governance posture:
  - MiniApp and service-layer work is consistent with the repo rules
  - Content Engine cursor audit remains report-only and warning-only

## OMX State

- Latest OMX result: `PASS`
- Checks run: `5`
- Passed: `5`
- Failed: `0`
- Violations: `0`
- Remaining warning: report-only Content Engine cursor audit warnings

## MiniApp State

- Requested pages are present and wired:
  - `pages/explore-map/index`
  - `pages/rights-center/index`
  - `pages/relic-archive/index`
  - `pages/story-archive/index`
  - `pages/ar-entry/index`
- Package size validation: `PASS`
- Final package size: `174,801` bytes
- The package is below the 2 MB target
- Route registration is intact in `apps/miniapp/app.json`
- MiniApp route/service binding is local to `apps/miniapp/services/*`
- The page set is functional, but some surfaces remain intentionally preview-only or read-only:
  - `AR Entry`
  - `Rights Center`
  - `Relic Archive`
  - `Story Archive`

## Data Model State

- Data model parsing: `PASS`
- Service getter validation: `PASS`
- Runtime counts observed:
  - Story chapters: `1`
  - Story nodes: `5`
  - Relics: `6`
  - Rights: `5`
  - AR events: `6`

Validated data files:
- `data/story/chapters.json`
- `data/relics/relics.json`
- `data/rights/rights.json`
- `data/ar/ar-events.json`

## Service Layer State

- MiniApp-local bridge services exist and are callable:
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
- Root-level service mirrors also exist in the workspace and are part of the current dirty state
- Service routing is valid for the current MiniApp paths

## Known Limitations

- `AR Entry` remains preview-only and does not implement a live AR runtime
- `Rights Center` remains read-only and does not expose checkout or redemption flows
- `Relic Archive` uses static MVP records
- `Story Archive` remains read-only
- The root worktree contains archived prompts, generated reports, and backups mixed with source changes
- `pages/relics/` still exists on disk as a legacy directory, but it is not part of the current registered MiniApp route set

## Open Warnings

- Git workspace hygiene is unresolved
- Content Engine cursor audit remains warning-only under report-only governance
- Some files under `docs/` and `scripts/omx/backups/` are generated or archival by design
- Root prompt deletions and archived prompt copies should be handled deliberately before any clean baseline commit

## Baseline Decision

`BASELINE_V1_READY = NO`

Reasoning:
- Workflow validation no longer fails on MiniApp, data model, or OMX terminology.
- However, the repository is still not in a clean baseline state because the worktree contains a large amount of mixed source, generated, backup, and temporary content.
- A true baseline freeze requires a deliberate split between commit-worthy source changes and archive/report artifacts.

