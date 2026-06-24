# REAL_PARK_ACTIVITY_REVIEW_API_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的园区活动审核真实接口接入方案。

Phase 2 已完成 `PARK_ACTIVITY_REVIEW_FLOW_V1`，实现了园区活动草稿创建、责任声明勾选、提交发布检查、ReviewRecord 生成、操作日志写入、平台 mock 审核意见回传、园区查看阻断原因 / 优化建议 / 补充项 / 下一步建议的 mock 数据闭环。

Phase 3 已完成 `AUTH_ROLE_IDENTITY_PLAN_V1`，明确了真实身份、token、permission scope、parkId 权限边界、平台代管上下文和审计日志原则。

本文件用于将园区活动审核从 mock adapter 流程推进到真实 API 设计阶段，为后续真实接口实现提供标准。

本轮只做规划，不直接接真实后端。

---

## 2. 本轮目标

本轮目标：

1. 定义园区活动真实 API 范围
2. 定义园区负责人权限边界
3. 定义活动草稿保存规则
4. 定义责任声明提交规则
5. 定义发布检查提交规则
6. 定义 ReviewRecord 生成规则
7. 定义平台审查结果回读规则
8. 定义操作日志和审计日志要求
9. 定义活动状态流转规则
10. 定义园区活动与平台审查中心的接口边界
11. 定义错误码与前端中文提示
12. 定义 park-admin-adapter 从 mock 到真实 API 的替换边界
13. 定义后续真实接口实施顺序

---

## 3. 当前基础

已完成基础：

1. DATA_ADAPTER_LAYER_V1
2. PARK_ACTIVITY_REVIEW_FLOW_V1
3. PLATFORM_REVIEW_PUBLISH_FLOW_V1
4. ADAPTER_SESSION_PERSISTENCE_V1
5. AUTH_ROLE_IDENTITY_PLAN_V1
6. REAL_MERCHANT_REDEMPTION_API_V1

当前已有相关文件：

1. apps/shared/data-adapter/park-admin-adapter.js
2. apps/shared/data-adapter/platform-admin-adapter.js
3. apps/shared/data-adapter/adapter-session.js
4. apps/shared/data-adapter/mock-source.js
5. apps/shared/data-adapter/status-map.js
6. apps/shared/data-adapter/role-map.js

当前 mock 已验证：

1. 园区活动草稿可创建
2. 活动草稿可保存
3. 发布检查前必须勾选责任声明
4. 提交发布检查后生成 reviewRecord
5. 操作日志可见
6. 平台审查意见可回传园区
7. BLOCKED / NEED_INFO / APPROVED 状态可在园区端显示
8. 参与商家明细可分页展示
9. 园区端不具备直接发布权限

---

## 4. 真实角色与权限边界

### 4.1 park_admin

园区负责人。

可访问：

1. 园区数据总览
2. 园区活动列表
3. 活动详情
4. 活动草稿创建 / 编辑
5. 活动发布检查页
6. 活动审查结果回读
7. 园区参与商家数据
8. 园区操作日志
9. 园区工单

可执行：

1. 创建活动草稿
2. 保存活动草稿
3. 编辑活动说明
4. 关联参与商家
5. 关联探索点
6. 勾选责任声明
7. 提交发布检查
8. 查看平台审查意见
9. 根据意见修改后再次提交

不可执行：

1. 直接访问平台审查中心
2. 直接访问平台发布中心
3. 直接发布 Runtime
4. 查看其他园区数据
5. 修改平台审查结论
6. 修改平台发布状态

### 4.2 platform_admin 代管园区

平台管理员可代管园区后台，但必须满足：

1. 具备 `platform.impersonate.park` 权限
2. 代管请求携带 `impersonationContext`
3. 写操作记录 `operatorId` 和 `targetParkId`
4. 园区页面显示平台代管视图标记
5. 代管行为进入审计日志

### 4.3 权限 scope

