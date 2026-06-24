# PHASE2_DATA_PERMISSION_INTEGRATION_PLAN_V1

## 1. 文档定位

本文件用于规划 LOVEQIGU / AR游伴 Phase 2 的真实数据、接口、权限与页面接入路径。

Phase 1 已完成视觉落地与高保真 Mock 页面闭环，Phase 2 的目标不是重新设计页面，而是在保持既有视觉结构和页面路径稳定的基础上，将 Mock Runtime 逐步替换为真实数据与真实权限能力。

本文件不直接修改代码，不直接接入接口，不直接创建数据库，仅作为 Phase 2 技术实施前置蓝图。

---

## 2. Phase 2 总目标

Phase 2 总目标：

从 Mock Runtime 过渡到可接真实数据的前端 / 后台结构。

重点包括：

1. 用户身份与登录状态
2. 景区数据
3. 活动数据
4. 探索点数据
5. 信物数据
6. 礼遇 / 卡券数据
7. 商家数据
8. 园区数据
9. 审查与发布状态
10. 权限与角色菜单
11. 工单与帮助中心数据
12. 内容生产 / AR生产线数据
13. 全局搜索数据源

---

## 3. 角色体系规划

Phase 2 至少需要支持以下角色：

### 3.1 游客 / 用户

权限范围：

1. 查看用户端首页
2. 查看探索地图
3. 查看探索点详情
4. 执行探索 / 打卡 / AR扫描
5. 查看信物库
6. 查看权益中心
7. 领取礼遇
8. 查看我的页面
9. 查看星图 / 经络图进度

禁止访问：

1. 商家后台
2. 园区后台
3. 平台后台
4. 内容生产后台

---

### 3.2 商家管理员

权限范围：

1. 今日概览
2. 扫码核销
3. 核销记录
4. 我的卡券
5. 卡券详情
6. 账单与发票
7. 工单
8. 帮助中心
9. 门店资料
10. 核销员管理

禁止访问：

1. 园区后台
2. 平台后台
3. 其他商家数据
4. 平台内容生产线
5. 平台发布中心

---

### 3.3 商家核销员

权限范围：

1. 扫码核销
2. 查看本人核销记录
3. 简化帮助说明

禁止访问：

1. 财务数据
2. 门店资料编辑
3. 核销员管理
4. 商家全部卡券管理
5. 园区后台
6. 平台后台

---

### 3.4 园区负责人

权限范围：

1. 园区数据总览
2. 活动数据
3. 创建活动草稿
4. 发布检查
5. 商家数据
6. 工单
7. 帮助中心
8. 操作手册下载
9. 查看参与商家明细
10. 查看活动检查结论详情
11. 提交正式活动前责任声明
12. 查看操作日志

禁止访问：

1. 其他园区数据
2. 平台全局数据
3. 平台发布中心最终发布权限
4. 平台内容生产全局管理
5. 其他园区商家数据

---

### 3.5 平台管理员 / 平台超管

权限范围：

1. 平台总览
2. 审查中心
3. 发布中心
4. 景区管理
5. 活动管理
6. 卡券分析
7. 工单
8. 系统设置
9. 全局搜索
10. 进入园区视图 / 代管查看
11. 内容生产 / AR生产线
12. 探索点管理
13. 信物管理
14. 祝福内容管理
15. AR内容管理
16. 美术需求单
17. 生成任务
18. 审计日志

---

## 4. 页面与数据源映射

### 4.1 用户端数据源

用户端页面需要的数据：

#### 首页

数据对象：

1. 当前活动
2. 当前景区
3. 用户探索进度
4. 用户信物数量
5. 用户礼遇数量
6. 今日推荐探索点
7. 今日回响文案

#### 探索地图

数据对象：

1. 景区信息
2. 活动信息
3. 探索点列表
4. 探索点状态
5. 推荐前往点
6. 打卡状态
7. 绑定信物
8. 绑定礼遇

#### 探索点详情

数据对象：

1. 探索点基础信息
2. 所属景区
3. 所属活动
4. 任务状态
5. 打卡状态
6. 信物状态
7. 礼遇状态
8. AR扫描入口
9. 显现仪式入口

#### 信物库

数据对象：

1. 用户已收集信物
2. 用户未显现信物数量
3. 信物所属册页
4. 信物详情
5. 星图 / 经络图关联
6. 折叠显示规则

#### 权益中心

数据对象：

