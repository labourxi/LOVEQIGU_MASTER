# PHASE3_REAL_API_AND_PERMISSION_INTEGRATION_PLAN_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的真实接口、真实权限、真实登录、真实核销、真实审查发布、真实用户探索、真实 AR / 设备能力接入路径。

Phase 1 已完成视觉落地与页面验收。

Phase 2 已完成 Mock Runtime 数据闭环，包括：

1. 数据适配层
2. 角色导航层
3. 商家核销 mock 数据闭环
4. 园区活动发布检查 mock 数据闭环
5. 平台审查发布 mock 数据闭环
6. 内容生产 / AR生产线 mock 数据闭环
7. 用户探索体验 mock Runtime 闭环

Phase 3 的核心目标不是重做页面，也不是一次性接入所有真实系统，而是在现有 adapter 架构基础上，将 mock source / adapter session 逐步替换为真实 API、真实权限与真实设备能力。

---

## 2. Phase 3 总目标

Phase 3 总目标：

从 Mock Runtime 进入真实业务能力接入阶段。

核心方向：

1. Adapter session 持久化
2. 真实登录与角色身份
3. 服务端权限校验
4. 商家核销真实接口
5. 园区活动审核真实接口
6. 平台审查发布真实接口
7. 用户端真实探索接口
8. 真实 AR / 定位 / 扫码设备能力
9. 真实审计日志
10. 真实错误状态与回退机制
11. 保持 Phase 1 页面结构不被破坏
12. 保持 Phase 2 adapter 调用方式稳定

---

## 3. Phase 3 总原则

Phase 3 必须遵守：

1. 不重做 Phase 1 已验收 UI
2. 不破坏 Phase 2 adapter 层
3. 不让页面直接跳过 adapter 调接口
4. 先真实化数据层，再真实化复杂交互
5. 先做只读接口，再做写入接口
6. 先做商家核销真实闭环，再做复杂内容生产真实闭环
7. 服务端权限必须二次校验
8. 前端角色隐藏不能作为安全依据
9. 真实接口失败必须有错误状态 / 空状态
10. 真实 AR 能力必须最后进入真机验收，不提前强接

---

## 4. Phase 3 推荐实施顺序

Phase 3 建议分 8 个子阶段推进：

1. ADAPTER_SESSION_PERSISTENCE_V1
2. AUTH_ROLE_IDENTITY_PLAN_V1
3. REAL_MERCHANT_REDEMPTION_API_V1
4. REAL_PARK_ACTIVITY_REVIEW_API_V1
5. REAL_PLATFORM_REVIEW_PUBLISH_API_V1
6. REAL_USER_EXPLORATION_API_V1
7. REAL_CONTENT_PRODUCTION_API_V1
8. REAL_AR_DEVICE_INTEGRATION_V1

---

## 5. Step 1：ADAPTER_SESSION_PERSISTENCE_V1

### 5.1 目标

将当前内存态 adapter session 改为可演示持久化状态。

当前 Phase 2 风险中已经记录：

1. Adapter session 多为内存态
2. 刷新页面后可能恢复 seed 数据
3. 跨页演示不稳定
4. mock 数据和旧 seed / localStorage 可能并存

本阶段目标是先解决演示稳定性，不接真实后端。

### 5.2 范围

需要处理：

1. adapter-session.js
2. mock-source.js
3. user-app-adapter.js
4. merchant-admin-adapter.js
5. park-admin-adapter.js
6. platform-admin-adapter.js
7. content-production-adapter.js
8. search-adapter.js

### 5.3 要求

1. 建立统一 sessionStorage / localStorage 持久化层
2. 提供 resetSession 方法
3. 提供 clearSession 方法
4. 提供 exportSessionSnapshot 方法
5. 提供 importSessionSnapshot 方法
6. 不改 Runtime 数据结构
7. 不接真实 API
8. 不破坏现有 mock 流程
9. 页面刷新后保留用户探索、核销、审查、发布、内容生产状态
10. 允许开发模式一键重置 mock 数据

### 5.4 产出

建议输出：

ADAPTER_SESSION_PERSISTENCE_V1

验收标记：

ADAPTER_SESSION_PERSISTENCE_V1_READY = YES

---

## 6. Step 2：AUTH_ROLE_IDENTITY_PLAN_V1

