# REAL_CONTENT_PRODUCTION_API_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的内容生产真实接口接入方案。

Phase 2 已完成 `CONTENT_PRODUCTION_DATA_FLOW_V1`，实现了探索点、信物、祝福内容、AR 内容、美术需求单、生成任务、提交平台审查、平台审查 / 发布状态回写、全局搜索同步的 mock 数据闭环。

Phase 3 已完成 `REAL_PLATFORM_REVIEW_PUBLISH_API_V1`，明确了内容生产对象必须提交平台审查，审查通过后进入发布中心，发布成功后才可进入用户端 Runtime。

Phase 3 已完成 `REAL_USER_EXPLORATION_API_V1`，明确了用户端只能读取 publishStatus = PUBLISHED 且 runtimeStatus = PUBLISHED 的内容。

本文件用于将内容生产从 mock adapter 流程推进到真实 API 设计阶段，为后续真实接口实现提供标准。

本轮只做规划，不直接接真实后端，不接真实 AI / 图片 / AR 生成服务。

---

## 2. 本轮目标

本轮目标：

1. 定义内容生产真实 API 范围
2. 定义探索点真实数据对象与接口
3. 定义信物真实数据对象与接口
4. 定义祝福内容真实数据对象与接口
5. 定义 AR 内容真实数据对象与接口
6. 定义美术需求单真实数据对象与接口
7. 定义生成任务真实数据对象与接口
8. 定义内容对象绑定关系
9. 定义内容提交平台审查规则
10. 定义平台审查 / 发布状态回写规则
11. 定义内容进入用户端 Runtime 的边界
12. 定义错误码与前端中文提示
13. 定义 content-production-adapter 从 mock 到真实 API 的替换边界
14. 定义后续真实接口实施顺序

---

## 3. 当前基础

已完成基础：

1. DATA_ADAPTER_LAYER_V1
2. CONTENT_PRODUCTION_DATA_FLOW_V1
3. PLATFORM_REVIEW_PUBLISH_FLOW_V1
4. USER_EXPLORATION_RUNTIME_FLOW_V1
5. ADAPTER_SESSION_PERSISTENCE_V1
6. AUTH_ROLE_IDENTITY_PLAN_V1
7. REAL_PLATFORM_REVIEW_PUBLISH_API_V1
8. REAL_USER_EXPLORATION_API_V1

当前已有相关文件：

1. apps/shared/data-adapter/content-production-adapter.js
2. apps/shared/data-adapter/platform-admin-adapter.js
3. apps/shared/data-adapter/user-app-adapter.js
4. apps/shared/data-adapter/adapter-session.js
5. apps/shared/data-adapter/mock-source.js
6. apps/shared/data-adapter/status-map.js
7. apps/shared/data-adapter/role-map.js
8. apps/shared/data-adapter/search-adapter.js

当前 mock 已验证：

1. 探索点可创建 / 查看
2. 可从探索点生成信物占位
3. 可生成祝福内容
4. 可生成 AR 内容占位
5. 可生成美术需求单
6. 可生成 generationTasks
7. 内容对象可绑定探索点 / 信物 / 祝福 / AR / 美术需求
8. 可提交平台审查
9. 平台审查状态可回写内容生产对象
10. 发布状态可回写内容生产对象
11. 全局搜索可读取内容生产对象

---

## 4. 真实角色与权限边界

### 4.1 platform_admin

平台管理员 / 平台超管。

可访问：内容生产总览、探索点管理、信物管理、祝福内容管理、AR 内容管理、美术需求单、生成任务、提交平台审查、查看审查状态、查看发布状态。

可执行：创建 / 编辑探索点、生成信物占位、生成祝福内容、生成 AR 内容占位、生成美术需求单、创建生成任务、提交内容审查、查看平台审查结果、查看发布状态。

不可绕过：

1. 不可跳过平台审查直接发布内容
2. 不可将 DRAFT / NEED_INFO / BLOCKED 内容放入用户端 Runtime
3. 不可把信物当数字藏品
4. 不可让 AR 内容脱离探索点 / 信物显现节点
5. 不可让页面直接 fetch API
6. 不可不留日志提交审查或生成任务

