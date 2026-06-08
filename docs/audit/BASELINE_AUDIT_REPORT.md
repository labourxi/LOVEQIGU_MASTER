# BASELINE_AUDIT_REPORT

**Mission:** 44｜BASELINE_AUDIT  
**Repository:** LOVEQIGU_MASTER V1  
**Generated:** 2026-06-08T12:05:00+08:00  
**Commit ID:** `63f9a7797373a6874098074c43fd822e3a769239`  
**Commit Message:** LOVEQIGU_MASTER Initial Foundation  
**Commit Date:** 2026-06-07 06:34:49 +0800  
**Audit Mode:** Read-only · No data mutation · No new chapters / relics / rights / AR records

**Upstream:** [`LOVEQIGU_CONTENT_CANON_V1.md`](../content/LOVEQIGU_CONTENT_CANON_V1.md)

---

## Overall Status

**`PASS_WITH_WARNING`**

## Baseline Ready

**`NO`**

---

## Executive Summary

CH01 four-layer JSON (`Story` / `Relic` / `Rights` / `AR`) is **complete and cross-consistent** against Content Canon V1. Root services load the data layer successfully. Automation (`OMX`, `Ductor`, `Codex CLI`) is **executable** with report-only warnings.

Baseline freeze is **blocked** by Git hygiene: the worktree is not clean, the entire `data/` layer is untracked at HEAD, and a large RC2/MiniApp/engine surface remains uncommitted.

---

## Audit Matrix

| Area | Status | Notes |
|------|--------|-------|
| Story Layer JSON | **PASS** | 1 chapter · 5 nodes · `LOVEQIGU_CONTENT_CANON_V1` source |
| Relic Layer JSON | **PASS** | 6 relics · no forbidden rank/rarity fields |
| Rights Layer JSON | **PASS** | 5 rights · all CH01 relic refs present |
| AR Event Layer JSON | **PASS** | 6 events · all nodes bound · all events have relic_refs |
| Cross-Reference Integrity | **PASS** | 0 issues · 0 warnings |
| Content Canon Compliance | **PASS** | CH01 only · no extra chapter · asset boundaries intact |
| Root Service Load | **PASS** | `story` 1 · `relic` 6 · `ar` 6 · `rights` 5 |
| Git Hygiene | **FAIL** | Dirty worktree · `data/` untracked at HEAD |
| OMX | **PASS_WITH_WARNING** | 5/5 checks passed · 1 repo warning |
| Ductor Pipelines | **PASS_WITH_WARNING** | 3/3 pipelines executable · warning posture |
| Codex CLI | **PASS** | `codex-cli 0.137.0` |

---

## 1. Four-Layer JSON Audit

### 1.1 File Inventory

| Layer | Path | Schema | Records |
|-------|------|--------|--------:|
| Story | `data/story/chapters.json` | `loveqigu.story.chapters.v1` | 1 chapter / 5 nodes |
| Relic | `data/relics/relics.json` | `loveqigu.relics.v1` | 6 relics |
| Rights | `data/rights/rights.json` | `loveqigu.rights.v1` | 5 rights |
| AR Event | `data/ar/ar-events.json` | `loveqigu.ar.events.v1` | 6 events |

All four files parse as **legal JSON**.

### 1.2 Story Layer

| Check | Result |
|-------|--------|
| Single chapter `ch01_cloud_awakening` | PASS |
| Title `云间初醒` | PASS |
| Five-awareness structure (`total: 5`) | PASS |
| `next_chapter: TBD` | PASS |
| `completion.completion_mark: 初醒印记` | PASS |
| Every node has non-empty `relic_refs` | PASS |
| Every node has `ar_event_refs` populated | PASS |
| Source `LOVEQIGU_CONTENT_CANON_V1` | PASS |

### 1.3 Relic Layer

| Check | Result |
|-------|--------|
| All chapter `relic_refs` resolve | PASS |
| No orphan relic records | PASS |
| Relic `node_id` matches Story node | PASS |
| `asset_class: story_progression` on all relics | PASS |
| No `rarity` / `level` / `grade` / `rank` / `tier` fields | PASS |
| `relic_ch01_zhujin_imprint` present (n4 sync) | PASS |

### 1.4 Rights Layer

| Check | Result |
|-------|--------|
| `relic_refs_all` matches full relic inventory (6) | PASS |
| Each right includes all 6 relic refs | PASS |
| L1 commercial layer · ritual isolation stated | PASS |
| No Lore expansion in descriptions | PASS |

### 1.5 AR Event Layer

| Check | Result |
|-------|--------|
| All events bound to Story nodes | PASS |
| All events listed in node `ar_event_refs` | PASS |
| Every event has ≥1 `relic_ref` | PASS |
| `ar_zhujin_guide_v1` → `n4_zhuyou` → `relic_ch01_zhujin_imprint` | PASS |
| `ar_zhujin_guide_v1` `rights_refs` empty | PASS |
| `ar_zhujin_guide_v1` `digital_collectible_refs` empty | PASS |

### 1.6 Node ↔ Event ↔ Relic Matrix

| Node | AR Event(s) | Relic(s) |
|------|-------------|----------|
| `n1_gate` | `ar_gate_open_v1`, `ar_imprint_particles_v1` | `relic_ch01_gate_badge`, `relic_ch01_cloud_gate_imprint_a` |
| `n2_plaza` | `ar_plaza_awareness_v1` | `relic_ch01_plaza` |
| `n3_cafe` | `ar_cafe_human_field_v1` | `relic_ch01_cafe` |
| `n4_zhuyou` | `ar_zhujin_guide_v1` | `relic_ch01_zhujin_imprint` |
| `n5_complete` | `ar_ch01_completion_v1` | `relic_ch01_first_awakening_seal` |

