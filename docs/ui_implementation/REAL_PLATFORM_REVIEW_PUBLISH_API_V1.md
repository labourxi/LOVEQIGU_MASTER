# REAL_PLATFORM_REVIEW_PUBLISH_API_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的平台审查与发布真实接口接入方案。

Phase 2 已完成 `PLATFORM_REVIEW_PUBLISH_FLOW_V1`，实现了平台审查队列、审查详情、通过 / 驳回 / 待补充 / 阻断、审查通过进入发布中心、Mock Runtime 发布占位、发布日志、平台 Dashboard 统计、园区端回读审查结论、内容生产线审查 / 发布状态联动的 mock 数据闭环。

Phase 3 已完成 `AUTH_ROLE_IDENTITY_PLAN_V1`，明确了真实身份、token、permission scope、platform_admin 权限边界、平台代管上下文和审计日志原则。

Phase 3 已完成 `REAL_PARK_ACTIVITY_REVIEW_API_V1`，明确了园区端只负责提交发布检查与回读平台审查结果，审查决策和 Runtime 发布归属平台 API。

本文件用于将平台审查与发布从 mock adapter 流程推进到真实 API 设计阶段，为后续真实接口实现提供标准。

本轮只做规划，不直接接真实后端。

---

## 2. 本轮目标

本轮目标：

1. 定义平台审查中心真实 API 范围
2. 定义平台发布中心真实 API 范围
3. 定义平台管理员权限边界
4. 定义 reviewRecord 审查决策规则
5. 定义 publishRecord / publishTask 生成规则
6. 定义 Runtime 发布状态流转规则
7. 定义发布日志 publishLog 规则
8. 定义审查结果如何回写园区活动
9. 定义审查结果如何回写内容生产对象
10. 定义平台 Dashboard 审查 / 发布统计规则
11. 定义平台代管与审计日志要求
12. 定义错误码与前端中文提示
13. 定义 platform-admin-adapter 从 mock 到真实 API 的替换边界
14. 定义后续真实接口实施顺序

---

## 3. 当前基础

已完成基础：

1. DATA_ADAPTER_LAYER_V1
2. PLATFORM_REVIEW_PUBLISH_FLOW_V1
3. PARK_ACTIVITY_REVIEW_FLOW_V1
4. CONTENT_PRODUCTION_DATA_FLOW_V1
5. ADAPTER_SESSION_PERSISTENCE_V1
6. AUTH_ROLE_IDENTITY_PLAN_V1
7. REAL_PARK_ACTIVITY_REVIEW_API_V1

当前已有相关文件：

1. apps/shared/data-adapter/platform-admin-adapter.js
2. apps/shared/data-adapter/park-admin-adapter.js
3. apps/shared/data-adapter/content-production-adapter.js
4. apps/shared/data-adapter/adapter-session.js
5. apps/shared/data-adapter/mock-source.js
6. apps/shared/data-adapter/status-map.js
7. apps/shared/data-adapter/role-map.js

当前 mock 已验证：

1. 平台审查中心可读取 reviewRecords
2. 平台审查详情可展示对象信息
3. 平台可执行 APPROVED / REJECTED / NEED_INFO / BLOCKED
4. 审查通过后可生成 publishRecord
5. 发布中心可读取待发布队列
6. Mock Runtime 发布占位可更新 publishStatus / runtimeStatus
7. 发布日志可见
8. 园区发布检查页可回读平台意见
9. 内容生产对象可同步审查 / 发布状态
10. 平台 Dashboard 可显示审查 / 发布统计

---

## 4. 真实角色与权限边界

### 4.1 platform_admin

平台管理员 / 平台超管。

可访问：平台总览、审查中心、发布中心、发布日志、景区 / 活动管理、内容生产线、卡券分析、工单、系统设置。

可执行：审查决策、发布任务、回滚申请占位、代管园区 / 商家视图。

不可绕过：

1. 不可跳过审查直接发布未通过对象
2. 不可发布 BLOCKED / NEED_INFO / REJECTED 对象
3. 不可直接篡改园区提交原始信息
4. 不可不留日志执行审查 / 发布
5. 不可绕过 Runtime 发布任务直接改前端状态

