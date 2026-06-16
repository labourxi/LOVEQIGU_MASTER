# USER_PROGRESS_CENTER_V1_REPORT

## Summary

- 已建立统一用户进度中心。
- 已新增 `apps/miniapp/services/user-progress/`。
- 主 key 为 `loveqigu_user_progress_v1`。
- 已实现：
  - `readProgress()`
  - `writeProgress()`
  - `patchProgress()`
  - `enterActivity()`
  - `completeTask()`
  - `grantEventRelic()`
  - `claimCoupon()`

## Files

- `apps/miniapp/services/user-progress/user-progress-store.js`
- `apps/miniapp/services/user-progress/user-progress-event.js`
- `apps/miniapp/services/user-progress/user-progress-canonical.js`
- `apps/miniapp/services/user-progress/user-progress-rights.js`
- `apps/miniapp/services/user-progress/user-progress-migrate.js`
- `apps/miniapp/services/user-progress/validate_user_progress.js`
- `apps/miniapp/services/user-progress/migration_report.json`

## Migration

已兼容迁移：

- `dual_home_last_mode`
- `explore_map_selected_chapter_id`
- `loveqigu_synthesis_v1`
- `loveqigu_first_light_v1`

## Validation

- `python -m py_compile` 不适用
- `node apps/miniapp/services/user-progress/validate_user_progress.js` 通过
- 旧 key 迁移成功
- 新 store 读写成功
- event 状态保存成功

## Safety

- 未修改 Visual Factory
- 未修改 Content Factory
- 未修改 Governance
- 未修改 Release

## Success Marker

`USER_PROGRESS_CENTER_V1_COMPLETE = YES`