| Scope | 说明 |
|-------|------|
| park.dashboard.read | 园区看板 |
| park.activity.read | 活动列表 / 详情 |
| park.activity.write | 草稿创建 / 保存 |
| park.activity.submit_review | 提交发布检查 |
| park.review_result.read | 审查结论回读 |
| park.merchant.read | 参与商家 / 园区商家 |
| park.operation_log.read | 操作日志 |
| park.ticket.read / write | 工单 |
| platform.impersonate.park | 平台代管园区 |

---

## 5. 真实数据对象

### 5.1 activities（园区活动）

与 Phase 2 mock 字段对齐，真实 API 可映射 `title` ↔ `name`：

```json
{
  "id": "activity_001",
  "parkId": "park_001",
  "name": "爱企谷初见寻宝节",
  "status": "DRAFT",
  "reviewStatus": "NOT_SUBMITTED",
  "publishCheckStatus": "NOT_SUBMITTED",
  "publishStatus": "NOT_PUBLISHED",
  "runtimeStatus": "NOT_READY",
  "description": "活动说明",
  "startDate": "2026-06-20",
  "endDate": "2026-07-20",
  "linkedMerchantIds": ["merchant_001"],
  "linkedExplorationPointIds": ["ep_001"],
  "declarationAccepted": false,
  "declarationVersion": null,
  "declarationAcceptedAt": null,
  "createdBy": "park_admin_001",
  "updatedBy": "park_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00",
  "updatedAt": "2026-06-20T10:00:00+08:00"
}
```

### 5.2 reviewRecords

```json
{
  "id": "review_001",
  "targetType": "activity",
  "targetId": "activity_002",
  "targetName": "爱企谷夏日探索",
  "parkId": "park_001",
  "activityId": "activity_002",
  "sourceModule": "园区发布检查",
  "submittedBy": "park_admin_001",
  "submittedRole": "park_admin",
  "status": "BLOCKED",
  "reviewConclusion": "礼遇配置待补充，暂不可发布",
  "blockReason": "礼遇配置仍处于待补充状态，暂不可发布。",
  "optimizationSuggestion": "建议补充游客完成探索后如何领取到店礼遇的路径说明。",
  "needSupplement": "请补充礼遇领取说明、参与商家承接说明、游客到店路径。",
  "nextStepSuggestion": "修改后可再次提交发布检查。",
  "reviewerId": "platform_ops",
  "reviewerName": "平台内容运营组",
  "reviewedAt": "2026-06-20T15:30:00+08:00",
  "createdAt": "2026-06-19T14:05:00+08:00",
  "updatedAt": "2026-06-20T15:30:00+08:00"
}
```

园区端**只读**；写入由平台审查 API 完成（见第 10 节）。

### 5.3 activityDeclarationRecords

责任声明留痕（建议独立表或 operationLog 扩展）：

```json
{
  "id": "decl_001",
  "activityId": "activity_002",
  "parkId": "park_001",
  "declarationVersion": "PARK_ACTIVITY_SUBMIT_DECLARATION_V1",
  "declarationAccepted": true,
  "acceptedAt": "2026-06-19T14:05:00+08:00",
  "operatorId": "park_admin_001",
  "operatorRole": "park_admin",
  "clientInfo": {},
  "operationLogId": "log_003"
}
```

### 5.4 operationLogs

```json
{
  "id": "log_003",
  "actorId": "park_admin_001",
  "actorRole": "park_admin",
  "parkId": "park_001",
  "activityId": "activity_002",
  "action": "SUBMIT_PUBLISH_CHECK",
  "targetType": "activity",
  "targetId": "activity_002",
  "beforeStatus": "DRAFT",
  "afterStatus": "PENDING_REVIEW",
  "statementConfirmed": true,
  "declarationVersion": "PARK_ACTIVITY_SUBMIT_DECLARATION_V1",
  "summary": "已确认提交声明，活动已提交平台发布检查。",
  "impersonationContext": null,
  "createdAt": "2026-06-19T14:05:00+08:00"
}
```

---

## 6. 活动状态流转规则