### 4.2 内容生产权限 scope

| Scope | 说明 |
|-------|------|
| platform.content.read | 内容生产只读 |
| platform.content.write | 内容对象写入 |
| platform.content.generate | 占位 / 生成任务 |
| platform.content.submit_review | 提交平台审查 |
| platform.content.review_status.read | 审查状态回读 |
| platform.content.publish_status.read | 发布状态回读 |
| platform.review.read | 平台审查队列只读 |
| platform.review.write | 平台审查决策 |
| platform.publish.read | 发布队列只读 |
| platform.publish.write | 执行发布 |

---

## 5. 内容对象总状态规则

内容生产对象统一使用以下状态字段：status、reviewStatus、publishStatus、runtimeStatus。

### 5.1 status

1. DRAFT — 草稿
2. GENERATED — 已生成
3. READY_FOR_REVIEW — 可提交审查
4. ARCHIVED — 已归档

### 5.2 reviewStatus

1. NOT_SUBMITTED — 未提交
2. PENDING_REVIEW — 待平台审查
3. APPROVED — 已通过
4. NEED_INFO — 待补充
5. BLOCKED — 已阻断
6. REJECTED — 已驳回

### 5.3 publishStatus

1. NOT_READY — 不可发布
2. READY_TO_PUBLISH — 待发布
3. PUBLISHING — 发布中
4. PUBLISHED — 已发布
5. PUBLISH_FAILED — 发布失败

### 5.4 runtimeStatus

1. NOT_READY
2. READY
3. SYNCING
4. PUBLISHED
5. FAILED

用户端只允许读取：reviewStatus = APPROVED、publishStatus = PUBLISHED、runtimeStatus = PUBLISHED。

---

## 6. 真实数据对象

### 6.1 explorationPoints

探索点对象。

```json
{
  "id": "ep_001",
  "parkId": "park_001",
  "activityId": "activity_001",
  "name": "初见之门",
  "description": "探索点说明",
  "locationLabel": "爱企谷入口",
  "geo": {
    "lat": 0,
    "lng": 0
  },
  "sortOrder": 1,
  "status": "DRAFT",
  "reviewStatus": "NOT_SUBMITTED",
  "publishStatus": "NOT_READY",
  "runtimeStatus": "NOT_READY",
  "linkedRelicId": "relic_001",
  "linkedBlessingContentId": "blessing_001",
  "linkedARContentId": "ar_001",
  "linkedArtRequestId": "art_req_001",
  "createdBy": "platform_admin_001",
  "updatedBy": "platform_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00",
  "updatedAt": "2026-06-20T10:00:00+08:00"
}
```

### 6.2 relics

信物对象。

```json
{
  "id": "relic_001",
  "name": "角宿之印",
  "relicType": "story_progress_asset",
  "level": "星名",
  "system": "four_symbols",
  "symbolGroup": "青龙",
  "starMansion": "角宿",
  "description": "信物说明",
  "sourcePointId": "ep_001",
  "status": "DRAFT",
  "reviewStatus": "NOT_SUBMITTED",
  "publishStatus": "NOT_READY",
  "runtimeStatus": "NOT_READY",
  "createdBy": "platform_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00"
}
```

重要规则：信物是故事进度资产，不是数字藏品。不得将 relics 描述为数字藏品、NFT、藏品交易资产或金融化资产。

### 6.3 blessingContents

祝福内容对象。

```json
{
  "id": "blessing_001",
  "title": "初见之福",
  "body": "祝福正文",
  "tone": "oriental_blessing",
  "terminologyChecked": true,
  "forbiddenTermsChecked": true,
  "sourcePointId": "ep_001",
  "linkedRelicId": "relic_001",
  "status": "DRAFT",
  "reviewStatus": "NOT_SUBMITTED",
  "publishStatus": "NOT_READY",
  "runtimeStatus": "NOT_READY",
  "createdBy": "platform_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00"
}
```

