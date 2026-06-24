# REAL_AR_DEVICE_INTEGRATION_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 3 的真实 AR 设备能力接入方案。

Phase 2 已完成 `USER_EXPLORATION_RUNTIME_FLOW_V1`，实现了 Mock AR 显现占位、信物显现、礼遇解锁、用户进度同步的 mock 数据闭环。

Phase 3 已完成 `REAL_USER_EXPLORATION_API_V1`，明确了用户端 AR 扫描开始 / 完成接口、AR scan session、fallback、信物显现前置条件和用户端状态流转。

Phase 3 已完成 `REAL_CONTENT_PRODUCTION_API_V1`，明确了 AR 内容必须绑定探索点和信物显现节点，且 AR 内容不是独立炫技素材库。

本文件用于将 AR 从 mock 占位流程推进到真实设备能力接入规划阶段，为后续真实 AR SDK、摄像头、定位、扫码凭证、fallback 和真机验收提供标准。

本轮只做规划，不直接接真实 AR SDK，不修改页面代码。

---

## 2. 本轮目标

本轮目标：

1. 定义真实 AR 接入范围
2. 定义 AR 与探索点 / 信物 / Runtime 内容的关系
3. 定义摄像头权限规划
4. 定义定位权限规划
5. 定义扫码 / QR credential 规划
6. 定义 AR scan credential 规划
7. 定义设备兼容性与 fallback 规则
8. 定义 AR scan session 状态流转
9. 定义 AR 成功 / 失败 / fallback 后如何影响信物显现
10. 定义 AR 错误码与前端中文提示
11. 定义 user-app-adapter 与 AR SDK 的替换边界
12. 定义真机验收路径
13. 定义后续真实 AR 实施顺序

---

## 3. 当前基础

已完成基础：

1. USER_EXPLORATION_RUNTIME_FLOW_V1
2. CONTENT_PRODUCTION_DATA_FLOW_V1
3. REAL_USER_EXPLORATION_API_V1
4. REAL_CONTENT_PRODUCTION_API_V1
5. REAL_PLATFORM_REVIEW_PUBLISH_API_V1
6. AUTH_ROLE_IDENTITY_PLAN_V1

当前已有相关文件：

1. apps/shared/data-adapter/user-app-adapter.js
2. apps/shared/data-adapter/content-production-adapter.js
3. apps/shared/data-adapter/platform-admin-adapter.js
4. apps/shared/data-adapter/status-map.js
5. apps/shared/data-adapter/mock-source.js
6. apps/shared/data-adapter/adapter-session.js

当前 mock 已验证：

1. 用户可进入 AR 显现占位页
2. 用户可 startARScan
3. 用户可 completeARScan
4. AR 完成后可 revealRelic
5. fallback 可作为后续低端设备方案
6. AR 内容与探索点 / 信物绑定关系已在内容生产规划中定义

---

## 4. 核心原则

真实 AR 接入必须遵守：

1. AR 不是抽卡
2. AR 不是独立炫技素材库
3. AR 不是奖励爆发动画
4. AR 必须绑定探索点
5. AR 必须绑定信物显现节点
6. AR 内容必须来自已发布 Runtime
7. 未发布 AR 内容不得进入用户端
8. 摄像头 / 定位权限必须用户授权
9. 低端设备必须有 fallback
10. AR 失败不能阻断主体验
11. AR 成功不能绕过打卡 / 探索点规则
12. 信物仍是故事进度资产，不是数字藏品
13. 页面不得直接调用真实 AR SDK，必须通过 adapter / ar runtime bridge
14. 真机验收必须单独执行

---

## 5. AR 与产品体验边界

AR 在本项目中的定位：

```
探索点现场感
→ 信物显现前的仪式感
→ 用户确认「看见 / 找回」
→ 推动故事进度
→ 解锁礼遇
```

不是：抽奖、开盲盒、SSR 爆闪、稀有奖励、游戏战斗、炫技滤镜、无意义特效素材库、数字藏品领取页。

AR 文案和视觉必须保持：东方、克制、古籍感、留白、显现、回响、找回、祝福确认。