**Cross-reference result:** 0 issues · 0 warnings.

---

## 2. Content Canon V1 Compliance

| Rule | Result |
|------|--------|
| No new chapter beyond CH01 | PASS |
| No new Lore in data JSON | PASS |
| No Canon Gap fill | PASS |
| Relic ≠ Digital Collectible boundary declared | PASS |
| Rights Layer isolated from ritual chain | PASS |
| Relic = story progression asset | PASS |
| No rank / rarity / equipment semantics in Relic JSON | PASS |

Reference: [`docs/SYNC_REPORT.md`](../SYNC_REPORT.md) · [`LOVEQIGU_CONTENT_CANON_V1.md`](../content/LOVEQIGU_CONTENT_CANON_V1.md)

---

## 3. Git Hygiene & Worktree

**Status: `FAIL`**

| Metric | Value |
|--------|------:|
| Porcelain status lines | ~130 |
| Modified tracked files | 18 |
| Deleted tracked files | 6 |
| Untracked paths (porcelain) | ~106 |
| Untracked files (excl. ignored) | ~320 |

### Blockers

1. **`data/` is untracked at HEAD** — Story / Relic / Rights / AR JSON exist on disk but are **not** in commit `63f9a779`.
2. **MiniApp RC2 surface uncommitted** — pages, services, engines, docs largely `??` or `M`.
3. **Worktree not clean** — baseline cannot be frozen or reproduced from HEAD alone.

### HEAD Snapshot

```
63f9a7797373a6874098074c43fd822e3a769239
LOVEQIGU_MASTER Initial Foundation
2026-06-07 06:34:49 +0800
```

Prior hygiene review: [`docs/GIT_HYGIENE_AUDIT.md`](../GIT_HYGIENE_AUDIT.md) also marked **FAIL**.

---

## 4. Automation Chain

### 4.1 OMX

**Status: `PASS_WITH_WARNING`**

Command: `node scripts/omx/run_omx_checks.js`  
Exit code: **0**

| Check | Result |
|-------|--------|
| check-json | Passed |
| check-routes | Passed (14 MiniApp pages) |
| check-terminology | Passed |
| check-canon | Passed |
| check-content-engine-cursor | Passed (WARN: 51 governed-field warnings) |

Report: [`docs/OMX_REPORT.md`](../OMX_REPORT.md)  
Generated during audit: 2026-06-08T04:02:49.973Z

### 4.2 Ductor

**Status: `PASS_WITH_WARNING`**

| Pipeline | Command | Exit | Pipeline Status |
|----------|---------|-----:|-----------------|
| Content Engine | `node scripts/ductor/run_content_engine_pipeline.js` | 1 | PASS_WITH_WARNING |
| AR Story Engine | `node scripts/ductor/run_ar_story_engine_pipeline.js` | 1 | PASS_WITH_WARNING |
| Live Ops Engine | `node scripts/ductor/run_live_ops_engine_pipeline.js` | 1 | PASS_WITH_WARNING |

All three pipelines **executed and produced reports**. Non-zero exit codes reflect warning posture under report-only governance, not script failure to launch.

Reports:

- [`docs/CONTENT_ENGINE_PIPELINE_REPORT.md`](../CONTENT_ENGINE_PIPELINE_REPORT.md)
- [`docs/AR_STORY_ENGINE_PIPELINE_REPORT.md`](../AR_STORY_ENGINE_PIPELINE_REPORT.md)
- [`docs/LIVE_OPS_ENGINE_PIPELINE_REPORT.md`](../LIVE_OPS_ENGINE_PIPELINE_REPORT.md)

### 4.3 Codex CLI

**Status: `PASS`**

```
codex-cli 0.137.0
```

Exit code: **0**

---

## 5. Root Service Bridge

**Status: `PASS`**

```
chapters 1 · relics 6 · ar 6 · rights 5
```

Services verified:

- `services/story/story-service.js` → `data/story/chapters.json`
- `services/relic/relic-service.js` → `data/relics/relics.json`
- `services/ar/ar-service.js` → `data/ar/ar-events.json`
- `services/rights/rights-service.js` → `data/rights/rights.json`

---

## 6. Remaining Risks

| Risk | Severity | Scope |
|------|----------|-------|
| Data layer not in Git at HEAD | **High** | Baseline reproducibility |
| Dirty worktree (~130 status entries) | **High** | Baseline freeze |
| Content Engine Cursor 51 WARN (report-only) | Low | Governance hardening |
| `dc_ch01_completion_poster` not in data JSON scope | Low | Digital Collectible layer |
| MiniApp bridge uses inline stubs vs root `data/` | Medium | Runtime parity |

---

## 7. Release Recommendation

**Do not mark Baseline Ready until:**

1. `data/story/chapters.json`, `data/relics/relics.json`, `data/rights/rights.json`, `data/ar/ar-events.json` are committed.
2. Worktree is classified and staged (or explicitly ignored) per [`docs/GIT_HYGIENE_AUDIT.md`](../GIT_HYGIENE_AUDIT.md).
3. A new baseline commit is tagged after RC2/data-layer integration.

**Safe to proceed with:** CH01 data-layer validation, Content Canon–aligned JSON editing, automation dry-runs.

**Not safe to proceed with:** Baseline freeze, reproducible RC2 release tag at current HEAD.

---

## Completion Markers

```
BASELINE_AUDIT_COMPLETE = YES
BASELINE_READY = NO
OVERALL_STATUS = PASS_WITH_WARNING
COMMIT_ID = 63f9a7797373a6874098074c43fd822e3a769239
```
