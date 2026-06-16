# VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1

## 1. Objective

Define a human alignment layer for Visual Autopilot so human review can calibrate Gemini ranking outcomes over time.

This layer records:

- candidate identity
- Gemini score
- human score
- score delta
- review note

It also maintains preference memory so repeated human feedback can adjust future ranking preferences.

---

## 2. Scope

This layer applies to:

- candidate review queues
- human review history
- preference memory
- candidate ranking feedback

It does not alter generation or freeze rules directly.

---

## 3. Review Queue

The top 3 ranked candidates must be written to:

`assets/visual-autopilot/alignment/review_queue.json`

Queue items include:

```json
{
  "candidate": "candidate_A",
  "gemini_score": 44,
  "human_score": 10,
  "note": "古朴感强"
}
```

---

## 4. History Record

Human review writes to:

`assets/visual-autopilot/alignment/history.json`

Each record must include:

- candidate
- gemini_score
- human_score
- delta
- review_note

---

## 5. Preference Memory

The preference memory engine tracks long-term bias between Gemini and human judgment.

If Gemini repeatedly prefers traits that humans reject, those traits are written into:

`assets/visual-autopilot/alignment/preferences.json`

Structure:

```json
{
  "likes": [],
  "dislikes": [],
  "score_history": []
}
```

---

## 6. Usage Governance

Visual Autopilot usage must be tracked separately:

`assets/visual-autopilot/governance/usage.json`

This file tracks:

- total Seedream calls
- trial limit
- warning threshold
- critical threshold
- stop threshold

---

## 7. Validation

The alignment layer is ready when:

- top 3 candidates are queued
- human scores can be written
- history is generated
- preference summary is generated
- Gemini / human deltas are recorded

---

## 8. Success Marker

VISUAL_AUTOPILOT_HUMAN_ALIGNMENT_V1_COMPLETE = YES
