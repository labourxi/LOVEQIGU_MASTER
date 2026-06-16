# PROJECT_FILE_INVENTORY_REFRESH_V3

Objective

Refresh repository inventory after the latest Canon Alignment work.

Purpose

Detect:

* newly added files
* deleted files
* modified files
* new frozen assets
* registry impact
* memory impact
* router impact

Additionally:

Run knowledge synchronization on newly added or modified:

* CANON
* BIBLE
* GOVERNANCE
* TERMINOLOGY
* ART
* PRODUCT

files.

---

PART 1

Load:

docs/PROJECT_FILE_INVENTORY_V1.md

docs/PROJECT_CONTEXT_REGISTRY_V1.md

docs/PROJECT_KNOWLEDGE_SYNC_REPORT.md

---

PART 2

Scan repository:

docs/
prompts/
data/
scripts/
apps/
governance/
assets/
runtime/

---

PART 3

Delta Analysis

Generate:

NEW FILES
DELETED FILES
MODIFIED FILES
NEW FROZEN FILES

---

PART 4

Knowledge Sync Delta

Read newly added or modified Canon/Bible/Governance files.

Extract:

Purpose
Core Rules
Frozen Constraints
Dependencies
Task Impact

---

PART 5

Governance Impact

Analyze:

Registry Impact
Memory Impact
Router Impact
Preflight Impact

---

PART 6

Output

docs/PROJECT_FILE_INVENTORY_REFRESH_V3_REPORT.md

Success Marker:

PROJECT_FILE_INVENTORY_REFRESH_V3_COMPLETE = YES
