# T5_COUPON_CLAIM_V1

## 1. Objective

建立首场活动领券链路 MVP。

## 2. Scope

- 页面：`pages/rights-center/coupon-center.html`
- 读取：`data/merchant_event/coupon_templates.seed.json`
- 本地状态：`data/user_mock/user_coupon.mock.json`
- 领取记录：`data/user_mock/user_coupon_claim_history.mock.json`
- 模拟脚本：`scripts/coupon/claim_coupon.py`

## 3. Status

- AVAILABLE
- CLAIMED
- USED
- EXPIRED

## 4. Acceptance

- 页面可打开
- 可领取
- 状态变化正确
- 领取记录生成

## 5. Success Marker

`T5_COUPON_CLAIM_V1_COMPLETE = YES`
