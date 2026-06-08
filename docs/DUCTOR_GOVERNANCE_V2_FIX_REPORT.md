# DUCTOR Governance V2 Compatibility Fix Report

Generated: 2026-06-07T02:12:29Z

## Scope

- `scripts/ductor/run_content_engine_pipeline.js`
- `scripts/governance/check_content_engine.js`

## Fixes Applied

1. Updated the Ductor pipeline parser to read Governance V2 stdout fields directly:
   - `PASS`
   - `WARN`
   - `FAIL`
   - `Violations`
   - `Warnings`

2. Updated pipeline status handling so governance failures remain failures instead of being downgraded to warnings.

3. Aligned Governance V2 warning accounting so the compatibility warning is counted in both:
   - the summary totals
   - the WARN section

## Compatibility Notes

- Governance V2 output is now consumed as structured summary text instead of the legacy `Findings:` contract.
- The pipeline now distinguishes:
  - `PASS`
  - `PASS_WITH_WARNING`
  - `FAIL`
- Cursor compatibility warnings are preserved as warnings, not silently dropped into notes.

## Verification

- `node --check scripts/ductor/run_content_engine_pipeline.js` passed.
- `node --check scripts/governance/check_content_engine.js` passed.
- `node scripts/governance/check_content_engine.js` returned:
  - `FAIL`
  - `Files scanned: 12`
  - `Violations: 50`
  - `Warnings: 1`
- `node scripts/ductor/run_content_engine_pipeline.js` returned:
  - `Workflow Count: 4`
  - `Pipeline Status: FAIL`

## Reports Updated

- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`
- `docs/CONTENT_ENGINE_PIPELINE_REPORT.md`

## Completion Marker

`DUCTOR_GOVERNANCE_V2_COMPATIBILITY_FIXED = YES`
