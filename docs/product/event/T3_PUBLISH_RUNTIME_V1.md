# T3_PUBLISH_RUNTIME_V1

## Objective

建立首场活动发布链路的 mock runtime backbone。

## Scope

- mock runtime only
- approval gate only
- publish manifest only
- QR payload only

## Rules

- `APPROVED` => publish success
- `PENDING_REVIEW` => publish blocked
- `REJECTED` => publish blocked

## Outputs

- `runtime/events/published/LOVEQIGU_FIRST_EVENT_CASE_V1.json`
- `runtime/events/event_index.json`
- `runtime/events/blocked/LOVEQIGU_FIRST_EVENT_CASE_V1.json` when blocked

