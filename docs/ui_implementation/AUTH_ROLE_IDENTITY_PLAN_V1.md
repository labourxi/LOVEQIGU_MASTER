# AUTH_ROLE_IDENTITY_PLAN_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的真实登录、角色身份、token、服务端权限校验、平台代管身份与权限边界。

Phase 2 已完成 `ROLE_BASED_ADMIN_NAVIGATION_V1`，实现了基于 `role-map.js` 的前端菜单、顶栏、入口、后台切换和代管视图显示。

但是 Phase 2 的角色控制仍属于前端可见性控制，不是正式安全权限系统。

Phase 3 需要在不破坏 Phase 1 页面结构、不破坏 Phase 2 adapter 层、不绕过 role-map 的前提下，规划真实身份体系与服务端权限体系。

---

## 2. 本轮目标

本轮目标：

1. 定义真实身份对象
2. 定义登录态结构
3. 定义 token / session 方案
4. 定义用户端 / 商家端 / 园区端 / 平台端角色模型
5. 定义平台代管身份
6. 定义服务端权限校验原则
7. 定义前端 role-map 与后端 permission 的关系
8. 定义各角色 API 访问边界
9. 定义审计日志要求
10. 定义后续真实登录接口规划

---

## 3. 当前基础

已完成基础：

1. ROLE_BASED_ADMIN_NAVIGATION_V1
2. ADAPTER_SESSION_PERSISTENCE_V1
3. DATA_ADAPTER_LAYER_V1
4. MERCHANT_REDEMPTION_DATA_FLOW_V1
5. PARK_ACTIVITY_REVIEW_FLOW_V1
6. PLATFORM_REVIEW_PUBLISH_FLOW_V1
7. USER_EXPLORATION_RUNTIME_FLOW_V1

当前已有：

1. role-map.js
2. adapter-session.js
3. user-app-adapter.js
4. merchant-admin-adapter.js
5. park-admin-adapter.js
6. platform-admin-adapter.js
7. content-production-adapter.js

---

## 4. 核心原则

Phase 3 Auth / Role / Identity 必须遵守：

1. 前端权限只控制显示
2. 后端权限控制访问
3. 所有写操作必须携带 actorId
4. 所有关键操作必须写 operationLog
5. 商家不得访问其他商家数据
6. 园区不得访问其他园区数据
7. 商家核销员不得访问商家管理员功能
8. 用户端不得访问后台接口
9. 平台代管行为必须记录代管上下文
10. token 过期必须有明确处理
11. 未登录状态必须有降级路径
12. 接口失败必须有错误码和错误提示
13. 不允许页面绕过 adapter 直接处理权限
14. 不允许仅依靠前端隐藏保护数据

---

## 5. 角色定义

真实角色至少包括：

### 5.1 visitor

未登录游客。

可访问：

1. 用户端公开首页
2. 景区 / 活动公开信息
3. 部分探索入口预览

不可访问：

1. 我的信物
2. 权益中心
3. 卡券领取
4. 商家后台
5. 园区后台
6. 平台后台

### 5.2 user

普通用户。

可访问：

1. 用户端首页
2. 探索地图
3. 探索点详情
4. AR 显现流程
5. 信物库
6. 权益中心
7. 我的页面
8. 星图 / 经络图

不可访问：

1. 商家后台
2. 园区后台
3. 平台后台
4. 内容生产后台

### 5.3 merchant_admin

商家管理员。

可访问：

1. 商家工作台
2. 卡券管理
3. 核销记录
4. 财务数据
5. 工单
6. 帮助文档
7. 账号管理

不可访问：

1. 园区后台
2. 平台后台
3. 其他商家数据
4. 内容生产线全局管理

### 5.4 merchant_staff

商家核销员。

可访问：

1. 核销页面
2. 本人核销记录
3. 基础帮助文档

不可访问：

1. 财务数据
2. 卡券配置
3. 商家管理员账号管理
4. 园区后台
5. 平台后台
6. 其他员工核销记录

### 5.5 park_admin

园区负责人。

可访问：

1. 园区数据总览
2. 园区商家数据看板
3. 园区活动数据看板
4. 活动创建 / 草稿 / 发布检查
5. 园区工单
6. 平台审查结论回读

不可访问：

1. 平台审查中心
2. 平台发布中心
3. 其他园区数据
4. 商家私有财务细节
5. 平台内容生产全局管理

### 5.6 platform_admin

平台管理员 / 平台超管。

可访问：

1. 平台总览
2. 审查中心
3. 发布中心
4. 景区管理
5. 活动管理
6. 卡券分析
7. 工单
8. 内容生产线
9. 系统设置
10. 平台代管视图

