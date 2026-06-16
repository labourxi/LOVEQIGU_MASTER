# PLATFORM_ADMIN_MVP_UI_V1

# 平台运营审核后台 MVP UI V1

```yaml
project: LOVEQIGU / AR游伴
module: Platform Admin / EVENT_OPERATION_CENTER
version: V1
status: APPROVED_FOR_MVP_UI
owner: TECH
date: 2026-06-07
scope: HTML + CSS + JS + Mock Data only
```

---

## Scope

Platform Admin MVP UI — mock-first clickable review console bound to `data/platform_admin/` schemas.

## Directory

```text
apps/admin/platform-admin/
├── index.html
├── login/index.html
├── dashboard/index.html
├── reviews/index.html
├── publish/index.html
└── shared/
    ├── admin.css
    ├── mock-store.js
    └── shell.js
```

## Pages

| Page | Path | Function |
|------|------|----------|
| login | `login/index.html` | Fixed account `operation_admin` |
| dashboard | `dashboard/index.html` | 6 platform metrics |
| reviews | `reviews/index.html` | Merchant / coupon / activity review tabs |
| publish | `publish/index.html` | Activity publish + block |

## Data Source

All data from `data/platform_admin/*.mock.json`:

- `platform_dashboard_summary.mock.json`
- `platform_merchant_review.mock.json`
- `platform_coupon_review.mock.json`
- `platform_activity_review.mock.json`
- `platform_release.mock.json`

Loader: `shared/mock-store.js` — fetch with embedded fallback + `localStorage` for simulated actions.

## UI Features

- Top navigation (`EVENT_OPERATION_CENTER`)
- Sidebar navigation
- Breadcrumbs + back buttons
- Loading / empty / success states
- Review: view detail · simulate approve · simulate reject
- Publish: Publish · Block buttons
- No API dependency

## Login

```text
Account: operation_admin
Password: any (mock)
Session: sessionStorage
```

## Out of Scope

- API
- Database
- Runtime
- Release
- Governance changes

## Success Marker

```text
PLATFORM_ADMIN_MVP_UI_V1_COMPLETE = YES
```