---

## 6. 真实 AR 数据对象

### 6.1 arContents

AR 内容对象来自内容生产与平台发布。

```json
{
  "id": "ar_001",
  "title": "初见显现",
  "arType": "relic_reveal",
  "sourcePointId": "ep_001",
  "linkedRelicId": "relic_001",
  "assetUrl": "https://example.com/ar/ar_001.json",
  "assetType": "lottie_or_model_or_video_or_canvas",
  "fallbackAllowed": true,
  "fallbackType": "canvas_reveal",
  "requiredCapabilities": ["camera"],
  "status": "APPROVED",
  "publishStatus": "PUBLISHED",
  "runtimeStatus": "PUBLISHED"
}
```

### 6.2 arScanSessions

AR 扫描会话。

```json
{
  "id": "scan_001",
  "userId": "user_001",
  "activityId": "activity_001",
  "pointId": "ep_001",
  "arContentId": "ar_001",
  "status": "STARTED",
  "credentialType": "AR_SCAN",
  "credential": null,
  "fallbackUsed": false,
  "deviceCapability": {
    "camera": true,
    "location": true,
    "motion": false,
    "arSupported": true
  },
  "startedAt": "2026-06-20T10:10:00+08:00",
  "completedAt": null,
  "errorCode": null
}
```

### 6.3 arCredentials

AR 凭证对象。

```json
{
  "id": "ar_cred_001",
  "scanSessionId": "scan_001",
  "userId": "user_001",
  "pointId": "ep_001",
  "credentialType": "AR_SCAN_SUCCESS",
  "credentialHash": "HASH_PLACEHOLDER",
  "issuedAt": "2026-06-20T10:12:00+08:00",
  "expireAt": "2026-06-20T10:22:00+08:00",
  "used": false
}
```

说明：

1. credential 不应由前端随意伪造
2. 后续真实 AR SDK 接入时，由 SDK / 服务端共同生成可信凭证
3. 初期可使用 mock credential 过渡

---

## 7. 设备能力规划

### 7.1 摄像头权限

用途：AR 显现、扫码识别、探索点现场确认。

规则：

1. 用户首次进入 AR 页时请求摄像头权限
2. 用户拒绝后显示 fallback 入口
3. 不强制阻断主流程
4. 不在非 AR 页提前请求摄像头
5. 授权状态需可读

状态：CAMERA_UNKNOWN、CAMERA_GRANTED、CAMERA_DENIED、CAMERA_UNAVAILABLE。

### 7.2 定位权限

用途：探索点现场校验、防止远程伪造打卡、景区范围内体验优化。

规则：

1. 定位不是所有探索点必需
2. requiredCheckInType 决定是否强制定位
3. 用户拒绝定位时可切换 QR / fallback
4. 定位范围必须由服务端校验
5. 前端定位值不可作为唯一可信依据

状态：LOCATION_UNKNOWN、LOCATION_GRANTED、LOCATION_DENIED、LOCATION_UNAVAILABLE、LOCATION_OUT_OF_RANGE。

### 7.3 设备能力检测

建议检测：camera、location、motion、WebGL / Canvas、AR SDK 支持、低端机性能、网络状态。

返回字段：

```json
{
  "camera": true,
  "location": true,
  "motion": false,
  "webgl": true,
  "canvas": true,
  "arSupported": false,
  "fallbackRecommended": true,
  "network": "GOOD"
}
```

---

## 8. AR 状态流转规则

### 8.1 arScanSession 状态

1. NOT_STARTED
2. STARTED
3. CAMERA_REQUESTED
4. CAMERA_READY
5. SCANNING
6. RECOGNIZED
7. COMPLETED
8. FALLBACK_COMPLETED
9. FAILED
10. CANCELLED
11. TIMEOUT

### 8.2 用户点位状态联动

AR 成功后：

```
CHECKED_IN → AR_SCANNED → RELIC_REVEALED
```

fallback 成功后：

```
CHECKED_IN → AR_SCANNED_WITH_FALLBACK → RELIC_REVEALED
```

失败后：

