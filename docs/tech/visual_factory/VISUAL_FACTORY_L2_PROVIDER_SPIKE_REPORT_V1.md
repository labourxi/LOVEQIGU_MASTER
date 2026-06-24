# VISUAL_FACTORY_L2_PROVIDER_SPIKE_V1

## Scope

Repo-wide audit only. Findings are based on code and local environment files in this repository. No mock assumptions were used.

Scanned targets:
- `.env`
- `.env.local`
- `.env.production`
- `config/`
- `apps/admin/`
- `scripts/`
- `services/`
- `cloudbase/`

Keyword scan included:
`GEMINI`, `GOOGLE_API_KEY`, `GENERATIVEAI`, `AISTUDIO`, `VERTEX`, `DOUBAO`, `ARK_API_KEY`, `VOLCENGINE`, `IMAGE_GENERATION`, `TEXT_TO_IMAGE`, `GENERATE_IMAGE`, `PROMPT_SUBMIT`, `TASK_STATUS`, `DOWNLOAD_IMAGE`, `SAVE_IMAGE`

## Executive Result

- `GEMINI_PROVIDER: EXISTS`
- `GEMINI_PROVIDER: CONNECTED`
- `DOUBAO_PROVIDER: EXISTS`
- `DOUBAO_PROVIDER: CONNECTED`
- `AUTO_SUBMIT: YES`
- `AUTO_COLLECT: YES`
- `AUTO_SAVE: YES`
- `VISUAL_FACTORY_PROVIDER_CHAIN: PASS`
- `VISUAL_FACTORY_AUTOMATION_LEVEL: L2`

## Findings

### Gemini provider

