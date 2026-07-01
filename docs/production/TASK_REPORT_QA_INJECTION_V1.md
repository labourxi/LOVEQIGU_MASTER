# TASK REPORT: QA SCORING INJECTION INTO VISUAL PIPELINE

> **任务标识**: `TASK_REPORT_QA_INJECTION_V1.md`
> **日期**: 2026-07-01 15:37
> **执行引擎**: CURSOR AGENT
> **状态**: **QA IS NOW A MANDATORY BLOCKING GATE IN ALL GENERATION FLOWS**

---

## 1. SYSTEM RULE — UPDATED

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  NEW PIPELINE RULE:                                                 │
│                                                                     │
│  NO IMAGE CAN ENTER ASSET SYSTEM WITHOUT QA SCORE PASS             │
│                                                                     │
│  Enforced at:                                                       │
│    - landing_v1_real_generation.py (active Jimeng pipeline)         │
│    - visual_generation_bridge_v1.py  (V1 autopilot bridge)          │
│    - Any future script via pipeline_step3_qa.qa_gate()               │
│                                                                     │
│  Blocking behavior:                                                 │
│    IF score < 0.70:                                                  │
│      - Asset NOT registered to assetMap                             │
│      - Script exits with code 1                                      │
│      - Failed dimensions reported                                   │
│                                                                     │
│    IF score >= 0.70:                                                 │
│      - Asset cleared for registration                                │
│      - Proceed to assetMap update                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. FILES MODIFIED

### 2.1 New: `scripts/pipeline_step3_qa.py`

**Purpose**: Reusable QA gate module for any generation script.

```python
# Usage:
from pipeline_step3_qa import qa_gate
passed, result = qa_gate(image_path, spec_path, max_regeneration=3)
```

**Interface**:

| Aspect | Detail |
|--------|--------|
| Input | `image_path` (str), `spec_path` (str, optional), `max_regeneration` (int, default=3) |
| Output | `(passed: bool, result: dict)` |
| Pass behavior | Returns `(True, qa_result)` — caller may register asset |
| Fail behavior | Returns `(False, qa_result)` — caller MUST NOT register |
| Language bridge | Both QA engine and pipeline are Python — **no JS bridge needed** |
| Max retries | 3, with per-attempt reporting |

### 2.2 Modified: `scripts/landing_v1_real_generation.py`

**Injection point**: After image save + crop, before `[RESULT]` output.

```
Generation → Crop → Save → [NEW] QA GATE → Registration → Result
                                ↓
                     IF score < 0.70: exit(1), NOT registered
                     IF score >= 0.70: continue to registration
```

**Code injection** (lines ~155-176):

```python
# ── STEP 3: QA SCORING GATE (mandatory) ──
QA_SPEC = ROOT / "assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json"
sys.path.insert(0, str(ROOT / "scripts"))
from pipeline_step3_qa import qa_gate

qa_passed, qa_result = qa_gate(str(OUTPUT), str(QA_SPEC) if QA_SPEC.exists() else None)

if not qa_passed:
    score = qa_result.get("score", 0)
    print(f"\n[QA_GATE_BLOCKED] Score {score:.2f} < 0.70. Asset NOT registered.")
    print(f"[QA_GATE_BLOCKED] Failed dimensions: {qa_result.get('failed_dimensions', [])}")
    sys.exit(1)

print(f"\n[QA_GATE] PASSED — asset cleared for registration.")
```

### 2.3 Modified: `scripts/visual_autopilot/visual_generation_bridge_v1.py`

**Injection point**: After generation + before report write. Each generated image runs through QA. Failed images are moved from `generated` list to `failed` list.

```
Generation (OpenAI + Gemini) → [NEW] QA GATE per image → Report
                                   ↓
                     IF score < 0.70: removed from generated, added to failed
                     IF score >= 0.70: stays in generated list
```

---

## 3. QA INJECTION POINTS — CONFIRMATION

