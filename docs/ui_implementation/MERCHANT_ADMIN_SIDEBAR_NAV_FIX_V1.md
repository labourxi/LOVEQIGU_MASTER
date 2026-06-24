# MERCHANT_ADMIN_SIDEBAR_NAV_FIX_V1

## 1. 问题说明

浏览器验收商家后台（`merchant_dashboard` 等页面）时，左侧导航出现明显排版问题：

| 现象 | 原因 |
|------|------|
| 图标与文字间距异常、像独立字符挤在左侧 | 导航项使用 `display: block` + 无 flex 的两段 `<span>`，图标后带多余空格 |
| 「券 我的卡券」「工 工单」等错位或重复感强 | 图标单字与标签首字重复（如 工+工单），且无固定图标列宽 |
| 选中态文字偏移 | `border-left: 3px` 与 block 布局叠加，高亮区域未包裹整行 flex |
| 滚动条与导航项视觉不统一 | 滚动直接挂在 `.bo-sidebar` 上，padding 与 scrollbar 争抢空间 |

---

## 2. 修复范围

**涉及端：** 商家后台（`apps/admin/merchant-portal/`）

**实现层：** 共享 shell 与 CSS（商家页通过 `BackofficeShell.mount` 动态渲染侧栏，无需逐页改 HTML）

**未涉及：** Runtime 数据、接口、权限、主内容区、路由、园区/超管专属改版

---

## 3. 侧边栏布局修复说明

### HTML 结构（`backoffice-shell.js` → `renderSidebar`）

```html
<aside class="bo-sidebar">
  <nav class="bo-sidebar-nav">
    <div class="bo-nav-group">
      <div class="bo-nav-group-title">工作台</div>
      <a class="bo-nav-item bo-nav-link active" href="...">
        <span class="bo-nav-icon">概</span>
        <span class="bo-nav-label">今日概览</span>
      </a>
    </div>
  </nav>
</aside>
```

### CSS 布局

- 导航项：`display: flex; align-items: center; gap: 8px; min-height: 40px`
- 外层 `.bo-sidebar` 固定宽度、隐藏溢出
- 内层 `.bo-sidebar-nav` 负责 `overflow-y: auto` + `scrollbar-gutter: stable`，避免滚动条遮挡文字

---

## 4. 图标与文字间距修复说明

| 类名 | 规则 |
|------|------|
| `.bo-nav-icon` | `flex: 0 0 20px; width: 20px; text-align: center` — 统一图标列宽 |
| `.bo-nav-label` | `flex: 1; white-space: nowrap; text-overflow: ellipsis` — 单行不换行 |

**商家端图标调整（避免与标签重复）：**

| 导航项 | 图标 |
|--------|------|
| 今日概览 | 概 |
| 扫码核销 | 扫 |
| 核销记录 | 记 |
| 我的卡券 | 券 |
| 账单与发票 | ￥ |
| 工单 | 单（原「工」与「工单」重复） |
| 帮助中心 | ？ |
| 门店资料 | 店 |
| 核销员 | 员 |

移除图标 `<span>` 末尾多余空格，杜绝「券我的卡券」黏连。

---

## 5. 选中态修复说明

- 选中类 `.active` 作用于整行 `<a.bo-nav-item>`
- 左侧 3px 金色边线（商家端 `--accent-gold`）与 `padding-left: 11px` 配合，不挤压图标
- 背景浅绿（`--accent-light`）覆盖图标 + 文字完整行
- 选中时 `.bo-nav-icon` 同步 accent 色，与标签一致

---

## 6. 分组标题修复说明

- `.bo-nav-group-title`：11px、低饱和 `--text-muted`、字间距 0.06em
- 组间距 `margin-bottom: 22px`，末组留白 8px
- 标题 `padding: 0 14px 10px`，与导航项左对齐
- 滚动发生在 `.bo-sidebar-nav` 内，分组标题随内容滚动，不被滚动条单独遮挡

---

## 7. 修改文件清单

| 文件 | 变更 |
|------|------|
| `apps/admin/shared/backoffice-shell.js` | `renderSidebar` 新结构；商家导航图标字调整 |
| `apps/admin/shared/backoffice.css` | flex 导航、图标/标签类、sidebar 滚动区、商家 `--sidebar-w: 280px`、响应式修正 |
| `docs/ui_implementation/MERCHANT_ADMIN_SIDEBAR_NAV_FIX_V1.md` | 本文档 |

**未修改：** `page-boot.js`、`redemption-store.js`、各 `merchant_*/index.html`（侧栏由 shell 注入）

---

## 8. 不改动项

- Runtime 数据结构
- 业务接口与权限逻辑
- 后台架构与页面路由
- 主内容区布局
- 园区后台 / 超管后台专项改版
- 折叠菜单 / 大图标资源

---

## 9. 验收页面清单

1. `merchant_dashboard/index.html`
2. `merchant_coupons/index.html`
3. `merchant_scan/index.html`
4. `merchant_redemptions/index.html`
5. `merchant_finance/index.html`
6. `merchant_tickets/index.html`
7. `merchant_help/index.html`
8. `merchant_account/index.html`
9. `merchant_staff/index.html`

**检查点：** 每项一行、图标 20px 居中、文字不换行、选中整行高亮、滚动不裁切文字。

---

## 10. 验收标记

```
MERCHANT_ADMIN_SIDEBAR_NAV_FIX_V1_CREATED = YES
MERCHANT_ADMIN_SIDEBAR_NAV_ALIGNED = YES
MERCHANT_ADMIN_NAV_ICON_WIDTH_UNIFIED = YES
MERCHANT_ADMIN_NAV_LABEL_NO_WRAP = YES
MERCHANT_ADMIN_NAV_ACTIVE_STATE_OK = YES
DO_NOT_CHANGE_RUNTIME_DATA = CONFIRMED
DO_NOT_REBUILD_PRODUCT_LOGIC = CONFIRMED
READY_FOR_MERCHANT_ADMIN_BROWSER_REVIEW_CONTINUE = YES
```

---

*文档版本：V1 · 2026-06-16 · 对应任务 MERCHANT_ADMIN_SIDEBAR_NAV_FIX_V1*
