# ARCHETYPE_VISUAL_FACTORY_AUTOMATION_V1_REPORT

## Scope

Repository audit only. No runtime or release code was modified for this report.

Audited areas:

- `scripts/visual_autopilot/`
- `apps/admin/modules/visual-factory/`
- `orchestrator/`
- `.env.local`
- `data/visual_factory/`
- `docs/tech/visual_factory/`

## Safe Run

Executed a validate-only safe-run for the Gemini-facing bridge path with a temporary config that kept the run offline and did not generate images:

- `python scripts/visual_autopilot/visual_generation_bridge_v1.py --validate-only ...`

Result:

- safe-run completed successfully
- no runtime state was modified
- no images were generated

## Findings

### Gemini API

Status: `YES`

Evidence:

- `.env.local` contains a Gemini API key entry
- `scripts/visual_autopilot/providers/gemini.py` reads Gemini credentials and performs real HTTP requests
- `scripts/visual_autopilot/visual_generation_bridge_v1.py` contains a Gemini generation path

Important note:

- `scripts/visual_autopilot/providers/gemini.py` currently returns a structured `image not available` failure for direct provider generation, so the usable image-generation path is the bridge-level Gemini call rather than that provider class.

### Doubao / Seedream API

Status: `YES`

Evidence:

- `.env.local` contains `ARK_API_KEY`
- `scripts/visual_autopilot/providers/seedream_ark.py` performs real API signing and HTTP image generation requests
- the provider persists returned images automatically

### Prompt Generator

Status: `YES`

Evidence:

- `apps/admin/modules/visual-factory/services/prompt-generator.js`
- `apps/admin/modules/visual-factory/index.js` calls prompt generation automatically when a task is seeded

### Batch Execution

Status: `YES`

Evidence:

- `scripts/visual_autopilot/run_multi_candidate_ranking.py` runs multiple candidates in parallel
- it saves variation prompts, scores candidates, picks a winner, and writes reports

### Auto Save

Status: `YES`

Evidence:

- `scripts/visual_autopilot/visual_generation_bridge_v1.py` writes generated image files and metadata
- `scripts/visual_autopilot/providers/seedream_ark.py` writes candidate image files
- `scripts/visual_autopilot/run_multi_candidate_ranking.py` copies the winner image into the winner directory

### Auto Naming

Status: `YES`

Evidence:

- `scripts/visual_autopilot/visual_generation_bridge_v1.py` has deterministic filename construction
- `scripts/visual_autopilot/run_multi_candidate_ranking.py` writes deterministic prompt filenames for candidate variants

### Review Sheet

Status: `NO`

Evidence:

- no `review_sheet.csv` writer was found in the audited paths
- no dedicated review-sheet export script was found in the audited paths

### Batch Output Directory

Status: `PARTIAL`

Evidence:

- `assets/visual-autopilot/` exists with candidates, prompts, judge, reports, review, and winner subdirectories
- `data/visual_factory/` does not currently exist in the repository root
- no code was found that writes a batch package into `data/visual_factory/batches/...`

## Automation Level

```yaml
VISUAL_FACTORY_AUTOMATION_LEVEL_BEFORE: L2
VISUAL_FACTORY_AUTOMATION_LEVEL_AFTER: L2
```

Reasoning:

- prompt generation exists
- provider execution exists
- automatic save exists
- batch ranking exists
- human review / approval is still required
- review sheet export is still missing

## Minimum Missing Pieces

To satisfy the exact batch package requested in this task, the smallest missing pieces are:

1. a batch exporter that writes `review_sheet.csv`
2. a batch manifest writer that emits `batch_manifest.json`
3. a thin wrapper that copies the accepted outputs into `data/visual_factory/batches/<batch_id>/`

## Capability Status

```yaml
GEMINI_CAN_RUN: YES
DOUBAO_SEEDREAM_CAN_RUN: YES
CURSOR_CAN_EXECUTE_BATCH: YES
AUTO_SAVE_READY: YES
AUTO_NAMING_READY: YES
REVIEW_SHEET_READY: NO
ARCHETYPE_VISUAL_FACTORY_AUTOMATION_CAN_BUILD: PARTIAL
```

## Next Step

The next safe implementation step is a small batch exporter / wrapper, not a new visual worldview:

- generate prompt
- call provider(s)
- save assets
- export `batch_manifest.json`
- export `review_sheet.csv`
- wait for human approval

## Notes

- No new visual worldbuilding was introduced.
- No runtime / release logic was changed.
- No AR Factory changes were made.