### 6.1 目标

规划真实登录与角色身份系统。

当前 Phase 2 已完成 role-map.js 驱动菜单和顶部按钮，但仍不是正式权限系统。

Phase 3 需要规划：

1. 用户登录
2. 商家管理员登录
3. 商家核销员登录
4. 园区负责人登录
5. 平台管理员登录
6. 平台代管视图身份
7. 服务端权限校验

### 6.2 角色

至少支持：

1. visitor / user
2. merchant_admin
3. merchant_staff
4. park_admin
5. platform_admin

### 6.3 身份字段

建议真实身份对象包含：

1. userId
2. role
3. phone
4. nickname
5. merchantId
6. parkId
7. allowedPortals
8. permissionScopes
9. token
10. tokenExpireAt
11. impersonationContext
12. createdAt
13. updatedAt

### 6.4 权限原则

1. 前端菜单按 role-map 显示
2. 后端接口必须按 token 校验
3. 商家只能访问自己 merchantId 数据
4. 核销员只能访问本人核销范围
5. 园区只能访问自己 parkId 数据
6. 平台可访问全局数据
7. 平台代管必须带 asPlatform / impersonationContext
8. 代管行为必须记录日志
9. 用户端不能访问后台接口

### 6.5 产出

建议输出：

AUTH_ROLE_IDENTITY_PLAN_V1

验收标记：

AUTH_ROLE_IDENTITY_PLAN_V1_READY = YES

---

## 7. Step 3：REAL_MERCHANT_REDEMPTION_API_V1

### 7.1 目标

把商家核销从 mock 内存流转推进到真实接口设计。

### 7.2 需要真实化的接口

建议接口：

1. GET /merchant/dashboard
2. GET /merchant/coupons
3. GET /merchant/coupons/:couponId
4. POST /merchant/redemptions/verify
5. POST /merchant/redemptions/redeem
6. GET /merchant/redemptions
7. GET /merchant/redemptions/:claimId
8. GET /merchant/staff/me
9. GET /merchant/help

### 7.3 核心校验规则

真实接口必须校验：

1. 核销码是否存在
2. 核销码是否已使用
3. 核销码是否过期
4. 核销码是否属于当前商家
5. 当前核销员是否属于该商家
6. 活动是否有效
7. 卡券是否启用
8. 是否重复提交
9. 是否写入审计日志

### 7.4 数据写入

真实核销成功后必须写入：

1. couponClaims.claimStatus = USED
2. couponClaims.redeemedAt
3. couponClaims.redeemedByStaffId
4. coupon.redeemedCount
5. merchant redemption records
6. operation log
7. user coupon status sync

### 7.5 产出

建议输出：

REAL_MERCHANT_REDEMPTION_API_V1

验收标记：

REAL_MERCHANT_REDEMPTION_API_PLAN_READY = YES

---

## 8. Step 4：REAL_PARK_ACTIVITY_REVIEW_API_V1

### 8.1 目标

把园区活动草稿、责任声明、发布检查、操作日志从 mock 流程推进到真实接口设计。

### 8.2 建议接口

1. GET /park/dashboard
2. GET /park/activities
3. GET /park/activities/:activityId
4. POST /park/activities
5. PATCH /park/activities/:activityId
6. POST /park/activities/:activityId/submit-review
7. GET /park/activities/:activityId/publish-check
8. GET /park/activities/:activityId/review-result
9. GET /park/activities/:activityId/operation-logs
10. GET /park/merchants
11. GET /park/help

### 8.3 责任声明

提交发布检查时必须记录：

1. declarationAccepted = true
2. declarationVersion
3. acceptedAt
4. operatorId
5. operatorRole
6. activityId
7. parkId
8. clientInfo
9. operationLogId

### 8.4 操作日志

真实日志必须记录：

1. 创建活动
2. 保存草稿
3. 提交发布检查
4. 查看检查结论
5. 修改后再次提交
6. 下载操作手册
7. 提交工单

### 8.5 产出

建议输出：

REAL_PARK_ACTIVITY_REVIEW_API_V1

验收标记：

REAL_PARK_ACTIVITY_REVIEW_API_PLAN_READY = YES

---

## 9. Step 5：REAL_PLATFORM_REVIEW_PUBLISH_API_V1

### 9.1 目标

