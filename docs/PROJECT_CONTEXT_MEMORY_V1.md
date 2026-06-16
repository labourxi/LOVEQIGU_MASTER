# PROJECT_CONTEXT_MEMORY_V1

## Purpose

This document defines the project-level context memory model used before executing any task.

It answers four questions for each task:

1. Which files must be loaded
2. Which files are optional
3. Which files are frozen
4. Which missing files block execution

The goal is to preserve project identity, terminology, Canon constraints, and implementation direction.

The memory layer must consult the project registry before task execution so it can resolve:

- required files
- optional files
- frozen files
- execution readiness

## Source Priority

When there is a conflict, load and obey files in this order:

1. `docs/canon/*`
2. `docs/world/*`
3. `docs/language/*`
4. `docs/architecture/*`
5. task-specific reports and implementation notes
6. source code

Higher-priority documents override lower-priority documents.

## Registry Integration

The registry is the index layer for memory lookups.

Memory should use:

- `docs/PROJECT_CONTEXT_REGISTRY_V1.md`

to determine:

- task dependencies
- file ownership
- frozen-file risk
- whether a task is blocked before implementation starts

## Frozen Context

Frozen files are read-only reference points for the task.

Typical frozen files:

- baseline documents
- freeze reports
- acceptance reports
- approved task reports
- locked content canon files

Frozen files must be checked for conflict, but they are not edited as part of the task unless the task explicitly says to update the freeze itself.

## Validation Model

Before execution, validate:

1. Required files exist
2. Required files are readable
3. Frozen files are not being modified
4. Version conflicts are absent or explained
5. Missing context is reported before implementation starts

Validation result labels:

- `PASS`
- `WARN`
- `FAIL`

## Blocking Rule

If a required file is missing, unreadable, or contradictory to the task scope, the task is blocked.

The blocker should be reported with:

- missing file name
- why it is required
- what fallback, if any, is safe

## Terminology Alias

The prompt references `LOVEQIGU_TERMINOLOGY_FINAL.md`.

In this repository, the current authoritative terminology source is:

- `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`

Use that file as the terminology source of truth until a separate final terminology file is created.

## Task Memory Map

Each task entry uses this structure:

```text
TASK:
  name

REQUIRED FILES:
  - file
  - file

OPTIONAL FILES:
  - file

FROZEN FILES:
  - file

BLOCKED IF MISSING:
  - file
```

## ART Task Mapping

### ART_02_IMPLEMENTATION_V1

TASK:

- `ART_02_IMPLEMENTATION_V1`

REQUIRED FILES:

- `docs/ART_BIBLE_V1.md`
- `docs/STAR_ACTIVATION_RITUAL_V1.md`
- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`
- `docs/ART-02_TECH_FEASIBILITY_REVIEW_V1.md`

OPTIONAL FILES:

- `docs/ARTIFACT_CONCEPT_V1.md`
- `docs/ART_02_IMPLEMENTATION_V1_REPORT.md`
- `docs/language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md`

FROZEN FILES:

- `docs/ART_BIBLE_V1.md`
- `docs/STAR_ACTIVATION_RITUAL_V1.md`
- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- frozen chapter/content canonical files referenced by the art flow

BLOCKED IF MISSING:

- any required file above

### ART_02_ACCEPTANCE_REVIEW

TASK:

- `ART_02_ACCEPTANCE_REVIEW`

REQUIRED FILES:

- `docs/ART_02_IMPLEMENTATION_V1_REPORT.md`
- `docs/ART_BIBLE_V1.md`
- `docs/STAR_ACTIVATION_RITUAL_V1.md`
- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`

OPTIONAL FILES:

- `docs/ART-02_TECH_FEASIBILITY_REVIEW_V1.md`
- `docs/ARTIFACT_CONCEPT_V1.md`

FROZEN FILES:

- `docs/ART_02_IMPLEMENTATION_V1_REPORT.md`
- approved art bible and ritual docs

BLOCKED IF MISSING:

- implementation report
- any of the approved art source docs

### ART_KNOWLEDGE_REBUILD_V1

TASK:

- `ART_KNOWLEDGE_REBUILD_V1`

REQUIRED FILES:

