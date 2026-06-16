# EVENT_PLAYER_EXPERIENCE_V1

## Goal

Make the first event playable end to end:

- complete tasks
- grant relics
- update progress
- complete the activity

## Coverage

- `apps/miniapp/pages/merchant-event/`
- `apps/miniapp/pages/progress-center/`
- `apps/miniapp/pages/event-complete/`
- `apps/miniapp/services/user-progress/`
- `apps/miniapp/services/merchant-event/`

## Flow

1. Enter the event
2. Browse exploration points
3. Complete a task
4. Grant relic automatically
5. Unlock / claim coupon
6. View progress center
7. Finish the event
8. Open event completion page

## State Source

- `loveqigu_user_progress_v1`

## Acceptance

- task completion visible
- relic reward visible
- progress persists after refresh
- progress center visible
- completion page visible