### 4.2 park_admin

不可访问平台审查 / 发布写接口；仅通过园区 API 回读审查结果。

### 4.3 内容生产角色

可提交内容审查、查看状态；不可自行决策或发布 Runtime。

### 4.4 权限 scope

| Scope | 说明 |
|-------|------|
| platform.dashboard.read | 平台总览 |
| platform.review.read | 审查队列 / 详情 / 日志 |
| platform.review.write | 审查决策 |
| platform.publish.read | 发布队列 / 详情 / 日志 |
| platform.publish.write | 执行发布 |
| platform.publish.rollback_request | 回滚申请占位 |
| platform.content.read | 内容生产只读 |
| platform.content.write | 内容生产写入 |
| platform.activity.read | 活动管理只读 |
| platform.scenic.read | 景区管理只读 |
| platform.ticket.read | 工单只读 |
| platform.system.manage | 系统设置 |
| platform.impersonate.park | 代管园区视图 |
| platform.impersonate.merchant | 代管商家视图 |

---

## 5. 真实数据对象

### 5.1 reviewRecords

平台审查记录。由园区 `submit-review`、内容生产提交审查或平台代管触发创建。

```json
{
  "id": "review_001",
  "targetType": "activity",
  "targetId": "activity_001",
  "targetName": "爱企谷初见寻宝节",
  "parkId": "park_001",
  "activityId": "activity_001",
  "sourceModule": "park_activity_publish_check",
  "submittedBy": "park_admin_001",
  "submittedRole": "park_admin",
  "status": "PENDING_REVIEW",
  "reviewConclusion": null,
  "blockReason": null,
  "optimizationSuggestion": null,
  "needSupplement": null,
  "nextStepSuggestion": null,
  "reviewerId": null,
  "reviewerName": null,
  "reviewerRole": null,
  "submittedAt": "2026-06-20T11:05:00+08:00",
  "reviewedAt": null,
  "createdAt": "2026-06-20T11:05:00+08:00",
  "updatedAt": "2026-06-20T11:05:00+08:00"
}
```

**targetType 支持：**

| targetType | 说明 | 典型 sourceModule |
|------------|------|-------------------|
| activity | 园区活动 | park_activity_publish_check |
| exploration_point | 探索点 | content_production_exploration_point |
| relic | 信物（故事进度资产） | content_production_relic |
| blessing_content | 祝福内容 | content_production_blessing |
| ar_content | AR 内容 | content_production_ar |
| art_request | 美术需求单 | content_production_art_request |
| coupon | 卡券 / 礼遇模板 | merchant_coupon_submit / park_activity_coupon |
| merchant | 商家入驻 / 资质变更 | park_merchant_onboarding |

| 字段 | 说明 |
|------|------|
| status | PENDING_REVIEW / APPROVED / REJECTED / NEED_INFO / BLOCKED |
| reviewConclusion | 审查结论摘要 |
| blockReason | 阻断原因（BLOCKED 必填） |
| optimizationSuggestion | 优化建议 |
| needSupplement | 待补充项（NEED_INFO 必填） |
| nextStepSuggestion | 下一步建议 |
| reviewerId / reviewerName / reviewerRole | 平台审查人信息 |
| submittedAt / reviewedAt | 提交 / 审查完成时间 |

与 Phase 2 `mock-source.reviewRecords` 及 `submitReviewDecision` 行为对齐。

### 5.2 publishRecords

平台发布记录。审查通过（APPROVED）后创建或更新；发布中心队列主对象。

```json
{
  "id": "publish_001",
  "reviewId": "review_001",
  "targetType": "activity",
  "targetId": "activity_001",
  "targetName": "爱企谷初见寻宝节",
  "parkId": "park_001",
  "activityId": "activity_001",
  "reviewStatus": "APPROVED",
  "publishCheckStatus": "READY_TO_PUBLISH",
  "publishStatus": "READY_TO_PUBLISH",
  "runtimeStatus": "READY",
  "riskStatus": "NORMAL",
  "publishTaskId": null,
  "publishedBy": null,
  "publisherName": null,
  "publishedAt": null,
  "createdAt": "2026-06-20T12:00:00+08:00",
  "updatedAt": "2026-06-20T12:00:00+08:00"
}
```

