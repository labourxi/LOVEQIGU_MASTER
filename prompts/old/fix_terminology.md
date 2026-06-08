# Terminology Fix for LOVEQIGU_MASTER

Objective:
Automatically fix outdated Terminology violations identified by OMX.

Tasks:

1. Scan all files listed in the last OMX_REPORT.md as containing terminology violations:
   - apps/miniapp/pages/index/index.js
   - apps/miniapp/pages/rights-center/index.json
   - apps/miniapp/pages/rights-center/index.wxml

2. Replace old terms with approved replacements according to:
   - docs/language/LOVEQIGU_TERMINOLOGY_V1.md
   - AGENTS.md replacements rules

3. Validation:
   - Ensure JSON and WXML files remain valid
   - Do not modify Canon files or project logic
   - Output a dry-run summary in docs/OMX_REPORT.md

4. Logging:
   - List each replacement made
   - Indicate line numbers and file paths
   - Keep a backup of original files in scripts/omx/backups/

5. After completion:
   - Re-run `run_omx_checks.js` to confirm all terminology violations are cleared