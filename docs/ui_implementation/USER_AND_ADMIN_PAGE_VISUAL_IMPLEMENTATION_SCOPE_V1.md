# USER_AND_ADMIN_PAGE_VISUAL_IMPLEMENTATION_SCOPE_V1

## 1. 文档定位

本文档用于定义 LOVEQIGU / AR游伴 项目的页面最终呈现技术实施范围。

本阶段目标不是新增复杂功能，而是解决以下问题：

- 用户端页面最终长什么样
- 后台页面最终长什么样
- 哪些页面必须先做
- 哪些页面可以后置
- 页面需要哪些核心组件
- 哪些内容属于视觉呈现
- 哪些内容属于业务逻辑
- 后续 Cursor / Codex 应该如何分批实施

本文件是后续页面开发、UI 还原、组件拆分、验收测试的基础范围文档。

---

## 2. 项目当前页面落地原则

### 2.1 优先做真实可用页面

本阶段禁止只做概念展示页。

所有页面必须服务真实运行目标：

- 用户能看懂
- 用户能进入景区
- 用户能看到探索点
- 用户能理解信物、祝福、权益
- 商家能查看卡券与核销数据
- 园区负责人能查看商家与活动数据
- 超管能管理内容、景区、商家、活动、信物、祝福素材

### 2.2 先做核心功能，不做复杂大后台

后台当前只做核心功能：

- 商家端：卡券、数据、账单、账号、工单、帮助
- 园区负责人端：商家数据、活动数据、活动管理、工单
- 超管端：内容配置、探索点、信物、AR、美术需求、审查、发布

暂不做：

- 复杂 CRM
- 复杂财务系统
- 复杂 OA 审批
- 复杂权限矩阵
- 复杂 BI 报表
- 复杂营销自动化系统

### 2.3 页面视觉必须符合 AR游伴定位

页面整体风格应符合：

- 东方
- 留白
- 卷轴
- 星象
- 经络
- 金石
- 古籍
- 克制
- 温暖
- 可信

禁止：

- 手游化
- 仙侠页游化
- 过度金光
- 奖励爆炸
- 电商堆叠
- 低端模板感
- 盲盒赌博感

### 2.4 用户端优先体验

用户端页面优先级高于后台页面。

因为用户端决定：

- 扫码后的第一印象
- 是否愿意继续探索
- 是否理解 AR游伴是什么
- 是否愿意收集信物
- 是否愿意领取权益
- 是否愿意分享传播

---

## 3. 页面分组总览

本项目页面分为四组：

1. 用户端页面
2. 商家后台页面
3. 园区负责人后台页面
4. 超管后台页面

---

# Part A：用户端页面

## 4. 用户端页面清单

### A1. 入口首页 / 游客首页

页面用途：

用户扫码进入后的第一页面，承担产品解释、氛围建立和行动引导。

核心目标：

- 让用户知道这是一个 AR 打卡探索体验
- 让用户知道可以获得信物、祝福、商家权益
- 让用户看到当前景区
- 引导用户开始探索

页面核心内容：

- 品牌名称：AR游伴
- 主文案：看见即是找回
- 当前景区名称
- 当前探索进度
- 信物数量
- 今日推荐探索点
- 开始探索按钮
- 权益入口
- 我的信物入口

视觉要求：

- 东方卷轴感
- 留白
- 柔和背景
- 可使用淡金、米白、墨色、青绿作为基础气质
- 不要做成普通电商首页

优先级：

P0

---

### A2. 双首页之用户第二首页

页面用途：

用户登录或进入体验后的主要操作首页。

核心目标：

- 展示当前所在景区
- 展示探索地图入口
- 展示信物进度
- 展示祝福/回响状态
- 展示权益中心入口
- 展示最近探索点

页面核心模块：

- 景区信息卡
- 探索地图卡
- 信物收集卡
- 祝福回响卡
- 权益中心卡
- 最近探索点列表
- 底部导航栏

优先级：

P0

---

### A3. 探索地图页面

页面用途：

替代传统打卡地图，用东方探索图谱的方式展示景区探索点。

