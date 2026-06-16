# PROJECT_CONTEXT_ROUTER_V1

Objective

Build the final project routing layer.

This router must consume:

- docs/PROJECT_CONTEXT_REGISTRY_V1.md
- docs/PROJECT_CONTEXT_MEMORY_V1.md

Purpose:

Given a task name:

Determine:

- Owner
- Required Files
- Frozen Dependencies
- Missing Dependencies
- Execution Readiness
- Next Session

--------------------------------------------------
PART 1
LOAD SOURCES
--------------------------------------------------

Read:

docs/PROJECT_CONTEXT_REGISTRY_V1.md

docs/PROJECT_CONTEXT_MEMORY_V1.md

--------------------------------------------------
PART 2
TASK ROUTING MODEL
--------------------------------------------------

Supported Sessions:

A = PRODUCT

B = TECH

C = ART

For each task:

Output:

OWNER

APPROVER

DEPENDENCIES

NEXT_OWNER

--------------------------------------------------
PART 3
PREFLIGHT MODEL
--------------------------------------------------

Before execution:

Check:

Required Files

Frozen Files

Missing Files

Dependency Files

Output:

READY

WARN

BLOCKED

--------------------------------------------------
PART 4
TASK EXAMPLES
--------------------------------------------------

ART_02_IMPLEMENTATION_V1

Owner:

B

Dependencies:

ART_BIBLE_V1

STAR_ACTIVATION_RITUAL_V1

ART_02_VISUAL_ASSET_SPEC_V1

--------------------------------------------------

ART_02_ASSET_INTEGRATION_V1

Owner:

B

Blocked By:

ART_02_ASSET_PACKAGE_V1

--------------------------------------------------

ART_02_KEY_VISUAL_V1

Owner:

C

--------------------------------------------------

CH11_CONTENT_CANON_V1

Owner:

A

Dependencies:

WORLD_BIBLE

TERMINOLOGY

PREVIOUS_CHAPTER

--------------------------------------------------
PART 5
MISSING FILE WARNING
--------------------------------------------------

If required file missing:

Output:

BLOCKED

Reason:

Missing File

--------------------------------------------------
PART 6
FROZEN FILE WARNING
--------------------------------------------------

If task attempts modification of:

FROZEN

Output:

WARN

Impact

Affected Tasks

--------------------------------------------------
PART 7
NEXT OWNER MODEL
--------------------------------------------------

Every task result must output:

NEXT_OWNER

Values:

A

B

C

NONE

--------------------------------------------------
PART 8
ROUTER REPORT
--------------------------------------------------

Generate:

docs/PROJECT_CONTEXT_ROUTER_V1.md

Generate:

docs/PROJECT_CONTEXT_ROUTER_V1_REPORT.md

Include:

1. Routing model
2. Session ownership
3. Preflight model
4. Missing file model
5. Frozen file model
6. Next owner model
7. Readiness examples

Success Marker:

PROJECT_CONTEXT_ROUTER_V1_COMPLETE = YES