1. 当前可领取礼遇
2. 推荐礼遇
3. 已领取礼遇
4. 待解锁礼遇
5. 礼遇核销状态
6. 所属商家

#### 我的页面

数据对象：

1. 用户基础信息
2. 当前活动
3. 任务进度
4. 信物数量
5. 礼遇数量

---

### 4.2 商家后台数据源

商家后台页面需要的数据：

#### 今日概览

1. 今日领取数量
2. 今日核销数量
3. 累计领取
4. 累计核销
5. 待核销数量
6. 当前卡券
7. 待处理事项
8. 最近核销记录

#### 扫码核销

1. 核销码
2. 卡券状态
3. 用户领取记录
4. 核销结果
5. 核销员信息
6. 核销时间

#### 核销记录

1. 卡券名称
2. 核销码
3. 用户脱敏标识
4. 领取时间
5. 核销时间
6. 核销状态
7. 核销员

#### 我的卡券

1. 卡券名称
2. 所属活动
3. 发放数量
4. 领取数量
5. 核销数量
6. 核销率
7. 有效期
8. 状态

#### 账单与发票

1. 账单周期
2. 服务费
3. 付款状态
4. 到期日
5. 发票信息

#### 工单

1. 工单标题
2. 类型
3. 状态
4. 提交时间
5. 平台回复

#### 门店资料

1. 商家名称
2. 联系人
3. 联系电话
4. 门店地址
5. 登录账号
6. 账号状态

#### 核销员管理

1. 核销员姓名
2. 手机号
3. 角色
4. 状态

---

### 4.3 园区后台数据源

园区后台页面需要的数据：

#### 数据总览

1. 入驻商家数量
2. 活动数量
3. 探索点数量
4. 用户参与数量
5. 发券数量
6. 核销数量
7. 核销率
8. 商家表现摘要
9. 活动优化建议

#### 活动数据

1. 活动名称
2. 活动状态
3. 参与人数
4. 探索点数量
5. 关联商家数量
6. 发券数量
7. 核销数量
8. 核销率
9. 优化建议

#### 创建活动

1. 活动名称
2. 开始时间
3. 结束时间
4. 关联商家
5. 关联探索点
6. 活动说明
7. 草稿状态

#### 发布检查

1. 活动基础信息
2. 关联商家状态
3. 礼遇配置状态
4. 探索点关联状态
5. 发布风险提示
6. 平台审核状态
7. 平台审核意见
8. 阻断原因
9. 修改建议
10. 操作日志
11. 责任声明勾选状态

#### 商家数据

1. 商家列表
2. 商家参与活动数量
3. 商家发券数量
4. 商家核销数量
5. 商家核销率
6. 卡券内容
7. 分页数据

#### 工单

1. 工单标题
2. 类型
3. 状态
4. 提交时间
5. 平台回复

#### 帮助中心

1. 常见问题
2. 操作手册下载地址
3. 联系平台信息

---

### 4.4 平台后台数据源

平台后台页面需要的数据：

#### 平台总览

1. 合作景区数量
2. 入驻商家数量
3. 活动数量
4. 卡券数量
5. 用户参与数量
6. 待审查内容
7. 待发布内容
8. 待处理工单
9. 风险提醒

#### 审查中心

1. 审查对象
2. 内容类型
3. 所属景区
4. 来源模块
5. 提交人
6. 当前状态
7. 审查详情
8. 审查意见
9. 驳回原因
10. 补充要求
11. 审查日志

#### 发布中心

1. 待发布内容
2. 发布目标
3. 关联景区
4. 审查状态
5. 发布检查状态
6. Runtime 状态
7. 风险状态
8. 发布日志

#### 景区管理

1. 景区名称
2. 地区
3. 合作状态
4. 活动数量
5. 探索点数量
6. 商家数量
7. 最近更新
8. 园区视图入口

#### 活动管理

1. 按景区分组
2. 活动名称
3. 活动状态
4. 发布检查状态
5. 发布状态
6. 关联商家数量
7. 关联探索点数量
8. 卡券数量
9. 活动详情入口

#### 卡券分析

1. 卡券名称
2. 所属景区
3. 所属活动
4. 发卡商家
5. 发放量
6. 领取量
7. 核销量
8. 核销率
9. 领取率
10. 风险提示
11. 排序维度
12. 商家定位入口

#### 内容生产 / AR生产线

