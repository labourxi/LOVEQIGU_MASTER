# BASELINE_FREEZE_REPORT

**Mission:** 77｜BASELINE_FREEZE_PREP  
**Repository:** LOVEQIGU_MASTER V1  
**Generated:** 2026-06-08T12:30:00+08:00  
**Commit ID (HEAD):** `63f9a7797373a6874098074c43fd822e3a769239`  
**Mode:** Freeze preparation · No business-data mutation · No new content

**Inputs:**

- [`docs/audit/BASELINE_AUDIT_REPORT.md`](audit/BASELINE_AUDIT_REPORT.md)
- [`docs/REPOSITORY_BASELINE_V1.md`](REPOSITORY_BASELINE_V1.md)
- [`docs/REPOSITORY_COMMIT_PLAN.md`](REPOSITORY_COMMIT_PLAN.md)

---

## BASELINE_READY Judgment

| Phase | Status |
|-------|--------|
| **Current (prep only, no commits)** | **`NO`** |
| **After COMMIT_A + B + C executed** | **`YES`** |

**Reasoning:** Four-layer JSON is valid and cross-consistent, but **`data/*` is not tracked at HEAD**. Baseline readiness requires `data/**` inside `COMMIT_A_SOURCE`, then governance and reports split per plan, with archive/temp paths excluded.

---

## 1. Data Layer Git Status

### 1.1 Four-Layer Files on Disk

| Layer | Path | In Git at HEAD | Porcelain |
|-------|------|:--------------:|-----------|
| Story | `data/story/chapters.json` | **NO** | `?? data/` |
| Relic | `data/relics/relics.json` | **NO** | `?? data/` |
| Rights | `data/rights/rights.json` | **NO** | `?? data/` |
| AR Event | `data/ar/ar-events.json` | **NO** | `?? data/` |

Command evidence:

```text
git ls-files data/story data/relics data/rights data/ar
→ (empty)

git status --porcelain data/
→ ?? data/
```

### 1.2 Data Integrity (Unchanged)

All four files parse as legal JSON. Counts unchanged from baseline audit:

- Chapters: 1 · Nodes: 5  
- Relics: 6 · Rights: 5 · AR events: 6  

**Action required:** Include entire `data/**` in **COMMIT_A_SOURCE** (first commit).

---

## 2. Git Hygiene Status

**Current: `NOT CLEAN`**

| Metric | Value |
|--------|------:|
| Branch | `master` |
| HEAD | `63f9a7797373a6874098074c43fd822e3a769239` |
| Porcelain lines | ~131 |
| Modified tracked | 18 |
| Deleted tracked | 6 |
| Untracked top-level buckets | ~106 paths |

### Hygiene Blockers (Pre-Freeze)

1. **`data/` untracked** — primary BASELINE_READY blocker  
2. **Mixed worktree** — source, governance, reports, archive coexisting  
3. **Intentional deletions uncommitted** — 6 tracked prompt/asset deletes  
4. **Runtime logs present** — `ductor/logs/` marked DO_NOT_COMMIT  

### Hygiene Targets (Post-Freeze)

- `git status --porcelain` → empty (or only `.gitignore`-excluded locals)  
- `git ls-files data/**` → 4 JSON files tracked  
- No `?? data/` entry  

---

## 3. Worktree Classification

Reclassified per `REPOSITORY_COMMIT_PLAN.md` buckets.

### COMMIT_A_SOURCE (~46 paths)

**Purpose:** Product runtime, MiniApp, engines, root services, **data layer**.

