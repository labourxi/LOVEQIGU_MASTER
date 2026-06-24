# REAL_USER_EXPLORATION_API_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的用户端真实探索接口接入方案。

Phase 2 已完成 `USER_EXPLORATION_RUNTIME_FLOW_V1`，实现了首页、探索地图、探索点详情、Mock 打卡、AR 显现占位、信物显现、信物库更新、礼遇解锁、权益中心显示核销码、商家核销联动、我的 / 星图 / 经络图进度同步的 mock Runtime 数据闭环。

Phase 3 已完成 `REAL_PLATFORM_REVIEW_PUBLISH_API_V1`，明确了用户端只能读取平台审查通过并发布成功的 Runtime 内容，未发布、阻断、待补充内容不进入用户端主列表。

本文件用于将用户端探索体验从 mock adapter 流程推进到真实 API 设计阶段，为后续真实接口实现提供标准。

本轮只做规划，不直接接真实后端，不接真实 AR SDK，不接真实定位。

---

## 2. 本轮目标

本轮目标：

1. 定义用户首页真实 API 范围
2. 定义探索地图真实 API 范围
3. 定义探索点详情真实 API 范围
4. 定义用户打卡真实接口规划
5. 定义 AR 扫描开始 / 完成真实接口规划
6. 定义信物显现真实接口规划
7. 定义礼遇领取真实接口规划
8. 定义用户权益中心真实接口规划
9. 定义用户进度 / 星图 / 经络图真实数据源
10. 定义用户端读取已发布 Runtime 内容的规则
11. 定义用户端与商家核销状态同步规则
12. 定义错误码与前端中文提示
13. 定义 user-app-adapter 从 mock 到真实 API 的替换边界
14. 定义后续真实接口实施顺序

---

## 3. 当前基础

已完成基础：

1. DATA_ADAPTER_LAYER_V1
2. USER_EXPLORATION_RUNTIME_FLOW_V1
3. MERCHANT_REDEMPTION_DATA_FLOW_V1
4. CONTENT_PRODUCTION_DATA_FLOW_V1
5. PLATFORM_REVIEW_PUBLISH_FLOW_V1
6. ADAPTER_SESSION_PERSISTENCE_V1
7. AUTH_ROLE_IDENTITY_PLAN_V1
8. REAL_MERCHANT_REDEMPTION_API_V1
9. REAL_PLATFORM_REVIEW_PUBLISH_API_V1

当前已有相关文件：

1. apps/shared/data-adapter/user-app-adapter.js
2. apps/shared/data-adapter/merchant-admin-adapter.js
3. apps/shared/data-adapter/platform-admin-adapter.js
4. apps/shared/data-adapter/content-production-adapter.js
5. apps/shared/data-adapter/adapter-session.js
6. apps/shared/data-adapter/mock-source.js
7. apps/shared/data-adapter/status-map.js
8. apps/shared/data-adapter/role-map.js

当前 mock 已验证：

1. 用户首页可展示活动与进度
2. 探索地图可展示探索点状态
3. 探索点详情可展示信物 / 礼遇 / AR 显现入口
4. 用户可完成 mock 打卡
5. 用户可完成 AR 显现占位
6. 用户可显现信物
7. 用户可解锁礼遇
8. 权益中心可显示核销码
9. 商家核销后用户权益可显示已核销
10. 信物库、我的、星图、经络图可同步进度

---

## 4. 真实角色与权限边界

### 4.1 visitor

未登录游客。

可访问：用户端公开首页、景区 / 活动公开信息、部分探索点预览、活动介绍、登录入口。

不可访问：用户专属进度、我的信物、权益中心、礼遇领取、打卡写入、AR 扫描完成写入、信物显现写入。

### 4.2 user

普通登录用户。

可访问：用户首页、探索地图、探索点详情、打卡流程、AR 显现流程、信物库、权益中心、我的页面、星图 / 经络图进度。

可执行：开始探索、打卡、开始 AR 扫描、完成 AR 扫描、显现信物、领取礼遇、查看权益状态、查看进度。

不可访问：商家后台、园区后台、平台后台、内容生产后台、其他用户进度、其他用户权益。

