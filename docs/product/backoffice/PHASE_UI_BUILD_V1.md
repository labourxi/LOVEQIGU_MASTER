# PHASE_UI_BUILD_V1

## 目标

基于已完成的设计规范，产出三端高保真后台 UI 原型：

- **平台运营**（Platform Admin）
- **商家工作台**（Merchant Portal）
- **园区管理**（Park Admin）

## 约束

| 约束 | 说明 |
|------|------|
| 不接 API | 全部 Mock / localStorage |
| 不接数据库 | 无后端持久化 |
| 不改 Runtime | 不修改 miniapp / orchestrator / release |
| 只做 UI | HTML + CSS + 静态 JS |

## 设计依据

- `docs/product/backoffice/BACKOFFICE_DESIGN_SYSTEM_V1.md`
- `docs/product/backoffice/PLATFORM_ADMIN_CONSOLE_V1.md`（如存在）
- `MERCHANT_PORTAL` / `PARK_ADMIN` 产品规格

## 共享层

```
apps/admin/shared/
├── backoffice.css          # 设计系统 Token + 组件
└── backoffice-shell.js     # Top Nav + Side Nav + 状态徽章
```

三端各自 `page-boot.js` / `shell.js` 调用 `BackofficeShell.mount()`。

## 页面清单

### 平台运营 `apps/admin/platform-admin/`

| 页面 | 路径 | 状态 |
|------|------|------|
| 登录 | login/ | ✅ 高保真 |
| 运营总览 | dashboard/ | ✅ 高保真 |
| 审核中心 | reviews/ | ✅ 高保真 |
| 发布中心 | publish/ | ✅ 高保真 |
| 景区管理 | parks/ | ✅ 新增 |
| 商家管理 | merchants/ | ✅ 新增 |
| 卡券中心 | coupons/ | ✅ 新增 |
| 活动管理 | activities/ | ✅ 新增 |
| 工单中心 | tickets/ | ✅ 新增 |
| 培训中心 | training/ | ✅ 占位 |
| 系统设置 | settings/ | ✅ 占位 |

### 商家工作台 `apps/admin/merchant-portal/`

| 页面 | 路径 | 状态 |
|------|------|------|
| 今日概览 | merchant_dashboard/ | ✅ 高保真 |
| **扫码核销** | merchant_scan/ | ✅ **新增核心页** |
| 核销记录 | merchant_redemptions/ | ✅ 高保真 |
| 核销员 | merchant_staff/ | ✅ 新增 |
| 其他页面 | coupons/finance/tickets/... | ⚠️ 待迁移（仍保留旧版 inline CSS） |

### 园区管理 `apps/admin/park-admin/`

| 页面 | 路径 | 状态 |
|------|------|------|
| 运营总览 | park_admin_dashboard/ | ✅ 高保真 |
| 活动列表 | park_admin_activities/ | ✅ 高保真 |
| 其他页面 | activity_new/publish_check/... | ⚠️ 待迁移 |

### 控制台入口

- `apps/admin/index.html` — 三端 Hub

## Mock 数据

```
data/platform_admin/
├── platform_dashboard_summary.mock.json
├── platform_merchant_review.mock.json
├── platform_coupon_review.mock.json
├── platform_activity_review.mock.json
├── platform_release.mock.json
├── platform_tickets.mock.json      # 新增
├── platform_parks.mock.json        # 新增
├── platform_merchants.mock.json    # 新增
└── platform_coupons.mock.json      # 新增

data/merchant_portal/
└── merchant_redemption_center.mock.json
```

## 本地预览

```bash
npx serve apps/admin
# 打开 http://localhost:3000
```

平台端需先登录：`operation_admin`

## 下一阶段（PHASE_UI_BUILD_V2 建议）

1. 迁移商家/园区剩余页面至共享 Shell
2. 统一 detail 页（卡券详情、工单详情、活动详情）
3. 响应式与 1024px 侧栏折叠实测
4. 移除所有遗留 inline CSS 与英文 slug 标题

## 完成标记

```
PHASE_UI_BUILD_V1_COMPLETE = YES
```
