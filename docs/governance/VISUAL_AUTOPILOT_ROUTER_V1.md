# VISUAL_AUTOPILOT_ROUTER_V1

## 1. Objective

Define the routing intelligence layer for VISUAL_AUTOPILOT_V3.

The Router is responsible for:

- Task classification
- Model selection
- Multi-provider orchestration
- Cost control
- Reliability control

The Router MUST NOT:

- Generate images directly
- Call APIs directly
- Score images
- Audit images

The Router ONLY decides:

Which providers should participate.

---

## 2. Router Input

Input:

{
  "task_id": "",
  "task_type": "",
  "prompt": "",
  "priority": "",
  "budget_level": "",
  "canon_reference": []
}

---

## 3. Task Types

Supported task types:

RITUAL_STYLE

COMMERCIAL_STYLE

SCENIC_STYLE

COLLECTIBLE_STYLE

BRAND_STYLE

CONCEPT_ART

MARKETING_POSTER

AR_ASSET

UI_VISUAL

---

## 4. Provider Routing Matrix

### RITUAL_STYLE

Primary:

- OpenAI
- Gemini
- Seedream

Reason:

- Ritual atmosphere
- Eastern aesthetics
- Symbolic consistency

---

### COMMERCIAL_STYLE

Primary:

- Wanxiang
- Seedream

Reason:

- Commercial design
- Advertising material
- Marketing graphics

---

### SCENIC_STYLE

Primary:

- Gemini
- Wenxin Yige

Reason:

- Landscape understanding
- Scenic storytelling

---

### COLLECTIBLE_STYLE

Primary:

- OpenAI
- Seedream

Reason:

- Asset consistency
- Product-quality output

---

### BRAND_STYLE

Primary:

- OpenAI
- Seedream
- Wanxiang

Reason:

- Brand identity
- Visual consistency

---

## 5. Routing Modes

### SINGLE_PROVIDER

One provider only.

Use when:

- Cost sensitive
- Quick iteration

---

### DUAL_PROVIDER

Two providers.

Use when:

- Prompt optimization
- Comparative review

---

### MULTI_PROVIDER

Three or more providers.

Use when:

- Final production
- Canon verification
- Freeze candidates

---

## 6. Health Check Integration

Before routing:

Check provider status.

Available:

- AVAILABLE

Unavailable:

- DISABLED

Router MUST exclude unavailable providers.

---

## 7. Budget Control

LOW

Use:

- Gemini
- Wenxin Yige

---

MEDIUM

Use:

- Gemini
- Wanxiang
- Seedream

---

HIGH

Use:

- OpenAI
- Gemini
- Seedream
- Wanxiang

---

## 8. Canon Integration

Router MUST load:

- ART_BIBLE_V1
- ART_03_VISUAL_PHILOSOPHY_V1
- FOUR_SYMBOL_VISUAL_SYSTEM_V1.1
- VISUAL_AUTOPILOT_V3_ARCHITECTURE_V1

before routing.

---

## 9. Router Output

Output:

{
  "selected_providers": [],
  "routing_reason": "",
  "routing_mode": "",
  "budget_level": "",
  "task_type": ""
}

---

## 10. Future Evolution

V1

Rule-based routing



V2

Capability-aware routing



V3

Performance-aware routing



V4

AI-driven dynamic routing



V5

Self-optimizing visual orchestration

---

Success Marker:

VISUAL_AUTOPILOT_ROUTER_V1_COMPLETE = YES