| 字段 | 说明 |
|------|------|
| reviewId | 关联 reviewRecord.id |
| reviewStatus | 须为 APPROVED 才可发布 |
| publishCheckStatus | READY_TO_PUBLISH / PUBLISHING / PUBLISHED / PUBLISH_FAILED / BLOCKED |
| publishStatus | 与 publishCheckStatus 对齐，供 adapter 装饰 |
| runtimeStatus | NOT_READY / READY / PUBLISHING / PUBLISHED / FAILED |
| riskStatus | NORMAL / WARNING / BLOCKED |
| publishTaskId | 当前或最近一次发布任务 ID |
| publishedBy / publisherName / publishedAt | 发布执行人信息 |

Mock Phase 2 部分记录含 `log` 文本字段；真实环境以 `publishLogs` 为准。

### 5.3 publishTasks

真实 Runtime 发布任务。Mock Phase 2 在 `publishTarget` 内同步完成；真实环境独立表或消息队列，不应同步直接完成。

```json
{
  "id": "task_001",
  "publishRecordId": "publish_001",
  "targetType": "activity",
  "targetId": "activity_001",
  "runtimeTarget": "user_app_runtime",
  "payloadVersion": "v1",
  "status": "PENDING",
  "startedAt": null,
  "completedAt": null,
  "errorCode": null,
  "errorMessage": null,
  "createdBy": "platform_admin_001",
  "createdAt": "2026-06-20T12:10:00+08:00",
  "updatedAt": "2026-06-20T12:10:00+08:00"
}
```

**status 支持：**

1. PENDING — 已创建，待执行
2. RUNNING — 发布执行中
3. SUCCESS — 发布成功
4. FAILED — 发布失败
5. CANCELLED — 已取消（规划层）

**生成规则：**

1. `submitReviewDecision(APPROVED)` 仅 upsert `publishRecord`，不自动创建 `publishTask`
2. `POST /publishes/:id/publish` 时创建 `publishTask`
3. 同一 `publishRecordId` 同时仅允许一个 RUNNING 任务

### 5.4 publishLogs

发布日志。专用于发布链路，与园区 `operationLogs` 分离。

```json
{
  "id": "publish_log_001",
  "publishRecordId": "publish_001",
  "publishTaskId": "task_001",
  "actorId": "platform_admin_001",
  "actorRole": "platform_admin",
  "action": "PUBLISH_START",
  "beforeStatus": "READY_TO_PUBLISH",
  "afterStatus": "PUBLISHING",
  "summary": "开始发布到 Mock Runtime / Runtime 目标环境",
  "errorCode": null,
  "impersonationContext": null,
  "clientInfo": {
    "ip": "0.0.0.0",
    "userAgent": "placeholder"
  },
  "createdAt": "2026-06-20T12:10:00+08:00"
}
```

| action | 触发时机 |
|--------|----------|
| CREATE_PUBLISH_RECORD | 审查通过创建发布记录 |
| PUBLISH_START | 开始发布任务 |
| PUBLISH_SUCCESS | 发布成功 |
| PUBLISH_FAILED | 发布失败 |
| ROLLBACK_REQUEST | 回滚申请占位 |

Mock Phase 2 使用 `START_PUBLISH` 等 action 名；api mode 统一映射为上述规范 action，adapter 层做兼容。

### 5.5 reviewLogs

审查日志。审查决策必须写入。

```json
{
  "id": "review_log_001",
  "reviewId": "review_001",
  "actorId": "platform_admin_001",
  "actorRole": "platform_admin",
  "action": "REVIEW_DECISION",
  "decision": "APPROVED",
  "beforeStatus": "PENDING_REVIEW",
  "afterStatus": "APPROVED",
  "summary": "平台审查通过",
  "createdAt": "2026-06-20T11:40:00+08:00"
}
```