核心目标：

- 用户知道有哪些探索点
- 用户知道哪些已完成
- 用户知道下一个推荐点
- 用户可以进入探索点详情

页面核心内容：

- 景区探索图
- 探索点列表
- 已点亮状态
- 未点亮状态
- 推荐路径
- 当前定位提示
- 导航按钮

视觉要求：

- 不要做成普通地图 App 页面
- 应有东方图谱感
- 可使用星点、卷轴、路径线、印记等元素

优先级：

P0

---

### A4. 探索点详情页

页面用途：

用户进入某个打卡点前查看详情。

核心目标：

- 展示探索点名称
- 展示地点说明
- 展示文化故事
- 展示可获得信物/祝福/权益
- 引导用户前往或扫码

页面核心内容：

- 探索点名称
- 探索点图片/占位视觉
- 简短故事文案
- 可获得信物
- 可触发 AR 内容
- 附近商家权益
- 导航按钮
- 开始打卡按钮

优先级：

P0

---

### A5. AR 显现页 / AR 触发页

页面用途：

用户到达探索点后触发 AR 或显现仪式。

核心目标：

- 承接“看见即是找回”
- 让信物/祝福/内容以仪式感出现
- 不做刺激奖励，而做“重逢感”

页面核心内容：

- 相机/AR 占位层
- 显现状态
- 信物浮现
- 祝福短文案
- 收藏按钮
- 分享按钮

视觉要求：

- 克制
- 温暖
- 微光
- 烙印
- 古旧
- 避免亮金爆闪

优先级：

P1

说明：

若当前技术未接入真实 AR，可先做 AR 占位页与显现仪式 UI。

---

### A6. 信物详情页

页面用途：

展示用户获得的信物。

核心目标：

- 让信物看起来有收藏价值
- 解释信物来源
- 解释信物与景区/探索点/祝福的关系
- 引导用户继续收集

页面核心内容：

- 信物主视觉
- 信物名称
- 信物等级
- 来源探索点
- 文化说明
- 祝福文本
- 关联星宿/经络/四象/穴位信息
- 继续探索按钮
- 分享按钮

优先级：

P0

---

### A7. 我的信物页面

页面用途：

展示用户已获得的全部信物。

核心目标：

- 建立收藏体系
- 展示进度
- 让用户知道还差哪些
- 支持继续探索

页面核心内容：

- 已获得信物数量
- 分类筛选
- 信物卡片网格
- 未获得占位
- 收集进度
- 合成/组合入口占位

优先级：

P0

---

### A8. 权益中心页面

页面用途：

替代积分商城，展示用户可领取或可使用的商家权益。

核心目标：

- 让用户看到商家优惠券
- 让用户理解权益来源
- 支持领取、查看、核销

页面核心内容：

- 可领取权益
- 已领取权益
- 附近商家权益
- 使用说明
- 核销码/二维码占位
- 过期状态

优先级：

P0

---

### A9. 祝福 / 回响页面

页面用途：

展示用户获得的祝福、回响与探索结果。

核心目标：

- 强化中国祝福文化
- 提供情绪价值
- 支持活动传播，如接福、集福、纳福

页面核心内容：

- 今日祝福
- 探索回响
- 已获得祝福
- 分享祝福
- 关联信物

优先级：

P1

---

### A10. 用户个人中心

页面用途：

用户查看个人信息、记录、设置。

核心内容：

- 用户头像/昵称
- 探索记录
- 信物数量
- 权益数量
- 我的订单/核销记录占位
- 设置
- 帮助

优先级：

P1

---

# Part B：商家后台页面

## 5. 商家后台页面清单

### B1. 商家后台首页 / 工作台

页面用途：

商家登录后的首页。

核心目标：

- 快速看到卡券情况
- 快速看到核销情况
- 快速进入常用操作

页面核心内容：

- 今日领取数量
- 今日核销数量
- 总领取数量
- 总核销数量
- 待处理事项
- 快捷入口

优先级：

P0

---

### B2. 卡券管理页面

页面用途：

商家查看和管理自己参与的卡券。

