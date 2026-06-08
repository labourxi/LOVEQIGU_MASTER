# GIT HYGIENE AUDIT

Scope:
- repository worktree hygiene
- modified, deleted, and untracked file inventory

## Overall Status

`FAIL`

The repository cannot yet safely proceed to a clean commit because the worktree still contains a large set of intentional source changes, generated artifacts, backup trees, and temporary prompt files. The terminology issue has been fixed, but hygiene remains unresolved.

## Inputs Reviewed

- [docs/WORKFLOW_VALIDATION_REPORT.md](WORKFLOW_VALIDATION_REPORT.md)
- [docs/TERMINOLOGY_FIX_REPORT.md](TERMINOLOGY_FIX_REPORT.md)
- `git status --short`
- `git diff --name-status`
- `git ls-files --deleted`
- `git ls-files --others --exclude-standard`

## Modified Files

Classification: `KEEP_CHANGE`

- `apps/miniapp/app.json`
- `apps/miniapp/pages/ar-entry/index.js`
- `apps/miniapp/pages/ar-entry/index.wxml`
- `apps/miniapp/pages/ar-entry/index.wxss`
- `apps/miniapp/pages/explore-map/index.js`
- `apps/miniapp/pages/explore-map/index.wxml`
- `apps/miniapp/pages/explore-map/index.wxss`
- `apps/miniapp/pages/index/index.js`
- `apps/miniapp/pages/index/index.wxml`
- `apps/miniapp/pages/index/index.wxss`
- `apps/miniapp/pages/relics/index.js`
- `apps/miniapp/pages/relics/index.wxml`
- `apps/miniapp/pages/relics/index.wxss`
- `apps/miniapp/pages/rights-center/index.js`
- `apps/miniapp/pages/rights-center/index.json`
- `apps/miniapp/pages/rights-center/index.wxml`
- `apps/miniapp/pages/rights-center/index.wxss`
- `apps/miniapp/project.config.json`

Recommendation:
- Keep these as intentional source/config changes.

Reasoning:
- These are direct MiniApp runtime and configuration edits needed for the current implementation state.

## Deleted Files

Classification: `KEEP_DELETED`

- `apps/miniapp/assets/images/home-hero.png`
- `prompts/P1_MINIAPP_START.md`
- `prompts/git_init.md`
- `prompts/governance_init.md`
- `prompts/knowledge_check.md`
- `prompts/update_docs_terminology.md`

Recommendation:
- Keep deleted unless you intentionally roll back the asset replacement or restore the old prompt entrypoints.

Reasoning:
- `home-hero.png` was replaced by the compressed JPEG asset and the package-size report confirms the smaller asset is in use.
- The prompt files are already archived under `prompts/old/`, so the root copies are superseded.

## Untracked Files

### KEEP_CHANGE

These are intentional source trees or data assets that belong in the repository state:

- `AR_ENGINE_V2/`
- `CONTENT_ENGINE/`
- `LIVE_OPS_ENGINE/`
- `STORY_ENGINE/`
- `apps/miniapp/assets/images/home-hero.jpg`
- `apps/miniapp/pages/atom/`
- `apps/miniapp/pages/campaign-closure/`
- `apps/miniapp/pages/digital-collectible/`
- `apps/miniapp/pages/echo/`
- `apps/miniapp/pages/lottie/`
- `apps/miniapp/pages/next-activity/`
- `apps/miniapp/pages/relic-archive/`
- `apps/miniapp/pages/story-archive/`
- `apps/miniapp/pages/story-flow/`
- `apps/miniapp/services/`
- `data/`
- `governance/content_engine_cursor_workflow.yaml`
- `governance/content_engine_rules.yaml`
- `ductor/workflows/ar_story_engine_pipeline.yaml`
- `ductor/workflows/content_engine_cursor_audit.md`
- `ductor/workflows/content_engine_pipeline.yaml`
- `ductor/workflows/live_ops_engine_pipeline.yaml`
- `ductor/workflows/rc1_gap_closure_pipeline.yaml`
- `services/ar/ar-service.js`
- `services/atom/`
- `services/campaign/`
- `services/digital-collectible/`
- `services/echo/`
- `services/lottie/`
- `services/next-activity/`
- `services/relic/relic-service.js`
- `services/rights/rights-service.js`
- `services/story/story-flow-service.js`
- `services/story/story-service.js`

