# PROJECT_CONTEXT_PREFLIGHT_V1

Objective

Build an executable project preflight system.

Purpose:

Before any task executes:

Automatically determine:

- owner
- approver
- required files
- missing files
- frozen files
- dependency status
- execution readiness
- next owner

This system consumes:

- PROJECT_CONTEXT_REGISTRY_V1
- PROJECT_CONTEXT_MEMORY_V1
- PROJECT_CONTEXT_ROUTER_V1

--------------------------------------------------
PART 1
LOAD SOURCES
--------------------------------------------------

Read:

docs/PROJECT_CONTEXT_REGISTRY_V1.md

docs/PROJECT_CONTEXT_MEMORY_V1.md

docs/PROJECT_CONTEXT_ROUTER_V1.md

--------------------------------------------------
PART 2
PREFLIGHT INPUT
--------------------------------------------------

Input:

TASK_NAME

Example:

ART_02_IMPLEMENTATION_V1

CH11_CONTENT_CANON_V1

AUTOPILOT

--------------------------------------------------
PART 3
OWNER RESOLUTION
--------------------------------------------------

Resolve:

OWNER

APPROVER

NEXT_OWNER

--------------------------------------------------
PART 4
DEPENDENCY RESOLUTION
--------------------------------------------------

Resolve:

Required Files

Optional Files

Frozen Files

Missing Files

--------------------------------------------------
PART 5
STATUS ENGINE
--------------------------------------------------

Rules:

Missing required file
→ BLOCKED

Frozen file modification attempt
→ WARN

All dependencies satisfied
→ READY

--------------------------------------------------
PART 6
OUTPUT CONTRACT
--------------------------------------------------

Output:

TASK

OWNER

APPROVER

DEPENDENCIES

MISSING_FILES

FROZEN_FILES

STATUS

NEXT_OWNER

--------------------------------------------------
PART 7
EXAMPLE VALIDATION
--------------------------------------------------

Run examples:

ART_02_IMPLEMENTATION_V1

ART_02_ASSET_INTEGRATION_V1

ART_02_KEY_VISUAL_V1

AUTOPILOT

CH11_CONTENT_CANON_V1

--------------------------------------------------
PART 8
GENERATE EXECUTOR
--------------------------------------------------

Create:

scripts/governance/project_context_preflight.py

or

scripts/governance/project_context_preflight.js

The executor must read registry/router/memory files
and return readiness output.

--------------------------------------------------
PART 9
REPORT
--------------------------------------------------

Generate:

docs/PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md

Include:

1. Execution model
2. Status engine
3. Dependency engine
4. Example outputs
5. Remaining blockers

Success Marker:

PROJECT_CONTEXT_PREFLIGHT_V1_COMPLETE = YES