### 4.3 权限 scope

| Scope | 说明 |
|-------|------|
| user.home.read | 用户首页 |
| user.explore.read | 探索地图 / 探索点详情 |
| user.explore.write | 开始探索 / 打卡 / AR 扫描 |
| user.relic.read | 信物库 / 信物详情 |
| user.relic.write | 信物显现 |
| user.rights.read | 权益中心 |
| user.rights.claim | 礼遇领取 |
| user.profile.read | 我的页面 |
| user.progress.read | 星图 / 经络图进度 |
| user.progress.write | 进度写入（与 explore.write 联动） |

---

## 5. 真实数据对象

### 5.1 runtimeActivities

用户端可见活动。只应包含平台发布成功的活动。

```json
{
  "id": "activity_001",
  "parkId": "park_001",
  "name": "爱企谷初见寻宝节",
  "status": "ACTIVE",
  "publishStatus": "PUBLISHED",
  "runtimeStatus": "PUBLISHED",
  "coverImage": "",
  "description": "活动说明",
  "startDate": "2026-06-20",
  "endDate": "2026-07-20",
  "explorationPointCount": 8,
  "relicCount": 8,
  "couponCount": 3,
  "createdAt": "2026-06-20T10:00:00+08:00",
  "updatedAt": "2026-06-20T10:00:00+08:00"
}
```

### 5.2 runtimeExplorationPoints

用户端可见探索点。

```json
{
  "id": "ep_001",
  "activityId": "activity_001",
  "parkId": "park_001",
  "name": "初见之门",
  "description": "探索点说明",
  "locationLabel": "爱企谷入口",
  "geo": {
    "lat": 0,
    "lng": 0
  },
  "status": "PUBLISHED",
  "runtimeStatus": "PUBLISHED",
  "requiredCheckInType": "MOCK_OR_LOCATION_OR_QR",
  "relicId": "relic_001",
  "couponId": "coupon_001",
  "arContentId": "ar_001",
  "sortOrder": 1
}
```

### 5.3 userProgress

用户活动级进度。

```json
{
  "id": "progress_001",
  "userId": "user_001",
  "activityId": "activity_001",
  "parkId": "park_001",
  "startedAt": "2026-06-20T10:00:00+08:00",
  "completedPointCount": 1,
  "totalPointCount": 8,
  "revealedRelicCount": 1,
  "unlockedCouponCount": 1,
  "lastPointId": "ep_001",
  "updatedAt": "2026-06-20T10:30:00+08:00"
}
```

### 5.4 userPointStates

用户探索点状态。

```json
{
  "id": "ups_001",
  "userId": "user_001",
  "activityId": "activity_001",
  "pointId": "ep_001",
  "status": "RELIC_REVEALED",
  "startedAt": "2026-06-20T10:00:00+08:00",
  "checkedInAt": "2026-06-20T10:05:00+08:00",
  "arScannedAt": "2026-06-20T10:10:00+08:00",
  "relicRevealedAt": "2026-06-20T10:12:00+08:00",
  "couponUnlockedAt": "2026-06-20T10:15:00+08:00",
  "updatedAt": "2026-06-20T10:15:00+08:00"
}
```

### 5.5 userRelics

用户已显现信物。

```json
{
  "id": "user_relic_001",
  "userId": "user_001",
  "relicId": "relic_001",
  "activityId": "activity_001",
  "pointId": "ep_001",
  "relicName": "角宿之印",
  "relicLevel": "星名",
  "relicType": "story_progress_asset",
  "revealedAt": "2026-06-20T10:12:00+08:00"
}
```

注意：信物是故事进度资产，不是数字藏品。不得在本接口中将信物描述为数字藏品。

### 5.6 couponClaims

用户礼遇领取记录。

```json
{
  "id": "claim_001",
  "couponId": "coupon_001",
  "userId": "user_001",
  "merchantId": "merchant_001",
  "parkId": "park_001",
  "activityId": "activity_001",
  "sourcePointId": "ep_001",
  "sourceRelicId": "relic_001",
  "claimCode": "LQG-CAFE-1001",
  "claimStatus": "UNUSED",
  "claimedAt": "2026-06-20T10:15:00+08:00",
  "redeemedAt": null,
  "redeemedByStaffId": null,
  "expireAt": "2026-07-20T23:59:59+08:00"
}
```