Recommendation:
- Keep as project source and data deliverables.

Reasoning:
- These are the active implementation trees for MiniApp, services, data models, and workflow definitions.

### GENERATED_FILE

These are generated reports or generated content deliverables:

- `docs/AR_ENGINE_V2_REPORT.md`
- `docs/AR_STORY_ENGINE_FOUNDATION_REPORT.md`
- `docs/AR_STORY_ENGINE_PIPELINE_REPORT.md`
- `docs/AR_STORY_ENGINE_REVIEW_REPORT.md`
- `docs/AR_STORY_ENGINE_SIMULATION_REPORT.md`
- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json`
- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md`
- `docs/CONTENT_ENGINE_GOVERNANCE_REPORT.md`
- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`
- `docs/CONTENT_ENGINE_PIPELINE_REPORT.md`
- `docs/CONTENT_ENGINE_V3_CURSOR_AUDIT_REPORT.md`
- `docs/CONTENT_ENGINE_V3_GOVERNANCE_REPORT.md`
- `docs/DATA_MODEL_REPORT.md`
- `docs/DIGITAL_COLLECTIBLE_EXPANSION_CURSOR_AUDIT_REPORT.md`
- `docs/DIGITAL_COLLECTIBLE_EXPANSION_GOVERNANCE_REPORT.md`
- `docs/DUCTOR_GOVERNANCE_V2_FIX_REPORT.md`
- `docs/DUCTOR_PIPELINE_DESIGN.md`
- `docs/GOVERNANCE_117_ANALYSIS.md`
- `docs/LEGACY_AUTO_FIX_REPORT.md`
- `docs/LEGACY_CLEANUP_INVENTORY.md`
- `docs/LEGACY_WARNING_INVESTIGATION_REPORT.md`
- `docs/LIVE_OPS_ENGINE_FINAL_REVIEW_REPORT.md`
- `docs/LIVE_OPS_ENGINE_FOUNDATION_REPORT.md`
- `docs/LIVE_OPS_ENGINE_PIPELINE_REPORT.md`
- `docs/LIVE_OPS_ENGINE_REVIEW_REPORT.md`
- `docs/LIVE_OPS_ENGINE_SIMULATION_REPORT.md`
- `docs/LOTTIE_LIBRARY_CURSOR_AUDIT_REPORT.md`
- `docs/LOTTIE_LIBRARY_GOVERNANCE_REPORT.md`
- `docs/LOVEQIGU_BASELINE_V1.md`
- `docs/LOVEQIGU_BASELINE_V1_REPORT.md`
- `docs/LOVEQIGU_PROJECT_RELEASE_READINESS_REPORT.md`
- `docs/LOVEQIGU_RC1_BASELINE.md`
- `docs/LOVEQIGU_RC1_BASELINE_REPORT.md`
- `docs/MINIAPP_ALL_SERVICE_BRIDGE_FIX_REPORT.md`
- `docs/MINIAPP_AR_ENTRY_MODULE_FIX_REPORT.md`
- `docs/MINIAPP_BIND_REPORT.md`
- `docs/MINIAPP_EMPTY_PAGE_FIX_REPORT.md`
- `docs/MINIAPP_EXPLORE_MAP_MODULE_FIX_REPORT.md`
- `docs/MINIAPP_FIX_MODULE_REQUIRE_PATH_REPORT.md`
- `docs/MINIAPP_PATH_C_BRIDGE_FIX_REPORT.md`
- `docs/MINIAPP_REQUIRE_PATH_AUDIT_REPORT.md`
- `docs/MINIAPP_SIZE_REPORT.md`
- `docs/MINIAPP_STORY_SERVICE_BRIDGE_FIX_REPORT.md`
- `docs/MISSION_002_FINAL_REVIEW.md`
- `docs/MVP_ACCEPTANCE_REPORT.md`
- `docs/MVP_BUILD_REPORT.md`
- `docs/OMX_REPORT.md`
- `docs/RC1_FINAL_USER_JOURNEY_VALIDATION_REPORT.md`
- `docs/RC1_GAP_CLOSURE_ANALYSIS.md`
- `docs/RC1_GAP_CLOSURE_IMPLEMENTATION_REPORT.md`
- `docs/RC1_USER_JOURNEY_AUDIT_REPORT.md`
- `docs/RC2_ACCEPTANCE_AUDIT_REPORT.md`
- `docs/RC2_BASELINE_ARCHIVE_REPORT.md`
- `docs/RC2_BASELINE_INDEX.md`
- `docs/RC2_BASELINE_RECORD.md`
- `docs/RC2_FREEZE_BASELINE.md`
- `docs/RC2_FREEZE_CHANGELOG.md`
- `docs/RC2_FREEZE_RELEASE_READINESS.md`
- `docs/RC2_FREEZE_RISKS.md`
- `docs/RC2_FREEZE_SUMMARY.md`
- `docs/RC2_NEXT_PHASE_RECOMMENDATION.md`
- `docs/SYNC_REPORT.md`
- `docs/TERMINOLOGY_FIX_REPORT.md`
- `docs/V3_ACCEPTANCE_REPORT.md`
- `docs/WORKFLOW_VALIDATION_REPORT.md`
- `docs/beiwang/LOVEQIGU_AUTOMATION_STRATEGY_MEMO.md`
- `docs/beiwang/LOVEQIGU_CURSOR_AUDIT_MEMO.md`
- `docs/content/LOVEQIGU_CONTENT_CANON_V1.md`
- `ductor/logs/ductor_bootstrap_report.md`
- `ductor/logs/ductor_live_report.md`
- `scripts/cursor/run_content_audit.js`
- `scripts/ductor/run_ar_story_engine_pipeline.js`
- `scripts/ductor/run_content_engine_pipeline.js`
- `scripts/ductor/run_live_ops_engine_pipeline.js`
- `scripts/ductor/run_rc1_gap_closure_pipeline.js`
- `scripts/governance/check_content_engine.js`
- `scripts/governance/check_content_engine_v1.js.bak`
- `scripts/omx/backups/index.index.js.bak`
- `scripts/omx/backups/miniapp-pages/app.json.bak`
- `scripts/omx/backups/miniapp-pages/ar-entry/index.js`
- `scripts/omx/backups/miniapp-pages/ar-entry/index.json`
- `scripts/omx/backups/miniapp-pages/ar-entry/index.wxml`
- `scripts/omx/backups/miniapp-pages/ar-entry/index.wxss`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/ar-entry/index.js`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/ar-entry/index.json`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/ar-entry/index.wxml`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/ar-entry/index.wxss`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/explore-map/index.js`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/explore-map/index.json`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/explore-map/index.wxml`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/explore-map/index.wxss`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/relic-archive/index.js`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/relic-archive/index.json`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/relic-archive/index.wxml`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/relic-archive/index.wxss`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/rights-center/index.js`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/rights-center/index.json`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/rights-center/index.wxml`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/rights-center/index.wxss`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/story-archive/index.js`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/story-archive/index.json`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/story-archive/index.wxml`
- `scripts/omx/backups/miniapp-pages/bind-data-model-20260607/story-archive/index.wxss`
- `scripts/omx/backups/miniapp-pages/explore-map/index.js`
- `scripts/omx/backups/miniapp-pages/explore-map/index.json`
- `scripts/omx/backups/miniapp-pages/explore-map/index.wxml`
- `scripts/omx/backups/miniapp-pages/explore-map/index.wxss`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/app.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/ar-entry/index.js`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/ar-entry/index.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/ar-entry/index.wxml`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/ar-entry/index.wxss`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/explore-map/index.js`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/explore-map/index.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/explore-map/index.wxml`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/explore-map/index.wxss`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/project.config.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/relic-archive/index.js`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/relic-archive/index.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/relic-archive/index.wxml`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/relic-archive/index.wxss`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/rights-center/index.js`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/rights-center/index.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/rights-center/index.wxml`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/rights-center/index.wxss`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/story-archive/index.js`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/story-archive/index.json`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/story-archive/index.wxml`
- `scripts/omx/backups/miniapp-pages/generate-miniapp-pages-20260608/story-archive/index.wxss`
- `scripts/omx/backups/miniapp-pages/index/index.js`
- `scripts/omx/backups/miniapp-pages/index/index.json`
- `scripts/omx/backups/miniapp-pages/index/index.wxml`
- `scripts/omx/backups/miniapp-pages/index/index.wxss`
- `scripts/omx/backups/miniapp-pages/project.config.json.bak`
- `scripts/omx/backups/miniapp-pages/relics/index.js`
- `scripts/omx/backups/miniapp-pages/relics/index.json`
- `scripts/omx/backups/miniapp-pages/relics/index.wxml`
- `scripts/omx/backups/miniapp-pages/relics/index.wxss`
- `scripts/omx/backups/miniapp-pages/rights-center/index.js`
- `scripts/omx/backups/miniapp-pages/rights-center/index.json`
- `scripts/omx/backups/miniapp-pages/rights-center/index.wxml`
- `scripts/omx/backups/miniapp-pages/rights-center/index.wxss`
- `scripts/omx/backups/rights-center.index.json.bak`
- `scripts/omx/backups/rights-center.index.wxml.bak`
- `scripts/omx/check-canon.js`
- `scripts/omx/check-content-engine-cursor.js`
- `scripts/omx/check-json.js`
- `scripts/omx/check-routes.js`
- `scripts/omx/check-terminology.js`
- `scripts/omx/omx-utils.js`
- `scripts/omx/run_omx_checks.js`
- `prompts/git_hygiene_audit.md`
- `prompts/old/AR_ENGINE_V2_EXPANSION.prompt.md`
- `prompts/old/AR_STORY_ENGINE_FOUNDATION.prompt.md`
- `prompts/old/AR_STORY_ENGINE_PIPELINE.prompt.md`
- `prompts/old/AR_STORY_ENGINE_REVIEW.prompt.md`
- `prompts/old/AR_STORY_ENGINE_SIMULATION.prompt.md`
- `prompts/old/CODEX_ENV_CHECK.prompt.md`
- `prompts/old/CONTENT_ENGINE_AUDIT.prompt.md`
- `prompts/old/CONTENT_ENGINE_CURSOR_WORKFLOW.prompt.md`
- `prompts/old/CONTENT_ENGINE_GOVERNANCE_APPLY.prompt.md`
- `prompts/old/CONTENT_ENGINE_GOVERNANCE_AUDIT_117.prompt.md`
- `prompts/old/CONTENT_ENGINE_GOVERNANCE_V2.prompt.md`
- `prompts/old/CONTENT_ENGINE_V1_BUILD.prompt.md`
- `prompts/old/CONTENT_ENGINE_V2_PROMPT.prompt.md`
- `prompts/old/CONTENT_ENGINE_V3_BATCH_GENERATION.prompt.md`
- `prompts/old/CURSOR_FINAL_REVIEW.prompt.md`
- `prompts/old/DIGITAL_COLLECTIBLE_EXPANSION.prompt.md`
- `prompts/old/DUCTOR_CONTENT_ENGINE_PIPELINE.prompt.md`
- `prompts/old/DUCTOR_GOVERNANCE_V2_COMPATIBILITY_FIX.prompt.md`
- `prompts/old/EXPLORE_MAP_FIX_PATH.prompt.md`
- `prompts/old/LEGACY_AUTO_FIX.prompt.md`
- `prompts/old/LEGACY_CLEANUP_INVENTORY.prompt.md`
- `prompts/old/LEGACY_WARNING_INVESTIGATION.prompt.md`
- `prompts/old/LIVE_OPS_ENGINE_FINAL_REVIEW.prompt.md`
- `prompts/old/LIVE_OPS_ENGINE_FOUNDATION.prompt.md`
- `prompts/old/LIVE_OPS_ENGINE_PIPELINE.prompt.md`
- `prompts/old/LIVE_OPS_ENGINE_REVIEW.prompt.md`
- `prompts/old/LIVE_OPS_ENGINE_SIMULATION.prompt.md`
- `prompts/old/LOTTIE_LIBRARY_EXPANSION.prompt.md`
- `prompts/old/LOVEQIGU_PROJECT_BASELINE_V1.prompt.md`
- `prompts/old/LOVEQIGU_PROJECT_RELEASE_READINESS_V1.prompt.md`
- `prompts/old/MINIAPP_ALL_SERVICE_BRIDGE_FIX.prompt.md`
- `prompts/old/MINIAPP_AR_ENTRY_MODULE_FIX.prompt.md`
- `prompts/old/MINIAPP_EMPTY_PAGE_FIX.prompt.md`
- `prompts/old/MINIAPP_EXPLORE_MAP_MODULE_FIX.prompt.md`
- `prompts/old/MINIAPP_FIX_MODULE_REQUIRE_PATH.prompt.md`
- `prompts/old/MINIAPP_PATH_C_BRIDGE_FIX.prompt.md`
- `prompts/old/MINIAPP_REQUIRE_PATH_AUDIT.prompt.md`
- `prompts/old/MINIAPP_STORY_SERVICE_BRIDGE_FIX.prompt.md`
- `prompts/old/MISSION_002_FINAL_REVIEW.prompt.md`
- `prompts/old/P1_MINIAPP_START.md`
- `prompts/old/RC1_BASELINE_FREEZE.prompt.md`
- `prompts/old/RC1_FINAL_USER_JOURNEY_VALIDATION.prompt.md`
- `prompts/old/RC1_GAP_CLOSURE_ANALYSIS.prompt.md`
- `prompts/old/RC1_GAP_CLOSURE_IMPLEMENTATION.prompt.md`
- `prompts/old/RC1_USER_JOURNEY_AUDIT.prompt.md`
- `prompts/old/RC2_ACCEPTANCE_AUDIT.prompt.md`
- `prompts/old/RC2_ACCEPTANCE_FREEZE.prompt.md`
- `prompts/old/RC2_BASELINE_TAG_AND_ARCHIVE.prompt.md`
- `prompts/old/V3_ACCEPTANCE_REVIEW.prompt.md`
- `prompts/old/bind_miniapp_to_data_model.md`
- `prompts/old/build_core_mvp.md`
- `prompts/old/build_data_model.md`
- `prompts/old/ductor_live_init.md`
- `prompts/old/fix_terminology.md`
- `prompts/old/generate_miniapp_pages.md`
- `prompts/old/git_init.md`
- `prompts/old/governance_init.md`
- `prompts/old/knowledge_check.md`
- `prompts/old/miniapp_package_size_reduction.md`
- `prompts/old/mvp_acceptance_audit.md`
- `prompts/old/omx_bootstrap.md`
- `prompts/old/update_docs_terminology.md`
- `prompts/old/workflow_validation.md`

Recommendation:
- Keep if these are intended generated deliverables or archived prompt copies.

Reasoning:
- These trees are mostly generated content, archived prompts, or workflow artifacts, not runtime source files.

### TEMP_FILE

These are working files that should not be part of a normal commit:

- `ductor/logs/`
- `prompts/terminology_fix_and_git_cleanup.md`

Recommendation:
- Remove or archive outside the commit set.

Reasoning:
- `ductor/logs/` contains runtime audit logs.
- `prompts/terminology_fix_and_git_cleanup.md` is the active task prompt copy, not a project artifact.

## Special Attention Items

- `apps/miniapp/assets/images/home-hero.png` is `KEEP_DELETED`.
- `prompts/*` root prompt files are `KEEP_DELETED`; archived copies live under `prompts/old/`.
- `docs/*` validation and audit outputs are `GENERATED_FILE`.
- `governance/*` YAML rules are `KEEP_CHANGE` or `GENERATED_FILE` depending on whether they are source config or generated workflow output; they are currently intentional repository additions.
- `scripts/omx/backups/*` are `BACKUP_FILE` / archived state and should not be staged with runtime source changes unless you are explicitly preserving a snapshot.

## Final Assessment

Can the repository safely proceed to a clean commit?

**No.**

Reasons:
- The worktree still contains numerous intentional but uncommitted source additions.
- Backup trees and generated reports are mixed into the same worktree.
- Temporary prompt and log files remain present.
- The deleted root prompt files and original PNG asset should remain deleted, but the workspace is not clean enough to commit without a deliberate staging plan.

Recommended next step:
- Separate source changes, generated reports, backups, and temp artifacts into distinct commits or stash/archive the non-source items before attempting a clean commit.

`GIT_HYGIENE_AUDIT_COMPLETE = YES`
