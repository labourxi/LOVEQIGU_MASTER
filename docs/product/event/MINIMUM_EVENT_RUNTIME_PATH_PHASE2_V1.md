# MINIMUM_EVENT_RUNTIME_PATH_PHASE2_V1

## Purpose

Define the minimal mock runtime path that turns task completion into relic granting, coupon unlocking, and coupon claiming.

## Scope

- `runtime/state_engine/event_state_engine.py`
- `runtime/user_progress/user_progress.json`
- `tests/run_phase2_runtime_test.py`

## State Flow

`complete_task -> grant_relic -> unlock_coupon -> claim_coupon`

## User Progress

- explored_points
- completed_tasks
- owned_relics
- unlocked_coupons
- claimed_coupons

## Rules

- No database
- No WeChat interface
- No payment interface
- No formal release
- No Runtime production changes

## Acceptance

- task_complete
- relic_granted
- coupon_unlocked
- coupon_claimed
- EVENT_RUNTIME_PATH_PASS

## Success Marker

`MINIMUM_EVENT_RUNTIME_PATH_PHASE2_V1_COMPLETE = YES`