| Group | Paths |
|-------|-------|
| **Data layer** | `data/story/chapters.json`, `data/relics/relics.json`, `data/rights/rights.json`, `data/ar/ar-events.json` |
| MiniApp | `apps/miniapp/app.json`, `apps/miniapp/pages/**`, `apps/miniapp/services/**`, `apps/miniapp/project.config.json` |
| MiniApp assets | `apps/miniapp/assets/images/home-hero.jpg` (+ delete `home-hero.png`) |
| Root services | `services/**` |
| Engines | `AR_ENGINE_V2/**`, `CONTENT_ENGINE/**`, `LIVE_OPS_ENGINE/**`, `STORY_ENGINE/**` |
| Tracked deletions (keep) | `prompts/P1_MINIAPP_START.md`, `prompts/git_init.md`, `prompts/governance_init.md`, `prompts/knowledge_check.md`, `prompts/update_docs_terminology.md` |

**Coherence rule:** MiniApp + `data/**` + `services/**` must land in the **same** commit so runtime and data model stay aligned.

---

### COMMIT_B_GOVERNANCE (~7 top-level trees)

**Purpose:** Automation, governance, OMX/Ductor/Cursor scripts.

| Group | Paths |
|-------|-------|
| Governance | `governance/content_engine_cursor_workflow.yaml`, `governance/content_engine_rules.yaml` |
| Scripts | `scripts/cursor/**`, `scripts/governance/**`, `scripts/omx/**` (excl. backups), `scripts/ductor/**` |
| Ductor workflows | `ductor/workflows/**` |

**Exclude from B:** `scripts/omx/backups/**` → ARCHIVE_ONLY  

---

### COMMIT_C_REPORTS (~71 paths under `docs/`)

**Purpose:** Generated audit, pipeline, RC2, baseline, and freeze documentation.

| Group | Representative paths |
|-------|---------------------|
| Baseline / audit | `docs/audit/BASELINE_AUDIT_REPORT.md`, `docs/BASELINE_FREEZE_REPORT.md`, `docs/REPOSITORY_BASELINE_V1.md`, `docs/REPOSITORY_COMMIT_PLAN.md`, `docs/SYNC_REPORT.md` |
| RC2 | `docs/RC2_*`, `docs/RC2_ACCEPTANCE_AUDIT_REPORT.md` |
| Engine reports | `docs/CONTENT_ENGINE_*`, `docs/AR_STORY_ENGINE_*`, `docs/LIVE_OPS_*`, `docs/OMX_REPORT.md` |
| Content canon | `docs/content/LOVEQIGU_CONTENT_CANON_V1.md` |
| Other docs | `docs/beiwang/**`, remaining `docs/*.md` / `docs/*.json` |

**Exclude from C:** Nothing in `docs/` is blocked; reports belong here.

---

### ARCHIVE_ONLY

| Path | Recommendation |
|------|----------------|
| `prompts/old/**` | Optional 4th commit or keep untracked until archive policy decided |
| `scripts/omx/backups/**` | Do not merge into COMMIT_B; snapshot-only |

---

### DO_NOT_COMMIT

| Path | Reason |
|------|--------|
| `ductor/logs/**` | Runtime-generated logs |
| `prompts/terminology_fix_and_git_cleanup.md` | Active task prompt (if present) |

---

### Deleted Tracked Files (Include in COMMIT_A)

| File | Action |
|------|--------|
| `apps/miniapp/assets/images/home-hero.png` | Stage deletion |
| `prompts/P1_MINIAPP_START.md` | Stage deletion (superseded by `prompts/old/`) |
| `prompts/git_init.md` | Stage deletion |
| `prompts/governance_init.md` | Stage deletion |
| `prompts/knowledge_check.md` | Stage deletion |
| `prompts/update_docs_terminology.md` | Stage deletion |

---

## 4. Suggested Commit Order

Execute **in order**. Do not amend business JSON during staging.

### Step 0 — Preflight

```bash
git status --porcelain
node -e "['data/story/chapters.json','data/relics/relics.json','data/rights/rights.json','data/ar/ar-events.json'].forEach(f=>require('./'+f))"
```

### Step 1 — COMMIT_A_SOURCE