核心内容：

- 卡券列表
- 卡券状态
- 发放数量
- 领取数量
- 核销数量
- 有效期
- 查看详情

优先级：

P0

说明：

本阶段商家不一定需要复杂创建卡券能力，可先由平台/超管配置，商家查看和配合核销。

---

### B3. 核销管理页面

页面用途：

商家查看核销记录或执行核销。

核心内容：

- 核销码输入/扫码占位
- 核销记录
- 用户领取时间
- 核销时间
- 卡券名称
- 核销状态

优先级：

P0

---

### B4. 数据查看页面

页面用途：

商家查看与卡券相关的数据。

核心内容：

- 卡券领取趋势
- 卡券核销趋势
- 转化率
- 活动来源
- 简单图表

优先级：

P1

---

### B5. 财务数据页面

页面用途：

商家查看账单、付款通知等基础财务信息。

核心内容：

- 账单列表
- 账单周期
- 应收/应付状态
- 付款通知
- 发票信息占位

优先级：

P1

---

### B6. 账号管理页面

页面用途：

商家维护账号基础信息。

核心内容：

- 商家名称
- 联系人
- 联系电话
- 登录账号
- 修改密码
- 门店信息

优先级：

P1

---

### B7. 工单页面

页面用途：

商家提交技术需求、问题反馈。

核心内容：

- 新建工单
- 工单列表
- 工单状态
- 回复记录
- 附件占位

优先级：

P1

---

### B8. 帮助文档 / FAQ 页面

页面用途：

降低商家使用成本。

核心内容：

- 常见问题
- 卡券说明
- 核销说明
- 结算说明
- 联系平台

优先级：

P2

---

# Part C：园区负责人后台页面

## 6. 园区负责人后台页面清单

### C1. 园区后台首页 / 数据总览

页面用途：

园区负责人查看整体运营状态。

核心内容：

- 入驻商家数量
- 活动数量
- 卡券发放数量
- 卡券核销数量
- 探索点数量
- 用户参与数据
- 今日概览

优先级：

P0

---

### C2. 商家数据看板

页面用途：

查看园区内商家的整体表现。

核心内容：

- 商家列表
- 各商家卡券领取量
- 各商家核销量
- 核销率
- 活跃状态
- 简单排行

优先级：

P0

---

### C3. 活动数据看板

页面用途：

查看园区活动效果。

核心内容：

- 活动列表
- 活动参与人数
- 活动关联探索点
- 卡券发放情况
- 卡券核销情况
- 优化建议

优先级：

P0

---

### C4. 活动管理页面

页面用途：

园区负责人查看、发布或协同管理活动。

核心内容：

- 活动列表
- 活动状态
- 发布时间
- 关联商家
- 关联探索点
- 活动详情
- 优化建议

优先级：

P1

说明：

本阶段可先做轻量活动管理，复杂活动编辑可后置。

---

### C5. 工单页面

页面用途：

园区负责人提交问题或需求。

核心内容：

- 新建工单
- 工单列表
- 工单状态
- 平台回复

优先级：

P1

---

# Part D：超管后台页面

## 7. 超管后台页面清单

### D1. 超管后台首页

页面用途：

平台运营人员总览系统状态。

核心内容：

- 景区数量
- 探索点数量
- 商家数量
- 用户数量
- 卡券数量
- 信物数量
- 待审查内容
- 快捷操作

优先级：

P0

---

### D2. 景区管理页面

核心内容：

- 景区列表
- 景区名称
- 地区
- 状态
- 探索点数量
- 商家数量
- 编辑入口

优先级：

P0

---

### D3. 探索点管理页面

核心内容：

- 探索点列表
- 所属景区
- 地点名称
- 状态
- 是否已生成信物占位
- 是否已生成 AR 占位
- 是否已生成美术需求单
- 发布状态

优先级：

P0

核心按钮：

- 新增探索点
- 生成信物占位
- 生成 AR 占位
- 生成美术需求单
- 提交审查
- 发布到 Runtime

---

### D4. 信物管理页面

核心内容：

