# CONTENT_ENGINE Pipeline Report

Generated: 2026-06-08T04:02:55.971Z

## Workflow Count

4

## Pipeline Status

PASS_WITH_WARNING

## Stage Results

| Stage | Status | Evidence |
|---|---|---|
| Content Scan | WARN | `scripts/cursor/run_content_audit.js` returned 0. |
| Governance Check | WARN | `scripts/governance/check_content_engine.js` returned 1 with 0 violations and 1 warnings. |
| OMX Check | PASS | `scripts/omx/run_omx_checks.js` returned 0. |
| Ductor Report | PASS | This pipeline report was generated and completion marker recorded. |

## Mock Run Summary

- Cursor audit scanned 20 YAML files.
- Governance stayed report-only and did not modify Content Engine content.
- OMX chained the Cursor audit gate successfully.
- No Atom, Token, Collectible, or AR Event entries were added or changed.

## Reports Used

- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md`
- `docs/CONTENT_ENGINE_GOVERNANCE_REPORT.md`
- `docs/OMX_REPORT.md`

## Completion Marker

`DUCTOR_CONTENT_ENGINE_PIPELINE_READY = YES`
