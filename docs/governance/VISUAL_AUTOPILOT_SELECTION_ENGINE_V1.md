# VISUAL_AUTOPILOT_SELECTION_ENGINE_V1

## 1. Objective

Define the final decision layer of VISUAL_AUTOPILOT_V3.

This module is responsible for:

- Selecting final winner from evaluated candidates
- Determining backup assets
- Rejecting unsuitable outputs
- Preparing assets for freeze and registry

It is the FINAL decision layer before Freeze Gate.

---

## 2. Input

Input comes from:

VISUAL_AUTOPILOT_EVALUATOR_V1

Format:

{
  "task_id": "",
  "winner_candidates": [],
  "scores": {},
  "evaluation_report": {},
  "violations": []
}

---

## 3. Selection Rules

### Rule 1: Highest Score Wins

Primary selection is highest scoring candidate.

---

### Rule 2: Canon Compliance Override

Any asset violating Canon is automatically rejected:

- ART_BIBLE_V1
- ART_03_VISUAL_PHILOSOPHY_V1
- FOUR_SYMBOL_VISUAL_SYSTEM_V1.1

---

### Rule 3: Stability Preference

If scores are close (<5 difference):

Prefer:

- Seedream
- OpenAI
- Gemini
in that priority order

---

### Rule 4: Diversity Rule

If multiple providers produce similar score:

Ensure:

- Winner and Backup come from different providers

---

## 4. Output Structure

{
  "task_id": "",
  "winner": {
    "provider": "",
    "image_path": "",
    "score": 0
  },
  "backup": {
    "provider": "",
    "image_path": "",
    "score": 0
  },
  "rejected": [
    {
      "provider": "",
      "reason": ""
    }
  ],
  "final_reasoning": ""
}

---

## 5. Integration Position

Pipeline order:

Router

Generation

Candidate Pool

Evaluator

Selection Engine

Freeze Gate

Registry

Runtime

---

## 6. Freeze Gate Interaction

Selection Engine does NOT freeze assets.

It ONLY:

- Selects winner
- Marks backup
- Rejects invalid outputs

Freeze decision happens AFTER this module.

---

## 7. Conflict Resolution

If all candidates fail:

Return:

NO_VALID_ASSET

and trigger:

- Prompt regeneration request
- or Router re-execution

---

## 8. Safety Rules

Selection Engine MUST NOT:

- Modify images
- Call models
- Re-run generation
- Bypass evaluator

---

## 9. Future Evolution

V1: Rule-based selection  
V2: Score-weighted selection  
V3: Learning-based selection  
V4: Preference-aware selection  
V5: Fully autonomous visual decision system  

---

Success Marker:

VISUAL_AUTOPILOT_SELECTION_ENGINE_V1_COMPLETE = YES