实施阶段可与 `operationLogs` 合并存储，但字段须完整；园区端 operationLogs 可读性须保持一致。

---

## 6. 真实 API 范围

基础路径：`/api/v1/platform`

所有请求必须携带：

1. `Authorization: Bearer <token>`
2. 服务端校验 `platform_admin` 身份
3. 服务端校验 permission scope
4. 写操作携带 `actorId` / `actorRole`
5. 高风险操作写入审计日志

### 6.1 平台 Dashboard

**GET** `/platform/dashboard`

权限：`platform.dashboard.read`

返回：

1. pendingReviewCount
2. pendingPublishCount
3. blockedCount
4. publishFailedCount
5. recentReviews
6. recentPublishes
7. riskAlerts
8. pendingTickets

### 6.2 审查队列

**GET** `/platform/reviews`

权限：`platform.review.read`

支持筛选：

1. targetType
2. status
3. parkId
4. activityId
5. sourceModule
6. submittedRole
7. dateRange

返回审查队列。

### 6.3 审查详情

**GET** `/platform/reviews/:reviewId`

权限：`platform.review.read`

返回：

1. reviewRecord
2. targetSnapshot
3. submittedBy
4. sourceModule
5. latestReviewLog
6. relatedPublishRecord（可选）

### 6.4 审查决策

**POST** `/platform/reviews/:reviewId/decision`

权限：`platform.review.write`

请求：

```json
{
  "decision": "APPROVED",
  "reviewConclusion": "活动内容完整，可进入发布中心。",
  "blockReason": null,
  "optimizationSuggestion": "建议上线后关注首日核销数据。",
  "needSupplement": null,
  "nextStepSuggestion": "可进入发布中心。"
}
```

**decision 支持：**

1. APPROVED
2. REJECTED
3. NEED_INFO
4. BLOCKED

成功响应：

```json
{
  "ok": true,
  "status": "APPROVED",
  "statusLabel": "已通过",
  "reviewRecord": {},
  "publishRecord": {},
  "message": "审查已通过，内容已进入发布中心。"
}
```

### 6.5 发布队列

**GET** `/platform/publishes`

权限：`platform.publish.read`

支持筛选：

1. targetType
2. publishStatus
3. runtimeStatus
4. riskStatus
5. parkId
6. activityId

### 6.6 发布详情

**GET** `/platform/publishes/:publishId`

权限：`platform.publish.read`

返回：

1. publishRecord
2. targetSnapshot
3. reviewRecord
4. publishTask
5. publishLogs

### 6.7 执行发布

**POST** `/platform/publishes/:publishId/publish`

权限：`platform.publish.write`

请求：

```json
{
  "confirm": true,
  "runtimeTarget": "user_app_runtime",
  "note": "确认发布到用户端 Runtime。"
}
```

成功响应：

```json
{
  "ok": true,
  "status": "PUBLISHING",
  "statusLabel": "发布中",
  "publishRecord": {},
  "publishTask": {},
  "message": "发布任务已创建，请稍后查看发布结果。"
}
```

真实发布不应同步直接完成，应创建 `publishTask`。

### 6.8 发布日志

**GET** `/platform/publishes/:publishId/logs`

权限：`platform.publish.read`

返回 publishLogs。

### 6.9 回滚申请占位

**POST** `/platform/publishes/:publishId/rollback-request`

权限：`platform.publish.rollback_request`

本阶段规划为占位，不直接执行真实回滚。

---

## 7. 审查状态流转规则

### 7.1 reviewRecord 状态

状态：

1. PENDING_REVIEW — 待审查
2. APPROVED — 已通过
3. NEED_INFO — 待补充
4. BLOCKED — 已阻断
5. REJECTED — 已驳回

允许流转：

```
PENDING_REVIEW → APPROVED   → 生成 publishRecord
PENDING_REVIEW → NEED_INFO  → 回写提交方
PENDING_REVIEW → BLOCKED    → 回写提交方
PENDING_REVIEW → REJECTED   → 回写提交方
```

