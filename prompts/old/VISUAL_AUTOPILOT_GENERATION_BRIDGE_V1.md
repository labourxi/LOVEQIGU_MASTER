# VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1

Objective

Build the first generation bridge for Visual Autopilot.

Goal:

Use one visual prompt to generate image candidates from:

- OpenAI / ChatGPT image generation
- Gemini image generation

Then save, compare, and report results.

Do not integrate Doubao yet.

--------------------------------------------------

Read first:

- docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md
- docs/art/ART_INDEX_V1.md
- docs/product/world/WORLD_CANON_INDEX_V1.md
- docs/PROJECT_CONTEXT_MEMORY_V1.md
- docs/PROJECT_CONTEXT_REGISTRY_V1.md

--------------------------------------------------

Create:

scripts/visual_autopilot/

Files:

- visual_generation_bridge_v1.py
- visual_prompt_request_schema.json
- visual_generation_config.example.json

--------------------------------------------------

Create output folders:

assets/visual-autopilot/candidates/

assets/visual-autopilot/reports/

--------------------------------------------------

Bridge Requirements:

1. Accept one prompt input.

2. Send same prompt to:

- OpenAI image generation endpoint
- Gemini image generation endpoint

3. Save generated images with naming format:

visual_task_id_model_timestamp.png

Example:

art04_four_symbol_dragon_openai_20260613_001.png

4. Save metadata:

- prompt
- model
- provider
- generation time
- file path
- task id
- related canon files

5. Generate report:

docs/VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_REPORT.md

Include:

- generation task
- prompt used
- providers used
- images generated
- failed providers
- missing API keys
- next audit step

--------------------------------------------------

Do not hardcode API keys.

Use environment variables:

OPENAI_API_KEY

GEMINI_API_KEY

--------------------------------------------------

If API keys are missing:

Do not fail silently.

Return:

BLOCKED_BY_MISSING_API_KEY

--------------------------------------------------

Do not auto-freeze assets.

Do not modify Runtime.

Do not upload images anywhere.

Generation and archive only.

--------------------------------------------------

Success Marker:

VISUAL_AUTOPILOT_GENERATION_BRIDGE_V1_READY = YES