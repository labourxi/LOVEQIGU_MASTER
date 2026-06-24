# MERCHANT_ADMIN_TOPBAR_ROLE_ENTRY_FIX_V1

## 1. 问题说明

商家后台浏览器验收中，顶部右侧出现多个与商家角色无关的入口：

- 控制台入口
- 更多后台（含平台后台 / 园区后台）
- 重复身份徽章

这些入口适合开发/测试切换，不应在商家常态界面展示，否则商家会误以为拥有跨端权限。

---

## 2. 设计决策：商家后台隐藏无关后台入口

**决策：** `portal === "merchant"` 时，顶栏仅展示商家相关操作；跨角色入口默认不渲染。

**调试恢复：** 以下任一条件为真时，恢复控制台入口与更多后台：

- URL 参数 `?debug=1`
- `localStorage.DEBUG_ADMIN_SWITCHER === '1'`

---

## 3. 修复范围

| 范围 | 说明 |
|------|------|
| `backoffice-shell.js` | `ROLE_TOPBAR_ACTIONS`、`isAdminDebugMode()`、`renderTopNav` 角色化 |
| `backoffice.css` | 调试入口轻量标记（`.bo-topnav-dev`） |
| 商家各页面 | 无改动（顶栏由 shell 注入） |
| 平台 / 园区后台 | 顶栏逻辑不变 |

---

## 4. 顶部按钮显示规则

```javascript
ROLE_TOPBAR_ACTIONS = {
  merchant: ["scan", "merchantUser"],
  park: ["parkUser", "adminHub", "portalSwitch"],
  platform: ["platformUser", "adminHub", "portalSwitch"]
}
```

`renderTopNav(cfg, options)` 根据 `options.portal` 与 `isAdminDebugMode()` 决定渲染项。

---

## 5. 商家角色可见入口（默认）

| 入口 | 说明 |
|------|------|
| 扫码核销 | 主操作，跳转 `merchant_scan` |
| 商家管理员 | 当前角色徽章，不可切换后台 |

可选：`退出`（仅当 `mount({ onLogout })` 传入时）

---

## 6. 商家角色隐藏入口（默认）

| 隐藏项 | 说明 |
|--------|------|
| 控制台入口 | `hubHref` |
| 更多后台 | 平台 / 园区切换下拉 |
| 平台后台 | 跨角色 |
| 园区后台 | 跨角色 |
| 角色切换器 | 双徽章 / portal switcher |

**调试模式：** 上述 dev 入口重新显示，并带「· 调试」视觉提示。

---

## 7. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice-shell.js` | 角色顶栏规则、debug 模式、下拉仅 debug 绑定 |
| `apps/admin/shared/backoffice.css` | `.bo-topnav-dev` 调试标记 |
| `docs/ui_implementation/MERCHANT_ADMIN_TOPBAR_ROLE_ENTRY_FIX_V1.md` | 本文档 |

---

## 8. 不改动项

- Runtime 数据结构
- 真实权限逻辑与接口
- 后台架构与页面路由
- 其它后台页面删除
- 平台 / 园区顶栏逻辑
- 调试能力（可通过 debug 参数恢复）

---

## 9. 验收页面清单

1. `merchant_dashboard/index.html`
2. `merchant_scan/index.html`
3. `merchant_redemptions/index.html`
4. `merchant_coupons/index.html`
5. `merchant_finance/index.html`
6. `merchant_tickets/index.html`
7. `merchant_help/index.html`
8. `merchant_account/index.html`
9. `merchant_staff/index.html`

**预期（默认）：** 右上角仅「扫码核销」+「商家管理员」。

**调试验收：** 访问 `?debug=1` 可看到控制台入口与更多后台。

---

## 10. 验收标记

```
MERCHANT_ADMIN_TOPBAR_ROLE_ENTRY_FIX_V1_CREATED = YES
MERCHANT_TOPBAR_CONSOLE_ENTRY_HIDDEN = YES
MERCHANT_TOPBAR_MORE_BACKENDS_HIDDEN = YES
MERCHANT_TOPBAR_CROSS_ROLE_ENTRIES_HIDDEN = YES
MERCHANT_TOPBAR_SCAN_ACTION_VISIBLE = YES
MERCHANT_TOPBAR_ROLE_LABEL_VISIBLE = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_TOPBAR_ROLE_ENTRY_FIX_V1*