不允许：

1. APPROVED 再改 BLOCKED，需创建二次审查流程
2. 非 platform_admin 修改 reviewStatus
3. 园区端直接修改 reviewStatus
4. 内容生产端直接修改 reviewStatus

### 7.2 APPROVED 后规则

审查通过后：

1. reviewRecord.status = APPROVED
2. 写入 reviewLog
3. 生成 publishRecord
4. publishRecord.publishStatus = READY_TO_PUBLISH
5. publishRecord.runtimeStatus = READY
6. 回写 target.reviewStatus = APPROVED
7. 回写 target.publishStatus = READY_TO_PUBLISH
8. 园区 / 内容生产端可读到最新状态

### 7.3 NEED_INFO / BLOCKED / REJECTED 后规则

需要写入：

1. reviewRecord.status
2. reviewConclusion
3. blockReason
4. optimizationSuggestion
5. needSupplement
6. nextStepSuggestion
7. reviewedAt
8. reviewLog
9. 回写 target.reviewStatus
10. 回写园区 / 内容生产端可读结果

---

## 8. 发布状态流转规则

### 8.1 publishRecord 状态

状态：

1. READY_TO_PUBLISH — 待发布
2. PUBLISHING — 发布中
3. PUBLISHED — 已发布
4. PUBLISH_FAILED — 发布失败
5. ROLLBACK_REQUESTED — 已申请回滚
6. ROLLBACK_READY — 可回滚

### 8.2 runtimeStatus

状态：

1. NOT_READY
2. READY
3. SYNCING
4. PUBLISHED
5. FAILED
6. ROLLBACK_READY

### 8.3 publishTask 状态

状态：

1. PENDING
2. RUNNING
3. SUCCESS
4. FAILED
5. CANCELLED

### 8.4 发布规则

只有满足以下条件才可发布：

1. publishRecord.reviewStatus = APPROVED
2. publishRecord.publishStatus = READY_TO_PUBLISH
3. publishRecord.runtimeStatus = READY
4. riskStatus != BLOCKED
5. actor 具备 platform.publish.write
6. confirm = true

**发布开始：**

1. 创建 publishTask
2. publishRecord.publishStatus = PUBLISHING
3. publishRecord.runtimeStatus = SYNCING
4. 写入 publishLog: PUBLISH_START

**发布成功：**

1. publishTask.status = SUCCESS
2. publishRecord.publishStatus = PUBLISHED
3. publishRecord.runtimeStatus = PUBLISHED
4. publishRecord.publishedBy = actorId
5. publishRecord.publishedAt = now
6. 回写 target.publishStatus = PUBLISHED
7. 回写 target.runtimeStatus = PUBLISHED
8. 写入 publishLog: PUBLISH_SUCCESS

**发布失败：**

1. publishTask.status = FAILED
2. publishRecord.publishStatus = PUBLISH_FAILED
3. publishRecord.runtimeStatus = FAILED
4. 写入 errorCode / errorMessage
5. 写入 publishLog: PUBLISH_FAILED

Mock Phase 2 在 `publishTarget` 内同步完成；真实环境为异步任务 + 轮询。

---

## 9. 平台审查结果回写规则

### 9.1 回写园区活动

当 targetType = activity：

平台审查决策后必须回写：

1. activities.reviewStatus
2. activities.publishCheckStatus
3. activities.publishStatus
4. reviewRecords 最新结论

园区端通过：

1. `GET /park/activities/:activityId/publish-check`
2. `GET /park/activities/:activityId/review-result`

回读结果。

### 9.2 回写内容生产对象

当 targetType = exploration_point / relic / blessing_content / ar_content / art_request：

平台审查决策后必须回写对应对象：

1. reviewStatus
2. publishStatus
3. runtimeStatus
4. blockReason / needSupplement（可选）

内容生产页面通过 `content-production-adapter` 读取。

### 9.3 发布成功后回写

发布成功后：

