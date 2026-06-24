# PLATFORM_REVIEW_PUBLISH_FLOW_V1

## 1. 本轮目标

基于 `mock-source` / `platform-admin-adapter` / 共享 `adapter-session` 打通平台审查中心与发布中心 mock 数据闭环，覆盖：

- 审查队列与审查详情
- 审查决策（通过 / 驳回 / 待补充 / 阻断）
- 发布队列与 Mock Runtime 发布占位
- 发布日志
- 平台 Dashboard 统计联动
- 园区端发布检查结论回读
- 内容生产线审查 / 发布状态联动

不接真实 API、不改 Runtime 数据结构、不做真实发布。

## 2. 前置依赖

| 依赖项 | 状态 |
|--------|------|
| DATA_ADAPTER_LAYER_V1 | PASS |
| ROLE_BASED_ADMIN_NAVIGATION_V1 | PASS |
| MERCHANT_REDEMPTION_DATA_FLOW_V1 | PASS |
| PARK_ACTIVITY_REVIEW_FLOW_V1 | PASS |

## 3. Mock 数据说明

文件：`apps/shared/data-adapter/mock-source.js`

### reviewRecords

扩展字段：`targetName`、`sourceModule`、`reviewerName` 等。

覆盖 targetType：activity、exploration_point、relic、blessing_content、ar_content、art_request、coupon。

示例：

- `review_activity_001` — 湖畔夜游节 · 待审查
- `review_relic_001` — 初见印记 · 待审查
- `review_ar_001` — 入口显现仪式 · 已通过

### publishRecords

字段含 `reviewStatus`、`publishCheckStatus`、`runtimeStatus`、`riskStatus`。

示例：`publish_ar_001`（READY）、`publish_failed_001`（PUBLISH_FAILED）

### publishLogs

操作：CREATE_PUBLISH_RECORD、START_PUBLISH、PUBLISH_SUCCESS、PUBLISH_FAILED 等。

### 共享 Session

`adapter-session.js` 提供 `LQGAdapterSession`，园区与平台 adapter 共用同一份内存数据。

## 4. 平台审查状态流转规则

```
PENDING_REVIEW → APPROVED → 创建 publishRecord → 发布中心
PENDING_REVIEW → NEED_INFO / BLOCKED / REJECTED → 同步园区 activity（如适用）
```

实现于 `platform-admin-adapter.submitReviewDecision`。

## 5. 平台发布状态流转规则

```
READY_TO_PUBLISH + runtimeStatus=READY → PUBLISHING → PUBLISHED
                                      ↘ PUBLISH_FAILED（Mock 规则）
BLOCKED / NEED_INFO / REJECTED / PENDING_REVIEW → 不可发布
```

实现于 `platform-admin-adapter.publishTarget`。

## 6. platform-admin-adapter 方法说明

| 方法 | 说明 |
|------|------|
| `getPlatformDashboard()` | 待审查 / 待发布 / 阻断 / 失败统计 |
| `getReviewQueue(filters)` | 审查队列 |
| `getReviewDetail(reviewId)` | 审查详情 |
| `submitReviewDecision(reviewId, payload, actor)` | **审查决策** |
| `getPublishQueue(filters)` | 发布队列 |
| `getPublishDetail(publishId)` | 发布详情 + 日志 |
| `publishTarget(publishId, actor)` | **Mock 发布** |
| `getPublishLogs(publishId)` | 发布日志 |
| `getReviewStatusForTarget(type, id)` | 内容生产联动 |
| `getPublishStatusForTarget(type, id)` | 内容生产联动 |

Boot：`apps/admin/platform-admin/shared/platform-adapter-boot.js`

## 7. 审查中心接入说明

页面：`apps/admin/platform-admin/reviews/index.html`

- 类型筛选（活动 / 信物 / AR内容等）
- 队列列表 + 右侧详情面板
- 审查操作表单与四态决策按钮

## 8. 审查详情接入说明

详情面板展示：基础信息、来源模块、审查意见、阻断原因、优化建议、补充项、下一步建议。

## 9. 发布中心接入说明

页面：`apps/admin/platform-admin/publish/index.html`

- 顶部 Mock Runtime 风险提示
- 待发布队列（审查 / 发布检查 / Runtime / 风险状态）
- 发布按钮仅 `canPublish` 时可用
- 发布确认弹窗
- 详情 + 发布日志面板

## 10. 发布日志说明

`getPublishLogs` 返回带中文化 actionLabel 的日志列表，页面通过 `PlatformAdapterBoot.renderPublishLogs` 渲染。

## 11. 平台 Dashboard 联动说明

