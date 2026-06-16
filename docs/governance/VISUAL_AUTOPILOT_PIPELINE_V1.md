# VISUAL_AUTOPILOT_PIPELINE_V1

Status:

PROPOSED

Owner:

TECH

Related:

ART_BIBLE_V1

ART_INDEX_V1

FOUR_SYMBOL_VISUAL_SYSTEM_V1.1

ART_03_VISUAL_PHILOSOPHY_V1

ART_04_VISUAL_PROTOTYPE_V1

---

## Objective

Build the first generation automated visual asset pipeline for LOVEQIGU.

Purpose:

Reduce manual review workload.

Increase visual consistency.

Ensure all generated visual assets comply with:

* ART Bible
* Four Symbol Visual System
* Product Canon
* World Canon

before entering Runtime.

---

# Architecture

Visual Autopilot consists of:

L1 Prompt Generator

L2 Multi-Model Generation

L3 Visual Audit Engine

L4 Visual Scoring Engine

L5 Visual Registry

L6 Freeze Gate

---

# L1 Prompt Generator

Input:

* Canon
* Visual System
* Asset Request

Output:

* ChatGPT Prompt
* Gemini Prompt
* Doubao Prompt

Requirements:

* Same intent
* Same constraints
* Model-specific optimization

---

# L2 Multi-Model Generation

Generate:

Candidate_A

Candidate_B

Candidate_C

Sources:

* ChatGPT
* Gemini
* Doubao

Output Format:

PNG

WEBP

JPG

---

# L3 Visual Audit Engine

Audit Against:

ART_BIBLE_V1

FOUR_SYMBOL_VISUAL_SYSTEM_V1.1

ART_03_VISUAL_PHILOSOPHY_V1

Check:

* Modern UI contamination
* Mobile game contamination
* SSR contamination
* Five-point star contamination
* Bright gold contamination
* E-commerce contamination
* Western fantasy contamination

Result:

PASS

WARN

FAIL

---

# L4 Visual Scoring Engine

Score Dimensions

1. Eastern Atmosphere

2. Ritual Feeling

3. Blank Space

4. Ancient Texture

5. Revelation Feeling

6. Four Symbol Consistency

7. Runtime Feasibility

Score Range:

0-100

Acceptance:

PASS >= 90

REVIEW 80-89

FAIL < 80

---

# L5 Visual Registry

Store:

Asset ID

Prompt

Model

Generation Time

Score

Audit Result

Version

Related Canon

Storage:

docs/art/assets/

reports/art/

---

# L6 Freeze Gate

Freeze Conditions

Rule A

Three consecutive scores:

> = 90

Rule B

No Canon Violation

Rule C

No Audit Failure

Result:

READY_FOR_FREEZE

---

# Runtime Integration

Do NOT directly publish assets.

Flow:

Generate

↓

Audit

↓

Score

↓

Registry

↓

Freeze

↓

Manual Approval

↓

Runtime

---

# Codex Responsibilities

* Registry generation
* Audit report generation
* Asset metadata generation
* Version tracking

---

# Cursor Responsibilities

* Asset file management
* Batch execution
* Pipeline execution
* Freeze package generation

---

# Governance Rules

Visual assets must never bypass:

Audit

Score

Freeze

directly into Runtime.

All Runtime assets must have:

Audit Record

Score Record

Freeze Record

---

# Future Versions

V1

Prompt → Audit → Score → Archive

V2

Prompt → Audit → Score → Registry → Freeze

V3

Multi-model automatic comparison

V4

Fully automated visual production pipeline

---

Success Marker

VISUAL_AUTOPILOT_PIPELINE_V1_READY = YES