**claimStatus 支持：**

1. UNUSED — 待核销
2. USED — 已核销
3. EXPIRED — 已过期
4. INVALID — 已失效

---

## 6. 用户探索状态流转规则

用户探索点状态建议为：

1. LOCKED — 未解锁
2. AVAILABLE — 可探索
3. STARTED — 已开始
4. CHECKED_IN — 已打卡
5. AR_SCANNED — 已完成 AR 扫描
6. RELIC_REVEALED — 信物已显现
7. COUPON_UNLOCKED — 礼遇已解锁
8. COMPLETED — 该探索点已完成

允许流转：

```
LOCKED → AVAILABLE → STARTED → CHECKED_IN → AR_SCANNED → RELIC_REVEALED → COUPON_UNLOCKED → COMPLETED
```

简化场景允许：`AVAILABLE → CHECKED_IN → RELIC_REVEALED`

禁止：

1. 未打卡直接显现信物
2. 未显现信物直接领取礼遇
3. 已完成探索点重复领取礼遇
4. 未发布探索点进入用户端
5. 用户修改其他用户进度
6. 前端自行伪造完成状态

---

## 7. 真实 API 范围

基础路径：`/api/v1/user`

所有需要登录的请求必须携带：

1. `Authorization: Bearer <token>`
2. 服务端解析 userId
3. 写操作携带 actorId / userId
4. 不信任前端单独传入 userId

### 7.1 首页

**GET** `/user/home`

权限：visitor 可读公开部分；`user.home.read` 可读完整用户态。

返回：当前推荐活动、最近活动进度、已显现信物数量、可用礼遇数量、最近探索点、登录状态提示。

### 7.2 探索地图

**GET** `/user/explore-map`

权限：`user.explore.read`

参数：activityId；parkId（可选）。

返回：activity、explorationPoints、userPointStates、progressSummary、lockedReason（可选）。

### 7.3 探索点详情

**GET** `/user/exploration-points/:pointId`

权限：`user.explore.read`

返回：point、pointState、relicPreview、couponPreview、arContentPreview、availableActions、navigationInfo。

### 7.4 开始探索

**POST** `/user/exploration-points/:pointId/start`

权限：`user.explore.write`

写入：userPointStates.status = STARTED；userProgress.lastPointId = pointId；operationLog。

### 7.5 打卡

**POST** `/user/exploration-points/:pointId/check-in`

权限：`user.explore.write`

请求：

```json
{
  "checkInType": "MOCK_OR_LOCATION_OR_QR",
  "credential": "CHECKIN_CREDENTIAL_PLACEHOLDER"
}
```

真实校验可分阶段接入：Mock credential → QR credential → Location credential → AR scan credential。

成功写入：userPointStates.status = CHECKED_IN；checkedInAt = now；operationLog。

### 7.6 开始 AR 扫描

**POST** `/user/exploration-points/:pointId/ar-scan/start`

权限：`user.explore.write`

返回：scanSessionId、arContent、fallbackAllowed、timeoutSeconds。

### 7.7 完成 AR 扫描

**POST** `/user/exploration-points/:pointId/ar-scan/complete`

权限：`user.explore.write`

请求：

```json
{
  "scanSessionId": "scan_001",
  "scanResult": "SUCCESS",
  "deviceInfo": {}
}
```

成功写入：userPointStates.status = AR_SCANNED；arScannedAt = now；arScanSessions.status = COMPLETED；operationLog。

如果设备不支持 AR，可走 fallback：`scanResult = FALLBACK_COMPLETED`。

### 7.8 信物显现

**POST** `/user/exploration-points/:pointId/reveal-relic`

权限：`user.relic.write`

前置校验：用户已打卡；如该点要求 AR 则已完成 AR 扫描或 fallback；relic 已发布；用户未重复显现该 relic。

成功写入：userRelics 新增记录；userPointStates.status = RELIC_REVEALED；relicRevealedAt = now；userProgress.revealedRelicCount + 1；operationLog。

