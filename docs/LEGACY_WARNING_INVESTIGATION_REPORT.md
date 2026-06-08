# Legacy Warning Investigation Report

Scope:
- `docs/LEGACY_AUTO_FIX_REPORT.md`
- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`
- `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json`

Finding:
- Governance V2 now reports `Warnings: 1` with `Violations: 0`.
- The single warning is: `Cursor audit compatibility loaded with 51 warnings.`

Classification:
- Warning description: repository-level Cursor compatibility warning loaded into Governance V2.
- Source file: `docs/CONTENT_ENGINE_CURSOR_AUDIT_REPORT.json` as consumed by `scripts/governance/check_content_engine.js`.
- Severity: Low.
- Type: Compatibility / report-only warning.

Assessment:
- This warning does not come from V1/V2 legacy YAML content.
- It is not a new content violation.
- It does not indicate a Canon break.
- It does not require an immediate YAML fix.

Suggested action:
- Keep the warning classified as compatibility-only.
- Do not modify YAML for this item.
- Revisit only if the Cursor audit contract changes or the governance mode stops being report-only.

Notes:
- The legacy auto-fix set remains applied.
- No additional legacy content defects were identified during this investigation.

LEGACY_WARNING_INVESTIGATION_COMPLETE = YES

