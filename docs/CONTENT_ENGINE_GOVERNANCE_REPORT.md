# CONTENT_ENGINE Governance Report

Generated: 2026-06-07

Scope: `CONTENT_ENGINE/**/*.yaml`

## Counts

Counting method:

- Atom count: `atom_id` entries plus V2 `id` entries in `ATOM_LIBRARY`.
- Token count: Relic/story-progression records using `relic_id` or Relic `token_id`.
- Collectible count: Digital Collectible / communication assets using `collectible_id` plus Digital Collectible `token_id`.
- AR Event count: `event_id` entries in `AR_EVENT_LIBRARY`.

| Type | Count |
|---|---:|
| Atom | 30 |
| Token / Relic | 15 |
| Collectible / Digital Collectible | 8 |
| AR Event | 15 |

## Governed Field Findings

The following governed fields exist in `CONTENT_ENGINE` and are listed for governance review only. Existing content was not modified.

| Field | Occurrences |
|---|---:|
| `rarity` | 38 |
| `reward` | 39 |
| `wish_value` | 32 |
| `tier` | 0 |
| `level` | 6 |
| `grade` | 0 |
| `rank` | 2 |

Total governed field findings: 117

## Governance Interpretation

- `rarity` appears primarily as `not_applicable` and should remain non-ranking unless future governance removes the field.
- `reward` and `wish_value` appear in V2 prompt-driven structures. Current values are neutralized as `wish_value: 0`, but the fields are still governed.
- `level` and `rank` appear in boundary language describing what the content must not be. They are still flagged for review because the governance scan is field/string based.

## Files Created By Governance Apply

- `docs/CONTENT_ENGINE_GOVERNANCE_REPORT.md`
- `governance/content_engine_rules.yaml`
- `scripts/governance/check_content_engine.js`

## Files Modified By Governance Apply

None. Existing `CONTENT_ENGINE` content was not changed.
