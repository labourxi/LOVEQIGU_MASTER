# LOVEQIGU Data Model Build

Objective:

Build the first shared LOVEQIGU data model layer for MiniApp, services, AR, and future operations.

Read first:

- AGENTS.md
- docs/canon/*
- docs/world/*
- docs/language/*
- docs/architecture/*
- docs/MVP_BUILD_REPORT.md

Create:

- data/
- data/story/
- data/relics/
- data/rights/
- data/ar/
- services/story/
- services/relic/
- services/rights/
- services/ar/

Data files:

1. data/story/chapters.json
2. data/relics/relics.json
3. data/rights/rights.json
4. data/ar/ar-events.json

Service files:

1. services/story/story-service.js
2. services/relic/relic-service.js
3. services/rights/rights-service.js
4. services/ar/ar-service.js

Rules:

- Relic is story progression asset.
- Digital Collectible is marketing/communication asset.
- Never mix Relic with Digital Collectible.
- Do not invent Canon.
- Do not fill Canon gaps.
- Use placeholder data only.
- Use approved Terminology only.
- Keep all JSON valid.
- Keep all service modules simple and read-only for now.

Each service should:

- load its corresponding JSON file
- expose simple getter functions
- avoid external dependencies
- avoid API/network code

Validation:

- Run node scripts/omx/run_omx_checks.js
- Ensure 4 checks run, 4 passed, 0 violations

Create:

docs/DATA_MODEL_REPORT.md

Include:

- files created
- schema overview
- service overview
- unresolved gaps
- OMX validation result

Do not modify Canon files.
Do not modify governance files.
Do not modify MiniApp UI unless strictly necessary.