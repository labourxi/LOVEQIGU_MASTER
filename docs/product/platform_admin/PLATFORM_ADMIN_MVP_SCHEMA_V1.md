# PLATFORM_ADMIN_MVP_SCHEMA_V1

# 平台运营后台 MVP 数据模型 V1

```yaml
project: LOVEQIGU / AR游伴
module: Platform Admin / EVENT_OPERATION_CENTER
version: V1
status: APPROVED_FOR_MVP_SCHEMA
owner: TECH
date: 2026-06-07
scope: schema + mock data + validation only
```

---

## Scope

Platform Admin MVP schema set for merchant review, coupon review, activity review, release control, and dashboard summary.

## Directory

```text
data/platform_admin/
scripts/platform_admin/
docs/product/platform_admin/
```

## Included Objects

| Object | Schema | Mock | Purpose |
|--------|--------|------|---------|
| platform_merchant_review | ✅ | ✅ (3 records) | 商家资料审核队列 |
| platform_coupon_review | ✅ | ✅ (3 records) | 卡券审核队列 |
| platform_activity_review | ✅ | ✅ (3 records) | 活动审核队列 |
| platform_release | ✅ | ✅ (4 records) | 发布/暂停/下线状态 |
| platform_dashboard_summary | ✅ | ✅ (3 records) | 全平台运营快照 |

## Field Summary

### platform_merchant_review

- `review_id` · `merchant_id` · `merchant_name`
- `review_status`: `PENDING` | `APPROVED` | `REJECTED`
- `review_reason` · `submitted_at` · `reviewed_at`

### platform_coupon_review

- `coupon_id` · `merchant_id` · `coupon_name`
- `coupon_type`: `DISCOUNT` | `GIFT` | `EXCHANGE`
- `review_status`: `PENDING` | `APPROVED` | `REJECTED`
- `review_reason` · `submitted_at` · `reviewed_at`

### platform_activity_review

- `activity_id` · `park_id` · `activity_name`
- `review_status`: `PENDING` | `APPROVED` | `REJECTED`
- `publish_check_result` · `submitted_at` · `reviewed_at`

### platform_release

- `release_id`
- `release_type`: `ACTIVITY` | `COUPON` | `MERCHANT`
- `target_id`
- `release_status`: `PENDING` | `APPROVED` | `PUBLISHED` | `BLOCKED`
- `created_at` · `released_at`

### platform_dashboard_summary

- `merchant_count` · `coupon_count` · `activity_count`
- `active_release_count` · `pending_review_count`
- `approved_today` · `rejected_today`

## Mock Format

Each mock file is a **JSON array** with at least **3 records**, covering `PENDING` / `APPROVED` / `REJECTED` (or equivalent release states).

## Validation

```bash
python scripts/platform_admin/validate_schema.py
```

Expected output:

```text
SCHEMA_VALIDATION_PASS
```

## Out of Scope

- API
- Database
- Runtime
- Release
- Governance
- Dashboard

## Success Marker

```text
PLATFORM_ADMIN_MVP_SCHEMA_V1_COMPLETE = YES
```
