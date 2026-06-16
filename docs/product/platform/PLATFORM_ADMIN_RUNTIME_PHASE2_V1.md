# PLATFORM_ADMIN_RUNTIME_PHASE2_V1

Mock-interactive platform admin Phase2 extending Phase1 with five operational centers.

## Scope

Built on `PLATFORM_ADMIN_RUNTIME_PHASE1` using `apps/admin/shared/components/` and `platform-admin-ui.js` Mock Runtime.

### Activity Center

| Page | Path |
|------|------|
| Activity List | `platform-admin/activities/index.html` |
| Create Activity | `platform-admin/activities/create/index.html` |
| Edit Activity | `platform-admin/activities/edit/index.html` |
| Publish Activity | `platform-admin/activities/publish/index.html` |
| Close Activity | `platform-admin/activities/close/index.html` |

### Coupon Center

| Page | Path |
|------|------|
| Coupon Template | `platform-admin/coupons/templates/index.html` |
| Coupon Inventory | `platform-admin/coupons/inventory/index.html` |
| Coupon Statistics | `platform-admin/coupons/statistics/index.html` |
| Coupon Review | `platform-admin/coupons/review/index.html` |

### Verification Center

| Page | Path |
|------|------|
| Verification Records | `platform-admin/verification/records/index.html` |
| Verification Exception | `platform-admin/verification/exceptions/index.html` |
| Merchant Verifier Management | `platform-admin/verification/verifiers/index.html` |
| Verification Ranking | `platform-admin/verification/ranking/index.html` |

### Ticket Center

| Page | Path |
|------|------|
| Merchant Tickets | `platform-admin/tickets/merchants/index.html` |
| Scenic Tickets | `platform-admin/tickets/scenic/index.html` |
| Technical Tickets | `platform-admin/tickets/technical/index.html` |

### Message Center

| Page | Path |
|------|------|
| Training Notice | `platform-admin/messages/training/index.html` |
| Activity Notice | `platform-admin/messages/activity/index.html` |
| Review Notice | `platform-admin/messages/review/index.html` |
| System Notice | `platform-admin/messages/system/index.html` |

## Shared Stack

- `apps/admin/shared/components/library.css` + `index.js`
- `apps/admin/platform-admin/shared/platform-admin-ui.js` — shell, list/form runtime
- `apps/admin/platform-admin/shared/phase2-pages.js` — page configs
- `apps/admin/platform-admin/shared/mock-store.js` — Mock datasets + localStorage overrides

## Constraints

- Mock Runtime only
- No Database / External API / WeChat API / Payment API
- No Runtime / Release changes

## Responsive

Desktop First · breakpoints 1920 / 1440 / 1280 / 1024

## Preview

```bash
npx serve apps/admin
# platform-admin/index.html → Phase2 Hub
# Login: operation_admin
```

## Screenshots

`docs/product/platform/screenshots/PLATFORM_ADMIN_RUNTIME_PHASE2/{1920,1440,1280,1024}/`

## Completion

```yaml
PLATFORM_ADMIN_RUNTIME_PHASE2_COMPLETE: YES
```
