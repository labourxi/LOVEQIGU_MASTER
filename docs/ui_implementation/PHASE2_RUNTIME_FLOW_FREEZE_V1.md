# PHASE2_RUNTIME_FLOW_FREEZE_V1

## 1. 文档定位

本文件用于冻结 LOVEQIGU / AR游伴 Phase 2 Mock Runtime 数据闭环成果。

Phase 1 已完成视觉落地与高保真页面验收。Phase 2 在不接真实后端、不改 Runtime 数据结构、不重做 UI 的前提下，完成了前端数据适配层、角色导航层、商家核销闭环、园区活动审核闭环、平台审查发布闭环、内容生产 / AR生产线闭环、用户探索体验闭环。

本文件作为后续真实 API、真实权限、真实 AR SDK、真实商家核销接口、真实 Runtime 发布系统接入前的基准文件。

---

## 2. 总体验收结论

验收结论：

PHASE2_RUNTIME_FLOW_FREEZE_V1 = PASS

当前版本达到：

1. Phase 2 Mock Runtime 数据闭环验收标准
2. 前端数据适配层验收标准
3. 角色导航与权限显示验收标准
4. 商家核销 mock 数据流验收标准
5. 园区活动发布检查 mock 数据流验收标准
6. 平台审查 / 发布 mock 数据流验收标准
7. 内容生产 / AR生产线 mock 数据流验收标准
8. 用户端探索体验 mock Runtime 验收标准

---

## 3. 已完成闭环总览

Phase 2 已完成以下七个闭环：

1. DATA_ADAPTER_LAYER_V1
2. ROLE_BASED_ADMIN_NAVIGATION_V1
3. MERCHANT_REDEMPTION_DATA_FLOW_V1
4. PARK_ACTIVITY_REVIEW_FLOW_V1
5. PLATFORM_REVIEW_PUBLISH_FLOW_V1
6. CONTENT_PRODUCTION_DATA_FLOW_V1
7. USER_EXPLORATION_RUNTIME_FLOW_V1

整体链路已经形成：

内容生产
→ 平台审查
→ Mock Runtime 发布
→ 用户探索
→ 信物显现
→ 礼遇领取
→ 商家核销
→ 用户进度回写

---

## 4. DATA_ADAPTER_LAYER_V1 冻结结论

状态：

DATA_ADAPTER_LAYER_V1 = PASS

完成内容：

1. 建立 apps/shared/data-adapter/ 统一数据适配层
2. 建立 mock-source.js
3. 建立 adapter-session.js
4. 建立 status-map.js
5. 建立 role-map.js
6. 建立 user-app-adapter.js
7. 建立 merchant-admin-adapter.js
8. 建立 park-admin-adapter.js
9. 建立 platform-admin-adapter.js
10. 建立 content-production-adapter.js
11. 建立 search-adapter.js

冻结意义：

页面从“直接写死 mock 数据”进入“页面 → adapter → mock source / future API source”的结构。

当前边界：

1. 仍为 mock 数据
2. 不接真实 API
3. 不改 Runtime 数据
4. 刷新后 session 数据可能重置

---

## 5. ROLE_BASED_ADMIN_NAVIGATION_V1 冻结结论

状态：

ROLE_BASED_ADMIN_NAVIGATION_V1 = PASS

完成内容：

1. 商家后台菜单按角色显示
2. 商家核销员菜单最小化
3. 园区后台菜单按角色显示
4. 平台后台菜单按角色显示
5. 顶部按钮按角色显示
6. 更多后台按角色显示
7. 页面访问拦截占位
8. 平台代管园区 / 商家视图标记

冻结意义：

后台不再只是视觉上区分角色，而是开始由 role-map.js 配置驱动导航、顶栏、入口和代管视图。

当前边界：

1. 这不是正式安全权限系统
2. 前端隐藏不能替代后端权限校验
3. 后续真实接口必须做服务端权限校验

---

## 6. MERCHANT_REDEMPTION_DATA_FLOW_V1 冻结结论

状态：

MERCHANT_REDEMPTION_DATA_FLOW_V1 = PASS

完成内容：

1. 商家卡券 mock 数据
2. 用户领取记录 couponClaims
3. 核销码校验
4. 核销成功 / 失败状态流转
5. 防重复核销
6. 非本商家卡券不可核销
7. 核销记录更新
8. 卡券核销数量 / 核销率更新
9. 商家 Dashboard 更新
10. 核销员只能查看本人记录
11. 商家管理员可查看全部门店核销记录

冻结意义：

商家后台从“页面展示”进入“可模拟业务数据流转”。

当前边界：

1. 核销是 mock 内存态
2. 不接真实扫码设备
3. 不接真实核销接口
4. 不接真实财务 / 发票 / 支付系统
5. 刷新后可能恢复 seed 数据

---

## 7. PARK_ACTIVITY_REVIEW_FLOW_V1 冻结结论