- `docs/art/ART_INDEX_V1.md`
- `docs/ART_KNOWLEDGE_REBUILD_V1_REPORT.md`
- `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md`
- `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`
- `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md`
- `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`
- `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md.txt`

OPTIONAL FILES:

- `docs/art/TREASURE_ARCHETYPE_SYSTEM_V1.md`
- `docs/product/blessing_system/BLESSING_RESONANCE_MODEL_V1.md`
- `docs/product/relic_system/RELIC_CANON_V2.md`

FROZEN FILES:

- `docs/art/ART_INDEX_V1.md`
- `docs/ART_KNOWLEDGE_REBUILD_V1_REPORT.md`
- restored ART-03 visual chain files

BLOCKED IF MISSING:

- ART_INDEX_V1
- ART_KNOWLEDGE_REBUILD_V1_REPORT
- restored ART-03 visual chain files

## Content Task Mapping

### CH05_CONTENT_CANON_V1

TASK:

- `CH05_CONTENT_CANON_V1`

REQUIRED FILES:

- `docs/canon/LOVEQIGU_CANON_INDEX.md`
- `docs/world/LOVEQIGU_WORLD_BIBLE_V1.md`
- `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`
- `docs/content/CH04_CONTENT_CANON_V1.md`
- `docs/content/CH05_CONTENT_CANON_V1.md`

OPTIONAL FILES:

- `docs/content/CH04_FINAL_FREEZE_REPORT.md`
- `docs/content/CH04_LINK_AND_FREEZE_CREATE_REPORT.md`
- `docs/content/CH05_CONTENT_FILL_CREATE_REPORT.md`

FROZEN FILES:

- previous chapter canon files
- locked world bible references

BLOCKED IF MISSING:

- canon index
- world bible
- terminology source
- previous chapter canon

### CH05_LINK_AND_FREEZE

TASK:

- `CH05_LINK_AND_FREEZE`

REQUIRED FILES:

- `docs/content/CH05_CONTENT_CANON_V1.md`
- `docs/content/CH04_CONTENT_CANON_V1.md`
- `docs/content/CH05_CH06_LINKING_REPORT.md`
- `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`

OPTIONAL FILES:

- `docs/CH05_LINK_AND_FREEZE_REPORT.md`
- `docs/audit/RUNTIME_ALIGNMENT_REPORT.md`

FROZEN FILES:

- CH01-CH04 frozen content canon

BLOCKED IF MISSING:

- current chapter canon
- previous chapter canon
- linking report

### RC1_FINAL_USER_JOURNEY_VALIDATION

TASK:

- `RC1_FINAL_USER_JOURNEY_VALIDATION`

REQUIRED FILES:

- `docs/RC1_GAP_CLOSURE_IMPLEMENTATION_REPORT.md`
- `docs/RC1_GAP_CLOSURE_ANALYSIS.md`
- `docs/RC1_USER_JOURNEY_AUDIT_REPORT.md`
- `apps/miniapp/app.json`

OPTIONAL FILES:

- `docs/RC1_FINAL_USER_JOURNEY_VALIDATION_REPORT.md`
- `docs/LOVEQIGU_RC1_BASELINE.md`

FROZEN FILES:

- RC1 baseline documents
- route definitions that are part of the accepted journey

BLOCKED IF MISSING:

- gap closure implementation report
- app route registration

## Tech Task Mapping

### AUTOPILOT

TASK:

- `AUTOPILOT`

REQUIRED FILES:

- `docs/AUTOPILOT_IMPLEMENTATION_REPORT.md`
- `docs/ADMIN_AUTOPILOT_V1_REPORT.md`
- `docs/PROJECT_CONTEXT_MEMORY_V1.md`
- `docs/automation/LOVEQIGU_AUTOPILOT_V1_REPORT.md`

OPTIONAL FILES:

- `docs/AUTOPILOT_ACCEPTANCE_REPORT.md`
- `docs/AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md`
- `docs/audit/AUTOPILOT_V1_ACCEPTANCE_TEST_REPORT.md`

FROZEN FILES:

- approved autopilot reports
- validated sandbox checkpoints

BLOCKED IF MISSING:

- the implementation report
- the admin model report
- the context memory file itself

