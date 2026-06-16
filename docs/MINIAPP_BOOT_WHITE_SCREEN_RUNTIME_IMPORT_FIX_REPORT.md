# MINIAPP Boot White Screen — RUNTIME IMPORT FIX REPORT

**Mission:** P0-FIX · MINIAPP_BOOT_WHITE_SCREEN_RUNTIME_IMPORT  
**Generated:** 2026-06-09  
**Issue:** WeChat DevTools white screen · `can not find module ../../../../data/story/chapters.json`

---

## Verdict

## **`PASS`**

| Marker | Value |
|--------|-------|
| **WHITE_SCREEN_FIXED** | **YES** |
| **MISSING_MODULE_FIXED** | **YES** |
| **MINIAPP_HOME_LOADS** | **YES** |
| **RUNTIME_REGISTRY_PASS** | **YES** |

| Metric | Count |
|--------|------:|
| Checks passed | 16 |
| Warnings | 0 |
| Failures | 0 |

---

## Root Cause

1. **CH01 bridge** still referenced legacy aggregated files:
   - `data/story/chapters.json`
   - `data/relics/relics.json`
   - `data/rights/rights.json`
   - `data/ar/ar-events.json`
2. **All bridges** used `../../../../data/` paths **outside** `apps/miniapp/` — WeChat DevTools cannot `require()` files outside the mini program root → **white screen on boot**.

---

## Fix Applied

| Action | Detail |
|--------|--------|
| CH01 bridge paths | `ch01_chapters.json` / `ch01_relics.json` / `ch01_rights.json` / `ch01_ar-events.json` |
| CH01–CH10 bridge prefix | `../../../../data/` → **`../../data/`** (miniapp/data via factory path.resolve) |
| Runtime data mirror | `scripts/miniapp/sync-runtime-data-to-miniapp.js` copies repo `data/` → `apps/miniapp/data/` |
| CH01 alias | repo `chapters.json` copied as `apps/miniapp/data/story/ch01_chapters.json` (source JSON **not modified**) |

---

## Files Changed

| File | Change |
|------|--------|
| `apps/miniapp/services/chapter/ch01-runtime-bridge.js` | Legacy → ch01_* miniapp paths |
| `apps/miniapp/services/chapter/ch02–ch10-runtime-bridge.js` | miniapp-local `../../../data/` paths |
| `scripts/miniapp/sync-runtime-data-to-miniapp.js` | **NEW** sync script |
| `apps/miniapp/data/**` | **NEW** runtime mirror (40 JSON files) |

**Unchanged:** `data/story/chapters.json` and all repo Content Layer JSON · Canon

---

## Validation

| Check | Result |
|-------|:------:|
| MiniApp boot module resolution (CH01 bridge) | PASS |
| Runtime Registry (10 chapters) | PASS |
| Home Shell load | PASS |
| Explore Map picker + AR | PASS |
| `runtime-alignment-check.js` | PASS |

---

## Failures

**None.**

---

## Maintenance

After Content Layer updates, re-run:

```bash
node scripts/miniapp/sync-runtime-data-to-miniapp.js
```

`MINIAPP_BOOT_WHITE_SCREEN_RUNTIME_IMPORT_FIX_COMPLETE = YES`
