# VISUAL_AUTOPILOT_EVALUATOR_V1

## 1. Objective

Define the Visual Evaluation Engine for VISUAL_AUTOPILOT_V3.

The Evaluator is responsible for:

- Scoring generated images
- Comparing multi-model outputs
- Selecting the best visual candidate
- Enforcing ART canon compliance

The Evaluator MUST NOT:

- Generate images
- Route models
- Call APIs
- Modify prompts

It ONLY evaluates.

---

## 2. Input

Input format:

{
  "task_id": "",
  "prompt": "",
  "candidates": [
    {
      "provider": "",
      "image_path": "",
      "metadata": {}
    }
  ]
}

---

## 3. Evaluation Dimensions

Each image is scored 010 on:

### Core Dimensions

- 东方感 (Eastern Atmosphere)
- 仪式感 (Ritual Feeling)
- 留白 (Negative Space)
- 古旧质感 (Ancient Texture)
- 四象一致性 (Four Symbol Consistency)

---

### Anti-pattern Detection

Penalty if present:

- Modern UI contamination
- Game UI / UI kit style
- SSR / reward system feel
- Bright gold / flashy effects
- Commercial advertising layout
- Western fantasy aesthetics

---

### Product Alignment

- Brand consistency
- Runtime usability
- Asset clarity

---

## 4. Scoring Model

Final Score:

0100

Formula:

- Core dimensions: 70%
- Anti-pattern penalty: -30%
- Brand alignment: +20%

---

## 5. Selection Rules

WINNER selection:

- Highest score
- No critical violations
- Passes canon rules

---

BACKUP selection:

- Second highest score
- Acceptable quality

---

REJECTED:

- Any critical violation
- Low coherence
- Broken composition

---

## 6. Canon Validation

Must validate against:

- ART_BIBLE_V1
- ART_03_VISUAL_PHILOSOPHY_V1
- FOUR_SYMBOL_VISUAL_SYSTEM_V1.1

---

## 7. Output Format

{
  "task_id": "",
  "winner": "",
  "backup": "",
  "rejected": [],
  "scores": {
    "provider": 0
  },
  "reasoning": ""
}

---

## 8. Freeze Gate Rule

Evaluator does NOT freeze assets.

It only marks:

- READY_FOR_FREEZE
- NOT_READY

Freeze decision is external.

---

## 9. Integration Role

Evaluator sits after:

Router  Generation  Candidate Pool

before:

Selection  Registry  Freeze

---

## 10. Future Evolution

V1: Rule-based scoring  
V2: Prompt-aware scoring  
V3: Style embedding scoring  
V4: Multi-model judge system  
V5: AI self-evaluating visual system  

---

Success Marker:

VISUAL_AUTOPILOT_EVALUATOR_V1_COMPLETE = YES
