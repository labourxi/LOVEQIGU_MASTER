# REAL_MERCHANT_REDEMPTION_API_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的商家核销真实接口接入方案。

Phase 2 已完成 `MERCHANT_REDEMPTION_DATA_FLOW_V1`，实现了用户领取卡券、生成核销码、商家扫码 / 输入核销码、校验状态、核销成功、核销记录、商家看板更新、用户权益状态联动的 mock 数据闭环。

Phase 3 已完成 `AUTH_ROLE_IDENTITY_PLAN_V1`，明确了真实身份、token、permission scope、merchantId / staffId 权限边界和审计日志原则。

本文件用于将商家核销从 mock adapter 流程推进到真实 API 设计阶段，为后续真实接口实现提供标准。

本轮只做规划，不直接接真实后端。

---

## 2. 本轮目标

本轮目标：

1. 定义商家核销真实 API 范围
2. 定义商家管理员与核销员权限边界
3. 定义核销码校验规则
4. 定义核销成功写入规则
5. 定义防重复核销规则
6. 定义跨商家越权校验
7. 定义用户权益状态同步规则
8. 定义商家 Dashboard / 核销记录 / 卡券统计更新规则
9. 定义审计日志要求
10. 定义错误码与前端中文提示
11. 定义 merchant-admin-adapter 从 mock 到真实 API 的替换边界
12. 定义后续真实接口实施顺序

---

## 3. 当前基础

已完成基础：

1. DATA_ADAPTER_LAYER_V1
2. MERCHANT_REDEMPTION_DATA_FLOW_V1
3. USER_EXPLORATION_RUNTIME_FLOW_V1
4. ADAPTER_SESSION_PERSISTENCE_V1
5. AUTH_ROLE_IDENTITY_PLAN_V1

当前已有相关文件：

1. apps/shared/data-adapter/merchant-admin-adapter.js
2. apps/shared/data-adapter/user-app-adapter.js
3. apps/shared/data-adapter/adapter-session.js
4. apps/shared/data-adapter/mock-source.js
5. apps/shared/data-adapter/status-map.js
6. apps/shared/data-adapter/role-map.js

当前 mock 已验证：

1. 用户端领取礼遇后生成 couponClaim
2. couponClaim 包含 claimCode
3. 商家核销页可识别核销码
4. 商家核销成功后 claimStatus = USED
5. 用户权益中心可读取已核销状态
6. 商家核销记录更新
7. 商家 Dashboard 统计更新

---

## 4. 真实角色与权限边界

### 4.1 merchant_admin

商家管理员。

可访问：

1. 商家工作台
2. 卡券列表
3. 卡券详情
4. 全部核销记录
5. 财务数据
6. 工单
7. 账号管理
8. 员工核销统计

可执行：

1. 查看核销记录
2. 查看卡券领取 / 核销数据
3. 查看财务数据
4. 提交工单
5. 查看员工核销表现

默认不建议直接做核销操作，但可按业务需要开放。

### 4.2 merchant_staff

商家核销员。

可访问：

1. 核销页面
2. 本人核销记录
3. 基础帮助文档

可执行：

1. 校验核销码
2. 完成核销
3. 查看本人核销记录

不可访问：

1. 财务数据
2. 卡券配置
3. 商家全部核销记录
4. 商家账号管理
5. 其他员工核销记录

### 4.3 权限 scope

建议使用：

| Scope | 角色 |
|-------|------|
| merchant.dashboard.read | merchant_admin |
| merchant.coupon.read | merchant_admin |
| merchant.redemption.read | merchant_admin |
| merchant.redemption.read.self | merchant_staff |
| merchant.redemption.write | merchant_admin, merchant_staff |
| merchant.finance.read | merchant_admin |
| merchant.account.manage | merchant_admin |

---

## 5. 真实数据对象

### 5.1 couponClaims

