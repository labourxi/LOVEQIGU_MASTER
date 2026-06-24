# AR_YOUBAN_BOOTSTRAP_REPO_V1

AR游伴最小可运行闭环版本（MVP-1）

## System Chain

XR -> EventBus -> Trigger Layer -> WorldEngine -> UI Mock

## What This Repo Contains

- XR mock tracker
- single event bus
- trigger mapping layer
- star system
- meridian system
- world engine
- miniapp UI mock page

## Run Target

Open `ar-youban/apps/miniapp` in a WeChat Mini Program development environment.

## Runtime Flow

1. XR mock tracker emits `ar:detected / ar:active / ar:lost`
2. Trigger layer maps AR events to world events
3. World engine updates star / meridian / artifact state
4. UI page renders logs and state snapshots

## Constraints

- No real XR SDK
- No bypassing EventBus
- No direct UI mutation from tracker
- No parallel event pipelines

