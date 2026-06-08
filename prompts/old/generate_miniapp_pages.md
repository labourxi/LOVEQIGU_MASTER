# MiniApp Pages Generation for LOVEQIGU_MASTER

Objective:
Automatically generate or update MiniApp pages based on the completed Canon, World Bible, and Terminology documents, ensuring full compliance.

Tasks:

1. Pages to generate/update:
   - AR preview page (placeholder for AR_GATE_OPEN_V1 and AR_IMPRINT_PARTICLES_V1)
   - Explore Map page
   - Rights Center page
   - Relic Archive page
   - Story Archive page
   - MiniApp homepage

2. Data sources:
   - docs/canon/* (Canon rules)
   - docs/world/LOVEQIGU_WORLD_BIBLE_V1.md
   - docs/language/LOVEQIGU_TERMINOLOGY_V1.md
   - docs/information_architecture/LOVEQIGU_INFORMATION_ARCHITECTURE_V1.md

3. Rules:
   - Preserve Canon constraints
   - Only use approved Terminology
   - Keep "Relic" / 信物 separate from "Digital Collectible" / 传播资产
   - Respect L1/L2/L3 language layers
   - Maintain JSON and WXML validity
   - Generate placeholder panels where full data is not yet available
   - Do not modify existing scripts except updating routes and page configs

4. Output:
   - Generate/update files under `apps/miniapp/pages/*`
   - Update `apps/miniapp/app.json` and `project.config.json` with new pages/routes
   - Ensure responsive layout for WXSS/WXML files
   - Update images under `apps/miniapp/assets/images/` if required

5. Validation:
   - Run OMX checks after generation
   - Ensure 0 violations in `OMX_REPORT.md`
   - Keep a backup of any overwritten pages under `scripts/omx/backups/`

6. Logging:
   - For each page, log actions performed (created, updated, placeholder added)
   - Output a summary to `docs/OMX_REPORT.md`