```
DRAFT
  →（勾选声明 + submit-review）→ PENDING_REVIEW
  → 平台审查 → APPROVED | BLOCKED | NEED_INFO | REJECTED
BLOCKED / NEED_INFO
  → 修改草稿 → 再次 submit-review → PENDING_REVIEW
APPROVED
  → 平台发布中心（非园区 API）→ PUBLISHED / ACTIVE
ACTIVE / PUBLISHED / COMPLETED
  → 园区端隐藏「发布检查」主操作
```

| reviewStatus | 园区可提交发布检查 | 园区可编辑草稿 |
|--------------|-------------------|----------------|
| DRAFT | 是（需声明） | 是 |
| BLOCKED | 是（需声明） | 是 |
| NEED_INFO | 是（需声明） | 是 |
| PENDING_REVIEW | 否 | 否 |
| APPROVED | 否 | 否（进行中另议） |
| ACTIVE / PUBLISHED | 否 | 否 |

与 Phase 2 `canSubmitReview` / `isActiveActivity` 行为对齐。

---

## 7. 真实 API 范围

基础路径：`/api/v1/park`

所有请求：

1. `Authorization: Bearer <token>`
2. 服务端从 token 解析 `parkId`（不信任单独 query 越权）
3. 代管时校验 `impersonationContext.targetParkId`

### 7.1 读接口

| 方法 | 路径 | Scope | 说明 |
|------|------|-------|------|
| GET | /dashboard | park.dashboard.read | 园区看板 |
| GET | /activities | park.activity.read | 活动列表 |
| GET | /activities/:activityId | park.activity.read | 活动详情 |
| GET | /activities/:activityId/publish-check | park.activity.read | 发布检查页数据 |
| GET | /activities/:activityId/review-result | park.review_result.read | 最新审查结论 |
| GET | /activities/:activityId/operation-logs | park.operation_log.read | 活动操作日志 |
| GET | /activities/:activityId/merchants | park.merchant.read | 参与商家分页 |
| GET | /merchants | park.merchant.read | 园区商家列表 |
| GET | /activities/draft-context | park.activity.write | 创建页上下文 |
| GET | /help | * | 帮助 |

### 7.2 写接口

| 方法 | 路径 | Scope | 说明 |
|------|------|-------|------|
| POST | /activities | park.activity.write | 创建草稿 |
| PATCH | /activities/:activityId | park.activity.write | 保存草稿 |
| POST | /activities/:activityId/submit-review | park.activity.submit_review | 提交发布检查 |

**园区无** `POST /publish`、`POST /reviews/:id/decision` — 归属平台 API。

### 7.3 提交发布检查请求

```json
{
  "declarationAccepted": true,
  "declarationVersion": "PARK_ACTIVITY_SUBMIT_DECLARATION_V1",
  "allChecked": true
}
```

### 7.4 成功响应（submit-review）

```json
{
  "ok": true,
  "status": "PENDING_REVIEW",
  "statusLabel": "已提交发布检查",
  "message": "活动已提交平台发布检查，平台将根据活动信息、商家承接、礼遇配置与游客体验路径进行审核。",
  "reviewRecord": { },
  "operationLog": { },
  "activity": { }
}
```

真实环境：`reviewRecord` 初始为 `PENDING_REVIEW`；平台异步审查后更新，园区通过 `review-result` 回读。

---

## 8. 责任声明提交规则

提交 `submit-review` 时服务端必须校验：

| 序号 | 规则 | 失败码 |
|------|------|--------|
| 1 | token 有效 | AUTH_REQUIRED |
| 2 | scope 含 park.activity.submit_review | SCOPE_DENIED |
| 3 | activity.parkId === token.parkId | PARK_MISMATCH |
| 4 | declarationAccepted === true | DECLARATION_REQUIRED |
| 5 | declarationVersion 为当前生效版本 | DECLARATION_VERSION_MISMATCH |
| 6 | 活动基础字段完整（name、startDate、endDate） | MISSING_REQUIRED_FIELDS |
| 7 | 活动状态允许提交 | INVALID_ACTIVITY_STATUS |
| 8 | 非进行中 / 已上线活动 | ACTIVITY_ALREADY_ACTIVE |

写入：

