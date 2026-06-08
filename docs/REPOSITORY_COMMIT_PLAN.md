# REPOSITORY COMMIT PLAN

Date: 2026-06-08
Scope: current dirty worktree

## COMMIT_A_SOURCE

Source and runtime changes that belong together as implementation work:

- `apps/miniapp/app.json`
- `apps/miniapp/assets/images/home-hero.jpg`
- `apps/miniapp/assets/images/home-hero.png` deletion
- `apps/miniapp/pages/**`
- `apps/miniapp/services/**`
- `data/**`
- `AR_ENGINE_V2/**`
- `CONTENT_ENGINE/**`
- `LIVE_OPS_ENGINE/**`
- `STORY_ENGINE/**`
- `services/**`

Recommendation:
- Group these as the main product/runtime/source commit.
- Keep the MiniApp route, service, and data-model changes together so the app state stays coherent.

## COMMIT_B_GOVERNANCE

Governance and automation support files:

- `governance/content_engine_cursor_workflow.yaml`
- `governance/content_engine_rules.yaml`
- `governance/CHANGELOG.md`
- `governance/AI_DECISION_LOG.md`
- `scripts/cursor/run_content_audit.js`
- `scripts/governance/check_content_engine.js`
- `scripts/governance/check_content_engine_v1.js.bak`
- `scripts/omx/check-canon.js`
- `scripts/omx/check-content-engine-cursor.js`
- `scripts/omx/check-json.js`
- `scripts/omx/check-routes.js`
- `scripts/omx/check-terminology.js`
- `scripts/omx/omx-utils.js`
- `scripts/omx/run_omx_checks.js`
- `scripts/ductor/*.js`
- `ductor/workflows/*.yaml`

Recommendation:
- Keep governance and automation separate from source/runtime code if you want cleaner review and rollback boundaries.

## COMMIT_C_REPORTS

Generated reports and audit outputs:

- `docs/*.md`
- `docs/*.json`
- `docs/content/*.md`
- `docs/beiwang/*.md`
- `ductor/logs/*.md`

Representative report set:
- `docs/WORKFLOW_VALIDATION_REPORT.md`
- `docs/GIT_HYGIENE_AUDIT.md`
- `docs/TERMINOLOGY_FIX_REPORT.md`
- `docs/REPOSITORY_BASELINE_V1.md`
- `docs/REPOSITORY_COMMIT_PLAN.md`

Recommendation:
- Commit these separately from runtime source when you want a clean provenance trail.

## ARCHIVE_ONLY

Files and trees that should be preserved as archive/snapshot material, not treated as live source:

- `prompts/old/**`
- `scripts/omx/backups/**`

Recommendation:
- Keep these out of the main source commit unless you are intentionally recording a snapshot.

Reasoning:
- They are historical snapshots, prompt archives, or backup copies of prior states.

## DO_NOT_COMMIT

Files that should not be part of a normal repository commit:

- `prompts/terminology_fix_and_git_cleanup.md`
- `ductor/logs/`

Recommendation:
- Exclude these from any baseline commit.

Reasoning:
- `prompts/terminology_fix_and_git_cleanup.md` is the active task prompt copy.
- `ductor/logs/` are runtime-generated logs.

## Notes on Deleted Tracked Files

The following tracked deletions are intentional and should remain deleted in the source commit plan unless you explicitly roll back the related work:

- `apps/miniapp/assets/images/home-hero.png`
- `prompts/P1_MINIAPP_START.md`
- `prompts/git_init.md`
- `prompts/governance_init.md`
- `prompts/knowledge_check.md`
- `prompts/update_docs_terminology.md`

## Baseline Decision Support

- Source commit is possible only if you are willing to include the current implementation trees and their deliberate deletions.
- Governance and reports can be split off cleanly.
- Archive and temp trees should stay out of the baseline commit.