`scripts/visual_autopilot/providers/gemini.py` contains a real provider class:
- `GeminiProvider` at `scripts/visual_autopilot/providers/gemini.py:12`
- API key lookup across `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `GOOGLE_GENAI_API_KEY` at `:30-36`
- HTTP header `x-goog-api-key` at `:64-68`
- `health_check()` at `:156-174`
- `generate()` at `:313-317`

Environment evidence:
- `.env.local` exists
- `GEMINI_API_KEY` is present in `.env.local` at line `5`

Connectivity conclusion:
- The Gemini provider is connected at the code/config level because it reads a real API key and issues HTTP requests.
- Important caveat: `GeminiProvider.generate()` returns a structured failure for image generation and its own capability probe reports `image_generation_supported: False` when no image-capable model is available. In this repo, Gemini is wired as a connected provider/client, not as the active image generation path.

### Doubao / Seedream provider

There is no dedicated file literally named `doubao-provider.py`, but there is a real image-generation provider implementation:
- `SeedreamArkProvider` at `scripts/visual_autopilot/providers/seedream_ark.py:45`
- API key resolution via `ARK_API_KEY` at `:57-62`
- HTTP POST with `Authorization: Bearer ...` at `:64-68`
- download of returned image bytes at `:206-208`
- candidate image persistence at `:221-223`
- result collection/save path in `generate()` at `:272-303`
- `health_check()` at `:375-387`
- `generate()` at `:409-413`

Environment evidence:
- `.env.local` contains `ARK_API_KEY` at line `3`

Connectivity conclusion:
- This provider is connected at the code/config level and is the repo's real image generation path.
- The active model is `doubao-seedream-5-0-260128` in `scripts/visual_autopilot/providers/seedream_ark.py:47-48`.

### Auto submit / collect / save

Auto submit:
- `scripts/visual_autopilot/run_multi_candidate_ranking.py:215` instantiates `SeedreamArkProvider`
- `scripts/visual_autopilot/run_multi_candidate_ranking.py:299` calls `judge.score_candidate(...)` after generation
- `scripts/visual_autopilot/visual_generation_bridge_v1.py:184-195` and `:229-248` send prompts to providers over HTTP

Auto collect:
- `scripts/visual_autopilot/providers/seedream_ark.py:206-208` downloads image bytes
- `scripts/visual_autopilot/visual_generation_bridge_v1.py:124-135` downloads and decodes image payloads

Auto save:
- `scripts/visual_autopilot/providers/seedream_ark.py:221-223` writes candidate files
- `scripts/visual_autopilot/providers/seedream_ark.py:272-303` persists returned images / metadata
- `scripts/visual_autopilot/visual_generation_bridge_v1.py:209-226` and `:272-290` persist generated files and metadata

### Visual Factory provider chain

The chain is real and connected:
- `apps/admin/modules/visual-factory/services/art-requirement-generator.js:19-27`
- `apps/admin/modules/visual-factory/services/prompt-generator.js:13-18, 45-53`
- `apps/admin/modules/visual-factory/services/visual-task-service.js:54-125`
- `apps/admin/modules/visual-factory/services/generation-queue.js:14-18, 36-50, 53-61, 85-93`
- `apps/admin/modules/visual-factory/index.js:56-60, 99-110, 129-149, 259-280`
- `orchestrator/factories/adapters/visual_factory.py:7-12, 35-45`
- `scripts/visual_autopilot/run_multi_candidate_ranking.py:14-22, 215, 298-299`

This chain covers:
- Visual Task
- Art Requirement generation
- Prompt generation
- Generation queue
- Candidate generation
- Candidate judging
- Human review gate

## Code Found / Not Found

### Code found

- `scripts/visual_autopilot/providers/base.py`
- `scripts/visual_autopilot/providers/gemini.py`
- `scripts/visual_autopilot/providers/seedream_ark.py`
- `scripts/visual_autopilot/visual_generation_bridge_v1.py`
- `scripts/visual_autopilot/run_multi_candidate_ranking.py`
- `scripts/visual_autopilot/candidate_judge.py`
- `orchestrator/factories/adapters/visual_factory.py`
- `apps/admin/modules/visual-factory/index.js`
- `apps/admin/modules/visual-factory/services/art-requirement-generator.js`
- `apps/admin/modules/visual-factory/services/prompt-generator.js`
- `apps/admin/modules/visual-factory/services/visual-task-service.js`
- `apps/admin/modules/visual-factory/services/generation-queue.js`

### Code not found

- No dedicated `doubao-provider.py` file name
- No explicit `submitPrompt()` function name
- No explicit `pollTask()` / `getResult()` chain name
- No explicit `saveResult()` function name
- No `config/` directory in the repository root during this audit
- No `cloudbase/` directory in the repository root during this audit

## Real Findings

- `GEMINI_API_KEY` exists in `.env.local`
- `ARK_API_KEY` exists in `.env.local`
- The repo has a real Gemini client/provider and a real ARK/Seedream image generation provider
- The ARK/Seedream path is the actual image output path used by the visual pipeline
- The pipeline automatically generates tasks, requirements, prompts, queues, candidate images, and saves outputs
- No dedicated async task polling API was found in the scanned code; the generation flow is synchronous HTTP + download/save

## Automation Level Rationale

- `L0` would require fully manual prompt, submit, collect
- `L1` would require system prompt generation only
- `L2` requires system prompt generation plus automatic submit, collect, and save
- `L3` would require automatic review, auto-insert, and auto-publish

Current code reaches `L2` because:
- prompt/requirement generation is system-driven
- image generation is triggered automatically by the pipeline
- returned images are downloaded and saved automatically
- the human review gate still blocks full auto-publish

## Evidence Paths

- `.env.local`
- `scripts/visual_autopilot/providers/gemini.py`
- `scripts/visual_autopilot/providers/seedream_ark.py`
- `scripts/visual_autopilot/visual_generation_bridge_v1.py`
- `scripts/visual_autopilot/run_multi_candidate_ranking.py`
- `scripts/visual_autopilot/candidate_judge.py`
- `orchestrator/factories/adapters/visual_factory.py`
- `apps/admin/modules/visual-factory/index.js`
- `apps/admin/modules/visual-factory/services/art-requirement-generator.js`
- `apps/admin/modules/visual-factory/services/prompt-generator.js`
- `apps/admin/modules/visual-factory/services/visual-task-service.js`
- `apps/admin/modules/visual-factory/services/generation-queue.js`
- `apps/admin/index.html`
- `apps/admin/platform-admin/shared/platform-admin-ui.js`

## Conclusion

The repository already contains:
- a connected Gemini provider/client
- a connected ARK/Seedream image generation provider
- automatic prompt generation
- automatic candidate generation / collection / save
- a real Visual Factory chain that links task -> requirement -> prompt -> queue -> provider -> judge -> human review

No dedicated `doubao-provider` filename exists, but the active Doubao/Seedream image path is real and connected through `SeedreamArkProvider`.