### LIVE_OPS_ENGINE_PIPELINE

TASK:

- `LIVE_OPS_ENGINE_PIPELINE`

REQUIRED FILES:

- `docs/LIVE_OPS_ENGINE_FOUNDATION_REPORT.md`
- `docs/LIVE_OPS_ENGINE_REVIEW_REPORT.md`
- `docs/LIVE_OPS_ENGINE_SIMULATION_REPORT.md`
- `docs/LIVE_OPS_ENGINE_FINAL_REVIEW_REPORT.md`

OPTIONAL FILES:

- `docs/LIVE_OPS_ENGINE_PIPELINE_REPORT.md`

FROZEN FILES:

- approved Live Ops docs

BLOCKED IF MISSING:

- any of the four approved Live Ops reports

### DUCTOR_GOVERNANCE_V2_COMPATIBILITY_FIX

TASK:

- `DUCTOR_GOVERNANCE_V2_COMPATIBILITY_FIX`

REQUIRED FILES:

- `scripts/ductor/run_content_engine_pipeline.js`
- `scripts/governance/check_content_engine.js`
- `docs/CONTENT_ENGINE_GOVERNANCE_V2_REPORT.md`
- `docs/CONTENT_ENGINE_PIPELINE_REPORT.md`

OPTIONAL FILES:

- `docs/DUCTOR_GOVERNANCE_V2_FIX_REPORT.md`

FROZEN FILES:

- governance V2 report contract
- Ductor pipeline report contract

BLOCKED IF MISSING:

- pipeline runner
- governance checker
- required reports

## Visual Autopilot Task Package

### PACKAGE_VISUAL_AUTOPILOT

TASK:

- `PACKAGE_VISUAL_AUTOPILOT`

LOAD CONDITIONS:

- Visual Generation
- Asset Production
- Visual Audit
- Visual Scoring
- Freeze Review

REQUIRED FILES:

- `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md`
- `docs/ART_BIBLE_V1.md`
- `docs/art/ART_INDEX_V1.md`
- `docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1_1.md`
- `docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md`
- `docs/art/ART_04_VISUAL_PROTOTYPE_V1.md.txt`

OPTIONAL FILES:

- `docs/ART_02_VISUAL_ASSET_SPEC_V1.md`
- `docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md`
- `docs/art/ART_03B_TREASURE_REVELATION_TEMPLATE_V1.md`
- `docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md`
- `docs/product/world/WORLD_CANON_INDEX_V1.md`
- `docs/product/world/LOVEQIGU_CORE_PHILOSOPHY_V1.md`
- `docs/product/world/LOVEQIGU_AXIOM_V1.md`

FROZEN FILES:

- `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md`
- `docs/ART_BIBLE_V1.md`
- approved ART-03 visual chain files referenced by the pipeline

BLOCKED IF MISSING:

- `docs/governance/VISUAL_AUTOPILOT_PIPELINE_V1.md`
- `docs/ART_BIBLE_V1.md`
- `docs/art/ART_INDEX_V1.md`

PIPELINE STAGES (L1–L6):

```text
L1 Prompt Generator
        ↓
L2 Multi-Model Generation
        ↓
L3 Visual Audit Engine
        ↓
L4 Visual Scoring Engine
        ↓
L5 Visual Registry
        ↓
L6 Freeze Gate
        ↓
Manual Approval
        ↓
Runtime
```

GOVERNANCE RULE:

Visual assets must never bypass Audit → Score → Freeze directly into Runtime.

## Readiness Output Format

When a task is checked, output the result in this structure:

```text
TASK: <task name>
OWNER: <owner id or team>
REQUIRED FILES:
- file
- file
OPTIONAL FILES:
- file
STATUS: READY | WARN | BLOCKED
```

## Missing File Handling

If a file is missing:

1. report the exact path
2. state whether it is required, optional, or frozen
3. explain the fallback
4. stop if the file is blocking

## Change Control

This memory document itself is part of project-level coordination.

If a future task changes terminology, Canon, or the architecture map, update this file only after the source-of-truth docs are updated first.

## Success Marker

`PROJECT_CONTEXT_MEMORY_V1_COMPLETE = YES`