术语规则：

1. 使用「心愿值」，不使用「愿力」
2. 使用「合真」，不使用「归真」
3. 使用「回响」，不使用「回应」
4. 使用「祝禁」，不使用「祝由」
5. 避免 SSR、抽卡、爆奖、稀有奖励表达

### 6.4 arContents

AR 内容对象。

```json
{
  "id": "ar_001",
  "title": "初见显现",
  "arType": "relic_reveal",
  "sourcePointId": "ep_001",
  "linkedRelicId": "relic_001",
  "fallbackAllowed": true,
  "assetStatus": "PLACEHOLDER",
  "previewStatus": "READY",
  "status": "DRAFT",
  "reviewStatus": "NOT_SUBMITTED",
  "publishStatus": "NOT_READY",
  "runtimeStatus": "NOT_READY",
  "createdBy": "platform_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00"
}
```

AR 规则：

1. AR 内容必须绑定探索点
2. AR 内容必须绑定信物显现节点
3. AR 不是独立炫技素材库
4. AR 失败必须允许 fallback
5. 不做抽卡、爆闪、SSR、爆奖表达

### 6.5 artRequests

美术需求单。

```json
{
  "id": "art_req_001",
  "title": "角宿之印视觉需求",
  "targetType": "relic",
  "targetId": "relic_001",
  "sourcePointId": "ep_001",
  "prompt": "东方克制、古籍、金石感、留白...",
  "promptVersion": "V1",
  "assetStatus": "PENDING_GENERATION",
  "generatedAssetUrl": null,
  "status": "DRAFT",
  "reviewStatus": "NOT_SUBMITTED",
  "publishStatus": "NOT_READY",
  "runtimeStatus": "NOT_READY",
  "createdBy": "platform_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00"
}
```

### 6.6 generationTasks

生成任务。

```json
{
  "id": "gen_task_001",
  "taskType": "generate_relic_placeholder",
  "targetType": "exploration_point",
  "targetId": "ep_001",
  "status": "PENDING",
  "input": {},
  "output": {},
  "errorCode": null,
  "createdBy": "platform_admin_001",
  "createdAt": "2026-06-20T10:00:00+08:00",
  "completedAt": null
}
```

任务状态：PENDING、RUNNING、SUCCESS、FAILED、CANCELLED。

本阶段不接真实 AI 服务，生成任务仍为 API 规划。

---

## 7. 内容绑定关系规则

内容生产链路：

```
景区 / 活动 → 探索点 → 信物 → 祝福内容 → AR 内容 → 美术需求单 → 生成任务 → 平台审查 → 发布中心 → Runtime → 用户端读取
```

绑定规则：

1. explorationPoint.activityId 必须存在
2. relic.sourcePointId 必须指向探索点
3. blessingContent.sourcePointId 必须指向探索点
4. blessingContent.linkedRelicId 必须指向信物
5. arContent.sourcePointId 必须指向探索点
6. arContent.linkedRelicId 必须指向信物
7. artRequest.targetType / targetId 必须指向合法对象
8. generationTask.targetType / targetId 必须指向合法对象

禁止：孤立信物、孤立 AR 内容、无探索点的祝福内容、无审查记录的 Runtime 内容、无发布记录的用户端内容。

---

## 8. 真实 API 范围

基础路径：`/api/v1/platform/content`

所有请求必须携带：

1. `Authorization: Bearer <token>`
2. 服务端校验 platform_admin 身份
3. 服务端校验 platform.content.* scope
4. 写操作携带 actorId / actorRole
5. 高风险操作写入审计日志

### 8.1 内容生产总览

**GET** `/platform/content/dashboard`

权限：`platform.content.read`

返回：explorationPointCount、relicCount、blessingContentCount、arContentCount、artRequestCount、pendingGenerationTaskCount、pendingReviewCount、publishedCount、blockedCount、recentTasks。