状态：

PARK_ACTIVITY_REVIEW_FLOW_V1 = PASS

完成内容：

1. 园区活动草稿创建
2. 保存活动草稿
3. 责任声明勾选
4. 未勾选声明不可提交
5. 提交发布检查
6. ReviewRecord 生成
7. 操作日志写入
8. 平台 mock 审核结论回传
9. 阻断原因展示
10. 平台优化意见展示
11. 需要补充内容展示
12. 下一步建议展示
13. 参与商家明细分页
14. 进行中活动隐藏发布检查

冻结意义：

园区后台从“活动页面展示”进入“发布检查 mock 数据闭环”。

当前边界：

1. 平台审核仍为 mock
2. 审核非真实异步流程
3. 责任声明尚未接真实电子签名或真实审计
4. 操作日志为 mock / session 记录

---

## 8. PLATFORM_REVIEW_PUBLISH_FLOW_V1 冻结结论

状态：

PLATFORM_REVIEW_PUBLISH_FLOW_V1 = PASS

完成内容：

1. 平台审查队列
2. 审查详情
3. 通过 / 驳回 / 待补充 / 阻断
4. 审查通过后进入发布中心
5. 发布中心队列
6. Mock Runtime 发布占位
7. 发布日志
8. 平台 Dashboard 审查 / 发布统计
9. 园区端回读平台审查结论
10. 内容生产线审查 / 发布状态联动
11. Mock Runtime 风险提示

冻结意义：

平台后台从“审查 / 发布页面展示”进入“审查发布 mock 数据闭环”。

当前边界：

1. 不是真实 Runtime 发布
2. 不接真实发布任务队列
3. 不接真实消息通知
4. 不接真实回滚系统
5. Mock 发布结果不代表真实上线

---

## 9. CONTENT_PRODUCTION_DATA_FLOW_V1 冻结结论

状态：

CONTENT_PRODUCTION_DATA_FLOW_V1 = PASS

完成内容：

1. 探索点 mock 数据
2. 信物 mock 数据
3. 祝福内容 mock 数据
4. AR内容 mock 数据
5. 美术需求单 mock 数据
6. 生成任务 mock 数据
7. 生成信物占位
8. 生成祝福文案候选
9. 生成 AR 占位
10. 生成美术需求单
11. 绑定探索点 / 信物 / 祝福 / AR / 美术资源
12. 提交平台审查
13. 平台审查 / 发布状态回写内容生产页面
14. 全局搜索联动内容生产对象

冻结意义：

平台内容生产线从“页面可演示”进入“生成 / 绑定 / 审查 / 发布状态联动 mock 数据闭环”。

当前边界：

1. 不接真实 AI 生成接口
2. 不接真实图片生成工具
3. 不接真实 AR 资源服务
4. 生成任务是即时 mock，占位不是异步任务
5. 信物仍明确为故事进度资产，不等同数字藏品

---

## 10. USER_EXPLORATION_RUNTIME_FLOW_V1 冻结结论

状态：

USER_EXPLORATION_RUNTIME_FLOW_V1 = PASS

完成内容：

1. 用户端首页接入 adapter
2. 探索地图接入 adapter
3. 探索点详情接入 adapter
4. Mock 打卡
5. AR 显现占位
6. 信物显现
7. 信物库更新
8. 权益中心礼遇解锁
9. 核销码生成
10. 商家核销联动
11. 我的页面进度更新
12. 星图 / 经络图进度更新
13. 内容生产已发布数据进入用户端
14. 未发布 / 阻断内容不进入用户端主列表

冻结意义：

用户端从“视觉页面验收”进入“Mock Runtime 体验闭环”。

当前边界：

1. Mock 打卡不等于真实线下打卡
2. Mock AR 显现不等于真实 AR SDK
3. 不接真实定位
4. 不接真实摄像头
5. 不接真实微信登录
6. 礼遇领取 / 核销仍为 mock 数据闭环

---

## 11. 当前完整 Mock Runtime 链路

当前 Phase 2 已形成以下完整链路：

### 11.1 内容生产到用户端

平台创建 / 管理探索点、信物、祝福内容、AR内容、美术需求单
→ 内容对象提交审查
→ 平台审查通过
→ 发布中心 Mock Runtime 发布
→ 已发布内容进入用户端探索地图和探索点详情

### 11.2 用户探索到信物显现

用户进入首页
→ 选择当前景区 / 活动
→ 进入探索地图
→ 进入探索点详情
→ Mock 打卡
→ AR 显现占位
→ 信物显现
→ 信物库更新
→ 星图 / 经络图进度更新

### 11.3 用户礼遇到商家核销

信物显现 / 探索完成
→ 解锁礼遇 / 卡券
→ 权益中心生成核销码
→ 商家扫码 / 输入核销码
→ 核销成功
→ 商家核销记录更新
→ 用户权益状态更新为已核销

