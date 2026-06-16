# VISUAL_AUTOPILOT_GOVERNANCE_V1

## 1. Objective

Define governance rules for VISUAL_AUTOPILOT_V3.

Purpose:

- Control cost
- Control quality
- Control provider usage
- Control prompt evolution
- Control asset freeze process
- Ensure long-term maintainability

---

## 2. Governance Scope

Governance applies to:

- Router
- Providers
- Candidate Pool
- Audit Engine
- Evaluator
- Selection Engine
- Freeze Gate
- Asset Registry

---

## 3. Provider Governance

Registered Providers:

- OpenAI
- Gemini
- Wanxiang
- Wenxin Yige
- Seedream

Requirements:

All providers must:

- implement BaseProvider
- support health check
- provide structured errors
- return metadata

No direct provider calls allowed outside Router.

---

## 4. Provider Health Management

Provider States:

ACTIVE

DEGRADED

DISABLED

BLOCKED

Rules:

ACTIVE
= normal operation

DEGRADED
= limited routing

DISABLED
= excluded from routing

BLOCKED
= governance intervention required

---

## 5. Cost Governance

Budget Levels:

LOW

MEDIUM

HIGH

Provider Cost Profiles:

OpenAI
= HIGH

Gemini
= LOW

Wanxiang
= LOW

Wenxin Yige
= LOW

Seedream
= MEDIUM

Router must respect budget policy.

---

## 6. Quota Governance

Track:

- Daily Calls
- Weekly Calls
- Monthly Calls

Per Provider.

Generate:

PROVIDER_QUOTA_REPORT

If quota exceeds threshold:

Provider Status  DEGRADED

---

## 7. Prompt Governance

Every prompt must have:

Prompt ID

Version

Task Type

Creation Time

Author

Canon References

Storage:

assets/visual-autopilot/prompts/

Format:

PROMPT_<TASK_ID>_Vx.json

---

## 8. Prompt Evolution Governance

Prompt changes must create:

New Version

Example:

PROMPT_ART04_V1

PROMPT_ART04_V2

PROMPT_ART04_V3

No overwrite allowed.

---

## 9. Evaluation Governance

Minimum Acceptance Score:

80

Freeze Recommendation:

90+

Below 80:

REJECTED

---

## 10. Winner Governance

Winner asset requires:

Audit PASS

Evaluation PASS

Selection PASS

Before Freeze Gate.

---

## 11. Freeze Governance

Freeze Conditions:

- Audit PASS
- Score >= 90
- Winner Selected

Output:

READY_FOR_FREEZE

or

NOT_READY

---

## 12. Registry Governance

All assets must register:

Asset ID

Provider

Prompt Version

Score

Winner Status

Freeze Status

Timestamp

Storage Path

---

## 13. Runtime Governance

Runtime Entry Requirements:

Audit Record

Evaluation Record

Selection Report

Freeze Record

No asset may enter Runtime directly.

---

## 14. Audit Trail

All pipeline stages must generate logs:

Generation Log

Audit Log

Evaluation Log

Selection Log

Freeze Log

Registry Log

Retention:

Permanent

---

## 15. Risk Governance

Critical Risks:

- API Failure
- Provider Outage
- Billing Exhaustion
- Prompt Drift
- Canon Drift

Mitigation:

- Multi-provider routing
- Backup provider
- Freeze review
- Canon validation

---

## 16. Governance KPIs

Track:

Generation Success Rate

Audit Pass Rate

Evaluation Pass Rate

Freeze Pass Rate

Runtime Adoption Rate

Provider Reliability

Prompt Reuse Rate

Cost Per Asset

---

## 17. Governance Evolution

V1

Rule-Based Governance



V2

Policy-Aware Governance



V3

Adaptive Governance



V4

AI Governance Assistant



V5

Autonomous Governance Layer

---

Success Marker:

VISUAL_AUTOPILOT_GOVERNANCE_V1_COMPLETE = YES