- 信物列表
- 信物名称
- 所属景区
- 所属探索点
- 类型
- 等级
- 状态
- 详情编辑

优先级：

P0

---

### D5. 祝福内容管理页面

核心内容：

- 祝福文案列表
- 祝福分类
- 关联信物
- 关联探索点
- 状态
- 审查状态

优先级：

P1

---

### D6. AR 内容管理页面

核心内容：

- AR 占位内容
- 所属探索点
- 显现方式
- 状态
- 资源链接
- 审查状态

优先级：

P1

---

### D7. 美术需求单页面

核心内容：

- 美术需求单列表
- 需求名称
- 所属探索点
- 资产类型
- 生成状态
- 审查状态
- 交付状态

优先级：

P1

---

### D8. 商家管理页面

核心内容：

- 商家列表
- 所属景区
- 商家名称
- 联系人
- 卡券数量
- 状态
- 编辑入口

优先级：

P0

---

### D9. 卡券管理页面

核心内容：

- 卡券列表
- 所属商家
- 所属景区
- 发放数量
- 领取数量
- 核销数量
- 有效期
- 状态

优先级：

P0

---

### D10. 审查中心页面

核心内容：

- 待审查内容
- 内容类型
- 来源模块
- 审查状态
- 审查意见
- 通过/驳回按钮

优先级：

P1

---

### D11. 发布中心页面

核心内容：

- 待发布内容
- 发布目标
- Runtime 状态
- 发布时间
- 发布结果
- 回滚占位

优先级：

P1

---

## 8. 底部导航与主要导航原则

### 8.1 用户端底部导航建议

用户端底部导航建议为：

1. 首页
2. 探索
3. 信物
4. 权益
5. 我的

说明：

祝福 / 回响可以作为首页模块或信物详情中的强化模块，不一定单独占底部导航。

### 8.2 后台端侧边导航建议

商家后台：

- 工作台
- 卡券管理
- 核销管理
- 数据查看
- 财务数据
- 工单
- 帮助
- 账号设置

园区负责人后台：

- 数据总览
- 商家数据
- 活动数据
- 活动管理
- 工单
- 账号设置

超管后台：

- 工作台
- 景区管理
- 探索点管理
- 信物管理
- 祝福内容
- AR 内容
- 美术需求
- 商家管理
- 卡券管理
- 审查中心
- 发布中心
- 系统设置

---

## 9. 当前 P0 页面优先级

第一批必须优先实现的页面：

### 用户端 P0

- A1 入口首页 / 游客首页
- A2 用户第二首页
- A3 探索地图页面
- A4 探索点详情页
- A6 信物详情页
- A7 我的信物页面
- A8 权益中心页面

### 商家后台 P0

- B1 商家工作台
- B2 卡券管理
- B3 核销管理

### 园区负责人后台 P0

- C1 园区数据总览
- C2 商家数据看板
- C3 活动数据看板

### 超管后台 P0

- D1 超管后台首页
- D2 景区管理
- D3 探索点管理
- D4 信物管理
- D8 商家管理
- D9 卡券管理

---

## 10. 第一阶段实施建议

第一阶段不建议一次性实现所有页面。

建议按以下顺序推进：

### Phase 1：用户端核心闭环

实现：

- 首页
- 探索地图
- 探索点详情
- 信物详情
- 我的信物
- 权益中心
- 底部导航

目标：

形成用户可体验闭环。

### Phase 2：商家后台核心闭环

实现：

- 商家工作台
- 卡券管理
- 核销管理

目标：

让商家知道平台能带来什么，并能参与卡券核销。

### Phase 3：园区负责人核心看板

实现：

- 数据总览
- 商家数据看板
- 活动数据看板

目标：

让园区负责人能看到整体合作价值。

### Phase 4：超管内容生产后台

实现：

- 景区管理
- 探索点管理
- 信物管理
- 商家管理
- 卡券管理
- 审查中心
- 发布中心

目标：

支持平台运营人员配置内容、审查内容、发布内容。

---

## 11. 技术实施要求

### 11.1 项目结构扫描结果（2026-06-17）

