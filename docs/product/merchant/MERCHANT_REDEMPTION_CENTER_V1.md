# MERCHANT_REDEMPTION_CENTER_V1

# 商家核销中心 MVP V1

```yaml
project: LOVEQIGU / AR游伴
module: Merchant Portal / Redemption Center
version: V1
status: APPROVED_FOR_MVP_UI
owner: TECH
date: 2026-06-07
blocker_target: B06
scope: HTML + CSS + JS + Mock Data only
```

---

## Scope

Merchant redemption center MVP — mock-first clickable UI for coupon verification workflow.

## Directory

```text
apps/admin/merchant-portal/
├── merchant_redemptions/index.html          — 核销列表 + 核销记录
├── merchant_redemption_detail/index.html    — 核销详情
└── shared/redemption-store.js

data/merchant_portal/
├── merchant_redemption_center.schema.json
└── merchant_redemption_center.mock.json
```

## Pages

| Page | Function |
|------|----------|
| merchant_redemptions | 核销列表 · 搜索 · 筛选 · 分页 · 核销记录摘要 · 快捷模拟核销/失败 |
| merchant_redemption_detail | 核销详情 · 模拟核销 · 模拟失败 |

## Status Model

| Status | Meaning |
|--------|---------|
| PENDING | 待核销 |
| VERIFIED | 已核销 |
| FAILED | 核销失败 |
| EXPIRED | 已过期 |

## Fields

- redemption_id
- coupon_name
- coupon_code
- user_id
- merchant_name
- claim_time
- redeem_time
- status

## Mock Actions

| Action | Transition |
|--------|------------|
| 模拟核销 | PENDING → VERIFIED（写入 redeem_time） |
| 模拟失败 | PENDING → FAILED |

Persistence: `localStorage` key `merchant_redemption_mock_state_v1`

## UI Features

- Search: coupon_name / coupon_code / user_id
- Filter: ALL · PENDING · VERIFIED · FAILED · EXPIRED
- Pagination: 5 records per page
- States: loading · empty · success
- Metrics: count per status

## Data Source

`data/merchant_portal/merchant_redemption_center.mock.json` (10 records)

## Out of Scope

- API
- Database
- Runtime
- Release

## B06 Impact

```text
B06 商家端无核销页 → 部分解除（Mock UI 可演示核销流程）
真实解除需 POST verify API + C 端 user_coupon 联通
```

## Success Marker

```text
MERCHANT_REDEMPTION_CENTER_V1_COMPLETE = YES
```