1. 探索点数据
2. 信物数据
3. 祝福内容数据
4. AR内容数据
5. 美术需求单数据
6. 生成任务数据
7. 审查状态
8. 发布状态
9. 绑定关系

#### 全局搜索

搜索对象：

1. 景区
2. 商家
3. 活动
4. 卡券
5. 探索点
6. 信物
7. 祝福内容
8. AR内容
9. 美术需求单

---

## 5. 核心数据对象规划

Phase 2 需要准备以下核心数据对象：

### 5.1 User

字段建议：

1. id
2. nickname
3. avatar
4. phone
5. role
6. currentParkId
7. currentActivityId
8. createdAt
9. updatedAt

---

### 5.2 Park / Scenic

字段建议：

1. id
2. name
3. region
4. status
5. description
6. contactName
7. contactPhone
8. createdAt
9. updatedAt

---

### 5.3 Merchant

字段建议：

1. id
2. parkId
3. name
4. category
5. contactName
6. contactPhone
7. address
8. accountStatus
9. createdAt
10. updatedAt

---

### 5.4 Activity

字段建议：

1. id
2. parkId
3. name
4. startDate
5. endDate
6. status
7. reviewStatus
8. publishStatus
9. description
10. createdBy
11. createdAt
12. updatedAt

---

### 5.5 ExplorationPoint

字段建议：

1. id
2. parkId
3. activityId
4. name
5. sceneType
6. locationName
7. latitude
8. longitude
9. checkinType
10. status
11. relicId
12. arContentId
13. createdAt
14. updatedAt

---

### 5.6 Relic

字段建议：

1. id
2. parkId
3. activityId
4. explorationPointId
5. name
6. chapter
7. node
8. level
9. appearStatus
10. copyStatus
11. arStatus
12. reviewStatus
13. publishStatus
14. createdAt
15. updatedAt

说明：

信物是故事进度资产，不等同数字藏品。

---

### 5.7 BlessingContent

字段建议：

1. id
2. parkId
3. activityId
4. explorationPointId
5. relicId
6. title
7. contentType
8. content
9. copyStatus
10. reviewStatus
11. publishStatus
12. createdAt
13. updatedAt

---

### 5.8 ARContent

字段建议：

1. id
2. parkId
3. activityId
4. explorationPointId
5. relicId
6. name
7. arType
8. resourceStatus
9. previewStatus
10. reviewStatus
11. publishStatus
12. configJson
13. createdAt
14. updatedAt

---

### 5.9 Coupon / Benefit

字段建议：

1. id
2. parkId
3. activityId
4. merchantId
5. name
6. benefitType
7. description
8. issueTotal
9. claimedCount
10. redeemedCount
11. claimRate
12. redemptionRate
13. startDate
14. endDate
15. status
16. createdAt
17. updatedAt

---

### 5.10 CouponClaim

字段建议：

1. id
2. couponId
3. userId
4. claimCode
5. claimStatus
6. claimedAt
7. redeemedAt
8. redeemedByStaffId
9. merchantId
10. parkId
11. activityId

---

### 5.11 ReviewRecord

字段建议：

1. id
2. targetType
3. targetId
4. parkId
5. activityId
6. submittedBy
7. submittedRole
8. status
9. reviewConclusion
10. blockReason
11. optimizationSuggestion
12. reviewerId
13. reviewedAt
14. createdAt
15. updatedAt

---

### 5.12 PublishRecord

字段建议：

1. id
2. targetType
3. targetId
4. parkId
5. activityId
6. reviewStatus
7. publishCheckStatus
8. runtimeStatus
9. riskStatus
10. publishedBy
11. publishedAt
12. log

---

### 5.13 WorkOrder

字段建议：

1. id
2. sourceRole
3. sourceUserId
4. parkId
5. merchantId
6. title
7. type
8. status
9. description
10. reply
11. createdAt
12. updatedAt

---

### 5.14 OperationLog

字段建议：

1. id
2. actorId
3. actorRole
4. action
5. targetType
6. targetId
7. beforeSnapshot
8. afterSnapshot
9. statementConfirmed
10. createdAt

---

### 5.15 ArtRequest

字段建议：

1. id
2. title
3. assetType
4. parkId
5. activityId
6. explorationPointId
7. relicId
8. toolSuggestion
9. prompt
10. status
11. createdAt
12. updatedAt

---

### 5.16 GenerationTask

字段建议：