### 7.9 礼遇领取

**POST** `/user/exploration-points/:pointId/unlock-coupon`

权限：`user.rights.claim`

前置校验：用户已显现该点信物；coupon 已发布且 ACTIVE；coupon 有库存；用户未重复领取；活动仍有效；商家可承接。

成功写入：couponClaims 新增记录；claimStatus = UNUSED；claimCode 生成；userPointStates.status = COUPON_UNLOCKED 或 COMPLETED；userProgress.unlockedCouponCount + 1；operationLog。

### 7.10 信物库

**GET** `/user/relics`

权限：`user.relic.read`

返回：userRelics、relicArchiveGroups、ownedCount、totalCount、lockedSlotsCollapsed = true。

必须保留 Phase 1 信物空位折叠规则。

### 7.11 信物详情

**GET** `/user/relics/:relicId`

权限：`user.relic.read`

返回：relic detail、revealedAt、sourcePoint、storyProgressInfo。

不得返回数字藏品营销字段。

### 7.12 权益中心

**GET** `/user/rights`

权限：`user.rights.read`

返回：couponClaims、claimStatus、claimCode、merchantInfo、expireAt、redeemedAt、redeemedByMerchant（可选）。

商家核销成功后，用户端通过该接口读取 USED 状态。

### 7.13 权益详情

**GET** `/user/coupon-claims/:claimId`

权限：`user.rights.read`

返回单条权益详情。

### 7.14 我的页面

**GET** `/user/profile`

权限：`user.profile.read`

返回：userInfo、progressSummary、relicCount、couponCount、completedPointCount。

### 7.15 星图进度

**GET** `/user/star-map`

权限：`user.progress.read`

返回：四象进度、二十八宿进度、星名级信物进度、已显现 / 未显现状态。

### 7.16 经络图进度

**GET** `/user/meridian-map`

权限：`user.progress.read`

返回：经络进度、穴位级信物进度、已显现 / 未显现状态。

---

## 8. Runtime 内容读取规则

用户端只能读取满足以下条件的内容：

1. publishStatus = PUBLISHED
2. runtimeStatus = PUBLISHED
3. activity.status = ACTIVE
4. 当前时间在活动有效期内
5. explorationPoint.runtimeStatus = PUBLISHED
6. relic.runtimeStatus = PUBLISHED
7. arContent.runtimeStatus = PUBLISHED 或 fallbackAllowed = true
8. coupon.status = ACTIVE

禁止用户端读取：DRAFT、PENDING_REVIEW、NEED_INFO、BLOCKED、REJECTED、READY_TO_PUBLISH 但未发布、PUBLISH_FAILED、平台内容生产草稿。

---

## 9. 打卡与防作弊规则

真实打卡不能只靠前端按钮。服务端必须校验：

1. token 有效
2. userId 来自 token
3. pointId 存在
4. point 已发布
5. activity 有效
6. 用户是否已完成该点
7. checkInType 是否符合该点要求
8. credential 是否有效
9. 是否重复打卡
10. 是否异常频繁操作

分阶段策略：

- **Phase A：Mock Credential** — 用于真实 API 初期联调
- **Phase B：QR Credential** — 入口二维码 / 探索点二维码校验
- **Phase C：Location Credential** — 定位范围校验
- **Phase D：AR Credential** — AR 扫描结果作为打卡凭证之一

---

## 10. AR 接入边界

本轮不接真实 AR SDK。真实 AR 接入必须另行进入 **REAL_AR_DEVICE_INTEGRATION_V1**。本文件只定义用户端 API 对 AR 的状态接口。

原则：

1. AR 不是抽卡
2. AR 不是炫技素材库
3. AR 必须绑定探索点
4. AR 必须绑定信物显现节点
5. AR 失败必须有 fallback
6. 低端设备不应阻断主体验
7. AR 完成后才允许触发信物显现，除非该点允许 fallback

---

## 11. 用户权益与商家核销同步

商家核销真实 API 已定义：couponClaims.claimStatus = USED；redeemedAt；redeemedByStaffId；redeemedByMerchantId。

用户端读取权益时：

