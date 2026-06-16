# USER_PROGRESS_CENTER_V1

## 1. Objective

建立统一用户进度中心，覆盖 UI、沉浸、Canon、活动、权益五个域。

## 2. Primary Key

- `loveqigu_user_progress_v1`

## 3. Schema Domains

- `ui`
- `immersion`
- `canon`
- `event`
- `rights`

## 4. Core APIs

- `readProgress()`
- `writeProgress()`
- `patchProgress()`

## 5. Domain APIs

- `enterActivity()`
- `completeTask()`
- `grantEventRelic()`
- `claimCoupon()`

## 6. Migration

兼容迁移以下旧 key：

- `dual_home_last_mode`
- `explore_map_selected_chapter_id`
- `loveqigu_synthesis_v1`
- `loveqigu_first_light_v1`

## 7. Success Marker

`USER_PROGRESS_CENTER_V1_COMPLETE = YES`

