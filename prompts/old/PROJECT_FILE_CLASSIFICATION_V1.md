# PROJECT_FILE_CLASSIFICATION_V1

Objective

Classify all UNKNOWN files discovered by:

docs/PROJECT_FILE_INVENTORY_V1.md

Purpose:

Reduce UNKNOWN files and establish a reliable project knowledge base.

--------------------------------------------------
PART 1
LOAD INVENTORY
--------------------------------------------------

Read:

docs/PROJECT_FILE_INVENTORY_V1.md

docs/PROJECT_FILE_INVENTORY_REPORT.md

--------------------------------------------------
PART 2
CLASSIFICATION TARGETS
--------------------------------------------------

Process all files currently marked:

UNKNOWN

--------------------------------------------------
PART 3
CLASSIFICATION CATEGORIES
--------------------------------------------------

Assign one category:

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

ARCHIVE

TEMP

UNKNOWN

--------------------------------------------------
PART 4
HEURISTIC RULES
--------------------------------------------------

Use:

- filename
- directory
- extension
- content sampling (if required)

to determine classification.

Do not modify source files.

--------------------------------------------------
PART 5
DUPLICATE DETECTION
--------------------------------------------------

Identify:

- duplicate names
- multiple versions
- conflicting locations

Output warnings.

--------------------------------------------------
PART 6
FREEZE CANDIDATES
--------------------------------------------------

Identify likely:

FROZEN

ACTIVE

DRAFT

ARCHIVED

UNKNOWN

--------------------------------------------------
PART 7
CRITICAL FILE VALIDATION
--------------------------------------------------

Re-check:

WORLD_BIBLE

LOVEQIGU_TERMINOLOGY_FINAL

ART_BIBLE_V1

STAR_ACTIVATION_RITUAL_V1

RUNTIME_ALIGNMENT_REPORT

AUTOPILOT_IMPLEMENTATION_REPORT

ADMIN_AUTOPILOT_V1_REPORT

PROJECT_CONTEXT_MEMORY_V1

PROJECT_CONTEXT_REGISTRY_V1

PROJECT_CONTEXT_ROUTER_V1

Output:

FOUND

MISSING

CONFLICT

--------------------------------------------------
PART 8
OUTPUT
--------------------------------------------------

Generate:

docs/PROJECT_FILE_CLASSIFICATION_V1.md

Generate:

docs/PROJECT_FILE_CLASSIFICATION_REPORT.md

Include:

1. Total files
2. Classified files
3. Remaining UNKNOWN
4. Duplicate risks
5. Freeze candidates
6. Missing critical files
7. Recommended Registry scope

Success Marker:

PROJECT_FILE_CLASSIFICATION_V1_COMPLETE = YES