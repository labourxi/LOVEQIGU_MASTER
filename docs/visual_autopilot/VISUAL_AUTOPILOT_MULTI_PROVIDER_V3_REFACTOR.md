# VISUAL_AUTOPILOT_MULTI_PROVIDER_V3_REFACTOR

## 1. Objective

Refactor VISUAL_AUTOPILOT_V3 into a multi-provider orchestration model with clear role separation.

This refactor removes Gemini from the Generator role and repositions it as a prompt and visual judgment layer.

---

## 2. Role Reassignment

### Gemini

Role:

- Prompt Architect
- Prompt Optimizer
- Visual Judge

Gemini MUST NOT be treated as a primary image generator in V3.

---

### Seedream

Role:

- Primary Generator

Use cases:

- Final production assets
- High-consistency visual generation
- Canon-sensitive visual output

---

### Wanxiang

Role:

- Secondary Generator

Use cases:

- Commercial style generation
- Backup production generation
- Alternative composition exploration

---

### OpenAI

Role:

- Optional Generator

Use cases:

- Auxiliary generation
- Style contrast
- Fallback candidate production

---

## 3. New Pipeline

The updated VISUAL_AUTOPILOT_V3 flow is:

Prompt Architect
-> Multi Generator
-> Candidate Pool
-> Visual Audit
-> Gemini Judge
-> Winner Selection
-> Freeze

---

## 4. Stage Definitions

### 4.1 Prompt Architect

Responsibilities:

- Interpret task intent
- Rewrite prompt for generation quality
- Produce provider-specific prompt variants

Output:

- optimized prompt package

---

### 4.2 Multi Generator

Responsibilities:

- Execute Seedream as primary generator
- Execute Wanxiang as secondary generator
- Execute OpenAI as optional generator

Output:

- multiple candidate assets

---

### 4.3 Candidate Pool

Responsibilities:

- store all generated candidates
- preserve provider attribution
- preserve prompt lineage

Output:

- candidate set for audit and review

---

### 4.4 Visual Audit

Responsibilities:

- check canon alignment
- check style contamination
- check anti-patterns

Output:

- pass / warn / fail classification

---

### 4.5 Gemini Judge

Responsibilities:

- compare candidate quality
- optimize prompt variants
- judge visual coherence
- select evaluation preference

Gemini participates as judge, not generator.

Output:

- ranking guidance
- judge notes

---

### 4.6 Winner Selection

Responsibilities:

- choose final winner
- choose backup candidate
- reject unsuitable candidates

Output:

- winner
- backup
- rejected list

---

### 4.7 Freeze

Responsibilities:

- freeze approved asset
- register frozen asset
- prepare runtime handoff

Output:

- frozen asset record

---

## 5. Full Flow Diagram

Prompt Architect
-> Multi Generator
-> Candidate Pool
-> Visual Audit
-> Gemini Judge
-> Winner Selection
-> Freeze

Detailed view:

Task
-> Prompt Architect
-> Seedream / Wanxiang / OpenAI generation
-> Candidate Pool
-> Visual Audit
-> Gemini Judge
-> Selection Engine
-> Freeze Gate
-> Asset Registry
-> Runtime Approval

---

## 6. Operational Rules

- Gemini is excluded from generation routing.
- Seedream is the default primary generator.
- Wanxiang is the secondary generator.
- OpenAI is optional and used only when beneficial.
- Gemini acts only after candidates exist.
- No asset may bypass audit, judge, selection, or freeze.

---

## 7. Governance Impact

This refactor changes the interpretation of VISUAL_AUTOPILOT_V3:

- from multi-model generation competition with Gemini included as a generator
- to multi-provider generation with Gemini serving as architect and judge

This improves role clarity and reduces ambiguity in provider routing.

---

## 8. Success Criteria

The refactor is complete when:

- Gemini is no longer routed as a generator
- Seedream is primary generation provider
- Wanxiang is secondary generation provider
- OpenAI remains optional
- Gemini is used for prompt optimization and visual judgment

---

Success Marker:

VISUAL_AUTOPILOT_MULTI_PROVIDER_V3_REFACTOR_COMPLETE = YES