把平台审查中心、发布中心、发布日志、Runtime 状态从 mock 流程推进到真实接口设计。

### 9.2 建议接口

审查接口：

1. GET /platform/reviews
2. GET /platform/reviews/:reviewId
3. POST /platform/reviews/:reviewId/decision
4. GET /platform/reviews/:reviewId/logs

发布接口：

1. GET /platform/publishes
2. GET /platform/publishes/:publishId
3. POST /platform/publishes/:publishId/publish
4. GET /platform/publishes/:publishId/logs
5. POST /platform/publishes/:publishId/rollback-request

平台总览：

1. GET /platform/dashboard
2. GET /platform/risks
3. GET /platform/tickets

### 9.3 审查决策

真实审查必须支持：

1. APPROVED
2. REJECTED
3. NEED_INFO
4. BLOCKED

必须记录：

1. reviewerId
2. reviewerRole
3. reviewConclusion
4. blockReason
5. optimizationSuggestion
6. needSupplement
7. nextStepSuggestion
8. reviewedAt
9. reviewLog

### 9.4 发布任务

真实发布不应同步直接完成，而应设计为任务：

READY_TO_PUBLISH
→ PUBLISHING
→ PUBLISHED / PUBLISH_FAILED

应支持：

1. publishTaskId
2. runtimeTarget
3. publishPayload
4. publishStatus
5. publishLog
6. rollbackPlaceholder
7. errorReason

### 9.5 产出

建议输出：

REAL_PLATFORM_REVIEW_PUBLISH_API_V1

验收标记：

REAL_PLATFORM_REVIEW_PUBLISH_API_PLAN_READY = YES

---

## 10. Step 6：REAL_USER_EXPLORATION_API_V1

### 10.1 目标

把用户端探索地图、探索点状态、打卡、信物显现、礼遇领取、用户进度从 mock 流程推进到真实接口设计。

### 10.2 建议接口

首页：

1. GET /user/home

探索：

1. GET /user/explore-map
2. GET /user/exploration-points/:pointId
3. POST /user/exploration-points/:pointId/start
4. POST /user/exploration-points/:pointId/check-in
5. POST /user/exploration-points/:pointId/ar-scan/start
6. POST /user/exploration-points/:pointId/ar-scan/complete
7. POST /user/exploration-points/:pointId/reveal-relic
8. POST /user/exploration-points/:pointId/unlock-coupon

信物：

1. GET /user/relics
2. GET /user/relics/:relicId

权益：

1. GET /user/rights
2. GET /user/coupon-claims/:claimId

我的：

1. GET /user/profile
2. GET /user/star-map
3. GET /user/meridian-map

### 10.3 真实打卡校验

真实打卡不能只靠前端按钮，需校验：

1. 用户身份
2. 活动状态
3. 探索点是否可用
4. 用户是否已完成
5. 定位或扫码凭证
6. 时间窗口
7. 防重复领取
8. 防刷
9. 日志记录

### 10.4 礼遇领取

真实领取需校验：

1. 用户是否完成探索点
2. 信物是否已显现
3. 卡券库存是否充足
4. 是否已领取过
5. 活动是否有效
6. 商家是否可承接
7. 生成唯一 claimCode
8. 与商家核销接口联动

### 10.5 产出

建议输出：

REAL_USER_EXPLORATION_API_V1

验收标记：

REAL_USER_EXPLORATION_API_PLAN_READY = YES

---

## 11. Step 7：REAL_CONTENT_PRODUCTION_API_V1

### 11.1 目标

把探索点、信物、祝福内容、AR内容、美术需求单、生成任务从 mock 流程推进到真实接口设计。

### 11.2 建议接口

探索点：

1. GET /platform/content/exploration-points
2. POST /platform/content/exploration-points
3. PATCH /platform/content/exploration-points/:pointId

信物：

1. GET /platform/content/relics
2. POST /platform/content/relics/generate-placeholder
3. PATCH /platform/content/relics/:relicId

祝福内容：

1. GET /platform/content/blessing-contents
2. POST /platform/content/blessing-contents/generate
3. PATCH /platform/content/blessing-contents/:contentId

AR内容：

1. GET /platform/content/ar-contents
2. POST /platform/content/ar-contents/generate-placeholder
3. PATCH /platform/content/ar-contents/:arId

