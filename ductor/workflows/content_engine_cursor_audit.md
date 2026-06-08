# LOVEQIGU Ductor Workflow: content_engine_cursor_audit

Status: Active workflow definition
Created: 2026-06-07

## Purpose

Embed the Cursor audit node into Content Engine automation so new or updated Atom, Token, Collectible, and AR Event YAML is reviewed before downstream workflow continuation.

## Trigger Nodes

1. Initial landing: after V1 or V2 Content Engine generation completes.
2. Batch generation: after V3 or later expansion content completes.
3. Workflow execution: after Ductor or OMX completes.
4. Scheduled maintenance: weekly before release or automation continuation.

## Audit Command

```powershell
node scripts\cursor\run_content_audit.js
```

## Audit Scope

- `CONTENT_ENGINE/ATOM_LIBRARY/**/*.yaml`
- `CONTENT_ENGINE/TOKEN_LIBRARY/**/*.yaml`
- `CONTENT_ENGINE/COLLECTIBLE_LIBRARY/**/*.yaml`
- `CONTENT_ENGINE/AR_EVENT_LIBRARY/**/*.yaml`
- Root Content Engine templates under `CONTENT_ENGINE/*.yaml`

## Gate Rules

| Status | Meaning | Downstream action |
|---|---|---|
| PASS | No blocking issue or warning. | Continue. |
| WARN | Report-only governance findings exist. | Continue only while governance remains report-only; manual review for high-risk items. |
| FAIL | Missing required structure, legacy terminology, duplicated ids, or asset boundary breach. | Stop downstream automation. |

## Required Outputs

- Markdown report: `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.md`
- JSON report: `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json`
- Console marker: `LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES`

## OMX Integration

OMX includes the Cursor gate through:

```text
scripts/omx/check-content-engine-cursor.js
```

`scripts/omx/run_omx_checks.js` must keep this check in the standard OMX check list. If the Cursor audit returns `FAIL`, OMX fails and downstream automation stops.

## Governance Boundary

- Relic remains a story progression asset and Canon-driven asset.
- Digital Collectible remains a marketing and communication asset.
- Relic and Digital Collectible must not be mixed.
- Governed fields remain warning-only while `governance/content_engine_rules.yaml` is in `report_only` mode.
- High-risk findings require manual confirmation and must not be auto-fixed.

LOVEQIGU_CONTENT_ENGINE_CURSOR_WORKFLOW_READY = YES
