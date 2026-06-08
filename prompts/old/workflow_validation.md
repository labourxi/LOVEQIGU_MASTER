# WORKFLOW_VALIDATION

Verify the full automated governance chain for LOVEQIGU_MASTER:

1. Check Git repository:
   - Branch is master
   - Status is clean
   - All tracked files present

2. Run OMX validation scripts:
   - scripts/omx/run_omx_checks.js
   - Verify Terminology, Routes, JSON, Canon checks pass
   - Report any warnings

3. Validate MiniApp:
   - apps/miniapp/pages/* and services/*
   - docs/MINIAPP_SIZE_REPORT.md
   - docs/MINIAPP_BIND_REPORT.md
   - docs/MVP_ACCEPTANCE_REPORT.md
   - Confirm pages, services, bindings, JSON, and package size are valid

4. Validate Data Models:
   - data/story/chapters.json
   - data/relics/relics.json
   - data/rights/rights.json
   - data/ar/ar-events.json
   - Ensure JSON parsing and service getters work

5. Generate governance workflow validation report:
   - Save results in docs/WORKFLOW_VALIDATION_REPORT.md
   - Include PASS/FAIL status, warnings, and summary of validated elements

Do not modify source files; report only.