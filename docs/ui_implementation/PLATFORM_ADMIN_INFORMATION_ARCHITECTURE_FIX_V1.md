# PLATFORM_ADMIN_INFORMATION_ARCHITECTURE_FIX_V1

## 1. 本轮问题说明

浏览器验收反馈：

1. **审查中心排版异常** — 使用未定义的 `span-7` / `span-5` 导致栅格失效、内容竖排挤压
2. **信息架构不清** — 商家 / 卡券 / 活动一级并列，不符合景区归属治理逻辑
3. **缺少园区代管入口** — 平台无法快速进入景区园区视图
4. **缺少全局搜索** — 运营人员难以快速定位景区 / 商家 / 活动 / 卡券

**边界：** 不改 Runtime、接口、权限底层；mock / 静态跳转占位。

---

## 2. 审查中心排版修复说明

**根因：** `span-7`、`span-5` 在 `backoffice.css` 中未定义，卡片未占栅格列宽，表格与详情区布局崩溃。

**修复：**

- 使用 `bo-review-layout` 双列网格（1.4fr + 1fr）
- 表格 `min-width: 640px` + `table-wrap` 横向滚动
- 强制 `writing-mode: horizontal-tb`、`white-space` 规则
- 补全审查列表字段列（所属景区、来源模块、提交人等）

**验收：** `PLATFORM_REVIEW_CENTER_LAYOUT_FIXED = YES` · `PLATFORM_REVIEW_CENTER_NO_VERTICAL_TEXT_BUG = YES`

---

## 3. 新平台导航结构

| 分组 | 项 |
|------|-----|
| 总览 | 平台总览 |
| 审核发布 | 审查中心、发布中心 |
| 运营配置 | 景区管理、活动管理、**卡券分析** |
| 内容生产 | 专项待建设 |
| 服务 | 工单 |
| 系统 | 系统设置 |

**移除一级：** 商家管理、卡券管理（改为卡券分析）、培训中心 / 核验 / 消息（从主导航弱化）

**验收：** `PLATFORM_NAV_MERCHANTS_NESTED_UNDER_SCENIC = YES` · `PLATFORM_NAV_COUPONS_REFRAMED_AS_ANALYTICS = YES`

---

## 4. 商家归属景区管理

- `merchants/index.html` 改为 **全局商家索引**（非一级导航）
- 主路径：景区管理 → 进入园区视图 → 商家数据
- 索引页展示所属景区列 + 进入园区视图入口

**验收：** `PLATFORM_MERCHANT_MANAGEMENT_NOT_PRIMARY_NAV = YES` · `PLATFORM_MERCHANT_DATA_SCENIC_CONTEXT_VISIBLE = YES`

---

## 5. 景区管理进入园区视图

**操作：** 进入园区视图（非「登录园区后台」）

**跳转：**

```
park-admin/park_admin_dashboard/index.html?asPlatform=1&parkId=park_001
```

**园区端：** `platform-park-view.js` + `ParkPageBoot` 显示顶栏代管横幅：

> 平台代管视图 · 当前景区：爱企谷

**验收：** `PLATFORM_SCENIC_ENTER_PARK_VIEW_READY = YES` · `PLATFORM_SCENIC_MERCHANTS_ACCESS_THROUGH_PARK_VIEW = YES`

---

## 6. 卡券管理改为卡券分析

- 导航与标题：**卡券分析**
- 多维度排行 Tab：核销率 / 领取量 / 发放量 / 转化率 / 风险提示
- 景区筛选 + 所属景区 / 活动 / 发卡商家列
- 操作：查看发卡商家、进入园区视图

**验收：** `PLATFORM_COUPON_ANALYTICS_READY = YES` · `PLATFORM_COUPON_CAN_LOCATE_MERCHANT = YES` · `PLATFORM_COUPON_SORT_DIMENSIONS_VISIBLE = YES`

---

## 7. 活动管理按景区分组

- `bo-scenic-group` 按景区折叠展示活动
- 每景区：活动状态 / 平台检查 / 发布状态分列
- 操作：查看详情（园区活动详情 + `asPlatform`）、审查、发布中心、进入园区视图

**验收：** `PLATFORM_ACTIVITY_GROUPED_BY_SCENIC_READY = YES` · `PLATFORM_ACTIVITY_DETAIL_ENTRY_READY = YES` · `PLATFORM_ACTIVITY_STATUS_SEPARATED = YES`

---

## 8. 平台首页对应调整

快捷入口：审查中心、发布中心、**景区管理**、**卡券分析**、工单处理

待处理：待审查活动、待发布、卡券核销异常、工单、景区配置待完善

**验收：** `PLATFORM_DASHBOARD_NAV_ALIGNED_WITH_NEW_IA = YES`

---

## 9. 状态中文化与 mock 控件隐藏

- `VERIFIED` → 已核验；审查页无英文状态
- 登录页默认账号文案「平台管理员」
- 主导航路径页面无 `Mock State` / `success` / `error` 切换器
- 旧 `platform-admin-ui` 子页保留但不在正式验收主路径

**验收：** `PLATFORM_ADMIN_VISIBLE_STATUS_CHINESE = YES` · `PLATFORM_DEBUG_MOCK_CONTROLS_HIDDEN_IN_REVIEW = YES`

---

## 10. 平台全局搜索

### 10.1 目标

顶栏模糊搜索景区 / 商家 / 活动 / 卡券，mock 可演示跳转。

### 10.2 搜索范围

景区、商家、活动、卡券 — 名称 / 所属关系 / 状态字段模糊匹配。

### 10.3 结果展示

- 下拉面板，最多 8 条
- 类型标签 + 名称 + 摘要 + 状态
- 空状态：「未找到相关结果…」

