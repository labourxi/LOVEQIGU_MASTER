# RC2 Acceptance Audit Report

Generated: 2026-06-07T23:00:00+08:00  
Baseline Reference: `docs/LOVEQIGU_RC1_BASELINE.md`, `docs/LOVEQIGU_RC1_BASELINE_REPORT.md`, `docs/RC1_FINAL_USER_JOURNEY_VALIDATION_REPORT.md`  
Scope: MiniApp Path A / B / C, Bridge Layer, Service Integrity, Governance, OMX

---

## Overall Status

**`PASS_WITH_WARNING`**

RC2 retains the RC1-validated user journey closure. All three paths are routable, navigable, and backed by local MiniApp bridge services. No release blockers were found in journey scope. Remaining warnings are limited to terminology transition debt, report-only Content Engine governed-field warnings, and one orphan page directory outside the registered route set.

---

## Path Validation

### Path A — PASS

Observed chain:

| Step | Route | Navigation Source | Service |
|---|---|---|---|
| 首页 | `/pages/index/index` | Entry | — |
| 探索地图 | `/pages/explore-map/index` | Home entries + hero CTA | `story-service`, `ar-service` |
| AR Entry | `/pages/ar-entry/index` | Explore Map `onOpenAr` | `ar-service`, `story-flow-service` |
| Atom | `/pages/atom/index` | AR Entry `onContinue` (explore context) | `atom-service` |
| Lottie | `/pages/lottie/index` | Atom card `onNavigate` | `lottie-service` |
| Echo | `/pages/echo/index` | Lottie card `onNavigate` | `echo-service` |
| Digital Collectible | `/pages/digital-collectible/index` | Echo card `onNavigate` | `digital-collectible-service` |
| Next Activity | `/pages/next-activity/index` | Digital Collectible card `onNavigate` | `next-activity-service` |

Checks:

- Route registered in `app.json` for every step.
- Navigation handoff exists at every step.
- Explore-mode AR Entry continues to Atom; closure paths in services align (`atom.next_path` → Lottie → Echo → Digital Collectible → Next Activity).
- No dead links found in Path A scope.

### Path B — PASS

Observed chain:

| Step | Route | Navigation Source | Service |
|---|---|---|---|
| 首页 | `/pages/index/index` | Entry | — |
| Story Archive | `/pages/story-archive/index` | Home entries | `story-service`, `story-flow-service` |
| Story Flow | `/pages/story-flow/index` | Story Archive `onOpenStoryFlow` | `story-flow-service` |
| AR Event | `/pages/ar-entry/index?context=story-flow&flowId=...` | Story Flow card `onNavigate` | `ar-service`, `story-flow-service` |
| Echo | `/pages/echo/index` | AR Entry `onContinue` (story-flow context) | `echo-service` |
| Digital Collectible | `/pages/digital-collectible/index` | Echo card `onNavigate` | `digital-collectible-service` |

Checks:

- Story Flow `closure_path` correctly targets AR Entry with `context=story-flow`.
- Story-flow AR Entry mode switches `actionPath` to Echo (skips Atom/Lottie by approved closure design).
- Echo and Digital Collectible handoffs match RC1 validation scope.
- Path B terminates at Digital Collectible as defined; Next Activity is not required on this path.

### Path C — PASS

Observed chain:

| Step | Route | Navigation Source | Service |
|---|---|---|---|
| 首页 | `/pages/index/index` | Entry | — |
| Rights Center | `/pages/rights-center/index` | Home entries | `rights-service`, `campaign-service` |
| Campaign Closure | `/pages/campaign-closure/index` | Rights Center `onOpenCampaignClosure` | `campaign-service` |
| Next Activity | `/pages/next-activity/index` | Campaign Closure card `onNavigate` | `next-activity-service` |

Checks:

- Route and navigation exist for every step.
- Campaign records expose `next_path: /pages/next-activity/index`.
- Live Ops campaign references remain within approved story-flow identifiers.

---

## Bridge Layer Status

**`PASS`**

### Page → Service Resolution

All page modules under `apps/miniapp/pages/` resolve services exclusively through `apps/miniapp/services/`:

