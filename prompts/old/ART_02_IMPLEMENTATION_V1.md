# ART_02_IMPLEMENTATION_V1

Objective:

Implement ART-02 Star Activation Ritual V1 using the approved Canvas + Lottie hybrid route.

Read first:

- docs/ART_BIBLE_V1.md
- docs/STAR_ACTIVATION_RITUAL_V1.md
- docs/ART_02_VISUAL_ASSET_SPEC_V1.md
- docs/ART_02_TECH_FEASIBILITY_REVIEW_V1.md
- AGENTS.md

Constraints:

- Do not modify Canon
- Do not modify frozen CH01-CH03 content
- Do not create new product features
- Do not implement entity relic functionality
- Do not use video as primary solution
- Keep package size safe for WeChat real-device testing

Implementation Scope:

1. Create component structure:

apps/miniapp/components/star-activation-ritual/

Files:

- index.js
- index.json
- index.wxml
- index.wxss

2. Create ritual runtime state machine:

apps/miniapp/services/star-ritual-service.js

States:

- idle
- world_quiet
- chart_open
- star_appear
- star_activate
- gold_flow
- copy_show
- hold
- close
- complete

3. Create Canvas rendering layer:

Responsibilities:

- star chart base
- star node positions
- active node highlight
- connection line rendering
- final activated state

4. Create Lottie playback adapter:

Responsibilities:

- chart open motion
- gold flow motion
- seal / completion motion
- graceful fallback if Lottie asset is missing

5. Create asset loading mechanism:

Use:

apps/miniapp/assets/star-ritual/

Subfolders:

- lottie/
- textures/
- audio/

Do not include oversized placeholder assets.
Use lightweight placeholder references only if actual assets are missing.

6. Integrate into AR entry or exploration success flow only as a disabled/demo-triggered preview.

Do not force ritual into production journey yet.

7. Create report:

docs/ART_02_IMPLEMENTATION_V1_REPORT.md

Include:

- files created
- component structure
- state machine design
- Canvas responsibilities
- Lottie responsibilities
- asset loading rules
- package-size risk
- unsupported/missing assets
- next integration step

8. Validation:

Run:

node scripts/omx/run_omx_checks.js

Expected:

- OMX pass
- no terminology violations
- no Canon violations
- JSON valid
- routes valid

Success marker:

ART_02_IMPLEMENTATION_V1_COMPLETE = YES