### 8.2 探索点

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | /platform/content/exploration-points | platform.content.read |
| GET | /platform/content/exploration-points/:pointId | platform.content.read |
| POST | /platform/content/exploration-points | platform.content.write |
| PATCH | /platform/content/exploration-points/:pointId | platform.content.write |

### 8.3 信物

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | /platform/content/relics | platform.content.read |
| GET | /platform/content/relics/:relicId | platform.content.read |
| POST | /platform/content/relics/generate-placeholder | platform.content.generate / write |
| PATCH | /platform/content/relics/:relicId | platform.content.write |

### 8.4 祝福内容

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | /platform/content/blessing-contents | platform.content.read |
| GET | /platform/content/blessing-contents/:contentId | platform.content.read |
| POST | /platform/content/blessing-contents/generate | platform.content.generate / write |
| PATCH | /platform/content/blessing-contents/:contentId | platform.content.write |

### 8.5 AR 内容

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | /platform/content/ar-contents | platform.content.read |
| GET | /platform/content/ar-contents/:arId | platform.content.read |
| POST | /platform/content/ar-contents/generate-placeholder | platform.content.generate / write |
| PATCH | /platform/content/ar-contents/:arId | platform.content.write |

### 8.6 美术需求单

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | /platform/content/art-requests | platform.content.read |
| GET | /platform/content/art-requests/:requestId | platform.content.read |
| POST | /platform/content/art-requests | platform.content.write |
| PATCH | /platform/content/art-requests/:requestId | platform.content.write |

### 8.7 生成任务

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | /platform/content/generation-tasks | platform.content.read |
| GET | /platform/content/generation-tasks/:taskId | platform.content.read |
| POST | /platform/content/generation-tasks/:taskId/continue | platform.content.generate |

### 8.8 提交平台审查

**POST** `/platform/content/:targetType/:targetId/submit-review`

权限：`platform.content.submit_review`

支持 targetType：exploration_point、relic、blessing_content、ar_content、art_request。

成功后生成 reviewRecord，进入平台审查中心。

---

## 9. 提交审查规则

提交平台审查必须满足：

1. token 有效
2. actor 具备 platform.content.submit_review
3. targetType 合法
4. targetId 存在
5. 对象 status 不是 ARCHIVED
6. 对象不是 PENDING_REVIEW
7. 对象不是 PUBLISHED
8. 绑定关系完整
9. 术语检查通过
10. AR 绑定规则通过
11. 信物非数字藏品规则通过
12. 生成 reviewRecord
13. 写入 operationLog
14. 对象 reviewStatus = PENDING_REVIEW

失败返回对应错误码。

---

## 10. 平台审查与发布回写规则

平台审查 API 归属 `REAL_PLATFORM_REVIEW_PUBLISH_API_V1`。内容生产侧只约定回写读取规则。

### 10.1 审查通过

平台审查通过后：

1. 对象 reviewStatus = APPROVED
2. 对象 publishStatus = READY_TO_PUBLISH
3. 对象 runtimeStatus = READY
4. 内容生产页面显示「可发布」

### 10.2 待补充 / 阻断 / 驳回

平台返回 NEED_INFO、BLOCKED、REJECTED。内容生产对象必须可读：reviewStatus、blockReason、needSupplement、optimizationSuggestion、nextStepSuggestion。

### 10.3 发布成功

平台发布成功后：

1. 对象 publishStatus = PUBLISHED
2. 对象 runtimeStatus = PUBLISHED
3. 用户端可读取
4. 全局搜索可读取最新状态

### 10.4 发布失败

平台发布失败后：

1. 对象 publishStatus = PUBLISH_FAILED
2. 对象 runtimeStatus = FAILED
3. 内容生产页面显示失败原因
4. 不进入用户端 Runtime

---

## 11. Runtime 可见边界

用户端只读取已发布内容。

以下内容不得进入用户端：DRAFT、GENERATED、READY_FOR_REVIEW、PENDING_REVIEW、NEED_INFO、BLOCKED、REJECTED、READY_TO_PUBLISH 但未 PUBLISHED、PUBLISH_FAILED、ARCHIVED。

Runtime 可见内容必须满足：

