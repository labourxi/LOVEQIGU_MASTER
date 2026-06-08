# TERMINOLOGY_FIX_AND_GIT_CLEANUP

Objective:

Resolve the two failures found in WORKFLOW_VALIDATION:

1. OMX terminology violation
2. Git workspace hygiene failure

Read first:

- docs/WORKFLOW_VALIDATION_REPORT.md
- docs/OMX_REPORT.md
- AGENTS.md
- docs/language/*

Tasks:

## Part A — Terminology Repair

Locate the terminology violation reported in:

apps/miniapp/pages/index/index.js

Identify the exact term triggering OMX.

Compare against:

- AGENTS.md
- LOVEQIGU_TERMINOLOGY_V1.md
- LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md

Determine whether:

A. the source file is wrong

or

B. the OMX checker dictionary is outdated

Apply the correct fix.

Do not guess.

Record reasoning.

---

## Part B — OMX Verification

Run:

node scripts/omx/run_omx_checks.js

Required result:

Checks run: 4
Passed: 4
Failed: 0
Violations: 0

---

## Part C — Git Hygiene

Inspect:

git status

Identify:

- modified files
- deleted files
- untracked files

Classify each item as:

VALID_CHANGE
TEMP_FILE
GENERATED_FILE
BACKUP_FILE

Do not delete project assets.

Create a Git hygiene report.

---

## Part D — Governance Report

Create:

docs/TERMINOLOGY_FIX_REPORT.md

Include:

- root cause
- file changed
- terminology decision
- OMX result
- Git hygiene result

---

## Final Validation

Run:

git status

node scripts/omx/run_omx_checks.js

Workflow passes only if:

- Git hygiene issue resolved
- OMX passes
- No terminology violations remain

Output:

TERMINOLOGY_FIX_COMPLETE = YES