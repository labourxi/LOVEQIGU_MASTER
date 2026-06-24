# MERCHANT_ADMIN_FINAL_BROWSER_FIX_V1

## 1. 浏览器验收问题总结

**验收结论：** `MERCHANT_ADMIN_BROWSER_REVIEW = PASS_WITH_MINOR_FIX_REQUIRED`

**已通过：**
- 左侧导航排版（纯文字菜单）
- 工作台首屏可读
- 扫码核销入口明确
- 卡券、财务、工单、帮助页面基本通过
- 状态标签中文化

**本轮修复：**
| 问题 | 处理 |
|------|------|
| 顶部右侧入口过挤 | 商家端精简顶栏，折叠后台切换 |
| 重复「商家管理员」 | 移除 `user` + `roleLabel` 双徽章，仅保留一个 |
| 核销记录表格换行严重 | 短格式时间、固定列宽、操作区纵向统一按钮 |
| 页面横向溢出风险 | 商家端 `overflow-x: hidden` + 表格容器内滚动 |
| 右侧悬浮头像/蓝条 | **非项目组件**（见 §5） |

---

## 2. 顶部入口栏修复说明

**商家正式演示顶栏：**

```
[游] AR游伴 · 商家后台     |  扫码核销  商家管理员  控制台入口  更多后台 ▾
```

**变更：**
1. 移除 `badge-accent` + `badge-gold` 重复身份展示（原 `user` 与 `roleLabel` 均为「商家管理员」）
2. 平台/园区后台入口折叠为「更多后台」下拉（不含当前「商家后台」项）
3. 隐藏商家顶栏 `Mock Runtime` 副标题，减少噪音
4. 「扫码核销」保留主按钮样式（`bo-topnav-scan`）
5. 顶栏 `flex-wrap: nowrap` + 文字省略，避免 1366px 横向溢出

**平台/园区后台：** 顶栏逻辑不变（仍展示完整 portal switcher）。

---

## 3. 核销记录表格可读性修复说明

**路径：** `merchant_redemptions/index.html` + `backoffice.css`

| 优化项 | 实现 |
|--------|------|
| 时间短格式 | `2026-06-20T10:15:00+08:00` → `06-20 10:15` |
| 卡券名称 | `.cell-coupon` 最多两行 `-webkit-line-clamp: 2` |
| 核销码 | `.cell-code` `word-break: break-all`，固定列宽 |
| 用户 | 脱敏 + `ellipsis` |
| 状态 | 待核销 / 已核销 / 失败 / 已过期（`FAILED` →「失败」） |
| 操作区 | `.table-actions--stack` 纵向排列、按钮等宽 |
| 表格滚动 | `.table-wrap--redemptions` 内部 `overflow-x: auto`，`min-width: 680px` |

表头简化为「领取 / 核销」以节省列宽。

---

## 4. 横向溢出检查说明

**CSS 防护（`.bo-app--merchant`）：**
- `overflow-x: hidden` on app / body / content
- `.grid`、`.bo-page-header-row`、`.filter-bar` 允许 `flex-wrap`
- 宽表格仅在 `.table-wrap` 内横向滚动

**已检查页面（1366px / 1440px 逻辑）：**

| 页面 | 预期 |
|------|------|
| merchant_dashboard | 指标网格响应式，无整页横滚 |
| merchant_coupons / coupon_detail | 表格内滚动 |
| merchant_scan | 居中面板，无溢出 |
| merchant_redemptions | 表格容器内滚动 |
| merchant_finance / tickets / help | 卡片布局 |
| merchant_account / staff | 双列 grid 换行 |

---

## 5. 右侧悬浮组件来源确认

**排查范围：** `apps/admin/**` 全文搜索 `position: fixed`、`floating`、`fab`、`chat-widget`

**结论：** 商家后台 HTML/CSS/JS **无内置**圆形头像或蓝色折叠条悬浮组件。

截图中的右侧悬浮元素属于 **浏览器插件 / Cursor 预览工具 / 调试 overlay**，非 LOVEQIGU 项目代码。

**处理：** 不修改项目代码；商家端已有「帮助中心」与「工单」作为正式支持入口。

---

## 6. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice-shell.js` | 商家顶栏精简、更多后台下拉、去重身份徽章 |
| `apps/admin/shared/backoffice.css` | 顶栏/下拉样式、核销表格类、横向溢出防护 |
| `apps/admin/merchant-portal/merchant_redemptions/index.html` | 短格式时间、表格结构、操作区 |
| `apps/admin/merchant-portal/shared/status-labels.js` | 核销 `FAILED` →「失败」 |
| `docs/ui_implementation/MERCHANT_ADMIN_FINAL_BROWSER_FIX_V1.md` | 本文档 |

---

## 7. 不改动项

- Runtime 数据结构（含 `redemption-store.js`）
- 业务接口与权限逻辑
- 后台架构与页面路由
- 商家后台整体视觉重做
- 园区 / 超管后台
- 英文状态标签恢复

---

## 8. 验收页面清单

1. `merchant_dashboard/index.html`
2. `merchant_coupons/index.html`
3. `merchant_coupon_detail/index.html`
4. `merchant_scan/index.html`
5. `merchant_redemptions/index.html`
6. `merchant_finance/index.html`
7. `merchant_tickets/index.html`
8. `merchant_help/index.html`
9. `merchant_account/index.html`
10. `merchant_staff/index.html`

---

## 9. 风险点

| 风险 | 说明 |
|------|------|
| 更多后台下拉 | 演示人员需知晓平台/园区入口在「更多后台」内 |
| 表格 min-width | 极窄屏（&lt;680px）表格仍会出现容器内横滚，符合预期 |
| 悬浮组件 | 验收时若仍有遮挡，请关闭浏览器插件或 Cursor overlay |

---

## 10. 验收标记

```
MERCHANT_ADMIN_FINAL_BROWSER_FIX_V1_CREATED = YES
MERCHANT_TOPBAR_ENTRY_CLEANED = YES
MERCHANT_TOPBAR_NO_DUPLICATE_ROLE_BUTTONS = YES
MERCHANT_TOPBAR_NO_HORIZONTAL_OVERFLOW = YES
MERCHANT_REDEMPTION_TABLE_READABLE = YES
MERCHANT_REDEMPTION_TIME_FORMAT_SHORT = YES
MERCHANT_ADMIN_LAYOUT_NO_MAJOR_HORIZONTAL_OVERFLOW = YES
MERCHANT_FLOATING_WIDGET_NOT_BLOCKING_CONTENT = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_FINAL_ACCEPTANCE = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_FINAL_BROWSER_FIX_V1*
