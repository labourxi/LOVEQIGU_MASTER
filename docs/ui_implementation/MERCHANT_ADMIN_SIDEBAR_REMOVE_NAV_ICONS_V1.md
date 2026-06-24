# MERCHANT_ADMIN_SIDEBAR_REMOVE_NAV_ICONS_V1

## 1. 问题说明

商家后台左侧导航在浏览器验收中，菜单项左侧显示「概 / 扫 / 记 / 券 / ￥ / 单 / ？ / 店 / 员」等单字标记，带来以下问题：

1. 形成一条不必要的左侧文字列
2. 图标与菜单文字视觉分离，缺乏专业感
3. 分组标题与菜单项层次混淆
4. 信息量低，继续调整图标宽度收益有限

---

## 2. 设计决策：移除商家后台侧边栏单字图标

**决策：** 商家后台侧边栏仅保留「分组标题 + 菜单文字 + 选中态」，不再渲染菜单项左侧单字图标。

**保留：** `backoffice-shell.js` 中 `icon` 配置字段（供平台/园区端继续使用，商家端渲染层跳过）。

---

## 3. 修复范围

| 范围 | 说明 |
|------|------|
| 商家后台 | `portal === "merchant"` 时侧栏不输出 `.bo-nav-icon` |
| 共享 shell | `renderSidebar(cfg, activeId, showNavIcons)` 第三参数控制 |
| 共享 CSS | `.bo-app--merchant` 下文字导航、选中态、分组标题样式 |
| 未改 | 各 `merchant_*/index.html`、Runtime、接口、权限、路由 |

平台后台 / 园区后台仍保留图标渲染（`showNavIcons !== false`）。

---

## 4. 导航渲染修复说明

**原结构：**

```html
<a class="bo-nav-item">
  <span class="bo-nav-icon">券</span>
  <span class="bo-nav-label">我的卡券</span>
</a>
```

**商家后台结构：**

```html
<a class="bo-nav-item bo-nav-link">
  <span class="bo-nav-label">我的卡券</span>
</a>
```

实现：`mount()` 调用 `renderSidebar(portal, active, options.portal !== "merchant")`。

---

## 5. 菜单文字对齐说明

```css
.bo-app--merchant .bo-nav-item {
  padding: 10px 16px;
  gap: 0;
}
.bo-app--merchant .bo-nav-label {
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

- 无图标占位、无单字列
- 文字左对齐，不换行
- 侧栏宽度维持 `--sidebar-w: 280px`

---

## 6. 选中态修复说明

- 整行浅绿背景（`--accent-light`）
- 左侧 3px 旧金色边线（`--accent-gold`）
- `padding-left: 13px`（16px − 3px 边线），金线不压住文字
- 不再为图标预留额外空间

---

## 7. 分组标题修复说明

```css
.bo-app--merchant .bo-nav-group-title {
  margin: 20px 0 8px;
  padding: 0 16px;
  font-size: 13px;
  color: rgba(38, 58, 52, 0.55);
}
```

首组标题 `margin-top: 0`，与菜单项左对齐，无图标。

---

## 8. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice-shell.js` | `renderSidebar` 支持 `showNavIcons`；商家 mount 传 `false` |
| `apps/admin/shared/backoffice.css` | 商家纯文字导航、分组标题、选中态；窄屏商家侧栏保留文字 |
| `docs/ui_implementation/MERCHANT_ADMIN_SIDEBAR_REMOVE_NAV_ICONS_V1.md` | 本文档 |

---

## 9. 不改动项

- Runtime 数据结构
- 业务接口与权限逻辑
- 后台架构与页面路由
- 主内容区布局
- 园区 / 超管后台专项改版
- 单字图标继续优化（已删除）
- 新图标资源引入

---

## 10. 验收页面清单

1. `merchant_dashboard/index.html`
2. `merchant_coupons/index.html`
3. `merchant_scan/index.html`
4. `merchant_redemptions/index.html`
5. `merchant_finance/index.html`
6. `merchant_tickets/index.html`
7. `merchant_help/index.html`
8. `merchant_account/index.html`
9. `merchant_staff/index.html`

---

## 11. 验收标记

```
MERCHANT_ADMIN_SIDEBAR_REMOVE_NAV_ICONS_V1_CREATED = YES
MERCHANT_ADMIN_NAV_ICONS_REMOVED = YES
MERCHANT_ADMIN_NAV_SINGLE_CHAR_COLUMN_REMOVED = YES
MERCHANT_ADMIN_NAV_LABEL_LEFT_ALIGNED = YES
MERCHANT_ADMIN_NAV_ACTIVE_STATE_OK = YES
MERCHANT_ADMIN_NAV_SECTION_TITLES_CLEAR = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_SIDEBAR_REMOVE_NAV_ICONS_V1*
