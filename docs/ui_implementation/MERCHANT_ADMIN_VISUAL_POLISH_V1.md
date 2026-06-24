# MERCHANT_ADMIN_VISUAL_POLISH_V1

## 1. 本次实施目标

基于 `BACKEND_ADMIN_VISUAL_IMPLEMENTATION_PLAN_V1`，对 LOVEQIGU / AR游伴 **商家后台** 执行 Phase 1 视觉 polish。

**目标：** 在现有页面基础上，完成合作方可演示的商家端闭环优化 — 让商家 10 秒内看懂经营状态，快速完成扫码核销，清楚查看卡券、财务与工单入口。

**边界：** 不重构后台结构、不改 Runtime 数据结构、不改业务接口、不改权限逻辑、不引入大型 UI 框架。

---

## 2. 商家后台页面范围

根路径：`apps/admin/merchant-portal/`

| # | 页面 | 路径 | 优先级 |
|---|------|------|--------|
| 1 | 商家工作台 | `merchant_dashboard/` | P0 |
| 2 | 卡券管理 | `merchant_coupons/` | P0 |
| 3 | 卡券详情 | `merchant_coupon_detail/` | P0 |
| 4 | 扫码核销 | `merchant_scan/` | P0 |
| 5 | 核销记录 | `merchant_redemptions/` | P0 |
| 6 | 核销详情 | `merchant_redemption_detail/` | P0 |
| 7 | 财务数据 | `merchant_finance/` | P1 |
| 8 | 工单列表 | `merchant_tickets/` | P1 |
| 9 | 新建工单 | `merchant_ticket_new/` | P1 |
| 10 | 工单详情 | `merchant_ticket_detail/` | P1 |
| 11 | 帮助 / FAQ | `merchant_help/` | P1 |
| 12 | 门店资料 | `merchant_account/` | 轻量 |
| 13 | 核销员管理 | `merchant_staff/` | 轻量 |

---

## 3. 修改页面清单

### 3.1 页面 HTML

| 文件 | 变更摘要 |
|------|----------|
| `merchant_dashboard/index.html` | 首屏 10 秒可读结构：摘要、4 指标卡、核销率、待处理、最近核销、卡券摘要、快捷入口 |
| `merchant_coupons/index.html` | 指标摘要 + 列表字段补全（发放/领取/核销/核销率） |
| `merchant_coupon_detail/index.html` | 迁移至 backoffice shell，中文化，去除英文模板 |
| `merchant_scan/index.html` | 强化扫码 CTA、核销说明、最近记录 |
| `merchant_redemptions/index.html` | 中文筛选、用户脱敏、MerchantStatus 徽章 |
| `merchant_redemption_detail/index.html` | 迁移 shell，中文字段标签，核销操作 |
| `merchant_finance/index.html` | 账单周期摘要、付款通知、账单卡片列表 |
| `merchant_tickets/index.html` | 客服入口风格列表，中文状态 |
| `merchant_ticket_new/index.html` | 表单结构（类型/描述/联系方式/附件占位） |
| `merchant_ticket_detail/index.html` | 回复记录、下一步提示，修复乱码 |
| `merchant_help/index.html` | 主题分组 FAQ + 联系平台 |
| `merchant_account/index.html` | 迁移 shell，轻量资料展示 |
| `merchant_staff/index.html` | 补充 status-labels 脚本引用 |

### 3.2 共享文件

| 文件 | 变更摘要 |
|------|----------|
| `apps/admin/shared/backoffice.css` | 商家主题色（深绿）、bo-metric-grid/card、bo-primary-action、bo-quick-actions、bo-help-block、bo-list-card、bo-detail-row、form-group |
| `apps/admin/shared/backoffice-shell.js` | merchant 挂载 `bo-app--merchant`、扩展 STATUS_MAP、角色标签中文化 |
| `apps/admin/merchant-portal/shared/status-labels.js` | **新增** `MerchantStatus.format()` / `MerchantStatus.badge()` 域映射 |
| `apps/admin/merchant-portal/shared/page-boot.js` | 无逻辑变更（仍调用 BackofficeShell.mount） |
| `apps/admin/merchant-portal/shared/redemption-store.js` | **未改** mock 数据结构 |

---

## 4. 工作台首屏优化说明

**路径：** `merchant_dashboard/`

首屏结构：

1. **顶部：** 商家名称 + 当前活动 + 今日摘要 + 主操作「扫码核销」（`bo-primary-action`）
2. **中部：** 4 核心指标卡（今日领取 / 今日核销 / 累计领取 / 累计核销）+ 核销率
3. **待处理事项：** 账单待付款、待核销、工单提醒
4. **下部：** 最近核销记录、当前卡券摘要、快捷入口（卡券 / 核销 / 财务 / 工单）

**验收：** `MERCHANT_DASHBOARD_10_SECOND_READABILITY = YES`

---

## 5. 卡券管理 polish 说明

