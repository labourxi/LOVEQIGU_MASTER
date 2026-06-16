# VISUAL_AUTOPILOT_PIPELINE_INTEGRATION_V1

## 1. Objective

Integrate all VISUAL_AUTOPILOT_V3 components into a complete end-to-end visual production pipeline.

This document defines:

- Execution sequence
- Module interactions
- Input/output contracts
- Governance checkpoints
- Freeze integration

This is the operational blueprint of VISUAL_AUTOPILOT_V3.

---

## 2. Pipeline Overview

Pipeline:

Visual Task

Prompt Package

Router

Provider Generation

Candidate Pool

Visual Audit

Visual Evaluation

Selection Engine

Freeze Gate

Asset Registry

Runtime Approval

---

## 3. Stage 1  Task Intake

Input:

{
  "task_id": "",
  "task_type": "",
  "prompt": "",
  "priority": "",
  "budget_level": "",
  "canon_reference": []
}

Output:

TASK_ACCEPTED

---

## 4. Stage 2  Router

Load:

- VISUAL_AUTOPILOT_ROUTER_V1
- Provider Registry
- Provider Health Status

Output:

{
  "selected_providers": [],
  "routing_mode": "",
  "routing_reason": ""
}

---

## 5. Stage 3  Provider Generation

Execute:

- OpenAIProvider
- GeminiProvider
- WanxiangProvider
- WenxinYigeProvider
- SeedreamProvider

according to Router output.

Output:

Candidate Images

Metadata

Generation Report

Failures

---

## 6. Stage 4  Candidate Pool

Store:

assets/visual-autopilot/candidates/

Metadata:

candidate_metadata.json

Requirements:

- No overwrite
- Full traceability
- Provider attribution required

---

## 7. Stage 5  Visual Audit

Load:

- ART_BIBLE_V1
- ART_03_VISUAL_PHILOSOPHY_V1
- FOUR_SYMBOL_VISUAL_SYSTEM_V1.1

Check:

- Canon violations
- Anti-patterns
- Style contamination

Output:

PASS

WARN

FAIL

---

## 8. Stage 6  Visual Evaluation

Execute:

VISUAL_AUTOPILOT_EVALUATOR_V1

Output:

Scores

Reasoning

Ready Status

---

## 9. Stage 7  Selection Engine

Execute:

VISUAL_AUTOPILOT_SELECTION_ENGINE_V1

Output:

WINNER

BACKUP

REJECTED

Selection Report

---

## 10. Stage 8  Freeze Gate

Conditions:

- Audit PASS
- Evaluation PASS
- Winner Selected

Result:

READY_FOR_FREEZE

or

NOT_READY

---

## 11. Stage 9  Asset Registry

Register:

Asset ID

Provider

Prompt

Score

Winner Status

Freeze Status

Storage Path

Version

---

## 12. Stage 10  Runtime Approval

Runtime is NOT automatic.

Human approval required.

Flow:

Registry

Manual Review

Runtime

---

## 13. Failure Handling

Provider Failure



Retry



Alternative Provider



Re-route

---

No provider failure may terminate the whole pipeline.

---

## 14. Governance Requirements

All assets must have:

- Generation Record
- Audit Record
- Evaluation Record
- Selection Record
- Freeze Record

No asset may bypass governance.

---

## 15. Success Metrics

Track:

- Generation Success Rate
- Provider Reliability
- Audit Pass Rate
- Freeze Pass Rate
- Runtime Adoption Rate

---

## 16. Future Evolution

V1

Integrated Workflow



V2

Automated Freeze Recommendations



V3

Prompt Evolution Loop



V4

Autonomous Asset Production



V5

Self-Optimizing Visual Factory

---

Success Marker:

VISUAL_AUTOPILOT_PIPELINE_INTEGRATION_V1_COMPLETE = YES
