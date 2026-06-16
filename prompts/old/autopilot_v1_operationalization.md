# AUTOPILOT_V1_OPERATIONALIZATION

Objective:

Upgrade LOVEQIGU_AUTOPILOT_V1 from acceptance-proven mode into an operational production-ready workflow.

Current confirmed state:

- LOVEQIGU_RUNTIME_READY = YES
- LOVEQIGU_AUTOPILOT_V1_READY = YES
- LOVEQIGU_AUTOPILOT_V1_PROVEN = YES
- AUTOPILOT_V1_ACCEPTANCE_TEST_COMPLETE = YES

Read first:

- docs/AUTOPILOT_IMPLEMENTATION_REPORT.md
- docs/AUTOPILOT_ACCEPTANCE_REPORT.md
- docs/audit/AUTOPILOT_V1_ACCEPTANCE_TEST_REPORT.md
- LOVEQIGU_AUTOPILOT_V1_ARCHITECTURE.md
- AUTOPILOT_ARCHITECTURE_REPORT.md

Goal:

Create the operational entrypoint for future chapter automation.

Pipeline:

Canon
→ Placeholder
→ Placeholder Audit
→ Fill
→ Content Audit
→ DC Registration
→ Link
→ Freeze

Tasks:

## 1. Create Operational Runner

Create:

scripts/autopilot/run_autopilot_v1.py

It should support:

- validate
- dry-run
- run
- freeze

Arguments:

--chapter
--mode
--sandbox
--no-write
--report

Examples:

python scripts/autopilot/run_autopilot_v1.py validate --chapter CH04 --no-write
python scripts/autopilot/run_autopilot_v1.py dry-run --chapter CH04 --sandbox
python scripts/autopilot/run_autopilot_v1.py run --chapter CH04 --sandbox
python scripts/autopilot/run_autopilot_v1.py freeze --chapter CH04 --sandbox

Important:

Do not actually create CH04 content.
Do not modify Canon.
Do not modify CH01–CH03 frozen content.
Do not modify data/* story content unless sandbox mode is used.

## 2. Create Operational Config

Create:

autopilot/autopilot_v1.config.json

Include:

- pipeline steps
- gate definitions
- report paths
- frozen chapters list
- allowed sandbox root
- blocked paths
- required validation commands

Frozen chapters:

- CH01
- CH02
- CH03

Blocked paths:

- docs/canon/*
- data/story/chapters.json
- data/relics/relics.json
- data/rights/rights.json
- data/ar/ar-events.json

Sandbox root:

sandbox/autopilot/

## 3. Create Ductor Wrapper

Create:

scripts/ductor/run_autopilot_v1.js

Purpose:

- Call the Python runner
- Pass chapter and mode arguments
- Capture stdout/stderr
- Write execution report

Do not require interactive Ductor onboarding.
Use repo-local execution only.

## 4. Create OMX/Governance Gate

Create:

scripts/autopilot/autopilot_v1_gate.py

It should check:

- frozen chapters unchanged
- Canon unchanged
- blocked paths unchanged
- OMX check passes
- report exists
- no CH04 production content created during dry-run

## 5. Create Reports

Create:

docs/AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md

Include:

- files created
- commands tested
- gate results
- Ductor wrapper result
- warnings
- next operational command

## 6. Validation Commands

Run:

python -m py_compile scripts/autopilot/run_autopilot_v1.py
python -m py_compile scripts/autopilot/autopilot_v1_gate.py
node scripts/ductor/run_autopilot_v1.js --chapter CH04 --mode dry-run --sandbox
python scripts/autopilot/autopilot_v1_gate.py --chapter CH04 --mode dry-run

Expected:

- Python compile PASS
- Ductor wrapper PASS
- Gate PASS
- Canon unchanged
- CH01–CH03 unchanged
- No production CH04 created
- Sandbox report generated

Output:

LOVEQIGU_AUTOPILOT_V1_OPERATIONAL = YES
AUTOPILOT_V1_OPERATIONALIZATION_COMPLETE = YES