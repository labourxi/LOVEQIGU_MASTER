# LOVEQIGU Content Engine Cursor Audit

Generated: 2026-06-08T04:05:16.776Z
Scope: `CONTENT_ENGINE/**/*.yaml`
Status: WARN

## Summary

| Metric | Count |
|---|---:|
| YAML files scanned | 20 |
| Atom records | 30 |
| Token / Relic records | 15 |
| Collectible / Digital Collectible records | 8 |
| AR Event records | 15 |
| FAIL issues | 0 |
| WARN issues | 51 |

## Trigger Nodes

| Trigger | Cursor audit requirement |
|---|---|
| Initial landing | Run after V1/V2 content generation completes. |
| Batch generation | Run after V3 or later expansion content completes. |
| Workflow execution | Run after Ductor or OMX completes. |
| Scheduled maintenance | Run weekly before content release or automation continuation. |

## Governed Field Scan

| Field | Occurrences |
|---|---:|
| `rarity` | 8 |
| `reward` | 20 |
| `wish_value` | 12 |
| `tier` | 0 |
| `level` | 9 |
| `grade` | 0 |
| `rank` | 2 |

Governed fields remain WARN under the current report-only governance mode. High-risk changes require manual review and must not be auto-fixed.

## FAIL

- None.

## WARN

- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v1.yaml:74 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:5 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:5 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:6 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:7 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:19 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:20 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:33 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:34 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:47 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:48 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:61 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:62 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:75 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:76 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:89 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:90 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:103 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:104 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:117 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:118 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:131 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:132 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:145 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/AR_EVENT_LIBRARY/ar_events_v2.yaml:146 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/ATOM_LIBRARY/atoms_v1.yaml:11 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/ATOM_LIBRARY/atoms_v1.yaml:11 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/ATOM_LIBRARY/atoms_v1.yaml:25 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/ATOM_LIBRARY/atoms_v1.yaml:39 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/ATOM_LIBRARY/atoms_v1.yaml:51 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/ATOM_LIBRARY/atoms_v2_batch.yaml:56 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/digital_collectibles_v2.yaml:13 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/digital_collectibles_v2.yaml:22 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/digital_collectibles_v2.yaml:31 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/digital_collectibles_v2.yaml:40 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/digital_collectibles_v2.yaml:49 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/relics_v1.yaml:49 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_LIBRARY/relics_v1.yaml:49 GOVERNED_FIELD - Governed field 'rank' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_TEMPLATE.yaml:12 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/COLLECTIBLE_TEMPLATE.yaml:34 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/TOKEN_LIBRARY/relic_tokens_v2.yaml:82 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/TOKEN_LIBRARY/relic_tokens_v2.yaml:82 GOVERNED_FIELD - Governed field 'rank' is present under report-only mode.
- CONTENT_ENGINE/TOKEN_TEMPLATE.yaml:27 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/V3/AR_EVENT_LIBRARY/ar_events_v3.yaml:74 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/V3/ATOM_LIBRARY/atoms_v3_batch.yaml:19 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/V3/ATOM_LIBRARY/atoms_v3_batch.yaml:19 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.
- CONTENT_ENGINE/V3/ATOM_LIBRARY/atoms_v3_batch.yaml:40 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/V3/TOKEN_LIBRARY/relic_tokens_v3.yaml:8 GOVERNED_FIELD - Governed field 'rarity' is present under report-only mode.
- CONTENT_ENGINE/V3/TOKEN_LIBRARY/relic_tokens_v3.yaml:8 GOVERNED_FIELD - Governed field 'reward' is present under report-only mode.
- CONTENT_ENGINE/V3/TOKEN_LIBRARY/relic_tokens_v3.yaml:8 GOVERNED_FIELD - Governed field 'wish_value' is present under report-only mode.
- CONTENT_ENGINE/V3/TOKEN_LIBRARY/relic_tokens_v3.yaml:63 GOVERNED_FIELD - Governed field 'level' is present under report-only mode.

## Workflow Gate

- New or updated Content Engine YAML must pass Cursor audit before downstream automation continues.
- Existing governed fields are warning-only until governance mode changes from report-only.
- Relic remains story progression and Canon-driven.
- Digital Collectible remains marketing and communication only.
- Relic and Digital Collectible must not be mixed.

LOVEQIGU_CONTENT_ENGINE_CURSOR_AUDIT_COMPLETE = YES