美术需求单：

1. GET /platform/content/art-requests
2. POST /platform/content/art-requests
3. PATCH /platform/content/art-requests/:requestId

生成任务：

1. GET /platform/content/generation-tasks
2. GET /platform/content/generation-tasks/:taskId
3. POST /platform/content/generation-tasks/:taskId/continue

提交审查：

1. POST /platform/content/:targetType/:targetId/submit-review

### 11.3 内容生产原则

1. 信物不是数字藏品
2. AR内容必须绑定探索点和信物显现节点
3. 祝福内容必须遵守术语规则
4. 美术需求单必须保留生成 Prompt
5. 生成任务应异步化
6. 平台审查通过后才能发布
7. 未发布内容不能进入用户端

### 11.4 产出

建议输出：

REAL_CONTENT_PRODUCTION_API_V1

验收标记：

REAL_CONTENT_PRODUCTION_API_PLAN_READY = YES

---

## 12. Step 8：REAL_AR_DEVICE_INTEGRATION_V1

### 12.1 目标

规划真实 AR、摄像头、定位、设备能力接入。

### 12.2 能力范围

至少包括：

1. 摄像头权限
2. AR 扫描 SDK
3. 图片识别 / 空间识别
4. 定位权限
5. 扫码入口
6. 设备兼容性检测
7. 弱网 / 低端机降级
8. AR 失败回退路径
9. 真机验收

### 12.3 关键要求

1. AR 显现仍应保持东方克制风格
2. 不做抽卡 / 爆奖 / SSR 表达
3. 失败时要能继续完成探索
4. AR 不应阻塞礼遇领取主路径
5. 低端设备提供非 AR fallback
6. 真机验收优先于模拟器验收

### 12.4 产出

建议输出：

REAL_AR_DEVICE_INTEGRATION_V1

验收标记：

REAL_AR_DEVICE_INTEGRATION_PLAN_READY = YES

---

## 13. Phase 3 数据安全与权限要求

Phase 3 开始后，必须明确：

1. 前端权限只控制显示
2. 后端权限控制访问
3. 每个写操作必须带 actorId
4. 每个关键操作必须写 operationLog
5. 核销、发布、审核、责任声明必须有审计记录
6. 用户端不得访问后台数据
7. 商家不得越权访问其他商家数据
8. 园区不得越权访问其他园区数据
9. 平台代管必须记录代管上下文
10. 真实接口必须有错误码和错误提示

---

## 14. Phase 3 验收边界

Phase 3 规划通过不代表真实接口已完成。

本阶段文档完成后，只表示：

1. 真实接口范围已定义
2. 权限接入路径已定义
3. 接口替换顺序已定义
4. 风险点已记录
5. 后续可逐项执行真实接入任务

---

## 15. 下一步建议

Phase 3 规划完成后，不建议马上全面接真实后端。

建议优先执行：

ADAPTER_SESSION_PERSISTENCE_V1

原因：

1. 当前 adapter session 内存态刷新会丢
2. 跨页演示稳定性不够
3. 持久化后可作为真实 API 接入前的最后稳定演示层
4. 不接真实后端，风险低
5. 能为真实接口替换提供更清晰边界

---

## 16. 验收标记

PHASE3_REAL_API_AND_PERMISSION_INTEGRATION_PLAN_V1_CREATED = YES
PHASE3_REAL_API_SCOPE_DEFINED = YES
PHASE3_PERMISSION_SECURITY_PRINCIPLES_DEFINED = YES
PHASE3_IMPLEMENTATION_SEQUENCE_DEFINED = YES
ADAPTER_SESSION_PERSISTENCE_V1_PLANNED = YES
AUTH_ROLE_IDENTITY_PLAN_V1_PLANNED = YES
REAL_MERCHANT_REDEMPTION_API_V1_PLANNED = YES
REAL_PARK_ACTIVITY_REVIEW_API_V1_PLANNED = YES
REAL_PLATFORM_REVIEW_PUBLISH_API_V1_PLANNED = YES
REAL_USER_EXPLORATION_API_V1_PLANNED = YES
REAL_CONTENT_PRODUCTION_API_V1_PLANNED = YES
REAL_AR_DEVICE_INTEGRATION_V1_PLANNED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_ADAPTER_SESSION_PERSISTENCE_V1 = YES
