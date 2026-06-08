# GIT_HYGIENE_AUDIT

Objective:

Resolve the final open issue in WORKFLOW_VALIDATION:

Git workspace hygiene.

Read first:

- docs/WORKFLOW_VALIDATION_REPORT.md
- docs/TERMINOLOGY_FIX_REPORT.md

Tasks:

1. Run:

git status

git diff --name-status

2. Produce a complete inventory of:

- Modified files
- Deleted files
- Untracked files

3. For every item classify as:

KEEP_CHANGE
KEEP_DELETED
RESTORE_FILE
GENERATED_FILE
TEMP_FILE
BACKUP_FILE

4. Special attention:

- apps/miniapp/assets/images/home-hero.png
- prompts/*
- docs/*
- governance/*
- scripts/omx/backups/*

5. Do NOT automatically restore.

6. Do NOT automatically delete.

7. Create:

docs/GIT_HYGIENE_AUDIT.md

Include:

- file path
- git status
- classification
- recommendation
- reasoning

8. Final assessment:

Can the repository safely proceed to a clean commit?

Output:

GIT_HYGIENE_AUDIT_COMPLETE = YES