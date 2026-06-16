# PLATFORM_ADMIN_CONSOLE_V1

## 1. Product Decision

- platform_admin_positioning: 平台总控后台
- design_principle: Desktop First, PC 优先, 面向运营与审核，少解释、多列表、多状态
- first_version_goal: 统一管理景区、商家、活动、卡券、审核、工单、培训和平台设置

## 2. UI Scope

本期只允许：

- UI Skeleton
- Mock Data
- Responsive Layout
- 文档

禁止：

- 数据库
- API
- Runtime
- Release
- Factory

## 3. Layout Principles

### 3.1 Desktop First

优先适配：

- 1920
- 1440
- 1280
- 1024

### 3.2 Layout Structure

- 顶部栏
- 左侧导航
- 主内容区
- 列表 / 卡片 / 详情 / 审核抽屉

### 3.3 Responsive Rules

- 1920：完整多栏布局
- 1440：主内容区压缩但保留完整导航
- 1280：卡片密度降低，列表保持单行优先
- 1024：侧边栏折叠，内容区自适应

## 4. Module 1 - 总览 Dashboard

### 4.1 展示指标

- 景区数量
- 商家数量
- 活动数量
- 卡券数量
- 待审核数量
- 工单数量
- 近 7 日数据

### 4.2 组件建议

- 指标卡片
- 近 7 日趋势占位图
- 待审核提示卡
- 快捷入口卡

### 4.3 Mock State

- loading
- empty
- success
- error

## 5. Module 2 - 景区管理

### 5.1 列表字段

- 景区名称
- 负责人
- 状态
- 商家数量
- 活动数量
- 创建时间

### 5.2 操作

- 查看
- 编辑
- 停用

### 5.3 Empty / Error Design

- 无景区时显示“暂无景区数据”
- 请求失败时显示“景区数据加载失败”

## 6. Module 3 - 商家管理

### 6.1 列表字段

- 商家名称
- 所属景区
- 授权状态
- 卡券数量
- 核销数量
- 培训状态

### 6.2 操作

- 查看
- 编辑
- 冻结

### 6.3 Note

平台总控后台中，商家授权、培训、核销状态必须可见，但不承载商家端的日常操作。

## 7. Module 4 - 活动管理

### 7.1 列表字段

- 活动名称
- 景区
- 状态
- 参与商家
- 卡券数量
- 开始时间
- 结束时间

### 7.2 操作

- 查看
- 编辑
- 发布
- 结束

### 7.3 Status

- DRAFT
- PENDING_REVIEW
- PUBLISHED
- PAUSED
- ENDED

## 8. Module 5 - 卡券中心

### 8.1 列表字段

- 卡券名称
- 商家
- 类型
- 库存
- 领取量
- 核销量
- 状态

### 8.2 Mock State

- loading
- empty
- success
- error

## 9. Module 6 - 审核中心

### 9.1 待审核列表

- 待审核景区
- 待审核商家
- 待审核活动
- 待审核卡券

### 9.2 Audit Pattern

建议使用统一审核卡片：

- 提交时间
- 提交方
- 审核状态
- 审核结果
- 审核备注

## 10. Module 7 - 工单中心

### 10.1 状态

- OPEN
- PROCESSING
- RESOLVED
- CLOSED

### 10.2 Capability

- 查看工单列表
- 查看详情
- 分配处理人
- 更新状态
- 回复备注

## 11. Module 8 - 培训中心

### 11.1 展示内容

- 景区培训
- 商家培训
- 店员培训
- 考试结果

### 11.2 设计目标

- 让平台运营能快速判断是否可上线
- 让培训状态与活动状态联动展示

## 12. Module 9 - 数据中心

### 12.1 展示排行

- 景区排行
- 商家排行
- 活动排行
- 卡券排行

### 12.2 展示方式

- 排行榜
- Top N
- 趋势占位
- 区域筛选占位

## 13. Module 10 - 系统设置

### 13.1 展示内容

- 平台公告
- 帮助中心
- FAQ

## 14. Mock State Rules

所有模块都必须具备以下四种状态：

- loading
- empty
- success
- error

## 15. Navigation Rules

- 顶部栏保留平台身份识别
- 侧边导航按模块组织
- 列表页支持跳转详情
- 详情页支持返回列表

## 16. Non-Goals

本版不做：

- 数据库
- API
- Runtime
- Release
- Factory
- 真正权限系统

## 17. Design Conclusion

平台总控后台第一版的重点不是“把所有事都做完”，而是“把审核、总览、处理、发布前检查、工单和培训的关键状态一次看清”。

