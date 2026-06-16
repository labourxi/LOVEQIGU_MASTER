# CONTENT_ENGINE Governance V2 Report

Generated: 2026-06-09T04:10:26.115Z
Scope: `CONTENT_ENGINE/**/*.yaml`
Status: WARN

## Summary

| Metric | Count |
|---|---:|
| YAML files scanned | 20 |
| Atom records | 35 |
| Token / Relic records | 20 |
| Collectible / Digital Collectible records | 17 |
| AR Event records | 20 |
| Violations | 0 |
| Warnings | 1 |

## Cursor Compatibility

- Cursor audit status: WARN
- Cursor audit warnings: 51
- Cursor audit violations: 0

## Governed Field Scan

| Field | Occurrences |
|---|---:|
| `rarity` | 5 |
| `reward` | 10 |
| `wish_value` | 10 |
| `tier` | 0 |
| `level` | 0 |
| `grade` | 0 |
| `rank` | 0 |
| `presentation_tier` | 0 |

## Violation Rules

| Rule | Count |
|---|---:|
| None | 0 |

## WARN

- Cursor audit compatibility loaded with 51 warnings.

## Violations

- None.

## Notes

- Governance V2 uses schema-aware checks instead of line-grep false positives.
- Legacy AR Event V1 records are accepted when they retain `code`, `chapter_id`, `node_id`, `output_refs`, and `interaction`.
- Digital Collectible records may carry `presentation_tier` as an allowed presentation field.
- Existing Content Engine YAML files were not modified.

CONTENT_ENGINE_GOVERNANCE_V2_COMPLETE = YES