| Page | Local Service Requires |
|---|---|
| `explore-map` | `story-service`, `ar-service` |
| `ar-entry` | `ar-service`, `story-flow-service` |
| `atom` | `atom-service` |
| `lottie` | `lottie-service` |
| `echo` | `echo-service` |
| `digital-collectible` | `digital-collectible-service` |
| `next-activity` | `next-activity-service` |
| `story-archive` | `story-service`, `story-flow-service` |
| `story-flow` | `story-flow-service` |
| `rights-center` | `rights-service`, `campaign-service` |
| `campaign-closure` | `campaign-service` |
| `relic-archive` | `relic-service`, `story-service` |

### External Require Audit

- No `../../../../services/` paths remain under `apps/miniapp`.
- No `../../../services/` paths remain under `apps/miniapp`.
- Pages do not directly require repository-root service modules.

### Syntax Verification

- `node --check` passed for all JavaScript files under `apps/miniapp`.

Reference: `docs/MINIAPP_ALL_SERVICE_BRIDGE_FIX_REPORT.md` — bridge fix posture confirmed still valid at RC2 audit time.

---

## Service Integrity

**`PASS`**

All RC2-required services exist, export callable functions, and return RC2 placeholder data:

| Service | Path | Key Exports | Status |
|---|---|---|---|
| `story-service` | `apps/miniapp/services/story/story-service.js` | `getAllChapters`, `getChapterById`, `getNodesByChapterId` | OK |
| `story-flow-service` | `apps/miniapp/services/story/story-flow-service.js` | `getAllStoryFlows`, `getStoryFlowById` | OK |
| `ar-service` | `apps/miniapp/services/ar/ar-service.js` | `getAllArEvents`, `getArEventById`, `getArEventByCode` | OK |
| `atom-service` | `apps/miniapp/services/atom/atom-service.js` | `getAllAtoms`, `getAtomById`, `getAtomByFlowRef` | OK |
| `lottie-service` | `apps/miniapp/services/lottie/lottie-service.js` | `getAllLotties`, `getLottieById` | OK |
| `echo-service` | `apps/miniapp/services/echo/echo-service.js` | `getAllEchoes`, `getEchoById` | OK |
| `digital-collectible-service` | `apps/miniapp/services/digital-collectible/digital-collectible-service.js` | `getAllDigitalCollectibles`, `getDigitalCollectibleById` | OK |
| `campaign-service` | `apps/miniapp/services/campaign/campaign-service.js` | `getAllCampaigns`, `getCampaignById` | OK |
| `next-activity-service` | `apps/miniapp/services/next-activity/next-activity-service.js` | `getAllNextActivities`, `getNextActivityById` | OK |

Supporting bridge services also present and callable:

- `rights-service` — used by Path C Rights Center
- `relic-service` — used by Relic Archive; exposes `getAssetBoundary()` enforcing Relic / Digital Collectible separation

---

## Governance Status

**`PASS_WITH_WARNING`**

### Asset Boundary (信物 / 数字藏品)

| Boundary | Audit Result |
|---|---|
| Relic = story progression asset | Maintained in `relic-service`, `relic-archive`, explore-map node refs |
| Digital Collectible = marketing / communication asset | Maintained in `digital-collectible-service` and page copy |
| Relic ≠ Digital Collectible | No cross-unlock logic; `getAssetBoundary()` explicitly states separation |
| Digital Collectible does not unlock Relics | Stated in `digital-collectible/index.js` intro |

### Content Engine

| Scope | FAIL | WARN | Status |
|---|---:|---:|---|
| V3 batch (`CONTENT_ENGINE/V3/**`) | 0 | 0 | PASS |
| Full repo scan (`CONTENT_ENGINE/**/*.yaml`) | 0 | 51 | WARN (report-only) |

Governed fields (`reward`, `wish_value`, `level`, `rarity`, `rank`) appear in legacy V1/V2 YAML under report-only mode. No FAIL issues. V3 batch content remains CH01-safe with zero warnings.

### Story Engine

- Local `story-service` and `story-flow-service` stay within CH01 chapter and approved flow identifiers.
- No new Canon, organizations, civilizations, or historical events introduced in MiniApp bridge data.

### Live Ops Engine

- `campaign-service` references approved `story_flow_ref` values aligned with Live Ops campaign templates.
- Campaign closure hands off to Next Activity without mixing Relic progression semantics.

### Terminology