1. id
2. taskName
3. taskType
4. parkId
5. activityId
6. targetType
7. targetId
8. executor
9. status
10. log
11. createdAt
12. updatedAt

---

## 6. 权限接入原则

Phase 2 权限接入必须遵守：

1. 前端菜单按角色显示
2. 后端接口必须二次校验权限
3. 商家只能看自己的数据
4. 园区只能看本园区数据
5. 平台可看全局数据
6. 平台进入园区视图必须有代管标记
7. 所有正式提交动作必须写入操作日志
8. 园区正式提交活动必须勾选责任声明
9. 核销员权限必须最小化
10. 用户端不能暴露后台数据

---

## 7. Mock 到真实接口迁移原则

Phase 2 迁移时应遵守：

1. 不破坏已验收页面结构
2. 不重写视觉样式
3. 先替换数据源，再补交互
4. 先只读数据，再写入操作
5. 先后台数据，再用户端闭环
6. 先商家核销闭环，再平台发布闭环
7. 所有 mock 数据应逐步集中到 mockData / adapter 层
8. 页面不要直接写死数据
9. 所有状态字段必须中文展示
10. 真实接口失败时要有空状态 / 错误状态

---

## 8. Phase 2 建议实施顺序

建议按以下顺序实施：

### Step 1：统一数据适配层

目标：

1. 梳理 mock 数据来源
2. 建立 data adapter
3. 页面从 adapter 读取数据
4. 为后续替换真实接口做准备

建议输出：

DATA_ADAPTER_LAYER_V1

---

### Step 2：权限菜单层

目标：

1. 定义角色
2. 定义每个角色可见菜单
3. 定义顶部按钮可见规则
4. 定义页面访问拦截规则

建议输出：

ROLE_BASED_ADMIN_NAVIGATION_V1

---

### Step 3：商家核销数据闭环

目标：

1. 商家卡券数据
2. 领取记录
3. 核销记录
4. 核销员权限
5. 核销结果写入

建议输出：

MERCHANT_REDEMPTION_DATA_FLOW_V1

---

### Step 4：园区活动与发布检查闭环

目标：

1. 创建活动草稿
2. 提交发布检查
3. 平台审核意见
4. 操作日志
5. 责任声明

建议输出：

PARK_ACTIVITY_REVIEW_FLOW_V1

---

### Step 5：平台审查与发布闭环

目标：

1. 审查中心
2. 审查详情
3. 驳回原因
4. 优化建议
5. 发布中心
6. Runtime 发布状态

建议输出：

PLATFORM_REVIEW_PUBLISH_FLOW_V1

---

### Step 6：内容生产线数据闭环

目标：

1. 探索点
2. 信物
3. 祝福内容
4. AR内容
5. 美术需求
6. 生成任务
7. 审查 / 发布联动

建议输出：

CONTENT_PRODUCTION_DATA_FLOW_V1

---

### Step 7：用户端真实体验闭环

目标：

1. 探索地图
2. 探索点详情
3. 打卡
4. 信物显现
5. 礼遇领取
6. 商家核销
7. 我的页面

建议输出：

USER_EXPLORATION_RUNTIME_FLOW_V1

---

## 9. 不应在 Phase 2 一开始做的事情

暂不建议一开始做：

1. 完整真实 AI 生成系统
2. 完整真实 AR 资源生成系统
3. 复杂 BI 报表
4. 多租户复杂权限后台
5. 完整财务支付系统
6. 完整发票系统
7. 区块链 / 数字藏品系统
8. 大规模内容 CMS
9. 重做 UI
10. 重构全部页面

---

## 10. Phase 2 验收标记

Phase 2 规划验收标记：

PHASE2_DATA_PERMISSION_INTEGRATION_PLAN_V1 = CREATED
PHASE1_VISUAL_STRUCTURE_LOCKED = YES
ROLE_MODEL_DEFINED = YES
PAGE_DATA_MAPPING_DEFINED = YES
CORE_DATA_OBJECTS_DEFINED = YES
PERMISSION_RULES_DEFINED = YES
MOCK_TO_API_MIGRATION_RULES_DEFINED = YES
PHASE2_IMPLEMENTATION_SEQUENCE_DEFINED = YES
DO_NOT_REDESIGN_VISUAL_PHASE1 = CONFIRMED
DO_NOT_CHANGE_RUNTIME_DATA_IN_THIS_STEP = CONFIRMED
