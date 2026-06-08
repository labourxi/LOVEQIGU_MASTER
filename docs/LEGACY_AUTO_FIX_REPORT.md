# Legacy Auto Fix Report

Scope:
- `CONTENT_ENGINE/ATOM_LIBRARY/atoms_v2_batch.yaml`
- `CONTENT_ENGINE/TOKEN_LIBRARY/relic_tokens_v2.yaml`

Applied fixes:
- Removed `reward` and `rarity` from the 20 Atom records in `atoms_v2_batch.yaml`.
- Removed `rarity` from the 10 Relic Token records in `relic_tokens_v2.yaml`.
- Updated nearby notes so they no longer describe removed scarcity or reward semantics.

Verification:
- Governance V2: `WARN`
  - Violations: `0`
  - Warnings: `1`
- Cursor audit: `WARN`
- OMX: `PASS`
- Ductor pipeline: `PASS_WITH_WARNING`

Result:
- The legacy auto-fix set is fully applied.
- No Atom or Relic Token violations remain in the governed legacy batch files.
- Remaining warnings come from repo-wide report-only governance, not from the auto-fixed legacy files.

Counts:
- Total Auto Fix Candidates: `50`
- Auto Fix Applied: `50`
- Manual Review Candidates: `0`

Notes:
- No Canon content was added.
- No V3, AR Engine V2, Lottie, or Digital Collectible subtree content was modified.

LEGACY_AUTO_FIX_COMPLETE = YES