1. `activities.reviewStatus` → `PENDING_REVIEW`
2. `activities.publishCheckStatus` → `PENDING_REVIEW`
3. `activities.declarationAccepted` / `declarationVersion` / `declarationAcceptedAt`
4. 创建 `reviewRecords`（status=PENDING_REVIEW）
5. 创建 `activityDeclarationRecords`
6. 写入 `operationLogs`（SUBMIT_PUBLISH_CHECK 或 RESUBMIT_PUBLISH_CHECK）
7. **异步**通知平台审查队列（消息 / 任务，规划层）

---

## 9. 草稿保存规则

`POST /activities` 与 `PATCH /activities/:activityId`：

1. 新建默认 `status=DRAFT`，`reviewStatus=DRAFT`
2. 仅 `DRAFT` / `BLOCKED` / `NEED_INFO` 可 PATCH（与 mock 一致）
3. `linkedMerchantIds` / `linkedExplorationPointIds` 须属于同一 `parkId`
4. 写入 `operationLogs`（CREATE_ACTIVITY_DRAFT / SAVE_ACTIVITY_DRAFT）
5. 不自动提交审查

---

## 10. 园区与平台审查中心边界

| 能力 | 园区 API | 平台 API |
|------|----------|----------|
| 创建 reviewRecord（提交） | POST submit-review 触发 | — |
| 审查决策 | 禁止 | POST /platform/reviews/:id/decision |
| 更新 reviewRecord 结论 | 禁止 | 平台写入 |
| 园区回读结论 | GET review-result | — |
| Runtime 发布 | 禁止 | POST /platform/publishes/:id/publish |

数据流：

```
园区 submit-review
  → 创建 reviewRecord (PENDING_REVIEW)
  → 平台审查中心拉取 / 推送
  → 平台 decision (APPROVED | BLOCKED | NEED_INFO)
  → 更新 reviewRecord + activities.reviewStatus
  → 园区 GET review-result / publish-check 回读
```

Mock Phase 2 为即时回传；真实环境为**异步**，园区端需支持轮询或 WebSocket（实施阶段再定，本轮仅规划）。

---

## 11. 操作日志与审计要求

必须记录的操作：

| action | 触发 |
|--------|------|
| CREATE_ACTIVITY_DRAFT | POST /activities |
| SAVE_ACTIVITY_DRAFT | PATCH /activities/:id |
| SUBMIT_PUBLISH_CHECK | 首次提交 |
| RESUBMIT_PUBLISH_CHECK | 阻断 / 待补充后再次提交 |
| VIEW_REVIEW_RESULT | GET review-result（可选记审计） |
| MODIFY_ACTIVITY_BY_REVIEW | PATCH 阻断后修改 |
| CREATE_TICKET | 工单提交 |

代管时 `impersonationContext` 必填；`actorId` 为平台操作人，`parkId` 为被代管园区。

---

## 12. 错误码与中文提示

| 错误码 | HTTP | 中文提示 | mock 对齐 |
|--------|------|----------|-----------|
| AUTH_REQUIRED | 401 | 请先登录 | — |
| PARK_MISMATCH | 403 | 无权访问该园区活动 | — |
| SCOPE_DENIED | 403 | 当前角色不可执行此操作 | — |
| DECLARATION_REQUIRED | 400 | 请先勾选发布声明 | DECLARATION_REQUIRED |
| DECLARATION_VERSION_MISMATCH | 400 | 声明版本已更新，请重新阅读并确认 | — |
| MISSING_REQUIRED_FIELDS | 400 | 请补齐活动基础信息 | MISSING_REQUIRED_FIELDS |
| INVALID_ACTIVITY_STATUS | 400 | 当前活动状态不可提交 | — |
| ACTIVITY_ALREADY_ACTIVE | 400 | 活动已上线，不可重复提交发布检查 | — |
| ACTIVITY_NOT_FOUND | 404 | 活动不存在 | — |
| REVIEW_PENDING | 409 | 审查进行中，请等待平台结论 | — |

