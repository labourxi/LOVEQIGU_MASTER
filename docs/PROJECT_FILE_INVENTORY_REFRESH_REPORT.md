# PROJECT_FILE_INVENTORY_REFRESH_REPORT

Generated: 2026-06-11

## 1. New Files

Current working tree delta against the last inventory baseline shows 253 untracked files.

Top-level additions by root:

- `docs/`: 150 new files
- `data/`: 36 new files
- `apps/`: 30 new files
- `prompts/`: 23 new files
- `scripts/`: 7 new files
- `automation/`: 1 new file
- `autopilot/`: 1 new file
- `ductor/`: 1 new file
- `product/`: 1 new file
- `sandbox/`: 1 new file
- `services/`: 1 new file

Representative new files:

- `scripts/governance/project_context_preflight.py`
- `docs/PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md`
- `docs/PROJECT_CONTEXT_ROUTER_V1.md`
- `docs/PROJECT_CONTEXT_MEMORY_V1.md`
- `docs/PROJECT_CONTEXT_REGISTRY_V1.md`
- `apps/miniapp/assets/star-ritual/asset-manifest.json`
- `apps/miniapp/components/star-activation-ritual/index.js`
- `apps/miniapp/services/star-ritual-service.js`
- `apps/miniapp/pages/heaven-human-unity/index.js`
- `apps/miniapp/pages/meridian-map/index.js`
- `apps/miniapp/pages/reward-center/index.js`
- `apps/miniapp/pages/scenic-detail/index.js`
- `apps/miniapp/pages/scenic-list/index.js`
- `apps/miniapp/pages/seals/index.js`
- `apps/miniapp/pages/star-map/index.js`
- `apps/miniapp/pages/synthesis/index.js`
- `data/story/ch02_chapters.json` through `data/story/ch10_chapters.json`
- `data/relics/ch02_relics.json` through `data/relics/ch10_relics.json`
- `data/rights/ch02_rights.json` through `data/rights/ch10_rights.json`
- `data/ar/ch02_ar-events.json` through `data/ar/ch10_ar-events.json`
- `prompts/PROJECT_FILE_INVENTORY_REFRESH_V1.md`
- archived prompt copies under `prompts/old/`

## 2. Deleted Files

Git reports 5 deletions:

- `apps/miniapp/pages/relics/index.js`
- `apps/miniapp/pages/relics/index.json`
- `apps/miniapp/pages/relics/index.wxml`
- `apps/miniapp/pages/relics/index.wxss`
- `prompts/baseline_commit_v1.md`

## 3. Renamed Files

No rename was emitted by `git diff --find-renames`.

The current tree does contain rename-like history in the prompt archive set, but it is represented as delete/add pairs rather than a detected rename:

- root prompt files moved into `prompts/old/`

## 4. Moved Files

Move-like changes inferred from path changes:

- `prompts/*.md` archived under `prompts/old/`
- `apps/miniapp/pages/relics/*` retired in favor of the existing `apps/miniapp/pages/relic-archive/*` route set

These are semantically moved, but not recorded as git rename metadata in the current diff.

## 5. Registry Impact

Positive updates:

- `docs/PROJECT_CONTEXT_ROUTER_V1.md` now exists and should be treated as part of the active coordination layer.
- `docs/PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md` and `scripts/governance/project_context_preflight.py` add a new project-level preflight execution path.

Baseline impact:

- The earlier inventory baseline still marks `docs/PROJECT_CONTEXT_ROUTER_V1.md` as missing. That entry is now stale.
- The registry should be refreshed to include the preflight executor and report if they are intended to remain part of the coordination layer.

## 6. Memory Impact

- No Canon or World Bible changes were introduced by this refresh task.
- The terminology alias situation remains unchanged in practice: `docs/language/LOVEQIGU_TERMINOLOGY_V1.md` is still the authoritative source.
- If the coordination memory is maintained as a live index, it should be extended to recognize the new preflight executor and report.

## 7. Router Impact

- Router coverage is now materially better because `docs/PROJECT_CONTEXT_ROUTER_V1.md` is present and executable in the coordination flow.
- The router can now be used to resolve owner / approver / next owner for the documented example tasks.
- The missing-router blocker in the old inventory is resolved.

## 8. Dependency Changes

New or expanded dependency clusters:

- `scripts/governance/project_context_preflight.py` depends on:
  - `docs/PROJECT_CONTEXT_REGISTRY_V1.md`
  - `docs/PROJECT_CONTEXT_MEMORY_V1.md`
  - `docs/PROJECT_CONTEXT_ROUTER_V1.md`
- The ART-02 subtree depends on:
  - `docs/ART_BIBLE_V1.md`
  - `docs/STAR_ACTIVATION_RITUAL_V1.md`
  - `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
  - `docs/ART-02_TECH_FEASIBILITY_REVIEW_V1.md`
- The miniapp route/service expansion introduces additional local-service dependencies across:
  - `apps/miniapp/pages/*`
  - `apps/miniapp/services/*`
- The chapter data expansion adds new shard dependencies for `data/story/`, `data/relics/`, `data/rights/`, and `data/ar/`.

## 9. Freeze Changes

New frozen-candidate material:

- `apps/miniapp/assets/star-ritual/`
- `apps/miniapp/components/star-activation-ritual/`
- `apps/miniapp/services/star-ritual-service.js`
- `docs/ART_02_IMPLEMENTATION_V1_REPORT.md`
- `docs/PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md`

Modified frozen-report candidates from the current git diff:

- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json`
- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md`
- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`

These should be treated as read-only unless a follow-up task explicitly updates the frozen coordination contract.

## 10. Recommended Actions

1. Refresh the inventory and classification baselines to reflect the new router and preflight layer.
2. Decide whether the prompt archive under `prompts/old/` is an intentional move or should be excluded from the project baseline.
3. Confirm whether the modified CONTENT_ENGINE frozen reports are intentional; if not, revert or regenerate them through the proper governance task.
4. Register the new preflight executor/report in the coordination registry if they are now part of the stable project workflow.
5. Keep `docs/language/LOVEQIGU_TERMINOLOGY_V1.md` as the authoritative terminology file until a separate final terminology doc exists.

`PROJECT_FILE_INVENTORY_REFRESH_COMPLETE = YES`