| 检查项 | 结果 |
|--------|------|
| `docs/ui_implementation/` 目录 | **已创建** |
| 本文档 | **已写入** `docs/ui_implementation/USER_AND_ADMIN_PAGE_VISUAL_IMPLEMENTATION_SCOPE_V1.md` |
| 用户端页面根目录 | **存在** — `apps/miniapp/pages/`（**26** 个一级页面目录） |
| 后台端页面根目录 | **存在** — `apps/admin/`（含 `merchant-portal`、`park-admin`、`platform-admin`） |
| 删除已有页面 | **未执行** |
| 大规模重构 | **未执行** |
| 业务数据结构改动 | **未执行** |
| Runtime 内容改动 | **未执行** |

### 11.2 用户端现有页面目录（26）

路径：`apps/miniapp/pages/`

| 目录 | 说明 |
|------|------|
| `ar-entry` | AR 显现 / 触发入口 |
| `atom` | 原子体验页 |
| `campaign-closure` | 活动收束页 |
| `digital-collectible` | 数字藏品（营销资产，与信物分离） |
| `echo` | 祝福 / 回响 |
| `event-complete` | 活动完成页 |
| `explore-map` | 探索地图 |
| `heaven-human-unity` | 天人合一体验页 |
| `index` | 入口 / 双首页 |
| `lottie` | Lottie 动效页 |
| `merchant-event` | 商家活动（含 index / detail / exploration 子页） |
| `meridian-map` | 经络图谱 |
| `next-activity` | 下一活动引导 |
| `profile` | 个人中心 |
| `progress-center` | 进度中心 |
| `relic-archive` | 我的信物 |
| `reward-center` | 奖励中心 |
| `rights-center` | 权益中心 |
| `scenic-detail` | 探索点详情 |
| `scenic-list` | 探索点列表 |
| `seals` | 印记页 |
| `star-map` | 星象图谱 |
| `story-archive` | 故事档案 |
| `story-flow` | 故事流 / 信物叙事 |
| `synthesis` | 信物合成占位 |

`app.json` 已注册 **29** 条页面路由（含 `merchant-event` 子页）；**未配置 tabBar**。

### 11.3 后台端现有页面目录

#### 商家后台 — `apps/admin/merchant-portal/`

| 目录 | 说明 |
|------|------|
| `merchant_dashboard` | 工作台 |
| `merchant_coupons` | 卡券列表 |
| `merchant_coupon_detail` | 卡券详情 |
| `merchant_scan` | 核销扫码 |
| `merchant_redemptions` | 核销记录 |
| `merchant_redemption_detail` | 核销详情 |
| `merchant_finance` | 财务数据 |
| `merchant_account` | 账号管理 |
| `merchant_staff` | 员工管理 |
| `merchant_tickets` | 工单 |
| `merchant_ticket_new` | 新建工单 |
| `merchant_ticket_detail` | 工单详情 |
| `merchant_help` | 帮助 / FAQ |

#### 园区负责人后台 — `apps/admin/park-admin/`

| 目录 | 说明 |
|------|------|
| `park_admin_dashboard` | 数据总览 |
| `park_admin_merchants` | 商家数据 |
| `park_admin_activities` | 活动数据 / 管理 |
| `park_admin_activity_detail` | 活动详情 |
| `park_admin_activity_new` | 新建活动 |
| `park_admin_activity_publish_check` | 发布检查 |
| `park_admin_tickets` | 工单 |

#### 超管后台 — `apps/admin/platform-admin/`

| 目录 | 说明 |
|------|------|
| `dashboard` | 工作台 |
| `parks` | 景区管理 |
| `activities` (+ create/edit/publish/close) | 活动管理 |
| `merchants` | 商家管理 |
| `coupons` (+ inventory/review/statistics/templates) | 卡券管理 |
| `reviews` | 审查中心 |
| `publish` | 发布中心 |
| `settings` | 系统设置 |
| `tickets` (+ merchants/scenic/technical) | 工单 |
| `training` | 培训 |
| `verification` (+ records/exceptions/verifiers/ranking) | 核验 |
| `messages` (+ activity/review/system/training) | 消息 |
| `login` | 登录 |