1. reviewStatus = APPROVED
2. publishStatus = PUBLISHED
3. runtimeStatus = PUBLISHED
4. 必要绑定完整
5. 活动本身已发布并有效

---

## 12. 操作日志与审计要求

以下操作必须写日志：

1. CREATE_EXPLORATION_POINT
2. UPDATE_EXPLORATION_POINT
3. GENERATE_RELIC_PLACEHOLDER
4. GENERATE_BLESSING_CONTENT
5. GENERATE_AR_PLACEHOLDER
6. CREATE_ART_REQUEST
7. CONTINUE_GENERATION_TASK
8. SUBMIT_CONTENT_REVIEW
9. REVIEW_STATUS_READ
10. PUBLISH_STATUS_READ
11. CONTENT_BINDING_UPDATE

日志字段：id、actorId、actorRole、action、targetType、targetId、beforeStatus、afterStatus、sourcePointId、reviewId、generationTaskId、result、errorCode、createdAt。

---

## 13. 错误码与中文提示

| errorCode | 中文提示 |
| --------- | -------- |
| AUTH_REQUIRED | 请先登录 |
| TOKEN_EXPIRED | 登录已过期，请重新登录 |
| SCOPE_DENIED | 当前账号无权执行该操作 |
| CONTENT_TARGET_NOT_FOUND | 未找到内容对象 |
| CONTENT_TARGET_TYPE_INVALID | 内容类型无效 |
| CONTENT_BINDING_INCOMPLETE | 内容绑定关系不完整 |
| CONTENT_ALREADY_PENDING_REVIEW | 内容已提交审查，请等待结果 |
| CONTENT_ALREADY_PUBLISHED | 内容已发布，不可重复提交 |
| CONTENT_ARCHIVED | 内容已归档 |
| RELIC_DIGITAL_COLLECTIBLE_CONFLICT | 信物不可作为数字藏品处理 |
| AR_BINDING_REQUIRED | AR 内容必须绑定探索点和信物 |
| TERMINOLOGY_CHECK_FAILED | 术语检查未通过 |
| GENERATION_TASK_FAILED | 生成任务失败 |
| NETWORK_ERROR | 网络异常，请稍后重试 |

前端应通过 content-production-adapter 统一映射中文，不在页面散落硬编码。

---

## 14. content-production-adapter 替换边界

### 14.1 保持不变的页面调用

页面继续调用：

1. `getContentProductionDashboard()`
2. `getExplorationPoints(filters)`
3. `getExplorationPointDetail(pointId)`
4. `generateRelicPlaceholder(pointId, actor)`
5. `generateBlessingContent(targetId, actor)`
6. `generateARPlaceholder(targetId, actor)`
7. `generateArtRequest(targetId, actor)`
8. `submitContentReview(targetType, targetId, actor)`
9. `getRelics(filters)`
10. `getBlessingContents(filters)`
11. `getARContents(filters)`
12. `getArtRequests(filters)`
13. `getGenerationTasks(filters)`
14. `buildSearchIndex()`

### 14.2 api mode 下 adapter 行为

当 `LoveqiguDataAdapter.mode === "api"`：

1. 上述方法映射到 `/api/v1/platform/content/*`
2. 自动附加 Authorization header
3. 自动携带 actorContext
4. 响应结构与 mock 一致
5. 错误映射为 `ok: false` + `statusLabel` + `message`
6. 写操作不再依赖 adapter-session 作为权威源
7. 生成任务由服务端任务返回
8. 平台审查 / 发布状态由平台服务回写
9. `buildSearchIndex` 可改为读取服务端搜索接口或当前内容列表聚合

### 14.3 mock mode 保留

`mode === "mock"` 时保持 Phase 2 行为 + `ADAPTER_SESSION_PERSISTENCE_V1` 持久化，用于演示与回归。

页面层不感知 mock / api 差异。

---

## 15. 真实接口实施顺序建议

建议后续实施分 6 步：

### Step 1：内容生产只读