1. `GET /user/rights` 读取 couponClaims
2. `GET /user/coupon-claims/:claimId` 读取单条
3. 不由用户端自行改 USED
4. 不由商家端单独维护另一份状态
5. 用户端与商家端共享服务端 couponClaims 权威数据源

状态显示：UNUSED → 待核销；USED → 已核销；EXPIRED → 已过期；INVALID → 已失效。

---

## 12. 操作日志与审计要求

以下用户操作必须写日志：

1. START_EXPLORATION
2. CHECK_IN
3. AR_SCAN_START
4. AR_SCAN_COMPLETE
5. RELIC_REVEAL
6. COUPON_UNLOCK
7. RIGHTS_VIEW
8. PROFILE_VIEW
9. CHECKIN_FAILED
10. COUPON_CLAIM_FAILED

日志字段：id、actorId、actorRole = user、userId、activityId、pointId、action、beforeStatus、afterStatus、result、errorCode、clientInfo、deviceInfo、createdAt。

---

## 13. 错误码与中文提示

| errorCode | 中文提示 |
| --------- | -------- |
| AUTH_REQUIRED | 请先登录后继续探索 |
| TOKEN_EXPIRED | 登录已过期，请重新登录 |
| USER_MISMATCH | 无权访问该用户数据 |
| ACTIVITY_NOT_FOUND | 未找到该活动 |
| ACTIVITY_NOT_ACTIVE | 当前活动未开始或已结束 |
| POINT_NOT_FOUND | 未找到该探索点 |
| POINT_NOT_PUBLISHED | 该探索点暂未开放 |
| POINT_LOCKED | 该探索点暂未解锁 |
| CHECKIN_REQUIRED | 请先完成打卡 |
| CHECKIN_INVALID | 打卡凭证无效 |
| AR_REQUIRED | 请先完成 AR 显现 |
| AR_NOT_SUPPORTED | 当前设备暂不支持 AR，可使用备用流程 |
| RELIC_NOT_FOUND | 未找到该信物 |
| RELIC_ALREADY_REVEALED | 该信物已显现 |
| COUPON_NOT_AVAILABLE | 当前礼遇不可领取 |
| COUPON_OUT_OF_STOCK | 礼遇已领完 |
| COUPON_ALREADY_CLAIMED | 你已领取过该礼遇 |
| NETWORK_ERROR | 网络异常，请稍后重试 |

前端应通过 user-app-adapter 统一映射中文，不在页面散落硬编码。

---

## 14. user-app-adapter 替换边界

### 14.1 保持不变的页面调用

页面继续调用：

1. `getHomeData(userId, activityId)`
2. `getExploreMapData(userId, activityId)`
3. `getExplorationPointDetail(pointId, userId)`
4. `startExploration(pointId, userId)`
5. `mockCheckIn(pointId, userId, actor)`
6. `startARScan(pointId, userId)`
7. `completeARScan(scanSessionId, userId)`
8. `revealRelic(pointId, userId)`
9. `unlockCoupon(pointId, userId)`
10. `getRelicArchive(userId)`
11. `getRelicDetail(relicId, userId)`
12. `getRightsCenter(userId)`
13. `getCouponClaimDetail(claimId, userId)`
14. `getProfileData(userId)`
15. `getStarMapProgress(userId)`
16. `getMeridianProgress(userId)`

### 14.2 api mode 下 adapter 行为

当 `LoveqiguDataAdapter.mode === "api"`：

1. 上述方法映射到 `/api/v1/user/*`
2. 自动附加 Authorization header
3. 自动携带 actorContext
4. 响应结构与 mock 一致
5. 错误映射为 `ok: false` + `statusLabel` + `message`
6. 写操作不再依赖 adapter-session 作为权威源
7. 用户端只读取已发布 Runtime 内容
8. 商家核销状态由服务端 couponClaims 返回
9. AR 扫描状态由服务端 scanSession 返回

### 14.3 mock mode 保留

`mode === "mock"` 时保持 Phase 2 行为 + `ADAPTER_SESSION_PERSISTENCE_V1` 持久化，用于演示与回归。

页面层不感知 mock / api 差异。

---

## 15. 真实接口实施顺序建议

