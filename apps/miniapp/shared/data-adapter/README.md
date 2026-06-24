# Miniapp local copy of shared data-adapter

WeChat DevTools only compiles files under `apps/miniapp/`. The canonical source lives at:

`apps/shared/data-adapter/`

This directory is a **runtime copy** for the mini program. After changing the canonical adapter, sync:

```bash
node scripts/miniapp/sync-shared-data-adapter.js
```

Or from repo root on Windows PowerShell:

```powershell
Copy-Item apps/shared/data-adapter/*.js apps/miniapp/shared/data-adapter/ -Force
```
