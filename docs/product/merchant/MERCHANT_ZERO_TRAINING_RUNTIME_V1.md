# MERCHANT_ZERO_TRAINING_RUNTIME_V1

## 1. Product Decision

- merchant_zero_training_principle: 第一次使用无培训、无运营指导、无技术人员，仍能完成授权、活动参与、店员核销、查看数据
- merchant_portal_positioning: 商家参与平台活动的零培训运行台
- first_version_goal: 让商家直接看懂、直接操作、直接完成最小闭环

## 2. Zero-Training Runtime Principle

商家后台第一版不以“功能全”为目标，而以“第一次打开就能完成核心动作”为目标。

核心原则：

- 少步骤
- 少入口
- 少术语
- 少配置
- 少解释
- 多默认值
- 多自动检查
- 多平台代办

## 3. Three Roles Re-Design

### 3.1 老板首页

老板首页仅保留以下内容：

- 今日到店人数
- 今日核销人数
- 预计收益
- 结算状态
- 联系客服

### 3.2 店长首页

店长首页仅保留以下内容：

- 活动状态
- 卡券状态
- 核销员状态
- 培训入口

### 3.3 店员首页

店员首页仅保留一个主按钮：

- 【扫码核销】

## 4. Zero-Training Runtime Flow

第一版商家无需培训也能完成以下动作：

1. 扫码授权
2. 确认活动参与
3. 添加店员核销
4. 查看当天核销和收益
5. 联系客服处理异常

## 5. Current Backend Simplification Direction

建议将当前后台从“多模块、多解释、多入口”收敛为“角色首页 + 核心状态 + 关键动作”。

### 5.1 可保留

- 数据看板
- 卡券状态
- 活动状态
- 核销状态
- 联系客服
- 工单
- 帮助文档

### 5.2 应收起到二级入口

- 复杂活动管理
- 复杂财务细节
- 复杂报表
- 复杂配置项
- 复杂说明页

## 6. Migration Proposal

### 6.1 页面收敛策略

#### 老板首页

仅显示：

- 今日到店人数
- 今日核销人数
- 预计收益
- 结算状态
- 联系客服

#### 店长首页

仅显示：

- 活动状态
- 卡券状态
- 核销员状态
- 培训入口

#### 店员首页

仅显示：

- 【扫码核销】

### 6.2 菜单收敛策略

建议将原有菜单按以下方式收敛：

- 主菜单只保留 3 个角色首页入口
- 二级菜单保留数据、卡券、工单、帮助
- 复杂配置折叠到平台运营后台

### 6.3 文案收敛策略

商家端界面中尽量不用技术词，使用商家可直接理解的词汇：

- 授权状态
- 卡券状态
- 活动状态
- 核销员状态
- 结算状态
- 联系客服

## 7. Top30 Can Delete

以下为优先可删除或移出主入口的页面类型，按“零培训运行态”建议排序：

1. 商家活动复杂配置页
2. 商家活动高级编辑页
3. 商家营销方案页
4. 商家报表导出页
5. 商家多级结算页
6. 商家对账详情页
7. 商家发票申请页
8. 商家员工权限配置页
9. 商家员工批量管理页
10. 商家素材中心页
11. 商家公告中心页
12. 商家消息订阅中心页
13. 商家复杂 FAQ 子页
14. 商家卡券批量导入页
15. 商家卡券高级筛选页
16. 商家核销异常分析页
17. 商家核销历史归档页
18. 商家活动审批历史页
19. 商家活动参与统计导出页
20. 商家门店多门店管理页
21. 商家登录引导页
22. 商家注册引导页
23. 商家技术文档页
24. 商家 API 说明页
25. 商家 webhook 说明页
26. 商家回调配置页
27. 商家高级权限页
28. 商家组织架构页
29. 商家渠道分析页
30. 商家实验性功能页

## 8. Top30 Can Hide

以下字段建议从默认视图中隐藏，仅在“展开详情”中出现：

1. authorizer_access_token
2. card_id
3. cardExt
4. API
5. 回调
6. 开放平台
7. 权限集
8. 技术配置
9. 密钥
10. 事件 ID
11. 路由参数
12. JSON 原文
13. webhook
14. token
15. callback_url
16. template_id
17. model
18. endpoint
19. version
20. request_id
21. trace_id
22. internal_note
23. debug_info
24. stack_trace
25. retry_policy
26. scope
27. auth_code
28. refresh_token
29. access_token
30. signature

## 9. Top30 Forbidden Technical Terms

以下术语不应出现在商家零培训首页、主导航和默认说明中：

1. token
2. access token
3. refresh token
4. authorizer_access_token
5. card_id
6. cardExt
7. API
8. webhook
9. callback
10. endpoint
11. payload
12. request_id
13. trace_id
14. signature
15. scope
16. model
17. version
18. runtime
19. release
20. governance
21. RBAC
22. JSON
23. schema
24. debug
25. internal
26. auth
27. OAuth
28. permission set
29. SDK
30. open platform

## 10. Recommended New Navigation

建议将商家后台主导航改为：

- 首页
- 卡券
- 活动
- 核销
- 数据
- 工单
- 帮助

## 11. Design Conclusion

零培训后台的本质不是“减少功能”，而是“把第一次要做的事情放到最显眼、最少步骤、最少术语的位置”。

首版目标是：

- 老板能看
- 店长能配
- 店员能核
- 出问题能找人

## 12. Governance Notes

- 本文只输出设计方案
- 不修改代码
- 不修改 Runtime
- 不修改 Release
- 不修改 Factory
- 不接真实微信接口

