# OMX Bootstrap for LOVEQIGU_MASTER

Objective:
Establish the automated OMX validation layer for LOVEQIGU_MASTER.

Tasks:

1. Initialize OMX workflow environment:
   - Create folder: `scripts/omx/`
   - Ensure Node.js 18+ environment

2. Create core validation scripts:

   a. check-terminology.js
      - Scan apps/miniapp for forbidden/outdated terms
      - Compare against docs/language/LOVEQIGU_TERMINOLOGY_V1.md
      - Report violations

   b. check-canon.js
      - Scan apps/miniapp for content that violates Canon rules
      - Compare against docs/canon/
      - Report gaps

   c. check-routes.js
      - Verify all MiniApp routes exist
      - Ensure proper page registration
      - JSON configuration validation

   d. check-json.js
      - Validate JSON files under apps/miniapp
      - Confirm parsing and schema integrity

3. Create a master runner: `run_omx_checks.js`
   - Execute all above scripts
   - Consolidate results
   - Output summary report to `D:\LOVEQIGU_MASTER\docs\OMX_REPORT.md`

4. Dry run validation:
   - Ensure all scripts run without modifying source
   - Validate that all reports are generated
   - Highlight any unresolved issues

Rules:
- Do not modify Canon files
- Do not modify project logic
- Only read files and generate reports
- Preserve Markdown structure

Output:
- OMX_REPORT.md in docs/
- Console summary