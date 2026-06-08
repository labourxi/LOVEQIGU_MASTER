# CH01 Data Sync Audit — SYNC_REPORT

Generated: 2026-06-07  
Scope: `data/story/chapters.json` · `data/relics/relics.json` · `data/ar/ar-events.json`  
Trigger: `CH01_DATA_SYNC_AUDIT` · `relic_ch01_zhujin_imprint` · `ar_zhujin_guide_v1`

---

## Overall Status

**`PASS`**

---

## Sync Actions Performed

### 1. Relic Layer — Created Missing Entity

**Finding:** `relic_ch01_zhujin_imprint` did **not** exist in `data/relics/relics.json`.

**Action:** Created entity aligned with:

- `LOVEQIGU_CONTENT_CANON_V1.md` (Relic = story progression memorial)
- `ar_zhujin_guide_v1` (`node_id: n4_zhuyou`)
- TERMINOLOGY T-N4-004 · T-N4-002（云间书符·感印）

| Field | Value |
|-------|-------|
| `id` | `relic_ch01_zhujin_imprint` |
| `name` | 云间书符·感印 |
| `node_id` | `n4_zhuyou` |
| `type` | `practice_relic` |
| `imprint_slot` | 4 |

### 2. Story Layer — n4 + AR Event Backfill

**Finding:** `n4_zhuyou` had empty `ar_event_refs` and `relic_refs`.

**Action:** Updated `chapters.json`:

| Node | `ar_event_refs` | `relic_refs` |
|------|-----------------|--------------|
| `n2_plaza` | `ar_plaza_awareness_v1` | (unchanged) |
| `n3_cafe` | `ar_cafe_human_field_v1` | (unchanged) |
| `n4_zhuyou` | `ar_zhujin_guide_v1` | `relic_ch01_zhujin_imprint` |
| `n5_complete` | `ar_ch01_completion_v1` | (unchanged) |

---

## Cross-Reference Audit

### chapters.json → relics.json

| Check | Result |
|-------|--------|
| All node `relic_refs` resolve in `relics.json` | PASS |
| All 6 relics referenced by at least one node | PASS |
| Relic `node_id` matches owning chapter node | PASS |
| Each relic appears in its node `relic_refs` | PASS |

### chapters.json → ar-events.json

| Check | Result |
|-------|--------|
| All node `ar_event_refs` resolve in `ar-events.json` | PASS |
| All 6 AR events listed on matching chapter nodes | PASS |
| AR `node_id` exists in Story Layer | PASS |

### ar-events.json → relics.json

| Check | Result |
|-------|--------|
| All AR `relic_refs` resolve in `relics.json` | PASS |
| `ar_zhujin_guide_v1` → `relic_ch01_zhujin_imprint` | PASS |
| No dangling relic references | PASS |

### CH01 Inventory (Post-Sync)

| Layer | Count |
|-------|------:|
| Story nodes | 5 |
| Relic entities | 6 |
| AR events | 6 |

> Note: `n1_gate` carries 2 AR events and 2 relics; total unique relics = 6.

---

## Node ↔ Event ↔ Relic Matrix

| Node | AR Event(s) | Relic(s) |
|------|-------------|----------|
| `n1_gate` | `ar_gate_open_v1`, `ar_imprint_particles_v1` | `relic_ch01_gate_badge`, `relic_ch01_cloud_gate_imprint_a` |
| `n2_plaza` | `ar_plaza_awareness_v1` | `relic_ch01_plaza` |
| `n3_cafe` | `ar_cafe_human_field_v1` | `relic_ch01_cafe` |
| `n4_zhuyou` | `ar_zhujin_guide_v1` | `relic_ch01_zhujin_imprint` |
| `n5_complete` | `ar_ch01_completion_v1` | `relic_ch01_first_awakening_seal` |

---

## Compliance

| Rule | Status |
|------|--------|
| No new Lore | PASS |
| No Canon Gap fill | PASS |
| No rarity / level / equipment fields on relics | PASS |
| Relic = story progression asset | PASS |
| `ar_zhujin_guide_v1` rights_refs empty | PASS |
| `ar_zhujin_guide_v1` digital_collectible_refs empty | PASS |

---

## Ancillary Sync (Out of Primary Scope)

`data/rights/rights.json` was updated to include `relic_ch01_zhujin_imprint` in `relic_refs_all` and all per-right `relic_refs` arrays, preserving the prior「每条权益关联全部 CH01 信物」rule.

---

## Remaining Risks

- None within `chapters.json` / `relics.json` / `ar-events.json` cross-reference scope.
- `dc_ch01_completion_poster` referenced by `ar_ch01_completion_v1` remains outside this audit scope (Digital Collectible layer).

---

`CH01_DATA_SYNC_AUDIT_COMPLETE = YES`
