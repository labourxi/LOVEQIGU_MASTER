# getSystemInfo HarmonyOS Migration Report

**Mission:** P0-FIX · HarmonyOS-compatible platform info  
**Generated:** 2026-06-09  

---

## Verdict

## **`PASS`**

| Marker | Value |
|--------|-------|
| **DIRECT_GET_SYSTEM_INFO_CALLS** | **0** |
| **PLATFORM_INFO_UTIL_EXISTS** | **YES** |
| **APP_BOOTSTRAP_USES_COMPAT** | **YES** |
| **HARMONYOS_READY** | **YES** |

---

## Scan Result

Full-repo scan for `wx.getSystemInfo` / `wx.getSystemInfoSync`:

**No direct calls outside compat utility.**

> DevTools「getSystemInfo API 提示」为平台通用建议（基础库 3.7.0+ HarmonyOS 支持），并非本项目存在旧 API 调用。

---

## Solution

**New utility:** `apps/miniapp/utils/platform-info.js`

| API | Purpose |
|-----|---------|
| `getDeviceInfoSafe()` | 设备与平台（含 HarmonyOS 判断） |
| `getWindowInfoSafe()` | 窗口与安全区 |
| `getAppBaseInfoSafe()` | 基础库版本 / 语言 |
| `getSystemInfoSyncCompat()` | 同步替代 `getSystemInfoSync` |
| `getSystemInfoCompat(options)` | 异步替代 `getSystemInfo` |
| `isHarmonyOS()` | `platform` 为 harmonyos / harmony / ohos |

**Fallback:** 基础库不支持拆分 API 时，自动降级 `wx.getSystemInfoSync()`。

**App bootstrap:** `app.js` `onLaunch` 缓存 `globalData.systemInfo` 与 `globalData.isHarmonyOS`。

---

## Usage (future code)

```javascript
const platformInfo = require('../../utils/platform-info');

const info = platformInfo.getSystemInfoSyncCompat();
if (platformInfo.isHarmonyOS()) {
  // HarmonyOS-specific handling
}
```

---

## Business Logic

**Unchanged** — 无页面原先依赖 `getSystemInfo`；仅新增兼容层与启动缓存。

---

`GET_SYSTEM_INFO_HARMONYOS_MIGRATION_COMPLETE = YES`