前端通过 `park-admin-adapter` 返回 `{ ok, status, statusLabel, message }`，`status-map.js` activity / review / park domain 负责中文。

---

## 13. park-admin-adapter 替换边界

### 13.1 保持不变的页面调用

- `getParkDashboard(parkId)`
- `getParkActivities(parkId, filters)`
- `getParkActivityDetail(activityId)`
- `getParkActivityDraftContext(parkId)`
- `saveParkActivityDraft(payload, actor)`
- `submitParkActivityReview(activityId, declarationPayload, actor)`
- `getParkActivityPublishCheck(activityId)`
- `getParkActivityReviewResult(activityId)`
- `getParticipatingMerchants(activityId, pagination)`
- `getParkMerchants(parkId, pagination)`
- `getParkOperationLogs(parkId, target)`

### 13.2 api mode 行为

1. 上述方法映射到 `/api/v1/park/*`
2. 自动附加 token + impersonation header
3. 响应结构与 mock 一致
4. 写操作不再依赖 adapter-session 内存（服务端权威）
5. `platform-admin-adapter` 审查决策仍走平台 API，不与 park adapter 合并

### 13.3 mock mode 保留

`mode === "mock"` 保持 Phase 2 + 持久化 session，含 mock 即时平台回传。

---

## 14. 真实接口实施顺序

### Step 1：只读

GET dashboard、activities、detail、publish-check、review-result、merchants、operation-logs

### Step 2：草稿写入

POST /activities、PATCH /activities/:id + 操作日志

### Step 3：submit-review

责任声明校验、reviewRecord 创建、平台队列通知

### Step 4：平台审查联动

对接 `REAL_PLATFORM_REVIEW_PUBLISH_API_V1` decision 回写 + 园区回读验收

### Step 5：代管与审计

platform.impersonate.park + impersonationContext 全链路

---

## 15. 禁止事项

1. 不修改园区后台页面视觉
2. 不接真实后端（本轮仅文档）
3. 不改 Runtime 数据结构
4. 不破坏 Phase 2 mock 园区审核流程
5. 不让园区 API 直接发布或审查决策
6. 不让页面直接 fetch API

**验收：** `NO_PARK_ACTIVITY_REVIEW_LOGIC_CHANGE = CONFIRMED`

---

## 16. 风险点

1. Mock 即时审核 vs 真实异步审查的 UX 差异
2. 声明版本升级后历史活动如何处理
3. 代管编辑与园区本人编辑的冲突
4. 活动字段 `name` vs `title` 需在 adapter 层统一映射
5. 平台审查与内容生产审查队列可能合并，需避免园区活动误入错误队列

---

## 17. 下一步建议

进入 **REAL_PLATFORM_REVIEW_PUBLISH_API_V1**（平台审查发布真实 API 规划），与本轮园区 submit-review / review-result 形成完整链路。

---

## 18. 验收标记

```
REAL_PARK_ACTIVITY_REVIEW_API_V1_CREATED = YES
REAL_PARK_ACTIVITY_API_SCOPE_DEFINED = YES
REAL_PARK_ACTIVITY_PERMISSION_BOUNDARY_DEFINED = YES
REAL_PARK_ACTIVITY_DATA_OBJECTS_DEFINED = YES
REAL_PARK_ACTIVITY_STATUS_FLOW_DEFINED = YES
REAL_PARK_DECLARATION_RULES_DEFINED = YES
REAL_PARK_SUBMIT_REVIEW_RULES_DEFINED = YES
REAL_PARK_REVIEW_RECORD_RULES_DEFINED = YES
REAL_PARK_PLATFORM_REVIEW_BOUNDARY_DEFINED = YES
REAL_PARK_OPERATION_LOG_DEFINED = YES
REAL_PARK_ACTIVITY_ERROR_CODES_DEFINED = YES
REAL_PARK_ADAPTER_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_PARK_ACTIVITY_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_PARK_ACTIVITY_REVIEW_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_PARK_ACTIVITY_REVIEW_API_PLAN_READY = YES
READY_FOR_REAL_PLATFORM_REVIEW_PUBLISH_API_V1 = YES
```