GET dashboard、exploration-points、relics、blessing-contents、ar-contents、art-requests、generation-tasks。

验证：页面展示与 mock 一致；platform.content.read 生效；状态中文映射一致。

### Step 2：探索点写入

POST / PATCH exploration-points。

验证：探索点创建成功；parkId / activityId 绑定正确；操作日志写入。

### Step 3：占位生成接口

POST relics/generate-placeholder、blessing-contents/generate、ar-contents/generate-placeholder、art-requests。

验证：生成任务记录存在；绑定关系正确；不接真实 AI 也可返回占位结果。

### Step 4：提交审查

POST submit-review。

验证：绑定完整才能提交；术语校验必须通过；AR 绑定规则必须通过；信物非数字藏品规则必须通过；reviewRecord 进入平台审查中心。

### Step 5：平台审查 / 发布回写

对接 `REAL_PLATFORM_REVIEW_PUBLISH_API_V1` 的 review / publish 状态回写。

验证：APPROVED 后 READY_TO_PUBLISH；PUBLISHED 后 Runtime 可读；BLOCKED / NEED_INFO 不进入 Runtime。

### Step 6：真实生成服务专项

后续另行进入 AI / 图片 / AR 生成服务接入，不在本文件执行。

---

## 16. 禁止事项

1. 不修改内容生产页面视觉与结构
2. 不接真实后端，本轮仅文档
3. 不接真实 AI 生成服务
4. 不接真实图片生成服务
5. 不接真实 AR 生成服务
6. 不改 Runtime 数据结构
7. 不破坏 Phase 2 mock 内容生产流程
8. 不让页面直接 fetch API
9. 不允许信物变成数字藏品
10. 不允许 AR 内容脱离探索点和信物显现节点
11. 不允许未审查内容进入用户端

验收：`NO_CONTENT_PRODUCTION_LOGIC_CHANGE = CONFIRMED`

---

## 17. 风险点

1. 真实 AI / 图片 / AR 生成服务复杂，应后置专项
2. 内容生产对象与用户端 Runtime 可见对象需严格隔离
3. 信物与数字藏品边界必须持续保持
4. AR 内容绑定关系不完整会破坏用户端体验
5. 内容生产审查与园区活动审查同属平台队列，targetType 必须明确
6. 生成任务异步化后需要失败重试机制
7. buildSearchIndex 后续可能需要切换真实搜索服务

---

## 18. 下一步建议

完成本规划后，建议进入：

**REAL_AR_DEVICE_INTEGRATION_V1**

目标：

1. 定义真实 AR SDK 接入边界
2. 定义摄像头 / 定位 / 设备能力
3. 定义 AR 扫描 credential
4. 定义低端设备 fallback
5. 定义真机验收路径

---

## 19. 验收标记

```
REAL_CONTENT_PRODUCTION_API_V1_CREATED = YES
REAL_CONTENT_PRODUCTION_API_SCOPE_DEFINED = YES
REAL_CONTENT_PRODUCTION_ROLE_PERMISSION_DEFINED = YES
REAL_CONTENT_PRODUCTION_STATUS_FLOW_DEFINED = YES
REAL_CONTENT_PRODUCTION_DATA_OBJECTS_DEFINED = YES
REAL_CONTENT_BINDING_RULES_DEFINED = YES
REAL_CONTENT_API_ENDPOINTS_DEFINED = YES
REAL_CONTENT_SUBMIT_REVIEW_RULES_DEFINED = YES
REAL_CONTENT_REVIEW_PUBLISH_WRITEBACK_DEFINED = YES
REAL_CONTENT_RUNTIME_BOUNDARY_DEFINED = YES
REAL_CONTENT_AUDIT_LOG_DEFINED = YES
REAL_CONTENT_ERROR_CODES_DEFINED = YES
REAL_CONTENT_ADAPTER_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_CONTENT_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_CONTENT_PRODUCTION_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_CONTENT_PRODUCTION_API_PLAN_READY = YES
READY_FOR_REAL_AR_DEVICE_INTEGRATION_V1 = YES
```