用户领取记录。

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
  "claimedAt": "2026-06-20T10:00:00+08:00",
  "redeemedAt": null,
  "redeemedByStaffId": null,
  "redeemedByMerchantId": null,
  "expireAt": "2026-07-20T23:59:59+08:00",
  "createdAt": "2026-06-20T10:00:00+08:00",
  "updatedAt": "2026-06-20T10:00:00+08:00"
}
```

| 字段 | 说明 |
|------|------|
| claimStatus | UNUSED / USED / EXPIRED / INVALID |
| claimCode | 到店核销码，全局唯一 |
| redeemedByStaffId | 核销员工 ID |
| redeemedByMerchantId | 冗余校验字段，防越权 |
| expireAt | 礼遇有效期 |

### 5.2 coupons

商家卡券模板。

```json
{
  "id": "coupon_001",
  "merchantId": "merchant_001",
  "parkId": "park_001",
  "activityId": "activity_001",
  "name": "咖啡到店礼",
  "benefitType": "EXCHANGE",
  "description": "到店享 8 折礼遇",
  "issueTotal": 300,
  "claimedCount": 180,
  "redeemedCount": 72,
  "claimRate": 0.6,
  "redemptionRate": 0.4,
  "startDate": "2026-06-01",
  "endDate": "2026-08-31",
  "status": "ACTIVE"
}
```

### 5.3 redemptionRecords

商家侧核销记录（可与 couponClaims 同表或视图）。

```json
{
  "id": "claim_001",
  "claimId": "claim_001",
  "couponId": "coupon_001",
  "couponName": "咖啡到店礼",
  "claimCode": "LQG-CAFE-1001",
  "userId": "user_001",
  "userMask": "用户0001",
  "merchantId": "merchant_001",
  "staffId": "staff_002",
  "staffName": "小李",
  "activityId": "activity_001",
  "activityName": "爱企谷初见寻宝节",
  "claimStatus": "USED",
  "claimedAt": "2026-06-20T10:00:00+08:00",
  "redeemedAt": "2026-06-20T11:05:00+08:00",
  "result": "SUCCESS"
}
```

### 5.4 merchantStaff

```json
{
  "id": "staff_002",
  "merchantId": "merchant_001",
  "name": "小李",
  "role": "merchant_staff",
  "phone": "138****1002",
  "status": "ACTIVE"
}
```

---

## 6. 真实 API 范围

基础路径：`/api/v1/merchant`

所有请求必须携带：

1. `Authorization: Bearer <token>`
2. 服务端解析 `merchantId`（来自 token，不信任前端 query 单独传参）
3. 写操作携带 `actorId` / `staffId`

### 6.1 读接口

| 方法 | 路径 | Scope | 说明 |
|------|------|-------|------|
| GET | /dashboard | merchant.dashboard.read | 工作台 KPI |
| GET | /coupons | merchant.coupon.read | 卡券列表 |
| GET | /coupons/:couponId | merchant.coupon.read | 卡券详情 + 最近核销 |
| GET | /redemptions | merchant.redemption.read / read.self | 核销记录列表 |
| GET | /redemptions/:claimId | merchant.redemption.read / read.self | 单条详情 |
| GET | /scan/context | merchant.redemption.write | 待核销数、示例码提示 |
| GET | /staff/me | merchant.redemption.write | 当前员工信息 |
| GET | /help | * | 帮助 FAQ |

### 6.2 写接口

| 方法 | 路径 | Scope | 说明 |
|------|------|-------|------|
| POST | /redemptions/verify | merchant.redemption.write | 仅校验，不写入 |
| POST | /redemptions/redeem | merchant.redemption.write | 执行核销 |

**建议：** verify 与 redeem 分离，便于扫码预览；redeem 必须幂等。

### 6.3 请求 / 响应示例

**POST /redemptions/verify**

```json
{
  "claimCode": "LQG-CAFE-1001"
}
```

**成功响应**

```json
{
  "ok": true,
  "status": "UNUSED",
  "statusLabel": "待核销",
  "message": "礼遇可核销",
  "claim": { },
  "coupon": { },
  "merchant": { }
}
```

**POST /redemptions/redeem**

```json
{
  "claimCode": "LQG-CAFE-1001",
  "idempotencyKey": "redeem_20260620_001"
}
```

**成功响应**

```json
{
  "ok": true,
  "status": "SUCCESS",
  "statusLabel": "核销成功",
  "message": "咖啡到店礼已核销",
  "claim": { },
  "redeemedAt": "2026-06-20T11:05:00+08:00",
  "staffName": "小李"
}
```

---

## 7. 核销码校验规则

服务端必须按序校验：

| 序号 | 规则 | 失败码 |
|------|------|--------|
| 1 | token 有效 | TOKEN_EXPIRED / AUTH_REQUIRED |
| 2 | scope 含 merchant.redemption.write | SCOPE_DENIED |
| 3 | staff 属于当前 merchantId | FORBIDDEN |
| 4 | claimCode 存在 | INVALID |
| 5 | claim.merchantId === token.merchantId | MERCHANT_MISMATCH |
| 6 | claimStatus === UNUSED | ALREADY_USED / EXPIRED / INVALID |
| 7 | expireAt 未过期 | EXPIRED |
| 8 | coupon.status === ACTIVE | COUPON_INACTIVE |
| 9 | activity 在有效期内 | ACTIVITY_INACTIVE |
| 10 | redeem 时检查 idempotencyKey 防重复提交 | DUPLICATE_REQUEST |

与 Phase 2 mock `verifyCouponClaim` 行为对齐，真实环境增加幂等与并发锁。

---

## 8. 核销成功写入规则

事务内必须完成：

1. `couponClaims.claimStatus` → `USED`
2. `couponClaims.redeemedAt` → 服务端时间
3. `couponClaims.redeemedByStaffId` → 当前 staffId
4. `couponClaims.redeemedByMerchantId` → 当前 merchantId
5. `coupons.redeemedCount` +1
6. 重算 `coupons.redemptionRate`
7. 写入 `redemptionRecords`（若独立表）
8. 写入 `operationLogs`（action: `REDEMPTION_VERIFY`）
9. 触发用户侧权益状态可读（见第 9 节）

**禁止**仅更新商家侧而不同步用户 claim 状态。

---

## 9. 用户权益状态同步规则

用户端通过 `user-app-adapter.getRightsCenter` 读取 claim 状态。

真实 API 模式下：

1. 商家核销成功后，用户 claim 在服务端已为 `USED`
2. 用户端 `GET /user/rights` 或 `GET /user/coupon-claims/:claimId` 返回已核销
3. 不要求用户端轮询；商家核销与用户权益为同一数据源
4. `status-map.js` redemption 域继续负责中文：`USED` → 已核销

同步验收路径（与 Phase 2 一致）：

用户领取 → 权益中心待核销 → 商家 redeem → 用户权益中心已核销

---

## 10. Dashboard / 统计更新规则

`GET /merchant/dashboard` 返回字段与 mock `getMerchantDashboard` 对齐：

| 指标 | 计算 |
|------|------|
| todayClaimed | 今日 claimedAt 计数 |
| todayRedeemed | 今日 redeemedAt 计数 |
| pendingRedeem | claimStatus=UNUSED 且未过期 |
| totalRedeemed | 累计 USED |
| redemptionRate | totalRedeemed / totalClaimed |
| recentRedemptions | 最近 N 条 USED 记录 |

`merchant_admin` 看全店；`merchant_staff` 不看 dashboard（或仅本人今日核销数，按产品确认）。

卡券详情 `GET /coupons/:couponId` 的 `recentRedemptions` 与 `redeemedCount` 必须与核销写入同一事务可见。

---

## 11. 核销员记录范围

| 角色 | GET /redemptions 过滤 |
|------|----------------------|
| merchant_admin | merchantId 全店 |
| merchant_staff | merchantId + redeemedByStaffId = 当前 staffId |

与 Phase 2 `getMerchantRedemptions(filters)` 的 `roleKey` + `staffId` 行为一致。

---

## 12. 审计日志要求

每次 verify（可选）与 redeem（必须）写入 operationLog：

```json
{
  "actorId": "staff_002",
  "actorRole": "merchant_staff",
  "merchantId": "merchant_001",
  "action": "REDEMPTION_VERIFY",
  "targetType": "coupon_claim",
  "targetId": "claim_001",
  "beforeStatus": "UNUSED",
  "afterStatus": "USED",
  "summary": "核销成功：LQG-CAFE-1001",
  "clientInfo": { },
  "createdAt": "2026-06-20T11:05:00+08:00"
}
```

失败尝试建议记录 `REDEMPTION_VERIFY_FAILED`（含 reason code，不记录完整 claimCode 到公开日志）。

---

## 13. 错误码与中文提示

| 错误码 | HTTP | 中文提示 | mock 对齐 |
|--------|------|----------|-----------|
| AUTH_REQUIRED | 401 | 请先登录 | — |
| TOKEN_EXPIRED | 401 | 登录已过期，请重新登录 | — |
| FORBIDDEN | 403 | 无权执行此操作 | — |
| SCOPE_DENIED | 403 | 当前角色不可核销 | — |
| INVALID | 400 | 无效核销码，请核对后重试 | INVALID |
| MERCHANT_MISMATCH | 403 | 该卡券不属于当前商家，不可核销 | MERCHANT_MISMATCH |
| ALREADY_USED | 409 | 该卡券已核销，不可重复核销 | ALREADY_USED |
| EXPIRED | 410 | 该卡券已过期，不可核销 | EXPIRED |
| COUPON_INACTIVE | 400 | 卡券已停用 | — |
| ACTIVITY_INACTIVE | 400 | 活动未在有效期内 | — |
| DUPLICATE_REQUEST | 409 | 请勿重复提交 | — |
| SUCCESS | 200 | 核销成功 | SUCCESS |

前端通过 `merchant-admin-adapter` 统一返回 `{ ok, status, statusLabel, message }`，页面不改结构，仅数据源切换。

---

## 14. merchant-admin-adapter 替换边界

### 14.1 保持不变的页面调用

页面继续调用：

- `getMerchantDashboard(merchantId)`
- `getMerchantCoupons(merchantId)`
- `getMerchantCouponDetail(couponId)`
- `getMerchantRedemptions(merchantId, filters)`
- `getMerchantRedemptionDetail(claimId)`
- `getMerchantScanContext(merchantId, staffId)`
- `verifyCouponClaim(claimCode, merchantId, staffId)`

### 14.2 api mode 下 adapter 行为

当 `LoveqiguDataAdapter.mode === "api"`：

1. 上述方法改为 `fetch` 对应 REST 路径
2. 自动附加 `Authorization` header（来自 auth-context，规划层）
3. 响应映射为与 mock 相同的返回结构
4. 错误映射为 `ok: false` + `statusLabel` + `message`
5. **不再**写入 adapter-session 的 couponClaims（服务端为权威源）
6. 读操作可短时缓存；写操作不缓存

### 14.3 mock mode 保留

`mode === "mock"` 时保持 Phase 2 行为 + ADAPTER_SESSION_PERSISTENCE_V1 持久化，用于演示与回归。

### 14.4 user-app-adapter 联动

用户权益读取在 api mode 下调用 `GET /user/rights`；与商家核销共享服务端 couponClaims，不通过 adapter-session 桥接。

---

## 15. 真实接口实施顺序

建议分 4 步落地（规划，本轮不实施）：

### Step 1：只读接口

1. GET /merchant/dashboard
2. GET /merchant/coupons
3. GET /merchant/coupons/:couponId
4. GET /merchant/redemptions
5. GET /merchant/redemptions/:claimId

验证：页面展示与 mock 一致，token + scope 生效。

### Step 2：verify 接口

1. POST /merchant/redemptions/verify
2. merchant_scan 页先接 verify 预览

验证：错误码与中文提示全覆盖。

### Step 3：redeem 接口

1. POST /merchant/redemptions/redeem
2. 幂等 + 事务写入 + 审计日志

验证：用户权益同步、Dashboard 更新、防重复核销。

### Step 4：用户端 rights 只读

1. GET /user/rights
2. GET /user/coupon-claims/:claimId

验证：端到端闭环与 Phase 2 人工路径一致。

---

## 16. 禁止事项

1. 不修改商家后台页面视觉与结构
2. 不接真实后端（本轮仅文档）
3. 不改 Runtime 数据结构
4. 不破坏 Phase 2 mock 核销流程
5. 不让页面直接 fetch API
6. 不把核销结果只存商家侧不同步用户 claim

**验收：** `NO_MERCHANT_REDEMPTION_LOGIC_CHANGE = CONFIRMED`

---

## 17. 风险点

1. 并发核销同一 claimCode 需数据库行锁或乐观锁
2. verify / redeem 双步之间状态可能被其他终端改变
3. 过期判断以服务端时间为准
4. 平台代管商家视图需额外 impersonation 审计
5. mock 与 api 双 mode 回归成本

---

## 18. 下一步建议

完成本规划后，建议进入：

**REAL_PARK_ACTIVITY_REVIEW_API_V1**

或按 Phase 3 顺序先实施 Step 1 只读商家 API（需单独实施任务，非本轮）。

---

## 19. 验收标记

```
REAL_MERCHANT_REDEMPTION_API_V1_CREATED = YES
REAL_MERCHANT_REDEMPTION_API_SCOPE_DEFINED = YES
REAL_MERCHANT_REDEMPTION_PERMISSION_BOUNDARY_DEFINED = YES
REAL_MERCHANT_REDEMPTION_DATA_OBJECTS_DEFINED = YES
REAL_MERCHANT_REDEMPTION_VERIFY_RULES_DEFINED = YES
REAL_MERCHANT_REDEMPTION_WRITE_RULES_DEFINED = YES
REAL_MERCHANT_REDEMPTION_IDEMPOTENCY_DEFINED = YES
REAL_MERCHANT_USER_RIGHTS_SYNC_DEFINED = YES
REAL_MERCHANT_DASHBOARD_SYNC_DEFINED = YES
REAL_MERCHANT_REDEMPTION_AUDIT_LOG_DEFINED = YES
REAL_MERCHANT_REDEMPTION_ERROR_CODES_DEFINED = YES
REAL_MERCHANT_ADAPTER_REPLACEMENT_BOUNDARY_DEFINED = YES
REAL_MERCHANT_REDEMPTION_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_MERCHANT_REDEMPTION_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_MERCHANT_REDEMPTION_API_PLAN_READY = YES
READY_FOR_REAL_PARK_ACTIVITY_REVIEW_API_V1 = YES
```
