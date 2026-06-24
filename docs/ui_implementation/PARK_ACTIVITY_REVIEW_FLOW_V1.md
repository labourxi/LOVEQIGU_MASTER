# PARK_ACTIVITY_REVIEW_FLOW_V1

## 1. 本轮目标

基于 `mock-source` / `park-admin-adapter` 打通园区活动发布检查 mock 数据闭环，覆盖：

- 活动草稿创建与保存
- 责任声明勾选与提交发布检查
- ReviewRecord 生成与平台 mock 审核回传
- 发布检查页结论展示（阻断原因、优化意见、补充项、下一步建议）
- 操作日志写入与页面可见
- 活动列表 / 详情状态语义与操作规则
- 参与商家明细分页（默认每页 10 家）

不接真实后端、不改 Runtime 数据结构、不做真实发布。

## 2. 前置依赖

| 依赖项 | 状态 |
|--------|------|
| DATA_ADAPTER_LAYER_V1 | PASS |
| ROLE_BASED_ADMIN_NAVIGATION_V1 | PASS |
| MERCHANT_REDEMPTION_DATA_FLOW_V1 | PASS |
| PARK_ADMIN_ADAPTER_READY | YES |
| ROLE_CONFIG_ADAPTER_READY | YES |

## 3. Mock 数据说明

文件：`apps/shared/data-adapter/mock-source.js`

### parks

`park_001` 爱企谷（华东，合作中）含 `contactName` / `contactPhone`。

### activities

| ID | 名称 | status | reviewStatus | publishCheckStatus | 说明 |
|----|------|--------|--------------|-------------------|------|
| activity_001 | 爱企谷初见寻宝节 | ACTIVE | APPROVED | PUBLISHED | 已上线活动 |
| activity_002 | 爱企谷夏日探索 | DRAFT | BLOCKED | BLOCKED | 阻断示例 |
| activity_003 | 湖畔夜游节 | DRAFT | PENDING_REVIEW | PENDING_REVIEW | 待审查示例 |

扩展字段：`linkedMerchantIds`、`linkedExplorationPointIds`、`declarationAccepted`、`declarationVersion` 等。

### reviewRecords

`review_001`（activity_002）含完整 `blockReason`、`optimizationSuggestion`、`needSupplement`、`nextStepSuggestion`。

### operationLogs

支持 `CREATE_ACTIVITY_DRAFT`、`SAVE_ACTIVITY_DRAFT`、`SUBMIT_PUBLISH_CHECK`、`VIEW_REVIEW_RESULT`、`RESUBMIT_PUBLISH_CHECK` 等 action，含 `beforeStatus` / `afterStatus` / `declarationVersion` / `statementConfirmed`。

## 4. 活动发布检查状态流转规则

```
DRAFT →（勾选声明）→ PENDING_REVIEW → mock 平台审核 → APPROVED | BLOCKED | NEED_INFO
BLOCKED / NEED_INFO → 修改 → 再次提交 → PENDING_REVIEW → …
ACTIVE / PUBLISHED / COMPLETED → 不显示「发布检查」主操作
```

规则实现于 `park-admin-adapter.js`：

1. 仅 `DRAFT` / `NEED_INFO` / `BLOCKED` 可提交发布检查
2. 未勾选声明返回 `DECLARATION_REQUIRED`
3. 提交后写入 `reviewRecords` + `operationLogs`
4. Mock 平台即时回传审核结论（礼遇未配置时阻断）

## 5. park-admin-adapter 方法说明

| 方法 | 说明 |
|------|------|
| `getParkDashboard(parkId)` | 园区看板 KPI |
| `getParkActivities(parkId, filters)` | 活动列表（含中文状态标签） |
| `getParkActivityDetail(activityId)` | 活动详情 + 操作 + 日志 |
| `getParkActivityDraftContext(parkId)` | 创建页草稿上下文 |
| `saveParkActivityDraft(payload, actor)` | 保存/创建草稿 |
| `submitParkActivityReview(activityId, declarationPayload, actor)` | **提交发布检查** |
| `getParkActivityPublishCheck(activityId)` | 发布检查页数据 |
| `getParkActivityReviewResult(activityId)` | 审核结论 |
| `getParticipatingMerchants(activityId, pagination)` | 参与商家明细 |
| `getParkMerchants(parkId, pagination)` | 园区商家列表 |
| `getParkOperationLogs(parkId, target)` | 操作日志 |
| `getActivityActions(activity)` | 列表/详情操作规则 |

Boot 加载：`apps/admin/park-admin/shared/park-adapter-boot.js`

## 6. 创建活动页接入说明

页面：`park_admin_activity_new/`

- 从 adapter 加载商家、探索点选项
- 保存草稿调用 `saveParkActivityDraft`
- 责任声明三条款 + 版本 `PARK_ACTIVITY_SUBMIT_DECLARATION_V1`
- 未勾选声明时「提交发布检查」禁用
- 勾选后可提交，调用 `submitParkActivityReview`

## 7. 发布检查页接入说明

页面：`park_admin_activity_publish_check/`

- `?activityId=activity_002` 展示阻断示例
- 展示检查项、结论、阻断原因、平台意见、补充项、下一步建议
- 操作日志时间线来自 adapter
- 进行中活动（activity_001）显示上线提示并隐藏发布检查主流程

## 8. 活动列表 / 活动详情接入说明

