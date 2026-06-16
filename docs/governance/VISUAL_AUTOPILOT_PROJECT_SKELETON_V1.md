# VISUAL_AUTOPILOT_PROJECT_SKELETON_V1

## Objective

Create the initial runnable project skeleton for VISUAL_AUTOPILOT_V3.

This phase creates:

- directory structure
- module skeletons
- interfaces
- execution entrypoints

No real provider integration yet.

No API calls yet.

No runtime deployment yet.

Purpose:

Prepare implementation-ready code architecture.

---

## Directory Structure

Create:

scripts/visual_autopilot/

 main.py

 config.py

 visual_types.py

 pipeline.py

 executor.py

 router.py

 evaluator.py

 audit_engine.py

 selection_engine.py



 providers/

    base.py

    openai.py

    gemini.py

    wanxiang.py

    wenxin_yige.py

    seedream.py



 storage/

    candidate_store.py

    registry_store.py



 tests/

     test_router.py

     test_evaluator.py

     test_pipeline.py

---

## Base Provider Interface

Create:

providers/base.py

Define:

class BaseProvider

Methods:

- generate()
- health_check()
- capabilities()

Raise:

NotImplementedError

---

## Router Skeleton

Create:

router.py

Define:

class VisualRouter

Methods:

- select_providers()
- route_task()

No routing logic yet.

---

## Evaluator Skeleton

Create:

evaluator.py

Define:

class VisualEvaluator

Methods:

- evaluate()
- score()

Return placeholder structure only.

---

## Audit Engine Skeleton

Create:

audit_engine.py

Define:

class AuditEngine

Methods:

- run_audit()
- detect_violations()

Return placeholder structure only.

---

## Selection Engine Skeleton

Create:

selection_engine.py

Define:

class SelectionEngine

Methods:

- select_winner()
- select_backup()

Return placeholder structure only.

---

## Pipeline Skeleton

Create:

pipeline.py

Define:

class VisualPipeline

Stages:

- route
- generate
- audit
- evaluate
- select
- freeze

No provider execution yet.

---

## Executor Skeleton

Create:

executor.py

Define:

run_pipeline()

Load task.

Execute VisualPipeline.

---

## Storage Skeleton

candidate_store.py

Functions:

- save_candidate()
- load_candidates()

registry_store.py

Functions:

- register_asset()
- query_asset()

---

## Main Entry

Create:

main.py

Support:

python main.py

Print:

VISUAL_AUTOPILOT_V3_SKELETON_READY

---

## Configuration

Create:

config.py

Create placeholders for:

- providers
- routing
- budgets
- retries

No secrets.

No API keys.

---

## Test Files

Create:

tests/

Include placeholder tests.

No real implementation.

---

## Deliverables

Generate:

docs/VISUAL_AUTOPILOT_PROJECT_SKELETON_V1_REPORT.md

Include:

- created directories
- created files
- missing items
- readiness assessment

---

Success Marker:

VISUAL_AUTOPILOT_PROJECT_SKELETON_V1_COMPLETE = YES
