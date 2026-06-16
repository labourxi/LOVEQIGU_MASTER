# PROJECT_FILE_INVENTORY_REFRESH_V1

Objective

Refresh repository inventory and compare against the latest governance baseline.

Purpose

Detect:

- newly added files
- deleted files
- renamed files
- moved files
- dependency changes
- freeze status changes
- registry impact

Do not modify project files.

Inventory and analysis only.

--------------------------------------------------
PART 1
LOAD BASELINES
--------------------------------------------------

Read:

docs/PROJECT_FILE_INVENTORY_V1.md

docs/PROJECT_FILE_CLASSIFICATION_V1.md

docs/PROJECT_CONTEXT_REGISTRY_V1.md

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
CHANGE DETECTION
--------------------------------------------------

Detect:

NEW FILES

DELETED FILES

RENAMED FILES

MOVED FILES

--------------------------------------------------
PART 4
REGISTRY IMPACT
--------------------------------------------------

Determine:

Registry Impact

Memory Impact

Router Impact

Preflight Impact

--------------------------------------------------
PART 5
FREEZE ANALYSIS
--------------------------------------------------

Detect:

New Frozen Candidates

Removed Frozen Files

Modified Frozen Files

--------------------------------------------------
PART 6
DEPENDENCY ANALYSIS
--------------------------------------------------

Detect:

New Dependencies

Broken Dependencies

Missing Dependencies

--------------------------------------------------
PART 7
OUTPUT
--------------------------------------------------

Generate:

docs/PROJECT_FILE_INVENTORY_REFRESH_REPORT.md

Include:

1. New Files
2. Deleted Files
3. Renamed Files
4. Moved Files
5. Registry Impact
6. Memory Impact
7. Router Impact
8. Dependency Changes
9. Freeze Changes
10. Recommended Actions

Success Marker:

PROJECT_FILE_INVENTORY_REFRESH_COMPLETE = YES