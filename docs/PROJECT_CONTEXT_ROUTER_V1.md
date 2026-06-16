# PROJECT_CONTEXT_ROUTER_V1

## Purpose

This document defines the final project routing layer.

It consumes:

- [docs/PROJECT_CONTEXT_REGISTRY_V1.md](./PROJECT_CONTEXT_REGISTRY_V1.md)
- [docs/PROJECT_CONTEXT_MEMORY_V1.md](./PROJECT_CONTEXT_MEMORY_V1.md)

Given a task name, it determines:

- owner
- approver
- dependencies
- missing dependencies
- frozen dependencies
- execution readiness
- next owner

## Session Ownership

- `A` = Product
- `B` = Tech
- `C` = Art / Content

### Owner Mapping

| Task Family | Owner | Approver | Next Owner |
|---|---|---|---|
| Product flow, UX, release readiness | A | A | B or C depending on implementation target |
| Technical routing, scripts, runtime, registry, memory | B | B | A or C depending on follow-up scope |
| ART bible, ritual, visual asset work | C | C | B for implementation, C for content refinement |
| Content canon and chapter content | C | C | B for tooling, C for chapter drafting |
| Mixed tasks with frozen dependencies | Determined by dominant implementation layer | Matching owner | The next session that can resolve the remaining blocker |

## Routing Model

The router treats every task as a structured request:

1. Resolve the task family
2. Load the registry
3. Load the memory map
4. Resolve required files
5. Resolve frozen files
6. Resolve missing dependencies
7. Compute readiness
8. Emit next owner

## Preflight Model

Before execution, the router checks:

- required files
- frozen files
- missing files
- dependency files

### Preflight Output

- `READY`
- `WARN`
- `BLOCKED`

### Preflight Rules

1. If any required file is missing, the result is `BLOCKED`.
2. If a task would modify a frozen file, the result is `WARN`.
3. If all required files exist and no frozen-file modification is requested, the result is `READY`.
4. If the task depends on an open conflict that can be safely bypassed, the result is `WARN`.

## Missing File Model

If a required file is missing:

- output `BLOCKED`
- list the exact missing file
- explain why it is required
- do not invent a fallback unless the memory document explicitly provides one

## Frozen File Model

If a task attempts to modify a frozen file:

- output `WARN`
- identify the affected task family
- list the impacted frozen files
- advise read-only treatment unless the source-of-truth doc has been updated first

## Next Owner Model

Every router result must output:

- `A`
- `B`
- `C`
- `NONE`

### Next Owner Logic

- If the task is blocked by missing product decisions, next owner is `A`
- If the task is blocked by implementation or tooling, next owner is `B`
- If the task is blocked by art or content generation, next owner is `C`
- If no follow-up is required, next owner is `NONE`

## Task Routing Examples

### ART_02_IMPLEMENTATION_V1

- OWNER: `C`
- APPROVER: `C`
- DEPENDENCIES: `ART_BIBLE_V1`, `STAR_ACTIVATION_RITUAL_V1`, `ART_02_VISUAL_ASSET_SPEC_V1`
- NEXT_OWNER: `B`
- STATUS: `READY` when the three art source docs exist and are readable

### ART_02_ASSET_INTEGRATION_V1

- OWNER: `C`
- APPROVER: `C`
- DEPENDENCIES: `ART_02_ASSET_PACKAGE_V1`
- NEXT_OWNER: `B`
- STATUS: `BLOCKED` if the asset package is missing

### ART_02_KEY_VISUAL_V1

- OWNER: `C`
- APPROVER: `C`
- DEPENDENCIES: none beyond the art bible and terminology
- NEXT_OWNER: `B`
- STATUS: `READY` when the key visual brief is present

### CH11_CONTENT_CANON_V1

- OWNER: `C`
- APPROVER: `C`
- DEPENDENCIES: `WORLD_BIBLE`, `TERMINOLOGY`, `PREVIOUS_CHAPTER`
- NEXT_OWNER: `B`
- STATUS: `BLOCKED` until the required canon sources exist

## Readiness Examples

### Example 1

TASK: `ART_02_IMPLEMENTATION_V1`

OWNER: `C`

APPROVER: `C`

DEPENDENCIES:

- `ART_BIBLE_V1`
- `STAR_ACTIVATION_RITUAL_V1`
- `ART_02_VISUAL_ASSET_SPEC_V1`

PRECHECK: `READY`

NEXT_OWNER: `B`

### Example 2

TASK: `CH11_CONTENT_CANON_V1`

OWNER: `C`

APPROVER: `C`

DEPENDENCIES:

- `WORLD_BIBLE`
- `TERMINOLOGY`
- `PREVIOUS_CHAPTER`

PRECHECK: `BLOCKED`

REASON: `Missing File`

NEXT_OWNER: `A`

### Example 3

TASK: `AUTOPILOT`

OWNER: `B`

APPROVER: `B`

DEPENDENCIES:

- `GOVERNANCE`
- `OMX`
- `DUCTOR`

PRECHECK: `READY` when governance and runtime preconditions are satisfied

NEXT_OWNER: `B`

## Router Contract

The router should emit a compact routing record:

```text
TASK:
  name
OWNER:
  A | B | C
APPROVER:
  A | B | C
DEPENDENCIES:
  - file
  - file
MISSING_DEPENDENCIES:
  - file
FROZEN_DEPENDENCIES:
  - file
STATUS:
  READY | WARN | BLOCKED
NEXT_OWNER:
  A | B | C | NONE
```

## Success Marker

`PROJECT_CONTEXT_ROUTER_V1_COMPLETE = YES`