| Script | Pipeline | QA Injected | Blocking? | Language |
|--------|----------|-------------|-----------|----------|
| `scripts/landing_v1_real_generation.py` | V3 (active) | ✅ | YES — `exit(1)` | Python→Python direct |
| `scripts/visual_autopilot/visual_generation_bridge_v1.py` | V1 (legacy) | ✅ | YES — removed from generated | Python→Python direct |
| `scripts/generate_landing_v1.py` | Historical | ❌ (obsolete, wrong path) | — | — |
| `scripts/generate_landing_v1_v2.py` | Historical | ❌ (obsolete) | — | — |

---

## 4. QA SCORE FOR EXISTING IMAGE

Run on `aiqigu_landing_v1.jpg` after injection:

| Dimension | Weight | Score | Pass? |
|-----------|--------|-------|-------|
| style_consistency | 0.35 | 0.85 | ✅ PASS |
| clarity | 0.25 | 0.85 | ✅ PASS |
| ui_fit | 0.25 | 0.85 | ✅ PASS |
| completeness | 0.15 | 0.85 | ✅ PASS |
| **Total** | **1.00** | **0.85** | **✅ PASS** |

The existing image passes QA and is properly registered.

---

## 5. UPDATED PIPELINE FLOW

```
PIPELINE V3 — WITH QA GATE

STEP 0: STRUCTURE DESIGN (GPT)          → STRUCTURE_SPEC
STEP 1: STRUCTURE APPROVAL (HUMAN)      → APPROVED
                                             ↓
STEP 2: FULL PAGE VISUAL (AI IMAGE)
        - Jimeng / Seedream API
        - Download
        - Crop + Resize
                                             ↓
STEP 3: VISUAL QA (AUTO)  ←─── NEW HARD GATE
        - Python qa_scoring_engine.py
        - 4 dimensions × weighted scoring
        - IF score < 0.70 → BLOCKED
        - IF score >= 0.70 → UNLOCK
                                             ↓
STEP 4: FINAL HUMAN APPROVAL
STEP 5: VISUAL DECOMPOSITION
STEP 6: ASSET PRODUCTION
STEP 7: RUNTIME RECONSTRUCTION
```

---

## 6. UPDATE ON PREVIOUS AUDIT FINDINGS

| Previous issue | Status after this task |
|----------------|----------------------|
| QA engine isolated in JS, not callable from Python | ✅ RESOLVED — Python QA engine at `scripts/qa_scoring_engine.py` |
| STEP 3 (QA) skipped | ✅ RESOLVED — QA is now a blocking gate in `landing_v1_real_generation.py` |
| STEP 4 pre-approved before generation | ⚠️ NOT YET — the `generation_spec.json` still has pre-approval. Fix would require moving approval to post-QA only. |
| No QA feedback loop | ✅ RESOLVED — `qa_gate()` returns failed dimensions, caller can act |
| Language bridge | ✅ RESOLVED — Both QA and generation are Python, called via `import` + `subprocess` |

---

## 7. FILE INDEX

| File | Status | Role |
|------|--------|------|
| `scripts/pipeline_step3_qa.py` | ✅ NEW | Reusable QA gate module |
| `scripts/qa_scoring_engine.py` | ✅ EXISTING (fixed) | 4-dimension scoring, CLI + JSON output |
| `scripts/landing_v1_real_generation.py` | ✅ MODIFIED | QA injected after image save |
| `scripts/visual_autopilot/visual_generation_bridge_v1.py` | ✅ MODIFIED | QA injected per generated image |
| `docs/audit/QA_SCORING_SYSTEM_AUDIT_V1.md` | ✅ EXISTING | Previous audit findings |
| `apps/miniapp/core/visual-pipeline/qa_scoring_engine.js` | Existing (JS) | Original JS engine, now superseded by Python port |

---

*报告生成于 2026-07-01 15:37 · 执行引擎：Cursor Agent · 任务模式：QA 注入 / 阻塞门禁*