共享 UI 资产：`apps/admin/shared/`、`apps/admin/shared/figma-ready/`。

### 11.4 范围 ID → 现有路径 → 状态映射表

| 范围 ID | 页面名称 | 现有路径 | 状态 |
|---------|----------|----------|------|
| **A1** | 入口首页 / 游客首页 | `apps/miniapp/pages/index/` | **PARTIAL** — 页面存在，双首页与最终视觉待 polish |
| **A2** | 用户第二首页 | `apps/miniapp/pages/index/`（与 A1 同路由，模块拆分待完善） | **PARTIAL** |
| **A3** | 探索地图 | `apps/miniapp/pages/explore-map/` | **EXISTS** — 视觉 polish 待 Phase 1 |
| **A4** | 探索点详情 | `apps/miniapp/pages/scenic-detail/` | **EXISTS** |
| **A5** | AR 显现 / 触发 | `apps/miniapp/pages/ar-entry/` | **PARTIAL** — 占位 UI 存在，真实 AR 未全接入 |
| **A6** | 信物详情 | `apps/miniapp/pages/story-flow/` · `apps/miniapp/pages/relic-archive/` | **PARTIAL** — 叙事与列表分散，独立详情视觉待统一 |
| **A7** | 我的信物 | `apps/miniapp/pages/relic-archive/` | **EXISTS** |
| **A8** | 权益中心 | `apps/miniapp/pages/rights-center/` | **EXISTS** |
| **A9** | 祝福 / 回响 | `apps/miniapp/pages/echo/` | **EXISTS** |
| **A10** | 个人中心 | `apps/miniapp/pages/profile/` | **EXISTS** |
| — | 探索点列表（辅助） | `apps/miniapp/pages/scenic-list/` | **EXISTS** |
| — | 数字藏品（营销，≠ 信物） | `apps/miniapp/pages/digital-collectible/` | **EXISTS** |
| — | 底部 tabBar | `apps/miniapp/app.json` | **MISSING** — 未配置 tabBar |
| **B1** | 商家工作台 | `apps/admin/merchant-portal/merchant_dashboard/` | **EXISTS** |
| **B2** | 卡券管理 | `apps/admin/merchant-portal/merchant_coupons/` | **EXISTS** |
| **B3** | 核销管理 | `apps/admin/merchant-portal/merchant_scan/` · `merchant_redemptions/` | **EXISTS** |
| **B4** | 数据查看 | `apps/admin/merchant-portal/merchant_dashboard/`（指标聚合） | **PARTIAL** — 无独立数据页 |
| **B5** | 财务数据 | `apps/admin/merchant-portal/merchant_finance/` | **EXISTS** |
| **B6** | 账号管理 | `apps/admin/merchant-portal/merchant_account/` | **EXISTS** |
| **B7** | 工单 | `apps/admin/merchant-portal/merchant_tickets/` | **EXISTS** |
| **B8** | 帮助 / FAQ | `apps/admin/merchant-portal/merchant_help/` | **EXISTS** |
| **C1** | 园区数据总览 | `apps/admin/park-admin/park_admin_dashboard/` | **EXISTS** |
| **C2** | 商家数据看板 | `apps/admin/park-admin/park_admin_merchants/` | **EXISTS** |
| **C3** | 活动数据看板 | `apps/admin/park-admin/park_admin_activities/` | **EXISTS** |
| **C4** | 活动管理 | `apps/admin/park-admin/park_admin_activity_*` | **PARTIAL** — 轻量管理页存在，复杂编辑后置 |
| **C5** | 工单 | `apps/admin/park-admin/park_admin_tickets/` | **EXISTS** |
| **D1** | 超管首页 | `apps/admin/platform-admin/dashboard/` | **EXISTS** |
| **D2** | 景区管理 | `apps/admin/platform-admin/parks/` | **EXISTS** |
| **D3** | 探索点管理 | — | **MISSING** — 无独立探索点管理页 |
| **D4** | 信物管理 | — | **MISSING** — 无独立信物管理页 |
| **D5** | 祝福内容管理 | — | **MISSING** — 无独立祝福 CMS 页 |
| **D6** | AR 内容管理 | — | **MISSING** — 无独立 AR CMS 页 |
| **D7** | 美术需求单 | — | **MISSING** — 无独立美术需求页 |
| **D8** | 商家管理 | `apps/admin/platform-admin/merchants/` | **EXISTS** |
| **D9** | 卡券管理 | `apps/admin/platform-admin/coupons/` | **EXISTS** |
| **D10** | 审查中心 | `apps/admin/platform-admin/reviews/` | **EXISTS** |
| **D11** | 发布中心 | `apps/admin/platform-admin/publish/` | **EXISTS** |

