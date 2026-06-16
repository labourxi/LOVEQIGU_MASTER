# VISUAL_AUTOPILOT_V3_ARCHITECTURE_V1

## 1. Mission

Visual Autopilot V3 is a multi-model visual generation orchestration system.

Pipeline:

Prompt

Model Router

Multi Provider Generation
(OpenAI / Gemini / Wanxiang / Wenxin Yige / Seedream)

Candidate Pool

Visual Audit Engine

Visual Scoring Engine

Selection Engine

Asset Registry

Freeze Gate

Runtime (ONLY after freeze approval)

---

## 2. Provider Layer

Standard unified interface:

- generate()
- audit()
- metadata()

Providers:

- OpenAI
- Gemini
- Wanxiang (Alibaba Tongyi)
- Wenxin Yige (Baidu)
- Seedream (ByteDance)

All providers must output:

- image_path
- provider
- model
- prompt
- timestamp
- status
- error (if any)

---

## 3. Model Router

Routing strategy based on intent:

RITUAL_STYLE:
- OpenAI
- Gemini
- Seedream

COMMERCIAL_STYLE:
- Wanxiang
- Seedream

SCENIC_STYLE:
- Gemini
- Wenxin Yige

COLLECTIBLE_STYLE:
- OpenAI
- Seedream

Router output:
- selected providers list
- reasoning tag

---

## 4. Candidate Pool

Storage path:

assets/visual-autopilot/candidates/

Format:

{
  "task_id": "",
  "provider": "",
  "model": "",
  "prompt": "",
  "image_path": "",
  "timestamp": ""
}

---

## 5. Visual Audit Engine

Audit dimensions:

- 东方感
- 仪式感
- 留白
- 古旧质感
- 非游戏化
- 非商城化
- 四象一致性
- 品牌一致性

Score range: 010 per dimension

---

## 6. Selection Engine

Outputs:

- WINNER
- BACKUP
- REJECTED

Generates:

VISUAL_AUTOPILOT_SELECTION_REPORT.md

---

## 7. Freeze Gate

Rules:

- No asset can enter runtime without audit
- No asset can enter registry without selection
- No asset bypasses freeze gate

---

## 8. Future Evolution

V3  Multi-model orchestration
V4  Auto audit optimization
V5  Prompt evolution system
V6  Fully autonomous visual factory

---

Success Marker:

VISUAL_AUTOPILOT_V3_ARCHITECTURE_V1_COMPLETE = YES
