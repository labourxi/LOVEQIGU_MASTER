# VISUAL_AUTOPILOT_VARIATION_ENGINE_V1

## 1. Objective

Define a prompt variation engine for Visual Autopilot candidate generation.

The engine expands one base prompt into five distinct relic-oriented variants so the ranking pipeline can compare different visual directions instead of repeating the same prompt.

---

## 2. Scope

This engine generates five prompt variants:

- SCROLL_RELIC
- BRONZE_RELIC
- STONE_RELIC
- JADE_RELIC
- ASTRAL_RELIC

Each variant must remain within LOVEQIGU's relic and oriental visual language.

---

## 3. Output Contract

For each run, the engine must write prompt files to:

`assets/visual-autopilot/prompts/`

Required files:

- `candidate_A.txt`
- `candidate_B.txt`
- `candidate_C.txt`
- `candidate_D.txt`
- `candidate_E.txt`

Each file must contain one unique prompt variant.

---

## 4. Integration

The variation engine is consumed by the multi-candidate ranking runner.

Pipeline:

Base Prompt -> Variation Engine -> Five Prompt Files -> Seedream -> Five Candidates -> Gemini Judge -> Ranking -> Winner

---

## 5. Constraints

- No prompt duplication
- No new Canon
- No new organizations, gods, civilizations, or world rules
- No game UI language
- No commercial banner language

---

## 6. Validation

The implementation is considered ready when:

- five prompt files exist
- five candidate images are generated
- five Gemini reviews are completed
- ranking output is written
- winner is selected and copied

---

## 7. Success Marker

VISUAL_AUTOPILOT_VARIATION_ENGINE_V1_COMPLETE = YES
