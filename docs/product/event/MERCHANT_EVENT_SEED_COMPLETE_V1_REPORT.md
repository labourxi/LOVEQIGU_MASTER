# MERCHANT_EVENT_SEED_COMPLETE_V1_REPORT

## Activity Overview

- activity name: `爱企谷初见寻宝节`
- event code: `LOVEQIGU_FIRST_EVENT_CASE_V1`
- event id: `event_loveqigu_first_event_v1`
- status: `DRAFT`

## Seed Counts

- exploration points: 5
- tasks: 5
- relics: 5
- merchants: 3
- coupon templates: 3

## Binding Graph

```text
activity
  -> exploration_points
  -> tasks
  -> relics
  -> merchants
  -> coupon_templates

exploration_points -> tasks
tasks -> relics
merchants -> coupon_templates
```

## Validation Result

- `SEED_VALIDATION_PASS`

## Notes

- no database
- no Runtime
- no Release
- no Governance
- no Visual Factory
- no Content Factory

`MERCHANT_EVENT_SEED_COMPLETE_V1_COMPLETE = YES`

