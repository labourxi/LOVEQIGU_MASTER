# MERCHANT_EVENT_SEED_COMPLETE_V1

## 1. Objective

为「爱企谷初见寻宝节」补齐 Merchant Event Engine 的真实活动 seed 数据。

## 2. Seed Files

- `data/merchant_event/activity.seed.json`
- `data/merchant_event/exploration_points.seed.json`
- `data/merchant_event/tasks.seed.json`
- `data/merchant_event/relics.seed.json`
- `data/merchant_event/merchants.seed.json`
- `data/merchant_event/coupon_templates.seed.json`
- `data/merchant_event/bindings.seed.json`

## 3. Seed Case

- activity name: `爱企谷初见寻宝节`
- event code: `LOVEQIGU_FIRST_EVENT_CASE_V1`

## 4. Validation

- `python -m py_compile scripts/merchant_event/validate_seed.py` passed
- `python scripts/merchant_event/validate_seed.py` output `SEED_VALIDATION_PASS`

## 5. Safety Notes

- no database
- no Runtime
- no Release
- no Governance
- no Visual Factory
- no Content Factory