```bash
git add apps/miniapp/ data/ services/ AR_ENGINE_V2/ CONTENT_ENGINE/ LIVE_OPS_ENGINE/ STORY_ENGINE/
git add -u apps/miniapp/assets/images/home-hero.png prompts/P1_MINIAPP_START.md prompts/git_init.md prompts/governance_init.md prompts/knowledge_check.md prompts/update_docs_terminology.md
git commit -m "Add CH01 data layer, MiniApp RC2 surfaces, engines, and root services."
```

**Validates:** `git ls-files data/` shows 4 JSON files.

### Step 2 — COMMIT_B_GOVERNANCE

```bash
git add governance/ scripts/cursor/ scripts/governance/ scripts/ductor/ scripts/omx/run_omx_checks.js scripts/omx/check-*.js scripts/omx/omx-utils.js ductor/workflows/
git commit -m "Add governance rules and OMX/Ductor/Cursor automation scripts."
```

**Exclude:** `scripts/omx/backups/`

### Step 3 — COMMIT_C_REPORTS

```bash
git add docs/
git commit -m "Add baseline, RC2, pipeline, and audit reports."
```

**Exclude:** none under `docs/`

### Step 4 — Optional ARCHIVE (or defer)

```bash
git add prompts/old/
git commit -m "Archive legacy prompts."
```

### Step 5 — Tag Baseline

After Step 1–3 and clean `git status`:

```bash
git tag -a LOVEQIGU_BASELINE_V1 -m "LOVEQIGU V1 baseline: CH01 data layer + RC2 MiniApp + governance + reports."
```

**Alternate tag** (RC2 journey freeze alias, if dual-tag desired):

```bash
git tag vRC2_FREEZE
```

---

## 5. Suggested Tag Names

| Tag | Use |
|-----|-----|
| **`LOVEQIGU_BASELINE_V1`** | **Primary** — matches `REPOSITORY_BASELINE_V1.md` |
| `vRC2_FREEZE` | Secondary alias — matches `RC2_FREEZE_SUMMARY.md` journey freeze |
| `v1.0.0-data-baseline` | Optional semver pointer after data layer lands |

**Recommendation:** Annotated tag **`LOVEQIGU_BASELINE_V1`** on the commit **after COMMIT_C** (full reproducible baseline including reports).

---

## 6. BASELINE_READY Checklist

| # | Criterion | Now | After A+B+C |
|---|-----------|:---:|:-----------:|
| 1 | `data/story/chapters.json` tracked | NO | YES |
| 2 | `data/relics/relics.json` tracked | NO | YES |
| 3 | `data/rights/rights.json` tracked | NO | YES |
| 4 | `data/ar/ar-events.json` tracked | NO | YES |
| 5 | Four-layer cross-ref (audit) | PASS | PASS |
| 6 | Content Canon compliance | PASS | PASS |
| 7 | Worktree clean | NO | YES |
| 8 | OMX executable | PASS | PASS |
| 9 | Ductor executable | PASS | PASS |
| 10 | Codex CLI available | PASS | PASS |
| 11 | Business data unmodified in prep | YES | YES |

---

## 7. Risks & Notes

- **Do not** edit JSON in `data/**` during freeze staging — only `git add`.  
- **`pages/relics/`** remains legacy on disk; not in registered routes — document only, no deletion in this prep.  
- **Content Engine 51 WARN** remains report-only; does not block BASELINE_READY.  
- **`ductor/logs/`** must stay out of commits per commit plan.  
- **`scripts/omx/backups/`** should not enter COMMIT_B.  

---

## 8. Completion Markers

```text
BASELINE_FREEZE_PREP_COMPLETE = YES
BASELINE_READY = NO          (current — commits not executed)
BASELINE_READY = YES         (after COMMIT_A + COMMIT_B + COMMIT_C + clean worktree)
SUGGESTED_TAG = LOVEQIGU_BASELINE_V1
COMMIT_ID_AT_PREP = 63f9a7797373a6874098074c43fd822e3a769239
```