可代管：

1. 园区后台
2. 商家后台

必须记录：

1. 被代管对象
2. 代管入口
3. 操作人
4. 操作时间
5. 操作动作
6. 操作结果

---

## 6. 真实身份对象设计

真实身份对象建议为：

```json
{
  "userId": "u_001",
  "role": "merchant_admin",
  "phone": "13800000000",
  "nickname": "商家管理员",
  "avatar": "",
  "merchantId": "merchant_001",
  "parkId": "park_001",
  "allowedPortals": ["merchant_admin"],
  "permissionScopes": [
    "merchant.dashboard.read",
    "merchant.coupon.read",
    "merchant.redemption.write"
  ],
  "token": "ACCESS_TOKEN_PLACEHOLDER",
  "refreshToken": "REFRESH_TOKEN_PLACEHOLDER",
  "tokenExpireAt": "2026-01-01T00:00:00.000Z",
  "impersonationContext": null,
  "loginAt": "2026-01-01T00:00:00.000Z",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### 6.1 字段说明

| 字段 | 说明 |
|------|------|
| userId | 全局用户唯一标识 |
| role | 当前主角色：visitor / user / merchant_admin / merchant_staff / park_admin / platform_admin |
| phone | 登录手机号（脱敏展示） |
| nickname | 展示昵称 |
| avatar | 头像 URL |
| merchantId | 商家角色绑定商家 ID；非商家角色可为空 |
| parkId | 园区角色绑定园区 ID；用户当前景区上下文 |
| allowedPortals | 可进入门户列表，与 role-map 对齐 |
| permissionScopes | 服务端权限粒度列表 |
| token | 短期 access token |
| refreshToken | 长期 refresh token（仅安全存储） |
| tokenExpireAt | access token 过期时间 |
| impersonationContext | 平台代管上下文，非代管时为 null |
| loginAt | 本次登录时间 |
| createdAt / updatedAt | 身份记录时间 |

### 6.2 平台代管上下文

```json
{
  "impersonationContext": {
    "asPlatform": true,
    "operatorId": "platform_ops_001",
    "operatorRole": "platform_admin",
    "targetPortal": "park_admin",
    "targetParkId": "park_001",
    "targetMerchantId": null,
    "entryUrl": "/park-admin/dashboard?asPlatform=1&parkId=park_001",
    "startedAt": "2026-06-20T10:00:00+08:00"
  }
}
```

代管期间：

1. 前端仍按 role-map 显示代管视图标记
2. 后端接口必须校验 `operatorId` 具备代管权限
3. 写操作日志必须同时记录 operator 与 target 对象

---

## 7. 登录态结构

### 7.1 客户端登录态（建议）

与现有 adapter 层分离，建议新增 `auth-context`（规划层，本轮不实现）：

```json
{
  "status": "AUTHENTICATED",
  "identity": { },
  "sessionId": "sess_xxx",
  "expiresAt": "2026-06-20T12:00:00+08:00",
  "portal": "merchant_admin",
  "mock": false
}
```

状态枚举：

| 状态 | 说明 |
|------|------|
| UNLOGGED | 未登录（visitor） |
| AUTHENTICATED | 已登录 |
| TOKEN_EXPIRED | token 过期，需刷新或重新登录 |
| REFRESHING | 正在刷新 token |
| FORBIDDEN | 已登录但无权访问当前门户 |

### 7.2 与 adapter-session 的关系

| 层 | 职责 |
|----|------|
| auth-context | 身份、token、角色、代管上下文 |
| adapter-session | 业务 mock / 演示数据状态 |
| role-map | 前端菜单与入口可见性 |

**禁止**将 token 写入 adapter-session 持久化集合。

---

## 8. Token / Session 方案

### 8.1 推荐方案

1. **Access Token**：JWT 或 opaque token，短有效期（如 2h）
2. **Refresh Token**：长有效期（如 7d），仅 httpOnly cookie 或安全存储
3. **Session ID**：服务端会话追踪（可选）

### 8.2 请求携带方式

| 端 | 方式 |
|----|------|
| 用户小程序 | `Authorization: Bearer <token>` |
| 商家 / 园区 / 平台 Web | `Authorization: Bearer <token>` + 必要时 `X-Portal` header |
| 代管请求 | 额外 `X-Impersonation-Context` 或 body 内 impersonationContext |

### 8.3 Token 过期处理

1. 401 + `TOKEN_EXPIRED` → adapter 尝试 refresh
2. refresh 失败 → 清除本地 auth，跳转登录 / 显示 Mock 降级
3. 403 + `FORBIDDEN` → 显示无权限，不静默失败
4. 页面不得无限重试

### 8.4 未登录降级

| 场景 | 降级 |
|------|------|
| 用户端首页 | 公开内容 + Mock 登录入口（Phase 2 已有） |
| 探索闭环 | 提示登录后继续 |
| 后台页 | 跳转 login 占位页 |

---

## 9. 前端 role-map 与后端 Permission 关系

```
role-map.js          → 控制菜单 / 顶栏 / 门户入口（显示层）
permissionScopes     → 控制 API 是否允许（访问层）
adapter              → 统一携带 token + actorId 调接口
服务端                → 二次校验 role + scope + 资源归属
```

映射原则：

1. `role-map.visibleMenus` 是 UI 子集，不等于 permissionScopes
2. 每个 adapter 写方法必须传 `actor: { actorId, actorRole, actorName }`
3. 真实 API 模式下 adapter 从 auth-context 读取 token，不由页面拼装
4. role-map 新增字段时，必须同步规划对应 permission scope

### 9.1 role-map 现有角色对照

| role-map key | 真实 role | allowedPortals |
|--------------|-----------|----------------|
| visitor | visitor | user_app |
| （用户登录后） | user | user_app |
| merchant_admin | merchant_admin | merchant_admin |
| merchant_staff | merchant_staff | merchant_admin |
| park_admin | park_admin | park_admin |
| platform_admin | platform_admin | platform_admin, park_admin_as_platform, merchant_admin_as_platform |

---

## 10. Permission Scope 设计

建议命名：`{portal}.{resource}.{action}`

### 10.1 用户端

| Scope | 说明 |
|-------|------|
| user.home.read | 首页 |
| user.explore.read | 探索地图 / 探索点 |
| user.explore.write | 打卡 / AR / 信物 / 礼遇 |
| user.relic.read | 信物库 |
| user.rights.read | 权益中心 |
| user.profile.read | 我的 |

### 10.2 商家端

| Scope | 说明 |
|-------|------|
| merchant.dashboard.read | 工作台 |
| merchant.coupon.read | 卡券列表 |
| merchant.coupon.write | 卡券配置（admin only） |
| merchant.redemption.read | 核销记录 |
| merchant.redemption.write | 核销操作 |
| merchant.redemption.read.self | 核销员仅本人记录 |
| merchant.finance.read | 财务（admin only） |
| merchant.account.read | 账号管理（admin only） |

### 10.3 园区端

| Scope | 说明 |
|-------|------|
| park.dashboard.read | 园区总览 |
| park.activity.read | 活动列表 |
| park.activity.write | 草稿 / 提交审查 |
| park.merchant.read | 园区商家看板 |
| park.operation_log.read | 操作日志 |

### 10.4 平台端

| Scope | 说明 |
|-------|------|
| platform.dashboard.read | 平台总览 |
| platform.review.read / write | 审查中心 |
| platform.publish.read / write | 发布中心 |
| platform.content.read / write | 内容生产 |
| platform.impersonate.park | 代管园区 |
| platform.impersonate.merchant | 代管商家 |

---

## 11. 各角色 API 访问边界

### 11.1 用户端 API 前缀

`/user/*` — 仅 `user` / 部分 `visitor` 只读

### 11.2 商家端 API 前缀

`/merchant/*` — 必须校验 `merchantId` 与 token 归属

| 角色 | 边界 |
|------|------|
| merchant_admin | 本店全部 merchant API |
| merchant_staff | 仅 redemption.write + redemption.read.self |

### 11.3 园区端 API 前缀

`/park/*` — 必须校验 `parkId`

### 11.4 平台端 API 前缀

`/platform/*` — 仅 platform_admin

代管请求：

- `/park/*?asPlatform=1` 需 `platform.impersonate.park`
- 商家代管同理

### 11.5 禁止交叉访问

| 来源 | 禁止 |
|------|------|
| user | /merchant/*, /park/*, /platform/* |
| merchant_* | 其他 merchantId、/park/*、/platform/* |
| park_admin | 其他 parkId、/platform/* |
| merchant_staff | finance、coupon 配置、account |

---

## 12. 审计日志要求

关键操作必须写 operationLog（真实后端持久化）：

| 类别 | 操作 |
|------|------|
| 登录 | LOGIN, LOGOUT, TOKEN_REFRESH, LOGIN_FAILED |
| 代管 | IMPERSONATE_START, IMPERSONATE_END |
| 用户探索 | CHECK_IN, RELIC_REVEAL, COUPON_CLAIM |
| 商家核销 | REDEMPTION_VERIFY |
| 园区 | SUBMIT_PUBLISH_CHECK, SAVE_DRAFT |
| 平台 | REVIEW_DECISION, PUBLISH_START, PUBLISH_SUCCESS, PUBLISH_FAILED |
| 内容生产 | SUBMIT_REVIEW, GENERATE_* |

每条日志至少包含：

1. actorId / actorRole
2. targetType / targetId
3. action
4. beforeStatus / afterStatus
5. impersonationContext（如有）
6. clientInfo（IP / UA 占位）
7. createdAt

---

## 13. 后续真实登录接口规划

### 13.1 通用认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/login | 手机号 + 验证码 / 微信 code |
| POST | /auth/refresh | 刷新 token |
| POST | /auth/logout | 注销 |
| GET | /auth/me | 当前身份 |

### 13.2 分端登录入口（可同接口不同 portal 参数）

| Portal | login portal 参数 |
|--------|-------------------|
| user_app | `portal=user_app` |
| merchant_admin | `portal=merchant_admin` + merchantId |
| merchant_staff | `portal=merchant_staff` + merchantId + staffId |
| park_admin | `portal=park_admin` + parkId |
| platform_admin | `portal=platform_admin` |

### 13.3 代管

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/impersonate/park | 开始代管园区 |
| POST | /auth/impersonate/merchant | 开始代管商家 |
| POST | /auth/impersonate/end | 结束代管 |

### 13.4 Adapter 接入方式（规划）

1. 新增 `auth-adapter.js`（规划），不修改现有 role-map 执行逻辑
2. `LoveqiguDataAdapter.auth.getIdentity()` 供各 adapter 读 actor
3. api mode 下 adapter 自动附加 Authorization header
4. mock mode 仍用 Phase 2 actor 占位

---

## 14. 错误码规划

| 代码 | HTTP | 说明 |
|------|------|------|
| AUTH_REQUIRED | 401 | 未登录 |
| TOKEN_EXPIRED | 401 | token 过期 |
| TOKEN_INVALID | 401 | token 无效 |
| FORBIDDEN | 403 | 无权限 |
| MERCHANT_MISMATCH | 403 | 非本商家 |
| PARK_MISMATCH | 403 | 非本园区 |
| IMPERSONATION_REQUIRED | 403 | 代管上下文缺失 |
| SCOPE_DENIED | 403 | scope 不足 |

前端通过 adapter 统一映射为中文提示，不暴露内部细节。

---

## 15. 禁止事项

1. 不修改页面代码
2. 不接真实登录接口
3. 不改 Runtime 数据结构
4. 不改现有 role-map 执行逻辑
5. 不让页面直接处理 token
6. 不把 token 存入 adapter-session
7. 不把前端隐藏当作安全边界

**验收：** `NO_AUTH_LOGIC_CHANGE = CONFIRMED`

---

## 16. 风险点

1. 微信小程序登录与 Web 后台登录需统一 identity 模型
2. 代管场景下 actorId 与 operatorId 易混淆
3. merchant_staff 范围需在 API 与 UI 双层一致
4. Phase 2 mock actor 占位与真实 token 切换需清晰 mode 边界
5. refresh token 存储安全需专项设计

---

## 17. 下一步建议

Phase 3 规划完成后，建议进入：

**REAL_MERCHANT_REDEMPTION_API_V1**

原因：

1. 商家核销边界清晰（merchantId + staffId）
2. Phase 2 mock 闭环已验证
3. 可率先验证 token + scope + 审计日志
4. 不涉及 AR / 内容生产复杂异步

---

## 18. 验收标记

```
AUTH_ROLE_IDENTITY_PLAN_V1_CREATED = YES
AUTH_IDENTITY_OBJECT_DEFINED = YES
AUTH_LOGIN_STATE_DEFINED = YES
AUTH_TOKEN_SESSION_PLAN_DEFINED = YES
AUTH_ROLE_MODEL_DEFINED = YES
AUTH_IMPERSONATION_CONTEXT_DEFINED = YES
AUTH_SERVER_PERMISSION_PRINCIPLES_DEFINED = YES
AUTH_ROLEMAP_PERMISSION_MAPPING_DEFINED = YES
AUTH_API_BOUNDARY_DEFINED = YES
AUTH_AUDIT_LOG_REQUIREMENTS_DEFINED = YES
AUTH_LOGIN_API_PLAN_DEFINED = YES
NO_AUTH_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
AUTH_ROLE_IDENTITY_PLAN_V1_READY = YES
READY_FOR_REAL_MERCHANT_REDEMPTION_API_V1 = YES
```