建议后续实施分 6 步：

### Step 1：用户端只读 Runtime

1. GET /user/home
2. GET /user/explore-map
3. GET /user/exploration-points/:pointId

验证：只读取 PUBLISHED Runtime 内容；页面展示与 mock 一致；未发布内容不进入用户端。

### Step 2：用户进度只读

1. GET /user/profile
2. GET /user/relics
3. GET /user/rights
4. GET /user/star-map
5. GET /user/meridian-map

验证：用户只能读取自己的数据；信物库折叠规则保留；权益状态与商家核销一致。

### Step 3：打卡写入

1. POST /user/exploration-points/:pointId/start
2. POST /user/exploration-points/:pointId/check-in

验证：服务端防重复；不允许越权 userId；打卡后状态更新。

### Step 4：AR 状态接口

1. POST /user/exploration-points/:pointId/ar-scan/start
2. POST /user/exploration-points/:pointId/ar-scan/complete

验证：不接真实 AR SDK；先用 mock credential / fallback；状态可进入 AR_SCANNED。

### Step 5：信物显现与礼遇领取

1. POST /user/exploration-points/:pointId/reveal-relic
2. POST /user/exploration-points/:pointId/unlock-coupon

验证：信物不会重复显现；礼遇不会重复领取；couponClaims 与商家核销共享数据源。

### Step 6：真实 AR / 定位专项

进入 **REAL_AR_DEVICE_INTEGRATION_V1**。

---

## 16. 禁止事项

1. 不修改用户端页面视觉与结构
2. 不接真实后端，本轮仅文档
3. 不接真实 AR SDK
4. 不接真实定位
5. 不改 Runtime 数据结构
6. 不破坏 Phase 2 mock 用户探索流程
7. 不让页面直接 fetch API
8. 不允许未发布内容进入用户端
9. 不允许用户端把信物当数字藏品
10. 不允许用户端自行写入已核销状态

验收：`NO_USER_EXPLORATION_LOGIC_CHANGE = CONFIRMED`

---

## 17. 风险点

1. Mock 打卡与真实定位 / QR / AR 凭证存在差异
2. AR SDK 接入复杂，必须后置为独立专项
3. 用户端读取 Runtime 内容必须严格过滤未发布对象
4. 礼遇领取与商家核销必须共享 couponClaims 权威源
5. 信物与数字藏品边界必须持续保持
6. 用户端多次点击可能导致重复打卡 / 重复领取
7. 低端设备无法 AR 时必须保留 fallback
8. 星图 / 经络图真实进度需要后续统一信物分类模型

---

## 18. 下一步建议

完成本规划后，建议进入：

**REAL_CONTENT_PRODUCTION_API_V1**

目标：

1. 定义内容生产真实接口
2. 定义探索点 / 信物 / 祝福内容 / AR 内容 / 美术需求单真实写入
3. 定义内容生产如何提交平台审查
4. 定义内容生产与用户端 Runtime 发布的边界

---

## 19. 验收标记

```
REAL_USER_EXPLORATION_API_V1_CREATED = YES
REAL_USER_HOME_API_DEFINED = YES
REAL_USER_EXPLORE_MAP_API_DEFINED = YES
REAL_USER_POINT_DETAIL_API_DEFINED = YES
REAL_USER_CHECKIN_API_DEFINED = YES
REAL_USER_AR_SCAN_API_DEFINED = YES
REAL_USER_RELIC_REVEAL_API_DEFINED = YES
REAL_USER_COUPON_UNLOCK_API_DEFINED = YES
REAL_USER_RIGHTS_API_DEFINED = YES
REAL_USER_PROFILE_PROGRESS_API_DEFINED = YES
REAL_USER_RUNTIME_READ_RULE_DEFINED = YES
REAL_USER_MERCHANT_REDEMPTION_SYNC_DEFINED = YES
REAL_USER_ERROR_CODES_DEFINED = YES
REAL_USER_ADAPTER_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_USER_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_USER_EXPLORATION_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_USER_EXPLORATION_API_PLAN_READY = YES
READY_FOR_REAL_CONTENT_PRODUCTION_API_V1 = YES
```
