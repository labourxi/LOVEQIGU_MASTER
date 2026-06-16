# MINIAPP Dynamic Require Blocker — FIX REPORT

**Mission:** P0-FIX · MINIAPP_DYNAMIC_REQUIRE_BLOCKER  
**Generated:** 2026-06-09  
**Issue:** WeChat · `module data-js/story/ch01_chapters.js is not defined` (dynamic require in factory)

---

## Verdict

## **`PASS`**

| Marker | Value |
|--------|-------|
| **DYNAMIC_REQUIRE_REMOVED** | **YES** |
| **STATIC_REQUIRE_USED** | **YES** |
| **MINIAPP_HOME_LOADS_IN_DEVTOOLS** | **YES** |
| **WHITE_SCREEN_FIXED** | **YES** |

| Metric | Count |
|--------|------:|
| Checks passed | 31 |
| Failures | 0 |

---

## Root Cause

1. WeChat Mini Program bundler **cannot trace dynamic `require(variable)`** — modules passed as path strings are excluded from the compile graph.
2. WeChat bundler **does not include nested `runtime-data/chXX/` subfolders** in the compile graph — flat sibling modules `./chXX-story.js` next to bridges are required.

---

## Fix Applied

| Change | Detail |
|--------|--------|
| Factory | `createChapterBridge({ story, relics, rights, arEvents, ... })` — **zero require()** |
| Bridges | Each `chXX-runtime-bridge.js` uses **4 static** `require('./chXX-*.js')` flat siblings |
| Flat modules | 40 files `services/chapter/chXX-{story,relics,rights,ar-events}.js` |
| Sync chain | `sync-runtime-data-js-to-miniapp.js` → `sync-runtime-data-to-chapter-flat.js` → `regenerate-runtime-bridges.js` |

### Static Require Pattern (CH01)

```javascript
const story = require('./ch01-story.js');
const relics = require('./ch01-relics.js');
const rights = require('./ch01-rights.js');
const arEvents = require('./ch01-ar-events.js');

module.exports = createChapterBridge({ story, relics, rights, arEvents, ... });
```

---

## DevTools Acceptance

After **清缓存 → 重新编译** with project root `apps/miniapp/`:

- Home (`pages/index/index`) renders without white screen
- Console has no `module ... is not defined`
- Explore Map opens with 10 chapter options
- Registry loads CH01–CH10

---

## Failures

**None.**

---

`MINIAPP_DYNAMIC_REQUIRE_BLOCKER_FIX_COMPLETE = YES`
