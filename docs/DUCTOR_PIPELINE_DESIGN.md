# Ductor Content Engine Pipeline Design

Generated: 2026-06-07

## Purpose

This pipeline connects Content Engine scanning, governance review, OMX validation, and final reporting under Ductor scheduling without generating new content.

## Execution Order

1. Codex prepares or updates Content Engine assets.
2. Cursor scans `CONTENT_ENGINE/**/*.yaml`.
3. Governance checks governed fields and asset boundaries.
4. OMX runs the combined validation set.
5. Ductor records the final pipeline report.

## Stage Definitions

| Stage | Script | Output | Gate |
|---|---|---|---|
| Content Scan | `scripts/cursor/run_content_audit.js` | `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md` and `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json` | Warn allowed |
| Governance Check | `scripts/governance/check_content_engine.js` | `docs/CONTENT_ENGINE_GOVERNANCE_REPORT.md` | Warn allowed |
| OMX Check | `scripts/omx/run_omx_checks.js` | `docs/OMX_REPORT.md` | Pass required |
| Report | none | `docs/CONTENT_ENGINE_PIPELINE_REPORT.md` | Pass required |

## Mock Run Result

- Cursor audit completed with `WARN`.
- Governance check completed with 117 governed-field findings in report-only mode.
- OMX completed with 5 checks passed, 0 failed, and 1 warning.
- No Content Engine YAML files were modified by the pipeline run itself.

## Workflow Count

4 stages.

## Pipeline Status

PASS

## Notes

- `WARN` is expected while governance remains `report_only`.
- `FAIL` would stop downstream automation and require manual review.
- Relic and Digital Collectible remain separated by asset boundary.

