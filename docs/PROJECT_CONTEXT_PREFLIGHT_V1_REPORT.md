# PROJECT_CONTEXT_PREFLIGHT_V1_REPORT

## Execution Model

The preflight executor reads the registry, memory, and router docs, then resolves a task-specific spec.
It validates required files, optional files, frozen files, and any missing dependencies before execution.

## Status Engine

- `BLOCKED` when any required file is missing.
- `WARN` when a frozen dependency is unavailable for a task that depends on it.
- `READY` when all required files exist and no frozen dependency issue is present.

## Dependency Engine

The dependency engine resolves each task family from the registry/router/memory set and checks physical file presence in the repository.
ART tasks use the art bible, ritual, and visual spec; AUTOPILOT uses the approved autopilot reports; chapter canon tasks use the canon index, world bible, terminology, and the current/previous chapter files.

## Example Outputs

### ART_02_IMPLEMENTATION_V1
```text
TASK: ART_02_IMPLEMENTATION_V1
OWNER: C
REQUIRED FILES:
- docs/ART_BIBLE_V1.md
- docs/STAR_ACTIVATION_RITUAL_V1.md
- docs/ART_02_VISUAL_ASSET_SPEC_V1.md
- docs/language/LOVEQIGU_TERMINOLOGY_V1.md
- docs/ART-02_TECH_FEASIBILITY_REVIEW_V1.md
OPTIONAL FILES:
- docs/ARTIFACT_CONCEPT_V1.md
- docs/ART_02_IMPLEMENTATION_V1_REPORT.md
- docs/language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md
MISSING_FILES:
- None.
FROZEN_FILES:
- docs/ART_BIBLE_V1.md
- docs/STAR_ACTIVATION_RITUAL_V1.md
- docs/ART_02_VISUAL_ASSET_SPEC_V1.md
STATUS:
READY
NEXT_OWNER:
B
```

### ART_02_ASSET_INTEGRATION_V1
```text
TASK: ART_02_ASSET_INTEGRATION_V1
OWNER: C
REQUIRED FILES:
- ART_02_ASSET_PACKAGE_V1
OPTIONAL FILES:
- None.
MISSING_FILES:
- ART_02_ASSET_PACKAGE_V1
FROZEN_FILES:
- None.
STATUS:
BLOCKED
NEXT_OWNER:
B
```

### ART_02_KEY_VISUAL_V1
```text
TASK: ART_02_KEY_VISUAL_V1
OWNER: C
REQUIRED FILES:
- docs/ART_BIBLE_V1.md
- docs/language/LOVEQIGU_TERMINOLOGY_V1.md
OPTIONAL FILES:
- None.
MISSING_FILES:
- None.
FROZEN_FILES:
- docs/ART_BIBLE_V1.md
STATUS:
READY
NEXT_OWNER:
B
```

### AUTOPILOT
```text
TASK: AUTOPILOT
OWNER: B
REQUIRED FILES:
- docs/AUTOPILOT_IMPLEMENTATION_REPORT.md
- docs/ADMIN_AUTOPILOT_V1_REPORT.md
- docs/PROJECT_CONTEXT_MEMORY_V1.md
- docs/automation/LOVEQIGU_AUTOPILOT_V1_REPORT.md
OPTIONAL FILES:
- docs/AUTOPILOT_ACCEPTANCE_REPORT.md
- docs/AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md
- docs/audit/AUTOPILOT_V1_ACCEPTANCE_TEST_REPORT.md
MISSING_FILES:
- None.
FROZEN_FILES:
- docs/AUTOPILOT_IMPLEMENTATION_REPORT.md
- docs/ADMIN_AUTOPILOT_V1_REPORT.md
STATUS:
READY
NEXT_OWNER:
B
```

### CH11_CONTENT_CANON_V1
```text
TASK: CH11_CONTENT_CANON_V1
OWNER: C
REQUIRED FILES:
- docs/canon/LOVEQIGU_CANON_INDEX.md
- docs/world/LOVEQIGU_WORLD_BIBLE_V1.md
- docs/language/LOVEQIGU_TERMINOLOGY_V1.md
- docs/content/CH10_CONTENT_CANON_V1.md
- docs/content/CH11_CONTENT_CANON_V1.md
OPTIONAL FILES:
- None.
MISSING_FILES:
- docs/content/CH10_CONTENT_CANON_V1.md
- docs/content/CH11_CONTENT_CANON_V1.md
FROZEN_FILES:
- docs/content/CH10_CONTENT_CANON_V1.md
STATUS:
BLOCKED
NEXT_OWNER:
A
FROZEN_MISSING:
- docs/content/CH10_CONTENT_CANON_V1.md
```

## Remaining Blockers

- `ART_02_ASSET_PACKAGE_V1` is still absent for `ART_02_ASSET_INTEGRATION_V1`.
- `docs/content/CH10_CONTENT_CANON_V1.md` and `docs/content/CH11_CONTENT_CANON_V1.md` are absent, so the chapter 11 canon path remains blocked.
- `docs/language/LOVEQIGU_TERMINOLOGY_FINAL.md` remains a logical alias only; the authoritative live file is `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`.

`PROJECT_CONTEXT_PREFLIGHT_V1_COMPLETE = YES`