### 10.4 点击跳转

| 类型 | 目标 |
|------|------|
| 景区 | 景区管理 / 园区视图 `?asPlatform=1&parkId=` |
| 商家 | 园区商家数据 `?asPlatform=1&parkId=&merchantId=` |
| 活动 | 园区活动详情 `?asPlatform=1&activityId=` |
| 卡券 | 卡券分析 `?couponId=` 或发卡商家园区视图 |

### 10.5 Mock 数据

`platform-global-search.js` 静态 INDEX，16 条，不改 Runtime。

### 10.6 不改动项

不接真实搜索 API；商家 / 园区后台不加搜索框。

### 10.7 验收标记

```
PLATFORM_GLOBAL_SEARCH_IN_TOPBAR = YES
PLATFORM_GLOBAL_SEARCH_SCENIC_READY = YES
PLATFORM_GLOBAL_SEARCH_MERCHANT_READY = YES
PLATFORM_GLOBAL_SEARCH_ACTIVITY_READY = YES
PLATFORM_GLOBAL_SEARCH_COUPON_READY = YES
PLATFORM_GLOBAL_SEARCH_RESULT_PANEL_READY = YES
PLATFORM_GLOBAL_SEARCH_EMPTY_STATE_READY = YES
PLATFORM_GLOBAL_SEARCH_RESULT_NAVIGABLE = YES
```

---

## 11. 修改文件清单

| 文件 | 变更 |
|------|------|
| `shared/backoffice-shell.js` | 导航 IA、顶栏搜索、平台下拉 |
| `shared/backoffice.css` | review-layout、scenic-group、global-search、delegate-banner |
| `shared/platform-global-search.js` | **新增** |
| `shared/platform-park-view.js` | **新增** |
| `reviews/index.html` | 排版修复 |
| `parks/index.html` | 进入园区视图 |
| `activities/index.html` | 按景区分组 |
| `coupons/index.html` | 卡券分析 |
| `merchants/index.html` | 全局商家索引 |
| `dashboard/index.html` | 快捷入口对齐 |
| `park-admin/shared/page-boot.js` | 代管横幅 |
| `park_admin_dashboard/merchants/activity_detail` | 引入 park-view 脚本 |

---

## 12. 不改动项

Runtime、接口、权限、商家 / 园区已验收页面逻辑（仅共享代管横幅）

---

## 13. 风险点

| 风险 | 缓解 |
|------|------|
| 旧 platform-admin-ui 子页仍英文 | 不在主验收路径；后续专项迁移 |
| 代管视图为 mock | query + localStorage + 横幅说明 |
| 搜索数据静态 | 结构可接 API |

---

## 14. 验收页面清单

| 页面 | 要点 |
|------|------|
| `reviews/` | 横排表格、详情可读 |
| `parks/` | 进入园区视图 |
| `activities/` | 景区分组 |
| `coupons/` | 卡券分析排行 |
| `dashboard/` | 新快捷入口 |
| 顶栏 | 全局搜索 |

---

## 15. 验收标记

```
PLATFORM_ADMIN_INFORMATION_ARCHITECTURE_FIX_V1_CREATED = YES
PLATFORM_REVIEW_CENTER_LAYOUT_FIXED = YES
PLATFORM_REVIEW_CENTER_NO_VERTICAL_TEXT_BUG = YES
PLATFORM_REVIEW_CENTER_CLEAR = YES
PLATFORM_NAV_MERCHANTS_NESTED_UNDER_SCENIC = YES
PLATFORM_NAV_COUPONS_REFRAMED_AS_ANALYTICS = YES
PLATFORM_NAV_ACTIVITY_GROUPED_BY_SCENIC = YES
PLATFORM_SCENIC_ENTER_PARK_VIEW_READY = YES
PLATFORM_SCENIC_MERCHANTS_ACCESS_THROUGH_PARK_VIEW = YES
PLATFORM_MERCHANT_MANAGEMENT_NOT_PRIMARY_NAV = YES
PLATFORM_MERCHANT_DATA_SCENIC_CONTEXT_VISIBLE = YES
PLATFORM_COUPON_ANALYTICS_READY = YES
PLATFORM_COUPON_CAN_LOCATE_MERCHANT = YES
PLATFORM_COUPON_SORT_DIMENSIONS_VISIBLE = YES
PLATFORM_ACTIVITY_GROUPED_BY_SCENIC_READY = YES
PLATFORM_ACTIVITY_DETAIL_ENTRY_READY = YES
PLATFORM_ACTIVITY_STATUS_SEPARATED = YES
PLATFORM_DASHBOARD_NAV_ALIGNED_WITH_NEW_IA = YES
PLATFORM_ADMIN_VISIBLE_STATUS_CHINESE = YES
PLATFORM_DEBUG_MOCK_CONTROLS_HIDDEN_IN_REVIEW = YES
PLATFORM_GLOBAL_SEARCH_IN_TOPBAR = YES
PLATFORM_GLOBAL_SEARCH_SCENIC_READY = YES
PLATFORM_GLOBAL_SEARCH_MERCHANT_READY = YES
PLATFORM_GLOBAL_SEARCH_ACTIVITY_READY = YES
PLATFORM_GLOBAL_SEARCH_COUPON_READY = YES
PLATFORM_GLOBAL_SEARCH_RESULT_PANEL_READY = YES
PLATFORM_GLOBAL_SEARCH_EMPTY_STATE_READY = YES
PLATFORM_GLOBAL_SEARCH_RESULT_NAVIGABLE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_PLATFORM_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```

---

*文档版本：V1 · 2026-06-16*