**列表页：** 卡券名称、状态（生效中）、有效期、发放/领取/核销数量、核销率、详情入口。

**详情页：** 基础信息、使用规则、领取/核销数据、最近核销记录入口。

**状态映射：** PUBLISHED → 生效中；DRAFT → 草稿；EXPIRED → 已过期；DISABLED → 已停用。

**验收：** `MERCHANT_COUPON_STATUS_READABLE = YES`

---

## 6. 核销管理 polish 说明

**扫码页：** 突出 `bo-primary-action` 确认核销按钮、输入框、核销说明、异常提示、最近核销列表。

**记录页：** 中文筛选（全部/待核销/已核销/失败/已过期）、用户脱敏、状态中文徽章。

**详情页：** 核销结果、卡券信息、时间、操作人、异常说明。

**验收：** `MERCHANT_REDEMPTION_FLOW_CLEAR = YES`

---

## 7. 财务数据 polish 说明

**展示：** 当前账单周期摘要、待付款金额、付款通知、账单列表（待付款/已付款）、发票占位。

**状态：** PENDING_PAYMENT → 待付款；PAID → 已付款；SETTLED → 已结算。

**验收：** `MERCHANT_FINANCE_STATUS_CLEAR = YES`

---

## 8. 工单 / 帮助 polish 说明

**工单列表：** 标题、类型、状态、提交时间、平台回复、详情入口。

**新建工单：** 问题类型、描述、联系方式、附件占位、提交成功反馈。

**工单详情：** 问题描述、当前状态、回复记录、下一步提示。

**帮助页：** 卡券 / 核销 / 结算说明 + 常见问题分组 + 联系平台。

**验收：** `MERCHANT_SUPPORT_ENTRY_CLEAR = YES`

---

## 9. 共享样式 / 组件修改说明

新增 CSS 类名（`backoffice.css`）：

- `bo-page-summary` — 页面顶部摘要条
- `bo-metric-grid` / `bo-metric-card` — 统一指标卡
- `bo-primary-action` — 扫码核销主 CTA
- `bo-quick-actions` — 快捷入口网格
- `bo-list-card` — 列表卡片行
- `bo-help-block` — 帮助/说明块
- `bo-detail-row` — 详情键值行
- `bo-app--merchant` — 商家端深绿主题覆盖

**原则：** 优先共享 CSS，页面仅做轻量结构微调，不逐页重复样式。

---

## 10. 状态中文映射说明

**文件：** `apps/admin/merchant-portal/shared/status-labels.js`

```javascript
MerchantStatus.format(status)       // 通用中文
MerchantStatus.badge(status, domain) // 带样式徽章
// domain: 'redemption' | 'coupon' | 'finance' | 'ticket'
```

**规则：**

- 用户可见层显示中文
- mock / 接口内部字段保持英文枚举
- `BackofficeShell.STATUS_MAP` 补充通用状态
- 核销域 `PENDING` 显示「待核销」（避免与审核「待审核」混淆）

**验收：** `MERCHANT_ADMIN_VISIBLE_STATUS_CHINESE = YES`

---

## 11. 不改动项

- Runtime 数据结构（含 `redemption-store.js` seed 字段）
- 业务接口与权限逻辑
- 园区后台 / 平台超管后台
- 后台项目目录结构
- 页面删除或路由变更
- 大型 UI 框架引入

---

## 12. 风险点

| 风险 | 说明 | 缓解 |
|------|------|------|
| PENDING 多义 | 平台审核 vs 核销待处理 | 域映射 `MerchantStatus.badge(s, 'redemption')` |
| Mock 数据静态 | 工作台数字与 store 未实时联动 | Phase 1 接受静态演示值，后续接 API |
| 双模板遗留 | 部分页面曾用独立 inline CSS | 本轮已统一迁移 shell |
| 平台端 accent | merchant 深绿仅作用于 `.bo-app--merchant` | 不影响 platform/park 红色 accent |

---

## 13. 下一步建议

1. 浏览器逐页验收 11 页闭环演示路径
2. 将工作台指标与 `redemption-store` mock 数据只读联动（不改数据结构）
3. 商家端移动端窄屏适配抽测
4. 园区后台 Phase 1 polish（独立任务）
5. 平台超管内容生产页补齐后再做视觉统一

---

## 14. 验收标记

```
MERCHANT_ADMIN_VISUAL_POLISH_V1_CREATED = YES
MERCHANT_DASHBOARD_10_SECOND_READABILITY = YES
MERCHANT_COUPON_STATUS_READABLE = YES
MERCHANT_REDEMPTION_FLOW_CLEAR = YES
MERCHANT_FINANCE_STATUS_CLEAR = YES
MERCHANT_SUPPORT_ENTRY_CLEAR = YES
MERCHANT_ADMIN_VISIBLE_STATUS_CHINESE = YES
MERCHANT_ACCOUNT_STAFF_STYLE_ALIGNED = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_BROWSER_REVIEW = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_VISUAL_POLISH_V1*