1. activity / content object publishStatus = PUBLISHED
2. runtimeStatus = PUBLISHED
3. 用户端只读取已发布 / 可用内容
4. 未发布、阻断、待补充内容不进入用户端主列表

---

## 10. 平台发布与 Runtime 边界

平台发布 API 不应直接等同「前端页面可见」。

真实 Runtime 发布应分层：

1. 平台审查：决定内容是否可发布
2. 发布中心：创建 publishRecord
3. publishTask：执行发布任务
4. Runtime Sync：同步到用户端可读 Runtime 数据
5. 用户端 Adapter：读取已发布数据

禁止：

1. 前端手动改 runtimeStatus
2. 园区端发布 Runtime
3. 内容生产端绕过发布中心
4. 未审查通过内容进入用户端
5. 发布失败仍显示已上线

---

## 11. 操作日志与审计要求

以下操作必须写日志：

1. 查看审查详情
2. 审查通过
3. 审查驳回
4. 要求补充
5. 阻断
6. 创建 publishRecord
7. 开始发布
8. 发布成功
9. 发布失败
10. 申请回滚
11. 查看发布日志
12. 平台代管操作

日志字段：

1. id
2. actorId
3. actorRole
4. action
5. targetType
6. targetId
7. beforeStatus
8. afterStatus
9. reviewId
10. publishId
11. publishTaskId
12. reason
13. errorCode
14. impersonationContext
15. clientInfo
16. createdAt

---

## 12. 错误码与中文提示

| errorCode | 中文提示 |
| --------- | -------- |
| AUTH_REQUIRED | 请先登录 |
| TOKEN_EXPIRED | 登录已过期，请重新登录 |
| SCOPE_DENIED | 当前账号无权执行该操作 |
| REVIEW_NOT_FOUND | 未找到审查记录 |
| REVIEW_STATUS_NOT_ALLOWED | 当前审查状态不可执行该操作 |
| REVIEW_DECISION_INVALID | 审查结论无效 |
| TARGET_NOT_FOUND | 未找到审查对象 |
| PUBLISH_RECORD_NOT_FOUND | 未找到发布记录 |
| PUBLISH_NOT_READY | 当前内容尚未达到发布条件 |
| RUNTIME_STATUS_INVALID | Runtime 状态不允许发布 |
| RISK_BLOCKED | 当前内容存在风险阻断，不可发布 |
| PUBLISH_TASK_FAILED | 发布任务失败，请查看日志 |
| PUBLISH_ALREADY_RUNNING | 当前内容正在发布中 |
| NETWORK_ERROR | 网络异常，请稍后重试 |

前端应通过 adapter 统一映射中文，不在页面散落硬编码。

---

## 13. platform-admin-adapter 替换边界

### 13.1 保持不变的页面调用

页面继续调用：

1. `getPlatformDashboard()`
2. `getReviewQueue(filters)`
3. `getReviewDetail(reviewId)`
4. `submitReviewDecision(reviewId, decisionPayload, actor)`
5. `getPublishQueue(filters)`
6. `getPublishDetail(publishId)`
7. `publishTarget(publishId, actor)`
8. `getPublishLogs(publishId)`
9. `getReviewStatusForTarget(type, id)`
10. `getPublishStatusForTarget(type, id)`

### 13.2 api mode 下 adapter 行为

当 `LoveqiguDataAdapter.mode === "api"`：

1. 上述方法映射到 `/api/v1/platform/*`
2. 自动附加 Authorization header
3. 自动携带 actorContext
4. 响应结构与 mock 一致
5. 错误映射为 `ok: false` + `statusLabel` + `message`
6. 写操作不再依赖 adapter-session 作为权威源
7. 发布任务状态由服务端 / Runtime 任务返回
8. 园区 / 内容生产对象回写由服务端统一完成

### 13.3 mock mode 保留

`mode === "mock"` 时保持 Phase 2 行为 + `ADAPTER_SESSION_PERSISTENCE_V1` 持久化，用于演示与回归。

页面层不感知 mock / api 差异。

---

## 14. 真实接口实施顺序建议

建议后续实施分 5 步：

### Step 1：平台审查只读