```
CHECKED_IN → AR_FAILED → fallback 或重试
```

### 8.3 允许进入信物显现的条件

允许 revealRelic 的条件：

1. user 已登录
2. point 已打卡
3. arContent 已发布
4. arScanSession.status = COMPLETED 或 FALLBACK_COMPLETED
5. credential 未过期
6. relic 未重复显现

如果该探索点不要求 AR：

1. CHECKED_IN 后可直接 revealRelic
2. 但必须在 point 配置中明确 noArRequired = true

---

## 9. AR API 规划

真实 AR 接口仍归属用户端 API。基础路径：`/api/v1/user`

### 9.1 设备能力检测

**GET** `/user/device-capabilities`

权限：visitor 可读基础能力；user 可读完整能力。

返回：camera、location、webgl、canvas、arSupported、fallbackRecommended、recommendedMode。

### 9.2 开始 AR 扫描

**POST** `/user/exploration-points/:pointId/ar-scan/start`

权限：`user.explore.write`

请求：

```json
{
  "deviceCapability": {},
  "clientMode": "AR_OR_FALLBACK"
}
```

返回：

```json
{
  "ok": true,
  "scanSessionId": "scan_001",
  "arContent": {},
  "fallbackAllowed": true,
  "timeoutSeconds": 60,
  "message": "请将摄像头对准探索点，等待信物显现。"
}
```

### 9.3 上报 AR 识别中状态

**POST** `/user/ar-scan-sessions/:scanSessionId/progress`

权限：`user.explore.write`

请求：

```json
{
  "status": "SCANNING",
  "progress": 0.5,
  "deviceInfo": {}
}
```

说明：可选接口；主要用于日志和失败排查；不作为可信完成依据。

### 9.4 完成 AR 扫描

**POST** `/user/exploration-points/:pointId/ar-scan/complete`

权限：`user.explore.write`

请求：

```json
{
  "scanSessionId": "scan_001",
  "scanResult": "SUCCESS",
  "credential": "AR_CREDENTIAL_PLACEHOLDER",
  "deviceInfo": {}
}
```

成功响应：

```json
{
  "ok": true,
  "status": "AR_SCANNED",
  "statusLabel": "显现完成",
  "credentialAccepted": true,
  "nextAction": "REVEAL_RELIC",
  "message": "信物已回应，可以显现。"
}
```

### 9.5 fallback 完成

**POST** `/user/exploration-points/:pointId/ar-scan/fallback-complete`

权限：`user.explore.write`

请求：

```json
{
  "scanSessionId": "scan_001",
  "fallbackReason": "AR_NOT_SUPPORTED"
}
```

成功后：

1. arScanSession.status = FALLBACK_COMPLETED
2. userPointState.status = AR_SCANNED_WITH_FALLBACK
3. 允许 revealRelic
4. 写入 fallback 日志

---

## 10. 扫码 / QR Credential 规划

扫码可作为：探索点打卡凭证、AR 前置校验、低端设备 fallback 凭证。

QR credential 示例：

```json
{
  "credentialType": "QR_POINT_CHECKIN",
  "pointId": "ep_001",
  "activityId": "activity_001",
  "issuedAt": "2026-06-20T10:00:00+08:00",
  "expireAt": "2026-06-20T10:10:00+08:00",
  "signature": "SIGNATURE_PLACEHOLDER"
}
```

规则：

1. QR credential 必须服务端签名
2. QR credential 必须有有效期
3. QR credential 必须绑定 pointId / activityId
4. QR credential 不得长期复用
5. 截图重复使用需可被识别

---

## 11. fallback 规则

必须支持 fallback 的情况：

1. 摄像头不可用
2. 用户拒绝摄像头权限
3. 设备不支持 AR
4. AR SDK 初始化失败
5. 网络异常导致 AR 资源加载失败
6. 低端设备性能不足
7. 扫描超时

fallback 可采用：Canvas 显现动画、Lottie 显现动画、静态图 + 仪式文案、QR credential 确认、人工提示重试。

fallback 必须保持产品体验：

1. 仍然是「显现」
2. 不是「跳过」
3. 不是「失败后补偿奖励」
4. 不出现游戏化抽奖表达

