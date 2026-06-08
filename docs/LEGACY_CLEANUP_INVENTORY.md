# Legacy Cleanup Inventory

Source inputs:
- `scripts/governance/check_content_engine.js`
- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`

Scope:
- Inventory only.
- No source content was modified.

## Atom Violations

File: `CONTENT_ENGINE/ATOM_LIBRARY/atoms_v2_batch.yaml`

1. `atom_v2_emotion_quiet_arrival` - forbidden fields: `reward`, `rarity`
2. `atom_v2_emotion_first_seen` - forbidden fields: `reward`, `rarity`
3. `atom_v2_emotion_return_to_attention` - forbidden fields: `reward`, `rarity`
4. `atom_v2_emotion_connection_remains` - forbidden fields: `reward`, `rarity`
5. `atom_v2_emotion_after_echo` - forbidden fields: `reward`, `rarity`
6. `atom_v2_symbol_map_trace` - forbidden fields: `reward`, `rarity`
7. `atom_v2_symbol_archive_light` - forbidden fields: `reward`, `rarity`
8. `atom_v2_symbol_gate_state` - forbidden fields: `reward`, `rarity`
9. `atom_v2_symbol_imprint_piece` - forbidden fields: `reward`, `rarity`
10. `atom_v2_symbol_rights_marker` - forbidden fields: `reward`, `rarity`
11. `atom_v2_symbol_wish_value_ledger` - forbidden fields: `reward`, `rarity`
12. `atom_v2_symbol_share_frame` - forbidden fields: `reward`, `rarity`
13. `atom_v2_ritual_pre_entry_pause` - forbidden fields: `reward`, `rarity`
14. `atom_v2_ritual_awareness_line` - forbidden fields: `reward`, `rarity`
15. `atom_v2_ritual_echo_receiving` - forbidden fields: `reward`, `rarity`
16. `atom_v2_ritual_relic_review` - forbidden fields: `reward`, `rarity`
17. `atom_v2_ritual_zhujin_intro` - forbidden fields: `reward`, `rarity`
18. `atom_v2_ritual_completion_gathering` - forbidden fields: `reward`, `rarity`
19. `atom_v2_ritual_share_after_completion` - forbidden fields: `reward`, `rarity`
20. `atom_v2_ritual_profile_memory` - forbidden fields: `reward`, `rarity`

## Relic Token Violations

File: `CONTENT_ENGINE/TOKEN_LIBRARY/relic_tokens_v2.yaml`

1. `relic_token_v2_threshold_echo` - forbidden field: `rarity`
2. `relic_token_v2_map_trace` - forbidden field: `rarity`
3. `relic_token_v2_imprint_piece` - forbidden field: `rarity`
4. `relic_token_v2_archive_light` - forbidden field: `rarity`
5. `relic_token_v2_awareness_mark` - forbidden field: `rarity`
6. `relic_token_v2_zhujin_intro` - forbidden field: `rarity`
7. `relic_token_v2_connection_thread` - forbidden field: `rarity`
8. `relic_token_v2_completion_gathering` - forbidden field: `rarity`
9. `relic_token_v2_story_archive` - forbidden field: `rarity`
10. `relic_token_v2_echo_record` - forbidden field: `rarity`

## Violation Summary

- Total violations: `50`
- Atom forbidden-field violations: `40`
- Relic token forbidden-field violations: `10`
- Auto Fix Candidates: `50`
- Manual Review Candidates: `0`

## Fix Groups

### Group A - Auto Fix

Mechanical field removal only.

- Remove `reward` and `rarity` from the 20 atom records listed above.
- Remove `rarity` from the 10 relic token records listed above.

### Group B - Manual Review

None identified from the current governance report.

### Group C - Canon Risk

None identified from the current governance report.

## Inventory Notes

- The violations are localized to two files.
- The atom set accounts for 20 records with 2 forbidden fields each.
- The relic token set accounts for 10 records with 1 forbidden field each.
- This inventory does not propose content changes.

LEGACY_CLEANUP_INVENTORY_COMPLETE = YES