**状态说明：**

- **EXISTS** — 对应目录 / 路由已存在，可在此基础上做视觉还原
- **PARTIAL** — 页面或模块存在但不完整，或职责分散在多个路径
- **MISSING** — 范围定义中的独立页面尚未建立

### 11.5 约束确认

| 约束 | 状态 |
|------|------|
| `DO_NOT_CHANGE_RUNTIME_DATA` | **CONFIRMED** — 本次仅创建文档，未改动 `runtime/` 或业务数据 |
| `DO_NOT_REBUILD_PRODUCT_LOGIC` | **CONFIRMED** — 未重构产品逻辑或页面路由 |

### 11.6 下一步建议：第一个实施模块

**Phase 1 用户端视觉 polish（优先）：**

| 范围 ID | 页面 | 路径 |
|---------|------|------|
| A1 + A2 | 入口 / 双首页 | `apps/miniapp/pages/index/` |
| A3 | 探索地图 | `apps/miniapp/pages/explore-map/` |
| A4 | 探索点详情 | `apps/miniapp/pages/scenic-detail/` |
| A6 | 信物详情 | `apps/miniapp/pages/story-flow/` + `relic-archive/` 统一 |
| A7 | 我的信物 | `apps/miniapp/pages/relic-archive/` |
| A8 | 权益中心 | `apps/miniapp/pages/rights-center/` |
| — | 底部 tabBar | `apps/miniapp/app.json` + 自定义 tab 组件 |

目标：形成用户可体验的探索 → 信物 → 权益闭环，并补齐底部导航。

---

## 12. 验收标准

### 12.1 完成报告

| 验收项 | 结果 |
|--------|------|
| 文档是否已创建 | **是** |
| 保存路径是否正确 | **是** — `docs/ui_implementation/USER_AND_ADMIN_PAGE_VISUAL_IMPLEMENTATION_SCOPE_V1.md` |
| 当前用户端页面目录现状 | **26** 个一级页面目录于 `apps/miniapp/pages/`，路由已在 `app.json` 注册；tabBar **未配置** |
| 当前后台端页面目录现状 | **三端齐全** — merchant-portal（13 页）、park-admin（7 页）、platform-admin（含子模块共 20+ HTML 页） |
| 是否发现已有页面可复用 | **是** — 用户端 P0 页面（index、explore-map、scenic-detail、relic-archive、rights-center）及商家 / 园区 / 超管核心后台页均已存在 |
| 是否发现页面缺失 | **是** — 用户端 tabBar；超管 D3–D7（探索点、信物、祝福、AR、美术需求独立管理页） |
| 建议优先实施页面 | **Phase 1 用户端** — polish `index` + `explore-map` + `scenic-detail` + `relic-archive` + `rights-center` + tabBar（A1、A2、A3、A4、A6、A7、A8） |
| 是否未破坏现有运行逻辑 | **是** — 仅新增文档，无代码 / 数据 / Runtime 变更 |

### 12.2 验收标记

```yaml
USER_AND_ADMIN_PAGE_VISUAL_IMPLEMENTATION_SCOPE_V1_CREATED: YES
PAGE_SCOPE_READY_FOR_IMPLEMENTATION: YES
DO_NOT_CHANGE_RUNTIME_DATA: CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC: CONFIRMED
```