---

## 12. AR 与信物显现关系

信物显现前置：

1. 探索点已打卡
2. AR 完成或 fallback 完成
3. relic 已发布
4. 用户未拥有该信物
5. point 与 relic 绑定正确

显现成功后：

1. userRelics 新增
2. userPointState 更新
3. userProgress 更新
4. 可继续 unlockCoupon
5. 星图 / 经络图进度可读更新

禁止：

1. 仅 AR 成功但不写 userRelics
2. 未 AR / fallback 直接显现信物
3. 重复显现同一信物
4. 将信物写成数字藏品领取

---

## 13. 错误码与中文提示

| errorCode | 中文提示 |
| --------- | -------- |
| CAMERA_DENIED | 请允许摄像头权限，或使用备用显现流程 |
| CAMERA_UNAVAILABLE | 当前设备无法使用摄像头 |
| LOCATION_DENIED | 请允许定位，或使用现场二维码完成验证 |
| LOCATION_OUT_OF_RANGE | 当前不在探索点范围内 |
| AR_NOT_SUPPORTED | 当前设备暂不支持 AR，可使用备用显现 |
| AR_RESOURCE_LOAD_FAILED | AR 资源加载失败，请稍后重试 |
| AR_SCAN_TIMEOUT | 显现超时，请重试或使用备用流程 |
| AR_CREDENTIAL_INVALID | 显现凭证无效，请重新扫描 |
| AR_SESSION_NOT_FOUND | 未找到 AR 会话 |
| AR_SESSION_EXPIRED | AR 会话已过期，请重新开始 |
| AR_ALREADY_COMPLETED | 该显现流程已完成 |
| FALLBACK_NOT_ALLOWED | 当前探索点不允许备用流程 |
| RELIC_REVEAL_BLOCKED | 暂不能显现该信物 |
| NETWORK_ERROR | 网络异常，请稍后重试 |

前端应通过 user-app-adapter / ar runtime bridge 统一映射中文，不在页面散落硬编码。

---

## 14. Adapter / AR Runtime Bridge 边界

建议后续新增：`apps/shared/data-adapter/ar-runtime-bridge.js`

职责：

1. detectDeviceCapabilities()
2. requestCameraPermission()
3. requestLocationPermission()
4. startARSession(arContent, options)
5. reportARProgress(scanSessionId, payload)
6. completeARSession(scanSessionId, payload)
7. completeFallback(scanSessionId, reason)
8. disposeARSession()
9. normalizeARError(error)

user-app-adapter 继续负责业务状态：

1. startARScan(pointId, userId)
2. completeARScan(scanSessionId, userId)
3. revealRelic(pointId, userId)

页面不得直接调用真实 AR SDK。

页面调用：

```
页面
→ user-app-adapter
→ ar-runtime-bridge
→ AR SDK / fallback
→ user-app-adapter
→ 服务端状态写入
```

---

## 15. 真机验收路径

真实 AR 必须单独进行真机验收。

### 15.1 设备范围

至少覆盖：

1. iPhone 主流机型
2. Android 主流机型
3. 微信小程序环境
4. 低端 Android 机
5. 摄像头权限拒绝场景
6. 定位权限拒绝场景
7. 网络弱场景

### 15.2 验收场景

必须验证：

1. 首次进入 AR 页请求摄像头权限
2. 拒绝摄像头后 fallback 可用
3. 授权摄像头后 AR 页面可启动
4. AR 资源加载失败可提示
5. AR 扫描成功可进入信物显现
6. AR 超时可重试或 fallback
7. fallback 后仍可显现信物
8. 重复完成 AR 不会重复显现信物
9. 商家核销链路不受 AR 失败影响
10. 未发布 AR 内容不会进入用户端

### 15.3 真机验收标记

建议后续真实实施时输出：

