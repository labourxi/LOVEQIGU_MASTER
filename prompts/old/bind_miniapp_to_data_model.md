# Bind MiniApp Pages to LOVEQIGU Data Model

Objective:

Update all MiniApp pages to use the shared LOVEQIGU data model and service modules.

Read first:

- docs/DATA_MODEL_REPORT.md
- services/story/story-service.js
- services/relic/relic-service.js
- services/rights/rights-service.js
- services/ar/ar-service.js

Tasks:

1. Update each page in apps/miniapp/pages/* to import the corresponding service module.
   - explore-map → ar-service.js
   - rights-center → rights-service.js
   - relic-archive → relic-service.js
   - story-archive → story-service.js
   - ar-entry → ar-service.js

2. Replace all placeholder data in page components with live calls to the service getter functions.

3. Ensure JSON validation:
   - Each page should correctly load JSON from data/story, data/relics, data/rights, data/ar
   - All data parsing should pass without errors

4. Validate Terminology compliance:
   - No forbidden/outdated terms in any page
   - Respect L1/L2/L3 language separation

5. Update MiniApp app.json and project.config.json as needed to reflect routes and pages.

6. Backup original pages under scripts/omx/backups/miniapp-pages/.

7. Generate log report:
   - docs/MINIAPP_BIND_REPORT.md
   - Include changes made per page
   - Include validation and checks

Rules:

- Do not modify Canon files.
- Do not modify governance files.
- Do not alter page layout unnecessarily.
- Use approved Terminology only.
- Keep JSON parsing valid.

Validation:

- Run node scripts/omx/run_omx_checks.js
- Ensure all checks pass, 0 violations

Output:

- Updated MiniApp pages under apps/miniapp/pages/*
- Backup of original pages in scripts/omx/backups/miniapp-pages/
- docs/MINIAPP_BIND_REPORT.md
