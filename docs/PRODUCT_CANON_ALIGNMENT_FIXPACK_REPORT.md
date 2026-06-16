# PRODUCT_CANON_ALIGNMENT_FIXPACK_REPORT

Status: PASS

Scope executed:
- FIX-05A homepage
- FIX-05B rights_center
- FIX-05C terminology
- FIX-05D brand

## What Changed

### FIX-05A
- Updated the dual-home homepage copy to present exploration and rights entry instead of reward/task language.
- Reworded the home mode switch to `探索 / 权益 / 活动`.
- Changed the homepage collection summary to `我的祝福收藏册`.
- Removed the visible reward wording from the homepage summary, footer, and home shell copy.

### FIX-05B
- Reframed the rights center as `权益中心`.
- Replaced store-like preview copy with rights-preview copy.
- Kept the page read-only and activity-linked, without introducing a shopping surface.

### FIX-05C
- Replaced the visible legacy terms inside `apps/miniapp`:
  - `结缘商城`
  - `结缘礼`
  - `我的奖励`
  - `奖励体系`
  - `印鉴成就`
  - `查看印鉴成就`
  - `奖励：`
  - `结缘模式`
- Updated shared activity / scenic / prototype copy to the canonical rights vocabulary.

### FIX-05D
- Aligned the affinity-mode brand copy to `权益中心` and `权益礼遇`.
- Updated scenic detail CTA text to route into `权益中心`.
- Reworded the reward-collection surface to `祝福收藏册`.

## Verification

- Exact grep check for the legacy audit strings under `apps/miniapp` returned no matches.
- `node --check` passed for the touched JS files:
  - `apps/miniapp/services/home/home-shell-service.js`
  - `apps/miniapp/pages/rights-center/index.js`
  - `apps/miniapp/services/reward/reward-center-service.js`
  - `apps/miniapp/services/next-activity/next-activity-service.js`
  - `apps/miniapp/pages/next-activity/index.js`
  - `apps/miniapp/pages/index/index.js`
  - `apps/miniapp/services/prototype/prototype-runtime-service.js`

## Acceptance

- `FIX-05A = PASS`
- `FIX-05B = PASS`
- `FIX-05C = PASS`
- `FIX-05D = PASS`
- `PRODUCT_CANON_ALIGNMENT_COMPLETE = YES`
