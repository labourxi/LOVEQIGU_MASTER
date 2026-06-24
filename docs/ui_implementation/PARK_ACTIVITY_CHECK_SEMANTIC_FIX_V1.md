# PARK_ACTIVITY_CHECK_SEMANTIC_FIX_V1

## 1. 问题说明

园区后台浏览器验收反馈：「发布检查」被误用于进行中活动，与上线后运营协作概念混淆。

**修正原则：**

- **发布检查** = 活动上线前的平台协同审查（草稿 / 待提交 / 待审核 / 已阻断 / 待补充 / 待发布）
- **运营建议 / 活动表现 / 申请平台协助** = 进行中活动的协作动作
- 历史检查信息通过「查看历史检查结论」「平台上线检查记录」访问

---

## 2. 状态与按钮规则

| 活动状态 | 主操作 | 不显示 |
|----------|--------|--------|
| 进行中 / 已发布 | 返回列表、查看活动数据、查看运营建议、申请平台协助 | 发布检查（主按钮） |
| 草稿 / 待审核 / 已阻断等 | 发布检查、提交工单咨询 | — |
| 进行中（历史） | 查看历史检查结论 | 发布检查（主流程） |

**实现：** `apps/admin/park-admin/shared/park-activity-status.js` — `ParkActivityStatus.shouldShowPublishCheck()`

---

## 3. 修改页面清单

| 文件 | 变更 |
|------|------|
| `park_admin_activity_detail/index.html` | 默认进行中：运营动作 + 历史检查；`?status=DRAFT` 等显示发布检查 |
| `park_admin_activities/index.html` | 进行中行移除发布检查主操作；草稿/阻断行保留 |
| `park_admin_activity_publish_check/index.html` | `?mode=history` 历史记录；`?status=ACTIVE` 提示已上线 |
| `shared/park-activity-status.js` | **新增** 状态判断工具 |

---

## 4. 不改动项

- Runtime 数据结构、接口、权限逻辑、页面架构

---

## 5. 验收标记

```
PARK_ACTIVITY_CHECK_SEMANTIC_FIX_V1_CREATED = YES
PARK_PUBLISH_CHECK_ONLY_BEFORE_LAUNCH = YES
PARK_ACTIVE_ACTIVITY_HIDE_PUBLISH_CHECK = YES
PARK_ACTIVE_ACTIVITY_SHOW_OPERATION_ACTIONS = YES
PARK_REVIEW_HISTORY_STILL_ACCESSIBLE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PARK_ADMIN_FINAL_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16*