页面：`apps/admin/platform-admin/dashboard/index.html`

从 `getPlatformDashboard` 动态填充 KPI、待处理事项、发布队列摘要、风险提醒。

## 12. 园区端回传联动说明

园区 `park-admin-adapter` 与平台共用 `LQGAdapterSession.reviewRecords`。

平台审查 activity 后，园区 `getParkActivityPublishCheck` 可读取最新 `blockReason` / `needSupplement` 等。

园区提交发布检查后保持 `PENDING_REVIEW`，由平台审查中心处理（已移除园区侧自动 mock 回传）。

## 13. 内容生产线联动说明

`content-production-adapter` 通过 `getReviewStatusForTarget` / `getPublishStatusForTarget`  enrich 信物 / AR 列表。

已接入：`platform_relics`、`platform_ar_content`。

## 14. 角色权限范围说明

- `platform_admin`：审查中心、发布中心、Dashboard 统计
- `park_admin`：仅查看本园区检查结论，不可访问平台审查 / 发布中心
- `merchant_admin`：不可访问平台审查 / 发布中心

## 15. 状态中文化说明

`status-map.js` 扩展 `runtime`、`risk` 域及 publish 域 `PUBLISHING`、`ROLLBACK_READY` 等。

## 16. Mock Runtime 风险提示

发布中心顶部固定展示：

> 当前为 Mock Runtime 发布占位，用于验证发布流程，不代表内容已真实上线。

## 17. 不改动项

- 不接真实 API / 数据库
- 不改 Runtime 真实数据
- 不做真实发布
- 不重做平台 UI 视觉
- 不把 mock 审查 / 发布当正式流程

## 18. 风险点

1. 共享 session 仅在同一浏览器上下文有效，刷新后重置为 mock 种子
2. 与旧 `mock-store.js` / `platform_release` localStorage 并存，平台发布页已迁移至 adapter
3. Mock 发布失败规则为硬编码（如 `relic_002`）

## 19. 下一步建议

1. **CONTENT_PRODUCTION_DATA_FLOW_V1**：内容生产提交审查完整闭环
2. Session 持久化到 sessionStorage 便于跨页演示
3. 真实 API 接入时替换 `publishTarget` 为异步任务轮询

## 20. 验收标记

```
PLATFORM_REVIEW_PUBLISH_FLOW_V1_CREATED = YES
PLATFORM_REVIEW_PUBLISH_MOCK_DATA_READY = YES
PLATFORM_REVIEW_STATUS_FLOW_READY = YES
PLATFORM_PUBLISH_STATUS_FLOW_READY = YES
PLATFORM_ADMIN_ADAPTER_REVIEW_METHODS_READY = YES
PLATFORM_ADMIN_ADAPTER_PUBLISH_METHODS_READY = YES
PLATFORM_REVIEW_PAGE_ADAPTER_CONNECTED = YES
PLATFORM_REVIEW_QUEUE_VISIBLE = YES
PLATFORM_REVIEW_DECISION_ACTIONS_READY = YES
PLATFORM_REVIEW_NO_VERTICAL_TEXT_BUG = YES
PLATFORM_REVIEW_DETAIL_READY = YES
PLATFORM_REVIEW_RESULT_DETAIL_READY = YES
PLATFORM_PUBLISH_PAGE_ADAPTER_CONNECTED = YES
PLATFORM_PUBLISH_QUEUE_VISIBLE = YES
PLATFORM_PUBLISH_ACTION_READY = YES
PLATFORM_PUBLISH_RUNTIME_STATUS_VISIBLE = YES
PLATFORM_PUBLISH_LOG_READY = YES
PLATFORM_DASHBOARD_REVIEW_PUBLISH_STATS_READY = YES
PARK_REVIEW_RESULT_SYNC_FROM_PLATFORM_READY = YES
CONTENT_PRODUCTION_REVIEW_PUBLISH_SYNC_READY = YES
PLATFORM_REVIEW_PUBLISH_ROLE_SCOPE_READY = YES
PLATFORM_REVIEW_PUBLISH_STATUS_CHINESE = YES
PLATFORM_MOCK_RUNTIME_NOTICE_VISIBLE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_CONTENT_PRODUCTION_DATA_FLOW_V1 = YES
```

## 人工验收路径

| 场景 | URL |
|------|-----|
| 审查中心 | `platform-admin/reviews/` |
| 发布中心 | `platform-admin/publish/` |
| 平台总览 | `platform-admin/dashboard/` |
| 园区发布检查 | `park-admin/park_admin_activity_publish_check/?activityId=activity_002` |
| 信物管理 | `platform-admin/platform_relics/` |