- Forbidden legacy terms (打卡地图, 积分商城, 愿力, 归真, 回应, 祝由) not found in MiniApp scanned files.
- **Warning:** OMX `check-terminology` flags `权益中心` in `pages/index/index.js` against `T-TAB-003` (expected `结缘商城`). Language Constitution marks `权益中心` as transitional engineering name; RC1/RC2 Path C intentionally uses Rights Center surface. This is documentation/terminology migration debt, not a journey blocker.

---

## OMX Status

**`PASS_WITH_WARNING`**

Fresh OMX run at RC2 audit time (`node scripts/omx/run_omx_checks.js`):

| Check | Status | Notes |
|---|---|---|
| `check-json` | PASS | 19 JSON files scanned |
| `check-routes` | PASS | 14 registered pages; all required `.js/.json/.wxml/.wxss` present |
| `check-terminology` | **FAIL** | 1 violation: `权益中心` → expected `结缘商城` |
| `check-canon` | PASS | 61 MiniApp content files scanned |
| `check-content-engine-cursor` | PASS (WARN) | 0 FAIL, 51 WARN under report-only mode |

### Route Inventory (`app.json`)

Registered pages (14):

1. `pages/index/index`
2. `pages/explore-map/index`
3. `pages/ar-entry/index`
4. `pages/atom/index`
5. `pages/lottie/index`
6. `pages/echo/index`
7. `pages/digital-collectible/index`
8. `pages/campaign-closure/index`
9. `pages/next-activity/index`
10. `pages/story-flow/index`
11. `pages/relic-archive/index`
12. `pages/story-archive/index`
13. `pages/rights-center/index`
14. `pages/profile/index`

### Orphan / Unregistered Pages

| Path | Status |
|---|---|
| `pages/relics/` | Exists on disk but **not** registered in `app.json`; superseded by `pages/relic-archive/`. No live route reference found. |

No missing pages were found for Path A/B/C. No abnormal routes were found inside the validated journey chains.

---

## Cursor Audit Result

**`PASS_WITH_WARNING`**

| Metric | Value |
|---|---|
| YAML files scanned | 20 |
| FAIL issues | 0 |
| WARN issues | 51 |
| Governance mode | Report-only |
| V3 batch status | PASS (0 WARN) |

Cursor audit completes without FAIL issues. WARN items are governed-field presence in legacy Content Engine YAML and do not block RC2 journey acceptance under current governance posture.

---

## Remaining Risks

1. **Terminology migration** — `权益中心` remains in MiniApp UI while TERMINOLOGY V1 target is `结缘商城`; OMX terminology check fails until migration or checker exception is applied.
2. **Legacy Content Engine warnings** — 51 WARN items in V1/V2 YAML (`reward`, `wish_value`, `level`, etc.) remain in report-only mode; manual review required before content release hardening.
3. **Orphan page directory** — `pages/relics/` is unused legacy surface; should be removed or formally archived to avoid confusion.
4. **RC1 label residue** — Home chapter status still displays `RC1 状态`; cosmetic only, does not affect routing.
5. **Automation drift** — Prior OMX report snapshot showed 7 registered pages; current `app.json` has 14. Fresh OMX run confirms route integrity, but automation reports should be regenerated per release checkpoint.

---

## Release Recommendation

**Accept RC2 MiniApp acceptance with warnings.**

RC2 meets the RC1 baseline journey contract:

- Path A, B, and C are complete and navigable.
- MiniApp bridge layer is fully local; no repository-root service dependencies remain.
- All required services exist and are callable.
- Relic / Digital Collectible / Engine governance boundaries are intact.
- No FAIL-level Cursor or Content Engine V3 issues block release.

Warnings are consistent with RC1 `PASS_WITH_WARNING` posture and remain outside validated user journey closure scope. Recommended follow-ups before RC3 hardening:

1. Resolve `权益中心` → `结缘商城` terminology migration or document an RC2 exception.
2. Archive or remove `pages/relics/`.
3. Continue report-only Content Engine governed-field review before production content bind.

---

## Audit Summary

| Area | Result |
|---|---|
| Path A | PASS |
| Path B | PASS |
| Path C | PASS |
| Bridge Layer | PASS |
| Service Integrity | PASS |
| Governance | PASS_WITH_WARNING |
| OMX | PASS_WITH_WARNING |
| Cursor Audit | PASS_WITH_WARNING |
| **Overall** | **PASS_WITH_WARNING** |

`RC2_ACCEPTANCE_AUDIT_COMPLETE = YES`
