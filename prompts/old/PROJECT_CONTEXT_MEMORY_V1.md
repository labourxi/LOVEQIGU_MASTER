# PROJECT_CONTEXT_MEMORY_V1

Objective

Create a project-level context memory system.

Purpose:

Before any task executes,
automatically determine:

- which files must be loaded
- which files are frozen
- which files are optional
- which files block execution if missing

This system prevents loss of direction,
constraints, terminology and project identity.

--------------------------------------------------
PART 1
CREATE MEMORY SPECIFICATION
--------------------------------------------------

Create:

docs/PROJECT_CONTEXT_MEMORY_V1.md

Define:

Task

↓

Required Context Files

↓

Optional Context Files

↓

Blocked If Missing

--------------------------------------------------
PART 2
ART TASK MAPPING
--------------------------------------------------

Example:

ART_02_IMPLEMENTATION_V1

Required:

- ART_BIBLE_V1.md
- STAR_ACTIVATION_RITUAL_V1.md
- ART_02_VISUAL_ASSET_SPEC_V1.md
- LOVEQIGU_TERMINOLOGY_FINAL.md

Blocked if any required file is missing.

--------------------------------------------------
PART 3
CONTENT TASK MAPPING
--------------------------------------------------

Example:

CH11_CONTENT_CANON_V1

Required:

- CANON.md
- WORLD_BIBLE.md
- LOVEQIGU_TERMINOLOGY_FINAL.md
- Previous Chapter Canon

--------------------------------------------------
PART 4
TECH TASK MAPPING
--------------------------------------------------

Example:

AUTOPILOT

Required:

- AUTOPILOT_IMPLEMENTATION_REPORT.md
- ADMIN_AUTOPILOT_V1_REPORT.md
- PROJECT_CONTEXT_ROUTER_V1.md

--------------------------------------------------
PART 5
MEMORY VALIDATION RULES
--------------------------------------------------

Before execution:

Check:

1. Required files exist
2. Required files are readable
3. Frozen files are not modified
4. Version conflicts detected
5. Missing context detected

Output:

PASS

WARN

FAIL

--------------------------------------------------
PART 6
READINESS OUTPUT
--------------------------------------------------

Output format:

TASK:

ART_02_IMPLEMENTATION_V1

OWNER:

B

REQUIRED FILES:

- ART_BIBLE_V1.md
- STAR_ACTIVATION_RITUAL_V1.md
- ART_02_VISUAL_ASSET_SPEC_V1.md

STATUS:

READY

--------------------------------------------------
PART 7
REPORT
--------------------------------------------------

Generate:

docs/PROJECT_CONTEXT_MEMORY_V1_REPORT.md

Include:

1. Context loading model
2. Required file model
3. Validation model
4. Missing file handling
5. Readiness model

Success Marker:

PROJECT_CONTEXT_MEMORY_V1_COMPLETE = YES