1. IOS_AR_CAMERA_PASS
2. ANDROID_AR_CAMERA_PASS
3. WECHAT_MINIPROGRAM_AR_PASS
4. LOW_END_DEVICE_FALLBACK_PASS
5. CAMERA_DENIED_FALLBACK_PASS
6. LOCATION_DENIED_QR_PASS
7. AR_TIMEOUT_RETRY_PASS
8. AR_TO_RELIC_REVEAL_PASS
9. AR_NO_DUPLICATE_RELIC_PASS
10. AR_RUNTIME_UNPUBLISHED_BLOCKED_PASS

---

## 16. 真实实施顺序建议

建议后续实施分 6 步：

### Step 1：设备能力检测与 fallback UI

1. detectDeviceCapabilities
2. 摄像头 / 定位授权状态
3. fallback 推荐

### Step 2：ar-runtime-bridge mock implementation

1. 不接真实 SDK
2. 先统一桥接方法
3. 保持页面调用不变

### Step 3：AR scan session API 联调

1. start
2. progress
3. complete
4. fallback-complete

### Step 4：真实 SDK 接入

1. 选择 AR SDK
2. 接摄像头
3. 接资源加载
4. 接扫描完成回调

### Step 5：定位 / QR credential 接入

1. 定位范围校验
2. QR credential 签名校验
3. 防截图重复使用

### Step 6：真机验收冻结

输出 REAL_AR_DEVICE_ACCEPTANCE_FREEZE_V1

---

## 17. 禁止事项

1. 不修改用户端页面视觉与结构
2. 不直接接真实 AR SDK，本轮仅文档
3. 不接真实定位
4. 不接真实摄像头
5. 不改 Runtime 数据结构
6. 不破坏 Phase 2 mock AR 流程
7. 不让页面直接调用 AR SDK
8. 不允许 AR 成为抽卡或奖励爆发动画
9. 不允许 AR 内容脱离探索点和信物
10. 不允许低端设备被完全阻断
11. 不允许信物变成数字藏品

验收：`NO_AR_DEVICE_LOGIC_CHANGE = CONFIRMED`

---

## 18. 风险点

1. 微信小程序 AR 能力受环境限制
2. 不同 Android 设备摄像头 / WebGL / 性能差异明显
3. 定位授权拒绝率可能较高
4. AR SDK 包体可能影响小程序体积
5. 真机表现可能不同于开发者工具
6. AR 资源加载失败会影响显现体验
7. fallback 体验如果设计不好，会被用户理解成失败
8. AR credential 如果只靠前端生成，存在伪造风险

---

## 19. 下一步建议

完成本规划后，建议进入：

**REAL_AR_RUNTIME_BRIDGE_PLAN_V1**

目标：

1. 先建立 ar-runtime-bridge.js 的 mock 桥接层
2. 不接真实 AR SDK
3. 统一页面、adapter、AR SDK、fallback 之间的边界
4. 为后续真实 SDK 接入提供可替换接口

---

## 20. 验收标记

```
REAL_AR_DEVICE_INTEGRATION_V1_CREATED = YES
REAL_AR_SCOPE_DEFINED = YES
REAL_AR_PRODUCT_BOUNDARY_DEFINED = YES
REAL_AR_DATA_OBJECTS_DEFINED = YES
REAL_AR_DEVICE_CAPABILITY_DEFINED = YES
REAL_AR_SCAN_SESSION_FLOW_DEFINED = YES
REAL_AR_API_ENDPOINTS_DEFINED = YES
REAL_AR_QR_CREDENTIAL_DEFINED = YES
REAL_AR_FALLBACK_RULES_DEFINED = YES
REAL_AR_RELIC_REVEAL_RELATION_DEFINED = YES
REAL_AR_ERROR_CODES_DEFINED = YES
REAL_AR_RUNTIME_BRIDGE_BOUNDARY_DEFINED = YES
REAL_AR_REAL_DEVICE_ACCEPTANCE_PATH_DEFINED = YES
REAL_AR_IMPLEMENTATION_SEQUENCE_DEFINED = YES
NO_AR_DEVICE_LOGIC_CHANGE = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
REAL_AR_DEVICE_INTEGRATION_PLAN_READY = YES
READY_FOR_REAL_AR_RUNTIME_BRIDGE_PLAN_V1 = YES
```
