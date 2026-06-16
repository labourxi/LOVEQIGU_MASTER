# VISUAL_AUTOPILOT_COST_CONTROL_V1

## Objective

Define cost control system for VISUAL_AUTOPILOT_V3.

Purpose:

- Prevent uncontrolled API spending
- Optimize provider selection based on cost
- Ensure sustainable multi-model generation
- Enforce budget constraints per task

---

## 1. Cost Governance Scope

Applies to:

- Router
- Provider Layer
- Pipeline Executor
- Selection Engine

---

## 2. Cost Categories

### 2.1 Per Image Cost

Each provider must define:

- cost_per_image
- cost_variance
- peak_cost_multiplier

---

### 2.2 Task Budget

Each task must define:

- budget_level: LOW / MEDIUM / HIGH / PRODUCTION

---

### 2.3 Monthly Budget Cap

System-wide limit per provider:

- OpenAI
- Gemini
- Wanxiang
- Wenxin Yige
- Seedream

---

## 3. Budget Levels

### LOW

Use:

- Gemini
- Wenxin Yige

Goal:

- Fast iteration
- Low cost
- High volume

---

### MEDIUM

Use:

- Gemini
- Wanxiang
- Seedream

Goal:

- Balanced quality and cost

---

### HIGH

Use:

- OpenAI
- Gemini
- Seedream
- Wanxiang

Goal:

- Production quality

---

### PRODUCTION

Use:

- All available providers

Goal:

- Maximum quality selection
- Multi-model competition

---

## 4. Routing Cost Rules

Router MUST:

- avoid OpenAI for LOW tasks
- prefer low-cost providers when quality gap < threshold
- enforce fallback chain if budget exceeded

---

## 5. Cost Calculation Model

Each task cost:

TOTAL_COST =
Σ(provider_image_cost  usage_count)

Include:

- retries
- failed attempts (optional tracking)
- fallback generation

---

## 6. Budget Enforcement Rules

If budget exceeded:

- block provider selection
- downgrade routing mode
- switch to LOW-cost providers

---

## 7. Provider Cost Ranking

From low  high:

1. Wenxin Yige
2. Gemini
3. Wanxiang
4. Seedream
5. OpenAI

---

## 8. Cost Optimization Strategy

System MUST:

- avoid redundant generation
- reuse candidates where possible
- minimize multi-provider calls for LOW tasks

---

## 9. Logging Requirements

Log per task:

- provider usage
- cost estimation
- actual cost
- budget remaining

---

## 10. Integration Points

Cost Control integrates with:

- Router
- Pipeline Executor
- Selection Engine
- Registry

---

## 11. Failure Mode

If cost system fails:

Default to:

- Gemini only
- SINGLE_PROVIDER mode

---

## 12. Future Evolution

V1  static cost rules  
V2  dynamic cost prediction  
V3  cost-aware routing AI  
V4  self-optimizing budget system  
V5  fully autonomous cost governance layer  

---

Success Marker:

VISUAL_AUTOPILOT_COST_CONTROL_V1_COMPLETE = YES
