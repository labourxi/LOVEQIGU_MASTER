# PROJECT_FILE_INVENTORY_V1

Objective

Perform a repository-wide inventory scan.

Purpose:

Build the first authoritative inventory of all project files.

This inventory will become the foundation for:

- PROJECT_CONTEXT_REGISTRY_V1
- PROJECT_CONTEXT_MEMORY_V1
- PROJECT_CONTEXT_ROUTER_V1

--------------------------------------------------
PART 1
SCAN TARGETS
--------------------------------------------------

Scan all existing files under:

docs/

prompts/

data/

scripts/

apps/

governance/

runtime/

assets/

sandbox/

--------------------------------------------------
PART 2
FILE DISCOVERY
--------------------------------------------------

For every file found:

Record:

- filename
- relative path
- extension
- size
- last modified time

--------------------------------------------------
PART 3
FILE CLASSIFICATION
--------------------------------------------------

Classify:

CANON

WORLD_BIBLE

TERMINOLOGY

CHAPTER

ART

TECH

AUTOPILOT

GOVERNANCE

RUNTIME

ASSET

REPORT

UNKNOWN

--------------------------------------------------
PART 4
DUPLICATE DETECTION
--------------------------------------------------

Detect:

- duplicate filenames
- version conflicts
- similarly named files

Example:

ART_BIBLE_V1.md
ART_BIBLE_V2.md

Output warning.

--------------------------------------------------
PART 5
MISSING EXPECTED FILES
--------------------------------------------------

Compare inventory against known critical files.

Expected examples:

WORLD_BIBLE

LOVEQIGU_TERMINOLOGY_FINAL

ART_BIBLE_V1

STAR_ACTIVATION_RITUAL_V1

RUNTIME_ALIGNMENT_REPORT

AUTOPILOT_IMPLEMENTATION_REPORT

ADMIN_AUTOPILOT_V1_REPORT

PROJECT_CONTEXT_ROUTER_V1

PROJECT_CONTEXT_MEMORY_V1

PROJECT_CONTEXT_REGISTRY_V1

Report:

FOUND

MISSING

UNKNOWN

--------------------------------------------------
PART 6
FREEZE CANDIDATE DETECTION
--------------------------------------------------

Identify files likely to be:

FROZEN

ACTIVE

DRAFT

UNKNOWN

Do not modify files.

Inventory only.

--------------------------------------------------
PART 7
OUTPUT
--------------------------------------------------

Generate:

docs/PROJECT_FILE_INVENTORY_V1.md

Generate:

docs/PROJECT_FILE_INVENTORY_REPORT.md

Include:

1. File counts
2. Category counts
3. Missing critical files
4. Duplicate risks
5. Freeze candidates
6. Inventory summary

Success Marker:

PROJECT_FILE_INVENTORY_V1_COMPLETE = YES