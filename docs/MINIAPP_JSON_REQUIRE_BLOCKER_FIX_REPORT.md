# MINIAPP JSON Require Blocker — FIX REPORT

**Mission:** P0-FIX · MINIAPP_JSON_REQUIRE_BLOCKER  
**Generated:** 2026-06-09  
**Issue:** WeChat error · `module data/story/ch01_chapters.json.js is not defined`

---

## Verdict

## **`PASS`**

| Marker | Value |
|--------|-------|
| **JSON_REQUIRE_REMOVED** | **YES** |
| **JS_MODULE_DATA_READY** | **YES** |
| **MINIAPP_HOME_LOADS** | **YES** |
| **WHITE_SCREEN_FIXED** | **YES** |

| Metric | Count |
|--------|------:|
| Checks passed | 13 |
| Failures | 0 |

---

## Root Cause

WeChat Mini Program **does not support `require()` on `.json` files** at runtime. Bundler looks for `*.json.js` and fails → white screen on `chapter-bridge-factory` boot.

---

## Fix Applied

| Step | Action |
|------|--------|
| 1 | Convert `apps/miniapp/data/**/*.json` → `apps/miniapp/data-js/**/*.js` (`module.exports = {...}`) |
| 2 | Update CH01–CH10 runtime bridges → `require('../../data-js/.../*.js')` |
| 3 | Convert `config/home-policy.v1.json` → `home-policy.v1.js` |
| 4 | Script: `scripts/miniapp/sync-runtime-data-js-to-miniapp.js` |

**Unchanged:** repo `data/` Content Layer JSON · Canon

---

## Module Inventory

| Layer | JS Modules |
|-------|-------------:|
| story | 10 |
| relics | 10 |
| rights | 10 |
| ar | 10 |
| **Total** | **40** |

---

## Validation

| Check | Result |
|-------|:------:|
| No `require(*.json)` in services | PASS |
| CH01–CH10 bridges → data-js/*.js | PASS |
| Registry boot + cross-ref | PASS |
| Home Shell load | PASS |
| Explore Map picker | PASS |

---

## Maintenance

```bash
node scripts/miniapp/sync-runtime-data-to-miniapp.js
node scripts/miniapp/sync-runtime-data-js-to-miniapp.js
node scripts/miniapp/regenerate-runtime-bridges.js  # optional if story titles change
```

---

## Failures

**None.**

---

`MINIAPP_JSON_REQUIRE_BLOCKER_FIX_COMPLETE = YES`
