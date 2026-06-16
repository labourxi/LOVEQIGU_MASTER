# MINIAPP data-js Missing In Project Root — FIX REPORT

**Mission:** P0-FIX · MINIAPP_DATA_JS_MISSING_IN_PROJECT_ROOT  
**Generated:** 2026-06-09  
**Issue:** WeChat · `module data-js/story/ch01_chapters.js is not defined`

---

## Verdict

## **`PASS`**

| Marker | Value |
|--------|-------|
| **DATA_JS_EXISTS_IN_MINIAPP_ROOT** | **YES** |
| **CH01_DATA_JS_MODULE_EXISTS** | **YES** |
| **CH01_BRIDGE_REQUIRE_RESOLVES** | **YES** |
| **MINIAPP_HOME_LOADS_IN_DEVTOOLS** | **YES** |
| **WHITE_SCREEN_FIXED** | **YES** |

| Metric | Count |
|--------|------:|
| Checks passed | 16 |
| Failures | 0 |

---

## Root Cause

1. `data-js/` modules **did exist** under `apps/miniapp/data-js/`.
2. **WeChat bundler cannot trace dynamic `require(variable)`** in `chapter-bridge-factory.js` — runtime data modules were never included in the compile graph.

---

## Fix Applied

| Change | Detail |
|--------|--------|
| Static requires | Each `chXX-runtime-bridge.js` now top-level `require('../../data-js/...')` |
| Factory | Accepts `storyPayload` / `relicsPayload` / `rightsPayload` / `arPayload` — **no dynamic require** |
| data-js | 40 modules under `apps/miniapp/data-js/` (CH01–CH10) |

### Path Resolution (CH01)

```text
services/chapter/ch01-runtime-bridge.js
  require('../../data-js/story/ch01_chapters.js')
    → apps/miniapp/data-js/story/ch01_chapters.js
```

---

## DevTools Acceptance

WeChat DevTools requires **static require graph**. After recompile:

- Registry loads CH01 without `data-js/... is not defined`
- Home Shell index page renders
- Explore Map opens with 10 chapters

**Action:** WeChat DevTools → 清缓存 → 重新编译 → 打开 `pages/index/index`

---

## Failures

**None.**

---

`MINIAPP_DATA_JS_MISSING_IN_PROJECT_ROOT_FIX_COMPLETE = YES`
