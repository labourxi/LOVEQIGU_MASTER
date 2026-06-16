# PROJECT_FILE_INVENTORY_REFRESH_V2

Objective

Perform a delta inventory refresh against the latest repository state.

Purpose

Compare current repository state against:

- PROJECT_FILE_INVENTORY_V1
- PROJECT_FILE_CLASSIFICATION_V1
- PROJECT_CONTEXT_REGISTRY_V1
- Previous PROJECT_FILE_INVENTORY_REFRESH_REPORT

Detect only incremental changes since the last refresh.

--------------------------------------------------
PART 1
LOAD BASELINES
--------------------------------------------------

Read:

docs/PROJECT_FILE_INVENTORY_V1.md

docs/PROJECT_FILE_CLASSIFICATION_V1.md

docs/PROJECT_CONTEXT_REGISTRY_V1.md

docs/PROJECT_FILE_INVENTORY_REFRESH_REPORT.md

--------------------------------------------------
PART 2
SCAN REPOSITORY
--------------------------------------------------

Scan:

docs/

prompts/

data/

scripts/

apps/

governance/

runtime/

assets/

--------------------------------------------------
PART 3
DELTA ANALYSIS
--------------------------------------------------

Detect:

NEW FILES

DELETED FILES

RENAMED FILES

MOVED FILES

MODIFIED FROZEN FILES

--------------------------------------------------
PART 4
GOVERNANCE IMPACT
--------------------------------------------------

Analyze:

Registry Impact

Memory Impact

Router Impact

Preflight Impact

--------------------------------------------------
PART 5
TASK IMPACT
--------------------------------------------------

Determine whether any existing task becomes:

READY

WARN

BLOCKED

due to repository changes.

--------------------------------------------------
PART 6
OUTPUT
--------------------------------------------------

Generate:

docs/PROJECT_FILE_INVENTORY_REFRESH_V2_REPORT.md

Include:

1. Delta Summary
2. New Files
3. Deleted Files
4. Registry Impact
5. Dependency Impact
6. Frozen File Changes
7. Task Readiness Changes
8. Recommended Actions

Success Marker:

PROJECT_FILE_INVENTORY_REFRESH_V2_COMPLETE = YES