- `park_admin_activities/`：列表与卡片由 `getParkActivities` + `getActivityActions` 渲染
- `park_admin_activity_detail/?activityId=`：详情、状态徽章、操作按钮、最近日志

操作规则：

| 状态 | 显示 | 隐藏 |
|------|------|------|
| 草稿/待补充/已阻断 | 编辑、发布检查、查看检查结论 | — |
| 待审查 | 查看详情、查看检查结论 | 编辑、发布检查 |
| 已通过/待发布 | 等待平台发布 | — |
| 进行中 | 活动数据、运营建议、平台协助 | 发布检查 |
| 已结束 | 复盘、导出 | 发布检查 |

## 9. 操作日志说明

Session 内 `operationLogs` 在 adapter 写入；页面通过 `ParkAdapterBoot.renderOperationTimeline` 渲染。

每条日志含：时间、操作人、角色、园区、活动、操作类型、摘要、前后状态、声明版本、是否确认声明。

## 10. 责任声明说明

版本：`PARK_ACTIVITY_SUBMIT_DECLARATION_V1`

四条文案（三勾选 + 底部边界说明）与任务规格一致，用于创建页与发布检查页。

## 11. 参与商家明细说明

- `park-activity-merchants.js` 提供 `getPageData`，默认 `PAGE_SIZE = 10`
- adapter `getParticipatingMerchants` 优先调用该模块
- 活动详情 / 活动列表看板均挂载参与商家面板

## 12. 角色权限范围说明

结合 `ROLE_BASED_ADMIN_NAVIGATION_V1`：

- `park_admin`：本园区数据、创建草稿、提交检查、查看结论、商家、日志、工单
- `platform_admin` + `asPlatform=1`：代管视图，显示当前景区，可返回平台后台

## 13. 状态中文化说明

`status-map.js` 扩展 `activity` / `review` / `park` 域：

`DRAFT`→草稿、`PENDING_REVIEW`→待审查、`BLOCKED`→已阻断、`DECLARATION_REQUIRED`→需确认声明 等。

## 14. 不改动项

- 不接真实 API / 数据库
- 不改 Runtime 数据结构
- 不做真实发布
- 不重做园区后台 UI 视觉
- 不修改商家后台主流程
- 不把 mock 审查当正式审核

## 15. 风险点

1. Adapter session 为内存态，刷新页面后新建草稿保留、但跨页 session 与 localStorage 旧 `park-operation-log.js` 可能并存
2. Mock 平台审核为即时规则，与真实异步审核流程不同
3. `activity_001` 参与商家明细仍主要来自 `park-activity-merchants.js` 静态种子

## 16. 下一步建议

1. **PLATFORM_REVIEW_PUBLISH_FLOW_V1**：平台侧审核队列与发布中心 mock
2. 将 `park-operation-log.js` 完全迁移至 adapter 或统一 session 持久化
3. 真实 API 接入时替换 `mockPlatformReview` 为轮询/Webhook

## 17. 验收标记

```
PARK_ACTIVITY_REVIEW_FLOW_V1_CREATED = YES
PARK_ACTIVITY_REVIEW_MOCK_DATA_READY = YES
PARK_ACTIVITY_REVIEW_STATUS_FLOW_READY = YES
PARK_ACTIVITY_SUBMIT_DECLARATION_REQUIRED = YES
PARK_ADMIN_ADAPTER_REVIEW_METHODS_READY = YES
PARK_ACTIVITY_CREATE_PAGE_ADAPTER_CONNECTED = YES
PARK_ACTIVITY_DECLARATION_UI_READY = YES
PARK_ACTIVITY_SUBMIT_BUTTON_DISABLED_UNTIL_DECLARED = YES
PARK_PUBLISH_CHECK_PAGE_ADAPTER_CONNECTED = YES
PARK_PUBLISH_CHECK_RESULT_DETAIL_READY = YES
PARK_PUBLISH_BLOCK_REASON_VISIBLE = YES
PARK_PLATFORM_REVIEW_ADVICE_VISIBLE = YES
PARK_ACTIVITIES_PAGE_ADAPTER_CONNECTED = YES
PARK_ACTIVITY_DETAIL_PAGE_ADAPTER_CONNECTED = YES
PARK_ACTIVITY_CHECK_SEMANTIC_READY = YES
PARK_OPERATION_LOG_MOCK_WRITE_READY = YES
PARK_OPERATION_LOG_VISIBLE = YES
PARK_PARTICIPATING_MERCHANT_DETAIL_ADAPTER_CONNECTED = YES
PARK_ACTIVITY_MERCHANT_DEFAULT_SHOW_TOP_10 = YES
PARK_ACTIVITY_REVIEW_ROLE_SCOPE_READY = YES
PARK_ACTIVITY_REVIEW_STATUS_CHINESE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PLATFORM_REVIEW_PUBLISH_FLOW_V1 = YES
```

## 人工验收路径

1. 活动列表：状态中文；草稿显示发布检查；进行中隐藏发布检查
2. 创建活动：声明未勾选不可提交；勾选后可提交
3. 发布检查 `?activityId=activity_002`：阻断原因与平台意见可见
4. 操作日志：含提交记录与声明版本
5. 商家数据：明细与分页
6. 平台代管：`park_admin_dashboard/?asPlatform=1&parkId=park_001&role=platform_admin`