### 11.4 园区活动到平台审核

园区创建活动草稿
→ 勾选责任声明
→ 提交发布检查
→ 平台审查中心处理
→ 审查意见回写园区发布检查页
→ 园区根据意见修改后可再次提交

---

## 12. 当前验收边界

本次通过的是：

1. Mock Runtime 数据闭环
2. 前端 adapter 层闭环
3. 页面到数据源的 mock 连接
4. 角色导航与可见性配置
5. 商家核销 mock 流程
6. 园区发布检查 mock 流程
7. 平台审查发布 mock 流程
8. 内容生产 mock 流程
9. 用户探索 mock 流程

本次不代表以下能力已经完成：

1. 真实后端接口
2. 真实数据库
3. 真实服务端权限
4. 真实微信登录
5. 真实定位
6. 真实 AR SDK
7. 真实摄像头扫码
8. 真实商家核销接口
9. 真实支付 / 发票系统
10. 真实 Runtime 发布
11. 真实 AI 生成
12. 真实图片生成
13. 真实消息通知
14. 真实审计日志系统

---

## 13. 风险记录

当前仍需关注：

1. Adapter session 多为内存态，刷新页面后可能恢复 seed 数据
2. Mock 数据和旧 seed / localStorage 可能在少数页面并存
3. 小程序构建路径与 shared adapter 路径后续需重点确认
4. 前端角色隐藏不等于真实权限安全
5. Mock AR 显现不代表真实设备 AR 能力
6. Mock 发布不代表真实上线
7. 生成任务为即时占位，不代表真实异步生产流程
8. 用户端探索点 ID 仍需逐步统一到内容生产 ID
9. 真实 API 接入时必须避免破坏 Phase 1 视觉结构和 Phase 2 页面路径
10. 信物与数字藏品边界必须继续保持

---

## 14. 后续阶段建议

Phase 2 冻结后，建议进入 Phase 3：

PHASE3_REAL_API_AND_PERMISSION_INTEGRATION_PLAN_V1

Phase 3 不建议一开始全面接入所有真实接口，应按以下顺序推进：

### Step 1：Adapter session 持久化

目标：

1. 将当前内存 mock session 持久化到 sessionStorage / localStorage 演示层
2. 保证跨页演示更稳定
3. 不接真实后端

建议输出：

ADAPTER_SESSION_PERSISTENCE_V1

### Step 2：真实登录与角色身份

目标：

1. 用户登录
2. 商家管理员登录
3. 商家核销员登录
4. 园区负责人登录
5. 平台管理员登录
6. 服务端权限校验前置规划

建议输出：

AUTH_ROLE_IDENTITY_PLAN_V1

### Step 3：商家核销真实接口

目标：

1. 真实核销码校验
2. 真实核销记录写入
3. 防重复核销
4. 商家权限校验
5. 用户权益状态同步

建议输出：

REAL_MERCHANT_REDEMPTION_API_V1

### Step 4：园区活动审核真实接口

目标：

1. 活动草稿保存
2. 提交平台检查
3. 责任声明记录
4. 操作日志写入
5. 平台意见回传

建议输出：

REAL_PARK_ACTIVITY_REVIEW_API_V1

### Step 5：平台审查发布真实接口

目标：

1. 审查队列
2. 审查详情
3. 审查决策
4. 发布任务
5. Runtime 状态
6. 发布日志

建议输出：

REAL_PLATFORM_REVIEW_PUBLISH_API_V1

### Step 6：用户端真实探索接口

目标：

1. 用户进度
2. 探索点状态
3. 打卡记录
4. 信物显现记录
5. 礼遇领取记录
6. 商家核销回写

建议输出：

REAL_USER_EXPLORATION_API_V1

### Step 7：真实 AR / 设备能力接入

目标：

1. AR SDK
2. 摄像头权限
3. 定位权限
4. 设备兼容性
5. 真机验收

建议输出：

REAL_AR_DEVICE_INTEGRATION_V1

---

## 15. 冻结标记

Phase 2 Runtime Flow 冻结标记：

DATA_ADAPTER_LAYER_V1 = PASS
ROLE_BASED_ADMIN_NAVIGATION_V1 = PASS
MERCHANT_REDEMPTION_DATA_FLOW_V1 = PASS
PARK_ACTIVITY_REVIEW_FLOW_V1 = PASS
PLATFORM_REVIEW_PUBLISH_FLOW_V1 = PASS
CONTENT_PRODUCTION_DATA_FLOW_V1 = PASS
USER_EXPLORATION_RUNTIME_FLOW_V1 = PASS
PHASE2_RUNTIME_FLOW_FREEZE_V1 = PASS

LOVEQIGU_PHASE2_MOCK_RUNTIME_FLOW = PASS

READY_FOR_PHASE3_REAL_API_AND_PERMISSION_INTEGRATION_PLAN_V1 = YES
