# Live Ops Engine Pipeline Report

Generated: 2026-06-08T04:05:16.795Z
Scope: `LIVE_OPS_ENGINE/**/*.yaml`
Status: PASS_WITH_WARNING

## Summary

| Metric | Count |
|---|---:|
| Campaigns | 5 |
| Season Rules | 4 |
| Month Templates | 12 |
| Policies | 5 |
| Live Ops Issues | 0 |

## Compatibility

| Channel | Status | Details |
|---|---|---|
| Cursor | WARN | Scanned 20 YAML files; WARN issues: 51; FAIL issues: 0. |
| Governance V2 | WARN | Files scanned: 20; violations: 0; warnings: 1. |
| OMX | PASS | Checks run: 5; warnings: 1; violations: 0. |
| Ductor | PASS | This pipeline report was generated and the completion marker was recorded. |

## Remaining Risks

- None.

## Notes

- Live Ops templates use only existing Story Engine, AR Event, Lottie, and Digital Collectible assets.
- Relic and Digital Collectible remain separate boundaries.
- Repo-wide automation still carries the existing report-only warning state.

LIVE_OPS_ENGINE_PIPELINE_COMPLETE = YES