1. GET /platform/reviews
2. GET /platform/reviews/:reviewId
3. GET /platform/dashboard

验证：

1. 审查队列与 mock 页面一致
2. platform.review.read 生效
3. 园区提交的 reviewRecord 可被平台读取

### Step 2：审查决策接口

1. POST /platform/reviews/:reviewId/decision

验证：

1. APPROVED / NEED_INFO / BLOCKED / REJECTED 全覆盖
2. 园区 review-result 可回读
3. 内容生产对象状态可回写
4. APPROVED 自动生成 publishRecord

### Step 3：发布中心只读

1. GET /platform/publishes
2. GET /platform/publishes/:publishId
3. GET /platform/publishes/:publishId/logs

验证：

1. 审查通过对象进入发布队列
2. 发布日志可读
3. 风险状态可读

### Step 4：发布任务接口

1. POST /platform/publishes/:publishId/publish

验证：

1. 创建 publishTask
2. 状态 PUBLISHING / SYNCING
3. 发布成功 / 失败可更新
4. 用户端只读已发布内容

### Step 5：回滚申请与审计

1. POST /platform/publishes/:publishId/rollback-request
2. 高风险日志与审计

---

## 15. 禁止事项

1. 不修改平台后台页面视觉与结构
2. 不接真实后端，本轮仅文档
3. 不改 Runtime 数据结构
4. 不破坏 Phase 2 mock 平台审查发布流程
5. 不让页面直接 fetch API
6. 不允许园区端直接执行平台审查决策
7. 不允许内容生产端直接发布 Runtime
8. 不允许未审查内容进入用户端

验收：`NO_PLATFORM_REVIEW_PUBLISH_LOGIC_CHANGE = CONFIRMED`

---

## 16. 风险点

1. Mock 同步发布 vs 真实异步 publishTask 的 UX 差异
2. 平台审查队列可能同时包含园区活动和内容生产对象，targetType 必须明确
3. 发布失败后的回退 / 重试策略需后续单独设计
4. Runtime 数据结构后续需与真实发布系统确认
5. 审查通过后自动生成 publishRecord 需防重复
6. 内容生产对象与用户端可见 Runtime 数据必须严控边界

---

## 17. 下一步建议

完成本规划后，建议进入：

**REAL_USER_EXPLORATION_API_V1**

目标：

1. 定义用户首页 / 探索地图 / 探索点详情真实接口
2. 定义打卡、AR 扫描、信物显现、礼遇领取真实接口
3. 定义用户端如何读取已发布 Runtime 内容
4. 定义用户进度和权益状态真实数据源

---

## 18. 验收标记

```
REAL_PLATFORM_REVIEW_PUBLISH_API_V1_CREATED = YES
REAL_PLATFORM_REVIEW_API_SCOPE_DEFINED = YES
REAL_PLATFORM_PUBLISH_API_SCOPE_DEFINED = YES
REAL_PLATFORM_ROLE_PERMISSION_DEFINED = YES
REAL_PLATFORM_REVIEW_DATA_OBJECTS_DEFINED = YES
REAL_PLATFORM_PUBLISH_DATA_OBJECTS_DEFINED = YES
REAL_PLATFORM_REVIEW_DECISION_RULES_DEFINED = YES
REAL_PLATFORM_PUBLISH_TASK_RULES_DEFINED = YES
REAL_PLATFORM_RUNTIME_STATUS_FLOW_DEFINED = YES
REAL_PLATFORM_REVIEW_RESULT_WRITEBACK_DEFINED = YES
REAL_PLATFORM_CONTENT_WRITEBACK_DEFINED = YES
REAL_PLATFORM_AUDIT_LOG_DEFINED = YES
REAL_PLATFORM_ERROR_CODES_DEFINED = YES
REAL_PLATFORM_ADAPTER_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_PLATFORM_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_PLATFORM_REVIEW_PUBLISH_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_PLATFORM_REVIEW_PUBLISH_API_PLAN_READY = YES
READY_FOR_REAL_USER_EXPLORATION_API_V1 = YES
```
